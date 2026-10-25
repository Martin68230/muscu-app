---
id: fente-gilet-lest
nom: Squat fendu avec un gilet lesté
alias: [weighted vest split squat, fente sur place lestée]
schema: fente
type: force
niveau_min: intermediaire
muscles_principaux: [quadriceps, fessiers]
muscles_secondaires: [adducteurs, ischios, erecteurs_rachis, abdominaux]
source_brouillon: []
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| fente-gilet-lest-mur | Gilet lesté, une main au mur | 1 | intermediaire | lest, mur | Debout face à un mur plein, à un pas de lui, une main posée dessus pour l'équilibre, un pied devant, un pied derrière, gilet bien serré. |
| fente-gilet-lest-libre | Gilet lesté, sans appui | 2 | intermediaire | lest, mur, tapis | Même position, mains sur les hanches, loin de tout meuble, mur plein à un pas de toi pour te rattraper, tapis plat sous les pieds. |
| fente-gilet-lest-lente | Gilet lesté, descente en 3 secondes | 3 | intermediaire | lest, mur, tapis | Même position sans appui, mur plein à un pas de toi, descente lente en 3 secondes, sans arrêt en bas. |

## Consignes
1. Enfile le gilet, serre-le jusqu'à ce qu'il ne bouge plus ; place-toi à un pas du mur.
2. Un pied devant, un pied derrière, environ un grand pas entre les deux, pieds écartés de la largeur des hanches (comme sur deux rails, pas sur une seule ligne), talon arrière levé, buste droit. Les pieds ne bougent plus pendant toute la série.
3. Descends en pliant les deux genoux, le genou arrière vers le sol sans le poser, le genou avant dans l'axe du pied.
4. Pousse sur le pied avant pour remonter, sans te pencher en avant.
5. Fais toutes les répétitions d'un côté, puis change de jambe. Respire sans bloquer.

## Points d'attention
- Squat fendu : les pieds restent en place, ce n'est pas une fente marchée ni sautée.
- Le gilet charge le tronc : plus de poids sur la jambe avant à chaque répétition ; la descente reste courte tant que tu n'es pas sûr de ton équilibre.
- Le genou avant ne s'effondre pas vers l'intérieur.
- Un gilet trop lourd se voit à deux signes : tronc qui bascule vers l'avant, jambe avant qui tremble. Alors, sans gilet.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Pieds sur une même ligne (équilibre perdu).
- Genou avant qui rentre.
- Buste penché en avant.
- Poser le genou arrière brutalement.
- Série menée jusqu'à ne plus pouvoir.

## Progression / régression
- plus-facile : squat-fendu-mur, squat-fendu-poids-du-corps
- plus-dur : squat-bulgare

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE, branche « poids du corps » ; ACSM 2026 : 2 à 3 séries par exercice) : **le gilet est une charge fixe : le tag `lest` n'est pas « chargeable »** (config.ts, FIXED_LOAD_TAGS ; choix prudent de `dev`, NON SOURCÉ). Le générateur dose donc cet exercice comme au poids du corps : 10 à 15 répétitions (tous objectifs et niveaux, y compris un pilier en « force »), 2 à 3 séries, réserve cible 2 ou 3 (jamais la réserve 1 de l'avancé), repos 60 à 180 s selon l'objectif et le rôle de l'exercice. Aucune charge de départ, aucun échauffement à 50 %, aucune hausse de charge proposée : l'app ne connaît pas le poids du gilet (le profil n'a pas de champ pour lui, Q26). Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. Étalonnage (load-calibration.md) : première séance, une série d'essai ; si tu ne tiens pas 10 répétitions avec 2 à 3 répétitions en réserve, le gilet est trop lourd pour toi sur cet exercice : prends la variante plus facile sans gilet (voir Progression). **Progression d'une charge fixe** : double progression sans changer le gilet : (1) tu ajoutes des répétitions dans la fourchette ; (2) quand toutes les séries atteignent le haut de la fourchette à la réserve visée, tu passes à l'échelon suivant de la fiche ; (3) changer le lest du gilet reste ta décision, hors de l'app, qui ne le propose jamais ; si tu le fais, un seul palier à la fois (NON SOURCÉ). Zone au niveau 2 : aucune hausse (R2). Exercice unilatéral : les répétitions et les séries sont comptées par jambe. **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24 (sécurité reprise par `kine` le 2026-10-25, à contrôler par `relecteur` lancé à neuf). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: variante:fente-gilet-lest-mur | retirer: remplacant:squat-fendu-mur | retirer |
| Cou | garder | retirer: remplacant:squat-fendu-mur | retirer |
| Hanche | adapter: variante:fente-gilet-lest-mur | retirer: remplacant:squat-fendu-mur | retirer |
| Genou | adapter: variante:fente-gilet-lest-mur | retirer: remplacant:squat-fendu-mur | retirer |
| Cheville | adapter: variante:fente-gilet-lest-mur | retirer: remplacant:squat-fendu-mur | retirer |
| Cuisse | garder | adapter: amplitude:reduite | retirer |
| Aine | garder | adapter: amplitude:reduite | retirer |

**Notes**
- general : règle unique du gilet (choix de kine, NON SOURCÉ) : le poids du gilet ne peut pas être allégé par l'app ; dès une gêne nette (niveau 2) au dos, à la hanche, au genou ou à la cheville, le gilet est retiré (squat fendu au mur sans gilet). Le remplaçant squat-fendu-mur a ses propres lignes par zone : s'il est lui-même adapté par le profil, le générateur choisit un autre squat sans charge.
- dos-n1 : main au mur, descente courte, gilet gardé (choix prudent, NON SOURCÉ).
- hanche-n1 : main au mur, descente courte, gilet gardé.
- genou-n1 : main au mur, gilet gardé ; choix prudent, NON SOURCÉ.
- genou-n2 : gilet retiré, squat fendu au mur : le gilet n'est pas allégeable.
- dos-n2 : gilet retiré (règle unique).
- hanche-n2 : gilet retiré (règle unique).
- cheville-n1 : main au mur, descente courte.
- cheville-n2 : gilet retiré (règle unique).
- cou-n2 : les bretelles du gilet pèsent sur la base du cou : gilet retiré.
- cuisse-n2 : choix prudent, extrapolation de regles-securite-communes.md §0 (NON SOURCÉ).
- aine-n2 : idem (NON SOURCÉ).
- grossesse : retiré : gilet fixe, équilibre sur une jambe ; remplacé par le squat fendu au mur sans gilet. Post-partum : G7.

**Grossesse** : retirer: remplacant:squat-fendu-mur
**Version plus douce** : squat-fendu-mur

**Sécurité pour l'utilisateur seul**
- Sol plat et non glissant, chaussures fermées, mur plein à portée de main dans les trois variantes (NON SOURCÉ).
- Sortie de secours, à chaque série : si tu perds l'équilibre, ne fais pas de pas de rattrapage en arrière sous charge ; pose la main au mur et remonte en poussant sur le pied avant. Si tu ne peux pas remonter, pose le genou arrière au sol (tapis), main au mur, puis redresse-toi en ramenant le pied avant à côté de l'autre. Si tu es mal (étourdissement, serrement de poitrine), arrête, ouvre le gilet, assieds-toi (NON SOURCÉ).
- Première fois : le lest le plus léger du gilet ; jamais plus lourd que ce que tu tiens avec 2 à 3 répétitions en réserve (NON SOURCÉ).
- Pas d'échec : arrête la série avec au moins 2 répétitions en réserve.

**Points d'attention (kine)**
- Dos, genou, hanche, cheville : dès la gêne légère, main au mur et descente courte ; dès la gêne nette, sans gilet (règle unique, NON SOURCÉ).
- Niveau intermédiaire : équilibre sur une jambe et charge fixe ; le débutant fait le squat fendu au poids du corps (NON SOURCÉ).
- Grossesse et post-partum : gilet retiré ; en post-partum, fuite d'urine ou pesanteur dans le bas-ventre : arrêt et avis de la sage-femme (G7).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au genou avant, à la hanche, à la cheville ou au bas du dos.
- Genou avant qui rentre à chaque répétition ou équilibre incertain : retire le gilet.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe : arrête.

**Objets du quotidien**
- Gilet lesté : bien ajusté et fermé, lests calés dans leurs poches (rien qui ballotte), sans déchirure ni fermeture usée ; il se retire d'un geste (apprends à l'ouvrir avant la première série) ; le poids exact est celui que tu connais (l'app ne le connaît pas, NON SOURCÉ).
- Sol plat, sec, non glissant ; chaussures fermées à semelle plate ; espace libre autour de toi (NON SOURCÉ).

## Photo
- aucune photo
- illustration : public/illustrations/fente-gilet-lest.svg : affichable : oui (illustration originale de l'app)
- légende : Variante main au mur (le mur est devant toi). Sans appui : mains sur les hanches, mur à un pas.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, consignes de départ) | free-exercise-db : aucune entrée de squat fendu avec gilet (dist/exercises.json, vérifié le 2026-10-24) ; geste repris de squat-fendu du dépôt, décrit par coach d'après la pratique courante | pratique (pas une étude) | 2026-10-24 | NON SOURCÉ |
| Gilet lesté + sauts : densité osseuse de la hanche maintenue chez 9 femmes ménopausées contre 9 témoins, sur 5 ans ; aucune étude lue sur ces exercices simples ni sur ce public : l'usage du gilet avec cet exercice relève du choix de coach (NON SOURCÉ), pas de cette étude | Snow, Shaw, Winters, Witzke, « Long-term exercise using weighted vests prevents hip bone loss in postmenopausal women », J Gerontol A Biol Sci Med Sci 2000;55(9):M489-M491, PMID 10995045 : 18 femmes ménopausées (9 avec gilet lesté et sauts, 9 témoins), 5 ans, densité osseuse de la hanche maintenue dans le groupe gilet + sauts ; résumé Europe PMC lu | étude contrôlée de petite taille (18 femmes), public différent | 2026-10-24 | PROVISOIRE (résumé seulement ; contexte, ne valide pas la fiche) |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Gilet lesté (poids, ajustement, fermeture), mur, sol, espace libre | pratique de salle et raisonnement de coach ; aucune notice de fabricant lue | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; référence du dépôt, non rouverte pour ce lot. L'interdiction de l'échec seul est une règle de sécurité de coach | revue de revues ACSM (OK) ; la règle de sécurité n'est pas une conclusion de l'étude | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; NON SOURCÉ pour la règle de sécurité |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 2026-10-25, à contrôler par relecteur) |
| Grossesse et post-partum : gilet lesté retiré (charge fixe qu'on ne peut pas alléger, poids sur le ventre et la poitrine) ; remplacé par le squat fendu au mur (sans gilet) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe (éviter isométrique prolongé, Valsalva, chute, couché sur le dos) : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach) |
