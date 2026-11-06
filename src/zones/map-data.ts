// Données de la carte des muscles (niveau 3) : statuts gris / orange / rouge par zone, pour 4 vues. Module PUR : tout se recalcule depuis
// les fiches et le programme ou l'historique, rien n'est stocké. Seuils : zoneStatus (knowledge/zones-correspondance.json, PROVISOIRE).
import { pointsByZone, zoneCoefs, zoneStatus, ZONES, type ZoneFiche, type ZoneId, type ZoneSet, type ZoneStatus } from './zones';

export type StatusMap = Record<ZoneId, ZoneStatus>;
/** Ce qu'il faut d'un exercice prévu ou fait : la fiche et le nombre de séries de travail. */
export interface MapExercise { movementId: string; sets: number; role?: string }
export interface MapDay { exercises: readonly MapExercise[]; sessionType?: string }
type Fiches = ReadonlyMap<string, ZoneFiche> | readonly ZoneFiche[];

/** Réglage (décision du 06/11/2026) : en vue « séance », les seuils de la semaine sont rapportés à une séance sur `sessionsPerWeek`. */
export const DEFAULT_SESSIONS_PER_WEEK = 3;

const allGris = (): StatusMap => Object.fromEntries(ZONES.map((z) => [z.id, 'gris' as ZoneStatus]));
const setsOf = (exs: readonly MapExercise[]): ZoneSet[] => exs.filter((e) => e.role !== 'cardio').map((e) => ({ ficheId: e.movementId, sets: e.sets }));

/** Statuts depuis des points : seuils de l'objectif ; `fraction` < 1 = vue d'une seule séance (points ramenés à la semaine). */
export function statusesFromPoints(points: Readonly<Record<ZoneId, number>>, objectif: string | null | undefined, fraction = 1): StatusMap {
  const out = allGris();
  for (const z of ZONES) out[z.id] = zoneStatus((points[z.id] ?? 0) / fraction, z.id, objectif);
  return out;
}

/** Vue « un exercice » (fiche) : rouge = zones des muscles principaux, orange = zones des muscles secondaires seulement, gris sinon. */
export function statusesForExercise(f: ZoneFiche): StatusMap {
  const out = allGris();
  const principal = zoneCoefs({ ...f, musclesSecondaires: [] });
  const second = zoneCoefs({ ...f, musclesPrincipaux: [...f.musclesSecondaires], musclesSecondaires: [] });
  for (const [z, c] of second) if (c > 0) out[z] = 'orange';
  for (const [z, c] of principal) if (c > 0) out[z] = 'rouge';
  return out;
}

/** Vue « séance » : séries prévues de la séance, seuils d'une séance sur `sessionsPerWeek`. */
export function statusesForSession(exercises: readonly MapExercise[], fiches: Fiches, objectif: string | null | undefined, sessionsPerWeek = DEFAULT_SESSIONS_PER_WEEK): StatusMap {
  return statusesFromPoints(pointsByZone(setsOf(exercises), fiches), objectif, 1 / Math.max(1, sessionsPerWeek));
}

/** Vue « semaine » : toutes les séances d'une semaine, seuils hebdomadaires. */
export function statusesForWeek(days: readonly MapDay[], fiches: Fiches, objectif: string | null | undefined): StatusMap {
  return statusesFromPoints(pointsByZone(days.flatMap((d) => setsOf(d.exercises)), fiches), objectif);
}

/** Groupes de la vue « cycle » : haut / bas, poussée / tirage / jambes (d'après le type de séance du générateur). */
export const CYCLE_GROUPS: Record<string, string> = { HAUT: 'haut', BAS: 'bas', PUSH: 'poussee', PULL: 'tirage', LEGS: 'jambes', CE: 'corps_entier' };
export const CYCLE_LABELS: Record<string, string> = { haut: 'Haut du corps', bas: 'Bas du corps', poussee: 'Poussée', tirage: 'Tirage', jambes: 'Jambes', corps_entier: 'Corps entier' };

/** Vue « cycle » : une carte par type de séance du cycle (points de la semaine type regroupés par groupe). Séances sans type = corps entier. */
export function statusesForCycle(days: readonly MapDay[], fiches: Fiches, objectif: string | null | undefined): Record<string, StatusMap> {
  const byGroup = new Map<string, MapDay[]>();
  for (const d of days) {
    const g = CYCLE_GROUPS[d.sessionType ?? 'CE'] ?? 'corps_entier';
    byGroup.set(g, [...(byGroup.get(g) ?? []), d]);
  }
  return Object.fromEntries([...byGroup].map(([g, ds]) => [g, statusesForWeek(ds, fiches, objectif)]));
}
