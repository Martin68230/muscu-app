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

export async function saveMealPlan(weekStart: string, version: string, dayTargets: unknown[], result: Record<string, unknown>, seed: number, prefs: Record<string, unknown> = {}): Promise<MealPlan> {
  const cur = await getMealPlan(weekStart);
  const slots = Array.isArray(result.slots) ? (result.slots as unknown[]) : [];
  const data = { weekStart, generatorVersion: version, dayTargets, slots, inputsHash: String(seed), result: { ...result, prefs }, seed };
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

// ---- Semaine validée, verrous, annulation, journal des repas (v6) ----
import type { MealLog } from '../data/model';

export interface PlanSnapshot { result: Record<string, unknown>; locks: string[] }

export const isValidated = (p: MealPlan | null | undefined): boolean => p?.status === 'valide';

/** Enregistre un plan généré (brouillon). Un plan VALIDÉ n'est jamais écrasé par une génération : il faut d'abord le rouvrir. */
export async function saveGeneratedPlan(weekStart: string, version: string, dayTargets: unknown[], result: Record<string, unknown>, seed: number, prefs: Record<string, unknown>, locks: string[]): Promise<MealPlan> {
  const cur = await getMealPlan(weekStart);
  if (cur && isValidated(cur)) throw new Error('Semaine validée : rouvre-la avant de la régénérer.');
  const previous = cur?.result ? ({ result: cur.result, locks: cur.locks ?? [] } as unknown as Record<string, unknown>) : null;
  const slots = Array.isArray(result.slots) ? (result.slots as unknown[]) : [];
  const data = { weekStart, generatorVersion: version, dayTargets, slots, inputsHash: String(seed), result: { ...result, prefs }, seed, status: 'brouillon' as const, confirmedAt: null, locks, previous };
  return cur ? update('mealPlans', cur.id, data) : create('mealPlans', data);
}

/** Enregistre une modification (repas ou aliment changé, verrou) : l'état d'avant est gardé pour « Annuler le dernier changement ». */
export async function saveEditedPlan(weekStart: string, result: Record<string, unknown>, locks: string[], keepUndo = true): Promise<MealPlan> {
  const cur = await getMealPlan(weekStart);
  if (!cur) throw new Error('Aucun plan à modifier.');
  const prefs = (cur.result as Record<string, unknown> | undefined)?.prefs;
  const slots = Array.isArray(result.slots) ? (result.slots as unknown[]) : [];
  const previous = keepUndo ? ({ result: cur.result ?? {}, locks: cur.locks ?? [] } as unknown as Record<string, unknown>) : cur.previous ?? null;
  return update('mealPlans', cur.id, { slots, result: { ...result, ...(prefs ? { prefs } : {}) }, locks, previous });
}

/** Revient à l'état d'avant le dernier changement (un seul niveau). Renvoie false s'il n'y a rien à annuler. */
export async function undoLastChange(weekStart: string): Promise<boolean> {
  const cur = await getMealPlan(weekStart);
  const prev = cur?.previous as unknown as PlanSnapshot | null | undefined;
  if (!cur || !prev || typeof prev.result !== 'object' || !prev.result) return false;
  const slots = Array.isArray(prev.result.slots) ? (prev.result.slots as unknown[]) : [];
  await update('mealPlans', cur.id, { slots, result: prev.result, locks: Array.isArray(prev.locks) ? prev.locks : [], previous: null });
  return true;
}

/** Fige la semaine : elle apparaît au calendrier et dans l'historique. */
export async function confirmMealPlan(weekStart: string): Promise<MealPlan> {
  const cur = await getMealPlan(weekStart);
  if (!cur) throw new Error('Aucun plan à valider.');
  return update('mealPlans', cur.id, { status: 'valide', confirmedAt: new Date().toISOString(), previous: null });
}

/** Rouvre une semaine validée pour la modifier ou la régénérer (les repas cochés « fait » restent notés). */
export async function reopenMealPlan(weekStart: string): Promise<MealPlan> {
  const cur = await getMealPlan(weekStart);
  if (!cur) throw new Error('Aucun plan.');
  return update('mealPlans', cur.id, { status: 'brouillon', confirmedAt: null });
}

export async function listValidatedPlans(): Promise<MealPlan[]> {
  return (await list('mealPlans')).filter(isValidated).sort((a, b) => (a.weekStart < b.weekStart ? 1 : -1));
}

export async function listMealLogs(fromDate?: string, toDate?: string): Promise<MealLog[]> {
  return (await list('mealLogs')).filter((l) => (!fromDate || l.date >= fromDate) && (!toDate || l.date <= toDate));
}

/** Marque un repas : un seul enregistrement par jour et par repas. `null` = effacer la marque. */
export async function setMealLog(date: string, slotKey: string, state: MealLog['state'] | null, note = '', kcal: number | null = null): Promise<void> {
  const cur = (await list('mealLogs')).find((l) => l.date === date && l.slotKey === slotKey);
  if (state === null) {
    if (cur) await softDelete('mealLogs', cur.id);
    return;
  }
  const clean = { state, note: note.trim().slice(0, 300), kcal: kcal != null && Number.isFinite(kcal) && kcal >= 0 && kcal <= 10000 ? Math.round(kcal) : null };
  if (cur) await update('mealLogs', cur.id, clean);
  else await create('mealLogs', { date, slotKey, ...clean });
}

/** Tous les plans de semaine (brouillons et validés), du plus récent au plus ancien. */
export async function listPlans(): Promise<MealPlan[]> {
  return (await list('mealPlans')).sort((a, b) => (a.weekStart < b.weekStart ? 1 : -1));
}

// ---- Liste de courses mémorisée avec la semaine (v6) : coches, lignes ajoutées, lignes retirées, copie vers une autre semaine ----

export interface ShoppingExtra { name: string; qty: string }
export const customKey = (name: string): string => `custom:${name.trim().toLowerCase()}`;

async function patchShopping(weekStart: string, fn: (s: { checked: string[]; pantry: string[]; custom: ShoppingExtra[] }) => Partial<{ checked: string[]; pantry: string[]; custom: ShoppingExtra[] }>): Promise<ShoppingState> {
  const cur = await getShoppingState(weekStart);
  const base = { checked: [...(cur?.checked ?? [])], pantry: [...(cur?.pantry ?? [])], custom: [...(cur?.custom ?? [])] };
  const patch = fn(base);
  if (cur) return update('shoppingStates', cur.id, patch);
  return create('shoppingStates', { weekStart, ...base, ...patch });
}

/** Ajoute une ligne à la main (nom obligatoire, quantité facultative) ; deux lignes de même nom n'en font qu'une. */
export async function addCustomItem(weekStart: string, name: string, qty = ''): Promise<ShoppingState> {
  const n = name.trim().slice(0, 80);
  if (!n) throw new Error('Nom vide');
  return patchShopping(weekStart, (s) => ({ custom: [...s.custom.filter((c) => customKey(c.name) !== customKey(n)), { name: n, qty: qty.trim().slice(0, 40) }] }));
}

export async function removeCustomItem(weekStart: string, name: string): Promise<ShoppingState> {
  return patchShopping(weekStart, (s) => ({ custom: s.custom.filter((c) => customKey(c.name) !== customKey(name)), checked: s.checked.filter((k) => k !== customKey(name)) }));
}

/** Retire une ligne du plan de la liste (déjà à la maison) ; elle reste récupérable. */
export async function hideItem(weekStart: string, code: string, hidden: boolean): Promise<ShoppingState> {
  return patchShopping(weekStart, (s) => ({ pantry: hidden ? [...new Set([...s.pantry, code])] : s.pantry.filter((c) => c !== code), checked: s.checked.filter((k) => k !== code) }));
}

export async function uncheckAll(weekStart: string): Promise<ShoppingState> {
  return patchShopping(weekStart, () => ({ checked: [] }));
}

/** « Reprendre les mêmes courses » : lignes ajoutées et lignes retirées d'une semaine reprises sur une autre (les coches repartent à zéro). */
export async function copyShoppingExtras(fromWeek: string, toWeek: string): Promise<void> {
  const src = await getShoppingState(fromWeek);
  if (!src) return;
  await patchShopping(toWeek, (s) => ({ custom: [...s.custom.filter((c) => !src.custom.some((x) => customKey(x.name) === customKey(c.name))), ...src.custom], pantry: [...new Set([...s.pantry, ...src.pantry])] }));
}

/** « Refaire cette semaine » : copie le plan (en brouillon) vers une autre semaine, avec ses repas verrouillés. Refuse d'écraser une semaine validée. */
export async function copyPlanToWeek(fromWeek: string, toWeek: string): Promise<MealPlan> {
  const src = await getMealPlan(fromWeek);
  if (!src?.result) throw new Error('Aucun plan à copier.');
  const dst = await getMealPlan(toWeek);
  if (dst && isValidated(dst)) throw new Error('La semaine visée est déjà validée.');
  const data = { weekStart: toWeek, generatorVersion: src.generatorVersion, dayTargets: src.dayTargets, slots: src.slots, inputsHash: src.inputsHash, result: src.result, seed: src.seed ?? 1, status: 'brouillon' as const, confirmedAt: null, locks: src.locks ?? [], previous: null };
  return dst ? update('mealPlans', dst.id, data) : create('mealPlans', data);
}
