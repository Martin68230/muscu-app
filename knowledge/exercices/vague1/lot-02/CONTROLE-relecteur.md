# Contrôle `relecteur` du lot-02 (24 fiches), 22/10/2026

Contrôle lancé à neuf, sans corriger les fiches. Entrées lues : les 24 fiches, README du lot (contexte), format-fiches.md, regles-securite-communes.md, sports.md, materiel-tags.json, fiches pilote et lot-01 citées par des ids. `npm run check:fiches` : 78 fiches, 0 erreur, 0 avertissement (je l'ai relancé). Le script ne vérifie pas le fond ; les points ci-dessous viennent d'une lecture à la main.

Vérifications faites : tous les ids cités (variante, remplaçant, sans-zone, plus-facile, plus-dur, version plus douce) existent dans le lot, le pilote ou le lot-01, et aucun id de variante n'est en double. Les 8 cases « Grossesse » pointent vers des fiches ou variantes qui ne sont pas retirées par la grossesse (bird-dog-jambe-seule, squat-assis-debout, SDT roumain, squat-fendu-mur, releve-mollets-mur, marche-laterale-elastique-cuisses). Les cases des fiches plus dures ne sont jamais plus permissives que celles de la fiche plus facile, sauf aux points listés. Aucune fiche n'est présentée comme `verifie`.

## Synthèse

- OK : 10 (curl-ischios-serviette, equilibre-unipodal, glissement-mur-epaules, mobilite-hanches-90-90, nordique-ischios, oiseau-halteres, ouverture-livre-thoracique, reception-saut-stabilisee, rotation-russe, saut-lateral-patineur), avec des remarques mineures.
- À corriger : 11 (cheville-elastique, copenhague-court, fente-avant, fente-laterale, marche-laterale-elastique, pompe-plus, releve-mollets, rotation-externe-epaule, saut-fendu-alterne, squat-sumo, ytw-sol).
- Bloquant : 3 (rebonds-chevilles, saut-vertical, saut-longueur-pieds-joints).
- Rien n'est validé tant que les 3 bloquants subsistent. Pour le lot, ce sont aussi les 3 fiches qui dépendent de la décision de l'utilisateur sur la question 8 du README.

## Sondage des sources (22/10/2026)

- free-exercise-db, entrées ouvertes une par une (raw GitHub) : Bodyweight_Walking_Lunge, Dumbbell_Lunges, Floor_Glute-Ham_Raise, Reverse_Flyes, Calf_Raises_-_With_Bands, Standing_Dumbbell_Calf_Raise, External_Rotation_with_Band, External_Rotation, Russian_Twist, Split_Jump, Lateral_Bound, Standing_Long_Jump, Rocket_Jump, Freehand_Jump_Squat, Plie_Dumbbell_Squat, Seated_Bent-Over_Rear_Delt_Raise. Tous existent. Les niveaux et gestes sont conformes aux fiches, y compris les écarts annoncés (élastique à deux mains, sol au lieu du banc, pieds au sol pour la rotation russe, marche au lieu d'une planche de quelques cm). Seul Seated_Bent-Over_Rear_Delt_Raise est de niveau intermédiaire, alors que la fiche oiseau le met débutant (ligne annoncée « non lue » : elle est lisible).
- Écart : **Monster_Walk** existe (niveau beginner, bande aux chevilles et aux genoux ; dans exercise-library-draft.csv sous M1637). Les fiches disent « aucune entrée trouvée » pour la marche à l'élastique (voir marche-laterale-elastique). Le sondage « par nom » n'est donc pas fiable pour les mouvements notés « aucune entrée ». Je n'ai pas pu lister tout le dépôt.
- Nordique (BJSM 2018;52:877, synthèse PEDro) : 5 études, 4 455 participants, rapport des taux 0,49 (IC 0,29 à 0,82). C'est conforme à la fiche. La population est celle des joueurs de football : à ajouter.
- Revue sur la danse : la page indique J Dance Med Sci **vol. 30 (2026)**, 8 études. Les fiches (et sports.md) écrivent « 2025 ». Erreur de date dans cheville-elastique, equilibre-unipodal, rebonds-chevilles, reception-saut-stabilisee, releve-mollets, saut-fendu-alterne, saut-lateral-patineur, saut-longueur-pieds-joints, saut-vertical.
- Thorborg 2017 (FIFA 11+) et Andersson 2017 (OSTRC) : pages bjsm.bmj.com en 403, PubMed bloqué. Seul le titre d'Andersson (660 handballeurs d'élite) est confirmé. Les chiffres (39 %, 41 %, 48 % ; 17 % contre 23 %) viennent de sports.md et ne sont pas revérifiés ici. Les fiches les disent « résumé non rouvert » : c'est honnête, mais le statut OK repose sur un résumé non relu.
- Aucune fiche n'affirme que l'exercice « fait partie du FIFA 11+ ou du programme OSTRC » : toutes disent « NON SOURCÉ ». La colonne « famille / prévention » du README (FIFA 11+, OSTRC) donne cette impression, mais ce n'est que du contexte.

## Points transversaux (à traiter pour le lot)

T1 (bloquant) : le prérequis des sauts n'est pas codé. kine veut « aucun saut pour un débutant sans prérequis » (README, question 8), mais saut-vertical, saut-longueur-pieds-joints et rebonds-chevilles sont `debutant`, et les conseils de prérequis sont « non codés ». Un débutant sans historique de saut peut donc recevoir des sauts maximaux. Correction attendue : décision de l'utilisateur ; ensuite soit passer ces fiches en `intermediaire` (reception-saut-stabilisee seule en entrée débutant), soit faire coder par `dev` « schéma saut seulement après réception sans gêne ». Auteur : kine (avec l'utilisateur pour la décision).

T2 (à corriger) : lignes « Renforcement des adducteurs / de la hanche / des fessiers latéraux pour la prévention », statut commençant par « OK pour le programme entier ». Le résumé cité ne porte pas sur l'exercice, et l'affirmation en tête de ligne attribue l'effet à l'exercice. Fiches : copenhague-court:94, fente-laterale:92, squat-sumo:92, marche-laterale-elastique:85. Correction attendue : reformuler l'affirmation (« le FIFA 11+ entier réduit... ») et mettre le statut de l'affirmation sur l'exercice à NON SOURCÉ (ne pas écrire OK en tête). Auteur : coach.

T3 (à corriger) : `couverture: substitut` manque pour des fiches qui ne remplissent pas leur schéma. rotation-externe-epaule et ytw-sol (schema tirage_h : ce ne sont pas des tirages), pompe-plus (poussee_h : mouvement des omoplates, pas une poussée). Le générateur les compterait comme remplissant le schéma. Remarques voisines : oiseau-halteres (tirage_h, arguable), nordique-ischios et curl-ischios-serviette (charniere : flexion du genou, pas une charnière de hanche). Auteur : coach.

T4 (remarque) : la section G4 de regles-securite-communes.md ne classe pas les 24 fiches. Les retraits en grossesse de ce lot (fente latérale, nordique, curl serviette, rotation russe, Copenhague, Y-T-W, tous les sauts) sont des choix prudents de kine (question 11 du README, à confirmer par l'utilisateur) et vont plus loin que la HAS. À mettre à jour ensuite par kine.

T5 (remarque) : R9 (charge au-dessus du visage) est citée pour « disques serrés » dans des fiches où rien n'est au-dessus du visage (fente, sumo, rotation russe). Inoffensif, mais la référence est élargie. Auteur : kine.

## Verdicts par fiche

### cheville-elastique : à corriger
- l.18 à 19 (variantes eversion et inversion) : l'élastique est « tenu à la main ou fixé à un pied de meuble » sans dire de quel côté se placer. L'éversion doit être tirée vers l'intérieur et l'inversion vers l'extérieur ; le texte ne le précise pas pour l'éversion et laisse l'utilisateur deviner. Correction attendue : préciser le côté d'attache pour chaque variante (consigne 2). Auteur : coach.
- l.40 : plus-dur = equilibre-unipodal-libre, un autre mouvement (équilibre) et pas une version plus difficile du renforcement. Correction attendue : « aucun » ou une vraie progression. Auteur : coach.
- Sources : danse « 2025 » à corriger (voir sondage). Muscle « mollets » : péroniers non listés, signalé par la fiche (remarque).
- Sécurité : grille cohérente (cheville n1/n2 charge légère, n3 retirer ; grossesse garder). Rien de bloquant.

### copenhague-court : à corriger
- l.51 (Épaule n2) : remplaçant `dead-bug`, mais dead-bug est lui-même adapté à l'épaule niveau 2 (`amplitude:jambes-seules`, pilote/dead-bug). Règle de regles-securite-communes.md §0 : un remplaçant adapté par le profil actif n'est jamais proposé. Correction attendue : « retirer » sans remplaçant, ou un remplaçant non adapté à l'épaule n2. Auteur : kine.
- l.54 (Hanche n1) : `adapter: variante:copenhague-genou-chaise` est déjà l'échelon 1 ; pour une gêne à l'aine de niveau 1 (la zone « hanche » couvre l'aine, la note le dit), l'exercice reste donc proposé en entier. Pour l'exercice le plus sollicitant l'adducteur, remarque : envisager `retirer` dès le niveau 1 (même logique que le nordique pour les ischios). Auteur : kine.
- l.94 : voir T2. Ligne 93 (« Prévention aine par le Copenhague : NON SOURCÉ ») est correcte.
- Niveaux : intermédiaire (échelon 1) et avancé (levier long) cohérents. Pas de photo : raison donnée.

### curl-ischios-serviette : OK
- Remarque : le tableau Sources cite la méta-analyse du nordique dans une fiche qui n'est pas un nordique ; le texte réserve bien « la progression : NON SOURCÉ », mais l'impression d'appui reste. À préciser. Auteur : coach.
- Remarque : T3 (schema charniere). Cases au moins aussi restrictives que pont-fessier-sol : vérifié.

### equilibre-unipodal : OK
- Remarque l.41 : plus-dur = reception-saut-une-jambe, un saut pour une fiche d'équilibre, sans palier intermédiaire. À remplacer par « aucun » ou par une progression sans impact. Auteur : coach.
- Sources : danse « 2025 » (voir sondage). « Yeux fermés non proposé » : cohérent avec la question 3.

### fente-avant : à corriger
- l.54 (Cheville n2) : `variante:squat-fendu-mur`, alors que la fiche squat-fendu (pilote) envoie elle-même la cheville niveau 2 vers `squat-assis-debout` : squat-fendu-mur y est donc jugé trop sollicitant. La fente avant est plus dure que le squat fendu. Correction attendue : aligner sur squat-assis-debout au niveau 2. Auteur : kine.
- Remarque : plus-dur squat-bulgare-chaise (retiré en grossesse, tête de chute) : saut de difficulté depuis un exercice débutant.
- Sources : Bodyweight_Walking_Lunge et Dumbbell_Lunges conformes.

### fente-laterale : à corriger
- l.92 : voir T2.
- Remarque : grossesse = retirer alors que la section G4 dit « adapter » pour les fentes ; la note le dit et la question 11 attend l'utilisateur. À confirmer.
- Cases au moins aussi restrictives que le squat sumo : vérifié. Pas de photo : raison donnée.

### glissement-mur-epaules : OK
- Remarque l.39 : plus-dur = pompe-plus-mur (autre mouvement, pousser). À remplacer par « aucun ». Auteur : coach.
- Remarque : pompe-plus n'a pas de ligne « cou », alors que le glissement en a une (cou n2).

### marche-laterale-elastique : à corriger
- l.84 (Sources) : « aucune entrée free-exercise-db correspondante » est inexact. Monster_Walk (beginner, bandes aux chevilles et aux genoux, marche avant et arrière) existe et est dans le brouillon (M1637, elastique). Correction attendue : citer Monster_Walk (PROVISOIRE, en notant que la source marche vers l'avant et l'arrière, pas sur le côté), mettre `source_brouillon: [M1637]` (l.9) et corriger le README. Auteur : coach.
- l.18 : « Mini-bande (boucle) » alors que le tag `elastique` couvre aussi la bande avec poignées (materiel-tags.json) : une personne sans boucle verrait la variante. Correction attendue : préciser que seule une boucle convient, ou créer un tag. Auteur : coach (et dev pour le tag).
- l.85 : voir T2 (genou -48 % attribué à un exercice).
- Substitut déjà indiqué. Cases : cohérentes.

### mobilite-hanches-90-90 : OK
- Photo : raison valable (90_90_Hamstring est un étirement des ischios). Grille cohérente (genou n2 retirer). Rien d'autre.

### nordique-ischios : OK
- Source du chiffre (51 %, rapport 0,49) vérifiée ; ajouter « joueurs de football » dans la ligne. Remarque : T3 (charniere). Floor_Glute-Ham_Raise : niveau intermédiaire conforme à niveau_min. Prudence adaptée : retrait dès la gêne légère à la hanche et au genou, chevilles bloquées par un meuble lourd ou un partenaire (R8), grossesse retirée. Le choix « retirer dès le niveau 1 » est NON SOURCÉ et déclaré.

### oiseau-halteres : OK
- Remarque l.93 : l'entrée Seated_Bent-Over_Rear_Delt_Raise est maintenant lue : niveau intermediate, alors que `oiseau-halteres-assis` est `debutant` (haltères très légers). Écart assumé, mais à tracer comme pour les sauts. Auteur : coach.
- Remarque l.40 : plus-dur = rowing-penche-paumes-face, moins restrictif que l'oiseau à l'épaule (retirer au niveau 2 contre garder/adapter). Pas bloquant, c'est un autre mouvement.
- Grossesse : sans charge, assis, pas de banc : cohérent.

### ouverture-livre-thoracique : OK
- Cases plus restrictives que chat-vache-sol : vérifié (poignet, genou, cou, dos). Remarque : « golf » vient de sports.md (famille, pas une étude), déjà noté PROVISOIRE.

### pompe-plus : à corriger
- l.4 : T3 : ajouter `couverture: substitut` (la fiche entraîne le dentelé antérieur, pas la poussée horizontale).
- Sécurité : cases plus restrictives que pompe-mur, sans-zone coherent. Aucun autre point.

### rebonds-chevilles : bloquant
- l.6 : `niveau_min: debutant` pour des rebonds répétés sur les chevilles, avec « jamais plus permissif que la montée de mollets et la réception », prérequis « non codé » (T1). Risque tendon d'Achille et cheville chez un débutant sans préparation. Correction attendue : passer en `intermediaire` ou coder le prérequis (réception contrôlée et montée sur la pointe sans gêne), après décision de l'utilisateur. Auteur : kine.
- l.38 : plus-facile = releve-mollets-mur et reception-saut-petit-saut, ce qui est cohérent. Ligne 66 : « NON SOURCÉ » honnête. Danse « 2025 ».

### reception-saut-stabilisee : OK
- Entrée du schéma saut : `debutant` accepté (rien ne peut être plus doux). Première marche d'escalier avec descente d'un pas, pas de saut de la marche : conforme à regles-securite-communes.md §7. Cases cheville, genou, dos : retirer dès le niveau 1, hanche n1 vers le petit saut : cohérent avec les autres sauts. Le nom du fichier évite « controle » (signalé dans le README).
- Remarque : un « petit saut » sans hauteur définie reste du saut ; garder ce seul exercice d'entrée.

### releve-mollets : à corriger
- l.22 : variante `releve-mollets-une-jambe-halteres` : une jambe sur le bord de la première marche, talons dans le vide, haltère dans la main. regles-securite-communes.md §7 n'autorise les haltères sur une marche que pour `montee-sur-marche` (décision de l'utilisateur du 21/10/2026) ; ici c'est une extension non décidée, avec un déséquilibre unijambiste et un risque de chute. Correction attendue : retirer la variante, ou obtenir la décision de l'utilisateur et l'écrire dans §7. Auteur : kine (avec l'utilisateur).
- l.89 : la source Standing_Dumbbell_Calf_Raise demande une planche de 2 à 3 pouces ; le bord d'une marche d'escalier est bien plus haut (amplitude et charge sur le tendon d'Achille). L'écart est noté « adapté par coach » sans dire qu'il y a une marche plus haute. Correction attendue : le dire et en tirer la prudence. Auteur : coach.
- l.42 : plus-facile = cheville-mur-debout (étirement de cheville), ce n'est pas un montée de mollets plus facile. Remplacer par « aucun ». Auteur : coach.
- `substitut` déjà indiqué. Danse « 2025 ».

### rotation-externe-epaule : à corriger
- l.4 et l.7 : T3 : tirage_h et `deltoides_posterieurs` pour une rotation externe (coiffe) : ajouter `couverture: substitut`. Le compte du volume de deltoïdes postérieurs sera faux ; la fiche le signale (question 4). Auteur : coach.
- Source : variante à deux mains « adaptée par coach » : écart annoncé, acceptable ; la variante sur le côté sur le sol est aussi annoncée. Grossesse charge légère : acceptable. Pas de ligne « cou » : OK.

### rotation-russe : OK
- Niveau intermédiaire (source intermediate) ; halteres avancé. Cases dos n2 retirer avec remplaçant bird-dog-jambe-seule, qui reste proposé : cohérent. Remarque : plus-facile pallof-elastique-genoux demande élastique et porte, alors que la rotation russe n'en demande pas : le générateur ne le proposera qu'avec le matériel (acceptable).

### saut-fendu-alterne : à corriger
- l.17 : échelon 1 `intermediaire` = saut fendu direct (« pousse fort ») sans prérequis codé (T1) ; la source Split_Jump est beginner et le relèvement du niveau est tracé, mais le conseil « après le saut vertical » n'est pas codé. Correction attendue : coder le prérequis (ou passer en `avance`) après la décision de l'utilisateur. Auteur : kine.
- Cases : toutes retirées, plus strictes que le saut vertical : cohérent. Grossesse : squat-fendu-mur (existe et reste proposé).

### saut-lateral-patineur : OK
- Échelon 1 (pas glissé, sans saut) en `debutant`, sauts en `intermediaire` : cohérent. Lateral_Bound beginner : écart tracé. Grossesse : marche-laterale-elastique-cuisses (reste proposé). Remarque : T1 ne s'applique pas ici (échelon débutant sans impact). Danse « 2025 ». FIFA 11+ : ligne hedged (OK).

### saut-longueur-pieds-joints : bloquant
- l.6 : `niveau_min: debutant` avec échelon 1 = un vrai saut en longueur (source : « jump as far as you can ») : T1. Même correction que rebonds-chevilles. Auteur : kine.
- Remarque : surface « herbe ou sable » conseillée (source : sable) ; la fiche demande « jamais un sol mouillé » : cohérent.

### saut-vertical : bloquant
- l.6 : `niveau_min: debutant`, échelon 1 = saut vertical maximal (« pousse fort ») : T1. Auteur : kine.
- l.24 : consigne 4 renvoie à `reception-saut-stabilisee` (un id) dans le texte affiché : à remplacer par une phrase (« comme dans l'exercice de réception »). Auteur : coach.
- Sources : Rocket_Jump (beginner) et Freehand_Jump_Squat (intermediate) conformes.

### squat-sumo : à corriger
- l.92 : voir T2.
- l.40 : plus-dur = squat-bulgare-chaise, saut de difficulté et de type (unilatéral, chute) depuis un squat débutant ; remarque.
- Source Plie_Dumbbell_Squat : conforme (haltère tenu à la base, cuisses parallèles). La variante kettlebell n'a pas de source propre : couverte par « choix de coach » (OK).
- Grossesse : poids du corps seulement ; la note « pieds pas trop écartés » n'est pas codée : remarque.

### ytw-sol : à corriger
- l.4 : T3 : tirage_h pour un travail d'omoplates à vide : `couverture: substitut`. Auteur : coach.
- Cases : épaule n2, dos n2 retirer ; grossesse retirée (couché sur le ventre) avec remplaçant oiseau-sans-charge-assis. Remarque : plus-dur = oiseau-halteres-assis, moins restrictif au dos que Y-T-W (adapter contre retirer). Pas bloquant. Mouvement NON SOURCÉ : honnête.
