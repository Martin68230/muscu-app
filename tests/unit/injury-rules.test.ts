import { describe, expect, it } from 'vitest';
import { readFrontmatter } from '../../tools/validate-fiches.mjs';
import {
  effectiveLevel, filterByNeck, neckFicheAllowed, neckShockMessage, NECK_DEDICATED_IDS, NECK_SHOCK_MESSAGE, zoneLevel,
} from '../../src/data/injury-rules';
import { validateRow } from '../../src/data/validate';

const DOUX = ['rotation-douce-cou', 'inclinaison-douce-cou', 'retraction-cervicale'];
const f = (id: string, douxPour: string[] = []) => ({ id, douxPour });
const inj = (zone: string, level: number, extra: object = {}) => ({ zone, level, active: true, deletedAt: null, ...extra }) as never;
const LEVELS = [0, 1, 2, 3] as const;

describe('zone cou : fiches dédiées (C1, C2, C5)', () => {
  it('douces : jamais sans gêne au cou, sauf demande explicite', () => {
    for (const id of DOUX) {
      expect(neckFicheAllowed(f(id, ['cou']), 0)).toBe(false);
      expect(neckFicheAllowed(f(id, ['cou']), 0, true)).toBe(true);
    }
  });
  it('douces : proposées aux niveaux 1 et 2, jamais au niveau 3 (même sur demande)', () => {
    for (const id of DOUX) {
      expect(neckFicheAllowed(f(id, ['cou']), 1)).toBe(true);
      expect(neckFicheAllowed(f(id, ['cou']), 2)).toBe(true);
      expect(neckFicheAllowed(f(id, ['cou']), 3)).toBe(false);
      expect(neckFicheAllowed(f(id, ['cou']), 3, true)).toBe(false);
    }
  });
  it('isometrique-cou : niveau 1 seulement, même sur demande explicite', () => {
    const iso = f('isometrique-cou');
    expect(LEVELS.map((l) => neckFicheAllowed(iso, l))).toEqual([false, true, false, false]);
    expect(neckFicheAllowed(iso, 0, true)).toBe(false);
    expect(neckFicheAllowed(iso, 2, true)).toBe(false);
  });
  it('retraction-omoplates (douce, tirage) : normale aux niveaux 0 à 2, retirée au niveau 3 (C2)', () => {
    const r = f('retraction-omoplates', ['cou']);
    expect(LEVELS.map((l) => neckFicheAllowed(r, l))).toEqual([true, true, true, false]);
  });
  it("une fiche sans lien avec le cou n'est pas touchée", () => {
    expect(LEVELS.every((l) => neckFicheAllowed(f('squat-gobelet'), l))).toBe(true);
  });
  it('filterByNeck : lit les blessures actives, ignore les supprimées et les autres zones', () => {
    const all = [...DOUX.map((i) => f(i, ['cou'])), f('isometrique-cou'), f('retraction-omoplates', ['cou']), f('squat')];
    const ids = (r: { id: string }[]) => r.map((x) => x.id);
    expect(ids(filterByNeck(all, []))).toEqual(['retraction-omoplates', 'squat']);
    expect(ids(filterByNeck(all, [inj('genou', 3)]))).toEqual(['retraction-omoplates', 'squat']);
    expect(filterByNeck(all, [inj('cou', 1, { deletedAt: 'x' })]).length).toBe(2);
    expect(filterByNeck(all, [inj('cou', 1)]).length).toBe(6);
    expect(ids(filterByNeck(all, [inj('cou', 2)]))).not.toContain('isometrique-cou');
    expect(ids(filterByNeck(all, [inj('cou', 3)]))).toEqual(['squat']);
    expect(ids(filterByNeck(all, [], ['rotation-douce-cou']))).toContain('rotation-douce-cou');
  });
});

describe('case « choc / coup du lapin » (C3)', () => {
  it('cochée : niveau 3 quelle que soit la gêne choisie, avec le message « consulte »', () => {
    expect(effectiveLevel({ zone: 'cou', level: 1, afterShock: true })).toBe(3);
    expect(zoneLevel([inj('cou', 1, { afterShock: true })], 'cou')).toBe(3);
    expect(neckShockMessage([inj('cou', 1, { afterShock: true })])).toBe(NECK_SHOCK_MESSAGE);
    expect(NECK_SHOCK_MESSAGE).toMatch(/professionnel de santé/);
  });
  it("décochée ou absente : le niveau choisi s'applique, pas de message", () => {
    expect(effectiveLevel({ zone: 'cou', level: 2, afterShock: false })).toBe(2);
    expect(effectiveLevel({ zone: 'cou', level: 2 })).toBe(2);
    expect(neckShockMessage([inj('cou', 2)])).toBeNull();
  });
  it('la case ne concerne que le cou', () => {
    expect(effectiveLevel({ zone: 'genou', level: 1, afterShock: true })).toBe(1);
  });
  it('la ligne la plus prudente gagne', () => {
    expect(zoneLevel([inj('cou', 1), inj('cou', 2)], 'cou')).toBe(2);
    expect(zoneLevel([inj('cou', 1, { afterShock: true }), inj('cou', 1)], 'cou')).toBe(3);
  });
  it('au niveau 3 par choc, aucune fiche de cou ni douce', () => {
    const all = [...DOUX.map((i) => f(i, ['cou'])), f('isometrique-cou'), f('retraction-omoplates', ['cou'])];
    expect(filterByNeck(all, [inj('cou', 1, { afterShock: true })])).toEqual([]);
  });
});

describe('sauvegardes : champ afterShock facultatif', () => {
  const base = { id: 'a', ownerId: 'u', createdAt: '2026-10-22T10:00:00Z', updatedAt: '2026-10-22T10:00:00Z', rev: 1, deletedAt: null, syncedAt: null, zone: 'cou', side: null, level: 1, note: '', active: true };
  it('accepte une ancienne sauvegarde sans le champ, et refuse un mauvais type', () => {
    expect(validateRow('injuries', base)).toEqual([]);
    expect(validateRow('injuries', { ...base, afterShock: true })).toEqual([]);
    expect(validateRow('injuries', { ...base, afterShock: 'oui' }).length).toBe(1);
  });
});

describe('fiches réelles du lot 04', () => {
  const dir = 'knowledge/exercices/vague1/lot-04-cou/';
  const fm = (id: string) => readFrontmatter(dir + id + '.md');
  it("doux_pour: [cou] sur les 4 fiches douces, absent d'isometrique-cou", () => {
    for (const id of [...DOUX, 'retraction-omoplates']) expect(fm(id).doux_pour).toEqual(['cou']);
    expect(fm('isometrique-cou').doux_pour).toBeUndefined();
  });
  it('les 4 fiches dédiées existent', () => {
    for (const id of NECK_DEDICATED_IDS) expect(fm(id).id).toBe(id);
  });
});
