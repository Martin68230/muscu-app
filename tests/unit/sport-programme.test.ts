// « Mon sport », étape 2 (knowledge/saisie-sport-v1.md §8 et « Avis kine du 13/11/2026 ») : carte de la semaine (S2-A), placement des séances
// de force du programme (S2-B), objectif sport sans dose plus haute (S2-C), intensité habituelle « très dur » seulement (S2-F).
import { describe, expect, it } from 'vitest';
import type { Level, SportPlanEntry } from '../../src/data/model';
import { generateProgram } from '../../src/generator';
import { JUMPS } from '../../src/generator/config';
import { adaptWeekToSport, canHost, noForceDays } from '../../src/generator/sport-plan';
import type { GeneratorInput, GenProgram } from '../../src/generator/types';
import { SPORT } from '../../src/sport/sport-config';
import { legDays, weekLoadMap } from '../../src/sport/week-map';
import { validateRow } from '../../src/data/validate';
import { mk } from './generator-helpers';

const MON = 0, TUE = 1, WED = 2, THU = 3, FRI = 4, SAT = 5, SUN = 6;
const map = (plan: SportPlanEntry[] | undefined, level: Level = 'intermediaire') => weekLoadMap(plan, level, JUMPS.startContacts[level]);
const withSport = (input: GeneratorInput, sportPlan: SportPlanEntry[]): GeneratorInput => ({ ...input, profile: { ...input.profile, sportPlan } });
const gen = (input: GeneratorInput): GenProgram => {
  const r = generateProgram(input);
  if (!r.ok) throw new Error('programme');
  return r.program;
};
const LEG_TYPES = ['CE', 'BAS', 'LEGS'];

describe('S2-A : carte de la semaine (weekLoadMap)', () => {
  it('aucun sport : tous les jours libres', () => {
    for (const d of map(undefined)) expect(d).toMatchObject({ legs: 'ok', noForce: false, shoulder: 'free', jumpLock: false, cardioBlocked: false, sportDay: false });
    expect(legDays(map([]))).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it('f = 1 (mercredi) : mercredi et jeudi refusés, vendredi adouci, samedi adouci (avancé : pleine dose permise), le reste libre', () => {
    const plan: SportPlanEntry[] = [{ sport: 'foot', perWeek: 1, weekdays: [WED] }];
    const m = map(plan);
    expect([m[WED].legs, m[THU].legs, m[FRI].legs, m[SAT].legs, m[SUN].legs, m[MON].legs, m[TUE].legs]).toEqual(['refuse', 'refuse', 'soften', 'soften', 'ok', 'ok', 'ok']);
    expect(map(plan, 'avance')[SAT].legs).toBe('warn');
    expect(map(plan, 'debutant')[SAT].legs).toBe('soften');
    expect(m[WED].sportDay).toBe(true);
    expect(m[WED].cardioBlocked).toBe(true); // sport « soutenue » le jour même
    expect(legDays(m)).toEqual([MON, TUE, SUN]);
  });

  it('f = 3 (lundi, mercredi, vendredi) : aucun créneau lourd, dimanche seul adouci ; f >= 4 : idem', () => {
    for (const level of ['debutant', 'intermediaire', 'avance'] as Level[]) {
      const m = map([{ sport: 'foot', weekdays: [MON, WED, FRI] }], level);
      expect(legDays(m), level).toEqual([]);
      expect([TUE, THU, SAT].map((d) => m[d].legs), level).toEqual(['refuse', 'refuse', 'refuse']);
      expect(m[SUN].legs, level).toBe('soften');
    }
    expect(legDays(map([{ sport: 'foot', weekdays: [MON, TUE, THU, FRI] }]))).toEqual([]);
    expect(legDays(map([{ sport: 'foot', weekdays: [MON, TUE, WED, THU, FRI] }], 'avance'))).toEqual([]);
  });

  it('4 jours de sport ou plus : aucune force des jambes pour TOUS les niveaux, avancé compris', () => {
    const plans: number[][] = [[MON, TUE, WED, THU], [TUE, WED, THU, FRI], [MON, TUE, WED, THU, FRI], [WED, THU, FRI, SAT]];
    for (const level of ['debutant', 'intermediaire', 'avance'] as Level[]) {
      for (const weekdays of plans) {
        const m = map([{ sport: 'foot', weekdays }], level);
        expect(legDays(m), `${level} ${weekdays}`).toEqual([]);
        expect(m.some((d) => d.legs === 'warn' || d.legs === 'ok'), `${level} ${weekdays}`).toBe(false);
      }
    }
    const p = gen(withSport(mk({ level: 'avance', days: 3, dur: 60, goal: 'muscle', profile: 'F', place: 'salle' }), [{ sport: 'foot', weekdays: [MON, TUE, WED, THU] }]));
    expect(p.sessions.some((s) => LEG_TYPES.includes(s.type))).toBe(false);
  });

  it('jour de match : aucune force ; veille : adoucie (refusée pour un débutant) ; lendemain : refusée ; sauts verrouillés 48 h avant et 2 jours après', () => {
    const plan: SportPlanEntry[] = [{ sport: 'volley', weekdays: [], matchWeekday: SAT, jumps: true }];
    const m = map(plan);
    expect(m[SAT]).toMatchObject({ noForce: true, matchDay: true, legs: 'refuse' });
    expect(m[FRI]).toMatchObject({ legs: 'soften', eveOfMatch: true });
    expect(map(plan, 'debutant')[FRI].legs).toBe('refuse');
    expect(m[SUN]).toMatchObject({ legs: 'refuse', dayAfterMatch: true });
    expect([m[THU].jumpLock, m[FRI].jumpLock, m[SAT].jumpLock, m[SUN].jumpLock, m[MON].jumpLock]).toEqual([true, true, true, true, true]);
    expect(m[WED].jumpLock).toBe(false);
    // Match = « très dur » : jambes légères jusqu'à 72 h pour tous les niveaux (jamais de pleine dose, même avancé).
    expect(map(plan, 'avance')[MON].legs).toBe('soften');
    expect(map(plan, 'avance')[TUE].legs).toBe('soften');
    expect(map(plan, 'avance')[WED].legs).toBe('ok');
    // Volley : épaule lourde exclue la veille et le jour même.
    expect(m[FRI].noUpperPush).toBe(true);
    expect(m[SAT].noUpperPush).toBe(true);
    expect(noForceDays(m, 'intermediaire')).toEqual([SAT]);
    expect(noForceDays(m, 'debutant')).toEqual([FRI, SAT]);
  });

  it('deux sports : le pire de chaque jour (un seul jour chargé)', () => {
    const one = map([{ sport: 'foot', weekdays: [WED] }]);
    const two = map([{ sport: 'foot', weekdays: [WED] }, { sport: 'danse', weekdays: [WED, THU] }]);
    const order = ['ok', 'warn', 'soften', 'refuse'];
    for (let d = 0; d < 7; d++) expect(order.indexOf(two[d].legs)).toBeGreaterThanOrEqual(order.indexOf(one[d].legs));
    expect(two[THU].legs).toBe('refuse');
    expect(two[FRI].legs).toBe('refuse');
    expect(legDays(two)).toEqual([MON, TUE]);
  });

  it('S2-F : « très dur » habituel déclaré est plus restrictif ; il n’existe pas dans le sens « facile »', () => {
    const base: SportPlanEntry[] = [{ sport: 'foot', weekdays: [WED] }];
    const hard: SportPlanEntry[] = [{ sport: 'foot', weekdays: [WED], habitualEffort: 'tres_dur' }];
    expect(map(base, 'avance')[SAT].legs).toBe('warn');
    expect(map(hard, 'avance')[SAT].legs).toBe('soften');
    expect(map(hard)[SUN].legs).toBe('ok');
    // L'import refuse « facile » (assouplirait un refus de sécurité).
    const row = (e: unknown) => ({ id: 'p', displayName: 'x', blockedWeekdays: [], sports: [], aiEnabled: false, sportPlan: [e], createdAt: '2026-11-13T00:00:00.000Z', updatedAt: '2026-11-13T00:00:00.000Z', deletedAt: null, ownerId: 'u', version: 1 });
    expect(validateRow('profile', row({ sport: 'foot', habitualEffort: 'tres_dur' }) as never).filter((e) => /habitualEffort/.test(e))).toEqual([]);
    expect(validateRow('profile', row({ sport: 'foot', habitualEffort: 'facile' }) as never).some((e) => /habitualEffort/.test(e))).toBe(true);
  });
});

describe('S2-B : placement des séances de force du programme', () => {
  const base = mk({ level: 'intermediaire', days: 3, dur: 60, goal: 'muscle', profile: 'F', place: 'salle' });

  it('sans sport déclaré, ou interrupteur éteint : programme identique', () => {
    const a = gen(base);
    expect(JSON.stringify(gen(withSport(base, [])).sessions)).toBe(JSON.stringify(a.sessions));
    (SPORT as { enabled: boolean }).enabled = false;
    try {
      expect(JSON.stringify(gen(withSport(base, [{ sport: 'foot', weekdays: [MON, WED, FRI] }])).sessions)).toBe(JSON.stringify(a.sessions));
    } finally {
      (SPORT as { enabled: boolean }).enabled = true;
    }
  });

  it('f = 1 : chaque séance de jambes tombe un jour sans charge de jambes', () => {
    const plan: SportPlanEntry[] = [{ sport: 'foot', weekdays: [WED] }];
    const p = gen(withSport(base, plan));
    const m = map(plan);
    for (const s of p.sessions) {
      if (LEG_TYPES.includes(s.type)) expect(['ok', 'warn'], `${s.label}@${s.weekday}`).toContain(m[s.weekday].legs);
    }
    expect(p.sessions.length).toBeGreaterThan(0);
  });

  it('f = 3 (lundi, mercredi, vendredi) : aucune force des jambes, rien reporté ni ajouté ailleurs, message du sport', () => {
    const plan: SportPlanEntry[] = [{ sport: 'foot', weekdays: [MON, WED, FRI] }];
    const sans = gen(base);
    const p = gen(withSport(base, plan));
    expect(sans.sessions.some((s) => LEG_TYPES.includes(s.type))).toBe(true);
    // A1 (13/11/2026) : aucune séance BAS / LEGS ; au plus UNE séance corps entier à jambes légères (voir tests/unit/sport-a1.test.ts).
    expect(p.sessions.filter((s) => s.type === 'BAS' || s.type === 'LEGS')).toHaveLength(0);
    expect(p.sessions.filter((s) => s.type === 'CE').length).toBeLessThanOrEqual(1);
    expect(p.sessions.length).toBeLessThanOrEqual(sans.sessions.length);
    expect(p.messages.map((x) => x.id)).toContain('V-MSG-SPORT-PLACE');
    expect(new Set(p.sessions.map((s) => s.weekday)).size).toBe(p.sessions.length);
    for (const s of p.sessions) for (const e of s.exercises) expect(e.sets).toBeLessThanOrEqual(4);
  });

  it('match le samedi : aucune séance le samedi ; le débutant n’a rien non plus la veille', () => {
    const plan: SportPlanEntry[] = [{ sport: 'volley', matchWeekday: SAT, jumps: true }];
    const p = gen(withSport(base, plan));
    expect(p.sessions.map((s) => s.weekday)).not.toContain(SAT);
    const deb = gen(withSport(mk({ level: 'debutant', days: 3, dur: 45, goal: 'sante', profile: 'F', place: 'salle' }), plan));
    expect(deb.sessions.map((s) => s.weekday)).not.toContain(SAT);
    expect(deb.sessions.map((s) => s.weekday)).not.toContain(FRI);
  });

  it('jour d’épaule (volley) : pas de poussée le jour même ni le lendemain ; jambes seulement un jour libre ; au plus 6 jours d’entraînement', () => {
    const plan: SportPlanEntry[] = [{ sport: 'volley', weekdays: [TUE, THU] }];
    const m = map(plan);
    for (const lvl of ['intermediaire', 'avance'] as const) {
      const p = gen(withSport(mk({ level: lvl, days: 4, dur: 60, goal: 'muscle', profile: 'F', place: 'salle' }), plan));
      for (const s of p.sessions) {
        if (['CE', 'HAUT', 'PUSH'].includes(s.type)) expect(m[s.weekday].noUpperPush, `${s.label}@${s.weekday}`).toBe(false);
        if (LEG_TYPES.includes(s.type)) expect(['ok', 'warn']).toContain(m[s.weekday].legs);
      }
      const all = new Set([...p.sessions.map((s) => s.weekday), TUE, THU]);
      expect(all.size).toBeLessThanOrEqual(6);
    }
  });

  it('cardio dédié : jamais un jour de sport « soutenue » ou plus', () => {
    const plan: SportPlanEntry[] = [{ sport: 'foot', weekdays: [MON, THU] }];
    const p = gen(withSport(mk({ level: 'intermediaire', days: 3, dur: 60, goal: 'sport', profile: 'F', place: 'salle' }), plan));
    const m = map(plan);
    for (const c of p.cardioSessions ?? []) {
      const wd = (c as unknown as { weekday?: number }).weekday;
      if (wd !== undefined) expect(m[wd].cardioBlocked, `cardio@${wd}`).toBe(false);
    }
  });

  it('adaptWeekToSport : séances retirées avant le sport au-delà de 6 jours ; aucune séance un jour de match', () => {
    const m = map([{ sport: 'foot', weekdays: [MON, TUE, WED, THU] }]);
    const r = adaptWeekToSport(['HAUT-A', 'HAUT-B', 'PULL-A'], [FRI, SAT, SUN], m);
    expect(new Set([...r.days, MON, TUE, WED, THU]).size).toBeLessThanOrEqual(6);
    expect(canHost('CE', map([{ sport: 'volley', matchWeekday: SAT }])[SAT])).toBe(false);
  });
});

describe('S2-C : objectif sport, aucune dose plus haute', () => {
  it('rang 2 ou sport seulement pratiqué : séries par exercice jamais au-dessus du même profil sans sport', () => {
    // Hors tronc et correctifs : le plancher de tronc de la semaine (CORE-FLOOR) peut concentrer le gainage sur les séances qui restent.
    const doseOf = (p: GenProgram) => Math.max(...p.sessions.flatMap((s) => s.exercises.filter((e) => e.slot !== 'tronc' && e.slot !== 'correctif').map((e) => e.sets)));
    for (const level of ['debutant', 'intermediaire', 'avance'] as Level[]) {
      const b = mk({ level, days: 3, dur: 60, goal: 'force', profile: 'F', place: 'salle' });
      const none = gen(b);
      const rank2 = gen({ ...b, goals: [{ goalKey: 'force', rank: 1 }, { goalKey: 'sport', rank: 2 }] });
      const practised = gen(withSport(b, [{ sport: 'foot', weekdays: [WED] }]));
      expect(doseOf(rank2), level).toBeLessThanOrEqual(doseOf(none));
      expect(doseOf(practised), level).toBeLessThanOrEqual(doseOf(none));
    }
  });
});
