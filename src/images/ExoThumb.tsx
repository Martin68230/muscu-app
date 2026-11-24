import type { ComponentChildren } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { candidatesForFiche } from './match';
import { haveIds, onImagesChange } from './store';
import { thumbUrl } from './thumbs';

export interface ThumbFiche { id: string; variantes: { id: string; echelon: number; tags: string[] }[]; musclesPrincipaux?: string[] }

/** Id de l'image importée à montrer pour (fiche, variante) : même résolution que l'écran Fiche. */
export async function resolveImageId(fiche: ThumbFiche, variantId: string | null | undefined): Promise<string | null> {
  const order = [...fiche.variantes].sort((a, b) => a.echelon - b.echelon).map((v) => v.id);
  const c = candidatesForFiche(fiche.id, variantId, order);
  if (!c.length || typeof indexedDB === 'undefined') return null;
  const have = await haveIds();
  return c.find((e) => have.has(e.id))?.id ?? null;
}

/** Miniature importée (data: URL), chargée seulement quand l'élément approche de l'écran. */
export function useThumbUrl(fiche: ThumbFiche, variantId: string | null | undefined): [(el: Element | null) => void, string | null] {
  const [el, setEl] = useState<Element | null>(null);
  const [near, setNear] = useState(typeof IntersectionObserver === 'undefined');
  const [url, setUrl] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  useEffect(() => onImagesChange(() => setTick((t) => t + 1)), []);
  useEffect(() => {
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setNear(true); io.disconnect(); } }, { rootMargin: '300px' });
    io.observe(el);
    return () => io.disconnect();
  }, [el]);
  useEffect(() => {
    if (!near) return;
    let off = false;
    (async () => {
      try {
        const id = await resolveImageId(fiche, variantId);
        const u = id ? await thumbUrl(id) : null;
        if (!off) setUrl(u);
      } catch { if (!off) setUrl(null); }
    })();
    return () => { off = true; };
  }, [near, fiche.id, variantId, tick]);
  return [setEl, url];
}

const P = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round' as const, 'stroke-linejoin': 'round' as const, 'aria-hidden': true };
type Kind = 'machine' | 'barre' | 'halteres' | 'corps' | 'elastique';
export function kindOf(fiche: ThumbFiche): Kind {
  const tags = new Set(fiche.variantes.flatMap((v) => v.tags));
  if (['machine', 'poulie', 'machine_cardio'].some((t) => tags.has(t)) && fiche.variantes.every((v) => v.tags.some((t) => ['machine', 'poulie', 'machine_cardio'].includes(t)))) return 'machine';
  if (tags.has('elastique') && fiche.variantes.every((v) => v.tags.includes('elastique'))) return 'elastique';
  if (['barre', 'barre_ez'].some((t) => tags.has(t))) return 'barre';
  if (['halteres', 'kettlebell'].some((t) => tags.has(t))) return 'halteres';
  return 'corps';
}
/** Pictogramme dessiné pour l'app (jamais un carré vide) : matériel de la fiche, sinon le corps. */
export function Placeholder({ fiche }: { fiche: ThumbFiche }) {
  const k = kindOf(fiche);
  return (
    <span class="exo-ph" data-kind={k} aria-hidden="true">
      {k === 'machine' && <svg {...P}><rect x="4" y="3" width="4" height="18" rx="1" /><path d="M8 7h10M8 17h10M18 7v10M12 7v10" /></svg>}
      {k === 'barre' && <svg {...P}><path d="M2 12h20M5 7v10M8 9v6M16 9v6M19 7v10" /></svg>}
      {k === 'halteres' && <svg {...P}><path d="M6 8v8M3 10v4M18 8v8M21 10v4M6 12h12" /></svg>}
      {k === 'elastique' && <svg {...P}><path d="M4 6c6 0 10 4 6 8s0 6 10 4" /><circle cx="4" cy="6" r="1.5" /><circle cx="20" cy="18" r="1.5" /></svg>}
      {k === 'corps' && <svg {...P}><circle cx="12" cy="5" r="2.5" /><path d="M12 8v6M7 10l5 1 5-1M9 21l3-7 3 7" /></svg>}
    </span>
  );
}

/** Vignette d'un exercice : miniature importée si elle existe, sinon `fallback` (image du dépôt), sinon pictogramme. */
export function ExoThumb({ fiche, variantId = null, size = 56, fallback, class: cls = '' }: { fiche: ThumbFiche; variantId?: string | null; size?: number; fallback?: ComponentChildren; class?: string }) {
  const [ref, url] = useThumbUrl(fiche, variantId);
  const holder = useRef<HTMLSpanElement>(null);
  useEffect(() => { ref(holder.current); }, [ref]);
  return (
    <span ref={holder} class={`exo-thumb ${cls}`} style={{ width: `${size}px`, height: `${size}px` }}>
      {url ? <img class="exo-thumb-img" src={url} alt="" width={size} height={size} decoding="async" /> : (fallback ?? <Placeholder fiche={fiche} />)}
    </span>
  );
}

let byId: Promise<Map<string, ThumbFiche>> | null = null;
function fichesById() {
  return (byId ??= import('../data/fiches').then((m) => m.loadFiches()).then((l) => new Map(l.map((f) => [f.id, f as ThumbFiche])), (e) => { byId = null; throw e; }));
}
/** Comme ExoThumb, pour un écran qui n'a que l'id de la fiche (la fiche est cherchée dans les données déjà chargées). */
export function ExoThumbById({ ficheId, variantId = null, size = 40 }: { ficheId: string; variantId?: string | null; size?: number }) {
  const [f, setF] = useState<ThumbFiche | null>(null);
  useEffect(() => { let off = false; fichesById().then((m) => { if (!off) setF(m.get(ficheId) ?? null); }, () => {}); return () => { off = true; }; }, [ficheId]);
  const stub: ThumbFiche = { id: ficheId, variantes: [] };
  return <ExoThumb fiche={f ?? stub} variantId={variantId} size={size} />;
}
