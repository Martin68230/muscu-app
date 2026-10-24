---
id: souleve-de-terre-roumain-barre
nom: Soulevé de terre roumain à la barre
alias: [romanian deadlift, jambes tendues, stiff-leg]
schema: charniere
type: force
niveau_min: intermediaire
muscles_principaux: [ischios, fessiers]
muscles_secondaires: [erecteurs_rachis, avant_bras, trapezes, adducteurs]
source_brouillon: []
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| souleve-de-terre-roumain-barre-rack | Barre prise au rack, genoux légèrement pliés | 1 | intermediaire | barre, disques, rack | Barre posée sur les supports à hauteur de cuisses, tu la prends et tu recules d'un pas ; genoux légèrement pliés et fixes, descente jusqu'aux genoux ou mi-tibia. |
| souleve-de-terre-roumain-barre-sol | Barre reprise du sol, descente plus longue | 2 | intermediaire | barre, disques | Tu pars du sol (soulevé), puis tu descends la barre par une charnière de hanches jusqu'à ce que l'arrière des cuisses tire, sans la poser entre les répétitions. |
| souleve-de-terre-jambes-tendues-barre | Jambes presque tendues | 2 | intermediaire | barre, disques | Même départ que la reprise du sol (échelon 2), genoux à peine pliés : l'étirement de l'arrière des cuisses est plus grand, la charge doit être plus légère. |

## Consignes
1. Prends la barre au rack (ou lève-la du sol) à la largeur des épaules, bras tendus, barre contre les cuisses ; pieds à la largeur du bassin, genoux légèrement pliés.
2. Dos plat, poitrine ouverte, regard devant toi : pousse les hanches vers l'arrière en faisant glisser la barre le long des cuisses, comme pour fermer une porte avec les fesses.
3. Descends jusqu'à sentir l'arrière des cuisses tirer (barre vers les genoux ou à mi-tibia) tant que le dos reste plat ; les genoux ne bougent presque pas.
4. Remonte en poussant les hanches vers l'avant et en serrant les fessiers, barre toujours collée aux jambes.
5. Fin de série : repose la barre sur les supports du rack, ou au sol de façon contrôlée.

## Points d'attention
- C'est la charnière de hanche qui travaille, pas le dos : la barre ne dépasse pas ce que tu peux contrôler avec le dos plat.
- Version depuis le rack d'abord (pas de soulevé à faire) ; version avec reprise du sol ensuite.
- Le roumain se fait avec une charge plus légère que le soulevé de terre classique.
- Les jambes presque tendues étirent davantage l'arrière des cuisses : réservé à ceux qui n'ont aucune gêne à cet endroit.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Dos qui s'arrondit en bas.
- Plier les genoux plus qu'au départ (c'est devenu un squat).
- Barre qui s'éloigne des cuisses.
- Se redresser en cambrant fort en haut.

## Progression / régression
- plus-facile : souleve-de-terre-roumain-halteres, pont-fessier
- plus-dur : souleve-de-terre-barre, souleve-de-terre-roumain-unijambiste

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE ; ACSM 2026, SRC1 : force = charges lourdes, 2 à 3 séries par exercice, exercice prioritaire en début de séance) : force intermédiaire et avancé 4 à 6 répétitions, 3 séries, 2 répétitions en réserve, repos 180 s ; force débutant 6 à 10 répétitions, 2 séries, 3 en réserve, repos 120 s ; muscle 8 à 12 répétitions (10 à 12 pour un débutant), 2 à 3 en réserve, repos 90 à 120 s. Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. Étalonnage (load-calibration.md) : première séance avec la barre seule (ou la charge la plus légère du profil), puis on ajoute les disques par petits paliers réels ; après chaque série, une question : « combien de répétitions te restait-il ? » ; double progression (on monte les répétitions, puis la charge). **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : jamais 0 répétition en réserve, jamais de série menée jusqu'à l'échec ; si la vitesse de la barre chute nettement ou si la technique se dégrade, la série est finie.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24, repris et corrigé par `kine` le 2026-10-24 (à contrôler par `relecteur`). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: variante:souleve-de-terre-roumain-barre-rack | retirer: remplacant:souleve-de-terre-roumain-halteres | retirer |
| Épaule | garder | adapter: charge:legere | retirer |
| Coude | garder | adapter: charge:legere | retirer |
| Poignet | garder | adapter: charge:legere | retirer |
| Genou | garder | adapter: amplitude:sans-gene | retirer |
| Hanche | adapter: amplitude:sans-gene | adapter: amplitude:mi-course | retirer |
| Cheville | garder | adapter: amplitude:sans-gene | retirer |
| Cou | garder | adapter: charge:legere | retirer |
| Cuisse | adapter: charge:legere | adapter: variante:souleve-de-terre-roumain-barre-rack | retirer |
| Aine | garder | adapter: amplitude:sans-gene | retirer |

**Notes**
- general : La barre seule pèse souvent 20 kg (parfois moins) : c'est déjà une charge. Si elle est trop lourde pour garder le geste propre, passe à la version aux haltères (NON SOURCÉ ; question Q12 de docs/QUESTIONS.md).
- general : niveau minimum relevé de débutant à intermédiaire par kine (réponse prudente à la question 3 du lot, Q14 de docs/QUESTIONS.md) ; le débutant passe par le roumain aux haltères.
- dos-n1 : variante barre prise au rack (course courte, pas de reprise au sol, pas de jambes tendues) ; charge qui ne monte pas tant que la gêne persiste.
- dos-n2 : charge sur la colonne : retiré ; remplaçant roumain aux haltères (le générateur choisit un autre exercice si celui-ci est adapté).
- cuisse-n1 : ischios principaux : charge légère.
- cuisse-n2 : barre prise au rack, descente limitée à la hauteur des genoux (sans aller jusqu'à mi-tibia), genoux légèrement pliés.
- hanche-n2 : descente plus courte.
- grossesse : barre chargée et flexion du buste (équilibre, blocage de la respiration) : retiré par prudence, confirmé par kine (NON SOURCÉ) ; remplaçant : roumain aux haltères, charge légère (G4). Post-partum : G7.

**Grossesse** : retirer: remplacant:souleve-de-terre-roumain-halteres
**Version plus douce** : souleve-de-terre-roumain-halteres

**Sécurité pour l'utilisateur seul**
- Départ au rack pour ne pas avoir à soulever la barre dans une mauvaise position ; supports bloqués. Le rack ne te protège pas d'un dos qui s'arrondit.
- Dès que le dos commence à s'arrondir : pose la barre en contrôle (rack ou sol) ; la série est finie.
- Prise : deux paumes vers les cuisses ; prise mixte et crochet non proposés. Chaussures plates, sol non glissant.
- Colliers de serrage posés et serrés des deux côtés avant chaque série, mêmes disques de chaque côté (un disque qui glisse fait basculer la barre).
- Pas d'échec : arrête la série avec au moins 2 répétitions en réserve ; si la barre ralentit nettement ou si la technique se dégrade, la série est finie. En cas de doute sur la charge, prends plus léger. Aucune « dernière répétition de force ».
- Idéalement, quelqu'un dans la maison ou la salle, à portée de voix. Un partenaire peut surveiller, mais il ne remplace pas ta propre vigilance ; il n'y a pas de barres de sécurité pour ce mouvement : en cas de doute, tu reposes la barre au sol, simplement.

**Points d'attention (kine)**
- C'est la charnière de la hanche qui travaille, pas le dos : le dos reste « naturellement droit » (courbures normales), les fesses reculent, la barre glisse contre les cuisses. Une barre qui ne se contrôle plus avec le dos droit est trop lourde.
- Ischios (cuisse) principaux : l'étirement doit rester supportable. La descente s'arrête là où le dos commencerait à s'arrondir (genoux ou mi-tibia), pas au sol.
- Variante jambes presque tendues (échelon 2) : étirement plus grand de l'arrière des cuisses et dos plus sollicité, donc charge plus légère. Réservée à celles et ceux sans aucune gêne à l'arrière des cuisses ni au dos (les cases cuisse n2 et dos n1 la remplacent par la barre prise au rack).
- Niveau : intermédiaire. Chemin conseillé : roumain aux haltères, puis cette fiche depuis le rack, puis la reprise du sol.
- Grossesse et post-partum : retiré.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au bas du dos, à l'arrière de la cuisse ou à la hanche.
- Barre qui part de travers, disque qui glisse ou collier qui bouge : repose la barre (sur le rack ou au sol) avant tout.
- Perte de contrôle de la barre ou impression que tu ne pourras pas finir la répétition : arrête la série, ne force pas.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Tiraillement vif (pas un simple étirement) à l'arrière de la cuisse.
- Voile devant les yeux, vertige ou tête qui tourne en fin de série (souvent un blocage de la respiration) : repose la barre, assieds-toi, ne reprends pas la séance (R5).
- Colliers qui bougent ou disques de travers : repose la barre avant tout.
- Douleur nouvelle ou qui augmente à l'arrière de la cuisse ou au bas du dos : pose la barre en contrôle.

**Objets du quotidien**
- Barre et disques : colliers de serrage (clips) posés et serrés des deux côtés avant chaque série ; mêmes disques de chaque côté ; barre droite (ni tordue, ni jeu dans les manchons) ; disques jamais posés « sans collier » même pour une série légère.
- Rack ou cage à squat : stable (fixé, lesté ou contre un mur), supports de barre réglés à la bonne hauteur et bloqués ; **barres de sécurité (ou goujons) réglées AVANT la première série et testées à vide** : la barre doit pouvoir se poser dessus sans que tu sois écrasé. Pas de rack = pas de cette variante (le tag `rack` est obligatoire).
- Sol plat, sec, non glissant (planches ou tapis de salle fermes) ; chaussures fermées à semelle plate ou rigide ; espace libre autour de la barre, rien derrière toi ; jamais de pieds nus avec une barre chargée.

## Photo
- `Romanian_Deadlift/0.jpg` : affichable : oui (départ du sol (échelon 2), dos plat, barre près des jambes ; vue le 24/10/2026)
- `Romanian_Deadlift/1.jpg` : affichable : oui (départ du sol (échelon 2), dos plat, barre près des jambes ; vue le 24/10/2026)
- `Stiff-Legged_Barbell_Deadlift/0.jpg` : affichable : non (logos de rack floutés (retirée 24/10/2026) ; les photos Romanian_Deadlift restent)
- `Stiff-Legged_Barbell_Deadlift/1.jpg` : affichable : non (logos de rack floutés (retirée 24/10/2026) ; les photos Romanian_Deadlift restent)
- légende : Photos : départ du sol. Au rack (échelon 1), la barre part à hauteur des cuisses.

## Vidéo
- video : youtube:7j-2w4-P14I | Nuffield Health | vérifiée le 2026-10-24

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet de la barre, consignes de départ) : Romanian_Deadlift, Stiff-Legged_Barbell_Deadlift | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db ; fichier dist/exercises.json relu le 2026-10-24 pour vérifier l'existence de l'entrée, son niveau et son matériel ; consignes réécrites par coach | base d'exercices (pratique, pas une étude) | 2026-10-24 | PROVISOIRE |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Colliers de serrage, barres de sécurité du rack réglées et testées, installation seul, objets du quotidien | regles-securite-communes.md §7 et R8 ; pratique de salle, raisonnement mécanique de coach | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul (barre lourde) | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul avec une barre est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Zones de blessures les plus fréquentes chez les haltérophiles et les pratiquants de force athlétique (colonne, épaule, genou) : justifie un tableau complet par zone | Aasa et coll., Br J Sports Med 2017;51(4):211-219, https://pubmed.ncbi.nlm.nih.gov/27707741/ ; revue systématique de 9 études, la plupart de faible qualité ; résumé lu via moteur de recherche | revue systématique, athlètes de compétition, qualité faible ; ne concerne pas les pratiquants de loisir | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 24/10/2026, à contrôler par relecteur) |
| Grossesse et post-partum : barre chargée retirée par prudence (équilibre, apnée, chute de la barre) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas la barre chargée | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, confirmée par kine le 24/10/2026 comme choix prudent, à contrôler par relecteur) |
| Activité des ischios selon l'exercice : le soulevé de terre roumain et le glute-ham raise donnent l'activité la plus élevée parmi quatre exercices comparés (leg curl, good morning, glute-ham raise, roumain) ; le semi-tendineux est nettement plus actif que le biceps fémoral dans les quatre | McAllister et coll., « Muscle activation during various hamstring exercises », J Strength Cond Res 2014;28(6):1573-1580, PMID 24149748, DOI 10.1519/JSC.0000000000000302 ; 12 hommes entraînés en force, une répétition à 85 % de leur maximum sur une répétition (85 % est la charge, pas l'activité) ; EMG de surface ; résumé lu via Europe PMC le 2026-10-24, tableaux non lus | étude de laboratoire (EMG), 12 hommes entraînés ; mesure l'activation seulement, pas la croissance ni la sécurité ; ne permet pas de classer les érecteurs du rachis | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Niveau minimum, barres de sécurité et repli en cas de blocage, colliers, pas d'échec seul, cases par zone et par niveau, grossesse, remplaçants, points d'attention (kine) | Raisonnement de `kine` à partir des règles communes (regles-securite-communes.md) et des études déjà citées dans cette fiche (résumés seulement). Aucune source nouvelle lue pour cette passe ; aucune étude ne teste ces choix exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (choix prudents de kine, à contrôler par relecteur) |
