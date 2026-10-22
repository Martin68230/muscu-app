import tagsJson from '../../knowledge/materiel-tags.json';
import { describe, expect, it } from 'vitest';
import { exportData, importData, wipeAllData } from '../../src/data/backup';
import { ensureLocalUser } from '../../src/data/bootstrap';
import {
  ALL_OPTION_TAGS, EQUIPMENT_GROUPS, formatWeights, normalizeEquipment, ownedTags, parseWeights, toggleTag,
} from '../../src/data/equipment-options';
import { list, update } from '../../src/data/repo';
import { validateRow } from '../../src/data/validate';

const tags = tagsJson.tags as { id: string }[];
const base = () => ({
  id: 'e1', ownerId: 'u', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z', rev: 1, deletedAt: null, syncedAt: null,
  preset: 'A' as const, tags: [], disabledImplicit: [], dumbbellWeightsKg: [], kettlebellWeightsKg: [],
});

describe('matériel du profil (D7)', () => {
  it('chaque option correspond à un tag existant de knowledge/materiel-tags.json', () => {
    const ids = new Set(tags.map((t) => t.id));
    for (const t of ALL_OPTION_TAGS) expect(ids.has(t), t).toBe(true);
    expect(new Set(ALL_OPTION_TAGS).size).toBe(ALL_OPTION_TAGS.length);
  });
  it('couvre le matériel demandé par D7', () => {
    for (const t of ['banc', 'banc_inclinable', 'barre_traction', 'barre', 'disques', 'barre_ez', 'rack', 'halteres', 'kettlebell',
      'mini_bande', 'elastique', 'sangles_suspension', 'roue_abdos', 'swiss_ball', 'medecine_ball', 'box_ou_step', 'corde_a_sauter',
      'lest', 'poulie', 'machine', 'machine_cardio', 'tapis']) expect(ALL_OPTION_TAGS).toContain(t);
    expect(EQUIPMENT_GROUPS.map((g) => g.id)).toEqual(['implicite', 'maison', 'salle', 'quotidien']);
  });
  it('cocher / décocher : tags normaux et implicites', () => {
    const e = base();
    expect(toggleTag(e, 'rack', true)).toEqual({ preset: 'perso', tags: ['rack'] });
    expect(toggleTag({ ...e, tags: ['rack', 'banc'] }, 'rack', false).tags).toEqual(['banc']);
    expect(toggleTag(e, 'chaise', false).disabledImplicit).toEqual(['chaise']);
    expect(ownedTags({ ...e, disabledImplicit: ['chaise'], tags: ['rack'] }).has('chaise')).toBe(false);
    expect(ownedTags(e).has('tapis')).toBe(true);
  });
  it('poids : virgule française, doublons, valeurs absurdes', () => {
    expect(parseWeights('12,5; 4 6 4 abc -2 0 9999')).toEqual([4, 6, 12.5]);
    expect(formatWeights([4, 12.5])).toBe('4; 12,5');
  });
  it('ancienne sauvegarde sans les nouveaux champs : valide et normalisée', () => {
    expect(validateRow('equipment', base())).toEqual([]);
    const n = normalizeEquipment(base());
    expect([n.dumbbellKind, n.platesKg, n.other]).toEqual([null, [], '']);
    expect(validateRow('equipment', { ...base(), platesKg: 'x' }).length).toBe(1);
  });
  it('enregistré, exporté, réimporté puis supprimé avec les autres données', async () => {
    await ensureLocalUser();
    const [eq] = await list('equipment');
    await update('equipment', eq.id, { tags: ['rack'], platesKg: [5, 10], dumbbellKind: 'reglables', other: 'anneaux' });
    const data = await exportData();
    await wipeAllData();
    expect(await list('equipment')).toHaveLength(0);
    const res = await importData(JSON.parse(JSON.stringify(data)));
    expect(res.ok).toBe(true);
    const [back] = await list('equipment');
    expect([back.tags, back.platesKg, back.dumbbellKind, back.other]).toEqual([['rack'], [5, 10], 'reglables', 'anneaux']);
    await wipeAllData();
    expect(await list('equipment')).toHaveLength(0);
  });
});
