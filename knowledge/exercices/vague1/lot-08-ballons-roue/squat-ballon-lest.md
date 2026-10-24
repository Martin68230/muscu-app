---
id: squat-ballon-lest
nom: Squat avec un ballon lesté contre la poitrine
alias: [medicine ball squat, squat gobelet ballon]
schema: squat
type: force
niveau_min: debutant
muscles_principaux: [quadriceps, fessiers]
muscles_secondaires: [adducteurs, ischios, abdominaux, erecteurs_rachis]
source_brouillon: []
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| squat-ballon-lest-poitrine | Ballon contre la poitrine | 1 | debutant | medecine_ball, tapis | Debout, pieds un peu plus larges que les épaules, pointes légèrement ouvertes, ballon tenu à deux mains contre la poitrine, coudes sous le ballon. |
| squat-ballon-lest-bras-tendus | Ballon bras tendus devant | 1 | debutant | medecine_ball, tapis | Même position, ballon bras tendus devant toi à hauteur de poitrine : sert de contrepoids pour s'équilibrer. |

## Consignes
1. Debout, pieds un peu plus larges que les épaules, pointes légèrement ouvertes, ballon contre la poitrine ou bras tendus devant.
2. Descends en poussant les hanches en arrière et en pliant les genoux, genoux dans l'axe des pieds, dos droit.
3. Descends aussi bas que tu peux, dos droit et talons au sol ; le ballon ne touche pas les cuisses.
4. Pousse sur les talons pour remonter, ventre serré.
5. Respire sans bloquer : inspire en descendant, souffle en remontant.

## Points d'attention
- Le ballon sert de contrepoids : plus facile pour garder le buste droit.
- Le ballon le plus léger pour apprendre ; un ballon lourd gêne la respiration et l'équilibre.
- Les genoux restent dans l'axe des pieds.
- Existe sous forme d'haltère (squat-gobelet) : celle-ci sert à ceux qui n'ont pas d'haltères.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Dos qui s'arrondit.
- Talons qui décollent.
- Genoux qui rentrent.
- Ballon qui descend sur le ventre.
- Ballon trop lourd.

## Progression / régression
- plus-facile : squat-assis-debout, squat-poids-du-corps
- plus-dur : squat-gobelet, squat-fendu

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE ; ACSM 2026, SRC1 : 2 à 3 séries par exercice) : cet exercice est sans charge extérieure (aucun tag de la liste « chargeable ») : 10 à 15 répétitions ; séries : 2 pour un débutant, 3 pour un intermédiaire ou un avancé en « muscle » (2 pour un exercice « autre » en force) ; réserve cible 3 (débutant) à 2, jamais 0 ; repos 90 s (120 s pour un exercice pilier d'intermédiaire). Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. Le tag medecine_ball n'est pas dans la liste « chargeable » de V-DOSE : le générateur donnera 10 à 15 répétitions ; c'est cohérent pour un ballon léger. Étalonnage (load-calibration.md) : première séance avec la variante la plus facile ou la charge la plus légère disponible ; double progression (d'abord les répétitions ou la durée, puis l'échelon ou le palier suivant). **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24, repris et corrigé par `kine` le 2026-10-24 (à contrôler par `relecteur`). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | garder | adapter: variante:squat-ballon-lest-poitrine | retirer |
| Épaule | garder | adapter: variante:squat-ballon-lest-poitrine | retirer |
| Coude | garder | adapter: sans-charge | retirer |
| Poignet | garder | adapter: sans-charge | retirer |
| Hanche | garder | adapter: amplitude:reduite | retirer |
| Genou | garder | adapter: amplitude:reduite | retirer |
| Cheville | garder | adapter: amplitude:reduite | retirer |
| Cuisse | garder | adapter: amplitude:reduite | retirer |
| Aine | garder | adapter: amplitude:reduite | retirer |

**Notes**
- dos-n2 : ballon contre la poitrine (charge plus près du tronc, levier plus court sur le bas du dos qu'avec les bras tendus), ballon le plus léger, aucune augmentation (R2). Choix de kine, NON SOURCÉ (raisonnement mécanique).
- epaule-n2 : ballon contre la poitrine, sans effort des bras.
- coude-n2 : sans ballon.
- poignet-n2 : sans ballon.
- cuisse-n2 : choix prudent, extrapolation de regles-securite-communes.md §0 (NON SOURCÉ).
- aine-n2 : idem (NON SOURCÉ).
- grossesse : le ballon contre la poitrine gêne le ventre qui grossit et la respiration ; remplacé par le squat gobelet (charge légère). Post-partum : G7.

**Grossesse** : retirer: remplacant:squat-gobelet
**Version plus douce** : squat-assis-debout

**Sécurité pour l'utilisateur seul**
- Sol non glissant, chaussures fermées à semelle qui accroche ; ballon léger bien tenu à deux mains ; espace libre devant et autour de toi (NON SOURCÉ).
- Sortie de secours : si le ballon glisse ou si tu perds l'équilibre, lâche-le vers l'avant, un peu sur le côté, pieds écartés (pas sur tes pieds) ; ne te penche pas pour le rattraper ; si les jambes lâchent, assieds-toi en arrière sur une chaise stable placée derrière toi si tu en as mis une, sinon pose les mains sur les cuisses et remonte lentement.
- Pas d'échec : arrête la série avec au moins 2 répétitions en réserve.

**Points d'attention (kine)**
- Genou et hanche : amplitude réduite en cas de gêne ; mêmes règles que squat-gobelet.
- Dos : bras tendus = levier plus long sur le bas du dos qu'avec le ballon contre la poitrine ; dès la gêne nette, ballon contre la poitrine et le plus léger (NON SOURCÉ).
- Grossesse : retiré (le ballon contre la poitrine gêne le ventre et la respiration), remplacé par squat-gobelet à charge légère ; en post-partum, fuite d'urine ou pesanteur dans le bas-ventre : arrêt et avis de la sage-femme (G7).
- Niveau : débutant avec un ballon léger (même schéma que le squat gobelet, choix de kine, NON SOURCÉ).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au genou, à la hanche, à la cheville ou au bas du dos.
- Ballon qui part de travers, glisse des mains ou rebondit vers le visage : arrête et reprends avec un ballon plus léger ou plus de distance.
- Dos qui s'arrondit : arrête et reprends plus léger ou sans ballon.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe : arrête.

**Objets du quotidien**
- Ballon lesté (medicine ball) : sans fissure, sans fuite de sable, surface sèche et pas glissante ; choisis le ballon le plus léger que tu as pour apprendre le geste (le poids n'est pas connu de l'app, NON SOURCÉ).
- Sol plat, sec, non glissant ; chaussures fermées à semelle plate ; espace libre autour de toi, rien de fragile ni de dur à portée du ballon (NON SOURCÉ).
- Ici le ballon n'est ni lancé ni rattrapé : il reste dans les mains ; s'il glisse, il tombe au sol.

## Photo
- aucune photo

Illustration à faire par `dev` : squat avec un ballon lesté contre la poitrine, vue de profil, haut puis bas ; aucune entrée de free-exercise-db ne correspond.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet, consignes de départ) | aucune entrée de free-exercise-db ne correspond (vérifié dans dist/exercises.json le 2026-10-24) ; geste décrit par coach d'après la pratique courante | pratique (pas une étude) | 2026-10-24 | NON SOURCÉ |
| Squat avec ballon lesté : même geste que le squat gobelet avec un autre objet | pratique d'entraînement ; aucune étude lue sur cet exercice précis ; voir squat-gobelet du dépôt | - | 2026-10-24 | NON SOURCÉ |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Ballon lesté (poids, état), mur, rebond, espace libre | pratique de salle et raisonnement de coach ; aucune notice de fabricant lue | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 2026-10-24, à contrôler par relecteur) |
| Grossesse et post-partum : squat au ballon contre la poitrine retiré, remplacé par le squat gobelet | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe (éviter isométrique prolongé, Valsalva, chute, couché sur le dos) : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, confirmé par kine, NON SOURCÉ) |
