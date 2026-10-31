// D30 / D31 : sauts (cardio-regles.md §5.1, §5.2, §5.2bis R-PLIO), course (§5.3), extérieur (§5.4) et verrous de « Créer une séance »
// (§5.1 (6ter), écran D28 non codé : fonctions pures prêtes). Toutes les valeurs viennent de config.ts (JUMPS, RUN, IMPACT, PLIO_COMPOSE,
// IMPACT_EXCLUDED_ZONES, JUMP_MOVEMENTS) avec leur statut. Aucune fiche n'est inventée : un mouvement sans fiche est « non disponible ».
import type { Level } from '../data/model';
import { itemNom, FICHES_NON_DISPONIBLES, IMPACT, IMPACT_EXCLUDED_ZONES, JUMP_MOVEMENTS, JUMPS, OUTDOOR_RUN_REQUIRES, PLIO_COMPOSE, RUN, type JumpMovement } from './config';
import { levelIdx, type Ctx } from './context';
import { allowedVariants, caseFor, ficheAdmissible, USABLE_STATUTS } from './safety';
import type { Fiche, JumpBlock, JumpItem } from './types';

const DAY_MS = 24 * 3600 * 1000;
const H_MS = 3600 * 1000;

// ----- Exclusions communes (5.1) -----
export type ImpactBlock = 'grossesse' | 'zone' | 'reprise' | null;
/** 5.1 (1), (2), (3) : grossesse / post-partum, zone genou / cheville / dos / hanche / cuisse / aine à tout niveau, reprise. */
export function impactExclusion(c: { pregnant: boolean; zones: readonly { key: string; level: number; isG: boolean }[]; repriseActive?: boolean }): ImpactBlock {
  if (c.pregnant) return 'grossesse';
  if (c.zones.some((z) => !z.isG && z.level >= 1 && IMPACT_EXCLUDED_ZONES.includes(z.key))) return 'zone';
  if (c.repriseActive) return 'reprise';
  return null;
}

/** Variante sûre pour ce profil (statut, matériel, niveau de la variante, lignes de zone et Grossesse), sans filtre d'échelon. */
export function variantSafe(f: Fiche | undefined, ctx: Ctx, variantId: string): boolean {
  if (!f || !USABLE_STATUTS.includes(f.statut) || FICHES_NON_DISPONIBLES.includes(variantId)) return false;
  if (!ficheAdmissible(f, ctx, { warmup: true })) return false;
  for (const e of ctx.zones) {
    const c = caseFor(f, e);
    if (c.action === 'retirer') return false;
    if (c.variante && c.variante !== variantId) return false;
  }
  return allowedVariants(f, ctx, { only: new Set([variantId]) }).some((v) => v.id === variantId);
}

// ----- Sauts (5.2) -----
export interface JumpChoice {
  movement: JumpMovement;
  /** Variante avec saut sûre pour ce profil, ou null (non disponible, niveau, zone, épaule / poignet 2-3). */
  jump: { ficheId: string; variantId: string; nom: string } | null;
  soft: { ficheId: string; variantId: string; nom: string } | null;
}

/**
 * 5.2 : mouvements possibles pour ce profil, dans l'ordre du tableau. Avec saut : niveau du tableau ET de la variante de fiche (le plus
 * restrictif), fiche existante et sûre, jamais si épaule ou poignet au niveau 2-3 pour la corde et les jumping jacks. Version douce :
 * fiche existante et sûre. Un mouvement sans aucune des deux est omis (non disponible). Au plus 3 mouvements (5.2bis condition 5).
 */
export function jumpChoices(ctx: Ctx): JumpChoice[] {
  const sw23 = ctx.zones.some((z) => !z.isG && z.level >= 2 && (z.key === 'epaule' || z.key === 'poignet'));
  const named = (variantId: string | null) => {
    if (!variantId) return null;
    const f = ctx.variantOwner.get(variantId);
    if (!f || !variantSafe(f, ctx, variantId)) return null;
    const v = f.variantes.find((x) => x.id === variantId)!;
    return { ficheId: f.id, variantId, nom: itemNom(f.nom, v) };
  };
  const out: JumpChoice[] = [];
  for (const m of JUMP_MOVEMENTS) {
    const jumpOk = !!m.jumpVariant && levelIdx(m.minLevel) <= ctx.levelI && !(m.noShoulderWrist23 && sw23);
    const jump = jumpOk ? named(m.jumpVariant) : null;
    const soft = named(m.softVariant);
    if (!jump && !soft) continue;
    out.push({ movement: m, jump, soft });
  }
  // Mouvements avec une version avec saut d'abord (ordre du tableau gardé), puis versions douces seules ; 3 au plus.
  return [...out.filter((c) => c.jump), ...out.filter((c) => !c.jump)].slice(0, JUMPS.maxExercises);
}

/** 5.2 : contacts de la semaine w (1 à 4) : départ du niveau, +5 par semaine au plus (si `progress`), plafond, semaine 4 allégée (-30 %). */
export function jumpContacts(level: Level, week: number, progress: boolean): number {
  const start = JUMPS.startContacts[level];
  const cap = JUMPS.capContacts[level];
  const at = (w: number) => Math.min(cap, start + (progress ? JUMPS.weeklyStep * (w - 1) : 0));
  if (week === 4) return Math.floor(at(3) * JUMPS.recoveryFactor);
  return at(week);
}

/**
 * Bloc de sauts d'une séance dédiée : contacts (échauffement compris : 10 petits rebonds au plus), séries de 10 réparties à tour de
 * rôle sur les mouvements, repos 60 s. Débutant : version douce prévue (aucun contact), version avec saut jamais imposée (5.2). Contacts
 * jamais au-dessus du plafond du niveau. `soft` force la version douce (5.1 (5) : jambes lourdes déclarées, placement impossible).
 */
export function composeJumpBlock(ctx: Ctx, choices: readonly JumpChoice[], contacts: number, forceSoft = false): JumpBlock | null {
  if (!choices.length) return null;
  const level = ctx.level;
  const total = Math.min(contacts, JUMPS.capContacts[level]);
  const items: JumpItem[] = choices
    .map((c) => {
      const useSoft = forceSoft || level === 'debutant' || !c.jump;
      const v = useSoft ? c.soft : c.jump;
      if (!v) return null;
      return {
        variantId: v.variantId, ficheId: v.ficheId, nom: v.nom, softVariantId: c.soft?.variantId ?? null, softNom: c.soft?.nom ?? null,
        soft: useSoft, sets: 0, reps: JUMPS.seriesReps, restSec: JUMPS.restSec,
      } as JumpItem;
    })
    .filter((x): x is JumpItem => !!x);
  if (!items.length) return null;
  let budget = total - JUMPS.warmupBounces;
  for (let i = 0; budget >= JUMPS.seriesReps; i = (i + 1) % items.length) {
    items[i].sets++;
    budget -= JUMPS.seriesReps;
  }
  const kept = items.filter((x) => x.sets > 0);
  const jumping = kept.filter((x) => !x.soft).reduce((a, x) => a + x.sets * x.reps, 0);
  return { items: kept, contacts: jumping ? jumping + JUMPS.warmupBounces : 0, capContacts: JUMPS.capContacts[level], warmupMin: JUMPS.warmupMin };
}

/** Durée (min) d'un bloc de sauts : séries de ~8 s, 60 s de repos entre séries, 1 min pour T8 et les transitions (5.2bis, cas test). */
export function plioBlockMin(series: number): number {
  if (series <= 0) return 0;
  return Math.ceil((series * PLIO_COMPOSE.jumpSeriesSec + (series - 1) * PLIO_COMPOSE.jumpRestSec) / 60) + PLIO_COMPOSE.jumpTransitionsMin;
}

/**
 * Placement dans la semaine type (jours 0-6, circulaire) d'une séance avec sauts d'un programme généré (5.1 (5), 3.2bis Placement) :
 * pas un jour de jambes lourdes, ni le lendemain, ni le surlendemain (48 h et deux jours calendaires) ; la veille : interdite au
 * débutant seulement (5.1 (5) (c), confirmé par `kine`) ; aucun autre jour d'impact la veille ou le lendemain (6bis).
 */
export function jumpDayAllowed(d: number, heavyDays: ReadonlySet<number>, level: Level, impactDays: ReadonlySet<number> = new Set()): boolean {
  const at = (k: number) => (d + k + 7) % 7;
  if (heavyDays.has(d) || heavyDays.has(at(-1)) || heavyDays.has(at(-2))) return false;
  if (level === 'debutant' && heavyDays.has(at(1))) return false;
  return !impactDays.has(at(-1)) && !impactDays.has(at(1));
}

/** Jours calendaires complets entre deux instants (heure locale). */
export function fullDaysBetween(aMs: number, bMs: number): number {
  const day = (t: number) => {
    const x = new Date(t);
    return Math.floor(Date.UTC(x.getFullYear(), x.getMonth(), x.getDate()) / DAY_MS);
  };
  return day(bMs) - day(aMs) - 1;
}

/** 5.1 (5) (`kine`) : sauts permis après une séance à jambes lourdes seulement après 48 h ET deux jours calendaires complets. */
export function jumpsAllowedAfterHeavyLegs(heavyEndMs: number | null, nowMs: number): boolean {
  if (heavyEndMs === null) return true;
  return nowMs - heavyEndMs >= JUMPS.heavyLegsGapHours * H_MS && fullDaysBetween(heavyEndMs, nowMs) >= JUMPS.heavyLegsGapDays;
}

// ----- Course (5.3) -----
/** Corps d'un palier (min de course + marche), sans l'échauffement ni le retour au calme. */
export function runStageBodyMin(stage: number): number {
  const s = RUN.stages[stage - 1];
  return s.reps * (s.run + s.walk) + s.lastRun + (s.reps === 0 ? s.run : 0);
}
/** Temps de course total d'un palier (min). */
export function runStageRunMin(stage: number): number {
  const s = RUN.stages[stage - 1];
  return s.reps === 0 ? s.run : s.reps * s.run + s.lastRun;
}
/** Plus longue plage de course continue d'un palier (min). */
export function runStageLongest(stage: number): number {
  const s = RUN.stages[stage - 1];
  return Math.max(s.run, s.lastRun);
}
/** Durée d'une sortie (calcul de `coach`, 5.3). */
export const runSortieMin = (stage: number): number => RUN.sortieMin[stage - 1];

export interface Walk { endMs: number; min: number; pain: boolean }
/**
 * Palier 0 : 2 semaines (de 7 jours, comptées en arrière depuis la dernière marche) avec au moins 2 marches rapides de 20 min sans douleur
 * chacune, les 2 dernières d'au moins 29 min. Une marche avec douleur dans la période annule (lecture prudente).
 */
export function palier0Done(walks: readonly Walk[]): boolean {
  const ok = [...walks].sort((a, b) => a.endMs - b.endMs);
  if (ok.length < RUN.palier0.perWeek * RUN.palier0.weeks) return false;
  const last = ok[ok.length - 1].endMs;
  const inWeek = (k: number) => ok.filter((w) => last - w.endMs < (k + 1) * 7 * DAY_MS && last - w.endMs >= k * 7 * DAY_MS);
  for (let k = 0; k < RUN.palier0.weeks; k++) {
    const wk = inWeek(k);
    if (wk.some((w) => w.pain)) return false;
    if (wk.filter((w) => w.min >= RUN.palier0.minMin).length < RUN.palier0.perWeek) return false;
  }
  return ok.slice(-2).every((w) => w.min >= RUN.palier0.lastTwoMin && !w.pain);
}

export interface Outing { stage: number; pain: boolean; t1: boolean; easy: boolean; endMs: number }
/**
 * Passage au palier suivant : 2 sorties du palier en cours terminées sans douleur ni signe T1, effort resté facile ; au plus un palier
 * validé par semaine calendaire (7 jours glissants depuis le dernier passage, lecture prudente) ; jamais au-delà du palier 12.
 */
export function nextRunStage(stage: number, outings: readonly Outing[], lastAdvanceMs: number | null, nowMs: number): number {
  if (stage >= RUN.stages.length) return stage;
  if (lastAdvanceMs !== null && nowMs - lastAdvanceMs < 7 * DAY_MS) return stage;
  const at = outings.filter((o) => o.stage === stage && (lastAdvanceMs === null || o.endMs > lastAdvanceMs));
  if (at.some((o) => o.pain || o.t1)) return stage;
  return at.filter((o) => o.easy).length >= RUN.passAfterOutings ? stage + 1 : stage;
}

/** Pause : plus de 2 semaines = marche seulement pendant la reprise, puis 2 paliers plus bas ; plus de 12 semaines = palier 0 refait. */
export function runAfterPause(stage: number, pauseWeeks: number): { walkOnly: boolean; stage: number; redoPalier0: boolean } {
  if (pauseWeeks <= RUN.pause.weeks) return { walkOnly: false, stage, redoPalier0: false };
  if (pauseWeeks > RUN.pause.redoPalier0Weeks) return { walkOnly: true, stage: 1, redoPalier0: true };
  return { walkOnly: true, stage: Math.max(1, stage - RUN.pause.stagesDown), redoPalier0: false };
}

/** Sortie de course ou marche : si D est plus courte que la sortie du palier, marche rapide continue de la durée D (jamais raccourcie). */
export function runOrWalk(stage: number, dMin: number): { kind: 'course' | 'marche'; min: number } {
  const s = runSortieMin(stage);
  return dMin >= s ? { kind: 'course', min: s } : { kind: 'marche', min: dMin };
}

/** Placement d'une course (classée soutenue) : ni le jour, ni la veille, ni le lendemain de jambes lourdes ; pas d'impact ni de séance soutenue adjacente. */
export function runDayAllowed(d: number, heavyDays: ReadonlySet<number>, impactOrHardDays: ReadonlySet<number> = new Set()): boolean {
  const at = (k: number) => (d + k + 7) % 7;
  if (heavyDays.has(d) || heavyDays.has(at(-1)) || heavyDays.has(at(1))) return false;
  return !impactOrHardDays.has(at(-1)) && !impactOrHardDays.has(at(1));
}

/** Version sur place (5.3) : format fixe, sans palier : 10 x (30 s de foulées / 60 s de marche), 5 min de course cumulées. */
export const onSpotRunSec = (): number => RUN.onSpot.reps * RUN.onSpot.runSec;

/**
 * Proposition de course par le générateur : aucune fiche de course n'existe (vague 2) : jamais proposée. Le jour où une fiche existera,
 * les conditions (5.1, palier 0, placement, fréquence) s'appliqueront avant toute proposition.
 */
export function runFicheAvailable(fiches: readonly Fiche[]): boolean {
  return fiches.some((f) => f.schema === 'course' && USABLE_STATUTS.includes(f.statut));
}

// ----- Extérieur (5.4) -----
/** La course dehors n'est proposée que si Wake Lock actif, son débloqué par un appui et repli « arrête-toi pour regarder » sont tous présents. */
export function outdoorRunAllowed(s: { wakeLock: boolean; sound: boolean; lookFallback: boolean }): boolean {
  return OUTDOOR_RUN_REQUIRES.every((k) => s[k]);
}

// ----- R-PLIO (5.2bis) et cas test D28 -----
export interface StrengthBlockItem { sets: number; reps: number; unilateral: boolean }
/** Durée (min) de la force lente après les sauts : répétition 4 s, changement de jambe 5 s, repos 60 s, 1 min d'installation (5.2bis). */
export function strengthBlockMin(items: readonly StrengthBlockItem[]): number {
  const series = items.flatMap((it) => Array.from({ length: it.sets }, () => (it.unilateral ? it.reps * PLIO_COMPOSE.repSec * 2 + PLIO_COMPOSE.sideSwitchSec : it.reps * PLIO_COMPOSE.repSec)));
  if (!series.length) return 0;
  const sec = series.reduce((a, x) => a + x, 0) + (series.length - 1) * PLIO_COMPOSE.strengthRestSec;
  return Math.ceil(sec / 60) + PLIO_COMPOSE.setupMin;
}

export interface PlioJump { key: string; sets: number; reps: number }
export interface PlioComposition {
  warmupMin: number;
  jumpsMin: number;
  strengthMin: number;
  cooldownMin: number;
  totalMin: number;
  contacts: number;
  /** Ordre fixé par le générateur : échauffement, sauts, force, retour au calme (jamais de saut après une série de jambes). */
  order: readonly ['echauffement', 'sauts', 'force', 'retour_au_calme'];
  fits: boolean;
  /** Raisons de refus (contacts au-dessus du plafond, trop d'exercices, unilatéral pour un débutant…). */
  errors: string[];
}
/**
 * Composition « pliométrie en tête + force lente » (5.2bis) : échauffement 5 min (7 si D > 45), sauts (séries de 5 à 8, 3 exercices au
 * plus, contacts échauffement compris sous le plafond du niveau), force lente (unilatéral : intermédiaire et avancé seulement), retour au
 * calme 3 min. Fonction pure, prête pour « Créer une séance » (D28) ; ne lit aucune fiche.
 */
export function composePlioStrength(level: Level, dMin: number, jumps: readonly PlioJump[], strength: readonly StrengthBlockItem[]): PlioComposition {
  const errors: string[] = [];
  const warmupMin = dMin > 45 ? JUMPS.warmupMinLong : JUMPS.warmupMin;
  const series = jumps.reduce((a, j) => a + j.sets, 0);
  const contacts = JUMPS.warmupBounces + jumps.reduce((a, j) => a + j.sets * j.reps, 0);
  if (jumps.length > JUMPS.maxExercises) errors.push('trop-exercices-sauts');
  if (jumps.some((j) => j.reps < JUMPS.plioSeries[0] || j.reps > JUMPS.plioSeries[1])) errors.push('serie-hors-5-8');
  if (contacts > JUMPS.capContacts[level]) errors.push('contacts-au-dessus-du-plafond');
  if (level === 'debutant' && strength.some((s) => s.unilateral)) errors.push('unilateral-debutant');
  const jumpsMin = plioBlockMin(series);
  const strengthMin = strengthBlockMin(strength);
  const totalMin = warmupMin + jumpsMin + strengthMin + PLIO_COMPOSE.cooldownMin;
  return {
    warmupMin, jumpsMin, strengthMin, cooldownMin: PLIO_COMPOSE.cooldownMin, totalMin, contacts,
    order: ['echauffement', 'sauts', 'force', 'retour_au_calme'], fits: totalMin <= dMin && !errors.length, errors,
  };
}

// ----- « Créer une séance » (5.1 (6ter)) : verrous et avertissements, fonction pure pour D28 -----
export interface CreateRequest { jumps: boolean; run: boolean; legsStrength: boolean }
export interface CreateState {
  level: Level;
  pregnant: boolean;
  zones: readonly { key: string; level: number; isG: boolean }[];
  interruptedToday: boolean;
  /** Fin de la dernière séance à jambes lourdes (ms), ou null. */
  lastHeavyEndMs: number | null;
  lastJumpEndMs: number | null;
  /** Jours (ms de fin) des séances avec impact des 7 derniers jours. */
  impactEndsMs: readonly number[];
  heavyTomorrow: boolean;
  pauseOver2Weeks: boolean;
  nowMs: number;
}
export interface CreateCheck {
  /** Ce qui est refusé (jamais contourné). */
  locks: string[];
  /** Ce qui devient un avertissement (la séance est faite, avec le texte court de 6ter). */
  warnings: string[];
  /** Ordre fixé par le générateur. */
  order: string[];
  /** Contacts de départ si reprise (départ du niveau). */
  startContacts: number | null;
}
export function createSessionCheck(req: CreateRequest, st: CreateState): CreateCheck {
  const locks: string[] = [];
  const warnings: string[] = [];
  const impact = req.jumps || req.run;
  if (impact && st.pregnant) locks.push('grossesse');
  if (impact && st.zones.some((z) => !z.isG && z.level >= 1 && IMPACT_EXCLUDED_ZONES.includes(z.key))) locks.push('zone');
  if (impact && st.interruptedToday) locks.push('seance-interrompue');
  if (req.run && req.legsStrength) locks.push('course-et-jambes-lourdes-meme-jour');
  if (req.run && st.lastHeavyEndMs !== null && fullDaysBetween(st.lastHeavyEndMs, st.nowMs) < 0) locks.push('course-jour-de-jambes-lourdes');
  if (req.jumps && st.lastJumpEndMs !== null && st.nowMs - st.lastJumpEndMs < IMPACT.createMinGapHours * H_MS) locks.push('sauts-moins-de-48h');
  if (impact && st.impactEndsMs.some((t) => fullDaysBetween(t, st.nowMs) === 0)) locks.push('impact-deux-jours-de-suite');
  const week = st.impactEndsMs.filter((t) => st.nowMs - t < 7 * DAY_MS).length;
  if (impact && week >= IMPACT.createMaxPerWeek) locks.push('plus-de-3-impacts-par-semaine');
  if (req.jumps) {
    if (!jumpsAllowedAfterHeavyLegs(st.lastHeavyEndMs, st.nowMs)) warnings.push('jambes-lourdes');
    if (st.lastJumpEndMs !== null && st.nowMs - st.lastJumpEndMs < 7 * DAY_MS) warnings.push('une-seance-de-sauts-par-semaine');
    if (st.lastJumpEndMs !== null && st.nowMs - st.lastJumpEndMs < JUMPS.minGapHoursBetweenJumpSessions * H_MS) warnings.push('moins-de-72h');
    if (st.level === 'debutant' && st.heavyTomorrow) warnings.push('veille-debutant');
  }
  if (impact && st.level === 'debutant' && week >= IMPACT.beginnerMaxPerWeek) warnings.push('debutant-2-impacts');
  if (impact && st.pauseOver2Weeks) warnings.push('reprise');
  return {
    locks, warnings,
    order: req.jumps ? ['echauffement', 'sauts', ...(req.legsStrength ? ['force'] : []), 'retour_au_calme'] : ['echauffement', ...(req.run ? ['course'] : []), ...(req.legsStrength ? ['force'] : []), 'retour_au_calme'],
    startContacts: st.pauseOver2Weeks ? JUMPS.startContacts[st.level] : null,
  };
}
