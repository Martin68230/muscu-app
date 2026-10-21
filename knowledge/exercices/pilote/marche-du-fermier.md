---
id: marche-du-fermier
nom: Marche du fermier
schema: porte
type: fonctionnel
niveau_min: debutant
muscles_principaux: [avant_bras, trapezes]
muscles_secondaires: [abdominaux, obliques, fessiers, quadriceps, erecteurs_rachis]
source_brouillon: [M0595, M1121]
statut: controle_relecteur
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| fermier-halteres | Deux haltères | 1 | debutant | halteres | Un haltère dans chaque main, posés au sol de chaque côté des pieds. |
| fermier-bidons-sacs | Bidons ou sacs de courses | 1 | debutant | bidons_ou_sacs | Deux bidons d'eau ou deux sacs solides, de poids proche, avec des poignées qui ne coupent pas les doigts. |

## Consignes
1. Charges au sol, de chaque côté des pieds.
2. Plie les jambes, dos droit, attrape les poignées.
3. Relève-toi en poussant dans les jambes.
4. Marche à petits pas, grand et droit, épaules basses.
5. Pose les charges en pliant les jambes, dos droit.

## Points d'attention
- Soulever et poser jambes fléchies, dos droit.
- Épaules basses, loin des oreilles.
- Buste droit, sans pencher.
- Chemin dégagé, sol non glissant.

## Erreurs fréquentes
- Ramasser les charges dos rond.
- Hausser les épaules.
- Grands pas qui font balancer les charges.

## Progression / régression
- plus-facile : aucun
- plus-dur : porte-valise
**marche-du-fermier** -> plus lourd ou plus long -> porte-valise (une seule main, plus de gainage)

## Repères de dosage
Voir program-logic.md §10 : dosage des portés en distance ou en temps ; valeurs à définir par coach avec source (NON SOURCÉ). La distance de la fiche source (environ 15 à 30 m) n'est pas retenue sans validation.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Poignet | garder | adapter: charge:legere | retirer |
| Coude | garder | adapter: charge:legere | retirer |
| Épaule | garder | adapter: charge:legere | retirer |
| Cou | garder | adapter: charge:legere | retirer |
| Dos | adapter: appui:charges-surelevees | adapter: charge:legere | retirer |
| Hanche | garder | adapter: charge:legere | retirer |
| Genou | garder | adapter: charge:legere | retirer |
| Cheville | garder | adapter: charge:legere | retirer |

**Notes**
- dos-n1 : soulever et poser jambes fléchies, charges posées au départ sur une chaise stable.
- dos-n2 : charges posées au départ sur une chaise stable pour ne pas les ramasser au sol.
- hanche-n2 : trajet court (idem genou et cheville).
- grossesse : poids connu, respiration continue. Post-partum : G7.
- general : version plus douce = même fiche plus légère, charges posées au départ sur une chaise stable.

**Grossesse** : adapter: charge:legere
**Version plus douce** : aucune



**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au dos, à l'épaule, au coude ou au poignet.
- Prise qui lâche : pose les charges (jambes fléchies) avant qu'elles ne tombent.
- Fourmillements ou engourdissement dans les doigts.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Bidons bien fermés, sacs solides (pas de plastique fin qui se déchire), poignées qui ne coupent pas les doigts ; deux charges de poids proche.
- Connais le poids : pèse les charges (pèse-personne avec et sans) ; augmente par petites étapes.
- Chemin dégagé, sol sec, jamais dans un escalier.

## Photo
- `Farmers_Walk/0.jpg` : affichable : non (vue le 21/10/2026 : poignées de strongman chargées de disques, matériel spécialisé ; CLAUDE.md règle 23).
- `Farmers_Walk/1.jpg` : affichable : non (vue le 21/10/2026 : mêmes poignées chargées de disques).
Fiche sans photo affichable.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Se placer entre deux charges, se relever en poussant dans les talons dos neutre, marcher à petits pas rapides en respirant | free-exercise-db « Farmers_Walk » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Farmers_Walk.json ; réécrit par coach | base d'exercices (domaine public), pas d'étude | 2026-10-21 | PROVISOIRE |
| Muscles (avant-bras ; abdominaux, fessiers, ischios, bas du dos, quadriceps, trapèzes) ; reclassement de coach : trapèzes promus en principal, obliques ajoutés, ischios non repris | même fiche ; reclassement par coach, NON SOURCÉ | idem | 2026-10-21 | PROVISOIRE |
| Soulever et poser jambes fléchies, dos neutre | exercise-catalog.md §5 (source de blog) | synthèse | 2026-10-21 | PROVISOIRE |
| Peu de recherche sur les portés ; intérêt pour la prise et la stabilité du tronc | NSCA Coach « Increase Hip and Trunk Stability with Loaded Carries » (sources.md) | article professionnel | 2026-10-21 | PROVISOIRE |
| Variante bidons/sacs | equipment-taxonomy.md §2 et §4 (objets du quotidien) | - | 2026-10-21 | NON SOURCÉ |
| Niveau débutant (la source dit intermédiaire) | choix de coach avec charge légère, tracé le 21/10/2026 | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-21 | R1, R2, R3, R7, R8 : NON SOURCÉ ; R4, R5, R6, R9 (partie), R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://www.has-sante.fr/jcms/c_2961499/fr/prise-en-charge-du-patient-presentant-une-lombalgie-commune (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; HAS : fiche mémo PDF lue en entier le 2026-10-21 (https://has-sante.fr/upload/docs/application/pdf/2019-04/fm_lombalgie_v2_2.pdf) ; NICE : résumés seulement | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
| Avertissement sur le sac, les bidons ou les sacs (contenu calé, poids connu) | règle de conception (exercise-catalog.md §5) ; aucune source trouvée | - | 2026-10-21 | NON SOURCÉ |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
