// @vitest-environment jsdom
// « Mon sport » : écrans (déclaration dans Profil, « Noter une séance de sport », calendrier). Règles : knowledge/saisie-sport-v1.md §1 et §7.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/preact';
import { useState } from 'preact/hooks';
import type { SportPlanEntry, SportSession } from '../../src/data/model';
import { NoteSportView, SportPlanEditor, planLine } from '../../src/ui/screens/MySport';
import { CalendarView, monthLine } from '../../src/ui/screens/Calendar';
import type { SportDraft } from '../../src/sport/sport-store';

afterEach(cleanup);

const NOW = new Date(2026, 10, 12, 12, 0, 0);
const plan: SportPlanEntry[] = [{ sport: 'volley', perWeek: 2, weekdays: [1, 3], matchWeekday: 5 }];
const noop = async () => undefined;

function view(o: Partial<Parameters<typeof NoteSportView>[0]> = {}) {
  const onSave = vi.fn(async (_d: SportDraft) => ['Séance de sport enregistrée.']);
  render(<NoteSportView plan={plan} pregnancy={null} sessions={[]} now={() => NOW} onSave={onSave} onRemove={noop} onBack={() => undefined} {...o} />);
  return onSave;
}

describe('Noter une séance de sport', () => {
  it('3 niveaux d\'intensité avec le test de la parole, aucun préchoisi, enregistrement impossible sans choix', () => {
    view();
    for (const n of ['Facile', 'Soutenue', 'Très dur']) expect(screen.getByRole('button', { name: n }).getAttribute('aria-pressed')).toBe('false');
    expect(screen.getByText(/phrases entières/)).toBeTruthy();
    expect(screen.getByText(/phrases courtes/)).toBeTruthy();
    expect(screen.getByText(/quelques mots/)).toBeTruthy();
    const save = screen.getByRole('button', { name: 'Enregistrer cette séance' }) as HTMLButtonElement;
    expect(save.disabled).toBe(true);
    expect(screen.getByText(/Choisis une intensité/)).toBeTruthy();
  });
  it('enregistre la saisie, puis affiche les messages', async () => {
    const onSave = view();
    fireEvent.click(screen.getByRole('button', { name: 'Soutenue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Jambes lourdes' }));
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer cette séance' }));
    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    const d = onSave.mock.calls[0][0];
    expect(d).toMatchObject({ sport: 'volley', effort: 'soutenue', durationMin: 60, feelings: ['jambes_lourdes'], day: '2026-11-12' });
    await waitFor(() => expect(screen.getByText('Séance de sport enregistrée.')).toBeTruthy());
  });
  it('« match » choisit « très dur » ; la date ne peut pas être dans le futur ; la saisie fait au moins 16 px (type number / date)', () => {
    view();
    fireEvent.click(screen.getByLabelText('C’était un match ou une compétition'));
    expect(screen.getByRole('button', { name: 'Très dur' }).getAttribute('aria-pressed')).toBe('true');
    expect((document.getElementById('sp-day') as HTMLInputElement).max).toBe('2026-11-12');
  });
  it('gêne : zone, signes d\'alerte et message ; malaise : message d\'arrêt', () => {
    view();
    fireEvent.click(screen.getByRole('button', { name: 'Une gêne ou une douleur' }));
    expect(screen.getByRole('button', { name: 'Épaule' })).toBeTruthy();
    expect(screen.getByLabelText('Un gonflement')).toBeTruthy();
    expect(screen.getByText(/pas de progression sur cette zone/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Un malaise ou un vertige' }));
    expect(screen.getByRole('alert').textContent).toMatch(/Arrête et parles-en à un professionnel de santé/);
  });
  it('grossesse : on peut noter, formulation « enregistrée, pas recommandée » et signes d\'arrêt dès l\'écran', () => {
    view({ pregnancy: 'enceinte' });
    expect(screen.getByText(/enregistrée, pas recommandée/)).toBeTruthy();
    expect(screen.getByText(/saignement/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Enregistrer cette séance' })).toBeTruthy();
  });
  it('sans sport déclaré : renvoie vers Mon sport', () => {
    const onEditPlan = vi.fn();
    view({ plan: [], onEditPlan });
    fireEvent.click(screen.getByRole('button', { name: 'Mon sport' }));
    expect(onEditPlan).toHaveBeenCalled();
  });
  it('sport « autre » : les cases sauts et bras levés sont proposées', () => {
    view({ plan: [{ sport: 'autre', name: 'Escalade' }] });
    expect(screen.getByLabelText('Il y a des sauts')).toBeTruthy();
    expect(screen.getByLabelText('Les bras passent souvent au-dessus de la tête')).toBeTruthy();
  });
  it('l\'historique liste les séances et permet de supprimer', async () => {
    const s: SportSession = {
      id: 'a', ownerId: 'u', createdAt: '', updatedAt: '', rev: 1, deletedAt: null, syncedAt: null, sport: 'foot', startedAt: new Date(2026, 10, 10, 18).toISOString(),
      durationMin: 70, effort: 'tres_dur', feelings: [],
    };
    const onRemove = vi.fn(noop);
    view({ sessions: [s], onRemove });
    expect(screen.getByText(/70 min/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }));
    await waitFor(() => expect(onRemove).toHaveBeenCalledWith('a'));
  });
});

describe('Mon sport (déclaration)', () => {
  function Host({ onPlan }: { onPlan?: (p: SportPlanEntry[]) => void }) {
    const [p, setP] = useState<SportPlanEntry[]>([]);
    return <SportPlanEditor plan={p} onChange={(n) => { setP(n); onPlan?.(n); }} />;
  }
  it('liste fermée de 7 sports, 3 au plus, nom libre de 40 caractères pour « autre »', () => {
    render(<Host />);
    for (const n of ['Foot', 'Danse', 'Volley', 'Raquette', 'Basket', 'Hand', 'Autre sport']) expect(screen.getByRole('button', { name: n })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Foot' }));
    fireEvent.click(screen.getByRole('button', { name: 'Danse' }));
    fireEvent.click(screen.getByRole('button', { name: 'Autre sport' }));
    expect((screen.getByRole('button', { name: 'Hand' }) as HTMLButtonElement).disabled).toBe(true);
    const name = document.getElementById('sp-name-2') as HTMLInputElement;
    expect(name.maxLength).toBe(40);
    expect(screen.getByText(/Je ne connais pas ce sport/)).toBeTruthy();
  });
  it('fréquence, jours habituels et jour de match', () => {
    const seen: SportPlanEntry[][] = [];
    render(<Host onPlan={(p) => seen.push(p)} />);
    fireEvent.click(screen.getByRole('button', { name: 'Volley' }));
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    const days = screen.getAllByRole('button', { name: 'mardi' });
    fireEvent.click(days[0]);
    fireEvent.click(days[1]);
    const last = seen[seen.length - 1][0];
    expect(last).toMatchObject({ sport: 'volley', perWeek: 3, weekdays: [1], matchWeekday: 1 });
    expect(planLine(last)).toBe('Volley · 3 par semaine · mardi · match mardi');
  });
});

describe('Calendrier : « Sport » à part', () => {
  const s: SportSession = {
    id: 'a', ownerId: 'u', createdAt: '', updatedAt: '', rev: 1, deletedAt: null, syncedAt: null, sport: 'hand', startedAt: new Date(2026, 10, 9, 19).toISOString(),
    durationMin: 90, effort: 'soutenue', feelings: [],
  };
  it('affiche la séance sans toucher au résumé de musculation', () => {
    render(<CalendarView entries={[]} today={NOW} daysPerWeek={3} startKey="2026-11-01" sportSessions={[s]} onNoteSport={() => undefined} onOpen={() => undefined} />);
    expect(screen.getByRole('region', { name: 'Sport' })).toBeTruthy();
    expect(screen.getByText(/Hand · 90 min · soutenue/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Noter une séance de sport' })).toBeTruthy();
    expect(screen.getByRole('status').textContent).toBe(monthLine(0, null));
  });
});
