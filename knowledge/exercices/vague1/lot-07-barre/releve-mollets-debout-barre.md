---
id: releve-mollets-debout-barre
nom: Montée sur pointes debout à la barre
alias: [standing calf raise barre]
schema: cheville_mollet
type: force
niveau_min: debutant
muscles_principaux: [mollets]
muscles_secondaires: []
source_brouillon: []
statut: brouillon_coach
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| releve-mollets-debout-barre-sol | Pieds à plat sur le sol | 1 | debutant | barre, disques, rack | Barre sur le haut du dos comme au squat, sortie du rack, pieds à largeur du bassin, plats au sol ; barres de sécurité du rack réglées. |
| releve-mollets-debout-barre-plateforme | Pointes sur une plateforme basse | 2 | intermediaire | barre, disques, rack, box_ou_step | Même installation, pointes de pied sur une plateforme basse, large et antidérapante, au centre du rack ; talons dans le vide (amplitude plus grande). |

## Consignes
1. Règle le rack comme pour un squat (barres de sécurité testées) ; sors la barre du rack en la posant sur le haut du dos et recule d'un pas, pieds à la largeur du bassin.
2. Monte sur la pointe des pieds le plus haut possible, genoux tendus mais pas verrouillés.
3. Marque un court arrêt en haut, sans balancer le buste.
4. Redescends lentement jusqu'à sentir l'étirement des mollets (talons en bas ; dans le vide si plateforme).
5. Fin de série : repose la barre sur les supports du rack.

## Points d'attention
- Charge assez légère pour sortir la barre du rack sans effort ; le mouvement reste lent, sans rebond.
- Sur plateforme : reste au centre du rack, plateforme large et stable ; sinon, pieds à plat.
- Pose les pieds toujours à la même largeur et dans la même direction (pointes un peu ouvertes ou droit).
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Rebondir.
- Plier les genoux.
- Amplitude réduite.
- Perdre l'équilibre sur la plateforme.

## Progression / régression
- plus-facile : releve-mollets, releve-mollets-halteres
- plus-dur : aucun

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE) : exercice « autre » (non pilier) : cheville et mollet : 10 à 15 répétitions, 2 à 3 séries, 2 à 3 répétitions en réserve, repos 90 s ; ces valeurs viennent de la ligne « hanche_laterale, cheville_mollet » du tableau du générateur. Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. Étalonnage (load-calibration.md) : première séance avec la charge la plus légère disponible, puis montée par petits paliers réels de disques ; double progression. **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24 (proposition prudente, **à compléter et corriger par `kine`**). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: charge:legere | retirer: remplacant:releve-mollets | retirer |
| Épaule | garder | adapter: charge:legere | retirer |
| Coude | garder | garder | retirer |
| Poignet | garder | garder | retirer |
| Genou | garder | adapter: charge:legere | retirer |
| Hanche | garder | garder | retirer: sans-zone:releve-mollets-debout-barre-sol |
| Cheville | adapter: charge:legere | adapter: variante:releve-mollets-debout-barre-sol | retirer |
| Cou | garder | adapter: charge:legere | retirer |

**Notes**
- cheville-n1 : charge légère.
- cheville-n2 : pieds à plat au sol (amplitude réduite).
- dos-n2 : barre sur le dos : retiré ; remplaçant relevé de mollets sans barre.
- grossesse : barre sur le dos et équilibre : retiré par prudence (NON SOURCÉ) ; remplaçant : relevé de mollets sans barre (près d'un mur). Post-partum : G7.

**Grossesse** : retirer: remplacant:releve-mollets
**Version plus douce** : releve-mollets

**Sécurité pour l'utilisateur seul**
- Barres de sécurité du rack réglées, testées à vide ; plateforme loin des bords du rack.
- Perte d'équilibre : repose les pieds à plat, pose la barre sur les supports du rack.
- Colliers des deux côtés ; pas d'échec.

**Points d'attention (kine)**
- À rédiger et corriger par `kine` (étape suivante du cycle). Points de départ proposés par coach : voir « Sécurité pour l'utilisateur seul » ci-dessus et les notes par zone.
- Cheville et dos ; plateforme : à valider (risque de chute avec barre sur le dos).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente à la cheville, au mollet ou au bas du dos.
- Barre qui part de travers, disque qui glisse ou collier qui bouge : repose la barre (sur le rack ou au sol) avant tout.
- Perte de contrôle de la barre ou impression que tu ne pourras pas finir la répétition : arrête la série, ne force pas.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Crampe au mollet.
- Perte d'équilibre.

**Objets du quotidien**
- - Barre et disques : colliers de serrage (clips) posés et serrés des deux côtés avant chaque série ; mêmes disques de chaque côté ; barre droite (ni tordue, ni jeu dans les manchons) ; disques jamais posés « sans collier » même pour une série légère.
- - Rack ou cage à squat : stable (fixé, lesté ou contre un mur), supports de barre réglés à la bonne hauteur et bloqués ; **barres de sécurité (ou goujons) réglées AVANT la première série et testées à vide** : la barre doit pouvoir se poser dessus sans que tu sois écrasé. Pas de rack = pas de cette variante (le tag `rack` est obligatoire).
- Plateforme (box ou step) : large, antidérapante, stable ; jamais une marche d'escalier avec une barre sur le dos.
- - Sol plat, sec, non glissant (planches ou tapis de salle fermes) ; chaussures fermées à semelle plate ou rigide ; espace libre autour de la barre, rien derrière toi ; jamais de pieds nus avec une barre chargée.

## Photo
- `Standing_Barbell_Calf_Raise/0.jpg` : affichable : à vérifier (candidat free-exercise-db non vu ; WebP à créer par dev ; vérifier : plateforme ? logo à recadrer)
- `Standing_Barbell_Calf_Raise/1.jpg` : affichable : à vérifier (candidat free-exercise-db non vu ; WebP à créer par dev ; idem)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet de la barre, consignes de départ) : Standing_Barbell_Calf_Raise (niveau « beginner » dans la base) | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db ; fichier dist/exercises.json relu le 2026-10-24 pour vérifier l'existence de l'entrée, son niveau et son matériel ; consignes réécrites par coach | base d'exercices (pratique, pas une étude) | 2026-10-24 | PROVISOIRE |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Colliers de serrage, barres de sécurité du rack réglées et testées, installation seul, objets du quotidien | regles-securite-communes.md §7 et R8 ; pratique de salle, raisonnement mécanique de coach | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul (barre lourde) | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul avec une barre est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Zones de blessures les plus fréquentes chez les haltérophiles et les pratiquants de force athlétique (colonne, épaule, genou) : justifie un tableau complet par zone | Aasa et coll., Br J Sports Med 2017;51(4):211-219, https://pubmed.ncbi.nlm.nih.gov/27707741/ ; revue systématique de 9 études, la plupart de faible qualité ; résumé lu via moteur de recherche | revue systématique, athlètes de compétition, qualité faible ; ne concerne pas les pratiquants de loisir | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (à compléter par kine puis contrôler par relecteur) |
| Grossesse et post-partum : barre chargée retirée par prudence (équilibre, apnée, chute de la barre) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas la barre chargée | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, à valider par kine) |
| Amplitude complète conseillée pour la croissance musculaire | Schoenfeld et Grgic, SAGE Open Med 2020;8, https://pmc.ncbi.nlm.nih.gov/articles/PMC6977096 ; revue systématique de 6 études (4 sur le bas du corps, 2 sur le haut) ; résumé lu via moteur de recherche | revue systématique ; pour le haut du corps : données limitées et contradictoires | 2026-10-24 | PROVISOIRE (résumé seulement) |
