---
id: pompe-mains-ballon
nom: Pompe avec les mains sur un ballon de gym
alias: [push-up hands on ball, pompe instable]
schema: poussee_h
type: force
niveau_min: intermediaire
muscles_principaux: [pectoraux]
muscles_secondaires: [triceps, deltoides_anterieurs, abdominaux, dentele_anterieur]
source_brouillon: []
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| pompe-mains-ballon-mur | Ballon calé contre un mur | 1 | intermediaire | swiss_ball, mur | Mains sur le ballon, ballon calé contre un mur plein, pieds reculés pour former une ligne ; le mur empêche le ballon de fuir. |

## Consignes
1. Variante au mur : cale le ballon contre un mur plein. Pose les mains un peu plus larges que les épaules sur le dessus du ballon, pieds reculés pour former une ligne droite.
2. Serre le ventre et les fessiers, garde le regard devant les mains.
3. Plie les coudes pour amener la poitrine vers le ballon, en gardant le ballon immobile sous les mains.
4. Pousse avec les bras pour remonter jusqu'à presque tendre les coudes.
5. Fin de série : pose les genoux au sol avant de lâcher le ballon. Le ballon libre (sans mur) n'est pas proposé : mains sur une surface qui roule, la chute vers l'avant ou le côté se fait sur le visage, le poignet ou l'épaule (choix de kine, NON SOURCÉ, question Q25 de docs/QUESTIONS.md).

## Points d'attention
- Mains sur le ballon : le corps est incliné vers le haut, plus facile qu'au sol pour la poitrine mais plus instable pour les poignets et les épaules.
- Le ballon reste sous les mains : s'il part de côté ou en avant, arrête-toi.
- Les études montrent plus d'activité du triceps et du ventre avec les mains sur le ballon, pas du pectoral (PROVISOIRE) : ce n'est pas un meilleur exercice de poitrine.
- Les poignets restent droits.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Ballon qui fuit sous les mains.
- Bassin qui tombe.
- Coudes très écartés.
- Amplitude trop courte.
- Poignets cassés.

## Progression / régression
- plus-facile : pompe-chaise, pompe-mur
- plus-dur : pompe-pieds-ballon-tibias

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE ; ACSM 2026, SRC1 : 2 à 3 séries par exercice) : cet exercice est sans charge extérieure (aucun tag de la liste « chargeable ») : 10 à 15 répétitions ; séries : 2 pour un débutant, 3 pour un intermédiaire ou un avancé en « muscle » (2 pour un exercice « autre » en force) ; réserve cible 3 (débutant) à 2, jamais 0 ; repos 90 s (120 s pour un exercice pilier d'intermédiaire). Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. Si le tableau du générateur donne 10 à 15 répétitions, arrête avant dès que le ballon bouge ou que le bassin tombe. Étalonnage (load-calibration.md) : première séance avec la variante la plus facile ou la charge la plus légère disponible ; double progression (d'abord les répétitions ou la durée, puis l'échelon ou le palier suivant). **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24, repris et corrigé par `kine` le 2026-10-24 (à contrôler par `relecteur`). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | garder | adapter: variante:pompe-mains-ballon-mur | retirer |
| Épaule | adapter: variante:pompe-mains-ballon-mur | retirer | retirer |
| Coude | adapter: variante:pompe-mains-ballon-mur | retirer | retirer |
| Poignet | adapter: variante:pompe-mains-ballon-mur | retirer | retirer |
| Hanche | garder | adapter: variante:pompe-mains-ballon-mur | retirer |
| Cou | adapter: amplitude:tete-alignee | adapter: variante:pompe-mains-ballon-mur | retirer |

**Notes**
- general : la variante « ballon libre » a été retirée par kine (question Q25 de docs/QUESTIONS.md).
- epaule-n1 : ballon calé contre un mur ; aucune augmentation dès le niveau 2.
- epaule-n2 : retiré : épaule chargée sur surface instable.
- poignet-n1 : ballon calé ; poignets droits ; retiré dès le niveau 2.
- coude-n1 : ballon calé, tempo lent.
- grossesse : retirée : ballon instable avec ventre proche du ballon, risque de chute ; remplaçant : pompe sur chaise. Post-partum : G7.

**Grossesse** : retirer: remplacant:pompe-chaise
**Version plus douce** : pompe-mains-ballon-mur

**Sécurité pour l'utilisateur seul**
- Ballon calé contre un mur plein et pieds sur un sol non glissant, tapis ferme sous les pieds et les genoux ; le ballon ne doit pas pouvoir glisser sur le côté (mur large, ballon centré).
- Sortie de secours si une main glisse ou si le ballon part : ne te retiens pas avec un bras tendu ; plie les coudes et laisse-toi descendre vers le ballon ou le mur en pliant les genoux, jusqu'à poser les genoux sur le tapis. Essaie cette sortie une fois, bras presque tendus, avant la première vraie série. Premier essai : une répétition à amplitude courte.
- Le dessus du ballon doit pouvoir porter ton poids : ballon bien gonflé.
- Quelqu'un dans la maison, à portée de voix, de préférence.

**Points d'attention (kine)**
- Épaule et poignet : la surface instable augmente le travail des stabilisateurs ; dès la gêne légère, variante au mur (la seule) et tempo lent, dès la gêne nette retiré (NON SOURCÉ).
- Cou : regard devant les mains, nuque dans le prolongement du dos.
- Grossesse et post-partum : retirée (instabilité, ventre proche du ballon) ; en post-partum, fuite d'urine ou pesanteur dans le bas-ventre : arrêt et avis de la sage-femme (G7).
- Niveau : intermédiaire minimum (la pompe sur chaise et la pompe au mur couvrent le débutant), par prudence, NON SOURCÉ.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente à l'épaule, au coude, au poignet ou au cou.
- Ballon qui part ou bassin qui tombe : arrête la série.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe : arrête.

**Objets du quotidien**
- Ballon de gym (swiss ball) : gonflé fermement (il ne s'écrase pas sous toi), sans fuite ni déchirure, de préférence un modèle « anti-éclatement » dont la charge maximale écrite dépasse ton poids (NON SOURCÉ : consigne de prudence de coach, aucune notice lue). Un ballon qui se dégonfle, qui glisse ou qui fait un bruit suspect : on ne l'utilise plus.
- Taille : assis sur le ballon, les cuisses sont à peu près horizontales (repère de pratique, NON SOURCÉ). Trop grand ou trop mou : l'exercice devient plus instable.
- Sol plat, sec, non glissant, avec un tapis ferme ; pas de ballon sur un sol mouillé, ciré ou en pente ; espace libre d'au moins deux bras autour de toi, aucun meuble, escalier ni objet pointu à portée du ballon qui roule (NON SOURCÉ).
- Chaussures fermées à semelle plate qui accroche, ou pieds nus sur un tapis antidérapant selon l'exercice (la fiche le dit) ; jamais de chaussettes seules sur le sol.

## Photo
- aucune photo
- illustration : public/illustrations/pompe-mains-ballon.svg : affichable : oui (illustration originale de l'app, 24/10/2026 ; vue de profil : mains sur le dessus du ballon calé contre un mur, pieds reculés ; poitrine vers le ballon, le ballon ne bouge pas)
- légende : Le ballon reste calé contre le mur ; le ballon libre n'est pas proposé.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet, consignes de départ) | aucune entrée de free-exercise-db ne correspond (vérifié dans dist/exercises.json le 2026-10-24) ; geste décrit par coach d'après la pratique courante | pratique (pas une étude) | 2026-10-24 | NON SOURCÉ |
| Pompe avec les mains ou les pieds sur un ballon de gym : mains sur le ballon = triceps et droit de l'abdomen plus actifs, pectoral inchangé ; pieds sur le ballon = aucun changement mesuré | Lehman, Gilas, Patel, Dynamic Medicine 2006;5:7, https://pmc.ncbi.nlm.nih.gov/articles/PMC1508143 ; 13 étudiants ; EMG non normalisée ; résumé lu via moteur de recherche | étude de laboratoire, 13 hommes jeunes ; mesure l'activité, pas l'effet à long terme | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Instabilité (ballon de gym) : à ne pas rechercher pour elle-même ; les exercices au sol et les charges libres restent la base ; le ballon sert surtout au gainage, à la rééducation ou à la variété | Behm, Drinkwater, Willardson, Cowley, CSEP position stand « The use of instability to train the core in athletic and nonathletic conditioning », Appl Physiol Nutr Metab 2010;35(1):109-112 ; résumés et commentaires lus via moteur de recherche (texte complet non lu) | prise de position d'une société savante (CSEP) ; résumé seulement | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Choix du ballon (taille, gonflage, anti-éclatement), sol, espace libre | pratique de salle et raisonnement de coach ; aucune notice de fabricant lue | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 2026-10-24, à contrôler par relecteur) |
| Grossesse et post-partum : pompe mains sur ballon retirée (instabilité, ventre près du ballon) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe (éviter isométrique prolongé, Valsalva, chute, couché sur le dos) : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, confirmé par kine, NON SOURCÉ) |
