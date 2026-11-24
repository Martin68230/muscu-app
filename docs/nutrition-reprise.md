# Nutrition (phase 7) : reprise du chantier (13/11/2026)

Fichier propre à ce chantier ; ne remplace pas `docs/reprendre-ici.md` (le chef de projet y ajoutera une ligne de renvoi).

## État
- FAIT (13/11/2026, aucune ligne de code) : spécification `docs/nutrition-spec.md` (écrans N1-N14, flux, modèle ajouté, pesée hebdo et courbe, adaptation aux séances, recettes, allergènes, substitutions, liste de courses, lots L0-L8) ; `knowledge/nutrition-rules.md` complété (sections A à J, valeurs avec statuts).
- Rédaction par `nutritionniste` ; un passage `relecteur` (sécurité seulement) lancé en fin de chantier : écarts éventuels notés dans la section « Contrôle relecteur » ci-dessous.
- Rien n'est codé, rien n'est poussé (branche `claude/spec-nutrition-eb35f9`).

## Restent PROVISOIRE ou NON SOURCÉ (bloquent le codage de la valeur concernée)
Coefficients et formules de calcul, glucides (ACSM / Burke), lissage du poids, 7700 kcal/kg, plafonds de déficit, de surplus et de prise, planchers kcal, section E (exclusions, seuil d'IMC, dépistage), hydratation, licences (Licence Ouverte 2.0, ODbL) à relire à la source, rendements de cuisson, fiabilité du lien Ciqual-allergènes. À valider : `nutritionniste` puis `relecteur` (lot L0).

## Décisions de l'utilisateur (13/11/2026) : spec §15
Préférences Q1-Q10 tranchées, plancher de calories personnalisé, recettes originales, export pour 2 personnes et IA externe (N15). Reste à confirmer : Q4 (poids visible sur l'Accueil, pris à la lettre) et les seuils de la section E des règles (validation nutritionniste, lot L0).

## Prochaine action exacte
1. FAIT : contrôle `relecteur` ciblé (plancher personnalisé, export N15) : 4 bloquants et 6 réserves, corrigés en une boucle le 13/11 (règle unique du plancher, sexe / âge / taille manquants = Repères seulement, contrôles de la personne 2, modèle d'IA masqué IA coupée, tests d'export étendus). Pas de nouveau passage (CLAUDE.md) ; les corrections sont à re-valider par `nutritionniste` en L0.
2. Lot L0 (ci-dessous).
2. Lot L0 : lever les PROVISOIRE (relire les sources bloquées), `tools/build-aliments.mjs` (Ciqual, version actualisée DOI 10.57745/RDMHWY), table des 14 allergènes, `SCHEMA_VERSION 5`, `src/nutrition/config.ts`.
3. Puis L1 (profil, dépistage, besoins) ; L4 (recettes) peut démarrer en parallèle dès L0, il ne touche pas au code de l'app.

## Contraintes
Ne touche ni `src/generator`, `src/zones`, `src/session` (lecture seule via leurs fonctions). Un seul passage `relecteur` par lot de recettes (allergènes). Avant un envoi : clone propre + contrôles (CLAUDE.md).

## Contrôle relecteur
Passage unique du 13/11/2026 : 4 points bloquants et 6 réserves, tous corrigés dans le spec et les règles en une boucle (pas de second passage, règle CLAUDE.md) :
- Allergènes : vocabulaire `valide` / `a_verifier` / `inconnu` aligné, seuls les `valide` passent dès qu'un allergène est coché.
- Dépistage : liste des questions bloquantes complète (post-partum, hypertension, médicament), 3 sorties (Libre, Prudent ≥ 65 ans, Repères seulement), échec sûr si âge, taille ou sexe manquent ; Repères = recettes sans aucun chiffre.
- Alertes : gel des déficits aligné sur les règles E ; recalage borné à ± 15 % avec apport déclaré ; plafond de rythme selon l'IMC.
- Règles : protéines en déficit 2,2-3,0 g/kg (borne 2,0 retirée), contradiction IMC 18,5-22 levée, caféine 200 mg si grossesse, valeurs non sourcées (poissons gras, 5 fruits et légumes, rendements, standardisation de la pesée) marquées NON SOURCÉES, halal et casher = préférences déclarées.
- Non rouvert par manque d'accès : texte complet EUR-Lex, constantes Mifflin et valeur d'eau (à relire en L0). Le recalage du spec n'a pas été re-relu par un agent : à contrôler en L0.

## État du code (13/11/2026, soir)
- Codé et testé (30 tests, relu par le relecteur, corrections faites) : `src/nutrition/` allergens, config, weight-trend, needs, shopping ; tests `tests/unit/nutrition-*.test.ts`.
- Table Ciqual 2025 (Licence Ouverte 2.0, DOI 10.57745/RDMHWY) téléchargée HORS dépôt dans `../donnees-externes/ciqual-2025/` (4 XML, sommes MD5 vérifiées) : étape suivante `tools/build-aliments.mjs`.
- Demande du 13/11 : courses optimisées (spec §7.6) à coder avec le générateur de plan (lot L5).
- Reste : alertes §5.6 (rythme, saut, gel des déficits), recalage §5.5, jours de la semaine (`day-targets.ts`), recettes, plan, écrans, modèle de données v5 (en attente de feu vert pour toucher `src/data/model.ts`).

## Mise à jour (13/11/2026, soir) : écran Nutrition en ligne après ce lot
- En ligne avant ce lot : modules src/nutrition (calculs, plan, alertes), tables v5, Ciqual (271 ingrédients), outil recettes (15 recettes, 9 publiables). Déploiement #120 vert.
- Ce lot (à pousser) : écran Nutrition (Bibliothèque, entrée en tête) : questionnaire de sécurité, objectif, besoins par jour selon le programme, pesée hebdomadaire, courbe et poids lissé, alertes, recalage ; src/nutrition/store.ts ; captures WebKit tests/screens/nutrition.spec.ts ; liste iPhone docs/nutrition-iphone.md.
- Reste : écrans plan de repas (N10, N11), liste de courses (N12), export N15, profil alimentaire (allergènes, préférences, N5), compléments (N13), carte Accueil, 140 recettes de plus, validation nutritionniste (coefficient « moyen »).

## Mise à jour (14/11/2026) : plan sous la cible, goûter automatique
Retour de l'utilisateur : « c'est quasiment tout le temps SOUS la cible de calories ».
- **Pourquoi** (balayage `tests/unit/nutrition-ecart-cible.test.ts`, 81 profils : 55 à 95 kg, prise / maintien / perte, homme / femme, semaine repos / mixte / légère, 3 graines, vraies recettes Ciqual) : (1) les repas principaux plafonnaient à 750 à 1 136 kcal (portion x1,75) et le petit-déjeuner à 360-720 kcal : aucun jour au-dessus de ~2 800 kcal ; (2) goûter et en-cas désactivés par défaut ; (3) tolérance ±5 % du jour jamais montrée ; (4) glucides : les recettes sont riches en protéines (+20 à +40 g) et courtes en glucides (-50 à -200 g). État mesuré avant : écart moyen -123 kcal par jour (jusqu'à -400 à -800 kcal pour 85-95 kg en prise ou maintien), plancher manqué de quelques kcal quand la cible est au plancher.
- **Correction** : repas principaux au plus x1,3 (`ECHELLE_MAX_PRINCIPAL`, tolérance élargie à 25 % avant de relâcher la variété) ; si le jour manque plus de `SEUIL_ECART_KCAL` = 150 kcal (ou est sous le plancher), un goûter puis un en-cas sont ajoutés (`MealConfig.completerAuto`, vrai par défaut, désactivable, `WeekSlot.auto`) : chaque ajout ≤ 450 kcal (`ENCAS_AUTO_MAX_KCAL`), jamais au-dessus de la cible du jour (sauf pour remonter au plancher, marge 5 %), mêmes filtres durs que le reste (`recipeAllowed`), préférence aux glucides ; `DayCheck.missingKcal` + phrase « Il manque X kcal » si on ne peut pas combler. `NUTRITION_VERSION` = N0.2 (anciens plans à régénérer).
- **Résultat** : écart moyen sur les 81 profils, sans complément -419 kcal (avec la limite x1,3), avec complément -31 kcal ; aucun profil au-delà de -150 kcal en moyenne ; glucides -98 g -> -50 g, protéines -19 g -> -2 g, lipides -3 g -> +9 g.
- **Recettes** : 20 recettes de goûter / en-cas ajoutées dans `knowledge/recettes/collation/` (fruit + laitage, pain + garniture, flocons + lait ou soja, barre du commerce, oléagineux, 2 recettes en LOT : barres de céréales, pains au lait) ; 7 ingrédients ajoutés (yaourt grec, petits-beurre, pain au lait, raisins secs, céréales, lait chocolaté, pruneaux ; Ciqual 2025). Statuts des ingrédients et des recettes : voir `docs/decisions-prises.md` (contrôle relecteur du 14/11/2026).
- **Reste** : validation nutritionniste du seuil 150 kcal, du plafond 450 kcal et du x1,3 (PROVISOIRE) ; test sur l'iPhone (`docs/nutrition-iphone.md`, 11 bis à 11 quater) ; les glucides restent un peu courts (-50 g), à voir avec des recettes plus riches en féculents.

## Mise à jour (20/11/2026) : lot 2, export, profil, rappel (branche nutrition-suite)
- **Recettes** : 54 recettes de plus (16 petits-déjeuners, 28 déjeuners / dîners, 10 goûters), 8 ingrédients validés (relecteur : aucun bloquant ; cuissons « bien cuit à cœur » ajoutées). 129 recettes publiables au total.
- **Export N15** : `src/nutrition/export-plan.ts` + carte « Exporter mes repas » (onglet Semaine) : jours, courses, recettes, cibles, exclusions, personne 2 (refus sous 1 200 kcal, alerte sous 1 500, macros plausibles, conflits d'allergènes listés), texte à copier ou fichier JSON, modèle IA masqué IA coupée. Jamais de poids, IMC, objectif, déficit, dépistage (test).
- **Profil alimentaire** : aliments exclus (recherche + puces) dans « Repas, allergies et préférences » ; allergies, régime, matériel existaient déjà.
- **Rappel de pesée** : carte au-dessus des onglets Nutrition (jour de pesée atteint, aucune pesée cette semaine) ; la courbe vers l'objectif existait (ligne du poids cible).
- Reste : captures WebKit de l'export, suite complète (attend « machine libre »), `cajou-raisins-yaourt` encore en brouillon (noix de cajou non relue).

## Mise à jour (24/11/2026) : semaine validée, calendrier, changements (branche nutrition-semaine)
Retour de l'utilisateur : « la nutrition ne garde pas en mémoire la bouffe de la semaine… pouvoir l'ajouter au CALENDRIER comme HISTORIQUE, et CHOISIR de changer un aliment ou un repas avant ou après ».
- **Données** : `SCHEMA_VERSION` 6, `DB_VERSION` 6. Migration additive : table `mealLogs` (fait / pas fait / écart par jour et par repas) et champs facultatifs de `mealPlans` (`status` brouillon|valide, `confirmedAt`, `locks`, `previous` = un niveau d'annulation). Aucune donnée existante touchée (test v5 -> v6). Export / import et « Tout supprimer » les incluent.
- **Persistance** : le plan est enregistré à la génération (`saveGeneratedPlan`) et relu à l'ouverture ; une génération n'écrase jamais une semaine validée (`rouvrir` d'abord) ; « Régénérer » demande confirmation et garde les repas verrouillés.
- **Code** : `week-edit.ts` (changer repas / aliment, verrous, recalcul complet `assembleWeek`, contrôles `foodUsable` / `slotUsable`), `meals-calendar.ts` (repas du jour, totaux, historique), `week-plan.ts` (`fixed` = repas verrouillés, `imposed` = repas imposés, `swaps`, `composeSlot`). Écrans : `NutritionPlanView`, `NutritionMeals` (Accueil, calendrier, historique), `NutritionHistory`, `DaySheet` (fiche de journée du calendrier).
- **Sécurité** : une alternative de repas passe `recipeAllowed` ; un aliment remplacé passe `foodUsable` (allergènes `valide` seulement dès qu'un allergène / régime est coché, régime, aliments exclus, mots exclus) ; ses allergènes sont ajoutés à ceux du repas et à l'export ; un repas ou un verrou devenu interdit est signalé « À changer » et jamais conservé à la régénération ; validation refusée s'il en reste ou si un jour est sous le plancher. La cible finale (`final-needs.ts`) n'est pas modifiée : alternatives à ±10 % des kcal du repas, jour recalculé contre la même cible.
- **Reste / à décider** : l'écart « mangé » ne modifie pas les cibles ni le plan ; pas de passage `relecteur` encore lancé (allergènes / plancher touchés par les substitutions : à faire sur ce lot).
- **Courses mémorisées (même jour)** : `ShoppingListCard` (Semaine et Historique) : coches enregistrées à chaque geste par produit (un repas changé garde les lignes déjà cochées), lignes ajoutées, lignes retirées / remises, « Tout décocher », « Mes courses » (bouton toujours visible), jour des courses (réglage `mealConfig.shoppingDay`, carte d'Accueil), historique avec « Refaire cette semaine » (copie en brouillon, jamais sur une semaine validée) et « Reprendre les mêmes courses ».
- **Relecteur (1 passage, 24/11)** : aucun bloquant ; réserves corrigées : allergènes des aliments remplacés relus dans le catalogue (`normalizePlan`), plancher recalculé avant « Valider », échec sûr tant que le catalogue n'est pas chargé. Non traité : `fixedPick` ne revérifie pas les swaps (l'appelant `usableFixed` le fait ; seul appelant). Écran de test `phase0.spec` « profil matériel » (poids des haltères) échoue : sans lien avec ce lot, à vérifier côté matériel.
