// Données de la carte des muscles (niveau 3) : statuts gris / orange / rouge par zone, pour 5 vues. Module PUR : tout se recalcule depuis
// les fiches et le programme ou l'historique, rien n'est stocké ni envoyé.
//
// ÉCHELLE UNIQUE (décision de l'utilisateur du 06/11/2026) : la carte utilise zoneStatus, la MÊME échelle que le générateur (seuils de
// l'objectif principal : knowledge/zones-musculaires.md) dans toutes les vues ; un rouge veut toujours dire « seuil atteint ». Aucune échelle
// d'affichage séparée : une semaine presque toute rouge est le résultat attendu ; les points de chaque zone s'affichent au toucher.
import { pointsByZone, zoneCoefs, zoneStatus, ZONES, type ZoneFiche, type ZoneId, type ZoneSet, type ZoneStatus } from './zones';

export type StatusMap = Record<ZoneId, ZoneStatus>;
export type PointsMap = Record<ZoneId, number>;
/** Statuts et points (points de la période affichée : séance, semaine, groupe de séances). */
export interface ZoneMap { statuses: StatusMap; points: PointsMap }
/** Ce qu'il faut d'un exercice prévu : la fiche et le nombre de séries de travail. */
export interface MapExercise { movementId: string; sets: number; role?: string }
export interface MapDay { exercises: readonly MapExercise[]; sessionType?: string }
/** Série enregistrée (SetLog) : seuls ces champs servent ; échauffement, série non faite ou supprimée = 0 point. */
export interface MapLog { sessionId?: string; movementId: string; completedAt: string | null; isWarmup?: boolean; side?: 'gauche' | 'droite' | null; deletedAt?: string | null }
type Fiches = ReadonlyMap<string, ZoneFiche> | readonly ZoneFiche[];

/** Réglage : sans nombre de séances connu, une séance est rapportée à une semaine de 3 séances. */
export const DEFAULT_SESSIONS_PER_WEEK = 3;

const allGris = (): StatusMap => Object.fromEntries(ZONES.map((z) => [z.id, 'gris' as ZoneStatus]));

/** Séries prévues (hors cardio). */
export const setsOfExercises = (exs: readonly MapExercise[]): ZoneSet[] =>
  exs.filter((e) => e.role !== 'cardio').map((e) => ({ ficheId: e.movementId, sets: e.sets }));

/** Séries faites d'une séance (ou de toutes si `sessionId` est absent) : une ligne = une série, un seul côté = une demi-série. */
export const setsOfLogs = (logs: readonly MapLog[], sessionId?: string): ZoneSet[] =>
  logs
    .filter((s) => !s.deletedAt && s.completedAt && !s.isWarmup && (sessionId === undefined || s.sessionId === sessionId))
    .map((s) => ({ ficheId: s.movementId, sets: 1, side: s.side ?? null }));

/** Statuts depuis des points ; `fraction` < 1 = une seule séance (points ramenés à la semaine pour l'échelle). */
export function statusesFromPoints(points: Readonly<PointsMap>, objectif: string | null | undefined, fraction = 1): StatusMap {
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

/** Vue « séance » (prévue ou faite) : points de la séance, échelle d'une séance sur `sessionsPerWeek`. */
export function sessionMap(sets: readonly ZoneSet[], fiches: Fiches, sessionsPerWeek = DEFAULT_SESSIONS_PER_WEEK, objectif?: string | null): ZoneMap {
  const points = pointsByZone(sets, fiches);
  return { points, statuses: statusesFromPoints(points, objectif, 1 / Math.max(1, sessionsPerWeek)) };
}

/** Vue « semaine » : toutes les séances prévues d'une semaine (le cardio ne compte pas). */
export function weekMap(days: readonly MapDay[], fiches: Fiches, objectif?: string | null): ZoneMap {
  const points = pointsByZone(days.flatMap((d) => setsOfExercises(d.exercises)), fiches);
  return { points, statuses: statusesFromPoints(points, objectif) };
}

/** Groupes de la vue « cycle » : haut / bas, poussée / tirage / jambes (d'après le type de séance du générateur). */
export const CYCLE_GROUPS: Record<string, string> = { HAUT: 'haut', BAS: 'bas', PUSH: 'poussee', PULL: 'tirage', LEGS: 'jambes', CE: 'corps_entier' };
export const CYCLE_LABELS: Record<string, string> = { haut: 'Haut du corps', bas: 'Bas du corps', poussee: 'Poussée', tirage: 'Tirage', jambes: 'Jambes', corps_entier: 'Corps entier' };
const CYCLE_ORDER = ['haut', 'bas', 'poussee', 'tirage', 'jambes', 'corps_entier'];

/** Vue « cycle » : une carte par groupe de séances de la semaine type (dans l'ordre haut, bas, poussée, tirage, jambes, corps entier). */
export function cycleMaps(days: readonly MapDay[], fiches: Fiches, objectif?: string | null): { group: string; label: string; count: number; map: ZoneMap }[] {
  const byGroup = new Map<string, MapDay[]>();
  for (const d of days) {
    if (!d.exercises.some((e) => e.role !== 'cardio')) continue;
    const g = CYCLE_GROUPS[d.sessionType ?? 'CE'] ?? 'corps_entier';
    byGroup.set(g, [...(byGroup.get(g) ?? []), d]);
  }
  return CYCLE_ORDER.filter((g) => byGroup.has(g)).map((g) => ({ group: g, label: CYCLE_LABELS[g], count: byGroup.get(g)!.length, map: weekMap(byGroup.get(g)!, fiches, objectif) }));
}

/** Nombre de séries affiché : « 7 », « 7,5 » (au demi près). */
export const fmtPoints = (p: number): string => (Math.round(p * 2) / 2).toLocaleString('fr-FR');
