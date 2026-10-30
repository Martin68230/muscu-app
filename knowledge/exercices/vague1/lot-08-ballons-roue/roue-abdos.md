---
id: roue-abdos
nom: Roue abdominale
alias: [ab wheel, ab roller, rollout à la roue]
schema: gainage
type: gainage
niveau_min: intermediaire
famille_core: gainage
muscles_principaux: [abdominaux, transverse]
muscles_secondaires: [obliques, grand_dorsal, deltoides_anterieurs, flechisseurs_hanche]
source_brouillon: []
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| roue-abdos-mur-genoux | À genoux face à un mur, amplitude courte | 1 | intermediaire | roue_abdos, mur, tapis | À genoux sur un tapis épais, face à un mur plein ; place-toi assez près pour que la roue touche le mur après un roulé court, bras encore bien en avant des épaules. Le mur sert de butée : tu ne peux pas aller trop loin. |
| roue-abdos-genoux | À genoux, amplitude qui augmente peu à peu | 2 | intermediaire | roue_abdos, tapis | À genoux sur un tapis épais, roue au sol sous les épaules ; l'amplitude augmente seulement quand le dos reste plat (voir consignes). |
| roue-abdos-debout | Debout (avancé) | 3 | avance | roue_abdos, tapis | Debout, jambes tendues ou à peine fléchies, pieds à la largeur du bassin, roue au sol devant les pieds ; réservée aux avancés qui font la version à genoux sur toute l'amplitude sans creuser le dos. |

## Consignes
1. Mets un tapis épais et assez long pour que ton buste y tienne en entier sous les genoux et devant toi. Agenouille-toi, genoux à la largeur du bassin, tiens la roue à deux mains, roue posée au sol sous les épaules, bras tendus.
2. Rentre le ventre, serre les fessiers et garde les côtes « collées » vers le bassin : le bas du dos ne doit jamais se creuser.
3. En soufflant, fais rouler la roue lentement devant toi, bras tendus, seulement aussi loin que ton dos reste plat. Le mouvement vient des épaules et du ventre.
4. Dès que le bas du dos veut se creuser ou que le ventre se relâche, arrête-toi (même tôt) et marque une pause d'une seconde.
5. Ramène la roue vers les genoux en serrant le ventre et en tirant avec les bras, sans plier le dos vers l'arrière.
6. Variante au mur : laisse la roue toucher doucement le mur, sans la cogner. En fin de série, pose les genoux et la roue en douceur.

## Points d'attention
- Le risque principal est la cambrure du bas du dos quand le ventre lâche : l'amplitude se gagne sur plusieurs semaines, de quelques centimètres par séance au plus, jamais en une séance (NON SOURCÉ).
- Commence par le mur : la butée limite l'amplitude et rassure ; la version à genoux libre vient ensuite ; la version debout est réservée aux avancés.
- Les fessiers ne partent pas vers l'arrière ni vers les talons ; le bassin ne tombe pas vers le sol.
- Les coudes restent tendus mais sans se bloquer violemment ; les épaules ne montent pas vers les oreilles.
- Respire sans bloquer : souffle en roulant vers l'avant.
- Une roue est un exercice intense pour le ventre : une série courte et propre vaut mieux qu'une série longue (NON SOURCÉ).
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Dos qui se creuse en bas du mouvement.
- Aller trop loin dès la première séance.
- Fessiers qui reculent sur les talons, ou bassin qui tombe.
- Rebond ou élan pour revenir.
- Tête qui tombe entre les bras, ou nuque raide relevée.
- Genoux sans tapis.

## Progression / régression
- plus-facile : rollout-ballon, planche-ballon-avant-bras
- plus-dur : aucun
Échelle : mur à genoux (1) -> à genoux (2) -> debout (3, avancé). On passe à l'échelon suivant seulement quand l'échelon courant se fait sans creuser le dos, séries complètes, plusieurs séances de suite (critère de coach, NON SOURCÉ). Le niveau débutant n'a pas de roue : il passe par la planche, le dead-bug et le Pallof.

## Repères de dosage
Règle du générateur applicable : V-TEMPS, ligne « gainage » (generateur-v1.md §3.3, NON SOURCÉ en entier) : 2 séries, repos 60 s, pas de réserve demandée. Son unité (20 s de maintien pour un débutant, 30 s ensuite) vaut pour une planche tenue, pas pour ce mouvement dynamique : la règle V-DOSE (10 à 15 répétitions) ne s'applique pas ici, car le schéma est « gainage » et non un schéma de répétitions. Aucune règle du générateur ne couvre le gainage dynamique : repère de coach, NON SOURCÉ, à faire appliquer par `dev` à cette fiche : 2 séries, repos 60 s, au plus 6 à 8 répétitions lentes par série (plafond, pas objectif, par analogie avec la ligne « anti_rotation » de V-TEMPS) ; la série s'arrête dès que le dos se creuse, que le ventre lâche ou que le contrôle disparaît, même s'il ne reste que 3 à 5 répétitions propres. Étalonnage (load-calibration.md) : première séance avec la variante la plus facile ou la charge la plus légère disponible ; double progression (d'abord les répétitions ou la durée, puis l'échelon ou le palier suivant). **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24, repris et corrigé par `kine` le 2026-10-24 (à contrôler par `relecteur`). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | retirer | retirer | retirer |
| Épaule | adapter: variante:roue-abdos-mur-genoux | retirer | retirer |
| Coude | adapter: variante:roue-abdos-mur-genoux | retirer | retirer |
| Poignet | adapter: variante:roue-abdos-mur-genoux | retirer | retirer |
| Hanche | garder | adapter: variante:roue-abdos-mur-genoux | retirer |
| Genou | adapter: appui:coussin | retirer | retirer |
| Cheville | garder | adapter: appui:coussin | retirer |
| Cou | adapter: amplitude:tete-alignee | retirer | retirer |

**Notes**
- general : La roue n'est pas proposée au niveau débutant. Aucune charge ajoutée : la difficulté vient du bras de levier (distance de la roue).
- dos-n1 : retiré dès une gêne légère au bas du dos, y compris la variante au mur (choix prudent demandé, NON SOURCÉ ; question Q21 de docs/QUESTIONS.md). Le mur limite la distance mais ne protège pas le dos si le ventre lâche.
- dos-n2 : retiré, comme au niveau 1 : le bas du dos est la zone la plus sollicitée quand le ventre lâche (NON SOURCÉ).
- epaule-n1 : variante au mur, amplitude courte ; aucune augmentation (R2 dès le niveau 2).
- epaule-n2 : retiré : bras tendus en avant, charge sur l'épaule.
- coude-n1 : variante au mur, coudes tendus mais sans se bloquer.
- poignet-n1 : variante au mur, poignets droits ; retiré dès le niveau 2.
- hanche-n2 : variante au mur, amplitude courte, aucune augmentation (R2).
- genou-n1 : coussin épais sous les genoux.
- genou-n2 : retiré : appui prolongé à genoux sur le sol ; la variante debout charge aussi le genou (aucune variante sans-zone).
- cheville-n2 : coussin sous le dessus du pied.
- cou-n1 : tête dans le prolongement du dos, regard vers le sol entre les mains.
- grossesse : retirée : pression abdominale élevée, ventre non soutenu, risque de séparation des grands droits (diastasis) ; remplaçant : bird-dog (maintien court). Post-partum : G7, la roue est retirée tant que le réglage est coché (NON SOURCÉ ; la HAS ne cite pas cet exercice).

**Grossesse** : retirer: remplacant:bird-dog
**Version plus douce** : roue-abdos-mur-genoux

**Sécurité pour l'utilisateur seul**
- Réservée aux intermédiaires et avancés qui savent déjà tenir une planche ou un rollout au ballon sans creuser le dos ; sinon commence par ces exercices (plus-facile).
- Variante au mur : la roue ne peut pas partir plus loin que le mur ; vérifie que le mur est plein et dégagé et que tes genoux ne glissent pas.
- Vérifie la roue (poignées serrées, sans jeu) et le tapis (qui ne glisse pas) avant la première série.
- Pas d'échec : arrête la série avec au moins 2 répétitions en réserve et dès que le bas du dos se creuse ; en cas de doute sur l'amplitude, reste plus près.
- Si tu ne peux plus revenir (sortie de secours) : ne lâche pas la roue d'un coup et ne te jette pas en arrière. À genoux : plie les coudes et pose doucement le ventre puis la poitrine sur le tapis (il doit être assez long pour que le buste y tienne en entier), puis relève-toi. Debout : pose d'abord les genoux sur le tapis, puis le ventre et la poitrine. Essaie cette sortie une fois à vide, roue peu avancée, avant la première vraie série ; si tu ne peux pas la faire ou si le tapis est trop court, ne fais pas l'exercice (NON SOURCÉ).
- Variante debout : seulement sur un sol non glissant, chaussures fermées aux pieds, tapis long posé devant toi dans l'axe ; à ne faire que si la version à genoux est maîtrisée sur toute l'amplitude depuis plusieurs semaines.
- Quelqu'un dans la maison, à portée de voix, de préférence.

**Points d'attention (kine)**
- Dos : tout le sujet de cette fiche. Le ventre qui lâche laisse le bas du dos se creuser sous charge : arrêt immédiat à la première sensation de cambrure ; dès une gêne légère au bas du dos, l'exercice n'est plus proposé (NON SOURCÉ).
- Poignet, coude : les deux poignets restent droits sur la roue ; une douleur à la face du coude ou au poignet = arrêt, retour à la variante au mur au niveau 1, retrait au niveau 2.
- Épaule : bras tendus au-dessus de la tête en fin de course : amplitude limitée, jamais jusqu'à la fin de la course si l'épaule tire.
- Hanche : les fléchisseurs de hanche tirent aussi ; si c'est surtout l'avant de la hanche ou de la cuisse qui travaille, l'amplitude est trop grande.
- Grossesse et post-partum : retirée (pression abdominale, séparation des grands droits) ; fuite d'urine, pesanteur dans le bas-ventre ou bombement du ventre à l'effort : arrêt et avis de la sage-femme.
- Niveau : intermédiaire minimum, par choix de prudence de coach (les études mesurent le muscle, pas le risque pour un débutant).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au bas du dos, à l'épaule, au coude, au poignet ou au genou.
- Sensation que le bas du dos se creuse ou que le ventre lâche : arrête la série.
- Pincement ou tiraillement à l'avant de la hanche ou de la cuisse qui devient le seul endroit qui travaille.
- Perte de contrôle de la roue ou du mouvement de retour : arrête la série.
- En post-partum : fuite d'urine à l'effort, pesanteur dans le bas-ventre, bombement du ventre à l'effort : arrêt et avis de la sage-femme (G7).
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe : arrête.

**Objets du quotidien**
- Roue abdominale : poignées bien fixées, roue qui tourne droit et sans jeu, rien qui frotte ; une roue qui grince, se desserre ou vacille : on ne l'utilise plus (NON SOURCÉ : aucune notice lue).
- Tapis épais ou coussin ferme sous les genoux (le sol nu fait mal et fait glisser) ; il ne doit pas glisser lui-même.
- Sol plat, lisse, sec, non glissant, sans tapis souple qui plisse sous la roue ; un mur plein et dégagé devant toi pour la première variante ; rien derrière ni devant sur la trajectoire de la roue.
- Chaussures fermées à semelle plate pour la variante debout ; pas de chaussettes seules sur un sol lisse.

## Photo
- `Ab_Roller/0.jpg` : affichable : non (logo de marque lisible sur la chaussure ; la photo ne montre ni le mur ni la butée de la variante 1 ; remplacée par l'illustration)
- `Ab_Roller/1.jpg` : affichable : non (logo de marque lisible sur la chaussure ; la photo ne montre ni le mur ni la butée de la variante 1 ; remplacée par l'illustration)
- illustration : public/illustrations/roue-abdos.svg : affichable : oui (illustration originale de l'app, 24/10/2026 ; à genoux face à un mur, vue de profil : roue sous les épaules puis roulé court, la roue touche le mur)
- légende : Variante au mur (échelon 1). Les variantes à genoux libre et debout ne sont pas dessinées.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet, consignes de départ) : Ab_Roller (niveau « intermediate », matériel « other ») | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db ; fichier dist/exercises.json relu le 2026-10-24 pour vérifier l'existence de l'entrée, son niveau et son matériel ; consignes réécrites par coach | base d'exercices (pratique, pas une étude) | 2026-10-24 | PROVISOIRE |
| Les exercices avec dispositif roulant (Torso Track, Ab Slide) activent beaucoup les abdominaux avec peu d'activité du bas du dos et des fléchisseurs de hanche | Escamilla et coll., J Orthop Sports Phys Ther 2006;36(2):45-57 (14 sujets, 7 machines du commerce + 2 exercices courants) ; résumé lu via moteur de recherche ; le résumé nomme un « Ab Roller » (appareil à berceau et rail), qui n'est pas une roue libre : la roue abdominale simple n'est pas testée dans les résultats lus | étude de laboratoire en EMG, petit échantillon ; ne mesure ni la charge lombaire ni les blessures | 2026-10-24 | PROVISOIRE (résumé seulement ; extrapolation de dispositifs voisins à la roue : NON SOURCÉ) |
| Ab-Slide : plus forte activation du droit de l'abdomen et des obliques parmi les exercices comparés | Youdas et coll., J Strength Cond Res 2008 (volume et pages non vérifiés) ; résultat lu seulement dans une présentation tierce trouvée via moteur de recherche (texte non lu) | étude de laboratoire en EMG ; adultes sains ; ne concerne pas la sécurité | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Séparation des grands droits (diastasis) fréquente pendant la grossesse et après l'accouchement ; justifie de retirer les exercices à forte pression abdominale | Benjamin, van de Water, Peiris, Physiotherapy 2014;100(1):1-8 (revue systématique sur l'effet de l'exercice sur le diastasis) ; seule la référence et la question posée ont été lues, pas les conclusions | revue systématique ; conclusions non lues | 2026-10-24 | NON SOURCÉ (référence citée comme contexte ; la règle de retrait vient de coach et du principe G7) |
| Niveau minimum intermédiaire et progression mur -> genoux -> debout | avis de coach (aucune source sur la progression de la roue ni sur son risque pour un débutant) | - | 2026-10-24 | NON SOURCÉ |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Roue, tapis, mur, sol | pratique de salle et raisonnement de coach ; aucune notice de fabricant lue | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 2026-10-24, à contrôler par relecteur) |
| Grossesse et post-partum : roue retirée (pression abdominale, diastasis) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe (éviter isométrique prolongé, Valsalva, chute, couché sur le dos) : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, confirmé par kine, NON SOURCÉ) |
