// Dose de base (V-DOSE §3.2, V-TEMPS §3.3) puis plafonds de sécurité (appliquerPlafonds, V-PRIO §6.0 : P-CAP, P-GROS).
import {
  D4_FICHE_DOSE, D_CLASS, DOSE, doseLimitOf, MAIN_EXERCISE_SLOTS, PILLAR_CHARGED_MAX_SETS, FINE_LOAD_TAGS, FIXED_DOSE, FIXED_LOAD_TAGS, HOLD_RANGE, PAIN_MIN_REPS, PREGNANCY, PREGNANCY_MAX_HOLD_SEC, REPS_FLOOR, REPS_TABLE,
  RIR1_ONLY_TAGS, SAFE_LOAD_TAGS, SALLE_HOME_SUFFIX, TECHNICAL_CAP_FICHES, TECHNICAL_MAX_REPS, TECHNICAL_NO_LOW_FICHES, TEMPS, TEMPS_RIR_PLACEHOLDER,
  TRACTION_FICHES, TRACTION_RULE, CHARGEABLE_TAGS,
} from './config';
import { carriesLoad, isChargeable, isUnilateral, type Ctx } from './context';
import { coreFamilyOf, coreRule } from './core';
import { doseRoleOf, repsGoalOf, variantClass } from './reps';
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
    // [kine] R-REPS §5 : gainage dans la fourchette du niveau ; la durée de TEMPS, plus courte, l'emporte (aucun allongement).
    const hold = row.holdSec === undefined ? null : c.fiche.schema === 'gainage' ? Math.min(row.holdSec, HOLD_RANGE[ctx.level][1]) : row.holdSec;
    return {
      sets: temps.sets,
      repsMin: row.reps?.[0] ?? 0,
      repsMax: row.reps?.[1] ?? 0,
      holdSec: hold,
      unit,
      restSec: temps.restSec,
      rirTarget: TEMPS_RIR_PLACEHOLDER,
      rirAsked: false,
      role,
    } as const;
  }
  const t = tableDose(c, slot, ctx, unilateral);
  return {
    sets: t.sets,
    repsMin: t.reps[0],
    repsMax: t.reps[1],
    holdSec: null,
    unit: 'reps' as const,
    restSec: t.restSec,
    rirTarget: t.rir,
    rirAsked: true,
    role,
    setsCap: t.setsCap,
  };
}

const clamp = (x: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, x));
/** Relève le bas d'une fourchette (douleur, `noHeavyReps`) : [min, max(haut, min + 4)]. */
const raiseLow = (r: [number, number], min: number): [number, number] => (r[0] >= min ? r : [min, Math.max(r[1], min + 4)]);

/**
 * R-REPS (knowledge/repetitions-regles.md §3-§6) : table rôle x objectif x niveau (variante réglable) ou classe D1-D4 (variante non
 * réglable), puis règles du kiné qui ne font que durcir. DOSE_LIMITS, le tronc et P-GROS passent ensuite (buildExercise).
 */
export function tableDose(c: Candidate, slot: SlotKey, ctx: Ctx, unilateral: boolean) {
  const f = c.fiche;
  const v = c.variant;
  // D32 : variante limitée par sa fiche (haltères légers) : jamais la dose « pilier lourd » (ligne accessoire).
  const light = doseLimitOf(f.id, v.id).noHeavyReps === true;
  const role0 = doseRoleOf(slot, f);
  const role = light && role0 === 'pilier_lourd' ? 'accessoire' : role0;
  const r = REPS_TABLE[role][repsGoalOf(ctx, role)]![ctx.level];
  const k = variantClass(f, v);
  const deb = ctx.level === 'debutant';
  let sets = r.sets;
  let reps: [number, number] = [...r.reps];
  let restSec = r.restSec;
  let rir = r.rir;
  let setsCap: number | undefined;
  if (k !== null) {
    // §4 : la fourchette vient de la classe ; séries et réserve du rôle, jamais au-delà des bornes de la classe.
    const d = D_CLASS[k];
    // Isolation (une articulation : tirage au visage aux sangles, oiseau sans charge…) : la fourchette de l'isolation reste, sauf D4.
    if (role !== 'isolation' || k === 4) reps = [...(deb && d.repsDebutant ? d.repsDebutant : d.reps)];
    setsCap = deb ? d.maxSetsDebutant : d.maxSets;
    sets = Math.min(sets, setsCap);
    restSec = clamp(restSec, d.restMinSec, d.restMaxSec);
    rir = Math.max(rir, deb ? d.minRirDebutant : d.minRir);
    // D4 avec une dose propre (décision de l'utilisateur, D4_FICHE_DOSE) : remplace la ligne D4, réserve jamais plus basse.
    const own = k === 4 ? D4_FICHE_DOSE[f.id] : undefined;
    if (own) {
      reps = [...own.reps];
      setsCap = own.maxSets;
      sets = Math.min(r.sets, setsCap);
      rir = Math.max(rir, own.minRir);
    }
  }
  // Décision du chef de projet (contrôle relecteur 05/11/2026) : pilier chargé (emplacement principal, variante réglable) : 3 séries au plus,
  // même avec le « +1 série » de V-VOL (maxSetsPerExercise = 4 reste pour les autres cas).
  if (k === null && MAIN_EXERCISE_SLOTS.includes(slot)) setsCap = Math.min(setsCap ?? Infinity, PILLAR_CHARGED_MAX_SETS);
  const traction = TRACTION_FICHES.includes(f.id);
  // §3 : réserve 1 de l'avancé (DOSE.rirSafeVariants) seulement sur machine ou poulie, sans charge libre ni gilet, jamais en traction.
  const safe = DOSE[ctx.family][ctx.level].rirSafeVariants;
  if (safe !== undefined && !ctx.pregnant && k === null && !traction && v.tags.some((t) => RIR1_ONLY_TAGS.includes(t))) {
    const freeWeight = v.tags.some((t) => (CHARGEABLE_TAGS.includes(t) || FIXED_LOAD_TAGS.includes(t)) && !SAFE_LOAD_TAGS.includes(t));
    if (!freeWeight) rir = Math.min(rir, safe);
  }
  // [kine] §6 : douleur ou gêne déclarée sur une zone de la fiche : aucune fourchette <= 6 répétitions. D32 noHeavyReps : idem.
  const pain = ctx.zones.some((z) => !z.isG && z.level >= 1 && !!f.securite.zones[z.key]);
  if (pain || light) reps = raiseLow(reps, PAIN_MIN_REPS);
  // [kine] §3 : fiches techniques jamais <= 5 ; débutant jamais <= 5 ; §5 : unilatéral >= 6 par côté (débutant chargé >= 8), sauf D4.
  let floor = 0;
  if (TECHNICAL_NO_LOW_FICHES.includes(f.id)) floor = REPS_FLOOR.technical;
  // [kine] §3 : <= 5 répétitions seulement à charge réglable finement (barre, haltères, machine…), pas à l'élastique ni au sac.
  // Le poids du corps seul garde la classe (D3 5-10, D4 2-5) ; le gilet lesté et le sac de sable (charge fixe) non.
  const fixedLoad = carriesLoad(v) || v.tags.includes('sac_de_sable');
  if ((k === null || fixedLoad) && !v.tags.some((t) => FINE_LOAD_TAGS.includes(t))) floor = Math.max(floor, REPS_FLOOR.technical);
  if (deb) floor = Math.max(floor, REPS_FLOOR.debutant);
  if (unilateral && k !== 4) floor = Math.max(floor, deb && isChargeable(v) ? REPS_FLOOR.unilateralChargedDebutant : REPS_FLOOR.unilateral);
  if (reps[0] < floor) reps = [floor, Math.max(reps[1], floor)];
  // [kine] §3 : mouvements techniques à barre : au plus 12 répétitions (fatigue de la forme).
  if (TECHNICAL_CAP_FICHES.includes(f.id)) reps = [Math.min(reps[0], TECHNICAL_MAX_REPS), Math.min(reps[1], TECHNICAL_MAX_REPS)];
  // [kine] §8.6 : traction : réserve >= 2, 3 séries au plus, 5-10 répétitions.
  if (traction) {
    rir = Math.max(rir, TRACTION_RULE.minRir);
    setsCap = Math.min(setsCap ?? Infinity, TRACTION_RULE.maxSets);
    sets = Math.min(sets, setsCap);
    const hi = Math.min(reps[1], TRACTION_RULE.reps[1]);
    reps = [Math.min(Math.max(reps[0], TRACTION_RULE.reps[0]), hi), hi];
  }
  return { sets, reps, restSec, rir, setsCap, role, dClass: k };
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
    // [kine] R-REPS §5 : gainage et portés à 20 s au plus par série.
    if (out.unit === 'sec' && out.holdSec !== null) out.holdSec = Math.min(out.holdSec, PREGNANCY_MAX_HOLD_SEC);
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
  // R-REPS : séries au plus de la classe D1-D4 / de la traction, respectées aussi par V-VOL (index.ts).
  if ('setsCap' in b && b.setsCap !== undefined) ex.setsCap = Math.min(b.setsCap, lim.maxSets ?? Infinity);
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
