# Nutrition (phase 7) : reprise du chantier (mis à jour le 14/11/2026, EN PAUSE)

Fichier propre à ce chantier ; ne remplace pas `docs/reprendre-ici.md`. Spécification : `docs/nutrition-spec.md` ; valeurs et statuts : `knowledge/nutrition-rules.md` ; liste « à vérifier sur l'iPhone » : `docs/nutrition-iphone.md`.

## Pause
Chantier mis en pause à la demande de l'utilisateur (garder le quota hebdomadaire pour le design et les autres fonctionnalités). **Aucun agent ne tourne.** Reprise seulement quand l'utilisateur redonne le feu (la session « CI rouge et agents » réveille ce chantier).

## En ligne (déploiement vert vérifié)
- Dernier push : `8e0e5c3` (viandes, charcuterie, sauces validées, variété du plan). Avant : `f6581d7`, `ad0337e`, `9f198ee`, `da03d89` (écran Nutrition).
- **Écran Nutrition** (Bibliothèque > Nutrition) : questionnaire de sécurité avec motifs affichés quand l'app ne calcule pas ; **« Mes besoins »** (aujourd'hui, journée moyenne, eau repère EFSA, rythme visé, détail du calcul, 7 jours) ; **« Semaine »** (plan des 7 jours, repas optionnels jour par jour, petit-déjeuner identique, lots de barres, courses de la semaine cochables, allergies, régime, cœliaque, matériel, temps) ; **« Poids et courbe »** (pesée hebdomadaire, poids lissé, alertes, recalage).
- **Code** `src/nutrition/` : `final-needs.ts` (CIBLE FINALE UNIQUE, lue par l'écran, le plan et les courses), `needs.ts` (dépistage, plancher personnalisé, plafonds), `day-targets.ts`, `weight-trend.ts`, `alerts.ts`, `plan.ts` et `week-plan.ts` (plan de la semaine, variété : une recette au plus 2 fois par semaine, rotation protéines et féculents), `shopping.ts`, `allergens.ts` (14 allergènes UE), `catalog.ts`, `store.ts`, `config.ts` (toutes les valeurs avec statut). Tables locales privées `nutritionProfiles`, `nutritionGoals`, `weeklyCheckins`, `mealPlans`, `shoppingStates`, `recipePrefs` (SCHEMA_VERSION 5, migration additive testée).
- **Données** : `public/data/aliments.json` (Ciqual 2025, Licence Ouverte 2.0, généré par `tools/build-aliments.mjs` depuis `../donnees-externes/ciqual-2025/`, HORS dépôt, MD5 vérifiés) ; recettes dans `knowledge/recettes/` compilées et contrôlées par `tools/build-recettes.mjs` (branché dans `npm run build`). 56 recettes publiées (27 repas, 15 petits-déjeuners, 14 en-cas), aucune ne contient un ingrédient non validé.
- Règles de contenu décidées par l'utilisateur : produits ACHETÉS et jamais fabriqués (pas de pain, sauce, pâte, yaourt faits maison), assemblages simples (3 à 6 ingrédients, <= 25-30 min), plan par SEMAINE, « pain complet » sans précision à l'écran, étiquetage prudent des allergènes (doute = présent).

## État du dépôt local (non poussé)
Branche `claude/spec-nutrition-eb35f9`, commit de pause à venir : **6 sauces du commerce ajoutées en `a_verifier`** (barbecue 11100, carbonara 11128, moutarde 11157, aigre-douce 11163, tomate-champignons 11177, tomate-fromage 11208) ; **normalisation des clés de rotation** dans `tools/build-recettes.mjs` (« pâtes » et « pates », « bœuf » et « boeuf », « riz blanc » et « riz » deviennent une seule clé : le plan compare ces clés pour faire tourner protéines et féculents). Cet état passe `build-aliments` (302 ingrédients) et `check:recettes` (61 contrôlées, 56 publiables). **À rejouer en clone propre complet avant tout push** (règle CLAUDE.md). Aucune recette n'a été écrite pour le lot 1.

## Prochaines actions, dans l'ordre demandé par l'utilisateur
1. **80 recettes de repas avec viande OU poisson** (décision du 14/11 : les 80 comptent viande ou poisson). Existant : ~17 repas avec viande + 7 avec poisson publiés = ~24. Reste ~56 :
   - **Lot 1 : 32 recettes de viande** (poulet 9, dinde 5, bœuf haché 6, bœuf morceaux 4, porc 5, veau 2, jambon/lardons/saucisse 1) ; féculents qui tournent (pâtes, riz, semoule, pommes de terre, wrap, pain) ; sauces du commerce (les 6 ajoutées + existantes). Brief prêt : voir `docs/nutrition-spec.md` annexe « produits achetés » ; chaque recette en `brouillon`, `source_proteines` et `source_glucides` en mots courts.
   - **Lot 2 : ~24 recettes** poisson (merlu, cabillaud, saumon, colin, thon, sardines et maquereau en conserve, truite : crustacés et mollusques seulement avec étiquetage prudent) et viande.
   - Pour chaque lot : produits ajoutés en `a_verifier` -> **un passage `relecteur`** (allergènes, régimes, « sans porc » seulement sans aucun porc ni volaille en tranches) -> statut `controle_relecteur` -> `check:recettes` -> clone propre -> accord de la session « CI rouge et agents » -> push -> déploiement vert.
2. **20 recettes végétariennes** (une seule recette de repas végétarienne aujourd'hui) : œufs, légumineuses, fromage, tofu si Ciqual fiable ; même règle des produits achetés.
3. **Export N15** (courses, repas et recettes pour les jours choisis, pour 2 personnes, texte à copier et JSON, modèle de demande pour une IA masqué quand l'IA est coupée) : voir `docs/nutrition-spec.md` N15.
4. **Profil alimentaire** (aliments évités ou aimés, repas par jour, heures) et **compléments** (N13, alertes caféine), **carte Accueil**, option « cuisiner pour 2 ».
5. Validations en attente : coefficient du jour « moyen » (1,02) et plafond de protéines pour un IMC élevé (nutritionniste) ; crème légère 19431 (bloque 2 recettes) ; recettes jambon/dinde restantes.

## Contraintes
Ne touche ni `src/generator`, `src/zones`, `src/session`. Un seul passage `relecteur` par lot. Avant un envoi : clone propre complet (`npm ci`, `npm run fiches`, `check:securite`, `check:fiches`, `check:recettes`, `npm test`, `npm run build`) puis ok de la session « CI rouge et agents », push, déploiement VERT vérifié par l'API publique. Les agents de contenu sont du travail lourd en quota : n'en lancer qu'à la demande de l'utilisateur.
