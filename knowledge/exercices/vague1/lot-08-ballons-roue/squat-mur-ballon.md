---
id: squat-mur-ballon
nom: Squat au mur avec un ballon de gym
alias: [wall squat swiss ball]
schema: squat
type: force
niveau_min: debutant
muscles_principaux: [quadriceps, fessiers]
muscles_secondaires: [ischios, adducteurs, mollets]
source_brouillon: []
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| squat-mur-ballon-sans-charge | Sans charge | 1 | debutant | swiss_ball, mur | Debout, dos contre le ballon calé entre le bas du dos et un mur, pieds avancés d'un grand pas, bras le long du corps. |
| squat-mur-ballon-halteres | Avec un haltère contre la poitrine | 2 | debutant | swiss_ball, mur, halteres | Même position, un haltère tenu à deux mains contre la poitrine, léger. |

## Consignes
1. Place le ballon entre le bas du dos et un mur plein, pieds à la largeur des épaules et avancés d'un grand pas devant toi.
2. Garde le dos appuyé sur le ballon et plie les genoux en faisant rouler le ballon vers le bas du dos, comme pour t'asseoir.
3. Descends jusqu'à ce que les genoux soient pliés à environ 90 degrés au plus, genoux au-dessus des pieds (pas loin devant les orteils).
4. Pousse sur les talons pour remonter, en faisant rouler le ballon vers le haut.
5. Garde les genoux dans l'axe des pieds, le regard devant toi.

## Points d'attention
- Le ballon soutient le dos : c'est un bon squat pour apprendre la position.
- Les pieds restent assez loin du mur pour que les genoux restent au-dessus des pieds (repère de pratique, NON SOURCÉ).
- Descends moins si les genoux tirent ; ne force pas.
- Un mur lisse et un sol non glissant : sans cela, le ballon ou les pieds glissent.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Pieds trop près du mur.
- Genoux qui rentrent vers l'intérieur.
- Talons qui décollent.
- Descendre trop bas.
- Sol glissant.

## Progression / régression
- plus-facile : squat-assis-debout, squat-poids-du-corps
- plus-dur : squat-gobelet

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE ; ACSM 2026, SRC1 : 2 à 3 séries par exercice) : variante chargeable (haltères) : muscle 8 à 12 répétitions (10 à 12 pour un débutant) ; variante au poids du corps ou au ballon seul : 10 à 15 répétitions ; séries : 2 pour un débutant, 3 pour un intermédiaire ou un avancé en « muscle » (2 pour un exercice « autre » en force) ; réserve cible 3 (débutant) à 2, jamais 0 ; repos 90 s (120 s pour un exercice pilier d'intermédiaire). Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. Étalonnage (load-calibration.md) : première séance avec la variante la plus facile ou la charge la plus légère disponible ; double progression (d'abord les répétitions ou la durée, puis l'échelon ou le palier suivant). **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24, repris et corrigé par `kine` le 2026-10-24 (à contrôler par `relecteur`). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | garder | adapter: variante:squat-mur-ballon-sans-charge | retirer |
| Coude | garder | adapter: variante:squat-mur-ballon-sans-charge | retirer |
| Poignet | garder | adapter: variante:squat-mur-ballon-sans-charge | retirer |
| Hanche | garder | adapter: amplitude:reduite | retirer |
| Genou | adapter: amplitude:reduite | adapter: amplitude:reduite | retirer |
| Cheville | garder | adapter: amplitude:reduite | retirer |
| Cuisse | garder | adapter: amplitude:reduite | retirer |
| Aine | garder | adapter: amplitude:reduite | retirer |

**Notes**
- dos-n2 : sans haltère, aucune augmentation (R2) ; le ballon soutient le bas du dos, retiré dès la douleur.
- genou-n1 : moins de descente, genoux dans l'axe.
- genou-n2 : même amplitude réduite, aucune augmentation (R2).
- hanche-n2 : moins de descente, aucune augmentation (R2).
- cheville-n2 : moins de descente, talons au sol.
- coude-n2 : sans haltère.
- poignet-n2 : sans haltère.
- cuisse-n2 : choix prudent, extrapolation de regles-securite-communes.md §0 (NON SOURCÉ).
- aine-n2 : idem (NON SOURCÉ).
- grossesse : sans charge : le ballon soutient le dos, position debout ; respiration continue, descente moins profonde au besoin. Post-partum : G7.

**Grossesse** : adapter: sans-charge
**Version plus douce** : squat-mur-ballon-sans-charge

**Sécurité pour l'utilisateur seul**
- Mur plein et dégagé, sol non glissant ; chaussures fermées à semelle qui accroche ; tapis ou sol dégagé derrière et à côté de toi.
- Sortie de secours si les jambes lâchent ou si le ballon ou les pieds glissent : reste dos appuyé sur le ballon et laisse-toi glisser doucement jusqu'à t'asseoir au sol, jambes fléchies ; avec l'haltère, écarte-le sur le côté du corps, loin des pieds. Ne te penche pas en avant pour te rattraper. Essaie cette descente une fois sans charge avant la première série (NON SOURCÉ).
- Haltère léger, tenu à deux mains contre la poitrine ; la charge reste celle de l'étalonnage, jamais augmentée tant que le genou ou la hanche tire.
- Quelqu'un dans la maison, à portée de voix, de préférence.

**Points d'attention (kine)**
- Genou : le dos appuyé sur le ballon limite la charge sur l'avant des genoux si les pieds sont assez avancés.
- Dos : le ballon soutient le bas du dos ; si le dos se creuse, avance les pieds.
- Hanche, aine, cuisse : une gêne dans l'aine ou à l'arrière de la cuisse = descente moins profonde, puis arrêt.
- Grossesse : sans charge, debout, appui du dos (le dos est contre un ballon et un mur, pas couché) ; respiration continue, descente moins profonde au besoin, ne pas rester debout immobile longtemps ; en post-partum, fuite d'urine ou pesanteur dans le bas-ventre : arrêt et avis de la sage-femme (G7). Choix de kine, NON SOURCÉ (la HAS ne cite pas cet exercice).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au genou, à la hanche, à la cheville ou au bas du dos.
- Ballon ou pieds qui glissent : arrête et corrige l'installation.
- Genoux qui rentrent vers l'intérieur de façon marquée : réduis la descente.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe : arrête.

**Objets du quotidien**
- Ballon de gym (swiss ball) : gonflé fermement (il ne s'écrase pas sous toi), sans fuite ni déchirure, de préférence un modèle « anti-éclatement » dont la charge maximale écrite dépasse ton poids (NON SOURCÉ : consigne de prudence de coach, aucune notice lue). Un ballon qui se dégonfle, qui glisse ou qui fait un bruit suspect : on ne l'utilise plus.
- Taille : assis sur le ballon, les cuisses sont à peu près horizontales (repère de pratique, NON SOURCÉ). Trop grand ou trop mou : l'exercice devient plus instable.
- Sol plat, sec, non glissant, avec un tapis ferme ; pas de ballon sur un sol mouillé, ciré ou en pente ; espace libre d'au moins deux bras autour de toi, aucun meuble, escalier ni objet pointu à portée du ballon qui roule (NON SOURCÉ).
- Chaussures fermées à semelle plate qui accroche, ou pieds nus sur un tapis antidérapant selon l'exercice (la fiche le dit) ; jamais de chaussettes seules sur le sol.

## Photo
- aucune photo
- illustration : public/illustrations/squat-mur-ballon.svg : affichable : oui (illustration originale de l'app, 24/10/2026 ; vue de profil : dos sur le ballon calé contre un mur, pieds avancés ; le ballon roule, genoux à 90 degrés au plus)
- légende : Version sans charge ; avec un haltère contre la poitrine, c'est le même geste.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet, consignes de départ) | aucune entrée de free-exercise-db ne correspond (vérifié dans dist/exercises.json le 2026-10-24) ; geste décrit par coach d'après la pratique courante | pratique (pas une étude) | 2026-10-24 | NON SOURCÉ |
| Squat adossé à un ballon : appui du dos contre un mur ; effet sur la charge des genoux et des muscles non mesuré ici | pratique de rééducation et d'entraînement courante ; aucune étude lue sur cet exercice précis | - | 2026-10-24 | NON SOURCÉ |
| Instabilité (ballon de gym) : à ne pas rechercher pour elle-même ; les exercices au sol et les charges libres restent la base ; l'instabilité peut avoir sa place en rééducation, dans un programme périodisé ou comme variété pour la population générale (le ballon n'est donc pas réservé au gainage) | Behm, Drinkwater, Willardson, Cowley, « The use of instability to train the core musculature », revue et prise de position CSEP, Appl Physiol Nutr Metab 2010;35(1):91-108 (revue) et 109-112 (prise de position) ; résumé de la revue relu le 24/10/2026 (Europe PMC) ; texte complet non lu | prise de position d'une société savante (CSEP) ; résumé seulement | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Choix du ballon (taille, gonflage, anti-éclatement), sol, espace libre | pratique de salle et raisonnement de coach ; aucune notice de fabricant lue | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 2026-10-24, à contrôler par relecteur) |
| Grossesse et post-partum : squat adossé à un ballon sans charge (debout, dos soutenu) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe (éviter isométrique prolongé, Valsalva, chute, couché sur le dos) : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, confirmé par kine, NON SOURCÉ) |
