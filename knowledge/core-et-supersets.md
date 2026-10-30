# Core (tronc) et supersets : familles, fréquences, paires autorisées et interdites (D26 étape 2)

Rédigé par `coach` le 30/10/2026. Statut du fichier : **corrigé le 30/10/2026 après le verdict BLOQUANT de `relecteur` et l'avis de `kine` (§11), selon les décisions B1 à B4 du chef de projet ; `relecteur` ne recontrôle que les points corrigés**, puis `kine` pour les points restants de §6, puis `dev` pour le code. Classement des fiches : knowledge/famille-core-inventaire.md. Ce fichier ne contient aucun code. Il complète knowledge/generateur-v1.md (§2.2 emplacements, §3.3 V-TEMPS, §4.2 V-SUP, §6.0 V-PRIO) et ne contredit ni knowledge/regles-securite-communes.md ni knowledge/program-logic.md : en cas de désaccord, la sécurité (V-PRIO) l'emporte toujours.

Légende (CLAUDE.md règle 10) : OK = source lue au moins en résumé et qui dit bien cela ; PROVISOIRE = source indirecte ou lue seulement par extrait/résumé de recherche, ou extrapolation d'une source ; NON SOURCÉ = choix de conception prudent, à valider. **Rien de PROVISOIRE ou NON SOURCÉ n'est codé en dur sans validation de l'utilisateur et contrôle de `relecteur`.**

## 0. Sources réellement utilisées (honnêteté sur ce qui a été lu)
| Réf. | Source | Lien | Type, preuve | Public | Ce qui a été lu | Date de lecture |
|---|---|---|---|---|---|---|
| S-ACSM | Currier, Phillips et coll., ACSM Position Stand 2026, Med Sci Sports Exerc 58(4):851-872 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823 | revue de revues (137 revues) | adultes sains | texte complet lu lors de la correction de program-logic.md §0 (23/10/2026) ; **le texte ne traite pas du core en particulier** : « au moins 2 séries par exercice », tous les grands groupes au moins 2 jours/semaine, exercice prioritaire en début de séance | 23/10/2026 |
| S-OMS | OMS 2020, Bull et coll., Br J Sports Med 54(24):1451-1462, DOI 10.1136/bjsports-2020-102955 | DOI | recommandation officielle | adultes | résumé (déjà dans sources.md) : renforcement des grands groupes musculaires au moins 2 jours/semaine. **Le tronc n'y est pas nommé dans ce qui a été lu** | 21/10/2026 |
| S-SUP | Zhang, Weakley, Li, Li, Garcia-Ramos 2025, Sports Med, supersets, 19 études, 313 participants | https://eprints.leedsbeckett.ac.uk/id/eprint/11908 | méta-analyse | adultes | résumé : temps gagné sans baisse de volume ni d'adaptations ; paires agoniste-antagoniste maintiennent le volume ; deux exercices sur le même muscle : volume de charge en forte baisse | 21/10/2026 |
| S-TIME | Iversen, Norum, Schoenfeld, Fimland, Sports Med 2021;51(10):2079-2095, PMID 34125411 | https://pmc.ncbi.nlm.nih.gov/articles/PMC8449772 | revue narrative | adultes | recommandations pratiques (60 % du texte) : supersets adaptés à l'hypertrophie, **moins adaptés aux gros mouvements lourds, surtout pour les débutants**. **Source non vérifiable par le relecteur (page anti-robot), à confirmer** : ne pas la laisser comme OK dans generateur-v1.md (§8 de ce fichier) | 23/10/2026 |
| S-STAB | « An update of stabilisation exercises for low back pain: a systematic review with meta-analysis », BMC Musculoskelet Disord 2014, PMID 25488399 | https://pubmed.ncbi.nlm.nih.gov/25488399/ | méta-analyse | adultes lombalgiques | **titre et conclusion vus dans un résultat de recherche du 30/10/2026, article non lu en entier** : les exercices de stabilisation ne sont pas plus efficaces à long terme que les autres exercices actifs | 30/10/2026 |
| S-MCG | « The McGill Approach to Core Stabilization in the Treatment of Chronic Low Back Pain: A Review », medRxiv 2022, DOI 10.1101/2022.01.21.22269311 | https://www.medrxiv.org/content/10.1101/2022.01.21.22269311.full.pdf | **préprint non relu par les pairs**, 4 essais randomisés, qualité faible | lombalgie chronique | extrait de recherche seulement ; **non utilisé pour une règle**, cité pour dire que la preuve des « 3 grands » de McGill est faible | 30/10/2026 |
| S-SOC | Revue systématique de l'effet du core training chez les footballeurs (2023) : recommande 2 fois/semaine, séances d'au moins 15 min, au moins 4 semaines | lien non vérifié (vue dans un résultat de recherche) | revue systématique, population étroite | footballeurs | **extrait de recherche seulement** | 30/10/2026 |
| S-TMT | Méta-analyse du « trunk muscle training » chez des sportifs, Sports Med 2022 : effets petits à modérés sur la force maximale ; plus d'effet avec plus de 18 séances au total | lien non vérifié (extrait de recherche) | méta-analyse | sportifs jeunes et adultes | **extrait de recherche seulement** | 30/10/2026 |
| S-PROJ | knowledge/regles-securite-communes.md (R1-R4, G4-G7, S1-S3, U1), generateur-v1.md §3.3, §4.2, §6.0, §6.8 | fichiers du projet | règles du projet (leurs statuts propres) | — | lus | 30/10/2026 |

Conclusion honnête sur les sources : **aucune recommandation officielle ne chiffre le nombre de séances ou de séries de core par semaine pour un public général.** Les fréquences de §2 sont donc des choix de conception appuyés sur des repères indirects (S-OMS, S-ACSM, S-SOC, S-TMT) ; elles restent PROVISOIRE ou NON SOURCÉ. Aucune source lue ne montre qu'une famille de core est supérieure aux autres (S-STAB : pas de supériorité d'une forme d'exercice) : le projet **varie** les familles par prudence et diversité, pas parce qu'une preuve l'impose.

---

## 1. CORE : les 5 familles et leur rattachement aux schémas

Vocabulaire : « core » = tronc (abdominaux, obliques, transverse, érecteurs du rachis, carré des lombes, fessiers en soutien ; liste `MUSCLES` de tools/validate-fiches.mjs). GG5 « tronc » de generateur-v1.md §2.1 couvre aujourd'hui `gainage`, `anti_rotation`, `rotation`.

| Id | Famille de core | Exemples | Schéma actuel (SCHEMAS) | Remarque |
|---|---|---|---|---|
| CF1 | Gainage / anti-extension | planche, planche sur genoux, gainage creux, roue abdominale, rollout-ballon | `gainage` | Famille « stabilité » de taxonomie-schemas.md |
| CF2 | Anti-rotation | pallof, bird-dog, dead-bug, planche touche-épaule | `anti_rotation` | Même famille de liens que `gainage`, jamais reliée à `rotation` |
| CF3 | Rotation | rotation à la poulie ou à l'élastique, lancer rotatif léger, rotation russe | `rotation` | Plus sensible pour le dos : voir CORE-SEC-3 et §11 |
| CF4 | Flexion du tronc et flexion latérale (obliques) | relevé de buste court, relevé de jambes, planche latérale dynamique, flexion latérale | **aucun schéma dédié** : la planche latérale (maintien) est `gainage` ; les mouvements dynamiques n'ont pas de schéma propre | Voir CORE-FAM-1 et knowledge/famille-core-inventaire.md |
| CF5 | Extension lombaire / chaîne postérieure du tronc | extension au sol (« superman » lent), extension sur banc à 45°, bird-dog (déjà `anti_rotation`) | **aucun schéma dédié** : la charnière de hanche (`charniere`, GG2) travaille déjà la chaîne postérieure | Voir CORE-FAM-1 ; ne pas confondre avec GG2 |

**CORE-FAM-1 (NON SOURCÉ, choix de conception ; question D-CF TRANCHÉE par le chef de projet)** : le générateur reconnaît les 5 familles CF1 à CF5 par un **attribut facultatif de fiche `famille_core`** (valeurs : `gainage`, `anti_rotation`, `rotation`, `flexion`, `extension`), **sans ajouter de schéma** à `SCHEMAS` (les liens de progression de taxonomie-schemas.md ne changent pas). L'inventaire de toutes les fiches de core et la famille proposée pour chacune sont dans **knowledge/famille-core-inventaire.md** (25 fiches, dont 5 à trancher par `kine`). Tant que l'attribut n'est pas posé sur une fiche, `dev` utilise le schéma (`gainage` = CF1, `anti_rotation` = CF2, `rotation` = CF3). Une fiche sans `famille_core` et hors de ces trois schémas n'est jamais comptée comme core.

**CORE-FAM-2 (PROVISOIRE ; S-STAB, article non lu en entier)** : aucune famille n'est présentée comme « meilleure » ; l'explication de 2 lignes ne prétend pas qu'une famille prévient les blessures. Le texte affiché reste factuel (« un peu de tronc à chaque semaine »).

---

## 2. CORE : fréquence minimale par semaine

### 2.1 Principe
- **CORE-FREQ-1 (NON SOURCÉ ; le tronc n'est nommé ni par S-OMS ni par S-ACSM)** : au moins **2 séances par semaine** contiennent du core. Repères indirects seulement : S-OMS et S-ACSM demandent 2 jours/semaine pour les grands groupes (extrapolation au tronc), S-SOC recommande 2 fois/semaine (population étroite, extrait de recherche). Le plancher de **séances** vaut aussi pour 2 jours/semaine : les 2 séances ont du core.
- **CORE-FREQ-2 (NON SOURCÉ)** : plancher de **4 séries de core par semaine** (2 séries x 2 séances, cohérent avec « au moins 2 séries par exercice », S-ACSM, OK pour la musculation générale, appliqué ici au core : PROVISOIRE) et **au moins 2 familles différentes** dans la semaine (3 familles si 3 séances de core ou plus **dans la limite des familles admissibles pour le profil** : par exemple 2 avec le dos au niveau 2, sans erreur ; **sauf pour un débutant : 2 familles, CF1 et CF2, suffisent, avec une fiche différente à la 3e séance** : avis du kiné §11 point 2). **Le nombre de familles exigé est min(3, nombre de familles admissibles pour le profil et les séances concernées, nombre de séances de core)** ; en particulier, **si toutes les séances de core du profil sont « à charge lourde » au sens de CORE-ORD-4, 2 familles (CF1 et CF2) suffisent, sans erreur**. **Exemptions du plancher (B3, B4)** : grossesse et post-partum (aucun plancher, voir CORE-SEC-2) ; zone `dos` au niveau 2 (seules CF1 et CF2 restent : cible de familles réduite à 2, plancher de séances et de séries inchangé) ; profil sans fiche de core admissible (CORE-FREQ-3).
- **CORE-FREQ-3 (NON SOURCÉ, décision de conception du projet)** : **le core ne disparaît jamais d'une semaine, même courte.** Si le plancher n'est pas atteignable parce qu'aucune fiche admissible n'existe (matériel, blessure, grossesse), le générateur ne force jamais une fiche retirée (V-PRIO, §6.0 de generateur-v1.md : la sécurité l'emporte) et affiche un message **neutre** : « Le tronc est adapté à ta situation : pas d'exercice de tronc cette semaine. » (pas d'alerte, pas de diagnostic). Même message pour la grossesse et le post-partum quand aucune fiche n'est compatible (CORE-SEC-2).

### 2.2 Table du plancher et de la cible, par nombre de jours et par objectif
Les 4 objectifs sont les familles de generateur-v1.md §1.3 : `force`, `muscle` (prise de muscle), `cardio` (objectif cardio principal ou secondaire : le core s'ajoute au plan musculaire, cardio-regles.md), `sante`. Cases : séances avec core (plancher / cible), séries de core par semaine (plancher / cible).

| Jours | Répartition (program-logic.md §2) | force | muscle | cardio | sante |
|---|---|---|---|---|---|
| 2 | corps entier x2 | 2 / 2 ; 4 / 4 | 2 / 2 ; 4 / 4 | 2 / 2 ; 4 / 4 | 2 / 2 ; 4 / 4 |
| 3 | corps entier x3 | 2 / 2 ; 4 / 4 | 2 / 3 ; 4 / 6 | 2 / 2 ; 4 / 4 | 2 / 3 ; 4 / 6 |
| 4 | haut/bas x2 | 2 / 2 ; 4 / 4 | 2 / 3 ; 4 / 6 | 2 / 2 ; 4 / 4 | 2 / 3 ; 4 / 6 |
| 5 | haut/bas + push/pull/legs | 2 / 3 ; 4 / 6 | 2 / 3 ; 4 / 6 | 2 / 3 ; 4 / 6 | 2 / 3 ; 4 / 6 |
| 6 | push/pull/legs x2 | 2 / 3 ; 4 / 6 | 2 / 3 ; 4 / 6 | 2 / 3 ; 4 / 6 | 2 / 3 ; 4 / 6 |

- **CORE-FREQ-4 (NON SOURCÉ)** : cette table entière est un choix de conception. Le plancher est identique partout (2 séances, 4 séries) parce que rien dans les sources ne justifie de différencier le plancher par objectif ; la cible monte pour `muscle` et `sante` (le tronc fait partie du renforcement « santé », S-OMS extrapolé) et pour 5-6 jours (plus de séances disponibles). Le plafond de §3 s'applique toujours.
- **CORE-FREQ-5 (NON SOURCÉ)** : choix des séances qui reçoivent du core : (1) jamais deux séances de core sur deux jours consécutifs si l'on peut l'éviter ; (2) en haut/bas et push/pull/legs, commencer par les séances « bas » ou « legs », puis une séance « haut », puis « pull » ; (3) en corps entier, A puis C (ou toutes). Si la durée choisie est courte, voir §2.3.
- **Périmètre actuel du code** : generateur-v1.md ne produit que 2 et 3 jours (V-PER). Les lignes 4, 5 et 6 jours sont écrites pour la suite (phase 4 : haut/bas, push/pull/legs) et ne sont testables qu'à ce moment-là.

### 2.3 Quand le temps manque : quoi retirer, et dans quel ordre
Le code retire aujourd'hui le tronc en premier (docs/D26-etat-actuel.md). **Règle voulue (CORE-TPS-1, NON SOURCÉ)** : ordre de retrait quand la durée dépasse celle choisie (action 6 de §4.4 de generateur-v1.md), du premier retiré au dernier :
1. retour au calme facultatif, puis fonctionnel (emplacement 9), puis E2 mobilité ramenée à 1 fiche (l'échauffement E1 et E3 sur piliers ne sont jamais retirés : generateur-v1.md §4.3) ;
2. `jambes_2`, puis `tirage_2`, puis `poussee_2` (accessoires, emplacements 8, 7, 6) ;
3. **ensuite seulement** le core est **raccourci** (de 2 séries à 1 série, puis de 2 exercices à 1) dans les séances au-delà du plancher de §2.2 ;
4. enfin le core des séances au-delà du plancher peut être retiré ; **le plancher de séances avec core (2) et de séries (4 par semaine) est intouchable** : si la durée est trop courte même ainsi, afficher l'avertissement de durée de §4.4 plutôt que retirer le dernier core.
5. Les piliers (`jambes_genou`, `poussee_1`), `tirage_1` et `charniere` du noyau passent avant le core uniquement quand il reste moins que le plancher à placer ; ils ne sont jamais retirés pour sauver du core au-delà du plancher.
Choix des séances qui perdent leur core : les moins prioritaires de CORE-FREQ-5, en gardant l'alternance de familles (§3.3). En 3 jours avec rotation de l'ordre de retrait (generateur-v1.md §4.4 action 6) : le tronc retiré tourne, mais deux séances sur trois gardent le core.

---

## 3. CORE : dose par séance, ordre, alternance des familles

### 3.1 Séries, durées, répétitions
- **CORE-DOSE-1 (NON SOURCÉ)** : 2 séries par exercice de core. Repère indirect : S-ACSM dit « au moins 2 séries par exercice » pour la musculation générale ; le tronc n'y est pas nommé.
- **CORE-DOSE-2 (NON SOURCÉ, renvoi V-TEMPS de generateur-v1.md §3.3)** : gainage 20 s (débutant) / 30 s (autres) ; anti-rotation 6-8 / 8-10 répétitions par côté lentes ; rotation 8-10 / 10-12 par côté ; repos 60 s ; pas de réserve (RIR) demandée, consigne « arrête quand la position se dégrade ». Ce fichier ne change pas ces valeurs.
- **CORE-DOSE-3 (NON SOURCÉ)** : par séance, **1 exercice de core par défaut, 2 au maximum** (2 si la cible de §2.2 l'exige ou si la durée le permet) ; **au plus 6 séries de core par séance** et **12 par semaine** (prudence ; pas de source). Ces plafonds s'ajoutent à V-PLAF (24 séries de travail par séance).
- **CORE-DOSE-4 (NON SOURCÉ)** : pas de lest ni d'ajout de charge sur le core pour un débutant ; la progression passe par la durée de maintien ou un échelon plus difficile, via la structure de progression (load-calibration.md).

### 3.2 Place dans la séance
- **CORE-ORD-1 (NON SOURCÉ ; le principe « exercice prioritaire d'abord » est appuyé par S-ACSM, mais la règle appliquée au core ne l'est pas)** : le core se place **à la fin de la séance de musculation**, après les piliers, `tirage_1`, `charniere` et accessoires (generateur-v1.md §4.1 étape 4, déjà ainsi). Principe appuyé : exercice prioritaire d'abord (S-ACSM, OK). La règle « le core ne précède jamais un squat, un soulevé ou un développé lourd » est une prudence : fatiguer le tronc avant une charge lourde est évité, **sans source lue**.
- **CORE-ORD-2 (NON SOURCÉ)** : le core n'est jamais placé dans l'échauffement E2 ni avant un pilier. Un exercice d'activation léger (ex. bird-dog en échauffement) est une fiche `mobilite` ou une fiche d'échauffement distincte : il ne compte pas dans le plancher de §2.2.
- **CORE-ORD-4 (NON SOURCÉ, kiné ; définition codable de « séance à charge lourde »)** : une séance est dite « à charge lourde » si elle contient au moins un exercice :
  - **(a)** de schéma `squat`, `fente` ou `charniere` dont la variante choisie utilise au moins un matériel parmi `barre`, `barre_ez`, `disques`, `rack`, `kettlebell`, `lest`, `sac_de_sable`, `machine`, `poulie` (liste de B1) ;
  - **(b)** placé dans l'emplacement pilier `jambes_genou` ou `charniere` et dont la variante utilise au moins un matériel parmi `barre`, `barre_ez`, `disques`, `rack`, `kettlebell`, `lest`, `sac_de_sable` (**les haltères et le sac à dos ne comptent PAS comme lourds ici** ; `machine` et `poulie` sont déjà couverts par (a)) ; décision du chef de projet, qui limite (b) aux piliers réellement lourds ;
  - **(c)** de **rowing penché avec matériel chargé** : les fiches `rowing-barre-penche`, `rowing-pendlay-barre`, et toute fiche de rowing dont la variante choisie utilise un matériel de la liste de B1 (aujourd'hui aussi `rowing-barre-ez`, `rowing-sac-de-sable`) ; liste par identifiant à tenir à jour par `dev` (ajout du kiné, 2e passage : il fatigue les muscles du dos comme un soulevé ; NON SOURCÉ). Les rowings aux haltères (`rowing-buste-penche-halteres`) ne sont pas lourds au sens de CORE-ORD-4, mais restent exclus des paires avec du core (SUP-2 point 4).
  Dans une séance « à charge lourde », le core qui suit se limite à CF1 et CF2 ; **« maintien au plus 30 s » ne vise que les fiches de maintien** (gainage) ; **les fiches CF2 à répétitions** (bird-dog, dead-bug, pallof) sont limitées au nombre de répétitions de V-TEMPS (generateur-v1.md §3.3) et lentes ; arrêt dès que la position se dégrade ; ni CF3, ni CF4 dynamique, ni CF5, ni roue abdominale (`roue-abdos`, `rollout-ballon`). Voir §11 point 4.
- **CORE-ORD-3 (NON SOURCÉ)** : en cas de séance cardio le même jour (cardio-regles.md), le core reste après la muscu et avant le retour au calme.

### 3.3 Alternance des familles
- **CORE-ALT-1 (NON SOURCÉ)** : deux séances de core consécutives (dans l'ordre de la semaine) n'utilisent **pas la même famille** en exercice principal. Ordre de rotation par défaut : CF1, CF2, CF3, puis CF4 et CF5 si une fiche admissible existe, puis retour à CF1. Avec 2 jours : CF1 + CF2 (comme le code actuel). Avec 3 jours : CF1, CF2, puis CF3 (ou CF4/CF5 si CF3 est retiré par la zone, §11 ; pour un débutant et pour un dos au niveau 2 : CF1, CF2 puis retour à CF1/CF2 avec une fiche différente). Avec 4 à 6 jours : on poursuit la rotation sur les séances à core.
- **CORE-ALT-2 (NON SOURCÉ)** : la même fiche d'une famille revient d'une semaine à l'autre du bloc (progression mesurable, program-logic.md §7) ; seules les familles changent d'une séance à l'autre dans la semaine.
- **CORE-ALT-3 (NON SOURCÉ)** : pas plus d'un exercice de rotation (CF3) par séance, et jamais de CF3 chargé pour un débutant (§11 point 2 : en fait, aucun CF3 pour un débutant).

---

## 4. SUPERSETS

Rappel de ce qui existe (generateur-v1.md §4.2, V-SUP ; docs/D26-etat-actuel.md) : option « gagner du temps » (défaut non) ou durée dépassée ; paires fermées P1 `poussee_2`+`tirage_2`, P2 `tirage_1`+`poussee_2`, P3 `jambes_2`+`tronc` ; jamais `jambes_genou`, `poussee_1`, `charniere`, ni grossesse ou post-partum, ni exercice « sous plafond ». Les règles ci-dessous **resserrent** V-SUP, elles ne l'assouplissent jamais.

### 4.0 Ce qui peut être apparié (définition fermée, décision B1 du chef de projet)
**SUP-0 (NON SOURCÉ, décision de conception)** : un exercice n'entre dans une paire que si **toutes** les conditions suivantes sont vraies :
1. il occupe un emplacement **accessoire** : `poussee_2`, `tirage_2`, `jambes_2`, ou `tronc` (core) ; jamais un pilier (`jambes_genou`, `poussee_1`, `charniere`) ni son équivalent, ni `tirage_1` (emplacement du noyau, non accessoire) ;
2. la variante choisie n'utilise **aucun** matériel parmi `barre`, `barre_ez`, `disques`, `rack`, `kettlebell`, `lest`, `sac_de_sable`, `machine`, `poulie` ; restent donc admis : poids du corps, élastique, **haltères légers**. **« Haltères légers » est codable à la génération (R3)** : le membre de paire a une **charge fixe, la charge de départ du plan** ; aucune augmentation de charge n'est faite ni proposée tant que l'exercice est en paire (`proposeProgression` ne renvoie aucune hausse de charge pour un exercice en paire : test T-D26-23). **P3 est plus strict que SUP-0** : `jambes_2` y est sans haltères (poids du corps ou élastique : test T-D26-24) ;
3. il n'est pas de schéma `poussee_v` (aucun mouvement chargé au-dessus de la tête, haltères ou élastique : choix de prudence plus strict que B1, qui vise `poussee_v` avec haltères ; **confirmé par le kiné**, §11 2e passage point 5) ni `saut` ni `porte` ni `cardio` ;
4. le niveau de la personne n'est pas `debutant` (SUP-4) ;
5. aucune des conditions d'exclusion **statiques** de SUP-2 (points 1 à 6) n'est vraie à la génération ; **SUP-2 point 7 (étalonnage, retour après gêne) est dynamique, décidé par le lecteur de séance, et n'est pas évalué à la génération**.

**Effet de SUP-2 point 7 sur la durée (R4)** : à la première séance d'un exercice, les exercices neufs sont faits séparément (étalonnage), donc la durée réelle de la séance 1 peut dépasser la durée annoncée avec « gagner du temps ». Le lecteur affiche la durée de la séance 2 et des suivantes (paires appliquées) ; l'app le dit simplement une seule fois, avec ce texte à afficher (texte à fournir au codage, NON SOURCÉ) : « Cette première séance peut durer un peu plus longtemps : les exercices nouveaux sont faits un par un. Le temps gagné apparaît dès la séance suivante. »

### 4.1 Paires autorisées et paires interdites
**SUP-1 (OK pour le principe ; S-SUP)** : une paire est autorisée seulement si les deux exercices n'ont **aucun muscle principal commun** (antagonistes poussée/tirage, haut/bas, ou muscles sans recouvrement) : le volume est maintenu (résumé lu).

Paires autorisées (liste fermée, ordre d'essai) :
| Paire | Exemple | Condition supplémentaire |
|---|---|---|
| P1 poussée accessoire + tirage accessoire | pompe (ou développé incliné aux haltères légers) + tirage à l'élastique | SUP-0 pour les deux ; la poussée est horizontale ou inclinée (`poussee_h`) ; jamais `poussee_v` |
| P2 | **supprimée** : `tirage_1` n'est pas un emplacement accessoire (SUP-0 point 1) | à retirer du code (E5) |
| P3 jambes accessoire + core | fente ou squat au poids du corps ou à l'élastique + planche (CF1) ou bird-dog (CF2) | `jambes_2` **sans haltères** : poids du corps ou élastique seulement (« fente légère » avec haltères sort de P3 ; P3 est plus strict que SUP-0) ; **le core est le second exercice de la paire**, de famille CF1 ou CF2 seulement, jamais CF3, CF4, CF5 ni roue abdominale ; jamais pour un débutant |
| ~~P4~~ | abandonnée (décision du chef de projet) | ne pas coder |

**SUP-2 (NON SOURCÉ ; le point 1 est couvert par SUP-1, OK)** : paires **interdites** :
1. deux exercices avec un muscle principal commun (volume de charge en forte baisse : S-SUP, **OK**) ;
2. deux exercices de jambes (NON SOURCÉ, prudence : fatigue locale, équilibre) ;
3. deux exercices de la même famille de core (deux gainages en paire n'apportent aucun repos : NON SOURCÉ) ;
4. core + core, ou core avec un exercice qui charge fortement le dos (charnière chargée, rowing penché même léger, tout exercice dont la fiche a une ligne `dos` autre que `garder`) : le tronc fatigué dans une paire avec un mouvement qui le sollicite en stabilisation (NON SOURCÉ, prudence, **confirmé et élargi par le kiné**, §11 point 4) ;
5. tout exercice sous plafond de sécurité ou adapté par le profil (case `adapter`, `capped`, **dès le niveau 1** d'une zone), grossesse ou post-partum coché (NON SOURCÉ ; niveau 1 ajouté par le kiné) ;
6. une paire contenant un exercice de schéma `saut`, de cardio intense ou de schéma `porte` (NON SOURCÉ) ;
7. **étalonnage et retour après gêne (décision B2, NON SOURCÉ)** : la paire est **décidée à la génération** (statique, generateur-v1.md §4.2) ; mais le **lecteur de séance ne l'applique pas** si l'un des deux exercices est en étalonnage (première séance de l'exercice) ou en retour après gêne (nouvel étalonnage, R7). Les deux exercices sont alors faits **séparément**, chacun avec son repos normal, **sans message d'erreur** ; la paire est appliquée à la séance où aucun des deux n'est plus concerné. Raison : l'étalonnage par répétitions en réserve exige une série isolée et un repos libre.

### 4.2 Interdiction explicite sur les exercices lourds ou à risque et pour les débutants
**SUP-3 (NON SOURCÉ ; la réserve « moins adaptés aux gros mouvements lourds » vient de S-TIME, revue narrative dont la page n'est pas vérifiable par le relecteur : à confirmer ; la liste est un choix de prudence)** : sont **jamais** en superset, quels que soient l'objectif (y compris `force`), le niveau ou l'option « gagner du temps » :
- les piliers `jambes_genou`, `poussee_1` et `charniere`, et `tirage_1` (existant et B1) ;
- tout **soulevé de terre** (barre, trap bar, haltères, kettlebell) et tout **roumain chargé** ;
- tout **squat ou fente chargé** (haltères, barre, kettlebell, sac à dos, gilet lesté), y compris bulgare ;
- tout **développé ou poussée lourde** (barre, haltères au-delà de la charge légère de départ) ;
- tout mouvement **chargé au-dessus de la tête** (développé militaire, `poussee_v`, push press, overhead carry) ;
- tout exercice **technique** (snatch, clean, jerk, kettlebell swing, saut chargé) et tout exercice de niveau `avance` ou qui exige un partenaire ou un support de sécurité ;
- toute fiche de schéma `saut`.
**Définition codable (sans nouveau champ de fiche ; le champ `superset_interdit` n'est pas retenu)** : le test d'éligibilité de SUP-0 (emplacement accessoire, aucun matériel de la liste B1, pas de `poussee_v`, `saut`, `porte`, `cardio`) est **la** définition ; tout ce qui échoue à SUP-0 est interdit. La liste ci-dessus n'est que l'explication en clair et sert aux tests T-D26-07 et T-D26-08.

**SUP-4 (NON SOURCÉ ; l'orientation « débutants » s'appuie sur S-TIME, à confirmer ; l'interdiction totale est un choix de prudence)** : **AUCUN superset pour un débutant**, quels que soient l'exercice, la charge (poids du corps, élastique compris) et l'option « gagner du temps » (décision du chef de projet, **confirmée par le kiné**, §11 point 6). Le gain de temps d'un débutant passe par le nombre d'exercices, jamais par l'enchaînement. P1 et P3 sont fermées au niveau débutant. **Écart avec le code** : voir E7.

**SUP-5 (NON SOURCÉ)** : deux exercices **lourds** du même schéma ne sont **jamais** en superset ; en plus, **aucune paire ne contient deux exercices de même schéma** (poussée + poussée, tirage + tirage, squat + fente), même si leurs muscles principaux ne se recouvrent pas : le test « muscle principal commun » ne suffit pas (docs/D26-etat-actuel.md : cas non couvert).

### 4.3 Transition, repos, séries
- **SUP-6** : série de A, transition de **15 s**, série de B, puis repos de la paire = le plus long des deux repos de §3.2 de generateur-v1.md ; nombre de séries de la paire = le plus grand des deux (l'exercice qui en a moins saute ses dernières séries). **Statut : OK seulement pour « le volume est maintenu avec des paires agoniste-antagoniste » (S-SUP, résumé lu) ; la transition de 15 s, « le plus long des deux repos » et le minimum de 60 s sont NON SOURCÉ.** S-SUP rapporte une fatigue interne plus élevée en supersets : **ne jamais descendre le repos de la paire sous 60 s** (NON SOURCÉ, prudence).
- **SUP-7 (NON SOURCÉ)** : en superset avec un exercice de core à durée (gainage), la durée de maintien est celle de V-TEMPS ; le chrono de transition de 15 s démarre à la fin du maintien.

### 4.4 Douleur déclarée pendant un superset (lecteur de séance F5)
**SUP-8 (PROVISOIRE ; reprend R4 de regles-securite-communes.md et §6.8 point 2 de generateur-v1.md, qui sont PROVISOIRE)** : si la personne appuie sur « Ça fait mal » pendant l'exercice A ou B d'une paire :
1. **la paire est dissoute** : l'exercice en cause s'arrête, ses séries restantes sont annulées (comportement R4 existant) ;
2. l'autre exercice de la paire **n'est plus enchaîné en superset** ; le lecteur propose « Continuer seul » (séries classiques, repos de l'exercice) ou « Passer au suivant » ; aucune décision automatique. **Précision kiné** : si la zone déclarée est aussi une zone portée par la fiche de l'autre exercice (une ligne pour cette zone, quelle que soit la case), « Continuer seul » n'est pas proposé, seulement « Passer au suivant » (avec rappel de la version plus douce) ; si la douleur relève de R5 (poitrine, malaise, vertige, essoufflement anormal) ou de U1/S3, la séance entière s'arrête ;
3. **aucune progression** n'est proposée pour l'exercice en cause (R2/R4) ; pour l'autre exercice, la progression de la séance suivante est maintenue seulement s'il n'y a pas eu de douleur **et si sa fiche n'a pas de ligne pour la zone déclarée** ; sinon traité comme l'exercice douloureux (aucune hausse) ; en cas de doute, pas de hausse ;
4. `SetLog.pain = true` + zone demandée (facultatif), compteur « deux séances de suite » inchangé ;
5. le programme n'est pas régénéré en cours de séance ; à la séance suivante, la paire n'est reformée que si les deux exercices passent les filtres de §6 de generateur-v1.md et SUP-0 (un exercice devenu `capped` ou `adapter` sort du superset : SUP-2 point 5).
Signes d'arrêt R5/S/U1 : inchangés, la séance entière s'arrête (jamais seulement la paire).

---

## 5. Cas particuliers qui renvoient aux règles de sécurité existantes (sans les contredire)

### 5.1 Core : débutant, grossesse, post-partum, douleur lombaire
- **CORE-SEC-1 (NON SOURCÉ ; V-DOSE, V-TEMPS)** : débutant : plancher de §2.2 identique, mais seulement CF1 (variantes faciles : planche sur genoux, planche inclinée ; **pas de roue abdominale ni de rollout**) et CF2 (bird-dog, dead-bug) ; **aucun CF3 (même sans charge, même si la fiche a `niveau_min: debutant` : voir l'inventaire), aucun CF4 ni CF5 dynamique** (validé et durci par le kiné, §11 points 1, 2, 6) ; maintiens 20 s, respiration continue, jamais jusqu'à la perte de position. Le débutant a **1 série** par exercice de core **s'il est enceinte ou en post-partum** (G5) ; sinon 2 séries (CORE-DOSE-1).
- **CORE-SEC-2 (B4 ; texte unique ; renvoi à G4, G5, G7 de regles-securite-communes.md ; statuts : G4 PROVISOIRE, G5 OK/PROVISOIRE, G7 PROVISOIRE ; le reste est NON SOURCÉ, avis du kiné §11 point 3)** : grossesse ou post-partum coché :
  1. **AUCUN plancher de core** : CORE-FREQ-1/2 ne s'appliquent pas.
  2. On ne garde que les fiches de core dont la ligne `Grossesse` est `garder` ou `adapter` et qui sont de famille CF1 ou CF2 (aujourd'hui surtout bird-dog à maintien court). **Une fiche ne peut que restreindre davantage cette règle** : elle ne rétablit jamais CF3, CF4 ou CF5, retirées par le kiné pour tout le réglage (CF5 couché sur le ventre, tout exercice de core sans ligne `Grossesse` explicite).
  3. Plafonds G5 : 1 série par exercice pour une débutante, 2 sinon (remplace CORE-DOSE-1, V-PRIO). Pas de superset. Aucun impact (G7).
  4. Si aucune fiche de core n'est compatible : la séance n'a pas de core et l'app affiche le message neutre « Le tronc est adapté à ta situation : pas d'exercice de tronc cette semaine. » (message de CORE-FREQ-3). La phrase « jamais plus d'une séance sur deux sans core » **n'existe plus** dans ce cas.
- **CORE-SEC-3 (renvoi à R1-R4, regles-securite-communes.md ; R1-R3 NON SOURCÉ, R4 PROVISOIRE ; avis du kiné §11 point 1)** : zone `dos`. **Règle de précédence : la table par famille et par niveau ci-dessous PRÉVAUT sur les cases `garder`/`adapter` d'une fiche quand elle est plus restrictive ; à l'inverse, une fiche plus restrictive que la table (case `retirer`, ou `adapter` plus contraignant) PRÉVAUT sur la table.** Dans tous les cas on applique la plus restrictive des deux (confirmé par le kiné, 2e passage : une fiche ne rend jamais permis ce que la table retire). Le niveau 3 retire toute la zone (R3).

  | Famille | Niveau 1 | Niveau 2 | Niveau 3 |
  |---|---|---|---|
  | CF1 | garder ; `roue-abdos` et `rollout-ballon` retirés | maintien court (au plus 20 s), `capped` | retiré |
  | CF2 | garder | maintien court, `capped` | retiré |
  | CF3 | sans charge, amplitude réduite, 8 répétitions par côté au plus | retiré | retiré |
  | CF4 | version courte et lente, jambes pliées, sans lest | retiré | retiré |
  | CF5 | extension au sol courte et lente | retiré | retiré |

  Précisions (R7) : **CF3 niveau 1 « sans charge »** : si la fiche n'a pas de variante sans charge (`rotation-assise-ballon-lest`), elle est **retirée**. **CF1 dynamiques au niveau 2** : `planche-cercles-ballon`, `genoux-poitrine-ballon`, `planche-ballon`, `planche-bosu` sont **retirées** (seul le maintien statique sur appui stable reste : `planche`, `planche-laterale`, et leurs versions sur genoux) ; au niveau 1 elles sont gardées. NON SOURCÉ ; la ligne sur `planche-ballon` et `planche-bosu` (maintien instable) est à confirmer par `kine` au codage.
  Au niveau 2, le plancher de séances et de séries reste visé avec CF1 et CF2 (cible de familles : 2) ; niveau 3 : le plancher est suspendu pour les familles retirées, et si aucune famille ne reste, message « demande l'avis d'un professionnel » (§9 de generateur-v1.md) à la place du message neutre. Les signes S1-S3 et U1 sont inchangés.
- **CORE-SEC-4 (NON SOURCÉ)** : le plancher de CORE-FREQ-1/2 **cède toujours devant** un plafond de sécurité (V-PRIO, §6.0). Aucun test ne doit demander du core à un profil dont toutes les fiches de core sont retirées.

### 5.2 Supersets et sécurité
- **SUP-9 (NON SOURCÉ, existant)** : grossesse/post-partum coché : aucun superset. Zone au niveau 1 (case `adapter`), 2 ou 3 : l'exercice concerné (case `adapter`, `capped`) n'entre dans aucune paire ; l'autre exercice peut être apparié avec une autre fiche admissible seulement si la paire reste valide (SUP-0 à SUP-5).

---

## 6. Points pour `kine` : tous traités (2e passage de §11)
1. B4 / CORE-SEC-2 : confirmé (§11, 2e passage point 1).
2. Précédence table/fiche (CORE-SEC-3) : confirmée (point 2).
3. Fiches à trancher de l'inventaire : tranchées (point 3 ; famille-core-inventaire.md).
4. Fiches `niveau_min: debutant` de rotation : relèvement à `intermediaire` (point 4).
5. CORE-ORD-4 et exclusion de `poussee_v` : confirmés (point 5).

**À confirmer au codage (non bloquant)** : les CF1 dynamiques de niveau 2 (`planche-ballon`, `planche-bosu`, R7) ; la liste par identifiant des rowings chargés (CORE-ORD-4 c).

## 7. Contrôles automatiques à coder (propriétés vérifiables, résultat attendu)

Les identifiants T-D26-xx sont à reprendre dans les tests de `dev`. Contexte « programme généré » : sortie du générateur avec l'option « gagner du temps » activée sauf mention contraire. « Fiches admissibles » : après les filtres de §6 de generateur-v1.md. **Séance numérotée** : la séance 1 est la première séance de la personne (exercices neufs, étalonnage) ; **une paire n'est jouée par le lecteur qu'à partir de la séance 2** (SUP-2 point 7) ; les tests de paires jouées s'écrivent donc « séance 2 ». « Hors fiches d'échauffement » (T-D26-04) : tout exercice de schéma `mobilite` ou `cardio`, ou placé dans l'un des emplacements E1/E2/E3 de generateur-v1.md §4.3, n'est pas du core et n'est pas compté. **Fiche forcée par id** : le test impose la fiche (fixture) pour ne pas dépendre du classement de §6.7.

### 7.1 Profils exacts utilisés par les tests
Colonnes : « cible de séances de core » = cible de §2.2 pour (jours, objectif) ; « séances à charge lourde » = au sens de CORE-ORD-4 (a)(b)(c), recalculé avec la décision R1 (haltères non lourds pour (b)).

| Profil | Niveau | Objectif | Matériel | Jours | Durée | Autres réglages | Cible de séances de core | Séances à charge lourde (CORE-ORD-4) |
|---|---|---|---|---|---|---|---|---|
| PR-A | débutant | sante | maison : poids du corps, tapis, chaise, élastique | 2 | 30 min | aucun | 2 | jamais (aucun matériel de la liste) |
| PR-B | intermédiaire | muscle | salle complète (barre, rack, haltères, poulie, machines, banc) | 3 | 60 min | aucun | 3 | **dépend des fiches choisies** : forcer. Variante **PR-B-L** : `souleve-de-terre-barre` en `charniere` et `squat-arriere-barre` en `jambes_genou` dans les 3 séances = 3 séances lourdes ((a) et (b)). Variante **PR-B-H** : `squat-gobelet` en `jambes_genou` et `souleve-de-terre-roumain-halteres` en `charniere`, tirages sans barre = 0 séance lourde (haltères non lourds) |
| PR-C | intermédiaire | force | maison : haltères réglables, banc, élastique, tapis | 3 | 45 min | aucun | 2 | jamais (haltères exclus de (a), (b) et (c)) |
| PR-D | intermédiaire | muscle | salle complète | 2 | 30 min | aucun | 2 | dépend des fiches : forcer comme PR-B-L ou PR-B-H |
| PR-E | avancé | force | salle complète | 3 | 60 min | aucun | 2 | dépend des fiches : forcer comme PR-B-L (3 séances lourdes) |
| PR-F | intermédiaire | sante | maison : poids du corps, tapis, élastique, haltères légers | 3 | 45 min | aucun | 3 | jamais |
| PR-G | débutant | sante | maison minimal (comme PR-A) | 3 | 45 min | grossesse cochée | aucun plancher | jamais |
| PR-H | intermédiaire | muscle | salle complète | 3 | 60 min | zone `dos` niveau 1 | 3 | comme PR-B (forcer) |
| PR-I | intermédiaire | muscle | salle complète | 3 | 60 min | zone `dos` niveau 2 | 3 | comme PR-B (forcer) |
| PR-J | intermédiaire | sante | maison : poids du corps, tapis, élastique | 3 | 45 min | zone `genou` niveau 1 (`adapter` sur `jambes_2`) | 3 | jamais |
| PR-K | intermédiaire | muscle | salle complète | 3 | 60 min | post-partum coché | aucun plancher | comme PR-B (forcer) ; la grossesse et le post-partum retirent de toute façon CF3, CF4, CF5 |
Le plancher de core ne s'applique à aucun profil grossesse ni post-partum (PR-G, PR-K). Les profils salle complète ne sont « lourds » que si les fiches lourdes sont forcées : un test ne doit jamais supposer le choix du classement.

### 7.2 Tests
| Id | Propriété | Entrée (profil, fiches forcées, séance) | Résultat attendu | Règle |
|---|---|---|---|---|
| T-D26-01 | Plancher de core chaque semaine | semaine 1 du bloc de PR-A, PR-B-L, PR-B-H, PR-C, PR-D, PR-E, PR-F, avec les durées 20 / 30 / 45 / 60 min pour chacun ; **exemptions explicites** : PR-G, PR-K (grossesse, post-partum : aucun plancher), PR-I (dos niveau 2 : plancher de séances et de séries inchangé, familles réduites à 2 dans T-D26-02) | au moins 2 séances avec core ET au moins 4 séries de core par semaine ; aucune erreur ; PR-H, PR-I : ≥ 2 séances et ≥ 4 séries avec fiches CF1/CF2 admissibles | CORE-FREQ-1/2/3 |
| T-D26-02 | Familles variées : nombre exact | semaine 1 du bloc, nombre de séances de core = cible du tableau 7.1 ; familles attendues = **min(3, nombre de séances de core, nombre de familles admissibles)** | PR-A : 2 séances, **2 familles** (CF1 puis CF2) ; PR-B-H : 3 séances, **3 familles** (parmi CF1, CF2, CF3, CF4) ; PR-B-L : 3 séances toutes lourdes, **2 familles** (CF1, CF2, CF1 avec une fiche différente), **sans erreur** ; PR-C : 2 séances, **2 familles** ; PR-E : 2 séances, **2 familles** ; PR-F : 3 séances, **3 familles** ; PR-H : 3 séances, **2 familles au moins** (3 si une fiche CF3 a une variante sans charge admissible) ; PR-I : 3 séances, **2 familles** (CF1, CF2) ; dans tous les cas aucune famille identique deux séances de core de suite | CORE-FREQ-2, CORE-ALT-1 |
| T-D26-03 | Core jamais retiré avant les accessoires | PR-D (2 jours, 30 min), puis durée 20 min, avec `squat-gobelet` en `jambes_genou` | `jambes_2`, `tirage_2`, `poussee_2` partent avant le core ; le core est présent dans les 2 séances (2 séances, 4 séries) | CORE-TPS-1 |
| T-D26-04 | Core en fin de séance | PR-B-L, PR-B-H, PR-C, PR-E, séances A, B, C | dans chaque séance, la position de tout exercice de core (schéma `gainage`, `anti_rotation`, `rotation`, ou fiche avec `famille_core` **hors `extension-dorsale-ballon` et `copenhague-court`, qui ne comptent ni comme core avant un pilier ni dans le plancher**) est strictement après celle des exercices des emplacements `jambes_genou`, `poussee_1`, `tirage_1`, `charniere` ; les exercices d'échauffement E1/E2/E3 (schémas `mobilite`, `cardio`) sont ignorés | CORE-ORD-1/2 |
| T-D26-05 | Plafonds de core | PR-B-H, PR-C, PR-F | au plus 2 exercices et 6 séries de core par séance ; au plus 12 séries par semaine ; au plus un exercice CF3 par séance | CORE-DOSE-3, CORE-ALT-3 |
| T-D26-06 | Débutant : aucune rotation, aucun CF4/CF5, aucune roue | PR-A et PR-A en 3 jours | aucun exercice de famille CF3, CF4, CF5 ; ni `roue-abdos`, ni `rollout-ballon`, ni `rotation-bucheron`, `bucheron-ballon-lest`, `crunch-bicyclette` ; aucune variante chargeable ; maintiens de 20 s | CORE-SEC-1, CORE-DOSE-4 |
| T-D26-07 | Éligibilité au superset (SUP-0), séance 2 | PR-B-H, PR-C, PR-F avec « gagner du temps » | toute paire ne contient que des exercices des emplacements `poussee_2`, `tirage_2`, `jambes_2`, `tronc`, sans matériel parmi `barre`, `barre_ez`, `disques`, `rack`, `kettlebell`, `lest`, `sac_de_sable`, `machine`, `poulie`, et sans schéma `poussee_v`, `saut`, `porte`, `cardio` ; PR-B (salle) peut n'avoir **aucune** paire : ce n'est pas une erreur | SUP-0, SUP-3 |
| T-D26-08 | Aucun superset sur piliers ni exercices lourds | PR-B-L, PR-C, PR-E | aucune paire ne contient `jambes_genou`, `poussee_1`, `tirage_1`, `charniere`, un soulevé, un squat/fente chargé, un mouvement `poussee_v`, une fiche de niveau `avance` ou de schéma `saut` | SUP-3 |
| T-D26-09 | Paires valides | PR-B-H, PR-C, PR-F | pour chaque paire : aucun muscle principal commun ; schémas différents (SUP-5) ; pas deux exercices de jambes ; pas deux fiches de la même famille de core | SUP-1, SUP-2 pts 1-3, SUP-5 |
| T-D26-10 | Débutant et supersets | PR-A avec « gagner du temps » | **aucune paire**, quels que soient le matériel et la durée | SUP-4 |
| T-D26-11a | Grossesse : aucun superset | PR-G avec « gagner du temps » | zéro paire | SUP-2 pt 5, SUP-9 |
| T-D26-11b | Zone au niveau 1 sur un exercice de paire | PR-J avec « gagner du temps » ; **fiche de test forcée en `jambes_2`** dont la case `genou` est `adapter` ; `pompe` en `poussee_2` et `rowing-elastique` en `tirage_2` ; séance 2 | la fiche `jambes_2` n'est dans aucune paire (P3 non formée) ; la paire `pompe` + `rowing-elastique` (P1) reste formée | SUP-2 pt 5, SUP-9 |
| T-D26-12 | Repos et transition | PR-F, séance 2, paire forcée P1 : `pompe` (A) + `rowing-elastique` (B), famille `sante` intermédiaire (repos « autre » = 60 s chacun) | transition de 15 s entre A et B ; repos après la paire = **60 s** (le plus long des deux, jamais moins de 60 s) | SUP-6 |
| T-D26-13a | Douleur pendant la paire : « Continuer seul » | PR-F, séance 2, paire forcée comme T-D26-12 avec **fiches de test** : « Ça fait mal » sur A, zone déclarée **absente** de la fiche de B | paire dissoute ; séries restantes de A annulées ; boutons « Continuer seul » ET « Passer au suivant » proposés ; aucune hausse proposée pour A ; `SetLog.pain = true` | SUP-8 pts 1-4 |
| T-D26-13b | Douleur pendant la paire : « Continuer seul » retiré | idem, zone déclarée **portée** par la fiche de B (une ligne pour cette zone, quelle que soit la case) | seul « Passer au suivant » est proposé ; B traité comme exercice douloureux (aucune hausse) | SUP-8 pt 2-3 |
| T-D26-14 | Sécurité avant plancher | PR-B-H avec zone `dos` niveau 3, 3 jours | aucune fiche de core de la zone `dos` n'apparaît ; si aucune famille ne reste : message « demande l'avis d'un professionnel » à la place du message neutre ; aucune erreur | CORE-SEC-3/4 |
| T-D26-15 | CORE-ORD-4 (a), (b), (c) | **(a)** PR-B : `souleve-de-terre-barre` forcé en `charniere`, séance A ; **(b)** PR-B : `squat-arriere-barre` forcé en `jambes_genou` (sans soulevé), séance B ; **(c)** PR-B : `rowing-barre-penche` forcé en `tirage_1`, séance C ; **contre-exemple** : séance avec seulement `squat-gobelet` et `souleve-de-terre-roumain-halteres` (haltères) | pour chaque séance (a), (b), (c) : le core est CF1 ou CF2 ; fiches de maintien d'au plus 30 s ; fiches CF2 à répétitions limitées aux répétitions de V-TEMPS ; aucun CF3, CF4, CF5, ni `roue-abdos`, ni `rollout-ballon` ; la séance contre-exemple n'a **pas** cette restriction | CORE-ORD-4 |
| T-D26-16 | SUP-2 point 4 | PR-B-H, séance 2, avec `rowing-buste-penche-halteres` en `tirage_2`, `bird-dog` en `tronc` | aucune paire core + `rowing-buste-penche-halteres` (ni core + charnière chargée, ni core + core) ; autre exemple : fiche de test en `jambes_2` dont la ligne `dos` est `adapter` : jamais en paire avec le core | SUP-2 pt 4 |
| T-D26-17 | SUP-5 | PR-C, séance 2 | aucune paire ne contient deux exercices du même schéma (squat + fente, poussée + poussée, tirage + tirage), même sans muscle principal commun | SUP-5 |
| T-D26-18 | Table dos niveau 1 | PR-H | `roue-abdos` et `rollout-ballon` absentes ; CF3 sans charge uniquement, au plus 8 répétitions par côté, et `rotation-assise-ballon-lest` absente (pas de variante sans charge) ; `crunch-bicyclette` absente ; CF1/CF2 gardées | CORE-SEC-3 |
| T-D26-19 | Table dos niveau 2 | PR-I | aucun CF3, CF4, CF5 ; **fiches de maintien** (CF1) d'au plus 20 s, `capped` ; **fiches CF2 à répétitions** (`bird-dog`, `dead-bug`, `pallof-elastique`) limitées en répétitions (V-TEMPS) et `capped` (aucune hausse) ; CF1 dynamiques `planche-cercles-ballon`, `genoux-poitrine-ballon`, `planche-ballon`, `planche-bosu` absentes ; 2 familles ; ≥ 2 séances et ≥ 4 séries avec fiches CF1/CF2 admissibles | CORE-SEC-3 |
| T-D26-20 | Précédence table/fiche | PR-I avec une fiche de test de core dont la case `dos` est `retirer`, et une fiche `garder` d'une famille retirée par la table (ex. `rotation-bucheron`) | la première n'apparaît pas même si la table la permet ; la seconde n'apparaît pas non plus | CORE-SEC-3 |
| T-D26-21 | Grossesse : G5 | PR-G | aucun plancher de core ; tout exercice de core présent a **1 série** (débutante) ; aucune fiche CF3, CF4, CF5, ni fiche G4 « retirer » (planche, planche latérale, touche-épaule, dead-bug, couché dos/ventre) ; si aucune fiche compatible : message neutre CORE-FREQ-3, aucune alerte ; version intermédiaire de PR-G : 2 séries | CORE-SEC-2, G5 |
| T-D26-22 | Étalonnage et retour après gêne (B2) | PR-F, paires définies à la génération ; **séance 1** : tous les exercices en étalonnage ; **séance 2** : exercices connus ; **séance 3** : l'exercice A en retour après gêne | séance 1 : le lecteur joue chaque exercice séparément (repos normal), aucun message d'erreur ; séance 2 : paire appliquée ; séance 3 : A et B séparés, aucun message d'erreur ; séance 4 : paire de nouveau appliquée | SUP-2 pt 7 |
| T-D26-23 | Pas de hausse de charge en paire (R3) | PR-F, séance 2 puis 3, paire P1 avec haltères légers (charge de départ) comme membre ; ids forcés : une poussée horizontale aux haltères légers en `poussee_2` (fixture de test) et `rowing-elastique` en `tirage_2` | `proposeProgression` ne renvoie **aucune hausse de charge** pour un exercice en paire ; la charge reste la charge de départ du plan ; hors paire (séance sans paire), la hausse est de nouveau possible | SUP-0 pt 2 |
| T-D26-24 | P3 plus strict que SUP-0 (R3) | PR-C avec `squat-gobelet` (haltères légers) ou une fente aux haltères en `jambes_2` et `bird-dog` en `tronc`, séance 2 | P3 **non formée** avec cette fiche (haltères) ; avec `squat-poids-du-corps` en `jambes_2` : P3 formée | SUP-0, P3 |
| T-D26-25 | PR-K, post-partum | PR-K | aucun plancher de core ; aucun saut ; aucun superset ; core seulement CF1/CF2 avec ligne `Grossesse` garder/adapter ; sinon message neutre | CORE-SEC-2 |
| T-D26-26 | Exclusions par id (R10) | PR-F, PR-B-H | `copenhague-court` n'est jamais dans l'emplacement `tronc`, ni dans le plancher ni dans l'alternance ; `extension-dorsale-ballon` ne compte pas dans le plancher et n'est jamais en paire | famille-core-inventaire.md |
| T-D26-27 | `niveau_min` relevé (R10) | contrôle des fiches (`npm run check:fiches`) | `rotation-bucheron`, `bucheron-ballon-lest`, `crunch-bicyclette` ont `niveau_min: intermediaire` ; PR-A et tout débutant n'en reçoivent aucune | E16 |

### 7.3 Les 4 profils de démonstration
| Profil | Réglages | Résultat attendu (à contrôler dans docs/generateur-demo.txt après génération) |
|---|---|---|
| D1 débutant maison 2 jours | PR-A, « gagner du temps » activé | 2 séances A et B, chacune avec 1 exercice de core, CF1 puis CF2, 2 séries chacune (4 séries par semaine), à la fin de la séance ; aucun core chargé ; **aucun superset** (SUP-4) ; aucune rotation ni roue |
| D2 intermédiaire salle 4 jours | PR-B-H (3 jours en attendant la phase 4 ; la version 4 jours haut/bas est à coder en phase 4) | 3 séances de core (cible), 3 familles, pas deux séances de core de suite avec la même famille, core en fin de séance ; en version PR-B-L : 2 familles CF1/CF2, maintiens d'au plus 30 s ; supersets seulement SUP-0 (en salle, souvent aucune paire : acceptable) ; jamais squat, soulevé, développé ni `poussee_v` apparié |
| D3 grossesse 3 jours | PR-G (variante : intermédiaire) | **aucun plancher** ; aucun superset ; core seulement avec fiches dont la ligne `Grossesse` est garder/adapter en CF1/CF2 (aujourd'hui bird-dog à maintien court), 1 série pour la débutante, 2 sinon (G5) ; si rien de compatible : message neutre « Le tronc est adapté à ta situation : pas d'exercice de tronc cette semaine. » ; durée de séance selon G5 / V-GROS (generateur-v1.md §6.6, §6.8 point 6) ; aucun saut |
| D4 douleur lombaire niveau 2 | PR-I | CF1/CF2 seulement, fiches de maintien d'au plus 20 s, fiches CF2 à répétitions limitées, `capped`, 2 familles ; aucun CF3, CF4, CF5, ni roue abdominale, ni CF1 dynamique ; aucune paire contenant une fiche `capped`/`adapter` ; ≥ 2 séances et ≥ 4 séries avec fiches CF1/CF2 admissibles |

## 8. Écarts avec le code actuel et ce que le code doit changer
Base : docs/D26-etat-actuel.md, generateur-v1.md §2.2, §4.2, §4.4, §6.8, §11 (tests), src/generator/config.ts.

| Écart | Aujourd'hui | À changer (dans les limites des règles ci-dessus) |
|---|---|---|
| E1 core retiré en premier | `CORE_REMOVAL_ORDER` (config.ts lignes 81 à 87) : à 2 jours, `tronc` en premier pour A et B ; à 3 jours, séance A : `tronc` en premier, puis `charniere`, `tirage_1` ; séance C : `tirage_1`, puis `tronc`, puis `charniere` ; séance B : `charniere`, `tirage_1`, puis `tronc` en dernier. **Ordre de retrait du tronc en 3 jours : A, puis C, puis B** | nouvel ordre CORE-TPS-1 : accessoires, puis raccourcissement du core, puis retrait seulement au-delà du plancher (2 séances, 4 séries par semaine, intouchable) ; la rotation A, C, B peut rester pour choisir quelles séances perdent leur core au-delà du plancher |
| E2 un seul emplacement tronc par séance | un emplacement `tronc`, une famille par séance (A gainage, B anti-rotation, C rotation puis...) | jusqu'à 2 exercices de core par séance (CORE-DOSE-3) ; choix de la famille par la rotation de CORE-ALT-1 |
| E3 pas de plancher hebdomadaire | rien ne garantit des séances/séries de core | calcul du plancher CORE-FREQ-1/2 en fin de génération, avec message neutre si impossible ; test T-D26-01 |
| E4 familles CF4 et CF5 absentes | seulement gainage, anti_rotation, rotation | attribut `famille_core` (CORE-FAM-1, tranché) **à ajouter à `tools/validate-fiches.mjs` (liste fermée de 5 valeurs, facultatif) et à knowledge/format-fiches.md** ; poser l'attribut sur les 24 fiches de knowledge/famille-core-inventaire.md qui ont une famille (copenhague-court, 25e fiche relevée, est hors famille core et n'a pas l'attribut) ; GG5 inchangé ; les fiches CF4 et CF5 manquent (inventaire « trous constatés ») |
| E5 supersets lourds et emplacements | seuls `jambes_genou`, `poussee_1`, `charniere` sont interdits ; P2 `tirage_1`+`poussee_2` existe ; haltères, barre, machine, poulie, `poussee_v` ne sont pas exclus ; `tirage_1` peut être apparié | appliquer SUP-0 : emplacements accessoires seulement, aucun matériel de la liste B1, pas de `poussee_v`, `saut`, `porte`, `cardio` ; **supprimer P2** ; P1 sans `poussee_v` ; P3 avec jambes_2 poids du corps ou élastique + core CF1/CF2 |
| E6 même schéma | seul le « muscle principal commun » exclut deux exercices | ajouter SUP-5 et SUP-2 points 3 et 4 (même famille de core ; core + core ; core + exercice à ligne `dos` non `garder`) |
| E7 débutant et contradiction avec generateur-v1.md | le tableau de V-SUP (§4.2) marque P1 et P2 « Débutant : permise » et P3 « seulement si `jambes_2` non chargeable » ; les tests T24 et T25c l'autorisent (« débutant : P3 seulement si `jambes_2` n'est pas chargeable ») ; la règle V-SUP les permet donc | SUP-4 : aucun superset pour un débutant. **Modifier le tableau « Débutant » de generateur-v1.md §4.2 (permise -> interdite) et réécrire T24 / T25c** pour qu'ils attendent zéro paire pour un débutant |
| E8 repos minimal | repos de la paire = plus long des deux | ajouter le minimum de 60 s (SUP-6) |
| E9 douleur en superset | exercices sous plafond exclus à la génération seulement | lecteur de séance : SUP-8 (dissolution de la paire, aucune hausse, « Continuer seul » / « Passer au suivant ») |
| E10 phase de couverture | jours : 2 et 3 seulement | tables 4 à 6 jours à coder en phase 4 (haut/bas, push/pull/legs) |
| E11 étalonnage (B2) | la paire est statique, indépendante de l'étalonnage | **décision au lecteur de séance** (F5) : ne pas appliquer la paire si un des deux exercices est en étalonnage ou en retour après gêne (SUP-2 point 7), sans message d'erreur ; générateur inchangé |
| E12 ordre après charge lourde | rien | CORE-ORD-4 : restriction CF1/CF2, 30 s au plus, dans la séance à charge lourde (définition codable dans la règle) |
| E13 sécurité des familles | cases de fiche seulement | CORE-SEC-3 : table dos par famille ET cases de fiche, la plus restrictive prévaut ; CORE-SEC-1 : exclure CF3, CF4, CF5 et les ids roue-abdos / rollout-ballon pour le débutant même si `niveau_min` le permet ; CORE-SEC-2 : grossesse sans plancher |
| E15 fiches exclues ou hors plancher par identifiant (R10) | aucune exclusion par id | `copenhague-court` : jamais dans l'emplacement `tronc` ni dans le plancher ni dans l'alternance (hors famille core, kiné) ; `extension-dorsale-ballon` : famille CF5 mais **hors plancher** (schéma `charniere`, hors GG5) et jamais en paire ; exclusion par id aussi de `roue-abdos` et `rollout-ballon` pour le débutant et le dos niveau 1 |
| E16 relèvement de niveau (R10, décision du kiné) | `niveau_min: debutant` sur `rotation-bucheron`, `bucheron-ballon-lest`, `crunch-bicyclette` | relever à `intermediaire` (travail de `dev` sur les fiches ; CORE-SEC-1 reste strict en filet de sécurité) |
| E17 durée « gagner du temps » (R4) | durée calculée avec les paires | la séance 1 (étalonnage, paires non appliquées) peut dépasser la durée annoncée : le lecteur affiche la durée de la séance 2 et suivantes et l'app le dit une fois (texte de SUP-0) |
| E18 charge en paire (R3) | `proposeProgression` peut proposer une hausse | aucune hausse de charge pour un exercice en paire (T-D26-23) ; P3 sans haltères (T-D26-24) |
| E14 statut de S-TIME | generateur-v1.md §4.2 traitait la réserve de SRC2 (Iversen 2021) comme OK | **corrigé le 30/10/2026 dans generateur-v1.md §4.2** (par `dev`, D26 étape 3) : réserve marquée « source non vérifiable par le relecteur (page anti-robot), à confirmer » ; elle n'est qu'une recommandation d'auteurs. Le tableau §0 de generateur-v1.md n'est pas modifié (SRC2 y reste la source d'autres valeurs, hors D26) |

## 9. Bilan des règles par statut (après les corrections B1 à B4 et R1 à R11)
Une règle = un identifiant de ce fichier (33 au total : CORE-FAM-1 et 2 ; CORE-FREQ-1 à 5 ; CORE-TPS-1 ; CORE-DOSE-1 à 4 ; CORE-ORD-1 à 4 ; CORE-ALT-1 à 3 ; CORE-SEC-1 à 4 ; SUP-0 à SUP-9). **Un statut par règle, le plus faible de ses parties, sans double compte** ; la partie sourcée d'une règle mixte est signalée dans son texte.
- **OK : 1** : SUP-1 (pas de muscle principal commun ; volume maintenu : S-SUP, résumé lu).
- **PROVISOIRE : 2** : CORE-FAM-2 (S-STAB non lu en entier) ; SUP-8 (reprend R4, PROVISOIRE).
- **NON SOURCÉ : 30** : CORE-FAM-1 ; CORE-FREQ-1, 2, 3, 4, 5 ; CORE-TPS-1 ; CORE-DOSE-1, 2, 3, 4 ; CORE-ORD-1, 2, 3, 4 ; CORE-ALT-1, 2, 3 ; CORE-SEC-1, 2, 3, 4 ; SUP-0, 2, 3, 4, 5, 6, 7, 9. (CORE-SEC-2 et CORE-SEC-3 reprennent G4/G5/G7 et R1-R4 mais leur texte unique et la table dos sont NON SOURCÉ ; SUP-6 : seul « volume maintenu » est sourcé, il est repris par SUP-1.)
Total : 1 + 2 + 30 = 33.
**Aucune règle de ce fichier n'est codable en dur sans la validation de l'utilisateur et le contrôle de `relecteur`** (règle 10).

## 10. Questions ouvertes pour l'utilisateur
Tranchées par le chef de projet : D-CF (attribut `famille_core`), SUP-4 (aucun superset pour un débutant), P4 (abandonnée), champ `superset_interdit` (non retenu).
**Reste ouverte : Q3 : les valeurs des planchers de §2.2** (2 séances et 4 séries par semaine ; cible 3 séances) sont NON SOURCÉES (aucune recommandation officielle ne chiffre le core) : les garder, les baisser ou les monter ?

## 11. Avis du kiné (30/10/2026)

Rédigé par `kine`. Sources : aucune nouvelle source lue pour cet avis. Je m'appuie sur ce que le fichier cite (S-STAB : aucune forme d'exercice de core n'est supérieure, article non lu en entier), sur regles-securite-communes.md (R1-R4, G4, G5, G7, S1-S3, U1, statuts propres) et sur la HAS 2019 telle que résumée là (éviter le décubitus dorsal pour les exercices abdominaux dès la 16e semaine, isométrique prolongé et Valsalva). **Je n'ai trouvé ni lu aucune source** qui classe les exercices de core par niveau de gêne lombaire, pour le débutant ou après l'accouchement : toutes les règles ci-dessous sont des choix de prudence, **NON SOURCÉ**, sauf mention. Aucun diagnostic : l'app ne nomme ni diastasis, ni hernie, ni pathologie.

Décisions de conception reçues et respectées : attribut `famille_core` ; pas de P4 ; pas de champ `superset_interdit`.

**Règle d'économie de risque** : comme aucune famille n'est démontrée meilleure (S-STAB), retirer une famille à risque ne coûte rien en bénéfice démontré ; on retire donc au moindre doute et on garde CF1 et CF2.

### Point 1 : douleur lombaire (zone `dos`)
| Famille | Niveau 1 (gêne légère) | Niveau 2 (gêne nette) | Niveau 3 (douleur) |
|---|---|---|---|
| CF1 gainage | garder (planche sur genoux ou inclinée de préférence) ; roue abdominale, rollout : **retirés** | maintien court (au plus 20 s), `capped` | retirer |
| CF2 anti-rotation | garder (bird-dog, pallof) | maintien court, `capped` | retirer |
| CF3 rotation | sans charge, amplitude réduite, au plus 8 répétitions par côté | retirer | retirer |
| CF4 flexion | version courte et lente, jambes pliées, sans lest ; relevé de jambes jambes tendues retiré | retirer | retirer |
| CF5 extension | extension au sol courte et lente ; banc à 45° chargé retiré | retirer | retirer |

Confirme la proposition du coach (CF4 et CF5 retirés dès le niveau 2), qu'elle étend au niveau 1 pour la roue abdominale et le relevé de jambes jambes tendues. Au niveau 2, le plancher de §2.2 est visé avec CF1 et CF2 courts ; s'il n'y a rien d'admissible, message sans forçage (CORE-SEC-4). Niveau 3 : R3 inchangé. Statut : NON SOURCÉ (traduit R2 et R3, elles-mêmes NON SOURCÉ). Reprise : R7 (version plus douce, nouvel étalonnage).

### Point 2 : rotation (CF3)
- **Débutant : aucune rotation, même sans charge** (durci par rapport à « pas de CF3 chargé »). CF1 et CF2 suffisent ; le plancher de 2 familles reste atteint. Conséquence : à la 3e séance de core d'un débutant, on réutilise CF1 ou CF2 avec une fiche différente.
- **Dos niveau 1** : CF3 sans charge, amplitude réduite, au plus 8 répétitions par côté, lent. **Niveau 2 et 3 : retirée.**
- **Non débutant, dos sain** : CF3 chargé seulement léger (charge de départ de l'étalonnage), un seul exercice de CF3 par séance (CORE-ALT-3 inchangé), rotation russe chargée et lancers rotatifs rapides non proposés par défaut. Statut : NON SOURCÉ.

### Point 3 : grossesse et post-partum
- **Core suspendu comme obligation, possible comme proposition.** Le plancher de §2.2 n'est pas exigé. On propose seulement les fiches dont la ligne `Grossesse` est `garder` ou `adapter` (aujourd'hui bird-dog à maintien court, charge nulle). G4 retire déjà planche, planche latérale, touche-épaule, dead-bug et tout ce qui est couché sur le dos ou le ventre : je ne contredis rien. Une planche inclinée au mur n'est pas réintroduite : elle reste une planche (isométrique, pression abdominale), sauf si une fiche dédiée porte une ligne `Grossesse` explicite validée par `kine`.
- **Retirés tant que le réglage est coché** (enceinte ou post-partum) : CF3 (torsion), CF4 (flexion répétée du tronc, relevé de buste, relevé de jambes, roue abdominale), CF5 couché sur le ventre, tout exercice de core sans ligne `Grossesse`. Fondement : HAS 2019 (éviter le décubitus dorsal pour les abdominaux dès la 16e semaine, isométrique prolongé, Valsalva), appliqué dès le début de la grossesse comme G4 : extrapolation PROVISOIRE ; le retrait de CF3 et de CF4 en post-partum est NON SOURCÉ (prudence ; G7 ne parle que de l'impact et de la rééducation du périnée).
- **Durée de la suspension en post-partum** : aucun délai codé (G7). La personne décoche le réglage après son professionnel. Message affiché avec G1 et G7, pas d'autre texte.
- Cohérent avec G4, G5 (1 série débutante, 2 sinon), G6, G7. **Réconciliation avec CORE-SEC-2 (R6) : en cas de différence de formulation, la règle la plus restrictive s'applique** ; le texte de référence est CORE-SEC-2 (§5.1) : seules CF1 et CF2 avec une ligne `Grossesse` `garder` ou `adapter`, jamais CF3, CF4, CF5 (CF5 n'est pas limitée au « couché sur le ventre »), et une fiche ne rétablit jamais une famille retirée.

### Point 4 : core et charnière, superset
- **Core après un soulevé en fin de séance** : pas de contre-indication de principe, mais CORE-ORD-4 (ajouté) : CF1 et CF2 seulement, maintien au plus 30 s, arrêt dès que la position se dégrade ; ni CF3 chargé, ni CF4 dynamique, ni CF5, ni roue abdominale. L'inverse (core fatigant avant une charge lourde) reste interdit (CORE-ORD-1). Statut : NON SOURCÉ.
- **Core + charnière en superset** : impossible (charnière jamais en paire, SUP-3) ; SUP-2 point 4 **confirmé et élargi** au rowing penché même léger et à tout exercice ayant une ligne `dos` autre que `garder`.
- **P3** (`jambes_2` + core) : **acceptable** pour un non-débutant, avec core de famille CF1 ou CF2 seulement. P4 abandonnée.
- **Douleur en superset** (SUP-8) : dissolution de la paire, aucune progression, `SetLog.pain`, conseil selon S1/S2 (douleur qui dure plus de 2 semaines, nuit, repos, gonflement, perte de force, engourdissement : « consulte »). Précisé : « Continuer seul » n'est pas proposé si la zone déclarée figure aussi dans la fiche de l'autre exercice ; R5, U1, S3 arrêtent toute la séance.

### Point 5 : plancher de 4 séries par semaine, débutant sédentaire
**Acceptable, à ne pas baisser** (2 séries de 20 s, 2 fois par semaine, c'est très peu de travail). Conditions : variantes les plus faciles et debout ou inclinées de préférence (une position au sol difficile à quitter est un frein pour une personne en surpoids : choix de prudence), respiration continue, arrêt si douleur (R4), aucune hausse de durée avant 2 séances sans gêne (R7), plancher suspendu s'il n'y a pas de fiche admissible. NON SOURCÉ.

### Point 6 : supersets pour les débutants
**Confirmé, interdits à tous les débutants** (SUP-4 réécrit). S-TIME dit seulement « moins adaptés, surtout pour les débutants » : l'interdiction totale est un choix de prudence que je durcis sans le faire passer pour une preuve (PROVISOIRE pour l'orientation, NON SOURCÉ pour l'interdiction totale). S'y ajoute SUP-2 point 7 : aucun exercice en étalonnage ni en retour après gêne n'est mis en paire.

### Règles du corps du fichier modifiées par le kiné (dangereuses ou trop permissives)
CORE-FREQ-2 (2 familles pour le débutant, plancher non exigé en grossesse) ; CORE-SEC-1 (aucune rotation, aucune roue abdominale pour le débutant) ; CORE-SEC-2 (grossesse, post-partum) ; CORE-SEC-3 (cases par famille) ; CORE-ORD-4 (nouvelle) ; table P1-P4 (P3 fermée aux débutants, CF1/CF2 seulement, P4 abandonnée) ; SUP-2 points 4, 5 (dès le niveau 1) et 7 (nouveau) ; SUP-4 ; SUP-8 points 2 et 3 ; SUP-9 ; tests T-D26-02, T-D26-10 ; profils D1, D3, D4. Aucune règle de ce fichier ne m'a paru dangereuse au point de devoir être retirée en entier.

### Reste NON SOURCÉ
Tout le §11 sauf les renvois HAS indiqués ; plafonds et durées de core ; interdiction totale des supersets pour débutants ; retrait de CF3 et CF4 en post-partum. Contrôle de `relecteur` à demander avant codage.

Contrôlé par `relecteur` le : 1er contrôle bloquant (30/10/2026), recontrôle des points R1 à R5 et R8 à R10 en cours.

### Mise à jour du 30/10/2026 (décisions B1 à B4 du chef de projet)
Les décisions B1 (définition fermée de ce qui peut être apparié, SUP-0), B2 (étalonnage, SUP-2 point 7), B3 (tests à profils exacts, exemptions) et B4 (grossesse, post-partum : aucun plancher, texte CORE-SEC-2) prévalent sur toute formulation contraire de ce §11 (notamment « P3 acceptable pour un non-débutant » : SUP-4 interdit désormais tout superset au débutant ; P3 reste possible pour les autres niveaux avec jambes_2 en poids du corps ou élastique). Tous les points de §6 ont été traités par le kiné (2e passage ci-dessous).

### 2e passage, 30/10/2026 (kiné, après correction B1 à B4)
1. **CORE-SEC-2 (B4) : confirmé, sûr et cohérent avec G4, G5, G7** (plus restrictif qu'eux, jamais plus permissif). Réserve : le message neutre ne doit pas être présenté comme un conseil de s'abstenir de bouger ; G1 et G7 restent affichés. NON SOURCÉ sauf renvois HAS (PROVISOIRE).
2. **Précédence table/fiche (CORE-SEC-3) : d'accord**, la plus restrictive prévaut dans les deux sens. La limite « 3 familles » de CORE-FREQ-2 est ramenée aux familles admissibles.
3. **Inventaire** : planche-laterale = CF1 ; planche-laterale-jambe-levee = CF1 (retirée dès le dos niveau 2) ; copenhague-court = hors famille core (ne compte pas) ; crunch-bicyclette = CF4 avec restrictions de CF3, retirée dès le dos niveau 1 ; extension-dorsale-ballon = CF5 qui ne compte pas dans le plancher. Détail dans knowledge/famille-core-inventaire.md. NON SOURCÉ.
4. **Rotations marquées débutant** : relever `niveau_min` à `intermediaire` pour rotation-bucheron, bucheron-ballon-lest, crunch-bicyclette (travail de `dev`) ; CORE-SEC-1 reste strict.
5. **CORE-ORD-4** : définition sûre ; elle est conservatrice (un pilier chargeable comme `poussee_1` la déclenche aussi), ce qui est acceptable. **Corrigé** : ajout (c), le rowing penché chargé comptait pour rien alors qu'il fatigue le dos. **Exclusion de `poussee_v` de tous les supersets : confirmée** (même au poids du corps).
6. **Absence de CF4/CF5 : aucun danger** (c'est le sens sûr). Le générateur retombe sur CF1/CF2 (autre fiche, alternance CF1/CF2 respectée) ; il ne substitue jamais CF3, une charnière ou une fiche de mobilité, et affiche le message neutre si CF1/CF2 sont aussi retirées.
**À revérifier par le relecteur** : le ajout (c) de CORE-ORD-4, la cohérence des cinq décisions d'inventaire avec la table dos, et le fait que copenhague-court (schéma `gainage`) soit bien exclue de l'emplacement `tronc` par id.
