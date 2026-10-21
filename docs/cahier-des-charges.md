# Cahier des charges (idées tirées des captures de l'app de référence ; ne rien copier d'elle : images, textes, marque)

## Navigation (simple)
Barre du bas : **Accueil** (séance du jour, prochaine séance, régularité), **Calendrier**, **Bibliothèque** (exercices, nutrition sportive, composition des aliments, encyclopédie), **Amis** (fil + réactions, sans messagerie), **Profil**. Pas d'onglet Messages.

## Choix du programme
Plans par objectif (muscle général, bras, pectoraux, dos, épaules, jambes, fessiers, abdos/gainage, perte de gras, force, conditionnement type cross-training, corps entier 45 min, mobilité, fonctionnel) et par sport (foot, danse, volley, raquettes, regroupés en familles : knowledge/sports.md). Objectifs combinables et classés dans le profil (knowledge/goal-resolver.md).

## Démarrage rapide et programmes types (inspiré de l'app de référence, en mieux)
L'app de référence propose des programmes PRÉ-FAITS : on choisit un objectif (muscle général, bras, poitrine, dos, épaules, abdos, force, cross-fit, corps entier 45 min...), puis le lieu (salle / chez soi), puis le niveau (novice, débutant, avancé, expert, pro, avec une phrase claire : « moins d'un an, entraînements irréguliers »...), puis le matériel (seulement 2 choix : équipement de base / aucun), et on obtient un plan fixe (ex. 36 jours, 3 séances/semaine). Ce parcours en cartes est très simple : on le garde. Ce qui change chez nous :
- **Même parcours en 4-5 cartes** (objectif -> lieu -> niveau -> matériel -> jours/semaine), une carte par écran, gros visuels, retour en arrière facile ; on peut le finir en moins d'une minute.
- **Matériel** : choix rapide par profils (sans matériel / élastiques / haltères / maison équipée / salle, voir knowledge/equipment-taxonomy.md) + bouton « préciser » pour cocher le détail (poids des haltères, barre de traction, roue abdos...).
- **Niveaux** décrits par une phrase concrète comme dans l'app de référence (définitions à valider par `coach`) ; le niveau sert surtout à la prudence et au choix des variantes, pas à changer toute la logique (ACSM 2026 : mêmes bases pour tous).
- **Programmes types** : une bibliothèque de modèles (« Corps entier 3 jours », « Haut/bas 4 jours », « Bras et épaules en plus », « Perte de gras », « Spécial foot », « Danse : sauts et mobilité »...) qui fixent la STRUCTURE (répartition, objectif, durée en semaines). Le générateur les REMPLIT avec les bonnes variantes selon le matériel, le niveau et les blessures de la personne, puis les fait progresser. Deux personnes qui choisissent le même programme type n'ont donc pas exactement les mêmes exercices.
- **Pas de programme « hommes » / « femmes »** : les mêmes règles valent pour tous ; seuls les objectifs et préférences changent.
- **Pas de compléments « recommandés »** ni de textes marketing non sourcés : la fiche d'un programme dit ce qu'il contient (jours, durée, objectif, matériel nécessaire) et pourquoi.
- **« Créer mon propre programme »** : accès au planificateur complet pour ceux qui veulent tout régler.

## Planificateur
Entrées : jours/semaine, jours bloqués, durée ou « sans limite », objectifs classés, niveau, matériel (implicite compris), sports pratiqués, blessures.
Sorties : répartition conseillée et expliquée (ex. 3 jours -> corps entier), séances ordonnées avec la bonne variante selon le matériel, supersets, repos, durée estimée, progression, avertissements (choix sous-optimal, schéma impossible avec le matériel + substitut). Replanification des séances manquées.

## Lecteur de séance
Fiche par exercice : photo, nom, consignes, points d'attention, répétitions cibles, minuteur de repos (ou « superset, pas de repos »), séries x/y, saisie des répétitions, de la charge et de la réserve (« combien t'en restait-il ? »), commentaire par série, historique et graphique, alternative si le matériel est occupé ou si ça fait mal. Supersets, circuits, minuteurs de travail. Écran allumé. Mini-chatbot dans un coin si l'IA est activée.

## Bilan de séance
Temps total, repos moyen, calories ESTIMÉES, répétitions faites/prévues, records, comparaison avec la fois précédente.

## Tableau de bord
Régularité, calendrier du mois (% réalisé), volume par muscle (carte du corps), charges, poids lissé.

## Alimentation
Plan de repas généré (repas horodatés, 2-3 choix, kcal, grammes), préférences et allergies, compléments ajoutés par l'utilisateur (comptés, avec alertes), liste de courses, substitutions.

## Profil
Poids (suivi), objectifs classés, matériel (avec poids disponibles des haltères), sports, blessures (zone + niveau), préférences alimentaires, partage avec les amis (par type de donnée), interrupteur IA + mode, export et suppression des données.

## Amis
Demande d'ami par lien ou code ; fil des séances terminées (selon ce que chacun partage), réactions, séries de jours, défis hebdomadaires de régularité. Pas de messagerie, pas de classement de poids.
