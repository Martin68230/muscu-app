# Lot 03 (vague 1) : mobilité, cardio, rotation débutant, tirage vertical, 24 fiches
Rédigé par `coach` le 22/10/2026 (étape 3 puis début de l'étape 4 de CAMPAGNE.md). Statut de toutes les fiches : `brouillon_coach`. La section « Sécurité et contre-indications » est au gabarit « À compléter par `kine` » (avec une ligne de points de vigilance en texte libre, non codée). `npm run check:fiches` ne signale que les 72 manques de catégorie `securite` (3 par fiche : tableau, Grossesse, Version plus douce) ; aucune autre erreur, 0 avertissement.
Format : knowledge/format-fiches.md. Photos : free-exercise-db seulement. Les ids de dossier ont été relevés dans l'index en ligne (dist/exercises.json, 22/10/2026) ; aucune image regardée, donc « affichable : à vérifier » (non affichée) ; « aucune photo » avec raison quand aucun id n'a été trouvé. Les numéros d'image (0 et 1) sont supposés, non vérifiés. Aucun WebP créé. Aucune image maxwu.
Sources : free-exercise-db pour les fiches qui ont une entrée (PROVISOIRE : base d'exercices, descriptions non lues en détail) ; tout le reste (mouvements sans entrée libre, échelons, niveaux, muscles, bénéfices) est NON SOURCÉ, choix de coach. Aucune durée, répétition, série, intensité ni distance n'est donnée. `source_brouillon: []` partout (ajouts hors du brouillon).

## Décompte de couverture avant le lot (fiches existantes, tous statuts : 78 en `controle_relecteur`, aucune `verifie`)
Sortie de `node tools/couverture.mjs` (nombre de mouvements par profil x schéma) :

| Profil | squat | charnière | fente | poussée H | poussée V | tirage H | tirage V | gainage | porté | rot./anti-rot. | saut | mobilité | cardio |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A poids du corps | 5 | 5 | 6 | 6 | 4 | 3 | **1** | 5 | 5 | 8 | 6 | 7 | **0** |
| B + élastiques | 6 | 5 | 6 | 6 | 5 | 6 | 3 | 5 | 5 | 9 | 6 | 8 | **0** |
| C + haltères | 6 | 6 | 6 | 7 | 5 | 6 | **2** | 5 | 6 | 8 | 6 | 7 | **0** |
| D | 7 | 6 | 6 | 7 | 6 | 8 | 4 | 5 | 6 | 9 | 6 | 8 | **0** |
| E | 7 | 6 | 6 | 7 | 6 | 8 | 4 | 5 | 6 | 9 | 6 | 8 | **0** |
| F | 7 | 6 | 6 | 7 | 6 | 8 | 4 | 5 | 6 | 9 | 6 | 8 | **0** |

Cases sous 3 (en comptant les fiches `controle_relecteur` ; la contrainte « `verifie` » vaut 0 partout) : **cardio (0 partout)**, **tirage V en A (1) et en C (2)**. Toutes les autres cases A à C ont déjà 3 fiches ou plus (squat, charnière, fente, poussées, tirage H, gainage, porté, rotation) : aucune fiche de ce lot n'y est nécessaire. Une fiche compte pour un profil si au moins une de ses variantes tient dans le profil (règle de couverture.mjs).

## Liste
| id | nom | schéma | niveau min | échelons | matériel (tags) | statut des sources |
|---|---|---|---|---|---|---|
| extension-thoracique | Extension du haut du dos | mobilité | débutant | 2 | chaise ; tapis, serviette ; tapis, rouleau_massage | NON SOURCÉ |
| rotation-thoracique-assise | Rotation du haut du dos assis | mobilité | débutant | 2 | chaise ; poids_du_corps | NON SOURCÉ |
| etirement-flechisseurs-hanche | Étirement de l'avant de la hanche | mobilité | débutant | 2 | poids_du_corps ; tapis ; tapis, chaise | PROVISOIRE (Kneeling_Hip_Flexor, Standing_Hip_Flexors) |
| grenouille-hanches | Position de la grenouille | mobilité | débutant | 2 | tapis | NON SOURCÉ |
| ouverture-hanche-quatre-pattes | Ouverture de hanche à quatre pattes | mobilité | débutant | 2 | tapis | NON SOURCÉ |
| accroupi-profond-tenu | Position accroupie profonde tenue | mobilité | débutant | 2 | chaise ; poids_du_corps | NON SOURCÉ |
| cercles-de-cheville | Cercles de cheville | mobilité | débutant | 2 | tapis ; chaise ; mur | PROVISOIRE (Ankle_Circles) |
| etirement-mollets-mur | Étirement des mollets contre le mur | mobilité | débutant | 2 | mur ; marche_escalier, mur | PROVISOIRE (deux entrées libres) ; marche NON SOURCÉ |
| passage-de-bras-serviette | Passage de bras avec une serviette | mobilité | débutant | 2 | serviette | NON SOURCÉ |
| cercles-de-bras | Cercles de bras | mobilité | débutant | 2 | poids_du_corps | PROVISOIRE (Shoulder_Circles) |
| etirement-pectoraux-mur | Étirement des pectoraux contre le mur | mobilité | débutant | 2 | mur | PROVISOIRE (Chest_And_Front_Of_Shoulder_Stretch) |
| mobilite-poignets | Mobilité des poignets | mobilité | débutant | 2 | poids_du_corps ; tapis | PROVISOIRE (Wrist_Circles) ; échelon 2 NON SOURCÉ |
| etirement-ischios-serviette | Étirement des ischios avec une serviette | mobilité | débutant | 2 | tapis, serviette ; tapis | PROVISOIRE (deux entrées libres) |
| etirement-fessiers-figure-4 | Étirement des fessiers en « 4 » | mobilité | débutant | 2 | chaise ; tapis | NON SOURCÉ |
| etirement-quadriceps | Étirement de l'avant de la cuisse | mobilité | débutant | 1 | mur ; tapis | PROVISOIRE (Quad_Stretch, On_Your_Side_Quad_Stretch) |
| jumping-jacks | Jumping jacks | cardio | débutant | 2 | poids_du_corps | NON SOURCÉ |
| montees-genoux-sur-place | Montées de genoux sur place | cardio | débutant | 2 | poids_du_corps | NON SOURCÉ |
| mountain-climbers | Grimpeur | cardio | débutant | 3 | chaise ; tapis | PROVISOIRE (Mountain_Climbers) |
| boxe-dans-le-vide | Boxe dans le vide | cardio | débutant | 2 | poids_du_corps | NON SOURCÉ |
| marche-rapide-intervalles | Marche rapide en intervalles | cardio | débutant | 2 | poids_du_corps | NON SOURCÉ |
| pas-chasses-lateraux | Pas chassés latéraux | cardio | débutant | 2 | poids_du_corps | NON SOURCÉ |
| rotation-bucheron | Bûcheron | rotation | débutant | 2 | poids_du_corps ; halteres ; elastique, porte | PROVISOIRE (Standing_Cable_Wood_Chop : poulie) |
| crunch-bicyclette | Crunch bicyclette | rotation | débutant | 2 | tapis | NON SOURCÉ |
| traction-barre | Traction à la barre | tirage V | intermédiaire (kine) | 4 | barre_traction ; barre_traction, elastique | PROVISOIRE (4 entrées libres) |

## Couverture apportée (fiches `brouillon_coach`, non comptées par couverture.mjs ; tout reste « non vérifié »)
- Cardio : 6 fiches, toutes accessibles au profil A (mountain-climbers avec chaise ou tapis, les autres sans matériel) : la case passe de 0 à 6 pour A à F. Le tag `corde_a_sauter` n'est pas utilisé.
- Mobilité : 15 fiches, profil A (mur, chaise, tapis, serviette, marche d'escalier) ; seule une variante utilise `rouleau_massage` (profil E ou F). Thoracique : 2 fiches (+ ouverture du livre du lot-02) ; hanches : 6 ; chevilles : 3 (+ mur du pilote et élastique du lot-02) ; épaules : 3 (+ glissement mural du lot-02) ; poignets : 1.
- Rotation : bûcheron (A sans charge, B avec élastique + porte, C avec haltère) et crunch bicyclette (A) : rotation débutant en A, B, C.
- Tirage V : traction-barre ajoute 1 mouvement en profil D, E, F (barre de traction). **Aucun tirage vertical n'a été ajouté en A, B ou C : le trou subsiste en A (1) et C (2).** Sans barre ni élastique, il n'existe pas de vrai tirage vertical ; substitut déjà au lot-01 (tirage-vertical-elastique-haut, profil B) et achat le plus utile : un élastique (equipment-taxonomy.md §4). Pas de mouvement inventé pour combler artificiellement.

## Points à traiter par `kine` (avant tout autre)
- Épaule : passage de bras serviette, cercles de bras, étirement des pectoraux (position coude/épaule), traction (suspension).
- Hanche/aine/genou : grenouille, ouverture de hanche, accroupi profond tenu, fléchisseurs à genou, quadriceps (genou plié), figure 4.
- Dos : extension thoracique (cambrure), crunch bicyclette (flexion et rotation), rotation assise, bûcheron.
- Cheville : cercles, étirement des mollets (marche, tendon d'Achille), jumping jacks, montées de genoux, pas chassés (impact : prérequis des sauts, lot-02 question 8, même choix prudent : échelon à impact en `intermediaire`).
- Poignet : mobilité des poignets, mountain climbers.
- Grossesse : mountain climbers, crunch bicyclette (sur le dos), jumping jacks, montées de genoux course, pas chassés rapides, traction (effort) : classement à proposer.
- Matériel : rouleau et serviette stables ; élastique ancré à la porte (bûcheron) ; barre de traction (fixation, test avant usage) ; marche d'escalier (rampe, lumière).
- Cardio : signes d'alerte cardiaques (R5), échauffement ; repère « parler sans chanter » à relire dans program-logic.md.

## Points de rédaction à ne pas oublier
- Aucune valeur sourcée de durée, séries, répétitions, intensité ou distance ; les fiches renvoient à program-logic.md et load-calibration.md.
- Niveaux : les échelons à impact (jumping-jacks saut, montées de genoux course, pas chassés rapides), les tractions assistée/supination/pronation et le pédalage du crunch bicyclette sont en `intermediaire` par prudence (NON SOURCÉ, choix de coach).
- Muscles hors liste (péroniers, coiffe) : « mollets » et « trapezes » utilisés par défaut (lot-02, question 4).
- Photos : ids relevés dans l'index en ligne, numéros d'image non vérifiés.

## Questions pour l'utilisateur
1. **Cardio sans matériel** : les 6 fiches cardio sont en profil A. On les garde ainsi, ou on exige un tag « espace dégagé / sol antidérapant » ? (le moteur ne peut pas le vérifier aujourd'hui).
2. **Tirage vertical sans barre ni élastique** : on accepte de laisser ce trou (message « achète un élastique »), ou on crée un substitut au poids du corps (par exemple un tirage isométrique) pour A et C, sachant qu'il serait faible ?
3. **Extension thoracique sur rouleau** : la fiche est `debutant` grâce à la variante chaise (profil A) ; les variantes serviette et rouleau demandent du matériel. On garde cette fiche telle quelle ?
4. **Tractions** : la fiche est `debutant` seulement par l'échelon 1 (tirage d'épaules suspendu). On demande à `kine` un prérequis (par exemple « sans gêne à l'épaule »), ou on passe la fiche entière en `intermediaire` ?
5. **Cardio et durée** : sans valeur sourcée, aucune fiche cardio ne donne de durée ; veux-tu que `coach` cherche la recommandation OMS sur l'endurance pour la citer dans program-logic.md ?

## Notes kine (22/10/2026, section Sécurité des 24 fiches ; statut `complete_kine`, à contrôler par `relecteur`)
Aucune nouvelle source lue : tableaux par zone, versions plus douces et signes d'arrêt sont NON SOURCÉ (extrapolation des règles communes) ; grossesse PROVISOIRE (HAS 2019/2022, Mottola 2019). `npm run check:fiches` : 0 erreur, 0 avertissement.
- **Traction** : `traction-barre` passe entièrement en `intermediaire` (niveau_min et échelon 1 `traction-barre-scapulaire`), faute de champ « prérequis » et parce que la suspension sous le poids du corps n'est pas un point de départ pour un débutant ; le débutant passe par `tirage-vertical-elastique-haut`. Conséquence : la fiche ne compte plus pour un profil débutant (couverture tirage V inchangée : le trou en A et C subsiste). Épaule/coude/poignet : assistée à l'élastique au niveau 1, remplacée par l'élastique au niveau 2 ; grossesse retirée.
- **Étirements et mobilité** : règle commune « tension jamais douleur, pas de rebond, relâcher si douleur ou fourmillements ». Étirements retirés au niveau 2 de la zone gênée (mollets/cheville, pectoraux/épaule, ischios et fessiers/hanche, quadriceps/genou, grenouille) par prudence, NON SOURCÉ.
- **Grossesse** : tout ce qui est couché sur le dos (extension sur serviette/rouleau, ischios allongé, figure 4 allongé, cercles de cheville couché) est remplacé par la variante assise/debout/côté ; mountain climbers et crunch bicyclette retirés ; traction retirée ; quatre pattes gardé avec amplitude modeste. Laxité ligamentaire et fourmillements de grossesse cités comme prudence, NON SOURCÉ.
- **Impact dans le schéma cardio (à traiter par `dev`)** : G7 retire « le schéma saut » en post-partum, mais `jumping-jacks-saut`, `montees-genoux-course`, `pas-chasses-rapides` et `mountain-climbers-rapide` sont à impact dans des fiches cardio. Proposition : un attribut `impact` par variante (ou la règle « variante `intermediaire` de schéma cardio à impact retirée en post-partum »).
- **Prérequis des échelons à impact** : non codés (même question que lot-02, question 8) ; conseil de texte « échelon sans impact sans gêne d'abord ».
- **Élastique et porte** (bûcheron) : contrôle avant usage, ancrage de porte selon la notice (R8, PROVISOIRE).
- Aucune valeur ajoutée aux listes fermées `amplitude` / `appui` ; `retirer: sans-zone` utilisé une fois (cercles de cheville, genou).

### Questions pour l'utilisateur (kine)
1. **Traction en `intermediaire`** : on garde cette décision prudente, ou on la remet en débutant avec un futur champ « prérequis » ?
2. **Étirements retirés dès la gêne nette** (mollets, pectoraux, ischios, fessiers, quadriceps, grenouille) : trop prudent ? Une alternative serait de les garder en amplitude « sans gêne ».
3. **Post-partum et impact en cardio** : on demande à `dev` d'ajouter un attribut `impact` par variante (voir ci-dessus) ?
