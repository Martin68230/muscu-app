---
id: dips-aux-barres-paralleles
nom: Dips sur appuis parallèles
alias: [dips pectoraux, dips aux barres, chest dip]
schema: poussee_h
type: force
niveau_min: intermediaire
muscles_principaux: [pectoraux]
muscles_secondaires: [triceps, deltoides_anterieurs]
source_brouillon: []
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile. Échelons et niveaux : règles du convertisseur (hasan-vers-fiches.mjs), NON SOURCÉ, relus par `coach`.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| dips-aux-barres-paralleles-poids-du-corps | Poids du corps | 1 | intermediaire | poids_du_corps, materiel_specialise | En appui sur deux barres parallèles, bras tendus, buste légèrement penché vers l'avant. |
| dips-aux-barres-paralleles-maison | À la maison, barres de dips | 1 | intermediaire | barres_dips | Barres de dips solides (station stable ou barres murales fixées dans un mur porteur), testées de tout ton poids avant la série, assez hautes pour que tes pieds ne touchent pas le sol bras tendus ; sol dégagé et non glissant dessous. Bras tendus, buste légèrement penché vers l'avant. |

## Consignes
1. Place-toi en appui sur deux barres parallèles, les bras tendus, les jambes pliées derrière toi.
2. Penche légèrement le buste vers l'avant pour cibler la poitrine.
3. Plie les coudes pour descendre, jusqu'à ce que les épaules arrivent à hauteur des coudes.
4. Repousse les barres pour revenir bras tendus.

## Points d'attention
- Ne descends pas plus bas que les coudes à 90 degrés.
- Épaules basses, loin des oreilles.
- Mouvement lent et contrôlé.

## Erreurs fréquentes
- Descendre trop bas en arrondissant les épaules.
- Balancer les jambes pour monter.

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
| Épaule | retirer | retirer | retirer |
| Coude | adapter: amplitude:reduite | retirer | retirer |
| Poignet | adapter: amplitude:reduite | retirer | retirer |
| Dos | adapter: amplitude:reduite | retirer | retirer |
| Cou | garder | adapter: amplitude:tete-alignee | retirer |

**Notes**
- general : descends seulement jusqu'à ce que les coudes soient à angle droit, jamais plus bas ; épaules loin des oreilles.
- grossesse : retiré (choix prudent). post-partum : mêmes règles que la grossesse ; reprise des charges, des exercices abdominaux et des appuis prolongés seulement après l’avis de la sage-femme ou du médecin (G7).
- general : douleur pendant l’exercice : arrête, pas de progression (R4).

**Grossesse** : retirer
**Version plus douce** : aucune

**Signes qui doivent faire arrêter**
- Pincement, blocage ou douleur vive dans l'épaule : arrête et ne reprends pas ce geste.
- Douleur dans le coude (intérieur ou extérieur) : arrête.
- Douleur au poignet ou poignet qui plie sous la charge : arrête, pose la charge.
- Douleur (pas la simple brûlure du muscle qui travaille) : arrête (R4).
- Position qui ne se tient plus, perte d’équilibre ou de contrôle : arrête.
- Douleur qui dure, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2).
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Barres de dips à la maison : station sur sol plat qui ne bascule pas quand tu te penches ou que tes jambes bougent, ou barres murales vissées dans un mur porteur selon la notice ; charge maximale de la notice supérieure à ton poids ; vis et fixations vérifiées avant chaque séance ; jamais deux chaises, un plan de travail ou des meubles improvisés (R8).
- Barres parallèles : fixées à une structure stable, test en appuyant de tout ton poids avant la série ; sol non glissant, espace dégagé derrière toi pour descendre (R8).
- Sol sec et non glissant, chaussures aux pieds ; l’objet bouge, glisse ou grince : arrêt, et il n’est plus utilisé (R8).

## Photo
- gymvisual : 0251 : affichable : oui (image du jeu Gym visual importée localement par l’utilisateur ; aucun fichier dans le dépôt)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Nom, muscles, matériel, consignes (traduction abrégée) | jeu hasaneyldrm/exercises-dataset, texte sous licence MIT (page crédits) ; lot 2 | description de l’exercice, sans étude | 2026-11-15 | NON SOURCÉ |
| Niveau, échelons, dosage, tableau par zone, grossesse, signes d’arrêt | règles du convertisseur d’après les fiches existantes ; choix prudents ; aucune étude ne teste ces adaptations ; repris par kine le 2026-11-15 | avis d’expert (extrapolation) | 2026-11-15 | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U | knowledge/regles-securite-communes.md | voir ce fichier | 2026-11-15 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE |
| Consignes barres de dips à la maison (stabilité, fixation, notice, charge maximale, pas de meubles improvisés) | extrapolation de R8 (knowledge/regles-securite-communes.md) ; ajout kine le 2026-11-26 | avis d'expert (extrapolation) | 2026-11-26 | NON SOURCÉ |
