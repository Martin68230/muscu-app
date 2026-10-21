# Catalogue d'exercices : structure, sources, plan de vérification (21/10/2026)

## 1. Structure : mouvements + variantes par matériel
Fichier : knowledge/exercise-library-draft.csv (généré par tools/build_library.py ; statistiques : knowledge/library-stats.json).
- **2 597 variantes** regroupées en **1 962 mouvements** (3 072 lignes brutes ; doublons exacts fusionnés ; puis 283 doublons sûrs supprimés : même nom une fois le matériel retiré + même matériel, en gardant la source la plus fiable : free-exercise-db > wger > maxwu ; liste dans exercise-library-removed-duplicates.csv).
- 368 lignes marquées « doublon_probable » (même mouvement + même matériel mais nom différent, ex. curl assis / debout) : à trancher par `coach`, car certaines sont de vraies variantes (ex. mollets assis = surtout le soléaire).
- Colonnes : mouvement_id, mouvement, variante, type (force / fonctionnel / gainage / mobilite_recup / cardio), schema_mouvement (deviné par mots-clés : 586 « a_classer »), materiel_tags (vocabulaire de equipment-taxonomy.md), salle_uniquement, niveau_source, groupe_source, muscles_source, source, licence, photo_reutilisable, alerte_nom (langue_a_verifier, nom_suspect, nom_avec_numero, doublon_probable), statut = brouillon_a_relire.
- Répartition par type (mots-clés) : force 2 223, fonctionnel 219, gainage 160, mobilité/récupération 196, cardio 82.
- Le regroupement en mouvements est automatique : il réunit bien les variantes de matériel (ex. pompe / pompe aux haltères ; soulevé de terre roumain barre / haltères) mais laisse encore des quasi-doublons et quelques regroupements faux : à corriger à la relecture.

## 2. Deux niveaux de bibliothèque
- **Niveau 1 « vérifié »** : seul niveau utilisé par le générateur. Fiche complète : nom français, consignes réécrites, points d'attention, muscles, schéma de mouvement, matériel, niveau, contre-indications par zone, échelle de progression/régression, photo (si disponible et libre). Relue par `coach` puis `kine`, contrôlée par `relecteur`.
  - **Échelons de difficulté (décision du 21/10/2026)** : les variantes qui changent la difficulté restent dans UNE fiche, rangées de la plus facile à la plus dure. Le tableau des variantes a les colonnes `id variante | nom | echelon | niveau | materiel_tags | installation`. `echelon` : entier, 1 = plus facile ; `niveau` : debutant / intermediaire / avance ; l'identifiant de variante est stable et sert au générateur pour faire progresser (échelon suivant quand la double progression est atteinte, load-calibration.md). Les variantes qui ne changent que le matériel ou la charge ajoutée (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon ; un nouvel échelon n'existe que si le geste devient plus dur à charge égale (levier, hauteur d'appui, unilatéral, appui retiré). `niveau_min` de la fiche = le niveau de l'échelon le plus facile. Tout changement de niveau par rapport à la source est tracé dans la section Sources.
  - **Photo : la consigne prime (règle 12 de CLAUDE.md)** : une photo qui contredit la consigne n'est pas affichée. La section Photo indique, pour chaque image, « affichable : oui / non (raison) / à vérifier ». Seules les images « oui » sont affichées ; « à vérifier » = non affichée tant qu'elle n'a pas été regardée. Sont aussi « non » : matériel spécialisé (règle 23), marque d'un tiers visible, autre variante ou installation que celle de la fiche (sauf mention « montré avec… » décidée par l'utilisateur).
- **Niveau 2 « brouillon »** : consultable dans la bibliothèque avec la mention « non vérifié », jamais proposé automatiquement.
- **Vagues de vérification** (la taille vise la personnalisation par matériel, pas un chiffre rond) :
  - Vague 1 : pour CHAQUE profil de matériel A à F (equipment-taxonomy.md) et CHAQUE grand schéma (squat, charnière, fente, poussée H/V, tirage H/V, gainage, porté, rotation/anti-rotation, saut, mobilité, cardio), au moins 3 mouvements vérifiés avec leurs variantes. Ordre de grandeur : ~150-200 mouvements, ~500-800 variantes. Objectif : que personne ne reçoive de programme « au rabais » à cause de son matériel.
  - Vague 2 : ~400 mouvements (familles de sports, prévention, accessoires, plus de mobilité).
  - Vague 3 : le reste, au fil de l'eau ; les doublons et fiches inutilisables sont supprimés.

## 3. Sources et licences (vérifiées dans les fichiers)
| Base | Lignes | Licence | Photos | Remarque |
|---|---|---|---|---|
| free-exercise-db | 876 | Unlicense (domaine public) | oui, libres | fiches courtes |
| maxwu/exercises-dataset | 1 324 | MIT déclaré par un tiers | NON (droits Gym visual) | format identique à ExerciseDB (base commerciale) : provenance douteuse. Décision utilisateur : garder pour un usage privé. Comme le dépôt est public, les consignes finales sont RÉÉCRITES par `coach` (pas de copier-coller), en s'aidant de ses consignes françaises comme brouillon. |
| wger (fixtures GitHub) | 872 noms anglais (70 traductions françaises) | par fiche : CC-BY-SA 3.0 (n°1), CC-BY-SA 4.0 (n°2), CC0 (n°3), CC-BY 4.0 (n°4), ODbL (n°5) | licence par image, à vérifier | garder l'auteur ; contenu CC-BY-SA rediffusé sous la même licence ; page « crédits » dans l'app |

## 4. Manques prioritaires (mesurés : equipment-taxonomy.md §4)
Portés à la maison (sac à dos, bidons, suitcase, waiter, bear hug), anti-rotation (Pallof élastique, dead bug, bird dog), poussée verticale au poids du corps (pompes piquées, progressions), tirage vertical sans barre (élastique ancré), burpee, bear crawl, saut en longueur, navettes, mobilité thoracique/hanches/chevilles, FIFA 11+, nordique et sa progression, programme d'épaule OSTRC, réceptions de saut, équilibre unipodal (sports.md).

## 5. Sécurité
Snatch, clean, jerk : avancés seulement ; alternatives : swing de kettlebell, goblet squat, soulevé de terre, sauts, lancers. Portés : soulever et poser jambes fléchies, dos neutre (source de blog : PROVISOIRE). Strongman et matériel spécialisé : jamais à la maison. Objets du quotidien (chaise, table, sac) : avertissement de stabilité.
