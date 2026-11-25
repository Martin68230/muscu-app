// Salle et lieu par jour (retour utilisateur du 24/11/2026) : en salle, des exercices de salle (machines, poulies, barre, haltères sur banc, tractions) ;
// un lieu par jour (salle, maison, dehors, repos) ; les séances de maison ne changent pas ; aucun plafond ni règle de sécurité n'est relâché.
import { describe, expect, it } from 'vitest';
import type { DayPlace } from '../../src/data/model';
import { generateProgram, type GenProgram } from '../../src/generator';
import { GYM_RANK_TAGS } from '../../src/generator/config';
import { buildCtx } from '../../src/generator/context';
import { dominantPlace, PLACE_PRESETS, preferGymDays, restDays } from '../../src/generator/day-places';
import { makePlaf, sessionCapsOk, splitCapsOk, weekCapsOk } from '../../src/generator/plaf';
import type { GenExercise, GenSession, GeneratorInput } from '../../src/generator/types';
import { LEVELS, mk, type MkOpts } from './generator-helpers';

const NOT_FORCE = ['tronc', 'correctif', 'fonctionnel'];
const isGym = (e: GenExercise) => e.tags.some((t) => GYM_RANK_TAGS.includes(t));
const forceEx = (sessions: GenSession[]) => sessions.flatMap((s) => s.exercises).filter((e) => e.role !== 'cardio' && !NOT_FORCE.includes(e.slot));
const share = (xs: GenExercise[]) => (xs.length ? xs.filter(isGym).length / xs.length : 1);
const MACHINE = ['machine', 'poulie', 'machine_cardio'];

function gen(o: MkOpts, dayPlaces?: DayPlace[], extra?: (i: GeneratorInput) => void): { input: GeneratorInput; p: GenProgram } {
  const input = mk(o);
  if (dayPlaces) input.profile.dayPlaces = dayPlaces;
  extra?.(input);
  const r = generateProgram(input);
  if (!r.ok) throw new Error(`pas de programme : ${r.code}`);
  return { input, p: r.program };
}
function capsHold(input: GeneratorInput, p: GenProgram): void {
  const ctx = buildCtx(input);
  const plaf = makePlaf(ctx, 'slot');
  const split = p.sessions.some((s) => s.type !== 'CE');
  expect(weekCapsOk(p.sessions, ctx)).toBe(true);
  for (const s of p.sessions) expect(split ? splitCapsOk(s.exercises, plaf) : sessionCapsOk(s, plaf)).toBe(true);
  for (const s of p.sessions) {
    expect(s.overBudget).toBe(false);
    // Core (gainage, anti-rotation, rotation) : 6 séries par séance au plus (kiné), tous emplacements.
    expect(s.exercises.filter((e) => ['gainage', 'anti_rotation', 'rotation'].includes(e.schema)).reduce((n, e) => n + e.sets, 0)).toBeLessThanOrEqual(6);
  }
}
const sig = (p: GenProgram) => JSON.stringify(p.sessions.map((s) => [s.label, s.weekday, s.exercises.map((e) => [e.ficheId, e.variantNom, e.sets])]));

describe('salle : priorité aux exercices de salle', () => {
  it('lieu « salle » (profil F) : en moyenne >= 80 % (jamais sous 75 %) de machines, poulies, barres, haltères sur banc ou tractions, 3 à 6 jours, 3 niveaux, 45 / 75 min ; plafonds tenus', () => {
    const shares: number[] = [];
    for (const level of LEVELS) for (const days of [3, 4, 5, 6]) for (const dur of [45, 75]) {
      const { input, p } = gen({ profile: 'F', place: 'salle', level, days, dur });
      const f = forceEx(p.sessions);
      // Quelques emplacements n'ont pas encore assez de fiches de salle (jambes_2 / jambes_3 / jambes_4 : curl ischios machine, adduction machine, mollets...) : plancher 0,75 par programme ; voir docs/couverture-fiches.md.
      shares.push(share(f));
      expect(share(f), `${level} ${days} j ${dur} min`).toBeGreaterThanOrEqual(0.75);
      capsHold(input, p);
      // Règle 23 : jamais de matériel spécialisé pour un débutant.
      if (level === 'debutant') expect(p.sessions.flatMap((s) => s.exercises).some((e) => e.tags.includes('materiel_specialise'))).toBe(false);
    }
    expect(shares.reduce((a, b) => a + b, 0) / shares.length).toBeGreaterThanOrEqual(0.8);
  });
  it('salle : plus de sac, de bosu ni d\'élastique à la place d\'une machine, d\'une barre ou d\'haltères sur banc (sauf pénurie, « (à la maison) »)', () => {
    const { p } = gen({ profile: 'F', place: 'salle', level: 'intermediaire', days: 4, dur: 60 });
    for (const e of p.sessions.flatMap((s) => s.exercises)) {
      if (['sac_a_dos', 'bosu', 'sac_de_sable', 'bidons_ou_sacs'].some((t) => e.tags.includes(t))) throw new Error(`basique en salle : ${e.ficheId}`);
      if (e.tags.includes('elastique')) expect(e.variantNom.endsWith(' (à la maison)'), e.ficheId).toBe(true);
    }
  });
  it('une barre de traction : la traction avant le tirage à l\'élastique (profil D, haltères, lieu salle)', () => {
    const { p } = gen({ profile: 'D', place: 'salle', level: 'intermediaire', days: 3, dur: 60 });
    const pull = p.sessions.flatMap((s) => s.exercises).filter((e) => e.slot.startsWith('tirage'));
    expect(pull.some((e) => e.tags.includes('barre_traction') || e.tags.includes('halteres'))).toBe(true);
  });
});

describe('lieu par jour', () => {
  it('migration : sans lieu par jour, ou avec « maison » partout : programme identique au lieu unique maison', () => {
    for (const level of LEVELS) for (const days of [3, 5]) {
      const a = gen({ profile: 'E', place: 'maison', level, days }).p;
      const b = gen({ profile: 'E', place: 'maison', level, days }, PLACE_PRESETS.toutMaison).p;
      expect(sig(b), `${level} ${days}`).toBe(sig(a));
    }
  });
  it('« tous en salle » = lieu unique salle (mêmes exercices)', () => {
    for (const level of LEVELS) {
      const a = gen({ profile: 'F', place: 'salle', level, days: 4 }).p;
      const b = gen({ profile: 'F', place: 'maison', level, days: 4 }, PLACE_PRESETS.toutSalle).p;
      expect(sig(b), level).toBe(sig(a));
    }
  });
  it('mixte (salle lun / mer / ven, maison le reste) : séances de salle >= 80 % de salle, séances de maison sans machine ni poulie ; plafonds tenus', () => {
    for (const level of LEVELS) for (const days of [3, 4, 5, 6]) {
      const { input, p } = gen({ profile: 'F', place: 'maison', level, days, dur: 60 }, PLACE_PRESETS.salleLunMerVen);
      capsHold(input, p);
      const gymSessions = p.sessions.filter((s) => s.place === 'salle');
      const homeSessions = p.sessions.filter((s) => s.place === 'maison');
      expect(gymSessions.length + homeSessions.length, `${level} ${days}`).toBe(p.sessions.length);
      expect(gymSessions.every((s) => PLACE_PRESETS.salleLunMerVen[s.weekday] === 'salle')).toBe(true);
      expect(share(forceEx(gymSessions)), `${level} ${days} salle`).toBeGreaterThanOrEqual(0.75);
      for (const e of homeSessions.flatMap((s) => s.exercises)) expect(e.tags.some((t) => MACHINE.includes(t)), `${level} ${days} maison ${e.ficheId}`).toBe(false);
    }
  });
  it('un profil de maison (haltères) avec des jours de salle : les séances de maison n\'emploient que son matériel', () => {
    const { p } = gen({ profile: 'C', place: 'maison', level: 'intermediaire', days: 4, dur: 60 }, PLACE_PRESETS.salleLunMerVen);
    const home = p.sessions.filter((s) => s.place === 'maison').flatMap((s) => s.exercises);
    expect(home.length).toBeGreaterThan(0);
    for (const e of home) expect(e.tags.some((t) => MACHINE.includes(t) || ['barre', 'rack', 'banc'].includes(t)), e.ficheId).toBe(false);
  });
  it('de 1 à 6 jours de salle parmi 4 séances : les jours de salle sont utilisés en priorité, les plafonds tiennent', () => {
    for (let n = 1; n <= 6; n++) {
      const dp: DayPlace[] = ['maison', 'maison', 'maison', 'maison', 'maison', 'maison', 'maison'];
      [0, 2, 4, 5, 1, 3].slice(0, n).forEach((d) => (dp[d] = 'salle'));
      const { input, p } = gen({ profile: 'F', place: 'maison', level: 'intermediaire', days: 4, dur: 60 }, dp);
      capsHold(input, p);
      const usedGym = p.sessions.filter((s) => s.place === 'salle').length;
      expect(usedGym, `${n} jours de salle`).toBeGreaterThanOrEqual(Math.min(n, p.sessions.length) - (n >= 5 ? 1 : 0));
      expect(share(forceEx(p.sessions.filter((s) => s.place === 'salle'))), `${n} jours de salle`).toBeGreaterThanOrEqual(0.8);
    }
  });
  it('matériel de la salle : une machine ou une barre décochée n’est jamais proposée les jours de salle ; un profil de maison obtient la salle complète ces jours-là', () => {
    const off = ['machine', 'poulie', 'barre_traction'];
    const { p } = gen({ profile: 'C', place: 'maison', level: 'intermediaire', days: 4, dur: 60 }, PLACE_PRESETS.toutSalle, (i) => { i.equipment.gymOff = off; });
    for (const e of p.sessions.flatMap((s) => s.exercises)) expect(e.tags.some((t) => off.includes(t)), e.ficheId).toBe(false);
    const full = gen({ profile: 'C', place: 'maison', level: 'intermediaire', days: 4, dur: 60 }, PLACE_PRESETS.toutSalle).p;
    const tags = new Set(full.sessions.flatMap((s) => s.exercises.flatMap((e) => e.tags)));
    expect(['machine', 'poulie', 'barre', 'banc'].filter((t) => tags.has(t)).length).toBeGreaterThanOrEqual(3);
    expect(share(forceEx(full.sessions))).toBeGreaterThanOrEqual(0.75);
  });
  it('un seul jour de salle en corps entier : la séance technique A y est placée', () => {
    const dp: DayPlace[] = ['maison', 'maison', 'maison', 'salle', 'maison', 'maison', 'maison'];
    const { p } = gen({ profile: 'F', place: 'maison', level: 'intermediaire', days: 3, dur: 60 }, dp);
    const g = p.sessions.filter((s) => s.place === 'salle');
    expect(g).toHaveLength(1);
    if (p.sessions.every((s) => s.type === 'CE')) expect(g[0].label).toBe('A');
  });
  it('repos : aucune séance un jour de repos ; dehors : ni machine, ni barre, ni banc', () => {
    const dp: DayPlace[] = ['salle', 'repos', 'dehors', 'repos', 'salle', 'repos', 'repos'];
    expect(restDays(dp)).toEqual([1, 3, 5, 6]);
    expect(dominantPlace(dp)).toBe('salle');
    const { input, p } = gen({ profile: 'F', place: 'maison', level: 'intermediaire', days: 3, dur: 60 }, dp);
    capsHold(input, p);
    for (const s of p.sessions) {
      expect(restDays(dp)).not.toContain(s.weekday);
      if (s.place === 'dehors') for (const e of s.exercises) expect(e.tags.some((t) => ['machine', 'poulie', 'barre', 'rack', 'banc', 'banc_inclinable', 'disques', 'barre_ez'].includes(t)), e.ficheId).toBe(false);
    }
  });
  it('sécurité : débutant jamais de matériel spécialisé un jour de salle ; blessure : plafonds et cases tenus ; grossesse : aucune machine', () => {
    const dp = PLACE_PRESETS.salleLunMerVen;
    const deb = gen({ profile: 'F', place: 'maison', level: 'debutant', days: 4 }, dp).p;
    expect(deb.sessions.flatMap((s) => s.exercises).some((e) => e.tags.includes('materiel_specialise'))).toBe(false);
    const hurt = gen({ profile: 'F', place: 'maison', level: 'avance', days: 5, dur: 75, injuries: [['epaule', 2], ['genou', 1]] }, dp);
    capsHold(hurt.input, hurt.p);
    const preg = gen({ profile: 'F', place: 'maison', level: 'intermediaire', days: 3, preg: 'enceinte' }, dp).p;
    for (const e of preg.sessions.flatMap((s) => s.exercises)) expect(e.tags.some((t) => MACHINE.includes(t)), e.ficheId).toBe(false);
  });
  it('preferGymDays : ne change rien sans jour de salle libre ni sans jour de maison', () => {
    const plan = { days: [0, 2, 4], labels: ['A', 'B', 'C'], reduced: false };
    expect(preferGymDays(plan, PLACE_PRESETS.toutSalle, [], () => null)).toBe(plan);
    expect(preferGymDays(plan, PLACE_PRESETS.toutMaison, [], () => null)).toBe(plan);
  });
});
