// D33 (knowledge/programmes-v3.md, avis du kiné) : plafond 12 avec G1 à G4 (§5), cardio par défaut en perte de gras (§6),
// filtre « salle » (§8), bug d'isolation des deltoïdes latéraux (PV3-ISO-3). Profils nommés comme dans tools/demo-programmes.mjs.
import { describe, expect, it } from 'vitest';
import { generateProgram, type GenProgram, type GeneratorInput } from '../../src/generator';
import { ISOLATION, SALLE_EXCLUS, SALLE_HOME_SUFFIX, SALLE_PENURIE_READMIS, VOLUME } from '../../src/generator/config';
import { buildCtx } from '../../src/generator/context';
import { isoFicheFits } from '../../src/generator/isolation';
import { basePlaf, frac, hingesOk, makePlaf, sessionVol } from '../../src/generator/plaf';
import { allowedVariants, sallePenurie } from '../../src/generator/safety';
import type { Fiche, GenExercise } from '../../src/generator/types';
import { FICHES, byId, mk, msgIds, type MkOpts } from './generator-helpers';

const prog = (i: GeneratorInput): GenProgram => {
  const r = generateProgram(i);
  if (!r.ok) throw new Error(`pas de programme : ${r.code}`);
  return r.program;
};
const salle = (o: MkOpts = {}) => mk({ profile: 'F', place: 'salle', ...o });
const withProfile = (i: GeneratorInput, p: Partial<GeneratorInput['profile']>): GeneratorInput => ({ ...i, profile: { ...i.profile, ...p } });

// Profils de la démo (docs/programmes-exemples.md) et de T-D33-xx.
const P1 = () => mk({ profile: 'B', level: 'debutant', days: 3, goal: 'muscle' });
const P2 = () => salle({ level: 'intermediaire', days: 4, dur: 60, goal: 'force' });
const P5 = () => mk({ profile: 'A0', level: 'debutant', days: 3, goal: 'muscle' });
const P6 = () => salle({ level: 'avance', days: 5, dur: 75, goal: 'muscle' });
const P7 = () => mk({ profile: 'C', level: 'intermediaire', days: 4, goal: 'perte_gras' });
const P8 = () => mk({ profile: 'C', level: 'avance', days: 3, goal: 'perte_gras' });
const P9 = () => mk({ profile: 'C', level: 'debutant', days: 3, goal: 'perte_gras' });

const muscleKeys = (p: GenProgram) => [...new Set(p.sessions.flatMap((s) => s.exercises.flatMap((e) => [...e.musclesPrincipaux, ...e.musclesSecondaires])))];

describe('D33 §5 : plafond de séries par muscle et par séance (PV3-PLAF-1, G1 à G4)', () => {
  it('base : débutant, santé, grossesse, reprise, semaine allégée = 10 ; intermédiaire / avancé : 12 par emplacement, 11 par ajout automatique', () => {
    const c = buildCtx(P2());
    expect(basePlaf(c, 'slot')).toBe(12);
    expect(basePlaf(c, 'auto')).toBe(11);
    expect(basePlaf(buildCtx(P6()), 'slot')).toBe(12);
    expect(basePlaf(buildCtx(P1()), 'slot')).toBe(10);
    expect(basePlaf(buildCtx(salle({ goal: 'sante' })), 'slot')).toBe(10);
    expect(basePlaf(buildCtx(salle({ preg: 'enceinte' })), 'slot')).toBe(10);
    expect(basePlaf(buildCtx(salle({ options: { repriseActive: true } })), 'slot')).toBe(10);
    expect(basePlaf({ ...c, lightWeek: true }, 'slot')).toBe(10);
  });

  it('G1 : muscle principal d\'une fiche qui porte une ligne de zone au niveau >= 1 : 10', () => {
    const c = buildCtx(salle({ injuries: [['dos', 1]] }));
    const f = FICHES.find((x) => x.schema === 'charniere' && 'dos' in x.securite.zones)!;
    const ex = { sets: 3, musclesPrincipaux: f.musclesPrincipaux, musclesSecondaires: [], schema: f.schema, slot: 'charniere', ficheId: f.id, tags: [] } as unknown as GenExercise;
    expect(makePlaf(c, 'slot').cap([ex], f.musclesPrincipaux[0])).toBe(10);
    expect(makePlaf(buildCtx(salle()), 'slot').cap([ex], f.musclesPrincipaux[0])).toBe(12);
  });

  it('G3 : au plus 2 charnières, la seconde sans charge', () => {
    const h = (slot: string, tags: string[]) => ({ sets: 3, musclesPrincipaux: ['ischios'], musclesSecondaires: [], schema: 'charniere', slot, ficheId: 'x', tags }) as unknown as GenExercise;
    expect(hingesOk([h('charniere', ['barre']), h('jambes_3', ['tapis'])])).toBe(true);
    expect(hingesOk([h('charniere', ['barre']), h('jambes_3', ['halteres'])])).toBe(false);
    expect(hingesOk([h('charniere', ['tapis']), h('jambes_3', ['tapis']), h('jambes_4', ['tapis'])])).toBe(false);
  });

  it('T-D33-21 : P2 et P6 <= 12 par muscle et par séance ; P1, P5 (débutants) <= 10 ; aucun total hebdomadaire > 20 ; <= 2 charnières', () => {
    for (const [i, cap] of [[P2(), 12], [P6(), 12], [P1(), 10], [P5(), 10]] as const) {
      const p = prog(i);
      for (const m of muscleKeys(p)) {
        for (const s of p.sessions) expect(sessionVol(s, m)).toBeLessThanOrEqual(cap);
        expect(p.sessions.reduce((a, s) => a + sessionVol(s, m), 0)).toBeLessThanOrEqual(VOLUME.maxPerMuscleWeek);
      }
      for (const s of p.sessions) expect(hingesOk(s.exercises)).toBe(true);
    }
  });

  it('G1 en programme : zone dos niveau 1, aucun muscle principal d\'une fiche « dos » au-dessus de 10 dans une séance', () => {
    const i = salle({ level: 'avance', days: 5, dur: 75, goal: 'muscle', injuries: [['dos', 1]] });
    const p = prog(i);
    for (const s of p.sessions) {
      for (const m of muscleKeys(p)) {
        const sensitive = s.exercises.some((e) => frac(e, m) === 1 && 'dos' in (byId(e.ficheId)?.securite.zones ?? {}));
        if (sensitive) expect(sessionVol(s, m)).toBeLessThanOrEqual(10);
      }
    }
  });

  // T-D33-21 cite 18 (valeur de la fiche-type) ; la règle est le plafond hebdomadaire de 20 (PV3-PLAF-1) : fiches réelles, fessiers 19,5
  // en prise de muscle à 4 jours en salle (docs/D33-bilan.md).
  it('PV3-PLAF-2 / T-D33-21 : 4 jours : ischios et fessiers <= 20 par semaine (2e charnière seulement si le total hebdomadaire le permet)', () => {
    for (const i of [P2(), salle({ level: 'intermediaire', days: 4, dur: 60, goal: 'muscle' }), mk({ days: 4 })]) {
      const p = prog(i);
      for (const m of ['ischios', 'fessiers']) expect(p.sessions.reduce((a, s) => a + sessionVol(s, m), 0)).toBeLessThanOrEqual(VOLUME.maxPerMuscleWeek);
    }
  });

  it('T-D33-22 : P6, PULL à 4 tirages au plus, dos <= 20 par semaine', () => {
    const p = prog(P6());
    const back = p.sessions.reduce((a, s) => a + sessionVol(s, 'grand_dorsal'), 0);
    expect(back).toBeLessThanOrEqual(VOLUME.maxPerMuscleWeek);
    for (const s of p.sessions.filter((x) => x.label.startsWith('PULL'))) expect(s.exercises.filter((e) => e.slot.startsWith('tirage')).length).toBeLessThanOrEqual(4);
  });

  it('G2 : le 12e jamais par un ajout automatique (isolation : un muscle d\'isolation reste <= 11)', () => {
    const p = prog(P6());
    for (const s of p.sessions) {
      const isoMuscles = s.exercises.filter((e) => e.slot.startsWith('iso_')).flatMap((e) => e.musclesPrincipaux);
      for (const m of isoMuscles) expect(sessionVol(s, m)).toBeLessThanOrEqual(VOLUME.maxPerMuscleSessionAuto);
    }
  });
});

describe('D33 §6 : cardio par défaut en perte de gras (PV3-CAR-1 à 3, T-D33-23)', () => {
  const ded = (p: GenProgram) => (p.cardioSessions ?? []).filter((c) => c.kind === 'option');
  const forceDays = (p: GenProgram) => p.sessions.map((s) => s.weekday);
  it('P7 (intermédiaire, 4 jours) : 1 ; P8 (avancé, 3 jours) : 2 non consécutives ; P9 (débutant, 3 jours) : 1', () => {
    for (const [i, n] of [[P7(), 1], [P8(), 2], [P9(), 1]] as const) {
      const p = prog(i);
      const d = ded(p);
      expect(d).toHaveLength(n);
      expect(p.cardioOption?.accepted).toBe(true);
      expect(msgIds(p)).toContain('V-MSG-CARDIO-DEFAUT');
      for (const c of d) {
        expect(forceDays(p)).not.toContain(c.weekday); // jamais un jour de force (donc jamais un jour de jambes lourdes)
        expect(c.jumps ?? null).toBeNull(); // aucun saut automatique
        expect(c.cardio.variantId).not.toMatch(/course|saut/); // aucune course automatique
        expect(c.cardio.intensity === 'moderee' || c.cardio.intensity === 'facile').toBe(true);
      }
      expect(new Set([...forceDays(p), ...d.map((c) => c.weekday)]).size).toBeLessThanOrEqual(6);
      if (d.length === 2) {
        const gap = Math.abs(d[0].weekday - d[1].weekday);
        expect(Math.min(gap, 7 - gap)).toBeGreaterThan(1);
      }
    }
  });
  it('retirable : seanceCardio false -> 0 séance, réglage conservé (offerte, non acceptée)', () => {
    const p = prog({ ...P7(), options: { seanceCardio: false } });
    expect(ded(p)).toHaveLength(0);
    expect(p.cardioOption).toMatchObject({ offered: true, accepted: false });
    expect(msgIds(p)).not.toContain('V-MSG-CARDIO-DEFAUT');
  });
  it('N = 6 : aucune séance dédiée ; N = 2 : aucune (blocs) ; force et prise de muscle : option décochée par défaut', () => {
    expect(ded(prog(mk({ profile: 'C', level: 'avance', days: 6, goal: 'perte_gras' })))).toHaveLength(0);
    expect(ded(prog(mk({ profile: 'C', level: 'intermediaire', days: 2, goal: 'perte_gras' })))).toHaveLength(0);
    for (const goal of ['force', 'muscle']) expect(ded(prog(mk({ profile: 'C', level: 'intermediaire', days: 3, goal })))).toHaveLength(0);
  });
  it('avancé à 5 jours : 1 ; grossesse : 1 séance de 20 min au plus', () => {
    expect(ded(prog(mk({ profile: 'C', level: 'avance', days: 5, goal: 'perte_gras' })))).toHaveLength(1);
    const g = ded(prog(mk({ profile: 'C', level: 'avance', days: 3, goal: 'perte_gras', preg: 'enceinte' })));
    expect(g.length).toBeLessThanOrEqual(1);
    for (const c of g) expect(Math.max(...c.cardio.weekMin)).toBeLessThanOrEqual(20);
  });
});

describe('D33 §8 : filtre « salle » (PV3-SALLE-1, T-D33-26a à d)', () => {
  const excluded = (e: GenExercise) => e.tags.filter((t) => SALLE_EXCLUS.includes(t));
  const access = (i: GeneratorInput) => withProfile(i, { salleAccess: true });
  const tirageV = (p: GenProgram) => p.sessions.flatMap((s) => s.exercises).filter((e) => e.schema === 'tirage_v');
  it('26a : P2 et P6 avec « j\'ai accès à une salle » : aucune variante exclue hors pénurie (élastique / mini-bande, « (à la maison) »)', () => {
    for (const i of [access(P2()), access(P6())]) {
      const p = prog(i);
      for (const e of p.sessions.flatMap((s) => s.exercises)) {
        const ex = excluded(e);
        if (!ex.length) continue;
        expect(ex.every((t) => SALLE_PENURIE_READMIS.includes(t))).toBe(true);
        expect(e.variantNom.endsWith(SALLE_HOME_SUFFIX)).toBe(true);
        expect(p.penurie).toContain(e.schema);
      }
    }
  });
  it('26b : P2 en salle avec barre de traction : tirage vertical = traction-barre', () => {
    const tv = tirageV(prog(access(P2())));
    expect(tv.map((e) => e.ficheId)).toContain('traction-barre');
    for (const e of tv) expect(excluded(e)).toHaveLength(0);
  });
  it('26c : sans barre de traction : jamais une variante à `porte` (kiné) ; un élastique réadmis porte « (à la maison) »', () => {
    const noBar = access(mk({ profile: 'E', place: 'salle', level: 'intermediaire', days: 4, dur: 60, goal: 'force' }));
    noBar.equipment = { ...noBar.equipment, tags: noBar.equipment.tags.filter((t) => t !== 'barre_traction') };
    const p = prog(noBar);
    for (const e of p.sessions.flatMap((s) => s.exercises)) {
      expect(e.tags).not.toContain('porte');
      if (excluded(e).length) expect(e.variantNom.endsWith(SALLE_HOME_SUFFIX)).toBe(true);
    }
  });
  it('26d : sans le réglage (lieu « salle » seul, ou maison) : comportement inchangé ; grossesse : pas de filtre', () => {
    expect(buildCtx(P2()).salleFilter).toBe(false);
    const home = mk({ profile: 'E', level: 'intermediaire', days: 3, goal: 'muscle', dur: 60 });
    const anyExcluded = (p: GenProgram) => p.sessions.flatMap((s) => s.exercises).filter((e) => excluded(e).length && !e.variantNom.endsWith(SALLE_HOME_SUFFIX));
    expect(anyExcluded(prog(home)).length).toBeGreaterThan(0);
    expect(anyExcluded(prog(access(home)))).toHaveLength(0);
    expect(buildCtx(access(salle({ preg: 'enceinte' }))).salleFilter).toBe(false);
  });
  it('pénurie : seuls élastique et mini-bande reviennent, pour le plan en pénurie seulement ; jamais bosu, sac, porte', () => {
    const base = byId('tirage-vertical-elastique-haut');
    const mkF = (id: string, schema: string, tags: string[]): Fiche => ({ ...base, id, schema, variantes: [{ ...base.variantes[0], id: `${id}-v`, tags }] });
    const fiches = [...FICHES, mkF('zz-tv-elastique', 'tirage_v', ['elastique', 'tapis']), mkF('zz-tv-bosu', 'tirage_v', ['bosu']), mkF('zz-ph-elastique', 'poussee_h', ['elastique'])];
    const c = buildCtx(access(salle({ fiches })));
    expect(sallePenurie('tirage_v', c)).toBe(true);
    expect(sallePenurie('poussee_h', c)).toBe(false);
    const ok = (id: string) => allowedVariants(fiches.find((x) => x.id === id)!, c).length > 0;
    expect(ok('zz-tv-elastique')).toBe(true);
    expect(ok('zz-tv-bosu')).toBe(false);
    expect(ok('zz-ph-elastique')).toBe(false);
    expect(ok('tirage-vertical-elastique-haut')).toBe(false); // `porte` (kiné) : jamais réadmis
    // Échauffement / activation : l'élastique reste admis (exception 1).
    expect(allowedVariants(byId('tirage-vertical-elastique-haut'), c, { warmup: true }).length).toBeGreaterThan(0);
  });
});

describe('D33 : isolation, liste fermée (PV3-ISO-6, PV3-ISO-3, T-D33-20)', () => {
  const def = (slot: string) => ISOLATION.slots.find((d) => d.slot === slot)!;
  const iso = (p: GenProgram, slot: string) => p.sessions.flatMap((s) => s.exercises).filter((e) => e.slot === slot);
  const t20 = (tags: string[]) => {
    const i = mk({ profile: 'A0', place: 'salle', level: 'intermediaire', days: 3, dur: 75, goal: 'muscle' });
    i.equipment = { ...i.equipment, tags };
    return prog(i);
  };
  it('critère : jamais un développé ni une pompe ; élévation latérale et curls de la liste admis', () => {
    expect(isoFicheFits(byId('developpe-epaules-assis-dossier-incline'), def('iso_deltoide_lateral'))).toBe(false);
    for (const f of FICHES.filter((x) => x.id.startsWith('developpe-') || x.id.startsWith('pompe-')))
      for (const d of ISOLATION.slots) expect(isoFicheFits(f, d)).toBe(false);
    expect(isoFicheFits(byId('elevation-laterale-assis-halteres'), def('iso_deltoide_lateral'))).toBe(true);
    expect(isoFicheFits(byId('curl-barre'), def('iso_biceps'))).toBe(true);
    expect(isoFicheFits(byId('cheville-elastique'), def('iso_mollets'))).toBe(false);
  });
  it('profil mesuré (salle F, 3 jours, 75 min) : iso_deltoide_lateral = élévation seulement ; aucun poussee_v d\'isolation autre', () => {
    const p = prog(salle({ goal: 'muscle', days: 3, dur: 75 }));
    for (const e of p.sessions.flatMap((s) => s.exercises).filter((x) => x.slot.startsWith('iso_') && x.schema === 'poussee_v'))
      expect(e.ficheId).toBe('elevation-laterale-assis-halteres');
  });
  it('haltères + chaise : élévation ; barre + disques : curl-barre ; haltères + banc incliné sans barre : curl incliné ; haltères seuls : biceps vide', () => {
    for (const e of iso(t20(['halteres']), 'iso_deltoide_lateral')) expect(e.ficheId).toBe('elevation-laterale-assis-halteres');
    for (const e of iso(t20(['halteres', 'barre', 'disques']), 'iso_biceps')) expect(e.ficheId).toBe('curl-barre');
    for (const e of iso(t20(['halteres', 'banc_inclinable', 'banc']), 'iso_biceps')) expect(e.ficheId).toBe('curl-incline-halteres');
    expect(iso(t20(['halteres']), 'iso_biceps')).toHaveLength(0);
    for (const s of t20(['halteres', 'barre', 'disques']).sessions) {
      const ids = s.exercises.map((e) => e.ficheId);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
  it('sans fiche d\'élévation : emplacement vide, jamais un développé', () => {
    const i = salle({ goal: 'muscle', days: 3, dur: 75, fiches: FICHES.filter((f) => !f.id.startsWith('elevation-laterale')) });
    expect(iso(prog(i), 'iso_deltoide_lateral')).toHaveLength(0);
  });
});
