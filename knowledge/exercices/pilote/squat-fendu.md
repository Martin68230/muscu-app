---
id: squat-fendu
nom: Squat fendu
schema: fente
type: force
niveau_min: debutant
muscles_principaux: [quadriceps, fessiers]
muscles_secondaires: [ischios, adducteurs, mollets]
source_brouillon: [M1918]
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| squat-fendu-mur | Main au mur | 1 | debutant | poids_du_corps, mur | Une main posée au mur pour l'équilibre. |
| squat-fendu-poids-du-corps | Poids du corps | 2 | debutant | poids_du_corps | Pieds décalés, un devant, un derrière. |
| squat-fendu-halteres | Haltères | 2 | debutant | halteres | Un haltère dans chaque main, bras le long du corps. |

## Consignes
1. Fais un grand pas en avant et reste dans cette position.
2. Talon arrière décollé, pieds à largeur de hanches (comme sur des rails).
3. Descends à la verticale en pliant les deux genoux.
4. Arrête juste avant que le genou arrière touche le sol.
5. Remonte en poussant surtout sur le pied avant.
6. Finis la série, puis change de jambe.

## Points d'attention
- Les pieds ne bougent pas pendant la série.
- Buste droit, bassin de face.
- Genou avant dans l'axe du pied.
- Descente contrôlée.

## Erreurs fréquentes
- Pieds sur une même ligne : on perd l'équilibre.
- Pousser surtout avec la jambe arrière.
- Genou avant qui rentre vers l'intérieur.

## Progression / régression
- plus-facile : squat-assis-debout
- plus-dur : fente-arriere, squat-bulgare
squat-assis-debout <- **squat-fendu** (mur -> poids du corps -> haltères) -> fente-arriere -> squat-bulgare

## Repères de dosage
Voir program-logic.md.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Genou | adapter: variante:squat-fendu-mur | adapter: variante:squat-fendu-mur | retirer |
| Hanche | garder | adapter: variante:squat-fendu-mur | retirer |
| Cheville | adapter: variante:squat-fendu-mur | adapter: variante:squat-assis-debout | retirer |
| Dos | adapter: variante:squat-fendu-poids-du-corps | adapter: variante:squat-fendu-mur | retirer |

**Notes**
- genou-n2 : mi-descente.
- hanche-n2 : mi-descente.
- cheville-n2 : le squat assis-debout remplace ; amplitude réduite possible.
- dos-n1 : sans haltères.
- dos-n2 : sans haltères, main au mur.
- grossesse : main au mur, sans haltères. Post-partum : G7.
- general : version plus douce = main au mur à mi-descente, ou squat assis-debout.

**Grossesse** : adapter: variante:squat-fendu-mur
**Version plus douce** : squat-fendu-mur



**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au genou ou à la hanche.
- Genou arrière qui tape le sol.
- Perte d'équilibre répétée : main au mur.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
- aucune photo
Aucune photo affichable (affichable : sans objet). Ne pas utiliser « Split_Squats » (fente sautée) ni « Split_Squat_with_Dumbbells » (pied arrière surélevé = squat bulgare).

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Mouvement et consignes | Brouillon M1918 ; consignes rédigées par coach (la fiche source free-exercise-db décrit une version sautée) | pratique courante, pas d'étude | 2026-10-21 | NON SOURCÉ |
| Muscles (quadriceps ; mollets, fessiers, ischios) | free-exercise-db « Split_Squat_with_Dumbbells » et « Split_Squats » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Split_Squat_with_Dumbbells.json | base d'exercices (domaine public) | 2026-10-21 | PROVISOIRE |
| Squat fendu plus facile que la fente (pieds fixes) | choix de coach | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-21 | R1, R2, R3, R7, R8 : NON SOURCÉ ; R4, R5, R6, R9 (partie), R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au genou ou à la hanche de niveau 1-2 : adapter plutôt que tout retirer | Bannuru et al., OARSI 2019, Osteoarthritis Cartilage https://wrap.warwick.ac.uk/125416/ (exercice structuré = traitement de base de l'arthrose du genou et de la hanche) | recommandation internationale (méthode GRADE) ; résumé lu | 2026-10-21 | PROVISOIRE (extrapolation : public arthrosique ; l'app ne pose aucun diagnostic) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
