---
id: pompe
nom: Pompe
schema: poussee_h
type: force
niveau_min: debutant
muscles_principaux: [pectoraux, triceps]
muscles_secondaires: [deltoides_anterieurs, abdominaux, dentele_anterieur]
source_brouillon: [M1803]
statut: complete_kine
---
## Variantes (installation + matériel seulement)
| id variante | nom | materiel_tags | installation |
|---|---|---|---|
| pompe-sol | Au sol | poids_du_corps | Mains au sol, sur les pointes de pieds. |
| pompe-poignees-halteres | Mains sur des haltères | halteres | Mains sur deux haltères hexagonaux posés au sol (pas de ronds : ils roulent). |

## Consignes
1. Mains au sol un peu plus larges que les épaules.
2. Corps en planche, des talons à la tête.
3. Descends la poitrine près du sol en pliant les coudes.
4. Coudes à environ 45° du corps.
5. Pousse le sol pour tendre les bras.

## Points d'attention
- Ventre et fessiers serrés tout le long.
- Tête dans le prolongement du corps.
- Descente contrôlée.
- Si la forme se dégrade, finis la série sur les genoux.

## Erreurs fréquentes
- Bassin qui tombe ou fesses en l'air.
- Coudes à l'horizontale.
- Demi-répétitions.

## Progression / régression
pompe-genoux <- **pompe** -> pompe avec descente lente -> pompe pieds surélevés (à créer, brouillon M1053)

## Repères de dosage
Voir program-logic.md.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 : README.md du lot, section « Retour kine ». Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Zones non listées : garder. Plusieurs zones gênées : la règle la plus prudente s'applique.

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | garder (amplitude sans gêne) | adapter : pompe-inclinee | retirer |
| Coude | garder | adapter : pompe-genoux ou pompe-inclinee | retirer |
| Poignet | adapter : pompe-poignees-halteres (poignet droit, haltères hexagonaux fixes seulement) | adapter : pompe-inclinee | retirer |
| Dos | garder | adapter : pompe-genoux ou pompe-inclinee | retirer |

**Version plus douce** : `pompe-genoux`.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente à l'épaule, au coude ou au poignet.
- Bassin qui s'effondre ou bas du dos qui se creuse.
- Haltère qui roule ou bascule sous la main.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
Variante au sol : free-exercise-db `Pushups/0.jpg`, `Pushups/1.jpg` (domaine public). Variante sur haltères : aucune photo libre.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Mains un peu plus larges que les épaules, bras tendus, poitrine près du sol, retour bras tendus | free-exercise-db « Pushups » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Pushups.json ; réécrit par coach | base d'exercices (domaine public), pas d'étude | 2026-10-21 | PROVISOIRE |
| Muscles (pectoraux ; épaules, triceps) | même fiche ; tronc et dentelé ajoutés par coach | idem | 2026-10-21 | PROVISOIRE |
| Coudes à environ 45° ; haltères hexagonaux seulement | pratique courante | - | - | NON SOURCÉ |
| Variante sur haltères | brouillon M0732 (pompe serrée sur haltère, free-exercise-db) : rapprochement par coach | - | 2026-10-21 | NON SOURCÉ |
| Règles communes R1 à R10 (niveaux de gêne, arrêt si douleur, pas de progression, signes généraux, quand consulter) | README.md du lot, section « Retour kine » (sources détaillées : HAS 2019, NICE NG59, Smith 2017, Riebe 2015) | voir README | 2026-10-21 | PROVISOIRE |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://www.has-sante.fr/jcms/c_2961499/fr/prise-en-charge-du-patient-presentant-une-lombalgie-commune (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; lues via résumés et synthèses (PDF HAS non ouvert : erreur de certificat) | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
