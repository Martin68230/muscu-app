// Niveau 2, étape 3 (06/11/2026) : rattrapage des zones en fin de semaine. Règle de l'utilisateur : « en fin de semaine réelle (séances
// manquées comprises), toute zone orange ou grise est rattrapée la semaine suivante ». Module PUR : rien n'est stocké, tout se recalcule
// depuis l'historique. Décision (docs/decisions-prises.md) : seulement des séries en plus, appliquées automatiquement à la PREMIÈRE séance
// de la semaine suivante (une seule séance de rattrapage par zone, au plus +1 série par exercice), sous les mêmes contraintes que
// src/generator/zones-check.ts. Dernier recours (07/11/2026) : si une zone reste orange ou grise après les séries en plus, UN seul
// échange d'exercice dans cette séance (swapForZone), avec le classement et les filtres du générateur (rankSlot), sans dose nouvelle.
import type { PlannedExercise, ProgramDay, SetLog } from '../data/model';
import { D_CLASS, doseLimitOf, FIXED_DOSE, TIME, VOLUME } from '../generator/config';
import type { Ctx } from '../generator/context';
import { estimerDuree, type DurExercise, type DurSession } from '../generator/duration';
import { isIsoSlot } from '../generator/isolation';
import { makePlaf, splitCapsOk, weekCapsOk } from '../generator/plaf';
import { variantClass } from '../generator/reps';
import type { Fiche, GenExercise } from '../generator/types';
import { checkZones, excludedZones, SLOTLESS_ZONES, zoneCapsOk } from '../generator/zones-check';
import { MAIN_EXERCISE_SLOTS } from '../generator/config';
import { buildExercise } from '../generator/dose';
import { plannedOf } from '../generator';
import { rankSlot, tierRank } from '../generator/slots';
import { e3Sets } from '../generator/warmup';
import type { SlotKey } from '../generator/types';
import { PROGRESSION } from '../session/progression-config';
import { addDays } from '../session/missed';
import { dateKey } from '../session/calendar';
import { pointsByZone, zoneCoefs, zoneStatus, ZONES, type ZoneFiche, type ZoneId, type ZoneSet, type ZoneStatus } from './zones';

/** Coefficient minimal pour qu'un exercice « travaille » une zone (comme zones-check.ts). */
const MIN_COEF = 0.5;

export interface CatchUpProfile {
  /** Contexte du générateur : niveau, grossesse / post-partum, zones gênées, objectif, fiches. */
  ctx: Ctx;
  /** Catalogue (zones sans fiche admissible : exclues, comme à la génération). */
  pool: readonly Fiche[];
  repriseActive: boolean;
  /** Dernière séance terminée sur un symptôme : aucun ajout. */
  symptomFrozen: boolean;
  /** Gel douleur (adaptation.ts painFrozen) de cet exercice : zone douloureuse ou fiche elle-même. */
  painFrozen: (ex: PlannedExercise) => boolean;
}

export interface CatchUpWeek {
  /** Séances de la semaine suivante (jeu de la semaine déjà choisi), dont `days[dayIndex]` = la séance qui démarre. */
  days: readonly ProgramDay[];
  dayIndex: number;
  /** Durée choisie (Program.durationMin) ; absente = aucun ajout (lecture prudente). */
  durationMin?: number;
  /** Limite des ajouts (06/11/2026) : « illimité » = UNLIMITED.capMin (75), le rattrapage peut aller de la cible (60) jusqu'à la limite ; durée choisie : absente (= durationMin, jamais dépassée). */
  limitMin?: number;
}

export interface CatchUpAdd { movementId: string; zone: ZoneId }
/** Échange d'exercice (dernier recours) : `from` remplacé par `to` dans la séance du jour, pour `zone`. */
export interface CatchUpSwap { from: string; to: string; zone: ZoneId }
export type CatchUpBlock = 'debutant' | 'grossesse' | 'reprise' | 'symptome' | 'semaine_allegee' | 'epaule_dos';

export interface CatchUpResult {
  /** Séance du jour avec les séries en plus (inchangée si rien n'est ajouté). */
  day: ProgramDay;
  added: CatchUpAdd[];
  /** Échange fait (au plus un), absent sinon. */
  swapped?: CatchUpSwap;
  /** Zones grises ou orange de la semaine écoulée (hors zones exclues et zones sans emplacement). */
  low: { zone: ZoneId; status: ZoneStatus; points: number }[];
  /** Protection qui empêche tout ajout, ou null. */
  blocked: CatchUpBlock | null;
}

/** Séries réellement faites : séries de travail terminées, sans douleur, avec des répétitions ou une durée (échauffement exclu). */
export function doneZoneSets(sets: readonly SetLog[]): ZoneSet[] {
  return sets
    .filter((s) => !!s.completedAt && !s.isWarmup && !s.deletedAt && !s.pain && ((s.reps ?? 0) > 0 || (s.holdSec ?? 0) > 0))
    .map((s) => ({ ficheId: s.movementId, sets: 1, side: s.side ?? null }));
}

function blockOf(p: CatchUpProfile): CatchUpBlock | null {
  const c = p.ctx;
  if (c.level === 'debutant') return 'debutant';
  if (c.pregnant) return 'grossesse';
  if (p.repriseActive || c.repriseActive) return 'reprise';
  if (p.symptomFrozen) return 'symptome';
  if (c.lightWeek) return 'semaine_allegee';
  if (c.zones.some((z) => !z.isG && z.level >= 2 && (z.key === 'epaule' || z.key === 'dos'))) return 'epaule_dos';
  return null;
}

/** Forme « générateur » d'un exercice prévu (plafonds V-PLAF, zones, durée) ; null pour le cardio ou une fiche inconnue. */
export function genOf(ex: PlannedExercise, ctx: Ctx): (GenExercise & DurExercise) | null {
  if (ex.role === 'cardio' || ex.slot === 'cardio') return null;
  const f = ctx.fichesById.get(ex.movementId);
  if (!f) return null;
  const v = f.variantes.find((x) => x.id === ex.variantId);
  return {
    ...ex, ficheId: f.id, schema: f.schema, tags: v?.tags ?? [], musclesPrincipaux: f.musclesPrincipaux, musclesSecondaires: f.musclesSecondaires,
    unilateral: !!ex.perSide, adaptations: ex.adaptation ? [ex.adaptation] : [], chargeable: false,
  } as unknown as GenExercise & DurExercise;
}

export const durOf = (day: ProgramDay, exs: DurExercise[], ctx: Ctx): number =>
  estimerDuree({
    label: day.sessionType ?? 'CE', days: 1, level: ctx.level, pregnant: ctx.pregnant, exercises: exs,
    e1Sec: day.warmup?.generalSec ?? 0, e2Count: day.warmup?.mobility.length ?? 0,
  } as DurSession);

/** Plafond de séries de l'exercice : 4 (V-VOL), limite de dose de la fiche, classe de la variante, rôle (C7). */
function maxSetsOf(ex: PlannedExercise, ctx: Ctx): number {
  const f = ctx.fichesById.get(ex.movementId);
  const v = f?.variantes.find((x) => x.id === ex.variantId);
  if (!f || !v) return 0;
  const k = variantClass(f, v);
  const cls = k === null ? Infinity : ctx.level === 'debutant' ? D_CLASS[k].maxSetsDebutant : D_CLASS[k].maxSets;
  return Math.min(VOLUME.maxSetsPerExercise, doseLimitOf(f.id, v.id, v.tags).maxSets ?? Infinity, cls, PROGRESSION.adaptation.roleMaxSets);
}

/** Fiche qui porte une ligne de zone gênée (niveau >= 1) : jamais de série en plus (comme zones-check.ts). */
const touchesSensitive = (ex: PlannedExercise, ctx: Ctx): boolean => {
  const f = ctx.fichesById.get(ex.movementId);
  return !!f && ctx.zones.some((z) => !z.isG && z.level >= 1 && Object.prototype.hasOwnProperty.call(f.securite.zones, z.key));
};

const STATUS_RANK: Record<ZoneStatus, number> = { gris: 0, orange: 1, rouge: 2 };

/**
 * Échange d'UN exercice de la séance du jour contre une fiche sûre qui travaille `zone` (coefficient >= 0,5 et plus haut que l'actuelle).
 * Candidats = rankSlot du générateur (blessures, matériel, niveau, grossesse, cases de sécurité), jamais une fiche déjà dans la semaine ;
 * jamais exercice principal, tronc, correctif, isolation, superset, dose fixe, case de sécurité, charge bloquée, série acceptée ou ajoutée,
 * gel douleur, fiche qui touche une zone gênée. Sous V-PLAF, plafond hebdomadaire, plafonds par zone et durée ; aucune autre zone ne descend.
 * Dose : celle du générateur pour la nouvelle fiche à cet emplacement (pas de charge de départ = étalonnage), séries <= celles de l'ancienne.
 */
function swapForZone(
  zone: ZoneId, exercises: PlannedExercise[], today: ProgramDay, next: CatchUpWeek, added: readonly CatchUpAdd[], fiches: Map<string, ZoneFiche>,
  plaf: ReturnType<typeof makePlaf>, budgetSec: number, profile: CatchUpProfile, gens: (d: ProgramDay) => (GenExercise & DurExercise)[],
): { exercises: PlannedExercise[]; swap: CatchUpSwap } | null {
  const { ctx } = profile;
  const tpl = today.label.slice(-1);
  if (!['A', 'B', 'C'].includes(tpl)) return null;
  const type = today.sessionType && today.sessionType !== 'CE' ? today.sessionType : null;
  const state = { label: type ? `${type}-${tpl}` : tpl, placedSchema: {} as Partial<Record<SlotKey, string>> };
  for (const x of exercises) if (x.role !== 'cardio') state.placedSchema[x.slot as SlotKey] = ctx.fichesById.get(x.movementId)?.schema ?? '';
  const weekIds = new Set(next.days.flatMap((d, j) => (j === next.dayIndex ? exercises : d.exercises).map((e) => e.movementId)));
  const excluded = excludedZones(ctx, profile.pool);
  const watched = ZONES.filter((z) => !excluded[z.id]).map((z) => z.id);
  const weekAt = (exs: PlannedExercise[]) => next.days.map((d, j) => ({ exercises: gens(j === next.dayIndex ? { ...today, exercises: exs } : d) }));
  const baseWeek = weekAt(exercises);
  const baseStatus = checkZones(baseWeek, ctx, profile.pool).status;
  const coefOf = (id: string) => { const f = fiches.get(id); return f ? zoneCoefs(f).get(zone) ?? 0 : 0; };
  const order = exercises.map((ex, i) => ({ ex, i, c: coefOf(ex.movementId) })).sort((a, b) => a.c - b.c); // le moins utile à la zone d'abord
  for (const { ex, i, c } of order) {
    if (ex.role === 'cardio' || ex.slot === 'cardio' || MAIN_EXERCISE_SLOTS.includes(ex.slot) || ex.slot === 'tronc' || ex.slot === 'correctif' || isIsoSlot(ex.slot)) continue;
    if (ex.supersetGroup || ex.capped || ex.adaptation != null || ex.adaptApplied || ex.reprise || FIXED_DOSE[ex.movementId]) continue;
    if (added.some((a) => a.movementId === ex.movementId) || touchesSensitive(ex, ctx) || profile.painFrozen(ex)) continue;
    for (const r of rankSlot(ex.slot as SlotKey, state, new Set(weekIds), ctx, profile.pool as Fiche[])) {
      if (tierRank(r.tier) > 1 || r.cand.capped || r.cand.adapted) continue; // emplacement rempli pleinement, sans case de sécurité
      const f = r.cand.fiche;
      if (coefOf(f.id) < Math.max(MIN_COEF, c + 1e-9)) continue;
      if (ctx.zones.some((z) => !z.isG && z.level >= 1 && Object.prototype.hasOwnProperty.call(f.securite.zones, z.key))) continue;
      const alt = buildExercise(r.cand, ex.slot as SlotKey, r.tier, ctx);
      alt.warmupSets = e3Sets(alt, ctx);
      alt.sets = Math.min(ex.sets, alt.sets);
      if (alt.capped || alt.adaptations.length || alt.supersetGroup || alt.sets < 1) continue;
      const planned: PlannedExercise = { ...plannedOf(alt), startLoadKg: null };
      if (profile.painFrozen(planned)) continue;
      const trial = exercises.map((x, j) => (j === i ? planned : x));
      const tDay = { ...today, exercises: trial };
      const tGen = gens(tDay);
      const after = weekAt(trial);
      if (!splitCapsOk(tGen, plaf) || !weekCapsOk(after) || !zoneCapsOk(baseWeek, after, ctx)) continue;
      if (durOf(tDay, tGen, ctx) > Math.max(budgetSec, durOf({ ...today, exercises }, gens({ ...today, exercises }), ctx))) continue;
      const st = checkZones(after, ctx, profile.pool).status;
      if (watched.some((z) => STATUS_RANK[st[z]] < STATUS_RANK[baseStatus[z]])) continue; // aucune autre zone ne perd son statut
      return { exercises: trial, swap: { from: ex.movementId, to: planned.movementId, zone } };
    }
  }
  return null;
}

/**
 * Zones grises ou orange de la semaine écoulée (séries réellement faites ; séance manquée = 0) et séries en plus pour la première
 * séance de la semaine suivante : une par zone, sur l'exercice du jour qui travaille le plus la zone, jamais deux sur le même exercice.
 */
export function zoneCatchUp(weekSets: readonly SetLog[], next: CatchUpWeek, profile: CatchUpProfile): CatchUpResult {
  const { ctx } = profile;
  const today = next.days[next.dayIndex];
  const fiches = new Map<string, ZoneFiche>();
  for (const f of ctx.fichesById.values()) fiches.set(f.id, f as ZoneFiche);
  const points = pointsByZone(doneZoneSets(weekSets), fiches);
  const excluded = excludedZones(ctx, profile.pool);
  const low = ZONES.filter((z) => !excluded[z.id] && !SLOTLESS_ZONES.includes(z.id))
    .map((z) => ({ zone: z.id, points: points[z.id] ?? 0, status: zoneStatus(points[z.id] ?? 0, z.id, ctx.goalKey) }))
    .filter((z) => z.status !== 'rouge')
    .sort((a, b) => (a.status === b.status ? a.points - b.points : a.status === 'gris' ? -1 : 1));
  const blocked = blockOf(profile);
  const none: CatchUpResult = { day: today, added: [], low, blocked };
  if (!today || blocked || !low.length || next.durationMin === undefined) return none;

  const budgetSec = Math.max(next.durationMin, next.limitMin ?? 0) * 60;
  const plaf = makePlaf(ctx, 'auto');
  const gens = (d: ProgramDay) => d.exercises.map((e) => genOf(e, ctx)).filter((e): e is GenExercise & DurExercise => e !== null);
  const week = next.days.map((d) => ({ exercises: gens(d) }));
  let exercises = today.exercises;
  const added: CatchUpAdd[] = [];
  if (durOf(today, gens(today), ctx) > budgetSec) return none;

  for (const { zone } of low) {
    const cands = exercises
      .map((ex, i) => ({ ex, i, c: zoneCoefs((fiches.get(ex.movementId) ?? { id: '', schema: '', musclesPrincipaux: [], musclesSecondaires: [] }) as ZoneFiche).get(zone) ?? 0 }))
      .filter((x) => x.c >= MIN_COEF && genOf(x.ex, ctx) !== null)
      .sort((a, b) => b.c - a.c || a.ex.sets - b.ex.sets);
    for (const { ex, i } of cands) {
      // +1 série par exercice et par semaine : ni deux rattrapages, ni un rattrapage en plus d'une série acceptée (adapt-accept.ts).
      if (added.some((a) => a.movementId === ex.movementId) || ex.adaptApplied) continue;
      // Dose fixe, isolation (2 séries), charge bloquée, case de sécurité, superset (durée de la paire) : jamais de série en plus.
      if (ex.capped || ex.adaptation != null || ex.supersetGroup || FIXED_DOSE[ex.movementId] || isIsoSlot(ex.slot)) continue;
      if (touchesSensitive(ex, ctx) || profile.painFrozen(ex)) continue;
      if (ex.sets + 1 > maxSetsOf(ex, ctx)) continue;
      const trial = exercises.map((x, j) => (j === i ? { ...x, sets: x.sets + 1 } : x));
      const tDay = { ...today, exercises: trial };
      const tGen = gens(tDay);
      const before = week.map((w, j) => (j === next.dayIndex ? { exercises: gens({ ...today, exercises }) } : w));
      const after = before.map((s, j) => (j === next.dayIndex ? { exercises: tGen } : s));
      if (!splitCapsOk(tGen, plaf) || !weekCapsOk(after) || !zoneCapsOk(before, after, ctx)) continue;
      if (durOf(tDay, tGen, ctx) > budgetSec) continue;
      exercises = trial;
      added.push({ movementId: ex.movementId, zone });
      break;
    }
  }
  // Dernier recours : une zone restée orange / grise (aucune série en plus possible) -> UN échange d'exercice ; jamais si +1 série a suffi.
  let swapped: CatchUpSwap | undefined;
  for (const { zone } of low.filter((l) => !added.some((a) => a.zone === l.zone))) {
    const sw = swapForZone(zone, exercises, today, next, added, fiches, plaf, budgetSec, profile, gens);
    if (sw) { exercises = sw.exercises; swapped = sw.swap; break; }
  }
  if (!added.length && !swapped) return none;
  // Durée affichée recalculée (même arrondi que le générateur : 5 min au-dessus, cardio du jour compris), jamais plus basse qu'avant.
  const cardioSec = exercises.filter((e) => (e.role === 'cardio' || e.slot === 'cardio') && !e.fromWeek).reduce((a, e) => a + (e.holdSec ?? 0) * e.sets, 0);
  const newDay = { ...today, exercises };
  const est = Math.ceil((durOf(newDay, gens(newDay), ctx) + cardioSec) / 60 / TIME.displayRoundMin) * TIME.displayRoundMin;
  return { day: { ...newDay, estimatedMin: Math.max(today.estimatedMin ?? 0, est) }, added, ...(swapped ? { swapped } : {}), low, blocked };
}

/**
 * Semaine du programme (7 jours depuis `startDate`) : séries de la semaine écoulée, et vrai si aucune série n'a encore été faite cette
 * semaine (première séance). null pendant la première semaine du programme.
 */
export function lastWeekOf(startDate: string | null | undefined, sets: readonly SetLog[], nowMs: number): { weekSets: SetLog[]; firstOfWeek: boolean } | null {
  const start = (startDate ?? '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start)) return null;
  const today = dateKey(new Date(nowMs));
  if (today < start) return null;
  let w = 0;
  while (addDays(start, 7 * (w + 1)) <= today) w++;
  if (w < 1) return null;
  const cur = addDays(start, 7 * w);
  const prev = addDays(start, 7 * (w - 1));
  const keyOf = (s: SetLog) => dateKey(new Date(s.completedAt!));
  const work = sets.filter((s) => !!s.completedAt && !s.isWarmup && !s.deletedAt);
  return {
    weekSets: work.filter((s) => keyOf(s) >= prev && keyOf(s) < cur),
    firstOfWeek: !work.some((s) => keyOf(s) >= cur),
  };
}
