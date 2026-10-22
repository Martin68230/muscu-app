---
id: etirement-flechisseurs-hanche
nom: Étirement de l'avant de la hanche
schema: mobilite
type: mobilite_recup
niveau_min: debutant
muscles_principaux: [flechisseurs_hanche]
muscles_secondaires: [quadriceps]
source_brouillon: []
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| etirement-flechisseurs-debout | Debout, un pas en arrière | 1 | debutant | poids_du_corps | Debout, grand pas en arrière, talon arrière levé, mains sur les hanches ; en cas de doute sur l'équilibre, une main sur un support stable (dossier de chaise, mur). |
| etirement-flechisseurs-genou-sol | Un genou au sol | 2 | debutant | tapis | Un genou posé sur le tapis, l'autre pied devant, mains sur la cuisse avant. |
| etirement-flechisseurs-genou-sol-chaise | Un genou au sol, main sur une chaise | 2 | debutant | tapis, chaise | Même installation, une main tient le dossier d'une chaise stable pour l'équilibre. |

## Consignes
1. Prends la position : un pied devant, l'autre jambe loin derrière (genou au sol ou talon levé).
2. Serre légèrement les fessiers de la jambe arrière et rentre un peu le bassin (bascule vers l'arrière).
3. Avance doucement le bassin vers l'avant jusqu'à sentir un étirement à l'avant de la hanche arrière.
4. Garde le buste droit, sans cambrer le bas du dos, et respire calmement.
5. Reviens, puis fais l'autre côté.

## Points d'attention
- Étirement doux : une tension, jamais une douleur.
- Sur sol dur, pose un tapis ou une serviette sous le genou.
- Aucune durée ni nombre donné (aucune valeur sourcée).

## Erreurs fréquentes
- Cambrer le bas du dos au lieu de basculer le bassin.
- Pencher le buste en avant.
- Avancer le genou avant au-delà du pied (perte d'équilibre).

## Progression / régression
- plus-facile : aucun
- plus-dur : mobilite-hanches-90-90

## Repères de dosage
Voir program-logic.md et load-calibration.md. Aucune valeur propre à ce mouvement.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-22. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3). L'app n'a pas de zone « aine », « cuisse » ni « tendon d'Achille » : une gêne à l'aine se déclare sous « hanche », à l'arrière de la cuisse sous « hanche » ou « genou », au tendon d'Achille sous « cheville ».

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Hanche | adapter: amplitude:reduite | adapter: amplitude:sans-gene | retirer |
| Genou | adapter: variante:etirement-flechisseurs-debout | adapter: variante:etirement-flechisseurs-debout | retirer |
| Dos | adapter: amplitude:reduite | adapter: variante:etirement-flechisseurs-debout | retirer |

**Notes**
- hanche-n1 : petit pas, bassin peu avancé.
- hanche-n2 : tension à peine perceptible ou rien ; aucune augmentation (R2).
- genou-n1 : debout : pas d'appui du genou sur le sol.
- genou-n2 : même variante ; aucune augmentation (R2).
- dos-n1 : bassin rentré, pas de cambrure.
- dos-n2 : debout, buste droit.
- grossesse : version debout avec une main sur un support stable (chaise, mur), petit pas, sans chercher l'amplitude maximale ; pas de position à genoux (G4, extrapolation ; la souplesse des ligaments en grossesse est un argument de prudence courant, NON SOURCÉ). Post-partum : G7 (sans effet).
- general : étirement doux de l'avant de la hanche : la bascule du bassin, pas la cambrure, produit la tension. Version plus douce : etirement-flechisseurs-debout.

**Grossesse** : adapter: variante:etirement-flechisseurs-debout
**Version plus douce** : etirement-flechisseurs-debout

**Signes qui doivent faire arrêter**
- Douleur (pas la simple sensation d'étirement) : relâche tout de suite et sors de la position ; un étirement est une tension douce, jamais une douleur, et ne se force pas (pas de rebond, pas d'à-coup).
- Engourdissement, fourmillements ou sensation de décharge pendant la position : relâche immédiatement ; si cela revient ou ne passe pas, consulte un professionnel de santé (S2).
- Douleur dans l'aine, devant la hanche ou au genou posé au sol : relâche et passe à la version debout ou arrête.
- Perte d'équilibre : reviens à la version debout avec appui.
- Douleur qui dure, qui s'aggrave ou qui réveille la nuit, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2) ; ces signes n'ont pas à être « diagnostiqués » par toi.
- Si le réglage « enceinte / post-partum » est coché : saignement, perte de liquide, contractions, vertige, douleur ou gonflement d'un mollet, fuite d'urine ou pesanteur dans le bas-ventre : arrête et contacte ta sage-femme ou ton médecin (G6, G7) ; en cas de saignement, de perte des eaux ou de contractions régulières : urgence, voir U1.

**Objets du quotidien**
- Tapis ou serviette pliée sous le genou, sol non glissant (R8).
- Chaise tenue pour l'équilibre : stable, dossier contre un mur, sans roulettes (R8).
- Si l'objet bouge, glisse ou grince : arrêt, et l'objet n'est plus utilisé (R8).

## Photo
- `Kneeling_Hip_Flexor/0.jpg` : affichable : à vérifier (image non regardée ; à genou)
- `Kneeling_Hip_Flexor/1.jpg` : affichable : à vérifier (image non regardée ; à genou)
- `Standing_Hip_Flexors/0.jpg` : affichable : à vérifier (image non regardée ; debout)
- `Standing_Hip_Flexors/1.jpg` : affichable : à vérifier (image non regardée ; debout)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Étirement des fléchisseurs de hanche à genou ou debout, bascule du bassin | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db, entrées « Kneeling_Hip_Flexor » et « Standing_Hip_Flexors » (descriptions lues le 22/10/2026) | base d'exercices (pratique, pas une étude) | 2026-10-22 | PROVISOIRE |
| Échelons, niveaux, muscles et répartition principaux / secondaires | choix de coach (décision de format de l'utilisateur, 21/10/2026) | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-22 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-22 | NON SOURCÉ (extrapolation, à valider) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-22 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
