// Stockage LOCAL des images importées : base IndexedDB séparée « muscu-images » (jamais dans l'export JSON, jamais envoyée).
export const IMG_DB = 'muscu-images';
const STORE = 'images';
export interface StoredImage { id: string; gif: string; bytes: ArrayBuffer; type: string }

let dbp: Promise<IDBDatabase> | null = null;
function open(): Promise<IDBDatabase> {
  if (!dbp) {
    dbp = new Promise((res, rej) => {
      const r = indexedDB.open(IMG_DB, 1);
      r.onupgradeneeded = () => { r.result.createObjectStore(STORE, { keyPath: 'id' }); };
      r.onsuccess = () => res(r.result);
      r.onerror = () => { dbp = null; rej(r.error); };
    });
  }
  return dbp;
}
function run<T>(mode: IDBTransactionMode, f: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return open().then((db) => new Promise<T>((res, rej) => {
    const tx = db.transaction(STORE, mode);
    const rq = f(tx.objectStore(STORE));
    tx.oncomplete = () => res(rq.result);
    tx.onerror = tx.onabort = () => rej(tx.error);
  }));
}
export const putImage = (i: StoredImage) => run('readwrite', (s) => s.put(i));
export const getImage = (id: string) => run<StoredImage | undefined>('readonly', (s) => s.get(id));
export const listImageIds = () => run<IDBValidKey[]>('readonly', (s) => s.getAllKeys()).then((k) => k.map(String));
export const countImages = () => listImageIds().then((k) => k.length);
export async function deleteAllImages(): Promise<void> {
  if (!dbp) { try { await open(); } catch { return; } }
  const db = await open(); db.close(); dbp = null;
  await new Promise<void>((res, rej) => { const r = indexedDB.deleteDatabase(IMG_DB); r.onsuccess = () => res(); r.onerror = () => rej(r.error); r.onblocked = () => res(); });
  cache.clear(); notify();
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
export function clearUrlCache() { cache.clear(); }
