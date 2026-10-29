// Séance manquée, étape 4 : reprise douce dans le lecteur (seance-manquee-v1.md SM-12, SM-13, R-DEM, R-FIN, E5, E12, E27, V-PROG-E8).
import { describe, expect, it } from 'vitest';
import { create, list, setClock, update } from '../../src/data/repo';
import { ensureLocalUser } from '../../src/data/bootstrap';
import type { Program, ProgramDay } from '../../src/data/model';
import { completeSet, NEUTRAL_CONTEXT, startSession, type EngineContext } from '../../src/session/engine';
import { SessionController } from '../../src/session/store';
import { proposeProgression } from '../../src/session/history';
import { postponeRows } from '../../src/session/missed';
import { DEFAULT_REPRISE, repriseOf } from '../../src/session/missed-config';
import { planReprise, repriseLoadsFor } from '../../src/session/reprise-plan';
import { day, ex, fakeClock } from './session-helpers';

const dumbbells = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
const ctxLoads = (loads: number[]): EngineContext => ({ ...NEUTRAL_CONTEXT, availableLoadsKg: () => loads });

async function program(days: ProgramDay[]): Promise<Program> {
  return create('programs', { templateKey: 'test', name: 'Test', split: 'corps_entier', startDate: '2026-10-01', weeks: 4, active: true, days });
}

describe('moteur : étalonnage de reprise', () => {
  it('E27 : palier 4, séance 1 : l’étalonnage peut monter mais jamais au-dessus de C0 (20 kg)', () => {
    const d = day([ex({ variantId: 'v', sets: 4, startLoadKg: 18, repsMin: 8, repsMax: 12, rirTarget: 2, reprise: { calibration: true, noRaise: false, maxKg: 20 } })]);
    let s = startSession(d, 0);
    const r1 = completeSet(d, s, { reps: 12, loadKg: 18, rir: 4 }, ctxLoads(dumbbells), 1000);
    expect(r1.entry.isCalibration).toBe(true);
    expect(r1.suggestion?.loadKg).toBe(20);
    s = r1.state;
    const r2 = completeSet(d, s, { reps: 12, loadKg: 20, rir: 4 }, ctxLoads(dumbbells), 2000);
    expect(r2.suggestion?.loadKg).toBe(20); // 22 et 24 refusés : plafond C0
    const r3 = completeSet(d, r2.state, { reps: 12, loadKg: 24, rir: 4 }, ctxLoads(dumbbells), 3000);
    expect(r3.state.loads[0]).toBeLessThanOrEqual(20);
  });

  it('paliers 1 à 3 : « garder / descendre » seulement, la descente reste possible', () => {
    const d = day([ex({ variantId: 'v', sets: 3, startLoadKg: 16, repsMin: 8, repsMax: 12, rirTarget: 2, reprise: { calibration: true, noRaise: true, maxKg: null } })]);
    const s = startSession(d, 0);
    const up = completeSet(d, s, { reps: 12, loadKg: 16, rir: 4 }, ctxLoads(dumbbells), 1000);
    expect(up.entry.isCalibration).toBe(true);
    expect(up.suggestion?.action).toBe('garder');
    const down = completeSet(d, s, { reps: 5, loadKg: 16, rir: 0 }, ctxLoads(dumbbells), 1000);
    expect(down.suggestion).toMatchObject({ action: 'baisse', loadKg: 14 });
  });
});

describe('V-PROG-E8 : reprise douce active', () => {
  it('aucune proposition de montée, aucun texte inventé ; sans reprise la montée reste proposée', () => {
    const exo = ex({ variantId: 'v', sets: 2, startLoadKg: 10, repsMin: 8, repsMax: 12, rirTarget: 2 });
    const sets = [0, 1].map((i) => ({
      id: `x${i}`, ownerId: 'u', createdAt: 'c', updatedAt: 'u', rev: 1, deletedAt: null, syncedAt: null, sessionId: 's', movementId: exo.movementId,
      variantId: 'v', exerciseIndex: 0, setIndex: i, targetRepsMin: 8, targetRepsMax: 12, reps: 12, loadKg: 10, rir: 3, pain: false, comment: '',
      completedAt: `2026-10-20T10:0${i}:00.000Z`, isCalibration: false, isWarmup: false,
    }));
    const base = { exercise: exo, sets, pregnant: false, variantTags: ['halteres'], equipment: { dumbbellWeightsKg: dumbbells, kettlebellWeightsKg: [], platesKg: [] } };
    expect(proposeProgression(base).action).toBe('hausse');
    const p = proposeProgression({ ...base, repriseActive: true });
    expect(p.action).toBe('garder');
    expect(p.reason).toBe('reprise');
    expect(p.text).toBe('');
  });
});

describe('démarrage et fin de séance (store)', () => {
  it('E5 : la ligne N du jour décalé est réutilisée ; la séance faite garde son jour prévu et dejaDecalee', async () => {
    const clock = fakeClock(Date.parse('2026-11-03T08:00:00.000Z'));
    setClock(() => new Date(clock.now()));
    const p = await program([day([ex({ variantId: 'a', sets: 1 })]), day([ex({ variantId: 'b', sets: 1 })])]);
    const [o, n] = postponeRows(p, 0, '2026-11-02', '2026-11-03', new Date(clock.now()).toISOString());
    await create('sessions', o);
    const nRow = await create('sessions', n);
    const ctl = await SessionController.start(p, 0, NEUTRAL_CONTEXT, clock.now);
    expect(ctl.sessionId).toBe(nRow.id);
    await ctl.completeSet({ reps: 10, loadKg: 10, rir: 2 });
    await ctl.finishSession();
    const sessions = await list('sessions');
    expect(sessions).toHaveLength(2);
    const doneRow = sessions.find((s) => s.id === nRow.id)!;
    expect(doneRow).toMatchObject({ status: 'faite', plannedDate: '2026-11-03', originDate: '2026-11-02', dejaDecalee: true });
  });

  it('E12 / R-FIN : séance arrêtée sur un symptôme : securiteALire et plancher 2 enregistrés sur le profil', async () => {
    const clock = fakeClock();
    setClock(() => new Date(clock.now()));
    await ensureLocalUser();
    const p = await program([day([ex({ variantId: 'a', sets: 2 })])]);
    const ctl = await SessionController.start(p, 0, NEUTRAL_CONTEXT, clock.now);
    await ctl.reportSymptom(false);
    const [prof] = await list('profile');
    expect(repriseOf(prof)).toMatchObject({ securiteALire: true, palierMin: 2 });
  });

  it('R-FIN : séance de reprise valable : valables + 1, puis fin de reprise au seuil', async () => {
    const clock = fakeClock();
    setClock(() => new Date(clock.now()));
    const prof = await ensureLocalUser();
    await update('profile', prof.id, { reprise: { ...DEFAULT_REPRISE, palier: 2, actif: true, valables: 1, msgVu: true, refKg: { a: 20 } } });
    const p = await program([day([ex({ variantId: 'a', sets: 1, startLoadKg: 18 })])]);
    const ctl = await SessionController.start(p, 0, NEUTRAL_CONTEXT, clock.now);
    await ctl.completeSet({ reps: 10, loadKg: 18, rir: 2 });
    await ctl.finishSession();
    const [after] = await list('profile');
    expect(repriseOf(after)).toMatchObject({ valables: 2, actif: false, refKg: {} });
  });
});

describe('planReprise (aperçu et démarrage)', () => {
  it('E11 avec le contexte du lecteur : 14 kg, 2 séries, état à enregistrer (refKg C0 = 20 kg)', () => {
    const d = day([ex({ variantId: 'v', sets: 3, startLoadKg: 20, role: 'autre' })]);
    const old = { id: 'old', ownerId: 'u', createdAt: 'c', updatedAt: 'u', rev: 1, deletedAt: null, syncedAt: null, programId: 'p', programDayIndex: 0,
      plannedDate: '2026-10-22', status: 'faite' as const, startedAt: '2026-10-22T17:00:00.000Z', endedAt: '2026-10-22T18:00:00.000Z', note: '', plan: d };
    const sets = [{ id: 'x', ownerId: 'u', createdAt: 'c', updatedAt: 'u', rev: 1, deletedAt: null, syncedAt: null, sessionId: 'old', movementId: 'm', variantId: 'v',
      exerciseIndex: 0, setIndex: 0, targetRepsMin: 8, targetRepsMax: 12, reps: 10, loadKg: 20, rir: 2, pain: false, comment: '', completedAt: '2026-10-22T17:10:00.000Z' }];
    const plan = planReprise(d, { reprise: DEFAULT_REPRISE, sessions: [old], programs: [], sets, now: new Date(2026, 11, 1, 9), ctx: ctxLoads(dumbbells) });
    expect(plan?.state).toMatchObject({ palier: 3, actif: true, refKg: { v: 20 } });
    expect(plan?.day.exercises[0]).toMatchObject({ startLoadKg: 14, sets: 2 });
  });

  it('cardio dédié : aucune reprise de musculation (le plancher n’est pas consommé)', () => {
    const d = day([ex({ variantId: 'c', role: 'cardio', unit: 'sec', holdSec: 600, startLoadKg: null })]);
    expect(planReprise(d, { reprise: { ...DEFAULT_REPRISE, palierMin: 2 }, sessions: [], programs: [], sets: [], now: new Date() })).toBeNull();
  });

  it('barre (pas de liste de poids) : grille au pas du matériel jusqu’à la charge de départ', () => {
    const ctx: EngineContext = { ...NEUTRAL_CONTEXT, availableLoadsKg: (_e, cur) => (cur === null ? [] : [cur - 5, cur, cur + 5]) };
    expect(repriseLoadsFor(ctx)(ex({ variantId: 'b', startLoadKg: 40 }))).toEqual([5, 10, 15, 20, 25, 30, 35, 40]);
  });
});
