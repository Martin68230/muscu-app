---
id: equilibre-unipodal-bosu
nom: Équilibre sur une jambe sur un bosu
alias: [bosu single-leg balance, équilibre bosu]
schema: mobilite
type: fonctionnel
niveau_min: intermediaire
muscles_principaux: [peroniers, moyen_fessier]
muscles_secondaires: [mollets, tibial_anterieur, quadriceps, abdominaux]
source_brouillon: []
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| equilibre-bosu-mur | Un pied sur le dôme, doigts au mur | 1 | intermediaire | bosu, mur | Bosu côté dôme vers le haut, calé contre un mur plein ; debout à côté, doigts posés sur le mur, un pied au centre du dôme, l'autre pied au sol puis levé légèrement. |
| equilibre-bosu-libre | Un pied sur le dôme, sans appui | 2 | intermediaire | bosu, mur | Même installation, bras le long du corps, doigts à quelques centimètres du mur pour te rattraper. |

## Consignes
1. Pose le bosu côté dôme vers le haut, calé contre un mur plein ou un meuble lourd, sur un sol plat et non glissant ; vérifie qu'il est bien gonflé.
2. Monte avec un seul pied au centre du dôme, l'autre pied reste au sol, une main au mur ; transfère ton poids sur le pied du dôme, puis lève légèrement l'autre pied ; pose-le au sol à la moindre hésitation.
3. Genou de la jambe d'appui légèrement fléchi, bassin de niveau, regard devant sur un point fixe.
4. Tiens quelques secondes sans te raidir ; respire normalement. Pose le pied libre et reprends.
5. Fais les deux jambes. Descends du bosu en tenant le mur, un pied après l'autre, sans sauter.

## Points d'attention
- Un exercice d'équilibre, pas de force : pas de charge, pas de saut, pas de mouvement de la jambe libre.
- Le pied d'appui reste à plat au centre du dôme ; les orteils ne s'agrippent pas.
- Les yeux restent ouverts : la variante yeux fermés n'est pas proposée.
- Si tu n'arrives pas à tenir 30 secondes sur sol plat (fiche equilibre-unipodal), n'essaie pas le bosu : la fiche ne peut pas le vérifier à ta place (NON SOURCÉ).
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Genou verrouillé.
- Regarder les pieds.
- Pied qui s'agrippe.
- Bosu qui glisse.
- Tenir trop longtemps jusqu'à la fatigue.

## Progression / régression
- plus-facile : equilibre-unipodal-mur, equilibre-unipodal-libre
- plus-dur : equilibre-bosu-libre

## Repères de dosage
Aucun repère du générateur ne dose aujourd'hui ce schéma : aucun emplacement ne le place et le tableau des durées (TEMPS) n'a pas de ligne `mobilite` ; cette fiche n'est donc ni un échauffement ni dosée par la règle V-DOSE (décision de `dev` à enregistrer, README du lot). Repère de coach (NON SOURCÉ, aucune source lue sur la durée) : au plus 30 secondes par pied et par passage, 2 passages par pied, repos 30 à 60 s entre les passages. Aucune charge, aucune réserve demandée : la série s'arrête quand l'équilibre se perd ou qu'une cheville fatigue. La progression se fait par l'échelon (moins d'appui), jamais par une charge ni par un mouvement. Régularité : une durée de programme de plusieurs semaines est mentionnée dans la fiche equilibre-unipodal du dépôt (McKeon et Hertel 2008).

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24 (sécurité reprise par `kine` le 2026-10-25, à contrôler par `relecteur` lancé à neuf). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Cheville | retirer: remplacant:equilibre-unipodal-mur | retirer | retirer |
| Genou | adapter: variante:equilibre-bosu-mur | retirer: remplacant:equilibre-unipodal-mur | retirer |
| Hanche | adapter: variante:equilibre-bosu-mur | retirer: remplacant:equilibre-unipodal-mur | retirer |
| Dos | garder | adapter: variante:equilibre-bosu-mur | retirer |

**Notes**
- general : règle unique du bosu (choix de kine, NON SOURCÉ) : jamais de charge, de saut, de yeux fermés ni de côté plat vers le haut (Q27). Cet exercice d'équilibre n'est pas un échauffement générique et ne se fait pas fatigué (après des séries lourdes, ou jambes qui tremblent) : une surface instable avec une cheville ou un genou fatigués augmente le risque de chute.
- cheville-n1 : dès une gêne légère à la cheville, pas de surface instable ; équilibre sur sol plat (choix prudent, NON SOURCÉ).
- genou-n1 : doigts au mur.
- hanche-n1 : doigts au mur, jambe d'appui légèrement fléchie.
- dos-n2 : doigts au mur, sans mouvement du tronc.
- cheville-n2 : retiré, sans remplaçant dans cette case (déjà retiré dès le niveau 1, avec remplaçant equilibre-unipodal-mur).
- grossesse : retiré : surface instable, risque de chute ; remplacé par l'équilibre sur une jambe au mur sur sol plat. Post-partum : G7.

**Grossesse** : retirer: remplacant:equilibre-unipodal-mur
**Version plus douce** : equilibre-unipodal-mur

**Sécurité pour l'utilisateur seul**
- Bosu bien gonflé, calé contre un mur plein, sol sec et non glissant ; rien de dur ni de fragile autour (NON SOURCÉ).
- Mur à portée de main pendant tout l'exercice ; chaussures fermées à semelle qui accroche (pas de pieds nus : la cheville est la zone la plus exposée).
- Pas d'exercice si tu es fatigué ou étourdi (NON SOURCÉ).
- Sortie de secours : si tu perds l'équilibre, pose le pied libre au sol et saisis le mur ; ne tente pas de te rattraper en sautant. Si tu tombes, laisse-toi aller sur les fesses vers le mur plutôt que de poser le pied sur le côté de la cheville. Fais la manœuvre une fois avant la première vraie série : monte, déséquilibre-toi doucement, descends (NON SOURCÉ).
- Quelqu'un dans la maison, à portée de voix, de préférence.

**Points d'attention (kine)**
- Cheville : l'exercice vise la stabilité, mais une cheville gênée ne doit pas être mise sur une surface instable ; dès la gêne légère, retiré (choix prudent, NON SOURCÉ). Les sources lues portent sur la prévention de récidives d'entorse chez des sportifs avec une planche d'équilibre (Hupperets 2009), pas sur un bosu ni sur un public non sportif.
- Genou et hanche : doigts au mur, jambe d'appui légèrement fléchie.
- Niveau intermédiaire : surface instable ; il faut d'abord tenir l'équilibre sur une jambe sur sol plat (fiche equilibre-unipodal). Le débutant fait seulement la version sur sol plat.
- Grossesse et post-partum : retiré (instabilité) ; en post-partum, fuite d'urine ou pesanteur dans le bas-ventre : arrêt et avis de la sage-femme (G7).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple fatigue du muscle) à la cheville, au genou, à la hanche ou au bas du dos.
- Cheville qui part sur le côté ou perte d'équilibre répétée : descends et arrête.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe : arrête.

**Objets du quotidien**
- Bosu : bien gonflé (ni mou ni trop dur), surface sèche et propre (pieds et sol), sans fissure ni fuite d'air ; placé sur un sol plat, sec et non glissant, calé contre un mur plein ou un meuble lourd (NON SOURCÉ).
- Mur ou chaise lourde à portée de main pendant tout l'exercice ; chaussures fermées à semelle qui accroche (pas de pieds nus : la cheville est la zone la plus exposée) ; espace libre autour de toi (NON SOURCÉ).

## Photo
- `Balance_Board/0.jpg` : affichable : non (planche d'équilibre, autre appareil que le bosu)
- `Balance_Board/1.jpg` : affichable : non (idem)
- illustration : public/illustrations/equilibre-unipodal-bosu.svg : affichable : oui (illustration originale de l'app)
- légende : Vue de face, bosu côté dôme vers le haut contre un mur. Si tu perds l'équilibre, pose le pied libre.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, consignes de départ) | free-exercise-db Balance_Board (beginner, other) pour le geste d'équilibre sur un plateau instable ; aucune entrée avec bosu pour ce geste (dist/exercises.json, vérifié le 2026-10-24) ; voir equilibre-unipodal du dépôt | pratique (pas une étude) | 2026-10-24 | NON SOURCÉ |
| Instabilité (bosu) : à ne pas rechercher pour elle-même ; les exercices au sol et les charges libres restent la base ; l'instabilité peut avoir sa place en rééducation, dans un programme périodisé ou comme variété pour la population générale | Behm et coll., prise de position CSEP, Appl Physiol Nutr Metab 2010;35(1):109-112 (texte complet non lu) et revue Appl Physiol Nutr Metab 2010;35(1):91-108 (résumé lu dans les lots précédents) : le sol et les charges libres restent la base ; l'instabilité peut servir en rééducation, dans un programme périodisé ou comme variété pour la population générale | prise de position (texte complet non lu) et revue (résumé) | 2026-10-24 | PROVISOIRE (résumés seulement) |
| Le BOSU n'a pas augmenté l'activité musculaire mesurée chez 16 personnes très entraînées ; le rôle « équilibre et contrôle » donné au bosu dans cette fiche est un choix de coach (NON SOURCÉ : l'étude ne mesure ni l'équilibre ni le contrôle) | Wahl et Behm, « Not all instability training devices enhance muscle activation in highly resistance-trained individuals », J Strength Cond Res 2008;22(4):1360-1370, PMID 18545166 : 16 personnes très entraînées ; Dyna Disc et BOSU sans différence significative d'activité musculaire (seule exception : les érecteurs du rachis debout sur Dyna Disc, pas sur BOSU) ; ballon de gym et plateau d'équilibre : plus d'activité surtout debout (accroupi : seulement abdominaux bas et soléaire) ; aucune mesure d'équilibre ni de contrôle ; résumé Europe PMC lu | étude de laboratoire, 16 personnes très entraînées, EMG : public différent du public de l'app | 2026-10-24 | PROVISOIRE (résumé seulement) pour l'activité musculaire ; NON SOURCÉ pour le rôle équilibre/contrôle |
| Entraînement de l'équilibre sur plateau instable : moins de récidives d'entorse de cheville chez des sportifs déjà blessés (programme de 8 semaines à domicile, planche d'équilibre, pas un bosu) | Hupperets, Verhagen, van Mechelen, « Effect of unsupervised home based proprioceptive training on recurrences of ankle sprain: randomised controlled trial », BMJ 2009;339:b2684, PMID 19589822 : 522 sportifs de 12 à 70 ans ayant eu une entorse latérale de cheville ; programme de 8 semaines à domicile (planche d'équilibre) ; récidives 22 % contre 33 % (risque relatif 0,63) ; bénéfice significatif seulement chez ceux dont l'entorse n'avait pas été soignée médicalement (sous-groupe) ; résumé Europe PMC lu | essai contrôlé randomisé, 522 sportifs blessés : public et appareil différents du public et du bosu de l'app | 2026-10-24 | PROVISOIRE (résumé seulement ; ne valide pas la fiche, contexte) |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Bosu (gonflage, état), mur, sol | pratique de salle et raisonnement de coach ; aucune notice de fabricant lue | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; référence du dépôt, non rouverte pour ce lot. L'interdiction de l'échec seul est une règle de sécurité de coach | revue de revues ACSM (OK) ; la règle de sécurité n'est pas une conclusion de l'étude | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; NON SOURCÉ pour la règle de sécurité |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 2026-10-25, à contrôler par relecteur) |
| Grossesse et post-partum : bosu retiré (instabilité, risque de chute) ; remplacé par l'équilibre sur une jambe au mur sur sol plat | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe (éviter isométrique prolongé, Valsalva, chute, couché sur le dos) : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach) |
