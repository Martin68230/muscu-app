# Lot 07 (vague 1) : barre droite, disques, rack, barre EZ, 22 fiches (lot D, force et prise de masse)
Rédigé par `coach` le 24/10/2026. Statut des fiches : `brouillon_coach`. Étapes suivantes : `kine` (sécurité, voir « À regarder en priorité »), `dev` (photos et WebP), `npm run check:fiches`, `relecteur` lancé à neuf, corrections, statuts. `npm run check:fiches` après rédaction : 0 erreur, 0 avertissement (les fiches ne sont pas encore `utilisable` : l'erreur « sans image » ne s'applique pas ; les lignes Photo sont toutes « à vérifier » ; la liaison photo-variante n'est pas codée).

## Fiches
| id | schéma | niveau_min | variantes (échelon) | matériel | image |
|---|---|---|---|---|---|
| squat-arriere-barre | squat | intermédiaire | parallèle (1), profond (2), arrêt en bas (3, avancé) | barre, disques, rack | Barbell_Squat |
| squat-avant-barre | squat | intermédiaire | bras croisés (1), prise doigts (2) | barre, disques, rack | Front_Barbell_Squat |
| squat-barre-repere-banc | squat | **débutant (guidé)** | barre seule sur banc ou box (1), avec disques (2) | barre, disques, rack, banc ou box_ou_step | Box_Squat |
| souleve-de-terre-barre | charnière | **débutant (depuis le rack)** | rack genou (1), sol (2) | barre, disques ; rack | Barbell_Deadlift, Rack_Pulls |
| souleve-de-terre-sumo-barre | charnière | intermédiaire | sol (1) | barre, disques | Sumo_Deadlift |
| souleve-de-terre-roumain-barre | charnière | débutant (depuis le rack) | rack (1), sol (2), jambes presque tendues (2) | barre, disques ; rack | Romanian_Deadlift, Stiff-Legged_Barbell_Deadlift |
| good-morning-barre | charnière | **avancé** | debout (1) | barre, disques, rack | Good_Morning |
| hip-thrust-barre | charnière | débutant | banc (1) | banc, barre, disques | Barbell_Hip_Thrust |
| fente-barre | fente | intermédiaire | statique (1), arrière (2) | barre, disques, rack | Barbell_Lunge |
| fentes-marchees-barre | fente | intermédiaire | barre légère (1) | barre, disques, rack | Barbell_Walking_Lunge |
| developpe-couche-barre | poussée H | **débutant (au sol, sécurités)** | sol dans le rack (1), banc dans le rack (2) | barre, disques, rack ; banc | Barbell_Bench_Press_-_Medium_Grip, Floor_Press |
| developpe-couche-prise-serree-barre | poussée H (substitut) | intermédiaire | EZ (1), droite (1) | barre_ez ou barre, disques, rack, banc | Close-Grip_EZ-Bar_Press, Close-Grip_Barbell_Bench_Press |
| developpe-incline-barre | poussée H | intermédiaire | pente douce (1) | barre, disques, rack, banc_inclinable | Barbell_Incline_Bench_Press_-_Medium_Grip |
| developpe-militaire-barre | poussée V | intermédiaire | assis dossier droit (1), debout (2) | barre, disques, rack ; banc_inclinable | Seated_Barbell_Military_Press, Standing_Military_Press |
| rowing-barre-penche | tirage H | débutant (appuyé) | appuyé banc incliné (1), buste penché (2) | barre, disques ; banc_inclinable | Bent_Over_Barbell_Row, Incline_Bench_Pull |
| rowing-pendlay-barre | tirage H | **avancé** | barre au sol (1) | barre, disques | aucune (illustration à demander) |
| rowing-barre-ez | tirage H | débutant (appuyé) | appuyé (1), penché (2) | barre_ez, disques ; banc_inclinable | aucune (illustration à demander) |
| curl-barre | tirage H (substitut) | débutant | EZ (1), droite (1) | barre_ez ou barre, disques | EZ-Bar_Curl, Barbell_Curl |
| extension-triceps-barre-ez-allonge | poussée H (substitut) | intermédiaire | au sol (1), sur banc (2) | barre_ez, disques ; banc | EZ-Bar_Skullcrusher |
| shrug-barre | tirage H (substitut) | débutant | au rack (1), du sol (1) | barre, disques ; rack | Barbell_Shrug |
| tirage-menton-barre | poussée V (substitut) | intermédiaire | EZ (1), droite (1), montée limitée au milieu de la poitrine | barre_ez ou barre, disques | Upright_Barbell_Row |
| releve-mollets-debout-barre | cheville/mollet | débutant | pieds à plat (1), plateforme basse (2) | barre, disques, rack ; box_ou_step | Standing_Barbell_Calf_Raise |

Tous les identifiants de photos ci-dessus existent dans `dist/exercises.json` de free-exercise-db (vérifié le 24/10/2026) ; **aucune image n'a été vue** : tout est « à vérifier » (raison inscrite dans chaque fiche). Les logos d'arrière-plan sont à recadrer comme dans les lots précédents (tools/photos.md). Pas de photo adaptée : Pendlay et rowing barre EZ (entrées absentes de la base) : illustration SVG à demander à `dev`.

## Couverture visée
- Squat : 3 fiches. Charnière : 5 (soulevé de terre conventionnel, sumo, roumain/jambes tendues, good morning, hip thrust). Fente : 2. Poussée H : 4 (dont 1 prise serrée en substitut). Poussée V : 2 (militaire ; tirage menton en substitut). Tirage H : 3 rowings (+ curl et shrug en substitut). Mollets : 1.
- Profils concernés : tous ceux qui ont `barre` + `disques`, `rack` (la plupart des variantes) et `barre_ez`.
- Règle 22/23 : aucune fiche technique (arraché, épaulé, clean, snatch, push press) ; niveaux avancés réservés au good morning et au Pendlay ; aucun saut.
- **Squat, soulevé de terre, développé couché** : jamais de variante débutant sans guidage. Squat : le débutant passe par `squat-barre-repere-banc` (barre seule, banc comme repère, barres de sécurité) ; `squat-arriere-barre` est intermédiaire. Soulevé de terre et roumain : départ depuis le rack (course courte). Développé couché : débutant seulement **au sol, dans le rack, barres de sécurité** ; le banc exige aussi les barres de sécurité (tag `rack` dans toutes les variantes).
- « Squat avec barre sur le haut du dos à la salle avec barres de sécurité » : c'est le squat arrière (`squat-arriere-barre`), qui n'existe que dans un rack à barres de sécurité (tag `rack`). Pas de fiche séparée, pour éviter un doublon exact.

## Écartés (justification)
- **Zercher squat** : niveau « expert » dans la base ; barre dans le pli des coudes (compression du biceps et du coude), aucune source, peu d'intérêt par rapport au squat avant. Non fait.
- **Hack squat à la barre** (barre derrière les jambes) : technique spécifique, charge lourde derrière les mollets, risque dos et genou, aucune sécurité possible seul ; le schéma est couvert par la presse et le hack à la machine (salle). Non fait.
- Arraché, épaulé, push press, jerk : règle 23.
- Landmine : pas de tag de matériel (support de landmine ou coin de mur improvisé non sûr) : à rediscuter.
- Rack pull comme fiche séparée : couvert par l'échelon 1 du soulevé de terre.

## Doublons évités (fiches existantes, non recréées)
Version haltères : `souleve-de-terre-roumain-halteres`, `rowing-buste-penche-halteres`, `developpe-epaules-halteres`, `fente-arriere`, `squat-fendu`, `squat-gobelet`, `hip-thrust-banc`, `releve-mollets*`, `curl-incline-halteres`, `extension-triceps-*-halteres`. Mes fiches sont les versions à la barre (autres tags) ; elles s'y réfèrent comme régressions et remplaçants.

## À regarder en priorité par `kine`
1. **Sécurité de l'utilisateur seul avec la barre** : hauteur des barres de sécurité par exercice (squat, développé couché, militaire, fentes), repli en cas d'échec (squat, développé couché, fente marchée : lâcher vers l'arrière), colliers de serrage, « pas d'échec ». La rubrique « Sécurité pour l'utilisateur seul » est une proposition de `coach` à corriger. Les paragraphes « Points d'attention (kine) » sont à rédiger.
2. **Dos** : soulevé de terre (conventionnel, sumo, roumain), good morning (niveau 1 déjà retiré), rowing libre et Pendlay (Fenwick 2009 : charge lombaire la plus élevée) ; cases dos n1/n2 et remplaçants.
3. **Épaule** : développé couché (retrait sans remplaçant), militaire, **tirage menton** (conserver ou retirer ?), squat (position des bras derrière la barre).
4. **Cou** (barre sur les trapèzes, squat avant près de la gorge), **poignet** (prises, barre EZ), **coude** (extension triceps allongé, prise serrée).
5. **Fentes marchées et plateforme pour les mollets avec une barre sur le dos** : risque de chute ; garder ou retirer ?
6. Grossesse : toutes les barres lourdes sont **retirées** par prudence (choix NON SOURCÉ de `coach` : la HAS ne parle pas de la barre) ; curl, shrug et tirage menton : adapter. À valider.
7. Lignes cuisse (ischios) et aine (adducteurs) ajoutées sur squats, fentes, soulevés de terre (D11).
8. Zones non chargées (genou, hanche, cheville sur le développé couché, etc.) : `garder, garder, retirer: sans-zone:<variante>` ; à confirmer.

## Questions pour l'utilisateur
1. **Barre légère** : une barre olympique pèse 20 kg, c'est déjà une charge pour un débutant. Faut-il prévoir dans le profil le poids de la barre (ou une barre de 10 à 15 kg) ? Le générateur parle de « barre seule » sans connaître son poids.
2. **Tag `rack`** : presque toutes les variantes l'exigent. Quelqu'un qui a banc + barre sans rack n'aura pas de développé couché à la barre (le développé aux haltères le remplace). OK ? Faut-il un tag séparé « barres de sécurité » ?
3. **Soulevé de terre et roumain pour débutant** : acceptés depuis le rack avec barre légère (course courte), ou à réserver au niveau intermédiaire ?
4. **Tirage menton** : le garder (montée limitée au milieu de la poitrine) ou le supprimer ?
5. **Fentes marchées et mollets sur plateforme avec une barre** : acceptables à la salle, ou à écarter (risque de chute) ?
6. **Grossesse** : tout retirer pour les barres lourdes, comme proposé ?

## Sources
Photos et gestes : free-exercise-db (PROVISOIRE, Unlicense). Études lues par résumé seulement (moteur de recherche, texte complet non lu) : Escamilla 2000 (sumo), Bloomquist 2013 (profondeur du squat), Hartmann 2013 (genou et profondeur), McAllister 2014 (ischios), Contreras 2015 et Plotkin 2023 (poussée de hanches), Fenwick 2009 (rowing), Saeterbakken 2021 (largeur de prise), Saeterbakken et Fimland 2013 (militaire), Lauver 2016 (banc incliné), Schoenfeld et Grgic 2020 (amplitude), Aasa 2017 (blessures), Grgic 2022 (échec), Kolber 2010 et 2014 (épaule), Maeo 2023 (triceps) : toutes PROVISOIRE. ACSM 2026 (Currier et coll.) et HAS 2019/2022 : références du dépôt. Échelons, niveaux, plafonds de prudence pour l'utilisateur seul, barres de sécurité, grossesse : NON SOURCÉ. Aucune série ni charge chiffrée propre à un mouvement : seules les valeurs du tableau V-DOSE (generateur-v1.md §3.2) sont citées.
