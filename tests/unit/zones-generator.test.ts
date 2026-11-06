// Niveau 2, étape 2 : le générateur contrôle les zones de la semaine prévue (src/generator/zones-check.ts).
// Décision du chef de projet (06/11/2026) : petites zones (SLOTLESS_ZONES : coiffe, carré des lombes, fléchisseurs de hanche,
// péroniers, abducteurs, adducteurs, soléaire, tibiaux) couvertes par l'emplacement correctif (correctif.test.ts) ; sans fiche correctif compatible : ni corrigées ni citées ; zones orange jamais affichées.
// Zones grises restantes à corriger sur les 6 profils de tools/demo-programmes.mjs (exceptions documentées) : aucune correction possible
// sans ajouter d'exercice : débutants à 2 séries (STR-REP), échange jamais vers une fiche déjà dans la semaine (D34), plafond hebdomadaire
// de 20 (somme des épaules, trapèzes / rhomboïdes) ou maximum de séries de la fiche (D32, R-REPS).
import { describe, expect, it } from 'vitest';
import { generateProgram, zoneReport } from '../../src/generator';
import { buildCtx } from '../../src/generator/context';
import { estimerDuree } from '../../src/generator/duration';
import { makePlaf, sessionCapsOk, splitCapsOk, weekCapsOk } from '../../src/generator/plaf';
import { fillGreyZones, checkZones, SLOTLESS_ZONES } from '../../src/generator/zones-check';
import type { GeneratorInput } from '../../src/generator/types';
import { capGroupPoints, zoneCaps, zoneName, zonesOfInjury } from '../../src/zones/zones';
import { FICHES, mk } from './generator-helpers';

const eq = (tags: string[]) => ({ preset: 'perso' as const, tags, disabledImplicit: [], dumbbellWeightsKg: [2, 4, 6, 8, 10, 12, 14], kettlebellWeightsKg: [8, 12] });
const salle = { preset: 'F' as const, tags: [], disabledImplicit: [], dumbbellWeightsKg: [], kettlebellWeightsKg: [] };
const HE = ['halteres', 'elastique', 'chaise', 'poids_du_corps', 'tapis'];
const E = ['elastique', 'chaise', 'poids_du_corps', 'tapis'];
const demo = (profile: Record<string, unknown>, equipment: GeneratorInput['equipment'], goal: string, second?: string): GeneratorInput => ({
  profile: { blockedWeekdays: [], place: 'maison', sessionDurationMin: 45, sports: [], ...profile } as GeneratorInput['profile'],
  equipment,
  goals: [{ goalKey: goal, rank: 1 }, ...(second ? [{ goalKey: second, rank: 2 }] : [])],
  injuries: [], fiches: FICHES, options: { gagnerDuTemps: true },
});

/** Les 6 profils du rapport et les zones grises admises (voir l'en-tête). */
const PROFILS: [string, GeneratorInput, string[]][] = [
  // Petites zones à fiche correctif compatible restées grises (06/11/2026) : places par séance (8 exercices, 1 correctif au débutant),
  // durée ou plafond par zone (groupe déjà au-dessus de 20) ; elles sont citées dans V-MSG-ZONES-GRIS.
  ['1 débutant muscle maison', demo({ level: 'debutant', daysPerWeek: 3 }, eq(HE), 'muscle'), ['mollets_soleaire', 'tibiaux', 'peroniers']],
  ['2 intermédiaire force salle 4 j', demo({ level: 'intermediaire', daysPerWeek: 4, sessionDurationMin: 60, place: 'salle', salleAccess: true }, salle, 'force'), ['coiffe_rotateurs', 'carre_des_lombes']],
  ['3 perte de gras + cardio', demo({ level: 'intermediaire', daysPerWeek: 3 }, eq(HE), 'perte_gras', 'cardio'), ['trapezes_bas', 'coiffe_rotateurs', 'carre_des_lombes', 'abducteurs', 'mollets_soleaire', 'tibiaux']],
  ['4 volley', demo({ level: 'intermediaire', daysPerWeek: 3, sports: ['volley'] }, eq(E), 'sport'), ['epaules_cote', 'fessiers_moyen', 'coiffe_rotateurs', 'carre_des_lombes']],
  ['5 débutant sans matériel', demo({ level: 'debutant', daysPerWeek: 3 }, eq(['poids_du_corps', 'tapis']), 'muscle'), ['epaules_cote', 'triceps_long_chef', 'tibiaux']],
  ['6 avancé salle 5 j', demo({ level: 'avance', daysPerWeek: 5, sessionDurationMin: 75, place: 'salle', salleAccess: true }, salle, 'muscle'), ['trapezes_haut', 'coiffe_rotateurs', 'abducteurs']],
];

function capsHold(input: GeneratorInput) {
  const r = generateProgram(input);
  if (!r.ok) return;
  const p = r.program;
  const ctx = buildCtx(input);
  const plaf = makePlaf(ctx, 'slot');
  const split = p.sessions.some((s) => s.type !== 'CE');
  expect(weekCapsOk(p.sessions)).toBe(true);
  for (const s of p.sessions) expect(split ? splitCapsOk(s.exercises, plaf) : sessionCapsOk(s, plaf)).toBe(true);
  return p;
}

describe('zones : contrôle du générateur sur les 6 profils du rapport', () => {
  for (const [name, input, allowed] of PROFILS) {
    it(`${name} : aucune zone grise hors exceptions documentées ; plafonds et durée tenus`, () => {
      const p = capsHold(input)!;
      const rep = zoneReport(p, input);
      expect(rep.greyFixable.filter((z) => !allowed.includes(z))).toEqual([]);
      expect(rep.greySlotless.every((z) => SLOTLESS_ZONES.includes(z))).toBe(true);
      for (const s of p.sessions) expect(s.overBudget).toBe(false);
      for (const [g, v] of capGroupPoints(rep.points)) expect(v.points, g).toBeLessThanOrEqual(zoneCaps(v.zone).week);
      // Messages : zones grises restantes et zones orange, sans sigle ni identifiant brut.
      const ids = p.messages.map((m) => m.id);
      expect(ids.includes('V-MSG-ZONES-GRIS')).toBe(rep.greyFixable.length > 0);
      expect(ids.some((x) => x.endsWith('ORANGE'))).toBe(false);
      const txt = p.messages.filter((m) => m.id === 'V-MSG-ZONES-GRIS').map((m) => m.text).join(' ');
      for (const z of rep.greySlotless) expect(txt).not.toContain(zoneName(z));
      for (const m of p.messages.filter((x) => x.id.startsWith('V-MSG-ZONES'))) expect(m.text).not.toMatch(/_|\bV-|PLAF|RIR/);
    });
  }
});

describe('zones : plafonds tenus sur une grille de profils', () => {
  it('plafonds V-PLAF et hebdomadaire respectés après le contrôle des zones', () => {
    for (const goal of ['muscle', 'force', 'sante', 'perte_gras', 'sport'])
      for (const level of ['debutant', 'intermediaire', 'avance'] as const)
        for (const profile of ['A0', 'C', 'F'])
          for (const days of [2, 3, 4]) capsHold(mk({ goal, level, profile, days, dur: 45, place: profile === 'F' ? 'salle' : 'maison' }));
  }, 120_000);
});

describe('zones : blessure et protections', () => {
  it('genou au niveau 2 : zones du genou exclues du contrôle et absentes des messages', () => {
    const input = mk({ injuries: [['genou', 2]], goal: 'muscle' });
    const p = capsHold(input)!;
    const rep = zoneReport(p, input);
    for (const z of zonesOfInjury('genou')) {
      expect(rep.excluded[z]).toBe('blessure');
      expect(rep.grey).not.toContain(z);
      expect(rep.orange).not.toContain(z);
    }
    const txt = p.messages.filter((m) => m.id.startsWith('V-MSG-ZONES')).map((m) => m.text).join(' ');
    expect(txt).not.toMatch(/quadriceps|ischio/i);
  });

  const setup = (input: GeneratorInput) => {
    const r = generateProgram(input);
    if (!r.ok) throw new Error(r.code);
    const p = r.program;
    const ctx = buildCtx(input);
    const pool = FICHES;
    const sessions = p.sessions.map((s) => ({ label: s.label, exercises: [...s.exercises], e1Sec: 0, e2Count: 0 })) as unknown as Parameters<typeof fillGreyZones>[0];
    return { ctx, pool, sessions };
  };
  const open = { budget: () => 1e9, sessionOk: () => true, weekOk: () => true, alternatives: () => [] };

  it('séries ajoutées seulement si une zone grise sort du gris, jamais au-delà de 4 séries ni du maximum de la fiche', () => {
    const { ctx, pool, sessions } = setup(PROFILS[2][1]);
    const before = checkZones(sessions, ctx, pool).grey.length;
    fillGreyZones(sessions, { ctx, pool, ...open });
    expect(checkZones(sessions, ctx, pool).grey.length).toBeLessThanOrEqual(before);
    for (const s of sessions) for (const e of s.exercises) expect(e.sets).toBeLessThanOrEqual(4);
  });
  it('budget de durée sans marge : aucune série ajoutée', () => {
    const { ctx, pool, sessions } = setup(PROFILS[2][1]);
    const sets = sessions.map((s) => s.exercises.map((e) => e.sets));
    fillGreyZones(sessions, { ctx, pool, ...open, budget: (s) => estimerDuree(s) });
    expect(sessions.map((s) => s.exercises.map((e) => e.sets))).toEqual(sets);
  });
  it('débutant : aucune série ajoutée (2 séries), même sans limite de durée ni de plafond', () => {
    const { ctx, pool, sessions } = setup(PROFILS[0][1]);
    const sets = sessions.map((s) => s.exercises.map((e) => e.sets));
    fillGreyZones(sessions, { ctx, pool, ...open });
    expect(sessions.map((s) => s.exercises.map((e) => e.sets))).toEqual(sets);
  });
  it('grossesse : aucune série ajoutée, même sans limite de durée ni de plafond', () => {
    const { ctx, pool, sessions } = setup(mk({ preg: 'enceinte', level: 'debutant', goal: 'muscle' }));
    const sets = sessions.map((s) => s.exercises.map((e) => e.sets));
    fillGreyZones(sessions, { ctx, pool, ...open });
    expect(sessions.map((s) => s.exercises.map((e) => e.sets))).toEqual(sets);
  });
  it('zone gênée : aucune série ajoutée sur une fiche qui porte une ligne de cette zone', () => {
    const input = mk({ injuries: [['epaule', 1]], goal: 'muscle', level: 'intermediaire' });
    const { ctx, pool, sessions } = setup(input);
    const before = sessions.map((s) => s.exercises.map((e) => ({ id: e.ficheId, sets: e.sets })));
    fillGreyZones(sessions, { ctx, pool, ...open });
    sessions.forEach((s, i) => s.exercises.forEach((e, j) => {
      const f = ctx.fichesById.get(e.ficheId)!;
      if (Object.prototype.hasOwnProperty.call(f.securite.zones, 'epaule')) expect(e.sets).toBe(before[i][j].sets);
    }));
  });
});
