// D26 : core (tronc) et supersets — tests T-D26-01 à T-D26-27 de knowledge/core-et-supersets.md §7, profils PR-A à PR-K (§7.1).
// Fiches forcées par id : fixture qui ne garde, pour les schémas visés, que la fiche imposée (jamais le classement de §6.7).
// Séance numérotée : une paire n'est jouée par le lecteur qu'à partir de la séance 2 (SUP-2 point 7).
// @ts-ignore -- types Node absents du tsconfig de l'app ; ce fichier ne tourne que sous Vitest (Node)
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { InjuryZone, PlannedExercise, SetLog, WorkoutSession } from '../../src/data/model';
import { generateProgram } from '../../src/generator';
import { CORE_CF1_DYNAMIC_IDS, CORE_WHEEL_IDS, HEAVY_TAGS_B1, type CoreFamily } from '../../src/generator/config';
import { buildCtx, isChargeable } from '../../src/generator/context';
import { buildExercise } from '../../src/generator/dose';
import { formAllPairs, type DurSession } from '../../src/generator/duration';
import { resolveFiche } from '../../src/generator/safety';
import type { Fiche, GeneratorInput, GenExercise, GenProgram, SlotKey } from '../../src/generator/types';
import { buildSteps, completeSet, endWarmup, NEUTRAL_CONTEXT, pairsForSession, startSession, type EngineContext } from '../../src/session/engine';
import { proposeProgression } from '../../src/session/history';
import { readFrontmatter } from '../../tools/validate-fiches.mjs';
import { FICHES, mk, msgIds } from './generator-helpers';
import { day as mkDay, ex as mkEx } from './session-helpers';

// ----- Profils exacts (§7.1) -----
const withTags = (i: GeneratorInput, tags: string[]): GeneratorInput => ({ ...i, equipment: { ...i.equipment, preset: 'perso', tags } });
const HOME_A = ['elastique']; // poids du corps, tapis, chaise : implicites
const opts = (o: { gain?: boolean } = {}) => (o.gain === false ? undefined : { gagnerDuTemps: true });

/** Fixture : `only` = schéma -> ids gardés ; `light` = schémas dont les variantes à matériel lourd (liste B1) sont retirées. */
function fixture(f: { only?: Record<string, string[]>; light?: string[]; extra?: Fiche[] } = {}): Fiche[] {
  const out: Fiche[] = [];
  for (const x of FICHES) {
    if (f.only?.[x.schema] && !f.only[x.schema].includes(x.id)) continue;
    if (f.light?.includes(x.schema)) {
      const v = x.variantes.filter((y) => !y.tags.some((t) => HEAVY_TAGS_B1.includes(t)));
      if (!v.length) continue;
      out.push({ ...x, variantes: v.map((y, i) => (i === 0 ? { ...y, echelon: 1 } : y)) });
    } else out.push(x);
  }
  return [...out, ...(f.extra ?? [])];
}
const LEGS_HINGE_ROW = ['squat', 'fente', 'charniere', 'tirage_h', 'tirage_v'];
const FIX_BL = () => fixture({ only: { squat: ['squat-arriere-barre'], fente: [], charniere: ['souleve-de-terre-barre'] } });
const FIX_BH = () => fixture({ only: { squat: ['squat-gobelet'], charniere: ['souleve-de-terre-roumain-halteres'] }, light: LEGS_HINGE_ROW });

const salle = (o: Parameters<typeof mk>[0]) => mk({ profile: 'F', place: 'salle', ...o });
const PR = {
  A: (o: { days?: number; dur?: number; gain?: boolean } = {}) =>
    withTags(mk({ level: 'debutant', goal: 'sante', days: o.days ?? 2, dur: o.dur ?? 30, options: opts(o) }), HOME_A),
  B: (o: { dur?: number; fiches?: Fiche[]; injuries?: [InjuryZone, 1 | 2 | 3][]; preg?: 'post_partum' } = {}) =>
    salle({ level: 'intermediaire', goal: 'muscle', days: 3, dur: o.dur ?? 60, fiches: o.fiches, injuries: o.injuries, preg: o.preg, options: opts() }),
  C: (o: { dur?: number; fiches?: Fiche[] } = {}) =>
    withTags(mk({ level: 'intermediaire', goal: 'force', days: 3, dur: o.dur ?? 45, fiches: o.fiches, options: opts() }), ['halteres', 'banc', 'elastique']),
  D: (o: { dur?: number; fiches?: Fiche[] } = {}) => salle({ level: 'intermediaire', goal: 'muscle', days: 2, dur: o.dur ?? 30, fiches: o.fiches, options: opts() }),
  E: (o: { dur?: number } = {}) => salle({ level: 'avance', goal: 'force', days: 3, dur: o.dur ?? 60, fiches: FIX_BL(), options: opts() }),
  F: (o: { dur?: number; fiches?: Fiche[] } = {}) =>
    withTags(mk({ level: 'intermediaire', goal: 'sante', days: 3, dur: o.dur ?? 45, fiches: o.fiches, dumbbells: [2, 4, 6], options: opts() }), ['elastique', 'halteres']),
  G: (level: 'debutant' | 'intermediaire' = 'debutant') =>
    withTags(mk({ level, goal: 'sante', days: 3, dur: 45, preg: 'enceinte', options: opts() }), HOME_A),
  J: (fiches?: Fiche[]) => withTags(mk({ level: 'intermediaire', goal: 'sante', days: 3, dur: 45, injuries: [['genou', 1]], fiches, options: opts() }), HOME_A),
};

const prog = (i: GeneratorInput): GenProgram => {
  const r = generateProgram(i);
  if (!r.ok) throw new Error(`programme refusé : ${r.code}`);
  return r.program;
};
const NOT_FLOOR = ['extension-dorsale-ballon', 'copenhague-court'];
const isCore = (e: GenExercise) => !!e.coreFamily && !NOT_FLOOR.includes(e.ficheId);
const floorEx = (e: GenExercise) => e.slot === 'tronc' && isCore(e);
const coreWeek = (p: GenProgram) => ({
  sessions: p.sessions.filter((s) => s.exercises.some(floorEx)).length,
  sets: p.sessions.flatMap((s) => s.exercises.filter(floorEx)).reduce((a, e) => a + e.sets, 0),
});
const families = (p: GenProgram): CoreFamily[] => p.sessions.flatMap((s) => s.exercises.filter(floorEx).map((e) => e.coreFamily!));
const pairsOf = (p: GenProgram) =>
  p.sessions.flatMap((s) => {
    const g = new Map<string, GenExercise[]>();
    for (const e of s.exercises) if (e.supersetGroup) g.set(e.supersetGroup, [...(g.get(e.supersetGroup) ?? []), e]);
    return [...g.values()];
  });
const SAFE: CoreFamily[] = ['gainage', 'anti_rotation'];

// ----- Construction directe d'une séance (T-D26-11b, 16, 24) -----
function genEx(input: GeneratorInput, ficheId: string, slot: SlotKey, fiches: Fiche[] = input.fiches): GenExercise {
  const ctx = buildCtx({ ...input, fiches });
  const f = fiches.find((x) => x.id === ficheId)!;
  const c = resolveFiche(f, ctx).candidates[0];
  if (!c) throw new Error(`${ficheId} non admissible`);
  return buildExercise(c, slot, 'a', ctx);
}
const durSession = (exercises: GenExercise[], level: 'debutant' | 'intermediaire' = 'intermediaire'): DurSession<GenExercise> => ({
  label: 'A', days: 3, level, pregnant: false, exercises, e1Sec: 120, e2Count: 2,
});
const paired = (s: DurSession<GenExercise>) => formAllPairs(s).exercises.filter((e) => e.supersetGroup).map((e) => e.ficheId);
const withLine = (f: Fiche, zone: string, action: 'adapter' | 'retirer' | 'garder', id: string): Fiche => ({
  ...f,
  id,
  securite: {
    ...f.securite,
    zones: { ...f.securite.zones, [zone]: [0, 1, 2].map(() => (action === 'adapter' ? { action, amplitude: 'reduite' } : { action })) },
  },
});

describe('T-D26-01 à 06 : plancher, familles, retrait, place, plafonds, débutant', () => {
  it('T-D26-01 : au moins 2 séances et 4 séries de core par semaine, aux durées 20 / 30 / 45 / 60 min', () => {
    const cases: [string, (dur: number) => GeneratorInput][] = [
      ['PR-A', (dur) => PR.A({ dur })], ['PR-B-L', (dur) => PR.B({ dur, fiches: FIX_BL() })], ['PR-B-H', (dur) => PR.B({ dur, fiches: FIX_BH() })],
      ['PR-C', (dur) => PR.C({ dur })], ['PR-D', (dur) => PR.D({ dur })], ['PR-E', (dur) => PR.E({ dur })], ['PR-F', (dur) => PR.F({ dur })],
      // PR-H, PR-I : « ≥ 2 séances et ≥ 4 séries avec fiches CF1/CF2 admissibles ».
      ['PR-H', (dur) => PR.B({ dur, injuries: [['dos', 1]] })], ['PR-I', (dur) => PR.B({ dur, injuries: [['dos', 2]] })],
    ];
    for (const [name, mkIn] of cases)
      for (const dur of [20, 30, 45, 60]) {
        const p = prog(mkIn(dur));
        const w = coreWeek(p);
        expect(w.sessions, `${name} ${dur} min`).toBeGreaterThanOrEqual(2);
        expect(w.sets, `${name} ${dur} min`).toBeGreaterThanOrEqual(4);
        if (name === 'PR-I') expect(families(p).every((f) => SAFE.includes(f))).toBe(true);
        expect(msgIds(p)).not.toContain('V-MSG-TRONC');
      }
  }, 120_000);

  it('T-D26-02 : nombre exact de familles, jamais deux séances de core de suite avec la même famille', () => {
    const exp: [string, GeneratorInput, number, number][] = [
      ['PR-A', PR.A(), 2, 2], ['PR-B-H', PR.B({ fiches: FIX_BH() }), 3, 3], ['PR-B-L', PR.B({ fiches: FIX_BL() }), 3, 2], ['PR-C', PR.C(), 2, 2],
      ['PR-E', PR.E(), 2, 2], ['PR-F', PR.F(), 3, 3], ['PR-I', PR.B({ injuries: [['dos', 2]] }), 3, 2],
    ];
    for (const [name, input, nSessions, nFam] of exp) {
      const p = prog(input);
      const fams = families(p);
      expect(fams.length, name).toBe(nSessions);
      expect(new Set(fams).size, name).toBe(nFam);
      for (let i = 1; i < fams.length; i++) expect(fams[i], `${name} séance ${i}`).not.toBe(fams[i - 1]);
    }
    expect(families(prog(PR.A()))).toEqual(['gainage', 'anti_rotation']);
    const bl = prog(PR.B({ fiches: FIX_BL() })).sessions.map((s) => s.exercises.find(floorEx)!);
    expect(bl.map((e) => e.coreFamily)).toEqual(['gainage', 'anti_rotation', 'gainage']);
    expect(bl[2].ficheId).not.toBe(bl[0].ficheId); // CF1 avec une fiche différente
    const h = prog(PR.B({ injuries: [['dos', 1]] }));
    expect(new Set(families(h)).size).toBeGreaterThanOrEqual(2);
  });

  it('T-D26-03 : core jamais retiré avant les accessoires (PR-D, 30 puis 20 min, squat-gobelet forcé)', () => {
    const fiches = fixture({ only: { squat: ['squat-gobelet'] } });
    for (const dur of [30, 20]) {
      const p = prog(PR.D({ dur, fiches }));
      for (const s of p.sessions) {
        const core = s.exercises.find(floorEx);
        expect(core, `${s.label} ${dur}`).toBeTruthy();
        expect(core!.sets).toBe(2);
        expect(s.removedCore).not.toContain('tronc');
      }
      expect(coreWeek(p)).toEqual({ sessions: 2, sets: 4 });
      if (dur === 20) for (const s of p.sessions) expect(s.exercises.some((e) => ['poussee_2', 'tirage_2', 'jambes_2'].includes(e.slot))).toBe(false);
    }
  });

  it('T-D26-04 : tout exercice de core est après les piliers, tirage_1 et charnière', () => {
    for (const input of [PR.B({ fiches: FIX_BL() }), PR.B({ fiches: FIX_BH() }), PR.C(), PR.E()]) {
      for (const s of prog(input).sessions) {
        const idx = (pred: (e: GenExercise) => boolean) => s.exercises.map((e, i) => (pred(e) ? i : -1)).filter((i) => i >= 0);
        const main = idx((e) => ['jambes_genou', 'poussee_1', 'tirage_1', 'charniere'].includes(e.slot));
        const core = idx((e) => isCore(e) || ['gainage', 'anti_rotation', 'rotation'].includes(e.schema));
        for (const c of core) expect(c).toBeGreaterThan(Math.max(...main));
      }
    }
  });

  it('T-D26-05 : au plus 2 exercices et 6 séries de core par séance, 12 par semaine, un seul CF3 par séance', () => {
    for (const input of [PR.B({ fiches: FIX_BH() }), PR.C(), PR.F()]) {
      const p = prog(input);
      let week = 0;
      for (const s of p.sessions) {
        const core = s.exercises.filter(isCore);
        expect(core.length).toBeLessThanOrEqual(2);
        expect(core.reduce((a, e) => a + e.sets, 0)).toBeLessThanOrEqual(6);
        expect(core.filter((e) => e.coreFamily === 'rotation').length).toBeLessThanOrEqual(1);
        week += core.reduce((a, e) => a + e.sets, 0);
      }
      expect(week).toBeLessThanOrEqual(12);
    }
  });

  it('T-D26-06 : débutant : ni CF3, CF4, CF5, ni roue, ni bûcheron, ni crunch ; aucune variante chargeable ; maintiens de 20 s', () => {
    for (const days of [2, 3]) {
      const p = prog(PR.A({ days }));
      for (const e of p.sessions.flatMap((s) => s.exercises).filter(isCore)) {
        expect(SAFE).toContain(e.coreFamily);
        expect([...CORE_WHEEL_IDS, 'rotation-bucheron', 'bucheron-ballon-lest', 'crunch-bicyclette']).not.toContain(e.ficheId);
        expect(e.chargeable).toBe(false);
        if (e.unit === 'sec') expect(e.holdSec).toBe(20);
      }
    }
  });
});

describe('T-D26-07 à 12 : supersets (SUP-0 à SUP-6)', () => {
  const ACC = ['poussee_2', 'tirage_2', 'jambes_2', 'tronc'];
  it('T-D26-07 / 08 / 09 / 17 : paires éligibles (SUP-0), jamais lourdes, valides (SUP-1, SUP-2, SUP-5)', () => {
    let n = 0;
    for (const input of [PR.B({ fiches: FIX_BH() }), PR.B({ fiches: FIX_BL() }), PR.C(), PR.E(), PR.F(), PR.D()]) {
      for (const [a, b] of pairsOf(prog(input))) {
        n++;
        for (const e of [a, b]) {
          expect(ACC).toContain(e.slot);
          expect(e.tags.some((t) => HEAVY_TAGS_B1.includes(t))).toBe(false);
          expect(['poussee_v', 'saut', 'porte', 'cardio']).not.toContain(e.schema);
          expect(e.niveau).not.toBe('avance');
          expect(e.capped || e.adaptations.length > 0).toBe(false);
        }
        expect(a.musclesPrincipaux.some((m) => b.musclesPrincipaux.includes(m))).toBe(false);
        expect(a.schema).not.toBe(b.schema);
        expect(a.slot === 'jambes_2' && b.slot === 'jambes_2').toBe(false);
        expect(!!a.coreFamily && !!b.coreFamily).toBe(false);
      }
    }
    expect(n).toBeGreaterThan(0); // au moins une paire (PR-C ou PR-F) ; une salle sans paire n'est pas une erreur
  });

  it('T-D26-10 / 11a : aucune paire pour un débutant (PR-A) ni en grossesse (PR-G)', () => {
    for (const days of [2, 3]) for (const dur of [20, 30, 45, 60]) expect(pairsOf(prog(PR.A({ days, dur })))).toEqual([]);
    expect(pairsOf(prog(withTags(PR.A({ dur: 60 }), ['elastique', 'halteres', 'banc'])))).toEqual([]);
    expect(pairsOf(prog(PR.G()))).toEqual([]);
    expect(pairsOf(prog(PR.G('intermediaire')))).toEqual([]);
  });

  it('T-D26-11b : PR-J, fiche jambes_2 adaptée (genou) jamais en paire ; P1 pompe + rowing-elastique reste formée', () => {
    const input = PR.J();
    const test = withLine(FICHES.find((f) => f.id === 'squat-poids-du-corps')!, 'genou', 'adapter', 'test-jambes-genou-adapter');
    const fiches = [...FICHES, test];
    // La vraie fiche `pompe` a une case genou niveau 1 « adapter: appui:coussin » : elle sort elle-même des paires (SUP-2 point 5).
    expect(genEx(input, 'pompe', 'poussee_2', fiches).adaptations).toContain('appui:coussin');
    const ctx = buildCtx({ ...input, fiches });
    const push = fiches.find((f) => f.schema === 'poussee_h' && resolveFiche(f, ctx).candidates.some((c) => !c.adapted && !c.capped && !isChargeable(c.variant)))!;
    const s = durSession([
      genEx(input, push.id, 'poussee_2', fiches), genEx(input, 'rowing-elastique', 'tirage_2', fiches),
      genEx(input, 'test-jambes-genou-adapter', 'jambes_2', fiches), genEx(input, 'bird-dog', 'tronc', fiches),
    ]);
    expect(s.exercises[2].adaptations.length).toBeGreaterThan(0);
    expect(paired(s).sort()).toEqual([push.id, 'rowing-elastique'].sort());
  });

  it('T-D26-12 : PR-F, paire P1 pompe + rowing-elastique (repos 60 s) : transition 15 s, repos de paire 60 s, jamais moins', () => {
    for (const rest of [60, 45]) {
      const steps = buildSteps([
        mkEx({ variantId: 'pompe-base', movementId: 'pompe', supersetGroup: 'A-P1', restSec: rest, sets: 2 }),
        mkEx({ variantId: 'rowing-elastique-assis', movementId: 'rowing-elastique', supersetGroup: 'A-P1', restSec: rest, sets: 2, slot: 'tirage_2' }),
      ]).filter((s) => s.kind === 'work');
      expect(steps[0]).toMatchObject({ restAfterSec: 15, restKind: 'transition' });
      expect(steps[1]).toMatchObject({ restAfterSec: 60, restKind: 'repos' });
    }
    const p = prog(PR.F());
    for (const [a, b] of pairsOf(p)) {
      expect(a.restSec).toBe(b.restSec);
      expect(a.restSec).toBeGreaterThanOrEqual(60);
    }
  });
});

describe('T-D26-13 et 22, 23 : lecteur de séance (SUP-2 point 7, SUP-8) et progression en paire', () => {
  const A = mkEx({ variantId: 'pompe-base', movementId: 'pompe', supersetGroup: 'A-P1', restSec: 60, sets: 3, startLoadKg: null });
  const B = mkEx({ variantId: 'rowing-elastique-assis', movementId: 'rowing-elastique', supersetGroup: 'A-P1', restSec: 60, sets: 3, slot: 'tirage_2', startLoadKg: null });
  const ctxZone = (carried: boolean): EngineContext => ({ ...NEUTRAL_CONTEXT, zoneOnFiche: () => carried });
  const painOnA = (ctx: EngineContext, zone: InjuryZone | 'inconnu') => {
    const d = mkDay([A, B]);
    const st = endWarmup(d, startSession(d, 0));
    return completeSet(d, st, { pain: true, painZone: zone }, ctx, 1000);
  };

  it('T-D26-13a : zone absente de la fiche de B : paire dissoute, A arrêté, « Continuer seul » et « Passer au suivant »', () => {
    const r = painOnA(ctxZone(false), 'cheville');
    expect(r.entry.pain).toBe(true);
    expect(r.state.skipped).toEqual([0]);
    expect(r.pairPain).toEqual({ partner: 1, canContinue: true });
    // B continue seul : après sa série, repos complet (pas la transition de 15 s).
    const d = mkDay([A, B]);
    const r2 = completeSet(d, r.state, { reps: 10, rir: 2 }, NEUTRAL_CONTEXT, 2000);
    expect(r2.state.rest).toMatchObject({ kind: 'repos', totalMs: 60_000 });
  });

  it('T-D26-13b : zone portée par la fiche de B, ou inconnue : seulement « Passer au suivant »', () => {
    expect(painOnA(ctxZone(true), 'epaule').pairPain).toEqual({ partner: 1, canContinue: false });
    expect(painOnA(ctxZone(false), 'inconnu').pairPain).toEqual({ partner: 1, canContinue: false });
  });

  // Séance passée (paire jouée) : A a eu « ça fait mal » (zone épaule).
  const mkSet = (sessionId: string, movementId: string, variantId: string, i: number, o: Partial<SetLog> = {}): SetLog =>
    ({
      id: `${sessionId}-${movementId}-${i}`, ownerId: 'u', createdAt: 'x', updatedAt: 'x', rev: 1, deletedAt: null, syncedAt: null, sessionId, movementId, variantId,
      exerciseIndex: 0, setIndex: i, targetRepsMin: 10, targetRepsMax: 12, reps: 12, loadKg: 4, rir: 3, pain: false, comment: '',
      completedAt: `2026-10-2${sessionId.slice(-1)}T08:1${i}:00.000Z`, isCalibration: false, isWarmup: false, ...o,
    }) as SetLog;
  const sess = (id: string, exercises: PlannedExercise[]): WorkoutSession =>
    ({ id, status: 'faite', plan: { dayIndex: 0, label: 'A', exercises } }) as unknown as WorkoutSession;
  const LA = mkEx({ variantId: 'dev-h', movementId: 'developpe-h', supersetGroup: 'A-P1', restSec: 60, sets: 2, repsMin: 10, repsMax: 12, rirTarget: 2, startLoadKg: 4 });
  const LB = mkEx({ variantId: 'row-h', movementId: 'rowing-h', supersetGroup: 'A-P1', restSec: 60, sets: 2, repsMin: 10, repsMax: 12, rirTarget: 2, startLoadKg: 4, slot: 'tirage_2' });
  const eq = { dumbbellWeightsKg: [2, 4, 6], kettlebellWeightsKg: [], platesKg: [] };

  it('T-D26-13 point 3 : aucune hausse pour A ; B sans hausse si la zone est portée par sa fiche', () => {
    const sets = [
      mkSet('s1', 'developpe-h', 'dev-h', 0, { pain: true, painZone: 'epaule' }),
      mkSet('s1', 'rowing-h', 'row-h', 0), mkSet('s1', 'rowing-h', 'row-h', 1),
    ];
    const sessions = [sess('s1', [LA, LB])];
    const base = { sets, pregnant: false, variantTags: ['halteres'], equipment: eq, sessions };
    expect(proposeProgression({ ...base, exercise: LA }).action).not.toBe('hausse');
    expect(proposeProgression({ ...base, exercise: LB, zonesOfFiche: ['epaule'] }).reason).toBe('douleur');
    expect(proposeProgression({ ...base, exercise: LB, zonesOfFiche: ['genou'] }).reason).not.toBe('douleur');
  });

  it('T-D26-23 : aucune hausse de charge pour un exercice en paire ; hors paire, la hausse redevient possible', () => {
    const sets = [mkSet('s2', 'developpe-h', 'dev-h', 0), mkSet('s2', 'developpe-h', 'dev-h', 1)];
    const base = { sets, pregnant: false, variantTags: ['halteres'], equipment: eq, sessions: [sess('s2', [LA, LB])] };
    const inPair = proposeProgression({ ...base, exercise: LA });
    expect(inPair.action).toBe('garder');
    expect(inPair.reason).toBe('paire');
    expect(inPair.loadKg).toBe(4);
    const alone = proposeProgression({ ...base, exercise: { ...LA, supersetGroup: null }, sessions: [sess('s2', [{ ...LA, supersetGroup: null }])] });
    expect(alone.action).toBe('hausse');
  });

  it('T-D26-22 : séance 1 étalonnage -> séparés ; séance 2 -> paire ; séance 3 (A en retour après gêne) -> séparés ; séance 4 -> paire', () => {
    const d = mkDay([A, B]);
    const ctxOf = (calib: boolean, painA: boolean): EngineContext => ({
      ...NEUTRAL_CONTEXT, isCalibration: () => calib, afterPain: (ex) => painA && ex.movementId === 'pompe',
    });
    const s1 = pairsForSession(d, ctxOf(true, false));
    expect(s1.exercises.map((e) => [e.supersetGroup, e.pairDeferred])).toEqual([[null, 'etalonnage'], [null, 'etalonnage']]);
    expect(buildSteps(s1.exercises).every((s) => s.restKind === 'repos')).toBe(true);
    expect(pairsForSession(d, ctxOf(false, false))).toBe(d);
    expect(pairsForSession(d, ctxOf(false, true)).exercises.map((e) => e.pairDeferred)).toEqual(['gene', 'gene']);
    expect(pairsForSession(d, ctxOf(false, false)).exercises.every((e) => e.supersetGroup === 'A-P1')).toBe(true);
  });
});

describe('T-D26-14 à 21, 24 à 27 : sécurité (dos, grossesse, CORE-ORD-4), P3, exclusions par id, niveau', () => {
  it('T-D26-14 : dos niveau 3 : aucune fiche de core ; R3 à la place du message neutre ; aucune erreur', () => {
    const r = generateProgram(PR.B({ fiches: FIX_BH(), injuries: [['dos', 3]] }));
    if (!r.ok) return expect(r.code).toBe('PRO');
    expect(r.program.sessions.flatMap((s) => s.exercises).filter(isCore)).toEqual([]);
    expect(msgIds(r.program)).toContain('R3');
    expect(msgIds(r.program)).not.toContain('V-MSG-TRONC');
  });

  it('T-D26-15 : CORE-ORD-4 (a), (b), (c) : core CF1/CF2, maintien <= 30 s, ni roue ni CF1 dynamique ; contre-exemple sans restriction', () => {
    const check = (p: GenProgram, label: string) => {
      const s = p.sessions.find((x) => x.label === label)!;
      const core = s.exercises.filter(isCore);
      expect(core.length).toBeGreaterThan(0);
      for (const e of core) {
        expect(SAFE).toContain(e.coreFamily);
        if (e.unit === 'sec') expect(e.holdSec!).toBeLessThanOrEqual(30);
        expect([...CORE_WHEEL_IDS, 'genoux-poitrine-ballon', 'planche-cercles-ballon']).not.toContain(e.ficheId);
      }
    };
    check(prog(PR.B({ fiches: fixture({ only: { charniere: ['souleve-de-terre-barre'] }, light: ['squat', 'fente', 'tirage_h', 'tirage_v'] }) })), 'A');
    check(prog(PR.B({ fiches: fixture({ only: { squat: ['squat-arriere-barre'], fente: [] }, light: ['charniere', 'tirage_h', 'tirage_v'] }) })), 'B');
    check(prog(PR.B({ fiches: fixture({ only: { tirage_h: ['rowing-barre-penche'] }, light: ['squat', 'fente', 'charniere', 'tirage_v'] }) })), 'C');
    const contre = prog(PR.B({ fiches: FIX_BH() }));
    expect(families(contre).some((f) => !SAFE.includes(f))).toBe(true);
  });

  it('T-D26-16 : SUP-2 point 4 : jamais core + fiche dont la ligne dos n’est pas « garder », ni core + rowing penché', () => {
    const input = PR.B({ fiches: FIX_BH() });
    const test = withLine(FICHES.find((f) => f.id === 'squat-poids-du-corps')!, 'dos', 'adapter', 'test-jambes-dos-adapter');
    const fiches = [...FICHES, test];
    const s = durSession([genEx(input, 'test-jambes-dos-adapter', 'jambes_2', fiches), genEx(input, 'bird-dog', 'tronc', fiches)]);
    expect(paired(s)).toEqual([]);
    const s2 = durSession([genEx(input, 'rowing-buste-penche-halteres', 'tirage_2', fiches), genEx(input, 'bird-dog', 'tronc', fiches)]);
    expect(paired(s2)).toEqual([]);
  });

  it('T-D26-24 : P3 plus strict que SUP-0 : jambes_2 aux haltères jamais apparié ; au poids du corps : P3 formée', () => {
    const input = PR.C();
    expect(paired(durSession([genEx(input, 'squat-gobelet', 'jambes_2'), genEx(input, 'bird-dog', 'tronc')]))).toEqual([]);
    expect(paired(durSession([genEx(input, 'squat-poids-du-corps', 'jambes_2'), genEx(input, 'bird-dog', 'tronc')])).sort()).toEqual(['bird-dog', 'squat-poids-du-corps']);
    // Débutant : jamais (SUP-4), même au poids du corps.
    expect(paired(durSession([genEx(input, 'squat-poids-du-corps', 'jambes_2'), genEx(input, 'bird-dog', 'tronc')], 'debutant'))).toEqual([]);
  });

  it('T-D26-18 : dos niveau 1 : ni roue, ni rotation chargée, au plus 8 répétitions par côté, ni rotation-assise-ballon-lest, ni crunch', () => {
    const p = prog(PR.B({ injuries: [['dos', 1]] }));
    for (const e of p.sessions.flatMap((s) => s.exercises).filter(isCore)) {
      expect([...CORE_WHEEL_IDS, 'rotation-assise-ballon-lest', 'crunch-bicyclette']).not.toContain(e.ficheId);
      if (e.coreFamily === 'rotation') {
        expect(e.chargeable).toBe(false);
        expect(e.repsMax).toBeLessThanOrEqual(8);
      }
    }
  });

  it('T-D26-19 : dos niveau 2 : CF1/CF2 seulement, maintien <= 20 s, capped, aucune CF1 dynamique, 2 familles', () => {
    const p = prog(PR.B({ injuries: [['dos', 2]] }));
    const core = p.sessions.flatMap((s) => s.exercises).filter(isCore);
    for (const e of core) {
      expect(SAFE).toContain(e.coreFamily);
      expect(e.capped).toBe(true);
      if (e.unit === 'sec') expect(e.holdSec!).toBeLessThanOrEqual(20);
      expect([...CORE_WHEEL_IDS, ...CORE_CF1_DYNAMIC_IDS]).not.toContain(e.ficheId);
    }
    expect(new Set(families(p)).size).toBe(2);
    expect(coreWeek(p).sessions).toBeGreaterThanOrEqual(2);
    expect(coreWeek(p).sets).toBeGreaterThanOrEqual(4);
  });

  it('T-D26-20 : précédence table / fiche : une case « retirer » l’emporte ; une famille retirée par la table n’est pas rétablie par « garder »', () => {
    const retire = withLine(FICHES.find((f) => f.id === 'bird-dog')!, 'dos', 'retirer', 'test-core-dos-retire');
    const garder = withLine(FICHES.find((f) => f.id === 'rotation-bucheron')!, 'dos', 'garder', 'rotation-bucheron');
    const fiches = [...FICHES.filter((f) => f.id !== 'rotation-bucheron'), retire, garder];
    const ids = prog(PR.B({ fiches, injuries: [['dos', 2]] })).sessions.flatMap((s) => s.exercises.map((e) => e.ficheId));
    expect(ids).not.toContain('test-core-dos-retire');
    expect(ids).not.toContain('rotation-bucheron');
  });

  it('T-D26-21 / D3 : grossesse : aucun plancher, 1 série (débutante) ou 2, ni CF3/CF4/CF5 ni fiches G4 ; sinon message neutre', () => {
    for (const level of ['debutant', 'intermediaire'] as const) {
      const p = prog(PR.G(level));
      const core = p.sessions.flatMap((s) => s.exercises).filter(isCore);
      for (const e of core) {
        expect(SAFE).toContain(e.coreFamily);
        expect(e.sets).toBe(level === 'debutant' ? 1 : 2);
        expect(['planche', 'planche-laterale', 'planche-touche-epaule', 'dead-bug', 'gainage-creux']).not.toContain(e.ficheId);
      }
      if (!core.length) expect(msgIds(p)).toContain('V-MSG-TRONC');
      expect(p.messages.some((m) => m.id === 'V-MSG-FREQ' && m.data?.gg === 'GG5')).toBe(false);
    }
    // Aucune fiche compatible : message neutre, aucune alerte de fréquence pour le tronc.
    const none = prog(withTags(mk({ level: 'debutant', goal: 'sante', days: 3, preg: 'enceinte', fiches: FICHES.filter((f) => !['anti_rotation', 'gainage'].includes(f.schema)) }), HOME_A));
    expect(msgIds(none)).toContain('V-MSG-TRONC');
    expect(none.messages.some((m) => m.id === 'V-MSG-FREQ' && m.data?.gg === 'GG5')).toBe(false);
  });

  it('T-D26-25 : post-partum (PR-K) : aucun saut, aucune paire, core CF1/CF2 avec ligne Grossesse garder/adapter seulement', () => {
    const p = prog(PR.B({ preg: 'post_partum' }));
    expect(pairsOf(p)).toEqual([]);
    for (const e of p.sessions.flatMap((s) => s.exercises)) {
      expect(e.schema).not.toBe('saut');
      if (isCore(e)) {
        expect(SAFE).toContain(e.coreFamily);
        expect(FICHES.find((f) => f.id === e.ficheId)!.securite.grossesse.action).not.toBe('retirer');
      }
    }
    if (!p.sessions.some((s) => s.exercises.some(isCore))) expect(msgIds(p)).toContain('V-MSG-TRONC');
  });

  it('T-D26-26 : copenhague-court jamais dans le tronc ; extension-dorsale-ballon jamais en paire ni dans le plancher', () => {
    for (const input of [PR.F(), PR.B({ fiches: FIX_BH() }), PR.B()]) {
      const p = prog(input);
      for (const e of p.sessions.flatMap((s) => s.exercises)) {
        if (e.slot === 'tronc') expect(e.ficheId).not.toBe('copenhague-court');
        if (e.ficheId === 'extension-dorsale-ballon') expect(e.supersetGroup).toBeNull();
      }
    }
  });

  it('T-D26-27 : niveau_min relevé à intermédiaire (décision du kiné) ; aucun débutant ne les reçoit', () => {
    const paths: Record<string, string> = {
      'rotation-bucheron': 'knowledge/exercices/vague1/lot-03/rotation-bucheron.md',
      'bucheron-ballon-lest': 'knowledge/exercices/vague1/lot-08-ballons-roue/bucheron-ballon-lest.md',
      'crunch-bicyclette': 'knowledge/exercices/vague1/lot-03/crunch-bicyclette.md',
    };
    for (const [id, path] of Object.entries(paths)) {
      expect(readFrontmatter(path).niveau_min, id).toBe('intermediaire');
      expect(FICHES.find((f) => f.id === id)!.niveauMin).toBe('intermediaire');
    }
    const ids = [2, 3].flatMap((days) => prog(PR.A({ days })).sessions.flatMap((s) => s.exercises.map((e) => e.ficheId)));
    for (const id of Object.keys(paths)) expect(ids).not.toContain(id);
  });

  it('famille_core posée sur les 24 fiches de l’inventaire (copenhague-court sans famille)', () => {
    const inv = readFileSync('knowledge/famille-core-inventaire.md', 'utf8');
    const withFamily = FICHES.filter((f) => f.familleCore);
    expect(withFamily.length).toBe(24);
    expect(FICHES.find((f) => f.id === 'copenhague-court')?.familleCore).toBeUndefined();
    for (const f of withFamily) expect(inv).toContain(`| ${f.id} |`);
  });
});
