---
id: fente-arriere
nom: Fente arrière
schema: fente
type: force
niveau_min: debutant
muscles_principaux: [quadriceps, fessiers]
muscles_secondaires: [ischios, adducteurs, mollets]
source_brouillon: [M1599, M1598]
statut: complete_kine
---
## Variantes (installation + matériel seulement)
| id variante | nom | materiel_tags | installation |
|---|---|---|---|
| fente-arriere-poids-du-corps | Poids du corps | poids_du_corps | Debout, espace dégagé derrière toi. |
| fente-arriere-mur | Main au mur | poids_du_corps, mur | Une main posée au mur pour l'équilibre. |
| fente-arriere-halteres | Haltères | halteres | Un haltère dans chaque main, bras le long du corps. |

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
- Pas assez long pour que le tibia avant reste à peu près vertical.

## Erreurs fréquentes
- Pas trop court : le genou avant part loin devant.
- Genou arrière qui cogne le sol.
- Buste qui bascule en avant.

## Progression / régression
squat-fendu <- **fente-arriere** (mur -> poids du corps -> haltères) -> squat-bulgare

## Repères de dosage
Voir program-logic.md.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 : README.md du lot, section « Retour kine ». Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Zones non listées : garder. Plusieurs zones gênées : la règle la plus prudente s'applique.

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Genou | garder : version mur, amplitude sans gêne | adapter : squat-fendu-mur, amplitude réduite | retirer |
| Hanche | garder | adapter : squat-fendu-mur, petit pas | retirer |
| Cheville | adapter : fente-arriere-mur | adapter : squat-fendu-mur (pieds immobiles) | retirer |

**Version plus douce** : `squat-fendu-mur`.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au genou ou à la hanche.
- Genou arrière qui tape le sol : descends moins bas.
- Perte d'équilibre répétée : main au mur.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
Variante haltères : free-exercise-db `Dumbbell_Rear_Lunge/0.jpg`, `Dumbbell_Rear_Lunge/1.jpg` (domaine public). Autres variantes : aucune photo libre (la photo haltères peut illustrer le geste).

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Grand pas en arrière, descente jusqu'au tibia avant vertical, buste droit, retour en poussant sur le pied avant | free-exercise-db « Dumbbell_Rear_Lunge » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Dumbbell_Rear_Lunge.json ; réécrit par coach | base d'exercices (domaine public), pas d'étude | 2026-10-21 | PROVISOIRE |
| Muscles (quadriceps ; mollets, fessiers, ischios) | même fiche ; adducteurs ajoutés par coach | idem | 2026-10-21 | PROVISOIRE |
| Fente arrière plus facile à doser que la fente avant | choix de coach | - | - | NON SOURCÉ |
| Règles communes R1 à R10 (niveaux de gêne, arrêt si douleur, pas de progression, signes généraux, quand consulter) | README.md du lot, section « Retour kine » (sources détaillées : HAS 2019, NICE NG59, Smith 2017, Riebe 2015) | voir README | 2026-10-21 | PROVISOIRE |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au genou ou à la hanche de niveau 1-2 : adapter plutôt que tout retirer | Bannuru et al., OARSI 2019, Osteoarthritis Cartilage https://wrap.warwick.ac.uk/125416/ (exercice structuré = traitement de base de l'arthrose du genou et de la hanche) | recommandation internationale (méthode GRADE) ; résumé lu | 2026-10-21 | PROVISOIRE (extrapolation : public arthrosique ; l'app ne pose aucun diagnostic) |
