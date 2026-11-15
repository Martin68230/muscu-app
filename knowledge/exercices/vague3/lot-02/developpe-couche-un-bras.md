---
id: developpe-couche-un-bras
nom: Développé couché un bras
alias: [développé couché unilatéral, développé un bras]
schema: poussee_h
type: force
niveau_min: intermediaire
muscles_principaux: [pectoraux]
muscles_secondaires: [deltoides_anterieurs, triceps, abdominaux]
source_brouillon: []
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile. Échelons et niveaux : règles du convertisseur (hasan-vers-fiches.mjs), NON SOURCÉ, relus par `coach`.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| developpe-couche-un-bras-poulie | À la poulie | 1 | intermediaire | poulie, swiss_ball | Haut du dos sur un gros ballon, poignée de poulie à hauteur de l'épaule, dos à la machine. |
| developpe-couche-un-bras-halteres | Aux haltères | 1 | intermediaire | halteres, swiss_ball | Haut du dos sur un gros ballon, hanches hautes, un haltère à hauteur d'épaule. |

## Consignes
1. Assieds-toi sur le ballon avec un haltère dans une main, puis avance les pieds jusqu'à ce que le haut du dos repose sur le ballon, les hanches à hauteur des genoux.
2. Tiens l'haltère près de l'épaule, le coude plié, la paume vers l'avant. Pose l'autre main sur le ventre.
3. Serre le ventre et les fessiers, et pousse l'haltère jusqu'à tendre le bras au-dessus de la poitrine.
4. Marque une pause, puis redescends lentement. Change de côté.

## Points d'attention
- Garde les hanches hautes et le corps stable sur le ballon.
- Ne laisse pas le ballon rouler d'un côté.
- Commence avec un haltère léger.

## Erreurs fréquentes
- Laisser les hanches s'affaisser.
- Prendre un haltère trop lourd qui fait tourner le buste.

## Progression / régression
- plus-facile : aucun
- plus-dur : aucun

## Repères de dosage
Aucune valeur sourcée. Proposition du convertisseur, NON SOURCÉ, à valider par `kine` : 2 à 3 séries de 8 à 15 répétitions, réserve >= 2, repos 60 à 90 secondes.

## Sécurité et contre-indications
Cases posées par règles d’après les fiches du même schéma et du même muscle, puis reprises par `kine` le 2026-11-15 d’après le geste réel (nom, consignes, variantes, matériel). Prudence maximale en cas de doute. Les tableaux par zone sont NON SOURCÉS (choix prudents). Rien ici n’est un diagnostic.

**Contre-indications par zone** (1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder.

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | adapter: amplitude:reduite | retirer | retirer |
| Cou | adapter: amplitude:tete-alignee | retirer | retirer |
| Dos | adapter: amplitude:reduite | retirer | retirer |
| Coude | adapter: charge:legere | retirer | retirer |
| Poignet | adapter: charge:legere | retirer | retirer |
| Hanche | garder | adapter: amplitude:reduite | retirer |
| Genou | garder | adapter: amplitude:reduite | retirer |

**Notes**
- general : un bras, haltère léger, ballon bloqué ; tête non soutenue, regard vers le plafond.
- grossesse : retiré (choix prudent). post-partum : mêmes règles que la grossesse ; reprise des charges, des exercices abdominaux et des appuis prolongés seulement après l’avis de la sage-femme ou du médecin (G7).
- general : douleur pendant l’exercice : arrête, pas de progression (R4).

**Grossesse** : retirer
**Version plus douce** : developpe-couche-halteres

**Signes qui doivent faire arrêter**
- Pincement, blocage ou douleur vive dans l'épaule : arrête et ne reprends pas ce geste.
- Douleur dans le cou, étourdissement ou fourmillements dans un bras : arrête la séance et ne reprends pas avant l'avis d'un professionnel de santé.
- Charge qui glisse, ballon qui roule ou équilibre qui part : arrête et pose la charge.
- Douleur (pas la simple brûlure du muscle qui travaille) : arrête (R4).
- Position qui ne se tient plus, perte d’équilibre ou de contrôle : arrête.
- Douleur qui dure, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2).
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Gros ballon : bien gonflé, sur un sol sec et non glissant, loin des meubles et des murs ; s'il roule, glisse ou se dégonfle, arrête et pose la charge (R8).
- Haltères : fixes de préférence ; réglables seulement avec disques serrés, vérifiés avant chaque série ; ne jamais lâcher un haltère au-dessus de soi (R9).
- Poulie ou machine : câble, goupille, poignée et réglage du siège contrôlés avant la série ; réglages faits avant de commencer.
- Sol sec et non glissant, chaussures aux pieds ; l’objet bouge, glisse ou grince : arrêt, et il n’est plus utilisé (R8).

## Photo
- gymvisual : 1267 : affichable : oui (image du jeu Gym visual importée localement par l’utilisateur ; aucun fichier dans le dépôt)
- gymvisual : 1290 : affichable : oui (image du jeu Gym visual importée localement par l’utilisateur ; aucun fichier dans le dépôt)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Nom, muscles, matériel, consignes (traduction abrégée) | jeu hasaneyldrm/exercises-dataset, texte sous licence MIT (page crédits) ; lot 2 | description de l’exercice, sans étude | 2026-11-15 | NON SOURCÉ |
| Niveau, échelons, dosage, tableau par zone, grossesse, signes d’arrêt | règles du convertisseur d’après les fiches existantes ; choix prudents ; aucune étude ne teste ces adaptations ; repris par kine le 2026-11-15 | avis d’expert (extrapolation) | 2026-11-15 | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U | knowledge/regles-securite-communes.md | voir ce fichier | 2026-11-15 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE |
