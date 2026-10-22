---
id: oiseau-halteres
nom: Oiseau (écartement des bras vers l'arrière)
schema: tirage_h
type: force
niveau_min: debutant
muscles_principaux: [deltoides_posterieurs]
muscles_secondaires: [rhomboides, trapezes]
source_brouillon: []
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| oiseau-sans-charge-assis | Sans charge, assis penché | 1 | debutant | poids_du_corps, chaise | Assis au bord d'une chaise stable, buste penché, bras pendants. |
| oiseau-halteres-assis | Haltères légers, assis penché | 2 | debutant | halteres, chaise | Même position, un haltère léger dans chaque main. |
| oiseau-halteres-banc-incline | Haltères, poitrine sur un banc incliné | 2 | debutant | halteres, banc_inclinable | Poitrine contre le dossier d'un banc incliné, un haltère dans chaque main, bras pendants. |

## Consignes
1. Penche le buste vers l'avant (assis au bord de la chaise, ou poitrine appuyée au banc), dos droit, bras pendants.
2. Coudes très légèrement pliés, paumes face à face.
3. Écarte les bras sur les côtés jusqu'à hauteur d'épaules, en rapprochant les omoplates.
4. Redescends lentement, sans te laisser tomber.
5. Garde la nuque dans le prolongement du dos.

## Points d'attention
- Charge très légère : ce sont de petits muscles.
- Mouvement lent, sans élan ni mouvement du buste.
- Épaules basses, loin des oreilles.

## Erreurs fréquentes
- Charge trop lourde, mouvement saccadé.
- Dos qui s'arrondit.
- Bras qui se plient pour tirer comme un rowing.

## Progression / régression
- plus-facile : aucun
- plus-dur : rowing-penche-paumes-face

## Repères de dosage
Voir program-logic.md. Aucune valeur sourcée pour ce mouvement.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-22. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3). L'app a dix zones : cou, épaule, coude, poignet, dos, hanche, genou, cheville, cuisse (face arrière : ischios) et aine (adducteurs). Une gêne au tendon d'Achille se déclare sous « cheville ».

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | adapter: amplitude:bras-bas | retirer | retirer |
| Cou | adapter: amplitude:tete-alignee | adapter: amplitude:tete-alignee | retirer |
| Dos | adapter: charge:legere | adapter: variante:oiseau-sans-charge-assis | retirer |

**Notes**
- epaule-n1 : bras moins hauts : ne monte pas les bras jusqu'à hauteur d'épaules si cela gêne.
- epaule-n2 : exercice retiré ; un autre exercice de tirage qui ne sollicite pas l'épaule est proposé.
- cou-n1 : nuque dans le prolongement du dos, regard vers le sol.
- cou-n2 : même case ; aucune augmentation de charge (R2).
- dos-n1 : haltères les plus légers, départ de l'étalonnage, jamais augmentés.
- dos-n2 : sans charge, assis penché ; aucune augmentation de difficulté (R2).
- grossesse : sans charge, assis au bord de la chaise, buste peu penché ; pas de banc incliné (poitrine appuyée). Post-partum : G7.
- general : version plus douce : sans charge, assis. Chaise stable sans roulettes.

**Grossesse** : adapter: variante:oiseau-sans-charge-assis
**Version plus douce** : oiseau-sans-charge-assis

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) à l'épaule, au cou ou au bas du dos.
- Dos qui s'arrondit, mouvement saccadé, haltère qui échappe : repose-le et reprends plus léger.
- Vertige en se relevant du buste penché : reste assis un instant.
- Douleur qui dure, qui s'aggrave ou qui réveille la nuit, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2) ; ces signes n'ont pas à être « diagnostiqués » par toi.
- Si le réglage « enceinte / post-partum » est coché : saignement, perte de liquide, contractions, vertige, douleur ou gonflement d'un mollet, fuite d'urine ou pesanteur dans le bas-ventre : arrête et contacte ta sage-femme ou ton médecin (G6, G7) ; en cas de saignement, de perte des eaux ou de contractions régulières : urgence, voir U1.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Chaise : quatre pieds, sans roulettes, non pliante, dossier contre un mur ; teste l'appui avant l'exercice (R8).
- Haltère fixe de préférence ; si réglable, disques serrés et vérifiés avant chaque série (prudence de `kine`, NON SOURCÉ).
- Banc incliné : stable, réglage bloqué avant l'exercice (R8).
- Si l'objet bouge, glisse ou grince : arrêt, et l'objet n'est plus utilisé (R8).

## Photo
- `Reverse_Flyes/0.jpg` : affichable : oui (vue le 22/10/2026 ; fichier public/photos/free-exercise-db/Reverse_Flyes-0.webp)
- `Reverse_Flyes/1.jpg` : affichable : oui (vue le 22/10/2026 ; fichier public/photos/free-exercise-db/Reverse_Flyes-1.webp)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Poitrine contre un banc incliné, haltères, écartement des bras jusqu'à l'horizontale en rapprochant les omoplates, retour lent | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db, entrée « Reverse_Flyes » (niveau beginner) ; lu le 2026-10-22 | base d'exercices (pratique, pas une étude) | 2026-10-22 | PROVISOIRE |
| Un programme d'épaule à l'échauffement (OSTRC), 3 fois par semaine, réduit les problèmes d'épaule chez des handballeurs d'élite (17 % contre 23 %) | Andersson et al., Br J Sports Med 2017;51:1073 https://bjsm.bmj.com/content/51/14/1073, repris dans knowledge/sports.md | essai randomisé en grappes, 660 handballeurs d'élite ; résumé lu à la rédaction de sports.md, non rouvert | 2026-10-21 | OK pour le hand ; extrapolation au volley et aux raquettes : PROVISOIRE ; que CET exercice soit dans le programme OSTRC : NON SOURCÉ (contenu détaillé non lu) |
| Échelons, niveaux, muscles et répartition principaux / secondaires | choix de coach (décision de format de l'utilisateur, 21/10/2026) | - | - | NON SOURCÉ |
| Variantes assis penché sur chaise et sans charge | choix de coach (« Seated_Bent-Over_Rear_Delt_Raise » existe dans la base, lue le 2026-10-22 : niveau de la source intermédiaire ; la fiche la propose en débutant avec des haltères très légers : écart de niveau tracé, choix de coach) | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-22 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-22 | NON SOURCÉ (extrapolation, à valider) |
| Chaise : quatre pieds, sans roulettes, non pliante, dossier contre un mur, sol non glissant ; test d'appui avant l'exercice | regles-securite-communes.md §7 (raisonnement mécanique de `kine`) ; aucune source lue | - | 2026-10-22 | NON SOURCÉ |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://has-sante.fr/upload/docs/application/pdf/2019-04/fm_lombalgie_v2_2.pdf (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; HAS : fiche mémo PDF lue en entier le 2026-10-21 ; NICE : résumés seulement | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-22 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
