// @vitest-environment jsdom
// Idée 2 : écran « Créer une séance », mode « Je choisis mes exercices » (choix, séries à la baisse, superset, Faire maintenant, calendrier).
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/preact';
import type { CreatedSession } from '../../src/generator';
import { CreateSessionView } from '../../src/ui/screens/CreateSession';
import { doseFor, manualEnv, pairProblem } from '../../src/session/manual-session';
import { mk } from './generator-helpers';

afterEach(cleanup);

const NOW = new Date('2026-11-12T10:00:00.000Z');
const home = (level: 'debutant' | 'intermediaire' = 'intermediaire') => mk({ profile: 'A0', extraTags: ['elastique', 'chaise', 'halteres', 'barre_traction'], level });
const noop = async () => undefined;
const view = (o: Partial<Parameters<typeof CreateSessionView>[0]> = {}) =>
  render(<CreateSessionView input={home()} context={{}} now={() => NOW} onBack={() => undefined} onDoNow={noop} onSchedule={noop} {...o} />);

/** Une poussée et un tirage que les règles de superset acceptent pour ce profil. */
function pairNames(): [string, string] {
  const e = manualEnv(home(), { intensity: 'moderee', chairStable: false, todayIso: NOW.toISOString() });
  const push = e.options.filter((o) => o.schema === 'poussee_h');
  const pull = e.options.filter((o) => o.schema === 'tirage_h');
  for (const a of push) for (const b of pull) if (!pairProblem(doseFor(a, e), doseFor(b, e), e)) return [a.nom, b.nom];
  throw new Error('aucune paire');
}
const addByName = (name: string) => {
  fireEvent.input(screen.getByLabelText('Chercher un exercice'), { target: { value: name } });
  const list = screen.getByRole('list', { name: 'Exercices proposés' });
  const row = within(list).getAllByText(name)[0].closest('li')!;
  fireEvent.click(within(row).getByRole('button', { name: 'Ajouter' }));
};

describe('« Créer une séance » : mode Je choisis mes exercices', () => {
  it('ajout, séries à la baisse seulement, superset, Faire maintenant reçoit la séance avec la paire', async () => {
    const onDoNow = vi.fn(async (_s: CreatedSession) => undefined);
    view({ onDoNow });
    fireEvent.click(screen.getByRole('button', { name: 'Je choisis mes exercices' }));
    expect(screen.getByText('Aucun exercice choisi pour l’instant.')).toBeTruthy();
    const [a, b] = pairNames();
    addByName(a);
    addByName(b);
    const mine = screen.getByRole('region', { name: 'Ta séance' });
    // Séries : le + est désactivé à la dose proposée (jamais au-dessus), le − baisse.
    const plus = within(mine).getAllByRole('button', { name: 'Une série de plus' })[0] as HTMLButtonElement;
    expect(plus.disabled).toBe(true);
    fireEvent.click(within(mine).getAllByRole('button', { name: 'Une série de moins' })[0]);
    expect((within(mine).getAllByRole('button', { name: 'Une série de plus' })[0] as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(within(mine).getByRole('button', { name: 'Superset avec le suivant' }));
    expect(within(mine).getByRole('button', { name: 'Superset avec le suivant' }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Voir la séance' }));
    expect(screen.getByText(/superset avec le suivant/)).toBeTruthy();
    expect(screen.getByText(/ne remplace pas l’avis d’un professionnel/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Faire maintenant' }));
    await vi.waitFor(() => expect(onDoNow).toHaveBeenCalled());
    const s = onDoNow.mock.calls[0][0];
    expect(s.exercises).toHaveLength(2);
    expect(s.exercises[0].supersetGroup).toBeTruthy();
    expect(s.exercises[1].supersetGroup).toBe(s.exercises[0].supersetGroup);
  });

  it('débutant : aucun bouton de superset, la raison est affichée', () => {
    view({ input: home('debutant') });
    fireEvent.click(screen.getByRole('button', { name: 'Je choisis mes exercices' }));
    const list = screen.getByRole('list', { name: 'Exercices proposés' });
    const adds = within(list).getAllByRole('button', { name: 'Ajouter' });
    fireEvent.click(adds[0]);
    fireEvent.click(within(list).getAllByRole('button', { name: 'Ajouter' })[0]);
    expect(screen.queryByRole('button', { name: 'Superset avec le suivant' })).toBeNull();
    expect(screen.getByText(/Pas de superset au niveau débutant/)).toBeTruthy();
  });

  it('Ajouter au calendrier : la séance choisie est recomposée pour le jour choisi', async () => {
    const onSchedule = vi.fn(async (_s: CreatedSession, _r: unknown, _k: string) => undefined);
    view({ onSchedule });
    fireEvent.click(screen.getByRole('button', { name: 'Je choisis mes exercices' }));
    const [a] = pairNames();
    addByName(a);
    fireEvent.click(screen.getByRole('button', { name: 'Voir la séance' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter au calendrier' }));
    fireEvent.change(screen.getByLabelText('Quel jour ?'), { target: { value: '2026-11-14' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter ce jour' }));
    await vi.waitFor(() => expect(onSchedule).toHaveBeenCalled());
    const [s, , key] = onSchedule.mock.calls[0];
    expect(key).toBe('2026-11-14');
    expect(s.exercises).toHaveLength(1);
    expect(a.startsWith(s.exercises[0].nom)).toBe(true);
    expect(await screen.findByText(/séance ajoutée au calendrier/)).toBeTruthy();
  });

  it('Changer mes choix revient sur la liste avec les exercices gardés', () => {
    view();
    fireEvent.click(screen.getByRole('button', { name: 'Je choisis mes exercices' }));
    const [a] = pairNames();
    addByName(a);
    fireEvent.click(screen.getByRole('button', { name: 'Voir la séance' }));
    fireEvent.click(screen.getByRole('button', { name: 'Changer mes choix' }));
    const mine = screen.getByRole('region', { name: 'Ta séance' });
    expect(within(mine).getByText(new RegExp(a.replace(/[()]/g, '.')))).toBeTruthy();
  });
});
