---
id: fente-avant
nom: Fente avant
schema: fente
type: force
niveau_min: debutant
muscles_principaux: [quadriceps, fessiers]
muscles_secondaires: [ischios, adducteurs]
source_brouillon: []
statut: controle_relecteur
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| fente-avant-poids-du-corps | Poids du corps, retour au point de départ | 1 | debutant | poids_du_corps | Espace dégagé devant toi, mains sur les hanches. |
| fente-avant-halteres | Avec deux haltères, retour au point de départ | 1 | debutant | halteres | Même installation, un haltère dans chaque main le long du corps. |
| fente-marchee | Fentes marchées, poids du corps | 2 | debutant | poids_du_corps | Espace dégagé pour avancer, mains sur les hanches. |

## Consignes
1. Debout, pieds largeur de hanches, mains sur les hanches (ou haltères le long du corps).
2. Fais un grand pas en avant et descends en pliant les deux genoux, genou arrière près du sol.
3. Le genou avant reste dans l'axe du pied ; le buste reste droit.
4. Pousse dans le talon avant pour revenir au départ (échelon 1), ou avance en ramenant l'autre jambe (fente marchée).
5. Alterne les jambes.

## Points d'attention
- Le pas avant freine le corps : il prépare les arrêts des sports de balle (lien de pratique, non sourcé).
- Pas trop court (le genou avant part trop loin) ni trop long (le buste bascule).
- Aucune valeur sourcée pour les séries et répétitions.

## Erreurs fréquentes
- Genou avant qui rentre.
- Buste qui plonge.
- Talon arrière qui lâche.

## Progression / régression
- plus-facile : fente-arriere-poids-du-corps, squat-fendu-poids-du-corps
- plus-dur : squat-bulgare-chaise

## Repères de dosage
Voir program-logic.md et load-calibration.md. Aucune valeur propre à ce mouvement.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-22. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3). L'app n'a pas de zone « aine », « cuisse » ni « tendon d'Achille » : une gêne à l'aine se déclare sous « hanche », à l'arrière de la cuisse sous « hanche » ou « genou », au tendon d'Achille sous « cheville ».

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Genou | adapter: variante:squat-fendu-mur | adapter: variante:squat-fendu-mur | retirer |
| Hanche | adapter: amplitude:reduite | adapter: variante:squat-fendu-mur | retirer |
| Cheville | adapter: variante:squat-fendu-mur | adapter: variante:squat-assis-debout | retirer |
| Dos | adapter: sans-charge | adapter: variante:squat-fendu-mur | retirer |

**Notes**
- genou-n1 : squat fendu avec la main au mur à la place de la fente (le pas avant freine plus le corps).
- genou-n2 : même variante ; aucune augmentation de difficulté (R2).
- hanche-n1 : amplitude réduite : petit pas, descente courte.
- hanche-n2 : squat fendu avec la main au mur.
- cheville-n1 : squat fendu avec la main au mur.
- cheville-n2 : squat assis-debout, qui limite la descente et l'appui sur l'avant-pied (comme pour le squat fendu) ; aucune augmentation de difficulté (R2).
- dos-n1 : sans haltère.
- dos-n2 : squat fendu avec la main au mur.
- grossesse : squat fendu avec la main au mur, sans haltère ; respiration continue (G4). Post-partum : G7 (sans effet : la fente n'est pas un saut).
- general : plus exigeante que la fente arrière : cases au moins aussi restrictives. Version plus douce : le squat fendu avec la main au mur.

**Grossesse** : adapter: variante:squat-fendu-mur
**Version plus douce** : squat-fendu-mur

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) au genou, à la hanche, à la cheville ou au bas du dos.
- Genou avant qui rentre, buste qui plonge, perte d'équilibre : arrête la série.
- Haltère qui glisse : repose-le, ne le rattrape pas.
- Douleur qui dure, qui s'aggrave ou qui réveille la nuit, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2) ; ces signes n'ont pas à être « diagnostiqués » par toi.
- Si le réglage « enceinte / post-partum » est coché : saignement, perte de liquide, contractions, vertige, douleur ou gonflement d'un mollet, fuite d'urine ou pesanteur dans le bas-ventre : arrête et contacte ta sage-femme ou ton médecin (G6, G7) ; en cas de saignement, de perte des eaux ou de contractions régulières : urgence, voir U1.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Haltère : fixe de préférence, sinon disques serrés et vérifiés avant chaque série (prudence de `kine`, NON SOURCÉ).
- Fentes marchées : couloir dégagé, sol antidérapant, rien au sol (R8).
- Si l'objet bouge, glisse ou grince : arrêt, et l'objet n'est plus utilisé (R8).

## Photo
- `Bodyweight_Walking_Lunge/0.jpg` : affichable : à vérifier (image non regardée ; fente marchée)
- `Bodyweight_Walking_Lunge/1.jpg` : affichable : à vérifier (image non regardée ; fente marchée)
- `Dumbbell_Lunges/0.jpg` : affichable : à vérifier (image non regardée ; fente avec haltères)
- `Dumbbell_Lunges/1.jpg` : affichable : à vérifier (image non regardée ; fente avec haltères)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Grand pas en avant, genou arrière près du sol, buste droit, poussée sur le talon avant, pas avec l'autre jambe | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db, entrée « Bodyweight_Walking_Lunge » (niveau beginner) ; lu le 2026-10-22 | base d'exercices (pratique, pas une étude) | 2026-10-22 | PROVISOIRE |
| Fente avant avec haltères le long du corps, retour au départ par le talon (la source dit aussi que le genou ne doit pas dépasser les orteils : consigne non reprise, non confirmée) | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db, entrée « Dumbbell_Lunges » (niveau beginner) ; lu le 2026-10-22 | base d'exercices (pratique, pas une étude) | 2026-10-22 | PROVISOIRE |
| Échelons, niveaux, muscles et répartition principaux / secondaires | choix de coach (décision de format de l'utilisateur, 21/10/2026) | - | - | NON SOURCÉ |
| Lien avec les sports à freinages (foot, raquettes) | knowledge/sports.md, famille « sprints et changements de direction » (liste de qualités, pas une étude) | - | 2026-10-21 | PROVISOIRE |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-22 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-22 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://has-sante.fr/upload/docs/application/pdf/2019-04/fm_lombalgie_v2_2.pdf (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; HAS : fiche mémo PDF lue en entier le 2026-10-21 ; NICE : résumés seulement | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-22 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
