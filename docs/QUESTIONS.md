# Questions en attente pour l'utilisateur

Une entrée par question : contexte, choix prudent appliqué, option alternative. Tant qu'une question est ouverte, le choix prudent s'applique.

## Q1. Soulevé de terre roumain avec un genou gêné (niveau 2) : pas de progression

- **Contexte** : la fiche `souleve-de-terre-roumain-halteres` a une ligne Genou `garder | garder | retirer`. L'exercice reste donc proposé au niveau 2, mais la règle R2 (knowledge/regles-securite-communes.md, NON SOURCÉ) bloque toute augmentation (charge, répétitions, séries) sur « toute fiche qui a une ligne pour la zone, `garder` compris », et le générateur met la fiche en `capped` (charge la plus légère, pas de superset, pas de série ajoutée). Résultat : la personne ne progresse pas sur cet exercice tant que son genou reste au niveau 2.
- **Choix prudent appliqué** : plafond R2 conservé (voulu par R2, pas un oubli). La ligne Genou `garder` au niveau 2 est elle aussi un choix de `kine` (charnière de hanche, genoux fixes, source de contexte : OARSI 2019, qui dit que l'exercice structuré reste utile avec une gêne).
- **Option alternative** : limiter R2 aux cases `adapter` / `retirer` (une case `garder` ne plafonne pas), ou ajouter une case `adapter: charge:legere` au niveau 2. Moins prudent : la personne progresse avec un genou gêné nettement.

## Q2. Machines assises en grossesse

- **Contexte** (`kine`, 23/10/2026) : question posée : presse à cuisses, tirage assis, rowing assis et développé épaules assis dossier droit sont-ils compatibles avec la grossesse, charge légère et sans blocage de la respiration (Valsalva) ? Réponse : **oui, avec conditions, mais c'est une extrapolation**. Les sources disent : renforcement musculaire d'intensité modérée recommandé ; Valsalva et isométrique prolongé à éviter ; pas allongé sur le dos dès la 24e semaine ; éviter les risques de chute ; pas de musculation lourde au 1er trimestre chez la sportive désireuse de grossesse. **Aucune source ne parle des machines** : on déduit que, charge légère, respiration continue, dossier presque droit, elles ne contredisent pas ces principes ; ce n'est pas un résultat démontré. Statut : **PROVISOIRE**. Sources lues le 23/10/2026 : HAS 2019 (recommandation officielle, femmes enceintes) https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf ; Mottola 2019, résumé CSEP (lignes directrices de consensus, grossesse sans contre-indication) https://csepguidelines.ca/?p=1037. Non lus : texte BJSM de Mottola (403), ACOG 804 (accès refusé), revues Cochrane. Détail et conditions : knowledge/regles-securite-communes.md, règle G9 (rédigée, **non active**).
- **Comportement actuel du générateur** (lu dans knowledge/generateur-v1.md §6.0 P-GROS, §6.6, et G4-G7) : il n'existe pas de règle « machine assise » : chaque fiche suit sa ligne `Grossesse` (grossesse cochée seulement). Tous les exercices passent par P-GROS : dose `sante`, 1 série (débutante) ou 2, 8-15 répétitions, réserve >= 3, pas de superset, séance <= 60 min, charge bloquée au plus léger, échelon le plus bas pour une variante sans historique, aucune hausse automatique. G4 ne cite que le développé épaules haltères (assis, dossier droit) et les rowings comme « adapter » ; il ne cite ni presse à cuisses, ni tirage assis, ni rowing machine. Une fiche machine est donc autorisée ou non selon sa propre ligne (ex. abduction machine : `adapter: charge:legere`) ; sans ligne Grossesse, la fiche n'est pas utilisable (aucune fiche « vérifié » sans ligne). Respiration : la consigne « respiration continue » vient de la ligne `adapter` des fiches, pas d'un contrôle de l'app.
- **Choix prudent appliqué** : G9 n'est pas activée. Aucune machine n'est ajoutée ni autorisée en bloc ; le comportement ci-dessus reste (charge au plus léger, variantes adaptées, aucune hausse). Si la personne est en grossesse et que la machine n'a pas de ligne Grossesse relue, elle n'est pas proposée.
- **Option alternative** : activer G9 (dev code garder / adapter / retirer fiche par fiche : développé épaules assis dossier droit, tirage assis, rowing assis en `adapter` ; presse inclinée et machines à plat en `retirer`), avec contrôle de `relecteur`. Moins prudent : s'appuie sur une extrapolation. À valider aussi par un avis médical individuel, que l'app ne remplace pas.
- **Phrase de rappel proposée (carte grossesse ET écran du programme)** : « Demande l'avis de ton médecin ou de ta sage-femme avant de t'entraîner. Cette appli n'est pas un avis médical : si l'un d'eux t'a déconseillé le sport, ne suis pas ces exercices. » Vérifié dans src/data/profile-setup.ts (lecture seule, l. 77) : la carte contient déjà « Demande l'avis de ton médecin ou de ta sage-femme (ou du professionnel qui te suit) avant de t'entraîner. S'il t'a déconseillé le sport, ne suis pas ces exercices. » ; rien n'indique qu'elle figure sur l'écran du programme (à ajouter par `dev`, une ligne au-dessus de la liste des exercices, tant que le réglage est coché). Base : HAS 2019 et fiche HAS 2022 (avis du professionnel conseillé), OK ; la formulation exacte est de `kine`.

## Q3. Poussée verticale pour un débutant à la maison (nouveau, 23/10/2026) : VALIDÉE par l'utilisateur le 23/10/2026 (choix prudent gardé ; un test vérifie l'avertissement de séries insuffisantes pour les épaules)

- **Contexte** : la pompe piquée passe à `intermediaire` (pas pour un débutant à la maison). Sans matériel, un débutant n'a donc plus de fiche de poussée verticale ; knowledge/generateur-v1.md §7.1 (ligne « poussée V », l. 376) la donne encore comme `pompe-piquee (débutant)` et couverte.
- **Choix prudent appliqué** : aucune poussée verticale sans matériel pour un débutant ; la règle de repli du générateur (autre schéma ou haltères assis) s'applique.
- **Option alternative** : écrire une fiche plus douce (ex. élévation latérale / développé avec bouteilles d'eau ou sac à dos, déjà : `developpe-epaules-sac-a-dos`) et corriger le §7.1.

## Q4. Texte de sécurité écrit par dev pour le post-partum (23/10/2026) : à valider par kine
- **Contexte** : la fiche d'exercice affiche, pour le réglage « post-partum », la note de la fiche et une phrase générale écrite par `dev` : « Reprends progressivement et demande l'avis de ton médecin ou de ta sage-femme. » (src/ui/screens/Fiche.tsx).
- **Choix prudent appliqué** : la phrase reste affichée (elle va dans le sens de G1-G3 et G7 de regles-securite-communes.md).
- **À faire** : `kine` relit ou réécrit la phrase ; statut à fixer (aujourd'hui NON SOURCÉ).

## Pour coach — matériel sans fiche utilisable (24/10/2026, lot A.3)
Contrôle des tags de « Mon matériel » dans public/data/fiches.json (fiches vérifiées ou utilisables, 140 fiches) : **aucune variante** n'exige ces matériels, donc les cocher ne change rien au programme :
`roue_abdos`, `barre`, `disques`, `barre_ez`, `rack`, `swiss_ball`, `medecine_ball`, `corde_a_sauter`, `lest`, `sac_de_sable`, `bosu`, `machine_cardio`.
Très peu de fiches : `kettlebell` (3), `box_ou_step` (3), `sangles_suspension` (2), `rouleau_massage` (1), `barre_traction` (4).
À faire (coach, puis relecteur) : fiches pour au moins une variante par matériel ci-dessus. Roue abdominale : niveau minimum « avancé » ; exclure dos fragile, grossesse, post-partum, blessure lombaire/épaule (kine à relire). En attendant, l'écran Matériel pourrait préciser « pas encore d'exercice avec ce matériel » (décision à prendre).

## Q5. Sauts et corde à sauter dans le cardio dès « intermédiaire » (24/10/2026, kine, cardio-regles.md §5)
- **Contexte** : la décision D3 (22/10/2026) limitait les sauts aux programmes sport. `coach` propose de les ouvrir au cardio dès le niveau intermédiaire.
- **Choix prudent appliqué** : aucun saut dans le cardio tant que tu n'as pas décidé. Si tu acceptes : niveau 0 exigé sur genou, cheville, hanche et dos, pas en reprise après pause, pas en grossesse / post-partum, séries de 30 s puis 60 s au plus, 1 séance avec sauts par semaine (NON SOURCÉ).
- **Option alternative** : ouvrir les sauts avec ces conditions (moins prudent).

## Q6. Course à pied dans le cardio (24/10/2026, kine, cardio-regles.md §5)
- **Contexte** : `coach` propose la course pour intermédiaire et avancé (dehors ou sur tapis).
- **Choix prudent appliqué** : course non proposée. Si tu acceptes : mêmes conditions que Q5, intervalles marche / course au départ, règle +10 % de durée (PROVISOIRE, coureurs).
- **Option alternative** : proposer la course avec ces conditions.

## Q7. Plafond de séances de cardio dédiées (24/10/2026, kine, cardio-regles.md §3.2)
- **Contexte** : plafond proposé : 3 par semaine, 2 pour un débutant (NON SOURCÉ, aucune étude).
- **Choix prudent appliqué** : plafond conservé tel quel (3 ; débutant 2), jamais de séance double, jours en trop laissés libres. Le plus prudent serait 2 pour tout le monde (moins de cardio principal à 5-6 jours).
- **Option alternative** : plafond de 2 pour tous.

## Q8. Option « extérieur » dans le profil (24/10/2026, kine, cardio-regles.md §8)
- **Contexte** : le profil n'a que maison / salle ; vélo dehors, côte et course exigeraient une option « j'ai un trajet dehors ».
- **Choix prudent appliqué** : pas d'option, aucun cardio dehors codé ; seule la marche rapide (sans option) reste proposée. Texte chaleur T6 prêt si l'option est ajoutée (aucun seuil de température sourcé).
- **Option alternative** : ajouter l'option facultative, avec rappel chaleur et sécurité sur la route (non rédigé).

## Q10. Séparer les tags d'appareils de cardio (24/10/2026, kine, suite au contrôle relecteur)
- **Contexte** : le profil n'offre que « vélo ou rameur » et un seul tag `machine_cardio` (vélo, rameur, tapis de course, elliptique). Quelqu'un qui n'a qu'un vélo se voit proposer rameur, tapis de course ou elliptique ; or le rameur et le tapis de course sont à retirer en grossesse, post-partum et pour le dos.
- **Choix prudent appliqué** (cardio-regles.md §5) : aucun rameur ni tapis de course en grossesse, post-partum ou zone dos ; elliptique retiré en grossesse / post-partum ; ski-erg exclu par défaut ; vélo assis ou marche en remplacement. Conséquence : le cardio sur machine est proposé plus rarement qu'il ne pourrait l'être.
- **Option alternative** : séparer les tags (`velo`, `rameur`, `tapis_de_course`, `elliptique`) et le choix dans « Mon matériel » ; chaque fiche suit alors sa propre ligne. Demande à `dev` / `coach` (equipment-taxonomy.md à mettre à jour par son auteur).

## Q9. Textes de sécurité cardio proposés par kine (24/10/2026)
- **Contexte** : textes T0 à T7 dans knowledge/cardio-regles.md (9bis) : avertissement cardio, signes d'arrêt, urgence 15 / 112 seulement pour douleur de poitrine persistante, perte de connaissance, difficulté à respirer au repos ; conseil de consulter avant de reprendre après longue pause ou maladie du cœur, sans blocage ni questionnaire.
- **Choix prudent appliqué** : aucun affichage tant que `relecteur` n'a pas contrôlé ; statut PROVISOIRE (ACOG 804 non lu directement, Riebe 2015 résumé seulement).

## Q11. Cardio dans le générateur (B4, 24/10/2026) : choix faits par dev, à confirmer
- **Fiches manquantes (pour coach, puis relecteur ; dev ne touche pas aux fiches)** : 0 fiche vélo (assis), rameur, tapis de course, elliptique, corde à sauter, step / box, montée d'escaliers, marche en côte. Conséquences : la salle propose la marche rapide (message « pas encore d'exercice relu pour ces appareils ») ; le post-partum n'a que la marche rapide (vélo assis et escaliers avec rampe n'existent pas encore) ; `box_ou_step` et `marche_escalier` ne servent pas au cardio. Fiches à aligner (réserve n° 9 du recontrôle) : `mountain-climbers` (niveau débutant dans la fiche ; le générateur applique « intermédiaire minimum »), `marche-rapide-intervalles` (« dehors » dans la consigne : non proposé par le générateur, mais le texte de la fiche le dit encore).
- **Plafond de 25 % (§3.4 d)** : lu à la lettre (« 25 % de la durée de la séance de musculation en plus ») : le bloc fait au plus 25 % de la musculation ET tient dans la durée choisie. Résultat : avec 45 min, aucun bloc de 10 min ne tient en cardio secondaire (message « Pas assez de temps pour le cardio ») ; il apparaît à partir de 60 min. Option : 25 % de la durée choisie (bloc de 11 min à 45 min, musculation 34 min). À trancher par toi.
- **Progression (§3.5)** : le générateur calcule le plan des 4 semaines (+10 % arrondi vers le bas, 4e semaine -30 %), mais le lecteur de séance utilise encore la durée de la semaine 1 (aucune hausse sans retour « séance bien passée » : choix prudent). Brancher le plan sur l'historique = étape suivante (dev).
- **Avis médical après un signe cardiaque (T1, réserve n° 2)** : T1 est affiché tel quel ; l'app ne bloque pas le cardio après un symptôme (aucun mécanisme de « levée » inventé). À spécifier avec kine sans dépistage (ex. case « j'ai eu l'avis d'un médecin »).
- **T6 (chaleur)** non affiché : réserve n° 1 (T1 contre T6) non tranchée, et aucun cardio dehors.
- **Perte de gras, forme / santé** : aucun cardio ajouté automatiquement (seulement si « Cardio » est choisi en principal ou en secondaire) ; goal-resolver.md dit « vers le haut du repère OMS » pour la perte de gras : à décider.
- **Cardio principal à 5 jours, débutant** : 2 séances de musculation + 2 de cardio (plafond débutant), le 5e jour reste libre (§3.2) ; l'explication dit « 4 jours ».
