// @ts-ignore -- types Node absents du tsconfig de l'app ; ce fichier ne tourne que sous Vitest (Node)
import { spawnSync } from 'node:child_process';
// @ts-ignore -- idem
import fs from 'node:fs';
// @ts-ignore -- idem
import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { ALLERGENS } from '../../src/nutrition/allergens';
import type { DaySession } from '../../src/nutrition/day-targets';
import { finalNeeds, type FinalNeeds } from '../../src/nutrition/final-needs';
import type { FoodMacros, PlanPrefs, Recipe } from '../../src/nutrition/plan';
import { buildShoppingList } from '../../src/nutrition/shopping';
import { DEFAULT_MEAL_CONFIG, generateWeekPlan } from '../../src/nutrition/week-plan';

// Test sur les VRAIES données (aliments Ciqual et recettes publiées) : le plan de la semaine tient les besoins, la variété et les filtres.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ROOT: string = (globalThis as any).process.cwd();
let recipes: Recipe[] = [];
let foods = new Map<string, FoodMacros>();
let units: Record<string, { label: string; grams: number }> = {};

beforeAll(() => {
  const r = spawnSync('node', ['tools/build-recettes.mjs'], { cwd: ROOT, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`build-recettes a échoué : ${r.stderr}`);
  recipes = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/recettes.json'), 'utf8')).recettes as Recipe[];
  const ali = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/aliments.json'), 'utf8')).aliments as Record<string, unknown>[];
  foods = new Map(ali.map((a) => [String(a.code), { code: String(a.code), kcal: Number(a.kcal), prot: Number(a.prot), gluc: Number(a.gluc), lip: Number(a.lip), perissable: !!a.perissable, gardeManger: !!a.gardeManger }]));
  units = {};
  for (const a of ali) {
    const u = a.unite as { label: string; grammes: number } | null;
    if (u) units[String(a.code)] = { label: u.label, grams: u.grammes };
  }
}, 60_000);

const clean = { grossesse: 'non', allaitement: 'non', postPartum: 'non', maladie: 'non', rapportAlimentation: 'non', medicament: 'non' } as const;
const semaine: DaySession[][] = [
  [{ kind: 'muscu', sessionType: 'LEGS', minutes: 60 }], [], [{ kind: 'muscu', sessionType: 'HAUT', minutes: 50 }], [], [{ kind: 'muscu', sessionType: 'CE', minutes: 70 }], [{ kind: 'cardio', minutes: 30 }], [],
];
const fin = (goal: 'perte' | 'maintien' | 'prise' = 'maintien'): FinalNeeds => {
  const r = finalNeeds({ answers: { ...clean }, body: { sex: 'homme', kg: 80, cm: 178, age: 32 }, sessionsPerWeek: 3, goal, pace: 'standard', adjust: 0, gel: false, days: semaine });
  if (r.status !== 'ok' || !r.week) throw new Error('besoins refusés');
  return r;
};
const base = (goal: PlanPrefs['goal']): Omit<PlanPrefs, 'mealsPerDay'> => ({ goal, allergens: [], allergenFree: [], diet: [], dislikedFoods: [], maxCookMin: null, appliances: ['four', 'micro-ondes', 'plaques', 'blender'], optimizeShopping: true });
const mains = (p: ReturnType<typeof generateWeekPlan>) => p.slots.filter((s) => s.kind === 'dejeuner' || s.kind === 'diner');

describe('plan de la semaine avec les vraies recettes', () => {
  it('la base publiée est assez riche : repas, petits-déjeuners, en-cas', () => {
    const by = (r: string) => recipes.filter((x) => x.repas === r).length;
    expect(by('dejeuner-diner')).toBeGreaterThanOrEqual(20);
    expect(by('petit-dej')).toBeGreaterThanOrEqual(10);
    expect(by('collation')).toBeGreaterThanOrEqual(8);
    for (const r of recipes) expect(r.statutAllergenes).toBe('valide');
  });

  it('aucune recette publiée ne contient un ingrédient non validé', () => {
    const ali = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/aliments.json'), 'utf8')).aliments as { code: string; statutAllergenes: string }[];
    const bad = new Set(ali.filter((a) => a.statutAllergenes !== 'valide').map((a) => a.code));
    for (const r of recipes) expect(r.ingredients.filter((i) => bad.has(i.code)).map((i) => i.nom), r.id).toEqual([]);
  });

  for (const goal of ['perte', 'maintien', 'prise'] as const) {
    it(`objectif ${goal} : 7 jours remplis, cibles tenues, plancher respecté, variété`, () => {
      const f = fin(goal);
      let totalMainsEmpty = 0;
      for (let seed = 1; seed <= 8; seed++) {
        const p = generateWeekPlan(f.week!, recipes, foods, base(f.goal), { ...DEFAULT_MEAL_CONFIG, gouter: Array(7).fill(true) }, seed, [], f.needs.floor);
        totalMainsEmpty += mains(p).filter((s) => !s.recipeId).length;
        const count = new Map<string, number>();
        for (const s of mains(p)) if (s.recipeId) count.set(s.recipeId, (count.get(s.recipeId) ?? 0) + 1);
        for (const [id, n] of count) expect(n, `${id} graine ${seed}`).toBeLessThanOrEqual(2);
        const prots = new Set(mains(p).map((s) => recipes.find((r) => r.id === s.recipeId)?.sourceProteines));
        expect(prots.size, `graine ${seed}`).toBeGreaterThanOrEqual(4);
        for (const d of p.days) expect(d.belowFloor, `jour ${d.day} graine ${seed}`).toBe(false);
        expect(buildShoppingList(p.ingredients, units).length).toBeGreaterThan(10);
      }
      expect(totalMainsEmpty).toBe(0);
    });
  }

  it('allergies : pour chacun des 14 allergènes, aucune recette du plan ne le contient', () => {
    const f = fin();
    for (const a of ALLERGENS) {
      for (let seed = 1; seed <= 3; seed++) {
        const p = generateWeekPlan(f.week!, recipes, foods, { ...base(f.goal), allergens: [a] }, { ...DEFAULT_MEAL_CONFIG, gouter: Array(7).fill(true) }, seed, [], f.needs.floor);
        for (const s of p.slots) if (s.recipeId) expect(recipes.find((r) => r.id === s.recipeId)!.allergenes.includes(a), `${s.recipeId} avec ${a}`).toBe(false);
      }
    }
  });

  it('sans porc : jamais de jambon, lardons, saucisse ni bolognaise ; végétarien : jamais de viande ni de poisson', () => {
    const f = fin();
    const porc = new Set(['28906', '28501', '30131', '28963', '28964', '11114']);
    for (let seed = 1; seed <= 5; seed++) {
      const p = generateWeekPlan(f.week!, recipes, foods, { ...base(f.goal), diet: ['sans_porc'] }, DEFAULT_MEAL_CONFIG, seed, [], f.needs.floor);
      for (const s of p.slots) if (s.recipeId) expect(recipes.find((r) => r.id === s.recipeId)!.ingredients.some((i) => porc.has(i.code)), s.recipeId!).toBe(false);
      const v = generateWeekPlan(f.week!, recipes, foods, { ...base(f.goal), diet: ['vegetarien'] }, DEFAULT_MEAL_CONFIG, seed, [], f.needs.floor);
      for (const s of v.slots) if (s.recipeId) expect(recipes.find((r) => r.id === s.recipeId)!.regimes, s.recipeId!).toContain('vegetarien');
    }
  });

  it('allergie grave : seules les recettes relues (controle_relecteur) sont proposées', () => {
    const f = fin();
    const p = generateWeekPlan(f.week!, recipes, foods, { ...base(f.goal), allergens: ['arachides'], strictControle: true }, DEFAULT_MEAL_CONFIG, 1, [], f.needs.floor);
    for (const s of p.slots) if (s.recipeId) expect(recipes.find((r) => r.id === s.recipeId)!.statut).toBe('controle_relecteur');
  });
});
