---
id: fente-barre
nom: Squat fendu à la barre
alias: [fente à la barre, split squat barre]
schema: fente
type: force
niveau_min: intermediaire
muscles_principaux: [quadriceps, fessiers]
muscles_secondaires: [adducteurs, ischios, erecteurs_rachis, abdominaux, mollets]
source_brouillon: []
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| fente-barre-statique | Squat fendu : pieds immobiles | 1 | intermediaire | barre, disques, rack | Barre sur le haut du dos, un pied devant et l'autre derrière, les deux pieds restent en place ; tu descends et tu remontes sur place. |

## Consignes
1. Règle les supports du rack à hauteur du haut de la poitrine et les barres de sécurité à une hauteur où la barre peut se poser sans te gêner si tu descends à genoux ; sors la barre comme pour un squat.
2. Place un pied devant et l'autre derrière (grand écart naturel), les deux pieds au centre du rack, poids réparti ; ils ne bougent plus pendant la série.
3. Descends droit vers le bas, le genou de devant dans l'axe du pied, le buste droit, jusqu'à ce que le genou arrière frôle le sol (ou moins bas si ton équilibre l'impose).
4. Remonte en poussant dans tout le pied de devant, sans te pencher en avant.
5. Fin de série : repose la barre sur les supports du rack.

## Points d'attention
- Dépasse-toi par petites étapes : barre seule d'abord, puis disques, en contrôlant l'équilibre.
- Reste au centre du rack, qui doit être stable ; pas de pas en arrière ni de marche avec la barre (variantes écartées par kine, Q16).
- Si l'équilibre manque, reviens à la fente arrière sans barre (fiche fente-arriere).
- Un côté plus faible : fais-le en premier et ne dépasse pas ses répétitions de l'autre côté.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Genou de devant qui rentre.
- Buste qui penche fortement en avant.
- Pas trop court (le genou dépasse beaucoup la pointe du pied et le talon décolle).
- Poser le genou arrière brutalement.

## Progression / régression
- plus-facile : fente-arriere, squat-fendu
- plus-dur : aucun

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE ; ACSM 2026, SRC1 : force = charges lourdes, 2 à 3 séries par exercice, exercice prioritaire en début de séance) : force intermédiaire et avancé 4 à 6 répétitions (pour les fentes, le générateur peut choisir la fourchette « autre », 8 à 12, par côté), 3 séries, 2 répétitions en réserve, repos 180 s ; force débutant 6 à 10 répétitions, 2 séries, 3 en réserve, repos 120 s ; muscle 8 à 12 répétitions (10 à 12 pour un débutant), 2 à 3 en réserve, repos 90 à 120 s. Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. Étalonnage (load-calibration.md) : première séance avec la barre seule (ou la charge la plus légère du profil), puis on ajoute les disques par petits paliers réels ; après chaque série, une question : « combien de répétitions te restait-il ? » ; double progression (on monte les répétitions, puis la charge). **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : jamais 0 répétition en réserve, jamais de série menée jusqu'à l'échec ; si la vitesse de la barre chute nettement ou si la technique se dégrade, la série est finie.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24, repris et corrigé par `kine` le 2026-10-24 (à contrôler par `relecteur`). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: charge:legere | retirer: remplacant:fente-arriere | retirer |
| Épaule | adapter: charge:legere | retirer: remplacant:fente-arriere | retirer |
| Coude | garder | adapter: charge:legere | retirer |
| Poignet | garder | adapter: charge:legere | retirer |
| Genou | adapter: amplitude:sans-gene | adapter: amplitude:mi-course | retirer |
| Hanche | adapter: amplitude:sans-gene | adapter: amplitude:mi-course | retirer |
| Cheville | garder | adapter: amplitude:sans-gene | retirer |
| Cou | adapter: charge:legere | retirer: remplacant:fente-arriere | retirer |
| Cuisse | garder | adapter: amplitude:sans-gene | retirer |
| Aine | garder | adapter: amplitude:sans-gene | retirer |

**Notes**
- general : La barre seule pèse souvent 20 kg (parfois moins) : c'est déjà une charge. Si elle est trop lourde pour garder le geste propre, passe à la version aux haltères (NON SOURCÉ ; question Q12 de docs/QUESTIONS.md).
- general : la fente arrière avec une barre sur le dos (un pas hors de la ligne du rack) a été supprimée par kine : aucun filet fiable seul si l'équilibre manque (question Q16 de docs/QUESTIONS.md). Seul le squat fendu, pieds immobiles et au centre du rack, est gardé.
- dos-n2 : colonne chargée : retiré ; remplaçant fente arrière sans barre (le générateur le propose s'il n'est pas adapté par le profil).
- epaule-n2 : position des bras derrière la barre : retiré.
- genou-n1 : descente moins profonde.
- genou-n2 : demi-descente, charge non augmentée (R2).
- cou-n1 : barre sur les muscles du haut du dos, pas sur la nuque ; charge légère.
- cou-n2 : la barre appuie sur la base du cou : retiré.
- cuisse-n2 : ischios secondaires : descente sans gêne.
- aine-n2 : adducteurs secondaires : écart des pieds réduit.
- grossesse : barre chargée et équilibre instable : retiré par prudence, confirmé par kine (NON SOURCÉ) ; remplaçant : fente arrière sans barre (adaptée en grossesse par sa propre fiche). Post-partum : G7.

**Grossesse** : retirer: remplacant:fente-arriere
**Version plus douce** : fente-arriere

**Sécurité pour l'utilisateur seul**
- Le matériel « rack » de l'app veut dire : rack ou cage à squat avec barres de sécurité (ou goujons). Sans barres de sécurité, ne coche pas « rack » et ne fais pas cette variante.
- Barres de sécurité réglées **avant la première série** juste sous la barre quand tu es au plus bas de ta descente (genou arrière proche du sol), testées à vide avec la barre seule.
- Les deux pieds restent au centre du rack, sous la barre ; aucun pas pendant la série. Si tu perds l'équilibre en bas : laisse la barre se poser sur les barres de sécurité et dégage-toi en avançant ; si c'est en haut : pose les deux pieds à largeur du bassin, remonte-toi, repose la barre sur les supports.
- Chaussures plates à semelle ferme, sol non glissant.
- Colliers de serrage posés et serrés des deux côtés avant chaque série, mêmes disques de chaque côté (un disque qui glisse fait basculer la barre).
- Pas d'échec : arrête la série avec au moins 2 répétitions en réserve ; si la barre ralentit nettement ou si la technique se dégrade, la série est finie. En cas de doute sur la charge, prends plus léger.
- Idéalement, quelqu'un dans la maison ou la salle, à portée de voix. Un partenaire peut aider, mais il ne remplace jamais les barres de sécurité.

**Points d'attention (kine)**
- Position unilatérale : l'équilibre compte plus que la charge. Barre seule d'abord, puis disques par petits paliers ; le côté le plus faible commence, l'autre ne dépasse pas ses répétitions.
- Genou de devant dans l'axe du pied, jamais vers l'intérieur ; buste droit, descente verticale. Le genou arrière frôle le sol sans le heurter. Genou ou hanche qui tire : descente moins profonde (cases genou et hanche).
- Barre sur les muscles du haut du dos, pas sur les vertèbres ; épaule, coude et poignet comme au squat arrière.
- Niveau : intermédiaire. Chemin conseillé : fente arrière sans barre, squat fendu aux haltères, puis cette fiche.
- Grossesse et post-partum : retiré (barre et équilibre).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au genou, à la hanche, à l'aine ou au bas du dos.
- Barre qui part de travers, disque qui glisse ou collier qui bouge : repose la barre (sur le rack ou au sol) avant tout.
- Perte de contrôle de la barre ou impression que tu ne pourras pas finir la répétition : arrête la série, ne force pas.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Perte d'équilibre répétée.
- Voile devant les yeux, vertige ou tête qui tourne en fin de série (souvent un blocage de la respiration) : repose la barre, assieds-toi, ne reprends pas la séance (R5).
- Colliers qui bougent ou disques de travers : repose la barre avant tout.
- Genou qui tire ou se dérobe, hanche qui pince en bas de la descente : arrête.
- Perte d'équilibre répétée : arrête la série et repose la barre.

**Objets du quotidien**
- Barre et disques : colliers de serrage (clips) posés et serrés des deux côtés avant chaque série ; mêmes disques de chaque côté ; barre droite (ni tordue, ni jeu dans les manchons) ; disques jamais posés « sans collier » même pour une série légère.
- Rack ou cage à squat : stable (fixé, lesté ou contre un mur), supports de barre réglés à la bonne hauteur et bloqués ; **barres de sécurité (ou goujons) réglées AVANT la première série et testées à vide** : la barre doit pouvoir se poser dessus sans que tu sois écrasé. Pas de rack = pas de cette variante (le tag `rack` est obligatoire).
- Sol plat, sec, non glissant (planches ou tapis de salle fermes) ; chaussures fermées à semelle plate ou rigide ; espace libre autour de la barre, rien derrière toi ; jamais de pieds nus avec une barre chargée.

## Photo
- `Barbell_Lunge/0.jpg` : affichable : à vérifier (candidat free-exercise-db non vu ; WebP à créer par dev ; vérifier : fente arrière ou avant ? une photo qui contredit la consigne n'est pas affichée)
- `Barbell_Lunge/1.jpg` : affichable : à vérifier (candidat free-exercise-db non vu ; WebP à créer par dev ; idem)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet de la barre, consignes de départ) : Barbell_Lunge (niveau « intermediate » dans la base) | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db ; fichier dist/exercises.json relu le 2026-10-24 pour vérifier l'existence de l'entrée, son niveau et son matériel ; consignes réécrites par coach | base d'exercices (pratique, pas une étude) | 2026-10-24 | PROVISOIRE |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Colliers de serrage, barres de sécurité du rack réglées et testées, installation seul, objets du quotidien | regles-securite-communes.md §7 et R8 ; pratique de salle, raisonnement mécanique de coach | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul (barre lourde) | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul avec une barre est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Zones de blessures les plus fréquentes chez les haltérophiles et les pratiquants de force athlétique (colonne, épaule, genou) : justifie un tableau complet par zone | Aasa et coll., Br J Sports Med 2017;51(4):211-219, https://pubmed.ncbi.nlm.nih.gov/27707741/ ; revue systématique de 9 études, la plupart de faible qualité ; résumé lu via moteur de recherche | revue systématique, athlètes de compétition, qualité faible ; ne concerne pas les pratiquants de loisir | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 24/10/2026, à contrôler par relecteur) |
| Grossesse et post-partum : barre chargée retirée par prudence (équilibre, apnée, chute de la barre) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas la barre chargée | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, confirmée par kine le 24/10/2026 comme choix prudent, à contrôler par relecteur) |
| Amplitude complète conseillée pour le bas du corps (hypertrophie) | Schoenfeld et Grgic, SAGE Open Med 2020;8, https://pmc.ncbi.nlm.nih.gov/articles/PMC6977096 ; revue systématique de 6 études (4 sur le bas du corps) ; résumé lu via moteur de recherche | revue systématique, petit nombre d'études, une seule chez des pratiquants entraînés | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Niveau minimum, barres de sécurité et repli en cas de blocage, colliers, pas d'échec seul, cases par zone et par niveau, grossesse, remplaçants, points d'attention (kine) | Raisonnement de `kine` à partir des règles communes (regles-securite-communes.md) et des études déjà citées dans cette fiche (résumés seulement). Aucune source nouvelle lue pour cette passe ; aucune étude ne teste ces choix exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (choix prudents de kine, à contrôler par relecteur) |
