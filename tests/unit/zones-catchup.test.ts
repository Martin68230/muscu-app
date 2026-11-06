// Niveau 2, étape 3 : rattrapage des zones en fin de semaine (src/zones/catchup.ts). Fonction pure, fenêtre de semaine, simulation.
import { describe, expect, it } from 'vitest';
import type { ProgramDay, SetLog } from '../../src/data/model';
import { generateProgram, toProgramDays } from '../../src/generator';
import { buildCtx } from '../../src/generator/context';
import type { GeneratorInput } from '../../src/generator/types';
import { doneZoneSets, lastWeekOf, zoneCatchUp, type CatchUpProfile } from '../../src/zones/catchup';
import { capGroupPoints, pointsByZone, zoneCaps } from '../../src/zones/zones';
import { FICHES, mk } from './generator-helpers';

const ctxOf = (input: GeneratorInput) => buildCtx(input);
const prof = (input: GeneratorInput, o: Partial<CatchUpProfile> = {}): CatchUpProfile => ({
  ctx: ctxOf(input), pool: FICHES, repriseActive: false, symptomFrozen: false, painFrozen: () => false, ...o,
});
function weekOf(input: GeneratorInput) {
  const r = generateProgram(input);
  if (!r.ok) throw new Error('programme');
  const days = toProgramDays(r.program).filter((d) => d.exercises.some((e) => e.role !== 'cardio'));
  return { days, durationMin: r.program.durationMin };
}
let n = 0;
const set = (movementId: string, o: Partial<SetLog> = {}): SetLog => ({
  id: `s${n++}`, sessionId: o.sessionId ?? 'x', movementId, variantId: 'v', exerciseIndex: 0, setIndex: 0, targetRepsMin: 8, targetRepsMax: 12,
  reps: 10, loadKg: null, rir: 2, pain: false, comment: '', completedAt: '2026-11-03T10:00:00.000Z', ...o,
} as SetLog);
/** Séances faites telles que prévues (séries de travail), sauf les jours `skip` (séances manquées). */
const doneSets = (days: readonly ProgramDay[], skip: number[] = []): SetLog[] =>
  days.flatMap((d, i) => (skip.includes(i) ? [] : d.exercises.filter((e) => e.role !== 'cardio').flatMap((e) => Array.from({ length: e.sets }, () => set(e.movementId, { sessionId: `d${i}` })))));

const INTER = mk({ level: 'intermediaire', days: 3, dur: 60, goal: 'muscle', profile: 'F', place: 'salle' });

describe('zoneCatchUp : fonction pure', () => {
  it('séances toutes manquées : zones grises, séries en plus sur la séance du jour, +1 au plus par exercice, plafonds tenus', () => {
    const { days, durationMin } = weekOf(INTER);
    const p = prof(INTER);
    const r = zoneCatchUp([], { days, dayIndex: 0, durationMin }, p);
    expect(r.blocked).toBeNull();
    expect(r.low.length).toBeGreaterThan(0);
    expect(r.low.every((z) => z.status === 'gris')).toBe(true);
    expect(r.added.length).toBeGreaterThan(0);
    const ids = r.added.map((a) => a.movementId);
    expect(new Set(ids).size).toBe(ids.length);
    for (const a of r.added) {
      const before = days[0].exercises.find((e) => e.movementId === a.movementId)!;
      const after = r.day.exercises.find((e) => e.movementId === a.movementId)!;
      expect(after.sets).toBe(before.sets + 1);
      expect(after.sets).toBeLessThanOrEqual(4);
      expect(r.low.map((z) => z.zone)).toContain(a.zone);
    }
    // Durée affichée recalculée (multiple de 5 min, jamais plus basse, dans la durée choisie).
    expect(r.day.estimatedMin! % 5).toBe(0);
    expect(r.day.estimatedMin!).toBeGreaterThanOrEqual(days[0].estimatedMin!);
    const short = zoneCatchUp([], { days: days.map((d, i) => (i ? d : { ...d, estimatedMin: 5 })), dayIndex: 0, durationMin }, p);
    expect(short.day.estimatedMin!).toBeGreaterThan(5);
    // Les autres séances ne changent pas ; plafond de 20 par zone et par semaine.
    // (lecture relative, comme zones-check.ts : un groupe déjà au-dessus ne monte pas).
    const pts = (ds: readonly ProgramDay[]) => capGroupPoints(pointsByZone(ds.flatMap((d) => d.exercises.map((e) => ({ ficheId: e.movementId, sets: e.sets }))), FICHES as never));
    const before = pts(days);
    for (const [g, v] of pts([r.day, ...days.slice(1)])) expect(v.points, g).toBeLessThanOrEqual(Math.max(zoneCaps(v.zone).week, before.get(g)!.points));
  });

  it('séance manquée : les zones de cette séance passent en gris ou orange, une semaine complète n’en a pas autant', () => {
    const { days, durationMin } = weekOf(INTER);
    const full = zoneCatchUp(doneSets(days), { days, dayIndex: 0, durationMin }, prof(INTER));
    const missed = zoneCatchUp(doneSets(days, [1]), { days, dayIndex: 0, durationMin }, prof(INTER));
    expect(missed.low.length).toBeGreaterThan(full.low.length);
  });

  it('échauffement, séries douloureuses ou sans répétition ne comptent pas', () => {
    const z = doneZoneSets([
      set('a', { isWarmup: true }), set('a', { pain: true }), set('a', { reps: null }), set('a', { completedAt: null }), set('a'),
    ]);
    expect(z).toHaveLength(1);
  });

  it('gel douleur : aucun ajout sur un exercice gelé ; symptôme : aucun ajout', () => {
    const { days, durationMin } = weekOf(INTER);
    const free = zoneCatchUp([], { days, dayIndex: 0, durationMin }, prof(INTER));
    const frozenId = free.added[0].movementId;
    const r = zoneCatchUp([], { days, dayIndex: 0, durationMin }, prof(INTER, { painFrozen: (e) => e.movementId === frozenId }));
    expect(r.added.map((a) => a.movementId)).not.toContain(frozenId);
    const s = zoneCatchUp([], { days, dayIndex: 0, durationMin }, prof(INTER, { symptomFrozen: true }));
    expect(s.added).toEqual([]);
    expect(s.blocked).toBe('symptome');
  });

  it('protections : débutant, grossesse, reprise douce, épaule au niveau 2 : aucun ajout', () => {
    const cases: [GeneratorInput, Partial<CatchUpProfile>, string][] = [
      [mk({ level: 'debutant', days: 3, dur: 60, profile: 'F', place: 'salle' }), {}, 'debutant'],
      [mk({ level: 'intermediaire', days: 3, dur: 60, profile: 'F', place: 'salle', preg: 'post_partum' }), {}, 'grossesse'],
      [INTER, { repriseActive: true }, 'reprise'],
      [mk({ level: 'intermediaire', days: 3, dur: 60, profile: 'F', place: 'salle', injuries: [['epaule', 2]] }), {}, 'epaule_dos'],
    ];
    for (const [input, o, why] of cases) {
      const { days, durationMin } = weekOf(input);
      const r = zoneCatchUp([], { days, dayIndex: 0, durationMin }, prof(input, o));
      expect(r.added, why).toEqual([]);
      expect(r.blocked).toBe(why);
    }
  });

  it('durée choisie : aucun ajout sans marge ; dose fixe, isolation, charge bloquée, superset, série acceptée : jamais', () => {
    const { days } = weekOf(INTER);
    expect(zoneCatchUp([], { days, dayIndex: 0, durationMin: 1 }, prof(INTER)).added).toEqual([]);
    expect(zoneCatchUp([], { days, dayIndex: 0 }, prof(INTER)).added).toEqual([]);
    const locked = days.map((d, i) => (i ? d : { ...d, exercises: d.exercises.map((e, j) => ({ ...e, ...(j % 2 ? { capped: true } : { adaptApplied: 'serie' as const }) })) }));
    expect(zoneCatchUp([], { days: locked, dayIndex: 0, durationMin: 600 }, prof(INTER)).added).toEqual([]);
  });

  it('plafond de séries par exercice : un exercice déjà à son maximum ne reçoit rien', () => {
    const { days } = weekOf(INTER);
    const full = days.map((d, i) => (i ? d : { ...d, exercises: d.exercises.map((e) => ({ ...e, sets: 4 })) }));
    expect(zoneCatchUp([], { days: full, dayIndex: 0, durationMin: 600 }, prof(INTER)).added).toEqual([]);
  });
});

describe('lastWeekOf : semaine du programme', () => {
  const start = '2026-11-02';
  const at = (d: string) => new Date(`${d}T12:00:00`).getTime();
  it('première semaine : rien', () => expect(lastWeekOf(start, [], at('2026-11-05'))).toBeNull());
  it('semaine 2 : séries de la semaine 1, première séance tant que rien n’est fait cette semaine', () => {
    const sets = [set('a', { completedAt: new Date(at('2026-11-04')).toISOString() }), set('b', { completedAt: new Date(at('2026-11-08')).toISOString() })];
    const r = lastWeekOf(start, sets, at('2026-11-10'))!;
    expect(r.weekSets).toHaveLength(2);
    expect(r.firstOfWeek).toBe(true);
    const r2 = lastWeekOf(start, [...sets, set('c', { completedAt: new Date(at('2026-11-09')).toISOString() })], at('2026-11-10'))!;
    expect(r2.firstOfWeek).toBe(false);
  });
});

describe('simulation : profil 1 (débutant muscle maison, 3 jours) avec une séance manquée', () => {
  const P1: GeneratorInput = {
    profile: { level: 'debutant', daysPerWeek: 3, blockedWeekdays: [], place: 'maison', sessionDurationMin: 45, sports: [] } as unknown as GeneratorInput['profile'],
    equipment: { preset: 'perso', tags: ['halteres', 'elastique', 'chaise', 'poids_du_corps', 'tapis'], disabledImplicit: [], dumbbellWeightsKg: [2, 4, 6, 8, 10, 12, 14], kettlebellWeightsKg: [8, 12] },
    goals: [{ goalKey: 'muscle', rank: 1 }], injuries: [], fiches: FICHES, options: { gagnerDuTemps: true },
  };
  it('zones grises ou orange détectées, mais aucune série ajoutée (débutant)', () => {
    const { days, durationMin } = weekOf(P1);
    const r = zoneCatchUp(doneSets(days, [2]), { days, dayIndex: 0, durationMin }, prof(P1));
    expect(r.low.length).toBeGreaterThan(0);
    expect(r.blocked).toBe('debutant');
    expect(r.added).toEqual([]);
    expect(r.day).toBe(days[0]);
  });
  it('le même profil en intermédiaire (45 min) : séance du jour déjà à 3 séries par exercice et à la durée choisie : rien n’est ajouté', () => {
    // Constat (06/11/2026) : plafond de 3 séries par rôle (C7) et séance déjà à 45 min : le rattrapage par séries ne peut rien ici ;
    // seul un échange d'exercice (non codé) couvrirait ces zones.
    const input = { ...P1, profile: { ...P1.profile, level: 'intermediaire' } } as GeneratorInput;
    const { days, durationMin } = weekOf(input);
    const r = zoneCatchUp(doneSets(days, [2]), { days, dayIndex: 0, durationMin }, prof(input));
    expect(r.blocked).toBeNull();
    expect(r.low.length).toBeGreaterThan(0);
    expect(r.added).toEqual([]);
  });
});
