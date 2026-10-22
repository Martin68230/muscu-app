---
id: etirement-mollets-mur
nom: Étirement des mollets contre le mur
schema: mobilite
type: mobilite_recup
niveau_min: debutant
muscles_principaux: [mollets]
muscles_secondaires: []
source_brouillon: []
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| etirement-mollets-jambe-tendue | Jambe arrière tendue | 1 | debutant | mur | Debout face au mur, mains à plat à hauteur d'épaules, une jambe loin derrière, talon au sol. |
| etirement-mollets-genou-plie | Jambe arrière légèrement pliée | 1 | debutant | mur | Même installation, genou arrière plié en gardant le talon au sol. |
| etirement-mollets-marche | Talon dans le vide sur une marche | 2 | debutant | marche_escalier, mur | Avant du pied sur le bord de la marche, une main au mur ou à la rampe, talon qui descend sous le niveau de la marche. |

## Consignes
1. Debout face au mur, mains à plat à hauteur des épaules.
2. Recule une jambe, talon bien au sol, orteils pointés droit devant.
3. Plie la jambe avant et avance le bassin vers le mur jusqu'à sentir l'arrière du mollet arrière.
4. Respire calmement, puis reviens ; fais l'autre jambe.

## Points d'attention
- La variante genou plié cible le bas du mollet ; jambe tendue, le haut (NON SOURCÉ, usage de coach).
- Une tension, jamais une douleur ; talon toujours au sol.
- Aucune durée ni nombre donné (aucune valeur sourcée).

## Erreurs fréquentes
- Talon arrière qui se lève.
- Pied qui s'ouvre vers l'extérieur.
- Rebondir.

## Progression / régression
- plus-facile : aucun
- plus-dur : aucun

## Repères de dosage
Voir program-logic.md et load-calibration.md. Aucune valeur propre à ce mouvement.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-22. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3). L'app a dix zones : cou, épaule, coude, poignet, dos, hanche, genou, cheville, cuisse (face arrière : ischios) et aine (adducteurs). Une gêne au tendon d'Achille se déclare sous « cheville ».

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Cheville | adapter: variante:etirement-mollets-jambe-tendue | retirer | retirer |
| Genou | adapter: variante:etirement-mollets-jambe-tendue | adapter: variante:etirement-mollets-jambe-tendue | retirer |

**Notes**
- cheville-n1 : jambe tendue, talon au sol, tension légère, pas de talon dans le vide (marche exclue).
- cheville-n2 : exercice retiré (tendon d'Achille et mollet irritables : pas d'étirement tant que la gêne est nette ; prudence de `kine`, NON SOURCÉ).
- genou-n1 : jambe arrière tendue, genou non plié.
- genou-n2 : même variante ; aucune augmentation (R2).
- grossesse : contre le mur, sans la marche (risque de chute, G4). Station debout immobile prolongée à éviter (G4) : étirement court, change d'appui, assieds-toi si besoin. Une douleur ou un gonflement d'un mollet est un signe d'arrêt (G6).
- general : tendon d'Achille : sans zone propre dans l'app, une gêne se déclare sous « cheville ». La variante sur la marche est la plus exigeante : à éviter si l'équilibre est incertain. Version plus douce : etirement-mollets-jambe-tendue.

**Grossesse** : adapter: variante:etirement-mollets-jambe-tendue
**Version plus douce** : etirement-mollets-jambe-tendue

**Signes qui doivent faire arrêter**
- Douleur (pas la simple sensation d'étirement) : relâche tout de suite et sors de la position ; un étirement est une tension douce, jamais une douleur, et ne se force pas (pas de rebond, pas d'à-coup).
- Engourdissement, fourmillements ou sensation de décharge pendant la position : relâche immédiatement ; si cela revient ou ne passe pas, consulte un professionnel de santé (S2).
- Douleur dans le mollet, au-dessus du talon ou derrière la cheville : relâche et arrête.
- Douleur ou gonflement d'un seul mollet : consulte (S2) ; en grossesse, arrête et contacte ton médecin ou ta sage-femme (G6).
- Douleur qui dure, qui s'aggrave ou qui réveille la nuit, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2) ; ces signes n'ont pas à être « diagnostiqués » par toi.
- Si le réglage « enceinte / post-partum » est coché : saignement, perte de liquide, contractions, vertige, douleur ou gonflement d'un mollet, fuite d'urine ou pesanteur dans le bas-ventre : arrête et contacte ta sage-femme ou ton médecin (G6, G7) ; en cas de saignement, de perte des eaux ou de contractions régulières : urgence, voir U1.

**Objets du quotidien**
- Mur propre et dégagé, sol non glissant (R8).
- Marche d'escalier : éclairée, dégagée, non glissante, chaussures aux pieds, une main au mur ou à la rampe ; talon qui descend sans à-coup (R8).
- Si l'objet bouge, glisse ou grince : arrêt, et l'objet n'est plus utilisé (R8).

## Photo
- `Calf_Stretch_Hands_Against_Wall/0.jpg` : affichable : oui (vue le 22/10/2026 ; fichier public/photos/free-exercise-db/Calf_Stretch_Hands_Against_Wall-0.webp)
- `Calf_Stretch_Hands_Against_Wall/1.jpg` : affichable : non (vue le 22/10/2026 : logo d'un tiers lisible au dos du t-shirt, non recadrable sans couper le geste)
- `Standing_Gastrocnemius_Calf_Stretch/0.jpg` : affichable : non (l'entrée montre le talon posé sur une marche, genou tendu, orteils tirés à la main : pas l'étirement contre le mur, la photo contredit la consigne, règle 12)
- `Standing_Gastrocnemius_Calf_Stretch/1.jpg` : affichable : non (même raison)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Étirement du mollet contre un mur | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db, entrée « Calf_Stretch_Hands_Against_Wall » (description lue le 22/10/2026 : face au mur, mains au mur, un pied en avant, talon arrière au sol ; la durée de l'entrée n'est pas reprise). Corrigé après contrôle `relecteur` : « Standing_Gastrocnemius_Calf_Stretch » retirée des sources (talon sur une marche, orteils tirés à la main, ce n'est pas le mur). Les variantes genou plié et talon dans le vide sur la marche ne figurent pas dans l'entrée | base d'exercices (pratique, pas une étude) | 2026-10-22 | PROVISOIRE (jambe tendue contre le mur) ; NON SOURCÉ (genou plié, marche) |
| Variante sur marche, talon dans le vide | description de coach ; pas d'entrée libre lue | - | - | NON SOURCÉ |
| Échelons, niveaux, muscles et répartition principaux / secondaires | choix de coach (décision de format de l'utilisateur, 21/10/2026) | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-22 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-22 | NON SOURCÉ (extrapolation, à valider) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-22 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
