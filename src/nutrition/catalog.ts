// Chargement des recettes et des aliments (fichiers statiques précachés par la PWA : hors ligne) : public/data/recettes.json et aliments.json,
// générés par tools/build-recettes.mjs et tools/build-aliments.mjs. Aucune requête vers un service externe.

import type { FoodMacros, Recipe } from './plan';
import type { AllergenKey } from './allergens';
import type { PurchaseUnit, Rayon } from './shopping';

export interface FoodInfo extends FoodMacros {
  nom: string;
  unite: { label: string; grammes: number } | null;
  conditionnementG: number | null;
  famille: string;
  rayon: Rayon;
  allergenes: AllergenKey[];
  statutAllergenes: 'valide' | 'a_verifier' | 'inconnu';
  regimesIncompatibles: string[];
}

export interface Catalog {
  recipes: Recipe[];
  foods: Map<string, FoodMacros>;
  info: Map<string, FoodInfo>;
  /** Unités d'achat par ingrédient : pièce (œufs) ou conditionnement courant (paquet de 1 kg). */
  units: Record<string, PurchaseUnit>;
}

let pending: Promise<Catalog> | null = null;

export function loadCatalog(): Promise<Catalog> {
  pending ??= Promise.all([fetch('./data/recettes.json').then((r) => r.json()), fetch('./data/aliments.json').then((r) => r.json())]).then(([rec, ali]) => {
    const info = new Map<string, FoodInfo>();
    for (const a of ali.aliments as Record<string, unknown>[]) {
      const code = String(a.code);
      info.set(code, {
        code, nom: String(a.nom), kcal: Number(a.kcal), prot: Number(a.prot), gluc: Number(a.gluc), lip: Number(a.lip),
        perissable: !!a.perissable, gardeManger: !!a.gardeManger,
        famille: String(a.famille ?? ''), rayon: (a.rayon as Rayon) ?? 'epicerie',
        allergenes: Array.isArray(a.allergenes) ? (a.allergenes as AllergenKey[]) : [],
        statutAllergenes: a.statutAllergenes === 'valide' || a.statutAllergenes === 'a_verifier' ? a.statutAllergenes : 'inconnu',
        regimesIncompatibles: Array.isArray(a.regimesIncompatibles) ? (a.regimesIncompatibles as string[]) : [],
        unite: a.unite ? { label: String((a.unite as { label: string }).label), grammes: Number((a.unite as { grammes: number }).grammes) } : null,
        conditionnementG: typeof a.conditionnementG === 'number' ? a.conditionnementG : null,
      });
    }
    const units: Record<string, PurchaseUnit> = {};
    for (const [code, f] of info) {
      if (f.unite && f.unite.grammes > 0) units[code] = { label: f.unite.label, grams: f.unite.grammes };
      else if (f.conditionnementG && f.conditionnementG > 0) units[code] = { label: f.conditionnementG >= 1000 ? `paquet de ${f.conditionnementG / 1000} kg` : `paquet de ${f.conditionnementG} g`, grams: f.conditionnementG };
    }
    return { recipes: rec.recettes as Recipe[], foods: new Map([...info].map(([c, f]) => [c, f as FoodMacros])), info, units };
  }).catch((e) => {
    pending = null; // une nouvelle tentative reste possible hors ligne puis en ligne
    throw e;
  });
  return pending;
}
