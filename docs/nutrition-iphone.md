# Nutrition : à vérifier sur l'iPhone (lot « besoins, pesée, courbe », 13/11/2026)

Captures WebKit faites (375x667 et 430x932, clair et sombre) : `screenshots/<projet>/nutrition-*.png` (non versionnées). À vérifier à la main sur l'iPhone :
1. Bibliothèque : la carte « Nutrition » est la première ligne, un appui ouvre l'écran ; le bouton « Retour à la bibliothèque » revient à la liste.
2. Questionnaire : les champs année, taille, poids ouvrent le clavier numérique, sans zoom automatique de Safari (saisie 16 px) ; le choix « Un homme » / « Une femme » affiche ou masque les questions de grossesse.
3. Réponse « Oui » ou « Je préfère ne pas répondre » à une question de santé : l'écran dit « Repères seulement » et n'affiche aucun chiffre de calories.
4. « Mes besoins » : kcal, protéines, glucides, lipides, tableau des 7 jours ; sans programme actif tous les jours sont « Repos » (message affiché) ; avec un programme, les jours de séance ont plus de glucides.
5. « Poids et courbe » : saisie d'une pesée (date, poids à la virgule), phrase d'interprétation, courbe lisible en mode sombre et clair, tableau des pesées, bouton « Supprimer ».
6. Écran verrouillé puis rouvert, ou app fermée : les données sont toujours là (IndexedDB local). Mode avion : tout fonctionne hors ligne.
7. Profil > « Tout supprimer » efface aussi la nutrition (export JSON : les tables nutrition y figurent).
Pas encore dans l'app : plan de repas, recettes, liste de courses (lots suivants).
