---
id: montee-sur-marche
nom: Montée sur marche
schema: fente
type: force
niveau_min: debutant
muscles_principaux: [quadriceps, fessiers]
muscles_secondaires: [ischios, mollets, moyen_fessier]
source_brouillon: [M1933, M1499]
statut: complete_kine
---
## Variantes (installation + matériel seulement)
| id variante | nom | materiel_tags | installation |
|---|---|---|---|
| montee-sur-marche-poids-du-corps | Poids du corps | poids_du_corps, marche_ou_box | Une marche d'escalier ou une box stable. Main sur la rampe si besoin. |
| montee-sur-marche-halteres | Haltères | halteres, marche_ou_box | Un haltère dans chaque main, bras le long du corps. |

## Consignes
1. Face à la marche, pose tout un pied dessus.
2. Pousse dans ce pied pour monter, sans t'aider de la jambe du bas.
3. Termine bien droit, l'autre pied rejoint la marche.
4. Redescends en contrôlant, d'abord le pied qui est monté en dernier.
5. Finis la série d'un côté, puis change.

## Points d'attention
- Tout le pied sur la marche, talon compris.
- Genou dans l'axe du pied.
- Buste légèrement penché en avant, dos droit.
- Descente lente.

## Erreurs fréquentes
- Rebondir sur la jambe du bas pour monter.
- Genou qui rentre vers l'intérieur.
- Marche instable ou glissante.

## Progression / régression
marche basse <- **montee-sur-marche** -> marche plus haute -> montee-sur-marche-halteres

## Repères de dosage
Voir program-logic.md. La hauteur de marche change la difficulté (valeurs non sourcées).

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 : README.md du lot, section « Retour kine ». Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Zones non listées : garder. Plusieurs zones gênées : la règle la plus prudente s'applique.

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Genou | garder : marche basse | adapter : marche plus basse, sans haltère, main sur la rampe | retirer |
| Hanche | garder : marche basse | adapter : marche plus basse, sans haltère | retirer |
| Cheville | garder : main sur la rampe | adapter : marche basse, main sur la rampe, sans haltère | retirer |

**Version plus douce** : `montee-sur-marche-poids-du-corps` sur une marche basse, main sur la rampe.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au genou, à la hanche ou à la cheville.
- Pied qui glisse ou talon qui dépasse de la marche.
- Perte d'équilibre.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Marche d'escalier : seulement la première marche du bas, escalier éclairé et dégagé, main sur la rampe si possible. Box ou banc : stable, qui ne glisse pas.
- Jamais une marche plus haute dans un escalier (risque de chute en arrière) : pour monter plus haut, utilise une box stable.
- Version haltères : tes mains ne sont plus libres pour la rampe ; seulement sur une box basse et stable, et si la version sans charge est parfaitement stable.

## Photo
Variante haltères : free-exercise-db `Dumbbell_Step_Ups/0.jpg`, `Dumbbell_Step_Ups/1.jpg` (domaine public). Variante poids du corps : aucune photo libre.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Un pied sur la plateforme, poussée dans le talon, l'autre pied rejoint, descente, changement de jambe | free-exercise-db « Dumbbell_Step_Ups » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Dumbbell_Step_Ups.json ; réécrit par coach | base d'exercices (domaine public), pas d'étude | 2026-10-21 | PROVISOIRE |
| Muscles (quadriceps ; mollets, fessiers, ischios) | même fiche ; moyen fessier ajouté par coach | idem | 2026-10-21 | PROVISOIRE |
| Ne pas rebondir sur la jambe du bas ; marche stable | pratique courante | - | - | NON SOURCÉ |
| Règles communes R1 à R10 (niveaux de gêne, arrêt si douleur, pas de progression, signes généraux, quand consulter) | README.md du lot, section « Retour kine » (sources détaillées : HAS 2019, NICE NG59, Smith 2017, Riebe 2015) | voir README | 2026-10-21 | PROVISOIRE |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au genou ou à la hanche de niveau 1-2 : adapter plutôt que tout retirer | Bannuru et al., OARSI 2019, Osteoarthritis Cartilage https://wrap.warwick.ac.uk/125416/ (exercice structuré = traitement de base de l'arthrose du genou et de la hanche) | recommandation internationale (méthode GRADE) ; résumé lu | 2026-10-21 | PROVISOIRE (extrapolation : public arthrosique ; l'app ne pose aucun diagnostic) |
| Avertissement de stabilité de la marche (première marche, rampe) | règle de conception (exercise-catalog.md §5) ; aucune source trouvée | - | 2026-10-21 | NON SOURCÉ |
