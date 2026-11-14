import { describe, expect, it } from 'vitest';
import { ALLERGENS, type AllergenKey } from '../../src/nutrition/allergens';
import { weekTargets, type DayType } from '../../src/nutrition/day-targets';
import type { FoodMacros, PlanPrefs, Recipe } from '../../src/nutrition/plan';
import { buildShoppingList } from '../../src/nutrition/shopping';
import { DEFAULT_MEAL_CONFIG, generateWeekPlan, sanitizeMealConfig, type MealConfig } from '../../src/nutrition/week-plan';

const food = (code: string, kcal: number, prot: number, gluc: number, lip: number, perissable = false, gardeManger = false): [string, FoodMacros] => [code, { code, kcal, prot, gluc, lip, perissable, gardeManger }];
const foods = new Map<string, FoodMacros>([
  food('riz', 350, 7, 77, 1), food('poulet', 120, 24, 0, 2, true), food('brocoli', 35, 3, 4, 0.5, true), food('huile', 900, 0, 0, 100, false, true),
  food('oeuf', 140, 12, 1, 10, true), food('avoine', 370, 13, 60, 7), food('yaourt', 60, 4, 6, 2, true), food('pomme', 52, 0.3, 12, 0.2, true),
  food('pates', 360, 12, 72, 1.5), food('thon', 130, 28, 0, 1.5), food('tomate', 20, 1, 3, 0.2, true), food('amande', 600, 21, 7, 52), food('miel', 300, 0.3, 80, 0),
]);
const ing = (code: string, grammes: number, ajustable: boolean) => ({ code, nom: code, grammes, ajustable, rayon: 'epicerie' as const, famille: 'autre' });
function recipe(id: string, repas: Recipe['repas'], items: [string, number, boolean][], over: Partial<Recipe> = {}): Recipe {
  return {
    id, nom: id, repas, objectifs: ['perte', 'maintien', 'prise'], prepMin: 10, cuissonMin: 10, materiel: ['aucun'], regimes: [], cout: 'eco', sourceProteines: id,
    allergenes: [], statutAllergenes: 'valide', portion: { kcal: 400, prot: 20, gluc: 40, lip: 10 }, ingredients: items.map(([c, g, a]) => ing(c, g, a)), ...over,
  };
}
const R: Recipe[] = [
  recipe('avoine-yaourt', 'petit-dej', [['avoine', 70, true], ['yaourt', 125, false], ['pomme', 120, false]], { allergenes: ['gluten', 'lait'] }),
  recipe('oeufs-brouilles', 'petit-dej', [['oeuf', 120, true], ['huile', 5, false]], { allergenes: ['oeufs'] }),
  recipe('poulet-riz', 'dejeuner-diner', [['poulet', 150, true], ['riz', 90, true], ['brocoli', 200, false], ['huile', 10, false]]),
  recipe('thon-pates', 'dejeuner-diner', [['thon', 120, true], ['pates', 90, true], ['tomate', 200, false], ['huile', 10, false]], { allergenes: ['gluten', 'poissons'] }),
  recipe('oeufs-riz', 'dejeuner-diner', [['oeuf', 150, true], ['riz', 90, true], ['brocoli', 150, false], ['huile', 10, false]], { allergenes: ['oeufs'] }),
  recipe('pates-tomate', 'dejeuner-diner', [['pates', 100, true], ['tomate', 250, false], ['huile', 10, false]], { allergenes: ['gluten'] }),
  recipe('pomme-seule', 'collation', [['pomme', 150, true]]),
  recipe('barre-avoine-amande', 'collation', [['avoine', 25, false], ['amande', 10, false], ['miel', 10, false]], { lot: true, piece: 'barre', allergenes: ['gluten', 'fruits_a_coque'] }),
];

const TYPES: DayType[] = ['lourd', 'repos', 'moyen', 'repos', 'lourd', 'leger', 'repos'];
const week = (avg = 2400, kg = 80) => weekTargets({ types: TYPES, avgKcal: avg, floorKcal: 1500, kg, goal: 'maintien' })!;
const base: Omit<PlanPrefs, 'mealsPerDay'> = { goal: 'maintien', allergens: [], allergenFree: [], diet: [], dislikedFoods: [], maxCookMin: null, appliances: [], optimizeShopping: true };
const cfg = (over: Partial<MealConfig> = {}): MealConfig => ({ ...DEFAULT_MEAL_CONFIG, ...over });

describe('plan de la semaine', () => {
  it('7 jours d’un coup : chaque jour a un déjeuner et un dîner, le petit-déjeuner selon le réglage', () => {
    const p = generateWeekPlan(week(), R, foods, base, cfg(), 1, [], 1500);
    for (let d = 0; d < 7; d++) {
      const s = p.slots.filter((x) => x.day === d);
      expect(s.some((x) => x.kind === 'dejeuner')).toBe(true);
      expect(s.some((x) => x.kind === 'diner')).toBe(true);
      expect(s.some((x) => x.kind === 'petit-dej')).toBe(true);
    }
    expect(p.days).toHaveLength(7);
  });

  it('repas optionnels : jour par jour, 0 à 2 en-cas, goûter, aucun repas non demandé', () => {
    const c = cfg({ petitDej: [true, false, true, false, true, false, false], gouter: [false, false, true, false, false, false, false], encas: [0, 1, 2, 0, 0, 3 as number, 0] });
    const p = generateWeekPlan(week(), R, foods, base, c, 2, [], 1500);
    const kinds = (d: number) => p.slots.filter((x) => x.day === d).map((x) => x.kind);
    expect(kinds(1)).not.toContain('petit-dej');
    expect(kinds(2)).toContain('gouter');
    expect(kinds(2).filter((k) => k === 'encas')).toHaveLength(2);
    expect(kinds(5).filter((k) => k === 'encas')).toHaveLength(2); // 3 est ramené à 2
    expect(kinds(3)).not.toContain('gouter');
  });

  it('les repas principaux absorbent le reste : l’énergie du jour reste sur la cible quand tout est rempli', () => {
    const c = cfg({ gouter: Array(7).fill(true), encas: Array(7).fill(1) });
    const w = week();
    const p = generateWeekPlan(w, R, foods, base, c, 3, [], 1500);
    for (const d of p.days) {
      if (d.status === 'incomplet') continue;
      expect(Math.abs(d.kcal - d.targetKcal) / d.targetKcal).toBeLessThanOrEqual(0.12);
      expect(d.kcal).toBeGreaterThanOrEqual(1500);
    }
    // ajouter des repas optionnels diminue la part des repas principaux
    const w2 = week(1800);
    const sans = generateWeekPlan(w2, R, foods, base, cfg({ petitDej: Array(7).fill(false) }), 3, [], 1500);
    const avec = generateWeekPlan(w2, R, foods, base, cfg({ petitDej: Array(7).fill(true), gouter: Array(7).fill(true) }), 3, [], 1500);
    const main = (pl: typeof sans) => pl.slots.filter((s) => s.kind === 'dejeuner').reduce((t, s) => t + s.kcal, 0);
    expect(main(avec)).toBeLessThan(main(sans));
  });

  it('petit-déjeuner identique : une seule recette pour toute la semaine', () => {
    const p = generateWeekPlan(week(), R, foods, base, cfg({ petitDejIdentique: true }), 4, [], 1500);
    const ids = new Set(p.slots.filter((s) => s.kind === 'petit-dej').map((s) => s.recipeId));
    expect(ids.size).toBe(1);
    expect([...ids][0]).not.toBeNull();
  });

  it('recette de lot : même barre tous les jours, pièces entières, liste de courses = pièces du lot x ingrédients d’une pièce', () => {
    const c = cfg({ encas: Array(7).fill(1) });
    const p = generateWeekPlan(week(), R, foods, base, c, 5, [], 1500);
    const sl = p.slots.filter((s) => s.kind === 'encas' && s.recipeId === 'barre-avoine-amande');
    expect(sl.length).toBeGreaterThan(0);
    for (const s of sl) {
      expect(Number.isInteger(s.pieces)).toBe(true);
      expect(s.pieces).toBeGreaterThanOrEqual(1);
      expect(s.pieces).toBeLessThanOrEqual(3);
    }
    const lot = p.lots.find((l) => l.recipeId === 'barre-avoine-amande')!;
    expect(lot.needed).toBe(sl.reduce((t, s) => t + s.pieces, 0));
    expect(lot.pieces).toBe(lot.needed);
    const list = buildShoppingList(p.ingredients);
    const amande = list.find((i) => i.code === 'amande')!;
    expect(amande.neededGrams).toBeGreaterThanOrEqual(10 * lot.needed - 5);
  });

  it('« fabriquer N pièces » : jamais en dessous du nécessaire, et les courses suivent', () => {
    const c = cfg({ encas: Array(7).fill(1) });
    const a = generateWeekPlan(week(), R, foods, base, c, 5, [], 1500);
    const need = a.lots[0].needed;
    const b = generateWeekPlan(week(), R, foods, base, { ...c, lotOverride: { 'barre-avoine-amande': need + 6 } }, 5, [], 1500);
    expect(b.lots[0].pieces).toBe(need + 6);
    const c2 = generateWeekPlan(week(), R, foods, base, { ...c, lotOverride: { 'barre-avoine-amande': 1 } }, 5, [], 1500);
    expect(c2.lots[0].pieces).toBe(need);
    const am = (p: typeof a) => buildShoppingList(p.ingredients).find((i) => i.code === 'amande')!.neededGrams;
    expect(am(b)).toBeGreaterThan(am(a));
  });

  it('allergies : aucun repas de la semaine ne contient un allergène exclu (14 allergènes, 5 graines, optionnels et lots compris)', () => {
    const c = cfg({ gouter: Array(7).fill(true), encas: Array(7).fill(2), petitDejIdentique: false });
    for (const a of ALLERGENS) {
      for (let seed = 1; seed <= 5; seed++) {
        const p = generateWeekPlan(week(), R, foods, { ...base, allergens: [a as AllergenKey] }, c, seed, [], 1500);
        for (const s of p.slots) {
          if (!s.recipeId) continue;
          expect(R.find((r) => r.id === s.recipeId)!.allergenes.includes(a), `${s.recipeId} avec ${a}`).toBe(false);
        }
      }
    }
  });

  it('courses de la semaine entière, optimisées : moins d’ingrédients distincts que sans optimisation (en moyenne)', () => {
    const c = cfg({ gouter: Array(7).fill(true), encas: Array(7).fill(1) });
    let a = 0, b = 0;
    for (let seed = 1; seed <= 15; seed++) {
      a += new Set(generateWeekPlan(week(), R, foods, { ...base, optimizeShopping: true }, c, seed, [], 1500).ingredients.map((i) => i.code)).size;
      b += new Set(generateWeekPlan(week(), R, foods, { ...base, optimizeShopping: false }, c, seed, [], 1500).ingredients.map((i) => i.code)).size;
    }
    expect(a).toBeLessThanOrEqual(b);
  });

  it('réglage invalide ou ancien : toujours valide, jamais d’erreur', () => {
    const s = sanitizeMealConfig({ petitDej: [true], encas: [9, -1, 'x' as unknown as number, 1, 1, 1, 1], lotOverride: { a: -5, b: 12.4 } });
    expect(s.petitDej).toHaveLength(7);
    expect(s.encas.every((n) => n >= 0 && n <= 2)).toBe(true);
    expect(s.lotOverride).toEqual({ b: 12 });
    expect(sanitizeMealConfig(null).petitDej).toHaveLength(7);
  });

  it('déterministe pour une graine', () => {
    const c = cfg({ gouter: Array(7).fill(true), encas: Array(7).fill(1) });
    expect(generateWeekPlan(week(), R, foods, base, c, 9, [], 1500)).toEqual(generateWeekPlan(week(), R, foods, base, c, 9, [], 1500));
  });
});

describe('relecture du 14/11/2026 : cibles invalides, grammes, sous-plancher', () => {
  it('cible NaN, nulle ou plancher invalide : aucun plan, jamais un jour « ok »', () => {
    const w = week();
    expect(() => generateWeekPlan([{ ...w[0], kcal: NaN }, ...w.slice(1)], R, foods, base, cfg(), 1, [], 1500)).toThrow();
    expect(() => generateWeekPlan([{ ...w[0], kcal: 0 }, ...w.slice(1)], R, foods, base, cfg(), 1, [], 1500)).toThrow();
    expect(() => generateWeekPlan(w, R, foods, base, cfg(), 1, [], NaN)).toThrow();
    expect(() => generateWeekPlan(w.slice(0, 6), R, foods, base, cfg(), 1, [], 1500)).toThrow();
  });
  it('un jour incomplet sous le plancher est signalé sous le plancher', () => {
    const p = generateWeekPlan(week(), R.filter((r) => r.repas !== 'dejeuner-diner' || r.id === 'poulet-riz'), foods, base, cfg(), 1, [], 99999);
    expect(p.days.every((d) => d.belowFloor)).toBe(true);
  });
  it('courses des lots arrondies vers le haut, jamais sous le besoin', () => {
    const c = cfg({ encas: Array(7).fill(1) });
    const p = generateWeekPlan(week(), R, foods, base, c, 5, [], 1500);
    const lot = p.lots[0];
    const r = R.find((x) => x.id === lot.recipeId)!;
    const list = buildShoppingList(p.ingredients);
    for (const i of r.ingredients) expect(list.find((x) => x.code === i.code)!.neededGrams).toBeGreaterThanOrEqual(i.grammes * lot.pieces - 1e-6);
  });
  it('allergie grave sans allergène choisi : seules les recettes relues passent', () => {
    const rr = { ...R[2], statut: 'complete_nutri' } as Recipe;
    expect(generateWeekPlan(week(), [rr], foods, { ...base, strictControle: true }, cfg(), 1, [], 1500).slots.every((s) => !s.recipeId)).toBe(true);
  });
});
