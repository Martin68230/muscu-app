// R-REPS (knowledge/repetitions-regles.md, coach 05/11/2026, durci et validé par kine sous réserve du relecteur) :
// table rôle x objectif x niveau, classes de variante D1-D4, règles du kiné (traction, technique, débutant, douleur, unilatéral, grossesse).
// Les limites de fiche (DOSE_LIMITS, NO_FAILURE_FICHES), P-GROS et le tronc passent après et ne font que baisser.
import { describe, expect, it } from 'vitest';
import { generateProgram } from '../../src/generator';
import {
  D4_FICHES, D4_NEVER, DOSE_LIMITS, FIXED_DOSE, ISOLATION_FICHE_PREFIXES, PREGNANCY_MAX_HOLD_SEC, REPS_TABLE, TECHNICAL_CAP_FICHES, TECHNICAL_MAX_REPS, TRACTION_FICHES,
} from '../../src/generator/config';
import { buildCtx } from '../../src/generator/context';
import { buildExercise } from '../../src/generator/dose';
import { classAllowed, variantClass } from '../../src/generator/reps';
import { allowedVariants, type Candidate } from '../../src/generator/safety';
import { sessionVol, weekCapsOk } from '../../src/generator/plaf';
import type { Fiche, GenExercise, GenProgram, GeneratorInput, SlotKey } from '../../src/generator/types';
import type { Level } from '../../src/data/model';
import { byId, FICHES, mk, type MkOpts } from './generator-helpers';

const cand = (fiche: Fiche, variant: Fiche['variantes'][number]): Candidate => ({
  fiche, variant, origin: fiche, adapted: false, capped: false, adaptations: [], notes: [], replaces: null,
});
const GOALS = ['muscle', 'force', 'sante', 'perte_gras', 'sport', 'endurance'];
const LEVELS: Level[] = ['debutant', 'intermediaire', 'avance'];
const SLOTS: SlotKey[] = ['jambes_genou', 'poussee_1', 'tirage_1', 'jambes_2', 'iso_biceps'];
const ctxOf = (goal: string, level: Level, o: MkOpts = {}) => buildCtx(mk({ goal, level, profile: 'F', place: 'salle', ...o }));
const allEx = (p: GenProgram): GenExercise[] => p.sessions.flatMap((s) => s.exercises.flatMap((e) => (e.alt ? [e, e.alt] : [e])));
const gen = (i: GeneratorInput): GenProgram => {
  const r = generateProgram(i);
  if (!r.ok) throw new Error(`programme refusé : ${r.code}`);
  return r.program;
};
/** Toutes les doses (fiche x variante x objectif x niveau x emplacement), hors doses fixes. */
function* doses(filter: (f: Fiche) => boolean, levels: Level[] = LEVELS, o: MkOpts = {}) {
  const ctxs = new Map(GOALS.flatMap((g) => levels.map((l) => [`${g}|${l}`, ctxOf(g, l, o)] as const)));
  for (const f of FICHES.filter(filter))
    for (const v of f.variantes)
      for (const [k, ctx] of ctxs)
        for (const slot of SLOTS) yield { f, v, k, ctx, e: buildExercise(cand(f, v), slot, 'a', ctx) };
}

describe('R-REPS : limites de fiche et protections existantes', () => {
  it('aucune dose ne descend sous DOSE_LIMITS (réserve minimale, séries au plus, jamais de dose lourde)', () => {
    let n = 0;
    for (const { f, v, k, e } of doses((f) => !!DOSE_LIMITS[f.id] || f.variantes.some((v) => !!DOSE_LIMITS[v.id]))) {
      const lim = { ...DOSE_LIMITS[f.id], ...DOSE_LIMITS[v.id] };
      n++;
      if (lim.minRir !== undefined && e.rirAsked) expect(e.rirTarget, `${v.id} ${k}`).toBeGreaterThanOrEqual(lim.minRir);
      if (lim.maxSets !== undefined) expect(e.sets, `${v.id} ${k}`).toBeLessThanOrEqual(lim.maxSets);
      if (lim.noHeavyReps) expect(e.repsMin, `${v.id} ${k}`).toBeGreaterThan(6);
    }
    expect(n).toBeGreaterThan(1000);
  });
  it('réserve jamais 0, au plus 3 séries de départ, jamais au-delà de la classe D1-D4', () => {
    for (const { v, k, e } of doses((f) => !FIXED_DOSE[f.id], ['intermediaire', 'avance'])) {
      expect(e.rirTarget, `${v.id} ${k}`).toBeGreaterThanOrEqual(1);
      expect(e.sets, `${v.id} ${k}`).toBeLessThanOrEqual(3);
      if (e.setsCap !== undefined) expect(e.sets).toBeLessThanOrEqual(e.setsCap);
    }
  });
  it('réserve 1 seulement sur machine ou poulie (avancé, muscle), jamais au poids du corps, à l\'élastique ni sur une surface instable', () => {
    for (const { v, k, e } of doses(() => true, ['avance']))
      if (e.rirAsked && e.rirTarget === 1) expect(v.tags.some((t) => t === 'machine' || t === 'poulie'), `${v.id} ${k}`).toBe(true);
  });
});

describe('R-REPS : traction (kine, §8.6)', () => {
  it('la traction n\'obtient jamais de réserve 1 : réserve >= 2, 3 séries au plus, 5-10 répétitions', () => {
    let n = 0;
    for (const { v, k, e } of doses((f) => TRACTION_FICHES.includes(f.id))) {
      n++;
      expect(e.rirTarget, `${v.id} ${k}`).toBeGreaterThanOrEqual(2);
      expect(e.sets).toBeLessThanOrEqual(3);
      expect(e.setsCap).toBeLessThanOrEqual(3);
      expect(e.repsMin).toBeGreaterThanOrEqual(5);
      expect(e.repsMax).toBeLessThanOrEqual(10);
    }
    expect(n).toBeGreaterThan(100);
  });
  it('programmes avancés en salle (V-VOL compris) : traction en réserve >= 2 et 3 séries au plus', () => {
    let n = 0;
    for (const goal of ['muscle', 'force', 'perte_gras'])
      for (const days of [3, 5]) {
        for (const e of allEx(gen(mk({ goal, level: 'avance', days, profile: 'F', place: 'salle', dur: null }))).filter((x) => TRACTION_FICHES.includes(x.ficheId))) {
          n++;
          expect(e.rirTarget).toBeGreaterThanOrEqual(2);
          expect(e.sets).toBeLessThanOrEqual(3);
        }
      }
    expect(n).toBeGreaterThan(0);
  });
});

describe('R-REPS : classes D3 / D4 et liste D4_NEVER', () => {
  const nordique = byId('nordique-ischios');
  const ancrage = { extraTags: ['partenaire_ou_ancrage'] };
  it('classes : pompe au mur D1, pompe sur genoux D2, pompe au sol D3, nordique et pompe en équilibre D4, variante chargée sans classe', () => {
    const p = byId('pompe');
    expect(variantClass(p, p.variantes.find((v) => v.id === 'pompe-mur')!)).toBe(1);
    expect(variantClass(p, p.variantes.find((v) => v.id === 'pompe-genoux')!)).toBe(2);
    expect(variantClass(p, p.variantes.find((v) => v.id === 'pompe-sol')!)).toBe(3);
    for (const v of nordique.variantes) expect(variantClass(nordique, v)).toBe(4);
    const sq = byId('squat-arriere-barre');
    expect(variantClass(sq, sq.variantes[0])).toBeNull();
  });
  it('le D4 n\'est jamais proposé hors avancé, ni en grossesse / post-partum, ni avec une zone sensible concernée', () => {
    for (const f of FICHES)
      for (const v of f.variantes) {
        if (variantClass(f, v) !== 4) continue;
        for (const level of ['debutant', 'intermediaire'] as Level[]) expect(classAllowed(f, v, ctxOf('muscle', level)), v.id).toBe(false);
        expect(classAllowed(f, v, ctxOf('muscle', 'avance', { preg: 'enceinte' })), v.id).toBe(false);
        expect(classAllowed(f, v, ctxOf('muscle', 'avance', { preg: 'post_partum' })), v.id).toBe(false);
        for (const z of D4_FICHES[f.id] ?? []) expect(classAllowed(f, v, ctxOf('muscle', 'avance', { injuries: [[z as never, 1]] })), `${v.id} ${z}`).toBe(false);
      }
    // [kine 05/11/2026] Garde-fou : sans « 2 séances au haut du D3 voisin » (options.d4Open), aucune D4, même à l'avancé.
    expect(allowedVariants(nordique, ctxOf('muscle', 'avance', ancrage))).toEqual([]);
    const opened = (level: Level) => buildCtx({ ...mk({ goal: 'muscle', level, profile: 'F', place: 'salle', ...ancrage }), options: { d4Open: ['nordique-ischios-court'] } });
    expect(allowedVariants(nordique, opened('avance')).map((v) => v.id)).toEqual(['nordique-ischios-court']);
    expect(allowedVariants(nordique, opened('intermediaire'))).toEqual([]);
  });
  it('programmes (intermédiaire, grossesse, post-partum) : aucune variante D4 placée ; avancé : D4 en 2 séries au plus, réserve 3, 2-5', () => {
    const ins: MkOpts[] = [
      ...['A0', 'E', 'F'].flatMap((profile) => GOALS.map((goal) => ({ goal, level: 'intermediaire' as Level, profile, ...ancrage }))),
      { level: 'avance', preg: 'enceinte', profile: 'E', ...ancrage }, { level: 'avance', preg: 'post_partum', profile: 'F', ...ancrage },
    ];
    for (const o of ins) for (const e of allEx(gen(mk(o)))) expect(variantClass(byId(e.ficheId), byId(e.ficheId).variantes.find((v) => v.id === e.variantId)!), `${e.variantId}`).not.toBe(4);
    let n = 0;
    const d4Open = ['nordique-ischios-court', 'pompe-equilibre-mur-pieds'];
    for (const profile of ['A0', 'E', 'F'])
      for (const e of allEx(gen({ ...mk({ goal: 'muscle', level: 'avance', profile, days: 3, dur: null, ...ancrage }), options: { d4Open } }))) {
        const f = byId(e.ficheId);
        if (variantClass(f, f.variantes.find((v) => v.id === e.variantId)!) !== 4) continue;
        n++;
        expect(e.sets).toBeLessThanOrEqual(2);
        expect(e.rirTarget).toBeGreaterThanOrEqual(3);
        expect([e.repsMin, e.repsMax]).toEqual([2, 5]);
      }
    // Avec le garde-fou ouvert (d4Open), les D4 placées gardent leur dose D4.
    expect(n).toBeGreaterThan(0);
  });
  it('pompe à un bras : jamais sans le garde-fou ; ouverte, 4-8 par côté, 2 séries, réserve 3 ; traction à un bras : ouverte par le garde-fou', () => {
    expect(D4_NEVER).toEqual([]);
    expect(allowedVariants(byId('pompe-un-bras'), ctxOf('muscle', 'avance'))).toEqual([]);
    const f = byId('pompe-un-bras');
    const ctx = buildCtx({ ...mk({ goal: 'muscle', level: 'avance', profile: 'F', place: 'salle' }), options: { d4Open: ['pompe-un-bras-chaise'] } });
    const c = allowedVariants(f, ctx);
    expect(c.map((x) => x.id)).toEqual(['pompe-un-bras-chaise']);
    const e = buildExercise(cand(f, c[0]), 'poussee_2', 'a', ctx);
    expect([e.repsMin, e.repsMax]).toEqual([4, 8]);
    expect(e.unilateral).toBe(true); // par côté (perSide à la conversion du programme)
    expect(e.sets).toBeLessThanOrEqual(2);
    expect(e.rirTarget).toBeGreaterThanOrEqual(3);
    // gêne déclarée au poignet : fermée même ouverte par l'historique
    const wrist = buildCtx({ ...mk({ goal: 'muscle', level: 'avance', profile: 'F', place: 'salle', injuries: [['poignet' as never, 1]] }), options: { d4Open: ['pompe-un-bras-chaise'] } });
    expect(allowedVariants(f, wrist)).toEqual([]);
    for (const profile of ['A0', 'C', 'E', 'F'])
      for (const goal of ['muscle', 'force', 'sport'])
        for (const days of [2, 3, 5]) {
          const ids = allEx(gen(mk({ goal, level: 'avance', profile, days, dur: null, place: profile === 'F' ? 'salle' : 'maison' }))).map((e) => e.ficheId);
          expect(ids.filter((id) => D4_NEVER.includes(id))).toEqual([]);
        }
  });
  it('D3 du débutant : jamais à la première séance de l\'exercice ; ensuite 2 séries, réserve 3, 6-10', () => {
    const p = byId('pompe');
    const sol = p.variantes.find((v) => v.id === 'pompe-sol')!;
    expect(classAllowed(p, sol, ctxOf('muscle', 'debutant', { profile: 'A0' }))).toBe(false);
    const hist = { history: [{ variantId: 'pompe-genoux', loadKg: null, completedAt: '2026-11-01T10:00:00Z', pain: false }] };
    const ctx = ctxOf('muscle', 'debutant', { profile: 'A0', ...hist });
    expect(classAllowed(p, sol, ctx)).toBe(true);
    const e = buildExercise(cand(p, sol), 'poussee_1', 'a', ctx);
    expect([e.sets, e.rirTarget, e.repsMin, e.repsMax]).toEqual([2, 3, 6, 10]);
  });
});

describe('R-REPS : débutant, technique, unilatéral, douleur, grossesse', () => {
  it('débutant (force, sport, tous objectifs) : jamais de série <= 5 répétitions (hors doses fixes des fiches)', () => {
    for (const { v, k, e } of doses((f) => !FIXED_DOSE[f.id], ['debutant'])) if (e.unit !== 'sec') expect(e.repsMin, `${v.id} ${k}`).toBeGreaterThanOrEqual(6);
    for (const goal of ['force', 'sport', 'muscle'])
      for (const profile of ['A0', 'C', 'F'])
        for (const e of allEx(gen(mk({ goal, level: 'debutant', profile, place: profile === 'F' ? 'salle' : 'maison' }))))
          if (e.unit !== 'sec' && e.role !== 'cardio' && !FIXED_DOSE[e.ficheId]) expect(e.repsMin, e.variantId).toBeGreaterThanOrEqual(6);
  });
  it('mouvements techniques à barre : au plus 12 répétitions, même en endurance ou en santé', () => {
    let n = 0;
    for (const { v, k, e } of doses((f) => TECHNICAL_CAP_FICHES.includes(f.id))) {
      n++;
      expect(e.repsMax, `${v.id} ${k}`).toBeLessThanOrEqual(TECHNICAL_MAX_REPS);
    }
    expect(n).toBeGreaterThan(100);
  });
  it('force avancée : un pilier chargé à la barre descend à 3-5, mais jamais le soulevé de terre (fiche technique : >= 6)', () => {
    const ctx = ctxOf('force', 'avance');
    const sq = byId('squat-arriere-barre');
    expect([buildExercise(cand(sq, sq.variantes[0]), 'jambes_genou', 'a', ctx).repsMin]).toEqual([3]);
    const sdt = byId('souleve-de-terre-barre');
    expect(buildExercise(cand(sdt, sdt.variantes[0]), 'jambes_genou', 'a', ctx).repsMin).toBeGreaterThanOrEqual(6);
  });
  it('élastique, sac à dos : jamais <= 5 répétitions (charge non réglable finement)', () => {
    for (const { v, k, e } of doses((f) => !FIXED_DOSE[f.id], ['intermediaire', 'avance']))
      if (variantClass({ id: '' }, v) === null && !v.tags.some((t) => ['barre', 'barre_ez', 'disques', 'halteres', 'kettlebell', 'machine', 'poulie'].includes(t)) && e.unit !== 'sec')
        expect(e.repsMin, `${v.id} ${k}`).toBeGreaterThanOrEqual(6);
  });
  it('unilatéral (hors D4) : au moins 6 répétitions par côté ; débutant chargé : au moins 8', () => {
    for (const { f, v, k, e } of doses((f) => !FIXED_DOSE[f.id])) {
      if (!e.unilateral || e.unit === 'sec' || variantClass(f, v) === 4) continue;
      expect(e.repsMin, `${v.id} ${k}`).toBeGreaterThanOrEqual(k.endsWith('debutant') && e.chargeable ? 8 : 6);
    }
  });
  it('douleur déclarée sur une zone de la fiche : aucune fourchette <= 6 répétitions', () => {
    for (const zone of ['epaule', 'genou', 'dos'] as const)
      for (const { v, k, e, f } of doses((f) => !FIXED_DOSE[f.id] && !!f.securite.zones[zone], ['intermediaire', 'avance'], { injuries: [[zone, 1]] }))
        if (e.unit !== 'sec' && variantClass(f, v) !== 4) expect(e.repsMin, `${v.id} ${k} ${zone}`).toBeGreaterThan(6);
  });
  it('grossesse / post-partum : gainage et portés à 20 s au plus, aucune variante D3 ni D4, réserve >= 3', () => {
    for (const preg of ['enceinte', 'post_partum'] as const)
      for (const level of LEVELS)
        for (const profile of ['A0', 'E', 'F']) {
          for (const e of allEx(gen(mk({ preg, level, profile, goal: 'muscle' })))) {
            if (e.unit === 'sec' && e.holdSec !== null && e.role !== 'cardio') expect(e.holdSec).toBeLessThanOrEqual(PREGNANCY_MAX_HOLD_SEC);
            const f = byId(e.ficheId);
            const k = variantClass(f, f.variantes.find((v) => v.id === e.variantId)!);
            expect(k === 3 || k === 4, e.variantId).toBe(false);
            if (e.rirAsked) expect(e.rirTarget).toBeGreaterThanOrEqual(3);
          }
        }
  });
});

describe('R-REPS : les 6 programmes d\'exemple ne sont plus « 10-15 partout » (docs/programmes-exemples.md)', () => {
  const eq = (tags: string[]) => ({ preset: 'perso' as const, tags, disabledImplicit: [], dumbbellWeightsKg: [2, 4, 6, 8, 10, 12, 14], kettlebellWeightsKg: [8, 12] });
  const salle = { preset: 'F' as const, tags: [], disabledImplicit: [], dumbbellWeightsKg: [], kettlebellWeightsKg: [] };
  const HE = ['halteres', 'elastique', 'chaise', 'poids_du_corps', 'tapis'];
  const E = ['elastique', 'chaise', 'poids_du_corps', 'tapis'];
  const input = (profile: Record<string, unknown>, equipment: GeneratorInput['equipment'], goals: string[]): GeneratorInput => ({
    profile: { blockedWeekdays: [], place: 'maison', sessionDurationMin: 45, sports: [], pregnancy: null, ...profile } as GeneratorInput['profile'],
    equipment, goals: goals.map((g, i) => ({ goalKey: g, rank: i + 1 })), injuries: [], fiches: FICHES, options: { gagnerDuTemps: true },
  });
  const PROFILS = [
    input({ level: 'debutant', daysPerWeek: 3 }, eq(HE), ['muscle']),
    input({ level: 'intermediaire', daysPerWeek: 4, sessionDurationMin: 60, place: 'salle', salleAccess: true }, salle, ['force']),
    input({ level: 'intermediaire', daysPerWeek: 3 }, eq(HE), ['perte_gras', 'cardio']),
    input({ level: 'intermediaire', daysPerWeek: 3, sports: ['volley'] }, eq(E), ['sport']),
    input({ level: 'debutant', daysPerWeek: 3 }, eq(['poids_du_corps', 'tapis']), ['muscle']),
    input({ level: 'avance', daysPerWeek: 5, sessionDurationMin: 75, place: 'salle', salleAccess: true }, salle, ['muscle']),
  ];
  // Perte de gras (profil 3) : la ligne accessoire / isolation « PG » est en 10-15 par construction (§3), d'où la moitié et non moins.
  it('au plus la moitié des exercices en 10-15 par profil, 15 % au total (avant : volley 20 sur 23, sans matériel 18 sur 21)', () => {
    let tot = 0;
    let n1015 = 0;
    for (const [i, inp] of PROFILS.entries()) {
      const ex = gen(inp).sessions.flatMap((s) => s.exercises).filter((e) => e.unit !== 'sec' && e.role !== 'cardio');
      const c = ex.filter((e) => e.repsMin === 10 && e.repsMax === 15).length;
      expect(c, `profil ${i + 1} : ${c} / ${ex.length}`).toBeLessThanOrEqual(ex.length / 2);
      tot += ex.length;
      n1015 += c;
    }
    expect(n1015).toBeLessThanOrEqual(tot * 0.15);
  });
});

describe('Contrôle relecteur et avis kiné du 05/11/2026', () => {
  it('isolation par préfixe : aucune fiche composée ne correspond par accident (liste relue, une ou deux muscles principaux)', () => {
    // Toute nouvelle fiche qui tombe sous un préfixe fait échouer ce test : elle doit être relue puis ajoutée ici.
    const REVUES = [
      'curl-barre', 'curl-elastique', 'curl-halteres', 'curl-incline-halteres', 'curl-ischios-ballon', 'curl-ischios-serviette', 'ecarte-couche-halteres',
      'ecartement-elastique', 'ecartement-serviette', 'elevation-laterale', 'elevation-laterale-assis-halteres', 'extension-triceps-assis-halteres',
      'extension-triceps-barre-ez-allonge', 'extension-triceps-couche-halteres', 'oiseau-banc-incline', 'oiseau-halteres', 'oiseau-machine-poulie',
      'oiseau-un-bras-appuye', 'releve-mollets', 'releve-mollets-assis', 'releve-mollets-debout-barre', 'releve-mollets-halteres', 'releve-mollets-machine',
      'rotation-externe-epaule', 'rotation-externe-poulie', 'shrug-barre', 'tirage-bras-tendus-elastique', 'tirage-visage-sangles', 'tirage-w-allonge',
    ];
    const hits = FICHES.filter((f) => ISOLATION_FICHE_PREFIXES.some((p) => f.id.startsWith(p)));
    expect(hits.map((f) => f.id).sort()).toEqual([...REVUES].sort());
    for (const f of hits) {
      expect(f.musclesPrincipaux.length, f.id).toBeLessThanOrEqual(2);
      expect(['squat', 'fente'].includes(f.schema), f.id).toBe(false);
    }
  });
  it('repos : bas de la fourchette, sauf pilier dont le haut des répétitions est <= 6 (milieu ou plus)', () => {
    const heavy: [string, Level, number][] = [];
    for (const [goal, rows] of Object.entries(REPS_TABLE.pilier_lourd))
      for (const lvl of LEVELS) if (rows![lvl].reps[1] <= 6) heavy.push([goal, lvl, rows![lvl].restSec]);
    // force intermédiaire 4-6 (180, valeur unique), force avancé 3-5 (210 = milieu de 180-240), sport avancé 3-6 (165 = milieu de 150-180)
    expect(heavy).toEqual([['force', 'intermediaire', 180], ['force', 'avance', 210], ['sport', 'avance', 165]]);
    // sport intermédiaire : 6-10 PROVISOIRE, réserve 3 ; endurance intermédiaire : réserve 3
    expect(REPS_TABLE.pilier_lourd.sport!.intermediaire).toMatchObject({ reps: [6, 10], rir: 3, restSec: 120 });
    for (const role of ['pilier_lourd', 'accessoire', 'isolation'] as const)
      for (const g of ['sport', 'endurance'] as const) expect(REPS_TABLE[role][g]!.intermediaire.rir, `${role} ${g}`).toBe(3);
  });
  it('programme final : un pilier chargé n\'a jamais plus de 3 séries ; épaules (trois chefs ensemble) <= 20 par semaine', () => {
    for (const level of LEVELS)
      for (const goal of GOALS)
        for (const profile of ['A0', 'F']) {
          const p = gen(mk({ goal, level, profile, days: 5, dur: null, place: profile === 'F' ? 'salle' : 'maison' }));
          for (const e of p.sessions.flatMap((s) => s.exercises))
            if (['jambes_genou', 'poussee_1', 'tirage_1', 'charniere'].includes(e.slot) && variantClass(byId(e.ficheId), byId(e.ficheId).variantes.find((v) => v.id === e.variantId)!) === null)
              expect(e.sets, `${level} ${goal} ${e.ficheId}`).toBeLessThanOrEqual(3);
          expect(p.sessions.reduce((a, s) => a + sessionVol(s, 'deltoides'), 0), `${level} ${goal} ${profile}`).toBeLessThanOrEqual(20);
          expect(weekCapsOk(p.sessions)).toBe(true);
        }
  });
});
