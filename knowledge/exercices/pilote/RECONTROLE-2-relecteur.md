# Recontrôle 2 relecteur : lot pilote (33 fiches) + regles-securite-communes.md
Contrôle indépendant par `relecteur` le 2026-10-22, lancé à neuf. Je n'ai écrit ni corrigé ces fichiers : je liste les écarts. Décision utilisateur appliquée au contrôle : pas de questionnaire de dépistage ni de verrou ; avertissement au lancement, signes d'arrêt et profil blessures facultatif conservés.

## Ce qui a été réellement vérifié
- free-exercise-db `dist/exercises.json` retéléchargé le 2026-10-22 : niveau, matériel, muscles et consignes des 26 identifiants cités, comparés fiche par fiche.
- Photos : seules les 2 WebP présentes dans `public/photos/free-exercise-db/` (Incline_Push-Up-0 et -1) ont été regardées, y compris en zoom sur les zones du logo. Les autres images, jamais regardées ici, ne sont pas rouvertes : les « oui » de Side_Bridge/0, Plank/1 et Stiff-Legged/0 reposent sur le contrôle précédent.
- `npm run check:fiches` : 33 fiches, 0 erreur, 12 avertissements (9 `a-creer`, 3 « photo oui sans WebP »).
- `git diff` de `regles-securite-communes.md` entre le recontrôle 1 et aujourd'hui : seul le §2 (dépistage retiré) a changé.
- Non rouverts : HAS, Mottola, OARSI, Smith, Riebe, ACE, NASM, Prehab Guys (leur lecture reste celle déclarée par le contrôle précédent). Le statut PROVISOIRE ou NON SOURCÉ y reste et la règle 10 de CLAUDE.md s'applique avant tout codage.

## Décompte
- **Bloquant : 1** (regles-securite-communes.md : G2, G3, G7 contre la décision « pas de verrou »)
- **À corriger : 24** (5 sur regles-securite-communes.md, B2 à B6, et 19 fiches)
- Remarques : nombreuses, listées plus bas.

## A. regles-securite-communes.md
| n° | Section | Problème | Gravité |
|---|---|---|---|
| B1 | §3 G2 (l.40), G3 (l.41), G7 (l.45) contre §2 D (l.32) | **Contradiction frontale avec la décision de l'utilisateur.** D dit « aucun questionnaire, aucun verrou ». G2 impose une case « j'ai eu l'avis de mon médecin » et « aucun programme sans elle » ; G3 pose une question et « oui -> aucun programme » ; G7 « bloquer jusqu'aux cases », date d'accouchement, mode. Le §8 note la question en attente sans la trancher. Conséquence plus grave : l'ancienne question « enceinte ? » du dépistage a disparu, donc plus rien ne déclenche les 33 lignes **Grossesse** des fiches ni G4/G6. Tant que le déclencheur n'est pas défini (champ facultatif du profil, par exemple, sans verrou), la sécurité grossesse n'est pas applicable. | **bloquant** |
| B2 | §3 G4 (l.42) | Contradiction interne reprise du recontrôle 1 (R2) : « Adapter » cite « squats » et « pompes inclinées », « Garder » cite squat-assis-debout, squat-poids-du-corps et pompe-inclinee. De plus `pompe-inclinee` n'existe plus (fusionnée dans `pompe`, qui dit `adapter: variante:pompe-chaise`). G4 ne classe ni bird-dog, ni pompe-diamant, pompe-archer, pompe-ecartee. | à corriger |
| B3 | §3 G2 (l.40) | Reste du R7 : « obligatoire ... » reste attribué à la HAS 2022, qui dit « conseillées ». Le blocage est un choix du projet et n'est pas de la HAS. | à corriger |
| B4 | §3 G6 (l.44) et U1 (l.65) | Reste du R8 : l'orientation « appeler la maternité / le 15 » pour saignement, perte des eaux et contractions n'est pas dans la HAS (qui dit « arrêter et consulter », urgence réservée à la douleur de poitrine) ; la ligne reste « OK (HAS) ». À marquer PROVISOIRE ou NON SOURCÉ. | à corriger |
| B5 | §0 (l.9-14) | Le vocabulaire écrit `charge:légère` et `remplaçant:`, alors que format-fiches.md et le script exigent `charge:legere` et `remplacant:` et fixent des listes fermées d'`amplitude` et d'`appui`. Les deux fichiers de référence se contredisent. Le §8 « mettre à jour les 33 fiches » est périmé. | à corriger |
| B6 | §7 « Marche » (l.71) | R8 dit « seulement la première marche ; jamais une marche plus haute ». La fiche montee-sur-marche autorise les haltères sur la première **ou la deuxième** marche (décision utilisateur). R8 et le tag `marche_escalier` (première marche) ne sont pas alignés sur cette décision. | à corriger |
| B7 | R5 (l.24), R9 (l.28) | Remarques conservées : Riebe 2015 parle du dépistage avant de commencer, l'utiliser comme liste de signes d'arrêt est une extrapolation (statut PROVISOIRE correct) ; R9 « disques serrés » PROVISOIRE ici, NON SOURCÉ dans 4 fiches (voir D). U1 : « perte de connaissance », « difficulté à respirer au repos » absents de R5. G3 : hypertension et diabète non contrôlés attribués sans nuance (relatifs HAS, absolus Mottola). G5 : altitude, seuil HAS 2 500 m. S1 : « zone passe au niveau 3 » est une règle de conception non marquée. | remarque |

Anciens points de regles-securite-communes levés : dépistage (PAR-Q+ non copié, plus de questions) ; R1 à R3, R7 marqués NON SOURCÉ ; S2/S3 conformes à la fiche HAS lombalgie (vérifiés au recontrôle 1).

## B. Écarts entre fiches et sources (free-exercise-db), vérifiés ce jour
- **fente-basse-rotation, l.21 et variante `fente-basse-rotation-sol`** : la consigne 1 dit « genou arrière **posé au sol** » ; la source Worlds_Greatest_Stretch dit « sur les orteils du pied arrière, genou presque au sol ». La ligne de sources dit pourtant « genou arrière près du sol ». Écart (à corriger).
- **developpe-au-sol-halteres, consigne 4** : « coudes à environ 45° » ; la source dit seulement « coudes serrés (triceps) ou ouverts (pectoraux) ». Le 45° n'est pas signalé NON SOURCÉ (la fiche pompe le fait). À corriger.
- **muscles reclassés sans trace** (remarque, même défaut dans plusieurs fiches) : pullover (grand dorsal secondaire dans la source, principal dans la fiche ; ligne l.95 « l'ordre suit la source », reste du R12) ; fente-arriere (fessiers) ; marche-du-fermier (trapèzes, obliques) ; rowing-buste-penche et rowing-unilateral (grand dorsal) ; souleve-de-terre-roumain-halteres (fessiers) ; squat-gobelet (fessiers) ; squat-assis-debout (adducteurs alors que la source dit « abducteurs » et que la ligne de sources l'écrit) ; chat-vache (abdominaux ajoutés) ; squat-fendu (muscles tirés d'un squat bulgare et d'un saut, non dit dans la ligne de sources, reste du R26).
- **souleve-de-terre-roumain-halteres, photo l.85** : « la source dit jambes tendues » : seul le nom l'indique ; les instructions disent « genoux légèrement fléchis ». Remarque.
- Niveaux écartés de la source (intermédiaire -> débutant : floor press, rear lunge, step-ups, farmers walk, WGS ; pompes) : tous tracés. OK.

## C. Verdict par fiche
Légende : OK = rien à signaler d'important ; « à corriger » = point à reprendre par l'auteur ; la ligne est indiquée.

| Fiche | Verdict | Points |
|---|---|---|
| bird-dog | à corriger | l.67 : version plus douce = dead-bug, couché sur le dos, alors que la grossesse de cette fiche est « adapter » (une femme enceinte renvoyée vers une position retirée par G4) ; bird-dog absent de G4 (remarque) |
| chat-vache | OK | photos « à vérifier » donc non affichées ; abdominaux ajoutés (remarque) |
| dead-bug | à corriger | l.40 : `plus-dur: dead-bug-haltere` est au même échelon (1) que la variante de base ; l.95 haltère au-dessus du visage NON SOURCÉ alors que R9 dit PROVISOIRE (remarque) |
| developpe-au-sol-halteres | à corriger | l.24 : 45° non sourcé et non signalé ; l.95 idem R9 (remarque) |
| developpe-epaules-halteres | OK | consigne « bras près des oreilles » et paumes face à face absentes de la source, non signalées (remarque) ; plus-facile = pompe-piquee (tête en bas, pas plus facile qu'une charge légère) : à discuter (remarque) |
| fente-arriere | OK | l.33 « Pas assez long » vs l.36 « Pas trop court » : formulation ambiguë ; fessiers principal sans trace (remarque) |
| fente-basse-rotation | à corriger | l.21 et l.18 : genou posé au sol contre la source (voir B) ; consignes 2-3 confuses (main du côté du pied avant « à l'intérieur du pied ») |
| marche-du-fermier | OK | photos « non » (matériel spécialisé) ; muscles reclassés (remarque) |
| mobilite-cheville-au-mur | OK | tout est NON SOURCÉ, correctement marqué ; variante genou au sol sans appui coussin en Genou niveau 1 (remarque) |
| montee-sur-marche | **à corriger (prioritaire)** | l.12 note périmée (« kine la refait », déjà fait) ; l.84-85 « seulement la première marche du bas » et « jamais une marche plus haute » contredisent l.86 et l.20 « première ou deuxième marche » avec haltères : trois consignes affichables dans une même section ; contredit aussi R8 et la définition du tag. Le bloquant du recontrôle 1 est réduit par la décision utilisateur (échelon sans charge d'abord, option un haltère + rampe, chaussures) mais pas supprimé : réécrire l.84-85 pour qu'elles ne contredisent plus l.86. Risque : chute avec charge |
| planche-laterale | à corriger | l.85 NASM « vu via résumé de recherche, page non lue » en PROVISOIRE : source non lue = NON SOURCÉ (règle appliquée au point n° 51 du premier contrôle) ; l.77 photo « oui » sans fichier WebP |
| planche-touche-epaule | à corriger | l.61 et l.67 : « échelons sur les pieds retirés dès le niveau 1 d'une zone du tableau », mais Coude niveau 1 = garder : contradiction ; consigne 2 « écarte les pieds » contredit l'échelon 3 « pieds serrés » |
| planche | OK | Plank/1 « oui » sans WebP (remarque) ; durée de maintien non sourcée, déjà signalée |
| pompe | à corriger | l.115 ligne Sources « à refaire par kine / à compléter » périmée (la section est rédigée l.57) ; aucune ligne de source pour les règles communes ; note l.70 (« ne pas ajouter pieds surélevés ») non appliquée par la case épaule niveau 1 = garder. Photo : voir D |
| pompe-archer | à corriger | l.80 même ligne périmée « à compléter par kine » |
| pompe-diamant | à corriger | l.82 idem |
| pompe-ecartee | à corriger | l.82 idem |
| pompe-piquee | à corriger | l.88-89 NASM « page non lisible » en PROVISOIRE : NON SOURCÉ ; notes épaule-n1 et coude-n2 (« amplitude réduite ») ne correspondent pas aux cases (`variante:pompe-piquee-mains-marche`) ; consigne 3 « vers le sol » pour mains sur marche |
| pompe-piquee-pieds-sureleves | à corriger | l.17 installation « ou une box stable » non codable avec le tag `marche_escalier` ; l.94 muscles « NASM via résumé » PROVISOIRE (voir pompe-piquee) ; l.68-69 : texte destiné à `dev` (« proposition de case dédiée, à trancher ») dans une section affichable, et cette case de profil ressemble à un questionnaire que la décision écarte |
| pont-fessier | OK | grossesse -> remplacant sdt roumain : cohérent avec G4 |
| porte-sac-a-dos-devant | OK | Dos niveau 1 = garder alors que marche-du-fermier et porte-valise adaptent (remarque) ; « bouteilles » dans l'installation vs « pas de verre » (remarque) |
| porte-valise | OK | source ACE lue au contrôle 1 |
| pullover-haltere-au-sol | à corriger | frontmatter l.8 et l.95 : grand dorsal principal contre la source (reste du R12, tracer ou reclasser) ; l.102 R9 NON SOURCÉ vs R9 PROVISOIRE (remarque) ; photos « non » : conformes |
| rowing-buste-penche-halteres | OK | grand dorsal principal sans trace (remarque) |
| rowing-unilateral-haltere | à corriger | l.60 note dos-n2 : « support stable plus haut » sans objet nommé ni tag (reste du R11 : R8 ne couvre que chaise, marche, sac, porte) |
| souleve-de-terre-roumain-halteres | à corriger | l.62-63 : la note dos-n2 dit « charnière sans charge » alors que la case est `variante:pont-fessier-sol` ; photo 0 « oui » sans WebP ; ancien écart R10 (installation) : **levé** |
| souleve-de-terre-roumain-unijambiste | OK | grossesse = adapter (version mur) alors que G4 retire pour « risque de chute » les exercices comparables (remarque) |
| squat-assis-debout | OK | id `squat-assis-debout-marche` avec tag `box_ou_step` (remarque) ; adducteurs/abducteurs (voir B) ; pas de ligne Cheville alors que squat-fendu y renvoie (remarque) |
| squat-bulgare | à corriger | l.62 note cheville-n1 : « serviette pliée sous le dessus du pied arrière » (appui:premiere-marche) : une serviette glisse et diminue l'adhérence, même défaut que l'ancien n° 39 ; aucune consigne antidérapante |
| squat-fendu | OK | l.88 muscles tirés de deux sources dont un saut et un squat bulgare, non dit (remarque, reste du R26) |
| squat-gobelet | à corriger | notes dos-n2 et cheville-n2 (« sans charge ») ne correspondent pas aux cases (`variante:squat-assis-debout`, `amplitude:reduite`) ; l.96 R9 (remarque) |
| squat-poids-du-corps | OK | muscles alignés sur la source : ancien n° 19 levé ; photos « non » (consigne prime) conformes |
| tirage-w-allonge | à corriger | note dos-n2 « coussin plat sous le ventre » alors que la case est `amplitude:bras-bas` |

## D. Photos
- **Incline_Push-Up-0.webp et -1.webp (fiche pompe, échelon pompe-chaise)** : le recadrage a retiré le logo « Boise CrossFit » (0.webp : seule une fresque sans texte reste). Dans 1.webp reste une bannière sombre avec un petit carré rouge et du texte flou en haut, illisible mais visible ; la box est coupée à gauche. Conforme à la règle 12 (marque de salle, pas d'une autre app) et déjà consigné dans tools/photos.md : remarque. La mention « montré sur une box » est bien portée. Affichables : oui, sous réserve de la mention.
- « oui » sans fichier WebP : Side_Bridge-0 (planche-laterale), Plank-1 (planche), Stiff-Legged_Dumbbell_Deadlift-0 (sdt roumain) : l'image ne s'affichera pas ; créer les fichiers ou passer à « à vérifier ». Remarque.
- Plank/0, Bodyweight_Squat, Bent-Arm_Dumbbell_Pullover, Farmers_Walk : « non » : conformes. Aucune image maxwu ni wger utilisée. Toutes les autres photos sont « à vérifier » donc non affichées.

## E. Suivi des anciens écarts (recontrôle 1)
| Ancien | État |
|---|---|
| R1 (montee-sur-marche, bloquant) | **levé en partie** : décision utilisateur ; reste la contradiction l.84-85 / l.86 / R8 (à corriger, voir C) |
| R2 (G4) | non levé (B2) |
| R3 (garder avec parenthèse) | levé : le script valide, cases au format strict |
| R4 (cases multiples, texte libre) | levé par format-fiches.md et le script ; reste des notes qui ne correspondent plus aux cases (C) |
| R5, R6 (PAR-Q+) | sans objet : dépistage supprimé |
| R7, R8 (G2, G6) | non levés (B3, B4) |
| R9 (niveau développé assis) | levé : tracé l.96 |
| R10 (installation sdt) | levé |
| R11 (rowing, support stable) | levé pour la case, reste la note (C) |
| R12 (pullover muscles) | non levé |
| R13 (R9 NON SOURCÉ vs PROVISOIRE) | non levé (4 fiches) |
| R14, R17 (ordre des échelons) | levés (une seule ligne par échelon, format respecté, validé par le script) |
| R15 (planche durée) | inchangé, déjà reconnu |
| R16 (tag marche_escalier) | levé (tag renommé) |
| R25, R26 | R25 : bird-dog et pompes toujours non classés dans G4 ; R26 non levé |
| Points 50 et 51 du contrôle 1 (ACE pompe-genoux, Prehab Guys) | levés dans pompe et pompe-piquee-pieds-sureleves ; **même défaut présent pour NASM** (planche-laterale, pompe-piquee) |

## F. Verdict
**Le lot n'est pas validé** : un point bloquant (B1) reste ouvert. Les fiches ne passent pas en statut `verifie` ; les lignes PROVISOIRE et NON SOURCÉ restent telles quelles (règle 10).
Fiches sans point à corriger : chat-vache, developpe-epaules-halteres, fente-arriere, marche-du-fermier, mobilite-cheville-au-mur, planche, pont-fessier, porte-sac-a-dos-devant, porte-valise, rowing-buste-penche-halteres, souleve-de-terre-roumain-unijambiste, squat-assis-debout, squat-fendu, squat-poids-du-corps (remarques seulement).
