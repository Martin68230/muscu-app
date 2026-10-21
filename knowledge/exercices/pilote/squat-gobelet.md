---
id: squat-gobelet
nom: Squat gobelet
schema: squat
type: force
niveau_min: debutant
muscles_principaux: [quadriceps, fessiers]
muscles_secondaires: [adducteurs, ischios, erecteurs_rachis, abdominaux]
source_brouillon: [M1252]
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| squat-gobelet-haltere | À l'haltère | 1 | debutant | halteres | Un haltère tenu vertical contre la poitrine, mains sous le disque du haut. |
| squat-gobelet-kettlebell | Au kettlebell | 1 | debutant | kettlebell | Kettlebell tenu par les côtés de la poignée, contre la poitrine. |

## Consignes
1. Tiens la charge collée à ta poitrine, coudes vers le bas.
2. Pieds un peu plus larges que les hanches.
3. Descends entre tes talons, buste le plus droit possible.
4. En bas, tes coudes passent à l'intérieur des genoux.
5. Pousse le sol pour remonter, la charge reste collée.

## Points d'attention
- La charge ne s'éloigne pas du corps.
- Genoux dans l'axe des pieds.
- Talons au sol.
- Descends seulement tant que le dos reste droit.

## Erreurs fréquentes
- Charge qui part en avant et tire le buste.
- Talons qui décollent.
- Fesses qui remontent avant la poitrine.

## Progression / régression
- plus-facile : squat-poids-du-corps
- plus-dur : squat-bulgare
squat-poids-du-corps <- **squat-gobelet** -> même fiche avec pause en bas -> squat-bulgare (si les haltères deviennent trop légers)

## Repères de dosage
Voir program-logic.md. Paliers réels des haltères : load-calibration.md règle 4 (NON SOURCÉ).

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Genou | garder | adapter: variante:squat-poids-du-corps | retirer |
| Hanche | garder | adapter: variante:squat-poids-du-corps | retirer |
| Dos | garder | adapter: variante:squat-assis-debout | retirer |
| Cheville | garder | adapter: amplitude:reduite | retirer |
| Coude | garder | adapter: variante:squat-poids-du-corps | retirer: sans-zone:squat-poids-du-corps |
| Poignet | garder | adapter: variante:squat-poids-du-corps | retirer: sans-zone:squat-poids-du-corps |

**Notes**
- genou-n2 : le squat assis-debout est aussi possible.
- dos-n2 : sans charge.
- cheville-n2 : sans charge.
- coude-n3 : le squat au poids du corps laisse les bras libres (idem poignet).
- grossesse : charge légère, respiration continue. Post-partum : G7.

**Grossesse** : adapter: charge:legere
**Version plus douce** : squat-poids-du-corps

**Points d'attention (kine)**
- Haltère tenu contre la poitrine : haltère fixe de préférence ; haltère réglable seulement si les disques sont bien serrés (vérifie avant chaque série).



**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au genou, à la hanche ou au dos.
- Dos qui s'arrondit sans que tu puisses le corriger.
- Haltère qui glisse des mains.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
- `Goblet_Squat/0.jpg` : affichable : à vérifier (kettlebell : à montrer avec la mention « montré au kettlebell » et seulement pour la variante kettlebell ; image non regardée).
- `Goblet_Squat/1.jpg` : affichable : à vérifier (même réserve).
Variante haltère : aucune photo libre fidèle.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Charge contre la poitrine, buste droit, coudes à l'intérieur des genoux en bas | free-exercise-db « Goblet_Squat » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Goblet_Squat.json ; réécrit par coach | base d'exercices (domaine public), pas d'étude | 2026-10-21 | PROVISOIRE |
| Muscles (quadriceps ; mollets, fessiers, ischios, épaules dans la source) | même fiche ; adducteurs et tronc ajoutés par coach | idem | 2026-10-21 | PROVISOIRE (ajouts NON SOURCÉ) |
| Variante haltère | brouillon M1252 (« Dumbbell Goblet Squat », wger + maxwu) : prouve seulement que le mouvement existe ; page wger non lue | - | 2026-10-21 | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-21 | R1, R2, R3, R7, R8 : NON SOURCÉ ; R4, R5, R6, R9 (partie), R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au genou ou à la hanche de niveau 1-2 : adapter plutôt que tout retirer | Bannuru et al., OARSI 2019, Osteoarthritis Cartilage https://wrap.warwick.ac.uk/125416/ (exercice structuré = traitement de base de l'arthrose du genou et de la hanche) | recommandation internationale (méthode GRADE) ; résumé lu | 2026-10-21 | PROVISOIRE (extrapolation : public arthrosique ; l'app ne pose aucun diagnostic) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://www.has-sante.fr/jcms/c_2961499/fr/prise-en-charge-du-patient-presentant-une-lombalgie-commune (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; HAS : fiche mémo PDF lue en entier le 2026-10-21 (https://has-sante.fr/upload/docs/application/pdf/2019-04/fm_lombalgie_v2_2.pdf) ; NICE : résumés seulement | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
| Haltère tenu contre la poitrine, près du visage : haltère fixe ou réglable vérifié, prise en coupe | règle de prudence de `kine` (R9) ; aucune source trouvée | - | 2026-10-21 | NON SOURCÉ |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
