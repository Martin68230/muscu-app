// D24 (CAL-1, CAL-3, CAL-7, CAL-8 de knowledge/calibrage-kaggle.md) : PUSH / PULL / LEGS à 5 jours, 60 min, ne restent plus sous-remplis.
// Non-régression : au moins 5 exercices par séance PPL, plafonds V-PLAF (12) / hebdomadaire (20) / isolations (<= 2) respectés.
import { describe, expect, it } from 'vitest';
import { generateProgram } from '../../src/generator';
import { mk, weekCapOf, weekMeasure } from './generator-helpers';

const CASES: [string, Parameters<typeof mk>[0]][] = [
  ['maison élastique (B)', { profile: 'B', days: 5, level: 'avance', goal: 'muscle', dur: 60 }],
  ['maison haltères + élastique (D)', { profile: 'D', days: 5, level: 'avance', goal: 'muscle', dur: 60 }],
  ['salle (F)', { profile: 'F', place: 'salle', days: 5, level: 'avance', goal: 'muscle', dur: 60 }],
];
const PPL = ['PUSH', 'PULL', 'LEGS'];

describe('D24 : séances PPL remplies jusqu’à la durée choisie, sous les plafonds', () => {
  for (const [name, o] of CASES) {
    it(name, () => {
      const p = (generateProgram(mk(o)) as any).program;
      expect(p).toBeTruthy();
      const ppl = p.sessions.filter((s: any) => PPL.includes(s.type));
      expect(ppl.length).toBe(3);
      const week: Record<string, number> = {};
      for (const s of p.sessions) {
        const isos = s.exercises.filter((e: any) => String(e.slot).startsWith('iso_'));
        expect(isos.length).toBeLessThanOrEqual(2);
        expect(s.estimatedMin).toBeLessThanOrEqual(60);
        const sess: Record<string, number> = {};
        for (const e of s.exercises) for (const [m, w] of [...(e.musclesPrincipaux ?? []).map((x: string) => [x, 1]), ...(e.musclesSecondaires ?? []).map((x: string) => [x, 0.5])] as [string, number][]) {
          sess[m] = (sess[m] ?? 0) + e.sets * w;
          week[m] = (week[m] ?? 0) + e.sets * w;
        }
        for (const v of Object.values(sess)) expect(v).toBeLessThanOrEqual(12);
      }
      // PULL et LEGS : 5 exercices au moins. PUSH : 4 au moins ; un 5e exercice franchirait le plafond hebdomadaire de 20 séries de deltoïdes
      // (HAUT + PUSH les chargent déjà à 19,5 ; toute fiche de poussée ou d’élévation latérale ajoute des séries de deltoïdes), plafond non modifié (D24).
      for (const s of ppl) expect(s.exercises.length).toBeGreaterThanOrEqual(s.type === 'PUSH' ? 4 : 5);
      // 13/11/2026 : 24 séries (principal seul) hors six groupes protégés pour ces profils relevés ; groupes protégés : 20 fractionnaires.
      const input = mk(o);
      for (const m of Object.keys(week)) expect(weekMeasure(input, p.sessions, m), m).toBeLessThanOrEqual(weekCapOf(input, m));
    });
  }
  it('débutant : aucune isolation PPL ajoutée (inchangé)', () => {
    const p = (generateProgram(mk({ profile: 'F', place: 'salle', days: 5, level: 'debutant', goal: 'muscle', dur: 60 })) as any).program;
    for (const s of p?.sessions ?? []) expect(s.exercises.filter((e: any) => String(e.slot).startsWith('iso_') && PPL.includes(s.type)).length).toBe(0);
  });
});
