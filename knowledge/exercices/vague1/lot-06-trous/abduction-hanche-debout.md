---
id: abduction-hanche-debout
nom: Abduction de hanche debout (jambe de côté)
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
| abduction-debout-chaise | Main sur un dossier de chaise | 1 | debutant | poids_du_corps, chaise | Debout à côté d'une chaise stable, une main sur le dossier, jambe d'appui légèrement fléchie. |
| abduction-debout-mur | Main sur un mur | 1 | debutant | poids_du_corps, mur | Debout de profil à un mur, une main à plat dessus. |
| abduction-debout-mini-bande | Avec une mini-bande, main sur la chaise | 2 | debutant | mini_bande, chaise | Même position ; mini-bande en boucle fermée autour des cuisses ou des chevilles, la jambe levée tend la bande. |

## Consignes
1. Tiens-toi debout, une main en appui (dossier ou mur), buste droit, pieds largeur de hanches.
2. Lève la jambe libre de côté, genou et pied vers l'avant, sans pencher le buste du côté opposé.
3. Marque un court arrêt, jambe levée à une hauteur où le buste reste droit.
4. Redescends lentement sans reposer le pied de façon brusque.
5. Fais toutes les répétitions d'un côté, puis change de côté.

## Points d'attention
- La photo montre une jambe très haute avec buste penché : lève moins haut et garde le buste droit.
- Appui à la main toujours présent : jamais les yeux fermés (D3).
- Aucune durée, série, répétition ni intensité chiffrée (aucune valeur sourcée) : voir program-logic.md et load-calibration.md.

## Erreurs fréquentes
- Pencher le buste pour lever plus haut.
- Balancer la jambe.
- Pied tourné vers le haut ou vers l'arrière.

## Progression / régression
- plus-facile : aucun
- plus-dur : abduction-debout-mini-bande

## Repères de dosage
Voir program-logic.md et load-calibration.md. Aucune valeur propre à ce mouvement.

## Sécurité et contre-indications
Brouillon prudent de `coach` du 2026-10-22, à reprendre par `kine`. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Hanche | adapter: amplitude:reduite | adapter: amplitude:reduite | retirer |
| Genou | garder | adapter: amplitude:reduite | retirer |
| Cheville | garder | adapter: appui:main-sur-support | retirer |
| Aine | garder | adapter: amplitude:reduite | retirer |

**Notes**
- hanche-n1 : jambe moins haute, buste droit.
- cheville-n2 : appui à la main ferme sur un support stable (R8).
- grossesse : appui à la main sur un support stable (équilibre). Post-partum : G7.

**Grossesse** : adapter: appui:main-sur-support
**Version plus douce** : abduction-debout-chaise

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) à la hanche, à l'aine, au genou ou à la cheville d'appui.
- Perte d'équilibre, mouvement qui n'est plus contrôlé : arrête la série.
- Douleur qui dure, qui s'aggrave ou qui réveille la nuit, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2) ; ces signes n'ont pas à être « diagnostiqués » par toi.
- Si le réglage « enceinte / post-partum » est coché : saignement, perte de liquide, contractions, vertige, douleur ou gonflement d'un mollet, fuite d'urine ou pesanteur dans le bas-ventre : arrête et contacte ta sage-femme ou ton médecin (G6, G7) ; en cas de saignement, de perte des eaux ou de contractions régulières : urgence, voir U1.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Chaise stable, sans roulettes, appuyée contre un mur ; ou un mur plein. Appuie-toi dessus avant la première série : si elle bouge, ne l'utilise pas (R8).
- Mini-bande : sans fissure avant chaque série.
- Sol non glissant ; chaussures aux pieds.

## Photo
- `Side_Leg_Raises/0.jpg` : affichable : oui (vue le 2026-10-22 : debout, main sur le dossier d'une chaise, position de départ ; WebP à créer par dev)
- `Side_Leg_Raises/1.jpg` : affichable : oui (vue le 2026-10-22 : jambe levée de côté, mais très haute avec le buste penché ; la fiche demande une amplitude plus courte et le buste droit : mention à afficher ; WebP à créer par dev)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Abduction de hanche debout, main sur une chaise | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db, entrée « Side_Leg_Raises » (niveau beginner) ; images vues le 2026-10-22 | base d'exercices (pratique, pas une étude) | 2026-10-22 | PROVISOIRE |
| Mini-bande autour des cuisses ou des chevilles | aucune source lue ; description de coach | - | - | NON SOURCÉ |
| Échelons, niveaux, muscles principaux et secondaires | choix de coach | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-22 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse, version plus douce et signes d'arrêt : brouillon prudent de coach, à reprendre par kine | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-22 | NON SOURCÉ (brouillon coach, à reprendre par kine) |
