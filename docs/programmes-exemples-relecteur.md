# Contrôle relecteur : synthèse, analyse v1.8 et programmes d'exemple (01/11/2026)

Contrôle lancé à neuf, ciblé (quota réduit). Sources lues : docs/programmes-exemples.md (profils, tableau de répétitivité, analyse), docs/programmes-exemples-synthese.md, tools/demo-programmes-analyse.md, fiches knowledge/exercices/vague1/lot-02/nordique-ischios.md et lot-01/pompe-equilibre-mur.md (entières), extraits des fiches montee-sur-marche, traction-barre, hip-thrust-banc, face-pull-elastique, src/generator/config.ts (l.140-274), docs/D33-bilan.md et D34-bilan.md (lignes citées). Rien modifié ailleurs.

## Verdicts

- Programmes (docs/programmes-exemples.md), profil 6 : NON VALIDE tant que le point bloquant B1 n'est pas corrigé (les profils 1 à 5 : aucun point bloquant vu).
- Synthèse : VALIDE SOUS RÉSERVE (écarts E1 à E4 à corriger par l'auteur de la synthèse ; le défaut de sécurité est correctement signalé, mais sa correction est sous-estimée).
- Analyse v1.8 : VALIDE SOUS RÉSERVE (écarts E2, E3, E5, E6, E7).

## Points bloquants

**B1 (bloquant) : nordique des ischios et pompe en équilibre contre un mur, dose générée en contradiction avec leur fiche.**
- Présence confirmée : docs/programmes-exemples.md l.464 et l.532 (BAS-A, semaines 1-2) : « Exercice nordique des ischios (Descente complète, remontée sans les mains) : 3 x 10-15, repos 90 s, RIR 1 » ; l.477 et l.545 (PUSH-B) : « Pompe en équilibre contre un mur (Ventre vers le mur, presque à la verticale) : 3 x 10-15, repos 90 s, RIR 1 ».
- Nordique (fiche nordique-ischios.md) : « Courbatures fortes les premières fois : volume faible au départ, puis progressif » ; « Aucun nombre de séries ni de répétitions sourcé » ; signes d'arrêt : « claquement » à l'arrière de la cuisse, courbatures qui gênent la marche = « le volume était trop élevé ». 3 x 10-15 descentes complètes à une répétition de l'échec, sans mains, contredit la fiche. Aggravant : la séance enchaîne déjà good morning (3 x 8-12) puis fente avant le nordique (4e exercice) : les ischios sont fatigués quand ils reçoivent la charge la plus risquée. La remarque K-07 de D34-bilan §6 (réservé à la séance dédiée du sport) est confirmée par la ligne D34-bilan.md:8.
- Pompe en équilibre (fiche pompe-equilibre-mur.md) : « Aucune durée de maintien ni distance sourcée » ; « jamais proposé sans pompe piquée pieds surélevés maîtrisée » ; « Avant la première série : monte seulement à l'échelon 2 si l'échelon 1 est contrôlé » ; signes d'arrêt : bras qui flanchent à l'échelon 2, « ne te laisse jamais tomber sur la tête ». Le générateur place directement l'échelon 2 (le plus risqué : tête sous le coeur, presque vertical) en 3 x 10-15 à RIR 1 : 10 à 15 répétitions d'une pompe quasi verticale sont irréalistes, et la proximité de l'échec est précisément le scénario de chute décrit par la fiche. Cas pire que le nordique (risque de chute sur la tête / cervicales), pas seulement de courbatures.
- La correction proposée (plafond dans DOSE_LIMITS) est la bonne piste mais INCOMPLÈTE et son coût est sous-estimé (« quelques lignes de configuration ») :
  1. `DoseLimit` (config.ts l.215-222) ne connaît que `minRir`, `maxSets`, `noHeavyReps`. Il n'existe AUCUN plafond de répétitions (`noHeavyReps` va dans le mauvais sens : il impose les 10-15 des exercices « autres »). « 2 séries, peu de répétitions » exige donc un nouveau champ (par exemple `maxReps`) et sa lecture dans la logique de dose : changement de code et de tests, pas seulement de données.
  2. Pour la pompe, plafonner la dose ne suffit pas : il faut aussi empêcher l'échelon 2 hors condition vérifiable (la fiche le subordonne à l'échelon 1 contrôlé, que l'app ne sait pas vérifier). Piste : ne proposer que l'échelon 1 `pompe-equilibre-mur-pieds` (ou exclure la fiche des programmes générés) tant que la condition n'est pas vérifiable ; décision `kine`.
  3. Les valeurs (séries, répétitions, réserve) sont à fixer par `coach` + `kine` (rien n'est sourcé : à marquer NON SOURCÉ / PROVISOIRE), puis contrôle du relecteur.
  4. Cause racine : liste noire. Le RIR 1 de l'avancé s'applique à toute fiche absente de DOSE_LIMITS (l.227-249, NO_FAILURE_FICHES) ; les deux fiches n'y sont pas. Une liste blanche (RIR 1 seulement pour les fiches explicitement sûres) fermerait la classe de défaut, au lieu de corriger deux cas.
- Autres exercices du même type dans les 6 profils (RIR 1 sur une fiche sans dose sourcée ni mention « pas d'échec ») : tous dans le profil 6 (les profils 1 à 5 sont à RIR 2-3, aucun RIR 1). Gravité : à surveiller, non bloquant.
  - Montée sur box haute (LEGS-B l.499/567, 3 x 10-15, RIR 1, unilatéral, en premier exercice des jambes) : fiche montee-sur-marche, variante `montee-sur-box-haute`, « valeurs non sourcées », échelon 3 ; risque de déséquilibre à l'approche de l'échec. À faire arbitrer par `kine`.
  - Poussée de hanches une jambe (LEGS-B l.500/568, 3 x 10-15, RIR 1) : fiche hip-thrust-banc (« si le bassin bascule ou si l'équilibre manque, reviens à deux jambes ») ; fiche soeur hip-thrust-chaise : « jamais jusqu'à l'échec » pour l'unilatéral. Incohérence entre fiches soeurs : à harmoniser par `kine`.
  - Traction à la barre RIR 1 (HAUT-A, PULL-B) et tirage au visage poulie RIR 1 (PULL-B) : pas de mise en garde de fiche contraire (la mention « jamais jusqu'à l'échec » de face-pull-elastique ne vise que la grossesse, ce que l'analyse dit correctement). Volume de tractions élevé en semaine (3 + 3 + 3 séries à 10-15) : remarque `coach`, non sécuritaire en soi.

## Écarts dans les documents (à corriger par l'auteur)

Gravité « à corriger » sauf mention.

- E1 (synthèse, profil 4) : « aucun travail d'épaules » est faux à la lettre : le profil 4 contient développé d'épaules à l'élastique (séance B l.307 et séance C) et tirage au visage. Reformuler : pas de travail d'épaules de stabilité ou de réception propre au volley. Auteur : celui de la synthèse.
- E2 (synthèse profil 2 et analyse (b)8) : « seul le premier exercice est vraiment force » : trois séances sur quatre commencent par un 3 x 4-6 repos 180 s (HAUT-A développé incliné barre, BAS-A squat barre, HAUT-B développé épaules assis ; seule BAS-B n'en a pas). La phrase doit dire « un exercice lourd en tête de 3 séances sur 4, le reste en 2 x 8-15 ». Même nuance pour le soulevé de terre en 2 x 8-12 (exact). Auteur : synthèse et analyse.
- E3 (analyse (b)1 et synthèse, section « pas encore là ») : « aucun travail de mollets chargé dans les 6 programmes » contredit (b)8 de la même analyse et le profil 2 (BAS-B : montée sur les pointes assis avec un haltère sur les cuisses, 2 x 12-15 ; semaines 2 et 4 avec haltères) et la synthèse profil 2 (« mollets maintenant travaillés »). Retirer « mollets » de la liste des absences d'isolation ou préciser « profil 6 ». Auteur : analyse puis synthèse.
- E4 (synthèse, « À corriger avant tout », l.11 et recommandation 1) : correction décrite comme « 2 séries, peu de répétitions... Coût faible, quelques lignes de configuration ». Inexact (voir B1, point 1 et 2) : nouveau champ de plafond de répétitions et traitement de l'échelon de la pompe. Écrire : « coût faible à moyen ». Auteur : synthèse. Gravité : à corriger (décision de l'utilisateur prise sur un coût faux).
- E5 (analyse (b), 1re phrase) : « 0 pour les profils 3 et 6 » : le tableau du document donne, pour le profil 6, HAUT-A/PULL-B : 1 commun sur 4 (la traction), en semaines 1 et 2. Valable seulement pour les séances « du même type » (aucune paire de même type en profil 6) : à préciser. Gravité : remarque.
- E6 (analyse (b)4) : pour le profil 2, le texte cite « tirage vertical à un bras x2 » : exact (l.148 et l.178), mais le profil 2 contient donc deux exercices à l'élastique alors que la synthèse écrit « élastiques de la maison retirés grâce au filtre salle ». Nuancer dans la synthèse : « presque tous retirés, sauf ce tirage réadmis par pénurie ». Auteur : synthèse. Gravité : remarque.
- E7 (analyse (c) première phrase du bloc « À confirmer ») : bien écrire que ces deux défauts sont BLOQUANTS pour le profil 6 (l'analyse les range avec des pistes « sans affaiblir la sécurité » et parle du « seul défaut de sécurité vu » : à corriger, car les trois exercices RIR 1 ci-dessus ne sont pas listés). Ajouter : montée sur box haute et poussée de hanches une jambe à RIR 1, à faire examiner par `kine`. Auteur : analyse. Gravité : à corriger.

## Vérification des chiffres (échantillon par profil, comparé au document de programmes)

| Profil | Affirmations vérifiées | Résultat |
|---|---|---|
| 1 | 8 exercices, 2 séries, 2 x 10-12 (certaines 2 x 10-15), RIR 3 ; 45/40/40 min ; recouvrement 1 sur 7 (A/C, B/C) ; 4 doses distinctes ; 1 accessoire change en S2 ; messages vides | Exact |
| 2 | 35-40 min (salle) pour 60 demandées ; 3 x 4-6 repos 180 s ; soulevé 2 x 8-12 en BAS-B ; 8 doses ; 5 accessoires changent ; HAUT-A/HAUT-B 1 sur 6 ; mollets présents | Exact, sauf E2 et E3 |
| 3 | 45 min x 3 + 30 min dimanche ; cardio « [option] » ; 0 commun ; 7 doses ; 1 accessoire change ; texte « cardio retiré » contradictoire (l.276) ; OMS 150-300 min contre 30 min | Exact |
| 4 | 35-40 min ; 2 paires de superset en B (B-P1, B-P3) ; 4 doses, 2 x 10-15 RIR 3 ; cardio sport = marche 30 min, sauts : aucun ; recouvrement 1 sur 8 ; 5 accessoires changent | Exact, sauf E1 |
| 5 | 40 min x 3 ; pompe x3 ; 3 doses ; 4 accessoires changent | Exact |
| 6 | 5 séances 50/45/35/30/40 min pour 75 demandées ; PUSH-B et PULL-B à 4 exercices ; traction-barre x2 dans PULL-B (gilet RIR 2 puis barre RIR 1) ; 26 exercices placés, 1 accessoire change (LEGS-B) ; 6 doses | Exact |

Totaux : 21 séances de force (3+4+3+3+3+5) : exact. Tableau de répétitivité identique aux chiffres de l'analyse et de la synthèse (hors E5).

Statuts D33/D34 : « isolation non étendue (isoEligible), R-PLIO et PV3-REINV non codés » : confirmé par D34-bilan.md l.9 (« Non codé : R-PLIO, sports, isoEligible, PV3-REINV, supersets assouplis ») et D33-bilan.md l.8. La synthèse rectifie correctement l'idée que l'isolation serait « codée ».

## Textes et matériel

- Aucune mention interne (coach, kine, règle, R2, n3, isoEligible, undefined, NaN) dans les textes des 6 programmes (l.1-612) : les occurrences sont toutes dans la partie rédigée à la main (l.613 et suivantes), qui est un document d'analyse destiné à l'équipe, pas un texte affiché dans l'app. Les identifiants entre crochets ([V-MSG-OBJ], [SUPERSET B-P1]) sont des étiquettes du document, à ne pas afficher tels quels dans l'app (remarque).
- Phrase contradictoire (déjà connue des auteurs) : profil 3, « Cardio : pas assez de temps dans 45 min, il est retiré en premier » alors qu'une séance de cardio existe, étiquette « [option] » alors qu'elle est par défaut. À corriger dans le générateur (hors périmètre de ce contrôle).
- Matériel : cohérent avec les réglages sauf le tirage vertical à l'élastique « (à la maison) » du profil 2 (réadmission par pénurie, signalée), les sangles de suspension au profil 2 et 6 (non exclues en salle, signalé), et la mention « Debout sur l'élastique » du développé d'épaules (profil 1, 4, maison : cohérent). Pas d'incohérence nouvelle.

## Liste synthétique pour l'auteur

| Id | Fichier | Problème | Gravité | Auteur |
|---|---|---|---|---|
| B1 | docs/programmes-exemples.md l.464, 477 (et 532, 545) | Nordique sans mains et pompe en équilibre échelon 2 en 3 x 10-15 RIR 1, contre leur fiche | Bloquant | `dev` (code), valeurs `coach` + `kine` |
| B1b | src/generator/config.ts l.215 | `DoseLimit` sans plafond de répétitions ; échelon de la pompe non limité ; liste noire plutôt que liste blanche | Bloquant (conditionne B1) | `dev` |
| B1c | idem LEGS-B l.499-500 | Montée sur box haute et hip thrust une jambe à RIR 1 : arbitrage kiné | À corriger | `kine` |
| E1 | synthèse profil 4 | « aucun travail d'épaules » faux | À corriger | auteur synthèse |
| E2 | synthèse profil 2, analyse (b)8 | « seul le premier exercice est force » faux (3 séances sur 4) | À corriger | auteur synthèse + analyse |
| E3 | analyse (b)1, synthèse | mollets absents contredit par le profil 2 | À corriger | auteur analyse + synthèse |
| E4 | synthèse l.11 et recommandation 1 | coût « faible » sous-estimé | À corriger | auteur synthèse |
| E5 | analyse (b) première phrase | « 0 pour le profil 6 » vs tableau (1 sur 4) | Remarque | auteur analyse |
| E6 | synthèse profil 2 | « élastiques retirés » nuancer | Remarque | auteur synthèse |
| E7 | analyse (c) | Qualifier B1 de bloquant et ajouter les RIR 1 à surveiller | À corriger | auteur analyse |

Limites de ce contrôle : je n'ai pas relu les séances 3 à 5 ligne à ligne (échantillon chiffré seulement), ni rouvert les fiches de traction ni de tirage au visage en entier, ni le code de dose.ts (la présence ou non d'un plafond de répétitions est déduite de l'interface `DoseLimit`). Rien n'est validé tant que B1 reste ouvert.
