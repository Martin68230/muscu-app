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

## Pesée et courbe
7. « Poids et courbe » : saisie d'une pesée (date, poids avec virgule), phrase d'interprétation, courbe lisible en clair et en sombre, tableau des pesées, bouton « Supprimer ».

## Général
8. Fermer l'app, verrouiller l'écran, rouvrir : les données sont toujours là (stockage local). Mode avion : tout fonctionne hors ligne.
9. Profil > « Tout supprimer » efface aussi la nutrition (l'export JSON contient les tables nutrition).

Pas encore dans l'app : plan de repas, recettes, liste de courses, export pour une IA, allergies et préférences, compléments (lots suivants ; leurs calculs lisent déjà la même cible finale, `src/nutrition/final-needs.ts`).
