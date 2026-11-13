# Ingrédients de base (knowledge/aliments/)
- `ingredients.json` : liste de départ (~276) des ingrédients bruts ou très simples de la base de recettes (spec nutrition §7.6, §8, §9, §10 ; règles F, G, H).
- Source des codes et noms : Ciqual 2025 (ANSES), `alim.xml`, Licence Ouverte 2.0, DOI 10.57745/RDMHWY. Mention : « Source : ANSES, Table de composition nutritionnelle des aliments Ciqual, Licence Ouverte 2.0 ». Le fichier Ciqual reste hors dépôt.
- Le code est celui du produit brut ou nature (cru pour viande, riz, pâtes : les grammes sont des grammes crus) ; `nom` est un nom court français écrit par nous. Macros et kcal ne sont jamais saisies ici : elles viennent de Ciqual au build.
- Allergènes : ensemble des 14 clés UE (règles F). Ciqual ne les donne pas de façon fiable : étiquetage manuel, `statut_allergenes` toujours `a_verifier` ici.
- Seul `relecteur` peut passer un ingrédient à `valide` (par lot) ; `nutritionniste` rédige, jamais de `valide` posé par l'auteur. Tant que ce n'est pas `valide`, l'ingrédient est exclu des plans avec allergie ou intolérance cochée.
- `regimes_incompatibles` : végétarien, végétalien, sans porc, halal (préférence déclarée, jamais une certification ; porc seulement), sans lactose, sans gluten.
- `unite_achat` (label, grammes) et `conditionnement_g` : tailles d'achat usuelles en France, PROVISOIRES (à valider) ; `null` si vrac ou non pertinent.
- `garde_manger` : masqué par défaut dans la liste de courses (sel, poivre, épices, huiles). `perissable` : sert à l'optimisation des courses.
- Aucune durée de conservation (NON SOURCÉ, spec §7.6). Produits transformés (sauces, bouillons, charcuterie, plats préparés, moutarde, vinaigres, curry, chocolat) volontairement absents.
