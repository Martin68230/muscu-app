import { describe, expect, it } from 'vitest';
import {
  abandonSession, adjustRest, buildSteps, completeSet, currentView, endWarmup, finishSession, markPain, NEUTRAL_CONTEXT, reportSymptom,
  SessionError, skipExercise, skipRest, startSession, type EngineContext,
} from '../../src/session/engine';
import { remainingMs } from '../../src/session/timer';
import { day, ex } from './session-helpers';

const T0 = Date.parse('2026-10-23T10:00:00.000Z');
const ctx: EngineContext = NEUTRAL_CONTEXT;
const ok = { reps: 10, loadKg: 10, rir: 2 };

describe('séries et repos', () => {
  it('une série faite lance le repos de l’exercice ; le curseur avance', () => {
    const d = day([ex({ variantId: 'a', sets: 2, restSec: 90 }), ex({ variantId: 'b', sets: 1 })]);
    let s = startSession(d, T0);
    expect(currentView(d, s).setNumber).toBe(1);
    const r = completeSet(d, s, ok, ctx, T0 + 5000);
    s = r.state;
    expect(remainingMs(s.rest, T0 + 5000)).toBe(90_000);
    expect(currentView(d, s).setNumber).toBe(2);
    expect(currentView(d, skipRest(s)).resting).toBeNull();
    expect(r.entry.targetRepsMax).toBe(12);
  });

  it('passer le repos et ajuster de 15 s', () => {
    const d = day([ex({ variantId: 'a', sets: 2, restSec: 60 })]);
    let s = completeSet(d, startSession(d, T0), ok, ctx, T0).state;
    s = adjustRest(s, 15, T0 + 10_000);
    expect(remainingMs(s.rest, T0 + 10_000)).toBe(65_000);
    expect(skipRest(s).rest).toBeNull();
  });

  it('la dernière série ne lance pas de repos et termine la phase', () => {
    const d = day([ex({ variantId: 'a', sets: 1 })]);
    const r = completeSet(d, startSession(d, T0), ok, ctx, T0);
    expect(r.state.rest).toBeNull();
    expect(r.state.phase).toBe('fin');
    expect(() => completeSet(d, r.state, ok, ctx, T0)).toThrow(SessionError);
  });

  it('refuse des valeurs absurdes', () => {
    const d = day([ex({ variantId: 'a' })]);
    const s = startSession(d, T0);
    expect(() => completeSet(d, s, { reps: -1 }, ctx, T0)).toThrow(SessionError);
    expect(() => completeSet(d, s, { reps: 10, rir: 9 }, ctx, T0)).toThrow(SessionError);
    expect(() => completeSet(d, s, { reps: 10, loadKg: Number.NaN }, ctx, T0)).toThrow(SessionError);
    expect(() => completeSet(d, s, { loadKg: 5 }, ctx, T0)).toThrow(SessionError);
  });
});

describe('supersets (V-SUP)', () => {
  const d = day([
    ex({ variantId: 'a', supersetGroup: 'P1', sets: 2, restSec: 90 }),
    ex({ variantId: 'b', supersetGroup: 'P1', sets: 2, restSec: 60 }),
    ex({ variantId: 'c', sets: 1 }),
  ]);

  it('ordre A1, B1, repos de la paire, A2, B2', () => {
    expect(buildSteps(d.exercises).filter((s) => s.kind === 'work').map((s) => `${s.exercise}.${s.set}`)).toEqual(['0.0', '1.0', '0.1', '1.1', '2.0']);
  });

  it('A1 -> transition courte (15 s, pas un repos) -> B1 -> repos le plus long des deux -> A2', () => {
    const s = startSession(d, T0);
    let r = completeSet(d, s, ok, ctx, T0);
    expect(r.state.rest?.kind).toBe('transition');
    expect(r.state.rest?.totalMs).toBe(15_000);
    expect(currentView(d, r.state).exerciseIndex).toBe(1);
    expect(currentView(d, r.state).inSuperset).toBe(true);
    r = completeSet(d, r.state, ok, ctx, T0 + 20_000);
    expect(r.state.rest?.kind).toBe('repos');
    expect(r.state.rest?.totalMs).toBe(90_000);
    expect(currentView(d, r.state)).toMatchObject({ exerciseIndex: 0, setNumber: 2, cursor: { face: 0 } });
  });

  it('une paire de longueurs différentes : l’exercice court saute ses dernières séries', () => {
    const d2 = day([ex({ variantId: 'a', supersetGroup: 'g', sets: 3 }), ex({ variantId: 'b', supersetGroup: 'g', sets: 2 })]);
    expect(buildSteps(d2.exercises).map((s) => `${s.exercise}.${s.set}`)).toEqual(['0.0', '1.0', '0.1', '1.1', '0.2']);
    expect(buildSteps(d2.exercises).at(-1)!.restKind).toBe('repos');
  });

  it('exercice du superset sauté : le partenaire a un repos complet, pas une transition', () => {
    let s = startSession(d, T0);
    s = skipExercise(d, s);
    expect(currentView(d, s).exerciseIndex).toBe(1);
    const r = completeSet(d, s, ok, ctx, T0);
    expect(r.state.rest?.kind).toBe('repos');
  });
});

describe('séries par côté et maintien', () => {
  it('« 6-8/côté » : une série par côté, repos après le 2e côté seulement', () => {
    const d = day([ex({ variantId: 'f', sets: 2, unit: 'reps_par_cote', repsMin: 6, repsMax: 8, restSec: 60 })]);
    const steps = buildSteps(d.exercises);
    expect(steps.map((s) => s.side)).toEqual(['gauche', 'droite', 'gauche', 'droite']);
    let r = completeSet(d, startSession(d, T0), { reps: 8, loadKg: 4, rir: 2 }, ctx, T0);
    expect(r.state.rest).toBeNull();
    expect(r.entry.side).toBe('gauche');
    r = completeSet(d, r.state, { reps: 8, loadKg: 4, rir: 2 }, ctx, T0 + 20_000);
    expect(r.entry.side).toBe('droite');
    expect(r.state.rest?.totalMs).toBe(60_000);
  });

  it('maintien : durée enregistrée (holdSec), pas de répétitions ni de réserve', () => {
    const d = day([ex({ variantId: 'g', sets: 2, unit: 'sec', holdSec: 30, repsMin: 0, repsMax: 0, restSec: 60, startLoadKg: null })]);
    const r = completeSet(d, startSession(d, T0), { holdSec: 28, rir: 3 }, ctx, T0);
    expect(r.entry).toMatchObject({ holdSec: 28, reps: null, rir: null });
    const dflt = completeSet(d, startSession(d, T0), {}, ctx, T0);
    expect(dflt.entry.holdSec).toBe(30);
  });
});

describe('échauffement', () => {
  it('étape échauffement avant les exercices ; séries d’échauffement non comptées dans le travail', () => {
    const d = day([ex({ variantId: 'a', sets: 2, warmupSets: [{ reps: 8, percent: 50, echelon: null }] })], true);
    let s = startSession(d, T0);
    expect(s.phase).toBe('echauffement');
    expect(() => completeSet(d, s, ok, ctx, T0)).toThrow(SessionError);
    s = endWarmup(d, s);
    const v = currentView(d, s);
    expect(v.isWarmupSet).toBe(true);
    expect(v.loadKg).toBe(5);
    let r = completeSet(d, s, { reps: 8, loadKg: 5 }, ctx, T0);
    expect(r.entry.isWarmup).toBe(true);
    expect(r.entry.rir).toBeNull();
    expect(r.state.workSetsDone).toBe(0);
    expect(currentView(d, r.state).isWarmupSet).toBe(false);
    expect(currentView(d, r.state).progress).toEqual({ done: 0, total: 2 });
    r = completeSet(d, r.state, ok, ctx, T0 + 1000);
    expect(r.state.workSetsDone).toBe(1);
    expect(currentView(d, r.state).progress).toEqual({ done: 1, total: 2 });
  });

  it('pas d’échauffement dans le programme : on démarre directement', () => {
    expect(startSession(day([ex({ variantId: 'a' })]), T0).phase).toBe('exercices');
  });
});

describe('douleur, symptôme, saut, fin, abandon', () => {
  const d = day([ex({ variantId: 'a', sets: 3 }), ex({ variantId: 'b', sets: 2 })]);

  it('« ça fait mal » : série enregistrée en douleur, séries restantes annulées, charge gelée, pas de repos', () => {
    const s0 = completeSet(d, startSession(d, T0), ok, ctx, T0).state;
    const r = markPain(d, s0, { zone: 'genou', reps: 6, loadKg: 10 }, ctx, T0 + 5000);
    expect(r.entry).toMatchObject({ pain: true, painZone: 'genou' });
    expect(r.state.rest).toBeNull();
    expect(r.state.painExercises).toEqual([0]);
    expect(currentView(d, r.state).exerciseIndex).toBe(1);
    expect(r.suggestion).toBeNull();
  });

  it('douleur sans zone : « je ne sais pas »', () => {
    expect(markPain(d, startSession(d, T0), { reps: 5 }, ctx, T0).entry.painZone).toBe('inconnu');
  });

  it('sauter un exercice (confirmé par l’interface) passe au suivant sans repos', () => {
    const s = skipExercise(d, startSession(d, T0));
    expect(currentView(d, s).exerciseIndex).toBe(1);
    expect(s.rest).toBeNull();
  });

  it('abandon : issue « abandon », plus aucune action possible', () => {
    const s = abandonSession(completeSet(d, startSession(d, T0), ok, ctx, T0).state, T0 + 60_000);
    expect(s.outcome).toBe('abandon');
    expect(s.rest).toBeNull();
    expect(() => completeSet(d, s, ok, ctx, T0)).toThrow(SessionError);
  });

  it('terminer sans aucune série de travail = abandon ; avec une série = terminée', () => {
    expect(finishSession(startSession(d, T0), T0).outcome).toBe('abandon');
    expect(finishSession(completeSet(d, startSession(d, T0), ok, ctx, T0).state, T0).outcome).toBe('terminee');
  });

  it('symptôme : la séance est interrompue proprement, les séries faites restent', () => {
    const s0 = completeSet(d, startSession(d, T0), ok, ctx, T0).state;
    const r = reportSymptom(s0, T0 + 1000, true);
    expect(r.state.outcome).toBe('symptome');
    expect(r.state.workSetsDone).toBe(1);
    expect(r.urgent).toBe(true);
  });
});

describe('étalonnage série par série (generateur-v1.md §5.2)', () => {
  const cal: EngineContext = { ...NEUTRAL_CONTEXT, isCalibration: () => true, availableLoadsKg: () => [4, 6, 8, 10, 12] };
  const d = day([ex({ variantId: 'a', sets: 3, repsMin: 10, repsMax: 12, rirTarget: 3, startLoadKg: 6 })]);

  it('réserve haute et haut de fourchette : propose le poids supérieur pour la série suivante', () => {
    const r = completeSet(d, startSession(d, T0), { reps: 12, loadKg: 6, rir: 4 }, cal, T0);
    expect(r.suggestion).toMatchObject({ action: 'hausse', loadKg: 8 });
    expect(currentView(d, r.state).loadKg).toBe(8);
  });

  it('exercice plafonné (capped) : jamais de hausse', () => {
    const dc = day([ex({ variantId: 'a', sets: 3, repsMin: 10, repsMax: 12, rirTarget: 3, startLoadKg: 6, capped: true })]);
    const r = completeSet(dc, startSession(dc, T0), { reps: 12, loadKg: 6, rir: 4 }, cal, T0);
    expect(r.suggestion?.action).toBe('garder');
    expect(currentView(dc, r.state).loadKg).toBe(6);
  });

  it('grossesse : jamais de hausse, même si l’exercice n’est pas marqué capped', () => {
    const r = completeSet(d, startSession(d, T0), { reps: 12, loadKg: 6, rir: 4 }, { ...cal, pregnant: true }, T0);
    expect(r.suggestion?.action).toBe('garder');
  });

  it('trop dur : la baisse reste permise', () => {
    const r = completeSet(d, startSession(d, T0), { reps: 7, loadKg: 6, rir: 0 }, cal, T0);
    expect(r.suggestion).toMatchObject({ action: 'baisse', loadKg: 4 });
  });
});
