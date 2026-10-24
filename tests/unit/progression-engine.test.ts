import { describe, expect, it } from 'vitest';
import { completeSet, currentView, NEUTRAL_CONTEXT, restTaken, skipRest, startSession, type EchelonInfo, type EngineContext } from '../../src/session/engine';
import { proposeProgression } from '../../src/session/history';
import { validateRow } from '../../src/data/validate';
import { day, ex as sex } from './session-helpers';
import { at, ex, M, perfect, session, sets } from './progression-helpers';

const info = (o: Partial<EchelonInfo> = {}): EchelonInfo => ({
  echelon: 3, calibration: true, ceiling: null, noRaise: false, up: { echelon: 4, variantId: 'p4' }, down: { echelon: 2, variantId: 'p2' }, ...o,
});
const ctxOf = (i: EchelonInfo | null, o: Partial<EngineContext> = {}): EngineContext => ({ ...NEUTRAL_CONTEXT, echelonInfo: () => i, ...o });
const d1 = day([ex(3)]);
const first = (ctx: EngineContext, reps: number, rir: number) => completeSet(d1, startSession(d1, 0), { reps, rir }, ctx, 1000);

describe('étalonnage des échelons (V-ETAL-E)', () => {
  it('T18 : 15 répétitions, réserve 4+ en première série -> échelon + 1 pour les séries restantes, tout enregistré', () => {
    const r = first(ctxOf(info()), 15, 4);
    expect(r.entry).toMatchObject({ isCalibration: true, echelon: 3, variantId: 'p3' });
    expect(r.echelonChange).toMatchObject({ from: 3, to: 4, variantId: 'p4' });
    const r2 = completeSet(d1, r.state, { reps: 12, rir: 3 }, ctxOf(info()), 2000);
    expect(r2.entry).toMatchObject({ isCalibration: true, echelon: 4, variantId: 'p4', reps: 12, rir: 3 });
    expect(r2.echelonChange).toBeNull(); // un seul changement par fiche et par séance
    expect(currentView(d1, r2.state).exercise?.variantId).toBe('p4');
  });
  it('T19 : 6 répétitions -> échelon - 1 ; 15 répétitions réserve 2 -> garder', () => {
    expect(first(ctxOf(info()), 6, 1).echelonChange).toMatchObject({ from: 3, to: 2 });
    expect(first(ctxOf(info()), 15, 2).echelonChange).toBeNull();
  });
  it('T20 : sous capped ou grossesse : aucune hausse, baisse permise', () => {
    for (const ctx of [ctxOf(info({ noRaise: true })), ctxOf(info(), { pregnant: true })]) {
      expect(first(ctx, 15, 4).echelonChange).toBeNull();
      expect(first(ctx, 6, 0).echelonChange).toMatchObject({ to: 2 });
    }
    const capped = day([ex(3, { capped: true })]);
    expect(completeSet(capped, startSession(capped, 0), { reps: 15, rir: 4 }, ctxOf(info()), 1).echelonChange).toBeNull();
  });
  it('T21 : débutant au niveau maximal (pas d’échelon + 1 permis) -> pas de montée ; une décision par séance', () => {
    expect(first(ctxOf(info({ up: null })), 15, 4).echelonChange).toBeNull();
    const r = first(ctxOf(info()), 6, 0); // descente, puis réussite : pas de montée dans la même séance
    expect(completeSet(d1, r.state, { reps: 15, rir: 4 }, ctxOf(info()), 2000).echelonChange).toBeNull();
  });
  it('T12 : séance d’arrivée (plafond = échelon accepté) : 15 reps réserve 4+ -> garder ; 6 reps -> descente', () => {
    const arrival = ctxOf(info({ echelon: 4, ceiling: 4, up: { echelon: 5, variantId: 'p5' }, down: { echelon: 3, variantId: 'p3' } }));
    expect(first(arrival, 15, 4).echelonChange).toBeNull();
    expect(first(arrival, 6, 1).echelonChange).toMatchObject({ from: 4, to: 3 });
  });
  it('T36 : étalonnage de retour (noRaise) : 15 répétitions réserve 4+ -> garder', () => {
    expect(first(ctxOf(info({ echelon: 3, noRaise: true })), 15, 4).echelonChange).toBeNull();
  });
  it('plafond de la première séance : la lecture littérale de la spécification (réglage) bloque la montée', () => {
    expect(first(ctxOf(info({ ceiling: 3 })), 15, 4).echelonChange).toBeNull();
  });
  it('exercice à charge : aucun échelon enregistré quand le contexte sait distinguer', () => {
    const r = first(ctxOf(null, { isCalibration: () => false }), 12, 2);
    expect(r.entry.echelon).toBeNull();
    expect(r.echelonChange).toBeNull();
  });
});

describe('repos réellement pris (restTakenSec)', () => {
  const dd = day([sex({ variantId: 'a', sets: 2, restSec: 90 })]);
  const s0 = startSession(dd, 0);
  const r1 = completeSet(dd, s0, { reps: 8, loadKg: 10, rir: 2 }, NEUTRAL_CONTEXT, 10_000);
  const prev = { completedAt: 10_000, isWarmup: false };
  it('timer fini puis appui : durée réelle ; repos sauté : exclu ; échauffement : exclu', () => {
    expect(restTaken(dd, r1.state, prev, 10_000 + 100_000, 600)).toBe(100);
    expect(restTaken(dd, r1.state, prev, 10_000 + 30_000, 600)).toBeNull();
    expect(restTaken(dd, r1.state, { ...prev, isWarmup: true }, 10_000 + 100_000, 600)).toBeNull();
    expect(restTaken(dd, r1.state, prev, 10_000 + 700_000, 600)).toBeNull(); // pause trop longue
    expect(skipRest(r1.state).rest).toBeNull();
  });
  it('validation : restTakenSec doit être un nombre plausible, et peut manquer', () => {
    const row = { ...sets('s', 1, { count: 1 })[0] };
    expect(validateRow('sets', row)).toEqual([]);
    expect(validateRow('sets', { ...row, restTakenSec: 95 })).toEqual([]);
    expect(validateRow('sets', { ...row, restTakenSec: -3 })).not.toEqual([]);
    expect(validateRow('sets', { ...row, restTakenSec: 'x' })).not.toEqual([]);
  });
});

describe('exercices à charge : corrections des écarts F5 (§7)', () => {
  const load = sex({ variantId: 'v', sets: 3, repsMin: 8, repsMax: 12, rirTarget: 2 });
  const mk = (id: string, d: number, o = {}) =>
    [0, 1, 2].map((i) => ({ ...sets(id, d, { count: 1, variantId: 'v', movementId: 'v', loadKg: 10, reps: 12, rir: 2, targetRir: 2, targetRepsMin: 8, targetRepsMax: 12, echelon: null, setIndex: i, ...o })[0] }));
  const eq = { dumbbellWeightsKg: [8, 10, 12.5], kettlebellWeightsKg: [], platesKg: [] };
  const base = { exercise: load, pregnant: false, variantTags: ['halteres'], equipment: eq };
  it('séance valable : le nombre de séries prévues est celui de CETTE séance, pas du plan actuel', () => {
    const two = mk('a', 1).slice(0, 2);
    const row = session('a', 1, { planSets: 2 });
    row.plan!.exercises[0].movementId = 'v';
    expect(proposeProgression({ ...base, sets: two, sessions: [row] }).action).toBe('hausse');
    expect(proposeProgression({ ...base, sets: two }).reason).toBe('incomplet');
  });
  it('séance d’étalonnage ou abandonnée : pas de hausse', () => {
    expect(proposeProgression({ ...base, sets: mk('a', 1, { isCalibration: true }) }).action).not.toBe('hausse');
    const row = session('a', 1, { status: 'sautee', endReason: 'abandon' });
    expect(proposeProgression({ ...base, sets: mk('a', 1), sessions: [row] }).reason).toBe('incomplet');
  });
  it('gel après symptôme : pas de hausse', () => {
    expect(proposeProgression({ ...base, sets: mk('a', 1), frozenBySymptom: true })).toMatchObject({ action: 'garder', reason: 'symptome' });
  });
  it('les baisses restent permises sous capped, grossesse et après une douleur', () => {
    const hard = mk('a', 1, { reps: 5, rir: 0 });
    expect(proposeProgression({ ...base, sets: hard, exercise: { ...load, capped: true } }).action).toBe('baisse');
    expect(proposeProgression({ ...base, sets: hard, pregnant: true }).action).toBe('baisse');
    const painful = [...hard, ...mk('a', 1, { pain: true })].map((s, i) => ({ ...s, id: `p${i}` }));
    expect(proposeProgression({ ...base, sets: painful }).action).toBe('baisse');
  });
  it('pas de saut à e+2 : la montée ne prend jamais un échelon au-delà de e+1', () => {
    const vars = [1, 2, 3, 4].map((e) => ({ id: `w${e}`, nom: `W${e}`, echelon: e, niveau: 'debutant' as const, materielOk: e !== 3, rank: 0 }));
    const p = perfect([1, 3], 2);
    p.sets.forEach((s) => (s.targetRir = 3));
    const r = proposeProgression({ exercise: ex(3), sets: p.sets, sessions: p.sessions, pregnant: false, echelon: 2, bodyweight: { variants: vars, level: 'avance' } });
    expect(r.action).not.toBe('hausse');
    expect(at(0)).toBeTruthy();
    expect(M).toBe('pompe');
  });
});
