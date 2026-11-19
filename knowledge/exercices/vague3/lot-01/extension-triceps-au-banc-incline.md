---
id: extension-triceps-au-banc-incline
nom: Extension triceps au banc incliné
alias: [incline triceps extension, extension triceps incliné]
schema: poussee_h
type: force
niveau_min: intermediaire
muscles_principaux: [triceps]
muscles_secondaires: [deltoides_anterieurs]
source_brouillon: []
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile. Échelons et niveaux : règles du convertisseur (hasan-vers-fiches.mjs), NON SOURCÉ, relus par `coach`.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| extension-triceps-au-banc-incline-poulie | À la poulie | 1 | intermediaire | poulie, banc_inclinable | Assis sur un banc incliné face à la poulie basse, câble en main au-dessus de la tête. |
| extension-triceps-au-banc-incline-halteres-banc-inclinable | Aux haltères, banc incliné | 1 | intermediaire | halteres, banc_inclinable | Assis dos au dossier d'un banc à 45°, un haltère dans chaque main, bras tendus au-dessus de la poitrine. |

## Consignes
1. Règle un banc à 45° et assieds-toi, le dos bien appuyé au dossier, les pieds à plat.
2. Tiens la charge bras tendus au-dessus de ta poitrine.
3. Plie les coudes pour descendre la charge derrière ta tête, les coudes pointés vers le plafond.
4. Marque une pause, puis tends les bras pour revenir en haut.

## Points d'attention
- Seuls les avant-bras bougent, les coudes restent fixes.
- Coudes serrés, sans les écarter.
- Descends lentement : la charge ne doit jamais s'approcher de la tête avec vitesse.

## Erreurs fréquentes
- Écarter les coudes et basculer vers l'avant.
- Lâcher la charge en bas sans contrôle.

## Progression / régression
- plus-facile : extension-triceps-assis-halteres
- plus-dur : extension-triceps-barre-ez-allonge

## Repères de dosage
Aucune valeur sourcée. Proposition du convertisseur, NON SOURCÉ, à valider par `kine` : 2 à 3 séries de 8 à 15 répétitions, réserve >= 2, repos 60 à 90 secondes.

## Sécurité et contre-indications
Cases posées par règles d’après les fiches du même schéma et du même muscle, puis reprises par `kine` le 2026-11-15 d’après le geste réel (nom, consignes, variantes, matériel). Prudence maximale en cas de doute. Les tableaux par zone sont NON SOURCÉS (choix prudents). Rien ici n’est un diagnostic.

**Contre-indications par zone** (1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder.

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Coude | adapter: charge:legere | retirer | retirer |
| Épaule | adapter: amplitude:reduite | retirer | retirer |
| Poignet | adapter: charge:legere | retirer | retirer |
| Dos | adapter: charge:legere | retirer | retirer |
| Cou | garder | adapter: amplitude:tete-alignee | retirer |

**Notes**
- general : charge derrière la tête, la plus légère possible.
- grossesse : retiré (choix prudent). post-partum : mêmes règles que la grossesse ; reprise des charges, des exercices abdominaux et des appuis prolongés seulement après l’avis de la sage-femme ou du médecin (G7).
- general : douleur pendant l’exercice : arrête, pas de progression (R4).

**Grossesse** : retirer
**Version plus douce** : extension-triceps-assis-halteres

**Signes qui doivent faire arrêter**
- Douleur dans le coude (intérieur ou extérieur) : arrête.
- Pincement, blocage ou douleur vive dans l'épaule : arrête et ne reprends pas ce geste.
- Charge qui glisse, ballon qui roule ou équilibre qui part : arrête et pose la charge.
- Douleur (pas la simple brûlure du muscle qui travaille) : arrête (R4).
- Position qui ne se tient plus, perte d’équilibre ou de contrôle : arrête.
- Douleur qui dure, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2).
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Banc : stable, qui ne bouge pas ni ne bascule, inclinaison bloquée avant de s'installer ; sol sec et non glissant, chaussures aux pieds (R8).
- Haltères : fixes de préférence ; réglables seulement avec disques serrés, vérifiés avant chaque série ; ne jamais lâcher un haltère au-dessus de soi (R9).
- Poulie ou machine : câble, goupille, poignée et réglage du siège contrôlés avant la série ; réglages faits avant de commencer.
- Sol sec et non glissant, chaussures aux pieds ; l’objet bouge, glisse ou grince : arrêt, et il n’est plus utilisé (R8).

## Photo
- gymvisual : 0173 : affichable : oui (image du jeu Gym visual importée localement par l’utilisateur ; aucun fichier dans le dépôt)
- gymvisual : 0330 : affichable : oui (image du jeu Gym visual importée localement par l’utilisateur ; aucun fichier dans le dépôt)
- gymvisual : 0449 : affichable : oui (image du jeu Gym visual importée localement par l’utilisateur ; aucun fichier dans le dépôt)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Nom, muscles, matériel, consignes (traduction abrégée) | jeu hasaneyldrm/exercises-dataset, texte sous licence MIT (page crédits) ; lot 1 | description de l’exercice, sans étude | 2026-11-15 | NON SOURCÉ |
| Niveau, échelons, dosage, tableau par zone, grossesse, signes d’arrêt | règles du convertisseur d’après les fiches existantes ; choix prudents ; aucune étude ne teste ces adaptations ; repris par kine le 2026-11-15 | avis d’expert (extrapolation) | 2026-11-15 | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U | knowledge/regles-securite-communes.md | voir ce fichier | 2026-11-15 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE |
