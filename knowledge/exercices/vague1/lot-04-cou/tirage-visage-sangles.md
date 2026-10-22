---
id: tirage-visage-sangles
nom: Tirage au visage aux sangles de suspension
schema: tirage_h
type: force
niveau_min: intermediaire
muscles_principaux: [deltoides_posterieurs, rhomboides]
muscles_secondaires: [trapezes, coiffe_des_rotateurs]
source_brouillon: []
statut: controle_relecteur
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| tirage-visage-sangles-debout | Corps peu incliné | 1 | intermediaire | sangles_suspension | Sangles accrochées en hauteur à un point d'ancrage solide ; debout face à l'ancrage, corps incliné en arrière juste assez pour que les sangles soient tendues. |
| tirage-visage-sangles-incline | Corps plus incliné | 2 | intermediaire | sangles_suspension | Même installation, pieds plus proches de l'ancrage : le corps est plus incliné en arrière et le tirage plus dur. |

## Consignes
1. Vérifie l'ancrage avant de te suspendre (voir plus bas), tiens les poignées bras tendus devant toi, corps droit comme une planche, incliné en arrière.
2. Tire les mains vers ton visage en écartant les coudes sur les côtés, en rapprochant les omoplates.
3. Garde le corps aligné (ni ventre qui descend ni fesses en arrière).
4. Reviens lentement bras tendus.

## Points d'attention
- Plus tu avances les pieds vers l'ancrage, plus c'est dur : progresse par petites étapes.
- Pieds bien posés, chaussures aux pieds, sol non glissant.
- Le cou reste dans l'axe.
- Aucune durée, série, répétition ni intensité chiffrée (aucune valeur sourcée) : voir program-logic.md et load-calibration.md.

## Erreurs fréquentes
- Cambrer le dos ou laisser le bassin descendre.
- Hausser les épaules.
- Ne pas contrôler le retour (lâcher d'un coup).
- Ancrage non vérifié.

## Progression / régression
- plus-facile : face-pull-elastique
- plus-dur : aucun

## Repères de dosage
Voir program-logic.md et load-calibration.md. Aucune valeur propre à ce mouvement.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-22 en **prudence minimale, À COMPLÉTER PAR KINE** (la section est au format strict de format-fiches.md pour que le validateur passe ; elle n'a pas encore été vue par `kine`). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | adapter: variante:tirage-visage-sangles-debout | retirer | retirer |
| Cou | adapter: amplitude:tete-alignee | adapter: amplitude:tete-alignee | retirer |
| Coude | garder | adapter: variante:tirage-visage-sangles-debout | retirer |
| Poignet | garder | adapter: variante:tirage-visage-sangles-debout | retirer |
| Dos | garder | adapter: variante:tirage-visage-sangles-debout | retirer |

**Notes**
- epaule-n1 : variante la plus facile (corps peu incliné).
- dos-n2 : variante la plus facile ; aucune augmentation (R2).
- grossesse : variante la plus facile ; corps peu incliné, pas de station prolongée (G4, extrapolation prudente).
- general : niveau intermédiaire par prudence (suspension, ancrage), NON SOURCÉ ; accès par le tag sangles_suspension. Version plus douce : tirage-visage-sangles-debout.

**Grossesse** : adapter: variante:tirage-visage-sangles-debout
**Version plus douce** : tirage-visage-sangles-debout

**Signes qui doivent faire arrêter**
- Craquement, glissement ou mouvement de l'ancrage : lâche calmement et pose les pieds (R8).
- Douleur à l'épaule, au coude ou au poignet.
- Douleur (pas la simple brûlure du muscle qui travaille) : arrête l'exercice, ne force pas, reprends plus doucement la fois suivante.
- Douleur qui dure, qui s'aggrave ou qui réveille la nuit, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2) ; ces signes n'ont pas à être « diagnostiqués » par toi.
- Si le réglage « enceinte / post-partum » est coché : saignement, perte de liquide, contractions, vertige, douleur ou gonflement d'un mollet, fuite d'urine ou pesanteur dans le bas-ventre : arrête et contacte ta sage-femme ou ton médecin (G6, G7) ; en cas de saignement, de perte des eaux ou de contractions régulières : urgence, voir U1.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

**Objets du quotidien**
- Ancrage : point solide testé en tirant de tout ton poids avant chaque séance, selon la notice du fabricant (R8, NON SOURCÉ) ; porte d'ancrage : voir regles-securite-communes.md §7.
- Si l'objet bouge, glisse ou grince : arrêt, et l'objet n'est plus utilisé (R8).

## Photo
- aucune photo libre pour cet exercice (« Inverted_Row_with_Straps » est un rowing, non retenu ; 22/10/2026)
- illustration : public/illustrations/tirage-visage-sangles.svg : affichable : oui (illustration originale de l'app ; sangles dessinées comme un trait)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Tirage vers le visage, coudes écartés, aux sangles de suspension | description de coach ; aucune entrée free-exercise-db correspondante (« Inverted_Row_with_Straps » = rowing, autre mouvement ; recherche par nom, 2026-10-22) | - | - | NON SOURCÉ |
| Chez 10 sujets sains, l'abduction horizontale couché sur le ventre (bras à 100 degrés, rotation externe complète) donne la plus forte activité du deltoïde postérieur ; la rotation externe couché sur le côté la plus forte pour l'infra-épineux et le petit rond | Reinold et al., « Electromyographic analysis of the rotator cuff and deltoid musculature during common shoulder external rotation exercises », J Orthop Sports Phys Ther 2004;34(7):385-394, https://pubmed.ncbi.nlm.nih.gov/15296366/ ; **résumé lu via moteur de recherche (PubMed bloqué), texte complet non lu** | étude de laboratoire (électromyographie intramusculaire), 10 adultes sains ; ne mesure ni le tirage au visage ni l'oiseau | 2026-10-22 | PROVISOIRE (résumé seulement ; sert seulement à situer le deltoïde postérieur) |
| Échelons, niveaux, muscles et répartition principaux / secondaires | choix de coach (décision de format de l'utilisateur, 21/10/2026) ; les muscles du cou ne figurent pas dans la liste de format-fiches.md : « trapezes » et « erecteurs_rachis » sont utilisés par défaut (question 1 du README) | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-22 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | proposition de `coach` (prudence minimale, extrapolation des règles communes), À COMPLÉTER PAR KINE ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-22 | NON SOURCÉ (extrapolation, à valider par `kine`) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-22 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation, à valider par `kine`) |
