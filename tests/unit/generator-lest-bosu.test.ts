// S3 et S4 du contrôle relecteur du lot 09 (knowledge/exercices/vague1/lot-09-lest-sac-bosu/CONTROLE-relecteur.md) :
// - S4 : le gilet lesté (`lest`) est une charge FIXE (config.ts FIXED_LOAD_TAGS) : jamais chargeable, pas de charge de départ,
//   pas d'échauffement à ~50 %, pas de hausse de charge ; il reste une charge pour « sans charge » et pour la réserve.
// - S3 : equilibre-unipodal-bosu (schéma `mobilite`) n'est jamais placée par le générateur (GENERATOR_EXCLUDED_FICHES).
// Les fiches sont lues depuis knowledge/ (statut `complete_kine`, absentes de public/data/fiches.json) et passées
// « utilisable » en mémoire pour le test seulement.
// @ts-ignore -- types Node absents du tsconfig de l'app ; ce fichier ne tourne que sous Vitest (Node)
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { generateProgram } from '../../src/generator';
import { CHARGEABLE_TAGS, DOSE, FIXED_LOAD_TAGS, GENERATOR_EXCLUDED_FICHES, TEMPS } from '../../src/generator/config';
import { buildCtx, carriesLoad, isChargeable } from '../../src/generator/context';
import { buildExercise } from '../../src/generator/dose';
import { allowedVariants, ficheAdmissible, resolveFiche, type Candidate } from '../../src/generator/safety';
import { PILLAR_SLOTS } from '../../src/generator/slots';
import { e3Sets } from '../../src/generator/warmup';
import type { Fiche, GenExercise, SlotKey } from '../../src/generator/types';
import { buildFiche } from '../../tools/build-fiches.mjs';
import { allEx, FICHES, LEVELS, mk, PROFILES } from './generator-helpers';

const DIR = 'knowledge/exercices/vague1/lot-09-lest-sac-bosu';
const GILET = ['squat-gilet-lest', 'fente-gilet-lest', 'pompe-gilet-lest', 'traction-gilet-lest', 'montee-gilet-lest', 'pont-fessier-gilet-lest', 'marche-gilet-lest'];
const BOSU = ['squat-bosu', 'planche-bosu', 'pompe-bosu', 'equilibre-unipodal-bosu'];
const EXCLUE = 'equilibre-unipodal-bosu';

const read = (id: string): Fiche => {
  const { fiche } = buildFiche(readFileSync(`${DIR}/${id}.md`, 'utf8'), `${id}.md`);
  return { ...fiche, statut: 'utilisable' } as Fiche;
};
const LOT_GILET: Fiche[] = GILET.map(read);
const LOT_BOSU: Fiche[] = BOSU.map(read);
const LOT = [...LOT_GILET, ...LOT_BOSU];
const SLOTS: SlotKey[] = ['jambes_genou', 'poussee_1', 'tirage_1', 'charniere', 'tronc', 'poussee_2', 'tirage_2', 'jambes_2', 'fonctionnel'];
const GOALS = ['muscle', 'force', 'sante'] as const;
const FAMILY = { muscle: 'muscle', force: 'force', sante: 'sante' } as const;
const cand = (fiche: Fiche, variant: Fiche['variantes'][number]): Candidate => ({
  fiche, variant, origin: fiche, adapted: false, capped: false, adaptations: [], notes: [], replaces: null,
});

/** Charge fixe : rien à étalonner ni à faire monter, échauffement sans pourcentage. */
function expectFixedLoad(e: GenExercise) {
  expect(e.chargeable, e.variantId).toBe(false);
  expect(e.startLoadKg, e.variantId).toBeNull();
  expect(e.warmupSets.every((w) => w.percent === null), e.variantId).toBe(true);
}

describe('S4 lot 09 : le gilet lesté est une charge fixe, jamais chargeable', () => {
  it('config : `lest` sort de CHARGEABLE_TAGS et seul `lest` est une charge fixe ; les autres tags chargeables sont inchangés', () => {
    expect(CHARGEABLE_TAGS).not.toContain('lest');
    expect([...FIXED_LOAD_TAGS]).toEqual(['lest']);
    expect([...CHARGEABLE_TAGS].sort()).toEqual(['barre', 'barre_ez', 'bidons_ou_sacs', 'disques', 'halteres', 'kettlebell', 'machine', 'poulie', 'sac_a_dos']);
  });

  it('bibliothèque publiée : seules les fiches gilet portent `lest` (non chargeable) ; le dosage des autres fiches ne change pas', () => {
    const OLD = [...CHARGEABLE_TAGS, 'lest'];
    for (const f of FICHES)
      for (const v of f.variantes) {
        if (v.tags.includes('lest')) {
          expect(GILET, v.id).toContain(f.id);
          expect(isChargeable(v), v.id).toBe(false);
        } else expect(isChargeable(v), v.id).toBe(v.tags.some((t) => OLD.includes(t)));
      }
  });

  it('les 7 fiches gilet : chaque variante porte `lest`, n\'est pas chargeable mais porte une charge', () => {
    expect(LOT_GILET.map((f) => f.id)).toEqual(GILET);
    for (const f of LOT_GILET) {
      expect(f.variantes.length).toBeGreaterThan(0);
      for (const v of f.variantes) {
        expect(v.tags, v.id).toContain('lest');
        expect(isChargeable(v), v.id).toBe(false);
        expect(carriesLoad(v), v.id).toBe(true);
      }
    }
  });

  it('profil E (maison) : gilet, bosu et sac de sable sont cochés', () => {
    for (const t of ['lest', 'bosu', 'sac_de_sable']) expect(PROFILES.E.tags).toContain(t);
  });

  it('buildExercise : chaque variante, niveau, objectif, emplacement -> pas de charge, dose « sans charge », réserve des charges libres', () => {
    let n = 0;
    for (const level of LEVELS)
      for (const goal of GOALS) {
        // Charge habituelle déclarée : elle ne doit jamais devenir une charge de départ pour le gilet.
        const ctx = buildCtx(mk({ profile: 'E', level, goal, options: { habitualLoadsKg: Object.fromEntries(GILET.map((id) => [id, 10])) } }));
        const d = DOSE[FAMILY[goal]][level];
        for (const f of LOT_GILET)
          for (const v of f.variantes)
            for (const slot of SLOTS) {
              const e = buildExercise(cand(f, v), slot, 'a', ctx);
              e.warmupSets = e3Sets(e, ctx);
              expectFixedLoad(e);
              const temps = TEMPS[f.schema];
              if (temps) {
                expect(e.rirAsked).toBe(false);
              } else {
                // Jamais les 4-6 répétitions des piliers chargés ni la réserve 1 des variantes « sûres ».
                expect([e.repsMin, e.repsMax], v.id).toEqual(d.repsBodyweight);
                expect(e.rirAsked).toBe(true);
                expect(e.rirTarget, v.id).toBe(d.rir);
                expect(e.rirTarget).toBeGreaterThanOrEqual(2);
              }
              if (PILLAR_SLOTS.includes(slot)) expect(e.warmupSets.length, v.id).toBeGreaterThan(0);
              n++;
            }
      }
    expect(n).toBeGreaterThan(300);
  });

  it('historique avec une charge saisie : toujours pas de charge de départ ni d\'échauffement à ~50 %', () => {
    const f = LOT_GILET.find((x) => x.id === 'squat-gilet-lest')!;
    for (const v of f.variantes) {
      const ctx = buildCtx(mk({ profile: 'E', level: 'avance', goal: 'force',
        history: [{ variantId: v.id, loadKg: 10, pain: false, completedAt: '2026-10-20T10:00:00Z' }] }));
      const e = buildExercise(cand(f, v), 'jambes_genou', 'a', ctx);
      e.warmupSets = e3Sets(e, ctx);
      expectFixedLoad(e);
      expect(e.warmupSets.length).toBeGreaterThan(0);
    }
  });

  it('restriction « sans charge » : les variantes au gilet restent retirées', () => {
    const ctx = buildCtx(mk({ profile: 'E', level: 'avance' }));
    for (const f of LOT_GILET) {
      expect(allowedVariants(f, ctx).length, f.id).toBeGreaterThan(0);
      expect(allowedVariants(f, ctx, { sansCharge: true }), f.id).toEqual([]);
    }
  });

  it('générateur complet : tout exercice au gilet placé est sans charge, sans échauffement en pourcentage', () => {
    const placed = new Set<string>();
    const check = (fiches: Fiche[]) => {
      for (const level of ['intermediaire', 'avance'] as const)
        for (const goal of GOALS)
          for (const days of [2, 3, 4]) {
            const r = generateProgram(mk({ profile: 'E', level, goal, days, dur: 75, fiches }));
            if (!r.ok) continue;
            for (const e of allEx(r.program)) {
              if (!GILET.includes(e.ficheId)) continue;
              placed.add(e.ficheId);
              expectFixedLoad(e);
            }
          }
    };
    check([...FICHES, ...LOT]);
    // Puis on force : seules les fiches gilet couvrent leurs schémas (squat, fente, poussée, tirage vertical, charnière).
    const schemas = new Set(LOT_GILET.map((f) => f.schema));
    check([...FICHES.filter((f) => !schemas.has(f.schema)), ...LOT_GILET]);
    expect(placed.size).toBeGreaterThanOrEqual(4);
    expect(placed.has('squat-gilet-lest') || placed.has('pompe-gilet-lest')).toBe(true);
  });
});

describe('S3 lot 09 : equilibre-unipodal-bosu jamais placée', () => {
  it('config : la fiche est dans la liste d\'exclusion, et elle seule', () => {
    expect([...GENERATOR_EXCLUDED_FICHES]).toEqual([EXCLUE]);
  });

  it('fiche lue, `utilisable` en mémoire, matériel présent : pourtant non admissible, même en échauffement', () => {
    const f = LOT_BOSU.find((x) => x.id === EXCLUE)!;
    expect(f.schema).toBe('mobilite');
    for (const level of ['intermediaire', 'avance'] as const) {
      const ctx = buildCtx(mk({ profile: 'E', level }));
      expect(allowedVariants(f, ctx).length).toBeGreaterThan(0);
      expect(ficheAdmissible(f, ctx)).toBe(false);
      expect(ficheAdmissible(f, ctx, { warmup: true })).toBe(false);
      expect(resolveFiche(f, ctx).candidates).toEqual([]);
    }
  });

  it('générateur complet (tous objectifs, niveaux, jours) : jamais dans un exercice ni dans l\'échauffement', () => {
    const fiches = [...FICHES, ...LOT];
    let ok = 0;
    for (const level of ['intermediaire', 'avance'] as const)
      for (const goal of [...GOALS, 'mobilite', 'fonctionnel'])
        for (const days of [2, 3, 4, 5])
          for (const dur of [30, 75]) {
            const r = generateProgram(mk({ profile: 'E', level, goal, days, dur, fiches }));
            if (!r.ok) continue;
            ok++;
            expect(allEx(r.program).some((e) => e.ficheId === EXCLUE)).toBe(false);
            expect(JSON.stringify(r.program)).not.toContain(EXCLUE);
          }
    expect(ok).toBeGreaterThan(20);
  });
});
