---
id: souleve-de-terre-roumain-unijambiste
nom: Soulevé de terre roumain sur une jambe
schema: charniere
type: force
niveau_min: intermediaire
muscles_principaux: [ischios, fessiers]
muscles_secondaires: [erecteurs_rachis, moyen_fessier]
source_brouillon: [M0926]
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| sdt-unijambiste-mur | Poids du corps, main au mur | 1 | intermediaire | poids_du_corps, mur | Debout à côté d'un mur, une main posée pour l'équilibre. |
| sdt-unijambiste-poids-du-corps | Poids du corps, sans appui | 2 | intermediaire | poids_du_corps | Debout, espace dégagé. |
| sdt-unijambiste-haltere | Un haltère | 2 | intermediaire | halteres | Haltère dans la main opposée à la jambe d'appui. |

## Consignes
1. En appui sur une jambe, genou légèrement fléchi.
2. Penche le buste en avant et envoie l'autre jambe derrière.
3. Buste et jambe arrière forment une ligne droite.
4. Garde le bassin face au sol, sans l'ouvrir sur le côté.
5. Remonte en poussant la hanche d'appui vers l'avant.

## Points d'attention
- Dos plat.
- Bassin bien de face.
- Va lentement : l'équilibre fait partie de l'exercice.
- Si tu perds l'équilibre, pose le pied arrière et reprends.

## Erreurs fréquentes
- Bassin qui s'ouvre (la hanche de la jambe arrière monte sur le côté).
- Dos qui s'arrondit.
- Genou d'appui verrouillé.

## Progression / régression
souleve-de-terre-roumain-halteres <- **sdt-unijambiste-mur** -> sdt-unijambiste-poids-du-corps -> sdt-unijambiste-haltere

## Repères de dosage
Voir program-logic.md.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Chaque case contient un seul choix : `garder` (exercice tel quel), `adapter : <action précise>` (`variante:<id>`, `charge:légère`, `sans-charge`, `amplitude:...`, `appui:...`) ou `retirer` (avec `remplaçant` ou `sans-zone:<id>` si la fiche en nomme un) ; vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter : variante:sdt-unijambiste-mur, sans-charge | retirer (remplaçant : pont-fessier) | retirer |
| Hanche | adapter : variante:sdt-unijambiste-mur | adapter : variante:souleve-de-terre-roumain-halteres, charge:légère (deux pieds) | retirer |
| Genou | garder | adapter : variante:souleve-de-terre-roumain-halteres (deux pieds) | retirer |
| Cheville | adapter : variante:sdt-unijambiste-mur | adapter : variante:souleve-de-terre-roumain-halteres (deux pieds) | retirer |

**Version plus douce** : `sdt-unijambiste-mur`, puis `souleve-de-terre-roumain-halteres` (deux pieds au sol).

**Grossesse** (G1 à G8 de regles-securite-communes.md ; avis du médecin ou de la sage-femme avant tout programme) : adapter : variante:sdt-unijambiste-mur (appui:mur), sans-charge. Post-partum : G7.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au dos, à la hanche, au genou ou à la cheville d'appui.
- Pertes d'équilibre répétées : repasse à la version mur.
- Cheville qui se tord.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
Aucune photo libre (affichable : sans objet).

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Mouvement et consignes | Brouillon M0926 (wger « Romanian deadlift, single leg ») ; consignes rédigées par coach | pratique courante, pas d'étude | 2026-10-21 | NON SOURCÉ |
| Muscles | déduits du soulevé roumain (free-exercise-db « Stiff-Legged_Dumbbell_Deadlift ») ; moyen fessier ajouté par coach | - | 2026-10-21 | NON SOURCÉ |
| Niveau intermédiaire (équilibre) | choix de coach | - | - | NON SOURCÉ |
| Unilatéral utile quand les haltères sont trop légers | equipment-taxonomy.md §3 point 4 (règle de conception) | - | 2026-10-21 | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-21 | R1, R2, R3, R7, R8 : NON SOURCÉ ; R4, R5, R6, R9 (partie), R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://www.has-sante.fr/jcms/c_2961499/fr/prise-en-charge-du-patient-presentant-une-lombalgie-commune (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; HAS : fiche mémo PDF lue en entier le 2026-10-21 (https://has-sante.fr/upload/docs/application/pdf/2019-04/fm_lombalgie_v2_2.pdf) ; NICE : résumés seulement | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
| Gêne au genou ou à la hanche de niveau 1-2 : adapter plutôt que tout retirer | Bannuru et al., OARSI 2019, Osteoarthritis Cartilage https://wrap.warwick.ac.uk/125416/ (exercice structuré = traitement de base de l'arthrose du genou et de la hanche) | recommandation internationale (méthode GRADE) ; résumé lu | 2026-10-21 | PROVISOIRE (extrapolation : public arthrosique ; l'app ne pose aucun diagnostic) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
