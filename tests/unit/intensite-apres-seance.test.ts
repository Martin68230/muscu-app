// Lot cohérence, point 4 : intensité après une séance « trop facile » (src/session/intensity.ts, proposeProgression, applyAccepted).
// Cas réel : Tirage B, toutes les séries à réserve 4 avec 12 à 15 répétitions pour une fourchette de 8-12.
import { describe, expect, it } from 'vitest';
import type { Level, PlannedExercise, ProgressionEvent, SetLog, WorkoutSession } from '../../src/data/model';
import { applyAccepted, type ApplyEnv } from '../../src/session/adapt-accept';
import { proposeProgression, type ProgressionInput } from '../../src/session/history';
import { addableFiche, decideIntensity, easySignal, estimateDaySec, fillExerciseTime, sessionLimitMin, type IntensityTime } from '../../src/session/intensity';
import type { ProgVariant } from '../../src/session/progression';
import { CALIBRATION_JUMP } from '../../src/session/progression-config';
import { nextCalibrationStep } from '../../src/generator/calibration';
import { completeSet, NEUTRAL_CONTEXT, startSession } from '../../src/session/engine';
import { generateProgram, toProgramDays } from '../../src/generator';
import { UNLIMITED } from '../../src/generator/config';
import { buildCtx } from '../../src/generator/context';
import { day as dayOf, ex } from './session-helpers';
import { mk } from './generator-helpers';

let n = 0;
const at = (d: number, i = 0) => new Date(Date.parse(`2026-11-0${d}T10:00:00.000Z`) + i * 60_000).toISOString();
function log(o: Partial<SetLog> & { sessionId: string; completedAt: string }): SetLog {
  n++;
  return {
    id: `t${n}`, ownerId: 'u', createdAt: o.completedAt, updatedAt: o.completedAt, rev: 1, deletedAt: null, syncedAt: null,
    movementId: 'tirage-b', variantId: 'tb1', exerciseIndex: 0, setIndex: n, targetRepsMin: 8, targetRepsMax: 12, targetRir: 2,
    reps: 13, loadKg: null, rir: 4, pain: false, comment: '', isWarmup: false, echelon: 1, ...o,
  } as SetLog;
}
/** Séance du Tirage B : 3 séries à réserve 4, 12 à 15 répétitions (fourchette 8-12). */
const easySession = (id = 's1', d = 3, over: Partial<SetLog> = {}) =>
  [15, 13, 12].map((reps, i) => log({ ...over, sessionId: id, completedAt: at(d, i), reps }));
/** Deux séances valables de suite au haut de la fourchette (C3 / C7 : condition de la série ou de l'ajout). */
const twoEasy = () => [...easySession('s0', 2), ...easySession('s1', 3)];
const row = (id: string, d: number, o: Partial<WorkoutSession> = {}): WorkoutSession =>
  ({ id, status: 'faite', startedAt: at(d), endedAt: at(d), plannedDate: at(d).slice(0, 10), deletedAt: null, endReason: null, ...o }) as unknown as WorkoutSession;

const tirage = ex({ movementId: 'tirage-b', variantId: 'tb1', sets: 3, repsMin: 8, repsMax: 12, rirTarget: 2, restSec: 90 });
const other = ex({ movementId: 'autre', variantId: 'o1', sets: 3, repsMin: 8, repsMax: 12, rirTarget: 2, restSec: 90 });
const seance = dayOf([other, tirage]);
/** Estimation déterministe pour ces tests : 4 s par répétition visée (haut de fourchette) + repos, par série. */
const est = (exs: readonly PlannedExercise[]) => exs.reduce((a, e) => a + e.sets * (e.repsMax * 4 + e.restSec), 0);
const BASE = est(seance.exercises); // 2 x 3 x (48 + 90) = 828 s
const timeWith = (limitSec: number): IntensityTime => ({ day: seance, limitSec, estimate: est });
const MARGES = { grande: BASE + 600, moyenne: BASE + 30, limite: BASE };

const variants: ProgVariant[] = [
  { id: 'tb1', nom: 'Tirage élastique', echelon: 1, niveau: 'debutant', materielOk: true, rank: 0 },
  // Aucun élastique plus fort dans le profil : la montée d'échelon E2 (règle existante, prioritaire) ne s'applique pas ici.
  { id: 'tb2', nom: 'Tirage élastique fort', echelon: 2, niveau: 'debutant', materielOk: false, rank: 0 },
];
const input = (sets: SetLog[], o: Partial<ProgressionInput> = {}, level: Level = 'intermediaire', limitSec = MARGES.grande, ceiling = 15): ProgressionInput => ({
  exercise: tirage, sets, pregnant: false, echelon: 1, availableEchelons: [1, 2], level,
  sessions: [row('s0', 2), row('s1', 3)], bodyweight: { variants, level }, zonesOfFiche: ['dos'], ficheMaxSets: 3, now: Date.parse(at(4)),
  intensity: { repsCeiling: ceiling, time: timeWith(limitSec) }, ...o,
});

describe('Signal « trop facile »', () => {
  it('Tirage B : réserve 4 et 12 à 15 répétitions pour 8-12 = trop facile ; réserve 3 pour une cible 3 = non', () => {
    expect(easySignal(easySession(), tirage)).toBe(true);
    expect(easySignal(easySession('s', 3, { rir: 2 }), tirage)).toBe(false);
    expect(easySignal(easySession('s', 3, { rir: 3, targetRir: 3 }), tirage)).toBe(false);
    expect(easySignal([...easySession(), log({ sessionId: 's1', completedAt: at(3, 5), reps: 10 })], tirage)).toBe(false);
    expect(easySignal(easySession('s', 3, { pain: true }), tirage)).toBe(false);
  });
});

describe('Tirage B selon la marge de temps', () => {
  it('grande marge : un ajout dans la séance (proposition), rien d’autre ne change', () => {
    const p = proposeProgression(input(twoEasy()));
    expect(p).toMatchObject({ action: 'hausse', reason: 'exercice', exerciseProposal: true });
    expect(p.setsProposal).toBeUndefined();
    expect(p.harderVariant).toBeUndefined();
    expect(p.echelonProposal).toBeUndefined();
  });
  it('relecteur C3 / C7 : 1 séance facile = ni série ni ajout (répétitions seulement) ; 2 séances = oui', () => {
    const one = proposeProgression(input(easySession()));
    expect(one.exerciseProposal).toBeUndefined();
    expect(one.setsProposal).toBeUndefined();
    expect(one).toMatchObject({ reason: 'repetitions', repsProposal: { repsMin: 10, repsMax: 14 } });
    const t2 = { ...tirage, sets: 2 };
    const d2 = dayOf([other, t2]);
    const tight = { repsCeiling: 12, time: { day: d2, limitSec: est(d2.exercises) + 150, estimate: est } };
    expect(proposeProgression(input(easySession(), { exercise: t2, intensity: tight })).setsProposal).toBeUndefined();
    expect(proposeProgression(input(twoEasy(), { exercise: t2, intensity: tight })).setsProposal).toBe(3);
    expect(proposeProgression(input(twoEasy())).exerciseProposal).toBe(true);
  });
  it('marge moyenne : plus de répétitions (10-14, fourchette D2 8-15), puis une série si les répétitions sont au plafond', () => {
    const p = proposeProgression(input(easySession(), {}, 'intermediaire', MARGES.moyenne));
    expect(p).toMatchObject({ action: 'hausse', reason: 'repetitions', repsProposal: { repsMin: 10, repsMax: 14 } });
    // Répétitions au plafond : une série en plus si elle tient (2 -> 3) ; à 3 séries (plafond du rôle) : rien qui allonge.
    const t2 = { ...tirage, sets: 2 };
    const d2 = dayOf([other, t2]);
    const s = proposeProgression(input(twoEasy(), { exercise: t2, intensity: { repsCeiling: 12, time: { day: d2, limitSec: est(d2.exercises) + 150, estimate: est } } }));
    expect(s).toMatchObject({ action: 'hausse', reason: 'serie', setsProposal: 3 });
    expect(proposeProgression(input(easySession(), {}, 'intermediaire', BASE + 150, 12)).setsProposal).toBeUndefined();
  });
  it('séance déjà à la limite : rien qui allonge, aucune variante imposée (garder)', () => {
    const p = proposeProgression(input(easySession(), {}, 'intermediaire', MARGES.limite));
    expect(p.action).toBe('garder');
    expect(p.repsProposal).toBeUndefined();
    expect(p.setsProposal).toBeUndefined();
    expect(p.exerciseProposal).toBeUndefined();
    expect(p.echelonProposal).toBeUndefined();
  });
  it('jamais au-dessus de la limite : la décision tient dans la limite pour toutes les marges de 0 à 700 s', () => {
    for (let m = 0; m <= 700; m += 5) {
      const limit = BASE + m;
      const d = decideIntensity({ exercise: tirage, lastSets: easySession(), beginner: false, growthAllowed: true, repsCeiling: 15, maxSets: 3, time: timeWith(limit) })!;
      const after = d.kind === 'exercice' ? [...seance.exercises, tirage]
        : d.kind === 'repetitions' ? seance.exercises.map((e) => (e === tirage ? { ...e, repsMin: d.repsMin, repsMax: d.repsMax } : e))
        : d.kind === 'serie' ? seance.exercises.map((e) => (e === tirage ? { ...e, sets: d.sets } : e)) : seance.exercises;
      expect(est(after)).toBeLessThanOrEqual(limit);
    }
  });
  it('durée limite : « illimité » 75 min (cible 60), durée choisie = cette durée', () => {
    expect(sessionLimitMin(null, UNLIMITED.targetMin)).toBe(UNLIMITED.capMin);
    expect(sessionLimitMin(45, 45)).toBe(45);
    expect(sessionLimitMin(60, 60)).toBe(60);
  });
});

describe('Garde-fous', () => {
  it('débutant : jamais de série ni d’ajout ; seulement des répétitions (D2 : 8-15), sinon rien', () => {
    const p = proposeProgression(input(easySession(), {}, 'debutant'));
    expect(p).toMatchObject({ reason: 'repetitions', repsProposal: { repsMin: 10, repsMax: 14 } });
    const full = proposeProgression(input(easySession(), {}, 'debutant', MARGES.grande, 12));
    expect(full.setsProposal).toBeUndefined();
    expect(full.exerciseProposal).toBeUndefined();
    expect(full.action).toBe('garder');
  });
  it('blessure (case de sécurité), grossesse, reprise douce, douleur, symptôme, séance manquée : aucune montée', () => {
    const cases: Partial<ProgressionInput>[] = [
      { exercise: { ...tirage, adaptation: 'R5' } },
      { pregnant: true },
      { repriseActive: true },
      { frozenBySymptom: true },
      { missedSinceLast: true },
    ];
    for (const c of cases) {
      const p = proposeProgression(input(easySession(), c));
      expect(p.action).not.toBe('hausse');
      expect(p.repsProposal ?? p.setsProposal ?? p.exerciseProposal).toBeUndefined();
    }
    const pain = proposeProgression(input([...easySession('s1', 3, { pain: false }), log({ sessionId: 's1', completedAt: at(3, 4), reps: 12, pain: true, painZone: 'dos' })]));
    expect(pain.action).not.toBe('hausse');
    // Douleur sur la zone dans une autre fiche (gel par zone) : aucune montée non plus.
    const zone = proposeProgression(input([...easySession('s1', 3), log({ sessionId: 's0', movementId: 'rowing', completedAt: at(2), pain: true, painZone: 'dos' })], {
      sessions: [row('s0', 2), row('s1', 3)], zonesOfMovement: () => ['dos'],
    }));
    expect(zone.action).not.toBe('hausse');
  });
  it('séance d’étalonnage ou incomplète : aucune montée par le temps', () => {
    expect(proposeProgression(input(easySession('s1', 3, { isCalibration: true }))).exerciseProposal).toBeUndefined();
    expect(proposeProgression(input(easySession().slice(0, 2))).exerciseProposal).toBeUndefined();
  });
  it('semaine allégée après une décharge acceptée et superset : ni série ni ajout', () => {
    const deload: ProgressionEvent[] = [{ type: 'adapt_accepte', kind: 'decharge', movementId: 'tirage-b', at: at(3, 40) }, { type: 'adapt_applique', kind: 'decharge', movementId: 'tirage-b', at: at(3, 41) }];
    const d = proposeProgression(input(twoEasy(), { adaptEvents: deload }));
    expect(d.setsProposal ?? d.exerciseProposal ?? d.repsProposal).toBeUndefined();
    const pair = { ...tirage, supersetGroup: 'g1' };
    const sp = proposeProgression(input(twoEasy(), { exercise: pair, intensity: { repsCeiling: 15, time: { day: dayOf([other, pair]), limitSec: MARGES.grande, estimate: est } } }));
    expect(sp.setsProposal ?? sp.exerciseProposal).toBeUndefined();
  });
  it('jamais de repos raccourci : aucune proposition ne touche au repos', () => {
    for (const limit of Object.values(MARGES)) {
      const p = proposeProgression(input(easySession(), {}, 'intermediaire', limit));
      expect(p.restProposal).toBeUndefined();
    }
  });
});

describe('Variante plus dure en dernier recours (exercice chargé, aucun palier possible)', () => {
  const lourd = ex({ movementId: 'curl', variantId: 'c1', sets: 2, repsMin: 8, repsMax: 12, rirTarget: 2, restSec: 90 });
  const s2 = dayOf([lourd]);
  const B2 = est(s2.exercises);
  const cv: ProgVariant[] = [
    { id: 'c1', nom: 'Curl', echelon: 1, niveau: 'debutant', materielOk: true, rank: 0 },
    { id: 'c2', nom: 'Curl plus dur', echelon: 2, niveau: 'intermediaire', materielOk: true, rank: 0 },
  ];
  const sets = ['c0', 'c'].flatMap((sid, k) => [12, 13].map((reps, i) => log({ sessionId: sid, movementId: 'curl', variantId: 'c1', completedAt: at(2 + k, i), reps, loadKg: 4 })));
  // Haltères 4 puis 10 kg : saut > 20 %, aucune montée de charge possible (C6).
  const loaded = (limit: number, ceiling = 12): ProgressionInput => ({
    exercise: lourd, sets, pregnant: false, variantTags: ['halteres'], equipment: { dumbbellWeightsKg: [4, 10], kettlebellWeightsKg: [], platesKg: [] },
    level: 'intermediaire', echelon: 1, variants: cv, sessions: [row('c0', 2), row('c', 3)], ficheMaxSets: 3, now: Date.parse(at(4)),
    intensity: { repsCeiling: ceiling, time: { day: s2, limitSec: limit, estimate: est } },
  });
  it('séance à la limite et répétitions au plafond : version plus dure proposée (règles C8 existantes), pas de série', () => {
    const p = proposeProgression(loaded(B2));
    expect(p.setsProposal).toBeUndefined();
    expect(p).toMatchObject({ reason: 'variante', harderVariant: { variantId: 'c2' } });
  });
  it('avec du temps : série en plus avant la version plus dure', () => {
    const p = proposeProgression(loaded(B2 + 150));
    expect(p).toMatchObject({ reason: 'serie', setsProposal: 3 });
    expect(p.harderVariant).toBeUndefined();
  });
});

describe('Application à la séance suivante (acceptation en un appui)', () => {
  const ev = (kind: 'repetitions' | 'serie' | 'exercice', o: Partial<Extract<ProgressionEvent, { type: 'adapt_accepte' }>> = {}): ProgressionEvent =>
    ({ type: 'adapt_accepte', kind, movementId: 'tirage-b', at: at(3, 30), ...o }) as ProgressionEvent;
  const env = (events: ProgressionEvent[], o: Partial<ApplyEnv> = {}): ApplyEnv => ({
    events, sets: easySession(), sessions: [row('s1', 3)], pregnant: false, repriseActive: false, frozenBySymptom: false,
    adaptOf: () => ({ level: 'intermediaire', zonesOfFiche: ['dos'], zonesOfMovement: () => ['dos'], ficheMaxSets: 3, restMaxSec: 180, intensity: { repsCeiling: 15 } }),
    echelonOf: () => 1, loadsFor: () => [], ...o,
  });
  it('répétitions : fourchette appliquée, repos inchangé ; annulée si la séance dépasserait la limite', () => {
    const r = applyAccepted(seance, env([ev('repetitions', { repsMin: 10, repsMax: 14 })], { fits: (d) => est(d.exercises) <= MARGES.moyenne }));
    const t = r.day.exercises.find((e) => e.movementId === 'tirage-b')!;
    expect(t).toMatchObject({ repsMin: 10, repsMax: 14, restSec: 90, adaptApplied: 'repetitions' });
    const no = applyAccepted(seance, env([ev('repetitions', { repsMin: 10, repsMax: 14 })], { fits: (d) => est(d.exercises) <= MARGES.limite }));
    expect(no.applied).toEqual([]);
    expect(no.cancelled).toEqual([{ kind: 'repetitions', movementId: 'tirage-b', reason: 'limite' }]);
  });
  it('série : annulée si la séance dépasserait la limite ; grossesse : tout annulé', () => {
    const no = applyAccepted(seance, env([ev('serie', { sets: 4 })], { fits: (d) => est(d.exercises) <= MARGES.moyenne }));
    expect(no.cancelled[0]).toMatchObject({ kind: 'serie', reason: 'limite' });
    const preg = applyAccepted(seance, env([ev('repetitions', { repsMin: 10, repsMax: 14 })], { pregnant: true }));
    expect(preg.cancelled[0]).toMatchObject({ reason: 'grossesse' });
  });
  it('relecteur : plafond de répétitions revérifié à l’application (au-delà : annulé)', () => {
    const over = applyAccepted(seance, env([ev('repetitions', { repsMin: 10, repsMax: 14 })], {
      adaptOf: () => ({ level: 'intermediaire', zonesOfFiche: ['dos'], zonesOfMovement: () => ['dos'], intensity: { repsCeiling: 12 } }),
    }));
    expect(over.cancelled).toEqual([{ kind: 'repetitions', movementId: 'tirage-b', reason: 'limite' }]);
    const noCeil = applyAccepted(seance, env([ev('repetitions', { repsMin: 10, repsMax: 14 })], { adaptOf: () => ({ level: 'intermediaire' }) }));
    expect(noCeil.cancelled[0]).toMatchObject({ reason: 'limite' });
  });
  it('relecteur : +30 s de repos au-delà de la durée limite : annulé ; dans la limite : appliqué', () => {
    const rest = ev('serie', { kind: 'repos', restSec: 120 } as never);
    const no = applyAccepted(seance, env([rest], { fits: (d) => est(d.exercises) <= BASE }));
    expect(no.cancelled[0]).toMatchObject({ kind: 'repos', reason: 'limite' });
    const ok = applyAccepted(seance, env([rest], { fits: (d) => est(d.exercises) <= MARGES.grande }));
    expect(ok.day.exercises.find((e) => e.movementId === 'tirage-b')?.restSec).toBe(120);
  });
  it('relecteur : ajout -> semaine de décharge et superset verrouillés ; fiche d’une zone gelée par douleur repérée', () => {
    const paired = { ...other, supersetGroup: 'g' };
    const deloaded = ex({ movementId: 'leg', variantId: 'l1', sets: 3 });
    const day = dayOf([paired, deloaded, tirage]);
    const events: ProgressionEvent[] = [ev('exercice'), { type: 'adapt_accepte', kind: 'decharge', movementId: 'leg', at: at(4) }, { type: 'adapt_applique', kind: 'decharge', movementId: 'leg', at: at(4, 1) }];
    let seen: { locked: (e: PlannedExercise) => boolean; frozen: (id: string) => boolean } | null = null;
    const pain = [...easySession(), log({ sessionId: 'p', movementId: 'rowing', completedAt: at(4, 2), pain: true, painZone: 'dos' })];
    applyAccepted(day, env(events, {
      sets: pain, sessions: [row('s1', 3), row('p', 4)], now: Date.parse(at(5)), fits: () => true,
      adaptOf: () => ({ level: 'intermediaire', zonesOfFiche: [], zonesOfMovement: (id) => (id === 'correctif-dos' || id === 'rowing' ? ['dos'] : []) }),
      fillExercise: (_d, locked, frozen) => { seen = { locked, frozen }; return null; },
    }));
    expect(seen).not.toBeNull();
    const s = seen as unknown as { locked: (e: PlannedExercise) => boolean; frozen: (id: string) => boolean };
    expect(s.locked(paired)).toBe(true);
    expect(s.locked(deloaded)).toBe(true);
    expect(s.frozen('correctif-dos')).toBe(true);
    expect(s.frozen('correctif-cheville')).toBe(false);
    // Sans table des zones : prudence, tout est gelé.
    let frozenAll: ((id: string) => boolean) | null = null;
    applyAccepted(seance, env([ev('exercice')], { adaptOf: () => ({ level: 'intermediaire' }), fillExercise: (_d, _l, f) => { frozenAll = f; return null; } }));
    expect((frozenAll as unknown as (id: string) => boolean)('n-importe')).toBe(true);
  });
  it('ajout : annulé sans moyen de remplir ; appliqué si le remplissage tient dans la limite', () => {
    expect(applyAccepted(seance, env([ev('exercice')])).cancelled[0]).toMatchObject({ kind: 'exercice', reason: 'limite' });
    const bigger = { ...seance, exercises: [...seance.exercises, ex({ movementId: 'correctif', variantId: 'k1', sets: 2, restSec: 60 })] };
    const ok = applyAccepted(seance, env([ev('exercice')], { fits: (d) => est(d.exercises) <= MARGES.grande, fillExercise: () => bigger }));
    expect(ok.applied).toEqual([{ kind: 'exercice', movementId: 'tirage-b' }]);
    expect(ok.day.exercises).toHaveLength(3);
    expect(ok.day.exercises.find((e) => e.movementId === 'tirage-b')?.adaptApplied).toBe('exercice');
    const tooLong = applyAccepted(seance, env([ev('exercice')], { fits: () => false, fillExercise: () => bigger }));
    expect(tooLong.cancelled[0]).toMatchObject({ kind: 'exercice', reason: 'limite' });
  });
});

describe('Remplissage réel (générateur) : ordre du point 3, jamais au-delà de la limite', () => {
  const INTER = mk({ level: 'intermediaire', days: 3, dur: null, goal: 'muscle', profile: 'F', place: 'salle' });
  it('séance « illimité » sous la limite de 75 min : séries ou correctif ajoutés, estimation <= limite, aucun exercice verrouillé touché, repos inchangés', () => {
    const r = generateProgram(INTER);
    if (!r.ok) throw new Error('programme');
    const ctx = buildCtx(INTER);
    const days = toProgramDays(r.program).filter((d) => d.exercises.some((e) => e.role !== 'cardio'));
    const d0 = { ...days[0], exercises: days[0].exercises.map((e) => (e.sets > 2 && !e.capped && !e.supersetGroup ? { ...e, sets: e.sets - 1 } : e)) };
    const all = days.map((d, i) => (i ? d : d0));
    const limitSec = sessionLimitMin(null, UNLIMITED.targetMin) * 60;
    const lockedId = d0.exercises[0].movementId;
    const out = fillExerciseTime({ ctx, days: all, dayIndex: 0, limitSec, locked: (e) => e.movementId === lockedId, frozenFiche: () => false });
    expect(out).not.toBeNull();
    expect(estimateDaySec(out!, out!.exercises, ctx)).toBeLessThanOrEqual(limitSec);
    expect(out!.exercises.find((e) => e.movementId === lockedId)!.sets).toBe(d0.exercises[0].sets);
    for (const e of d0.exercises) {
      const a = out!.exercises.find((x) => x.movementId === e.movementId)!;
      expect(a.sets - e.sets).toBeLessThanOrEqual(1);
      expect(a.restSec).toBe(e.restSec);
    }
    // Relecteur (bloquant) : une fiche d'une zone gelée par une douleur n'est jamais ajoutée.
    const addedIds = out!.exercises.map((e) => e.movementId).filter((id) => !d0.exercises.some((e) => e.movementId === id));
    const frozenIds = new Set([...ctx.fichesById.keys()].filter((id) => !d0.exercises.some((e) => e.movementId === id)));
    const outFrozen = fillExerciseTime({ ctx: buildCtx(INTER), days: all, dayIndex: 0, limitSec, locked: (e) => e.movementId === lockedId, frozenFiche: (id) => frozenIds.has(id) });
    expect((outFrozen?.exercises ?? []).filter((e) => !d0.exercises.some((x) => x.movementId === e.movementId))).toEqual([]);
    expect(addedIds.every((id) => !frozenIds.has(id))).toBe(true);
    // Filtre des fiches ajoutables : zone gelée par une douleur, ou zone gênée du profil (cases de sécurité) : jamais.
    const correctif = [...ctx.fichesById.values()].find((f) => Object.keys(f.securite.zones).length > 0)!;
    expect(addableFiche(ctx, () => false, correctif.id)).toBe(true);
    expect(addableFiche(ctx, (id) => id === correctif.id, correctif.id)).toBe(false);
    const zone = Object.keys(correctif.securite.zones)[0];
    const hurt = buildCtx({ ...INTER, injuries: [{ zone, level: 1 }] } as never);
    if (hurt.zones.some((z) => z.key === zone && z.level >= 1)) expect(addableFiche(hurt, () => false, correctif.id)).toBe(false);
    // Débutant : aucune série ajoutée (canAddSets), au plus des correctifs.
    const DEB = mk({ level: 'debutant', days: 3, dur: null, goal: 'muscle', profile: 'F', place: 'salle' });
    const rd = generateProgram(DEB);
    if (!rd.ok) throw new Error('programme');
    const dd = toProgramDays(rd.program).filter((d) => d.exercises.some((e) => e.role !== 'cardio'));
    const o2 = fillExerciseTime({ ctx: buildCtx(DEB), days: dd, dayIndex: 0, limitSec, locked: () => false, frozenFiche: () => false });
    for (const e of dd[0].exercises) expect(o2?.exercises.find((x) => x.movementId === e.movementId)?.sets ?? e.sets).toBe(e.sets);
  });
});

describe('Étalonnage : montée entre les séries (plafond de saut existant)', () => {
  const step = (rir: number, loadKg: number, loads: number[], movementId = 'curl') => nextCalibrationStep({
    rir, reps: 12, repsMin: 8, repsMax: 12, rirTarget: 2, capped: false, pain: false, loadKg, availableLoadsKg: loads,
    maxJumpRatio: CALIBRATION_JUMP.heavyTechnicalFiches.includes(movementId) ? CALIBRATION_JUMP.heavyTechnicalRatio : CALIBRATION_JUMP.otherRatio,
    minRirToRaise: CALIBRATION_JUMP.minRir,
  });
  it('séries à réserve >= 4 au haut de la fourchette : un cran au-dessus, jamais au-delà du plafond de saut', () => {
    expect(step(4, 10, [8, 10, 12])).toMatchObject({ action: 'hausse', loadKg: 12 });
    expect(step(4, 4, [4, 10])).toMatchObject({ action: 'garder', loadKg: 4 });
    expect(step(3, 10, [8, 10, 12])).toMatchObject({ action: 'garder' });
    expect(step(4, 60, [60, 80], 'squat-arriere-barre')).toMatchObject({ action: 'garder', loadKg: 60 });
  });
  it('gel (capped : douleur, grossesse, plafond) : aucune montée entre les séries', () => {
    expect(nextCalibrationStep({ rir: 4, reps: 12, repsMin: 8, repsMax: 12, rirTarget: 2, capped: true, pain: false, loadKg: 10, availableLoadsKg: [8, 10, 12], minRirToRaise: 4 }).action).toBe('garder');
  });
});

describe('Étalonnage dans le lecteur : 2 séries propres avant la 1re hausse, une seule hausse par séance (décision de l’utilisateur)', () => {
  it('1re série propre : garder ; 2e : un cran (plafond de saut) ; 3e propre : plus de hausse', () => {
    const e = ex({ variantId: 'curl-halteres', movementId: 'curl-halteres', sets: 4, repsMin: 8, repsMax: 12, rirTarget: 2, startLoadKg: 10 });
    const d = dayOf([e]);
    const ctx = { ...NEUTRAL_CONTEXT, isCalibration: () => true, availableLoadsKg: () => [8, 10, 12, 15] };
    let st = startSession(d, 0);
    const out: string[] = [];
    let kg = 10;
    for (let k = 0; k < 4; k++) {
      const r = completeSet(d, st, { reps: 12, loadKg: kg, rir: 4 }, ctx, 1000 * (k + 1));
      st = r.state;
      out.push(`${r.suggestion!.action}:${r.suggestion!.loadKg}`);
      kg = r.suggestion!.loadKg ?? kg;
    }
    expect(out).toEqual(['garder:10', 'hausse:12', 'garder:12', 'garder:12']);
  });
  it('série non propre entre deux : le compte repart de zéro', () => {
    const e = ex({ variantId: 'curl-halteres', movementId: 'curl-halteres', sets: 4, repsMin: 8, repsMax: 12, rirTarget: 2, startLoadKg: 10 });
    const d = dayOf([e]);
    const ctx = { ...NEUTRAL_CONTEXT, isCalibration: () => true, availableLoadsKg: () => [8, 10, 12, 15] };
    let st = startSession(d, 0);
    const acts: string[] = [];
    for (const [k, rir] of [4, 3, 4, 4].entries()) {
      const r = completeSet(d, st, { reps: 12, loadKg: 10, rir }, ctx, 1000 * (k + 1));
      st = r.state;
      acts.push(r.suggestion!.action);
    }
    expect(acts).toEqual(['garder', 'garder', 'garder', 'hausse']);
  });
});

describe('Décision du chef de projet : élastique plus fort (E2) APRÈS les moyens de l’intensité', () => {
  const strong: ProgVariant[] = [
    { id: 'tb1', nom: 'Tirage élastique', echelon: 1, niveau: 'debutant', materielOk: true, rank: 0 },
    { id: 'tb2', nom: 'Tirage élastique fort', echelon: 2, niveau: 'debutant', materielOk: true, rank: 0 },
  ];
  const withStrong = (limitSec: number, ceiling = 15) => input(twoEasy(), { bodyweight: { variants: strong, level: 'intermediaire' } }, 'intermediaire', limitSec, ceiling);
  it('Tirage B réel, 2 séances faciles, marge de temps : ajout, répétitions ou série, PAS l’élastique plus fort', () => {
    for (const limit of [MARGES.grande, MARGES.moyenne]) {
      const p = proposeProgression(withStrong(limit));
      expect(p.echelonProposal).toBeUndefined();
      expect(!!(p.exerciseProposal || p.repsProposal || p.setsProposal)).toBe(true);
    }
  });
  it('à la limite de durée et sans autre moyen (répétitions au plafond, 3 séries) : élastique plus fort proposé', () => {
    const p = proposeProgression(withStrong(MARGES.limite, 12));
    expect(p.echelonProposal).toMatchObject({ kind: 'montee', to: 2 });
  });
  it('gel (douleur sur la zone) : ni intensité ni montée', () => {
    const sets = [...twoEasy(), log({ sessionId: 'p', movementId: 'rowing', completedAt: at(3, 9), pain: true, painZone: 'dos' })];
    const p = proposeProgression(input(sets, { bodyweight: { variants: strong, level: 'intermediaire' }, zonesOfMovement: () => ['dos'], sessions: [row('s0', 2), row('s1', 3), row('p', 3)] }));
    expect(p.action).not.toBe('hausse');
  });
});

describe('Relecteur : étalonnage à un bras ou une jambe, compte par série (les deux côtés)', () => {
  it('1 série complète propre = pas de hausse ; 2 séries complètes propres = hausse ; un côté non propre remet à zéro', () => {
    const e = ex({ variantId: 'curl-un-bras', movementId: 'curl-un-bras', sets: 4, repsMin: 8, repsMax: 12, rirTarget: 2, startLoadKg: 10, perSide: true });
    const d = dayOf([e]);
    const ctx = { ...NEUTRAL_CONTEXT, isCalibration: () => true, availableLoadsKg: () => [8, 10, 12, 15] };
    const play = (rirs: number[]) => {
      let st = startSession(d, 0);
      return rirs.map((rir, k) => {
        const r = completeSet(d, st, { reps: 12, loadKg: 10, rir }, ctx, 1000 * (k + 1));
        st = r.state;
        return `${r.entry.side}:${r.suggestion!.action}`;
      });
    };
    expect(play([4, 4, 4, 4])).toEqual(['gauche:garder', 'droite:garder', 'gauche:garder', 'droite:hausse']);
    // Côté gauche non propre à la série 1 : la série 1 ne compte pas ; il faut encore 2 séries complètes propres.
    expect(play([3, 4, 4, 4, 4, 4])).toEqual(['gauche:garder', 'droite:garder', 'gauche:garder', 'droite:garder', 'gauche:garder', 'droite:hausse']);
  });
});
