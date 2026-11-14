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
