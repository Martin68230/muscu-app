import { describe, expect, it } from 'vitest';
import { ensureLocalUser } from '../../src/data/bootstrap';
import { create, list, setClock } from '../../src/data/repo';
import type { Program, ProgramDay } from '../../src/data/model';
import { buildCtx } from '../../src/generator/context';
import { NEUTRAL_CONTEXT, type EchelonInfo, type EngineContext } from '../../src/session/engine';
import { pendingArrival } from '../../src/session/progression';
import { acceptEchelon, answerLevel, cancelArrivals, computeProposals, echelonInfoFor, loadEvents, refuseEchelon, staleArrivals } from '../../src/session/progression-store';
import { ECHELON_TEXT } from '../../src/session/messages';
import { SessionController } from '../../src/session/store';
import { day, ex, fakeClock } from './session-helpers';
import { mk } from './generator-helpers';
import { ex as bwEx, perfect, session as bwSession } from './progression-helpers';

async function program(days: ProgramDay[]): Promise<Program> {
  return create('programs', { templateKey: 'test', name: 'Test', split: 'corps_entier', startDate: '2026-10-23', weeks: 4, active: true, days });
}

describe('repos pris et échelon changé en séance, enregistrés', () => {
  it('restTakenSec : durée réelle si le minuteur est fini, rien si le repos est sauté', async () => {
    const clock = fakeClock();
    setClock(() => new Date(clock.now()));
    const prog = await program([day([ex({ variantId: 'a', sets: 3, restSec: 60 })])]);
    const ctl = await SessionController.start(prog, 0, NEUTRAL_CONTEXT, clock.now);
    await ctl.completeSet({ reps: 10, loadKg: 10, rir: 2 });
    clock.advance(95_000);
    await ctl.skipRest();
    await ctl.completeSet({ reps: 10, loadKg: 10, rir: 2 });
    clock.advance(10_000);
    await ctl.skipRest(); // sauté avant la fin
    const rows = (await list('sets')).sort((a, b) => a.setIndex - b.setIndex);
    expect(rows[0].restTakenSec).toBe(95);
    expect(rows[1].restTakenSec ?? null).toBeNull();
  });

  it('échelon : variante enregistrée par série, état gardé à la reprise, programme mis à jour pour la prochaine fois', async () => {
    const clock = fakeClock();
    setClock(() => new Date(clock.now()));
    const info: EchelonInfo = { echelon: 3, calibration: true, ceiling: null, noRaise: false, up: { echelon: 4, variantId: 'p4' }, down: { echelon: 2, variantId: 'p2' } };
    const ctx: EngineContext = { ...NEUTRAL_CONTEXT, echelonInfo: () => info };
    const prog = await program([day([bwEx(3)])]);
    const ctl = await SessionController.start(prog, 0, ctx, clock.now);
    await ctl.completeSet({ reps: 15, rir: 4 });
    await ctl.skipRest();
    const back = await SessionController.resume(ctl.sessionId, ctx, clock.now);
    expect(back.view().exercise?.variantId).toBe('p4');
    await back.completeSet({ reps: 12, rir: 3 });
    const rows = (await list('sets')).sort((a, b) => a.setIndex - b.setIndex);
    expect(rows.map((r) => [r.variantId, r.echelon, r.isCalibration])).toEqual([['p3', 3, true], ['p4', 4, true]]);
    expect((await list('programs'))[0].days[0].exercises[0].variantId).toBe('p4');
    const [s] = await list('sessions');
    expect(s.echelonSwitches).toMatchObject({ '0': { echelon: 4, variantId: 'p4', from: 3 } });
  });
});

describe('décisions de progression et propositions de l’aperçu', () => {
  const input = mk({ level: 'intermediaire' });
  const pompe = input.fiches.find((f) => f.id === 'pompe')!;
  const v = (e: number) => pompe.variantes.find((x) => x.echelon === e)!.id;

  it('accepter : décision enregistrée, programme mis à jour, la séance suivante est une séance d’arrivée bornée', async () => {
    await ensureLocalUser();
    const prog = await program([day([bwEx(3, { variantId: v(3) })])]);
    const proposal = { kind: 'montee' as const, movementId: 'pompe', from: 3, to: 4, variantId: v(4), variantNom: 'x', title: 't', text: 't' };
    await acceptEchelon(proposal, new Date('2026-10-20T10:00:00Z'));
    expect((await list('programs')).find((p) => p.id === prog.id)!.days[0].exercises[0].variantId).toBe(v(4));
    const events = await loadEvents();
    expect(events).toEqual([expect.objectContaining({ type: 'montee', from: 3, to: 4 })]);
    expect(pendingArrival(events, 'pompe', [])).toMatchObject({ to: 4 });
    const planned = bwEx(3, { variantId: v(4) });
    const info = echelonInfoFor(planned, { ctx: buildCtx(input), sets: [], sessions: [], events });
    expect(info).toMatchObject({ echelon: 4, calibration: true, ceiling: 4 });
  });

  it('programme régénéré avant la séance d’arrivée : la décision est annulée, dite une fois, et ne bloque plus rien', async () => {
    await ensureLocalUser();
    const prog = await program([day([bwEx(3, { variantId: v(3) })])]);
    const proposal = { kind: 'montee' as const, movementId: 'pompe', from: 3, to: 4, variantId: v(4), variantNom: 'x', title: 't', text: 't' };
    await acceptEchelon(proposal, new Date('2026-10-20T10:00:00Z'));
    const regenerated = { days: [day([bwEx(3, { variantId: v(3) })])] }; // le générateur a remis l'échelon 3
    expect(staleArrivals(regenerated, input.fiches, [], await loadEvents())).toEqual(['pompe']);
    expect(staleArrivals({ days: (await list('programs')).find((p) => p.id === prog.id)!.days }, input.fiches, [], await loadEvents())).toEqual([]);
    await cancelArrivals(['pompe'], new Date('2026-10-21T10:00:00Z'));
    const events = await loadEvents();
    expect(pendingArrival(events, 'pompe', [])).toBeNull();
    expect(staleArrivals(regenerated, input.fiches, [], events)).toEqual([]);
    expect(ECHELON_TEXT.cancelled).toBe('La proposition d’échelon est annulée parce que ton programme a changé.');
  });

  it('plus tard : le refus est enregistré ; niveau : réponse enregistrée, niveau changé seulement si accepté', async () => {
    const profile = await ensureLocalUser();
    await refuseEchelon({ kind: 'montee', movementId: 'pompe', from: 3, to: 4, variantId: v(4), variantNom: 'x', title: '', text: '' }, new Date('2026-10-20T10:00:00Z'));
    await answerLevel(false, new Date('2026-10-21T10:00:00Z'));
    expect((await loadEvents()).map((e) => e.type)).toEqual(['refus', 'niveau']);
    expect((await list('profile'))[0].level).toBe(profile.level);
    await answerLevel(true, new Date('2026-10-22T10:00:00Z'));
    expect((await list('profile'))[0].level).toBe('intermediaire');
  });

  it('computeProposals : une carte pour la fiche prête ; aucune en grossesse', () => {
    const p = perfect([1, 3], 3);
    p.sets.forEach((s) => ((s.movementId = 'pompe'), (s.variantId = v(3)), (s.targetRir = 3)));
    const prog = { days: [day([bwEx(3, { variantId: v(3) })])] };
    const base = { program: prog, dayIndex: 0, input, sets: p.sets, sessions: p.sessions, events: [], zoneLevel2Plus: false, now: Date.parse('2026-10-24') };
    const r = computeProposals(base);
    expect(r.items).toHaveLength(1);
    expect(r.items[0].proposal).toMatchObject({ kind: 'montee', from: 3, to: 4 });
    expect(computeProposals({ ...base, input: mk({ preg: 'enceinte' }) }).items).toEqual([]);
    expect(bwSession('x', 1).id).toBe('x');
  });
});
