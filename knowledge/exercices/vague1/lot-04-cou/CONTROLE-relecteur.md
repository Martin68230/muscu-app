# Contrôle `relecteur` du lot 04 (cou et arrière d'épaule) et de regles-securite-communes.md §9-10

Contrôle à neuf, indépendant, le 22/10/2026. 12 fiches + README du lot + §9-10 de `knowledge/regles-securite-communes.md`. Rien n'a été corrigé. `npm run check:fiches` : 114 fiches, 0 erreur, 0 avertissement (vérifié).

## Sources ouvertes (ce qui a été réellement lu)
- **HAS 2020, cervicalgie non traumatique** (PDF ouvert et extrait en texte, pages 1-3) : confirmé : drapeaux rouges (tableau 1) = douleur d'aggravation progressive, permanente et insomniante ; déficit moteur radiculaire ; atteinte médullaire ; antécédent de cancer ; altération de l'état général ; perte de poids ; fièvre ; etc. ; encadré dissection = effort violent du cou dans les 15 jours, cervicalgie inhabituelle et persistante **en association** avec algies faciales et/ou céphalées inhabituelles, signes locaux, ischémie cérébrale ou rétinienne ; « s'améliore en général en 4 à 6 semaines » ; les drapeaux reposent sur l'avis d'experts et « se basent sur ceux de la lombalgie » ; fiche destinée aux prescripteurs d'imagerie. **Le mot « vertige » et les « fourmillements » seuls n'y figurent pas.** Les fiches et §9 le disent honnêtement (PROVISOIRE ou NON SOURCÉ), avec les réserves ci-dessous.
- **Cochrane Gross 2015** : confirmé par résumé web (27 essais, 2 485 participants ; renforcement cervico-scapulo-thoracique et du membre supérieur : preuve modérée, douleur chronique ; **étirement seul : pas de bénéfice attendu** ; endurance : petit effet). Texte intégral non lu.
- **Blanpied JOSPT 2017** : **non vérifié** (PDF orthopt.org : 403 ; recherche web sans les grades). La phrase « mobilité du cou grade B » reste invérifiée par moi aussi ; le statut PROVISOIRE est honnête.
- **Blomgren 2018** : titre et nature confirmés (revue de 12 essais, fléchisseurs profonds, **chronic neck pain, fonctions neuromusculaires**). Les auteurs précisent que les revues antérieures portaient sur la douleur et que la leur ne l'évalue pas : voir écart n° 6.
- **Reinold 2004** : non rouvert (résumé de mémoire cohérent avec la phrase de la fiche ; sert seulement de contexte).
- **Photos** (9 WebP regardées) et **8 illustrations SVG** (rendues en PNG et regardées) : voir par fiche.

## Bloquants
**B1. Exclusion « hors zone cou » non codée (§9 C1, C2, C3 ; README questions 2 et 3).** Aucun champ `doux_pour`, aucun schéma `cou`, et « zone absente = garder » : pour une personne sans gêne au cou (niveau 0), le générateur peut proposer `rotation-douce-cou`, `inclinaison-douce-cou`, `retraction-cervicale` et surtout `isometrique-cou` (non douce, sollicite le cou sous effort) comme **mobilité générique ou échauffement**, ce que C2 interdit. La case « choc / coup du lapin » (C3, profil) n'existe pas non plus : le seul garde-fou est un texte dans la fiche. Fiches concernées : les 5 fiches de cou. Levée : `dev` code l'exclusion (champ ou schéma, ou liste d'exclusion du générateur) et la case C3, ou ces 5 fiches sont écartées du générateur. Ce n'est pas un défaut du texte des fiches.

Aucun autre bloquant de contenu trouvé : pas de dose dangereuse chiffrée, pas de contre-indication oubliée majeure, le palier « urgence » est dans le bon sens (appeler en cas de doute).

## À corriger (communs aux fiches avec bloc cou : toutes sauf `rotation-externe-poulie`)
1. **Omission par rapport à §9 C4** : « maladresse nouvelle des mains, troubles de l'équilibre ou de la marche » (signes médullaires, HAS « atteinte médullaire ») figure dans C4 mais dans **aucune** des fiches (grep : 0). À ajouter au palier « arrête et consulte ».
2. **Statut « OK » trop fort pour les maux de tête** : les fiches écrivent « HAS 2020 : OK pour maux de tête et douleur de cou inhabituels ». La HAS ne cite les céphalées inhabituelles qu'**en association** avec une cervicalgie inhabituelle et persistante (encadré dissection). Les céphalées isolées : PROVISOIRE (prudence). Même nuance dans §9 C4 (« maux de tête et douleur de cou inhabituels... OK »). La mention « signes d'ischémie (vision, parole) » précise plus que la HAS (« cérébrale ou rétinienne, cécité monoculaire »).
3. **Statut du vertige incohérent entre fichiers** : fiches = « NON SOURCÉ, prudence » ; §9 C4 = « PROVISOIRE (résumés IFOMPT) ». À harmoniser.
4. **Source U1 (AVC)** : « pages grand public lues via moteur de recherche, aucune page officielle ouverte ». Honnêtement PROVISOIRE, mais à remplacer par une source officielle (HAS/ameli) avant `verifie`. « Mal de tête brutal très intense » et « vision double » ne sont pas dans le mémo cité.
5. **Cochrane / Blanpied cités pour des fiches de mobilité** (rotation, inclinaison, rétraction) : les résultats sourcés portent sur le **renforcement** ; l'étirement seul n'a pas montré de bénéfice. À écrire clairement : « contexte, pas une preuve pour cet exercice ».

## Par fiche
**rotation-douce-cou** (douce). Cohérent (variantes, consignes, tableau garder / amplitude réduite / retirer, grossesse garder). Illustration : tête de face puis nez tourné, sans danger. Mineur : flèche au-dessus de la tête peu lisible. + communs 1-5 + B1. Statut proposé : `controle_relecteur`.

**inclinaison-douce-cou** (douce). Source free-exercise-db honnêtement marquée (aide de la main supprimée = NON SOURCÉ) ; photo `Side_Neck_Stretch` bien écartée (la main tire la tête). Mineur : l'illustration montre la tête décalée de 10 px mais pas inclinée (le geste n'est pas lisible). + communs + B1. Statut : `controle_relecteur`.

**retraction-cervicale** (douce). À corriger : (a) Blomgren cité pour « l'effet sur la douleur est moins clair » : la revue n'évalue pas la douleur (fonctions neuromusculaires seulement) ; reformuler ; (b) la variante couchée est en échelon 2 sans justification (plus dur ? rien ne le dit) ; elle est bien exclue en grossesse (G4). Illustration de profil : tête avancée puis reculée, correcte et sûre. + communs + B1. Statut : `controle_relecteur`.

**isometrique-cou** (non douce, bien classée). Choix prudents cohérents avec C5 (n1 maintien court, n2 et n3 retirée, pas de chiffre, version plus douce = rétraction). À corriger : (a) la variante « mur + serviette » n'a aucune consigne (les consignes ne parlent que des mains) ; (b) photo `Sides-1` : la main est posée au-dessus de l'oreille, coude haut ; l'image ressemble à l'étirement latéral rejeté (risque de « tirer la tête ») ; revoir ou écarter ; (c) `tools/photos.md` ligne 65 donne l'URL `Sides/0.jpg` pour le fichier `Sides-1.webp`, alors que la fiche dit avoir retenu l'image 1 et écarté la 0 : provenance à vérifier ; (d) muscles `trapezes` principal pour un exercice qui travaille surtout les fléchisseurs et extenseurs du cou (README question 1 ouverte). Photos Front/Back : mains sur le front, mains derrière la tête : correspondent. Remarque : petits logos de vêtements visibles sur les photos (règle 12, tolérable). + communs + B1. Statut : `controle_relecteur`.

**retraction-omoplates** (douce, schéma tirage H en substitut). Cohérent. Mineur : §9 C2 dit « peut rester proposée normalement » alors que la fiche (et C1) la retire au cou niveau 3 : choix prudent, à écrire sans ambiguïté. Illustration de profil : le rapprochement des omoplates est à peine visible (flèche horizontale sur le torse, tronc légèrement incliné). + communs. Statut : `controle_relecteur` jusqu'aux corrections communes, puis `utilisable`.

**face-pull-elastique**. Sourcé honnêtement (poulie = free-exercise-db PROVISOIRE ; élastique = NON SOURCÉ ; ancrage de porte PROVISOIRE). Photo `Face_Pull` bien écartée (logo tiers). Régression `ecartement-elastique` existe, compatible avec toutes les zones. Illustration conforme (bras tendus puis mains au visage) ; les coudes écartés ne se voient pas de profil (mineur). + communs. Statut : `controle_relecteur` jusqu'aux corrections communes, puis `utilisable`.

**oiseau-banc-incline**. À corriger : (a) photo `Reverse_Flyes-1` : la tête est relevée, regard horizontal, nuque en extension, alors que la consigne et la note cou-n1 demandent « regard vers le sol, cou dans le prolongement » ; la consigne prime (règle 12) : retirer la photo 1 ou ajuster la consigne ; (b) la ligne « vertige en te relevant : reste assis un instant » contredit la règle commune « vertige même léger : ne reprends pas avant avis » (voir point transversal ci-dessous). Grossesse : remplaçant `oiseau-halteres` classé `adapter` pour la grossesse (variante sans charge assise) : conforme à §0. Doublon avec la variante banc incliné de `oiseau-halteres` (README question 4 ouverte, mineur). + communs. Statut : `controle_relecteur`.

**oiseau-machine-poulie**. À corriger : (a) « Dos plaqué contre le dossier (machine) » est faux pour un oiseau inversé : la photo (vue de dos) et l'installation « face au dossier » montrent la poitrine contre le coussin ; (b) échelon 2 pour la variante poulies croisées sans justification (« plus dur » non dit) ; (c) « version plus douce : oiseau-machine » alors qu'en grossesse la machine est remplacée : cohérent avec §0 mais à noter. Photos : pose correcte, logo recadré ; ne montre pas la tête. Variante poulies : photos non vues, honnêtement dit. + communs. Statut : `controle_relecteur`.

**rotation-externe-poulie**. Cohérente ; pas de bloc cou, correct (le cou n'est pas sollicité). Photos : départ et arrivée conformes (coude au flanc, main éloignée de la poulie) ; pas de serviette roulée visible (consigne 2) ; logo de vêtement et personnes visibles en arrière-plan (mineur). Mineur : la ligne « Échelons... les muscles du cou... trapezes et erecteurs » dans Sources est recopiée sans objet ; Reinold cité ne porte pas sur la rotation externe debout. Aucun « à corriger » propre à la fiche. Statut proposé : `utilisable` (réserves = choix prudents NON SOURCÉ).

**oiseau-un-bras-appuye**. À corriger : même contradiction « vertige en te relevant : reste debout un instant ». Grossesse : variante sans charge, « buste peu penché » non codé dans la variante (mineur). Illustration de dessus : bras pendant peu lisible, mais sans danger. + communs. Statut : `controle_relecteur`.

**ecartement-serviette**. Cohérent (isométrique, maintien court en grossesse, risque de serviette qui se déchire signalé). Illustration de dessus : bras levés au-dessus de la tête plutôt que « devant la poitrine » (ambigu, mineur). + communs. Statut : `controle_relecteur` jusqu'aux corrections communes, puis `utilisable`.

**tirage-visage-sangles**. À corriger : l'ancrage « arbre » (section Objets) n'est pas dans §10 (poutre, barre fixée à une structure) ; harmoniser. Retrait en grossesse avec remplaçant `face-pull-elastique` (lui-même `adapter`) conforme à §0 et C7. Illustration : le corps est quasi vertical dans la 2e image alors que la consigne dit « incliné en arrière » (mineur). Aucune notice de sangles lue : NON SOURCÉ honnête. + communs. Statut : `controle_relecteur`.

## Point transversal (à corriger)
**Vertige** : trois règles se contredisent : R5 (vertige : arrête la séance), le palier §9 C4 (vertige même léger pendant ou après l'exercice : ne pas reprendre avant avis) et les fiches `oiseau-banc-incline` / `oiseau-un-bras-appuye` (vertige en se relevant : reste assis, c'est-à-dire sans consulter). À arbitrer par `kine` (étourdissement positionnel bénin vs signe d'alerte), puis aligner partout. Le seuil actuel (« même léger » = consulte) déclenchera des consultations pour des étourdissements banals : choix prudent mais à assumer explicitement.

## §9-10 de regles-securite-communes.md
- Fidélité HAS 2020 : OK pour le fond (15 jours, drapeaux, 4 à 6 semaines, avis d'experts). Écarts : voir communs 2 et 3 ; C3 écrit que la HAS cite l'effort violent « avec douleur ou céphalées inhabituelles » alors que ce sont des éléments distincts ; l'extension à « tout choc, sans limite » est correctement marquée PROVISOIRE.
- Absents de l'app sans le dire : antécédents de cancer (S2 l'a), maladies du tissu conjonctif (Ehlers-Danlos, Marfan : prédisposition à la dissection selon la HAS) : l'app ne demande rien (décision D) ; à garder dans « remarques », pas à coder.
- G4 (§3) n'a pas été mis à jour avec `tirage-visage-sangles` (l'ajout n'est que dans §10) : mineur.
- C1/C2 : voir B1. README du lot : la phrase « Pas de source lue sur les signes d'alerte du cou » est périmée (HAS 2020 lue depuis) ; à mettre à jour.
- Cadre IFOMPT (Rushton, JOSPT 2023;53(1):7-22) : concerne le dépistage avant thérapie manuelle ; extrapolé à l'exercice : PROVISOIRE, honnête.

## Statuts finaux proposés (règle de CAMPAGNE.md et D1)
Aucune fiche `verifie` (des lignes NON SOURCÉ ou PROVISOIRE subsistent partout).

| Fiche | Statut proposé maintenant | Après corrections communes (1-5, vertige) |
|---|---|---|
| rotation-externe-poulie | `utilisable` | - |
| face-pull-elastique, retraction-omoplates, ecartement-serviette | `controle_relecteur` | `utilisable` |
| oiseau-banc-incline, oiseau-machine-poulie, oiseau-un-bras-appuye, tirage-visage-sangles | `controle_relecteur` | `utilisable` après leurs corrections propres |
| rotation-douce-cou, inclinaison-douce-cou, retraction-cervicale, isometrique-cou | `controle_relecteur` (B1) | `utilisable` seulement quand B1 est levé (exclusion hors zone codée) |

Rien n'est validé tant qu'il reste le bloquant B1 pour les 4 fiches de cou et `isometrique-cou`.
