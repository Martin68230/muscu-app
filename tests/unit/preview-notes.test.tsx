// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/preact';
import type { MissedCard } from '../../src/session/missed';
import type { Program } from '../../src/data/model';
import type { NextSession } from '../../src/session/program';
import { JumpPlayNotes, OutdoorPlayNotes } from '../../src/ui/session/CardioNotes';
import { PreviewView } from '../../src/ui/screens/Preview';
import { MISSED_TEXT } from '../../src/session/missed-texts';
import { D30_TEXT } from '../../src/session/messages';
import { day, ex } from './session-helpers';

afterEach(cleanup);
const jumpEx = { ...ex({ variantId: 'a' }), jump: { soft: false, softVariantId: 's', softNom: 'Doux', contacts: 10 } };
const d = day([jumpEx, { ...ex({ variantId: 'b', role: 'cardio', unit: 'sec' }), outdoor: true }]);
const program = { days: [d], explanation: [], messages: [{ id: 'V-MSG-ZONE', text: 'Message général de zone.' }] } as unknown as Program;
const next = { dayIndex: 0, day: d, tooSoon: false, availableAtMs: null, scheduledToday: true } as NextSession;

const card = (jours: string[]): MissedCard => ({ day: '2026-11-10', dayIndex: 0, nom: 'Séance A', jour: 'mardi', jours });
const open = (c: Element) => Array.from(c.querySelectorAll('details.precautions')).map((x) => (x as HTMLDetailsElement).open);

describe('aperçu : précautions en volets fermés', () => {
  it('volets « Précautions » fermés par défaut, consigne d’arrêt des sauts visible, message général non replié', () => {
    const { container } = render(<PreviewView program={program} next={next} fiches={[]} onBegin={() => undefined} />);
    const states = open(container);
    expect(states.length).toBe(3); // sauts + dehors + « À savoir (1) »
    expect(states.every((o) => o === false)).toBe(true);
    expect(screen.getByText('Précautions avant les sauts').tagName).toBe('SUMMARY');
    expect(screen.getByText(D30_TEXT.jumpStop).closest('details')).toBeNull();
    expect(screen.getByText('À savoir (1)').tagName).toBe('SUMMARY');
    expect(screen.getByText('Message général de zone.').closest('details')).not.toBeNull(); // message général replié (décision du 12/11/2026)
  });
  it('T-11 visible quand « Décaler » est impossible, absent sinon', () => {
    render(<PreviewView program={program} next={next} fiches={[]} onBegin={() => undefined} noPostpone />);
    expect(screen.getByText(MISSED_TEXT.T11)).toBeTruthy();
    cleanup();
    render(<PreviewView program={program} next={next} fiches={[]} onBegin={() => undefined} />);
    expect(screen.queryByText(MISSED_TEXT.T11)).toBeNull();
  });
  it('« Décaler » présent seulement avec un jour libre (même carte que l’Accueil), absent sinon', async () => {
    const run = vi.fn().mockResolvedValue(undefined);
    render(<PreviewView program={program} next={next} fiches={[]} onBegin={() => undefined} postpone={{ card: card(['2026-11-13', '2026-11-14']), run }} />);
    fireEvent.click(screen.getByRole('button', { name: MISSED_TEXT.T3 }));
    expect(screen.getAllByRole('button').filter((b) => /vendredi|samedi/i.test(b.textContent ?? '')).length).toBe(2);
    fireEvent.click(screen.getAllByRole('button').find((b) => /vendredi/i.test(b.textContent ?? ''))!);
    await waitFor(() => expect(run).toHaveBeenCalledWith('2026-11-13'));
    cleanup();
    render(<PreviewView program={program} next={next} fiches={[]} onBegin={() => undefined} postpone={{ card: card([]), run }} noPostpone />);
    expect(screen.queryByRole('button', { name: MISSED_TEXT.T3 })).toBeNull();
    expect(screen.getByText(MISSED_TEXT.T11)).toBeTruthy();
    cleanup();
    render(<PreviewView program={program} next={next} fiches={[]} onBegin={() => undefined} />);
    expect(screen.queryByRole('button', { name: MISSED_TEXT.T3 })).toBeNull();
  });
  it('lecteur : arrêt des sauts visible hors volet, précautions de la sortie repliées', () => {
    const { container } = render(<><JumpPlayNotes ex={jumpEx} /><OutdoorPlayNotes ex={{ ...ex({ variantId: 'b' }), outdoor: true }} /></>);
    expect(screen.getByText(D30_TEXT.jumpStop).closest('details')).toBeNull();
    expect(open(container)).toEqual([false]);
    expect(screen.getByText(D30_TEXT.T9short).closest('details')).not.toBeNull();
  });
});
