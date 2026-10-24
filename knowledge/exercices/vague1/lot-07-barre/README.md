# Lot 07 (vague 1) : barre droite, disques, rack, barre EZ, 20 fiches utiles + 2 écartées (lot D, force et prise de masse)
Rédigé par `coach` le 24/10/2026, sécurité reprise par `kine` le 24/10/2026 (voir « Passage de kine » plus bas). Statut des 20 fiches : `complete_kine` ; 2 fiches écartées dans `ecartees/`. Étapes suivantes : `dev` (photos et WebP), `relecteur` lancé à neuf, corrections, statuts. `npm run check:fiches` après rédaction : 0 erreur, 0 avertissement (les fiches ne sont pas encore `utilisable` : l'erreur « sans image » ne s'applique pas ; les lignes Photo sont toutes « à vérifier » ; la liaison photo-variante n'est pas codée).

## Fiches
| id | schéma | niveau_min | variantes (échelon) | matériel | image |
|---|---|---|---|---|---|
| squat-arriere-barre | squat | intermédiaire | parallèle (1), profond (2), arrêt en bas (3, avancé) | barre, disques, rack | Barbell_Squat |
| squat-avant-barre | squat | intermédiaire | bras croisés (1), prise doigts (2) | barre, disques, rack | Front_Barbell_Squat |
| squat-barre-repere-banc | squat | **intermédiaire** (relevé par kine) | barre seule sur banc ou box (1), avec disques (2) | barre, disques, rack, banc ou box_ou_step | Box_Squat |
| souleve-de-terre-barre | charnière | **intermédiaire** (relevé par kine) | rack genou (1), sol (2) | barre, disques ; rack | Barbell_Deadlift, Rack_Pulls |
| souleve-de-terre-sumo-barre | charnière | intermédiaire | sol (1) | barre, disques | Sumo_Deadlift |
| souleve-de-terre-roumain-barre | charnière | **intermédiaire** (relevé par kine) | rack (1), sol (2), jambes presque tendues (2) | barre, disques ; rack | Romanian_Deadlift, Stiff-Legged_Barbell_Deadlift |
| good-morning-barre | charnière | **avancé** | debout (1) | barre, disques, rack | Good_Morning |
| hip-thrust-barre | charnière | débutant | banc (1) | banc, barre, disques | Barbell_Hip_Thrust |
| fente-barre | fente | intermédiaire | squat fendu statique (1) seul (la fente arrière est supprimée) | barre, disques, rack | Barbell_Lunge |
| developpe-couche-barre | poussée H | **intermédiaire** (relevé par kine) | sol dans le rack (1), banc dans le rack (2) | barre, disques, rack ; banc | Barbell_Bench_Press_-_Medium_Grip, Floor_Press |
| developpe-couche-prise-serree-barre | poussée H (substitut) | intermédiaire | EZ (1), droite (1) | barre_ez ou barre, disques, rack, banc | Close-Grip_EZ-Bar_Press, Close-Grip_Barbell_Bench_Press |
| developpe-incline-barre | poussée H | intermédiaire | pente douce (1) | barre, disques, rack, banc_inclinable | Barbell_Incline_Bench_Press_-_Medium_Grip |
| developpe-militaire-barre | poussée V | intermédiaire | assis dossier droit (1), debout (2) | barre, disques, rack ; banc_inclinable | Seated_Barbell_Military_Press, Standing_Military_Press |
| rowing-barre-penche | tirage H | débutant (appuyé) | appuyé banc incliné (1), buste penché (2) | barre, disques ; banc_inclinable | Bent_Over_Barbell_Row, Incline_Bench_Pull |
| rowing-pendlay-barre | tirage H | **avancé** | barre au sol (1) | barre, disques | aucune (illustration à demander) |
| rowing-barre-ez | tirage H | débutant (appuyé) | appuyé (1), penché (2) | barre_ez, disques ; banc_inclinable | aucune (illustration à demander) |
| curl-barre | tirage H (substitut) | débutant | EZ (1), droite (1) | barre_ez ou barre, disques | EZ-Bar_Curl, Barbell_Curl |
| extension-triceps-barre-ez-allonge | poussée H (substitut) | intermédiaire | au sol (1), sur banc (2) | barre_ez, disques ; banc | EZ-Bar_Skullcrusher |
| shrug-barre | tirage H (substitut) | débutant | au rack (1), du sol (2, intermédiaire) | barre, disques ; rack | Barbell_Shrug |
| releve-mollets-debout-barre | cheville/mollet | **intermédiaire** (relevé par kine) | pieds à plat (1) seul (la plateforme est supprimée) | barre, disques, rack | Standing_Barbell_Calf_Raise |

Tous les identifiants de photos ci-dessus existent dans `dist/exercises.json` de free-exercise-db (vérifié le 24/10/2026) ; **aucune image n'a été vue** : tout est « à vérifier » (raison inscrite dans chaque fiche). Les logos d'arrière-plan sont à recadrer comme dans les lots précédents (tools/photos.md). Pas de photo adaptée : Pendlay et rowing barre EZ (entrées absentes de la base) : illustration SVG à demander à `dev`.

## Couverture visée
- Squat : 3 fiches. Charnière : 5 (soulevé de terre conventionnel, sumo, roumain/jambes tendues, good morning, hip thrust). Fente : 1 (squat fendu). Poussée H : 4 (dont 1 prise serrée en substitut). Poussée V : 1 (militaire). Tirage H : 3 rowings (+ curl et shrug en substitut). Mollets : 1. Total : 20 fiches.
- Profils concernés : tous ceux qui ont `barre` + `disques`, `rack` (la plupart des variantes) et `barre_ez`.
- Règle 22/23 : aucune fiche technique (arraché, épaulé, clean, snatch, push press) ; niveaux avancés réservés au good morning et au Pendlay ; aucun saut.
- **Niveaux minimum après kine (24/10/2026)** : squat, soulevé de terre, roumain, développé couché et relevé de mollets avec barre sur le dos : **intermédiaire** (aucune variante débutant à la barre chargée sur le dos, au-dessus de la poitrine ou depuis le sol). Restent débutants : hip thrust, rowing appuyé sur banc incliné (barre au sol, poitrine soutenue), curl, shrug au rack. Le débutant passe par le squat gobelet, le roumain aux haltères et le développé couché aux haltères.
- « Squat avec barre sur le haut du dos à la salle avec barres de sécurité » : c'est le squat arrière (`squat-arriere-barre`), qui n'existe que dans un rack à barres de sécurité (tag `rack`).

## Écartés (justification)
- **Tirage menton** (écarté par kine, Q15) et **fentes marchées à la barre** (écartées par kine, Q16) : fiches conservées dans `ecartees/` avec leur motif. Variantes supprimées : fente arrière à la barre (dans fente-barre) et pointes sur plateforme (dans releve-mollets-debout-barre), pour la même raison (chute avec une barre sur le dos, aucun filet fiable seul).
- **Zercher squat** : niveau « expert » dans la base ; barre dans le pli des coudes (compression du biceps et du coude), aucune source, peu d'intérêt par rapport au squat avant. Non fait.
- **Hack squat à la barre** (barre derrière les jambes) : technique spécifique, charge lourde derrière les mollets, risque dos et genou, aucune sécurité possible seul ; le schéma est couvert par la presse et le hack à la machine (salle). Non fait.
- Arraché, épaulé, push press, jerk : règle 23.
- Landmine : pas de tag de matériel (support de landmine ou coin de mur improvisé non sûr) : à rediscuter.
- Rack pull comme fiche séparée : couvert par l'échelon 1 du soulevé de terre.

## Doublons évités (fiches existantes, non recréées)
Version haltères : `souleve-de-terre-roumain-halteres`, `rowing-buste-penche-halteres`, `developpe-epaules-halteres`, `fente-arriere`, `squat-fendu`, `squat-gobelet`, `hip-thrust-banc`, `releve-mollets*`, `curl-incline-halteres`, `extension-triceps-*-halteres`. Mes fiches sont les versions à la barre (autres tags) ; elles s'y réfèrent comme régressions et remplaçants.

## Passage de kine (24/10/2026)
Chaque fiche a été relue une par une (tableau zone x niveau, grossesse, sécurité pour l'utilisateur seul, points d'attention de kine, signes d'arrêt). Aucune source nouvelle n'a été lue pour cette passe : tous les choix ci-dessous restent **NON SOURCÉS** (choix prudents), les études citées dans les fiches restent des résumés (PROVISOIRE). `npm run check:fiches` : 0 erreur après chaque fiche.
- **Barres de sécurité** : écrites de la même façon partout (réglage avant la première série, test à vide, hauteur par exercice). Développé couché : la barre posée sur les sécurités est à quelques centimètres au-dessus de la poitrine ; elle ne touche pas la poitrine ; en cas de blocage, on laisse la barre descendre sur les sécurités (la consigne de coach « redescends-la sur la poitrine puis pose-la » a été supprimée : elle fait peser la barre sur la poitrine). Squat : sécurités à quelques centimètres sous la barre au point le plus bas. Militaire assis : au niveau des clavicules.
- **Matériel « rack »** : veut dire rack avec barres de sécurité (materiel-tags.json) ; chaque fiche le rappelle. Pas de tag séparé (Q13).
- **Pas d'échec** : au moins 2 répétitions en réserve, charge plus légère en cas de doute ; quelqu'un à portée de voix ; colliers à chaque série.
- **Prise** : deux paumes vers soi ; prise mixte et crochet non proposés (soulevés de terre).
- **Cou** : squats, squat fendu, good morning et mollets : cou n1 charge légère, n2 retiré (la barre appuie sur la base du cou) ; shrug : n2 retiré.
- **Grossesse** : toutes les barres droites et chargées retirées (confirmé) ; **ajustement** : le curl à la barre EZ est gardé en grossesse (variante EZ debout, charge légère), le curl à la barre droite et le shrug sont retirés (la barre droite pèse souvent 20 kg, plus que ce qu'un étalonnage léger donne). Tous NON SOURCÉS (la HAS ne parle pas de la barre).
- **Cases sans-zone** (genou, hanche, cheville au niveau 3) : confirmées là où la zone n'est pas sollicitée (développé couché, rowing appuyé, curl, extension triceps, shrug au rack) ; **corrigées** en retrait simple pour la hanche sur banc incliné, développé militaire assis et rowing Pendlay (hanche fléchie sous charge), pour le hip thrust (cheville, épaule : la barre charge les pieds et les épaules) et pour le relevé de mollets (barre sur le dos).
- **Lignes cuisse et aine** (D11) : conservées sur squats, fentes, soulevés de terre, good morning, hip thrust.
- **Good morning et Pendlay** : gardés au niveau avancé avec réserves (Q18) ; dos n1 retire déjà les deux.
- **Photos** : non touchées (toutes « à vérifier », rien n'a été vu).

## Réponses aux 6 questions (choix le plus prudent appliqué ; détail dans docs/QUESTIONS.md Q12 à Q18)
1. Barre légère (Q12) : le générateur ne connaît pas le poids de la barre ; les fiches avertissent que la barre seule pèse souvent 20 kg et renvoient aux haltères si c'est trop lourd.
2. Tag `rack` (Q13) : conservé tel quel, défini comme rack avec barres de sécurité ; pas de développé couché à la barre sans rack (le développé aux haltères le remplace).
3. Soulevé de terre et roumain (Q14) : réservés aux intermédiaires, même depuis le rack.
4. Tirage menton (Q15) : écarté.
5. Fentes marchées et mollets sur plateforme (Q16) : écartés (fentes marchées) et supprimée (plateforme).
6. Grossesse (Q17) : barres lourdes retirées ; curl à la barre EZ gardé en version légère.

## Sources
Photos et gestes : free-exercise-db (PROVISOIRE, Unlicense). Études lues par résumé seulement (moteur de recherche, texte complet non lu) : Escamilla 2000 (sumo), Bloomquist 2013 (profondeur du squat), Hartmann 2013 (genou et profondeur), McAllister 2014 (ischios), Contreras 2015 et Plotkin 2023 (poussée de hanches), Fenwick 2009 (rowing), Saeterbakken 2021 (largeur de prise), Saeterbakken et Fimland 2013 (militaire), Lauver 2016 (banc incliné), Schoenfeld et Grgic 2020 (amplitude), Aasa 2017 (blessures), Grgic 2022 (échec), Kolber 2010 et 2014 (épaule), Maeo 2023 (triceps) : toutes PROVISOIRE. ACSM 2026 (Currier et coll.) et HAS 2019/2022 : références du dépôt. Échelons, niveaux, plafonds de prudence pour l'utilisateur seul, barres de sécurité, grossesse : NON SOURCÉ. Aucune série ni charge chiffrée propre à un mouvement : seules les valeurs du tableau V-DOSE (generateur-v1.md §3.2) sont citées.
