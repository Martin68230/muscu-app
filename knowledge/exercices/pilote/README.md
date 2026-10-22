# Lot pilote : 33 mouvements (mis à jour le 21/10/2026 : pompes fusionnées) (corps entier, poids du corps + haltères, profils A et C)
Rédigé par `coach` le 21/10/2026 ; section sécurité complétée par `kine` le même jour ; contrôlé par `relecteur` (CONTROLE-relecteur.md) ; corrections de `coach` le 21/10/2026 (journal en fin de partie `coach`). Statut de toutes les fiches : `complete_kine`. `kine` a corrigé ses points (journal en fin de page) ; prochaines étapes : `relecteur` recontrôle à neuf, puis l'utilisateur valide (`verifie`). Le lot n'est pas encore validé.
Ce lot fixe le **format** des fiches. L'utilisateur en relit 5 (liste plus bas) avant la suite. La fiche `tirage-sous-table` a été retirée du lot (knowledge/exercices/ecartees/tirage-sous-table.md).

## Format retenu
- Un fichier par mouvement : `<id>.md`, id stable en kebab-case français.
- Frontmatter : id, nom, schema, type, niveau_min, muscles_principaux, muscles_secondaires, source_brouillon (mouvement_id du CSV ; vide = ajout), statut. Champ en plus : `couverture: substitut` quand la fiche ne remplit le schéma qu'à moitié (pull-over, tirage en W ; proposition, à confirmer).
- **Échelons de difficulté (décision de l'utilisateur, 21/10/2026)** : les variantes qui changent la difficulté restent dans une seule fiche, rangées de la plus facile à la plus dure ; chaque variante a un identifiant stable, un `echelon` (1 = plus facile) et un `niveau` (debutant / intermediaire / avance). Les variantes qui ne changent que le matériel ou la charge gardent le même échelon. Format documenté dans knowledge/exercise-catalog.md §2.
- Sections : Variantes (installation + matériel + échelon + niveau) ; Consignes (4-6 étapes, tutoiement) ; Points d'attention ; Erreurs fréquentes ; Progression / régression (ids) ; Repères de dosage (renvoi à program-logic.md, aucun chiffre non sourcé) ; Sécurité (remplie par kine) ; Photo (une ligne par image : « affichable : oui / non (raison) / à vérifier ») ; Sources (une ligne par affirmation, avec statut).
- **La consigne prime sur la photo** (CLAUDE.md règle 12, rappelée dans exercise-catalog.md §2) : une image qui contredit la consigne, montre du matériel spécialisé, une marque d'un tiers ou une autre installation n'est pas affichée ; « à vérifier » = non affichée tant que l'image n'a pas été regardée.
- Vocabulaire des muscles (snake_case) : quadriceps, fessiers, moyen_fessier, ischios, adducteurs, mollets, flechisseurs_hanche, erecteurs_rachis, carre_des_lombes, abdominaux, transverse, obliques, pectoraux, deltoides_anterieurs, deltoides_lateraux, deltoides_posterieurs, triceps, biceps, avant_bras, grand_dorsal, trapezes, rhomboides, dentele_anterieur. À intégrer au modèle de données.
- Photos : free-exercise-db seulement (domaine public). Chemin `exercises/<id>/0.jpg` et `1.jpg` dans https://github.com/yuhonas/free-exercise-db, à convertir en WebP. Identifiants vérifiés dans dist/exercises.json le 21/10/2026. Images regardées (21/10/2026, par `coach` et `relecteur`) : Bodyweight_Squat, Plank, Farmers_Walk, Bent-Arm_Dumbbell_Pullover, Incline_Push-Up, Stiff-Legged_Dumbbell_Deadlift, Side_Bridge ; les autres sont « à vérifier ».
- Tags de matériel : vocabulaire de knowledge/equipment-taxonomy.md §2. Objets du quotidien à cocher (jamais implicites) : `sac_a_dos`, `bidons_ou_sacs`, `box_ou_step` (ex-`box_stable`). Implicite : `marche_escalier` (ex-`marche_ou_box`).

## Liste des mouvements
Profil A = poids du corps + implicites (tapis, chaise, mur, première marche). Profil C = A + haltères. « Hors A/C » = variante gardée pour les autres profils. Échelons : nombre d'échelons de difficulté de la fiche.

| id | nom | schéma | niveau | échelons | matériel A | matériel C | hors A/C |
|---|---|---|---|---|---|---|---|
| squat-assis-debout | Squat assis-debout sur chaise | squat | débutant | 1 | chaise ou marche | idem | - |
| squat-poids-du-corps | Squat au poids du corps | squat | débutant | 1 | rien | idem | - |
| squat-gobelet | Squat gobelet | squat | débutant | 1 | - | haltère | kettlebell |
| pont-fessier | Pont fessier | charnière | débutant | 1 | tapis | + haltère | - |
| souleve-de-terre-roumain-halteres | Soulevé de terre roumain aux haltères | charnière | débutant | 1 | - | haltères | - |
| souleve-de-terre-roumain-unijambiste | Soulevé de terre roumain sur une jambe | charnière | intermédiaire | 2 | mur ou rien | + haltère | - |
| fente-arriere | Fente arrière | fente | débutant | 2 | rien, mur | + haltères | - |
| squat-fendu | Squat fendu | fente | débutant | 2 | rien, mur | + haltères | - |
| squat-bulgare | Squat bulgare | fente | intermédiaire | 1 | chaise ou marche | + haltères | - |
| montee-sur-marche | Montée sur marche | fente | débutant | 3 | première marche | + haltères (échelon 2, après l'échelon sans charge) | box_ou_step (échelon 3) |
| pompe | Pompe (mur, chaise, genoux, sol, pieds surélevés) | poussée H | débutant | 5 | mur, chaise, tapis, rien | idem | - |
| pompe-diamant | Pompe diamant | poussée H | intermédiaire | 1 | rien | idem | - |
| pompe-ecartee | Pompe mains écartées | poussée H | intermédiaire | 1 | rien | idem | - |
| pompe-archer | Pompe archer | poussée H | avancé | 1 | rien | idem | - |
| developpe-au-sol-halteres | Développé au sol aux haltères | poussée H | débutant | 2 | - | haltères | - |
| developpe-epaules-halteres | Développé épaules aux haltères | poussée V | débutant | 3 | - | haltères (+ chaise) | - |
| pompe-piquee | Pompe piquée | poussée V | débutant | 2 | tapis ou marche | idem | - |
| pompe-piquee-pieds-sureleves | Pompe piquée pieds surélevés | poussée V | intermédiaire | 2 | marche ou chaise | idem | - |
| rowing-unilateral-haltere | Rowing à un bras | tirage H | débutant | 1 | - | haltère + chaise | banc |
| rowing-buste-penche-halteres | Rowing buste penché | tirage H | débutant | 1 | - | haltères | - |
| pullover-haltere-au-sol | Pull-over au sol (substitut) | tirage V | débutant | 2 | - | haltère | banc (échelon 2, intermédiaire) |
| tirage-w-allonge | Tirage en W allongé (substitut partiel) | tirage V | débutant | 1 | tapis | + haltères légers | - |
| planche | Planche | gainage | débutant | 2 | tapis | idem | - |
| planche-laterale | Planche latérale | gainage | débutant | 2 | tapis | idem | - |
| dead-bug | Dead bug | anti-rotation | débutant | 1 | tapis | + haltère | - |
| bird-dog | Bird dog | anti-rotation | débutant | 1 | tapis | idem | - |
| planche-touche-epaule | Planche touche-épaule | anti-rotation | intermédiaire | 3 | tapis | idem | - |
| marche-du-fermier | Marche du fermier | porté | débutant | 1 | - | haltères | bidons_ou_sacs |
| porte-valise | Porté valise | porté | débutant | 1 | - | haltère | bidons_ou_sacs |
| porte-sac-a-dos-devant | Porté du sac à dos contre la poitrine | porté | débutant | 1 | - | - | sac_a_dos |
| chat-vache | Chat-vache | mobilité | débutant | 1 | tapis | idem | - |
| fente-basse-rotation | Fente basse avec rotation du buste | mobilité | débutant | 2 | tapis ou marche | idem | - |
| mobilite-cheville-au-mur | Mobilité de cheville au mur | mobilité | débutant | 1 | mur | idem | - |

Ajouts absents du brouillon : `pompe-piquee-pieds-sureleves` (progression de M1695) et `porte-sac-a-dos-devant` (porté avec un sac, signalé manquant).
Fiche retirée : `tirage-sous-table` (voir « Choix tranchés par l'utilisateur »).
Fiches avec échelons de difficulté (plusieurs échelons dans la fiche) : souleve-de-terre-roumain-unijambiste, fente-arriere, squat-fendu, montee-sur-marche, pompe (5), developpe-au-sol-halteres, developpe-epaules-halteres (3), pompe-piquee, pompe-piquee-pieds-sureleves, pullover-haltere-au-sol, planche, planche-laterale, planche-touche-epaule (3), fente-basse-rotation. Les autres fiches ont un seul échelon (les variantes ne changent que le matériel). Les progressions entre fiches (par exemple pompe-inclinee -> pompe-genoux -> pompe) restent des liens de fiche à fiche ; leur fusion en une seule « famille » n'est pas faite (à confirmer par l'utilisateur si souhaité).

## Couverture par schéma (nombre de mouvements utilisables)
| Schéma | Profil A | Profil C | Remarque |
|---|---|---|---|
| squat | 2 | 3 | |
| charnière | 2 | 3 | |
| fente | 4 | 4 | |
| poussée H | 4 (dont 3 nouvelles fiches `brouillon_coach` à sécuriser par `kine`) | 5 | |
| poussée V | 2 | 3 | En A, les 2 fiches forment une seule échelle de progression |
| tirage H | **0** | 2 | Sans haltères ni élastique, le tirage horizontal n'est pas couvert (voir ci-dessous) |
| tirage V | **0 vrai** (1 substitut partiel) | **0 vrai** (2 substituts) | Impossible sans barre ni élastique |
| gainage | 2 | 2 | |
| anti-rotation | 3 | 3 | Dont 2 qui sont surtout de l'anti-extension (dead bug, touche-épaule : à trancher) |
| porté | **0** | 2 | En A, seulement si bidons, sacs ou sac à dos sont déclarés |
| mobilité | 3 | 3 | |

**Tirage horizontal : trou.** Sans haltères ni élastique, aucune fiche ne couvre le tirage horizontal (tirage-sous-table écartée ; rowing à la serviette sur une porte écarté par `kine`). Message à afficher : « Sans haltères ni élastique, pas de vrai tirage horizontal. Achat conseillé : un élastique avec un ancrage de porte adapté (profil B), utilisé selon sa notice. » À rédiger en vague 1 : **rowing à l'élastique** et **tirage vertical à l'élastique ancré en haut** (aucune fiche rédigée maintenant).

L'objectif de la vague 1 (au moins 3 mouvements vérifiés par profil et par schéma) n'est **pas** atteint par ce pilote, qui sert d'abord à fixer le format.

## Trous signalés
1. **Tirage vertical, profils A et C : impossible.** Sans barre ni élastique, on ne peut tirer ni le corps vers le haut ni une charge vers le bas. Meilleurs substituts : pull-over à l'haltère (C), tirage en W allongé (A, substitut partiel). Message à afficher : « Sans barre ni élastique, pas de vrai tirage vertical. Achat le plus utile : un élastique ou une barre de traction. » À rédiger en vague 1 : tirage vertical élastique ancré en haut.
2. **Tirage horizontal, profil A : 0.** Voir plus haut (élastique, profil B, à rédiger). Candidat écarté : rowing avec une serviette accrochée à une poignée de porte (brouillon M1854, maxwu), écarté par `kine` (risque de chute en arrière).
3. **Porté, profil A : 0 sans objet du quotidien.** Possible seulement avec bidons, sacs de courses ou sac à dos déclarés (tags `bidons_ou_sacs`, `sac_a_dos`, à cocher).
4. **Tags** : `sac_a_dos`, `bidons_ou_sacs`, `box_stable` ajoutés à equipment-taxonomy.md §2 (21/10/2026) ; `table_solide` abandonné ; program-logic.md §4 ne range plus table ni sac à dos dans le matériel implicite.
5. **Dosage impossible à coder pour l'instant** : durées de maintien (planche, planche latérale), distances ou temps des portés, durée de la mobilité à l'échauffement : rien de sourcé dans knowledge/ (program-logic.md §9 et §10).
6. **Fiches citées dans les échelles mais pas encore écrites (à rédiger en vague 1)** : pont fessier sur une jambe (M0506), planche en levant un bras ou une jambe, planche latérale jambe levée, bird dog jambe seule, assis-debout avec appui des mains, pompe en équilibre contre un mur (avancé), rowing élastique, tirage vertical élastique ancré haut.
7. **Photos** : 12 mouvements sur 32 n'ont aucune photo libre ; plusieurs photos montrent une autre variante. Photos NON affichables (consigne prime, matériel spécialisé, marque, mauvaise installation) : voir « Photos non affichables ». Toutes les autres images : « à vérifier » tant qu'elles n'ont pas été regardées.

## Photos non affichables (état au 21/10/2026)
| Fiche | Image | Raison |
|---|---|---|
| squat-poids-du-corps | Bodyweight_Squat/0.jpg, 1.jpg | mains derrière la tête : contredit la consigne (décision utilisateur) |
| planche | Plank/0.jpg | personne sur un genou, pas une planche (1.jpg : oui) |
| pullover-haltere-au-sol | Bent-Arm_Dumbbell_Pullover/0.jpg, 1.jpg | en travers du banc, tête dans le vide : autre installation |
| marche-du-fermier | Farmers_Walk/0.jpg, 1.jpg | poignées de strongman : matériel spécialisé |
| pompe | Incline_Push-Up-0.webp, -1.webp (recadrées par `dev`) | **redevenues affichables le 21/10/2026 pour l'échelon `pompe-chaise` seulement** (box en bois ≈ chaise, mention « montré sur une box ») ; non affichables pour mur, genoux, sol, pieds surélevés ; `relecteur` doit constater l'absence de logo (fichiers absents du dépôt à la rédaction) |
Affichables « oui » : Plank/1.jpg, Stiff-Legged_Dumbbell_Deadlift/0.jpg, Side_Bridge/0.jpg (version pieds seulement).

## Anomalies du brouillon relevées (pour le nettoyage de la vague 1)
- free-exercise-db « Split_Squats » est une fente **sautée**, et « Split_Squat_with_Dumbbells » a le pied arrière surélevé (c'est un squat bulgare) : noms trompeurs.
- M1730 s'appelle « Smith Press » alors que ses variantes sont aux haltères.
- M0410 « Bent-Arm Dumbbell Pullover » : tag `halteres` seul alors que la source utilise un banc ; M0410 et M1777 (pull-over) sont classés `pull_h` (tirage horizontal) dans le CSV alors que la fiche les range en tirage vertical.
- M1418 « Incline Push-Up » est tagué `banc_inclinable` alors qu'un support quelconque suffit.
- M1252 : la fiche free-exercise-db « Goblet Squat » est au kettlebell (bien taguée), la version haltère vient de wger/maxwu.
- M0518 / M0519 (squat bulgare gauche / droite) et M1548 / M1810 (rotation thoracique gauche / droite) : doublons par côté à fusionner.
- « Farmers_Walk » (free-exercise-db) : matériel « other » (poignées spécialisées) ; ses photos montrent des poignées de strongman.
- M1436 (tirage sous table) : fiche écartée ; le CSV garde la ligne en brouillon.

## Choix tranchés par l'utilisateur (21/10/2026)
1. **Échelons de difficulté** : une seule fiche par mouvement, variantes rangées de la plus facile à la plus dure, chaque échelon avec identifiant stable et niveau (voir « Format retenu »). Appliqué aux 14 fiches concernées.
2. **La consigne prime sur la photo** : squat au poids du corps = bras devant ; aucune photo qui contredit la consigne n'est affichée ; chaque image est étiquetée « affichable : oui / non / à vérifier ».
3. **tirage-sous-table retirée du lot pilote** pour l'instant (3 points bloquants de `relecteur`), fiche déplacée dans knowledge/exercices/ecartees/ ; remplacement par l'élastique (profil B), fiches à rédiger en vague 1.
4. **Tags hors vocabulaire** : `sac_a_dos`, `bidons_ou_sacs` ajoutés (+ `box_stable`) à equipment-taxonomy.md §2 ; `table_solide` abandonné ; program-logic.md corrigé (table et sac à dos ne sont plus implicites).
5. **Sources** : PROVISOIRE seulement si la source a été lue au moins en résumé ; sinon NON SOURCÉ. Appliqué : brouillons wger (existence seulement), ACE index, Prehab Guys passés en NON SOURCÉ.

## Choix encore à faire trancher par l'utilisateur
1. **Champ `couverture: substitut`** dans le frontmatter pour le pull-over et le tirage en W.
2. **Classement anti-rotation** du dead bug et de la planche touche-épaule (le dead bug est surtout de l'anti-extension) ; le vrai anti-rotation (Pallof) demande un élastique (profil B).
3. ~~Ordre pompe inclinée / genoux, fusion~~ : tranché le 21/10/2026 (une fiche `pompe` à 5 échelons, voir « Journal du 21/10/2026 »).
4. **Niveaux changés par rapport à la source** (tous NON SOURCÉ, tracés dans les fiches) : mis en débutant alors que la source dit intermédiaire : bird dog, porté valise, fente basse avec rotation, développé au sol, marche du fermier, fente arrière, montée sur marche, pull-over (variante sol) ; pompe piquée mise en débutant (aucun niveau de source lu) ; squat bulgare mis en intermédiaire alors que la source dit débutant. Vérifié seulement pour les fiches signalées par `relecteur` et celles de ce tableau ; les autres niveaux n'ont pas été recomparés à la source.
5. ~~Recadrage de la photo Incline_Push-Up~~ : tranché (recadrage par `dev`, affichable pour l'échelon chaise de `pompe`, 21/10/2026).
6. **Photo d'une autre variante** (kettlebell pour l'haltère, box pour le banc) : affichée avec une mention, ou aucune photo ?
7. **Noms** : garder « dead bug » et « bird dog » (courants en salle) avec une explication, et un nom descriptif pour « World's Greatest Stretch » (fente basse avec rotation du buste) ?
8. **Regroupements** : soulevé roumain + jambes tendues en un seul mouvement ; développé épaules assis + debout en un seul mouvement.
9. **Variante « pompe, mains sur haltères »** retirée (haltères hexagonaux non exprimables dans le profil) : à ré-introduire seulement si le profil porte l'attribut.

## Niveau de preuve du lot (honnêtement)
Les consignes viennent surtout de bases d'exercices (free-exercise-db, domaine public) et de bibliothèques d'organismes de certification (ACE ; NASM vu seulement via résumé). Ce sont des pratiques professionnelles, **pas des études** : statut PROVISOIRE au mieux. Les sources non lues (même pas en résumé) et les brouillons wger (qui prouvent seulement l'existence du mouvement) sont NON SOURCÉ. Les fiches sans source lue sont marquées NON SOURCÉ ligne par ligne. Aucune méta-analyse ne porte sur la technique d'un mouvement précis ; c'est normal pour ce type de contenu, mais `relecteur` doit vérifier que chaque consigne correspond bien à la source citée. Les échelons et niveaux de chaque variante sont des choix de `coach` (NON SOURCÉ).

## 5 fiches proposées pour la relecture par l'utilisateur
1. `squat-poids-du-corps` : poids du corps, consigne qui prime sur la photo (aucune photo affichable).
2. `souleve-de-terre-roumain-halteres` : haltères, avec photo.
3. `planche` : gainage, question sur les durées non sourcées.
4. `pompe` : cinq échelons (mur, chaise, genoux, sol, pieds surélevés), fiche fusionnée le 21/10/2026.
5. `pullover-haltere-au-sol` : trou de couverture (tirage vertical impossible) et substitut.

## Journal des corrections de `coach` (21/10/2026) après CONTROLE-relecteur.md
Les sections « Sécurité et contre-indications » des fiches et la section « Retour kine » ci-dessous n'ont pas été touchées : les points qui les concernent sont renvoyés à `kine`. `kine` écrit aussi knowledge/regles-securite-communes.md (non touché). Fiches : statut laissé à `complete_kine`.

| n° | Décision | Détail |
|---|---|---|
| 1 | non corrigé (kine) | statut de R2 : section Retour kine |
| 2 | non corrigé (kine) | statut de R3 : section Retour kine |
| 3 | non corrigé (kine) | seuil R4 : section Retour kine |
| 4 | abandonné | dépistage avant le premier programme : supprimé par décision de l'utilisateur (22/10/2026) |
| 5 | non corrigé (kine) | drapeaux rouges omis de R6 |
| 6 | non corrigé (kine) | urgence « 15 ou 112 » dans R6 |
| 7 | sans objet | remarque, statut déjà correct |
| 8 | non corrigé (kine) | grossesse et post-partum : à rédiger et sourcer par `kine` |
| 9 | non corrigé (kine) | « garder » / « adapter » dans R2 et les tableaux zone x niveau des fiches |
| 10 | non corrigé (kine) | niveau 3 « seulement si aucune douleur » : tableaux des fiches |
| 11 | non corrigé (kine) | statut de R9 : section Retour kine |
| 12 | corrigé | phrase de statut du début du README reformulée |
| 13 | corrigé | niveaux changés vs source tracés dans marche-du-fermier, fente-arriere, montee-sur-marche, pullover ; liste du README élargie |
| 14 | corrigé | tags `sac_a_dos`, `bidons_ou_sacs`, `box_stable` dans equipment-taxonomy.md §2 ; mention « tag proposé » retirée des fiches |
| 15 | corrigé | lignes de source « marche » : renvoi à R8 et plus à exercise-catalog.md §5 (qui ne cite que chaise, table, sac) |
| 16 | corrigé | brouillons wger : NON SOURCÉ (existence du mouvement seulement) : pompe-inclinee, pompe-piquee, tirage-w-allonge, planche-touche-epaule, mobilite-cheville-au-mur, squat-gobelet, pompe-genoux |
| 17 | corrigé en partie | photos Incline_Push-Up passées en « non » (marque de salle) ; recadrage à trancher par l'utilisateur ; Inverted_Row n'est utilisée dans aucune fiche du lot |
| 19 | corrigé | squat : quadriceps seul en principal, changement tracé |
| 20 | corrigé | largeur d'épaules (source) ; orteils ouverts « si confortable », NON SOURCÉ |
| 21 | corrigé | décision utilisateur : bras devant ; photos « non » |
| 22 | corrigé | consigne alignée sur la source et la photo (haltères de chaque côté) ; variante un haltère signalée NON SOURCÉ |
| 23 | non corrigé (kine) | tableau Dos niveau 1 et README « fiches à risque » (sécurité) ; la consigne de coach est alignée |
| 24 | corrigé | Plank/0.jpg « non », 1.jpg « oui » |
| 25 | corrigé | ligne de source NON SOURCÉ pour la variante genoux |
| 26 | non corrigé | durées de maintien : trou n°5, rien de sourcé (program-logic.md §9) ; remarque |
| 27 | corrigé | pompe inclinée : première marche seulement, dans la variante et les sources |
| 28 | corrigé | échelons classés par hauteur des mains (mur < chaise < première marche) |
| 30 | corrigé | triceps en secondaire pour pompe, pompe-genoux, pompe-inclinee, changement tracé |
| 31 | corrigé | photo « non » (box en bois, marque), mention dans la fiche |
| 32 | corrigé | pull-over : sol débutant, banc intermédiaire ; niveau vs source tracé ; niveau_min débutant |
| 33 | corrigé | texte nuancé (« sollicite aussi le grand dorsal », « substitut faute de mieux ») ; pectoraux en premier |
| 34 | corrigé | variante banc décrite dans la longueur ; photos « non » (en travers du banc) |
| 35 | sans objet | fiche écartée (le texte contradictoire est conservé tel quel dans ecartees/) |
| 36 | sans objet | fiche écartée ; l'erreur mécanique est consignée dans l'en-tête de la fiche |
| 37 | corrigé | program-logic.md §4 : table et sac à dos retirés de l'implicite ; exemple « tirage sous table » remplacé |
| 38 | sans objet | fiche écartée |
| 39 | sans objet | fiche écartée |
| 40 | sans objet | fiche écartée (le champ « test validé » n'existe pas : à spécifier avec `dev` avant toute réintroduction) |
| 41 | sans objet | fiche écartée |
| 42 | corrigé | ligne de source : « Sit_Squats » est un autre mouvement |
| 43 | non corrigé (kine) | coussin antidérapant : section Sécurité |
| 44 | corrigé | libellé « haltère tenu contre la poitrine » |
| 45 | non corrigé (kine) | ligne « Dos » manquante dans les tableaux de fente-arriere, squat-fendu, montee-sur-marche |
| 46 | corrigé | « genou devant » présenté comme repère de technique, pas comme un danger |
| 47 | corrigé | squat bulgare : « première marche » dans l'installation |
| 48 | corrigé | tag `box_stable` ; montee-sur-box-haute (échelon 2) ; haltères seulement sur marche ou box basse |
| 49 | corrigé | variante « mains sur haltères » retirée (haltères hexagonaux non exprimables) |
| 50 | corrigé | ACE (index seulement) : NON SOURCÉ |
| 51 | corrigé | Prehab Guys (page non lue) : NON SOURCÉ |
| 52 | corrigé en partie | installation de la variante assise (dossier calé contre un mur) ; les lignes « dos contre le dossier » du tableau Dos et « ne te penche pas en arrière » des objets (sécurité) restent à harmoniser par `kine` |
| 53 | non corrigé (kine) | rowing, Dos niveau 2 : « une table stable » |
| 54 | corrigé | identifiant existant ; images « à vérifier » |
| 55 | corrigé | « reproduit la fin d'une traction » atténué et sourcé NON SOURCÉ |
| 56 | corrigé | Side_Bridge/0.jpg « oui » (pieds seulement) ; variante genou sans photo |
| 57 | corrigé | Farmers_Walk/0.jpg et 1.jpg « non » (matériel spécialisé) |
| 58 | sans objet | remarque : mouvement entièrement NON SOURCÉ, non codable sans validation (règle 10) |
| 59 | non corrigé | anomalies du CSV (hors lot) : listées dans « Anomalies du brouillon » pour la vague 1 |

Bilan : 57 points : 31 corrigés, 2 corrigés en partie (17, 52), 14 renvoyés à `kine` (1 à 6, 8 à 11, 23, 43, 45, 53), 8 sans objet (7, 58 et fiche écartée : 35, 36, 38 à 41), 2 non corrigés (26, 59). Blocs à surveiller par `kine` : les lignes qui nomment « tirage-sous-table », « table » et « test de soulèvement » dans la section Retour kine (R8, fiches à risque, désaccord n°1, avis rowing serviette) et dans knowledge/regles-securite-communes.md sont devenues sans objet et à retirer.

## Sécurité : règles communes
Les règles communes de sécurité (R1 à R10 corrigées, dépistage supprimé (décision du 22/10/2026), grossesse et post-partum, signes d'alerte, urgences, objets du quotidien) sont dans **knowledge/regles-securite-communes.md**, source unique : elles ne sont plus recopiées ici. Chaque fiche y renvoie.

Avis `kine` sur le rowing avec une serviette accrochée à une poignée de porte (brouillon M1854) : **écarté**, la poignée n'est pas faite pour supporter le poids du corps et la chute se ferait en arrière ; alternative : élastique avec un vrai ancrage de porte, selon sa notice (profil B). PROVISOIRE (notices de fabricants, aucune étude).

Fiches à risque (rappel) : `pompe-piquee` et `pompe-piquee-pieds-sureleves` (tête en bas, chute), `montee-sur-marche` et `squat-bulgare` (première marche seulement, box stable pour plus haut), `developpe-au-sol-halteres`, `dead-bug` (haltère), `pullover-haltere-au-sol` (R9 : charge au-dessus du visage), `souleve-de-terre-roumain-halteres` et `rowing-buste-penche-halteres` (charge sur le bas du dos), `porte-sac-a-dos-devant`, `marche-du-fermier`, `porte-valise` (charge improvisée de poids connu, jamais dans un escalier).

## Journal des corrections de `kine` (21/10/2026) après CONTROLE-relecteur.md
Points renvoyés par `coach` (1 à 6, 8 à 11, 23, 43, 45, 53) et points de sécurité liés (15, 27, 47, 52). Les 32 fiches ont été modifiées : vocabulaire garder / adapter (action précise) / retirer, niveau 3, lignes « Grossesse », renvoi vers knowledge/regles-securite-communes.md. Statut des fiches : `complete_kine` (inchangé). Contrôle de `relecteur` à refaire.

| n° | Décision | Détail |
|---|---|---|
| 1 | corrigé | R2 passée en NON SOURCÉ (règle de conception) dans regles-securite-communes.md |
| 2 | corrigé | R3 passée en NON SOURCÉ |
| 3 | corrigé | seuil « 2 séances de suite » de R4 marqué NON SOURCÉ ; constat Smith 2017 : OK |
| 4 | abandonné | dépistage supprimé par décision de l'utilisateur (22/10/2026) ; voir regles-securite-communes.md §2 |
| 5 | corrigé | antécédent de cancer, début avant 20 ans ou après 55 ans, fièvre, perte de poids, état général, cortisone prolongée ajoutés (S2), source : fiche mémo HAS lombalgie 2019 lue en entier ; troubles des selles dans S3 |
| 6 | corrigé | signes de la queue-de-cheval renvoient à « Urgence : appelle le 15 (SAMU) ou le 112 » (S3, U1) |
| 7 | sans objet | remarque du relecteur : statut déjà correct ; seuil de 2 semaines laissé NON SOURCÉ |
| 8 | corrigé | règles grossesse et post-partum G1 à G8 ; ligne « Grossesse » dans chacune des 32 fiches |
| 9 | corrigé | vocabulaire unique (§0 du fichier de règles) ; toutes les cases des 32 tableaux réécrites en garder / adapter : action / retirer |
| 10 | corrigé | pompe-inclinee, dead-bug, planche-touche-epaule : plus de « seulement si aucune douleur » au niveau 3 ; retirer, avec sans-zone nommé quand la variante ne sollicite pas la zone |
| 11 | corrigé | R9 : partie « disques serrés » en PROVISOIRE (mise en garde de la fiche free-exercise-db Bent-Arm_Dumbbell_Pullover, non rouverte) |
| 15 | corrigé | lignes de source « marche » : renvoi à R8 (regles-securite-communes.md §7), plus à exercise-catalog.md §5 |
| 23 | corrigé | souleve-de-terre-roumain-halteres, Dos niveau 1 : adapter : amplitude jusqu'aux genoux ; le gel de la charge est la règle du niveau 2 (R2) |
| 27 | corrigé | pompe-inclinee : première marche seulement dans les objets du quotidien (la variante de `coach` le dit déjà) |
| 43 | corrigé | squat-assis-debout : coussin antidérapant ou plié et calé, sinon une chaise plus haute |
| 45 | corrigé | ligne « Dos » ajoutée à fente-arriere, squat-fendu, montee-sur-marche (sans-charge) ; squat-bulgare l'avait déjà |
| 47 | corrigé | squat-bulgare : première marche, escalier éclairé et dégagé, rampe si possible |
| 52 | corrigé | developpe-epaules-halteres : tableau Dos et objets du quotidien alignés sur l'installation de `coach` (dos près du dossier, dossier calé contre un mur, sans te laisser aller en arrière) |
| 53 | corrigé avec réserve | rowing-unilateral-haltere, Dos niveau 2 : plus de « table » ; remplacé par « support stable plus haut, essai obligatoire en s'appuyant de tout son poids ». Aucun objet précis n'est nommé : à trancher si `relecteur` ou l'utilisateur veut un objet précis |
| autre | corrigé | lignes de source « HAS lombalgie » des fiches : le PDF HAS a été lu, la mention « non ouvert » est retirée ; ids de variantes mis à jour (montee-sur-box-haute, planche-touche-epaule-pieds-serres ; pompe-poignees-halteres supprimée ; remplacée par pompe-inclinee-chaise pour le poignet) |
| non corrigé | tirage-sous-table | fiche écartée : lignes retirées de ce README et de regles-securite-communes.md |
| non corrigé | classement grossesse par fiche | extrapolation de `kine` (PROVISOIRE), à valider par l'utilisateur et `relecteur` |

Points à signaler à `coach` : (1) `montee-sur-marche-halteres` : la fiche `coach` autorise les haltères sur « une marche basse ou une box basse » ; la section sécurité de `kine` ne les autorise que sur une box basse et stable (les mains ne sont plus libres pour la rampe). (2) Les niveaux 2 et 3 de plusieurs fiches renvoient à des remplaçants d'une autre fiche (ids écrits dans les cases) : vérifier qu'ils existent dans le lot.

## Journal du 21/10/2026 : décisions de l'utilisateur et points R1, R9, R10 de RECONTROLE-relecteur.md (`coach`)
Sections « Sécurité et contre-indications » et lignes « Grossesse » non touchées (`kine` les refait au format de knowledge/format-fiches.md). Lignes de tableaux de sécurité d'AUTRES fiches : seul l'id de remplaçant a changé.

| Point | Décision | Détail |
|---|---|---|
| Décision 1 : pompes | fait | Fiche unique `pompe` à 5 échelons : pompe-mur (1), pompe-chaise (2), pompe-genoux (3), pompe-sol (4), pompe-pieds-sureleves (5, intermédiaire ; source M1053 niveau beginner : changement tracé). Fusionne pompe, pompe-inclinee, pompe-genoux (archives dans knowledge/exercices/ecartees/ : pompe-ancienne.md, pompe-inclinee.md, pompe-genoux.md, avec en tête « fusionnée dans pompe le 21/10/2026 »). Variante « mains sur la première marche » non reprise (la chaise couvre le besoin ; à contester si besoin). Nouvelles fiches séparées `pompe-diamant` (M0989, M0990, M0740), `pompe-ecartee` (M1325, M0739), `pompe-archer` (M0076) : `brouillon_coach`, sécurité « À compléter par kine ». pompe-piquee et pompe-piquee-pieds-sureleves restent séparées. |
| Références mises à jour | fait | Remplaçant `pompe-inclinee` -> `pompe-chaise` dans le tableau de sécurité de pompe-piquee et pompe-piquee-pieds-sureleves (l.51) et dans la progression de pompe-piquee (l.39). NON modifié (lignes « Grossesse », hors périmètre) : pompe-piquee l.58 et pompe-piquee-pieds-sureleves l.61 disent encore `pompe-inclinee` : `kine` doit mettre `pompe-chaise`. developpe-au-sol-halteres (progression) cite `pompe-genoux` : l'id existe toujours (échelon 3 de `pompe`). |
| Décision 2 / R1 (bloquant) | fait | montee-sur-marche : haltères AUTORISÉS (première ou deuxième marche, haltères légers, escalier éclairé, dégagé, non glissant, chaussures, option un seul haltère + rampe) ; échelon 1 sans charge, échelon 2 haltères, échelon 3 `montee-sur-box-haute` (sans charge, jamais d'haltères). Tags `marche_escalier` et `box_ou_step` partout (fiches, equipment-taxonomy.md §2) : `marche_escalier` implicite, `box_ou_step` non. Ids de variantes inchangés. La section Sécurité de `kine` (« haltères seulement sur une box basse, jamais sur une marche d'escalier ») est contredite : à réaligner par `kine` ; note de `coach` en tête de la fiche. |
| Tags par fiche | fait | marche_escalier : fente-basse-rotation-appui, pompe-piquee-mains-marche, pompe-piquee-pieds-marche, squat-bulgare-marche, montee-sur-marche-poids-du-corps et -halteres. box_ou_step : montee-sur-box-haute, squat-assis-debout-marche (banc de parc ou box). |
| R9 | fait | developpe-epaules-halteres : variante assise gardée en `debutant` (haltères légers, dossier de chaise calé contre un mur) alors que la source Dumbbell_Shoulder_Press dit intermediate ; ligne ajoutée aux Sources (NON SOURCÉ, changement tracé). |
| R10 | fait | souleve-de-terre-roumain-halteres : installation de `sdt-roumain-deux-halteres` = haltères sur les côtés des cuisses, alignée sur la consigne 1 et la photo 0.jpg. |
| Décision 4 : photo | fait | Fiche `pompe` : Incline_Push-Up-0.webp et -1.webp (public/photos/free-exercise-db/) affichables pour l'échelon `pompe-chaise` seulement, mention « montré sur une box ». Réserve : fichiers absents du dépôt à la rédaction, `relecteur` à faire constater l'absence de logo. |

Hors périmètre, à signaler : knowledge/regles-securite-communes.md (G4, R8) cite encore `pompe-inclinee`, `pompe-genoux` et « première marche seulement » ; tools/build_library.py et knowledge/exercise-library-draft.csv gardent `marche_ou_box` (migration vers `marche_escalier` / `box_ou_step` à faire par `dev`) ; knowledge/format-fiches.md (l.45) et knowledge/materiel-tags.json doivent porter les deux nouveaux tags.

## Questions pour l'utilisateur
1. **Grossesse et post-partum (option la plus prudente retenue par `kine` le 22/10/2026, à confirmer ou changer)** : pas de questionnaire ni de verrou (décision du 22/10/2026), mais un réglage de profil **facultatif** « enceinte / post-partum » que la personne coche elle-même (décoché par défaut, jamais partagé). S'il est coché, les lignes **Grossesse** des 33 fiches s'appliquent, G1 (avertissement et conseil d'avis médical) et G6 (signes d'arrêt) sont affichés, G7 retire les exercices à impact, et aucun plan alimentaire n'est proposé. Limite à accepter : si la personne ne coche pas, l'app ne peut pas savoir et applique les fiches normalement. Alternative : ne rien faire de spécifique à la grossesse (les 33 lignes **Grossesse** deviendraient inutilisées). Règles : knowledge/regles-securite-communes.md §3.

## Journal du 22/10/2026 : points de sécurité de RECONTROLE-2-relecteur.md (`kine`)
- regles-securite-communes.md : G2, G3, G7 rendus cohérents avec « pas de verrou » (affichage seulement, déclencheur = réglage facultatif) ; G4 réécrit et aligné sur les 33 lignes **Grossesse** ; G2 : HAS = conseil, blocage supprimé ; G6/U1 : orientation « maternité / 15 » PROVISOIRE, signes absents de R5 NON SOURCÉ ; §0 renvoie à format-fiches.md (grammaire ASCII, listes fermées) ; §7 marche alignée sur montee-sur-marche ; R9 NON SOURCÉ partout ; règle ajoutée : un remplaçant ou une version plus douce déjà retiré par le profil n'est jamais proposé.
- Fiches : montee-sur-marche (note périmée retirée, consignes alignées : haltères sur la 1re ou 2e marche) ; bird-dog (version plus douce hors grossesse) ; planche-laterale, pompe-piquee, pompe-piquee-pieds-sureleves (NASM non lu = NON SOURCÉ) ; planche-touche-epaule (contradiction coude n1) ; pompe, pompe-archer, pompe-diamant, pompe-ecartee (lignes de sources de sécurité) ; pompe-piquee et pompe-piquee-pieds-sureleves (notes alignées sur les cases, plus de box ni de case de profil) ; rowing-unilateral-haltere, souleve-de-terre-roumain-halteres, squat-gobelet, tirage-w-allonge (notes alignées sur les cases) ; squat-bulgare (plus de serviette sous le pied).
- Laissé à `coach` : fente-basse-rotation (genou posé au sol), developpe-au-sol-halteres (45 degrés), dead-bug (échelon de plus-dur), planche-touche-epaule (consigne 2 « écarte les pieds » contre l'échelon 3), pompe-piquee (consigne 3), pullover (muscles), muscles reclassés, photos sans WebP, pompe-piquee-pieds-sureleves (tag `marche_escalier`).

## Validation utilisateur
Validé par l'utilisateur le 22/10/2026 (décision D5 : relecture des 102 fiches sur la page de relecture ; ne lève pas un bloquant sécurité de relecteur). Fiches sans bloquant en `utilisable`.
