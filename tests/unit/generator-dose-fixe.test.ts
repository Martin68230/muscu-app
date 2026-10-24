// N4 (recontrôle lot-08-ballons-roue) / docs/QUESTIONS.md Q23 : dose fixe des lancers au ballon lesté et du gainage
// dynamique (src/generator/config.ts FIXED_DOSE, NON SOURCÉ, choix prudent). Les fiches sont lues depuis knowledge/
// (statut `complete_kine`, absentes de public/data/fiches.json) et passées « utilisable » en mémoire pour le test seulement.
// @ts-ignore -- types Node absents du tsconfig de l'app ; ce fichier ne tourne que sous Vitest (Node)
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { generateProgram } from '../../src/generator';
import { FIXED_DOSE, TEMPS_RIR_PLACEHOLDER } from '../../src/generator/config';
import { buildCtx } from '../../src/generator/context';
import { buildExercise } from '../../src/generator/dose';
import type { Candidate } from '../../src/generator/safety';
import type { Fiche, GenExercise, SlotKey } from '../../src/generator/types';
import { buildFiche } from '../../tools/build-fiches.mjs';
import { allEx, FICHES, LEVELS, mk } from './generator-helpers';

const DIR = 'knowledge/exercices/vague1/lot-08-ballons-roue';
const LANCERS = ['lancer-poitrine-mur', 'lancer-bas-haut-mur', 'squat-lancer-mur', 'lancer-rotation-mur'];
const DYNAMIQUES = ['roue-abdos', 'rollout-ballon', 'genoux-poitrine-ballon'];
const IDS = [...LANCERS, ...DYNAMIQUES, 'planche-cercles-ballon'];

/** Dose attendue, recopiée des fiches (section dosage), indépendamment de config.ts. */
const EXPECTED: Record<string, { unit: string; reps: [number, number]; sets: number; restSec: number }> = {
  'lancer-poitrine-mur': { unit: 'reps', reps: [6, 8], sets: 2, restSec: 90 },
  'lancer-bas-haut-mur': { unit: 'reps', reps: [6, 8], sets: 2, restSec: 90 },
  'squat-lancer-mur': { unit: 'reps', reps: [6, 8], sets: 2, restSec: 90 },
  'lancer-rotation-mur': { unit: 'reps_par_cote', reps: [6, 8], sets: 2, restSec: 90 },
  'roue-abdos': { unit: 'reps', reps: [6, 8], sets: 2, restSec: 60 },
  'rollout-ballon': { unit: 'reps', reps: [6, 8], sets: 2, restSec: 60 },
  'genoux-poitrine-ballon': { unit: 'reps', reps: [6, 8], sets: 2, restSec: 60 },
  'planche-cercles-ballon': { unit: 'reps_par_cote', reps: [5, 8], sets: 2, restSec: 60 },
};

const LOT: Fiche[] = IDS.map((id) => {
  const { fiche } = buildFiche(readFileSync(`${DIR}/${id}.md`, 'utf8'), `${id}.md`);
  return { ...fiche, statut: 'utilisable' } as Fiche;
});
const SLOTS: SlotKey[] = ['jambes_genou', 'poussee_1', 'charniere', 'tronc', 'poussee_2', 'jambes_2', 'fonctionnel'];
const GOALS = ['muscle', 'force', 'sante'];
const cand = (fiche: Fiche, variant: Fiche['variantes'][number]): Candidate => ({
  fiche, variant, origin: fiche, adapted: false, capped: false, adaptations: [], notes: [], replaces: null,
});

function expectFixed(e: GenExercise, opts: { pregnantBeginner?: boolean } = {}) {
  const x = EXPECTED[e.ficheId];
  expect(x, e.ficheId).toBeDefined();
  expect([e.repsMin, e.repsMax]).toEqual(x.reps);
  expect(e.unit).toBe(x.unit);
  expect(e.restSec).toBe(x.restSec);
  expect(e.holdSec).toBeNull();
  // P-GROS ne fait que baisser : 1 série pour une débutante enceinte, sinon la dose de la fiche.
  expect(e.sets).toBe(opts.pregnantBeginner ? 1 : x.sets);
  // Jamais de réserve demandée (pas d'échec), jamais de charge à progresser.
  expect(e.rirAsked).toBe(false);
  expect(e.rirTarget).toBe(TEMPS_RIR_PLACEHOLDER);
  expect(e.rirTarget).toBeGreaterThan(0);
  expect(e.chargeable).toBe(false);
  expect(e.startLoadKg).toBeNull();
  // Jamais les 10-15 répétitions de V-DOSE ni de maintien en secondes.
  expect(e.repsMax).toBeLessThanOrEqual(8);
  expect(e.repsMin).toBeLessThan(10);
}

describe('N4 / Q23 : dose fixe des lancers et du gainage dynamique', () => {
  it('config : les 8 fiches citées, et elles seules, ont une dose fixe identique aux fiches', () => {
    expect(Object.keys(FIXED_DOSE).sort()).toEqual([...IDS].sort());
    for (const id of IDS) {
      const d = FIXED_DOSE[id];
      expect({ unit: d.unit, reps: d.reps, sets: d.sets, restSec: d.restSec }, id).toEqual(EXPECTED[id]);
    }
  });

  it('les fiches sont bien lues, identifiées par leur id et sans variante à saut', () => {
    expect(LOT.map((f) => f.id)).toEqual(IDS);
    for (const f of LOT) {
      expect(f.variantes.length).toBeGreaterThan(0);
      for (const v of f.variantes) expect(`${v.id} ${v.nom}`.toLowerCase().replace(/sans saut/g, ''), v.id).not.toMatch(/saut|bond|jump/);
    }
    for (const id of LANCERS) for (const v of LOT.find((f) => f.id === id)!.variantes) expect(v.tags).toContain('medecine_ball');
  });

  it('buildExercise : chaque variante, chaque niveau, chaque famille, chaque emplacement -> dose de la fiche', () => {
    let n = 0;
    for (const level of LEVELS)
      for (const goal of GOALS) {
        const ctx = buildCtx(mk({ profile: 'E', level, goal }));
        for (const f of LOT)
          for (const v of f.variantes)
            for (const slot of SLOTS) {
              expectFixed(buildExercise(cand(f, v), slot, 'a', ctx));
              n++;
            }
      }
    expect(n).toBeGreaterThan(100);
  });

  it('historique avec charge : toujours pas de charge, pas de répétitions de V-DOSE', () => {
    const f = LOT.find((x) => x.id === 'squat-lancer-mur')!;
    const v = f.variantes[0];
    const ctx = buildCtx(mk({ profile: 'E', level: 'avance', goal: 'force',
      history: [{ variantId: v.id, loadKg: 6, pain: false, completedAt: '2026-10-20T10:00:00Z' }] }));
    expectFixed(buildExercise(cand(f, v), 'jambes_genou', 'a', ctx));
  });

  it('grossesse : la dose ne monte jamais (1 série pour une débutante), répétitions inchangées', () => {
    for (const level of LEVELS) {
      const ctx = buildCtx(mk({ profile: 'E', level, preg: 'enceinte' }));
      for (const f of LOT) expectFixed(buildExercise(cand(f, f.variantes[0]), 'tronc', 'a', ctx), { pregnantBeginner: level === 'debutant' });
    }
  });

  it('générateur complet : toute fiche placée reçoit sa dose fixe, jamais 10-15 répétitions', () => {
    const fiches = [...FICHES, ...LOT];
    const placed = new Set<string>();
    for (const level of ['intermediaire', 'avance'] as const)
      for (const goal of GOALS)
        for (const days of [2, 3])
          for (const dur of [45, 75]) {
            // Bibliothèque réelle + les 8 fiches : le classement place surtout les lancers.
            const r = generateProgram(mk({ profile: 'E', level, goal, days, dur, fiches }));
            if (!r.ok) continue;
            for (const e of allEx(r.program)) {
              if (!IDS.includes(e.ficheId)) continue;
              placed.add(e.ficheId);
              expectFixed(e);
            }
          }
    // Puis on force : seules les fiches N4 couvrent leurs schémas (gainage dynamique compris). Échauffement E3 sans charge.
    const schemas = new Set(LOT.map((f) => f.schema));
    const only = [...FICHES.filter((f) => !schemas.has(f.schema)), ...LOT];
    for (const level of ['intermediaire', 'avance'] as const)
      for (const goal of GOALS) {
        const r = generateProgram(mk({ profile: 'E', level, goal, days: 3, dur: 75, fiches: only }));
        if (!r.ok) continue;
        for (const e of allEx(r.program)) {
          if (!IDS.includes(e.ficheId)) continue;
          placed.add(e.ficheId);
          expectFixed(e);
          expect(e.warmupSets.every((w) => w.percent === null)).toBe(true);
        }
      }
    expect(placed.size).toBeGreaterThanOrEqual(4);
  });
});
