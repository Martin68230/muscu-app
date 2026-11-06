// Données de la carte des muscles (niveau 3) : statuts gris / orange / rouge par zone, pour 5 vues. Module PUR : tout se recalcule depuis
// les fiches et le programme ou l'historique, rien n'est stocké ni envoyé.
//
// VUES SÉANCE et CYCLE (décision de l’utilisateur du 06/11/2026) : couleur selon le RÔLE des exercices, sans aucune mise à l’échelle.
// Rouge = au moins 2 exercices l’ont en muscle principal, OU 1 en principal et au moins 2 autres en secondaire ; une zone jamais en principal
// est plafonnée à orange ; orange = autre cas au-dessus du seuil gris de zoneStatus ; gris sinon. Les points affichés sont ceux de la séance.
// Vue SEMAINE : zoneStatus (points contre seuils de l’objectif, la même échelle que le générateur), inchangée.
import { pointsByZone, thresholdsOf, zoneCoefs, zoneStatus, ZONES, type ZoneFiche, type ZoneId, type ZoneSet, type ZoneStatus } from './zones';

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
export function statusesFromPoints(points: Readonly<PointsMap>, objectif: string | null | undefined): StatusMap {
  const out = allGris();
  for (const z of ZONES) out[z.id] = zoneStatus(points[z.id] ?? 0, z.id, objectif);
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

/** Exercices distincts d’une liste de séries (les séries d’une même fiche sont regroupées : une fiche = un exercice). */
function mergeByFiche(sets: readonly ZoneSet[]): ZoneSet[] {
  const by = new Map<string, ZoneSet>();
  for (const s of sets) {
    if (s.warmup) continue;
    const n = (s.sets ?? 1) * (s.side ? 0.5 : 1);
    const cur = by.get(s.ficheId);
    if (cur) cur.sets = (cur.sets ?? 0) + n;
    else by.set(s.ficheId, { ficheId: s.ficheId, sets: n });
  }
  return [...by.values()];
}

/**
 * Statuts par RÔLE des exercices (vues séance et cycle) : `exercises` = un élément par exercice. Rouge : au moins 2 exercices en principal,
 * ou 1 en principal et au moins 2 autres en secondaire ; jamais en principal : orange au plus ; au-dessus du seuil gris (points non mis à l’échelle).
 */
export function roleStatuses(exercises: readonly ZoneSet[], fiches: Fiches, points: Readonly<PointsMap>, objectif?: string | null): StatusMap {
  const byId = 'get' in fiches ? (fiches as ReadonlyMap<string, ZoneFiche>) : new Map((fiches as readonly ZoneFiche[]).map((f) => [f.id, f]));
  const principal: Record<string, number> = {};
  const second: Record<string, number> = {};
  for (const e of exercises) {
    const f = byId.get(e.ficheId);
    if (!f || !(e.sets ?? 1)) continue;
    const prin = zoneCoefs({ ...f, musclesSecondaires: [] });
    const sec = zoneCoefs({ ...f, musclesPrincipaux: [...f.musclesSecondaires], musclesSecondaires: [] });
    for (const [z, c] of prin) if (c > 0) principal[z] = (principal[z] ?? 0) + 1;
    for (const [z, c] of sec) if (c > 0 && !((prin.get(z) ?? 0) > 0)) second[z] = (second[z] ?? 0) + 1;
  }
  const out = allGris();
  for (const z of ZONES) {
    const p = principal[z.id] ?? 0;
    const s = second[z.id] ?? 0;
    if ((points[z.id] ?? 0) < thresholdsOf(z.id, objectif).gris) continue;
    out[z.id] = p >= 2 || (p >= 1 && s >= 2) ? 'rouge' : 'orange';
  }
  return out;
}

/** Vue « séance » (prévue ou faite) : points de la séance (sans mise à l’échelle), couleur selon le rôle des exercices. */
export function sessionMap(sets: readonly ZoneSet[], fiches: Fiches, objectif?: string | null): ZoneMap {
  const points = pointsByZone(sets, fiches);
  return { points, statuses: roleStatuses(mergeByFiche(sets), fiches, points, objectif) };
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

/** Un groupe de séances : points cumulés, couleur selon le rôle des exercices de toutes les séances du groupe. */
function groupMap(days: readonly MapDay[], fiches: Fiches, objectif?: string | null): ZoneMap {
  const points = pointsByZone(days.flatMap((d) => setsOfExercises(d.exercises)), fiches);
  return { points, statuses: roleStatuses(days.flatMap((d) => mergeByFiche(setsOfExercises(d.exercises))), fiches, points, objectif) };
}

/** Vue « cycle » : une carte par groupe de séances de la semaine type (dans l'ordre haut, bas, poussée, tirage, jambes, corps entier). */
export function cycleMaps(days: readonly MapDay[], fiches: Fiches, objectif?: string | null): { group: string; label: string; count: number; map: ZoneMap }[] {
  const byGroup = new Map<string, MapDay[]>();
  for (const d of days) {
    if (!d.exercises.some((e) => e.role !== 'cardio')) continue;
    const g = CYCLE_GROUPS[d.sessionType ?? 'CE'] ?? 'corps_entier';
    byGroup.set(g, [...(byGroup.get(g) ?? []), d]);
  }
  return CYCLE_ORDER.filter((g) => byGroup.has(g)).map((g) => ({ group: g, label: CYCLE_LABELS[g], count: byGroup.get(g)!.length, map: groupMap(byGroup.get(g)!, fiches, objectif) }));
}

/** Nombre de séries affiché : « 7 », « 7,5 » (au demi près). */
export const fmtPoints = (p: number): string => (Math.round(p * 2) / 2).toLocaleString('fr-FR');
