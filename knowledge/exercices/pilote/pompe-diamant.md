---
id: pompe-diamant
nom: Pompe diamant (mains rapprochées)
schema: poussee_h
type: force
niveau_min: intermediaire
muscles_principaux: [triceps]
muscles_secondaires: [pectoraux, deltoides_anterieurs, abdominaux]
source_brouillon: [M0989, M0990, M0740]
statut: brouillon_coach
---
Variante de la pompe qui déplace l'effort vers les triceps : fiche séparée (décision de l'utilisateur, 21/10/2026). Régression : `pompe-genoux` ou `pompe-sol` (fiche `pompe`).

## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| pompe-diamant-sol | Au sol | 1 | intermediaire | poids_du_corps | Mains au sol sous la poitrine, index et pouces se touchent en forme de losange, sur les pointes de pieds. |

## Consignes
1. Place les mains sous la poitrine, rapprochées : index et pouces se touchent.
2. Corps en planche, de la tête aux talons ; ventre et fessiers serrés.
3. Descends la poitrine vers tes mains en gardant les coudes près du corps.
4. Pousse le sol pour tendre les bras sans casser la ligne du corps.
5. Trop dur ? Fais-la sur les genoux, ou rapproche seulement un peu les mains.

## Points d'attention
- Coudes près du corps, pas largement ouverts.
- Descente contrôlée.
- Tête dans le prolongement du corps.

## Erreurs fréquentes
- Bassin qui tombe.
- Coudes qui s'écartent largement.
- Amplitude trop courte.

## Progression / régression
- plus-facile : pompe-genoux
- plus-dur : aucun
pompe-sol (fiche `pompe`) -> **pompe-diamant-sol** ; version plus facile : mains un peu moins serrées, ou sur les genoux (pompe-genoux)

## Repères de dosage
Voir program-logic.md.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-22. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Statut : NON SOURCÉ (extrapolation de `kine` des règles communes ; aucune étude ne teste ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | garder | retirer: remplacant:pompe-chaise | retirer |
| Coude | adapter: amplitude:reduite | retirer: remplacant:pompe-chaise | retirer |
| Poignet | retirer: remplacant:pompe-chaise | retirer: remplacant:pompe-chaise | retirer |
| Dos | garder | adapter: variante:pompe-genoux | retirer |

**Notes**
- coude-n1 : mains rapprochées = triceps et coudes très sollicités : amplitude réduite.
- poignet-n1 : mains rapprochées, poignets très pliés : retiré dès la gêne légère par prudence.
- grossesse : retirée ; remplaçant conseillé : pompe sur la chaise. Post-partum : G7.

**Grossesse** : retirer: remplacant:pompe-chaise
**Version plus douce** : pompe-genoux

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente à l'épaule, au coude, au poignet ou au bas du dos.
- Bassin qui s'effondre ou bas du dos qui se creuse.
- Support qui glisse ou bouge.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
- `Push-Ups_-_Close_Triceps_Position/0.jpg` : affichable : à vérifier (image non regardée ; mains rapprochées, pas forcément en losange : la consigne prime)
- `Push-Ups_-_Close_Triceps_Position/1.jpg` : affichable : à vérifier (image non regardée ; même réserve)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Mains plus rapprochées que la largeur d'épaules, descente poitrine près du sol, retour bras tendus ; triceps en principal, pectoraux et épaules en secondaire | free-exercise-db « Push-Ups - Close Triceps Position » (M0740) https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Push-Ups_-_Close_Triceps_Position.json (niveau source : intermediate) ; réécrit par coach | base d'exercices (domaine public), pas d'étude | 2026-10-21 | PROVISOIRE |
| Position « losange » des mains | brouillons M0989 (maxwu « Diamond Push-Up ») et M0990 (wger « Diamond push ups ») : prouvent seulement que le mouvement existe ; textes non copiés | - | 2026-10-21 | NON SOURCÉ |
| Coudes près du corps ; conseil de régression | pratique courante | - | - | NON SOURCÉ |
| Sécurité (zones, grossesse, signes d'arrêt) | à compléter par kine | - | - | NON SOURCÉ (à compléter par kine) |
