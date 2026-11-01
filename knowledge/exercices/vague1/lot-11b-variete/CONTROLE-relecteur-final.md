# Recontrôle final du relecteur : lots 11A (3 fiches) et 11B (5 fiches), statut complete_kine

Contrôle indépendant du 2026-11-01, lancé à neuf. Aucune fiche n'est corrigée ici, aucun autre fichier n'est modifié, rien n'est commité.

Commandes lancées (avec `timeout`) :
- `npm run check:fiches` : 207 fiche(s) contrôlée(s), 0 erreur, 0 avertissement.
- `npx vitest run tests/unit/illustrations.test.ts` : 1 fichier, 6 tests passés.
- Contrôle de l'AFFICHAGE : le texte public est produit par `tools/build-fiches.mjs` + `tools/public-text.mjs` (nettoyage), mais seules les fiches `utilisable` / `verifie` sont construites. J'ai donc reconstruit les 8 fiches avec `buildFiche` + `sanitizePublic` dans un script du dossier temporaire (rien écrit dans public/) et relu le texte réellement affiché.
- Illustrations : rendues en PNG (Playwright WebKit, depuis un script du dossier temporaire) et regardées une à une. Je peux donc les juger sur l'image, pas seulement sur le texte des poses.

## Verdict global

**Aucun point bloquant** (aucune dose, règle de sécurité, contre-indication ou règle 23 en défaut). Les 8 fiches sont **VALIDES SOUS RÉSERVE** : les écarts restants sont des défauts de TEXTE AFFICHÉ (notes mal nettoyées, texte illisible après nettoyage) et une reconfirmation kiné à tracer. Elles ne peuvent pas passer `utilisable` en l'état ; après correction de ces textes (vérifiable par un `grep` et par la reconstruction ci-dessus, sans nouveau contrôle complet), elles le peuvent.

| Fiche | Verdict | Peut passer utilisable ? |
|---|---|---|
| tirage-vertical-un-bras-elastique | VALIDE SOUS RÉSERVE (T1) | non en l'état ; oui après T1 |
| developpe-epaules-elastique-alterne | VALIDE SOUS RÉSERVE (A1, A2) | non en l'état ; oui après A1, A2 |
| developpe-sol-elastique | VALIDE SOUS RÉSERVE (S1, S2, S3) | non en l'état ; oui après S1 à S3 |
| curl-halteres | VALIDE SOUS RÉSERVE (C1, C2) | non en l'état ; oui après C1, C2 |
| curl-elastique | VALIDE SOUS RÉSERVE (C1, C2) | non en l'état ; oui après C1, C2 |
| elevation-laterale | VALIDE SOUS RÉSERVE (L1, L2) | non en l'état ; oui après L1, L2 |
| charniere-dos-au-mur | VALIDE SOUS RÉSERVE (M1, M2, M3) | non en l'état ; oui après M1, M2 ; M3 = lien à passer en même temps que bonjour |
| bonjour-poids-du-corps | VALIDE SOUS RÉSERVE (B1, B2) | non en l'état ; oui après B1 ; passer avec charniere-dos-au-mur |

## 1. Écarts des contrôles précédents

Résolus (vérifié dans les fichiers) :
- 11A : suppression des 6 doublons (pullover banc, pompe inclinée, pompe sur les genoux, tirage poitrine assis, développé neutre, pompe piquée allégée) : aucun id orphelin dans knowledge/, src/, tools/ (seul programmes-v3.md §9 cite l'ancien id de l'élévation, comme historique, ce qui est correct).
- Tirage un bras : V1 / N1 (hauteur de mains) résolu : installation, consigne 4 et note `epaule-n1` disent la même chose (main du haut au front, ou au menton avec arrivée à la poitrine) ; l'image le montre. V2 (boucle) et V3 (lien) résolus. N2 : la note `epaule-n2` dit que le remplaçant est une version adaptée.
- Développé alterné : D1 (intermédiaire), D2 (l'autre main reste à l'épaule), D3 (bras-bas, respiration), A3 (redondance) résolus. A1 (ids dans les notes) : plus d'id.
- Développé au sol : S1 (remplaçant `pompe-chaise`, fiche `pompe` utilisable), S2 (consigne 1 allégée), S4 (ids dans les notes) résolus.
- 11B : L1 (nom « Élévation latérale », id `elevation-laterale`), L2 (échelons assis = 1, debout = 2 : voir ci-dessous), L3 (notes grossesse / dos sans `isoEligible` ni « variante de cette fiche »), L5 (consigne 3), M1 / B4 (vertige : « appuie-toi au mur, assieds-toi si une chaise est proche » / « assieds-toi si possible »), M2 et B2 (lignes Sources des liens charnière <-> bonjour ; lien vers le roumain aux haltères retiré), M3 (repères « mi-cuisse » repris dans `dos-n1` / `dos-n2`), B1 (commentaires de rédaction retirés de `bonjour`), E1 (« jamais coincé sous un pied de la chaise »).
- L2 en détail : j'ai relu `src/generator/safety.ts` (l. 358 à 366) : si la cible imposée est exclue (pas d'haltères), le générateur choisit « la plus haute d'échelon <= la cible ». Avec assis = 1 et debout = 2, un profil élastique sans haltères reçoit bien `elevation-laterale-chaise-elastique` et plus la variante debout. Résolu, sous réserve L1 ci-dessous.

Non résolus ou nouveaux : voir les fiches ci-dessous.

## 2. Notes AFFICHÉES (grep sur la source + texte réellement affiché)

Le nettoyage automatique cache la plupart des mentions internes (coach, kine, R2, G4, §, fichiers, id), mais il produit du texte faux ou illisible quand la source n'est pas écrite pour l'utilisateur. Les points suivants sont le texte AFFICHÉ après nettoyage :

- **D1 (systémique, à corriger à la source dans les fiches concernées)** : le mot « mi-course » dans une note devient « mouvement à moitié seulement », d'où des phrases fausses : « coudes qui descendent à mouvement à moitié seulement seulement » (sol, epaule-n1), « coudes qui restent à mouvement à moitié seulement comme au niveau 1 » (sol, epaule-n2), « montée à mouvement à moitié seulement seulement » (curl-halteres et curl-elastique, epaule-n2), « amplitude à mouvement à moitié seulement » (charniere et bonjour, genou-n2), « mouvement à moitié seulement » (hanche-n1, cuisse-n1 charniere et bonjour, dos-n1 charniere). Le mot « avant-bras » devient « sur les avant-bras » : « dans le prolongement des sur les avant-bras » (alterne poignet-n1, sol poignet-n1). Réécrire ces notes sans les mots « mi-course » ni « avant-bras » (par exemple « à moitié de la descente », « dans le prolongement de l'avant-bras ») ou faire corriger le nettoyeur par `dev`. Le fichier public/data/fiches.json actuel contient déjà ce défaut sur d'autres fiches utilisables (hors périmètre ici).
- **D2** : reste de renvoi interne affiché : « ; n3 : retrait. » à la fin de `epaule-n1` (alterne) et de `epaule-n1` / `epaule-n2` (sol). Le nettoyage signale lui-même « mention interne restante ». Supprimer « n3 : retrait ».
- **D3** : « règle 23 » est affiché dans la note `general` de `charniere-dos-au-mur` et de `bonjour-poids-du-corps` (numéro de règle du projet). À reformuler (« poids du corps, sans charge, descente limitée... », sans numéro).
- **D4 (texte rédactionnel affiché)** : `dos-n2` (tirage, alterne, sol) : « pour qui était déjà assis / à deux bras, la case ajoute... », « une case d'amplitude n'apporterait rien / ferait double emploi avec l'épaule » ; `poignet-n1` (alterne) : « la fiche de référence propose les paumes face à face, ici le geste est déjà à une main... on allège la charge » ; `dos-n1` (alterne) : « échelon 1 contre 2 » ; `epaule-n2` (tirage) : « proposé seulement dans sa version adaptée par le profil actif ... si le profil l'adapte autrement ou le retire, la case reste un retrait sans remplaçant » (mécanisme du générateur) ; `general` (sol) : « débutant (coudes limités par le sol, ...) » (reste d'une phrase « confirmé par kine » amputée). Ce sont des justifications d'auteur, pas des consignes pour l'utilisateur ; les remplacer par une phrase d'effet (« reste assis, dos contre le dossier, élastique léger »).
- **D5 (remarque)** : les notes `general` qui citent `src/generator/isolation.ts` (curl-halteres, curl-elastique) et « l'emplacement d'isolation du générateur » (elevation-laterale) sont supprimées à l'affichage, mais restent dans la source avec un chemin de code et « vérifié par `kine` » : à alléger (la source doit rester vraie si le code change). Les notes `general` « zones non listées : garder (choix de `kine`, NON SOURCÉ) » s'affichent correctement après nettoyage.
- Consignes, points d'attention, erreurs, signes d'arrêt, objets du quotidien, installations, légendes : aucun id, nom de fichier, §, `isoEligible`, mention du générateur ou commentaire de rédaction après nettoyage (vérifié sur le texte reconstruit, avec une expression qui cherche aussi coach / kine / .md / .ts / § / backticks / codes R, G, S). Le texte « Rédigé par coach... à contrôler par relecteur » en tête de la section Sécurité n'est pas un champ affiché.

## 3. Cases `variante:<id>` (contrôle manuel : variante de la MÊME fiche)

Toutes visent une variante de la même fiche, existante, unique dans tout le dépôt (grep des 17 ids de variantes : 1 occurrence chacun) :
- tirage : dos n2 et grossesse -> `tirage-un-bras-elastique-assis`.
- alterne : dos n1 et n2 et grossesse -> `developpe-alterne-elastique-assis`.
- sol : dos n1 et n2 -> `developpe-sol-elastique-deux-bras` ; version plus douce -> la même (la fiche est retirée en grossesse : dit dans la note).
- curl-halteres : poignet n1 -> `curl-halteres-marteau` ; dos n2 et grossesse -> `curl-halteres-assis`.
- curl-elastique : dos n2 et grossesse -> `curl-elastique-assis`.
- elevation : dos n2, grossesse, version plus douce -> `elevation-laterale-chaise-halteres`.
- charniere, bonjour : aucune case `variante:` (amplitudes seulement).
Les deux remplaçants hors fiche existent et sont `utilisable` : `rowing-elastique-assis` (fiche `rowing-elastique`) et `pompe-chaise` (fiche `pompe`).

Remarque (kiné, non bloquante) : pour un profil sans chaise, les cases qui imposent l'assis du tirage un bras, du curl haltères et du curl élastique retombent sur la variante debout (même échelon 1), donc la case ne change rien ; pour l'alterné (assis = 1, debout = 2) la fiche est écartée, ce qui est le bon comportement. À accepter ou à signaler au kiné.

## 4. Liens plus-facile / plus-dur

- tirage, alterne, sol, curl-halteres, curl-elastique, elevation : `aucun` / `aucun`, cohérent (aucune vraie suite sûre).
- charniere -> `plus-dur: bonjour-poids-du-corps` et bonjour -> `plus-facile: charniere-dos-au-mur` : cibles existantes, sens correct (appui du mur avant le buste sans appui), mêmes familles (`charniere`), liens étiquetés NON SOURCÉ dans les deux lignes Sources. **M3 : ces deux cibles ne sont pas encore `utilisable`** : à passer ensemble (sinon lien affiché sans cible).

## 5. Illustrations (rendues et regardées)

Toutes les images sont des SVG originaux produits par `tools/make-illustrations.mjs` (pas de `<image>`, pas de lien externe, pas de visuel d'une autre app ; `tools/photos.md` le dit). Légendes : 110, 99, 109, 102, 100, 118, 108, 101 caractères, toutes <= 120 ; fidèles aux images sauf L2.
- tirage-vertical-un-bras-elastique : debout, main du haut au niveau du front, main qui tire départ juste sous elle puis coude le long du corps et main à hauteur d'épaule ; élastique entre les deux mains, aucun ancrage : conforme aux consignes.
- developpe-epaules-elastique-alterne (3 images) : chaise contre le mur, élastique sous les pieds, un bras monte presque vertical, l'autre reste à l'épaule, puis l'inverse : conforme.
- developpe-sol-elastique : allongé, genoux pliés, élastique ancré sous le haut du dos, coudes au sol puis bras tendus : conforme (coudes et tronc se confondent de profil, limite déjà notée dans photos.md).
- curl-halteres : haltères vus par le bout, coudes fixes, bras le long du corps puis haltères aux épaules : conforme ; ce dessin montre la prise paumes vers l'avant et non la prise marteau, la légende le dit honnêtement (« même geste »).
- curl-elastique : élastique sous le pied, bandes aux mains, coudes fixes : conforme.
- elevation-laterale : vue de face, assis sur une chaise avec dossier, haltères aux cuisses puis bras à l'horizontale, mains au niveau des épaules, pas au-dessus : conforme. **L2 (remarque, coach)** : la légende dit « chaise calée contre un mur » mais aucun mur n'est dessiné (vue de face). Retirer ces mots de la légende ou dessiner le mur.
- charniere-dos-au-mur : fesses au mur au point bas, dos plat, buste à environ 40 degrés de la verticale, talons à une longueur de pied du mur, mains vers le haut des cuisses (au tiers de la cuisse, limite notée dans photos.md ; reste en dessous du repère « mi-cuisse » de la note) : conforme.
- bonjour-poids-du-corps : bras croisés, buste incliné de moitié (45 degrés), dos plat, hanches qui reculent (flèche) : conforme. **B2 (remarque, kiné)** : les genoux sont pliés plus que « souples » (proche d'un demi-squat) ; peu risqué, mais l'image peut faire confondre avec un squat (erreur déjà listée).

## 6. Règle 23, grossesse et post-partum

- Règle 23 : curls, élévation, tirages, développés : aucun exercice technique, aucun matériel spécialisé. Charnière dos au mur et bonjour au poids du corps : sans charge, bras croisés ou mains sur les cuisses, buste incliné de moitié au plus, descente de 3 secondes, arrêt dès que le dos s'arrondit, bonjour après la charnière ; classement débutant confirmé par le kiné, NON SOURCÉ, honnête. Condition à garder (déjà notée) : si une variante chargée est un jour ajoutée au bonjour, reclasser en intermédiaire ; aucun lien vers `good-morning-barre`.
- Grossesse : sol retiré (allongé sur le dos, G4) avec remplaçant utilisable ; tirage, alterné, curls, élévation : version assise, charge ou élastique léger, respiration continue ; charnière et bonjour : amplitude réduite, « debout immobile longtemps à éviter », pas de position couchée. Statuts honnêtes (« principe OK, classement NON SOURCÉ »). Post-partum (G7) cité dans toutes les fiches (note `grossesse` ou `general`).
- **B1 (remarque, kiné)** : en grossesse, le bonjour se fait sans appui alors que la charnière contre le mur est plus stable ; `Version plus douce` pointe déjà la charnière au mur. Le kiné peut juger s'il faut une case `adapter: variante:charniere-dos-au-mur` (id de fiche = son échelon 1) pour la grossesse. Non bloquant : la perte d'équilibre est dans les signes d'arrêt.
- Sécurité de l'élastique (sous les pieds chaussés, jamais accroché ni enroulé, test avant série, procédure si l'élastique glisse), chaise (§7, test de poids), sous le dos (sol) : présentes et NON SOURCÉES honnêtement. Aucune valeur chiffrée sportive propre aux fiches ; aucune source à ouvrir (toutes déclarées NON SOURCÉ ou renvoyées aux règles communes avec leurs vrais statuts).

## Écarts par fiche (à corriger par l'auteur ; je ne corrige rien)

### tirage-vertical-un-bras-elastique
- **T1 (à corriger, coach)** : D4 sur `epaule-n2` (mécanisme « profil actif ») et `dos-n2` (justification d'auteur) ; D1 / D2 sans objet ici. Le reste est propre.

### developpe-epaules-elastique-alterne
- **A1 (à corriger, coach)** : D2 (« n3 : retrait » après `epaule-n1`), D1 (`avant-bras` : « des sur les avant-bras »), D4 (`poignet-n1`, `dos-n1` « échelon 1 contre 2 », `dos-n2`).
- **A2 (remarque, kiné)** : poignet n1 `adapter: charge:legere` : la note dit honnêtement que seule la charge change.

### developpe-sol-elastique
- **S1 (à corriger, coach)** : D1 (`epaule-n1`, `epaule-n2` : « mouvement à moitié seulement seulement »), D2 (« n3 : retrait » dans les deux), D4 (`general` amputé, `dos-n2`), `avant-bras` dans `poignet-n1`.
- **S2 (remarque)** : `epaule-n2` combine charge légère (case) et demi-course (note) : dit honnêtement.
- **S3 (remarque, kiné)** : élastique sous le haut du dos pour un débutant, choix confirmé NON SOURCÉ, protections suffisantes à mon avis.

### curl-halteres et curl-elastique
- **C1 (à corriger, coach)** : D1 (`epaule-n2` : « montée à mouvement à moitié seulement seulement »).
- **C2 (remarque)** : D5 (note `general` avec chemin de code, non affichée). Même remarque pour les 2 fiches : cases niveau 1 coude / poignet moins sévères que le retrait de l'isolation, sans contradiction ; les ids doivent encore être ajoutés à `ISOLATION.slots[].ids` de config.ts par `dev` après `utilisable` (toujours vrai : seul `elevation-laterale-assis-halteres` y figure).

### elevation-laterale
- **L1 (réserve, kiné)** : la ligne d'en-tête de la section Sécurité dit « échelons assis / debout révisés par `coach` après le contrôle du `relecteur` (à reconfirmer par `kine`) ». La reconfirmation n'est pas tracée : le kiné doit confirmer assis = 1 / debout = 2 (j'ai vérifié que la mécanique du générateur en dépend et fonctionne), puis la mention est retirée. Je ne peux pas me substituer au kiné.
- **L2 (à corriger, coach)** : légende à ajuster (mur non dessiné).
- Notes affichées : propres (aucun défaut D1 à D4).

### charniere-dos-au-mur
- **M1 (à corriger, coach)** : D3 (« règle 23 » affiché) et D1 (`dos-n1`, `hanche-n1`, `cuisse-n1`, `genou-n2`).
- **M2 (remarque)** : mains « au tiers de la cuisse » sur l'image contre « mi-cuisse » dans la note : écart connu et noté dans photos.md, acceptable.
- **M3 (à surveiller par le chef de projet)** : liens vers une fiche pas encore `utilisable` (voir 4).

### bonjour-poids-du-corps
- **B1 (à corriger, coach)** : D3 (« règle 23 » affiché) et D1 (`hanche-n1`, `cuisse-n1`, `genou-n2`).
- **B2 (remarque, kiné)** : voir le point sur l'image (genoux), et le point grossesse du §6.

## Résumé pour le chef de projet
Sécurité, doses, règle 23, grossesse, illustrations, liens et cases `variante:` : conformes. Reste : réécrire les notes affichées (D1 à D4), tracer la reconfirmation kiné de l'élévation (L1), ajuster la légende de l'élévation (L2), passer charnière et bonjour ensemble. Ensuite : `utilisable` pour les 8 fiches, avec `npm run fiches`, `npm test` (public-fiches.test.ts) et `npm run check:fiches` à relire.
