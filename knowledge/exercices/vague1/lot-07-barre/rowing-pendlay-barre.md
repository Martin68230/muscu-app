---
id: rowing-pendlay-barre
nom: Rowing Pendlay
alias: [Pendlay row]
schema: tirage_h
type: force
niveau_min: avance
muscles_principaux: [grand_dorsal, rhomboides]
muscles_secondaires: [trapezes, deltoides_posterieurs, biceps, erecteurs_rachis, avant_bras]
source_brouillon: []
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| rowing-pendlay-barre-sol | Barre posée au sol à chaque répétition | 1 | avance | barre, disques | Buste parallèle au sol, dos plat, barre posée au sol entre chaque répétition ; disques de grand diamètre. |

## Consignes
1. Pieds sous la barre, genoux légèrement fléchis, penche-toi jusqu'à ce que le buste soit à peu près parallèle au sol, dos plat ; prends la barre un peu plus large que les épaules.
2. Barre posée au sol, bras tendus : gaine le ventre et serre le dos.
3. Tire la barre vite et fort vers le bas de la poitrine, sans bouger le buste.
4. Redescends la barre en contrôle jusqu'au sol et marque une pause : chaque répétition repart du sol.
5. Fin de série : barre posée au sol, redresse-toi.

## Points d'attention
- Mouvement avancé : le buste reste parallèle et immobile, tout le tirage vient du dos.
- Charge en général plus légère que le rowing libre, car la barre repart de l'arrêt à chaque répétition (observation de pratique, NON SOURCÉ) : l'étalonnage fixe la charge réelle.
- Chaque répétition est repartie depuis une position posée : pas de rebond sur le sol.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Buste qui se redresse pour tirer.
- Dos qui s'arrondit en bas.
- Barre qui rebondit sur le sol.
- Charge trop lourde pour le dos.

## Progression / régression
- plus-facile : rowing-barre-penche
- plus-dur : aucun

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE) : exercice avancé, charge légère à modérée : muscle 8 à 12 répétitions (10 à 12 pour un débutant), 2 à 3 séries, 2 à 3 répétitions en réserve, repos 90 s ; force : 8 à 12 répétitions pour les exercices d'appoint. Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. Étalonnage (load-calibration.md) : première séance avec la charge la plus légère disponible, puis montée par petits paliers réels de disques ; double progression. **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24, repris et corrigé par `kine` le 2026-10-24 (à contrôler par `relecteur`). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | retirer: remplacant:rowing-unilateral-haltere | retirer | retirer |
| Épaule | adapter: charge:legere | retirer | retirer |
| Coude | garder | adapter: charge:legere | retirer |
| Poignet | garder | adapter: charge:legere | retirer |
| Genou | garder | garder | retirer |
| Hanche | garder | garder | retirer |
| Cheville | garder | garder | retirer |
| Cou | garder | adapter: charge:legere | retirer |

**Notes**
- general : La barre seule pèse souvent 20 kg (parfois moins) : c'est déjà une charge. Si elle est trop lourde pour garder le geste propre, passe à la version aux haltères (NON SOURCÉ ; question Q12 de docs/QUESTIONS.md).
- general : niveau avancé seulement, gardé avec réserves (question Q18 de docs/QUESTIONS.md) ; redondant avec les autres rowings.
- dos-n1 : dès une gêne légère au bas du dos : retiré (buste parallèle, charge lombaire élevée) ; remplaçant rowing un bras aux haltères avec appui.
- epaule-n2 : retiré.
- genou-n3 : barre chargée avec appui des jambes (pieds au sol, banc ou rack) : la zone est sollicitée, la variante est retirée (aucune variante sans-zone ; règle commune à toutes les fiches du lot, R3).
- cheville-n3 : barre chargée avec appui des jambes (pieds au sol, banc ou rack) : la zone est sollicitée, la variante est retirée (aucune variante sans-zone ; règle commune à toutes les fiches du lot, R3).
- hanche-n3 : la hanche, fléchie sous charge, est retirée au niveau 3.
- grossesse : barre au sol, buste parallèle (pression abdominale) : retiré par prudence, confirmé par kine (NON SOURCÉ) ; remplaçant : rowing un bras aux haltères, avec appui. Post-partum : G7.

**Grossesse** : retirer: remplacant:rowing-unilateral-haltere
**Version plus douce** : rowing-unilateral-haltere

**Sécurité pour l'utilisateur seul**
- La barre se pose au sol à chaque répétition : sol plat, non glissant, chaussures plates à semelle ferme. Pas de barres de sécurité possibles.
- Charge en général plus légère que le rowing libre (NON SOURCÉ) ; arrête dès que le buste se relève ou que le dos s'arrondit.
- Colliers de serrage posés et serrés des deux côtés avant chaque série, mêmes disques de chaque côté (un disque qui glisse fait basculer la barre).
- Pas d'échec : arrête la série avec au moins 2 répétitions en réserve ; si la barre ralentit nettement ou si la technique se dégrade, la série est finie. En cas de doute sur la charge, prends plus léger.
- Idéalement, quelqu'un dans la maison ou la salle, à portée de voix. Un partenaire peut aider, mais il ne remplace jamais les barres de sécurité.

**Points d'attention (kine)**
- Dos : buste parallèle au sol, bas du dos sous charge en position fléchie (Fenwick 2009, résumé, PROVISOIRE ; l'étude n'a pas testé le Pendlay, c'est une extrapolation du rowing penché). Le mouvement est gardé avancé seulement et retiré dès une gêne légère au bas du dos.
- Le buste reste parallèle et immobile : tout le tirage vient du dos. Un buste qui se relève ou une barre qui part de l'élan = charge trop lourde.
- Pose de la barre au sol à chaque répétition, sans rebond, pour repartir de la même position ; ne laisse pas tomber la barre de haut.
- Épaule, coude, poignet : tirage vers le bas du sternum, coudes proches du buste ; gêne : charge légère puis retiré (cases du tableau).
- Niveau : avancé. Chemin conseillé : rowing appuyé, rowing libre, puis cette fiche.
- Grossesse et post-partum : retiré.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au bas du dos, à l'épaule ou au poignet.
- Barre qui part de travers, disque qui glisse ou collier qui bouge : repose la barre (sur le rack ou au sol) avant tout.
- Perte de contrôle de la barre ou impression que tu ne pourras pas finir la répétition : arrête la série, ne force pas.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Voile devant les yeux, vertige ou tête qui tourne en fin de série (souvent un blocage de la respiration) : repose la barre, assieds-toi, ne reprends pas la séance (R5).
- Colliers qui bougent ou disques de travers : repose la barre avant tout.
- Douleur nouvelle au bas du dos : pose la barre au sol, arrête la série.

**Objets du quotidien**
- Barre et disques : colliers de serrage (clips) posés et serrés des deux côtés avant chaque série ; mêmes disques de chaque côté ; barre droite (ni tordue, ni jeu dans les manchons) ; disques jamais posés « sans collier » même pour une série légère.
- Sol plat, sec, non glissant (planches ou tapis de salle fermes) ; chaussures fermées à semelle plate ou rigide ; espace libre autour de la barre, rien derrière toi ; jamais de pieds nus avec une barre chargée.

## Photo
- aucune photo (la base free-exercise-db n'a pas de Pendlay)
- illustration : public/illustrations/rowing-pendlay-barre.svg : affichable : oui (illustration originale de l'app, 24/10/2026 ; Rowing Pendlay, vue de profil : barre au sol, buste parallèle, barre tirée vers le bas de la poitrine)

## Vidéo
- video : youtube:C_p-s66KBpg | The Physio Fix (kiné) | vérifiée le 2026-10-24

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet de la barre, consignes de départ) : Bent_Over_Barbell_Row (niveau « beginner » ; pas de fiche Pendlay dans la base : la photo ne montre pas la pose au sol) | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db ; fichier dist/exercises.json relu le 2026-10-24 pour vérifier l'existence de l'entrée, son niveau et son matériel ; consignes réécrites par coach | base d'exercices (pratique, pas une étude) | 2026-10-24 | PROVISOIRE |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Colliers de serrage, barres de sécurité du rack réglées et testées, installation seul, objets du quotidien | regles-securite-communes.md §7 et R8 ; pratique de salle, raisonnement mécanique de coach | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul (barre lourde) | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul avec une barre est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Zones de blessures les plus fréquentes chez les haltérophiles et les pratiquants de force athlétique (colonne, épaule, genou) : justifie un tableau complet par zone | Aasa et coll., Br J Sports Med 2017;51(4):211-219, https://pubmed.ncbi.nlm.nih.gov/27707741/ ; revue systématique de 9 études, la plupart de faible qualité ; résumé lu via moteur de recherche | revue systématique, athlètes de compétition, qualité faible ; ne concerne pas les pratiquants de loisir | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 24/10/2026, à contrôler par relecteur) |
| Pendlay : charge plus légère que le rowing libre (barre qui repart de l'arrêt) | observation de pratique de coach ; aucune étude lue | avis d'expert | 2026-10-24 | NON SOURCÉ |
| Grossesse et post-partum : barre chargée retirée par prudence (équilibre, apnée, chute de la barre) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas la barre chargée | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, confirmée par kine le 24/10/2026 comme choix prudent, à contrôler par relecteur) |
| Rowing buste penché à la barre : activation large et symétrique du dos, mais charge sur la colonne lombaire et rigidité les plus élevées des trois rowings comparés | Fenwick, Brown, McGill, J Strength Cond Res 2009;23(2):350-358, https://pubmed.ncbi.nlm.nih.gov/19197209/ ; résumé lu via moteur de recherche | étude de laboratoire, 7 hommes sains ; petit échantillon ; le rowing Pendlay n'a pas été testé : application = extrapolation de coach | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Rowing Pendlay : technique, buste parallèle, barre posée au sol à chaque répétition | pratique courante de force athlétique, pas de source lue | - | 2026-10-24 | NON SOURCÉ |
| Niveau minimum, barres de sécurité et repli en cas de blocage, colliers, pas d'échec seul, cases par zone et par niveau, grossesse, remplaçants, points d'attention (kine) | Raisonnement de `kine` à partir des règles communes (regles-securite-communes.md) et des études déjà citées dans cette fiche (résumés seulement). Aucune source nouvelle lue pour cette passe ; aucune étude ne teste ces choix exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (choix prudents de kine, à contrôler par relecteur) |
