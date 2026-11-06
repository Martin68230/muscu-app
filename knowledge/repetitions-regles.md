# Répétitions, séries, repos, réserve : règles par rôle, objectif et niveau
Rédigé le 05/11/2026 par `coach` (tâche demandée par l'utilisateur : « 20 exercices sur 22 sont à 10-15 répétitions »). **Statut global : validé par kiné sous réserve du relecteur (relecture kiné du 05/11/2026 ; le contrôle `relecteur`, un seul passage pour le lot, se fera une fois à la fin du lot ; les valeurs sport restent PROVISOIRE ou NON SOURCÉ comme marqué).** Codé : `src/generator/config.ts` (REPS_TABLE, D_CLASS, D4_FICHES, D4_FICHE_DOSE, D4_NEVER), `reps.ts`, `dose.ts` ; progression : `src/session/progression-config.ts`, `adaptation.ts`.
**[kine 05/11/2026] Modifications de la relecture sécurité** : repérées par la mention « [kine] » dans le texte. Aucune protection existante n'a été baissée ; les changements ne font que durcir (réserve, répétitions minimales, niveaux autorisés, durées).
Légende : OK = principe lu dans une source (voir §7) ; PROVISOIRE = choix à l'intérieur de ce que les sources permettent ; NON SOURCÉ = choix de conception.

## 1. Constat : ce que fait le code aujourd'hui
- `src/generator/config.ts` : `DOSE[famille][niveau]` ne connaît que 3 familles (muscle, force, santé) et le rôle `pilier` / `autre`. Toute variante non chargeable (poids du corps, élastique, suspension, chaise) prend `repsBodyweight = [10, 15]`, quels que soient l'objectif, le niveau et la difficulté de la variante. Les variantes chargeables « autres » prennent `repsCharge` (8-12 ou 10-12 ou 10-15) ; seuls les piliers chargeables de la force intermédiaire / avancée ont 4-6.
- Conséquence : dans les 6 exemples de `docs/programmes-exemples.md`, la grande majorité des lignes sont à 10-15 (poids du corps, élastique, suspension) ; l'isolation, l'accessoire et le pilier au poids du corps ont la même fourchette ; la force débutante au poids du corps est à 10-15 comme la santé.
- `TEMPS` (gainage 20 s / 30 s, porté 30 s / 40 s, anti-rotation et rotation par côté) et `FIXED_DOSE` (lancers, roue, rollout : 6-8, planche cercles 5-8 par côté) existent déjà et restent valables (§5). `DOSE_LIMITS` (D32) ne fait que baisser : il reste prioritaire (§6).
- Pas de famille « endurance » ni « sport » dans `DOSE` : le sport suit aujourd'hui « muscle » (programmes-v3.md) ; « perte de gras » = « muscle » (V-OBJ 1.3).

## 2. Les rôles (à créer dans le code ; aujourd'hui `pilier` / `autre` / `tronc` / `fonctionnel`)
| Rôle | Définition | Exemples |
|---|---|---|
| `pilier_lourd` | mouvement composé principal du jour : dans le code, emplacements `jambes_genou` et `poussee_1` seulement ; `tirage_1` et `charniere` suivent la ligne accessoire (lecture plus prudente, alignée sur le code le 05/11/2026) ; variante où la charge se règle finement ; 3 séries au plus pour un pilier chargé | squat, développé couché, rowing barre, soulevé de terre roumain, traction |
| `accessoire` | composé secondaire ou mouvement unilatéral de base, charge moins critique | fente, développé épaules, rowing haltère, tirage vertical élastique |
| `isolation` | une seule articulation, un seul muscle | curl, extension triceps, élévation latérale, mollets, écarté, tirage au visage |
| `gainage_duree` | maintien isométrique, noté en secondes | planche, gainage en creux, planche latérale |
| `porte_duree` | portés, secondes ou distance | marche du fermier |
| `dynamique_tronc` | gainage en répétitions, lent | dead bug, bird-dog, pallof, relevé de jambes |
Le rôle est porté par la fiche (champ à ajouter) ou déduit de l'emplacement + du nombre de muscles principaux ; à décider avec `dev`.
**[kine 05/11/2026] Lecture codée, CONFIRMÉE : `pilier_lourd` = `jambes_genou` et `poussee_1` seulement. `tirage_1` et `charniere` sont dosés en `accessoire` (plus de répétitions, moins de charge relative : plus prudent, surtout pour le soulevé de terre et le rowing barre, mouvements à technique exigeante). Cette ligne remplace la liste de la colonne « Définition » ci-dessus ; ne jamais élargir le pilier lourd à ces deux emplacements sans nouvel avis kiné.**
Isolation reconnue par préfixes d’identifiant (`ISOLATION_FICHE_PREFIXES`) : CONFIRMÉ (même effet : plus de répétitions, jamais moins de sécurité) ; à tester : aucune fiche à deux muscles principaux ou composée ne doit correspondre à un préfixe.
**La difficulté de la variante (échelon) est un second axe** (§4) : un « pilier » au poids du corps n'est pas dosé comme un pilier chargé.

## 3. Tableau lisible par le code
Format : `rôle | objectif | niveau | séries | répétitions | repos (s) | réserve de départ (RIR)`. Réserve : jamais 0 en v1 (SRC6, OK) ; pas de RIR demandé pour les durées. « 2-3 séries » est ramené à une valeur dans le tableau ; plafond de 3 séries par exercice (SRC1 : rendements décroissants au-delà de 2-3 séries par exercice, OK).
`perte_gras` = `muscle` sauf les lignes marquées PG. `sport` : base de force (les sauts et lancers ont leur dose fixe, FIXED_DOSE, et la borne ACSM puissance : charge 30-70 % du max, répétitions x séries <= 24, SRC1, OK).
`endurance` : n'existe pas comme objectif de l'app ; lignes prévues si l'utilisateur l'ajoute ; la source ne donne aucune prescription (SRC1 : « données insuffisantes ») : tout NON SOURCÉ.

```
# role|objectif|niveau|series|reps|repos_s|rir
# Décision de l’utilisateur (05/11/2026) : sport et endurance, niveau intermédiaire : réserve 3 (et non 2).
pilier_lourd|muscle|debutant|2|8-12|90-120|3
pilier_lourd|muscle|intermediaire|3|6-10|120-150|2
pilier_lourd|muscle|avance|3|5-10|150-180|2
pilier_lourd|force|debutant|2|8-10|120|3
pilier_lourd|force|intermediaire|3|4-6|180|2
pilier_lourd|force|avance|3|3-5|180-240 (code : 210, milieu, décision utilisateur 05/11)|2
pilier_lourd|sante|debutant|2|10-15|90|3
pilier_lourd|sante|intermediaire|2|8-12|90|3
pilier_lourd|sante|avance|3|8-12|90|2
pilier_lourd|sport|debutant|2|8-10|90-120|3
pilier_lourd|sport|intermediaire|3|6-10 (décision utilisateur 05/11 : PROVISOIRE, 5-8 seulement si kine confirme)|120-180|3
pilier_lourd|sport|avance|3|3-6|150-180 (code : 165, milieu, avis kine 05/11)|2
pilier_lourd|endurance|debutant|2|12-15|60|3
pilier_lourd|endurance|intermediaire|2|12-15|45-60|3
pilier_lourd|endurance|avance|3|12-15|45-60|2
accessoire|muscle|debutant|2|10-12|90|3
accessoire|muscle|intermediaire|3|8-12|90|2
accessoire|muscle|avance|3|8-12|90|2
accessoire|perte_gras|debutant|2|10-15|60-90|3
accessoire|perte_gras|intermediaire|3|10-15|60-90|2
accessoire|perte_gras|avance|3|10-15|60-90|2
accessoire|force|debutant|2|8-10|90|3
accessoire|force|intermediaire|2|6-10|90-120|2
accessoire|force|avance|3|6-8|120|2
accessoire|sante|debutant|2|10-15|60-90|3
accessoire|sante|intermediaire|2|10-15|60|3
accessoire|sante|avance|2|10-15|60|2
accessoire|sport|debutant|2|8-12|60-90|3
accessoire|sport|intermediaire|2|6-10|90|3
accessoire|sport|avance|3|5-8|120|2
accessoire|endurance|debutant|2|12-15|45-60|3
accessoire|endurance|intermediaire|2|15-20|45-60|3
accessoire|endurance|avance|3|15-20|45|2
isolation|muscle|debutant|2|12-15|60|3
isolation|muscle|intermediaire|3|10-15|60-90|2
isolation|muscle|avance|3|10-15|60|2
isolation|perte_gras|debutant|2|12-15|45-60|3
isolation|perte_gras|intermediaire|3|12-15|45-60|2
isolation|perte_gras|avance|3|12-15|45-60|2
isolation|force|debutant|2|10-12|60-90|3
isolation|force|intermediaire|2|8-12|60-90|2
isolation|force|avance|2|8-12|90|2
isolation|sante|debutant|2|12-15|60|3
isolation|sante|intermediaire|2|12-15|60|3
isolation|sante|avance|2|10-15|60|2
isolation|sport|debutant|2|10-12|60|3
isolation|sport|intermediaire|2|8-12|60-90|3
isolation|sport|avance|2|8-12|60-90|2
isolation|endurance|debutant|2|15-20|45|3
isolation|endurance|intermediaire|2|15-25|45|3
isolation|endurance|avance|3|15-25|45|2
# durees (secondes ; pas de RIR ; arret quand la position se degrade)
gainage_duree|tous_sauf_endurance|debutant|2|15-30 s|45-60|-
gainage_duree|tous_sauf_endurance|intermediaire|2|30-45 s|60|-
gainage_duree|tous_sauf_endurance|avance|2|30 s|60|-
gainage_duree|endurance|debutant|2|20 s|60|-
gainage_duree|endurance|intermediaire|2|30 s|60|-
gainage_duree|endurance|avance|2|30 s|60|-
# Aligné sur le code le 05/11/2026 (contrôle relecteur) : gainage 2 séries, 20 s débutant puis 30 s (TEMPS, config.ts), plafonné par la fourchette du niveau (HOLD_RANGE) ; la montée de durée (+5 s, adaptation-regles.md §9) part de là.
porte_duree|tous|debutant|2|20-30 s|60|-
porte_duree|tous|intermediaire|2|30-40 s|60|-
porte_duree|tous|avance|3|30-45 s|60|-
dynamique_tronc|tous|debutant|2|6-10 (par cote si unilateral)|60|-
dynamique_tronc|tous|intermediaire|2|8-12 (par cote si unilateral)|60|-
dynamique_tronc|tous|avance|2|10-15 (par cote si unilateral)|60|-
```
Règles de lecture :
- **Avancé, réserve 1** : uniquement sur machine / poulie (déjà `rirSafeVariants`), jamais sur un pilier barre ni une fiche `NO_FAILURE_FICHES` ni une surface instable (`UNSTABLE_TAGS`) ; pour les autres, 2. Jamais 0. **Les tableaux ne donnent que le point de départ : la réserve ne descend pas sous la valeur de la ligne avant 4 semaines d'entraînement régulier.**
- **[kine] Répétitions basses (<= 5)** : réservées aux niveaux intermédiaire (force 4-6 seulement) et avancé, sur des mouvements dont la fiche l'autorise et à charge réglable finement ; jamais pour un débutant (la ligne `pilier_lourd|force|debutant` passe de 6-8 à 8-10 : la technique n'est pas encore stable). Jamais de série <= 5 répétitions sur une fiche marquée « technique » (soulevé de terre, good-morning, arraché, etc.) sans la fiche qui l'autorise explicitement ; sinon on reste à 6 ou plus.
- **[kine] Reprise après arrêt (>= 3 mois) : règle PROPOSÉE, NON SOURCÉE, à trancher. Décision de l'utilisateur (05/11/2026) : aucune règle d'âge ; la reprise s'appuie sur le bloc reprise qui existe déjà dans le profil (reprise douce, `seance-manquee-v1.md`), sans nouveau champ** : traiter comme niveau débutant pendant les 4 premières semaines (réserve 3, 2 séries, aucune ligne <= 5 répétitions, aucune classe D4), puis retour au niveau déclaré. Jamais plus strict que ce que le niveau déclaré impose déjà ; ne jamais ouvrir un droit en plus.
- **[kine] Fatigue de la forme** : au-delà de 12 répétitions, les mouvements techniques à barre ou à haltère lourd (squat barre, soulevé de terre, good-morning, rowing barre, hip thrust barre) sont plafonnés à 12 ; les lignes « endurance » 12-15 du pilier ne s'appliquent qu'aux variantes machine, poulie, poids du corps ou haltères légers. Si la forme se dégrade en cours de série, on arrête la série (pas besoin d'atteindre le haut de la fourchette).
- **Plafond de répétitions pour les charges libres : 15** (20 en endurance sur accessoire / isolation seulement) : l'estimation de la réserve devient peu fiable au-delà de 12 répétitions (SRC7, OK) et les barres lourdes à 15+ répétitions fatiguent la technique (NON SOURCÉ).
- **[kine 05/11/2026] Repos, règle codée** : par défaut le bas de la fourchette du tableau (durée de séance), SAUF pour un pilier dont le haut de la fourchette de répétitions est <= 6 (force intermédiaire 180 s : valeur unique, déjà au milieu de la pratique 3 min ; force avancé 210 s ; sport avancé 165 s) : milieu de la fourchette au moins, jamais le bas (charge lourde, forme qui se dégrade avec un repos trop court). Un repos plus long ne baisse aucune protection.
- **[kine 05/11/2026] Sport et endurance, intermédiaire** : réserve 3 CONFIRMÉE (plus prudent que 2). Pilier sport intermédiaire : 6-10 PROVISOIRE GARDÉ ; la fourchette 5-8 n’est PAS confirmée (aucune source ne donne de fourchette ; 5-8 à réserve 3 suppose une charge relative plus haute sans gain de sécurité).
- **Repos** : plus long sur le pilier (>= 2 min) que sur l'isolation (SRC4 : 3 min > 1 min sur force et épaisseur musculaire de la cuisse chez des hommes entraînés, mais SRC1/ACSM : pas de différence sur la force entre < 1 min et > 1 min ; la valeur reste donc un choix PROVISOIRE).
- **Perte de gras** : l'effet du repos court ou des répétitions plus hautes sur la perte de gras n'est pas sourcé ; les lignes PG (répétitions un peu plus hautes, repos plus court sur accessoire et isolation) sont des choix de temps de séance, NON SOURCÉ. Les piliers restent comme « muscle » (garder la force pendant un déficit : NON SOURCÉ, non lu).
- **Séances : au plus 3 séries par exercice** ; le volume hebdomadaire vient du nombre d'exercices (>= 10 séries par muscle et par semaine pour l'hypertrophie, SRC1 : OK).

## 4. Variante non chargeable : la fourchette dépend de l'échelon, pas seulement du rôle
Chaque variante a un échelon (1 = plus facile). On la classe par difficulté **relative au niveau de la personne** (au départ : celle qui fait que la fourchette est atteignable à la réserve cible).
| Classe | Exemples | Répétitions de départ | Séries | Repos (s) | Réserve |
|---|---|---|---|---|---|
| D1 très facile | pompe au mur, assis-debout mains sur les cuisses, élastique très léger | 12-20 | 2 | 60 | 3 |
| D2 standard | pompe sur genoux, fente arrière, rowing élastique | 8-15 | 2-3 | 60-90 | 2-3 |
| D3 difficile | pompe, traction assistée, pompe pieds surélevés (aucune fiche « pistol » n'existe aujourd'hui) | 5-10 ([kine] débutant : 6-10 seulement avec une variante assistée ; jamais D3 en première séance) | 3 ([kine] 2 pour le débutant) | 90-120 | 2 ([kine] 3 pour le débutant) |
| D4 très difficile | nordique des ischios, pompe en équilibre, pompe à un bras, traction à un bras (pistol : aucune fiche aujourd'hui ; les règles « pistol » ci-dessous attendent sa fiche). Décision de l'utilisateur du 05/11/2026 : pompe et traction à un bras réservées aux avancés (pompe : 2-3 séries de 4-8 par côté ; traction : 1-5 par côté, assistée ou avec élastique ; réserve 3 au moins ; exclues en grossesse, post-partum, gêne au poignet, au coude ou à l'épaule). Tant que le garde-fou « 2 séances au haut du D3 voisin » n'est pas codé, TOUTES les D4 restent jamais proposées (`D4_NEVER`) | 2-5 (par côté si unilatéral) | [kine] 2 au plus (nordique et pompe en équilibre : limite de code `maxSets` 2 déjà en vigueur) | 120-180 | [kine] 3 (jamais d'échec ; jamais de réserve 2) |
- **[kine] D4 : réservé au niveau avancé** (jamais débutant ni intermédiaire), uniquement après 2 séances consécutives en haut de fourchette du D3 voisin à la réserve cible, sans douleur, et avec la limite de fiche (« volume faible au départ », « jamais sans pompe piquée maîtrisée » pour la pompe en équilibre). Pas de D4 pendant une reprise douce (bloc reprise du profil), ni avec grossesse / post-partum, ni avec une zone sensible concernée (épaule, coude, poignet pour les poussées ; ischios, genou pour la nordique et le pistol). Pistol : seulement avec appui à portée de main (mur, montant de porte stable, chaise stable) ; arrêt dès que le genou rentre vers l'intérieur ou que l'équilibre se perd.
- **[kine] D1/D2 en haut de fourchette** : les répétitions 15-20 de la classe D1 ne s'appliquent qu'aux mouvements simples et stables ; si la forme se dégrade avant le haut de la fourchette, la série s'arrête.
### [kine 05/11/2026] Garde-fou D4 : tableau « D4 -> D3 voisin » (à coder par `dev`)
Critère unique pour ouvrir une D4 : 2 séances valables CONSÉCUTIVES de la fiche voisine, toutes les séries de travail au HAUT de la fourchette, à la réserve cible de la classe D3 (2) ou mieux, séance complète, sans douleur ni gêne déclarée dans les 2 dernières séances sur la zone, sans arrêt sur un symptôme ; niveau avancé, hors reprise douce, hors grossesse / post-partum. Le droit n’est pas permanent : il se referme dès qu’une douleur ou un gel touche la zone, ou en reprise douce. Un échelon du haut de la fiche voisine (le plus haut échelon autorisé pour la personne). Choix de coach / kiné, NON SOURCÉ (aucune source ne définit un « prérequis » chiffré pour ces mouvements).
```
# d4|fiche D3 voisin (id)|variante qui compte|remarque
nordique-ischios|curl-ischios-serviette|curl-ischios-serviette-une-jambe (echelon 2)|la fiche nordique garde niveau_min intermediaire dans son texte, mais le code l'ouvre aux avances seulement (plus strict : on garde le plus strict)
pompe-equilibre-mur|pompe-piquee-pieds-sureleves|variante de plus haut echelon de la fiche|chaine de la fiche : pompe-piquee -> pompe-piquee-pieds-sureleves -> pompe-equilibre-mur-pieds ; la fiche exige deja « pompe piquee pieds sureleves maitrisee »
pompe-un-bras|pompe-archer|variante de plus haut echelon de la fiche|chaine de la fiche : pompe-sol -> pompe-archer -> pompe-un-bras-chaise -> pompe-un-bras-sol ; l'echelon 1 (chaise) compte aussi comme voisin de l'echelon 2 (sol) : sol seulement apres 2 seances au haut de la chaise
traction-un-bras|AUCUN (la fiche traction-un-bras n'existe pas)|voisin futur : traction-barre (supination ou pronation, echelon 3-4)|D4_NEVER reste actif tant que la fiche n'est pas ecrite par kine, relue (relecteur) et qu'un voisin n'est pas fixe ; « haut de fourchette » = 10 repetitions a reserve 2 (TRACTION_RULE)
```
- **[kine] Validation des doses D4 de l’utilisateur (05/11/2026)** : (a) pompe à un bras : 4-8 par côté ACCEPTÉ, mais **plafonné à 2 séries** (et non 2-3) : 3 séries par côté font 6 séries de charge maximale sur poignet, coude et épaule ; le D3 « 2 au plus » du [kine] reste ; réserve 3 minimum, même nombre de répétitions des deux côtés (celui du côté faible), arrêt dès que le bassin tourne ou que le poignet ou l’épaule fait mal. `D4_FICHE_DOSE[pompe-un-bras].maxSets` : 3 -> 2. (b) traction à un bras : 1-5 par côté ACCEPTÉ, 2 séries, réserve 3 minimum, assistée ou à l’élastique seulement ; pas de dose sans fiche (aucun code actif tant que D4_NEVER la contient). (c) Exclusions confirmées : grossesse / post-partum, reprise douce, gêne déclarée au poignet, au coude ou à l’épaule (dès le niveau 1) ; pour la traction ajouter le cou et le dos par prudence dans la fiche à venir. Avancés seulement.
- **[kine] Volume hebdomadaire de l’épaule** : les trois chefs du deltoïde se comptent ENSEMBLE (`VOLUME.deltoidPrefix`), plafond hebdomadaire 20 séries fractionnaires (principal = 1, secondaire = 0,5) pour tout le groupe. 28,5 au total (profil 6 avancé : antérieur 18 + les autres chefs) n’est PAS acceptable pour l’épaule d’un avancé : l’antérieur reçoit déjà du travail indirect de toutes les poussées ; cette limite reste PROVISOIRE (plafond NON SOURCÉ ; le seuil de 10 séries minimum est le seul chiffre sourcé, SRC1). Le dev vérifie que le plafond de 20 s’applique à la SOMME des chefs, et régénère l’exemple du profil 6 si le total dépasse 20.
- **Règle de montée** (load-calibration.md règle 5, inchangée) : haut de fourchette atteint à la réserve cible ou mieux sur 2 séances -> variante au-dessus, **qui repart du bas de SA fourchette**. **[kine] Un seul échelon à la fois ; jamais d'augmentation de charge et de changement d'échelon dans la même séance ; aucune montée (échelon, charge, répétitions) si une douleur ou gêne a été déclarée sur la zone dans les 2 dernières séances : on reste, ou on descend (règle de descente ci-dessous).** Sous le bas de fourchette 2 séances de suite (réserve respectée) -> variante en dessous. La fourchette n'est donc pas un « 10-15 partout » : c'est « 10-15 sur D2, 5-10 sur D3, 2-5 sur D4 ».
- **Objectif et niveau décalent le choix de l'échelon**, pas la fourchette : intermédiaire / avancé commencent à l'échelon le plus haut compatible avec leur niveau (V-ECHELON, program-logic.md §6.3), pas à D1.
- **Force sans charge** (V-MSG-FORCE) : on monte en D3 / D4 plutôt qu'en répétitions ; au-dessus de 15 répétitions en D1 / D2 pour un objectif force ou sport, on change d'échelon.
- Chaque fiche garde sa **fourchette de départ** écrite dans sa section « Repères de dosage » ; elle l'emporte si elle est plus restrictive (D32).
- Sources : tout NON SOURCÉ (classification par échelon = choix de coach) ; justification partielle : la fourchette de charge 30-100 % du max donne une hypertrophie comparable si l'effort est proche de l'échec (SRC1, SRC5), donc 2-5 répétitions en D4 ne sont pas « inutiles » pour la force, mais l'hypertrophie y est limitée par le faible nombre de répétitions : PROVISOIRE.

## 5. Unilatéral, durées, doses fixes
- **Unilatéral : la fourchette est PAR CÔTÉ** (« 8-12 par côté » = 8 à 12 de chaque côté). Séries : 2 séries = 2 par côté. Commencer par le côté le plus faible ; faire le même nombre de répétitions de l'autre côté (celui du côté faible). Durée de séance : x2 (déjà dans V-TEMPS). Chargeable : débutant >= 8 par côté, jamais moins de 6 par côté (équilibre : NON SOURCÉ) ; sinon mêmes lignes que le bilatéral de même rôle. D4 unilatéral : 2-5 par côté, avancé seulement (voir §4). **[kine] Stabilité : tout unilatéral debout (fente, soulevé de terre une jambe, montée sur marche, pistol) se fait avec un appui à portée de main pour le débutant ; la série s'arrête quand l'équilibre se perd ou que le genou rentre, pas au compte de répétitions ; on ne charge jamais plus lourd qu'à l'état de maîtrise du côté faible ; le côté fort ne dépasse jamais le nombre du côté faible.** Si une autre tâche ajoute un champ « unité par côté », il porte cette règle (unité `reps_par_cote`).
- **Durées (gainage) en secondes** : par côté pour la planche latérale (15-30 s / 30-45 s / 30-60 s selon le niveau, comme le gainage). Plafond 60 s : au-delà, on passe à une variante plus dure (levier plus long, bras ou jambe levés), jamais à 90 s ou plus. Pas de réserve demandée : on s'arrête quand la position se dégrade (NON SOURCÉ ; aucune source de durée lue). **[kine] Signes d'arrêt immédiats (indiqués à l'écran) : creux ou bosse du bas du dos, tremblements qui font perdre l'alignement, respiration retenue, douleur lombaire, de l'épaule ou du poignet. On ne cherche jamais le maximum ; une série s'arrête 3 à 5 secondes avant la dégradation, pas après. Le chiffre du haut de la fourchette n'est jamais une obligation ; les durées de la fiche ou de `TEMPS` plus courtes l'emportent.**
- **[kine] Grossesse / post-partum (P-GROS) : pas de maintien long avec blocage** : gainage et portés à 20 s au plus par série, souffle continu, 1-2 séries ; aucun gainage ventral prolongé au sol quand le ventre bombe ou pousse (apparition d'un renflement), aucun relevé de jambes ni exercice de type « dead bug » avec bascule du bassin sans fiche qui l'autorise ; aucune série lourde (<= 8 répétitions), pas de classe D3 ni D4, pas de réserve < 3. Les règles de la fiche et de `regles-securite-communes.md` (G4-G7) l'emportent.
- **Doses fixes (`FIXED_DOSE`)** : lancers 6-8, roue / rollout / genoux-poitrine ballon 6-8, planche cercles 5-8 par côté : conservées telles quelles (écrites dans les fiches, validées coach + kine).
- **Puissance / sauts** : hors de ce tableau (R-PLIO) ; borne ACSM : charge 30-70 % du max, répétitions x séries <= 24 (SRC1, OK).
- **Grossesse (P-GROS)** : l'emporte sur tout ce fichier (10-15 répétitions, réserve >= 3, 1-2 séries) ; inchangé.

## 6. Priorités (inchangées)
Fiche (`DOSE_LIMITS` : minRir, maxSets, noHeavyReps ; bloc « Repères de dosage ») > P-GROS > blessures / douleur (aucune progression si douleur) > ce tableau. Le tableau ne fait jamais monter une valeur au-dessus d'une limite de fiche. Blocage de la progression si douleur : inchangé (`kine`). **[kine] Douleur ou gêne déclarée : aucune montée, aucune fourchette basse ou lourde (<= 6 répétitions) sur la zone concernée, charge ou variante au niveau précédent, et conseil de consulter si elle persiste (voir les signaux d'alerte de `regles-securite-communes.md`). Ce tableau ne donne jamais de dose supérieure à ce que le profil blessures autorise.**

## 7. Sources et ce qui a réellement été lu (05/11/2026)
| Id | Source | Lu | Ce qu'elle dit d'utile ici | Niveau de preuve | Public | Statut |
|---|---|---|---|---|---|---|
| SRC1 | Currier B.S., Phillips S.M. et coll., ACSM position stand, Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823 (texte lu via Europe PMC le 05/11/2026, les 100 000 premiers caractères : abrégé, méthodes, tableaux 4 et 6) | oui (partiel) | Force : >= 80 % du max, 2-3 séries par séance ; hypertrophie : >= 10 séries par muscle et par semaine, 30 à 100 % du max équivalents ; puissance : 30-70 %, répétitions x séries <= 24 ; échec sans effet net ; repos court / long : sans effet sur la force, indéterminé pour l'hypertrophie ; endurance : données insuffisantes ; **aucune fourchette de répétitions ni durée de repos recommandée** | revue de revues (137 revues) | adultes sains >= 18 ans, novices et entraînés | OK |
| SRC4 | Schoenfeld B.J. et coll., « Longer Interset Rest Periods Enhance Muscle Strength and Hypertrophy in Resistance-Trained Men », J Strength Cond Res 2016;30(7):1805-1812, PMID 26605807 | résumé, 05/11/2026 | 21 hommes entraînés, 8 semaines, 3 x 8-12 RM : repos 3 min > 1 min pour la force (squat, développé couché) et l'épaisseur de la cuisse ; endurance locale du haut du corps identique | essai randomisé, petit | hommes jeunes entraînés | OK (n'établit pas une norme pour tous) |
| SRC5 | Schoenfeld B.J., Grgic J., Ogborn D., Krieger J.W., « Strength and Hypertrophy Adaptations Between Low- vs. High-Load Resistance Training », J Strength Cond Res 2017;31(12):3508-3523, PMID 28834797 | résumé, 05/11/2026 | 21 études, séries menées à l'échec : force maximale meilleure avec les charges > 60 % ; hypertrophie semblable entre charges <= 60 % et > 60 % | méta-analyse | adultes | OK |
| SRC6, SRC7 | Robinson et coll., Sports Med 2024;54(9):2209-2231 (réserve et gains) ; étude de précision de l'estimation de la réserve (program-logic.md §3) | non relus aujourd'hui (repris de program-logic.md, statut OK de ce fichier) | réserve jamais 0 ; estimation moins fiable au-delà de 12 répétitions | méta-régressions / étude | adultes | OK (repris) |
| D24 | docs/D24-kaggle-statistiques.md (base Kaggle « 600K », agrégats locaux) | oui | répétitions dans 9-12 : 49 % des lignes ; 6-8 : 22 % ; 13-15 : 12 % ; 1-5 : 9 % ; 16+ : 7 % | statistique d'usage, pas une étude | programmes en ligne, qualité inconnue | NON SOURCÉ (repère seulement : montre que 10-15 partout n'est pas l'usage, ne justifie aucune valeur) |
| - | ISSN, NSCA, OMS 2020 | **non lus dans cette session** (pages PubMed / PMC bloquées par vérification du navigateur ; Europe PMC a répondu) | - | - | - | non cités |
Valeurs du tableau §3 : fourchettes générales (30-100 % du max équivalents, 6-15 répétitions) = OK ; choix précis (6-10 pour pilier muscle intermédiaire, 3-5 force avancé, 15-25 isolation endurance, repos par ligne) = PROVISOIRE ou NON SOURCÉ comme indiqué ci-dessus ; classes D1-D4 = NON SOURCÉ.

## 8. Ce qui change par rapport à aujourd'hui (exemples de docs/programmes-exemples.md)
Légende : avant -> après (la charge ou l'échelon de départ décide du reste).
1. **Débutant, muscle, maison** : squat gobelet, développé au sol, rowing 2 x 10-12 -> pilier 2 x 8-12 (RIR 3) / rowing accessoire 2 x 10-12 (inchangé pour l'accessoire) ; pont fessier haltère 2 x 10-12 -> 2 x 10-12 ; développé épaules élastique 10-15 -> 10-12 ; tirage vertical un bras 2 x 10-15 -> 2 x 10-12 par côté ; fente arrière main au mur 10-15 -> 2 x 8-12 par côté ; gainage 2 x 20 s -> 2 x 15-30 s. Peu de changement : le débutant reste proche de 10-12.
2. **Intermédiaire, force, salle** : développé incliné barre 3 x 4-6 (inchangé) ; rowing barre 2 x 8-12 -> 2 x 6-10 (RIR 2, repos 90-120) ; développé épaules haltères 2 x 8-12 -> 2 x 6-10 ; tirage un bras élastique 10-15 -> 2 x 10-12 par côté (accessoire de petite charge) ; écarté (isolation) 8-12 -> 2 x 8-12 inchangé ; tirage au visage suspension 10-15 -> 2 x 8-12 / 12-15 selon l'échelon.
3. **Intermédiaire, perte de gras + cardio** : squat gobelet 3 x 8-12 -> 3 x 6-10 (pilier, repos 120-150) ; développé au sol 4 x 8-12 -> 3 x 6-10 (les séries en plus viennent de V-VOL, pas de cette table) ; rowing 4 x 8-12 -> 3 x 10-15 (ligne PG, repos 60-90) ; soulevé de terre roumain une jambe, poids du corps, main au mur 3 x 10-15 -> 3 x 8-12 par côté ; gainage 2 x 30 s -> 2 x 30-45 s.
4. **Intermédiaire, volley (sport), maison, élastique + chaise** : assis-debout mains sur les cuisses 2 x 10-15 : c'est une variante D1, trop facile pour un intermédiaire -> passer au bon échelon (fente, squat bulgare léger) en 2 x 6-10 par côté ; développé au sol élastique 10-15 -> 2 x 6-10 (accessoire sport, élastique plus dur) ; tirage au visage 10-15 -> 2 x 8-12 (isolation sport) ; bonjour poids du corps 10-15 -> 2 x 8-12 ; développé épaules alterné 10-15 -> 2 x 6-10 ; tirage un bras 10-15 -> 2 x 6-10 par côté ; fente arrière 10-15 -> 2 x 6-10 par côté ; gainage 2 x 30 s -> 2 x 30-45 s.
5. **Débutant, sans matériel** : assis-debout 2 x 10-15 -> 2 x 12-20 (D1, monter d'échelon au haut de la fourchette) ; pompe au mur 2 x 10-15 -> 2 x 12-20 (D1) puis pompe sur genoux 2 x 8-15 (D2) ; serviette, bonjour, tirage serviette 2 x 10-15 -> 2 x 8-15 ; fente arrière 2 x 10-15 -> 2 x 8-12 par côté ; gainage 2 x 20 s -> 2 x 15-30 s. Le changement principal : D1 plus haut, D2 plus bas, la progression passe par l'échelon.
6. **Avancé, 5 jours, salle** : développé incliné barre 3 x 8-12 -> 3 x 5-10 (RIR 2) ; rowing Pendlay 3 x 8-12 -> 3 x 6-8 (limite de fiche : charge légère à modérée, 2 à 3 séries) ; développé épaules un bras haltères 3 x 8-12 -> 3 x 8-12 par côté ; **traction 3 x 10-15 à réserve 1 -> 3 x 5-10 à réserve 2** ([kine] TRANCHÉ : jamais réserve 1 sur la traction, même pour l'avancé ; réserve 2 au minimum, 3 séries au plus ; au-dessus de 10 répétitions à réserve 2, on monte d'échelon (lest léger après 2 séances, ou tempo lent) et non en répétitions ; la traction lestée reste en `NO_FAILURE_FICHES`) ; écarté 3 x 8-12 -> 3 x 10-15 (isolation) ; tirage au visage suspension 3 x 10-15 -> 3 x 12-15 ; gainage 2 x 30 s -> 3 x 30-60 s.
Synthèse : **les lignes à 10-15 passent de ~20 sur 22 à 6-8 environ** ; les piliers sont à 5-10 selon le niveau et l'objectif, les accessoires 6-12, l'isolation 10-15, le poids du corps dépend de l'échelon (12-20, 8-15, 5-10, 2-5), les durées à 15-60 s.

## 9. À faire avant de coder (propositions pour `dev`, aucune modification faite)
- Ajouter la table `REPS_TABLE[role][objectif][niveau]` et la classe D1-D4 d'une variante (champ de fiche ou calcul par échelon) ; lire les fourchettes depuis ce fichier ou une copie validée.
- Introduire le rôle `isolation` / `accessoire` (aujourd'hui `autre`) et les objectifs `sport` et `endurance` dans `DOSE`.
- Garder `DOSE_LIMITS`, `FIXED_DOSE`, `TEMPS`, P-GROS prioritaires ; tests : aucune fourchette n'est jamais < limites de fiche.
- Validation : `coach` + `kine` sur les lignes force / sport / D4 / traction à réserve 1, puis `relecteur` en un passage.
