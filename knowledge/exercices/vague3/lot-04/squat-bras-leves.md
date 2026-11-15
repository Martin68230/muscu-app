---
id: squat-bras-leves
nom: Squat bras levés
alias: [squat reach, squat bras tendus]
schema: squat
type: force
niveau_min: debutant
muscles_principaux: [quadriceps]
muscles_secondaires: [fessiers, ischios, abdominaux]
source_brouillon: []
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile. Échelons et niveaux : règles du convertisseur (hasan-vers-fiches.mjs), NON SOURCÉ, relus par `coach`.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| squat-bras-leves-poids-du-corps | Poids du corps | 1 | debutant | poids_du_corps | Debout, de la place autour de toi pour lever les bras. |

## Consignes
1. Tiens-toi debout, les pieds écartés à la largeur des épaules, les bras le long du corps.
2. Pousse les hanches vers l'arrière et fléchis les genoux pour descendre en squat.
3. En remontant, lève les bras tendus au-dessus de la tête.
4. Redescends en baissant les bras et en fléchissant les genoux.
5. Garde la poitrine haute pendant tout le mouvement.

## Points d'attention
- Garde les genoux dans l'axe des pieds.
- Si les bras levés tirent sur les épaules, lève-les moins haut.

## Erreurs fréquentes
- Cambrer le bas du dos en levant les bras.
- Décoller les talons en descendant.

## Progression / régression
- plus-facile : squat-avec-appui
- plus-dur : aucun

## Repères de dosage
Aucune valeur sourcée. Proposition du convertisseur, NON SOURCÉ, à valider par `kine` : 2 à 3 séries de 8 à 15 répétitions, réserve >= 2, repos 60 à 90 secondes.

## Sécurité et contre-indications
Reprise par `kine` le 2026-11-15 d’après le geste réel décrit dans les consignes : zones réellement sollicitées, une action par case, jamais plus permissif en montant de niveau, niveau 3 = retirer. Les tableaux par zone sont NON SOURCÉS (choix prudents, extrapolation). Rien ici n’est un diagnostic.

**Contre-indications par zone** (1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder.

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Genou | adapter: amplitude:reduite | retirer | retirer |
| Hanche | garder | adapter: amplitude:reduite | retirer |
| Dos | garder | adapter: amplitude:reduite | retirer |
| Cheville | garder | adapter: amplitude:reduite | retirer |
| Épaule | adapter: amplitude:bras-bas | adapter: amplitude:bras-bas | retirer |

**Notes**
- grossesse : version à amplitude réduite, sans douleur, sans retenir ta respiration, sans aller au bout de l’étirement ; en cas de gêne dans le bassin ou le pubis, arrête. post-partum : mêmes règles ; reprise après l’avis de la sage-femme ou du médecin (G7).
- general : douleur pendant l’exercice : arrête, pas de progression (R4).

**Grossesse** : adapter: amplitude:reduite
**Version plus douce** : squat-avec-appui

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) : arrête (R4).
- Position qui ne se tient plus, perte d’équilibre ou de contrôle : arrête.
- Douleur qui dure, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2).
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Douleur à l’avant ou à l’intérieur du genou, ou genou qui rentre vers l’intérieur : arrête.
- Talon qui décolle ou dos qui s’arrondit nettement : arrête la répétition.

**Objets du quotidien**
- Sol sec et non glissant, chaussures ou pieds antidérapants, de la place autour de toi (R8).

## Photo
- gymvisual : 1685 : affichable : oui (image du jeu Gym visual importée localement par l’utilisateur ; aucun fichier dans le dépôt)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Nom, muscles, matériel, consignes (traduction abrégée) | jeu hasaneyldrm/exercises-dataset, texte sous licence MIT (page crédits) ; lot 4 | description de l’exercice, sans étude | 2026-11-15 | NON SOURCÉ |
| Niveau, échelons, dosage, tableau par zone, grossesse, signes d’arrêt ; repris par kine le 2026-11-15 | règles du convertisseur d’après les fiches existantes ; choix prudents ; aucune étude ne teste ces adaptations | avis d’expert (extrapolation) | 2026-11-15 | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U | knowledge/regles-securite-communes.md | voir ce fichier | 2026-11-15 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE |
