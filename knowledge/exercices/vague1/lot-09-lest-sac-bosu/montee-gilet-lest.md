---
id: montee-gilet-lest
nom: Montée sur marche avec un gilet lesté
alias: [weighted vest step-up, step-up lesté]
schema: fente
type: force
niveau_min: intermediaire
muscles_principaux: [quadriceps, fessiers]
muscles_secondaires: [ischios, adducteurs, mollets, abdominaux]
source_brouillon: []
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| montee-gilet-lest-marche | Gilet lesté, première marche | 1 | intermediaire | lest, marche_escalier | Première marche d'un escalier éclairé, dégagé, non glissant, avec une rampe à portée de main ; gilet lesté serré ; chaussures aux pieds. |
| montee-gilet-lest-box | Gilet lesté, box ou step stable | 2 | intermediaire | lest, box_ou_step, mur | Box ou step stable et antidérapant (hauteur maximum : sous le genou), posé contre un mur ou calé ; gilet lesté serré. |

## Consignes
1. Enfile le gilet et serre-le jusqu'à ce qu'il ne bouge plus ; place-toi face à la marche, la main à portée de la rampe ou du mur.
2. Pose un pied entièrement sur la marche, le talon bien posé.
3. Pousse sur ce pied pour te redresser jusqu'à être debout sur la marche, sans te donner d'élan avec l'autre jambe.
4. Redescends lentement, en contrôlant, le pied de la jambe libre en premier ; garde le regard devant.
5. Fais toutes les répétitions d'un côté, puis change de jambe. Respire sans bloquer.

## Points d'attention
- Montée sur une marche : jamais une marche plus haute dans un escalier ; la box est stable et pas plus haute que le genou (NON SOURCÉ).
- La descente est le moment où l'on chute le plus : contrôlée, sans sauter.
- Le genou qui monte reste dans l'axe du pied.
- Le gilet est ajusté pour ne pas accrocher la rampe.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Se pousser avec la jambe qui reste au sol.
- Genou qui rentre.
- Descendre en chute.
- Pied qui déborde de la marche.
- Marche trop haute.

## Progression / régression
- plus-facile : montee-sur-marche-poids-du-corps, squat-fendu-mur
- plus-dur : squat-bulgare

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE ; ACSM 2026 : 2 à 3 séries par exercice) : le tag `lest` est dans la liste « chargeable » : 8 à 12 répétitions en « muscle » (intermédiaire et avancé), 10 à 15 en « santé », 4 à 6 sur un pilier en « force » ; 2 à 3 séries ; réserve cible 2 à 3, jamais 0 ; repos 90 s (120 à 180 s pour un pilier). Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. **Le gilet est une charge fixe** : l'app ne connaît pas son poids (le profil n'a pas de champ pour lui, Q26) et ne peut pas choisir une charge d'étalonnage comme avec des haltères. Étalonnage (load-calibration.md) : première séance, une série d'essai ; si tu ne tiens pas le bas de la fourchette avec 2 à 3 répétitions en réserve, le gilet est trop lourd pour toi sur cet exercice : prends la variante plus facile sans gilet (voir Progression). **Progression d'une charge fixe** : double progression sans changer le gilet : (1) tu ajoutes des répétitions dans la fourchette ; (2) quand toutes les séries atteignent le haut de la fourchette à la réserve visée, tu passes à l'échelon suivant de la fiche ; (3) si ton gilet a des lests amovibles, un seul palier à la fois, décidé par toi, hors du contrôle de l'app (NON SOURCÉ). Zone au niveau 2 : aucune hausse (R2). Exercice unilatéral : répétitions et séries par jambe. La hauteur de la box est le seul réglage de difficulté, avec l'échelon ; elle ne dépasse jamais le genou. **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24 (sécurité reprise par `kine` le 2026-10-25, à contrôler par `relecteur` lancé à neuf). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Genou | adapter: variante:montee-gilet-lest-marche | retirer: remplacant:montee-sur-marche-poids-du-corps | retirer |
| Hanche | adapter: variante:montee-gilet-lest-marche | retirer: remplacant:montee-sur-marche-poids-du-corps | retirer |
| Cheville | adapter: variante:montee-gilet-lest-marche | retirer: remplacant:montee-sur-marche-poids-du-corps | retirer |
| Dos | garder | retirer: remplacant:montee-sur-marche-poids-du-corps | retirer |
| Cou | garder | retirer: remplacant:montee-sur-marche-poids-du-corps | retirer |
| Cuisse | garder | adapter: amplitude:reduite | retirer |
| Aine | garder | adapter: amplitude:reduite | retirer |

**Notes**
- general : règle unique du gilet (choix de kine, NON SOURCÉ) : dès une gêne nette (niveau 2) au genou, à la hanche, à la cheville ou au dos, le gilet est retiré (montée sur marche sans charge). Niveau 1 de genou, hanche, cheville : variante première marche, la plus basse ; si la première marche n'est pas dans ton matériel (seulement une box), cette variante n'existe pas pour toi et le générateur choisit un autre exercice du même schéma. Le remplaçant montee-sur-marche-poids-du-corps a ses propres lignes : s'il est lui-même adapté par le profil, le générateur choisit un autre exercice sans charge.
- hanche-n1 : première marche seulement, gilet gardé.
- cheville-n1 : première marche seulement, gilet gardé.
- genou-n1 : première marche seulement (plus bas qu'une box), gilet gardé ; choix prudent, NON SOURCÉ.
- genou-n2 : gilet retiré : montée sur marche sans charge.
- hanche-n2 : gilet retiré.
- cheville-n2 : gilet retiré.
- cou-n2 : les bretelles du gilet pèsent sur la base du cou : gilet retiré.
- dos-n2 : gilet retiré.
- cuisse-n2 : choix prudent, extrapolation de regles-securite-communes.md §0 (NON SOURCÉ).
- aine-n2 : idem (NON SOURCÉ).
- grossesse : retiré : gilet fixe, risque de chute ; remplacé par la montée sans charge. Post-partum : G7.

**Grossesse** : retirer: remplacant:montee-sur-marche-poids-du-corps
**Version plus douce** : montee-sur-marche-poids-du-corps

**Sécurité pour l'utilisateur seul**
- Escalier éclairé, dégagé, non glissant, avec rampe ; chaussures aux pieds, jamais en chaussettes ; box large antidérapante, calée (R8, NON SOURCÉ).
- Sortie de secours, à chaque série : si tu perds l'équilibre, saisis la rampe (marche d'escalier) ou pose la main au mur (box, calée contre lui) et redescends le pied libre devant toi, jamais en arrière ni en sautant. Si la jambe ne pousse plus en montant, repose le pied libre au sol et arrête la série ; ne te donne pas d'élan avec l'autre jambe. Si tu es mal (étourdissement, serrement de poitrine), arrête, redescends en tenant la rampe, ouvre le gilet, assieds-toi (NON SOURCÉ).
- Pas de rampe ni de mur à portée de main : pas d'exercice (choix prudent de kine, NON SOURCÉ). Pas de marche avec le gilet en descendant d'un escalier entier : une seule marche, jamais l'escalier.
- Première fois : le lest le plus léger du gilet ; jamais plus lourd que ce que tu tiens avec 2 à 3 répétitions en réserve (NON SOURCÉ).
- Pas d'échec : arrête la série avec au moins 2 répétitions en réserve.

**Points d'attention (kine)**
- Genou, hanche, cheville : dès la gêne légère, première marche seulement ; dès la gêne nette, sans gilet (règle unique, NON SOURCÉ). Dos : gilet retiré dès la gêne nette.
- Niveau intermédiaire : équilibre sur une jambe, charge fixe et risque de chute ; le débutant fait la montée sur marche au poids du corps.
- Grossesse et post-partum : retiré ; en post-partum, fuite d'urine ou pesanteur dans le bas-ventre : arrêt et avis de la sage-femme (G7).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) au genou, à la hanche, à la cheville ou au bas du dos.
- Pied qui glisse ou déséquilibre : arrête et descends en tenant la rampe.
- Genou qui rentre à chaque répétition : retire le gilet.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe : arrête.

**Objets du quotidien**
- Gilet lesté : bien ajusté et fermé, lests calés dans leurs poches (rien qui ballotte), sans déchirure ni fermeture usée ; il se retire d'un geste (apprends à l'ouvrir avant la première série) ; le poids exact est celui que tu connais (l'app ne le connaît pas, NON SOURCÉ).
- Sol plat, sec, non glissant ; chaussures fermées à semelle plate ; espace libre autour de toi (NON SOURCÉ).
- Marche d'escalier ou box/step : stable, antidérapante, large, calée contre un mur ; jamais un objet creux ou qui bouge (R8, NON SOURCÉ).

## Photo
- `Step-up_with_Knee_Raise/0.jpg` : affichable : non (montée avec genou levé et sans gilet : la consigne dit sans élan, la photo montre un autre geste)
- `Step-up_with_Knee_Raise/1.jpg` : affichable : non (idem)
- illustration : public/illustrations/montee-gilet-lest.svg : affichable : oui (illustration originale de l'app)
- légende : Variante première marche d'un escalier. Avec un box : même geste, box sous la hauteur du genou.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, consignes de départ) | free-exercise-db Step-up_with_Knee_Raise (beginner, body only) pour le geste de montée sans gilet ; aucune entrée avec gilet (dist/exercises.json, vérifié le 2026-10-24) ; voir montee-sur-marche du dépôt | pratique (pas une étude) | 2026-10-24 | NON SOURCÉ |
| Gilet lesté + sauts : densité osseuse de la hanche maintenue chez 9 femmes ménopausées contre 9 témoins, sur 5 ans ; aucune étude lue sur ces exercices simples ni sur ce public : l'usage du gilet avec cet exercice relève du choix de coach (NON SOURCÉ), pas de cette étude | Snow, Shaw, Winters, Witzke, « Long-term exercise using weighted vests prevents hip bone loss in postmenopausal women », J Gerontol A Biol Sci Med Sci 2000;55(9):M489-M491, PMID 10995045 : 18 femmes ménopausées (9 avec gilet lesté et sauts, 9 témoins), 5 ans, densité osseuse de la hanche maintenue dans le groupe gilet + sauts ; résumé Europe PMC lu | étude contrôlée de petite taille (18 femmes), public différent | 2026-10-24 | PROVISOIRE (résumé seulement ; contexte, ne valide pas la fiche) |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Gilet lesté, marche ou box (hauteur, stabilité), escalier | pratique de salle et raisonnement de coach ; aucune notice de fabricant lue ; repère de hauteur (genou) : choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; référence du dépôt, non rouverte pour ce lot. L'interdiction de l'échec seul est une règle de sécurité de coach | revue de revues ACSM (OK) ; la règle de sécurité n'est pas une conclusion de l'étude | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; NON SOURCÉ pour la règle de sécurité |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 2026-10-25, à contrôler par relecteur) |
| Grossesse et post-partum : gilet lesté retiré (charge fixe qu'on ne peut pas alléger, poids sur le ventre et la poitrine) ; remplacé par la montée sur marche sans charge (sans gilet) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe (éviter isométrique prolongé, Valsalva, chute, couché sur le dos) : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach) |
