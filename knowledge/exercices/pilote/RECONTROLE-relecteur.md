# Recontrôle relecteur : lot pilote après corrections + regles-securite-communes.md
Recontrôle indépendant par `relecteur` le 2026-10-21, lancé à neuf. Je n'ai écrit ni les fiches ni le fichier de règles, et je ne les ai pas corrigés : je liste les écarts. Contrôle ciblé : le fichier de règles en entier, les 57 points du premier contrôle, les éléments nouveaux (échelons, photos, tags, grossesse).

## Ce qui a été réellement ouvert
- **eparmedx.com** : pages https://eparmedx.com/?page_id=79 et https://eparmedx.com/?page_id=746 (conditions), lues le 2026-10-21. PDF anglais PAR-Q+ 2025 (https://eparmedx.com/wp-content/uploads/2025/01/PARQPlus2025Fillable.pdf), page 1 lue.
- **HAS lombalgie, fiche mémo, mars 2019** (fm_lombalgie_v2_2.pdf) : lue en entier.
- **HAS 2019, grossesse et post-partum** (app_329_ref_aps_grossesse_vf.pdf) : lue (tableaux 2, 3, 4, précautions, post-partum, tableau de prescription).
- **HAS 2022, fiche patiente grossesse** (ap_fiche_grossesse.pdf) : lue en entier.
- **CSEP / Mottola 2019** (https://csepguidelines.ca/?p=1037) : page de résumé lue.
- **Riebe 2015** : seulement le résumé (https://digitalcommons.uri.edu/kinesiology_facpubs/180).
- **free-exercise-db** `dist/exercises.json` (téléchargé à nouveau le 2026-10-21) : niveaux, muscles et consignes des 23 identifiants cités.
- Fichiers croisés : CLAUDE.md, knowledge/README.md, equipment-taxonomy.md, program-logic.md §4 (diff du dernier commit), exercise-catalog.md §2, README du lot, les 32 fiches (lignes Grossesse, tableaux zone x niveau, tableaux d'échelons), ecartees/tirage-sous-table.md (en-tête).

## Ce que je n'ai pas pu ouvrir ou que je n'ai pas rouvert
- **Q-AAP+ (version française)** : PDF non ouvert ; son existence (janvier 2024, « French, North America ») est confirmée par la page officielle seulement.
- Page des traductions eparmedx (print-versions-of-par-q/languages) : non ouverte.
- Riebe 2015 texte complet, NICE NG59 texte complet, Mottola 2019 BJSM texte complet, ACOG 804, OARSI 2019, Smith 2017, Silbernagel 2007, notices d'ancrages de porte, pages ACE : non rouverts.
- Page officielle sur le 15 et le 112 : non lue (les auteurs non plus).
- **Photos** : aucune image regardée pendant ce recontrôle. Les mentions « affichable : oui » reposent sur l'examen du premier contrôle et de `coach`.

## Tableau des écarts
| n° | Fichier | Section / ligne | Problème | Gravité | Source vérifiée |
|---|---|---|---|---|---|
| R1 | montee-sur-marche.md | Variantes l.18 ; Progression l.40 ; Objets du quotidien l.72 ; README journal coach n° 48 | **Deux consignes de sécurité contradictoires, toutes deux affichables.** `coach` (l.18, l.40, journal n° 48) : haltères « sur une marche basse ou une box basse », « la charge s'ajoute à l'échelon 1 » (installation de l'échelon 1 = première marche d'escalier). `kine` (l.72) : haltères seulement sur une box basse, jamais sur une marche d'escalier (les mains ne sont plus libres pour la rampe). En plus, aucun tag ne permet de coder « box basse » : `marche_ou_box` = première marche d'escalier, `box_stable` = box plus haute qu'une marche. Le générateur proposerait donc les haltères dans l'escalier. Risque : chute avec charge. Même nature que l'ancien n° 35. | **bloquant** | fiche ; README ; equipment-taxonomy.md §2 |
| R2 | regles-securite-communes.md | §3 G4 (l.70) | Contradiction interne. « Adapter » cite « squats » et « pompes inclinées » ; « Garder » cite squat-poids-du-corps, squat-assis-debout et pompe-inclinee. Une même fiche ne peut pas être à la fois adaptée et gardée. | à corriger | fichier lui-même |
| R3 | squat-poids-du-corps (l.58), squat-assis-debout (l.57), pompe-inclinee (l.60) | ligne « Grossesse » | « garder (appui:mur…) », « garder (respiration continue, sans maintien en bas) », « garder (pompe-inclinee-mur ou pompe-inclinee-chaise…) » : §0 dit « garder : rien d'autre après le mot ». Ce sont des adaptations. Pour pompe-inclinee, c'est même une restriction de variantes : l'échelon 3 (marche) est exclu. Cela recrée l'ambiguïté du point 9. | à corriger | regles-securite-communes.md §0 |
| R4 | regles-securite-communes.md §0 (l.12) et 27 fiches | tableaux zone x niveau | §0 impose « une modification codable, **une seule** ». Or 27 fiches ont des cases qui combinent plusieurs actions (ex. planche Dos 2 : « variante:planche-genoux, amplitude:maintien court ») ou qui proposent un choix (« amplitude:réduite, ou variante:… » : squat-poids-du-corps Cheville 2, squat-fendu Cheville 2, sdt roumain Hanche 2 et Coude/poignet 2). Beaucoup contiennent du texte libre non codable (« buste plus redressé », « descente lente, mains sur les cuisses », « amplitude:sans gêne », « talon qui glisse au sol »). Les lignes Grossesse ajoutent « respiration continue », « poids connu », « jamais jusqu'à l'échec », « main sur la rampe », qui ne sont pas dans le vocabulaire. Il faut soit autoriser une liste d'actions et des valeurs fermées dans §0, soit réécrire les cases. | à corriger | §0 ; grep des 32 fiches |
| R5 | regles-securite-communes.md | §2.2 question 3 (l.45) ; phrase l.42 | La question 3 (« Un médecin t'a-t-il dit de ne faire du sport que sous surveillance médicale ? ») traduit presque mot pour mot la question 7 du PAR-Q+ 2025. La question 1 en reprend la structure (question 1 du PAR-Q+). Le fichier affirme pourtant des formulations « volontairement différentes » sourcées sur l'ACSM ; or la question 3 n'est pas dans le modèle ACSM (résumé Riebe). Les conditions interdisent les « derivative materials » sans accord écrit : reformuler, ou la sourcer et la traiter comme dérivée du PAR-Q+. | à corriger | PDF PAR-Q+ 2025 p.1 ; eparmedx ?page_id=79 |
| R6 | regles-securite-communes.md | §2.1 « Décision » (l.36) | « Autorisé sans accord : un lien ». Les conditions (?page_id=746) disent que les demandes de lien sont examinées au cas par cas, selon des critères, pour les organisations. Le fichier le note lui-même à la l.35, puis conclut sans réserve. Il faut écrire « lien probablement acceptable pour un usage privé et gratuit, à confirmer dans la demande d'accord ». Le reste de la conclusion est conforme à la source : intégration interdite sans accord écrit ; « unaltered » ; ni électronique ni dérivé ; traductions sur permission ; copyright 2007-2026. | à corriger | eparmedx ?page_id=79, ?page_id=746 |
| R7 | regles-securite-communes.md | §3 G2 (l.68) | « Avis obligatoire si complication de grossesse ou maladie chronique (HAS 2022) » : la fiche HAS 2022 dit « **conseillées** » (consultation dédiée et consultation obstétricale). Le blocage par l'app est un choix plus prudent, acceptable, mais il ne doit pas être attribué à la HAS. | à corriger | HAS 2022 fiche patiente |
| R8 | regles-securite-communes.md | §3 G6 (l.72) et U1 (l.93) | Liste des signes d'arrêt : conforme mot pour mot au tableau 4 de la HAS 2019 et à la fiche HAS 2022 (OK). Mais l'orientation « appeler la maternité / le 15 » pour saignement, perte des eaux et contractions n'est pas dans la HAS : celle-ci dit « arrêter et consulter le médecin ou la sage-femme », et réserve l'urgence à la douleur de poitrine. Statut « OK (HAS) » trop large : cette orientation doit être marquée PROVISOIRE ou NON SOURCÉ. Elle reste prudente, sans danger. | à corriger | HAS 2019 tableau 4 ; HAS 2022 |
| R9 | developpe-epaules-halteres.md | Variantes l.17 ; Sources | free-exercise-db « Dumbbell_Shoulder_Press » (version assise, source de la variante assise) est **intermédiaire** ; la fiche met la variante assise en débutant sans le tracer. Le README (choix n° 4) ne la cite pas non plus. Contraire à la règle d'exercise-catalog.md §2 (« tout changement de niveau est tracé »). | à corriger | exercises.json (level) |
| R10 | souleve-de-terre-roumain-halteres.md | Variantes l.17 | Reste du point 22. Les consignes sont alignées (haltères sur les côtés), mais l'installation de `sdt-roumain-deux-halteres` dit encore « un haltère dans chaque main, **devant les cuisses** ». Elle contredit la consigne 1 et la photo affichée (0.jpg). | à corriger | fiche ; exercises.json |
| R11 | rowing-unilateral-haltere.md | Dos niveau 2 | Reste du point 53. « Support stable plus haut… essai obligatoire » : aucun tag ni champ ne le code ; « buste plus redressé » est du texte libre. Non codable en l'état. | à corriger | equipment-taxonomy.md §2 |
| R12 | pullover-haltere-au-sol.md | frontmatter l.8 ; Sources l.86 | `muscles_principaux: [pectoraux, grand_dorsal]` alors que la source met seulement « chest » en principal (lats en secondaire). La ligne de source dit « l'ordre de la fiche suit la source » : c'est vrai pour l'ordre, pas pour le classement. Non tracé. | remarque | exercises.json |
| R13 | pullover-haltere-au-sol (l.93), squat-gobelet (l.85), developpe-au-sol-halteres (l.83), dead-bug (l.84) | Sources, ligne « haltère au-dessus du visage » | « Aucune source trouvée : NON SOURCÉ », alors que regles-securite-communes.md R9 passe la partie « disques serrés » en PROVISOIRE (mise en garde vérifiée dans free-exercise-db Bent-Arm_Dumbbell_Pullover, étape 3). Les deux fichiers ne disent pas la même chose. | remarque | exercises.json |
| R14 | pullover-haltere-au-sol.md | Épaule niveau 1 | La case mêle trois actions et une décision par variante (« pullover-banc-haltere : retirer »). Le sens est prudent, mais le format n'est pas dans §0 (voir R4). | remarque | §0 |
| R15 | planche.md | Dos niveau 2 ; Repères de dosage | Point 26 toujours ouvert : « amplitude:maintien court » n'est pas chiffré, aucune durée de maintien n'est sourcée. Déjà signalé par l'auteur ; non codable tant que ce n'est pas tranché. Aucune consigne propre à l'échelon 1 (genoux). | remarque | program-logic.md §9 |
| R16 | pompe-inclinee.md (l.20) ; pompe-piquee-pieds-sureleves (pompe-piquee-pieds-marche) | Variantes, tag `marche_ou_box` | Le classement par hauteur (point 28) tient pour une première marche d'escalier. Mais le nom du tag `marche_ou_box` laisse penser qu'une box convient, et une box peut être plus haute qu'une chaise : l'ordre des échelons ne serait plus garanti. equipment-taxonomy.md définit le tag comme « première marche ; banc de parc de hauteur comparable », ce qui est cohérent ; seul le nom du tag est trompeur. | remarque | equipment-taxonomy.md §2 |
| R17 | fente-arriere, squat-fendu, fente-basse-rotation, pompe-piquee | tableaux d'échelons | Lignes non rangées du plus facile au plus dur (l'échelon 2 est listé avant l'échelon 1), contrairement au format (README « Format retenu », exercise-catalog.md §2). Les numéros d'échelon, eux, sont cohérents. | remarque | exercise-catalog.md §2 |
| R18 | regles-securite-communes.md | §5 S3 (l.86) | Les signes (sphincters, paresthésie du pubis ou du périnée, atteinte motrice des jambes) sont bien dans la fiche mémo HAS (OK). La HAS parle de « prise en charge spécifique et/ou urgente », sans nommer le 15 : le choix du 15 est raisonnable, mais c'est une règle du projet. | remarque | HAS fiche mémo lombalgie |
| R19 | regles-securite-communes.md | §5 S1 (l.84) | « La zone passe au niveau 3 jusqu'à mise à jour par la personne » : règle de conception non marquée NON SOURCÉ (le statut ne couvre que les signes). | remarque | - |
| R20 | regles-securite-communes.md | U1 (l.93) | Les déclencheurs « perte de connaissance » et « difficulté à respirer au repos » ne figurent pas dans R5 (malaise, essoufflement anormal), alors qu'U1 renvoie à « leurs sources ». Ils sont prudents, mais NON SOURCÉ en l'état. | remarque | - |
| R21 | regles-securite-communes.md | §3 G3 (l.69) | « Hypertension ou diabète non contrôlés » sont des contre-indications **relatives** pour la HAS 2019 (tableau 3) et **absolues** pour Mottola/CSEP. La liste est conforme à Mottola, pas à la HAS. Sans conséquence pratique (l'app ne teste pas la liste), mais à attribuer correctement. | remarque | HAS 2019 tableaux 2-3 ; CSEP |
| R22 | regles-securite-communes.md | §3 G5 (l.71) | Repères conformes à la HAS 2019 (8-15 répétitions, fatigue modérée, 1 série débutantes, 2-3 entraînées, 2-3 séances non consécutives, 60-90 min). « Altitude évitée » : la HAS fixe le seuil au-delà de 2 500 m. | remarque | HAS 2019 |
| R23 | regles-securite-communes.md | §2.2 (l.40) ; R5 (l.24) | Le résumé de Riebe présente 3 facteurs (activité ; maladie connue et/ou symptômes ; intensité souhaitée) ; le fichier les présente comme 4. La définition « régulier = 30 min, 3 j/sem, 3 mois » n'est pas dans le résumé (synthèses seulement) : le statut PROVISOIRE convient. Riebe porte sur le dépistage avant de commencer ; l'utiliser comme liste de signes d'arrêt pendant la séance (R5) est une extrapolation. La question 2 omet des symptômes du modèle ACSM (souffle au cœur connu, fatigue inhabituelle, essoufflement en position couchée), d'après les synthèses, non revérifiées. | remarque | Riebe 2015 (résumé) |
| R24 | regles-securite-communes.md | §4 (l.77) ; §8 (l.108) ; §2.1 (l.34) | « Case tête en bas déconseillée » citée en §4 mais définie nulle part. §8 « mettre à jour les 33 fiches » est périmé : 32 fiches, et c'est déjà fait selon le journal de kine. « Version française officielle » : le site précise que les traductions ne sont pas juridiquement contraignantes et que l'anglais fait foi. | remarque | eparmedx ?page_id=79 |
| R25 | regles-securite-communes.md / fiches | G4 et lignes Grossesse | bird-dog (adapter) et pompe / pompe-genoux (adapter -> pompe-inclinee) ne sont pas classés dans G4. Le classement de squat-gobelet (charge tenue contre la poitrine) est cohérent avec G4 (« squats ») mais pas discuté, alors que porte-sac-a-dos-devant est retiré pour une charge contre le ventre. Les remplaçants s'écrivent « remplaçant : bird-dog sans pause » au lieu de `remplaçant:<id>`. Toutes les autres lignes Grossesse sont cohérentes avec G4 : retirer pour dos/ventre, tête en bas/chute, isométrique, sac contre le ventre ; adapter pour soulevés, rowings, fentes, portés. | remarque | G4 ; 32 lignes Grossesse |
| R26 | squat-fendu.md | Sources (muscles) | Les muscles viennent de « Split_Squat_with_Dumbbells », que le README signale comme un squat bulgare (pied arrière surélevé), donc un autre mouvement. Ce n'est pas dit dans la fiche. | remarque | exercises.json ; README anomalies |

### Vérifications sans écart
- **PAR-Q+** : la version actuelle est la 2025 (anglais) ; le Q-AAP+ français existe (janvier 2024). Les conditions sont rapportées fidèlement : non modifié, ni électronique ni dérivé sans accord écrit, pas de vente, traductions sur permission, copyright 2007-2026. La décision « intégration interdite sans accord écrit » est justifiée.
- **S2** : chaque signe correspond à un drapeau rouge de la fiche mémo HAS : douleur non mécanique, traumatisme important, perte de poids, cancer, corticoïdes prolongés, déformation, douleur thoracique, âge d'apparition < 20 ou > 55 ans, fièvre, altération de l'état général. La combinaison des signes et la réévaluation à 2-4 semaines sont bien rapportées. L'usage de drogue intraveineuse est omis, et c'est signalé.
- **G1, G6 (liste), G7** : conformes à la HAS 2019 (évaluation préalable ; tableau 4 ; post-partum : consultation postnatale, pas d'impact avant la rééducation périnéale et un périnée jugé normal, 4-6 et 8-10 semaines, allaitement). Les signes post-partum propres à `kine` sont bien marqués NON SOURCÉ.
- **G4 (principe)** : la HAS 2019 dit bien « éviter allongé sur le dos à partir de la 24e semaine » ; le tableau ajoute 16e semaine (abdominaux, position couchée ou debout prolongée), isométrique prolongé, Valsalva et chutes. L'application dès le début de la grossesse est bien signalée comme extrapolation.
- **Tags** : `sac_a_dos`, `bidons_ou_sacs` et `box_stable` sont dans equipment-taxonomy.md §2, comme objets à cocher et jamais implicites ; `table_solide` est retiré. program-logic.md §4 n'a plus ni table ni sac dans l'implicite (ancien bloquant n° 37 levé).
- **tirage-sous-table** : absente du dossier pilote et de toutes les fiches (aucun « table » restant). Elle n'est mentionnée que comme retirée (README, program-logic.md, equipment-taxonomy.md). La fiche est dans ecartees/ avec un en-tête « ÉCARTÉE » et le rappel des points bloquants.
- **Identifiants** : les 98 identifiants (fiches et variantes) sont uniques. Toutes les références `variante:`, `sans-zone:` et `remplaçant:` des fiches et du fichier de règles pointent vers un identifiant existant. L'ancien identifiant `pompe-poignees-halteres` n'est plus cité nulle part, sauf dans le premier contrôle.
- **Échelons** : `niveau_min` = niveau de l'échelon 1 dans les 32 fiches. Les variantes qui changent seulement la charge ou le matériel gardent le même échelon (règle respectée). L'ordre de difficulté est plausible partout : mains plus hautes = plus facile ; pieds plus hauts = plus dur ; unilatéral = plus dur.
- **Niveaux tracés** : marche-du-fermier, fente-arriere, montee-sur-marche, developpe-au-sol, fente-basse-rotation, bird-dog, porte-valise, squat-bulgare et pullover sont conformes à exercises.json ou à ACE, et tracés. Seul écart : R9.
- **Photos** : la section « affichable » est présente dans chaque fiche. Les images signalées au premier contrôle (Plank/0, Bodyweight_Squat, Bent-Arm_Dumbbell_Pullover, Farmers_Walk, Incline_Push-Up) sont marquées « non » ; les images non regardées sont « à vérifier ». La règle « la consigne prime » est écrite dans exercise-catalog.md §2.

## Suivi des 57 points du premier contrôle
| n° | État | Constat |
|---|---|---|
| 1 | résolu | R2 NON SOURCÉ |
| 2 | résolu | R3 NON SOURCÉ |
| 3 | résolu | seuil « 2 séances » NON SOURCÉ |
| 4 | résolu | dépistage §2 ajouté (nouveaux écarts R5, R6, R23) |
| 5 | résolu | drapeaux rouges complets, vérifiés sur le PDF HAS |
| 6 | résolu | S3 -> U1 (15 / 112) ; voir R18 |
| 7 | résolu | sans objet |
| 8 | résolu | G1-G8 rédigés ; écarts R2, R7, R8 |
| 9 | **non résolu (en partie)** | vocabulaire posé, mais cases multiples, texte libre, « garder (…) » : R3, R4 |
| 10 | résolu | plus de « seulement si aucune douleur » |
| 11 | résolu (fichier de règles) | fiches non alignées : R13 |
| 12 | résolu | |
| 13 | résolu | nouveau manque : R9 |
| 14 | résolu | tags ajoutés |
| 15 | résolu | renvoi à R8 §7 |
| 16 | résolu | wger NON SOURCÉ dans les fiches citées |
| 17 | résolu | photos « non », recadrage à trancher par l'utilisateur |
| 19 | résolu | |
| 20 | résolu | |
| 21 | résolu | |
| 22 | **non résolu (en partie)** | installation l.17 : R10 |
| 23 | résolu | |
| 24 | résolu | |
| 25 | résolu | |
| 26 | non résolu | remarque reconnue par l'auteur : R15 |
| 27 | résolu | |
| 28 | résolu | remarque R16 |
| 30 | résolu | |
| 31 | résolu | |
| 32 | résolu | |
| 33 | résolu | remarque R12 sur le frontmatter |
| 34 | résolu | |
| 35 | résolu (sans objet) | fiche écartée, vérifié |
| 36 | résolu (sans objet) | fiche écartée, vérifié |
| 37 | résolu | program-logic.md §4 vérifié |
| 38 | résolu (sans objet) | fiche écartée |
| 39 | résolu (sans objet) | fiche écartée |
| 40 | résolu (sans objet) | fiche écartée |
| 41 | résolu (sans objet) | fiche écartée |
| 42 | résolu | |
| 43 | résolu | |
| 44 | résolu | |
| 45 | résolu | ligne Dos dans les 3 fiches |
| 46 | résolu | |
| 47 | résolu | |
| 48 | **non résolu** | tag `box_stable` ajouté, mais « haltères sur box basse » non codable et contradictoire : R1 (bloquant) |
| 49 | résolu | variante retirée |
| 50 | résolu | |
| 51 | résolu | |
| 52 | résolu | |
| 53 | **non résolu (en partie)** | R11 |
| 54 | résolu | |
| 55 | résolu | |
| 56 | résolu | |
| 57 | résolu | |
| 58 | résolu (sans objet) | |
| 59 | non résolu | hors lot, tracé dans « Anomalies du brouillon » (vague 1) |

Bilan : **51 résolus** (dont 8 sans objet : 7, 35, 36, 38 à 41, 58 ; le n° 11 compté résolu, avec la remarque R13 côté fiches), **6 non résolus ou résolus en partie** (9, 22, 26, 48, 53, 59).

## Décompte des écarts de ce recontrôle
- **Bloquant : 1** (R1, montee-sur-marche)
- **À corriger : 10** (R2 à R11)
- **Remarque : 15** (R12 à R26)

## Verdicts
Rappel : un verdict « validé » ne fait passer aucune ligne en OK. Les statuts PROVISOIRE et NON SOURCÉ restent, et CLAUDE.md règle 10 s'applique avant tout codage. « Sous réserve » = les points « à corriger » listés doivent être traités par l'auteur puis recontrôlés ; ils ne bloquent pas.

| Fichier | Verdict | Points |
|---|---|---|
| **regles-securite-communes.md** | validé sous réserve des corrections et remarques | R2, R4, R5, R6, R7, R8 (à corriger) ; R18-R25 |
| squat-poids-du-corps | validé sous réserve | R3, R4 |
| souleve-de-terre-roumain-halteres | validé sous réserve | R10, R4 |
| planche | validé sous réserve des remarques | R15, R4 |
| pompe-inclinee | validé sous réserve | R3, R2 (G4), R16 |
| pullover-haltere-au-sol | validé sous réserve des remarques | R12, R13, R14 |
| **montee-sur-marche** | **bloqué** | R1 |
| developpe-epaules-halteres | validé sous réserve | R9, R4 |
| rowing-unilateral-haltere | validé sous réserve | R11, R4 |
| squat-assis-debout | validé sous réserve | R3, R4 |
| squat-fendu | validé sous réserve des remarques | R4, R17, R26 |
| fente-arriere, fente-basse-rotation, pompe-piquee | validé sous réserve des remarques | R4, R17 |
| pompe-piquee-pieds-sureleves | validé sous réserve des remarques | R4, R16 |
| squat-gobelet, developpe-au-sol-halteres, dead-bug | validé sous réserve des remarques | R4, R13 |
| bird-dog, pompe, pompe-genoux | validé sous réserve des remarques | R4, R25 |
| squat-bulgare, pont-fessier, souleve-de-terre-roumain-unijambiste, planche-laterale, planche-touche-epaule, tirage-w-allonge, rowing-buste-penche-halteres, marche-du-fermier, porte-valise, porte-sac-a-dos-devant | validé sous réserve des remarques | R4 (format des cases) |
| chat-vache, mobilite-cheville-au-mur | validé sous réserve des remarques | R4 (mobilite-cheville : 1 case) |

**Le lot n'est pas validé dans son ensemble tant que R1 (montee-sur-marche) reste ouvert.** Les 3 anciens bloquants (n° 35-37) sont levés.
