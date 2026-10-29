// Outils communs des tests du lecteur de séance : jours de programme fabriqués à la main (structure connue).
import type { PlannedExercise, ProgramDay } from '../../src/data/model';

export function ex(o: Partial<PlannedExercise> & { variantId: string }): PlannedExercise {
  return {
    movementId: o.movementId ?? o.variantId,
    variantId: o.variantId,
    sets: o.sets ?? 3,
    repsMin: o.repsMin ?? 8,
    repsMax: o.repsMax ?? 12,
    restSec: o.restSec ?? 90,
    supersetGroup: o.supersetGroup ?? null,
    rirTarget: o.rirTarget ?? 2,
    unit: o.unit ?? 'reps',
    holdSec: o.holdSec ?? null,
    warmupSets: o.warmupSets ?? [],
    role: o.role ?? 'autre',
    slot: o.slot ?? 'poussee_1',
    startLoadKg: o.startLoadKg === undefined ? 10 : o.startLoadKg,
    capped: o.capped ?? false,
    adaptation: null,
    substitut: false,
    ...(o.reprise !== undefined ? { reprise: o.reprise } : {}),
  };
}

export function day(exercises: PlannedExercise[], warmup = false): ProgramDay {
  return {
    dayIndex: 0,
    label: 'Séance A',
    exercises,
    ...(warmup ? { warmup: { generalSec: 120, general: { ficheId: 'marche', variantId: 'marche-rapide', nom: 'Marche', sec: 120 }, mobility: [], cooldown: null } } : {}),
  };
}

/** Horloge simulée en millisecondes. */
export function fakeClock(start = Date.parse('2026-10-23T10:00:00.000Z')) {
  let t = start;
  return { now: () => t, advance: (ms: number) => (t += ms), set: (v: number) => (t = v) };
}
