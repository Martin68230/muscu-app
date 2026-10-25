---
id: rowing-sac-de-sable
nom: Rowing avec un sac de sable
alias: [sandbag row]
schema: tirage_h
type: force
niveau_min: intermediaire
muscles_principaux: [grand_dorsal, rhomboides]
muscles_secondaires: [biceps, deltoides_posterieurs, trapezes, erecteurs_rachis, avant_bras]
source_brouillon: []
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| rowing-sac-un-bras-chaise | Un bras, main libre sur une chaise | 1 | intermediaire | sac_de_sable, chaise, mur | Une main sur l'assise d'une chaise solide dont le dossier est calé contre un mur, pieds écartés, buste penché ; l'autre main tient le sac par la poignée, bras tendu. |
| rowing-sac-penche | Buste penché, sac à deux mains | 2 | avance | sac_de_sable, tapis | Sac au sol devant les pieds, tenu par les poignées ou dans les bras ; genoux fléchis, buste penché, dos plat. |

## Consignes
1. Choisis un sac que tu peux tenir bras tendus, buste penché, sans arrondir le dos ; sinon, il est trop lourd.
2. Variante chaise : une main sur la chaise, pieds écartés, genoux fléchis, dos plat, regard au sol devant toi. Variante deux mains : buste penché à 45 degrés environ, dos plat.
3. Tire le sac vers le bas de la poitrine ou le ventre en ramenant le coude vers l'arrière, le long du corps.
4. Tiens une seconde, serre les omoplates, puis redescends lentement, bras presque tendus.
5. Fais toutes les répétitions d'un côté puis change (variante chaise). Respire sans bloquer.

## Points d'attention
- Le dos reste plat : le sac ne le tire pas vers le bas. S'il s'arrondit, le sac est trop lourd.
- Le sac se déforme et bouge : tiens-le fermement, par les poignées si possible.
- Pas de balancement du tronc pour monter le sac.
- Le sac est posé au sol à la fin, jamais lâché de haut.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Dos qui s'arrondit.
- Balancer le buste.
- Épaules aux oreilles.
- Tirer avec le bras seul.
- Lâcher le sac de haut.

## Progression / régression
- plus-facile : rowing-sac-a-dos, rowing-elastique
- plus-dur : rowing-sac-penche, rowing-buste-penche-halteres

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE ; ACSM 2026 : 2 à 3 séries par exercice) : le tag `sac_de_sable` n'est pas dans la liste « chargeable » de src/generator/config.ts : le générateur traite donc ces fiches comme du poids du corps (10 à 15 répétitions, 2 séries, 3 pour un intermédiaire en « muscle », réserve cible 2 à 3, jamais 0, repos 90 s) ; point à confirmer par `dev` (voir README du lot). Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. **Le sac est une charge fixe** : l'app ne connaît pas son poids et ne peut pas choisir une charge d'étalonnage comme avec des haltères. Étalonnage (load-calibration.md) : première séance, une série d'essai ; si tu ne tiens pas 10 répétitions propres avec 2 à 3 en réserve, le sac est trop lourd : prends un sac plus léger ou la variante sans sac (voir Progression). Progression : double progression sans changer le sac (d'abord les répétitions dans la fourchette, puis l'échelon suivant) ; changer de sac est ton choix, un petit palier à la fois (NON SOURCÉ). Variante un bras : répétitions et séries par côté. Zone au niveau 2 : aucune hausse (R2). **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24 (sécurité reprise par `kine` le 2026-10-25, à contrôler par `relecteur` lancé à neuf). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: variante:rowing-sac-un-bras-chaise | retirer: remplacant:rowing-elastique | retirer |
| Épaule | garder | adapter: charge:legere | retirer |
| Coude | garder | adapter: charge:legere | retirer |
| Poignet | garder | adapter: charge:legere | retirer |
| Cou | garder | adapter: amplitude:tete-alignee | retirer |
| Hanche | garder | adapter: variante:rowing-sac-un-bras-chaise | retirer |

**Notes**
- general : règle unique du sac (choix de kine, NON SOURCÉ) : le sac ne s'allège pas par l'app ; dès une gêne légère au dos, une main sur la chaise (variante un bras) ; dès une gêne nette au dos, retiré (rowing à l'élastique, qui s'allège). La variante à deux mains (sac au sol, buste penché, dos non soutenu) est réservée à l'avancé, jamais au débutant (règle 23, NON SOURCÉ). Aux autres zones, dès la gêne nette, le sac le plus léger, sans hausse.
- dos-n1 : appui de la main sur la chaise (le dos est soutenu) ; choix prudent, NON SOURCÉ.
- dos-n2 : retiré : rowing à l'élastique, qui s'allège.
- epaule-n2 : sac le plus léger, aucune hausse.
- coude-n2 : sac le plus léger, aucune hausse.
- poignet-n2 : sac le plus léger, aucune hausse.
- hanche-n2 : variante un bras, main sur la chaise (buste moins penché, appui qui décharge la hanche).
- cou-n2 : regard au sol devant toi, nuque dans le prolongement du dos.
- grossesse : retiré : sac lourd, charge fixe qu'on ne peut pas alléger, buste penché ; remplacé par le rowing à un bras avec haltère à charge légère. Post-partum : G7.

**Grossesse** : retirer: remplacant:rowing-unilateral-haltere
**Version plus douce** : rowing-sac-un-bras-chaise

**Sécurité pour l'utilisateur seul**
- Sol plat, non glissant, chaussures fermées à semelle plate ; chaise calée contre un mur plein ; espace libre autour de toi (NON SOURCÉ).
- Sortie de secours, à chaque série : si le dos tire, si le sac t'entraîne en avant ou si le bras lâche, redescends le sac lentement vers le sol en pliant les genoux, puis pose-le. Si tu perds l'équilibre ou si le sac glisse : ouvre la main et laisse-le tomber devant toi, un peu sur le côté (pas sur tes pieds), la main de la chaise reste en appui (variante chaise) ; ne tente pas de le rattraper en te penchant. Un sac de sable souple et fermé se laisse tomber (NON SOURCÉ).
- Première fois : le sac le plus léger que tu as ; si tu ne peux pas le tirer 5 fois dos plat et sans balancer le tronc, il est trop lourd (NON SOURCÉ).
- Pas d'échec : arrête la série avec au moins 2 répétitions en réserve.

**Points d'attention (kine)**
- Dos : buste penché avec charge fixe ; dès la gêne légère, une main sur la chaise ; dès la gêne nette, retiré (NON SOURCÉ).
- Épaule, coude, poignet : sac le plus léger dès la gêne nette.
- Niveau intermédiaire : sac lourd, buste penché ; le débutant fait le rowing à l'élastique ou au sac à dos (règle 23, NON SOURCÉ).
- Grossesse et post-partum : retiré ; en post-partum, fuite d'urine ou pesanteur dans le bas-ventre : arrêt et avis de la sage-femme (G7).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) au bas du dos, à l'épaule, au coude ou au poignet.
- Dos qui s'arrondit à chaque répétition : pose le sac.
- Sac qui glisse des mains : pose-le et arrête.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe : arrête.

**Objets du quotidien**
- Sac de sable : fermé par une couture solide ou une fermeture à glissière doublée, sans fuite de sable, avec des poignées si possible ; le poids est connu (pesé) et assez léger pour rester maîtrisable (le poids n'est pas connu de l'app, NON SOURCÉ).
- Sol plat, sec, non glissant ; chaussures fermées à semelle plate ; espace libre sur tout le trajet, rien de fragile ni de dur à portée du sac (NON SOURCÉ).
- Ici le sac n'est ni lancé, ni rattrapé, ni jeté en l'air : il se porte, il se pose.

## Photo
- `One-Arm_Dumbbell_Row/0.jpg` : affichable : à vérifier (rowing à un bras avec haltère, geste proche sans sac ; photo du dépôt déjà utilisée par rowing-unilateral-haltere, non regardée pour ce lot)
- `One-Arm_Dumbbell_Row/1.jpg` : affichable : à vérifier (idem)
- illustration : public/illustrations/rowing-sac-de-sable.svg : affichable : non (à faire par dev : vue de profil, buste penché, dos plat, sac de sable tenu bras tendu puis tiré vers la poitrine, main libre sur une chaise)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, consignes de départ) | free-exercise-db One-Arm_Dumbbell_Row (beginner, dumbbell) pour le geste de rowing avec une charge fixe ; aucune entrée avec sac de sable (dist/exercises.json, vérifié le 2026-10-24) ; voir rowing-unilateral-haltere et rowing-sac-a-dos du dépôt | pratique (pas une étude) | 2026-10-24 | NON SOURCÉ |
| Sac de sable : charge lourde, instable, qui se déplace dans le sac ; la fiche free-exercise-db Sandbag_Load est un exercice d'épreuve de force (charger une plateforme), pas ces gestes ; aucune étude lue sur ces exercices avec un sac | free-exercise-db Sandbag_Load (beginner, other), vérifié dans dist/exercises.json le 2026-10-24 : texte « les sacs de sable sont extrêmement difficiles à saisir », mise sur l'épaule « généralement interdite » dans l'épreuve | descriptif de base de données (pas une étude) | 2026-10-24 | NON SOURCÉ (aucune étude sur l'exercice ; le descriptif sert seulement à justifier la prudence) |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Sac de sable (solidité, poids connu, poignées), chaise, mur | pratique de salle et raisonnement de coach ; aucune notice de fabricant lue | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; référence du dépôt, non rouverte pour ce lot. L'interdiction de l'échec seul est une règle de sécurité de coach | revue de revues ACSM (OK) ; la règle de sécurité n'est pas une conclusion de l'étude | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; NON SOURCÉ pour la règle de sécurité |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 2026-10-25, à contrôler par relecteur) |
| Grossesse et post-partum : sac de sable retiré (charge fixe et lourde, qu'on ne peut pas alléger ; sac contre le ventre ou sur l'épaule) ; remplacé par le rowing à un bras avec haltère à charge légère | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe (éviter isométrique prolongé, Valsalva, chute, couché sur le dos) : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach) |
