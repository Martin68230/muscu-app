# D24 d : les programmes de la base Kaggle 600K, lus par semaine (13/11/2026)

**Statut : NON SOURCÉ** (ODbL, provenance inconnue). Agrégats seulement, aucune ligne de programme copiée. Outil : `tools/kaggle-programmes.mjs` (module partagé `tools/kaggle-lib.mjs`, l'ancien `kaggle-muscles.mjs` en dépend), lecture en flux du ZIP hors dépôt, sortie `donnees-externes/kaggle-600k/stats-programmes.json` (complète : p25/p75/p90, signatures). Exécution : 26 s.

## 0. Échantillon
- 2 703 programmes lus (clé titre + date de création) ; **2 331 retenus** : semaine 1 avec 2 à 6 séances (= jours de la semaine 1) dont >= 2 classées (types de `D24-kaggle-muscles.md`).
- Programmes par nombre de jours : 2 j = 91 ; 3 j = 465 ; 4 j = 796 ; 5 j = 627 ; 6 j = 352. Les 2 j sont peu nombreux : lire avec prudence.
- Séries = séries des lignes reliées à un muscle (principal), 1 à 12 séries par ligne ; cardio / mobilité exclus. Un exercice = un muscle principal (pas de dose partielle sur les secondaires).

## 1. Composition de la semaine 1 (programmes dont TOUTES les séances sont classées : n entre parenthèses)
| Jours (n) | Corps entier | Haut / bas | PPL (poussée, tirage, jambes) | Autres mélanges |
|---|---|---|---|---|
| 2 (91) | 39 % | 12 % | 0 % | 50 % |
| 3 (369) | 27 % | 9 % | 14 % | 50 % |
| 4 (587) | 8 % | 22 % | 12 % | 58 % |
| 5 (389) | 2 % | 11 % | 24 % | 63 % |
| 6 (203) | 2 % | 6 % | 47 % | 44 % |
Règles : corps entier = >= 75 % de séances corps entier ; haut / bas = seulement haut, bas, jambes avec haut et (bas ou jambes) ; PPL = seulement poussée, tirage, jambes, les trois présents. « Autres » est grand car les étiquettes de séance sont grossières : signatures fréquentes (part des programmes complets) : 3 j : 3 x corps entier 27 %, jambes + poussée + tirage 14 % ; 4 j : 2 x haut + 2 x jambes 19 %, 2 x jambes + 2 x poussée 10 %, haut + 2 x jambes + poussée 9 % ; 5 j : haut + 2 x jambes + poussée + tirage 15 % ; 6 j : 2 x PPL (jambes, 2 poussées, 2 tirages) 44 %. Indicateur « split par muscle » (>= la moitié des séances avec un muscle >= 45 % des séries, >= 3 muscles dominants différents) : 2 j 0 %, 3 j 1 %, 4 j 7 %, 5 j 15 %, 6 j 17 % : le split par muscle (« jour pecs ») est rare dans cette base, ou invisible avec ce classement.

## 2. Séries par semaine et par groupe (semaine 1) : médiane (p25 - p75) parmi les programmes qui travaillent le groupe ; entre crochets, programmes concernés
| Groupe | 3 j (465) | 4 j (796) | 5 j (627) | 6 j (352) |
|---|---|---|---|---|
| Pectoraux | 6 (4-9) [436] | 8 (6-12) [781] | 10 (7-14) [617] | 12 (8-18) [348] |
| Dos | 6 (4-9) [430] | 9 (6-12) [760] | 10 (6-15) [614] | 12 (8-18) [348] |
| Épaules | 6 (3-9) [337] | 6 (4-10) [699] | 9 (6-12) [589] | 12 (7-16) [328] |
| Biceps | 4 (3-6) [329] | 6 (3-8) [660] | 6 (4-10) [572] | 8 (6-12) [328] |
| Triceps | 4 (3-7) [372] | 6 (3-9) [700] | 7 (4-10) [577] | 9 (6-12) [331] |
| Quadriceps | 7 (5-9) [442] | 9 (6-12) [781] | 9 (6-13) [619] | 11 (7-16) [347] |
| Ischios | 3 (3-6) [332] | 4 (3-6) [692] | 5 (3-7) [559] | 6 (4-9) [316] |
| Fessiers | 3 (3-6) [266] | 4 (2-6) [528] | 4 (3-6) [409] | 4 (2-8) [218] |
| Mollets | 3 (3-4) [158] | 4 (3-6) [403] | 4 (3-6) [385] | 6 (3-8) [248] |
| Abdominaux | 6 (3-9) [229] | 5 (3-7) [434] | 6 (3-10) [370] | 8 (4-12) [201] |
| Avant-bras | 3 (2-4) [155] | 3 (3-5) [352] | 3 (3-6) [335] | 6 (3-8) [196] |
À 2 j (91 programmes) : pectoraux 4, dos 6, quadriceps 5, ischios 3, bras 3-4 (épaules, bras, fessiers, mollets : moins de 60 programmes). Les parts « programmes qui comptent le groupe » : fessiers 59 % (4 j), mollets 51 % (4 j), avant-bras 44 % (4 j) ; les gros groupes 94 à 98 %. Les médianes « tous programmes » (zéros compris) sont plus basses : voir le JSON.

## 3. Fréquence hebdomadaire (séances/semaine où le groupe est muscle principal d'un exercice ; médiane des programmes qui le travaillent)
| Groupe | 3 j | 4 j | 5 j | 6 j |
|---|---|---|---|---|
| Pectoraux, dos, épaules, quadriceps | 2 | 2 | 2 | 2 (épaules 3) |
| Biceps, triceps, ischios | 1 | 2 | 2 | 2 |
| Fessiers | 1 | 1 | 1 | 1 |
| Mollets, avant-bras | 1 | 1 | 1-2 | 2 |
| Abdominaux | 2 | 2 | 2 | 2 |
Dès 3 jours, les gros groupes sont vus 2 fois par semaine dans la moitié des programmes. À 2 j : dos et quadriceps 2, le reste 1.

## 4. Ordre, cardio et mobilité
- Séances qui commencent par un polyarticulaire (premier exercice relié, hors cardio / mobilité ; médiane par semaine) : 2 j : 2 sur 2 (86 % des séances) ; 3 j : 3 sur 3 (82 %) ; 4 j : 4 (80 %) ; 5 j : 4 sur 5 (75 %) ; 6 j : 4 sur 6 (71 %). Beaucoup de séances débutent donc par un composé, plus rarement à mesure que les jours augmentent (séances d'appoint bras / abdominaux).
- Programmes avec au moins une ligne de cardio (mots-clés) en semaine 1 : 2 j 37 % ; 3 j 39 % ; 4 j 49 % ; 5 j 63 % ; 6 j 64 %. Mobilité / étirements (mots-clés) : 2 à 5 % seulement (les étirements sont en général hors programme).

## 5. Évolution semaine 1 -> semaine 4 (même programme ; programmes ayant les deux semaines : 78 / 429 / 743 / 591 / 327 pour 2 à 6 j)
- Total de séries par semaine, S4 / S1 : médiane 1,0 pour tous les jours ; p75 = 1,0 (p90 1,02 à 1,06). **Stable (±10 %) : 83 % (2 j), 88 % (3 j), 85 % (4 j), 87 % (5 j), 86 % (6 j) ; monte (> +10 %) : 8 / 5 / 8 / 5 / 6 % ; baisse (< -10 %) : 9 / 7 / 7 / 8 / 7 %.** Le volume ne monte donc presque jamais de façon programmée sur 4 semaines : ces programmes copient la même semaine (progression par la charge, pas par le volume).
- Décharge : semaine 4 à moins de 80 % de la semaine 3 chez 4 à 5 % des programmes (n = 429 à 743), soit de l'ordre de 1 sur 20.
- Répétitions (médiane des répétitions par programme, écart S4 - S1 de plus de 1 répétition) : stable 70 % (2 j), 72 % (3 j), 69 % (4 j), 66 % (5 j), 63 % (6 j) ; monte 13 à 19 % ; baisse 14 à 18 % (n = 78 à 589). Peu de changement, pas de motif unique (la baisse correspond plutôt à une phase de force, la hausse à une phase d'endurance : non vérifié).

## 6. Durée des programmes (semaines déclarées, médiane ; p25 - p75)
2 j : 8 (4-12) ; 3 j : 8 (4-12) ; 4 j : 9 (6-12) ; 5 j : 8 (6-12) ; 6 j : 10 (6-12). Très peu de différence selon les jours ; 12 semaines est une borne fréquente (p75 partout).

## Limites
- Biais salle et bodybuilding, programmes écrits par des coachs / utilisateurs de l'appli d'origine, pas de débutants mesurés ; étiquettes d'objectif multiples ; **aucun résultat, aucune blessure : rien ne dit qu'un volume ou une composition est efficace ou sûr**. Ordres de grandeur de ce que font les programmes publiés, rien de plus.
- Classement des séances approximatif (« jambes » regroupe bas du corps entier ; les rowings comptent pour le dos via trapèzes / rhomboïdes ; les types « autres » cachent des splits classiques). Séries comptées sur le muscle principal seulement : sous-estime les triceps / biceps / épaules (travail indirect) et le dos / fessiers selon les règles de nom.
- Semaine 1 seule, hors décharges de début ; la clé de programme (titre + date) peut fusionner deux programmes identiques.
- Usage prévu : D25 / générateur, comme ordres de grandeur montrés à `coach` ; toute valeur reprise dans le code passe par `knowledge/` avec son vrai statut (règle 10).
