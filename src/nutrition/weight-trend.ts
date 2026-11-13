// Poids lissé, rythme réel et phrase d'interprétation (docs/nutrition-spec.md §5, nutrition-rules.md D).
// Fonctions PURES : aucun accès base. Une pesée par semaine suffit ; plusieurs pesées d'une même semaine sont moyennées.

import {
  ALPHA_HEBDO, ALERTE_SAUT_KG, ECART_HASARD_KG, N_PESEES_MIN, RYTHME_JOURS_MIN, POIDS_KG_MAX, POIDS_KG_MIN, STABLE_KG_SEMAINE,
  RYTHME_TOL_BAS, RYTHME_TOL_HAUT,
} from './config';

export interface WeighIn {
  /** 'YYYY-MM-DD' */
  date: string;
  kg: number;
  /** Pesée « non représentative » (maladie, voyage) : conservée mais exclue du lissage. */
  excluded?: boolean;
}

export interface TrendPoint {
  /** Lundi de la semaine, 'YYYY-MM-DD'. */
  weekStart: string;
  /** Moyenne des pesées de la semaine. */
  raw: number;
  /** Poids lissé après cette semaine. */
  trend: number;
}

const DAY_MS = 86_400_000;

function parse(date: string): number {
  return Date.parse(`${date}T00:00:00Z`);
}

/** Lundi de la semaine (0 = lundi), en 'YYYY-MM-DD'. */
export function weekStartOf(date: string): string {
  const t = parse(date);
  const dow = (new Date(t).getUTCDay() + 6) % 7;
  return new Date(t - dow * DAY_MS).toISOString().slice(0, 10);
}

export function isPlausibleWeight(kg: number): boolean {
  return Number.isFinite(kg) && kg >= POIDS_KG_MIN && kg <= POIDS_KG_MAX;
}

/** Moyenne par semaine (pesées exclues ou invraisemblables ignorées), triée par date. */
export function weeklyPoints(weighIns: readonly WeighIn[]): { weekStart: string; raw: number }[] {
  const byWeek = new Map<string, number[]>();
  for (const w of weighIns) {
    if (w.excluded || !isPlausibleWeight(w.kg) || !Number.isFinite(parse(w.date))) continue;
    const k = weekStartOf(w.date);
    byWeek.set(k, [...(byWeek.get(k) ?? []), w.kg]);
  }
  return [...byWeek.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([weekStart, kgs]) => ({ weekStart, raw: kgs.reduce((s, x) => s + x, 0) / kgs.length }));
}

/**
 * Lissage exponentiel : T0 = P0, Tn = Tn-1 + alpha (Pn - Tn-1). Une semaine sans pesée n'invente pas de point.
 * Propriété : chaque valeur lissée reste dans [min, max] des points.
 */
export function smoothWeights(weighIns: readonly WeighIn[], alphaIn: number = ALPHA_HEBDO): TrendPoint[] {
  const alpha = Number.isFinite(alphaIn) ? Math.min(1, Math.max(0.01, alphaIn)) : ALPHA_HEBDO;
  const pts = weeklyPoints(weighIns);
  const out: TrendPoint[] = [];
  for (const p of pts) {
    const prev = out.length ? out[out.length - 1].trend : p.raw;
    out.push({ weekStart: p.weekStart, raw: p.raw, trend: out.length ? prev + alpha * (p.raw - prev) : p.raw });
  }
  return out;
}

/** Rythme réel en kg par semaine : pente du poids lissé sur les 3 dernières semaines avec pesée ; null si pas assez de données. */
export function rateKgPerWeek(trend: readonly TrendPoint[]): { kgPerWeek: number; pctPerWeek: number } | null {
  if (trend.length < N_PESEES_MIN) return null;
  const last = trend.slice(-3);
  const days = (parse(last[last.length - 1].weekStart) - parse(last[0].weekStart)) / DAY_MS;
  if (days < RYTHME_JOURS_MIN) return null;
  const kgPerWeek = ((last[last.length - 1].trend - last[0].trend) / days) * 7;
  const base = last[last.length - 1].trend;
  return { kgPerWeek, pctPerWeek: (kgPerWeek / base) * 100 };
}

export type TrendState = 'pas_assez' | 'stable' | 'en_avance' | 'dans_le_rythme' | 'plus_lent' | 'plus_rapide';

/**
 * Six états, jamais de jugement. `targetKgPerWeek` : négatif pour une perte, positif pour une prise, 0 ou null = maintien.
 * Tolérance : 25 % du rythme visé (PROVISOIRE, règle d'app), 0,15 kg/semaine en maintien.
 */
export function interpretTrend(rate: { kgPerWeek: number } | null, targetKgPerWeek: number | null): TrendState {
  if (!rate) return 'pas_assez';
  const target = targetKgPerWeek ?? 0;
  if (Math.abs(target) < 1e-9) return Math.abs(rate.kgPerWeek) <= STABLE_KG_SEMAINE ? 'stable' : rate.kgPerWeek > 0 ? 'plus_rapide' : 'plus_lent';
  const ratio = rate.kgPerWeek / target; // même signe = bon sens
  if (ratio < 0) return 'plus_lent';
  if (ratio > RYTHME_TOL_HAUT) return 'plus_rapide';
  if (ratio < RYTHME_TOL_BAS) return 'plus_lent';
  return 'dans_le_rythme';
}

/** Une pesée isolée très éloignée de la tendance : message « écart ponctuel normal ». */
export function isRandomSpike(rawKg: number, trendKg: number): boolean {
  return Math.abs(rawKg - trendKg) > ECART_HASARD_KG;
}

/** Saut d'une semaine à l'autre qui demande de vérifier la balance ou la saisie. */
export function isSuspiciousJump(prevKg: number, newKg: number): boolean {
  return Math.abs(newKg - prevKg) > ALERTE_SAUT_KG;
}
