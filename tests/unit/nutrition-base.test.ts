import { describe, expect, it } from 'vitest';
import { ALLERGENS, ingredientAllowed, recipeAllergens, type LabeledIngredient } from '../../src/nutrition/allergens';
import { interpretTrend, isSuspiciousJump, rateKgPerWeek, smoothWeights, weekStartOf } from '../../src/nutrition/weight-trend';

describe('allergènes', () => {
  it('liste officielle de 14 allergènes', () => {
    expect(ALLERGENS).toHaveLength(14);
    expect(new Set(ALLERGENS).size).toBe(14);
  });

  it("aucun ingrédient inconnu n'est jamais utilisable", () => {
    const inc: LabeledIngredient = { code: 'x', allergenes: [], statut: 'inconnu' };
    expect(ingredientAllowed(inc, [])).toBe(false);
    expect(ingredientAllowed(inc, ['lait'])).toBe(false);
  });

  it('dès qu’un allergène est coché, seuls les ingrédients valides sans cet allergène passent', () => {
    const aVerifier: LabeledIngredient = { code: 'a', allergenes: [], statut: 'a_verifier' };
    const lait: LabeledIngredient = { code: 'b', allergenes: ['lait'], statut: 'valide' };
    const riz: LabeledIngredient = { code: 'c', allergenes: [], statut: 'valide' };
    expect(ingredientAllowed(aVerifier, [])).toBe(true);
    expect(ingredientAllowed(aVerifier, ['soja'])).toBe(false);
    expect(ingredientAllowed(lait, ['lait'])).toBe(false);
    expect(ingredientAllowed(lait, ['soja'])).toBe(true);
    expect(ingredientAllowed(riz, [...ALLERGENS])).toBe(true);
  });

  it('une clé d\u2019allergène invalide rend l\u2019ingrédient inutilisable et fait échouer la recette', () => {
    const bad = { code: 'z', allergenes: ['laitt'], statut: 'valide' } as unknown as LabeledIngredient;
    expect(ingredientAllowed(bad, [])).toBe(false);
    expect(ingredientAllowed(bad, ['lait'])).toBe(false);
    expect(() => recipeAllergens([bad])).toThrow();
  });

  it('une recette cumule les allergènes de ses ingrédients', () => {
    const l: LabeledIngredient[] = [
      { code: 'a', allergenes: ['lait', 'oeufs'], statut: 'valide' },
      { code: 'b', allergenes: ['oeufs'], statut: 'valide' },
    ];
    expect(recipeAllergens(l)).toEqual(['oeufs', 'lait']);
  });
});

describe('poids lissé', () => {
  const w = (date: string, kg: number) => ({ date, kg });

  it('le lundi de la semaine', () => {
    expect(weekStartOf('2026-11-13')).toBe('2026-11-09');
    expect(weekStartOf('2026-11-15')).toBe('2026-11-09');
    expect(weekStartOf('2026-11-16')).toBe('2026-11-16');
  });

  it('reste borné par les points et saute les semaines sans pesée', () => {
    const t = smoothWeights([w('2026-10-05', 80), w('2026-10-26', 78), w('2026-11-02', 79.4)]);
    expect(t).toHaveLength(3);
    const kgs = [80, 78, 79.4];
    for (const p of t) {
      expect(p.trend).toBeGreaterThanOrEqual(Math.min(...kgs));
      expect(p.trend).toBeLessThanOrEqual(Math.max(...kgs));
    }
  });

  it('moyenne plusieurs pesées de la même semaine et ignore les pesées exclues ou invraisemblables', () => {
    const t = smoothWeights([w('2026-10-05', 80), w('2026-10-07', 82), { date: '2026-10-08', kg: 90, excluded: true }, w('2026-10-09', 5)]);
    expect(t).toHaveLength(1);
    expect(t[0].raw).toBe(81);
  });

  it('pas de rythme avant 3 points ni 14 jours', () => {
    expect(rateKgPerWeek(smoothWeights([w('2026-10-05', 80), w('2026-10-12', 79.5)]))).toBeNull();
    const r = rateKgPerWeek(smoothWeights([w('2026-10-05', 80), w('2026-10-12', 79.5), w('2026-10-19', 79)]));
    expect(r).not.toBeNull();
    expect(r!.kgPerWeek).toBeLessThan(0);
  });

  it('interprétation : états', () => {
    expect(interpretTrend(null, -0.5)).toBe('pas_assez');
    expect(interpretTrend({ kgPerWeek: -0.5 }, -0.5)).toBe('dans_le_rythme');
    expect(interpretTrend({ kgPerWeek: -0.1 }, -0.5)).toBe('plus_lent');
    expect(interpretTrend({ kgPerWeek: -0.9 }, -0.5)).toBe('plus_rapide');
    expect(interpretTrend({ kgPerWeek: 0.2 }, -0.5)).toBe('plus_lent');
    expect(interpretTrend({ kgPerWeek: 0.05 }, 0)).toBe('stable');
  });

  it('date invalide ignorée, alpha invalide borné', () => {
    expect(smoothWeights([w('pas-une-date', 80)])).toHaveLength(0);
    const t = smoothWeights([w('2026-10-05', 80), w('2026-10-12', 78)], NaN);
    expect(t[1].trend).toBeGreaterThan(78);
    expect(t[1].trend).toBeLessThan(80);
  });

  it('saut suspect', () => {
    expect(isSuspiciousJump(80, 82.5)).toBe(true);
    expect(isSuspiciousJump(80, 81)).toBe(false);
  });
});
