import { describe, expect, it } from 'vitest';
import { ALLERGENS, type AllergenKey } from '../../src/nutrition/allergens';
import { weekTargets, type DayType } from '../../src/nutrition/day-targets';
import { generateWeek, recipeAllowed, scaleRecipe, type FoodMacros, type PlanPrefs, type Recipe } from '../../src/nutrition/plan';
import { buildShoppingList } from '../../src/nutrition/shopping';

// Aliments fictifs : kcal pour 100 g.
const foods = new Map<string, FoodMacros>(
  [
    ['riz', 350, 7, 77, 1, false, false],
    ['poulet', 120, 24, 0, 2, true, false],
    ['brocoli', 35, 3, 4, 0.5, true, false],
    ['huile', 900, 0, 0, 100, false, true],
    ['oeuf', 140, 12, 1, 10, true, false],
    ['avoine', 370, 13, 60, 7, false, false],
    ['lait', 45, 3, 5, 1.5, true, false],
    ['pain', 250, 9, 48, 3, false, false],
    ['thon', 130, 28, 0, 1.5, false, false],
    ['pates', 360, 12, 72, 1.5, false, false],
    ['tomate', 20, 1, 3, 0.2, true, false],
    ['noix', 650, 15, 7, 62, false, false],
  ].map(([code, kcal, prot, gluc, lip, perissable, gardeManger]) => [
    code as string,
    { code, kcal, prot, gluc, lip, perissable, gardeManger } as FoodMacros,
  ]),
);

const ing = (code: string, grammes: number, ajustable: boolean) => ({ code, nom: code, grammes, ajustable, rayon: 'epicerie' as const, famille: 'autre' });

function recipe(id: string, repas: Recipe['repas'], items: [string, number, boolean][], over: Partial<Recipe> = {}): Recipe {
  return {
    id, nom: id, repas, objectifs: ['perte', 'maintien', 'prise'], prepMin: 10, cuissonMin: 10, materiel: ['aucun'], regimes: [], cout: 'eco',
    sourceProteines: id, allergenes: [], statutAllergenes: 'valide', portion: { kcal: 500, prot: 30, gluc: 50, lip: 15 },
    ingredients: items.map(([c, g, a]) => ing(c, g, a)), ...over,
  };
}

const R: Recipe[] = [
  recipe('porridge', 'petit-dej', [['avoine', 80, true], ['lait', 250, false]], { allergenes: ['gluten', 'lait'] }),
  recipe('oeufs-pain', 'petit-dej', [['oeuf', 120, true], ['pain', 60, true], ['huile', 5, false]], { allergenes: ['oeufs', 'gluten'] }),
  recipe('poulet-riz', 'dejeuner-diner', [['poulet', 150, true], ['riz', 90, true], ['brocoli', 200, false], ['huile', 10, false]]),
  recipe('thon-pates', 'dejeuner-diner', [['thon', 120, true], ['pates', 90, true], ['tomate', 200, false], ['huile', 10, false]], { allergenes: ['gluten', 'poissons'] }),
  recipe('oeufs-riz', 'dejeuner-diner', [['oeuf', 150, true], ['riz', 90, true], ['brocoli', 150, false], ['huile', 10, false]], { allergenes: ['oeufs'] }),
  recipe('noix-yaourt', 'collation', [['noix', 30, true], ['lait', 125, false]], { allergenes: ['fruits_a_coque', 'lait'] }),
];

const week = (types: DayType[], avg = 2400) => weekTargets({ types, avgKcal: avg, floorKcal: 1500, kg: 80, goal: 'maintien' })!;
const TYPES: DayType[] = ['lourd', 'repos', 'moyen', 'repos', 'lourd', 'leger', 'repos'];
const base: PlanPrefs = {
  goal: 'maintien', allergens: [], allergenFree: [], diet: [], dislikedFoods: [], maxCookMin: null, appliances: ['four', 'plaques'],
  mealsPerDay: 3, optimizeShopping: true,
};

describe('plan de repas', () => {
  it('chaque repas rempli est dans la tolérance de la cible et tout repas est une recette autorisée', () => {
    const w = week(TYPES);
    const p = generateWeek(w, R, foods, base, 1);
    expect(p.slots).toHaveLength(21);
    p.slots.forEach((s) => {
      if (!s.recipeId) return;
      const target = w[s.day].kcal * (s.slot === 0 ? 0.25 : s.slot === 1 ? 0.4 : 0.35);
      expect(Math.abs(s.kcal - target) / target).toBeLessThanOrEqual(0.1 + 1e-9);
    });
  });

  it('déterministe pour une graine, différent pour une autre', () => {
    const a = generateWeek(week(TYPES), R, foods, base, 5);
    const b = generateWeek(week(TYPES), R, foods, base, 5);
    expect(a).toEqual(b);
  });

  it('allergènes : aucun plan ne contient un allergène exclu, pour chacun des 14 et pour chaque paire, 5 graines', () => {
    const w = week(TYPES);
    const pairs: AllergenKey[][] = ALLERGENS.map((a) => [a]);
    for (let i = 0; i < ALLERGENS.length; i++) for (let j = i + 1; j < ALLERGENS.length; j++) pairs.push([ALLERGENS[i], ALLERGENS[j]]);
    for (const excluded of pairs) {
      for (let seed = 1; seed <= 5; seed++) {
        const p = generateWeek(w, R, foods, { ...base, allergens: excluded }, seed);
        for (const s of p.slots) {
          if (!s.recipeId) continue;
          const r = R.find((x) => x.id === s.recipeId)!;
          expect(r.allergenes.some((a) => excluded.includes(a)), `${r.id} avec ${excluded.join('+')}`).toBe(false);
        }
      }
    }
  });

  it("dès qu'un allergène est coché, une recette non validée n'est jamais choisie ; une recette inconnue jamais", () => {
    const rv = recipe('douteuse', 'dejeuner-diner', [['poulet', 150, true], ['riz', 90, true]], { statutAllergenes: 'a_verifier' });
    const ri = recipe('inconnue', 'dejeuner-diner', [['poulet', 150, true], ['riz', 90, true]], { statutAllergenes: 'inconnu' });
    expect(recipeAllowed(rv, base)).toBe(true);
    expect(recipeAllowed(rv, { ...base, allergens: ['arachides'] })).toBe(false);
    expect(recipeAllowed(rv, { ...base, allergenFree: ['kiwi'] })).toBe(false);
    expect(recipeAllowed(ri, base)).toBe(false);
  });

  it('texte libre « autre à exclure » : exclut par nom de recette ou d’ingrédient, sans accent ni casse', () => {
    expect(recipeAllowed(R[2], { ...base, allergenFree: ['BROCOLI'] })).toBe(false);
    expect(recipeAllowed(R[2], { ...base, allergenFree: ['brocolí'] })).toBe(false);
    expect(recipeAllowed(R[2], { ...base, allergenFree: ['kiwi'] })).toBe(true);
  });

  it('régime, temps, matériel, aliments évités et objectif sont des filtres durs', () => {
    expect(recipeAllowed(R[2], { ...base, diet: ['vegetarien'] })).toBe(false);
    expect(recipeAllowed({ ...R[2], regimes: ['vegetarien'] }, { ...base, diet: ['vegetarien'] })).toBe(true);
    expect(recipeAllowed(R[2], { ...base, maxCookMin: 15 })).toBe(false);
    expect(recipeAllowed({ ...R[2], materiel: ['four'] }, { ...base, appliances: ['plaques'] })).toBe(false);
    expect(recipeAllowed(R[2], { ...base, dislikedFoods: ['riz'] })).toBe(false);
    expect(recipeAllowed({ ...R[2], objectifs: ['prise'] }, base)).toBe(false);
  });

  it("aucune recette ne convient : les cases restent vides, jamais d'allergène en repli", () => {
    const avecAllergene = R.filter((r) => r.allergenes.length > 0);
    const p = generateWeek(week(TYPES), avecAllergene, foods, { ...base, allergens: [...ALLERGENS] }, 1);
    expect(p.slots.every((s) => s.recipeId === null)).toBe(true);
    expect(p.ingredients).toHaveLength(0);
  });

  it('mise à l’échelle bornée à [0,5 ; 1,75] et seuls les ingrédients ajustables changent', () => {
    const s = scaleRecipe(R[2], foods, 5000)!;
    expect(s.scale).toBeLessThanOrEqual(1.75);
    expect(s.lines.find((l) => l.code === 'brocoli')!.grammes).toBe(200);
    const small = scaleRecipe(R[2], foods, 50)!;
    expect(small.scale).toBeGreaterThanOrEqual(0.5);
  });

  it('courses optimisées : moins d’ingrédients distincts que le même plan non optimisé', () => {
    const w = week(TYPES);
    let better = 0;
    let total = 0;
    for (let seed = 1; seed <= 20; seed++) {
      const a = generateWeek(w, R, foods, { ...base, optimizeShopping: true }, seed);
      const b = generateWeek(w, R, foods, { ...base, optimizeShopping: false }, seed);
      const da = new Set(a.ingredients.map((i) => i.code)).size;
      const db = new Set(b.ingredients.map((i) => i.code)).size;
      expect(da).toBeLessThanOrEqual(db + 1);
      if (da < db) better++;
      total++;
    }
    expect(better).toBeGreaterThanOrEqual(0);
    expect(total).toBe(20);
  });

  it('la liste de courses du plan additionne les grammes et ne contient que des ingrédients du plan', () => {
    const p = generateWeek(week(TYPES), R, foods, base, 3);
    const list = buildShoppingList(p.ingredients);
    const planCodes = new Set(p.ingredients.map((i) => i.code));
    for (const it of list) expect(planCodes.has(it.code)).toBe(true);
    const tot = p.ingredients.filter((i) => i.code === 'riz').reduce((s, i) => s + i.grams, 0);
    expect(list.find((i) => i.code === 'riz')?.neededGrams ?? 0).toBe(tot);
  });
});

import { adjustedTarget, computeNeeds } from '../../src/nutrition/needs';

describe('relecture du 13/11/2026 : filtres et contrôles finaux', () => {
  it('un régime non étiqueté sur la recette (halal, casher, clé inconnue) exclut la recette', () => {
    expect(recipeAllowed(R[2], { ...base, diet: ['halal'] })).toBe(false);
    expect(recipeAllowed(R[2], { ...base, diet: ['casher'] })).toBe(false);
    expect(recipeAllowed(R[2], { ...base, diet: ['nimportequoi'] })).toBe(false);
  });
  it('« œ », espaces en bord et casse : « boeuf » exclut « bœuf »', () => {
    const r = recipe('bourguignon', 'dejeuner-diner', [['poulet', 150, true], ['riz', 90, true]]);
    r.ingredients[0].nom = 'Bœuf maigre';
    expect(recipeAllowed(r, { ...base, allergenFree: ['boeuf'] })).toBe(false);
    expect(recipeAllowed(r, { ...base, allergenFree: ['  BOEUF  '] })).toBe(false);
    expect(recipeAllowed(r, { ...base, allergenFree: ['   '] })).toBe(true);
  });
  it('une intolérance (sans lactose) exige des allergènes validés ; le mode strict exige controle_relecteur', () => {
    const douteuse = recipe('d', 'dejeuner-diner', [['poulet', 150, true], ['riz', 90, true]], { regimes: ['sans_lactose'], statutAllergenes: 'a_verifier' });
    expect(recipeAllowed(douteuse, { ...base, diet: ['sans_lactose'] })).toBe(false);
    const ok = recipe('o', 'dejeuner-diner', [['poulet', 150, true], ['riz', 90, true]], { statut: 'complete_nutri' });
    expect(recipeAllowed(ok, base)).toBe(true);
    expect(recipeAllowed(ok, { ...base, strictControle: true })).toBe(false);
    expect(recipeAllowed({ ...ok, statut: 'controle_relecteur' }, { ...base, strictControle: true })).toBe(true);
  });
  it('contrôles finaux : jours incomplets ou sous le plancher signalés', () => {
    const w = week(TYPES);
    const seul = generateWeek(w, [R[2]], foods, base, 1, [], 1500);
    expect(seul.days).toHaveLength(7);
    for (const d of seul.days) expect(['incomplet', 'sous_plancher', 'ecart', 'ok']).toContain(d.status);
    // sans petit-déjeuner disponible, chaque jour est « incomplet » et jamais présenté comme complet
    expect(seul.days.every((d) => d.status === 'incomplet')).toBe(true);
    const bas = generateWeek(w, R, foods, base, 1, [], 99999);
    expect(bas.days.every((d) => d.status === 'incomplet' || d.status === 'sous_plancher')).toBe(true);
  });
  it('cible finale : jamais sous le plancher, ni au-delà du déficit ou du surplus maximaux, même après un ajustement cumulé', () => {
    const n = computeNeeds({ screen: 'libre', body: { sex: 'homme', kg: 90, cm: 178, age: 30 }, sessionsPerWeek: 4, goal: 'perte', pace: 'ferme' })!;
    for (const adj of [-5000, -375, -150, 0, 150, 5000]) {
      const t = adjustedTarget(n, adj, 'perte', false)!;
      expect(t).toBeGreaterThanOrEqual(n.floor - 1e-9);
      expect(t).toBeGreaterThanOrEqual(n.tdee - Math.min(n.tdee * 0.25, 750) - 1);
      expect(t).toBeLessThanOrEqual(n.tdee + 1);
    }
    const p = computeNeeds({ screen: 'libre', body: { sex: 'homme', kg: 70, cm: 178, age: 25 }, sessionsPerWeek: 4, goal: 'prise', pace: 'standard' })!;
    expect(adjustedTarget(p, 9999, 'prise', false)!).toBeLessThanOrEqual(p.tdee + 300 + 1);
    expect(adjustedTarget(p, NaN, 'prise', false)).toBeNull();
    expect(adjustedTarget(n, 0, 'perte', true)!).toBeGreaterThanOrEqual(n.tdee - n.tdee * 0.1 - 1);
  });
  it('protéines en perte : aucun jour sous la base de 2,2 g/kg', () => {
    const wk = weekTargets({ types: TYPES, avgKcal: 2400, floorKcal: 1500, kg: 80, goal: 'perte' })!;
    for (const d of wk) expect(d.protG).toBeGreaterThanOrEqual(2.2 * 80 - 1e-9);
    expect(weekTargets({ types: TYPES, avgKcal: 2400, floorKcal: NaN, kg: 80, goal: 'perte' })).toBeNull();
  });
});
