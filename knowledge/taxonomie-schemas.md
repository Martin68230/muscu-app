# Taxonomie des schémas et règle des liens de progression (D23 / D25)

Statut : **PROVISOIRE** (choix de l'utilisateur du 30/10/2026, validation `coach` et contrôle `relecteur` demandés). Le code qui l'applique : `tools/validate-fiches.mjs` (`SCHEMA_FAMILLES`, `chainCompatible`), tests `tests/unit/chain-validator.test.ts`.

## Règle
Un lien « plus facile », « plus dur » ou « alternative » entre deux fiches est permis si et seulement si :
1. les deux schémas appartiennent à la **même famille** ; ET
2. leurs **muscles principaux se recouvrent** (au moins un muscle en commun).

Le muscle principal est une liste de 1 ou 2 muscles (3 si c'est réel). Un muscle n'est « principal » que s'il fait vraiment le travail de l'exercice ; sinon il est secondaire.

## Familles de schémas
| famille | schémas | précision |
|---|---|---|
| squat | `squat`, `fente` (fentes, bulgare, step-up, montées) | attribut facultatif `lateralite` : `deux-jambes` ou `une-jambe`, réservé à cette famille |
| stabilité | `gainage`, `anti_rotation` | séparée de `rotation` |
| rotation | `rotation` | jamais reliée à l'anti-rotation |
| portage | `porte` | reliés seulement si un muscle principal est commun |
| autres | `charniere`, `poussee_h`, `poussee_v`, `tirage_h`, `tirage_v`, `saut`, `mobilite`, `cardio`, `cheville_mollet`, `hanche_laterale` | une famille chacun |

## Cas tests imposés
- Pompe diamant (triceps) refusée comme « plus dur » de la pompe classique (pectoraux).
- Pont fessier (fessiers) vers curl ischios (ischios) refusé.
- Soulevé de terre (fessiers, ischios) vers roumain (ischios, fessiers) accepté.

## À valider par `coach`
- Les familles ci-dessus et l'attribut `lateralite` (posé par `dev` : schéma `fente` = une jambe, schéma `squat` = deux jambes ; à confirmer fiche par fiche).
- Les liens rétablis (docs/R2-retablissement.md) et le refus de « lancer-bas-haut-mur vers souleve-de-terre-roumain-halteres ».
- Chaque lien rétabli doit garder un sens de progression (plus facile = réellement plus accessible), pas seulement une compatibilité de muscles.

## Avis du coach (30/10/2026)
Avis : **valide sous réserve**. Toute règle de progression ci-dessous reste **NON SOURCÉE** (jugement de coach, aucune source citée).

Familles et `lateralite` : familles confirmées telles quelles. Les 24 valeurs de `lateralite` ont été relues fiche par fiche (fente-laterale, montee-sur-banc, montee-sur-marche = une-jambe ; squat-bosu et squat-lancer-mur = deux-jambes) : aucune correction.

Liens rétablis, relus un à un : 22 gardés, 3 retirés (pas de vraie progression) :
- squat-gobelet : plus-dur squat-bulgare retiré (saut débutant vers intermédiaire ; le bulgare reste atteignable depuis squat-fendu, squat-gilet-lest et squat-sac-berceau, niveaux intermédiaires) ; la liste devient « aucun ».
- souleve-de-terre-roumain-barre : plus-facile pont-fessier retiré (autre qualité de mouvement, grand écart de niveau ; le roumain aux haltères est la marche intermédiaire).
- roue-abdos : plus-facile dead-bug retiré (deux marches sautées ; rollout-ballon et planche-ballon-avant-bras restent). Le lien rollout-ballon vers dead-bug est conservé.

Refus confirmés : lancer-bas-haut-mur vers roumain haltères (mouvement balistique, autre qualité) ; porte-sac-a-dos-devant et porte-ballon-lest vers marche-du-fermier et porte-valise (charge portée devant vs charge tenue à la main : ce n'est pas une progression, même si les deux sont « porte ») ; curl-ischios-ballon vs pont-fessier-ballon (ischios vs fessiers). Aucun muscle principal de fiche à corriger.

Réserves :
1. Soulevé de terre barre vers roumain barre : gardé comme étape pédagogique (charnière avant le tirage du sol), mais même niveau et même matériel ; à surveiller si le générateur le propose à un débutant (la barre est intermédiaire).
2. Roumain haltères vers pont fessier et soulevé de terre sac vers pont fessier ou roumain haltères : gardés comme régressions d'accès, la qualité de mouvement diffère (extension de hanche allongé vs charnière debout).
3. squat-ballon-lest et squat-mur-ballon vers squat-fendu : gardés, mais la latéralité change (deux jambes vers une jambe) ; le générateur ne devrait pas l'imposer avant que le squat à deux jambes soit maîtrisé.
4. Le critère « muscle principal commun » dépend de la qualité des listes de muscles : marche-du-fermier est listé avant-bras et trapèzes seulement (le gainage y joue aussi), choix prudent laissé tel quel.

## Contrôle du relecteur (30/10/2026)
Verdict : **OK sous réserve**, aucun point bloquant (les niveaux et contre-indications des cibles sont portés par leurs propres fiches). Suite donnée :
- Soulevé de terre barre / roumain barre (même niveau, même matériel) : lien retiré dans les deux sens.
- Liens à sens unique laissés tels quels (le validateur n'exige pas la réciprocité) : surtout vers squat-fendu, squat-bulgare, pont-fessier et les portés. À traiter avec D25 (structure de progression) : décider si la réciprocité devient une règle.
- Renvois circulaires en grossesse (roumain haltères / pont fessier ; rollout / dead-bug) : à gérer dans le générateur.
- `lateralite` absente sur trois fiches du dossier `ecartees/` (squat-sac-epaule, fente-barre, fentes-marchees-barre) : fiches écartées, rien à faire.
- Bilan chiffré : docs/R2-retablissement.md (51 retirés, 20 rétablis, 31 refusés).
