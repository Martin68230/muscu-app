---
id: souleve-de-terre-roumain-halteres
nom: Soulevé de terre roumain aux haltères
schema: charniere
type: force
niveau_min: debutant
muscles_principaux: [ischios, fessiers]
muscles_secondaires: [erecteurs_rachis, avant_bras]
source_brouillon: [M0937, M0931]
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| sdt-roumain-deux-halteres | Deux haltères | 1 | debutant | halteres | Un haltère dans chaque main, bras le long du corps, haltères sur les côtés des cuisses (comme la consigne 1 et la photo 0.jpg). |
| sdt-roumain-un-haltere | Un haltère à deux mains | 1 | debutant | halteres | Un seul haltère tenu à deux mains devant les cuisses. |

## Consignes
1. Debout, pieds à largeur de hanches, un haltère dans chaque main, bras le long du corps, haltères sur les côtés des cuisses (avec un seul haltère : tenu à deux mains devant les cuisses).
2. Genoux légèrement fléchis : ils restent ainsi.
3. Pousse les fesses loin derrière, le buste s'incline, dos plat.
4. Les haltères descendent le long de tes jambes, de chaque côté, sans s'en éloigner.
5. Arrête quand l'arrière des cuisses tire ou que le dos veut s'arrondir.
6. Pousse les hanches vers l'avant pour te redresser.

## Points d'attention
- Dos plat du début à la fin.
- Le mouvement vient des hanches, pas des genoux.
- Haltères près des jambes.
- Ne descends pas plus bas que ce que ton dos permet.

## Erreurs fréquentes
- Arrondir le dos pour descendre plus bas.
- Plier les genoux comme pour un squat.
- Haltères qui partent devant.
- Se cambrer en arrière en haut.

## Progression / régression
pont-fessier <- **souleve-de-terre-roumain-halteres** -> souleve-de-terre-roumain-unijambiste

## Repères de dosage
Voir program-logic.md.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Chaque case contient un seul choix : `garder` (exercice tel quel), `adapter : <action précise>` (`variante:<id>`, `charge:légère`, `sans-charge`, `amplitude:...`, `appui:...`) ou `retirer` (avec `remplaçant` ou `sans-zone:<id>` si la fiche en nomme un) ; vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter : amplitude:descente jusqu'aux genoux seulement | adapter : variante:pont-fessier (charnière sans charge dans les mains) | retirer |
| Hanche | garder | adapter : charge:légère, amplitude:réduite, ou variante:pont-fessier | retirer |
| Genou | garder | garder | retirer |
| Coude / poignet | garder | adapter : charge:légère, variante:sdt-roumain-un-haltere (un seul haltère tenu à deux mains), ou variante:pont-fessier-sol | retirer ; sans-zone:pont-fessier-sol |

**Points d'attention (kine)**
- Pose les haltères au sol jambes fléchies, dos droit, en fin de série.

**Version plus douce** : `pont-fessier`.

**Grossesse** (G1 à G8 de regles-securite-communes.md ; avis du médecin ou de la sage-femme avant tout programme) : adapter : charge:légère, respiration continue, jamais jusqu'à l'échec. Post-partum : G7.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au bas du dos.
- Dos qui s'arrondit sans que tu puisses le corriger.
- Douleur, fourmillements ou engourdissement qui descendent dans la jambe.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
- `Stiff-Legged_Dumbbell_Deadlift/0.jpg` : affichable : oui (vue le 21/10/2026 : debout, un haltère de chaque côté ; cohérent avec la consigne ; salle avec racks, sans marque lisible).
- `Stiff-Legged_Dumbbell_Deadlift/1.jpg` : affichable : à vérifier (vue par `relecteur` : haltères sur les côtés ; flexion des genoux en bas non confirmée, la source dit « jambes tendues » alors que la consigne dit « légèrement fléchis » : la consigne prime).
Variante un seul haltère : aucune photo.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Charnière de hanche, genoux légèrement fléchis et fixes, dos plat, arrêt à l'étirement de l'arrière des cuisses, retour en poussant les hanches | free-exercise-db « Stiff-Legged_Dumbbell_Deadlift » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Stiff-Legged_Dumbbell_Deadlift.json ; réécrit par coach | base d'exercices (domaine public), pas d'étude | 2026-10-21 | PROVISOIRE |
| Muscles (ischios ; fessiers, bas du dos) | même fiche ; avant-bras ajoutés par coach | idem | 2026-10-21 | PROVISOIRE (avant-bras : NON SOURCÉ) |
| Haltères de chaque côté des cuisses, qui descendent le long des jambes | source et photos (haltères sur les côtés) ; consigne alignée le 21/10/2026 | idem | 2026-10-21 | PROVISOIRE |
| Variante un seul haltère tenu à deux mains devant les cuisses | pratique courante, absente de la source | - | - | NON SOURCÉ |
| Regroupement de M0937 (roumain) et M0931 (jambes tendues) en un seul mouvement | choix de coach, à trancher | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-21 | R1, R2, R3, R7, R8 : NON SOURCÉ ; R4, R5, R6, R9 (partie), R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://www.has-sante.fr/jcms/c_2961499/fr/prise-en-charge-du-patient-presentant-une-lombalgie-commune (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; HAS : fiche mémo PDF lue en entier le 2026-10-21 (https://has-sante.fr/upload/docs/application/pdf/2019-04/fm_lombalgie_v2_2.pdf) ; NICE : résumés seulement | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
| Gêne au genou ou à la hanche de niveau 1-2 : adapter plutôt que tout retirer | Bannuru et al., OARSI 2019, Osteoarthritis Cartilage https://wrap.warwick.ac.uk/125416/ (exercice structuré = traitement de base de l'arthrose du genou et de la hanche) | recommandation internationale (méthode GRADE) ; résumé lu | 2026-10-21 | PROVISOIRE (extrapolation : public arthrosique ; l'app ne pose aucun diagnostic) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
