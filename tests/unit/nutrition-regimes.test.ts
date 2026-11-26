// Non-régression sécurité (règle 11) : un aliment ou une recette qui contient un allergène exclu, ou qui contredit le régime choisi,
// n'est JAMAIS proposé, même si son étiquetage de régime (`regimesIncompatibles` / `regimes`) a oublié l'incompatibilité.
// Trou corrigé le 26/11/2026 : `foodUsable` ne lisait que `regimesIncompatibles` (ex. sauce 11207 avec lait, sans « sans_lactose »).
// @ts-ignore -- types Node absents du tsconfig de l'app ; ce fichier ne tourne que sous Vitest (Node)
import { spawnSync } from 'node:child_process';
// @ts-ignore -- idem
import fs from 'node:fs';
// @ts-ignore -- idem
import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { ALLERGENS, impliedIncompatibleDiets, type AllergenKey } from '../../src/nutrition/allergens';
import type { FoodInfo } from '../../src/nutrition/catalog';
import { recipeAllowed, type PlanPrefs, type Recipe } from '../../src/nutrition/plan';
import { foodUsable, type Prefs } from '../../src/nutrition/week-edit';

const ROOT: string = (globalThis as any).process.cwd();
const DIETS = ['vegetarien', 'vegetalien', 'sans_porc', 'sans_lactose', 'sans_gluten'];
const GOALS = ['perte', 'maintien', 'prise'];
// Ce qu'un régime interdit, quel que soit l'étiquetage de régime.
const FORBIDDEN: Record<string, AllergenKey[]> = {
  vegetarien: ['poissons', 'crustaces', 'mollusques'],
  vegetalien: ['poissons', 'crustaces', 'mollusques', 'oeufs', 'lait'],
  sans_lactose: ['lait'],
  sans_gluten: ['gluten'],
  sans_porc: [],
};

let recipes: Recipe[] = [];
let foods: FoodInfo[] = [];
beforeAll(() => {
  const r = spawnSync('node', ['tools/build-recettes.mjs'], { cwd: ROOT, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`build-recettes a échoué : ${r.stderr}`);
  recipes = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/recettes.json'), 'utf8')).recettes as Recipe[];
  const ali = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/aliments.json'), 'utf8')).aliments as Record<string, unknown>[];
  foods = ali.map((a) => ({
    code: String(a.code), nom: String(a.nom), kcal: Number(a.kcal), prot: Number(a.prot), gluc: Number(a.gluc), lip: Number(a.lip), perissable: !!a.perissable, gardeManger: !!a.gardeManger,
    unite: null, conditionnementG: null, famille: String(a.famille), rayon: a.rayon as FoodInfo['rayon'], allergenes: a.allergenes as FoodInfo['allergenes'],
    statutAllergenes: a.statutAllergenes as FoodInfo['statutAllergenes'], regimesIncompatibles: a.regimesIncompatibles as string[],
  }));
}, 60_000);

const prefs = (over: Partial<Prefs> = {}): Prefs => ({ goal: 'maintien', allergens: [], allergenFree: [], diet: [], dislikedFoods: [], maxCookMin: null, appliances: ['four', 'micro-ondes', 'plaques'], optimizeShopping: true, ...over });
const plan = (over: Partial<Prefs> = {}): PlanPrefs => ({ ...prefs(over), mealsPerDay: 3 });

const food = (over: Partial<FoodInfo>): FoodInfo => ({
  code: '99999', nom: 'Sauce test du commerce', kcal: 80, prot: 2, gluc: 8, lip: 3, perissable: false, gardeManger: false, unite: null, conditionnementG: null,
  famille: 'legume', rayon: 'epicerie', allergenes: [], statutAllergenes: 'valide', regimesIncompatibles: [], ...over,
});

describe('régimes déduits des allergènes', () => {
  it('règles identiques au contrôle de build', () => {
    expect([...impliedIncompatibleDiets(['lait'])].sort()).toEqual(['sans_lactose', 'vegetalien']);
    expect([...impliedIncompatibleDiets(['oeufs'])]).toEqual(['vegetalien']);
    expect([...impliedIncompatibleDiets(['gluten'])]).toEqual(['sans_gluten']);
    expect([...impliedIncompatibleDiets(['poissons'])].sort()).toEqual(['vegetalien', 'vegetarien']);
    expect([...impliedIncompatibleDiets([], ['proteine_animale'])].sort()).toEqual(['vegetalien', 'vegetarien']);
    expect([...impliedIncompatibleDiets(['oeufs'], ['proteine_animale'])]).toEqual(['vegetalien']);
  });

  it('aliment avec lait mais sans régime étiqueté (cas 11207) : refusé pour sans lactose et végétalien', () => {
    const f = food({ allergenes: ['lait', 'gluten'], regimesIncompatibles: ['sans_gluten'] });
    expect(foodUsable(f, prefs())).toBe(true);
    expect(foodUsable(f, prefs({ diet: ['sans_lactose'] }))).toBe(false);
    expect(foodUsable(f, prefs({ diet: ['vegetalien'] }))).toBe(false);
    expect(foodUsable(f, prefs({ diet: ['vegetarien'] }))).toBe(true);
    expect(foodUsable(food({ allergenes: ['poissons'] }), prefs({ diet: ['vegetarien'] }))).toBe(false);
    expect(foodUsable(food({ famille: 'proteine_animale' }), prefs({ diet: ['vegetarien'] }))).toBe(false);
  });

  it('recette mal étiquetée (régime déclaré, lait présent) : refusée quand même', () => {
    const base = recipes.find((r) => r.allergenes.includes('lait'));
    expect(base).toBeDefined();
    const bad: Recipe = { ...base!, regimes: [...new Set([...base!.regimes, 'sans_lactose', 'vegetarien', 'vegetalien'])], objectifs: GOALS as Recipe['objectifs'], materiel: [] };
    expect(recipeAllowed(bad, plan({ diet: ['sans_lactose'] }))).toBe(false);
    expect(recipeAllowed(bad, plan({ diet: ['vegetalien'] }))).toBe(false);
  });
});

describe('vraies données : rien d\'exclu n\'est jamais proposé', () => {
  it('aliments : allergène coché ou régime contredit => jamais utilisable', () => {
    expect(foods.length).toBeGreaterThan(200);
    for (const f of foods) {
      for (const a of ALLERGENS) if (foodUsable(f, prefs({ allergens: [a] }))) expect(f.allergenes, `${f.code} avec allergène ${a}`).not.toContain(a);
      for (const d of DIETS) {
        if (!foodUsable(f, prefs({ diet: [d] }))) continue;
        expect(f.regimesIncompatibles, `${f.code} régime ${d}`).not.toContain(d);
        for (const a of FORBIDDEN[d]) expect(f.allergenes, `${f.code} (${f.nom}) proposé en ${d}`).not.toContain(a);
        if (d === 'vegetarien' || d === 'vegetalien') expect(f.famille === 'proteine_animale' && !f.allergenes.includes('oeufs') && !f.allergenes.includes('lait'), `${f.code} viande en ${d}`).toBe(false);
      }
    }
  });

  it('recettes : allergène coché ou régime contredit => jamais proposée', () => {
    expect(recipes.length).toBeGreaterThan(50);
    const byCode = new Map(foods.map((f) => [f.code, f]));
    for (const r0 of recipes) {
      const r: Recipe = { ...r0, objectifs: GOALS as Recipe['objectifs'], materiel: [] };
      for (const a of ALLERGENS) if (recipeAllowed(r, plan({ allergens: [a] }))) expect(r.allergenes, `${r.id} avec allergène ${a}`).not.toContain(a);
      for (const d of DIETS) {
        if (!recipeAllowed(r, plan({ diet: [d] }))) continue;
        for (const a of FORBIDDEN[d]) expect(r.allergenes, `${r.id} proposée en ${d}`).not.toContain(a);
        // Contrôle indépendant des règles déduites : chaque ingrédient, avec l'étiquetage relu de l'aliment ET les règles déduites, doit être utilisable.
        for (const i of r.ingredients) {
          const f = byCode.get(i.code);
          expect(f, `${r.id} : ingrédient ${i.code} absent de aliments.json`).toBeDefined();
          expect(foodUsable(f!, prefs({ diet: [d] })), `${r.id} proposée en ${d} avec ${i.code} (${i.nom})`).toBe(true);
        }
      }
    }
  });
});
