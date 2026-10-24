// @vitest-environment jsdom
// Lot A.3 : message « matériel changé » à l'accueil, fermable.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { HomeView } from '../../src/ui/screens/Home';
import type { Profile } from '../../src/data/model';

afterEach(cleanup);

const next = { dayIndex: 0, day: { label: 'Séance A', exercises: [], estimatedMin: 40 }, tooSoon: false, readyAt: null } as never;
const noop = vi.fn();
const view = (equipmentChangedId?: string) =>
  render(
    <HomeView profile={{ displayName: 'A' } as Profile} status={{ kind: 'seance', next, resume: null, equipmentChangedId }}
      onStart={noop} onEditStep={noop} onResume={noop} onOpenSession={noop} onCloseStale={noop} />,
  );

describe('accueil : matériel changé', () => {
  it('affiche le message puis le ferme ; rien sans changement', () => {
    view(undefined);
    expect(screen.queryByText(/Ton matériel a changé/)).toBeNull();
    cleanup();
    view('p2');
    expect(screen.getByText('Ton matériel a changé : ton programme a été mis à jour.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(screen.queryByText(/Ton matériel a changé/)).toBeNull();
    expect(localStorage.getItem('muscu.equipmentNoticeDismissed')).toBe('p2');
  });
});
