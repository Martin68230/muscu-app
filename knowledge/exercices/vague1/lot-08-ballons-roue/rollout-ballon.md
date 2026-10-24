---
id: rollout-ballon
nom: Roulé du ballon, à genoux
alias: [swiss ball roll-out, rollout au ballon]
schema: gainage
type: gainage
niveau_min: intermediaire
muscles_principaux: [abdominaux, transverse]
muscles_secondaires: [obliques, grand_dorsal, deltoides_anterieurs, flechisseurs_hanche]
source_brouillon: []
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| rollout-ballon-court | Roulé court | 1 | intermediaire | swiss_ball, tapis | À genoux sur un tapis épais derrière le ballon, avant-bras posés dessus ; le ballon roule seulement de quelques dizaines de centimètres, le dos reste plat. |
| rollout-ballon-long | Roulé long | 2 | intermediaire | swiss_ball, tapis | Même position, avec une amplitude plus grande, bras presque tendus vers l'avant, uniquement si le dos reste plat. |

## Consignes
1. Mets un tapis épais sous les genoux. Agenouille-toi derrière le ballon, pose les avant-bras dessus, mains jointes ou à plat.
2. Serre le ventre et les fessiers, rentre légèrement le bassin ; le corps forme une ligne des genoux à la tête.
3. En soufflant, fais rouler le ballon vers l'avant en allongeant les bras, seulement tant que ton dos reste plat.
4. Marque une pause d'une seconde, puis ramène le ballon vers toi en serrant le ventre.
5. Garde la tête dans le prolongement du dos, regard vers le sol. Pose le ballon sur le côté en fin de série.

## Points d'attention
- C'est l'étape avant la roue abdominale : l'appui sur les avant-bras raccourcit le levier et protège davantage le bas du dos.
- L'amplitude se règle avec la distance : « roulé court » d'abord.
- Les fessiers ne reculent pas sur les talons ; le bassin ne tombe pas.
- Sur ballon mou ou mal gonflé, l'exercice est moins stable : utilise un ballon bien gonflé.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Dos qui se creuse quand le ballon part loin.
- Fessiers qui reculent sur les talons.
- Rouler trop loin dès la première séance.
- Ballon qui roule de côté.
- Tête qui tombe.

## Progression / régression
- plus-facile : planche-ballon-avant-bras, planche-avant-bras, dead-bug
- plus-dur : roue-abdos-mur-genoux

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE ; ACSM 2026, SRC1 : 2 à 3 séries par exercice) : cet exercice est sans charge extérieure (aucun tag de la liste « chargeable ») : 10 à 15 répétitions ; séries : 2 pour un débutant, 3 pour un intermédiaire ou un avancé en « muscle » (2 pour un exercice « autre » en force) ; réserve cible 3 (débutant) à 2, jamais 0 ; repos 90 s (120 s pour un exercice pilier d'intermédiaire). Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. Comme pour la roue, le nombre de répétitions est un plafond : la série s'arrête quand le dos se creuse ou que le ventre lâche (plafond de sécurité spécifique, NON SOURCÉ). Étalonnage (load-calibration.md) : première séance avec la variante la plus facile ou la charge la plus légère disponible ; double progression (d'abord les répétitions ou la durée, puis l'échelon ou le palier suivant). **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24, repris et corrigé par `kine` le 2026-10-24 (à contrôler par `relecteur`). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: variante:rollout-ballon-court | retirer | retirer |
| Épaule | adapter: variante:rollout-ballon-court | retirer | retirer |
| Coude | garder | adapter: amplitude:reduite | retirer |
| Hanche | garder | adapter: amplitude:reduite | retirer |
| Genou | adapter: appui:coussin | retirer | retirer |
| Cheville | garder | adapter: appui:coussin | retirer |
| Cou | adapter: amplitude:tete-alignee | retirer | retirer |

**Notes**
- dos-n1 : roulé court seulement, bassin rentré (l'appui sur les avant-bras raccourcit le levier par rapport à la roue, qui est retirée dès ce niveau ; choix de kine, NON SOURCÉ, question Q21 de docs/QUESTIONS.md). Si le roulé court fait déjà tirer le bas du dos : arrêt, et la personne passe le dos au niveau 2.
- dos-n2 : retiré : levier long sur le bas du dos (choix prudent, NON SOURCÉ).
- epaule-n1 : roulé court.
- epaule-n2 : retiré : bras qui s'allongent en avant sous la charge du poids du corps.
- genou-n1 : coussin épais sous les genoux.
- genou-n2 : retiré : appui prolongé à genoux sur le sol ; aucune variante n'évite le genou.
- grossesse : retiré : pression abdominale, ventre non soutenu, risque de chute du ballon ; remplaçant : bird-dog (maintien court). Post-partum : G7 (diastasis).
- general : Non proposé aux débutants.

**Grossesse** : retirer: remplacant:bird-dog
**Version plus douce** : planche-ballon-avant-bras

**Sécurité pour l'utilisateur seul**
- Le ballon peut rouler loin : place un mur plein, ou un meuble lourd et stable, devant le ballon, juste à la distance du roulé que tu t'autorises : le ballon s'arrête contre lui, comme la butée de la roue. Rien d'autre sur la trajectoire (NON SOURCÉ).
- Sortie de secours si tu ne peux plus revenir : n'essaie pas de rattraper le ballon ; laisse-le rouler, baisse-toi doucement avec les avant-bras sur le ballon jusqu'à poser le ventre puis la poitrine sur le tapis (il doit être assez long pour que le buste y tienne), puis relève-toi à genoux. Essaie cette sortie une fois à vide, ballon peu avancé, avant la première vraie série.
- Si le ballon part de côté : arrête, pose les mains au sol, ne cherche pas à le rattraper.
- Quelqu'un dans la maison, à portée de voix, de préférence.
- Commence par l'amplitude la plus courte et augmente de quelques centimètres par séance, pas plus (NON SOURCÉ).

**Points d'attention (kine)**
- Dos : même risque que la roue, en moins fort grâce à l'appui sur les avant-bras ; arrêt à la première cambrure.
- Épaule : bras qui s'allongent en avant ; arrêt au moindre tiraillement.
- Poignets et coudes : avant-bras à plat sur le ballon, poignets alignés ; une douleur au poignet ou au coude = arrêt.
- Grossesse et post-partum : retiré (pression abdominale, séparation des grands droits) ; fuite d'urine, pesanteur dans le bas-ventre ou bombement du ventre à l'effort : arrêt et avis de la sage-femme (G7).
- Niveau : intermédiaire minimum, par prudence (NON SOURCÉ).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au bas du dos, à l'épaule ou au genou.
- Sensation que le bas du dos se creuse ou que le ventre lâche : arrête la série.
- Ballon qui part de côté ou qui devient mou : pose-le et arrête.
- En post-partum : fuite d'urine à l'effort, pesanteur dans le bas-ventre, bombement du ventre : arrêt et avis de la sage-femme (G7).
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe : arrête.

**Objets du quotidien**
- Ballon de gym (swiss ball) : gonflé fermement (il ne s'écrase pas sous toi), sans fuite ni déchirure, de préférence un modèle « anti-éclatement » dont la charge maximale écrite dépasse ton poids (NON SOURCÉ : consigne de prudence de coach, aucune notice lue). Un ballon qui se dégonfle, qui glisse ou qui fait un bruit suspect : on ne l'utilise plus.
- Taille : assis sur le ballon, les cuisses sont à peu près horizontales (repère de pratique, NON SOURCÉ). Trop grand ou trop mou : l'exercice devient plus instable.
- Sol plat, sec, non glissant, avec un tapis ferme ; pas de ballon sur un sol mouillé, ciré ou en pente ; espace libre d'au moins deux bras autour de toi, aucun meuble, escalier ni objet pointu à portée du ballon qui roule (NON SOURCÉ).
- Chaussures fermées à semelle plate qui accroche, ou pieds nus sur un tapis antidérapant selon l'exercice (la fiche le dit) ; jamais de chaussettes seules sur le sol.

## Photo
- aucune photo
- illustration : public/illustrations/rollout-ballon.svg : affichable : oui (illustration originale de l'app, 24/10/2026 ; vue de profil : à genoux sur un tapis, avant-bras sur le ballon, le ballon roule vers l'avant, dos plat)
- légende : Roulé court puis plus long : même position, le ballon va plus loin.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet, consignes de départ) | aucune entrée de free-exercise-db ne correspond (vérifié dans dist/exercises.json le 2026-10-24) ; geste décrit par coach d'après la pratique courante | pratique (pas une étude) | 2026-10-24 | NON SOURCÉ |
| Le roulé du ballon (roll-out) et le « pike » donnent la plus forte activité abdominale parmi 8 exercices au ballon de gym comparés à 2 exercices au sol | Escamilla, Lewis, Bell et coll., J Orthop Sports Phys Ther 2010;40(5):265-276, DOI 10.2519/jospt.2010.3073, PMID 20436242 (18 sujets, 5 répétitions par exercice) ; résumé lu via moteur de recherche | étude de laboratoire en EMG, 18 adultes ; mesure l'activité des muscles, pas la sécurité ni l'effet à long terme | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Instabilité (ballon de gym) : à ne pas rechercher pour elle-même ; les exercices au sol et les charges libres restent la base ; le ballon sert surtout au gainage, à la rééducation ou à la variété | Behm, Drinkwater, Willardson, Cowley, CSEP position stand « The use of instability to train the core in athletic and nonathletic conditioning », Appl Physiol Nutr Metab 2010;35(1):109-112 ; résumés et commentaires lus via moteur de recherche (texte complet non lu) | prise de position d'une société savante (CSEP) ; résumé seulement | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Choix du ballon (taille, gonflage, anti-éclatement), sol, espace libre | pratique de salle et raisonnement de coach ; aucune notice de fabricant lue | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 2026-10-24, à contrôler par relecteur) |
| Grossesse et post-partum : roulé du ballon retiré (pression abdominale, diastasis) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe (éviter isométrique prolongé, Valsalva, chute, couché sur le dos) : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, confirmé par kine, NON SOURCÉ) |
