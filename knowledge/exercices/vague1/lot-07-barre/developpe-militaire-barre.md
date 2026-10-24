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
statut: complete_kine
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
Rédigé par `coach` le 2026-10-24, repris et corrigé par `kine` le 2026-10-24 (à contrôler par `relecteur`). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: variante:developpe-militaire-barre-assis | adapter: variante:developpe-militaire-barre-assis | retirer |
| Épaule | adapter: charge:legere | retirer | retirer |
| Coude | garder | adapter: charge:legere | retirer |
| Poignet | garder | adapter: charge:legere | retirer |
| Genou | garder | garder | retirer: sans-zone:developpe-militaire-barre-assis |
| Hanche | garder | garder | retirer |
| Cheville | garder | garder | retirer: sans-zone:developpe-militaire-barre-assis |
| Cou | garder | adapter: charge:legere | retirer |

**Notes**
- general : La barre seule pèse souvent 20 kg (parfois moins) : c'est déjà une charge. Si elle est trop lourde pour garder le geste propre, passe à la version aux haltères (NON SOURCÉ ; question Q12 de docs/QUESTIONS.md).
- epaule-n1 : charge légère ; amplitude sans gêne.
- epaule-n2 : le remplaçant (développé épaules aux haltères) serait lui-même adapté par la même zone : retrait sans remplaçant.
- dos-n1 : variante assise, dos appuyé.
- dos-n2 : variante assise, charge qui ne monte pas (R2).
- cou-n1 : ne force pas la tête en arrière.
- genou-n3 : développé assis, pieds posés : la variante assise reste permise ; la hanche, fléchie sur le banc, est retirée au niveau 3.
- cheville-n3 : développé assis, pieds posés : la variante assise reste permise ; la hanche, fléchie sur le banc, est retirée au niveau 3.
- grossesse : barre au-dessus de la tête, équilibre et blocage de la respiration : retiré par prudence, confirmé par kine (NON SOURCÉ) ; remplaçant : développé épaules assis aux haltères, charge légère (G4 : adapter). Post-partum : G7.

**Grossesse** : retirer: remplacant:developpe-epaules-halteres
**Version plus douce** : developpe-epaules-halteres

**Sécurité pour l'utilisateur seul**
- Le matériel « rack » de l'app veut dire : rack ou cage à squat avec barres de sécurité (ou goujons). Sans barres de sécurité, ne coche pas « rack » et ne fais pas cette variante.
- Assis (variante 1) : banc presque droit au centre du rack, dos appuyé, pieds à plat. Barres de sécurité réglées **avant la première série** juste sous la barre quand elle est au niveau de tes clavicules ; testées à vide. Si tu ne peux pas finir la répétition, redescends la barre sur les clavicules puis sur les barres de sécurité, et dégage-toi.
- Debout (variante 2) : reste à un pas du rack. Si tu bloques, redescends la barre sur le haut de la poitrine, avance d'un pas et repose-la sur les supports. Ne lâche jamais une barre depuis le dessus de la tête, et jamais derrière la nuque.
- Colliers de serrage posés et serrés des deux côtés avant chaque série, mêmes disques de chaque côté (un disque qui glisse fait basculer la barre).
- Pas d'échec : arrête la série avec au moins 2 répétitions en réserve ; si la barre ralentit nettement ou si la technique se dégrade, la série est finie. En cas de doute sur la charge, prends plus léger.
- Idéalement, quelqu'un dans la maison ou la salle, à portée de voix. Un partenaire peut aider, mais il ne remplace jamais les barres de sécurité.

**Points d'attention (kine)**
- Épaule : le mouvement passe par la zone où l'épaule se pince le plus facilement (bras levés au-dessus de la tête). Une gêne légère : charge légère, amplitude sans gêne ; une gêne nette : retiré (case épaule). Pas d'élan des jambes (autre mouvement, non proposé).
- La barre monte devant le visage et se termine au-dessus de la tête, jamais derrière la nuque. Tête qui avance légèrement quand la barre passe, puis revient ; pas de nuque cambrée.
- Assis, dos appuyé : version à privilégier (échelon 1) ; elle protège le bas du dos. Debout : ventre et fessiers serrés, pas de cambrure du bas du dos ; le dos le plus sensible passe à la version assise (case dos).
- Charge nettement plus légère qu'au développé couché.
- Niveau : intermédiaire. Chemin conseillé : développé épaules aux haltères, puis cette fiche assise, puis debout.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente à l'épaule, au coude, au poignet ou au bas du dos.
- Barre qui part de travers, disque qui glisse ou collier qui bouge : repose la barre (sur le rack ou au sol) avant tout.
- Perte de contrôle de la barre ou impression que tu ne pourras pas finir la répétition : arrête la série, ne force pas.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Barre que tu ne contrôles plus au-dessus de la tête.
- Voile devant les yeux, vertige ou tête qui tourne en fin de série (souvent un blocage de la respiration) : repose la barre, assieds-toi, ne reprends pas la séance (R5).
- Colliers qui bougent ou disques de travers : repose la barre avant tout.
- Barre que tu ne contrôles plus au-dessus de la tête : redescends-la sur les clavicules, puis sur les supports.
- Douleur pincante à l'épaule en haut du mouvement : arrête.
- Cambrure forte du bas du dos en haut du mouvement : arrête et reviens à la version assise.

**Objets du quotidien**
- Barre et disques : colliers de serrage (clips) posés et serrés des deux côtés avant chaque série ; mêmes disques de chaque côté ; barre droite (ni tordue, ni jeu dans les manchons) ; disques jamais posés « sans collier » même pour une série légère.
- Rack ou cage à squat : stable (fixé, lesté ou contre un mur), supports de barre réglés à la bonne hauteur et bloqués ; **barres de sécurité (ou goujons) réglées AVANT la première série et testées à vide** : la barre doit pouvoir se poser dessus sans que tu sois écrasé. Pas de rack = pas de cette variante (le tag `rack` est obligatoire).
- Banc inclinable (dossier presque droit) : 4 appuis au sol, qui ne bascule pas et ne glisse pas (sol non glissant, banc calé si besoin), vis, pieds et réglage en bon état ; avant la première série, appuie-toi dessus comme pendant l'exercice : s'il bouge, grince ou se plie, ne l'utilise pas. Un canapé, un lit ou une caisse ne remplacent pas un banc.
- Sol plat, sec, non glissant (planches ou tapis de salle fermes) ; chaussures fermées à semelle plate ou rigide ; espace libre autour de la barre, rien derrière toi ; jamais de pieds nus avec une barre chargée.

## Photo
- `Seated_Barbell_Military_Press/0.jpg` : affichable : non (vue de dos : on ne voit pas si la barre passe devant ou derrière la tête ; pas de barres de sécurité visibles)
- `Seated_Barbell_Military_Press/1.jpg` : affichable : non (vue de dos : on ne voit pas si la barre passe devant ou derrière la tête ; pas de barres de sécurité visibles)
- `Standing_Military_Press/0.jpg` : affichable : oui (variante debout (échelon 2), barre devant la tête ; vue le 24/10/2026)
- `Standing_Military_Press/1.jpg` : affichable : oui (variante debout (échelon 2), barre devant la tête ; vue le 24/10/2026)
- légende : Photo : version debout (échelon 2). La version assise se fait dossier droit, barres de sécurité aux clavicules.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet de la barre, consignes de départ) : Seated_Barbell_Military_Press (niveau « intermediate »), Standing_Military_Press (niveau « beginner » dans la base) | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db ; fichier dist/exercises.json relu le 2026-10-24 pour vérifier l'existence de l'entrée, son niveau et son matériel ; consignes réécrites par coach | base d'exercices (pratique, pas une étude) | 2026-10-24 | PROVISOIRE |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Colliers de serrage, barres de sécurité du rack réglées et testées, installation seul, objets du quotidien | regles-securite-communes.md §7 et R8 ; pratique de salle, raisonnement mécanique de coach | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul (barre lourde) | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul avec une barre est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Zones de blessures les plus fréquentes chez les haltérophiles et les pratiquants de force athlétique (colonne, épaule, genou) : justifie un tableau complet par zone | Aasa et coll., Br J Sports Med 2017;51(4):211-219, https://pubmed.ncbi.nlm.nih.gov/27707741/ ; revue systématique de 9 études, la plupart de faible qualité ; résumé lu via moteur de recherche | revue systématique, athlètes de compétition, qualité faible ; ne concerne pas les pratiquants de loisir | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 24/10/2026, à contrôler par relecteur) |
| Grossesse et post-partum : barre chargée retirée par prudence (équilibre, apnée, chute de la barre) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas la barre chargée | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, confirmée par kine le 24/10/2026 comme choix prudent, à contrôler par relecteur) |
| Développé militaire à la barre, assis ou debout : activité du deltoïde antérieur plus faible avec la barre qu'avec des haltères, activité du deltoïde postérieur plus faible assis que debout (15 hommes, 80 % du maximum) | Saeterbakken et Fimland, J Strength Cond Res 2013;27(7):1824-1831, DOI 10.1519/JSC.0b013e318276b873 ; résumé lu via moteur de recherche (dont le résultat sur la force maximale n'a pas été lu) | étude de laboratoire, 15 hommes ; ne porte pas sur la sécurité | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Niveau minimum, barres de sécurité et repli en cas de blocage, colliers, pas d'échec seul, cases par zone et par niveau, grossesse, remplaçants, points d'attention (kine) | Raisonnement de `kine` à partir des règles communes (regles-securite-communes.md) et des études déjà citées dans cette fiche (résumés seulement). Aucune source nouvelle lue pour cette passe ; aucune étude ne teste ces choix exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (choix prudents de kine, à contrôler par relecteur) |
