---
id: shrug-barre
nom: Haussement d'épaules à la barre
alias: [shrug, shrugs]
schema: tirage_h
type: force
niveau_min: debutant
muscles_principaux: [trapezes]
muscles_secondaires: [avant_bras, rhomboides]
source_brouillon: []
couverture: substitut
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| shrug-barre-rack | Barre prise au rack | 1 | debutant | barre, disques, rack | Barre posée sur les supports à hauteur de cuisses ; tu la prends et tu recules d'un pas, bras tendus. |
| shrug-barre-sol | Barre reprise du sol | 2 | intermediaire | barre, disques | Barre au sol, soulevée comme un soulevé de terre léger jusqu'à debout ; bras tendus devant les cuisses. |

## Consignes
1. Debout, pieds à la largeur du bassin, barre tenue devant les cuisses à la largeur des épaules, bras tendus, dos droit.
2. Hausse les épaules droit vers les oreilles, sans plier les coudes ni faire rouler les épaules.
3. Marque un court arrêt en haut, menton parallèle au sol.
4. Redescends lentement les épaules jusqu'à l'étirement léger.
5. Fin de série : repose la barre sur le rack ou au sol, genoux fléchis.

## Points d'attention
- Mouvement vertical simple : pas de rotation des épaules.
- Charge modérée ; la prise peut limiter avant les trapèzes.
- Version au rack : pas besoin de soulever la barre du sol.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Plier les coudes.
- Rouler les épaules (cercles).
- Rejeter la tête en arrière.
- Charge trop lourde pour la prise.

## Progression / régression
- plus-facile : aucun
- plus-dur : aucun

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE) : exercice « autre » (non pilier) : muscle 8 à 12 répétitions (10 à 12 pour un débutant), 2 à 3 séries, 2 à 3 répétitions en réserve, repos 90 s ; force : 8 à 12 répétitions pour les exercices d'appoint. Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. Étalonnage (load-calibration.md) : première séance avec la charge la plus légère disponible, puis montée par petits paliers réels de disques ; double progression. **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24, repris et corrigé par `kine` le 2026-10-24 (à contrôler par `relecteur`). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: variante:shrug-barre-rack | adapter: variante:shrug-barre-rack | retirer |
| Épaule | garder | adapter: charge:legere | retirer |
| Coude | garder | garder | retirer |
| Poignet | garder | adapter: charge:legere | retirer |
| Genou | garder | garder | retirer |
| Hanche | garder | garder | retirer |
| Cheville | garder | garder | retirer |
| Cou | adapter: amplitude:reduite | retirer | retirer |

**Notes**
- general : La barre seule pèse souvent 20 kg (parfois moins) : c'est déjà une charge. Si elle est trop lourde pour garder le geste propre, passe à la version aux haltères (NON SOURCÉ ; question Q12 de docs/QUESTIONS.md).
- general : la reprise du sol (échelon 2) demande de soulever la barre comme un soulevé de terre : elle est intermédiaire ; le débutant reste à la barre prise au rack.
- cou-n1 : amplitude réduite, tête alignée.
- cou-n2 : les trapèzes s'attachent au cou et la charge tire dessus : retiré (choix prudent NON SOURCÉ).
- dos-n1 : barre prise au rack, sans reprise du sol.
- dos-n2 : barre prise au rack, charge qui ne monte pas (R2).
- genou-n3 : debout avec une barre chargée, la charge passe par les jambes : la variante sollicite la zone, retirée (pas de variante sans-zone ; règle R3 de regles-securite-communes.md).
- hanche-n3 : debout avec une barre chargée, la charge passe par les jambes : la variante sollicite la zone, retirée (pas de variante sans-zone ; règle R3 de regles-securite-communes.md).
- cheville-n3 : debout avec une barre chargée, la charge passe par les jambes : la variante sollicite la zone, retirée (pas de variante sans-zone ; règle R3 de regles-securite-communes.md).
- grossesse : kine retire la proposition de coach (charge légère) : la barre droite pèse souvent 20 kg, plus que ce qu'un étalonnage léger donne (NON SOURCÉ) ; aucun remplaçant fixe (le générateur choisit un autre exercice du schéma). Post-partum : G7.

**Grossesse** : retirer
**Version plus douce** : aucune

**Sécurité pour l'utilisateur seul**
- Au rack (échelon 1) : supports bloqués à hauteur de cuisses, barre qui ne glisse pas ; reviens poser la barre sur les supports à la fin de la série.
- Reprise du sol (échelon 2) : mêmes règles que le soulevé de terre : dos naturellement droit au décollage, barre collée aux jambes, chaussures plates.
- Colliers de serrage posés et serrés des deux côtés avant chaque série, mêmes disques de chaque côté (un disque qui glisse fait basculer la barre).
- Pas d'échec : arrête la série avec au moins 2 répétitions en réserve ; si la barre ralentit nettement ou si la technique se dégrade, la série est finie. En cas de doute sur la charge, prends plus léger.
- Idéalement, quelqu'un dans la maison ou la salle, à portée de voix. Un partenaire peut aider, mais il ne remplace jamais les barres de sécurité.

**Points d'attention (kine)**
- Cou : les trapèzes s'attachent au cou, la charge tire sur la région cervicale. Amplitude réduite dès une gêne légère, retiré dès une gêne nette.
- Épaule : mouvement vertical simple, sans rotation des épaules ; ne hausse pas les épaules avec les coudes pliés.
- Poignet et avant-bras : la prise peut limiter avant les trapèzes ; pas de sangles proposées. Charge assez légère pour tenir sans que la barre glisse.
- Dos : debout, dos naturellement droit ; la barre prise au rack évite de soulever du sol.
- Niveau : débutant pour la barre prise au rack ; la reprise du sol est intermédiaire.
- Grossesse : retiré.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au cou, à l'épaule ou au bas du dos.
- Barre qui part de travers, disque qui glisse ou collier qui bouge : repose la barre (sur le rack ou au sol) avant tout.
- Perte de contrôle de la barre ou impression que tu ne pourras pas finir la répétition : arrête la série, ne force pas.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Picotements dans les bras.
- Voile devant les yeux, vertige ou tête qui tourne en fin de série (souvent un blocage de la respiration) : repose la barre, assieds-toi, ne reprends pas la séance (R5).
- Colliers qui bougent ou disques de travers : repose la barre avant tout.
- Douleur, fourmillements ou engourdissement dans le cou, l'épaule ou le bras : arrête (S2).
- Barre qui glisse des mains : pose-la.

**Objets du quotidien**
- Barre et disques : colliers de serrage (clips) posés et serrés des deux côtés avant chaque série ; mêmes disques de chaque côté ; barre droite (ni tordue, ni jeu dans les manchons) ; disques jamais posés « sans collier » même pour une série légère.
- Rack ou cage à squat : stable (fixé, lesté ou contre un mur), supports de barre réglés à la bonne hauteur et bloqués ; **barres de sécurité (ou goujons) réglées AVANT la première série et testées à vide** : la barre doit pouvoir se poser dessus sans que tu sois écrasé. Pas de rack = pas de cette variante (le tag `rack` est obligatoire).
- Sol plat, sec, non glissant (planches ou tapis de salle fermes) ; chaussures fermées à semelle plate ou rigide ; espace libre autour de la barre, rien derrière toi ; jamais de pieds nus avec une barre chargée.

## Photo
- `Barbell_Shrug/0.jpg` : affichable : oui (barre au rack (échelon 1), épaules qui montent ; zones floutées sur des logos de rack ; vue le 24/10/2026)
- `Barbell_Shrug/1.jpg` : affichable : oui (barre au rack (échelon 1), épaules qui montent ; zones floutées sur des logos de rack ; vue le 24/10/2026)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet de la barre, consignes de départ) : Barbell_Shrug | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db ; fichier dist/exercises.json relu le 2026-10-24 pour vérifier l'existence de l'entrée, son niveau et son matériel ; consignes réécrites par coach | base d'exercices (pratique, pas une étude) | 2026-10-24 | PROVISOIRE |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Colliers de serrage, barres de sécurité du rack réglées et testées, installation seul, objets du quotidien | regles-securite-communes.md §7 et R8 ; pratique de salle, raisonnement mécanique de coach | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul (barre lourde) | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul avec une barre est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Zones de blessures les plus fréquentes chez les haltérophiles et les pratiquants de force athlétique (colonne, épaule, genou) : justifie un tableau complet par zone | Aasa et coll., Br J Sports Med 2017;51(4):211-219, https://pubmed.ncbi.nlm.nih.gov/27707741/ ; revue systématique de 9 études, la plupart de faible qualité ; résumé lu via moteur de recherche | revue systématique, athlètes de compétition, qualité faible ; ne concerne pas les pratiquants de loisir | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 24/10/2026, à contrôler par relecteur) |
| Grossesse et post-partum : barre chargée retirée par prudence (équilibre, apnée, chute de la barre) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas la barre chargée | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, confirmée par kine le 24/10/2026 comme choix prudent, à contrôler par relecteur) |
| Haussement d'épaules à la barre : mouvement de base des trapèzes | free-exercise-db seulement ; aucune étude lue | - | 2026-10-24 | NON SOURCÉ |
| Niveau minimum, barres de sécurité et repli en cas de blocage, colliers, pas d'échec seul, cases par zone et par niveau, grossesse, remplaçants, points d'attention (kine) | Raisonnement de `kine` à partir des règles communes (regles-securite-communes.md) et des études déjà citées dans cette fiche (résumés seulement). Aucune source nouvelle lue pour cette passe ; aucune étude ne teste ces choix exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (choix prudents de kine, à contrôler par relecteur) |
