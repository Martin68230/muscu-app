// Lot cohérence (06/11/2026, docs/lot-coherence-bilans-intensite.md) : point 3 (durée des séances, ordre de remplissage, vraie raison
// d'un cardio absent) et point 5 a (jamais deux fiches jumelles : même schéma, mêmes muscles principaux et secondaires, dans une séance).
import { describe, expect, it } from 'vitest';
import { generateProgram } from '../../src/generator';
import { buildCtx } from '../../src/generator/context';
import { makePlaf, sessionCapsOk, splitCapsOk, weekCapsOk } from '../../src/generator/plaf';
import type { GeneratorInput, GenProgram, GenSession } from '../../src/generator/types';
import { FICHES } from './generator-helpers';

const eq = (tags: string[]) => ({ preset: 'perso' as const, tags, disabledImplicit: [], dumbbellWeightsKg: [2, 4, 6, 8, 10, 12, 14], kettlebellWeightsKg: [8, 12] });
const salle = { preset: 'F' as const, tags: [], disabledImplicit: [], dumbbellWeightsKg: [], kettlebellWeightsKg: [] };
const EL = ['elastique', 'mini_bande', 'poids_du_corps', 'tapis'];
const HE = ['halteres', 'elastique', 'chaise', 'poids_du_corps', 'tapis'];
const input = (o: { days: number; level?: string; dur: number | null; tags?: string[] | null; goals?: string[] }): GeneratorInput => ({
  profile: {
    blockedWeekdays: [], place: o.tags === null ? 'salle' : 'maison', salleAccess: o.tags === null, sessionDurationMin: o.dur, sports: [],
    level: o.level ?? 'intermediaire', daysPerWeek: o.days,
  } as GeneratorInput['profile'],
  equipment: o.tags === null ? salle : eq(o.tags ?? EL),
  goals: (o.goals ?? ['muscle']).map((g, i) => ({ goalKey: g, rank: i + 1 })),
  injuries: [], fiches: FICHES, options: { gagnerDuTemps: true },
});
const prog = (i: GeneratorInput): GenProgram => {
  const r = generateProgram(i);
  if (!r.ok) throw new Error(r.code);
  return r.program;
};
const totalSec = (s: GenSession) => s.estimatedSec + (s.cardio && !s.cardio.fromWeek ? s.cardio.minutes * 60 : 0);
const byId = new Map(FICHES.map((f) => [f.id, f]));
const same = (a: readonly string[], b: readonly string[]) => a.length === b.length && a.every((x) => b.includes(x));
const twins = (s: GenSession) =>
  s.exercises.flatMap((x, i) => s.exercises.slice(i + 1).filter((y) => {
    const fx = byId.get(x.ficheId)!;
    const fy = byId.get(y.ficheId)!;
    return fx.id !== fy.id && fx.schema === fy.schema && same(fx.musclesPrincipaux, fy.musclesPrincipaux) && same(fx.musclesSecondaires, fy.musclesSecondaires);
  }).map((y) => `${x.ficheId}=${y.ficheId}`));

describe('Point 3 : durée des séances', () => {
  it('« illimité » : jamais plus de 75 min (cardio compris) ; durée choisie : jamais dépassée ; plafonds tenus ; aucune séance vide', () => {
    // Grille réduite (durée de la suite) ; la grille large (1 920 programmes) a été passée une fois, voir generator-nonregression.test.ts.
    for (const goals of [['muscle', 'cardio'], ['force']])
      for (const days of [2, 3, 4, 5])
        for (const level of ['debutant', 'avance'])
          for (const tags of [EL, null])
            for (const dur of [45, null]) {
              const i = input({ days, level, dur, tags, goals });
              const p = prog(i);
              const plaf = makePlaf(buildCtx(i), 'slot');
              expect(weekCapsOk(p.sessions)).toBe(true);
              for (const s of p.sessions) {
                expect(s.exercises.length).toBeGreaterThan(0);
                if (!s.overBudget) expect(totalSec(s)).toBeLessThanOrEqual((dur ?? 75) * 60);
                expect(s.type !== 'CE' ? splitCapsOk(s.exercises, plaf) : sessionCapsOk(s, plaf)).toBe(true);
              }
            }
  }, 120_000);

  it('« illimité », intermédiaire, objectif muscle, 3 et 4 jours : séances plus proches de 60 min (40 min au moins)', () => {
    for (const days of [3, 4])
      for (const s of prog(input({ days, dur: null, tags: HE })).sessions) expect(s.estimatedSec).toBeGreaterThanOrEqual(40 * 60);
    // Avant le lot : 54, 48, 52 (3 jours) et 45, 42, 41, 32 min (4 jours) ; après : 55, 50, 57 et 52, 50, 52, 44 (plafonds de 20 séries / semaine pour
    // fessiers et épaules, 8 exercices par séance, 11 séries par muscle pour un ajout automatique : inchangés).
  });

  it('cas réel (élastique, 5 jours, muscle + cardio, « illimité ») : 2 blocs de cardio, jamais « pas assez de temps »', () => {
    const p = prog(input({ days: 5, dur: null, goals: ['muscle', 'cardio'] }));
    expect(p.sessions.filter((s) => s.cardio).length).toBe(2);
    expect(p.messages.map((m) => m.id)).not.toContain('V-MSG-CARDIO-TEMPS');
    expect(p.explanation.join(' ')).not.toContain('pas assez de temps');
    for (const s of p.sessions) expect(totalSec(s)).toBeLessThanOrEqual(75 * 60);
  });

  it('cardio absent loin de la limite : la vraie raison (part de 25 % de la musculation), jamais « pas assez de temps »', () => {
    const p = prog(input({ days: 2, level: 'debutant', dur: null, tags: ['poids_du_corps', 'tapis'], goals: ['muscle', 'cardio'] }));
    expect(p.sessions.some((s) => s.cardio)).toBe(false);
    const ids = p.messages.map((m) => m.id);
    expect(ids).toContain('V-MSG-CARDIO-PART');
    expect(ids).not.toContain('V-MSG-CARDIO-TEMPS');
    expect(p.explanation.join(' ')).toContain('limité à 25 % de ta musculation');
  });

  it('cardio « en plus » en dernier : le bloc ne retire jamais un exercice de musculation (même profil sans cardio)', () => {
    for (const dur of [45, null])
      for (const days of [3, 4]) {
        const withC = prog(input({ days, dur, tags: HE, goals: ['muscle', 'cardio'] }));
        const alone = prog(input({ days, dur, tags: HE, goals: ['muscle'] }));
        withC.sessions.forEach((s, i) => {
          const ids = (x: GenSession) => x.exercises.filter((e) => e.slot !== 'correctif' && e.slot !== 'fonctionnel').map((e) => e.ficheId);
          expect(ids(s)).toEqual(ids(alone.sessions[i]));
        });
      }
  }, 120_000);
});

describe('Point 5 a : jamais deux fiches jumelles dans une séance', () => {
  it('élastique, 4 jours : tirage_3 n\'est plus un 2e tirage vertical identique ; exercice utile à la place', () => {
    const p = prog(input({ days: 4, dur: null }));
    for (const s of p.sessions) {
      expect(twins(s)).toEqual([]);
      const t3 = s.exercises.find((e) => e.slot === 'tirage_3');
      const t1 = s.exercises.find((e) => e.slot === 'tirage_1');
      if (t3 && t1 && t1.schema === 'tirage_v' && t3.schema !== 'tirage_v') {
        expect(t3.musclesPrincipaux.some((m) => ['deltoides_posterieurs', 'biceps', 'avant_bras', 'trapezes'].includes(m))).toBe(true);
        expect(t3.musclesPrincipaux).not.toContain('grand_dorsal');
      }
    }
  });

  it('grille de profils : aucune fiche jumelle, aucune séance vide', () => {
    for (const goals of [['muscle'], ['sante']])
      for (const days of [3, 4, 5])
        for (const level of ['debutant', 'avance'])
          for (const tags of [EL, HE, null])
            for (const dur of [null]) {
              const r = generateProgram(input({ days, level, dur, tags, goals }));
              if (!r.ok) continue;
              for (const s of r.program.sessions) {
                expect(twins(s)).toEqual([]);
                expect(s.exercises.length).toBeGreaterThan(0);
              }
            }
  }, 120_000);
});
