# Recettes (knowledge/recettes/)
Base de recettes de la phase 7 Nutrition (spec §7.2, §7.6, §8, §9). Recettes ORIGINALES écrites par nous (composition, grammes, étapes), jamais copiées d'un site ; pas d'images.

## Arborescence
`knowledge/recettes/<repas>/<id>.md` avec `<repas>` parmi `petit-dej`, `dejeuner-diner`, `collation` (la spec prévoit aussi `avant-seance` / `apres-seance`, pas encore remplis). `id` en kebab-case, identique au nom du fichier.

## Format (front matter YAML puis étapes)
- `id`, `nom`, `repas`, `objectifs` (perte, maintien, prise), `duree_prep_min`, `duree_cuisson_min`, `materiel` (four, micro-ondes, plaques, blender, aucun), `cout` (eco, normal, plus).
- `regimes` : étiquettes DÉCLARATIVES (vegetarien, vegetalien, sans_porc, sans_lactose, sans_gluten), ajoutées seulement si TOUS les ingrédients sont compatibles d'après `regimes_incompatibles` de `knowledge/aliments/ingredients.json`. `check:recettes` recalcule et échoue en cas d'écart.
- `source_glucides`, `source_proteines` : code ou nom d'ingrédient principal (sert à la variété, spec §7.2).
- `portions_base: 1` ; `base_reutilisable` (riz, poulet, légumes rôtis, œufs durs : peut être cuisiné en grande quantité, spec §7.6).
- `statut` : `brouillon` -> `complete_nutri` -> `controle_relecteur`.
- `ingredients` : liste de `{ code, grammes, ajustable }`. `code` = code de `ingredients.json` UNIQUEMENT (aucun ingrédient hors liste, aucun produit transformé). `grammes` = grammes CRUS. `ajustable: true` pour féculent, protéine, matière grasse d'assaisonnement (mis à l'échelle entre 0,5 x et 1,75 x, arrondi aux quantités faciles) ; `false` pour le reste.
- Corps : 4 à 6 étapes courtes en français.

## Ce qui n'est PAS saisi
Allergènes, macros et kcal : calculés au build depuis `ingredients.json` et Ciqual 2025 (ANSES, Licence Ouverte 2.0, DOI 10.57745/RDMHWY). Aucune durée de conservation, aucun conseil médical, aucun complément, aucun facteur de rendement cru / cuit (NON SOURCÉS, spec §7.6 et §9).

## Règles de rédaction
- Portions réalistes : repas 400-700 kcal, collation 150-300 kcal (vérifié au build avec Ciqual, pas à la main).
- Courses optimisées : réutiliser les mêmes ingrédients de base d'une recette à l'autre (riz, œufs, poulet, légumes courants, huile d'olive, flocons d'avoine).
- Variété de sources de glucides et de protéines (volaille, poisson maigre et gras, œufs, bœuf maigre, légumineuses, tofu, laitages).
- Un ingrédient `a_verifier` ou `inconnu` (statut allergènes) exclut la recette des plans avec allergie ou intolérance cochée ; le statut d'une recette est le pire de ses ingrédients.

## Cycle et état
`nutritionniste` rédige un lot de 10 à 15 recettes -> contrôle automatique -> un seul passage `relecteur` par lot, centré sur les allergènes et les valeurs de sécurité (jamais le style) -> publication quand `check:recettes` passe. Lot 1 (L4) : 15 recettes (5 petits-déjeuners, 7 déjeuners / dîners, 3 collations), toutes en `brouillon`, relecture allergènes à faire.
