---
id: pompe-archer
nom: Pompe archer
schema: poussee_h
type: force
niveau_min: avance
muscles_principaux: [pectoraux]
muscles_secondaires: [triceps, deltoides_anterieurs, abdominaux, obliques]
source_brouillon: [M0076]
statut: brouillon_coach
---
Pompe asymétrique : un bras plie, l'autre reste tendu sur le côté ; marche vers la pompe à un bras. Fiche séparée (décision de l'utilisateur, 21/10/2026). Réservée aux personnes qui font déjà des pompes au sol propres. Régression : `pompe-sol` ou `pompe-ecartee-sol`.

## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| pompe-archer-sol | Au sol | 1 | avance | poids_du_corps | Mains au sol très larges, pieds un peu écartés pour l'équilibre. |

## Consignes
1. Mains au sol très larges, doigts vers l'avant ; pieds un peu écartés.
2. Corps en ligne droite ; ventre et fessiers serrés.
3. Déplace le poids du corps vers une main et plie ce coude pour descendre de ce côté ; l'autre bras reste tendu.
4. Pousse avec le bras qui plie pour remonter au centre.
5. Alterne les côtés, ou fais toutes les répétitions d'un côté puis de l'autre.

## Points d'attention
- Le bras tendu sert seulement à l'équilibre : ne pousse pas avec.
- Mouvement lent, amplitude réduite au début.
- Bassin stable, pas de rotation du buste.

## Erreurs fréquentes
- Bassin qui tourne ou s'affaisse.
- Bras tendu qui pousse autant que l'autre.
- Descente trop rapide.

## Progression / régression
- plus-facile : pompe-ecartee
- plus-dur : a-creer:pompe-un-bras
pompe-sol -> pompe-ecartee-sol -> **pompe-archer-sol** (pompe à un bras : non rédigée) ; version plus facile : amplitude réduite, ou pompe-ecartee-sol

## Repères de dosage
Voir program-logic.md.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-22. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Statut : NON SOURCÉ (extrapolation de `kine` des règles communes ; aucune étude ne teste ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | retirer: remplacant:pompe-ecartee | retirer: remplacant:pompe-chaise | retirer |
| Coude | retirer: remplacant:pompe-ecartee | retirer: remplacant:pompe-chaise | retirer |
| Poignet | retirer: remplacant:pompe-ecartee | retirer: remplacant:pompe-chaise | retirer |
| Dos | adapter: variante:pompe-ecartee-sol | retirer: remplacant:pompe-chaise | retirer |

**Notes**
- general : charge très asymétrique sur une épaule et un coude : retirée dès la gêne légère au bras par prudence.
- grossesse : retirée ; remplaçant conseillé : pompe sur la chaise. Post-partum : G7.

**Grossesse** : retirer: remplacant:pompe-chaise
**Version plus douce** : pompe-ecartee

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente à l'épaule, au coude, au poignet ou au bas du dos.
- Bassin qui s'effondre ou bas du dos qui se creuse.
- Support qui glisse ou bouge.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
- aucune photo
Aucune photo affichable (la seule du brouillon vient de maxwu : interdite).

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Existence du mouvement (pompe archer) | brouillon M0076 (maxwu « Archer Push Up ») ; texte non copié, aucune autre source lue | - | 2026-10-21 | NON SOURCÉ |
| Consignes, niveau « avance », muscles | rédigés par coach à partir de la pompe (free-exercise-db « Pushups ») ; pratique courante | - | - | NON SOURCÉ |
| Sécurité (zones, grossesse, signes d'arrêt) | à compléter par kine | - | - | NON SOURCÉ (à compléter par kine) |
