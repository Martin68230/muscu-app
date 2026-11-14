// « Mon sport » A1 (saisie-sport-v1.md §9 et avis kiné du 13/11/2026) : trois jours de sport = une séance corps entier à jambes légères.
import { describe, expect, it } from 'vitest';
import type { Level, SportPlanEntry } from '../../src/data/model';
import { generateProgram } from '../../src/generator';
import { JUMPS } from '../../src/generator/config';
import { adaptWeekToSport } from '../../src/generator/sport-plan';
import { a1Allowed, LEG_SCHEMAS } from '../../src/generator/sport-legs-light';
import type { GenProgram } from '../../src/generator/types';
import { weekLoadMap } from '../../src/sport/week-map';
import { mk, type MkOpts } from './generator-helpers';

const MON = 0, TUE = 1, WED = 2, THU = 3, FRI = 4, SAT = 5, SUN = 6;
const map = (plan: SportPlanEntry[], level: Level = 'intermediaire') => weekLoadMap(plan, level, JUMPS.startContacts[level]);
const MWF: SportPlanEntry[] = [{ sport: 'foot', weekdays: [MON, WED, FRI] }];
const gen = (o: MkOpts, plan: SportPlanEntry[], tweak?: (i: ReturnType<typeof mk>) => void): GenProgram => {
  const input = mk({ goal: 'muscle', dur: 60, days: 3, level: 'intermediaire', profile: 'F', place: 'salle', ...o });
  input.profile.sportPlan = plan;
  tweak?.(input);
  const r = generateProgram(input);
  if (!r.ok) throw new Error('programme');
  return r.program;
};
const legEx = (p: GenProgram) => p.sessions.flatMap((s) => s.exercises.filter((e) => LEG_SCHEMAS.includes(e.schema) && e.schema !== 'cheville_mollet' && e.schema !== 'hanche_laterale').map((e) => ({ s, e })));

describe('A1 : placement (adaptWeekToSport)', () => {
  it('3 jours de sport (lun / mer / ven) : le créneau de jambes du dimanche devient un corps entier ; sinon haut du corps', () => {
    const m = map(MWF);
    const a = adaptWeekToSport(['HAUT-A', 'BAS-A', 'HAUT-B'], [TUE, SUN, THU], m, true);
    expect(a.a1Label).toBe('A');
    expect(a.labels).toEqual(['HAUT-A', 'A', 'HAUT-B']);
    const b = adaptWeekToSport(['HAUT-A', 'BAS-A', 'HAUT-B'], [TUE, SUN, THU], m, false);
    expect(b.a1Label).toBeNull();
    expect(b.labels.some((l) => l.startsWith('BAS') || l === 'A')).toBe(false);
  });
  it('2 ou 4 jours de sport : jamais A1 ; veille de match, jour de match : jamais A1', () => {
    for (const plan of [[{ sport: 'foot', weekdays: [MON, THU] }], [{ sport: 'foot', weekdays: [MON, TUE, THU, FRI] }]] as SportPlanEntry[][]) {
      const a = adaptWeekToSport(['HAUT-A', 'BAS-A', 'HAUT-B'], [TUE, SAT, THU], map(plan), true);
      expect(a.a1Label).toBeNull();
    }
    // match le lundi suivant : le dimanche est la veille de match.
    const m = map([{ sport: 'foot', weekdays: [MON, WED], matchWeekday: MON }, { sport: 'volley', weekdays: [FRI] }]);
    expect(m[SUN].eveOfMatch).toBe(true);
    expect(adaptWeekToSport(['HAUT-A', 'BAS-A', 'HAUT-B'], [TUE, SUN, THU], m, true).a1Label).toBeNull();
  });
});

describe('A1 : programme généré', () => {
  it('3 jours de sport (lun / mer / ven), 3 séances : une séance corps entier, jambes bilatérales sans charge, 2 séries, réserve >= 3, message', () => {
    for (const level of ['debutant', 'intermediaire', 'avance'] as Level[]) {
      const p = gen({ level, days: 3 }, MWF);
      const a1 = p.sessions.filter((s) => s.type === 'CE');
      expect(a1.length, level).toBe(1);
      expect(a1[0].weekday, level).toBe(SUN);
      // Jambes de la semaine : seulement dans la séance A1, légères.
      for (const { s, e } of legEx(p)) {
        expect(s.type, level).toBe('CE');
        expect(e.unilateral, `${level} ${e.ficheId}`).toBe(false);
        expect(e.sets).toBeLessThanOrEqual(2);
        expect(e.rirTarget).toBeGreaterThanOrEqual(3);
        expect(e.startLoadKg ?? null, `${level} ${e.ficheId}`).toBeNull();
        expect(['nordique-ischios', 'copenhague-court']).not.toContain(e.ficheId);
      }
      expect(p.messages.some((m) => m.id === 'V-MSG-SPORT-A1'), level).toBe(true);
      expect(legEx(p).length, level).toBeGreaterThan(0);
      // Le reste du corps travaille : poussée et tirage dans la séance A1.
      expect(a1[0].exercises.some((e) => e.slot.startsWith('poussee')), level).toBe(true);
      expect(a1[0].exercises.some((e) => e.slot.startsWith('tirage')), level).toBe(true);
    }
  });

  it('copenhague-court jamais dans la séance A1 (foot), jamais de nordique', () => {
    const p = gen({ level: 'avance' }, [{ sport: 'foot', weekdays: [MON, WED, FRI] }]);
    const a1 = p.sessions.find((s) => s.type === 'CE');
    expect(a1?.exercises.some((e) => e.ficheId === 'copenhague-court' || e.ficheId === 'nordique-ischios')).toBe(false);
  });

  it('grossesse, gêne de genou ou de dos : pas de corps entier A1, aucune jambe cette semaine', () => {
    for (const zone of ['genou', 'dos', 'hanche', 'cheville'] as const) {
      const p = gen({ injuries: [[zone, 1]] }, MWF);
      expect(p.sessions.filter((s) => s.type === 'CE'), zone).toHaveLength(0);
      expect(legEx(p), zone).toHaveLength(0);
    }
  });

  it('pas de sport, ou 2 jours de sport : aucun corps entier A1, programme inchangé', () => {
    const base = gen({}, []);
    expect(base.messages.some((m) => m.id === 'V-MSG-SPORT-A1')).toBe(false);
    const two = gen({}, [{ sport: 'foot', weekdays: [MON, THU] }]);
    expect(two.messages.some((m) => m.id === 'V-MSG-SPORT-A1')).toBe(false);
  });

  it('a1Allowed : grossesse, post-partum, reprise, semaine légère, zone de jambes : refusé', () => {
    const ok = { pregnant: false, postPartum: false, repriseActive: false, lightWeek: false, zones: [], recentPainZones: new Set<never>() };
    expect(a1Allowed(ok)).toBe(true);
    for (const k of ['pregnant', 'postPartum', 'repriseActive', 'lightWeek'] as const) expect(a1Allowed({ ...ok, [k]: true }), k).toBe(false);
    for (const z of ['genou', 'hanche', 'cheville', 'dos', 'cuisse', 'aine']) expect(a1Allowed({ ...ok, zones: [{ key: z, level: 1, isG: false }] as never }), z).toBe(false);
    expect(a1Allowed({ ...ok, zones: [{ key: 'epaule', level: 1, isG: false }] as never })).toBe(true);
  });
});

describe('A1 : toutes les jambes de la séance sont légères (hanche latérale comprise)', () => {
  it('aucun exercice unilatéral ni copenhague / nordique dans la séance A1, quel que soit le schéma', () => {
    for (const level of ['debutant', 'intermediaire', 'avance'] as Level[]) {
      for (const sport of ['foot', 'danse'] as const) {
        const p = gen({ level, days: 4 }, [{ sport, weekdays: [MON, WED, FRI] }]);
        for (const s of p.sessions.filter((x) => x.type === 'CE')) {
          for (const e of s.exercises) {
            expect(['copenhague-court', 'nordique-ischios'], `${level} ${sport}`).not.toContain(e.ficheId);
            if (LEG_SCHEMAS.includes(e.schema) && e.slot !== 'prevention_sport') expect(e.unilateral, `${level} ${e.ficheId}`).toBe(false);
          }
        }
      }
    }
  });
});
