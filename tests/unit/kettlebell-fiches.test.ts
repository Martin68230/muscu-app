// Famille kettlebell (24/11/2026) : balayage de profils. Techniques jamais proposées ; sans kettlebell jamais de fiche kettlebell ;
// débutant : seulement les fiches kettlebell « simples » (CAL-12 : tests cal11-cal12).
import { describe, expect, it } from 'vitest';
import { KETTLEBELL_TECHNIQUE_FICHES } from '../../src/generator/config';
import { generateProgram } from '../../src/generator';
import { FICHES, LEVELS, PROFILE_KEYS, allEx, mk } from './generator-helpers';

const kbFiches = FICHES.filter((f) => f.variantes.some((v) => v.tags.includes('kettlebell')));
const DEBUTANT_OK = ['squat-gobelet', 'squat-sumo', 'rowing-penche-a-la-kettlebell', 'porte-un-haltere-epaule', 'porte-haltere-bras-leve'];

describe('famille kettlebell', () => {
  it('au moins 15 fiches avec une variante kettlebell, techniques exclues du générateur et de niveau >= intermédiaire', () => {
    expect(kbFiches.length).toBeGreaterThanOrEqual(15);
    for (const id of KETTLEBELL_TECHNIQUE_FICHES) {
      const f = FICHES.find((x) => x.id === id)!;
      expect(f, id).toBeTruthy();
      expect(f.niveauMin, id).not.toBe('debutant');
      expect(f.variantes.every((v) => v.niveau !== 'debutant'), id).toBe(true);
    }
  });

  it('balayage : jamais de technique, jamais de kettlebell sans le matériel, débutant restreint', () => {
    let vus = 0;
    for (const profile of PROFILE_KEYS) for (const level of LEVELS) for (const place of ['maison', 'salle'] as const) for (const kb of [false, true]) for (const neck of [false, true]) {
      const input = mk({ profile, level, place, extraTags: kb ? ['kettlebell'] : [], injuries: neck ? [['cou', 1]] : [] });
      const ex = allEx(generateProgram(input).program!);
      for (const e of ex) {
        expect(KETTLEBELL_TECHNIQUE_FICHES, `${e.ficheId} ${profile} ${level}`).not.toContain(e.ficheId);
        if (!e.tags.includes('kettlebell')) continue;
        vus++;
        expect(kb, `kettlebell sans matériel : ${e.ficheId} ${profile}`).toBe(true);
        if (level === 'debutant') expect(DEBUTANT_OK, `débutant : ${e.ficheId}`).toContain(e.ficheId);
      }
    }
    expect(vus).toBeGreaterThan(0);
  });
});
