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

// ----- Volume par groupe musculaire et historique des records -----
export interface MuscleGroup { id: string; label: string; muscles: readonly string[] }
/** Groupes affichés : on regroupe les muscles des fiches (champ musclesPrincipaux) pour garder des puces lisibles à 375 px. */
export const MUSCLE_GROUPS: readonly MuscleGroup[] = [
  { id: 'pectoraux', label: 'Pectoraux', muscles: ['pectoraux'] },
  { id: 'dos', label: 'Dos', muscles: ['grand_dorsal', 'rhomboides', 'trapezes', 'erecteurs_rachis', 'carre_des_lombes'] },
  { id: 'epaules', label: 'Épaules', muscles: ['deltoides_anterieurs', 'deltoides_lateraux', 'deltoides_posterieurs', 'coiffe_des_rotateurs', 'dentele_anterieur'] },
  { id: 'bras', label: 'Bras', muscles: ['biceps', 'triceps', 'avant_bras'] },
  { id: 'tronc', label: 'Abdos et tronc', muscles: ['abdominaux', 'obliques', 'transverse'] },
  { id: 'fessiers', label: 'Fessiers', muscles: ['fessiers', 'moyen_fessier'] },
  { id: 'cuisses', label: 'Cuisses', muscles: ['quadriceps', 'ischios', 'adducteurs', 'flechisseurs_hanche'] },
  { id: 'mollets', label: 'Mollets', muscles: ['mollets', 'tibial_anterieur', 'peroniers'] },
];

/** Groupes dont la fiche travaille un muscle PRINCIPAL (un exercice peut compter dans plusieurs groupes). */
export function groupsOfMuscles(principaux: readonly string[]): string[] {
  return MUSCLE_GROUPS.filter((g) => principaux.some((m) => g.muscles.includes(m))).map((g) => g.id);
}

export interface WeekMetric { startKey: string; sets: number; tonnage: number }

/**
 * Séries de travail et tonnage (charge x répétitions, séries chargées seulement) par semaine, pour les exercices acceptés par `include`.
 * Mêmes exclusions que weeklySets : douleur, échauffement, séance abandonnée / avec symptôme, séance importée.
 */
export function weeklyMetrics(sets: readonly SetLog[], sessions: readonly WorkoutSession[], today: Date, include: (movementId: string) => boolean = () => true, n = 8): WeekMetric[] {
  const ok = new Map(sessions.filter((s) => countsForCurve(s) && !s.imported).map((s) => [s.id, s]));
  const start = mondayOf(today);
  const weeks: WeekMetric[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(start);
    d.setDate(d.getDate() - 7 * i);
    weeks.push({ startKey: dateKey(d), sets: 0, tonnage: 0 });
  }
  for (const s of sets) {
    if (!s.completedAt || s.isWarmup || s.deletedAt || s.pain || !include(s.movementId)) continue;
    const sess = ok.get(s.sessionId);
    if (!sess) continue;
    const w = weeks.find((x) => x.startKey === dateKey(mondayOf(sessionDate(sess))));
    if (!w) continue;
    w.sets += 1;
    if ((s.loadKg ?? 0) > 0 && (s.reps ?? 0) > 0) w.tonnage += Math.round((s.loadKg as number) * (s.reps as number));
  }
  return weeks;
}

export interface RecordStep { dateKey: string; value: number }

/** Historique des records d'un exercice : seulement les séances qui ont battu le meilleur résultat précédent (la plus récente en premier). */
export function recordHistory(movementId: string, sets: readonly SetLog[], sessions: readonly WorkoutSession[]): { metric: CurveMetric; steps: RecordStep[] } {
  const { metric, points } = curveSeries(movementId, sets, sessions.filter((s) => !s.imported));
  const steps: RecordStep[] = [];
  let top = 0;
  for (const p of points) {
    if (p.value > top) { steps.push({ dateKey: p.dateKey, value: p.value }); top = p.value; }
  }
  return { metric, steps: steps.reverse() };
}
