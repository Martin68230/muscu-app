---
id: developpe-couche-prise-serree-barre
nom: Développé couché prise serrée
alias: [close-grip bench press]
schema: poussee_h
type: force
niveau_min: intermediaire
muscles_principaux: [triceps]
muscles_secondaires: [pectoraux, deltoides_anterieurs]
source_brouillon: []
couverture: substitut
statut: brouillon_coach
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| developpe-couche-prise-serree-barre-ez | Barre EZ, prise serrée | 1 | intermediaire | barre_ez, disques, rack, banc | Même installation que le développé couché ; barre EZ, mains à la largeur des épaules sur les parties incurvées, coudes près du buste. |
| developpe-couche-prise-serree-barre-droite | Barre droite, prise serrée | 1 | intermediaire | barre, disques, rack, banc | Barre droite, mains à la largeur des épaules (pas plus serrées), coudes près du buste. |

## Consignes
1. Règle le rack comme pour le développé couché : barres de sécurité juste au-dessus de la poitrine, testées à vide.
2. Allonge-toi, omoplates serrées ; prends la barre à la largeur des épaules (pas plus serré), pouces autour.
3. Sors la barre bras tendus et descends-la lentement vers le bas de la poitrine, coudes près du buste.
4. Pousse jusqu'aux bras tendus sans verrouiller.
5. Replace la barre sur les supports en la guidant vers l'arrière.

## Points d'attention
- Prise à la largeur des épaules : plus serré charge fortement les poignets.
- Les coudes restent près du corps pour solliciter les triceps.
- Charge plus légère qu'au développé couché à prise normale.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Mains trop proches (poignets en mauvaise position).
- Coudes écartés.
- Rebond sur la poitrine.
- Pouce du même côté que les doigts.

## Progression / régression
- plus-facile : developpe-couche-barre, dips-banc-triceps
- plus-dur : aucun

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE) : développé prise serrée (exercice d'appoint pour les triceps) : muscle 8 à 12 répétitions (10 à 12 pour un débutant), 2 à 3 séries, 2 à 3 répétitions en réserve, repos 90 s ; force : 8 à 12 répétitions pour les exercices d'appoint. Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. Étalonnage (load-calibration.md) : première séance avec la charge la plus légère disponible, puis montée par petits paliers réels de disques ; double progression. **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24 (proposition prudente, **à compléter et corriger par `kine`**). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | garder | adapter: charge:legere | retirer |
| Épaule | adapter: amplitude:reduite | retirer | retirer |
| Coude | adapter: charge:legere | retirer | retirer |
| Poignet | adapter: charge:legere | retirer | retirer |
| Genou | garder | garder | retirer: sans-zone:developpe-couche-prise-serree-barre-ez |
| Hanche | garder | garder | retirer: sans-zone:developpe-couche-prise-serree-barre-ez |
| Cheville | garder | garder | retirer: sans-zone:developpe-couche-prise-serree-barre-ez |
| Cou | garder | adapter: charge:legere | retirer |

**Notes**
- coude-n1 : les triceps travaillent fort : charge légère.
- coude-n2 : coudes sensibles : retiré.
- poignet-n1 : barre EZ de préférence (angle plus doux).
- epaule-n1 : descends moins bas.
- epaule-n2 : retiré (le remplaçant serait adapté par la même zone).
- grossesse : couché sur le dos avec une barre au-dessus de la poitrine : retiré (G4) ; remplaçant : extension triceps assis aux haltères, charge légère. Post-partum : G7.

**Grossesse** : retirer: remplacant:extension-triceps-assis-halteres
**Version plus douce** : extension-triceps-assis-halteres

**Sécurité pour l'utilisateur seul**
- Barres de sécurité (ou goujons) du rack réglées juste au-dessus de ta poitrine (assez haut pour pouvoir te dégager, assez bas pour que la barre ne t'écrase pas), **testées à vide avant la première série**.
- Pas de rack avec sécurités = pas de développé couché chargé seul (utilise le développé couché aux haltères, qui se pose sur les cuisses).
- Colliers de serrage des deux côtés ; pas de pouce du même côté que les doigts (« prise de singe ») : le pouce entoure la barre.
- Pas d'échec : arrête avec au moins 2 répétitions en réserve ; un partenaire peut aider mais ne remplace pas les barres de sécurité.
- Si la barre ralentit et ne remonte plus : redescends-la sur la poitrine en contrôle puis pose-la sur les barres de sécurité et dégage-toi (ne la bascule jamais d'un seul côté).

**Points d'attention (kine)**
- À rédiger et corriger par `kine` (étape suivante du cycle). Points de départ proposés par coach : voir « Sécurité pour l'utilisateur seul » ci-dessus et les notes par zone.
- Poignet et coude en priorité (prise serrée).
- Même règle de sécurité que le développé couché.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au coude, au poignet ou à l'épaule.
- Barre qui part de travers, disque qui glisse ou collier qui bouge : repose la barre (sur le rack ou au sol) avant tout.
- Perte de contrôle de la barre ou impression que tu ne pourras pas finir la répétition : arrête la série, ne force pas.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Douleur à l'intérieur du coude ou du poignet.

**Objets du quotidien**
- - Barre et disques : colliers de serrage (clips) posés et serrés des deux côtés avant chaque série ; mêmes disques de chaque côté ; barre droite (ni tordue, ni jeu dans les manchons) ; disques jamais posés « sans collier » même pour une série légère.
- - Rack ou cage à squat : stable (fixé, lesté ou contre un mur), supports de barre réglés à la bonne hauteur et bloqués ; **barres de sécurité (ou goujons) réglées AVANT la première série et testées à vide** : la barre doit pouvoir se poser dessus sans que tu sois écrasé. Pas de rack = pas de cette variante (le tag `rack` est obligatoire).
- - Banc : 4 appuis au sol, qui ne bascule pas et ne glisse pas (sol non glissant, banc calé si besoin), vis, pieds et réglage en bon état ; avant la première série, appuie-toi dessus comme pendant l'exercice : s'il bouge, grince ou se plie, ne l'utilise pas. Un canapé, un lit ou une caisse ne remplacent pas un banc.
- - Sol plat, sec, non glissant (planches ou tapis de salle fermes) ; chaussures fermées à semelle plate ou rigide ; espace libre autour de la barre, rien derrière toi ; jamais de pieds nus avec une barre chargée.

## Photo
- `Close-Grip_EZ-Bar_Press/0.jpg` : affichable : à vérifier (candidat free-exercise-db non vu ; WebP à créer par dev ; vérifier)
- `Close-Grip_EZ-Bar_Press/1.jpg` : affichable : à vérifier (candidat free-exercise-db non vu ; WebP à créer par dev ; idem)
- `Close-Grip_Barbell_Bench_Press/0.jpg` : affichable : à vérifier (candidat free-exercise-db non vu ; WebP à créer par dev ; variante barre droite ; vérifier)
- `Close-Grip_Barbell_Bench_Press/1.jpg` : affichable : à vérifier (candidat free-exercise-db non vu ; WebP à créer par dev ; idem)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet de la barre, consignes de départ) : Close-Grip_EZ-Bar_Press, Close-Grip_Barbell_Bench_Press | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db ; fichier dist/exercises.json relu le 2026-10-24 pour vérifier l'existence de l'entrée, son niveau et son matériel ; consignes réécrites par coach | base d'exercices (pratique, pas une étude) | 2026-10-24 | PROVISOIRE |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Colliers de serrage, barres de sécurité du rack réglées et testées, installation seul, objets du quotidien | regles-securite-communes.md §7 et R8 ; pratique de salle, raisonnement mécanique de coach | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul (barre lourde) | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul avec une barre est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Zones de blessures les plus fréquentes chez les haltérophiles et les pratiquants de force athlétique (colonne, épaule, genou) : justifie un tableau complet par zone | Aasa et coll., Br J Sports Med 2017;51(4):211-219, https://pubmed.ncbi.nlm.nih.gov/27707741/ ; revue systématique de 9 études, la plupart de faible qualité ; résumé lu via moteur de recherche | revue systématique, athlètes de compétition, qualité faible ; ne concerne pas les pratiquants de loisir | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (à compléter par kine puis contrôler par relecteur) |
| Grossesse et post-partum : barre chargée retirée par prudence (équilibre, apnée, chute de la barre) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas la barre chargée | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, à valider par kine) |
| Prise plus large au développé couché : charges plus lourdes, plus d'activité du biceps, moins du triceps ; prise étroite : charges plus faibles, plus de triceps (28 hommes, 6 répétitions maximum) | Saeterbakken et coll., Int J Environ Res Public Health 2021, https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8296276/ ; résumé lu via moteur de recherche, texte complet non lu | étude de laboratoire, 28 hommes (novices et entraînés), EMG ; ne porte pas sur la sécurité de l'épaule | 2026-10-24 | PROVISOIRE (résumé seulement) |
