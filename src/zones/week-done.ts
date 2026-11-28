// Rapport de la semaine (idée 2, 25/11/2026) : carte des zones réellement travaillées depuis lundi, séances du programme ET séances créées
// (« Créer une séance », automatique ou choisie à la main). Mêmes séries que la courbe de volume (weeklySets) : séance faite, ni abandon ni
// symptôme, ni importée ; série de travail terminée, sans douleur. Fonction pure, calcul local, rien n'est stocké.
import type { SetLog, WorkoutSession } from '../data/model';
import { sessionDate } from '../session/calendar';
import { countsForCurve } from '../session/history-view';
import { coveredZones, sessionMap, setsOfLogs, statusesFromPoints, type ZoneMap } from './map-data';

type Fiches = Parameters<typeof coveredZones>[1];

export const mondayOf = (d: Date): Date => {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
};

/** Séries comptées cette semaine (lundi -> aujourd'hui) et carte des zones ; null si aucune série. */
export function weekDoneMap(sets: readonly SetLog[], sessions: readonly WorkoutSession[], today: Date, fiches: Fiches, objectif?: string | null): { map: ZoneMap; sets: number; created: number } | null {
  const start = mondayOf(today).getTime();
  const ok = new Map(sessions.filter((s) => countsForCurve(s) && !s.imported && sessionDate(s).getTime() >= start).map((s) => [s.id, s]));
  const logs = sets.filter((s) => !s.pain && ok.has(s.sessionId));
  const done = setsOfLogs(logs);
  if (!done.length) return null;
  // Points de séance non mis à l'échelle (sessionMap), puis statuts de la vue « semaine » (comme weekMap).
  const points = sessionMap(done, fiches, objectif).points;
  const created = new Set(logs.filter((s) => !!ok.get(s.sessionId)?.created).map((s) => s.sessionId)).size;
  return { map: { points, statuses: statusesFromPoints(points, objectif, coveredZones(done, fiches)) }, sets: done.length, created };
}
