import { describe, expect, it } from 'vitest';
import { dayTypeOf, weekTargets, type DayType } from '../../src/nutrition/day-targets';

const SEMAINES: DayType[][] = [
  ['lourd', 'repos', 'moyen', 'repos', 'lourd', 'leger', 'repos'],
  ['repos', 'repos', 'repos', 'repos', 'repos', 'repos', 'repos'],
  ['lourd', 'lourd', 'lourd', 'lourd', 'lourd', 'lourd', 'intense'],
  ['moyen', 'leger', 'moyen', 'leger', 'moyen', 'repos', 'intense'],
];

describe('type de jour', () => {
  it('repos sans séance, léger pour le cardio court, moyen pour le haut du corps, lourd pour les jambes, intense pour un match', () => {
    expect(dayTypeOf([])).toBe('repos');
    expect(dayTypeOf([{ kind: 'cardio', minutes: 30 }])).toBe('leger');
    expect(dayTypeOf([{ kind: 'muscu', sessionType: 'HAUT', minutes: 50 }])).toBe('moyen');
    expect(dayTypeOf([{ kind: 'muscu', sessionType: 'LEGS', minutes: 50 }])).toBe('lourd');
    expect(dayTypeOf([{ kind: 'muscu', sessionType: 'HAUT', minutes: 80 }])).toBe('lourd');
    expect(dayTypeOf([{ kind: 'muscu', minutes: 40 }, { kind: 'cardio', minutes: 20 }])).toBe('lourd');
    expect(dayTypeOf([{ kind: 'sport', minutes: 90, match: true }])).toBe('intense');
  });
});

describe('besoins de la semaine', () => {
  for (const types of SEMAINES) {
    for (const avg of [1700, 2200, 2800]) {
      it(`moyenne conservée, plancher respecté, écart <= 300 kcal (${types.join(',')} ; ${avg})`, () => {
        const floor = 1500;
        const w = weekTargets({ types, avgKcal: avg, floorKcal: floor, kg: 80, goal: 'maintien' })!;
        expect(w).toHaveLength(7);
        expect(w.reduce((s, d) => s + d.kcal, 0) / 7).toBeCloseTo(avg, 3);
        for (const d of w) {
          expect(d.kcal).toBeGreaterThanOrEqual(floor - 1e-6);
          expect(Math.abs(d.kcal - avg)).toBeLessThanOrEqual(300 + 1e-6);
        }
      });
    }
  }

  it('jour lourd plus riche que le repos ; protéines : moyenne conservée et variation <= 10 %', () => {
    const w = weekTargets({ types: ['lourd', 'repos', 'moyen', 'repos', 'lourd', 'leger', 'repos'], avgKcal: 2400, floorKcal: 1500, kg: 80, goal: 'prise' })!;
    expect(w[0].kcal).toBeGreaterThan(w[1].kcal);
    expect(w[0].glucG).toBeGreaterThan(w[1].glucG);
    const base = 1.8 * 80;
    expect(w.reduce((s, d) => s + d.protG, 0) / 7).toBeCloseTo(base, 6);
    for (const d of w) expect(Math.abs(d.protG - base) / base).toBeLessThanOrEqual(0.1 + 1e-9);
    // la variation ne touche que 1 à 2 jours à la hausse
    expect(w.filter((d) => d.protG > base + 1e-6).length).toBeLessThanOrEqual(2);
  });

  it('plancher proche de la moyenne : aucun jour sous le plancher, moyenne conservée', () => {
    const w = weekTargets({ types: ['repos', 'repos', 'lourd', 'repos', 'lourd', 'repos', 'repos'], avgKcal: 1560, floorKcal: 1500, kg: 60, goal: 'perte' })!;
    for (const d of w) expect(d.kcal).toBeGreaterThanOrEqual(1500 - 1e-6);
    expect(w.reduce((s, d) => s + d.kcal, 0) / 7).toBeCloseTo(1560, 3);
  });

  it('refuse une moyenne sous le plancher ou des entrées invalides', () => {
    expect(weekTargets({ types: SEMAINES[0], avgKcal: 1400, floorKcal: 1500, kg: 80, goal: 'perte' })).toBeNull();
    expect(weekTargets({ types: SEMAINES[0].slice(0, 6), avgKcal: 2000, floorKcal: 1500, kg: 80, goal: 'perte' })).toBeNull();
    expect(weekTargets({ types: SEMAINES[0], avgKcal: NaN, floorKcal: 1500, kg: 80, goal: 'perte' })).toBeNull();
  });
});
