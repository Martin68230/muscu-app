// @vitest-environment jsdom
// Lot A.2 : haltères en boutons rapides, champ « autre poids », pastilles retirables, rechargement.
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/preact';
import { addWeight, removeWeight } from '../../src/data/equipment-options';
import { ensureLocalUser } from '../../src/data/bootstrap';
import { list, update } from '../../src/data/repo';
import { Equipment } from '../../src/ui/screens/Equipment';

afterEach(cleanup);

describe('poids : fonctions', () => {
  it('ajoute avec virgule, garde 2,5 et 12,5, trie, ignore le texte invalide, retire', () => {
    let w = addWeight([], '12,5');
    w = addWeight(w, '2,5');
    w = addWeight(w, '2.5');
    w = addWeight(w, 'abc');
    expect(w).toEqual([2.5, 12.5]);
    expect(removeWeight(w, 2.5)).toEqual([12.5]);
  });
});

describe('écran Matériel : haltères', () => {
  it('plusieurs poids saisis, 2,5 et 12,5 conservés, retrait, rechargement', async () => {
    await ensureLocalUser();
    const eq = (await list('equipment'))[0];
    await update('equipment', eq.id, { tags: ['halteres'], dumbbellKind: 'reglables' });
    const view = render(<Equipment />);
    await screen.findByRole('group', { name: 'Poids rapides' });
    fireEvent.click(screen.getByRole('button', { name: '2,5' }));
    fireEvent.click(screen.getByRole('button', { name: '10' }));
    const input = screen.getByPlaceholderText(/Autre poids/) as HTMLInputElement;
    fireEvent.input(input, { target: { value: '12,5' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }));
    await waitFor(async () => expect((await list('equipment'))[0].dumbbellWeightsKg).toEqual([2.5, 10, 12.5]));
    fireEvent.click(await screen.findByRole('button', { name: 'Retirer 10 kg' }));
    await waitFor(async () => expect((await list('equipment'))[0].dumbbellWeightsKg).toEqual([2.5, 12.5]));
    view.unmount();
    render(<Equipment />);
    expect(await screen.findByRole('button', { name: 'Retirer 12,5 kg' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Retirer 2,5 kg' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Retirer 10 kg' })).toBeNull();
  });
});
