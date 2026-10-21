---
id: squat-poids-du-corps
nom: Squat au poids du corps
schema: squat
type: force
niveau_min: debutant
muscles_principaux: [quadriceps, fessiers]
muscles_secondaires: [ischios, adducteurs]
source_brouillon: [M1922]
statut: complete_kine
---
## Variantes (installation + matériel seulement)
| id variante | nom | materiel_tags | installation |
|---|---|---|---|
| squat-poids-du-corps-libre | Libre | poids_du_corps | Debout, espace dégagé. |

## Consignes
1. Pieds un peu plus larges que les hanches, orteils légèrement ouverts.
2. Bras devant toi ou mains croisées sur la poitrine.
3. Plie hanches et genoux en même temps, fesses vers l'arrière.
4. Descends tant que ton dos reste droit et tes talons au sol.
5. Remonte en poussant le sol jusqu'à être bien droit.

## Points d'attention
- Genoux dans l'axe des orteils, poussés un peu vers l'extérieur.
- Poitrine haute, regard devant.
- Poids réparti sur tout le pied.
- Moins bas mais propre vaut mieux que bas et arrondi.

## Erreurs fréquentes
- Talons qui décollent.
- Genoux qui rentrent vers l'intérieur.
- Dos qui s'arrondit en bas.
- Descente en chute libre.

## Progression / régression
squat-assis-debout <- **squat-poids-du-corps** -> même fiche avec descente lente ou pause en bas -> squat-gobelet -> squat-bulgare

## Repères de dosage
Voir program-logic.md. Au poids du corps : progression par tempo, pauses puis répétitions (load-calibration.md règle 5 et program-logic.md §4, NON SOURCÉ).

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 : README.md du lot, section « Retour kine ». Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Zones non listées : garder. Plusieurs zones gênées : la règle la plus prudente s'applique.

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Genou | garder (amplitude sans gêne) | adapter : squat-assis-debout (la chaise limite la descente) | retirer |
| Hanche | garder (amplitude sans gêne) | adapter : squat-assis-debout | retirer |
| Dos | garder | adapter : squat-assis-debout | retirer |
| Cheville | garder (pieds un peu plus ouverts, talons au sol) | adapter : amplitude réduite ou squat-assis-debout | retirer |

**Version plus douce** : `squat-assis-debout`.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au genou, à la hanche ou au dos.
- Genou qui lâche.
- Talons qui décollent malgré une amplitude réduite.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
free-exercise-db : `Bodyweight_Squat/0.jpg`, `Bodyweight_Squat/1.jpg` (domaine public). La photo montre les mains derrière la tête ; notre consigne préfère les bras devant : à valider.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Hanches et genoux ensemble, fesses en arrière, poitrine haute, genoux vers l'extérieur, profondeur selon la mobilité | free-exercise-db « Bodyweight_Squat » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Bodyweight_Squat.json ; réécrit par coach | base d'exercices (domaine public), pas d'étude | 2026-10-21 | PROVISOIRE |
| Muscles (quadriceps ; fessiers, ischios) | même fiche ; adducteurs ajoutés par coach | idem | 2026-10-21 | PROVISOIRE (ajout NON SOURCÉ) |
| Bras devant plutôt que mains derrière la tête | choix de coach | - | - | NON SOURCÉ |
| Règles communes R1 à R10 (niveaux de gêne, arrêt si douleur, pas de progression, signes généraux, quand consulter) | README.md du lot, section « Retour kine » (sources détaillées : HAS 2019, NICE NG59, Smith 2017, Riebe 2015) | voir README | 2026-10-21 | PROVISOIRE |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au genou ou à la hanche de niveau 1-2 : adapter plutôt que tout retirer | Bannuru et al., OARSI 2019, Osteoarthritis Cartilage https://wrap.warwick.ac.uk/125416/ (exercice structuré = traitement de base de l'arthrose du genou et de la hanche) | recommandation internationale (méthode GRADE) ; résumé lu | 2026-10-21 | PROVISOIRE (extrapolation : public arthrosique ; l'app ne pose aucun diagnostic) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://www.has-sante.fr/jcms/c_2961499/fr/prise-en-charge-du-patient-presentant-une-lombalgie-commune (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; lues via résumés et synthèses (PDF HAS non ouvert : erreur de certificat) | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
