// Alertes de sécurité du rythme de poids et recalage hebdomadaire de la cible (docs/nutrition-spec.md §5.5-5.6 ; nutrition-rules.md C, D, E).
// Fonctions PURES. Aucun message n'est alarmant ; aucune alerte n'est partagée.

import {
  AJUSTEMENT_CUMUL_PCT, AJUSTEMENT_MAX_KCAL, GEL_PERTE_PCT_MOIS, GEL_PERTE_PCT_SEMAINE, IMC_REPERES, N_PESEES_MIN, PERTE_PCT_PLAFOND,
  RECALAGE_TOL_MIN_KG, RECALAGE_TOL_PCT, STABLE_KG_SEMAINE, TAILLE_CM_MAX, TAILLE_CM_MIN,
} from './config';
import { bmi, type GoalKind } from './needs';
import type { TrendPoint } from './weight-trend';

export type Adherence = 'oui' | 'peu_pres' | 'non' | null;

export type AlertKey =
  | 'rythme_trop_rapide' // perte du poids lissé > plafond 2 semaines de suite : la cible monte
  | 'gel_deficit' // perte > 2 %/semaine ou > 5 %/mois hors objectif de perte : plus de déficit, orientation vers un professionnel
  | 'perte_non_voulue'; // perte rapide en mode « garder » ou « prendre »

const WEEK_MS = 7 * 86_400_000;

function pctChangePerWeek(a: TrendPoint, b: TrendPoint): number {
  const weeks = (Date.parse(`${b.weekStart}T00:00:00Z`) - Date.parse(`${a.weekStart}T00:00:00Z`)) / WEEK_MS;
  if (!(weeks > 0) || !(a.trend > 0)) return 0;
  return (((b.trend - a.trend) / a.trend) * 100) / weeks;
}

export interface AlertInput {
  trend: readonly TrendPoint[];
  goal: GoalKind;
}

/** Alertes à partir du poids lissé (une semaine = un point). Moins de 3 points : aucune alerte (une pesée isolée ne décide jamais). */
export function evaluateAlerts({ trend: rawTrend, goal }: AlertInput): AlertKey[] {
  const out = new Set<AlertKey>();
  // Points triés, uniques par semaine, valeurs finies (un point invalide est ignoré, jamais interprété).
  const trend = [...new Map(rawTrend.filter((p) => Number.isFinite(p.trend) && p.trend > 0 && Number.isFinite(Date.parse(p.weekStart))).map((p) => [p.weekStart, p])).values()].sort((a, b) => (a.weekStart < b.weekStart ? -1 : 1));
  if (trend.length < N_PESEES_MIN) return [];
  const n = trend.length;
  const w1 = pctChangePerWeek(trend[n - 2], trend[n - 1]);
  const w2 = pctChangePerWeek(trend[n - 3], trend[n - 2]);
  const lossPct = (x: number) => -x; // positif = perte
  if (goal === 'perte' && lossPct(w1) > PERTE_PCT_PLAFOND && lossPct(w2) > PERTE_PCT_PLAFOND) out.add('rythme_trop_rapide');
  if (lossPct(w1) > GEL_PERTE_PCT_SEMAINE) out.add('gel_deficit');
  // Perte de plus de 5 % du poids lissé sur ~4 semaines sans objectif de perte.
  if (n >= 5 && goal !== 'perte') {
    const a = trend[n - 5];
    const b = trend[n - 1];
    if (a.trend > 0 && ((a.trend - b.trend) / a.trend) * 100 > GEL_PERTE_PCT_MOIS) out.add('gel_deficit');
  }
  if (goal !== 'perte' && lossPct(w1) > PERTE_PCT_PLAFOND) out.add('perte_non_voulue');
  return [...out];
}

/** Poids cible refusé s'il donne un IMC sous le seuil (règle C). Taille hors bornes : refusé. */
export function targetAllowed(targetKg: number, heightCm: number): boolean {
  if (!(targetKg > 0) || !(heightCm >= TAILLE_CM_MIN && heightCm <= TAILLE_CM_MAX)) return false;
  return bmi(targetKg, heightCm) >= IMC_REPERES;
}

export interface AdjustInput {
  /** Ajustement déjà appliqué (kcal/j, négatif ou positif). */
  currentAdjust: number;
  /** Besoin initial estimé, pour le cumul maximal (± 15 %). */
  tdeeInitial: number;
  goal: GoalKind;
  /** Rythme réel en kg/semaine (négatif = perte) ; null si pas assez de données. */
  rateKgPerWeek: number | null;
  /** Rythme visé en kg/semaine (négatif en perte, positif en prise, 0 en maintien). */
  targetKgPerWeek: number;
  adherence: Adherence;
  /** Nombre de points hebdomadaires du poids lissé. */
  weeksOfData: number;
}

/**
 * Nouvel ajustement de la cible, une fois par semaine : jamais plus de ± 150 kcal/j par semaine, cumul limité à ± 15 % du besoin initial.
 * Adhérence « non » ou inconnue, pas assez de données : AUCUN changement (on ne baisse jamais les calories parce que le plan n'a pas été suivi).
 * OBLIGATION de l'appelant : ne JAMAIS utiliser ce nombre seul ; la cible affichée est `adjustedTarget(needs, ajustement, objectif, prudent)` (needs.ts),
 * qui applique le plancher, le déficit maximal et le surplus maximal.
 */
export function nextAdjust(i: AdjustInput): number {
  if (!Number.isFinite(i.currentAdjust)) return 0;
  if (!Number.isFinite(i.tdeeInitial) || i.tdeeInitial <= 0) return i.currentAdjust;
  if (i.adherence !== 'oui' && i.adherence !== 'peu_pres') return i.currentAdjust;
  if (i.rateKgPerWeek == null || i.weeksOfData < N_PESEES_MIN) return i.currentAdjust;
  const tol = Math.max(RECALAGE_TOL_MIN_KG, Math.abs(i.targetKgPerWeek) * RECALAGE_TOL_PCT);
  const gap = i.rateKgPerWeek - i.targetKgPerWeek; // > 0 : le poids monte plus (ou baisse moins) que visé
  let step = 0;
  if (Math.abs(gap) > tol) step = gap > 0 ? -AJUSTEMENT_MAX_KCAL : AJUSTEMENT_MAX_KCAL;
  if (i.goal === 'maintien' && Math.abs(i.rateKgPerWeek) <= STABLE_KG_SEMAINE) step = 0;
  // En perte, jamais de baisse supplémentaire si la perte réelle dépasse déjà le plafond (la cible monte plutôt) ; en prise, l'inverse.
  const cap = i.tdeeInitial * AJUSTEMENT_CUMUL_PCT;
  const next = i.currentAdjust + step;
  return Math.max(-cap, Math.min(cap, next));
}
