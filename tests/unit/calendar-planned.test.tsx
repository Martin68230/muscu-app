// @vitest-environment jsdom
// Calendrier : séances PRÉVUES (jours du programme), puis faites / non faites. Ton neutre, aucune culpabilisation.
(globalThis as unknown as { process: { env: Record<string, string> } }).process.env.TZ = 'Europe/Paris';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { CalendarView } from '../../src/ui/screens/Calendar';
import { plannedDates, plannedMark, type HistoryEntry } from '../../src/session/calendar';

afterEach(cleanup);

const e = (id: string, dateKey: string, mark: HistoryEntry['mark'] = 'faite'): HistoryEntry => ({
  id, dateKey, atMs: Date.parse(`${dateKey}T10:00:00`), label: 'Corps entier', durationMin: 45, setsDone: 12, mark,
});

describe('jours planifiés', () => {
  it('lundi, mercredi, vendredi (0, 2, 4) du 5 au 18 octobre 2026', () => {
    expect(plannedDates([0, 2, 4], '2026-10-05', '2026-10-18')).toEqual(['2026-10-05', '2026-10-07', '2026-10-09', '2026-10-12', '2026-10-14', '2026-10-16']);
  });
  it('passage à l’heure d’hiver (25/10/2026) : aucun jour perdu ni doublé', () => {
    expect(plannedDates([0, 6], '2026-10-24', '2026-10-27')).toEqual(['2026-10-25', '2026-10-26']);
  });
  it('sans jours connus, ou fin avant le début : aucun jour', () => {
    expect(plannedDates([], '2026-10-05', '2026-10-18')).toEqual([]);
    expect(plannedDates([0], '2026-10-18', '2026-10-05')).toEqual([]);
  });
});

describe('marque d’un jour planifié', () => {
  const planned = new Set(plannedDates([0, 2, 4], '2026-10-05', '2026-10-25'));
  it('à venir ou aujourd’hui : prévue ; passé sans séance : non faite', () => {
    expect(plannedMark('2026-10-21', planned, [], '2026-10-20')).toBe('prevue');
    expect(plannedMark('2026-10-20', planned, [], '2026-10-20')).toBeNull(); // mardi : pas planifié
    expect(plannedMark('2026-10-19', planned, [], '2026-10-20')).toBe('non_faite');
  });
  it('jour avec une séance enregistrée : aucune marque planifiée', () => {
    expect(plannedMark('2026-10-19', planned, [e('a', '2026-10-19')], '2026-10-20')).toBeNull();
  });
  it('une séance faite un autre jour de la même semaine couvre le jour manqué (décalage, pas de « non faite »)', () => {
    const entries = [e('a', '2026-10-20')]; // mardi, jour non planifié
    expect(plannedMark('2026-10-19', planned, entries, '2026-10-22')).toBeNull();
    expect(plannedMark('2026-10-21', planned, entries, '2026-10-22')).toBe('non_faite'); // une séance ne couvre qu'un seul jour
  });
});

describe('écran Calendrier avec séances prévues', () => {
  const today = new Date(2026, 9, 22, 12);
  const view = (entries: HistoryEntry[]) =>
    render(<CalendarView entries={entries} today={today} daysPerWeek={3} startKey="2026-10-05" plannedWeekdays={[0, 2, 4]} programStartKey="2026-10-05" onOpen={vi.fn()} />);
  it('affiche prévue (○) et non faite (◌) avec un texte, et explique sans reproche', () => {
    view([e('a', '2026-10-05'), e('b', '2026-10-07')]);
    expect(screen.getByRole('button', { name: /vendredi 9 octobre.*non faite/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /lundi 26 octobre.*prévue/i })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /vendredi 9 octobre.*non faite/i }));
    expect(screen.getByText(/Pas de souci/)).toBeTruthy();
    expect(screen.queryByText(/raté|échec|retard|manqué/i)).toBeNull();
  });
});
