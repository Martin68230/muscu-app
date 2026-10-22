---
id: cercles-de-bras
nom: Cercles de bras
schema: mobilite
type: mobilite_recup
niveau_min: debutant
muscles_principaux: [deltoides_lateraux]
muscles_secondaires: [trapezes, dentele_anterieur]
source_brouillon: []
statut: verifie
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| cercles-bras-petits | Petits cercles, bras tendus | 1 | debutant | poids_du_corps | Debout, bras tendus sur les côtés à hauteur d'épaules. |
| cercles-bras-grands | Grands cercles | 2 | debutant | poids_du_corps | Même position, bras qui dessinent de grands cercles. |

## Consignes
1. Debout, pieds largeur de hanches, bras tendus sur les côtés à hauteur d'épaules.
2. Dessine de petits cercles vers l'avant avec les mains, épaules basses et loin des oreilles.
3. Agrandis progressivement les cercles si c'est sans gêne.
4. Change de sens.

## Points d'attention
- Épaules basses, nuque longue.
- Mouvement lent, régulier et sans élan.
- Aucune durée ni nombre donné (aucune valeur sourcée).

## Erreurs fréquentes
- Hausser les épaules.
- Cambrer le dos.
- Aller trop vite.

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
| Épaule | adapter: variante:cercles-bras-petits | adapter: variante:cercles-bras-petits | retirer |
| Cou | garder | adapter: variante:cercles-bras-petits | retirer |
| Dos | garder | adapter: variante:cercles-bras-petits | retirer |

**Notes**
- epaule-n1 : petits cercles seulement.
- epaule-n2 : petits cercles seulement, bras un peu moins hauts si besoin ; aucune augmentation (R2).
- cou-n2 : petits cercles, épaules basses.
- dos-n2 : petits cercles, sans cambrure.
- grossesse : debout, lent et léger, sans effort, sans rester immobile longtemps (G4). Post-partum : G7 (sans effet).
- general : mouvement sans charge ; aucun élan. Version plus douce : cercles-bras-petits.

**Grossesse** : garder
**Version plus douce** : cercles-bras-petits

**Signes qui doivent faire arrêter**
- Engourdissement, fourmillements ou sensation de décharge pendant la position : relâche immédiatement ; si cela revient ou ne passe pas, consulte un professionnel de santé (S2).
- Douleur dans l'épaule (pincement en levant) : baisse les bras ou arrête.
- Douleur qui dure, qui s'aggrave ou qui réveille la nuit, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2) ; ces signes n'ont pas à être « diagnostiqués » par toi.
- Si le réglage « enceinte / post-partum » est coché : saignement, perte de liquide, contractions, vertige, douleur ou gonflement d'un mollet, fuite d'urine ou pesanteur dans le bas-ventre : arrête et contacte ta sage-femme ou ton médecin (G6, G7) ; en cas de saignement, de perte des eaux ou de contractions régulières : urgence, voir U1.

**Objets du quotidien**
- Espace dégagé autour de toi (R8).
- Si l'objet bouge, glisse ou grince : arrêt, et l'objet n'est plus utilisé (R8).

## Photo
- `Arm_Circles/0.jpg` : affichable : à vérifier (image non regardée ; l'entrée Arm_Circles décrit bien les bras tendus sur les côtés)
- `Arm_Circles/1.jpg` : affichable : à vérifier (image non regardée)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Cercles de bras tendus sur les côtés, parallèles au sol, dans un sens puis dans l'autre (échelon 1) | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db, entrée « Arm_Circles » (description lue le 22/10/2026 ; corrigé après contrôle `relecteur` : la source citée avant, « Shoulder_Circles », décrit des cercles d'épaules, autre mouvement). Seules la position et le changement de sens sont repris ; la taille des cercles et la durée de l'entrée ne le sont pas | base d'exercices (pratique, pas une étude) | 2026-10-22 | PROVISOIRE |
| Agrandir les cercles progressivement (échelon 2, « grands cercles ») | description de coach ; l'entrée Arm_Circles ne décrit que des cercles d'environ 30 cm | - | - | NON SOURCÉ |
| Échelons, niveaux, muscles et répartition principaux / secondaires | choix de coach (décision de format de l'utilisateur, 21/10/2026) | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-22 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-22 | NON SOURCÉ (extrapolation, à valider) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-22 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
