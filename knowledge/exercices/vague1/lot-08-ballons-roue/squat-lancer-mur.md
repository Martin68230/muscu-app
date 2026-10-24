---
id: squat-lancer-mur
nom: Squat et lancer de ballon contre un mur
alias: [wall ball sans saut, thruster ballon]
schema: squat
type: fonctionnel
niveau_min: intermediaire
muscles_principaux: [quadriceps, fessiers]
muscles_secondaires: [deltoides_anterieurs, triceps, pectoraux, abdominaux]
source_brouillon: []
statut: brouillon_coach
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| squat-lancer-mur-pieds-a-plat | Lancer de poitrine en remontant, pieds à plat | 1 | intermediaire | medecine_ball, mur | Debout face à un mur plein à environ deux grands pas, ballon contre la poitrine ; tu descends en squat, puis tu remontes en poussant le ballon contre le mur, les pieds restent au sol. |

## Consignes
1. Place-toi face à un mur plein à environ deux grands pas, pieds un peu plus larges que les épaules, ballon contre la poitrine.
2. Descends en squat, dos droit, genoux dans l'axe des pieds, ballon contre la poitrine.
3. Remonte en poussant sur les talons, et pousse le ballon droit devant toi contre le mur en tendant les bras ; tes pieds ne sautent pas.
4. Laisse le ballon rebondir et retomber, puis ramasse-le en pliant les genoux, dos droit.
5. Recommence à vitesse maîtrisée ; arrête la série quand la vitesse baisse.

## Points d'attention
- Aucun saut : les pieds restent au sol, tu peux te hisser à peine sur les orteils à la fin de la poussée.
- Le dos reste droit en bas et en haut.
- Ballon le plus léger au début.
- Le lancer part de la poitrine, pas au-dessus de la tête.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Dos qui s'arrondit en bas.
- Saut ou pas lancé.
- Genoux qui rentrent.
- Ballon lancé trop haut.
- Trop près du mur.

## Progression / régression
- plus-facile : squat-ballon-lest, lancer-poitrine-mur
- plus-dur : aucun

## Repères de dosage
Aucune ligne du générateur ne couvre les lancers au ballon lesté (generateur-v1.md §3.2 et §3.3). Repère prudent de coach, NON SOURCÉ, à valider par kine et par l'utilisateur : 2 séries de 6 à 8 lancers, repos 60 à 90 s, pas de réserve chiffrée ; la série s'arrête dès que la vitesse du lancer baisse ou que la posture se dégrade (un lancer fatigué n'est plus un lancer de puissance). Note pour dev : le tag medecine_ball n'est pas dans la liste « chargeable » de V-DOSE ; ce mouvement doit être classé comme un exercice de puissance, pas comme un exercice de répétitions 10 à 15. Étalonnage (load-calibration.md) : première séance avec la variante la plus facile ou la charge la plus légère disponible ; double progression (d'abord les répétitions ou la durée, puis l'échelon ou le palier suivant). **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24 (à reprendre par `kine`, puis à contrôler par `relecteur`). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: variante:squat-lancer-mur-pieds-a-plat | retirer | retirer |
| Épaule | garder | adapter: amplitude:bras-bas | retirer |
| Coude | garder | adapter: amplitude:reduite | retirer |
| Poignet | garder | adapter: amplitude:reduite | retirer |
| Hanche | garder | adapter: amplitude:reduite | retirer |
| Genou | garder | adapter: amplitude:reduite | retirer |
| Cheville | garder | adapter: amplitude:reduite | retirer |
| Cuisse | garder | adapter: amplitude:reduite | retirer |
| Aine | garder | adapter: amplitude:reduite | retirer |

**Notes**
- general : Squat rapide avec lancer, sans saut : niveau intermédiaire minimum.
- dos-n1 : squat moins profond, ballon léger ; retiré dès le niveau 2.
- epaule-n2 : lancer à hauteur de la poitrine, jamais plus haut.
- cuisse-n2 : choix prudent, NON SOURCÉ.
- aine-n2 : idem (NON SOURCÉ).
- grossesse : retiré : lancer explosif avec ballon vers le ventre, choix prudent (NON SOURCÉ) ; remplaçant : squat gobelet (charge légère). Post-partum : G7.

**Grossesse** : retirer: remplacant:squat-gobelet
**Version plus douce** : squat-ballon-lest

**Sécurité pour l'utilisateur seul**
- Mur plein à deux grands pas ou plus ; sol non glissant ; chaussures à semelle qui accroche.
- Ne rattrape pas un ballon qui revient trop vite.
- Pas d'échec ni de série menée à fatigue : la technique d'abord.

**Points d'attention (sécurité)**
- Genou et dos : squat rapide avec charge légère ; amplitude réduite dès la première gêne.
- Épaule : lancer à hauteur de la poitrine, jamais plus haut.
- Grossesse et post-partum : retiré.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au genou, à la hanche, au bas du dos ou à l'épaule.
- Ballon qui part de travers, glisse des mains ou rebondit vers le visage : arrête et reprends avec un ballon plus léger ou plus de distance.
- Dos qui s'arrondit dans le squat : arrête.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe : arrête.

**Objets du quotidien**
- Ballon lesté (medicine ball) : sans fissure, sans fuite de sable, surface sèche et pas glissante ; choisis le ballon le plus léger que tu as pour apprendre le geste (le poids n'est pas connu de l'app, NON SOURCÉ).
- Mur : plein, solide, lisse, sans vitre, cadre, radiateur, prise ni miroir à portée du ballon ; rien de fragile derrière ou à côté de toi.
- Sol plat, sec, non glissant ; chaussures fermées à semelle plate ; personne ni animal dans la trajectoire du ballon et de son rebond ; espace libre autour de toi.
- Un ballon qui rebondit fort revient vite vers le visage : choisis un ballon peu rebondissant si tu as le choix, et garde de la distance (NON SOURCÉ).

## Photo
- aucune photo

Illustration à faire par `dev` : squat puis lancer de poitrine contre un mur, vue de profil ; aucune entrée de free-exercise-db ne correspond.

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
| Grossesse et post-partum : squat et lancer retirés (geste explosif, ballon vers le ventre) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe (éviter isométrique prolongé, Valsalva, chute, couché sur le dos) : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, à confirmer par kine) |
