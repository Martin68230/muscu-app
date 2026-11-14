import { useEffect, useState } from 'preact/hooks';
import { candidates } from './match';
import { imageUrl, listImageIds, onImagesChange } from './store';

/** Image importée par la personne pour (fiche, variante), sinon null. Aucune requête réseau : lecture IndexedDB locale. */
export function useImportedImage(ficheId: string, variantId?: string | null): string | null {
  const [url, setUrl] = useState<string | null>(null);
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
        if (!off) setUrl(u);
      } catch { if (!off) setUrl(null); }
    })();
    return () => { off = true; };
  }, [ficheId, variantId, tick]);
  return url;
}
