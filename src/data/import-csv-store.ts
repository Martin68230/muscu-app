// D19 : écriture locale des séances lues dans un CSV Hevy / Strong. Rien n'est envoyé en ligne.
// Les séances portent `imported: true` : visibles dans l'historique, jamais lues par la progression (voir listTrusted dans repo.ts).
import type { SetLog, WorkoutSession } from './model';
import { getDevice, list, listAll, mergeRows, softDelete } from './repo';
import type { SyncFields } from './model';
import type { CsvFormat, ImportPreview } from './import-csv';

export const IMPORT_PREFIX = 'import:';
export const FORMAT_LABEL: Record<CsvFormat, string> = { hevy: 'Hevy', strong: 'Strong' };

/** Identifiant stable (FNV-1a) : réimporter le même fichier ne crée pas de doublons. */
function hash(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36);
}

const dayKey = (iso: string): string => {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

export interface ImportOutcome {
  sessionsAdded: number;
  sessionsKnown: number;
  sets: number;
}

export async function writeImported(preview: ImportPreview): Promise<ImportOutcome> {
  const { localUserId } = await getDevice();
  const stamp = new Date().toISOString();
  const existing = new Set((await list('sessions')).map((s) => s.id));
  const base = { ownerId: localUserId, createdAt: stamp, updatedAt: stamp, rev: 1, deletedAt: null, syncedAt: null };
  const sessions: WorkoutSession[] = [];
  const sets: SetLog[] = [];
  for (const w of preview.workouts) {
    const id = `imp-${hash(`${preview.format}|${w.title}|${w.startedAt}`)}`;
    sessions.push({
      ...base, id, programId: null, programDayIndex: null, plannedDate: dayKey(w.startedAt), status: 'faite',
      startedAt: w.startedAt, endedAt: w.endedAt, note: `Importé depuis ${FORMAT_LABEL[preview.format]}`, endReason: 'terminee',
      plan: { dayIndex: 0, label: `Importé · ${w.title}`.slice(0, 200), exercises: [] }, imported: true,
    });
    w.exercises.forEach((ex, exIndex) => {
      ex.sets.forEach((s, setIndex) => {
        sets.push({
          ...base, id: `${id}-${exIndex}-${setIndex}`, sessionId: id, movementId: ex.movementId, variantId: `${IMPORT_PREFIX}${ex.recognized ? ex.movementId : ex.name}`,
          exerciseIndex: exIndex, setIndex, targetRepsMin: null, targetRepsMax: null, reps: s.reps, loadKg: s.loadKg, rir: s.rir, pain: false,
          comment: '', completedAt: w.startedAt, isWarmup: s.isWarmup, isCalibration: false, capped: false, holdSec: s.holdSec,
        });
      });
    });
  }
  // Réimport après suppression : une ligne supprimée a un rev et une date plus hauts, la fusion l'ignorerait. On repart de sa révision + 1.
  await mergeRows('sessions', await revive(sessions, await listAll('sessions'), stamp));
  await mergeRows('sets', await revive(sets, await listAll('sets'), stamp));
  const added = sessions.filter((s) => !existing.has(s.id)).length;
  return { sessionsAdded: added, sessionsKnown: sessions.length - added, sets: sets.length };
}

/** Pour chaque ligne déjà connue (supprimée ou non), rev + 1 et date de modification strictement plus récente ; les autres lignes sont inchangées. */
function revive<R extends SyncFields>(rows: R[], known: SyncFields[], stamp: string): R[] {
  const byId = new Map(known.map((k) => [k.id, k]));
  return rows.map((r) => {
    const k = byId.get(r.id);
    if (!k) return r;
    const at = stamp > k.updatedAt ? stamp : new Date(Date.parse(k.updatedAt) + 1).toISOString();
    return { ...r, rev: k.rev + 1, updatedAt: at, createdAt: k.createdAt };
  });
}

export async function countImported(): Promise<number> {
  return (await list('sessions')).filter((s) => s.imported).length;
}

/** Supprime d'un coup les séances importées et leurs séries (suppression logique, comme partout). Retourne le nombre de séances. */
export async function deleteImported(): Promise<number> {
  const ids = new Set((await list('sessions')).filter((s) => s.imported).map((s) => s.id));
  for (const s of await listAll('sets')) if (ids.has(s.sessionId) && !s.deletedAt) await softDelete('sets', s.id);
  for (const id of ids) await softDelete('sessions', id);
  return ids.size;
}
