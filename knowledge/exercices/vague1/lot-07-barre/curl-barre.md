---
id: curl-barre
nom: Curl à la barre
alias: [barbell curl, curl barre EZ]
schema: tirage_h
type: force
niveau_min: debutant
muscles_principaux: [biceps]
muscles_secondaires: [avant_bras]
source_brouillon: []
couverture: substitut
statut: brouillon_coach
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| curl-barre-ez | Barre EZ | 1 | debutant | barre_ez, disques | Debout, barre EZ tenue sur les parties incurvées, paumes vers le haut, bras le long du corps. |
| curl-barre-droite | Barre droite | 1 | debutant | barre, disques | Debout, barre droite à la largeur des épaules, paumes vers le haut, bras le long du corps. |

## Consignes
1. Debout, pieds à largeur du bassin, genoux légèrement fléchis, barre tenue devant les cuisses, paumes vers le haut, bras tendus.
2. Plie les coudes pour monter la barre vers les épaules, coudes contre le corps.
3. Marque un court arrêt en haut sans cambrer le dos.
4. Redescends lentement jusqu'à presque tendre les bras.
5. Fin de série : repose la barre au sol, genoux fléchis.

## Points d'attention
- Les coudes restent près du corps ; le dos ne balance pas.
- La barre EZ est plus douce pour les poignets que la barre droite.
- Charge légère à moyenne : un curl ne se fait pas en élan.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Balancer le buste pour monter la barre.
- Coudes qui partent vers l'avant.
- Poignets cassés.
- Descente trop rapide.

## Progression / régression
- plus-facile : aucun
- plus-dur : aucun

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE) : exercice « autre » (non pilier) : muscle 8 à 12 répétitions (10 à 12 pour un débutant), 2 à 3 séries, 2 à 3 répétitions en réserve, repos 90 s ; force : 8 à 12 répétitions pour les exercices d'appoint. Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. Étalonnage (load-calibration.md) : première séance avec la charge la plus légère disponible, puis montée par petits paliers réels de disques ; double progression. **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24 (proposition prudente, **à compléter et corriger par `kine`**). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | garder | adapter: charge:legere | retirer |
| Épaule | garder | adapter: charge:legere | retirer |
| Coude | adapter: charge:legere | retirer | retirer |
| Poignet | adapter: variante:curl-barre-ez | adapter: charge:legere | retirer |
| Genou | garder | garder | retirer: sans-zone:curl-barre-ez |
| Hanche | garder | garder | retirer: sans-zone:curl-barre-ez |
| Cheville | garder | garder | retirer: sans-zone:curl-barre-ez |
| Cou | garder | adapter: charge:legere | retirer |

**Notes**
- poignet-n1 : barre EZ à la place de la barre droite.
- coude-n1 : charge légère ; descente lente.
- coude-n2 : retiré.
- grossesse : debout avec une charge légère : adapter (charge légère, respiration continue) ; la version incline est écartée par prudence (position semi-allongée). Post-partum : G7.

**Grossesse** : adapter: charge:legere
**Version plus douce** : aucune

**Sécurité pour l'utilisateur seul**
- Pose la barre au sol, genoux fléchis, dos plat ; ne la lâche pas de haut.
- Colliers des deux côtés ; pas d'élan du dos.

**Points d'attention (kine)**
- À rédiger et corriger par `kine` (étape suivante du cycle). Points de départ proposés par coach : voir « Sécurité pour l'utilisateur seul » ci-dessus et les notes par zone.
- Coude et poignet en priorité ; version plus douce à valider (aucune solution simple : curl incliné écarté en grossesse).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au coude, au poignet ou au bas du dos.
- Barre qui part de travers, disque qui glisse ou collier qui bouge : repose la barre (sur le rack ou au sol) avant tout.
- Perte de contrôle de la barre ou impression que tu ne pourras pas finir la répétition : arrête la série, ne force pas.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- - Barre et disques : colliers de serrage (clips) posés et serrés des deux côtés avant chaque série ; mêmes disques de chaque côté ; barre droite ou EZ (ni tordue, ni jeu dans les manchons) ; disques jamais posés « sans collier » même pour une série légère.
- - Sol plat, sec, non glissant (planches ou tapis de salle fermes) ; chaussures fermées à semelle plate ou rigide ; espace libre autour de la barre, rien derrière toi ; jamais de pieds nus avec une barre chargée.

## Photo
- `EZ-Bar_Curl/0.jpg` : affichable : à vérifier (candidat free-exercise-db non vu ; WebP à créer par dev ; variante barre EZ ; vérifier)
- `EZ-Bar_Curl/1.jpg` : affichable : à vérifier (candidat free-exercise-db non vu ; WebP à créer par dev ; idem)
- `Barbell_Curl/0.jpg` : affichable : à vérifier (candidat free-exercise-db non vu ; WebP à créer par dev ; variante barre droite ; vérifier)
- `Barbell_Curl/1.jpg` : affichable : à vérifier (candidat free-exercise-db non vu ; WebP à créer par dev ; idem)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet de la barre, consignes de départ) : EZ-Bar_Curl, Barbell_Curl | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db ; fichier dist/exercises.json relu le 2026-10-24 pour vérifier l'existence de l'entrée, son niveau et son matériel ; consignes réécrites par coach | base d'exercices (pratique, pas une étude) | 2026-10-24 | PROVISOIRE |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Colliers de serrage, barres de sécurité du rack réglées et testées, installation seul, objets du quotidien | regles-securite-communes.md §7 et R8 ; pratique de salle, raisonnement mécanique de coach | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul (barre lourde) | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul avec une barre est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Zones de blessures les plus fréquentes chez les haltérophiles et les pratiquants de force athlétique (colonne, épaule, genou) : justifie un tableau complet par zone | Aasa et coll., Br J Sports Med 2017;51(4):211-219, https://pubmed.ncbi.nlm.nih.gov/27707741/ ; revue systématique de 9 études, la plupart de faible qualité ; résumé lu via moteur de recherche | revue systématique, athlètes de compétition, qualité faible ; ne concerne pas les pratiquants de loisir | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (à compléter par kine puis contrôler par relecteur) |
| Grossesse et post-partum : barre chargée retirée par prudence (équilibre, apnée, chute de la barre) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas la barre chargée | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, à valider par kine) |
| Amplitude complète conseillée pour la croissance musculaire | Schoenfeld et Grgic, SAGE Open Med 2020;8, https://pmc.ncbi.nlm.nih.gov/articles/PMC6977096 ; revue systématique de 6 études (4 sur le bas du corps, 2 sur le haut) ; résumé lu via moteur de recherche | revue systématique ; pour le haut du corps : données limitées et contradictoires | 2026-10-24 | PROVISOIRE (résumé seulement) |
