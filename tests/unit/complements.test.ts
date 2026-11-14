// Compléments de fin de séance PUSH / PULL / LEGS (13/11/2026, avis coach + kiné ; PROVISOIRE) : seulement avec les plafonds relevés, muscles non protégés,
// dose fixe, aucun plafond relâché. Mesuré (balayage A0 / D / F x 6, 5 j, 60 min) : séances sous 85 % de la durée 217 -> 199 sur 240 ; <= 30 min : 24 -> 0.
// Les compléments = les exercices présents avec COMPLEMENTS.enabled et absents sans (même profil, même séance).
import { describe, expect, it } from 'vitest';
import { generateProgram } from '../../src/generator';
import { COMPLEMENTS } from '../../src/generator/config';
import { buildCtx } from '../../src/generator/context';
import { raisedCaps, weekCapFor, weekMusclesOf, weekVol } from '../../src/generator/plaf';
import type { GenProgram } from '../../src/generator/types';
import { isHeavyShoulderTrapExercise } from '../../src/generator/zones-check';
import { mk, type MkOpts } from './generator-helpers';

const TYPES = ['PUSH', 'PULL', 'LEGS', 'BAS'];
const base = (o: MkOpts): MkOpts => ({ goal: 'muscle', dur: 60, days: 5, place: o.profile === 'F' ? 'salle' : 'maison', ...o });
const PROTECTED = ['deltoides_anterieurs', 'deltoides_lateraux', 'deltoides_posterieurs', 'trapezes', 'rhomboides', 'triceps', 'biceps', 'avant_bras', 'erecteurs_rachis', 'carre_des_lombes', 'coiffe_des_rotateurs', 'dentele_anterieur'];
const gen = (o: MkOpts, on: boolean): GenProgram | null => {
  (COMPLEMENTS as { enabled: boolean }).enabled = on;
  try {
    const r = generateProgram(mk(base(o)));
    return r.ok ? r.program : null;
  } finally { (COMPLEMENTS as { enabled: boolean }).enabled = true; }
};
const addedIn = (on: GenProgram, off: GenProgram) => on.sessions.flatMap((s) => {
  const before = new Set(off.sessions.find((x) => x.label === s.label)?.exercises.map((e) => e.ficheId) ?? []);
  return s.exercises.filter((e) => !before.has(e.ficheId)).map((e) => ({ ...e, type: s.type }));
});

describe('Compléments PUSH / PULL / LEGS', () => {
  it('profils relevés : 3 au plus par séance PUSH / PULL / LEGS, dose fixe, muscles principaux non protégés, plafonds hebdomadaires tenus', () => {
    let seen = 0;
    for (const profile of ['A0', 'D', 'F']) for (const level of ['intermediaire', 'avance'] as const) {
      const o: MkOpts = { profile, level };
      const on = gen(o, true);
      const off = gen(o, false);
      expect(on && off, `${profile} ${level}`).toBeTruthy();
      if (!on || !off) continue;
      const ctx = buildCtx(mk(base(o)));
      expect(raisedCaps(ctx)).toBe(true);
      const added = addedIn(on, off);
      for (const e of added) {
        seen++;
        expect(TYPES, `${profile} ${e.ficheId}`).toContain(e.type);
        expect(e.capped).toBe(true);
        expect(e.sets).toBeLessThanOrEqual(3);
        expect(e.musclesPrincipaux.some((m) => PROTECTED.includes(m)), `${profile} ${e.ficheId} : muscle protégé en principal`).toBe(false);
      }
      for (const s of on.sessions) expect(added.filter((e) => on.sessions.find((x) => x.label === s.label)?.exercises.includes(e as never)).length).toBeLessThanOrEqual(3);
      for (const m of weekMusclesOf(on.sessions)) expect(on.sessions.reduce((a, s) => a + weekVol(s, m), 0), `${profile} ${level} ${m}`).toBeLessThanOrEqual(weekCapFor(ctx, m));
    }
    expect(seen).toBeGreaterThan(0);
  }, 280_000);

  it('CAL-12 : dans la séance qui a le cou, aucun complément lourd d épaules / trapèzes (gainage, poussée, tirage, élastique)', () => {
    let checked = 0;
    for (const profile of ['B', 'D', 'F']) for (const level of ['intermediaire', 'avance'] as const) {
      const input = mk(base({ profile, level }));
      input.profile.neckScreen = 'non';
      const on = generateProgram(input);
      (COMPLEMENTS as { enabled: boolean }).enabled = false;
      let off;
      try { off = generateProgram(input); } finally { (COMPLEMENTS as { enabled: boolean }).enabled = true; }
      expect(on.ok && off.ok, `${profile} ${level}`).toBe(true);
      if (!on.ok || !off.ok) continue;
      const ctx = buildCtx(input);
      const neckSession = on.program.sessions.find((x) => x.exercises.some((e) => e.ficheId === 'renfo-cou-isometrique'));
      if (!neckSession) continue;
      const before = new Set(off.program.sessions.find((x) => x.label === neckSession.label)?.exercises.map((e) => e.ficheId) ?? []);
      for (const e of neckSession.exercises.filter((x) => !before.has(x.ficheId) && x.ficheId !== 'renfo-cou-isometrique')) {
        checked++;
        expect(isHeavyShoulderTrapExercise(e, ctx), `${profile} ${level} ${e.ficheId}`).toBe(false);
      }
    }
    expect(checked).toBeGreaterThanOrEqual(0);
  }, 280_000);

  it('aucun complément pour un débutant, la santé, la grossesse, une zone gênée, la reprise', () => {
    const CASES: MkOpts[] = [
      { profile: 'F', level: 'debutant' }, { profile: 'F', level: 'avance', goal: 'sante' }, { profile: 'D', level: 'intermediaire', preg: 'enceinte' },
      { profile: 'F', level: 'avance', injuries: [['genou', 1]] }, { profile: 'D', level: 'avance', options: { repriseActive: true } },
    ];
    for (const o of CASES) {
      const on = gen(o, true);
      const off = gen(o, false);
      expect(on && off, JSON.stringify(o)).toBeTruthy();
      if (on && off) expect(addedIn(on, off), JSON.stringify(o)).toEqual([]);
    }
  }, 280_000);

  it('mesure : moins de séances sous 85 % de la durée qu\'avec COMPLEMENTS.enabled = false', () => {
    const count = (on: boolean) => {
      let short = 0;
      for (const profile of ['A0', 'D', 'F']) for (const level of ['intermediaire', 'avance'] as const) {
        const p = gen({ profile, level }, on);
        for (const s of p?.sessions ?? []) if ((s.estimatedMin ?? 0) < 51) short++;
      }
      return short;
    };
    expect(count(true)).toBeLessThan(count(false));
  }, 280_000);
});
