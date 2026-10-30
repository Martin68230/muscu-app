---
id: planche-bosu
nom: Planche avec les avant-bras sur un bosu
alias: [bosu plank]
schema: gainage
type: gainage
niveau_min: intermediaire
famille_core: gainage
muscles_principaux: [abdominaux, transverse]
muscles_secondaires: [obliques, deltoides_anterieurs, dentele_anterieur, fessiers]
source_brouillon: []
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| planche-bosu-genoux | Avant-bras sur le dôme, genoux au sol | 1 | intermediaire | bosu, tapis, mur | Bosu côté dôme vers le haut, calé contre un mur plein placé du côté de ta tête (face au mur, le dôme entre le mur et toi) ; avant-bras à plat sur la moitié du dôme côté toi, coudes sous les épaules, genoux sur un tapis (épais ou avec un coussin si le genou est sensible), corps en ligne des genoux aux épaules, front loin du mur. |
| planche-bosu-pieds | Avant-bras sur le dôme, pointes de pieds | 2 | intermediaire | bosu, tapis, mur | Même installation, genoux levés, pointes de pieds sur le tapis, corps en ligne de la tête aux talons. |

## Consignes
1. Pose le bosu côté dôme vers le haut contre un mur plein, sur un sol plat et non glissant ; le mur est du côté de ta tête, derrière le bosu : tu lui fais face, le dôme entre le mur et toi (jamais le mur sur le côté ni contre tes pieds) ; un tapis de ton côté pour les genoux ou les pieds.
2. Pose les avant-bras à plat sur la moitié du dôme côté toi (jamais la main au bout d'un bras tendu), coudes sous les épaules, mains jointes ou à plat, regard vers le bas entre les mains ; ta tête reste loin du mur : si le front s'en approche, ramène les avant-bras vers toi sur le dôme ou arrête.
3. Corps en ligne : serre le ventre et les fessiers, ne creuse pas le bas du dos, ne monte pas les fesses.
4. Tiens la position sans retenir ta respiration. Arrête dès que le bas du dos se creuse ou que les épaules s'affaissent.
5. Pour finir, pose les genoux sur le tapis, puis les avant-bras au sol.

## Points d'attention
- Le bosu sert au contrôle du gainage, pas à ajouter de la charge.
- Les pieds restent sur le sol ; jamais les pieds sur le bosu (version retirée par prudence, Q27).
- Épaules loin des oreilles, nuque dans le prolongement du dos.
- Pas de mouvement des bras ou des jambes sur le bosu.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Bas du dos creusé.
- Fesses en l'air.
- Épaules qui s'affaissent.
- Retenir sa respiration.
- Bosu qui glisse (non calé).

## Progression / régression
- plus-facile : planche, planche-genoux
- plus-dur : planche-bosu-pieds

## Repères de dosage
Repères du générateur (generateur-v1.md §3.3, règle V-TEMPS ligne `gainage`, NON SOURCÉ en entier) : maintien de 20 s (débutant) puis 30 s (intermédiaire et avancé), 2 séries, repos 60 s, pas de réserve demandée : la série s'arrête dès que le bas du dos se creuse ou que les épaules s'affaissent. Aucune charge sur le bosu ; la progression se fait par l'échelon, jamais par une charge posée sur le dos. Étalonnage : première séance avec les genoux au sol. **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; maintien arrêté quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24 (sécurité reprise par `kine` le 2026-10-25, à contrôler par `relecteur` lancé à neuf). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | adapter: variante:planche-bosu-genoux | retirer | retirer |
| Dos | adapter: variante:planche-bosu-genoux | retirer | retirer |
| Coude | garder | retirer | retirer |
| Cou | adapter: amplitude:tete-alignee | retirer | retirer |
| Genou | adapter: variante:planche-bosu-genoux | retirer | retirer |

**Notes**
- general : règle unique du bosu (choix de kine, NON SOURCÉ) : jamais de charge ni de pieds sur le bosu ; pour toute gêne nette (niveau 2) à l'épaule, au coude, au dos, au cou ou au genou, la fiche est retirée (une planche sur sol plat reste disponible, avec ses propres lignes : le générateur choisit un autre gainage compatible). Gêne légère : voir les Notes de chaque zone.
- epaule-n1 : genoux au sol (levier plus court) ; choix prudent, NON SOURCÉ.
- epaule-n2 : retiré : une planche sur sol plat (fiche planche) reste disponible.
- dos-n1 : genoux au sol, maintien court.
- genou-n1 : variante genoux, avec tapis épais ou coussin sous les genoux (la case ne vaut pas pour la variante pointes de pieds, qui n'est plus proposée) ; si la gêne persiste, pas cet exercice.
- grossesse : retiré : maintien isométrique prolongé, pression sur le ventre, surface instable (G4, comme planche) ; remplacé par le bird-dog à maintien court. Post-partum : G7.

**Grossesse** : retirer: remplacant:bird-dog
**Version plus douce** : planche-bosu-genoux

**Sécurité pour l'utilisateur seul**
- Bosu bien gonflé, calé contre un mur plein du côté de la tête, tapis ferme de ton côté ; sol non glissant ; rien de dur sous le visage ; front à distance du mur (NON SOURCÉ).
- Sortie de secours, à chaque série : si une épaule lâche, si le bas du dos cède ou si le bosu glisse, ne te retiens pas avec un bras tendu : pose les genoux sur le tapis (variante pieds) puis le ventre, ou directement le ventre et les avant-bras (variante genoux), en ramenant les bras vers le corps. Le bosu est contre le mur et ne part pas ; ne tends pas la tête vers le mur. Essaie cette sortie une fois avant la première vraie série (NON SOURCÉ).
- Quelqu'un dans la maison, à portée de voix, de préférence.

**Points d'attention (kine)**
- Épaule et dos : surface instable sous les avant-bras ; dès la gêne légère, genoux au sol ; dès la gêne nette, retiré. Genou : tapis épais dès la gêne légère, retiré dès la gêne nette (NON SOURCÉ).
- Niveau intermédiaire : même niveau que la planche sur ballon de gym ; le débutant fait la planche sur les genoux au sol.
- Grossesse et post-partum : retiré (isométrique prolongé, ventre sur surface instable) ; en post-partum, fuite d'urine ou pesanteur dans le bas-ventre : arrêt et avis de la sage-femme (G7).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) à l'épaule, au coude, au cou ou au bas du dos.
- Bas du dos qui se creuse ou épaules qui s'affaissent : arrête.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe : arrête.

**Objets du quotidien**
- Bosu : bien gonflé (ni mou ni trop dur), surface sèche et propre (pieds et sol), sans fissure ni fuite d'air ; placé sur un sol plat, sec et non glissant, calé contre un mur plein ou un meuble lourd (NON SOURCÉ).
- Mur plein derrière le bosu (pas à portée de main : tu ne te retiens pas à lui) ; chaussures fermées à semelle qui accroche (pas de pieds nus : la cheville est la zone la plus exposée) ; espace libre autour de toi (NON SOURCÉ).

## Photo
- aucune photo
- illustration : public/illustrations/planche-bosu.svg : affichable : oui (illustration originale de l'app)
- légende : Avant-bras sur le dôme, bosu calé contre un mur : d'abord genoux au tapis, puis pointes de pieds.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, consignes de départ) | free-exercise-db : aucune entrée de planche sur bosu (dist/exercises.json, vérifié le 2026-10-24) ; geste décrit par coach d'après la pratique courante ; voir planche et planche-ballon du dépôt | pratique (pas une étude) | 2026-10-24 | NON SOURCÉ |
| Instabilité (bosu) : à ne pas rechercher pour elle-même ; les exercices au sol et les charges libres restent la base ; l'instabilité peut avoir sa place en rééducation, dans un programme périodisé ou comme variété pour la population générale | Behm et coll., prise de position CSEP, Appl Physiol Nutr Metab 2010;35(1):109-112 (texte complet non lu) et revue Appl Physiol Nutr Metab 2010;35(1):91-108 (résumé lu dans les lots précédents) : le sol et les charges libres restent la base ; l'instabilité peut servir en rééducation, dans un programme périodisé ou comme variété pour la population générale | prise de position (texte complet non lu) et revue (résumé) | 2026-10-24 | PROVISOIRE (résumés seulement) |
| Le BOSU n'a pas augmenté l'activité musculaire mesurée chez 16 personnes très entraînées ; le rôle « équilibre et contrôle » donné au bosu dans cette fiche est un choix de coach (NON SOURCÉ : l'étude ne mesure ni l'équilibre ni le contrôle) | Wahl et Behm, « Not all instability training devices enhance muscle activation in highly resistance-trained individuals », J Strength Cond Res 2008;22(4):1360-1370, PMID 18545166 : 16 personnes très entraînées ; Dyna Disc et BOSU sans différence significative d'activité musculaire (seule exception : les érecteurs du rachis debout sur Dyna Disc, pas sur BOSU) ; ballon de gym et plateau d'équilibre : plus d'activité surtout debout (accroupi : seulement abdominaux bas et soléaire) ; aucune mesure d'équilibre ni de contrôle ; résumé Europe PMC lu | étude de laboratoire, 16 personnes très entraînées, EMG : public différent du public de l'app | 2026-10-24 | PROVISOIRE (résumé seulement) pour l'activité musculaire ; NON SOURCÉ pour le rôle équilibre/contrôle |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Bosu (gonflage, état), mur, tapis, sol | pratique de salle et raisonnement de coach ; aucune notice de fabricant lue | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; référence du dépôt, non rouverte pour ce lot. L'interdiction de l'échec seul est une règle de sécurité de coach | revue de revues ACSM (OK) ; la règle de sécurité n'est pas une conclusion de l'étude | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; NON SOURCÉ pour la règle de sécurité |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 2026-10-25, à contrôler par relecteur) |
| Grossesse et post-partum : bosu retiré (instabilité, risque de chute) ; remplacé par le bird-dog à maintien court | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe (éviter isométrique prolongé, Valsalva, chute, couché sur le dos) : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach) |
