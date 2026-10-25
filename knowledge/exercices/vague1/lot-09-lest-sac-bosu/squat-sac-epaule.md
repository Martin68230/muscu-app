---
id: squat-sac-epaule
nom: Squat avec un sac de sable sur l'épaule
alias: [sandbag shoulder squat]
schema: squat
type: force
niveau_min: intermediaire
muscles_principaux: [quadriceps, fessiers]
muscles_secondaires: [obliques, carre_des_lombes, adducteurs, erecteurs_rachis, trapezes]
source_brouillon: []
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| squat-sac-epaule-chaise | Sac sur une épaule, chaise derrière toi | 1 | intermediaire | sac_de_sable, chaise, mur | Sac posé sur une épaule (jamais sur la nuque), tenu d'une main ; chaise solide dont le dossier est calé contre un mur, derrière toi ; tu effleures l'assise sans t'asseoir. |
| squat-sac-epaule-libre | Sac sur une épaule, squat libre | 2 | avance | sac_de_sable, mur, tapis | Même position, sans chaise, mur à un pas pour te rattraper si besoin. |

## Consignes
1. Choisis un sac que tu peux monter sur l'épaule sans élan ni cambrure (prends-le contre le ventre, puis pose-le sur une épaule), plus léger encore que pour le squat en berceau.
2. Une main tient le sac, l'autre bras libre sert à t'équilibrer ; pieds un peu plus larges que les épaules, ventre serré, tronc droit.
3. Descends en poussant les hanches en arrière et en pliant les genoux, sans te pencher du côté opposé au sac.
4. Descends peu à peu : cuisses au plus à l'horizontale, dos droit, talons au sol.
5. Pousse sur les talons pour remonter ; fais la moitié de la série, puis change d'épaule. Pose le sac au sol à la fin en pliant les genoux.

## Points d'attention
- Le sac sur une épaule penche le tronc : garde le tronc droit ; si tu penches, le sac est trop lourd.
- Le sac ne repose jamais sur la nuque ni sur la base du cou.
- La chaise est un repère et un filet, pas un siège.
- Aucun lancer, aucun saut.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Tronc penché du côté opposé.
- Sac sur la nuque.
- Talons qui décollent.
- S'asseoir sur la chaise.
- Sac trop lourd.

## Progression / régression
- plus-facile : squat-sac-berceau, squat-poids-du-corps
- plus-dur : squat-sac-epaule-libre

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE ; ACSM 2026 : 2 à 3 séries par exercice) : le tag `sac_de_sable` n'est pas dans la liste « chargeable » de src/generator/config.ts : le générateur traite donc ces fiches comme du poids du corps (10 à 15 répétitions, 2 séries, 3 pour un intermédiaire en « muscle », réserve cible 2 à 3, jamais 0, repos 90 s) ; point à confirmer par `dev` (voir README du lot). Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. **Le sac est une charge fixe** : l'app ne connaît pas son poids et ne peut pas choisir une charge d'étalonnage comme avec des haltères. Étalonnage (load-calibration.md) : première séance, une série d'essai ; si tu ne tiens pas 10 répétitions propres avec 2 à 3 en réserve, le sac est trop lourd : prends un sac plus léger ou la variante sans sac (voir Progression). Progression : double progression sans changer le sac (d'abord les répétitions dans la fourchette, puis l'échelon suivant) ; changer de sac est ton choix, un petit palier à la fois (NON SOURCÉ). Une série = une épaule ; la répétition à gauche et à droite se compte séparément. Zone au niveau 2 : aucune hausse (R2). **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24 (sécurité reprise par `kine` le 2026-10-25, à contrôler par `relecteur` lancé à neuf). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: variante:squat-sac-berceau-chaise | retirer: remplacant:squat-poids-du-corps | retirer |
| Épaule | adapter: variante:squat-sac-berceau-chaise | retirer | retirer |
| Cou | adapter: variante:squat-sac-berceau-chaise | retirer | retirer |
| Hanche | garder | retirer: remplacant:squat-poids-du-corps | retirer |
| Genou | garder | retirer: remplacant:squat-poids-du-corps | retirer |
| Cheville | garder | adapter: amplitude:reduite | retirer |
| Cuisse | garder | adapter: amplitude:reduite | retirer |
| Aine | garder | adapter: amplitude:reduite | retirer |

**Notes**
- general : règle unique de la charge fixe (gilet et sac) pour les squats (choix de kine, NON SOURCÉ) : la charge ne s'allège pas par l'app ; dès une gêne nette (niveau 2) au dos, à la hanche ou au genou, le sac est retiré (squat au poids du corps) ; à l'épaule ou au cou, la fiche est retirée ; la cheville et l'aine/cuisse réduisent seulement la descente. Le remplaçant squat-poids-du-corps a ses propres lignes : s'il est lui-même adapté par le profil, le générateur ne le propose que dans sa version adaptée, sinon il choisit un autre squat sans charge.
- general : le sac est monté à l'épaule depuis le sol en deux temps (contre le ventre, puis sur l'épaule, sans élan), un geste proche d'un épaulé : variante sans chaise (la plus instable) réservée à l'avancé, jamais de débutant (règle 23, NON SOURCÉ).
- dos-n1 : sac en berceau (charge des deux côtés) à la place du sac sur une épaule ; choix prudent, NON SOURCÉ.
- cou-n1 : le sac ne s'appuie pas près du cou : berceau.
- hanche-n2 : sac retiré (règle unique).
- genou-n2 : sac retiré (règle unique).
- cheville-n2 : descente réduite, aucune hausse.
- epaule-n1 : sac en berceau, pas sur l'épaule.
- epaule-n2 : retiré.
- cou-n2 : retiré.
- cuisse-n2 : choix prudent, extrapolation de regles-securite-communes.md §0 (NON SOURCÉ).
- aine-n2 : idem (NON SOURCÉ).
- grossesse : retiré : sac sur l'épaule, équilibre asymétrique, charge fixe ; remplacé par le squat au poids du corps. Post-partum : G7.

**Grossesse** : retirer: remplacant:squat-poids-du-corps
**Version plus douce** : squat-sac-berceau-chaise

**Sécurité pour l'utilisateur seul**
- Sol non glissant, chaussures fermées à semelle qui accroche ; mur ou chaise lourde à portée ; espace libre autour de toi (NON SOURCÉ).
- Sortie de secours, à chaque série : si tu perds l'équilibre, si le sac glisse ou si les jambes lâchent, ne retiens pas le sac : redresse l'épaule et pousse le sac vers l'avant et l'extérieur pour qu'il tombe sur le sol à côté de toi (pas sur tes pieds), pieds écartés, puis pose une main au mur et l'autre sur la cuisse pour remonter. Ne te penche pas pour le rattraper. Un sac de sable souple et fermé se laisse tomber (NON SOURCÉ).
- Première fois : le sac le plus léger que tu as, plus léger encore que pour le berceau ; essaie la sortie de secours une fois sans descendre (NON SOURCÉ).
- Pas d'échec : arrête la série avec au moins 2 répétitions en réserve.
- Quelqu'un dans la maison, à portée de voix, de préférence.

**Points d'attention (kine)**
- Dos : charge d'un seul côté (McGill 2013, 6 participants, seaux : transposition prudente) ; dès la gêne légère, sac en berceau ; dès la gêne nette, retiré (NON SOURCÉ).
- Épaule et cou : sac sur l'épaule, le trapèze porte ; dès la gêne légère, berceau ; dès la gêne nette, retiré.
- Genou, hanche : gêne légère, garder en descendant moins bas ; gêne nette, sac retiré (règle unique).
- Niveau intermédiaire : charge asymétrique et sac monté à l'épaule ; pas de débutant (règle 23, NON SOURCÉ).
- Grossesse et post-partum : retiré ; en post-partum, fuite d'urine ou pesanteur dans le bas-ventre : arrêt et avis de la sage-femme (G7).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) au genou, à la hanche, à l'épaule, au cou ou au bas du dos.
- Tronc qui penche ou sac qui glisse : pose le sac et arrête.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe : arrête.

**Objets du quotidien**
- Sac de sable : fermé par une couture solide ou une fermeture à glissière doublée, sans fuite de sable, avec des poignées si possible ; le poids est connu (pesé) et assez léger pour rester maîtrisable (le poids n'est pas connu de l'app, NON SOURCÉ).
- Sol plat, sec, non glissant ; chaussures fermées à semelle plate ; espace libre sur tout le trajet, rien de fragile ni de dur à portée du sac (NON SOURCÉ).
- Ici le sac n'est ni lancé, ni rattrapé, ni jeté en l'air : il se porte, il se pose.

## Photo
- aucune photo
- illustration : public/illustrations/squat-sac-epaule.svg : affichable : oui (illustration originale de l'app)
- légende : Variante chaise derrière toi, dossier contre un mur. Sac sur l'épaule, jamais sur la nuque.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, consignes de départ) | free-exercise-db : aucune entrée de squat avec un sac sur l'épaule (dist/exercises.json, vérifié le 2026-10-24) ; geste décrit par coach d'après la pratique courante | pratique (pas une étude) | 2026-10-24 | NON SOURCÉ |
| Sac de sable : charge lourde, instable, qui se déplace dans le sac ; la fiche free-exercise-db Sandbag_Load est un exercice d'épreuve de force (charger une plateforme), pas ces gestes ; aucune étude lue sur ces exercices avec un sac | free-exercise-db Sandbag_Load (beginner, other), vérifié dans dist/exercises.json le 2026-10-24 : texte « les sacs de sable sont extrêmement difficiles à saisir », mise sur l'épaule « généralement interdite » dans l'épreuve | descriptif de base de données (pas une étude) | 2026-10-24 | NON SOURCÉ (aucune étude sur l'exercice ; le descriptif sert seulement à justifier la prudence) |
| Charge portée d'un seul côté : charge plus le bas du dos qu'une charge répartie des deux côtés | McGill, Marshall, Andersen, « Low back loads while walking and carrying: comparing the load carried in one hand or in both hands », Ergonomics 2013;56(2):293-302, PMID 23384188 : 6 participants, seaux ; une charge portée d'une seule main charge plus le bas du dos qu'une charge répartie dans les deux mains (30 kg d'un côté : compression lombaire supérieure à 2 800 N ; 15 kg de chaque côté : 1 570 N) ; résumé Europe PMC lu | étude biomécanique de 6 participants, charges de seaux (30 kg) : transposition à un sac prudente | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Sac de sable (solidité, poids connu, fuites), chaise, mur | pratique de salle et raisonnement de coach ; aucune notice de fabricant lue | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; référence du dépôt, non rouverte pour ce lot. L'interdiction de l'échec seul est une règle de sécurité de coach | revue de revues ACSM (OK) ; la règle de sécurité n'est pas une conclusion de l'étude | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; NON SOURCÉ pour la règle de sécurité |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 2026-10-25, à contrôler par relecteur) |
| Grossesse et post-partum : sac de sable retiré (charge fixe et lourde, qu'on ne peut pas alléger ; sac contre le ventre ou sur l'épaule) ; remplacé par le squat au poids du corps | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe (éviter isométrique prolongé, Valsalva, chute, couché sur le dos) : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach) |
