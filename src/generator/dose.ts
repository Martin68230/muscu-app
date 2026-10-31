// Dose de base (V-DOSE §3.2, V-TEMPS §3.3) puis plafonds de sécurité (appliquerPlafonds, V-PRIO §6.0 : P-CAP, P-GROS).
import { DOSE, doseLimitOf, FIXED_DOSE, FIXED_LOAD_TAGS, PREGNANCY, SAFE_LOAD_TAGS, SALLE_HOME_SUFFIX, TEMPS, TEMPS_RIR_PLACEHOLDER, CHARGEABLE_TAGS } from './config';
import { isChargeable, isUnilateral, type Ctx } from './context';
import { coreFamilyOf, coreRule } from './core';
import { caseFor, cappingZones, salleHomeFallback, type Candidate } from './safety';
import { PILLAR_SLOTS } from './slots';
import type { ExerciseRole, GenExercise, SlotKey, Tier } from './types';

export function roleOf(slot: SlotKey): ExerciseRole {
  if (PILLAR_SLOTS.includes(slot)) return 'pilier';
  if (slot === 'tronc') return 'tronc';
  if (slot === 'fonctionnel') return 'fonctionnel';
  return 'autre';
}

/** Charge de départ (V-ETAL §5.2, P-CAP §6.8 point 1e). */
export function startLoad(c: Candidate, ctx: Ctx): number | null {
  const v = c.variant;
  if (!isChargeable(v)) return null;
  const h = ctx.history.get(v.id);
  if (h) return h.lastPainFreeLoadKg; // dernière charge faite sans douleur, sans hausse
  const lightest = v.tags.includes('halteres') ? ctx.dumbbells[0] ?? null : v.tags.includes('kettlebell') ? ctx.kettlebells[0] ?? null : null;
  const underCap = c.capped || ctx.pregnant;
  if (!underCap && ctx.level !== 'debutant') {
    const declared = ctx.habitual[v.id] ?? ctx.habitual[c.fiche.id];
    if (declared !== undefined) return declared;
  }
  return lightest;
}

/** Dose de base d'un exercice placé (avant plafonds). */
function baseDose(c: Candidate, slot: SlotKey, ctx: Ctx) {
  const v = c.variant;
  const role = roleOf(slot);
  const unilateral = isUnilateral(v);
  const fixed = FIXED_DOSE[c.fiche.id];
  if (fixed) {
    // N4 / Q23 : lancers et gainage dynamique. Plafond fixe, pas de réserve demandée (jamais d'échec).
    return {
      sets: fixed.sets,
      repsMin: fixed.reps[0],
      repsMax: fixed.reps[1],
      holdSec: null,
      unit: fixed.unit,
      restSec: fixed.restSec,
      rirTarget: TEMPS_RIR_PLACEHOLDER,
      rirAsked: false,
      role,
    } as const;
  }
  const temps = TEMPS[c.fiche.schema];
  if (temps) {
    const row = ctx.level === 'debutant' ? temps.debutant : temps.autres;
    const unit = temps.unit === 'reps' && unilateral ? 'reps_par_cote' : temps.unit;
    return {
      sets: temps.sets,
      repsMin: row.reps?.[0] ?? 0,
      repsMax: row.reps?.[1] ?? 0,
      holdSec: row.holdSec ?? null,
      unit,
      restSec: temps.restSec,
      rirTarget: TEMPS_RIR_PLACEHOLDER,
      rirAsked: false,
      role,
    } as const;
  }
  const d = DOSE[ctx.family][ctx.level];
  const charge = isChargeable(v);
  // D32 : variante limitée par sa fiche (haltères légers) : jamais la dose « pilier lourd » (répétitions et repos des « autres »).
  const light = doseLimitOf(c.fiche.id, v.id).noHeavyReps === true;
  const pilier = role === 'pilier';
  const heavy = pilier && !!d.repsChargePilier && !light;
  const reps = charge ? (heavy ? d.repsChargePilier! : d.repsCharge) : d.repsBodyweight;
  let rir = d.rir;
  if (d.rirSafeVariants !== undefined) {
    // Le gilet lesté (charge fixe, contrôle du lot 09, sérieux n° 4) garde la réserve des charges libres, jamais la réserve 1.
    const freeWeight = v.tags.some((t) => (CHARGEABLE_TAGS.includes(t) || FIXED_LOAD_TAGS.includes(t)) && !SAFE_LOAD_TAGS.includes(t));
    if (!freeWeight) rir = d.rirSafeVariants;
  }
  return {
    sets: pilier ? d.setsPilier : d.setsAutre,
    repsMin: reps[0],
    repsMax: reps[1],
    holdSec: null,
    unit: 'reps' as const,
    restSec: pilier && !(light && d.repsChargePilier) ? d.restPilierSec : d.restAutreSec,
    rirTarget: rir,
    rirAsked: true,
    role,
  };
}

/** Plafonds (V-PRIO point 3) : ne font que baisser ou bloquer. */
export function appliquerPlafonds(ex: GenExercise, ctx: Ctx): GenExercise {
  const out = { ...ex };
  if (ctx.pregnant) {
    // P-GROS : répétitions 10-15, réserve >= 3, 1 série (débutante ou niveau absent) ou 2, capped.
    if (out.unit === 'reps' && out.rirAsked) [out.repsMin, out.repsMax] = PREGNANCY.reps;
    out.rirTarget = Math.max(out.rirTarget, PREGNANCY.minRir);
    const maxSets = ctx.level === 'debutant' ? PREGNANCY.setsDebutant : PREGNANCY.setsOther;
    out.sets = Math.min(out.sets, maxSets);
    out.capped = true;
  }
  // P-CAP : rien à baisser dans la dose de base ; le drapeau bloque toute hausse (V-VOL, étalonnage, E3 à ~75 %).
  return out;
}

export function buildExercise(c: Candidate, slot: SlotKey, tier: Tier, ctx: Ctx): GenExercise {
  const b = baseDose(c, slot, ctx);
  const capZones = cappingZones(c.fiche, ctx);
  const ex: GenExercise = {
    movementId: c.fiche.id,
    variantId: c.variant.id,
    ficheId: c.fiche.id,
    nom: c.fiche.nom,
    // D33 (PV3-SALLE-1) : variante « maison » placée en salle par l'exception de pénurie : ligne « (à la maison) ».
    variantNom: salleHomeFallback(c.variant, ctx) ? `${c.variant.nom}${SALLE_HOME_SUFFIX}` : c.variant.nom,
    echelon: c.variant.echelon,
    schema: c.fiche.schema,
    slot,
    role: b.role,
    sets: b.sets,
    repsMin: b.repsMin,
    repsMax: b.repsMax,
    holdSec: b.holdSec,
    unit: b.unit,
    restSec: b.restSec,
    rirTarget: b.rirTarget,
    rirAsked: b.rirAsked,
    supersetGroup: null,
    warmupSets: [],
    startLoadKg: null,
    capped: c.capped || ctx.pregnant,
    adaptation: c.adaptations[0] ?? null,
    adaptations: c.adaptations,
    notes: c.notes,
    substitut: tier === 'c' || tier === 'd',
    replaces: c.replaces,
    tier,
    chargeable: isChargeable(c.variant),
    unilateral: isUnilateral(c.variant),
    isCalibration: !ctx.history.has(c.variant.id),
    musclesPrincipaux: c.fiche.musclesPrincipaux,
    musclesSecondaires: c.fiche.musclesSecondaires,
    cappedLabel: capZones.length ? `Charge maintenue : gêne ${capZones.join(', ')}` : ctx.pregnant ? 'Charge maintenue : grossesse ou post-partum' : null,
    tags: c.variant.tags,
    coreFamily: coreFamilyOf(c.fiche),
    niveau: c.variant.niveau,
    backLoaded: !!c.fiche.securite.zones.dos && caseFor(c.fiche, { key: 'dos', level: 1, isG: false }).action !== 'garder',
  };
  // D26 (CORE-SEC-3) : plafonds de la table dos par famille (maintien, répétitions par côté, capped) : ne font que baisser.
  const core = coreRule(c.fiche, ctx);
  if (core) {
    if (core.capped) ex.capped = true;
    if (core.maxHoldSec !== null && ex.holdSec !== null) ex.holdSec = Math.min(ex.holdSec, core.maxHoldSec);
    if (core.maxRepsPerSide !== null && ex.unit === 'reps_par_cote') {
      ex.repsMax = Math.min(ex.repsMax, core.maxRepsPerSide);
      ex.repsMin = Math.min(ex.repsMin, ex.repsMax);
    }
    if (ex.capped && !ex.cappedLabel) ex.cappedLabel = 'Charge maintenue : gêne dos';
  }
  // D32 : limites de dose écrites dans la fiche (réserve minimale, séries au plus) et surfaces instables : ne font que baisser.
  const lim = doseLimitOf(c.fiche.id, c.variant.id, c.variant.tags);
  if (lim.minRir !== undefined && ex.rirAsked) ex.rirTarget = Math.max(ex.rirTarget, lim.minRir);
  if (lim.maxSets !== undefined) ex.sets = Math.min(ex.sets, lim.maxSets);
  const capped = appliquerPlafonds(ex, ctx);
  if (FIXED_DOSE[c.fiche.id]) {
    // N4 : jamais de charge à progresser pour ces fiches, même si une variante portait un jour un tag chargeable.
    capped.chargeable = false;
    capped.startLoadKg = null;
    return capped;
  }
  capped.startLoadKg = startLoad({ ...c, capped: capped.capped }, ctx);
  return capped;
}
