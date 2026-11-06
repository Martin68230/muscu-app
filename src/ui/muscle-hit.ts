// Toucher de la carte des muscles : zone sensible AGRANDIE sans changer le dessin. Un appui choisit la zone dessinée sous le doigt ; à côté
// d'un dessin (contour du corps, espace entre deux zones), il choisit la zone la plus proche à moins de HIT_RADIUS_PX pixels. Module PUR.
import { ZONE_PATHS } from './muscle-silhouette';

type Pt = [number, number];
type View = 'face' | 'dos';
interface Piece { zone: string; pts: Pt[]; area: number }

/** Rayon de capture autour de chaque zone, en pixels d'écran : disque de 44 px de diamètre au bord du dessin. */
export const HIT_RADIUS_PX = 22;

/** Morceaux d'un chemin (un par « Z ») : les points du chemin (sommets et points de contrôle) suivent le contour arrondi. */
export function piecesOfPath(d: string): Pt[][] {
  return d.split('Z').filter((s) => /\d/.test(s)).map((s) => {
    const n = (s.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
    const pts: Pt[] = [];
    for (let i = 0; i + 1 < n.length; i += 2) pts.push([n[i], n[i + 1]]);
    return pts;
  });
}

const areaOf = (p: Pt[]) => Math.abs(p.reduce((a, [x, y], i) => { const [u, v] = p[(i + 1) % p.length]; return a + x * v - u * y; }, 0)) / 2;

function inside(p: Pt[], x: number, y: number): boolean {
  let c = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, yi] = p[i], [xj, yj] = p[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

function distToEdges(p: Pt[], x: number, y: number): number {
  let best = Infinity;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [ax, ay] = p[j], [bx, by] = p[i];
    const dx = bx - ax, dy = by - ay;
    const t = dx || dy ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy))) : 0;
    best = Math.min(best, Math.hypot(x - (ax + t * dx), y - (ay + t * dy)));
  }
  return best;
}

const cache = new Map<View, Piece[]>();
function piecesOf(view: View): Piece[] {
  let out = cache.get(view);
  if (!out) {
    out = Object.entries(ZONE_PATHS).flatMap(([zone, v]) => (v[view] ? piecesOfPath(v[view]!).map((pts) => ({ zone, pts, area: areaOf(pts) })) : []));
    cache.set(view, out);
  }
  return out;
}

/**
 * Zone touchée en (x, y), repère de la silhouette (200 x 434). Dans un dessin : ce dessin (le plus petit s'ils se chevauchent) ;
 * sinon la zone dont le bord est le plus proche, à moins de `radius` unités ; sinon null.
 */
export function zoneAt(view: View, x: number, y: number, radius: number): string | null {
  let best: { zone: string; d: number; area: number } | null = null;
  for (const pc of piecesOf(view)) {
    const d = inside(pc.pts, x, y) ? 0 : distToEdges(pc.pts, x, y);
    if (d > radius) continue;
    if (!best || d < best.d || (d === best.d && pc.area < best.area)) best = { zone: pc.zone, d, area: pc.area };
  }
  return best?.zone ?? null;
}

/** Centre (boîte englobante) du premier morceau d'une zone dans une vue : sert aux tests. */
export function zoneCenter(view: View, zone: string): Pt | null {
  const pc = piecesOf(view).find((p) => p.zone === zone);
  if (!pc) return null;
  const xs = pc.pts.map((p) => p[0]), ys = pc.pts.map((p) => p[1]);
  return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
}
