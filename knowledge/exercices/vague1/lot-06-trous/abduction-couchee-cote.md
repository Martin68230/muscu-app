---
id: abduction-couchee-cote
nom: Abduction couchée sur le côté
schema: hanche_laterale
type: force
niveau_min: debutant
muscles_principaux: [moyen_fessier]
muscles_secondaires: [fessiers]
source_brouillon: []
statut: brouillon_coach
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| abduction-couchee-cote-base | Sur le côté, jambe du dessous pliée | 1 | debutant | poids_du_corps, tapis | Couché sur le côté, tête sur le bras, jambe du dessous pliée pour la stabilité, jambe du dessus tendue dans le prolongement du corps. |
| abduction-couchee-cote-dos-mur | Dos contre un mur | 1 | debutant | mur, tapis | Même position, dos et fesses contre un mur : le bassin ne peut pas basculer en arrière. |
| abduction-couchee-cote-mini-bande | Avec une mini-bande | 2 | debutant | mini_bande, tapis | Même position ; mini-bande en boucle fermée autour des cuisses, au-dessus des genoux. |

## Consignes
1. Couche-toi sur le côté sur un tapis, hanches l'une sur l'autre, jambe du dessous pliée, jambe du dessus tendue.
2. Pointe du pied du dessus vers l'avant, bassin bien droit (ne bascule pas en arrière).
3. Lève la jambe du dessus de côté, seulement tant que ton bassin reste stable.
4. Redescends lentement sans poser la jambe sur l'autre.
5. Fais toutes les répétitions d'un côté, puis change de côté.

## Points d'attention
- Mouvement petit et contrôlé : si le bassin bascule, tu lèves trop haut.
- Seule une boucle fermée (tag `mini_bande`) convient pour l'échelon 2.
- Aucune durée, série, répétition ni intensité chiffrée (aucune valeur sourcée) : voir program-logic.md et load-calibration.md.

## Erreurs fréquentes
- Bascule du bassin vers l'arrière.
- Pied tourné vers le plafond (c'est alors le fléchisseur de hanche qui travaille).
- Balancer la jambe avec de l'élan.

## Progression / régression
- plus-facile : aucun
- plus-dur : abduction-couchee-cote-mini-bande

## Repères de dosage
Voir program-logic.md et load-calibration.md. Aucune valeur propre à ce mouvement.

## Sécurité et contre-indications
Brouillon prudent de `coach` du 2026-10-22, à reprendre par `kine`. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Hanche | adapter: amplitude:reduite | adapter: amplitude:reduite | retirer |
| Dos | garder | adapter: amplitude:reduite | retirer |
| Genou | garder | adapter: variante:abduction-couchee-cote-base | retirer |
| Aine | garder | adapter: amplitude:reduite | retirer |

**Notes**
- hanche-n1 : montée plus courte, bassin stable.
- genou-n2 : sans mini-bande (pas de résistance).
- grossesse : couché sur le côté, sans particularité ; la position sur le dos est évitée, pas celle-ci. Post-partum : G7. Confirmation par kine.

**Grossesse** : garder
**Version plus douce** : abduction-couchee-cote-base

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) à la hanche, au bas du dos, au genou ou à l'aine.
- Perte d'équilibre, mouvement qui n'est plus contrôlé : arrête la série.
- Douleur qui dure, qui s'aggrave ou qui réveille la nuit, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2) ; ces signes n'ont pas à être « diagnostiqués » par toi.
- Si le réglage « enceinte / post-partum » est coché : saignement, perte de liquide, contractions, vertige, douleur ou gonflement d'un mollet, fuite d'urine ou pesanteur dans le bas-ventre : arrête et contacte ta sage-femme ou ton médecin (G6, G7) ; en cas de saignement, de perte des eaux ou de contractions régulières : urgence, voir U1.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Sol non glissant, tapis ou surface ferme ; espace dégagé autour de toi.
- Mini-bande (échelon 2) : sans fissure ni zone amincie avant chaque série (R8).
- Mur plein, sans saillie, pour la variante dos au mur.

## Photo
- aucune photo (free-exercise-db n'a pas d'entrée adaptée : « Side_Leg_Raises » est une abduction debout, voir la fiche abduction-hanche-debout)
- illustration : public/illustrations/abduction-couchee-cote.svg : affichable : non (à créer par dev : vue de face : jambe du dessus levée de côté, jambe du dessous pliée)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Abduction couchée sur le côté | aucune entrée free-exercise-db correspondante (la plus proche, « Side_Leg_Raises », est debout) ; description de coach | - | - | NON SOURCÉ |
| Échelons, niveaux, muscles principaux et secondaires | choix de coach | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-22 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse, version plus douce et signes d'arrêt : brouillon prudent de coach, à reprendre par kine | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-22 | NON SOURCÉ (brouillon coach, à reprendre par kine) |
