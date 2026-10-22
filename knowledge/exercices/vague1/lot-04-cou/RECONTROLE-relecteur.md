# Recontrôle `relecteur` du lot 04 (cou), après corrections

Recontrôle à neuf le 22/10/2026 : 12 fiches, §3 G4, §9-10 de `regles-securite-communes.md`, `src/data/injury-rules.ts`. Rien n'a été corrigé par moi. Vérifié : `npm run check:fiches` = 114 fiches, 0 erreur, 0 avertissement ; `vitest tests/unit/injury-rules.test.ts` = 14 tests passés. Page HAS « AVC : signes d'alerte » rouverte (WebFetch) : visage, bras/jambe, parole, vue d'un œil, mal de tête très fort et brutal, équilibre/marche confirmés ; « vision double » et « vertige » absents, le 112 absent (la page dit le 15) : les fiches et C4 les marquent déjà NON SOURCÉ ; la page cite aussi « perte de sensation », sans conséquence.

## Bloquant B1 : levé (côté règle)
- `injury-rules.ts` : `neckFicheAllowed` exclut les 4 fiches dédiées hors zone (niveau 0 = seulement sur demande explicite), `isometrique-cou` seulement au niveau 1 et jamais sur simple demande, tout est retiré au niveau 3, `retraction-omoplates` reste normale aux niveaux 0 à 2. Conforme à §9 C1, C2, C5.
- Case C3 : `afterShock` dans le modèle, la validation et l'écran Injuries ; `effectiveLevel` = 3 ; message identique à §9 C3. Tests : couvrent les niveaux, le choc, les blessures supprimées.
- `doux_pour: [cou]` présent sur les 4 fiches douces (rotation, inclinaison, rétraction cervicale, retraction-omoplates), absent d'`isometrique-cou` (juste), validé par `validate-fiches.mjs`.
- Réserve (mineur, pas un défaut de fiche) : `filterByNeck` n'est appelé par aucun code de production (le générateur n'existe pas encore). Le blocage est donc codé et testé mais pas encore branché : à rappeler à `dev` pour la phase du générateur. Plusieurs fiches douces sont déclarées dans `NECK_DEDICATED_IDS` en dur : si une fiche de cou est ajoutée, la liste doit suivre.

## Points « à corriger » du rapport précédent : état
1. Maladresse des mains / équilibre / marche : ajouté dans les 12 fiches (sauf `rotation-externe-poulie`, hors cou, voulu). Corrigé.
2. Statut « OK » des maux de tête : reformulé (« OK pour cervicalgie inhabituelle et persistante associée à des céphalées ou douleur du visage ; céphalées isolées : PROVISOIRE ») ; §9 C4 aligné. Corrigé.
3. Vertige : NON SOURCÉ partout, règle unique (R5 = C4 = fiches, « même léger, y compris en te relevant, ne reprends pas avant avis », choix prudent assumé). Les fiches `oiseau-banc-incline` et `oiseau-un-bras-appuye` sont alignées. Corrigé.
4. Source AVC : maintenant une page officielle HAS (lue via résumé, rouverte par moi) ; « vision double » et « vertige brutal avec ces signes » dits NON SOURCÉ. Corrigé (reste PROVISOIRE).
5. Cochrane / Blanpied : mention « contexte seulement, pas une preuve pour cet exercice » ajoutée dans les fiches de mobilité. Corrigé.
Autres : Blomgren reformulé (n'évalue pas la douleur) ; `isometrique-cou` : consigne de la variante mur + serviette (consigne 5), photo `Sides-1` marquée non affichable, provenance de `photos.md` corrigée ; `oiseau-banc-incline` : photo `Reverse_Flyes-1` marquée non affichable (consigne prime) ; `oiseau-machine-poulie` : « contre le coussin » ; `tirage-visage-sangles` : « arbre » exclu, aligné sur §10 ; README : phrase périmée supprimée ; G4 contient `tirage-visage-sangles` ; C2 sans ambiguïté sur `retraction-omoplates`. Tous corrigés.

## Points restants
**Bloquant : aucun.**

**À corriger : aucun.**

**Mineurs (non bloquants)**
- `public/photos/free-exercise-db/Isometric_Neck_Exercise_-_Sides-1.webp` et `Reverse_Flyes-1.webp` sont toujours dans le dépôt alors que marquées « affichable : non » : vérifier que l'app lit bien ce drapeau (sinon les supprimer).
- Variante `oiseau-poulies-croisees` (échelon 2) et variante couchée de `retraction-cervicale` : l'échelon n'est pas justifié ; couvert par la mention générale « échelons : choix de coach, NON SOURCÉ ».
- Muscles du cou : `trapezes` / `erecteurs_rachis` par défaut (README question 1 ouverte) ; ligne « Échelons... muscles du cou » recopiée sans objet dans `rotation-externe-poulie` (Reinold ne porte pas sur ce mouvement).
- Illustrations peu lisibles (inclinaison, rétraction omoplates, ecartement-serviette, tirage-visage-sangles) : sans danger, déjà notées. Petits logos de vêtements sur certaines photos (règle 12, tolérable).
- Blanpied 2017 (grade B « mobilité ») toujours non vérifié dans le texte intégral : PROVISOIRE honnête. Aucune notice de sangles lue : NON SOURCÉ honnête.
- Maladies du tissu conjonctif et antécédent de cancer : non demandés par l'app (décision D), à garder en remarque.

## Statuts finaux proposés
Aucune fiche `verifie` (lignes PROVISOIRE / NON SOURCÉ présentes partout, c'est attendu).

| Fiche | Statut proposé |
|---|---|
| rotation-externe-poulie | `utilisable` |
| face-pull-elastique | `utilisable` |
| retraction-omoplates | `utilisable` |
| ecartement-serviette | `utilisable` |
| oiseau-banc-incline | `utilisable` (photo 0 seule affichée) |
| oiseau-machine-poulie | `utilisable` |
| oiseau-un-bras-appuye | `utilisable` |
| tirage-visage-sangles | `utilisable` |
| rotation-douce-cou | `utilisable` |
| inclinaison-douce-cou | `utilisable` (illustration peu lisible, sans danger) |
| retraction-cervicale | `utilisable` |
| isometrique-cou | `utilisable` (photos Front/Back seules affichables ; réserve : exclusion hors zone à brancher dans le générateur) |

Condition commune : le générateur doit appeler `filterByNeck` (sinon B1 réapparaît en pratique). Les statuts restent à écrire par l'auteur ou `dev` : je n'ai modifié aucune fiche (toutes sont encore `controle_relecteur`).
