# Contrôle indépendant de knowledge/generateur-v1.md (relecteur, 23/10/2026)

Contrôle lancé à neuf, sans le contexte de la rédaction. Le relecteur ne corrige rien : il liste les écarts ; `coach` et `kine` corrigent, puis nouveau contrôle.

Sources rouvertes le 23/10/2026 :
- S1 ACSM 2026 (PMC12965823) : texte PMC lu via un outil de lecture (premiers 100 000 caractères : résumé, résultats, Discussion, tableau 6, et une recherche ciblée).
- S3 préprint SportRxiv 537 : page du préprint lue.
- S4 Grgic 2018 : résumé lu via Europe PMC (PMID 28933024), car la page vuir citée **n'affiche pas le résumé**.
- S5 Singer 2024 : résumé et conclusions lus.
- S7 Halperin 2022 : résumé lu via Europe PMC (PubMed bloqué).
- S2 Iversen 2021 (PMC8449772) : recommandations pratiques lues.
- S6, S8, S11 : résumés lus via Europe PMC ; S9 (PMC7927075) : texte lu.
- Non rouvertes ici (déjà contrôlées le 21/10) : S10, S12, S13.

Fichiers du projet confrontés : CLAUDE.md, program-logic.md, load-calibration.md, rest-and-volume-rules.md, goal-resolver.md, schedule-adaptation.md, regles-securite-communes.md, equipment-taxonomy.md, format-fiches.md, docs/phase-2-criteres.md, src/data/model.ts, src/data/injury-rules.ts, et les fiches citées (ids, statut, ligne Grossesse).

## 1. Ce qui est conforme (vérifié)
- **S1 ACSM 2026** : les points cités sont exacts pour des adultes en bonne santé, du débutant complet au confirmé (18 ans et plus) :
  - « au moins deux séries par exercice » ;
  - >= 10 séries par muscle et par semaine, rendements décroissants vers 18-20 ;
  - charges >= 80 % du max pour la force ; de 30 à 100 % du max pour l'hypertrophie ;
  - « proche de l'échec » ou 2-3 répétitions en réserve, avec « preuves insuffisantes » pour une cible exacte ;
  - repos < 1 min ou > 1 min : pas de différence pour la force, données insuffisantes pour l'hypertrophie ;
  - exercice placé en début de séance pour la force ; >= 2 séances par semaine, tous les grands groupes ;
  - S1 ne dit rien de l'échauffement ni de la décharge ;
  - « 8 à 20 répétitions par série » attribué aux anciennes recommandations : exact.
  - Statut OK justifié.
- **S3** : point de supériorité non détectable à environ 11 séries fractionnaires par séance (hypertrophie) et environ 2 séries directes (force) ; préprint non relu par les pairs ; les auteurs demandent de l'interpréter avec prudence. PROVISOIRE justifié ; le plafond à 10 se situe bien en dessous.
- **S4** : 23 études, 491 participants ; non entraînés 60-120 s ; entraînés > 2 min. Exact.
- **S5** : 9 études ; petit avantage au-delà de 60 s (intervalles crédibles larges) ; rien de détecté au-delà de 90 s. Exact.
- **S7** : 12 études, 414 participants ; sous-estimation d'environ 0,95 répétition ; moins précis au-delà de 12 répétitions ; niveau d'entraînement sans effet ; I² = 97,9 %. Exact.
- **S2** : au moins 4 séries par semaine ; 6-15 RM, et 15-40 près de l'échec ; repos de 1-2 min pour les non-entraînés, >= 2 min pour les entraînés ; échauffement spécifique au-dessus d'environ 80 % ; mouvements polyarticulaires bilatéraux ; au moins 1 poussée, 1 tirage et 1 exercice de jambes. Exact.
- **S6, S8, S9, S11** : conformes à leurs résumés.
- **Repos retenus (§3.2)** : tous dans les fourchettes sourcées.
- **Réserve** : jamais 0 ; 3 pour les débutants (dans la fourchette 2-4 de load-calibration.md).
- **Grossesse** : plafond de 60 min, plus prudent que les 60 à 90 min de la HAS (G5). Statut « repères OK / codage PROVISOIRE » juste.
- **Filtre cou (§6.5)** : conforme à C1-C3 et à `filterByNeck` / `NECK_DEDICATED_IDS`.
- **R2 et `capped`** : conformes à la version de R2 du 23/10.
- **Fiches citées** : tous les ids existent. Les 5 variantes cardio d'E1 sont bien à l'échelon 1, sans saut, et leurs fiches sont `utilisable` ou `verifie`.
- **Arithmétique de l'exemple §4.4** : juste (2 644 s, 3 004 s, 2 809 s, 2 614 s).
- **Algorithme V-JOURS** : correct sur T19 et T20.

## 2. Écarts

| n° | Section | Problème | Gravité | Source vérifiée |
|---|---|---|---|---|
| 1 | §3.4 (G5), §4.4 étape 6, §3.2, §8.1, §6.6, T17 | **L'ordre de priorité entre les plafonds grossesse (G5) et les autres règles n'est pas écrit, et il y a une contradiction explicite :**<br>• §4.4 étape 6 dit « jamais descendre sous 2 séries », alors que G5 impose 1 série pour une débutante (règle par défaut de §9 si le niveau manque).<br>• Rien n'écrit que G5 l'emporte sur V-DOSE en famille `force` : piliers à 4-6 répétitions et charges >= 80 % du max, série E3 à 75 %, explication « charges lourdes ». G5 dit pourtant « jamais d'effort maximal, 8-15 répétitions jusqu'à fatigue modérée ».<br>• T17 ne teste ni 8-15 répétitions, ni 1 série pour une débutante, ni la famille `force` combinée à la grossesse.<br>Un développeur peut coder une dose au-dessus du plafond HAS. **À faire** : une règle de priorité explicite (G5 > V-DOSE, V-DUREE, V-VOL, V-SUP), un texte d'explication propre à la grossesse, et ces cas ajoutés à T17. | **bloquant** | HAS 2019 via regles-securite-communes.md G5 (relu) ; generateur §3.4, §4.4 |
| 2 | §6.3, §6.8 point 1(e) | Sous `capped` (zone au niveau 2), une variante sans historique part de la charge la plus légère, mais **rien n'est dit pour l'échelon au poids du corps**. Un intermédiaire reçoit « l'échelon le plus haut de son niveau » (par exemple `pompe-pieds-sureleves`) sur une zone gênée. À préciser : échelon de départ le plus bas (comme un débutant) quand la fiche est `capped`. Test à ajouter. | à corriger | R2 (regles-securite-communes.md) ; §6.8 |
| 3 | §5.2 (ajustement), load-calibration.md règle 1 | Les boutons de réserve vont de 0 à « 4+ ». La règle de hausse « réserve >= cible + 2 » demande 5 quand la cible est 3 (débutants, santé, grossesse), ce qui est impossible à saisir : la charge ne monte jamais pendant l'étalonnage. **Écrire comment « 4+ » est compté.** | à corriger | §5.2 ; load-calibration.md |
| 4 | §4.2 (V-SUP) | La paire automatique `poussee_1` + `tirage_1` met un pilier en superset, débutants compris (en dehors de la séance d'étalonnage), en familles `muscle` et `sante`. La paire `charniere` + `poussee_2` aussi. Or S2 juge les supersets « moins adaptés aux gros mouvements lourds, surtout pour les débutants ». Le fichier ne cite de S2 que la partie favorable : extrapolation présentée comme sourcée. Choisir : interdire les piliers chargeables en superset pour les débutants, ou marquer ce point NON SOURCÉ et contraire à S2. | à corriger | S2 (PMC8449772), relu |
| 5 | §4.2, interdits | La phrase « le pilier `jambes_genou` et, en famille `force`, les deux piliers » est ambiguë : est-ce que `poussee_1` est interdit en superset en famille force, ou seulement la paire des deux piliers ensemble ? Le résultat de T22 et le calcul de la durée en dépendent. | à corriger | — |
| 6 | §2.1 (V-FREQ), §4.4 | L'affirmation « en 3 jours, le gabarit couvre chaque GG à chaque séance » est fausse aux durées courtes :<br>• Mon calcul, avec les formules du fichier (force intermédiaire, 30 min, 3 jours), retire `tronc` à l'étape 5.<br>• À 20 min, `tronc` est retiré aussi en 3 jours, pas seulement en 2 jours comme l'écrit §4.4.<br>Cela contredit le critère F3 de docs/phase-2-criteres.md (« au moins 2 fois par semaine en 3 jours »). L'avertissement existe (CLAUDE.md règle 15 respectée), mais il faut corriger le texte et le critère, ou imposer une durée minimale. | à corriger | phase-2-criteres.md F3 ; calcul du relecteur |
| 7 | T3 | Recalcul (débutant, profil C, 2 jours, 20 min, séance d'étalonnage donc sans superset) : T est d'environ 1 316 à 1 470 s après l'étape 4. L'étape 5 retire aussi `charniere` (aucun `tronc` n'était placé, puisque N = 4). Le résultat attendu de T3 (« `tronc` retiré, V-MSG-FREQ pour GG5 ») est donc incomplet : il faut aussi GG2 retiré et V-MSG-FREQ pour GG2. Recalculer T3. | à corriger | §4.4 |
| 8 | T25, §4.4 | À 45 min, N de départ = 6 et T = 44 min. La règle d'ajout (« T < durée - 10 min ») n'ajoute pas de 7e exercice. Le cas « 7 emplacements, 2 paires » de T25 n'est donc pas produit par les règles : préciser comment on arrive à 7 exercices ou réécrire T25. | à corriger | §4.4 |
| 9 | §4.3 (E3), §4.4 étape 4 | Trois points à préciser :<br>• « premier exercice chargeable de chaque groupe » : groupe GG ou muscle ? Non défini.<br>• L'étape 4 « une seule série par pilier » ne dit pas si les séries E3 des exercices non piliers sont supprimées.<br>• « minimum E1 réduit à 60 s » n'apparaît dans aucune étape : on ne sait pas quand E1 est réduit.<br>Non codable sans interprétation. | à corriger | — |
| 10 | §2.4 (V-JOURS) | Cas non traité : 2 jours demandés, mais les seuls jours libres sont consécutifs (par exemple samedi et dimanche). L'écart minimal est de 1, et la règle ne dit ni « 1 séance », ni « message », ni « pas de programme » (1 jour est hors v1). | à corriger | schedule-adaptation.md (48 h) |
| 11 | §6.8 point 4, §9, T30 | §6.8.4 : si plus de la moitié du noyau est vide à cause du niveau 3, le message « professionnel » « prime sur tout programme partiel ». §9 et T30 ne bloquent le programme que si **tous** les emplacements sont vides. On ne sait pas si un programme partiel est généré. Harmoniser et ajouter un test. | à corriger | regles-securite-communes.md R3 |
| 12 | §4.4, §9, §6.6 | Grossesse avec une durée choisie de 75 min : le plafond de 60 min s'applique (§6.6), mais aucun message n'est prévu, contrairement à la durée < 20 min. Message et test à prévoir. | remarque | G5 |
| 13 | §6.8 points 2 et 3 | « S1 » et « S1-S3 » désignent à la fois les sources S1-S3 du §0 (ACSM, Iversen, préprint) et les signes d'alerte S1-S3 de regles-securite-communes.md §5 : risque de confusion pour `dev`. Préfixer, par exemple « signe S1 ». | à corriger | regles-securite-communes.md §5 |
| 14 | §11, §6.8 point 8 | T33 à T38 sont listés au §6.8.8, mais absents du tableau des tests du §11, qui s'arrête à T32. | à corriger | — |
| 15 | §6.8 / §6.7 | Le §6.8 est placé avant le §6.7 (ordre des sections). | remarque | — |
| 16 | §4.3, §6.5 | §4.3 permet « 1 fiche `doux_pour: [cou]` » à l'échauffement. Or `retraction-omoplates` a aussi `doux_pour: [cou]` (fiche de tirage H en substitut), alors que §6.5 limite la liste à 3 fiches dédiées. Aligner §4.3 sur §6.5. | remarque | fiches lot-04-cou (frontmatter) ; C1-C2 |
| 17 | §1.3, §3.2, §4.2 | Pendant la semaine 1, tout est en étalonnage, donc aucun superset automatique pour un débutant ; à partir de la semaine 2, des supersets deviennent possibles. Le contenu peut donc changer d'une semaine à l'autre, ce qui contredit « mêmes fiches pendant le bloc » (V-ROT, T29). Préciser si les exercices retirés en semaine 1 reviennent. | remarque | program-logic.md §7 |
| 18 | §3.4 (V-VOL) | « Jamais plus de 20 séries par muscle et par semaine (S1, OK) » : S1 décrit des rendements décroissants, pas un risque. L'utiliser comme plafond est un choix de conception (statut à écrire : seuil OK, usage NON SOURCÉ). De même, faire correspondre « intermédiaire/avancé » à « entraîné » (S4, S2) est une extrapolation non signalée. | remarque | S1, S4 |
| 19 | §0, S3 | Ordre des auteurs inexact : le bon ordre est Remmert, Pelland, Robinson, Hinson, Zourdos. | remarque | page SportRxiv 537 |
| 20 | §0, S4 | Le lien vuir.vu.edu.au n'affiche pas le résumé : la lecture n'est pas reproductible. Remplacer par PMID 28933024 ou par le DOI (le contenu cité, lui, est exact). | remarque | Europe PMC |
| 21 | §0 (S1), §3.1 | Le tableau 6 de S1 écrit « 2–3 sets/session » pour la force. Le fichier écrit « 2-3 séries par exercice ». Compatible avec « au moins deux séries par exercice », mais à formuler fidèlement. | remarque | S1, tableau 6 |
| 22 | §2.3 | « OK pour le principe [Kassiano 2022] » : Kassiano soutient une variation systématique, pas la règle « fiche différente en A et C ». Statut à écrire : principe PROVISOIRE, règle NON SOURCÉ. | remarque | sources.md ; program-logic.md §7 |
| 23 | §7.1, T4 | Le tableau du §7.1 indique « tous : poussée V couverte par `pompe-piquee` », mais `pompe-piquee` est retirée en grossesse (remplaçant `pompe-chaise`). La bibliothèque compte aujourd'hui 140 fiches `utilisable`/`verifie` (le texte dit 138). L'égalité élastique / sac à dos de T4 n'a pas été recalculée par le relecteur. | remarque | fiches ; grep des statuts |
| 24 | §1.1 | `InjuryZone` sans `cuisse` ni `aine` : confirmé dans src/data/model.ts. La demande à `dev` est justifiée et doit être faite avant F3, sinon D11 et les cases cuisse/aine ne s'appliquent pas. | remarque | src/data/model.ts |

## 3. Verdict
**Bloqué.**
- 1 point bloquant (n° 1 : priorité des plafonds grossesse G5 non écrite, contradiction avec §4.4 étape 6, T17 incomplet).
- 12 points à corriger (n° 2 à 11, 13 et 14).
- 11 remarques.

Les valeurs sourcées sont fidèles à leurs sources pour des adultes en bonne santé (aucun écart de chiffre sur S1, S3, S4, S5, S7, S2, S9). Les problèmes portent sur :
- l'ordre de priorité entre les règles de sécurité et la dose ;
- la codabilité ;
- la cohérence des tests.

Après correction par `coach`/`kine`, nouveau contrôle des n° 1 à 14.
