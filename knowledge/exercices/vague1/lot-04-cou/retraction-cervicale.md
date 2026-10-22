---
id: retraction-cervicale
nom: Rentrer le menton (rétraction cervicale)
schema: mobilite
type: mobilite_recup
niveau_min: debutant
muscles_principaux: [trapezes]
muscles_secondaires: [erecteurs_rachis]
source_brouillon: []
statut: controle_relecteur
doux_pour: [cou]
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| retraction-cervicale-assise | Assis sur une chaise | 1 | debutant | chaise | Assis au bord d'une chaise stable, pieds à plat, dos droit, regard devant. |
| retraction-cervicale-mur | Debout, dos contre le mur | 1 | debutant | mur | Debout, dos et fesses contre un mur, talons à quelques centimètres, regard droit devant. |
| retraction-cervicale-couchee | Couché sur le dos | 2 | debutant | tapis | Allongé sur le dos sur un tapis, genoux pliés, pieds à plat ; la tête pose sur le sol (ou sur une serviette pliée fine si besoin). |

## Consignes
1. Mets-toi en position, regard droit devant, épaules basses.
2. Rentre doucement le menton, comme pour faire un double menton : la tête recule à l'horizontale, sans se baisser ni se lever.
3. Garde le regard à l'horizontale et le cou long ; arrête-toi dès que tu sens une tension nette.
4. Tiens un court instant, puis reviens lentement à la position de départ.

## Points d'attention
- Le mouvement est petit : quelques centimètres seulement.
- Pas de douleur ni de fourmillements ; en cas de doute, arrête (voir plus bas).
- Allongé, la nuque s'allonge vers le sol sans appuyer la tête fort.
- Aucune durée, série, répétition ni intensité chiffrée (aucune valeur sourcée) : voir program-logic.md et load-calibration.md.

## Erreurs fréquentes
- Baisser la tête (regarder le sol) au lieu de la reculer.
- Lever le menton ou serrer la mâchoire.
- Forcer la fin de course avec les mains.
- Hausser les épaules.

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
| Cou | garder | adapter: amplitude:reduite | retirer |

**Notes**
- general : FICHE DOUCE POUR LA ZONE COU (niveaux 1 et 2) : le générateur peut la proposer à une personne dont la zone cou est au niveau 1 ou 2 (marqueur à coder par `dev`, voir README question 2). Jamais proposée au niveau 3.
- cou-n1 : exercice tel quel, petit mouvement.
- cou-n2 : amplitude réduite (recul plus petit) ; la variante couchée est à éviter si la gêne augmente ; aucune augmentation (R2).
- grossesse : variante assise ou au mur ; la variante couchée sur le dos n'est pas proposée (G4, position couchée sur le dos). Post-partum : G7 (sans effet).

**Grossesse** : adapter: variante:retraction-cervicale-assise
**Version plus douce** : retraction-cervicale-assise

**Signes qui doivent faire arrêter**
- **Urgence, appelle le 15 ou le 112** : visage qui tombe d'un côté, faiblesse ou engourdissement brutal d'un bras ou d'une jambe, difficulté soudaine à parler ou à comprendre, perte de la vue d'un œil ou vision double, trouble brutal de l'équilibre ou de la marche, vertige brutal et intense accompagné d'un de ces signes, ou mal de tête brutal, très intense et inhabituel : arrête tout et appelle, même si cela passe vite (U1 ; HAS, page « signes d'alerte » de l'AVC, mise en ligne le 28/10/2025 : OK pour visage, bras ou jambe, parole, équilibre ou marche, perte de la vue d'un œil, mal de tête très fort et soudain ; « vision double » et « vertige brutal avec l'un de ces signes » : NON SOURCÉ, prudence).
- Fourmillements, engourdissement ou « décharge » dans le bras ou la main, ou faiblesse du bras ou de la main (objets qui tombent) : arrête, ne refais pas ces exercices et consulte un professionnel de santé, même si cela passe (S2 ; HAS 2020 : déficit moteur avec ou sans douleur irradiante dans le bras = signe d'alerte, OK ; fourmillements seuls : PROVISOIRE).
- Maux de tête inhabituels (surtout avec une douleur de cou inhabituelle ou persistante, ou une douleur du visage), douleur de cou inhabituelle qui persiste, ou vertige ou étourdissement même léger pendant ou après l'exercice : arrête et ne reprends pas ces exercices avant l'avis d'un professionnel de santé (HAS 2020 : OK pour une cervicalgie inhabituelle et persistante associée à des céphalées inhabituelles ou à une douleur du visage ; maux de tête inhabituels isolés : PROVISOIRE, prudence ; vertige même léger : NON SOURCÉ, choix prudent, même règle que R5).
- Maladresse nouvelle des mains (boutonner, écrire, objets qui échappent) ou troubles de l'équilibre ou de la marche qui s'installent : arrête, ne refais pas ces exercices et consulte un professionnel de santé sans attendre ; si c'est brutal, c'est une urgence (voir plus haut) (HAS 2020 : atteinte médullaire = signe d'alerte, OK ; formulation « mains / équilibre » : PROVISOIRE, résumés IFOMPT, C4).
- Douleur ou raideur du cou apparue après un choc, une chute, un accident de la route, un coup du lapin ou un geste violent du cou : ne fais pas ces exercices avant l'avis d'un professionnel de santé (S2 ; la HAS 2020 cite un effort violent du cou dans les 15 jours comme élément à rechercher ; la règle d'exclusion de l'app : NON SOURCÉ, prudence).
- Douleur de cou qui s'aggrave, est présente en continu ou réveille la nuit, fièvre ou amaigrissement sans raison : consulte un professionnel de santé (HAS 2020 : OK).
- Douleur (pas la simple brûlure du muscle qui travaille) : arrête l'exercice, ne force pas, reprends plus doucement la fois suivante.
- Douleur qui dure, qui s'aggrave ou qui réveille la nuit, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2) ; ces signes n'ont pas à être « diagnostiqués » par toi.
- Si le réglage « enceinte / post-partum » est coché : saignement, perte de liquide, contractions, vertige, douleur ou gonflement d'un mollet, fuite d'urine ou pesanteur dans le bas-ventre : arrête et contacte ta sage-femme ou ton médecin (G6, G7) ; en cas de saignement, de perte des eaux ou de contractions régulières : urgence, voir U1.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Chaise stable, sans roulettes, pieds à plat, sol non glissant ; mur plein sans objet saillant derrière toi (R8).
- Si l'objet bouge, glisse ou grince : arrêt, et l'objet n'est plus utilisé (R8).

## Photo
- aucune photo (aucune entrée free-exercise-db pour la rétraction cervicale ; recherche par nom dans l'index, 22/10/2026)
- illustration : public/illustrations/retraction-cervicale.svg : affichable : oui (illustration originale de l'app ; vue de profil, debout : la variante assise est la même pour la tête)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Rentrer le menton sans baisser la tête (rétraction cervicale), assis, au mur ou couché | description de coach ; aucune entrée free-exercise-db correspondante (recherche par nom, 2026-10-22) | - | - | NON SOURCÉ |
| L'entraînement des muscles profonds de la face avant du cou (flexion cranio-cervicale) modifie l'activation des muscles du cou chez les personnes avec douleur de cou chronique ; la revue étudie les fonctions neuromusculaires et n'évalue pas la douleur | Blomgren et al., BMC Musculoskelet Disord 2018, revue systématique de 12 essais https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6263552/ ; **résumé lu via moteur de recherche, résultats détaillés non lus** ; cet exercice-là (avec capteur de pression, couché) n'est PAS la rétraction cervicale de cette fiche | revue systématique, adultes avec douleur de cou chronique | 2026-10-22 | PROVISOIRE pour le principe général ; que la rétraction debout/assise ait le même effet : NON SOURCÉ |
| Pour une douleur de cou avec raideur, les exercices de mobilité du cou, de renforcement du haut du dos (omoplates et membres supérieurs) et d'endurance cou-épaules sont recommandés (grade B) selon la phase | Blanpied et al., « Neck Pain: Revision 2017 », J Orthop Sports Phys Ther 2017;47(7):A1-A83, DOI 10.2519/jospt.2017.0302 https://www.jospt.org/doi/10.2519/jospt.2017.0302 ; lignes directrices de l'APTA (section orthopédie) ; **texte intégral non lu (accès refusé, 403)** : recommandations lues dans des extraits de moteur de recherche, à relire dans le texte | lignes directrices cliniques, adultes avec douleur de cou ; grade B (accord de revue de la littérature) | 2026-10-22 | PROVISOIRE (extraits seulement ; la fiche est un exercice de prévention, pas un traitement) ; CONTEXTE seulement : ces résultats portent sur le renforcement ; l'étirement ou la mobilité seuls n'ont pas montré de bénéfice (Cochrane 2015) : pas une preuve pour cet exercice |
| Signes d'alerte du cou : déficit moteur avec ou sans douleur irradiante dans le bras, atteinte de la moelle, douleur qui s'aggrave et réveille la nuit, fièvre, perte de poids ; maux de tête et douleur de cou inhabituels, douleur du visage, effort violent du cou dans les 15 jours, signes d'ischémie cérébrale ou rétinienne ; les céphalées et la douleur du visage ne sont citées qu'en association avec une cervicalgie inhabituelle et persistante = éléments évoquant une atteinte d'une artère du cou | HAS, « Pertinence de l'imagerie cervicale - Cervicalgie non traumatique chez l'adulte », validée par le Collège le 19/11/2020, https://www.has-sante.fr/upload/docs/application/pdf/2020-11/app_356_fiche_pertinence_imagerie_cervicalgie_non_trauma_mel.pdf ; tableau 1 et encadré lus dans le texte extrait du PDF (22/10/2026) | recommandation officielle ; la HAS précise que ces drapeaux reposent sur l'avis d'experts et sur ceux de la lombalgie ; adultes, cervicalgie non traumatique ; conçue pour des prescripteurs d'imagerie, pas pour une app | 2026-10-22 | OK pour la liste des signes ; leur usage comme message « arrête / consulte » dans une app de sport : PROVISOIRE |
| Visage qui tombe, faiblesse d'un bras ou d'une jambe, trouble de la parole, trouble de l'équilibre ou de la marche, perte de vue d'un œil, mal de tête très fort et soudain : appeler le 15 ou le 112, même si cela passe | HAS, « Accident vasculaire cérébral : des signes d'alerte à votre retour à domicile », mise en ligne 28/10/2025 (validation 09/2025), https://www.has-sante.fr/jcms/p_3701212/fr/accident-vasculaire-cerebral-des-signes-d-alerte-a-votre-retour-a-domicile ; page lue le 2026-10-22 via un outil de lecture web qui résume la page (texte brut non relu) | page officielle HAS, destinée aux personnes ayant eu un AVC et à leurs proches ; usage comme alerte dans une app de sport : extrapolation ; « vision double » et « vertige brutal avec l'un de ces signes » n'y figurent pas (NON SOURCÉ, prudence) | 2026-10-22 | OK pour les signes listés ; extrapolation d'usage : PROVISOIRE |
| Échelons, niveaux, muscles et répartition principaux / secondaires | choix de coach (décision de format de l'utilisateur, 21/10/2026) ; les muscles du cou ne figurent pas dans la liste de format-fiches.md : « trapezes » et « erecteurs_rachis » sont utilisés par défaut (question 1 du README) | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-22 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | reprise par `kine` (22/10/2026) de la proposition de `coach` ; extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-22 | NON SOURCÉ (choix prudents, à contrôler par `relecteur`) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-22 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation, à valider par `kine`) |
| Chaise : quatre pieds, sans roulettes, non pliante, dossier contre un mur, sol non glissant ; test d'appui avant l'exercice | regles-securite-communes.md §7 (raisonnement mécanique de `kine`) ; aucune source lue | - | 2026-10-22 | NON SOURCÉ |
