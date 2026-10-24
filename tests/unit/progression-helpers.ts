// Outils des tests de progression par échelons (F6) : séances et séries de la fiche « pompe » fabriquées à la main.
import type { Level, PlannedExercise, ProgramDay, SetLog, WorkoutSession } from '../../src/data/model';
import type { ProgVariant } from '../../src/session/progression';

export const M = 'pompe';
let n = 0;
export const day0 = Date.parse('2026-09-01T10:00:00.000Z');
export const at = (d: number, min = 0): string => new Date(day0 + d * 86_400_000 + min * 60_000).toISOString();

export function variants(over: Partial<Record<number, Partial<ProgVariant>>> = {}): ProgVariant[] {
  const base: [number, Level][] = [[1, 'debutant'], [2, 'debutant'], [3, 'debutant'], [4, 'intermediaire'], [5, 'intermediaire']];
  return base.map(([e, niveau]) => ({ id: `p${e}`, nom: `Pompe ${e}`, echelon: e, niveau, materielOk: true, rank: 0, ...over[e] }));
}

export function ex(sets = 3, o: Partial<PlannedExercise> = {}): PlannedExercise {
  return {
    movementId: M, variantId: 'p3', sets, repsMin: 10, repsMax: 15, restSec: 60, supersetGroup: null, rirTarget: 3, unit: 'reps', holdSec: null,
    warmupSets: [], role: 'autre', slot: 'poussee_1', startLoadKg: null, capped: false, adaptation: null, substitut: false, ...o,
  };
}

export function session(id: string, d: number, o: Partial<WorkoutSession> & { planSets?: number } = {}): WorkoutSession {
  const { planSets, ...rest } = o;
  const plan: ProgramDay = { dayIndex: 0, label: 'A', exercises: [ex(planSets ?? 3)] };
  return {
    id, ownerId: 'u', createdAt: at(d), updatedAt: at(d), rev: 1, deletedAt: null, syncedAt: null, programId: 'prog', programDayIndex: 0,
    plannedDate: at(d).slice(0, 10), status: 'faite', startedAt: at(d), endedAt: at(d, 40), note: '', plan, endReason: 'terminee', ...rest,
  } as WorkoutSession;
}

export function sets(sessionId: string, d: number, o: Partial<SetLog> & { count?: number } = {}): SetLog[] {
  const { count = 3, ...rest } = o;
  return Array.from({ length: count }, (_, i) => {
    n++;
    return {
      id: `s${n}`, ownerId: 'u', createdAt: at(d), updatedAt: at(d), rev: 1, deletedAt: null, syncedAt: null,
      sessionId, movementId: M, variantId: 'p3', exerciseIndex: 0, setIndex: i, targetRepsMin: 10, targetRepsMax: 15, reps: 15, loadKg: null,
      rir: 3, pain: false, comment: '', completedAt: at(d, 5 + i * 3), targetRir: 3, isCalibration: false, isWarmup: false, echelon: 3,
      side: null, capped: false, ...rest,
    } as SetLog;
  });
}

/** Séances parfaites (3 séries à 15, réserve 3) aux jours donnés, à l'échelon donné. */
export function perfect(days: number[], echelon = 3, prefix = 'a'): { sets: SetLog[]; sessions: WorkoutSession[] } {
  return {
    sets: days.flatMap((d) => sets(`${prefix}${d}`, d, { echelon, variantId: `p${echelon}` })),
    sessions: days.map((d) => session(`${prefix}${d}`, d)),
  };
}
