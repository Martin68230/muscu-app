// Mollets dans les séances de jambes (14/11/2026, retour de l'utilisateur) : chaque séance BAS / LEGS contient un exercice de mollets quand une fiche admissible existe
// et que la place le permet. Balayage mesuré à la main (tools/mesure-mollets.mjs) : 810 séances de jambes, 461 sans mollets avant la garantie, 20 après (séances de 45 min pleines).
import { describe, expect, it } from 'vitest';
import { generateProgram } from '../../src/generator';
import { mk } from './generator-helpers';
import type { Level } from '../../src/data/model';

const isLegs = (l: string) => /^(BAS|LEGS)/.test(l);
const calfSets = (s: { exercises: { musclesPrincipaux: string[]; sets: number }[] }) => s.exercises.filter((e) => e.musclesPrincipaux.includes('mollets')).reduce((a, e) => a + e.sets, 0);

describe('mollets dans les séances de jambes', () => {
  it('aucune séance de jambes sans mollets (débutant, intermédiaire), exceptions avancées documentées', () => {
    const missing: string[] = [];
    let legs = 0;
    for (const level of ['debutant', 'intermediaire', 'avance'] as Level[]) for (const days of [3, 4, 5, 6]) for (const dur of [45, 75])
      for (const profile of ['A0', 'C', 'F']) for (const goal of ['muscle', 'force', 'perte_gras']) {
        const r = generateProgram(mk({ level, days, dur, profile, goal, place: profile === 'F' ? 'salle' : 'maison' }));
        if (!r.ok) continue;
        for (const s of r.program.sessions) {
          if (!isLegs(s.label)) continue;
          legs++;
          if (calfSets(s) === 0) missing.push(`${level} ${days}j ${dur} ${profile} ${goal} ${s.label}`);
        }
      }
    expect(legs).toBeGreaterThan(100);
    // Exceptions documentées : séances de 45 min déjà pleines (moins de 4 minutes libres pour 2 séries de mollets, ni exercice fonctionnel ni correctif à remplacer ; le tronc n'est jamais sacrifié), ou plafond de séance (avancé).
    expect(missing.filter((m) => !/ 45 /.test(m) && !m.startsWith('avance'))).toEqual([]);
    expect(missing.length).toBeLessThanOrEqual(Math.ceil(legs * 0.1));
  }, 600000);

  it('gastrocnémien et soléaire alternent dans deux séances de jambes d’une même semaine', () => {
    const r = generateProgram(mk({ level: 'intermediaire', days: 4, dur: 60, profile: 'C', goal: 'force' }));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const ids = r.program.sessions.filter((s) => isLegs(s.label)).map((s) => s.exercises.filter((e) => e.musclesPrincipaux.includes('mollets')).map((e) => e.ficheId).join(','));
    expect(ids.length).toBe(2);
    expect(ids.every((x) => x.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(2);
  }, 120000);

  it('douleur de cheville (niveau 3) : aucune fiche de mollets ajoutée', () => {
    const r = generateProgram(mk({ level: 'intermediaire', days: 4, dur: 60, profile: 'C', goal: 'muscle', injuries: [['cheville', 3]] }));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    for (const s of r.program.sessions) expect(s.exercises.filter((e) => e.schema === 'cheville_mollet' && e.slot === 'correctif')).toEqual([]);
  }, 120000);
});
