---
id: rowing-buste-penche-halteres
nom: Rowing buste penché aux haltères
schema: tirage_h
type: force
niveau_min: debutant
muscles_principaux: [grand_dorsal, rhomboides, trapezes]
muscles_secondaires: [biceps, deltoides_posterieurs, erecteurs_rachis, ischios]
source_brouillon: [M0407, M0404]
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| rowing-penche-paumes-arriere | Paumes vers l'arrière | 1 | debutant | halteres | Debout, un haltère dans chaque main. |
| rowing-penche-paumes-face | Paumes face à face | 1 | debutant | halteres | Même installation, paumes tournées l'une vers l'autre. |

## Consignes
1. Debout, genoux souples, haltères en main.
2. Penche le buste en avant depuis les hanches, dos plat.
3. Les haltères pendent sous les épaules.
4. Tire les deux haltères vers les côtés du ventre, coudes près du corps.
5. Serre les omoplates en haut, puis redescends lentement.

## Points d'attention
- Dos plat pendant toute la série.
- Le buste ne se relève pas à chaque répétition.
- Nuque dans l'alignement du dos.
- Si le bas du dos fatigue, prends le rowing à un bras avec appui.

## Erreurs fréquentes
- Dos qui s'arrondit.
- Se redresser pour donner de l'élan.
- Hausser les épaules vers les oreilles.

## Progression / régression
- plus-facile : rowing-unilateral-haltere
- plus-dur : aucun
rowing-unilateral-haltere <- **rowing-buste-penche-halteres**

## Repères de dosage
Voir program-logic.md.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: variante:rowing-unilateral-haltere | adapter: variante:rowing-unilateral-haltere | retirer |
| Hanche | garder | adapter: variante:rowing-unilateral-haltere | retirer |
| Épaule | garder | adapter: charge:legere | retirer |
| Coude | garder | adapter: charge:legere | retirer |
| Poignet | garder | adapter: variante:rowing-penche-paumes-face | retirer |
| Cuisse | garder | adapter: charge:legere | retirer |

**Notes**
- dos-n1 : main d'appui sur la chaise.
- dos-n2 : la case renvoie au rowing à un bras (rowing-unilateral-haltere), charge légère.
- epaule-n2 : charge légère, amplitude réduite.
- coude-n2 : charge légère, paumes face à face.
- poignet-n2 : paumes face à face, charge légère.
- grossesse : version à un bras, charge légère. Post-partum : G7.
- cuisse-n2 : choix prudent, extrapolation de §0 (NON SOURCÉ)

**Grossesse** : adapter: variante:rowing-unilateral-haltere
**Version plus douce** : rowing-unilateral-haltere



**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au bas du dos.
- Dos qui s'arrondit ou buste qui se relève à chaque répétition.
- Douleur, fourmillements qui descendent dans la jambe.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
- `Bent_Over_Two-Dumbbell_Row/0.jpg` : affichable : oui (vue le 22/10/2026 ; fichier public/photos/free-exercise-db/Bent_Over_Two-Dumbbell_Row-0.webp)
- `Bent_Over_Two-Dumbbell_Row/1.jpg` : affichable : oui (vue le 22/10/2026 ; fichier public/photos/free-exercise-db/Bent_Over_Two-Dumbbell_Row-1.webp)
- `Bent_Over_Two-Dumbbell_Row_With_Palms_In/0.jpg` : affichable : oui (vue le 22/10/2026 ; fichier public/photos/free-exercise-db/Bent_Over_Two-Dumbbell_Row_With_Palms_In-0.webp)
- `Bent_Over_Two-Dumbbell_Row_With_Palms_In/1.jpg` : affichable : oui (vue le 22/10/2026 ; fichier public/photos/free-exercise-db/Bent_Over_Two-Dumbbell_Row_With_Palms_In-1.webp)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Genoux souples, buste penché presque à l'horizontale depuis les hanches, dos droit, haltères tirés vers les côtés coudes près du corps, pause et descente contrôlée | free-exercise-db « Bent_Over_Two-Dumbbell_Row » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Bent_Over_Two-Dumbbell_Row.json ; réécrit par coach | base d'exercices (domaine public), pas d'étude | 2026-10-21 | PROVISOIRE |
| Muscles (milieu du dos ; biceps, grand dorsal, épaules) ; reclassement de coach : grand dorsal promu en principal (secondaire dans la source) | même fiche ; bas du dos et ischios (maintien) ajoutés par coach, NON SOURCÉ | idem | 2026-10-21 | PROVISOIRE |
| Repli vers la version avec appui si le bas du dos fatigue | choix de coach | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-21 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Lignes cuisse / aine (muscles secondaires ischios / adducteurs), décision D11 | choix de `kine` par extrapolation de §0 de regles-securite-communes.md ; aucune étude ne teste ces adaptations | avis d'expert (extrapolation) | 2026-10-23 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://www.has-sante.fr/jcms/c_2961499/fr/prise-en-charge-du-patient-presentant-une-lombalgie-commune (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; HAS : fiche mémo PDF lue en entier le 2026-10-21 (https://has-sante.fr/upload/docs/application/pdf/2019-04/fm_lombalgie_v2_2.pdf) ; NICE : résumés seulement | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
