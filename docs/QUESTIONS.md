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

## Q12. Poids de la barre dans le profil (24/10/2026, kine, lot-07-barre)
- **Contexte** : une barre olympique pèse 20 kg (parfois 10 à 15 kg pour les barres « femme » ou d'entraînement ; la barre EZ seule est plus légère). Le générateur dit « barre seule » sans connaître son poids ; pour une personne peu entraînée, c'est déjà une charge qui peut dépasser l'étalonnage prévu (load-calibration.md).
- **Choix prudent appliqué** : aucune hypothèse sur le poids de la barre. Les 20 fiches du lot avertissent que la barre seule pèse souvent 20 kg et renvoient à la version aux haltères quand c'est trop lourd. Les niveaux « débutant » à la barre sont réduits au minimum (hip thrust, rowing appuyé, curl, shrug au rack).
- **Option alternative** : ajouter au profil un champ facultatif « poids de ma barre » (et de la barre EZ), utilisé par le générateur : si la charge d'étalonnage est inférieure à la barre seule, ne pas proposer l'exercice à la barre (demande à `dev`).

## Q13. Tag « rack » et barres de sécurité (24/10/2026, kine, lot-07-barre)
- **Contexte** : presque toutes les variantes à la barre exigent le tag `rack` (décrit dans materiel-tags.json comme « rack ou cage à squat avec sécurités »). Une personne qui a banc + barre sans rack n'aura pas de développé couché ni de squat à la barre.
- **Choix prudent appliqué** : tag conservé tel quel, défini comme rack **avec barres de sécurité** ; chaque fiche le rappelle (« sans barres de sécurité, ne coche pas rack »). Pas de développé couché ni de squat chargé sans rack ; les versions aux haltères les remplacent.
- **Option alternative** : séparer deux tags, `rack` (supports seuls) et `barres_securite`, pour distinguer un simple support d'une vraie cage. Le plus prudent reste de ne rien proposer sans barres de sécurité (demande à `dev` et à l'auteur de equipment-taxonomy.md).

## Q14. Soulevé de terre et roumain à la barre pour un débutant (24/10/2026, kine, lot-07-barre)
- **Contexte** : `coach` proposait le soulevé de terre et le roumain depuis le rack (course courte, barre légère) dès le niveau débutant.
- **Choix prudent appliqué** : réservés à l'**intermédiaire**, même depuis le rack (charge élevée sur la colonne, aucune barre de sécurité possible, personne pour corriger le geste). Le débutant fait le roumain aux haltères. Niveau changé dans les fiches `souleve-de-terre-barre` et `souleve-de-terre-roumain-barre` (NON SOURCÉ).
- **Option alternative** : accepter le départ depuis le rack pour le débutant, avec le poids de la barre connu (Q12) et un geste appris avec les haltères d'abord.

## Q15. Tirage menton à la barre (24/10/2026, kine, lot-07-barre)
- **Contexte** : la montée limitée au milieu de la poitrine réduit le risque, mais l'épaule reste en rotation interne, bras haut, charge à la barre ; l'app ne contrôle pas la hauteur réelle.
- **Choix prudent appliqué** : fiche **écartée** (knowledge/exercices/vague1/lot-07-barre/ecartees/tirage-menton-barre.md). L'élévation latérale aux haltères et le haussement d'épaules couvrent les mêmes muscles. NON SOURCÉ (les études sur l'épaule lues par résumé ne tranchent pas).
- **Option alternative** : garder la fiche avec la barre EZ limitée au milieu de la poitrine, retirée dès une gêne légère à l'épaule (réserves).

## Q16. Fentes marchées avec barre et mollets sur plateforme (24/10/2026, kine, lot-07-barre)
- **Contexte** : avec une barre sur le dos, la marche ou la plateforme n'ont aucun filet (pas de barres de sécurité utilisables), chute possible, personne pour réagir.
- **Choix prudent appliqué** : fentes marchées à la barre **écartées** (ecartees/) ; fente arrière à la barre supprimée de la fiche `fente-barre` (reste le squat fendu, pieds immobiles au centre du rack) ; variante « plateforme » supprimée de `releve-mollets-debout-barre` (pieds à plat). La fente arrière sans barre et les mollets sans barre restent disponibles.
- **Option alternative** : accepter ces variantes uniquement à la salle, avec une charge légère et un rack à proximité (non rédigé).

## Q17. Grossesse et barres lourdes (24/10/2026, kine, lot-07-barre)
- **Contexte** : `coach` retirait toutes les barres lourdes par prudence ; la HAS ne se prononce pas sur la barre (elle recommande le renforcement modéré, d'éviter l'apnée, le couché sur le dos et les risques de chute).
- **Choix prudent appliqué** : confirmé : squats, soulevés de terre, good morning, hip thrust, développés, rowings, fente, relevé de mollets à la barre : retirés (remplaçants aux haltères). **Ajustement** : le curl à la barre EZ est gardé en grossesse (debout, charge légère) ; le curl à la barre droite et le shrug sont retirés, car la barre droite pèse souvent 20 kg. NON SOURCÉ.
- **Option alternative** : tout retirer, curl EZ compris (le plus prudent), ou autoriser des barres légères avec charge:legere (moins prudent).

## Q18. Niveaux minimum des autres barres et gardes-fous avancés (24/10/2026, kine, lot-07-barre)
- **Contexte** : le lot contenait trois fiches « débutant » à risque : squat avec repère de profondeur, développé couché au sol dans le rack, relevé de mollets debout avec barre sur le dos ; et deux fiches « avancé » qui chargent fortement le bas du dos : good morning et rowing Pendlay.
- **Choix prudent appliqué** : les trois fiches « débutant » passent à **intermédiaire** (le débutant utilise squat gobelet, développé couché aux haltères, mollets sans barre ou aux haltères) ; good morning et Pendlay sont **gardés au niveau avancé** (retirés dès une gêne légère au bas du dos) avec réserves ; ni l'un ni l'autre n'est indispensable.
- **Option alternative** : écarter le good morning et le Pendlay (le plus prudent : le roumain et les autres rowings couvrent les schémas), ou garder les trois au niveau débutant avec guidage et poids de barre connu (moins prudent).

## Q19. Vidéos à filmer par l'utilisateur, lot-07-barre (24/10/2026, coach, D12)
- **Contexte** : pour 5 fiches, aucune vidéo YouTube trouvée qui respecte à la fois notre consigne (barres de sécurité pour l'utilisateur seul) et le critère de chaîne sérieuse. Les vidéos trouvées règlent les barres de sécurité autrement (développé couché : « sous les côtes » ou « au niveau de la poitrine », barre qui touche la poitrine) ou n'en montrent pas ; une vidéo sans son n'a pas pu être vérifiée.
- **À filmer** (MP4 sans son, 3 à 5 s, moins de 500 Ko, à déposer dans images-a-trouver/<id>/) :
  - `developpe-couche-barre` : barres de sécurité jaunes réglées à quelques centimètres au-dessus de la poitrine, barre qui descend jusqu'à la hauteur des sécurités sans toucher la poitrine, poussée, repose sur les supports.
  - `squat-barre-repere-banc` : barres de sécurité juste sous la barre quand les fesses touchent le banc ; toucher le banc sans s'asseoir, repartir tout de suite.
  - `releve-mollets-debout-barre` : barre sur le haut du dos dans le rack, pieds à plat (pas de plateforme), barres de sécurité réglées en quart de squat ; montée sur les pointes, arrêt, descente lente.
  - `developpe-militaire-barre` : barres de sécurité à hauteur des épaules, barre sur la poitrine, menton reculé sans cambrer, poussée au-dessus des oreilles.
  - `rowing-barre-ez` : buste à plat ventre sur un banc incliné, barre EZ posée au sol, tirage vers le bas de la poitrine puis retour bras presque tendus (une vidéo de coach privé correspondait mais sa qualification n'est pas vérifiable).
- Vidéos retenues (7) : voir README du lot-07 « Corrections coach 2 ». Non vues à l'écran : voir ce README.

## Q20. Lancer de ballon au sol (slam) et lancers par-dessus la tête, lot-08-ballons-roue (24/10/2026, coach puis kine)
- **Contexte** : le ballon rebondissant revient vers le visage, le bras au-dessus de la tête cambre le bas du dos, gain faible par rapport au lancer contre un mur.
- **Choix prudent appliqué** : aucune fiche de slam ni de lancer par-dessus la tête. Seuls les lancers de poitrine, de rotation et de bas en haut contre un mur, pieds au sol, sans rattrapage risqué. NON SOURCÉ.
- **Option alternative** : autoriser le slam avec une case de profil « ballon sans rebond » (non rédigé).

## Q21. Roue abdominale : dos niveau 1 (24/10/2026, coach puis kine, lot-08-ballons-roue)
- **Contexte** : dès une gêne légère au bas du dos, ramener la roue à la variante au mur ou la retirer.
- **Choix prudent appliqué** : `roue-abdos` est **retirée dès le niveau 1 du dos** (mur compris) ; intermédiaire minimum, debout réservé à l'avancé, sortie de secours écrite (ventre puis poitrine sur le tapis ; genoux d'abord en version debout). Le roulé du ballon (`rollout-ballon`, avant-bras sur le ballon, levier plus court) garde « roulé court » au niveau 1 du dos et est retiré au niveau 2. NON SOURCÉ.
- **Option alternative** : variante au mur au niveau 1 du dos (moins prudent).

## Q22. Développé aux haltères sur ballon de gym (24/10/2026, coach puis kine, lot-08-ballons-roue)
- **Contexte** : deux haltères au-dessus du visage, appui instable (règle R9), seul, sans pareur ; le CSEP déconseille l'instabilité pour la force.
- **Choix prudent appliqué** : fiche **écartée** (lot-08-ballons-roue/ecartees/developpe-couche-halteres-ballon.md). Le développé au sol aux haltères reste disponible. NON SOURCÉ.
- **Option alternative** : garder la fiche à charge légère, pieds écartés, haltères fixes, niveau intermédiaire (garde-fous R9).

## Q23. Dosage des lancers au ballon lesté (24/10/2026, coach puis kine, lot-08-ballons-roue)
- **Contexte** : aucune ligne du générateur ne couvre les lancers (V-DOSE ne connaît pas `medecine_ball`).
- **Choix prudent appliqué** : repère de coach conservé comme **plafond** : 2 séries de 6 à 8 lancers, repos 60 à 90 s, arrêt dès que la vitesse baisse, ballon léger, mur à 2 m au moins, pas de rattrapage risqué. NON SOURCÉ. `dev` ne doit pas appliquer les 10 à 15 répétitions de V-DOSE à ces fiches.
- **Option alternative** : une règle « lancer » dédiée dans le générateur.
- **Code** : codé avec le choix prudent le 24/10/2026 (`FIXED_DOSE` dans src/generator/config.ts, N4 du recontrôle lot-08) : lancers 2 x 6-8 (par côté pour la rotation), repos 90 s ; gainage dynamique (roue, roulé, genoux-poitrine) 2 x 6-8, repos 60 s ; planche-cercles 2 x 5-8 par sens, repos 60 s ; sans réserve demandée ni charge. Réponse de l'utilisateur toujours en attente.

## Q24. Doublons ballon lesté / ballon de gym avec les fiches existantes (24/10/2026, coach puis kine)
- **Choix prudent appliqué** : une fiche par matériel, aucune fusion (on ne touche pas aux fiches déjà vérifiées). Fusion possible plus tard (décision de `dev` et de l'utilisateur).

## Q25. Pompe mains sur ballon libre et niveaux relevés (24/10/2026, kine, lot-08-ballons-roue)
- **Contexte** : mains sur une surface qui roule : chute vers le visage, le poignet ou l'épaule, sans gain mesuré pour le pectoral (Lehman 2006, résumé lu).
- **Choix prudent appliqué** : variante « ballon libre » de `pompe-mains-ballon` retirée (reste : ballon calé contre un mur). `pont-fessier-ballon` et `extension-dorsale-ballon` passent de débutant à **intermédiaire** (chute, aucun gain net). `bucheron-ballon-lest` bas-haut passe à intermédiaire ; bûcheron au ballon retiré dès le niveau 2 du dos (comme `rotation-bucheron`). NON SOURCÉ.
- **Option alternative** : garder ces deux fiches au niveau débutant avec mur et tapis (moins prudent).
