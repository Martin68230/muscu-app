// 07/11/2026 (décision de l'utilisateur) : cible de 4 séances avec tronc à 5 et 6 jours : PULL et LEGS en ont, PUSH jamais.
import { describe, expect, it } from 'vitest';
import { generateProgram } from '../../src/generator';
import { mk } from './generator-helpers';

describe('Tronc en push / pull / legs', () => {
  it.each([5, 6])('%i jours : chaque séance PULL et LEGS a du tronc, PUSH jamais', (days) => {
    for (const goal of ['muscle', 'force']) {
      const r = generateProgram(mk({ goal, days, dur: 60, level: 'intermediaire', place: 'salle', profile: 'F' }));
      if (!r.ok) throw new Error(r.code);
      const tronc = (t: string) => r.program.sessions.filter((s) => s.type === t).map((s) => s.exercises.filter((e) => e.slot === 'tronc').length);
      expect(tronc('PUSH').every((n) => n === 0)).toBe(true);
      expect(tronc('PULL').every((n) => n >= 1)).toBe(true);
      expect(tronc('LEGS').every((n) => n >= 1)).toBe(true);
    }
  });
});

// Conditions du kiné (07/11/2026) : tronc deux jours de suite = pas deux familles hors CF1/CF2, plafond 12 séries / semaine.
import { coreFamilyOf } from '../../src/generator/core';
import { CORE_MAX, CORE_SAFE_FAMILIES } from '../../src/generator/config';
import { FICHES } from './generator-helpers';

describe('Tronc en PPL : conditions du kiné', () => {
  const profiles = [
    {}, { injuries: [['dos', 1]] }, { injuries: [['dos', 2]] }, { level: 'debutant' }, { preg: 'enceinte' }, { preg: 'post_partum' }, { place: 'maison', profile: 'C' },
  ] as const;
  it.each([5, 6])('%i jours : plafond hebdomadaire et jours consécutifs', (days) => {
    for (const goal of ['muscle', 'force']) for (const extra of profiles) {
      const r = generateProgram(mk({ goal, days, dur: 60, level: 'intermediaire', place: 'salle', profile: 'F', ...(extra as object) }));
      if (!r.ok) continue;
      const per = new Map<number, { sets: number; unsafe: boolean }>();
      for (const s of r.program.sessions) {
        const t = s.exercises.filter((e) => e.slot === 'tronc');
        const unsafe = t.some((e) => {
          const fam = coreFamilyOf(FICHES.find((f) => f.id === e.movementId)!);
          return !!fam && !CORE_SAFE_FAMILIES.includes(fam);
        });
        per.set(s.weekday, { sets: t.reduce((a, e) => a + e.sets, 0), unsafe });
      }
      const total = [...per.values()].reduce((a, x) => a + x.sets, 0);
      expect(total, JSON.stringify(extra)).toBeLessThanOrEqual(CORE_MAX.setsPerWeek);
      for (const [d, x] of per) {
        const next = per.get((d + 1) % 7);
        if (next && x.sets > 0 && next.sets > 0) expect(x.unsafe && next.unsafe, `${days} ${goal} ${JSON.stringify(extra)}`).toBe(false);
      }
    }
  });
});
