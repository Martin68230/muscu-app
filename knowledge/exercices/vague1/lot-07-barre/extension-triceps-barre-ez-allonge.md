---
id: extension-triceps-barre-ez-allonge
nom: Extension triceps allongé à la barre EZ
alias: [skull crusher, barre au front, crâne]
schema: poussee_h
type: force
niveau_min: intermediaire
muscles_principaux: [triceps]
muscles_secondaires: []
source_brouillon: []
couverture: substitut
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| extension-triceps-barre-ez-sol | Allongé au sol | 1 | intermediaire | barre_ez, disques | Allongé sur le dos au sol, genoux fléchis, barre EZ tenue à bras tendus au-dessus de la poitrine, paumes vers l'avant ou neutres. |
| extension-triceps-barre-ez-banc | Allongé sur un banc | 2 | intermediaire | barre_ez, disques, banc | Allongé sur un banc plat, barre EZ à bras tendus au-dessus de la poitrine ; la barre descend vers derrière la tête (au-dessus du banc) pour plus d'étirement. |

## Consignes
1. Allonge-toi (au sol ou sur un banc), barre EZ tenue à bras tendus au-dessus de la poitrine, mains un peu plus étroites que les épaules.
2. Les coudes pointent vers le plafond et ne bougent presque pas ; plie-les pour descendre la barre vers le front (au sol) ou légèrement derrière la tête (banc).
3. Descends lentement jusqu'à sentir l'étirement du triceps, sans gêne au coude.
4. Tends les bras pour remonter la barre au-dessus de la poitrine.
5. Fin de série : replie les bras, pose la barre sur les cuisses puis assieds-toi (ne la lâche jamais au-dessus du visage).

## Points d'attention
- Charge légère à modérée : la barre passe près du visage et de la tête.
- Les coudes restent fixes, ils ne s'écartent pas.
- Au sol, la course est plus courte ; au banc, l'étirement est plus grand.
- Pas de partenaire : si tu manques de force, la barre est posée sur le torse, jamais lâchée au-dessus du visage.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Coudes qui s'écartent ou partent vers l'avant.
- Barre trop lourde qui oblige à tricher.
- Poignets cassés.
- Lâcher la barre au-dessus du visage.

## Progression / régression
- plus-facile : extension-triceps-couche-halteres, extension-triceps-assis-halteres
- plus-dur : aucun

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE) : exercice « autre » (non pilier) : muscle 8 à 12 répétitions (10 à 12 pour un débutant), 2 à 3 séries, 2 à 3 répétitions en réserve, repos 90 s ; force : 8 à 12 répétitions pour les exercices d'appoint. Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. Étalonnage (load-calibration.md) : première séance avec la charge la plus légère disponible, puis montée par petits paliers réels de disques ; double progression. **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24, repris et corrigé par `kine` le 2026-10-24 (à contrôler par `relecteur`). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | garder | adapter: charge:legere | retirer |
| Épaule | adapter: variante:extension-triceps-barre-ez-sol | retirer | retirer |
| Coude | adapter: charge:legere | retirer | retirer |
| Poignet | garder | adapter: charge:legere | retirer |
| Genou | garder | garder | retirer: sans-zone:extension-triceps-barre-ez-sol |
| Hanche | garder | garder | retirer: sans-zone:extension-triceps-barre-ez-sol |
| Cheville | garder | garder | retirer: sans-zone:extension-triceps-barre-ez-sol |
| Cou | garder | adapter: charge:legere | retirer |

**Notes**
- general : la barre EZ seule est plus légère qu'une barre droite ; sa charge reste à vérifier sur la barre dont tu disposes (Q12 de docs/QUESTIONS.md).
- coude-n1 : charge légère ; descente lente.
- coude-n2 : les coudes portent toute la charge : retiré.
- epaule-n1 : variante au sol : étirement réduit.
- epaule-n2 : retiré.
- cou-n1 : tête appuyée au sol ou sur le banc.
- genou-n3 : allongé, jambes sans effort : la variante au sol reste permise.
- hanche-n3 : allongé, jambes sans effort : la variante au sol reste permise.
- cheville-n3 : allongé, jambes sans effort : la variante au sol reste permise.
- grossesse : couché sur le dos avec une barre près du visage : retiré (G4) ; remplaçant : extension triceps assis aux haltères, charge légère. Post-partum : G7.

**Grossesse** : retirer: remplacant:extension-triceps-assis-halteres
**Version plus douce** : extension-triceps-assis-halteres

**Sécurité pour l'utilisateur seul**
- La barre passe près du visage et de la tête (R9 appliqué à la barre) : charge légère, toujours une charge que tu peux ramener sur la poitrine puis poser sur les cuisses, assis. Choisis plus léger, pas plus lourd.
- Jamais d'échec, jamais de répétition « de force » : le moment critique est la barre près du visage. Arrête au moins 3 répétitions avant de ne plus pouvoir (NON SOURCÉ).
- Sur banc (échelon 2) : la barre descend derrière la tête, au-dessus du banc, jamais vers le visage ni la gorge ; banc calé et stable.
- Colliers de serrage posés et serrés des deux côtés avant chaque série, mêmes disques de chaque côté (un disque qui glisse fait basculer la barre). Barre EZ : serrage soigné.
- Pas de rack avec barres de sécurité exigé ici (pas de tag rack) : c'est pourquoi la charge reste très modérée et la fiche intermédiaire.
- Idéalement, quelqu'un dans la maison ou la salle, à portée de voix. Un partenaire peut aider, mais il ne remplace jamais les barres de sécurité.

**Points d'attention (kine)**
- Coude (triceps principal) : les coudes portent la charge, c'est la zone à surveiller en premier. Coudes fixes, qui ne s'écartent pas ; descente lente. Gêne légère : charge légère ; gêne nette : retiré.
- Barre près du visage : la barre descend vers le haut du front ou derrière la tête, jamais vers le nez, la gorge ou le cou. En cas de manque de force : ramène la barre sur la poitrine en pliant le coude, ne la lâche jamais au-dessus du visage.
- Épaule et poignet : au sol, la course est plus courte (version à privilégier si l'épaule tire) ; barre EZ pour ménager le poignet.
- Cou : tête appuyée sur le sol ou le banc.
- Niveau : intermédiaire (charge près du visage, sans barres de sécurité). Chemin conseillé : extension triceps aux haltères, puis cette fiche.
- Grossesse : retiré (couché sur le dos, barre près du visage).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au coude, à l'épaule ou au poignet.
- Barre qui part de travers, disque qui glisse ou collier qui bouge : repose la barre (sur le rack ou au sol) avant tout.
- Perte de contrôle de la barre ou impression que tu ne pourras pas finir la répétition : arrête la série, ne force pas.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Barre qui t'approche du visage plus vite que prévu.
- Voile devant les yeux, vertige ou tête qui tourne en fin de série (souvent un blocage de la respiration) : repose la barre, assieds-toi, ne reprends pas la séance (R5).
- Colliers qui bougent ou disques de travers : repose la barre avant tout.
- Douleur au coude qui augmente en fin de série ou dès la première répétition : arrête.
- Barre qui descend trop près du visage ou que tu ne contrôles plus : ramène-la sur la poitrine, assieds-toi.

**Objets du quotidien**
- Barre et disques : colliers de serrage (clips) posés et serrés des deux côtés avant chaque série ; mêmes disques de chaque côté ; barre EZ (ni tordue, ni jeu dans les manchons) ; disques jamais posés « sans collier » même pour une série légère.
- Banc : 4 appuis au sol, qui ne bascule pas et ne glisse pas (sol non glissant, banc calé si besoin), vis, pieds et réglage en bon état ; avant la première série, appuie-toi dessus comme pendant l'exercice : s'il bouge, grince ou se plie, ne l'utilise pas. Un canapé, un lit ou une caisse ne remplacent pas un banc.
- Sol plat, sec, non glissant (planches ou tapis de salle fermes) ; chaussures fermées à semelle plate ou rigide ; espace libre autour de la barre, rien derrière toi ; jamais de pieds nus avec une barre chargée.

## Photo
- `EZ-Bar_Skullcrusher/0.jpg` : affichable : à vérifier (candidat free-exercise-db non vu ; WebP à créer par dev ; vérifier : barre vers le front, coudes fixes ; sinon `non`)
- `EZ-Bar_Skullcrusher/1.jpg` : affichable : à vérifier (candidat free-exercise-db non vu ; WebP à créer par dev ; idem)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet de la barre, consignes de départ) : EZ-Bar_Skullcrusher (niveau « beginner » dans la base ; coach le met en intermédiaire : choix prudent NON SOURCÉ) | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db ; fichier dist/exercises.json relu le 2026-10-24 pour vérifier l'existence de l'entrée, son niveau et son matériel ; consignes réécrites par coach | base d'exercices (pratique, pas une étude) | 2026-10-24 | PROVISOIRE |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Colliers de serrage, barres de sécurité du rack réglées et testées, installation seul, objets du quotidien | regles-securite-communes.md §7 et R8 ; pratique de salle, raisonnement mécanique de coach | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul (barre lourde) | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul avec une barre est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Zones de blessures les plus fréquentes chez les haltérophiles et les pratiquants de force athlétique (colonne, épaule, genou) : justifie un tableau complet par zone | Aasa et coll., Br J Sports Med 2017;51(4):211-219, https://pubmed.ncbi.nlm.nih.gov/27707741/ ; revue systématique de 9 études, la plupart de faible qualité ; résumé lu via moteur de recherche | revue systématique, athlètes de compétition, qualité faible ; ne concerne pas les pratiquants de loisir | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 24/10/2026, à contrôler par relecteur) |
| Grossesse et post-partum : barre chargée retirée par prudence (équilibre, apnée, chute de la barre) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas la barre chargée | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, confirmée par kine le 24/10/2026 comme choix prudent, à contrôler par relecteur) |
| Étirer la longue portion du triceps (bras au-dessus de la tête) fait davantage grossir le triceps qu'une extension bras le long du corps | Maeo et coll., Eur J Sport Sci 2023;23(7):1240-1250, https://pubmed.ncbi.nlm.nih.gov/35819335/ ; résumé lu via moteur de recherche, texte complet non lu | essai de 12 semaines, 21 adultes, à la poulie ; ne porte pas sur cet exercice précis | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Niveau minimum, barres de sécurité et repli en cas de blocage, colliers, pas d'échec seul, cases par zone et par niveau, grossesse, remplaçants, points d'attention (kine) | Raisonnement de `kine` à partir des règles communes (regles-securite-communes.md) et des études déjà citées dans cette fiche (résumés seulement). Aucune source nouvelle lue pour cette passe ; aucune étude ne teste ces choix exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (choix prudents de kine, à contrôler par relecteur) |
