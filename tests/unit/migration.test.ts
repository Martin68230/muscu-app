import { openDB } from 'idb';
import { describe, expect, it } from 'vitest';
import { closeDB, DB_NAME, DB_VERSION, getDB } from '../../src/data/db';
import { exportData, importData } from '../../src/data/backup';
import { ensureLocalUser } from '../../src/data/bootstrap';
import { create, list } from '../../src/data/repo';
import { SCHEMA_VERSION, TABLES } from '../../src/data/model';
import { validateRow } from '../../src/data/validate';

const V1_TABLES = TABLES.filter((t) => t !== 'signalements');

const base = (id: string) => ({
  id, ownerId: 'u1', createdAt: '2026-10-01T10:00:00.000Z', updatedAt: '2026-10-01T10:00:00.000Z', rev: 1, deletedAt: null, syncedAt: null,
});
const oldProfile = {
  ...base('p1'), displayName: 'Ancien', adultConfirmedAt: '2026-10-01T10:00:00.000Z', healthDisclaimerAcceptedAt: '2026-10-01T10:00:00.000Z',
  level: 'debutant', daysPerWeek: 3, blockedWeekdays: [6], sessionDurationMin: 45, sports: [], heightCm: null, aiEnabled: false,
};

/** Fabrique une base telle que l'ancienne version de l'app l'aurait créée. */
async function makeOldDb(version: 1 | 2) {
  const db = await openDB(DB_NAME, version, {
    upgrade(d) {
      for (const name of version === 1 ? V1_TABLES : TABLES) {
        const s = d.createObjectStore(name, { keyPath: 'id' });
        s.createIndex('updatedAt', 'updatedAt');
        if (name === 'sessions') s.createIndex('plannedDate', 'plannedDate');
        if (name === 'sets') s.createIndex('sessionId', 'sessionId');
        if (name === 'bodyWeights' || name === 'meals') s.createIndex('date', 'date');
      }
      d.createObjectStore('device', { keyPath: 'key' });
    },
  });
  await db.put('profile', oldProfile);
  await db.put('injuries', { ...base('i1'), zone: 'genou', side: null, level: 2, note: 'vieux', active: true });
  await db.put('bodyWeights', { ...base('w1'), date: '2026-10-01', kg: 71 });
  db.close();
}

describe('migration IndexedDB', () => {
  it('base neuve : toutes les tables, les index et la version courante', async () => {
    const db = await getDB();
    expect(db.version).toBe(DB_VERSION);
    expect(DB_VERSION).toBe(3);
    for (const t of TABLES) expect(db.objectStoreNames.contains(t)).toBe(true);
    expect(db.objectStoreNames.contains('device')).toBe(true);
    const tx = db.transaction(['sessions', 'sets', 'bodyWeights', 'meals'], 'readonly');
    expect([...tx.objectStore('sessions').indexNames]).toContain('plannedDate');
    expect([...tx.objectStore('sets').indexNames]).toContain('sessionId');
    expect([...tx.objectStore('bodyWeights').indexNames]).toContain('date');
    expect([...tx.objectStore('meals').indexNames]).toContain('date');
  });

  it('v1 -> v3 : crée signalements, garde les données, complète le profil', async () => {
    await makeOldDb(1);
    const db = await getDB();
    expect(db.version).toBe(3);
    expect(db.objectStoreNames.contains('signalements')).toBe(true);
    const [p] = await list('profile');
    expect(p.displayName).toBe('Ancien');
    expect(p.daysPerWeek).toBe(3);
    expect(p.place).toBeNull();
    expect(p.pregnancy).toBeNull();
    expect(p.profileCompletedAt).toBeNull();
    expect(p.rev).toBe(1); // la migration ne compte pas comme une modification à synchroniser
    expect((await list('injuries'))[0].zone).toBe('genou');
    expect(await list('bodyWeights')).toHaveLength(1);
    // la base migrée est utilisable
    await create('signalements', { ficheId: 'x', variantId: null, choice: 'autre', text: 'ok' });
    expect(await list('signalements')).toHaveLength(1);
  });

  it('v2 -> v3 : ne recrée rien, garde les signalements et complète le profil', async () => {
    await makeOldDb(2);
    const old = await openDB(DB_NAME, 2);
    await old.put('signalements', { ...base('s1'), ficheId: 'pompe', variantId: null, choice: 'consigne', text: 'texte' });
    old.close();
    await getDB();
    expect(await list('signalements')).toHaveLength(1);
    const [p] = await list('profile');
    expect(p.place).toBeNull();
    expect((await list('injuries'))).toHaveLength(1);
  });

  it('une base déjà en v3 se rouvre sans perte', async () => {
    const p = await ensureLocalUser();
    await closeDB();
    await getDB();
    expect((await list('profile'))[0].id).toBe(p.id);
  });
});

describe('anciennes sauvegardes et nouveaux champs', () => {
  it('une sauvegarde v1 / v2 sans les nouveaux champs reste importable', async () => {
    const file = {
      format: 'muscu-app-export',
      schemaVersion: 1,
      exportedAt: '2026-10-01T10:00:00.000Z',
      data: { profile: [oldProfile], injuries: [{ ...base('i1'), zone: 'genou', side: null, level: 2, note: '', active: true }], sets: [{
        ...base('s1'), sessionId: 'x', movementId: 'm', variantId: 'v', exerciseIndex: 0, setIndex: 0, targetRepsMin: 8, targetRepsMax: 12,
        reps: 10, loadKg: 8, rir: 2, pain: false, comment: '', completedAt: '2026-10-01T10:30:00.000Z',
      }] },
    };
    const r = await importData(file);
    expect(r.errors).toEqual([]);
    expect(r.ok).toBe(true);
    expect((await list('profile'))[0].displayName).toBe('Ancien');
  });

  it('un export courant contient la version 3 et les nouveaux champs', async () => {
    await ensureLocalUser();
    const out = await exportData();
    expect(SCHEMA_VERSION).toBe(3);
    expect(out.schemaVersion).toBe(3);
    expect(out.data.profile[0]).toHaveProperty('place', null);
    expect(out.data.profile[0]).toHaveProperty('pregnancy', null);
    const again = await importData(JSON.parse(JSON.stringify(out)));
    expect(again.ok).toBe(true);
  });

  it('valeurs inconnues refusées : zone, lieu, grossesse', () => {
    expect(validateRow('injuries', { ...base('i'), zone: 'cuisse', side: null, level: 1, note: '', active: true })).toEqual([]);
    expect(validateRow('injuries', { ...base('i'), zone: 'aine', side: null, level: 1, note: '', active: true })).toEqual([]);
    expect(validateRow('injuries', { ...base('i'), zone: 'oreille', side: null, level: 1, note: '', active: true })).not.toEqual([]);
    expect(validateRow('profile', { ...oldProfile, place: 'plage' })).not.toEqual([]);
    expect(validateRow('profile', { ...oldProfile, pregnancy: 'peut-etre' })).not.toEqual([]);
    expect(validateRow('profile', { ...oldProfile, place: 'salle', pregnancy: 'non' })).toEqual([]);
  });
});
