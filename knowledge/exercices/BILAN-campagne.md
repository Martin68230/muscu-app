# Bilan de la campagne fiches (21/10/2026 -> 22/10/2026 19 h 59 Paris)

Rédigé le 23/10/2026 au premier passage après la remise à zéro hebdomadaire (limite 5 h 0 %, semaine 0 %).

## Fiches par statut (comptage des fichiers de knowledge/exercices)
- `verifie` : 13 ; `utilisable` : 125 ; `complete_kine` : 7 (releve-mollets-halteres, clam-coquille, dips-banc-triceps, etc. : recontrôle ou image en attente). Aucune `controle_relecteur` restante.
- Total pris en compte par le tableau de couverture : 138 fiches (utilisable + verifie), `npm run check:fiches` à 0 erreur, `npm test` 86 OK au dernier passage.

## Couverture par profil (A à F) et schéma
Objectif >= 3 mouvements par case : **0 case sous 3 sur 90**. Détail complet : `node tools/couverture.mjs`.
Cases les plus justes (3 à 4) : tirage vertical en A (3) et C (4), squat/charnière en A et B (4).
Cases les plus riches : mobilité (26), tirage horizontal en F (18).

## Images
- Lignes « affichable » dans les fiches : 229 oui, 52 non, 3 à vérifier (comptage par ligne d'image, pas par fiche).
- Photos free-exercise-db en WebP + ~70 illustrations SVG faites pour l'app (à relire par coach/kine). clam-coquille n'a pas d'image (moteur SVG ne rend pas la pose).

## Consommation par lot (journal CAMPAGNE.md)
Pilote ~12 % de 5 h ; lots 01-02 ~55 % ; lot-03 ~17 % puis ~32 % (corrections) ; D1-D5 ~16 % ; D6 + lot-04 ~70 % ; D9/D7 ~15 % ; lot-05 ~12 % + ~16 % ; lot-06 ~75 %. Semaine : 29 % -> ~84 %.

## Décisions
Appliquées : D1 à D10 (statut `utilisable`, recontrôles, réponses lot-02, validation des 102 fiches, images partout, écran matériel, signalement, lot-cou). Restantes : brancher filterByNeck et ReportButton quand le générateur existera ; D6-bis (wger, images déposées dans images-a-trouver/).

## Trous restants
- Lot-07 prévu : barre/rack, kettlebell, sangles, poulie/machines (profils D et F à enrichir) ; vague 2 non commencée.
- Recontrôle de releve-mollets-halteres (grossesse modifiée par kine) ; dips-banc-triceps (image échelons 1-2) ; image de clam-coquille.

## Points ouverts pour l'utilisateur
- Ajouter une ligne cuisse/aine aux ~14 fiches à ischios/adducteurs secondaires (NON SOURCÉ).
- Relecture humaine des illustrations SVG ; vérification sur iPhone du rendu des images.
- Décider s'il faut relancer la campagne (lot-07, vague 2) ou passer au générateur de programmes.
