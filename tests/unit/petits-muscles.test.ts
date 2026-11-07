// 07/11/2026 : fiches avant-bras (correctif seulement), cou (placement sous conditions du kiné : dépistage « Non, rien »).
import { describe, expect, it } from 'vitest';
import { generateProgram } from '../../src/generator';
import { CORRECTIF_COU } from '../../src/generator/config';
import { NECK_DEDICATED_IDS } from '../../src/data/injury-rules';
import { hasHeavyShoulderTrap } from '../../src/generator/zones-check';
import { buildCtx } from '../../src/generator/context';
import { mk } from './generator-helpers';

const FOREARM = ['essorage-serviette', 'flexion-poignet-avant-bras', 'extension-poignet-avant-bras'];
describe('Petits muscles : avant-bras et cou', () => {
  it('avant-bras : seulement en correctif, 2 séries au plus, jamais en grossesse ; cou : voir plus bas', () => {
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
  it('fiche cou : plus en réserve (placement activé)', () => {
    expect(NECK_DEDICATED_IDS).not.toContain('renfo-cou-isometrique');
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
  it('activé : « Non, rien » place le cou pour un débutant sans signe', () => {
    expect(CORRECTIF_COU.enabled).toBe(true);
    let seen = 0;
    for (const days of [2, 3]) seen += neckEx({ level: 'debutant', profile: 'B', days, dur: 30 }, 'non').length;
    expect(seen).toBeGreaterThan(0);
  });
  it('placé en correctif : variante simple, 1 série de 3 s, jamais plus, sans progression, au plus une fois par semaine', () => {
    for (const level of ['debutant', 'intermediaire'] as const) for (const profile of ['A0', 'B', 'F']) {
      const i = mk({ goal: 'muscle', days: 4, dur: 45, level, profile, place: profile === 'F' ? 'salle' : 'maison' });
      const r = generateProgram({ ...i, profile: { ...i.profile, neckScreen: 'non' } });
      if (!r.ok) continue;
      const list = r.program.sessions.flatMap((s) => s.exercises).filter((e) => e.ficheId === NECK);
      expect(list.length).toBeLessThanOrEqual(1);
      for (const e of list) {
        expect(e.slot).toBe('correctif');
        expect(e.variantId).toBe('renfo-cou-simple');
        expect(e.sets).toBe(1);
        expect(e.holdSec).toBe(3);
        expect(e.repsMax).toBeLessThanOrEqual(CORRECTIF_COU.holds);
        expect(e.capped).toBe(true);
        expect(e.cappedLabel).toContain('Arrête tout de suite');
      }
    }
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
    expect(neckEx({ profile: 'A0', injuries: [['epaule', 3]] }, 'non')).toHaveLength(0);
    expect(neckEx({ profile: 'A0', injuries: [['dos', 3]] }, 'non')).toHaveLength(0);
  });
  it('reprise : aucun exercice de cou', () => {
    const i = mk({ profile: 'A0', goal: 'muscle', days: 4, dur: 45 });
    const r = generateProgram({ ...i, profile: { ...i.profile, neckScreen: 'non' }, options: { ...i.options, repriseActive: true } });
    if (r.ok) expect(r.program.sessions.flatMap((s) => s.exercises).some((e) => e.ficheId === NECK)).toBe(false);
  });
  it('jamais dans une séance avec un exercice lourd de trapèzes ou d’épaules', () => {
    for (const profile of ['B', 'F']) for (const level of ['intermediaire', 'avance'] as const) {
      const i = mk({ goal: 'muscle', days: 4, dur: 60, level, profile, place: 'salle' });
      const r = generateProgram({ ...i, profile: { ...i.profile, neckScreen: 'non' } });
      if (!r.ok) continue;
      for (const s of r.program.sessions) {
        if (!s.exercises.some((e) => e.ficheId === NECK)) continue;
        expect(hasHeavyShoulderTrap(s, buildCtx(i, {}))).toBe(false);
      }
    }
  });
  it('PPL muscle non débutant avec cou : jamais le cou avec un exercice lourd épaules ou trapèzes', () => {
    for (const level of ['intermediaire', 'avance'] as const) for (const days of [3, 4, 5, 6]) for (const dur of [45, 60, 75]) {
      const i = mk({ goal: 'muscle', days, dur, level, profile: 'F', place: 'salle' });
      const r = generateProgram({ ...i, profile: { ...i.profile, neckScreen: 'non' } });
      if (!r.ok) continue;
      for (const s of r.program.sessions) {
        if (!s.exercises.some((e) => e.ficheId === NECK)) continue;
        expect(hasHeavyShoulderTrap(s, buildCtx(i, {}))).toBe(false);
      }
    }
  });
});
