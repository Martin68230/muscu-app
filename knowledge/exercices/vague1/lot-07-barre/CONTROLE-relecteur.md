# Contrôle `relecteur` du lot 07 (20 fiches, statut `complete_kine`), le 24/10/2026

Contrôle à neuf, sans le contexte de la rédaction. Rien n'a été corrigé, aucun statut n'a été changé. Lus : CLAUDE.md (règles 10, 11, 12, 22, 23), format-fiches.md, CAMPAGNE.md, regles-securite-communes.md, generateur-v1.md §3.2-3.3, equipment-taxonomy.md, materiel-tags.json, docs/QUESTIONS.md (Q12 à Q18), README du lot, les 20 fiches en entier (hors les lignes répétées à l'identique d'une fiche à l'autre), tools/photos.md, les fiches `ecartees/` (en-tête).
Vérifié en ligne : résumés PubMed / Europe PMC de Hartmann 2013, Aasa 2017, Escamilla 2000, Contreras 2015, Fenwick 2009, Lauver 2016, Maeo 2023, Plotkin 2023, Saeterbakken et Fimland 2013, Saeterbakken 2021, McAllister 2014, Grgic 2022, Bloomquist 2013, Schoenfeld et Grgic 2020, ACSM 2026 (résumé) ; entrées free-exercise-db (`dist/exercises.json`) : les 28 identifiants cités existent, niveaux et matériels cités exacts (Front_Barbell_Squat et Barbell_Squat_To_A_Bench = `expert`, Barbell_Hip_Thrust, Good_Morning = `intermediate`). Images : les 12 SVG de public/illustrations/ rendus en PNG et regardés, les 22 WebP regardés (deux par deux), agrandis aux endroits des flous et des logos.
`npm run check:fiches` : 161 fiches, 0 erreur, 0 avertissement. Tags de matériel : tous présents dans materiel-tags.json (`barre`, `barre_ez`, `disques`, `rack`, `banc`, `banc_inclinable`, `box_ou_step`).

**Bilan : 3 bloquants, 8 à corriger sérieux, 9 à corriger, 16 mineurs. Verdict global : lot NON validé tant que B1, B2, B3 ne sont pas levés. 5 fiches sont proposées `utilisable` telles quelles, 9 après correction (texte ou cases, sans refaire d'image), 6 restent `complete_kine`.**

## Bloquants

| n° | Fiche | Problème | Source vérifiée |
|---|---|---|---|
| B1 | squat-barre-repere-banc | Réglage des barres de sécurité contradictoire, côté utilisateur seul. Quatre endroits les placent **sous le banc** : tableau des variantes (« barres de sécurité sous le banc »), consigne 1 (« place les barres de sécurité juste sous cette hauteur », la hauteur du banc), Points d'attention (« les barres de sécurité sont sous le banc »), illustration (barre jaune sous le plan du banc, environ 190 px, soit 50 à 60 cm, sous la barre au point bas, contre environ 30 px dans l'illustration du squat arrière). Seule la section « Sécurité pour l'utilisateur seul » est juste (« juste sous la barre quand tu touches le banc »). Assis sur le banc, barre sur le dos, des sécurités à hauteur du banc ne rattrapent rien : la barre tombe de 50 cm ou reste sur le dos. L'illustration montre en plus ce mauvais réglage. | fiche (4 endroits contre 1) ; SVG rendu ; fiche squat-arriere-barre (30 px) |
| B2 | hip-thrust-barre | Les 2 photos `Barbell_Hip_Thrust` sont marquées `affichable : oui` alors qu'elles contredisent la consigne (règle 12 : la consigne prime). Sur les deux images, les **mains reposent sur le banc, pas sur la barre**, alors que la fiche exige « tiens-la à deux mains » (consigne 2) et « garde toujours la barre tenue à deux mains » (Sécurité, Points d'attention : la barre qui roule est le risque principal de ce mouvement). Image du haut : talon décollé, pas de coussin ni de serviette sous la barre (la fiche l'exige). Un **logo Nike est lisible** sur le short et les chaussures (le maillot d'un tiers a été flouté, pas ce logo ; voir M9). Précédent : B2 du lot 06. Une fois passées à `non`, la fiche n'a plus d'image : il faut une illustration (erreur de `check:fiches` pour un statut `utilisable`). | photos regardées et agrandies ; tools/photos.md ; format-fiches.md §6 |
| B3 | developpe-couche-barre | Contradiction sur la règle de sécurité centrale de la fiche. La consigne 3 dit « descends-la lentement **jusqu'à la poitrine** », les Points d'attention « la barre descend sur le bas de la poitrine », les Erreurs fréquentes citent le « rebond de la barre sur la poitrine ». La section Sécurité dit l'inverse : barres de sécurité à quelques centimètres au-dessus de la poitrine, « jamais plus bas », « la barre ne touche pas la poitrine ». Le README dit que `kine` a supprimé la consigne de coach « redescends-la sur la poitrine », mais la consigne 3 la garde. Un utilisateur qui suit la consigne règle les sécurités sur la poitrine ou les ignore. À réécrire d'un seul sens (arrêt à la hauteur des sécurités, coudes au sol pour la variante sol). | fiche, 4 endroits ; README du lot |

## À corriger (sérieux : empêchent `utilisable`)

| n° | Fiche | Problème | Source vérifiée |
|---|---|---|---|
| S1 | developpe-couche-barre | (a) Légende de la photo (affichée sous l'image) : « La version sur banc se fait avec barres de sécurité » : elle laisse croire que la version au sol n'en a pas besoin, alors que la fiche les exige aussi au sol. (b) Les photos `Floor_Press/0 et 1` sont `oui` alors que les photos `Barbell_Bench_Press` ont été refusées pour la même raison (« pas de barres de sécurité visibles : la consigne prime ») : la règle est appliquée de façon inégale, et la photo montre une barre sans sécurité visible. Choisir une règle, la même partout. | photos ; fiche |
| S2 | good-morning-barre | Filet de sécurité mal décrit. Points d'attention : « si le dos lâche, la barre doit pouvoir être déposée sur [les barres de sécurité] **en te redressant** » : se redresser éloigne la barre des sécurités. Réglées « sous la hauteur de ta position la plus basse », elles n'attrapent la barre que si la personne descend encore ou fléchit les genoux, et aucune consigne ne le dit. Le risque réel du mouvement (bas du dos, levier long) n'est pas couvert par les sécurités. À faire réécrire par `kine` : sortie de secours décrite pas à pas, ou fiche gardée avec la mention que les sécurités ne protègent pas le dos. | fiche (Points d'attention, Sécurité) ; illustration |
| S3 | souleve-de-terre-roumain-barre, good-morning-barre | Source McAllister 2014 mal citée et mal lue. Référence donnée : « J Strength Cond Res 2014;28(1):105-113 ». Référence réelle : **J Strength Cond Res 2014;28(6):1573-80** (PMID 24149748). « Activité des ischios et des érecteurs mesurée à 85 % du maximum » : les 85 % sont la **charge** (85 % de 1 RM), pas l'activité. L'étude compare leg curl, good morning, glute-ham raise et roumain (12 hommes entraînés, une répétition) ; sa conclusion : activité des ischios maximale au roumain et au glute-ham raise ; rien sur les érecteurs à « 85 % ». Statut PROVISOIRE honnête, mais l'énoncé ne dit pas ce que la source dit. | résumé PubMed 24149748 |
| S4 | fente-barre | (a) Sortie de secours non applicable : « laisse la barre se poser sur les barres de sécurité et dégage-toi **en avançant** » alors que la personne est en fente, un pied devant, un derrière, sous la barre ; aucune manœuvre crédible n'est décrite (la barre est sur les épaules, au plus bas déjà). (b) Consigne 1 : barres « à une hauteur où la barre peut se poser sans te gêner si tu descends à genoux » ; la section Sécurité dit « juste sous la barre au plus bas ». L'illustration met la sécurité à environ 35 cm sous la barre au point bas. (c) Case `Perte d'équilibre répétée` écrite deux fois. Barre chargée sur le dos, une jambe, seul : à faire reprendre par `kine` (sortie de secours réaliste, ou fiche à écarter comme la fente arrière). | fiche ; illustration |
| S5 | extension-triceps-barre-ez-allonge | Sortie de secours : « ramène la barre sur la poitrine en pliant le coude » (Points d'attention) fait passer la barre devant le visage, au moment où la force manque. Pour un exercice sans sécurités, la manœuvre la plus sûre est de laisser la barre aller derrière la tête (sol ou banc). À faire confirmer par `kine`. | fiche |
| S6 | rowing-barre-ez | Illustration fausse (celle que `dev` jugeait approximative) : le pratiquant n'est pas à plat ventre sur un banc incliné ; on lit un buste à environ 55 degrés, les jambes repliées comme à genoux, un banc à peine dessiné (on dirait une chaise), et le disque de la barre posé au milieu du buste dans la seconde pose. Elle ne montre ni la poitrine appuyée ni la position de la consigne. Seule image de la fiche : à refaire avant `utilisable`. | SVG rendu |
| S7 | curl-barre, shrug-barre | Cases `retirer: sans-zone:` au niveau 3 pour genou, hanche, cheville : « jambes en appui, sans effort propre » / « jambes sans effort ». Debout avec une barre dans les mains, la charge passe par les jambes : la variante ne « sollicite pas du tout la zone » (règle R3 et format-fiches.md §4.1). Précédent : les fiches haltères du lot 05 (curl incliné, développé couché) n'ont pas de ligne sans-zone. À remplacer par `retirer`. | regles-securite-communes.md R3 ; format-fiches.md §4.1 ; lot-05 |
| S8 | rowing-barre-ez | Pas de second visuel ; en plus des cases n3 genou, hanche, cheville `sans-zone:rowing-barre-ez-appuye` (voir C4 pour la cohérence de ces cases). Compté ici parce que S6 laisse la fiche sans image fiable. | |

## À corriger

| n° | Fiche | Problème | Source |
|---|---|---|---|
| C1 | souleve-de-terre-roumain-barre | (a) Légende de la photo : « Au rack (échelon 1), la barre part à hauteur du genou » ; la variante dit « à hauteur de cuisses ». (b) Note cuisse-n2 : « descente plus courte (genoux ou au-dessus) » ; la variante rack dit « jusqu'aux genoux ou mi-tibia » (aussi long que la variante sol). (c) Variante `jambes presque tendues` : « Même départ » sans dire lequel (rack ou sol). | fiche |
| C2 | developpe-incline-barre | « Plus la pente est forte, plus l'épaule travaille » et « pente douce environ 30 degrés » : aucune ligne dans Sources. Le seul résumé cité (Lauver 2016 : 14 hommes, 65 % de 1 RM, 0/30/45/-15 degrés) parle du pectoral et ne rapporte pas d'activité du deltoïde antérieur. À passer en NON SOURCÉ ou à retirer. | résumé PubMed 25799093 |
| C3 | curl-barre, rowing-barre-ez, rowing-pendlay-barre | Affirmations sans ligne Sources : « la barre EZ est plus douce pour les poignets » (curl, rowing EZ), « charge plus légère qu'avec une barre droite », « Pendlay : charge plus légère que le rowing libre ». Fenwick 2009 (7 hommes : rowing inversé, buste penché à la barre droite, rowing un bras à la poulie) est appliqué au rowing EZ et au Pendlay sans dire que c'est une extrapolation. | résumé PubMed 19197209 |
| C4 | developpe-couche-prise-serree-barre, developpe-incline-barre, developpe-militaire-barre, rowing-barre-penche, rowing-barre-ez | Cases `sans-zone` n3 incohérentes avec developpe-couche-barre : là, la variante sur banc est **retirée** parce que « les pieds poussent » ; ici le même appui sur banc est gardé (genou, cheville, parfois hanche), et la prise serrée garde la barre EZ mais retire la barre droite « par simplicité » pour une installation identique. Choisir une règle et l'appliquer aux cinq fiches. | fiches |
| C5 | rowing-barre-penche, rowing-barre-ez | Variante appuyée : « banc assez haut pour que la barre ne touche pas le sol en bas du mouvement » et signe d'arrêt « barre qui touche le sol au milieu de la série », mais consigne 1 « barre posée au sol, bras tendus » et consigne 5 « repose la barre au sol ». Préciser : départ au sol, puis la barre reste en l'air pendant la série. | fiches |
| C6 | squat-barre-repere-banc | Variante `box_ou_step` : un step plastique ou creux ne supporte pas une barre chargée que l'on touche des fesses. La fiche dit « stable, large, antidérapante » mais pas « conçue pour porter ton poids plus la barre » ; la hauteur d'un step est souvent trop basse pour une profondeur parallèle. Point d'attention : « Si tu bloques en haut de la descente » (« en bas » ?). Source : `Barbell_Squat_To_A_Bench` est `expert` dans la base, non signalé (seul `Box_Squat` est cité avec son niveau). | fiche ; exercises.json |
| C7 | releve-mollets-debout-barre | (a) Hauteur des barres de sécurité : « une hauteur où la barre peut se poser sans te gêner » (consigne 1 et Sécurité), alors que les autres fiches à barre donnent une règle mesurable ; l'illustration les place à hauteur de hanche (environ 60 cm sous la barre), ce qui suppose de plier les genoux pour déposer la barre : à écrire. (b) « Repères de dosage » : « 2 à 3 séries, 2 à 3 répétitions en réserve, repos 90 s » présentés comme la ligne `cheville_mollet` du générateur ; le générateur (§3.3) donne 2 séries, 12 à 15 répétitions (intermédiaire), repos 60 s, **pas de réserve demandée**. | fiche ; generateur-v1.md §3.3 |
| C8 | developpe-couche-prise-serree-barre | `Poignet n1 : adapter: variante:...-ez` : une personne qui n'a pas `barre_ez` n'a aucune variante adaptée (la case ne dit pas quoi faire dans ce cas). | fiche |
| C9 | squat-barre-repere-banc | « Objets du quotidien » : la dernière ligne (« banc ou box de repère : stable, large, antidérapant, calé ») redit les deux lignes Banc et Box qui la précèdent. À nettoyer en même temps que B1. | fiche |

## Mineurs

| n° | Fiche | Remarque |
|---|---|---|
| M1 | souleve-de-terre-sumo-barre | Source Escamilla 2000 : « 24 hommes » ; le résumé ne dit pas le sexe (12 sumo + 12 conventionnels, championnat national de force athlétique). Les 25 à 40 % portent sur la distance verticale de la barre, le travail mécanique et la dépense d'énergie prédite (plus élevés au conventionnel) : exact. Pieds plus écartés (70 contre 32 cm), pointes plus ouvertes, prise plus étroite, buste plus vertical : exacts. |
| M2 | squat-arriere-barre, squat-avant-barre, squat-barre-repere-banc, fente-barre | Hartmann 2013 : « les forces au genou sont maximales vers 90 degrés » ; le résumé dit les forces et contraintes **rétro-patellaires** (et qu'il n'y a pas d'estimation réaliste au-delà de 50 degrés). Bloomquist 2013, Aasa 2017, Schoenfeld et Grgic 2020, Grgic 2022, ACSM 2026 : fidèles au résumé (17 hommes, 12 semaines, 0-120 contre 0-60 degrés ; 9 études, colonne-épaule-genou ; 6 études dont 4 bas du corps ; 15 études). |
| M3 | souleve-de-terre-barre | « Barre à la bonne hauteur (environ au milieu du mollet) » : avec des disques de 45 cm, la barre est à mi-**tibia**. |
| M4 | souleve-de-terre-barre, -sumo-barre, -roumain-barre | « Deux paumes vers toi » est ambigu (prise en pronation, mais « paumes vers soi » se lit comme un curl). Le curl dit « paumes vers le haut ». Écrire « paumes vers les cuisses ». |
| M5 | souleve-de-terre-barre, -sumo-barre, -roumain-barre | « Un partenaire … ne remplace jamais les barres de sécurité » : sans objet pour un soulevé de terre (pas de barres de sécurité au sol). |
| M6 | squat-arriere-barre | Illustration : le disque, centré à hauteur du cou et recouvrant la tête, se lit comme une barre sur la nuque, pas sur les trapèzes. Sécurité réglée juste sous la barre au point bas : juste. |
| M7 | squat-avant-barre | Illustration : le disque cache le visage, les coudes hauts ne se voient pas (avant-bras court tourné vers le bas). Acceptable, légende « coudes hauts » non illustrée. En cas de lâcher vers l'avant « en reculant d'un pas » : suppose un rack ouvert à l'arrière. |
| M8 | developpe-militaire-barre | Consigne 3 « la tête légèrement en arrière » et cou n1 `garder` alors que la note dit « ne force pas la tête en arrière ». Dos n2 : variante assise gardée (charge sur la colonne, au-dessus de la tête) alors que le squat et le roumain retirent à ce niveau : choix à confirmer par `kine`. Photo debout seule (la variante assise, échelon 1, n'a pas d'image) ; la photo montre le pratiquant hors du rack. |
| M9 | souleve-de-terre-barre, souleve-de-terre-roumain-barre (Romanian et Stiff-Legged), hip-thrust-barre, rowing-barre-penche, shrug-barre, curl-barre, developpe-militaire-barre | **Flous de `dev` : acceptables.** Les rectangles flous sur les montants de rack (soulevé de terre, stiff-legged, rowing, shrug) sont visibles comme de petits bandeaux estompés mais ne gênent pas la lecture du geste, et masquent les logos de fabricant. **Pas traités** : logos de vêtements (poitrine du T-shirt, short, gants) lisibles à l'agrandissement sur presque toutes les photos (petit logo « Bodybuilding.com » sur la poitrine, logo sur les gants du curl EZ et du rowing sur banc, logo sur le short du curl droit et du militaire, Nike sur le short et les chaussures du hip thrust). Même cas que M9 du lot 06 : non bloquant à cette taille, sauf le Nike du hip thrust (B2). À flouter ou à décider (précédent : le maillot d'un tiers a été flouté dans le hip thrust, pas les autres). |
| M10 | souleve-de-terre-barre | Photo 0 (départ du sol) : départ très bas sur les hanches, buste plus redressé que dans la consigne 2 (« dos plat, épaules au-dessus de la barre ») ; tête relevée. Acceptable (les épaules sont à l'aplomb de la barre), signalé. |
| M11 | developpe-couche-barre, developpe-militaire-barre, rowing-barre-penche, rowing-barre-ez, squat-* | Repères de dosage : seul le cas « pilier » du générateur (4-6 répétitions, 3 séries, repos 180 s) est écrit ; le cas « autre exercice » (8-12 répétitions, 2 séries, repos 90 s, force intermédiaire/avancé) n'apparaît que dans la fente. Les autres valeurs recopiées sont exactes (generateur-v1.md §3.2). |
| M12 | souleve-de-terre-sumo-barre | Dos n1 : `adapter: charge:legere` en restant au sol, alors que le conventionnel passe à la variante depuis le rack et que la fiche dit elle-même que le conventionnel au rack est plus simple pour un dos sensible. Cohérence à confirmer. |
| M13 | curl-barre | Grossesse : `adapter: variante:curl-barre-ez` ; la note dit « charge légère » mais la case ne l'impose pas (le plafond G5 s'applique). OK si le générateur applique G5. |
| M14 | rowing-pendlay-barre | Illustration acceptable avec réserve (voir ci-dessous) : le disque masque le torse dans la seconde pose et la barre est au milieu du buste. |
| M15 | README du lot | « Kolber 2010 et 2014 (épaule) » est cité parmi les études lues, mais aucune fiche du lot ne les cite. Statut du lot et « 22 WebP » : exacts ; « 0 sans image » ne tiendra plus après B2. |
| M16 | extension-triceps-barre-ez-allonge | Maeo 2023 (21 adultes, 12 semaines, poulie, bras au-dessus de la tête) : fidèle ; il justifie la variante banc, pas l'extension au sol à bras verticaux : la ligne le dit (« ne porte pas sur cet exercice »). |

## Images : détail

| Fiche | Image | Verdict |
|---|---|---|
| squat-arriere-barre, squat-avant-barre, squat-barre-repere-banc, good-morning-barre, fente-barre, souleve-de-terre-sumo-barre, developpe-couche-prise-serree-barre, developpe-incline-barre, extension-triceps-barre-ez-allonge, releve-mollets-debout-barre | illustrations SVG | Fidèles aux consignes (rack, barres de sécurité jaunes, profondeur, buste, pose de départ et d'arrivée). **Exception B1** (squat-barre-repere-banc : sécurité sous le banc). Écarts mineurs : M6, M7, S4 (sécurité à 35 cm), C7 (sécurité à 60 cm). Légendes lisibles, aucune coupure. |
| rowing-pendlay-barre | illustration | **Acceptable avec réserve.** Buste parallèle, barre au sol puis tirée, jambes peu fléchies : fidèle. Défauts : disque posé sur le torse, barre au milieu du buste plutôt qu'en bas de la poitrine. Pas bloquant. |
| rowing-barre-ez | illustration | **Fausse, à refaire** (S6). |
| souleve-de-terre-barre, souleve-de-terre-roumain-barre (2 entrées), rowing-barre-penche (2 entrées), shrug-barre, curl-barre (2 entrées), developpe-militaire-barre (debout), developpe-couche-barre (Floor_Press) | photos | Correspondent à la consigne et à la variante indiquée dans la légende ; flous acceptables ; logos de vêtements : M9 ; Floor_Press : S1. |
| hip-thrust-barre | photos | **À passer à `non`** (B2). |
| fiches avec photos refusées | | Les refus sont justifiés (barres de sécurité absentes, logo de rack lisible, geste différent). Photo `Box_Squat` : refus fondé (pratiquant assis, relâché). |
| tools/photos.md et crédits | | 11 lignes pour les 22 WebP, licence Unlicense et transformations indiquées ; correct. Les logos de vêtements ne sont pas mentionnés (M9). |

## Statut proposé par fiche

| Fiche | Statut proposé | Motif |
|---|---|---|
| squat-arriere-barre | utilisable | 0 bloquant, 0 à corriger sérieux ; réserves = choix prudents NON SOURCÉ ; M2, M6 |
| squat-avant-barre | utilisable | idem ; M7 |
| squat-barre-repere-banc | complete_kine | B1 (réglage des sécurités, image), C6, C9 |
| souleve-de-terre-barre | utilisable | M3, M4, M5, M10 |
| souleve-de-terre-sumo-barre | utilisable | M1, M4, M5, M12 |
| souleve-de-terre-roumain-barre | utilisable après correction de S3 et C1 (texte seul) | image fiable |
| good-morning-barre | complete_kine | S2 (sécurité), S3 |
| hip-thrust-barre | complete_kine | B2 (photos fausses, plus d'image) |
| fente-barre | complete_kine | S4 (sortie de secours, sécurité) |
| developpe-couche-barre | complete_kine | B3, S1 |
| developpe-couche-prise-serree-barre | utilisable après correction de C4 et C8 (cases et texte) | image fiable |
| developpe-incline-barre | utilisable après correction de C2 et C4 | image fiable |
| developpe-militaire-barre | utilisable | M8 (à confirmer par `kine`), C4 pour la case n3 |
| rowing-barre-penche | utilisable après correction de C4 et C5 | photos fiables |
| rowing-pendlay-barre | utilisable après correction de C3 | illustration acceptable (réserve) |
| rowing-barre-ez | complete_kine | S6 (illustration fausse, seule image), C3, C4, C5 |
| curl-barre | utilisable après correction de S7 (cases n3) et C3 (texte) | photos fiables |
| shrug-barre | utilisable après correction de S7 (cases n3) | photos fiables |
| extension-triceps-barre-ez-allonge | utilisable après correction de S5 (texte, avis de `kine`) | illustration fiable |
| releve-mollets-debout-barre | utilisable après correction de C7 | illustration fiable |

## Ce qui est correct (à ne pas refaire)
- Tableaux zone x niveau : 0 incohérence détectée entre les cases et les consignes sur le dos (soulevés de terre, roumain, good morning, squats), l'épaule (développés couché, incliné, militaire), le cou (barre sur le dos, shrug) et la grossesse ; lignes cuisse et aine présentes là où l'exige regles-securite-communes.md §0 (D11).
- Niveaux minimum cohérents avec Q14 et Q18 : aucune variante débutant avec barre chargée sur le dos, au-dessus de la poitrine ou depuis le sol ; hip thrust, rowing appuyé, curl, shrug au rack restent débutants (choix de coach, NON SOURCÉ, relevé honnêtement).
- Règle 23 : aucune technique (arraché, épaulé, push press) ; good morning et Pendlay réservés à l'avancé, réserves écrites.
- Grossesse : toutes les barres chargées retirées, curl à la barre EZ seul gardé ; statut NON SOURCÉ honnête (la HAS ne parle pas de la barre).
- Tags et variantes : rack = avec barres de sécurité (materiel-tags.json), chaque fiche le rappelle ; échelons sans trou, niveaux qui ne baissent pas, ids existants (0 erreur du script).
- Fiches écartées (`ecartees/tirage-menton-barre`, `fentes-marchees-barre`) : en-tête `ecartee: 2026-10-24`, motif écrit ; non comptées dans les 20.

Les écarts sont à corriger par l'auteur (`coach`/`kine`/`dev`) puis recontrôlés : B1, B2, B3, S1 à S8 et l'image de rowing-barre-ez demandent un nouveau contrôle ; les corrections de texte seul (C1 à C9, M) peuvent être reprises par `relecteur` sur les seuls points corrigés.

# Recontrôle `relecteur` du 24/10/2026 (points corrigés seulement, lancé à neuf)

Rien n'a été corrigé, aucun statut n'a été changé. Lu : ce rapport, README du lot (Corrections kine 2, Corrections coach 2, Images refaites), `git log` et `git diff` du dossier depuis le contrôle, les fiches modifiées (zones corrigées en entier), tools/photos.md, les 8 SVG nouveaux ou refaits (rendus en PNG, agrandis pour le hip thrust et le rowing EZ), les 6 jeux de photos conservées, les 3 fiches écartées.
Vérifié en ligne : McAllister 2014 (résumé Europe PMC, PMID 24149748) ; oEmbed YouTube des 7 vidéos.
`npm run check:fiches` : 160 fiches, 0 erreur, 0 avertissement (161 moins `fente-barre`). Le dossier compte 19 fiches (21 .md moins CONTROLE et README) : compte cohérent. Aucune valeur NON SOURCÉ ou PROVISOIRE n'est présentée OK : les seules lignes « OK » sont la phrase ACSM « l'échec n'est pas nécessaire », avec les deux autres parties de la ligne marquées PROVISOIRE et NON SOURCÉ.

**Bilan : B1, B2, B3 levés (0 bloquant). 16 fiches proposées `utilisable`, 3 restent `complete_kine` (squat-barre-repere-banc, rowing-pendlay-barre, rowing-barre-ez). 3 nouveaux écarts à corriger (N1 à N3), 5 remarques (N4 à N8).**

## Point par point

| n° | Verdict | Constat |
|---|---|---|
| B1 | **corrigé** (+ nouvel écart N1) | Barres de sécurité « juste sous la barre quand tu touches le banc » dans le tableau des variantes, consigne 1, points d'attention, sécurité, objets du quotidien ; plus aucun « sous le banc » (recherche dans knowledge/, docs/, tools/). Illustration refaite regardée : banc visible, barre jaune environ 5 cm sous la barre au contact du banc (au lieu de 50 cm), pose cohérente avec la fiche. Sortie de secours du bas (buste vers l'avant, barre sur les barres, essai à vide) cohérente. |
| B2 | **corrigé** | Les 2 photos `Barbell_Hip_Thrust` sont `non`, les WebP supprimés (plus de maillot flouté, plus de Nike). Illustration regardée : haut du dos sur un banc calé contre le rack, serviette, bas puis haut, bassin et cuisses alignés en haut : conforme. Réserves mineures N6. |
| B3 | **corrigé** | Règle unique partout (variantes, consigne 3, points d'attention, erreurs fréquentes, sécurité, signes d'arrêt, R9) : la barre s'arrête à quelques centimètres au-dessus de la poitrine, à la hauteur des barres de sécurité, sans la toucher ; au sol, arrêt aux coudes, barres obligatoires aussi. Plus de « descends jusqu'à la poitrine ». Illustration à 3 images regardée (banc bras tendus, banc arrêt sans toucher, sol arrêt aux coudes) : barre jaune juste sous la barre, conforme. |
| S1 | **corrigé** | Légende supprimée ; Floor_Press et Barbell_Bench_Press tous deux `non`, même règle. |
| S2 | **corrigé** | « En te redressant » supprimé (aucune occurrence). Les barres « ne protègent pas le dos » ; sortie pas à pas (genoux fléchis, hanches basses, barre sur les barres, essai à vide) ; réglage « hauteur de la barre buste presque parallèle moins quelques centimètres » : la manœuvre est mécaniquement réalisable. |
| S3 | **corrigé** | Référence exacte (28(6):1573-1580, PMID 24149748, titre exact) ; 85 % = charge ; conclusion ischios max au roumain et au glute-ham raise, semi-tendineux plus actif que biceps fémoral ; érecteurs « non classables ». Fidèle au résumé Europe PMC lu. Même ligne dans le roumain et le good morning. |
| S4 | **corrigé (fiche écartée)** | `ecartees/fente-barre.md` : `ecartee: 2026-10-24`, motif écrit, illustration supprimée, plus de référence active ailleurs (voir remarque N8). |
| S5 | **corrigé** | Sortie = laisser la barre derrière la tête (sol ou banc), 1 m libre, essai à vide, plus de « sur la poitrine » ; points d'attention et signes d'arrêt alignés. Choix de `kine` NON SOURCÉ, écrit comme tel ; manœuvre plausible, non testable par le relecteur. |
| S6 | **partiellement corrigé** | L'illustration est refaite et ne montre plus le faux appui sur banc : buste penché debout, barre au sol puis tirée. Mais la pose ne suit pas la consigne de la variante libre : cuisses horizontales (hanches à environ 50 cm du sol, genoux à 90 degrés, position de squat bas) et buste à environ 25 degrés de l'horizontale (consigne : genoux fléchis, buste environ 45 degrés). Comparer à `rowing-barre-penche.svg` (hanches hautes, bon). À refaire (N3). |
| S7 | **corrigé** | curl-barre et shrug-barre : genou, hanche, cheville n3 = `retirer`, notes réécrites. Voir N2 pour une fiche oubliée. |
| S8 | **non corrigé** | rowing-barre-ez : cases n3 corrigées, mais toujours une seule image, inexacte sur la pose (S6). Couvert par N3. |
| C1 | **corrigé** | Légende « hauteur des cuisses » = variante ; cuisse-n2 « limitée à la hauteur des genoux » ; « même départ que la reprise du sol (échelon 2) ». |
| C2 | **corrigé** | « Plus la pente est forte… » passé en NON SOURCÉ, nouvelle ligne Sources (pente de 30 degrés, choix de coach NON SOURCÉ). |
| C3 | **corrigé** | Curl, rowing EZ, Pendlay : « plus doux pour les poignets » et « charge plus légère » marqués observation de pratique NON SOURCÉ avec ligne Sources ; Fenwick 2009 signalé extrapolation (barre droite testée). |
| C4 | **corrigé pour les 5 fiches** (reste N2) | Prise serrée, incliné, militaire, rowing penché, rowing EZ : genou, hanche, cheville n3 = `retirer`, même note partout. |
| C5 | **corrigé** | Rowing penché et EZ : « départ au sol, puis la barre reste en l'air pendant toute la série (à quelques centimètres du sol) ». |
| C6 | **corrigé** | Box « conçue pour porter ton poids plus celui de la barre », step plastique ou creux exclu, hauteur de step signalée ; « en bas » corrigé. Le niveau `expert` de `Barbell_Squat_To_A_Bench` n'est pas signalé (seul Box_Squat l'est) : sans conséquence. |
| C7 | **corrigé** | (a) Barres « juste sous la barre en quart de squat », sortie de secours écrite, illustration réalignée (environ 30 cm sous la barre debout, cohérent avec un quart de squat ; réserve mineure). (b) Dosage : 12 à 15 répétitions, 2 séries, 60 s, pas de réserve cible : conforme à generateur-v1.md §3.3 (ligne cheville_mollet, 12-15 intermédiaire) ; règle de 2 répétitions en réserve gardée en sécurité. |
| C8 | **corrigé** | Poignet n1 = `charge:legere`, indépendant de la barre EZ. |
| C9 | **corrigé** | Doublon banc/box supprimé. |
| M1 | corrigé | « 24 pratiquants », grandeurs mesurées précisées. |
| M2 | corrigé | Hartmann : forces et contraintes rétro-patellaires, sans « maximales vers 90 degrés » (3 fiches). |
| M3 | corrigé | « mi-tibia avec des disques de 45 cm ». |
| M4, M5 | corrigés | « paumes vers les cuisses » ; phrase du partenaire et des barres de sécurité remplacée dans les 3 soulevés de terre. |
| M6, M7, M14 | non traités | Illustrations squat arrière, squat avant (« en reculant d'un pas » inclus), Pendlay : inchangées, acceptables avec réserve, non bloquant. |
| M8 | corrigé | Menton reculé sans cambrer la nuque ; dos n2 = `retirer` (remplaçant développé épaules aux haltères, fiche pilote existante). |
| M9 | **partiellement** | Plus aucune photo floutée n'est publiée (5 jeux retirés ; les 6 jeux conservés n'ont aucun flou, vérifiés à l'image ; crédits régénérés). Restent visibles de petits logos de vêtements ou de gants (EZ-Bar_Curl, Barbell_Curl, Incline_Bench_Pull, Standing_Military_Press, Romanian_Deadlift) : non recadrables, connus du README, non bloquant (même décision que le lot 06). Aucune marque d'une autre app. |
| M10, M11, M12, M13, M15 | corrigés | Légende « suis la consigne pour le dos » ; cas « autre exercice » écrit dans les dosages ; sumo dos n1 = variante conventionnel au rack ; curl grossesse (la note renvoie à G5) ; Kolber retiré des sources. |
| M16 | sans écart | Inchangé. |

## Fiches écartées
`tirage-menton-barre`, `fentes-marchees-barre`, `fente-barre` : en-tête `ecartee: 2026-10-24`, motif écrit, aucune utilisation par le générateur ni la bibliothèque, non comptées dans les 19.

## Vidéos (7)
Ids de 11 caractères, tous valides ; oEmbed répond pour les 7 ; chaîne conforme à la fiche : Nuffield Health (hip thrust, soulevé de terre, roumain, rowing penché, curl), The Physio Fix (Pendlay), Renaissance Periodization (shrug). Limites déjà écrites par `coach` : images des vidéos non regardées (la vidéo du curl est un « Barbell Curl » général, celle du hip thrust ne précise pas la barre) ; la date de publication n'est pas dans les fiches (seule « vérifiée le 2026-10-24 »). À confirmer par l'utilisateur à la première lecture (mains sur la barre et serviette pour le hip thrust). Les 5 fiches sans vidéo ont leur dossier `images-a-trouver/` (A-LIRE.txt présent).

## Nouveaux écarts
| n° | Fiche | Gravité | Problème |
|---|---|---|---|
| N1 | squat-barre-repere-banc | à corriger (empêche `utilisable`) | Point d'attention « Si tu bloques en haut de la montée … même manœuvre, penche le buste en avant jusqu'aux barres » : les barres sont à quelques centimètres sous la barre au contact du banc ; à mi-montée la barre est bien plus haut et la manœuvre décrite ne l'atteint pas. Écrire la bonne conduite (redescendre en contrôle jusqu'au banc, puis la sortie du bas), à faire par `kine`. |
| N2 | rowing-pendlay-barre | à corriger (texte seul, empêche `utilisable`) | Cases genou n3 et cheville n3 encore `retirer: sans-zone:rowing-pendlay-barre-sol` (note « jambes en appui sans effort propre »), alors que la règle C4/S7 appliquée aux autres fiches est : barre chargée debout, appui des jambes = zone sollicitée = `retirer` ; la hanche est déjà retirée. À aligner. |
| N3 | rowing-barre-ez | à corriger (empêche `utilisable`) | Illustration à refaire (voir S6) : hanches hautes, buste environ 45 degrés ; la version appuyée n'est pas montrée (la légende le dit honnêtement). |
| N4 | README du lot | remarque | Table : la ligne `fente-barre` barrée a une cellule en trop ; « Couverture visée : Fente 1, total 20 fiches » et la section « Images » (« 8 fiches avec photos, 12 illustrations, 0 sans image ») sont périmées. |
| N5 | tools/photos.md, public/photos | remarque | Les WebP `Floor_Press-0/1` et leurs lignes de crédit sont toujours là alors que les photos sont `non` : à retirer ou à garder volontairement. |
| N6 | hip-thrust-barre (illustration) | remarque | La tête repose sur le banc (consigne : haut du dos au bord du banc) ; les mains sur la barre ne se lisent qu'en pose haute. Lisible, non bloquant. |
| N7 | souleve-de-terre-barre (illustration) | remarque | Départ du sol avec hanches au niveau des genoux (très bas), épaules à l'aplomb de la barre : acceptable (même remarque que M10). |
| N8 | motif de fentes-marchees-barre, docs/QUESTIONS.md Q16 | remarque | Ils disent encore que `fente-barre` (squat fendu à la barre) couvre le schéma ; cette fiche est écartée à son tour (couverture : `fente-arriere` et `squat-fendu`). Aucune décision « fente-barre écartée » n'est inscrite dans QUESTIONS.md. |

## Statut proposé par fiche (après recontrôle)
| Fiche | Statut proposé | Motif |
|---|---|---|
| squat-arriere-barre | utilisable | M2 corrigé ; M6 réserve |
| squat-avant-barre | utilisable | M2 corrigé ; M7 réserve |
| squat-barre-repere-banc | **reste complete_kine** | B1 levé ; N1 à corriger |
| souleve-de-terre-barre | utilisable | M3, M4, M5, M10 ; illustration nouvelle, vidéo ; N7 |
| souleve-de-terre-sumo-barre | utilisable | M1, M4, M5, M12 |
| souleve-de-terre-roumain-barre | utilisable | S3, C1 corrigés ; photos Romanian conservées |
| good-morning-barre | utilisable | S2, S3 corrigés |
| hip-thrust-barre | utilisable | B2 levé ; N6 |
| developpe-couche-barre | utilisable | B3, S1 levés, 3 illustrations conformes |
| developpe-couche-prise-serree-barre | utilisable | C4, C8 corrigés |
| developpe-incline-barre | utilisable | C2, C4 corrigés |
| developpe-militaire-barre | utilisable | M8, C4 corrigés ; photo debout seule |
| rowing-barre-penche | utilisable | C4, C5 corrigés ; photo Incline_Bench_Pull + illustration |
| rowing-pendlay-barre | **reste complete_kine** | C3 corrigé ; N2 à corriger (2 cases) |
| rowing-barre-ez | **reste complete_kine** | N3 (illustration, S6) |
| curl-barre | utilisable | S7, C3, M13 corrigés |
| shrug-barre | utilisable | S7 corrigé |
| extension-triceps-barre-ez-allonge | utilisable | S5 corrigé |
| releve-mollets-debout-barre | utilisable | C7 corrigé ; illustration, réserve |

**Verdict global : plus aucun point bloquant. 16 fiches proposées `utilisable` (le changement de statut revient à l'auteur) ; 3 fiches restent `complete_kine` jusqu'à N1 (`kine`, texte), N2 (`kine`, 2 cases), N3 (`dev`, illustration), puis recontrôle de ces seuls points.**
