import { describe, expect, it } from 'vitest';
import { create, list, setClock } from '../../src/data/repo';
import type { Program, ProgramDay } from '../../src/data/model';
import { isUnilateral } from '../../src/generator/context';
import { buildSteps, completeSet, NEUTRAL_CONTEXT, SessionError, startSession, withPerSide, type EngineContext } from '../../src/session/engine';
import { clearHold, heldSec, holdOver, isHoldExercise, isPerSide, loadHold, needsRir, perSideTarget, saveHold, startHold } from '../../src/session/sides';
import { SessionController } from '../../src/session/store';
import { lineText, targetText } from '../../src/ui/session/text';
import { day, ex, fakeClock } from './session-helpers';

const T0 = Date.parse('2026-10-23T10:00:00.000Z');
const v = (id: string, nom: string) => ({ id, nom });

describe('exercice d’un seul côté : détection automatique de la variante', () => {
  it('un bras, une jambe, alterné, fente, planche latérale : unilatéral', () => {
    for (const [id, nom] of [
      ['pompe-un-bras-sol', 'Au sol'], ['fente-arriere-halteres', 'Haltères'], ['squat-bulgare-chaise', 'Pied sur une chaise'],
      ['developpe-sol-un-haltere', 'Un bras à la fois'], ['developpe-alterne-elastique-assis', 'Assis sur une chaise'],
      ['hip-thrust-banc-une-jambe', 'Une jambe'], ['planche-laterale-genoux', 'Sur le genou'], ['copenhague-genou-chaise', 'Genou du dessus sur la chaise'],
      ['equilibre-unipodal-mur', 'Doigts au mur'], ['sdt-unijambiste-mur', 'Poids du corps, main au mur'],
    ]) expect(isUnilateral(v(id, nom)), id).toBe(true);
  });
  it('deux côtés ensemble : pas unilatéral (haltère à deux mains, élévation latérale, marche alternée)', () => {
    for (const [id, nom] of [
      ['extension-triceps-couche-un-haltere', 'Un haltère tenu à deux mains'], ['sdt-roumain-un-haltere', 'Un haltère à deux mains'],
      ['elevation-laterale-debout-halteres', 'Aux haltères'], ['marche-rapide-alternee', 'Alternance rapide / tranquille'],
      ['pompe-sol', 'Au sol'], ['rowing-barre', 'Barre'],
    ]) expect(isUnilateral(v(id, nom)), id).toBe(false);
  });
});

describe('une série = les deux côtés', () => {
  const sided = () => day([ex({ variantId: 'pompe-un-bras-sol', sets: 2, perSide: true, repsMin: 6, repsMax: 8, restSec: 60 })]);

  it('perSide : une étape par côté, gauche puis droite, repos après le 2e côté seulement', () => {
    const d = sided();
    expect(buildSteps(d.exercises).map((s) => [s.set, s.side, s.restAfterSec])).toEqual([[0, 'gauche', 0], [0, 'droite', 60], [1, 'gauche', 0], [1, 'droite', 60]]);
    expect(isPerSide(d.exercises[0])).toBe(true);
    expect(isPerSide(ex({ variantId: 'x', unit: 'reps_par_cote' }))).toBe(true);
    expect(isPerSide(ex({ variantId: 'x' }))).toBe(false);
  });

  it('textes : « de chaque côté » dans la consigne, l’aperçu et la durée', () => {
    const e = sided().exercises[0];
    expect(targetText(e)).toBe('6-8 répétitions de chaque côté · réserve 2');
    expect(lineText(e)).toBe('2 × 6-8 de chaque côté · repos 1 min');
    expect(perSideTarget({ unit: 'sec', repsMin: 0, repsMax: 0, holdSec: 30 })).toBe('30 s de chaque côté');
    expect(targetText(ex({ variantId: 'x', unit: 'reps_par_cote', repsMin: 8, repsMax: 8 }))).toBe('8 répétitions de chaque côté');
  });

  it('withPerSide complète un ancien plan (jamais le cardio ni les sauts) et ne touche pas ce qui l’est déjà', () => {
    const d = day([
      ex({ variantId: 'a' }), ex({ variantId: 'b' }), ex({ variantId: 'c', role: 'cardio', unit: 'sec', holdSec: 600 }),
      ex({ variantId: 'd', perSide: true }),
    ]);
    const ctx: EngineContext = { ...NEUTRAL_CONTEXT, perSideOf: () => true };
    const out = withPerSide(d, ctx);
    expect(out.exercises.map((e) => isPerSide(e))).toEqual([true, true, false, true]);
    expect(withPerSide(d, NEUTRAL_CONTEXT)).toBe(d);
  });
});

describe('réserve (RIR) obligatoire à chaque série de travail', () => {
  const d = day([ex({ variantId: 'a', sets: 2 })]);
  it('sans réserve, la série est refusée ; avec réserve, elle passe ; jamais sur une douleur', () => {
    expect(() => completeSet(d, startSession(d, T0), { reps: 10, loadKg: 10, requireRir: true }, NEUTRAL_CONTEXT, T0)).toThrow(SessionError);
    expect(completeSet(d, startSession(d, T0), { reps: 10, loadKg: 10, rir: 0, requireRir: true }, NEUTRAL_CONTEXT, T0).entry.rir).toBe(0);
    expect(() => completeSet(d, startSession(d, T0), { reps: 10, loadKg: 10, pain: true, requireRir: true }, NEUTRAL_CONTEXT, T0)).not.toThrow();
    expect(() => completeSet(d, startSession(d, T0), { reps: 10, loadKg: 10, rir: 5, requireRir: true }, NEUTRAL_CONTEXT, T0)).toThrow(SessionError);
  });
  it('échauffement, cardio et sauts : pas de réserve demandée', () => {
    expect(needsRir({ role: 'autre' }, false)).toBe(true);
    expect(needsRir({ role: 'autre' }, true)).toBe(false);
    expect(needsRir({ role: 'cardio' }, false)).toBe(false);
    expect(needsRir({ role: 'cardio', jump: { soft: false } }, false)).toBe(false);
    const cardio = day([ex({ variantId: 'v', role: 'cardio', unit: 'sec', holdSec: 600, sets: 1, startLoadKg: null })]);
    expect(() => completeSet(cardio, startSession(cardio, T0), { requireRir: true }, NEUTRAL_CONTEXT, T0)).not.toThrow();
  });
  it('exercice en durée ou par côté à dose fixe : le ressenti est gardé à part (felt), la progression ne le lit pas', () => {
    const hold = day([ex({ variantId: 'g', unit: 'sec', holdSec: 30, repsMin: 0, repsMax: 0, startLoadKg: null })]);
    expect(() => completeSet(hold, startSession(hold, T0), { holdSec: 25, requireRir: true }, NEUTRAL_CONTEXT, T0)).toThrow(SessionError);
    const r = completeSet(hold, startSession(hold, T0), { holdSec: 25, rir: 2, requireRir: true }, NEUTRAL_CONTEXT, T0);
    expect(r.entry).toMatchObject({ holdSec: 25, rir: null, felt: 2 });
    const fixed = day([ex({ variantId: 'f', unit: 'reps_par_cote' })]);
    expect(completeSet(fixed, startSession(fixed, T0), { reps: 8, rir: 3, requireRir: true }, NEUTRAL_CONTEXT, T0).entry).toMatchObject({ rir: null, felt: 3, side: 'gauche' });
    expect(completeSet(d, startSession(d, T0), { reps: 8, rir: 3, requireRir: true }, NEUTRAL_CONTEXT, T0).entry).toMatchObject({ rir: 3, felt: null });
  });
});

describe('chronomètre d’un exercice en durée (heure réelle)', () => {
  it('décompte sur l’heure réelle, durée tenue plafonnée à la durée prévue', () => {
    const h = startHold(T0, 30)!;
    expect(holdOver(h, T0 + 29_000)).toBe(false);
    expect(holdOver(h, T0 + 30_000)).toBe(true);
    expect(heldSec(h, T0 + 12_400)).toBe(12);
    expect(heldSec(h, T0 + 99_000)).toBe(30);
    expect(heldSec(h, T0 - 5_000)).toBe(0);
    expect(startHold(T0, 0)).toBeNull();
    expect(isHoldExercise({ unit: 'sec', role: 'tronc' })).toBe(true);
    expect(isHoldExercise({ unit: 'sec', role: 'cardio' })).toBe(false);
    expect(isHoldExercise({ unit: 'reps', role: 'tronc' })).toBe(false);
  });
  it('rechargement de la page : le chrono est retrouvé pour la même série seulement, et s’efface', () => {
    const mem = new Map<string, string>();
    const store = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, x: string) => void mem.set(k, x), removeItem: (k: string) => void mem.delete(k) };
    const h = startHold(T0, 45)!;
    saveHold('s1', 4, h, store);
    expect(loadHold('s1', 4, store)).toMatchObject({ endsAt: h.endsAt, totalMs: 45_000 });
    expect(loadHold('s1', 5, store)).toBeNull();
    expect(loadHold('s2', 4, store)).toBeNull();
    clearHold(store);
    expect(loadHold('s1', 4, store)).toBeNull();
    mem.set('muscu.chrono', '{pas du json');
    expect(loadHold('s1', 4, store)).toBeNull();
    expect(loadHold('s1', 4, null)).toBeNull();
  });
});

describe('reprise en pleine séance avec un exercice d’un seul côté', () => {
  it('app rechargée après le côté gauche : la reprise propose le côté droit, la série gauche est enregistrée une fois', async () => {
    const clock = fakeClock();
    setClock(() => new Date(clock.now()));
    const days: ProgramDay[] = [day([ex({ variantId: 'pompe-un-bras-sol', sets: 2, perSide: true, restSec: 60, startLoadKg: null })])];
    const prog: Program = await create('programs', { templateKey: 't', name: 'T', split: 'corps_entier', startDate: '2026-10-23', weeks: 4, active: true, days });
    const ctl = await SessionController.start(prog, 0, NEUTRAL_CONTEXT, clock.now);
    expect(ctl.view()).toMatchObject({ side: 'gauche', setNumber: 1 });
    await ctl.completeSet({ reps: 6, rir: 2, requireRir: true });
    const back = await SessionController.resume(ctl.sessionId, NEUTRAL_CONTEXT, clock.now);
    expect(back.view()).toMatchObject({ side: 'droite', setNumber: 1 });
    await expect(back.completeSet({ reps: 6, requireRir: true })).rejects.toThrow(SessionError);
    expect(await list('sets')).toHaveLength(1);
    await back.completeSet({ reps: 6, rir: 1, requireRir: true });
    const sets = await list('sets');
    expect(sets.map((s) => s.side)).toEqual(['gauche', 'droite']);
    expect(back.state.rest?.totalMs).toBe(60_000);
  });
});
