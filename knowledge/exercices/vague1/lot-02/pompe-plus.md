---
id: pompe-plus
nom: Pompe plus (omoplates qui s'écartent)
schema: poussee_h
type: force
niveau_min: debutant
muscles_principaux: [dentele_anterieur]
muscles_secondaires: [pectoraux, triceps]
source_brouillon: []
statut: utilisable
couverture: substitut
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| pompe-plus-mur | Contre un mur | 1 | debutant | poids_du_corps, mur | Debout face au mur, mains à hauteur d'épaules, bras tendus. |
| pompe-plus-genoux | Sur les genoux | 2 | debutant | poids_du_corps, tapis | À quatre pattes, genoux au sol, bras tendus sous les épaules. |
| pompe-plus-sol | Planche, pieds au sol | 3 | intermediaire | poids_du_corps, tapis | En position de pompe, bras tendus, corps en ligne. |

## Consignes
1. Bras tendus, mains sous les épaules (ou à hauteur d'épaules au mur), corps bien droit.
2. Sans plier les coudes, laisse la poitrine descendre entre les épaules : les omoplates se rapprochent.
3. Pousse ensuite dans les mains pour écarter les omoplates et arrondir légèrement le haut du dos.
4. Le mouvement est petit : seules les omoplates bougent.
5. Recommence lentement.

## Points d'attention
- Les coudes restent tendus : ce n'est pas une pompe classique.
- Mouvement lent et contrôlé, sans à-coup.
- Aucune durée ni nombre donné (aucune valeur sourcée).

## Erreurs fréquentes
- Plier les coudes.
- Creuser le dos.
- Hausser les épaules vers les oreilles.

## Progression / régression
- plus-facile : pompe-mur
- plus-dur : pompe-sol

## Repères de dosage
Voir program-logic.md. Aucune valeur sourcée.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-22. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3). L'app a dix zones : cou, épaule, coude, poignet, dos, hanche, genou, cheville, cuisse (face arrière : ischios) et aine (adducteurs). Une gêne au tendon d'Achille se déclare sous « cheville ».

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | adapter: variante:pompe-plus-mur | adapter: variante:pompe-plus-mur | retirer |
| Poignet | adapter: variante:pompe-plus-mur | adapter: variante:pompe-plus-mur | retirer |
| Cou | garder | adapter: amplitude:tete-alignee | retirer |
| Dos | garder | adapter: variante:pompe-plus-mur | retirer |
| Genou | adapter: appui:coussin | adapter: variante:pompe-plus-mur | retirer: sans-zone:pompe-plus-mur |

**Notes**
- epaule-n1 : contre un mur, bras tendus.
- epaule-n2 : même variante ; aucune augmentation de difficulté (R2).
- poignet-n1 : contre un mur, mains à hauteur d'épaules.
- poignet-n2 : même variante ; aucune augmentation de difficulté (R2).
- cou-n2 : tête dans le prolongement du dos, regard vers le sol ou le mur ; aucune augmentation de difficulté (R2).
- dos-n2 : contre un mur.
- genou-n1 : coussin sous les genoux pour les variantes au sol.
- genou-n2 : contre un mur.
- genou-n3 : la variante contre le mur ne charge pas le genou.
- grossesse : contre un mur, bras tendus (G4 : appui au mur pour les pompes) ; respiration continue. Post-partum : G7.
- general : version plus douce : contre le mur.

**Grossesse** : adapter: variante:pompe-plus-mur
**Version plus douce** : pompe-plus-mur

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) à l'épaule, au poignet, au cou ou au bas du dos.
- Coudes qui plient, dos qui se creuse, épaules qui montent vers les oreilles : arrête la série.
- Fourmillements ou perte de force dans le bras ou la main : arrête (S2).
- Douleur qui dure, qui s'aggrave ou qui réveille la nuit, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2) ; ces signes n'ont pas à être « diagnostiqués » par toi.
- Si le réglage « enceinte / post-partum » est coché : saignement, perte de liquide, contractions, vertige, douleur ou gonflement d'un mollet, fuite d'urine ou pesanteur dans le bas-ventre : arrête et contacte ta sage-femme ou ton médecin (G6, G7) ; en cas de saignement, de perte des eaux ou de contractions régulières : urgence, voir U1.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
- aucune photo (aucune entrée libre trouvée pour ce mouvement)
- illustration : public/illustrations/pompe-plus.svg : affichable : oui (illustration originale de l'app)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Pompe « plus » : bras tendus, écartement des omoplates | aucune entrée free-exercise-db correspondante trouvée (recherche par nom, 22/10/2026) ; description de coach. Activité du dentelé antérieur : Ludewig PM et al., Am J Sports Med 2004;32:484, « Relative balance of serratus anterior and upper trapezius muscle activity during push-up exercises » https://pubmed.ncbi.nlm.nih.gov/14977678/ : la pompe plus donne la plus forte activation du dentelé antérieur (jusqu'à 123 % de la référence) et un rapport trapèze/dentelé bas | EMG sur 30 personnes (saines et avec légère gêne d'épaule) ; résumé lu via moteur de recherche (page PubMed bloquée), texte intégral non lu | 2026-10-22 | PROVISOIRE (activité musculaire, pas un effet sur les blessures) ; consigne de la fiche : NON SOURCÉ |
| Un programme d'épaule à l'échauffement (OSTRC), 3 fois par semaine, réduit les problèmes d'épaule chez des handballeurs d'élite (17 % contre 23 %) | Andersson et al., Br J Sports Med 2017;51:1073 https://bjsm.bmj.com/content/51/14/1073, repris dans knowledge/sports.md | essai randomisé en grappes, 660 handballeurs d'élite ; résumé lu à la rédaction de sports.md, non rouvert | 2026-10-21 | OK pour le hand ; extrapolation au volley et aux raquettes : PROVISOIRE ; que CET exercice soit dans le programme OSTRC : NON SOURCÉ (contenu détaillé non lu) |
| Échelons, niveaux, muscles et répartition principaux / secondaires | choix de coach (décision de format de l'utilisateur, 21/10/2026) | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-22 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-22 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://has-sante.fr/upload/docs/application/pdf/2019-04/fm_lombalgie_v2_2.pdf (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; HAS : fiche mémo PDF lue en entier le 2026-10-21 ; NICE : résumés seulement | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-22 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
