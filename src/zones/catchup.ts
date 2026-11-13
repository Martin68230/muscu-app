// Niveau 2, étape 3 (06/11/2026) : rattrapage des zones en fin de semaine. Règle de l'utilisateur : « en fin de semaine réelle (séances
// manquées comprises), toute zone orange ou grise est rattrapée la semaine suivante ». Module PUR : rien n'est stocké, tout se recalcule
// depuis l'historique. Décision (docs/decisions-prises.md) : seulement des séries en plus, appliquées automatiquement à la PREMIÈRE séance
// de la semaine suivante (une seule séance de rattrapage par zone, au plus +1 série par exercice), sous les mêmes contraintes que
// src/generator/zones-check.ts. Dernier recours (07/11/2026) : si une zone reste orange ou grise après les séries en plus, UN seul
// échange d'exercice dans cette séance (swapForZone), avec le classement et les filtres du générateur (rankSlot), sans dose nouvelle.
import type { CatchUpLogEntry, PlannedExercise, ProgramDay, SetLog } from '../data/model';
import { CATCHUP, D_CLASS, doseLimitOf, FIXED_DOSE, ISOLATION_FICHE_PREFIXES, TIME, VOLUME } from '../generator/config';
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
import type { SportGate } from '../sport/sport-load';
import { pointsByZone, thresholdsOf, zoneCoefs, zonesOfInjury, zoneStatus, ZONES, type ZoneFiche, type ZoneId, type ZoneSet, type ZoneStatus } from './zones';

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
  /** RAT-2 / RAT-3 / RAT-5 : journal local (profile.catchUpLog). Absent = pas de journal : la semaine précédente est supposée rattrapée (1 zone, +1 série). */
  log?: readonly CatchUpLogEntry[] | null;
  /** Douleur de niveau >= 1 LEVÉE (blessure supprimée ou désactivée) depuis moins de 7 jours, ou lecture impossible : aucun rattrapage (avis kine 13/11/2026). */
  liftedPain?: boolean;
  /**
   * RAT-7 : charge du sport à l'ouverture de la séance. Absent = aucun sport déclaré ni noté. `gate: null` = information illisible ou
   * ambiguë : aucun rattrapage. `hasPain` : gêne ou malaise noté, renvoi vers un professionnel. `shoulderSport` : un sport d'épaule est déclaré.
   */
  sport?: { gate: SportGate | null; hasPain?: boolean; shoulderSport?: boolean } | null;
}

export interface CatchUpWeek {
  /** Séances de la semaine suivante (jeu de la semaine déjà choisi), dont `days[dayIndex]` = la séance qui démarre. */
  days: readonly ProgramDay[];
  dayIndex: number;
  /** Durée choisie (Program.durationMin) ; absente = aucun ajout (lecture prudente). */
  durationMin?: number;
  /** Limite des ajouts (06/11/2026) : « illimité » = UNLIMITED.capMin (75), le rattrapage peut aller de la cible (60) jusqu'à la limite ; durée choisie : absente (= durationMin, jamais dépassée). */
  limitMin?: number;
  /** Début (AAAA-MM-JJ) de la semaine où le rattrapage s'applique : sert au journal. Absent = ni journal, ni message de plusieurs semaines. */
  weekKey?: string;
  /** Séances de la semaine écoulée (RAT-4 : distinguer une séance manquée d'un défaut de répartition). Absent = la semaine en cours. */
  prevDays?: readonly ProgramDay[];
}

export interface CatchUpAdd { movementId: string; zone: ZoneId }
/** Échange d'exercice (dernier recours) : `from` remplacé par `to` dans la séance du jour, pour `zone`. */
export interface CatchUpSwap { from: string; to: string; zone: ZoneId }
export type CatchUpBlock = 'debutant' | 'grossesse' | 'reprise' | 'symptome' | 'semaine_allegee' | 'epaule_dos' | 'douleur' | 'sport';
/** RAT-3 : pourquoi une zone reste basse (blessure ou protection, plafond ou durée, matériel, séance manquée, sport). */
export type CatchUpCause = NonNullable<CatchUpLogEntry['cause']>;

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
  /** RAT-3 : zones restées basses 2 semaines de suite (ou plus) sans rattrapage cette semaine, avec la cause. Journal absent : vide. */
  stuck: { zone: ZoneId; cause: CatchUpCause; weeks: number }[];
  /** RAT-5 : zones basses depuis 4 semaines : proposer de revoir le programme (jamais de volume automatique). */
  review: ZoneId[];
  /** Lignes du journal pour cette semaine (à enregistrer par l'appelant). */
  log: CatchUpLogEntry[];
  /** Semaine du journal (AAAA-MM-JJ), null si l'appelant n'en a pas donné. */
  weekKey: string | null;
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
  // Avis kine 13/11/2026 : une douleur de niveau 1 ou plus (épaule, dos ou toute zone) supprime TOUT rattrapage (échange compris) tant qu'elle
  // est notée et 7 jours après sa levée (recentPainZones, CAL-11) ; lecture la plus restrictive : toute zone, pas seulement les zones liées.
  if (c.zones.some((z) => !z.isG && z.level >= 1) || c.recentPainZones.size > 0 || p.liftedPain) return 'douleur';
  const sp = p.sport;
  if (sp && (sp.gate === null || sp.hasPain || sp.gate.dayLocked || sp.gate.unknownPain || sp.gate.consult)) return 'sport';
  return null;
}

/** RAT-7 : l'exercice charge-t-il des jambes ou l'épaule un jour où la charge du sport l'interdit ? Ajout seulement si legs = ok et épaule libre. */
function sportRefuses(f: ZoneFiche | undefined, p: CatchUpProfile): boolean {
  const sp = p.sport;
  if (!sp || !f) return false;
  if (sp.gate === null) return true;
  const co = zoneCoefs(f);
  const loads = (zones: readonly string[]) => zones.some((z) => (co.get(z) ?? 0) >= MIN_COEF);
  return (sp.gate.legs !== 'ok' && loads(CATCHUP.legZones)) || (sp.gate.shoulder !== 'free' && loads(CATCHUP.shoulderLoadZones));
}

/** Rattrapage d'épaule : isolation légère déjà au programme (pas un exercice au-dessus de la tête). */
function lightShoulderIso(ex: PlannedExercise, ctx: Ctx): boolean {
  const f = ctx.fichesById.get(ex.movementId);
  return !!f && ISOLATION_FICHE_PREFIXES.some((pre) => ex.movementId.startsWith(pre)) && !CATCHUP.overheadSchemas.includes(f.schema);
}

/** Exercice qui charge une zone de protection (coiffe, dentelé, lombaires, carré des lombes) : aucune série en plus. */
function loadsProtected(f: ZoneFiche | undefined): boolean {
  if (!f) return false;
  const co = zoneCoefs(f);
  return CATCHUP.noZones.some((z) => (co.get(z) ?? 0) >= MIN_COEF);
}

/** RAT-6 : zones sans aucune perte possible (muscles des jambes, zones sensibles, zones chargées par le sport). */
function noLossSet(p: CatchUpProfile): Set<ZoneId> {
  const out = new Set<ZoneId>(CATCHUP.swap.noLossZones);
  for (const z of p.ctx.zones) if (!z.isG && z.level >= 1) for (const id of zonesOfInjury(z.key)) out.add(id);
  for (const k of p.ctx.recentPainZones) for (const id of zonesOfInjury(k)) out.add(id);
  const sp = p.sport;
  if (sp) {
    for (const z of CATCHUP.legZones) out.add(z);
    if (sp.shoulderSport || sp.gate === null || sp.gate.shoulder !== 'free') for (const z of CATCHUP.shoulderLoadZones) out.add(z);
  }
  return out;
}

/**
 * RAT-6 : garde de l'échange par points. Aucune perte sous le seuil rouge ni sur les zones sans perte ; au seuil rouge ou au-dessus : -1 point
 * au plus et le résultat reste >= seuil rouge ; 2 points perdus au plus au total ; le gain sur la zone cible doit couvrir les pertes.
 */
export function swapPointsOk(before: Readonly<Record<ZoneId, number>>, after: Readonly<Record<ZoneId, number>>, target: ZoneId, goalKey: string | null, noLoss: ReadonlySet<ZoneId>): boolean {
  const eps = 1e-6;
  let lost = 0;
  for (const z of ZONES) {
    const d = (before[z.id] ?? 0) - (after[z.id] ?? 0);
    if (d <= eps) continue;
    const rouge = thresholdsOf(z.id, goalKey).rouge;
    if (noLoss.has(z.id) || (before[z.id] ?? 0) < rouge - eps) return false;
    if (d > CATCHUP.swap.maxLossPerZone + eps || (after[z.id] ?? 0) < rouge - eps) return false;
    lost += d;
  }
  const gain = (after[target] ?? 0) - (before[target] ?? 0);
  return lost <= CATCHUP.swap.maxLossTotal + eps && gain > eps && gain + eps >= lost;
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
  const baseCheck = checkZones(baseWeek, ctx, profile.pool);
  const baseStatus = baseCheck.status;
  const noLoss = noLossSet(profile);
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
      // RAT-7 : la nouvelle fiche ne charge ni les jambes ni l'épaule un jour où la charge du sport l'interdit ; RAT-1 : jamais plus de zone de protection.
      if (sportRefuses(fiches.get(f.id), profile)) continue;
      if (loadsProtected(fiches.get(f.id)) && !loadsProtected(fiches.get(ex.movementId))) continue;
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
      const chk = checkZones(after, ctx, profile.pool);
      const st = chk.status;
      if (watched.some((z) => STATUS_RANK[st[z]] < STATUS_RANK[baseStatus[z]])) continue; // aucune autre zone ne perd son statut
      // RAT-6 : garde par points (remplace la seule garde de couleur) ; le quadriceps, les fessiers, les ischios et les mollets ne perdent rien.
      if (!swapPointsOk(baseCheck.points, chk.points, zone, ctx.goalKey, noLoss)) continue;
      return { exercises: trial, swap: { from: ex.movementId, to: planned.movementId, zone } };
    }
  }
  return null;
}

/**
 * Zones grises ou orange de la semaine écoulée (séries réellement faites ; séance manquée = 0) et séries en plus pour la première
 * séance de la semaine suivante (avis kine du 13/11/2026, zones-musculaires.md §7) :
 * - RAT-1 : 2 zones et +2 séries au plus (un échange compte 1), +6 min ; épaule : 1 zone et +1 série sur une isolation légère ; aucune zone de
 *   protection ; une zone à 1 point du seuil n'est pas rattrapée ; grises avant orange, puis la plus ancienne, puis la moins fournie ;
 * - RAT-2 : jamais le même exercice deux semaines de suite (journal) ; sans journal, 1 zone et +1 série ;
 * - RAT-4 : une zone basse parce qu'une séance a été manquée ne reçoit AUCUNE série (décision Q30) ;
 * - RAT-6 : l'échange est gardé par les points ; RAT-7 : la charge du sport est lue ; douleur : rien.
 */
export function zoneCatchUp(weekSets: readonly SetLog[], next: CatchUpWeek, profile: CatchUpProfile): CatchUpResult {
  const { ctx } = profile;
  const today = next.days[next.dayIndex];
  const fiches = new Map<string, ZoneFiche>();
  for (const f of ctx.fichesById.values()) fiches.set(f.id, f as ZoneFiche);
  const points = pointsByZone(doneZoneSets(weekSets), fiches);
  // RAT-4 : points du programme prévu la semaine écoulée (séances comptées comme faites).
  const plannedDays = next.prevDays ?? next.days;
  const planned = pointsByZone(
    plannedDays.flatMap((d) => d.exercises.filter((e) => e.role !== 'cardio' && e.slot !== 'cardio').map((e) => ({ ficheId: e.movementId, sets: e.sets }))), fiches,
  );
  const excluded = excludedZones(ctx, profile.pool);
  const blocked = blockOf(profile);
  const wk = next.weekKey;
  // Journal : semaines consécutives où la zone était basse (cette semaine comprise).
  const logOf = (week: string, zone: ZoneId) => profile.log?.find((l) => l.week === week && l.zone === zone);
  const weeksLow = (zone: ZoneId): number => {
    if (!wk || !profile.log) return 1;
    let n = 1;
    while (n < CATCHUP.logWeeks && logOf(addDays(wk, -7 * n), zone)) n++;
    return n;
  };
  const prevAdded = new Set((profile.log ?? []).filter((l) => !!wk && l.week === addDays(wk, -7) && l.movementId).map((l) => l.movementId as string));
  const assumed = !profile.log; // sans journal : la semaine précédente est supposée rattrapée
  const lowRaw = ZONES.filter((z) => !excluded[z.id] && !SLOTLESS_ZONES.includes(z.id))
    .map((z) => {
      const rouge = thresholdsOf(z.id, ctx.goalKey).rouge;
      const pts = points[z.id] ?? 0;
      return {
        zone: z.id, points: pts, status: zoneStatus(pts, z.id, ctx.goalKey), shortfall: rouge - pts,
        missed: (planned[z.id] ?? 0) >= rouge && pts < rouge, weeks: weeksLow(z.id),
      };
    })
    .filter((z) => z.status !== 'rouge')
    .sort((a, b) => (a.status === b.status ? 0 : a.status === 'gris' ? -1 : 1) || b.weeks - a.weeks || a.points - b.points);
  const low = lowRaw.map(({ zone, status, points: p }) => ({ zone, status, points: p }));
  const cause = new Map<ZoneId, CatchUpCause>();
  const given = new Map<ZoneId, string>(); // zone -> exercice qui a reçu la série ou l'échange
  const finish = (day: ProgramDay, added: CatchUpAdd[], swapped?: CatchUpSwap): CatchUpResult => {
    const real = lowRaw.filter((z) => z.shortfall > CATCHUP.minShortfall);
    const log: CatchUpLogEntry[] = !wk ? [] : real.map((z) => ({
      week: wk, zone: z.zone, movementId: given.get(z.zone) ?? null, ...(given.has(z.zone) ? {} : { cause: cause.get(z.zone) ?? 'plafond' }),
    }));
    const stuck = real.filter((z) => !given.has(z.zone) && z.weeks >= CATCHUP.stuckWeeks)
      .map((z) => ({ zone: z.zone, cause: cause.get(z.zone) ?? ('plafond' as CatchUpCause), weeks: z.weeks }));
    const review = real.filter((z) => z.weeks >= CATCHUP.reviewWeeks).map((z) => z.zone);
    return { day, added, ...(swapped ? { swapped } : {}), low, blocked, stuck, review, log, weekKey: wk ?? null };
  };
  for (const z of lowRaw) {
    cause.set(z.zone, blocked === 'sport' ? 'sport' : blocked || CATCHUP.noZones.includes(z.zone) ? 'protection' : z.missed ? 'manquee' : 'plafond');
  }
  if (!today || next.durationMin === undefined) return finish(today, []);
  if (blocked || !lowRaw.length) return finish(today, []);

  const budgetSec = Math.max(next.durationMin, next.limitMin ?? 0) * 60;
  const plaf = makePlaf(ctx, 'auto');
  const gens = (d: ProgramDay) => d.exercises.map((e) => genOf(e, ctx)).filter((e): e is GenExercise & DurExercise => e !== null);
  const week = next.days.map((d) => ({ exercises: gens(d) }));
  let exercises = today.exercises;
  const added: CatchUpAdd[] = [];
  const baseSec = durOf(today, gens(today), ctx);
  if (baseSec > budgetSec) return finish(today, []);
  let zonesLeft: number = assumed ? CATCHUP.assumed.maxZones : CATCHUP.maxZones;
  let setsLeft: number = assumed ? CATCHUP.assumed.maxExtraSets : CATCHUP.maxExtraSets;
  let shoulderLeft: number = CATCHUP.shoulderMaxZones;
  const isShoulder = (z: ZoneId) => CATCHUP.shoulderZones.includes(z);
  // RAT-1, RAT-4 : zones rattrapables (pas de protection, pas une séance manquée, plus d'un point de retard).
  const eligible = lowRaw.filter((z) => !CATCHUP.noZones.includes(z.zone) && !z.missed && z.shortfall > CATCHUP.minShortfall);

  for (const { zone } of eligible) {
    if (zonesLeft < 1 || setsLeft < 1) break;
    if (isShoulder(zone) && shoulderLeft < 1) continue;
    const cands = exercises
      .map((ex, i) => ({ ex, i, c: zoneCoefs((fiches.get(ex.movementId) ?? { id: '', schema: '', musclesPrincipaux: [], musclesSecondaires: [] }) as ZoneFiche).get(zone) ?? 0 }))
      .filter((x) => x.c >= MIN_COEF && genOf(x.ex, ctx) !== null)
      .sort((a, b) => b.c - a.c || a.ex.sets - b.ex.sets);
    if (!cands.length) cause.set(zone, 'materiel');
    let sportStop = false;
    for (const { ex, i } of cands) {
      // +1 série par exercice et par semaine : ni deux rattrapages, ni un rattrapage en plus d'une série acceptée (adapt-accept.ts).
      if (added.some((a) => a.movementId === ex.movementId) || ex.adaptApplied) continue;
      // RAT-2 : pas deux semaines de suite sur le même exercice.
      if (prevAdded.has(ex.movementId)) continue;
      // Dose fixe, isolation (2 séries), charge bloquée, case de sécurité, superset (durée de la paire) : jamais de série en plus.
      if (ex.capped || ex.adaptation != null || ex.supersetGroup || FIXED_DOSE[ex.movementId] || isIsoSlot(ex.slot)) continue;
      if (touchesSensitive(ex, ctx) || profile.painFrozen(ex)) continue;
      if (loadsProtected(fiches.get(ex.movementId))) continue;
      if (isShoulder(zone) && !lightShoulderIso(ex, ctx)) continue;
      if (sportRefuses(fiches.get(ex.movementId), profile)) { sportStop = true; continue; }
      if (ex.sets + 1 > maxSetsOf(ex, ctx)) continue;
      const trial = exercises.map((x, j) => (j === i ? { ...x, sets: x.sets + 1 } : x));
      const tDay = { ...today, exercises: trial };
      const tGen = gens(tDay);
      const before = week.map((w, j) => (j === next.dayIndex ? { exercises: gens({ ...today, exercises }) } : w));
      const after = before.map((s, j) => (j === next.dayIndex ? { exercises: tGen } : s));
      if (!splitCapsOk(tGen, plaf) || !weekCapsOk(after) || !zoneCapsOk(before, after, ctx)) continue;
      const trialSec = durOf(tDay, tGen, ctx);
      if (trialSec > budgetSec || trialSec - baseSec > CATCHUP.maxExtraMin * 60) continue;
      exercises = trial;
      added.push({ movementId: ex.movementId, zone });
      given.set(zone, ex.movementId);
      zonesLeft--;
      setsLeft--;
      if (isShoulder(zone)) shoulderLeft--;
      break;
    }
    if (!given.has(zone) && sportStop) cause.set(zone, 'sport');
  }
  // Dernier recours : une zone restée orange / grise (aucune série en plus possible) -> UN échange d'exercice ; compte 1 dans le plafond.
  let swapped: CatchUpSwap | undefined;
  if (zonesLeft >= 1 && setsLeft >= 1) {
    for (const { zone } of eligible.filter((l) => !given.has(l.zone) && !isShoulder(l.zone))) {
      const sw = swapForZone(zone, exercises, today, next, added, fiches, plaf, budgetSec, profile, gens);
      if (sw) { exercises = sw.exercises; swapped = sw.swap; given.set(zone, sw.swap.to); break; }
    }
  }
  if (!added.length && !swapped) return finish(today, []);
  // Durée affichée recalculée (même arrondi que le générateur : 5 min au-dessus, cardio du jour compris), jamais plus basse qu'avant.
  const cardioSec = exercises.filter((e) => (e.role === 'cardio' || e.slot === 'cardio') && !e.fromWeek).reduce((a, e) => a + (e.holdSec ?? 0) * e.sets, 0);
  const newDay = { ...today, exercises };
  const est = Math.ceil((durOf(newDay, gens(newDay), ctx) + cardioSec) / 60 / TIME.displayRoundMin) * TIME.displayRoundMin;
  return finish({ ...newDay, estimatedMin: Math.max(today.estimatedMin ?? 0, est) }, added, swapped);
}

/**
 * Semaine du programme (7 jours depuis `startDate`) : séries de la semaine écoulée, et vrai si aucune série n'a encore été faite cette
 * semaine (première séance). null pendant la première semaine du programme.
 */
export function lastWeekOf(startDate: string | null | undefined, sets: readonly SetLog[], nowMs: number): { weekSets: SetLog[]; firstOfWeek: boolean; weekKey: string } | null {
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
    weekKey: cur,
  };
}
