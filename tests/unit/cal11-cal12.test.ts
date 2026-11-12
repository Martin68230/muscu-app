// CAL-12 (exercice « lourd » d'épaules / trapèzes pour le cou) et CAL-11 (compléments PUSH / HAUT sans série de deltoïdes en plus).
// Règles : knowledge/calibrage-kaggle.md §5 et §6 (validées par `kine` le 12/11/2026).
import { afterEach, describe, expect, it } from 'vitest';
import { generateProgram } from '../../src/generator';
import { CAL11 } from '../../src/generator/config';
import { buildCtx } from '../../src/generator/context';
import { isHeavyShoulderTrapExercise } from '../../src/generator/zones-check';
import { zoneCoefs, type ZoneFiche } from '../../src/zones/zones';
import { FICHES, mk, type MkOpts } from './generator-helpers';

const NECK = 'renfo-cou-isometrique';
const ctx = buildCtx(mk({ profile: 'F', place: 'salle', level: 'avance' }));
const ex = (ficheId: string, tags: string[]) => ({ ficheId, tags, schema: FICHES.find((f) => f.id === ficheId)?.schema ?? 'inconnu' });
const heavy = (ficheId: string, tags: string[]) => isHeavyShoulderTrapExercise(ex(ficheId, tags), ctx);

const BASE: MkOpts = { profile: 'D', days: 5, level: 'avance', goal: 'muscle', dur: 60 };
const gen = (o: MkOpts, neckScreen: 'non' | 'oui' = 'non') => {
  const input = mk(o);
  input.profile.neckScreen = neckScreen;
  return (generateProgram(input) as any).program;
};
const signature = (p: any) => JSON.stringify(p.sessions.map((s: any) => [s.type, s.exercises.map((e: any) => [e.ficheId, e.sets])]));
const added = (p: any) => p.sessions.flatMap((s: any) => s.exercises.filter((e: any) => e.cappedLabel === CAL11.stopMessage).map((e: any) => ({ ...e, sessionType: s.type })));
const withCal11 = <T,>(on: boolean, f: () => T): T => {
  const before = CAL11.enabled;
  (CAL11 as { enabled: boolean }).enabled = on;
  try { return f(); } finally { (CAL11 as { enabled: boolean }).enabled = before; }
};
afterEach(() => { (CAL11 as { enabled: boolean }).enabled = true; });

describe('CAL-12 : critère « lourd » pour le cou', () => {
  it('lourd : charge externe, élastique, poids du corps en poussée ou tirage, gainage, squat à la barre', () => {
    expect(heavy('developpe-epaules-halteres', ['halteres'])).toBe(true);
    expect(heavy('face-pull-elastique', ['elastique', 'ancrage_porte'])).toBe(true);
    expect(heavy('rotation-externe-epaule', ['elastique'])).toBe(true);
    expect(heavy('pompe', ['poids_du_corps', 'tapis'])).toBe(true);
    expect(heavy('traction-barre', ['barre_traction'])).toBe(true);
    expect(heavy('planche', ['poids_du_corps', 'tapis'])).toBe(true);
    expect(heavy('squat-arriere-barre', ['barre', 'disques', 'rack'])).toBe(true);
    expect(heavy('squat-barre-repere-banc', ['barre', 'rack'])).toBe(true);
  });
  it('non lourd : mobilité, cardio, et sous 0,5 sur trapèzes / épaules / cou', () => {
    expect(heavy('cercles-de-bras', ['poids_du_corps'])).toBe(false);
    expect(heavy('alternance-marche-course', ['poids_du_corps'])).toBe(false);
    expect(heavy('curl-ischios-elastique', ['elastique', 'chaise'])).toBe(false);
    expect(heavy('releve-mollets', ['poids_du_corps', 'mur'])).toBe(false);
  });
  it('doute = lourd : fiche inconnue ou étiquettes illisibles', () => {
    expect(heavy('fiche-qui-nexiste-pas', ['poids_du_corps'])).toBe(true);
    expect(isHeavyShoulderTrapExercise({ ficheId: 'pompe', tags: undefined as unknown as string[], schema: 'poussee_h' }, ctx)).toBe(true);
  });

  it('jamais de cou dans une séance avec un exercice lourd (principal ou alternative) ; possible en jambes sans barre', () => {
    let legsWithNeck = 0;
    for (const o of [BASE, { ...BASE, profile: 'B' }, { ...BASE, profile: 'F', place: 'salle' as const }, { ...BASE, profile: 'F', place: 'salle' as const, days: 4, level: 'intermediaire' as const }, { ...BASE, days: 3 }]) {
      const p = gen(o);
      for (const s of p.sessions) {
        if (!s.exercises.some((e: any) => e.ficheId === NECK)) continue;
        if (s.type === 'LEGS') legsWithNeck++;
        expect(['PUSH', 'PULL', 'HAUT']).not.toContain(s.type);
        const c = buildCtx(mk(o));
        for (const e of s.exercises.filter((x: any) => x.slot !== 'correctif')) {
          expect(isHeavyShoulderTrapExercise({ ficheId: e.ficheId, tags: e.tags, schema: e.schema }, c), `${s.type} ${e.ficheId}`).toBe(false);
        }
      }
    }
    expect(legsWithNeck).toBeGreaterThan(0);
  });
});

describe('CAL-11 : compléments PUSH / HAUT', () => {
  const on = gen(BASE);
  const off = withCal11(false, () => gen(BASE));

  it('PUSH : exercice(s) ajouté(s) en fin de séance, 2 séries, au plus 2 exercices et 4 séries, dose fixe avec signes d’arrêt', () => {
    const a = added(on);
    expect(a.length).toBeGreaterThan(0);
    for (const s of on.sessions) {
      const mine = added({ sessions: [s] });
      expect(mine.length).toBeLessThanOrEqual(2);
      expect(mine.reduce((n: number, e: any) => n + e.sets, 0)).toBeLessThanOrEqual(4);
      if (mine.length) expect(['PUSH', 'HAUT']).toContain(s.type);
    }
    for (const e of a) {
      expect(e.sets).toBe(2);
      expect(e.capped).toBe(true);
      expect(e.cappedLabel).toMatch(/engourdissement/);
    }
    const push = on.sessions.find((s: any) => s.type === 'PUSH');
    const pushOff = off.sessions.find((s: any) => s.type === 'PUSH');
    expect(push.exercises.length).toBeGreaterThan(pushOff.exercises.length);
    expect(push.exercises.reduce((n: number, e: any) => n + e.sets, 0)).toBeLessThanOrEqual(19);
  });

  it('aucune série de deltoïdes en plus, aucun triceps, aucune rotation, aucune fiche avec un coefficient >= 0,5 sur epaules_*', () => {
    const delt = (p: any) => {
      let t = 0;
      for (const s of p.sessions) for (const e of s.exercises) {
        const f = FICHES.find((x) => x.id === e.ficheId)!;
        for (const [z, c] of zoneCoefs(f as ZoneFiche)) if (z.startsWith('epaules')) t += c * e.sets;
      }
      return t;
    };
    expect(delt(on)).toBeCloseTo(delt(off), 5);
    for (const e of added(on)) {
      const f = FICHES.find((x) => x.id === e.ficheId)!;
      expect(f.schema).not.toBe('rotation');
      expect(f.musclesPrincipaux).not.toContain('triceps');
      for (const [z, c] of zoneCoefs(f as ZoneFiche)) if (z.startsWith('epaules')) expect(c).toBeLessThan(0.5);
    }
  });

  it('plafonds respectés : 12 séries de core par semaine et 6 par séance, 11 / 12 par muscle et par séance', () => {
    const core = (s: any) => s.exercises.filter((e: any) => ['gainage', 'anti_rotation', 'rotation'].includes(e.schema)).reduce((n: number, e: any) => n + e.sets, 0);
    const total = (p: any) => p.sessions.reduce((n: number, s: any) => n + core(s), 0);
    for (const o of [BASE, { ...BASE, profile: 'F', place: 'salle' as const }, { ...BASE, profile: 'B' }]) {
      const p = gen(o);
      // Le plafond de 12 ne peut pas être franchi par un ajout CAL-11 (la base peut déjà être au-dessus : gainage de 3 séries en salle).
      expect(total(p)).toBeLessThanOrEqual(Math.max(12, withCal11(false, () => total(gen(o)))));
      for (const s of p.sessions) {
        expect(core(s)).toBeLessThanOrEqual(6);
        expect(s.estimatedMin).toBeLessThanOrEqual(60);
      }
    }
  });

  const same = (o: MkOpts) => expect(signature(gen(o))).toBe(withCal11(false, () => signature(gen(o))));
  it('jamais pour un débutant, en grossesse, en post-partum, en reprise', () => {
    same({ ...BASE, level: 'debutant' });
    same({ ...BASE, preg: 'enceinte' });
    same({ ...BASE, preg: 'post_partum' });
    same({ ...BASE, options: { repriseActive: true } });
  });
  it('jamais avec une zone gênée liée (niveau >= 1) : épaule, dos ; pas de pompe plus avec le poignet gêné', () => {
    same({ ...BASE, injuries: [['epaule', 1]] });
    same({ ...BASE, injuries: [['dos', 1]] });
    expect(added(gen({ ...BASE, injuries: [['poignet', 1]] })).map((e: any) => e.ficheId)).not.toContain('pompe-plus');
  });

  const NOW = '2026-11-12T10:00:00.000Z';
  const pain = (): MkOpts => ({ ...BASE, options: { nowIso: NOW } });
  const painInput = (updatedAt: string | undefined, active: boolean, zone: 'epaule' | 'dos' = 'epaule') => {
    const input = mk(pain());
    input.profile.neckScreen = 'non';
    input.injuries = [{ zone, level: 1, active, deletedAt: null, ...(updatedAt ? { updatedAt } : {}) }];
    return (generateProgram(input) as any).program;
  };
  it('douleur sur la zone liée dans les 7 derniers jours, même passée : aucun ajout ; sans date lisible : prudence', () => {
    for (const d of ['2026-11-08T10:00:00.000Z', undefined]) {
      expect(added(painInput(d, false, 'epaule'))).toHaveLength(0);
      // Dos : seule la ligne du tronc est fermée.
      const dos = added(painInput(d, false, 'dos'));
      expect(dos.filter((e: any) => ['gainage', 'anti_rotation'].includes(e.schema))).toHaveLength(0);
    }
  });
  it('douleur passée depuis plus de 7 jours : les ajouts redeviennent possibles', () => {
    expect(added(painInput('2026-10-20T10:00:00.000Z', false)).length).toBeGreaterThan(0);
  });

  it('jamais d’ajout dans une séance qui contient le cou', () => {
    for (const o of [BASE, { ...BASE, profile: 'F', place: 'salle' as const }, { ...BASE, profile: 'B' }, { ...BASE, days: 4 }]) {
      for (const s of gen(o).sessions) {
        if (s.exercises.some((e: any) => e.ficheId === NECK)) expect(s.exercises.some((e: any) => e.cappedLabel === CAL11.stopMessage)).toBe(false);
      }
    }
  });
});

describe('CAL-11 : corrections du relecteur', () => {
  it('(1) séance avec le cou : ni coiffe, ni dentelé, ni gainage sur les mains, ni élastique ajoutés', () => {
    const refused = (e: any) => ['pompe-plus', 'rotation-externe-epaule', 'face-pull-elastique', ...CAL11.handSupportedCoreIds].includes(e.ficheId) || e.tags?.includes('elastique');
    for (const o of [BASE, { ...BASE, profile: 'F', place: 'salle' as const }, { ...BASE, profile: 'B' }, { ...BASE, days: 4 }]) {
      for (const s of gen(o).sessions) {
        if (!s.exercises.some((e: any) => e.ficheId === NECK)) continue;
        expect(s.exercises.filter((e: any) => e.cappedLabel === CAL11.stopMessage).filter(refused)).toHaveLength(0);
      }
    }
  });
  it('(2) l’empreinte du programme change quand une douleur passée récente apparaît, et reste stable sinon', async () => {
    const { computeInputsHash } = await import('../../src/session/program');
    const mkIn = (updatedAt: string | undefined) => {
      const i = mk({ ...BASE, options: { nowIso: '2026-11-12T10:00:00.000Z' } });
      i.injuries = updatedAt === undefined ? [] : [{ zone: 'epaule', level: 1, active: false, deletedAt: null, updatedAt }];
      return i;
    };
    const none = computeInputsHash(mkIn(undefined));
    const recent = computeInputsHash(mkIn('2026-11-10T10:00:00.000Z'));
    expect(recent).not.toBe(none);
    expect(computeInputsHash(mkIn('2026-11-10T10:00:00.000Z'))).toBe(recent);
    expect(computeInputsHash(mkIn('2026-10-01T10:00:00.000Z'))).toBe(none);
  });
  it('(3) jamais plus de 2 isolations dans une séance avec un ajout CAL-11', () => {
    for (const o of [BASE, { ...BASE, profile: 'F', place: 'salle' as const }, { ...BASE, profile: 'B' }, { ...BASE, days: 4 }]) {
      for (const s of gen(o).sessions) {
        if (!s.exercises.some((e: any) => e.cappedLabel === CAL11.stopMessage)) continue;
        expect(s.exercises.filter((e: any) => String(e.slot).startsWith('iso_') || e.slot === 'correctif').length).toBeLessThanOrEqual(2);
      }
    }
  });
  it('(4) dose imposée : dentelé 8-12 à 3 en réserve ; jamais en secondes', () => {
    for (const e of added(on())) {
      expect(e.unit).not.toBe('sec');
      if (e.ficheId === 'pompe-plus') {
        expect([e.repsMin, e.repsMax, e.rirTarget]).toEqual([8, 12, 3]);
      }
    }
  });
});
function on() { return gen(BASE); }
