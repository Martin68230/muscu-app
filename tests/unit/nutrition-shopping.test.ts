import { describe, expect, it } from 'vitest';
import { buildShoppingList, shoppingToText, type PlannedIngredient } from '../../src/nutrition/shopping';

const ing = (code: string, grams: number, rayon: PlannedIngredient['rayon'] = 'feculents', pantry = false): PlannedIngredient =>
  ({ code, name: code, grams, rayon, pantry });

describe('liste de courses', () => {
  it('additionne les grammes par ingrédient', () => {
    const l = buildShoppingList([ing('riz', 120), ing('riz', 80), ing('poulet', 150, 'viandes_poissons')]);
    expect(l.find((i) => i.code === 'riz')!.neededGrams).toBe(200);
    expect(l).toHaveLength(2);
  });
  it("l'arrondi n'est jamais inférieur au besoin", () => {
    for (const g of [1, 7, 99, 101, 250.4, 1000]) {
      const l = buildShoppingList([ing('x', g)]);
      expect(l[0].buyGrams).toBeGreaterThanOrEqual(g);
    }
  });
  it('unités d’achat : œufs à la pièce', () => {
    const l = buildShoppingList([ing('oeuf', 110, 'laitiers_oeufs')], { oeuf: { label: 'œufs', grams: 55 } });
    expect(l[0].units).toEqual({ label: 'œufs', count: 2 });
    const l2 = buildShoppingList([ing('oeuf', 111, 'laitiers_oeufs')], { oeuf: { label: 'œufs', grams: 55 } });
    expect(l2[0].units!.count).toBe(3);
  });
  it('trié par rayon, ingrédients vides ignorés, garde-manger masqué dans le texte', () => {
    const l = buildShoppingList([ing('sel', 5, 'assaisonnements', true), ing('pomme', 300, 'fruits_legumes'), ing('rien', 0)]);
    expect(l.map((i) => i.code)).toEqual(['pomme', 'sel']);
    const txt = shoppingToText(l);
    expect(txt).toContain('pomme');
    expect(txt).not.toContain('sel :');
    expect(txt).toContain('étiquettes');
  });
});
