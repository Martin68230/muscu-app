---
id: pont-fessier
nom: Pont fessier
schema: charniere
type: force
niveau_min: debutant
muscles_principaux: [fessiers]
muscles_secondaires: [ischios, erecteurs_rachis]
source_brouillon: [M0501]
statut: controle_relecteur
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| pont-fessier-sol | Au sol | 1 | debutant | poids_du_corps, tapis | Allongé sur le dos, genoux pliés, pieds à plat. |
| pont-fessier-haltere | Haltère sur le bassin | 1 | debutant | halteres, tapis | Un haltère posé en travers du bassin, tenu à deux mains. |

## Consignes
1. Allonge-toi sur le dos, genoux pliés, pieds à plat à largeur de hanches.
2. Bras le long du corps.
3. Serre les fessiers et pousse dans les talons.
4. Monte le bassin jusqu'à aligner épaules, hanches et genoux.
5. Marque une courte pause, puis redescends lentement.

## Points d'attention
- Ce sont les fessiers qui montent le bassin, pas le bas du dos.
- En haut, ne cambre pas au-delà de l'alignement.
- Genoux dans l'axe, ni ouverts ni serrés.
- Souffle en montant.

## Erreurs fréquentes
- Cambrer le bas du dos en haut.
- Pieds trop loin : on sent surtout l'arrière des cuisses.
- Redescendre en lâchant d'un coup.

## Progression / régression
- plus-facile : aucun
- plus-dur : pont-fessier-une-jambe
**pont-fessier-sol** -> pont-fessier-haltere -> pont fessier sur une jambe (à créer, brouillon M0506)

## Repères de dosage
Voir program-logic.md.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | garder | adapter: sans-charge | retirer |
| Hanche | garder | adapter: sans-charge | retirer |
| Genou | garder | adapter: sans-charge | retirer |

**Notes**
- dos-n2 : sans charge, bassin à mi-hauteur.
- hanche-n2 : sans charge, amplitude réduite.
- genou-n2 : sans charge, pieds un peu plus loin des fesses.
- grossesse : couché sur le dos, donc retiré ; remplaçant conseillé : soulevé de terre roumain aux haltères, charge légère. Post-partum : G7.
- general : version plus douce = pont-fessier-sol à mi-hauteur.

**Grossesse** : retirer: remplacant:souleve-de-terre-roumain-halteres
**Version plus douce** : pont-fessier-sol

Niveau 1 du dos : garder, car la consigne limite déjà la montée à l'alignement épaules-hanches-genoux.



**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au bas du dos ou à la hanche.
- Crampe à l'arrière de la cuisse : pause, puis rapproche les pieds des fesses.
- Douleur dans la nuque : le poids doit reposer sur le haut du dos, pas sur la nuque.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
- `Butt_Lift_Bridge/0.jpg` : affichable : à vérifier (image non regardée ; variante au sol).
- `Butt_Lift_Bridge/1.jpg` : affichable : à vérifier (image non regardée).
Variante haltère : aucune photo libre.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Position, poussée dans les talons, dos droit, pause en haut, descente lente | free-exercise-db « Butt_Lift_Bridge » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Butt_Lift_Bridge.json ; réécrit par coach | base d'exercices (domaine public), pas d'étude | 2026-10-21 | PROVISOIRE |
| Muscles (fessiers ; ischios) | même fiche ; érecteurs ajoutés par coach | idem | 2026-10-21 | PROVISOIRE (ajout NON SOURCÉ) |
| Variante haltère ; pieds trop loin = surtout ischios | pratique courante | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-21 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://www.has-sante.fr/jcms/c_2961499/fr/prise-en-charge-du-patient-presentant-une-lombalgie-commune (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; HAS : fiche mémo PDF lue en entier le 2026-10-21 (https://has-sante.fr/upload/docs/application/pdf/2019-04/fm_lombalgie_v2_2.pdf) ; NICE : résumés seulement | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
| Gêne au genou ou à la hanche de niveau 1-2 : adapter plutôt que tout retirer | Bannuru et al., OARSI 2019, Osteoarthritis Cartilage https://wrap.warwick.ac.uk/125416/ (exercice structuré = traitement de base de l'arthrose du genou et de la hanche) | recommandation internationale (méthode GRADE) ; résumé lu | 2026-10-21 | PROVISOIRE (extrapolation : public arthrosique ; l'app ne pose aucun diagnostic) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
