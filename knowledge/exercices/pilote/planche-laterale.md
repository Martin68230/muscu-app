---
id: planche-laterale
nom: Planche latérale
schema: gainage
type: gainage
niveau_min: debutant
muscles_principaux: [obliques, abdominaux]
muscles_secondaires: [moyen_fessier, carre_des_lombes, deltoides_lateraux]
source_brouillon: [M1715, M0514, M1712]
statut: complete_kine
---
## Variantes (installation + matériel seulement)
| id variante | nom | materiel_tags | installation |
|---|---|---|---|
| planche-laterale-genoux | Sur le genou | poids_du_corps, tapis | Couché sur le côté, avant-bras et genou du dessous au sol, genoux pliés. |
| planche-laterale-pieds | Sur les pieds | poids_du_corps, tapis | Couché sur le côté, avant-bras et bord du pied au sol, jambes tendues. |

## Consignes
1. Couché sur le côté, coude juste sous l'épaule.
2. Jambes empilées (ou genoux pliés pour la version facile).
3. Monte le bassin pour aligner tête, bassin et pieds (ou genoux).
4. Serre le ventre et les fessiers, respire.
5. Tiens, puis change de côté.

## Points d'attention
- Coude sous l'épaule, épaule loin de l'oreille.
- Bassin dans l'alignement, ni en avant ni en arrière.
- Le bassin ne retombe pas.
- Respire normalement.

## Erreurs fréquentes
- Bassin qui s'affaisse vers le sol.
- Fesses qui partent en arrière.
- Épaule tassée.

## Progression / régression
**planche-laterale-genoux** -> planche-laterale-pieds -> planche latérale jambe du dessus levée (à créer)

## Repères de dosage
Voir program-logic.md. Durées de maintien non sourcées : à définir.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 : README.md du lot, section « Retour kine ». Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Zones non listées : garder. Plusieurs zones gênées : la règle la plus prudente s'applique.

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | adapter : planche-laterale-genoux | retirer (à la place : dead-bug) | retirer |
| Coude | adapter : serviette pliée sous l'avant-bras | adapter : planche-laterale-genoux, serviette | retirer |
| Dos | garder : version genoux si besoin | adapter : planche-laterale-genoux, maintien court | retirer |
| Hanche | garder | adapter : planche-laterale-genoux, coussin sous le genou | retirer |

**Version plus douce** : `planche-laterale-genoux`.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente à l'épaule d'appui ou au bas du dos.
- Bassin qui retombe sans que tu puisses le remonter : fin de la série.
- Picotements dans le bras d'appui.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
free-exercise-db : `Side_Bridge/0.jpg`, `Side_Bridge/1.jpg` (domaine public ; fiche source sans consignes). Variante à vérifier sur la photo (genou ou pieds).

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Mouvement et muscles (abdominaux ; épaules) | free-exercise-db « Side_Bridge » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Side_Bridge.json (pas de consignes dans la source) | base d'exercices (domaine public) | 2026-10-21 | PROVISOIRE |
| Version débutant : abdos et fessiers serrés, ligne droite de la tête aux talons | NASM Exercise Library « Side Plank » https://nasm.org/exercise-library/side-plank (vu via résumé de recherche, page non lue) | organisme de certification | 2026-10-21 | PROVISOIRE |
| Consignes détaillées, obliques en muscle principal | rédigées par coach | pratique courante | 2026-10-21 | NON SOURCÉ |
| Fusion M1715, M0514, M1712 (« Side plank right ») | nettoyage du brouillon | - | - | NON SOURCÉ |
| Règles communes R1 à R10 (niveaux de gêne, arrêt si douleur, pas de progression, signes généraux, quand consulter) | README.md du lot, section « Retour kine » (sources détaillées : HAS 2019, NICE NG59, Smith 2017, Riebe 2015) | voir README | 2026-10-21 | PROVISOIRE |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://www.has-sante.fr/jcms/c_2961499/fr/prise-en-charge-du-patient-presentant-une-lombalgie-commune (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; lues via résumés et synthèses (PDF HAS non ouvert : erreur de certificat) | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
