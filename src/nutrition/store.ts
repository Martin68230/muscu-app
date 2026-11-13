// Accès aux données nutrition (tables locales privées, jamais partagées). Aucune logique de calcul ici : voir needs.ts, weight-trend.ts, alerts.ts.

import type { BodyWeight, NutritionGoal, NutritionProfile, WeeklyCheckin } from '../data/model';
import { create, list, softDelete, update } from '../data/repo';
import { weekStartOf } from './weight-trend';

export const DEFAULT_PROFILE: Omit<NutritionProfile, 'id' | 'ownerId' | 'createdAt' | 'updatedAt' | 'rev' | 'deletedAt' | 'syncedAt'> = {
  birthYear: null,
  sexForFormula: null,
  activityLevel: null,
  screening: {},
  screeningResult: null,
  screenedAt: null,
  allergens: [],
  allergenFree: [],
  severeAllergy: false,
  diet: [],
  glutenStrict: false,
  mealsPerDay: 3,
  mealTimes: [],
  maxCookMin: null,
  appliances: ['four', 'micro-ondes', 'plaques'],
  budget: 'normal',
  batchCooking: false,
  optimizeShopping: true,
  dislikedFoods: [],
  likedFoods: [],
  weighDay: 5,
  showTrendOnHome: true,
};

export async function getNutritionProfile(): Promise<NutritionProfile | null> {
  const rows = await list('nutritionProfiles');
  return rows[0] ?? null;
}

export async function saveNutritionProfile(patch: Partial<typeof DEFAULT_PROFILE>): Promise<NutritionProfile> {
  const cur = await getNutritionProfile();
  if (cur) return update('nutritionProfiles', cur.id, patch);
  return create('nutritionProfiles', { ...DEFAULT_PROFILE, ...patch });
}

export async function getActiveGoal(): Promise<NutritionGoal | null> {
  const rows = (await list('nutritionGoals')).filter((g) => !g.endedAt);
  rows.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return rows[0] ?? null;
}

/** Un seul objectif actif : l'ancien est clôturé et conservé en historique. */
export async function saveGoal(g: Omit<NutritionGoal, 'id' | 'ownerId' | 'createdAt' | 'updatedAt' | 'rev' | 'deletedAt' | 'syncedAt' | 'endedAt'>): Promise<NutritionGoal> {
  const old = await getActiveGoal();
  if (old) await update('nutritionGoals', old.id, { endedAt: new Date().toISOString() });
  return create('nutritionGoals', { ...g, endedAt: null });
}

export async function listWeighIns(): Promise<BodyWeight[]> {
  const rows = await list('bodyWeights');
  return rows.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

export async function listCheckins(): Promise<WeeklyCheckin[]> {
  const rows = await list('weeklyCheckins');
  return rows.sort((a, b) => (a.weekStart < b.weekStart ? -1 : 1));
}

/**
 * Enregistre une pesée (table bodyWeights existante) et le bilan de la semaine. Une seule pesée par date : la même date remplace la précédente.
 * Le bilan de la semaine garde le dernier statut d'adhérence saisi.
 */
export async function addWeighIn(date: string, kg: number, adherence: WeeklyCheckin['adherence'], note: string): Promise<void> {
  const weights = await list('bodyWeights');
  const same = weights.find((w) => w.date === date);
  const w = same ? await update('bodyWeights', same.id, { kg }) : await create('bodyWeights', { date, kg });
  const weekStart = weekStartOf(date);
  const cur = (await list('weeklyCheckins')).find((c) => c.weekStart === weekStart);
  if (cur) await update('weeklyCheckins', cur.id, { bodyWeightId: w.id, adherence, note });
  else await create('weeklyCheckins', { weekStart, bodyWeightId: w.id, adherence, trendKgAfter: null, kcalAdjust: 0, note });
}

export async function removeWeighIn(id: string): Promise<void> {
  await softDelete('bodyWeights', id);
}

export async function setCheckinAdjust(weekStart: string, kcalAdjust: number, trendKgAfter: number | null): Promise<void> {
  const cur = (await list('weeklyCheckins')).find((c) => c.weekStart === weekStart);
  if (cur) await update('weeklyCheckins', cur.id, { kcalAdjust, trendKgAfter });
}
