# D17 : correspondance Everkinetic -> nos fiches

Étape 1 (analyse, 12/11/2026). Source : github.com/everkinetic/data (dépôt officiel, licence CC BY-SA 4.0 confirmée par LICENSE.md, auteur Greg Priday, everkinetic.com). Cloné hors dépôt dans `donnees-externes/everkinetic/repo` (315 Mo dont .git 248 Mo ; rien n'a été exécuté, aucune dépendance installée). Aucune image n'est dans le dépôt de l'app.

## Inventaire (dist/ = jeu publié par Everkinetic)

- 289 exercices (`dist/exercises.json` : id, titre anglais, muscles, matériel, étapes en anglais ; PAS d'auteur ni de licence par image : un seul auteur pour tout le projet).
- 269 exercices avec dessins : 537 SVG (deux images par exercice : `-relaxation` et `-tension`), 10,7 Mo au total, ~20 Ko chacun (médiane), max 32 Ko ; 537 PNG (24 Mo). Les SVG sont des tracés vectoriels bruts sur fond blanc (`<path>` seulement).
- Contrôle de sécurité des 537 SVG de `dist/svg` : 0 `<script>`, 0 attribut `on*`, 0 lien externe, 0 `<foreignObject>`, 0 `<image>`, 0 base64, 0 `<style>`/`<use>`/animation, 0 DOCTYPE. Aucun à écarter. (Le dossier `src/images-svg`, 35 fichiers d'un autre format avec DOCTYPE, et `src/images-ai` / `images-png-unknown` / `images-web` ne sont pas utilisés : images IA ou d'origine incertaine, exclues.)
- Les consignes anglaises d'Everkinetic ne sont PAS reprises (règle 12 : consignes réécrites en français, la fiche prime).

## Résultat de la correspondance

Nos noms de fiches sont en français et peu d'alias sont en anglais : l'appariement automatique est prudent (nom/alias normalisés identiques ET matériel compatible avec les variantes de la fiche) et donne 0 confiance haute aujourd'hui ; 22 exercices Everkinetic en confiance moyenne (13 fiches), à valider à la main. L'appariement fiable passe donc par une table de correspondance écrite à la main (étape 2), pas par le script seul.

## Plan de l'étape 2 (proposition, à valider)

1. Table `knowledge/exercices/CORRESPONDANCE-EVERKINETIC.tsv` : id de fiche, id Everkinetic, variante visée (id de variante), validé par `coach`. Le coach compare pour chaque paire le dessin et la consigne : si le dessin contredit la fiche (position, matériel, variante), pas d'image. Lot pilote de 30 à 40 paires (les exercices les plus fréquents sans photo), un seul passage de relecture seulement si une image concerne un exercice à enjeu de sécurité.
2. Conversion : dessins nettoyés (réutiliser le contrôle ci-dessus, liste blanche d'éléments `svg`/`path`/`g`), fond blanc retiré, SVG optimisé (svgo, précision 1 décimale, viewBox conservé) ; cible 4 à 8 Ko par image. Si un fichier dépasse 10 Ko, WebP 320 px. Budget total : 2 images x 80 exercices max <= 3 Mo, vérifié par un test.
3. Emplacement : `public/images/everkinetic/<id-fiche>-1.svg` et `-2.svg` (relaxation, tension), précachés par le service worker (hors-ligne).
4. Crédits : ajouter à `src/data/credits.json` une source « Everkinetic » (auteur Greg Priday, CC BY-SA 4.0, lien everkinetic.com et le dépôt, nombre d'images) et la mention « Dessins vectoriels nettoyés et optimisés (fond retiré, tracé simplifié), recadrés pour l'app » ; l'écran crédits affiche déjà une ligne par source. Les images adaptées sont publiées sous CC BY-SA 4.0 (texte à ajouter à la page crédits avec le lien vers la licence). `tools/make-credits.mjs` compte les images.
5. Affichage dans la fiche : l'image Everkinetic n'est jamais l'image principale par défaut tant qu'un coach ne l'a pas validée ; elle s'affiche en second (après la photo / l'illustration maison), avec la légende « Dessin : Everkinetic, CC BY-SA 4.0 » et l'alternative « position de départ / position contractée ». Rien n'est affiché si la variante choisie ne correspond pas à la variante de la table.
6. Test : chaque fichier listé existe, ne contient que des éléments autorisés, le total <= 3 Mo, chaque image a sa ligne dans les crédits.


<!-- AUTO:DEBUT (généré par tools/everkinetic-correspondance.mjs --ecrire ; ne pas modifier à la main) -->
### Agrégats

- Exercices Everkinetic (dist/exercises.json) : 289 ; sans SVG : 20 ; avec SVG : 269.
- Nos fiches : 227 ; image principale actuelle : photo 67, illustration maison seule 160, aucune 0.
- Correspondances de confiance haute : 0 exercices Everkinetic -> 0 fiches ; moyenne (à valider à la main, jamais utilisées telles quelles) : 22 -> 13 fiches.
- Fiches de confiance haute SANS photo (illustration maison ou rien) qui gagneraient un dessin : 0 (11 en comptant la confiance moyenne).
- Poids brut des SVG des correspondances de confiance haute : 0.00 Mo (0 fichiers), avant optimisation.

### Correspondances de confiance haute

| id de fiche | nom Everkinetic (id) | via | auteur | SVG | poids (Ko) | image actuelle |
|---|---|---|---|---|---|---|

### Confiance moyenne (extraits, à trier à la main)

| id de fiche | nom Everkinetic (id) | via |
|---|---|---|
| curl-barre | EZ Bar Curl with Barbell (0226) | barbell curl |
| curl-halteres | Biceps Curl: Barbell (0211) | curl biceps |
| curl-halteres | Biceps Curl: Dumbbell (0224) | curl biceps |
| curl-halteres | Biceps Curl: Machine (0253) | curl biceps |
| developpe-couche-barre | Bench Press: Barbell (0042) | bench press |
| developpe-couche-barre | Bench Press: Dumbbell (0055) | bench press |
| developpe-couche-barre | Bench Press: Machine (0066) | bench press |
| developpe-couche-barre | Bench Press: Smith Machine (0078) | bench press |
| developpe-couche-prise-serree-barre | Bench Press: Barbell (Close Grip) (0049) | close-grip bench press |
| developpe-couche-prise-serree-barre | Bench Press: Smith Machine (Close Grip) (0195) | close-grip bench press |
| developpe-incline-barre | Bench Press: Barbell (Incline) (0043) | incline bench press |
| developpe-incline-barre | Bench Press: Bands (Incline) (0044) | incline bench press |
| developpe-incline-barre | Bench Press: Dumbbell (Incline) (0061) | incline bench press |
| developpe-incline-barre | Bench Press: Smith Machine (Incline) (0081) | incline bench press |
| developpe-incline-barre | Bench Press: Smith Machine (Incline) (0302) | incline bench press |
| elevation-laterale | Lateral Dumbbell Raises (0018) | lateral raise |
| extension-genou-elastique | Leg Extensions (0142) | leg extension |
| good-morning-barre, good-morning-elastique | Good Mornings: Barbell (0101) | good morning |
| good-morning-barre, good-morning-elastique | Good Mornings: Smith Machine (0102) | good morning |
| haussement-epaules-halteres, shrug-barre | Barbell Shrugs (0030) | shrug |
| rowing-barre-penche | Bent Over Row with Barbell (0298) | bent-over row |
| squat-avant-barre | Front Squat with Barbell (0138) | front squat |
<!-- AUTO:FIN -->
