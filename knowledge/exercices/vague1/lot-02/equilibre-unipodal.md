---
id: equilibre-unipodal
nom: Équilibre sur une jambe
schema: mobilite
type: fonctionnel
niveau_min: debutant
muscles_principaux: [moyen_fessier, mollets]
muscles_secondaires: [fessiers, quadriceps, peroniers]
source_brouillon: []
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| equilibre-unipodal-mur | Doigts au mur | 1 | debutant | poids_du_corps, mur | Debout à côté d'un mur, les doigts posés dessus au besoin. |
| equilibre-unipodal-libre | Sans appui, sol plat | 2 | debutant | poids_du_corps | Debout, mains sur les hanches ou le long du corps, loin d'un meuble. |
| equilibre-unipodal-serviette | Sur une serviette pliée | 3 | intermediaire | poids_du_corps, serviette | Un pied sur une serviette pliée en quatre, posée sur un sol non glissant. |
| equilibre-unipodal-jambe-libre | Avec mouvement de la jambe libre | 3 | intermediaire | poids_du_corps | Sol plat ; la jambe libre dessine un arc devant, sur le côté puis derrière, sans toucher le sol. |

## Consignes
1. Tiens-toi debout sur une jambe, genou légèrement plié, hanches de niveau, regard fixé sur un point devant toi.
2. Garde le pied à plat et répartis le poids entre le talon, le gros orteil et le petit orteil.
3. Tiens la position en gardant le bassin et les épaules droits, sans t'accrocher.
4. Repose le pied libre, puis recommence ; fais les deux côtés.
5. Passe à l'échelon suivant seulement quand la position est stable sans appui.

## Points d'attention
- Un côté peut être nettement moins stable que l'autre : commence par le plus difficile.
- La difficulté monte en réduisant l'appui ou en ajoutant un support mou ; « yeux fermés » n'est volontairement pas proposé (voir README).
- La durée de maintien n'est pas fixée ici (aucune valeur sourcée).

## Erreurs fréquentes
- Genou verrouillé.
- Hanche qui se déporte sur le côté.
- Épaules qui compensent en s'agitant.

## Progression / régression
- plus-facile : aucun
- plus-dur : aucun

## Repères de dosage
Voir program-logic.md. Aucune durée de maintien sourcée.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-22. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3). L'app n'a pas de zone « aine », « cuisse » ni « tendon d'Achille » : une gêne à l'aine se déclare sous « aine », à l'arrière de la cuisse sous « hanche » ou « genou », au tendon d'Achille sous « cheville ».

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Cheville | adapter: variante:equilibre-unipodal-mur | adapter: variante:equilibre-unipodal-mur | retirer |
| Genou | garder | adapter: variante:equilibre-unipodal-mur | retirer |
| Hanche | garder | adapter: variante:equilibre-unipodal-mur | retirer |
| Cuisse | garder | adapter: variante:equilibre-unipodal-mur | retirer |
| Aine | garder | adapter: variante:equilibre-unipodal-mur | retirer |

**Notes**
- cheville-n1 : doigts au mur, sol plat : ni serviette, ni mouvement de la jambe libre.
- cheville-n2 : même variante ; aucune augmentation de difficulté (R2).
- genou-n2 : doigts au mur, sol plat.
- hanche-n2 : doigts au mur, sol plat.
- cuisse-n2 : doigts au mur, sol plat, pas de mouvement de la jambe libre. NON SOURCÉ (choix prudent de `kine`).
- aine-n2 : doigts au mur, sol plat, pas de mouvement de la jambe libre. NON SOURCÉ (choix prudent de `kine`).
- grossesse : doigts au mur : l'équilibre change en grossesse, le mur évite la chute ; jamais les yeux fermés ; pas de serviette. Post-partum : G7.
- general : échelon le plus simple possible : pas de version plus douce plus basse que le mur. Yeux fermés non proposé.

**Grossesse** : adapter: variante:equilibre-unipodal-mur
**Version plus douce** : equilibre-unipodal-mur

**Signes qui doivent faire arrêter**
- Douleur (pas la simple fatigue du muscle) à la cheville, au genou ou à la hanche.
- Vertige, sensation de chute imminente, cheville qui roule : pose le pied et attrape le mur.
- Cheville qui se dérobe répétitivement : arrête et consulte si cela dure (S1).
- Douleur qui dure, qui s'aggrave ou qui réveille la nuit, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2) ; ces signes n'ont pas à être « diagnostiqués » par toi.
- Si le réglage « enceinte / post-partum » est coché : saignement, perte de liquide, contractions, vertige, douleur ou gonflement d'un mollet, fuite d'urine ou pesanteur dans le bas-ventre : arrête et contacte ta sage-femme ou ton médecin (G6, G7) ; en cas de saignement, de perte des eaux ou de contractions régulières : urgence, voir U1.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Mur ou support stable à portée de main ; aucun meuble, tapis ou objet au sol autour de toi (R8).
- Serviette (échelon 3) : pliée en quatre, sur un sol non glissant, jamais sur du carrelage lisse sans antidérapant ; si elle glisse, on ne l'utilise plus (R8).
- Pieds nus ou chaussures qui tiennent bien le pied ; sol non glissant.
- Si l'objet bouge, glisse ou grince : arrêt, et l'objet n'est plus utilisé (R8).

## Photo
- aucune photo (aucune entrée libre pour l'équilibre unipodal ; « Balance_Board » demande un plateau)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Équilibre sur une jambe à pied plat puis sur support mou | aucune entrée free-exercise-db correspondante trouvée (recherche par nom, 22/10/2026) ; description de coach. Entraînement d'équilibre et entorses de cheville : McKeon PO, Hertel J, J Athl Train 2008;43:305-315, revue systématique https://search.pedro.org.au/search-results/record-detail/23678 : l'entraînement d'équilibre préventif réduit nettement le risque d'entorse (effet plus grand après une entorse antérieure) ; au moins 6 semaines après une entorse aiguë réduisent les récidives ; preuve insuffisante en instabilité chronique | revue systématique (recherche jusqu'à octobre 2006) ; résumé PEDro lu, texte intégral non lu, aucun chiffre repris | 2026-10-22 | OK pour le principe (équilibre sur une jambe préventif des entorses) ; échelons de cette fiche : NON SOURCÉ |
| Danse et volley : réceptions de saut contrôlées, équilibre sur une jambe, renforcement des mollets et chevilles | knowledge/sports.md, règle de conception 4 (à valider par kine) ; danse : revue systématique de 8 études, J Dance Med Sci 2026 (vol. 30) https://lida.sport-iat.de/ta/Record/4091443?lng=en (preuve initiale) | règle de conception de coach + revue de faible niveau de preuve | 2026-10-21 | PROVISOIRE |
| Le programme FIFA 11+ (échauffement de football) réduit les blessures de 39 % (rapport des taux 0,61) | Thorborg et al., Br J Sports Med 2017;51:562 https://bjsm.bmj.com/content/51/7/562, repris dans knowledge/sports.md | méta-analyse de 6 essais, joueurs amateurs et sub-élite ; résumé lu à la rédaction de sports.md, non rouvert | 2026-10-21 | OK pour le programme dans son ensemble. Que CET exercice (ou cette forme) en fasse partie : NON SOURCÉ (contenu détaillé du programme non lu) |
| Échelons, niveaux, muscles et répartition principaux / secondaires | choix de coach (décision de format de l'utilisateur, 21/10/2026) | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-22 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-22 | NON SOURCÉ (extrapolation, à valider) |
| Équilibre : yeux fermés non proposé (réponse de `kine` à la question 3 du README : d'accord, risque de chute sans surveillance) ; appui d'un mur ou d'un support à portée | choix de prudence de `kine` ; aucune source lue | - | 2026-10-22 | NON SOURCÉ |
| Aine, ischios, tendon d'Achille : rangés sous les zones hanche, genou ou cheville faute de zone dédiée | choix de conception de `kine` (les zones de l'app sont cou, épaule, coude, poignet, dos, hanche, genou, cheville) | - | 2026-10-22 | NON SOURCÉ (conception) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-22 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
