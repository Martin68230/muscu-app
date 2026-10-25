---
id: squat-sac-berceau
nom: Squat avec un sac de sable en berceau
alias: [sandbag bear hug squat]
schema: squat
type: force
niveau_min: intermediaire
muscles_principaux: [quadriceps, fessiers]
muscles_secondaires: [adducteurs, ischios, erecteurs_rachis, abdominaux, biceps]
source_brouillon: []
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| squat-sac-berceau-chaise | Sac en berceau, sac pris sur une chaise | 1 | intermediaire | sac_de_sable, chaise, mur | Sac posé sur une chaise solide dont le dossier est calé contre un mur ; tu le prends dans les deux bras contre la poitrine, tu t'écartes, puis tu fais ton squat. |
| squat-sac-berceau-sol | Sac en berceau, sac pris au sol | 2 | intermediaire | sac_de_sable, tapis | Sac au sol ; tu le soulèves dans les deux bras en pliant les genoux, contre la poitrine, puis tu fais ton squat. |

## Consignes
1. Choisis un sac que tu peux soulever sans cambrer ni prendre d'élan. Prends-le dans les deux bras, serré contre la poitrine, coudes sous lui.
2. Debout, pieds un peu plus larges que les épaules, pointes légèrement ouvertes, ventre serré, regard devant.
3. Descends en poussant les hanches en arrière et en pliant les genoux, genoux dans l'axe des pieds, dos droit, sac collé à la poitrine.
4. Descends seulement tant que le dos reste droit, que les talons restent au sol et que le sac ne touche pas les cuisses (cuisses au plus à l'horizontale pour commencer).
5. Pousse sur les talons pour remonter, ventre serré ; pose le sac au sol à la fin en pliant les genoux, jamais en te penchant. Respire sans bloquer.

## Points d'attention
- Le sac sert de contrepoids : plus facile pour garder le buste droit, mais il comprime la respiration : le plus léger pour apprendre.
- Un sac qui te fait tomber en avant ou arrondir le dos est trop lourd.
- Aucun lancer ni jeté du sac, aucun saut avec le sac.
- Existe en gobelet à l'haltère (squat-gobelet) et avec un ballon lesté (squat-ballon-lest) : celle-ci sert à ceux qui ont un sac de sable.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Dos qui s'arrondit.
- Talons qui décollent.
- Genoux qui rentrent.
- Sac qui glisse vers le ventre.
- Sac trop lourd pour le prendre sans cambrer.

## Progression / régression
- plus-facile : squat-ballon-lest, squat-gobelet, squat-poids-du-corps
- plus-dur : squat-sac-berceau-sol, squat-bulgare

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE ; ACSM 2026 : 2 à 3 séries par exercice) : le tag `sac_de_sable` n'est pas dans la liste « chargeable » de src/generator/config.ts : le générateur traite donc ces fiches comme du poids du corps (10 à 15 répétitions, 2 séries, 3 pour un intermédiaire en « muscle », réserve cible 2 à 3, jamais 0, repos 90 s) ; point à confirmer par `dev` (voir README du lot). Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. **Le sac est une charge fixe** : l'app ne connaît pas son poids et ne peut pas choisir une charge d'étalonnage comme avec des haltères. Étalonnage (load-calibration.md) : première séance, une série d'essai ; si tu ne tiens pas 10 répétitions propres avec 2 à 3 en réserve, le sac est trop lourd : prends un sac plus léger ou la variante sans sac (voir Progression). Progression : double progression sans changer le sac (d'abord les répétitions dans la fourchette, puis l'échelon suivant) ; changer de sac est ton choix, un petit palier à la fois (NON SOURCÉ). Zone au niveau 2 : aucune hausse (R2). **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24 (sécurité reprise par `kine` le 2026-10-25, à contrôler par `relecteur` lancé à neuf). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: variante:squat-sac-berceau-chaise | retirer: remplacant:squat-poids-du-corps | retirer |
| Épaule | garder | adapter: charge:legere | retirer |
| Coude | garder | adapter: charge:legere | retirer |
| Poignet | garder | adapter: charge:legere | retirer |
| Cou | garder | adapter: charge:legere | retirer |
| Hanche | garder | retirer: remplacant:squat-poids-du-corps | retirer |
| Genou | garder | retirer: remplacant:squat-poids-du-corps | retirer |
| Cheville | garder | adapter: amplitude:reduite | retirer |
| Cuisse | garder | adapter: amplitude:reduite | retirer |
| Aine | garder | adapter: amplitude:reduite | retirer |

**Notes**
- general : règle unique de la charge fixe (gilet et sac) pour les squats (choix de kine, NON SOURCÉ) : la charge ne s'allège pas par l'app ; dès une gêne nette (niveau 2) au dos, à la hanche ou au genou, le sac est retiré (squat au poids du corps) ; la cheville et l'aine/cuisse réduisent seulement la descente. Le remplaçant squat-poids-du-corps a ses propres lignes : s'il est lui-même adapté par le profil, le générateur ne le propose que dans sa version adaptée, sinon il choisit un autre squat sans charge.
- dos-n1 : prise du sac sur la chaise seulement (pas de soulevé depuis le sol), sac le plus léger, aucune hausse ; choix prudent, NON SOURCÉ.
- dos-n2 : retiré : squat au poids du corps (le sac n'est pas allégeable).
- hanche-n2 : sac retiré (règle unique).
- genou-n2 : sac retiré (règle unique).
- cheville-n2 : descente réduite, sac le plus léger, aucune hausse.
- epaule-n2 : sac le plus léger, aucune hausse (le sac repose sur les avant-bras et la poitrine).
- coude-n2 : sac le plus léger, aucune hausse (le sac repose sur les avant-bras et la poitrine).
- poignet-n2 : sac le plus léger, aucune hausse (le sac repose sur les avant-bras et la poitrine).
- cou-n2 : sac le plus léger, aucune hausse ; menton rentré, sac loin du menton.
- cuisse-n2 : choix prudent, extrapolation de regles-securite-communes.md §0 (NON SOURCÉ).
- aine-n2 : idem (NON SOURCÉ).
- grossesse : retiré : sac contre le ventre qui grossit, charge fixe ; remplacé par le squat au poids du corps. Post-partum : G7.

**Grossesse** : retirer: remplacant:squat-poids-du-corps
**Version plus douce** : squat-ballon-lest

**Sécurité pour l'utilisateur seul**
- Sol non glissant, chaussures fermées à semelle qui accroche ; espace libre devant et autour de toi (NON SOURCÉ).
- Sortie de secours, à chaque série : si le sac glisse, si tu perds l'équilibre ou si les jambes lâchent, ouvre les bras et laisse le sac tomber devant toi, un peu sur le côté (pas sur tes pieds), pieds écartés, menton rentré ; ne te penche pas pour le rattraper. Puis remonte en poussant les mains sur les cuisses. Un sac de sable souple et fermé se laisse tomber (NON SOURCÉ).
- Première fois : le sac le plus léger que tu as ; essaie la sortie de secours une fois sans descendre, sac à hauteur de poitrine (NON SOURCÉ).
- Pas d'échec : arrête la série avec au moins 2 répétitions en réserve.
- Quelqu'un dans la maison, à portée de voix, de préférence.

**Points d'attention (kine)**
- Genou, hanche : gêne légère, garder en descendant moins bas ; gêne nette, sac retiré (règle unique, NON SOURCÉ). Cheville : descente réduite dès la gêne nette. Mêmes principes que squat-gobelet, avec une charge qui ne s'allège pas.
- Dos : sac collé à la poitrine ; dès la gêne légère, prise sur la chaise seulement et sac le plus léger ; dès la gêne nette, retiré (NON SOURCÉ).
- Niveau intermédiaire : sac lourd, prise au sol (un soulevé avec la charge devant) ; le débutant fait le squat gobelet ou au ballon lesté (règle 23, NON SOURCÉ).
- Grossesse et post-partum : retiré (sac contre le ventre) ; en post-partum, fuite d'urine ou pesanteur dans le bas-ventre : arrêt et avis de la sage-femme (G7).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) au genou, à la hanche, à la cheville ou au bas du dos.
- Dos qui s'arrondit ou sac qui glisse : arrête et reprends avec un sac plus léger ou sans sac.
- Respiration gênée par le sac : pose-le.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe : arrête.

**Objets du quotidien**
- Sac de sable : fermé par une couture solide ou une fermeture à glissière doublée, sans fuite de sable, avec des poignées si possible ; le poids est connu (pesé) et assez léger pour rester maîtrisable (le poids n'est pas connu de l'app, NON SOURCÉ).
- Sol plat, sec, non glissant ; chaussures fermées à semelle plate ; espace libre sur tout le trajet, rien de fragile ni de dur à portée du sac (NON SOURCÉ).
- Ici le sac n'est ni lancé, ni rattrapé, ni jeté en l'air : il se porte, il se pose.

## Photo
- `Goblet_Squat/0.jpg` : affichable : non (haltère tenu verticalement sous le menton, pas un sac couché dans les bras ; l'illustration montre le sac)
- `Goblet_Squat/1.jpg` : affichable : non (idem)
- illustration : public/illustrations/squat-sac-berceau.svg : affichable : oui (illustration originale de l'app)
- légende : Sac couché contre la poitrine, coudes dessous. Variante sac pris sur une chaise ou au sol : même squat.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, consignes de départ) | free-exercise-db Goblet_Squat (beginner, équipement « kettlebells ») pour le geste de squat avec une charge contre la poitrine ; aucune entrée avec sac de sable (dist/exercises.json, vérifié le 2026-10-24) ; voir squat-gobelet et squat-ballon-lest du dépôt | pratique (pas une étude) | 2026-10-24 | NON SOURCÉ |
| Sac de sable : charge lourde, instable, qui se déplace dans le sac ; la fiche free-exercise-db Sandbag_Load est un exercice d'épreuve de force (charger une plateforme), pas ces gestes ; aucune étude lue sur ces exercices avec un sac | free-exercise-db Sandbag_Load (beginner, other), vérifié dans dist/exercises.json le 2026-10-24 : texte « les sacs de sable sont extrêmement difficiles à saisir », mise sur l'épaule « généralement interdite » dans l'épreuve | descriptif de base de données (pas une étude) | 2026-10-24 | NON SOURCÉ (aucune étude sur l'exercice ; le descriptif sert seulement à justifier la prudence) |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Sac de sable (solidité, poids connu, fuites), sol, espace libre | pratique de salle et raisonnement de coach ; aucune notice de fabricant lue | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; référence du dépôt, non rouverte pour ce lot. L'interdiction de l'échec seul est une règle de sécurité de coach | revue de revues ACSM (OK) ; la règle de sécurité n'est pas une conclusion de l'étude | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; NON SOURCÉ pour la règle de sécurité |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 2026-10-25, à contrôler par relecteur) |
| Grossesse et post-partum : sac de sable retiré (charge fixe et lourde, qu'on ne peut pas alléger ; sac contre le ventre) ; remplacé par le squat au poids du corps | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe (éviter isométrique prolongé, Valsalva, chute, couché sur le dos) : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach) |
