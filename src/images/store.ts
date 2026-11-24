// Stockage LOCAL des images importées : base IndexedDB séparée « muscu-images » (jamais dans l'export JSON, jamais envoyée).
export const IMG_DB = 'muscu-images';
const STORE = 'images';
const THUMBS = 'thumbs'; // miniatures statiques (JPEG ~160 px) générées depuis la 1re image du GIF
export interface StoredThumb { id: string; bytes: ArrayBuffer; type: string }
export interface StoredImage { id: string; gif: string; bytes: ArrayBuffer; type: string }

let dbp: Promise<IDBDatabase> | null = null;
function open(): Promise<IDBDatabase> {
  if (!dbp) {
    dbp = new Promise((res, rej) => {
      const r = indexedDB.open(IMG_DB, 2);
      r.onupgradeneeded = () => { const d = r.result; if (!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE, { keyPath: 'id' }); if (!d.objectStoreNames.contains(THUMBS)) d.createObjectStore(THUMBS, { keyPath: 'id' }); };
      r.onsuccess = () => res(r.result);
      r.onerror = () => { dbp = null; rej(r.error); };
    });
  }
  return dbp;
}
function run<T>(mode: IDBTransactionMode, f: (s: IDBObjectStore) => IDBRequest<T>, store: string = STORE): Promise<T> {
  return open().then((db) => new Promise<T>((res, rej) => {
    const tx = db.transaction(store, mode);
    const rq = f(tx.objectStore(store));
    tx.oncomplete = () => res(rq.result);
    tx.onerror = tx.onabort = () => rej(tx.error);
  }));
}
export const putImage = (i: StoredImage) => run('readwrite', (s) => s.put(i));
export const getImage = (id: string) => run<StoredImage | undefined>('readonly', (s) => s.get(id));
export const listImageIds = () => run<IDBValidKey[]>('readonly', (s) => s.getAllKeys()).then((k) => k.map(String));
export const putThumb = (t: StoredThumb) => run('readwrite', (s) => s.put(t), THUMBS);
export const getThumb = (id: string) => run<StoredThumb | undefined>('readonly', (s) => s.get(id), THUMBS);
export const countThumbs = () => run<number>('readonly', (s) => s.count(), THUMBS);
export const clearThumbs = async () => { await run('readwrite', (s) => s.clear(), THUMBS); thumbCache.clear(); haveCache = null; };
let haveCache: Promise<Set<string>> | null = null;
/** Ensemble des ids importés, mis en cache le temps d'une liste (invalidé à chaque import / suppression). */
export const haveIds = () => (haveCache ??= listImageIds().then((k) => new Set(k), (e) => { haveCache = null; throw e; }));
export const thumbCache = new Map<string, string>();
export const countImages = () => listImageIds().then((k) => k.length);
export async function deleteAllImages(): Promise<void> {
  if (!dbp) { try { await open(); } catch { return; } }
  const db = await open(); db.close(); dbp = null;
  await new Promise<void>((res, rej) => { const r = indexedDB.deleteDatabase(IMG_DB); r.onsuccess = () => res(); r.onerror = () => rej(r.error); r.onblocked = () => res(); });
  cache.clear(); thumbCache.clear(); haveCache = null; notify();
}
// Petit cache de data: URL (data: est déjà permis par la CSP ; pas de blob:).
const cache = new Map<string, string>();
const listeners = new Set<() => void>();
export const onImagesChange = (f: () => void) => { listeners.add(f); return () => { listeners.delete(f); }; };
export function notify() { listeners.forEach((f) => f()); }
export async function imageUrl(id: string): Promise<string | null> {
  const hit = cache.get(id);
  if (hit) return hit;
  const im = await getImage(id);
  if (!im) return null;
  const b64 = await new Promise<string>((res, rej) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result)); fr.onerror = () => rej(fr.error); fr.readAsDataURL(new Blob([im.bytes], { type: im.type })); });
  cache.set(id, b64);
  return b64;
}
export function clearUrlCache() { cache.clear(); haveCache = null; }
