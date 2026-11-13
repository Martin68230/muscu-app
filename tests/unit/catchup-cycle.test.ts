// Rattrapage et carte PAR CYCLE (demande de l'utilisateur du 13/11/2026, avis coach + kiné ; valeurs PROVISOIRES / NON SOURCÉES, CATCHUP.cycle).
import { describe, expect, it } from 'vitest';
import type { SetLog } from '../../src/data/model';
import { CATCHUP } from '../../src/generator/config';
import { lastCycleOf, shiftKey } from '../../src/zones/catchup';
import { mergeCatchUpLog } from '../../src/zones/catchup-log';

const DAY = 86_400_000;
const T0 = Date.parse('2026-11-02T10:00:00.000Z');
const ses = (i: number, dayOffset: number) => ({ id: `s${i}`, startedAt: new Date(T0 + dayOffset * DAY).toISOString(), plannedDate: '2026-11-02' });
const setOf = (sessionId: string): SetLog => ({ id: `x${sessionId}`, sessionId, movementId: 'm', completedAt: '2026-11-03T10:00:00.000Z' } as SetLog);
const sets = (ids: string[]) => ids.map(setOf);

describe('clé de période du journal', () => {
  it('cycle : c00007 -> c00006 ; semaine (date) : -7 jours ; jamais sous zéro', () => {
    expect(shiftKey('c00007', -1)).toBe('c00006');
    expect(shiftKey('c00000', -1)).toBe('c00000');
    expect(shiftKey('2026-11-09', -1)).toBe('2026-11-02');
  });
  it('journal : les lignes des 4 derniers cycles sont gardées, les plus anciennes retirées', () => {
    const e = (week: string) => ({ week, zone: 'biceps', movementId: null }) as never;
    const out = mergeCatchUpLog([e('c00001'), e('c00003'), e('c00005')], 'c00006', [e('c00006')]);
    expect(out.map((x) => x.week)).toEqual(['c00003', 'c00005', 'c00006']);
  });
});

describe('lastCycleOf : un cycle = N séances faites, 14 jours au plus', () => {
  it('cycle de 5 séances complet : rattrapage possible, séries du cycle seulement', () => {
    const s = [0, 1, 3, 4, 6].map((d, i) => ses(i, d));
    const r = lastCycleOf(s, sets(['s0', 's1', 's2', 's3', 's4', 'autre']), 5, T0 + 8 * DAY);
    expect(r).not.toBeNull();
    expect(r!.count).toBe(5);
    expect(r!.weekSets).toHaveLength(5);
    expect(r!.weekKey).toBe('c00001');
  });
  it('cycle en cours (moins de N séances, moins de 14 jours) : aucun rattrapage', () => {
    expect(lastCycleOf([0, 1, 3].map((d, i) => ses(i, d)), sets(['s0']), 5, T0 + 5 * DAY)).toBeNull();
  });
  it('cycle clos par le temps avec au moins 2 séances : jugé ; avec une seule : jamais jugé', () => {
    expect(lastCycleOf([0, 9].map((d, i) => ses(i, d)), sets(['s0', 's1']), 5, T0 + 15 * DAY)).not.toBeNull();
    expect(lastCycleOf([ses(0, 0)], sets(['s0']), 5, T0 + 15 * DAY)).toBeNull();
  });
  it('rupture : plus de 14 jours sans séance : aucun rattrapage (on repart à zéro)', () => {
    const s = [0, 1, 2, 3, 4].map((d, i) => ses(i, d));
    expect(lastCycleOf(s, sets(['s0']), 5, T0 + (4 + CATCHUP.cycle.maxDays + 1) * DAY)).toBeNull();
  });
  it('un cycle plus long que 14 jours est coupé : la séance suivante ouvre le cycle suivant', () => {
    const s = [0, 2, 20, 21].map((d, i) => ses(i, d));
    const r = lastCycleOf(s, sets(['s0', 's1', 's2', 's3']), 5, T0 + 40 * DAY);
    expect(r).toBeNull(); // rupture : dernière séance il y a 19 jours
    const r2 = lastCycleOf(s, sets(['s0', 's1', 's2', 's3']), 5, T0 + 34.5 * DAY);
    expect(r2!.weekKey).toBe('c00002');
    expect(r2!.count).toBe(2);
  });
  it('au plus une fois par cycle : une série déjà faite dans le cycle suivant (séance abandonnée) = aucun rattrapage', () => {
    const s = [0, 1, 3, 4, 6].map((d, i) => ses(i, d));
    const abandoned = { ...setOf('s9'), completedAt: new Date(T0 + 8 * DAY).toISOString() };
    expect(lastCycleOf(s, [...sets(['s0']), abandoned], 5, T0 + 9 * DAY)).toBeNull();
  });
  it('sans séance faite ou N invalide : null', () => {
    expect(lastCycleOf([], [], 5, T0)).toBeNull();
    expect(lastCycleOf([ses(0, 0)], [], 0, T0 + DAY)).toBeNull();
  });
});
