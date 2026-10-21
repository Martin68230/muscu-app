---
id: pompe-inclinee
nom: Pompe inclinée (mains surélevées)
schema: poussee_h
type: force
niveau_min: debutant
muscles_principaux: [pectoraux]
muscles_secondaires: [triceps, deltoides_anterieurs, abdominaux, dentele_anterieur]
source_brouillon: [M1418, M1804, M0482]
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).
Plus les mains sont hautes, plus c'est facile. Les échelons sont classés par HAUTEUR des mains, pas par objet : mur (très haut) < assise de chaise (environ 45 cm) < première marche d'escalier (environ 17 à 20 cm : la plus basse, donc la plus dure des trois).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| pompe-inclinee-mur | Au mur | 1 | debutant | mur | Debout face au mur, mains sur le mur à hauteur d'épaules. |
| pompe-inclinee-chaise | Mains sur une chaise | 2 | debutant | chaise, mur | Chaise stable, dossier calé contre un mur, mains sur le bord de l'assise. |
| pompe-inclinee-marche | Mains sur une marche | 3 | debutant | marche_ou_box | Mains sur la première marche d'un escalier (éclairé, dégagé, rampe si possible), jamais sur une marche plus haute : règle de sécurité R8. |

## Consignes
1. Mains un peu plus larges que les épaules.
2. Recule les pieds : ton corps fait une planche droite.
3. Plie les coudes pour amener la poitrine vers le support.
4. Coudes à environ 45° du corps, pas à l'horizontale.
5. Pousse pour tendre les bras, sans casser la ligne du corps.

## Points d'attention
- Corps gainé : fesses et ventre serrés.
- La poitrine arrive en premier, pas le menton.
- Support qui ne glisse pas.
- Descente contrôlée.

## Erreurs fréquentes
- Hanches qui s'affaissent.
- Coudes grands ouverts sur les côtés.
- Amplitude trop courte.

## Progression / régression
**pompe-inclinee-mur** (échelon 1) -> pompe-inclinee-chaise (2) -> pompe-inclinee-marche (3, première marche) -> pompe-genoux ou pompe (autres fiches)

## Repères de dosage
Voir program-logic.md. Progression par échelle de variantes : load-calibration.md règle 5 (NON SOURCÉ).

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Chaque case contient un seul choix : `garder` (exercice tel quel), `adapter : <action précise>` (`variante:<id>`, `charge:légère`, `sans-charge`, `amplitude:...`, `appui:...`) ou `retirer` (avec `remplaçant` ou `sans-zone:<id>` si la fiche en nomme un) ; vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | garder | adapter : variante:pompe-inclinee-mur, amplitude:réduite | retirer |
| Coude | garder | adapter : variante:pompe-inclinee-mur | retirer |
| Poignet | garder | adapter : variante:pompe-inclinee-mur, appui:mains un peu tournées vers l'extérieur | retirer |
| Dos | garder | adapter : variante:pompe-inclinee-mur | retirer |

**Version plus douce** : `pompe-inclinee-mur`.

**Grossesse** (G1 à G8 de regles-securite-communes.md ; avis du médecin ou de la sage-femme avant tout programme) : garder (pompe-inclinee-mur ou pompe-inclinee-chaise ; respiration continue). Post-partum : G7.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente à l'épaule, au coude ou au poignet.
- Support qui glisse ou bouge.
- Bassin qui s'effondre.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Chaise à 4 pieds, sans roulettes, non pliante, en bon état ; dossier calé contre un mur ; sol non glissant (pas de tapis qui glisse, pas de carrelage mouillé).
- Avant la première série, appuie-toi dessus comme pendant l'exercice : si elle bouge, glisse ou grince, n'utilise pas cette chaise.
- Mains sur le bord de l'assise, du côté opposé au mur, pour que la poussée plaque la chaise contre le mur.
- Marche : seulement la première marche d'un escalier éclairé et dégagé (rampe si possible), stable et sèche (R8) ; banc de parc : vérifie qu'il est fixé au sol.

## Photo
- `Incline_Push-Up/0.jpg` : affichable : non (même décor que 1.jpg d'après `relecteur` : marques de salle visibles ; recadrage à décider par l'utilisateur).
- `Incline_Push-Up/1.jpg` : affichable : non (vue le 21/10/2026 : mains sur une box en bois, pas un banc ; bannière « CrossFit » et logo de salle en arrière-plan : marque d'un tiers). Redeviendrait « oui » après recadrage, pour illustrer les échelons chaise et marche seulement (pas le mur).
Variante mur : aucune photo.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Mains sur un support surélevé un peu plus larges que les épaules, corps droit, poitrine vers le bord, bras tendus en haut | free-exercise-db « Incline_Push-Up » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Incline_Push-Up.json ; réécrit par coach | base d'exercices (domaine public), pas d'étude | 2026-10-21 | PROVISOIRE |
| Muscles (pectoraux ; épaules, triceps) | même fiche ; tronc et dentelé ajoutés par coach | idem | 2026-10-21 | PROVISOIRE |
| Plus les mains sont hautes, plus c'est facile ; coudes à environ 45° | pratique courante | - | - | NON SOURCÉ |
| Variante mur | brouillon M1804 (wger « Wall Pushup ») : prouve seulement que le mouvement existe ; page wger non lue | - | 2026-10-21 | NON SOURCÉ |
| Triceps en secondaire (source : pectoraux en principal) | free-exercise-db « Incline_Push-Up » ; changement par rapport à la première version de la fiche (triceps était principal) | idem | 2026-10-21 | PROVISOIRE |
| Classement des échelons par hauteur des mains | raisonnement de coach (hauteurs courantes de chaise et de marche) ; aucune source | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-21 | R1, R2, R3, R7, R8 : NON SOURCÉ ; R4, R5, R6, R9 (partie), R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Avertissement de stabilité de la chaise | règle de conception (exercise-catalog.md §5, cite la chaise) et R8 de knowledge/regles-securite-communes.md ; aucune source trouvée | - | 2026-10-21 | NON SOURCÉ |
| Avertissement de stabilité de la marche (première marche, rampe) | règle R8 de knowledge/regles-securite-communes.md §7 (`kine`) ; exercise-catalog.md §5 ne parle pas de marche ; aucune source trouvée | - | 2026-10-21 | NON SOURCÉ |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
