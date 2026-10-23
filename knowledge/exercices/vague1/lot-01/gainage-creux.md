---
id: gainage-creux
nom: Gainage en creux
alias: [hollow hold]
schema: gainage
type: gainage
niveau_min: debutant
muscles_principaux: [abdominaux]
muscles_secondaires: [flechisseurs_hanche, transverse, obliques]
source_brouillon: [M1390]
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| gainage-creux-genoux-plies | Genoux pliés | 1 | debutant | poids_du_corps, tapis | Sur le dos, genoux pliés au-dessus des hanches, bras le long du corps. |
| gainage-creux-jambes-tendues | Jambes tendues, bras au-dessus de la tête | 2 | intermediaire | poids_du_corps, tapis | Sur le dos, jambes tendues juste au-dessus du sol, bras tendus derrière la tête. |

## Consignes
1. Allongé sur le dos, plaque le bas du dos au sol en serrant le ventre.
2. Décolle légèrement les épaules, la tête dans le prolongement du buste.
3. Échelon 1 : genoux pliés au-dessus des hanches, bras le long du corps. Échelon 2 : jambes tendues juste au-dessus du sol, bras tendus derrière la tête.
4. Garde le bas du dos collé au sol, respiration continue.

## Points d'attention
- Si le bas du dos se décolle, ramène les jambes plus haut ou plie les genoux.
- Aucune durée sourcée : arrête dès que le bas du dos décolle.
- Menton légèrement rentré, sans tirer sur la nuque.

## Erreurs fréquentes
- Bas du dos qui se creuse.
- Nuque qui tire.
- Retenir son souffle.

## Progression / régression
- plus-facile : aucun
- plus-dur : aucun
**gainage-creux-genoux-plies** -> gainage-creux-jambes-tendues

## Repères de dosage
Voir program-logic.md. Aucune durée de maintien ni distance sourcée pour ce mouvement.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-22. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: variante:gainage-creux-genoux-plies | adapter: variante:gainage-creux-genoux-plies | retirer |
| Cou | garder | adapter: amplitude:tete-alignee | retirer |
| Hanche | garder | adapter: variante:gainage-creux-genoux-plies | retirer |
| Épaule | adapter: variante:gainage-creux-genoux-plies | adapter: variante:gainage-creux-genoux-plies | retirer |

**Notes**
- dos-n1 : genoux pliés, bas du dos plaqué ; la variante jambes tendues est abandonnée.
- cou-n2 : tête dans l'alignement du dos, sans la lever ni la tourner.
- hanche-n2 : remplacé par la variante gainage-creux-genoux-plies.
- epaule-n1 : bras le long du corps (variante genoux pliés).
- grossesse : couché sur le dos, pression sur le ventre et maintien : retiré (G4) ; remplaçant : bird-dog (maintien court). Post-partum : G7.
- general : mouvement entièrement NON SOURCÉ : ces cases sont des règles de prudence de `kine`, à valider avant tout codage.

**Grossesse** : retirer: remplacant:bird-dog
**Version plus douce** : gainage-creux-genoux-plies



**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au bas du dos, au cou, à la hanche ou à l'épaule.
- Bas du dos qui se décolle du sol.
- Cou qui se crispe ou menton qui se projette vers l'avant.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.


## Photo
- aucune photo
- illustration : public/illustrations/gainage-creux.svg : affichable : oui (illustration originale de l'app)
Aucune photo libre pour ce mouvement.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Existence du mouvement (hollow hold) | brouillon M1390 (hollow hold, licence de l'image à contrôler) ; aucune autre source lue | base d'exercices | 2026-10-22 | NON SOURCÉ |
| Consignes, échelons et niveaux (échelon 2 : niveau intermédiaire, jambes tendues et bras derrière la tête, jugement de coach, choix prudent validé le 22/10/2026) | rédigés par coach, pratique courante ; aucune source lue | - | - | NON SOURCÉ (choix prudent) |
| Décision de garder ce mouvement dans le générateur (question 5 du README) | décision de l'utilisateur du 22/10/2026 (D4 : choix prudents conservés ; D5 : fond validé). Aucune source de preuve lue pour ce mouvement : il reste entièrement NON SOURCÉ, conservé comme choix prudent | - | 2026-10-22 | NON SOURCÉ (choix prudent, décision utilisateur) |
| Échelons, niveaux, muscles et répartition principaux / secondaires | choix de coach (décision de format de l'utilisateur, 21/10/2026) | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-22 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-22 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://has-sante.fr/upload/docs/application/pdf/2019-04/fm_lombalgie_v2_2.pdf (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; HAS : fiche mémo PDF lue en entier le 2026-10-21 ; NICE : résumés seulement | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-22 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
| Mouvement entièrement NON SOURCÉ : toutes les cases de cette fiche sont des règles de prudence | `kine` ; voir la ligne « Existence du mouvement » ci-dessus | - | 2026-10-22 | NON SOURCÉ |
