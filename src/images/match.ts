import { GV_TABLE, type GvEntry } from './gv-table';
/** Candidats pour (fiche, variante affichée) : variante exacte seulement. Jamais d'image « proche » : sinon rien. */
export function candidates(ficheId: string, variantId?: string | null): GvEntry[] {
  if (!variantId) return [];
  return GV_TABLE.filter((e) => e.fiche === ficheId && e.variante === variantId);
}
const BY_NAME = new Map(GV_TABLE.map((e) => [e.gif.toLowerCase(), e]));
/** Un fichier est retenu seulement si son nom de base est exactement celui de la table (id-media.gif). */
export function entryForFileName(path: string): GvEntry | undefined {
  return BY_NAME.get((path.split(/[\/]/).pop() ?? '').toLowerCase());
}
export const UNIQUE_IDS = [...new Set(GV_TABLE.map((e) => e.id))];

export interface Candidate extends GvEntry { exact: boolean }
/**
 * Candidats pour une fiche : d'abord la variante affichée (sûr avant proche), puis les AUTRES variantes de la même fiche
 * (sûr avant proche, les plus proches de la variante affichée d'abord). `order` = ids des variantes dans l'ordre de difficulté.
 * Une image d'une autre variante est toujours présentée comme telle (légende) : jamais comme celle de la variante affichée.
 */
export function candidatesForFiche(ficheId: string, variantId: string | null | undefined, order: string[]): Candidate[] {
  const all = GV_TABLE.filter((e) => e.fiche === ficheId);
  const rank = (e: GvEntry) => (e.niveau === 'sûr' ? 0 : 1);
  const exact = all.filter((e) => variantId && e.variante === variantId).sort((a, b) => rank(a) - rank(b)).map((e) => ({ ...e, exact: true }));
  const at = variantId ? order.indexOf(variantId) : -1;
  const dist = (e: GvEntry) => (at < 0 ? order.indexOf(e.variante) : Math.abs(order.indexOf(e.variante) - at));
  const other = all.filter((e) => !variantId || e.variante !== variantId).sort((a, b) => rank(a) - rank(b) || dist(a) - dist(b) || a.id.localeCompare(b.id)).map((e) => ({ ...e, exact: false }));
  return [...exact, ...other];
}
