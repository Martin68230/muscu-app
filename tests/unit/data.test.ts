import { describe, expect, it } from 'vitest';
import {
  create,
  get,
  getDevice,
  incomingWins,
  list,
  listAll,
  markSynced,
  mergeRows,
  pendingChanges,
  setClock,
  softDelete,
  update,
  updateDevice,
} from '../../src/data/repo';
import { ensureLocalUser, acceptOnboarding } from '../../src/data/bootstrap';
import { exportData, importData, wipeAllData } from '../../src/data/backup';
import { validateRow } from '../../src/data/validate';
import { TABLES, SENSITIVE_SHARE_TYPES, type NewRow } from '../../src/data/model';

const weight = (kg: number, date = '2026-10-21'): NewRow<'bodyWeights'> => ({ date, kg });

function fixedClock(iso: string) {
  setClock(() => new Date(iso));
}

describe('champs de synchronisation', () => {
  it('chaque création reçoit id stable, propriétaire, dates et rev 1', async () => {
    fixedClock('2026-10-21T10:00:00.000Z');
    const device = await getDevice();
    const row = await create('bodyWeights', weight(72.5));
    expect(row.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(row.ownerId).toBe(device.localUserId);
    expect(row.createdAt).toBe('2026-10-21T10:00:00.000Z');
    expect(row.updatedAt).toBe(row.createdAt);
    expect(row.rev).toBe(1);
    expect(row.deletedAt).toBeNull();
    expect(row.syncedAt).toBeNull();
  });

  it('une modification avance updatedAt et rev, sans toucher id ni createdAt', async () => {
    fixedClock('2026-10-21T10:00:00.000Z');
    const row = await create('bodyWeights', weight(72.5));
    fixedClock('2026-10-21T11:00:00.000Z');
    const next = await update('bodyWeights', row.id, { kg: 73, id: 'pirate' } as never);
    expect(next.id).toBe(row.id);
    expect(next.createdAt).toBe(row.createdAt);
    expect(next.updatedAt).toBe('2026-10-21T11:00:00.000Z');
    expect(next.rev).toBe(2);
    expect(next.kg).toBe(73);
  });

  it('updatedAt reste strictement croissant même si l\'horloge ne bouge pas', async () => {
    fixedClock('2026-10-21T10:00:00.000Z');
    const row = await create('bodyWeights', weight(70));
    const a = await update('bodyWeights', row.id, { kg: 71 });
    const b = await update('bodyWeights', row.id, { kg: 72 });
    expect(a.updatedAt > row.updatedAt).toBe(true);
    expect(b.updatedAt > a.updatedAt).toBe(true);
  });

  it("l'id de l'appareil et de l'utilisateur local restent les mêmes", async () => {
    const a = await getDevice();
    const b = await getDevice();
    expect(b.deviceId).toBe(a.deviceId);
    expect(b.localUserId).toBe(a.localUserId);
  });
});

describe('suppression logique', () => {
  it('une ligne supprimée disparaît des listes mais reste pour la synchronisation', async () => {
    const row = await create('bodyWeights', weight(70));
    await softDelete('bodyWeights', row.id);
    expect(await list('bodyWeights')).toHaveLength(0);
    expect(await get('bodyWeights', row.id)).toBeUndefined();
    const all = await listAll('bodyWeights');
    expect(all).toHaveLength(1);
    expect(all[0].deletedAt).not.toBeNull();
    expect(all[0].rev).toBe(2);
  });

  it('on ne peut pas modifier une ligne supprimée', async () => {
    const row = await create('bodyWeights', weight(70));
    await softDelete('bodyWeights', row.id);
    await expect(update('bodyWeights', row.id, { kg: 1 })).rejects.toThrow();
  });
});

describe('suivi des changements à envoyer', () => {
  it('une ligne est à envoyer tant qu\'elle a changé depuis le dernier envoi', async () => {
    fixedClock('2026-10-21T10:00:00.000Z');
    const row = await create('bodyWeights', weight(70));
    expect(await pendingChanges('bodyWeights')).toHaveLength(1);
    await markSynced('bodyWeights', [row.id], '2026-10-21T10:00:00.000Z');
    expect(await pendingChanges('bodyWeights')).toHaveLength(0);
    fixedClock('2026-10-21T12:00:00.000Z');
    await update('bodyWeights', row.id, { kg: 71 });
    expect(await pendingChanges('bodyWeights')).toHaveLength(1);
  });
});

describe('fusion « le plus récent gagne »', () => {
  const base = { id: 'x', ownerId: 'u', createdAt: 't', deletedAt: null, syncedAt: null };
  it('plus récent gagne, puis rev, égalité = local gardé', () => {
    const local = { ...base, updatedAt: '2026-10-21T10:00:00.000Z', rev: 3 };
    expect(incomingWins(undefined, local)).toBe(true);
    expect(incomingWins(local, { ...local, updatedAt: '2026-10-21T11:00:00.000Z', rev: 1 })).toBe(true);
    expect(incomingWins(local, { ...local, updatedAt: '2026-10-21T09:00:00.000Z', rev: 9 })).toBe(false);
    expect(incomingWins(local, { ...local, rev: 4 })).toBe(true);
    expect(incomingWins(local, { ...local })).toBe(false);
  });

  it('une suppression plus récente reçue d\'ailleurs est appliquée', async () => {
    fixedClock('2026-10-21T10:00:00.000Z');
    const row = await create('bodyWeights', weight(70));
    const remote = { ...row, deletedAt: '2026-10-21T11:00:00.000Z', updatedAt: '2026-10-21T11:00:00.000Z', rev: 2 };
    expect(await mergeRows('bodyWeights', [remote])).toBe(1);
    expect(await list('bodyWeights')).toHaveLength(0);
  });
});

describe('premier lancement', () => {
  it('crée un seul profil, le matériel et des partages tous désactivés', async () => {
    const p1 = await ensureLocalUser();
    const p2 = await ensureLocalUser();
    expect(p2.id).toBe(p1.id);
    expect(await list('profile')).toHaveLength(1);
    expect(await list('equipment')).toHaveLength(1);
    const shares = await list('shares');
    expect(shares.length).toBeGreaterThanOrEqual(7);
    expect(shares.every((s) => s.enabled === false)).toBe(true);
    for (const t of SENSITIVE_SHARE_TYPES) expect(shares.find((s) => s.dataType === t)?.enabled).toBe(false);
    expect(p1.aiEnabled).toBe(false);
  });

  it("l'acceptation de l'avertissement et de la majorité est datée", async () => {
    const p = await ensureLocalUser();
    expect(p.healthDisclaimerAcceptedAt).toBeNull();
    const accepted = await acceptOnboarding(p.id);
    expect(accepted.healthDisclaimerAcceptedAt).not.toBeNull();
    expect(accepted.adultConfirmedAt).not.toBeNull();
  });
});

describe('export / import JSON', () => {
  it('aller-retour complet, lignes supprimées comprises', async () => {
    await ensureLocalUser();
    const w = await create('bodyWeights', weight(70));
    const gone = await create('bodyWeights', weight(71, '2026-10-22'));
    await softDelete('bodyWeights', gone.id);
    await create('injuries', { zone: 'genou', side: 'gauche', level: 2, note: '', active: true });
    const file = await exportData();
    expect(file.data.bodyWeights).toHaveLength(2);

    await wipeAllData();
    const result = await importData(JSON.parse(JSON.stringify(file)));
    expect(result.ok).toBe(true);
    expect((await list('bodyWeights')).map((r) => r.id)).toEqual([w.id]);
    expect(await listAll('bodyWeights')).toHaveLength(2);
    expect(await list('injuries')).toHaveLength(1);
  });

  it("l'export ne contient jamais la clé IA ni les réglages de l'appareil", async () => {
    await updateDevice({ aiApiKey: 'sk-secret-test' });
    await ensureLocalUser();
    const text = JSON.stringify(await exportData());
    expect(text).not.toContain('sk-secret-test');
    expect(text).not.toContain('deviceId');
  });

  it('les données importées appartiennent à l\'utilisateur de cet appareil et sont à envoyer', async () => {
    await create('bodyWeights', weight(70));
    const file = await exportData();
    file.data.bodyWeights[0].ownerId = 'autre-personne';
    file.data.bodyWeights[0].syncedAt = '2026-01-01T00:00:00.000Z';
    await wipeAllData();
    await importData(file);
    const [row] = await list('bodyWeights');
    expect(row.ownerId).toBe((await getDevice()).localUserId);
    expect(row.syncedAt).toBeNull();
  });

  it("un import ne remplace pas une version locale plus récente", async () => {
    fixedClock('2026-10-21T10:00:00.000Z');
    const row = await create('bodyWeights', weight(70));
    const file = await exportData();
    fixedClock('2026-10-21T12:00:00.000Z');
    await update('bodyWeights', row.id, { kg: 75 });
    const result = await importData(file);
    expect(result.applied.bodyWeights).toBe(0);
    expect((await get('bodyWeights', row.id))?.kg).toBe(75);
  });

  it('un fichier invalide est refusé sans rien écrire', async () => {
    await create('bodyWeights', weight(70));
    const file = await exportData();
    const bad = JSON.parse(JSON.stringify(file));
    bad.data.bodyWeights.push({ ...bad.data.bodyWeights[0], id: 'nouveau', kg: '80' });
    bad.data.goals = [{ ...bad.data.bodyWeights[0], id: 'g1', goalKey: 'force', rank: 1 }];
    await wipeAllData();
    const result = await importData(bad);
    expect(result.ok).toBe(false);
    expect(result.errors.join(' ')).toContain('kg');
    expect(await listAll('bodyWeights')).toHaveLength(0);
    expect(await listAll('goals')).toHaveLength(0);
  });

  it('refuse un fichier étranger ou d\'une version plus récente', async () => {
    expect((await importData({ hello: 1 })).ok).toBe(false);
    expect((await importData(null)).ok).toBe(false);
    const file = await exportData();
    expect((await importData({ ...file, schemaVersion: 999 })).ok).toBe(false);
  });
});

describe('suppression de toutes les données', () => {
  it('efface toutes les tables et les réglages de l\'appareil', async () => {
    await ensureLocalUser();
    const before = await getDevice();
    await create('bodyWeights', weight(70));
    await wipeAllData();
    for (const t of TABLES) expect(await listAll(t)).toHaveLength(0);
    expect((await getDevice()).deviceId).not.toBe(before.deviceId);
  });
});

describe('validation', () => {
  it('signale un champ manquant et un mauvais type', () => {
    const errors = validateRow('sets', { id: 'a', ownerId: 'u', createdAt: 'x', updatedAt: '2026-10-21T10:00:00.000Z', rev: 1, deletedAt: null, syncedAt: null, reps: 'dix' });
    expect(errors.some((e) => e.includes('sessionId'))).toBe(true);
    expect(errors.some((e) => e.includes('reps'))).toBe(true);
  });
});
describe('import JSON : validation en profondeur (audit 2026-11, constats 1 et 2)', () => {
  const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

  it('export puis import : les données sont identiques', async () => {
    fixedClock('2026-10-21T10:00:00.000Z');
    await ensureLocalUser();
    await create('bodyWeights', weight(70));
    await create('injuries', { zone: 'genou', side: 'gauche', level: 2, note: 'note', active: true });
    const before = clone(await exportData());
    await wipeAllData();
    const r = await importData(clone(before));
    expect(r.ok).toBe(true);
    const after = await exportData();
    const strip = (f: typeof before) => ({ ...f, exportedAt: '', data: { ...f.data, profile: [], equipment: [] } });
    const norm = (f: typeof before) => JSON.parse(JSON.stringify(strip(f), (_k, v) => v));
    expect(norm(after).data.bodyWeights).toEqual(norm(before).data.bodyWeights.map((x: object) => ({ ...x, ownerId: (after.data.bodyWeights[0] as { ownerId: string }).ownerId })));
    expect(after.data.injuries).toHaveLength(1);
  });

  it('refuse proprement un texte trop long, une charge absurde, un plan mal formé, des aliments invalides', async () => {
    await create('bodyWeights', weight(70));
    const base = clone(await exportData());
    const bad = (mut: (f: typeof base) => void) => {
      const f = clone(base);
      mut(f);
      return importData(f);
    };
    const sRow = { ...base.data.bodyWeights[0], id: 's1', programId: null, programDayIndex: null, plannedDate: '2026-10-21', status: 'faite', startedAt: null, endedAt: null, note: '' };
    const r1 = await bad((f) => { (f.data as Record<string, unknown>).sessions = [{ ...sRow, note: 'x'.repeat(5000) }]; });
    expect(r1.ok).toBe(false);
    expect(r1.errors.join(' ')).toContain('trop long');
    const r2 = await bad((f) => { (f.data as Record<string, unknown>).sessions = [{ ...sRow, loadsKg: { a: 99999 } }]; });
    expect(r2.ok).toBe(false);
    const r3 = await bad((f) => { (f.data as Record<string, unknown>).sessions = [{ ...sRow, plan: { exercises: 'oups' } }]; });
    expect(r3.ok).toBe(false);
    const r4 = await bad((f) => { (f.data as Record<string, unknown>).meals = [{ ...sRow, date: 'd', time: null, label: 'l', items: [{ foodCode: 1, grams: -5 }] }]; });
    expect(r4.ok).toBe(false);
    const r5 = await bad((f) => { f.data.bodyWeights[0].kg = 1e12; });
    expect(r5.ok).toBe(false);
    const r6 = await bad((f) => { (f.data as Record<string, unknown>).sessions = [{ ...sRow, loadsKg: JSON.parse('{"__proto__": 1}') }]; });
    expect(r6.ok).toBe(false);
    const r7 = await bad((f) => { (f.data as Record<string, unknown>).sessions = [{ ...sRow, plan: { exercises: new Array(500).fill({}) } }]; });
    expect(r7.ok).toBe(false);
  });

  it('refuse un tableau trop long et un nombre de lignes excessif sans planter', async () => {
    const base = clone(await exportData());
    const f = clone(base);
    f.data.profile = [{ ...f.data.bodyWeights[0] } as never];
    const r = await importData({ ...f, data: { ...f.data, goals: new Array(60000).fill(0) } });
    expect(r.ok).toBe(false);
    expect(r.errors.join(' ')).toContain('trop de lignes');
  });

  it('écarte les champs inconnus', async () => {
    await create('bodyWeights', weight(70));
    const file = clone(await exportData());
    (file.data.bodyWeights[0] as unknown as Record<string, unknown>).intrus = { x: 1 };
    await wipeAllData();
    expect((await importData(file)).ok).toBe(true);
    const [row] = await list('bodyWeights');
    expect(row).not.toHaveProperty('intrus');
  });

  it('un fichier trop gros est refusé par la limite exposée', async () => {
    const { MAX_IMPORT_BYTES } = await import('../../src/data/validate');
    expect(MAX_IMPORT_BYTES).toBe(20 * 1024 * 1024);
  });

  it("updatedAt plus de 24 h dans le futur est ramené à maintenant ; une blessure locale n'est pas écrasée pour toujours", async () => {
    fixedClock('2026-10-21T10:00:00.000Z');
    const inj = await create('injuries', { zone: 'genou', side: null, level: 2, note: '', active: true });
    const file = clone(await exportData());
    const futur = { ...file.data.injuries[0], active: false, rev: 5, updatedAt: '2099-01-01T00:00:00.000Z' };
    file.data.injuries = [futur];
    expect((await importData(file)).ok).toBe(true);
    const imported = await get('injuries', inj.id);
    expect(imported?.updatedAt).toBe('2026-10-21T10:00:00.000Z');
    // une vraie modification locale ultérieure l'emporte donc
    fixedClock('2026-10-22T10:00:00.000Z');
    await update('injuries', inj.id, { active: true });
    const again = clone(file);
    await importData(again);
    expect((await get('injuries', inj.id))?.active).toBe(true);
  });

  it('une date dans les 24 h reste inchangée', async () => {
    fixedClock('2026-10-21T10:00:00.000Z');
    const row = await create('bodyWeights', weight(70));
    const file = clone(await exportData());
    file.data.bodyWeights = [{ ...row, kg: 71, rev: 2, updatedAt: '2026-10-22T08:00:00.000Z' }];
    await importData(file);
    expect((await get('bodyWeights', row.id))?.updatedAt).toBe('2026-10-22T08:00:00.000Z');
  });
});
