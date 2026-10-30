---
id: planche-touche-epaule
nom: Planche touche-épaule
schema: anti_rotation
type: gainage
niveau_min: intermediaire
famille_core: anti_rotation
muscles_principaux: [abdominaux, obliques]
muscles_secondaires: [deltoides_anterieurs, dentele_anterieur, fessiers]
source_brouillon: [M1714, M1503]
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| planche-touche-epaule-genoux | Sur les genoux | 1 | intermediaire | poids_du_corps, tapis | Planche bras tendus, genoux au sol. |
| planche-touche-epaule-pieds | Sur les pieds | 2 | intermediaire | poids_du_corps, tapis | Planche bras tendus, pieds écartés. |
| planche-touche-epaule-pieds-serres | Sur les pieds, pieds serrés | 3 | intermediaire | poids_du_corps, tapis | Planche bras tendus, pieds serrés : plus dur que pieds écartés. |

## Consignes
1. Mets-toi en haut de pompe, bras tendus, mains sous les épaules.
2. Sur les pieds : écarte-les au moins à la largeur des épaules pour plus de stabilité, et ne les rapproche que pour la version « pieds serrés » (plus dure). Sur les genoux : pose-les au sol, rien d'autre à régler.
3. Lève une main et touche l'épaule opposée.
4. Repose la main, puis change de côté.
5. Le bassin ne bouge pas pendant tout l'exercice.

## Points d'attention
- Bassin immobile : imagine un verre d'eau posé sur ton dos.
- Mouvement lent.
- Corps droit, fessiers serrés.
- Plus les pieds sont écartés, plus c'est facile.

## Erreurs fréquentes
- Bassin qui se balance d'un côté à l'autre.
- Fesses qui montent.
- Aller vite pour « finir ».

## Progression / régression
- plus-facile : planche
- plus-dur : aucun
planche <- **planche-touche-epaule-genoux** -> planche-touche-epaule-pieds -> planche-touche-epaule-pieds-serres

## Repères de dosage
Voir program-logic.md.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | adapter: variante:planche-touche-epaule-genoux | retirer: remplacant:dead-bug | retirer |
| Poignet | adapter: variante:planche-touche-epaule-genoux | retirer: remplacant:planche-avant-bras | retirer: sans-zone:planche-avant-bras |
| Coude | garder | adapter: variante:planche-touche-epaule-genoux | retirer |
| Dos | adapter: variante:planche-touche-epaule-genoux | adapter: variante:planche-genoux | retirer |

**Notes**
- poignet-n3 : la planche sur les avant-bras ne charge pas les poignets.
- general : les échelons sur les pieds et pieds serrés sont remplacés partout où une case du tableau demande une variante ou un retrait (épaule, poignet, dos dès le niveau 1 ; coude dès le niveau 2) ; une case `garder` laisse l'échelon inchangé. Version plus douce : sur les genoux, puis planche.
- grossesse : maintien isométrique prolongé, donc retiré ; remplaçant conseillé : bird-dog sans pause. Post-partum : G7.

**Grossesse** : retirer: remplacant:bird-dog
**Version plus douce** : planche-touche-epaule-genoux

**Variantes des échelons 2 et 3** : `planche-touche-epaule-pieds` et `planche-touche-epaule-pieds-serres` sont remplacées là où une case du tableau demande une variante ou un retrait (pas pour une case `garder`, par exemple coude niveau 1) ; en cas de variante, la ligne de la zone donne la variante de remplacement (`planche-touche-epaule-genoux` ou `planche-genoux`).



**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente à l'épaule ou au poignet d'appui.
- Bassin qui tourne fort ou bas du dos qui se creuse.
- Bras d'appui qui flanche.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
- aucune photo
- illustration : public/illustrations/planche-touche-epaule.svg : affichable : oui (illustration originale de l'app)
Aucune photo affichable (affichable : sans objet ; wger : licence à contrôler ; maxwu : interdit).

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Mouvement | Brouillon M1714 (wger « Plank Shoulder Taps ») et M1503 (version genoux) : prouve seulement que le mouvement existe ; pages wger non lues | base d'exercices | 2026-10-21 | NON SOURCÉ |
| Consignes et muscles | rédigés par coach | pratique courante | 2026-10-21 | NON SOURCÉ |
| Pieds écartés = plus facile | pratique courante | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-21 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Gêne au dos de niveau 1-2 : adapter plutôt que tout retirer | HAS, Prise en charge du patient présentant une lombalgie commune, 2019 https://www.has-sante.fr/jcms/c_2961499/fr/prise-en-charge-du-patient-presentant-une-lombalgie-commune (rester actif, pas de repos au lit) ; NICE NG59 https://www.nice.org.uk/guidance/ng59 (exercice en première intention) | recommandations officielles, adultes avec lombalgie commune ; HAS : fiche mémo PDF lue en entier le 2026-10-21 (https://has-sante.fr/upload/docs/application/pdf/2019-04/fm_lombalgie_v2_2.pdf) ; NICE : résumés seulement | 2026-10-21 | PROVISOIRE (extrapolation : l'app ne sait pas de quel type de douleur il s'agit) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
