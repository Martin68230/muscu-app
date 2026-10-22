---
id: releve-mollets-halteres
nom: Montée sur les pointes avec haltères
schema: cheville_mollet
type: force
niveau_min: debutant
muscles_principaux: [mollets]
muscles_secondaires: [peroniers]
source_brouillon: []
statut: brouillon_coach
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| releve-mollets-halteres-sol | Debout au sol, haltères le long du corps | 1 | debutant | halteres, poids_du_corps | Debout sur un sol plat, un haltère dans chaque main le long du corps ; une main sur un mur si besoin. |
| releve-mollets-halteres-marche | Avant-pieds sur la première marche | 2 | debutant | halteres, marche_escalier | Avant-pieds sur le bord de la première marche, haltères légers le long du corps, rampe à portée. |
| releve-mollets-halteres-une-jambe | Un haltère, une jambe, sur la marche | 3 | intermediaire | halteres, marche_escalier | Même installation ; un seul pied sur la marche, l'haltère tenu du côté de la jambe qui travaille, l'autre main sur la rampe. |

## Consignes
1. Tiens les haltères le long du corps, dos droit, regard devant ; une main sur le mur ou la rampe quand c'est prévu.
2. Monte sur la pointe des pieds le plus haut possible, chevilles droites.
3. Marque un court arrêt en haut en serrant les mollets.
4. Redescends lentement ; sur la marche, descends seulement jusqu'à une position étirée confortable.
5. Recommence sans rebondir, sans plier les genoux.

## Points d'attention
- Haltères légers pour apprendre le geste ; la charge de départ se règle par l'étalonnage (load-calibration.md).
- En cas de doute sur l'équilibre, reste au sol (échelon 1).
- Aucune durée, série, répétition ni intensité chiffrée (aucune valeur sourcée) : voir program-logic.md et load-calibration.md.

## Erreurs fréquentes
- Rebondir en bas.
- Chevilles qui basculent vers l'extérieur.
- Plier les genoux pour monter.

## Progression / régression
- plus-facile : aucun
- plus-dur : releve-mollets-halteres-marche, releve-mollets-halteres-une-jambe

## Repères de dosage
Voir program-logic.md et load-calibration.md. Aucune valeur propre à ce mouvement.

## Sécurité et contre-indications
Brouillon prudent de `coach` du 2026-10-22, à reprendre par `kine`. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Cheville | adapter: variante:releve-mollets-halteres-sol | adapter: variante:releve-mollets-halteres-sol | retirer |
| Genou | garder | adapter: variante:releve-mollets-halteres-sol | retirer |
| Dos | garder | adapter: charge:legere | retirer |

**Notes**
- cheville-n1 : au sol ; aucune augmentation de charge.
- cheville-n2 : même variante ; aucune augmentation (R2).
- grossesse : debout au sol, une main au mur ; pas de marche ni d'escalier (chute, équilibre). Post-partum : G7.

**Grossesse** : adapter: variante:releve-mollets-halteres-sol
**Version plus douce** : releve-mollets-halteres-sol

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) à la cheville, derrière le talon, au mollet, au genou ou au bas du dos.
- Perte d'équilibre, mouvement qui n'est plus contrôlé : arrête la série.
- Douleur qui dure, qui s'aggrave ou qui réveille la nuit, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2) ; ces signes n'ont pas à être « diagnostiqués » par toi.
- Si le réglage « enceinte / post-partum » est coché : saignement, perte de liquide, contractions, vertige, douleur ou gonflement d'un mollet, fuite d'urine ou pesanteur dans le bas-ventre : arrête et contacte ta sage-femme ou ton médecin (G6, G7) ; en cas de saignement, de perte des eaux ou de contractions régulières : urgence, voir U1.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Marche : la première marche d'un escalier éclairé et dégagé, rampe à portée, chaussures aux pieds ; jamais une marche plus haute (R8, §7). Descente lente.
- Haltères (R9) : fixes de préférence ; réglables seulement si disques et colliers sont serrés, vérifiés avant chaque série ; posés au sol hors des passages.

## Photo
- aucune photo (l'entrée free-exercise-db « Standing_Dumbbell_Calf_Raise » n'a pas été regardée)
- illustration : public/illustrations/releve-mollets-halteres.svg : affichable : non (à créer par dev : debout, haltères le long du corps, talons au sol puis levés)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Montée de mollets debout avec haltères | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db, entrée « Standing_Dumbbell_Calf_Raise » (niveau intermediate) ; données lues le 2026-10-22, images non regardées | base d'exercices (pratique, pas une étude) | 2026-10-22 | PROVISOIRE |
| Première marche seulement, éclairée et dégagée, rampe à portée, chaussures aux pieds | regles-securite-communes.md §7 ; aucune source lue | - | 2026-10-22 | NON SOURCÉ |
| Échelons, niveaux, muscles principaux et secondaires | choix de coach | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-22 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse, version plus douce et signes d'arrêt : brouillon prudent de coach, à reprendre par kine | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-22 | NON SOURCÉ (brouillon coach, à reprendre par kine) |
