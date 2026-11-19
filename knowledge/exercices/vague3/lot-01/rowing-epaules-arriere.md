---
id: rowing-epaules-arriere
nom: Rowing épaules arrière
alias: [rear delt row, rowing deltoïde postérieur]
schema: tirage_h
type: force
niveau_min: debutant
muscles_principaux: [deltoides_posterieurs]
muscles_secondaires: [trapezes, rhomboides, biceps]
source_brouillon: []
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile. Échelons et niveaux : règles du convertisseur (hasan-vers-fiches.mjs), NON SOURCÉ, relus par `coach`.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| rowing-epaules-arriere-elastique | Avec un élastique | 1 | debutant | elastique | Debout, élastique sous les pieds, buste penché dos droit, poignées devant les genoux. |
| rowing-epaules-arriere-machine | Sur machine | 2 | intermediaire | machine | Assis face à la machine, poitrine appuyée, poignées tenues bras tendus. |
| rowing-epaules-arriere-barre-disques | À la barre | 2 | intermediaire | barre, disques | Debout, buste penché dos droit, barre tenue bras tendus devant les genoux. |

## Consignes
1. Tiens-toi debout, pieds écartés à la largeur des épaules, l'élastique sous les pieds.
2. Prends les poignées, penche le buste vers l'avant en poussant les fesses en arrière, dos droit.
3. Tire les poignées vers le haut de la poitrine en écartant les coudes sur les côtés.
4. Serre les omoplates en haut, puis redescends lentement.

## Points d'attention
- Les coudes partent vers l'extérieur, à hauteur des épaules.
- Dos droit, sans arrondir.
- Pense à serrer le haut du dos, pas à tirer avec les bras.

## Erreurs fréquentes
- Se redresser pour aider le mouvement.
- Tirer les coudes le long du corps.

## Progression / régression
- plus-facile : oiseau-elastique
- plus-dur : aucun

## Repères de dosage
Aucune valeur sourcée. Proposition du convertisseur, NON SOURCÉ, à valider par `kine` : 2 à 3 séries de 8 à 15 répétitions, réserve >= 2, repos 60 à 90 secondes.

## Sécurité et contre-indications
Cases posées par règles d’après les fiches du même schéma et du même muscle, puis reprises par `kine` le 2026-11-15 d’après le geste réel (nom, consignes, variantes, matériel). Prudence maximale en cas de doute. Les tableaux par zone sont NON SOURCÉS (choix prudents). Rien ici n’est un diagnostic.

**Contre-indications par zone** (1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder.

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: charge:legere | retirer | retirer |
| Épaule | adapter: amplitude:reduite | retirer | retirer |
| Poignet | adapter: charge:legere | retirer | retirer |
| Cou | adapter: amplitude:tete-alignee | adapter: amplitude:tete-alignee | retirer |
| Cuisse | garder | adapter: amplitude:reduite | retirer |
| Hanche | garder | adapter: amplitude:reduite | retirer |
| Coude | garder | adapter: charge:legere | retirer |

**Notes**
- grossesse : retiré (choix prudent). post-partum : mêmes règles que la grossesse ; reprise des charges, des exercices abdominaux et des appuis prolongés seulement après l’avis de la sage-femme ou du médecin (G7).
- general : douleur pendant l’exercice : arrête, pas de progression (R4).

**Grossesse** : retirer
**Version plus douce** : oiseau-elastique

**Signes qui doivent faire arrêter**
- Douleur ou tension vive dans le bas du dos, dos qui se creuse : arrête.
- Pincement, blocage ou douleur vive dans l'épaule : arrête et ne reprends pas ce geste.
- Douleur ou tiraillement vif à l'arrière de la cuisse : arrête.
- Douleur (pas la simple brûlure du muscle qui travaille) : arrête (R4).
- Position qui ne se tient plus, perte d’équilibre ou de contrôle : arrête.
- Douleur qui dure, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2).
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Élastique : sans fissure ni coupure, bien fixé ; s'il glisse ou casse, arrête (il peut fouetter le visage).
- Poulie ou machine : câble, goupille, poignée et réglage du siège contrôlés avant la série ; réglages faits avant de commencer.
- Barre et disques : disques bloqués par des colliers, vérifiés avant chaque série ; jamais au-dessus du visage ni derrière la tête sans supports ni aide (R9).
- Sol sec et non glissant, chaussures aux pieds ; l’objet bouge, glisse ou grince : arrêt, et il n’est plus utilisé (R8).

## Photo
- gymvisual : 1022 : affichable : oui (image du jeu Gym visual importée localement par l’utilisateur ; aucun fichier dans le dépôt)
- gymvisual : 0762 : affichable : oui (image du jeu Gym visual importée localement par l’utilisateur ; aucun fichier dans le dépôt)
- gymvisual : 0076 : affichable : oui (image du jeu Gym visual importée localement par l’utilisateur ; aucun fichier dans le dépôt)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Nom, muscles, matériel, consignes (traduction abrégée) | jeu hasaneyldrm/exercises-dataset, texte sous licence MIT (page crédits) ; lot 1 | description de l’exercice, sans étude | 2026-11-15 | NON SOURCÉ |
| Niveau, échelons, dosage, tableau par zone, grossesse, signes d’arrêt | règles du convertisseur d’après les fiches existantes ; choix prudents ; aucune étude ne teste ces adaptations ; repris par kine le 2026-11-15 | avis d’expert (extrapolation) | 2026-11-15 | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U | knowledge/regles-securite-communes.md | voir ce fichier | 2026-11-15 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE |
