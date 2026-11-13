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
