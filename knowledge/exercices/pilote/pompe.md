---
id: pompe
nom: Pompe
schema: poussee_h
type: force
niveau_min: debutant
muscles_principaux: [pectoraux]
muscles_secondaires: [triceps, deltoides_anterieurs, abdominaux, dentele_anterieur]
source_brouillon: [M1803]
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| pompe-sol | Au sol | 1 | debutant | poids_du_corps | Mains au sol, sur les pointes de pieds. |

## Consignes
1. Mains au sol un peu plus larges que les épaules.
2. Corps en planche, des talons à la tête.
3. Descends la poitrine près du sol en pliant les coudes.
4. Coudes à environ 45° du corps.
5. Pousse le sol pour tendre les bras.

## Points d'attention
- Ventre et fessiers serrés tout le long.
- Tête dans le prolongement du corps.
- Descente contrôlée.
- Si la forme se dégrade, finis la série sur les genoux.

## Erreurs fréquentes
- Bassin qui tombe ou fesses en l'air.
- Coudes à l'horizontale.
- Demi-répétitions.

## Progression / régression
pompe-genoux <- **pompe** -> pompe avec descente lente -> pompe pieds surélevés (à rédiger en vague 1, brouillon M1053)

## Repères de dosage
Voir program-logic.md.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Chaque case contient un seul choix : `garder` (exercice tel quel), `adapter : <action précise>` (`variante:<id>`, `charge:légère`, `sans-charge`, `amplitude:...`, `appui:...`) ou `retirer` (avec `remplaçant` ou `sans-zone:<id>` si la fiche en nomme un) ; vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | garder | adapter : variante:pompe-inclinee | retirer |
| Coude | garder | adapter : variante:pompe-genoux ou variante:pompe-inclinee | retirer |
| Poignet | adapter : variante:pompe-inclinee-chaise (mains plus hautes, moins de poids sur les mains) | adapter : variante:pompe-inclinee | retirer |
| Dos | garder | adapter : variante:pompe-genoux ou variante:pompe-inclinee | retirer |

**Version plus douce** : `pompe-genoux`.

**Grossesse** (G1 à G8 de regles-securite-communes.md ; avis du médecin ou de la sage-femme avant tout programme) : adapter : variante:pompe-inclinee. Post-partum : G7.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente à l'épaule, au coude ou au poignet.
- Bassin qui s'effondre ou bas du dos qui se creuse.
- Haltère qui roule ou bascule sous la main.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
- `Pushups/0.jpg` : affichable : à vérifier (image non regardée).
- `Pushups/1.jpg` : affichable : à vérifier (image non regardée).

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Mains un peu plus larges que les épaules, bras tendus, poitrine près du sol, retour bras tendus | free-exercise-db « Pushups » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Pushups.json ; réécrit par coach | base d'exercices (domaine public), pas d'étude | 2026-10-21 | PROVISOIRE |
| Muscles (pectoraux en principal ; épaules, triceps en secondaire) | même fiche ; tronc et dentelé ajoutés par coach ; changement par rapport à la première version (triceps était principal) | idem | 2026-10-21 | PROVISOIRE (ajouts : NON SOURCÉ) |
| Coudes à environ 45° | pratique courante | - | - | NON SOURCÉ |
| Variante « mains sur haltères » RETIRÉE (21/10/2026) : elle exige des haltères hexagonaux, attribut que le tag `halteres` ne porte pas (haltères réglables à disques ronds : ils roulent) | point 49 de `relecteur` ; à ré-introduire seulement si le profil porte l'attribut | - | - | retirée |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-21 | R1, R2, R3, R7, R8 : NON SOURCÉ ; R4, R5, R6, R9 (partie), R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://www.has-sante.fr/jcms/c_2961499/fr/prise-en-charge-du-patient-presentant-une-lombalgie-commune (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; HAS : fiche mémo PDF lue en entier le 2026-10-21 (https://has-sante.fr/upload/docs/application/pdf/2019-04/fm_lombalgie_v2_2.pdf) ; NICE : résumés seulement | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
