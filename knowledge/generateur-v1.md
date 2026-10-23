# Générateur de programmes v1 : règles codables (corps entier, 2-3 jours)
Rédigé par `coach` le 23/10/2026. Statut du fichier : **à contrôler par `relecteur`** (lancé à neuf) ; les points marqués NON SOURCÉ sont des choix de conception prudents, à valider par l'utilisateur (CLAUDE.md règle 10) ; les points de sécurité (§6.4 à §6.6) reprennent `regles-securite-communes.md` sans rien y ajouter et sont à relire par `kine`.

Lecture pour `dev` : chaque règle porte un identifiant (`V-…`) à citer dans le code et dans les tests (§11). Les valeurs « retenues » sont celles à coder ; les fourchettes sont celles des sources. Le générateur est une **fonction pure et déterministe** : `genererProgramme(profil, materiel, blessures, objectifs, fiches, historique) -> Programme` ; aucun tirage au hasard, même entrée = même sortie (départages explicites à chaque étape).

Statuts : OK = source primaire, méta-analyse ou position officielle lue au moins en résumé ; PROVISOIRE = source secondaire, préprint non relu par les pairs, ou extrapolation d'une source ; NON SOURCÉ = choix de conception.

## 0. Sources (toutes « lues le 2026-10-23 » sauf mention)

| Réf. | Source | Lien | Type, niveau de preuve | Public | Ce qui a été lu | Statut |
|---|---|---|---|---|---|---|
| S1 | Currier, Phillips et coll., ACSM Position Stand « Resistance Training Prescription for Muscle Function, Hypertrophy, and Physical Performance in Healthy Adults: An Overview of Reviews », Med Sci Sports Exerc 2026;58(4):851-872, DOI 10.1249/MSS.0000000000003897 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823 | revue de revues (137 revues systématiques, > 30 000 participants), position officielle ; qualité de preuve donnée en % par résultat | adultes en bonne santé, du débutant complet au confirmé | texte complet PMC, Discussion et tableaux 4 à 6, lus via un outil de lecture (extraits et citations courtes) ; références non lues | OK |
| S2 | Iversen, Norum, Schoenfeld, Fimland, « No Time to Lift? Designing Time-Efficient Training Programs for Strength and Hypertrophy », Sports Med 2021;51(10):2079-2095, PMID 34125411 | https://pmc.ncbi.nlm.nih.gov/articles/PMC8449772 | revue narrative (pas de méta-analyse) | adultes, surtout jeunes, non entraînés et entraînés | 60 % du texte (recommandations pratiques) via un outil de lecture | OK pour ce qu'elle rapporte ; revue narrative : les valeurs sont des recommandations d'auteurs |
| S3 | Remmert, Robinson, Pelland et coll., « Is There Too Much of a Good Thing? Meta-Regressions of the Effect of Per-Session Volume on Hypertrophy and Strength », SportRxiv, 2 avril 2025 | https://sportrxiv.org/index.php/server/preprint/view/537 | méta-régression, **préprint non relu par les pairs** | adultes | résumé | PROVISOIRE |
| S4 | Grgic, Schoenfeld, Skrepnik, Davies, Mikulic, « Effects of Rest Interval Duration in Resistance Training on Measures of Muscular Strength: A Systematic Review », Sports Med 2018;48(1):137-151, DOI 10.1007/s40279-017-0788-x | https://vuir.vu.edu.au/38537/ | revue systématique, 23 études, 491 participants | entraînés et non entraînés | résumé | OK |
| S5 | Singer et coll., « Give it a rest: a systematic review with Bayesian meta-analysis on the effect of inter-set rest interval duration on muscle hypertrophy », Front Sports Act Living 2024, DOI 10.3389/fspor.2024.1429789 | https://www.frontiersin.org/articles/10.3389/fspor.2024.1429789/full | méta-analyse bayésienne, 9 études | surtout jeunes hommes non entraînés | résumé et conclusions | OK |
| S6 | Robinson, Pelland, Remmert, Refalo, Jukic, Steele, Zourdos, « Exploring the Dose-Response Relationship Between Estimated Resistance Training Proximity to Failure, Strength Gain, and Muscle Hypertrophy: A Series of Meta-Regressions », Sports Med 2024;54(9):2209-2231, DOI 10.1007/s40279-024-02069-2 | https://rke.abertay.ac.uk/en/publications/exploring-the-dose-response-relationship-between-estimated-resist/ | méta-régressions (RIR estimé a posteriori) | adultes | résumé | OK |
| S7 | Halperin et coll., « Accuracy in Predicting Repetitions to Task Failure in Resistance Exercise: A Scoping Review and Exploratory Meta-analysis », Sports Med 2022;52:377-390 | https://pubmed.ncbi.nlm.nih.gov/34542869/ | revue de portée + méta-analyse exploratoire, 12 études, 414 participants, hétérogénéité très forte | adultes | résumé | OK |
| S8 | Plotkin et coll., « Progressive overload without progressing load? The effects of load or repetition progression on muscular adaptations », PeerJ 2022;10:e14142 | https://peerj.com/articles/14142 | essai randomisé, 8 semaines | adultes entraînés | résumé | OK (un seul essai) |
| S9 | Schoenfeld, Grgic, Van Every, Plotkin, « Loading Recommendations for Muscle Strength, Hypertrophy, and Local Endurance: A Re-Examination of the Repetition Continuum », Sports 2021;9(2):32 | https://pmc.ncbi.nlm.nih.gov/articles/PMC7927075/ | revue narrative | adultes | 60 % du texte via un outil de lecture | OK pour ce qu'elle rapporte (revue narrative) |
| S10 | Zhang, Weakley, Li, Li, Garcia-Ramos, supersets, Sports Med 2025 (déjà dans sources.md) | https://eprints.leedsbeckett.ac.uk/id/eprint/11908 | méta-analyse, 19 études, 313 participants | adultes | résumé (lu le 21/10/2026) | OK |
| S11 | McCrary, Ackermann, Halaki, « A systematic review of the effects of upper body warm-up on performance and injury », Br J Sports Med 2015;49(14):935-942, PMID 25694615 | https://pubmed.ncbi.nlm.nih.gov/25694615/ | revue systématique d'essais randomisés, 31 essais | adultes, haut du corps | résumé | OK (performance) ; **aucune étude sur la prévention des blessures** |
| S12 | Nunes et coll., ordre des exercices, Eur J Sport Sci 2021, DOI 10.1080/17461391.2020.1733672 (déjà dans sources.md) | DOI | méta-analyse, 11 études | adultes | résumé (lu le 21/10/2026) | OK |
| S13 | OMS 2020, Bull et coll., Br J Sports Med 54(24):1451-1462 (déjà dans sources.md) | DOI 10.1136/bjsports-2020-102955 | recommandation officielle | adultes | résumé (lu le 21/10/2026) | OK |
| S14 | HAS 2019 grossesse et post-partum, via `regles-securite-communes.md` §3 (G4, G5, G7) | https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf | recommandation officielle | femmes enceintes ou en post-partum | lue par `kine` le 21-22/10/2026 (non relue ici) | voir G4, G5, G7 |
| S15 | `regles-securite-communes.md` (§0, R1-R3, C1-C3, G4-G7) et `format-fiches.md` §4 | fichiers du projet | règles du projet (leurs statuts propres s'appliquent) | — | lus en entier | selon chaque règle |

Ce que S1 dit, et ne dit pas (utile pour toute la suite) : au moins 2 séances par semaine, tous les grands groupes musculaires, effort élevé ; force : charges >= 80 % du max (effet dose-réponse), 2-3 séries par exercice, exercice placé en début de séance, amplitude complète ; hypertrophie : >= 10 séries par muscle et par semaine (dose-réponse, rendements décroissants vers 18-20 séries), toutes charges de 30 à 100 % du max donnent une croissance comparable ; « au moins deux séries par exercice » ; l'échec n'est pas nécessaire, cible « proche de l'échec » ou 2-3 répétitions en réserve, mais « preuves insuffisantes pour chiffrer une cible exacte » ; repos court (< 1 min) ou long (> 1 min) : pas de différence pour la force, données insuffisantes pour l'hypertrophie ; ordre sans effet sur l'hypertrophie ; périodisation pas supérieure si la progression est suffisante ; la variété n'est pas clairement nécessaire. **S1 ne donne ni fourchette de répétitions pour l'hypertrophie, ni durée de repos recommandée, ni échauffement, ni semaine de décharge.**

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
| perte de gras | `muscle` (garder le volume de musculation : goal-resolver.md, « préserver la masse maigre » ; à sourcer) | « Cardio et alimentation : arrivent dans une prochaine version. Repère OMS : 150 à 300 min d'activité modérée par semaine. » (S13, OK) |
| forme / santé | `sante` | — |
| cardio / endurance | `sante` | repère OMS (S13) |
| sport | `sante` | « Les programmes par sport arrivent dans une prochaine version. » |
| mobilité, fonctionnel | `sante` + bloc fonctionnel activé (§2.3, emplacement 9) | — |
Le socle reste identique pour toutes les familles : tous les grands groupes >= 2 fois/semaine (S1, S13 : OK).

## 2. Structure d'une séance et répartition sur la semaine

### 2.1 Grands groupes musculaires (règle V-GG) et règle des 2 fois par semaine
S1 et S13 demandent « tous les grands groupes musculaires » au moins 2 jours par semaine (OK) sans les lister de façon codable. Découpage retenu (NON SOURCÉ, choix de conception, aligné sur les schémas de mouvement d'equipment-taxonomy.md) :
| Groupe | Couvert dans une séance si un exercice placé a… |
|---|---|
| GG1 cuisses avant | `schema` ∈ {squat, fente} et `quadriceps` dans `muscles_principaux` |
| GG2 hanches / arrière des cuisses | `schema` = charniere (ou `fessiers`/`ischios` principal d'un squat/fente : ne compte pas, pour garder une charnière) |
| GG3 poussée du haut du corps (pectoraux, épaules, triceps) | `schema` ∈ {poussee_h, poussee_v}, fiche non `substitut` |
| GG4 tirage du haut du corps (dos) | `schema` ∈ {tirage_h, tirage_v}, fiche non `substitut`, et `grand_dorsal` ou `rhomboides` principal |
| GG5 tronc | `schema` ∈ {gainage, anti_rotation, rotation} |
Une fiche `couverture: substitut` couvre son groupe **à moitié** : elle est placée (§7) mais le groupe est compté « couvert par substitut » et déclenche le message V-MSG-SUBST, pas l'avertissement V-MSG-FREQ.
Règle V-FREQ : après génération, compter pour chaque GG le nombre de séances de la semaine qui le couvrent. Si < 2 : avertissement V-MSG-FREQ (§8). En 3 jours, le gabarit couvre chaque GG à chaque séance (3 fois) ; en 2 jours, chaque GG doit être dans les 2 séances : c'est possible dès que le noyau tient dans la durée (§4.4), sinon avertissement.

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
- Les emplacements 1 à 5 forment le **noyau** (un exercice par GG). Principe de couverture des grands schémas : program-logic.md §4 point 2 et S2 (« au moins un exercice de poussée et un de tirage du haut du corps, un exercice de jambes », OK). L'ajout de la charnière et du tronc dans le noyau : NON SOURCÉ (choix de conception : GG2 et GG5).
- Les sauts (`saut`), la mobilité dédiée au cou et le cardio ne sont **jamais** placés dans les emplacements en v1 (sauts : réservés aux programmes sport, D3 ; cou : C2 ; cardio : échauffement seulement, §4.2).
- Nombre d'exercices N selon la durée : §4.4. On remplit les emplacements par ordre de priorité jusqu'à N.

### 2.3 Répartition sur 2 ou 3 jours (règle V-ROT)
- 2 jours : séances **A, B** ; 3 jours : **A, B, C**, toujours dans cet ordre, la même semaine type pendant tout le bloc (program-logic.md §7 : pas de rotation aléatoire ; S1 : la variété n'est pas nécessaire ; OK pour le principe, NON SOURCÉ pour le gabarit).
- Avec ce gabarit : en 3 jours, poussée H et tirage H 2 fois (A, C), poussée V et tirage V 1 fois (B), sauf si N >= 7 (les deux plans à chaque séance). En 2 jours et N < 7, les plans alternent (A = H, B = V) : afficher l'information V-MSG-PLANS (§8), pas un avertissement (GG3 et GG4 restent couverts 2 fois).
- Même emplacement dans deux séances différentes : choisir une **fiche différente** si au moins 2 fiches conviennent (A et C reçoivent la 1re et la 2e du classement §6.7 ; program-logic.md §7 : « l'une des deux fois peut utiliser une variante », OK pour le principe [Kassiano 2022, revue systématique, résumé, voir sources.md]). Sinon la même fiche.
- Bloc : **4 semaines** avec les mêmes fiches et variantes (program-logic.md §7 donne 4-6 semaines NON SOURCÉ ; 4 retenu par prudence pour réévaluer tôt). `Program.weeks = 4`. NON SOURCÉ.

### 2.4 Choix des jours de la semaine (règle V-JOURS)
- Récupération : au moins ~48 h avant de retravailler fortement le même muscle (program-logic.md §2 : ACSM 2009/2011 via synthèses, PROVISOIRE ; schedule-adaptation.md en fait un test obligatoire). En corps entier, chaque séance travaille tout : **deux séances jamais sur deux jours consécutifs**.
- Algorithme déterministe : parmi les jours libres (0 = lundi … 6 = dimanche, hors `blockedWeekdays`), essayer toutes les combinaisons de 2 (ou 3) jours ; écarts circulaires = différences successives + (7 + premier - dernier) ; garder celles dont l'écart minimal est le plus grand ; départage : la plus petite dans l'ordre lexicographique (ex. 3 jours libres partout -> lundi, mercredi, vendredi ; 2 jours -> lundi, jeudi).
- Si l'écart minimal est < 2 jours (ex. 3 jours demandés, seuls 4 jours consécutifs libres) : ne pas générer 3 séances ; proposer 2 séances avec le message V-MSG-JOURS (§8). Si même 2 jours sont impossibles (un seul jour libre) : message, pas de programme.

## 3. Séries, répétitions, réserve, repos

### 3.1 Ce que disent les sources (fourchettes)
| Variable | Fourchette sourcée | Source | Statut |
|---|---|---|---|
| Séries par exercice | au moins 2 ; plus de 2 peut apporter un peu plus ; rendements décroissants au-delà de ~2-3 pour la force | S1 | OK |
| Séries par muscle et par semaine, hypertrophie | >= 10 (dose-réponse), plateau vers 18-20 | S1 | OK |
| Minimum par muscle et par semaine (programmes courts) | >= 4 séries | S2 (revue narrative) | OK (recommandation d'auteurs) |
| Séries par muscle et par séance | au-delà de ~11 séries « fractionnaires » par séance, plus de bénéfice détectable pour l'hypertrophie ; ~2 séries directes pour la force | S3 (préprint) | PROVISOIRE |
| Charge pour la force | >= 80 % du max ; 1-5 répétitions à 80-100 % du max pour maximiser le max | S1 ; S9 | OK |
| Répétitions pour l'hypertrophie | toute charge >= ~30 % du max si les séries sont dures ; charges modérées (8-12 répétitions) les plus efficaces en temps ; 6-15 RM recommandé, 15-40 possible près de l'échec | S1, S9 ; S2 | OK |
| Charges légères | demandent d'aller près de l'échec ; plus d'inconfort | S9, S2 | OK |
| Réserve (RIR) | échec non nécessaire ; « proche de l'échec » ou 2-3 en réserve ; pas de cible exacte prouvée ; l'hypertrophie augmente en se rapprochant de l'échec, la force dépend surtout de la charge | S1 ; S6 | OK |
| Précision de l'estimation de la réserve | sous-estimation moyenne ~0,95 répétition ; moins précise au-delà de 12 répétitions ; le niveau d'entraînement ne change pas la précision | S7 | OK |
| Repos, force | non entraînés : 60-120 s suffisent ; entraînés : > 2 min pour maximiser ; S1 : pas de différence < 1 min vs > 1 min | S4 ; S1 | OK |
| Repos, hypertrophie | petit avantage au-delà de 60 s, pas de différence détectée au-delà de ~90 s ; S1 : données insuffisantes | S5 ; S1 | OK |
| Repos (recommandation d'auteurs) | non entraînés 1-2 min, entraînés >= 2 min | S2 | OK (revue narrative) |
| Débutants | mêmes bases ; charges nécessairement basses au départ, puis progression nécessaire | S1 | OK |

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
Justification et statut, ligne par ligne :
- Séries : 2 minimum partout (S1, OK). 3 pour intermédiaire/avancé en muscle et pour les piliers en force (S1 « plus de 2 peut apporter plus », 2-3 pour la force, OK). Débutant à 2 : dans la fourchette S1, **le choix de ne pas monter à 3 est NON SOURCÉ** (prudence, durée courte) ; avec 2 séances x 2 séries, le minimum de 4 séries par semaine de S2 est atteint.
- Répétitions muscle 8-12 / 10-15 : dans les fourchettes S1, S2, S9 (OK) ; borne haute 15 plutôt que 20-40 parce que l'estimation de la réserve est moins fiable au-delà de 12 (S7) et que les séries très longues sont plus pénibles (S9) : choix PROVISOIRE (extrapolation des sources). Quand une personne dépasse le haut de la fourchette au poids du corps, la progression passe à l'échelon suivant (phase 3, load-calibration.md règle 5).
- Force 4-6 sur piliers chargeables : correspond à des charges lourdes (S1 >= 80 % du max ; S9 1-5 répétitions à 80-100 %) ; 4 plutôt que 1-3 : NON SOURCÉ (prudence, pas de partenaire, pas de barre obligatoire). La correspondance « 4-6 répétitions ≈ 80-85 % du max » varie selon la personne et l'exercice (S9) : PROVISOIRE. Force débutant 6-10 : NON SOURCÉ (S1 : charges basses au départ pour les inexpérimentés).
- Force sans variante chargeable : répétitions de la colonne « poids du corps » et message V-MSG-FORCE (program-logic.md §4 point 4 ; S1 : la force dépend surtout de la charge, OK).
- Santé 10-15, 2 séries : dans la fourchette des anciennes recommandations citées par S1 (8-20 répétitions) et de S2 (6-15 RM) (OK) ; le choix précis est NON SOURCÉ.
- Réserve : S1 « 2-3 » (OK) ; débutant 3 et santé 3 : haut de la fourchette S1, NON SOURCÉ (prudence + sous-estimation d'environ 1 répétition, S7) ; avancé muscle 1 sur variantes sûres seulement : S6 (plus près de l'échec = un peu plus d'hypertrophie, OK) ; restriction aux variantes sûres : NON SOURCÉ (load-calibration.md règle 2 : jamais 0 sur mouvements lourds sans partenaire). **Jamais de cible 0 en v1** (S1, OK).
- Repos : débutant 90-120 s dans 60-120 s (S4, S2, OK) ; intermédiaire/avancé piliers 120-180 s (S4 > 2 min pour les entraînés, S2 >= 2 min, OK) ; « autres » 90 s (S5 : rien de détecté au-delà de ~90 s pour l'hypertrophie, OK) ; santé 60-90 s : S1 ne trouve pas de différence < 1 min / > 1 min pour la force (OK), valeurs exactes NON SOURCÉ.

### 3.3 Exercices à durée ou par côté (règle V-TEMPS) : NON SOURCÉ en entier
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
- Comptage par muscle (méthode « fractionnaire » de S3 : muscle principal = 1 série, secondaire = 0,5 ; PROVISOIRE) sur la semaine.
- Famille `muscle`, niveau intermédiaire ou avancé : viser >= 10 séries par semaine pour `quadriceps`, `fessiers`, `ischios`, `pectoraux`, `grand_dorsal`, et >= 10 pour l'ensemble des `deltoides_*` (S1, OK pour le seuil ; liste des muscles NON SOURCÉ). Si un muscle est en dessous : (1) +1 série sur l'exercice où il est principal (maximum 4 séries par exercice, NON SOURCÉ), (2) sinon ajouter l'emplacement 6, 7 ou 8 qui le travaille, tant que la durée (§4.4) et le plafond par séance le permettent ; sinon afficher l'information V-MSG-VOL (§8). Jamais plus de 20 séries par muscle et par semaine (plateau S1 18-20 : OK).
- Débutant (toutes familles) et `sante` : viser >= 4 séries par muscle et par semaine (S2, OK), pas d'ajout automatique au-delà.
- Plafond par séance (règle V-PLAF) : au plus **10 séries fractionnaires par muscle et par séance** (sous le point de ~11 de S3 : PROVISOIRE, préprint) ; et au plus **8 exercices** et **24 séries de travail** par séance hors échauffement (NON SOURCÉ, prudence et durée).
- Grossesse (réglage coché) : plafond G5 : 1 série par exercice pour une débutante, 2 pour les autres niveaux (HAS : 1 série débutantes, 2-3 entraînées ; la valeur 2 retenue pour intermédiaire et avancé est le bas de la fourchette), 8-15 répétitions jusqu'à fatigue modérée, réserve cible 3 minimum, séance <= 60 min (S14 via G5 : OK pour les repères HAS, codage PROVISOIRE).

## 4. Ordre, supersets, échauffement, durée

### 4.1 Ordre dans la séance (règle V-ORDRE)
1. Échauffement (§4.3).
2. Piliers : `jambes_genou`, puis `poussee_1` (famille `force` : obligatoire en tête, S1 « début de séance », S12, OK ; familles `muscle` et `sante` : même ordre par défaut, l'ordre n'a pas d'effet sur l'hypertrophie, S1 et S12, OK).
3. `tirage_1`, `charniere`, puis `poussee_2`, `tirage_2`, `jambes_2`.
4. `tronc`, puis `fonctionnel` (porté en fin de séance : program-logic.md §10, PROVISOIRE).
5. Retour au calme facultatif (§4.3).
Départage : ordre de priorité des emplacements (§2.2). Les supersets (§4.2) gardent la place du premier exercice de la paire.

### 4.2 Supersets antagonistes (règle V-SUP)
- Fondement : les supersets font gagner du temps sans réduire le volume ni les adaptations (S10, OK) ; une paire agoniste-antagoniste prend environ la moitié du temps (S2, OK) ; S2 les juge plutôt adaptés à l'hypertrophie qu'à la force maximale et déconseille les techniques d'intensification sur les gros mouvements lourds (OK, recommandation d'auteurs).
- Paires permises (liste fermée ; deux exercices dont les `muscles_principaux` n'ont **aucun** muscle commun) :
| Paire | Exemple |
|---|---|
| `poussee_1` + `tirage_1` (même plan) | pompe + rowing |
| `poussee_2` + `tirage_2` | développé épaules + tirage vertical |
| `jambes_2` + `tronc` | fente + planche latérale |
| `charniere` + `poussee_2` (si `tirage_2` absent) | soulevé de terre roumain + développé épaules |
- Interdits : deux exercices de jambes (squat, fente, charnière entre eux) ; deux exercices avec un muscle principal commun (S10 : le volume chute, OK) ; le pilier `jambes_genou` et, en famille `force`, les deux piliers (NON SOURCÉ, prudence S2) ; un exercice dont une case de blessure est `adapter` (NON SOURCÉ : on garde du repos pour la zone gênée) ; grossesse cochée (NON SOURCÉ, prudence G5).
- Quand : (1) toujours permis en `sante` et `muscle` si la personne a coché « gagner du temps » (option, défaut : non) ; (2) **automatiquement** quand la durée estimée dépasse la durée choisie (§4.4, étape 1). Pas de superset automatique pour un débutant pendant sa séance d'étalonnage (§5) d'un des deux exercices (NON SOURCÉ : une seule nouveauté à la fois).
- Déroulé : série de A, transition **15 s** (NON SOURCÉ), série de B, puis repos de la paire = **le plus long des deux repos** de §3.2 (S2 : volume maintenu avec repos entre paires ; valeur NON SOURCÉ). Nombre de séries de la paire = le plus grand des deux ; l'exercice qui en a moins saute ses dernières séries.
- Données : `PlannedExercise.supersetGroup` = même identifiant pour A et B (déjà dans le modèle).

### 4.3 Échauffement et retour au calme (règle V-ECH)
Sources : S1 n'en parle pas ; S11 : preuves fortes que des échauffements dynamiques à charge élevée améliorent la force et la puissance (haut du corps), **aucune étude sur la prévention des blessures** (OK) ; S2 : en manque de temps, garder les séries d'échauffement spécifiques (surtout au-dessus de ~80 % du max), l'échauffement général n'est pas prioritaire ; étirements statiques longs (30-60 min) avant la séance : baisse de force aiguë, courts (< 60 s par muscle) : effet faible ; étirement dynamique : pas de baisse (OK, revue narrative). L'app **ne dit pas** que l'échauffement prévient les blessures.
Contenu retenu :
| Partie | Contenu | Durée comptée | Statut |
|---|---|---|---|
| E1 général | 1 fiche `cardio`, **échelon 1** (variante sans saut : `marche-rapide-continue`, `montees-genoux-marche`, `jumping-jacks-sans-saut`, `boxe-vide-lente`, `pas-chasses-lents` ; départage : ordre de cette liste, après filtres §6), 2 min | 120 s | NON SOURCÉ (durée et contenu) |
| E2 mobilité | 2 fiches `mobilite` (type `mobilite_recup`, échelon 1) liées aux piliers du jour : séance avec squat/fente -> `mobilite-cheville-au-mur` ou `mobilite-hanches-90-90` ; poussée/tirage -> `glissement-mur-epaules`, `cercles-de-bras` ou `extension-thoracique` ; charnière -> `chat-vache` ; 30 s ou 6-8 répétitions par côté chacune | 2 x 45 s | NON SOURCÉ ; étirement statique long exclu (S2) |
| E3 spécifique | avant **chaque pilier** et avant le premier exercice chargeable de chaque groupe : variante chargeable -> 1 série de 8 répétitions à ~50 % de la charge de travail ; si répétitions cibles <= 6 (force) : + 1 série de 3 répétitions à ~75 % ; poids du corps ou élastique -> 1 série de 6 répétitions à l'échelon inférieur (ou au même échelon s'il n'y en a pas) | chaque série = exécution + 45 s | Principe : S11 et S2 (OK) ; nombre de séries et pourcentages : NON SOURCÉ |
| Retour au calme | facultatif, 1 fiche `mobilite` d'étirement (ex. `etirement-fessiers-figure-4`, `etirement-pectoraux-mur`) 30 s par côté | 0 s (non compté, retiré en premier) | NON SOURCÉ |
Exclusions de l'échauffement : fiches dédiées au cou (`NECK_DEDICATED_IDS`, C2), sauf zone `cou` au niveau 1 ou 2 : alors 1 fiche `doux_pour: [cou]` peut remplacer une fiche E2 (C1, `filterByNeck`) ; toutes les fiches d'échauffement passent aussi les filtres §6 (matériel, blessures, grossesse).
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
- 4 s par répétition : S2 rapporte ~2 s concentrique + ~4 s excentrique chez les novices (ACSM, via S2) et des tempos modérés de 1-2 s par phase ; des durées de 0,5 à 8 s donnent la même hypertrophie (S1, S2) : **valeur 4 s dans la fourchette 2-6 s, choix NON SOURCÉ**. Transition 60 s : NON SOURCÉ. « Unilatéral » = variante dont l'id ou le nom contient `un-bras`, `une-jambe`, `unijambiste`, `un-haltere`, `bulgare`, `fente` (à remplacer par un champ de fiche `unilateral: oui` : demande à `dev`, F0).
- Nombre d'exercices N de départ (NON SOURCÉ, puis vérifié par la formule) :
| Durée choisie | 20 min | 30 min | 45 min | 60 min | 75 min | sans limite |
|---|---|---|---|---|---|---|
| N de départ | 4 | 5 | 6 | 7 | 8 | 7 (durée cible 60 min, affichée) |
À 20 min, N = 4 < noyau : `tronc` est le premier retiré (étape 5 ci-dessous) et l'avertissement V-MSG-FREQ s'applique au GG5 en 2 jours.
- Ajustement si T > durée choisie, dans cet ordre (program-logic.md §5 et goal-resolver.md règle 5 : jamais les piliers ni l'échauffement ; ordre détaillé NON SOURCÉ) :
  1. Former les supersets permis (§4.2), en commençant par la paire `poussee_1` + `tirage_1` (garde le volume, S10).
  2. Retirer l'emplacement `fonctionnel`, puis `jambes_2`, puis `tirage_2`, puis `poussee_2`.
  3. Réduire à 2 séries les exercices non piliers qui en ont 3 (S1 : minimum 2).
  4. Réduire E3 à une seule série par pilier.
  5. Retirer `tronc`, puis `charniere`, puis `tirage_1` (le groupe devient non couvert : avertissement V-MSG-FREQ si < 2 fois/semaine, et V-MSG-DUREE).
  6. Jamais : retirer un pilier, descendre sous 2 séries, supprimer E1+E2 (minimum E1 réduit à 60 s), raccourcir les repos sous les valeurs de §3.2.
- Si T < durée choisie - 10 min et N < 8 : ajouter l'emplacement suivant (§2.2) tant que T reste <= durée choisie (NON SOURCÉ).
- Affichage : durée estimée arrondie à 5 min supérieures, avant de commencer (program-logic.md §5) ; garantie testée : **T <= durée choisie** (phase-2-criteres F3).
- Exemple de calcul (intermédiaire, `muscle`, 45 min, 6 exercices bilatéraux de 3 séries, 10 répétitions, repos 120 s / 90 s, 2 piliers chargeables, 2 séries E3) : T_ech = 120 + 90 + 2 x (32 + 45) = 364 s ; piliers 2 x (3 x 40 + 2 x 120) = 720 s ; 4 autres 4 x (3 x 40 + 2 x 90) = 1 200 s ; transitions 60 x 5 + 60 = 360 s ; T = 2 644 s ≈ 44 min <= 45 : aucun ajustement. Avec un 7e exercice bilatéral : + 300 s + 60 s de transition = 3 004 s ≈ 50 min > 45 -> étape 1, paire `poussee_1` + `tirage_1` : 3 x 95 + 2 x 120 = 525 s au lieu de 360 + 300 + 60 = 720 s -> 2 809 s ≈ 47 min, encore > 45 -> paire `poussee_2` + `tirage_2` : 3 x 95 + 2 x 90 = 465 s au lieu de 660 s -> 2 614 s ≈ 44 min : gardé.

## 5. Étalonnage et données enregistrées (load-calibration.md)

### 5.1 Quand (règle V-ETAL)
Un exercice est « en étalonnage » quand l'historique ne contient **aucune série faite** (`SetLog.completedAt` non nul) pour cette `variantId`. Aussi après un retour de blessure (R7 : nouvel étalonnage quand une zone baisse de niveau, NON SOURCÉ) et après un changement de variante par le générateur.

### 5.2 Déroulé (le générateur prépare, le lecteur de séance F5 applique)
| Étape | Règle | Statut |
|---|---|---|
| Charge de départ, variante chargeable | débutant : le plus léger poids disponible dans le profil pour ce matériel (haltères : plus petit `dumbbellWeightsKg` ; kettlebell : plus petit `kettlebellWeightsKg`) ; intermédiaire / avancé : la charge que la personne indique (« ta charge habituelle pour 10 répétitions », facultatif), sinon le plus léger. Case `adapter: charge:legere` ou grossesse avec `charge:legere` : toujours le plus léger, jamais augmenté | NON SOURCÉ (load-calibration.md règle 1) ; S1 : charges basses au départ pour les inexpérimentés (OK) |
| Poids du corps / élastique | l'échelon choisi en §6.3 ; élastique : la résistance la plus faible du profil | NON SOURCÉ |
| Après chaque série | une seule question : « Combien de répétitions te restait-il ? » boutons 0, 1, 2, 3, 4+ ; plus les répétitions faites (déjà saisies) | load-calibration.md règle 1 (NON SOURCÉ) ; échelle RIR : S7 (OK : estimation correcte à ~1 répétition près, moins fiable > 12 répétitions) |
| Ajustement série suivante | réserve >= cible + 2 et répétitions >= haut de fourchette -> poids disponible immédiatement supérieur (ou échelon + 1 si son niveau <= niveau de la personne et matériel présent) ; réserve <= cible - 2 ou répétitions < bas de fourchette -> poids inférieur (ou échelon - 1) ; sinon garder | NON SOURCÉ (load-calibration.md règle 3) ; marge de 2 plutôt que 1 pour absorber l'erreur d'estimation (~1 répétition, S7) : PROVISOIRE |
| Interdits pendant l'étalonnage | aucune hausse si la zone concernée est au niveau 2 (R2), si `charge:legere`, si grossesse cochée au-delà de « fatigue modérée » (réserve < 3), si la série a été marquée « ça fait mal » (R4 : arrêt de l'exercice) | règles du projet (R2, R4, G5) |
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
- intermédiaire et avancé : l'**échelon le plus haut dont le `niveau` <= niveau de la personne** (demande de la mission). L'étalonnage (§5.2) redescend d'un échelon si la première série est trop dure. **Point à valider** : pour un intermédiaire, cela donne parfois un échelon exigeant (ex. `pompe-pieds-sureleves`) ; alternative prudente proposée : « échelon le plus haut de niveau `debutant` + 1 échelon », NON SOURCÉ, question à l'utilisateur.
- À échelon égal (variantes qui ne changent que le matériel), départage dans cet ordre : (a) famille `force` ou `muscle` : variante chargeable d'abord (S1 : la force dépend surtout de la charge ; equipment-taxonomy.md §3 point 3), ordre des tags : `barre` > `halteres` > `kettlebell` > `machine` > `poulie` > `elastique` > autres ; famille `sante` : variante avec le moins de tags ; (b) moins de tags ; (c) ordre du tableau de la fiche.
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
- Niveau 2 : `capped = true` (aucune hausse de charge ni d'échelon, R2) sur tout exercice « de la zone », c'est-à-dire toute fiche qui a une ligne pour cette zone, quelle que soit la case. Interprétation de R2 par `coach`, NON SOURCÉ, à confirmer par `kine`.
- Niveau 3 : message R3 affiché une fois par zone (§8).
- Zones `cuisse` et `aine` : une fiche sans ligne pour ces zones n'est **jamais** choisie comme remplaçant pour une gêne cuisse/aine (§0, décision `kine` du 22/10).
- Statut : règles du projet, NON SOURCÉ (R1-R3) sauf mentions de regles-securite-communes.md.

### 6.5 Filtre cou (règle V-COU ; C1, C2, C3)
- Appliquer `filterByNeck(fiches, blessures)` (src/data/injury-rules.ts) avant §6.3.
- Zone `cou` au niveau 1 ou 2 : le générateur **peut** ajouter 1 fiche `doux_pour: [cou]` dédiée (`rotation-douce-cou`, `inclinaison-douce-cou`, `retraction-cervicale`) à l'échauffement à la place d'une fiche E2 (jamais obligatoire ; retenu : oui, 1 fiche, la première de cette liste qui passe les filtres ; NON SOURCÉ). `retraction-omoplates` reste une fiche normale (C2).
- Zone `cou` au niveau 3 (ou `afterShock`) : aucune fiche douce ni dédiée ; message C3 ou R3.

### 6.6 Grossesse et post-partum (règle V-GROS ; G4, G5, G7) : seulement si le réglage est coché
- La ligne `**Grossesse**` de chaque fiche s'applique comme une zone supplémentaire (même grammaire, mêmes priorités) ; un remplaçant que sa propre ligne Grossesse retire n'est jamais proposé ; un remplaçant que sa ligne classe `adapter` n'est proposé que dans sa version adaptée (§0).
- Plafonds G5 (§3.4), pas de superset (§4.2), séance <= 60 min.
- Post-partum : aucune fiche de schéma `saut` (G7) ; aucune variante cardio avec saut à l'échauffement (déjà exclu : E1 = échelon 1 sans saut).
- Messages G1 (et G2) affichés à la coche du réglage, pas par le générateur.
- Statut : G4 PROVISOIRE, G5 OK (repères HAS) / PROVISOIRE (codage), G7 PROVISOIRE.

### 6.7 Classement des fiches restantes (règle V-CLASSE), déterministe
Clés dans l'ordre :
1. Fiche pleine (§6.1 point 3).
2. Aucune case `adapter` active (une fiche sans adaptation passe avant une fiche adaptée ; NON SOURCÉ, prudence).
3. Famille `force` et emplacements piliers : au moins une variante compatible chargeable.
4. Exercice polyarticulaire bilatéral d'abord pour les piliers (S2 : privilégier les mouvements bilatéraux polyarticulaires, OK) : nombre de `muscles_principaux` >= 2, puis variante non unilatérale.
5. Préférences de la personne (favoris d'abord, fiches masquées exclues) quand elles existeront.
6. Fiche pas encore utilisée dans la semaine pour ce même emplacement (rotation A/C, §2.3).
7. `id` dans l'ordre alphabétique.
La même fiche ne peut pas occuper deux emplacements dans la même séance.

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

État de la bibliothèque au 23/10/2026 (node tools/couverture.mjs et inventaire des 138 fiches utilisables), cas prévisibles :
| Profil | Emplacement | Résultat attendu |
|---|---|---|
| implicites seuls (sans objet coché) | tirage H | aucune fiche pleine -> c : `retraction-omoplates`, `ecartement-serviette` ou `ytw-sol` (substituts) ; achat : élastique (ou cocher un sac à dos : `rowing-sac-a-dos`) |
| implicites seuls | tirage V | b : aucune fiche pleine de tirage H non plus -> c : `tirage-vertical-serviette`, `tirage-vertical-allonge-ventre`, `tirage-w-allonge` |
| débutant avec barre de traction, sans élastique | tirage V | `traction-barre` est `intermediaire` -> b : rowing si haltères, sinon c ; achat : élastique (traction assistée plus tard, tirage vertical à l'élastique dès maintenant) |
| implicites seuls | porté (emplacement 9) | aucune fiche -> pas de porté, message « coche un sac à dos ou des bidons dans Mon matériel » |
| tous | poussée V | `pompe-piquee` (débutant, poids du corps) : couvert |

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
| 3 jours | « {3} séances par semaine en corps entier : chaque grand muscle travaille 3 fois. » | selon la famille, ci-dessous |
| 2 jours | « 2 séances par semaine en corps entier : chaque grand muscle travaille 2 fois. » | idem |
| 2 jours, un groupe < 2 fois | « 2 séances par semaine en corps entier ; {groupe} ne tient pas dans {durée} min. » | idem |
| famille `muscle` | — | « Objectif muscle : {séries} séries de {rmin}-{rmax} répétitions, en gardant environ {rir} répétitions en réserve. » |
| famille `force` | — | « Objectif force : les gros mouvements d'abord, charges lourdes ({rmin}-{rmax} répétitions) et repos longs. » |
| famille `force` sans charge | — | « Objectif force : sans charges lourdes, on progresse par des variantes plus dures ; la force maximale progresse mieux avec des charges. » |
| famille `sante` | — | « Objectif forme : des séances simples et régulières, sans aller jusqu'à l'échec. » |
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
| V-MSG-FORCE | famille force sans variante chargeable pour un pilier | « La force maximale progresse surtout avec des charges lourdes. Sans elles, on travaille avec des variantes plus difficiles. » (S1, OK) |
| V-MSG-VOL | famille muscle, muscle sous 10 séries/semaine | « {Muscle} : {n} séries par semaine, sous le repère de 10 pour la prise de muscle. Allonge la séance ou ajoute du matériel. » (S1, OK) |
| V-MSG-DUREE | étape 5 de §4.4 atteinte | « {Durée} min, c'est court pour un corps entier complet : {exercices retirés} ont été retirés. » |
| V-MSG-JOURS | §2.4, jours non espacés | « Tes jours libres ne laissent pas 48 h entre deux séances : on part sur 2 séances ({jours}). » |
| V-MSG-HORS | 1 ou 4-6 jours | « Ce rythme arrive dans une prochaine version. Choisis 2 ou 3 jours pour l'instant. » |

## 9. Cas limites et valeurs par défaut (règle V-DEF)
| Situation | Comportement | Statut |
|---|---|---|
| niveau absent | `debutant` | NON SOURCÉ (prudence) |
| objectif absent | famille `sante` | NON SOURCÉ |
| durée absente | 45 min | NON SOURCÉ |
| durée « sans limite » | N = 7, cible 60 min affichée, plafond 75 min | NON SOURCÉ |
| durée < 20 min | ramenée à 20 min avec message | NON SOURCÉ |
| jours = 1 ou 4-6 | aucun programme, V-MSG-HORS | phase-2-criteres F1 |
| profil matériel vide (tous implicites décochés) | seul `poids_du_corps` reste ; programme généré avec les fiches compatibles ; messages V-IMPOS/V-SUBST et V-ACHAT | NON SOURCÉ |
| aucun poids d'haltère renseigné | variantes haltères permises, charge saisie à la 1re série (§6.2) | NON SOURCÉ |
| tous les emplacements vides (ex. blessures niveau 3 sur dos, genou, épaule, hanche) | pas de programme ; message « Avec les gênes déclarées, l'app ne peut pas proposer de séance sûre. Demande l'avis d'un professionnel de santé. » | NON SOURCÉ (prudence, R3) |
| zone au niveau 3 qui retire tout un groupe | groupe non couvert, V-MSG-ZONE + R3, V-MSG-FREQ ; pas d'achat proposé | R3 (NON SOURCÉ) |
| même fiche seule possible pour deux emplacements d'une séance | placée une seule fois ; le second emplacement passe au repli suivant | NON SOURCÉ |
| historique contient la variante | pas d'étalonnage ; charge de départ = dernière charge sans douleur (la double progression vient en phase 3) | NON SOURCÉ |
| « ça fait mal » à la dernière séance pour un exercice | même variante, pas de hausse, version plus douce proposée (`**Version plus douce**` de la fiche, si elle passe les filtres) | R4 (PROVISOIRE) |
| profil modifié (matériel, blessure, niveau, jours, durée) | régénérer le programme ; garder les variantes déjà en place si elles passent encore tous les filtres (stabilité du bloc) | program-logic.md §7 (NON SOURCÉ) |
| deux fiches à égalité parfaite | ordre alphabétique de l'`id` (§6.7) | conception |
| grossesse cochée + niveau absent | débutante (1 série par exercice, G5) | G5 / prudence |

## 10. Ce qui reste NON SOURCÉ ou PROVISOIRE (à valider avant codage en dur, règle 10)
**OK (sourcé, lu)** : 2 séances/semaine minimum et tous les grands groupes (S1, S13) ; au moins 2 séries par exercice ; 2-3 séries pour la force ; >= 10 séries par muscle et par semaine pour l'hypertrophie, plateau 18-20 (S1) ; >= 4 séries/semaine en minimum (S2) ; charges >= 80 % pour la force, large gamme pour l'hypertrophie (S1, S9) ; pas d'échec nécessaire, cible 2-3 en réserve (S1) ; repos 60-120 s non entraînés, > 2 min entraînés pour la force (S4), > 60 s et rien de détecté au-delà de ~90 s pour l'hypertrophie (S5) ; exercice prioritaire en début de séance pour la force, ordre libre sinon (S1, S12) ; supersets antagonistes sans perte de volume (S10, S2) ; échauffement spécifique utile à la performance, rien sur les blessures (S11, S2) ; estimation de la réserve à ~1 répétition près, moins fiable > 12 (S7) ; progression par répétitions aussi efficace que par charge (S8, pour la phase 3).
**PROVISOIRE** : plafond 10 séries fractionnaires par muscle et par séance et méthode de comptage (S3, préprint) ; 48 h entre deux séances (ACSM 2009/2011 via synthèses) ; correspondance 4-6 répétitions ≈ charges lourdes ; borne haute 15 répétitions (extrapolée de S7, S9) ; marge de 2 répétitions pour l'ajustement d'étalonnage ; codage des repères grossesse (G4, G5, G7) ; porté en fin de séance.
**NON SOURCÉ (choix de conception prudents, à valider par l'utilisateur)** : découpage en 5 grands groupes et noyau de 5 emplacements ; gabarit A/B/C et alternance des plans ; bloc de 4 semaines ; correspondance des objectifs (§1.3) ; séries à 2 pour les débutants ; réserve 3 pour débutants et santé, 1 réservée aux variantes sûres ; valeurs exactes de repos dans les fourchettes ; tout §3.3 (maintiens, portés, répétitions par côté) ; contenu et durées de l'échauffement, pourcentages des séries E3 ; 4 s par répétition, 60 s de transition, 15 s dans un superset ; N d'exercices par durée et ordre de retrait ; plafonds 8 exercices / 24 séries / 4 séries par exercice ; règles de superset (paires, interdits) ; charge de départ et règle d'ajustement de l'étalonnage ; échelon pour intermédiaire et avancé ; départages ; repli et achat le plus utile ; tous les textes de messages ; valeurs par défaut de §9 ; interprétation de R2 « exercice de la zone ».

### 10.1 Questions pour l'utilisateur
1. Échelon de départ pour un **intermédiaire** : « le plus haut de son niveau » (demandé, parfois exigeant) ou « le plus haut de niveau débutant + 1 » (plus prudent) ?
2. Valeurs du §3.3 (gainage 20-30 s, porté 30-40 s, 2 séries) : d'accord comme valeurs prudentes en attendant une source ?
3. Bloc de 4 semaines avant de changer les exercices : d'accord (program-logic.md disait 4-6) ?
4. « Perte de gras » ramenée aux paramètres « muscle » (et non « forme ») en v1 : d'accord ?

### 10.2 Demandes à `dev` (pas de valeur sportive)
`InjuryZone` + `cuisse`, `aine` ; réglage « enceinte / post-partum » dans le profil ; lieu maison/salle dans le profil s'il manque ; champs `SetLog` et `PlannedExercise` de §5.3 ; champs de fiche `unilateral: oui` et `technique: oui` (format-fiches.md + validate-fiches.mjs) ; option profil « gagner du temps (supersets) » et « ajouter du fonctionnel ».

## 11. Tests que `dev` doit écrire (entrée -> résultat attendu)
Profils de matériel A à F = ceux de tools/couverture.mjs, **plus** un profil A0 = implicites seuls (sans objet du quotidien). Chaque test cite la règle.
| n° | Entrée | Résultat attendu | Règle |
|---|---|---|---|
| T1 | toute combinaison {A0, A-F} x {maison, salle} x {2, 3 jours} x {3 niveaux} x {muscle, force, sante} x {30, 45, 60 min} | aucune fiche hors `utilisable`/`verifie` ; chaque variante a tous ses tags dans le profil ; T <= durée choisie ; deux appels identiques donnent un résultat identique (déterminisme) | V-ADM, V-MAT, V-DUREE |
| T2 | même balayage, 3 jours, durée >= 30 min | chaque GG1-GG5 couvert >= 2 fois/semaine (ou V-MSG-FREQ présent si et seulement si un groupe < 2) | V-FREQ |
| T3 | 2 jours, 20 min, débutant, profil C | `tronc` retiré, V-MSG-FREQ pour GG5, V-MSG-DUREE ; piliers présents | V-DUREE, V-FREQ |
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
| T17 | grossesse cochée | lignes Grossesse appliquées ; aucun superset ; séries <= G5 ; réserve >= 3 ; séance <= 60 min ; `dead-bug`, `pont-fessier` jamais proposés, même comme remplaçants | V-GROS |
| T18 | post-partum coché | aucune fiche `saut` ; E1 sans saut | V-GROS (G7) |
| T19 | 3 jours, aucun jour bloqué | lundi, mercredi, vendredi ; jamais deux séances à moins de 48 h (écarts circulaires >= 2 jours) | V-JOURS |
| T20 | 3 jours, seuls lundi-jeudi libres | 2 séances (lundi, jeudi) et V-MSG-JOURS | V-JOURS |
| T21 | 1 ou 4 jours | aucun programme, V-MSG-HORS | V-PER |
| T22 | force, intermédiaire, profil C | piliers en tête, 4-6 répétitions, repos 180 s, variante haltères choisie quand elle existe à échelon égal | V-DOSE, V-ORDRE, V-ECHELON |
| T23 | force, profil A0 | répétitions 10-15 aux piliers, V-MSG-FORCE | V-DOSE |
| T24 | superset formé | les deux exercices n'ont aucun muscle principal commun ; jamais deux exercices de jambes ; jamais le pilier `jambes_genou` ; repos de la paire = le plus long des deux | V-SUP |
| T25 | durée 45 min, intermédiaire muscle, 7 emplacements possibles | résultat conforme à l'exemple de §4.4 (2 paires, ≈ 44 min) | V-DUREE |
| T26 | muscle intermédiaire 2 jours | volume fractionnaire calculé ; < 10 -> ajout de séries (max 4/exercice) ou V-MSG-VOL ; jamais > 20 séries/muscle/semaine ; jamais > 10 séries fractionnaires par muscle et par séance | V-VOL, V-PLAF |
| T27 | variante sans historique | `isCalibration = true` sur ses séries ; avec historique : `false` | V-ETAL |
| T28 | étalonnage : réserve 4+ et répétitions au haut de la fourchette, `capped = false` | série suivante au poids disponible supérieur ; avec `capped = true` : charge inchangée | V-ETAL |
| T29 | même emplacement dans A et C avec >= 2 fiches admissibles | fiches différentes en A et C ; identiques d'une semaine à l'autre pendant le bloc | V-ROT |
| T30 | aucune fiche admissible pour tous les emplacements (blessures) | aucun programme, message de §9 | V-DEF |
| T31 | sortie | explication = exactement 2 lignes, sans élément d'IA quand l'IA est coupée | V-EXPL |
| T32 | réserve cible | jamais 0 dans aucun `PlannedExercise` | V-DOSE |
