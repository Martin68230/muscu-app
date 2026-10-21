---
id: squat-poids-du-corps
nom: Squat au poids du corps
schema: squat
type: force
niveau_min: debutant
muscles_principaux: [quadriceps]
muscles_secondaires: [fessiers, ischios, adducteurs]
source_brouillon: [M1922]
statut: controle_relecteur
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| squat-poids-du-corps-libre | Libre | 1 | debutant | poids_du_corps | Debout, espace dégagé. |

## Consignes
1. Pieds à peu près à largeur d'épaules, orteils un peu ouverts si c'est plus confortable.
2. Bras devant toi ou mains croisées sur la poitrine.
3. Plie hanches et genoux en même temps, fesses vers l'arrière.
4. Descends tant que ton dos reste droit et tes talons au sol.
5. Remonte en poussant le sol jusqu'à être bien droit.

## Points d'attention
- Genoux dans l'axe des orteils, poussés un peu vers l'extérieur.
- Poitrine haute, regard devant.
- Poids réparti sur tout le pied.
- Moins bas mais propre vaut mieux que bas et arrondi.

## Erreurs fréquentes
- Talons qui décollent.
- Genoux qui rentrent vers l'intérieur.
- Dos qui s'arrondit en bas.
- Descente en chute libre.

## Progression / régression
- plus-facile : squat-assis-debout
- plus-dur : squat-gobelet
squat-assis-debout <- **squat-poids-du-corps** -> même fiche avec descente lente ou pause en bas -> squat-gobelet -> squat-bulgare

## Repères de dosage
Voir program-logic.md. Au poids du corps : progression par tempo, pauses puis répétitions (load-calibration.md règle 5 et program-logic.md §4, NON SOURCÉ).

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Genou | garder | adapter: variante:squat-assis-debout | retirer |
| Hanche | garder | adapter: variante:squat-assis-debout | retirer |
| Dos | garder | adapter: variante:squat-assis-debout | retirer |
| Cheville | adapter: appui:pieds-ecartes | adapter: variante:squat-assis-debout | retirer |

**Notes**
- genou-n2 : la chaise limite la descente.
- cheville-n1 : pieds un peu plus ouverts, talons au sol.
- cheville-n2 : amplitude réduite possible.
- grossesse : un appui au mur ou une chaise à portée si l'équilibre change. Post-partum : G7.

**Grossesse** : garder
**Version plus douce** : squat-assis-debout



**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au genou, à la hanche ou au dos.
- Genou qui lâche.
- Talons qui décollent malgré une amplitude réduite.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
Règle : la consigne prime sur la photo (CLAUDE.md règle 12). Images free-exercise-db (domaine public), regardées le 21/10/2026.
- `Bodyweight_Squat/0.jpg` : affichable : non (mains derrière la tête, contredit la consigne « bras devant » ; décision utilisateur 21/10/2026).
- `Bodyweight_Squat/1.jpg` : affichable : non (mains derrière la tête en bas du squat, même raison).
Fiche sans photo affichable tant qu'aucune image libre ne montre les bras devant.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Hanches et genoux ensemble, fesses en arrière, poitrine haute, genoux vers l'extérieur, profondeur selon la mobilité | free-exercise-db « Bodyweight_Squat » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Bodyweight_Squat.json ; réécrit par coach | base d'exercices (domaine public), pas d'étude | 2026-10-21 | PROVISOIRE |
| Muscles : quadriceps en principal ; fessiers et ischios en secondaire (comme la source) | même fiche ; adducteurs ajoutés par coach. Changement par rapport à la première version de la fiche : les fessiers passent de principal à secondaire (alignement sur la source) | idem | 2026-10-21 | PROVISOIRE (adducteurs : NON SOURCÉ) |
| Pieds à largeur d'épaules (source) ; orteils un peu ouverts si confortable | source pour la largeur ; l'ouverture des orteils est un ajout de coach | pratique courante | - | largeur : PROVISOIRE ; orteils : NON SOURCÉ |
| Bras devant ou mains croisées sur la poitrine plutôt que mains derrière la tête (la source autorise les mains derrière la tête) | choix de coach, confirmé par l'utilisateur le 21/10/2026 : la consigne prime sur la photo | - | - | NON SOURCÉ (décision utilisateur) |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-21 | R1, R2, R3, R7, R8 : NON SOURCÉ ; R4, R5, R6, R9 (partie), R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au genou ou à la hanche de niveau 1-2 : adapter plutôt que tout retirer | Bannuru et al., OARSI 2019, Osteoarthritis Cartilage https://wrap.warwick.ac.uk/125416/ (exercice structuré = traitement de base de l'arthrose du genou et de la hanche) | recommandation internationale (méthode GRADE) ; résumé lu | 2026-10-21 | PROVISOIRE (extrapolation : public arthrosique ; l'app ne pose aucun diagnostic) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://www.has-sante.fr/jcms/c_2961499/fr/prise-en-charge-du-patient-presentant-une-lombalgie-commune (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; HAS : fiche mémo PDF lue en entier le 2026-10-21 (https://has-sante.fr/upload/docs/application/pdf/2019-04/fm_lombalgie_v2_2.pdf) ; NICE : résumés seulement | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
