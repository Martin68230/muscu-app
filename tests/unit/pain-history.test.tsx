// @vitest-environment jsdom
// Évolution de la douleur par exercice (knowledge/adaptation-regles.md §5.1) : logique pure et carte.
(globalThis as unknown as { process: { env: Record<string, string> } }).process.env.TZ = 'Europe/Paris';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import type { SetLog, WorkoutSession } from '../../src/data/model';
import {
  exercisesWithPain, PAIN_2_OF_3_TEXT, PAIN_PAST_TEXT, PAIN_ALERT_TEXT, PAIN_NOT_MEDICAL_TEXT, PAIN_RECURS_TEXT, PAIN_TREND_TEXT, painFreeSinceText, painHistory, painRowText,
} from '../../src/session/pain-history';
import { PAIN_S1_TEXT } from '../../src/session/messages';
import { PainHistoryCard } from '../../src/ui/PainHistoryCard';
import { PainSection } from '../../src/ui/screens/Progress';

afterEach(cleanup);

const sess = (id: string, day: number, o: Partial<WorkoutSession> = {}): WorkoutSession =>
  ({ id, status: 'faite', startedAt: `2026-11-${String(day).padStart(2, '0')}T10:00:00Z`, endedAt: `2026-11-${String(day).padStart(2, '0')}T11:00:00Z`, plannedDate: `2026-11-${String(day).padStart(2, '0')}`, createdAt: '2026-11-01T00:00:00Z', ...o }) as WorkoutSession;
const set = (sessionId: string, setIndex: number, o: Partial<SetLog> = {}): SetLog =>
  ({ sessionId, movementId: 'squat', variantId: 'squat-v', exerciseIndex: 0, setIndex, reps: 8, loadKg: 20, rir: 2, pain: false, comment: '', completedAt: `2026-11-01T10:0${setIndex}:00Z`, ...o }) as SetLog;
/** Séance `id` au jour `day` : `n` séries, douleur à la série `painAt` (1-based) si donnée. */
const run = (id: string, n: number, painAt?: number, zone: SetLog['painZone'] = 'genou'): SetLog[] =>
  Array.from({ length: painAt ?? n }, (_, i) => set(id, i, i + 1 === painAt ? { pain: true, painZone: zone } : {}));

describe('painHistory', () => {
  it('sans douleur : tendance « aucune », pas de conseil', () => {
    const h = painHistory('squat', [...run('a', 3), ...run('b', 4)], [sess('a', 1), sess('b', 3)]);
    expect(h.rows.map((r) => r.sessionId)).toEqual(['b', 'a']);
    expect(h.trend).toBe(PAIN_TREND_TEXT.aucune);
    expect(h.consult).toBeNull();
    expect(h.anyPain).toBe(false);
  });
  it('une seule séance : pas de tendance', () => {
    expect(painHistory('squat', run('a', 2, 2), [sess('a', 1)]).trend).toBeNull();
  });
  it('douleur à la dernière seulement', () => {
    const h = painHistory('squat', [...run('a', 3), ...run('b', 4, 2)], [sess('a', 1), sess('b', 3)]);
    expect(h.trend).toBe(PAIN_TREND_TEXT.derniere);
    expect(h.consult).toBeNull();
    expect(h.rows[0]).toMatchObject({ pain: true, painSerie: 2, painWarmup: false, painZone: 'genou', series: 2 });
  });
  it('deux séances de suite : texte S1 mot pour mot', () => {
    const h = painHistory('squat', [...run('a', 3), ...run('b', 3, 1), ...run('c', 3, 2)], [sess('a', 1), sess('b', 3), sess('c', 5)]);
    expect(h.trend).toBe(PAIN_TREND_TEXT.repetee);
    expect(h.consult).toBe(PAIN_S1_TEXT);
  });
  it('2 des 3 dernières non consécutives', () => {
    const h = painHistory('squat', [...run('a', 3, 1), ...run('b', 3), ...run('c', 3, 2)], [sess('a', 1), sess('b', 3), sess('c', 5)]);
    expect(h.consult).toBe(PAIN_2_OF_3_TEXT);
  });
  it('3 douleurs sur 8 : la douleur revient', () => {
    const ids = ['a', 'b', 'c', 'd', 'e', 'f'];
    const sets = ids.flatMap((id, i) => run(id, 3, i === 0 || i === 2 || i === 4 ? 1 : undefined));
    const h = painHistory('squat', sets, ids.map((id, i) => sess(id, i + 1)));
    expect(h.consult).toBe(PAIN_RECURS_TEXT);
    expect(h.trend).toBe(painFreeSinceText(1));
  });
  it('3 douleurs anciennes puis 3 séances sans douleur : pas de « revient », rappel prudent', () => {
    const ids = ['a', 'b', 'c', 'd', 'e', 'f'];
    const sets = ids.flatMap((id, i) => run(id, 3, i < 3 ? 1 : undefined));
    expect(painHistory('squat', sets, ids.map((id, i) => sess(id, i + 1))).consult).toBe(PAIN_PAST_TEXT);
  });
  it('douleur signalée à l’échauffement : comptée, libellé dédié', () => {
    const h = painHistory('squat', [set('a', 0, { isWarmup: true, pain: true, painZone: 'dos' })], [sess('a', 1)]);
    expect(h.anyPain).toBe(true);
    expect(h.rows[0].series).toBe(0);
    expect(painRowText(h.rows[0])).toBe('Douleur (dos) à l’échauffement · exercice arrêté');
  });
  it('N séances sans douleur depuis la dernière, sans dire « amélioration »', () => {
    const h = painHistory('squat', [...run('a', 3, 1), ...run('b', 3), ...run('c', 3), ...run('d', 3)], [sess('a', 1), sess('b', 3), sess('c', 5), sess('d', 7)]);
    expect(h.trend).toBe('3 séances sans douleur depuis la dernière');
    expect(h.consult).toBeNull();
  });
  it('fenêtre de 8 séances ; importées, supprimées et en cours ignorées', () => {
    const ids = Array.from({ length: 10 }, (_, i) => `s${i}`);
    const sessions = [...ids.map((id, i) => sess(id, i + 1)), sess('imp', 20, { imported: true }), sess('del', 21, { deletedAt: '2026-11-22T00:00:00Z' }), sess('cur', 22, { status: 'en_cours' } as Partial<WorkoutSession>)];
    const sets = [...ids.flatMap((id) => run(id, 2)), ...run('imp', 2, 1), ...run('del', 2, 1), ...run('cur', 2, 1)];
    const h = painHistory('squat', sets, sessions);
    expect(h.rows).toHaveLength(8);
    expect(h.rows[0].sessionId).toBe('s9');
    expect(h.anyPain).toBe(false);
  });
  it('échauffement hors séries, autre exercice ignoré ; série par côté comptée une fois', () => {
    const sets = [set('a', 0, { isWarmup: true }), set('a', 1, { side: 'gauche' }), set('a', 1, { side: 'droite' }), set('a', 2, { side: 'gauche', pain: true, painZone: 'inconnu' }), set('a', 0, { movementId: 'autre', pain: true })];
    const h = painHistory('squat', sets, [sess('a', 1)]);
    expect(h.rows[0]).toMatchObject({ series: 2, painSerie: 2, painSide: 'gauche', painZone: 'inconnu' });
    expect(painRowText(h.rows[0])).toBe('Douleur (zone non précisée) à la série 2 (côté gauche) · exercice arrêté');
  });
  it('libellés : jamais « sur N », ni « guéri » ni « amélioration »', () => {
    const t = [painRowText({ sessionId: 'x', dateKey: '2026-11-01', series: 4, pain: false, painSerie: null, painWarmup: false, painZone: null, painSide: null }),
      painRowText({ sessionId: 'x', dateKey: '2026-11-01', series: 2, pain: true, painSerie: 2, painWarmup: false, painZone: 'genou', painSide: null })];
    expect(t).toEqual(['Sans douleur · 4 séries', 'Douleur (genou) à la série 2 · exercice arrêté']);
    expect(t.join(' ')).not.toMatch(/ sur \d|guéri|amélior/i);
  });
  it('exercisesWithPain : seulement les exercices avec douleur dans leur fenêtre', () => {
    const sets = [...run('a', 2, 1), set('a', 0, { movementId: 'pompe' })];
    expect(exercisesWithPain(sets, [sess('a', 1)])).toEqual(['squat']);
  });
});

describe('PainHistoryCard et PainSection', () => {
  const sessions = [sess('a', 1), sess('b', 3), sess('c', 5)];
  const sets = [...run('a', 3), ...run('b', 3, 1), ...run('c', 3, 2, 'epaule')];
  it('carte : tendance, conseil, lignes, rappels S2 et pas un avis médical, sans 15 / 112', () => {
    const { container } = render(<PainHistoryCard movementId="squat" name="Squat" sets={sets} sessions={sessions} frozen />);
    expect(screen.getByText(PAIN_TREND_TEXT.repetee)).toBeTruthy();
    expect(screen.getByText(/Progression en pause pour cette zone/)).toBeTruthy();
    expect(screen.getByRole('status').textContent).toBe(PAIN_S1_TEXT);
    const rows = container.querySelectorAll('.pain-row');
    expect(rows).toHaveLength(3);
    expect(rows[0].textContent).toMatch(/Douleur \(épaule\) à la série 2 · exercice arrêté/);
    expect(rows[2].textContent).toMatch(/Sans douleur · 3 séries/);
    expect(screen.getByText(PAIN_ALERT_TEXT)).toBeTruthy();
    expect(screen.getByText(PAIN_NOT_MEDICAL_TEXT)).toBeTruthy();
    expect(container.textContent).not.toMatch(/\b(15|112)\b/);
  });
  it('section Progression : repliée, s’ouvre au toucher, absente sans douleur', () => {
    render(<PainSection sets={sets} sessions={sessions} names={() => 'Squat'} />);
    expect(screen.queryByText(PAIN_NOT_MEDICAL_TEXT)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Voir l’évolution de la douleur' }));
    expect(screen.getByText(PAIN_NOT_MEDICAL_TEXT)).toBeTruthy();
    cleanup();
    const { container } = render(<PainSection sets={run('a', 3)} sessions={[sess('a', 1)]} names={() => 'Squat'} />);
    expect(container.textContent).toBe('');
  });
});
