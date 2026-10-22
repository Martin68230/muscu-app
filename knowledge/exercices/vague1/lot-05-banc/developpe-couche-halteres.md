---
id: developpe-couche-halteres
nom: Développé couché aux haltères
schema: poussee_h
type: force
niveau_min: debutant
muscles_principaux: [pectoraux]
muscles_secondaires: [triceps, deltoides_anterieurs]
source_brouillon: []
statut: brouillon_coach
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| developpe-couche-halteres-prise-neutre | Paumes face à face | 1 | debutant | halteres, banc | Allongé sur un banc plat, pieds au sol, un haltère par main, paumes face à face, coudes un peu écartés du buste. |
| developpe-couche-halteres-classique | Paumes vers les pieds | 1 | debutant | halteres, banc | Même position, poignets alignés avec les avant-bras, haltères au niveau de la poitrine. |
| developpe-couche-halteres-un-bras | Un bras à la fois | 2 | intermediaire | halteres, banc | Un seul haltère, l'autre main posée sur le ventre ; le buste reste bien à plat sur le banc, sans tourner. |

## Consignes
1. Assieds-toi sur le banc avec les haltères sur les cuisses, puis allonge-toi en les montant un par un à hauteur de la poitrine ; pieds à plat au sol.
2. Omoplates serrées contre le banc, poignets droits, haltères au-dessus des épaules, bras tendus sans verrouiller les coudes.
3. Descends lentement les haltères sur les côtés de la poitrine, coudes à environ 45 degrés du buste, jusqu'à sentir l'étirement sans gêne à l'épaule.
4. Pousse les haltères vers le haut en les rapprochant un peu, sans les cogner.
5. Pour finir, repose les haltères sur les cuisses en te redressant.

## Points d'attention
- Choisis des haltères que tu contrôles : la descente dure plus longtemps que la montée.
- Les fesses et la tête restent sur le banc, le bas du dos ne se cambre pas fortement.
- Les haltères ne passent jamais au-dessus du visage : ils montent au-dessus des épaules.
- Banc stable, qui ne bouge pas.
- Aucune durée, série, répétition ni intensité chiffrée (aucune valeur sourcée) : voir program-logic.md et load-calibration.md.

## Erreurs fréquentes
- Coudes écartés à 90 degrés du buste (l'épaule travaille en position inconfortable).
- Rebondir en bas, ou descendre plus bas que ce que l'épaule accepte.
- Jeter les haltères au sol ou sur le ventre en fin de série.
- Soulever les fesses du banc pour finir une répétition.

## Progression / régression
- plus-facile : developpe-au-sol-halteres
- plus-dur : aucun

## Repères de dosage
Voir program-logic.md et load-calibration.md. Aucune valeur propre à ce mouvement.

## Sécurité et contre-indications
**Proposition de `coach` (22/10/2026), à reprendre et compléter par `kine`** : le tableau, la ligne Grossesse et la version plus douce ci-dessous sont des choix prudents NON SOURCÉS. Les signes qui doivent faire arrêter, les objets du quotidien (banc, haltères, R8, R9) et les notes détaillées par niveau sont à rédiger par `kine` (règles communes : knowledge/regles-securite-communes.md ; format : knowledge/format-fiches.md §4). Rien ici n'est un diagnostic.

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | adapter: amplitude:reduite | retirer: remplacant:developpe-au-sol-halteres | retirer |
| Coude | garder | adapter: charge:legere | retirer |
| Poignet | garder | adapter: charge:legere | retirer |
| Dos | garder | adapter: charge:legere | retirer |

**Notes**
- epaule-n1 : descendre moins bas, coudes plus près du buste.
- dos-n2 : haltères légers, pas d'augmentation (R2).
- grossesse : position allongée sur le dos retirée (G4) ; remplacé par le développé épaules assis dossier droit.
- general : signes d'arrêt à rédiger par kine.

**Grossesse** : retirer: remplacant:developpe-epaules-halteres
**Version plus douce** : developpe-couche-halteres-prise-neutre

## Photo
- `Dumbbell_Bench_Press/0.jpg` : affichable : oui (vue le 22/10/2026 ; départ, haltères à hauteur de poitrine ; WebP à créer : public/photos/free-exercise-db/Dumbbell_Bench_Press-0.webp)
- `Dumbbell_Bench_Press/1.jpg` : affichable : oui (vue le 22/10/2026 ; arrivée, bras tendus ; WebP à créer : Dumbbell_Bench_Press-1.webp)
- `Dumbbell_Bench_Press_with_Neutral_Grip/0.jpg` : affichable : non (vue le 22/10/2026 ; marque d'une machine visible en arrière-plan, non recadrable proprement)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Allongé sur un banc plat, haltères à hauteur de poitrine puis poussés au-dessus des épaules, retour contrôlé | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db, entrée « Dumbbell_Bench_Press » (niveau beginner) | base d'exercices (pratique, pas une étude) | 2026-10-22 | PROVISOIRE |
| Un banc horizontal active à la fois le haut et le bas du grand pectoral ; 30 à 45 degrés d'inclinaison changent l'activation à certains moments du mouvement | Lauver, Cayot, Scheuermann, Eur J Sport Sci 2016;16(3):309-316, https://pubmed.ncbi.nlm.nih.gov/25799093/ ; résumé lu via moteur de recherche, texte complet non lu | étude de laboratoire (EMG de surface), 14 hommes entraînés, développé à la BARRE à 65 % du maximum : ne porte ni sur les haltères ni sur des débutants | 2026-10-22 | PROVISOIRE (résumé seulement) |
| Échelons, niveaux, muscles principaux et secondaires | choix de coach | - | 2026-10-22 | NON SOURCÉ |
| Banc stable, réglage bloqué ; haltère fixe de préférence, disques serrés si réglable | regles-securite-communes.md §7 et R8, R9 | - | 2026-10-22 | NON SOURCÉ |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence), non encore reprises par kine | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-22 | NON SOURCÉ (à reprendre par kine, à contrôler par relecteur) |
