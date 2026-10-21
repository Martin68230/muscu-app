import { closeDB, DB_NAME, getDB } from './db';
import { getDevice, listAll, mergeRows } from './repo';
import { SCHEMA_VERSION, TABLES, type Row, type TableName } from './model';
import { validateRow } from './validate';

export const EXPORT_FORMAT = 'muscu-app-export';

export interface ExportFile {
  format: typeof EXPORT_FORMAT;
  schemaVersion: number;
  exportedAt: string;
  /** Toutes les tables, lignes supprimées comprises. Les réglages de l'appareil (clé IA) n'y sont jamais. */
  data: { [T in TableName]: Row<T>[] };
}

export async function exportData(): Promise<ExportFile> {
  const data = {} as ExportFile['data'];
  for (const table of TABLES) {
    (data as Record<TableName, unknown[]>)[table] = await listAll(table);
  }
  return { format: EXPORT_FORMAT, schemaVersion: SCHEMA_VERSION, exportedAt: new Date().toISOString(), data };
}

export interface ImportResult {
  ok: boolean;
  errors: string[];
  /** Lignes écrites par table (une ligne plus ancienne que la version locale est ignorée). */
  applied: Partial<Record<TableName, number>>;
}

/** Vérifie tout le fichier avant d'écrire quoi que ce soit : un fichier invalide ne modifie rien. */
export async function importData(input: unknown): Promise<ImportResult> {
  const fail = (...errors: string[]): ImportResult => ({ ok: false, errors, applied: {} });

  if (typeof input !== 'object' || input === null) return fail("Ce fichier n'est pas un export de l'app.");
  const file = input as Partial<ExportFile>;
  if (file.format !== EXPORT_FORMAT) return fail("Ce fichier n'est pas un export de l'app.");
  if (typeof file.schemaVersion !== 'number' || file.schemaVersion > SCHEMA_VERSION) {
    return fail("Ce fichier vient d'une version plus récente de l'app : mets l'app à jour puis réessaie.");
  }
  if (typeof file.data !== 'object' || file.data === null) return fail('Fichier incomplet : données absentes.');

  const errors: string[] = [];
  for (const table of TABLES) {
    const rows = (file.data as Record<string, unknown>)[table] ?? [];
    if (!Array.isArray(rows)) {
      errors.push(`${table} : liste attendue`);
      continue;
    }
    for (const row of rows) errors.push(...validateRow(table, row));
  }
  if (errors.length) return fail(...errors.slice(0, 20));

  // Les données importées deviennent celles de l'utilisateur de cet appareil.
  const { localUserId } = await getDevice();
  const applied: ImportResult['applied'] = {};
  for (const table of TABLES) {
    const rows = ((file.data as Record<string, Row<TableName>[]>)[table] ?? []).map((r) => ({
      ...r,
      ownerId: localUserId,
      syncedAt: null,
    }));
    applied[table] = await mergeRows(table, rows as Row<typeof table>[]);
  }
  return { ok: true, errors: [], applied };
}

/** Efface toutes les données de l'appareil (bouton « supprimer mes données », après confirmation). */
export async function wipeAllData(): Promise<void> {
  await getDB();
  await closeDB();
  await new Promise<void>((resolve, reject) => {
    const req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    req.onblocked = () => resolve();
  });
}
