---
id: dead-bug
nom: Dead bug (insecte sur le dos)
schema: anti_rotation
type: gainage
niveau_min: debutant
muscles_principaux: [abdominaux, transverse]
muscles_secondaires: [obliques, flechisseurs_hanche]
source_brouillon: [M0517]
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| dead-bug-poids-du-corps | Poids du corps | 1 | debutant | poids_du_corps, tapis | Allongé sur le dos. |
| dead-bug-haltere | Haltère tenu à deux mains | 2 | debutant | halteres, tapis | Un haltère léger tenu à deux mains, bras tendus vers le plafond. |

## Consignes
1. Sur le dos, bras tendus vers le plafond.
2. Genoux pliés à angle droit, au-dessus des hanches.
3. Plaque le bas du dos au sol en serrant le ventre.
4. Allonge lentement une jambe vers le sol (et le bras opposé derrière la tête).
5. Reviens, puis change de côté.

## Points d'attention
- Le bas du dos reste collé au sol : c'est tout l'exercice.
- Va lentement, souffle en allongeant.
- Allonge moins loin si le dos se décolle.
- Version haltère : seules les jambes bougent, les bras restent fixes.

## Erreurs fréquentes
- Dos qui se cambre quand la jambe s'éloigne.
- Aller vite.
- Bloquer la respiration.

## Progression / régression
- plus-facile : dead-bug-jambes-seules
- plus-dur : dead-bug-haltere
jambes seules <- **dead-bug-poids-du-corps** (bras + jambe opposés) -> dead-bug-haltere

## Repères de dosage
Voir program-logic.md.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | garder | adapter: amplitude:jambes-seules | retirer |
| Hanche | garder | adapter: amplitude:reduite | retirer |
| Épaule | adapter: variante:dead-bug-poids-du-corps | adapter: amplitude:jambes-seules | retirer |
| Cou | adapter: appui:coussin | adapter: appui:coussin | retirer |

**Notes**
- dos-n2 : jambes seules, talon qui glisse au sol.
- hanche-n2 : jambes pliées, talon qui effleure le sol.
- epaule-n2 : jambes seules, bras posés au sol.
- epaule-n3 : une variante sans l'épaule (jambes seules, bras posés au sol) pourra être créée plus tard.
- cou-n2 : tête posée sur un coussin tout le long.
- grossesse : couché sur le dos, donc retiré ; remplaçant conseillé : bird-dog. Post-partum : G7.

**Grossesse** : retirer: remplacant:bird-dog
**Version plus douce** : dead-bug-poids-du-corps

**Points d'attention (kine)**
- Haltère au-dessus du visage ou de la poitrine : haltère fixe de préférence ; haltère réglable seulement si les disques sont bien serrés (vérifie avant chaque série).



**Signes qui doivent faire arrêter**
- Bas du dos qui se décolle du sol sans que tu puisses le recoller.
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au bas du dos ou à la hanche.
- Haltère qui vacille au-dessus du visage (version haltère).
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
- `Dead_Bug/0.jpg` : affichable : à vérifier (image non regardée).
- `Dead_Bug/1.jpg` : affichable : à vérifier (image non regardée).
Variante haltère : aucune photo.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Sur le dos, bras vers le plafond, hanches et genoux à 90°, bas du dos plaqué, extension d'une jambe sans cambrer, alternance | free-exercise-db « Dead_Bug » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Dead_Bug.json ; réécrit par coach | base d'exercices (domaine public), pas d'étude | 2026-10-21 | PROVISOIRE |
| Muscles (abdominaux) | même fiche ; autres ajoutés par coach | idem | 2026-10-21 | PROVISOIRE |
| Bras opposé associé ; variante haltère | pratique courante | - | - | NON SOURCÉ |
| Classement en anti-rotation (c'est surtout de l'anti-extension) | exercise-catalog.md §4 le range dans les manques anti-rotation : à trancher | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-21 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://www.has-sante.fr/jcms/c_2961499/fr/prise-en-charge-du-patient-presentant-une-lombalgie-commune (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; HAS : fiche mémo PDF lue en entier le 2026-10-21 (https://has-sante.fr/upload/docs/application/pdf/2019-04/fm_lombalgie_v2_2.pdf) ; NICE : résumés seulement | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
| Haltère au-dessus du visage : haltère fixe ou réglable vérifié, prise en coupe | règle de prudence de `kine` (R9) ; aucune source trouvée | - | 2026-10-21 | NON SOURCÉ |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
