// @vitest-environment jsdom
// Lieu de chaque jour : sélecteur à 7 jours, raccourcis, retour à un seul lieu, matériel de la salle décochable, migration (profil sans lieu par jour).
import { useState } from 'preact/hooks';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/preact';
import { ensureLocalUser } from '../../src/data/bootstrap';
import type { Profile } from '../../src/data/model';
import { list, update } from '../../src/data/repo';
import { validateRow } from '../../src/data/validate';
import { DayPlacesCard, dayPlacesSummary } from '../../src/ui/screens/DayPlaces';
import { Equipment } from '../../src/ui/screens/Equipment';

afterEach(cleanup);

function Host({ initial }: { initial: Profile }) {
  const [p, setP] = useState(initial);
  return <DayPlacesCard profile={p} onChange={setP} />;
}

describe('écran Lieu de chaque jour', () => {
  it('profil existant : « lieu unique » ; choisir un lieu par jour, raccourci, un jour en repos, retour à un seul lieu', async () => {
    await ensureLocalUser();
    const prof = (await list('profile'))[0];
    expect(prof.dayPlaces).toBeUndefined(); // migration : aucun champ, comportement inchangé
    render(<Host initial={prof} />);
    expect(screen.getByText(/Lieu unique/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Choisir un lieu par jour' }));
    await waitFor(async () => expect((await list('profile'))[0].dayPlaces).toHaveLength(7));
    // 7 lignes, chaque jour avec les quatre choix.
    for (const j of ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']) {
      const g = await screen.findByRole('group', { name: `Lieu du ${j}` });
      expect(g.querySelectorAll('button')).toHaveLength(4);
    }
    fireEvent.click(screen.getByRole('button', { name: 'Salle lun / mer / ven, maison le reste' }));
    await waitFor(async () => expect((await list('profile'))[0].dayPlaces).toEqual(['salle', 'maison', 'salle', 'maison', 'salle', 'maison', 'maison']));
    expect((await list('profile'))[0].place).toBe('maison'); // lieu dominant : maison (4 jours contre 3)
    const mardi = screen.getByRole('group', { name: 'Lieu du mardi' });
    fireEvent.click(Array.from(mardi.querySelectorAll('button')).find((b) => b.textContent === 'Repos')!);
    await waitFor(async () => expect((await list('profile'))[0].dayPlaces![1]).toBe('repos'));
    fireEvent.click(screen.getByRole('button', { name: 'Tous en salle' }));
    await waitFor(async () => expect((await list('profile'))[0].place).toBe('salle'));
    fireEvent.click(screen.getByRole('button', { name: 'Revenir à un seul lieu' }));
    await waitFor(async () => expect((await list('profile'))[0].dayPlaces).toEqual([]));
    expect(await screen.findByText(/Lieu unique/)).toBeTruthy();
  });
  it('résumé lisible et validation d\'import (valeur inconnue refusée)', async () => {
    await ensureLocalUser();
    expect(dayPlacesSummary(['salle', 'maison', 'salle', 'maison', 'salle', 'repos', 'repos'], 'maison')).toBe('Salle : lun, mer, ven · Maison : mar, jeu · Repos : sam, dim');
    const prof = (await list('profile'))[0];
    expect(validateRow('profile', { ...prof, dayPlaces: ['salle', 'maison', 'salle', 'maison', 'salle', 'repos', 'repos'] })).toEqual([]);
    expect(validateRow('profile', { ...prof, dayPlaces: [] })).toEqual([]);
    expect(validateRow('profile', { ...prof, dayPlaces: ['plage', 'maison', 'salle', 'maison', 'salle', 'repos', 'repos'] })).not.toEqual([]);
    expect(validateRow('profile', { ...prof, dayPlaces: ['salle'] })).not.toEqual([]);
  });
  it('matériel de la salle : tout coché par défaut, décocher une machine l\'enregistre', async () => {
    await ensureLocalUser();
    render(<Equipment />);
    const boxes = (await screen.findAllByRole('group', { name: 'Matériel de la salle' }))[0].querySelectorAll('input[type=checkbox]');
    expect(boxes.length).toBeGreaterThanOrEqual(8);
    expect(Array.from(boxes).every((b) => (b as HTMLInputElement).checked)).toBe(true);
    fireEvent.click(boxes[0]);
    await waitFor(async () => expect((await list('equipment'))[0].gymOff).toEqual(['machine']));
    fireEvent.click(boxes[0]);
    await waitFor(async () => expect((await list('equipment'))[0].gymOff).toEqual([]));
    await update('equipment', (await list('equipment'))[0].id, { gymOff: ['poulie'] });
  });
});
