---
id: porte-sac-epaule
nom: Porté d'un sac de sable sur l'épaule
alias: [sandbag shoulder carry]
schema: porte
type: fonctionnel
niveau_min: intermediaire
muscles_principaux: [obliques, carre_des_lombes]
muscles_secondaires: [trapezes, erecteurs_rachis, fessiers, abdominaux]
source_brouillon: []
statut: brouillon_coach
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| porte-sac-epaule-chaise | Sac pris sur une chaise, sur une épaule | 1 | intermediaire | sac_de_sable, chaise, mur | Sac de sable posé sur l'assise d'une chaise solide dont le dossier est calé contre un mur ; tu le prends à deux bras contre le ventre, puis tu le poses sur une épaule. |
| porte-sac-epaule-sol | Sac pris au sol, sur une épaule | 2 | intermediaire | sac_de_sable, tapis | Sac au sol ; tu le soulèves à deux bras contre le ventre en pliant les genoux, puis tu le poses sur une épaule. |

## Consignes
1. Choisis un sac que tu peux soulever à deux bras sans cambrer le dos ni prendre d'élan ; sinon, il est trop lourd pour cette fiche.
2. Prends-le à deux bras contre le ventre, genoux fléchis, dos droit, puis redresse-toi en le serrant ; pose-le doucement sur une épaule, une main qui le tient, l'autre bras libre pour garder l'équilibre.
3. Marche en ligne droite, pas courts, buste droit, sans pencher le tronc du côté opposé au sac.
4. Fais demi-tour doucement et reviens ; pose le sac au sol en pliant les genoux, dos droit, en le redescendant contre le ventre.
5. Change d'épaule pour la série suivante. Respire normalement.

## Points d'attention
- Charge d'un seul côté : le bas du dos travaille pour ne pas plier ; garde le tronc droit.
- Si pour monter le sac sur l'épaule tu dois te cambrer, balancer ou t'aider d'un élan, il est trop lourd : retourne au porté en berceau.
- Le sac ne passe jamais au-dessus de l'épaule ni derrière la tête ; le cou reste libre.
- Aucun lancer ni jeté du sac, pour le mettre sur l'épaule ou pour le poser.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Tronc penché du côté opposé.
- Prendre un élan pour monter le sac.
- Cambrer le dos.
- Sac qui glisse.
- Marche trop rapide.

## Progression / régression
- plus-facile : porte-sac-berceau, porte-valise
- plus-dur : porte-sac-epaule-sol

## Repères de dosage
Repères du générateur (generateur-v1.md §3.3, règle V-TEMPS, NON SOURCÉ en entier) : 30 s de marche (débutant) puis 40 s, 2 séries, repos 60 s, pas de réserve demandée : la série s'arrête dès que la posture ou le contrôle se dégrade. Chaque série = un côté ; l'autre côté à la série suivante (30 s par côté, 2 séries de chaque côté au plus). Le sac est une charge fixe de poids inconnu de l'app ; si 30 s te mettent déjà hors posture, il est trop lourd pour toi. La progression ne vient pas du poids : d'abord la durée (30 s, puis 40 s), puis l'échelon suivant. **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'épuisement ; fin de série quand la posture se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24 (brouillon, à reprendre par `kine` puis à contrôler par `relecteur` lancé à neuf). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: variante:porte-sac-berceau | retirer: remplacant:marche-du-fermier | retirer |
| Épaule | adapter: variante:porte-sac-berceau | retirer | retirer |
| Cou | adapter: variante:porte-sac-berceau | retirer | retirer |
| Hanche | garder | adapter: charge:legere | retirer |
| Genou | garder | adapter: charge:legere | retirer |
| Cheville | garder | adapter: charge:legere | retirer |

**Notes**
- dos-n1 : porté en berceau (charge des deux côtés) à la place d'un porté d'un seul côté ; choix prudent, NON SOURCÉ.
- dos-n2 : retiré : remplacé par la marche du fermier (charge répartie).
- cou-n1 : le sac ne s'appuie pas sur la base du cou : berceau.
- hanche-n2 : sac le plus léger, aucune hausse.
- grossesse : retiré : sac lourd d'un seul côté, risque de chute ; remplacé par le porté du bagage à charge légère. Post-partum : G7.

**Grossesse** : retirer: remplacant:porte-valise
**Version plus douce** : porte-sac-berceau

**Sécurité pour l'utilisateur seul**
- Pièce dégagée, sol sec et non glissant, aucune marche, aucun tapis qui glisse, ni animal ni enfant sur le trajet ; chaussures fermées (NON SOURCÉ).
- Sortie de secours : si le sac glisse ou si le dos tire, serre le sac contre le corps et laisse-le descendre devant toi en pliant les genoux ; ne te penche pas pour le rattraper. Si tu perds l'équilibre, lâche le sac vers l'avant, pas sur tes pieds, écarte les pieds.
- Distance courte : quelques pas, demi-tour lent ; jamais dans un escalier (NON SOURCÉ).
- Quelqu'un dans la maison, à portée de voix, de préférence.

**Points d'attention (coach, à reprendre par kine)**
- Dos : charge d'un seul côté, plus contraignante pour le bas du dos qu'une charge répartie (McGill 2013, 6 participants, seaux) : dès la gêne légère, berceau ; dès la gêne nette, retiré (NON SOURCÉ).
- Épaule et cou : sac posé sur l'épaule, le trapèze porte ; dès la gêne légère, berceau.
- Niveau intermédiaire : la prise du sac au sol puis l'épaule sont un soulevé et un geste proche de l'épaulé : pas de débutant (règle 23, NON SOURCÉ).
- Grossesse et post-partum : retiré ; en post-partum, fuite d'urine ou pesanteur dans le bas-ventre : arrêt et avis de la sage-femme (G7).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple fatigue du muscle) qui apparaît ou augmente au bas du dos, à l'épaule, au cou ou à la hanche.
- Sac qui glisse ou équilibre incertain : pose le sac et arrête.
- Essoufflement anormal en marchant avec la charge (R5) : arrête.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe : arrête.

**Objets du quotidien**
- Sac de sable : fermé par une couture solide ou une fermeture à glissière doublée, sans fuite de sable, avec des poignées si possible ; le poids est connu (pesé) et assez léger pour rester maîtrisable (le poids n'est pas connu de l'app, NON SOURCÉ).
- Sol plat, sec, non glissant ; chaussures fermées à semelle plate ; espace libre sur tout le trajet, rien de fragile ni de dur à portée du sac (NON SOURCÉ).
- Ici le sac n'est ni lancé, ni rattrapé, ni jeté en l'air : il se porte, il se pose.

## Photo
- aucune photo
- illustration : public/illustrations/porte-sac-epaule.svg : affichable : non (à faire par dev : vue de profil, sac de sable sur une épaule, marche tronc droit, bras libre)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, consignes de départ) | free-exercise-db : aucune entrée de porté de sac sur l'épaule (dist/exercises.json, vérifié le 2026-10-24) ; geste décrit par coach d'après la pratique courante | pratique (pas une étude) | 2026-10-24 | NON SOURCÉ |
| Sac de sable : charge lourde, instable, qui se déplace dans le sac ; la fiche free-exercise-db Sandbag_Load est un exercice d'épreuve de force (charger une plateforme), pas ces gestes ; aucune étude lue sur ces exercices avec un sac | free-exercise-db Sandbag_Load (beginner, other), vérifié dans dist/exercises.json le 2026-10-24 : texte « les sacs de sable sont extrêmement difficiles à saisir », mise sur l'épaule « généralement interdite » dans l'épreuve | descriptif de base de données (pas une étude) | 2026-10-24 | NON SOURCÉ (aucune étude sur l'exercice ; le descriptif sert seulement à justifier la prudence) |
| Charge portée d'un seul côté : charge plus le bas du dos qu'une charge répartie des deux côtés | McGill, Marshall, Andersen, « Low back loads while walking and carrying: comparing the load carried in one hand or in both hands », Ergonomics 2013;56(2):293-302, PMID 23384188 : 6 participants, seaux ; une charge portée d'une seule main charge plus le bas du dos qu'une charge répartie dans les deux mains (30 kg d'un côté : compression lombaire supérieure à 2 800 N ; 15 kg de chaque côté : 1 570 N) ; résumé Europe PMC lu | étude biomécanique de 6 participants, charges de seaux (30 kg) : transposition à un sac prudente | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Sac de sable (solidité, poids connu, fuites), sol, trajet dégagé | pratique de salle et raisonnement de coach ; aucune notice de fabricant lue | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; référence du dépôt, non rouverte pour ce lot. L'interdiction de l'échec seul est une règle de sécurité de coach | revue de revues ACSM (OK) ; la règle de sécurité n'est pas une conclusion de l'étude | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; NON SOURCÉ pour la règle de sécurité |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (brouillon de coach, à reprendre par kine puis à contrôler par relecteur) |
| Grossesse et post-partum : sac de sable retiré (charge fixe et lourde, qu'on ne peut pas alléger ; sac contre le ventre ou sur l'épaule) ; remplacé par le porté du bagage (porte-valise) à charge légère | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe (éviter isométrique prolongé, Valsalva, chute, couché sur le dos) : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach) |
