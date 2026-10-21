# Campagne fiches (21/10/2026 -> remise à zéro hebdomadaire du 22/10/2026 à 19 h 59, heure de Paris)

Décision utilisateur (21/10/2026) : jusqu'à la remise à zéro hebdomadaire, faire un maximum de fiches avec le quota de la semaine. Ensuite : retour à l'appli et à ses fonctionnalités.
Moteur : tâche planifiée « campagne-fiches » (toutes les 30 min, nouvelle conversation à chaque fois). Ce fichier est sa mémoire : chaque passage le lit, fait l'étape suivante, puis le met à jour.

## Règles
- Ordre par lot : `coach` -> `kine` (jamais en même temps sur les mêmes fichiers) -> `npm run check:fiches` à 0 erreur -> `relecteur` (lancé à neuf) -> corrections des bloquants -> statut -> commit + push. Tout sur Sonnet.
- Statut final d'une fiche : `verifie` si relecteur ne laisse ni bloquant ni « à corriger » ; sinon `controle_relecteur` (avec la liste des réserves dans le README du lot).
- Lots de 20 à 30 mouvements dans knowledge/exercices/vague1/lot-NN/ (puis vague2/). Un README.md par lot (liste, couverture, journal) et le rapport CONTROLE-relecteur.md du lot.
- Ordre de couverture (exercise-catalog.md §2, equipment-taxonomy.md §4) : objectif >= 3 mouvements `verifie` par profil de matériel (A à F) et par grand schéma (squat, charnière, fente, poussée H/V, tirage H/V, gainage, porté, rotation/anti-rotation, saut, mobilité, cardio).
  1. Trous : portés à la maison, anti-rotation, poussée verticale au poids du corps, tirage horizontal et vertical à l'élastique (rowing élastique, tirage vertical élastique ancré haut).
  2. Familles de sports (sports.md : foot, danse, volley, raquettes) et prévention (FIFA 11+, nordique, épaule OSTRC, réceptions, équilibre).
  3. Mobilité (thoracique, hanches, chevilles).
  4. Compléter les cases encore sous 3 (tableau de couverture), profil par profil jusqu'à F (salle).
  5. Vague 2.
- Seuils d'arrêt : limite de 5 h >= 92 % -> ne pas lancer de nouvel agent, finir proprement (commit de ce qui est cohérent) et mettre à jour ce fichier. Après le 22/10/2026 19 h 30 (Paris) : ne plus lancer de lot ; écrire le bilan final.

## Verrou
Fichier `knowledge/exercices/.campagne.lock` (non commité) contenant l'heure de début ISO. S'il existe et date de moins de 90 min : un autre passage travaille, sortir sans rien faire.

## État
- Étape en cours : **pilote terminé (étapes 0 à 5)**. Les 33 fiches pilote sont en `controle_relecteur` (aucune `verifie`) : le recontrôle (RECONTROLE-2-relecteur.md) a eu 1 bloquant et 24 « à corriger », tous traités par kine puis coach, SANS 3e recontrôle.
- Reste du pilote (petits points non résolus, à traiter en tête du lot-01 par coach/kine) : planche-touche-epaule (contradiction note `general` / variantes échelons 2-3), montee-sur-marche l.84-85, notes dos-n2 de rowing/sdt/squat-gobelet/tirage-w qui ne correspondent pas aux cases, développé épaules (« pompe-piquee » en plus-facile). 9 fiches `a-creer` citées (bird-dog-jambe-seule, bird-dog-pause, dead-bug-jambes-seules, planche-laterale-jambe-levee, pompe-un-bras, pompe-equilibre-mur, pont-fessier-une-jambe, rowing-elastique, assis-debout-mains-cuisses) ; WebP manquants.
- Couverture : toutes les cases A-F x schéma à 0 `verifie` (outil tools/couverture.mjs OK). Pour atteindre `verifie`, un recontrôle relecteur du pilote est utile (le faire en 1re étape du passage suivant, puis statut).
- Question utilisateur : grossesse/post-partum = réglage de profil facultatif (pas de verrou) ; voir pilote/README.md.
- Prochain lot : vague1/lot-01 (trous), après recontrôle du pilote.

## Journal des passages
| Début (Paris) | Étape(s) faite(s) | 5 h avant -> après | Semaine avant -> après | Commit |
|---|---|---|---|---|
| 21/10 20:25 | Mise en place de la campagne (session principale) | 91 % | 29 % | - |
| 22/10 00:39 | Pilote : outils (dev), coach, kine, check 0 erreur, relecteur, corrections, statuts controle_relecteur | 0 % -> ~12 % | 30 % -> ~32 % | voir git log |
