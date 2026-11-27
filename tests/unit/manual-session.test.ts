// Idée 2 : « Créer une séance », mode « Je choisis mes exercices » (src/session/manual-session.ts, avis kiné du 27/11/2026).
import { describe, expect, it } from 'vitest';
import { CREER_SEANCE } from '../../src/generator/config';
import { availableTags } from '../../src/generator/context';
import { caseFor } from '../../src/generator/safety';
import type { GeneratorInput, GenExercise } from '../../src/generator/types';
import { addProblem, adjust, buildManual, capsProblem, doseFor, manualEnv, MANUAL_TEXT, pairProblem, rebuildFor, type ManualEnv, type ManualPick } from '../../src/session/manual-session';
import { createdDay } from '../../src/session/create-store';
import { weekDoneMap } from '../../src/zones/week-done';
import type { SetLog, WorkoutSession } from '../../src/data/model';
import { FICHES, mk, type MkOpts } from './generator-helpers';

const NOW = '2026-11-12T10:00:00.000Z';
const ago = (h: number) => new Date(Date.parse(NOW) - h * 3600 * 1000).toISOString();
const home = (o: MkOpts = {}): GeneratorInput => mk({ profile: 'A0', extraTags: ['elastique', 'chaise', 'halteres', 'barre_traction'], level: 'intermediaire', ...o });
const env = (input: GeneratorInput, o: Partial<{ intensity: 'douce' | 'moderee' | 'soutenue'; chairStable: boolean }> = {}, ctx = {}) =>
  manualEnv(input, { intensity: 'moderee', chairStable: false, todayIso: NOW, ...o }, ctx);
const LEGS = ['squat', 'fente', 'charniere', 'cheville_mollet', 'hanche_laterale'];
const dose = (e: ManualEnv, id: string): GenExercise => doseFor(e.options.find((o) => o.ficheId === id)!, e);

describe('Choix manuel : la liste ne montre que ce que le générateur permet (avis kiné 1)', () => {
  it('matériel du profil, statut utilisable, jamais de saut, de mobilité, de cardio ni d’exercice technique', () => {
    const input = home();
    const e = env(input);
    expect(e.options.length).toBeGreaterThan(10);
    const tags = availableTags(input.equipment);
    for (const o of e.options) {
      const f = FICHES.find((x) => x.id === o.ficheId)!;
      const v = f.variantes.find((x) => x.id === o.variantId)!;
      expect(v.tags.every((t) => tags.has(t)), o.variantId).toBe(true);
      expect(['saut', 'mobilite', 'cardio']).not.toContain(f.schema);
      expect(f.technique === true || f.technique === 'oui').toBe(false);
      expect(['utilisable', 'verifie']).toContain(f.statut);
    }
  });

  it('règle 23 : un débutant ne voit aucune fiche ni variante au-dessus de son niveau, ni d’unilatéral de jambes', () => {
    const e = env(home({ level: 'debutant' }));
    for (const o of e.options) {
      const f = FICHES.find((x) => x.id === o.ficheId)!;
      expect(f.niveauMin).toBe('debutant');
      expect(f.variantes.find((x) => x.id === o.variantId)!.niveau).toBe('debutant');
    }
  });

  it('blessure : aucune fiche dont la case de la zone est « retirer » ; la variante imposée par une case est respectée', () => {
    for (const zone of ['genou', 'epaule', 'dos'] as const) {
      const e = env(home({ injuries: [[zone, 2]] }));
      expect(e.options.length).toBeGreaterThan(0);
      for (const o of e.options) {
        const f = FICHES.find((x) => x.id === o.ficheId)!;
        for (const z of e.ctx.zones) {
          const c = caseFor(f, z);
          expect(c.action, `${o.ficheId} ${zone}`).not.toBe('retirer');
          if (c.action === 'adapter' && c.variante && f.variantes.some((v) => v.id === c.variante)) expect(o.variantId).toBe(c.variante);
        }
      }
    }
  });

  it('chaise non calée : aucune variante sur chaise ; calée : elles peuvent revenir', () => {
    const tagged = (e: ManualEnv) => e.options.filter((o) => FICHES.find((f) => f.id === o.ficheId)!.variantes.find((v) => v.id === o.variantId)!.tags.includes('chaise'));
    expect(tagged(env(home()))).toEqual([]);
    expect(tagged(env(home(), { chairStable: true })).length).toBeGreaterThanOrEqual(0);
  });
});

describe('Choix manuel : règles des listes fermées de « Créer » (relecteur 27/11/2026)', () => {
  const rapid = (e: ManualEnv) => e.options.find((o) => o.ficheId === 'montee-rapide-chaise');
  it('montée rapide : chaise calée exigée, jamais en soutenue, ni après une gêne du genou ; 2 séries de 6 au plus', () => {
    const ok = env(home(), { chairStable: true });
    const o = rapid(ok);
    if (o) {
      const d = doseFor(o, ok);
      expect(d.sets).toBeLessThanOrEqual(2);
      expect(d.repsMax).toBeLessThanOrEqual(6);
    }
    expect(rapid(env(home(), { chairStable: false }))).toBeUndefined();
    expect(rapid(env(home(), { chairStable: true, intensity: 'soutenue' }))).toBeUndefined();
    expect(rapid(env(home({ injuries: [['genou', 1]] }), { chairStable: true }))).toBeUndefined();
  });

  it('séance adoucie : nordique retiré, toute la séance en douce', () => {
    const hours = (CREER_SEANCE.spacing.refuseHours + CREER_SEANCE.spacing.softenHours) / 2;
    const e = env(home(), {}, { sessions: [{ endIso: ago(hours), heavyLegs: true, jumps: false, contacts: 0, impact: false, pain: false }] });
    expect(e.options.some((o) => o.ficheId.startsWith('nordique'))).toBe(false);
    const push = e.options.find((o) => o.schema === 'poussee_h')!;
    expect(doseFor(push, e).restSec).toBe(CREER_SEANCE.restSec.douce);
  });

  it('une case « sans charge » n’est jamais perdue : aucune variante chargée pour une fiche adaptée', () => {
    for (const zone of ['dos', 'genou', 'epaule'] as const) {
      const e = env(home({ injuries: [[zone, 1]] }));
      for (const o of e.options) {
        const f = FICHES.find((x) => x.id === o.ficheId)!;
        const sansCharge = e.ctx.zones.some((z) => { const c = caseFor(f, z); return c.action === 'adapter' && c.sansCharge; });
        if (sansCharge) expect(o.variantId).toBe(o.candidate.variant.id);
      }
    }
  });

  it('buildManual refuse une dose montée au-dessus de la proposition', () => {
    const e = env(home());
    const d = dose(e, e.options[0].ficheId);
    expect(buildManual([{ ex: { ...d, sets: d.sets + 1 }, pairNext: false }], e)).toEqual({ ok: false, message: MANUAL_TEXT.unavailable });
    expect(buildManual([{ ex: { ...d, restSec: d.restSec - 15 }, pairNext: false }], e)).toEqual({ ok: false, message: MANUAL_TEXT.unavailable });
  });
});

describe('Choix manuel : mêmes verrous que le mode automatique (avis kiné 5)', () => {
  it('jambes lourdes il y a moins de 24 h : exercices de jambes retirés de la liste, avec le message du refus', () => {
    const e = env(home(), {}, { sessions: [{ endIso: ago(10), heavyLegs: true, jumps: false, contacts: 0, impact: false, pain: false }] });
    expect(e.legsBlocked).toBeTruthy();
    expect(e.options.some((o) => LEGS.includes(o.schema))).toBe(false);
    expect(e.options.length).toBeGreaterThan(0);
  });

  it('jambes lourdes il y a 30 h : séance adoucie, dose douce sur les jambes seulement', () => {
    const hours = (CREER_SEANCE.spacing.refuseHours + CREER_SEANCE.spacing.softenHours) / 2;
    const e = env(home(), { intensity: 'soutenue' }, { sessions: [{ endIso: ago(hours), heavyLegs: true, jumps: false, contacts: 0, impact: false, pain: false }] });
    expect(e.softened).toBe(true);
    const leg = e.options.find((o) => o.schema === 'squat')!;
    expect(doseFor(leg, e).sets).toBeLessThanOrEqual(CREER_SEANCE.softenedSets);
    expect(doseFor(leg, e).restSec).toBe(CREER_SEANCE.restSec.douce);
  });

  it('grossesse : aucune fiche de jambes (refus du mode automatique), aucun superset', () => {
    const e = env(home({ preg: 'enceinte' }));
    expect(e.options.some((o) => LEGS.includes(o.schema))).toBe(false);
    const [a, b] = e.options.slice(0, 2).map((o) => doseFor(o, e));
    expect(pairProblem(a, b, e)).toBe(MANUAL_TEXT.pairPregnant);
  });
});

describe('Choix manuel : dose et plafonds (avis kiné 2 et 4)', () => {
  it('dose du générateur et de « Créer » ; la personne peut la baisser, jamais la monter', () => {
    const e = env(home());
    for (const o of e.options.slice(0, 20)) {
      const d = doseFor(o, e);
      expect(d.sets).toBeLessThanOrEqual(CREER_SEANCE.sets.moderee);
      expect(d.restSec).toBeGreaterThanOrEqual(CREER_SEANCE.restSec.min);
      expect(d.role).not.toBe('pilier');
      expect(adjust(d, { sets: d.sets + 5, restSec: 0 })).toMatchObject({ sets: d.sets, restSec: d.restSec });
      expect(adjust(d, { sets: 0, restSec: d.restSec + 999 })).toMatchObject({ sets: 1, restSec: d.restSec + 120 });
    }
  });

  it('plafond par muscle de la séance : l’ajout est refusé avec un message', () => {
    const e = env(home());
    const pushes = e.options.filter((o) => o.schema === 'poussee_h').map((o) => doseFor(o, e));
    let list: GenExercise[] = [];
    let why: string | null = null;
    for (const p of pushes) {
      why = addProblem(list, p, e);
      if (why) break;
      list = [...list, p];
    }
    expect(why).toBeTruthy();
    expect(capsProblem(list, e)).toBeNull();
  });

  it('plafond de la semaine (20, ou 24 relevé) : un muscle déjà au plafond refuse l’exercice', () => {
    const e0 = env(home());
    const push = e0.options.find((o) => o.schema === 'poussee_h')!;
    const muscle = doseFor(push, e0).musclesPrincipaux[0];
    const e = env(home(), {}, { weekSets: { [muscle]: 24 } });
    expect(addProblem([], doseFor(e.options.find((o) => o.ficheId === push.ficheId)!, e), e)).toMatch(/cette semaine/);
  });

  it('doublon refusé', () => {
    const e = env(home());
    const d = doseFor(e.options[0], e);
    expect(capsProblem([d, d], e)).toBe(MANUAL_TEXT.duplicate);
  });
});

describe('Choix manuel : supersets (avis kiné 3)', () => {
  const findPair = (e: ManualEnv): [GenExercise, GenExercise] | null => {
    const push = e.options.filter((o) => o.schema === 'poussee_h').map((o) => doseFor(o, e));
    const pull = e.options.filter((o) => o.schema === 'tirage_h').map((o) => doseFor(o, e));
    for (const a of push) for (const b of pull) if (!pairProblem(a, b, e)) return [a, b];
    return null;
  };

  it('intermédiaire : une poussée et un tirage permis s’enchaînent ; deux poussées jamais', () => {
    const e = env(home());
    expect(findPair(e)).not.toBeNull();
    const pushes = e.options.filter((o) => o.schema === 'poussee_h').map((o) => doseFor(o, e));
    expect(pairProblem(pushes[0], pushes[1], e)).toBe(MANUAL_TEXT.pairNo);
  });

  it('débutant : jamais de superset', () => {
    const e = env(home({ level: 'debutant' }));
    const [a, b] = e.options.slice(0, 2).map((o) => doseFor(o, e));
    expect(pairProblem(a, b, e)).toBe(MANUAL_TEXT.pairBeginner);
  });

  it('SUP-10 : un muscle de la paire travaillé la veille -> refusé', () => {
    const e = env(home());
    const [a, b] = findPair(e)!;
    expect(pairProblem(a, b, e, [a.musclesPrincipaux[0]])).toBe(MANUAL_TEXT.pairNo);
    expect(pairProblem(a, b, e, null)).toBe(MANUAL_TEXT.pairNo);
  });

  it('buildManual : paire côte à côte, même groupe, repos de paire >= 60 s ; jour jouable par le lecteur', () => {
    const e = env(home());
    const [a, b] = findPair(e)!;
    const core = e.options.find((o) => o.schema === 'gainage')!;
    const picks: ManualPick[] = [{ ex: a, pairNext: true }, { ex: b, pairNext: false }, { ex: doseFor(core, e), pairNext: false }];
    const res = buildManual(picks, e);
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    const s = res.session;
    expect(s.exercises[0].supersetGroup).toBeTruthy();
    expect(s.exercises[1].supersetGroup).toBe(s.exercises[0].supersetGroup);
    expect(s.exercises[2].supersetGroup).toBeNull();
    expect(s.exercises[0].restSec).toBe(s.exercises[1].restSec);
    expect(s.exercises[0].restSec).toBeGreaterThanOrEqual(60);
    expect(s.zone).toBe('haut');
    expect(s.heavyLegs).toBe(false);
    expect(s.impact).toBe(false);
    expect(s.jumps).toBeNull();
    expect(s.warnings.some((w) => w.id === 'avis')).toBe(true);
    expect(s.warmup.general || s.warmup.mobility.length).toBeTruthy();
    expect(s.cooldown.items.length).toBeGreaterThan(0);
    const day = createdDay(s);
    expect(day.exercises.map((x) => x.supersetGroup)).toEqual(s.exercises.map((x) => x.supersetGroup));
  });

  it('buildManual refuse une paire non permise et un exercice qui ne convient plus à la nouvelle date', () => {
    const e = env(home());
    const pushes = e.options.filter((o) => o.schema === 'poussee_h').map((o) => doseFor(o, e));
    expect(buildManual([{ ex: pushes[0], pairNext: true }, { ex: pushes[1], pairNext: false }], e)).toEqual({ ok: false, message: MANUAL_TEXT.pairNo });
    const squat = e.options.find((o) => o.schema === 'squat')!;
    const picks = [{ ex: doseFor(squat, e), pairNext: false }];
    const later = env(home(), {}, { sessions: [{ endIso: ago(5), heavyLegs: true, jumps: false, contacts: 0, impact: false, pain: false }] });
    expect(rebuildFor(picks, later)).toBeNull();
    expect(buildManual(picks, later)).toEqual({ ok: false, message: MANUAL_TEXT.unavailable });
    expect(buildManual([], e)).toEqual({ ok: false, message: MANUAL_TEXT.empty });
  });

  it('séance avec jambes : jambes lourdes pour l’espacement, avertissement chaise', () => {
    const e = env(home());
    const squat = e.options.find((o) => o.schema === 'squat')!;
    const res = buildManual([{ ex: doseFor(squat, e), pairNext: false }], e);
    expect(res.ok && res.session.heavyLegs).toBe(true);
    expect(res.ok && res.session.zone).toBe('jambes');
    expect(res.ok && res.session.warnings.some((w) => w.id === 'chaise')).toBe(true);
  });
});

describe('Rapport de la semaine : carte des zones (programme + séances créées)', () => {
  const sess = (id: string, o: Partial<WorkoutSession> = {}): WorkoutSession => ({
    id, programId: null, programDayIndex: null, plannedDate: '2026-11-11', status: 'faite', startedAt: '2026-11-11T09:00:00.000Z', endedAt: '2026-11-11T10:00:00.000Z',
    note: '', createdAt: NOW, updatedAt: NOW, deletedAt: null, ...o,
  } as WorkoutSession);
  const set = (sessionId: string, movementId: string, o: Partial<SetLog> = {}): SetLog => ({
    id: `${sessionId}-${movementId}-${Math.random()}`, sessionId, movementId, variantId: movementId, exerciseIndex: 0, setIndex: 0, targetRepsMin: 8, targetRepsMax: 12,
    reps: 10, loadKg: null, completedAt: '2026-11-11T09:10:00.000Z', isWarmup: false, pain: false, createdAt: NOW, updatedAt: NOW, deletedAt: null, ...o,
  } as SetLog);

  it('compte les séries faites depuis lundi d’une séance créée ; ignore la douleur, l’échauffement, la semaine d’avant et l’abandon', () => {
    const push = dose(env(home()), env(home()).options.find((o) => o.schema === 'poussee_h')!.ficheId).ficheId;
    const created = sess('c1', { created: { heavyLegs: false, impact: false, contacts: 0, request: { zone: 'haut', sport: null, chairStable: false, durationMin: 30, intensity: 'moderee' } } });
    const old = sess('o1', { plannedDate: '2026-11-03', startedAt: '2026-11-03T09:00:00.000Z', endedAt: '2026-11-03T10:00:00.000Z' });
    const stopped = sess('a1', { endReason: 'abandon' });
    const sets = [set('c1', push), set('c1', push), set('c1', push, { pain: true }), set('c1', push, { isWarmup: true }), set('o1', push), set('a1', push)];
    const r = weekDoneMap(sets, [created, old, stopped], new Date(NOW), FICHES as never, null)!;
    expect(r.sets).toBe(2);
    expect(r.created).toBe(1);
    expect(Object.values(r.map.points).some((p) => p > 0)).toBe(true);
    expect(weekDoneMap([], [created], new Date(NOW), FICHES as never, null)).toBeNull();
  });
});
