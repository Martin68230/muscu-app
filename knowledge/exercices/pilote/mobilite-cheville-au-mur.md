---
id: mobilite-cheville-au-mur
nom: Mobilité de cheville genou au mur
schema: mobilite
type: mobilite_recup
niveau_min: debutant
muscles_principaux: [mollets]
muscles_secondaires: []
source_brouillon: [M0063]
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| cheville-mur-debout | Debout, pied face au mur | 1 | debutant | poids_du_corps, mur | Debout face au mur, un pied devant à quelques centimètres du mur, mains au mur. |
| cheville-mur-genou-au-sol | Un genou au sol | 1 | debutant | poids_du_corps, mur, tapis | En fente, genou arrière sur un tapis, pied avant face au mur. |

## Consignes
1. Pied avant face au mur, talon bien au sol.
2. Avance le genou vers le mur, dans l'axe du deuxième orteil.
3. Va jusqu'à ce que le talon veuille décoller, sans le laisser partir.
4. Reviens, et répète en rythme lent.
5. Si le genou touche le mur facilement, recule un peu le pied.

## Points d'attention
- Le talon reste collé au sol.
- Le genou avance droit, sans rentrer vers l'intérieur.
- Mouvement doux, sans à-coups.
- Gêne d'étirement acceptable, pas de douleur.

## Erreurs fréquentes
- Talon qui décolle.
- Genou qui part vers l'intérieur.
- Voûte du pied qui s'écrase.

## Progression / régression
**mobilite-cheville-au-mur** (pied proche du mur -> pied plus loin)

## Repères de dosage
Voir program-logic.md (échauffement : à sourcer, §9).

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Chaque case contient un seul choix : `garder` (exercice tel quel), `adapter : <action précise>` (`variante:<id>`, `charge:légère`, `sans-charge`, `amplitude:...`, `appui:...`) ou `retirer` (avec `remplaçant` ou `sans-zone:<id>` si la fiche en nomme un) ; vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Cheville | garder | adapter : amplitude:pied plus près du mur, petite amplitude | retirer |
| Genou | garder | adapter : variante:cheville-mur-debout, amplitude:pied proche du mur | retirer |

**Version plus douce** : `cheville-mur-debout`, pied proche du mur.

**Grossesse** (G1 à G8 de regles-securite-communes.md ; avis du médecin ou de la sage-femme avant tout programme) : garder. Post-partum : G7.

**Signes qui doivent faire arrêter**
- Pincement ou douleur à l'avant de la cheville : n'insiste pas.
- Douleur au genou qui avance.
- Douleur au talon ou au mollet qui augmente.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
Aucune photo affichable (affichable : sans objet). « Ankle_Circles » est un autre exercice.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Mouvement | Brouillon M0063 (wger « ankle dorsiflexion rocks », schéma a_classer) : prouve seulement que le mouvement existe ; page wger non lue | base d'exercices | 2026-10-21 | NON SOURCÉ |
| Consignes (genou vers le mur, talon au sol) | rédigées par coach | pratique courante | 2026-10-21 | NON SOURCÉ |
| Muscles (mollets) | rédigé par coach | - | - | NON SOURCÉ |
| Utilité pour le squat et les réceptions de saut | exercise-catalog.md §4 (manque mobilité chevilles) ; aucune étude lue | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-21 | R1, R2, R3, R7, R8 : NON SOURCÉ ; R4, R5, R6, R9 (partie), R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
