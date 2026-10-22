# Matériel : tags, profils et choix de la bonne variante (21/10/2026)
Statut : règles de conception (NON SOURCÉ sauf mention), à valider par `coach` et `kine`.

## 1. Principe : un mouvement, plusieurs variantes selon le matériel
- La bibliothèque est rangée en **mouvements** (ex. « développé couché », « squat goblet », « soulevé de terre roumain ») et en **variantes** par matériel (barre, haltères, kettlebell, élastique, poids du corps…). Fichier : knowledge/exercise-library-draft.csv (colonnes mouvement_id, mouvement, variante, materiel_tags).
- Le générateur choisit d'abord le **mouvement** (selon le schéma de mouvement, le muscle, l'objectif, le niveau), puis la **variante** compatible avec le matériel de la personne. Quelqu'un qui a des haltères mais pas de barre reçoit donc « soulevé de terre roumain aux haltères » au lieu de la version barre.
- Une variante n'est proposée que si **tous** ses tags de matériel sont dans le profil (implicites compris).

## 2. Tags de matériel (vocabulaire unique ; le script tools/build_library.py normalise les 3 bases)
**Implicites (supposés présents partout, sauf case décochée dans le profil)** : poids_du_corps, tapis (ou sol), chaise (stable, sans roulettes), mur, `marche_escalier` (une marche d'un escalier ; précautions R8 : escalier éclairé, dégagé, non glissant, rampe si possible ; remplace `marche_ou_box`, 21/10/2026), serviette, porte (pour ancrer un élastique : seulement avec ancrage adapté).
**Maison courant** : halteres (fixes ou réglables + liste des poids disponibles), kettlebell (poids), elastique (bande longue ou avec poignées ; résistance), `mini_bande` (boucle fermée, distincte de elastique : une fiche qui exige la boucle utilise ce tag ; D3, 22/10/2026), barre_traction, banc, banc_inclinable, roue_abdos, swiss_ball, medecine_ball, rouleau_massage, corde_a_sauter, sangles_suspension (TRX/anneaux), lest (gilet lesté), sac_de_sable, bosu, barre (barre droite), barre_ez, `rack` (rack ou cage à squat), `disques` (poids dans le profil) ; D7, 22/10/2026.
**Correspondance profil -> tag (D7)** : banc plat = banc ; banc inclinable = banc_inclinable ; barre de traction = barre_traction ; barre droite + disques = barre + disques ; barre EZ = barre_ez ; rack = rack ; haltères fixes ou réglables = halteres (poids dans le profil) ; kettlebell = kettlebell ; élastique boucle = mini_bande ; élastique longue ou à poignées = elastique ; sangles de suspension = sangles_suspension ; roue abdos = roue_abdos ; swiss ball = swiss_ball ; medecine ball = medecine_ball ; step ou box = box_ou_step ; corde à sauter = corde_a_sauter ; gilet lesté = lest ; poulie = poulie ; machines = machine ; vélo ou rameur = machine_cardio ; tapis = tapis ; « autre » = champ libre du profil, jamais un tag de fiche. **Implémenté (D7, 22/10/2026)** : écran Profil > « Mon matériel » (src/data/equipment-options.ts), groupes implicite / maison / salle / quotidien ; champs du profil matériel : type d'haltères (fixes ou réglables), poids des haltères, kettlebells et disques, texte libre « autre ». Aucun tag ajouté : les noms courts (step, gilet_leste, velo_ou_rameur) sont les tags existants box_ou_step, lest, machine_cardio.
**Objets du quotidien (à cocher dans le profil ; jamais implicites)** : `sac_a_dos` (sac à dos chargé, fermé, contenu calé, poids connu), `bidons_ou_sacs` (packs ou bidons d'eau, sacs de courses solides, poids connu), `box_ou_step` (box, step ou banc stable, y compris plus haut qu'une marche d'escalier ; remplace `box_stable`, 21/10/2026 ; la marche d'escalier est `marche_escalier`, implicite). `partenaire_ou_ancrage` (un partenaire, ou un point d'ancrage fixe et sûr pour bloquer les chevilles, ex. nordique ; non implicite ; D3, 22/10/2026). Implicite : `marche_escalier` oui, `box_ou_step` non (à cocher). Décision de l'utilisateur du 21/10/2026 : chaque variante utilise le tag qui correspond, pour afficher les bonnes précautions ; haltères autorisés sur marche_escalier (première ou deuxième marche), jamais sur une box haute. Retiré le 21/10/2026 : `table_solide` (la fiche tirage-sous-table est écartée, voir knowledge/exercices/ecartees/). Tags utilisés dans le lot pilote (knowledge/exercices/pilote/).
**Salle** : poulie, machine, machine_cardio, materiel_specialise (sled, pneu, pierres d'Atlas…). Colonne salle_uniquement = oui.
Tags à nettoyer : autre (matériel non précisé dans la source), corde_a_preciser (poignée de poulie ou corde ?).

## 3. Choix de la variante (classement)
1. Compatible avec le matériel (obligatoire) et avec le profil blessures (contre-indications).
2. Adaptée au niveau (exercices techniques réservés aux avancés).
3. Adaptée à l'objectif : force -> variantes chargeables lourdement (barre, haltères lourds) ; muscle -> toute variante permettant d'approcher l'échec (charges légères acceptées, voir program-logic.md §4) ; fonctionnel/sport -> variantes unilatérales, portés, sauts.
4. Capacité de progression : si les haltères ne montent pas assez lourd, préférer une variante unilatérale ou plus difficile (échelle de progression du mouvement).
5. Préférences : favoris, exercices masqués par la personne.
6. Rotation organisée : la même variante reste en place pendant un bloc (program-logic.md §7).

## 4. Trous de couverture mesurés (library-stats.json, schémas devinés par mots-clés : approximatif)
Nombre de MOUVEMENTS candidats par schéma selon le matériel :
| Profil | squat | charnière | fente | poussée H | poussée V | tirage H | tirage V | gainage | porté | anti-rotation |
|---|---|---|---|---|---|---|---|---|---|---|
| A. poids du corps (+ chaise, mur, marche) | 33 | 21 | 22 | 57 | 7 | 15 | 12 | 66 | 0 | 1 |
| B. A + élastiques | 34 | 27 | 24 | 58 | 8 | 22 | 17 | 72 | 0 | 3 |
| C. A + haltères | 39 | 29 | 37 | 64 | 13 | 44 | 13 | 67 | 5 | 1 |
| D. A + haltères + élastiques + barre de traction | 40 | 33 | 37 | 65 | 13 | 48 | 45 | 77 | 5 | 3 |
| E. D + banc + kettlebell + roue + swiss ball | 44 | 46 | 40 | 117 | 19 | 63 | 47 | 95 | 5 | 3 |
| F. salle complète | 87 | 68 | 46 | 171 | 29 | 122 | 74 | 115 | 9 | 4 |
Constat : la quantité n'est pas le problème. Les vrais trous sont : **portés à la maison (0 sans haltères)**, **anti-rotation (1 à 4 partout)**, **poussée verticale au poids du corps (7)** et **tirage vertical sans barre (12, à vérifier : souvent mal classés)**. À combler en priorité par `coach`/`kine` : portés avec sac à dos ou bidons, Pallof à l'élastique, dead bug/bird dog chargés, pompes piquées et progressions vers l'équilibre, tirage vertical à l'élastique ancré (le tirage sous une table est écarté depuis le 21/10/2026).
Si un schéma reste impossible avec le matériel déclaré : le dire clairement (« sans barre ni élastique, pas de vrai tirage vertical ») et proposer le meilleur substitut + l'achat le plus utile (ex. un élastique).
