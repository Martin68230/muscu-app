---
id: traction-prise-neutre
nom: Traction prise neutre
alias: [traction mains parallèles, traction prise marteau]
schema: tirage_v
type: force
niveau_min: intermediaire
muscles_principaux: [grand_dorsal]
muscles_secondaires: [biceps, avant_bras]
source_brouillon: []
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile. Échelons et niveaux : règles du convertisseur (hasan-vers-fiches.mjs), NON SOURCÉ, relus par `coach`.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| traction-prise-neutre-barre-traction | Aux poignées parallèles de la barre | 1 | intermediaire | barre_traction | Suspendu aux poignées parallèles, paumes face à face, bras tendus, épaules abaissées. |

## Consignes
1. Suspends-toi à une barre de traction avec une prise neutre (paumes tournées l'une vers l'autre) et les bras complètement étendus.
2. Gaine ta sangle abdominale et resserre tes omoplates.
3. Tire ton corps vers le haut en direction de la barre en fléchissant tes coudes et en les entraînant vers le bas en direction de tes hanches.
4. Continue à tirer jusqu'à ce que ton menton soit au-dessus de la barre.
5. Marque une pause en haut, puis abaisse lentement ton corps pour revenir à la position de départ avec contrôle.

## Points d'attention

- Abaisse les omoplates avant de plier les coudes.
- Redescends en 2 à 3 secondes, sans te laisser tomber.

## Erreurs fréquentes

- Donner de l'élan avec les jambes.
- Ne pas tendre les bras complètement en bas.

## Progression / régression

- plus-facile : traction-assistee-machine, traction-negative-barre
- plus-dur : traction-gilet-lest

## Repères de dosage
Aucune valeur sourcée. Proposition du convertisseur, NON SOURCÉ, à valider par `kine` : 2 à 3 séries de 8 à 15 répétitions, réserve >= 2, repos 60 à 90 secondes.

## Sécurité et contre-indications
Cases relues par `kine` le 2026-11-15 d'après le geste réel (nom, consignes, variantes, matériel) ; elles avaient été posées par règles d'après les fiches existantes du même schéma. Prudence maximale en cas de doute. Les tableaux par zone sont NON SOURCÉS (choix prudents). Rien ici n'est un diagnostic.

**Contre-indications par zone** (1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder.

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | adapter: amplitude:reduite | retirer | retirer |
| Coude | adapter: amplitude:reduite | adapter: amplitude:reduite | retirer |
| Poignet | adapter: amplitude:reduite | retirer | retirer |
| Dos | garder | adapter: amplitude:reduite | retirer |
| Cou | garder | adapter: amplitude:tete-alignee | retirer |

**Notes**
- epaule-n1 : ne te laisse pas pendre bras tendus, épaules relevées ; reste en suspension active (épaules basses) et passe à la traction assistée à la machine si tu la préfères.
- general : suspension : jamais de balancement ni d'élan, descente lente ; ne dépasse pas les répétitions que tu contrôles proprement ; pas de tirage derrière la nuque.
- grossesse : retiré (suspension, risque de chute). post-partum : mêmes règles que la grossesse ; reprise des charges, des exercices abdominaux et des appuis prolongés seulement après l'avis de la sage-femme ou du médecin (G7).
- poignet-n1 : poignées parallèles : garde le poignet droit.
- general : douleur pendant l'exercice : arrête, pas de progression (R4).

**Grossesse** : retirer
**Version plus douce** : traction-assistee-machine

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) : arrête (R4).
- Position qui ne se tient plus, perte d'équilibre ou de contrôle : arrête.
- Douleur ou pincement dans l'épaule (devant ou en haut) en montant ou en descendant : arrête.
- Engourdissement, fourmillements ou main qui lâche : arrête, pose les pieds ou redescends en contrôle, consulte si cela revient (S2).
- Prise qui glisse, bras qui ne contrôlent plus la descente : redescends tout de suite.
- Douleur dans le cou, maux de tête ou vertige, même léger, pendant ou après l'exercice, y compris en se relevant : arrête, reste assis et ne reprends pas avant un avis (C4).
- Douleur qui dure, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2).
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Barre de traction : fixée solidement selon la notice du fabricant (mur porteur ou cadre prévu pour), testée en tirant de tout ton poids avant chaque séance, pieds au sol ; jamais sur une cloison, un cadre de porte fragile ou un meuble ; sol dégagé dessous (R8).
- Pour monter et redescendre : marche ou chaise stable et calée ; descends en contrôle, ne saute pas sur un sol dur ; pas de bague ni de montre qui accroche la barre.

## Photo
- gymvisual : 0651 : affichable : oui (image du jeu Gym visual importée localement par l’utilisateur ; aucun fichier dans le dépôt)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Nom, muscles, matériel, consignes (traduction abrégée) | jeu hasaneyldrm/exercises-dataset, texte sous licence MIT (page crédits) ; lot 3 | description de l’exercice, sans étude | 2026-11-15 | NON SOURCÉ |
| Niveau, échelons, dosage, tableau par zone, grossesse, signes d’arrêt | règles du convertisseur d’après les fiches existantes ; choix prudents ; aucune étude ne teste ces adaptations ; repris par kine le 2026-11-15 | avis d’expert (extrapolation) | 2026-11-15 | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U | knowledge/regles-securite-communes.md | voir ce fichier | 2026-11-15 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE |
