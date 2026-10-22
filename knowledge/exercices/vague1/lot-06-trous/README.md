# Lot 06 (vague 1) : cases sous 3, 14 fiches
Rédigé par `coach` le 22/10/2026, sécurité reprise par `kine`, contrôlé par `relecteur` (CONTROLE-relecteur.md puis RECONTROLE-relecteur.md). Statuts : 12 fiches utilisables (proposées), clam-coquille sans image donc `complete_kine`, releve-mollets-halteres en attente du recontrôle. `npm run check:fiches` : 0 erreur. Aucune valeur chiffrée : rien n'est sourcé.

Reprise `coach` du 22/10/2026 (contenu d'entraînement) : B1, B2, B3, C1, C4, C5, C6, C7, C11, C12, M8 traités. Restent hors de cette reprise : B4 et la sécurité (`kine`), les statuts, les illustrations (`dev`).

## Fiches
| id | schéma | niveau | variantes (échelon) | matériel | image |
|---|---|---|---|---|---|
| tirage-vertical-allonge-ventre | tirage V (substitut) | débutant | front posé (1), serviette (2), poitrine levée (3) | poids du corps, tapis ; serviette | illustration SVG |
| tirage-vertical-serviette | tirage V (substitut) | débutant | debout (1), assis (1), une main résiste (2) | serviette ; chaise | illustration SVG |
| releve-mollets-assis | cheville/mollet | débutant | chaise (1), haltère (2), une jambe (3) | chaise ; halteres | illustration SVG |
| releve-tibial-mur | cheville/mollet | débutant | assis (1), dos au mur 2 pieds (1), 1 pied (2) | chaise ; mur | illustration SVG |
| marche-pointes-talons | cheville/mollet | débutant | talons (1), pointes (1), enchaînées (2) | poids du corps | illustration SVG |
| releve-mollets-halteres | cheville/mollet | débutant | au sol (1), marche avec un seul haltère et une main sur la rampe (2), une jambe (3) | halteres ; marche_escalier | illustration SVG (fiche en attente du recontrôle) |
| releve-mollets-machine | cheville/mollet | débutant | debout (1), assise (1) | machine | illustration SVG (photos écartées : logo tiers) |
| abduction-couchee-cote | hanche latérale | débutant | base (1), dos au mur (1), mini-bande (2) | tapis ; mur ; mini_bande | illustration SVG |
| clam-coquille | hanche latérale | débutant | pieds joints (1), mini-bande (2) | tapis ; mini_bande | aucune image affichable (illustration retirée) |
| abduction-hanche-debout | hanche latérale | débutant | chaise (1), mur (1), mini-bande (2) | chaise ; mur ; mini_bande | illustration SVG (photos écartées) |
| abduction-quatre-pattes | hanche latérale | débutant | sol (1), mini-bande (2) | tapis ; mini_bande | illustration SVG |
| marche-laterale-poids-du-corps | hanche latérale | débutant | genoux souples (1), demi-squat (2) | poids du corps | illustration SVG |
| abduction-hanche-poulie | hanche latérale | intermédiaire | debout, sangle cheville (1) | poulie | illustration SVG |
| abduction-hanche-machine | hanche latérale | débutant | assis (1) | machine | illustration SVG |

## Couverture visée (une fois `utilisable` ; non vérifiée par `couverture.mjs`, qui ne compte que `utilisable`/`verifie`)
- **Tirage V** : A 1 + 2 = 3 ; B déjà 3 ; C 2 + 2 = 4 (les variantes poids du corps / serviette / chaise comptent pour C).
- **Cheville/mollet** : A 1 + 3 (assis chaise, tibial, marche) = 4 ; B 2 + 3 = 5 ; C 1 + 5 = 6 ; D, E 2 + 5 ; F + machine.
- **Hanche latérale** : A à D : 5 (couchée, coquille, debout, quatre pattes, marche sans élastique) ; B à F aussi via la mini-bande selon le profil ; E et F : 1 + 5 ; F + poulie + machine.

## Doublons évités et choix
- **Tirage sous table / australienne** : `tirage-sous-table` existe dans `ecartees/` (tag `table_solide` proposé, absent du vocabulaire). Serviette sur porte : non retenue (porte qui s'ouvre, risque de chute). Voir questions.
- **Pull-over haltère** : déjà `pullover-haltere-au-sol` (variante banc incluse). Pas de fiche C de plus : les 2 fiches poids du corps suffisent pour C (A est inclus dans C). Un pull-over penché n'est pas un tirage vertical fiable (charge verticale, bras vers le bas).
- **Mobilité cheville au mur** : déjà `mobilite-cheville-au-mur` (schéma mobilité). **Montée unipodale, sur marche** : déjà variantes de `releve-mollets`. **Fente latérale** : déjà `fente-laterale`. **Planche latérale** : `planche-laterale`, `planche-laterale-jambe-levee` (gainage). **Marche latérale à l'élastique** : `marche-laterale-elastique` (mini-bande seule), d'où la version sans élastique.

## Fiches sans image affichable (illustrations à créer ou à retoucher par `dev`)
Pour les fiches sans illustration, la ligne « illustration » porte `affichable : non (à créer par dev)` ; `dev` ajoute la pose dans `tools/illustrations-poses.mjs`, génère le SVG, puis `coach` passe la ligne à `oui`.
Photos écartées (vues le 22/10/2026) : `Dumbbell_Seated_One-Leg_Calf_Raise/0,1` (haltère devant la poitrine, pas sur la cuisse) ; `Thigh_Abductor/0,1` (marque Nautilus, règle 12) ; `Standing_Calf_Raises/0,1` (logo « Bodybuilding.com » dans le dos du pratiquant, règle 12) ; `Side_Leg_Raises/0` (pieds croisés, main sur la hanche, petit logo) et `/1` (jambe très haute, buste penché : contredit la consigne).

**À créer par dev (aucune image affichable)**
- releve-mollets-machine : figure de profil, machine debout puis assise, talons dans le vide puis levés.
- abduction-hanche-debout : de face, une main sur le dossier, buste droit, jambe levée peu haut, pieds largeur de hanches.

**Illustrations existantes à retoucher par dev (relecteur C2, C3, C8, C9, C10)**
- tirage-vertical-allonge-ventre : pose d'arrivée à poitrine au sol, coudes vers les côtes (poitrine décollée = échelon 3 seulement) ; figure plus grande ; légende de droite coupée.
- tirage-vertical-serviette : mains aux côtés de la tête, serviette en travers du front : à refaire avec bras levés et tendus devant, jamais derrière la nuque ; légende coupée.
- abduction-couchee-cote : jambe du dessous pliée (elle est tendue) ; jambe du dessus peu haute (environ 35 à 40 degrés dessinés).
- clam-coquille : pieds joints au sol sur le panneau d'ouverture (écart d'environ 65 px) ; légende coupée.
- abduction-hanche-poulie : une main sur le montant (bras actuellement le long du corps).
- Mineurs : releve-mollets-halteres (genoux dessinés fléchis, haltère sans bras ni main), marche-laterale-poids-du-corps (demi-squat trop marqué, flèche sur la tête), abduction-quatre-pattes (illisible sans légende), abduction-hanche-machine (poignées).

## Points pour `dev`
- Muscle **tibial antérieur** : présent dans format-fiches.md ; `releve-tibial-mur` (principal) et `marche-pointes-talons` (principal) l'utilisent.
- Tag `poulie` : la sangle de cheville n'est pas décrite (fiche `abduction-hanche-poulie`).
- Tag `table_solide` toujours absent (voir `tirage-sous-table`).

## Questions pour l'utilisateur (choix prudent appliqué, rien ne bloque)
1. **Tirage sous une table** (australienne, très utile sans barre) : ajouter le tag `table_solide` (table lourde et stable cochée dans le profil) pour rouvrir `tirage-sous-table` ? Choix prudent : non, rien d'ajouté.
2. **Tirage vertical avec haltères seulement (profil C)** : on s'appuie sur le pull-over existant et les 2 substituts poids du corps. Acceptable, ou prioriser l'achat conseillé d'une barre de traction ou d'un élastique ?
3. **Marche sur les pointes ou talons et relevé tibial** : exercices peu courants en salle, mais utiles à la prévention de la cheville (sports, voir sports.md). Garder dans la bibliothèque ?

## Sources
Gestes et photos : free-exercise-db (PROVISOIRE : `Side_Leg_Raises`, `Standing_Calf_Raises`, `Thigh_Abductor`, `Dumbbell_Seated_One-Leg_Calf_Raise`, `Standing_Dumbbell_Calf_Raise`). Aucune étude lue pour ce lot. Tout le reste : NON SOURCÉ (descriptions de coach). Zones, niveaux, grossesse : brouillon prudent NON SOURCÉ, à reprendre par `kine`.
