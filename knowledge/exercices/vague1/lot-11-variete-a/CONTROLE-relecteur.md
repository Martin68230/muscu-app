# Contrôle du relecteur : lot 11A (9 fiches, statut complete_kine)

Contrôle indépendant du 2026-11-01, lancé à neuf. Aucune fiche n'est corrigée ici. `timeout 120 npm run check:fiches` : 208 fiche(s) contrôlée(s), 0 erreur, 0 avertissement (le validateur ne vérifie ni la règle sur `nom`, ni le sens des liens, ni la cohérence entre fiches : ce contrôle est manuel).

**Verdict global : NON VALIDÉ.** 2 points bloquants (B1 pullover, B2 pompe piquée). Les 7 autres fiches sont valides sous réserve d'écarts à corriger.

## Sources vérifiées
- Toutes les valeurs des 9 fiches sont déclarées NON SOURCÉ (jugement de coach / kine) ou renvoient aux règles communes avec leurs statuts réels : les étiquettes sont honnêtes (R1, R2, R3, R7, R8, R9 NON SOURCÉ ; R4, R5, R6, R10 PROVISOIRE ; grossesse « principe OK, classement NON SOURCÉ »). Aucune source à ouvrir sur le fond. Seule exception : l'ancrage de porte (tirage-poitrine-assis-elastique) renvoie à une notice Serious Steel, étiquetée PROVISOIRE (cohérent avec regles-securite-communes.md §7).
- Lecture faite : format-fiches.md, regles-securite-communes.md (G4, G7, R8, §7), taxonomie-schemas.md, fiches existantes pompe, pompe-piquee, pompe-piquee-pieds-sureleves, developpe-epaules-elastique, tirage-vertical-elastique-haut, pullover-haltere-au-sol, rowing-elastique ; knowledge/programmes-v3.md §9, generateur-v1.md §7.1, docs/QUESTIONS.md Q3, src/generator (variety.ts, safety.ts, config.ts).
- Contrôle externe fait pour l'écart P4 (charge de la pompe selon l'appui) : Ebben et al. 2011 (J Strength Cond Res 25(10)) et Suprak et al. 2011 (JSCR 25(2):497-503), lus seulement via des relais secondaires (Stoppani, tableaux de synthèse) : mains sur une caisse de 30 cm environ 55 % du poids du corps, pompe sur les genoux environ 49 % (autre relais : 54 à 62 %), pompe au sol environ 64 % ; les chiffres divergent selon les relais : **PROVISOIRE, à vérifier dans les articles par `coach`**.

## Tableau des verdicts

| Fiche | Verdict | Écarts |
|---|---|---|
| developpe-epaules-elastique-alterne | VALIDE SOUS RÉSERVE | D1, D2, D3 |
| developpe-epaules-elastique-neutre | VALIDE SOUS RÉSERVE | D4, D3 |
| developpe-sol-elastique | VALIDE SOUS RÉSERVE | S1, S2, S3 |
| pompe-inclinee-mains-surelevees | VALIDE SOUS RÉSERVE | P1, P2, P3, P4 |
| pompe-piquee-mains-sureleves | **BLOQUANT** | B2, Q1, Q2, Q3, Q4 |
| pompe-sur-les-genoux | VALIDE SOUS RÉSERVE | G1, G2, G3, G4 |
| pullover-halteres-banc | **BLOQUANT** | B1, U1 |
| tirage-poitrine-assis-elastique | VALIDE SOUS RÉSERVE | T1, T2, T3 |
| tirage-vertical-un-bras-elastique | VALIDE SOUS RÉSERVE | V1, V2, V3 |

## Écarts bloquants

**B1 (pullover-halteres-banc, BLOQUANT, auteur : kine puis coach)** : doublon exact et contradictoire d'une fiche utilisable. `pullover-haltere-au-sol` contient déjà la variante `pullover-banc-haltere` (échelon 2, intermédiaire, halteres + banc, même installation : dans l'axe du banc, tête et épaules sur le banc). Les deux fiches se contredisent sur la sécurité du même geste :
- Épaule niveau 1 : le pilote impose « au sol seulement, la variante sur banc est retirée » (`adapter: variante:pullover-sol-haltere`) ; la nouvelle fiche garde le banc avec `amplitude:mi-course`. Une personne avec une gêne légère à l'épaule se verrait donc proposer le pullover sur banc par la nouvelle fiche, alors que le pilote l'interdit. Charge au-dessus du visage, épaule : point de sécurité réel.
- Dos : pilote n1 garder / n2 amplitude réduite ; nouvelle fiche n1 amplitude réduite / n2 retirer.
- Muscle principal : pilote `pectoraux`, nouvelle fiche `grand_dorsal` pour le même exercice (une des deux listes est fausse).
- Grossesse : pilote remplaçant `rowing-unilateral-haltere`, nouvelle fiche aucun remplaçant.
- Gain de variété nul : même famille générateur (`tirage_v:pullover`, familyOf = schéma + premier mot de l'id) et même exercice. Le lot ne sert pas la variété ici.
Correction attendue : ne pas garder cette fiche ; si on la garde, aligner explicitement les deux fiches (muscles, lignes épaule/dos, grossesse) et justifier ce qu'elle apporte de plus que la variante existante (rien aujourd'hui).

**B2 (pompe-piquee-mains-sureleves, BLOQUANT, auteur : coach avec kine)** : la variante `pompe-piquee-sol-hanches-hautes` (échelon 2, tête vers le sol, vertige « plus probable » selon la fiche elle-même) n'a aucune consigne propre. Les Consignes 1 à 5 parlent de la chaise, du « bord de l'assise », du test de bascule et de la limite « jamais plus près que 10 cm de l'assise » ; rien ne dit où s'arrêter au sol. C'est la variante la plus risquée (tête en bas, poids sur les poignets) et elle n'a pas de règle d'arrêt de descente. Correction : consignes (ou sous-consignes) pour la variante au sol, avec une limite de descente chiffrée sur le choix prudent déjà posé pour la chaise, ou retirer la variante (elle double `pompe-piquee-sol` du pilote, voir Q2).

## Écarts par fiche

### developpe-epaules-elastique-alterne
- **D1 (à corriger, coach, kine pour le niveau)** : doublon partiel et contradiction de niveau avec la variante `developpe-epaules-elastique-un-bras` (fiche existante, échelon 2, **intermédiaire**) : même mouvement unilatéral à l'élastique, classé ici **débutant** dès l'échelon 1. Soit passer la fiche à intermédiaire, soit justifier la différence (assis, dossier, l'autre bras en bas) et le dire dans la fiche.
- **D2 (à corriger, coach)** : incohérence interne sur l'autre bras. Intro : « l'autre reste en bas » ; installation assis : « l'autre main à la même hauteur, qui attend » ; consigne 4 : redescendre « à hauteur d'épaule ». Choisir une position (une main tenue à hauteur d'épaule sous tension isométrique n'est pas équivalente à un bras en bas).
- **D3 (remarque, coach)** : épaule niveau 1 `amplitude:mi-course` alors que la fiche de référence `developpe-epaules-elastique` utilise `amplitude:bras-bas` ; non contradictoire mais à harmoniser (les notes disent « même règle » seulement pour le niveau 2). Pas de consigne de respiration alors que la grossesse l'exige en note (« respiration continue »).
- Lien `plus-dur: aucun` : correct. `plus-facile: developpe-epaules-elastique-neutre` : même schéma `poussee_v`, muscles identiques, mais voir D4.

### developpe-epaules-elastique-neutre
- **D4 (à corriger, coach)** : lien `plus-dur: developpe-epaules-elastique-alterne` sans vraie progression : les deux fiches sont débutant, l'échelon 1 de l'alterne (assis) n'est pas plus dur que l'échelon 2 de la neutre (debout). Taxonomie : « garder un sens de progression ». Retirer le lien ou le justifier ; le lien inverse de l'alterne vers la neutre est correct seulement si l'alterne reste plus dur.
- Remarque : fiche = variante de prise de `developpe-epaules-elastique` (qui propose déjà `appui:paumes-face-a-face` en adaptation poignet) : même famille générateur (`poussee_v:developpe`), pas de gain de famille. Acceptable comme variation de prise, à dire honnêtement.
- Sécurité : lignes cohérentes avec la référence (épaule retirer dès le niveau 2, dos variante assise, grossesse assis).

### developpe-sol-elastique
- **S1 (à corriger, kine)** : grossesse : `retirer: remplacant:pompe-inclinee-chaise-calee`, cible = variante d'une fiche du même lot, pas encore `utilisable`. En attendant, utiliser `pompe-chaise` (fiche `pompe`, utilisable, même rôle) ou garder le remplaçant seulement après passage du lot. « Version plus douce » : `developpe-sol-elastique-deux-bras` alors que la fiche est retirée en grossesse (même motif que le pilote, remarque).
- **S2 (à corriger, coach)** : consigne 1 de 120 mots environ (contrôle, positionnement, test de l'élastique) : trop longue pour « français simple » ; scinder (la 6e consigne limite à 6 étapes : déplacer le test dans « Points d'attention »).
- **S3 (remarque, kine)** : sécurité de l'élastique sous le haut du dos (glissement, pincement, rebond) bien traitée, étiquetée NON SOURCÉ, aucune notice lue : honnête. Débutant accepté : à confirmer par kine après S1. Familles : `poussee_h:developpe` (même famille que `developpe-au-sol-halteres`) : un vrai gain à l'élastique (A), pas à A0.

### pompe-inclinee-mains-surelevees
- **P1 (à corriger, kine)** : note `poignet-n1` / `poignet-n2` : « poings fermés si besoin » alors que la case est `adapter: variante:pompe-inclinee-chaise-calee` (mains sur le bord d'une chaise) et que `pompe-piquee-mains-sureleves` (même lot, relu par kine) dit que les poings fermés « roulent » sur le bord d'une chaise. Contradiction de sécurité à trancher.
- **P2 (à corriger, coach)** : doublon des échelons mains hautes de `pompe` : `pompe-inclinee-chaise-calee` = `pompe-chaise` (même installation, mêmes tags `chaise, mur`). La seule nouveauté est la marche. La fiche le dit (« reprend à part »). Gain de variété réel : faible (même famille que `pompe` côté générateur : `poussee_h:pompe`, plafond 2 par semaine). À assumer dans la fiche et dans le bilan.
- **P3 (à corriger, coach, kine)** : cases épaule/poignet/dos niveau 2 `adapter: variante:pompe-inclinee-chaise-calee` = l'échelon 1 : pour la personne déjà sur la chaise, la case ne change rien. Règle §0 : une adaptation qui ne change rien n'est pas une adaptation ; préciser dans la note l'effet réel (amplitude réduite, séries plafonnées) ou utiliser une case d'amplitude.
- **P4 (à corriger, coach ; signalé par la demande)** : `plus-dur: pompe-sur-les-genoux` n'est pas une progression pour l'échelon 2. Mains sur la première marche (environ 18 à 20 cm) : charge estimée autour de 55 à 60 % du poids du corps d'après Ebben/Suprak (relais secondaires, PROVISOIRE), donc **plus dure** que les genoux (environ 49 %). La chaise (45 cm) est proche des genoux. Le lien « plus dur » mène donc de l'échelon 2 vers un exercice plus facile. Correction : retirer `pompe-sur-les-genoux` de `plus-dur`, mettre `plus-dur: pompe` ou `aucun`, ou placer la marche dans l'échelle au bon endroit (la marche avant la chaise ? non : plus bas = plus dur ; elle doit venir après les genoux dans l'échelle, pas avant). Même point côté `pompe-sur-les-genoux` : son `plus-facile: pompe-inclinee-mains-surelevees` est correct pour la chaise, faux pour la marche.
- Cibles : `pompe-sur-les-genoux` existe (même lot, complete_kine : lien sans effet tant que la fiche n'est pas utilisable ; le lien affiché n'est résolu que si la fiche est dans fiches.json). Marche : respecte §7 (première marche, sans charge, rampe non exigée mais conditions détaillées) ; grossesse sur chaise seulement : bien.
- Alias « incline push-up » : accepté (alias, jamais titre).

### pompe-piquee-mains-sureleves
- **B2** ci-dessus.
- **Q1 (à corriger, coach)** : nom et id inexacts : « mains surélevées » est faux pour la variante 2 (mains au sol). Règle sur `nom` : ne citer que ce que toutes les variantes ont. Renommer (« Pompe piquée, version allégée ») ; l'id `pompe-piquee-mains-sureleves` comporte en plus une faute (`sureleves`) : à corriger avant le passage en utilisable (id stable ensuite).
- **Q2 (à corriger, coach)** : doublon de `pompe-piquee` (pilote) : variante 2 = `pompe-piquee-sol` ; variante 1 = `pompe-piquee-mains-marche` avec une chaise à la place de la marche. Même famille générateur (`poussee_v:pompe`) : **aucun gain** pour la variété, niveau intermédiaire seulement.
- **Q3 (à corriger, coach)** : `alias: [pike push-up débutant, ...]` : le mot « débutant » contredit le classement intermédiaire décidé par kine (règle 23 appliquée avec prudence). L'alias sert à la recherche : le retirer. L'alias « pompe en V sur chaise » est faux pour la variante 2.
- **Q4 (à corriger, coach)** : `plus-dur: pompe-piquee` : l'échelon 1 de la cible est la marche (mains à 18 cm), pas plus dur que la chaise de façon évidente, et la variante 2 (sol) est de même niveau que `pompe-piquee-sol`. La vraie suite est `pompe-piquee-pieds-sureleves` ou `aucun`. Grossesse : `retirer` sans remplaçant alors que le pilote donne `remplacant:pompe-chaise` : aligner (poussée H de remplacement). « Version plus douce » : `pompe-piquee-chaise`, elle-même retirée en grossesse (remarque).
- Règle 23 : la fiche est classée intermédiaire (pas débutant), aucun matériel spécialisé, pas d'exercice technique au sens de la règle 23 (snatch, clean) ; la décision de kine du 2026-11-01 est cohérente avec le pilote et avec docs/QUESTIONS.md Q3 ; **OK**. Sécurité du reste : retrait poignet dès le niveau 1, cou/épaule/coude, grossesse retirer, signes d'arrêt vertige : corrects. Remarque : post-partum non cité dans les notes (G7).

### pompe-sur-les-genoux
- **G1 (à corriger, coach)** : doublon exact de `pompe-genoux` (variante échelon 3 de `pompe`, mêmes tags). Une variante « descente lente » n'est pas un échelon d'exercice (c'est un tempo) : le distinguer comme variante pose problème au générateur (progression par variante inutile). Même famille que `pompe`.
- **G2 (à corriger, coach)** : consigne 6 et « Objets du quotidien » affichent l'id interne `pompe-inclinee-mains-surelevees` (texte affiché à l'utilisateur). Réécrire en français : « monte les mains sur une chaise calée ».
- **G3 (à corriger, kine)** : remplaçant `pompe-inclinee-chaise-calee` pour épaule, poignet et dos niveau 2 : ces zones ont elles-mêmes une case `adapter` dans la fiche cible (règle §0 : un remplaçant adapté par la même zone n'est pas proposé, la case devient `retirer` sans remplaçant). Préciser ou accepter explicitement l'exception. Même cible hors lot validé : voir S1.
- **G4 (remarque)** : la note `grossesse` est écrite deux fois avec des textes différents ; ne garder qu'une. `plus-dur: pompe` : la cible `pompe` a pour échelon 1 `pompe-mur` (plus facile) : le lien affiché pointe la fiche, pas la bonne variante ; préciser « pompe sur la chaise... » ou accepter (affichage par fiche).
- Sécurité : appui coussin, poings fermés au sol (sol plat : acceptable), grossesse retirée avec remplaçant : cohérent avec G4.

### pullover-halteres-banc
- **B1** ci-dessus.
- **U1 (à corriger si la fiche est gardée, coach)** : `Version plus douce : aucune` alors que la fiche existante la plus douce est `pullover-haltere-au-sol` ; dans « Points d'attention » la fiche dit elle-même de choisir le pullover au sol : le dire dans le champ. Charge au-dessus du visage : R9 appliquée (haltère fixe de préférence, entrée et sortie du banc décrites) : bien, étiquette NON SOURCÉ honnête.

### tirage-poitrine-assis-elastique
- **T1 (à corriger, coach)** : quasi-doublon de `tirage-vertical-elastique-assis` (assis, chaise, ancrage haut, deux bras, mêmes tags `elastique, porte, chaise`, mêmes consignes de tirage) ; seule différence : « prise large ». La variante un bras assise est nouvelle (la fiche existante a un bras à genoux). Même famille générateur (`tirage_v:tirage`) que `tirage-vertical-elastique-haut` et `tirage-vertical-un-bras-elastique` : au plus 2 de ces 3 fiches par semaine. Gain réel : faible, à dire.
- **T2 (à corriger, kine)** : test de l'ancrage (consigne 1) : « tire de plus en plus fort ... » encourage à dépasser la charge de l'exercice et peut faire lâcher l'ancrage ou la porte visage près de l'élastique. Remplacer par « tire progressivement jusqu'à la tension de la série, pas plus ».
- **T3 (remarque)** : ancrage de porte : conditions §7 respectées (côté gonds, porte pleine, fermée, à clé si possible, s'ouvre en s'éloignant, notice, contrôle avant usage) ; statut PROVISOIRE (une seule notice, extraits) : honnête. Remplaçant épaule n2 `rowing-elastique-assis` : fiche `rowing-elastique` (tirage_h, utilisable, tags `elastique, tapis`) existe, variante `rowing-elastique-assis` existe ; **mais** cette variante est elle-même adaptée en épaule n2 (`amplitude:reduite`, règle §0) et en dos (variante) : le remplaçant n'est proposé que dans cette version adaptée ; le dire dans la note. Même motif que dans `tirage-vertical-elastique-haut` (pratique existante : remarque seulement). Liens : `plus-facile: tirage-vertical-un-bras-elastique` : même schéma, même muscle (grand dorsal), cible débutant : valide ; sens de la progression discutable (un bras sans ancrage n'est pas nécessairement plus facile que deux bras ancrés).

### tirage-vertical-un-bras-elastique
- **V1 (à corriger, coach)** : incohérence consignes : consigne 3 « le coude vers la hanche » et consigne 4 « la main arrive à hauteur de l'épaule ; ne tire pas plus bas ». Choisir.
- **V2 (à corriger, coach)** : « bande continue en boucle » dans l'installation alors que le tag `elastique` exclut la boucle fermée (c'est `mini_bande`, materiel-tags.json). Retirer la mention ou changer le tag.
- **V3 (remarque)** : sécurité : élastique tenu à la main sous la même tension des deux côtés, main du haut plafonnée à hauteur du front, procédure de lâcher, jamais accroché : bien pensée, NON SOURCÉ honnête. Gain réel (pas d'ancrage : la porte n'est pas requise) : c'est le principal apport « ancrage » du lot. Lien `plus-dur: tirage-poitrine-assis-elastique` : la cible exige un ancrage de porte, ce n'est pas « plus dur » mais « autre matériel » : à reformuler ou retirer. Deux variantes au même échelon 1 : correct.

## Contrôles transversaux

- **Règle 23** : aucune fiche n'est technique au sens de la règle (snatch, clean) ni ne demande de matériel spécialisé ; la pompe piquée est intermédiaire ; aucun exercice technique pour débutant ni à la maison : **OK**.
- **Grossesse / post-partum** : les 9 fiches ont une ligne `Grossesse` conforme à G4 (couché sur le dos : retirer ; tête en bas : retirer ; assis dossier droit : adapter). Le post-partum n'est cité que dans certaines notes (G7) : remarque uniforme.
- **Chaise, marche, élastique, ancrage de porte** : conformes à §7 et à R8, sauf P1, S1, T2. Chaise : test de bascule présent là où la chaise porte le poids du corps.
- **Tags et noms** : tags tous présents dans materiel-tags.json (`chaise, mur, marche_escalier, porte, tapis, elastique, halteres, banc, poids_du_corps`). Noms : conformes sauf Q1. Aucun texte copié d'une autre app détecté (réécritures déclarées).
- **Illustrations** : aucune fiche n'a d'image (`aucune photo`) : à produire (tools/illustrations-poses.mjs) avant `utilisable`, sinon `check:fiches` donnera une erreur au passage de statut.
- **Statut des liens** : `plus-facile` / `plus-dur` / remplaçants qui pointent d'autres fiches du lot (`pompe-sur-les-genoux`, `pompe-inclinee-chaise-calee`, `tirage-poitrine-assis-elastique`, `developpe-epaules-elastique-*`) ne sont utilisables qu'une fois ces fiches `utilisable` ; sinon lien affiché sans cible ou remplaçant ignoré par le générateur (S1, G3).

## programmes-v3.md §9 et générateur : dépendance à la pompe piquée
- **OK, aucune dépendance** : `grep` sur src/generator, programmes-v3.md, generateur-v1.md : aucun id `pompe-piquee*` codé en dur dans src/generator ; generateur-v1.md §7.1 (ligne « poussée V ») et docs/QUESTIONS.md Q3 disent déjà que `pompe-piquee` est intermédiaire et qu'un débutant sans matériel n'a aucune fiche `poussee_v` (message V-MSG-EPAULES). programmes-v3.md §9 compte par famille et n'appuie rien sur la pompe piquée.
- **À corriger (coach)** : §9 liste « poussée verticale sans matériel ou à l'élastique : 3 fiches (débutant ; 4 pour A0) ». Le lot 11A n'apporte **aucune** fiche poussée verticale pour le débutant sans matériel (A0) : D-A0 reste à 0 (seulement la poussée H change). À l'élastique : les deux développés épaules (alterne, neutre) sont de la même famille que `developpe-epaules-elastique` (`poussee_v:developpe`) : gain compté par famille = +1 fiche utile (de 1 à 2, plafond 2). §9 et le bilan doivent le dire ; ne pas annoncer la cible 4 atteinte.

## Le lot sert-il la variété ?
Selon la règle de famille du générateur (schéma + premier mot de l'id, 2 fiches par famille et par semaine), calculée à la main (je n'ai pas relancé tools/mesure-variete.mjs) :
- poussée H A0 : pompe-inclinee + pompe-sur-les-genoux rejoignent la famille `poussee_h:pompe` : 1 -> 2 fiches utiles (+1) ; ce sont des doublons d'échelons de `pompe`.
- poussée H A (élastique) : développé au sol à l'élastique, nouvelle famille effective côté élastique : +1.
- poussée V A (élastique) : +1 (famille `developpe`, plafond 2). Poussée V A0 : 0. Pompe piquée : 0 (famille `pompe` déjà à 2, intermédiaire seulement).
- tirage V A : les deux nouvelles fiches rejoignent `tirage_v:tirage` : plafond 2 : +1. Pullover : 0.
Le coach a raison : le gain est surtout de famille et d'ancrage (tirage un bras sans ancrage de porte, développé au sol élastique). Hors de ces deux apports, 4 des 9 fiches (pullover, pompe piquée allégée, pompe sur les genoux, pompe inclinée) reproduisent des échelons ou variantes existants.

## À corriger, par auteur

**Kine** : B1 (décider du sort du pullover banc, aligner épaule/dos/grossesse avec le pilote si gardé), B2 (limite de descente et consigne propre à la variante au sol, ou retrait), P1 (poings fermés sur chaise), P3, S1 (remplaçant grossesse utilisable), G3 (remplaçant adapté par la même zone), T2 (test d'ancrage), D1 (niveau de l'alterne, avec coach).

**Coach** : B1 (muscle principal du pullover ; justification ou suppression), B2 (consignes de la variante sol), Q1 à Q4, P2, P4 (lien plus-dur et ordre marche/genoux, source Ebben/Suprak à lire), G1, G2, G4, D1 à D4, S2, T1, V1, V2, U1, mise à jour de programmes-v3.md §9 (gain réel du lot), illustrations avant utilisable.

Rien n'est validé tant que B1 et B2 ne sont pas levés ; ensuite nouveau contrôle lancé à neuf des fiches corrigées.
