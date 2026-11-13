import { describe, expect, it } from 'vitest';
import { computeNeeds, palFor, restingEnergy, screenNutrition, type Body, type ScreeningAnswers } from '../../src/nutrition/needs';

const clean: ScreeningAnswers = {
  grossesse: 'non', allaitement: 'non', postPartum: 'non', maladie: 'non', rapportAlimentation: 'non', medicament: 'non',
};
const homme: Body = { sex: 'homme', kg: 85, cm: 180, age: 30 };

describe('dépistage', () => {
  it('libre quand tout est « non » et les données complètes', () => {
    expect(screenNutrition(clean, homme)).toBe('libre');
  });
  it('Repères seulement pour toute réponse oui, refus ou non répondue', () => {
    for (const k of Object.keys(clean) as (keyof ScreeningAnswers)[]) {
      for (const v of ['oui', 'refus', null] as const) {
        expect(screenNutrition({ ...clean, [k]: v }, homme)).toBe('reperes');
      }
    }
  });
  it('échec sûr si une donnée manque ou est hors bornes', () => {
    expect(screenNutrition(clean, { ...homme, sex: 'non_precise' })).toBe('reperes');
    expect(screenNutrition(clean, { ...homme, sex: null })).toBe('reperes');
    expect(screenNutrition(clean, { ...homme, age: null })).toBe('reperes');
    expect(screenNutrition(clean, { ...homme, cm: null })).toBe('reperes');
    expect(screenNutrition(clean, { ...homme, kg: 20 })).toBe('reperes');
    expect(screenNutrition(clean, { ...homme, age: 17 })).toBe('reperes');
  });
  it('IMC < 18,5 : repères seulement ; 65 ans ou plus : prudent', () => {
    expect(screenNutrition(clean, { ...homme, kg: 55 })).toBe('reperes');
    expect(screenNutrition(clean, { ...homme, age: 66 })).toBe('prudent');
  });
});

describe('besoins et plancher', () => {
  it('Mifflin-St Jeor', () => {
    expect(restingEnergy({ sex: 'homme', kg: 85, cm: 180, age: 30 })).toBeCloseTo(1830, 0);
    expect(restingEnergy({ sex: 'femme', kg: 60, cm: 165, age: 30 })).toBeCloseTo(1320.25, 1);
  });
  it('aucun chiffre en Repères seulement', () => {
    expect(computeNeeds({ screen: 'reperes', body: homme, sessionsPerWeek: 4, goal: 'perte', pace: 'standard' })).toBeNull();
  });
  it('perte : déficit plafonné, cible jamais sous le plancher', () => {
    for (const pace of ['doux', 'standard', 'ferme'] as const) {
      for (const sessions of [0, 2, 4, 6]) {
        for (const body of [homme, { sex: 'femme', kg: 62, cm: 165, age: 28 } as Body, { sex: 'femme', kg: 90, cm: 160, age: 66 } as Body]) {
          const n = computeNeeds({ screen: 'libre', body, sessionsPerWeek: sessions, goal: 'perte', pace })!;
          expect(n.target).toBeGreaterThanOrEqual(Math.min(n.floor, n.tdee) - 1e-9);
          expect(n.target).toBeLessThanOrEqual(n.tdee + 1e-9);
          expect(-n.deltaKcal).toBeLessThanOrEqual(750 + 1e-9);
        }
      }
    }
  });
  it('plancher qui atteint le besoin : déficit nul', () => {
    // besoin faible (peu actif) : le filet de 1200 kcal laisse peu de marge, jamais de cible sous le plancher
    const n = computeNeeds({ screen: 'libre', body: { sex: 'femme', kg: 52, cm: 160, age: 40 }, sessionsPerWeek: 0, goal: 'perte', pace: 'ferme' });
    expect(n).not.toBeNull();
    expect(n!.target).toBeGreaterThanOrEqual(Math.min(n!.floor, n!.tdee) - 1e-9);
  });
  it('IMC < 22 : aucun déficit chiffré', () => {
    const n = computeNeeds({ screen: 'libre', body: { sex: 'homme', kg: 65, cm: 180, age: 25 }, sessionsPerWeek: 4, goal: 'perte', pace: 'standard' })!;
    expect(n.deltaKcal).toBe(0);
    expect(n.noDeficitReason).toBe('imc');
  });
  it('≥ 65 ans : déficit au plus 10 % du besoin', () => {
    const n = computeNeeds({ screen: 'prudent', body: { sex: 'homme', kg: 95, cm: 175, age: 70 }, sessionsPerWeek: 3, goal: 'perte', pace: 'ferme' })!;
    expect(-n.deltaKcal).toBeLessThanOrEqual(n.tdee * 0.1 + 1e-9);
  });
  it('le dépistage « libre » transmis par erreur ne contourne ni IMC bas ni âge', () => {
    expect(computeNeeds({ screen: 'libre', body: { sex: 'homme', kg: 55, cm: 180, age: 30 }, sessionsPerWeek: 4, goal: 'perte', pace: 'standard' })).toBeNull();
    const n = computeNeeds({ screen: 'libre', body: { sex: 'femme', kg: 90, cm: 160, age: 66 }, sessionsPerWeek: 3, goal: 'perte', pace: 'ferme' })!;
    expect(-n.deltaKcal).toBeLessThanOrEqual(n.tdee * 0.1 + 1e-9);
  });
  it('IMC 22 à 25 : perte limitée au cran doux', () => {
    const body: Body = { sex: 'homme', kg: 75, cm: 178, age: 30 };
    const doux = computeNeeds({ screen: 'libre', body, sessionsPerWeek: 4, goal: 'perte', pace: 'doux' })!;
    const ferme = computeNeeds({ screen: 'libre', body, sessionsPerWeek: 4, goal: 'perte', pace: 'ferme' })!;
    expect(ferme.deltaKcal).toBe(doux.deltaKcal);
  });
  it('valeurs invalides : jamais le facteur d\u2019activité le plus haut', () => {
    expect(palFor(NaN)).toBe(1.4);
    expect(palFor(-3)).toBe(1.4);
    expect(palFor(7)).toBe(1.85);
  });
  it('prise : surplus plafonné à 300 kcal', () => {
    const n = computeNeeds({ screen: 'libre', body: homme, sessionsPerWeek: 5, goal: 'prise', pace: 'ferme' })!;
    expect(n.deltaKcal).toBeLessThanOrEqual(300);
    expect(n.deltaKcal).toBeGreaterThan(0);
  });
});
