# F6 : notes de dev (progression par échelons, bilan de séance)

Code : `src/session/{progression,progression-config,progression-store,summary,summary-texts}.ts`, `src/ui/screens/Summary.tsx`, carte de proposition dans `Preview.tsx`. Tests : `tests/unit/progression-*.test.ts`, `summary-core.test.ts`. Toutes les valeurs NON SOURCÉ sont dans `progression-config.ts` (choix par défaut de §5). Aucune fiche ni fichier de `knowledge/` modifié.

## Choix prudents et ambiguïtés
1. **Plafond d'étalonnage de la première séance** : §2 (e) borne à « l'échelon de départ », mais T18 demande une montée d'un échelon à la première série. Retenu : montée d'un seul échelon permise (réglage `firstSessionRaiseAllowed`), jamais au-dessus du niveau ni du matériel. Mettre `false` pour la lecture littérale de (e). À trancher par `coach`.
2. **Séance d'arrivée (montée ou descente acceptée)** : `isCalibration = true`, aucune montée possible, donc elle ne compte pas parmi les 2 (ou 3) séances valables ; T40 « 2 séances parfaites à 3 » est donc lu comme 2 séances **après** la séance d'arrivée (lecture plus prudente).
3. **Gel après symptôme** : dernière séance terminée (`faite` ou `sautee` avec fin) avec `endReason = symptome` ; levé par la première séance terminée sans symptôme. S'applique aux montées d'échelon, de charge et de niveau, pas aux baisses.
4. **Exercice adapté par une case de sécurité** (`adaptation` non nul) : aucun changement d'échelon proposé ni fait en étalonnage (prudence : l'adaptation impose la variante).
5. **Exercice par côté, étalonnage** : seule la première série (côté gauche) décide de l'échelon. Un côté plus faible n'est pas encore pris en compte à ce moment.
6. **Séries douloureuses dans le bilan** : comptées dans séries, répétitions et tonnage comme la spec (§3.1, S), listées aussi à part ; jamais de record ni de comparaison sur leur exercice.
7. **Séance de référence du bilan** : jusqu'à 3 séances du même jour (même programme), puis jusqu'à 3 séances récentes quelconques ayant un exercice commun (programme régénéré). Séance de référence avec douleur : ignorée.
8. **Statut `première`** : une séance écourtée ou avec douleur garde son texte propre même si c'est la première (les textes « écourtée » et « douleur » priment sur « Bravo »).
9. **Tonnage et repos prévu** : visibles en détail seulement (Q6), pas en gros chiffre.
10. **Repos moyen réel** : `restTakenSec` écrit sur la série de travail qui précède, quand la personne quitte l'écran de repos **après la fin du minuteur** ; repos sauté avant la fin, transition de superset, repos d'échauffement, repos suivi d'un échauffement, pause de plus de 10 min : exclus. Sans ce champ (anciennes séances), l'écran dit « Temps entre deux séries ».
11. **Fiche prête pour le niveau** : compte seulement si la fiche n'est ni `capped`, ni en grossesse, ni gelée, et si `e+1` existe avec le matériel mais d'un niveau trop haut.
12. **Proposition de niveau** : « Passer au niveau intermédiaire » met à jour le profil au toucher (le programme se régénère) ; « Rester ici » est enregistré. Ignorer la carte n'enregistre rien (elle revient).
13. **Post-partum** : la ligne « Reprendre progressivement, à ton rythme » figure en toutes lettres dans la spec §3.6 b et est affichée telle quelle ; le texte G7 n'existe pas en toutes lettres (spec : « G7 priment », sans texte) ; non affiché.
13b. **Maintiens** : `PROGRESSION.hold.enabled = false` (durées figées, Q4). `proposeHold` et `holdStartSec` sont codés et testés avec un réglage activé, pas branchés à l'affichage.

## Limites connues
- Les décisions (monter, descendre, refuser, niveau, annulation) sont dans `profile.progressionLog` (200 dernières), pas dans une table. Une régénération du programme avant la séance d'arrivée annule la montée acceptée : l'aperçu affiche « La proposition d'échelon est annulée parce que ton programme a changé. » une seule fois (événement `annule`).
- Après un changement d'échelon en séance, le programme actif est mis à jour tout de suite (`patchProgramVariant`).
- `restTakenSec` n'est pas écrit si la séance est terminée pendant un repos.
- Échecs de lecture : le bilan retombe sur durée + séries faites.

## Écarts du §7 : état
1. Montée d'échelon : 2 séances valables (3 après descente), compteur de refus : fait. 2. Clé (fiche, échelon) pour le poids du corps (progression, étalonnage, « dernière fois », suggestion) : fait ; charges par variante. 3. Plus de saut à e+2 : fait. 4. Baisses permises sous capped, grossesse, douleur : fait (charge et échelon). 5. Gel après symptôme, séance d'arrivée bornée, anti-aller-retour, passage de niveau : faits ; maintiens figés. 6. `restTakenSec` : fait. 7. Niveau de la personne vérifié pour `e+1` : fait dans la progression. 8. Séance valable : séries prévues **de la séance précédente** (plan gardé sur la séance) : fait.

## Tests existants adaptés (la règle a changé avec la spécification)
- `session-history` : « poids du corps : échelon supérieur » exigeait 1 séance ; remplacé par le test 2 séances.
- `session-screens` et `f5-seance.spec` : le titre de fin devient « Première séance faite » / « Séance terminée » / « Séance écourtée » selon le cas ; le bilan se calcule de façon asynchrone (attente ajoutée).
- Wake Lock : le test « relâché à la fermeture » échouait déjà sur le dépôt avant F6 (le nettoyage d'un effet n'était pas exécuté à temps au démontage) ; corrigé dans le code (effet de mise en page dans Player).
