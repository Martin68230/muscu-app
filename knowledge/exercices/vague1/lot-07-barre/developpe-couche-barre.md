---
id: developpe-couche-barre
nom: Développé couché à la barre
alias: [bench press, développé couché]
schema: poussee_h
type: force
niveau_min: debutant
muscles_principaux: [pectoraux]
muscles_secondaires: [triceps, deltoides_anterieurs, dentele_anterieur]
source_brouillon: []
statut: brouillon_coach
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| developpe-couche-barre-sol | Au sol, barre dans le rack | 1 | debutant | barre, disques, rack | Allongé au sol à l'intérieur du rack, barre sur les supports à hauteur de bras tendus, barres de sécurité juste au-dessus de ta poitrine ; la descente s'arrête quand les coudes touchent le sol. |
| developpe-couche-barre-banc | Sur banc, dans le rack avec barres de sécurité | 2 | intermediaire | barre, disques, rack, banc | Banc plat au centre du rack, barre sur les supports à hauteur de bras tendus, barres de sécurité juste au-dessus de la poitrine ; pieds à plat au sol, omoplates serrées contre le banc. |

## Consignes
1. Règle le rack : supports de barre à hauteur de bras tendus, barres de sécurité juste au-dessus de ta poitrine ; teste-les à vide en t'allongeant.
2. Allonge-toi les yeux sous la barre, pieds à plat, omoplates serrées contre le banc (ou le sol), fesses en contact ; prends la barre un peu plus large que les épaules, le pouce autour de la barre.
3. Sors la barre des supports bras tendus, avance-la au-dessus de la poitrine, puis descends-la lentement jusqu'à la poitrine (ou jusqu'aux coudes au sol), coudes à environ 45 degrés du buste.
4. Pousse la barre vers le haut jusqu'aux bras tendus, sans verrouiller les coudes.
5. Fin de série : replace la barre sur les supports en la guidant vers l'arrière (ne la lâche pas) ; dégage-toi seulement quand elle est posée.

## Points d'attention
- Tête, épaules et fesses restent en contact avec le banc ; pieds fermes au sol.
- La barre descend sur le bas de la poitrine, pas sur la gorge.
- Au sol, la course est plus courte : c'est la version à privilégier au début ou quand l'épaule tire.
- Sans partenaire, la sécurité repose sur les barres de sécurité (voir plus bas).
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Coudes écartés à 90 degrés (épaule en position difficile).
- Rebond de la barre sur la poitrine.
- Fesses qui décollent ou dos très cambré.
- Pouce du même côté que les doigts.
- Barre inclinée ou mal centrée.

## Progression / régression
- plus-facile : developpe-au-sol-halteres, developpe-couche-halteres
- plus-dur : developpe-incline-barre

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE ; ACSM 2026, SRC1 : force = charges lourdes, 2 à 3 séries par exercice, exercice prioritaire en début de séance) : force intermédiaire et avancé 4 à 6 répétitions, 3 séries, 2 répétitions en réserve, repos 180 s ; force débutant 6 à 10 répétitions, 2 séries, 3 en réserve, repos 120 s ; muscle 8 à 12 répétitions (10 à 12 pour un débutant), 2 à 3 en réserve, repos 90 à 120 s. Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. Étalonnage (load-calibration.md) : première séance avec la barre seule (ou la charge la plus légère du profil), puis on ajoute les disques par petits paliers réels ; après chaque série, une question : « combien de répétitions te restait-il ? » ; double progression (on monte les répétitions, puis la charge). **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : jamais 0 répétition en réserve, jamais de série menée jusqu'à l'échec ; si la vitesse de la barre chute nettement ou si la technique se dégrade, la série est finie.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24 (proposition prudente, **à compléter et corriger par `kine`**). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | garder | adapter: charge:legere | retirer |
| Épaule | adapter: variante:developpe-couche-barre-sol | retirer | retirer |
| Coude | garder | adapter: charge:legere | retirer |
| Poignet | garder | adapter: charge:legere | retirer |
| Genou | garder | garder | retirer: sans-zone:developpe-couche-barre-sol |
| Hanche | garder | garder | retirer: sans-zone:developpe-couche-barre-sol |
| Cheville | garder | garder | retirer: sans-zone:developpe-couche-barre-sol |
| Cou | garder | adapter: charge:legere | retirer |

**Notes**
- epaule-n1 : développé au sol : la course s'arrête aux coudes.
- epaule-n2 : le remplaçant (développé aux haltères) serait lui-même adapté par la même zone : retrait sans remplaçant ; le générateur choisit un autre exercice de poussée horizontale.
- poignet-n1 : poignets droits sous la barre (l'app ne conseille ni bandage ni sangles).
- dos-n2 : arc du dos réduit, barre légère.
- cou-n1 : tête appuyée sur le banc, ne la relève pas.
- grossesse : couché sur le dos avec une barre au-dessus de la poitrine : retiré (G4 pour le couché sur le dos) ; remplaçant : développé épaules assis aux haltères, charge légère. Post-partum : G7.

**Grossesse** : retirer: remplacant:developpe-epaules-halteres
**Version plus douce** : developpe-couche-barre-sol

**Sécurité pour l'utilisateur seul**
- Barres de sécurité (ou goujons) du rack réglées juste au-dessus de ta poitrine (assez haut pour pouvoir te dégager, assez bas pour que la barre ne t'écrase pas), **testées à vide avant la première série**.
- Pas de rack avec sécurités = pas de développé couché chargé seul (utilise le développé couché aux haltères, qui se pose sur les cuisses).
- Colliers de serrage des deux côtés ; pas de pouce du même côté que les doigts (« prise de singe ») : le pouce entoure la barre.
- Pas d'échec : arrête avec au moins 2 répétitions en réserve ; un partenaire peut aider mais ne remplace pas les barres de sécurité.
- Si la barre ralentit et ne remonte plus : redescends-la sur la poitrine en contrôle puis pose-la sur les barres de sécurité et dégage-toi (ne la bascule jamais d'un seul côté).

**Points d'attention (kine)**
- À rédiger et corriger par `kine` (étape suivante du cycle). Points de départ proposés par coach : voir « Sécurité pour l'utilisateur seul » ci-dessus et les notes par zone.
- Épaule (position, charge), poignet et cou (tête sur le banc) en priorité.
- Règle de sécurité (barres de sécurité) : c'est le point le plus important du lot.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente à l'épaule, au coude, au poignet ou au bas du dos.
- Barre qui part de travers, disque qui glisse ou collier qui bouge : repose la barre (sur le rack ou au sol) avant tout.
- Perte de contrôle de la barre ou impression que tu ne pourras pas finir la répétition : arrête la série, ne force pas.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Barre que tu ne contrôles plus au-dessus de toi.

**Objets du quotidien**
- - Barre et disques : colliers de serrage (clips) posés et serrés des deux côtés avant chaque série ; mêmes disques de chaque côté ; barre droite (ni tordue, ni jeu dans les manchons) ; disques jamais posés « sans collier » même pour une série légère.
- - Rack ou cage à squat : stable (fixé, lesté ou contre un mur), supports de barre réglés à la bonne hauteur et bloqués ; **barres de sécurité (ou goujons) réglées AVANT la première série et testées à vide** : la barre doit pouvoir se poser dessus sans que tu sois écrasé. Pas de rack = pas de cette variante (le tag `rack` est obligatoire).
- - Banc : 4 appuis au sol, qui ne bascule pas et ne glisse pas (sol non glissant, banc calé si besoin), vis, pieds et réglage en bon état ; avant la première série, appuie-toi dessus comme pendant l'exercice : s'il bouge, grince ou se plie, ne l'utilise pas. Un canapé, un lit ou une caisse ne remplacent pas un banc.
- - Sol plat, sec, non glissant (planches ou tapis de salle fermes) ; chaussures fermées à semelle plate ou rigide ; espace libre autour de la barre, rien derrière toi ; jamais de pieds nus avec une barre chargée.

## Photo
- `Barbell_Bench_Press_-_Medium_Grip/0.jpg` : affichable : à vérifier (candidat free-exercise-db non vu ; WebP à créer par dev ; vérifier : barre de sécurité visible ? sinon mention)
- `Barbell_Bench_Press_-_Medium_Grip/1.jpg` : affichable : à vérifier (candidat free-exercise-db non vu ; WebP à créer par dev ; idem)
- `Floor_Press/0.jpg` : affichable : à vérifier (candidat free-exercise-db non vu ; WebP à créer par dev ; variante au sol ; vérifier)
- `Floor_Press/1.jpg` : affichable : à vérifier (candidat free-exercise-db non vu ; WebP à créer par dev ; idem)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet de la barre, consignes de départ) : Barbell_Bench_Press_-_Medium_Grip, Floor_Press | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db ; fichier dist/exercises.json relu le 2026-10-24 pour vérifier l'existence de l'entrée, son niveau et son matériel ; consignes réécrites par coach | base d'exercices (pratique, pas une étude) | 2026-10-24 | PROVISOIRE |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Colliers de serrage, barres de sécurité du rack réglées et testées, installation seul, objets du quotidien | regles-securite-communes.md §7 et R8 ; pratique de salle, raisonnement mécanique de coach | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul (barre lourde) | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul avec une barre est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Zones de blessures les plus fréquentes chez les haltérophiles et les pratiquants de force athlétique (colonne, épaule, genou) : justifie un tableau complet par zone | Aasa et coll., Br J Sports Med 2017;51(4):211-219, https://pubmed.ncbi.nlm.nih.gov/27707741/ ; revue systématique de 9 études, la plupart de faible qualité ; résumé lu via moteur de recherche | revue systématique, athlètes de compétition, qualité faible ; ne concerne pas les pratiquants de loisir | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (à compléter par kine puis contrôler par relecteur) |
| Grossesse et post-partum : barre chargée retirée par prudence (équilibre, apnée, chute de la barre) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas la barre chargée | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, à valider par kine) |
| Prise plus large au développé couché : charges plus lourdes, plus d'activité du biceps, moins du triceps ; prise étroite : charges plus faibles, plus de triceps (28 hommes, 6 répétitions maximum) | Saeterbakken et coll., Int J Environ Res Public Health 2021, https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8296276/ ; résumé lu via moteur de recherche, texte complet non lu | étude de laboratoire, 28 hommes (novices et entraînés), EMG ; ne porte pas sur la sécurité de l'épaule | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Un banc horizontal active à la fois le haut et le bas du grand pectoral ; 30 à 45 degrés d'inclinaison changent l'activation à certains moments du mouvement | Lauver, Cayot, Scheuermann, Eur J Sport Sci 2016;16(3):309-316, https://pubmed.ncbi.nlm.nih.gov/25799093/ ; résumé lu via moteur de recherche, texte complet non lu | étude de laboratoire (EMG), 14 hommes entraînés, développé à la barre à 65 % du maximum | 2026-10-24 | PROVISOIRE (résumé seulement) |
