# Recontrôle du relecteur : lot 11A (4 fiches restantes, statut complete_kine)

Contrôle indépendant du 2026-11-01, lancé à neuf, après le premier contrôle (CONTROLE-relecteur.md : NON VALIDÉ). Aucune fiche n'est corrigée ici.

`timeout 120 npm run check:fiches` : 203 fiche(s) contrôlée(s), 0 erreur, 0 avertissement (l'autre agent qui écrit dans lot-11b-variete n'a produit aucune erreur au moment du lancement). Le validateur ne vérifie ni la règle sur `nom`, ni le sens des liens, ni l'affichage des notes : contrôle manuel.

**Verdict global : aucun point bloquant. Les 4 fiches sont VALIDES SOUS RÉSERVE** (réserves à corriger par l'auteur avant `utilisable`, listées ci-dessous ; aucune n'est une dose ou une règle de sécurité dangereuse).

## Sources et statuts
Aucune source à ouvrir sur le fond : toutes les affirmations propres aux fiches sont déclarées NON SOURCÉ (jugement coach / kiné) ou renvoient aux règles communes avec leurs statuts réels (R1, R2, R3, R7, R8, R9 NON SOURCÉ ; R4, R5, R6, R10 PROVISOIRE ; grossesse « principe OK, classement NON SOURCÉ »). Étiquettes honnêtes, y compris la ligne « élastique sous le haut du dos : aucune notice lue ». Aucune valeur chiffrée sportive propre aux fiches (« Aucune valeur chiffrée propre à ce mouvement »). Seule règle chiffrée : la limite de descente de la pompe piquée (10 cm de l'assise, angle droit), étiquetée NON SOURCÉ, choix prudent. Aucun texte copié détecté (réécritures déclarées). Lecture faite : format-fiches.md, regles-securite-communes.md (§0, G4, G7, R5, R8, §7), taxonomie-schemas.md, règle 23 (docs/regles-projet-detail.md : « Exercices techniques (snatch, clean) et matériel spécialisé : jamais pour débutants ni à la maison »), fiches existantes pompe, pompe-piquee, developpe-epaules-elastique, tirage-vertical-elastique-haut, rowing-elastique, developpe-au-sol-halteres, programmes-v3.md §9 (bilan lot 11A, ligne 189).

## Tableau des verdicts

| Fiche | Verdict | Peut passer à `controle_relecteur` ? |
|---|---|---|
| tirage-vertical-un-bras-elastique | VALIDE SOUS RÉSERVE (N1, N2, N3) | Oui, après correction de N1 |
| developpe-epaules-elastique-alterne | VALIDE SOUS RÉSERVE (A1, A2, A3) | Oui, après correction de A1 |
| developpe-sol-elastique | VALIDE SOUS RÉSERVE (S4, S5) | Oui, après correction de S4 |
| pompe-piquee-allegee | VALIDE SOUS RÉSERVE (P5, P6, P7, P8) | Oui, après correction de P5 et P6 ; P7 (doublon assumé) à confirmer par le chef de projet |

Passage de statut : aucune ne bloque. Les points « à corriger » sont des corrections de texte courtes (notes affichées, une distance, une incohérence de hauteur de main) ; elles ne demandent pas un nouveau contrôle complet, une vérification par `grep` suffit. Ensuite `controle_relecteur`, illustration par `dev`, puis `utilisable` (aucune fiche n'a encore d'image : `check:fiches` l'exigera au passage `utilisable`).

## Statut des écarts du premier contrôle

### Fiches supprimées (résolu par suppression)
Pullover banc (B1, U1), pompe inclinée (P1 à P4), pompe sur les genoux (G1 à G4), tirage poitrine assis (T1 à T3), développé épaules prise neutre (D4 et sa part de D3) : fiches supprimées du dossier. Vérifié : aucun fichier de knowledge/, src/, tools/, docs/ ou public/data ne cite encore ces ids (seul l'ancien CONTROLE-relecteur.md les nomme), donc aucun lien ni remplaçant orphelin. Écarts **résolus (par suppression)**. Les motifs de doublon du premier contrôle sont confirmés par le choix du coach.

### developpe-epaules-elastique-alterne
- **D1 : résolu.** `niveau_min: intermediaire`, les deux variantes intermédiaires, cohérent avec `developpe-epaules-elastique-un-bras` (intermédiaire). Le doublon partiel avec cette variante subsiste (voir A2, remarque).
- **D2 : résolu.** L'autre main reste à hauteur d'épaule partout (intro, installation, consigne 4, redescente « à hauteur d'épaule »).
- **D3 : résolu.** `epaule-n1` = `amplitude:bras-bas` comme la fiche de référence ; consigne 5 demande la respiration continue (« Expire en poussant, inspire en descendant »).
- **D4 : résolu** (fiche neutre supprimée ; `plus-facile` / `plus-dur` : aucun, correct).

### developpe-sol-elastique
- **S1 : résolu.** Grossesse : `retirer: remplacant:pompe-chaise` ; `pompe-chaise` est une variante de la fiche `pompe` (utilisable, poussée H, tags chaise + mur), qui est elle-même la case grossesse de `pompe` : le remplaçant est proposé tel quel, pas dans une version à nouveau adaptée. La note générale dit que la version plus douce (`...-deux-bras`) n'est jamais proposée quand la fiche est retirée : conforme à §0.
- **S2 : résolu.** Consigne 1 réduite à une action ; le test de l'élastique est dans « Points d'attention ». 6 consignes (limite).
- **S3 : résolu** (remarque : débutant confirmé par kine ; sécurité de l'élastique sous le haut du dos bien traitée, NON SOURCÉ honnête).

### pompe-piquee-allegee
- **B2 : résolu.** La variante au sol est retirée. Il reste une seule variante (chaise calée contre un mur), avec règle d'arrêt chiffrée dans les consignes (« angle droit ou plus tôt, toujours avant que la tête soit à 10 cm de l'assise »), test de bascule, descente lente, arrêt si vertige. Voir P5 pour une incohérence de géométrie restante.
- **Q1 : résolu.** `nom` « Pompe piquée, version allégée » (rien qui ne soit commun à toutes les variantes), id `pompe-piquee-allegee` (faute `sureleves` disparue).
- **Q2 : partiellement résolu.** Le doublon avec `pompe-piquee` (variante `pompe-piquee-mains-marche`, même geste, chaise au lieu de la marche, même famille générateur `poussee_v:pompe`) n'est pas supprimé, mais il est déclaré honnêtement (intro de la fiche et bilan §9 : gain de variété nul). Voir P7.
- **Q3 : résolu.** Le mot « débutant » a disparu des alias ; l'alias « pompe en V sur chaise » est juste maintenant qu'il n'y a que la chaise.
- **Q4 : résolu.** `plus-dur: pompe-piquee` : cible existante et utilisable, même schéma `poussee_v`, mêmes muscles principaux, et la marche (mains à environ 18 cm) est plus difficile que la chaise (environ 45 cm) : sens de progression correct. `plus-facile: aucun` (la pompe sur chaise est d'une autre famille). Grossesse alignée sur le pilote (`retirer: remplacant:pompe-chaise`). `Version plus douce : aucune` : cohérent avec une variante unique.

### tirage-vertical-un-bras-elastique
- **V1 : résolu** (coude vers le bas, main à hauteur d'épaule, plus de « vers la hanche »), mais voir N1 (hauteur de départ au niveau 1 épaule).
- **V2 : résolu.** Plus aucune mention de boucle fermée ; le tag `elastique` est cohérent.
- **V3 : résolu.** Le lien `plus-dur: tirage-poitrine-assis-elastique` est retiré (`plus-dur: aucun`, `plus-facile: aucun`).

## Écarts restants (nouveaux ou maintenus)

### tirage-vertical-un-bras-elastique
- **N1 (à corriger, coach avec kiné)** : hauteurs de mains incohérentes au niveau épaule 1. Installation : main du haut à hauteur du front, main qui tire « un peu plus bas » ; consigne 4 : la main arrive « à hauteur de l'épaule ; ne tire pas plus bas ». La note `epaule-n1` descend la main du haut « à hauteur du menton ou de la poitrine » (la case `bras-bas` change vraiment quelque chose, bien) : mais une main qui tire, partie sous une main du haut placée au menton ou à la poitrine, ne peut pas « arriver à hauteur de l'épaule » en tirant vers le bas, l'épaule étant plus haute. Préciser la hauteur de départ de la main qui tire et la hauteur d'arrivée selon le niveau (par exemple : au niveau 1 épaule, la main du haut à hauteur de poitrine et la main qui tire s'arrête à hauteur de poitrine). Pas de risque de blessure, mais la consigne n'est pas exécutable telle quelle.
- **N2 (remarque, kiné)** : `epaule-n2` = `retirer: remplacant:rowing-elastique-assis`. La fiche `rowing-elastique` a elle-même une case `adapter: amplitude:reduite` en épaule niveau 2 et une case dos adaptée vers cette même variante : selon regles-securite-communes.md §0, un remplaçant adapté par la même zone n'est pas proposé tel quel. Même pratique que `tirage-vertical-elastique-haut` (utilisable), donc remarque, mais le dire dans la note `epaule-n2` (« version adaptée, coudes près du corps »).
- **N3 (remarque)** : le dernier geste de sécurité (« relâche la main du haut en dernier, visage tourné de côté ») est une procédure NON SOURCÉE bien formulée ; elle reste honnête. Cases dos et grossesse : la variante assise est déjà l'échelon 1 ; pour la personne déjà assise, la case dos n'a pas d'effet (même schéma que la fiche de référence, remarque).
- Contrôles OK : nom (élastique commun à toutes les variantes), tags (`elastique`; `elastique, chaise`), niveaux, pas de texte interne dans les consignes, élastique tenu à la main et jamais accroché, chaise conforme à §7, signes d'arrêt, grossesse (assis), muscles (grand dorsal), lien remplaçant existant et utilisable.

### developpe-epaules-elastique-alterne
- **A1 (à corriger, coach)** : les notes (texte affiché à l'utilisateur) citent un id interne et une valeur de liste : `epaule-n1 : ... comme \`developpe-epaules-elastique\` (même case, \`bras-bas\`)` et `epaule-n2 : ... même règle que \`developpe-epaules-elastique\``. Réécrire en français sans id (« bras moins hauts : mains jusqu'à la hauteur du front »). Les pilotes n'affichent aucun id dans leurs notes.
- **A2 (remarque, coach)** : la fiche ne dit pas ce qu'elle apporte de plus que la variante `developpe-epaules-elastique-un-bras` (déjà intermédiaire, un pied sur l'élastique) : assis possible, alterné, l'autre main reste en appui. Même famille générateur `poussee_v:developpe` que `developpe-epaules-elastique` : gain de famille +1 déclaré dans programmes-v3.md §9, non débutant ; correct.
- **A3 (remarque, coach)** : installation assise : « une main à hauteur d'épaule, l'autre main reste à hauteur d'épaule » : redondant, à simplifier. Cases dos niveaux 1 et 2 : variante assise = échelon 1 (sans effet pour la personne déjà assise) ; case poignet niveau 1 `garder` alors que la référence adapte (`paumes-face-a-face`) : acceptable (une main à la fois), à confirmer par kiné.
- Contrôles OK : nom, tags, niveaux (assis puis debout, tous deux intermédiaires), épaule retirée dès le niveau 2 (comme la référence), élastique sous les pieds et chaussures, chaise, respiration, vertige (R5), grossesse assise, post-partum cité, liens `aucun`.

### developpe-sol-elastique
- **S4 (à corriger, coach)** : notes affichées avec des ids et du texte d'édition : `general : la version plus douce \`developpe-sol-elastique-deux-bras\` ...`, `grossesse : ... (variante \`pompe-chaise\`)`, et `epaule-n2 : ... (les deux changements, l'un dans la case, l'autre ici)`. Réécrire pour l'utilisateur (« la pompe sur chaise, mains hautes, prend le relais » ; supprimer la parenthèse éditoriale).
- **S5 (remarque, kiné)** : débutant avec élastique passé sous le haut du dos et allongé : choix confirmé par kiné, NON SOURCÉ, sans notice lue ; les protections (à plat, non tordu, jamais nuque ni bas du dos, test avant série, procédure de sortie en roulant sur le côté, élastique le plus léger) sont suffisantes à mon avis. Cases dos : la variante deux bras est l'échelon 1 (effet seulement pour qui est sur l'échelon 2) ; épaule niveau 2 : deux changements (charge légère dans la case, mi-course en note), dit honnêtement.
- Contrôles OK : nom (élastique + tapis communs), tags, niveaux (débutant, puis un bras intermédiaire), grossesse retirée (couché sur le dos, G4) avec remplaçant utilisable, post-partum cité, famille `poussee_h:developpe` (même famille que le développé au sol aux haltères : gain à l'élastique, niveau A), consignes sans texte interne.

### pompe-piquee-allegee
- **P5 (à corriger, coach avec kiné)** : géométrie incohérente. Installation : « pieds reculés à environ une longueur de jambe et demie » (près d'un mètre trente à partir de la chaise), ce qui donne une planche inclinée, mais la même ligne et les consignes demandent « hanches hautes », un « V renversé doux » ; une erreur fréquente est « hanches qui retombent : le mouvement devient une pompe ». Avec ces pieds, c'est une pompe sur chaise (`pompe-chaise`), pas une pompe piquée, et la limite « tête à 10 cm de l'assise » n'a plus le même sens. La note `dos-n1` ajoute « pieds pas plus reculés que d'habitude », non codable et flou. Donner une distance de pieds cohérente avec un V (pieds plus près) ou reclasser honnêtement. Pas de danger : la planche inclinée est plus douce.
- **P6 (à corriger, coach)** : notes affichées avec ids et texte d'édition : `grossesse : ... (variante \`pompe-chaise\`)`, et `dos-n1 : ... l'ancienne case « variante sur chaise » ne changeait rien (c'est la seule variante)` (commentaire de rédaction qui n'a pas à être affiché). Les retirer.
- **P7 (décision du chef de projet, remarque)** : la fiche reste un quasi-doublon de `pompe-piquee-mains-marche` (variante du pilote) ; l'apport réel est la chaise à la place de l'escalier, un échelon sous le pilote pour qui n'a pas de marche, et un gain de variété nul, comme le dit la fiche. À assumer, ou à intégrer comme variante du pilote plus tard ; ce n'est pas bloquant. Aucun autre matériel spécialisé : règle 23 respectée (intermédiaire, pas débutant, pas d'exercice technique).
- **P8 (remarque, kiné)** : post-partum non cité dans les notes (G7 ; le même réglage fait appliquer la ligne Grossesse : retirée) ; pas de ligne `cuisse` (ischios étirés jambes tendues), comme dans le pilote `pompe-piquee` : remarque uniforme.
- **Question demandée : la case dos change-t-elle vraiment quelque chose ?** Oui. `dos` n1 = `adapter: amplitude:mi-course` change la descente (coudes à environ 120° au lieu de l'angle droit prévu en consigne 4) ; l'ancienne case « variante sur chaise » n'apportait rien (variante unique) et a été remplacée. Réserve : l'effet de cette réduction sur le bas du dos est une extrapolation prudente NON SOURCÉ (honnêtement étiquetée) ; n2 = retirer, cohérent (hanches pliées, tête en bas, bas du dos qui tient le V).
- Sécurité vérifiée : poignet retiré dès le niveau 1 (poings fermés exclus sur le bord d'une chaise : cohérent avec le reste), cou / épaule / coude / dos, test de bascule de la chaise (dossier au mur, bord avant et coins), pas de blocage de respiration, arrêt si vertige ou pression dans la tête ou vision qui change (R5), relever la tête lentement, grossesse retirée (tête en bas, G4) avec remplaçant utilisable, règle 23 conforme (intermédiaire ; matériel : chaise et mur seulement).

## Contrôles transversaux
- **Cohérence interne** : niveaux (`niveau_min` = niveau de l'échelon 1 ; niveaux non décroissants), tags tous connus, aucune variante sans `tapis` / `chaise` oubliés, noms sans matériel non commun, ids de variantes uniques (aucune collision avec d'autres fiches : `pompe-piquee-chaise`, `tirage-un-bras-elastique-*`, `developpe-alterne-elastique-*`, `developpe-sol-elastique-*`), cases conformes à la grammaire (check:fiches : 0 erreur).
- **Ids dans les textes affichés** : consignes et « Points d'attention » propres des 4 fiches ; les ids apparaissent seulement dans les notes (A1, S4, P6).
- **Liens** : seuls `plus-dur: pompe-piquee` (pompe piquée allégée) existe ; cible utilisable, même schéma et mêmes muscles principaux. Remplaçants (`pompe-chaise`, `rowing-elastique-assis`) : fiches utilisables et variantes existantes.
- **Doublons avec fiches existantes (hors ecartees/)** : alterne vs variante un-bras (A2, remarque) ; pompe piquée allégée vs variante marche du pilote (P7) ; développé au sol à l'élastique et tirage un bras sans ancrage : pas de doublon.
- **Règle 23, grossesse, post-partum** : aucune fiche n'est technique ni ne demande de matériel spécialisé ; classement grossesse conforme à G4 (couché sur le dos et tête en bas : retirer ; assis : adapter) ; post-partum cité dans 3 fiches sur 4 (P8).
- **programmes-v3.md §9 (ligne 189)** : le bilan du lot 11A est maintenant honnête (4 fiches, gains par famille, A0 inchangé). Rien à redire.

## À corriger, par auteur
**Coach** : N1 (hauteurs de mains du tirage au niveau 1 épaule), A1, S4, P5 (distance des pieds), P6. **Kiné** : valider N1 et P5 avec le coach, confirmer la case poignet niveau 1 de l'alterne (A3), ajouter N2 dans la note.
Remarques sans blocage : A2, A3, S5, P7, P8, N3.

Rien n'est bloquant : les 4 fiches peuvent passer à `controle_relecteur` une fois N1, A1, S4, P5 et P6 corrigés (vérification par grep), puis illustration par `dev`, puis `utilisable`.
