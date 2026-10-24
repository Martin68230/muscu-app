---
id: planche-ballon
nom: Planche avec un ballon de gym
alias: [swiss ball plank, planche sur ballon]
schema: gainage
type: gainage
niveau_min: intermediaire
muscles_principaux: [abdominaux, transverse]
muscles_secondaires: [obliques, deltoides_anterieurs, dentele_anterieur, fessiers]
source_brouillon: []
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| planche-ballon-avant-bras | Avant-bras sur le ballon, pieds au sol | 1 | intermediaire | swiss_ball, tapis | Debout derrière le ballon, avant-bras posés sur le ballon, coudes sous les épaules, pieds au sol reculés jusqu'à ce que le corps forme une ligne. |
| planche-ballon-tibias | Tibias sur le ballon, avant-bras au sol | 2 | avance | swiss_ball, tapis | En planche sur les avant-bras sur un tapis, tibias posés sur le ballon ; plus instable car les pieds sont sur le ballon. |

## Consignes
1. Variante 1 : place les avant-bras sur le ballon, coudes sous les épaules, et recule les pieds jusqu'à former une ligne droite de la tête aux talons.
2. Serre le ventre et les fessiers, rentre légèrement le bassin pour ne pas creuser le bas du dos ; le ballon ne bouge presque pas.
3. Regarde le sol entre tes mains, nuque dans le prolongement du dos ; respire normalement, sans bloquer.
4. Tiens la durée prévue, puis avance les pieds pour revenir ; pose les genoux au sol si la ligne se casse.
5. Variante 2 : avant-bras au sol sous les épaules, pose un tibia puis l'autre sur le ballon ; même ligne droite.

## Points d'attention
- Le ballon rend la planche plus instable : si le ballon bouge beaucoup, reviens à une planche au sol (planche).
- Ligne droite : ni fesses en l'air, ni bassin qui tombe.
- Coudes sous les épaules, épaules loin des oreilles.
- Le ballon sert à varier le gainage : les études montrent une activité plus grande du ventre à la planche sur ballon que sur le sol, sans que ce soit plus utile pour la force (PROVISOIRE).
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Bassin qui s'affaisse (dos creusé).
- Fesses trop hautes.
- Tête qui tombe.
- Souffle retenu.
- Ballon trop mou ou trop gros.

## Progression / régression
- plus-facile : planche-genoux, planche-avant-bras
- plus-dur : planche-cercles-ballon

## Repères de dosage
Repères du générateur (generateur-v1.md §3.3, règle V-TEMPS, NON SOURCÉ en entier) : maintien de 20 s (débutant) à 30 s (intermédiaire et avancé), 2 séries, repos 60 s, pas de réserve demandée : la série s'arrête dès que la position ou le contrôle se dégrade. Étalonnage (load-calibration.md) : première séance avec la variante la plus facile ou la charge la plus légère disponible ; double progression (d'abord les répétitions ou la durée, puis l'échelon ou le palier suivant). **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24, repris et corrigé par `kine` le 2026-10-24 (à contrôler par `relecteur`). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: variante:planche-ballon-avant-bras | retirer | retirer |
| Épaule | adapter: variante:planche-ballon-avant-bras | retirer | retirer |
| Coude | garder | adapter: amplitude:maintien-court | retirer |
| Hanche | garder | adapter: amplitude:maintien-court | retirer |
| Genou | garder | adapter: variante:planche-ballon-avant-bras | retirer |
| Cheville | garder | adapter: variante:planche-ballon-avant-bras | retirer |
| Cou | adapter: amplitude:tete-alignee | adapter: amplitude:maintien-court | retirer |

**Notes**
- dos-n1 : variante 1 (avant-bras sur le ballon, pieds au sol, la moins instable), maintien plus court que d'habitude, bassin légèrement rentré (choix prudent, NON SOURCÉ).
- dos-n2 : retiré : une planche instable demande de contrôler le bas du dos sous fatigue (choix prudent, NON SOURCÉ) ; remplaçant non proposé (la planche au sol est elle-même adaptée par le dos).
- epaule-n1 : variante 1 (avant-bras sur le ballon, pieds au sol) ; aucune augmentation dès le niveau 2.
- genou-n2 : variante 1, pieds au sol.
- cheville-n2 : variante 1, pieds au sol.
- grossesse : retirée : maintien isométrique prolongé, pression abdominale et risque de chute du ballon (G4) ; remplaçant : bird-dog. Post-partum : G7.
- general : Non proposée aux débutants (la planche au sol et la planche sur les genoux couvrent leur besoin).

**Grossesse** : retirer: remplacant:bird-dog
**Version plus douce** : planche-genoux

**Sécurité pour l'utilisateur seul**
- Variante 1 : place un mur ou un meuble lourd devant le ballon, pour qu'il ne s'enfuie pas. Variante 2 : mur ou meuble lourd derrière tes pieds, à une distance où le ballon s'y arrête, rien d'autre sur sa trajectoire (NON SOURCÉ).
- Sortie de secours si tu perds l'équilibre ou si le ballon part : tombe vers le sol, jamais vers le côté. Variante 1 : avance les pieds, pose les genoux puis le ventre sur le tapis. Variante 2 : les avant-bras sont déjà au sol, plie les genoux puis pose-les sur le tapis ; ne rattrape pas le ballon. Essaie cette sortie une fois, ballon peu avancé, avant la première vraie série.
- Pose un tapis ferme sous toi ; pieds nus ou chaussures qui accrochent, sol non glissant.
- Variante 2 (tibias sur le ballon) : réservée aux avancés qui tiennent la planche au sol sans creuser le dos, et jamais avec un ballon neuf mal gonflé.
- Arrête la série quand la ligne se casse (bassin qui tombe), même si la durée prévue n'est pas atteinte.

**Points d'attention (kine)**
- Dos : une planche instable demande de contrôler le bas du dos sous fatigue ; arrêt de la série quand le bassin tombe ; dès une gêne légère, variante avant-bras et maintien plus court ; dès une gêne nette, retirée (NON SOURCÉ).
- Cou : la tête reste dans le prolongement du dos (regard vers le sol) ; pas de tête relevée ni qui tombe.
- Épaule : la charge est sur les épaules et les avant-bras ; plus l'appui est loin (variante 2), plus c'est lourd pour l'épaule.
- Grossesse et post-partum : retirée (G4, G7) : maintien prolongé, pression abdominale, chute du ballon ; fuite d'urine, pesanteur dans le bas-ventre ou bombement du ventre à l'effort : arrêt et avis de la sage-femme.
- Niveau : intermédiaire minimum (avancé pour les tibias sur le ballon), par prudence (NON SOURCÉ).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au bas du dos, à l'épaule ou au cou.
- Ballon qui roule vite, glisse ou qui devient mou : pose les genoux au sol et arrête.
- Bassin qui tombe ou impossibilité de garder la ligne : arrête la série.
- En post-partum : fuite d'urine à l'effort, pesanteur dans le bas-ventre, bombement du ventre : arrêt et avis de la sage-femme (G7).
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe : arrête.

**Objets du quotidien**
- Ballon de gym (swiss ball) : gonflé fermement (il ne s'écrase pas sous toi), sans fuite ni déchirure, de préférence un modèle « anti-éclatement » dont la charge maximale écrite dépasse ton poids (NON SOURCÉ : consigne de prudence de coach, aucune notice lue). Un ballon qui se dégonfle, qui glisse ou qui fait un bruit suspect : on ne l'utilise plus.
- Taille : assis sur le ballon, les cuisses sont à peu près horizontales (repère de pratique, NON SOURCÉ). Trop grand ou trop mou : l'exercice devient plus instable.
- Sol plat, sec, non glissant, avec un tapis ferme ; pas de ballon sur un sol mouillé, ciré ou en pente ; espace libre d'au moins deux bras autour de toi, aucun meuble, escalier ni objet pointu à portée du ballon qui roule (NON SOURCÉ).
- Chaussures fermées à semelle plate qui accroche, ou pieds nus sur un tapis antidérapant selon l'exercice (la fiche le dit) ; jamais de chaussettes seules sur le sol.

## Photo
- aucune photo
- illustration : public/illustrations/planche-ballon.svg : affichable : oui (illustration originale de l'app, 24/10/2026 ; vue de profil : avant-bras sur le ballon, pieds au sol, ligne droite ; puis avant-bras au sol, tibias sur le ballon)
- légende : À gauche : avant-bras sur le ballon (échelon 1). À droite : tibias sur le ballon (avancé).

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, trajet, consignes de départ) | aucune entrée de free-exercise-db ne correspond (vérifié dans dist/exercises.json le 2026-10-24) ; geste décrit par coach d'après la pratique courante | pratique (pas une étude) | 2026-10-24 | NON SOURCÉ |
| Planche (prone bridge) sur un ballon de gym : l'activité du droit de l'abdomen et du grand oblique externe est plus forte que sur le sol | Lehman, Hoda, Oliver, Chiropractic & Osteopathy 2005;13:14, https://pmc.ncbi.nlm.nih.gov/articles/PMC1187901 ; résumé lu via moteur de recherche | étude de laboratoire en EMG, adultes sains ; mesure l'activité, pas le résultat à long terme | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Surfaces instables et gainage : activité accrue des muscles du tronc sur surface instable pour la plupart des exercices (planche coudes-orteils, quadrupédie, planche latérale), mais baisse de l'activation du transverse au curl-up et aucun gain au pont dorsal ; le sol reste la base | Imai et coll., J Orthop Sports Phys Ther 2010;40(6):369-375 (9 hommes, 5 exercices sur sol et sur surface instable) ; résumé lu via moteur de recherche | étude de laboratoire en EMG, petit échantillon d'hommes | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Instabilité (ballon de gym) : à ne pas rechercher pour elle-même ; les exercices au sol et les charges libres restent la base ; l'instabilité peut avoir sa place en rééducation, dans un programme périodisé ou comme variété pour la population générale (le ballon n'est donc pas réservé au gainage) | Behm, Drinkwater, Willardson, Cowley, « The use of instability to train the core musculature », revue et prise de position CSEP, Appl Physiol Nutr Metab 2010;35(1):91-108 (revue) et 109-112 (prise de position) ; résumé de la revue relu le 24/10/2026 (Europe PMC) ; texte complet non lu | prise de position d'une société savante (CSEP) ; résumé seulement | 2026-10-24 | PROVISOIRE (résumé seulement) |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Choix du ballon (taille, gonflage, anti-éclatement), sol, espace libre | pratique de salle et raisonnement de coach ; aucune notice de fabricant lue | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; Grgic et coll., J Sport Health Sci 2022;11(2):202-211 (15 études : pas de différence nette force et hypertrophie entre séries à l'échec ou non) ; résumé lu via moteur de recherche. L'interdiction de l'échec seul est une règle de sécurité de coach | revue de revues ACSM (OK) ; méta-analyse 15 études (résumé seulement) ; la règle de sécurité n'est pas une conclusion des études | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; PROVISOIRE pour Grgic (résumé) ; NON SOURCÉ pour la règle de sécurité |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 2026-10-24, à contrôler par relecteur) |
| Grossesse et post-partum : planche sur ballon retirée (isométrique, pression abdominale, chute) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe (éviter isométrique prolongé, Valsalva, chute, couché sur le dos) : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach, confirmé par kine, NON SOURCÉ) |
