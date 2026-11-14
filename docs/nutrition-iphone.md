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

## Pesée et courbe
12. « Poids et courbe » : saisie d'une pesée (date, poids avec virgule), phrase d'interprétation, courbe lisible en clair et en sombre, tableau des pesées, bouton « Supprimer ».

## Général
13. Fermer l'app, verrouiller l'écran, rouvrir : les données sont toujours là (stockage local). Mode avion : tout fonctionne hors ligne.
14. Profil > « Tout supprimer » efface aussi la nutrition (l'export JSON contient les tables nutrition).

Pas encore dans l'app : export pour une IA ou pour deux personnes, compléments, carte à l'Accueil. Le plan et les courses lisent la même cible finale (`src/nutrition/final-needs.ts`).
