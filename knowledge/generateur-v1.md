# Générateur de programmes v1 : règles codables (corps entier, 2-3 jours)
Rédigé par `coach` le 23/10/2026 ; §6.8 et note R2 par `kine` le 23/10 ; corrigé par `coach` le 23/10 après knowledge/CONTROLE-generateur-v1-relecteur.md (n° 1 à 24 ; mécanique de sécurité du n° 1 et du n° 2 à relire par `kine`). Recontrôle du 23/10 (knowledge/RECONTROLE-generateur-v1-relecteur.md) : validé sous réserve ; points N1 à N9 corrigés par `coach` le 23/10, réponses D15 point 6 intégrées. Statut du fichier : **recontrôle court de N1 à N5 par `relecteur` avant F3** ; les identifiants de sources sont SRC1 à SRC15 (à ne pas confondre avec les signes d'alerte S1-S3 de regles-securite-communes.md) ; les points marqués NON SOURCÉ sont des choix de conception prudents, à valider par l'utilisateur (CLAUDE.md règle 10) ; les points de sécurité (§6.0, §6.4 à §6.6, §6.8) reprennent `regles-securite-communes.md` sans rien y ajouter et sont à relire par `kine`.

Lecture pour `dev` : chaque règle porte un identifiant (`V-…`) à citer dans le code et dans les tests (§11). Les valeurs « retenues » sont celles à coder ; les fourchettes sont celles des sources. Le générateur est une **fonction pure et déterministe** : `genererProgramme(profil, materiel, blessures, objectifs, fiches, historique) -> Programme` ; aucun tirage au hasard, même entrée = même sortie (départages explicites à chaque étape).

Statuts : OK = source primaire, méta-analyse ou position officielle lue au moins en résumé ; PROVISOIRE = source secondaire, préprint non relu par les pairs, ou extrapolation d'une source ; NON SOURCÉ = choix de conception.

## 0. Sources (toutes « lues le 2026-10-23 » sauf mention)

| Réf. | Source | Lien | Type, niveau de preuve | Public | Ce qui a été lu | Statut |
|---|---|---|---|---|---|---|
| SRC1 | Currier, Phillips et coll., ACSM Position Stand « Resistance Training Prescription for Muscle Function, Hypertrophy, and Physical Performance in Healthy Adults: An Overview of Reviews », Med Sci Sports Exerc 2026;58(4):851-872, DOI 10.1249/MSS.0000000000003897 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823 | revue de revues (137 revues systématiques, > 30 000 participants), position officielle ; qualité de preuve donnée en % par résultat | adultes en bonne santé, du débutant complet au confirmé | texte complet PMC, Discussion et tableaux 4 à 6, lus via un outil de lecture (extraits et citations courtes) ; références non lues | OK |
| SRC2 | Iversen, Norum, Schoenfeld, Fimland, « No Time to Lift? Designing Time-Efficient Training Programs for Strength and Hypertrophy », Sports Med 2021;51(10):2079-2095, PMID 34125411 | https://pmc.ncbi.nlm.nih.gov/articles/PMC8449772 | revue narrative (pas de méta-analyse) | adultes, surtout jeunes, non entraînés et entraînés | 60 % du texte (recommandations pratiques) via un outil de lecture | OK pour ce qu'elle rapporte ; revue narrative : les valeurs sont des recommandations d'auteurs |
| SRC3 | Remmert, Pelland, Robinson, Hinson, Zourdos, « Is There Too Much of a Good Thing? Meta-Regressions of the Effect of Per-Session Volume on Hypertrophy and Strength », SportRxiv, 2 avril 2025 | https://sportrxiv.org/index.php/server/preprint/view/537 | méta-régression, **préprint non relu par les pairs** | adultes | résumé | PROVISOIRE |
| SRC4 | Grgic, Schoenfeld, Skrepnik, Davies, Mikulic, « Effects of Rest Interval Duration in Resistance Training on Measures of Muscular Strength: A Systematic Review », Sports Med 2018;48(1):137-151, DOI 10.1007/s40279-017-0788-x, PMID 28933024 | https://pubmed.ncbi.nlm.nih.gov/28933024/ | revue systématique, 23 études, 491 participants | entraînés et non entraînés | résumé | OK |
| SRC5 | Singer et coll., « Give it a rest: a systematic review with Bayesian meta-analysis on the effect of inter-set rest interval duration on muscle hypertrophy », Front Sports Act Living 2024, DOI 10.3389/fspor.2024.1429789 | https://www.frontiersin.org/articles/10.3389/fspor.2024.1429789/full | méta-analyse bayésienne, 9 études | surtout jeunes hommes non entraînés | résumé et conclusions | OK |
| SRC6 | Robinson, Pelland, Remmert, Refalo, Jukic, Steele, Zourdos, « Exploring the Dose-Response Relationship Between Estimated Resistance Training Proximity to Failure, Strength Gain, and Muscle Hypertrophy: A Series of Meta-Regressions », Sports Med 2024;54(9):2209-2231, DOI 10.1007/s40279-024-02069-2 | https://rke.abertay.ac.uk/en/publications/exploring-the-dose-response-relationship-between-estimated-resist/ | méta-régressions (RIR estimé a posteriori) | adultes | résumé | OK |
| SRC7 | Halperin et coll., « Accuracy in Predicting Repetitions to Task Failure in Resistance Exercise: A Scoping Review and Exploratory Meta-analysis », Sports Med 2022;52:377-390 | https://pubmed.ncbi.nlm.nih.gov/34542869/ | revue de portée + méta-analyse exploratoire, 12 études, 414 participants, hétérogénéité très forte | adultes | résumé | OK |
| SRC8 | Plotkin et coll., « Progressive overload without progressing load? The effects of load or repetition progression on muscular adaptations », PeerJ 2022;10:e14142 | https://peerj.com/articles/14142 | essai randomisé, 8 semaines | adultes entraînés | résumé | OK (un seul essai) |
| SRC9 | Schoenfeld, Grgic, Van Every, Plotkin, « Loading Recommendations for Muscle Strength, Hypertrophy, and Local Endurance: A Re-Examination of the Repetition Continuum », Sports 2021;9(2):32 | https://pmc.ncbi.nlm.nih.gov/articles/PMC7927075/ | revue narrative | adultes | 60 % du texte via un outil de lecture | OK pour ce qu'elle rapporte (revue narrative) |
| SRC10 | Zhang, Weakley, Li, Li, Garcia-Ramos, supersets, Sports Med 2025 (déjà dans sources.md) | https://eprints.leedsbeckett.ac.uk/id/eprint/11908 | méta-analyse, 19 études, 313 participants | adultes | résumé (lu le 21/10/2026) | OK |
| SRC11 | McCrary, Ackermann, Halaki, « A systematic review of the effects of upper body warm-up on performance and injury », Br J Sports Med 2015;49(14):935-942, PMID 25694615 | https://pubmed.ncbi.nlm.nih.gov/25694615/ | revue systématique d'essais randomisés, 31 essais | adultes, haut du corps | résumé | OK (performance) ; **aucune étude sur la prévention des blessures** |
| SRC12 | Nunes et coll., ordre des exercices, Eur J Sport Sci 2021, DOI 10.1080/17461391.2020.1733672 (déjà dans sources.md) | DOI | méta-analyse, 11 études | adultes | résumé (lu le 21/10/2026) | OK |
| SRC13 | OMS 2020, Bull et coll., Br J Sports Med 54(24):1451-1462 (déjà dans sources.md) | DOI 10.1136/bjsports-2020-102955 | recommandation officielle | adultes | résumé (lu le 21/10/2026) | OK |
| SRC14 | HAS 2019 grossesse et post-partum, via `regles-securite-communes.md` §3 (G4, G5, G7) | https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf | recommandation officielle | femmes enceintes ou en post-partum | lue par `kine` le 21-22/10/2026 (non relue ici) | voir G4, G5, G7 |
| SRC15 | `regles-securite-communes.md` (§0, R1-R3, C1-C3, G4-G7) et `format-fiches.md` §4 | fichiers du projet | règles du projet (leurs statuts propres s'appliquent) | — | lus en entier | selon chaque règle |

Ce que SRC1 dit, et ne dit pas (utile pour toute la suite) : au moins 2 séances par semaine, tous les grands groupes musculaires, effort élevé ; force : charges >= 80 % du max (effet dose-réponse), « 2-3 séries par séance » (tableau 6 ; la Discussion parle de rendements décroissants au-delà de ~2-3 séries par exercice), exercice placé en début de séance, amplitude complète ; hypertrophie : >= 10 séries par muscle et par semaine (dose-réponse, rendements décroissants vers 18-20 séries), toutes charges de 30 à 100 % du max donnent une croissance comparable ; « au moins deux séries par exercice » ; l'échec n'est pas nécessaire, cible « proche de l'échec » ou 2-3 répétitions en réserve, mais « preuves insuffisantes pour chiffrer une cible exacte » ; repos court (< 1 min) ou long (> 1 min) : pas de différence pour la force, données insuffisantes pour l'hypertrophie ; ordre sans effet sur l'hypertrophie ; périodisation pas supérieure si la progression est suffisante ; la variété n'est pas clairement nécessaire. **SRC1 ne donne ni fourchette de répétitions pour l'hypertrophie, ni durée de repos recommandée, ni échauffement, ni semaine de décharge.**

## 1. Entrées, périmètre et objectifs

### 1.1 Entrées lues (src/data/model.ts)
- `Profile.level` (`debutant` / `intermediaire` / `avance`), `daysPerWeek`, `blockedWeekdays`, `sessionDurationMin` (null = sans limite), lieu (maison / salle : à ajouter au profil par F1 s'il n'existe pas ; sinon déduit : `preset` F = salle), `EquipmentProfile` (tags + implicites non décochés + poids des haltères, kettlebells, disques), `Goal` (rang 1 = objectif principal), `Injury` (zone, niveau, `afterShock`), réglage facultatif « enceinte / post-partum » (G, **absent du modèle à ce jour** : à ajouter par `dev`, décoché par défaut, jamais partagé), historique des `SetLog`.
- **À corriger par `dev` avant F3** : `InjuryZone` ne contient pas `cuisse` ni `aine`, alors que les fiches et `regles-securite-communes.md` ont 10 zones.
- Fiches : seulement `statut` = `utilisable` ou `verifie` (CLAUDE.md règle 22), lues depuis le JSON de F0.

### 1.2 Périmètre v1 (règle V-PER)
| Entrée | v1 | Hors v1 (message, pas de programme faux) |
|---|---|---|
| jours/semaine | 2 ou 3 | 1, 4, 5, 6 : « arrive dans une prochaine version » (phase-2-criteres F1) |
| répartition | corps entier | haut/bas, push/pull/legs |
| durée | 20, 30, 45, 60, 75 min ou « sans limite » | < 20 min : proposer 20 |
| objectif | 3 familles de paramètres : `muscle`, `force`, `sante` | voir 1.3 |

### 1.3 Objectifs : comment ils se ramènent aux 3 familles en v1 (règle V-OBJ)
Seul l'objectif de rang 1 décide en v1 (goal-resolver.md règle 1). Correspondance (NON SOURCÉ, choix de conception à valider) :
| Objectif du profil (rang 1) | Famille v1 | Message ajouté |
|---|---|---|
| prise de muscle | `muscle` | — |
| force | `force` | si aucune variante chargeable pour les piliers : message V-MSG-FORCE (§8) |
| perte de gras | `muscle` (garder le volume de musculation : goal-resolver.md, « préserver la masse maigre » ; à sourcer) ; **choix par défaut prudent, en attente de l'utilisateur** | « La perte de gras dépend surtout de l'alimentation ; le plan de repas arrive dans une prochaine version. Repère OMS : 150 à 300 min d'activité modérée par semaine. » (repère OMS : SRC13, OK ; phrase sur l'alimentation : NON SOURCÉ, sans chiffre ni conseil nutritionnel) |
| forme / santé | `sante` | — |
| cardio / endurance | `sante` | repère OMS (SRC13) |
| sport | `sante` | « Les programmes par sport arrivent dans une prochaine version. » |
| mobilité, fonctionnel | `sante` + bloc fonctionnel activé (§2.3, emplacement 9) | — |
Le socle reste identique pour toutes les familles : tous les grands groupes >= 2 fois/semaine (SRC1, SRC13 : OK).

## 2. Structure d'une séance et répartition sur la semaine

### 2.1 Grands groupes musculaires (règle V-GG) et règle des 2 fois par semaine
SRC1 et SRC13 demandent « tous les grands groupes musculaires » au moins 2 jours par semaine (OK) sans les lister de façon codable. Découpage retenu (NON SOURCÉ, choix de conception, aligné sur les schémas de mouvement d'equipment-taxonomy.md) :
| Groupe | Couvert dans une séance si un exercice placé a… |
|---|---|
| GG1 cuisses avant | `schema` ∈ {squat, fente} et `quadriceps` dans `muscles_principaux` |
| GG2 hanches / arrière des cuisses | `schema` = charniere (ou `fessiers`/`ischios` principal d'un squat/fente : ne compte pas, pour garder une charnière) |
| GG3 poussée du haut du corps (pectoraux, épaules, triceps) | `schema` ∈ {poussee_h, poussee_v}, fiche non `substitut` |
| GG4 tirage du haut du corps (dos) | `schema` ∈ {tirage_h, tirage_v}, fiche non `substitut`, et `grand_dorsal` ou `rhomboides` principal |
| GG5 tronc | `schema` ∈ {gainage, anti_rotation, rotation} |
Une fiche `couverture: substitut` couvre son groupe **à moitié** : elle est placée (§7) mais le groupe est compté « couvert par substitut » et déclenche le message V-MSG-SUBST, pas l'avertissement V-MSG-FREQ.
Règle V-FREQ : après génération, compter pour chaque GG le nombre de séances de la semaine qui le couvrent. Si < 2 : avertissement V-MSG-FREQ (§8). Quand le noyau (5 emplacements) tient dans la durée, le gabarit couvre chaque GG à chaque séance (3 fois en 3 jours, 2 fois en 2 jours). **Aux durées courtes (20-30 min) ce n'est pas garanti** : l'action 6 de §4.4 retire des emplacements du noyau. En 3 jours, l'ordre de retrait tourne d'une séance à l'autre (§4.4, action 6) pour qu'un emplacement retiré une fois reste couvert 2 fois sur 3 ; en 2 jours, un emplacement retiré fait tomber son groupe sous 2 fois : avertissement V-MSG-FREQ (CLAUDE.md règle 15). **Conséquence pour docs/phase-2-criteres.md F3 (décision de l'utilisateur D15 point 6, 23/10/2026)** : 20 min en 3 jours est accepté, sans minimum de 30 min ; le critère « chaque grand muscle >= 2 fois/semaine en 3 jours » se lit « >= 2 fois, **ou** avertissement V-MSG-FREQ affiché quand la durée choisie ne le permet pas ». À reporter dans docs/phase-2-criteres.md F3 (fichier non modifié ici : demande à la session principale).

### 2.2 Emplacements d'une séance (règle V-EMP), remplis dans cet ordre de priorité
| Prio | Emplacement | Schémas candidats | Muscle principal exigé (fiche « pleine ») | Rôle |
|---|---|---|---|---|
| 1 | `jambes_genou` | squat (séance A, C) / fente (séance B) ; si vide : l'autre | quadriceps | noyau, pilier |
| 2 | `poussee_1` | poussee_h (A, C) / poussee_v (B) ; si vide : l'autre | pectoraux (H) ; deltoides_anterieurs (V) | noyau, pilier |
| 3 | `tirage_1` | tirage_h (A, C) / tirage_v (B) ; si vide : l'autre | grand_dorsal ou rhomboides | noyau |
| 4 | `charniere` | charniere | ischios ou fessiers | noyau |
| 5 | `tronc` | gainage (A), anti_rotation (B), rotation puis anti_rotation (C) ; si vide : les autres | — | noyau |
| 6 | `poussee_2` | l'autre plan que `poussee_1` | idem | accessoire |
| 7 | `tirage_2` | l'autre plan que `tirage_1` | idem | accessoire |
| 8 | `jambes_2` | fente si `jambes_genou` = squat, sinon squat ; à défaut hanche_laterale, puis cheville_mollet | quadriceps (squat/fente) | accessoire |
| 9 | `fonctionnel` | porte (puis anti_rotation non déjà placé) | — | optionnel : seulement famille `sante` avec objectif mobilité/fonctionnel, ou option « ajouter du fonctionnel » |
- Les emplacements 1 à 5 forment le **noyau** (un exercice par GG). Principe de couverture des grands schémas : program-logic.md §4 point 2 et SRC2 (« au moins un exercice de poussée et un de tirage du haut du corps, un exercice de jambes », OK). L'ajout de la charnière et du tronc dans le noyau : NON SOURCÉ (choix de conception : GG2 et GG5).
- Les sauts (`saut`), la mobilité dédiée au cou et le cardio ne sont **jamais** placés dans les emplacements en v1 (sauts : réservés aux programmes sport, D3 ; cou : C2 ; cardio : échauffement seulement, §4.2).
- Nombre d'exercices N selon la durée : §4.4. On remplit les emplacements par ordre de priorité jusqu'à N.

### 2.3 Répartition sur 2 ou 3 jours (règle V-ROT)
- 2 jours : séances **A, B** ; 3 jours : **A, B, C**, toujours dans cet ordre, la même semaine type pendant tout le bloc (program-logic.md §7 : pas de rotation aléatoire ; SRC1 : la variété n'est pas nécessaire ; OK pour le principe, NON SOURCÉ pour le gabarit).
- Avec ce gabarit : en 3 jours, poussée H et tirage H 2 fois (A, C), poussée V et tirage V 1 fois (B), sauf si N >= 7 (les deux plans à chaque séance). En 2 jours et N < 7, les plans alternent (A = H, B = V) : afficher l'information V-MSG-PLANS (§8), pas un avertissement (GG3 et GG4 restent couverts 2 fois).
- Même emplacement dans deux séances différentes : choisir une **fiche différente** si au moins 2 fiches conviennent (A et C reçoivent la 1re et la 2e du classement §6.7 ; program-logic.md §7 : « l'une des deux fois peut utiliser une variante », Kassiano 2022 (revue systématique, résumé, voir sources.md) soutient une variation **systématique** et non aléatoire : principe PROVISOIRE ; la règle « fiche différente en A et C » est NON SOURCÉ). Sinon la même fiche.
- Bloc : **4 semaines** avec les mêmes fiches et variantes (program-logic.md §7 donne 4-6 semaines NON SOURCÉ ; 4 retenu par prudence pour réévaluer tôt). `Program.weeks = 4`. NON SOURCÉ ; **choix par défaut prudent, en attente de l'utilisateur**.

### 2.4 Choix des jours de la semaine (règle V-JOURS)
- Récupération : au moins ~48 h avant de retravailler fortement le même muscle (program-logic.md §2 : ACSM 2009/2011 via synthèses, PROVISOIRE ; schedule-adaptation.md en fait un test obligatoire). En corps entier, chaque séance travaille tout : **deux séances jamais sur deux jours consécutifs**.
- Algorithme déterministe : parmi les jours libres (0 = lundi … 6 = dimanche, hors `blockedWeekdays`), essayer toutes les combinaisons de 2 (ou 3) jours ; écarts circulaires = différences successives + (7 + premier - dernier) ; garder celles dont l'écart minimal est le plus grand ; départage : la plus petite dans l'ordre lexicographique (ex. 3 jours libres partout -> lundi, mercredi, vendredi ; 2 jours -> lundi, jeudi).
- 3 jours demandés et écart minimal < 2 jours (ex. seuls 4 jours consécutifs libres) : ne pas générer 3 séances ; refaire le calcul pour 2 jours et proposer 2 séances avec V-MSG-JOURS (§8).
- 2 jours demandés (ou repli depuis 3) et écart minimal < 2 jours (ex. seuls samedi et dimanche libres, ou un seul jour libre) : **aucun programme** (1 séance par semaine est hors v1), message V-MSG-JOURS2. NON SOURCÉ (application stricte des 48 h de schedule-adaptation.md).

## 3. Séries, répétitions, réserve, repos

### 3.1 Ce que disent les sources (fourchettes)
| Variable | Fourchette sourcée | Source | Statut |
|---|---|---|---|
| Séries par exercice | au moins 2 ; plus de 2 peut apporter un peu plus ; rendements décroissants au-delà de ~2-3 pour la force | SRC1 | OK |
| Séries par muscle et par semaine, hypertrophie | >= 10 (dose-réponse), plateau vers 18-20 | SRC1 | OK |
| Minimum par muscle et par semaine (programmes courts) | >= 4 séries | SRC2 (revue narrative) | OK (recommandation d'auteurs) |
| Séries par muscle et par séance | au-delà de ~11 séries « fractionnaires » par séance, plus de bénéfice détectable pour l'hypertrophie ; ~2 séries directes pour la force | SRC3 (préprint) | PROVISOIRE |
| Charge pour la force | >= 80 % du max ; 1-5 répétitions à 80-100 % du max pour maximiser le max | SRC1 ; SRC9 | OK |
| Répétitions pour l'hypertrophie | toute charge >= ~30 % du max si les séries sont dures ; charges modérées (8-12 répétitions) les plus efficaces en temps ; 6-15 RM recommandé, 15-40 possible près de l'échec | SRC1, SRC9 ; SRC2 | OK |
| Charges légères | demandent d'aller près de l'échec ; plus d'inconfort | SRC9, SRC2 | OK |
| Réserve (RIR) | échec non nécessaire ; « proche de l'échec » ou 2-3 en réserve ; pas de cible exacte prouvée ; l'hypertrophie augmente en se rapprochant de l'échec, la force dépend surtout de la charge | SRC1 ; SRC6 | OK |
| Précision de l'estimation de la réserve | sous-estimation moyenne ~0,95 répétition ; moins précise au-delà de 12 répétitions ; le niveau d'entraînement ne change pas la précision | SRC7 | OK |
| Repos, force | non entraînés : 60-120 s suffisent ; entraînés : > 2 min pour maximiser ; SRC1 : pas de différence < 1 min vs > 1 min | SRC4 ; SRC1 | OK |
| Repos, hypertrophie | petit avantage au-delà de 60 s, pas de différence détectée au-delà de ~90 s ; SRC1 : données insuffisantes | SRC5 ; SRC1 | OK |
| Repos (recommandation d'auteurs) | non entraînés 1-2 min, entraînés >= 2 min | SRC2 | OK (revue narrative) |
| Débutants | mêmes bases ; charges nécessairement basses au départ, puis progression nécessaire | SRC1 | OK |

### 3.2 Paramètres retenus par famille et par niveau (règle V-DOSE)
« Pilier » = emplacements 1 et 2 (§2.2) ; « autre » = emplacements 3 à 8. « Chargeable » = la variante choisie contient au moins un tag parmi `halteres`, `kettlebell`, `barre`, `barre_ez`, `disques`, `machine`, `poulie`, `sac_a_dos`, `bidons_ou_sacs`, `lest` (sinon : poids du corps ou élastique).
| Famille | Niveau | Séries pilier / autre | Répétitions (chargeable) | Répétitions (poids du corps, élastique) | Réserve cible (RIR) | Repos pilier / autre |
|---|---|---|---|---|---|---|
| muscle | débutant | 2 / 2 | 10-12 | 10-15 | 3 | 90 s / 90 s |
| muscle | intermédiaire | 3 / 3 | 8-12 | 10-15 | 2 | 120 s / 90 s |
| muscle | avancé | 3 / 3 | 8-12 | 10-15 | 1-2 (1 seulement sur variantes machine, poulie, élastique, poids du corps ; 2 sinon) | 120 s / 90 s |
| force | débutant | 2 / 2 | 6-10 | 10-15 | 3 | 120 s / 90 s |
| force | intermédiaire | 3 / 2 | 4-6 (piliers), 8-12 (autres) | 10-15 | 2 | 180 s / 90 s |
| force | avancé | 3 / 2 | 4-6 (piliers), 8-12 (autres) | 10-15 | 2 | 180 s / 120 s |
| sante | débutant | 2 / 2 | 10-15 | 10-15 | 3 | 90 s / 60 s |
| sante | intermédiaire | 2 / 2 | 10-15 | 10-15 | 2-3 (3 retenu) | 90 s / 60 s |
| sante | avancé | 3 / 2 | 8-12 | 10-15 | 2 | 90 s / 60 s |
**Ces valeurs sont une dose de base : les plafonds de sécurité de §6.0 (P-CAP, P-GROS) s'appliquent ensuite et l'emportent toujours.**
Justification et statut, ligne par ligne :
- Séries : 2 minimum partout (SRC1, OK). 3 pour intermédiaire/avancé en muscle et pour les piliers en force (SRC1 : « plus de 2 peut apporter plus » ; tableau 6 : « 2-3 séries par séance » pour la force ; OK). Débutant à 2 : dans la fourchette SRC1, **le choix de ne pas monter à 3 est NON SOURCÉ** (prudence, durée courte) ; avec 2 séances x 2 séries, le minimum de 4 séries par semaine de SRC2 est atteint.
- Répétitions muscle 8-12 / 10-15 : dans les fourchettes SRC1, SRC2, SRC9 (OK) ; borne haute 15 plutôt que 20-40 parce que l'estimation de la réserve est moins fiable au-delà de 12 (SRC7) et que les séries très longues sont plus pénibles (SRC9) : choix PROVISOIRE (extrapolation des sources). Quand une personne dépasse le haut de la fourchette au poids du corps, la progression passe à l'échelon suivant (phase 3, load-calibration.md règle 5).
- Force 4-6 sur piliers chargeables : correspond à des charges lourdes (SRC1 >= 80 % du max ; SRC9 1-5 répétitions à 80-100 %) ; 4 plutôt que 1-3 : NON SOURCÉ (prudence, pas de partenaire, pas de barre obligatoire). La correspondance « 4-6 répétitions ≈ 80-85 % du max » varie selon la personne et l'exercice (SRC9) : PROVISOIRE. Force débutant 6-10 : NON SOURCÉ (SRC1 : charges basses au départ pour les inexpérimentés).
- Force sans variante chargeable : répétitions de la colonne « poids du corps » et message V-MSG-FORCE (program-logic.md §4 point 4 ; SRC1 : la force dépend surtout de la charge, OK).
- Santé 10-15, 2 séries : dans la fourchette des anciennes recommandations citées par SRC1 (8-20 répétitions) et de SRC2 (6-15 RM) (OK) ; le choix précis est NON SOURCÉ.
- Réserve : SRC1 « 2-3 » (OK) ; débutant 3 et santé 3 : haut de la fourchette SRC1, NON SOURCÉ (prudence + sous-estimation d'environ 1 répétition, SRC7) ; avancé muscle 1 sur variantes sûres seulement : SRC6 (plus près de l'échec = un peu plus d'hypertrophie, OK) ; restriction aux variantes sûres : NON SOURCÉ (load-calibration.md règle 2 : jamais 0 sur mouvements lourds sans partenaire). **Jamais de cible 0 en v1** (SRC1, OK).
- Repos : débutant 90-120 s dans 60-120 s (SRC4, SRC2, OK) ; intermédiaire/avancé piliers 120-180 s (SRC4 > 2 min pour les entraînés, SRC2 >= 2 min, OK) ; « autres » 90 s (SRC5 : rien de détecté au-delà de ~90 s pour l'hypertrophie, OK) ; santé 60-90 s : SRC1 ne trouve pas de différence < 1 min / > 1 min pour la force (OK), valeurs exactes NON SOURCÉ.

### 3.3 Exercices à durée ou par côté (règle V-TEMPS) : NON SOURCÉ en entier ; gainage 20-30 s et porté 30-40 s : **choix par défaut prudent, en attente de l'utilisateur**
Aucune source lue ne chiffre les maintiens de gainage ni les portés (les fiches le disent : « Repères de dosage » NON SOURCÉ). Valeurs prudentes à valider :
| Schéma | Unité | Débutant | Intermédiaire / avancé | Séries | Repos |
|---|---|---|---|---|---|
| gainage (planche, planche latérale, gainage creux, copenhague) | secondes de maintien | 20 s | 30 s | 2 | 60 s |
| anti_rotation (bird-dog, dead-bug, pallof, planche touche épaule) | répétitions par côté, lentes | 6-8 | 8-10 | 2 | 60 s |
| rotation | répétitions par côté | 8-10 | 10-12 | 2 | 60 s |
| porte | secondes de marche (ou aller-retour dans la pièce) | 30 s | 40 s | 2 | 60 s |
| hanche_laterale, cheville_mollet | répétitions (par côté si unilatéral) | 10-15 | 12-15 | 2 | 60 s |
| mobilite (échauffement) | secondes ou répétitions par côté | 30 s ou 6-8 | idem | 1 | 0 |
Réserve pour ces schémas : pas de RIR demandé ; consigne « arrête quand la position ou le contrôle se dégrade » (NON SOURCÉ). Les schémas `porte` en grossesse suivent leur ligne Grossesse (`charge:legere`).

### 3.4 Contrôle du volume hebdomadaire (règle V-VOL)
- Comptage par muscle (méthode « fractionnaire » de SRC3 : muscle principal = 1 série, secondaire = 0,5 ; PROVISOIRE) sur la semaine.
- Famille `muscle`, niveau intermédiaire ou avancé : viser >= 10 séries par semaine pour `quadriceps`, `fessiers`, `ischios`, `pectoraux`, `grand_dorsal`, et >= 10 pour l'ensemble des `deltoides_*` (SRC1, OK pour le seuil ; liste des muscles NON SOURCÉ). Si un muscle est en dessous : (1) +1 série sur l'exercice où il est principal (maximum 4 séries par exercice, NON SOURCÉ), (2) sinon ajouter l'emplacement 6, 7 ou 8 qui le travaille, tant que la durée (§4.4) et le plafond par séance le permettent ; sinon afficher l'information V-MSG-VOL (§8). Jamais plus de 20 séries par muscle et par semaine : le plateau 18-20 de SRC1 décrit des rendements décroissants, pas un risque ; seuil OK, **usage comme plafond NON SOURCÉ** (choix de conception). Note : assimiler « intermédiaire/avancé » à « entraîné » au sens de SRC4 et SRC2 est une extrapolation (PROVISOIRE), utilisée aussi pour les repos de §3.2.
- Débutant (toutes familles) et `sante` : viser >= 4 séries par muscle et par semaine (SRC2, OK), pas d'ajout automatique au-delà.
- Plafond par séance (règle V-PLAF) : au plus **10 séries fractionnaires par muscle et par séance** (sous le point de ~11 de SRC3 : PROVISOIRE, préprint) ; et au plus **8 exercices** et **24 séries de travail** par séance hors échauffement (NON SOURCÉ, prudence et durée).
- Grossesse (réglage coché) : voir P-GROS (§6.0), qui l'emporte sur tout ce §3. Rappel G5 : 1 série par exercice pour une débutante, 2 pour les autres niveaux (HAS : 1 série débutantes, 2-3 entraînées ; la valeur 2 retenue pour intermédiaire et avancé est le bas de la fourchette), 8-15 répétitions jusqu'à fatigue modérée, réserve cible 3 minimum, séance <= 60 min (SRC14 via G5 : OK pour les repères HAS, codage PROVISOIRE).

## 4. Ordre, supersets, échauffement, durée

### 4.1 Ordre dans la séance (règle V-ORDRE)
1. Échauffement (§4.3).
2. Piliers : `jambes_genou`, puis `poussee_1` (famille `force` : obligatoire en tête, SRC1 « début de séance », SRC12, OK ; familles `muscle` et `sante` : même ordre par défaut, l'ordre n'a pas d'effet sur l'hypertrophie, SRC1 et SRC12, OK).
3. `tirage_1`, `charniere`, puis `poussee_2`, `tirage_2`, `jambes_2`.
4. `tronc`, puis `fonctionnel` (porté en fin de séance : program-logic.md §10, PROVISOIRE).
5. Retour au calme facultatif (§4.3).
Départage : ordre de priorité des emplacements (§2.2). Les supersets (§4.2) gardent la place du premier exercice de la paire.

### 4.2 Supersets antagonistes (règle V-SUP)
- Fondement : les supersets font gagner du temps sans réduire le volume ni les adaptations (SRC10, OK) ; une paire agoniste-antagoniste prend environ la moitié du temps (SRC2, OK). **Réserve de SRC2 (OK, recommandation d'auteurs)** : supersets plutôt adaptés à l'hypertrophie qu'à la force maximale, et moins adaptés aux gros mouvements lourds, surtout pour les débutants. Les règles ci-dessous suivent cette réserve : aucun pilier ni charnière en superset.
- Paires permises (liste fermée, essayées dans cet ordre ; deux exercices dont les `muscles_principaux` n'ont **aucun** muscle commun) :
| Ordre | Paire | Exemple | Débutant |
|---|---|---|---|
| P1 | `poussee_2` + `tirage_2` (même plan, antagonistes) | développé épaules + tirage vertical à l'élastique | permise |
| P2 | `tirage_1` + `poussee_2` (si P1 n'est pas formée) | rowing + développé épaules | permise |
| P3 | `jambes_2` + `tronc` | fente + planche latérale | seulement si la variante de `jambes_2` n'est pas chargeable |
- Interdits, pour **toutes** les familles (dont `force`) et tous les niveaux : `jambes_genou`, `poussee_1` (piliers) et `charniere` ne sont **jamais** en superset ; deux exercices de jambes ; deux exercices avec un muscle principal commun (SRC10 : le volume chute, OK) ; un exercice dont une case de blessure est `adapter` ou qui est `capped` (NON SOURCÉ : repos complet pour la zone gênée) ; grossesse ou post-partum coché (§6.0). Statut des interdits : NON SOURCÉ (prudence alignée sur la réserve de SRC2).
- Quand : (1) si la personne a coché « gagner du temps » (option, défaut : non), P1 à P3 sont formées dès la génération ; (2) sinon **seulement** quand la durée estimée dépasse la durée choisie (§4.4). Les supersets sont décidés **une fois pour tout le bloc** (même contenu chaque semaine, V-ROT) et ne dépendent pas de l'étalonnage.
- Déroulé : série de A, transition **15 s** (NON SOURCÉ), série de B, puis repos de la paire = **le plus long des deux repos** de §3.2 (SRC2 : volume maintenu avec un repos entre paires ; valeur NON SOURCÉ). Nombre de séries de la paire = le plus grand des deux ; l'exercice qui en a moins saute ses dernières séries.
- Données : `PlannedExercise.supersetGroup` = même identifiant pour A et B (déjà dans le modèle).

### 4.3 Échauffement et retour au calme (règle V-ECH)
Sources : SRC1 n'en parle pas ; SRC11 : preuves fortes que des échauffements dynamiques à charge élevée améliorent la force et la puissance (haut du corps), **aucune étude sur la prévention des blessures** (OK) ; SRC2 : en manque de temps, garder les séries d'échauffement spécifiques (surtout au-dessus de ~80 % du max), l'échauffement général n'est pas prioritaire ; étirements statiques longs (30-60 min) avant la séance : baisse de force aiguë, courts (< 60 s par muscle) : effet faible ; étirement dynamique : pas de baisse (OK, revue narrative). L'app **ne dit pas** que l'échauffement prévient les blessures.
Contenu retenu :
| Partie | Contenu | Durée comptée | Statut |
|---|---|---|---|
| E1 général | 1 fiche `cardio`, **échelon 1** (variante sans saut : `marche-rapide-continue`, `montees-genoux-marche`, `jumping-jacks-sans-saut`, `boxe-vide-lente`, `pas-chasses-lents` ; départage : ordre de cette liste, après filtres §6), 2 min | 120 s | NON SOURCÉ (durée et contenu) |
| E2 mobilité | 2 fiches `mobilite` (type `mobilite_recup`, échelon 1) liées aux piliers du jour : séance avec squat/fente -> `mobilite-cheville-au-mur` ou `mobilite-hanches-90-90` ; poussée/tirage -> `glissement-mur-epaules`, `cercles-de-bras` ou `extension-thoracique` ; charnière -> `chat-vache` ; 30 s ou 6-8 répétitions par côté chacune | 2 x 45 s | NON SOURCÉ ; étirement statique long exclu (SRC2) |
| E3 spécifique | avant **chaque pilier seulement** (emplacements `jambes_genou` et `poussee_1` ; aucun E3 pour les autres exercices) : variante chargeable -> 1 série de 8 répétitions à ~50 % de la charge de travail ; si répétitions cibles <= 6 (force intermédiaire/avancé) **et** aucun plafond de §6.0 : + 1 série de 3 répétitions à ~75 % (supprimée par l'action 4 de §4.4) ; poids du corps ou élastique -> 1 série de 6 répétitions à l'échelon inférieur (ou au même échelon s'il n'y en a pas) | chaque série = exécution + 45 s | Principe : SRC11 et SRC2 (OK) ; nombre de séries et pourcentages : NON SOURCÉ |
| Retour au calme | facultatif, 1 fiche `mobilite` d'étirement (ex. `etirement-fessiers-figure-4`, `etirement-pectoraux-mur`) 30 s par côté | 0 s (non compté, retiré en premier) | NON SOURCÉ |
Exclusions de l'échauffement : fiches dédiées au cou (`NECK_DEDICATED_IDS`, C2), sauf zone `cou` au niveau 1 ou 2 : alors 1 fiche douce dédiée au cou peut remplacer une fiche E2, choisie **uniquement** dans la liste de §6.5 (`rotation-douce-cou`, `inclinaison-douce-cou`, `retraction-cervicale`) ; `retraction-omoplates`, bien que `doux_pour: [cou]`, n'est pas une fiche d'échauffement (C1, C2, `filterByNeck`) ; toutes les fiches d'échauffement passent aussi les filtres §6 (matériel, blessures, grossesse).
Séance d'étalonnage (§5) : la série E3 sert de première série de test de charge.

### 4.4 Durée estimée et ajustement (règle V-DUREE)
Formule (secondes), à calculer pour chaque séance :
```
T = T_ech + somme(exercices seuls) + somme(paires) + transitions
T_ech = 120 + 2 x 45 + somme(séries E3 : t_exec + 45)
exercice seul = séries x t_exec + (séries - 1) x repos
paire A/B   = séries_max x (t_exec_A + 15 + t_exec_B) + (séries_max - 1) x repos_paire
t_exec = répétitions_moyennes x 4 s x (2 si unilatéral ou « par côté ») + (10 s si unilatéral)   [à durée : secondes de maintien x (2 si par côté)]
transitions = 60 s x (nombre d'exercices ou de paires - 1) + 60 s après l'échauffement
```
- 4 s par répétition : SRC2 rapporte ~2 s concentrique + ~4 s excentrique chez les novices (ACSM, via SRC2) et des tempos modérés de 1-2 s par phase ; des durées de 0,5 à 8 s donnent la même hypertrophie (SRC1, SRC2) : **valeur 4 s dans la fourchette 2-6 s, choix NON SOURCÉ**. Transition 60 s : NON SOURCÉ. « Unilatéral » = variante dont l'id ou le nom contient `un-bras`, `une-jambe`, `unijambiste`, `un-haltere`, `bulgare`, `fente` (à remplacer par un champ de fiche `unilateral: oui` : demande à `dev`, F0).
- Nombre d'exercices N de départ (NON SOURCÉ, puis vérifié par la formule ; jamais moins que le noyau de 5) :
| Durée choisie | 20 min | 30 min | 45 min | 60 min | 75 min | sans limite |
|---|---|---|---|---|---|---|
| N de départ | 5 | 5 | 6 | 7 | 8 | 7 (durée cible 60 min, affichée) |
- Ajustement : tant que T > durée choisie D, appliquer **la prochaine action** de cette liste, puis recalculer T ; s'arrêter dès que T <= D (program-logic.md §5 et goal-resolver.md règle 5 : jamais les piliers ni l'échauffement ; ordre détaillé NON SOURCÉ) :
  1. Former la paire P1, puis P2, puis P3 (§4.2), si elles sont permises (garde le volume, SRC10).
  2. Retirer l'emplacement `fonctionnel`, puis `jambes_2`, puis `tirage_2`, puis `poussee_2` (un par action). Une paire dont un exercice est retiré est dissoute ; l'autre exercice redevient seul ; les paires ne sont pas reformées.
  3. Réduire à 2 séries les exercices non piliers qui en ont 3 (SRC1 : minimum 2), tous en une action.
  4. Supprimer la 2e série E3 (celle à ~75 %) de chaque pilier.
  5. Réduire E1 à 60 s et E2 à 1 fiche (45 s), en une action.
  6. Retirer un emplacement du noyau, un par action, dans l'ordre de la séance : **2 jours** (A et B) : `tronc`, `charniere`, `tirage_1` ; **3 jours** (rotation, pour qu'un groupe retiré une fois reste couvert 2 fois sur 3) : A : `tronc`, `charniere`, `tirage_1` ; B : `charniere`, `tirage_1`, `tronc` ; C : `tirage_1`, `tronc`, `charniere`. Chaque retrait : V-MSG-DUREE, et V-MSG-FREQ si le groupe tombe sous 2 fois/semaine.
  7. Jamais : retirer un pilier ; descendre sous 2 séries (**sauf** quand un plafond de sécurité de §6.0 impose moins, ex. grossesse G5 : 1 série) ; supprimer E1 ; raccourcir les repos de §3.2.
  Si T > D après l'action 6 (piliers seuls) : garder la séance, afficher la durée estimée réelle et V-MSG-DUREE (« la séance minimale dure {T} min ») ; c'est le seul cas où T peut dépasser D (test T3bis).
- Ajout : si T < D - 10 min et N < 8, ajouter l'emplacement suivant (§2.2) tant que T reste <= D (NON SOURCÉ).
- Affichage : durée estimée arrondie à 5 min supérieures, avant de commencer (program-logic.md §5) ; garantie testée : **T <= D** hors le cas ci-dessus (phase-2-criteres F3).
- Exemple 1 (intermédiaire, `muscle`, 45 min, 6 exercices bilatéraux de 3 séries de 10 répétitions — `jambes_genou`, `poussee_1`, `tirage_1`, `charniere`, `tronc` traité ici comme 3 x 10 pour simplifier, `poussee_2` —, repos 120 s piliers / 90 s autres, 2 piliers chargeables avec 1 série E3 chacun) : T_ech = 120 + 90 + 2 x (32 + 45) = 364 s ; piliers 2 x (3 x 40 + 2 x 120) = 720 s ; 4 autres 4 x (3 x 40 + 2 x 90) = 1 200 s ; transitions 60 x 5 + 60 = 360 s ; T = 2 644 s ≈ 44 min <= 45 : aucun ajustement.
- Exemple 2 (même séance plus `tirage_2`, 7 exercices, D = 45 min) : T = 2 644 + 300 + 60 = 3 004 s > 2 700 -> action 1, P1 (`poussee_2` + `tirage_2`) : 3 x 95 + 2 x 90 = 465 s au lieu de 300 + 300 + 60 = 660 s -> T = 2 809 s > 2 700 ; P2 impossible (`poussee_2` déjà en paire) ; P3 impossible (`jambes_2` absent) -> action 2 : `fonctionnel` et `jambes_2` absents, retrait de `tirage_2` (P1 dissoute, `poussee_2` redevient seul) -> T = 2 644 s <= 2 700 : arrêt, aucune paire.
- Exemple 3 (débutant, `sante`, profil C, 20 min, séance A ; fiches choisies par §6.7 : `assis-debout-mains-cuisses` (poids du corps, chaise), `developpe-au-sol-halteres`, `rowing-buste-penche-halteres`, `curl-ischios-serviette`, `gainage-creux` ; tous bilatéraux ; 2 séries de 12,5 répétitions en moyenne = 50 s ; `tronc` 2 x 20 s ; repos 90 s piliers / 60 s autres) : T_ech = 120 + 90 + (24 + 45) [E3 poids du corps, 6 répétitions] + (32 + 45) [E3 haltères, 8 répétitions] = 356 s ; piliers 2 x (2 x 50 + 90) = 380 s ; `tirage_1` et `charniere` 2 x (2 x 50 + 60) = 320 s ; `tronc` 2 x 20 + 60 = 100 s ; transitions 60 x 4 + 60 = 300 s ; T = 1 456 s > 1 200 -> actions 1 à 4 sans effet (aucune paire permise, rien à retirer, déjà 2 séries, pas de 2e série E3) -> action 5 : - 105 s -> 1 351 s -> action 6 : retrait de `tronc` (- 100 - 60) -> T = 1 191 s <= 1 200 : arrêt. En 2 jours, la séance B suit le même calcul avec ses propres fiches (fente unilatérale, tirage de l'autre plan : elle peut perdre plus d'emplacements).

## 5. Étalonnage et données enregistrées (load-calibration.md)

### 5.1 Quand (règle V-ETAL)
Un exercice est « en étalonnage » quand l'historique ne contient **aucune série faite** (`SetLog.completedAt` non nul) pour cette `variantId`. Aussi après un retour de blessure (R7 : nouvel étalonnage quand une zone baisse de niveau, NON SOURCÉ) et après un changement de variante par le générateur.

### 5.2 Déroulé (le générateur prépare, le lecteur de séance F5 applique)
| Étape | Règle | Statut |
|---|---|---|
| Charge de départ, variante chargeable | débutant : le plus léger poids disponible dans le profil pour ce matériel (haltères : plus petit `dumbbellWeightsKg` ; kettlebell : plus petit `kettlebellWeightsKg`) ; intermédiaire / avancé : la charge que la personne indique (« ta charge habituelle pour 10 répétitions », facultatif), sinon le plus léger. **Sous un plafond de sécurité (§6.0 : `capped` par R2 ou `charge:legere`, grossesse cochée)** : le plus léger pour une variante **sans historique** (aucune série faite de cette variante) ; avec historique : variante et dernière charge faite sans douleur conservées, sans hausse ; dans les deux cas jamais la charge habituelle déclarée, jamais augmenté (ni pendant l'étalonnage, ni après), même pour un intermédiaire ou un avancé (choix par défaut prudent, en attente de l'utilisateur ; §6.8 point 1e) | NON SOURCÉ (load-calibration.md règle 1) ; SRC1 : charges basses au départ pour les inexpérimentés (OK) |
| Poids du corps / élastique | l'échelon choisi en §6.3 (sous plafond de sécurité : l'échelon le plus bas disponible, §6.3) ; élastique : la résistance la plus faible du profil | NON SOURCÉ |
| Après chaque série | une seule question : « Combien de répétitions te restait-il ? » boutons 0, 1, 2, 3, 4+ ; plus les répétitions faites (déjà saisies) | load-calibration.md règle 1 (NON SOURCÉ) ; échelle RIR : SRC7 (OK : estimation correcte à ~1 répétition près, moins fiable > 12 répétitions) |
| Ajustement série suivante | **Lecture du bouton « 4+ »** : il vaut 4 dans les calculs, et la condition de hausse « réserve >= cible + 2 » est plafonnée à 4, soit `rir >= min(cible + 2, 4)` (ex. cible 3 : « 4+ » déclenche la hausse ; cible 2 : « 4+ » aussi ; cible 1 : 3 ou « 4+ »). Règle : réserve >= min(cible + 2, 4) et répétitions >= haut de fourchette -> poids disponible immédiatement supérieur (ou échelon + 1 si son niveau <= niveau de la personne et matériel présent) ; réserve <= cible - 2 ou répétitions < bas de fourchette -> poids inférieur (ou échelon - 1) ; sinon garder | NON SOURCÉ (load-calibration.md règle 3) ; marge de 2 plutôt que 1 pour absorber l'erreur d'estimation (~1 répétition, SRC7) : PROVISOIRE |
| Interdits pendant l'étalonnage | **aucune hausse**, quelle que soit la réserve saisie : si la fiche est `capped` (zone au niveau 2 ayant une ligne dans la fiche, R2 ; ou `charge:legere`), si le réglage grossesse / post-partum est coché (lecture prudente de G5 conforme à V-PRIO : `capped = true` sur tous les exercices tant que le réglage est coché ; une réserve haute ne déclenche jamais de hausse), si la série a été marquée « ça fait mal » (R4 : arrêt de l'exercice). Les baisses restent permises | règles du projet (R2, R4, G5) ; « jamais de hausse en grossesse » : NON SOURCÉ (prudence), à relire par `kine` |
| Fin d'étalonnage | la charge (ou l'échelon) de la **dernière série terminée sans douleur** devient la charge de départ de la séance suivante | NON SOURCÉ |
| Volume de la séance d'étalonnage | mêmes séries que §3.2 (les séries d'étalonnage comptent dans le volume) | NON SOURCÉ |

### 5.3 Ce que la v1 enregistre dès maintenant (pour la double progression de la phase 3)
Champs existants de `SetLog` à remplir à chaque série : `variantId`, `movementId`, `setIndex`, `targetRepsMin`, `targetRepsMax`, `reps`, `loadKg` (null au poids du corps), `rir`, `pain`, `completedAt`. **Champs à ajouter** (demande à `dev`, sans valeur sportive nouvelle) :
| Champ | Type | Pourquoi |
|---|---|---|
| `targetRir` | nombre | comparer réserve faite / cible (load-calibration.md règle 4) |
| `isCalibration` | booléen | distinguer l'étalonnage des séances normales |
| `isWarmup` | booléen | exclure E3 du volume et de la progression |
| `echelon` | entier | progression par échelons au poids du corps (règle 5) |
| `bandResistance` | texte ou null | élastiques : résistance utilisée |
| `holdSec` | nombre ou null | schémas à durée (§3.3) |
| `side` | `gauche` / `droite` / null | unilatéral |
| `capped` | booléen | charge bloquée (`charge:legere`, niveau 2, grossesse) : jamais de hausse automatique |
Et dans `PlannedExercise` : `rirTarget`, `unit` (`reps` / `sec` / `reps_par_cote`), `holdSec`, `warmupSets` (liste {reps, pourcentage ou échelon}), `role` (`pilier` / `autre` / `tronc` / `fonctionnel`), `slot` (§2.2), `startLoadKg`, `capped`, `adaptation` (case appliquée : `charge:legere`, `amplitude:<v>`, `appui:<v>`, pour l'affichage des notes), `substitut` (booléen).

## 6. Choix de la fiche et de la variante

Pour chaque emplacement, appliquer les filtres dans cet ordre ; une étape qui vide la liste passe à §7 (schéma impossible).

### 6.0 Règle de priorité générale (règle V-PRIO) : la sécurité l'emporte toujours
**Les règles de sécurité de ce §6 (§6.4 blessures et `capped`, §6.5 cou, §6.6 grossesse et post-partum, §6.8) l'emportent toujours sur la dose et la structure (V-DOSE, V-TEMPS, V-VOL, V-PLAF, V-SUP, V-ECH, V-DUREE, V-ROT, V-EXPL).** Aucune règle de dose ou de structure ne peut remonter une valeur au-dessus d'un plafond de sécurité ni réintroduire une fiche retirée. Statut : règle du projet (CLAUDE.md règles 10-11), NON SOURCÉ comme mécanique ; contenu de sécurité à relire par `kine`.

Mécanique, dans cet ordre pour chaque séance :
1. **Filtres** (§6.1 à §6.6) : fiches et variantes permises.
2. **Dose de base** : V-DOSE (§3.2) et V-TEMPS (§3.3) selon la famille et le niveau.
3. **Plafonds** : fonction `appliquerPlafonds(exercice, profil)` appliquée à chaque exercice, **après** la dose de base ; elle ne fait que baisser ou bloquer (tableau ci-dessous).
4. **Structure** : V-VOL, V-SUP, V-ECH, V-DUREE travaillent sur la dose plafonnée ; toute action qui monterait au-dessus d'un plafond est sautée (ex. « +1 série » de V-VOL sur une fiche `capped` ou en grossesse ; 2e série E3 à ~75 %) ; toute règle « minimum » de structure cède devant un plafond (ex. « jamais sous 2 séries » de §4.4 action 7 ne s'applique pas quand G5 impose 1 série).
5. **Textes** : V-EXPL et les messages décrivent la dose finale (après plafonds), jamais la dose de base.

| Plafond | Déclencheur | Effet sur la dose et la structure | Source |
|---|---|---|---|
| P-CAP | fiche `capped` (zone au niveau 2 ayant une ligne dans la fiche, R2 ; ou case `adapter: charge:legere`) | charge de départ la plus légère ; échelon le plus bas (§6.3) **seulement pour une variante sans historique ; avec historique : variante et dernière charge sans douleur conservées, sans hausse (kine 23/10)** ; aucune hausse (charge, échelon, répétitions, `holdSec`, séries) ; pas d'ajout V-VOL ; pas de superset ; E3 : 1 série à ~50 % seulement | R2 (NON SOURCÉ), §6.8 point 1 ; échelon le plus bas : choix par défaut prudent, en attente de l'utilisateur |
| P-GROS | réglage « enceinte / post-partum » coché | **famille ramenée à `sante`** pour la dose, quel que soit l'objectif (aucun pilier à 4-6 répétitions, aucune charge lourde) ; répétitions 10-15 (dans les 8-15 de G5) ; réserve cible **>= 3** (fatigue modérée, jamais d'effort maximal) ; séries par exercice : **1** si niveau `debutant` ou absent, **2** sinon (G5 : 1 débutantes, 2-3 entraînées ; bas de fourchette retenu) ; repos de la famille `sante` ; E3 : 1 série à ~50 % seulement, jamais à ~75 % ; `capped = true` sur tous les exercices (aucune hausse, ni à l'étalonnage ni ensuite) ; charge de départ la plus légère et échelon le plus bas pour une variante **sans historique** (aucune série faite de cette variante) ; avec historique : variante et dernière charge faite sans douleur conservées, sans hausse ; aucun superset ; aucun ajout V-VOL ; séance <= 60 min (D ramenée à 60 si plus longue ou « sans limite », message V-MSG-GROS-DUREE) ; post-partum : aucune fiche `saut` ; explication : ligne 2 propre (§8.1) ; pas de V-MSG-FORCE ni V-MSG-VOL | G5 : repères HAS OK, codage PROVISOIRE ; G7 PROVISOIRE ; « famille ramenée à sante » et échelon le plus bas : NON SOURCÉ (prudence), à relire par `kine` |
| P-ZONE3 | zone au niveau 3 | fiches de la zone retirées (R3) ; si 3 emplacements du noyau ou plus sont vides à cause de zones au niveau 3 : **aucun programme** (§9, V-MSG-PRO). **« Vide » se compte après tous les replis a à d du §7.1** : un emplacement est vide s'il arrive au repli e (aucune fiche, même substitut, même de l'autre plan) **et** que la cause est « santé » (au moins une fiche aurait convenu sans les zones au niveau 3) ; comptage par séance ; le programme est refusé si une séance au moins atteint 3 | R3 (NON SOURCÉ), §6.8 point 4 |
| P-COU | zone `cou` niveaux 1-3, `afterShock` | §6.5 | C1-C3 |
Plusieurs plafonds : ils se cumulent (le plus bas gagne pour chaque valeur).

### 6.1 Fiches admissibles (règle V-ADM)
1. `statut` ∈ {`utilisable`, `verifie`} (règle 22 ; test F0/F3).
2. `schema` dans les schémas de l'emplacement (§2.2).
3. Fiche « pleine » d'abord : `couverture` absent **et** le muscle principal exigé par l'emplacement est dans `muscles_principaux`. Les fiches `couverture: substitut`, ou sans le muscle exigé (ex. `oiseau-halteres` en tirage H : `deltoides_posterieurs` seulement), ne servent qu'en §7.
4. `niveau_min` <= niveau de la personne (ordre : debutant < intermediaire < avance).
5. Règle 23 (CLAUDE.md) : aucune variante avec le tag `materiel_specialise` si lieu = maison ou niveau = débutant ; aucune fiche « technique » (épaulé, arraché, jeté et dérivés) pour un débutant ni à la maison : **aucune fiche de ce type n'existe aujourd'hui** ; dès qu'il y en aura, les marquer par un champ de fiche (proposition : `technique: oui`, à ajouter par `dev` à format-fiches.md) et les exclure ici. En v1, par prudence, une fiche `technique: oui` n'est proposée à **personne** (NON SOURCÉ).
6. Fiches dédiées au cou (`NECK_DEDICATED_IDS`) : jamais dans un emplacement (C2) ; seulement en échauffement selon §4.3.

### 6.2 Matériel (règle V-MAT)
- Ensemble disponible = tags `implicite` de materiel-tags.json **moins** `disabledImplicit` **plus** `EquipmentProfile.tags`. Les objets du quotidien (`sac_a_dos`, `bidons_ou_sacs`, `box_ou_step`, `partenaire_ou_ancrage`) ne sont **jamais** implicites (equipment-taxonomy.md §2).
- Une variante est compatible si **tous** ses `materiel_tags` sont dans l'ensemble (equipment-taxonomy.md §1 ; test F3).
- Variante chargeable dont le profil n'a aucun poids renseigné (ex. `halteres` coché, liste vide) : compatible, mais charge de départ à saisir à la première série (§5.2).
- Lieu = salle : on suppose le profil F seulement si la personne ne l'a pas modifié (`preset` = F) ; sinon on suit les tags cochés.

### 6.3 Échelon selon le niveau (règle V-ECHELON)
Parmi les variantes compatibles et non retirées d'une fiche :
- débutant : la variante d'**échelon le plus bas** disponible (échelon de départ) ;
- intermédiaire : **un échelon sous** l'échelon le plus haut dont le `niveau` <= `intermediaire` (minimum : échelon 1) ; ex. `pompe` : échelon le plus haut permis = 5 (`pompe-pieds-sureleves`), départ = 4 (`pompe-sol`). **Choix par défaut prudent, en attente de l'utilisateur** (NON SOURCÉ).
- avancé : l'échelon le plus haut dont le `niveau` <= `avance` (NON SOURCÉ).
- **Sous un plafond de sécurité** (fiche `capped` par R2 ou `charge:legere`, grossesse cochée) : l'**échelon le plus bas** disponible, quel que soit le niveau, pour une variante **sans historique** (aucune série faite de cette variante) ; avec historique : la variante et la dernière charge faite sans douleur sont conservées, sans hausse (choix par défaut prudent, en attente de l'utilisateur ; même règle que P-CAP et P-GROS, §6.0).
- Dans tous les cas, l'étalonnage (§5.2) redescend d'un échelon si la première série est trop dure (baisse toujours permise, §6.8 point 1b).
- À échelon égal (variantes qui ne changent que le matériel), départage dans cet ordre : (a) famille `force` ou `muscle` : variante chargeable d'abord (SRC1 : la force dépend surtout de la charge ; equipment-taxonomy.md §3 point 3), ordre des tags : `barre` > `halteres` > `kettlebell` > `machine` > `poulie` > `elastique` > autres ; famille `sante` : variante avec le moins de tags ; (b) moins de tags ; (c) ordre du tableau de la fiche.
- Haltères qui ne montent pas assez (charge de travail estimée > poids maximal du profil, connu après étalonnage) : phase 3 (échelon unilatéral ou plus dur) ; en v1, rien.

### 6.4 Blessures : cases garder / adapter / retirer (règle V-BLESS ; source : regles-securite-communes.md §0, R1-R3 et format-fiches.md §4, qui font foi)
Pour chaque zone active (niveau effectif = `effectiveLevel` : cou après un choc = 3, C3), lire la case de la fiche pour ce niveau ; zone absente du tableau = `garder`.
| Case | Action du générateur |
|---|---|
| `garder` | rien |
| `adapter: variante:<id>` | remplacer la variante par `<id>` (id de fiche = son échelon 1) ; si `<id>` est incompatible avec le matériel, ou lui-même adapté/retiré par une autre zone active ou par la grossesse : variante suivante qui convient, sinon autre fiche du même schéma (§0 de regles-securite-communes) |
| `adapter: charge:legere` | `capped = true`, charge de départ = la plus légère, jamais augmentée |
| `adapter: sans-charge` | choisir une variante de la fiche sans aucun tag chargeable ; s'il n'y en a pas : traiter comme `retirer` |
| `adapter: amplitude:<v>` / `adapter: appui:<v>` | garder la variante, `adaptation` = la valeur (affichée avec la note `<zone>-n<niveau>` de la fiche) |
| `retirer` | fiche exclue ; autre fiche du même emplacement |
| `retirer: remplacant:<id>` | fiche exclue ; `<id>` proposé à sa place s'il passe tous les filtres de §6 ; sinon autre fiche du même emplacement |
| `retirer: sans-zone:<id>` (niveau 3) | seule la variante `<id>` reste permise |
- Plusieurs zones : la case la plus prudente gagne (retirer > adapter > garder) ; deux `adapter: variante:` différents : le niveau le plus élevé gagne, à niveau égal la variante d'échelon le plus bas, et elle doit être compatible avec toutes les zones actives (D3, §0).
- Niveau 2 : `capped = true` (aucune hausse de charge ni d'échelon, R2) sur tout exercice « de la zone », c'est-à-dire toute fiche qui a une ligne pour cette zone, quelle que soit la case. Interprétation de R2 par `coach`, NON SOURCÉ : **confirmée par `kine` le 23/10 avec les précisions du §6.8 (kine 23/10)**.
- Niveau 3 : message R3 affiché une fois par zone (§8).
- Zones `cuisse` et `aine` : une fiche sans ligne pour ces zones n'est **jamais** choisie comme remplaçant pour une gêne cuisse/aine (§0, décision `kine` du 22/10).
- Statut : règles du projet, NON SOURCÉ (R1-R3) sauf mentions de regles-securite-communes.md.

### 6.5 Filtre cou (règle V-COU ; C1, C2, C3)
- Appliquer `filterByNeck(fiches, blessures)` (src/data/injury-rules.ts) avant §6.3.
- Zone `cou` au niveau 1 ou 2 : le générateur **peut** ajouter 1 fiche `doux_pour: [cou]` dédiée (`rotation-douce-cou`, `inclinaison-douce-cou`, `retraction-cervicale`) à l'échauffement à la place d'une fiche E2 (jamais obligatoire ; retenu : oui, 1 fiche, la première de cette liste qui passe les filtres ; NON SOURCÉ). `retraction-omoplates` reste une fiche normale (C2).
- Zone `cou` au niveau 3 (ou `afterShock`) : aucune fiche douce ni dédiée ; message C3 ou R3.

### 6.6 Grossesse et post-partum (règle V-GROS ; G4, G5, G7) : seulement si le réglage est coché
- La ligne `**Grossesse**` de chaque fiche s'applique comme une zone supplémentaire (même grammaire, mêmes priorités) ; un remplaçant que sa propre ligne Grossesse retire n'est jamais proposé ; un remplaçant que sa ligne classe `adapter` n'est proposé que dans sa version adaptée (§0).
- Plafonds : P-GROS de §6.0 (dose ramenée à `sante`, séries G5, réserve >= 3, pas de superset, E3 léger, séance <= 60 min avec V-MSG-GROS-DUREE).
- Post-partum : aucune fiche de schéma `saut` (G7) ; aucune variante cardio avec saut à l'échauffement (déjà exclu : E1 = échelon 1 sans saut).
- Messages G1 (et G2) affichés à la coche du réglage, pas par le générateur.
- Statut : G4 PROVISOIRE, G5 OK (repères HAS) / PROVISOIRE (codage), G7 PROVISOIRE.

### 6.7 Classement des fiches restantes (règle V-CLASSE), déterministe
Clés dans l'ordre :
1. Fiche pleine (§6.1 point 3).
2. Aucune case `adapter` active (une fiche sans adaptation passe avant une fiche adaptée ; NON SOURCÉ, prudence).
3. Familles `force` et `muscle`, fiches de `type` force : au moins une variante compatible chargeable (`force` : SRC1, la force dépend surtout de la charge ; `muscle` : NON SOURCÉ, progression plus simple à mesurer). Puis, pour un intermédiaire ou un avancé : fiche dont au moins une variante compatible a un `niveau` égal au sien (NON SOURCÉ : évite un pilier trop facile). **Cette sous-clé est désactivée sous plafond** (fiche qui serait `capped` par R2 ou `charge:legere`, ou réglage grossesse coché) : on préfère alors la fiche de `niveau_min` le plus bas (V-PRIO).
4. Exercice polyarticulaire bilatéral d'abord pour les piliers (SRC2 : privilégier les mouvements bilatéraux polyarticulaires, OK) : nombre de `muscles_principaux` >= 2, puis variante non unilatérale.
5. Préférences de la personne (favoris d'abord, fiches masquées exclues) quand elles existeront.
6. Fiche pas encore utilisée dans la semaine pour ce même emplacement (rotation A/C, §2.3).
7. `id` dans l'ordre alphabétique.
La même fiche ne peut pas occuper deux emplacements dans la même séance.

### 6.8 Précisions sécurité de `kine` (23/10) : R2, douleur pendant la séance, signes d'arrêt, exclusions
Statut de tout ce §6.8 : choix de prudence, **NON SOURCÉ** sauf mention (R2 l'est déjà ; R4 PROVISOIRE ; R5, signes S1-S3 de regles-securite-communes.md §5, U1, C4 selon regles-securite-communes.md). À contrôler par `relecteur`.
1. **R2, ce que « capped » gèle (kine 23/10)** : « exercice de la zone » = toute fiche qui a une ligne pour la zone, **quelle que soit la case** (`garder` compris). Raison : `regles-securite-communes.md` §0 impose une ligne dès que l'exercice charge la zone, y compris en muscle secondaire pour `cuisse` et `aine` (D11) ; la présence de la ligne est donc le bon repère. Interprétation **confirmée**. Précisions : (a) `capped` gèle toute hausse : charge, échelon, répétitions cibles au-dessus de la fourchette de départ, durée de maintien (`holdSec`), nombre de séries (le « +1 série » et l'ajout d'emplacement de V-VOL ne s'appliquent pas à une fiche `capped` : V-MSG-VOL à la place), passage à une version unilatérale ou plus lente ; (b) toute **baisse** reste permise (étalonnage qui redescend, « ça fait mal », échelon - 1) ; (c) plusieurs zones : `capped` si **au moins une** zone active au niveau 2 a une ligne dans la fiche, même si une autre zone la retire ou l'adapte ; (d) le plafond suit la fiche, donc aussi une variante ou un remplaçant placé à la place d'une autre fiche ; (e) variante sans historique sous `capped` : charge de départ = la plus légère (comme `charge:legere`), jamais l'habituelle déclarée par la personne ; avec historique : dernière charge faite sans douleur, sans hausse ; (f) levée du plafond : seulement quand la personne passe la zone au niveau 1 ou 0 elle-même (R7 : nouvel étalonnage) ; l'app ne lève jamais le plafond toute seule ; (g) affichage : une ligne courte « Charge maintenue : gêne {zone} » sur l'exercice ; (h) les fiches d'échauffement E2 (pas de progression) sont concernées sans effet, aucun traitement particulier. Niveau 1 : pas de plafond par la zone (seule la case `charge:legere` en met un).
2. **Douleur pendant la séance (R4, PROVISOIRE ; lecteur de séance F5, le générateur fournit les données)** : à chaque série, un bouton « Ça fait mal » (texte d'aide : « douleur dans une articulation, vive ou inhabituelle ; pas la brûlure du muscle qui travaille »). Appui : (i) l'exercice s'arrête, les séries restantes de cet exercice sont annulées, aucune hausse (R2/R4) ; (ii) l'app demande la zone (les 10 zones + « je ne sais pas »), facultatif ; (iii) la fiche de l'exercice est proposée à la séance suivante avec `**Version plus douce**` si elle passe tous les filtres de §6, sinon la même variante sans hausse ; (iv) le programme n'est pas régénéré en cours de séance ; (v) `SetLog.pain = true` + zone. Compteur : deux **séances consécutives** avec « ça fait mal » sur la même zone -> l'app **propose** de passer la zone au niveau 2 (si 0 ou 1) ou 3 (si 2), la personne confirme ; jamais de changement automatique, jamais de baisse automatique. Zone « je ne sais pas » : pas de compteur, mais signe S1 (message « consulte si ça persiste ») après la 2e séance de suite avec douleur. Le seuil « 2 séances » reste NON SOURCÉ (R4).
3. **Signes d'arrêt (R5, PROVISOIRE ; signes S1-S3 de regles-securite-communes.md §5 ; U1 ; C4 ; G6)** : un bouton « J'ai un symptôme » toujours visible dans le lecteur de séance ouvre la liste R5 (poitrine/cou/mâchoire/bras, malaise, vertige, essoufflement anormal, palpitations) : arrêt de la séance ; poitrine qui ne passe pas au repos, malaise grave : U1 affiché d'abord (U2 : jamais derrière une autre question). Les signes S2 (regles-securite-communes.md §5) (gonflement, perte de force, engourdissement, nuit) s'affichent quand une zone passe au niveau 2 ou 3. Zone `cou` : paliers C4 (le vertige, même léger, arrête la séance). Grossesse cochée : liste G6 en plus. Aucun diagnostic, aucun nom de maladie. Ces écrans sont fixes (non générés) : le générateur ne les décide pas.
4. **Plusieurs zones** (confirmé et précisé) : case la plus prudente par zone et par fiche (§6.4) ; le plafond `capped` s'ajoute (point 1c) ; si le profil retire tout un schéma, V-MSG-ZONE cite **chaque** zone en cause (pas seulement la première) ; si 3 emplacements du noyau ou plus (sur 5) sont vides à cause de zones au niveau 3, le message de §9 (« demande l'avis d'un professionnel ») prime sur tout programme partiel.
5. **Filtre cou (V-COU)** : conforme à C1-C3. Précisions : la fiche douce de l'échauffement doit elle aussi passer les filtres grossesse et autres zones ; elle ne remplace jamais E1 ; si `afterShock` ou niveau 3, aucune fiche cou même si la personne la demande (C2 « demande explicite » ne s'applique qu'aux niveaux 1 et 2) ; `afterShock` ne se lève que par mise à jour de la personne.
6. **Grossesse / post-partum (V-GROS)** : conforme à G4, G5, G7. Précisions : la durée « sans limite » (§9 : cible 60, plafond 75) est ramenée à **60 min maximum** quand le réglage est coché ; G5 « 2-3 séances par semaine » reste couvert par 2 ou 3 jours (jamais plus) ; aucun ajout de séries de V-VOL au-delà du plafond G5 ; les séries d'échauffement E3 restent légères ; la fiche douce cou et les fiches de mobilité couchées sur le dos suivent leur ligne Grossesse. La personne qui n'a pas coché le réglage reçoit un programme normal : seul le rappel de lancement (G1/D) la prévient.
7. **Exclusions** : le générateur ne vérifie ni l'âge ni une pathologie (D : aucun dépistage). Le projet les couvre à l'entrée (majeurs seulement, avertissement « pas un avis médical »). Pathologie connue, traitement ou avis médical contraire : l'avertissement renvoie au professionnel ; le générateur ne tente pas de la deviner. Nutrition (grossesse, pathologie, trouble alimentaire) : hors de ce fichier (nutrition-rules.md).
8. **Tests ajoutés (pour `dev`)** : T33 zone n2 + fiche avec ligne `garder` -> `capped = true` ; T34 fiche `capped` -> aucun +1 série V-VOL ; T35 fiche `capped` sans historique -> charge de départ la plus légère ; T36 « ça fait mal » zone X deux séances de suite -> proposition (non automatique) de niveau supérieur ; T37 grossesse + durée « sans limite » -> séance <= 60 min ; T38 deux zones (n2 et n3) retirant le même schéma -> V-MSG-ZONE cite les deux.

## 7. Schéma impossible, substitut, achat le plus utile (règle V-IMPOS)
Principe : equipment-taxonomy.md §4 (« le dire clairement et proposer le meilleur substitut + l'achat le plus utile »). Ordre et calcul ci-dessous : NON SOURCÉ (choix de conception).

### 7.1 Ordre de repli pour un emplacement vide après §6
| Ordre | Repli | Compte pour le grand groupe ? | Message |
|---|---|---|---|
| a | fiche pleine du même plan (§6) | oui | — |
| b | fiche pleine de l'autre plan du même groupe (tirage_v <-> tirage_h, poussee_v <-> poussee_h, squat <-> fente), si elle n'est pas déjà dans la séance | oui | V-MSG-PLAN (information) |
| c | fiche `couverture: substitut` du même schéma (ou sans le muscle exigé), classée par §6.7 | à moitié (§2.1) | V-MSG-SUBST |
| d | fiche substitut de l'autre plan | à moitié | V-MSG-SUBST |
| e | rien | non | V-MSG-IMPOS ; puis V-MSG-FREQ si le groupe tombe sous 2 fois/semaine |
Cause du vide : si au moins une fiche aurait convenu sans les blessures ou la grossesse, la cause est « santé » : message V-MSG-ZONE, **jamais** de suggestion d'achat ; sinon la cause est « matériel ».

État de la bibliothèque au 23/10/2026 (node tools/couverture.mjs et inventaire des fiches utilisables : 138 au moment de la rédaction, 140 au contrôle du 23/10), cas prévisibles :
| Profil | Emplacement | Résultat attendu |
|---|---|---|
| implicites seuls (sans objet coché) | tirage H | aucune fiche pleine -> c : `retraction-omoplates`, `ecartement-serviette` ou `ytw-sol` (substituts) ; achat : élastique (ou cocher un sac à dos : `rowing-sac-a-dos`) |
| implicites seuls | tirage V | b : aucune fiche pleine de tirage H non plus -> c : `tirage-vertical-serviette`, `tirage-vertical-allonge-ventre`, `tirage-w-allonge` |
| débutant avec barre de traction, sans élastique | tirage V | `traction-barre` est `intermediaire` -> b : rowing si haltères, sinon c ; achat : élastique (traction assistée plus tard, tirage vertical à l'élastique dès maintenant) |
| implicites seuls | porté (emplacement 9) | aucune fiche -> pas de porté, message « coche un sac à dos ou des bidons dans Mon matériel » |
| tous, **hors grossesse** | poussée V | `pompe-piquee` (débutant, poids du corps) : couvert ; grossesse cochée : `pompe-piquee` est retirée (remplaçant `pompe-chaise`, poussée H) -> repli b ou variante avec haltères assis selon le profil |

### 7.2 Achat (ou objet) le plus utile (règle V-ACHAT)
- Candidats, dans cet ordre de départage : `sac_a_dos`, `bidons_ou_sacs` (objets à cocher, gratuits), `elastique` (avec un vrai ancrage de porte, R8 §7), `halteres`, `barre_traction`, `banc`, `kettlebell`.
- Pour chaque candidat absent du profil : relancer §6-§7.1 sur la semaine avec ce tag ajouté et compter les emplacements (séance x emplacement) qui passent de c, d ou e à a ou b. Retenir le candidat qui en gagne le plus ; égalité : ordre de la liste. Rien si le gain est 0 ou si toutes les causes sont « santé ».
- Un seul message par programme (V-MSG-ACHAT ou V-MSG-OBJET).

## 8. Explication de 2 lignes et messages
Ton : phrases courtes, tutoiement, aucune promesse de résultat, aucun diagnostic. Textes NON SOURCÉ (rédaction), sauf ceux repris tels quels des règles de sécurité.

### 8.1 Explication affichée (règle V-EXPL ; goal-resolver.md règle 6), exactement 2 lignes
Ligne 1 = rythme + structure ; ligne 2 = objectif + réglage principal. Variables entre accolades.
| Cas | Ligne 1 | Ligne 2 |
|---|---|---|
| 3 jours, m = 3 (m = nombre minimal de séances qui couvrent un grand groupe, calculé sur la semaine **finale**, après plafonds et retraits de l'action 6 : V-PRIO point 5) | « 3 séances par semaine en corps entier : chaque grand muscle travaille 3 fois. » | selon la famille, ci-dessous |
| 3 jours, m = 2 (retraits de l'action 6 tournés) | « 3 séances par semaine en corps entier : chaque grand muscle travaille au moins 2 fois. » | idem |
| 3 jours, m < 2 | « 3 séances par semaine en corps entier ; {groupe} ne tient pas dans {durée} min. » | idem |
| 2 jours, m = 2 | « 2 séances par semaine en corps entier : chaque grand muscle travaille 2 fois. » | idem |
| 2 jours, un groupe < 2 fois | « 2 séances par semaine en corps entier ; {groupe} ne tient pas dans {durée} min. » | idem |
| famille `muscle` | — | « Objectif muscle : {séries} séries de {rmin}-{rmax} répétitions, en gardant environ {rir} répétitions en réserve. » |
| famille `force` | — | « Objectif force : les gros mouvements d'abord, charges lourdes ({rmin}-{rmax} répétitions) et repos longs. » |
| famille `force` sans charge | — | « Objectif force : sans charges lourdes, on progresse par des variantes plus dures ; la force maximale progresse mieux avec des charges. » |
| famille `sante` | — | « Objectif forme : des séances simples et régulières, sans aller jusqu'à l'échec. » |
| réglage grossesse / post-partum coché (P-GROS, remplace la ligne 2 de la famille) | — | « Grossesse ou après un accouchement : séances modérées, {séries} série(s) de 10 à 15 répétitions, sans effort maximal. » |
| objectif rang 1 ramené (§1.3) | — | préfixe « {objectif} : en attendant la version dédiée, » puis la phrase de la famille, raccourcie à une ligne |

### 8.2 Messages (identifiants à citer dans le code)
| Id | Déclencheur | Texte |
|---|---|---|
| V-MSG-FREQ | un grand groupe couvert < 2 fois/semaine (program-logic.md §2 ; CLAUDE.md règle 15) | « {Groupe} n'est travaillé que {n} fois par semaine. Le repère est d'au moins 2 fois. Pour corriger : {allonger la séance à X min / ajouter un jour / ajouter du matériel}. » |
| V-MSG-PLANS | 2 jours et N < 7 | « Poitrine et dos sont travaillés une fois à plat, une fois vers le haut. » |
| V-MSG-PLAN | repli b | « Pas de {schéma} possible ici : {exercice} le remplace. » |
| V-MSG-SUBST | repli c ou d | « Avec ton matériel, pas de vrai {schéma} : {exercice} le remplace en partie. » |
| V-MSG-IMPOS | repli e | « {Schéma} : aucun exercice possible avec ton matériel. » |
| V-MSG-ZONE | cause santé | « {Schéma} retiré à cause de la gêne déclarée ({zone}). » (+ message R3 si niveau 3 : « Douleur signalée : demande l'avis d'un professionnel de santé avant de reprendre les exercices de cette zone. ») |
| V-MSG-ACHAT | §7.2, candidat acheté | « L'achat le plus utile pour toi : {un élastique avec un ancrage de porte}. Il permet {n} exercice(s) de plus. » |
| V-MSG-OBJET | §7.2, objet du quotidien | « As-tu {un sac à dos} ? Coche-le dans Mon matériel : il permet {n} exercice(s) de plus. » |
| V-MSG-FORCE | famille force sans variante chargeable pour un pilier | « La force maximale progresse surtout avec des charges lourdes. Sans elles, on travaille avec des variantes plus difficiles. » (SRC1, OK) |
| V-MSG-VOL | famille muscle, muscle sous 10 séries/semaine | « {Muscle} : {n} séries par semaine, sous le repère de 10 pour la prise de muscle. Allonge la séance ou ajoute du matériel. » (SRC1, OK) |
| V-MSG-DUREE | action 6 de §4.4 atteinte, ou séance de piliers seuls encore > D | « {Durée} min, c'est court pour un corps entier complet : {exercices retirés} ont été retirés. » |
| V-MSG-JOURS | §2.4, jours non espacés | « Tes jours libres ne laissent pas 48 h entre deux séances : on part sur 2 séances ({jours}). » |
| V-MSG-HORS | 1 ou 4-6 jours | « Ce rythme arrive dans une prochaine version. Choisis 2 ou 3 jours pour l'instant. » |
| V-MSG-JOURS2 | 2 jours demandés, **ou 3 jours ramenés à 2** (§2.4), et écart minimal < 2 jours entre les jours libres (y compris un seul jour libre) | « Tes jours libres se suivent : il faut environ 48 h entre deux séances du corps entier. Essaie d'ajouter un jour d'écart (par exemple {jour proposé}) dans tes jours disponibles. » + bouton « Modifier mes jours » qui ouvre la carte des jours bloqués (décision D15 point 6 : prudence gardée, message clair plutôt qu'un simple refus). {jour proposé} = le premier jour bloqué (lundi d'abord) qui donnerait un écart >= 2 jours avec un jour libre ; s'il n'y en a pas, la phrase sans exemple |
| V-MSG-PRO | P-ZONE3 : 3 emplacements du noyau ou plus vides à cause de zones au niveau 3 | « Avec les gênes déclarées, l'app ne peut pas proposer de séance sûre. Demande l'avis d'un professionnel de santé. » |
| V-MSG-GROS-DUREE | grossesse / post-partum coché et durée choisie > 60 min ou « sans limite » | « Grossesse ou après un accouchement : séances de 60 min au plus. Ta séance est ramenée à 60 min. » |

## 9. Cas limites et valeurs par défaut (règle V-DEF)
| Situation | Comportement | Statut |
|---|---|---|
| niveau absent | `debutant` | NON SOURCÉ (prudence) |
| objectif absent | famille `sante` | NON SOURCÉ |
| durée absente | 45 min | NON SOURCÉ |
| durée « sans limite » | N = 7, cible 60 min affichée, plafond 75 min ; grossesse cochée : 60 min (P-GROS, V-MSG-GROS-DUREE) | NON SOURCÉ |
| durée 75 min et grossesse cochée | D = 60 min, V-MSG-GROS-DUREE | G5 (§6.8 point 6) |
| durée < 20 min | ramenée à 20 min avec message | NON SOURCÉ |
| jours = 1 ou 4-6 | aucun programme, V-MSG-HORS | phase-2-criteres F1 |
| profil matériel vide (tous implicites décochés) | seul `poids_du_corps` reste ; programme généré avec les fiches compatibles ; messages V-IMPOS/V-SUBST et V-ACHAT | NON SOURCÉ |
| aucun poids d'haltère renseigné | variantes haltères permises, charge saisie à la 1re série (§6.2) | NON SOURCÉ |
| 3 emplacements du noyau ou plus (sur 5) vides à cause de zones au niveau 3, comptés après les replis a à d du §7.1 (définition de P-ZONE3) (harmonisé avec §6.8 point 4 : « plus de la moitié ») | **aucun programme**, même partiel ; V-MSG-PRO | NON SOURCÉ (prudence, R3) |
| 1 ou 2 emplacements du noyau vides à cause de zones au niveau 3 | programme partiel ; V-MSG-ZONE (chaque zone citée) + R3 ; V-MSG-FREQ pour les groupes non couverts ; aucun achat proposé | NON SOURCÉ (R3) |
| tous les emplacements vides pour une cause « matériel » (impossible aujourd'hui : `pompe-piquee`, `squat-poids-du-corps`, `pont-fessier`, `planche` n'ont besoin que d'implicites) | aucun programme ; V-MSG-IMPOS + V-MSG-ACHAT | NON SOURCÉ |
| zone au niveau 3 qui retire tout un groupe | groupe non couvert, V-MSG-ZONE + R3, V-MSG-FREQ ; pas d'achat proposé | R3 (NON SOURCÉ) |
| même fiche seule possible pour deux emplacements d'une séance | placée une seule fois ; le second emplacement passe au repli suivant | NON SOURCÉ |
| historique contient la variante | pas d'étalonnage ; charge de départ = dernière charge sans douleur (la double progression vient en phase 3) | NON SOURCÉ |
| « ça fait mal » à la dernière séance pour un exercice | même variante, pas de hausse, version plus douce proposée (`**Version plus douce**` de la fiche, si elle passe les filtres) | R4 (PROVISOIRE) |
| profil modifié (matériel, blessure, niveau, jours, durée) | régénérer le programme ; garder les variantes déjà en place si elles passent encore tous les filtres (stabilité du bloc) | program-logic.md §7 (NON SOURCÉ) |
| deux fiches à égalité parfaite | ordre alphabétique de l'`id` (§6.7) | conception |
| grossesse cochée + niveau absent | débutante (1 série par exercice, P-GROS) | G5 / prudence |

## 10. Ce qui reste NON SOURCÉ ou PROVISOIRE (à valider avant codage en dur, règle 10)
**OK (sourcé, lu)** : 2 séances/semaine minimum et tous les grands groupes (SRC1, SRC13) ; au moins 2 séries par exercice ; 2-3 séries par séance pour la force (tableau 6) ; >= 10 séries par muscle et par semaine pour l'hypertrophie, plateau 18-20 (SRC1 ; son usage comme plafond de 20 séries est NON SOURCÉ) ; >= 4 séries/semaine en minimum (SRC2) ; charges >= 80 % pour la force, large gamme pour l'hypertrophie (SRC1, SRC9) ; pas d'échec nécessaire, cible 2-3 en réserve (SRC1) ; repos 60-120 s non entraînés, > 2 min entraînés pour la force (SRC4), > 60 s et rien de détecté au-delà de ~90 s pour l'hypertrophie (SRC5) ; exercice prioritaire en début de séance pour la force, ordre libre sinon (SRC1, SRC12) ; supersets antagonistes sans perte de volume (SRC10, SRC2) ; échauffement spécifique utile à la performance, rien sur les blessures (SRC11, SRC2) ; estimation de la réserve à ~1 répétition près, moins fiable > 12 (SRC7) ; progression par répétitions aussi efficace que par charge (SRC8, pour la phase 3).
**PROVISOIRE** : assimilation intermédiaire/avancé = « entraîné » de SRC2 et SRC4 ; principe de variation systématique (Kassiano 2022) ; plafond 10 séries fractionnaires par muscle et par séance et méthode de comptage (SRC3, préprint) ; 48 h entre deux séances (ACSM 2009/2011 via synthèses) ; correspondance 4-6 répétitions ≈ charges lourdes ; borne haute 15 répétitions (extrapolée de SRC7, SRC9) ; marge de 2 répétitions pour l'ajustement d'étalonnage ; codage des repères grossesse (G4, G5, G7) ; porté en fin de séance.
**NON SOURCÉ (choix de conception prudents, à valider par l'utilisateur)** : découpage en 5 grands groupes et noyau de 5 emplacements ; gabarit A/B/C et alternance des plans ; bloc de 4 semaines ; correspondance des objectifs (§1.3) ; séries à 2 pour les débutants ; réserve 3 pour débutants et santé, 1 réservée aux variantes sûres ; valeurs exactes de repos dans les fourchettes ; tout §3.3 (maintiens, portés, répétitions par côté) ; contenu et durées de l'échauffement, pourcentages des séries E3 ; 4 s par répétition, 60 s de transition, 15 s dans un superset ; N d'exercices par durée et ordre de retrait ; plafonds 8 exercices / 24 séries / 4 séries par exercice ; règles de superset (paires P1-P3, interdits des piliers et de la charnière, réserve de SRC2) ; règle de priorité V-PRIO et plafonds P-CAP, P-GROS (mécanique ; contenu à relire par `kine`) ; « famille ramenée à `sante` » en grossesse ; échelon le plus bas sous plafond ; lecture du bouton « 4+ » ; rotation de l'ordre de retrait en 3 jours ; aucun programme si 2 jours libres consécutifs ou si 3 emplacements du noyau sont vides (niveau 3) ; rotation « fiche différente en A et C » ; charge de départ et règle d'ajustement de l'étalonnage ; échelon pour intermédiaire et avancé ; départages ; repli et achat le plus utile ; tous les textes de messages ; valeurs par défaut de §9 ; interprétation de R2 « exercice de la zone ».

### 10.1 Questions pour l'utilisateur et choix par défaut
**Règle pour `dev` (CLAUDE.md règle 10)** : les choix par défaut 1 à 5 ci-dessous, et plus largement toutes les valeurs NON SOURCÉ de ce fichier, sont codés comme des **réglages modifiables** (constantes nommées, regroupées dans un seul fichier de configuration du générateur, avec la référence de la règle V-… en commentaire), **jamais en dur dans la logique** ; leur valeur peut changer après la réponse de l'utilisateur sans toucher au code du générateur.

Choix par défaut prudents, **en attente de l'utilisateur** :
1. Échelon de départ d'un **intermédiaire** : un échelon sous le plus haut de son niveau (§6.3).
2. Gainage 20-30 s, porté 30-40 s, 2 séries (§3.3).
3. Bloc de 4 semaines (§2.3).
4. « Perte de gras » = paramètres `muscle` + phrase sur l'alimentation (§1.3).
5. Sous plafond (R2, `charge:legere`, grossesse), variante sans historique : charge de départ la plus légère et échelon le plus bas, même pour un intermédiaire (§5.2, §6.3, §6.0).

Réponses de l'utilisateur (DECISIONS-utilisateur.md, D15 point 6, 23/10/2026) :
6. Séance de 20 min en 3 jours : **acceptée** avec l'avertissement V-MSG-FREQ ; pas de minimum de 30 min (§2.1, §4.4).
7. Jours libres consécutifs seulement : **prudence gardée** (aucun programme risqué), avec le message V-MSG-JOURS2 « essaie d'ajouter un jour d'écart » et un bouton vers les jours disponibles (§2.4, §8.2).

### 10.2 Demandes à `dev` (pas de valeur sportive)
`InjuryZone` + `cuisse`, `aine` ; réglage « enceinte / post-partum » dans le profil ; lieu maison/salle dans le profil s'il manque ; champs `SetLog` et `PlannedExercise` de §5.3 ; champs de fiche `unilateral: oui` et `technique: oui` (format-fiches.md + validate-fiches.mjs) ; option profil « gagner du temps (supersets) » et « ajouter du fonctionnel ».

## 11. Tests que `dev` doit écrire (entrée -> résultat attendu)
Profils de matériel A à F = ceux de tools/couverture.mjs, **plus** un profil A0 = implicites seuls (sans objet du quotidien). Chaque test cite la règle.
| n° | Entrée | Résultat attendu | Règle |
|---|---|---|---|
| T1 | toute combinaison {A0, A-F} x {maison, salle} x {2, 3 jours} x {3 niveaux} x {muscle, force, sante} x {30, 45, 60 min} | aucune fiche hors `utilisable`/`verifie` ; chaque variante a tous ses tags dans le profil ; T <= durée choisie, **sauf** séance réduite aux piliers seuls qui dépasse encore D (alors V-MSG-DUREE avec la durée réelle, cas de T3bis) ; deux appels identiques donnent un résultat identique (déterminisme) | V-ADM, V-MAT, V-DUREE |
| T2 | même balayage, 3 jours, durée >= 30 min | chaque GG1-GG5 couvert >= 2 fois/semaine (ou V-MSG-FREQ présent si et seulement si un groupe < 2) | V-FREQ |
| T3c | `ajusterDuree` sur la séance A de l'exemple 3 construite à la main (5 fiches et doses fixées dans le test, indépendant de la bibliothèque) | 1 456 s -> action 5 -> 1 351 s -> retrait de `tronc` -> 1 191 s | V-DUREE |
| T3 | 2 jours, 20 min, débutant, `sante`, profil C, séance A (**dépend de la bibliothèque du 23/10/2026**, comme T4 : à recalculer si les fiches changent ; la partie calcul est couverte par T3c) | fiches et calcul de l'exemple 3 de §4.4 : T = 1 456 s, puis action 5 (1 351 s), puis retrait de `tronc` seul -> T = 1 191 s ; `charniere` et les piliers restent ; V-MSG-DUREE ; V-MSG-FREQ contient au moins GG5 (la séance B peut en ajouter) | V-DUREE, V-FREQ |
| T3bis | 3 jours, 20 min, même profil | ordre de retrait tourné (A : `tronc` ; B : `charniere` en premier ; C : `tirage_1` en premier) ; un groupe retiré dans une seule séance reste couvert 2 fois et n'a pas de V-MSG-FREQ ; si une séance de piliers seuls dépasse encore D : durée réelle affichée + V-MSG-DUREE | V-DUREE |
| T4 | profil A0, 3 jours, intermédiaire, muscle, 45 min (N = 6, pas d'emplacement `tirage_2`) | tirage H = une fiche substitut (`retraction-omoplates`, `ecartement-serviette` ou `ytw-sol`), V-MSG-SUBST ; un seul message d'achat calculé par §7.2 ; avec la bibliothèque du 23/10/2026 : élastique et sac à dos gagnent chacun 3 emplacements (tirage H en A et C ; tirage V en B ou, pour le sac, repli b) -> égalité -> V-MSG-OBJET « sac à dos » (à recalculer si la bibliothèque change) | V-IMPOS, V-ACHAT |
| T5 | débutant, profil `barre_traction` + implicites | `traction-barre` jamais proposée (niveau intermédiaire) | V-ADM 4 |
| T6 | débutant, toutes combinaisons | chaque variante choisie a l'échelon le plus bas disponible de sa fiche ; aucune fiche `niveau_min` > debutant | V-ECHELON, V-ADM |
| T7 | lieu maison ou débutant, profil contenant `materiel_specialise` | aucune variante avec ce tag | V-ADM 5 (règle 23) |
| T8 | blessure genou niveau 3 | aucune fiche dont la case genou n3 est `retirer` ; `sans-zone:<id>` seule variante permise de sa fiche ; message R3 affiché | V-BLESS |
| T9 | épaule niveau 1 sur `pompe` (case à lire dans la fiche) | case appliquée exactement (garder / adapter / retirer) ; si `adapter: variante:<id>`, la variante placée est `<id>` | V-BLESS |
| T10 | genou n1 -> `adapter: variante:X` et dos n2 -> `adapter: variante:Y` sur la même fiche | Y retenue (niveau le plus élevé) si compatible avec toutes les zones, sinon variante suivante ou autre fiche | V-BLESS (D3) |
| T11 | zone au niveau 2 | `capped = true` sur toutes les fiches qui ont une ligne pour cette zone | V-BLESS (R2) |
| T12 | `adapter: charge:legere` | `capped = true`, `startLoadKg` = plus petit poids du profil | V-BLESS, V-ETAL |
| T13 | remplaçant lui-même retiré par une zone active ou par la grossesse | jamais proposé ; autre fiche du même emplacement | V-BLESS (§0) |
| T14 | cou niveau 1 ou 2 | `filterByNeck` appliqué ; au plus 1 fiche `doux_pour: [cou]` en échauffement ; aucune fiche dédiée cou dans un emplacement | V-COU |
| T15 | cou niveau 3 ou `afterShock` | aucune fiche douce ni dédiée ; message C3 (choc) ou R3 | V-COU |
| T16 | aucune blessure au cou | aucune fiche de `NECK_DEDICATED_IDS` nulle part | V-COU (C2) |
| T17 | grossesse cochée, chaque famille (`muscle`, `force`, `sante`) x chaque niveau, et niveau absent | lignes Grossesse appliquées ; dose de la famille `sante` quel que soit l'objectif : répétitions 10-15 (aucun 4-6), réserve >= 3 ; **1 série** par exercice si débutante ou niveau absent, 2 sinon (jamais 3, même avancée), y compris quand l'action 7 de §4.4 dirait « 2 minimum » ; E3 : 1 seule série à ~50 % (jamais ~75 %) ; charge de départ la plus légère, échelon le plus bas ; aucun superset ; aucun ajout V-VOL ; séance <= 60 min ; ligne 2 de l'explication = texte grossesse (aucun « charges lourdes ») ; pas de V-MSG-FORCE ; `dead-bug`, `pont-fessier` jamais proposés, même comme remplaçants | V-PRIO, P-GROS, V-GROS |
| T18 | post-partum coché | aucune fiche `saut` ; E1 sans saut | V-GROS (G7) |
| T19 | 3 jours, aucun jour bloqué | lundi, mercredi, vendredi ; jamais deux séances à moins de 48 h (écarts circulaires >= 2 jours) | V-JOURS |
| T20 | 3 jours, seuls lundi-jeudi libres | 2 séances (lundi, jeudi) et V-MSG-JOURS | V-JOURS |
| T21 | 1 ou 4 jours | aucun programme, V-MSG-HORS | V-PER |
| T22 | force, intermédiaire, profil C | piliers en tête, 4-6 répétitions, repos 180 s, variante haltères choisie quand elle existe à échelon égal | V-DOSE, V-ORDRE, V-ECHELON |
| T23 | force, profil A0 | répétitions 10-15 aux piliers, V-MSG-FORCE | V-DOSE |
| T24 | superset formé | les deux exercices n'ont aucun muscle principal commun ; jamais deux exercices de jambes ; jamais le pilier `jambes_genou` ; repos de la paire = le plus long des deux | V-SUP |
| T25a | fonction `estimerDuree` sur la séance de l'exemple 1 de §4.4 (6 exercices construits à la main) | 2 644 s | V-DUREE (formule) |
| T25b | fonction `ajusterDuree(séance de l'exemple 2, D = 45 min)` (7 exercices construits à la main) | P1 formée (2 809 s), puis `tirage_2` retiré et P1 dissoute -> 2 644 s, aucune paire | V-DUREE (actions 1-2) |
| T25c | superset formé, toutes familles | jamais `jambes_genou`, `poussee_1` ni `charniere` dans une paire ; débutant : P3 seulement si `jambes_2` n'est pas chargeable | V-SUP |
| T26 | muscle intermédiaire 2 jours | volume fractionnaire calculé ; < 10 -> ajout de séries (max 4/exercice) ou V-MSG-VOL ; jamais > 20 séries/muscle/semaine ; jamais > 10 séries fractionnaires par muscle et par séance | V-VOL, V-PLAF |
| T27 | variante sans historique | `isCalibration = true` sur ses séries ; avec historique : `false` | V-ETAL |
| T28 | étalonnage : réserve 4+ et répétitions au haut de la fourchette, `capped = false` | série suivante au poids disponible supérieur ; avec `capped = true` : charge inchangée | V-ETAL |
| T29 | même emplacement dans A et C avec >= 2 fiches admissibles | fiches différentes en A et C ; identiques d'une semaine à l'autre pendant le bloc | V-ROT |
| T30 | zones au niveau 3 qui vident 3 emplacements du noyau ou plus (ex. genou, dos et épaule n3) | aucun programme, même partiel ; V-MSG-PRO | P-ZONE3, V-DEF |
| T30bis | zone au niveau 3 qui vide 1 ou 2 emplacements du noyau | programme partiel ; V-MSG-ZONE + R3 ; V-MSG-FREQ ; aucun message d'achat | V-DEF, V-IMPOS |
| T31 | sortie | explication = exactement 2 lignes, sans élément d'IA quand l'IA est coupée | V-EXPL |
| T32 | réserve cible | jamais 0 dans aucun `PlannedExercise` | V-DOSE |
| T33 | zone au niveau 2 + fiche avec une ligne `garder` pour cette zone | `capped = true` | §6.8 point 1, P-CAP |
| T34 | fiche `capped`, famille `muscle` intermédiaire sous 10 séries/semaine | aucun « +1 série » ni ajout d'emplacement pour ce muscle via cette fiche ; V-MSG-VOL | §6.8 point 1a, V-PRIO |
| T35 | fiche `capped` sans historique, personne intermédiaire ayant déclaré une charge habituelle | `startLoadKg` = plus petit poids du profil (pas la charge déclarée) ; variante poids du corps : échelon le plus bas | §6.8 point 1e, §6.3, P-CAP |
| T36 | « ça fait mal » sur la même zone deux séances consécutives | proposition (non automatique) de passer la zone au niveau supérieur ; aucun changement sans confirmation | §6.8 point 2 |
| T37 | grossesse cochée + durée « sans limite », puis + durée 75 min | séance <= 60 min dans les deux cas ; V-MSG-GROS-DUREE | §6.8 point 6, P-GROS |
| T38 | deux zones (n2 et n3) retirant le même schéma | V-MSG-ZONE cite les deux zones | §6.8 point 4 |
| T39 | étalonnage, cible 3, réserve saisie « 4+ », répétitions au haut de la fourchette, non `capped` | hausse à la série suivante ; même saisie avec cible 2 : hausse ; cible 1 et réserve 3 : hausse | §5.2 |
| T40 | intermédiaire, `pompe` admissible avec tous ses échelons, aucun plafond | variante de départ `pompe-sol` (échelon 4, un sous `pompe-pieds-sureleves`) ; avancé : échelon le plus haut permis | §6.3 |
| T41 | 2 jours demandés, seuls samedi et dimanche libres ; puis un seul jour libre ; puis 3 jours demandés avec seuls vendredi, samedi, dimanche libres | aucun programme ; V-MSG-JOURS2 avec la phrase « essaie d'ajouter un jour d'écart » et le bouton « Modifier mes jours » dans les trois cas | V-JOURS |
| T43 | grossesse cochée, étalonnage, réserve saisie « 4+ » au haut de la fourchette | aucune hausse (charge et échelon inchangés) ; `capped = true` | §5.2, P-GROS |
| T44 | grossesse cochée ou fiche `capped`, variante **avec** historique | variante et dernière charge sans douleur conservées (pas de retour à l'échelon le plus bas), aucune hausse | P-CAP, P-GROS, §6.3 |
| T45 | intermédiaire, zone genou au niveau 2, emplacement `jambes_genou` | la sous-clé « variante au niveau de la personne » de §6.7 clé 3 n'est pas appliquée ; fiche de `niveau_min` le plus bas préférée | §6.7, V-PRIO |
| T46 | zones au niveau 3 qui retirent les fiches pleines d'un emplacement mais laissent un substitut (repli c) | l'emplacement n'est **pas** compté vide pour P-ZONE3 | P-ZONE3, §7.1 |
| T47 | 3 jours, 20 min, retraits tournés de l'action 6 (un par séance) | ligne 1 de l'explication = « chaque grand muscle travaille au moins 2 fois » (jamais « 3 fois ») | §8.1, V-PRIO |
| T42 | source citée dans le code ou les tests | identifiants `SRC1`-`SRC15` pour les sources ; « signe S1-S3 » réservé aux signes d'alerte | §0 |
