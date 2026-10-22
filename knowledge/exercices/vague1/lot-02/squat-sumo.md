---
id: squat-sumo
nom: Squat sumo
schema: squat
type: force
niveau_min: debutant
muscles_principaux: [quadriceps, adducteurs]
muscles_secondaires: [fessiers]
source_brouillon: []
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| squat-sumo-poids-du-corps | Poids du corps | 1 | debutant | poids_du_corps | Pieds plus écartés que les épaules, pointes de pieds vers l'extérieur, mains jointes devant la poitrine. |
| squat-sumo-haltere | Avec un haltère | 2 | debutant | halteres | Même position, un haltère tenu à deux mains entre les jambes, bras tendus. |
| squat-sumo-kettlebell | Avec une kettlebell | 2 | debutant | kettlebell | Même position, une kettlebell tenue à deux mains entre les jambes, bras tendus. |

## Consignes
1. Place les pieds nettement plus larges que les épaules, pointes légèrement vers l'extérieur.
2. Garde le buste droit, le regard devant, la poitrine ouverte.
3. Plie les genoux et descends entre les jambes, genoux dans l'axe des pieds.
4. Descends jusqu'à ce que les cuisses soient proches de l'horizontale, ou moins si tu es limité.
5. Pousse dans le sol avec tout le pied pour remonter.

## Points d'attention
- Genoux dans l'axe des pieds, ni vers l'intérieur ni trop vers l'extérieur.
- Charge tenue près du corps.
- Autre squat que squat-gobelet du pilote : la position large sollicite davantage l'intérieur des cuisses (effet non sourcé).

## Erreurs fréquentes
- Genoux qui rentrent.
- Buste qui s'incline vers l'avant.
- Talons qui décollent.

## Progression / régression
- plus-facile : squat-poids-du-corps-libre
- plus-dur : squat-bulgare-chaise

## Repères de dosage
Voir program-logic.md et load-calibration.md. Aucune valeur propre à ce mouvement.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-22. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3). L'app n'a pas de zone « aine », « cuisse » ni « tendon d'Achille » : une gêne à l'aine se déclare sous « hanche », à l'arrière de la cuisse sous « hanche » ou « genou », au tendon d'Achille sous « cheville ».

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Genou | adapter: variante:squat-sumo-poids-du-corps | adapter: variante:squat-assis-debout | retirer |
| Hanche | adapter: variante:squat-sumo-poids-du-corps | adapter: variante:squat-assis-debout | retirer |
| Dos | adapter: sans-charge | adapter: variante:squat-assis-debout | retirer |
| Cheville | adapter: variante:squat-sumo-poids-du-corps | adapter: variante:squat-assis-debout | retirer |

**Notes**
- genou-n1 : poids du corps seulement : ni haltère ni kettlebell.
- genou-n2 : squat assis-debout, qui limite la descente ; aucune augmentation de difficulté (R2).
- hanche-n1 : poids du corps seulement ; une gêne à l'aine ou au pli de la hanche se déclare sous « hanche ».
- hanche-n2 : squat assis-debout, qui limite la descente.
- dos-n1 : sans haltère ni kettlebell.
- dos-n2 : squat assis-debout, qui limite la descente.
- cheville-n1 : poids du corps seulement.
- cheville-n2 : squat assis-debout, qui limite la descente.
- grossesse : poids du corps seulement (la case ne code que cela). Post-partum : G7.
- general : cases au moins aussi restrictives que le squat au poids du corps, plus facile. Version plus douce : le squat au poids du corps.

**Grossesse** : adapter: variante:squat-sumo-poids-du-corps
**Version plus douce** : squat-poids-du-corps-libre

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) au genou, à la hanche, à l'aine, à la cheville ou au bas du dos.
- Genoux qui rentrent, buste qui plonge, talons qui décollent : arrête la série et reprends plus léger.
- Tiraillement net à l'intérieur de la cuisse : arrêt.
- Douleur qui dure, qui s'aggrave ou qui réveille la nuit, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2) ; ces signes n'ont pas à être « diagnostiqués » par toi.
- Si le réglage « enceinte / post-partum » est coché : saignement, perte de liquide, contractions, vertige, douleur ou gonflement d'un mollet, fuite d'urine ou pesanteur dans le bas-ventre : arrête et contacte ta sage-femme ou ton médecin (G6, G7) ; en cas de saignement, de perte des eaux ou de contractions régulières : urgence, voir U1.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Haltère ou kettlebell : tenu à deux mains près du corps ; fixe de préférence, sinon disques serrés et vérifiés avant chaque série (prudence de `kine`, NON SOURCÉ). Ne le lâche pas vers les pieds.
- Si l'objet bouge, glisse ou grince : arrêt, et l'objet n'est plus utilisé (R8).

## Photo
- `Plie_Dumbbell_Squat/0.jpg` : affichable : à vérifier (image non regardée ; la source utilise un haltère tenu à la base)
- `Plie_Dumbbell_Squat/1.jpg` : affichable : à vérifier (image non regardée ; la source utilise un haltère tenu à la base)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Pieds plus larges que les épaules, pointes vers l'extérieur, descente jusqu'aux cuisses parallèles, poussée par les talons | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db, entrée « Plie_Dumbbell_Squat » (niveau beginner) ; lu le 2026-10-22 | base d'exercices (pratique, pas une étude) | 2026-10-22 | PROVISOIRE |
| Le FIFA 11+ entier réduit les blessures hanche/aine de 41 % (Thorborg 2017), sans détail par exercice ; l'effet de CET exercice sur l'aine ou la hanche n'est pas établi | knowledge/sports.md (résumé de Thorborg 2017, non rouvert) | méta-analyse (programme entier, pas cet exercice) | 2026-10-21 | programme entier : OK (cité par sports.md) ; effet de cet exercice sur l'aine ou la hanche : NON SOURCÉ |
| Échelons, niveaux, muscles et répartition principaux / secondaires | choix de coach (décision de format de l'utilisateur, 21/10/2026) | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-22 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-22 | NON SOURCÉ (extrapolation, à valider) |
| Aine, ischios, tendon d'Achille : rangés sous les zones hanche, genou ou cheville faute de zone dédiée | choix de conception de `kine` (les zones de l'app sont cou, épaule, coude, poignet, dos, hanche, genou, cheville) | - | 2026-10-22 | NON SOURCÉ (conception) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://has-sante.fr/upload/docs/application/pdf/2019-04/fm_lombalgie_v2_2.pdf (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; HAS : fiche mémo PDF lue en entier le 2026-10-21 ; NICE : résumés seulement | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-22 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
