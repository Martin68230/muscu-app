---
id: planche
nom: Planche
schema: gainage
type: gainage
niveau_min: debutant
muscles_principaux: [abdominaux, transverse]
muscles_secondaires: [obliques, fessiers, deltoides_anterieurs]
source_brouillon: [M1707]
statut: complete_kine
---
## Variantes (installation + matériel seulement)
| id variante | nom | materiel_tags | installation |
|---|---|---|---|
| planche-genoux | Sur les genoux | poids_du_corps, tapis | Avant-bras et genoux au sol. |
| planche-avant-bras | Sur les avant-bras | poids_du_corps, tapis | Avant-bras et pointes de pieds au sol. |

## Consignes
1. Avant-bras au sol, coudes sous les épaules.
2. Recule les pieds : corps droit des talons à la tête.
3. Serre le ventre comme si on allait te pousser.
4. Serre les fessiers.
5. Respire calmement et tiens la position.

## Points d'attention
- Ligne droite : ni fesses en l'air, ni bassin qui tombe.
- Regard vers le sol, nuque longue.
- Ne bloque pas ta respiration.
- Arrête dès que le bas du dos se creuse.

## Erreurs fréquentes
- Bassin qui s'affaisse.
- Fesses trop hautes.
- Apnée.

## Progression / régression
**planche-genoux** -> planche-avant-bras -> planche en levant un bras ou une jambe (à créer) -> planche-touche-epaule

## Repères de dosage
Voir program-logic.md. Les durées de maintien ne sont pas encore sourcées : à définir par coach avec source avant codage.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 : README.md du lot, section « Retour kine ». Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Zones non listées : garder. Plusieurs zones gênées : la règle la plus prudente s'applique.

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | garder (planche-genoux si le dos se creuse) | adapter : planche-genoux, maintien court | retirer |
| Épaule | garder | adapter : planche-genoux | retirer |
| Coude | adapter : serviette pliée sous les avant-bras | adapter : planche-genoux, serviette sous les avant-bras | retirer |
| Cou | garder : regard au sol, nuque longue | adapter : planche-genoux | retirer |

**Version plus douce** : `planche-genoux`.

**Signes qui doivent faire arrêter**
- Bas du dos qui se creuse ou douleur au bas du dos.
- Tremblements qui t'empêchent de garder la ligne : fin de la série.
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente à l'épaule ou au coude.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
Variante avant-bras : free-exercise-db `Plank/0.jpg`, `Plank/1.jpg` (domaine public). Variante genoux : aucune photo libre.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Face au sol sur avant-bras et pointes de pieds, coudes sous les épaules, corps rigide, maintien ; plus dur en levant un bras ou une jambe | free-exercise-db « Plank » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Plank.json ; réécrit par coach | base d'exercices (domaine public), pas d'étude | 2026-10-21 | PROVISOIRE |
| Muscles (abdominaux) | même fiche ; autres ajoutés par coach | idem | 2026-10-21 | PROVISOIRE (ajouts NON SOURCÉ) |
| La source dit « aussi longtemps que possible » : non retenu (pas d'échec systématique, program-logic.md §0) | choix de coach | - | - | NON SOURCÉ |
| Règles communes R1 à R10 (niveaux de gêne, arrêt si douleur, pas de progression, signes généraux, quand consulter) | README.md du lot, section « Retour kine » (sources détaillées : HAS 2019, NICE NG59, Smith 2017, Riebe 2015) | voir README | 2026-10-21 | PROVISOIRE |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://www.has-sante.fr/jcms/c_2961499/fr/prise-en-charge-du-patient-presentant-une-lombalgie-commune (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; lues via résumés et synthèses (PDF HAS non ouvert : erreur de certificat) | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
