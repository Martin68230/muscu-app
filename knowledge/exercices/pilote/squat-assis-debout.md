---
id: squat-assis-debout
nom: Squat assis-debout sur chaise
schema: squat
type: force
niveau_min: debutant
muscles_principaux: [quadriceps, fessiers]
muscles_secondaires: [ischios, adducteurs]
source_brouillon: [M0491, M1896]
statut: controle_relecteur
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| squat-assis-debout-chaise | Sur une chaise | 1 | debutant | poids_du_corps, chaise | Chaise stable, sans roulettes, dossier contre un mur. |
| squat-assis-debout-marche | Sur un banc de parc ou une box | 1 | debutant | poids_du_corps, box_ou_step | Support stable, à peu près à hauteur de genou. |

## Consignes
1. Dos à la chaise, pieds à largeur de hanches, un peu ouverts.
2. Bras tendus devant toi pour l'équilibre.
3. Pousse les fesses en arrière et descends en contrôlant.
4. Effleure la chaise sans t'y laisser tomber.
5. Pousse dans tout le pied pour te relever bien droit.

## Points d'attention
- Genoux dans la direction des orteils.
- Talons au sol tout le long.
- Poitrine ouverte, regard devant.
- Descente lente, montée franche.

## Erreurs fréquentes
- Se laisser tomber sur la chaise.
- Prendre de l'élan avec le buste pour se relever.
- Genoux qui rentrent vers l'intérieur.

## Progression / régression
- plus-facile : assis-debout-mains-cuisses
- plus-dur : squat-poids-du-corps
assis-debout avec appui des mains sur les cuisses (à créer) <- **squat-assis-debout** -> squat-poids-du-corps -> squat-gobelet

## Repères de dosage
Voir program-logic.md.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Genou | garder | adapter: appui:assise-rehaussee | retirer |
| Hanche | garder | adapter: appui:assise-rehaussee | retirer |
| Dos | garder | adapter: appui:assise-rehaussee | retirer |

**Notes**
- genou-n2 : assise plus haute (chaise plus haute, ou coussin antidérapant ou plié et calé sur l'assise), descente lente, mains sur les cuisses.
- hanche-n2 : même précaution sur l'assise, pieds un peu plus écartés.
- dos-n2 : même précaution sur l'assise, buste droit.
- grossesse : respiration continue, sans maintien en bas. Post-partum : G7.
- general : version plus douce = même fiche avec une assise plus haute.

**Grossesse** : garder
**Version plus douce** : aucune



**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au genou, à la hanche ou au dos.
- Genou qui lâche ou se dérobe.
- Chaise qui bouge ou glisse.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Chaise à 4 pieds, sans roulettes, non pliante, en bon état ; dossier calé contre un mur ; sol non glissant (pas de tapis qui glisse, pas de carrelage mouillé).
- Avant la première série, appuie-toi dessus comme pendant l'exercice : si elle bouge, glisse ou grince, n'utilise pas cette chaise.
- Assieds-toi au milieu de l'assise, jamais sur le bord.

## Photo
- aucune photo
Aucune photo affichable (affichable : sans objet). « Sit_Squats » montre un demi-squat sans chaise : ne pas l'utiliser.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Mouvement et consignes | Brouillon M0491 (wger « Box squat ») et M1896 ; consignes rédigées par coach | pratique courante, pas d'étude | 2026-10-21 | NON SOURCÉ |
| Muscles (la source décrit un autre mouvement, un demi-squat sans chaise : transposition par coach) | free-exercise-db « Sit_Squats » (quadriceps ; fessiers, ischios, abducteurs ; la fiche remplace abducteurs par adducteurs et promeut les fessiers : choix de coach NON SOURCÉ) https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Sit_Squats.json | base d'exercices (domaine public), pas d'étude | 2026-10-21 | PROVISOIRE |
| Chaise stable, sans roulettes | equipment-taxonomy.md §2 (règle de conception) | - | 2026-10-21 | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-21 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au genou ou à la hanche de niveau 1-2 : adapter plutôt que tout retirer | Bannuru et al., OARSI 2019, Osteoarthritis Cartilage https://wrap.warwick.ac.uk/125416/ (exercice structuré = traitement de base de l'arthrose du genou et de la hanche) | recommandation internationale (méthode GRADE) ; résumé lu | 2026-10-21 | PROVISOIRE (extrapolation : public arthrosique ; l'app ne pose aucun diagnostic) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://www.has-sante.fr/jcms/c_2961499/fr/prise-en-charge-du-patient-presentant-une-lombalgie-commune (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; HAS : fiche mémo PDF lue en entier le 2026-10-21 (https://has-sante.fr/upload/docs/application/pdf/2019-04/fm_lombalgie_v2_2.pdf) ; NICE : résumés seulement | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
| Avertissement de stabilité de la chaise | règle de conception (exercise-catalog.md §5) ; aucune source trouvée | - | 2026-10-21 | NON SOURCÉ |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
