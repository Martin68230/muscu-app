import { describe, expect, it } from 'vitest';
import type { ProgressionEvent } from '../../src/data/model';
import { evaluateEchelon, proposeHold, proposeLevel, quittedEchelons, startRepsFor, symptomFrozen, type EchelonInput } from '../../src/session/progression';
import { PROGRESSION, withProgression } from '../../src/session/progression-config';
import { at, M, perfect, session, sets, variants } from './progression-helpers';

const base = (p: ReturnType<typeof perfect>, o: Partial<EchelonInput> = {}): EchelonInput => ({
  movementId: M, echelon: 3, sets: p.sets, sessions: p.sessions, variants: variants(), level: 'intermediaire', pregnant: false, capped: false, fallbackPlanned: 3, ...o,
});
const two = () => perfect([1, 3]);
const addPain = (p: ReturnType<typeof perfect>, d: number) => {
  p.sets.push(...sets(`pain${d}`, d, { pain: true, count: 1 }));
  p.sessions.push(session(`pain${d}`, d));
};

describe('montée d’échelon (V-PROG-E2)', () => {
  it('T1 : 2 séances valables de suite -> proposition d’échelon 4', () => {
    expect(evaluateEchelon(base(two())).proposal).toMatchObject({ kind: 'montee', from: 3, to: 4, variantId: 'p4' });
  });
  it('T2 : une seule séance -> rien', () => expect(evaluateEchelon(base(perfect([1]))).proposal).toBeNull());
  it('T3 : une série à 14 répétitions dans la 2e séance -> rien', () => {
    const p = two();
    p.sets.filter((s) => s.sessionId === 'a3')[1].reps = 14;
    expect(evaluateEchelon(base(p)).proposal).toBeNull();
  });
  it('T4 : réserve non saisie -> rien', () => {
    const p = two();
    p.sets[4].rir = null;
    expect(evaluateEchelon(base(p)).proposal).toBeNull();
  });
  it('T5 : réserve 2 pour une cible 3 -> rien', () => {
    const p = two();
    p.sets[0].rir = 2;
    expect(evaluateEchelon(base(p)).proposal).toBeNull();
  });
  it('T6 : débutant, e+1 de niveau intermédiaire : pas d’échelon ; une fiche prête = pas de niveau ; 3 fiches = une proposition par bloc', () => {
    const r = evaluateEchelon(base(two(), { level: 'debutant' }));
    expect(r.proposal).toBeNull();
    expect(r.readyBlockedByLevel).toBe(true);
    const lvl = (ready: number, extra = {}) =>
      proposeLevel({ level: 'debutant', pregnant: false, readyFiches: ready, firstSessionAt: Date.parse(at(0)), now: Date.parse(at(70)), lastIncidentAt: null, zoneLevel2Plus: false, frozen: false, ...extra });
    expect(lvl(1)).toBeNull();
    expect(lvl(3)).toMatchObject({ from: 'debutant', to: 'intermediaire' });
    expect(lvl(3, { events: [{ type: 'niveau', accepted: false, at: at(60) }] as ProgressionEvent[] })).toBeNull();
    expect(lvl(3, { events: [{ type: 'niveau', accepted: false, at: at(30) }] as ProgressionEvent[] })).not.toBeNull();
  });
  it('T7 : fiche capped -> rien ; T8 : grossesse -> rien', () => {
    expect(evaluateEchelon(base(two(), { capped: true })).proposal).toBeNull();
    expect(evaluateEchelon(base(two(), { pregnant: true })).proposal).toBeNull();
    expect(evaluateEchelon(base(two(), { capped: true, level: 'debutant' })).readyBlockedByLevel).toBe(false); // ne compte pas pour le niveau
  });
  it('T9 : douleur à la dernière séance -> rien ; le compteur repart de 0 ensuite', () => {
    const p = two();
    addPain(p, 5);
    expect(evaluateEchelon(base(p)).proposal).toBeNull();
    const q = perfect([1, 3, 6]);
    addPain(q, 5);
    expect(evaluateEchelon(base(q)).proposal).toBeNull();
    const r = perfect([1, 3, 6, 8]);
    addPain(r, 5);
    expect(evaluateEchelon(base(r)).proposal).toMatchObject({ kind: 'montee' });
  });
  it('T10/T11 : échelon 4 absent (matériel) ou échelon 3 maximal -> rien, sans erreur ; jamais e+2', () => {
    expect(evaluateEchelon(base(two(), { variants: variants({ 4: { materielOk: false } }) })).proposal).toBeNull();
    expect(evaluateEchelon(base(two(), { variants: variants().filter((v) => v.echelon <= 3) })).proposal).toBeNull();
  });
  it('T13 : proposition refusée -> pas de nouvelle proposition avant 2 séances valables de plus', () => {
    const ev: ProgressionEvent[] = [{ type: 'refus', kind: 'montee', movementId: M, from: 3, to: 4, at: at(3, 500) }];
    expect(evaluateEchelon(base(two(), { events: ev })).proposal).toBeNull();
    expect(evaluateEchelon(base(perfect([1, 3, 5]), { events: ev })).proposal).toBeNull();
    expect(evaluateEchelon(base(perfect([1, 3, 5, 7]), { events: ev })).proposal).toMatchObject({ kind: 'montee' });
  });
  it('T14 : variante de matériel différent au même échelon : compteur conservé', () => {
    const p = two();
    p.sets.filter((s) => s.sessionId === 'a3').forEach((s) => (s.variantId = 'p3b'));
    expect(evaluateEchelon(base(p)).proposal).toMatchObject({ kind: 'montee', to: 4 });
  });
  it('T17 : exercice sauté ou séance abandonnée entre deux séances parfaites -> compteur à 0', () => {
    const p = perfect([1, 5]);
    p.sessions.push(session('skip', 3));
    p.sets.push(...sets('skip', 3, { count: 1 }));
    expect(evaluateEchelon(base(p)).proposal).toBeNull();
    const q = perfect([1, 5]);
    q.sessions.push(session('abandon', 3, { status: 'sautee', endReason: 'abandon' }));
    expect(evaluateEchelon(base(q)).proposal).toBeNull();
  });
  it('un seul échelon à la fois, même largement dépassé', () => {
    expect(evaluateEchelon(base(perfect([1, 3, 5, 7, 9]))).proposal).toMatchObject({ to: 4 });
  });
});

describe('anti-aller-retour (V-PROG-E11) et descente (V-PROG-E5)', () => {
  it('T40 : descente de 4 à 3 : 3 séances valables pour remonter (la séance d’arrivée ne compte pas)', () => {
    const p = perfect([1, 3], 4);
    p.sets.push(...sets('x', 4, { echelon: 3, variantId: 'p3', isCalibration: true }));
    p.sessions.push(session('x', 4));
    expect(quittedEchelons(M, p.sets).has(4)).toBe(true);
    const a = perfect([6, 8], 3, 'b');
    const withTwo = { sets: [...p.sets, ...a.sets], sessions: [...p.sessions, ...a.sessions] };
    expect(evaluateEchelon(base(withTwo)).proposal).toBeNull();
    const c = perfect([10], 3, 'b');
    const withThree = { sets: [...withTwo.sets, ...c.sets], sessions: [...withTwo.sessions, ...c.sessions] };
    expect(evaluateEchelon(base(withThree)).proposal).toMatchObject({ kind: 'montee', to: 4 });
  });
  const hard = (days: number[], mk: (i: number) => object, extra: object = {}) => ({
    sets: days.flatMap((d) => [0, 1, 2].flatMap((i) => sets(`h${d}`, d, { count: 1, setIndex: i, ...mk(i), ...extra }))),
    sessions: days.map((d) => session(`h${d}`, d)),
  });
  it('T15 : 2 séries sur 3 sous 10 répétitions, 2 séances de suite -> descente à 2', () => {
    const p = hard([1, 3], (i) => (i < 2 ? { reps: 8 } : { reps: 12 }));
    expect(evaluateEchelon(base(p)).proposal).toMatchObject({ kind: 'descente', from: 3, to: 2 });
  });
  it('T15 : une seule série à 8 sur 3 -> rien ; une seule séance -> rien', () => {
    expect(evaluateEchelon(base(hard([1, 3], (i) => (i < 1 ? { reps: 8 } : { reps: 12 })))).proposal).toBeNull();
    expect(evaluateEchelon(base(hard([1], () => ({ reps: 8 })))).proposal).toBeNull();
  });
  it('T15 : séance intermédiaire parfaite -> compteur à 0', () => {
    const p = hard([1, 5], () => ({ reps: 8 }));
    p.sessions.push(session('mid', 3));
    p.sets.push(...sets('mid', 3, { count: 3, reps: 15 }));
    expect(evaluateEchelon(base(p)).proposal).toBeNull();
  });
  it('T15 : échelon 1 : version plus douce si elle existe, sinon texte de repli ; jamais de proposition d’échelon', () => {
    const p = hard([1, 3], () => ({ reps: 8, echelon: 1, variantId: 'p1' }));
    expect(evaluateEchelon(base(p, { echelon: 1, gentler: { nom: 'Pompe douce' } })).proposal).toMatchObject({ kind: 'plancher', text: expect.stringContaining('version plus douce') });
    const b = evaluateEchelon(base(p, { echelon: 1, gentler: null })).proposal;
    expect(b).toMatchObject({ kind: 'plancher', text: expect.stringContaining('professionnel de santé') });
    expect((b as { text: string }).text).not.toContain('plus douce');
  });
  it('T16 : réserve <= cible - 2 sur 2 séries sur 3, 2 séances -> descente ; une séance -> rien ; un côté suffit', () => {
    const rir = (i: number) => (i < 2 ? { rir: 1 } : { rir: 3 });
    expect(evaluateEchelon(base(hard([1, 3], rir))).proposal).toMatchObject({ kind: 'descente' });
    expect(evaluateEchelon(base(hard([1], rir))).proposal).toBeNull();
    const sided = (d: number) => [...sets(`h${d}`, d, { count: 2, side: 'gauche', reps: 8 }), ...sets(`h${d}`, d, { count: 2, side: 'droite', reps: 15 })];
    const p = { sets: [...sided(1), ...sided(3)], sessions: [session('h1', 1, { planSets: 2 }), session('h3', 3, { planSets: 2 })] };
    expect(evaluateEchelon(base(p, { fallbackPlanned: 4 })).proposal).toMatchObject({ kind: 'descente' });
  });
  it('la descente reste permise sous capped, grossesse et après un symptôme', () => {
    const p = hard([1, 3], () => ({ reps: 8 }));
    expect(evaluateEchelon(base(p, { capped: true, pregnant: true, frozen: true })).proposal).toMatchObject({ kind: 'descente' });
  });
});

describe('gel après symptôme, niveau, maintiens, suggestion, réglages', () => {
  it('T35 : dernière séance en symptôme -> gel ; abandon -> aucun gel', () => {
    expect(symptomFrozen([session('s', 1, { status: 'sautee', endReason: 'symptome' })])).toBe(true);
    expect(symptomFrozen([session('s', 1, { status: 'sautee', endReason: 'symptome' }), session('t', 2)])).toBe(false);
    expect(symptomFrozen([session('s', 1, { status: 'sautee', endReason: 'abandon' })])).toBe(false);
    expect(evaluateEchelon(base(two(), { frozen: true })).proposal).toBeNull();
  });
  it('T37 : niveau : 2 fiches, 7 semaines, douleur récente, zone gênée, niveau intermédiaire -> rien', () => {
    const ok = { level: 'debutant' as const, pregnant: false, readyFiches: 3, firstSessionAt: Date.parse(at(0)), now: Date.parse(at(60)), lastIncidentAt: null, zoneLevel2Plus: false, frozen: false };
    expect(proposeLevel(ok)).not.toBeNull();
    expect(proposeLevel({ ...ok, readyFiches: 2 })).toBeNull();
    expect(proposeLevel({ ...ok, now: Date.parse(at(48)) })).toBeNull();
    expect(proposeLevel({ ...ok, lastIncidentAt: Date.parse(at(50)) })).toBeNull();
    expect(proposeLevel({ ...ok, level: 'intermediaire' })).toBeNull();
    expect(proposeLevel({ ...ok, zoneLevel2Plus: true })).toBeNull();
  });
  it('V-PROG-E10 : suggestion au bas après tout changement d’échelon', () => {
    const p = perfect([1], 3);
    expect(startRepsFor(M, 3, p.sets)).toBe(15);
    expect(startRepsFor(M, 4, p.sets)).toBeNull();
    expect(startRepsFor(M, 2, p.sets)).toBeNull();
  });
  it('T22 : maintien figé en v1 ; paliers activés : 25 s, plafond, côté non tenu, capped, grossesse', () => {
    const h = (hold: number) => ({
      sets: [1, 3].flatMap((d) => sets(`a${d}`, d, { count: 2, holdSec: hold, reps: null, rir: null, echelon: null })),
      sessions: [session('a1', 1, { planSets: 2 }), session('a3', 3, { planSets: 2 })],
    });
    const cfg = withProgression({ hold: { enabled: true } });
    const input = (hold: number, p = h(hold)) => ({ movementId: M, schema: 'gainage', holdSec: hold, sets: p.sets, sessions: p.sessions, pregnant: false, capped: false, fallbackPlanned: 2 });
    expect(proposeHold(input(20))).toBeNull();
    expect(proposeHold({ ...input(20), cfg })).toBe(25);
    expect(proposeHold({ ...input(45), cfg })).toBeNull();
    const miss = h(20);
    miss.sets[3].holdSec = 15;
    expect(proposeHold({ ...input(20, miss), cfg })).toBeNull();
    expect(proposeHold({ ...input(20), cfg, capped: true })).toBeNull();
    expect(proposeHold({ ...input(20), cfg, pregnant: true })).toBeNull();
  });
  it('les valeurs de progression-config.ts sont utilisées : changer une valeur change le résultat', () => {
    expect(evaluateEchelon(base(perfect([1]), { cfg: withProgression({ echelon: { validSessionsToRaise: 1 } }) })).proposal).toMatchObject({ kind: 'montee' });
    expect(evaluateEchelon(base(perfect([1, 3, 5]), { cfg: withProgression({ echelon: { validSessionsToRaise: 4 } }) })).proposal).toBeNull();
    expect(PROGRESSION.echelon.validSessionsToRaise).toBe(2);
  });
  it('aucun texte de proposition ne contient de code de règle, « sourc » ni identifiant brut', () => {
    const up = evaluateEchelon(base(two())).proposal;
    const down = evaluateEchelon(base({ sets: sets('h1', 1, { reps: 8 }).concat(sets('h3', 3, { reps: 8 })), sessions: [session('h1', 1), session('h3', 3)] })).proposal;
    for (const p of [up, down]) {
      const t = p && p.kind !== 'plancher' ? `${p.title} ${p.text}` : '';
      expect(t.length).toBeGreaterThan(10);
      expect(t).not.toMatch(/V-[A-Z]+|sourc|\bp[0-9]\b|pompe-/i);
    }
  });
});
