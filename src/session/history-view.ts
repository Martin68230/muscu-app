// Écran Historique (niveau 1) : filtres, détail d'une séance, comparaison avec la séance précédente du même type, courbe par exercice.
// Fonctions pures sur les lignes déjà lues dans IndexedDB : aucune écriture, aucune donnée en ligne.
import type { ExerciseRole, PlannedExercise, SetLog, WorkoutSession } from '../data/model';
import { dateKey, sessionDate, type HistoryEntry } from './calendar';
import { fmtKg } from './messages';
import { HOLD_RIR_LABELS, isPerSide } from './sides';

const isWork = (s: SetLog): boolean => !!s.completedAt && !s.isWarmup && !s.deletedAt;

// ----- Filtres de la liste -----
export interface HistoryFilter {
  /** AAAA-MM, ou null = tous les mois. */
  month: string | null;
  /** Nom du jour de programme (« Séance A », « Haut du corps », « Cardio »…), ou null = tous les types. */
  type: string | null;
}

export function filterEntries(entries: readonly HistoryEntry[], f: HistoryFilter): HistoryEntry[] {
  return entries.filter((e) => (f.month === null || e.dateKey.startsWith(f.month)) && (f.type === null || e.label === f.type));
}
/** Mois présents dans l'historique, du plus récent au plus ancien. */
export const monthOptions = (entries: readonly HistoryEntry[]): string[] => [...new Set(entries.map((e) => e.dateKey.slice(0, 7)))].sort().reverse();
/** Types présents (nom du jour de programme), le plus fréquent d'abord puis ordre alphabétique. */
export function typeOptions(entries: readonly HistoryEntry[]): { type: string; count: number }[] {
  const n = new Map<string, number>();
  for (const e of entries) n.set(e.label, (n.get(e.label) ?? 0) + 1);
  return [...n.entries()].map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count || a.type.localeCompare(b.type, 'fr'));
}
export const frMonthKey = (k: string): string => {
  const [y, m] = k.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
};

// ----- Détail d'une séance -----
export interface SideLog {
  side: 'gauche' | 'droite' | null;
  reps: number | null;
  loadKg: number | null;
  holdSec: number | null;
  rir: number | null;
  felt: number | null;
  pain: boolean;
}
export interface SerieDetail {
  setIndex: number;
  /** Variante utilisée pour cette série (peut changer entre séries d’un même exercice). */
  variantId?: string;
  /** Un seul élément, ou deux (gauche puis droite) pour un exercice d'un seul côté. */
  sides: SideLog[];
}
export interface ExerciseDetail {
  index: number;
  movementId: string;
  variantId: string;
  role: ExerciseRole | null;
  perSide: boolean;
  cardio: boolean;
  /** Position tenue (durée, hors cardio). */
  hold: boolean;
  series: SerieDetail[];
  /** Indices (dans le plan) des exercices enchaînés avec celui-ci en superset, parmi ceux qui ont des séries. */
  pairWith: number[];
  /** Meilleures valeurs de la séance (null si absentes). */
  bestLoadKg: number | null;
  bestReps: number | null;
  bestHoldSec: number | null;
}

const SIDE_ORDER = { gauche: 0, droite: 1 } as const;
const sideRank = (s: SideLog['side']): number => (s === null ? 0 : SIDE_ORDER[s]);
const maxOf = (xs: (number | null)[]): number | null => {
  const v = xs.filter((x): x is number => x !== null && x > 0);
  return v.length ? Math.max(...v) : null;
};

export function sessionDetail(session: Pick<WorkoutSession, 'id' | 'plan'>, sets: readonly SetLog[]): ExerciseDetail[] {
  const mine = sets.filter((s) => isWork(s) && s.sessionId === session.id);
  const byIndex = new Map<number, SetLog[]>();
  for (const s of mine) byIndex.set(s.exerciseIndex, [...(byIndex.get(s.exerciseIndex) ?? []), s]);
  const plan = session.plan?.exercises ?? [];
  const out: ExerciseDetail[] = [...byIndex.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([index, rows]) => {
      const first = rows[0];
      const px: PlannedExercise | undefined = plan[index]?.movementId === first.movementId ? plan[index] : undefined;
      const perSide = px ? isPerSide(px) : rows.some((r) => !!r.side);
      const cardio = px?.role === 'cardio';
      const hold = !cardio && (px ? px.unit === 'sec' : rows.some((r) => r.holdSec != null && r.reps == null));
      const bySet = new Map<number, SideLog[]>();
      for (const r of rows) {
        bySet.set(r.setIndex, [...(bySet.get(r.setIndex) ?? []), {
          side: r.side ?? null, reps: r.reps, loadKg: r.loadKg, holdSec: r.holdSec ?? null, rir: r.rir, felt: r.felt ?? null, pain: r.pain,
        }]);
      }
      const variantOfSet = (i: number) => rows.find((r) => r.setIndex === i)?.variantId;
      const series = [...bySet.entries()].sort((a, b) => a[0] - b[0]).map(([setIndex, sides]) => ({ setIndex, variantId: variantOfSet(setIndex), sides: [...sides].sort((a, b) => sideRank(a.side) - sideRank(b.side)) }));
      const all = series.flatMap((s) => s.sides);
      return {
        index, movementId: first.movementId, variantId: first.variantId, role: px?.role ?? null, perSide, cardio, hold, series, pairWith: [],
        bestLoadKg: maxOf(all.map((s) => s.loadKg)), bestReps: maxOf(all.map((s) => s.reps)), bestHoldSec: maxOf(all.map((s) => s.holdSec)),
      };
    });
  // Paires de supersets : seulement si le plan de CETTE séance les déclare (copie du plan faite au lancement).
  for (const d of out) {
    const g = plan[d.index]?.movementId === d.movementId ? plan[d.index].supersetGroup : null;
    if (g) d.pairWith = out.filter((o) => o.index !== d.index && plan[o.index]?.supersetGroup === g).map((o) => o.index);
  }
  return out;
}

/** Nombre d'étapes enregistrées (une série par côté compte deux étapes). */
export const stepCount = (d: ExerciseDetail): number => d.series.reduce((n, s) => n + s.sides.length, 0);

const plural = (n: number, one: string, many: string): string => `${n} ${n > 1 ? many : one}`;
export function fmtDuration(sec: number): string {
  if (sec >= 120 && sec % 60 === 0) return `${sec / 60} min`;
  if (sec >= 60) return `${Math.floor(sec / 60)} min ${String(sec % 60).padStart(2, '0')} s`;
  return `${sec} s`;
}
const feltText = (n: number): string => `encore ${(HOLD_RIR_LABELS[n] ?? '').replace(' +', ' ou plus')} possible`;

/** Texte d'un côté (ou d'une série à deux côtés égaux de lecture) : « 10 répétitions à 20 kg · 2 de réserve ». */
export function sideText(s: SideLog, ex: Pick<ExerciseDetail, 'cardio' | 'hold'>): string {
  const parts: string[] = [];
  if (ex.cardio) parts.push(s.holdSec ? fmtDuration(s.holdSec) : 'fait');
  else if (ex.hold) {
    parts.push(s.holdSec ? `${fmtDuration(s.holdSec)} tenues` : 'tenue');
    if (s.loadKg && s.loadKg > 0) parts.push(`à ${fmtKg(s.loadKg)} kg`);
  } else {
    parts.push(s.reps !== null ? plural(s.reps, 'répétition', 'répétitions') : 'faite');
    if (s.loadKg && s.loadKg > 0) parts[0] += ` à ${fmtKg(s.loadKg)} kg`;
  }
  if (!ex.cardio) {
    if (ex.hold) {
      if (s.felt !== null && s.felt !== undefined) parts.push(feltText(s.felt));
    } else if (s.rir !== null) parts.push(s.rir === 0 ? 'à fond' : `${s.rir} de réserve`);
  }
  if (s.pain) parts.push('douleur');
  return parts.join(' · ');
}

/** « Série 2 : gauche 10 répétitions à 8 kg ; droite 10 répétitions à 8 kg ». */
/** Nom affiché : « Exercice (variante) » ; la variante seule si elle porte déjà le nom, l’exercice seul sans variante connue. */
export function exerciseLabel(ficheNom: string, variantNom: string): string {
  if (!variantNom || variantNom === 'Exercice' || variantNom === ficheNom) return ficheNom;
  if (!ficheNom || ficheNom === 'Exercice') return variantNom;
  return `${ficheNom} (${variantNom})`;
}

export function serieText(serie: SerieDetail, ex: Pick<ExerciseDetail, 'cardio' | 'hold'>, n: number): string {
  const body = serie.sides.map((s) => (s.side ? `${s.side} ${sideText(s, ex)}` : sideText(s, ex))).join(' ; ');
  return `Série ${n} : ${body}`;
}

// ----- Comparaison avec la séance précédente du même type -----
/** Dernière séance terminée, plus ancienne que `current`, portant le même nom de jour de programme et au moins une série de travail. */
export function previousSameType(current: WorkoutSession, sessions: readonly WorkoutSession[], sets: readonly SetLog[]): WorkoutSession | null {
  const label = current.plan?.label;
  if (!label) return null;
  const at = sessionDate(current).getTime();
  const withSets = new Set(sets.filter(isWork).map((s) => s.sessionId));
  const older = sessions
    .filter((s) => s.id !== current.id && !s.deletedAt && s.status === 'faite' && s.endReason !== 'symptome' && s.endReason !== 'abandon' && s.plan?.label === label && withSets.has(s.id) && sessionDate(s).getTime() < at)
    .sort((a, b) => sessionDate(b).getTime() - sessionDate(a).getTime());
  return older[0] ?? null;
}

export interface ExerciseCompare {
  movementId: string;
  index: number;
  kind: 'charge' | 'reps' | 'duree';
  /** La variante n'est pas la même : les charges ne sont pas comparables. */
  variantChanged: boolean;
  seriesNow: number;
  seriesBefore: number;
  dSeries: number;
  loadNow: number | null;
  loadBefore: number | null;
  dLoad: number | null;
  repsNow: number | null;
  repsBefore: number | null;
  dReps: number | null;
  holdNow: number | null;
  holdBefore: number | null;
  dHold: number | null;
}
const diff = (a: number | null, b: number | null): number | null => (a === null || b === null ? null : Math.round((a - b) * 100) / 100);

/** Exercices communs (même fiche), dans l'ordre de la séance actuelle. Aucun exercice commun : liste vide. */
export function compareDetails(now: readonly ExerciseDetail[], before: readonly ExerciseDetail[]): ExerciseCompare[] {
  const out: ExerciseCompare[] = [];
  for (const n of now) {
    const b = before.find((x) => x.movementId === n.movementId);
    if (!b || n.cardio !== b.cardio) continue;
    const variantChanged = n.variantId !== b.variantId;
    const loadNow = n.bestLoadKg;
    const loadBefore = b.bestLoadKg;
    out.push({
      movementId: n.movementId, index: n.index, variantChanged,
      kind: n.cardio || n.hold ? 'duree' : loadNow !== null && loadBefore !== null ? 'charge' : 'reps',
      seriesNow: n.series.length, seriesBefore: b.series.length, dSeries: n.series.length - b.series.length,
      loadNow, loadBefore, dLoad: variantChanged ? null : diff(loadNow, loadBefore),
      repsNow: n.bestReps, repsBefore: b.bestReps, dReps: diff(n.bestReps, b.bestReps),
      holdNow: n.bestHoldSec, holdBefore: b.bestHoldSec, dHold: diff(n.bestHoldSec, b.bestHoldSec),
    });
  }
  return out;
}

/** « +2,5 kg », « −1 répétition », « identique ». */
export function deltaText(d: number | null, unit: 'kg' | 'rep' | 'sec' | 'serie'): string {
  if (d === null) return 'non comparable';
  if (d === 0) return 'identique';
  const sign = d > 0 ? '+' : '−';
  const v = Math.abs(d);
  if (unit === 'kg') return `${sign}${fmtKg(v)} kg`;
  if (unit === 'sec') return `${sign}${v} s`;
  if (unit === 'serie') return `${sign}${plural(v, 'série', 'séries')}`;
  return `${sign}${plural(v, 'répétition', 'répétitions')}`;
}

// ----- Courbe de progression d'un exercice -----
export type CurveMetric = 'charge' | 'reps' | 'duree';
export interface CurvePoint {
  sessionId: string;
  dateKey: string;
  value: number;
}
export const CURVE_MIN_POINTS = 2;

/** Séance qui compte pour la courbe : terminée normalement (ni symptôme, ni abandon), non supprimée. */
const countsForCurve = (s: WorkoutSession): boolean => !s.deletedAt && s.status === 'faite' && s.endReason !== 'symptome' && s.endReason !== 'abandon';

/**
 * Meilleure charge (sinon meilleures répétitions, sinon meilleure durée tenue) de chaque séance, par fiche, de la plus ancienne à la plus récente.
 * Les séries avec douleur ne comptent pas : une douleur n'est jamais un record.
 */
export function curveSeries(movementId: string, sets: readonly SetLog[], sessions: readonly WorkoutSession[]): { metric: CurveMetric; points: CurvePoint[] } {
  const ok = new Map(sessions.filter(countsForCurve).map((s) => [s.id, s]));
  const rows = sets.filter((s) => isWork(s) && s.movementId === movementId && !s.pain && ok.has(s.sessionId));
  const metric: CurveMetric = rows.some((s) => (s.loadKg ?? 0) > 0) ? 'charge' : rows.some((s) => s.reps == null && (s.holdSec ?? 0) > 0) ? 'duree' : 'reps';
  const pick = (s: SetLog): number | null => (metric === 'charge' ? ((s.loadKg ?? 0) > 0 ? s.loadKg : null) : metric === 'duree' ? ((s.holdSec ?? 0) > 0 ? s.holdSec! : null) : (s.reps ?? 0) > 0 ? s.reps : null);
  const best = new Map<string, number>();
  for (const s of rows) {
    const v = pick(s);
    if (v !== null && v > (best.get(s.sessionId) ?? 0)) best.set(s.sessionId, v);
  }
  const points = [...best.entries()]
    .map(([id, value]) => ({ sessionId: id, dateKey: dateKey(sessionDate(ok.get(id)!)), value, at: sessionDate(ok.get(id)!).getTime() }))
    .sort((a, b) => a.at - b.at)
    .map(({ at: _at, ...p }) => p);
  return { metric, points };
}

export interface CurveGeometry {
  xy: { x: number; y: number }[];
  min: number;
  max: number;
  path: string;
}
/** Points dans un cadre w x h (marges l, r, t, b) ; espacement régulier (une séance = un point), y vers le bas. */
export function curveGeometry(values: readonly number[], w: number, h: number, pad: { l: number; r: number; t: number; b: number }): CurveGeometry {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const xy = values.map((v, i) => ({
    x: values.length === 1 ? pad.l + iw / 2 : pad.l + (iw * i) / (values.length - 1),
    y: max === min ? pad.t + ih / 2 : pad.t + ih - ((v - min) / (max - min)) * ih,
  }));
  const r = (n: number) => Math.round(n * 10) / 10;
  return { xy, min, max, path: xy.map((p, i) => `${i ? 'L' : 'M'}${r(p.x)} ${r(p.y)}`).join(' ') };
}

export const CURVE_LEGEND: Record<CurveMetric, string> = {
  charge: 'Chaque point est une séance : ta meilleure charge, en kg.',
  reps: 'Chaque point est une séance : ton meilleur nombre de répétitions.',
  duree: 'Chaque point est une séance : ta meilleure durée tenue, en secondes.',
};
