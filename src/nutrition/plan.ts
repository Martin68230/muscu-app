// Générateur de plan de repas de la semaine (docs/nutrition-spec.md §7). PUR et déterministe pour une graine donnée.
// Filtres durs d'abord (allergènes, régime, aliments évités, temps, matériel), jamais assouplis ; puis score de proximité des macros,
// de variété et de courses optimisées (§7.6). Échec sûr : si aucune recette ne convient, la case reste vide.

import { ECHELLE_MAX, ECHELLE_MIN, NUTRITION_VERSION, TOL_KCAL_REPAS } from './config';
import type { DayTarget } from './day-targets';
import type { AllergenKey } from './allergens';
import type { GoalKind } from './needs';
import type { PlannedIngredient, Rayon } from './shopping';

export type MealKind = 'petit-dej' | 'dejeuner-diner' | 'collation';

/** Recette publiée (public/data/recettes.json). */
export interface Recipe {
  id: string;
  nom: string;
  repas: MealKind;
  objectifs: GoalKind[];
  prepMin: number;
  cuissonMin: number;
  materiel: string[];
  regimes: string[];
  cout: 'eco' | 'normal' | 'plus';
  sourceProteines: string | null;
  allergenes: AllergenKey[];
  statutAllergenes: 'valide' | 'a_verifier' | 'inconnu';
  portion: { kcal: number; prot: number; gluc: number; lip: number };
  ingredients: { code: string; nom: string; grammes: number; ajustable: boolean; rayon: Rayon; famille: string }[];
}

export interface FoodMacros {
  code: string;
  kcal: number;
  prot: number;
  gluc: number;
  lip: number;
  perissable: boolean;
  gardeManger: boolean;
}

export interface PlanPrefs {
  goal: GoalKind;
  allergens: AllergenKey[];
  /** Mots à exclure (normalisés) cherchés dans le nom de la recette et de ses ingrédients. */
  allergenFree: string[];
  diet: string[];
  dislikedFoods: string[];
  maxCookMin: number | null;
  appliances: string[];
  mealsPerDay: 3 | 4 | 5;
  optimizeShopping: boolean;
}

export interface PlanSlot {
  day: number;
  slot: number;
  repas: MealKind;
  recipeId: string | null;
  scale: number;
  kcal: number;
  prot: number;
  gluc: number;
  lip: number;
}

export interface WeekPlan {
  version: string;
  slots: PlanSlot[];
  /** Grammes crus après mise à l'échelle, prêts pour la liste de courses. */
  ingredients: PlannedIngredient[];
}

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Part de l'énergie du jour par repas selon le nombre de repas. */
const SPLITS: Record<3 | 4 | 5, { repas: MealKind; share: number }[]> = {
  3: [{ repas: 'petit-dej', share: 0.25 }, { repas: 'dejeuner-diner', share: 0.4 }, { repas: 'dejeuner-diner', share: 0.35 }],
  4: [{ repas: 'petit-dej', share: 0.22 }, { repas: 'dejeuner-diner', share: 0.33 }, { repas: 'collation', share: 0.12 }, { repas: 'dejeuner-diner', share: 0.33 }],
  5: [{ repas: 'petit-dej', share: 0.2 }, { repas: 'collation', share: 0.1 }, { repas: 'dejeuner-diner', share: 0.3 }, { repas: 'collation', share: 0.1 }, { repas: 'dejeuner-diner', share: 0.3 }],
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Filtres durs. Dès qu'une exclusion d'allergène est active, seules les recettes aux allergènes `valide` passent. */
export function recipeAllowed(r: Recipe, p: PlanPrefs): boolean {
  const strict = p.allergens.length > 0 || p.allergenFree.length > 0;
  if (r.statutAllergenes === 'inconnu') return false;
  if (strict && r.statutAllergenes !== 'valide') return false;
  if (r.allergenes.some((a) => p.allergens.includes(a))) return false;
  const text = norm([r.nom, ...r.ingredients.map((i) => i.nom)].join(' '));
  if (p.allergenFree.some((w) => w.trim() && text.includes(norm(w)))) return false;
  const labelled = ['vegetarien', 'vegetalien', 'sans_porc', 'sans_lactose', 'sans_gluten'];
  if (p.diet.some((d) => labelled.includes(d) && !r.regimes.includes(d))) return false;
  if (r.ingredients.some((i) => p.dislikedFoods.includes(i.code))) return false;
  if (p.maxCookMin != null && r.prepMin + r.cuissonMin > p.maxCookMin) return false;
  if (r.materiel.some((m) => m !== 'aucun' && !p.appliances.includes(m))) return false;
  if (!r.objectifs.includes(p.goal)) return false;
  return true;
}

interface Scaled {
  scale: number;
  kcal: number;
  prot: number;
  gluc: number;
  lip: number;
  lines: { code: string; nom: string; grammes: number; rayon: Rayon }[];
}

/** Mise à l'échelle des seuls ingrédients ajustables vers l'énergie cible, dans [ECHELLE_MIN, ECHELLE_MAX]. */
export function scaleRecipe(r: Recipe, foods: ReadonlyMap<string, FoodMacros>, targetKcal: number): Scaled | null {
  let fixed = 0;
  let adj = 0;
  for (const i of r.ingredients) {
    const f = foods.get(i.code);
    if (!f) return null;
    const k = (f.kcal * i.grammes) / 100;
    if (i.ajustable) adj += k; else fixed += k;
  }
  if (adj <= 0) return null;
  const raw = (targetKcal - fixed) / adj;
  const scale = Math.min(ECHELLE_MAX, Math.max(ECHELLE_MIN, raw));
  let kcal = 0, prot = 0, gluc = 0, lip = 0;
  const lines: Scaled['lines'] = [];
  for (const i of r.ingredients) {
    const f = foods.get(i.code)!;
    const g = i.ajustable ? Math.round((i.grammes * scale) / 5) * 5 || 5 : i.grammes;
    kcal += (f.kcal * g) / 100; prot += (f.prot * g) / 100; gluc += (f.gluc * g) / 100; lip += (f.lip * g) / 100;
    lines.push({ code: i.code, nom: i.nom, grammes: g, rayon: i.rayon });
  }
  return { scale, kcal, prot, gluc, lip, lines };
}

export function generateWeek(
  days: readonly DayTarget[],
  recipes: readonly Recipe[],
  foods: ReadonlyMap<string, FoodMacros>,
  prefs: PlanPrefs,
  seed: number,
  previousRecipeIds: readonly string[] = [],
): WeekPlan {
  const rnd = mulberry32(seed);
  const allowed = recipes.filter((r) => recipeAllowed(r, prefs));
  const split = SPLITS[prefs.mealsPerDay];
  const used = new Map<string, number>();
  const basket = new Set<string>();
  const slots: PlanSlot[] = [];
  const ingredients: PlannedIngredient[] = [];

  days.forEach((d, day) => {
    const usedToday = new Set<string>();
    const proteinsToday = new Set<string>();
    split.forEach((m, slot) => {
      const target = d.kcal * m.share;
      let best: { r: Recipe; s: Scaled; score: number } | null = null;
      for (const r of allowed) {
        if (r.repas !== m.repas || usedToday.has(r.id)) continue;
        const s = scaleRecipe(r, foods, target);
        if (!s || Math.abs(s.kcal - target) / target > TOL_KCAL_REPAS) continue;
        let score = -Math.abs(s.kcal - target) / target * 10;
        const times = used.get(r.id) ?? 0;
        score -= times * 6; // jamais deux fois sans nécessité : pénalité forte, pas un filtre (la variété passe avant l'optimisation)
        if (previousRecipeIds.includes(r.id)) score -= 3;
        if (r.sourceProteines && proteinsToday.has(r.sourceProteines)) score -= 2;
        if (prefs.optimizeShopping) {
          for (const l of s.lines) {
            const f = foods.get(l.code);
            if (f?.gardeManger) continue;
            if (basket.has(l.code)) score += 1.2; else score -= f?.perissable ? 1.0 : 0.4;
          }
        }
        score += rnd() * 0.5; // départage reproductible
        if (!best || score > best.score) best = { r, s, score };
      }
      if (!best) {
        slots.push({ day, slot, repas: m.repas, recipeId: null, scale: 0, kcal: 0, prot: 0, gluc: 0, lip: 0 });
        return;
      }
      used.set(best.r.id, (used.get(best.r.id) ?? 0) + 1);
      usedToday.add(best.r.id);
      if (best.r.sourceProteines) proteinsToday.add(best.r.sourceProteines);
      slots.push({ day, slot, repas: m.repas, recipeId: best.r.id, scale: best.s.scale, kcal: best.s.kcal, prot: best.s.prot, gluc: best.s.gluc, lip: best.s.lip });
      for (const l of best.s.lines) {
        basket.add(l.code);
        ingredients.push({ code: l.code, name: l.nom, grams: l.grammes, rayon: l.rayon, pantry: foods.get(l.code)?.gardeManger });
      }
    });
  });
  return { version: NUTRITION_VERSION, slots, ingredients };
}
