---
id: rowing-unilateral-haltere
nom: Rowing à un bras avec haltère
schema: tirage_h
type: force
niveau_min: debutant
muscles_principaux: [grand_dorsal, rhomboides, trapezes]
muscles_secondaires: [biceps, deltoides_posterieurs, avant_bras]
source_brouillon: [M1846]
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| rowing-un-bras-chaise | Main sur une chaise | 1 | debutant | halteres, chaise | Une main sur l'assise d'une chaise stable, pieds écartés, buste penché. |
| rowing-un-bras-banc | Main et genou sur un banc | 1 | debutant | halteres, banc | Une main et le genou du même côté sur le banc, l'autre pied au sol. |

## Consignes
1. Appuie une main sur la chaise, buste penché, dos plat.
2. L'haltère pend sous l'épaule, bras tendu.
3. Tire l'haltère vers ta hanche, coude près du corps.
4. Serre l'omoplate vers la colonne en haut.
5. Redescends lentement jusqu'à tendre le bras.
6. Finis la série, puis change de côté.

## Points d'attention
- Le buste ne tourne pas pour aider.
- Dos plat, nuque dans l'alignement.
- C'est le dos qui tire, la main ne fait que tenir.
- Chaise qui ne bouge pas.

## Erreurs fréquentes
- Tourner les épaules pour monter la charge.
- Tirer vers l'épaule au lieu de la hanche.
- Lâcher la descente.

## Progression / régression
rowing élastique (à rédiger en vague 1, profil B) <-> **rowing-unilateral-haltere** -> rowing-buste-penche-halteres (deux bras, sans appui)

## Repères de dosage
Voir program-logic.md.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Chaque case contient un seul choix : `garder` (exercice tel quel), `adapter : <action précise>` (`variante:<id>`, `charge:légère`, `sans-charge`, `amplitude:...`, `appui:...`) ou `retirer` (avec `remplaçant` ou `sans-zone:<id>` si la fiche en nomme un) ; vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | garder | adapter : charge:légère, buste plus redressé, appui:main d'appui plus haute, sur un support stable qui ne bouge pas quand tu t'appuies de tout ton poids dessus (essai obligatoire avant, R8) | retirer |
| Épaule | garder | adapter : charge:légère, amplitude:coude près du corps, réduite | retirer |
| Coude | garder | adapter : charge:légère | retirer |
| Poignet | adapter : appui:poing fermé pour la main d'appui | adapter : charge:légère, appui:poing fermé pour la main d'appui | retirer |

**Version plus douce** : même fiche plus légère (`rowing-un-bras-chaise`).

**Grossesse** (G1 à G8 de regles-securite-communes.md ; avis du médecin ou de la sage-femme avant tout programme) : adapter : charge:légère, appui:main d'appui sur la chaise stable. Post-partum : G7.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au dos, à l'épaule ou au coude.
- Douleur, fourmillements qui descendent dans le bras ou la jambe.
- Chaise qui bouge.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Chaise à 4 pieds, sans roulettes, non pliante, en bon état ; dossier calé contre un mur ; sol non glissant (pas de tapis qui glisse, pas de carrelage mouillé).
- Avant la première série, appuie-toi dessus comme pendant l'exercice : si elle bouge, glisse ou grince, n'utilise pas cette chaise.
- Appuie la main vers le bas, pas vers l'avant : la chaise ne doit pas glisser.

## Photo
- `One-Arm_Dumbbell_Row/0.jpg` : affichable : à vérifier (image non regardée ; variante banc : illustration seulement pour la variante chaise).
- `One-Arm_Dumbbell_Row/1.jpg` : affichable : à vérifier (image non regardée).

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Appui main et genou sur un banc, buste presque horizontal, dos plat, haltère tiré vers les côtes coude près du corps, descente contrôlée | free-exercise-db « One-Arm_Dumbbell_Row » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/One-Arm_Dumbbell_Row.json ; réécrit par coach | base d'exercices (domaine public), pas d'étude | 2026-10-21 | PROVISOIRE |
| Muscles (milieu du dos ; biceps, grand dorsal, épaules) | même fiche | idem | 2026-10-21 | PROVISOIRE |
| Appui sur une chaise | adaptation maison par coach | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-21 | R1, R2, R3, R7, R8 : NON SOURCÉ ; R4, R5, R6, R9 (partie), R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://www.has-sante.fr/jcms/c_2961499/fr/prise-en-charge-du-patient-presentant-une-lombalgie-commune (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; HAS : fiche mémo PDF lue en entier le 2026-10-21 (https://has-sante.fr/upload/docs/application/pdf/2019-04/fm_lombalgie_v2_2.pdf) ; NICE : résumés seulement | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
| Avertissement de stabilité de la chaise | règle de conception (exercise-catalog.md §5) ; aucune source trouvée | - | 2026-10-21 | NON SOURCÉ |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
