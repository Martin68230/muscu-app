// Reprise douce : calcul de la séance de reprise à partir des données locales (aperçu et démarrage). Pur : aucune écriture.
// R-DEM est calculé ici ; l'aperçu l'affiche sans rien enregistrer, le démarrage (app.tsx) l'enregistre (missed-store.saveReprise).
import type { PlannedExercise, Program, ProgramDay, RepriseState, SetLog, WorkoutSession } from '../data/model';
import { isCardioDay } from '../generator';
import type { EngineContext } from './engine';
import { dateKey } from './calendar';
import { applyRepriseToDay, joursAbsence, lastMuscuKey, repriseAtStart, type RepriseStart } from './missed';

export interface ReprisePlan {
  start: RepriseStart;
  /** Copie du jour de programme adaptée au palier (charges, séries, échelon -1, étalonnage). */
  day: ProgramDay;
  /** État à enregistrer au démarrage (R-DEM, avec `refKg` mis à jour). */
  state: RepriseState;
}

/** Paliers réels du matériel : haltères / kettlebell du profil ; sinon grille au pas du matériel jusqu'à la charge de départ. */
export function repriseLoadsFor(ctx: Pick<EngineContext, 'availableLoadsKg'>): (ex: PlannedExercise) => number[] {
  return (ex) => {
    const real = ctx.availableLoadsKg(ex, null);
    if (real.length) return real;
    const around = ctx.availableLoadsKg(ex, ex.startLoadKg);
    const step = around.length >= 2 ? around[1] - around[0] : 1;
    if (!(step > 0) || ex.startLoadKg === null) return around;
    const out: number[] = [];
    for (let k = 1; k * step <= ex.startLoadKg + 1e-9 && out.length < 500; k++) out.push(Math.round(k * step * 10) / 10);
    return out;
  };
}

/** Séance de reprise (ou null si aucune reprise ne s'applique : cardio dédié, palier 0 sans reprise en cours). */
export function planReprise(
  day: ProgramDay,
  d: { reprise: RepriseState; sessions: readonly WorkoutSession[]; programs: readonly Program[]; sets: readonly SetLog[]; now: Date; ctx?: EngineContext | null },
): ReprisePlan | null {
  if (isCardioDay(day)) return null; // R-DEM : séance de musculation seulement ; le cardio garde ses propres règles (SM-20)
  const today = dateKey(d.now);
  const last = lastMuscuKey(d.sessions, d.programs);
  const start = repriseAtStart(d.reprise, joursAbsence(last, today), today, last);
  const loadsFor = d.ctx ? repriseLoadsFor(d.ctx) : () => [];
  const downOf = d.ctx?.echelonInfo ? (ex: PlannedExercise) => d.ctx!.echelonInfo!(ex)?.down ?? null : undefined;
  const applied = applyRepriseToDay(day, { start, sets: d.sets, loadsFor, downOf });
  return { start, day: applied.day, state: { ...start.state, refKg: applied.refKg } };
}
