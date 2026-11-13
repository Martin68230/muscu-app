import { describe, expect, it } from 'vitest';
import { ALL_OPTION_TAGS, ownedTags } from '../../src/data/equipment-options';
import { validateRow } from '../../src/data/validate';
import { generateProgram, type GenProgram, type GeneratorInput } from '../../src/generator';
import { allEx, FICHES, LEVELS, mk } from './generator-helpers';

// Décision du 06/11/2026 : l'ancrage d'élastique à une porte est un accessoire explicite (`ancrage_porte`), jamais supposé présent.
const ANCRAGE = FICHES.flatMap((f) => f.variantes.filter((v) => v.tags.includes('ancrage_porte')).map((v) => ({ f: f.id, v })));
const GOALS = ['muscle', 'force', 'fonctionnel', 'perte_de_poids'];

describe('ancrage_porte', () => {
  it('toute variante à ancrage garde `elastique`, aucune ne porte plus `porte`', () => {
    expect(ANCRAGE.length).toBe(15); // lot 4 (13/11/2026) : + extension-triceps-elastique-ancre-haut ; 11 + ecarte-elastique-porte (D23 vague 2 lot 1, 12/11/2026) + adduction-hanche-elastique-debout-cheville et extension-hanche-debout-elastique-cheville (lot 3, 13/11/2026) ; elles gardent bien `elastique`
    for (const { v } of ANCRAGE) expect(v.tags).toContain('elastique');
    expect(FICHES.flatMap((f) => f.variantes).filter((v) => v.tags.includes('porte'))).toHaveLength(0);
  });
  it('la case est décochée par défaut : non implicite, absente de ownedTags', () => {
    const e = { preset: 'perso' as const, tags: ['elastique', 'mini_bande'], disabledImplicit: [] } as never;
    expect(ownedTags(e).has('ancrage_porte')).toBe(false);
    expect(ALL_OPTION_TAGS).toContain('ancrage_porte');
  });
  it('profil élastique + mini-bande sans la case : jamais une variante à ancrage ; avec la case : elle redevient possible', () => {
    let withAnchor = 0;
    for (const level of LEVELS) for (const goal of GOALS) for (const days of [2, 3, 4]) {
      const base = { profile: 'A0', level, goal, days, dur: 60 };
      const without = allEx(prog(mk({ ...base, extraTags: ['elastique', 'mini_bande'] })));
      for (const e of without) expect(e.tags, `${e.variantId}`).not.toContain('ancrage_porte');
      const wit = allEx(prog(mk({ ...base, extraTags: ['elastique', 'mini_bande', 'ancrage_porte'] })));
      withAnchor += wit.filter((e) => e.tags.includes('ancrage_porte')).length;
    }
    expect(withAnchor).toBeGreaterThan(0);
  });
  it('la sauvegarde d\'un profil avec le tag est acceptée à l\'import', () => {
    const row = {
      id: 'e1', ownerId: 'u', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z', rev: 1, deletedAt: null, syncedAt: null,
      preset: 'perso', tags: ['elastique', 'ancrage_porte'], disabledImplicit: [], dumbbellWeightsKg: [], kettlebellWeightsKg: [],
    };
    expect(validateRow('equipment', row)).toEqual([]);
  });
});

function prog(i: GeneratorInput): GenProgram {
  const r = generateProgram(i);
  if (!r.ok) throw new Error(`pas de programme : ${r.code}`);
  return r.program;
}
