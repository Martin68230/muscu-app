# Recontrôle `relecteur` du lot 05 (banc), 22/10/2026

Recontrôle rapide à neuf, limité aux points corrigés depuis CONTROLE-relecteur.md. Je n'ai rien corrigé. Vérifié : `git diff` du dossier, relecture des fiches modifiées, `npm run check:fiches` (127 fiches, 0 erreur, 0 avertissement), pilote `montee-sur-marche`, liste des zones de knowledge/format-fiches.md §4.1, existence des WebP, vue de Lying_Dumbbell_Tricep_Extension-1.webp.

## Synthèse
- **Bloquants : 0.**
- **À corriger : 1** (A1, dips : la photo montre l'échelon 3 et reste `oui`).
- Mineurs : 4 (N1 à N4, voir plus bas) ; les mineurs M5 à M10 n'étaient pas à recontrôler et restent ouverts.

## Points corrigés
| Point | Résultat | Détail |
|---|---|---|
| A1 dips, photo | **PAS OK** (à corriger) | Les deux photos restent `affichable : oui`, avec une mention « ici jambes tendues sur une box : commence genoux pliés, pieds au sol » et la précision « variante dips-banc-pieds-surleves ». Ce n'est pas la correction proposée (`non` hors échelon 3) : la photo contredit toujours la consigne des échelons 1 et 2 (règle 12 : elle n'est pas affichée). Le README précise que la liaison photo-variante n'est pas codée, donc la sécurité repose sur l'affichage de la mention par l'écran. Comme c'est l'échelon le plus dur (épaule en extension) sur une fiche débutant, je maintiens « à corriger ». Pour lever le point : décision de l'utilisateur pour accepter le mécanisme « photo + mention obligatoire », ou `non` pour les échelons 1 et 2 / illustration. Passe en bloquant si l'écran ne peut pas afficher la mention. |
| A2 développé épaules, photo | OK avec réserve | Même mécanisme (mention « la photo montre developpe-epaules-banc-sans-dossier ; pour l'échelon 1, dos appuyé »). Ici la photo montre une variante réelle et plus facile à ne pas confondre (pas de risque aggravé), donc accepté si la mention est affichée. Même réserve de principe que A1. |
| A3 écarté, photo 1 | OK | `non` ; photo 0 et banc incliné gardés ; WebP de la photo 1 signalé inutilisé. |
| A4 développé couché, photo | OK avec réserve | Photos rattachées à la prise classique (`developpe-couche-halteres-classique`), mention donnée pour la prise neutre. Il n'existe toujours aucune image de la prise neutre : accepté parce que la mention dit comment la tenir. |
| A5 extension couchée, photo | OK | Photo 0 `non` (bras inclinés, haltère près du visage). Photo 1 revue : bras presque verticaux, légèrement inclinés vers l'arrière, haltères au-dessus de la tête ; `oui` avec mention « garde-les verticaux, haltères loin du visage » : cohérent. |
| A6 montée sur banc | OK | Hanche n1 et Cheville n1 : `adapter: variante:montee-sur-marche-poids-du-corps`, comme le pilote ; notes hanche-n1 et cheville-n1 ajoutées. Genou n2 `retirer` (plus prudent que la marche) et note réécrite sans l'affirmation fausse (banc plus haut, marche non proposée à ce niveau) : cohérente avec Genou n1 et Hanche n2. Cheville n2 `adapter: appui:main-sur-support` (valeur de la liste fermée, `check:fiches` passe). Ligne Cuisse (n1 `garder`, n2 `retirer`, n3 `retirer`) et note ajoutées, signe d'arrêt « arrière de la cuisse » ajouté. |
| A7 squat-gobelet-banc | OK | Lignes Coude et Poignet ajoutées : n2 `adapter: variante:squat-banc-sans-charge` (variante existante dans la fiche), n3 `retirer: sans-zone:squat-banc-sans-charge` (forme conforme au §4). Notes ajoutées, alignées sur le pilote. Ligne Aine déjà présente et signe d'arrêt « aine » présent. |
| M1 README | OK en partie | En-tête (statut `complete_kine`, 0 avertissement, WebP et SVG faits) et journal corrigés. Restes périmés : voir N1. |
| M2 sources sans haltère | OK | dips-banc-triceps et montee-sur-banc : la ligne dit « aucun haltère dans cet exercice ». (La ligne identique « haltère fixe de préférence » de squat-gobelet-banc est légitime : il y a des haltères.) |
| M3 « vertige, même léger » | OK | Ajouté (formulation identique, renvoi C4) dans elevation-laterale-assis-halteres, extension-triceps-assis-halteres, extension-triceps-couche-halteres, hip-thrust-banc (qui avait « vertige en te relevant du sol », remplacé). |
| M4 poignet | OK en partie | Ligne Poignet (n1 `garder`, n2 `adapter: charge:legere`, n3 `retirer`), note et signe d'arrêt ajoutés dans elevation-laterale-assis-halteres et extension-triceps-assis-halteres : cohérent avec l'extension couchée. Curl incliné et rowing (prise neutre déjà proposée, Poignet n1 `garder`) inchangés : remarque de cohérence, pas un défaut. |
| Lignes cuisse / aine / vertige / poignet / coude | OK | Zones écrites dans la liste fermée ; une ligne par zone ; aucune contradiction avec les pilotes. |

## Nouveaux problèmes (tous mineurs)
- **N1. README encore partiellement périmé** : titre de la section sécurité « reste A6, A7 et mineurs » et dernière ligne du journal « Non touchés : A6, A7, M3 à M10 » alors que A6, A7, M3 et M4 sont faits ; tableau : ecarte « 4 photos » (3 utilisables) et extension couchée « 2 photos » (1 utilisable) ; la ligne « Écarts photo / consigne » du README décrit l'état après A1-A5 correctement.
- **N2. Mentions « WebP à créer » restantes** dans les lignes Photo des fiches non retouchées (developpe-couche-halteres, ecarte, extension couchée...) alors que les WebP existent : sans effet, à nettoyer.
- **N3. Extension couchée** : le signe d'arrêt dit « reste assis » alors que la personne est allongée (formulation commune C4 reprise telle quelle) ; sans gravité.
- **N4. Montée sur banc** : Cheville n2 garde le banc avec appui main alors que Hanche n2 renvoie à la marche ; cohérent avec le pilote seulement en partie (la marche pilote est neutre à son propre niveau 2). Choix prudent, à noter.

## Statut proposé par fiche
Règle : `utilisable` si 0 bloquant et réserves limitées à des choix prudents NON SOURCÉ ; sinon `complete_kine`. Aucune fiche n'est `verifie` (lignes PROVISOIRE / NON SOURCÉ).

| Fiche | Bloquant | À corriger | Statut proposé |
|---|---|---|---|
| curl-incline-halteres | 0 | 0 | utilisable |
| developpe-couche-halteres | 0 | 0 | utilisable (réserve : mention de la prise neutre à afficher) |
| developpe-epaules-assis-dossier-incline | 0 | 0 | utilisable (réserve : mention échelon 2 à afficher) |
| developpe-incline-halteres | 0 | 0 | utilisable |
| dips-banc-triceps | 0 | A1 | complete_kine |
| ecarte-couche-halteres | 0 | 0 | utilisable |
| elevation-laterale-assis-halteres | 0 | 0 | utilisable |
| extension-triceps-assis-halteres | 0 | 0 | utilisable |
| extension-triceps-couche-halteres | 0 | 0 | utilisable |
| hip-thrust-banc | 0 | 0 | utilisable |
| montee-sur-banc | 0 | 0 | utilisable |
| rowing-poitrine-appuyee-banc | 0 | 0 | utilisable |
| squat-gobelet-banc | 0 | 0 | utilisable |

12 fiches `utilisable`, 1 reste `complete_kine` (dips). Je n'ai modifié aucun statut.
