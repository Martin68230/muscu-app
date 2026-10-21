import { getDB } from './db';
import type { DeviceSettings, NewRow, Row, SyncFields, TableName } from './model';

// Horloge remplaçable dans les tests.
let clock: () => Date = () => new Date();
export function setClock(fn: () => Date): void {
  clock = fn;
}

export function newId(): string {
  return crypto.randomUUID();
}

function nowIso(): string {
  return clock().toISOString();
}

/** Date de modification toujours strictement croissante pour un même enregistrement. */
function nextStamp(previous: string | null): string {
  const now = nowIso();
  if (previous && now <= previous) return new Date(Date.parse(previous) + 1).toISOString();
  return now;
}

export async function getDevice(): Promise<DeviceSettings> {
  const db = await getDB();
  const existing = await db.get('device', 'device');
  if (existing) return existing;
  const device: DeviceSettings = {
    key: 'device',
    deviceId: newId(),
    localUserId: newId(),
    aiApiKey: null,
    lastSyncAt: null,
  };
  await db.put('device', device);
  return device;
}

export async function updateDevice(patch: Partial<Omit<DeviceSettings, 'key'>>): Promise<DeviceSettings> {
  const db = await getDB();
  const next = { ...(await getDevice()), ...patch, key: 'device' as const };
  await db.put('device', next);
  return next;
}

export async function create<T extends TableName>(table: T, data: NewRow<T>): Promise<Row<T>> {
  const db = await getDB();
  const { localUserId } = await getDevice();
  const stamp = nowIso();
  const base: SyncFields = {
    id: newId(),
    ownerId: localUserId,
    createdAt: stamp,
    updatedAt: stamp,
    rev: 1,
    deletedAt: null,
    syncedAt: null,
  };
  const row = { ...data, ...base } as Row<T>;
  await db.put(table, row as never);
  return row;
}

export async function get<T extends TableName>(table: T, id: string): Promise<Row<T> | undefined> {
  const db = await getDB();
  const row = (await db.get(table, id)) as Row<T> | undefined;
  return row && !row.deletedAt ? row : undefined;
}

/** Enregistrements vivants (non supprimés). */
export async function list<T extends TableName>(table: T): Promise<Row<T>[]> {
  const db = await getDB();
  const rows = (await db.getAll(table)) as Row<T>[];
  return rows.filter((r) => !r.deletedAt);
}

/** Tous les enregistrements, supprimés compris (export, synchronisation). */
export async function listAll<T extends TableName>(table: T): Promise<Row<T>[]> {
  const db = await getDB();
  return (await db.getAll(table)) as Row<T>[];
}

export async function update<T extends TableName>(
  table: T,
  id: string,
  patch: Partial<NewRow<T>>,
): Promise<Row<T>> {
  const db = await getDB();
  const tx = db.transaction(table, 'readwrite');
  const current = (await tx.store.get(id)) as Row<T> | undefined;
  if (!current || current.deletedAt) throw new Error(`Introuvable : ${table}/${id}`);
  const next = {
    ...current,
    ...patch,
    // Les champs de base ne sont jamais modifiables par l'appelant.
    id: current.id,
    ownerId: current.ownerId,
    createdAt: current.createdAt,
    deletedAt: null,
    syncedAt: current.syncedAt,
    updatedAt: nextStamp(current.updatedAt),
    rev: current.rev + 1,
  } as Row<T>;
  await tx.store.put(next as never);
  await tx.done;
  return next;
}

/** Suppression logique : la ligne reste pour propager la suppression aux autres appareils. */
export async function softDelete<T extends TableName>(table: T, id: string): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(table, 'readwrite');
  const current = (await tx.store.get(id)) as Row<T> | undefined;
  if (current && !current.deletedAt) {
    const stamp = nextStamp(current.updatedAt);
    await tx.store.put({ ...current, deletedAt: stamp, updatedAt: stamp, rev: current.rev + 1 } as never);
  }
  await tx.done;
}

/** Lignes modifiées depuis le dernier envoi (à pousser vers le serveur). */
export async function pendingChanges<T extends TableName>(table: T): Promise<Row<T>[]> {
  const rows = await listAll(table);
  return rows.filter((r) => r.syncedAt === null || r.updatedAt > r.syncedAt);
}

export async function markSynced<T extends TableName>(table: T, ids: string[], at: string): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(table, 'readwrite');
  for (const id of ids) {
    const row = (await tx.store.get(id)) as Row<T> | undefined;
    if (row) await tx.store.put({ ...row, syncedAt: at } as never);
  }
  await tx.done;
}

/**
 * Règle de fusion unique (import JSON et future synchronisation) : la version la plus récente gagne
 * (updatedAt, puis rev) ; à égalité, la version locale est gardée.
 */
export function incomingWins(local: SyncFields | undefined, incoming: SyncFields): boolean {
  if (!local) return true;
  if (incoming.updatedAt !== local.updatedAt) return incoming.updatedAt > local.updatedAt;
  return incoming.rev > local.rev;
}

export async function mergeRows<T extends TableName>(table: T, rows: Row<T>[]): Promise<number> {
  const db = await getDB();
  const tx = db.transaction(table, 'readwrite');
  let applied = 0;
  for (const row of rows) {
    const local = (await tx.store.get(row.id)) as Row<T> | undefined;
    if (incomingWins(local, row)) {
      await tx.store.put(row as never);
      applied++;
    }
  }
  await tx.done;
  return applied;
}
