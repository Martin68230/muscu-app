---
id: course-continue-lente
nom: Course continue lente
alias: [footing, jogging]
schema: cardio
type: cardio
niveau_min: debutant
muscles_principaux: [quadriceps, mollets]
muscles_secondaires: [fessiers, ischios, tibial_anterieur]
source_brouillon: []
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 (une seule étape : le dernier palier, course continue). Cette fiche n'est proposée qu'à la fin de la progression de knowledge/cardio-regles.md §5.3 (palier 12, plafond de la course continue en v1) ; la durée y figure, pas ici. Tous les niveaux y accèdent sans sauter de palier (décision de l'utilisateur D30).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| course-continue-lente-dehors | Course lente, dehors | 1 | debutant | poids_du_corps | Seulement si l'option « Je peux marcher ou courir dehors, sur un trajet sûr » est cochée dans ton profil et que le signal sonore, l'écran allumé et le repli « arrête-toi pour regarder » sont prêts (cardio-regles.md §5.4). Trajet plat, éclairé, sûr, de préférence piéton ; chaussures de sport qui soutiennent le pied. Sans l'option : course sur place. |

## Consignes
1. Marche rapide 5 minutes pour t'échauffer, puis démarre doucement.
2. Cours à l'allure de conversation : tu dois pouvoir dire une phrase courte sans reprendre ton souffle. Sinon ralentis, ou marche un moment.
3. Reste droit, regard devant, épaules relâchées, bras souples le long du corps, petits pas souples qui retombent sous toi.
4. Respire de façon régulière, sans forcer ; ne cherche pas à aller plus vite.
5. Termine par 5 minutes de marche pour récupérer.
6. À la moindre douleur articulaire ou vive, passe à la marche et arrête la course.

## Points d'attention
- Cette étape est la dernière de la progression de course de l'app : tu y arrives après les paliers d'alternance, jamais avant.
- Dehors seulement si l'option « Je peux marcher ou courir dehors » est cochée et que le signal sonore, l'écran allumé et le repli « arrête-toi pour regarder » sont prêts ; sinon course sur place (format fixe court, sans palier). Sous chaque séance dehors, l'app propose la version intérieure.
- Chaleur : raccourcis et ralentis (T6). Son bas, une seule oreille ou haut-parleur pour entendre la circulation (cardio-regles.md §5.4).
- Sol : plat, non glissant ; chaussures de sport qui tiennent le pied, pas usées.
- Pas de seconde sortie le lendemain : au moins un jour libre entre deux sorties de course.

## Erreurs fréquentes
- Courir trop vite pour pouvoir parler.
- Foulées trop longues, talons qui tapent loin devant.
- Négliger l'échauffement ou le retour au calme.
- Continuer malgré une douleur.

## Progression / régression
- plus-facile : alternance-marche-course
- plus-dur : aucun

## Repères de dosage
La durée de la course continue, la fréquence (2 à 3 sorties par semaine au plus, jamais deux jours de suite) et la règle de passage : knowledge/cardio-regles.md §5.3 (NHS Couch to 5K, semaine 9, PROVISOIRE ; plafond de la course continue en v1 : choix de `coach`, NON SOURCÉ). Aucune vitesse ni fréquence cardiaque.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-31, complété et corrigé par `kine` le 2026-10-31 (statut complete_kine), à contrôler par `relecteur`. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Exclusions de la course : cardio-regles.md §5.1 et §5.3 à §5.5. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone sont des choix prudents NON SOURCÉS.

**Contre-indications par zone** (1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique.

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Genou | retirer: remplacant:marche-rapide-continue | retirer: remplacant:marche-rapide-continue | retirer |
| Cheville | retirer: remplacant:marche-rapide-continue | retirer: remplacant:marche-rapide-continue | retirer |
| Dos | retirer: remplacant:marche-rapide-continue | retirer: remplacant:marche-rapide-continue | retirer |
| Hanche | retirer: remplacant:marche-rapide-continue | retirer: remplacant:marche-rapide-continue | retirer |
| Cuisse | retirer: remplacant:marche-rapide-continue | retirer: remplacant:marche-rapide-continue | retirer |
| Aine | retirer | retirer | retirer |


**Notes**
- general : variantes « dehors » seulement : le tag machine_cardio ne distingue pas tapis, vélo et rameur ; pas de variante tapis tant que ce n'est pas le cas.
- general : aucune course dès la gêne légère à ces six zones, à tout niveau (cardio-regles.md §5.1 (2), avis `kine` D30) ; la marche rapide continue la remplace pour cinq d'entre elles, aux niveaux 1 et 2 (sa propre fiche la garde ou l'adapte à ces zones). Aine : sans remplaçant, la marche rapide n'ayant pas de ligne « aine » dans sa fiche (regles-securite-communes.md §0) ; le générateur choisit un autre exercice. Niveau 3 : la marche est retirée à son tour, donc rien n'est proposé pour ces zones.
- general : « douleur déclarée » veut dire tous les niveaux, y compris la gêne légère. Où ça fait mal : tibia, mollet, pied, talon, tendon d'Achille = cheville ; fesse = hanche ; face avant de la cuisse = genou ET hanche ; face arrière de la cuisse = cuisse ; aine = aine ; bas du dos, côté, bassin = dos ; en cas de doute, la zone du membre inférieur la plus proche (cardio-regles.md §5.3).
- general : reprise après une douleur : la zone est remise à jour par la personne (R7) ; la course reprend 2 paliers plus bas (au minimum le palier 1) après une pause de plus de 2 semaines, jamais directement au palier où la douleur est apparue ; jamais « marcher pour faire passer la douleur ».
- general : course interdite le jour même d'une séance à jambes lourdes, la veille et le lendemain, après une séance interrompue, et sans l'échauffement de 5 min de marche (cardio-regles.md §5.1 (4), (5) ; règles portées par le générateur). Jamais deux jours de suite avec impact ; un seul type d'impact par séance (§5.1 (6bis)).
- grossesse : aucune course, aucun impact (G7, HAS 2019) ; marche rapide à la place. Post-partum : même classement tant que le réglage est coché (le schéma cardio de course n'est pas proposé).
- general : épaule, coude, poignet, cou : aucun appui ni charge, rien à adapter.

**Grossesse** : retirer: remplacant:marche-rapide-continue
**Version plus douce** : marche-rapide-continue

**Signes qui doivent faire arrêter**
- Douleur articulaire ou vive à la cheville, au tibia, au mollet, au pied, au talon, derrière le talon (tendon d'Achille), au genou, à la hanche, à la cuisse, à l'aine ou au bas du dos : passe à la marche, arrête la course ; n'essaie pas de « courir à travers » ni de « marcher pour que ça passe ». Le palier n'est pas validé.
- Raideur ou douleur au talon, au tibia ou à la cheville le lendemain matin : ne reprends pas la course et consulte si cela dure (S1).
- Essoufflement qui t'empêche de dire une phrase, vertige, malaise, palpitations, douleur ou serrement dans la poitrine (cou, mâchoire, bras) : arrête la séance, ne reprends pas avant un avis médical (R5) ; si la douleur de poitrine ne passe pas au repos, malaise avec perte de connaissance ou difficulté à respirer au repos : urgence (U1).
- Douleur qui dure, qui s'aggrave ou qui réveille la nuit, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2).
- Si le réglage enceinte / post-partum est coché : la course n'est pas proposée ; en cas de saignement, de contractions, de fuite d'urine ou de pesanteur dans le bas-ventre, arrête ce que tu fais et contacte ta sage-femme ou ton médecin (G6, G7).

**Objets du quotidien**
- Chaussures de sport qui tiennent le pied, lacets noués, pas usées ; sol sec et non glissant, pas de verglas (R8, NON SOURCÉ).
- Dehors (seulement avec l'option) : trajet plat, éclairé, de préférence piéton, vêtements visibles, téléphone sur toi, quelqu'un prévenu ; son bas, une seule oreille ou le haut-parleur, jamais de casque à réduction de bruit ; ne regarde pas l'écran en courant (cardio-regles.md §5.4, NON SOURCÉ). Chaleur : raccourcis, ralentis, bois avant et après (T6).

## Photo
- aucune photo

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Course continue en fin de progression, échauffement et retour au calme de 5 min de marche, repos entre deux sorties | NHS, « Couch to 5K », https://www.nhs.uk/better-health/get-active/get-running-with-couch-to-5k/ et .../couch-to-5k-running-plan/ (pages lues en entier le 30/10/2026) | programme officiel de santé publique, pas une étude | 2026-10-30 | PROVISOIRE |
| Progression douce : environ une personne sur cinq se blesse en débutant la course, même avec un programme progressif | Buist et coll., Am J Sports Med 2008;36(1):33-39 (résumé via moteur de recherche) | essai randomisé (532 novices) | 2026-10-30 | PROVISOIRE |
| Allure de conversation, plafond de 30 minutes de course continue en v1, rappels pour courir dehors | knowledge/cardio-regles.md §5.3 et §5.4 (choix de `coach` et `kine`) | avis d'expert | 2026-10-31 | NON SOURCÉ |
| Muscles, niveau, consignes de technique | choix de coach, consignes écrites sans copie de source | - | 2026-10-31 | NON SOURCÉ |
| Tableau par zone (tout retiré dès le niveau 1, marche rapide comme remplaçant sauf pour l'aine), correspondances de zones, signes d'arrêt, consignes dehors | choix prudents de `kine` d'après cardio-regles.md §5.1 (2), §5.3, §5.4 et regles-securite-communes.md §0 ; aucune étude ne teste ces adaptations | avis d'expert (extrapolation) | 2026-10-31 | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U | knowledge/regles-securite-communes.md (HAS 2019, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-31 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE |
| Grossesse et post-partum : aucun impact | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus | 2026-10-31 | principe : OK ; classement de la fiche : PROVISOIRE (extrapolation) |
