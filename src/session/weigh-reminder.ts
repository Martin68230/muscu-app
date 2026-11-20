// Rappel de pesée à l'accueil : seulement si la nutrition est configurée (un objectif existe) et qu'aucune pesée n'a 7 jours ou moins.
import { dateKey } from './calendar';

/** `weightDates` : dates 'YYYY-MM-DD' des pesées non supprimées. Aucune pesée du tout : rappel aussi (une seule invitation, sans pression). */
export function weighDue(hasNutritionGoal: boolean, weightDates: readonly string[], today: Date): boolean {
  if (!hasNutritionGoal) return false;
  const limit = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
  const since = dateKey(limit);
  return !weightDates.some((d) => d >= since);
}
