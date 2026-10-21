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
## Variantes (installation + matériel seulement)
| id variante | nom | materiel_tags | installation |
|---|---|---|---|
| squat-fendu-poids-du-corps | Poids du corps | poids_du_corps | Pieds décalés, un devant, un derrière. |
| squat-fendu-mur | Main au mur | poids_du_corps, mur | Une main posée au mur pour l'équilibre. |
| squat-fendu-halteres | Haltères | halteres | Un haltère dans chaque main, bras le long du corps. |

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
squat-assis-debout <- **squat-fendu** (mur -> poids du corps -> haltères) -> fente-arriere -> squat-bulgare

## Repères de dosage
Voir program-logic.md.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 : README.md du lot, section « Retour kine ». Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Zones non listées : garder. Plusieurs zones gênées : la règle la plus prudente s'applique.

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Genou | garder : version mur | adapter : squat-fendu-mur à mi-descente | retirer |
| Hanche | garder | adapter : squat-fendu-mur à mi-descente | retirer |
| Cheville | garder : version mur | adapter : amplitude réduite ou squat-assis-debout | retirer |

**Version plus douce** : `squat-fendu-mur` à mi-descente, ou `squat-assis-debout`.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au genou ou à la hanche.
- Genou arrière qui tape le sol.
- Perte d'équilibre répétée : main au mur.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
Aucune photo libre fidèle. Attention : la fiche free-exercise-db « Split_Squats » est une fente sautée (pliométrie) et « Split_Squat_with_Dumbbells » a le pied arrière surélevé (squat bulgare) : ne pas les utiliser ici.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Mouvement et consignes | Brouillon M1918 ; consignes rédigées par coach (la fiche source free-exercise-db décrit une version sautée) | pratique courante, pas d'étude | 2026-10-21 | NON SOURCÉ |
| Muscles (quadriceps ; mollets, fessiers, ischios) | free-exercise-db « Split_Squat_with_Dumbbells » et « Split_Squats » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Split_Squat_with_Dumbbells.json | base d'exercices (domaine public) | 2026-10-21 | PROVISOIRE |
| Squat fendu plus facile que la fente (pieds fixes) | choix de coach | - | - | NON SOURCÉ |
| Règles communes R1 à R10 (niveaux de gêne, arrêt si douleur, pas de progression, signes généraux, quand consulter) | README.md du lot, section « Retour kine » (sources détaillées : HAS 2019, NICE NG59, Smith 2017, Riebe 2015) | voir README | 2026-10-21 | PROVISOIRE |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au genou ou à la hanche de niveau 1-2 : adapter plutôt que tout retirer | Bannuru et al., OARSI 2019, Osteoarthritis Cartilage https://wrap.warwick.ac.uk/125416/ (exercice structuré = traitement de base de l'arthrose du genou et de la hanche) | recommandation internationale (méthode GRADE) ; résumé lu | 2026-10-21 | PROVISOIRE (extrapolation : public arthrosique ; l'app ne pose aucun diagnostic) |
