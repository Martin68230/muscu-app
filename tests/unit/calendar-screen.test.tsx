// @vitest-environment jsdom
// F7 : écrans Calendrier (mois navigable, marques en texte, détail, historique) et carte Régularité de l'Accueil.
(globalThis as unknown as { process: { env: Record<string, string> } }).process.env.TZ = 'Europe/Paris';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { CalendarView, monthLine, entryDetail } from '../../src/ui/screens/Calendar';
import { HomeView, RegularityCard } from '../../src/ui/screens/Home';
import type { HistoryEntry } from '../../src/session/calendar';
import { regularity } from '../../src/session/calendar';
import type { Profile } from '../../src/data/model';

afterEach(cleanup);

const today = new Date(2026, 9, 28, 12);
const e = (id: string, dateKey: string, o: Partial<HistoryEntry> = {}): HistoryEntry => ({
  id, dateKey, atMs: Date.parse(`${dateKey}T10:00:00`), label: 'Haut du corps', durationMin: 45, setsDone: 18, mark: 'faite', ...o,
});
const entries = [
  e('a', '2026-10-27'),
  e('b', '2026-10-20', { mark: 'douleur' }),
  e('c', '2026-10-13', { mark: 'arretee', durationMin: null, setsDone: 0 }),
  e('d', '2026-10-06', { mark: 'reportee', durationMin: null, setsDone: 0 }),
  e('f', '2026-09-29', { mark: 'symptome', durationMin: null, setsDone: 0 }),
];
const view = (list: HistoryEntry[], onOpen = vi.fn()) =>
  render(<CalendarView entries={list} today={today} daysPerWeek={3} startKey="2026-10-01" onOpen={onOpen} />);

describe('calendrier', () => {
  it('état vide sobre, sans pourcentage', () => {
    view([]);
    expect(screen.getByText(/Tes séances apparaîtront ici/)).toBeTruthy();
    expect(screen.getByText('Pas encore de séance ce mois-ci.')).toBeTruthy();
    expect(screen.queryByText(/%/)).toBeNull();
  });
  it('marques en texte (nom accessible), aujourd’hui repéré, synthèse du mois', () => {
    view(entries);
    expect(screen.getByRole('button', { name: /mardi 27 octobre : séance faite/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /mardi 20 octobre : séance faite, avec une douleur/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /mardi 13 octobre : séance arrêtée/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /mardi 6 octobre : séance reportée/ })).toBeTruthy();
    expect(screen.getByRole('img', { name: /mercredi 28 octobre, aujourd’hui/ })).toBeTruthy();
    expect(screen.getByText('2 séances faites sur environ 12 prévues (estimation).')).toBeTruthy();
  });
  it('appui sur un jour : détail et lien « Voir le bilan »', () => {
    const onOpen = vi.fn();
    view(entries, onOpen);
    fireEvent.click(screen.getByRole('button', { name: /^mardi 27 octobre : séance/ }));
    const region = screen.getByRole('region', { name: /Séances du mardi 27 octobre/ });
    expect(region.textContent).toContain('45 min');
    expect(region.textContent).toContain('18 séries faites');
    fireEvent.click(screen.getByRole('button', { name: 'Voir le bilan' }));
    expect(onOpen).toHaveBeenCalledWith('a');
  });
  it('mois précédent / suivant ; « suivant » désactivé sur le mois en cours', () => {
    view(entries);
    const next = screen.getByRole('button', { name: 'Mois suivant' }) as HTMLButtonElement;
    expect(next.disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Mois précédent' }));
    expect(screen.getByRole('heading', { name: 'septembre 2026' })).toBeTruthy();
    expect(screen.getByRole('button', { name: /mardi 29 septembre : séance arrêtée, symptôme/ })).toBeTruthy();
    expect(screen.getByText('Pas encore de séance ce mois-ci.')).toBeTruthy();
    expect((screen.getByRole('button', { name: 'Mois suivant' }) as HTMLButtonElement).disabled).toBe(false);
  });
  it('historique : plus récent d’abord, aucun chiffre pour une séance arrêtée, pagination', () => {
    view(entries);
    const rows = screen.getAllByRole('listitem').filter((li) => li.querySelector('.hist-row'));
    expect(rows[0].textContent).toContain('mardi 27 octobre');
    expect(rows[2].textContent).toContain('Arrêtée');
    expect(rows[2].textContent).not.toMatch(/min|série/);
    cleanup();
    const many = Array.from({ length: 12 }, (_, i) => e(`m${i}`, `2026-10-${String(i + 1).padStart(2, '0')}`));
    view(many);
    expect(document.querySelectorAll('.hist-row').length).toBe(10);
    fireEvent.click(screen.getByRole('button', { name: 'Afficher plus' }));
    expect(document.querySelectorAll('.hist-row').length).toBe(12);
  });
  it('formules', () => {
    expect(monthLine(1, 1)).toBe('1 séance faite sur environ 1 prévue (estimation).');
    expect(monthLine(3, null)).toBe('3 séances faites ce mois-ci.');
    expect(entryDetail(e('x', '2026-10-01', { setsDone: 1 }))).toBe('Haut du corps · 45 min · 1 série faite');
  });
});

describe('accueil : régularité', () => {
  const noop = vi.fn();
  const home = (reg: ReturnType<typeof regularity> | null, onOpenHistory = noop) =>
    render(
      <HomeView profile={{ displayName: 'A', daysPerWeek: 3 } as Profile} status={{ kind: 'profil' }} onStart={noop} onEditStep={noop}
        onResume={noop} onOpenSession={noop} onCloseStale={noop} regularity={reg} today={today} onOpenHistory={onOpenHistory} />,
    );
  it('sans séance : message d’accueil, aucun chiffre', () => {
    home(regularity([], today, 3));
    expect(screen.getByText(/Ta première séance lancera le suivi/)).toBeTruthy();
    expect(document.querySelector('.regularity')!.textContent).not.toMatch(/\d/);
    expect(screen.queryByRole('button', { name: 'Voir mon historique' })).toBeNull();
  });
  it('avec séances : semaine, semaines de suite, dernière séance, lien vers l’historique', () => {
    const onOpenHistory = vi.fn();
    home(regularity(entries, today, 3), onOpenHistory);
    const t = document.querySelector('.regularity')!.textContent!;
    expect(t).toContain('Cette semaine : 1 séance faite sur 3 prévues.');
    expect(t).toContain('2 semaines de suite');
    expect(t).toContain('Dernière séance : hier.');
    fireEvent.click(screen.getByRole('button', { name: 'Voir mon historique' }));
    expect(onOpenHistory).toHaveBeenCalled();
  });
  it('ton neutre : semaine vide et série à zéro, sans reproche', () => {
    const reg = { hasAny: true, doneThisWeek: 0, plannedPerWeek: 3, streakWeeks: 0, lastKey: '2026-10-01' };
    render(<RegularityCard reg={reg} today={today} />);
    const t = document.querySelector('.regularity')!.textContent!;
    expect(t).toContain('la semaine est devant toi');
    expect(t).toContain('commence quand tu veux');
    expect(t).not.toMatch(/raté|manqu|retard|perdu|cass/i);
  });
});
