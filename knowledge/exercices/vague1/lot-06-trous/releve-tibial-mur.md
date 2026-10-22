---
id: releve-tibial-mur
nom: Relevé des pointes de pieds (devant de la jambe)
schema: cheville_mollet
type: fonctionnel
niveau_min: debutant
muscles_principaux: [peroniers]
muscles_secondaires: []
source_brouillon: []
statut: brouillon_coach
---
## Pourquoi cette fiche
Travaille le muscle du devant de la jambe (tibial antérieur), qui relève la pointe du pied. Ce muscle n'est pas dans la liste des muscles de knowledge/format-fiches.md : rattaché provisoirement à `peroniers` (muscles de la jambe), à corriger par `dev` si on ajoute un muscle.

## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| releve-tibial-assis | Assis, talons au sol | 1 | debutant | poids_du_corps, chaise | Assis sur une chaise stable, talons au sol, pointes de pieds levées puis reposées. |
| releve-tibial-mur-deux-pieds | Debout, dos au mur, deux pieds | 1 | debutant | poids_du_corps, mur | Debout, dos et fesses contre le mur, talons à la distance d'un petit pas du mur, jambes tendues. |
| releve-tibial-mur-un-pied | Debout, dos au mur, un pied | 2 | debutant | poids_du_corps, mur | Même position ; un seul pied lève la pointe, l'autre reste à plat. |

## Consignes
1. Installe-toi comme indiqué (assis, ou dos au mur) en gardant les talons au sol.
2. Relève les pointes de pieds vers les tibias, le plus haut possible, sans plier les genoux ni décoller le dos du mur.
3. Marque un court arrêt en haut.
4. Redescends lentement jusqu'au sol, sans claquer les pieds.
5. Recommence en gardant le mouvement fluide.

## Points d'attention
- Les orteils restent détendus : ce sont les chevilles qui bougent.
- Dos au mur : chaussures antidérapantes ou pieds nus sur un sol non glissant.
- Aucune durée, série, répétition ni intensité chiffrée (aucune valeur sourcée) : voir program-logic.md et load-calibration.md.

## Erreurs fréquentes
- Plier les genoux pour compenser.
- Décoller les talons du sol.
- Aller trop vite et claquer les pieds.

## Progression / régression
- plus-facile : aucun
- plus-dur : releve-tibial-mur-un-pied

## Repères de dosage
Voir program-logic.md et load-calibration.md. Aucune valeur propre à ce mouvement.

## Sécurité et contre-indications
Brouillon prudent de `coach` du 2026-10-22, à reprendre par `kine`. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Cheville | adapter: amplitude:reduite | adapter: variante:releve-tibial-assis | retirer |
| Genou | garder | garder | retirer |
| Dos | garder | adapter: variante:releve-tibial-assis | retirer |

**Notes**
- cheville-n1 : amplitude plus courte, sans forcer en haut.
- cheville-n2 : assis, aucune augmentation (R2).
- grossesse : debout dos au mur ou assis : sans particularité, chaise ou mur à portée. Post-partum : G7.

**Grossesse** : garder
**Version plus douce** : releve-tibial-assis

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) à la cheville, au devant du tibia, au genou ou au bas du dos.
- Perte d'équilibre, mouvement qui n'est plus contrôlé : arrête la série.
- Douleur qui dure, qui s'aggrave ou qui réveille la nuit, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2) ; ces signes n'ont pas à être « diagnostiqués » par toi.
- Si le réglage « enceinte / post-partum » est coché : saignement, perte de liquide, contractions, vertige, douleur ou gonflement d'un mollet, fuite d'urine ou pesanteur dans le bas-ventre : arrête et contacte ta sage-femme ou ton médecin (G6, G7) ; en cas de saignement, de perte des eaux ou de contractions régulières : urgence, voir U1.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Mur plein, sans radiateur ni saillie dans le dos ; sol non glissant.
- Chaise stable, sans roulettes (variante assise).

## Photo
- aucune photo (l'entrée free-exercise-db « Anterior_Tibialis-SMR » est un massage au rouleau, pas ce mouvement)
- illustration : public/illustrations/releve-tibial-mur.svg : affichable : oui (illustration originale de l'app ; dos au mur, pieds avancés ; pointes de pieds levées)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Relevé des pointes de pieds pour le muscle du devant de la jambe | aucune source lue (l'entrée free-exercise-db « Anterior_Tibialis-SMR » est un massage, non reprise) ; description de coach | - | - | NON SOURCÉ |
| Rôle du tibial antérieur (relève la pointe du pied) | connaissance générale d'anatomie, aucune source lue | - | - | NON SOURCÉ |
| Échelons, niveaux, muscles principaux et secondaires | choix de coach | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-22 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse, version plus douce et signes d'arrêt : brouillon prudent de coach, à reprendre par kine | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-22 | NON SOURCÉ (brouillon coach, à reprendre par kine) |
