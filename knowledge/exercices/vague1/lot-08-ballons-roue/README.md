# Lot 08 (vague 1) : roue abdominale, ballon de gym, ballon lesté, 20 fiches (lot D, suite)
Rédigé par `coach` le 24/10/2026. Statut : 19 fiches `complete_kine` (reprises par `kine` le 24/10/2026, voir « Passage de kine » en bas), 1 écartée (developpe-couche-halteres-ballon, dossier ecartees/). Étapes suivantes (CAMPAGNE.md) : `kine` (reprise de la sécurité), `dev` (images), `relecteur` lancé à neuf, corrections, statuts. `npm run check:fiches` après rédaction : 180 fiches, 0 erreur, 0 avertissement (les fiches ne sont pas `utilisable` : l'erreur « sans image » ne s'applique pas encore).
Les fiches ont été produites une par une par un gabarit commun (sections, cases, sources communes) avec un contenu propre à chaque exercice ; chaque fichier est complet.

## Fiches
| id | schéma | niveau_min | variantes (échelon) | matériel | image |
|---|---|---|---|---|---|
| roue-abdos | gainage | intermédiaire | à genoux contre un mur, amplitude courte (1), à genoux (2), debout (3, avancé) | roue_abdos, tapis, mur | illustration |
| planche-ballon | gainage | intermédiaire | avant-bras sur le ballon (1), tibias sur le ballon (2, avancé) | swiss_ball, tapis | illustration |
| planche-cercles-ballon | gainage | intermédiaire | petits cercles pieds écartés (1), grands cercles pieds serrés (2, avancé) | swiss_ball, tapis | illustration |
| rollout-ballon | gainage | intermédiaire | roulé court (1), roulé long (2) | swiss_ball, tapis | illustration |
| genoux-poitrine-ballon | gainage | intermédiaire | genoux vers la poitrine (1), hanches vers le plafond (2, avancé) | swiss_ball, tapis | 2 photos Exercise_Ball_Pull-In (photo 1 : voir S3) |
| curl-ischios-ballon | charnière | intermédiaire | deux jambes (1), une jambe (2, avancé) | swiss_ball, tapis | illustration |
| pont-fessier-ballon | charnière | intermédiaire (Q25) | haut du dos sur le ballon (1), talons sur le ballon (2), une jambe (3, avancé) | swiss_ball, tapis | illustration |
| extension-dorsale-ballon | charnière | intermédiaire (Q25) | bras croisés jusqu'à l'alignement (1), mains derrière la tête (2) ; mur plein obligatoire | swiss_ball, tapis, mur | illustration (mur à ajouter par `dev`) |
| pompe-mains-ballon | poussée H | intermédiaire | ballon calé contre un mur (1) ; variante « ballon libre » retirée (Q25) | swiss_ball, mur | illustration |
| pompe-pieds-ballon | poussée H | avancé | tibias sur le ballon (1), pointes de pieds (2) | swiss_ball, tapis | 2 photos Push-Ups_With_Feet_On_An_Exercise_Ball |
| squat-mur-ballon | squat | débutant | sans charge (1), avec un haltère (2) | swiss_ball, mur (halteres) | illustration |
| lancer-poitrine-mur | poussée H | débutant | sans rattraper (1), avec rattrapage (2, intermédiaire) | medecine_ball, mur | illustration |
| lancer-rotation-mur | rotation | intermédiaire | pieds fixes (1), pivot du pied arrière (2, avancé) | medecine_ball, mur | illustration |
| lancer-bas-haut-mur | charnière | intermédiaire | pieds à plat, sans saut (1) | medecine_ball, mur | illustration (à refaire, S2) |
| rotation-assise-ballon-lest | rotation | intermédiaire | pieds au sol (1), pieds levés (2, avancé) | medecine_ball, tapis | illustration |
| bucheron-ballon-lest | rotation | débutant (bas-haut : intermédiaire, Q25) | de haut en bas (1), de bas en haut (2) | medecine_ball, tapis | illustration |
| squat-ballon-lest | squat | débutant | contre la poitrine (1), bras tendus (1) | medecine_ball, tapis | illustration |
| squat-lancer-mur | squat | intermédiaire | lancer de poitrine, pieds à plat (1) | medecine_ball, mur | illustration |
| porte-ballon-lest | porté | débutant | contre la poitrine (1), bras tendus devant (2, intermédiaire) | medecine_ball, tapis | illustration |

Total : 19 fiches `complete_kine` (statuts inchangés). `developpe-couche-halteres-ballon` est écartée (dossier ecartees/, R9 et Q22). Tableau mis à jour le 24/10/2026 (coach 2) d'après les fiches. Identifiants free-exercise-db vérifiés dans `dist/exercises.json` (copie du 24/10/2026) ; images faites par `dev` (4 WebP, 17 illustrations), détail dans tools/photos.md. Pas d'image maxwu.

## Couverture visée
- Gainage 5 (roue + 4 ballon), charnière 4, poussée H 3, squat 3, rotation 3, porté 1 : total 19.
- Profils concernés : E (roue + swiss ball) et tout profil avec `swiss_ball`, `roue_abdos` ou `medecine_ball`. Aucune fiche n'exige un autre matériel que ces tags plus mur, tapis et, pour 2 variantes, des haltères.
- Le débutant a : squat au mur avec ballon, lancer de poitrine sans rattrapage, bûcheron de haut en bas, squat avec ballon lesté, marche avec ballon. Pont fessier et extension dorsale sur ballon, bûcheron de bas en haut : intermédiaire (Q25). La roue et les exercices à fort levier (rollout, genoux-poitrine, pompes sur ballon) sont réservés à l'intermédiaire ou à l'avancé.
- Règles 22 et 23 : aucun saut (tous les lancers : pieds au sol, voir Q5), aucun exercice technique.

## Écartés (justification)
- **Lancer de ballon au sol (slam, « overhead slam »)** : non justifiable sans risque. Le tag `medecine_ball` ne dit pas si le ballon rebondit : avec un ballon rebondissant, il revient vers le visage ; bras au-dessus de la tête = cambrure du bas du dos puis flexion rapide ; contrainte sur l'épaule ; un sol abîmé ou un voisin en dessous. Gain faible par rapport au lancer contre un mur. À rediscuter seulement si l'utilisateur décide de ne proposer le slam qu'avec un ballon « sans rebond » (case de profil à créer).
- **Lancer par-dessus la tête vers un mur** (Standing_Two-Arm_Overhead_Throw) : même raison (épaule en bout de course et cambrure, ballon qui revient vers le visage).
- **Lancer de bas en haut avec saut / lancer vers l'arrière** (Medicine_Ball_Scoop_Throw, Backward_Medicine_Ball_Throw de la base) : sauts, règle 23 et Q5 ; le geste est gardé sans saut dans `lancer-bas-haut-mur`, vers un mur devant soi.
- **Passes en duo** (Medicine_Ball_Full_Twist, Chest_Push_*) : exigent un partenaire (le tag `partenaire_ou_ancrage` n'est pas fait pour ça).
- **Crunch et crunch lesté sur ballon** : flexion répétée du bas du dos, aucun intérêt net par rapport aux gainages du lot ; la rotation russe avec ballon couvre les obliques.
- **Extension du dos avec disque derrière la nuque** (Weighted_Ball_Hyperextension tel quel) : charge sur la nuque, non retenue (règle C6 du cou) ; seule l'extension sans charge est écrite.
- **Roue abdominale pour débutants, ou roue debout à l'intermédiaire** : refusés (niveau intermédiaire minimum, debout réservé à l'avancé).
- **Marche en planche, pompes à une main sur ballon, étirements au ballon** : hors périmètre de ce lot.

## Doublons ou recoupements à arbitrer
`rotation-assise-ballon-lest` recoupe `rotation-russe` (qui a une variante aux haltères), `bucheron-ballon-lest` recoupe `rotation-bucheron` (variante haltère), `squat-ballon-lest` recoupe `squat-gobelet`, `pont-fessier-ballon` et `curl-ischios-ballon` recoupent `pont-fessier` et `curl-ischios-serviette`. J'ai créé des fiches séparées (id distincts, nom contenant le matériel puisque toutes les variantes l'utilisent) pour ne pas toucher aux fiches existantes ; une fusion en variantes d'une même fiche est possible plus tard (décision de `dev` et de l'utilisateur).

## Pour `kine` (priorités de relecture)
1. **roue-abdos** (et rollout-ballon, genoux-poitrine-ballon) : dos n1 est `adapter` vers la variante au mur ; l'utilisateur demande des règles strictes : kine peut préférer `retirer` dès le niveau 1 du dos. Sortie de secours de la roue (consigne « pose le ventre et la poitrine sur le tapis »). Épaule, poignet, hanche. Post-partum retiré (diastasis, G7).
2. **developpe-couche-halteres-ballon** : charge au-dessus du visage sur appui instable (R9) ; niveau intermédiaire est-il assez prudent ? Faut-il retirer la variante « pieds rapprochés » ?
3. **pompe-pieds-ballon** (avancé), **pompe-mains-ballon**, **planche-ballon variante tibias** : épaule et poignet sur surface instable.
4. **lancer-rotation-mur**, **lancer-bas-haut-mur**, **rotation-assise-ballon-lest** : rotation et charnière rapides avec charge, cases dos, genou (pivot) et ischios (cuisse n1 `amplitude:reduite`, n2 retirer).
5. **Grossesse** : toutes les fiches de ballon de gym au sol et les lancers sont retirées, sauf squat au mur (sans charge), bûcheron (sans charge). Choix prudents NON SOURCÉS ; la HAS ne nomme aucun de ces exercices.
6. Tableaux zone x niveau : écrits par `coach` en s'alignant sur les fiches voisines (pompe, planche, squat-gobelet, rotation-bucheron) ; les lignes cuisse et aine sont présentes quand les ischios ou les adducteurs sont sollicités (D11).

## Pour `dev`
- Tags `swiss_ball` et `medecine_ball` : absents de la liste « chargeable » de V-DOSE (generateur-v1.md §3.2) ; un lancer de ballon lesté est un exercice de puissance, hors des lignes V-DOSE et V-TEMPS (les fiches de lancers donnent un repère NON SOURCÉ, voir leur « Repères de dosage »). Un schéma ou une règle « lancer » reste à décider.
- Images (24/10/2026, `dev`) : 2 groupes de photos retenus (genoux-poitrine-ballon, pompe-pieds-ballon ; 4 WebP, environ 74 Ko), 17 illustrations originales, 0 fiche sans image. Les 8 autres groupes de photos ont été regardés et refusés (raisons dans la section Photo de chaque fiche et dans tools/photos.md). La légende de ces deux photos note que le ballon est sous les chevilles et non sous les tibias.
- Plusieurs fiches ont une variante à plusieurs matériels : `developpe-couche-halteres-ballon` (halteres + swiss_ball), `squat-mur-ballon-halteres` (swiss_ball + mur + halteres).

## Questions pour l'utilisateur
1. **Slam** : confirmes-tu qu'on n'écrit pas de fiche de lancer au sol (motif ci-dessus) ? Veux-tu une case « ballon sans rebond » dans le profil pour l'autoriser ?
2. **Roue abdominale** : niveau intermédiaire minimum, mur puis genoux puis debout (avancé). Dès la moindre gêne légère au dos, veux-tu la retirer (plus prudent) plutôt que la ramener à la variante au mur ?
3. **Ballon de gym** : tu acceptes de proposer le développé aux haltères sur ballon (intermédiaire, charge légère), malgré l'avis des sociétés savantes d'utiliser le ballon surtout pour le gainage ?
4. **Lancers** : valides-tu le repère prudent « 2 séries de 6 à 8 lancers, repos 60 à 90 s » (NON SOURCÉ) à défaut d'une règle du générateur ?
5. **Doublons** : une fiche par matériel (choix actuel) ou fusion en variantes des fiches existantes (rotation-russe, rotation-bucheron, squat-gobelet, pont-fessier) ?

## Sources de ce lot
Sociétés savantes et études lues par **résumé seulement** via un moteur de recherche le 24/10/2026 (aucun texte complet lu, tout est PROVISOIRE) : Escamilla et coll. 2010 (JOSPT 40(5):265-276, ballon de gym), Escamilla et coll. 2006 (JOSPT 36(2):45-57, dispositifs roulants), Youdas et coll. 2008 (Ab-Slide, volume et pages non vérifiés) et 2015 (Physiother Theory Pract 31:418-427, ponts), Lehman 2005 (Chiropr Osteopat 13:14, ponts sur ballon) et 2006 (Dyn Med 5:7, pompes), Imai 2010 (JOSPT 40(6):369-375), Goodman 2008 (JSCR 22(1):88-94, titre et références seulement), Uribe 2010 (JSCR 24(4):1028-1033), CSEP Behm 2010 (Appl Physiol Nutr Metab 35(1):109-112), Raeder 2015 (JSCR 29(7):1904-1914, références seulement) et Earp et Kraemer 2010 (Strength Cond J 32(4):20-25), Benjamin 2014 (Physiotherapy 100(1):1-8, conclusions non lues). Public de la plupart des études : adultes jeunes sains ou sportifs, petits échantillons, mesures d'activité musculaire (EMG), pas de mesure de blessures. ACSM 2026 (Currier et coll.) et HAS 2019/2022 : références du dépôt. Échelons, niveaux, plafonds de prudence, grossesse, tableaux par zone, objets (ballon, roue, mur) : NON SOURCÉ.

## Passage de kine (24/10/2026, sécurité seulement, à contrôler par `relecteur` lancé à neuf)
- 19 fiches `complete_kine`, 1 écartée : `developpe-couche-halteres-ballon` (R9, charge au-dessus du visage sur ballon, Q22). `npm run check:fiches` : 0 erreur après chaque fiche.
- Roue : dos niveau 1 = retirer (Q21), sortie de secours à genoux et debout, tapis assez long ; diastasis : roue, roulé, planches, genoux-poitrine, curl, rotation assise, extension retirés en grossesse et post-partum (G7).
- Lancers (poitrine, rotation, bas-haut, squat-lancer) : mur plein à 2 m au moins, hauteur de poitrine, pas de rattrapage risqué, protéger le visage, sortie de secours (Q23).
- Ballon instable : mur ou meuble lourd comme butée, sortie de secours écrite par fiche ; pompe mains « ballon libre » retirée ; niveaux relevés à intermédiaire : pont fessier, extension dorsale, bûcheron bas-haut (Q25). Tableaux : bûcheron au ballon dos n2 retirer ; squat au mur dos n2 sans charge ; squat au ballon dos n2 ballon contre la poitrine ; porte-ballon dos et épaule n1 contre la poitrine ; roulé et planche cercles : précondition ; cases dos de rollout inchangées (variante courte).
- Sources : Lehman 2006 lu sur PMC (résumé : mains sur ballon = triceps et droit de l'abdomen plus actifs, pieds sur ballon = aucun changement, 13 hommes) ; les autres restent PROVISOIRE ou NON SOURCÉ, résumés non rouverts. Corrections de nombre de fiches : 19 dans le lot (l'ancien tableau en compte 20).
- Questions : docs/QUESTIONS.md Q20 à Q25.

## Corrections kine 2 (24/10/2026, sécurité seulement, d'après CONTROLE-relecteur.md ; à recontrôler par `relecteur` sur ces points seuls)
- B1 lancer-rotation-mur : règle unique, le genou ne se tord jamais. Pivot (talon arrière qui se lève, le genou suit le pied) ou pieds fixes avec rotation courte, genoux dans l'axe des orteils ; variantes, consignes, erreurs, tableau, notes genou/hanche, sécurité et signes d'arrêt alignés (arrêt, puis pieds fixes seulement, puis arrêt de l'exercice si cela revient). Fiche sœur bucheron-ballon-lest : même règle (le pied pivote).
- S1 extension-dorsale-ballon : mur plein obligatoire partout (variantes, tag `mur` ajouté, consigne 1, points d'attention, sécurité). L'illustration ne montre pas de mur : à refaire par `dev`.
- S4 pont-fessier-ballon : tête jamais en arrière, regard devant, menton rentré (consigne 3 alignée). M5 : cuisse n1 passe à la variante haut du dos ; extrapolation de Lehman 2005 signalée.
- S5 : distance au mur « au moins 2 m (environ trois grands pas) » dans les 4 fiches de lancers (variantes, consigne 1) ; le rattrapage ne rapproche jamais du mur. S6 bucheron : dos n2 = retirer partout. M11 : sortie de secours « un pas devant toi ».
- C3 genoux-poitrine-ballon : sortie de secours de la variante hanches vers le plafond écrite. C4 planche-ballon : dos n1 = variante avant-bras. C8 pompe-mains-ballon : cases sans effet remplacées (amplitude), dos n2 et cou n2 retirés. M2, M3 (roue, rollout : tapis long dès la consigne 1, progression d'amplitude harmonisée), M7 (squat au ballon lesté : profondeur bornée), M8 (porte-ballon).
- Non traités ici : S2 (illustration de lancer-bas-haut-mur : consigne 3 maintenant bornée à la poitrine, image à refaire par `dev`), S3 (photo 1 de genoux-poitrine-ballon : la fiche n'en dépend pas, légende à adapter par `dev` selon la décision), M10 (illustration lancer-rotation-mur, à aligner sur B1 : rotation courte, pieds pas trop écartés), C1, C2, C5 à C7, C9, M6, M12 (coach, sources, dosage, README). Aucun statut modifié.

## Corrections coach 2 (24/10/2026, sources, dosage et README, d'après CONTROLE-relecteur.md ; à recontrôler par `relecteur` sur ces points seuls)
- C1 Lehman 2006 : référence corrigée après relecture du résumé sur PMC1508143 (Lehman, MacMillan, MacIntyre, Chivers, Fluter, Dyn Med 2006;5:7 ; 13 hommes ; EMG en % du maximum volontaire, non « non normalisée »). Contenu inchangé (mains sur le ballon : triceps et droit de l'abdomen plus actifs ; pectoral inchangé ; pieds sur le ballon : aucun changement). Statut PROVISOIRE inchangé.
- C2 ligne CSEP (10 fiches) : « le ballon sert surtout au gainage » n'est pas dans les résumés lus (Europe PMC, Behm et coll. 2010, revue pp. 91-108 ; prise de position pp. 109-112, texte complet non lu). Reformulée : le sol et les charges libres restent la base ; l'instabilité peut servir en rééducation, dans un programme périodisé ou comme variété pour la population générale. Imai 2010 (planche-ballon) : résumé relu, résultat mitigé écrit (activité accrue sauf transverse au curl-up et pont dorsal) ; « parfois moins de précision » retiré.
- C5 planche-cercles-ballon : la règle citée est V-TEMPS ligne « gainage » (2 séries, repos 60 s) ; le décompte des cercles est un repère de coach NON SOURCÉ (5 à 8 par sens au plus) ; la ligne « anti_rotation » n'est citée que comme analogie.
- C6 roue-abdos, rollout-ballon, genoux-poitrine-ballon : V-DOSE (10 à 15 répétitions) ne s'applique pas à un schéma « gainage » ; règle citée V-TEMPS « gainage » ; son unité (maintien 20 à 30 s) ne convient pas à un mouvement dynamique ; repère de coach NON SOURCÉ : 2 séries, repos 60 s, au plus 6 à 8 répétitions lentes. À signaler à `dev` : aucune règle du générateur ne couvre le gainage dynamique classé `gainage` (même remarque que Q23).
- C7 lancers (lancer-poitrine-mur, lancer-rotation-mur, lancer-bas-haut-mur, squat-lancer-mur) : valeur unique « 2 séries de 6 à 8 lancers (par côté pour la rotation), repos 60 à 90 s », choix prudent NON SOURCÉ, texte identique dans les 4 fiches ; V-DOSE et V-TEMPS à ne pas appliquer. La réponse de l'utilisateur à Q23 n'est pas enregistrée ; la règle « lancer » (ou l'exclusion) reste à décider par `dev`.
- C9 pompe-pieds-ballon : légende précisée (variante pointes de pieds, échelon 2) ; régression `genoux-poitrine-ballon-genoux` retirée de « plus-facile » (schéma gainage, pas une pompe) : restent pompe-sol et pompe-pieds-sureleves.
- M2 roue-abdos : Escamilla 2006 nomme un « Ab Roller » (appareil à berceau), pas la roue libre : phrase corrigée. M6 curl-ischios-ballon : « environ 60 % » = curl à deux jambes sur surface stable (Youdas 2015). M12 : tableau du README mis à jour (19 fiches, niveaux, images, développé écarté).
- Non traités ici : sécurité (kine), images et photos (S2, S3, M10 : `dev`), statuts (aucun modifié). `npm run check:fiches` : 179 fiches, 0 erreur, 0 avertissement.
