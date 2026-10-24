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
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| lancer-rotation-mur-pieds-fixes | Pieds fixes, sans pivot | 1 | intermediaire | medecine_ball, mur | Debout de côté à au moins deux mètres d'un mur plein (environ trois grands pas), pieds à plat à la largeur des épaules, ballon tenu près de la hanche arrière ; les pieds restent à plat et ne bougent pas, la rotation reste courte et vient du buste : les genoux ne tournent pas, ils restent dans la direction des orteils. |
| lancer-rotation-mur-pivot | Avec pivot du pied arrière | 2 | avance | medecine_ball, mur | Même position à au moins deux mètres ; le pied arrière tourne sur lui-même (talon qui se lève) avec les hanches pendant le lancer, sans quitter le sol ni sauter : le genou suit le pied, il ne se tord jamais. |

## Consignes
1. Place-toi de côté par rapport à un mur plein, à au moins deux mètres (environ trois grands pas), pieds à plat à la largeur des épaules, genoux légèrement fléchis.
2. Tiens le ballon à deux mains près de la hanche du côté opposé au mur, bras presque tendus, ventre serré.
3. Tourne le buste (avec les hanches si tu pivotes), puis les bras, et lance le ballon contre le mur à hauteur de poitrine ; les pieds ne sautent pas. Pieds fixes : rotation courte, genoux dans la direction des orteils. Avec pivot : le talon arrière se lève et le genou suit le pied.
4. Laisse le ballon rebondir et retomber, puis ramasse-le en pliant les genoux, dos droit.
5. Fais toutes les répétitions d'un côté, puis change de côté en te plaçant de l'autre côté du mur.

## Points d'attention
- La rotation vient du buste (et des hanches avec le pivot) : pas seulement des bras.
- Règle unique pour le genou : il ne se tord jamais. Soit le pied pivote avec le genou (variante pivot), soit les pieds restent à plat et la rotation reste courte, sans que le genou tourne (variante pieds fixes).
- Pas de saut : un pied qui pivote reste en contact avec le sol (seul le talon se lève).
- Pas de rattrapage au départ : ramasse le ballon.
- Lancer à vitesse maîtrisée ; une fatigue marquée en rotation du tronc = arrête.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Bras seuls, sans rotation des hanches.
- Genou qui se tord : pied planté avec une rotation trop grande, ou pivot qui ne suit pas le genou.
- Ballon trop lourd.
- Dos qui se creuse.
- Trop près du mur (moins de deux mètres).

## Progression / régression
- plus-facile : rotation-bucheron, pallof-elastique
- plus-dur : aucun

## Repères de dosage
Repères du générateur (generateur-v1.md §3.3, règle V-TEMPS, NON SOURCÉ en entier) : 8 à 10 répétitions par côté (débutant) puis 10 à 12, 2 séries, repos 60 s, pas de réserve demandée : la série s'arrête dès que la position ou le contrôle se dégrade. Ici ce sont des lancers : s'arrêter dès que la vitesse baisse, même avant le nombre de répétitions prévu (NON SOURCÉ). Étalonnage (load-calibration.md) : première séance avec la variante la plus facile ou la charge la plus légère disponible ; double progression (d'abord les répétitions ou la durée, puis l'échelon ou le palier suivant). **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24, repris et corrigé par `kine` le 2026-10-24 (à contrôler par `relecteur`). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

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
- dos-n2 : retiré : rotation rapide du tronc sous charge (choix prudent, NON SOURCÉ) ; le bûcheron (rotation-bucheron) est lui-même adapté puis retiré par le dos : aucun remplaçant fixe, le générateur choisit un autre exercice du schéma rotation qui convient (regles-securite-communes.md §0).
- genou-n1 : pieds fixes, ballon léger, rotation courte ; le genou ne tourne pas (pas de pivot).
- hanche-n1 : pieds fixes, rotation courte (pas de pivot).
- hanche-n2 : pieds fixes, rotation courte, aucune augmentation (R2).
- grossesse : retiré : rotation rapide du tronc, ballon projeté puis rebond vers l'abdomen (G4, extrapolation) ; remplaçant : bûcheron sans charge. Post-partum : G7.

**Grossesse** : retirer: remplacant:rotation-bucheron-sans-charge
**Version plus douce** : rotation-bucheron

**Sécurité pour l'utilisateur seul**
- Mur plein et solide, à au moins deux mètres de toi (environ trois grands pas), pour toutes les variantes ; vise le mur à hauteur de poitrine ; personne, animal ni obstacle de chaque côté ni dans l'axe du rebond ; sol non glissant (NON SOURCÉ).
- Les pieds sont chaussés (chaussures fermées à semelle qui accroche) et ne glissent pas, surtout pour la variante avec pivot. Règle du genou, la même partout : il ne se tord jamais. Avec pivot, le talon du pied arrière se lève et le genou suit le pied ; pieds fixes, la rotation reste courte et le genou ne tourne pas.
- Ballon léger au début, jamais rattrapé : laisse-le rebondir et retomber, puis ramasse-le en pliant les genoux, dos droit (pas de rattrapage risqué). S'il rebondit vers toi, laisse-le passer et protège ton visage avec les avant-bras.
- Sortie de secours : au moindre déséquilibre ou tiraillement, lâche le ballon, pose les deux pieds à plat et arrête la série ; ne cherche pas à rattraper un ballon qui part.
- Quelqu'un dans la maison, à portée de voix, de préférence.

**Points d'attention (kine)**
- Dos : rotation rapide du tronc sous charge ; dès la gêne légère, pieds fixes, rotation courte et ballon le plus léger (choix de kine, NON SOURCÉ) ; retiré dès la gêne nette.
- Genou et hanche : pivot du pied arrière réservé à ceux qui n'ont aucune gêne ; avec une gêne légère, pieds fixes mais rotation courte, le genou ne tourne pas (choix de kine, NON SOURCÉ).
- Ischios, aine : un tiraillement à l'arrière de la cuisse ou à l'aine en tournant = arrêt (ligne aine du tableau ; la ligne cuisse n'est pas nécessaire, les ischios sont peu sollicités).
- Épaule, coude : le lancer accélère le bras ; dès la gêne nette, pieds fixes, dès la douleur retiré.
- Grossesse et post-partum : retiré (rotation rapide du tronc, rebond vers l'abdomen) ; en post-partum, fuite d'urine ou pesanteur dans le bas-ventre : arrêt et avis de la sage-femme (G7).
- Niveau : intermédiaire minimum pour les pieds fixes, avancé pour le pivot (choix de kine, NON SOURCÉ).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au bas du dos, à la hanche, au genou ou à l'épaule.
- Ballon qui part de travers, glisse des mains ou rebondit vers le visage : arrête et reprends avec un ballon plus léger ou plus de distance.
- Torsion ou tiraillement du genou (pied planté ou pivot) : arrête la série. Si tu étais en pivot, ne reprends qu'en pieds fixes avec une rotation courte ; si cela revient, arrête l'exercice.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe : arrête.

**Objets du quotidien**
- Ballon lesté (medicine ball) : sans fissure, sans fuite de sable, surface sèche et pas glissante ; choisis le ballon le plus léger que tu as pour apprendre le geste (le poids n'est pas connu de l'app, NON SOURCÉ).
- Mur : plein, solide, lisse, sans vitre, cadre, radiateur, prise ni miroir à portée du ballon ; rien de fragile derrière ou à côté de toi.
- Sol plat, sec, non glissant ; chaussures fermées à semelle plate ; personne ni animal dans la trajectoire du ballon et de son rebond ; espace libre autour de toi.
- Un ballon qui rebondit fort revient vite vers le visage : choisis un ballon peu rebondissant si tu as le choix, et garde de la distance (NON SOURCÉ).

## Photo
- aucune photo
- illustration : public/illustrations/lancer-rotation-mur.svg : affichable : oui (illustration originale de l'app, 24/10/2026 ; vue de face, mur à droite : ballon près de la hanche arrière, puis rotation et lancer à hauteur de poitrine, pieds au sol)
- légende : Variante pieds fixes. La variante avec pivot du pied arrière n'est pas dessinée.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet, consignes de départ) | aucune entrée de free-exercise-db ne correspond (vérifié dans dist/exercises.json le 2026-10-24) ; geste décrit par coach d'après la pratique courante | pratique (pas une étude) | 2026-10-24 | NON SOURCÉ |
| Entraînement au ballon lesté (lancers) : peut améliorer la vitesse de lancer chez des sportifs ; se pratique pour la puissance, pas pour la force maximale | Raeder, Fernandez-Fernandez, Ferrauti, J Strength Cond Res 2015;29(7):1904-1914, DOI 10.1519/JSC.0000000000000847 (6 semaines, joueuses de handball) ; Earp et Kraemer, Strength Cond J 2010;32(4):20-25, DOI 10.1519/SSC.0b013e3181e92911 ; seuls le titre, les références et un résumé bref lus via moteur de recherche (résultats chiffrés de Raeder non lus) | étude d'entraînement sur des sportives de handball (public différent d'un adulte de loisir) ; article de synthèse (avis d'experts) | 2026-10-24 | PROVISOIRE (résumé seulement) ; extrapolation à l'adulte de loisir : NON SOURCÉ |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Ballon lesté (poids, état), mur, rebond, espace libre | pratique de salle et raisonnement de coach ; aucune notice de fabricant lue | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 2026-10-24, à contrôler par relecteur) |
| Grossesse et post-partum : lancer rotatif retiré (rotation rapide, rebond vers l'abdomen) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe (éviter isométrique prolongé, Valsalva, chute, couché sur le dos) : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, confirmé par kine, NON SOURCÉ) |
