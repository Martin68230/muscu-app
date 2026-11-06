// Écran Historique : filtres, détail (côtés, supersets), comparaison, courbe. Logique pure.
(globalThis as unknown as { process: { env: Record<string, string> } }).process.env.TZ = 'Europe/Paris';
import { describe, expect, it } from 'vitest';
import type { SetLog, WorkoutSession } from '../../src/data/model';
import type { HistoryEntry } from '../../src/session/calendar';
import {
  compareDetails, curveGeometry, curveSeries, deltaText, filterEntries, monthOptions, previousSameType, serieText, sessionDetail, stepCount, typeOptions,
} from '../../src/session/history-view';

const ex = (movementId: string, o: Record<string, unknown> = {}) => ({
  movementId, variantId: `${movementId}-v`, sets: 2, repsMin: 8, repsMax: 12, restSec: 60, supersetGroup: null, rirTarget: 2, unit: 'reps', holdSec: null,
  warmupSets: [], role: 'pilier', slot: 's', startLoadKg: null, capped: false, adaptation: null, substitut: false, ...o,
});
const session = (id: string, date: string, label: string, exercises: unknown[], o: Partial<WorkoutSession> = {}): WorkoutSession => ({
  id, ownerId: 'u', rev: 1, deletedAt: null, syncedAt: null, createdAt: date, updatedAt: date, programId: 'p', programDayIndex: 0, plannedDate: date.slice(0, 10),
  status: 'faite', startedAt: `${date}T10:00:00`, endedAt: `${date}T10:45:00`, note: '', endReason: 'terminee', plan: { dayIndex: 0, label, exercises } as never, ...o,
} as WorkoutSession);
const set = (sessionId: string, movementId: string, exerciseIndex: number, setIndex: number, o: Partial<SetLog> = {}): SetLog => ({
  id: `${sessionId}-${exerciseIndex}-${setIndex}-${o.side ?? ''}`, ownerId: 'u', rev: 1, deletedAt: null, syncedAt: null, createdAt: '', updatedAt: '', sessionId, movementId,
  variantId: `${movementId}-v`, exerciseIndex, setIndex, targetRepsMin: 8, targetRepsMax: 12, reps: 10, loadKg: 20, rir: 2, pain: false, comment: '',
  completedAt: '2026-10-01T10:10:00', ...o,
} as SetLog);

describe('filtres', () => {
  const e = (id: string, dateKey: string, label: string): HistoryEntry => ({ id, dateKey, atMs: 0, label, durationMin: 45, setsDone: 6, mark: 'faite' });
  const list = [e('1', '2026-10-27', 'Séance A'), e('2', '2026-10-20', 'Séance B'), e('3', '2026-09-29', 'Séance A')];
  it('par mois, par type, les deux, aucun', () => {
    expect(filterEntries(list, { month: null, type: null })).toHaveLength(3);
    expect(filterEntries(list, { month: '2026-10', type: null }).map((x) => x.id)).toEqual(['1', '2']);
    expect(filterEntries(list, { month: null, type: 'Séance A' }).map((x) => x.id)).toEqual(['1', '3']);
    expect(filterEntries(list, { month: '2026-09', type: 'Séance B' })).toEqual([]);
  });
  it('options : mois récents d’abord, types par fréquence', () => {
    expect(monthOptions(list)).toEqual(['2026-10', '2026-09']);
    expect(typeOptions(list)).toEqual([{ type: 'Séance A', count: 2 }, { type: 'Séance B', count: 1 }]);
  });
});

describe('détail', () => {
  it('une série par côté compte deux étapes, gauche avant droite', () => {
    const s = session('s1', '2026-10-01', 'Séance A', [ex('fente', { perSide: true })]);
    const sets = [
      set('s1', 'fente', 0, 0, { side: 'droite', reps: 9 }), set('s1', 'fente', 0, 0, { side: 'gauche', reps: 10 }),
      set('s1', 'fente', 0, 1, { side: 'gauche' }), set('s1', 'fente', 0, 1, { side: 'droite' }),
    ];
    const [d] = sessionDetail(s, sets);
    expect(d.perSide).toBe(true);
    expect(d.series).toHaveLength(2);
    expect(stepCount(d)).toBe(4);
    expect(d.series[0].sides.map((x) => x.side)).toEqual(['gauche', 'droite']);
    expect(serieText(d.series[0], d, 1)).toBe('Série 1 : gauche 10 répétitions à 20 kg · 2 de réserve ; droite 9 répétitions à 20 kg · 2 de réserve');
  });
  it('durée tenue avec ressenti (felt), cardio, échauffement et séries non faites ignorés, paire de superset', () => {
    const s = session('s1', '2026-10-01', 'Séance A', [ex('planche', { unit: 'sec', supersetGroup: 'g1' }), ex('rowing', { supersetGroup: 'g1' }), ex('velo', { unit: 'sec', role: 'cardio' })]);
    const sets = [
      set('s1', 'planche', 0, 0, { reps: null, loadKg: null, holdSec: 30, rir: null, felt: 2 }),
      set('s1', 'planche', 0, 1, { reps: null, loadKg: null, isWarmup: true, holdSec: 10 }),
      set('s1', 'rowing', 1, 0, {}),
      set('s1', 'rowing', 1, 1, { completedAt: null }),
      set('s1', 'velo', 2, 0, { reps: null, loadKg: null, holdSec: 1200, rir: null }),
    ];
    const d = sessionDetail(s, sets);
    expect(d.map((x) => x.movementId)).toEqual(['planche', 'rowing', 'velo']);
    expect(d[0].hold).toBe(true);
    expect(d[0].series).toHaveLength(1);
    expect(serieText(d[0].series[0], d[0], 1)).toBe('Série 1 : 30 s tenues · encore 10 s possible');
    expect(d[0].pairWith).toEqual([1]);
    expect(d[1].pairWith).toEqual([0]);
    expect(d[1].series).toHaveLength(1);
    expect(d[2].cardio).toBe(true);
    expect(serieText(d[2].series[0], d[2], 1)).toBe('Série 1 : 20 min');
    expect(d[2].pairWith).toEqual([]);
  });
  it('séance sans série : aucun exercice', () => {
    expect(sessionDetail(session('s1', '2026-10-01', 'A', []), [])).toEqual([]);
  });
});

describe('comparaison', () => {
  const prev = session('p', '2026-10-01', 'Séance A', [ex('squat'), ex('row')]);
  const cur = session('c', '2026-10-08', 'Séance A', [ex('squat'), ex('curl')]);
  const other = session('o', '2026-10-05', 'Séance B', [ex('squat')]);
  const sets = [
    set('p', 'squat', 0, 0, { loadKg: 20, reps: 10 }), set('p', 'squat', 0, 1, { loadKg: 20, reps: 8 }),
    set('p', 'row', 1, 0, {}), set('o', 'squat', 0, 0, {}), set('c', 'squat', 0, 0, { loadKg: 22.5, reps: 10 }),
    set('c', 'squat', 0, 1, { loadKg: 22.5, reps: 9 }), set('c', 'squat', 0, 2, { loadKg: 22.5, reps: 8 }), set('c', 'curl', 1, 0, {}),
  ];
  it('séance précédente du même type seulement', () => {
    expect(previousSameType(cur, [prev, cur, other], sets)?.id).toBe('p');
    expect(previousSameType(prev, [prev, cur, other], sets)).toBeNull();
    expect(previousSameType({ ...cur, plan: null } as WorkoutSession, [prev], sets)).toBeNull();
  });
  it('une séance arrêtée ou supprimée n’est pas une référence', () => {
    expect(previousSameType(cur, [{ ...prev, endReason: 'symptome' }, cur], sets)).toBeNull();
    expect(previousSameType(cur, [{ ...prev, deletedAt: '2026-10-02' }, cur], sets)).toBeNull();
    expect(previousSameType(cur, [{ ...prev, status: 'sautee' }, cur], sets)).toBeNull();
  });
  it('écarts par exercice commun', () => {
    const r = compareDetails(sessionDetail(cur, sets), sessionDetail(prev, sets));
    expect(r).toHaveLength(1);
    expect(r[0]).toMatchObject({ movementId: 'squat', kind: 'charge', dLoad: 2.5, dReps: 0, dSeries: 1, seriesNow: 3, seriesBefore: 2 });
    expect(deltaText(r[0].dLoad, 'kg')).toBe('+2,5 kg');
    expect(deltaText(r[0].dReps, 'rep')).toBe('identique');
    expect(deltaText(-1, 'rep')).toBe('−1 répétition');
    expect(deltaText(null, 'kg')).toBe('non comparable');
  });
  it('aucun exercice commun : liste vide', () => {
    const a = session('a', '2026-10-01', 'Séance A', [ex('x')]);
    const b = session('b', '2026-10-08', 'Séance A', [ex('y')]);
    const s2 = [set('a', 'x', 0, 0), set('b', 'y', 0, 0)];
    expect(compareDetails(sessionDetail(b, s2), sessionDetail(a, s2))).toEqual([]);
  });
  it('variante différente : écart de charge non calculé', () => {
    const a = session('a', '2026-10-01', 'Séance A', [ex('x')]);
    const b = session('b', '2026-10-08', 'Séance A', [ex('x')]);
    const s2 = [set('a', 'x', 0, 0, { loadKg: 10 }), set('b', 'x', 0, 0, { loadKg: 30, variantId: 'autre' })];
    const [r] = compareDetails(sessionDetail(b, s2), sessionDetail(a, s2));
    expect(r.variantChanged).toBe(true);
    expect(r.dLoad).toBeNull();
  });
});

describe('courbe', () => {
  const s1 = session('s1', '2026-10-01', 'A', [ex('squat')]);
  const s2 = session('s2', '2026-10-08', 'A', [ex('squat')]);
  const s3 = session('s3', '2026-10-15', 'A', [ex('squat')], { endReason: 'symptome' });
  const s4 = session('s4', '2026-10-22', 'A', [ex('squat')]);
  const sets = [
    set('s2', 'squat', 0, 0, { loadKg: 25 }), set('s2', 'squat', 0, 1, { loadKg: 22.5 }), set('s1', 'squat', 0, 0, { loadKg: 20 }),
    set('s3', 'squat', 0, 0, { loadKg: 40 }), set('s4', 'squat', 0, 0, { loadKg: 50, pain: true }), set('s4', 'squat', 0, 1, { loadKg: 27.5 }),
    set('s1', 'squat', 0, 5, { loadKg: 99, isWarmup: true }),
  ];
  it('meilleure charge par séance, ordre chronologique, sans symptôme ni douleur ni échauffement', () => {
    const { metric, points } = curveSeries('squat', sets, [s4, s2, s3, s1]);
    expect(metric).toBe('charge');
    expect(points.map((p) => [p.dateKey, p.value])).toEqual([['2026-10-01', 20], ['2026-10-08', 25], ['2026-10-22', 27.5]]);
  });
  it('poids du corps : répétitions ; durée : secondes ; rien : aucun point', () => {
    const bw = [set('s1', 'pompe', 0, 0, { loadKg: null, reps: 8 }), set('s1', 'pompe', 0, 1, { loadKg: null, reps: 12 }), set('s2', 'pompe', 0, 0, { loadKg: null, reps: 10 })];
    expect(curveSeries('pompe', bw, [s1, s2])).toEqual({ metric: 'reps', points: [{ sessionId: 's1', dateKey: '2026-10-01', value: 12 }, { sessionId: 's2', dateKey: '2026-10-08', value: 10 }] });
    const hold = [set('s1', 'planche', 0, 0, { loadKg: null, reps: null, holdSec: 30 })];
    expect(curveSeries('planche', hold, [s1]).metric).toBe('duree');
    expect(curveSeries('inconnu', sets, [s1, s2]).points).toEqual([]);
  });
  it('géométrie : bornes, point unique centré, valeurs égales à mi-hauteur', () => {
    const pad = { l: 40, r: 10, t: 10, b: 30 };
    const g = curveGeometry([20, 25, 27.5], 340, 190, pad);
    expect(g.xy[0]).toEqual({ x: 40, y: 160 });
    expect(g.xy[2]).toEqual({ x: 330, y: 10 });
    expect(g.min).toBe(20);
    expect(g.path.startsWith('M40 160 L')).toBe(true);
    expect(curveGeometry([30], 340, 190, pad).xy[0]).toEqual({ x: 185, y: 85 });
    expect(curveGeometry([30, 30], 340, 190, pad).xy.map((p) => p.y)).toEqual([85, 85]);
  });
});
