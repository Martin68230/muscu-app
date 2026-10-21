---
id: developpe-au-sol-halteres
nom: Développé au sol aux haltères
schema: poussee_h
type: force
niveau_min: debutant
muscles_principaux: [pectoraux, triceps]
muscles_secondaires: [deltoides_anterieurs]
source_brouillon: [M1161]
statut: controle_relecteur
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| developpe-sol-deux-halteres | Deux haltères | 1 | debutant | halteres, tapis | Allongé sur le dos, genoux pliés, pieds à plat. |
| developpe-sol-un-haltere | Un bras à la fois | 2 | debutant | halteres, tapis | Même installation, un seul haltère. |

## Consignes
1. Assieds-toi, haltères sur les cuisses, puis allonge-toi en les gardant contre toi.
2. Pousse les haltères au-dessus de la poitrine, bras tendus.
3. Descends jusqu'à ce que le haut des bras touche doucement le sol.
4. Garde les coudes un peu écartés du corps, ni collés ni à l'horizontale des épaules.
5. Pousse pour tendre les bras à nouveau.

## Points d'attention
- Le sol limite l'amplitude : les épaules restent protégées.
- Pose les coudes, ne les laisse pas tomber.
- Poignets droits, au-dessus des coudes.
- À la fin, ramène les haltères sur la poitrine avant de te relever.

## Erreurs fréquentes
- Rebondir avec les coudes sur le sol.
- Haltères qui partent vers la tête.
- Lâcher les haltères sur les côtés en fin de série.

## Progression / régression
- plus-facile : pompe-genoux
- plus-dur : developpe-sol-un-haltere
pompe-genoux <- **developpe-au-sol-halteres** -> version un bras à la fois (gainage en plus)

## Repères de dosage
Voir program-logic.md.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | garder | adapter: charge:legere | retirer |
| Coude | garder | adapter: charge:legere | retirer |
| Poignet | adapter: appui:paumes-face-a-face | adapter: charge:legere | retirer |

**Notes**
- epaule-n2 : charge légère, coudes plus près du corps.
- coude-n2 : charge légère, paumes face à face.
- poignet-n1 : paumes face à face, poignet droit.
- poignet-n2 : charge légère, paumes face à face.
- grossesse : couché sur le dos, donc retiré ; remplaçant conseillé : développé épaules assis, charge légère. Post-partum : G7.

**Grossesse** : retirer: remplacant:developpe-epaules-halteres
**Version plus douce** : developpe-sol-deux-halteres

**Points d'attention (kine)**
- Haltère au-dessus du visage ou de la poitrine : haltère fixe de préférence ; haltère réglable seulement si les disques sont bien serrés (vérifie avant chaque série).
- Pour finir : descends les haltères sur la poitrine puis roule sur le côté ; ne les lâche jamais au-dessus de toi.



**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente à l'épaule, au coude ou au poignet.
- Haltère qui part sur le côté ou que tu ne contrôles plus au-dessus de toi.
- Disque d'un haltère réglable qui bouge.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
- `Dumbbell_Floor_Press/0.jpg` : affichable : à vérifier (image non regardée).
- `Dumbbell_Floor_Press/1.jpg` : affichable : à vérifier (image non regardée).
Variante un bras : aucune photo.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Allongé au sol, descente jusqu'au contact des bras avec le sol, coudes serrés (triceps) ou ouverts (pectoraux), poussée bras tendus | free-exercise-db « Dumbbell_Floor_Press » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Dumbbell_Floor_Press.json ; réécrit par coach | base d'exercices (domaine public), pas d'étude | 2026-10-21 | PROVISOIRE |
| Muscles (triceps ; pectoraux, épaules) | même fiche (la source met les triceps en premier ; ici pectoraux et triceps à égalité) | idem | 2026-10-21 | PROVISOIRE |
| Niveau débutant (la source dit intermédiaire) | choix de coach : amplitude limitée par le sol | - | - | NON SOURCÉ |
| « Le sol protège les épaules » | pratique courante | - | - | NON SOURCÉ |
| Position des coudes « un peu écartés du corps » (source : coudes serrés pour les triceps, ouverts pour les pectoraux ; aucun angle chiffré retenu) | choix de coach, prudence | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-21 | R1, R2, R3, R7, R8 : NON SOURCÉ ; R4, R5, R6, R9 (partie), R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Haltère au-dessus du visage : haltère fixe ou réglable vérifié, prise en coupe | règle de prudence de `kine` (R9) ; aucune source trouvée | - | 2026-10-21 | NON SOURCÉ |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
