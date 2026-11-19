---
id: squat-sur-une-jambe
nom: Squat sur une jambe
alias: [squat unilatéral]
schema: squat
type: force
niveau_min: avance
muscles_principaux: [fessiers]
muscles_secondaires: [quadriceps, ischios, mollets]
source_brouillon: []
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile. Échelons et niveaux : règles du convertisseur (hasan-vers-fiches.mjs), NON SOURCÉ, relus par `coach`.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| squat-sur-une-jambe-poids-du-corps | Poids du corps | 1 | avance | poids_du_corps | Debout près d'un support stable pour t'équilibrer, une jambe tendue devant toi. |
| squat-sur-une-jambe-halteres | Aux haltères | 2 | avance | halteres | Même position, un haltère léger tenu contre la poitrine. |

## Consignes
1. Tiens-toi debout près d'un support stable, sur une jambe, l'autre tendue devant toi.
2. Garde la poitrine haute et le ventre serré.
3. Fléchis la jambe d'appui et descends comme pour t'asseoir sur une chaise.
4. Descends seulement tant que tu gardes l'équilibre et le talon au sol.
5. Pousse sur le talon pour remonter, puis change de jambe.

## Points d'attention
- Garde une main près d'un support stable au début.
- Le genou reste dans l'axe du pied, sans rentrer vers l'intérieur.

## Erreurs fréquentes
- Descendre plus bas que ce que tu contrôles.
- Décoller le talon de la jambe d'appui.

## Progression / régression
- plus-facile : descente-une-jambe-chaise
- plus-dur : aucun

## Repères de dosage
Aucune valeur sourcée. Proposition du convertisseur, NON SOURCÉ, à valider par `kine` : 2 à 3 séries de 8 à 15 répétitions, réserve >= 2, repos 60 à 90 secondes.

## Sécurité et contre-indications
Reprise par `kine` le 2026-11-15 d’après le geste réel décrit dans les consignes : zones réellement sollicitées, une action par case, jamais plus permissif en montant de niveau, niveau 3 = retirer. Les tableaux par zone sont NON SOURCÉS (choix prudents, extrapolation). Rien ici n’est un diagnostic.

**Contre-indications par zone** (1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder.

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Genou | adapter: amplitude:reduite | retirer | retirer |
| Hanche | adapter: amplitude:reduite | retirer | retirer |
| Dos | adapter: amplitude:reduite | retirer | retirer |
| Cheville | adapter: amplitude:reduite | retirer | retirer |
| Cuisse | garder | adapter: amplitude:reduite | retirer |
| Aine | garder | adapter: amplitude:reduite | retirer |

**Notes**
- grossesse : retiré (choix prudent). post-partum : mêmes règles que la grossesse ; reprise des charges, des exercices abdominaux et des appuis prolongés seulement après l’avis de la sage-femme ou du médecin (G7).
- general : douleur pendant l’exercice : arrête, pas de progression (R4).

**Grossesse** : retirer
**Version plus douce** : descente-une-jambe-chaise

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) : arrête (R4).
- Position qui ne se tient plus, perte d’équilibre ou de contrôle : arrête.
- Douleur qui dure, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2).
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Douleur à l’avant ou à l’intérieur du genou, ou genou qui rentre vers l’intérieur : arrête.
- Talon qui décolle ou dos qui s’arrondit nettement : arrête la répétition.

**Objets du quotidien**
- Support de mains stable qui ne bouge pas (montant de porte, plan de travail fixé) ; jamais une chaise à roulettes ; sol sec et non glissant, chaussures aux pieds (R8).

## Photo
- gymvisual : 1476 : affichable : oui (image du jeu Gym visual importée localement par l’utilisateur ; aucun fichier dans le dépôt)
- gymvisual : 0411 : affichable : oui (image du jeu Gym visual importée localement par l’utilisateur ; aucun fichier dans le dépôt)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Nom, muscles, matériel, consignes (traduction abrégée) | jeu hasaneyldrm/exercises-dataset, texte sous licence MIT (page crédits) ; lot 4 | description de l’exercice, sans étude | 2026-11-15 | NON SOURCÉ |
| Niveau, échelons, dosage, tableau par zone, grossesse, signes d’arrêt ; repris par kine le 2026-11-15 | règles du convertisseur d’après les fiches existantes ; choix prudents ; aucune étude ne teste ces adaptations | avis d’expert (extrapolation) | 2026-11-15 | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U | knowledge/regles-securite-communes.md | voir ce fichier | 2026-11-15 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE |
