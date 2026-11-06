// Données du lecteur de séance : lues une fois au démarrage ou à la reprise (aucun réseau pendant la séance).
import { list } from '../../data/repo';
import type { EquipmentProfile, Injury, PlannedExercise, Profile, Program, ProgramDay, ProgressionEvent, SetLog, WorkoutSession } from '../../data/model';
import type { Fiche } from '../../data/fiches';
import { buildCtx, isChargeable, isUnilateral, type Ctx } from '../../generator/context';
import type { Fiche as GenFiche, GeneratorInput } from '../../generator/types';
import type { EngineContext } from '../../session/engine';
import { buildEngineContext, gentlerAlternative, type BodyweightProgression, type ProgressionInput } from '../../session/history';
import { loadGeneratorInput, programWeek, rotationFreeze, withProgramWeek } from '../../session/program';
import { painFrozen } from '../../session/adaptation';
import { lastWeekOf, zoneCatchUp, type CatchUpResult } from '../../zones/catchup';
import { pendingArrival, startRepsFor, symptomFrozen } from '../../session/progression';
import { echelonInfoFor, progVariants } from '../../session/progression-store';
import { repriseOf } from '../../session/missed-config';
import { lastMuscuKey, missedDays } from '../../session/missed';
import { dateKey } from '../../session/calendar';
import { CORE_HEAVY_MAX_HOLD_SEC, D_CLASS, doseLimitOf, TECHNICAL_CAP_FICHES, TECHNICAL_NO_LOW_FICHES } from '../../generator/config';
import { isHeavyExercise } from '../../generator/core';
import { isNeverProposed, variantClass } from '../../generator/reps';
import type { ApplyEnv } from '../../session/adapt-accept';

/** Entrées de l'adaptation automatique (knowledge/adaptation-regles.md) pour proposeProgression. */
export type AdaptInput = Pick<
  ProgressionInput,
  'level' | 'zonesOfFiche' | 'zonesOfMovement' | 'variants' | 'technical' | 'ficheMaxSets' | 'missedSinceLast' | 'now' | 'holdSchema' | 'holdMaxSec' | 'restMaxSec' | 'adaptEvents'
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
  /** adaptation-regles.md : niveau, zones, version plus dure, plafond de séries. `nextTime` (bilan) : la séance manquée ne compte plus. */
  adaptOf?(ex: PlannedExercise, nextTime?: boolean): AdaptInput;
}

/** Entrées de applyAccepted (acceptation des adaptations) tirées des données du lecteur. */
export function applyEnvOf(data: PlayerData, repriseActive: boolean = data.repriseActive): ApplyEnv {
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
  };
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
  const week = programWeek(program, nowMs);
  const freeze = rotationFreeze(data.sets, data.injuries, nowMs);
  const days = program.days.map((d, i) => (i === dayIndex ? day : withProgramWeek(d, week, freeze)));
  const zonesOfMovement = (id: string): readonly string[] => Object.keys(data.fiches.find((f) => f.id === id)?.securite.zones ?? {});
  return zoneCatchUp(lw.weekSets, { days, dayIndex, durationMin: program.durationMin }, {
    ctx, pool: data.input.fiches, repriseActive, symptomFrozen: data.frozen,
    painFrozen: (ex) => painFrozen({ movementId: ex.movementId, zones: zonesOfMovement(ex.movementId), sets: data.sets, sessions: data.sessions, zonesOfMovement }),
  });
}

export const isPregnant =(p: Pick<Profile, 'pregnancy'> | null | undefined): boolean => p?.pregnancy === 'enceinte' || p?.pregnancy === 'post_partum';

/** Les fiches de l'écran et celles du générateur sont le même fichier JSON. */
export const asGenFiches = (f: Fiche[]): GenFiche[] => f as unknown as GenFiche[];

export async function loadPlayerData(fiches: Fiche[], profile: Profile, excludeSessionId: string | null = null): Promise<PlayerData> {
  const [sets, equipments, injuries, sessions, profiles, programs] = await Promise.all([
    list('sets'), list('equipment'), list('injuries'), list('sessions'), list('profile'), list('programs'),
  ]);
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
  const frozen = symptomFrozen(sessions);
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
      return !!v && isUnilateral(v);
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
      };
    },
  };
}
