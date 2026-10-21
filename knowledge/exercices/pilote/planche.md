---
id: planche
nom: Planche
schema: gainage
type: gainage
niveau_min: debutant
muscles_principaux: [abdominaux, transverse]
muscles_secondaires: [obliques, fessiers, deltoides_anterieurs]
source_brouillon: [M1707]
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| planche-genoux | Sur les genoux | 1 | debutant | poids_du_corps, tapis | Avant-bras et genoux au sol. |
| planche-avant-bras | Sur les avant-bras | 2 | debutant | poids_du_corps, tapis | Avant-bras et pointes de pieds au sol. |

## Consignes
1. Avant-bras au sol, coudes sous les épaules.
2. Recule les pieds : corps droit des talons à la tête.
3. Serre le ventre comme si on allait te pousser.
4. Serre les fessiers.
5. Respire calmement et tiens la position.

## Points d'attention
- Ligne droite : ni fesses en l'air, ni bassin qui tombe.
- Regard vers le sol, nuque longue.
- Ne bloque pas ta respiration.
- Arrête dès que le bas du dos se creuse.

## Erreurs fréquentes
- Bassin qui s'affaisse.
- Fesses trop hautes.
- Apnée.

## Progression / régression
- plus-facile : aucun
- plus-dur : planche-touche-epaule
**planche-genoux** -> planche-avant-bras -> planche en levant un bras ou une jambe (à rédiger en vague 1) -> planche-touche-epaule

## Repères de dosage
Voir program-logic.md. Les durées de maintien ne sont pas encore sourcées : à définir par coach avec source avant codage.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | garder | adapter: variante:planche-genoux | retirer |
| Épaule | garder | adapter: variante:planche-genoux | retirer |
| Coude | adapter: appui:serviette | adapter: variante:planche-genoux | retirer |
| Cou | garder | adapter: variante:planche-genoux | retirer |

**Notes**
- dos-n2 : sur les genoux, maintien court.
- coude-n1 : serviette pliée sous les avant-bras.
- coude-n2 : sur les genoux, serviette sous les avant-bras.
- grossesse : maintien isométrique et pression abdominale, donc retiré ; remplaçant conseillé : bird-dog sans pause. Post-partum : G7.

**Grossesse** : retirer: remplacant:bird-dog
**Version plus douce** : planche-genoux



**Signes qui doivent faire arrêter**
- Bas du dos qui se creuse ou douleur au bas du dos.
- Tremblements qui t'empêchent de garder la ligne : fin de la série.
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente à l'épaule ou au coude.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
- `Plank/0.jpg` : affichable : non (vue le 21/10/2026 : personne sur un genou, position de départ, ce n'est pas une planche).
- `Plank/1.jpg` : affichable : oui (vue le 21/10/2026 : planche sur les avant-bras, corps droit ; variante avant-bras seulement).
Variante genoux : aucune photo libre.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Face au sol sur avant-bras et pointes de pieds, coudes sous les épaules, corps rigide, maintien ; plus dur en levant un bras ou une jambe | free-exercise-db « Plank » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Plank.json ; réécrit par coach | base d'exercices (domaine public), pas d'étude | 2026-10-21 | PROVISOIRE |
| Muscles (abdominaux) | même fiche ; autres ajoutés par coach | idem | 2026-10-21 | PROVISOIRE (ajouts NON SOURCÉ) |
| Variante sur les genoux, plus facile que sur les avant-bras | pratique courante (la source ne cite que les variantes bras ou jambe levés) | - | - | NON SOURCÉ |
| La source dit « aussi longtemps que possible » : non retenu (pas d'échec systématique, program-logic.md §0) | choix de coach | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-21 | R1, R2, R3, R7, R8 : NON SOURCÉ ; R4, R5, R6, R9 (partie), R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://www.has-sante.fr/jcms/c_2961499/fr/prise-en-charge-du-patient-presentant-une-lombalgie-commune (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; HAS : fiche mémo PDF lue en entier le 2026-10-21 (https://has-sante.fr/upload/docs/application/pdf/2019-04/fm_lombalgie_v2_2.pdf) ; NICE : résumés seulement | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
