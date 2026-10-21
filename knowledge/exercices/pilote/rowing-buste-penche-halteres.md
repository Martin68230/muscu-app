---
id: rowing-buste-penche-halteres
nom: Rowing buste penché aux haltères
schema: tirage_h
type: force
niveau_min: debutant
muscles_principaux: [grand_dorsal, rhomboides, trapezes]
muscles_secondaires: [biceps, deltoides_posterieurs, erecteurs_rachis, ischios]
source_brouillon: [M0407, M0404]
statut: complete_kine
---
## Variantes (installation + matériel seulement)
| id variante | nom | materiel_tags | installation |
|---|---|---|---|
| rowing-penche-paumes-arriere | Paumes vers l'arrière | halteres | Debout, un haltère dans chaque main. |
| rowing-penche-paumes-face | Paumes face à face | halteres | Même installation, paumes tournées l'une vers l'autre. |

## Consignes
1. Debout, genoux souples, haltères en main.
2. Penche le buste en avant depuis les hanches, dos plat.
3. Les haltères pendent sous les épaules.
4. Tire les deux haltères vers les côtés du ventre, coudes près du corps.
5. Serre les omoplates en haut, puis redescends lentement.

## Points d'attention
- Dos plat pendant toute la série.
- Le buste ne se relève pas à chaque répétition.
- Nuque dans l'alignement du dos.
- Si le bas du dos fatigue, prends le rowing à un bras avec appui.

## Erreurs fréquentes
- Dos qui s'arrondit.
- Se redresser pour donner de l'élan.
- Hausser les épaules vers les oreilles.

## Progression / régression
rowing-unilateral-haltere <- **rowing-buste-penche-halteres**

## Repères de dosage
Voir program-logic.md.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 : README.md du lot, section « Retour kine ». Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Zones non listées : garder. Plusieurs zones gênées : la règle la plus prudente s'applique.

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter : rowing-unilateral-haltere (avec appui) | adapter : rowing-unilateral-haltere léger | retirer |
| Hanche | garder | adapter : rowing-unilateral-haltere | retirer |
| Épaule | garder | adapter : charge plus légère, amplitude réduite | retirer |
| Coude / poignet | garder | adapter : charge plus légère, rowing-penche-paumes-face | retirer |

**Version plus douce** : `rowing-unilateral-haltere`.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au bas du dos.
- Dos qui s'arrondit ou buste qui se relève à chaque répétition.
- Douleur, fourmillements qui descendent dans la jambe.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
free-exercise-db : `Bent_Over_Two-Dumbbell_Row/0.jpg`, `Bent_Over_Two-Dumbbell_Row/1.jpg` (domaine public). Variante paumes face à face : la fiche « Bent_Over_Two-Dumbbell_Row_With_Palms_In » existe probablement (brouillon M0404) mais n'a pas été vérifiée.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Genoux souples, buste penché presque à l'horizontale depuis les hanches, dos droit, haltères tirés vers les côtés coudes près du corps, pause et descente contrôlée | free-exercise-db « Bent_Over_Two-Dumbbell_Row » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Bent_Over_Two-Dumbbell_Row.json ; réécrit par coach | base d'exercices (domaine public), pas d'étude | 2026-10-21 | PROVISOIRE |
| Muscles (milieu du dos ; biceps, grand dorsal, épaules) | même fiche ; bas du dos et ischios (maintien) ajoutés par coach | idem | 2026-10-21 | PROVISOIRE |
| Repli vers la version avec appui si le bas du dos fatigue | choix de coach | - | - | NON SOURCÉ |
| Règles communes R1 à R10 (niveaux de gêne, arrêt si douleur, pas de progression, signes généraux, quand consulter) | README.md du lot, section « Retour kine » (sources détaillées : HAS 2019, NICE NG59, Smith 2017, Riebe 2015) | voir README | 2026-10-21 | PROVISOIRE |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://www.has-sante.fr/jcms/c_2961499/fr/prise-en-charge-du-patient-presentant-une-lombalgie-commune (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; lues via résumés et synthèses (PDF HAS non ouvert : erreur de certificat) | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
