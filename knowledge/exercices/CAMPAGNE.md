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
- Étape en cours : **pilote / étape 0 (outils)**
- Étapes du pilote restantes : 0) `dev` étend check:fiches à tous les lots (knowledge/exercices/** sauf ecartees/, ids uniques sur l'ensemble) et écrit tools/couverture.mjs (tableau profil A-F x schéma des fiches `verifie`, profils définis dans knowledge/materiel-tags.json ou equipment-taxonomy.md §4) ; 1) coach corrige ses écarts au format strict ; 2) kine : retrait du dépistage (Q-AAP+ et 5 questions) dans regles-securite-communes.md (décision utilisateur : pas de questionnaire ni de verrou, on garde l'avertissement au lancement, les signes d'arrêt et le profil blessures facultatif), section sécurité de montee-sur-marche alignée sur la décision « haltères autorisés sur la 1re ou 2e marche avec précautions », sécurité de pompe (5 échelons), pompe-diamant, pompe-ecartee, pompe-archer, cases au format strict ; 3) check:fiches à 0 ; 4) relecteur ; 5) statuts, commit, push.
- Prochain lot : vague1/lot-01 (trous).

## Journal des passages
| Début (Paris) | Étape(s) faite(s) | 5 h avant -> après | Semaine avant -> après | Commit |
|---|---|---|---|---|
| 21/10 20:25 | Mise en place de la campagne (session principale) | 91 % | 29 % | - |
