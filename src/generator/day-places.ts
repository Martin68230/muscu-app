// Lieu par jour (24/11/2026) : « Salle », « Maison », « Dehors » ou « Repos » pour chacun des 7 jours ; la séance d'un jour se construit avec le
// matériel du lieu de CE jour. Sans réglage, le lieu unique du profil vaut pour tous les jours (aucun changement pour les profils existants).
import type { DayPlace } from '../data/model';

export const DAY_PLACES: readonly DayPlace[] = ['salle', 'maison', 'dehors', 'repos'];
export type TrainingDayPlace = Exclude<DayPlace, 'repos'>;

/** 7 valeurs valides (0 = lundi) ou null. */
export function validDayPlaces(dp: readonly string[] | null | undefined): DayPlace[] | null {
  if (!dp || dp.length !== 7) return null;
  return dp.every((x) => DAY_PLACES.includes(x as DayPlace)) ? (dp as DayPlace[]) : null;
}

/** Jours de repos (aucune séance), à ajouter aux jours impossibles. */
export const restDays = (dp: readonly DayPlace[] | null): number[] => (dp ? dp.flatMap((x, i) => (x === 'repos' ? [i] : [])) : []);

/** Lieu dominant des jours d'entraînement (salle d'abord à égalité) : sert de lieu « général » du programme (cardio, explications). */
export function dominantPlace(dp: readonly DayPlace[] | null): TrainingDayPlace | null {
  if (!dp) return null;
  const n: Record<TrainingDayPlace, number> = { salle: 0, maison: 0, dehors: 0 };
  for (const x of dp) if (x !== 'repos') n[x]++;
  const best = (['salle', 'maison', 'dehors'] as const).reduce((a, b) => (n[b] > n[a] ? b : a));
  return n[best] ? best : null;
}

/** Lieu le plus restrictif des jours d'entraînement (dehors, puis maison, puis salle) : contexte général du programme (correctifs, mollets, compléments), jamais plus ouvert que le jour le plus fermé. */
export function restrictivePlace(dp: readonly DayPlace[] | null): TrainingDayPlace | null {
  if (!dp) return null;
  for (const p of ['dehors', 'maison', 'salle'] as const) if (dp.includes(p)) return p;
  return null;
}

/** Raccourcis du sélecteur. */
export const PLACE_PRESETS = {
  toutSalle: ['salle', 'salle', 'salle', 'salle', 'salle', 'salle', 'salle'] as DayPlace[],
  salleLunMerVen: ['salle', 'maison', 'salle', 'maison', 'salle', 'maison', 'maison'] as DayPlace[],
  toutMaison: ['maison', 'maison', 'maison', 'maison', 'maison', 'maison', 'maison'] as DayPlace[],
};

/** Toutes les parties de `items`, par taille croissante (déterministe). */
function subsetsBySize<T>(items: T[]): T[][] {
  const out: T[][] = [];
  for (let m = 0; m < 1 << items.length; m++) out.push(items.filter((_, i) => m & (1 << i)));
  return out.sort((a, b) => a.length - b.length);
}

/**
 * Lieu par jour : parmi les jours d'entraînement possibles, on garde la même répartition (mêmes séances, aucune séance de moins) mais on
 * choisit, quand c'est possible, des jours de salle en priorité (jusqu'au nombre de jours de salle libres). `replan` refait le calendrier
 * avec des jours impossibles supplémentaires ; le premier calendrier qui utilise le plus de jours de salle gagne (le calendrier d'origine
 * à égalité). Jamais un calendrier réduit ni plus court que celui d'origine.
 */
export function preferGymDays<P extends { days: number[]; labels: readonly string[]; reduced: boolean }>(
  plan: P, dp: readonly DayPlace[], blocked: readonly number[], replan: (blocked: number[]) => P | null,
): P {
  const free = [0, 1, 2, 3, 4, 5, 6].filter((d) => !blocked.includes(d));
  const gym = free.filter((d) => dp[d] === 'salle');
  const other = free.filter((d) => dp[d] !== 'salle');
  if (!gym.length || !other.length) return plan;
  const score = (p: P) => p.days.filter((d) => gym.includes(d)).length;
  const target = Math.min(gym.length, plan.days.length);
  if (score(plan) >= target) return plan;
  let best = plan;
  for (const extra of subsetsBySize(other)) {
    if (!extra.length || free.length - extra.length < plan.labels.length) continue;
    const p = replan([...blocked, ...extra]);
    if (!p || p.reduced !== plan.reduced || p.labels.length !== plan.labels.length) continue;
    if (score(p) > score(best)) best = p;
    if (score(best) >= target) break;
  }
  return best;
}
