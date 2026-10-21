---
id: pompe-piquee-pieds-sureleves
nom: Pompe piquée pieds surélevés
schema: poussee_v
type: force
niveau_min: intermediaire
muscles_principaux: [deltoides_anterieurs, triceps]
muscles_secondaires: [trapezes, dentele_anterieur, abdominaux]
source_brouillon: []  # absent du brouillon comme mouvement séparé : ajout coach (progression de M1695)
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| pompe-piquee-pieds-marche | Pieds sur une marche | 1 | intermediaire | poids_du_corps, marche_escalier | Pieds sur une marche basse ou une box stable. |
| pompe-piquee-pieds-chaise | Pieds sur une chaise | 2 | intermediaire | poids_du_corps, chaise | Chaise stable calée contre un mur : plus haut, donc plus dur. |

## Consignes
1. Pieds posés sur le support, mains au sol à largeur d'épaules.
2. Avance les mains vers le support pour monter les hanches haut.
3. Buste le plus vertical possible, tête entre les bras.
4. Plie les coudes pour descendre le haut de la tête vers le sol.
5. Pousse pour revenir bras tendus.

## Points d'attention
- Support qui ne glisse pas.
- Hanches au-dessus des épaules.
- Descente lente et contrôlée.
- Arrête la série dès que tu ne contrôles plus la descente.

## Erreurs fréquentes
- Mains trop loin du support : le buste n'est pas assez vertical.
- Dos qui se creuse.
- Tête qui tape le sol.

## Progression / régression
- plus-facile : pompe-piquee
- plus-dur : a-creer:pompe-equilibre-mur
pompe-piquee <- **pompe-piquee-pieds-sureleves** (marche -> chaise) -> pompe en équilibre contre un mur (avancé, à créer)

## Repères de dosage
Voir program-logic.md.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | adapter: variante:pompe-piquee | retirer: remplacant:pompe-chaise | retirer |
| Coude | adapter: amplitude:reduite | adapter: variante:pompe-piquee | retirer |
| Poignet | adapter: variante:pompe-piquee | retirer | retirer |
| Cou | adapter: variante:pompe-piquee | retirer | retirer |

**Notes**
- coude-n1 : variante pieds sur une marche, amplitude réduite.
- coude-n2 : mains sur une marche (pompe-piquee-mains-marche).
- poignet-n1 : mains sur une marche.
- cou-n1 : moins de tête en bas.
- grossesse : tête en bas et risque de chute, donc retiré ; remplaçant conseillé : pompe-chaise. Post-partum : G7.

**Grossesse** : retirer: remplacant:pompe-chaise
**Version plus douce** : pompe-piquee

**Points d'attention (kine)**
- Si un médecin t'a déconseillé les positions tête en bas, ne fais pas cet exercice (proposition : une case dédiée dans le profil, à trancher avec l'utilisateur et `dev` ; NON SOURCÉ).



**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente à l'épaule, au coude, au poignet ou au cou.
- Vertige, pression forte dans la tête, mal de tête ou vision trouble.
- Pieds qui glissent ou support qui bouge.
- Tu ne contrôles plus la descente : la tête risque de taper.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Chaise à 4 pieds, sans roulettes, non pliante, en bon état ; dossier calé contre un mur ; sol non glissant (pas de tapis qui glisse, pas de carrelage mouillé).
- Avant la première série, appuie-toi dessus comme pendant l'exercice : si elle bouge, glisse ou grince, n'utilise pas cette chaise.
- Commence toujours par la marche, plus basse. Pieds nus ou chaussures, jamais en chaussettes sur une chaise ou une marche lisse.

## Photo
- aucune photo
Aucune photo affichable (affichable : sans objet).

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Existence de la version pieds surélevés | The Prehab Guys « Pike Push Up – Legs Elevated » https://library.theprehabguys.com/?p=35129 (titre vu en recherche, page non lue) | pratique professionnelle (kinés) | 2026-10-21 | NON SOURCÉ (source non lue) |
| Consignes | rédigées par coach à partir de la pompe piquée | pratique courante | 2026-10-21 | NON SOURCÉ |
| Muscles | comme la pompe piquée (NASM via résumé) | - | 2026-10-21 | PROVISOIRE |
| Plus le support est haut, plus c'est dur | pratique courante | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-21 | R1, R2, R3, R7, R8 : NON SOURCÉ ; R4, R5, R6, R9 (partie), R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Arrêt si vertige, pression dans la tête ou vision trouble (tête en bas) | prudence de `kine`, rattachée aux signes généraux R5 (Riebe 2015) ; aucune source spécifique | extrapolation | 2026-10-21 | NON SOURCÉ |
| Avertissement de stabilité de la chaise | règle de conception (exercise-catalog.md §5, cite la chaise) et R8 de knowledge/regles-securite-communes.md ; aucune source trouvée | - | 2026-10-21 | NON SOURCÉ |
| Avertissement de stabilité de la marche (première marche, rampe) | règle R8 de knowledge/regles-securite-communes.md §7 (`kine`) ; exercise-catalog.md §5 ne parle pas de marche ; aucune source trouvée | - | 2026-10-21 | NON SOURCÉ |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
