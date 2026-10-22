---
id: squat-bulgare
nom: Squat bulgare (pied arrière surélevé)
schema: fente
type: force
niveau_min: intermediaire
muscles_principaux: [quadriceps, fessiers]
muscles_secondaires: [ischios, adducteurs, moyen_fessier]
source_brouillon: [M0518, M0519, M0520]
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| squat-bulgare-chaise | Pied sur une chaise | 1 | intermediaire | poids_du_corps, chaise | Chaise stable calée contre un mur, dessus du pied arrière posé sur l'assise. |
| squat-bulgare-marche | Pied sur une marche | 1 | intermediaire | poids_du_corps, marche_escalier | Dessus du pied arrière sur la première marche d'un escalier (éclairé, dégagé, rampe si possible). |
| squat-bulgare-halteres | Haltères, pied sur une chaise | 1 | intermediaire | halteres, chaise | Comme la version chaise, un haltère dans chaque main. |

## Consignes
1. Dos à la chaise, pose le dessus d'un pied sur l'assise.
2. Avance le pied avant pour pouvoir descendre droit.
3. Descends en pliant le genou avant, buste droit ou un peu penché.
4. Le genou arrière descend vers le sol.
5. Pousse dans le pied avant pour remonter.
6. Finis la série, puis change de jambe.

## Points d'attention
- Presque tout le poids sur la jambe avant.
- Genou avant dans l'axe du pied.
- Trouve ta distance avant de commencer la série.
- Bassin de face.

## Erreurs fréquentes
- Pied avant trop près de la chaise.
- Pousser avec la jambe arrière.
- Perdre l'équilibre en allant trop vite.

## Progression / régression
- plus-facile : squat-fendu
- plus-dur : aucun
squat-fendu <- **squat-bulgare** (poids du corps -> haltères)

## Repères de dosage
Voir program-logic.md.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Genou | adapter: sans-charge | adapter: variante:squat-fendu-mur | retirer |
| Hanche | adapter: sans-charge | adapter: variante:squat-fendu-mur | retirer |
| Cheville | adapter: appui:premiere-marche | adapter: variante:squat-fendu-mur | retirer |
| Dos | garder | adapter: sans-charge | retirer |

**Notes**
- genou-n1 : sans haltères ; la variante sur la première marche est possible.
- cheville-n1 : dessus du pied arrière sur la première marche d'un escalier éclairé et dégagé, à plat ; rien de glissant (serviette, coussin) entre le pied et le support.
- general : support qui ne glisse pas (chaise calée contre un mur, ou marche sèche), pied avant chaussé ou sur sol antidérapant ; si le support bouge, arrête.
- grossesse : risque de chute, donc retiré ; remplaçant conseillé : squat fendu, version mur. Post-partum : G7.

**Grossesse** : retirer: remplacant:squat-fendu-mur
**Version plus douce** : squat-fendu-mur



**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au genou, à la hanche ou sur le dessus du pied arrière.
- Chaise ou marche qui bouge.
- Perte d'équilibre : pose le pied arrière au sol et recule d'un pas.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Chaise à 4 pieds, sans roulettes, non pliante, en bon état ; dossier calé contre un mur ; sol non glissant (pas de tapis qui glisse, pas de carrelage mouillé).
- Avant la première série, appuie-toi dessus comme pendant l'exercice : si elle bouge, glisse ou grince, n'utilise pas cette chaise.
- Marche d'escalier : seulement la première marche du bas, escalier éclairé et dégagé, rampe si possible (R8).
- Version haltères : seulement si l'équilibre est sûr sans haltères (tu ne pourras pas te rattraper avec les mains).

## Photo
- `Split_Squat_with_Dumbbells/0.jpg` : affichable : oui (vue le 22/10/2026 ; pied arrière sur un banc ; fichier public/photos/free-exercise-db/Split_Squat_with_Dumbbells-0.webp)
- `Split_Squat_with_Dumbbells/1.jpg` : affichable : oui (vue le 22/10/2026 ; pied arrière sur un banc ; fichier public/photos/free-exercise-db/Split_Squat_with_Dumbbells-1.webp)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Pied arrière surélevé, descente en pliant le genou avant, posture droite, genou dans l'axe du pied, poussée dans le pied avant | free-exercise-db « Split_Squat_with_Dumbbells » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Split_Squat_with_Dumbbells.json ; réécrit par coach | base d'exercices (domaine public), pas d'étude | 2026-10-21 | PROVISOIRE |
| Muscles (quadriceps dans la source) | même fiche ; autres muscles ajoutés par coach | idem | 2026-10-21 | PROVISOIRE (ajouts NON SOURCÉ) |
| Niveau intermédiaire (la source dit débutant) | choix de coach (équilibre) | - | - | NON SOURCÉ |
| Fusion de M0518 et M0519 (gauche / droite) | nettoyage du brouillon | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-21 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au genou ou à la hanche de niveau 1-2 : adapter plutôt que tout retirer | Bannuru et al., OARSI 2019, Osteoarthritis Cartilage https://wrap.warwick.ac.uk/125416/ (exercice structuré = traitement de base de l'arthrose du genou et de la hanche) | recommandation internationale (méthode GRADE) ; résumé lu | 2026-10-21 | PROVISOIRE (extrapolation : public arthrosique ; l'app ne pose aucun diagnostic) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://www.has-sante.fr/jcms/c_2961499/fr/prise-en-charge-du-patient-presentant-une-lombalgie-commune (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; HAS : fiche mémo PDF lue en entier le 2026-10-21 (https://has-sante.fr/upload/docs/application/pdf/2019-04/fm_lombalgie_v2_2.pdf) ; NICE : résumés seulement | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
| Avertissement de stabilité de la chaise | règle de conception (exercise-catalog.md §5, cite la chaise) et R8 de knowledge/regles-securite-communes.md ; aucune source trouvée | - | 2026-10-21 | NON SOURCÉ |
| Avertissement de stabilité de la marche (première marche, rampe) | règle R8 de knowledge/regles-securite-communes.md §7 (`kine`) ; exercise-catalog.md §5 ne parle pas de marche ; aucune source trouvée | - | 2026-10-21 | NON SOURCÉ |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
