---
id: extension-dorsale-ballon
nom: Extension du dos sur un ballon de gym
alias: [back extension swiss ball, hyperextension ballon]
schema: charniere
type: force
niveau_min: intermediaire
famille_core: extension
muscles_principaux: [erecteurs_rachis]
muscles_secondaires: [fessiers, ischios, rhomboides, trapezes]
source_brouillon: []
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| extension-dorsale-ballon-bras-croises | Bras croisés, jusqu'à l'alignement | 1 | intermediaire | swiss_ball, tapis, mur | À plat ventre sur le ballon, hanches et ventre sur le ballon, pointes de pieds au sol contre un mur plein (obligatoire), bras croisés sur la poitrine ; tu soulèves le buste jusqu'à l'alignement, pas plus. |
| extension-dorsale-ballon-mains-tete | Mains derrière la tête | 2 | intermediaire | swiss_ball, tapis, mur | Même position, pointes de pieds contre le mur plein, mains légèrement posées derrière la tête, coudes ouverts : le bras de levier est plus long. |

## Consignes
1. Mets-toi à plat ventre sur le ballon, hanches et bas du ventre sur le ballon, pointes de pieds au sol bien écartées et appuyées contre un mur plein (obligatoire), bras croisés sur la poitrine.
2. Laisse le buste descendre doucement vers le sol, le dos arrondi sans forcer.
3. Soulève le buste en contractant le bas du dos et les fessiers, jusqu'à ce que le buste soit aligné avec les jambes, pas plus haut.
4. Marque une pause d'une seconde, tête dans le prolongement du dos, puis redescends lentement.
5. Ne vas jamais plus haut que l'alignement : le haut du dos ne se cambre pas.

## Points d'attention
- L'amplitude s'arrête à l'alignement : monter plus haut cambre le bas du dos sans bénéfice (choix de prudence, NON SOURCÉ).
- Pas d'élan : le mouvement est lent des deux côtés.
- Les pieds, bien écartés, donnent l'équilibre ; le mur plein est obligatoire : il empêche les pieds de glisser.
- Aucune charge ajoutée : la base propose un disque derrière la nuque, que nous ne gardons pas.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Monter trop haut en cambrant.
- Élan.
- Nuque en arrière.
- Pieds trop rapprochés.
- Ballon qui roule.

## Progression / régression
- plus-facile : aucun
- plus-dur : aucun

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE ; ACSM 2026, SRC1 : 2 à 3 séries par exercice) : cet exercice est sans charge extérieure (aucun tag de la liste « chargeable ») : 10 à 15 répétitions ; séries : 2 pour un débutant, 3 pour un intermédiaire ou un avancé en « muscle » (2 pour un exercice « autre » en force) ; réserve cible 3 (débutant) à 2, jamais 0 ; repos 90 s (120 s pour un exercice pilier d'intermédiaire). Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. Étalonnage (load-calibration.md) : première séance avec la variante la plus facile ou la charge la plus légère disponible ; double progression (d'abord les répétitions ou la durée, puis l'échelon ou le palier suivant). **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24, repris et corrigé par `kine` le 2026-10-24 (à contrôler par `relecteur`). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: amplitude:reduite | retirer | retirer |
| Épaule | garder | adapter: variante:extension-dorsale-ballon-bras-croises | retirer |
| Hanche | garder | adapter: amplitude:reduite | retirer |
| Genou | garder | garder | retirer |
| Cheville | garder | garder | retirer |
| Cou | adapter: amplitude:tete-alignee | adapter: amplitude:tete-alignee | retirer |
| Cuisse | garder | adapter: amplitude:reduite | retirer |
| Aine | garder | garder | retirer |

**Notes**
- dos-n1 : moitié de la montée, sans cambrer.
- dos-n2 : retiré : mouvement d'extension du bas du dos, choix prudent (NON SOURCÉ).
- epaule-n2 : bras croisés seulement.
- cou-n1 : tête dans le prolongement, regard vers le sol.
- cuisse-n2 : choix prudent (ischios secondaires), NON SOURCÉ.
- grossesse : retiré : à plat ventre sur le ballon, pression sur le ventre (G4) ; remplaçant : bird-dog (maintien court). Post-partum : G7.

**Grossesse** : retirer: remplacant:bird-dog
**Version plus douce** : extension-dorsale-ballon-bras-croises

**Sécurité pour l'utilisateur seul**
- Pointes de pieds contre un mur plein, pieds écartés : obligatoire (sans mur plein, ne fais pas cet exercice), pour que les pieds ne glissent pas et que le ballon ne parte pas vers l'avant ; tapis ferme antidérapant devant le ballon ; ballon bien gonflé (NON SOURCÉ).
- Sortie de secours si le ballon glisse ou si tu perds l'équilibre : décroise les bras, pose les mains au sol devant le ballon, plie les genoux pour poser le ventre puis les genoux sur le tapis. Essaie cette sortie une fois, sans monter, avant la première vraie série ; si tu ne peux pas poser les mains au sol depuis la position de départ (ballon trop gros), choisis un ballon plus petit ou ne fais pas l'exercice.
- Aucun poids dans les mains, ni disque derrière la nuque (comme dans l'entrée de la base) : charge sur la nuque non retenue (règle C6 du cou).

**Points d'attention (kine)**
- Dos : exercice d'extension du bas du dos ; amplitude limitée à l'alignement, retiré dès la gêne nette.
- Cou : tête dans le prolongement ; ne pas regarder vers le haut ; dès une gêne nette, tête alignée (déjà la consigne), dès la douleur retiré.
- Grossesse et post-partum : retiré (à plat ventre sur le ballon, pression sur le ventre) ; en post-partum, fuite d'urine ou pesanteur dans le bas-ventre : arrêt et avis de la sage-femme (G7).
- Niveau : intermédiaire minimum (position à plat ventre sur appui instable, risque de chute vers l'avant ; le bird-dog couvre le débutant), par prudence, NON SOURCÉ.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au bas du dos, au cou ou à l'arrière de la cuisse.
- Ballon qui glisse ou pieds qui perdent l'appui : arrête.
- Sensation de pincement dans le bas du dos en haut du mouvement : arrête et redescends.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe : arrête.

**Objets du quotidien**
- Ballon de gym (swiss ball) : gonflé fermement (il ne s'écrase pas sous toi), sans fuite ni déchirure, de préférence un modèle « anti-éclatement » dont la charge maximale écrite dépasse ton poids (NON SOURCÉ : consigne de prudence de coach, aucune notice lue). Un ballon qui se dégonfle, qui glisse ou qui fait un bruit suspect : on ne l'utilise plus.
- Taille : assis sur le ballon, les cuisses sont à peu près horizontales (repère de pratique, NON SOURCÉ). Trop grand ou trop mou : l'exercice devient plus instable.
- Sol plat, sec, non glissant, avec un tapis ferme ; pas de ballon sur un sol mouillé, ciré ou en pente ; espace libre d'au moins deux bras autour de toi, aucun meuble, escalier ni objet pointu à portée du ballon qui roule (NON SOURCÉ).
- Chaussures fermées à semelle plate qui accroche, ou pieds nus sur un tapis antidérapant selon l'exercice (la fiche le dit) ; jamais de chaussettes seules sur le sol.

## Photo
- `Weighted_Ball_Hyperextension/0.jpg` : affichable : non (le pratiquant tient un disque contre la poitrine, que la fiche ne propose pas (charge, règle C6) ; bras non croisés ; remplacée par l'illustration)
- `Weighted_Ball_Hyperextension/1.jpg` : affichable : non (le pratiquant tient un disque contre la poitrine, que la fiche ne propose pas (charge, règle C6) ; bras non croisés ; remplacée par l'illustration)
- illustration : public/illustrations/extension-dorsale-ballon.svg : affichable : oui (illustration originale de l'app, 24/10/2026 ; vue de profil : à plat ventre, hanches sur le ballon, bras croisés ; le buste monte jusqu'à l'alignement avec les jambes, pas plus)
- légende : Variante bras croisés. Monte seulement jusqu'à l'alignement.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet, consignes de départ) : Weighted_Ball_Hyperextension (niveau « intermediate », matériel « exercise ball ») ; la base ajoute un disque derrière la nuque, que nous ne gardons pas | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db ; fichier dist/exercises.json relu le 2026-10-24 pour vérifier l'existence de l'entrée, son niveau et son matériel ; consignes réécrites par coach | base d'exercices (pratique, pas une étude) | 2026-10-24 | PROVISOIRE |
| Extension du dos sur un ballon : travail des extenseurs du dos ; aucune étude lue sur cet exercice précis | pratique de rééducation et d'entraînement ; aucune étude lue | - | 2026-10-24 | NON SOURCÉ |
| Instabilité (ballon de gym) : à ne pas rechercher pour elle-même ; les exercices au sol et les charges libres restent la base ; l'instabilité peut avoir sa place en rééducation, dans un programme périodisé ou comme variété pour la population générale (le ballon n'est donc pas réservé au gainage) | Behm, Drinkwater, Willardson, Cowley, « The use of instability to train the core musculature », revue et prise de position CSEP, Appl Physiol Nutr Metab 2010;35(1):91-108 (revue) et 109-112 (prise de position) ; résumé de la revue relu le 24/10/2026 (Europe PMC) ; texte complet non lu | prise de position d'une société savante (CSEP) ; résumé seulement | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Choix du ballon (taille, gonflage, anti-éclatement), sol, espace libre | pratique de salle et raisonnement de coach ; aucune notice de fabricant lue | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 2026-10-24, à contrôler par relecteur) |
| Grossesse et post-partum : extension du dos sur ballon retirée (à plat ventre sur un ballon) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe (éviter isométrique prolongé, Valsalva, chute, couché sur le dos) : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, confirmé par kine, NON SOURCÉ) |
