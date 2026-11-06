// Acceptation en un appui des propositions d'adaptation (knowledge/adaptation-regles.md §6, §7) : acceptation appliquée à la séance suivante,
// annulation par gel (douleur, symptôme, grossesse, reprise, séance manquée), « Plus tard », décharge (déclencheur du §7.7 seulement).
import { describe, expect, it } from 'vitest';
import type { Level, ProgressionEvent, SetLog, WorkoutSession } from '../../src/data/model';
import { applyAccepted, deloadLoad, pendingAdapt, type ApplyEnv } from '../../src/session/adapt-accept';
import { proposeProgression, type ProgressionInput } from '../../src/session/history';
import { ADAPT_TEXT } from '../../src/session/messages';
import type { ProgVariant } from '../../src/session/progression';
import { day as dayOf, ex } from './session-helpers';

let n = 0;
function log(o: Partial<SetLog> & { sessionId: string; completedAt: string }): SetLog {
  n++;
  return {
    id: `a${n}`, ownerId: 'u', createdAt: o.completedAt, updatedAt: o.completedAt, rev: 1, deletedAt: null, syncedAt: null,
    movementId: 'm', variantId: 'v', exerciseIndex: 0, setIndex: n, targetRepsMin: 8, targetRepsMax: 12, targetRir: 2,
    reps: 12, loadKg: 10, rir: 2, pain: false, comment: '', isWarmup: false, ...o,
  } as SetLog;
}
const day = (d: number) => `2026-10-${String(d).padStart(2, '0')}T10:00:00.000Z`;
const sess = (id: string, d: number, over: Partial<SetLog> = {}, count = 3) =>
  Array.from({ length: count }, (_, i) => log({ ...over, sessionId: id, completedAt: new Date(Date.parse(day(d)) + i * 60_000).toISOString() }));
const row = (id: string, d: number): WorkoutSession =>
  ({ id, status: 'faite', startedAt: day(d), endedAt: day(d), plannedDate: day(d).slice(0, 10), deletedAt: null, endReason: null }) as unknown as WorkoutSession;

const eq = { dumbbellWeightsKg: [4, 6, 10, 12, 12.5, 15], kettlebellWeightsKg: [], platesKg: [] };
const NOW = Date.parse(day(20));
const exo = ex({ variantId: 'v', movementId: 'm', sets: 2, repsMin: 8, repsMax: 12, rirTarget: 2, restSec: 90, startLoadKg: 12.5 });
const base = (sets: SetLog[], o: Partial<ProgressionInput> = {}): ProgressionInput => ({
  exercise: exo, sets, pregnant: false, variantTags: ['halteres'], equipment: eq, level: 'intermediaire' as Level, echelon: 1, now: NOW, restMaxSec: 120, ...o,
});
const harder: ProgVariant[] = [
  { id: 'v', nom: 'Facile', echelon: 1, niveau: 'debutant', materielOk: true, rank: 0 },
  { id: 'v2', nom: 'Plus dure', echelon: 2, niveau: 'intermediaire', materielOk: true, rank: 0 },
];
const at = (d: number) => day(d);
const accepte = (kind: 'serie' | 'variante' | 'repos' | 'decharge', d: number, extra: object = {}): ProgressionEvent =>
  ({ type: 'adapt_accepte', kind, movementId: 'm', at: at(d), ...extra }) as ProgressionEvent;

const env = (events: ProgressionEvent[], o: Partial<ApplyEnv> = {}): ApplyEnv => ({
  events, sets: sess('h', 1, { loadKg: 12.5 }), sessions: [row('h', 1)], pregnant: false, repriseActive: false, frozenBySymptom: false,
  adaptOf: () => ({ level: 'intermediaire', zonesOfFiche: ['epaule'], variants: harder, ficheMaxSets: 3, restMaxSec: 120, missedSinceLast: false }),
  echelonOf: () => 1,
  loadsFor: () => eq.dumbbellWeightsKg,
  ...o,
});
const planDay = () => dayOf([exo]);

describe('Acceptation : appliquée à la prochaine séance de l\'exercice', () => {
  it('+1 série : la séance suivante porte la série en plus, marquée comme appliquée', () => {
    const r = applyAccepted(planDay(), env([accepte('serie', 2, { sets: 3 })]));
    expect(r.cancelled).toEqual([]);
    expect(r.applied).toEqual([{ kind: 'serie', movementId: 'm' }]);
    expect(r.day.exercises[0]).toMatchObject({ sets: 3, adaptApplied: 'serie' });
    expect(planDay().exercises[0].sets).toBe(2); // la copie du jour d'origine n'est pas modifiée
  });
  it('variante plus dure : la séance suivante prend la variante acceptée', () => {
    const r = applyAccepted(planDay(), env([accepte('variante', 2, { variantId: 'v2' })]));
    expect(r.day.exercises[0]).toMatchObject({ variantId: 'v2', adaptApplied: 'variante' });
  });
  it('repos : +30 s, dans la plage de la classe seulement', () => {
    expect(applyAccepted(planDay(), env([accepte('repos', 2, { restSec: 120 })])).day.exercises[0]).toMatchObject({ restSec: 120, adaptApplied: 'repos' });
    const over = applyAccepted(planDay(), env([accepte('repos', 2, { restSec: 120 })], { adaptOf: () => ({ restMaxSec: 100 }) }));
    expect(over.cancelled).toEqual([{ kind: 'repos', movementId: 'm', reason: 'limite' }]);
    expect(over.day.exercises[0].restSec).toBe(90);
  });
  it('décharge : -10 % sur la charge de la dernière séance (palier réel), pas de 20 % si un palier à -10 % existe', () => {
    expect(deloadLoad(12.5, eq.dumbbellWeightsKg)).toBe(10);
    expect(deloadLoad(10, eq.dumbbellWeightsKg)).toBeNull(); // 6 kg serait -40 %
    const r = applyAccepted(planDay(), env([accepte('decharge', 2)]));
    expect(r.day.exercises[0]).toMatchObject({ startLoadKg: 10, adaptApplied: 'decharge' });
  });
  it('proposition périmée (programme changé depuis) : annulée, pas appliquée', () => {
    const r = applyAccepted(planDay(), env([accepte('serie', 2, { sets: 4 })]));
    expect(r.cancelled).toEqual([{ kind: 'serie', movementId: 'm', reason: 'programme' }]);
    expect(r.day.exercises[0].sets).toBe(2);
  });
  it('plafond de séries de la fiche : annulée', () => {
    const r = applyAccepted(planDay(), env([accepte('serie', 2, { sets: 3 })], { adaptOf: () => ({ ficheMaxSets: 2 }) }));
    expect(r.cancelled[0]).toMatchObject({ reason: 'limite' });
  });
  it('une fois appliquée ou annulée, la décision n\'est plus en attente', () => {
    const ev: ProgressionEvent[] = [accepte('serie', 2, { sets: 3 })];
    expect(pendingAdapt(ev, 'm')?.kind).toBe('serie');
    expect(pendingAdapt([...ev, { type: 'adapt_applique', kind: 'serie', movementId: 'm', at: at(3) }], 'm')).toBeNull();
    expect(pendingAdapt([...ev, { type: 'adapt_annule', kind: 'serie', movementId: 'm', at: at(3) }], 'm')).toBeNull();
  });
});

describe('Acceptation : jamais au-dessus des gels et règles de sécurité', () => {
  const ev = [accepte('serie', 2, { sets: 3 })];
  const cancelWith = (o: Partial<ApplyEnv>, reason: string) => {
    const r = applyAccepted(planDay(), env(ev, o));
    expect(r.applied).toEqual([]);
    expect(r.cancelled).toEqual([{ kind: 'serie', movementId: 'm', reason }]);
    expect(r.day.exercises[0].sets).toBe(2);
  };
  it('douleur déclarée sur la zone depuis l\'acceptation : annulée (gel)', () => {
    cancelWith({ sets: [...sess('h', 1, { loadKg: 12.5 }), ...sess('p', 3, { pain: true, painZone: 'epaule' }, 1)], sessions: [row('h', 1), row('p', 3)] }, 'gel');
  });
  it('symptôme à la dernière séance : annulée', () => cancelWith({ frozenBySymptom: true }, 'gel'));
  it('grossesse / post-partum : annulée', () => cancelWith({ pregnant: true }, 'grossesse'));
  it('reprise douce : annulée', () => cancelWith({ repriseActive: true }, 'reprise'));
  it('séance manquée depuis : annulée', () => cancelWith({ adaptOf: () => ({ ficheMaxSets: 3, missedSinceLast: true }) }, 'manquee'));
  it('exercice plafonné ou adapté par une case de sécurité : annulée', () => {
    const capped = dayOf([{ ...exo, capped: true }]);
    expect(applyAccepted(capped, env(ev)).cancelled[0]).toMatchObject({ reason: 'gel' });
    const adapted = dayOf([{ ...exo, adaptation: 'charge:legere' }]);
    expect(applyAccepted(adapted, env(ev)).cancelled[0]).toMatchObject({ reason: 'gel' });
  });
  it('variante plus dure : niveau ou matériel qui ne permettent plus : annulée', () => {
    const e = [accepte('variante', 2, { variantId: 'v2' })];
    expect(applyAccepted(planDay(), env(e, { adaptOf: () => ({ level: 'debutant', variants: harder }) })).cancelled[0]).toMatchObject({ reason: 'limite' });
    expect(applyAccepted(planDay(), env(e, { adaptOf: () => ({ level: 'intermediaire', variants: [harder[0]] }) })).cancelled[0]).toMatchObject({ reason: 'limite' });
  });
  it('la décharge aussi est annulée par un gel', () => {
    const r = applyAccepted(planDay(), env([accepte('decharge', 2)], { frozenBySymptom: true }));
    expect(r.cancelled[0]).toMatchObject({ kind: 'decharge', reason: 'gel' });
    expect(r.day.exercises[0].startLoadKg).toBe(12.5);
  });
  it('un seul changement à la fois : tant qu\'un changement accepté attend, aucune autre proposition', () => {
    const s = [...sess('a', 1, { loadKg: 4 }), ...sess('b', 3, { loadKg: 4 })];
    expect(proposeProgression(base(s)).reason).toBe('serie');
    expect(proposeProgression(base(s, { adaptEvents: ev }))).toMatchObject({ action: 'garder' });
    // et le lendemain de l'application : l'exercice marqué n'en reçoit pas de nouvelle
    expect(proposeProgression(base(s, { exercise: { ...exo, adaptApplied: 'serie' } }))).toMatchObject({ action: 'garder', text: ADAPT_TEXT.applied.serie });
  });
});

describe('« Plus tard »', () => {
  const s = [...sess('a', 1, { loadKg: 4 }), ...sess('b', 3, { loadKg: 4 })];
  const later: ProgressionEvent = { type: 'adapt_plus_tard', kind: 'serie', movementId: 'm', at: at(4) };
  it('ne repropose pas avant la séance suivante, puis repropose', () => {
    expect(proposeProgression(base(s)).setsProposal).toBe(3);
    expect(proposeProgression(base(s, { adaptEvents: [later] })).setsProposal).toBeUndefined();
    expect(proposeProgression(base([...s, ...sess('c', 6, { loadKg: 4 })], { adaptEvents: [later] })).setsProposal).toBe(3);
  });
});

describe('Repos : +30 s', () => {
  const fall = (id: string, d: number) => [12, 10, 8].map((reps, i) => log({ sessionId: id, reps, loadKg: 10, completedAt: new Date(Date.parse(day(d)) + i * 60_000).toISOString() }));
  it('proposé quand la dernière série perd plus de 30 % de la première avec une réserve conforme, dans la plage de la classe', () => {
    expect(proposeProgression(base(fall('a', 1)))).toMatchObject({ action: 'hausse', reason: 'repos', restProposal: 120 });
    expect(proposeProgression(base(fall('a', 1), { restMaxSec: 90 })).restProposal).toBeUndefined();
    expect(proposeProgression(base(fall('a', 1), { exercise: { ...exo, supersetGroup: 'g' } })).restProposal).toBeUndefined();
  });
  it('jamais avec une série trop dure (réserve sous la cible)', () => {
    const hard = [12, 10, 8].map((reps, i) => log({ sessionId: 'a', reps, rir: 0, completedAt: new Date(Date.parse(day(1)) + i * 60_000).toISOString() }));
    expect(proposeProgression(base(hard)).restProposal).toBeUndefined();
  });
});

describe('Décharge : déclencheur du §7.7 seulement (baisse nette sur 2 séances de suite à réserve égale)', () => {
  const dropping = (last = {}) => [
    ...sess('a', 1, { loadKg: 12.5, reps: 12 }), ...sess('b', 3, { loadKg: 12.5, reps: 11 }), ...sess('c', 5, { loadKg: 12.5, reps: 10, ...last }),
  ];
  const rows = [row('a', 1), row('b', 3), row('c', 5)];
  const run = (s: SetLog[], o: Partial<ProgressionInput> = {}) => proposeProgression(base(s, { sessions: rows, ...o }));
  it('proposée : charge -10 % au palier réel, texte simple', () => {
    const p = run(dropping());
    expect(p).toMatchObject({ action: 'baisse', reason: 'decharge', deloadProposal: { loadKg: 10 } });
    expect(p.text).toMatch(/10 kg au lieu de 12,5 kg/);
  });
  it('pas de baisse nette : rien', () => {
    expect(run([...sess('a', 1, { loadKg: 12.5, reps: 12 }), ...sess('b', 3, { loadKg: 12.5, reps: 12 }), ...sess('c', 5, { loadKg: 12.5, reps: 11 })]).reason).not.toBe('decharge');
  });
  it('la réserve a augmenté (la personne s\'est ménagée) : rien', () => {
    expect(run(dropping({ rir: 4 })).reason).not.toBe('decharge');
  });
  it('douleur dans la dernière séance : relève du gel douleur, pas de la décharge', () => {
    expect(run(dropping({ pain: true })).reason).not.toBe('decharge');
  });
  it('grossesse, plafond, reprise douce : aucune proposition', () => {
    expect(run(dropping(), { pregnant: true }).reason).not.toBe('decharge');
    expect(run(dropping(), { exercise: { ...exo, capped: true } }).reason).not.toBe('decharge');
    expect(run(dropping(), { repriseActive: true }).reason).not.toBe('decharge');
  });
  it('au plus une proposition par 4 semaines, et « plus tard » vaut proposition', () => {
    const earlier: ProgressionEvent = { type: 'adapt_plus_tard', kind: 'decharge', movementId: 'autre', at: at(2) };
    expect(run(dropping(), { adaptEvents: [earlier] }).reason).not.toBe('decharge');
    expect(run(dropping(), { adaptEvents: [{ ...earlier, at: '2026-08-01T10:00:00.000Z' }] }).reason).toBe('decharge');
  });
  it('acceptée : aucune montée pendant la semaine qui suit, puis plus de blocage', () => {
    const s = dropping();
    const accepted = accepte('decharge', 6);
    const applied: ProgressionEvent = { type: 'adapt_applique', kind: 'decharge', movementId: 'm', at: at(7) };
    expect(run(s, { adaptEvents: [accepted, applied], now: Date.parse(day(8)) })).toMatchObject({ action: 'garder', text: ADAPT_TEXT.applied.decharge });
    expect(run([...s, ...sess('d', 14, { loadKg: 10 })], { adaptEvents: [accepted, applied], now: Date.parse(day(14)) }).text).not.toBe(ADAPT_TEXT.applied.decharge);
  });
});
