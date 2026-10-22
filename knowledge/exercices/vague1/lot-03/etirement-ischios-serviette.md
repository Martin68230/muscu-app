---
id: etirement-ischios-serviette
nom: Étirement des ischios avec une serviette
schema: mobilite
type: mobilite_recup
niveau_min: debutant
muscles_principaux: [ischios]
muscles_secondaires: []
source_brouillon: []
statut: verifie
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| etirement-ischios-allonge | Allongé, serviette sous le pied | 1 | debutant | tapis, serviette | Couché sur le dos, serviette autour de la plante d'un pied, jambe levée, l'autre jambe pliée au sol. |
| etirement-ischios-assis | Assis au sol, jambe tendue | 2 | debutant | tapis | Assis au sol, une jambe tendue devant, l'autre pliée, dos droit. |

## Consignes
1. Version allongée : couché sur le dos, tiens la serviette autour de la plante du pied, jambe levée vers le plafond, l'autre pied à plat au sol.
2. Tends doucement la jambe en tirant sur la serviette, jusqu'à sentir l'arrière de la cuisse.
3. Garde le bassin posé et le genou à peine plié. Respire calmement, relâche, fais l'autre jambe.
4. Version assise (sans serviette) : assis sur le tapis, une jambe tendue devant toi, l'autre pliée, la plante de ce pied contre l'intérieur de la cuisse tendue ; dos droit.
5. Penche-toi lentement en avant en partant des hanches, mains vers la cheville ou le tibia, jusqu'à sentir l'arrière de la cuisse tendue ; ne force pas pour atteindre le pied.
6. Respire calmement, reviens dos droit, fais l'autre jambe.

## Points d'attention
- Tension douce, jamais une douleur ; le genou n'est pas verrouillé.
- Échelon 2 : dos droit, penche-toi des hanches, pas du dos.
- Aucune durée ni nombre donné (aucune valeur sourcée).

## Erreurs fréquentes
- Arrondir le bas du dos.
- Tirer trop fort avec la serviette.
- Verrouiller le genou.

## Progression / régression
- plus-facile : aucun
- plus-dur : aucun

## Repères de dosage
Voir program-logic.md et load-calibration.md. Aucune valeur propre à ce mouvement.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-22. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3). L'app n'a pas de zone « aine », « cuisse » ni « tendon d'Achille » : une gêne à l'aine se déclare sous « aine », à l'arrière de la cuisse sous « hanche » ou « genou », au tendon d'Achille sous « cheville ».

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Hanche | adapter: amplitude:reduite | retirer | retirer |
| Genou | garder | adapter: amplitude:sans-gene | retirer |
| Dos | adapter: variante:etirement-ischios-allonge | adapter: variante:etirement-ischios-allonge | retirer |
| Cuisse | adapter: amplitude:reduite | retirer | retirer |

**Notes**
- hanche-n1 : jambe moins haute, tension à peine perceptible.
- hanche-n2 : exercice retiré (arrière de la cuisse : pas d'étirement tant que la gêne est nette, prudence de `kine`, NON SOURCÉ).
- genou-n2 : uniquement dans l'amplitude sans gêne ; aucune augmentation (R2).
- dos-n1 : allongé : pas de flexion du dos vers l'avant.
- dos-n2 : même variante ; aucune augmentation (R2).
- cuisse-n1 : jambe moins haute, tension à peine perceptible. NON SOURCÉ (choix prudent de `kine`).
- cuisse-n2 : exercice retiré (arrière de la cuisse : pas d'étirement tant que la gêne est nette, prudence de `kine`, NON SOURCÉ).
- grossesse : assis au sol, dos droit, jambe tendue devant ; le couché sur le dos est retiré (G4). Post-partum : G7 (sans effet).
- general : arrière de la cuisse : à déclarer sous « cuisse ». Blessure récente aux ischios : ne pas étirer, consulte (S1, S2). Genou non verrouillé. Version plus douce : etirement-ischios-allonge.

**Grossesse** : adapter: variante:etirement-ischios-assis
**Version plus douce** : etirement-ischios-allonge

**Signes qui doivent faire arrêter**
- Douleur (pas la simple sensation d'étirement) : relâche tout de suite et sors de la position ; un étirement est une tension douce, jamais une douleur, et ne se force pas (pas de rebond, pas d'à-coup).
- Engourdissement, fourmillements ou sensation de décharge pendant la position : relâche immédiatement ; si cela revient ou ne passe pas, consulte un professionnel de santé (S2).
- Douleur vive ou « tirage » à l'arrière de la cuisse, ou fourmillements dans la jambe : relâche et arrête.
- Douleur qui dure, qui s'aggrave ou qui réveille la nuit, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2) ; ces signes n'ont pas à être « diagnostiqués » par toi.
- Si le réglage « enceinte / post-partum » est coché : saignement, perte de liquide, contractions, vertige, douleur ou gonflement d'un mollet, fuite d'urine ou pesanteur dans le bas-ventre : arrête et contacte ta sage-femme ou ton médecin (G6, G7) ; en cas de saignement, de perte des eaux ou de contractions régulières : urgence, voir U1.

**Objets du quotidien**
- Serviette en bon état, sèche, qui ne glisse pas du pied ; si elle craque, arrêt (R8).
- Tapis ou sol non glissant (R8).
- Si l'objet bouge, glisse ou grince : arrêt, et l'objet n'est plus utilisé (R8).

## Photo
- `Leg-Up_Hamstring_Stretch/0.jpg` : affichable : à vérifier (image non regardée)
- `Leg-Up_Hamstring_Stretch/1.jpg` : affichable : à vérifier (image non regardée)
- `Seated_Floor_Hamstring_Stretch/0.jpg` : affichable : à vérifier (image non regardée)
- `Seated_Floor_Hamstring_Stretch/1.jpg` : affichable : à vérifier (image non regardée)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Étirement des ischios allongé ou assis | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db, entrées « Leg-Up_Hamstring_Stretch » (couché, jambe levée, sans serviette) et « Seated_Floor_Hamstring_Stretch » (assis, se pencher depuis les hanches) (descriptions lues le 22/10/2026 ; les durées des entrées ne sont pas reprises) | base d'exercices (pratique, pas une étude) | 2026-10-22 | PROVISOIRE |
| La serviette autour du pied (variante allongée) | ajout de coach, absent de l'entrée Leg-Up_Hamstring_Stretch | - | - | NON SOURCÉ |
| Échelons, niveaux, muscles et répartition principaux / secondaires | choix de coach (décision de format de l'utilisateur, 21/10/2026) | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-22 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-22 | NON SOURCÉ (extrapolation, à valider) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-22 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
