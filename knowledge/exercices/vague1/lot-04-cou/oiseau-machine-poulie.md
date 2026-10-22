---
id: oiseau-machine-poulie
nom: Oiseau à la machine ou aux poulies
schema: tirage_h
type: force
niveau_min: debutant
muscles_principaux: [deltoides_posterieurs]
muscles_secondaires: [rhomboides, trapezes]
source_brouillon: []
statut: controle_relecteur
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| oiseau-machine | À la machine « pec deck inversé » | 1 | debutant | machine | Assis face au dossier de la machine, poignées réglées vers l'arrière, hauteur du siège pour que les poignées soient à hauteur d'épaules. |
| oiseau-poulies-croisees | Aux poulies, bras croisés | 2 | debutant | poulie | Deux poulies hautes ; debout au milieu, tu prends la poignée gauche de la main droite et la poignée droite de la main gauche, bras croisés devant toi. |

## Consignes
1. Règle le siège et les poignées (machine) ; saisis les poignées, mains face à face, bras presque tendus.
2. Écarte les bras sur les côtés et vers l'arrière en gardant les coudes à peine pliés ; tout se passe aux épaules.
3. Marque un court instant bras ouverts, omoplates rapprochées.
4. Reviens lentement jusqu'à la position de départ, sans laisser la charge retomber.

## Points d'attention
- Charge légère au départ.
- Poitrine contre le coussin du dossier (machine) ou buste droit (poulies).
- Épaules basses.
- Aucune durée, série, répétition ni intensité chiffrée (aucune valeur sourcée) : voir program-logic.md et load-calibration.md.

## Erreurs fréquentes
- Prendre une charge trop lourde et tirer avec le dos.
- Plier les coudes pour faire un rowing.
- Lever les épaules vers les oreilles.
- Laisser la charge retomber en fin de série.

## Progression / régression
- plus-facile : aucun
- plus-dur : aucun

## Repères de dosage
Voir program-logic.md et load-calibration.md. Aucune valeur propre à ce mouvement.

## Sécurité et contre-indications
Complété par `kine` le 2026-10-22 (version de prudence de `coach` reprise zone par zone). Les cases du tableau sont des règles de prudence : aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice (NON SOURCÉ, voir Sources). Règles communes R1 à R10, grossesse (G), signes d'alerte (S, U) : knowledge/regles-securite-communes.md ; zone cou : même fichier, §9. Rien ici n'est un diagnostic : l'app parle seulement de zone, de niveau de gêne et de « consulte ».

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | adapter: amplitude:reduite | adapter: amplitude:reduite | retirer |
| Cou | garder | adapter: amplitude:tete-alignee | retirer |
| Coude | garder | adapter: charge:legere | retirer |
| Poignet | garder | adapter: charge:legere | retirer |

**Notes**
- epaule-n1 : amplitude réduite, bras un peu plus bas.
- epaule-n2 : même case ; aucune augmentation (R2).
- coude-n2 : charge la plus légère, jamais augmentée.
- grossesse : assis ou debout, jamais en appui sur le ventre : variante aux poulies (G4, extrapolation prudente) ; la machine peut appuyer sur le ventre.
- general : équipement de salle seulement. Version plus douce : oiseau-machine.

**Grossesse** : adapter: variante:oiseau-poulies-croisees
**Version plus douce** : oiseau-machine

**Signes qui doivent faire arrêter**
- **Urgence, appelle le 15 ou le 112** : visage qui tombe d'un côté, faiblesse ou engourdissement brutal d'un bras ou d'une jambe, difficulté soudaine à parler ou à comprendre, perte de la vue d'un œil ou vision double, vertige brutal et intense accompagné d'un de ces signes, ou mal de tête brutal, très intense et inhabituel : arrête tout et appelle, même si cela passe vite (U1 ; signes d'AVC lus sur des pages d'information grand public : PROVISOIRE).
- Fourmillements, engourdissement ou « décharge » dans le bras ou la main, ou faiblesse du bras ou de la main (objets qui tombent) : arrête, ne refais pas ces exercices et consulte un professionnel de santé, même si cela passe (S2 ; HAS 2020 : déficit moteur avec ou sans douleur irradiante dans le bras = signe d'alerte, OK ; fourmillements seuls : PROVISOIRE).
- Maux de tête inhabituels, douleur de cou inhabituelle qui persiste (surtout avec une douleur du visage), ou vertige même léger pendant ou après l'exercice : arrête et ne reprends pas ces exercices avant l'avis d'un professionnel de santé (HAS 2020, signes à rechercher pour une atteinte d'une artère du cou : OK pour maux de tête et douleur de cou inhabituels ; vertige léger isolé : NON SOURCÉ, prudence).
- Douleur ou raideur du cou apparue après un choc, une chute, un accident de la route, un coup du lapin ou un geste violent du cou : ne fais pas ces exercices avant l'avis d'un professionnel de santé (S2 ; la HAS 2020 cite un effort violent du cou dans les 15 jours comme élément à rechercher ; la règle d'exclusion de l'app : NON SOURCÉ, prudence).
- Douleur de cou qui s'aggrave, est présente en continu ou réveille la nuit, fièvre ou amaigrissement sans raison : consulte un professionnel de santé (HAS 2020 : OK).
- Douleur à l'épaule (pas la brûlure du muscle) ; machine qui coince ou câble qui accroche : arrête.
- Douleur (pas la simple brûlure du muscle qui travaille) : arrête l'exercice, ne force pas, reprends plus doucement la fois suivante.
- Douleur qui dure, qui s'aggrave ou qui réveille la nuit, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2) ; ces signes n'ont pas à être « diagnostiqués » par toi.
- Si le réglage « enceinte / post-partum » est coché : saignement, perte de liquide, contractions, vertige, douleur ou gonflement d'un mollet, fuite d'urine ou pesanteur dans le bas-ventre : arrête et contacte ta sage-femme ou ton médecin (G6, G7) ; en cas de saignement, de perte des eaux ou de contractions régulières : urgence, voir U1.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Machine : réglages bloqués, goupille de charge bien enfoncée, contrôle visuel avant usage (R8, NON SOURCÉ).
- Si l'objet bouge, glisse ou grince : arrêt, et l'objet n'est plus utilisé (R8).

## Photo
- `Reverse_Machine_Flyes/0.jpg` : affichable : oui (vue le 22/10/2026 ; fichier public/photos/free-exercise-db/Reverse_Machine_Flyes-0.webp ; recadré pour retirer le logo de la machine)
- `Reverse_Machine_Flyes/1.jpg` : affichable : oui (vue le 22/10/2026 ; fichier public/photos/free-exercise-db/Reverse_Machine_Flyes-1.webp ; recadré)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Poignets vers l'arrière, mains face à face, bras presque tendus, mouvement semi-circulaire aux épaules, pause, retour lent | free-exercise-db (domaine public) https://github.com/yuhonas/free-exercise-db, entrée « Reverse_Machine_Flyes » (niveau beginner) ; lu le 2026-10-22 | base d'exercices (pratique, pas une étude) | 2026-10-22 | PROVISOIRE |
| Version aux poulies hautes, bras croisés | free-exercise-db, entrée « Cable_Rear_Delt_Fly » (niveau beginner) ; lu le 2026-10-22 | base d'exercices (pratique, pas une étude) | 2026-10-22 | PROVISOIRE (photos non vues : aucune image affichée pour cette variante) |
| Chez 10 sujets sains, l'abduction horizontale couché sur le ventre (bras à 100 degrés, rotation externe complète) donne la plus forte activité du deltoïde postérieur ; la rotation externe couché sur le côté la plus forte pour l'infra-épineux et le petit rond | Reinold et al., « Electromyographic analysis of the rotator cuff and deltoid musculature during common shoulder external rotation exercises », J Orthop Sports Phys Ther 2004;34(7):385-394, https://pubmed.ncbi.nlm.nih.gov/15296366/ ; **résumé lu via moteur de recherche (PubMed bloqué), texte complet non lu** | étude de laboratoire (électromyographie intramusculaire), 10 adultes sains ; ne mesure ni le tirage au visage ni l'oiseau | 2026-10-22 | PROVISOIRE (résumé seulement ; sert seulement à situer le deltoïde postérieur) |
| Signes d'alerte du cou : déficit moteur avec ou sans douleur irradiante dans le bras, atteinte de la moelle, douleur qui s'aggrave et réveille la nuit, fièvre, perte de poids ; maux de tête et douleur de cou inhabituels, douleur du visage, effort violent du cou dans les 15 jours, signes d'ischémie (vision, parole) = éléments évoquant une atteinte d'une artère du cou | HAS, « Pertinence de l'imagerie cervicale - Cervicalgie non traumatique chez l'adulte », validée par le Collège le 19/11/2020, https://www.has-sante.fr/upload/docs/application/pdf/2020-11/app_356_fiche_pertinence_imagerie_cervicalgie_non_trauma_mel.pdf ; tableau 1 et encadré lus dans le texte extrait du PDF (22/10/2026) | recommandation officielle ; la HAS précise que ces drapeaux reposent sur l'avis d'experts et sur ceux de la lombalgie ; adultes, cervicalgie non traumatique ; conçue pour des prescripteurs d'imagerie, pas pour une app | 2026-10-22 | OK pour la liste des signes ; leur usage comme message « arrête / consulte » dans une app de sport : PROVISOIRE |
| Visage qui tombe, faiblesse d'un membre, trouble de la parole, perte de vue d'un œil ou vision double, mal de tête brutal inhabituel : appeler le 15 ou le 112, même si cela passe | pages d'information grand public sur l'AVC (mémo VITE) lues via un moteur de recherche le 2026-10-22 ; aucune page officielle (HAS, ameli) ouverte : à remplacer par une source officielle | information grand public, pas une étude | 2026-10-22 | PROVISOIRE |
| Échelons, niveaux, muscles et répartition principaux / secondaires | choix de coach (décision de format de l'utilisateur, 21/10/2026) ; les muscles du cou ne figurent pas dans la liste de format-fiches.md : « trapezes » et « erecteurs_rachis » sont utilisés par défaut (question 1 du README) | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-22 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | reprise par `kine` (22/10/2026) de la proposition de `coach` ; extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-22 | NON SOURCÉ (choix prudents, à contrôler par `relecteur`) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-22 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation, à valider par `kine`) |
