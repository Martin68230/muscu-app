// Miniatures statiques des images importées : 1re image du GIF, carrée 160 px, JPEG (quelques Ko), stockée dans « muscu-images » (table thumbs).
// Les listes n'affichent JAMAIS le GIF animé : seulement cette miniature, chargée à la demande. Aucune requête réseau, aucun blob: (CSP : data: seulement).
import { getImage, getThumb, putThumb, countThumbs, clearThumbs, listImageIds, thumbCache, notify, onImagesChange } from './store';

export const THUMB_PX = 160;
const MAX_CACHED = 150; // data: URL gardées en mémoire (~5 Ko chacune) ; au-delà, les plus anciennes sont relâchées

/** Décode la 1re image d'un GIF et la réduit en JPEG carré (recadrage centré). null si le navigateur ne sait pas. */
export async function makeThumb(bytes: ArrayBuffer, type = 'image/gif', px = THUMB_PX): Promise<Blob | null> {
  if (typeof document === 'undefined') return null;
  const blob = new Blob([bytes], { type });
  let src: CanvasImageSource; let w = 0; let h = 0; let revoke: (() => void) | null = null;
  try {
    if (typeof createImageBitmap === 'function') {
      const bmp = await createImageBitmap(blob);
      src = bmp; w = bmp.width; h = bmp.height; revoke = () => bmp.close();
    } else throw new Error('pas de createImageBitmap');
  } catch {
    const url = URL.createObjectURL(blob);
    try {
      const im = new Image(); im.decoding = 'async';
      await new Promise<void>((res, rej) => { im.onload = () => res(); im.onerror = () => rej(new Error('décodage impossible')); im.src = url; });
      src = im; w = im.naturalWidth; h = im.naturalHeight;
    } catch { URL.revokeObjectURL(url); return null; }
    revoke = () => URL.revokeObjectURL(url);
  }
  try {
    if (!w || !h) return null;
    const c = document.createElement('canvas'); c.width = px; c.height = px;
    const g = c.getContext('2d'); if (!g) return null;
    g.fillStyle = '#fff'; g.fillRect(0, 0, px, px); // les GIF transparents deviennent blancs (JPEG n'a pas de transparence)
    const side = Math.min(w, h); // recadrage carré centré, sans déformation
    g.drawImage(src, (w - side) / 2, (h - side) / 2, side, side, 0, 0, px, px);
    return await new Promise<Blob | null>((res) => c.toBlob((b) => res(b), 'image/jpeg', 0.72));
  } finally { revoke?.(); }
}

const tick = () => new Promise<void>((r) => setTimeout(r, 0));
let chain: Promise<unknown> = Promise.resolve();
const pending = new Map<string, Promise<boolean>>();
/** Crée la miniature d'une image (si absente), une à la fois et en tâche de fond. true si elle existe ensuite. */
export function ensureThumb(id: string, force = false): Promise<boolean> {
  const hit = pending.get(id);
  if (hit) return hit;
  const p = (chain = chain.then(async () => {
    try {
      if (!force && await getThumb(id)) return true;
      const im = await getImage(id);
      if (!im) return false;
      const b = await makeThumb(im.bytes, im.type);
      if (!b) return false;
      await putThumb({ id, bytes: await b.arrayBuffer(), type: b.type || 'image/jpeg' });
      thumbCache.delete(id);
      return true;
    } catch { return false; } finally { pending.delete(id); await tick(); }
  }) as Promise<boolean>);
  pending.set(id, p as Promise<boolean>);
  return p as Promise<boolean>;
}

const toDataUrl = (b: Blob) => new Promise<string>((res, rej) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result)); fr.onerror = () => rej(fr.error); fr.readAsDataURL(b); });

/** data: URL de la miniature (la crée à la volée si besoin). null si l'image n'existe pas ou n'est pas décodable. */
export async function thumbUrl(id: string): Promise<string | null> {
  const c = thumbCache.get(id);
  if (c) { thumbCache.delete(id); thumbCache.set(id, c); return c; } // LRU : on la remet en dernier
  let t = await getThumb(id);
  if (!t) { if (!(await ensureThumb(id))) return null; t = await getThumb(id); }
  if (!t) return null;
  const u = await toDataUrl(new Blob([t.bytes], { type: t.type }));
  thumbCache.set(id, u);
  while (thumbCache.size > MAX_CACHED) { const k = thumbCache.keys().next().value; if (k === undefined) break; thumbCache.delete(k); }
  return u;
}

/** « Régénérer les miniatures » : refait toutes les miniatures depuis les GIF stockés. */
export async function regenerateThumbs(progress: (done: number, total: number) => void = () => {}): Promise<{ ok: number; failed: number }> {
  await clearThumbs();
  const ids = await listImageIds();
  let ok = 0; let failed = 0;
  for (let i = 0; i < ids.length; i++) {
    progress(i, ids.length);
    if (await ensureThumb(ids[i], true)) ok++; else failed++;
  }
  progress(ids.length, ids.length);
  notify();
  return { ok, failed };
}
export { countThumbs, onImagesChange };
