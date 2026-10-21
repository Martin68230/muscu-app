---
id: tirage-sous-table
nom: Tirage allongé sous une table
schema: tirage_h
type: force
niveau_min: debutant
muscles_principaux: [grand_dorsal, rhomboides, trapezes]
muscles_secondaires: [biceps, deltoides_posterieurs, abdominaux]
source_brouillon: [M1436]
statut: complete_kine
ecartee: 2026-10-21
---
## ÉCARTÉE du lot pilote (décision de l'utilisateur, 21/10/2026)
**Cette fiche n'est pas utilisée, ni par le générateur ni par la bibliothèque.** Elle est conservée ici pour mémoire. Raison : le contrôle de `relecteur` (CONTROLE-relecteur.md) a relevé 3 points bloquants.
1. Point 35 : l'avertissement de `coach` (« teste-la d'abord en tirant doucement ») se fait allongé sous la table, donc dans la situation dangereuse ; il contredit le test debout de `kine`.
2. Point 36 : le raisonnement mécanique sur le sens de la force est faux ; le test de soulèvement debout ne teste pas le vrai mode d'accident (basculement vers la personne quand les mains sont sur un débord au-delà des pieds). La seule condition fiable serait « mains entre les pieds, jamais sur un débord », à spécifier avec un vrai test.
3. Point 37 : program-logic.md rangeait la table parmi le matériel implicite (corrigé le 21/10/2026, la table n'y est plus).
S'y ajoutent les points 38 à 40 (tables à pied central, serviette qui diminue l'adhérence, test « validé dans le profil » sans champ dans le modèle).
Remplacement proposé dans le lot : l'**élastique** (profil B) ; fiches « rowing élastique » et « tirage vertical élastique ancré haut » à rédiger en vague 1. Sans haltères ni élastique, le tirage horizontal n'est pas couvert.
Avant toute réintroduction : refaire la mécanique avec `kine`, définir le test et son champ dans le profil, nouveau contrôle `relecteur`.

## Variantes (installation + matériel seulement)
| id variante | nom | materiel_tags | installation |
|---|---|---|---|
| tirage-sous-table-genoux-plies | Sous une table, genoux pliés | poids_du_corps, table_solide (tag proposé) | Allongé sous une table lourde et stable, mains sur le bord, pieds à plat au sol. |
| tirage-sous-table-jambes-tendues | Sous une table, jambes tendues | poids_du_corps, table_solide (tag proposé) | Même installation, jambes tendues, appui sur les talons : plus dur. |

**Avertissement obligatoire avant la première séance** : table lourde, à pieds fixes, qui ne bascule pas quand tu tires sur le bord. Teste-la d'abord en tirant doucement. Jamais de table pliante, en verre ou sur roulettes.

## Consignes
1. Allonge-toi sous la table, poitrine sous le bord.
2. Attrape le bord, mains un peu plus larges que les épaules.
3. Gaine-toi : corps droit des épaules aux genoux (ou aux talons).
4. Tire ta poitrine vers le bord en serrant les omoplates.
5. Redescends lentement jusqu'à tendre les bras.

## Points d'attention
- Teste la stabilité de la table avant chaque séance.
- Corps droit, fesses qui ne tombent pas.
- Tire avec le dos, pas seulement les bras.
- Garde la tête loin du bord de la table.

## Erreurs fréquentes
- Bassin qui s'affaisse.
- Monter le menton au lieu de la poitrine.
- Tirer par à-coups (la table peut bouger).

## Progression / régression
**tirage-sous-table-genoux-plies** -> tirage-sous-table-jambes-tendues

## Repères de dosage
Voir program-logic.md.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 : README.md du lot, section « Retour kine ». Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Zones non listées : garder. Plusieurs zones gênées : la règle la plus prudente s'applique.

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | garder : genoux pliés | adapter : genoux pliés, amplitude réduite ; si haltères : rowing-unilateral-haltere | retirer |
| Coude | garder | adapter : genoux pliés, amplitude réduite | retirer |
| Poignet | garder : serviette pliée sur le bord | retirer (à la place : rowing-unilateral-haltere si haltères, sinon tirage-w-allonge) | retirer |
| Dos | garder : genoux pliés | retirer (à la place : tirage-w-allonge) | retirer |

**Points d'attention (kine)**
- Fiche à risque matériel : la table peut basculer sur toi. Le tag `table_solide` ne suffit pas ; l'app ne propose cette fiche qu'après le test ci-dessous, validé dans le profil.

**Version plus douce** : `tirage-sous-table-genoux-plies` ; au moindre doute sur la table : `rowing-unilateral-haltere` (haltères) ou `tirage-w-allonge` (sans matériel).

**Signes qui doivent faire arrêter**
- La table bouge, grince, glisse ou un de ses pieds décolle : lâche doucement et arrête définitivement avec cette table.
- Les mains glissent sur le bord.
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente à l'épaule, au coude ou au poignet.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- **Test obligatoire, debout, sans être dessous** : attrape le bord de la table à deux mains et essaie de le soulever. Si tu y arrives, la table est trop légère : n'utilise pas cet exercice. (Quand tu es suspendu dessous, tu tires sur le bord avec une bonne partie de ton poids.)
- Table massive à 4 pieds fixes ; jamais : table pliante, à rallonges, sur roulettes, sur tréteaux, en verre, ou dont le plateau est simplement posé.
- Tire au milieu d'un grand côté, mains entre les pieds de la table, pas sur une partie du plateau qui déborde loin des pieds.
- Plateau vide (pas de nappe, rien dessus), bord solide et sans arête vive ; sol non glissant sous les talons.
- Première répétition lente pour vérifier. Version jambes tendues : la traction sur la table augmente, refais le test.

## Photo
free-exercise-db : `Inverted_Row/0.jpg`, `Inverted_Row/1.jpg` (domaine public). La photo montre une barre dans un rack, pas une table : illustration du geste seulement, avec la mention « montré à la barre ».

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Suspendu sous une barre à hauteur de taille, corps droit, talons au sol, poitrine tirée vers la barre en serrant les omoplates, descente bras tendus | free-exercise-db « Inverted_Row » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Inverted_Row.json ; adapté à la table par coach | base d'exercices (domaine public), pas d'étude | 2026-10-21 | PROVISOIRE |
| Muscles (milieu du dos ; grand dorsal) | même fiche ; biceps, deltoïdes postérieurs et tronc ajoutés par coach | idem | 2026-10-21 | PROVISOIRE |
| Version table et avertissement de stabilité | equipment-taxonomy.md §2 et §4 (règle de conception) | - | 2026-10-21 | NON SOURCÉ |
| Genoux pliés plus facile que jambes tendues | pratique courante | - | - | NON SOURCÉ |
| Règles communes R1 à R10 (niveaux de gêne, arrêt si douleur, pas de progression, signes généraux, quand consulter) | README.md du lot, section « Retour kine » (sources détaillées : HAS 2019, NICE NG59, Smith 2017, Riebe 2015) | voir README | 2026-10-21 | PROVISOIRE |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Test « si tu soulèves le bord de la table debout, elle est trop légère » ; jambes tendues = plus de force sur la table | raisonnement mécanique de `kine` : la table bascule autour de ses pieds opposés dès que la traction sur le bord dépasse environ la moitié de son poids (moins si le plateau déborde) ; aucune source | - | 2026-10-21 | NON SOURCÉ |
