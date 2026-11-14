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
