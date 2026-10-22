---
id: traction-barre
nom: Traction à la barre
schema: tirage_v
type: force
niveau_min: intermediaire
muscles_principaux: [grand_dorsal]
muscles_secondaires: [biceps, trapezes, rhomboides, avant_bras]
source_brouillon: []
statut: controle_relecteur
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| traction-barre-scapulaire | Tirage d'épaules suspendu (omoplates seules) | 1 | intermediaire | barre_traction | Suspendu à la barre, bras tendus, pieds au sol ou jambes pliées. |
| traction-barre-assistee-elastique | Traction assistée par un élastique | 2 | intermediaire | barre_traction, elastique | Élastique solide noué à la barre, pied ou genou dans la boucle. |
| traction-barre-supination | Traction mains vers soi | 3 | intermediaire | barre_traction | Prise mains vers soi, largeur d'épaules. |
| traction-barre-pronation | Traction mains vers l'avant | 4 | intermediaire | barre_traction | Prise mains vers l'avant, un peu plus large que les épaules. |

## Consignes
1. Prise ferme sur la barre, bras tendus, corps stable.
2. Échelon 1 : sans plier les coudes, abaisse les omoplates pour te hisser de quelques centimètres, puis relâche lentement.
3. Échelons 2 à 4 : tire les coudes vers le sol pour monter le menton au-dessus de la barre, poitrine vers la barre.
4. Redescends lentement jusqu'aux bras tendus, sans lâcher d'un coup.
5. Garde le corps gainé, sans balancement.

## Points d'attention
- Barre : fixation solide et testée avant chaque usage (R8) ; réception au sol dégagée.
- Le rythme de progression passe par l'échelon 1 puis l'élastique : ne saute pas d'étape.
- Aucune charge, durée ni nombre sourcés.

## Erreurs fréquentes
- Se balancer pour monter.
- Hausser les épaules vers les oreilles.
- Descendre en chute libre.

## Progression / régression
- plus-facile : tirage-vertical-elastique-haut
- plus-dur : aucun

## Repères de dosage
Voir program-logic.md et load-calibration.md. Aucune valeur propre à ce mouvement.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-22. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3). L'app n'a pas de zone « aine », « cuisse » ni « tendon d'Achille » : une gêne à l'aine se déclare sous « hanche », à l'arrière de la cuisse sous « hanche » ou « genou », au tendon d'Achille sous « cheville ».

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | adapter: variante:traction-barre-assistee-elastique | retirer | retirer |
| Coude | adapter: variante:traction-barre-assistee-elastique | retirer: remplacant:tirage-vertical-elastique-haut | retirer |
| Poignet | adapter: variante:traction-barre-assistee-elastique | retirer: remplacant:tirage-vertical-elastique-haut | retirer |
| Cou | garder | adapter: variante:traction-barre-assistee-elastique | retirer |
| Dos | garder | adapter: variante:traction-barre-assistee-elastique | retirer |

**Notes**
- epaule-n1 : assistée par l'élastique : moins de poids sur l'épaule.
- epaule-n2 : retiré (suspension sous poids du corps) ; le tirage vertical à l'élastique n'est pas proposé non plus avec une gêne nette d'épaule : l'app propose un autre exercice de tirage sans la zone.
- coude-n1 : assistée par l'élastique.
- coude-n2 : retiré (suspension et tirage lourd) ; remplacé par l'élastique.
- poignet-n1 : assistée par l'élastique : moins de poids sur la prise.
- poignet-n2 : retiré (prise sous poids du corps) ; remplacé par l'élastique.
- cou-n2 : assistée, tête alignée.
- dos-n2 : assistée, sans balancement.
- grossesse : suspension avec effort intense, prise forte et risque de chute (G4 : isométrique prolongé, Valsalva, extrapolation ; G5 plafond d'intensité) ; remplacé par le tirage à l'élastique, à charge légère. Post-partum : G7 (sans effet direct).
- general : fiche entièrement en niveau intermédiaire (décision de prudence de `kine`) : le format n'a pas de champ « prérequis », et la suspension sous le poids du corps n'est pas un bon point de départ pour un débutant ; il commence par le tirage vertical à l'élastique. Conseil non codé : prérequis « sans gêne à l'épaule, au coude ni au poignet ». Pas d'élan ni de balancement. Version plus douce : tirage-vertical-elastique-haut.

**Grossesse** : retirer: remplacant:tirage-vertical-elastique-haut
**Version plus douce** : tirage-vertical-elastique-haut

**Signes qui doivent faire arrêter**
- Engourdissement, fourmillements ou sensation de décharge pendant la position : relâche immédiatement ; si cela revient ou ne passe pas, consulte un professionnel de santé (S2).
- Douleur à l'épaule, au coude ou au poignet, ou « pincement » en haut du mouvement : redescends en contrôle, pieds au sol, arrête.
- Perte de prise, tremblement fort des bras : descends et arrête.
- Douleur dans la poitrine, malaise, vertige : arrête (R5) ; urgence si elle ne passe pas au repos (U1).
- Douleur qui dure, qui s'aggrave ou qui réveille la nuit, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2) ; ces signes n'ont pas à être « diagnostiqués » par toi.
- Si le réglage « enceinte / post-partum » est coché : saignement, perte de liquide, contractions, vertige, douleur ou gonflement d'un mollet, fuite d'urine ou pesanteur dans le bas-ventre : arrête et contacte ta sage-femme ou ton médecin (G6, G7) ; en cas de saignement, de perte des eaux ou de contractions régulières : urgence, voir U1.

**Objets du quotidien**
- Barre : fixation solide et testée avant chaque usage (R8) : barre de porte selon la notice (cadre sain, charge maximale respectée, verrouillage vérifié) ou fixation murale dans un support porteur ; test progressif : se suspendre d'abord pieds au sol, puis tirer doucement. Si elle bouge, grince ou glisse : arrêt, et elle n'est plus utilisée.
- Plafond ou linteau : tête et dos dégagés ; réception au sol dégagée (tapis), jamais de saut brutal depuis la barre.
- Élastique de la variante assistée : solide, noué selon la notice, contrôlé avant chaque usage (fissures, usure) ; remplace-le s'il est abîmé. Ne le lâche pas d'un coup.
- Si l'objet bouge, glisse ou grince : arrêt, et l'objet n'est plus utilisé (R8).

## Photo
- `Scapular_Pull-Up/0.jpg` : affichable : à vérifier (image non regardée ; échelon 1)
- `Scapular_Pull-Up/1.jpg` : affichable : à vérifier (image non regardée ; échelon 1)
- `Band_Assisted_Pull-Up/0.jpg` : affichable : à vérifier (image non regardée ; échelon 2)
- `Band_Assisted_Pull-Up/1.jpg` : affichable : à vérifier (image non regardée ; échelon 2)
- `Chin-Up/0.jpg` : affichable : à vérifier (image non regardée ; échelon 3)
- `Chin-Up/1.jpg` : affichable : à vérifier (image non regardée ; échelon 3)
- `Pullups/0.jpg` : affichable : à vérifier (image non regardée ; échelon 4)
- `Pullups/1.jpg` : affichable : à vérifier (image non regardée ; échelon 4)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Traction : scapulaire, assistée par élastique, supination, pronation | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db, entrées « Scapular_Pull-Up », « Band_Assisted_Pull-Up », « Chin-Up » et « Pullups » (descriptions lues le 22/10/2026) | base d'exercices (pratique, pas une étude) | 2026-10-22 | PROVISOIRE |
| Échelons, niveaux, muscles et répartition principaux / secondaires | choix de coach (décision de format de l'utilisateur, 21/10/2026) | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-22 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-22 | NON SOURCÉ (extrapolation, à valider) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-22 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
