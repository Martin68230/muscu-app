# Phase 2 : « je m'entraîne », critères de fini (23/10/2026)

Jalon (plan de construction) : tu t'entraînes avec l'app pendant 2 semaines et tu notes ce qui gêne.
Communs à chaque fonctionnalité : tests automatiques verts, `npm run check:fiches` à 0 erreur, captures WebKit 375x667 et 430x932 en sombre et en clair (CLAUDE.md règle 31), déploiement sur GitHub Pages, liste de ce qu'il faut vérifier sur l'iPhone, un commit par fonctionnalité. Modèle : Sonnet, sauf F2 et F3 (règles du générateur : Opus).

## F0. Données des fiches pour l'app
- Un script de construction transforme les fiches `utilisable` et `verifie` (et elles seules) en un fichier JSON statique de l'app (id, nom, schéma, niveau, muscles, échelons et variantes avec leurs tags, consignes, points d'attention, images affichables, cases de sécurité, ligne grossesse, `doux_pour`).
- Fini quand : le JSON est régénéré à chaque build, une fiche `complete_kine` ou `brouillon_coach` n'y apparaît jamais (test), et seules les images affichables y sont citées (test).

## F1. Profil minimal (parcours en cartes)
- Une carte par écran, retour en arrière facile : jours par semaine, jours bloqués, durée de séance (ou « sans limite »), lieu (maison / salle), matériel (écran Matériel déjà fait), niveau (phrases concrètes validées par `coach`), objectif principal, blessures (écran déjà fait, facultatif).
- Fini quand : on termine le parcours en moins d'une minute ; tout est enregistré dans IndexedDB et modifiable depuis Profil ; 2 ou 3 jours proposés en v1 (1 ou 4-6 jours : message clair « arrive dans une prochaine version », pas de programme faux) ; tests du parcours et de l'enregistrement ; captures de chaque carte.

## F2. Règles du générateur v1 (knowledge/, Opus)
- Fichier knowledge/generateur-v1.md rédigé par `coach` et `kine`, contrôlé par `relecteur` : séance corps entier pour 2-3 jours ; schémas à placer dans chaque séance et leur ordre ; séries, répétitions, repos et réserve cible par niveau ; supersets antagonistes ; échauffement ; durée estimée ; étalonnage de la première séance (load-calibration.md) ; choix de la variante (matériel entièrement dans le profil, niveau, cases de sécurité des blessures, filtre cou `doux_pour`) ; substitut et message quand un schéma est impossible ; explication de 2 lignes.
- Fini quand : chaque valeur chiffrée a une source et un statut ; rien de PROVISOIRE ou NON SOURCÉ n'est utilisé sans être validé par `coach`/`kine` et contrôlé par `relecteur` (CLAUDE.md règle 10) ; 0 point bloquant de `relecteur`.

## F3. Générateur v1 (code, Opus)
- Fonction pure et déterministe : profil + fiches -> programme (séances, exercices, variantes, séries, répétitions, repos, supersets, durée estimée, avertissements, explication).
- Fini quand les tests prouvent, pour les profils de matériel A à F, maison et salle, 2 et 3 jours, les 3 niveaux :
  - seules des fiches `utilisable` ou `verifie` sont utilisées ;
  - chaque variante a tout son matériel dans le profil ;
  - une blessure de niveau 3 retire les exercices de la zone, les niveaux 1-2 appliquent la case (garder / adapter / retirer) ;
  - zone cou gênée : exercices doux du lot cou proposés (`filterByNeck`) ;
  - chaque grand muscle est travaillé au moins 2 fois par semaine, ou l'avertissement V-MSG-FREQ s'affiche (séances courtes de 20-30 min, 2 jours, matériel ou blessure ; décision D15 : pas de durée minimale) ;
  - la durée estimée reste dans la durée choisie ;
  - un schéma impossible avec le matériel donne le meilleur substitut et un message ;
  - jamais d'exercice technique pour un débutant ni de matériel spécialisé à la maison.

## F4. Fiche d'exercice
- Écran d'une fiche (depuis la Bibliothèque et depuis la séance) : image(s), nom, consignes, points d'attention, signes d'arrêt, échelons ; bouton ⋯ « Signaler un problème » (ReportButton déjà fait).
- Fini quand : la Bibliothèque liste les fiches utilisables avec une recherche simple ; les fiches du brouillon restent marquées « non vérifié » ; captures.

## F5. Lecteur de séance
- Une carte par exercice : image, consignes courtes, répétitions cibles, série x/y, saisie des répétitions, de la charge et de la réserve (« combien t'en restait-il ? ») avec gros boutons +/- et clavier numérique, minuteur de repos ou « superset, pas de repos », « passer le repos », « série faite », bouton « ça fait mal » (pas de progression, conseil de consulter si ça persiste, alternative plus douce), alternative si le matériel est occupé, bouton ⋯.
- Minuteurs calculés sur l'heure réelle, recalculés au retour de l'arrière-plan ; écran allumé (Wake Lock) ; son débloqué par l'appui sur « Commencer la séance » ; rien qui promet une alarme écran verrouillé.
- Fini quand : tests du minuteur avec une horloge simulée (y compris retour d'arrière-plan) et des supersets ; la séance reprend après fermeture de l'app ; tout fonctionne hors-ligne ; zones tactiles >= 44 px, minuteur lisible à 1 m ; captures de chaque état (exercice, repos, superset, saisie).

## F6. Bilan de séance
- Temps total, repos moyen, répétitions faites / prévues, comparaison avec la fois précédente, records simples. Pas de calories en v1 (valeur encore PROVISOIRE dans architecture.md).
- Fini quand : le bilan est enregistré, tests des calculs, captures.

## F7. Historique et accueil
- Accueil : séance du jour ou prochaine séance avec un bouton « Commencer » ; régularité de la semaine.
- Historique : liste des séances faites, détail d'une séance ; le Calendrier marque les jours faits.
- Fini quand : tests, captures, et une séance complète faite de bout en bout sur l'iPhone par l'utilisateur.

## Ordre de travail
1. F2 (règles, Opus) en parallèle de F0 et F1 (code, Sonnet), car ils ne touchent pas les mêmes fichiers.
2. F3 (générateur, Opus) une fois F2 contrôlé.
3. F4 puis F5, F6, F7 (Sonnet).
