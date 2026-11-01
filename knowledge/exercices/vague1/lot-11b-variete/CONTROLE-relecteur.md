# Contrôle du relecteur : lot 11B (5 fiches, statut complete_kine)

Contrôle indépendant du 2026-11-01, lancé à neuf. Aucune fiche n'est corrigée ici, aucun autre fichier n'est modifié.

`timeout 120 npm run check:fiches` : 207 fiche(s) contrôlée(s), 0 erreur, 0 avertissement. Les fichiers de `lot-11-variete-a/` (qu'un autre agent peut écrire) sont ignorés dans ce contrôle. Le validateur ne vérifie ni la règle sur `nom`, ni le sens des liens, ni la cible des cases `variante:`, ni ce que l'app affiche : tout cela est contrôlé à la main ci-dessous.

**Verdict global : aucun point bloquant.** 2 fiches VALIDES (remarques seulement), 3 VALIDES SOUS RÉSERVE (écarts à corriger par l'auteur, courts, aucun n'est une dose ou une règle de sécurité dangereuse).

## Sources et statuts
Aucune valeur chiffrée sportive propre aux fiches ; toutes les affirmations propres (existence du mouvement, consignes, échelons, tableau par zone) sont déclarées NON SOURCÉ, et les règles communes sont citées avec leurs statuts réels (R1, R2, R3, R7, R8, R9 NON SOURCÉ ; R4, R5, R6, R10 PROVISOIRE). Grossesse : « principe OK, classement NON SOURCÉ », avec la mention honnête « ces textes ne citent pas cet exercice » (HAS 2019, Mottola 2019 : je n'ai pas rouvert ces PDF, j'ai vérifié que la fiche n'en tire que ce que `regles-securite-communes.md` G4 en tire déjà). Aucun texte copié détecté (réécritures déclarées). Étiquettes honnêtes, sauf l'omission signalée en B2 / M2 (les liens de progression ne sont pas étiquetés).

## Tableau des verdicts

| Fiche | Verdict | Peut passer à `controle_relecteur` ? |
|---|---|---|
| curl-halteres | VALIDE (remarques H1, H2) | Oui, maintenant |
| curl-elastique | VALIDE (remarques E1, E2) | Oui, maintenant |
| elevation-laterale-debout | VALIDE SOUS RÉSERVE (L1, L2, L3 à corriger ; L4, L5 remarques) | Oui, après correction de L1, L2, L3 |
| charniere-dos-au-mur | VALIDE SOUS RÉSERVE (M2 à corriger ; M1, M3 remarques) | Oui, après correction de M2 |
| bonjour-poids-du-corps | VALIDE SOUS RÉSERVE (B1, B2 à corriger ; B3, B4 remarques) | Oui, après correction de B1 et B2 |

Ensuite : illustration par `dev` (tools/illustrations-poses.mjs ; les fiches n'ont aucune image, `check:fiches` l'exigera au passage `utilisable`), puis `utilisable`. Vérification des corrections par `grep` suffisante, pas de nouveau contrôle complet.

## Contrôles transversaux

### Cases `variante:<id>` : cible dans la MÊME fiche (contrôlé à la main, 5 fiches)
- curl-halteres : poignet n1 -> `curl-halteres-marteau` (variante de curl-halteres) ; dos n2 et grossesse -> `curl-halteres-assis` (idem) ; version plus douce `curl-halteres-assis` (idem). OK.
- curl-elastique : dos n2 et grossesse -> `curl-elastique-assis` (variante de curl-elastique) ; version plus douce idem. OK.
- elevation-laterale-debout : dos n2 et grossesse -> `elevation-laterale-chaise-halteres` (variante de cette fiche, et non `elevation-laterale-assis-chaise` de l'autre fiche) ; version plus douce idem. La cible est bien dans la fiche, **mais voir L2 (effet nul pour un profil sans haltères)**.
- charniere-dos-au-mur, bonjour-poids-du-corps : aucune case `variante:` ; version plus douce de bonjour = `charniere-dos-au-mur` (fiche, échelon 1) existante.

### Cases `adapter` qui ne changent rien
Lues dans `src/generator/safety.ts` (applyAdapters, lignes 340-370) : si la variante imposée n'est pas permise par le matériel du profil, le générateur prend « la plus haute d'échelon <= la cible » parmi les variantes permises. Comme **toutes les variantes de ces fiches sont à l'échelon 1**, la case `variante:` ne change rien dès que la cible est exclue par le matériel (tag manquant) : c'est le cas L2. Pour les curl, la cible (assis) n'exige que `chaise`, tag implicite : seul un profil qui a décoché la chaise est touché, acceptable. Les cases `amplitude:*`, `charge:legere`, `tete-alignee` ont un effet réel (note affichée, plafond de charge `capped`). Cas bénin : `poignet-n1` de curl-elastique = `charge:legere` (élastique le plus léger) : effet = plafond, sans changement de bande si le profil n'en a qu'une (remarque E2).

### Cohérence avec src/generator/isolation.ts et config.ts (ISOLATION)
- `isoFicheFits` : schéma et muscle principal conformes (curl : `tirage_h` + `biceps` ; élévation : `poussee_v` + `deltoides_lateraux`) ; aucune fiche n'a `deltoides_anterieurs` ou `triceps` en principal (curl-halteres : deltoïdes antérieurs seulement en secondaire) ; les trois sont `debutant`, donc admissibles à l'isolation du débutant.
- **Liste fermée** : `ISOLATION.slots[iso_biceps].ids` = `curl-barre`, `curl-incline-halteres` ; `iso_deltoide_lateral.ids` = `elevation-laterale-assis-halteres`. **Aucune des nouvelles fiches n'y est : tant que `dev` n'a pas ajouté `curl-halteres`, `curl-elastique` (iso_biceps) et l'id final de l'élévation (iso_deltoide_lateral), le lot n'apporte aucune variété d'isolation.** À faire par `dev` APRÈS `utilisable` (les fiches l'annoncent, bien). Ajouter un test (isolation débutant au niveau A : curl élastique ; niveau B : curl haltères debout).
- Retrait dès le niveau 1 : `iso_biceps.zones` = coude, poignet ; `iso_deltoide_lateral.zones` = épaule. Les cases de niveau 1 des fiches (coude `charge:legere`, poignet marteau ou `charge:legere`, épaule `bras-bas`) sont moins sévères que le retrait du code mais ne le contredisent pas : le code gagne pour l'emplacement d'isolation, les cases ne servent qu'en usage hors emplacement. Cohérent. Les notes « general » qui le disent ne sont pas affichées (seules `<zone>-n<niveau>` et `grossesse` le sont : src/generator/safety.ts noteTexts, src/data/fiches.ts lignes 251 et 261).
- Grossesse : `isoEligible` coupe l'isolation si `ctx.pregnant` : la note de l'élévation dit vrai (voir L3 pour la forme).
- Débutant, élévation latérale : `capped` + étiquette « bras jusqu'à l'horizontale, jamais au-dessus » : cohérente avec consigne 2 et « Points d'attention » de la fiche.
- Famille générateur (src/generator/variety.ts : schéma + premier mot de l'id) : `tirage_h:curl` partagée avec curl-barre et curl-incline-halteres, `poussee_v:elevation` avec elevation-laterale-assis-halteres (plafond 2 fiches par famille et par semaine) ; `charniere:charniere` et `charniere:bonjour` sont deux familles nouvelles (`good-morning-barre` = `charniere:good`). Les curls et l'élévation ne créent donc pas de famille, mais l'isolation a sa propre rotation (`rotationStart`) : le gain est en matériel (élastique, haltères sans banc ni barre), pas en famille.

### Sécurité (règle 23, grossesse, blessures, élastique, chaise)
- **Règle 23** (« exercices techniques et matériel spécialisé : jamais pour débutants ni à la maison ») : `bonjour-poids-du-corps` est la version sans charge d'un exercice classé `avance` (`good-morning-barre`). Conditions du classement débutant (tout y est) : aucune charge, bras croisés, buste incliné de moitié au plus, descente de 3 secondes, arrêt dès que le dos s'arrondit, étape après la charnière dos au mur, aucun lien vers `good-morning-barre`. Pas de champ `technique`, pas de matériel spécialisé. Acceptable ; condition à garder : si une variante chargée (sac, haltère) est un jour ajoutée, reclasser (B3).
- **Charnière sans charge** : dos plat, descente limitée avant les genoux (mur) ou à mi-chemin (bonjour), arrêt dès que le dos s'arrondit ou à l'étirement, remontée sans cambrer, respiration continue : présents dans consignes, erreurs et signes d'arrêt des deux fiches. Zone dos : n1 `mi-course` (mur) / `reduite` (bonjour), n2 `reduite` / `retirer`, n3 `retirer`. Bonjour plus restrictif que le mur : cohérent (buste sans appui). Lignes `cuisse` présentes (ischios principaux, §0) ; pas de ligne `aine` (adducteurs non sollicités) : correct.
- **Grossesse / post-partum** : curls (assis, charge légère ou élastique léger), élévation (assise ; isolation coupée en grossesse), charnières (amplitude réduite, debout, pas de position couchée, « debout immobile à éviter » dit pour bonjour et l'élévation) : conforme à G4 (soulevés de terre : adapter). Post-partum G7 cité partout ; aucune de ces fiches n'est à impact. Version plus douce `aucune` pour le mur : correct (unique variante).
- **Élastique** (curl, élévation) : tenu à la main, sous les pieds chaussés, jamais accroché ni enroulé, contrôle avant chaque série, procédure si l'élastique glisse (poignées gardées, redescente lente), visage hors de la ligne ; signes d'arrêt « élastique abîmé, glissé ou échappé ». Les mains montent vers les épaules et le visage dans le curl : le risque de retour d'élastique est le même que dans les fiches élastique déjà utilisables et il est nommé (« peut te frapper le visage »). Aucune notice lue, NON SOURCÉ honnête.
- **Chaise** : texte conforme à §7 (4 pieds, sans roulettes, non pliante, dossier au mur, test de poids) dans curl-halteres, curl-elastique, élévation.
- **Blessures par niveau** : monotones (garder < adapter < retirer, niveau 3 toujours `retirer`), grammaire valide (check:fiches) ; coude et poignet n2 `retirer` pour les curls, épaule n2 `mi-course` pour les curls (effet réel), épaule n2 `retirer` pour l'élévation ; cou n2 `tete-alignee` pour l'élévation : comme la fiche assise de référence.

### Cohérence interne
- Niveaux : `niveau_min` = niveau de l'échelon 1, niveaux non décroissants, échelons valides ; tags tous dans `knowledge/materiel-tags.json` (`halteres`, `elastique`, `chaise`, `poids_du_corps`, `mur`) ; ids de variantes uniques (check:fiches) ; aucun id interne ni fichier dans les consignes ni dans « Points d'attention ». Consignes : 6 par fiche, simples, sans texte copié.
- Règle sur `nom` : curl-halteres, curl-elastique, charniere-dos-au-mur (mur commun à la seule variante), bonjour-poids-du-corps : conformes. **elevation-laterale-debout : non conforme (L1).**
- Liens plus-facile / plus-dur : tous les autres liens sont `aucun`, sauf charniere-dos-au-mur -> bonjour-poids-du-corps (`plus-dur`), bonjour-poids-du-corps -> charniere-dos-au-mur (`plus-facile`) et bonjour-poids-du-corps -> `souleve-de-terre-roumain-halteres` (`plus-dur`). Cibles existantes, même schéma `charniere`, muscles principaux communs (ischios, fessiers), règle taxonomie-schemas.md respectée. `souleve-de-terre-roumain-halteres` est `utilisable` ; les deux fiches du lot sont encore `complete_kine` : elles doivent avancer ensemble (le générateur n'utilise que `utilisable` et `verifie`). Sens de progression : à justifier (B2).

### Doublons avec les fiches existantes (hors ecartees/)
- curl-barre, curl-incline-halteres : mouvements voisins mais matériel différent (barre, banc incliné) ; la prise marteau debout et le curl à l'élastique n'existent nulle part ailleurs : pas de doublon (vérifié aussi par grep des ids et de « curl » dans knowledge/exercices).
- elevation-laterale-assis-halteres : **doublon partiel assumé** : les variantes `elevation-laterale-chaise-halteres` (ici) et `elevation-laterale-assis-chaise` (là-bas) sont le même geste (assis sur chaise, haltères, bras le long du corps). L'intro l'explique (version adaptée dos / grossesse). Voir L4.
- good-morning-barre : bonjour sans charge ne le double pas (barre, rack, avancé).
- pont-fessier : autre geste (au sol, fessiers seuls) ; souleve-de-terre-roumain-halteres : demande des haltères ; `souleve-de-terre-roumain-unijambiste` : intermédiaire, unilatéral. La charnière debout sans charge pour le débutant n'existait pas : les deux charnières apportent un vrai niveau A0.

### Le lot sert-il la variété ? (programmes-v3.md §9, lignes 4 et 6)
- Charnière A0 : oui. Deux fiches pleines (ischios et fessiers principaux, ni `substitut`, ni matériel), deux familles nouvelles (`charniere:charniere`, `charniere:bonjour`) pour un niveau D-A0 à 2 familles utiles ; elles fournissent aussi un remplaçant sans matériel à `pont-fessier` en grossesse (aujourd'hui le roumain aux haltères).
- Isolation maison : oui, une fois les ids ajoutés dans `ISOLATION` (voir ci-dessus) : biceps à l'élastique (niveau A, aujourd'hui aucun curl sans barre ni banc) et aux haltères debout (niveau B sans banc), élévation latérale debout (haltères ou élastique). Pas d'isolation sans matériel (A0) : non traité par ce lot.
- Non fait : `docs/plan-fichiers.md` ne cite pas lot-11-variete-a ni lot-11b-variete ; le bilan du lot 11B n'est pas encore dans programmes-v3.md §9 (le fichier est modifié, non commité). À faire par le chef de projet / `dev`.

## Écarts par fiche

### curl-halteres : VALIDE
- **H1 (remarque, dev)** : l'id n'est pas dans `ISOLATION.slots[iso_biceps].ids` (config.ts) ; à ajouter après `utilisable`. Sans cela, aucun effet.
- **H2 (remarque, kine)** : `poignet-n1` = `variante:curl-halteres-marteau` : sans effet pour qui est déjà en prise marteau ; inoffensif (le retrait d'isolation du code est plus sévère). Les notes « general » citent un chemin de code (src/generator/isolation.ts) : non affichées, mais deviendront fausses si le code change ; à alléger si l'auteur repasse sur la fiche.
- Contrôles OK : nom, tags (`halteres` ; `halteres, chaise`), niveaux, muscles, cases par zone, grossesse assise, signes d'arrêt, haltères serrés, chaise §7.

### curl-elastique : VALIDE
- **E1 (remarque, coach)** : « jamais sur le bord de la chaise ni sur un bord de pied » : le « bord de la chaise » n'a pas de sens pour un élastique sous les pieds ; reformuler (par exemple « jamais coincé sous un pied de la chaise »). Sans risque.
- **E2 (remarque, kine)** : `poignet-n1` = `charge:legere` : seul effet, le plafond de charge (élastique le plus léger du profil) ; aucun changement de geste. Acceptable, à garder honnête dans la note.
- **E3 (remarque, dev)** : ajouter l'id à `iso_biceps.ids` après `utilisable` (comme H1).
- Contrôles OK : nom, tags (`elastique` ; `elastique, chaise`), élastique sous les pieds chaussés, contrôle et procédure de glissement, visage hors de la ligne, chaise §7, grossesse assise.

### elevation-laterale-debout : VALIDE SOUS RÉSERVE
- **L1 (à corriger, coach)** : `nom: Élévation latérale, haltères ou élastique` cite du matériel qui n'est pas commun à toutes les variantes (règle format-fiches.md §1) ; l'id contient « debout » alors que deux variantes sont assises. Renommer en « Élévation latérale » (le matériel est déjà dans le `nom` de chaque variante) ; l'id peut rester (aucune référence ailleurs) mais « debout » est trompeur : décision coach, la famille générateur `poussee_v:elevation` ne change pas.
- **L2 (à corriger, coach avec kine ; dev si besoin)** : pour un profil avec élastique mais sans haltères, les cases `dos` n2, `grossesse` et la version plus douce désignent `elevation-laterale-chaise-halteres`, qui exige `halteres` ; la cible est exclue et le générateur retombe sur « la plus haute d'échelon <= la cible » (safety.ts 358-366) : toutes les variantes étant à l'échelon 1, la variante debout à l'élastique est choisie : la case ne change rien, alors que la note `dos-n2` promet « sans haltères, la variante assise à l'élastique ». Corrections possibles (au choix du coach) : mettre les deux variantes assises à l'échelon 1 et les deux variantes debout à l'échelon 2 (même niveau `debutant`, ordre du tableau changé ; le fallback prend alors l'assise à l'élastique ; conséquence à accepter : le débutant sans historique commence assis), ou séparer en deux fiches (haltères / élastique). Vérifier ensuite par un test de profil « élastique seul + dos n2 ». Gravité : à corriger (risque faible : charge la plus légère, plafond `capped` conservé).
- **L3 (à corriger, coach)** : notes AFFICHÉES avec texte d'édition : `dos-n2 : ... (variante de cette fiche ; sans haltères, la variante assise à l'élastique)` et `grossesse : assise (variante de cette fiche) ... le générateur n'ajoute de toute façon pas d'isolation en grossesse (isoEligible) ...` (la note de grossesse est affichée phrase par phrase, src/data/fiches.ts ligne 261). Réécrire en français pour l'utilisateur, sans « variante de cette fiche », sans `isoEligible` ni mention du générateur.
- **L4 (remarque, coach)** : doublon partiel avec `elevation-laterale-assis-halteres` (même geste assis aux haltères) ; assumé par l'intro. À mentionner dans le bilan du lot (la fiche ajoute surtout le debout et l'élastique).
- **L5 (remarque, coach)** : consigne 3 (« ne tourne pas le petit doigt vers le haut ») peu claire pour un débutant ; reformuler (« les mains ne passent pas au-dessus des coudes »).
- Contrôles OK : plafond « jamais plus haut que l'horizontale » à tous les niveaux ; épaule n1 `bras-bas`, n2 `retirer` (comme la fiche assise, et comme le code d'isolation) ; cou, coude, poignet par niveau ; vertige (arrêt, s'asseoir) ; élastique ; chaise ; muscles ; liens `aucun` ; l'id final doit être ajouté à `iso_deltoide_lateral.ids` (dev).

### charniere-dos-au-mur : VALIDE SOUS RÉSERVE
- **M1 (remarque, kine)** : signe d'arrêt « vertige ou perte d'équilibre en remontant : arrête et reste debout, mains sur le mur » alors que bonjour dit « assieds-toi » ; harmoniser (s'appuyer au mur puis s'asseoir si une chaise est proche ; R5 dit seulement d'arrêter la séance).
- **M2 (à corriger, coach)** : la ligne « Sources » ne dit pas que le lien `plus-dur: bonjour-poids-du-corps` est un jugement de coach NON SOURCÉ (taxonomie-schemas.md : toute règle de progression est NON SOURCÉE). Ajouter la ligne.
- **M3 (remarque, coach)** : les repères d'amplitude (mi-cuisse, haut des cuisses) sont dans la note `general`, non affichée ; seules `dos-n1`, `hanche-n1`, `cuisse-n1`, etc. le sont, et elles disent « mi-course » / « amplitude réduite » sans rappeler le repère ; reprendre le repère (« mains jusqu'à mi-cuisse ») dans `dos-n1` et `dos-n2` pour que l'utilisateur sache ce que change la case.
- Contrôles OK : dos plat, descente limitée avant les genoux, arrêt dès que le dos s'arrondit, mur et sol (§7 objets), grossesse `amplitude:reduite`, cases genou / hanche / cuisse / dos monotones et à effet réel, aucune charge.

### bonjour-poids-du-corps : VALIDE SOUS RÉSERVE
- **B1 (à corriger, coach)** : notes AFFICHÉES avec texte d'édition et id interne : `dos-n1 : amplitude réduite (la case « variante bras croisés » ne changeait rien : c'est l'unique variante) ...` (commentaire de rédaction) et `dos-n2 : retrait, confirmé par kine : ... Pas de remplaçant : charniere-dos-au-mur est elle-même adaptée ... (§0 de regles-securite-communes.md) ; le générateur choisit ...` (id, renvoi à un fichier, mécanisme interne). Réécrire pour l'utilisateur (« retrait : le buste penché sans appui sollicite le bas du dos »). Même défaut que P6 / S4 du lot 11A.
- **B2 (à corriger, coach)** : (a) la ligne « Sources » ne dit pas que les liens `plus-facile: charniere-dos-au-mur` et `plus-dur: souleve-de-terre-roumain-halteres` sont un jugement NON SOURCÉ ; (b) le sens de `plus-dur: souleve-de-terre-roumain-halteres` est discutable : les deux sont `debutant`, et le roumain aux haltères (contrepoids devant) peut être plus simple à apprendre que le bonjour bras croisés ; dire dans la fiche pourquoi bonjour vient avant (ou ne garder que `plus-dur` vers une cible plus difficile). Pas de danger.
- **B3 (remarque, kine)** : classement débutant tenu par des conditions écrites (aucune charge, bras croisés, moitié de buste, arrêt) ; si une variante chargée est un jour ajoutée, la fiche doit repasser `intermediaire` (règle 23 et classement avancé de `good-morning-barre`). Vérifier avec `dev` que la progression du générateur pour une fiche `poids_du_corps` n'ajoute jamais de charge d'un autre tag.
- **B4 (remarque, kine)** : « Vertige en remontant : arrête et assieds-toi » : aucune chaise n'est prévue dans l'installation ; accepter « assieds-toi si possible » ou harmoniser avec M1.
- Contrôles OK : `dos` n1 `reduite` / n2 `retirer` (plus prudent que le mur : buste sans appui), cases hanche, cuisse, genou, grossesse `reduite`, version plus douce existante, muscles, tags `poids_du_corps`, aucune charge, aucun lien vers `good-morning-barre`.

## À corriger, par auteur
- **Coach** : L1, L2 (avec kine), L3, L5 ; M2, M3 ; B1, B2 ; E1, H2 (facultatifs).
- **Kine** : valider L2 (choix d'échelons), M1 / B4 (vertige), B3.
- **Dev** (après `utilisable`) : ajouter `curl-halteres`, `curl-elastique` à `ISOLATION.slots[iso_biceps].ids` et l'id de l'élévation à `iso_deltoide_lateral.ids` (config.ts), test d'isolation par niveau de matériel, illustrations (5 fiches), `docs/plan-fichiers.md`.
- **Chef de projet** : bilan du lot 11B dans programmes-v3.md §9.

Rien n'est bloquant. Les 5 fiches peuvent passer à `controle_relecteur` : curl-halteres et curl-elastique maintenant ; elevation-laterale-debout après L1, L2, L3 ; charniere-dos-au-mur après M2 ; bonjour-poids-du-corps après B1 et B2.
