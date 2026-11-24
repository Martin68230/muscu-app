import { GV_TABLE } from './gv-table';

export interface FicheImageStats {
  /** Fiches de l'app. */
  total: number;
  /** Fiches qui ont une image importée affichable (au moins une variante). */
  withImage: number;
  /** Fiches qui pourraient en avoir une (présentes dans la table) mais n'en ont pas encore. */
  toImport: number;
  /** Fiches sans équivalent dans le jeu : leur dessin ou leur photo reste. */
  noImageInGame: number;
}

/** Compteurs « Mes images » : calcul pur à partir des identifiants stockés et des identifiants de fiches de l'app. */
export function ficheImageStats(storedIds: string[], ficheIds: string[]): FicheImageStats {
  const stored = new Set(storedIds);
  const possible = new Set(GV_TABLE.map((e) => e.fiche));
  const have = new Set(GV_TABLE.filter((e) => stored.has(e.id)).map((e) => e.fiche));
  let withImage = 0; let toImport = 0; let noImageInGame = 0;
  for (const id of new Set(ficheIds)) {
    if (have.has(id)) withImage++;
    else if (possible.has(id)) toImport++;
    else noImageInGame++;
  }
  return { total: new Set(ficheIds).size, withImage, toImport, noImageInGame };
}
