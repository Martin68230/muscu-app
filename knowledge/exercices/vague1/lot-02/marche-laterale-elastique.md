---
id: marche-laterale-elastique
nom: Marche latérale à l'élastique
schema: squat
type: fonctionnel
niveau_min: debutant
muscles_principaux: [moyen_fessier]
muscles_secondaires: [fessiers, quadriceps]
source_brouillon: [M1637]
statut: controle_relecteur
couverture: substitut
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| marche-laterale-elastique-cuisses | Élastique au-dessus des genoux | 1 | debutant | elastique | Mini-bande en boucle fermée (une bande avec poignées ne convient pas) passée autour des cuisses, juste au-dessus des genoux. |
| marche-laterale-elastique-chevilles | Élastique aux chevilles | 2 | intermediaire | elastique | Même mini-bande en boucle fermée, passée autour des chevilles. |

## Consignes
1. Passe la boucle élastique autour des cuisses (ou des chevilles), debout, pieds largeur de hanches, genoux légèrement fléchis.
2. Fais un pas sur le côté en gardant l'élastique tendu, puis ramène l'autre pied sans le laisser toucher le premier.
3. Garde le bassin à niveau et les pointes de pieds vers l'avant.
4. Avance de quelques pas d'un côté, puis reviens de l'autre.
5. Garde une tension constante sur l'élastique.

## Points d'attention
- Pas courts et contrôlés ; l'élastique ne doit jamais se détendre complètement.
- Fiche rangée sous « squat » faute de schéma dédié aux fessiers latéraux : couverture « substitut ».
- Contrôle l'élastique avant chaque série.
- Seule une boucle fermée (mini-bande) convient : une bande avec poignées ne reste pas autour des cuisses ou des chevilles. Le tag `elastique` couvre les deux types ; à signaler à `dev` (tag dédié ou précision affichée).

## Erreurs fréquentes
- Genoux qui rentrent.
- Bassin qui bascule d'un côté.
- Pas trop larges, élastique relâché.

## Progression / régression
- plus-facile : aucun
- plus-dur : aucun

## Repères de dosage
Voir program-logic.md. Aucune valeur sourcée.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-22. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3). L'app n'a pas de zone « aine », « cuisse » ni « tendon d'Achille » : une gêne à l'aine se déclare sous « hanche », à l'arrière de la cuisse sous « hanche » ou « genou », au tendon d'Achille sous « cheville ».

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Genou | adapter: variante:marche-laterale-elastique-cuisses | adapter: variante:marche-laterale-elastique-cuisses | retirer |
| Hanche | garder | adapter: variante:marche-laterale-elastique-cuisses | retirer |

**Notes**
- genou-n1 : élastique au-dessus des genoux, pas aux chevilles.
- genou-n2 : même variante ; aucune augmentation de résistance (R2).
- hanche-n2 : élastique au-dessus des genoux, pas aux chevilles.
- grossesse : élastique au-dessus des genoux ; résistance la plus légère et un mur ou un dossier à portée de main (conseils non codés). Post-partum : G7.
- general : pas de version plus douce plus basse : prends un élastique plus léger. Boucle élastique abîmée : on la jette.

**Grossesse** : adapter: variante:marche-laterale-elastique-cuisses
**Version plus douce** : marche-laterale-elastique-cuisses

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) au genou, à la hanche ou à l'aine.
- Genoux qui rentrent, bassin qui bascule, perte d'équilibre : arrête la série.
- Élastique qui roule, glisse ou paraît abîmé : arrêt.
- Douleur qui dure, qui s'aggrave ou qui réveille la nuit, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2) ; ces signes n'ont pas à être « diagnostiqués » par toi.
- Si le réglage « enceinte / post-partum » est coché : saignement, perte de liquide, contractions, vertige, douleur ou gonflement d'un mollet, fuite d'urine ou pesanteur dans le bas-ventre : arrête et contacte ta sage-femme ou ton médecin (G6, G7) ; en cas de saignement, de perte des eaux ou de contractions régulières : urgence, voir U1.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Élastique : avant chaque série, ni fissure, ni coupure, ni zone amincie ; élastique abîmé jeté (R8). Ne le laisse pas remonter ni claquer.
- Sol antidérapant, espace dégagé sur les côtés, un mur ou un dossier à portée de main si l'équilibre manque.
- Si l'objet bouge, glisse ou grince : arrêt, et l'objet n'est plus utilisé (R8).

## Photo
- aucune photo : l'entrée libre la plus proche (`Monster_Walk`) montre une marche vers l'avant et l'arrière, pas sur le côté, avec deux bandes ; image non regardée, non affichée

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Marche latérale avec boucle élastique autour des cuisses ou des chevilles | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db, entrée « Monster_Walk » (niveau beginner, bandes aux chevilles et aux genoux ; id vérifié le 2026-10-22 ; brouillon M1637) : la source marche vers l'avant et l'arrière, la fiche marche sur le côté avec une seule boucle (écart de coach) | base d'exercices (pratique, pas une étude) | 2026-10-22 | PROVISOIRE (mouvement proche) ; marche latérale à une boucle : NON SOURCÉ |
| Le FIFA 11+ entier réduit les blessures du genou de 48 % (Thorborg 2017), sans détail par exercice ; l'effet de CET exercice sur le genou n'est pas établi | knowledge/sports.md (résumé de Thorborg 2017, non rouvert) | méta-analyse (programme entier, pas cet exercice) | 2026-10-21 | programme entier : OK (cité par sports.md) ; effet de cet exercice sur le genou : NON SOURCÉ |
| Échelons, niveaux, muscles et répartition principaux / secondaires | choix de coach (décision de format de l'utilisateur, 21/10/2026) | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-22 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-22 | NON SOURCÉ (extrapolation, à valider) |
| Contrôle de l'élastique avant chaque série (fissures, zones amincies) | raisonnement mécanique de `kine` ; aucune source lue | - | 2026-10-22 | NON SOURCÉ |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-22 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
