---
id: fente-laterale
nom: Fente latérale
schema: fente
type: force
niveau_min: debutant
muscles_principaux: [quadriceps, adducteurs]
muscles_secondaires: [fessiers, ischios]
source_brouillon: []
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| fente-laterale-courte | Petite amplitude, poids du corps | 1 | debutant | poids_du_corps | Pieds largeur de hanches, espace dégagé sur les côtés. |
| fente-laterale-complete | Amplitude complète, poids du corps | 2 | intermediaire | poids_du_corps | Même installation ; pas large sur le côté, hanche qui descend plus bas. |
| fente-laterale-haltere | Amplitude complète, haltère devant la poitrine | 2 | intermediaire | halteres | Même installation ; un haltère tenu contre la poitrine, comme pour un gobelet. |

## Consignes
1. Debout, pieds largeur de hanches, orteils vers l'avant.
2. Fais un grand pas sur le côté et fléchis la jambe du côté du pas, en reculant les fesses.
3. L'autre jambe reste tendue, pied à plat ; le genou fléchi reste dans l'axe du pied.
4. Pousse dans le pied du pas pour revenir au centre.
5. Fais toutes les répétitions d'un côté, puis de l'autre, ou alterne.

## Points d'attention
- Buste droit, regard devant.
- Genou dans l'axe du pied, qui ne rentre pas.
- L'amplitude se règle par la longueur du pas ; aucune valeur sourcée.

## Erreurs fréquentes
- Genou qui rentre.
- Talon qui décolle.
- Buste qui plonge vers l'avant.

## Progression / régression
- plus-facile : squat-sumo-poids-du-corps
- plus-dur : aucun

## Repères de dosage
Voir program-logic.md. Aucune valeur sourcée.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-22. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3). L'app a dix zones : cou, épaule, coude, poignet, dos, hanche, genou, cheville, cuisse (face arrière : ischios) et aine (adducteurs). Une gêne au tendon d'Achille se déclare sous « cheville ».

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Genou | adapter: variante:fente-laterale-courte | adapter: variante:squat-assis-debout | retirer |
| Hanche | adapter: variante:fente-laterale-courte | retirer: remplacant:squat-assis-debout | retirer |
| Cheville | adapter: variante:fente-laterale-courte | adapter: variante:squat-assis-debout | retirer |
| Dos | adapter: variante:fente-laterale-courte | adapter: variante:squat-assis-debout | retirer |
| Aine | adapter: variante:fente-laterale-courte | retirer: remplacant:squat-assis-debout | retirer |
| Cuisse | adapter: variante:fente-laterale-courte | adapter: variante:squat-assis-debout | retirer |

**Notes**
- genou-n1 : petite amplitude, poids du corps (sans haltère).
- genou-n2 : squat assis-debout ; aucune augmentation de difficulté (R2).
- hanche-n1 : petite amplitude, poids du corps.
- hanche-n2 : fente latérale retirée (adducteurs, pas large) ; remplacée par le squat assis-debout.
- cheville-n1 : petite amplitude, poids du corps.
- cheville-n2 : squat assis-debout.
- dos-n1 : petite amplitude, poids du corps (sans haltère).
- dos-n2 : squat assis-debout.
- aine-n1 : petite amplitude, poids du corps. NON SOURCÉ (choix prudent de `kine`).
- aine-n2 : fente latérale retirée (pas large, adducteurs étirés) ; remplacée par le squat assis-debout.
- cuisse-n1 : petite amplitude, poids du corps (les ischios sont sollicités en second). NON SOURCÉ.
- cuisse-n2 : squat assis-debout ; aucune augmentation de difficulté (R2).
- grossesse : retirée par prudence : pas large, équilibre sur un côté, adducteurs (G4 classe les fentes en « adapter » ; ici l'option la plus prudente est retenue pour la fente large) ; remplacée par le squat assis-debout. Post-partum : G7 (pas d'impact, sans effet ici).
- general : cases au moins aussi restrictives que le squat sumo, plus facile. Version plus douce : le squat sumo au poids du corps.

**Grossesse** : retirer: remplacant:squat-assis-debout
**Version plus douce** : squat-sumo-poids-du-corps

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) au genou, à la hanche, à l'aine, à la cheville ou au bas du dos.
- Genou qui rentre, talon qui décolle, buste qui plonge : arrête la série.
- Tiraillement net à l'intérieur de la cuisse ou à l'aine : arrêt.
- Douleur qui dure, qui s'aggrave ou qui réveille la nuit, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2) ; ces signes n'ont pas à être « diagnostiqués » par toi.
- Si le réglage « enceinte / post-partum » est coché : saignement, perte de liquide, contractions, vertige, douleur ou gonflement d'un mollet, fuite d'urine ou pesanteur dans le bas-ventre : arrête et contacte ta sage-femme ou ton médecin (G6, G7) ; en cas de saignement, de perte des eaux ou de contractions régulières : urgence, voir U1.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Haltère (échelon 2) : contre la poitrine, fixe de préférence, sinon disques serrés et vérifiés avant chaque série (prudence de `kine`, NON SOURCÉ).
- Sol antidérapant, espace dégagé sur les côtés (R8).
- Si l'objet bouge, glisse ou grince : arrêt, et l'objet n'est plus utilisé (R8).

## Photo
- aucune photo (aucune entrée libre trouvée pour ce mouvement)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Fente latérale (pas large sur le côté) | aucune entrée free-exercise-db correspondante trouvée (recherche par nom, 22/10/2026) ; description de coach | - | - | NON SOURCÉ |
| Le FIFA 11+ entier réduit les blessures hanche/aine de 41 % (Thorborg 2017), sans détail par exercice ; l'effet de CET exercice sur l'aine ou la hanche n'est pas établi | knowledge/sports.md (résumé de Thorborg 2017, non rouvert) | méta-analyse (programme entier, pas cet exercice) | 2026-10-21 | programme entier : OK (cité par sports.md) ; effet de cet exercice sur l'aine ou la hanche : NON SOURCÉ |
| Échelons, niveaux, muscles et répartition principaux / secondaires | choix de coach (décision de format de l'utilisateur, 21/10/2026) | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-22 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-22 | NON SOURCÉ (extrapolation, à valider) |
| Zones cuisse (ischios) et aine (adducteurs) ajoutées par la décision D3 ; tendon d'Achille rangé sous cheville faute de zone dédiée | choix de conception de `kine` (les zones de l'app sont cou, épaule, coude, poignet, dos, hanche, genou, cheville, cuisse et aine depuis la décision D3 du 22/10/2026) | - | 2026-10-22 | NON SOURCÉ (conception) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://has-sante.fr/upload/docs/application/pdf/2019-04/fm_lombalgie_v2_2.pdf (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; HAS : fiche mémo PDF lue en entier le 2026-10-21 ; NICE : résumés seulement | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-22 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
