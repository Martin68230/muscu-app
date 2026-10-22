---
id: fente-basse-rotation
nom: Fente basse avec rotation du buste
schema: mobilite
type: mobilite_recup
niveau_min: debutant
muscles_principaux: [flechisseurs_hanche, ischios]
muscles_secondaires: [fessiers, adducteurs, quadriceps]
source_brouillon: [M1259, M1260]
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| fente-basse-rotation-appui | Mains sur une marche | 1 | debutant | poids_du_corps, marche_escalier | Mains posées sur une marche plutôt qu'au sol, si le sol est trop loin. |
| fente-basse-rotation-sol | Au sol | 2 | debutant | poids_du_corps, tapis | Espace pour une grande fente, jambe arrière sur les orteils, genou près du sol (tapis dessous si tu le poses). |

## Consignes
1. Grand pas en avant ; la jambe arrière reste sur les orteils, le genou près du sol (tu peux le poser sur un tapis ou un coussin si c'est plus confortable).
2. Pose les deux mains au sol, de chaque côté du pied avant.
3. Garde une main au sol à l'intérieur du pied avant et laisse la hanche descendre.
4. Ouvre ce bras vers le plafond en tournant le buste, regard qui suit la main.
5. Repose la main, puis tends la jambe avant en reculant les hanches.
6. Reviens en fente, puis change de côté.

## Points d'attention
- Bouge lentement, sans forcer.
- Le genou avant reste dans l'axe du pied.
- La rotation vient du haut du dos.
- Respire dans chaque position.

## Erreurs fréquentes
- Forcer la rotation avec élan.
- Genou avant qui part vers l'intérieur.
- Bloquer la respiration.

## Progression / régression
- plus-facile : chat-vache
- plus-dur : aucun
chat-vache <- **fente-basse-rotation** (mains sur marche -> mains au sol)

## Repères de dosage
Voir program-logic.md (échauffement : à sourcer, §9). La fiche source propose des maintiens de 10 à 20 s par position : non retenu sans validation.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Hanche | adapter: variante:fente-basse-rotation-appui | adapter: variante:fente-basse-rotation-appui | retirer |
| Genou | adapter: appui:coussin | adapter: appui:coussin | retirer |
| Dos | adapter: amplitude:lente | adapter: amplitude:sans-rotation | retirer |
| Épaule | adapter: amplitude:bras-bas | adapter: amplitude:bras-bas | retirer |
| Poignet | adapter: variante:fente-basse-rotation-appui | retirer: remplacant:chat-vache | retirer |

**Notes**
- hanche-n2 : fente moins grande.
- genou-n1 : coussin sous le genou arrière ; au niveau 2, fente moins profonde.
- dos-n1 : rotation lente.
- dos-n2 : fente seule, sans rotation.
- epaule-n2 : sans lever le bras.
- poignet-n1 : poing fermé sur la marche.
- poignet-n2 : remplacement par le chat-vache sur les avant-bras.
- grossesse : version mains sur une marche, fente moins grande. Post-partum : G7.

**Grossesse** : adapter: variante:fente-basse-rotation-appui
**Version plus douce** : fente-basse-rotation-appui



**Signes qui doivent faire arrêter**
- Une position fait mal (étirement oui, douleur non).
- Pincement à l'avant de la hanche.
- Douleur, fourmillements qui descendent dans la jambe.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Marche : seulement la première marche d'un escalier éclairé et dégagé, stable et sèche, qui ne glisse pas sous les mains (R8).

## Photo
- `Worlds_Greatest_Stretch/0.jpg` : affichable : à vérifier (image non regardée).
- `Worlds_Greatest_Stretch/1.jpg` : affichable : à vérifier (image non regardée).

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Trois temps : fente basse genou arrière près du sol, bras vers l'intérieur du pied avant, puis jambe avant tendue en reculant les hanches | free-exercise-db « Worlds_Greatest_Stretch » https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Worlds_Greatest_Stretch.json ; réécrit par coach | base d'exercices (domaine public), pas d'étude | 2026-10-21 | PROVISOIRE |
| Ouverture du bras vers le plafond (rotation du buste) | ajout de coach (version courante du mouvement, absente de cette fiche source) | pratique courante | - | NON SOURCÉ |
| Muscles (ischios ; mollets, fessiers, quadriceps) | même fiche ; fléchisseurs de hanche ajoutés par coach | idem | 2026-10-21 | PROVISOIRE |
| Niveau débutant (la source dit intermédiaire) | choix de coach avec la variante mains sur marche, à trancher | - | - | NON SOURCÉ |
| Nom français descriptif au lieu de « World's Greatest Stretch » | choix de coach | - | - | NON SOURCÉ (à trancher) |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-21 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://www.has-sante.fr/jcms/c_2961499/fr/prise-en-charge-du-patient-presentant-une-lombalgie-commune (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; HAS : fiche mémo PDF lue en entier le 2026-10-21 (https://has-sante.fr/upload/docs/application/pdf/2019-04/fm_lombalgie_v2_2.pdf) ; NICE : résumés seulement | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
| Gêne au genou ou à la hanche de niveau 1-2 : adapter plutôt que tout retirer | Bannuru et al., OARSI 2019, Osteoarthritis Cartilage https://wrap.warwick.ac.uk/125416/ (exercice structuré = traitement de base de l'arthrose du genou et de la hanche) | recommandation internationale (méthode GRADE) ; résumé lu | 2026-10-21 | PROVISOIRE (extrapolation : public arthrosique ; l'app ne pose aucun diagnostic) |
| Avertissement de stabilité de la marche (première marche, rampe) | règle R8 de knowledge/regles-securite-communes.md §7 (`kine`) ; exercise-catalog.md §5 ne parle pas de marche ; aucune source trouvée | - | 2026-10-21 | NON SOURCÉ |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
