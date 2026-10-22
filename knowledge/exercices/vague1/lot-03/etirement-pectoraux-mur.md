---
id: etirement-pectoraux-mur
nom: Étirement des pectoraux contre le mur
schema: mobilite
type: mobilite_recup
niveau_min: debutant
muscles_principaux: [pectoraux]
muscles_secondaires: [deltoides_anterieurs, biceps]
source_brouillon: []
statut: verifie
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| etirement-pectoraux-bras-bas | Bras un peu sous l'épaule | 1 | debutant | mur | Debout à côté du mur, avant-bras ou main contre le mur, coude un peu sous la hauteur de l'épaule. |
| etirement-pectoraux-bras-epaule | Bras à hauteur d'épaule | 2 | debutant | mur | Même installation, coude plié à angle droit à hauteur d'épaule. |

## Consignes
1. Debout à côté d'un mur, pose l'avant-bras ou la main contre le mur, coude plié ou tendu.
2. Tourne doucement le buste dans le sens opposé au bras, pieds fixes.
3. Arrête-toi à la première tension à l'avant de l'épaule ou de la poitrine.
4. Respire calmement, reviens, fais l'autre côté.

## Points d'attention
- Le haut du bras ne dépasse pas la hauteur de l'épaule : on cherche une tension de poitrine, pas une douleur d'épaule.
- Épaules basses.
- Aucune durée ni nombre donné (aucune valeur sourcée).

## Erreurs fréquentes
- Hausser l'épaule.
- Cambrer le bas du dos.
- Pousser trop fort en fin de course.

## Progression / régression
- plus-facile : aucun
- plus-dur : aucun

## Repères de dosage
Voir program-logic.md et load-calibration.md. Aucune valeur propre à ce mouvement.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-22. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3). L'app n'a pas de zone « aine », « cuisse » ni « tendon d'Achille » : une gêne à l'aine se déclare sous « hanche », à l'arrière de la cuisse sous « hanche » ou « genou », au tendon d'Achille sous « cheville ».

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | adapter: variante:etirement-pectoraux-bras-bas | retirer | retirer |
| Coude | garder | adapter: variante:etirement-pectoraux-bras-bas | retirer |
| Cou | garder | adapter: variante:etirement-pectoraux-bras-bas | retirer |

**Notes**
- epaule-n1 : coude un peu sous l'épaule, tension légère.
- epaule-n2 : exercice retiré (étirement de l'avant de l'épaule : pas tant que la gêne est nette, prudence de `kine`, NON SOURCÉ).
- coude-n2 : coude bas, appui léger.
- cou-n2 : tête alignée, regard devant.
- grossesse : debout contre le mur, étirement doux, sans rester immobile longtemps (G4). Post-partum : G7 (sans effet).
- general : le bras ne dépasse pas l'épaule : c'est la poitrine qui s'étire, pas l'épaule. Version plus douce : etirement-pectoraux-bras-bas.

**Grossesse** : garder
**Version plus douce** : etirement-pectoraux-bras-bas

**Signes qui doivent faire arrêter**
- Douleur (pas la simple sensation d'étirement) : relâche tout de suite et sors de la position ; un étirement est une tension douce, jamais une douleur, et ne se force pas (pas de rebond, pas d'à-coup).
- Engourdissement, fourmillements ou sensation de décharge pendant la position : relâche immédiatement ; si cela revient ou ne passe pas, consulte un professionnel de santé (S2).
- Douleur à l'avant de l'épaule ou dans le bras, ou fourmillements dans la main : relâche et arrête.
- Douleur qui dure, qui s'aggrave ou qui réveille la nuit, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2) ; ces signes n'ont pas à être « diagnostiqués » par toi.
- Si le réglage « enceinte / post-partum » est coché : saignement, perte de liquide, contractions, vertige, douleur ou gonflement d'un mollet, fuite d'urine ou pesanteur dans le bas-ventre : arrête et contacte ta sage-femme ou ton médecin (G6, G7) ; en cas de saignement, de perte des eaux ou de contractions régulières : urgence, voir U1.

**Objets du quotidien**
- Mur propre, sans objet saillant, sol non glissant (R8).
- Si l'objet bouge, glisse ou grince : arrêt, et l'objet n'est plus utilisé (R8).

## Photo
- `Chest_And_Front_Of_Shoulder_Stretch/0.jpg` : affichable : non (l'entrée montre un bâton levé derrière la tête, pas l'étirement contre le mur : la photo contredit la consigne, règle 12)
- `Chest_And_Front_Of_Shoulder_Stretch/1.jpg` : affichable : non (même raison)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Étirement des pectoraux contre un mur, avant-bras ou main au mur, buste tourné à l'opposé | description de coach. Corrigé après contrôle `relecteur` : l'entrée free-exercise-db « Chest_And_Front_Of_Shoulder_Stretch » (lue le 22/10/2026) décrit un bâton tenu à deux mains et levé derrière la tête, position différente et plus exigeante pour l'épaule ; elle ne sert pas de source à cette fiche. `Behind_Head_Chest_Stretch` (avec partenaire) et `Dynamic_Chest_Stretch` non retenues. Aucune entrée libre correspondante | - | 2026-10-22 | NON SOURCÉ |
| Échelons, niveaux, muscles et répartition principaux / secondaires | choix de coach (décision de format de l'utilisateur, 21/10/2026) | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-22 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-22 | NON SOURCÉ (extrapolation, à valider) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-22 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
