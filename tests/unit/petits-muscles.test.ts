// 07/11/2026 : fiches avant-bras (correctif seulement), cou (jamais placé automatiquement, avis kine / C2).
import { describe, expect, it } from 'vitest';
import { generateProgram } from '../../src/generator';
import { NECK_DEDICATED_IDS } from '../../src/data/injury-rules';
import { mk } from './generator-helpers';

const FOREARM = ['essorage-serviette', 'flexion-poignet-avant-bras', 'extension-poignet-avant-bras'];
describe('Petits muscles : avant-bras et cou', () => {
  it('avant-bras : seulement en correctif, 2 séries au plus, jamais en grossesse ; cou : jamais placé', () => {
    let seen = 0;
    for (const profile of ['A0', 'B', 'F']) for (const preg of [null, 'enceinte'] as const) for (const goal of ['muscle', 'force']) {
      const r = generateProgram(mk({ profile, goal, days: 4, dur: 45, preg, place: profile === 'F' ? 'salle' : 'maison' }));
      if (!r.ok) continue;
      for (const e of r.program.sessions.flatMap((s) => s.exercises)) {
        expect(e.ficheId).not.toBe('renfo-cou-isometrique');
        if (FOREARM.includes(e.ficheId)) {
          seen++;
          expect(preg).toBeNull();
          expect(e.slot).toBe('correctif');
          expect(e.sets).toBeLessThanOrEqual(2);
        }
      }
    }
    expect(seen).toBeGreaterThan(0);
  });
  it('gêne au poignet : aucune fiche d\'avant-bras', () => {
    const r = generateProgram(mk({ profile: 'B', goal: 'muscle', days: 4, dur: 45, injuries: [['poignet', 1]] }));
    if (!r.ok) throw new Error(r.code);
    expect(r.program.sessions.flatMap((s) => s.exercises).some((e) => FOREARM.includes(e.ficheId))).toBe(false);
  });
  it('fiche cou réservée (défense en profondeur)', () => {
    expect(NECK_DEDICATED_IDS).toContain('renfo-cou-isometrique');
  });
});
