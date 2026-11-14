// Abducteurs et péroniers (13/11/2026) : balayage A0, B, D, F à 5 jours (60 et 75 min, intermédiaire et avancé) : ces deux zones ne restent jamais GRISES
// (mesuré : 0 sur 48 programmes ; orange : péroniers 20, abducteurs 7, jamais affichées : décision du 06/11/2026).
import { describe, expect, it } from 'vitest';
import { generateProgram, zoneReport } from '../../src/generator';
import { mk } from './generator-helpers';

describe('Abducteurs et péroniers : jamais gris à 5 jours', () => {
  it('balayage A0, B, D, F, intermédiaire et avancé, 60 et 75 min, prise de muscle', () => {
    let n = 0;
    for (const profile of ['A0', 'B', 'D', 'F']) for (const level of ['intermediaire', 'avance'] as const) for (const dur of [60, 75]) {
      const input = mk({ profile, level, dur, goal: 'muscle', days: 5, place: profile === 'F' ? 'salle' : 'maison' });
      const r = generateProgram(input);
      expect(r.ok, `${profile} ${level} ${dur}`).toBe(true);
      if (!r.ok) continue;
      const grey = zoneReport(r.program, input).grey;
      expect(grey, `${profile} ${level} ${dur}`).not.toContain('abducteurs');
      expect(grey, `${profile} ${level} ${dur}`).not.toContain('peroniers');
      n++;
    }
    expect(n).toBe(16);
  }, 300_000);
});
