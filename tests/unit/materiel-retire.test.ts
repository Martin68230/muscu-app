// Bug du 25/11/2026 : en retirant « sol / tapis » (case implicite décochée), des exercices au sol restaient proposés
// parce que des variantes au sol ne portaient que `poids_du_corps`. Un matériel retiré ne doit jamais laisser passer une fiche qui l'exige.
import { describe, expect, it } from 'vitest';
import { generateProgram } from '../../src/generator';
import { availableTags } from '../../src/generator/context';
import type { GeneratorInput } from '../../src/generator/types';
import { FICHES } from './generator-helpers';

const VARIANTS = FICHES.flatMap((f) => f.variantes);
const NOT_FLOOR_GEAR = ['banc', 'banc_inclinable', 'machine', 'poulie', 'swiss_ball', 'sangles_suspension', 'barre_traction', 'materiel_specialise', 'bosu'];

describe('matériel retiré : tapis / sol', () => {
  it('toute variante dont l\'installation se fait au sol porte le tag tapis', () => {
    const floor = /sur un tapis|allongé|sur le dosb|sur le ventre|en planche haute|assis au sol|à genoux (sur|dos)|au sol,? (mains|avant-bras)|mains au sol/i;
    const bad = VARIANTS.filter((v) => floor.test(v.installation ?? '') && !v.tags.includes('tapis') && !v.tags.some((t) => NOT_FLOOR_GEAR.includes(t))).map((v) => v.id);
    expect(bad).toEqual([]);
  });

  it('profil barre de traction + élastique, sol / tapis retiré : aucune variante au sol dans le programme', () => {
    for (const level of ['debutant', 'intermediaire', 'avance'] as const) {
      for (const goal of ['muscle', 'force', 'perte_gras']) {
        const input = {
          profile: { blockedWeekdays: [], place: 'maison', sessionDurationMin: 45, sports: [], level, daysPerWeek: 3 },
          equipment: { preset: 'perso', tags: ['barre_traction', 'elastique'], disabledImplicit: ['tapis'], dumbbellWeightsKg: [], kettlebellWeightsKg: [] },
          goals: [{ goalKey: goal, rank: 1 }], injuries: [], fiches: FICHES, options: {},
        } as unknown as GeneratorInput;
        const avail = availableTags(input.equipment);
        expect(avail.has('tapis')).toBe(false);
        const r = generateProgram(input);
        if (!r.ok) continue;
        const json = JSON.stringify(r.program);
        for (const v of VARIANTS.filter((x) => x.tags.includes('tapis'))) expect(json).not.toContain(`"${v.id}"`);
      }
    }
  });
});
