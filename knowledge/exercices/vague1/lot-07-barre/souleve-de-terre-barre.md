---
id: souleve-de-terre-barre
nom: Soulevé de terre à la barre
alias: [deadlift, soulevé de terre conventionnel]
schema: charniere
type: force
niveau_min: intermediaire
muscles_principaux: [fessiers, ischios, erecteurs_rachis]
muscles_secondaires: [quadriceps, grand_dorsal, trapezes, avant_bras, adducteurs]
source_brouillon: []
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| souleve-de-terre-barre-rack | Depuis le rack, barre à hauteur du genou | 1 | intermediaire | barre, disques, rack | Barre posée sur les supports du rack à hauteur du genou (ou juste sous le genou) : trajet court, charge légère au début. |
| souleve-de-terre-barre-sol | Depuis le sol | 2 | intermediaire | barre, disques | Barre au sol, disques de grand diamètre pour que la barre parte à la bonne hauteur (environ au milieu du mollet). |

## Consignes
1. Place-toi devant la barre, pieds à la largeur du bassin, barre au-dessus du milieu du pied ; descends attraper la barre à la largeur des épaules, bras tendus.
2. Avant de tirer : poitrine ouverte, dos plat, épaules au-dessus de la barre ou un peu devant ; tends le corps en « enlevant le jeu » de la barre sans la bouger.
3. Pousse le sol avec les pieds et monte la barre en la gardant collée aux jambes ; hanches et épaules montent ensemble.
4. En haut, tiens-toi droit (hanches et genoux tendus, sans cambrer ni te pencher en arrière) ; ne hausse pas les épaules.
5. Redescends en reculant les hanches puis en pliant les genoux, la barre collée aux jambes ; repose la barre au sol de façon contrôlée, sans la lâcher de haut.

## Points d'attention
- Commence depuis le rack (course courte) ; passe au sol seulement quand la charge est facile et le dos reste plat.
- Le dos reste « naturellement droit » : s'il s'arrondit nettement, la charge est trop lourde.
- Repose la barre à chaque répétition (pas de rebond rapide sur le sol) pour garder la même position de départ.
- Le soulevé de terre n'est jamais fait « jusqu'à l'échec » : la dernière répétition doit encore être propre.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Dos qui s'arrondit en tirant ou en reposant la barre.
- Barre loin des jambes (elle part vers l'avant).
- Tirer avec les bras au lieu de pousser le sol.
- Se pencher en arrière en haut.
- Lâcher la barre de haut ou la laisser rebondir.

## Progression / régression
- plus-facile : souleve-de-terre-roumain-barre, souleve-de-terre-roumain-halteres
- plus-dur : souleve-de-terre-sumo-barre

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE ; ACSM 2026, SRC1 : force = charges lourdes, 2 à 3 séries par exercice, exercice prioritaire en début de séance) : force intermédiaire et avancé 4 à 6 répétitions, 3 séries, 2 répétitions en réserve, repos 180 s ; force débutant 6 à 10 répétitions, 2 séries, 3 en réserve, repos 120 s ; muscle 8 à 12 répétitions (10 à 12 pour un débutant), 2 à 3 en réserve, repos 90 à 120 s. Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. Étalonnage (load-calibration.md) : première séance avec la barre seule (ou la charge la plus légère du profil), puis on ajoute les disques par petits paliers réels ; après chaque série, une question : « combien de répétitions te restait-il ? » ; double progression (on monte les répétitions, puis la charge). **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : jamais 0 répétition en réserve, jamais de série menée jusqu'à l'échec ; si la vitesse de la barre chute nettement ou si la technique se dégrade, la série est finie.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24, repris et corrigé par `kine` le 2026-10-24 (à contrôler par `relecteur`). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: variante:souleve-de-terre-barre-rack | retirer: remplacant:souleve-de-terre-roumain-halteres | retirer |
| Épaule | garder | adapter: charge:legere | retirer |
| Coude | garder | adapter: charge:legere | retirer |
| Poignet | garder | adapter: charge:legere | retirer |
| Genou | garder | adapter: amplitude:sans-gene | retirer |
| Hanche | adapter: amplitude:sans-gene | adapter: amplitude:mi-course | retirer |
| Cheville | garder | adapter: amplitude:sans-gene | retirer |
| Cou | garder | adapter: charge:legere | retirer |
| Cuisse | adapter: charge:legere | adapter: amplitude:mi-course | retirer |
| Aine | garder | adapter: amplitude:sans-gene | retirer |

**Notes**
- general : La barre seule pèse souvent 20 kg (parfois moins) : c'est déjà une charge. Si elle est trop lourde pour garder le geste propre, passe à la version aux haltères (NON SOURCÉ ; question Q12 de docs/QUESTIONS.md).
- general : niveau minimum relevé de débutant à intermédiaire par kine (réponse prudente à la question 3 du lot, Q14 de docs/QUESTIONS.md) ; le débutant passe par le soulevé de terre roumain aux haltères.
- dos-n1 : départ depuis le rack (course courte, pas de reprise au sol) ; la charge ne monte pas tant que la gêne persiste.
- dos-n2 : charge de la barre sur la colonne : retiré ; remplaçant soulevé de terre roumain aux haltères, charge légère (lui-même adapté par le profil dos : le générateur choisit alors un autre exercice du schéma charnière).
- cuisse-n1 : ischios principaux : charge légère.
- cuisse-n2 : amplitude réduite : barre depuis le rack à hauteur du genou.
- hanche-n1 : descente et prise de barre sans gêne.
- poignet-n1 : prise avec les doigts, deux paumes vers les cuisses ; sangles, crochet et prise mixte non proposés (aucune valeur sourcée).
- cou-n1 : regard vers le sol à quelques mètres, nuque dans le prolongement du dos.
- grossesse : barre lourde au sol (pression abdominale, blocage de la respiration, flexion du buste) : retiré par prudence, confirmé par kine (NON SOURCÉ) ; remplaçant : soulevé de terre roumain aux haltères, charge légère (adapté par G4). Post-partum : G7.

**Grossesse** : retirer: remplacant:souleve-de-terre-roumain-halteres
**Version plus douce** : souleve-de-terre-roumain-halteres

**Sécurité pour l'utilisateur seul**
- Pas de barres de sécurité possibles au sol : la sécurité, c'est une charge que tu peux toujours reposer en contrôle, et l'arrêt bien avant de ne plus pouvoir.
- Depuis le rack (variante 1) : supports réglés à hauteur du genou (ou juste sous), bloqués, vérifiés ; la barre ne glisse pas. Le rack ne sert ici qu'à raccourcir la course : il ne te protège pas d'un dos qui s'arrondit.
- Prise : deux paumes vers les cuisses ; prise mixte et crochet non proposés. Si la barre glisse des doigts avant que tes jambes et ton dos aient fini, la charge est trop lourde pour cette variante.
- Chaussures plates à semelle ferme (pas de semelle molle de running), sol non glissant, barre près des tibias.
- Colliers de serrage posés et serrés des deux côtés avant chaque série, mêmes disques de chaque côté (un disque qui glisse fait basculer la barre).
- Pas d'échec : arrête la série avec au moins 2 répétitions en réserve ; si la barre ralentit nettement ou si la technique se dégrade, la série est finie. En cas de doute sur la charge, prends plus léger. Aucune « dernière répétition de force ».
- Idéalement, quelqu'un dans la maison ou la salle, à portée de voix. Un partenaire peut surveiller, mais il ne remplace pas ta propre vigilance ; il n'y a pas de barres de sécurité pour ce mouvement : en cas de doute, tu reposes la barre au sol, simplement.

**Points d'attention (kine)**
- Dos : charge élevée sur la colonne. Le dos reste « naturellement droit » (courbures normales) pendant tout le mouvement ; s'il s'arrondit nettement, pose la barre : la charge est trop lourde pour aujourd'hui. Dès une gêne légère au bas du dos : départ depuis le rack seulement ; gêne nette ou douleur : retiré (cases dos).
- Barre collée aux jambes, pas de saccade pour décoller. Repose la barre à chaque répétition (pas de rebond) pour repartir de la même position.
- Ischios (cuisse) principaux : une douleur à l'arrière de la cuisse qui apparaît à la remontée ou à la descente = arrêt.
- Poignet et avant-bras : prise sans douleur ; on ne compense pas avec des sangles. Cou : regard 2 à 3 mètres devant, jamais la tête relevée.
- Niveau : intermédiaire (choix prudent de kine). Chemin conseillé : soulevé de terre roumain aux haltères, puis roumain à la barre depuis le rack, puis ce mouvement depuis le rack, puis le sol.
- Grossesse et post-partum : retiré (pression abdominale, blocage de la respiration, flexion du buste sous charge).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au bas du dos, à la hanche, à l'arrière de la cuisse ou au genou.
- Barre qui part de travers, disque qui glisse ou collier qui bouge : repose la barre (sur le rack ou au sol) avant tout.
- Perte de contrôle de la barre ou impression que tu ne pourras pas finir la répétition : arrête la série, ne force pas.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Douleur vive en bas du dos pendant la montée ou la descente : repose la barre et arrête.
- Crampe à l'arrière de la cuisse.
- Voile devant les yeux, vertige ou tête qui tourne en fin de série (souvent un blocage de la respiration) : repose la barre, assieds-toi, ne reprends pas la séance (R5).
- Colliers qui bougent ou disques de travers : repose la barre avant tout.
- Douleur nouvelle ou qui augmente à l'arrière de la cuisse, au bas du dos ou à l'aine pendant la remontée : pose la barre en contrôle.

**Objets du quotidien**
- Barre et disques : colliers de serrage (clips) posés et serrés des deux côtés avant chaque série ; mêmes disques de chaque côté ; barre droite (ni tordue, ni jeu dans les manchons) ; disques jamais posés « sans collier » même pour une série légère.
- Rack ou cage à squat : stable (fixé, lesté ou contre un mur), supports de barre réglés à la bonne hauteur et bloqués ; **barres de sécurité (ou goujons) réglées AVANT la première série et testées à vide** : la barre doit pouvoir se poser dessus sans que tu sois écrasé. Pas de rack = pas de cette variante (le tag `rack` est obligatoire).
- Sol plat, sec, non glissant (planches ou tapis de salle fermes) ; chaussures fermées à semelle plate ou rigide ; espace libre autour de la barre, rien derrière toi ; jamais de pieds nus avec une barre chargée.
- Disques « bumper » ou de grand diamètre pour la variante au sol : sinon rehausse la barre sur des cales stables, jamais sur des objets instables.

## Photo
- `Barbell_Deadlift/0.jpg` : affichable : oui (départ du sol (échelon 2), dos plat, barre contre les jambes ; zone floutée sur un logo de rack ; vue le 24/10/2026)
- `Barbell_Deadlift/1.jpg` : affichable : oui (départ du sol (échelon 2), dos plat, barre contre les jambes ; zone floutée sur un logo de rack ; vue le 24/10/2026)
- `Rack_Pulls/0.jpg` : affichable : non (logo « Hammer Strength » lisible sur le rack, barre vue par le bout, hauteur de départ pas vérifiable)
- `Rack_Pulls/1.jpg` : affichable : non (logo « Hammer Strength » lisible sur le rack, barre vue par le bout, hauteur de départ pas vérifiable)
- légende : Photo : départ du sol (échelon 2). Au rack, la barre part à hauteur du genou.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet de la barre, consignes de départ) : Barbell_Deadlift, Rack_Pulls | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db ; fichier dist/exercises.json relu le 2026-10-24 pour vérifier l'existence de l'entrée, son niveau et son matériel ; consignes réécrites par coach | base d'exercices (pratique, pas une étude) | 2026-10-24 | PROVISOIRE |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Colliers de serrage, barres de sécurité du rack réglées et testées, installation seul, objets du quotidien | regles-securite-communes.md §7 et R8 ; pratique de salle, raisonnement mécanique de coach | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul (barre lourde) | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul avec une barre est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Zones de blessures les plus fréquentes chez les haltérophiles et les pratiquants de force athlétique (colonne, épaule, genou) : justifie un tableau complet par zone | Aasa et coll., Br J Sports Med 2017;51(4):211-219, https://pubmed.ncbi.nlm.nih.gov/27707741/ ; revue systématique de 9 études, la plupart de faible qualité ; résumé lu via moteur de recherche | revue systématique, athlètes de compétition, qualité faible ; ne concerne pas les pratiquants de loisir | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 24/10/2026, à contrôler par relecteur) |
| Grossesse et post-partum : barre chargée retirée par prudence (équilibre, apnée, chute de la barre) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas la barre chargée | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, confirmée par kine le 24/10/2026 comme choix prudent, à contrôler par relecteur) |
| Soulevé de terre sumo : pieds plus écartés et tournés vers l'extérieur, buste et cuisses plus verticaux, prise plus étroite, 25 à 40 % de travail mécanique en moins qu'en conventionnel (24 hommes en compétition) | Escamilla et coll., Med Sci Sports Exerc 2000;32(7):1265-1275, https://pubmed.ncbi.nlm.nih.gov/10912892/ ; résumé lu via moteur de recherche, texte complet non lu | étude biomécanique par vidéo, 12 sumo et 12 conventionnels en championnat national de force athlétique ; ne dit pas lequel est le plus sûr | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Dos et soulevé de terre : rester actif, adapter plutôt que tout arrêter en cas de gêne légère | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://www.has-sante.fr/jcms/c_2961499/fr/prise-en-charge-du-patient-presentant-une-lombalgie-commune ; NICE NG59 https://www.nice.org.uk/guidance/ng59 | recommandations officielles, adultes avec lombalgie commune ; extrapolation | 2026-10-24 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
| Niveau minimum, barres de sécurité et repli en cas de blocage, colliers, pas d'échec seul, cases par zone et par niveau, grossesse, remplaçants, points d'attention (kine) | Raisonnement de `kine` à partir des règles communes (regles-securite-communes.md) et des études déjà citées dans cette fiche (résumés seulement). Aucune source nouvelle lue pour cette passe ; aucune étude ne teste ces choix exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (choix prudents de kine, à contrôler par relecteur) |
