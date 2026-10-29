// @vitest-environment jsdom
// Séance manquée, étape 3 : carte de l'Accueil, choix du jour, confirmations, aperçu, calendrier (seance-manquee-v1.md SM-3, SM-4, SM-6, §7, E1, E2, E8, E9).
(globalThis as unknown as { process: { env: Record<string, string> } }).process.env.TZ = 'Europe/Paris';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/preact';
import { MissedCardView, PreviewSkipLinks } from '../../src/ui/MissedCard';
import { HomeView } from '../../src/ui/screens/Home';
import { CalendarView } from '../../src/ui/screens/Calendar';
import { MISSED_TEXT } from '../../src/session/missed-texts';
import type { Profile } from '../../src/data/model';
import type { HistoryEntry } from '../../src/session/calendar';

afterEach(cleanup);

const card = (jours: string[]) => ({ day: '2026-11-02', dayIndex: 0, nom: 'A', jour: 'lundi', jours });
const actions = () => ({ postpone: vi.fn(async () => {}), later: vi.fn(async () => {}), skip: vi.fn(async () => {}), unwell: vi.fn(async () => {}) });
const buttons = () => screen.getAllByRole('button').map((b) => b.textContent);

describe('carte « séance manquée »', () => {
  it('E1 : titre T-1, sous-titre T-2, « Décaler » en premier et bouton principal, puis T-4, T-5, lien T-18', () => {
    render(<MissedCardView card={card(['2026-11-03'])} actions={actions()} twoDays onDone={vi.fn()} />);
    expect(screen.getByRole('heading', { name: "Ta séance de lundi n'a pas eu lieu." })).toBeTruthy();
    expect(screen.getByText(MISSED_TEXT.T2)).toBeTruthy();
    expect(buttons()).toEqual([MISSED_TEXT.T3, MISSED_TEXT.T4, MISSED_TEXT.T5, MISSED_TEXT.T18_LINK]);
    expect(screen.getByRole('button', { name: MISSED_TEXT.T3 }).className).toContain('btn-primary');
    expect(screen.getByRole('button', { name: MISSED_TEXT.T4 }).className).not.toContain('btn-primary');
    expect(screen.queryByText(MISSED_TEXT.T11)).toBeNull();
    expect(screen.queryByRole('button', { name: /fermer|×/i })).toBeNull(); // aucun bouton de fermeture
  });

  it('E2 : aucun jour : 2 boutons, « La faire quand je peux » principal, T-11', () => {
    render(<MissedCardView card={card([])} actions={actions()} twoDays onDone={vi.fn()} />);
    expect(buttons()).toEqual([MISSED_TEXT.T4, MISSED_TEXT.T5, MISSED_TEXT.T18_LINK]);
    expect(screen.getByRole('button', { name: MISSED_TEXT.T4 }).className).toContain('btn-primary');
    expect(screen.getByText(MISSED_TEXT.T11)).toBeTruthy();
  });

  it('choix du jour (T-6) puis confirmation T-7', async () => {
    const a = actions();
    const done = vi.fn();
    render(<MissedCardView card={card(['2026-11-03', '2026-11-04'])} actions={a} twoDays onDone={done} />);
    fireEvent.click(screen.getByRole('button', { name: MISSED_TEXT.T3 }));
    expect(screen.getByRole('heading', { name: MISSED_TEXT.T6_TITLE })).toBeTruthy();
    expect(buttons()).toEqual(['Mardi', 'Mercredi', MISSED_TEXT.T6_BACK]);
    fireEvent.click(screen.getByRole('button', { name: 'Mardi' }));
    await waitFor(() => expect(done).toHaveBeenCalledWith(["C'est noté : « A » est décalée à mardi. Elle est dans ton calendrier."]));
    expect(a.postpone).toHaveBeenCalledWith('2026-11-03');
  });

  it('« Retour » depuis la liste des jours : rien n’est écrit', () => {
    const a = actions();
    render(<MissedCardView card={card(['2026-11-03'])} actions={a} twoDays onDone={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: MISSED_TEXT.T3 }));
    fireEvent.click(screen.getByRole('button', { name: MISSED_TEXT.T6_BACK }));
    expect(screen.getByRole('button', { name: MISSED_TEXT.T3 })).toBeTruthy();
    expect(a.postpone).not.toHaveBeenCalled();
  });

  it('« La faire quand je peux » : T-8', async () => {
    const a = actions();
    const done = vi.fn();
    render(<MissedCardView card={card([])} actions={a} twoDays={false} onDone={done} />);
    fireEvent.click(screen.getByRole('button', { name: MISSED_TEXT.T4 }));
    await waitFor(() => expect(done).toHaveBeenCalledWith([MISSED_TEXT.T8]));
    expect(a.later).toHaveBeenCalledTimes(1);
  });

  it('E8 : « Sauter » puis « Non, retour » : rien n’est enregistré, retour à la carte', () => {
    const a = actions();
    const done = vi.fn();
    render(<MissedCardView card={card(['2026-11-03'])} actions={a} twoDays onDone={done} />);
    fireEvent.click(screen.getByRole('button', { name: MISSED_TEXT.T5 }));
    expect(screen.getByText('Sauter « A » ? Tu passeras directement à la suivante.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: MISSED_TEXT.T9_NO }));
    expect(a.skip).not.toHaveBeenCalled();
    expect(done).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: MISSED_TEXT.T3 })).toBeTruthy();
  });

  it('E9 : « Oui, la sauter » : T-10 puis T-12 (programme de 2 jours) ; T-10 seul avec 3 jours', async () => {
    const a = actions();
    const done = vi.fn();
    render(<MissedCardView card={card([])} actions={a} twoDays onDone={done} />);
    fireEvent.click(screen.getByRole('button', { name: MISSED_TEXT.T5 }));
    fireEvent.click(screen.getByRole('button', { name: MISSED_TEXT.T9_YES }));
    await waitFor(() => expect(done).toHaveBeenCalledWith([MISSED_TEXT.T10, MISSED_TEXT.T12]));
    cleanup();
    const done3 = vi.fn();
    render(<MissedCardView card={card([])} actions={actions()} twoDays={false} onDone={done3} />);
    fireEvent.click(screen.getByRole('button', { name: MISSED_TEXT.T5 }));
    fireEvent.click(screen.getByRole('button', { name: MISSED_TEXT.T9_YES }));
    await waitFor(() => expect(done3).toHaveBeenCalledWith([MISSED_TEXT.T10]));
  });

  it('« Je ne me sens pas bien » : confirmation T-21, puis T-18', async () => {
    const a = actions();
    const done = vi.fn();
    render(<MissedCardView card={card([])} actions={a} twoDays onDone={done} />);
    fireEvent.click(screen.getByRole('button', { name: MISSED_TEXT.T18_LINK }));
    expect(screen.getByText(MISSED_TEXT.T21)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: MISSED_TEXT.T21_YES }));
    await waitFor(() => expect(done).toHaveBeenCalledWith([MISSED_TEXT.T18_AFTER]));
    expect(a.unwell).toHaveBeenCalledTimes(1);
  });
});

describe('aperçu de séance : liens « Sauter » et « Je ne me sens pas bien » (SM-6)', () => {
  it('mêmes confirmations, sans bouton « Décaler »', async () => {
    const onSkip = vi.fn(async () => {});
    const done = vi.fn();
    render(<PreviewSkipLinks nom="B" twoDays={false} onSkip={onSkip} onUnwell={vi.fn(async () => {})} onDone={done} />);
    expect(buttons()).toEqual([MISSED_TEXT.T5, MISSED_TEXT.T18_LINK]);
    fireEvent.click(screen.getByRole('button', { name: MISSED_TEXT.T5 }));
    fireEvent.click(screen.getByRole('button', { name: MISSED_TEXT.T9_YES }));
    await waitFor(() => expect(done).toHaveBeenCalledWith([MISSED_TEXT.T10]));
    expect(onSkip).toHaveBeenCalledTimes(1);
  });
});

describe('Accueil : un seul message, dans l’ordre de SM-3', () => {
  const next = { dayIndex: 0, day: { label: 'Séance A', exercises: [], estimatedMin: 40 }, tooSoon: true, availableAtMs: null, scheduledToday: false } as never;
  const noop = vi.fn();
  const profile = { displayName: 'A', profileCompletedAt: 'x', daysPerWeek: 3, level: 'debutant', blockedWeekdays: [] } as unknown as Profile;
  const view = (extra: Record<string, unknown>) =>
    render(
      <HomeView profile={profile} status={{ kind: 'seance', next, resume: null, equipmentChangedId: 'p', ...extra } as never}
        onStart={noop} onEditStep={noop} onResume={noop} onOpenSession={noop} onCloseStale={noop} missedActions={actions()} onAckSecurity={vi.fn(async () => {})} />,
    );

  it('carte à la place du bandeau « Séance du jour », sans autre message ni bouton « Voir la séance »', () => {
    view({ missed: card(['2026-11-03']) });
    expect(screen.getByRole('heading', { name: "Ta séance de lundi n'a pas eu lieu." })).toBeTruthy();
    expect(screen.queryByText('Séance du jour')).toBeNull();
    expect(screen.queryByText(/Ton matériel a changé/)).toBeNull();
    expect(screen.queryByText(/moins de 48 h/)).toBeNull();
    expect(screen.queryByRole('button', { name: 'Voir la séance' })).toBeNull();
  });

  it('sécurité à lire : message R5/U1 et bouton T-22, ni carte ni bandeau ; la séance reste accessible (aucun verrou)', () => {
    view({ missed: card(['2026-11-03']), security: true });
    expect(screen.getByText(/Ne reprends pas avant l’avis d’un professionnel de santé/)).toBeTruthy();
    expect(screen.getByRole('button', { name: MISSED_TEXT.T22 })).toBeTruthy();
    expect(screen.queryByText("Ta séance de lundi n'a pas eu lieu.")).toBeNull();
    expect(screen.queryByText('Séance du jour')).toBeNull();
    expect(screen.getByRole('button', { name: 'Voir la séance' }).className).not.toContain('btn-primary');
  });

  it('« consulte » (S1) passe avant la carte', () => {
    view({ missed: card([]), consulte: true });
    expect(screen.getByText(/Consulte un professionnel de santé/)).toBeTruthy();
    expect(screen.queryByText("Ta séance de lundi n'a pas eu lieu.")).toBeNull();
  });
});

describe('calendrier : « Sautée » distincte de « Arrêtée », jours décalés', () => {
  const e = (id: string, dateKey: string, mark: HistoryEntry['mark']): HistoryEntry => ({ id, dateKey, atMs: Date.parse(`${dateKey}T10:00:00`), label: 'A', durationMin: null, setsDone: 0, mark });
  it('» Sautée, ↷ Reportée, ○ jour décalé ; jamais « pas bien » ; aucun « Voir le bilan » pour une séance sautée', () => {
    render(
      <CalendarView entries={[e('a', '2026-10-19', 'sautee_choix'), e('b', '2026-10-21', 'reportee'), e('c', '2026-10-23', 'arretee')]}
        today={new Date(2026, 9, 22, 12)} daysPerWeek={3} startKey="2026-10-01" plannedWeekdays={[0, 2, 4]} programStartKey="2026-10-01"
        shiftedKeys={['2026-10-22']} onOpen={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: /lundi 19 octobre.*séance sautée/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /mercredi 21 octobre.*séance reportée/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /vendredi 23 octobre.*séance arrêtée/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /jeudi 22 octobre.*séance prévue/i })).toBeTruthy();
    expect(screen.getByText('Sautée', { selector: 'li' , exact: false })).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/pas bien/i);
    fireEvent.click(screen.getByRole('button', { name: /lundi 19 octobre : séance sautée/i }));
    expect(screen.queryByRole('button', { name: 'Voir le bilan' })).toBeNull();
  });
});
