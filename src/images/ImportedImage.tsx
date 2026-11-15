import { useEffect, useState } from 'preact/hooks';
import { candidatesForFiche } from './match';
import { imageUrl, listImageIds, onImagesChange } from './store';

export interface Imported { url: string; niveau: 'sûr' | 'proche'; variante: string; exact: boolean }

/**
 * Image importée par la personne pour une fiche : celle de la variante affichée si elle existe, sinon celle d'une autre variante
 * de la même fiche (signalée comme telle). Aucune requête réseau : lecture IndexedDB locale.
 */
export function useImportedImage(ficheId: string, variantId: string | null | undefined, order: string[]): Imported | null {
  const [img, setImg] = useState<Imported | null>(null);
  const [tick, setTick] = useState(0);
  const key = order.join('|');
  useEffect(() => onImagesChange(() => setTick((t) => t + 1)), []);
  useEffect(() => {
    let off = false;
    const c = candidatesForFiche(ficheId, variantId, order);
    if (!c.length || typeof indexedDB === 'undefined') { setImg(null); return; }
    (async () => {
      try {
        const have = new Set(await listImageIds());
        const hit = c.find((e) => have.has(e.id));
        const u = hit ? await imageUrl(hit.id) : null;
        if (!off) setImg(u && hit ? { url: u, niveau: hit.niveau, variante: hit.variante, exact: hit.exact } : null);
      } catch { if (!off) setImg(null); }
    })();
    return () => { off = true; };
  }, [ficheId, variantId, key, tick]);
  return img;
}
