// CAL-20 (13/11/2026, knowledge/calibrage-kaggle.md) : variété et couverture du haut du corps, SANS dose nouvelle ni plafond franchi.
// Profils D, E, F et « maison avec banc, haltères, élastique et barre de traction » (M), 4 et 5 jours, prise de muscle, intermédiaire, 60 min.
import { describe, expect, it } from 'vitest';
import { generateProgram } from '../../src/generator';
import { ISOLATION, VOLUME } from '../../src/generator/config';
import { buildCtx } from '../../src/generator/context';
import { isoExercise, isoSlotFitsType } from '../../src/generator/isolation';
import { weekCapsOk } from '../../src/generator/plaf';
import { stepOf } from '../../src/generator/variety';
import type { GenExercise, GenProgram, GenSession } from '../../src/generator/types';
import { FICHES, mk, PROFILES } from './generator-helpers';

PROFILES.M = { tags: ['banc', 'halteres', 'elastique', 'barre_traction', 'chaise', 'poids_du_corps', 'tapis'], preset: 'perso' };
const typeOf = (l: string) => (l.includes('-') ? l.split('-')[0] : 'CE');
const wk = (s: GenSession, w: number): GenExercise[] => s.exercises.map((e) => (w === 2 && e.alt ? e.alt : e));
const PILLARS = ['jambes_genou', 'poussee_1', 'tirage_1', 'charniere'];
const ISO_MUSCLES = ['biceps', 'deltoides_lateraux', 'deltoides_posterieurs'];
/** Isolation du haut : emplacement `iso_*` ou fiche d'isolation (biceps, deltoïde latéral ou postérieur en principal) placée comme accessoire. */
const upperIso = (e: GenExercise) =>
  (e.slot.startsWith('iso_') && e.slot !== 'iso_mollets') ||
  (/^(curl-|oiseau-|tirage-visage-|elevation-laterale)/.test(e.ficheId) && e.musclesPrincipaux.some((m) => ISO_MUSCLES.includes(m)));

const CASES: { name: string; prof: string; days: number }[] = [];
for (const prof of ['D', 'E', 'F', 'M']) for (const days of [4, 5]) CASES.push({ name: `${prof}/${days}j`, prof, days });
const cache = new Map<string, { input: ReturnType<typeof mk>; program: GenProgram }>();
const gen = (prof: string, days: number, o: Parameters<typeof mk>[0] = {}) => {
  const key = JSON.stringify([prof, days, o]);
  if (!cache.has(key)) {
    const input = mk({ profile: prof, days, level: 'intermediaire', goal: 'muscle', dur: 60, place: prof === 'F' ? 'salle' : 'maison', options: { gagnerDuTemps: true }, ...o });
    const r = generateProgram(input);
    if (!r.ok) throw new Error(`${prof}/${days}j : ${r.code}`);
    cache.set(key, { input, program: r.program });
  }
  return cache.get(key)!.program;
};

describe('CAL-20 a : deux séances HAUT de la même semaine', () => {
  it('aucun exercice commun, sauf un pilier ; isolation différente d\'une séance à l\'autre', () => {
    for (const c of CASES.filter((x) => x.days === 4)) {
      const p = gen(c.prof, c.days);
      const haut = p.sessions.filter((s) => typeOf(s.label) === 'HAUT');
      expect(haut.length, c.name).toBe(2);
      for (const w of [1, 2]) {
        const [a, b] = haut.map((s) => wk(s, w));
        const pillars = new Set([...a, ...b].filter((e) => PILLARS.includes(e.slot)).map((e) => e.ficheId));
        const communs = a.filter((x) => b.some((y) => y.ficheId === x.ficheId)).map((x) => x.ficheId);
        expect(communs.filter((id) => !pillars.has(id)), `${c.name} semaine ${w}`).toEqual([]);
        const isoA = a.filter(upperIso).map((e) => e.ficheId).sort().join('+');
        const isoB = b.filter(upperIso).map((e) => e.ficheId).sort().join('+');
        if (isoA && isoB) expect(isoA, `${c.name} semaine ${w} : même isolation`).not.toBe(isoB);
      }
    }
  });
});

describe('CAL-20 b : rotation des accessoires entre la semaine 1 et la semaine 2', () => {
  it('au moins 1 accessoire sur 3 change (correctifs exclus : ils suivent les zones, pas la rotation)', () => {
    let acc = 0;
    let changed = 0;
    for (const c of CASES) {
      const p = gen(c.prof, c.days);
      for (const s of p.sessions) {
        if (!['HAUT', 'PUSH', 'PULL'].includes(typeOf(s.label))) continue;
        for (const e of s.exercises) {
          if (stepOf(e.slot, s.label) < 3 || e.slot === 'correctif') continue;
          acc++;
          if (e.alt && e.alt.ficheId !== e.ficheId) {
            changed++;
            // aucune dose nouvelle : mêmes séries, répétitions, unité et durée
            expect([e.alt.sets, e.alt.repsMin, e.alt.repsMax, e.alt.unit, e.alt.holdSec]).toEqual([e.sets, e.repsMin, e.repsMax, e.unit, e.holdSec]);
          }
        }
      }
    }
    expect(acc).toBeGreaterThan(40);
    expect(changed / acc).toBeGreaterThanOrEqual(1 / 3);
  });
});

describe('CAL-20 c : couverture du haut du corps', () => {
  it('au moins 11 séances HAUT sur 12 reçoivent une isolation (biceps, deltoïde postérieur ou latéral) ; un deltoïde postérieur direct existe dans la moitié des semaines', () => {
    let sess = 0;
    let withIso = 0;
    let weeksWithRear = 0;
    for (const c of CASES) {
      const p = gen(c.prof, c.days);
      for (const s of p.sessions.filter((x) => typeOf(x.label) === 'HAUT')) {
        sess++;
        if (wk(s, 1).some(upperIso)) withIso++;
      }
      const principal = (e: GenExercise) => FICHES.find((f) => f.id === e.ficheId)!.musclesPrincipaux;
      if (p.sessions.some((s) => wk(s, 1).some((e) => principal(e).includes('deltoides_posterieurs')))) weeksWithRear++;
    }
    expect(sess).toBe(12);
    expect(withIso).toBeGreaterThanOrEqual(11);
    expect(weeksWithRear).toBeGreaterThanOrEqual(4); // mesuré : 4 semaines sur 8 (avant : 0 à 2)
  });

  it('isoEligible ouvert aux 5 et 6 jours, même objectif : des isolations existent en haut / bas / PPL, aucune en perte de gras', () => {
    const iso = (p: GenProgram) => p.sessions.flatMap((s) => s.exercises).filter((e) => e.slot.startsWith('iso_'));
    expect(['D', 'E', 'M'].some((prof) => iso(gen(prof, 5)).length > 0)).toBe(true);
    expect(iso(gen('D', 5, { goal: 'perte_gras' })).length).toBe(0);
    expect(iso(gen('D', 6)).every((e) => e.sets === ISOLATION.setsPerExercise)).toBe(true);
  });

  it('plafonds inchangés : 2 isolations par séance, 2 séries chacune, 4 séries par groupe et par semaine, 20 séries hebdomadaires par muscle, durée choisie', () => {
    for (const c of CASES.concat([{ name: 'D/6j', prof: 'D', days: 6 }])) {
      const p = gen(c.prof, c.days);
      const perGroup = new Map<string, number>();
      for (const s of p.sessions) {
        const isos = s.exercises.filter((e) => e.slot.startsWith('iso_'));
        expect(isos.length, `${c.name} ${s.label}`).toBeLessThanOrEqual(ISOLATION.maxPerSession);
        expect(s.overBudget, `${c.name} ${s.label}`).toBeFalsy();
        for (const e of isos) {
          expect(e.sets).toBe(ISOLATION.setsPerExercise);
          expect(isoSlotFitsType(e.slot as never, typeOf(s.label)), `${c.name} ${s.label} ${e.slot}`).toBe(true);
          perGroup.set(e.slot, (perGroup.get(e.slot) ?? 0) + e.sets);
        }
      }
      for (const [slot, n] of perGroup) expect(n, `${c.name} ${slot}`).toBeLessThanOrEqual(ISOLATION.maxSetsPerGroupWeek);
      for (const w of [1, 2]) expect(weekCapsOk(p.sessions.map((s) => ({ exercises: wk(s, w) })), buildCtx(mk({ profile: c.prof, days: c.days, level: 'intermediaire', goal: 'muscle', dur: 60, place: c.prof === 'F' ? 'salle' : 'maison', options: { gagnerDuTemps: true } }))), `${c.name} semaine ${w}`).toBe(true);
    }
    expect(VOLUME.maxPerMuscleWeek).toBe(20);
  });
});

describe('Lot 04 : règles de sécurité du placement', () => {
  const ids = (p: GenProgram) => p.sessions.flatMap((s) => s.exercises.flatMap((e) => (e.alt ? [e, e.alt] : [e])));
  it('triceps (CAL-9 levé sous conditions) : jamais pour un débutant, jamais avec une gêne au coude, 2 séries au plus, réserve >= 2', () => {
    const TRI = ['extension-triceps-elastique', 'kickback-triceps-halteres'];
    for (const c of CASES) {
      const p = gen(c.prof, c.days);
      for (const e of ids(p).filter((x) => TRI.includes(x.ficheId))) {
        expect(e.sets).toBeLessThanOrEqual(2);
        expect(e.rirTarget).toBeGreaterThanOrEqual(2);
        expect(e.repsMin).toBeGreaterThanOrEqual(8);
      }
      expect(ids(gen(c.prof, c.days, { level: 'debutant' })).some((x) => TRI.includes(x.ficheId)), `${c.name} débutant`).toBe(false);
      expect(ids(gen(c.prof, c.days, { injuries: [['coude', 1]] })).some((x) => TRI.includes(x.ficheId)), `${c.name} coude 1`).toBe(false);
    }
  });
  it('iso_triceps construit directement (le placement automatique est rare) : 2 séries, réserve >= 2, pas de dose lourde ; refusé pour un débutant ou avec une gêne au coude', () => {
    const def = ISOLATION.slots.find((d) => d.slot === 'iso_triceps')!;
    const ex = isoExercise(def, buildCtx(mk({ profile: 'E', level: 'intermediaire', goal: 'muscle', dur: 60 })), FICHES, new Set());
    expect(ex).not.toBeNull();
    expect(def.ids).toContain(ex!.ficheId);
    expect(ex!.sets).toBeLessThanOrEqual(2);
    expect(ex!.rirTarget).toBeGreaterThanOrEqual(2);
    expect(ex!.repsMin).toBeGreaterThanOrEqual(8);
    expect(isoExercise(def, buildCtx(mk({ profile: 'E', level: 'debutant', goal: 'muscle' })), FICHES, new Set())).toBeNull();
    expect(isoExercise(def, buildCtx(mk({ profile: 'E', level: 'intermediaire', goal: 'muscle', injuries: [['coude', 1]] })), FICHES, new Set())).toBeNull();
  });
  it('gêne à l\'épaule (niveau 1) : ni deltoïde latéral ni deltoïde postérieur en isolation', () => {
    for (const c of CASES) {
      const p = gen(c.prof, c.days, { injuries: [['epaule', 1]] });
      expect(p.sessions.flatMap((s) => s.exercises).filter((e) => e.slot === 'iso_deltoide_lateral' || e.slot === 'iso_deltoide_posterieur'), c.name).toEqual([]);
    }
  });
  it('grossesse : aucune isolation (isoEligible) ; curl de poignet seulement en correctif, jamais comme exercice principal', () => {
    for (const prof of ['D', 'F']) {
      const p = gen(prof, 4, { preg: 'enceinte' });
      expect(p.sessions.flatMap((s) => s.exercises).filter((e) => e.slot.startsWith('iso_'))).toEqual([]);
    }
    for (const c of CASES) for (const e of ids(gen(c.prof, c.days)).filter((x) => x.ficheId === 'curl-poignet-halteres')) {
      expect(e.slot).toBe('correctif');
      expect(e.capped).toBe(true);
      expect(e.sets).toBeLessThanOrEqual(2);
    }
  });
  it('isolations et descente lente jamais exercice principal', () => {
    const NEVER = ['oiseau-elastique', 'tirage-visage-elastique-barre', 'curl-concentration-halteres', 'curl-inverse-halteres', 'extension-triceps-elastique', 'kickback-triceps-halteres', 'developpe-arnold-halteres', 'traction-negative-barre', 'curl-poignet-halteres'];
    for (const c of CASES) for (const e of ids(gen(c.prof, c.days))) if (NEVER.includes(e.ficheId)) expect(PILLARS, `${c.name} ${e.ficheId}`).not.toContain(e.slot);
  });
});

describe('Rotation de semaine 2 et cou (CAL-12)', () => {
  it('une séance qui contient le renforcement du cou n\'a jamais de piège « épaule lourde » dans le jeu 1 ni dans le jeu 2', async () => {
    const { hasHeavyShoulderTrap } = await import('../../src/generator/zones-check');
    const { buildCtx } = await import('../../src/generator/context');
    let withNeck = 0;
    for (const prof of ['D', 'E', 'F', 'M']) for (const days of [3, 4, 5, 6]) {
      const i = mk({ profile: prof, days, level: 'intermediaire', goal: 'muscle', dur: 60, place: prof === 'F' ? 'salle' : 'maison', options: { gagnerDuTemps: true } });
      const input = { ...i, profile: { ...i.profile, neckScreen: 'non' as const } };
      const r = generateProgram(input);
      if (!r.ok) continue;
      const ctx = buildCtx(input);
      for (const s of r.program.sessions) for (const w of [1, 2]) {
        const exs = wk(s, w);
        if (!exs.some((e) => e.ficheId === 'renfo-cou-isometrique')) continue;
        withNeck++;
        expect(hasHeavyShoulderTrap({ exercises: exs }, ctx), `${prof}/${days}j ${s.label} semaine ${w}`).toBe(false);
      }
    }
    expect(withNeck).toBeGreaterThan(0);
  });
});

describe('Isolation : reprise, grossesse, post-partum', () => {
  const all = (p: GenProgram) => p.sessions.flatMap((s) => s.exercises.flatMap((e) => (e.alt ? [e, e.alt] : [e])));
  it('reprise active : aucune isolation (le programme sans reprise en a)', () => {
    let avec = 0;
    for (const c of CASES) {
      if (all(gen(c.prof, c.days)).some((e) => e.slot.startsWith('iso_'))) avec++;
      const i = mk({ profile: c.prof, days: c.days, level: 'intermediaire', goal: 'muscle', dur: 60, place: c.prof === 'F' ? 'salle' : 'maison', options: { gagnerDuTemps: true, repriseActive: true } });
      const r = generateProgram(i);
      if (!r.ok) continue;
      expect(all(r.program).filter((e) => e.slot.startsWith('iso_')), c.name).toEqual([]);
    }
    expect(avec).toBeGreaterThan(0);
  });
  it('grossesse et post-partum : aucun triceps nommé', () => {
    const TRI = ['extension-triceps-elastique', 'kickback-triceps-halteres'];
    for (const preg of ['enceinte', 'post_partum'] as const) for (const c of CASES) {
      const p = gen(c.prof, c.days, { preg });
      expect(all(p).filter((e) => TRI.includes(e.ficheId) || e.slot === 'iso_triceps'), preg + ' ' + c.name).toEqual([]);
    }
  });
});
