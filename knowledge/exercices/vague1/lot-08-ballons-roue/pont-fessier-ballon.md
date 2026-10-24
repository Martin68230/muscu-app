---
id: pont-fessier-ballon
nom: Pont fessier avec un ballon de gym
alias: [physioball hip bridge, bridge swiss ball]
schema: charniere
type: force
niveau_min: intermediaire
muscles_principaux: [fessiers]
muscles_secondaires: [ischios, quadriceps, erecteurs_rachis]
source_brouillon: []
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| pont-fessier-ballon-haut-du-dos | Haut du dos sur le ballon | 1 | intermediaire | swiss_ball, tapis | Haut du dos et épaules sur le ballon, pieds à plat au sol bien écartés, bassin qui descend sous le niveau des épaules. |
| pont-fessier-ballon-talons | Talons sur le ballon, deux jambes | 2 | intermediaire | swiss_ball, tapis | Couché sur le dos, talons sur le ballon, jambes tendues ; tu soulèves les hanches. |
| pont-fessier-ballon-talons-une-jambe | Talons sur le ballon, une jambe (avancé) | 3 | avance | swiss_ball, tapis | Même position, une jambe levée en l'air, l'autre talon sur le ballon. |

## Consignes
1. Variante 1 : assieds-toi sur le ballon, avance les pieds en roulant jusqu'à avoir le haut du dos et les épaules sur le ballon, pieds à plat et écartés, cuisses horizontales.
2. Garde le ventre serré, le bassin bas : descends le bassin sans toucher le sol, puis pousse sur les talons pour monter jusqu'à aligner buste et cuisses.
3. Serre les fessiers en haut une seconde, regard devant, menton légèrement rentré, sans jamais laisser la tête tomber en arrière ni cambrer la nuque.
4. Redescends lentement. Variantes 2 et 3 : couché sur le dos, talons sur le ballon, soulève le bassin en poussant sur les talons, jambes tendues.
5. Pose le bassin au sol en fin de série avant de bouger le ballon ; ne roule pas le ballon d'un coup.

## Points d'attention
- Le ballon sert à varier la stabilité, pas à rendre le pont plus efficace pour les fessiers : le pont au sol marche aussi bien (voir sources).
- Les fessiers font le travail : pas de cambrure du bas du dos en haut.
- Pieds écartés en variante 1 : l'équilibre est meilleur.
- Les variantes talons sur le ballon sont plus dures pour les ischios et plus exposées à la crampe.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Cambrer fort en haut.
- Pieds trop rapprochés.
- Bassin qui tombe.
- Ballon qui roule de côté.
- Poussée sur les orteils.

## Progression / régression
- plus-facile : pont-fessier
- plus-dur : curl-ischios-ballon

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE ; ACSM 2026, SRC1 : 2 à 3 séries par exercice) : cet exercice est sans charge extérieure (aucun tag de la liste « chargeable ») : 10 à 15 répétitions ; séries : 2 pour un débutant, 3 pour un intermédiaire ou un avancé en « muscle » (2 pour un exercice « autre » en force) ; réserve cible 3 (débutant) à 2, jamais 0 ; repos 90 s (120 s pour un exercice pilier d'intermédiaire). Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. Étalonnage (load-calibration.md) : première séance avec la variante la plus facile ou la charge la plus légère disponible ; double progression (d'abord les répétitions ou la durée, puis l'échelon ou le palier suivant). **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24, repris et corrigé par `kine` le 2026-10-24 (à contrôler par `relecteur`). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: amplitude:reduite | adapter: variante:pont-fessier-ballon-haut-du-dos | retirer |
| Hanche | garder | adapter: amplitude:reduite | retirer |
| Genou | garder | adapter: amplitude:reduite | retirer |
| Cheville | garder | adapter: amplitude:reduite | retirer |
| Cou | adapter: amplitude:tete-alignee | adapter: amplitude:tete-alignee | retirer |
| Cuisse | adapter: variante:pont-fessier-ballon-haut-du-dos | adapter: variante:pont-fessier-ballon-haut-du-dos | retirer |
| Aine | garder | adapter: amplitude:reduite | retirer |

**Notes**
- dos-n1 : bassin moins haut, sans cambrer.
- dos-n2 : variante 1, aucune augmentation (R2).
- cou-n1 : regard devant, menton légèrement rentré.
- cuisse-n1 : variante 1 (ischios peu sollicités), NON SOURCÉ.
- cuisse-n2 : variante 1 (ischios peu sollicités), aucune augmentation (R2), NON SOURCÉ.
- grossesse : retiré : semi-allongé sur le dos ou allongé sur le dos (G4) ; remplaçant : roumain aux haltères, charge légère. Post-partum : G7.

**Grossesse** : retirer: remplacant:souleve-de-terre-roumain-halteres
**Version plus douce** : pont-fessier

**Sécurité pour l'utilisateur seul**
- Variante 1 : ballon calé contre un mur plein derrière toi, tapis ferme, pieds bien écartés, menton légèrement rentré (la tête ne tombe pas en arrière). Sortie de secours si le ballon part ou si tu perds l'équilibre : laisse-toi glisser vers le sol sur les fesses, pieds restant au sol, en gardant le menton rentré et sans te retenir avec les bras tendus. Premier essai : bassin à peine soulevé, un seul aller-retour. Rien de dur ni de pointu autour (NON SOURCÉ).
- Variantes 2 et 3 : tapis antidérapant, ballon bien gonflé, mur ou meuble lourd derrière les pieds à distance où le ballon s'arrête. Sortie de secours si une crampe survient ou si les ischios lâchent : tends doucement les jambes en laissant le ballon rouler et pose le bassin au sol, puis étire doucement, arrête. Ballon qui part de côté : relâche-toi sur le dos, les hanches descendent au sol.
- Variante une jambe : seulement si les deux jambes se font sans crampe ni creux dans le dos, plusieurs séances de suite.

**Points d'attention (kine)**
- Dos : en haut du pont, éviter la cambrure ; amplitude réduite dès la première gêne ; dès une gêne nette, variante 1 sans augmentation (R2), dès la douleur retiré.
- Cou : variante 1, la tête dépasse le ballon : regard devant, menton légèrement rentré, jamais la tête qui tombe en arrière ; dès une gêne nette au cou, tête alignée et amplitude réduite, dès la douleur retiré (NON SOURCÉ).
- Cuisse : variantes talons sur le ballon = ischios très sollicités ; variante 1 retenue dès la gêne légère (choix prudent, NON SOURCÉ). Extrapolation à signaler : l'étude sur le pont dorsal (Lehman 2005) portait sur un pont à pieds ou talons, pas sur la variante haut du dos sur le ballon.
- Grossesse et post-partum : retiré (couché ou semi-allongé sur le dos, instabilité) ; en post-partum, fuite d'urine ou pesanteur dans le bas-ventre à l'effort : arrêt et avis de la sage-femme (G7).
- Niveau : intermédiaire minimum (le pont au sol couvre le débutant ; l'ajout du ballon donne un risque de chute sans gain net, CSEP), par prudence, NON SOURCÉ ; avancé pour une jambe.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au bas du dos, à la hanche, au genou ou à l'arrière de la cuisse.
- Crampe à l'arrière de la cuisse : pose le bassin et arrête.
- Ballon qui part ou bassin qui tombe : arrête la série.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe : arrête.

**Objets du quotidien**
- Ballon de gym (swiss ball) : gonflé fermement (il ne s'écrase pas sous toi), sans fuite ni déchirure, de préférence un modèle « anti-éclatement » dont la charge maximale écrite dépasse ton poids (NON SOURCÉ : consigne de prudence de coach, aucune notice lue). Un ballon qui se dégonfle, qui glisse ou qui fait un bruit suspect : on ne l'utilise plus.
- Taille : assis sur le ballon, les cuisses sont à peu près horizontales (repère de pratique, NON SOURCÉ). Trop grand ou trop mou : l'exercice devient plus instable.
- Sol plat, sec, non glissant, avec un tapis ferme ; pas de ballon sur un sol mouillé, ciré ou en pente ; espace libre d'au moins deux bras autour de toi, aucun meuble, escalier ni objet pointu à portée du ballon qui roule (NON SOURCÉ).
- Chaussures fermées à semelle plate qui accroche, ou pieds nus sur un tapis antidérapant selon l'exercice (la fiche le dit) ; jamais de chaussettes seules sur le sol.

## Photo
- `Physioball_Hip_Bridge/0.jpg` : affichable : non (logo « Cybex » lisible sur une machine à l'arrière-plan, personnes en arrière-plan, photo non recadrable ; remplacée par l'illustration)
- `Physioball_Hip_Bridge/1.jpg` : affichable : non (logo « Cybex » lisible sur une machine à l'arrière-plan, personnes en arrière-plan, photo non recadrable ; remplacée par l'illustration)
- illustration : public/illustrations/pont-fessier-ballon.svg : affichable : oui (illustration originale de l'app, 24/10/2026 ; vue de profil : haut du dos sur le ballon, pieds à plat, le bassin descend puis monte jusqu'à l'alignement buste-cuisses)
- légende : Variante 1 (haut du dos sur le ballon). Les variantes talons sur le ballon ne sont pas dessinées.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet, consignes de départ) : Physioball_Hip_Bridge (niveau « beginner », matériel « exercise ball ») ; Ball_Leg_Curl (niveau « beginner », matériel « exercise ball ») ; Ball_Leg_Curl pour les variantes talons sur le ballon | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db ; fichier dist/exercises.json relu le 2026-10-24 pour vérifier l'existence de l'entrée, son niveau et son matériel ; consignes réécrites par coach | base d'exercices (pratique, pas une étude) | 2026-10-24 | PROVISOIRE |
| Pont dorsal (supine bridge) sur ballon de gym : aucun effet mesuré du ballon sur les muscles du tronc étudiés | Lehman, Hoda, Oliver, Chiropractic & Osteopathy 2005;13:14, https://pmc.ncbi.nlm.nih.gov/articles/PMC1187901 ; résumé lu via moteur de recherche | étude de laboratoire en EMG, adultes sains | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Pont à talons sur surface stable ou instable : activité des fessiers, des ischios et des stabilisateurs de la colonne ; la surface instable n'est pas clairement meilleure | Youdas et coll., Physiother Theory Pract 2015;31:418-427 (26 sujets) ; résumé lu via moteur de recherche | étude de laboratoire en EMG, 26 adultes sains | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Instabilité (ballon de gym) : à ne pas rechercher pour elle-même ; les exercices au sol et les charges libres restent la base ; le ballon sert surtout au gainage, à la rééducation ou à la variété | Behm, Drinkwater, Willardson, Cowley, CSEP position stand « The use of instability to train the core in athletic and nonathletic conditioning », Appl Physiol Nutr Metab 2010;35(1):109-112 ; résumés et commentaires lus via moteur de recherche (texte complet non lu) | prise de position d'une société savante (CSEP) ; résumé seulement | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Choix du ballon (taille, gonflage, anti-éclatement), sol, espace libre | pratique de salle et raisonnement de coach ; aucune notice de fabricant lue | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 2026-10-24, à contrôler par relecteur) |
| Grossesse et post-partum : pont sur ballon retiré (sur le dos, hanches soulevées) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe (éviter isométrique prolongé, Valsalva, chute, couché sur le dos) : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, confirmé par kine, NON SOURCÉ) |
