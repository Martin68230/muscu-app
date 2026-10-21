---
id: fente-arriere
nom: Fente arrière
schema: fente
type: force
niveau_min: debutant
muscles_principaux: [quadriceps, fessiers]
muscles_secondaires: [ischios, adducteurs, mollets]
source_brouillon: [M1599, M1598]
statut: controle_relecteur
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| fente-arriere-mur | Main au mur | 1 | debutant | poids_du_corps, mur | Une main posée au mur pour l'équilibre. |
| fente-arriere-poids-du-corps | Poids du corps | 2 | debutant | poids_du_corps | Debout, espace dégagé derrière toi. |
| fente-arriere-halteres | Haltères | 2 | debutant | halteres | Un haltère dans chaque main, bras le long du corps. |

## Consignes
1. Debout, pieds à largeur de hanches.
2. Recule une jambe d'un grand pas, sur la pointe du pied.
3. Descends droit vers le sol, les deux genoux se plient.
4. Le genou arrière s'approche du sol sans le taper.
5. Pousse dans le pied avant pour revenir debout.
6. Alterne les jambes ou fais toute la série d'un côté.

## Points d'attention
- Buste droit.
- Genou avant dans l'axe du pied.
- Poids surtout sur la jambe avant.
- Longueur du pas : un pas court sollicite surtout les quadriceps, un pas long surtout les fessiers (source) ; avec un pas trop court, le genou avant part loin devant, ce qui gêne l'équilibre (repère de technique, pas un danger en soi).

## Erreurs fréquentes
- Genou arrière qui cogne le sol.
- Buste qui bascule en avant.

## Progression / régression
- plus-facile : squat-fendu
- plus-dur : squat-bulgare
squat-fendu <- **fente-arriere** (mur -> poids du corps -> haltères) -> squat-bulgare

## Repères de dosage
Voir program-logic.md.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Genou | adapter: variante:fente-arriere-mur | adapter: variante:squat-fendu-mur | retirer |
| Hanche | garder | adapter: variante:squat-fendu-mur | retirer |
| Cheville | adapter: variante:fente-arriere-mur | adapter: variante:squat-fendu-mur | retirer |
| Dos | adapter: sans-charge | adapter: variante:fente-arriere-mur | retirer |

**Notes**
- genou-n1 : amplitude sans gêne.
- genou-n2 : amplitude réduite.
- hanche-n2 : petit pas.
- cheville-n2 : pieds immobiles.
- dos-n1 : sans haltères (fente-arriere-poids-du-corps).
- dos-n2 : sans haltères, main au mur.
- grossesse : main au mur, sans haltères. Post-partum : G7.

**Grossesse** : adapter: variante:fente-arriere-mur
**Version plus douce** : squat-fendu-mur



**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au genou ou à la hanche.
- Genou arrière qui tape le sol : descends moins bas.
- Perte d'équilibre répétée : main au mur.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
- `Dumbbell_Rear_Lunge/0.jpg` : affichable : à vérifier (non regardée ; variante haltères, peut illustrer le geste).
- `Dumbbell_Rear_Lunge/1.jpg` : affichable : à vérifier (non regardée).

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Grand pas en arrière, descente jusqu'au tibia avant à peu près vertical (repère de technique de la source ; la source ajoute que le genou ne doit pas dépasser les orteils : non repris comme un danger), buste droit, retour en poussant sur le pied avant | free-exercise-db « Dumbbell_Rear_Lunge » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Dumbbell_Rear_Lunge.json ; réécrit par coach | base d'exercices (domaine public), pas d'étude | 2026-10-21 | PROVISOIRE |
| Muscles (quadriceps ; mollets, fessiers, ischios) ; reclassement de coach : fessiers promus en principal (la source les met en secondaire), adducteurs ajoutés | même fiche ; reclassement par coach, NON SOURCÉ | idem | 2026-10-21 | PROVISOIRE |
| Fente arrière plus facile à doser que la fente avant | choix de coach | - | - | NON SOURCÉ |
| Niveau débutant (la source dit intermédiaire) | choix de coach avec l'échelon main au mur, tracé le 21/10/2026 | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-21 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au genou ou à la hanche de niveau 1-2 : adapter plutôt que tout retirer | Bannuru et al., OARSI 2019, Osteoarthritis Cartilage https://wrap.warwick.ac.uk/125416/ (exercice structuré = traitement de base de l'arthrose du genou et de la hanche) | recommandation internationale (méthode GRADE) ; résumé lu | 2026-10-21 | PROVISOIRE (extrapolation : public arthrosique ; l'app ne pose aucun diagnostic) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
