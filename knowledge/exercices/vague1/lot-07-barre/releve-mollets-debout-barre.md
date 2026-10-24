---
id: releve-mollets-debout-barre
nom: Montée sur pointes debout à la barre
alias: [standing calf raise barre]
schema: cheville_mollet
type: force
niveau_min: intermediaire
muscles_principaux: [mollets]
muscles_secondaires: []
source_brouillon: []
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| releve-mollets-debout-barre-sol | Pieds à plat sur le sol | 1 | intermediaire | barre, disques, rack | Barre sur le haut du dos comme au squat, sortie du rack, pieds à largeur du bassin, plats au sol ; barres de sécurité du rack réglées. |

## Consignes
1. Règle le rack comme pour un squat (barres de sécurité juste sous la barre quand tu fléchis légèrement les genoux, pieds à plat, en quart de squat ; testées à vide) ; sors la barre du rack en la posant sur le haut du dos et recule d'un pas, pieds à la largeur du bassin.
2. Monte sur la pointe des pieds le plus haut possible, genoux tendus mais pas verrouillés.
3. Marque un court arrêt en haut, sans balancer le buste.
4. Redescends lentement jusqu'à sentir l'étirement des mollets (talons au sol).
5. Fin de série : repose la barre sur les supports du rack.

## Points d'attention
- Charge assez légère pour sortir la barre du rack sans effort ; le mouvement reste lent, sans rebond.
- Pieds à plat sur le sol, jamais sur une plateforme avec une barre sur le dos (variante écartée par kine, Q16).
- Pose les pieds toujours à la même largeur et dans la même direction (pointes un peu ouvertes ou droit).
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Rebondir.
- Plier les genoux.
- Amplitude réduite.
- Perdre l'équilibre sur la pointe des pieds.

## Progression / régression
- plus-facile : releve-mollets, releve-mollets-halteres
- plus-dur : aucun

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE) : exercice « autre » (non pilier) : cheville et mollet (règle V-TEMPS, §3.3, ligne « hanche_laterale, cheville_mollet », NON SOURCÉ) : 10 à 15 répétitions pour un débutant, 12 à 15 pour un niveau intermédiaire ou avancé (niveau minimum de cette fiche : intermédiaire), 2 séries, repos 60 s ; le générateur ne demande pas de réserve cible pour ce schéma : la consigne est d'arrêter la série quand la technique se dégrade, et la règle de sécurité de la section ci-dessous (au moins 2 répétitions en réserve avec une barre sur le dos) reste en vigueur. Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. Étalonnage (load-calibration.md) : première séance avec la charge la plus légère disponible, puis montée par petits paliers réels de disques ; double progression. **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24, repris et corrigé par `kine` le 2026-10-24 (à contrôler par `relecteur`). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: charge:legere | retirer: remplacant:releve-mollets | retirer |
| Épaule | garder | adapter: charge:legere | retirer |
| Coude | garder | garder | retirer |
| Poignet | garder | garder | retirer |
| Genou | garder | adapter: charge:legere | retirer |
| Hanche | garder | garder | retirer |
| Cheville | adapter: charge:legere | adapter: amplitude:reduite | retirer |
| Cou | adapter: charge:legere | retirer: remplacant:releve-mollets | retirer |

**Notes**
- general : La barre seule pèse souvent 20 kg (parfois moins) : c'est déjà une charge. Si elle est trop lourde pour garder le geste propre, passe à la version aux haltères (NON SOURCÉ ; question Q12 de docs/QUESTIONS.md).
- general : niveau minimum relevé de débutant à intermédiaire par kine (barre sur le dos, comme le squat : Q18 de docs/QUESTIONS.md). La variante sur plateforme est supprimée (risque de chute avec une barre sur le dos : Q16).
- cheville-n1 : charge légère.
- cheville-n2 : amplitude réduite, montée à mi-hauteur.
- dos-n2 : barre sur le dos : retiré ; remplaçant relevé de mollets sans barre.
- cou-n1 : barre sur les muscles du haut du dos, pas sur la nuque ; charge légère.
- cou-n2 : la barre appuie sur la base du cou : retiré ; remplaçant relevé de mollets sans barre.
- grossesse : barre sur le dos et équilibre : retiré par prudence, confirmé par kine (NON SOURCÉ) ; remplaçant : relevé de mollets sans barre (près d'un mur). Post-partum : G7.

**Grossesse** : retirer: remplacant:releve-mollets
**Version plus douce** : releve-mollets

**Sécurité pour l'utilisateur seul**
- Le matériel « rack » de l'app veut dire : rack ou cage à squat avec barres de sécurité (ou goujons). Sans barres de sécurité, ne coche pas « rack » et ne fais pas cette variante.
- Rack stable, barres de sécurité réglées **avant la première série** juste sous la barre quand tu fléchis légèrement les genoux (quart de squat, pieds à plat), testées à vide avec la barre seule ; reste au centre du rack. Sortie de secours si les mollets lâchent, si tu perds l'équilibre ou si la cheville tire : pieds à plat, fléchis les genoux comme pour un quart de squat jusqu'à ce que la barre se pose sur les barres de sécurité, puis dégage-toi. Ne saute pas, ne bascule pas vers l'avant. Essaie cette manœuvre à vide avant la première série.
- Pieds à plat sur le sol, jamais sur une plateforme. Si tu perds l'équilibre : repose les talons au sol, avance vers le rack et pose la barre sur les supports.
- Charge qui te permet de sortir la barre du rack sans effort ; mouvement lent, sans rebond.
- Colliers de serrage posés et serrés des deux côtés avant chaque série, mêmes disques de chaque côté (un disque qui glisse fait basculer la barre).
- Pas d'échec : arrête la série avec au moins 2 répétitions en réserve ; si la barre ralentit nettement ou si la technique se dégrade, la série est finie. En cas de doute sur la charge, prends plus léger.
- Idéalement, quelqu'un dans la maison ou la salle, à portée de voix. Un partenaire peut aider, mais il ne remplace jamais les barres de sécurité.

**Points d'attention (kine)**
- Cheville : mouvement lent, amplitude sans gêne. Une douleur au tendon d'Achille ou sous le talon qui augmente : charge légère puis amplitude réduite (cases cheville) ; douleur : retiré.
- Dos et cou : la barre repose sur le haut du dos (comme au squat) ; la colonne porte la charge en position debout. Dos ou cou sensible : version sans barre.
- Équilibre : pieds à la largeur du bassin, regard devant, ne monte pas à la limite de l'équilibre. Pas de plateforme (chute possible avec une barre sur le dos).
- Genou : jambes tendues mais pas verrouillées ; une gêne nette du genou limite la charge.
- Niveau : intermédiaire (barre sur le dos). Le débutant fait le relevé de mollets sans barre ou aux haltères.
- Grossesse : retiré (barre sur le dos, équilibre).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente à la cheville, au mollet ou au bas du dos.
- Barre qui part de travers, disque qui glisse ou collier qui bouge : repose la barre (sur le rack ou au sol) avant tout.
- Perte de contrôle de la barre ou impression que tu ne pourras pas finir la répétition : arrête la série, ne force pas.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Crampe au mollet.
- Perte d'équilibre.
- Voile devant les yeux, vertige ou tête qui tourne en fin de série (souvent un blocage de la respiration) : repose la barre, assieds-toi, ne reprends pas la séance (R5).
- Colliers qui bougent ou disques de travers : repose la barre avant tout.
- Perte d'équilibre répétée, crampe vive au mollet qui ne passe pas : repose la barre.
- Douleur au tendon d'Achille qui augmente : arrête.

**Objets du quotidien**
- Barre et disques : colliers de serrage (clips) posés et serrés des deux côtés avant chaque série ; mêmes disques de chaque côté ; barre droite (ni tordue, ni jeu dans les manchons) ; disques jamais posés « sans collier » même pour une série légère.
- Rack ou cage à squat : stable (fixé, lesté ou contre un mur), supports de barre réglés à la bonne hauteur et bloqués ; **barres de sécurité (ou goujons) réglées AVANT la première série et testées à vide** : la barre doit pouvoir se poser dessus sans que tu sois écrasé. Pas de rack = pas de cette variante (le tag `rack` est obligatoire).
- Sol plat, sec, non glissant (planches ou tapis de salle fermes) ; chaussures fermées à semelle plate ou rigide ; espace libre autour de la barre, rien derrière toi ; jamais de pieds nus avec une barre chargée.

## Photo
- `Standing_Barbell_Calf_Raise/0.jpg` : affichable : non (pieds sur une plateforme (la consigne : pieds à plat au sol, plateforme supprimée) ; la photo ne montre pas de barres de sécurité réglées, que la fiche exige : la consigne prime)
- `Standing_Barbell_Calf_Raise/1.jpg` : affichable : non (pieds sur une plateforme (la consigne : pieds à plat au sol, plateforme supprimée) ; la photo ne montre pas de barres de sécurité réglées, que la fiche exige : la consigne prime)
- illustration : public/illustrations/releve-mollets-debout-barre.svg : affichable : oui (illustration originale de l'app, 24/10/2026 ; Relevé de mollets debout, vue de profil : barre sur le haut du dos, pieds à plat puis pointe des pieds, rack avec barres de sécurité jaunes, réglées juste sous la barre en quart de squat ; alignée sur la fiche le 24/10/2026)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet de la barre, consignes de départ) : Standing_Barbell_Calf_Raise (niveau « beginner » dans la base) | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db ; fichier dist/exercises.json relu le 2026-10-24 pour vérifier l'existence de l'entrée, son niveau et son matériel ; consignes réécrites par coach | base d'exercices (pratique, pas une étude) | 2026-10-24 | PROVISOIRE |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Colliers de serrage, barres de sécurité du rack réglées et testées, installation seul, objets du quotidien | regles-securite-communes.md §7 et R8 ; pratique de salle, raisonnement mécanique de coach | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul (barre lourde) | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul avec une barre est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Zones de blessures les plus fréquentes chez les haltérophiles et les pratiquants de force athlétique (colonne, épaule, genou) : justifie un tableau complet par zone | Aasa et coll., Br J Sports Med 2017;51(4):211-219, https://pubmed.ncbi.nlm.nih.gov/27707741/ ; revue systématique de 9 études, la plupart de faible qualité ; résumé lu via moteur de recherche | revue systématique, athlètes de compétition, qualité faible ; ne concerne pas les pratiquants de loisir | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 24/10/2026, à contrôler par relecteur) |
| Grossesse et post-partum : barre chargée retirée par prudence (équilibre, apnée, chute de la barre) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas la barre chargée | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, confirmée par kine le 24/10/2026 comme choix prudent, à contrôler par relecteur) |
| Amplitude complète conseillée pour la croissance musculaire | Schoenfeld et Grgic, SAGE Open Med 2020;8, https://pmc.ncbi.nlm.nih.gov/articles/PMC6977096 ; revue systématique de 6 études (4 sur le bas du corps, 2 sur le haut) ; résumé lu via moteur de recherche | revue systématique ; pour le haut du corps : données limitées et contradictoires | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Niveau minimum, barres de sécurité et repli en cas de blocage, colliers, pas d'échec seul, cases par zone et par niveau, grossesse, remplaçants, points d'attention (kine) | Raisonnement de `kine` à partir des règles communes (regles-securite-communes.md) et des études déjà citées dans cette fiche (résumés seulement). Aucune source nouvelle lue pour cette passe ; aucune étude ne teste ces choix exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (choix prudents de kine, à contrôler par relecteur) |
