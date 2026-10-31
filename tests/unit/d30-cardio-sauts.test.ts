// D30 / D31 : plafonds de cardio par objectif (cardio-regles.md §3.2bis), option « Ajouter une séance de cardio ? » et séance de sport
// (§3.2ter A, B, C), sauts (§5.1, §5.2, §5.2bis R-PLIO, cas test D28), course (§5.3), extérieur (§5.4), machines
// (machines-etiquettes.md), isolation (structure-programmes.md STR-ISO), cardio doux du jour léger (STR-REP-12), verrous de 6ter.
// Fiches réelles (public/data/fiches.json) ; profils nommés ; fiches forcées par id quand une règle vise une fiche précise.
import { describe, expect, it } from 'vitest';
import type { SetLog, WorkoutSession } from '../../src/data/model';
import { generateProgram, toProgramDays } from '../../src/generator';
import {
  CARDIO_CAPS, CARDIO_OPTION, FICHES_NON_DISPONIBLES, IMPACT_SCHEMAS, IMPACT_VARIANTS, ISOLATION, JUMPS, MACHINE_TAGS, PENDING_RULES, RUN,
} from '../../src/generator/config';
import { buildCtx } from '../../src/generator/context';
import {
  composeJumpBlock, composePlioStrength, createSessionCheck, impactExclusion, jumpChoices, jumpContacts, jumpDayAllowed, jumpsAllowedAfterHeavyLegs,
  nextRunStage, onSpotRunSec, outdoorRunAllowed, palier0Done, plioBlockMin, runAfterPause, runDayAllowed, runFicheAvailable, runOrWalk,
  runSortieMin, runStageBodyMin, runStageLongest, runStageRunMin, strengthBlockMin, type CreateState,
} from '../../src/generator/impact';
import { ficheAdmissible } from '../../src/generator/safety';
import type { GeneratorInput, GenProgram } from '../../src/generator/types';
import { isoBeginnerOpen } from '../../src/session/program';
import { D30_TEXT } from '../../src/session/messages';
import { FICHES, mk, msgIds, type MkOpts } from './generator-helpers';

const prog = (i: GeneratorInput): GenProgram => {
  const r = generateProgram(i);
  if (!r.ok) throw new Error(`pas de programme : ${r.code}`);
  return r.program;
};
const withProfile = (i: GeneratorInput, extra: Partial<GeneratorInput['profile']>): GeneratorInput => ({ ...i, profile: { ...i.profile, ...extra } });
const salle = (o: MkOpts = {}) => mk({ profile: 'F', place: 'salle', level: 'intermediaire', ...o });
const opt = (i: GeneratorInput, seanceCardio?: boolean): GeneratorInput => ({ ...i, options: { ...(i.options ?? {}), ...(seanceCardio === undefined ? {} : { seanceCardio }) } });
// 2 jours de force (corps entier) : un jour libre éloigné des jambes lourdes existe (à 3 jours corps entier, aucun : lecture prudente).
const sportVolley = (o: MkOpts = {}, sports = ['volley']) => withProfile(mk({ goal: 'sport', days: 2, dur: 45, ...o }), { sports });
const variantsOf = (p: GenProgram): string[] => [
  ...p.sessions.flatMap((s) => [...s.exercises.map((e) => e.variantId), ...(s.cardio ? [s.cardio.variantId] : []), ...s.warmup.mobility.map((m) => m.variantId), ...(s.warmup.general ? [s.warmup.general.variantId] : [])]),
  ...(p.cardioSessions ?? []).flatMap((c) => [c.cardio.variantId, ...(c.jumps?.items.map((j) => j.variantId) ?? [])]),
  ...p.lightDays.flatMap((d) => [...d.mobility.map((m) => m.variantId), ...(d.cardio ? [d.cardio.variantId] : [])]),
];
const ficheOfVariant = (id: string) => FICHES.find((f) => f.variantes.some((v) => v.id === id));
const heavy = (p: GenProgram) => new Set(p.sessions.filter((s) => ['CE', 'BAS', 'LEGS'].includes(s.type)).map((s) => s.weekday));

describe('Statuts et points d\'extension', () => {
  it('règles D30 / D31 actives, « Créer une séance » à l\'étape suivante, fiches de vague 2 « non disponibles »', () => {
    for (const k of ['sauts', 'course', 'plafondCardioObjectif', 'exterieur', 'etiquettesMachines', 'isolationDebutant'] as const) expect(PENDING_RULES[k].enabled).toBe(true);
    expect(PENDING_RULES.creerSeance.enabled).toBe(false);
    expect(FICHES_NON_DISPONIBLES).toContain('corde-a-sauter');
  });
});

describe('§3.2bis, §3.2ter A : option « Ajouter une séance de cardio ? » (force, muscle, perte de gras)', () => {
  it('décochée par défaut : aucune séance, option proposée et non cochée', () => {
    const p = prog(opt(salle({ goal: 'force', days: 3 })));
    expect(p.cardioSessions ?? []).toHaveLength(0);
    expect(p.cardioOption).toMatchObject({ kind: 'option', offered: true, accepted: false, disabledReason: null });
  });
  it('acceptée : 1 séance (intermédiaire), jour libre, jamais sur un jour de force, modérée, 30 min au départ, 40 au plus ; messages de sécurité du cardio', () => {
    for (const goal of CARDIO_OPTION.goals) {
      const p = prog(opt(salle({ goal, days: 3, dur: 60 }), true));
      expect(p.cardioSessions).toHaveLength(1);
      const c = p.cardioSessions![0];
      expect(c.kind).toBe('option');
      expect(p.sessions.some((s) => s.weekday === c.weekday)).toBe(false);
      expect(c.cardio.minutes).toBe(30);
      expect(c.cardio.capMin).toBe(40);
      expect(c.jumps ?? null).toBeNull();
      expect(IMPACT_VARIANTS).not.toContain(c.cardio.variantId);
      for (const id of ['T0', 'T1', 'T1u', 'V-MSG-CARDIO-OMS']) expect(msgIds(p)).toContain(id);
      expect(p.sessions).toHaveLength(3); // la musculation n'est jamais réduite
    }
  });
  it('lendemain d\'une séance de jambes lourdes : séance « facile » ; jamais la veille-lendemain forcé', () => {
    for (const days of [3, 4, 5]) {
      const p = prog(opt(salle({ goal: 'muscle', days }), true));
      const hv = heavy(p);
      for (const c of p.cardioSessions ?? []) if (hv.has((c.weekday + 6) % 7)) expect(c.cardio.intensity).toBe('facile');
    }
  });
  it('débutant 1 (20 -> 30 min), avancé 2 au plus ; au plus 6 jours d\'entraînement', () => {
    const d = prog(opt(salle({ goal: 'muscle', level: 'debutant', days: 3 }), true));
    expect(d.cardioSessions).toHaveLength(1);
    expect(d.cardioSessions![0].cardio.minutes).toBe(20);
    expect(d.cardioSessions![0].cardio.capMin).toBe(30);
    const a = prog(opt(salle({ goal: 'force', level: 'avance', days: 3, dur: 60 }), true));
    expect(a.cardioSessions).toHaveLength(2);
    expect(a.cardioSessions!.every((c) => c.cardio.capMin <= 45)).toBe(true);
    const a5 = prog(opt(salle({ goal: 'force', level: 'avance', days: 5 }), true));
    expect(a5.sessions.length + (a5.cardioSessions?.length ?? 0)).toBeLessThanOrEqual(CARDIO_OPTION.maxTrainingDays);
  });
  it('grisée : moins de 3 jours, pas de jour libre (6 jours de force), gêne aux jambes au niveau 2', () => {
    expect(prog(opt(salle({ goal: 'muscle', days: 2 }), true)).cardioOption?.disabledReason).toBe(D30_TEXT.optionFewDays);
    const six = prog(opt(salle({ goal: 'muscle', days: 6 }), true));
    expect(six.cardioOption?.disabledReason).toBe(D30_TEXT.optionNoDay);
    expect(six.cardioSessions ?? []).toHaveLength(0);
    const blocked = prog(opt(salle({ goal: 'muscle', days: 3, blocked: [1, 3, 5, 6] }), true));
    expect(blocked.cardioOption?.disabledReason).toBe(D30_TEXT.optionNoDay);
    const knee = prog(opt(salle({ goal: 'muscle', days: 3, injuries: [['genou', 2]] }), true));
    expect(knee.cardioOption?.disabledReason).toBe(D30_TEXT.optionLegZone);
    expect(knee.cardioSessions ?? []).toHaveLength(0);
  });
  it('cardio en rang 2 + séance acceptée : les blocs sont réduits à 1', () => {
    const i = opt(salle({ goal: 'muscle', days: 3, dur: 60 }), true);
    i.goals = [{ goalKey: 'muscle', rank: 1 }, { goalKey: 'cardio', rank: 2 }];
    const p = prog(i);
    expect(p.cardioSessions).toHaveLength(1);
    expect(p.sessions.filter((s) => s.cardio).length).toBeLessThanOrEqual(CARDIO_OPTION.blocksWhenAccepted);
  });
  it('grossesse / post-partum : 1 séance de 20 min au plus, modérée, jamais à la place d\'un jour léger', () => {
    for (const preg of ['enceinte', 'post_partum'] as const) {
      const p = prog(opt(mk({ goal: 'muscle', level: 'intermediaire', days: 4, preg }), true));
      expect(p.cardioSessions!.length).toBeLessThanOrEqual(CARDIO_CAPS.pregnancyMax);
      for (const c of p.cardioSessions!) {
        expect(c.cardio.capMin).toBeLessThanOrEqual(CARDIO_CAPS.pregnancyMaxMin);
        expect(c.jumps ?? null).toBeNull();
        expect(p.lightDays.some((d) => d.weekday === c.weekday)).toBe(false);
      }
    }
  });
});

describe('§3.2ter B, C : séance de sport incluse ; forme / santé ; cardio rang 1 inchangé', () => {
  it('sport : 1 séance incluse par défaut, retirable (false), texte « veille de match »', () => {
    const p = prog(mk({ goal: 'sport', days: 3 }));
    expect(p.cardioSessions?.map((c) => c.kind)).toEqual(['sport']);
    expect(p.cardioOption).toMatchObject({ kind: 'sport', accepted: true });
    expect(msgIds(p)).toContain('V-MSG-SPORT-MATCH');
    expect(prog(opt(mk({ goal: 'sport', days: 3 }), false)).cardioSessions ?? []).toHaveLength(0);
  });
  it('forme / santé : jours légers seulement (jamais un jour au-delà de N), plafond 1 (débutant) ou 2', () => {
    const d = prog(mk({ goal: 'sante', level: 'debutant', days: 6, profile: 'B' }));
    expect(d.cardioSessions?.length).toBe(1);
    expect(d.sessions.length + d.cardioSessions!.length + d.lightDays.length).toBe(6);
    const i3 = prog(mk({ goal: 'sante', level: 'intermediaire', days: 3 }));
    expect(i3.cardioSessions ?? []).toHaveLength(0);
  });
  it('cardio rang 1 : plafonds inchangés ; grossesse : 1 séance dédiée au plus, 20 min', () => {
    const c = prog(mk({ goal: 'cardio', days: 5, level: 'intermediaire' }));
    expect(c.cardioSessions!.length).toBeLessThanOrEqual(CARDIO_CAPS.cardio.intermediaire);
    const g = prog(mk({ goal: 'cardio', days: 5, preg: 'enceinte' }));
    expect(g.cardioSessions!.length).toBeLessThanOrEqual(1);
    expect(g.cardioSessions!.every((s) => s.cardio.capMin <= 20)).toBe(true);
  });
  it('jamais plus de 300 min de cardio par semaine ; jamais plus de 3 séances dédiées', () => {
    for (const goal of ['cardio', 'sante', 'sport', 'muscle', 'force']) for (const days of [3, 4, 5, 6]) for (const level of ['debutant', 'intermediaire', 'avance'] as const) {
      const p = prog(opt(salle({ goal, days, level, dur: null }), true));
      for (let w = 0; w < 4; w++) {
        const tot = p.sessions.reduce((a, s) => a + (s.cardio?.weekMin[w] ?? 0), 0) + (p.cardioSessions ?? []).reduce((a, s) => a + (s.cardio.weekMin[w] ?? 0), 0);
        expect(tot).toBeLessThanOrEqual(CARDIO_CAPS.omsWeekMaxMin);
      }
      expect((p.cardioSessions ?? []).length).toBeLessThanOrEqual(CARDIO_CAPS.absoluteMax);
    }
  });
});

describe('§5.1, §5.2 : sauts (séance de sport d\'un sport « à sauts »)', () => {
  it('intermédiaire : sauts en tête (variantes de 5.2 seulement), contacts au départ 60 sans progression, repos 60 s, jamais en superset', () => {
    const p = prog(sportVolley());
    const c = p.cardioSessions!.find((x) => x.jumps)!;
    expect(c).toBeTruthy();
    expect(c.jumps!.items.filter((j) => !j.soft).map((j) => j.variantId).sort()).toEqual(['jumping-jacks-saut', 'rebonds-deux-pieds']);
    expect(c.jumps!.items.length).toBeLessThanOrEqual(JUMPS.maxExercises);
    expect(c.jumps!.contacts).toBeLessThanOrEqual(JUMPS.startContacts.intermediaire);
    expect(c.jumps!.items.every((j) => j.restSec >= 60 && j.reps === JUMPS.seriesReps)).toBe(true);
    expect(c.warmup?.sec).toBe(JUMPS.warmupMin * 60);
    const day = toProgramDays(p).find((d) => d.weekday === c.weekday)!;
    const idx = day.exercises.findIndex((e) => !e.jump);
    expect(day.exercises.slice(0, idx).every((e) => !!e.jump)).toBe(true); // sauts d'abord, puis l'effort modéré
    expect(day.exercises.slice(idx).some((e) => !!e.jump)).toBe(false);
    expect(day.exercises.every((e) => e.supersetGroup === null)).toBe(true);
    expect(jumpDayAllowed(c.weekday, heavy(p), 'intermediaire')).toBe(true);
  });
  it('débutant : version douce prévue (aucun contact), version avec saut jamais imposée', () => {
    const ctx = buildCtx(sportVolley({ level: 'debutant' }));
    const b = composeJumpBlock(ctx, jumpChoices(ctx), jumpContacts('debutant', 1, false))!;
    expect(b.items.length).toBeGreaterThan(0);
    expect(b.items.every((j) => j.soft)).toBe(true);
    expect(b.contacts).toBe(0);
    expect(b.items.some((j) => IMPACT_VARIANTS.includes(j.variantId))).toBe(false);
    // Programme : à 2 jours corps entier, la veille et les 2 jours après les jambes lourdes ne laissent aucun jour : séance modérée sans saut.
    for (const days of [2, 3, 4, 5]) for (const c of prog(sportVolley({ level: 'debutant', days })).cardioSessions ?? []) if (c.jumps) expect(c.jumps.items.every((j) => j.soft)).toBe(true);
  });
  it('exclusions : grossesse, post-partum, genou / cheville / dos / hanche / cuisse / aine au niveau 1, reprise -> aucun saut', () => {
    const cases: GeneratorInput[] = [
      sportVolley({ preg: 'enceinte' }), sportVolley({ preg: 'post_partum' }),
      ...(['genou', 'cheville', 'dos', 'hanche', 'cuisse', 'aine'] as const).map((z) => sportVolley({ injuries: [[z, 1]] })),
      sportVolley({ options: { repriseActive: true } }),
    ];
    for (const i of cases) expect((prog(i).cardioSessions ?? []).some((c) => c.jumps)).toBe(false);
  });
  it('épaule ou poignet au niveau 2 : plus de jumping jacks avec saut (la version douce reste possible)', () => {
    const p = prog(sportVolley({ injuries: [['epaule', 2]] }));
    expect(variantsOf(p)).not.toContain('jumping-jacks-saut');
  });
  it('sans sport « à sauts » (aucun sport, foot) : séance modérée sans saut ; option force / muscle : jamais de saut ni de course', () => {
    expect(prog(sportVolley({}, [])).cardioSessions!.some((c) => c.jumps)).toBe(false);
    expect(prog(sportVolley({}, ['foot'])).cardioSessions!.some((c) => c.jumps)).toBe(false);
    const o = prog(opt(salle({ goal: 'muscle', days: 3 }), true));
    expect(o.cardioSessions!.some((c) => c.jumps)).toBe(false);
  });
  it('placement : jamais un jour de jambes lourdes, ni le lendemain, le surlendemain ou la veille', () => {
    expect([0, 1, 2, 3, 4, 5, 6].filter((d) => jumpDayAllowed(d, new Set([0, 3]), 'intermediaire'))).toEqual([6]);
    expect([0, 1, 2, 3, 4, 5, 6].filter((d) => jumpDayAllowed(d, new Set([0, 3]), 'debutant'))).toEqual([]);
    expect(jumpDayAllowed(1, new Set([0]), 'avance')).toBe(false);
    expect(jumpDayAllowed(2, new Set([0]), 'avance')).toBe(false);
    expect(jumpDayAllowed(3, new Set([0]), 'debutant')).toBe(true);
    expect(jumpDayAllowed(3, new Set([4]), 'debutant')).toBe(false); // veille : interdite au débutant seulement
    expect(jumpDayAllowed(3, new Set([4]), 'intermediaire')).toBe(true);
    expect(jumpDayAllowed(3, new Set(), 'avance', new Set([2]))).toBe(false);
    for (const level of ['debutant', 'intermediaire', 'avance'] as const) for (const days of [2, 3, 4, 5]) {
      const p = prog(sportVolley({ days, level }));
      for (const c of p.cardioSessions ?? []) if (c.jumps) expect(jumpDayAllowed(c.weekday, heavy(p), level)).toBe(true);
    }
  });
  it('48 h ET deux jours calendaires après des jambes lourdes (lundi 19 h -> jeudi)', () => {
    const mon = new Date(2026, 10, 2, 19, 0).getTime();
    expect(jumpsAllowedAfterHeavyLegs(mon, new Date(2026, 10, 4, 20, 0).getTime())).toBe(false);
    expect(jumpsAllowedAfterHeavyLegs(mon, new Date(2026, 10, 4, 23, 30).getTime())).toBe(false); // 52 h mais un seul jour complet
    expect(jumpsAllowedAfterHeavyLegs(mon, new Date(2026, 10, 5, 8, 0).getTime())).toBe(true); // jeudi : 61 h, mardi et mercredi complets
    expect(jumpsAllowedAfterHeavyLegs(new Date(2026, 10, 2, 23, 0).getTime(), new Date(2026, 10, 5, 0, 30).getTime())).toBe(true);
    expect(jumpsAllowedAfterHeavyLegs(null, mon)).toBe(true);
  });
  it('contacts : départs 40 / 60 / 80, +5 par semaine, plafonds 60 / 100 / 120, semaine 4 allégée', () => {
    expect([1, 2, 3, 4].map((w) => jumpContacts('debutant', w, true))).toEqual([40, 45, 50, 35]);
    expect(jumpContacts('intermediaire', 1, false)).toBe(60);
    expect(jumpContacts('avance', 3, false)).toBe(80);
    const ctx = buildCtx(mk({ level: 'avance' }));
    const b = composeJumpBlock(ctx, jumpChoices(ctx), 500)!;
    expect(b.contacts).toBeLessThanOrEqual(JUMPS.capContacts.avance);
  });
  it('mouvements de 5.2 seulement ; sans fiche : « non disponible » (jamais proposés)', () => {
    const ctx = buildCtx(mk({ level: 'avance' }));
    const ch = jumpChoices(ctx);
    expect(ch.length).toBeLessThanOrEqual(JUMPS.maxExercises);
    expect(ch.map((c) => c.movement.key)).not.toContain('corde');
    expect(ch.map((c) => c.jump?.variantId).filter(Boolean)).toEqual(['jumping-jacks-saut', 'rebonds-deux-pieds']);
    expect(impactExclusion({ pregnant: false, zones: [{ key: 'aine', level: 1, isG: false }] })).toBe('zone');
  });
});

describe('Le générateur ne propose jamais un exercice sans fiche, une course, ni un saut hors séance dédiée', () => {
  const grid: GeneratorInput[] = [];
  for (const goal of ['muscle', 'force', 'sante', 'cardio', 'sport', 'perte_gras']) for (const level of ['debutant', 'intermediaire', 'avance'] as const) for (const days of [2, 3, 4, 6]) {
    grid.push(withProfile(opt(salle({ goal, level, days }), true), { sports: ['volley'], exterieur: true }));
    grid.push(withProfile(opt(mk({ goal, level, days, profile: 'E' }), true), { sports: ['basket'] }));
  }
  it('aucune variante « non disponible », aucune fiche de course, sauts seulement dans les séances dédiées', () => {
    for (const i of grid) {
      const r = generateProgram(i);
      if (!r.ok) continue;
      const vs = variantsOf(r.program);
      for (const v of vs) {
        expect(FICHES_NON_DISPONIBLES).not.toContain(v);
        expect(ficheOfVariant(v)?.schema).not.toBe('course');
      }
      for (const s of r.program.sessions) {
        expect(s.exercises.some((e) => IMPACT_SCHEMAS.includes(e.schema) || IMPACT_VARIANTS.includes(e.variantId))).toBe(false);
        if (s.cardio) expect(IMPACT_VARIANTS).not.toContain(s.cardio.variantId);
      }
      expect(['montees-genoux-course', 'saut-longueur-sur-place', 'saut-vertical-demi-squat', 'saut-lateral-un-saut']).not.toContain(vs.find((v) => v.startsWith('saut') || v === 'montees-genoux-course'));
    }
    expect(runFicheAvailable(FICHES)).toBe(false);
  });
});

describe('Correctif G7 (§5.1 (1)) : grossesse seule ET post-partum seul : aucun saut ni course, même en échauffement', () => {
  it('ficheAdmissible refuse toute fiche de schéma saut, même en échauffement, pour chacun des deux réglages', () => {
    const saut = FICHES.find((f) => f.schema === 'saut')!;
    for (const preg of ['enceinte', 'post_partum'] as const) {
      const ctx = buildCtx(mk({ preg, level: 'avance' }));
      expect(ficheAdmissible(saut, ctx, { warmup: true })).toBe(false);
    }
  });
  it('aucun programme (tout objectif, sport à sauts, cardio) ne contient une variante à impact', () => {
    for (const preg of ['enceinte', 'post_partum'] as const) for (const goal of ['muscle', 'cardio', 'sport', 'sante', 'force']) for (const level of ['debutant', 'avance'] as const) {
      const p = prog(withProfile(opt(mk({ goal, level, days: 4, preg, profile: 'E' }), true), { sports: ['volley'] }));
      for (const v of variantsOf(p)) {
        expect(IMPACT_VARIANTS).not.toContain(v);
        expect(IMPACT_SCHEMAS).not.toContain(ficheOfVariant(v)?.schema);
      }
    }
  });
});

describe('§5.3 : course (fonctions pures ; aucune fiche, jamais proposée)', () => {
  it('12 paliers : temps de course total +30 % au plus, plus longue plage +50 % au plus, sorties de coach', () => {
    expect(RUN.stages).toHaveLength(12);
    expect([1, 2, 6, 12].map(runStageRunMin)).toEqual([8, 9, 16, 30]);
    for (let s = 2; s <= 12; s++) {
      expect(runStageRunMin(s) / runStageRunMin(s - 1) - 1).toBeLessThan(RUN.maxTotalGrowth);
      expect(runStageLongest(s) / runStageLongest(s - 1) - 1).toBeLessThanOrEqual(RUN.maxLongestGrowth);
      expect(Math.abs(RUN.warmupMin + runStageBodyMin(s) + RUN.cooldownMin - runSortieMin(s))).toBeLessThanOrEqual(1);
    }
    expect(runSortieMin(1)).toBe(29);
  });
  it('palier 0, passage après 2 sorties sans douleur, un palier par semaine au plus, pause', () => {
    const d = 24 * 3600 * 1000;
    const t0 = new Date(2026, 9, 1).getTime();
    const walks = [0, 2, 7, 9].map((k, i) => ({ endMs: t0 + k * d, min: i >= 2 ? 29 : 20, pain: false }));
    expect(palier0Done(walks)).toBe(true);
    expect(palier0Done(walks.map((w, i) => (i === 3 ? { ...w, min: 25 } : w)))).toBe(false);
    expect(palier0Done(walks.map((w, i) => (i === 1 ? { ...w, pain: true } : w)))).toBe(false);
    const outs = [1, 3].map((k) => ({ stage: 1, pain: false, t1: false, easy: true, endMs: t0 + k * d }));
    expect(nextRunStage(1, outs, null, t0 + 4 * d)).toBe(2);
    expect(nextRunStage(1, [outs[0], { ...outs[1], pain: true }], null, t0 + 4 * d)).toBe(1);
    expect(nextRunStage(1, outs, t0 - 2 * d, t0 + 4 * d)).toBe(1); // dernier passage il y a moins de 7 jours
    expect(runAfterPause(6, 3)).toEqual({ walkOnly: true, stage: 4, redoPalier0: false });
    expect(runAfterPause(6, 13)).toEqual({ walkOnly: true, stage: 1, redoPalier0: true });
    expect(runOrWalk(1, 20)).toEqual({ kind: 'marche', min: 20 });
    expect(runOrWalk(1, 30)).toEqual({ kind: 'course', min: 29 });
    expect(onSpotRunSec()).toBe(300);
    expect(runDayAllowed(2, new Set([1]))).toBe(false);
    expect(runDayAllowed(2, new Set([3]))).toBe(false);
    expect(runDayAllowed(2, new Set([5]))).toBe(true);
  });
  it('§5.4 : course dehors seulement avec Wake Lock, son débloqué et repli « arrête-toi pour regarder »', () => {
    expect(outdoorRunAllowed({ wakeLock: true, sound: true, lookFallback: true })).toBe(true);
    expect(outdoorRunAllowed({ wakeLock: false, sound: true, lookFallback: true })).toBe(false);
    expect(outdoorRunAllowed({ wakeLock: true, sound: false, lookFallback: true })).toBe(false);
  });
});

describe('§5.4 : extérieur (réglage du profil, marche seulement)', () => {
  it('séance de marche dédiée marquée « dehors » seulement avec le réglage ; jamais les blocs après la musculation', () => {
    const base = opt(salle({ goal: 'muscle', days: 3 }), true);
    expect(prog(base).cardioSessions!.every((c) => !c.cardio.outdoor)).toBe(true);
    const p = prog(withProfile(base, { exterieur: true }));
    expect(p.cardioSessions!.filter((c) => c.cardio.variantId === 'marche-rapide-continue').every((c) => c.cardio.outdoor)).toBe(true);
    expect(toProgramDays(p).some((d) => d.exercises.some((e) => e.outdoor))).toBe(true);
    expect(p.sessions.every((s) => !s.cardio?.outdoor)).toBe(true);
  });
});

describe('R-PLIO (§5.2bis) : cas test D28 « jambes, volley, élastique + chaise, 30 min, intermédiaire »', () => {
  const jumps = [{ key: 'squat_petit_saut', sets: 3, reps: 6 }, { key: 'saut_longueur', sets: 2, reps: 5 }, { key: 'petits_rebonds', sets: 2, reps: 8 }];
  const strength = [{ sets: 3, reps: 8, unilateral: true }, { sets: 2, reps: 8, unilateral: true }];
  it('27 min = 5 + 8 + 11 + 3 ; 54 contacts ; ordre fixé échauffement, sauts, force, retour au calme', () => {
    const c = composePlioStrength('intermediaire', 30, jumps, strength);
    expect([c.warmupMin, c.jumpsMin, c.strengthMin, c.cooldownMin, c.totalMin]).toEqual([5, 8, 11, 3, 27]);
    expect(c.contacts).toBe(54);
    expect(c.order).toEqual(['echauffement', 'sauts', 'force', 'retour_au_calme']);
    expect(c.fits).toBe(true);
    expect(plioBlockMin(7)).toBe(8);
    expect(strengthBlockMin(strength)).toBe(11);
  });
  it('version rejetée (6 séries de force) : 29 min ; débutant : pas d\'unilatéral ; plafond de contacts', () => {
    expect(composePlioStrength('intermediaire', 30, jumps, [{ sets: 3, reps: 8, unilateral: true }, { sets: 3, reps: 8, unilateral: true }]).totalMin).toBe(29);
    expect(composePlioStrength('debutant', 30, [{ key: 'petits_rebonds', sets: 2, reps: 8 }], strength).errors).toContain('unilateral-debutant');
    expect(composePlioStrength('debutant', 30, [{ key: 'a', sets: 8, reps: 8 }], []).errors).toContain('contacts-au-dessus-du-plafond');
    expect(composePlioStrength('avance', 50, jumps, strength).warmupMin).toBe(JUMPS.warmupMinLong);
  });
});

describe('§5.1 (6ter) : verrous de « Créer une séance » (fonction pure, écran D28 à venir)', () => {
  const now = new Date(2026, 10, 5, 18).getTime();
  const base: CreateState = { level: 'intermediaire', pregnant: false, zones: [], interruptedToday: false, lastHeavyEndMs: null, lastJumpEndMs: null, impactEndsMs: [], heavyTomorrow: false, pauseOver2Weeks: false, nowMs: now };
  it('verrous jamais contournés ; avertissements ; ordre sauts d\'abord', () => {
    expect(createSessionCheck({ jumps: true, run: false, legsStrength: true }, base)).toMatchObject({ locks: [], warnings: [], order: ['echauffement', 'sauts', 'force', 'retour_au_calme'] });
    expect(createSessionCheck({ jumps: true, run: false, legsStrength: false }, { ...base, pregnant: true }).locks).toContain('grossesse');
    expect(createSessionCheck({ jumps: false, run: true, legsStrength: false }, { ...base, zones: [{ key: 'cuisse', level: 1, isG: false }] }).locks).toContain('zone');
    expect(createSessionCheck({ jumps: false, run: true, legsStrength: true }, base).locks).toContain('course-et-jambes-lourdes-meme-jour');
    expect(createSessionCheck({ jumps: true, run: false, legsStrength: false }, { ...base, lastJumpEndMs: now - 30 * 3600e3 }).locks).toContain('sauts-moins-de-48h');
    const w = createSessionCheck({ jumps: true, run: false, legsStrength: false }, { ...base, lastJumpEndMs: now - 60 * 3600e3, level: 'debutant', heavyTomorrow: true });
    expect(w.locks).toEqual([]);
    expect(w.warnings).toEqual(expect.arrayContaining(['moins-de-72h', 'veille-debutant', 'une-seance-de-sauts-par-semaine']));
    expect(createSessionCheck({ jumps: true, run: false, legsStrength: false }, { ...base, impactEndsMs: [now - 24 * 3600e3] }).locks).toContain('impact-deux-jours-de-suite');
    expect(createSessionCheck({ jumps: true, run: false, legsStrength: false }, { ...base, pauseOver2Weeks: true }).startContacts).toBe(60);
  });
});

describe('machines-etiquettes.md : accès à une salle, grossesse', () => {
  const machineEx = (p: GenProgram) => p.sessions.flatMap((s) => s.exercises).filter((e) => e.tags.some((t) => MACHINE_TAGS.includes(t)));
  it('lieu maison sans accès : aucune machine guidée, poulie ni machine de cardio ; avec l\'accès : possibles', () => {
    const home = mk({ profile: 'F', place: 'maison', goal: 'muscle', days: 4, dur: 60 });
    expect(machineEx(prog(home))).toHaveLength(0);
    expect(buildCtx(home).available.has('poulie')).toBe(false);
    expect(buildCtx(withProfile(home, { salleAccess: true })).available.has('poulie')).toBe(true);
  });
  it('grossesse / post-partum : machines retirées par défaut, même en salle', () => {
    for (const preg of ['enceinte', 'post_partum'] as const) {
      expect(machineEx(prog(salle({ goal: 'muscle', days: 3, preg })))).toHaveLength(0);
      expect(buildCtx(salle({ preg })).available.has('machine_cardio')).toBe(false);
    }
  });
});

describe('STR-ISO : isolation', () => {
  const iso = (p: GenProgram) => p.sessions.flatMap((s) => s.exercises.filter((e) => e.slot.startsWith('iso_')));
  const muscle75 = (o: MkOpts = {}) => salle({ goal: 'muscle', days: 3, dur: 75, ...o });
  it('intermédiaire, prise de muscle : 2 séries, au plus 2 par séance, un par groupe, 4 séries par groupe et par semaine, après les autres', () => {
    const p = prog(muscle75());
    expect(iso(p).length).toBeGreaterThan(0);
    for (const s of p.sessions) {
      const it = s.exercises.filter((e) => e.slot.startsWith('iso_'));
      expect(it.length).toBeLessThanOrEqual(ISOLATION.maxPerSession);
      expect(new Set(it.map((e) => e.slot)).size).toBe(it.length);
      expect(it.every((e) => e.sets === ISOLATION.setsPerExercise)).toBe(true);
      const last = s.exercises.filter((e) => e.slot !== 'tronc' && e.slot !== 'fonctionnel');
      expect(last.slice(last.length - it.length).every((e) => e.slot.startsWith('iso_'))).toBe(true);
    }
    for (const def of ISOLATION.slots) expect(iso(p).filter((e) => e.slot === def.slot).reduce((a, e) => a + e.sets, 0)).toBeLessThanOrEqual(ISOLATION.maxSetsPerGroupWeek);
  });
  it('jamais : force, perte de gras, 2 jours, grossesse, débutant sans exception ; zone coude / poignet -> pas de curl', () => {
    for (const o of [{ goal: 'force' }, { goal: 'perte_gras' }, { days: 2 }, { preg: 'enceinte' as const }, { level: 'debutant' as const }]) expect(iso(prog(muscle75(o)))).toHaveLength(0);
    expect(iso(prog(muscle75({ injuries: [['coude', 1]] }))).some((e) => e.slot === 'iso_biceps')).toBe(false);
    expect(iso(prog(muscle75({ injuries: [['epaule', 1]] }))).some((e) => e.slot === 'iso_deltoide_lateral')).toBe(false);
  });
  it('débutant avant l\'exception : jambes_3 / jambes_4 sans repli cheville_mollet ; après : isolation de niveau débutant seulement', () => {
    const b = prog(salle({ goal: 'muscle', days: 4, level: 'debutant', dur: 75 }));
    expect(b.sessions.flatMap((s) => s.exercises).some((e) => (e.slot === 'jambes_3' || e.slot === 'jambes_4') && e.schema === 'cheville_mollet')).toBe(false);
    const open = prog(muscle75({ level: 'debutant', options: { isoDebutantOuverte: true } }));
    expect(iso(open).every((e) => FICHES.find((f) => f.id === e.ficheId)!.niveauMin === 'debutant')).toBe(true);
    for (const e of iso(open).filter((x) => x.slot === 'iso_deltoide_lateral')) expect(e.capped).toBe(true);
  });
  it('STR-ISO-1 : 8 semaines, 80 % des séances, sans douleur récente, sans pause de plus de 4 semaines', () => {
    const d = 24 * 3600 * 1000;
    const now = new Date(2026, 9, 30).getTime();
    const mkS = (daysAgo: number): WorkoutSession => ({ status: 'faite', endedAt: new Date(now - daysAgo * d).toISOString(), deletedAt: null, plan: null } as unknown as WorkoutSession);
    const regular = Array.from({ length: 24 }, (_, k) => mkS(1 + k * 2.3));
    expect(isoBeginnerOpen([...regular, mkS(57)], [], 3, now)).toBe(true);
    expect(isoBeginnerOpen(regular.slice(0, 10).concat(mkS(57)), [], 3, now)).toBe(false); // moins de 80 %
    expect(isoBeginnerOpen(regular, [], 3, now)).toBe(false); // moins de 8 semaines
    const pain = [{ pain: true, completedAt: new Date(now - 2 * d).toISOString() } as SetLog];
    expect(isoBeginnerOpen([...regular, mkS(57)], pain, 3, now)).toBe(false);
  });
});

describe('STR-REP-12 : jour léger lisible (mobilité + cardio doux facultatif, 30 min au plus)', () => {
  it('marche à plat de 10 min proposée, total sous 30 min ; aucune avec un genou au niveau 2', () => {
    const p = prog(mk({ goal: 'muscle', level: 'debutant', days: 6, profile: 'B' }));
    expect(p.lightDays.length).toBeGreaterThan(0);
    for (const d of p.lightDays) {
      expect(d.cardio?.variantId).toBe('marche-rapide-continue');
      expect(d.cardio!.minutes).toBe(10);
      expect(d.estimatedMin + d.cardio!.minutes).toBeLessThanOrEqual(30);
    }
    const k = prog(mk({ goal: 'muscle', level: 'debutant', days: 6, profile: 'B', injuries: [['genou', 2]] }));
    expect(k.lightDays.every((d) => !d.cardio)).toBe(true);
  });
});
