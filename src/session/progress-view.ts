// Écran « Progression » : records par exercice et séries par semaine. Fonctions pures sur les lignes déjà lues en local, aucune écriture.
// Les séries avec douleur ne comptent jamais (un record n'est jamais une douleur) ; les séances importées sont ignorées (charges non vérifiées).
import type { SetLog, WorkoutSession } from '../data/model';
import { dateKey, sessionDate } from './calendar';
import { countsForCurve, curveSeries, type CurveMetric } from './history-view';

export interface ExerciseProgress {
  movementId: string;
  metric: CurveMetric;
  sessions: number;
  first: number;
  last: number;
  best: number;
  bestDateKey: string;
  lastDateKey: string;
}

/** Un exercice apparaît dès 2 séances propres (comme la courbe) ; les plus pratiqués d'abord, puis les plus récents. */
export function exerciseProgress(sets: readonly SetLog[], sessions: readonly WorkoutSession[]): ExerciseProgress[] {
  const own = sessions.filter((s) => !s.imported);
  const ids = [...new Set(sets.filter((s) => !!s.completedAt && !s.isWarmup && !s.deletedAt).map((s) => s.movementId))];
  const out: ExerciseProgress[] = [];
  for (const id of ids) {
    const { metric, points } = curveSeries(id, sets, own);
    if (points.length < 2) continue;
    const best = points.reduce((b, p) => (p.value > b.value ? p : b), points[0]);
    out.push({ movementId: id, metric, sessions: points.length, first: points[0].value, last: points[points.length - 1].value, best: best.value, bestDateKey: best.dateKey, lastDateKey: points[points.length - 1].dateKey });
  }
  return out.sort((a, b) => b.sessions - a.sessions || b.lastDateKey.localeCompare(a.lastDateKey));
}

export interface WeekCount { startKey: string; sets: number }

const mondayOf = (d: Date): Date => {
  const m = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  m.setDate(m.getDate() - ((m.getDay() + 6) % 7));
  return m;
};

/** Séries de travail terminées par semaine (lundi au dimanche), les `n` dernières semaines, de la plus ancienne à la semaine en cours. */
export function weeklySets(sets: readonly SetLog[], sessions: readonly WorkoutSession[], today: Date, n = 8): WeekCount[] {
  const ok = new Map(sessions.filter((s) => countsForCurve(s) && !s.imported).map((s) => [s.id, s]));
  const start = mondayOf(today);
  const weeks: WeekCount[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(start);
    d.setDate(d.getDate() - 7 * i);
    weeks.push({ startKey: dateKey(d), sets: 0 });
  }
  for (const s of sets) {
    if (!s.completedAt || s.isWarmup || s.deletedAt || s.pain) continue;
    const sess = ok.get(s.sessionId);
    if (!sess) continue;
    const key = dateKey(mondayOf(sessionDate(sess)));
    const w = weeks.find((x) => x.startKey === key);
    if (w) w.sets += 1;
  }
  return weeks;
}
