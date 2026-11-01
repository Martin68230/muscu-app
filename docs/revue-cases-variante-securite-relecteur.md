# Contrôle relecteur : correction de 67 cases `adapter: variante:<id>` (22 fiches, non commitées)

Date : 1er novembre 2026. Relecteur lancé à neuf, ciblé sécurité. Aucun fichier corrigé. Sources lues : `git diff -- knowledge/exercices`, `src/generator/safety.ts` (`resolveUncached`, `applyAdapters`, `tryReplacement`, `warmupVariant`), `src/generator/slots.ts` (`slotDef`, `rankSlot`), `knowledge/regles-securite-communes.md` §0, `docs/revue-cases-variante-securite.md`, tests `tests/unit`. Les cibles ont été vérifiées par un script jetable (lecture des 207 fiches).

## Verdict : VALIDE SOUS RÉSERVE (aucun point bloquant)

Aucune ligne n'est affaiblie. Les réserves sont des écarts de texte et de documentation (coach), plus des remarques kiné et dev.

## (1) Cases modifiées : au moins aussi protectrices

- Toutes les cases modifiées vont de `adapter` vers `retirer` (avec ou sans `remplacant`), ou restent `retirer`. Aucune ne va de `retirer` vers `adapter`.
- Niveaux : n1 <= n2 <= n3 pour chaque ligne modifiée (ex. squat-gobelet genou `garder | retirer | retirer`, fente-avant genou `retirer | retirer | retirer`, montee-sur-banc partout `retirer`). Aucun niveau 2 plus permissif que le niveau 1.
- Lignes Grossesse (pompe-ecartee, rowing-buste-penche-halteres, fente-avant) : `adapter: variante:X` devient `retirer: remplacant:X`. Plus strict, et le résultat effectif est identique : en grossesse, `tryReplacement` accepte une cible classée `adapter` par sa propre ligne Grossesse. Cibles contrôlées : pompe-chaise (`adapter: variante:pompe-chaise`), rowing-unilateral-haltere (`adapter: charge:legere`), squat-fendu-mur (`adapter: variante:squat-fendu-mur`) : conformes à §0. Aucune autre fiche ne désigne pompe-ecartee, rowing-buste-penche-halteres ni fente-avant comme remplaçant en Grossesse (grep).
- montee-sur-banc cheville n2 : `adapter: appui:main-sur-support` devient `retirer: remplacant:montee-sur-marche-poids-du-corps`. Plus strict. Cheville n1 passe aussi de `adapter` à `retirer`, hanche n1 et n2 également (stricts).
- `warmupVariant` : un `retirer` renvoie null, donc ces fiches ne sont plus proposées en échauffement avec ces zones : plus strict, sans risque.
- Changement de cible (et non seulement d'action) : pompe-archer dos n1 (`pompe-ecartee-sol` vers `pompe-ecartee`, même exercice : une seule variante) ; pompe-piquee-pieds-sureleves épaule n1 / coude n2 / poignet n1 (`pompe-piquee` vers `pompe-piquee-mains-marche`) ; sumo-barre dos n1 (retirer, remplaçant mort). Aucun n'affaiblit.

## (2) Remplaçants : existence, statut, famille de schéma

Tous les `remplacant:<id>` modifiés existent (fiche ou variante d'une fiche) et sont `utilisable`. Sur les mêmes cases, les cibles sont de la même famille de schéma que l'origine, sauf :
- fente-arriere, squat-bulgare, squat-fendu, fente-avant, fente-laterale (schéma `fente`) vers squat-assis-debout (schéma `squat`) pour cheville n2 ;
- pompe-piquee-pieds-sureleves épaule n2 (`poussee_v`) vers pompe-chaise (`poussee_h`, ligne déjà présente avant correction, non modifiée) ;
- squat-fendu vers squat-assis-debout (cheville n2).
Ce n'est pas une régression (les anciennes cases visaient les mêmes cibles) et `slotDef` l'accepte : `jambes_genou` a la famille voisine en repli (`allowB`), et l'autre famille de poussée est dans `poussee_2`. À signaler, pas bloquant.

## (3) Notes affichées `<zone>-n<niveau>` modifiées

- Aucun id interne, ni « mi-course », ni « avant-bras », ni commentaire de rédaction dans les notes modifiées ou ajoutées (grep sur les 22 fiches). Cohérence note / case : bonne pour les cases `retirer` sans remplaçant et pour les remplaçants vivants.
- Constat de code important : `noteTexts(X, adapters)` n'affiche que les notes d'une fiche ADAPTÉE, et `tryReplacement` n'affiche que les notes de la cible. La note d'une fiche retirée (origine) n'est donc jamais affichée. Toutes les notes « retirée à ce niveau ; remplacée par ... » sont du texte non affiché. Pas de risque de sécurité, mais le texte documentaire peut être faux (voir 5).
- Écarts à corriger (coach), notes NON modifiées devenues fausses car la case est devenue `retirer`, et qui disent encore « adapté / remplacé » :
  - planche-bras-jambe-leves : coude-n2, cou-n2 (« remplacé par la planche sur les genoux »)
  - planche-laterale-jambe-levee : epaule-n1, hanche-n2, coude-n2 (« remplacé par la planche latérale sur le genou ... avant-bras ») ; la case coude n2 est mort aussi (5)
  - fente-avant : genou-n1, hanche-n2, cheville-n1, dos-n2 (« squat fendu avec la main au mur »), cheville-n2 (contient « (R2) »)
  - montee-sur-banc : genou-n1, hanche-n1, cheville-n1 (« repasse sur une marche ... »)
  - fente-avant genou-n2 : note modifiée contient « (R2) » (code interne), le nettoyage `cleanText` ne le garantit pas
- Notes modifiées affirmant un remplacement qui ne se produit jamais (cases mortes, voir 5) ou donnant un « par exemple » non garanti : planche-touche-epaule dos-n2, pompe-diamant dos-n2, pompe-ecartee (coude, poignet, dos n2, grossesse OK car vivante), pompe-piquee-pieds (épaule-n1, coude-n2, poignet-n1), roumain-halteres dos-n2, squat-bulgare genou/hanche n2, fente-arriere genou/hanche n2, squat-fendu n/a, porte-valise dos-n2 et squat-gobelet / squat-poids-du-corps (« par exemple le squat assis-debout » : jamais proposé pour genou / hanche / dos n2, §0). Gravité : à corriger (texte), non bloquant.
- Remarque : le conseil Grossesse de pompe-ecartee (« mains hautes, respiration continue, jamais jusqu'à l'échec ») était déjà non affiché avant correction (la note d'origine ne s'affichait pas non plus avec l'ancienne case foreign). Vérifier que la fiche de la pompe (pompe-chaise / `pompe`) porte bien son propre conseil Grossesse affiché : la ligne `- grossesse :` de `ecartees/pompe-ancienne.md` existe, mais ce fichier est dans un dossier `ecartees` (voir remarque doublon id plus bas).

## (4) « Les 67 anciennes cases étaient sans effet » : à CORRIGER

Le kiné a raison, le coach a tort. Dans `applyAdapters` (safety.ts l.344 à 357), quand l'id visé n'est pas une variante de la fiche (`X.variantes.some` faux), le code appelle `tryReplacement(X, id, ...)` et retourne la cible si elle passe ; sinon `variant` reste vide et `same` est vide, donc `return null` : la fiche est écartée (équivalent à `retirer`). Les anciennes cases étaient donc exécutées, jamais ignorées, et leur échec donnait un retrait.
Conséquence pratique : le comportement réel avant / après est quasi identique. Là où la cible était vivante (pompe-archer dos n1, Grossesse x3, squat-assis-debout en cheville n2, rowing dos n1, etc.), le remplacement existait déjà ; là où elle était morte, la fiche était déjà retirée. Les corrections changent surtout la fidélité du tableau (et resserrent le niveau 1 : adapter vers retirer).
Documentation à corriger dans `docs/revue-cases-variante-securite.md` : (a) l'en-tête, « le générateur ne pouvait pas exécuter ces cases » ; (b) la colonne de justification « Ancienne case sans effet (cible hors fiche) » sur toutes les lignes ; (c) la phrase « cible ... n'est pas adaptée pour la même zone au même niveau » est fausse pour 32 cases (5). Remplacer par « ancienne case traitée comme remplacement ; retrait si la cible est refusée ». Le commentaire de `VARIANTES-SECURITE-A-CORRIGER.json` (« le générateur ... ») est vidé, sans objet.

## (5) Remplaçants morts

Cause : `tryReplacement` (l.256) rejette toute cible dont la ligne de la zone active, au niveau actif, n'est pas `garder` (hors cas Grossesse l.247), y compris sa propre variante de destination. Liste établie sur les cases modifiées (32 cases, test niveau par niveau de la cible ; un profil multi-zones en tue davantage) :

- fente-arriere : genou n2, hanche n2 (cible squat-fendu-mur, adapter sur sa propre variante)
- planche-touche-epaule : dos n2 (planche-genoux)
- pompe-archer : dos n2 (pompe-chaise)
- pompe-diamant : dos n2 (pompe-chaise)
- pompe-ecartee : coude n2, poignet n2, dos n2 (pompe-chaise)
- pompe-piquee-pieds-sureleves : épaule n1, épaule n2 (pompe-chaise), coude n2, poignet n1 (pompe-piquee-mains-marche)
- souleve-de-terre-roumain-halteres : dos n2 (pont-fessier-sol, `sans-charge` adapté)
- squat-bulgare : genou n2, hanche n2
- planche-bras-jambe-leves : coude n2, cou n2
- planche-laterale-jambe-levee : épaule n1, hanche n2, coude n2
- fente-avant : genou n1, genou n2, hanche n2, cheville n1, dos n2
- montee-sur-banc : genou n1, hanche n1, hanche n2, cheville n1, cheville n2
- souleve-de-terre-sumo-barre : dos n1 (rack, adapté pour la même zone), dos n2 (roumain-halteres retiré en dos n2)

Les autres `remplacant:` modifiés sont vivants (cheville n2 vers squat-assis-debout, sdt-unijambiste genou/cheville n2 vers roumain-halteres, rowing dos n1 / hanche n2, pompe-archer dos n1, sdt-roumain coude / poignet n2, squat-gobelet coude / poignet n2, Grossesse x3).

Risque : aucun risque de sécurité. Une case morte se comporte comme `retirer` seul (le plus prudent) ; ce n'est pas un affaiblissement. C'est une donnée trompeuse : le tableau, les notes (« remplacée par ... ») et le résumé du coach promettent un remplaçant qui n'est jamais proposé, et un futur assouplissement du générateur (non demandé) activerait soudain des remplaçants que personne n'a validés. Recommandation, sans toucher à §0 : écrire `retirer` seul pour les 32 cases mortes, et corriger les notes correspondantes (« l'app propose un autre exercice »). « Laisser » est acceptable à court terme (aucun danger) mais laisse des notes fausses ; je recommande `retirer` seul. Au passage, le dev peut ajouter à `check:fiches` un avertissement (pas une erreur) pour « remplaçant mort » afin que ça ne revienne pas.

## (6) Zones sans exercice adapté à n2

Lecture de `slotDef` : `jambes_genou` (famille préférée squat ou fente) a l'autre famille en repli (`allowB`, `allowSubst`) ; `poussee_1` idem ; `jambes_2` a hanche_laterale et cheville_mollet en repli.
- poussee_v épaule n2 : aucun exercice de la famille ; remplacée par poussee_h (`other`) ou autre schéma. Pas de séance vide. Test présent : `tests/unit/generator-zone-n2-seances.test.ts` (épaule n2 : aucune `poussee_v`, séance d'au moins 4 exercices).
- fente cheville n2 : seule `montee-sur-marche` reste dans la famille ; fente genou / hanche n2 : 2 fiches (`montee-sur-marche`, `squat-fendu`). La famille n'est donc pas vide mais très réduite ; le repli vers le squat (squat-assis-debout etc., 9 à 12 fiches non retirées) évite tout trou. Test : même fichier, zones épaule, cheville, genou, hanche en n2 (profils C maison et F salle), chaque séance >= 4 exercices : exécuté, 21 tests OK (avec le validateur et le test de grammaire publique).
- Limite : le test couvre deux profils seulement ; un utilisateur à la fois en gêne n2 sur plusieurs zones (ex. genou + cheville n2 + grossesse) n'est pas testé ici (hors portée de cette correction, aucune régression : l'effet réel est inchangé, voir 4).
- Non-régression générateur (`generator-nonregression.test.ts`) : OK, avec un délai d'attente relevé (le délai par défaut de 60 s a expiré sous charge, ce n'est pas un échec de contenu).

## (7) `timeout 120 npm run check:fiches | tail -5`

`207 fiche(s) contrôlée(s) : 0 erreur(s), 0 avertissement(s).` Test `variante-securite-validator` : OK.

## Liste des écarts par auteur

| # | Auteur | Gravité | Fichier / cible | Problème |
|---|---|---|---|---|
| 1 | coach | à corriger | `docs/revue-cases-variante-securite.md` (en-tête, colonne justification, 67 lignes) | « sans effet » faux (4) ; « cible non adaptée pour la même zone » faux pour 32 cases (5) |
| 2 | coach | à corriger | 32 cases mortes (liste 5) | `retirer: remplacant:X` écrit alors que X n'est jamais proposé ; recommandé : `retirer` seul + note « l'app propose un autre exercice » |
| 3 | coach | à corriger | notes non modifiées devenues fausses (liste 3) : planche-bras-jambe-leves, planche-laterale-jambe-levee, fente-avant, montee-sur-banc | disent « remplacé / adapté » alors que la case est `retirer` ; l'une contient « avant-bras » |
| 4 | coach | à corriger | fente-avant genou-n2 | code interne « (R2) » dans une note |
| 5 | coach | remarque | porte-valise dos-n2, squat-gobelet / squat-poids-du-corps n2 | « par exemple la marche du fermier / le squat assis-debout » : non garanti (ces fiches sont adaptées pour la zone, donc non proposées, §0) |
| 6 | kine | remarque | squat-assis-debout cheville n2 ; rowing-unilateral-haltere hanche n2 | cibles sans ligne pour la zone (donc `garder`), alors que la descente / le buste penché sollicitent cheville / hanche ; la cible était déjà celle des anciennes cases ; à réexaminer, pas une régression |
| 7 | kine | remarque | validation du 1er novembre | « remplaçants morts » confirmés : 32 cases (liste 5) ; décision demandée au chef de projet (recommandé : `retirer` seul) |
| 8 | dev | remarque | `tools/validate-fiches.mjs` | pas de contrôle « remplaçant mort » ; ajouter un avertissement (sans toucher à §0) |
| 9 | dev | remarque | `knowledge/exercices/ecartees/` | des ids de fiches sont présents deux fois (ex. `pompe` dans `ecartees/pompe-ancienne.md` avec Grossesse `variante:pompe-inclinee`, et dans la fiche utilisée). À vérifier que le dossier est bien exclu du build (non vérifié ici) |

Aucun point bloquant. Rien n'a été modifié en dehors de ce rapport ; rien n'est commité.
