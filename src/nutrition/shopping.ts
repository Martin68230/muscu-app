// Liste de courses (docs/nutrition-spec.md §10, N12) : pure, recalculée à chaque ouverture, aucun prix.

export type Rayon =
  | 'fruits_legumes' | 'viandes_poissons' | 'laitiers_oeufs' | 'feculents' | 'epicerie' | 'surgeles' | 'assaisonnements';

export const RAYON_ORDER: readonly Rayon[] = [
  'fruits_legumes', 'viandes_poissons', 'laitiers_oeufs', 'feculents', 'epicerie', 'surgeles', 'assaisonnements',
];

export const RAYON_LABELS: Record<Rayon, string> = {
  fruits_legumes: 'Fruits et légumes',
  viandes_poissons: 'Viandes et poissons',
  laitiers_oeufs: 'Produits laitiers et œufs',
  feculents: 'Féculents',
  epicerie: 'Épicerie',
  surgeles: 'Surgelés',
  assaisonnements: 'Assaisonnements',
};

/** Ingrédient d'un repas du plan, grammes CRUS, après mise à l'échelle et substitutions. */
export interface PlannedIngredient {
  code: string;
  name: string;
  grams: number;
  rayon: Rayon;
  /** Ingrédient courant (sel, huile, épices) : masqué par défaut. */
  pantry?: boolean;
}

/** Unité d'achat d'un ingrédient (table de aliments.json) : poids d'une pièce / d'un conditionnement. */
export interface PurchaseUnit {
  label: string;
  grams: number;
}

export interface ShoppingItem {
  code: string;
  name: string;
  rayon: Rayon;
  neededGrams: number;
  /** Quantité à acheter : jamais inférieure au besoin. */
  buyGrams: number;
  /** Nombre d'unités d'achat si une unité est connue. */
  units: { label: string; count: number } | null;
  pantry: boolean;
}

/** Arrondi par défaut des grammes (5 g), sans jamais descendre sous le besoin. */
export const ROUND_GRAMS = 5;

export function buildShoppingList(
  planned: readonly PlannedIngredient[],
  units: Readonly<Record<string, PurchaseUnit>> = {},
): ShoppingItem[] {
  const byCode = new Map<string, ShoppingItem>();
  for (const p of planned) {
    if (!(p.grams > 0)) continue;
    const cur = byCode.get(p.code);
    if (cur) cur.neededGrams += p.grams;
    else byCode.set(p.code, { code: p.code, name: p.name, rayon: p.rayon, neededGrams: p.grams, buyGrams: 0, units: null, pantry: !!p.pantry });
  }
  const items = [...byCode.values()];
  for (const it of items) {
    const u = units[it.code];
    if (u && u.grams > 0) {
      const count = Math.ceil(it.neededGrams / u.grams - 1e-9);
      it.units = { label: u.label, count };
      it.buyGrams = count * u.grams;
    } else {
      it.buyGrams = Math.ceil(it.neededGrams / ROUND_GRAMS - 1e-9) * ROUND_GRAMS;
    }
  }
  return items.sort(
    (a, b) => RAYON_ORDER.indexOf(a.rayon) - RAYON_ORDER.indexOf(b.rayon) || a.name.localeCompare(b.name, 'fr'),
  );
}

/** Texte à copier ou partager (feuille de partage du système) : rien n'est envoyé par l'app. */
export function shoppingToText(items: readonly ShoppingItem[], pantryHidden: boolean = true): string {
  const lines: string[] = ['Liste de courses', ''];
  for (const r of RAYON_ORDER) {
    const inR = items.filter((i) => i.rayon === r && !(pantryHidden && i.pantry));
    if (!inR.length) continue;
    lines.push(RAYON_LABELS[r]);
    for (const i of inR) {
      lines.push(`- ${i.name} : ${i.units ? `${i.units.count} ${i.units.label}` : `${i.buyGrams} g`}`);
    }
    lines.push('');
  }
  lines.push('Vérifie toujours les étiquettes (allergènes).');
  return lines.join('\n');
}
