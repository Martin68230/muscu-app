# D24 b : statistiques locales sur la base Kaggle « 600K Fitness Exercise & Workout Program Dataset » (30/10/2026)

**Statut : NON SOURCÉ.** Base d'origine Boostcamp, licence ODbL, provenance et qualité inconnues (programmes d'utilisateurs, aucun contrôle de coach). Ces chiffres décrivent ce que les gens écrivent dans des programmes publics, pas ce qui est efficace ou sûr : ils ne remplacent aucune règle sourcée (knowledge/) et ne servent qu'à calibrer des choix prudents de `coach` (D25, D28).
**Cadre (autorisation de l'utilisateur) :** ZIP fourni par l'utilisateur (`Documents/Appli muscu/archive.zip`), CSV seulement, lu en flux par `tools/kaggle-stats.mjs` (code écrit par nous, aucune exécution de contenu, rien envoyé en ligne). Fichier résumé extrait hors dépôt (`donnees-externes/kaggle-600k/`), fichier détaillé (295 Mo) lu directement depuis le ZIP sans l'extraire. Aucune ligne de programme n'est copiée ici ni dans nos fiches : seulement des agrégats.

## Base
2 598 programmes (fichier résumé) ; 605 033 lignes d'exercices, 3 178 noms distincts (fichier détaillé). Matériel : salle complète 1 848, garage 561, maison 119, haltères seulement 69 → la base décrit surtout des gens en salle. Niveaux (étiquettes multiples) : intermédiaire 1 914, novice 1 283, avancé 848, débutant 737. Objectifs (étiquettes multiples) : bodybuilding 1 723, muscle et sculpture 936, powerbuilding 905, athlétisme 539, powerlifting 494, poids du corps 322.

## Chiffres utiles
- **Jours par semaine (semaine 1 du fichier détaillé)** : 4 jours 825 programmes, 5 jours 615, 3 jours 498, 6 jours 362, 7 jours 134, 2 jours 121, 1 jour 43. Dans les titres (17 % seulement lisibles) : corps entier 209, haut / bas 196, push / pull / legs 137.
- **Durée** : programmes médiane 8 semaines (75 % <= 12) ; séance médiane 60 min (de 40 à 90).
- **Exercices par séance** : médiane 6 (de 5 à 7, 90 % <= 9).
- **Séries** : médiane 3 par exercice. Combinaisons les plus fréquentes : 3x10, 3x12, 3x8, 2x10 (1x10 apparaît souvent : probable artefact de saisie).
- **Répétitions (hors durées)** : 9-12 dans 49 % des lignes, 6-8 dans 22 %, 13-15 dans 12 %, 1-5 dans 9 %, 16+ dans 7 %.
- **Cardio et mobilité** : environ 1,6 % des lignes d'exercices sont du cardio (mots-clés), 0,7 % de la mobilité / échauffement, 4,3 % sont notées en durée ; 6 % des programmes mentionnent le cardio, 3 % la mobilité, 5 % une semaine de décharge.

## Limites (à lire avant tout usage)
- Les objectifs sont des étiquettes multiples (un programme en porte plusieurs) : les distributions « par objectif » sont presque identiques entre objectifs et ne servent PAS à distinguer force / hypertrophie / cardio.
- Le nombre de séries par muscle et par semaine n'est lisible que dans 3 descriptions : inutilisable. Les jours par semaine du fichier résumé ne sont déduits que pour 17 % des programmes.
- Biais salle et culture bodybuilding ; peu de débutants sérieux ; aucun suivi de résultats ni de blessures ; texte libre non vérifié.
- Les noms d'exercices suivent la convention Boostcamp (« bench press (barbell) »).

## Exercices fréquents sans équivalent chez nous (`tools/kaggle-couverture.mjs`)
Sur les 150 exercices les plus fréquents (478 000 lignes), 47 % se retrouvent dans le jeu Hasan et 15 % dans une de nos fiches via la table D22 (borne basse : la passerelle par les noms est stricte, par exemple « plank » existe chez nous sous « planche »). Absents les plus fréquents : machines et poulies (leg extension, leg curl, leg press, lat pulldown, tirages poulie, pec deck, hack squat), curls variés (marteau, câble, pupitre), élévations latérales à la poulie, dips lestés, face pull, rowing T-bar, shrugs. Beaucoup relèvent de la salle et du matériel que le profil gère encore peu (tags `machine` et `poulie`). Pistes pour D23 vague 2 (fiches à rédiger par `coach`, jamais recopiées) : face pull élastique, curl marteau, élévations latérales haltères / élastique, extension / curl de jambes (machine, après Q10), dips lestés (après avis `kine`), shrugs haltères.

## Utilisation prévue
D25 (structure des programmes) et D28 (séance à la demande) peuvent s'en servir seulement comme ordres de grandeur affichés à `coach` ; toute valeur reprise dans le code passe par une règle de knowledge/ avec son vrai statut.
