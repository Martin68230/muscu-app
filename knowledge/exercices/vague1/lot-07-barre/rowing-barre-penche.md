---
id: rowing-barre-penche
nom: Rowing à la barre, buste penché
alias: [bent-over row, rowing barre]
schema: tirage_h
type: force
niveau_min: debutant
muscles_principaux: [grand_dorsal, rhomboides]
muscles_secondaires: [trapezes, deltoides_posterieurs, biceps, erecteurs_rachis, avant_bras]
source_brouillon: []
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| rowing-barre-penche-appuye | Poitrine appuyée sur un banc incliné | 1 | debutant | barre, disques, banc_inclinable | Allongé à plat ventre sur un banc incliné réglé assez haut pour que la barre ne touche pas le sol en bas du mouvement ; la poitrine est soutenue, le dos au repos. |
| rowing-barre-penche-libre | Buste penché, barre reprise du sol | 2 | intermediaire | barre, disques | Debout, genoux fléchis, buste penché à environ 45 degrés, dos plat, barre qui pend devant les genoux. |

## Consignes
1. Variante appuyée : règle le banc incliné assez haut, allonge-toi à plat ventre, poitrine et ventre en appui, menton au-dessus du bord, bras tendus vers la barre posée au sol.
2. Variante libre : pieds à la largeur du bassin, genoux fléchis, penche le buste à environ 45 degrés en poussant les hanches vers l'arrière, dos plat, barre en prise pronation un peu plus large que les épaules.
3. Tire la barre vers le bas de la poitrine (appuyée) ou vers le nombril (libre) en pensant à rapprocher les omoplates, coudes qui passent le long du corps.
4. Redescends lentement jusqu'à presque tendre les bras, sans perdre la position du buste.
5. Fin de série : repose la barre au sol de façon contrôlée.

## Points d'attention
- La variante appuyée protège le bas du dos : à privilégier pour débuter ou quand le dos est sensible.
- En version libre, le buste ne bouge pas : s'il se relève pour finir la répétition, la charge est trop lourde.
- Pas d'élan du corps.
- Garde le cou dans le prolongement du dos (regard vers le sol à quelques mètres).
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Dos qui s'arrondit.
- Buste qui se redresse à chaque tirage.
- Tirer vers le haut de la poitrine (épaules hautes).
- Barre trop loin du corps.

## Progression / régression
- plus-facile : rowing-buste-penche-halteres, rowing-poitrine-appuyee-banc
- plus-dur : rowing-pendlay-barre

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE ; ACSM 2026, SRC1 : force = charges lourdes, 2 à 3 séries par exercice, exercice prioritaire en début de séance) : force intermédiaire et avancé 4 à 6 répétitions, 3 séries, 2 répétitions en réserve, repos 180 s ; force débutant 6 à 10 répétitions, 2 séries, 3 en réserve, repos 120 s ; muscle 8 à 12 répétitions (10 à 12 pour un débutant), 2 à 3 en réserve, repos 90 à 120 s. Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. Étalonnage (load-calibration.md) : première séance avec la barre seule (ou la charge la plus légère du profil), puis on ajoute les disques par petits paliers réels ; après chaque série, une question : « combien de répétitions te restait-il ? » ; double progression (on monte les répétitions, puis la charge). **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : jamais 0 répétition en réserve, jamais de série menée jusqu'à l'échec ; si la vitesse de la barre chute nettement ou si la technique se dégrade, la série est finie.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24, repris et corrigé par `kine` le 2026-10-24 (à contrôler par `relecteur`). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: variante:rowing-barre-penche-appuye | adapter: variante:rowing-barre-penche-appuye | retirer |
| Épaule | adapter: charge:legere | retirer | retirer |
| Coude | garder | adapter: charge:legere | retirer |
| Poignet | garder | adapter: charge:legere | retirer |
| Genou | garder | garder | retirer |
| Hanche | garder | garder | retirer |
| Cheville | garder | garder | retirer |
| Cou | garder | adapter: charge:legere | retirer |

**Notes**
- general : La barre seule pèse souvent 20 kg (parfois moins) : c'est déjà une charge. Si elle est trop lourde pour garder le geste propre, passe à la version aux haltères (NON SOURCÉ ; question Q12 de docs/QUESTIONS.md).
- dos-n1 : variante appuyée sur le banc incliné.
- dos-n2 : variante appuyée, charge qui ne monte pas (R2).
- epaule-n2 : tirage lourd : retiré ; remplaçant non proposé (rowing aux haltères adapté par la même zone).
- poignet-n1 : prise avec les doigts ; poignets droits.
- genou-n3 : barre chargée avec appui des jambes (pieds au sol, banc ou rack) : la zone est sollicitée, la variante est retirée (aucune variante sans-zone ; règle commune à toutes les fiches du lot, R3).
- hanche-n3 : barre chargée avec appui des jambes (pieds au sol, banc ou rack) : la zone est sollicitée, la variante est retirée (aucune variante sans-zone ; règle commune à toutes les fiches du lot, R3).
- cheville-n3 : barre chargée avec appui des jambes (pieds au sol, banc ou rack) : la zone est sollicitée, la variante est retirée (aucune variante sans-zone ; règle commune à toutes les fiches du lot, R3).
- grossesse : barre lourde, couché sur le ventre ou penché en avant (pression abdominale) : retiré par prudence, confirmé par kine (NON SOURCÉ) ; remplaçant : rowing un bras aux haltères, avec appui. Post-partum : G7.

**Grossesse** : retirer: remplacant:rowing-unilateral-haltere
**Version plus douce** : rowing-unilateral-haltere

**Sécurité pour l'utilisateur seul**
- Variante appuyée (échelon 1) : banc incliné stable (calé), réglé assez haut pour que les bras tendus ne touchent pas le sol ; la barre est prise au sol, bras pendants, sans te pencher pour la saisir. Départ au sol, puis la barre reste en l'air pendant toute la série (à quelques centimètres du sol, sans le toucher entre les répétitions) ; tu ne la reposes qu'en fin de série ou si tu arrêtes.
- Variante libre (échelon 2) : charge que tu contrôles dos droit ; pose la barre au sol dès que le dos s'arrondit ou que le buste se relève pour finir la répétition.
- Colliers de serrage posés et serrés des deux côtés avant chaque série, mêmes disques de chaque côté (un disque qui glisse fait basculer la barre).
- Pas d'échec : arrête la série avec au moins 2 répétitions en réserve ; si la barre ralentit nettement ou si la technique se dégrade, la série est finie. En cas de doute sur la charge, prends plus léger. Chaussures plates, sol non glissant.
- Idéalement, quelqu'un dans la maison ou la salle, à portée de voix. Un partenaire peut aider, mais il ne remplace jamais les barres de sécurité.

**Points d'attention (kine)**
- Dos : la version libre charge fortement le bas du dos (Fenwick 2009, résumé : la charge lombaire la plus élevée des rowings testés, PROVISOIRE). D'où l'échelon 1 appuyé (poitrine soutenue, dos au repos) et la case dos qui y renvoie dès une gêne légère.
- En version libre : buste fixe à environ 45 degrés, dos naturellement droit, genoux fléchis ; le buste ne se relève pas pour finir la répétition (sinon charge trop lourde), pas d'élan.
- Épaule : on tire les coudes vers l'arrière sans hausser les épaules. Cou : dans le prolongement du dos, regard vers le sol à quelques mètres.
- Poignet : prise avec les doigts, poignets droits. Coude : tirage lent, descente contrôlée.
- Niveau : l'échelon 1 (appuyé) reste débutant (bas du dos non chargé) ; la version libre est intermédiaire.
- Grossesse : retiré (à plat ventre ou penché).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au bas du dos, à l'épaule, au coude ou au poignet.
- Barre qui part de travers, disque qui glisse ou collier qui bouge : repose la barre (sur le rack ou au sol) avant tout.
- Perte de contrôle de la barre ou impression que tu ne pourras pas finir la répétition : arrête la série, ne force pas.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Barre qui touche le sol au milieu de la série (banc trop bas).
- Voile devant les yeux, vertige ou tête qui tourne en fin de série (souvent un blocage de la respiration) : repose la barre, assieds-toi, ne reprends pas la séance (R5).
- Colliers qui bougent ou disques de travers : repose la barre avant tout.
- Douleur au bas du dos pendant ou après la série en version libre : pose la barre, passe à la version appuyée ou arrête.

**Objets du quotidien**
- Barre et disques : colliers de serrage (clips) posés et serrés des deux côtés avant chaque série ; mêmes disques de chaque côté ; barre droite (ni tordue, ni jeu dans les manchons) ; disques jamais posés « sans collier » même pour une série légère.
- Banc inclinable : 4 appuis au sol, qui ne bascule pas et ne glisse pas (sol non glissant, banc calé si besoin), vis, pieds et réglage en bon état ; avant la première série, appuie-toi dessus comme pendant l'exercice : s'il bouge, grince ou se plie, ne l'utilise pas. Un canapé, un lit ou une caisse ne remplacent pas un banc.
- Sol plat, sec, non glissant (planches ou tapis de salle fermes) ; chaussures fermées à semelle plate ou rigide ; espace libre autour de la barre, rien derrière toi ; jamais de pieds nus avec une barre chargée.

## Photo
- `Bent_Over_Barbell_Row/0.jpg` : affichable : oui (variante libre (échelon 2), dos plat ; zone floutée sur un logo de rack ; vue le 24/10/2026)
- `Bent_Over_Barbell_Row/1.jpg` : affichable : oui (variante libre (échelon 2), dos plat ; zone floutée sur un logo de rack ; vue le 24/10/2026)
- `Incline_Bench_Pull/0.jpg` : affichable : oui (variante appuyée sur banc incliné (échelon 1), barre au sol ; vue le 24/10/2026)
- `Incline_Bench_Pull/1.jpg` : affichable : oui (variante appuyée sur banc incliné (échelon 1), barre au sol ; vue le 24/10/2026)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet de la barre, consignes de départ) : Bent_Over_Barbell_Row (niveau « beginner »), Incline_Bench_Pull (niveau « beginner ») | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db ; fichier dist/exercises.json relu le 2026-10-24 pour vérifier l'existence de l'entrée, son niveau et son matériel ; consignes réécrites par coach | base d'exercices (pratique, pas une étude) | 2026-10-24 | PROVISOIRE |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Colliers de serrage, barres de sécurité du rack réglées et testées, installation seul, objets du quotidien | regles-securite-communes.md §7 et R8 ; pratique de salle, raisonnement mécanique de coach | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul (barre lourde) | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul avec une barre est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Zones de blessures les plus fréquentes chez les haltérophiles et les pratiquants de force athlétique (colonne, épaule, genou) : justifie un tableau complet par zone | Aasa et coll., Br J Sports Med 2017;51(4):211-219, https://pubmed.ncbi.nlm.nih.gov/27707741/ ; revue systématique de 9 études, la plupart de faible qualité ; résumé lu via moteur de recherche | revue systématique, athlètes de compétition, qualité faible ; ne concerne pas les pratiquants de loisir | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 24/10/2026, à contrôler par relecteur) |
| Grossesse et post-partum : barre chargée retirée par prudence (équilibre, apnée, chute de la barre) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas la barre chargée | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, confirmée par kine le 24/10/2026 comme choix prudent, à contrôler par relecteur) |
| Rowing buste penché à la barre : activation large et symétrique du dos, mais charge sur la colonne lombaire et rigidité les plus élevées des trois rowings comparés | Fenwick, Brown, McGill, J Strength Cond Res 2009;23(2):350-358, https://pubmed.ncbi.nlm.nih.gov/19197209/ ; résumé lu via moteur de recherche | étude de laboratoire, 7 hommes sains ; petit échantillon | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Niveau minimum, barres de sécurité et repli en cas de blocage, colliers, pas d'échec seul, cases par zone et par niveau, grossesse, remplaçants, points d'attention (kine) | Raisonnement de `kine` à partir des règles communes (regles-securite-communes.md) et des études déjà citées dans cette fiche (résumés seulement). Aucune source nouvelle lue pour cette passe ; aucune étude ne teste ces choix exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (choix prudents de kine, à contrôler par relecteur) |
