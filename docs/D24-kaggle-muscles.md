# D24 c : squelettes de séance par muscle (Kaggle 600K) et écarts avec le générateur (07/11/2026)

**Statut : NON SOURCÉ** (ODbL, provenance inconnue, salle et bodybuilding, étiquettes multiples, aucun suivi de résultats ni de blessures). Agrégats seulement, aucune ligne de programme copiée. Outil : `tools/kaggle-muscles.mjs` (lecture en flux du ZIP hors dépôt, sortie `donnees-externes/kaggle-600k/stats-muscles.json`). Les nombres entre parenthèses sont le nombre de séances de la **semaine 1** qui portent le chiffre.

## 1. Liaison aux muscles (borne assumée, par noms)
- **94,7 % des 605 033 lignes** reçoivent un muscle principal : 94,5 % par des règles de nom écrites par nous (ordre de priorité, `OV` dans l'outil), 0,2 % seulement par le jeu Hasan (étiquettes de Hasan parfois étranges : squat = fessiers, leg press = fessiers : d'où les règles de nom d'abord). Cardio, mobilité, étirements, sauts, balancés (3-4 % des lignes) sont sortis du calcul.
- Les 150 exercices les plus fréquents : 1,6 % des lignes restent sans muscle (marche, course, cardio, étirements : voulu). Nos fiches existent pour 15 % seulement de ces 150 via la table D22 (borne basse, rapport D24 b).
- Biais de la liaison : les rowings sont rangés « trapèzes / rhomboïdes » (muscle principal) avec grand dorsal en secondaire ; les tirages verticaux en grand dorsal ; un exercice = un muscle principal (les parts de séries sont des parts de séries d'exercices, pas des doses par muscle).

## 2. Squelette par type de séance (type déduit du contenu, pas des titres)
Classement : jambes (>= 60 % des séries aux jambes), poussée, tirage (>= 60 % de poussée / tirage et < 15 % de jambes), haut (poussée et tirage >= 25 % chacun), bas (jambes 40-60 %), corps entier (jambes et poussée et tirage >= 15 %). 9 429 séances classées sur 11 277 ; 1 848 non classées (trop peu de lignes liées).

| Type (séances) | Exercices : p25 / médiane / p75 | Séries : p25 / médiane / p75 | Séries par exercice | Rang du 1er exercice d'isolation (médiane) | Part de polyarticulaires au rang 1 / 2 / 3 |
|---|---|---|---|---|---|
| Poussée (1 957) | 5 / 6 / 7 | 11 / 15 / 19 | 2 / 3 / 3 | 3 | 90 % / 75 % / 54 % |
| Tirage (1 284) | 5 / 6 / 7 | 10 / 15 / 20 | 2 / 3 / 3 | 4 | 86 % / 80 % / 60 % |
| Jambes (2 645) | 4 / 5 / 6 | 10 / 14 / 18 | 2 / 3 / 3 | 3 | 83 % / 77 % / 58 % |
| Haut (1 517) | 5 / 6 / 7 | 12 / 17 / 21 | 2 / 3 / 3 | 3 | 81 % / 73 % / 55 % |
| Bas (620) | 4 / 5 / 7 | 11 / 15 / 19 | 2 / 3 / 3 | 3 | 82 % / 75 % / 61 % |
| Corps entier (1 406) | 5 / 6 / 7 | 12 / 16 / 20 | 2 / 3 / 3 | 4 | 87 % / 80 % / 70 % |

Répartition des séries (part des séries de la séance, muscle principal de l'exercice, valeurs arrondies) :
- **Poussée** : pectoraux 39 %, triceps 17 %, deltoïdes latéraux 13 %, deltoïdes antérieurs 13 %, biceps 5 %, trapèzes 3 %, abdominaux 2 %.
- **Tirage** : biceps 25 %, trapèzes / rhomboïdes 24 %, grand dorsal 18 %, avant-bras 9 %, deltoïdes postérieurs 8 %, pectoraux 4 %, triceps 4 %, abdominaux 3 %.
- **Jambes** : quadriceps 40 %, ischios 21 %, mollets 12 %, fessiers 10 %, abdominaux 6 %, moyen fessier 2 %, adducteurs 2 %.
- **Haut** : pectoraux 21 %, biceps 15 %, trapèzes 12 %, triceps 10 %, grand dorsal 9 %, deltoïdes (3 faisceaux) 21 %, abdominaux 5 %.
- **Corps entier** : quadriceps 16 %, pectoraux 15 %, trapèzes 9 %, biceps 8 %, grand dorsal 8 %, triceps 6 %, ischios 6 %, fessiers 5 %, deltoïdes 12 %, abdominaux 5 %, mollets 4 %.
- Répétitions (toutes séances, hors durées) : 9-12 environ 49 %, 6-8 22 %, 13-15 12 %, 1-5 9 %, 16+ 7 %. **Identiques pour polyarticulaires et isolations** : la base ne permet pas de lire une différence de fourchette par rôle. Séries par exercice : médiane 3 dans les deux rôles.
- **Variété** : 93 % des exercices de la semaine 1 reviennent à la semaine 2, même programme et même jour (10 729 jours comparés) : la base décrit des programmes à exercices fixes, pas de la rotation.

## 3. Ce que produit le générateur (8 profils, cible muscle, séance de 45 ou 60 min ; test jetable, non versionné)
| Profil | Séance | Exercices | Séries | Séries / ex. | Écarts avec la base |
|---|---|---|---|---|---|
| Maison élastique, 3 j, intermédiaire, 45 min | CE x3 | 6 / 6 / 7 | 18 / 17 / 18 | 2,6-3,0 | proche de la base (6 ex., 16 séries) ; bras absents ; mollets absents |
| Maison élastique, 5 j, avancé, 60 min | HAUT / BAS | 6 / 7 | 17 / 18 | 2,6-2,8 | proche |
|  | PUSH / PULL / LEGS | **4** / 6 / 6 | **12** / 15 / 15 | 2,5-3,0 | PUSH : 4 exercices et 12 séries contre 6 et 15 ; pas de triceps ni de deltoïdes latéraux comme exercice principal ; PULL : peu de bras |
| Maison haltères + élastique, 5 j, avancé, 60 min | PUSH / PULL / LEGS | **4** / 5 / 6 | **11** / 13 / 17 | 2,6-2,8 | PUSH 11 séries pour 35 min alors que le profil donne 60 min |
| Maison complète, 4 j, intermédiaire, 60 min | HAUT / BAS x2 | 8 / 8 / 7 / 6 | 24 / 20 / 19 / 15 | 2,5-3,0 | plus long que la base sur HAUT / BAS 1 (24 séries) |
| Salle, 4 j / 5 j, intermédiaire / avancé | HAUT / BAS ; PUSH / PULL / LEGS | 6-8 ; PUSH **4** | 15-23 ; PUSH **10** | 2,3-3,0 | PUSH salle 4 exercices et 10 séries (30 min) : le plus bas écart |
| Salle, 3 j, débutant | CE x3 | 8 | 16 | 2,0 | 2 séries par exercice (règle STR-REP débutant), 8 exercices contre 6 |
| Sans matériel, 3 j, débutant, 45 min | CE x3 | 8 | 16 | 2,0 | zones à 0 point : épaules côté, biceps, avant-bras |
- Les séances de Martin (3-4 exercices, 9-11 séries) sont **plus courtes** que le générateur actuel (6-8 exercices, 15-24 séries) sauf pour PUSH, PULL et LEGS à 5 jours, qui restent à 4-6 exercices et 10-17 séries (plafond de séries par séance, voir backlog niveau 4 : lecture « relative » de la règle des 11 séries).
- **Zones jamais travaillées dans la semaine** (points = 0) : coiffe des rotateurs et cou dans tous les profils (petites zones sans fiche sûre, backlog) ; carré des lombes dans 5 profils sur 8 ; abducteurs, tibiaux, péroniers selon le profil ; sans matériel : épaules côté, biceps, avant-bras.
- Les biceps, triceps, avant-bras et deltoïdes latéraux sont les muscles que la base travaille le plus en « finition » (biceps + triceps = 20-30 % des séries d'une séance haut, poussée ou tirage) ; le générateur les couvre surtout comme secondaires (indirects).

## 4. Ce que la base ne contient presque pas
- Tronc : abdominaux 2-6 % des séries, jamais de gainage dorsal ni de rotations ; fonctionnel, mobilité, cardio : 4 % des lignes (mots-clés) ; petites zones : avant-bras 1-9 % (indirect), nuque quelques centaines de lignes (« neck extension »), coiffe des rotateurs, carré des lombes, fléchisseurs de hanche, tibiaux, péroniers : quasi absents. Ces éléments viennent de nos règles (CORE_TARGET_SESSIONS, bloc correctif, remplissage du temps), ajoutés par-dessus le squelette.
- Niveau débutant : aucune séance lisible séparément (étiquettes multiples).

## 5. Limites : ce qui ne peut pas se décider avec cette base
Efficacité, sécurité, charges, progression, séries par muscle et par semaine (non lisibles), fourchettes de répétitions par rôle (identiques dans les deux rôles), force contre hypertrophie contre cardio (étiquettes multiples), femmes / seniors / débutants, maison et élastique (surtout salle), retour de blessure.
