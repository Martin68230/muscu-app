---
id: extension-genou-elastique
nom: Extension du genou assis
alias: [leg extension, extension de jambe, extension de genou]
schema: squat
type: force
niveau_min: debutant
muscles_principaux: [quadriceps]
muscles_secondaires: []
source_brouillon: []
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile. Pas de machine : équivalent maison de l'extension de jambe (knowledge/calibrage-kaggle.md §3). Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| extension-genou-chaise-sans-charge | Sans élastique | 1 | debutant | poids_du_corps, chaise | Assis au fond d'une chaise stable (4 pieds, sans roulettes), dos contre le dossier, pieds à plat. |
| extension-genou-chaise-elastique | Élastique à la cheville | 2 | debutant | elastique, chaise | Même position ; l'élastique passe autour d'une cheville et sous le pied de l'autre jambe, tendu à peine au départ. |

## Consignes
1. Assieds-toi au fond de la chaise, dos contre le dossier, les deux pieds à plat.
2. Tends doucement une jambe devant toi en gardant la cuisse posée sur l'assise.
3. Arrête-toi quand la jambe est presque droite, sans claquer le genou : il reste souple.
4. Marque une courte pause en sentant le devant de la cuisse travailler.
5. Redescends lentement, en 3 secondes environ, jusqu'au pied au sol.
6. Fais toutes les répétitions d'un côté, puis change de jambe.

## Points d'attention
- La jambe se tend sans à-coup : jamais de verrouillage brusque du genou.
- Le dos reste contre le dossier, les fesses ne glissent pas vers l'avant.
- Élastique tendu à peine au départ ; un élastique trop dur fait compenser par le dos ou la hanche.
- Aucune durée, série, répétition ni intensité chiffrée (aucune valeur sourcée) : voir program-logic.md et load-calibration.md.

## Erreurs fréquentes
- Balancer la jambe pour la lancer.
- Verrouiller le genou en fin de mouvement.
- Se pencher en arrière pour aider.
- Descendre trop vite en lâchant l'élastique.

## Progression / régression
- plus-facile : extension-genou-chaise-sans-charge
- plus-dur : aucun

## Repères de dosage
Voir program-logic.md et load-calibration.md. Aucune valeur propre à ce mouvement.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-11-12, **validé par `kine` le 12/11/2026** (genou) : cases par zone, notes, ligne Grossesse et signes d'arrêt contrôlés contre regles-securite-communes.md (R1 à R10, G4, S1, S2) et format-fiches.md §4 ; cohérence notes / cases vérifiée. Les tableaux par zone restent NON SOURCÉ / PROVISOIRE (choix prudents, aucune étude exercice par exercice). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic. Tous les choix par zone sont des choix prudents NON SOURCÉS.

**Contre-indications par zone** (1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder.

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Genou | adapter: variante:extension-genou-chaise-sans-charge | retirer | retirer |
| Cheville | adapter: variante:extension-genou-chaise-sans-charge | adapter: variante:extension-genou-chaise-sans-charge | retirer |
| Hanche | garder | adapter: amplitude:reduite | retirer |
| Dos | garder | adapter: amplitude:reduite | retirer |

**Notes**
- genou-n1 : sans élastique, mouvement lent, sans verrouiller ; pas de progression (R2). genou-n2 : retiré, le genou travaille directement ; avis de `kine` attendu avant toute version isométrique à angle réduit.
- cheville-n1 : imposé par la case (idem n2), version sans élastique (extension-genou-chaise-sans-charge) pour éviter toute traction sur l'articulation.
- general : douleur pendant l'exercice : arrête, pas de progression (R4).
- general : vérifie que l'élastique ne peut pas glisser ni claquer ; jamais autour d'une cheville douloureuse.
- grossesse : exercice assis, bien toléré ; garder une amplitude confortable. Post-partum : G7.

**Grossesse** : garder
**Version plus douce** : extension-genou-chaise-sans-charge

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) au genou, à la rotule ou à la cheville : arrête (R4).
- Craquement douloureux, genou qui se dérobe ou qui se bloque : arrête et consulte.
- Douleur qui dure, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2).
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Chaise stable sans roulettes, non pliante, dossier appuyé contre un mur ; élastique en bon état, sans fissure (R8).

## Photo
- illustration : public/illustrations/extension-genou-elastique.svg : affichable : oui (illustration originale de l'app)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Équivalent maison de l'extension de jambe | knowledge/calibrage-kaggle.md §3 (piste rédigée par coach, aucun texte de base repris) | - | 2026-11-12 | NON SOURCÉ |
| Muscles, niveau, échelons, consignes | choix de coach, consignes écrites sans copie de source | - | 2026-11-12 | NON SOURCÉ |
| Tableau par zone, grossesse, signes d'arrêt | choix prudents d'après regles-securite-communes.md ; contrôlé par `kine` le 12/11/2026 ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-11-12 | NON SOURCÉ (contrôlé par `kine` le 12/11/2026) |
| Règles communes R1 à R10 et règles G, S, U | knowledge/regles-securite-communes.md | voir ce fichier | 2026-11-12 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE |
