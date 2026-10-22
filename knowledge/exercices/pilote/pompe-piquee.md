---
id: pompe-piquee
nom: Pompe piquée (en V)
schema: poussee_v
type: force
niveau_min: debutant
muscles_principaux: [deltoides_anterieurs, triceps]
muscles_secondaires: [pectoraux, dentele_anterieur, trapezes]
source_brouillon: [M1695]
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| pompe-piquee-mains-marche | Mains sur une marche | 1 | debutant | poids_du_corps, marche_escalier | Mains sur la première marche d'un escalier éclairé et dégagé : un peu plus facile. |
| pompe-piquee-sol | Mains au sol | 2 | debutant | poids_du_corps, tapis | Mains et pieds au sol, hanches hautes. |

## Consignes
1. Mets-toi à quatre pattes, puis monte les hanches : ton corps fait un V à l'envers.
2. Mains à largeur d'épaules, pieds rapprochés des mains autant que possible.
3. Plie les coudes pour descendre le haut de la tête vers l'avant, devant les mains (vers le sol ; avec les mains sur la marche, vers le niveau de la marche, sans la toucher).
4. Les coudes partent un peu vers l'arrière, pas sur les côtés.
5. Pousse le sol pour revenir bras tendus.

## Points d'attention
- Hanches hautes tout le long.
- Regarde vers tes pieds ou entre tes mains.
- Descends seulement tant que tu contrôles.
- La tête ne touche pas le sol.

## Erreurs fréquentes
- Hanches qui descendent : ça devient une pompe classique.
- Coudes grands ouverts.
- Descente trop rapide vers la tête.

## Progression / régression
- plus-facile : pompe-chaise
- plus-dur : pompe-piquee-pieds-sureleves
pompe-chaise (fiche pompe) <- **pompe-piquee** (mains sur marche -> mains au sol) -> pompe-piquee-pieds-sureleves -> pompe en équilibre contre un mur (avancé, à créer)

## Repères de dosage
Voir program-logic.md.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | adapter: variante:pompe-piquee-mains-marche | retirer: remplacant:pompe-chaise | retirer |
| Coude | garder | adapter: variante:pompe-piquee-mains-marche | retirer |
| Poignet | adapter: variante:pompe-piquee-mains-marche | retirer | retirer |
| Cou | adapter: amplitude:reduite | retirer | retirer |

**Notes**
- epaule-n1 : mains sur une marche (variante de l'échelon 1), descente moins profonde.
- coude-n2 : mains sur une marche (variante de l'échelon 1), descente moins profonde.
- poignet-n1 : mains sur le bord, poignet moins plié.
- poignet-n2 : exercice retiré dès une gêne nette au poignet (aucun remplaçant proposé ici) ; si la gêne persiste, consulte.
- cou-n1 : la tête ne touche jamais le sol.
- grossesse : tête en bas et risque de chute, donc retiré ; remplaçant conseillé : pompe-chaise. Post-partum : G7.

**Grossesse** : retirer: remplacant:pompe-chaise
**Version plus douce** : pompe-piquee-mains-marche



**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente à l'épaule, au coude, au poignet ou au cou.
- Vertige, pression forte dans la tête, mal de tête ou vision trouble (tête plus basse que le cœur).
- La tête touche le sol.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Marche : seulement la première marche d'un escalier éclairé et dégagé, sèche, qui ne glisse pas sous les mains (R8).

## Photo
- aucune photo
Aucune photo affichable (affichable : sans objet). « Handstand_Push-Ups » est un autre mouvement, de niveau expert : à ne pas utiliser.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Mouvement | Brouillon M1695 (wger « Pike Push Ups ») : prouve seulement que le mouvement existe ; page wger non lue | base d'exercices | 2026-10-21 | NON SOURCÉ |
| Position en V à l'envers, épaules surtout, erreurs : hanches qui tombent, coudes ouverts | NASM Exercise Library « Pike Push-Up » https://www.nasm.org/exercise-library/pike-push-up (connue par un résumé de moteur de recherche ; page non lue) | organisme de certification | - | NON SOURCÉ (source non lue) |
| Muscles (deltoïde antérieur ; pectoraux, triceps, dentelé) | NASM, même page (non lue) | idem | - | NON SOURCÉ (source non lue) |
| Variante mains sur marche plus facile ; ordre de l'échelle | choix de coach | - | - | NON SOURCÉ |
| Niveau débutant | choix de coach (la seule poussée verticale sans matériel accessible) : à trancher | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-21 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Arrêt si vertige, pression dans la tête ou vision trouble (tête en bas) | prudence de `kine`, rattachée aux signes généraux R5 (Riebe 2015) ; aucune source spécifique | extrapolation | 2026-10-21 | NON SOURCÉ |
| Avertissement de stabilité de la marche (première marche, rampe) | règle R8 de knowledge/regles-securite-communes.md §7 (`kine`) ; exercise-catalog.md §5 ne parle pas de marche ; aucune source trouvée | - | 2026-10-21 | NON SOURCÉ |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
