---
id: developpe-militaire-barre
nom: Développé militaire à la barre
alias: [overhead press, développé épaules à la barre]
schema: poussee_v
type: force
niveau_min: intermediaire
muscles_principaux: [deltoides_anterieurs]
muscles_secondaires: [triceps, deltoides_lateraux, trapezes, dentele_anterieur, abdominaux]
source_brouillon: []
statut: brouillon_coach
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| developpe-militaire-barre-assis | Assis, dossier droit, dans le rack | 1 | intermediaire | barre, disques, rack, banc_inclinable | Banc réglé presque droit au centre du rack, barre sur les supports à hauteur d'épaules ; dos appuyé, pieds à plat ; barres de sécurité à hauteur d'épaules. |
| developpe-militaire-barre-debout | Debout, barre prise au rack | 2 | intermediaire | barre, disques, rack | Barre sur les supports à hauteur de clavicules, tu la prends et recules d'un pas ; pieds largeur du bassin, ventre et fessiers serrés. |

## Consignes
1. Règle les supports et les barres de sécurité à hauteur de tes épaules (sécurités juste sous la barre quand elle est sur la poitrine).
2. Prends la barre un peu plus large que les épaules, avant-bras verticaux ; barre sur le haut de la poitrine et les épaules, coudes un peu devant la barre.
3. Pousse la barre droit vers le haut en passant la tête légèrement en arrière puis « sous » la barre quand elle passe le front ; verrouille doucement en haut, bras au-dessus des oreilles.
4. Redescends en contrôle jusqu'à la clavicule en reculant légèrement la tête pour laisser passer la barre.
5. Fin de série : replace la barre sur les supports du rack.

## Points d'attention
- Assis : dossier presque droit, dos appuyé ; debout : ventre et fessiers serrés, sans cambrer le bas du dos.
- La barre monte devant le visage et se termine au-dessus de la tête, jamais derrière la nuque.
- Charge nettement plus légère qu'au développé couché.
- Pas d'élan des jambes (c'est un autre mouvement, plus technique, non proposé ici).
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Cambrer fort le bas du dos.
- Pousser avec les jambes.
- Barre qui part devant et fait tomber le corps en arrière.
- Coudes écartés très haut avec la barre derrière la tête.

## Progression / régression
- plus-facile : developpe-epaules-halteres, developpe-epaules-assis-dossier-incline
- plus-dur : aucun

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE ; ACSM 2026, SRC1 : force = charges lourdes, 2 à 3 séries par exercice, exercice prioritaire en début de séance) : force intermédiaire et avancé 4 à 6 répétitions, 3 séries, 2 répétitions en réserve, repos 180 s ; force débutant 6 à 10 répétitions, 2 séries, 3 en réserve, repos 120 s ; muscle 8 à 12 répétitions (10 à 12 pour un débutant), 2 à 3 en réserve, repos 90 à 120 s. Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. Étalonnage (load-calibration.md) : première séance avec la barre seule (ou la charge la plus légère du profil), puis on ajoute les disques par petits paliers réels ; après chaque série, une question : « combien de répétitions te restait-il ? » ; double progression (on monte les répétitions, puis la charge). **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : jamais 0 répétition en réserve, jamais de série menée jusqu'à l'échec ; si la vitesse de la barre chute nettement ou si la technique se dégrade, la série est finie.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24 (proposition prudente, **à compléter et corriger par `kine`**). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: variante:developpe-militaire-barre-assis | adapter: charge:legere | retirer |
| Épaule | adapter: charge:legere | retirer | retirer |
| Coude | garder | adapter: charge:legere | retirer |
| Poignet | garder | adapter: charge:legere | retirer |
| Genou | garder | garder | retirer: sans-zone:developpe-militaire-barre-assis |
| Hanche | garder | garder | retirer: sans-zone:developpe-militaire-barre-assis |
| Cheville | garder | garder | retirer: sans-zone:developpe-militaire-barre-assis |
| Cou | garder | adapter: charge:legere | retirer |

**Notes**
- epaule-n1 : charge légère ; amplitude sans gêne.
- epaule-n2 : le remplaçant (développé épaules aux haltères) serait lui-même adapté par la même zone : retrait sans remplaçant.
- dos-n1 : variante assise, dos appuyé.
- dos-n2 : charge légère, pas d'augmentation.
- cou-n1 : ne force pas la tête en arrière.
- grossesse : barre au-dessus de la tête, équilibre et apnée : retiré par prudence (NON SOURCÉ) ; remplaçant : développé épaules assis aux haltères, charge légère (G4 : adapter). Post-partum : G7.

**Grossesse** : retirer: remplacant:developpe-epaules-halteres
**Version plus douce** : developpe-epaules-halteres

**Sécurité pour l'utilisateur seul**
- Barres de sécurité du rack à hauteur d'épaules, testées à vide : si tu ne peux pas finir la répétition, redescends la barre sur la poitrine puis sur les barres de sécurité (assis) ou sur les supports (debout).
- Colliers des deux côtés ; pas d'échec ; au moins 2 répétitions en réserve.
- Debout : pas de barre lâchée vers l'avant ; jamais derrière la nuque.

**Points d'attention (kine)**
- À rédiger et corriger par `kine` (étape suivante du cycle). Points de départ proposés par coach : voir « Sécurité pour l'utilisateur seul » ci-dessus et les notes par zone.
- Épaule (arc douloureux, position) en priorité ; dos en debout.
- Debout / assis : l'app propose l'assis en priorité (échelon 1).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente à l'épaule, au coude, au poignet ou au bas du dos.
- Barre qui part de travers, disque qui glisse ou collier qui bouge : repose la barre (sur le rack ou au sol) avant tout.
- Perte de contrôle de la barre ou impression que tu ne pourras pas finir la répétition : arrête la série, ne force pas.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Barre que tu ne contrôles plus au-dessus de la tête.

**Objets du quotidien**
- - Barre et disques : colliers de serrage (clips) posés et serrés des deux côtés avant chaque série ; mêmes disques de chaque côté ; barre droite (ni tordue, ni jeu dans les manchons) ; disques jamais posés « sans collier » même pour une série légère.
- - Rack ou cage à squat : stable (fixé, lesté ou contre un mur), supports de barre réglés à la bonne hauteur et bloqués ; **barres de sécurité (ou goujons) réglées AVANT la première série et testées à vide** : la barre doit pouvoir se poser dessus sans que tu sois écrasé. Pas de rack = pas de cette variante (le tag `rack` est obligatoire).
- - Banc inclinable (dossier presque droit) : 4 appuis au sol, qui ne bascule pas et ne glisse pas (sol non glissant, banc calé si besoin), vis, pieds et réglage en bon état ; avant la première série, appuie-toi dessus comme pendant l'exercice : s'il bouge, grince ou se plie, ne l'utilise pas. Un canapé, un lit ou une caisse ne remplacent pas un banc.
- - Sol plat, sec, non glissant (planches ou tapis de salle fermes) ; chaussures fermées à semelle plate ou rigide ; espace libre autour de la barre, rien derrière toi ; jamais de pieds nus avec une barre chargée.

## Photo
- `Seated_Barbell_Military_Press/0.jpg` : affichable : à vérifier (candidat free-exercise-db non vu ; WebP à créer par dev ; variante assise ; vérifier)
- `Seated_Barbell_Military_Press/1.jpg` : affichable : à vérifier (candidat free-exercise-db non vu ; WebP à créer par dev ; idem)
- `Standing_Military_Press/0.jpg` : affichable : à vérifier (candidat free-exercise-db non vu ; WebP à créer par dev ; variante debout ; vérifier)
- `Standing_Military_Press/1.jpg` : affichable : à vérifier (candidat free-exercise-db non vu ; WebP à créer par dev ; idem)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet de la barre, consignes de départ) : Seated_Barbell_Military_Press (niveau « intermediate »), Standing_Military_Press (niveau « beginner » dans la base) | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db ; fichier dist/exercises.json relu le 2026-10-24 pour vérifier l'existence de l'entrée, son niveau et son matériel ; consignes réécrites par coach | base d'exercices (pratique, pas une étude) | 2026-10-24 | PROVISOIRE |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Colliers de serrage, barres de sécurité du rack réglées et testées, installation seul, objets du quotidien | regles-securite-communes.md §7 et R8 ; pratique de salle, raisonnement mécanique de coach | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul (barre lourde) | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul avec une barre est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Zones de blessures les plus fréquentes chez les haltérophiles et les pratiquants de force athlétique (colonne, épaule, genou) : justifie un tableau complet par zone | Aasa et coll., Br J Sports Med 2017;51(4):211-219, https://pubmed.ncbi.nlm.nih.gov/27707741/ ; revue systématique de 9 études, la plupart de faible qualité ; résumé lu via moteur de recherche | revue systématique, athlètes de compétition, qualité faible ; ne concerne pas les pratiquants de loisir | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (à compléter par kine puis contrôler par relecteur) |
| Grossesse et post-partum : barre chargée retirée par prudence (équilibre, apnée, chute de la barre) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas la barre chargée | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, à valider par kine) |
| Développé militaire à la barre, assis ou debout : activité du deltoïde antérieur plus faible avec la barre qu'avec des haltères, activité du deltoïde postérieur plus faible assis que debout (15 hommes, 80 % du maximum) | Saeterbakken et Fimland, J Strength Cond Res 2013;27(7):1824-1831, DOI 10.1519/JSC.0b013e318276b873 ; résumé lu via moteur de recherche (dont le résultat sur la force maximale n'a pas été lu) | étude de laboratoire, 15 hommes ; ne porte pas sur la sécurité | 2026-10-24 | PROVISOIRE (résumé seulement) |
