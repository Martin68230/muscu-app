// Écran Progression : records par exercice et séries par semaine (fonctions pures).
import { describe, expect, it } from 'vitest';
import type { SetLog, WorkoutSession } from '../../src/data/model';
import { exerciseProgress, weeklySets } from '../../src/session/progress-view';

const session = (id: string, date: string, o: Partial<WorkoutSession> = {}): WorkoutSession => ({
  id, ownerId: 'u', rev: 1, deletedAt: null, syncedAt: null, createdAt: date, updatedAt: date, programId: 'p', programDayIndex: 0, plannedDate: date,
  status: 'faite', startedAt: `${date}T10:00:00`, endedAt: `${date}T10:45:00`, note: '', endReason: 'terminee', plan: { dayIndex: 0, label: 'A', exercises: [] } as never, ...o,
} as WorkoutSession);
const set = (sessionId: string, movementId: string, i: number, o: Partial<SetLog> = {}): SetLog => ({
  id: `${sessionId}-${movementId}-${i}`, ownerId: 'u', rev: 1, deletedAt: null, syncedAt: null, createdAt: '', updatedAt: '', sessionId, movementId,
  variantId: `${movementId}-v`, exerciseIndex: 0, setIndex: i, targetRepsMin: 8, targetRepsMax: 12, reps: 10, loadKg: 20, rir: 2, pain: false, comment: '',
  completedAt: '2026-10-01T10:10:00', ...o,
} as SetLog);

const s1 = session('s1', '2026-10-05');
const s2 = session('s2', '2026-10-12');
const s3 = session('s3', '2026-10-19', { imported: true });
const s4 = session('s4', '2026-10-20', { status: 'abandonnee' as never, endReason: 'abandon' });

describe('exerciseProgress', () => {
  it('record, première et dernière valeur ; douleur, échauffement, importé et abandon ignorés ; 2 séances minimum', () => {
    const sets = [
      set('s1', 'squat', 0, { loadKg: 20 }), set('s2', 'squat', 0, { loadKg: 25 }), set('s2', 'squat', 1, { loadKg: 40, pain: true }),
      set('s3', 'squat', 0, { loadKg: 100 }), set('s4', 'squat', 0, { loadKg: 90 }), set('s2', 'squat', 2, { loadKg: 80, isWarmup: true }),
      set('s1', 'rowing', 0, { loadKg: 30 }),
    ];
    const r = exerciseProgress(sets, [s1, s2, s3, s4]);
    expect(r.map((x) => x.movementId)).toEqual(['squat']);
    expect(r[0]).toMatchObject({ metric: 'charge', sessions: 2, first: 20, last: 25, best: 25, bestDateKey: '2026-10-12' });
  });
});

describe('weeklySets', () => {
  it('compte les séries de travail par semaine (lundi), 8 semaines, sans douleur ni échauffement ni import', () => {
    const sets = [set('s1', 'a', 0), set('s1', 'a', 1), set('s1', 'a', 2, { isWarmup: true }), set('s1', 'a', 3, { pain: true }), set('s2', 'a', 0), set('s3', 'a', 0), set('s1', 'a', 4, { completedAt: null })];
    const w = weeklySets(sets, [s1, s2, s3], new Date(2026, 9, 14));
    expect(w).toHaveLength(8);
    expect(w[7]).toEqual({ startKey: '2026-10-12', sets: 1 });
    expect(w[6]).toEqual({ startKey: '2026-10-05', sets: 2 });
    expect(w[0].startKey).toBe('2026-08-24');
    expect(w.reduce((n, x) => n + x.sets, 0)).toBe(3);
  });
});
