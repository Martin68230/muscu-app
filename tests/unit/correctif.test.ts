// Emplacement correctif (06/11/2026, src/generator/zones-check.ts addCorrectifs) : petites zones restées grises (SLOTLESS_ZONES) couvertes
// en fin de séance par 1 à 2 exercices légers (listes fermées CORRECTIF), jamais au-delà de la durée, des plafonds ni d'une case de sécurité.
import { describe, expect, it } from 'vitest';
import { generateProgram, zoneReport } from '../../src/generator';
import { CORRECTIF } from '../../src/generator/config';
import { buildCtx } from '../../src/generator/context';
import { estimerDuree } from '../../src/generator/duration';
import { caseFor } from '../../src/generator/safety';
import { addCorrectifs, checkZones, correctifCandidates, slotlessFor, SLOTLESS_ZONES } from '../../src/generator/zones-check';
import type { GeneratorInput, GenExercise } from '../../src/generator/types';
import { zonesOfInjury } from '../../src/zones/zones';
import { FICHES, mk } from './generator-helpers';

const eq = (tags: string[]) => ({ preset: 'perso' as const, tags, disabledImplicit: [], dumbbellWeightsKg: [2, 4, 6, 8, 10, 12, 14], kettlebellWeightsKg: [8, 12] });
const salle = { preset: 'F' as const, tags: [], disabledImplicit: [], dumbbellWeightsKg: [], kettlebellWeightsKg: [] };
const HE = ['halteres', 'elastique', 'chaise', 'poids_du_corps', 'tapis'];
const demo = (profile: Record<string, unknown>, equipment: GeneratorInput['equipment'], goal: string, second?: string): GeneratorInput => ({
  profile: { blockedWeekdays: [], place: 'maison', sessionDurationMin: 45, sports: [], ...profile } as GeneratorInput['profile'],
  equipment,
  goals: [{ goalKey: goal, rank: 1 }, ...(second ? [{ goalKey: second, rank: 2 }] : [])],
  injuries: [], fiches: FICHES, options: { gagnerDuTemps: true },
});
const PROFILS: [string, GeneratorInput][] = [
  ['1 débutant muscle maison', demo({ level: 'debutant', daysPerWeek: 3 }, eq(HE), 'muscle')],
  ['2 intermédiaire force salle 4 j', demo({ level: 'intermediaire', daysPerWeek: 4, sessionDurationMin: 60, place: 'salle', salleAccess: true }, salle, 'force')],
  // Profil 3 avec la case « Ancrage de porte » cochée (06/11/2026) : sans ancrage de porte, aucune fiche correctif ne lui est compatible.
  ['3 perte de gras + cardio', demo({ level: 'intermediaire', daysPerWeek: 3 }, eq([...HE, 'ancrage_porte']), 'perte_gras', 'cardio')],
  ['4 volley', demo({ level: 'intermediaire', daysPerWeek: 3, sports: ['volley'] }, eq(['elastique', 'chaise', 'poids_du_corps', 'tapis']), 'sport')],
  ['5 débutant sans matériel', demo({ level: 'debutant', daysPerWeek: 3 }, eq(['poids_du_corps', 'tapis']), 'muscle')],
  ['6 avancé salle 5 j', demo({ level: 'avance', daysPerWeek: 5, sessionDurationMin: 75, place: 'salle', salleAccess: true }, salle, 'muscle')],
];
const ALL_IDS = Object.values(CORRECTIF.ids).flat();
const gen = (input: GeneratorInput) => {
  const r = generateProgram(input);
  if (!r.ok) throw new Error(r.code);
  return r.program;
};
const corr = (exs: readonly GenExercise[]) => exs.filter((e) => e.slot === 'correctif');

/** Semaine sans correctif (copie de travail) et dépendances ouvertes (durée, plafonds) pour isoler la règle. */
function bare(input: GeneratorInput) {
  const p = gen(input);
  const ctx = buildCtx(input);
  const sessions = p.sessions.map((s) => ({ label: s.label, exercises: s.exercises.filter((e) => e.slot !== 'correctif'), e1Sec: 0, e2Count: 0 })) as unknown as Parameters<typeof addCorrectifs>[0];
  return { ctx, pool: FICHES, sessions };
}
const open = { budget: () => 1e9, sessionOk: () => true, weekOk: () => true, alternatives: () => [] };

describe('correctif : 6 profils du rapport', () => {
  for (const [name, input] of PROFILS) {
    it(`${name} : fin de séance, liste fermée, 2 séries au plus, charge maintenue, 1 (débutant) ou 2 par séance, durée tenue`, () => {
      const p = gen(input);
      const max = input.profile.level === 'debutant' ? 1 : 2;
      const ids = p.sessions.flatMap((s) => s.exercises.map((e) => e.ficheId));
      for (const s of p.sessions) {
        const c = corr(s.exercises);
        expect(c.length).toBeLessThanOrEqual(max);
        // En fin de séance : après tous les exercices principaux.
        if (c.length) expect(s.exercises.slice(-c.length).every((e) => e.slot === 'correctif')).toBe(true);
        for (const e of c) {
          expect(ALL_IDS).toContain(e.ficheId);
          expect(e.sets).toBeLessThanOrEqual(2);
          expect(e.capped).toBe(true);
          expect(e.warmupSets).toEqual([]);
          expect(ids.filter((x) => x === e.ficheId)).toHaveLength(1);
        }
        expect(s.overBudget).toBe(false);
      }
      // Au moins un correctif sur chacun des 6 profils (rapport du 06/11/2026).
      expect(corr(p.sessions.flatMap((s) => s.exercises)).length).toBeGreaterThan(0);
      const rep = zoneReport(p, input);
      expect(rep.greySlotless.every((z) => SLOTLESS_ZONES.includes(z))).toBe(true);
    });

    it(`${name} : sans limite de durée ni de plafond, une petite zone grise à fiche compatible est couverte`, () => {
      const { ctx, pool, sessions } = bare(input);
      const before = checkZones(sessions, ctx, pool);
      const target = before.grey.filter((z) => SLOTLESS_ZONES.includes(z) && !slotlessFor(ctx, pool).has(z));
      addCorrectifs(sessions, { ctx, pool, ...open });
      const after = checkZones(sessions, ctx, pool);
      const max = ctx.level === 'debutant' ? 1 : 2;
      for (const s of sessions) expect(corr(s.exercises).length).toBeLessThanOrEqual(max);
      // Au moins une zone visée sort du gris (les plafonds par zone, toujours appliqués, et les places par séance peuvent bloquer les autres).
      const left = target.filter((z) => after.status[z] === 'gris');
      if (target.length) expect(left.length).toBeLessThan(target.length);
    });

    it(`${name} : durée sans marge : aucun correctif`, () => {
      const { ctx, pool, sessions } = bare(input);
      addCorrectifs(sessions, { ctx, pool, ...open, budget: (s) => estimerDuree(s) });
      expect(corr(sessions.flatMap((s) => s.exercises))).toEqual([]);
    });
  }
});

describe('correctif : protections', () => {
  it('grossesse : jamais une fiche dont la case grossesse retire (planche latérale, insecte sur le dos)', () => {
    for (const level of ['debutant', 'intermediaire'] as const) {
      const input = mk({ preg: 'enceinte', level, goal: 'muscle', dur: 60 });
      const ctx = buildCtx(input);
      for (const z of SLOTLESS_ZONES) {
        for (const c of correctifCandidates(z, ctx, FICHES)) expect(c.fiche.securite.grossesse?.action, c.fiche.id).not.toBe('retirer');
      }
      for (const e of corr(gen(input).sessions.flatMap((s) => s.exercises))) {
        const f = FICHES.find((x) => x.id === e.ficheId)!;
        expect(caseFor(f, { key: 'grossesse', level: 1, isG: true }).action).not.toBe('retirer');
        expect(e.sets).toBeLessThanOrEqual(2);
      }
    }
  });

  it('douleur sur la zone : zone exclue, aucun correctif qui porte une ligne de la zone gênée', () => {
    for (const [zone, lvl] of [['epaule', 1], ['cheville', 1], ['hanche', 2]] as const) {
      const input = mk({ injuries: [[zone, lvl]], goal: 'muscle', level: 'intermediaire', dur: 60 });
      const p = gen(input);
      const rep = zoneReport(p, input);
      for (const z of zonesOfInjury(zone)) expect(rep.grey).not.toContain(z);
      for (const e of corr(p.sessions.flatMap((s) => s.exercises))) {
        const f = FICHES.find((x) => x.id === e.ficheId)!;
        expect(Object.prototype.hasOwnProperty.call(f.securite.zones, zone), `${zone} ${e.ficheId}`).toBe(false);
      }
    }
  });

  it('débutant : jamais une fiche de niveau intermédiaire, 1 correctif par séance au plus', () => {
    const { ctx, pool, sessions } = bare(PROFILS[4][1]);
    for (const z of SLOTLESS_ZONES) for (const c of correctifCandidates(z, ctx, pool)) expect(c.fiche.niveauMin).toBe('debutant');
    addCorrectifs(sessions, { ctx, pool, ...open });
    for (const s of sessions) expect(corr(s.exercises).length).toBeLessThanOrEqual(1);
  });

  it('semaine allégée ou reprise : aucun correctif', () => {
    const { ctx, pool, sessions } = bare(PROFILS[3][1]);
    addCorrectifs(sessions, { ctx: { ...ctx, lightWeek: true }, pool, ...open });
    expect(corr(sessions.flatMap((s) => s.exercises))).toEqual([]);
  });
});
