// Import local des images : lit un ZIP ou des fichiers, ne retient que les ~35 GIF de la table validée, vérifie le format et le quota.
// Aucune requête réseau dans ce module (testé). Les GIF sont gardés tels quels (l'animation compte) : pas de conversion.
import { listZip, readZipEntry } from './zip';
import { entryForFileName } from './match';
import { UNIQUE_IDS } from './match';
import { listImageIds, putImage, notify, clearUrlCache } from './store';

export const MAX_GIF_BYTES = 8 * 1024 * 1024;
export interface ImportReport { stored: string[]; already: string[]; missing: string[]; errors: { name: string; why: string }[]; scanned: number }
export type Progress = (done: number, total: number, label: string) => void;

const isGif = (b: Uint8Array) => b.length > 6 && b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38;
const tick = () => new Promise<void>((r) => setTimeout(r, 0));

export async function quotaOk(needBytes: number): Promise<string | null> {
  try {
    const est = await navigator.storage?.estimate?.();
    if (est?.quota != null && est.usage != null && est.quota - est.usage < needBytes * 2 + 5_000_000) return 'Pas assez de place sur ce téléphone pour ces images. Libère de l’espace puis recommence.';
  } catch { /* estimation indisponible : on tente, l'écriture signalera l'erreur */ }
  return null;
}

/** files : un ZIP (nom en .zip) ou des images / un dossier. Reprise : les images déjà stockées sont sautées. */
export async function importFiles(files: File[], progress: Progress = () => {}): Promise<ImportReport> {
  const rep: ImportReport = { stored: [], already: [], missing: [], errors: [], scanned: 0 };
  const have = new Set(await listImageIds());
  const jobs: { id: string; name: string; read: () => Promise<Uint8Array> }[] = [];
  for (const f of files) {
    if (/\.zip$/i.test(f.name) || f.type === 'application/zip') {
      try {
        const entries = await listZip(f);
        rep.scanned += entries.length;
        for (const en of entries) { const m = entryForFileName(en.name); if (m) jobs.push({ id: m.id, name: m.gif, read: () => readZipEntry(f, en, MAX_GIF_BYTES) }); }
      } catch (e) { rep.errors.push({ name: f.name, why: (e as Error).message }); }
    } else {
      rep.scanned++;
      const rel = (f as File & { webkitRelativePath?: string }).webkitRelativePath || f.name;
      const m = entryForFileName(rel);
      if (m) jobs.push({ id: m.id, name: m.gif, read: async () => { if (f.size > MAX_GIF_BYTES) throw new Error('image trop grosse'); return new Uint8Array(await f.arrayBuffer()); } });
    }
  }
  const seen = new Set<string>();
  const todo = jobs.filter((j) => { if (seen.has(j.id)) return false; seen.add(j.id); if (have.has(j.id)) { rep.already.push(j.id); return false; } return true; });
  const q = await quotaOk(todo.length * 1_500_000);
  if (q) { rep.errors.push({ name: 'stockage', why: q }); return rep; }
  let done = 0;
  for (const j of todo) {
    progress(done, todo.length, j.name);
    try {
      const b = await j.read();
      if (!isGif(b)) throw new Error('ce n’est pas un GIF');
      const bytes = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
      await putImage({ id: j.id, gif: j.name, bytes, type: 'image/gif' });
      rep.stored.push(j.id);
    } catch (e) {
      const msg = (e as { name?: string; message?: string });
      rep.errors.push({ name: j.name, why: msg.name === 'QuotaExceededError' ? 'Plus de place sur ce téléphone.' : msg.message ?? 'erreur' });
      if (msg.name === 'QuotaExceededError') break;
    }
    done++;
    await tick();
  }
  progress(todo.length, todo.length, '');
  const got = new Set([...have, ...rep.stored]);
  rep.missing = UNIQUE_IDS.filter((id) => !got.has(id));
  clearUrlCache(); notify();
  return rep;
}
