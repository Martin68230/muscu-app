# Photos de l'app : provenance, licence, transformation

Règle 12 de CLAUDE.md : seulement des photos libres, en WebP légères, chargées à la demande. Une photo n'est affichée que si la section « Photo » de la fiche dit `affichable : oui`.

## public/photos/free-exercise-db/

| Fichier | Origine | Licence | Transformation |
|---|---|---|---|
| `Incline_Push-Up-0.webp` | https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Push-Up/0.jpg (lu le 2026-10-21) | Unlicense (domaine public), dépôt yuhonas/free-exercise-db | recadrage 505 x 400 px à partir du point (195, 100) de l'image 850 x 567, puis largeur 600 px, WebP qualité 70 (sharp) |
| `Incline_Push-Up-1.webp` | même dépôt, `.../Incline_Push-Up/1.jpg` | idem | recadrage 505 x 400 px à partir du point (290, 62), puis largeur 600 px, WebP qualité 70 |

Pourquoi le recadrage (décision de l'utilisateur, 21/10/2026) : les originaux montrent le mur « Boise CrossFit » de la salle (logo d'un tiers). Le recadrage enlève ce logo sans couper le geste (tête, bras, mains, pieds et appui restent visibles). Restes connus : l'appui est une box en bois (pas un banc ni une chaise : à ne montrer que pour les échelons chaise et marche, voir la fiche `pompe-inclinee`) ; dans `-1`, la box est coupée sur son bord gauche ; une petite bannière sombre illisible reste en haut de `-1`. Statut de la fiche à mettre à jour par `coach` (affichable : oui après recadrage).

Convention de nommage : `<dossier free-exercise-db>-<numéro>.webp`. Largeur 600 px, qualité 70, environ 20 Ko par image. Le script `npm run check:fiches` avertit (sans bloquer) si une image marquée « oui » n'a pas son fichier WebP ici.

## Crédits
La page « crédits » de l'app doit citer : free-exercise-db (yuhonas, domaine public, photos recadrées). Jamais d'images du dépôt maxwu.
