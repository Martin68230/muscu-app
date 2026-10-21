import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { DeviceSettings, SyncedTables, TableName } from './model';
import { TABLES } from './model';

export const DB_NAME = 'muscu-app';
/** Version IndexedDB : chaque montée ajoute une étape dans `upgrade`, jamais de modification d'une étape passée. */
export const DB_VERSION = 1;

type Store<V, I extends Record<string, IDBValidKey> = Record<string, IDBValidKey>> = {
  key: string;
  value: V;
  indexes: I;
};

export interface MuscuDB extends DBSchema {
  profile: Store<SyncedTables['profile'], { updatedAt: string }>;
  equipment: Store<SyncedTables['equipment'], { updatedAt: string }>;
  goals: Store<SyncedTables['goals'], { updatedAt: string }>;
  injuries: Store<SyncedTables['injuries'], { updatedAt: string }>;
  programs: Store<SyncedTables['programs'], { updatedAt: string }>;
  sessions: Store<SyncedTables['sessions'], { updatedAt: string; plannedDate: string }>;
  sets: Store<SyncedTables['sets'], { updatedAt: string; sessionId: string }>;
  bodyWeights: Store<SyncedTables['bodyWeights'], { updatedAt: string; date: string }>;
  meals: Store<SyncedTables['meals'], { updatedAt: string; date: string }>;
  supplements: Store<SyncedTables['supplements'], { updatedAt: string }>;
  shares: Store<SyncedTables['shares'], { updatedAt: string }>;
  device: { key: string; value: DeviceSettings };
}

export type DB = IDBPDatabase<MuscuDB>;

const EXTRA_INDEXES: Partial<Record<TableName, string[]>> = {
  sessions: ['plannedDate'],
  sets: ['sessionId'],
  bodyWeights: ['date'],
  meals: ['date'],
};

let dbPromise: Promise<DB> | null = null;

export function getDB(): Promise<DB> {
  if (!dbPromise) {
    dbPromise = openDB<MuscuDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          for (const name of TABLES) {
            // Les types génériques d'idb ne suivent pas une boucle sur les noms : conversion locale.
            const store = (db as unknown as IDBPDatabase).createObjectStore(name, { keyPath: 'id' });
            store.createIndex('updatedAt', 'updatedAt');
            for (const idx of EXTRA_INDEXES[name] ?? []) store.createIndex(idx, idx);
          }
          db.createObjectStore('device', { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

/** Ferme la connexion (tests, suppression complète). */
export async function closeDB(): Promise<void> {
  if (dbPromise) {
    (await dbPromise).close();
    dbPromise = null;
  }
}
