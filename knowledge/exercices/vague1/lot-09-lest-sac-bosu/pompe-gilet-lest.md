---
id: pompe-gilet-lest
nom: Pompe avec un gilet lesté
alias: [weighted vest push-up, pompe lestée]
schema: poussee_h
type: force
niveau_min: avance
muscles_principaux: [pectoraux]
muscles_secondaires: [triceps, deltoides_anterieurs, abdominaux, dentele_anterieur]
source_brouillon: []
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| pompe-gilet-lest-sol | Gilet lesté, mains au sol | 1 | avance | lest, tapis | Gilet lesté bien serré et à plat sur la poitrine, mains au sol sous les épaules, pointes de pieds au sol, corps en ligne. |
| pompe-gilet-lest-pieds-chaise | Gilet lesté, pieds sur une chaise | 2 | avance | lest, chaise, mur | Chaise solide dont les pieds arrière sont contre un mur plein, pieds posés sur l'assise, mains au sol sous les épaules. |

## Consignes
1. Réservé à qui fait déjà 15 pompes propres au sol sans gilet. Enfile le gilet à plat, serré, lests calés.
2. Mains au sol sous les épaules, corps en ligne de la tête aux talons, ventre et fessiers serrés, regard entre les mains.
3. Descends en pliant les coudes (environ 45 degrés du corps) jusqu'à ce que la poitrine soit à quelques centimètres du sol.
4. Pousse le sol pour remonter, en gardant le corps en ligne.
5. Respire sans bloquer : inspire en descendant, souffle en remontant. Série arrêtée dès que le corps se casse.

## Points d'attention
- Niveau avancé : le gilet ajoute une charge fixe sur la poitrine et les épaules, sans possibilité de l'alléger en cours de route.
- Le gilet est à plat sur le buste : s'il appuie sur la poitrine au point bas et gêne la respiration, il est trop lourd ou mal réglé.
- Corps en ligne : un bassin qui tombe ou qui monte annonce la fin de la série.
- Pieds sur chaise : plus de poids sur les épaules et les poignets ; réservé à qui maîtrise déjà la version au sol avec le gilet.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Bassin qui tombe.
- Coudes écartés à 90 degrés.
- Tête qui tombe.
- Demi-répétitions sans contrôle.
- Gilet qui remonte vers le cou.

## Progression / régression
- plus-facile : pompe-sol, pompe-genoux
- plus-dur : pompe-gilet-lest-pieds-chaise

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE, branche « poids du corps » ; ACSM 2026 : 2 à 3 séries par exercice) : **le gilet est une charge fixe : le tag `lest` n'est pas « chargeable »** (config.ts, FIXED_LOAD_TAGS ; choix prudent de `dev`, NON SOURCÉ). Le générateur dose donc cet exercice comme au poids du corps : 10 à 15 répétitions (tous objectifs et niveaux, y compris un pilier en « force »), 2 à 3 séries, réserve cible 2 ou 3 (jamais la réserve 1 de l'avancé), repos 60 à 180 s selon l'objectif et le rôle de l'exercice. Aucune charge de départ, aucun échauffement à 50 %, aucune hausse de charge proposée : l'app ne connaît pas le poids du gilet (le profil n'a pas de champ pour lui, Q26). Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. Étalonnage (load-calibration.md) : première séance, une série d'essai ; si tu ne tiens pas 10 répétitions avec 2 à 3 répétitions en réserve, le gilet est trop lourd pour toi sur cet exercice : prends la variante plus facile sans gilet (voir Progression). **Progression d'une charge fixe** : double progression sans changer le gilet : (1) tu ajoutes des répétitions dans la fourchette ; (2) quand toutes les séries atteignent le haut de la fourchette à la réserve visée, tu passes à l'échelon suivant de la fiche ; (3) changer le lest du gilet reste ta décision, hors de l'app, qui ne le propose jamais ; si tu le fais, un seul palier à la fois (NON SOURCÉ). Zone au niveau 2 : aucune hausse (R2). Vu l'épaule et le poignet, la hausse se fait par les répétitions puis par l'échelon, jamais par un autre gilet dans la même séance. **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24 (sécurité reprise par `kine` le 2026-10-25, à contrôler par `relecteur` lancé à neuf). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | retirer: remplacant:pompe-sol | retirer: remplacant:pompe-sol | retirer |
| Coude | retirer: remplacant:pompe-sol | retirer: remplacant:pompe-sol | retirer |
| Poignet | retirer: remplacant:pompe-sol | retirer: remplacant:pompe-sol | retirer |
| Dos | adapter: amplitude:lente | retirer: remplacant:pompe-sol | retirer |
| Cou | adapter: amplitude:tete-alignee | retirer: remplacant:pompe-sol | retirer |

**Notes**
- general : règle unique du gilet en pompe (choix de kine, NON SOURCÉ) : pompe avancée, charge fixe sur des articulations qui portent déjà le poids du corps ; dès la gêne légère à l'épaule, au coude ou au poignet, le gilet est retiré (pompe au sol sans gilet, remplaçant pompe-sol, qui a ses propres lignes : s'il est lui-même adapté par le profil, le générateur choisit une autre pompe). Dos : la gêne légère ralentit le geste, la gêne nette retire le gilet.
- epaule-n1 : gilet retiré dès la gêne légère ; choix prudent, NON SOURCÉ.
- epaule-n2 : gilet retiré : pompe au sol sans gilet, aucune hausse (R2).
- coude-n1 : gilet retiré dès la gêne légère.
- poignet-n1 : gilet retiré dès la gêne légère ; le poignet ne reçoit pas de charge fixe supplémentaire.
- dos-n1 : descente lente (3 secondes), corps en ligne ; le gilet reste.
- dos-n2 : gilet retiré.
- cou-n1 : tête dans le prolongement du dos, regard entre les mains.
- cou-n2 : gilet retiré (le haut du corps porte la charge, la nuque tient la tête).
- grossesse : retiré : gilet sur la poitrine et le ventre, charge fixe ; remplacé par la pompe sur chaise sans gilet (variante adaptée de la fiche pompe). Post-partum : G7.

**Grossesse** : retirer: remplacant:pompe
**Version plus douce** : pompe-sol

**Sécurité pour l'utilisateur seul**
- Tapis ferme sous les mains et les genoux, sol non glissant, aucun obstacle devant le visage (NON SOURCÉ).
- Sortie de secours (mains au sol) : si tu n'arrives plus à remonter, descends d'abord les genoux sur le tapis, puis le ventre et la poitrine ; le gilet est à plat et ne te tombe pas sur la tête. Essaie cette sortie une fois à vide avant la première vraie série. Si tu es mal (étourdissement, serrement de poitrine), arrête, ouvre le gilet, assieds-toi (NON SOURCÉ).
- Sortie de secours (pieds sur chaise) : si tu n'arrives plus à remonter, plie les genoux et ramène un pied puis l'autre au sol, genoux sur le tapis, en contrôlant avec les bras ; ne te laisse pas tomber. Chaise calée contre un mur, assise sèche qui ne glisse pas. À essayer aussi une fois à vide.
- Première fois : le lest le plus léger du gilet ; jamais plus lourd que ce que tu tiens avec 2 à 3 répétitions en réserve (NON SOURCÉ).
- Pas d'échec : arrête la série avec au moins 2 répétitions en réserve.

**Points d'attention (kine)**
- Épaule, coude, poignet : charge fixe sur des articulations qui travaillent déjà en pompe ; dès la gêne légère, sans gilet (règle unique, NON SOURCÉ). Dos : gêne légère, descente lente ; gêne nette, sans gilet.
- Niveau avancé : le gilet ajoute de la charge à un exercice déjà complet ; réservé à qui fait 15 pompes propres sans gilet (seuil de coach, NON SOURCÉ).
- Grossesse et post-partum : retiré (gilet sur la poitrine et le ventre) ; en post-partum, fuite d'urine ou pesanteur dans le bas-ventre : arrêt et avis de la sage-femme (G7).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) à l'épaule, au coude, au poignet ou au bas du dos.
- Corps qui se casse au milieu de la série : arrête et retire le gilet.
- Respiration gênée par le gilet : retire-le.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe : arrête.

**Objets du quotidien**
- Gilet lesté : bien ajusté et fermé, lests calés dans leurs poches (rien qui ballotte), sans déchirure ni fermeture usée ; il se retire d'un geste (apprends à l'ouvrir avant la première série) ; le poids exact est celui que tu connais (l'app ne le connaît pas, NON SOURCÉ).
- Sol plat, sec, non glissant ; chaussures fermées à semelle plate ; espace libre autour de toi (NON SOURCÉ).
- Tapis antidérapant épais sous les mains ; chaise sans roulettes, pieds arrière contre un mur plein (variante pieds sur chaise).

## Photo
- `Pushups/0.jpg` : affichable : non (pompe sans gilet : la fiche porte sur le gilet, que la photo ne montre pas ; l'illustration le dessine)
- `Pushups/1.jpg` : affichable : non (idem)
- illustration : public/illustrations/pompe-gilet-lest.svg : affichable : oui (illustration originale de l'app)
- légende : Variante mains au sol. Pieds sur une chaise : même geste, pieds plus hauts.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, consignes de départ) | free-exercise-db Pushups (beginner, body only) pour le geste sans gilet ; aucune entrée avec gilet (dist/exercises.json, vérifié le 2026-10-24) ; geste décrit par coach d'après la pratique courante | pratique (pas une étude) | 2026-10-24 | NON SOURCÉ |
| Gilet lesté + sauts : densité osseuse de la hanche maintenue chez 9 femmes ménopausées contre 9 témoins, sur 5 ans ; aucune étude lue sur ces exercices simples ni sur ce public : l'usage du gilet avec cet exercice relève du choix de coach (NON SOURCÉ), pas de cette étude | Snow, Shaw, Winters, Witzke, « Long-term exercise using weighted vests prevents hip bone loss in postmenopausal women », J Gerontol A Biol Sci Med Sci 2000;55(9):M489-M491, PMID 10995045 : 18 femmes ménopausées (9 avec gilet lesté et sauts, 9 témoins), 5 ans, densité osseuse de la hanche maintenue dans le groupe gilet + sauts ; résumé Europe PMC lu | étude contrôlée de petite taille (18 femmes), public différent | 2026-10-24 | PROVISOIRE (résumé seulement ; contexte, ne valide pas la fiche) |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Gilet lesté (poids, ajustement, fermeture), tapis, chaise, mur | pratique de salle et raisonnement de coach ; aucune notice de fabricant lue | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; référence du dépôt, non rouverte pour ce lot. L'interdiction de l'échec seul est une règle de sécurité de coach | revue de revues ACSM (OK) ; la règle de sécurité n'est pas une conclusion de l'étude | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; NON SOURCÉ pour la règle de sécurité |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 2026-10-25, à contrôler par relecteur) |
| Grossesse et post-partum : gilet lesté retiré (charge fixe qu'on ne peut pas alléger, poids sur le ventre et la poitrine) ; remplacé par la pompe sur chaise (sans gilet) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe (éviter isométrique prolongé, Valsalva, chute, couché sur le dos) : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach) |
