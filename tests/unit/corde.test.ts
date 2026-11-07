// 07/11/2026 : cardio « Corde à sauter » (séance dédiée seulement, règles d'impact, message si refusée).
import { describe, expect, it } from 'vitest';
import { generateProgram } from '../../src/generator';
import { IMPACT_VARIANTS, ROPE } from '../../src/generator/config';
import type { GeneratorInput, GenProgram } from '../../src/generator/types';
import { mk, msgIds, type MkOpts } from './generator-helpers';

const prog = (i: GeneratorInput): GenProgram => {
  const r = generateProgram(i);
  if (!r.ok) throw new Error(`pas de programme : ${r.code}`);
  return r.program;
};
const withRope = (o: MkOpts = {}): GeneratorInput => {
  const i = mk({ goal: 'muscle', days: 2, dur: 60, level: 'intermediaire', extraTags: [ROPE.tag], ...o });
  return { ...i, options: { ...(i.options ?? {}), seanceCardio: true } };
};
const ropeSessions = (p: GenProgram) => (p.cardioSessions ?? []).filter((c) => c.cardio.variantId === ROPE.variantId);

describe('Corde à sauter', () => {
  it('impact déclaré, fiche connue', () => {
    expect(IMPACT_VARIANTS).toContain(ROPE.variantId);
  });
  it('avec la corde et sans exclusion : une séance dédiée, courte, fixe, jamais un bloc après la musculation', () => {
    const p = prog(withRope());
    const r = ropeSessions(p);
    expect(r.length).toBeLessThanOrEqual(ROPE.maxPerWeek);
    for (const c of r) expect(c.cardio.minutes).toBeLessThanOrEqual(10);
    expect(p.sessions.some((s) => s.cardio?.variantId === ROPE.variantId)).toBe(false);
    expect(msgIds(p)).not.toContain('V-MSG-CORDE');
  });
  it('sans la corde : jamais proposée, aucun message', () => {
    const p = prog(mk({ goal: 'muscle', days: 3, dur: 60, options: { seanceCardio: true } }));
    expect(ropeSessions(p)).toHaveLength(0);
    expect(msgIds(p)).not.toContain('V-MSG-CORDE');
  });
  it('genou ou cheville gênés : pas de corde, message qui dit pourquoi', () => {
    for (const zone of ['genou', 'cheville', 'dos'] as const) {
      const p = prog(withRope({ injuries: [[zone, 1]] }));
      expect(ropeSessions(p)).toHaveLength(0);
      expect(msgIds(p)).toContain('V-MSG-CORDE');
    }
  });
  it('grossesse et post-partum : pas de corde', () => {
    for (const preg of ['enceinte', 'post_partum'] as const) {
      const p = prog(withRope({ preg }));
      expect(ropeSessions(p)).toHaveLength(0);
      expect(msgIds(p)).toContain('V-MSG-CORDE');
    }
  });
  it('épaule ou poignet au niveau 2 : pas de corde', () => {
    for (const zone of ['epaule', 'poignet'] as const) expect(ropeSessions(prog(withRope({ injuries: [[zone, 2]] })))).toHaveLength(0);
  });
});
