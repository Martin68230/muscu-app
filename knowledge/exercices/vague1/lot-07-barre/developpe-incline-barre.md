---
id: developpe-incline-barre
nom: Développé incliné à la barre
alias: [incline bench press]
schema: poussee_h
type: force
niveau_min: intermediaire
muscles_principaux: [pectoraux, deltoides_anterieurs]
muscles_secondaires: [triceps, dentele_anterieur]
source_brouillon: []
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| developpe-incline-barre-pente-douce | Pente douce | 1 | intermediaire | barre, disques, rack, banc_inclinable | Banc réglé à une pente douce (environ 30 degrés) dans le rack ; barres de sécurité juste au-dessus de la poitrine, testées à vide. |

## Consignes
1. Règle le dossier du banc à une pente douce et verrouille-le ; place-le au centre du rack ; barres de sécurité juste au-dessus de la poitrine, testées à vide.
2. Allonge-toi, pieds à plat, omoplates serrées contre le dossier ; mains un peu plus larges que les épaules, pouces autour.
3. Sors la barre bras tendus, descends-la lentement vers le haut de la poitrine, coudes à environ 45 degrés du buste.
4. Pousse jusqu'aux bras tendus, sans verrouiller les coudes.
5. Replace la barre sur les supports en la guidant vers l'arrière.

## Points d'attention
- Pente douce : plus la pente est forte, plus l'épaule travaille.
- Charge plus légère qu'au banc plat.
- Mêmes règles de sécurité que le développé couché (barres de sécurité, colliers, pas d'échec).
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Pente trop forte (devient un développé épaules).
- Coudes trop écartés.
- Rebond sur la poitrine.
- Dossier mal verrouillé.

## Progression / régression
- plus-facile : developpe-couche-barre, developpe-incline-halteres
- plus-dur : aucun

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE ; ACSM 2026, SRC1 : force = charges lourdes, 2 à 3 séries par exercice, exercice prioritaire en début de séance) : force intermédiaire et avancé 4 à 6 répétitions, 3 séries, 2 répétitions en réserve, repos 180 s ; force débutant 6 à 10 répétitions, 2 séries, 3 en réserve, repos 120 s ; muscle 8 à 12 répétitions (10 à 12 pour un débutant), 2 à 3 en réserve, repos 90 à 120 s. Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. Étalonnage (load-calibration.md) : première séance avec la barre seule (ou la charge la plus légère du profil), puis on ajoute les disques par petits paliers réels ; après chaque série, une question : « combien de répétitions te restait-il ? » ; double progression (on monte les répétitions, puis la charge). **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : jamais 0 répétition en réserve, jamais de série menée jusqu'à l'échec ; si la vitesse de la barre chute nettement ou si la technique se dégrade, la série est finie.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24, repris et corrigé par `kine` le 2026-10-24 (à contrôler par `relecteur`). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | garder | adapter: charge:legere | retirer |
| Épaule | adapter: amplitude:reduite | retirer | retirer |
| Coude | garder | adapter: charge:legere | retirer |
| Poignet | garder | adapter: charge:legere | retirer |
| Genou | garder | garder | retirer: sans-zone:developpe-incline-barre-pente-douce |
| Hanche | garder | garder | retirer |
| Cheville | garder | garder | retirer: sans-zone:developpe-incline-barre-pente-douce |
| Cou | garder | adapter: charge:legere | retirer |

**Notes**
- general : La barre seule pèse souvent 20 kg (parfois moins) : c'est déjà une charge. Si elle est trop lourde pour garder le geste propre, passe à la version aux haltères (NON SOURCÉ ; question Q12 de docs/QUESTIONS.md).
- epaule-n1 : descends moins bas, pente plus douce.
- epaule-n2 : retiré (le remplaçant serait adapté par la même zone).
- cou-n1 : tête contre le dossier.
- genou-n3 : jambes posées, non sollicitées : la variante reste permise ; la hanche, fléchie sur le banc incliné, est retirée au niveau 3.
- cheville-n3 : jambes posées, non sollicitées : la variante reste permise ; la hanche, fléchie sur le banc incliné, est retirée au niveau 3.
- grossesse : semi-allongé avec une barre au-dessus de la poitrine : retiré par prudence, confirmé par kine (NON SOURCÉ ; couché sur le dos : G4) ; remplaçant : développé épaules assis aux haltères, charge légère. Post-partum : G7.

**Grossesse** : retirer: remplacant:developpe-epaules-halteres
**Version plus douce** : developpe-incline-halteres

**Sécurité pour l'utilisateur seul**
- Le matériel « rack » de l'app veut dire : rack ou cage à squat avec barres de sécurité (ou goujons). Sans barres de sécurité, ne coche pas « rack » et ne fais pas cette variante.
- Barres de sécurité (ou goujons) réglées **avant la première série** : la barre posée dessus doit se trouver à quelques centimètres au-dessus de ta poitrine, jamais plus bas. Tu t'arrêtes à ce niveau : la barre ne touche pas la poitrine. Test à vide : allonge-toi, descends la barre seule jusqu'aux barres de sécurité et vérifie que tu peux te glisser dehors sans la toucher.
- Si la barre ralentit et ne remonte plus : ne la bascule pas d'un seul côté et ne la laisse pas peser sur la poitrine ; laisse-la descendre doucement sur les barres de sécurité, puis glisse-toi dehors.
- Pouce autour de la barre (jamais pouce du même côté que les doigts, « prise de singe »).
- Pas de rack avec barres de sécurité : pas de développé à la barre chargée seul ; utilise le développé aux haltères (qui se posent sur les cuisses).
- Dossier du banc verrouillé et vérifié avant la série : il ne doit pas bouger quand tu t'y appuies. Pente douce seulement (environ 30 degrés) ; les barres de sécurité sont réglées pour cette pente.
- Colliers de serrage posés et serrés des deux côtés avant chaque série, mêmes disques de chaque côté (un disque qui glisse fait basculer la barre).
- Pas d'échec : arrête la série avec au moins 2 répétitions en réserve ; si la barre ralentit nettement ou si la technique se dégrade, la série est finie. En cas de doute sur la charge, prends plus léger.
- Idéalement, quelqu'un dans la maison ou la salle, à portée de voix. Un partenaire peut aider, mais il ne remplace jamais les barres de sécurité.

**Points d'attention (kine)**
- Même règle de sécurité que le développé couché : barres de sécurité obligatoires, réglées pour la pente du banc avant la première série.
- Épaule : plus la pente est forte, plus l'épaule travaille ; pente douce seulement. Descends moins bas si l'épaule tire ; gêne nette : retiré.
- Charge plus légère qu'au banc plat. Tête contre le dossier, jamais relevée.
- Charge au-dessus du visage (R9 appliqué à la barre).
- Niveau : intermédiaire. Chemin conseillé : développé incliné aux haltères.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente à l'épaule, au coude ou au poignet.
- Barre qui part de travers, disque qui glisse ou collier qui bouge : repose la barre (sur le rack ou au sol) avant tout.
- Perte de contrôle de la barre ou impression que tu ne pourras pas finir la répétition : arrête la série, ne force pas.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Dossier qui bouge.
- Voile devant les yeux, vertige ou tête qui tourne en fin de série (souvent un blocage de la respiration) : repose la barre, assieds-toi, ne reprends pas la séance (R5).
- Colliers qui bougent ou disques de travers : repose la barre avant tout.
- Barre qui part de travers ou que tu ne contrôles plus au-dessus de la poitrine : laisse-la descendre sur les barres de sécurité.
- Tension dans la nuque quand tu relèves la tête : repose la tête sur le banc.

**Objets du quotidien**
- Barre et disques : colliers de serrage (clips) posés et serrés des deux côtés avant chaque série ; mêmes disques de chaque côté ; barre droite (ni tordue, ni jeu dans les manchons) ; disques jamais posés « sans collier » même pour une série légère.
- Rack ou cage à squat : stable (fixé, lesté ou contre un mur), supports de barre réglés à la bonne hauteur et bloqués ; **barres de sécurité (ou goujons) réglées AVANT la première série et testées à vide** : la barre doit pouvoir se poser dessus sans que tu sois écrasé. Pas de rack = pas de cette variante (le tag `rack` est obligatoire).
- Banc inclinable : 4 appuis au sol, qui ne bascule pas et ne glisse pas (sol non glissant, banc calé si besoin), vis, pieds et réglage en bon état ; avant la première série, appuie-toi dessus comme pendant l'exercice : s'il bouge, grince ou se plie, ne l'utilise pas. Un canapé, un lit ou une caisse ne remplacent pas un banc.
- Sol plat, sec, non glissant (planches ou tapis de salle fermes) ; chaussures fermées à semelle plate ou rigide ; espace libre autour de la barre, rien derrière toi ; jamais de pieds nus avec une barre chargée.

## Photo
- `Barbell_Incline_Bench_Press_-_Medium_Grip/0.jpg` : affichable : non (la photo ne montre pas de barres de sécurité réglées, que la fiche exige : la consigne prime)
- `Barbell_Incline_Bench_Press_-_Medium_Grip/1.jpg` : affichable : non (la photo ne montre pas de barres de sécurité réglées, que la fiche exige : la consigne prime)
- illustration : public/illustrations/developpe-incline-barre.svg : affichable : oui (illustration originale de l'app, 24/10/2026 ; Développé incliné, vue de profil, pente douce : barres de sécurité jaunes juste au-dessus de la poitrine)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet de la barre, consignes de départ) : Barbell_Incline_Bench_Press_-_Medium_Grip (niveau « beginner » dans la base ; coach le met en intermédiaire : choix prudent NON SOURCÉ) | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db ; fichier dist/exercises.json relu le 2026-10-24 pour vérifier l'existence de l'entrée, son niveau et son matériel ; consignes réécrites par coach | base d'exercices (pratique, pas une étude) | 2026-10-24 | PROVISOIRE |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Colliers de serrage, barres de sécurité du rack réglées et testées, installation seul, objets du quotidien | regles-securite-communes.md §7 et R8 ; pratique de salle, raisonnement mécanique de coach | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul (barre lourde) | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul avec une barre est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Zones de blessures les plus fréquentes chez les haltérophiles et les pratiquants de force athlétique (colonne, épaule, genou) : justifie un tableau complet par zone | Aasa et coll., Br J Sports Med 2017;51(4):211-219, https://pubmed.ncbi.nlm.nih.gov/27707741/ ; revue systématique de 9 études, la plupart de faible qualité ; résumé lu via moteur de recherche | revue systématique, athlètes de compétition, qualité faible ; ne concerne pas les pratiquants de loisir | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 24/10/2026, à contrôler par relecteur) |
| Grossesse et post-partum : barre chargée retirée par prudence (équilibre, apnée, chute de la barre) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas la barre chargée | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, confirmée par kine le 24/10/2026 comme choix prudent, à contrôler par relecteur) |
| Un banc horizontal active à la fois le haut et le bas du grand pectoral ; 30 à 45 degrés d'inclinaison changent l'activation à certains moments du mouvement | Lauver, Cayot, Scheuermann, Eur J Sport Sci 2016;16(3):309-316, https://pubmed.ncbi.nlm.nih.gov/25799093/ ; résumé lu via moteur de recherche, texte complet non lu | étude de laboratoire (EMG), 14 hommes entraînés, développé à la barre à 65 % du maximum | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Niveau minimum, barres de sécurité et repli en cas de blocage, colliers, pas d'échec seul, cases par zone et par niveau, grossesse, remplaçants, points d'attention (kine) | Raisonnement de `kine` à partir des règles communes (regles-securite-communes.md) et des études déjà citées dans cette fiche (résumés seulement). Aucune source nouvelle lue pour cette passe ; aucune étude ne teste ces choix exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (choix prudents de kine, à contrôler par relecteur) |
