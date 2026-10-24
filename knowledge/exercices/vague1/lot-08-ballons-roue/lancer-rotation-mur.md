---
id: lancer-rotation-mur
nom: Lancer en rotation contre un mur
alias: [rotational throw, lancer de côté]
schema: rotation
type: fonctionnel
niveau_min: intermediaire
muscles_principaux: [obliques]
muscles_secondaires: [abdominaux, fessiers, deltoides_anterieurs, pectoraux]
source_brouillon: []
statut: brouillon_coach
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| lancer-rotation-mur-pieds-fixes | Pieds fixes, sans pivot | 1 | intermediaire | medecine_ball, mur | Debout de côté à environ deux grands pas d'un mur plein, pieds à plat à la largeur des épaules, ballon tenu près de la hanche arrière ; les pieds restent plantés. |
| lancer-rotation-mur-pivot | Avec pivot du pied arrière | 2 | avance | medecine_ball, mur | Même position ; le pied arrière tourne sur lui-même (talon qui se lève) pendant le lancer, sans quitter le sol ni sauter. |

## Consignes
1. Place-toi de côté par rapport à un mur plein, à environ deux grands pas, pieds à plat à la largeur des épaules, genoux légèrement fléchis.
2. Tiens le ballon à deux mains près de la hanche du côté opposé au mur, bras presque tendus, ventre serré.
3. Tourne les hanches, puis le buste, puis les bras, et lance le ballon contre le mur à hauteur de poitrine ; les pieds ne sautent pas.
4. Laisse le ballon rebondir et retomber, puis ramasse-le en pliant les genoux, dos droit.
5. Fais toutes les répétitions d'un côté, puis change de côté en te plaçant de l'autre côté du mur.

## Points d'attention
- La rotation vient d'abord des hanches, puis du buste : pas seulement des bras.
- Pas de saut : un pied qui pivote reste en contact avec le sol.
- Pas de rattrapage au départ : ramasse le ballon.
- Lancer à vitesse maîtrisée ; une fatigue marquée en rotation du tronc = arrête.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Bras seuls, sans rotation des hanches.
- Genou qui se tord pied planté.
- Ballon trop lourd.
- Dos qui se creuse.
- Trop près du mur.

## Progression / régression
- plus-facile : rotation-bucheron, pallof-elastique
- plus-dur : aucun

## Repères de dosage
Repères du générateur (generateur-v1.md §3.3, règle V-TEMPS, NON SOURCÉ en entier) : 8 à 10 répétitions par côté (débutant) puis 10 à 12, 2 séries, repos 60 s, pas de réserve demandée : la série s'arrête dès que la position ou le contrôle se dégrade. Ici ce sont des lancers : s'arrêter dès que la vitesse baisse, même avant le nombre de répétitions prévu (NON SOURCÉ). Étalonnage (load-calibration.md) : première séance avec la variante la plus facile ou la charge la plus légère disponible ; double progression (d'abord les répétitions ou la durée, puis l'échelon ou le palier suivant). **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24 (à reprendre par `kine`, puis à contrôler par `relecteur`). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: variante:lancer-rotation-mur-pieds-fixes | retirer | retirer |
| Épaule | garder | adapter: variante:lancer-rotation-mur-pieds-fixes | retirer |
| Coude | garder | adapter: variante:lancer-rotation-mur-pieds-fixes | retirer |
| Poignet | garder | adapter: variante:lancer-rotation-mur-pieds-fixes | retirer |
| Hanche | adapter: variante:lancer-rotation-mur-pieds-fixes | adapter: variante:lancer-rotation-mur-pieds-fixes | retirer |
| Genou | adapter: variante:lancer-rotation-mur-pieds-fixes | retirer | retirer |
| Cheville | garder | adapter: variante:lancer-rotation-mur-pieds-fixes | retirer |
| Cou | garder | adapter: amplitude:tete-alignee | retirer |
| Aine | garder | adapter: amplitude:reduite | retirer |

**Notes**
- general : Rotation du tronc sous charge, geste explosif : niveau intermédiaire minimum. Aucun saut.
- dos-n1 : pieds fixes, ballon léger, rotation modérée ; retiré dès le niveau 2.
- dos-n2 : retiré : rotation rapide du tronc sous charge (choix prudent, NON SOURCÉ) ; la rotation du bûcheron au poids du corps reste possible pour les niveaux de dos faibles via rotation-bucheron.
- genou-n1 : pieds fixes : pas de pivot sur le genou.
- hanche-n1 : pieds fixes.
- hanche-n2 : pieds fixes, aucune augmentation (R2).
- grossesse : retiré : rotation rapide du tronc, ballon projeté puis rebond vers l'abdomen (G4, extrapolation) ; remplaçant : bûcheron sans charge. Post-partum : G7.

**Grossesse** : retirer: remplacant:rotation-bucheron-sans-charge
**Version plus douce** : rotation-bucheron

**Sécurité pour l'utilisateur seul**
- Mur plein, distance de deux grands pas ou plus ; personne ni obstacle de chaque côté ; sol non glissant.
- Les pieds sont chaussés et ne glissent pas, surtout pour la variante avec pivot.
- Ballon léger au début ; si le ballon rebondit vers toi, laisse-le passer.

**Points d'attention (sécurité)**
- Dos : rotation rapide du tronc sous charge ; retiré dès la gêne nette.
- Genou et hanche : pivot du pied arrière réservé à ceux qui n'ont aucune gêne.
- Grossesse et post-partum : retiré.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au bas du dos, à la hanche, au genou ou à l'épaule.
- Ballon qui part de travers, glisse des mains ou rebondit vers le visage : arrête et reprends avec un ballon plus léger ou plus de distance.
- Torsion du genou pied planté : arrête et passe à la variante pieds fixes.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe : arrête.

**Objets du quotidien**
- Ballon lesté (medicine ball) : sans fissure, sans fuite de sable, surface sèche et pas glissante ; choisis le ballon le plus léger que tu as pour apprendre le geste (le poids n'est pas connu de l'app, NON SOURCÉ).
- Mur : plein, solide, lisse, sans vitre, cadre, radiateur, prise ni miroir à portée du ballon ; rien de fragile derrière ou à côté de toi.
- Sol plat, sec, non glissant ; chaussures fermées à semelle plate ; personne ni animal dans la trajectoire du ballon et de son rebond ; espace libre autour de toi.
- Un ballon qui rebondit fort revient vite vers le visage : choisis un ballon peu rebondissant si tu as le choix, et garde de la distance (NON SOURCÉ).

## Photo
- aucune photo

Illustration à faire par `dev` : lancer de côté contre un mur, vue de face : départ hanche arrière puis lancer ; aucune entrée de free-exercise-db ne correspond (Medicine_Ball_Full_Twist est une passe en duo, dos à dos).

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet, consignes de départ) | aucune entrée de free-exercise-db ne correspond (vérifié dans dist/exercises.json le 2026-10-24) ; geste décrit par coach d'après la pratique courante | pratique (pas une étude) | 2026-10-24 | NON SOURCÉ |
| Entraînement au ballon lesté (lancers) : peut améliorer la vitesse de lancer chez des sportifs ; se pratique pour la puissance, pas pour la force maximale | Raeder, Fernandez-Fernandez, Ferrauti, J Strength Cond Res 2015;29(7):1904-1914, DOI 10.1519/JSC.0000000000000847 (6 semaines, joueuses de handball) ; Earp et Kraemer, Strength Cond J 2010;32(4):20-25, DOI 10.1519/SSC.0b013e3181e92911 ; seuls le titre, les références et un résumé bref lus via moteur de recherche (résultats chiffrés de Raeder non lus) | étude d'entraînement sur des sportives de handball (public différent d'un adulte de loisir) ; article de synthèse (avis d'experts) | 2026-10-24 | PROVISOIRE (résumé seulement) ; extrapolation à l'adulte de loisir : NON SOURCÉ |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Ballon lesté (poids, état), mur, rebond, espace libre | pratique de salle et raisonnement de coach ; aucune notice de fabricant lue | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (à reprendre par kine, puis à contrôler par relecteur) |
| Grossesse et post-partum : lancer rotatif retiré (rotation rapide, rebond vers l'abdomen) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe (éviter isométrique prolongé, Valsalva, chute, couché sur le dos) : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, à confirmer par kine) |
