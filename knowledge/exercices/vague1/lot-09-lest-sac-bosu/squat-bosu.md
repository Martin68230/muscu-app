---
id: squat-bosu
nom: Squat sur un bosu
alias: [bosu squat, squat instable]
schema: squat
type: fonctionnel
niveau_min: intermediaire
muscles_principaux: [quadriceps, fessiers]
muscles_secondaires: [mollets, abdominaux, adducteurs, peroniers, tibial_anterieur]
source_brouillon: []
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| squat-bosu-mur | Dôme vers le haut, une main au mur | 1 | intermediaire | bosu, mur | Bosu posé côté dôme vers le haut sur un sol plat et sec, à côté d'un mur plein ; une main (ou deux doigts) posée sur le mur ; les deux pieds sur le dôme, écartés de la largeur des épaules. |
| squat-bosu-libre | Dôme vers le haut, sans appui | 2 | intermediaire | bosu, mur | Même installation, bras devant toi ; le mur reste à portée de main pour te rattraper. |

## Consignes
1. Pose le bosu côté dôme vers le haut sur un sol plat, sec et non glissant, contre un mur plein ou un meuble lourd. Vérifie qu'il est bien gonflé.
2. Monte sur le dôme avec une main au mur, un pied puis l'autre, pieds écartés de la largeur des épaules, au centre du dôme.
3. Descends peu : un quart de squat seulement (comme pour t'asseoir sur un tabouret haut), dos droit, genoux dans l'axe des pieds.
4. Remonte en poussant sur tout le pied, doucement, sans à-coup, sans te laisser aller sur les côtés.
5. Descends du bosu en tenant le mur : un pied après l'autre, sans sauter.

## Points d'attention
- Le bosu sert, dans cette fiche, à l'équilibre et au contrôle de la cheville et de la jambe (choix de coach, NON SOURCÉ), jamais à charger : aucun haltère, aucun sac, aucun gilet.
- Pas de saut ni de mouvement rapide sur le bosu.
- Le côté plat vers le haut n'est pas proposé (chute plus probable, voir Q27).
- Mouvements lents et courts : la profondeur n'est pas le but.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Descendre trop bas.
- Genoux qui rentrent.
- Pieds au bord du dôme.
- Bosu mal calé qui glisse.
- Monter ou descendre en sautant.

## Progression / régression
- plus-facile : squat-poids-du-corps, squat-assis-debout
- plus-dur : squat-bosu-libre

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE ; ACSM 2026 : 2 à 3 séries par exercice) : exercice sans charge extérieure (aucun tag de la liste « chargeable ») : 10 à 15 répétitions ; séries : 2 pour un débutant, 3 pour un intermédiaire en « muscle » ; réserve cible 3 (débutant) à 2, jamais 0 ; repos 90 s. Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. Sur le bosu, la qualité du geste passe avant le nombre : la série s'arrête dès que l'équilibre se perd ou que le contrôle se dégrade. Aucune charge sur le bosu : la progression se fait par l'échelon (moins d'appui), jamais par un poids ajouté ni par un mouvement rapide. Étalonnage (load-calibration.md) : première séance avec la variante la plus facile (appui au mur). **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24 (sécurité reprise par `kine` le 2026-10-25, à contrôler par `relecteur` lancé à neuf). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Cheville | retirer: remplacant:squat-poids-du-corps | retirer | retirer |
| Genou | adapter: variante:squat-bosu-mur | retirer: remplacant:squat-poids-du-corps | retirer |
| Hanche | garder | adapter: variante:squat-bosu-mur | retirer |
| Dos | garder | adapter: variante:squat-bosu-mur | retirer |
| Cuisse | garder | adapter: amplitude:reduite | retirer |
| Aine | garder | adapter: amplitude:reduite | retirer |

**Notes**
- cheville-n1 : dès une gêne légère à la cheville, pas de surface instable ; squat au poids du corps sur sol plat (choix prudent, NON SOURCÉ).
- general : règle unique du bosu (choix de kine, NON SOURCÉ) : jamais de charge sur le bosu ; quart de squat pour tout le monde (c'est déjà la consigne) ; cheville gênée, même légèrement : retiré (surface instable). Dès la gêne légère au genou, ou nette à la hanche ou au dos, la variante avec la main au mur (appui, moins de balancement). Dès la gêne nette au genou, retiré (squat au poids du corps sur sol plat, qui a ses propres lignes).
- genou-n1 : variante avec la main au mur (le quart de squat est déjà la consigne pour tous).
- hanche-n2 : variante avec la main au mur.
- dos-n2 : variante avec la main au mur.
- cheville-n2 : retiré, sans remplaçant dans cette case (déjà retiré dès le niveau 1, avec remplaçant squat-poids-du-corps).
- cuisse-n2 : choix prudent, extrapolation de regles-securite-communes.md §0 (NON SOURCÉ).
- aine-n2 : idem (NON SOURCÉ).
- grossesse : retiré : instabilité et risque de chute ; remplacé par le squat au poids du corps. Post-partum : G7.

**Grossesse** : retirer: remplacant:squat-poids-du-corps
**Version plus douce** : squat-poids-du-corps

**Sécurité pour l'utilisateur seul**
- Bosu bien gonflé, calé contre un mur plein, sol sec et non glissant ; rien de dur ni de fragile autour (NON SOURCÉ).
- Mur ou meuble lourd à portée de main pendant toute la série ; chaussures fermées à semelle qui accroche, ou pieds nus propres.
- Sortie de secours, à chaque série : si tu perds l'équilibre, saisis le mur et pose un pied au sol (le bosu est bas) ; ne tente pas de te rattraper en sautant ni en tordant la cheville. Si tu tombes, laisse-toi aller sur les fesses vers le mur, pieds qui quittent le dôme, plutôt que de poser le pied sur le côté de la cheville (NON SOURCÉ). Avant la première série, fais la manœuvre une fois à vide : monte, déséquilibre-toi doucement, descends.
- Un bosu qui bouge sur le sol, qui est mou ou qui siffle : pas d'exercice.
- Pas d'échec : arrête la série avec au moins 2 répétitions en réserve.

**Points d'attention (kine)**
- Cheville : la surface instable travaille la stabilité mais expose à l'entorse ; dès la gêne légère à la cheville, retiré (choix prudent, NON SOURCÉ).
- Genou, hanche, dos : quart de squat pour tous, mouvement lent ; dès la gêne légère au genou (nette à la hanche ou au dos), une main au mur ; arrêt si douleur.
- Niveau intermédiaire : surface instable, risque de chute (choix de coach, NON SOURCÉ) ; le débutant fait le squat au poids du corps sur sol plat.
- Grossesse et post-partum : retiré (instabilité) ; en post-partum, fuite d'urine ou pesanteur dans le bas-ventre : arrêt et avis de la sage-femme (G7).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) à la cheville, au genou, à la hanche ou au bas du dos.
- Cheville qui part sur le côté ou perte d'équilibre répétée : descends et arrête.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe : arrête.

**Objets du quotidien**
- Bosu : bien gonflé (ni mou ni trop dur), surface sèche et propre (pieds et sol), sans fissure ni fuite d'air ; placé sur un sol plat, sec et non glissant, calé contre un mur plein ou un meuble lourd (NON SOURCÉ).
- Mur ou chaise lourde à portée de main pendant tout l'exercice ; chaussures fermées à semelle qui accroche, ou pieds nus propres sur un sol non glissant ; espace libre autour de toi (NON SOURCÉ).

## Photo
- aucune photo
- illustration : public/illustrations/squat-bosu.svg : affichable : oui (illustration originale de l'app)
- légende : Bosu côté dôme vers le haut, une main au mur. Quart de squat seulement, jamais de charge.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, consignes de départ) | free-exercise-db : aucune entrée de squat sur bosu (dist/exercises.json, vérifié le 2026-10-24 : seules Balance_Board et Bosu_Ball_Cable_Crunch_With_Side_Bends existent, autres gestes) ; geste décrit par coach d'après la pratique courante | pratique (pas une étude) | 2026-10-24 | NON SOURCÉ |
| Instabilité (bosu) : à ne pas rechercher pour elle-même ; les exercices au sol et les charges libres restent la base ; l'instabilité peut avoir sa place en rééducation, dans un programme périodisé ou comme variété pour la population générale | Behm et coll., prise de position CSEP, Appl Physiol Nutr Metab 2010;35(1):109-112 (texte complet non lu) et revue Appl Physiol Nutr Metab 2010;35(1):91-108 (résumé lu dans les lots précédents) : le sol et les charges libres restent la base ; l'instabilité peut servir en rééducation, dans un programme périodisé ou comme variété pour la population générale | prise de position (texte complet non lu) et revue (résumé) | 2026-10-24 | PROVISOIRE (résumés seulement) |
| Le BOSU n'a pas augmenté l'activité musculaire mesurée chez 16 personnes très entraînées ; le rôle « équilibre et contrôle » donné au bosu dans cette fiche est un choix de coach (NON SOURCÉ : l'étude ne mesure ni l'équilibre ni le contrôle) | Wahl et Behm, « Not all instability training devices enhance muscle activation in highly resistance-trained individuals », J Strength Cond Res 2008;22(4):1360-1370, PMID 18545166 : 16 personnes très entraînées ; Dyna Disc et BOSU sans différence significative d'activité musculaire (seule exception : les érecteurs du rachis debout sur Dyna Disc, pas sur BOSU) ; ballon de gym et plateau d'équilibre : plus d'activité surtout debout (accroupi : seulement abdominaux bas et soléaire) ; aucune mesure d'équilibre ni de contrôle ; résumé Europe PMC lu | étude de laboratoire, 16 personnes très entraînées, EMG : public différent du public de l'app | 2026-10-24 | PROVISOIRE (résumé seulement) pour l'activité musculaire ; NON SOURCÉ pour le rôle équilibre/contrôle |
| Entraînement de l'équilibre sur plateau instable : moins de récidives d'entorse de cheville chez des sportifs déjà blessés (programme de 8 semaines à domicile, planche d'équilibre, pas un bosu) | Hupperets, Verhagen, van Mechelen, « Effect of unsupervised home based proprioceptive training on recurrences of ankle sprain: randomised controlled trial », BMJ 2009;339:b2684, PMID 19589822 : 522 sportifs de 12 à 70 ans ayant eu une entorse latérale de cheville ; programme de 8 semaines à domicile (planche d'équilibre) ; récidives 22 % contre 33 % (risque relatif 0,63) ; bénéfice significatif seulement chez ceux dont l'entorse n'avait pas été soignée médicalement (sous-groupe) ; résumé Europe PMC lu | essai contrôlé randomisé, 522 sportifs blessés : public et appareil différents du public et du bosu de l'app | 2026-10-24 | PROVISOIRE (résumé seulement ; ne valide pas la fiche, contexte) |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Bosu (gonflage, état), mur, sol | pratique de salle et raisonnement de coach ; aucune notice de fabricant lue | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; référence du dépôt, non rouverte pour ce lot. L'interdiction de l'échec seul est une règle de sécurité de coach | revue de revues ACSM (OK) ; la règle de sécurité n'est pas une conclusion de l'étude | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; NON SOURCÉ pour la règle de sécurité |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 2026-10-25, à contrôler par relecteur) |
| Grossesse et post-partum : bosu retiré (instabilité, risque de chute) ; remplacé par le squat au poids du corps | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe (éviter isométrique prolongé, Valsalva, chute, couché sur le dos) : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach) |
