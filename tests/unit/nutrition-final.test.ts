import { describe, expect, it } from 'vitest';
import type { DaySession } from '../../src/nutrition/day-targets';
import { explainReperes, finalNeeds, type FinalInput, type FinalNeeds } from '../../src/nutrition/final-needs';
import { adjustedTarget, type Body, type ScreeningAnswers } from '../../src/nutrition/needs';
import { generateWeek, type FoodMacros, type PlanPrefs, type Recipe } from '../../src/nutrition/plan';
import { buildShoppingList } from '../../src/nutrition/shopping';

const clean: ScreeningAnswers = { grossesse: 'non', allaitement: 'non', postPartum: 'non', maladie: 'non', rapportAlimentation: 'non', medicament: 'non' };
const homme: Body = { sex: 'homme', kg: 80, cm: 178, age: 32 };
const semaine: DaySession[][] = [
  [{ kind: 'muscu', sessionType: 'LEGS', minutes: 60 }], [], [{ kind: 'muscu', sessionType: 'HAUT', minutes: 50 }], [], [{ kind: 'muscu', sessionType: 'CE', minutes: 70 }], [{ kind: 'cardio', minutes: 30 }], [],
];
const base: FinalInput = { answers: clean, body: homme, sessionsPerWeek: 3, goal: 'perte', pace: 'standard', adjust: 0, gel: false, days: semaine };
const ok = (i: FinalInput): FinalNeeds => {
  const r = finalNeeds(i);
  if (r.status !== 'ok') throw new Error(`refusé : ${r.reasons.map((x) => x.text).join(' | ')}`);
  return r;
};

describe('cible finale unique', () => {
  it('calories, macros, eau et rythme sont cohérents entre eux', () => {
    const f = ok(base);
    expect(f.kcal).toBe(adjustedTarget(f.needs, 0, 'perte', false));
    expect(4 * f.protG + 4 * f.glucG + 9 * f.lipG).toBeCloseTo(f.kcal, 0);
    expect(f.waterL).toBe(2.5);
    expect(f.targetKgPerWeek).toBeCloseTo(-0.6, 5);
    expect(f.week).toHaveLength(7);
    expect(f.week!.reduce((s, d) => s + d.kcal, 0) / 7).toBeCloseTo(f.kcal, 3);
    expect(ok({ ...base, body: { sex: 'femme', kg: 62, cm: 165, age: 28 } }).waterL).toBe(2.0);
  });

  it('jour lourd plus riche que le repos ; les types de jour viennent du programme', () => {
    const f = ok(base);
    expect(f.dayTypes[0]).toBe('lourd');
    expect(f.dayTypes[1]).toBe('repos');
    expect(f.week![0].kcal).toBeGreaterThan(f.week![1].kcal);
  });

  it('le gel des déficits transforme la perte en maintien (jamais de déficit)', () => {
    const f = ok({ ...base, gel: true });
    expect(f.goal).toBe('maintien');
    expect(f.needs.deltaKcal).toBe(0);
    expect(f.targetKgPerWeek).toBe(0);
  });

  it('l’ajustement de recalage ne franchit jamais le plancher ni le déficit maximal', () => {
    const f = ok({ ...base, adjust: -5000 });
    expect(f.kcal).toBeGreaterThanOrEqual(f.needs.floor);
    expect(f.kcal).toBeGreaterThanOrEqual(f.needs.tdee - Math.min(f.needs.tdee * 0.25, 750) - 1);
  });

  it('perte : un plancher au-dessus du besoin ne pousse jamais la cible au-dessus du besoin', () => {
    // homme léger et peu actif : besoin proche du filet de 1500 kcal
    const f = ok({ ...base, body: { sex: 'homme', kg: 62, cm: 172, age: 60 }, sessionsPerWeek: 0 });
    expect(f.kcal).toBeLessThanOrEqual(Math.ceil(f.needs.tdee));
  });
});

describe('raisons affichées quand l’app ne calcule pas', () => {
  const reasons = (a: Partial<ScreeningAnswers>, b: Partial<Body>) => explainReperes({ ...clean, ...a }, { ...homme, ...b }).map((r) => r.code);

  it('rien ne s’oppose quand tout est complet', () => {
    expect(reasons({}, {})).toEqual([]);
  });
  it('sexe, naissance, taille, poids manquants : chacun est nommé et corrigeable', () => {
    expect(reasons({}, { sex: 'non_precise' })).toContain('sexe');
    expect(reasons({}, { sex: null })).toContain('sexe');
    expect(reasons({}, { age: null })).toContain('naissance');
    expect(reasons({}, { cm: null })).toContain('taille');
    expect(reasons({}, { kg: null })).toContain('poids');
    expect(reasons({}, { cm: 500 })).toContain('taille');
    for (const r of explainReperes(clean, { sex: null, kg: null, cm: null, age: null })) expect(r.fixable).toBe(true);
  });
  it('mineur et IMC bas : motif clair, orientation vers un professionnel', () => {
    const m = explainReperes(clean, { ...homme, age: 17 });
    expect(m.map((r) => r.code)).toContain('mineur');
    expect(m.find((r) => r.code === 'mineur')!.fixable).toBe(false);
    const imc = explainReperes(clean, { ...homme, kg: 55 });
    expect(imc.map((r) => r.code)).toContain('imc_bas');
  });
  it('chaque question en « oui », « refus » ou sans réponse est nommée', () => {
    for (const k of Object.keys(clean) as (keyof ScreeningAnswers)[]) {
      expect(reasons({ [k]: 'oui' }, {})).toContain('question_oui');
      expect(reasons({ [k]: 'refus' }, {})).toContain('question_refus');
      expect(reasons({ [k]: null }, {})).toContain('question_vide');
    }
  });
  it('quand il y a un motif, aucun chiffre n’est renvoyé', () => {
    for (const body of [{ sex: 'non_precise' as const }, { age: 15 }, { kg: 50 }]) {
      const r = finalNeeds({ ...base, body: { ...homme, ...body } });
      expect(r.status).toBe('reperes');
      if (r.status === 'reperes') {
        expect(r.reasons.length).toBeGreaterThan(0);
        expect(JSON.stringify(r)).not.toMatch(/kcal":\d/);
      }
    }
    expect(finalNeeds({ ...base, answers: { ...clean, maladie: 'oui' } }).status).toBe('reperes');
  });
});

describe('le plan de repas et la liste de courses lisent la même cible', () => {
  const foods = new Map<string, FoodMacros>([
    ['riz', { code: 'riz', kcal: 350, prot: 7, gluc: 77, lip: 1, perissable: false, gardeManger: false }],
    ['poulet', { code: 'poulet', kcal: 120, prot: 24, gluc: 0, lip: 2, perissable: true, gardeManger: false }],
    ['avoine', { code: 'avoine', kcal: 370, prot: 13, gluc: 60, lip: 7, perissable: false, gardeManger: false }],
    ['lait', { code: 'lait', kcal: 45, prot: 3, gluc: 5, lip: 1.5, perissable: true, gardeManger: false }],
  ]);
  const ing = (code: string, grammes: number, ajustable: boolean) => ({ code, nom: code, grammes, ajustable, rayon: 'epicerie' as const, famille: 'autre' });
  const recipes: Recipe[] = [
    { id: 'porridge', nom: 'Porridge', repas: 'petit-dej', objectifs: ['perte', 'maintien', 'prise'], prepMin: 5, cuissonMin: 5, materiel: ['aucun'], regimes: [], cout: 'eco', sourceProteines: 'lait', allergenes: ['gluten', 'lait'], statutAllergenes: 'valide', portion: { kcal: 400, prot: 15, gluc: 60, lip: 8 }, ingredients: [ing('avoine', 80, true), ing('lait', 250, false)] },
    { id: 'poulet-riz', nom: 'Poulet riz', repas: 'dejeuner-diner', objectifs: ['perte', 'maintien', 'prise'], prepMin: 10, cuissonMin: 15, materiel: ['aucun'], regimes: [], cout: 'eco', sourceProteines: 'poulet', allergenes: [], statutAllergenes: 'valide', portion: { kcal: 600, prot: 40, gluc: 60, lip: 8 }, ingredients: [ing('poulet', 150, true), ing('riz', 90, true)] },
  ];
  const prefs: PlanPrefs = { goal: 'perte', allergens: [], allergenFree: [], diet: [], dislikedFoods: [], maxCookMin: null, appliances: [], mealsPerDay: 3, optimizeShopping: true };

  it('le plan part des 7 jours de la cible finale ; la liste vient du plan', () => {
    const f = ok(base);
    const plan = generateWeek(f.week!, recipes, foods, prefs, 1, [], f.needs.floor);
    expect(plan.days).toHaveLength(7);
    plan.days.forEach((d, i) => expect(d.targetKcal).toBeCloseTo(f.week![i].kcal, 6));
    const list = buildShoppingList(plan.ingredients);
    const used = new Set(plan.ingredients.map((x) => x.code));
    for (const it of list) expect(used.has(it.code)).toBe(true);
  });
});
