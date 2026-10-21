# Contrôle relecteur : lot pilote (33 fiches + README)
Contrôle indépendant par `relecteur` le 2026-10-21, lancé à neuf (je n'ai pas rédigé ce contenu et je ne l'ai pas corrigé). Les écarts sont à corriger par les auteurs (`coach`, `kine`), puis à recontrôler.

## Ce qui a été réellement vérifié
- **free-exercise-db** : `dist/exercises.json` téléchargé le 2026-10-21 (https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json). Les 23 identifiants cités existent ; consignes, niveau, matériel et muscles comparés fiche par fiche.
- **Photos regardées** (0.jpg et/ou 1.jpg) : Bodyweight_Squat, Stiff-Legged_Dumbbell_Deadlift, Plank, Incline_Push-Up, Bent-Arm_Dumbbell_Pullover, Inverted_Row, Farmers_Walk, Side_Bridge. Les autres photos n'ont pas été regardées.
- **Smith et al. 2017** (BJSM, PMC5739826) : résumé et début du texte lus. 7 essais, 385 adultes avec douleur chronique ; petit avantage à court terme pour l'exercice douloureux, aucune différence à moyen et long terme. Le README le rapporte correctement.
- **HAS 2019 lombalgie** : vu seulement par recherche web (synthèses de presse et extraits de la page HAS) ; la réévaluation à 2-4 semaines est confirmée ; les drapeaux rouges cités comprennent aussi un âge de début avant 20 ans ou après 55 ans. PDF non lu.
- **ACE** : pages « Bird dog » (niveau intermédiaire ; quatre pattes, bras et jambe vers l'horizontale, bassin et épaules de niveau, miroir, hauteur limitée par le contrôle du bas du dos) et « Suitcase Carry » (n° 358, niveau intermédiaire, un haltère) lues. Elles disent bien ce que disent les fiches.
- **Fichiers croisés** : CLAUDE.md, knowledge/README.md, equipment-taxonomy.md, exercise-catalog.md, program-logic.md, load-calibration.md, sources.md, exercise-library-draft.csv (lignes citées).
- **Non revérifiés** (je n'ai pas rouvert la source) : Riebe 2015, NICE NG59, OARSI 2019, Silbernagel 2007, notices d'ancrages de porte, NASM, Prehab Guys. Leur statut PROVISOIRE reste celui que les auteurs ont déclaré ; rien de ce que j'ai lu ne les contredit.
- Consignes : aucune copie mot pour mot repérée. Toutes sont réécrites en français, au tutoiement. Aucune image maxwu ou wger n'est utilisée.

## Tableau des écarts
| n° | Fichier | Ligne ou section | Problème | Gravité | Source vérifiée |
|---|---|---|---|---|---|
| 1 | README.md | R2 (l.117) | Statut PROVISOIRE non justifié. load-calibration.md §8, citée comme base, est elle-même NON SOURCÉ. Les « sources de R4 » (Smith 2017) comparent exercice douloureux et non douloureux ; elles ne disent rien d'un « niveau 2 = aucune augmentation de charge ». À passer en NON SOURCÉ (règle de conception). | à corriger | load-calibration.md §8 ; Smith 2017 (PMC) |
| 2 | README.md | R3 (l.118) | Marquée PROVISOIRE, mais aucune ligne du tableau des sources ne la couvre. Elle traduit CLAUDE.md règle 11 (règle du projet, pas une source). À passer en NON SOURCÉ, ou ajouter une source lue. | à corriger | tableau des sources du README |
| 3 | README.md | R4 (l.119) | Le seuil « deux séances de suite avec douleur, puis mise à jour du profil » n'a aucune source, alors que toute la ligne est en PROVISOIRE. | remarque | Smith 2017 |
| 4 | README.md | R5 (l.120) + section sources | Riebe 2015 porte d'abord sur le **dépistage avant de commencer** : avis médical conseillé aux personnes inactives qui ont une maladie cardiovasculaire, métabolique ou rénale connue, ou des symptômes. Aucune règle du lot ni de knowledge/ ne pose cette question avant le premier programme : seuls les symptômes pendant l'effort sont traités. C'est une contre-indication générale oubliée. | à corriger | source citée par le README (non rouverte) ; grep de knowledge/ et docs/ : aucun dépistage |
| 5 | README.md | R6 (l.121) | La liste des signes qui font consulter omet des drapeaux rouges que sa propre source cite : antécédent de cancer (ligne source HAS, l.133), début des douleurs avant 20 ans ou après 55 ans (HAS, via synthèse), perte de contrôle des selles (NICE NG59, avec les troubles urinaires). | à corriger | HAS 2019 (synthèses) ; ligne source du README |
| 6 | README.md | R6, « Urgence » | Les signes du syndrome de la queue de cheval (troubles pour uriner, engourdissement entre les cuisses, faiblesse qui s'aggrave) sont une urgence. « Consulter sans attendre » est trop vague : écrire « urgences / 15 (ou 112) », comme R5. | à corriger | NICE NG59 (via README, non rouvert) |
| 7 | README.md | R6, seuil de 2 semaines | La HAS recommande au **médecin** de réévaluer à 2-4 semaines une lombalgie aiguë ; l'app en fait un seuil « consulte » pour toutes les zones. C'est bien indiqué comme extrapolation : statut correct. | remarque | HAS 2019 (synthèses) |
| 8 | README.md | Règles communes | Rien sur la grossesse et le post-partum (positions allongées sur le dos prolongées, gainage intense, tête en bas, charge au-dessus du visage). CLAUDE.md ne prévoit cette exclusion que pour la nutrition, mais elle manque aussi ici, alors que le public est fait d'adultes des deux sexes. À faire rédiger et sourcer par `kine`. | à corriger | CLAUDE.md règle 11 ; nutrition-rules.md |
| 9 | README.md + 25 fiches | R2 et tableaux zone x niveau | R2 définit « garder » comme l'exercice normal. Or de nombreuses cases disent « garder : version mur », « garder : charge légère », « garder : descente jusqu'aux genoux… » : c'est en fait « adapter ». `dev` ne peut pas coder cette ambiguïté. Il faut écrire soit « garder », soit « adapter : … ». | à corriger | R2 ; tableaux des fiches |
| 10 | pompe-inclinee (Dos niv. 3), dead-bug (Épaule niv. 3), planche-touche-epaule (Poignet niv. 3) | tableaux | « … seulement si aucune douleur » au niveau 3, alors que R1 définit le niveau 3 comme « douleur » : la condition est toujours fausse. R3 permet de garder une variante qui ne sollicite **pas du tout** la zone ; il faut le dire en ces termes, ou retirer. | à corriger | R1, R3 |
| 11 | README.md | R9 | Marquée NON SOURCÉ alors que free-exercise-db « Bent-Arm_Dumbbell_Pullover » (étape 3) met en garde contre les haltères aux disques desserrés qui tombent sur le visage. La partie « disques serrés » peut passer en PROVISOIRE. | remarque | exercises.json |
| 12 | README.md | l.2 | La phrase de statut se contredit : « statut complete_kine » puis « étapes suivantes : kine complète la section sécurité ». | remarque | - |
| 13 | README.md | « Choix discutables » n°5 | La liste des niveaux changés par rapport à la source est incomplète. La source dit intermédiaire et la fiche débutant sans le signaler pour : marche-du-fermier (Farmers_Walk), fente-arriere (Dumbbell_Rear_Lunge), montee-sur-marche (Dumbbell_Step_Ups). Pullover : voir n°32. | à corriger | exercises.json (champ level) |
| 14 | README.md + tirage-sous-table, marche-du-fermier, porte-valise, porte-sac-a-dos-devant | variantes | Tags `table_solide`, `bidons_ou_sacs`, `sac_a_dos` absents du vocabulaire de equipment-taxonomy.md §2 : les objets du quotidien y sont listés en texte libre, sans tag. Tant qu'ils n'y sont pas, ces variantes ne peuvent pas passer au statut « vérifié ». porte-sac-a-dos-devant et tirage-sous-table n'ont aucune variante dans le vocabulaire. | à corriger | equipment-taxonomy.md §2 |
| 15 | squat-bulgare, montee-sur-marche, pompe-inclinee, pompe-piquee(-pieds-sureleves), fente-basse-rotation | Sources, « Avertissement de stabilité de la marche (première marche, rampe) » | Citation inexacte : exercise-catalog.md §5 ne parle pas de marche (il cite chaise, table, sac). La règle vient de R8. | remarque | exercise-catalog.md §5 |
| 16 | pompe-inclinee (mur), pompe-piquee, tirage-w-allonge, planche-touche-epaule, mobilite-cheville-au-mur | Sources, « Brouillon Mxxxx (wger…) » | Statut PROVISOIRE, alors que sources.md classe le contenu wger en NON VÉRIFIÉ et qu'aucune page wger n'a été lue. Le brouillon prouve seulement que le mouvement existe. | remarque | sources.md l.23 |
| 17 | Photos Incline_Push-Up, Inverted_Row | Photo | Marques visibles : logo « Boise CrossFit » au mur, « Hammer Strength » sur le rack. CLAUDE.md règle 12 interdit les marques d'une autre **app** ; ce sont des marques de salle et de matériel. À trancher : recadrer ou accepter. | remarque | photos regardées |
| 19 | squat-poids-du-corps | frontmatter | Les fessiers sont mis en muscle principal alors que la source les classe en secondaire (principal : quadriceps). Le tableau des sources dit « quadriceps ; fessiers, ischios » sans signaler ce changement. | remarque | exercises.json |
| 20 | squat-poids-du-corps | Consignes 1 | « Orteils légèrement ouverts » n'est pas dans la source (pieds à largeur d'épaules), et aucune ligne NON SOURCÉ ne le signale. | remarque | exercises.json |
| 21 | squat-poids-du-corps | Photo | Vérifié : les photos montrent bien les mains derrière la tête et une descente complète ; la source autorise les mains derrière la tête. Le choix « bras devant » est déjà signalé : à trancher par l'utilisateur. | remarque | photo 1.jpg |
| 22 | souleve-de-terre-roumain-halteres | Consignes 1 et 4 ; Sources l.73 | La fiche dit « haltères devant les cuisses, qui glissent le long des jambes ». La source et la photo montrent les haltères **sur les côtés**, descendus jusqu'au-dessus des pieds. La consigne de la fiche est une pratique courante du soulevé roumain, mais elle est attribuée à free-exercise-db : écart. Il faut l'aligner sur la source et la photo, ou la marquer NON SOURCÉ. | à corriger | exercises.json ; photos 0 et 1 |
| 23 | souleve-de-terre-roumain-halteres | Sécurité, Dos niveau 1 | « garder : descente jusqu'aux genoux seulement, charge non augmentée » : c'est une adaptation (n°9). « Pas d'augmentation » est la règle du niveau 2 dans R2. Il faut harmoniser. Le README (fiches à risque) dit aussi autre chose : « dos niveau 1 : amplitude ou appui réduits ». | à corriger | R2 ; README fiches à risque |
| 24 | planche | Photo | `Plank/0.jpg` ne montre **pas** une planche, mais une personne à genou sur un seul genou (position de départ). Seule `1.jpg` (planche sur avant-bras) est utilisable. | à corriger | photos regardées |
| 25 | planche | Variantes, Sources | La variante « sur les genoux » et le fait qu'elle soit plus facile n'ont aucune ligne de source, même NON SOURCÉ. | à corriger | exercises.json (la source ne cite que les variantes bras ou jambe levés) |
| 26 | planche | Dosage ; Dos niveau 2 | Fiche non codable en l'état : aucune durée de maintien (trou n°5 du README) ; « maintien court » n'est pas chiffré. Déjà signalé par l'auteur. | remarque | program-logic.md §9 |
| 27 | pompe-inclinee | Variante marche (l.18) | « Mains sur la 2e ou 3e marche » contredit R8 (« seulement la première marche ») et la ligne source l.83 de la fiche (« première marche, rampe »). Le risque est plus faible mains en appui que pieds dessus, mais les deux textes doivent dire la même chose. | à corriger | R8 ; fiche l.68, l.83 |
| 28 | pompe-inclinee | l.13, Progression | L'ordre « chaise puis marche (plus dur) » n'est pas garanti. Une 2e ou 3e marche (environ 35 à 55 cm) peut être aussi haute ou plus haute qu'une assise de chaise (environ 45 cm). Or la fiche pose elle-même la règle « plus haut = plus facile ». Il faut classer par hauteur, pas par objet. NON SOURCÉ de toute façon. | à corriger | logique interne de la fiche |
| 30 | pompe-inclinee, pompe, pompe-genoux | frontmatter | Triceps en muscle principal alors que la source le classe en secondaire (principal : pectoraux). Ce changement n'est pas signalé. | remarque | exercises.json |
| 31 | pompe-inclinee | Photo | La fiche dit « mains sur le bord d'un banc » ; la photo montre une box en bois. Elle peut quand même illustrer les variantes. | remarque | photo 1.jpg |
| 32 | pullover-haltere-au-sol | frontmatter niveau_min | Débutant alors que la source dit **intermédiaire**. Ce n'est pas signalé dans la fiche ni dans le README (choix n°5). `kine` est d'accord pour la variante sol (désaccord n°4), mais le changement doit être tracé, et la variante banc devrait rester intermédiaire. | à corriger | exercises.json |
| 33 | pullover-haltere-au-sol | « Pourquoi cette fiche » (l.14) | Le texte présente comme établi que le pull-over fait travailler le grand dorsal et qu'il est « le meilleur substitut ». La source met les **pectoraux** en principal, le grand dorsal en secondaire, et la ligne l.81 dit NON SOURCÉ. Ce texte sera affiché : extrapolation présentée comme prouvée. Il faut nuancer (« sollicite aussi le grand dorsal ; substitut faute de mieux »). Même remarque pour l'ordre `muscles_principaux: [grand_dorsal, pectoraux]`. | à corriger | exercises.json ; fiche l.80-81 |
| 34 | pullover-haltere-au-sol | Variante banc (l.20) ; Photo | La fiche décrit « allongé sur un banc, pieds au sol » (dans la longueur). La source et la photo montrent une position **en travers** du banc : seules les épaules sont posées, les hanches sous le banc, la tête dans le vide. Ce n'est pas la même installation et elle demande plus d'équilibre et d'amplitude. La photo induirait en erreur. | à corriger | exercises.json ; photo 1.jpg |
| 35 | tirage-sous-table | Avertissement (l.18, coach) | « Teste-la d'abord en tirant doucement » : ce test se fait allongé sous la table, donc dans la situation dangereuse. Il contredit le test debout de `kine` (l.68) et le désaccord n°1 du README, qui demandait la correction. Le texte de coach n'a pas été corrigé : deux consignes contradictoires restent affichables. | **bloquant** | fiche l.18 et l.68 ; README désaccord n°1 |
| 36 | tirage-sous-table | Sources l.86 ; Objets du quotidien l.68 | **Le raisonnement mécanique est faux sur le sens de la force.** Allongé dessous, on tire le corps vers le bord : le bord reçoit surtout une force **vers le bas** (une partie du poids du corps), pas vers le haut. Une force vers le bas entre les pieds de la table ne peut pas la faire basculer. Appliquée sur un **débord** au-delà de la ligne des pieds, elle fait basculer la table **vers la personne** (le côté opposé se soulève). Cela arrive dès que la force multipliée par la longueur du débord dépasse le poids de la table multiplié par la distance entre son centre de gravité et la ligne des pieds. Le test « soulever le bord debout » applique une force vers le haut : il ne teste pas ce mode d'accident et donne une fausse assurance. La vraie condition de sécurité est « mains entre les pieds, jamais sur un débord » (l.70). Elle n'est aujourd'hui qu'une consigne parmi d'autres. Elle doit devenir une condition obligatoire, et le test doit être revu (par exemple : appui vertical de tout le poids du corps sur le bord, debout à côté, sans être dessous). Statut NON SOURCÉ correctement indiqué, mais la règle présentée comme décisive repose sur une erreur. | **bloquant** | analyse mécanique (aucune source externe) |
| 37 | program-logic.md §4, règle 1 (hors lot, contradiction) | « matériel implicite (chaise, mur, sol, table, sac à dos chargé, serviette, escalier) » | La table et le sac à dos y sont **implicites**. Or equipment-taxonomy.md §2 les classe en objets à cocher, et `kine` exige un test validé dans le profil avant de proposer tirage-sous-table. Si `dev` suit program-logic.md, la fiche à risque serait proposée à tous sans test. | **bloquant** | program-logic.md §4 ; equipment-taxonomy.md §2 ; README fiches à risque |
| 38 | tirage-sous-table | Installation l.15 ; Objets l.69 | Tables à **pied central** (guéridon, pied tulipe) et tables à plateau qui déborde beaucoup : avec elles, tout le bord est hors de la base d'appui, donc dangereuses (voir n°36). Elles ne sont exclues qu'implicitement (« 4 pieds fixes »). L'installation l.15 dit seulement « table lourde et stable ». Il faut les nommer dans les exclusions et dans l'avertissement de coach. | à corriger | analyse mécanique |
| 39 | tirage-sous-table | Sécurité, Poignet niveau 1 | « Serviette pliée sur le bord » : une serviette diminue l'adhérence de la prise. Cela contredit le signe d'arrêt « les mains glissent sur le bord » et crée un risque de chute en arrière, tête comprise. Il faut proposer autre chose (prise sans serviette, ou retirer). | à corriger | logique interne de la fiche |
| 40 | tirage-sous-table | Points d'attention (kine) | « Test validé dans le profil » : aucun champ de ce type n'existe dans le modèle (docs) ni dans equipment-taxonomy.md. Il faut le spécifier avec `dev` avant tout codage, en plus du tag (n°14). | à corriger | equipment-taxonomy.md |
| 41 | tirage-sous-table | Photo | Photo prise dans un rack, barre guidée (Smith) : bien signalé « montré à la barre ». | remarque | photo 1.jpg |
| 42 | squat-assis-debout | Sources l.70 | Les muscles viennent de « Sit_Squats », que la fiche elle-même décrit comme un autre mouvement (demi-squat sans chaise). C'est acceptable en PROVISOIRE, mais il faut le dire. | remarque | exercises.json |
| 43 | squat-assis-debout | Niveau 2, « coussin ferme » | Un coussin posé sur l'assise peut glisser, et R8 ne l'encadre pas. Préciser : coussin antidérapant ou plié et calé, sinon une chaise plus haute. | remarque | R8 |
| 44 | squat-gobelet | Sources, dernière ligne | Le libellé dit « Haltère au-dessus du visage », alors que la règle de la fiche (l.54) concerne l'haltère tenu contre la poitrine. | remarque | - |
| 45 | fente-arriere, squat-fendu, montee-sur-marche | tableaux | Pas de ligne « Dos » alors que les variantes haltères chargent le dos. Avec « zone non listée = garder », une personne avec une gêne au dos de niveau 2 garderait les haltères. | remarque | R2 |
| 46 | fente-arriere | Points d'attention, Erreurs | « Tibia vertical / genou qui part loin devant » reprend l'idée de la source (« le genou ne doit pas dépasser les orteils, stress indu »). Comme repère technique, cela peut aller ; ne pas le présenter comme un danger. | remarque | exercises.json (Dumbbell_Rear_Lunge) |
| 47 | squat-bulgare | Variante marche (l.16) | L'installation de coach ne précise pas « première marche » ; seule la section kine le dit. | remarque | R8 |
| 48 | montee-sur-marche | Progression ; Objets | « Marche plus haute = box stable » et « haltères seulement sur une box basse » : le tag `marche_ou_box` ne distingue pas une marche d'escalier d'une box. Le générateur ne peut pas vérifier ces conditions. Il faut un tag `box` séparé, ou une question dans le profil. | à corriger | equipment-taxonomy.md §2 |
| 49 | pompe | Variante pompe-poignees-halteres | La variante exige des haltères **hexagonaux**. Le tag `halteres` ne le dit pas, et les haltères réglables à disques ronds roulent. Il faut un attribut dans le profil, ou retirer la variante. | à corriger | equipment-taxonomy.md §2 |
| 50 | pompe-genoux | Sources l.49 | ACE est en PROVISOIRE alors que seule la page d'index a été lue (« détail non lu »). Une source non lue = NON SOURCÉ. | à corriger | consigne de statut |
| 51 | pompe-piquee-pieds-sureleves | Sources l.58 | Prehab Guys : « titre vu en recherche, page non lue ». C'est NON SOURCÉ, pas PROVISOIRE. | à corriger | consigne de statut |
| 52 | developpe-epaules-halteres | Variante assise l.15 ; Dos niveau 1 ; Objets | La variante et le niveau 1 dos disent « dos contre le dossier », alors que les objets du quotidien disent « ne te penche pas en arrière contre le dossier : la chaise peut basculer ». Avec le dossier calé contre un mur, elle ne peut pas basculer en arrière. Il faut une seule consigne cohérente. | à corriger | logique interne de la fiche |
| 53 | rowing-unilateral-haltere | Dos niveau 2 | « Appui plus haut, par exemple une table stable » : la table n'est ni un tag ni testée pour cet usage (n°14, n°40). Il faut préciser l'objet autorisé (dossier de chaise calé, plan de travail) ou ne pas en citer. | à corriger | equipment-taxonomy.md §2 |
| 54 | rowing-buste-penche-halteres | Photo | Vérifié : `Bent_Over_Two-Dumbbell_Row_With_Palms_In` existe bien dans free-exercise-db (débutant, haltères). Photo non regardée. | remarque | exercises.json |
| 55 | tirage-w-allonge | « Pourquoi cette fiche » | « Reproduit la fin d'une traction » est une affirmation NON SOURCÉ dans un texte qui sera affiché. Il faut l'atténuer. | remarque | - |
| 56 | planche-laterale | Photo | Vérifié : `Side_Bridge/0.jpg` montre la version **sur les pieds**, jambes tendues. Variante genou : aucune photo. | remarque | photo 0.jpg |
| 57 | marche-du-fermier | Photo | `Farmers_Walk/0.jpg` montre des **poignées de strongman** chargées de disques, pas des haltères : c'est du matériel spécialisé (CLAUDE.md règle 23, exercise-catalog.md §5). Photo à ne pas utiliser. | à corriger | photo 0.jpg |
| 58 | porte-sac-a-dos-devant | Sources | Le mouvement, les consignes et les muscles sont entièrement NON SOURCÉS. C'est correctement signalé, mais rien ne peut être codé sans validation (CLAUDE.md règle 10). | remarque | - |
| 59 | exercise-library-draft.csv (hors lot) | M1418, M1777, M0410 | Anomalies absentes de la liste du README : M1418 « Incline Push-Up » tagué `banc_inclinable` alors qu'un support quelconque suffit ; M1777 et M0410 (pull-over) classés `pull_h` alors que la fiche les range en tirage vertical. | remarque | CSV |

(La numérotation saute 18 et 29 : points fusionnés dans d'autres lignes.)

## Décompte
- **Bloquant : 3** (n° 35, 36, 37, tous liés à tirage-sous-table)
- **À corriger : 29**
- **Remarque : 25**
- Total : 57 points.

## Verdict par fiche
« Validable après corrections mineures » veut dire : aucun point bloquant propre à la fiche, mais les points « à corriger » qui la concernent (y compris les n° 1-14 communs) doivent être traités par l'auteur puis recontrôlés. Cela ne fait passer aucune ligne en OK : les statuts PROVISOIRE et NON SOURCÉ restent, et CLAUDE.md règle 10 s'applique avant tout codage.

| Fiche | Verdict | Points propres |
|---|---|---|
| squat-poids-du-corps | validable après corrections mineures | 19, 20, 21 (remarques seulement) |
| souleve-de-terre-roumain-halteres | validable après corrections mineures | 22, 23 |
| planche | validable après corrections mineures | 24, 25, 26 |
| pompe-inclinee | validable après corrections mineures | 10, 27, 28, 30, 31 |
| pullover-haltere-au-sol | validable après corrections mineures | 32, 33, 34 |
| **tirage-sous-table** | **bloqué** | 35, 36, 37 (bloquants), 38, 39, 40, 41 |
| squat-assis-debout | validable après corrections mineures | 42, 43 |
| squat-gobelet | validable après corrections mineures | 44 |
| pont-fessier | validable après corrections mineures | aucun point propre (seulement les communs) |
| souleve-de-terre-roumain-unijambiste | validable après corrections mineures | aucun point propre |
| fente-arriere | validable après corrections mineures | 13, 45, 46 |
| squat-fendu | validable après corrections mineures | 45 |
| squat-bulgare | validable après corrections mineures | 15, 47 |
| montee-sur-marche | validable après corrections mineures | 13, 45, 48 |
| pompe-genoux | validable après corrections mineures | 30, 50 |
| pompe | validable après corrections mineures | 30, 49 |
| developpe-au-sol-halteres | validable après corrections mineures | aucun point propre |
| developpe-epaules-halteres | validable après corrections mineures | 52 |
| pompe-piquee | validable après corrections mineures | 16 |
| pompe-piquee-pieds-sureleves | validable après corrections mineures | 51 |
| rowing-unilateral-haltere | validable après corrections mineures | 53 |
| rowing-buste-penche-halteres | validable après corrections mineures | 54 |
| tirage-w-allonge | validable après corrections mineures | 16, 55 |
| planche-laterale | validable après corrections mineures | 56 |
| dead-bug | validable après corrections mineures | 10 |
| bird-dog | validable après corrections mineures | aucun point propre (ACE vérifié) |
| planche-touche-epaule | validable après corrections mineures | 10, 16 |
| marche-du-fermier | validable après corrections mineures | 13, 14, 57 |
| porte-valise | validable après corrections mineures | 14 (ACE vérifié) |
| porte-sac-a-dos-devant | validable après corrections mineures | 14, 58 |
| chat-vache | validable après corrections mineures | aucun point propre |
| fente-basse-rotation | validable après corrections mineures | 15 |
| mobilite-cheville-au-mur | validable après corrections mineures | 16 |
| README (règles R1-R10) | validable après corrections mineures, **sauf** que le lot n'est pas validable tant que n° 35-37 restent ouverts | 1-17 |

**Le lot n'est pas validé : 3 points bloquants restent ouverts.** Ils concernent tirage-sous-table et une contradiction de program-logic.md avec cette fiche.
