# Nutrition : à vérifier sur l'iPhone (mis à jour le 14/11/2026)

Captures WebKit faites (375x667 et 430x932, clair et sombre) : `screenshots/<projet>/nutrition-*.png` (non versionnées). À vérifier à la main sur l'iPhone :

## Entrée et questionnaire
1. Bibliothèque : la carte « Nutrition » est la première ligne ; un appui ouvre l'écran ; « Retour à la bibliothèque » revient à la liste.
2. Questionnaire : année, taille et poids ouvrent le clavier numérique, sans zoom automatique de Safari (saisie 16 px) ; « Un homme » / « Une femme » affiche ou masque les questions de grossesse. Si l'enregistrement échoue, un message rouge apparaît (le bouton ne reste jamais sans effet).

## « Mes besoins » (onglet par défaut)
3. Carte « Aujourd'hui » : calories, protéines, glucides, lipides du jour, type de jour (repos, séance, jour lourd, intense), eau conseillée.
4. Carte « Ma journée moyenne » : la valeur finale, le rythme de poids visé (kg par semaine) ou « stable », la mention « pas un avis médical », et « Comment c'est calculé » (se déplie : besoin, plancher, écart, cible finale).
5. Carte « Ma semaine » : 7 jours, le jour d'aujourd'hui est surligné ; sans programme actif tous les jours sont « Repos » (message affiché) ; avec un programme, les jours de séance ont plus de glucides.
6. Si l'app ne peut pas calculer : le titre « Pourquoi je n'affiche pas de chiffres » liste chaque motif (sexe non précisé, année de naissance, taille, poids, IMC, réponses « oui » ou « préfère ne pas répondre ») en distinguant « À compléter » et « À voir avec un professionnel » ; le bouton « Compléter mes informations » ramène au questionnaire déjà rempli ; aucun chiffre n'est affiché.

## Semaine (plan de repas et courses)
7. Onglet « Semaine » : choisir « Cette semaine » ou « Semaine prochaine » ; « Générer ma semaine » construit les 7 jours d'un coup à partir de tes besoins de chaque jour ; « Régénérer » tire un autre plan.
8. « Repas, allergies et préférences » (se déplie) : pastilles L M M J V S D pour le petit-déjeuner et le goûter, un appui par jour pour les en-cas (0, 1 ou 2), « le même petit-déjeuner toute la semaine », allergènes (14), régime, matériel, temps de cuisine, optimiser les courses. Les pastilles se touchent facilement (44 px).
9. Chaque repas se déplie : kcal, macros, allergènes, ingrédients en grammes, étapes. Les barres maison s'affichent en pièces ; « À préparer en lot » indique le nombre de barres de la semaine.
10. Courses : classées par rayon, quantités de la semaine, unités d'achat (œufs, paquets), « sert à N repas », cases à cocher qui restent cochées en rouvrant l'app, bouton « Copier la liste ».
11. Allergie cochée (par exemple le lait) puis « Régénérer » : plus aucune recette avec cet allergène ; si aucune recette ne convient à un repas, le message le dit au lieu de proposer autre chose. Rappel affiché : vérifier les étiquettes.

### Goûter ajouté automatiquement (14/11/2026)
11 bis. Profil à gros besoins (par exemple 95 kg, « Prendre du muscle ») : « Générer ma semaine » ajoute un goûter, puis un en-cas, aux jours où il manque plus de 150 kcal ; ils portent la mention « (ajouté pour ta cible) » et se déplient comme les autres repas (recette, grammes, étapes). Dans « Repas, allergies et préférences », la case « Ajouter un goûter ou un en-cas quand il manque plus de 150 kcal » est cochée par défaut ; décochée puis « Régénérer » : plus aucun ajout.
11 ter. Les portions des repas principaux ne dépassent pas +30 % ; la ligne du jour montre « cible X kcal · prévu Y kcal » : l'écart doit être petit (moins de 150 kcal). Si un manque subsiste (filtres stricts : allergies, 15 min de cuisine...), une phrase « Il manque X kcal pour atteindre ta cible ce jour-là » l'explique ; jamais de repas au-dessus de ta cible du jour.
11 quater. Courses : les goûters et en-cas ajoutés sont comptés avec le reste, par rayon, en paquets (barres : « boîte de 6 barres », yaourts grecs : « pot », pain au lait : « paquet de 10 »).

## Pesée et courbe
12. « Poids et courbe » : saisie d'une pesée (date, poids avec virgule), phrase d'interprétation, courbe lisible en clair et en sombre, tableau des pesées, bouton « Supprimer ».

## Général
13. Fermer l'app, verrouiller l'écran, rouvrir : les données sont toujours là (stockage local). Mode avion : tout fonctionne hors ligne.
14. Profil > « Tout supprimer » efface aussi la nutrition (l'export JSON contient les tables nutrition).

Pas encore dans l'app : export pour une IA ou pour deux personnes, compléments, carte à l'Accueil. Le plan et les courses lisent la même cible finale (`src/nutrition/final-needs.ts`).

## Semaine validée, calendrier, changements (24/11/2026, SCHEMA_VERSION 6)
À vérifier à la main sur l'iPhone (captures WebKit faites : `screenshots/<projet>/nutrition-semaine-*.png`, 375x667 et 430x932, clair et sombre) :
15. Onglet Semaine : « Générer ma semaine », puis quitter l'écran, fermer l'app, rouvrir : la MÊME semaine est là (jamais régénérée sans demande). « Régénérer ma semaine » demande une confirmation (« Oui, régénérer » / « Garder ma semaine »).
16. Avant de générer : « Préférences rapides » (se déplie) : exclure un aliment, imposer un repas (choisir le jour, le repas, une recette ; il est placé à la génération s'il respecte allergies et régime, puis verrouillé).
17. Chaque repas : appui sur le nom = détail ; bouton « ⋯ » (ou appui long) = menu : « Changer ce repas » (3 idées équivalentes en calories et protéines, mêmes filtres d'allergies et de régime, « Voir 3 autres »), « Changer un aliment » (choisir l'aliment, puis un équivalent ; allergènes affichés ; « Remettre … »), « Verrouiller ». Les kcal du jour et la liste de courses se recalculent aussitôt.
18. « Annuler le dernier changement » (un niveau) ; « Verrouiller lundi » verrouille tous les repas du jour ; après « Régénérer », les repas verrouillés restent.
19. « Valider la semaine » (grisé tant qu'un repas ne respecte plus les allergies / le régime, ou qu'un jour est sous le plancher) : la semaine apparaît au calendrier. « Rouvrir pour tout modifier » la remet en brouillon.
20. Si on coche une allergie après coup : les repas concernés sont marqués « À changer » (jamais détaillés), la liste de courses et l'export reviennent une fois corrigé.
21. Calendrier : un point sous les jours qui ont des repas ; toucher UN JOUR (passé, aujourd'hui ou futur) ouvre la fiche de la journée : navigation « jour précédent / suivant », séance prévue (nom, durée, exercices, « Voir / démarrer la séance »), repas (kcal et protéines, total vs ta cible du jour), « Changer ce repas ». Semaine pas encore validée : « Plan proposé, à valider ».
22. Repas du jour (Accueil et fiche du jour) : « Fait », « Pas fait », « Autre chose » (note + kcal facultatif) en un appui ; le total « mangé » se met à jour.
23. Nutrition > Historique : liste des semaines validées (repas faits, moyennes), détail par jour, courses de la semaine. Profil > « Tout supprimer » efface aussi plans et journal ; l'export JSON les contient.

## Repas au resto, repas sautés, tableau « Quels repas je prends ? » (24/11/2026)
À vérifier à la main sur l'iPhone (captures WebKit : `screenshots/<projet>/nutrition-semaine-01-*`, `07b-resto`, `07c-resto-fait`) :
24. Onglet Semaine > « Avant de générer » : tableau 7 jours x 4 repas (petit-déj, déjeuner, goûter, dîner), cases de 44 px ; raccourcis « Tous les repas, tous les jours », « Pas de petit-déj en semaine », « Resto le samedi soir », « Pas de goûter ». Un repas décoché n'est pas planifié ; ta cible du jour passe sur les autres (un seul repas principal ce jour-là : portion jusqu'à x1,75). Le choix est gardé pour les semaines suivantes.
25. Fiche d'un jour (calendrier) ou menu « ⋯ » d'un repas : « Où je mange ce repas ? » : « À la maison », « Au restaurant ou à l'extérieur » (léger / normal / copieux avec une estimation en kcal, ou ta propre estimation), « Je saute ce repas », « Déjà fait différemment ». Effet limité à CE jour ; le repas affiche « Resto · environ X kcal (estimation) » ou « Repas sauté », les autres repas du jour s'ajustent (x0,5 à x1,3), la liste de courses perd les ingrédients du repas (tes coches restent), « Annuler le dernier changement » remet tout. Si le jour passe sous le plancher de sécurité ou s'écarte de la cible, un message le dit.
