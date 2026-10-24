---
id: squat-arriere-barre
nom: Squat arrière à la barre
alias: [back squat, squat barre haute]
schema: squat
type: force
niveau_min: intermediaire
muscles_principaux: [quadriceps, fessiers]
muscles_secondaires: [adducteurs, ischios, erecteurs_rachis, abdominaux]
source_brouillon: []
statut: brouillon_coach
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| squat-arriere-barre-confort | Descente jusqu'à la parallèle | 1 | intermediaire | barre, disques, rack | Barre sur le haut du dos dans un rack, barres de sécurité réglées juste sous ta position la plus basse. Tu descends jusqu'à ce que les cuisses soient parallèles au sol (ou au-dessus si c'est ce que tu contrôles). |
| squat-arriere-barre-complet | Descente profonde sans gêne | 2 | intermediaire | barre, disques, rack | Même installation, barres de sécurité abaissées au besoin ; tu descends plus bas que la parallèle seulement si le dos reste plat et si rien ne gêne. |
| squat-arriere-barre-pause | Avec un temps d'arrêt en bas | 3 | avance | barre, disques, rack | Même installation ; tu marques un arrêt contrôlé en bas avant de remonter, avec une charge nettement plus légère. |

## Consignes
1. Règle les supports du rack à hauteur du haut de ta poitrine et les barres de sécurité juste sous le point le plus bas de ta descente ; teste-les barre seule.
2. Place-toi sous la barre, pose-la sur le haut du dos (sur les muscles, pas sur la nuque), mains larges, omoplates serrées, coudes sous la barre ; redresse-toi pour la sortir du rack et recule d'un ou deux pas.
3. Pieds à la largeur des épaules ou un peu plus, pointes légèrement ouvertes. Inspire, gaine le ventre et descends en poussant les genoux dans l'axe des pieds, buste droit.
4. Descends jusqu'à la profondeur que tu contrôles sans gêne, puis remonte en poussant dans tout le pied, sans laisser le bassin partir avant les épaules.
5. Fin de série : avance vers le rack et repose la barre sur les supports (jamais en la lâchant, jamais en te penchant en avant).

## Points d'attention
- Les barres de sécurité sont ton filet : sans elles, pas de squat chargé seul. Si tu es bloqué en bas, laisse la barre se poser dessus en t'accroupissant, puis dégage-toi en avançant.
- Regard légèrement vers l'avant, pas vers le plafond ; dos naturellement droit sur toute la descente.
- Les genoux suivent la direction des pieds ; ils ne rentrent pas vers l'intérieur.
- Commence par la barre seule, puis monte par petits paliers ; la technique d'abord, la charge ensuite.
- Avant ce squat, il vaut mieux maîtriser le squat gobelet et le squat avec repère de profondeur à la barre (fiche squat-barre-repere-banc).
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Barre posée sur la nuque (sur les vertèbres) au lieu des muscles du haut du dos.
- Talons qui décollent ou genoux qui rentrent.
- Dos qui s'arrondit en bas de la descente (charge trop lourde ou profondeur trop grande).
- Remonter avec les fesses d'abord et le buste qui penche (« good morning » involontaire).
- Sortir du rack avec les barres de sécurité mal réglées ou sans collier.

## Progression / régression
- plus-facile : squat-barre-repere-banc, squat-gobelet
- plus-dur : squat-arriere-barre-pause, squat-avant-barre

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE ; ACSM 2026, SRC1 : force = charges lourdes, 2 à 3 séries par exercice, exercice prioritaire en début de séance) : force intermédiaire et avancé 4 à 6 répétitions, 3 séries, 2 répétitions en réserve, repos 180 s ; force débutant 6 à 10 répétitions, 2 séries, 3 en réserve, repos 120 s ; muscle 8 à 12 répétitions (10 à 12 pour un débutant), 2 à 3 en réserve, repos 90 à 120 s. Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. Étalonnage (load-calibration.md) : première séance avec la barre seule (ou la charge la plus légère du profil), puis on ajoute les disques par petits paliers réels ; après chaque série, une question : « combien de répétitions te restait-il ? » ; double progression (on monte les répétitions, puis la charge). **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : jamais 0 répétition en réserve, jamais de série menée jusqu'à l'échec ; si la vitesse de la barre chute nettement ou si la technique se dégrade, la série est finie.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24 (proposition prudente, **à compléter et corriger par `kine`**). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: charge:legere | retirer: remplacant:squat-gobelet | retirer |
| Épaule | adapter: charge:legere | retirer: remplacant:squat-gobelet | retirer |
| Coude | garder | adapter: charge:legere | retirer |
| Poignet | garder | adapter: charge:legere | retirer |
| Genou | adapter: amplitude:sans-gene | adapter: amplitude:mi-course | retirer |
| Hanche | adapter: amplitude:sans-gene | adapter: amplitude:mi-course | retirer |
| Cheville | garder | adapter: amplitude:sans-gene | retirer |
| Cou | garder | adapter: charge:legere | retirer |
| Cuisse | garder | adapter: amplitude:sans-gene | retirer |
| Aine | garder | adapter: amplitude:sans-gene | retirer |

**Notes**
- dos-n1 : charge légère ; pas d'augmentation si la gêne persiste ; barre sur les muscles, jamais sur la nuque.
- dos-n2 : la barre sur le dos charge la colonne : retiré ; remplaçant squat gobelet (charge devant le corps). Le générateur le propose seulement s'il n'est pas lui-même adapté par le profil.
- epaule-n1 : prise plus large, mains qui s'adaptent à ta souplesse ; barre plus légère.
- epaule-n2 : la position des bras derrière la barre peut aggraver la gêne : retiré.
- poignet-n1 : poignets droits, la barre repose sur le dos, pas sur les mains ; mains plus larges.
- genou-n1 : descends moins bas, sans gêne.
- genou-n2 : demi-descente, charge non augmentée (R2).
- cheville-n2 : talons légèrement surélevés non proposés par l'app (aucune valeur sourcée) : amplitude sans gêne.
- cou-n1 : barre sur les muscles du haut du dos, pas sur la nuque ; en cas de gêne, charge légère.
- cuisse-n2 : ischios secondaires : descente sans gêne (choix prudent NON SOURCÉ).
- aine-n2 : adducteurs secondaires : pieds moins écartés, descente sans gêne.
- grossesse : barre chargée sur le dos (équilibre, apnée, chute de la barre) : retiré par prudence (NON SOURCÉ ; la HAS ne se prononce pas sur la barre) ; remplaçant : squat gobelet, charge légère. Post-partum : G7.

**Grossesse** : retirer: remplacant:squat-gobelet
**Version plus douce** : squat-barre-repere-banc

**Sécurité pour l'utilisateur seul**
- Rack avec barres de sécurité réglées sous ta profondeur maximale et testées à vide ; si tu n'as pas de rack à barres de sécurité, ne fais pas cette variante.
- Colliers de serrage des deux côtés avant chaque série.
- Pas d'échec : arrête la série avec au moins 2 répétitions en réserve ; si la barre ralentit nettement, repose-la.
- Jamais de squat chargé avec des chaussures glissantes ni sur un sol glissant.

**Points d'attention (kine)**
- À rédiger et corriger par `kine` (étape suivante du cycle). Points de départ proposés par coach : voir « Sécurité pour l'utilisateur seul » ci-dessus et les notes par zone.
- Barre sur le haut du dos : épaule et poignet (position des bras) et cou (contact de la barre) à relire en priorité.
- Profondeur : l'app ne fixe pas de profondeur chiffrée ; le « sans gêne » dépend de la personne.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au bas du dos, à l'épaule, au genou, à la hanche ou à la cheville.
- Barre qui part de travers, disque qui glisse ou collier qui bouge : repose la barre (sur le rack ou au sol) avant tout.
- Perte de contrôle de la barre ou impression que tu ne pourras pas finir la répétition : arrête la série, ne force pas.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Barre qui glisse sur le dos ou douleur à l'endroit où elle appuie sur le haut du dos ou la nuque.

**Objets du quotidien**
- - Barre et disques : colliers de serrage (clips) posés et serrés des deux côtés avant chaque série ; mêmes disques de chaque côté ; barre droite (ni tordue, ni jeu dans les manchons) ; disques jamais posés « sans collier » même pour une série légère.
- - Rack ou cage à squat : stable (fixé, lesté ou contre un mur), supports de barre réglés à la bonne hauteur et bloqués ; **barres de sécurité (ou goujons) réglées AVANT la première série et testées à vide** : la barre doit pouvoir se poser dessus sans que tu sois écrasé. Pas de rack = pas de cette variante (le tag `rack` est obligatoire).
- - Sol plat, sec, non glissant (planches ou tapis de salle fermes) ; chaussures fermées à semelle plate ou rigide ; espace libre autour de la barre, rien derrière toi ; jamais de pieds nus avec une barre chargée.

## Photo
- `Barbell_Squat/0.jpg` : affichable : à vérifier (candidat free-exercise-db non vu ; WebP à créer par dev ; vérifier barre sur le haut du dos, profondeur, logo d'arrière-plan à recadrer)
- `Barbell_Squat/1.jpg` : affichable : à vérifier (candidat free-exercise-db non vu ; WebP à créer par dev ; idem)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet de la barre, consignes de départ) : Barbell_Squat, Barbell_Full_Squat | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db ; fichier dist/exercises.json relu le 2026-10-24 pour vérifier l'existence de l'entrée, son niveau et son matériel ; consignes réécrites par coach | base d'exercices (pratique, pas une étude) | 2026-10-24 | PROVISOIRE |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Colliers de serrage, barres de sécurité du rack réglées et testées, installation seul, objets du quotidien | regles-securite-communes.md §7 et R8 ; pratique de salle, raisonnement mécanique de coach | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul (barre lourde) | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul avec une barre est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Zones de blessures les plus fréquentes chez les haltérophiles et les pratiquants de force athlétique (colonne, épaule, genou) : justifie un tableau complet par zone | Aasa et coll., Br J Sports Med 2017;51(4):211-219, https://pubmed.ncbi.nlm.nih.gov/27707741/ ; revue systématique de 9 études, la plupart de faible qualité ; résumé lu via moteur de recherche | revue systématique, athlètes de compétition, qualité faible ; ne concerne pas les pratiquants de loisir | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (à compléter par kine puis contrôler par relecteur) |
| Grossesse et post-partum : barre chargée retirée par prudence (équilibre, apnée, chute de la barre) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas la barre chargée | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, à valider par kine) |
| Descendre profond (cuisses au moins parallèles) fait davantage grossir le devant de la cuisse et améliore le saut qu'une demi-descente (17 hommes, 12 semaines, squat lourd 0-120 contre 0-60 degrés) | Bloomquist et coll., Eur J Appl Physiol 2013;113(8):2133-2142, DOI 10.1007/s00421-013-2642-7 ; résumé lu via moteur de recherche, texte complet non lu | essai randomisé, 17 hommes jeunes, squat à la barre ; ne porte ni sur des débutants, ni sur des femmes | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Amplitude complète conseillée pour le bas du corps (hypertrophie) | Schoenfeld et Grgic, SAGE Open Med 2020;8, https://pmc.ncbi.nlm.nih.gov/articles/PMC6977096 ; revue systématique de 6 études (4 sur le bas du corps) ; résumé lu via moteur de recherche | revue systématique, petit nombre d'études, une seule chez des pratiquants entraînés | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Une descente profonde n'est pas démontrée dangereuse pour un genou sain ; les forces au genou sont maximales vers 90 degrés | Hartmann, Wirth, Klusemann, Sports Med 2013;43(10):993-1008, https://pubmed.ncbi.nlm.nih.gov/23821469/ ; revue de la littérature (plus de 160 articles) ; résumé lu via moteur de recherche | revue narrative, adultes sains ; ne couvre pas les genoux douloureux ni l'arthrose | 2026-10-24 | PROVISOIRE (résumé seulement) |
