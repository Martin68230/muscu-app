// Allergènes à déclaration obligatoire de l'UE : règlement (UE) n° 1169/2011, annexe II (knowledge/nutrition-rules.md section F, statut OK).
// Les 14 clés sont figées : ajouter ou retirer une clé change la sécurité du filtre (relecteur obligatoire).
// L'étiquetage des ingrédients (champ `allergenes` + statut) est fait par humain, jamais déduit de Ciqual (spec §8).

export const ALLERGENS = [
  'gluten',
  'crustaces',
  'oeufs',
  'poissons',
  'arachides',
  'soja',
  'lait',
  'fruits_a_coque',
  'celeri',
  'moutarde',
  'sesame',
  'sulfites',
  'lupin',
  'mollusques',
] as const;

export type AllergenKey = (typeof ALLERGENS)[number];

/** Libellés français (règlement 1169/2011 annexe II) et précision affichée à l'utilisateur. */
export const ALLERGEN_LABELS: Record<AllergenKey, { label: string; hint: string }> = {
  gluten: { label: 'Céréales contenant du gluten', hint: 'blé, seigle, orge, avoine, épeautre, kamut et leurs dérivés' },
  crustaces: { label: 'Crustacés', hint: 'crevette, crabe, homard, langoustine' },
  oeufs: { label: 'Œufs', hint: 'et produits à base d’œufs' },
  poissons: { label: 'Poissons', hint: 'et produits à base de poisson' },
  arachides: { label: 'Arachides', hint: 'cacahuètes et produits à base d’arachide' },
  soja: { label: 'Soja', hint: 'et produits à base de soja' },
  lait: { label: 'Lait', hint: 'y compris le lactose' },
  fruits_a_coque: { label: 'Fruits à coque', hint: 'amande, noisette, noix, cajou, pécan, noix du Brésil, pistache, macadamia' },
  celeri: { label: 'Céleri', hint: 'et produits à base de céleri' },
  moutarde: { label: 'Moutarde', hint: 'et produits à base de moutarde' },
  sesame: { label: 'Graines de sésame', hint: 'et produits à base de sésame' },
  sulfites: { label: 'Anhydride sulfureux et sulfites', hint: 'à partir de 10 mg/kg ou 10 mg/L : vin, fruits secs, certains vinaigres' },
  lupin: { label: 'Lupin', hint: 'et produits à base de lupin' },
  mollusques: { label: 'Mollusques', hint: 'moule, huître, escargot, calmar, poulpe' },
};

/** Statut d'étiquetage d'un ingrédient. Seul `valide` passe dès qu'un allergène est coché (spec §8). */
export type LabelStatus = 'valide' | 'a_verifier' | 'inconnu';

export interface LabeledIngredient {
  code: string;
  allergenes: AllergenKey[];
  statut: LabelStatus;
}

/**
 * Filtre strict : un ingrédient est utilisable si l'utilisateur n'a coché aucun allergène (hors `inconnu`),
 * ou si l'ingrédient est `valide` et ne contient aucun allergène coché. Échec sûr : tout doute exclut.
 */
export function ingredientAllowed(ing: LabeledIngredient, excluded: readonly AllergenKey[]): boolean {
  if (ing.statut === 'inconnu') return false;
  // Clé d'allergène invalide (faute de frappe) : l'étiquetage n'est pas fiable, donc traité comme inconnu.
  if (!ing.allergenes.every((a) => (ALLERGENS as readonly string[]).includes(a))) return false;
  if (excluded.length === 0) return true;
  if (ing.statut !== 'valide') return false;
  return !ing.allergenes.some((a) => excluded.includes(a));
}

/** Allergènes d'une recette = union de ceux de ses ingrédients. */
export function recipeAllergens(ings: readonly LabeledIngredient[]): AllergenKey[] {
  for (const i of ings) {
    if (!i.allergenes.every((a) => (ALLERGENS as readonly string[]).includes(a))) throw new Error(`Allergène invalide pour ${i.code}`);
  }
  const set = new Set<AllergenKey>();
  for (const i of ings) for (const a of i.allergenes) set.add(a);
  return ALLERGENS.filter((a) => set.has(a));
}
