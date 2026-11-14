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
