---
id: montee-sur-marche
nom: Montée sur marche
schema: fente
type: force
niveau_min: debutant
muscles_principaux: [quadriceps, fessiers]
muscles_secondaires: [ischios, mollets, moyen_fessier]
source_brouillon: [M1933, M1499]
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| montee-sur-marche-poids-du-corps | Poids du corps | 1 | debutant | poids_du_corps, marche_escalier | La première marche d'un escalier (éclairé, dégagé), main sur la rampe si besoin. |
| montee-sur-marche-halteres | Haltères légers | 2 | intermediaire | halteres, marche_escalier | Haltères légers, un dans chaque main, bras le long du corps ; seulement sur la première ou la deuxième marche d'un escalier éclairé, dégagé et non glissant, chaussures aux pieds. Option : un seul haltère, l'autre main libre sur la rampe. À réserver aux personnes qui maîtrisent l'échelon 1 (sans haltères). |
| montee-sur-box-haute | Box stable plus haute | 3 | intermediaire | poids_du_corps, box_ou_step | Box ou banc stable, plus haut qu'une marche d'escalier (jamais une marche plus haute dans un escalier). Jamais avec haltères. |

Tags (décision de l'utilisateur, 21/10/2026) : `marche_escalier` = marche d'un escalier (implicite) ; `box_ou_step` = box, step ou banc stable (à cocher, jamais implicite). Chaque variante utilise celui qui correspond, pour afficher les bonnes précautions. Les échelons 1 et 2 ne changent pas l'id des variantes.

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
- Avec haltères : légers, première ou deuxième marche seulement, escalier dégagé et non glissant, chaussures aux pieds ; si tu as peur de perdre l'équilibre, prends un seul haltère et garde l'autre main sur la rampe, ou reviens sans haltères.

## Erreurs fréquentes
- Rebondir sur la jambe du bas pour monter.
- Genou qui rentre vers l'intérieur.
- Marche instable ou glissante.

## Progression / régression
- plus-facile : aucun
- plus-dur : montee-sur-marche-halteres, montee-sur-box-haute
**montee-sur-marche-poids-du-corps** (marche basse, échelon 1) -> montee-sur-marche-halteres (haltères légers, échelon 2 ; on ne charge qu'après avoir maîtrisé l'échelon 1) -> montee-sur-box-haute (box stable plus haute, tag `box_ou_step`, échelon 3, sans charge) ; jamais d'haltères sur une box haute

## Repères de dosage
Voir program-logic.md. La hauteur de marche change la difficulté (valeurs non sourcées).

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Genou | adapter: variante:montee-sur-marche-poids-du-corps | adapter: variante:montee-sur-marche-poids-du-corps | retirer |
| Hanche | adapter: variante:montee-sur-marche-poids-du-corps | adapter: variante:montee-sur-marche-poids-du-corps | retirer |
| Cheville | adapter: variante:montee-sur-marche-poids-du-corps | adapter: variante:montee-sur-marche-poids-du-corps | retirer |
| Dos | adapter: sans-charge | adapter: sans-charge | retirer |

**Notes**
- genou-n1 : version sans haltères, main sur la rampe ; la box haute n'est pas proposée dès la gêne légère au genou, à la hanche ou à la cheville.
- genou-n2 : aucune augmentation de charge ni de difficulté (R2).
- general : haltères autorisés seulement sur la première ou la deuxième marche (décision de l'utilisateur), légers, escalier dégagé, éclairé et non glissant, chaussures aux pieds ; avec haltères les mains ne sont pas libres pour la rampe : un seul haltère et l'autre main sur la rampe, ou sans haltères. Box haute : jamais avec haltères, jamais dans un escalier.
- grossesse : version sans haltères, main sur la rampe ; la box haute est retirée. Post-partum : G7.

**Grossesse** : adapter: variante:montee-sur-marche-poids-du-corps
**Version plus douce** : montee-sur-marche-poids-du-corps

**Variantes** : `montee-sur-box-haute` est remplacée par `montee-sur-marche-poids-du-corps` dès la gêne légère au genou, à la hanche ou à la cheville.



**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au genou, à la hanche ou à la cheville.
- Pied qui glisse ou talon qui dépasse de la marche.
- Perte d'équilibre.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Marche d'escalier : sans haltères, la première marche du bas ; avec haltères, la première ou la deuxième marche (voir ci-dessous). Escalier éclairé et dégagé, main sur la rampe si possible. Box ou banc : stable, qui ne glisse pas.
- Jamais au-delà de la deuxième marche d'un escalier (risque de chute en arrière) : pour monter plus haut, utilise une box stable, sans haltères.
- Version haltères : seulement sur la première ou la deuxième marche, haltères légers, escalier dégagé, éclairé et non glissant, chaussures aux pieds ; tes mains ne sont plus libres pour la rampe : prends un seul haltère et garde l'autre main sur la rampe, ou reviens sans haltères. Box haute : jamais dans un escalier, jamais avec haltères.

## Photo
- `Dumbbell_Step_Ups/0.jpg` : affichable : à vérifier (non regardée ; haltères, box).
- `Dumbbell_Step_Ups/1.jpg` : affichable : à vérifier (non regardée).
Variante poids du corps : illustrable par ces images avec la mention « montré avec haltères », une fois vérifiées.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Un pied sur la plateforme, poussée dans le talon, l'autre pied rejoint, descente, changement de jambe | free-exercise-db « Dumbbell_Step_Ups » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Dumbbell_Step_Ups.json ; réécrit par coach | base d'exercices (domaine public), pas d'étude | 2026-10-21 | PROVISOIRE |
| Muscles (quadriceps ; mollets, fessiers, ischios) | même fiche ; moyen fessier ajouté par coach | idem | 2026-10-21 | PROVISOIRE |
| Ne pas rebondir sur la jambe du bas ; marche stable | pratique courante | - | - | NON SOURCÉ |
| Niveau débutant (la source dit intermédiaire) | choix de coach avec marche basse, tracé le 21/10/2026 | - | - | NON SOURCÉ |
| Box haute séparée de la marche d'escalier (tag `box_ou_step`, ex-`box_stable`) | point 48 de `relecteur` ; règle R8 de `kine` | - | - | NON SOURCÉ |
| Haltères autorisés sur la première ou la deuxième marche (haltères légers, escalier dégagé et non glissant, chaussures, option un seul haltère avec rampe), échelon sans charge d'abord : l'échelon 2 est classé `intermediaire` pour que le générateur ne le propose pas à un débutant (option la plus prudente, choix de coach du 22/10/2026) | décision de l'utilisateur du 21/10/2026 (résout le bloquant R1 de `relecteur`) ; précautions de `coach`, aucune source | - | 2026-10-21 | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-21 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au genou ou à la hanche de niveau 1-2 : adapter plutôt que tout retirer | Bannuru et al., OARSI 2019, Osteoarthritis Cartilage https://wrap.warwick.ac.uk/125416/ (exercice structuré = traitement de base de l'arthrose du genou et de la hanche) | recommandation internationale (méthode GRADE) ; résumé lu | 2026-10-21 | PROVISOIRE (extrapolation : public arthrosique ; l'app ne pose aucun diagnostic) |
| Avertissement de stabilité de la marche (première marche, rampe) | règle R8 de knowledge/regles-securite-communes.md §7 (`kine`) ; exercise-catalog.md §5 ne parle pas de marche ; aucune source trouvée | - | 2026-10-21 | NON SOURCÉ |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
