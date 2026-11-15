---
id: presse-a-cuisses
nom: Presse à cuisses
alias: [leg press]
schema: squat
type: force
niveau_min: intermediaire
muscles_principaux: [quadriceps, fessiers]
muscles_secondaires: [ischios, mollets]
source_brouillon: []
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile. Échelons et niveaux : règles du convertisseur (hasan-vers-fiches.mjs), NON SOURCÉ, relus par `coach`.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| presse-a-cuisses-machine | Sur machine | 1 | intermediaire | machine | Dos et fesses bien appuyés sur le dossier, pieds à plat sur la plaque, à la largeur des épaules. |

## Consignes
1. Règle le siège et le repose-pieds pour être bien installé, le dos contre le dossier.
2. Pose les pieds à plat sur la plaque, écartés à la largeur des épaules.
3. Saisis les poignées pour te stabiliser.
4. Pousse la plaque en tendant les jambes, sans verrouiller les genoux.
5. Fléchis lentement les genoux pour ramener la plaque vers toi, sans que le bassin décolle du dossier.

## Points d'attention
- Garde les fesses et le bas du dos contre le dossier à tout moment.
- Ne verrouille pas complètement les genoux en haut ; commence avec une charge légère.

## Erreurs fréquentes
- Descendre si bas que le bassin se décolle et que le dos s'arrondit.
- Rapprocher les genoux l'un de l'autre en poussant.

## Progression / régression
- plus-facile : squat-poids-du-corps
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
| Cuisse | garder | adapter: amplitude:reduite | retirer |
| Aine | garder | adapter: amplitude:reduite | retirer |
| Cheville | garder | adapter: amplitude:reduite | retirer |

**Notes**
- grossesse : retiré (choix prudent). post-partum : mêmes règles que la grossesse ; reprise des charges, des exercices abdominaux et des appuis prolongés seulement après l’avis de la sage-femme ou du médecin (G7).
- general : douleur pendant l’exercice : arrête, pas de progression (R4).

**Grossesse** : retirer
**Version plus douce** : squat-poids-du-corps

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) : arrête (R4).
- Position qui ne se tient plus, perte d’équilibre ou de contrôle : arrête.
- Douleur qui dure, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2).
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Douleur dans le genou, la hanche ou le dos : arrête et pose la charge ; ne verrouille jamais les genoux.
- Bassin qui décolle du dossier ou charge qu’on ne contrôle plus : arrête.

**Objets du quotidien**
- Machine de salle : butées de sécurité et sièges réglés avant la série, prise en main du réglage par le personnel de la salle si besoin (R8).

## Photo
- gymvisual : 0760 : affichable : oui (image du jeu Gym visual importée localement par l’utilisateur ; aucun fichier dans le dépôt)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Nom, muscles, matériel, consignes (traduction abrégée) | jeu hasaneyldrm/exercises-dataset, texte sous licence MIT (page crédits) ; lot 4 | description de l’exercice, sans étude | 2026-11-15 | NON SOURCÉ |
| Niveau, échelons, dosage, tableau par zone, grossesse, signes d’arrêt ; repris par kine le 2026-11-15 | règles du convertisseur d’après les fiches existantes ; choix prudents ; aucune étude ne teste ces adaptations | avis d’expert (extrapolation) | 2026-11-15 | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U | knowledge/regles-securite-communes.md | voir ce fichier | 2026-11-15 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE |
