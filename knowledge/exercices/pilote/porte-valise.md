---
id: porte-valise
nom: Porté valise (une main)
schema: porte
type: fonctionnel
niveau_min: debutant
muscles_principaux: [obliques, avant_bras]
muscles_secondaires: [carre_des_lombes, moyen_fessier, trapezes, abdominaux]
source_brouillon: [M0598]
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| porte-valise-haltere | Un haltère | 1 | debutant | halteres | Un haltère posé au sol à côté du pied. |
| porte-valise-bidon-sac | Un bidon ou un sac | 1 | debutant | bidons_ou_sacs | Un bidon d'eau ou un sac solide avec une poignée confortable. |

## Consignes
1. Charge au sol à côté d'un pied.
2. Plie les jambes, dos droit, attrape la poignée.
3. Relève-toi : la charge pend le long de ta jambe.
4. Marche droit, sans pencher du côté de la charge.
5. Pose la charge jambes fléchies, change de main et refais le trajet.

## Points d'attention
- Épaules à la même hauteur.
- Ne penche pas vers la charge, ni à l'opposé.
- Ventre serré, buste grand.
- Le bras libre reste détendu.

## Erreurs fréquentes
- Se pencher sur le côté.
- Ramasser la charge dos rond.
- Hausser l'épaule qui porte.

## Progression / régression
- plus-facile : marche-du-fermier
- plus-dur : aucun
marche-du-fermier <- **porte-valise** -> charge plus lourde ou trajet plus long

## Repères de dosage
Voir program-logic.md §10 (portés : distance ou temps ; valeurs NON SOURCÉES).

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: charge:legere | adapter: variante:marche-du-fermier | retirer |
| Épaule | garder | adapter: charge:legere | retirer |
| Cou | garder | adapter: charge:legere | retirer |
| Coude | garder | adapter: charge:legere | retirer |
| Poignet | garder | adapter: charge:legere | retirer |
| Hanche | garder | adapter: charge:legere | retirer |

**Notes**
- dos-n2 : charge légère répartie des deux côtés (marche du fermier).
- hanche-n2 : trajet court.
- grossesse : charge légère, poids connu, respiration continue. Post-partum : G7.
- general : version plus douce = marche du fermier plus légère.

**Grossesse** : adapter: charge:legere
**Version plus douce** : marche-du-fermier



**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au dos ou sur le côté du tronc.
- Tu penches vers la charge sans pouvoir te redresser : charge trop lourde.
- Prise qui lâche ou doigts qui fourmillent.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Bidon bien fermé ou sac solide, poignée confortable ; poids connu (pèse-personne avec et sans).
- Chemin dégagé, sol sec, jamais dans un escalier.

## Photo
- aucune photo
- illustration : public/illustrations/porte-valise.svg : affichable : oui (illustration originale de l'app)
Aucune photo affichable (affichable : sans objet).

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Un haltère dans une main à côté de la hanche, marcher une distance puis revenir, changer de bras, dos droit | ACE Exercise Library « Suitcase Carry » https://www.acefitness.org/education-and-resources/lifestyle/exercise-library/358/ ; réécrit par coach | organisme de certification, pratique professionnelle | 2026-10-21 | PROVISOIRE |
| Ne pas pencher, épaules de niveau, muscles (obliques, carré des lombes…) | rédigé par coach (ACE ne nomme pas les muscles) | pratique courante | 2026-10-21 | NON SOURCÉ |
| Niveau débutant (ACE dit intermédiaire) | choix de coach avec charge légère, à trancher | - | - | NON SOURCÉ |
| Soulever et poser jambes fléchies, dos neutre | exercise-catalog.md §5 (source de blog) | synthèse | 2026-10-21 | PROVISOIRE |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-21 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://www.has-sante.fr/jcms/c_2961499/fr/prise-en-charge-du-patient-presentant-une-lombalgie-commune (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; HAS : fiche mémo PDF lue en entier le 2026-10-21 (https://has-sante.fr/upload/docs/application/pdf/2019-04/fm_lombalgie_v2_2.pdf) ; NICE : résumés seulement | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
| Avertissement sur le sac, les bidons ou les sacs (contenu calé, poids connu) | règle de conception (exercise-catalog.md §5) ; aucune source trouvée | - | 2026-10-21 | NON SOURCÉ |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
