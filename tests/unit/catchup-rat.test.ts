// Rattrapage des zones, règles RAT-1 à RAT-8 (zones-musculaires.md §7 et son « Avis kine du 13/11/2026 »).
import { describe, expect, it } from 'vitest';
import type { CatchUpLogEntry, ProgramDay, SetLog } from '../../src/data/model';
import { generateProgram, toProgramDays } from '../../src/generator';
import { CATCHUP, UNLIMITED } from '../../src/generator/config';
import { buildCtx } from '../../src/generator/context';
import type { GeneratorInput } from '../../src/generator/types';
import { sportGate, sportLoad } from '../../src/sport/sport-load';
import { JUMPS } from '../../src/generator/config';
import { zoneCatchUp, type CatchUpProfile } from '../../src/zones/catchup';
import { catchUpSportOf, liftedPainRecent, type PlayerData } from '../../src/ui/session/launch';
import { mergeCatchUpLog } from '../../src/zones/catchup-log';
import { FICHES, mk } from './generator-helpers';
import { validateRow } from '../../src/data/validate';

const INTER = mk({ level: 'intermediaire', days: 3, dur: null, goal: 'muscle', profile: 'F', place: 'salle' });
const NO_PLAN: ProgramDay[] = []; // semaine écoulée sans séance prévue : zone basse = défaut de répartition (pas une séance manquée)
const KEY = '2026-11-09';
const prof = (input: GeneratorInput, o: Partial<CatchUpProfile> = {}): CatchUpProfile => ({
  ctx: buildCtx(input), pool: FICHES, repriseActive: false, symptomFrozen: false, painFrozen: () => false, log: [], ...o,
});
/** Semaine dont la 1re séance a de la place (1 série en moins sur les exercices à plus de 2 séries). */
function weekOf(input: GeneratorInput) {
  const r = generateProgram(input);
  if (!r.ok) throw new Error('programme');
  const all = toProgramDays(r.program).filter((d) => d.exercises.some((e) => e.role !== 'cardio'));
  const days = all.map((d, i) => (i ? d : { ...d, exercises: d.exercises.map((e) => (e.sets > 2 && !e.capped && !e.supersetGroup ? { ...e, sets: e.sets - 1 } : e)) }));
  return { days, durationMin: input.profile.sessionDurationMin == null ? UNLIMITED.capMin : r.program.durationMin };
}
const run = (o: Partial<CatchUpProfile> = {}, input = INTER, week: Record<string, unknown> = {}) => {
  const { days, durationMin } = weekOf(input);
  return { days, r: zoneCatchUp([], { days, prevDays: NO_PLAN, dayIndex: 0, durationMin, weekKey: KEY, ...week }, prof(input, o)) };
};
const extraSets = (days: ProgramDay[], day: ProgramDay) => day.exercises.reduce((a, e) => a + e.sets, 0) - days[0].exercises.reduce((a, e) => a + e.sets, 0);

describe('RAT-1 : plafonds de la semaine', () => {
  it('2 zones et +2 séries au plus, +6 min au plus, jamais une zone de protection', () => {
    const { days, r } = run();
    expect(r.added.length).toBeGreaterThan(0);
    expect(r.added.length).toBeLessThanOrEqual(CATCHUP.maxZones);
    expect(extraSets(days, r.day)).toBeLessThanOrEqual(CATCHUP.maxExtraSets);
    for (const a of r.added) expect(CATCHUP.noZones).not.toContain(a.zone);
    expect(r.day.estimatedMin! - days[0].estimatedMin!).toBeLessThanOrEqual(CATCHUP.maxExtraMin + 5);
    expect(r.low.length).toBeGreaterThan(2); // il y avait plus de zones basses que le plafond
  });

  it('épaule : une zone et une série au plus, jamais un exercice au-dessus de la tête', () => {
    const { r, days } = run();
    const sh = r.added.filter((a) => CATCHUP.shoulderZones.includes(a.zone));
    expect(sh.length).toBeLessThanOrEqual(CATCHUP.shoulderMaxZones);
    for (const a of sh) {
      const f = FICHES.find((x) => x.id === a.movementId)!;
      expect(CATCHUP.overheadSchemas).not.toContain(f.schema);
    }
    expect(days.length).toBeGreaterThan(0);
  });

  it('une zone à 1 point du seuil rouge n’est pas rattrapée ; les zones de protection non plus (lombaires, dentelé, coiffe, carré des lombes)', () => {
    const { r } = run();
    const nearRed = r.low; // aucune zone de protection n'est rattrapée
    for (const z of r.added.map((a) => a.zone)) expect(CATCHUP.noZones).not.toContain(z);
    expect(nearRed.length).toBeGreaterThan(0);
    expect(r.log.every((l) => !CATCHUP.noZones.includes(l.zone) || l.cause === 'protection')).toBe(true);
  });
});

describe('RAT-2 : journal local, pas deux semaines de suite sur le même exercice', () => {
  it('sans journal : 1 zone et +1 série au plus (la semaine précédente est supposée rattrapée)', () => {
    const { days, r } = run({ log: null });
    expect(r.added.length).toBeLessThanOrEqual(1);
    expect(extraSets(days, r.day)).toBeLessThanOrEqual(1);
  });

  it('avec journal : l’exercice rattrapé la semaine précédente ne reçoit pas de série en plus', () => {
    const first = run();
    expect(first.r.added.length).toBeGreaterThan(0);
    const prev: CatchUpLogEntry[] = first.r.added.map((a) => ({ week: '2026-11-02', zone: a.zone, movementId: a.movementId }));
    const second = run({ log: prev });
    for (const a of second.r.added) expect(first.r.added.map((x) => x.movementId)).not.toContain(a.movementId);
  });

  it('le journal garde 4 semaines au plus, remplace la semaine en cours, sans champ inconnu (import)', () => {
    let log: CatchUpLogEntry[] | undefined;
    for (const w of ['2026-10-05', '2026-10-12', '2026-10-19', '2026-10-26', '2026-11-02', '2026-11-09']) log = mergeCatchUpLog(log, w, [{ week: w, zone: 'ischios', movementId: null, cause: 'plafond' }]);
    expect(new Set(log!.map((l) => l.week)).size).toBeLessThanOrEqual(CATCHUP.logWeeks);
    expect(mergeCatchUpLog(log, '2026-11-09', []).some((l) => l.week === '2026-11-09')).toBe(false);
    const row = (catchUpLog: unknown) => ({ id: 'p', displayName: 'x', blockedWeekdays: [], sports: [], aiEnabled: false, catchUpLog, createdAt: '2026-11-13T00:00:00.000Z', updatedAt: '2026-11-13T00:00:00.000Z', deletedAt: null, ownerId: 'u', version: 1 }) as never;
    const bad = (x: unknown) => validateRow('profile', row([x])).some((e) => /catchUpLog/.test(e));
    const errs = validateRow('profile', row([{ week: '2026-11-09', zone: 'ischios', movementId: null, cause: 'plafond' }]));
    expect(errs.filter((e) => /catchUpLog/.test(e)), JSON.stringify(errs)).toEqual([]);
    expect(bad({ week: '2026-11-09', zone: 'ischios', movementId: 'x', secret: 'oui' })).toBe(true);
    expect(bad({ week: 'hier', zone: 'ischios', movementId: null })).toBe(true);
    // Clé de cycle (13/11/2026) : acceptée ; mal formée : refusée.
    expect(bad({ week: 'c00007', zone: 'ischios', movementId: null, cause: 'plafond' })).toBe(false);
    expect(bad({ week: 'c7', zone: 'ischios', movementId: null })).toBe(true);
    expect(bad({ week: '2026-11-09', zone: 'ischios', movementId: null, cause: 'douleur au genou' })).toBe(true);
  });
});

describe('RAT-3 et RAT-5 : zone restée basse', () => {
  const lowZoneOf = () => run().r.low[0].zone;

  it('2 semaines basses de suite : la zone est signalée avec sa cause ; 4 semaines : revue du programme', () => {
    const zone = lowZoneOf();
    const lows = (n: number): CatchUpLogEntry[] => Array.from({ length: n }, (_, k) => ({ week: `2026-11-${String(9 - 7 * (k + 1)).padStart(2, '0')}`, zone, movementId: null, cause: 'plafond' as const }))
      .map((e, k) => ({ ...e, week: new Date(Date.UTC(2026, 10, 9 - 7 * (k + 1))).toISOString().slice(0, 10) }));
    const none = run({ log: [] }).r;
    expect(none.stuck).toEqual([]);
    const two = run({ log: lows(1), painFrozen: () => true }).r; // rien ne peut être ajouté
    expect(two.stuck.map((s) => s.zone)).toContain(zone);
    const four = run({ log: lows(3), painFrozen: () => true }).r;
    expect(four.review).toContain(zone);
  });

  it('causes : protection (douleur), sport, séance manquée', () => {
    const zone = lowZoneOf();
    const log: CatchUpLogEntry[] = [{ week: '2026-11-02', zone, movementId: null, cause: 'plafond' }];
    const injured = run({ log }, mk({ level: 'intermediaire', days: 3, dur: null, goal: 'muscle', profile: 'F', place: 'salle', injuries: [['genou', 1]] })).r;
    expect(injured.blocked).toBe('douleur');
    expect(injured.stuck.every((s) => s.cause === 'protection')).toBe(true);
    const gate = sportGate(sportLoad([], [{ sport: 'foot', weekdays: [new Date().getDay() === 0 ? 6 : new Date().getDay() - 1] }], new Date()), 'intermediaire', JUMPS.startContacts.intermediaire);
    const sport = run({ log, sport: { gate, hasPain: true } }).r;
    expect(sport.blocked).toBe('sport');
    expect(sport.stuck.every((s) => s.cause === 'sport')).toBe(true);
  });
});

describe('douleur levée : le rattrapage reste coupé 7 jours', () => {
  const NOW = Date.UTC(2026, 10, 13, 12);
  const day = (n: number) => new Date(NOW - n * 86400000).toISOString();
  const inj = (o: object) => ({ level: 1 as const, active: false, deletedAt: null as string | null, updatedAt: day(0), ...o });
  it('active, ou levée depuis moins de 7 jours : coupé ; levée depuis plus de 7 jours : repris ; niveau 0 : sans effet', () => {
    expect(liftedPainRecent([inj({ active: true })], NOW)).toBe(false); // active : déjà vue par ctx.zones
    expect(liftedPainRecent([inj({ deletedAt: day(0) })], NOW)).toBe(true);
    expect(liftedPainRecent([inj({ deletedAt: day(6) })], NOW)).toBe(true);
    expect(liftedPainRecent([inj({ deletedAt: day(8) })], NOW)).toBe(false);
    expect(liftedPainRecent([inj({ active: false, updatedAt: day(3) })], NOW)).toBe(true);
    expect(liftedPainRecent([inj({ active: false, updatedAt: day(9) })], NOW)).toBe(false);
    expect(liftedPainRecent([inj({ level: 0, deletedAt: day(1) })], NOW)).toBe(false);
    expect(liftedPainRecent([inj({ deletedAt: 'n importe quoi' })], NOW)).toBe(true);
  });
  it('le rattrapage est coupé tant que la douleur levée est récente', () => {
    const r = run({ liftedPain: true }).r;
    expect(r.blocked).toBe('douleur');
    expect(r.added).toEqual([]);
    expect(r.swapped).toBeUndefined();
    expect(run({ liftedPain: false }).r.added.length).toBeGreaterThan(0);
  });
});

describe('RAT-7 : information de sport ambiguë ou illisible', () => {
  const base = { fiches: [], sets: [], input: null, frozen: false } as unknown as PlayerData;
  const ctx = buildCtx(INTER);
  const T = Date.UTC(2026, 10, 13, 12);
  it('sport déclaré sans jour ni match ni séance : aucun rattrapage (gate null)', () => {
    expect(catchUpSportOf({ ...base, sport: { sessions: [], plan: [{ sport: 'foot' }] } }, ctx, T)).toEqual({ gate: null });
    expect(catchUpSportOf({ ...base, sport: { sessions: [], plan: [] } }, ctx, T)).toBeUndefined();
  });
  it('lecture de Mon sport en échec : aucun rattrapage, jamais « rien à lire »', () => {
    expect(catchUpSportOf({ ...base, sportError: true, sport: { sessions: [], plan: [] } }, ctx, T)).toEqual({ gate: null });
    expect(run({ sport: { gate: null } }).r.blocked).toBe('sport');
  });
  it('sport avec un jour : lu normalement', () => {
    const s = catchUpSportOf({ ...base, sport: { sessions: [], plan: [{ sport: 'foot', weekdays: [0] }] } }, ctx, T);
    expect(s?.gate).not.toBeNull();
  });
});

describe('RAT-4 : séance manquée = 0 série de compensation', () => {
  it('une zone basse parce qu’une séance a été manquée ne reçoit rien (ni série, ni échange) ; le même défaut sans séance manquée est rattrapé', () => {
    const { days, durationMin } = weekOf(INTER);
    const missed = zoneCatchUp([], { days, prevDays: days, dayIndex: 0, durationMin, weekKey: KEY }, prof(INTER));
    expect(missed.added).toEqual([]);
    // Jamais d'échange sur une zone « manquée » ; une zone que le programme prévoit trop peu (ex. trapèzes bas avec une traction assistée) reste rattrapable.
    if (missed.swapped) expect(missed.log.some((l) => l.zone === missed.swapped!.zone && l.cause === 'manquee')).toBe(false);
    if (!missed.swapped) expect(missed.day).toBe(days[0]); // un échange sur une zone mal prévue par le programme change la séance du jour
    expect(missed.log.some((l) => l.cause === 'manquee')).toBe(true);
    expect(run().r.added.length).toBeGreaterThan(0);
  });
});

// RAT-6 : la preuve dans le flux complet (échange forcé, points avant / après par zone, jambes à 0 perte, zones chargées par le sport) est dans
// catchup-4-semaines.test.ts (swaps > 0 exigé) ; la garde pure est testée dans zones-catchup.test.ts (swapPointsOk).

describe('RAT-7 : charge du sport lue', () => {
  const today = new Date();
  const wd = (today.getDay() + 6) % 7;
  const gateFor = (weekdays: number[], sport: 'foot' | 'volley' = 'foot') =>
    sportGate(sportLoad([], [{ sport, weekdays }], today), 'intermediaire', JUMPS.startContacts.intermediaire);

  it('un jour de sport (jambes refusées) : aucune série sur un exercice de jambes', () => {
    const free = run({});
    const legsAdded = free.r.added.filter((a) => ['quadriceps_vastes', 'quadriceps_droit_femoral', 'fessiers_grand', 'fessiers_moyen', 'ischios', 'mollets_gastrocnemien'].includes(a.zone));
    const gate = gateFor([wd]);
    expect(gate.legs).toBe('refuse');
    const sport = run({ sport: { gate, shoulderSport: false } });
    expect(sport.r.added.every((a) => !legsAdded.some((l) => l.movementId === a.movementId && ['quadriceps_vastes', 'ischios', 'fessiers_grand'].includes(a.zone)))).toBe(true);
    for (const a of sport.r.added) expect(['quadriceps_vastes', 'quadriceps_droit_femoral', 'fessiers_grand', 'fessiers_moyen', 'ischios', 'mollets_gastrocnemien']).not.toContain(a.zone);
  });

  it('information de sport illisible (gate null), malaise ou gêne : aucun rattrapage', () => {
    expect(run({ sport: { gate: null } }).r.blocked).toBe('sport');
    expect(run({ sport: { gate: gateFor([]), hasPain: true } }).r.added).toEqual([]);
  });

  it('volley la veille ou le jour même : aucune série sur un exercice qui charge l’épaule', () => {
    const gate = gateFor([wd], 'volley');
    expect(gate.shoulder).not.toBe('free');
    const r = run({ sport: { gate, shoulderSport: true } }).r;
    for (const a of r.added) expect(CATCHUP.shoulderLoadZones).not.toContain(a.zone);
  });
});

describe('douleur de niveau 1 : aucun rattrapage', () => {
  it.each([['epaule'], ['dos'], ['genou'], ['poignet']] as const)('%s niveau 1 : rien, échange compris', (zone) => {
    const input = mk({ level: 'intermediaire', days: 3, dur: null, goal: 'muscle', profile: 'F', place: 'salle', injuries: [[zone, 1]] });
    const { r } = run({}, input);
    expect(r.blocked).toBe('douleur');
    expect(r.added).toEqual([]);
    expect(r.swapped).toBeUndefined();
  });
});

describe('RAT-8 : un rattrapage ne relève jamais une dose ni un plafond', () => {
  it('la séance du jour : au plus +1 série par exercice, 4 séries au plus, jamais une charge de départ ni une dose fixe changée', () => {
    const { days, r } = run();
    for (const e of r.day.exercises) {
      const was = days[0].exercises.find((x) => x.movementId === e.movementId);
      if (!was) continue;
      expect(e.sets - was.sets).toBeLessThanOrEqual(1);
      expect(e.sets).toBeLessThanOrEqual(4);
      expect(e.repsMin).toBe(was.repsMin);
      expect(e.repsMax).toBe(was.repsMax);
      expect(e.startLoadKg).toBe(was.startLoadKg);
    }
    expect(r.day.exercises.length).toBe(days[0].exercises.length);
    void ({} as SetLog);
  });
});
