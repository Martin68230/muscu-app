# Revue coach des 6 programmes d'exemple, version régénérée (générateur v1.6, 31/10/2026)

Rédigé par `coach`, relu après le contrôle du `relecteur` et la correction D32 (docs/D32-bilan.md). Lecture seule : rien n'a été changé dans src/, knowledge/, les fiches ni les tests. **Les propositions d'assouplissement des supersets sont à valider par `kine`, puis à contrôler par `relecteur`.**

## Ce que l'utilisateur doit trancher
1. **Volley et sports de saut à 3 séances ou plus : 0 saut.** Veut-il des sauts dans le programme généré ? Si oui, il faut décider d'**appliquer R-PLIO** (pliométrie en tête de séance) à un programme généré : c'est aujourd'hui écrit pour « Créer une séance » seulement, ni écrit ni validé pour le générateur. Si oui, accepte-t-il que la force des jambes soit légère le jour des sauts (R-PLIO condition 11) ?
2. **Isolation (biceps, triceps, deltoïdes, mollets) en séances PUSH / PULL / LEGS** pour intermédiaire et avancé : D30 ne la place que dans CE / HAUT / BAS. L'étendre pour remplir les séances de 3 exercices ?
3. **Séances HAUT / BAS / PUSH / PULL courtes** (35 min pour 60 demandées ; 30 à 35 min pour 75) : garder le plafond de 10 séries par muscle et par séance (V-PLAF), ou autoriser plus d'exercices d'autres muscles ?
4. **Perte de gras** : cardio plus présent par défaut (2 séances ou blocs) ou garder l'option D31 (0 ou 1 séance de 30 min) ?
5. **Matériel de salle** : valider `machine` / `poulie` (Q10) pour que les fiches de salle soient écrites et que sac à dos, élastique et bosu disparaissent de la salle.
6. **Variété d'une semaine à l'autre (R3)** : priorité confirmée ?
7. **Supersets** : faire valider par `kine` les assouplissements du chapitre 8.1 (SUP-4 débutant n'est PAS proposé à l'assouplissement).

## 0. Comment lire ce document
- Entrées : docs/programmes-exemples.md (régénéré, supersets « Gagner du temps » activés), tools/demo-programmes-analyse.md, docs/D32-bilan.md, et les règles knowledge/structure-programmes.md, program-logic.md, core-et-supersets.md, cardio-regles.md (3.2ter, 5.1, 5.2, 5.2bis), sports.md, goal-resolver.md. J'ai relu canPair et pairEligible (src/generator/duration.ts, lecture seule) et vérifié trois fiches dans public/data/fiches.json.
- **Sources** : aucune nouvelle. Volumes : structure-programmes.md §3 (ACSM 2026 : seuil de 10 séries par semaine pour l'hypertrophie, 2-3 séries par exercice pour la force ; le reste est NON SOURCÉ ou PROVISOIRE). Tout jugement non appuyé est marqué **jugement de coach**.
- Verdict : bon / correct / faible.

## 1. Corrections par rapport à ma première version
- **Supprimé** : « profil 2 BAS-A : paire fente latérale + gainage attendue ». Faux : la fiche fente-laterale a une ligne dos = « adapter » dès le niveau 1, donc le refus est **conforme à SUP-2 point 4** (core avec un exercice dont la ligne dos n'est pas « garder »).
- **Supprimé** : « profil 4 : cause probable canPair inconnu = refusé ». Faux : la cause était l'ordre dans index.ts (formAllPairs appelé avant l'ajout des emplacements suivants). Corrigé en D32.
- **Corrigé** : « le temps gagné par les supersets n'est pas réinvesti » était inexact comme cause. Les séances HAUT / BAS / PUSH / PULL sont courtes parce que **tous les emplacements du type sont déjà remplis** (V-PLAF : 10 séries fractionnaires par muscle et par séance ; STR-REP-4). Il n'y a d'ailleurs qu'une paire dans les 6 programmes (5 min gagnées, profil 4 séance B).
- **Corrigé** : volumes des profils 4 et 5 (voir chapitres 4 et 5).
- **Corrigé** : R-PLIO est présenté comme une **décision à prendre**, plus comme un correctif prévu.
- **Corrigé** : « pompe 3 fois » (profil 4) : c'est la même fiche **2 fois** (séances A et B), la famille **4 fois** (pompe x2, pompe mains écartées, pompe piquée).

## 2. Contrôle des trois défauts de sécurité corrigés (D32), sur les exemples régénérés
| Défaut | Avant | Après (exemples régénérés) | Verdict |
|---|---|---|---|
| Squat sur bosu | RIR 1 | profil 6 LEGS-B : **RIR 2** | corrigé |
| Montée sur marche aux haltères légers | 3 x 4-6 | profil 2 BAS-B et profil 3 B : **3 x 8-12** | corrigé |
| Good morning (et rowing Pendlay) | 4 séries | profil 6 BAS-A : good morning **3 x 8-12** ; HAUT-A : Pendlay **3 x 8-12** | corrigé |

**Exercices dont la dose pourrait encore contredire la fiche** (relevé de ma lecture, à confirmer par `dev` / `coach`) :
1. **Profil 6 HAUT-A : « Tirage au visage (poulie haute avec une corde) » 3 x 8-12 en RIR 1.** La fiche face-pull-elastique contient « jamais jusqu'à l'échec » ; D32 lit « pas d'échec » comme réserve >= 2. Ici RIR 1 est affiché. Probable : la mention est propre à la variante élastique et ne vaut pas pour la poulie. **À confirmer** (si elle vaut pour la fiche entière, c'est un défaut résiduel).
2. **Profil 6 LEGS-B : montée sur marche (box plus haute) et poussée de hanches une jambe en RIR 1** ; PULL-B : traction et tirage élastique à un bras en RIR 1. La fiche montee-sur-marche demande de maîtriser l'échelon 1 ; aucune mention d'échec trouvée. Acceptable pour un avancé (**jugement de coach**), mais RIR 1 sur une jambe sur box haute est ma réserve principale.
3. La mention générique « 2 à 3 séries » des fiches qui recopient V-DOSE contredit V-VOL (jusqu'à 4) : déjà signalé par D32 (point 6), non codé.
Aucune autre contradiction relevée dans les 6 exemples.

## 3. Constats généraux
### 3.1 Décompte des séances avec sauts (0 pour le volley à 3 jours et pour la prise de muscle)
| Cas | Résultat | Conforme aux règles ? | Conforme à l'intention de l'utilisateur ? |
|---|---|---|---|
| Prise de muscle, avec ou sans option cardio | 0 | Oui : 3.2ter A (aucun saut ni course ajoutés automatiquement) | Oui |
| Volley, 3 jours de corps entier | 0 | Oui **à la lettre** : 3.2ter B (d) « si une condition manque, modérée sans saut » ; 5.1 (5) : pas de saut le jour, le lendemain, le surlendemain d'une séance à jambes lourdes | **Non** : la décision D31 voulait « un bloc de sauts légers » pour un sport de saut ; lundi, mercredi, vendredi sont tous à jambes lourdes, aucun jour ne passe |
| Volley, 2 jours de force | 1 | Oui | Oui |

**Pourquoi** : à 3 séances de corps entier ou plus, la règle des 48 h + 2 jours rend les sauts impossibles pour un sport à sauts. **R-PLIO (cardio-regles.md §5.1 (ii), §5.2bis) est écrit pour « Créer une séance »** : composer une séance de jambes avec sauts en tête à la demande. **L'appliquer à un programme généré n'est ni écrit ni validé** : c'est **une décision de l'utilisateur** (puis `coach` rédige, `kine` valide, `relecteur` contrôle), pas un correctif prévu. Si elle est prise, deux points à savoir (lecture de R-PLIO) :
- condition 3 (« jambes lourdes ni la veille ni l'avant-veille ») : avec lundi / mercredi / vendredi seul **le lundi** passe, soit une séance avec sauts par semaine (maximum fixé par 5.2) ;
- condition 11 : après les sauts, la force des jambes du jour est lente, poids du corps ou élastique léger, sans charge lourde ni échec. La séance du lundi serait donc une séance de jambes légères.
Autre voie, sans R-PLIO : libérer un jour sans jambes lourdes (séance HAUT à la place d'un corps entier pour les sports à sauts).

### 3.2 Supersets : combien, et est-ce le maximum permis par SUP-* ?
Après D32 : **2 paires en tout** (profil 2 HAUT-B-P1 ; profil 4 B-P1 pompe + tirage au visage). Les autres absences sont toutes expliquées par les règles ; je les ai revérifiées une par une :

| Profil | Paires | Maximum permis ? |
|---|---|---|
| 1, 5 (débutants) | 0 | Oui : SUP-4, aucun superset pour un débutant (confirmé `kine`) |
| 2 | 1 (HAUT-B) | Oui. HAUT-A : `poussee_2` est un développé vertical, interdit (SUP-0 pt 3). BAS-A : fente latérale a dos = « adapter », refus conforme à SUP-2 pt 4. BAS-B : `jambes_2` absente ou chargée |
| 3 | 0 | Oui : séance A `poussee_2` verticale ; séance B n'a pas de `tirage_2` ; séance C : `poussee_2` n'existe pas à 5 exercices |
| 4 | 1 (B) | **Oui** : A : `poussee_2` = développé épaules élastique (vertical), P3 refusée (fente arrière à ligne dos non « garder », SUP-2 pt 4) ; C : `poussee_2` = pompe piquée (verticale), P3 impossible (le tronc est un bûcheron CF3 : seules CF1 / CF2 sont admises) |
| 6 | 0 | Oui : PUSH / PULL sans paire ; HAUT-A `poussee_2` vertical ; BAS-A / LEGS-B : squat sur bosu et fentes chargées hors P3, matériel B1 |

Conclusion : **les supersets sont rares par construction (SUP-0 à SUP-10), pas par défaut du générateur.** Le seul levier restant est une décision de règle (chapitre 8.1). Pour un programme de salle ou pour un débutant, l'option « Gagner du temps » est sans effet ; l'app ne le dit pas (voir piste 10).

### 3.3 Durée demandée contre produite
Profil 2 : 35 min pour 60. Profil 6 : 30 à 50 min pour 75. Les autres sont proches de la demande. Cause : plafond de 10 séries fractionnaires par muscle et par séance (V-PLAF, SRC3 préprint, PROVISOIRE) et plafond d'emplacements (STR-REP-4). L'ajout s'arrête au premier emplacement qui dépasserait le plafond (STR-REP-3). Ce n'est pas un défaut au sens des règles, mais l'utilisateur qui demande 75 min recevra des séances de 30 à 40 min : **décision 3**.

### 3.4 Défauts transversaux (vérifiés sur la version régénérée)
- Échauffement (marche 2 min), mobilité (cheville-genou au mur, bras au mur) et retour au calme (étirement des fessiers) **identiques dans toutes les séances des 6 programmes**, y compris PUSH et PULL.
- Tous les exercices portent « étalonnage » : c'est la semaine 1 seulement.
- Aucune variété d'une semaine à l'autre (R3 non codée).
- Profil 3 : le texte d'explication dit encore « Cardio : pas assez de temps dans 45 min, il est retiré en premier » alors que la séance de cardio du dimanche existe (le message V-MSG-CARDIO-TEMPS, lui, est bien masqué depuis D32). Texte contradictoire résiduel.

### 3.5 Ce qui est bon
Messages honnêtes (pas de vrai tirage, épaules peu travaillées, achat le plus utile, volume sous 10) ; cardio du profil 3 conforme à D31 (30 / 33 / 36 / 25 min, 2 min lentes, jour sans jambes lourdes) ; jours non consécutifs ; fréquence >= 2 par grand muscle dans les 6 profils ; prévention de cheville dans les séances BAS.

## 4. Revue des profils

### Profil 1 : débutant, prise de muscle, 3 jours, maison (haltères + élastique) : **correct**
1. **Objectif / niveau** : 2 x 10-12 ou 10-15, RIR 3, repos 90 s (60 s pour le gainage) : conforme (V-DOSE, ACSM 2026 : au moins 2 séries). Volume par semaine (mon comptage) : quadriceps 10, dos 12, pectoraux 6, épaules 6 : dans 4-10 (§3.1) sauf le dos au-dessus. Fréquence 3, ordre piliers puis accessoires puis gainage, 40 min pour 45 : bons. Pas d'isolation : conforme à D30.
2. **Intéressant ?** Monotone : A et B partagent 5 exercices sur 8 ; tirage vertical élastique 3 fois, développé épaules 3 fois (assis x2, élastique x1). Poussée faible : 6 séries de pectoraux contre 12 de dos (**jugement de coach**).
3. **Supersets** : aucun, conforme à SUP-4.
4. **Cardio / sauts / mobilité** : aucun cardio ni saut, conforme. Mobilité identique à toutes les séances.
5. **Trois problèmes** : A / B presque identiques ; pectoraux 6 contre dos 12 ; échauffement et retour au calme génériques.

### Profil 2 : intermédiaire, force, 4 jours, salle (haut / bas) : **correct (limite faible)**
1. **Objectif / niveau** : structure HAUT / BAS conforme (§2.3) ; pilier 3 x 4-6, repos 180 s, RIR 2 : conforme à l'esprit force (ACSM 2026). Mais **un seul pilier lourd par séance** : le dos n'est jamais lourd (rowing 8-12, traction 10-15), un seul squat lourd par semaine ; **jugement de coach**. Volumes : pectoraux 7, dos 10, quadriceps 8 à 10 : dans 6-12. Durée : **35 min pour 60**.
2. **Intéressant ?** Peu répétitif (0 à 1 exercice commun). Mais en salle : **deux développés au-dessus de la tête dans HAUT-B** (haltères debout puis sac à dos) ; tirage vertical à l'élastique (HAUT-A, HAUT-B) sans fiche de poulie ; développé couché « au sol » dans une salle qui a un banc ; BAS-B enchaîne soulevé de terre, squat avant et roumain (fatigue lombaire, **jugement de coach**) ; le lancer contre un mur est 4e de BAS-A alors que program-logic.md §10 le place en début de séance.
3. **Supersets** : 1 paire (HAUT-B : développé couché haltères + rowing buste penché haltères), maximum permis (chapitre 3.2). Charge figée à la charge de départ (SUP-0 pt 2) : peu utile pour la force (**jugement de coach**).
4. **Cardio / sauts** : aucun, conforme. La montée sur marche est maintenant en 8-12 (corrigé).
5. **Trois problèmes** : séances courtes (35 sur 60) ; exercices « maison » en salle ; aucun travail lourd du dos et puissance placée en milieu de séance.

### Profil 3 : intermédiaire, perte de gras, cardio secondaire, 3 jours, séance de cardio ajoutée : **correct**
1. **Objectif / niveau** : 3 x 8-12, RIR 2, 45 min pour 45 : conforme à goal-resolver.md (maintien du volume de force). Pectoraux 9 et dos 9 : sous 10, **dit honnêtement** (V-MSG-VOL). Squat sumo au poids du corps en 4 x 10-15 alors que des haltères existent : choix faible.
2. **Intéressant ?** Variété correcte (2 exercices communs entre A et B). Chaque séance oublie un schéma, la semaine les couvre.
3. **Supersets** : 0, maximum permis (chapitre 3.2).
4. **Cardio** : 30 min le dimanche, marche rapide, semaines 30 / 33 / 36 / 25, 2 min lentes : **conforme à D31 (3.2ter A)**. Maigre pour la perte de gras (150-300 min conseillées par l'OMS, le message l'indique) : **décision 4**. Texte résiduel contradictoire (chapitre 3.4).
5. **Trois problèmes** : cardio de 30 min par semaine ; texte « cardio retiré » résiduel ; sumo au poids du corps avec haltères disponibles.

### Profil 4 : intermédiaire, volley, 3 jours, maison (élastique + chaise) : **faible**
1. **Objectif / niveau** : programme « forme » à 2 x 10-15, RIR 3 : **dose de débutant pour un intermédiaire** (famille forme, D32 ne l'a pas changée). Message honnête : « Les programmes par sport arrivent dans une prochaine version ». sports.md règles 3 et 4 (épaule OSTRC, réceptions, mollets et chevilles, équilibre) non appliquées. Volumes : quadriceps **10** (A 4, B 2, C 4), pectoraux 6 (8 avec la pompe piquée), dos 8 en tirages + 4 de tirage au visage. Durée 35 à 40 min pour 45.
2. **Intéressant ?** Répétitif : A et B partagent 4 exercices sur 7 ; tirage vertical élastique 3 fois ; **pompe : la même fiche 2 fois, la famille 4 fois** (pompe x2, mains écartées, piquée) ; développé épaules élastique 2 fois.
3. **Supersets** : **1 paire depuis D32** (B : pompe + tirage au visage), maximum permis (chapitre 3.2).
4. **Cardio / sauts** : séance de sport dimanche, 30 min, marche rapide modérée : conforme à 3.2ter B (d). **0 saut : conforme à la lettre, contraire à l'intention de l'utilisateur** (chapitre 3.1). La marche rapide n'a aucun lien avec le volley.
5. **Trois problèmes** : aucun contenu spécifique volley ; dose de débutant ; zéro saut.

### Profil 5 : débutant, sans matériel, 3 jours : **correct** (limité par les fiches)
1. **Objectif / niveau** : 2 x 10-15, RIR 3, repos 90 s : conforme. Volumes (mon comptage corrigé) : **quadriceps 12** (assis-debout x2, fente arrière, montée, squat sur chaise, fente avant), pectoraux 6, dos 12 en comptant les tirages et l'écartement de serviette. 35 à 40 min pour 45.
2. **Intéressant ?** Contraint par les fiches (§5 de structure-programmes.md : une seule fiche de pompe pour un débutant sans matériel) : **pompe au mur, la même fiche 3 fois**. Messages honnêtes (pas de vrai tirage, épaules peu travaillées, achat d'un élastique à ancrage de porte : 9 exercices de plus). Pas de pompe inclinée en progression (**jugement de coach**).
3. **Supersets** : aucun, conforme (SUP-4).
4. **Cardio / sauts** : aucun, conforme.
5. **Trois problèmes** : une seule poussée pendant 4 semaines ; exercices de remplacement peu exigeants ; 3 doses distinctes seulement.

### Profil 6 : avancé, 5 jours, salle : **faible**
1. **Objectif / niveau** : HAUT-A, BAS-A, PUSH-B, PULL-B, LEGS-B conforme à §2.3 ; 3-4 séries x 8-12, RIR 2 : conforme. Volumes : dos 15, quadriceps 12, pectoraux 8 à 10, ischios **9 (message V-MSG-VOL)**. **Aucun travail direct des bras, des deltoïdes latéraux ni des mollets** malgré D30. **Durée : 30 à 50 min pour 75** ; PUSH-B et PULL-B n'ont que 3 exercices (conforme à STR-REP-4, mais mince).
2. **Intéressant ?** PUSH-B : sac à dos en premier, puis développé au sol à un bras, puis développé épaules à un bras (deux verticaux, un horizontal, pas de triceps). LEGS-B : squat sur bosu (maintenant en RIR 2), aucun curl d'ischios. BAS-A : good morning en charnière principale (3 séries maintenant). HAUT-A : lancer de poitrine en 5e position. PULL-B : tirage vertical élastique à un bras en premier avec une barre de traction disponible. Chevilles : marche pointes / talons et élastique deux fois dans la semaine, qui remplacent des vrais mollets.
3. **Supersets** : 0, maximum permis.
4. **Cardio / sauts** : aucun, conforme.
5. **Trois problèmes** : séances PUSH / PULL de 3 exercices ; exercices gadgets en salle ; aucune isolation (bras, deltoïdes, mollets, ischios).

## 5. Les 5 problèmes principaux (version régénérée)
1. **Volley : programme « forme » à dose de débutant, 0 saut**, sans épaule, réception ni cheville (sports.md règles 3-4).
2. **Séances HAUT / BAS / PUSH / PULL courtes** (35 min pour 60 ; 30 à 35 min pour 75) : plafond de séries par muscle atteint, aucune isolation pour remplir.
3. **Salle : exercices « maison » ou gadgets** (sac à dos, élastique, bosu, double développé vertical) et fiches de machines absentes.
4. **Répétitivité** : A / B partageant 4 à 5 exercices sur 7-8, échauffement, mobilité et retour au calme identiques, aucune variété d'une semaine à l'autre.
5. **Perte de gras et cardio** : 30 min par semaine, et texte d'explication contradictoire résiduel (profil 3).

## 6. Pistes d'amélioration (priorité, coût, risque de sécurité)
| # | Piste | Coût | Risque | Décision |
|---|---|---|---|---|
| 1 | **Sauts pour les sports à sauts à 3 jours et plus** : **décision de l'utilisateur** d'étendre R-PLIO au programme généré (ou séance HAUT libérant un jour) ; puis rédaction `coach`, validation `kine`, contrôle `relecteur` | Moyen à élevé (règle à écrire, génération, durée, messages, tests) | Moyen (sauts, contacts plafonnés 40 / 60 / 80) | utilisateur |
| 2 | **Programme volley / sports spécifiques** : épaule (OSTRC : OK pour le hand, PROVISOIRE ailleurs), réceptions, mollets, chevilles, équilibre ; dose intermédiaire | Élevé (contenu sourcé) ; premier pas faible : fiches de prévention déjà écrites | Faible à moyen | coach + kine |
| 3 | **Isolation en PUSH / PULL / LEGS** pour intermédiaire et avancé, pour remplir les séances (n'entre pas dans la limite de 10 séries du pectoral ou du dos) | Faible à moyen | Faible (STR-ISO-4) | utilisateur (décision 2) |
| 4 | **Variété A / B et semaines (R3)** : piliers fixes, accessoires alternés (program-logic.md §7) | Moyen | Faible | utilisateur (décision 6) |
| 5 | **Fiches et filtre « salle »** : écrire les fiches de machines (P2), exclure sac à dos / élastique / bosu quand la machine ou la poulie existe | Moyen | Faible | utilisateur (décision 5) |
| 6 | **Doses plus variées** : principal lourd, accessoires 2 x 12-15, onde de charge sur 4 semaines ; intermédiaire en sport ne reçoit plus la dose débutant (l'ACSM 2026 ne prescrit ni fourchette de répétitions ni décharge) | Faible à moyen | Faible | coach |
| 7 | **Échauffement, mobilité et retour au calme adaptés à la séance** (épaules pour HAUT / PUSH / PULL, hanches et chevilles pour BAS / LEGS) | Faible | Faible | coach + kine |
| 8 | **Cardio de perte de gras plus présent** | Faible à moyen | Faible | utilisateur (décision 4) |
| 9 | **Texte résiduel profil 3** « cardio retiré » ; **dire quand « Gagner du temps » n'a aucun effet** (débutant, salle, séance déjà courte) | Faible | Nul | dev |
| 10 | **Confirmer le tirage au visage poulie en RIR 1** (chapitre 2) | Faible | Faible | dev + coach |
| 11 | **Pompe inclinée** en progression du débutant sans matériel | Faible à moyen (fiches) | Faible | coach + kine |

### 6.1 Supersets : ce qui peut être assoupli sans toucher à la sécurité (à valider par `kine`, NON SOURCÉ)
Je **ne touche pas** à SUP-4 (aucun superset pour un débutant, aucune donnée sur les débutants), SUP-3 (piliers, soulevés, squats chargés, au-dessus de la tête, techniques, sauts), SUP-0 pt 2 (matériel lourd), SUP-2 pt 4 et 5 (dos, zone adaptée, grossesse), SUP-6 (transition 15 s, repos de paire >= 60 s), SUP-8, SUP-9, SUP-10, ni à l'étalonnage séparé.
1. **Étendre P1 à `poussee_3` / `tirage_3`** quand ils sont horizontaux (HAUT-A) : question déjà posée par structure-programmes.md §4, mêmes conditions que P1. Risque faible.
2. **Paire « jambes accessoires poids du corps + tirage ou poussée accessoire à l'élastique »** (muscles sans recouvrement, SUP-1 PROVISOIRE pour ce cas ; pas deux exercices de jambes, schémas différents) : risque faible à moyen (fatigue des jambes en équilibre) ; limiter aux exercices avec appui, à valider par `kine`.
3. **Paire d'isolation** (biceps + deltoïde latéral, charge légère figée) : seulement si l'isolation est étendue (piste 3) ; épaule >= 1 exclut l'élévation latérale.
4. **Charge évolutive en paire** : aujourd'hui aucune hausse de charge en paire (T-D26-23). Option : progresser en répétitions puis proposer une hausse après deux séances sans douleur. Risque faible à moyen ; dernier choix.
5. **Débutant : ne pas assouplir SUP-4.** Un format court pour débutants serait une règle nouvelle (circuit à repos réduit) à instruire et à sourcer ; l'ACSM 2026 dit seulement que les circuits sont efficaces par rapport à l'absence d'entraînement.

## 7. Limites de cette revue
- Je n'ai pas relancé le générateur moi-même en dehors du script de démonstration ; les raisons des refus de paires viennent de canPair et du bilan D32.
- Comptages de séries par muscle faits à la main sur les exemples (principal 1, secondaire non compté) : ils peuvent différer de V-VOL de 1 à 2 séries.
- Aucune source nouvelle lue. Les mentions « jugement de coach » sont des choix de préparation physique, pas des faits sourcés.
