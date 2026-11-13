// Données du lecteur de séance : lues une fois au démarrage ou à la reprise (aucun réseau pendant la séance).
import { list, listAll, listTrusted } from '../../data/repo';
import type { CatchUpLogEntry, EquipmentProfile, Injury, PlannedExercise, Profile, Program, ProgramDay, ProgressionEvent, SetLog, WorkoutSession } from '../../data/model';
import type { SportPlanEntry, SportSession } from '../../data/model';
import type { Fiche } from '../../data/fiches';
import { buildCtx, isChargeable, isPerSideVariant, type Ctx } from '../../generator/context';
import type { Fiche as GenFiche, GeneratorInput } from '../../generator/types';
import type { EngineContext } from '../../session/engine';
import { buildEngineContext, gentlerAlternative, proposeProgression, type BodyweightProgression, type ProgressionInput } from '../../session/history';
import { loadGeneratorInput, programWeek, rotationFreeze, withProgramWeek } from '../../session/program';
import { painFrozen } from '../../session/adaptation';
import { lastWeekOf, zoneCatchUp, type CatchUpProfile, type CatchUpResult } from '../../zones/catchup';
import { SPORT } from '../../sport/sport-config';
import { sportGate, sportLoad } from '../../sport/sport-load';
import { CATCHUP, JUMPS } from '../../generator/config';
import { pendingArrival, startRepsFor, symptomFrozen } from '../../session/progression';
import { echelonInfoFor, progVariants } from '../../session/progression-store';
import { repriseOf } from '../../session/missed-config';
import { lastMuscuKey, missedDays } from '../../session/missed';
import { dateKey } from '../../session/calendar';
import { CORE_HEAVY_MAX_HOLD_SEC, D_CLASS, doseLimitOf, TECHNICAL_CAP_FICHES, TECHNICAL_NO_LOW_FICHES } from '../../generator/config';
import { isHeavyExercise } from '../../generator/core';
import { isNeverProposed, variantClass } from '../../generator/reps';
import type { ApplyEnv } from '../../session/adapt-accept';
import { estimateDaySec, fillExerciseTime, repsCeilingOf, sessionLimitMin } from '../../session/intensity';

/** Entrées de l'adaptation automatique (knowledge/adaptation-regles.md) pour proposeProgression. */
export type AdaptInput = Pick<
  ProgressionInput,
  'level' | 'zonesOfFiche' | 'zonesOfMovement' | 'variants' | 'technical' | 'ficheMaxSets' | 'missedSinceLast' | 'now' | 'holdSchema' | 'holdMaxSec' | 'restMaxSec' | 'adaptEvents' | 'intensity'
>;

export interface PlayerData {
  fiches: Fiche[];
  sets: SetLog[];
  equipment: EquipmentProfile | null;
  injuries: Injury[];
  pregnant: boolean;
  ctx: EngineContext;
  /** F6 : séances, décisions de progression, gel après symptôme. */
  sessions: WorkoutSession[];
  events: ProgressionEvent[];
  frozen: boolean;
  /** Entrées du générateur (null si le profil n'est pas complet) : version plus douce, niveau. */
  input: GeneratorInput | null;
  /** F6 : répétitions à préremplir pour un exercice sans charge (le bas de la fourchette après tout changement d'échelon), ou null. */
  startReps(ex: PlannedExercise): number | null;
  /** F6 : informations de progression d'un exercice sans charge, ou undefined pour un exercice à charge. */
  bodyweightOf(ex: PlannedExercise): BodyweightProgression | undefined;
  /** V-PROG-E8 : reprise douce active (seance-manquee-v1.md SM-13) : aucune proposition de montée. */
  repriseActive: boolean;
  /** « Mon sport » : séances notées et sports déclarés (absent = aucun) ; sert au rattrapage (RAT-7), jamais à la progression. */
  sport?: { sessions: SportSession[]; plan: SportPlanEntry[] };
  /** Lecture de « Mon sport » impossible : aucun rattrapage (prudence), jamais « rien à lire ». */
  sportError?: boolean;
  /** Douleur de niveau >= 1 levée depuis moins de 7 jours (ou lecture impossible). */
  liftedPain?: boolean;
  /** RAT-2 / RAT-3 : journal local du rattrapage (profile.catchUpLog) ; absent = pas de journal. */
  catchUpLog?: CatchUpLogEntry[];
  /** adaptation-regles.md : niveau, zones, version plus dure, plafond de séries. `nextTime` (bilan) : la séance manquée ne compte plus. */
  adaptOf?(ex: PlannedExercise, nextTime?: boolean): AdaptInput;
}

/** Entrées de applyAccepted (acceptation des adaptations) tirées des données du lecteur. */
export function applyEnvOf(data: PlayerData, repriseActive: boolean = data.repriseActive, week?: { program: Program; dayIndex: number; nowMs: number }): ApplyEnv {
  // Lot cohérence point 4 : durée limite de la séance (même règle que le rattrapage) et estimation du générateur.
  const input = data.input;
  const gctx = week && input ? buildCtx(input) : null;
  const limitMin = week && input ? sessionLimitMin(input.profile.sessionDurationMin, week.program.durationMin) : undefined;
  const time = gctx && limitMin !== undefined ? { gctx, limitSec: limitMin * 60 } : null;
  return {
    events: data.events,
    sets: data.sets,
    sessions: data.sessions,
    pregnant: data.pregnant,
    repriseActive,
    frozenBySymptom: data.frozen,
    adaptOf: (ex) => data.adaptOf?.(ex) ?? {},
    echelonOf: (id) => data.fiches.flatMap((f) => f.variantes).find((v) => v.id === id)?.echelon,
    loadsFor: (ex, cur) => data.ctx.availableLoadsKg(ex, cur),
    ...(time && week ? {
      fits: (day: ProgramDay) => estimateDaySec(day, day.exercises, time.gctx) <= time.limitSec,
      now: week.nowMs,
      fillExercise: (day: ProgramDay, locked: (ex: PlannedExercise) => boolean, frozenFiche: (ficheId: string) => boolean) => {
        const pw = programWeek(week.program, week.nowMs);
        const freeze = rotationFreeze(data.sets, data.injuries, week.nowMs);
        const days = week.program.days.map((d, i) => (i === week.dayIndex ? day : withProgramWeek(d, pw, freeze)));
        return fillExerciseTime({ ctx: time.gctx, days, dayIndex: week.dayIndex, limitSec: time.limitSec, locked, frozenFiche });
      },
    } : {}),
  };
}

/**
 * RAT-7 : charge du sport à l'ouverture de la séance. Aucun sport déclaré ni noté : undefined (rien à lire). Calcul impossible : `gate: null`
 * (information illisible : aucun rattrapage). Ne sert qu'à REFUSER un ajout.
 */
/** Douleur de niveau >= 1 levée (supprimée ou désactivée) depuis moins de 7 jours : le rattrapage reste coupé (avis kine 13/11/2026). */
export function liftedPainRecent(injuries: readonly Pick<Injury, 'level' | 'active' | 'deletedAt' | 'updatedAt'>[], nowMs: number): boolean {
  return injuries.some((i) => {
    if (i.level < 1 || (i.active && !i.deletedAt)) return false;
    const t = Date.parse(i.deletedAt ?? i.updatedAt);
    return !Number.isFinite(t) || nowMs - t < CATCHUP.painAfterDays * 86400000;
  });
}

export function catchUpSportOf(data: PlayerData, ctx: Ctx, nowMs: number): CatchUpProfile['sport'] {
  if (data.sportError) return { gate: null };
  const sp = data.sport;
  if (!sp || (!sp.plan.length && !sp.sessions.length)) return undefined;
  // Sport déclaré sans aucun jour ni match et aucune séance notée : information ambiguë, valeur la plus lourde (aucun rattrapage).
  if (!sp.sessions.length && sp.plan.every((e) => !(e.weekdays?.length) && e.matchWeekday == null)) return { gate: null };
  try {
    const load = sportLoad(sp.sessions, sp.plan, new Date(nowMs));
    const gate = sportGate(load, ctx.level, JUMPS.startContacts[ctx.level]);
    return {
      gate, hasPain: load.tempPainZones.length > 0 || load.unknownPainRecent || load.malaiseToday || !!load.consult,
      shoulderSport: sp.plan.some((e) => SPORT.shoulderFamilies.includes(e.sport)),
    };
  } catch {
    return { gate: null };
  }
}

/**
 * Rattrapage des zones (src/zones/catchup.ts) pour la séance `dayIndex` qui démarre : seulement à la première séance de la semaine du
 * programme, recalculé depuis l'historique (rien n'est stocké). `day` = copie du jour après les changements acceptés.
 */
export function catchUpOf(data: PlayerData, program: Program, dayIndex: number, day: ProgramDay, repriseActive: boolean, nowMs: number): CatchUpResult | null {
  if (!data.input || repriseActive) return null;
  const lw = lastWeekOf(program.startDate, data.sets, nowMs);
  if (!lw || !lw.firstOfWeek) return null;
  const ctx = buildCtx(data.input);
  const limitMin = sessionLimitMin(data.input.profile.sessionDurationMin, program.durationMin);
  const week = programWeek(program, nowMs);
  const freeze = rotationFreeze(data.sets, data.injuries, nowMs);
  const days = program.days.map((d, i) => (i === dayIndex ? day : withProgramWeek(d, week, freeze)));
  const prevWeek = Math.max(1, week - 1);
  const prevDays = program.days.map((d) => withProgramWeek(d, prevWeek, freeze));
  const zonesOfMovement = (id: string): readonly string[] => Object.keys(data.fiches.find((f) => f.id === id)?.securite.zones ?? {});
  return zoneCatchUp(lw.weekSets, { days, dayIndex, prevDays, weekKey: lw.weekKey, durationMin: program.durationMin, ...(limitMin !== program.durationMin ? { limitMin } : {}) }, {
    ctx, pool: data.input.fiches, repriseActive, symptomFrozen: data.frozen, log: data.catchUpLog ?? null, liftedPain: data.liftedPain, sport: catchUpSportOf(data, ctx, nowMs),
    painFrozen: (ex) => painFrozen({ movementId: ex.movementId, zones: zonesOfMovement(ex.movementId), sets: data.sets, sessions: data.sessions, zonesOfMovement }),
  });
}

/**
 * Décision du chef de projet (06/11/2026) : l'intensité (ajout, répétitions, série) passe avant la montée d'échelon. Vrai si
 * proposeProgression propose l'un de ces moyens pour cet exercice (mêmes entrées que le bilan) : computeProposals ne propose alors pas E2.
 */
export function intensityFirstOf(data: PlayerData): (ex: PlannedExercise) => boolean {
  return (ex) => {
    const variant = data.fiches.flatMap((f) => f.variantes).find((v) => v.id === ex.variantId);
    const p = proposeProgression({
      exercise: ex, sets: data.sets, sessions: data.sessions, pregnant: data.pregnant, variantTags: variant?.tags, equipment: data.equipment ?? undefined,
      echelon: variant?.echelon, bodyweight: data.bodyweightOf(ex), frozenBySymptom: data.frozen, repriseActive: data.repriseActive,
      ...(data.adaptOf?.(ex) ?? {}), adaptEvents: data.events,
    });
    return !!(p.exerciseProposal || p.repsProposal || p.setsProposal);
  };
}

export const isPregnant =(p: Pick<Profile, 'pregnancy'> | null | undefined): boolean => p?.pregnancy === 'enceinte' || p?.pregnancy === 'post_partum';

/** Les fiches de l'écran et celles du générateur sont le même fichier JSON. */
export const asGenFiches = (f: Fiche[]): GenFiche[] => f as unknown as GenFiche[];

export async function loadPlayerData(fiches: Fiche[], profile: Profile, excludeSessionId: string | null = null): Promise<PlayerData> {
  const [sets, equipments, injuries, sessions, profiles, programs] = await Promise.all([
    listTrusted('sets'), list('equipment'), list('injuries'), listTrusted('sessions'), list('profile'), list('programs'),
  ]);
  let sportError = false;
  const sportSessions = await list('sportSessions').catch(() => { sportError = true; return [] as SportSession[]; });
  let liftedPain = false;
  try { liftedPain = liftedPainRecent(await listAll('injuries'), Date.now()); } catch { liftedPain = true; }
  const myProfile = profiles.find((p) => p.id === profile.id) ?? profile;
  const sportPlan = myProfile.sportPlan ?? [];
  const zonesOfMovement = (id: string): readonly string[] => Object.keys(fiches.find((f) => f.id === id)?.securite.zones ?? {});
  // §6 / §8 [kine] : une séance prévue manquée (ou renoncée) depuis la dernière séance faite : aucune montée à la séance de retour.
  const active = programs.filter((p) => p.active && !p.deletedAt)[0];
  const lastKey = lastMuscuKey(sessions, programs);
  let missedSinceLast = false;
  try {
    missedSinceLast = !!active && lastKey !== null && (
      missedDays(active, sessions, sets, dateKey(new Date())).some((d) => d > lastKey) ||
      sessions.some((s) => !s.deletedAt && s.status === 'sautee' && s.plannedDate.slice(0, 10) > lastKey)
    );
  } catch {
    missedSinceLast = false;
  }
  const equipment = equipments[0] ?? null;
  const pregnant = isPregnant(profile);
  const events = profiles.find((p) => p.id === profile.id)?.progressionLog ?? profile.progressionLog ?? [];
  const variants = new Map<string, Fiche['variantes'][number]>();
  fiches.forEach((f) => f.variantes.forEach((v) => variants.set(v.id, v)));
  const loaded = await loadGeneratorInput(asGenFiches(fiches)).catch(() => null);
  const gctx: Ctx | null = loaded ? buildCtx(loaded.input) : null;
  // « Mon sport » (étape 1, signalé par le dev) : une gêne notée SANS zone arrête la progression pendant 2 jours (valeur la plus lourde).
  let sportPain = false;
  try { sportPain = sportLoad(sportSessions, sportPlan, new Date()).unknownPainRecent; } catch { sportPain = true; }
  const frozen = symptomFrozen(sessions) || sportPain;
  const info = gctx ? (ex: PlannedExercise) => echelonInfoFor(ex, { ctx: gctx, sets, sessions, events, excludeSessionId }) : undefined;
  const ctx = buildEngineContext({
    sets,
    equipment: equipment ?? { dumbbellWeightsKg: [], kettlebellWeightsKg: [], platesKg: [] },
    pregnant,
    tagsOfVariant: (id) => variants.get(id)?.tags ?? [],
    echelonOf: (id) => variants.get(id)?.echelon,
    echelonInfo: info,
    excludeSessionId,
    zoneOnFiche: (ex, zone) => !!fiches.find((f) => f.id === ex.movementId)?.securite.zones[zone],
    mainMusclesOf: (ex) => fiches.find((f) => f.id === ex.movementId)?.musclesPrincipaux ?? null,
    perSideOf: (ex) => {
      const v = variants.get(ex.variantId);
      return !!v && isPerSideVariant(v);
    },
    zonesOfMovement,
    sessions,
  });
  const heavyDayOf = (ex: PlannedExercise): boolean => {
    const days = active?.days.filter((d) => d.exercises.some((e) => e.movementId === ex.movementId)) ?? [];
    return days.some((d) => d.exercises.some((e) => {
      if (e.movementId === ex.movementId) return false;
      const f = fiches.find((x) => x.id === e.movementId);
      return !!f && isHeavyExercise({ slot: '', schema: f.schema, ficheId: f.id, tags: variants.get(e.variantId)?.tags ?? [] });
    }));
  };
  const bodyweightFiche = (ex: PlannedExercise) => {
    const fiche = gctx?.fichesById.get(ex.movementId);
    const variant = fiche?.variantes.find((v) => v.id === ex.variantId);
    return fiche && variant && !isChargeable(variant) && ex.unit !== 'sec' ? { fiche, variant } : null;
  };
  return {
    fiches,
    sets,
    equipment,
    injuries: injuries.filter((i) => i.active && !i.deletedAt),
    pregnant,
    ctx,
    sessions,
    events,
    frozen,
    sport: { sessions: sportSessions, plan: sportPlan },
    sportError,
    liftedPain,
    catchUpLog: myProfile.catchUpLog,
    input: loaded?.input ?? null,
    repriseActive: repriseOf(profiles.find((p) => p.id === profile.id) ?? profile).actif,
    startReps: (ex) => {
      const b = bodyweightFiche(ex);
      return b ? startRepsFor(ex.movementId, b.variant.echelon, sets, excludeSessionId) : null;
    },
    bodyweightOf: (ex) => {
      const b = bodyweightFiche(ex);
      if (!b || !gctx || !loaded) return undefined;
      const arrival = pendingArrival(events, ex.movementId, sets.filter((s) => s.sessionId !== excludeSessionId));
      return {
        variants: progVariants(b.fiche, gctx),
        level: gctx.level,
        events,
        gentler: gentlerAlternative(ex.movementId, loaded.input),
        restricted: ex.adaptation !== null,
        arrival: !!arrival && arrival.to === b.variant.echelon,
      };
    },
    adaptOf: (ex, nextTime = false) => {
      const level = gctx?.level ?? 'debutant';
      const fiche = gctx?.fichesById.get(ex.movementId);
      const variant = fiche?.variantes.find((v) => v.id === ex.variantId);
      const k = fiche && variant ? variantClass(fiche, variant) : null;
      const classCap = k === null ? undefined : level === 'debutant' ? D_CLASS[k].maxSetsDebutant : D_CLASS[k].maxSets;
      const limit = variant ? doseLimitOf(ex.movementId, variant.id, variant.tags).maxSets : undefined;
      // Lot cohérence point 4 : séance du programme qui contient l'exercice, durée limite (même règle que le rattrapage), estimation du générateur.
      const tDay = active?.days.find((d) => d.exercises.some((e) => e.movementId === ex.movementId));
      const limitMin = active && loaded ? sessionLimitMin(loaded.input.profile.sessionDurationMin, active.durationMin) ?? null : null;
      return {
        level,
        zonesOfFiche: zonesOfMovement(ex.movementId),
        zonesOfMovement,
        // C8 : jamais une variante D4 ni une variante jamais proposée (D4_NEVER) par la progression.
        variants: fiche && gctx ? progVariants(fiche, gctx).filter((v) => {
          const fv = fiche.variantes.find((x) => x.id === v.id);
          return !!fv && !isNeverProposed(fiche, fv) && variantClass(fiche, fv) !== 4;
        }) : undefined,
        technical: TECHNICAL_CAP_FICHES.includes(ex.movementId) || TECHNICAL_NO_LOW_FICHES.includes(ex.movementId) || k === 3 || k === 4,
        ficheMaxSets: Math.min(classCap ?? Infinity, limit ?? Infinity),
        restMaxSec: k === null ? undefined : D_CLASS[k].restMaxSec,
        adaptEvents: events,
        missedSinceLast: nextTime ? false : missedSinceLast,
        now: Date.now(),
        // Maintiens : schéma de la fiche ; 30 s au plus si le même jour de programme contient une charge lourde (CORE-ORD-4, lecture sans emplacement).
        holdSchema: ex.unit === 'sec' ? fiche?.schema : undefined,
        holdMaxSec: ex.unit === 'sec' && heavyDayOf(ex) ? CORE_HEAVY_MAX_HOLD_SEC : undefined,
        intensity: gctx && fiche && variant ? {
          repsCeiling: repsCeilingOf(ex, fiche, variant, gctx),
          time: tDay && limitMin !== null ? { day: tDay, limitSec: limitMin * 60, estimate: (exs: readonly PlannedExercise[]) => estimateDaySec(tDay, exs, gctx) } : undefined,
        } : undefined,
      };
    },
  };
}
