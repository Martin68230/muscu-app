# Étiquettes simples du matériel de salle et fiches de machines (D30, Q10)
Rédigé par `coach` le 30/10/2026. **Proposition à valider par `kine` (machines et grossesse), puis contrôle `relecteur`.** Aucune valeur sportive ; rien n'est modifié dans equipment-taxonomy.md ni materiel-tags.json (qui restent la référence des tags). Décision de l'utilisateur (D30, 30/10/2026) : étiquettes simples (machine guidée, poulie, banc) ; fiches de machines affichées **seulement** si l'utilisateur indique avoir accès à une salle.

## 1. Étiquettes affichées (mots de l'écran, tutoiement) et tags correspondants
| Étiquette affichée | Sens en une ligne | Tag(s) de fiche | Où on en trouve |
|---|---|---|---|
| **Machine guidée** | « Une machine où le mouvement est guidé (presse, développé, tirage assis) : tu règles le siège et la charge avec la goupille. » | `machine` | salle seulement (`salle_uniquement`) |
| **Poulie** | « Un câble avec une charge : tu tires avec une poignée ou une barre. » | `poulie` | salle seulement |
| **Banc** | « Un banc plat ou réglable pour s'allonger ou s'asseoir. » | `banc`, `banc_inclinable` | maison ou salle (groupe `maison`) |
| *(à part)* **Machine de cardio** | « Vélo, rameur, tapis de course, elliptique. » | `machine_cardio` | salle seulement ; règles de cardio-regles.md §5.5 |
Ces étiquettes ne changent ni les tags ni la taxonomie : elles ne servent qu'à l'affichage (liste de matériel du profil, bandeau de fiche, filtre de la bibliothèque). Pas de nom de marque. Un seul mot par étiquette, pas de sous-type (« presse », « pec deck » restent dans le titre de la fiche).

## 2. Règle d'affichage : « seulement si l'utilisateur indique avoir accès à une salle »
1. Les étiquettes **machine guidée**, **poulie** et **machine de cardio**, et **toutes les fiches** qui exigent un de ces tags, sont **masquées** (bibliothèque, remplaçants, programme, séance) tant que le profil n'indique **ni** le lieu « salle » **ni** l'accès à une salle (réglage facultatif « j'ai accès à une salle », décoché par défaut). **Ce réglage est à créer** : le profil n'a aujourd'hui qu'un **lieu unique** (`TrainingPlace`, maison ou salle), qui ne permet pas de dire « maison et salle » ; `dev` choisit entre un second réglage et un lieu multiple.
2. L'étiquette **banc** suit le matériel coché (il existe à la maison) ; elle n'est **pas** conditionnée à la salle.
3. Si la personne retire l'accès à la salle, ses programmes sont régénérés sans ces fiches ; une séance déjà commencée finit comme prévu.
4. **Grossesse et post-partum : les fiches de machines sont retirées par défaut** (G9 de regles-securite-communes.md : machines assises non actives, en attente de la décision de l'utilisateur ; Q4 et Q5 de cardio-regles.md pour le cardio) ; ce fichier n'ajoute aucune exception.
5. Cardio : les règles de sécurité du cardio-regles.md §5.5 priment sur l'affichage (aucun rameur ni tapis de course pour grossesse, post-partum ou zone dos).
Statut : choix d'affichage NON SOURCÉ (aucune valeur sportive).

## 3. Fiches de machines à écrire, par priorité (5 lignes ; chaque fiche passe le cycle coach -> kine -> relecteur)
1. **Presse à cuisses** (machine guidée) : remplace un squat chargé ; `jambes_genou`, aujourd'hui aucune fiche de salle pour les jambes.
2. **Tirage vertical poitrine à la poulie** (poulie) : tirage vertical, trou mesuré ; alternative aux tractions.
3. **Tirage horizontal assis à la poulie basse** (poulie) : rowing guidé, `tirage_1` / `tirage_2`.
4. **Développé pectoraux à la machine (presse pectorale)** (machine guidée) : poussée horizontale guidée, adaptée au débutant en salle.
5. **Extension et curl de jambes à la machine** (machine guidée, 2 fiches) : quadriceps et ischios en isolation légère ; puis, plus tard : développé épaules à la machine, curl et extension triceps à la poulie (dips lestés : seulement après avis `kine`).
Chaque fiche : consigne réécrite en français, réglage du siège et de la goupille, lignes de zone (genou, épaule, dos), version `adapter` avec charge légère, mention « machine guidée / poulie » en étiquette. Source des pistes : structure-programmes.md §4 (P2) ; la liste ne vaut pas engagement.
