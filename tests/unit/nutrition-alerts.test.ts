import { describe, expect, it } from 'vitest';
import { evaluateAlerts, nextAdjust, targetAllowed } from '../../src/nutrition/alerts';
import type { TrendPoint } from '../../src/nutrition/weight-trend';

const pts = (kgs: number[]): TrendPoint[] =>
  kgs.map((k, i) => ({ weekStart: new Date(Date.UTC(2026, 9, 5 + 7 * i)).toISOString().slice(0, 10), raw: k, trend: k }));

describe('alertes', () => {
  it('rien avec moins de 3 points', () => {
    expect(evaluateAlerts({ trend: pts([80, 70]), goal: 'perte' })).toEqual([]);
  });
  it('perte trop rapide deux semaines de suite : la cible doit monter', () => {
    expect(evaluateAlerts({ trend: pts([80, 79, 78.1]), goal: 'perte' })).toContain('rythme_trop_rapide');
    expect(evaluateAlerts({ trend: pts([80, 79.6, 79.2]), goal: 'perte' })).not.toContain('rythme_trop_rapide');
    // une seule semaine trop rapide ne suffit pas
    expect(evaluateAlerts({ trend: pts([80, 79.8, 78.9]), goal: 'perte' })).not.toContain('rythme_trop_rapide');
  });
  it('gel des déficits au-delà de 2 % par semaine', () => {
    expect(evaluateAlerts({ trend: pts([80, 80, 78]), goal: 'perte' })).toContain('gel_deficit');
  });
  it('perte de plus de 5 % en un mois sans objectif de perte : gel et message', () => {
    const a = evaluateAlerts({ trend: pts([80, 78.5, 77, 76, 75.5]), goal: 'maintien' });
    expect(a).toContain('gel_deficit');
    const b = evaluateAlerts({ trend: pts([80, 79, 78.1]), goal: 'prise' });
    expect(b).toContain('perte_non_voulue');
  });
  it('poids cible sous un IMC de 18,5 refusé', () => {
    expect(targetAllowed(60, 180)).toBe(true); // IMC 18,52 : juste au-dessus du seuil
    expect(targetAllowed(59.9, 180)).toBe(false); // IMC 18,49
    expect(targetAllowed(65, 180)).toBe(true);
    expect(targetAllowed(65, 50)).toBe(false);
    expect(targetAllowed(NaN, 180)).toBe(false);
  });
});

describe('recalage hebdomadaire', () => {
  const base = { currentAdjust: 0, tdeeInitial: 2500, goal: 'perte' as const, rateKgPerWeek: -0.2, targetKgPerWeek: -0.6, adherence: 'oui' as const, weeksOfData: 4 };
  it('perte plus lente que prévu : -150 kcal, jamais plus d’un pas par semaine', () => {
    expect(nextAdjust(base)).toBe(-150);
  });
  it('perte plus rapide que prévu : +150 kcal', () => {
    expect(nextAdjust({ ...base, rateKgPerWeek: -1.2 })).toBe(150);
  });
  it('adhérence « non », inconnue ou pas assez de données : aucun changement', () => {
    expect(nextAdjust({ ...base, adherence: 'non' })).toBe(0);
    expect(nextAdjust({ ...base, adherence: null })).toBe(0);
    expect(nextAdjust({ ...base, weeksOfData: 2 })).toBe(0);
    expect(nextAdjust({ ...base, rateKgPerWeek: null })).toBe(0);
  });
  it('cumul borné à ± 15 % du besoin initial', () => {
    let a = 0;
    for (let i = 0; i < 20; i++) a = nextAdjust({ ...base, currentAdjust: a });
    expect(a).toBeGreaterThanOrEqual(-2500 * 0.15 - 1e-9);
    a = 0;
    for (let i = 0; i < 20; i++) a = nextAdjust({ ...base, currentAdjust: a, rateKgPerWeek: -1.5 });
    expect(a).toBeLessThanOrEqual(2500 * 0.15 + 1e-9);
  });
  it('dans le rythme : pas de changement', () => {
    expect(nextAdjust({ ...base, rateKgPerWeek: -0.6 })).toBe(0);
  });
});
