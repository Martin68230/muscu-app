---
id: lancer-bas-haut-mur
nom: Lancer de bas en haut contre un mur
alias: [scoop throw sans saut, lancer des hanches]
schema: charniere
type: fonctionnel
niveau_min: intermediaire
muscles_principaux: [fessiers, ischios]
muscles_secondaires: [quadriceps, erecteurs_rachis, deltoides_anterieurs, mollets]
source_brouillon: []
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| lancer-bas-haut-mur-pieds-a-plat | Pieds à plat, sans saut | 1 | intermediaire | medecine_ball, mur | Debout face à un mur plein à environ deux grands pas, ballon tenu à deux mains entre les jambes à hauteur de genoux, hanches en arrière ; les pieds restent au sol. |

## Consignes
1. Place-toi face à un mur plein à environ deux grands pas, pieds à la largeur des épaules, genoux légèrement fléchis.
2. Pousse les hanches en arrière, dos plat, ballon tenu à deux mains entre les jambes, au niveau des genoux, bras tendus.
3. Pousse les hanches vers l'avant en te redressant et lance le ballon vers l'avant et vers le haut, contre le mur, bras tendus ; tes pieds restent au sol.
4. Laisse le ballon rebondir et rouler, puis ramasse-le en pliant les genoux, dos droit.
5. Recommence à vitesse maîtrisée ; arrête la série quand la vitesse baisse.

## Points d'attention
- La puissance vient de la poussée des hanches, pas du dos ni des bras.
- Le dos reste plat à la descente et ne se cambre pas à la fin du geste.
- L'entrée de la base décrit un saut avec un lancer vers l'arrière : ici aucun saut, et le lancer part vers un mur devant toi (règle du projet).
- Le lancer part vers le mur à hauteur de la poitrine, pas au-dessus de la tête.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Dos qui s'arrondit en bas.
- Cambrure en haut du lancer.
- Saut ou pied qui décolle.
- Ballon lancé trop haut.
- Ballon trop lourd.

## Progression / régression
- plus-facile : souleve-de-terre-roumain-halteres, pont-fessier
- plus-dur : aucun

## Repères de dosage
Aucune ligne du générateur ne couvre les lancers au ballon lesté (generateur-v1.md §3.2 et §3.3). Repère prudent de coach, NON SOURCÉ, à valider par kine et par l'utilisateur : 2 séries de 6 à 8 lancers, repos 60 à 90 s, pas de réserve chiffrée ; la série s'arrête dès que la vitesse du lancer baisse ou que la posture se dégrade (un lancer fatigué n'est plus un lancer de puissance). Note pour dev : le tag medecine_ball n'est pas dans la liste « chargeable » de V-DOSE ; ce mouvement doit être classé comme un exercice de puissance, pas comme un exercice de répétitions 10 à 15. Étalonnage (load-calibration.md) : première séance avec la variante la plus facile ou la charge la plus légère disponible ; double progression (d'abord les répétitions ou la durée, puis l'échelon ou le palier suivant). **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24, repris et corrigé par `kine` le 2026-10-24 (à contrôler par `relecteur`). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: amplitude:reduite | retirer | retirer |
| Épaule | garder | adapter: amplitude:bras-bas | retirer |
| Hanche | garder | adapter: amplitude:reduite | retirer |
| Genou | garder | adapter: amplitude:reduite | retirer |
| Cheville | garder | adapter: amplitude:reduite | retirer |
| Cou | garder | adapter: amplitude:tete-alignee | retirer |
| Cuisse | adapter: amplitude:reduite | retirer | retirer |
| Aine | garder | adapter: amplitude:reduite | retirer |

**Notes**
- general : Charnière de hanche avec geste explosif, sans saut : niveau intermédiaire minimum.
- dos-n1 : descente moins profonde, ballon plus léger ; retiré dès le niveau 2.
- dos-n2 : retiré : charnière de hanche rapide avec charge (choix prudent, NON SOURCÉ).
- cuisse-n1 : descente moins profonde (ischios principaux).
- cuisse-n2 : retiré : ischios principaux, geste explosif (choix prudent, NON SOURCÉ).
- epaule-n2 : lancer à hauteur de la poitrine, jamais plus haut.
- grossesse : retiré : charnière rapide avec ballon contre les jambes, geste explosif (choix prudent, NON SOURCÉ) ; remplaçant : roumain aux haltères (charge légère). Post-partum : G7.

**Grossesse** : retirer: remplacant:souleve-de-terre-roumain-halteres
**Version plus douce** : souleve-de-terre-roumain-halteres

**Sécurité pour l'utilisateur seul**
- Mur plein et solide, à au moins deux mètres de toi (environ trois grands pas) ; vise le mur à hauteur de la poitrine ; sol non glissant, chaussures fermées à semelle qui accroche ; personne, animal ni objet fragile devant toi (NON SOURCÉ).
- Ne lance pas par-dessus la tête ni vers l'arrière : le ballon part vers le mur, devant toi.
- Ballon léger : le dos ne doit pas s'arrondir en bas ni se cambrer en haut. Le ballon ne se rattrape pas : laisse-le rebondir et retomber, protège ton visage avec les avant-bras s'il revient vers toi, puis ramasse-le en pliant les genoux, dos droit.
- Sortie de secours : si le dos tire ou si tu perds l'équilibre, lâche le ballon vers le bas devant toi (pas vers tes pieds), pose les deux pieds à plat et arrête la série ; ne cherche pas à rattraper un ballon qui part.
- Quelqu'un dans la maison, à portée de voix, de préférence.

**Points d'attention (kine)**
- Dos : charnière de hanche rapide ; dos plat, amplitude réduite dès la première gêne, retiré dès la gêne nette (choix de kine, NON SOURCÉ).
- Cuisse (ischios) : principaux muscles du geste, geste explosif : niveau 2 retire.
- Épaule : bras tendus, lancer à hauteur de la poitrine ; dès la gêne nette, bras bas.
- Grossesse et post-partum : retiré (charnière rapide, geste explosif, rebond) ; en post-partum, fuite d'urine ou pesanteur dans le bas-ventre : arrêt et avis de la sage-femme (G7).
- Niveau : intermédiaire minimum (la charnière aux haltères et le pont fessier couvrent le débutant), choix de kine, NON SOURCÉ.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au bas du dos, à la hanche, à l'arrière de la cuisse ou à l'épaule.
- Ballon qui part de travers, glisse des mains ou rebondit vers le visage : arrête et reprends avec un ballon plus léger ou plus de distance.
- Tiraillement vif à l'arrière de la cuisse : arrête.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe : arrête.

**Objets du quotidien**
- Ballon lesté (medicine ball) : sans fissure, sans fuite de sable, surface sèche et pas glissante ; choisis le ballon le plus léger que tu as pour apprendre le geste (le poids n'est pas connu de l'app, NON SOURCÉ).
- Mur : plein, solide, lisse, sans vitre, cadre, radiateur, prise ni miroir à portée du ballon ; rien de fragile derrière ou à côté de toi.
- Sol plat, sec, non glissant ; chaussures fermées à semelle plate ; personne ni animal dans la trajectoire du ballon et de son rebond ; espace libre autour de toi.
- Un ballon qui rebondit fort revient vite vers le visage : choisis un ballon peu rebondissant si tu as le choix, et garde de la distance (NON SOURCÉ).

## Photo
- `Medicine_Ball_Scoop_Throw/0.jpg` : affichable : à vérifier (image non vue le 2026-10-24 ; l'entrée décrit un lancer avec saut, que la fiche exclut : ne l'afficher que si la personne garde les pieds au sol)
- `Medicine_Ball_Scoop_Throw/1.jpg` : affichable : à vérifier (image non vue le 2026-10-24 ; à vérifier comme la précédente (saut possible sur l'image))

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet, consignes de départ) : Medicine_Ball_Scoop_Throw (niveau « beginner », matériel « medicine ball ») ; la base décrit un saut et un lancer vers l'arrière ; nous gardons le geste sans saut, vers un mur devant soi | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db ; fichier dist/exercises.json relu le 2026-10-24 pour vérifier l'existence de l'entrée, son niveau et son matériel ; consignes réécrites par coach | base d'exercices (pratique, pas une étude) | 2026-10-24 | PROVISOIRE |
| Entraînement au ballon lesté (lancers) : peut améliorer la vitesse de lancer chez des sportifs ; se pratique pour la puissance, pas pour la force maximale | Raeder, Fernandez-Fernandez, Ferrauti, J Strength Cond Res 2015;29(7):1904-1914, DOI 10.1519/JSC.0000000000000847 (6 semaines, joueuses de handball) ; Earp et Kraemer, Strength Cond J 2010;32(4):20-25, DOI 10.1519/SSC.0b013e3181e92911 ; seuls le titre, les références et un résumé bref lus via moteur de recherche (résultats chiffrés de Raeder non lus) | étude d'entraînement sur des sportives de handball (public différent d'un adulte de loisir) ; article de synthèse (avis d'experts) | 2026-10-24 | PROVISOIRE (résumé seulement) ; extrapolation à l'adulte de loisir : NON SOURCÉ |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Ballon lesté (poids, état), mur, rebond, espace libre | pratique de salle et raisonnement de coach ; aucune notice de fabricant lue | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 2026-10-24, à contrôler par relecteur) |
| Grossesse et post-partum : lancer de bas en haut retiré (charnière rapide, geste explosif) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe (éviter isométrique prolongé, Valsalva, chute, couché sur le dos) : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, confirmé par kine, NON SOURCÉ) |
