// D25 : structure des programmes v2 (knowledge/structure-programmes.md §6, contrôles T-D25-01 à 24, profils PS-1 à PS-20), cardio par
// objectif (cardio-regles.md §3.4 f-k, §3.7 d, STR-SEA-4) et SUP-10 (core-et-supersets.md §13, contrôles T-D26-28a à e).
// Fiches réelles (public/data/fiches.json) ; les contrôles de volume « fiche-type » (T-D25-08, 09) sont traduits en propriétés
// vérifiables avec les fiches réelles (plafonds, fréquence, messages), voir docs/D25-bilan.md.
import { describe, expect, it } from 'vitest';
import type { Program, ProgramDay, WorkoutSession } from '../../src/data/model';
import { generateProgram } from '../../src/generator';
import { CARDIO, CARDIO_V2, VOLUME } from '../../src/generator/config';
import { canPair, formAllPairs, type DurExercise, type DurSession } from '../../src/generator/duration';
import { chooseLightDays, conflicts, planWeek, scheduleDays, TYPE_NOYAU, typeOf } from '../../src/generator/split';
import type { GeneratorInput, GenExercise, GenProgram } from '../../src/generator/types';
import { NEUTRAL_CONTEXT, pairsForSession, type EngineContext } from '../../src/session/engine';
import { programWeek, veilleMuscles, withProgramWeek } from '../../src/session/program';
import { mk, msgIds } from './generator-helpers';
import { day as mkDay, ex as mkEx } from './session-helpers';

// ----- Profils exacts (§6.1) -----
type Opt = Parameters<typeof mk>[0];
const salle = (o: Opt) => mk({ profile: 'F', place: 'salle', level: 'intermediaire', goal: 'muscle', ...o });
const withTags = (i: GeneratorInput, tags: string[]): GeneratorInput => ({ ...i, equipment: { ...i.equipment, preset: 'perso', tags } });
const PRA = (o: Opt) => withTags(mk({ level: 'debutant', goal: 'sante', ...o }), ['elastique']); // matériel PR-A
const PS = {
  1: () => PRA({ days: 1, dur: 45 }),
  2: () => salle({ days: 2, dur: 60 }),
  3: () => salle({ days: 3, dur: 60 }),
  4: (o: Opt = {}) => salle({ days: 4, dur: 60, ...o }),
  5: (o: Opt = {}) => withTags(mk({ level: 'intermediaire', goal: 'muscle', days: 4, dur: 45, ...o }), ['halteres', 'banc', 'elastique', 'barre_traction']),
  6: (o: Opt = {}) => salle({ days: 5, dur: 60, ...o }),
  7: (o: Opt = {}) => salle({ days: 6, dur: 60, ...o }),
  8: () => PRA({ days: 4, dur: 30 }),
  9: () => PRA({ days: 6, dur: 45 }),
  10: () => salle({ level: 'avance', goal: 'force', days: 4, dur: 75 }),
  11: (dur = 20) => salle({ days: 4, dur }),
  12: () => salle({ days: 4, dur: 60, blocked: [1, 3, 5, 6] }),
  13: () => salle({ days: 4, dur: 60, injuries: [['epaule', 2]] }),
  14: () => ({ ...salle({ days: 4, dur: 60 }), goals: [{ goalKey: 'muscle', rank: 1 }, { goalKey: 'cardio', rank: 2 }] }),
  15: () => PRA({ level: 'intermediaire', days: 4, dur: 45, preg: 'enceinte' }),
  16: () => ({ ...salle({ days: 4, dur: 45 }), goals: [{ goalKey: 'cardio', rank: 1 }] }),
  17: () => salle({ days: 4, dur: 60, blocked: [0, 1, 2, 4, 5, 6] }),
  18: () => PRA({ days: 4, dur: 45, preg: 'enceinte' }),
  19: () => PRA({ days: 4, dur: 30, blocked: [5, 6] }),
  20: () => salle({ days: 3, dur: 75 }),
};
const prog = (i: GeneratorInput): GenProgram => {
  const r = generateProgram(i);
  if (!r.ok) throw new Error(`pas de programme : ${r.code}`);
  return r.program;
};
const labels = (p: GenProgram) => p.sessions.map((s) => s.label);
const FORCE = (e: GenExercise) => e.role === 'pilier' || e.role === 'autre';
const frac = (e: GenExercise, m: string) =>
  e.musclesPrincipaux.some((x) => (m === 'deltoides' ? x.startsWith('deltoides_') : x === m)) ? 1 : e.musclesSecondaires.some((x) => (m === 'deltoides' ? x.startsWith('deltoides_') : x === m)) ? 0.5 : 0;
const muscles = (p: GenProgram) => [...new Set(p.sessions.flatMap((s) => s.exercises.flatMap((e) => [...e.musclesPrincipaux, ...e.musclesSecondaires])))];
const weekVol = (p: GenProgram, m: string) => p.sessions.reduce((a, s) => a + s.exercises.reduce((b, e) => b + e.sets * frac(e, m), 0), 0);
const sessVol = (exs: GenExercise[], m: string) => exs.reduce((b, e) => b + e.sets * frac(e, m), 0);
const circGap = (a: number, b: number) => Math.min(Math.abs(a - b), 7 - Math.abs(a - b));

describe('T-D25-01 à 06 : répartition et calendrier (STR-REP-1, 2, 8)', () => {
  it('T-D25-01 : 1 à 6 jours -> CE-A ; CE-A, B ; CE-A, B, C ; haut / bas x2 ; haut / bas + push / pull / legs ; push / pull / legs x2', () => {
    expect(labels(prog(PS[1]()))).toEqual(['A']);
    expect(labels(prog(PS[2]()))).toEqual(['A', 'B']);
    expect(labels(prog(PS[3]()))).toEqual(['A', 'B', 'C']);
    expect(labels(prog(PS[4]()))).toEqual(['HAUT-A', 'BAS-A', 'HAUT-B', 'BAS-B']);
    expect(labels(prog(PS[6]()))).toEqual(['HAUT-A', 'BAS-A', 'PUSH-B', 'PULL-B', 'LEGS-B']);
    expect(labels(prog(PS[7]()))).toEqual(['PUSH-A', 'PULL-A', 'LEGS-A', 'PUSH-B', 'PULL-B', 'LEGS-B']);
    expect([prog(PS[4]()).split, prog(PS[6]()).split, prog(PS[7]()).split]).toEqual(['haut_bas', 'haut_bas_ppl', 'push_pull_legs']);
  });

  it('T-D25-02 : emplacements par type ; noyau présent à 20 min et plus', () => {
    for (const dur of [20, 30, 45, 60, 75]) {
      for (const p of [prog(PS[4]({ dur })), prog(PS[6]({ dur })), prog(PS[7]({ dur }))]) {
        for (const s of p.sessions) {
          const slots = s.exercises.map((e) => e.slot);
          const t = typeOf(s.label);
          if (t === 'HAUT') expect(slots.some((x) => x.startsWith('jambes') || x === 'charniere' || x === 'fonctionnel'), s.label).toBe(false);
          if (t === 'BAS' || t === 'LEGS') expect(slots.some((x) => x.startsWith('poussee') || x.startsWith('tirage')), s.label).toBe(false);
          if (t === 'PUSH') expect(slots.every((x) => x.startsWith('poussee')), s.label).toBe(true);
          if (t === 'PULL') expect(slots.every((x) => x.startsWith('tirage') || x === 'tronc' || x === 'fonctionnel'), s.label).toBe(true);
          for (const n of TYPE_NOYAU[t]) expect(slots, `${s.label} ${dur} min : ${n}`).toContain(n);
        }
      }
    }
  });

  it('T-D25-03 : fréquence >= 2 pour GG1 à GG4, plancher de core, aucun V-MSG-FREQ (PS-3, PS-4, PS-6, PS-7, 60 min)', () => {
    for (const p of [prog(PS[3]()), prog(PS[4]()), prog(PS[6]()), prog(PS[7]())]) {
      for (const g of ['GG1', 'GG2', 'GG3', 'GG4'] as const) expect(p.coverage[g], `${p.split} ${g}`).toBeGreaterThanOrEqual(2);
      const core = p.sessions.filter((s) => s.exercises.some((e) => e.slot === 'tronc'));
      expect(core.length).toBeGreaterThanOrEqual(2);
      expect(core.flatMap((s) => s.exercises.filter((e) => e.slot === 'tronc')).reduce((a, e) => a + e.sets, 0)).toBeGreaterThanOrEqual(4);
      expect(msgIds(p)).not.toContain('V-MSG-FREQ');
    }
  });

  it('T-D25-04 : 1 jour : une séance, V-MSG-FREQ et texte STR-REP-1 ; débutant : 45 min au plus, 2 séries', () => {
    const p = prog(PS[1]());
    expect(p.sessions).toHaveLength(1);
    expect(msgIds(p)).toEqual(expect.arrayContaining(['V-MSG-FREQ', 'V-MSG-UN-JOUR']));
    expect(p.messages.find((m) => m.id === 'V-MSG-UN-JOUR')!.text).toContain("Une séance par semaine, c'est mieux que rien");
    expect(p.sessions[0].estimatedSec).toBeLessThanOrEqual(45 * 60);
    expect(p.sessions[0].exercises.filter(FORCE).every((e) => e.sets <= 2)).toBe(true);
    // Débutant qui choisit 75 min : ramené à 45 min, avec un message.
    const p75 = prog(PRA({ days: 1, dur: 75 }));
    expect(p75.durationMin).toBe(45);
    expect(msgIds(p75)).toContain('V-MSG-UN-JOUR-DUREE');
  });

  it('T-D25-05 : calendrier : jamais deux séances du même grand groupe sur deux jours consécutifs ; déterministe', () => {
    for (const make of [() => PS[4](), () => PS[6](), () => PS[7]()]) {
      const p = prog(make());
      expect(prog(make()).sessions.map((s) => [s.label, s.weekday])).toEqual(p.sessions.map((s) => [s.label, s.weekday]));
      for (const a of p.sessions)
        for (const b of p.sessions)
          if (a !== b && conflicts(a.label, b.label)) expect(circGap(a.weekday, b.weekday), `${a.label} / ${b.label}`).toBeGreaterThanOrEqual(2);
      expect(new Set(p.sessions.map((s) => s.weekday)).size).toBe(p.sessions.length);
      expect(p.sessions.length).toBeLessThanOrEqual(6); // au moins un jour sans force
    }
    expect(prog(PS[4]()).sessions.map((s) => s.weekday)).toEqual([0, 1, 3, 4]);
  });

  it('T-D25-06 : repli de jours : PS-12 -> CE-A, B, C + V-MSG-JOURS ; PS-17 -> CE-A + V-MSG-JOURS + STR-REP-1', () => {
    const p12 = prog(PS[12]());
    expect(labels(p12)).toEqual(['A', 'B', 'C']);
    expect(msgIds(p12)).toContain('V-MSG-JOURS');
    const p17 = prog(PS[17]());
    expect(labels(p17)).toEqual(['A']);
    expect(p17.sessions[0].weekday).toBe(3);
    expect(msgIds(p17)).toEqual(expect.arrayContaining(['V-MSG-JOURS', 'V-MSG-UN-JOUR']));
  });

  it('STR-REP-8 (unitaire) : débutant au plus 2 jours de force de suite (filtre avant le départage) ; null si impossible', () => {
    const four = ['HAUT-A', 'BAS-A', 'HAUT-B', 'BAS-B'];
    expect(scheduleDays([5, 6], four, true)).toEqual([0, 1, 3, 4]);
    expect(scheduleDays([], ['A', 'B', 'C'], false)).toEqual([0, 2, 4]);
    expect(scheduleDays([0, 1, 2, 3, 4, 5], ['A', 'B'], false)).toBeNull();
    expect(planWeek(2, [0, 1, 2, 3, 4], { level: 'intermediaire', levelAbsent: false, goalFamily: 'muscle', pregnant: false, zones2: [] })!.labels).toEqual(['A']);
    expect(chooseLightDays([], [0, 1, 3, 4], 2)).toEqual([2, 5]);
  });
});

describe('T-D25-07 à 11 : plafonds, volume, durée, ordre de coupe (V-PLAF, STR-REP-3, 4, §1.1)', () => {
  // D33 (PV3-PLAF-1) : 12 séries fractionnaires par muscle pour l'intermédiaire et l'avancé (emplacements prévus), PULL à 4 tirages permis
  // si le total hebdomadaire reste <= 20 (T-D33-21, T-D33-22) ; débutant : 10 (d33-programmes-v3.test.ts).
  it('T-D25-07 : par séance au plus 8 exercices, 24 séries, 12 séries fractionnaires par muscle (D33), 4 séries par exercice ; PULL : 4 tirages', () => {
    for (const p of [prog(PS[4]()), prog(PS[6]()), prog(PS[7]()), prog(PS[10]())]) {
      for (const s of p.sessions) {
        expect(s.exercises.length).toBeLessThanOrEqual(VOLUME.maxExercisesPerSession);
        expect(s.exercises.reduce((a, e) => a + e.sets, 0)).toBeLessThanOrEqual(VOLUME.maxWorkSetsPerSession);
        expect(s.exercises.every((e) => e.sets <= VOLUME.maxSetsPerExercise)).toBe(true);
        for (const m of muscles(p)) expect(sessVol(s.exercises, m), `${s.label} ${m}`).toBeLessThanOrEqual(VOLUME.maxPerMuscleSessionSlots);
        if (typeOf(s.label) === 'PULL') expect(s.exercises.filter((e) => e.slot.startsWith('tirage') && e.sets >= 3).length).toBeLessThanOrEqual(4);
      }
    }
  });

  it('T-D25-08 / 09 (fiches réelles) : aucun muscle au-dessus de 20 séries par semaine ; PS-2 : V-MSG-VOL ; PS-4 : pectoraux >= 9', () => {
    for (const p of [prog(PS[3]()), prog(PS[4]()), prog(PS[6]()), prog(PS[7]())])
      for (const m of muscles(p)) expect(weekVol(p, m), `${p.split} ${m}`).toBeLessThanOrEqual(VOLUME.maxPerMuscleWeek);
    expect(msgIds(prog(PS[2]()))).toContain('V-MSG-VOL');
    expect(weekVol(prog(PS[4]()), 'pectoraux')).toBeGreaterThanOrEqual(9);
  });

  it('T-D25-10 : T <= D (sauf séance réduite au noyau, avec V-MSG-DUREE) pour PS-4, PS-6, PS-7, PS-11 de 20 à 75 min', () => {
    for (const dur of [20, 30, 45, 60, 75])
      for (const p of [prog(PS[4]({ dur })), prog(PS[6]({ dur })), prog(PS[7]({ dur })), prog(PS[11](dur))])
        for (const s of p.sessions) {
          if (s.overBudget) expect(p.messages.some((m) => m.id === 'V-MSG-DUREE' && m.session === s.label)).toBe(true);
          else expect(s.estimatedSec, `${s.label} ${dur}`).toBeLessThanOrEqual(dur * 60);
        }
  });

  it('T-D25-11 : PS-11 (20 min) : poussee_1, E1 et première série E3 gardés ; noyau et plancher de core intacts', () => {
    const p = prog(PS[11](20));
    expect(labels(p)).toEqual(['HAUT-A', 'BAS-A', 'HAUT-B', 'BAS-B']);
    for (const s of p.sessions) {
      for (const n of TYPE_NOYAU[s.type]) expect(s.exercises.map((e) => e.slot)).toContain(n);
      expect(s.warmup.generalSec).toBeGreaterThan(0);
      for (const e of s.exercises.filter((x) => x.role === 'pilier' && x.chargeable)) expect(e.warmupSets.length).toBeGreaterThanOrEqual(1);
    }
    const tronc = p.sessions.flatMap((s) => s.exercises.filter((e) => e.slot === 'tronc'));
    expect(p.sessions.filter((s) => s.exercises.some((e) => e.slot === 'tronc')).length).toBeGreaterThanOrEqual(2);
    expect(tronc.reduce((a, e) => a + e.sets, 0)).toBeGreaterThanOrEqual(4);
  });

  it('T-D25-24 : 3 jours à 75 min : aucun muscle au-dessus de 20 ; un emplacement retiré pour le plafond n\'est jamais rajouté', () => {
    const p = prog(PS[20]());
    for (const m of muscles(p)) expect(weekVol(p, m), m).toBeLessThanOrEqual(VOLUME.maxPerMuscleWeek);
    expect(p.sessions.every((s) => s.estimatedSec <= 75 * 60)).toBe(true);
  });
});

describe('T-D25-12 à 16, 19, 22, 23 : débutant, jours légers, rotation, supersets, core, zone', () => {
  it('T-D25-12 : débutant à 4 jours : haut / bas, 2 séries, aucun superset, aucun CF3-CF5, aucune roue', () => {
    const p = prog(PS[8]());
    expect(labels(p)).toEqual(['HAUT-A', 'BAS-A', 'HAUT-B', 'BAS-B']);
    const all = p.sessions.flatMap((s) => s.exercises);
    expect(all.filter(FORCE).every((e) => e.sets <= 2)).toBe(true);
    expect(all.some((e) => e.supersetGroup)).toBe(false);
    expect(all.some((e) => e.coreFamily && !['gainage', 'anti_rotation'].includes(e.coreFamily))).toBe(false);
    expect(all.some((e) => ['roue-abdos', 'rollout-ballon'].includes(e.ficheId))).toBe(false);
  });

  it('T-D25-13 : débutant à 6 jours : 4 séances de force + 2 jours légers (sans charge), message STR-REP-6, hors fréquence', () => {
    const p = prog(PS[9]());
    expect(p.sessions).toHaveLength(4);
    // D30 (cardio-regles.md §3.2bis, objectif forme / santé, débutant : 1 séance dédiée) : un des 2 jours légers devient une séance de cardio modéré.
    expect(p.lightDays).toHaveLength(1);
    expect(p.cardioSessions?.map((c) => c.kind)).toEqual(['sante']);
    expect(p.lightDays.every((d) => d.estimatedMin <= 30 && d.mobility.length >= 1 && d.mobility.length <= 4)).toBe(true);
    expect(p.lightDays.map((d) => d.weekday).some((d) => p.sessions.some((s) => s.weekday === d))).toBe(false);
    expect(msgIds(p)).toContain('V-MSG-LEGERS');
    expect(Math.max(...Object.values(p.coverage))).toBeLessThanOrEqual(4);
  });

  it('T-D25-14 : fiches différentes : poussée horizontale de HAUT-A et de HAUT-B ; jambes_3 jamais la fiche de la charnière', () => {
    for (const p of [prog(PS[4]()), prog(PS[6]())]) {
      const ha = p.sessions.find((s) => s.label === 'HAUT-A')!;
      const hb = p.sessions.find((s) => s.label.endsWith('-B') && ['HAUT', 'PUSH'].includes(s.type))!;
      const h = (s: typeof ha) => s.exercises.filter((e) => e.schema === 'poussee_h').map((e) => e.ficheId);
      expect(h(ha).filter((id) => h(hb).includes(id))).toEqual([]);
      for (const s of p.sessions) {
        const ch = s.exercises.find((e) => e.slot === 'charniere')?.ficheId;
        const j3 = s.exercises.find((e) => e.slot === 'jambes_3')?.ficheId;
        if (ch && j3) expect(j3).not.toBe(ch);
      }
    }
  });

  it('T-D25-15 : « gagner du temps » : P1 seulement en HAUT-B, P3 seulement en BAS / LEGS, aucune paire en PUSH / PULL', () => {
    const gain = { gagnerDuTemps: true };
    for (const p of [prog(PS[5]({ options: gain })), prog(PS[4]({ options: gain })), prog(PS[6]({ options: gain })), prog(PS[7]({ options: gain }))]) {
      for (const s of p.sessions) {
        const groups = [...new Set(s.exercises.map((e) => e.supersetGroup).filter(Boolean))] as string[];
        for (const g of groups) {
          if (g.endsWith('P1')) expect(s.label).toBe('HAUT-B');
          if (g.endsWith('P3')) expect(['BAS', 'LEGS']).toContain(s.type);
        }
        if (s.type === 'PUSH' || s.type === 'PULL') expect(groups).toEqual([]);
      }
    }
    expect(prog(PS[5]({ options: gain })).sessions.find((s) => s.label === 'HAUT-B')!.exercises.some((e) => e.supersetGroup?.endsWith('P1'))).toBe(true);
  });

  it('T-D25-16 : core : plancher, séances désignées bas / legs, puis haut, puis pull ; familles qui tournent', () => {
    const order = (p: GenProgram) => p.sessions.filter((s) => s.exercises.some((e) => e.slot === 'tronc')).map((s) => s.label);
    expect(order(prog(PS[4]()))).toEqual(['HAUT-A', 'BAS-A', 'BAS-B']);
    expect(order(prog(PS[6]()))).toEqual(['HAUT-A', 'BAS-A', 'LEGS-B']);
    expect(order(prog(PS[7]()))).toEqual(['PULL-A', 'LEGS-A', 'LEGS-B']);
    for (const p of [prog(PS[4]()), prog(PS[6]()), prog(PS[7]())]) {
      const fams = p.sessions.flatMap((s) => s.exercises.filter((e) => e.slot === 'tronc').map((e) => e.coreFamily));
      for (let i = 1; i < fams.length; i++) expect(fams[i]).not.toBe(fams[i - 1]);
    }
  });

  it('T-D25-19 : épaule niveau 2 : haut / bas, chaque séance HAUT >= 3 exercices de force, V-MSG-ZONE, aucune série ajoutée', () => {
    const p = prog(PS[13]());
    expect(labels(p)).toEqual(['HAUT-A', 'BAS-A', 'HAUT-B', 'BAS-B']);
    for (const s of p.sessions.filter((x) => x.type === 'HAUT')) expect(s.exercises.filter(FORCE).length).toBeGreaterThanOrEqual(3);
    expect(msgIds(p)).toContain('V-MSG-ZONE');
    expect(p.sessions.flatMap((s) => s.exercises).every((e) => e.sets <= 3)).toBe(true);
    // STR-REP-14 (c) : à 5-6 jours, une zone épaule au niveau 2 ramène à 4 séances haut / bas + jours légers.
    const p6 = prog(PS[7]({ injuries: [['epaule', 2]] }));
    expect(labels(p6)).toEqual(['HAUT-A', 'BAS-A', 'HAUT-B', 'BAS-B']);
    expect(p6.lightDays).toHaveLength(2);
  });

  it('T-D25-22 : maison minimale puis salle : toujours un programme (V-MSG-IMPOS ou repli, jamais une erreur)', () => {
    for (const profile of ['A0', 'A', 'F']) expect(generateProgram(mk({ profile, days: 4, dur: 60, goal: 'muscle' })).ok).toBe(true);
  });

  it('T-D25-23 : débutant, lundi à vendredi libres : lundi HAUT-A, mardi BAS-A, jeudi HAUT-B, vendredi BAS-B', () => {
    const p = prog(PS[19]());
    expect(p.sessions.map((s) => [s.weekday, s.label])).toEqual([[0, 'HAUT-A'], [1, 'BAS-A'], [3, 'HAUT-B'], [4, 'BAS-B']]);
  });
});

describe('T-D25-17, 18, 20, 20b : cardio et grossesse', () => {
  it('T-D25-17 : cardio rang 2 en haut / bas : exactement 2 blocs, sur HAUT-A puis HAUT-B, >= 10 min, aucun jour de plus', () => {
    const p = prog(PS[14]());
    const withBlock = p.sessions.filter((s) => s.cardio);
    expect(withBlock.map((s) => s.label)).toEqual(['HAUT-A', 'HAUT-B']);
    for (const s of withBlock) {
      expect(s.cardio!.minutes).toBeGreaterThanOrEqual(CARDIO.blockMinMin);
      expect(s.cardio!.capMin).toBeLessThanOrEqual(Math.floor((s.estimatedSec / 60) * CARDIO.secondaryMaxShare));
      expect(s.cardio!.slowEndMin).toBe(CARDIO_V2.slowEndMin);
      expect(s.cardio!.intensity).toBe('facile');
    }
    expect(p.cardioSessions ?? []).toHaveLength(0);
    expect(p.sessions).toHaveLength(4);
  });

  it('T-D25-18 : cardio principal à 4 jours : 2 séances corps entier + 2 séances dédiées, aucune séance haut / bas', () => {
    const p = prog(PS[16]());
    expect(labels(p)).toEqual(['A', 'B']);
    expect(p.cardioSessions).toHaveLength(2);
    expect(p.cardioSessions!.every((c) => c.cardio.slowEndMin === CARDIO_V2.slowEndMin)).toBe(true);
  });

  it('T-D25-20 : grossesse (intermédiaire, 4 jours) : 3 séances corps entier non consécutives + 1 jour léger, <= 60 min, sans superset', () => {
    const p = prog({ ...PS[15](), options: { gagnerDuTemps: true } });
    expect(labels(p)).toEqual(['A', 'B', 'C']);
    expect(p.lightDays).toHaveLength(1);
    for (const a of p.sessions) for (const b of p.sessions) if (a !== b) expect(circGap(a.weekday, b.weekday)).toBeGreaterThanOrEqual(2);
    const all = p.sessions.flatMap((s) => s.exercises);
    expect(all.some((e) => e.supersetGroup)).toBe(false);
    expect(all.some((e) => e.coreFamily && !['gainage', 'anti_rotation'].includes(e.coreFamily))).toBe(false);
    expect(p.sessions.every((s) => s.estimatedSec <= 60 * 60)).toBe(true);
    expect(msgIds(p)).toContain('V-MSG-GROS-SEANCES');
    // Avec du cardio, le bloc finit en allure lente (STR-SEA-4) et reste à 15 min au plus (§3.4 j).
    const pc = prog({ ...PS[15](), goals: [{ goalKey: 'sante', rank: 1 }, { goalKey: 'cardio', rank: 2 }] });
    for (const c of pc.sessions.map((s) => s.cardio).filter(Boolean)) {
      expect(c!.slowEndMin).toBe(2);
      expect(Math.max(...c!.weekMin)).toBeLessThanOrEqual(15);
    }
  });

  it('T-D25-20b : grossesse débutante : 2 séances corps entier non consécutives + 2 jours légers, 1 série par exercice', () => {
    const p = prog(PS[18]());
    expect(labels(p)).toEqual(['A', 'B']);
    expect(p.lightDays).toHaveLength(2);
    expect(circGap(p.sessions[0].weekday, p.sessions[1].weekday)).toBeGreaterThanOrEqual(2);
    expect(p.sessions.flatMap((s) => s.exercises).filter(FORCE).every((e) => e.sets === 1)).toBe(true);
  });

  it('§3.7 (d) et §3.4 (f) : rang 3 = 1 bloc ; débutant rang 2 : 2e bloc à partir de la semaine 3, durées sans hausse', () => {
    const r3 = prog({ ...salle({ days: 3, dur: 75 }), goals: [{ goalKey: 'muscle', rank: 1 }, { goalKey: 'force', rank: 2 }, { goalKey: 'cardio', rank: 3 }] });
    expect(r3.sessions.filter((s) => s.cardio)).toHaveLength(1);
    // Débutant, cardio principal à 2 jours (un bloc après chaque séance, sans plafond de 25 %) : rampe de §3.4 (f).
    const deb = prog({ ...PRA({ days: 2, dur: 60 }), goals: [{ goalKey: 'cardio', rank: 1 }] });
    const blocks = deb.sessions.map((s) => s.cardio).filter(Boolean);
    expect(blocks).toHaveLength(2);
    expect(blocks.filter((b) => b!.fromWeek === CARDIO_V2.beginnerSecondBlockFromWeek)).toHaveLength(1);
    for (const b of blocks) expect(new Set(b!.weekMin.filter((m) => m > 0)).size).toBe(1);
    expect(deb.cardioMinWeek).toBe(10);
    // §3.4 (k) : corps entier = jambes lourdes : bloc facile, marche, 15 min au plus.
    for (const b of blocks) {
      expect(b!.intensity).toBe('facile');
      expect(CARDIO_V2.easyVariants).toContain(b!.variantId);
      expect(b!.capMin).toBeLessThanOrEqual(CARDIO_V2.easyMaxMin);
    }
  });

  it('rampe au lecteur : semaines 1-2 sans le 2e bloc, semaine 3 avec ; semaine comptée depuis le début du programme', () => {
    const d: ProgramDay = mkDay([mkEx({ variantId: 'pompe' }), { ...mkEx({ variantId: 'marche', role: 'cardio', slot: 'cardio' }), fromWeek: 3 }]);
    expect(withProgramWeek(d, 2).exercises).toHaveLength(1);
    expect(withProgramWeek(d, 3).exercises).toHaveLength(2);
    const start = { startDate: '2026-11-02' };
    expect(programWeek(start, new Date(2026, 10, 2, 9).getTime())).toBe(1);
    expect(programWeek(start, new Date(2026, 10, 15, 9).getTime())).toBe(2);
    expect(programWeek(start, new Date(2026, 10, 16, 9).getTime())).toBe(3);
  });
});

// ----- SUP-10 (core-et-supersets.md §13 ; T-D26-28a à e) -----
const dx = (o: Partial<DurExercise> & { slot: DurExercise['slot']; schema: string; musclesPrincipaux: string[] }): DurExercise => ({
  role: 'autre', sets: 3, repsMin: 10, repsMax: 15, unit: 'reps', holdSec: null, restSec: 90, unilateral: false, capped: false, adaptations: [],
  chargeable: false, warmupSets: [], supersetGroup: null, ficheId: o.schema, tags: ['poids_du_corps'], coreFamily: null, niveau: 'intermediaire', backLoaded: false,
  ...o,
});
const P1 = (veille?: string[] | null): DurSession => ({
  label: 'HAUT-B', days: 4, level: 'intermediaire', pregnant: false, e1Sec: 120, e2Count: 2, veille,
  exercises: [
    dx({ slot: 'poussee_2', schema: 'poussee_h', musclesPrincipaux: ['pectoraux'], ficheId: 'pompe' }),
    dx({ slot: 'tirage_2', schema: 'tirage_h', musclesPrincipaux: ['grand_dorsal'], ficheId: 'rowing-elastique', tags: ['elastique'] }),
  ],
});

describe('T-D26-28 : SUP-10, pas de paire sur un muscle principal de la veille', () => {
  it('T-D26-28a : veille avec le même muscle principal (pectoraux) : aucune paire P1, séries classiques', () => {
    expect(canPair(P1(['pectoraux', 'triceps']), 'P1')).toBe(false);
    expect(formAllPairs(P1(['pectoraux'])).exercises.every((e) => !e.supersetGroup)).toBe(true);
  });
  it('T-D26-28b : veille sans muscle commun, ou aucune séance la veille : paire possible ; veille inconnue : aucune paire', () => {
    expect(canPair(P1(['quadriceps', 'fessiers']), 'P1')).toBe(true);
    expect(canPair(P1([]), 'P1')).toBe(true);
    expect(canPair(P1(undefined), 'P1')).toBe(true);
    expect(canPair(P1(null), 'P1')).toBe(false);
  });

  const program = (days: ProgramDay[]): Program =>
    ({ id: 'p1', templateKey: null, name: 'x', split: 'haut_bas', startDate: '2026-11-02', weeks: 4, active: true, days, createdAt: '', updatedAt: '', deletedAt: null } as unknown as Program);
  const push = mkEx({ variantId: 'pompe', movementId: 'pompe' });
  const squat = mkEx({ variantId: 'squat', movementId: 'squat', slot: 'jambes_genou' });
  const cardio = mkEx({ variantId: 'marche', movementId: 'marche', role: 'cardio', slot: 'cardio' });
  const MUS: Record<string, string[]> = { pompe: ['pectoraux'], squat: ['quadriceps'], rowing: ['grand_dorsal'], marche: [] };
  const musclesOf = (e: { movementId: string }) => MUS[e.movementId] ?? null;
  const days = [
    { ...mkDay([push]), dayIndex: 0, weekday: 0 }, // lundi : poussée
    { ...mkDay([squat]), dayIndex: 1, weekday: 1 }, // mardi : jambes
    { ...mkDay([cardio]), dayIndex: 2, weekday: 2 }, // mercredi : cardio dédié
  ];
  const P = program(days);

  it('T-D26-28c : première séance du programme : aucune contrainte (veille avant le début)', () => {
    expect(veilleMuscles(P, [], '2026-11-02', musclesOf)).toEqual([]);
  });
  it('T-D26-28a (lecteur) : la veille (lundi) avait une poussée : la paire P1 du mardi est jouée en séries classiques', () => {
    expect(veilleMuscles(P, [], '2026-11-10', musclesOf)).toEqual(['pectoraux']);
    const pair = mkDay([mkEx({ variantId: 'pompe', movementId: 'pompe', supersetGroup: 'HAUT-B-P1' }), mkEx({ variantId: 'rowing', movementId: 'rowing', supersetGroup: 'HAUT-B-P1' })]);
    const ctx: EngineContext = { ...NEUTRAL_CONTEXT, isCalibration: () => false, mainMusclesOf: (e) => musclesOf(e) };
    const played = pairsForSession(pair, ctx, { veille: ['pectoraux'] });
    expect(played.exercises.map((e) => [e.supersetGroup, e.pairDeferred])).toEqual([[null, 'veille'], [null, 'veille']]);
    expect(pairsForSession(pair, ctx, { veille: ['quadriceps'] })).toBe(pair);
    expect(pairsForSession(pair, ctx, { veille: null }).exercises[0].pairDeferred).toBe('veille');
  });
  it('T-D26-28d : séance déplacée la veille (replanification) : sa date réelle compte ; muscles illisibles : doute, pas de paire', () => {
    const moved = { id: 's1', programId: 'p1', programDayIndex: 0, plannedDate: '2026-11-11', status: 'prevue', startedAt: null, deletedAt: null, plan: null } as unknown as WorkoutSession;
    // Jeudi 12/11 : la veille (mercredi) est un jour de cardio dans la semaine type, mais la séance de poussée y a été déplacée.
    expect(veilleMuscles(P, [moved], '2026-11-12', musclesOf)).toEqual(['pectoraux']);
    const unknown = { ...days[0], exercises: [mkEx({ variantId: 'inconnu', movementId: 'inconnu' })] };
    expect(veilleMuscles(program([unknown]), [], '2026-11-10', musclesOf)).toBeNull();
  });
  it('T-D26-28e : la veille est une séance de cardio dédié : elle ne compte pas, paire possible', () => {
    expect(veilleMuscles(P, [], '2026-11-12', musclesOf)).toEqual([]);
  });
  it('SUP-10 à la génération : aucune paire dont un muscle principal était principal la veille (semaine type)', () => {
    for (const p of [prog(PS[5]({ options: { gagnerDuTemps: true } })), prog(PS[4]({ options: { gagnerDuTemps: true } }))]) {
      for (const s of p.sessions) {
        const prev = p.sessions.find((x) => x.weekday === (s.weekday + 6) % 7);
        if (!prev) continue;
        const veille = new Set(prev.exercises.flatMap((e) => e.musclesPrincipaux));
        for (const e of s.exercises.filter((x) => x.supersetGroup)) expect(e.musclesPrincipaux.some((m) => veille.has(m)), `${s.label} ${e.ficheId}`).toBe(false);
      }
    }
  });
});
