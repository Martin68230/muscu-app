# Design et fonctions visibles : audit et à vérifier sur l'iPhone (14/11/2026)

## Audit (captures WebKit 375x667 sombre et 430x932 clair : `npx playwright test design-audit`, `SHOT=apres` pour les captures « après »)
Classés par impact. Corrigés = [x].
1. [x] Accueil : la carte « Séance du jour » ne se distinguait pas des autres cartes → bordure d'accent, nom de la séance en grand.
2. [x] Accueil : régularité en texte seulement → pastilles (séances faites / prévues) au-dessus du texte (le texte reste pour la lecture d'écran).
3. [x] Accueil : aucun accès aux progrès → bouton « Ma progression » à côté de « Voir mon historique » (deux boutons côte à côte).
4. [x] Bibliothèque : filtres sur 3 lignes qui repoussent la liste → pastilles un peu plus compactes (cibles toujours >= 44 px).
5. [ ] Accueil : le bouton fixe « Voir la séance » recouvre la fin du contenu pendant le défilement (voulu : zone du pouce) ; à juger sur l'iPhone.
6. [ ] « Repos (1) » : titre peu parlant (texte du kiné, non modifié ici).
7. [ ] Bilan : écran « Calcul du bilan… » vide quelques instants (pas de squelette).
8. [ ] Calendrier : légende de 7 symboles dense (lisible mais chargée).
9. [ ] Accueil : 4 boutons secondaires empilés de même poids visuel (Créer une séance, Noter du sport, Modifier mon profil).

## Fonction construite : « Ma progression » (phase 5 du plan)
Accueil > carte Régularité > « Ma progression » (`#/progression`). Séries de travail par semaine (8 semaines, barres SVG) ; par exercice (2 séances propres minimum) : record, évolution depuis la première séance, courbe. Séries avec douleur, échauffements, séances importées, abandonnées ou avec symptôme ignorées ; grossesse / post-partum : aucun chiffre (même règle que le détail des séances) ; « pas un avis médical » présent. Code : `src/session/progress-view.ts` (pur, testé : `tests/unit/progress-view.test.ts`), `src/ui/screens/Progress.tsx`.
Propositions suivantes (par utilité) : 1) poids lissé dans l'écran Progression (données de la nutrition) ; 2) volume par muscle sur 4 semaines, relié à la carte des zones ; 3) records partagés avec les amis (phase 6, jamais par défaut).

## À vérifier sur l'iPhone
- Accueil : carte de séance bien visible en clair et en sombre ; pastilles de régularité lisibles ; deux boutons côte à côte sans texte coupé (SE, 375 px).
- « Ma progression » : barres lisibles, retour à l'accueil, aucun défilement horizontal ; après 2 séances avec un même exercice : record et « Voir la courbe ».
- Bibliothèque : filtres sur 2 lignes, tape facile.
- Rien d'autre n'a changé dans la séance en cours.

## Lots 2 à 4 (14/11/2026, branche claude/design-lot2)
- Lecteur : segments d'avancement (un par exercice) sous l'en-tête, pastilles des séries de l'exercice sous « Série n sur N ».
- Carte des zones : l'accueil garde la carte du cycle (« c'est cette carte qui dit si une zone est couverte ») ; la vue « par type de séance » et l'aperçu de séance portent la mention « cette séance, cette semaine : une zone grise n'est pas forcément un oubli ».
- Bibliothèque : champ de recherche collé en haut pendant le défilement, bouton « Tout afficher » quand rien n'est trouvé ; retour visuel à l'appui sur boutons et pastilles. Calendrier : inchangé (lisible aux captures), seul le retour à l'appui s'applique.
- Fonction : graphiques de charges / volume et records existent déjà (Ma progression), le poids lissé existe dans Nutrition ; ajout d'un lien « Courbe de poids » dans Ma progression. Le rappel de la séance du jour n'est pas construit : une notification iPhone demande un serveur de notifications (hors règle gratuit / local) ; l'accueil montre déjà la séance du jour.
### À vérifier sur l'iPhone
- Séance : segments et pastilles lisibles, rien ne déborde à 375 px, minuteur de repos inchangé.
- Accueil > « Voir par type de séance » : la mention est claire ; aperçu de séance : texte d'aide sous le titre de la carte.
- Bibliothèque : la recherche reste visible en faisant défiler, le clavier n'est pas gêné ; « Tout afficher » après une recherche sans résultat.

## Lot 3 (14/11/2026, branche claude/design-lot3)
- Séance : sous « Dernière fois », rappel « Ton record : X kg » (meilleure charge d'une séance propre : sans douleur, ni abandon ni symptôme, hors import ; au moins 2 séances ; jamais pendant la grossesse / le post-partum ni sur le cardio). C'est une information, jamais un objectif de charge : la progression reste décidée par les règles existantes.
- Accueil : pastille sur la carte de séance, « Prévue aujourd'hui » (jour prévu) ou « Prochaine séance, quand tu veux » (pas de pression).
- États vides : Calendrier sans séance et Ma progression sans exercice proposent « Voir ma prochaine séance » (retour à l'accueil). Le poids (Nutrition) n'a pas été touché : écran d'une autre session.
- Graphiques de charges / volume par exercice : déjà dans Ma progression (courbe par exercice, séries par semaine) ; aucun nouveau graphique ajouté dans ce lot.
- Pas touché : section « Images de mes exercices » du Profil ni le point d'accroche de la fiche (import-gymvisual).
### À vérifier sur l'iPhone
- Une séance avec un exercice déjà fait 2 fois : « Ton record » à côté de « Dernière fois », ligne qui ne déborde pas à 375 px.
- Accueil : la pastille change selon le jour prévu ; calendrier et progression vides : bouton visible et retour à l'accueil.

## Lot 1 et 2 (15/11/2026, branche claude/design-lot4-3bbdbf) : graphiques et records
- Ma progression : « Volume par muscle » (8 groupes + Tout, bascule Séries / Charge soulevée, 8 semaines), valeur au toucher sur chaque barre et chaque point de courbe (ligne sous le graphique, aussi au clavier). « Mes records » : liste (récents d'abord, pastille « Récent » 14 jours), un appui = historique des records battus ; courbes par exercice conservées. Mêmes exclusions qu'avant (douleur, échauffement, abandon / symptôme, import) ; grossesse / post-partum : aucun chiffre. Le tonnage ne compte que les séries chargées.
- Lot 3 : vérifié dans le code, l'accueil montre la carte du cycle, la vue « par type de séance » porte déjà la mention « cette séance, cette semaine » : rien changé.
- Lot 4 (cohérence Nutrition / Profil / Bibliothèque) : NON fait dans cette session.
- Captures WebKit : tests/screens/progression-graphiques.spec.ts (sert un `vite preview` ; le port 4190 est refusé par WebKit, utiliser 4183).
### À vérifier sur l'iPhone
- Ma progression : puces de muscles (2 lignes), bascule Séries / Charge soulevée, toucher d'une barre : valeur affichée sous le graphique ; aucun défilement horizontal.
- Liste de records : ligne >= 44 px, nom long qui passe à la ligne, historique au toucher ; courbe : toucher d'un point.

## Lot 4 (15/11/2026) : cohérence des écrans ajoutés
- Nutrition : bouton « Retour » au même style que les autres écrans (bordé, pas un lien) ; chargement annoncé (role status).
- Profil > Images : le compteur « N images importées sur M » vient en premier, l'estimation de place est repliée (« Place disponible ») ; l'avertissement de licence reste visible, inchangé.
- Bibliothèque : déjà revue au lot 2 (recherche collée, état vide « Aucun exercice trouvé »). Captures de contrôle : tests/screens/coherence-ecrans.spec.ts (les écrans défilent dans un conteneur : captures de la fenêtre seulement ; vérification faite surtout dans le code).
### À vérifier sur l'iPhone
- Nutrition : bouton retour de même style que Ma progression. Profil > Images : compteur lisible en haut, « Place disponible » se déplie, boutons espacés de 8 px, rien ne déborde à 375 px.

## Lot 5 (20/11/2026, branche design-lot5)
- Bibliothèque : repli « Filtres : muscle, niveau, matériel » (3 listes, côte à côte dès 400 px, ouvert si un filtre est actif, « Retirer les filtres ») ; « Intermédiaire » = débutant + intermédiaire ; « Sans matériel » = corps, tapis, mur, chaise. Logique : src/data/library-filters.ts (test unitaire).
- Accueil : carte discrète « Pesée de la semaine » seulement si la nutrition est configurée et sans pesée depuis 7 jours (src/session/weigh-reminder.ts).
- Déjà en place, vérifié dans le code : carte du cycle par défaut + vue par type de séance avec mention ; calendrier / progression : états vides.
- Non fait : revue de l'écran de séance (minuteur de repos, boutons) ; GIF dans la liste (vignettes déjà affichées quand une image existe).
### À vérifier sur l'iPhone
- Bibliothèque : le repli Filtres s'ouvre, les 3 listes tiennent sur une ligne en 430 px et s'empilent en 375 px, aucun texte coupé, compteur et « Retirer les filtres » (44 px).
- Accueil : la carte de pesée apparaît après 7 jours sans pesée (nutrition configurée), ouvre Nutrition, disparaît après une pesée.
