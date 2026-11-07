// 07/11/2026 : fiches avant-bras (correctif seulement), cou (placement sous conditions du kiné : dépistage « Non, rien »).
import { describe, expect, it } from 'vitest';
import { generateProgram } from '../../src/generator';
import { CORRECTIF_COU } from '../../src/generator/config';
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
  it('fiche cou : réservée tant que le placement est désactivé', () => {
    expect(NECK_DEDICATED_IDS).toContain('renfo-cou-isometrique');
  });
});

const NECK = 'renfo-cou-isometrique';
const neckEx = (o: Parameters<typeof mk>[0], neckScreen?: 'non' | 'oui' | 'refus') => {
  const i = mk({ goal: 'muscle', days: 4, dur: 45, ...o });
  const r = generateProgram({ ...i, profile: { ...i.profile, neckScreen } });
  if (!r.ok) return [];
  return r.program.sessions.flatMap((s) => s.exercises).filter((e) => e.ficheId === NECK);
};
describe('Cou : placement automatique sous conditions (kiné, 07/11/2026)', () => {
  it('désactivé (2 bloquants du relecteur) : aucun exercice de cou, même après « Non, rien »', () => {
    expect(CORRECTIF_COU.enabled).toBe(false);
    for (const a of [undefined, 'non', 'oui', 'refus'] as const) expect(neckEx({ profile: 'A0' }, a)).toHaveLength(0);
  });
  it.skipIf(!CORRECTIF_COU.enabled)('« Non, rien » : placé en correctif, variante simple, 1 série de 2 maintiens de 3 s, avec le message d’arrêt, même débutant', () => {
    let seen = 0;
    for (const level of ['debutant', 'intermediaire'] as const) for (const profile of ['A0', 'B', 'F']) {
      for (const e of neckEx({ level, profile, place: profile === 'F' ? 'salle' : 'maison' }, 'non')) {
        seen++;
        expect(e.slot).toBe('correctif');
        expect(e.variantId).toBe('renfo-cou-simple');
        expect(e.sets).toBe(1);
        expect(e.holdSec).toBe(3);
        expect(e.cappedLabel).toContain('Arrête tout de suite');
      }
    }
    expect(seen).toBeGreaterThan(0);
  });
  it('sans réponse, « Oui » ou « Je préfère ne pas répondre » : aucun exercice de cou', () => {
    for (const a of [undefined, 'oui', 'refus'] as const) expect(neckEx({ profile: 'A0' }, a)).toHaveLength(0);
  });
  it('grossesse, post-partum, cou déclaré, épaule ou dos au niveau 2 : aucun exercice de cou', () => {
    expect(neckEx({ profile: 'A0', preg: 'enceinte' }, 'non')).toHaveLength(0);
    expect(neckEx({ profile: 'A0', preg: 'post_partum' }, 'non')).toHaveLength(0);
    expect(neckEx({ profile: 'A0', injuries: [['cou', 1]] }, 'non')).toHaveLength(0);
    expect(neckEx({ profile: 'A0', injuries: [['epaule', 2]] }, 'non')).toHaveLength(0);
    expect(neckEx({ profile: 'A0', injuries: [['dos', 2]] }, 'non')).toHaveLength(0);
  });
});
