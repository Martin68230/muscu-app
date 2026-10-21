---
id: bird-dog
nom: Bird dog (quadrupédie bras-jambe opposés)
schema: anti_rotation
type: gainage
niveau_min: debutant
muscles_principaux: [abdominaux, erecteurs_rachis, fessiers]
muscles_secondaires: [obliques, deltoides_anterieurs, moyen_fessier]
source_brouillon: [M0458]
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| bird-dog-sol | Au sol | 1 | debutant | poids_du_corps, tapis | À quatre pattes sur un tapis. |

## Consignes
1. À quatre pattes : mains sous les épaules, genoux sous les hanches.
2. Serre le ventre, dos plat.
3. Tends une jambe en arrière et le bras opposé devant.
4. Monte-les jusqu'à l'horizontale au maximum, sans tourner le bassin.
5. Reviens en contrôlant, puis change de côté.

## Points d'attention
- Hanches et épaules restent à la même hauteur.
- Tête dans l'alignement du dos.
- Ne monte pas plus haut que ce que ton dos contrôle.
- Un miroir aide à vérifier.

## Erreurs fréquentes
- Bassin qui s'ouvre quand la jambe monte.
- Bas du dos qui se creuse.
- Aller trop vite.

## Progression / régression
jambe seule ou bras seul (à créer) <- **bird-dog** -> bird-dog avec pause de quelques secondes bras et jambe tendus

## Repères de dosage
Voir program-logic.md.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Chaque case contient un seul choix : `garder` (exercice tel quel), `adapter : <action précise>` (`variante:<id>`, `charge:légère`, `sans-charge`, `amplitude:...`, `appui:...`) ou `retirer` (avec `remplaçant` ou `sans-zone:<id>` si la fiche en nomme un) ; vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Poignet | adapter : appui:poings fermés (poignet droit) | adapter : appui:avant-bras | retirer (remplaçant : dead-bug) |
| Genou | adapter : appui:coussin plié sous les genoux | adapter : appui:coussin épais | retirer (remplaçant : dead-bug) |
| Épaule | adapter : amplitude:bras moins haut | retirer (remplaçant : dead-bug, bras au sol) | retirer |
| Dos | adapter : amplitude:hauteur réduite | adapter : amplitude:jambe seule, petite amplitude | retirer |
| Hanche | garder | adapter : amplitude:bras seul | retirer |

**Version plus douce** : bras seul ou jambe seule (fiche à créer) ; sinon `dead-bug`.

**Grossesse** (G1 à G8 de regles-securite-communes.md ; avis du médecin ou de la sage-femme avant tout programme) : adapter : sans pause en position tendue (pas de maintien prolongé), respiration continue. Post-partum : G7.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au bas du dos, au poignet ou au genou d'appui.
- Bassin qui tourne ou bascule sans contrôle.
- Bas du dos qui se creuse.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
Aucune photo affichable (affichable : sans objet ; fiche wger : licence de l'image à contrôler).

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Installation à quatre pattes, gainage, jambe et bras opposés vers l'horizontale, hanches et épaules de niveau, tête alignée, hauteur limitée par le contrôle du bas du dos, miroir | ACE Exercise Library « Bird dog » https://www.acefitness.org/resources/everyone/exercise-library/14/bird-dog/ ; réécrit par coach | organisme de certification, pratique professionnelle | 2026-10-21 | PROVISOIRE |
| Muscles (abdos, dos, fessiers/hanches) | même page | idem | 2026-10-21 | PROVISOIRE |
| Niveau débutant (ACE dit intermédiaire) | choix de coach, à trancher | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-21 | R1, R2, R3, R7, R8 : NON SOURCÉ ; R4, R5, R6, R9 (partie), R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://www.has-sante.fr/jcms/c_2961499/fr/prise-en-charge-du-patient-presentant-une-lombalgie-commune (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; HAS : fiche mémo PDF lue en entier le 2026-10-21 (https://has-sante.fr/upload/docs/application/pdf/2019-04/fm_lombalgie_v2_2.pdf) ; NICE : résumés seulement | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
