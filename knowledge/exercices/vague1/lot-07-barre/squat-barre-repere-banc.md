---
id: squat-barre-repere-banc
nom: Squat à la barre avec repère de profondeur
alias: [box squat, squat à la boîte]
schema: squat
type: force
niveau_min: intermediaire
muscles_principaux: [quadriceps, fessiers]
muscles_secondaires: [ischios, adducteurs, erecteurs_rachis]
source_brouillon: []
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| squat-barre-repere-banc-vide | Barre seule, banc comme repère | 1 | intermediaire | barre, disques, rack, banc | Barre seule sur le haut du dos dans le rack ; un banc plat derrière toi, assez bas pour que les cuisses soient au moins parallèles quand tu le touches des fesses ; barres de sécurité sous le banc. |
| squat-barre-repere-box | Barre seule, box comme repère | 1 | intermediaire | barre, disques, rack, box_ou_step | Même principe avec une box stable à la place du banc. |
| squat-barre-repere-banc-charge | Avec disques, banc comme repère | 2 | intermediaire | barre, disques, rack, banc | Même installation avec des disques ajoutés par petits paliers, barres de sécurité testées à vide. |

## Consignes
1. Installe un banc plat (ou une box stable) derrière toi, dans le rack, à une hauteur qui te laisse les cuisses au moins parallèles au sol quand tu le touches ; place les barres de sécurité juste sous cette hauteur.
2. Pose la barre sur le haut du dos (sur les muscles, pas sur la nuque), mains larges, coudes sous la barre ; sors-la du rack et recule jusqu'à ce que le banc soit derrière tes mollets.
3. Pieds à largeur d'épaules, descends en envoyant les fesses en arrière et en poussant les genoux dans l'axe des pieds, jusqu'à toucher légèrement le banc.
4. Touche et repars tout de suite : ne te laisse pas tomber, ne te détends pas sur le banc ; remonte en poussant dans tout le pied.
5. Fin de série : repose la barre sur les supports du rack.

## Points d'attention
- Le banc est un repère de profondeur, pas un siège : un simple contact des fesses, jamais un relâchement du dos assis avec la barre sur toi.
- Garde la barre seule jusqu'à ce que le geste soit stable ; les disques viennent ensuite.
- Si tu bloques en haut de la descente, les barres de sécurité sont sous le banc : laisse la barre s'y poser en t'accroupissant et sors vers l'avant.
- Version guidée recommandée avant le squat arrière à la barre (voir squat-arriere-barre).
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- S'asseoir et se relâcher sur le banc avec la barre sur le dos.
- Se laisser tomber sur le banc.
- Genoux qui rentrent.
- Banc trop bas pour ta souplesse : le dos s'arrondit.

## Progression / régression
- plus-facile : squat-gobelet-banc, squat-gobelet
- plus-dur : squat-arriere-barre

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE ; ACSM 2026, SRC1 : force = charges lourdes, 2 à 3 séries par exercice, exercice prioritaire en début de séance) : force intermédiaire et avancé 4 à 6 répétitions, 3 séries, 2 répétitions en réserve, repos 180 s ; force débutant 6 à 10 répétitions, 2 séries, 3 en réserve, repos 120 s ; muscle 8 à 12 répétitions (10 à 12 pour un débutant), 2 à 3 en réserve, repos 90 à 120 s. Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. Étalonnage (load-calibration.md) : première séance avec la barre seule (ou la charge la plus légère du profil), puis on ajoute les disques par petits paliers réels ; après chaque série, une question : « combien de répétitions te restait-il ? » ; double progression (on monte les répétitions, puis la charge). **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : jamais 0 répétition en réserve, jamais de série menée jusqu'à l'échec ; si la vitesse de la barre chute nettement ou si la technique se dégrade, la série est finie.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24, repris et corrigé par `kine` le 2026-10-24 (à contrôler par `relecteur`). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: charge:legere | retirer: remplacant:squat-gobelet-banc | retirer |
| Épaule | adapter: charge:legere | retirer: remplacant:squat-gobelet-banc | retirer |
| Coude | garder | adapter: charge:legere | retirer |
| Poignet | garder | adapter: charge:legere | retirer |
| Genou | adapter: amplitude:sans-gene | adapter: amplitude:mi-course | retirer |
| Hanche | adapter: amplitude:sans-gene | adapter: amplitude:mi-course | retirer |
| Cheville | garder | adapter: amplitude:sans-gene | retirer |
| Cou | adapter: charge:legere | retirer: remplacant:squat-gobelet-banc | retirer |
| Cuisse | garder | adapter: amplitude:sans-gene | retirer |
| Aine | garder | adapter: amplitude:sans-gene | retirer |

**Notes**
- general : La barre seule pèse souvent 20 kg (parfois moins) : c'est déjà une charge. Si elle est trop lourde pour garder le geste propre, passe à la version aux haltères (NON SOURCÉ ; question Q12 de docs/QUESTIONS.md).
- general : niveau minimum relevé de débutant à intermédiaire par kine (barre chargée sur le dos, seul, sans personne pour régler les barres de sécurité : choix prudent NON SOURCÉ ; question Q18 de docs/QUESTIONS.md). Le débutant passe par le squat gobelet au banc.
- dos-n1 : charge légère ; barre sur les muscles du haut du dos.
- dos-n2 : colonne chargée : retiré ; remplaçant squat gobelet au banc.
- epaule-n1 : prise plus large, barre seule.
- epaule-n2 : position des bras derrière la barre : retiré.
- genou-n2 : demi-descente : banc plus haut.
- cou-n1 : barre sur les muscles du haut du dos, pas sur la nuque ; charge légère.
- cou-n2 : la barre appuie sur la base du cou : retiré ; remplaçant squat gobelet au banc.
- cuisse-n2 : ischios secondaires : descente sans gêne.
- aine-n2 : adducteurs secondaires : pieds moins écartés.
- grossesse : barre sur le dos (équilibre, blocage de la respiration) : retiré par prudence, confirmé par kine (NON SOURCÉ) ; remplaçant : squat gobelet au banc, charge légère. Post-partum : G7.

**Grossesse** : retirer: remplacant:squat-gobelet-banc
**Version plus douce** : squat-gobelet-banc

**Sécurité pour l'utilisateur seul**
- Le matériel « rack » de l'app veut dire : rack ou cage à squat avec barres de sécurité (ou goujons). Sans barres de sécurité, ne coche pas « rack » et ne fais pas cette variante.
- Barres de sécurité réglées **avant la première série** juste sous la barre quand tu touches le banc (ou la box), testées à vide avec la barre seule : la barre doit pouvoir s'y poser sans te coincer.
- Le banc ou la box ne bouge pas : calé contre un mur ou une butée, sol non glissant ; sinon tu pars en arrière avec la barre. Une box ou un step léger qui glisse n'est pas un repère.
- Si tu bloques en bas : ne te penche pas en avant ; laisse la barre se poser sur les barres de sécurité en t'accroupissant un peu plus, puis dégage-toi en avançant.
- Colliers de serrage posés et serrés des deux côtés avant chaque série, mêmes disques de chaque côté (un disque qui glisse fait basculer la barre).
- Pas d'échec : arrête la série avec au moins 2 répétitions en réserve ; si la barre ralentit nettement ou si la technique se dégrade, la série est finie. En cas de doute sur la charge, prends plus léger.
- Idéalement, quelqu'un dans la maison ou la salle, à portée de voix. Un partenaire peut aider, mais il ne remplace jamais les barres de sécurité.

**Points d'attention (kine)**
- Le banc ou la box est un repère de profondeur, pas un siège : touche-le à peine des fesses et remonte tout de suite, sans te relâcher assis, sans rebond. Un relâchement du dos assis avec la barre sur toi comprime la colonne.
- Hauteur du repère : assez haute pour que le bas du dos ne s'arrondisse pas quand tu touches ; si le dos s'arrondit au contact, monte le repère.
- Barre seule jusqu'à ce que le geste soit stable, puis des disques par petits paliers (variante 2).
- Barre sur les muscles du haut du dos, jamais sur la nuque ; tenue à mains larges, poignets droits. Épaule, coude ou poignet qui tirent : écarte les mains, sinon passe au squat gobelet au banc.
- Niveau : intermédiaire (choix prudent de kine). Cette variante guidée prépare le squat arrière (fiche squat-arriere-barre).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au bas du dos, à l'épaule, au genou ou à la hanche.
- Barre qui part de travers, disque qui glisse ou collier qui bouge : repose la barre (sur le rack ou au sol) avant tout.
- Perte de contrôle de la barre ou impression que tu ne pourras pas finir la répétition : arrête la série, ne force pas.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Douleur au bas du dos en touchant le banc.
- Voile devant les yeux, vertige ou tête qui tourne en fin de série (souvent un blocage de la respiration) : repose la barre, assieds-toi, ne reprends pas la séance (R5).
- Colliers qui bougent ou disques de travers : repose la barre avant tout.
- Banc ou box qui glisse ou bascule quand tu le touches : repose la barre sur les barres de sécurité, n'utilise plus ce repère.

**Objets du quotidien**
- Barre et disques : colliers de serrage (clips) posés et serrés des deux côtés avant chaque série ; mêmes disques de chaque côté ; barre droite (ni tordue, ni jeu dans les manchons) ; disques jamais posés « sans collier » même pour une série légère.
- Rack ou cage à squat : stable (fixé, lesté ou contre un mur), supports de barre réglés à la bonne hauteur et bloqués ; **barres de sécurité (ou goujons) réglées AVANT la première série et testées à vide** : la barre doit pouvoir se poser dessus sans que tu sois écrasé. Pas de rack = pas de cette variante (le tag `rack` est obligatoire).
- Banc : 4 appuis au sol, qui ne bascule pas et ne glisse pas (sol non glissant, banc calé si besoin), vis, pieds et réglage en bon état ; avant la première série, appuie-toi dessus comme pendant l'exercice : s'il bouge, grince ou se plie, ne l'utilise pas. Un canapé, un lit ou une caisse ne remplacent pas un banc.
- Box ou step : stable, large, antidérapante, de la bonne hauteur ; jamais une pile d'objets.
- Sol plat, sec, non glissant (planches ou tapis de salle fermes) ; chaussures fermées à semelle plate ou rigide ; espace libre autour de la barre, rien derrière toi ; jamais de pieds nus avec une barre chargée.
- Banc ou box de repère : stable, large, antidérapant, calé ; vérifie-le en t'asseyant dessus avant la première série.

## Photo
- `Box_Squat/0.jpg` : affichable : à vérifier (candidat free-exercise-db non vu ; WebP à créer par dev ; vérifier : la photo montre-t-elle un contact léger ou un relâchement assis ? sinon écarter)
- `Box_Squat/1.jpg` : affichable : à vérifier (candidat free-exercise-db non vu ; WebP à créer par dev ; idem)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet de la barre, consignes de départ) : Box_Squat (niveau « intermediate » dans la base), Barbell_Squat_To_A_Bench | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db ; fichier dist/exercises.json relu le 2026-10-24 pour vérifier l'existence de l'entrée, son niveau et son matériel ; consignes réécrites par coach | base d'exercices (pratique, pas une étude) | 2026-10-24 | PROVISOIRE |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Colliers de serrage, barres de sécurité du rack réglées et testées, installation seul, objets du quotidien | regles-securite-communes.md §7 et R8 ; pratique de salle, raisonnement mécanique de coach | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul (barre lourde) | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul avec une barre est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Zones de blessures les plus fréquentes chez les haltérophiles et les pratiquants de force athlétique (colonne, épaule, genou) : justifie un tableau complet par zone | Aasa et coll., Br J Sports Med 2017;51(4):211-219, https://pubmed.ncbi.nlm.nih.gov/27707741/ ; revue systématique de 9 études, la plupart de faible qualité ; résumé lu via moteur de recherche | revue systématique, athlètes de compétition, qualité faible ; ne concerne pas les pratiquants de loisir | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 24/10/2026, à contrôler par relecteur) |
| Grossesse et post-partum : barre chargée retirée par prudence (équilibre, apnée, chute de la barre) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas la barre chargée | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, confirmée par kine le 24/10/2026 comme choix prudent, à contrôler par relecteur) |
| Descendre profond (cuisses au moins parallèles) fait davantage grossir le devant de la cuisse et améliore le saut qu'une demi-descente (17 hommes, 12 semaines, squat lourd 0-120 contre 0-60 degrés) | Bloomquist et coll., Eur J Appl Physiol 2013;113(8):2133-2142, DOI 10.1007/s00421-013-2642-7 ; résumé lu via moteur de recherche, texte complet non lu | essai randomisé, 17 hommes jeunes, squat à la barre ; ne porte ni sur des débutants, ni sur des femmes | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Une descente profonde n'est pas démontrée dangereuse pour un genou sain ; les forces au genou sont maximales vers 90 degrés | Hartmann, Wirth, Klusemann, Sports Med 2013;43(10):993-1008, https://pubmed.ncbi.nlm.nih.gov/23821469/ ; revue de la littérature (plus de 160 articles) ; résumé lu via moteur de recherche | revue narrative, adultes sains ; ne couvre pas les genoux douloureux ni l'arthrose | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Niveau minimum, barres de sécurité et repli en cas de blocage, colliers, pas d'échec seul, cases par zone et par niveau, grossesse, remplaçants, points d'attention (kine) | Raisonnement de `kine` à partir des règles communes (regles-securite-communes.md) et des études déjà citées dans cette fiche (résumés seulement). Aucune source nouvelle lue pour cette passe ; aucune étude ne teste ces choix exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (choix prudents de kine, à contrôler par relecteur) |
