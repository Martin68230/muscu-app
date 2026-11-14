import { useEffect, useState } from 'preact/hooks';
import { candidates } from './match';
import { imageUrl, listImageIds, onImagesChange } from './store';

/** Image importée par la personne pour (fiche, variante), sinon null. Aucune requête réseau : lecture IndexedDB locale. */
export interface Imported { url: string; niveau: 'sûr' | 'proche' }
export function useImportedImage(ficheId: string, variantId?: string | null): Imported | null {
  const [url, setUrl] = useState<Imported | null>(null);
  const [tick, setTick] = useState(0);
  useEffect(() => onImagesChange(() => setTick((t) => t + 1)), []);
  useEffect(() => {
    let off = false;
    const c = candidates(ficheId, variantId);
    if (!c.length || typeof indexedDB === 'undefined') { setUrl(null); return; }
    (async () => {
      try {
        const have = new Set(await listImageIds());
        const hit = c.find((e) => have.has(e.id));
        const u = hit ? await imageUrl(hit.id) : null;
        if (!off) setUrl(u && hit ? { url: u, niveau: hit.niveau } : null);
      } catch { if (!off) setUrl(null); }
    })();
    return () => { off = true; };
  }, [ficheId, variantId, tick]);
  return url;
}
