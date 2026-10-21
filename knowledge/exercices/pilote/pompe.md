---
id: pompe
nom: Pompe
schema: poussee_h
type: force
niveau_min: debutant
muscles_principaux: [pectoraux]
muscles_secondaires: [triceps, deltoides_anterieurs, abdominaux, dentele_anterieur]
source_brouillon: [M1803, M1418, M1804, M0482, M1497, M1504, M1053, M0739]
statut: brouillon_coach
---
Fiche fusionnée le 21/10/2026 (décision de l'utilisateur) : ex-`pompe`, `pompe-inclinee` et `pompe-genoux`, plus l'échelon « pieds surélevés » (M1053). Anciennes fiches : knowledge/exercices/ecartees/. Les variantes qui changent le muscle travaillé ont leur propre fiche : `pompe-diamant`, `pompe-ecartee`, `pompe-archer` ; les pompes piquées (épaules) restent `pompe-piquee` et `pompe-piquee-pieds-sureleves`.

## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).
Du plus facile au plus dur : les mains hautes (mur, chaise) allègent la charge ; les genoux au sol aussi ; les pieds hauts l'alourdissent. Les ids d'échelon sont stables : ne les renomme pas.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| pompe-mur | Au mur | 1 | debutant | mur | Debout face au mur, mains sur le mur à hauteur d'épaules, pieds reculés d'un pas. |
| pompe-chaise | Mains sur une chaise | 2 | debutant | chaise, mur | Chaise stable, dossier calé contre un mur, mains sur le bord de l'assise (côté opposé au mur), pieds reculés : corps en planche inclinée. |
| pompe-genoux | Sur les genoux | 3 | debutant | poids_du_corps, tapis | Genoux sur un tapis ou une serviette pliée, mains au sol, épaules-hanches-genoux alignés. |
| pompe-sol | Classique (au sol) | 4 | debutant | poids_du_corps | Mains au sol, sur les pointes de pieds. |
| pompe-pieds-sureleves | Pieds surélevés | 5 | intermediaire | chaise, mur | Mains au sol, pieds sur une chaise stable calée contre un mur : plus les pieds sont hauts, plus c'est dur. |

L'ancienne variante « mains sur la première marche » n'est pas reprise : la chaise joue le même rôle (mains hautes) avec un support plus stable ; elle est consignée au journal du README.

## Consignes
1. Mains un peu plus larges que les épaules (sur le mur, la chaise ou le sol).
2. Corps en ligne droite, de la tête aux talons (aux genoux pour l'échelon 3) : ventre et fessiers serrés.
3. Plie les coudes pour amener la poitrine vers le support ou le sol.
4. Coudes à environ 45° du corps, pas à l'horizontale.
5. Pousse pour tendre les bras, sans casser la ligne du corps.
Pieds surélevés : même geste, tête et dos restent alignés, ne laisse pas le bassin s'affaisser.

## Points d'attention
- Ventre et fessiers serrés tout le long.
- Tête dans le prolongement du corps ; la poitrine arrive en premier, pas le menton.
- Support qui ne glisse pas (mur : semelles qui accrochent ; chaise : calée).
- Descente contrôlée.
- Si la forme se dégrade, passe à l'échelon d'en dessous pour finir la série.

## Erreurs fréquentes
- Bassin qui tombe ou fesses en l'air (sur les genoux : fesses en arrière, « révérence »).
- Coudes à l'horizontale.
- Demi-répétitions.

## Progression / régression
**pompe-mur** (1) -> pompe-chaise (2) -> pompe-genoux (3) -> pompe-sol (4) -> pompe-pieds-sureleves (5) -> pompe-diamant, pompe-ecartee, pompe-archer (autres muscles ou plus dur) ; pompe-sol -> pompe avec descente lente (non rédigée). Passer à l'échelon suivant : load-calibration.md règle 5 (NON SOURCÉ).

## Repères de dosage
Voir program-logic.md. Progression par échelle de variantes : load-calibration.md règle 5 (NON SOURCÉ).

## Sécurité et contre-indications
**À refaire par `kine`** (fiche fusionnée le 21/10/2026, nouveau format de knowledge/format-fiches.md). Les tableaux d'origine sont dans ecartees/pompe-ancienne.md, ecartees/pompe-inclinee.md et ecartees/pompe-genoux.md (ids anciens ; correspondance : pompe-inclinee-mur = pompe-mur ; pompe-inclinee-chaise et pompe-inclinee = pompe-chaise ; pompe-inclinee-marche = supprimée, voir pompe-chaise ; pompe-genoux = pompe-genoux ; pompe-sol = ex-pompe). Le dernier échelon (pompe-pieds-sureleves) n'a encore aucune ligne de sécurité : tête plus basse que les pieds, charge sur les épaules et les poignets plus forte.
Rappel de règles communes : knowledge/regles-securite-communes.md (R1 à R10, G, S, U).

Objets du quotidien (reprise des anciennes fiches, à valider par `kine`) : chaise à 4 pieds, sans roulettes, non pliante, en bon état, dossier calé contre un mur, sol non glissant ; avant la première série, appuie-toi dessus comme pendant l'exercice : si elle bouge, glisse ou grince, n'utilise pas cette chaise.

## Photo
- `public/photos/free-exercise-db/Incline_Push-Up-0.webp` et `Incline_Push-Up-1.webp` (recadrées par `dev`, logo retiré) : affichable : **oui, pour l'échelon `pompe-chaise` seulement** (décision de `coach` le 21/10/2026 : mains sur une box en bois à peu près à hauteur d'assise, proche de la chaise ; mention « montré sur une box »). Non affichable pour les autres échelons (mur, genoux, sol, pieds surélevés). Réserve : les fichiers n'existaient pas encore dans le dépôt au moment de la rédaction ; `relecteur` doit constater que le recadrage retire bien la bannière et le logo avant l'affichage.
- `Pushups/0.jpg`, `Pushups/1.jpg` (free-exercise-db) : affichable : à vérifier (images non regardées) ; pour l'échelon `pompe-sol`.
- `Push-Ups_With_Feet_Elevated/0.jpg`, `1.jpg` : affichable : à vérifier (non regardées) ; pour l'échelon `pompe-pieds-sureleves` (source : pieds sur un banc).
Échelons mur et genoux : aucune photo libre (la photo du brouillon pour les genoux vient de maxwu : interdite).

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Pompe au sol : mains plus larges que les épaules, bras tendus, poitrine près du sol, retour bras tendus | free-exercise-db « Pushups » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Pushups.json (niveau source : beginner) ; réécrit par coach | base d'exercices (domaine public), pas d'étude | 2026-10-21 | PROVISOIRE |
| Pompe avec mains surélevées : mains sur un support un peu plus larges que les épaules, corps droit, poitrine vers le bord, bras tendus en haut (échelons mur et chaise) | free-exercise-db « Incline_Push-Up » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Incline_Push-Up.json (niveau source : beginner) ; réécrit par coach | idem | 2026-10-21 | PROVISOIRE |
| Pieds sur un banc : plus l'élévation est haute, plus la résistance est forte | free-exercise-db « Push-Ups_With_Feet_Elevated » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Push-Ups_With_Feet_Elevated.json (niveau source : beginner) ; réécrit par coach | idem | 2026-10-21 | PROVISOIRE |
| Niveau « intermediaire » de pompe-pieds-sureleves (la source dit beginner) | choix de coach : plus dur que la pompe au sol ; changement tracé le 21/10/2026 | - | - | NON SOURCÉ |
| Muscles (pectoraux en principal ; épaules, triceps en secondaire) | mêmes fiches ; tronc et dentelé ajoutés par coach | idem | 2026-10-21 | PROVISOIRE (ajouts : NON SOURCÉ) |
| Échelon genoux (existence du mouvement) | brouillon M1497 (wger « knee push-ups ») et M1504 ; ACE liste une « Bent Knee Push-up » de niveau débutant (page d'index seulement, détail non lu) https://www.acefitness.org/resources/everyone/exercise-library/ | organisme de certification ; sources non lues | 2026-10-21 | NON SOURCÉ (le brouillon wger prouve seulement que le mouvement existe) |
| Échelon mur (existence du mouvement) | brouillon M1804 (wger « Wall Pushup ») : page wger non lue | - | 2026-10-21 | NON SOURCÉ |
| Coudes à environ 45° ; ordre des échelons (mur < chaise < genoux < sol < pieds surélevés) ; passage d'un échelon à l'autre | pratique courante ; raisonnement de coach, aucune source ; ordre chaise/genoux décidé par l'utilisateur le 21/10/2026 | - | - | NON SOURCÉ |
| Variante « mains sur haltères » RETIRÉE (21/10/2026) : elle exige des haltères hexagonaux, attribut que le tag `halteres` ne porte pas | point 49 de `relecteur` ; à ré-introduire seulement si le profil porte l'attribut | - | - | retirée |
| Variante « mains sur la première marche » non reprise dans la fusion | décision de coach (21/10/2026) : la chaise couvre le besoin | - | - | sans objet |
| Avertissement de stabilité de la chaise | règle de conception (exercise-catalog.md §5, cite la chaise) et R8 de knowledge/regles-securite-communes.md ; aucune source trouvée | - | 2026-10-21 | NON SOURCÉ |
| Sécurité (zones, grossesse, signes d'arrêt) | à refaire par kine (voir la section) | - | - | à compléter |
