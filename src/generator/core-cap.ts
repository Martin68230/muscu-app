// Plafonds de core tenus APRÈS tous les ajouts (15/11/2026) : l'ajustement du volume et le remplissage du temps pouvaient porter les séries de tronc de 4 exercices à 4 séries
// chacun (14 séries par semaine avec les nouvelles fiches de tronc, test core-ppl) alors que CORE_MAX fixe 6 séries par séance et 12 par semaine (kiné, 07/11/2026).
// On ne fait que BAISSER : une série de moins à la fois sur l'exercice de core le plus chargé (séances les plus tardives d'abord), jamais sous 2 séries par exercice,
// jamais d'exercice retiré. Aucune dose n'est relevée. Annuler : CORE_CAP_ENABLED = true.
import { CORE_MAX, TRONC_SCHEMAS } from './config';
import { coreFamilyOf } from './core';
import type { Ctx } from './context';
import type { GenExercise } from './types';

export const CORE_CAP_ENABLED = true;
const MIN_SETS = 2;

export function capCoreWeek(sessions: { exercises: GenExercise[] }[], ctx: Ctx): void {
  if (!CORE_CAP_ENABLED) return;
  const isCore = (e: GenExercise): boolean => { const f = ctx.fichesById.get(e.ficheId); return e.slot === 'tronc' && !!f && TRONC_SCHEMAS.includes(f.schema) && coreFamilyOf(f) !== null; };
  const sum = (xs: GenExercise[]) => xs.reduce((a, e) => a + e.sets, 0);
  // par séance
  for (const s of sessions) {
    const core = s.exercises.filter(isCore);
    while (sum(core) > CORE_MAX.setsPerSession) { const e = [...core].sort((a, b) => b.sets - a.sets)[0]; if (!e || e.sets <= MIN_SETS) break; e.sets--; }
  }
  // par semaine
  const all = (): GenExercise[] => sessions.flatMap((s) => s.exercises.filter(isCore));
  while (sum(all()) > CORE_MAX.setsPerWeek) {
    const e = [...sessions].reverse().flatMap((s) => s.exercises.filter(isCore)).sort((a, b) => b.sets - a.sets)[0];
    if (!e || e.sets <= MIN_SETS) break;
    e.sets--;
  }
}
