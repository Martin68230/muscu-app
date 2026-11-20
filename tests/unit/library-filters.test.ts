import { describe, expect, it } from 'vitest';
import type { Fiche } from '../../src/data/fiches';
import { activeFilters, filterFiches, NO_FILTERS } from '../../src/data/library-filters';

const fiche = (id: string, niveauMin: string, musclesPrincipaux: string[], tags: string[][]): Fiche =>
  ({ id, nom: id, niveauMin, musclesPrincipaux, variantes: tags.map((t, i) => ({ id: `${id}${i}`, tags: t })) }) as unknown as Fiche;
const L = [
  fiche('pompe', 'debutant', ['pectoraux'], [['poids_du_corps', 'tapis']]),
  fiche('dev', 'intermediaire', ['pectoraux'], [['halteres', 'banc']]),
  fiche('tirage', 'avance', ['grand_dorsal'], [['barre']]),
];
describe('filterFiches', () => {
  it('muscle, niveau, matériel', () => {
    expect(filterFiches(L, { ...NO_FILTERS, muscle: 'pectoraux' }).map((f) => f.id)).toEqual(['pompe', 'dev']);
    expect(filterFiches(L, { ...NO_FILTERS, level: 'debutant' }).map((f) => f.id)).toEqual(['pompe']);
    expect(filterFiches(L, { ...NO_FILTERS, level: 'intermediaire' }).map((f) => f.id)).toEqual(['pompe', 'dev']);
    expect(filterFiches(L, { ...NO_FILTERS, gear: 'sans' }).map((f) => f.id)).toEqual(['pompe']);
    expect(filterFiches(L, { ...NO_FILTERS, gear: 'banc' }).map((f) => f.id)).toEqual(['dev']);
  });
  it('compte les filtres actifs', () => {
    expect(activeFilters(NO_FILTERS)).toBe(0);
    expect(activeFilters({ muscle: 'dos', level: 'tout', gear: 'barre' })).toBe(2);
  });
});
