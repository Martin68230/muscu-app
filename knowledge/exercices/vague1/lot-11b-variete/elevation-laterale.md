---
id: elevation-laterale
nom: Élévation latérale
alias: [élévation latérale, lateral raise]
schema: poussee_v
type: force
niveau_min: debutant
muscles_principaux: [deltoides_lateraux]
muscles_secondaires: [trapezes]
source_brouillon: []
statut: utilisable
---
Élévation latérale, assise ou debout, aux haltères ou à l'élastique. Les variantes assises (échelon 1) sont le point de départ et la version adaptée (dos, grossesse) ; les variantes debout (échelon 2) viennent ensuite. Ce n'est pas un développé : les bras montent sur les côtés, jamais au-dessus de l'horizontale pour le débutant. Fiche voisine : `elevation-laterale-assis-halteres` (même geste assis aux haltères) ; celle-ci ajoute surtout le debout et l'élastique. Isolation : emplacements du générateur, liste fermée d'identifiants ; la fiche n'y entre qu'après ajout de son id par `dev`, une fois la fiche `utilisable`.

## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (assis, dossier derrière le dos), 2 = debout. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| elevation-laterale-chaise-halteres | Assis sur une chaise, haltères | 1 | debutant | halteres, chaise | Chaise stable à 4 pieds, sans roulettes, non pliante, dossier calé contre un mur ; assis, dos contre le dossier, pieds à plat, un haltère très léger par main, bras le long du corps, paumes face aux cuisses. |
| elevation-laterale-chaise-elastique | Assis sur une chaise, élastique | 1 | debutant | elastique, chaise | Même chaise ; assis, dos contre le dossier, pieds à plat sur le milieu de l'élastique, une poignée (ou un bout) dans chaque main, élastique légèrement tendu. |
| elevation-laterale-debout-halteres | Aux haltères | 2 | debutant | halteres | Debout, pieds à largeur de hanches, genoux souples, un haltère très léger par main, bras le long du corps, paumes face aux cuisses, ventre serré. |
| elevation-laterale-debout-elastique | À l'élastique | 2 | debutant | elastique | Debout, pieds à largeur de hanches sur le milieu de l'élastique, chaussures aux pieds, sol non glissant ; une poignée (ou un bout) dans chaque main, bras le long du corps, élastique légèrement tendu. |

## Consignes
1. Choisis une charge très légère (ou l'élastique le plus léger) et mets-toi en position, épaules loin des oreilles, ventre serré.
2. Lève les bras sur les côtés, coudes très légèrement pliés, jusqu'à ce que les mains arrivent à hauteur des épaules, pas plus haut.
3. Garde les mains à la même hauteur que les coudes ou un peu plus bas : les mains ne passent pas au-dessus des coudes.
4. Marque une courte pause en haut, sans hausser les épaules.
5. Redescends en 3 secondes, sans laisser tomber les bras.
6. Respire en continu ; si tu balances le corps pour lever, la charge est trop lourde.

## Points d'attention
- Jamais plus haut que l'horizontale (hauteur des épaules), à tous les niveaux et pour toutes les variantes ; mouvement lent, sans élan. Bras un peu devant le plan du corps plutôt que pile sur le côté, si c'est plus confortable pour l'épaule (NON SOURCÉ).
- Charge très légère, jamais augmentée tant qu'une gêne à l'épaule est signalée (R2) (NON SOURCÉ).
- Avec l'élastique : ne lâche jamais une poignée sous tension ; si un pied bouge ou si l'élastique glisse, arrête : redescends lentement les mains, pose-les, puis dégage l'élastique ; jamais de pas hors de l'élastique tendu (NON SOURCÉ).
- Aucune valeur chiffrée propre à ce mouvement (aucune source).

## Erreurs fréquentes
- Balancer le buste pour lever la charge.
- Hausser les épaules vers les oreilles.
- Monter les bras au-dessus de l'horizontale.
- Descente rapide.
- Bras tendus ou verrouillés.

## Progression / régression
- plus-facile : aucun
- plus-dur : aucun

## Repères de dosage
Doses du générateur (isolation : config.ts ISOLATION et structure-programmes.md STR-ISO ; load-calibration.md). Charge légère pour commencer, aucune hausse tant qu'une gêne est signalée (R2). Aucune valeur propre à ce mouvement (NON SOURCÉ). Débutant : charge la plus légère, jamais augmentée (STR-ISO-3bis).

## Sécurité et contre-indications
Rédigé par `coach` le 2026-11-01 ; relu et corrigé par `kine` le 2026-11-01 ; échelons assis / debout reconfirmés par `kine` le 2026-11-01 (assis = échelon 1, debout = échelon 2, repli vérifié dans safety.ts) ; à contrôler par `relecteur`. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md ; objets du quotidien : §7. Rien ici n'est un diagnostic. Tous les choix par zone sont des choix prudents NON SOURCÉS.

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | adapter: amplitude:bras-bas | retirer | retirer |
| Cou | garder | adapter: amplitude:tete-alignee | retirer |
| Coude | garder | adapter: charge:legere | retirer |
| Poignet | garder | adapter: charge:legere | retirer |
| Dos | garder | adapter: variante:elevation-laterale-chaise-halteres | retirer |

**Notes**
- epaule-n1 : bras jusqu'à mi-hauteur seulement (en dessous de l'horizontale), charge la plus légère.
- epaule-n2 : retrait (bras écartés sous charge).
- cou-n2 : tête dans l'alignement du dos, épaules basses.
- coude-n2 : charge la plus légère, jamais augmentée.
- poignet-n2 : charge la plus légère, jamais augmentée.
- dos-n2 : version assise, dos contre le dossier (aux haltères, ou à l'élastique si tu n'as pas d'haltères).
- general : l'emplacement d'isolation du générateur retire déjà cette fiche dès le niveau 1 de la zone épaule ; les cases de niveau 1 ci-dessus ne servent que si la fiche est choisie ailleurs (choix de la personne ou remplacement d'un autre exercice) ; elles sont moins sévères que ce retrait mais ne le contredisent pas (vérifié par `kine` le 2026-11-01).
- general : zones non listées (hanche, genou, cheville) : garder (choix de `kine`, NON SOURCÉ).
- grossesse : assise, dossier droit, charge très légère (G4) ; aux haltères ou à l'élastique selon ton matériel ; évite de rester debout immobile longtemps. Post-partum : G7.

**Grossesse** : adapter: variante:elevation-laterale-chaise-halteres
**Version plus douce** : elevation-laterale-chaise-halteres

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) à l'épaule, au cou, au coude, au poignet ou au dos ; pincement ou coup sec en haut du mouvement.
- Épaules qui se haussent, buste qui bascule.
- Vertige : arrête et assieds-toi.
- Bras ou main qui s'engourdit ou fourmille.
- Élastique abîmé, glissé ou échappé : arrête tout de suite.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance ; si la douleur de poitrine ne passe pas au repos : urgence (U1).
- Douleur qui dure, qui s'aggrave ou qui réveille la nuit, perte de force, engourdissement, fourmillements : consulte un professionnel de santé (S1, S2).
- Si le réglage enceinte / post-partum est coché : saignement, contractions, fuite d'urine, pesanteur dans le bas-ventre : arrête et contacte ta sage-femme ou ton médecin (G6, G7).

**Objets du quotidien**
- Haltères : manchons et disques bien serrés ; sol dégagé ; pose-les au sol sans les lâcher d'en haut.
- Chaise (variantes assises, regles-securite-communes.md §7) : solide, 4 pieds, sans roulettes, non pliante, dossier contre un mur, sol non glissant ; test avant la séance : appuie-toi dessus de tout ton poids ; si elle bouge, glisse ou grince, ne l'utilise pas (NON SOURCÉ).
- Élastique : le plus léger ; contrôlé en entier avant chaque série (fentes, rayures, amincissements, texture collante) ; un élastique abîmé est jeté (R8) ; jamais accroché à un meuble ou à une porte ; jamais enroulé autour de la main ou du poignet ; chaussures aux pieds, sol non glissant ; tu gardes le visage hors de la ligne de l'élastique.

## Photo
- illustration : public/illustrations/elevation-laterale.svg : affichable : oui (illustration originale de l’app)
- légende : Assis sur la chaise, haltères vus de face. Bras levés jusqu'à l'horizontale, jamais plus haut.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Existence du mouvement (élévation latérale assise ou debout, haltères ou élastique) | pratique courante ; piste de programmes-v3.md §9 ; aucune source primaire lue ; texte d'aucune autre app repris | pratique (pas une étude) | 2026-11-01 | NON SOURCÉ |
| Consignes (limite à l'horizontale, descente lente, sans élan) | réécriture de coach par analogie avec `elevation-laterale-assis-halteres` ; aucune source lue | - | 2026-11-01 | NON SOURCÉ |
| Échelons, niveaux, muscles principaux et secondaires | choix de coach | - | 2026-11-01 | NON SOURCÉ |
| Échelons assis = 1, debout = 2 ; repli vérifié dans le code de sécurité | reconfirmé par `kine` le 2026-11-01 | avis d expert | 2026-11-01 | NON SOURCÉ |
| Tableau par zone, version plus douce, signes d'arrêt | choix prudents de `coach` par extrapolation des règles communes, relus et corrigés par `kine` le 2026-11-01 ; aucune étude ne teste ces adaptations | avis d'expert (extrapolation) | 2026-11-01 | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U | knowledge/regles-securite-communes.md (HAS 2019, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-11-01 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE |
| Grossesse : adapter (assise, charge très légère) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus | 2026-11-01 | principe : OK ; classement de la fiche : NON SOURCÉ (extrapolation de coach) |
