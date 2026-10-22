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
- Étape en cours : **lot-03 : corrections à faire** (coach/kine selon le rapport vague1/lot-03/CONTROLE-relecteur.md : 2 bloquants = `cercles-de-bras` (source Shoulder_Circles -> Arm_Circles) et `etirement-pectoraux-mur` (source inadaptée) ; 18 « à corriger »). Reprendre ainsi : coach corrige contenu/sources/photos, kine corrige les cases de sécurité incohérentes (cercles-de-cheville, etirement-flechisseurs-hanche, accroupi-profond-tenu, cercles-de-bras, boxe-dans-le-vide, traction-barre), `npm run check:fiches` à 0, puis statut `verifie` pour les fiches sans écart (8 déjà possibles : rotation-thoracique-assise, grenouille-hanches, etirement-fessiers-figure-4, mountain-climbers, marche-rapide-intervalles, pas-chasses-lateraux, rotation-bucheron, mobilite-poignets), npm test, commit, push. Ensuite lot-04 (étape 4 : cases encore < 3, profils D à F ; trou tirage vertical en A et C).
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
