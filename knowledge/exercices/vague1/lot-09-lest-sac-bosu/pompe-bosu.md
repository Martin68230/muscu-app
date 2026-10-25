---
id: pompe-bosu
nom: Pompe avec les mains sur un bosu
alias: [bosu push-up]
schema: poussee_h
type: force
niveau_min: intermediaire
muscles_principaux: [pectoraux]
muscles_secondaires: [triceps, deltoides_anterieurs, abdominaux, dentele_anterieur]
source_brouillon: []
statut: brouillon_coach
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| pompe-bosu-genoux | Mains sur le dôme, genoux au sol | 1 | intermediaire | bosu, tapis, mur | Bosu côté dôme vers le haut, calé contre un mur plein ; mains sur le dôme sous les épaules, genoux sur un tapis, corps en ligne des genoux aux épaules. |
| pompe-bosu-pieds | Mains sur le dôme, pointes de pieds | 2 | intermediaire | bosu, tapis, mur | Même installation, genoux levés, pointes de pieds sur le tapis, corps en ligne. |

## Consignes
1. Pose le bosu côté dôme vers le haut, calé contre un mur plein, sur un sol plat et non glissant ; un tapis ferme pour les genoux ou les pieds.
2. Pose les mains sur le dôme, sous les épaules, doigts vers l'avant, corps en ligne, regard entre les mains.
3. Descends en pliant les coudes (environ 45 degrés du corps) sans aller jusqu'au bout, la poitrine reste au-dessus du dôme.
4. Pousse pour remonter, bras presque tendus sans verrouiller, en gardant le corps en ligne.
5. Fais des répétitions lentes. Respire sans bloquer ; arrête la série dès que le bosu bouge trop.

## Points d'attention
- Le bosu sert au contrôle, pas à la force : moins d'amplitude que la pompe au sol.
- Mains sur le dôme : les poignets sont un peu en arrière ; si ça tire, sol plat.
- Le bosu ne glisse pas : mur plein derrière lui, sol non glissant.
- Le côté plat vers le haut n'est pas proposé (chute vers le visage, voir Q27).
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Bassin qui tombe.
- Coudes écartés à 90 degrés.
- Tête qui tombe.
- Bosu qui glisse.
- Descendre en chute.

## Progression / régression
- plus-facile : pompe-mur, pompe-chaise, pompe-genoux
- plus-dur : pompe-bosu-pieds, pompe-sol

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE ; ACSM 2026 : 2 à 3 séries par exercice) : exercice sans charge extérieure (aucun tag de la liste « chargeable ») : 10 à 15 répétitions ; séries : 2 pour un débutant, 3 pour un intermédiaire en « muscle » ; réserve cible 3 (débutant) à 2, jamais 0 ; repos 90 s. Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. Sur le bosu, la qualité du geste passe avant le nombre : la série s'arrête dès que l'équilibre se perd ou que le contrôle se dégrade. Aucune charge sur le bosu : la progression se fait par l'échelon (moins d'appui), jamais par un poids ajouté ni par un mouvement rapide. Étalonnage (load-calibration.md) : première séance avec la variante la plus facile (appui au mur). **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24 (brouillon, à reprendre par `kine` puis à contrôler par `relecteur` lancé à neuf). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | adapter: amplitude:mi-course | retirer | retirer |
| Coude | adapter: amplitude:lente | retirer | retirer |
| Poignet | adapter: amplitude:reduite | retirer | retirer |
| Dos | garder | retirer | retirer |
| Cou | adapter: amplitude:tete-alignee | retirer | retirer |
| Hanche | garder | adapter: amplitude:reduite | retirer |

**Notes**
- epaule-n1 : demi-course, tempo lent ; choix prudent, NON SOURCÉ.
- poignet-n1 : course courte ; poignet droit.
- epaule-n2 : retiré : la pompe sur chaise ou au mur reste disponible (fiche pompe).
- grossesse : retiré : instabilité, ventre proche du bosu ; remplacé par la pompe sur chaise. Post-partum : G7.

**Grossesse** : retirer: remplacant:pompe
**Version plus douce** : pompe-bosu-genoux

**Sécurité pour l'utilisateur seul**
- Bosu bien gonflé, calé contre un mur plein, tapis ferme sous les genoux et les pieds ; sol non glissant (NON SOURCÉ).
- Sortie de secours si une main glisse ou si le bosu part : ne te retiens pas avec un bras tendu ; plie les coudes et laisse-toi descendre vers le bosu en posant les genoux sur le tapis. Essaie cette sortie une fois, bras presque tendus, avant la première vraie série.
- Quelqu'un dans la maison, à portée de voix, de préférence.

**Points d'attention (coach, à reprendre par kine)**
- Épaule, coude, poignet : surface instable sous les mains ; dès la gêne légère, demi-course ; dès la gêne nette, retiré (NON SOURCÉ).
- Niveau intermédiaire : même niveau que la pompe sur ballon de gym (Q25) ; le débutant fait la pompe sur chaise ou au mur.
- Grossesse et post-partum : retiré ; en post-partum, fuite d'urine ou pesanteur dans le bas-ventre : arrêt et avis de la sage-femme (G7).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) à l'épaule, au coude, au poignet ou au bas du dos.
- Bosu qui bouge ou main qui glisse : redescends sur les genoux et arrête.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe : arrête.

**Objets du quotidien**
- Bosu : bien gonflé (ni mou ni trop dur), surface sèche et propre (pieds et sol), sans fissure ni fuite d'air ; placé sur un sol plat, sec et non glissant, calé contre un mur plein ou un meuble lourd (NON SOURCÉ).
- Mur ou chaise lourde à portée de main pendant tout l'exercice ; chaussures fermées à semelle qui accroche, ou pieds nus propres sur un sol non glissant ; espace libre autour de toi (NON SOURCÉ).

## Photo
- aucune photo
- illustration : public/illustrations/pompe-bosu.svg : affichable : non (à faire par dev : vue de profil, mains sur le dôme du bosu calé contre un mur, corps en ligne, haut puis bas)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, consignes de départ) | free-exercise-db : aucune entrée de pompe sur bosu (dist/exercises.json, vérifié le 2026-10-24) ; geste décrit par coach d'après la pratique courante ; voir pompe-mains-ballon du dépôt (Lehman 2006, mains sur ballon) | pratique (pas une étude) | 2026-10-24 | NON SOURCÉ |
| Instabilité (bosu) : à ne pas rechercher pour elle-même ; les exercices au sol et les charges libres restent la base ; l'instabilité peut avoir sa place en rééducation, dans un programme périodisé ou comme variété pour la population générale | Behm et coll., prise de position CSEP, Appl Physiol Nutr Metab 2010;35(1):109-112 (texte complet non lu) et revue Appl Physiol Nutr Metab 2010;35(1):91-108 (résumé lu dans les lots précédents) : le sol et les charges libres restent la base ; l'instabilité peut servir en rééducation, dans un programme périodisé ou comme variété pour la population générale | prise de position (texte complet non lu) et revue (résumé) | 2026-10-24 | PROVISOIRE (résumés seulement) |
| Le BOSU n'a pas augmenté l'activité musculaire mesurée chez des personnes très entraînées : il ne sert pas à « mieux travailler » les muscles ; il sert à l'équilibre et au contrôle | Wahl et Behm, « Not all instability training devices enhance muscle activation in highly resistance-trained individuals », J Strength Cond Res 2008;22(4):1360-1370, PMID 18545166 : 16 personnes très entraînées ; le Dyna Disc et le BOSU n'ont pas augmenté l'activité musculaire mesurée (sauf exceptions), contrairement au ballon de gym et au plateau d'équilibre ; résumé Europe PMC lu | étude de laboratoire, 16 personnes très entraînées, EMG : public différent du public de l'app | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Bosu (gonflage, état), mur, tapis, sol | pratique de salle et raisonnement de coach ; aucune notice de fabricant lue | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; référence du dépôt, non rouverte pour ce lot. L'interdiction de l'échec seul est une règle de sécurité de coach | revue de revues ACSM (OK) ; la règle de sécurité n'est pas une conclusion de l'étude | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; NON SOURCÉ pour la règle de sécurité |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (brouillon de coach, à reprendre par kine puis à contrôler par relecteur) |
| Grossesse et post-partum : bosu retiré (instabilité, risque de chute) ; remplacé par la pompe sur chaise | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe (éviter isométrique prolongé, Valsalva, chute, couché sur le dos) : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach) |
