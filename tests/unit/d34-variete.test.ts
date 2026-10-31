// D34 (knowledge/programmes-v3.md §1, PV3-VAR-1 à 6 ; écarts E-01, E-02, E-04, E-05 ; avis du kiné) : variété entre les séances d'une
// semaine et d'une semaine à l'autre. Profils nommés comme dans tools/demo-programmes.mjs (P1 à P6), fiches réelles du 31/10/2026
// (« avant fiches » : exceptions de pénurie R <= 2, débutant sans matériel R <= 3).
import { describe, expect, it } from 'vitest';
import type { Injury, ProgramDay, SetLog, WorkoutSession } from '../../src/data/model';
import { generateProgram, toProgramDays, type GenProgram, type GeneratorInput } from '../../src/generator';
import { VOLUME } from '../../src/generator/config';
import { buildCtx } from '../../src/generator/context';
import { makePlaf, musclesOf, sessionCapsOk, sessionVol, splitCapsOk, weekCapsOk } from '../../src/generator/plaf';
import { resolveFiche } from '../../src/generator/safety';
import type { GenExercise, GenSession } from '../../src/generator/types';
import { familyOf, isRotatingSlot, rotationStart } from '../../src/generator/variety';
import { rotationFreeze, ROTATION_FREEZE_DAYS, withProgramWeek } from '../../src/session/program';
import { ficheSessions } from '../../src/session/progression';
import { computeSummary } from '../../src/session/summary';
import { FICHES, byId } from './generator-helpers';
import { at, ex, session, sets } from './progression-helpers';

const eq = (tags: string[]): GeneratorInput['equipment'] => ({ preset: 'perso', tags, disabledImplicit: [], dumbbellWeightsKg: [2, 4, 6, 8, 10, 12, 14], kettlebellWeightsKg: [8, 12] });
const SALLE: GeneratorInput['equipment'] = { preset: 'F', tags: [], disabledImplicit: [], dumbbellWeightsKg: [], kettlebellWeightsKg: [] };
const HE = ['halteres', 'elastique', 'chaise', 'poids_du_corps', 'tapis'];
const E = ['elastique', 'chaise', 'poids_du_corps', 'tapis'];
interface O { profile: Partial<GeneratorInput['profile']>; equipment: GeneratorInput['equipment']; goal: string; second?: string; options?: GeneratorInput['options']; injuries?: GeneratorInput['injuries'] }
const mkI = (o: O): GeneratorInput => ({
  profile: { blockedWeekdays: [], place: 'maison', sessionDurationMin: 45, sports: [], ...o.profile },
  equipment: o.equipment,
  goals: [{ goalKey: o.goal, rank: 1 }, ...(o.second ? [{ goalKey: o.second, rank: 2 }] : [])],
  injuries: o.injuries ?? [], fiches: FICHES,
  options: { gagnerDuTemps: true, ...(o.options ?? {}) },
});
const P1 = (x: Partial<O> = {}) => mkI({ profile: { level: 'debutant', daysPerWeek: 3 }, equipment: eq(HE), goal: 'muscle', ...x });
const P2 = (x: Partial<O> = {}) => mkI({ profile: { level: 'intermediaire', daysPerWeek: 4, sessionDurationMin: 60, place: 'salle' }, equipment: SALLE, goal: 'force', ...x });
const P3 = (x: Partial<O> = {}) => mkI({ profile: { level: 'intermediaire', daysPerWeek: 3 }, equipment: eq(HE), goal: 'perte_gras', second: 'cardio', options: { seanceCardio: true }, ...x });
const P4 = (x: Partial<O> = {}) => mkI({ profile: { level: 'intermediaire', daysPerWeek: 3, sports: ['volley'] }, equipment: eq(E), goal: 'sport', ...x });
const P5 = (x: Partial<O> = {}) => mkI({ profile: { level: 'debutant', daysPerWeek: 3 }, equipment: eq(['poids_du_corps', 'tapis']), goal: 'muscle', ...x });
const P6 = (x: Partial<O> = {}) => mkI({ profile: { level: 'avance', daysPerWeek: 5, sessionDurationMin: 75, place: 'salle' }, equipment: SALLE, goal: 'muscle', ...x });
// Intermédiaire, prise de muscle, 3 jours, haltères, 60 min : accessoires et isolation présents (rotation visible).
const PM = (x: Partial<O> = {}) => mkI({ profile: { level: 'intermediaire', daysPerWeek: 3, sessionDurationMin: 60 }, equipment: eq(HE), goal: 'muscle', ...x });
const ALL: [string, () => GeneratorInput][] = [['P1', P1], ['P2', P2], ['P3', P3], ['P4', P4], ['P5', P5], ['P6', P6], ['PM', PM]];

const cache = new Map<string, GenProgram>();
const prog = (name: string, i: () => GeneratorInput): GenProgram => {
  if (!cache.has(name)) {
    const r = generateProgram(i());
    if (!r.ok) throw new Error(`pas de programme : ${r.code}`);
    cache.set(name, r.program);
  }
  return cache.get(name)!;
};
/** Exercices joués la semaine w (jeu 1 semaines impaires, jeu 2 semaines paires). */
const week = (s: GenSession, w: number): GenExercise[] => s.exercises.map((e) => (w % 2 === 0 && e.alt ? e.alt : e));
const typeOf = (l: string) => (l.includes('-') ? l.split('-')[0] : 'CE');
const R = (a: GenExercise[], b: GenExercise[]) => b.filter((x) => a.some((y) => y.ficheId === x.ficheId)).length;
const pairsR = (p: GenProgram, w: number) => {
  const out: { a: string; b: string; same: boolean; r: number }[] = [];
  for (let i = 0; i < p.sessions.length; i++)
    for (let j = i + 1; j < p.sessions.length; j++)
      out.push({ a: p.sessions[i].label, b: p.sessions[j].label, same: typeOf(p.sessions[i].label) === typeOf(p.sessions[j].label), r: R(week(p.sessions[i], w), week(p.sessions[j], w)) });
  return out;
};

describe('D34 : outils purs (PV3-VAR-4, 6)', () => {
  it('rotationStart : n >= 2k jeux disjoints, k < n < 2k chevauchement 2k - n, n <= k fixe ; semaine 3 = semaine 1 ; bloc 2 décalé', () => {
    expect(rotationStart(6, 3, 1, 1)).toBe(0);
    expect(rotationStart(6, 3, 2, 1)).toBe(3);
    expect(rotationStart(6, 3, 3, 1)).toBe(0);
    expect(rotationStart(6, 3, 4, 1)).toBe(3);
    // Exemple du document : n = 4, k = 3 : jeu 2 = fiche 4 puis 1, 2.
    expect(rotationStart(4, 3, 2, 1)).toBe(3);
    expect(rotationStart(3, 3, 2, 1)).toBe(0);
    expect(rotationStart(2, 3, 2, 1)).toBe(0);
    expect(rotationStart(1, 1, 2, 1)).toBe(0);
    expect(rotationStart(8, 2, 1, 2)).toBe(0); // bloc 2, semaine 1 : ((1 x 2 + 0) x 2) mod 4 = 0 (rang 4 modulo 2k)
    expect(rotationStart(8, 2, 2, 2)).toBe(2);
  });
  it('famille = (schéma, premier mot de l’identifiant)', () => {
    expect(familyOf({ id: 'tirage-vertical-elastique-haut', schema: 'tirage_v' })).toBe('tirage_v:tirage');
    expect(familyOf({ id: 'pompe-inclinee', schema: 'poussee_h' })).toBe(familyOf({ id: 'pompe', schema: 'poussee_h' }));
  });
  it('emplacements tournants : accessoires, isolations, fonctionnel ; jamais piliers, noyau ni tronc', () => {
    for (const s of ['jambes_genou', 'poussee_1', 'tirage_1', 'charniere', 'tronc'] as const) expect(isRotatingSlot(s, 'A')).toBe(false);
    expect(isRotatingSlot('tirage_1', 'PULL-B')).toBe(false);
    for (const s of ['poussee_2', 'tirage_2', 'jambes_2', 'poussee_3', 'jambes_4', 'iso_biceps', 'fonctionnel'] as const) expect(isRotatingSlot(s, 'A')).toBe(true);
  });
});

describe('D34 : variété dans la semaine (PV3-VAR-1, 2 ; T-D33-01a, 02, 03)', () => {
  it('T-D33-01a : P1 et P4 R <= 2, P5 (débutant sans matériel) R <= 3, semaines 1 et 2 ; pénurie signalée', () => {
    for (const [n, f, max] of [['P1', P1, 2], ['P4', P4, 2], ['P5', P5, 3]] as const) {
      const p = prog(n, f);
      for (const w of [1, 2]) for (const x of pairsR(p, w)) expect(x.r, `${n} S${w} ${x.a}/${x.b}`).toBeLessThanOrEqual(max);
      expect(p.penurieVariete!.length, n).toBeGreaterThan(0);
    }
  });
  it('mesure du 31/10/2026 (avant D34 : P1 A/B = 5, P4 A/B = 4, P5 A/B = 4) : nette baisse', () => {
    const maxR = (p: GenProgram) => Math.max(...pairsR(p, 1).map((x) => x.r));
    expect(maxR(prog('P1', P1))).toBeLessThanOrEqual(2);
    expect(maxR(prog('P4', P4))).toBeLessThanOrEqual(2);
    expect(maxR(prog('P5', P5))).toBeLessThanOrEqual(2);
    expect(maxR(prog('P3', P3))).toBe(0);
  });
  it('T-D33-02 : une fiche plus d’une fois ou une 3e fiche d’une famille dans la semaine seulement pour un plan signalé en pénurie', () => {
    for (const [n, f] of ALL) {
      const p = prog(n, f);
      for (const w of [1, 2]) {
        const all = p.sessions.flatMap((s) => week(s, w));
        const cnt = new Map<string, number>();
        const fam = new Map<string, number>();
        for (const e of all) {
          cnt.set(e.ficheId, (cnt.get(e.ficheId) ?? 0) + 1);
          fam.set(familyOf({ id: e.ficheId, schema: e.schema }), (fam.get(familyOf({ id: e.ficheId, schema: e.schema })) ?? 0) + 1);
        }
        for (const e of all) {
          if (e.slot === 'tronc' || e.slot.startsWith('iso_')) continue; // tronc : CORE-ALT-1 ; isolation : liste fermée (fiches en dernier)
          if ((cnt.get(e.ficheId) ?? 0) > 1) expect(p.penurieVariete, `${n} S${w} ${e.ficheId}`).toContain(e.schema);
        }
        for (const [k, v] of fam) if (v > 2 && !k.startsWith('gainage') && !k.startsWith('anti_rotation') && !k.startsWith('rotation')) expect(p.penurieVariete, `${n} S${w} ${k}`).toContain(k.split(':')[0]);
      }
    }
  });
  it('T-D33-02 : le tirage vertical à l’élastique une seule fois par semaine quand une autre fiche de tirage vertical existe (P2, P6)', () => {
    for (const [n, f] of [['P2', P2], ['P6', P6]] as const) {
      const p = prog(n, f);
      for (const w of [1, 2]) expect(p.sessions.flatMap((s) => week(s, w)).filter((e) => e.ficheId === 'tirage-vertical-elastique-haut').length, `${n} S${w}`).toBeLessThanOrEqual(1);
    }
  });
  it('T-D33-03 : P2 et P6, R <= 1 entre séances du même type et R = 0 entre types différents (semaines 1 et 2)', () => {
    for (const [n, f] of [['P2', P2], ['P6', P6]] as const) {
      const p = prog(n, f);
      for (const w of [1, 2])
        for (const x of pairsR(p, w)) expect(x.r, `${n} S${w} ${x.a}/${x.b}`).toBeLessThanOrEqual(x.same ? 1 : 0);
    }
  });
});

describe('D34 : rotation d’une semaine à l’autre (PV3-VAR-4, 5, 6 ; T-D33-04 à 08, 29)', () => {
  it('T-D33-04 : piliers, noyau et tronc identiques toutes les semaines ; semaine 3 = semaine 1, semaine 4 = semaine 2 (jours stockés)', () => {
    for (const [n, f] of ALL) {
      const p = prog(n, f);
      for (const s of p.sessions) for (const e of s.exercises) if (!isRotatingSlot(e.slot, s.label)) expect(e.alt?.ficheId ?? e.ficheId, `${n} ${s.label} ${e.slot}`).toBe(e.ficheId);
      for (const d of toProgramDays(p)) {
        expect(withProgramWeek(d, 3)).toEqual(withProgramWeek(d, 1));
        expect(withProgramWeek(d, 4)).toEqual(withProgramWeek(d, 2));
        // La copie jouée n'a plus de jeu 2 (`alt`) : une reprise douce s'applique sur la semaine en cours.
        expect(withProgramWeek(d, 2).exercises.every((e) => !e.alt)).toBe(true);
      }
    }
  });
  it('rotation visible : au moins un accessoire change de fiche en semaine 2 (P2, P5, P6, PM) ; la fiche du jeu 2 n’est jamais celle du jeu 1', () => {
    for (const [n, f] of [['P2', P2], ['P5', P5], ['P6', P6], ['PM', PM]] as const) {
      const p = prog(n, f);
      const rot = p.sessions.flatMap((s) => s.exercises.filter((e) => e.alt && e.alt.ficheId !== e.ficheId));
      expect(rot.length, n).toBeGreaterThan(0);
      for (const e of rot) expect(e.rotation && e.alt!.rotation).toBe(true);
    }
  });
  it('T-D33-05 : bloc 2 : piliers identiques au bloc 1 ; le noyau stable change quand au moins 2 fiches conviennent', () => {
    const b1 = prog('P2', P2);
    const b2 = prog('P2-b2', () => P2({ options: { gagnerDuTemps: true, bloc: 2 } }));
    const pick = (p: GenProgram, slots: string[]) => p.sessions.flatMap((s) => s.exercises.filter((e) => slots.includes(e.slot)).map((e) => `${s.label}:${e.slot}=${e.ficheId}`));
    expect(pick(b2, ['jambes_genou', 'poussee_1'])).toEqual(pick(b1, ['jambes_genou', 'poussee_1']));
    expect(pick(b2, ['tirage_1', 'charniere'])).not.toEqual(pick(b1, ['tirage_1', 'charniere']));
  });
  it('T-D33-06 : déterminisme : deux appels = même programme ; matériel saisi dans un autre ordre = même programme', () => {
    for (const [n, f] of [['P1', P1], ['P4', P4], ['P6', P6]] as const) {
      const a = generateProgram(f());
      const b = generateProgram(f());
      expect(JSON.stringify(b), n).toBe(JSON.stringify(a));
    }
    const rev = generateProgram(P1({ equipment: eq([...HE].reverse()) }));
    expect(JSON.stringify(rev)).toBe(JSON.stringify(generateProgram(P1())));
  });
  it('T-D33-08 : V-PLAF, 20 séries par semaine et plancher de 10 (si atteint en semaine 1) tenus dans le jeu 2 (P2, P3, P6, PM)', () => {
    for (const [n, f] of [['P2', P2], ['P3', P3], ['P6', P6], ['PM', PM]] as const) {
      const p = prog(n, f);
      const plaf = makePlaf(buildCtx(f()), 'slot');
      const w1 = p.sessions.map((s) => ({ exercises: week(s, 1) }));
      const w2 = p.sessions.map((s) => ({ exercises: week(s, 2) }));
      p.sessions.forEach((s, i) => {
        const ok = (ex: GenExercise[]) => (typeOf(s.label) === 'CE' ? sessionCapsOk({ exercises: ex }, plaf) : splitCapsOk(ex, plaf));
        if (ok(w1[i].exercises)) expect(ok(w2[i].exercises), `${n} ${s.label}`).toBe(true);
      });
      if (weekCapsOk(w1)) expect(weekCapsOk(w2), n).toBe(true);
      for (const m of musclesOf(w1)) {
        const v1 = w1.reduce((a, s) => a + sessionVol(s, m), 0);
        if (v1 >= VOLUME.targetMuscle) expect(w2.reduce((a, s) => a + sessionVol(s, m), 0), `${n} ${m}`).toBeGreaterThanOrEqual(VOLUME.targetMuscle);
      }
    }
  });
  it('T-D33-29 : la rotation ne change ni le nombre d’exercices, ni les séries, ni les répétitions ; jeu 2 sûr pour le profil', () => {
    for (const [n, f] of [...ALL, ['P3-genou1', () => P3({ injuries: [{ zone: 'genou', level: 1, active: true, deletedAt: null }] })] as [string, () => GeneratorInput]]) {
      const p = prog(n, f);
      const ctx = buildCtx(f());
      for (const s of p.sessions) {
        expect(week(s, 2).length).toBe(week(s, 1).length);
        for (const e of s.exercises) {
          if (!e.alt || e.alt.ficheId === e.ficheId) continue;
          expect([e.alt.sets, e.alt.repsMin, e.alt.repsMax, e.alt.unit], `${n} ${s.label} ${e.slot}`).toEqual([e.sets, e.repsMin, e.repsMax, e.unit]);
          expect(e.alt.slot).toBe(e.slot);
          expect(e.alt.capped || e.capped).toBe(false);
          // Même contrôle de sécurité que le jeu 1 : la variante du jeu 2 est admise par resolveFiche pour ce profil (matériel, niveau, zones).
          const cands = resolveFiche(byId(e.alt.ficheId), ctx).candidates;
          expect(cands.some((c) => c.fiche.id === e.alt!.ficheId && c.variant.id === e.alt!.variantId), `${n} ${e.alt.ficheId}`).toBe(true);
        }
      }
    }
  });
  it('PV3-VAR-5 (d) : grossesse : aucune rotation ; un accessoire sous plafond (capped) reste fixe', () => {
    const preg = prog('P1-preg', () => P1({ profile: { level: 'debutant', daysPerWeek: 3, pregnancy: 'enceinte' } }));
    expect(preg.sessions.every((s) => s.exercises.every((e) => !e.alt || e.alt.ficheId === e.ficheId))).toBe(true);
    for (const [n, f] of ALL) for (const s of prog(n, f).sessions) for (const e of s.exercises) if (e.capped) expect(e.alt?.ficheId ?? e.ficheId).toBe(e.ficheId);
  });
  it('PV3-VAR-5 (e) : paires de superset décidées par jeu : dans chaque semaine, une paire = 2 exercices du même jeu', () => {
    for (const [n, f] of ALL) {
      for (const d of toProgramDays(prog(n, f))) {
        for (const w of [1, 2]) {
          const exs = withProgramWeek(d, w).exercises;
          const g = new Map<string, number>();
          exs.forEach((e) => e.supersetGroup && g.set(e.supersetGroup, (g.get(e.supersetGroup) ?? 0) + 1));
          for (const [k, c] of g) expect(c, `${n} ${d.label} S${w} ${k}`).toBe(2);
        }
      }
    }
  });
});

describe('D34 : gel de la rotation après une douleur (avis du kiné, PV3-VAR-5 d)', () => {
  const day: ProgramDay = {
    dayIndex: 0, label: 'A',
    exercises: [
      ex(3, { movementId: 'squat', slot: 'jambes_genou', role: 'pilier' }),
      ex(3, { movementId: 'pompe', slot: 'poussee_2', supersetGroup: 'A-P1', rotation: true, alt: ex(3, { movementId: 'pompe-inclinee', slot: 'poussee_2', supersetGroup: 'A-P1', rotation: true }) }),
      ex(3, { movementId: 'rowing', slot: 'tirage_2', supersetGroup: 'A-P1', rotation: true, alt: ex(3, { movementId: 'face-pull', slot: 'tirage_2', supersetGroup: 'A-P1', rotation: true }) }),
    ],
  };
  const ids = (d: ProgramDay) => d.exercises.map((e) => e.movementId);
  const now = Date.parse(at(30));
  const painSet = (movementId: string, d: number): SetLog => ({ ...sets('x', d, { count: 1 })[0], movementId, pain: true, completedAt: at(d) });
  const inj = (level: 1 | 2 | 3, d: number): Injury => ({ id: 'i', ownerId: 'u', createdAt: at(0), updatedAt: at(d), rev: 1, deletedAt: null, syncedAt: null, zone: 'genou', side: null, level, note: '', active: true });

  it('sans douleur : semaine 1 = jeu 1, semaine 2 = jeu 2 (paire gardée : ses deux membres viennent du même jeu)', () => {
    expect(ids(withProgramWeek(day, 1))).toEqual(['squat', 'pompe', 'rowing']);
    expect(ids(withProgramWeek(day, 2))).toEqual(['squat', 'pompe-inclinee', 'face-pull']);
    expect(withProgramWeek(day, 2).exercises.filter((e) => e.supersetGroup === 'A-P1').length).toBe(2);
  });
  it('douleur sur la fiche du jeu 1 il y a 5 jours : la semaine 2 garde cette fiche (jamais une fiche neuve), et la paire mixte est défaite', () => {
    const fz = rotationFreeze([painSet('pompe', 25)], [], now);
    const d2 = withProgramWeek(day, 2, fz);
    expect(ids(d2)).toEqual(['squat', 'pompe', 'face-pull']);
    expect(d2.exercises.every((e) => e.supersetGroup === null)).toBe(true);
  });
  it('douleur sur la fiche du jeu 2 : la semaine 3 garde la fiche du jeu 2 ; au-delà de 14 jours, la rotation reprend', () => {
    expect(ids(withProgramWeek(day, 3, rotationFreeze([painSet('face-pull', 25)], [], now)))).toEqual(['squat', 'pompe', 'face-pull']);
    expect(ids(withProgramWeek(day, 3, rotationFreeze([painSet('face-pull', 30 - ROTATION_FREEZE_DAYS - 1)], [], now)))).toEqual(['squat', 'pompe', 'rowing']);
  });
  it('zone passée au niveau >= 1 depuis moins de 14 jours : jeu 1 partout (lecture restrictive : toutes les rotations gelées)', () => {
    expect(rotationFreeze([], [inj(1, 27)], now).all).toBe(true);
    expect(rotationFreeze([], [inj(1, 10)], now).all).toBe(false);
    expect(ids(withProgramWeek(day, 2, rotationFreeze([], [inj(2, 29)], now)))).toEqual(['squat', 'pompe', 'rowing']);
  });
});

describe('D34 : progression et comparaison avec la rotation (E-04, PV3-VAR-5 c)', () => {
  const withPlan = (id: string, d: number, dayIndex: number, exs = [ex(3, { movementId: 'squat' }), ex(3, { movementId: 'pompe', rotation: true })]): WorkoutSession =>
    ({ ...session(id, d, { programDayIndex: dayIndex }), plan: { dayIndex, label: 'A', exercises: exs } });
  const rows = (id: string, d: number, movementId: string) => sets(id, d, { movementId, echelon: 3, rir: 3, reps: 12 });

  it('semaine 2 (V-BILAN-7) : l’accessoire tournant se compare à la dernière séance où CETTE fiche a été faite, même 2 semaines plus tôt', () => {
    const w1 = withPlan('w1', 0, 0);
    const w2 = withPlan('w2', 7, 0, [ex(3, { movementId: 'squat' }), ex(3, { movementId: 'rowing', rotation: true })]);
    const w3 = withPlan('w3', 14, 0);
    const all = [...rows('w1', 0, 'squat'), ...rows('w1', 0, 'pompe'), ...rows('w2', 7, 'squat'), ...rows('w2', 7, 'rowing'), ...rows('w3', 14, 'squat'), ...rows('w3', 14, 'pompe')];
    const s = computeSummary({ session: w3, sets: all, sessions: [w1, w2, w3] });
    expect(s.comparison?.commonExercises).toBe(2); // squat (semaine 2) + pompe (semaine 1)
    // Sans le marqueur de rotation : règle V-BILAN-7 inchangée (exercice commun avec la séance de référence seulement).
    const plain = withPlan('w3b', 14, 0, [ex(3, { movementId: 'squat' }), ex(3, { movementId: 'pompe' })]);
    const all2 = all.map((x) => (x.sessionId === 'w3' ? { ...x, sessionId: 'w3b' } : x));
    expect(computeSummary({ session: plain, sets: all2, sessions: [w1, w2, plain] }).comparison?.commonExercises).toBe(1);
  });
  it('V-ETAL et §1.2 se comptent en occurrences de la fiche : les séances sans la fiche ne coupent pas la suite', () => {
    const ss = [withPlan('a', 0, 0), withPlan('b', 7, 0, [ex(3, { movementId: 'rowing', rotation: true })]), withPlan('c', 14, 0)];
    const f = ficheSessions('pompe', [...rows('a', 0, 'pompe'), ...rows('b', 7, 'rowing'), ...rows('c', 14, 'pompe')], ss, 3);
    expect(f.map((x) => x.sessionId)).toEqual(['a', 'c']);
  });
});
