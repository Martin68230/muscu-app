import { describe, expect, it } from 'vitest';
import { create, list, setClock } from '../../src/data/repo';
import type { Program, ProgramDay } from '../../src/data/model';
import { NEUTRAL_CONTEXT, SessionError } from '../../src/session/engine';
import { closeStaleSession, findResumable, RESUME_MAX_MS, SessionController, currentPainCheck } from '../../src/session/store';
import { day, ex, fakeClock } from './session-helpers';

async function program(days: ProgramDay[]): Promise<Program> {
  return create('programs', {
    templateKey: 'test', name: 'Test', split: 'corps_entier', startDate: '2026-10-23', weeks: 4, active: true, days,
  });
}

function setup(days: ProgramDay[]) {
  const clock = fakeClock();
  setClock(() => new Date(clock.now()));
  return { clock, prog: program(days) };
}

describe('enregistrement à chaque action et reprise après fermeture', () => {
  it('chaque série faite est enregistrée (SetLog) ; la séance est « en_cours » avec curseur', async () => {
    const { clock, prog } = setup([day([ex({ variantId: 'a', sets: 2 })])]);
    const ctl = await SessionController.start(await prog, 0, NEUTRAL_CONTEXT, clock.now);
    await ctl.completeSet({ reps: 10, loadKg: 10, rir: 2 });
    const [session] = await list('sessions');
    expect(session.status).toBe('en_cours');
    expect(session.cursor).toMatchObject({ exercise: 0, set: 1 });
    expect(session.restEndsAt).toBe(clock.now() + 90_000);
    const sets = await list('sets');
    expect(sets).toHaveLength(1);
    expect(sets[0]).toMatchObject({ sessionId: session.id, variantId: 'a', reps: 10, loadKg: 10, rir: 2, pain: false, isWarmup: false, targetRir: 2 });
  });

  it('fermeture au milieu d’un repos : la reprise retrouve la série suivante et le repos sur l’heure réelle', async () => {
    const { clock, prog } = setup([day([ex({ variantId: 'a', sets: 3, restSec: 90 })])]);
    const ctl = await SessionController.start(await prog, 0, NEUTRAL_CONTEXT, clock.now);
    await ctl.completeSet({ reps: 10, loadKg: 10, rir: 2 });
    clock.advance(40_000); // l'app est fermée 40 s
    const back = await SessionController.resume(ctl.sessionId, NEUTRAL_CONTEXT, clock.now);
    expect(back.view().setNumber).toBe(2);
    expect(back.restRemainingMs()).toBe(50_000);
    clock.advance(200_000);
    expect(back.restRemainingMs()).toBe(0);
    expect(back.onForeground().remainingMs).toBe(0);
  });

  it('fermeture au milieu d’un superset : la reprise donne la face B, avec la transition', async () => {
    const d = day([ex({ variantId: 'a', supersetGroup: 'P1', sets: 2 }), ex({ variantId: 'b', supersetGroup: 'P1', sets: 2 })]);
    const { clock, prog } = setup([d]);
    const ctl = await SessionController.start(await prog, 0, NEUTRAL_CONTEXT, clock.now);
    await ctl.completeSet({ reps: 10, loadKg: 10, rir: 2 });
    const back = await SessionController.resume(ctl.sessionId, NEUTRAL_CONTEXT, clock.now);
    expect(back.view()).toMatchObject({ exerciseIndex: 1, setNumber: 1, inSuperset: true, cursor: { face: 1 } });
    expect(back.state.rest?.kind).toBe('transition');
    await back.completeSet({ reps: 10, loadKg: 10, rir: 2 });
    expect(back.view()).toMatchObject({ exerciseIndex: 0, setNumber: 2 });
    expect(await list('sets')).toHaveLength(2);
  });

  it('la reprise garde les sauts, les douleurs et les charges ; le plan est celui de la séance même si le programme change', async () => {
    const p = await (async () => {
      const { clock, prog } = setup([day([ex({ variantId: 'a', sets: 2 }), ex({ variantId: 'b', sets: 2 })])]);
      return { clock, program: await prog };
    })();
    const ctl = await SessionController.start(p.program, 0, NEUTRAL_CONTEXT, p.clock.now);
    await ctl.markPain({ zone: 'genou', reps: 5, loadKg: 10 });
    const { update } = await import('../../src/data/repo');
    await update('programs', p.program.id, { days: [] }); // programme régénéré entre-temps
    const back = await SessionController.resume(ctl.sessionId, NEUTRAL_CONTEXT, p.clock.now);
    expect(back.state.painExercises).toEqual([0]);
    expect(back.view().exerciseIndex).toBe(1);
    const sets = await list('sets');
    expect(sets[0]).toMatchObject({ pain: true, painZone: 'genou' });
  });

  it('rejouer la même série après un plantage ne crée pas de doublon', async () => {
    const { clock, prog } = setup([day([ex({ variantId: 'a', sets: 2 })])]);
    const ctl = await SessionController.start(await prog, 0, NEUTRAL_CONTEXT, clock.now);
    await ctl.completeSet({ reps: 10, loadKg: 10, rir: 2 });
    // plantage avant l'enregistrement du curseur : l'ancien curseur est rejoué
    const { update } = await import('../../src/data/repo');
    await update('sessions', ctl.sessionId, { cursor: { exercise: 0, set: 0, face: 0, step: 0 }, restEndsAt: null });
    const back = await SessionController.resume(ctl.sessionId, NEUTRAL_CONTEXT, clock.now);
    await back.completeSet({ reps: 11, loadKg: 10, rir: 2 });
    const sets = await list('sets');
    expect(sets).toHaveLength(1);
    expect(sets[0].reps).toBe(11);
  });
});

describe('au lancement : reprendre, terminer ou abandonner', () => {
  it('moins de 12 h : on propose « Reprendre ta séance »', async () => {
    const { clock, prog } = setup([day([ex({ variantId: 'a' })])]);
    const ctl = await SessionController.start(await prog, 0, NEUTRAL_CONTEXT, clock.now);
    const r = await findResumable(clock.now() + 3600_000);
    expect(r?.session.id).toBe(ctl.sessionId);
    expect(r?.proposal).toBe('reprendre');
  });

  it('plus de 12 h : terminer ou abandonner ; « terminer » compte les séries faites', async () => {
    const { clock, prog } = setup([day([ex({ variantId: 'a', sets: 3 })])]);
    const ctl = await SessionController.start(await prog, 0, NEUTRAL_CONTEXT, clock.now);
    await ctl.completeSet({ reps: 10, loadKg: 10, rir: 2 });
    const later = clock.now() + RESUME_MAX_MS + 1;
    const r = await findResumable(later);
    expect(r?.proposal).toBe('terminer_ou_abandonner');
    const closed = await closeStaleSession(ctl.sessionId, 'terminer', NEUTRAL_CONTEXT, later);
    expect(closed.status).toBe('faite');
    expect(closed.endReason).toBe('terminee');
    expect(await findResumable(later)).toBeNull();
    expect(await list('sets')).toHaveLength(1);
  });

  it('abandonner : séance « sautee », séries déjà faites conservées', async () => {
    const { clock, prog } = setup([day([ex({ variantId: 'a', sets: 3 })])]);
    const ctl = await SessionController.start(await prog, 0, NEUTRAL_CONTEXT, clock.now);
    await ctl.completeSet({ reps: 10, loadKg: 10, rir: 2 });
    const row = await ctl.abandonSession();
    expect(row.status).toBe('sautee');
    expect(row.endReason).toBe('abandon');
    expect(row.restEndsAt).toBeNull();
    expect(await list('sets')).toHaveLength(1);
  });

  it('une seule séance en cours à la fois', async () => {
    const { clock, prog } = setup([day([ex({ variantId: 'a' })])]);
    const p = await prog;
    await SessionController.start(p, 0, NEUTRAL_CONTEXT, clock.now);
    await expect(SessionController.start(p, 0, NEUTRAL_CONTEXT, clock.now)).rejects.toThrow(SessionError);
  });

  it('terminer enregistre la séance « faite » avec l’heure de fin', async () => {
    const { clock, prog } = setup([day([ex({ variantId: 'a', sets: 1 })])]);
    const ctl = await SessionController.start(await prog, 0, NEUTRAL_CONTEXT, clock.now);
    await ctl.completeSet({ reps: 10, loadKg: 10, rir: 2 });
    clock.advance(600_000);
    const row = await ctl.finishSession();
    expect(row).toMatchObject({ status: 'faite', endedAt: new Date(clock.now()).toISOString() });
  });
});

describe('symptôme et douleur persistante', () => {
  it('« J’ai un symptôme » : séance interrompue, U1 (15 ou 112) d’abord quand c’est urgent', async () => {
    const { clock, prog } = setup([day([ex({ variantId: 'a', sets: 3 })])]);
    const ctl = await SessionController.start(await prog, 0, NEUTRAL_CONTEXT, clock.now);
    await ctl.completeSet({ reps: 10, loadKg: 10, rir: 2 });
    const out = await ctl.reportSymptom(true);
    expect(out.messages[0]).toContain('15');
    expect(out.messages[0]).toContain('112');
    expect(out.tel).toBe('tel:15');
    const [row] = await list('sessions');
    expect(row.status).toBe('sautee');
    expect(row.endReason).toBe('symptome');
    expect(await list('sets')).toHaveLength(1);
    expect((await ctl.reportSymptom(false)).messages).toHaveLength(1);
  });

  it('douleur sur la même zone à 2 séances de suite : proposition de niveau 2, jamais appliquée toute seule', async () => {
    const { clock, prog } = setup([day([ex({ variantId: 'a', sets: 3 })])]);
    const p = await prog;
    for (let i = 0; i < 2; i++) {
      const ctl = await SessionController.start(p, 0, NEUTRAL_CONTEXT, clock.now);
      await ctl.markPain({ zone: 'genou', reps: 5, loadKg: 10 });
      await ctl.finishSession();
      clock.advance(2 * 24 * 3600_000);
    }
    const check = await currentPainCheck();
    expect(check.proposals).toMatchObject([{ zone: 'genou', from: 0, to: 2 }]);
    expect(check.proposals[0].text).toContain('niveau 2');
    expect(await list('injuries')).toHaveLength(0);
  });
});
