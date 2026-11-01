// Gêne nette (niveau 2) sur épaule, cheville, genou ou hanche : le programme reste complet (aucune séance vide) ;
// pour l'épaule, la famille poussée verticale (schéma poussee_v) n'est plus proposée et d'autres exercices la remplacent.
import { describe, expect, it } from 'vitest';
import { generateProgram } from '../../src/generator/index';
import { allEx, mk } from './generator-helpers';
import type { InjuryZone } from '../../src/data/model';

const PROFILS = [
  ['C', 'maison'],
  ['F', 'salle'],
] as const;
const ZONES_N2: InjuryZone[] = ['epaule', 'cheville', 'genou', 'hanche'];

describe('zone niveau 2 : séances jamais vides', () => {
  for (const zone of ZONES_N2)
    for (const [profile, place] of PROFILS)
      it(`${zone} niveau 2, profil ${profile} (${place}) : chaque séance a au moins 4 exercices`, () => {
        const r = generateProgram(mk({ profile, place, injuries: [[zone, 2]] }));
        expect(r.ok).toBe(true);
        if (!r.ok) return;
        expect(r.program.sessions.length).toBeGreaterThan(0);
        for (const s of r.program.sessions) expect(s.exercises.length).toBeGreaterThanOrEqual(4);
      });

  for (const [profile, place] of PROFILS)
    it(`épaule niveau 2, profil ${profile} (${place}) : aucune poussée verticale, remplacée par d'autres exercices`, () => {
      const r = generateProgram(mk({ profile, place, injuries: [['epaule', 2]] }));
      expect(r.ok).toBe(true);
      if (!r.ok) return;
      const ex = allEx(r.program);
      expect(ex.filter((e) => e.schema === 'poussee_v').map((e) => e.ficheId)).toEqual([]);
      expect(ex.length).toBeGreaterThan(0);
    });
});
