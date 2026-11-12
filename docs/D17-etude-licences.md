# D17 : étude des licences des images d'exercices

Statut : étude, rien importé. Date : 12/11/2026. Sources : pages GitHub / LICENSE publiques lues le 12/11/2026 (poids, dates de commit et vérification wger non affichés : à confirmer avant tout import). Pages lues, jamais téléchargées.

| | free-exercise-db | wger | Everkinetic | GymMane | RepDB (gratuit) |
|---|---|---|---|---|---|
| Propriétaire | yuhonas | organisation wger-project | everkinetic (Greg Priday) | InlitX | Sergei Argutin (RepDB, Berlin) |
| Licence | The Unlicense (domaine public), LICENSE.md | Code AGPL-3.0 ; images : licence par image (CC-BY-SA 3/4, CC0, CC-BY 4, ODbL selon l'API /license/, source secondaire) | CC BY-SA 4.0 (LICENSE.md) | Code GPL-3.0 + clause 7(b) ; dessins CC BY-SA 4.0 (CREDITS.md) | RepDB Free Tier License v1.0 (LICENSE-DATA.md) |
| Commercial | oui | selon image | oui (aucune restriction NC) | oui pour les dessins | oui, dans l'app |
| Attribution | non exigée (remerciements d'usage) | oui : auteur + licence + lien, par image ; 104/383 sans auteur, 46 générées par IA (source tierce) | oui + indiquer les modifications | oui : Bryl Lim (Workout Guide) et Everkinetic ; « Based on GymMane by InlitX » si dérivé du code | oui : « Exercise data by RepDB (repdb.co) » visible dans la page crédits |
| Modification | oui | selon image | oui, sous BY-SA | oui, sous BY-SA | recadrer / redimensionner / recolorier en app seulement |
| Redistribution dans dépôt public | oui | selon image, avec attribution | oui sous BY-SA | oui sous BY-SA | NON (terme 3 : pas de republication du jeu, ni modifié, hors app) |
| Poids | non affiché | non affiché | non affiché | non affiché (500+ exercices) | non affiché (701 exercices, WebP 512 px) |
| Format | JPG (2 poses) | JPG / PNG, variable | SVG / illustrations | tracés vectoriels texte (path data), 3 images par exercice, Flutter | WebP 512 px, plats, start / peak |
| Consignes | anglais | multilingue (EN, FR...) | peu ou pas de consignes | non confirmé | EN, DE, ES (pas de FR) |
| Activité | 93 commits, date non vue | très active (9 835 commits) | 22 commits, probablement inactif | 499 commits, 1,7 k étoiles | 62 commits, récent (compteurs du 11/11/2026) |

## Points d'attention
- CC BY-SA : l'attribution et le partage à l'identique valent pour les images adaptées (pas pour le code de l'appli, mais pour les images modifiées, à rediffuser sous BY-SA). Le dépôt public est lui-même une redistribution : la mention de licence doit y figurer.
- RepDB : l'interdiction de republier (terme 3) empêche de commiter les images dans le dépôt public. Seul le téléchargement au build (GitHub Actions) avec embarquement dans l'appli pourrait respecter l'esprit du texte, mais les fichiers déployés sur GitHub Pages sont publics : cas à faire confirmer par écrit à support@repdb.co. Interdiction d'usage IA génératif ; images générées par IA.
- GymMane : ses dessins viennent d'Everkinetic / Workout Guide ; les prendre directement chez Everkinetic évite une couche intermédiaire.
- wger : licence variable et auteur parfois absent ; il faudrait filtrer image par image (licence + auteur présents, pas d'image IA) et conserver auteur et licence.

## Conclusion
- free-exercise-db : utilisable (aucune condition légale ; page crédits par courtoisie). Conforme à la règle 12.
- wger : utilisable avec conditions (filtrer par licence et auteur, attribution par image dans la page crédits). Conforme à la règle 12 (« si la licence le permet »).
- Everkinetic : utilisable avec conditions (CC BY-SA 4.0 : attribution, mention des modifications, images adaptées sous BY-SA, page crédits). Pas évoqué par la règle 12 : à ajouter par l'utilisateur.
- GymMane : utilisable avec conditions, mais redondant avec Everkinetic ; dessins vectoriels non standard (path data) ; même attribution BY-SA. Contredit la règle 12 (source non listée, et c'est une autre app).
- RepDB : à écarter sauf accord écrit (redistribution interdite, hébergement public des images douteux, pas de FR). Contredit la règle 12 (source non listée).
- Seul l'utilisateur peut modifier la règle 12 ; rien n'est importé.
