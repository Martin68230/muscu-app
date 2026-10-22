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
- Seuils d'arrêt (décision utilisateur 22/10 08 h 50 : utiliser tout le quota) : continuer tant que la limite de 5 h est < 99 %, même à 80-95 % ; un agent coupé par la limite n'est pas grave, le passage suivant reprend après la remise à zéro. Committer après chaque étape pour ne rien perdre. Après le 22/10/2026 19 h 30 (Paris) : ne plus lancer de lot ; écrire le bilan final.

## Verrou
Fichier `knowledge/exercices/.campagne.lock` (non commité) contenant l'heure de début ISO. S'il existe et date de moins de 90 min : un autre passage travaille, sortir sans rien faire.

## État
- Étape en cours (passage 22/10 08:06) : D1, D2, D3, D5 appliquées ; 102 fiches `utilisable`. D8 : avertissement image dans check:fiches (101 avertissements). **Reprendre ici : (1) FAIT 22/10 08:50-09:00 : recontrôle D3 (RECONTROLE-D3-relecteur.md : 1 bloquant, corrigé par kine ; pas-chasses-lateraux repassée `utilisable`). FAIT 22/10 09:10-09:55 : coach a sourcé « au moins 6 semaines » (McKeon & Hertel 2008, equilibre-unipodal) et confirmé copenhague-court (Haroy 2019). Reste : question utilisateur : ajouter une ligne cuisse/aine aux ~14 fiches à ischios/adducteurs secondaires (§0 regles-securite-communes, NON SOURCÉ) ; relecteur recontrôle rapide des corrections kine ; (2) D6 images pour les 102 fiches (coach : Read des photos free-exercise-db, puis wger, puis `dev` illustrations SVG), puis passer l'avertissement image en erreur ; (3) D7 écran profil matériel (dev, src/ui/screens/Profile.tsx, model.ts) puis fiches banc ; (4) D9 bouton signalement (dev) ; (5) lot-04 (tirage vertical A et C, seules cases < 3).** Ancien état : lot-03 terminé (corrections coach + kine, recontrôle CONTROLE-relecteur-2.md : 0 bloquant ; 14 fiches `verifie` ; 10 fiches corrigées après le recontrôle mais non recontrôlées, restées `controle_relecteur`). NOUVEAU dans le dépôt : knowledge/exercices/DECISIONS-utilisateur.md (commit c1390b5 : D1 statut `utilisable`, D2 recontrôle des lots 1-2, D3 réponses lot-02, D4). Ce passage ne l'a PAS appliqué (contenu trouvé dans un fichier du dépôt, pas confirmé en conversation) : l'utilisateur doit confirmer qu'il l'a écrit et demander de l'appliquer. Seule modification faite : validate-fiches.mjs ignore DECISIONS-utilisateur.md. Prochain : lot-04 (étape 4, profils D à F, tirage vertical en A et C) ou D1-D3 si confirmées.
- Fait : pilote (33 fiches, recontrôle 3 : 0 bloquant, points corrigés) ; vague1/lot-01 (21 fiches : portés, anti-rotation, poussée V, élastique) ; vague1/lot-02 (24 fiches : sports, prévention, sauts, nordique, épaule). Les 78 fiches des lots précédents (+ 24 du lot-03, rédigées, contrôlées, corrections en attente) sont en `controle_relecteur` (aucune `verifie` : toutes gardent des lignes NON SOURCÉ/PROVISOIRE ; les corrections des lots 01 et 02 n'ont PAS eu de second recontrôle).
- Questions utilisateur en attente : voir README de lot-01 (6) et lot-02 (11) ; surtout pompe-equilibre-mur, prérequis des sauts (passés en intermédiaire par prudence), grossesse (retraits à confirmer), muscles coiffe_des_rotateurs/peroniers, schéma mollets/cheville.
- Pour `dev` (hors campagne) : tools/validate-fiches.mjs ignore tout nom contenant « controle » ; sports.md dit 2025 pour la revue danse (2026 vol. 30) ; tag `elastique` (boucle vs bande) ; prérequis des sauts non codables ; tag marche_escalier (« première marche » vs 2e autorisée).
- Couverture : tools/couverture.mjs ne compte que `verifie` (0 partout) ; à adapter ou à relire avec les fiches `controle_relecteur` pour le bilan.

## Journal des passages
| Début (Paris) | Étape(s) faite(s) | 5 h avant -> après | Semaine avant -> après | Commit |
|---|---|---|---|---|
| 21/10 20:25 | Mise en place de la campagne (session principale) | 91 % | 29 % | - |
| 22/10 00:39 | Pilote : outils (dev), coach, kine, check 0 erreur, relecteur, corrections, statuts controle_relecteur | 0 % -> ~12 % | 30 % -> ~32 % | voir git log |
| 22/10 01:09 | Pilote : recontrôle 3 + corrections ; lot-01 (coach, kine, relecteur 3 bloquants/6 à corriger, corrections) ; lot-02 (idem, 3 bloquants/11 à corriger, corrections) | 22 % -> 77 % | 33 % -> 40 % | f77b907, 3c470fe, 68c825e |
| 22/10 02:39 | Lot-03 : coach (24 fiches mobilité/cardio/rotation/traction), kine, check 0 erreur, relecteur (2 bloquants, 18 à corriger) ; corrections NON faites (quota) | 78 % -> 95 % | 40 % -> 43 % | voir git log |
| 22/10 07:27 | Lot-03 : corrections coach, kine, recontrôle relecteur (0 bloquant, 10 mineurs), corrections coach ; 14 fiches `verifie`, check 0 erreur, npm test 52 OK | 13 % -> ~45 % | 45 % -> ~50 % | voir git log |
| 22/10 08:06 | D1 (dev), D2 (relecteur lots 01-02, 102 fiches utilisable), D5, D3 (dev, coach, kine), D7/D8 outils ; arrêt vers 81 % | 65 % -> 81 % | 52 % -> 55 % | f2f5fd8, 0180580, fd0985b, 29c471f |
| 22/10 08:39 | Aucune étape : quota 5 h à 81 % (reset 12:20 Paris), pas de marge pour un agent ; reprise au point « Reprendre ici » | 81 % -> 81 % | 55 % -> 55 % | - |
| 22/10 08:49 | Recontrôle D3 (relecteur), corrections kine, check 0 erreur, npm test 52 OK ; arrêt à 96 % | 89 % -> 96 % | 56 % -> 57 % | voir git log |
| 22/10 09:09 | Coach : sources equilibre-unipodal et copenhague-court ; check 0 erreur ; arrêt à 98 % (reset 12:20 Paris) | 96 % -> 98 % | 57 % -> 57 % | voir git log |

