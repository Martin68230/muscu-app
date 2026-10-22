---
id: planche-laterale
nom: Planche latérale
schema: gainage
type: gainage
niveau_min: debutant
muscles_principaux: [obliques, abdominaux]
muscles_secondaires: [moyen_fessier, carre_des_lombes, deltoides_lateraux]
source_brouillon: [M1715, M0514, M1712]
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| planche-laterale-genoux | Sur le genou | 1 | debutant | poids_du_corps, tapis | Couché sur le côté, avant-bras et genou du dessous au sol, genoux pliés. |
| planche-laterale-pieds | Sur les pieds | 2 | debutant | poids_du_corps, tapis | Couché sur le côté, avant-bras et bord du pied au sol, jambes tendues. |

## Consignes
1. Couché sur le côté, coude juste sous l'épaule.
2. Jambes empilées (ou genoux pliés pour la version facile).
3. Monte le bassin pour aligner tête, bassin et pieds (ou genoux).
4. Serre le ventre et les fessiers, respire.
5. Tiens, puis change de côté.

## Points d'attention
- Coude sous l'épaule, épaule loin de l'oreille.
- Bassin dans l'alignement, ni en avant ni en arrière.
- Le bassin ne retombe pas.
- Respire normalement.

## Erreurs fréquentes
- Bassin qui s'affaisse vers le sol.
- Fesses qui partent en arrière.
- Épaule tassée.

## Progression / régression
- plus-facile : aucun
- plus-dur : planche-laterale-jambe-levee
**planche-laterale-genoux** -> planche-laterale-pieds -> planche latérale jambe du dessus levée (à créer)

## Repères de dosage
Voir program-logic.md. Durées de maintien non sourcées : à définir.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | adapter: variante:planche-laterale-genoux | retirer: remplacant:dead-bug | retirer |
| Coude | adapter: appui:serviette | adapter: variante:planche-laterale-genoux | retirer |
| Dos | garder | adapter: variante:planche-laterale-genoux | retirer |
| Hanche | garder | adapter: variante:planche-laterale-genoux | retirer |

**Notes**
- coude-n1 : serviette pliée sous l'avant-bras.
- coude-n2 : sur le genou, serviette sous l'avant-bras.
- dos-n2 : sur le genou, maintien court.
- hanche-n2 : sur le genou, coussin sous le genou.
- grossesse : maintien isométrique prolongé, donc retiré ; remplaçant conseillé : bird-dog sans pause. Post-partum : G7.

**Grossesse** : retirer: remplacant:bird-dog
**Version plus douce** : planche-laterale-genoux



**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente à l'épaule d'appui ou au bas du dos.
- Bassin qui retombe sans que tu puisses le remonter : fin de la série.
- Picotements dans le bras d'appui.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
- `Side_Bridge/0.jpg` : affichable : à vérifier (jugée « version sur les pieds, jambes tendues » par `relecteur` ; fichier WebP absent de public/photos, à créer puis revoir avant d'afficher).
- `Side_Bridge/1.jpg` : affichable : à vérifier (vue le 21/10/2026 : personne couchée sur le côté sur un tapis, semble la position basse ; non confirmée).
Variante genou : aucune photo libre.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Mouvement et muscles (abdominaux ; épaules) | free-exercise-db « Side_Bridge » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Side_Bridge.json (pas de consignes dans la source) | base d'exercices (domaine public) | 2026-10-21 | PROVISOIRE |
| Version débutant : abdos et fessiers serrés, ligne droite de la tête aux talons | NASM Exercise Library « Side Plank » https://nasm.org/exercise-library/side-plank (page non lue, connue par un résumé de moteur de recherche) | organisme de certification | - | NON SOURCÉ (source non lue) |
| Consignes détaillées, obliques en muscle principal | rédigées par coach | pratique courante | 2026-10-21 | NON SOURCÉ |
| Fusion M1715, M0514, M1712 (« Side plank right ») | nettoyage du brouillon | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-21 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://www.has-sante.fr/jcms/c_2961499/fr/prise-en-charge-du-patient-presentant-une-lombalgie-commune (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; HAS : fiche mémo PDF lue en entier le 2026-10-21 (https://has-sante.fr/upload/docs/application/pdf/2019-04/fm_lombalgie_v2_2.pdf) ; NICE : résumés seulement | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
