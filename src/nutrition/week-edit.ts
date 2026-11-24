// Modifier une semaine DÉJÀ générée (docs/nutrition-reprise.md, « semaine validée ») : changer un repas, changer un aliment, verrouiller.
// PUR. Les filtres durs sont ceux du générateur (`recipeAllowed`) et, pour un aliment remplacé, les mêmes règles appliquées à l'aliment
// (allergènes, régime, aliments exclus, statut d'étiquetage). Rien n'est assoupli : en cas de doute, l'alternative n'est pas proposée.
// Après chaque changement, tout est recalculé à partir des créneaux (macros, jours, lots, courses) : une seule source de vérité.

import { ARRONDI_GRAMMES, ECHELLE_MAX_PRINCIPAL, NUTRITION_VERSION, SEUIL_ECART_KCAL, TOL_KCAL_JOUR, TOL_KCAL_OPTIONNEL, TOL_KCAL_REPAS } from './config';
import { ingredientAllowed } from './allergens';
import type { FoodInfo } from './catalog';
import type { DayTarget } from './day-targets';
import { norm, recipeAllowed, type DayCheck, type FoodMacros, type PlanPrefs, type Recipe } from './plan';
import type { GoalKind } from './needs';
import type { PlannedIngredient } from './shopping';
import { ceilG, composeSlot, pickFor, repasOf, slotKeyOf, type LotInfo, type MealConfig, type Swap, type WeekPlanResult, type WeekSlot } from './week-plan';

export type Prefs = Omit<PlanPrefs, 'mealsPerDay'>;
const full = (p: Prefs): PlanPrefs => ({ ...p, mealsPerDay: 3 });

export interface EditCtx {
  recipes: readonly Recipe[];
  foods: ReadonlyMap<string, FoodMacros>;
  info: ReadonlyMap<string, FoodInfo>;
  prefs: Prefs;
  days: readonly DayTarget[];
  cfg: MealConfig;
  floorKcal: number;
}

export interface Totals { kcal: number; prot: number; gluc: number; lip: number }
export const dayTotals = (slots: readonly WeekSlot[], day: number): Totals =>
  slots.filter((s) => s.day === day).reduce((t, s) => ({ kcal: t.kcal + s.kcal, prot: t.prot + s.prot, gluc: t.gluc + s.gluc, lip: t.lip + s.lip }), { kcal: 0, prot: 0, gluc: 0, lip: 0 });

const rank = (s: WeekSlot) => (s.kind === 'petit-dej' ? 0 : s.kind === 'encas' && s.index === 0 ? 1 : s.kind === 'dejeuner' ? 2 : s.kind === 'gouter' ? 3 : s.kind === 'encas' ? 4 : 5);

// ---- Contrôles d'un aliment (mêmes règles que les recettes) ----

/** Un aliment peut-il entrer dans un repas avec les réglages du moment ? Échec sûr : doute = non. */
export function foodUsable(f: FoodInfo, p: Prefs): boolean {
  if (!ingredientAllowed({ code: f.code, allergenes: f.allergenes, statut: f.statutAllergenes }, p.allergens)) return false;
  const strict = p.allergens.length > 0 || p.allergenFree.some((w) => norm(w)) || p.diet.includes('sans_lactose') || p.diet.includes('sans_gluten') || !!p.strictControle;
  if (strict && f.statutAllergenes !== 'valide') return false;
  if (f.statutAllergenes === 'inconnu') return false;
  if (p.diet.some((d) => f.regimesIncompatibles.includes(d))) return false;
  if (p.dislikedFoods.includes(f.code)) return false;
  const name = ` ${norm(f.nom)} `;
  if (p.allergenFree.some((w) => norm(w) && name.includes(norm(w)))) return false;
  return true;
}

/** Les aliments remplacés d'un créneau respectent-ils encore les réglages (par exemple une allergie ajoutée depuis) ? */
export function swapsUsable(s: Pick<WeekSlot, 'swaps'>, info: ReadonlyMap<string, FoodInfo>, p: Prefs): boolean {
  return (s.swaps ?? []).every((sw) => {
    const f = info.get(sw.to);
    return !!f && foodUsable(f, p);
  });
}

/** Un repas du plan est utilisable si sa recette ET ses aliments remplacés respectent les réglages d'aujourd'hui. */
export function slotUsable(s: WeekSlot, recipeById: ReadonlyMap<string, Recipe>, info: ReadonlyMap<string, FoodInfo>, p: Prefs): boolean {
  if (!s.recipeId) return true;
  const r = recipeById.get(s.recipeId);
  return !!r && recipeAllowed(r, full(p)) && swapsUsable(s, info, p);
}

/** Allergènes affichés d'un repas : ceux de la recette plus ceux des aliments remplacés. */
export const slotAllergens = (r: Recipe, s: Pick<WeekSlot, 'swaps'>) => [...new Set([...r.allergenes, ...(s.swaps ?? []).flatMap((x) => x.allergenes)])];

// ---- Recalcul complet d'une semaine à partir des créneaux ----

export function assembleWeek(slotsIn: readonly WeekSlot[], ctx: EditCtx, version: string = NUTRITION_VERSION): WeekPlanResult {
  const recById = new Map(ctx.recipes.map((r) => [r.id, r]));
  const slots = slotsIn.map((s): WeekSlot => {
    const r = s.recipeId ? recById.get(s.recipeId) : undefined;
    const c = r ? composeSlot(r, s, ctx.foods) : null;
    return c ? { ...s, kcal: c.kcal, prot: c.prot, gluc: c.gluc, lip: c.lip } : { ...s };
  });
  slots.sort((a, b) => a.day - b.day || rank(a) - rank(b));

  const lotMap = new Map<string, LotInfo>();
  for (const s of slots) {
    if (!s.recipeId || !s.pieces) continue;
    const r = recById.get(s.recipeId);
    if (!r) continue;
    const cur = lotMap.get(r.id) ?? { recipeId: r.id, piece: r.piece ?? 'pièce', needed: 0, pieces: 0 };
    cur.needed += s.pieces;
    lotMap.set(r.id, cur);
  }
  const lots = [...lotMap.values()].map((l) => ({ ...l, pieces: Math.max(l.needed, ctx.cfg.lotOverride[l.recipeId] ?? 0) }));

  const ingredients: PlannedIngredient[] = [];
  for (const s of slots) {
    const r = s.recipeId ? recById.get(s.recipeId) : undefined;
    if (!r || r.lot) continue;
    const c = composeSlot(r, s, ctx.foods);
    if (!c) continue;
    for (const l of c.lines) ingredients.push({ code: l.code, name: l.nom, grams: l.grammes, rayon: l.rayon, pantry: ctx.foods.get(l.code)?.gardeManger });
  }
  for (const l of lots) {
    const r = recById.get(l.recipeId)!;
    for (const i of r.ingredients) ingredients.push({ code: i.code, name: i.nom, grams: ceilG(i.grammes * l.pieces), rayon: i.rayon, pantry: ctx.foods.get(i.code)?.gardeManger });
  }

  const days: DayCheck[] = ctx.days.map((d, day) => {
    const mine = slots.filter((s) => s.day === day);
    const kcal = mine.reduce((t, s) => t + s.kcal, 0);
    const belowFloor = kcal < ctx.floorKcal - 1e-9;
    let status: DayCheck['status'] = 'ok';
    if (mine.some((s) => !s.recipeId)) status = 'incomplet';
    else if (belowFloor) status = 'sous_plancher';
    else if (Math.abs(kcal - d.kcal) / d.kcal > TOL_KCAL_JOUR) status = 'ecart';
    const manque = d.kcal - kcal;
    return { day, kcal, targetKcal: d.kcal, status, belowFloor, missingKcal: manque > SEUIL_ECART_KCAL ? manque : 0 };
  });
  return { version, slots, lots, days, ingredients };
}

// ---- Changer un repas ----

export interface MealAlternative {
  recipe: Recipe;
  scale: number;
  pieces: number;
  kcal: number;
  prot: number;
  gluc: number;
  lip: number;
  dKcal: number;
  dProt: number;
}

/**
 * Autres recettes équivalentes pour un créneau : même type de repas, mêmes filtres (allergies, régime, matériel, temps), énergie à ±10 %
 * (±35 % pour un goûter ou un lot, qui se compte en pièces) et protéines proches. Jamais la recette actuelle, ni une recette déjà au menu ce jour-là.
 */
export function mealAlternatives(plan: Pick<WeekPlanResult, 'slots'>, slot: WeekSlot, ctx: EditCtx, count = 3, skip = 0): MealAlternative[] {
  if (slot.kcal <= 0) return [];
  const pf = full(ctx.prefs);
  const want = repasOf(slot.kind);
  const key = slotKeyOf(slot);
  const usedToday = new Set(plan.slots.filter((s) => s.day === slot.day && slotKeyOf(s) !== key && s.recipeId).map((s) => s.recipeId as string));
  const usedWeek = new Map<string, number>();
  for (const s of plan.slots) if (s.recipeId) usedWeek.set(s.recipeId, (usedWeek.get(s.recipeId) ?? 0) + 1);
  const current = ctx.recipes.find((r) => r.id === slot.recipeId);
  const main = want === 'dejeuner-diner';
  const found: { alt: MealAlternative; score: number; close: boolean }[] = [];
  for (const r of ctx.recipes) {
    if (r.repas !== want || r.id === slot.recipeId || usedToday.has(r.id) || !recipeAllowed(r, pf)) continue;
    const tol = r.lot || !main ? TOL_KCAL_OPTIONNEL : TOL_KCAL_REPAS;
    const pk = pickFor(r, ctx.foods, slot.kcal, tol, main ? ECHELLE_MAX_PRINCIPAL : undefined);
    if (!pk) continue;
    const dProt = pk.prot - slot.prot;
    const close = Math.abs(dProt) <= Math.max(8, 0.3 * slot.prot);
    let score = pk.err * 10 + Math.abs(dProt) / Math.max(10, slot.prot) * 5 + (usedWeek.get(r.id) ?? 0) * 0.6;
    if (current?.sourceProteines && r.sourceProteines === current.sourceProteines) score += 0.8;
    found.push({ alt: { recipe: r, scale: pk.scale, pieces: pk.pieces, kcal: pk.kcal, prot: pk.prot, gluc: pk.gluc, lip: pk.lip, dKcal: pk.kcal - slot.kcal, dProt }, score, close });
  }
  // Les repas aux protéines proches d'abord ; les autres seulement s'il en manque.
  found.sort((a, b) => Number(b.close) - Number(a.close) || a.score - b.score);
  return found.slice(skip, skip + count).map((x) => x.alt);
}

/** Remplace la recette d'un créneau (les aliments remplacés de l'ancienne recette sont retirés) et recalcule la semaine. */
export function applyMealChange(plan: WeekPlanResult, key: string, alt: MealAlternative, ctx: EditCtx): WeekPlanResult {
  const slots = plan.slots.map((s) => {
    if (slotKeyOf(s) !== key) return s;
    const { swaps: _drop, ...rest } = s;
    void _drop;
    return { ...rest, recipeId: alt.recipe.id, scale: alt.scale, pieces: alt.pieces, kcal: alt.kcal, prot: alt.prot, gluc: alt.gluc, lip: alt.lip };
  });
  return assembleWeek(slots, ctx, plan.version);
}

// ---- Changer un aliment ----

export interface FoodAlternative {
  swap: Swap;
  food: FoodInfo;
  dKcal: number;
  dProt: number;
  dGluc: number;
  dLip: number;
}

/**
 * Aliments équivalents pour un ingrédient d'une recette : même famille (légume, féculent, laitage...), mêmes filtres que les recettes, grammes
 * recalculés pour garder les calories (±15 %) et des protéines proches. `from` = code d'origine dans la recette. Pas pour les recettes de lot.
 */
export function foodAlternatives(recipe: Recipe, slot: WeekSlot, from: string, ctx: EditCtx, count = 4): FoodAlternative[] {
  if (recipe.lot) return [];
  const line = composeSlot(recipe, slot, ctx.foods)?.lines[recipe.ingredients.findIndex((i) => i.code === from)];
  const cur = line ? ctx.info.get(line.code) : undefined;
  const curM = line ? ctx.foods.get(line.code) : undefined;
  if (!line || !cur || !curM || cur.gardeManger) return [];
  const g0 = line.grammes;
  const k0 = (curM.kcal * g0) / 100, p0 = (curM.prot * g0) / 100, c0 = (curM.gluc * g0) / 100, l0 = (curM.lip * g0) / 100;
  const inRecipe = new Set(recipe.ingredients.map((i) => i.code).concat((slot.swaps ?? []).map((s) => s.to)));
  const out: (FoodAlternative & { score: number })[] = [];
  for (const f of ctx.info.values()) {
    if (f.famille !== cur.famille || f.code === line.code || f.gardeManger || (inRecipe.has(f.code) && f.code !== from)) continue;
    if (!foodUsable(f, ctx.prefs) || f.kcal <= 0) continue;
    const g = Math.round((g0 * curM.kcal) / f.kcal / ARRONDI_GRAMMES) * ARRONDI_GRAMMES;
    if (g < ARRONDI_GRAMMES || g > 600 || g / g0 < 0.4 || g / g0 > 2.5) continue;
    const dKcal = (f.kcal * g) / 100 - k0;
    const dProt = (f.prot * g) / 100 - p0;
    if (Math.abs(dKcal) > Math.max(25, 0.15 * k0)) continue;
    if (Math.abs(dProt) > Math.max(6, 0.35 * p0)) continue;
    out.push({
      swap: { from, to: f.code, nom: f.nom, grammes: g, rayon: f.rayon, allergenes: f.allergenes },
      food: f, dKcal, dProt, dGluc: (f.gluc * g) / 100 - c0, dLip: (f.lip * g) / 100 - l0,
      score: Math.abs(dKcal) / 10 + Math.abs(dProt) + (f.code === from ? -100 : 0),
    });
  }
  out.sort((a, b) => a.score - b.score);
  return out.slice(0, count).map(({ score: _s, ...rest }) => { void _s; return rest; });
}

export function applySwap(plan: WeekPlanResult, key: string, swap: Swap, ctx: EditCtx): WeekPlanResult {
  const slots = plan.slots.map((s) => {
    if (slotKeyOf(s) !== key) return s;
    // Revenir à l'aliment d'origine = retirer le remplacement.
    const rest = (s.swaps ?? []).filter((x) => x.from !== swap.from);
    const next = swap.to === swap.from ? rest : [...rest, swap];
    const { swaps: _drop, ...base } = s;
    void _drop;
    return next.length ? { ...base, swaps: next } : base;
  });
  return assembleWeek(slots, ctx, plan.version);
}

// ---- Verrous ----

export const toggleLock = (locks: readonly string[], key: string): string[] => (locks.includes(key) ? locks.filter((k) => k !== key) : [...locks, key]);

export function lockDay(locks: readonly string[], plan: Pick<WeekPlanResult, 'slots'>, day: number, on: boolean): string[] {
  const keys = plan.slots.filter((s) => s.day === day && s.recipeId).map(slotKeyOf);
  const rest = locks.filter((k) => !keys.includes(k));
  return on ? [...rest, ...keys] : rest;
}

/** Repas verrouillés à passer au générateur : seulement ceux qui respectent encore les réglages d'aujourd'hui (jamais un repas devenu interdit). */
export function usableFixed(plan: Pick<WeekPlanResult, 'slots'>, locks: readonly string[], ctx: EditCtx): Map<string, WeekSlot> {
  const recById = new Map(ctx.recipes.map((r) => [r.id, r]));
  const out = new Map<string, WeekSlot>();
  for (const s of plan.slots) {
    const k = slotKeyOf(s);
    if (locks.includes(k) && s.recipeId && slotUsable(s, recById, ctx.info, ctx.prefs)) out.set(k, s);
  }
  return out;
}

/** Réglages de sécurité et de cuisine tirés du profil enregistré (cœliaque = sans gluten strict ; allergie grave ou cœliaque = recettes relues seulement). */
export function prefsFromProfile(np: { allergens?: string[]; allergenFree?: string[]; diet?: string[]; glutenStrict?: boolean; severeAllergy?: boolean; dislikedFoods?: string[]; maxCookMin?: number | null; appliances?: string[]; optimizeShopping?: boolean }, goal: GoalKind): Prefs {
  const diet = np.diet ?? [];
  return {
    goal,
    allergens: (np.allergens ?? []) as Prefs['allergens'],
    allergenFree: np.allergenFree ?? [],
    diet: np.glutenStrict && !diet.includes('sans_gluten') ? [...diet, 'sans_gluten'] : diet,
    dislikedFoods: np.dislikedFoods ?? [],
    maxCookMin: np.maxCookMin ?? null,
    appliances: np.appliances?.length ? np.appliances : ['four', 'micro-ondes', 'plaques'],
    optimizeShopping: np.optimizeShopping !== false,
    strictControle: !!np.severeAllergy || !!np.glutenStrict,
  };
}

/** Remet à jour les allergènes des aliments remplacés d'après le catalogue (jamais d'après la valeur stockée dans un plan enregistré ou importé). */
export function normalizePlan(plan: WeekPlanResult, info: ReadonlyMap<string, FoodInfo>): WeekPlanResult {
  if (!plan.slots.some((s) => s.swaps?.length)) return plan;
  return { ...plan, slots: plan.slots.map((s) => (s.swaps?.length ? { ...s, swaps: s.swaps.map((sw) => ({ ...sw, allergenes: info.get(sw.to)?.allergenes ?? sw.allergenes })) } : s)) };
}
