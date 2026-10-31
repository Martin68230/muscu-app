// D32 (docs/D32-bilan.md) : défauts du générateur trouvés sur les 6 programmes d'exemple.
// 1. Limites de dose des fiches (DOSE_LIMITS) et surfaces instables (UNSTABLE_TAGS) ; 2. paires retentées après l'ajout
// d'emplacements ; 3. petits défauts (message de cardio, nom affiché de l'échauffement, message de match unique).
import { describe, expect, it } from 'vitest';
import { generateProgram } from '../../src/generator';
import { DOSE_LIMITS, doseLimitOf, UNSTABLE_TAGS, WARMUP } from '../../src/generator/config';
import { buildCtx } from '../../src/generator/context';
import { buildExercise } from '../../src/generator/dose';
import { estimerDuree, pairEligible, type DurSession } from '../../src/generator/duration';
import type { Candidate } from '../../src/generator/safety';
import type { Fiche, GenExercise, GenProgram, GenSession, GeneratorInput, SlotKey } from '../../src/generator/types';
import { byId, FICHES, mk } from './generator-helpers';

const cand = (fiche: Fiche, variant: Fiche['variantes'][number]): Candidate => ({
  fiche, variant, origin: fiche, adapted: false, capped: false, adaptations: [], notes: [], replaces: null,
});
const ctxOf = (goal: string, level: 'intermediaire' | 'avance') => buildCtx(mk({ goal, level, profile: 'F', place: 'salle' }));
const build = (ficheId: string, variantId: string | null, slot: SlotKey, goal: string, level: 'intermediaire' | 'avance'): GenExercise => {
  const f = byId(ficheId);
  const v = variantId ? f.variantes.find((x) => x.id === variantId)! : f.variantes[0];
  return buildExercise(cand(f, v), slot, 'a', ctxOf(goal, level));
};

// Profils de docs/programmes-exemples.md (tools/demo-programmes.mjs), option « Gagner du temps » activée.
const eq = (tags: string[]) => ({ preset: 'perso' as const, tags, disabledImplicit: [], dumbbellWeightsKg: [2, 4, 6, 8, 10, 12, 14], kettlebellWeightsKg: [8, 12] });
const salle = { preset: 'F' as const, tags: [], disabledImplicit: [], dumbbellWeightsKg: [], kettlebellWeightsKg: [] };
const input = (profile: Record<string, unknown>, equipment: GeneratorInput['equipment'], goals: string[], options: Record<string, unknown> = {}): GeneratorInput => ({
  profile: { blockedWeekdays: [], place: 'maison', sessionDurationMin: 45, sports: [], pregnancy: null, ...profile } as GeneratorInput['profile'],
  equipment, goals: goals.map((g, i) => ({ goalKey: g, rank: i + 1 })), injuries: [], fiches: FICHES, options: { gagnerDuTemps: true, ...options },
});
const PROFIL_2 = input({ level: 'intermediaire', daysPerWeek: 4, sessionDurationMin: 60, place: 'salle' }, salle, ['force']);
const PROFIL_3 = input({ level: 'intermediaire', daysPerWeek: 3 }, eq(['halteres', 'elastique', 'chaise', 'poids_du_corps', 'tapis']), ['perte_gras', 'cardio'], { seanceCardio: true });
const PROFIL_4 = input({ level: 'intermediaire', daysPerWeek: 3, sports: ['volley'] }, eq(['elastique', 'chaise', 'poids_du_corps', 'tapis']), ['sport']);
const PROFIL_6 = input({ level: 'avance', daysPerWeek: 5, sessionDurationMin: 75, place: 'salle' }, salle, ['muscle']);
const gen = (i: GeneratorInput): GenProgram => {
  const r = generateProgram(i);
  if (!r.ok) throw new Error(`programme refusé : ${r.code}`);
  return r.program;
};
const all = (p: GenProgram) => p.sessions.flatMap((s) => s.exercises);
const pairsOf = (s: GenSession) => [...new Set(s.exercises.map((e) => e.supersetGroup).filter((g): g is string => !!g))];

describe('D32-1 : limites de dose des fiches', () => {
  it('squat sur un bosu (avancé, muscle) : réserve 2, jamais 1 (fiche « Pas d\'échec »)', () => {
    const e = build('squat-bosu', null, 'jambes_2', 'muscle', 'avance');
    expect(e.rirAsked).toBe(true);
    expect(e.rirTarget).toBe(2);
  });
  it('toute variante sur surface instable (bosu, ballon de gym, sangles…) garde une réserve >= 2 à l\'avancé', () => {
    let n = 0;
    for (const f of FICHES)
      for (const v of f.variantes) {
        if (!v.tags.some((t) => UNSTABLE_TAGS.includes(t))) continue;
        for (const goal of ['muscle', 'force', 'sante']) {
          const e = buildExercise(cand(f, v), 'jambes_2', 'a', ctxOf(goal, 'avance'));
          if (e.rirAsked) {
            n++;
            expect(e.rirTarget, `${v.id} (${goal})`).toBeGreaterThanOrEqual(2);
          }
        }
      }
    expect(n).toBeGreaterThan(10);
  });
  it('fiches « Pas d\'échec » : réserve >= 2 pour toutes leurs variantes, tous objectifs, avancé', () => {
    for (const [id, lim] of Object.entries(DOSE_LIMITS)) {
      if (lim.minRir === undefined) continue;
      const f = FICHES.find((x) => x.id === id);
      if (!f) continue; // fiche non publiée (statut) : rien à placer
      for (const v of f.variantes)
        for (const goal of ['muscle', 'force', 'sante']) {
          const e = buildExercise(cand(f, v), 'jambes_2', 'a', ctxOf(goal, 'avance'));
          if (e.rirAsked) expect(e.rirTarget, `${v.id} (${goal})`).toBeGreaterThanOrEqual(lim.minRir);
        }
    }
  });
  it('montée sur marche aux haltères légers en pilier (force, intermédiaire) : 8-12, repos des « autres », pas d\'E3 à ~75 %', () => {
    const e = build('montee-sur-marche', 'montee-sur-marche-halteres', 'jambes_genou', 'force', 'intermediaire');
    expect(e.role).toBe('pilier');
    expect([e.repsMin, e.repsMax]).toEqual([8, 12]);
    expect(e.restSec).toBe(90);
    // Témoin : un pilier chargeable sans limite garde 4-6 (V-DOSE inchangée).
    const s = build('squat-arriere-barre', null, 'jambes_genou', 'force', 'intermediaire');
    expect([s.repsMin, s.repsMax]).toEqual([4, 6]);
  });
  it('profil 2 (force, salle) : la montée sur marche aux haltères n\'est jamais en 4-6 ni sans E3 adapté', () => {
    for (const e of all(gen(PROFIL_2)).filter((x) => x.variantId === 'montee-sur-marche-halteres')) {
      expect(e.repsMax).toBeGreaterThan(6);
      expect(e.warmupSets.every((w) => w.percent !== WARMUP.e3HeavyPercent)).toBe(true);
    }
  });
  it('good morning (fiche : 2 à 3 séries) : 3 séries au plus, même avec V-VOL (profil 6)', () => {
    const p = gen(PROFIL_6);
    const gm = all(p).filter((e) => e.ficheId === 'good-morning-barre');
    expect(gm.length).toBeGreaterThan(0);
    for (const e of gm) expect(e.sets).toBeLessThanOrEqual(3);
    // Aucune fiche limitée ne dépasse sa limite, aucune réserve sous sa limite.
    for (const e of all(p)) {
      const lim = doseLimitOf(e.ficheId, e.variantId, e.tags ?? []);
      if (lim.maxSets !== undefined) expect(e.sets, e.ficheId).toBeLessThanOrEqual(lim.maxSets);
      if (lim.minRir !== undefined && e.rirAsked) expect(e.rirTarget, e.ficheId).toBeGreaterThanOrEqual(lim.minRir);
    }
  });
});

describe('D32-2 : paires retentées après le placement final', () => {
  it('profil 4 (volley, intermédiaire, maison) : la séance B reçoit sa paire P1 (tirage_2 ajouté après la 1re formation)', () => {
    const p = gen(PROFIL_4);
    const b = p.sessions.find((s) => s.label === 'B')!;
    expect(pairsOf(b)).toEqual(['B-P1']);
    const pair = b.exercises.filter((e) => e.supersetGroup === 'B-P1');
    expect(pair.map((e) => e.slot).sort()).toEqual(['poussee_2', 'tirage_2']);
    for (const e of pair) expect(pairEligible(e)).toBe(true);
  });
  it('règles inchangées : jamais de core apparié à une fiche dont la ligne dos n\'est pas « garder » (SUP-2 point 4)', () => {
    for (const i of [PROFIL_2, PROFIL_4, PROFIL_6]) {
      for (const s of gen(i).sessions)
        for (const g of pairsOf(s)) {
          const u = s.exercises.filter((e) => e.supersetGroup === g);
          expect(u).toHaveLength(2);
          const core = u.find((e) => e.coreFamily);
          if (core) expect(u.find((e) => e !== core)!.backLoaded).toBe(false);
          for (const e of u) expect(pairEligible(e)).toBe(true);
        }
    }
    // Profil 4, séance A : P1 refusée (poussee_2 verticale), P3 refusée (fente arrière : ligne dos non « garder »).
    expect(pairsOf(gen(PROFIL_4).sessions.find((s) => s.label === 'A')!)).toEqual([]);
  });
  it('le temps gagné par la paire est compté dans la durée affichée', () => {
    const b = gen(PROFIL_4).sessions.find((s) => s.label === 'B')!;
    const dur: DurSession = {
      label: b.label, days: 3, level: 'intermediaire', pregnant: false, exercises: b.exercises, e1Sec: b.warmup.generalSec, e2Count: b.warmup.mobility.length,
    };
    expect(estimerDuree(dur)).toBe(b.estimatedSec);
    const unpaired = estimerDuree({ ...dur, exercises: b.exercises.map((e) => ({ ...e, supersetGroup: null })) });
    expect(unpaired).toBeGreaterThan(b.estimatedSec);
  });
  it('sans l\'option « Gagner du temps » : aucune paire', () => {
    for (const s of gen({ ...PROFIL_4, options: { gagnerDuTemps: false } }).sessions) expect(pairsOf(s)).toEqual([]);
  });
});

describe('D32-3 : petits défauts', () => {
  it('profil 3 : la séance de cardio existe, donc pas de V-MSG-CARDIO-TEMPS', () => {
    const p = gen(PROFIL_3);
    expect(p.cardioSessions?.length).toBeGreaterThan(0);
    expect(p.messages.map((m) => m.id)).not.toContain('V-MSG-CARDIO-TEMPS');
  });
  it('échauffement : « Marche rapide continue » (nom de la variante seul), id inchangé', () => {
    const p = gen(PROFIL_4);
    const w = p.sessions[0].warmup.general!;
    expect(w.variantId).toBe('marche-rapide-continue');
    expect(w.nom).toBe('Marche rapide continue');
    expect(JSON.stringify(p)).not.toContain('Marche rapide en intervalles (Marche rapide continue)');
  });
  it('V-MSG-SPORT-MATCH une seule fois', () => {
    expect(gen(PROFIL_4).messages.filter((m) => m.id === 'V-MSG-SPORT-MATCH')).toHaveLength(1);
  });
});
