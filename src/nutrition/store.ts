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

// ---- Réglage des repas, plan de la semaine, liste de courses cochable (tables locales privées) ----
import type { MealPlan, ShoppingState } from '../data/model';

export async function getMealPlan(weekStart: string): Promise<MealPlan | null> {
  return (await list('mealPlans')).find((p) => p.weekStart === weekStart) ?? null;
}

export async function saveMealPlan(weekStart: string, version: string, dayTargets: unknown[], result: Record<string, unknown>, seed: number): Promise<MealPlan> {
  const cur = await getMealPlan(weekStart);
  const slots = Array.isArray(result.slots) ? (result.slots as unknown[]) : [];
  const data = { weekStart, generatorVersion: version, dayTargets, slots, inputsHash: String(seed), result, seed };
  return cur ? update('mealPlans', cur.id, data) : create('mealPlans', data);
}

export async function getShoppingState(weekStart: string): Promise<ShoppingState | null> {
  return (await list('shoppingStates')).find((s) => s.weekStart === weekStart) ?? null;
}

/** Coche ou décoche un article (clé = code ingrédient) ; l'état est local, la liste elle-même est recalculée à chaque ouverture. */
export async function setChecked(weekStart: string, key: string, on: boolean): Promise<void> {
  const cur = await getShoppingState(weekStart);
  const set = new Set(cur?.checked ?? []);
  if (on) set.add(key); else set.delete(key);
  if (cur) await update('shoppingStates', cur.id, { checked: [...set] });
  else await create('shoppingStates', { weekStart, checked: [...set], pantry: [], custom: [] });
}
