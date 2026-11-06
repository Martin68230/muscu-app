---
id: rowing-serviette-resistee
nom: Rowing à la serviette tendue
alias: [tirage horizontal à la serviette, rowing isométrique]
schema: tirage_h
couverture: substitut
type: force
niveau_min: debutant
muscles_principaux: [grand_dorsal, rhomboides]
muscles_secondaires: [trapezes, deltoides_posterieurs, biceps, avant_bras]
source_brouillon: []
statut: utilisable
---

## Pourquoi cette fiche
Lot 13 (fiches manquantes, niveau 4), rédigé par `coach` le 2026-11-06. Vérification avant écriture : aucun tirage horizontal sans matériel n'existe en fiche pleine (Grep hors ecartees : rowing à l'élastique, à l'haltère, au sac, à la barre, sur banc ; tirage-w-allonge et ytw-sol sont des tirages sur le ventre sans résistance externe ; tirage-sous-table est écarté pour risque de bascule). Conclusion de coach : il n'existe pas de vrai rowing sans matériel qui soit sûr à la maison ; la serviette sur une poignée de porte n'est PAS un ancrage sûr et n'est pas proposée. Seule option sûre trouvée : une serviette tendue entre les deux mains, une main résiste pendant que l'autre tire (même principe que tirage-vertical-serviette, mais horizontal). La fiche est donc marquée substitut : tension volontaire, sans charge extérieure, elle apprend le geste et ne remplace pas un vrai rowing. Gain : seul tirage horizontal du niveau sans matériel.

## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| rowing-serviette-debout | Debout, une main résiste | 1 | debutant | poids_du_corps, serviette | Debout, pieds à largeur de hanches, genoux souples, buste droit. Serviette sèche tenue tendue entre les mains devant la poitrine : la main qui résiste est bras presque tendu devant toi, la main qui tire part du même niveau. |
| rowing-serviette-assis | Assis sur une chaise, une main résiste | 1 | debutant | serviette, chaise | Assis sur une chaise stable à 4 pieds, sans roulettes, dos près du dossier, pieds à plat ; même geste. |

## Consignes
1. Tiens une serviette sèche tendue entre tes deux mains, mains à la largeur des épaules environ, tenue dans le creux de la main, jamais enroulée autour du poignet ou de la main.
2. Une main (la main qui résiste) reste devant toi à hauteur de la poitrine, bras presque tendu ; elle serre la serviette et ne bouge pas.
3. L'autre main (la main qui tire) part du même niveau et ramène la serviette vers le côté de ta poitrine ; le coude reste près du corps et ne passe pas loin derrière le tronc.
4. La main qui résiste garde la serviette tendue pendant tout le geste, comme pour s'y opposer ; elle ne la lâche jamais.
5. Serre l'omoplate du côté qui tire une seconde, puis reviens en 3 secondes, bras presque tendu sans verrouiller le coude.
6. Fais toutes les répétitions d'un côté, puis autant de l'autre côté, en échangeant le rôle des deux mains.

## Points d'attention
- Substitut sans charge extérieure : la tension vient de ta résistance volontaire ; reste à une intensité confortable, jamais jusqu'à l'échec (NON SOURCÉ).
- Dos plat, buste droit : ne te penche pas en arrière pour tirer.
- Serviette sèche et saine : si elle glisse des mains, arrête la série ; jamais accrochée à une porte, un meuble ou une poignée (R8).
- Si une main lâche, relâche lentement la tension de l'autre, visage tourné de côté.
- Aucune durée, série, répétition ni intensité chiffrée (aucune valeur sourcée) : voir program-logic.md et load-calibration.md.

## Erreurs fréquentes
- Pencher le buste en arrière.
- Hausser l'épaule qui tire.
- Laisser la serviette se détendre.
- Tirer avec le poignet plutôt qu'avec le dos.

## Progression / régression
- plus-facile : aucun
- plus-dur : rowing-elastique

## Repères de dosage
Voir program-logic.md et load-calibration.md. Aucune valeur propre à ce mouvement (NON SOURCÉ).

## Sécurité et contre-indications
Rédigé par `coach` le 2026-11-06, **à relire par `kine`** (statut brouillon_coach). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique. Niveau 2 : aucune augmentation (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | adapter: amplitude:reduite | adapter: amplitude:reduite | retirer |
| Dos | garder | adapter: variante:rowing-serviette-assis | retirer |
| Coude | garder | adapter: amplitude:reduite | retirer |
| Poignet | adapter: amplitude:reduite | adapter: amplitude:reduite | retirer |
| Cou | garder | adapter: amplitude:tete-alignee | retirer |

**Notes**
- epaule-n1 : course plus courte, coude qui reste près du corps, sans augmenter (R2).
- epaule-n2 : même consigne, aucune augmentation de tension (R2).
- dos-n2 : assis sur une chaise stable, dos près du dossier, côtes rentrées.
- coude-n2 : course plus courte, sans tendre les bras à fond.
- poignet-n1 : serviette tenue plus relâchée, poignets bien droits.
- cou-n2 : regard devant, tête dans l'alignement du dos.
- grossesse : assis sur une chaise, dossier droit, tension modérée, respiration continue (G4). Post-partum : G7.
- general : zones non listées (hanche, genou, cheville) : garder (choix de coach, NON SOURCÉ).

**Grossesse** : adapter: variante:rowing-serviette-assis
**Version plus douce** : rowing-serviette-assis

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente à l'épaule, au coude, au poignet, au cou ou au dos.
- Douleur qui dure, qui s'aggrave ou qui réveille la nuit, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2).
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance ; si la douleur de poitrine ne passe pas au repos : urgence (U1).
- Si le réglage enceinte / post-partum est coché : saignement, contractions, fuite d'urine, pesanteur dans le bas-ventre : arrête et contacte ta sage-femme ou ton médecin (G6, G7).

**Objets du quotidien**
- Serviette : sèche, sans trou ni fil tiré, tenue dans les mains, jamais accrochée à un support ni enroulée autour du poignet (R8).
- Chaise (regles-securite-communes.md §7) : solide, 4 pieds, sans roulettes, dossier contre un mur, sol non glissant ; test avant la séance : appuie-toi dessus de tout ton poids ; si elle bouge, glisse ou grince, ne l'utilise pas.

## Photo
- illustration : public/illustrations/rowing-serviette-resistee.svg : affichable : oui (illustration originale de l'app)
- légende : Vue de dessus : serviette tendue, une main résiste bras presque tendu, l’autre la ramène vers le côté de la poitrine.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Rowing avec une serviette tendue, une main résiste (tension volontaire) | pratique courante ; analogue horizontal de tirage-vertical-serviette (lot 06) ; aucune source primaire lue ; texte d'aucune autre app repris | pratique (pas une étude) | 2026-11-06 | NON SOURCÉ |
| Pas de rowing sous une table (bascule) et pas de serviette sur une poignée de porte (ancrage non sûr) | fiche écartée tirage-sous-table ; programmes-v3.md §9 et K-10 ; regles-securite-communes.md §7 | raisonnement mécanique, aucune étude | 2026-11-06 | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-11-06 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | proposition de `coach` du 2026-11-06 par extrapolation des règles communes, à valider par `kine` ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-11-06 | NON SOURCÉ (extrapolation, à valider par kine) |
| Échelons, niveaux, muscles principaux et secondaires | choix de coach | - | 2026-11-06 | NON SOURCÉ |
| Grossesse : classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus ; aucun essai par exercice | 2026-11-06 | principe : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach) |
