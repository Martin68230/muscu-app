# Lot 06 (vague 1) : cases sous 3, 14 fiches
Rédigé par `coach` le 22/10/2026. Statut de toutes les fiches : `brouillon_coach` (sécurité à reprendre par `kine`, puis contrôle `relecteur`). `npm run check:fiches` : 0 erreur, 4 avertissements (WebP manquants, listés plus bas). Aucune valeur chiffrée (séries, répétitions, charges, durées) : rien n'est sourcé.

## Fiches
| id | schéma | niveau | variantes (échelon) | matériel | image |
|---|---|---|---|---|---|
| tirage-vertical-allonge-ventre | tirage V (substitut) | débutant | front posé (1), serviette (2), poitrine levée (3) | poids du corps, tapis ; serviette | illustration à créer |
| tirage-vertical-serviette | tirage V (substitut) | débutant | debout (1), assis (1), une main résiste (2) | serviette ; chaise | illustration à créer |
| releve-mollets-assis | cheville/mollet | débutant | chaise (1), haltère (2), une jambe (3) | chaise ; halteres | illustration à créer |
| releve-tibial-mur | cheville/mollet | débutant | assis (1), dos au mur 2 pieds (1), 1 pied (2) | chaise ; mur | illustration à créer |
| marche-pointes-talons | cheville/mollet | débutant | talons (1), pointes (1), enchaînées (2) | poids du corps | illustration à créer |
| releve-mollets-halteres | cheville/mollet | débutant | au sol (1), marche (2), une jambe (3) | halteres ; marche_escalier | illustration à créer |
| releve-mollets-machine | cheville/mollet | débutant | debout (1), assise (1) | machine | 2 photos (variante debout) |
| abduction-couchee-cote | hanche latérale | débutant | base (1), dos au mur (1), mini-bande (2) | tapis ; mur ; mini_bande | illustration à créer |
| clam-coquille | hanche latérale | débutant | pieds joints (1), mini-bande (2) | tapis ; mini_bande | illustration à créer |
| abduction-hanche-debout | hanche latérale | débutant | chaise (1), mur (1), mini-bande (2) | chaise ; mur ; mini_bande | 2 photos (mention) |
| abduction-quatre-pattes | hanche latérale | débutant | sol (1), mini-bande (2) | tapis ; mini_bande | illustration à créer |
| marche-laterale-poids-du-corps | hanche latérale | débutant | genoux souples (1), demi-squat (2) | poids du corps | illustration à créer |
| abduction-hanche-poulie | hanche latérale | intermédiaire | debout, sangle cheville (1) | poulie | illustration à créer |
| abduction-hanche-machine | hanche latérale | débutant | assis (1) | machine | illustration à créer |

## Couverture visée (une fois `utilisable` ; non vérifiée par `couverture.mjs`, qui ne compte que `utilisable`/`verifie`)
- **Tirage V** : A 1 + 2 = 3 ; B déjà 3 ; C 2 + 2 = 4 (les variantes poids du corps / serviette / chaise comptent pour C).
- **Cheville/mollet** : A 1 + 3 (assis chaise, tibial, marche) = 4 ; B 2 + 3 = 5 ; C 1 + 5 = 6 ; D, E 2 + 5 ; F + machine.
- **Hanche latérale** : A à D : 5 (couchée, coquille, debout, quatre pattes, marche sans élastique) ; B à F aussi via la mini-bande selon le profil ; E et F : 1 + 5 ; F + poulie + machine.

## Doublons évités et choix
- **Tirage sous table / australienne** : `tirage-sous-table` existe dans `ecartees/` (tag `table_solide` proposé, absent du vocabulaire). Serviette sur porte : non retenue (porte qui s'ouvre, risque de chute). Voir questions.
- **Pull-over haltère** : déjà `pullover-haltere-au-sol` (variante banc incluse). Pas de fiche C de plus : les 2 fiches poids du corps suffisent pour C (A est inclus dans C). Un pull-over penché n'est pas un tirage vertical fiable (charge verticale, bras vers le bas).
- **Mobilité cheville au mur** : déjà `mobilite-cheville-au-mur` (schéma mobilité). **Montée unipodale, sur marche** : déjà variantes de `releve-mollets`. **Fente latérale** : déjà `fente-laterale`. **Planche latérale** : `planche-laterale`, `planche-laterale-jambe-levee` (gainage). **Marche latérale à l'élastique** : `marche-laterale-elastique` (mini-bande seule), d'où la version sans élastique.

## Fiches sans image affichable (avertissements ou illustrations à créer pour `dev`)
Aucune photo free-exercise-db adaptée : 12 fiches. Ligne « illustration » présente avec `affichable : non (à créer par dev)` ; `dev` ajoute la pose dans `tools/illustrations-poses.mjs`, génère le SVG, puis `coach` passe la ligne à `oui`. Fiches : tirage-vertical-allonge-ventre, tirage-vertical-serviette, releve-mollets-assis, releve-tibial-mur, marche-pointes-talons, releve-mollets-halteres, abduction-couchee-cote, clam-coquille, abduction-quatre-pattes, marche-laterale-poids-du-corps, abduction-hanche-poulie, abduction-hanche-machine.
Photos écartées (vues le 22/10/2026) : `Dumbbell_Seated_One-Leg_Calf_Raise/0,1` (haltère tenu devant la poitrine, pas sur la cuisse) ; `Thigh_Abductor/0,1` (marque Nautilus visible, règle 12).

## WebP à créer (`dev`, largeur 600 px, qualité 70, lignes à ajouter dans tools/photos.md)
Source : https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/<Dossier>/<n>.jpg (Unlicense). Dossiers : `Side_Leg_Raises` (0 et 1 ; fiche abduction-hanche-debout ; mention : jambe très haute et buste penché sur la photo, la consigne demande moins haut et buste droit) ; `Standing_Calf_Raises` (0 et 1 ; fiche releve-mollets-machine ; montre la machine debout, pas l'assise). Les 4 avertissements actuels de `check:fiches` viennent de là.

## Points pour `dev`
- Muscle **tibial antérieur** absent de la liste de format-fiches.md : `releve-tibial-mur` est rattaché à `peroniers` en attendant.
- Tag `poulie` : la sangle de cheville n'est pas décrite (fiche `abduction-hanche-poulie`).
- Tag `table_solide` toujours absent (voir `tirage-sous-table`).

## Questions pour l'utilisateur (choix prudent appliqué, rien ne bloque)
1. **Tirage sous une table** (australienne, très utile sans barre) : ajouter le tag `table_solide` (table lourde et stable cochée dans le profil) pour rouvrir `tirage-sous-table` ? Choix prudent : non, rien d'ajouté.
2. **Tirage vertical avec haltères seulement (profil C)** : on s'appuie sur le pull-over existant et les 2 substituts poids du corps. Acceptable, ou prioriser l'achat conseillé d'une barre de traction ou d'un élastique ?
3. **Marche sur les pointes ou talons et relevé tibial** : exercices peu courants en salle, mais utiles à la prévention de la cheville (sports, voir sports.md). Garder dans la bibliothèque ?

## Sources
Gestes et photos : free-exercise-db (PROVISOIRE : `Side_Leg_Raises`, `Standing_Calf_Raises`, `Thigh_Abductor`, `Dumbbell_Seated_One-Leg_Calf_Raise`, `Standing_Dumbbell_Calf_Raise`). Aucune étude lue pour ce lot. Tout le reste : NON SOURCÉ (descriptions de coach). Zones, niveaux, grossesse : brouillon prudent NON SOURCÉ, à reprendre par `kine`.
