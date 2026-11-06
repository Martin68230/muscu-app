# Zones musculaires, seuils de points par zone, plafonds, zones douloureuses

Rédigé par `coach` le 06/11/2026 (Niveau 2, étape 1). Base de la carte des muscles et du calcul de points par zone. Table de correspondance : `knowledge/zones-correspondance.json`. Aucune fiche n'est modifiée par cette étape. Statuts par valeur : OK / PROVISOIRE / NON SOURCÉ.

## 0. Sources (ce qui a réellement été lu)

| Réf | Source | Lu ? | Niveau de preuve | Public | Sert à | Statut |
|---|---|---|---|---|---|---|
| Z1 | ACSM, Currier et coll., position stand 2026 (revue de revues, 137 revues), Med Sci Sports Exerc 58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823 | texte lu par `coach` le 23/10 (voir generateur-v1.md SRC1), non relu aujourd'hui | revue de revues | adultes sains | volume hebdomadaire par muscle >= 10 séries, tous les grands groupes >= 2 fois par semaine | OK |
| Z2 | Schoenfeld, Ogborn, Krieger, J Sports Sci 2017, méta-analyse de 15 études (dose-réponse du volume) | citée dans program-logic.md §3, non relue aujourd'hui | méta-analyse | adultes | 10 séries et plus par semaine : gain croissant | OK |
| Z3 | Remmert et coll., SportRxiv 2025, https://sportrxiv.org/index.php/server/preprint/view/537 | non relue aujourd'hui | méta-régression, préprint | adultes | plafond par séance ~10-11 séries | PROVISOIRE |
| Z4 | Maeo et coll., « Triceps brachii hypertrophy is substantially greater after elbow extension training performed in the overhead versus neutral arm position », Eur J Sport Sci 2023;23(7):1240-1250, DOI 10.1080/17461391.2022.2100279, https://pubmed.ncbi.nlm.nih.gov/35819335/ | résumé PubMed lu le 06/11 (pas le texte intégral) | essai contrôlé intra-sujet, petit échantillon | jeunes adultes | long chef du triceps : travail bras au-dessus de la tête (extension au-dessus de la tête) plus efficace ; l'avantage touche aussi les chefs mono-articulaires (pas un effet « long chef seul ») | PROVISOIRE |
| Z5 | NSCA Personal Trainer's Quarterly, « Building a Balanced and Symmetrical Physique - Is Regional Hypertrophy Possible? », https://www.nsca.com/education/articles/ptq/building-a-balanced-and-symmetrical-physique | résumé lu via recherche le 06/11 | article de revue narrative | pratique | croissance non uniforme dans un muscle (par ex. droit fémoral proximal / médian / distal) ; données petites et hétérogènes ; pectoraux et ischio-jambiers : données insuffisantes | PROVISOIRE |
| Z6 | Revue systématique et méta-analyse 2024 sur le travail à longueur musculaire longue et l'hypertrophie régionale (notice https://lida.sport-iat.de/ta/Record/4036058 et voisines, recherche du 06/11) | résumé seulement | méta-analyse | adultes | la longueur musculaire de travail ne donne pas d'avantage régional net ; petits échantillons | PROVISOIRE |
| Z7 | Études EMG sur les parties du grand pectoral (haut / bas), des trapèzes (haut / moyen / bas), du grand fessier et du moyen fessier, du droit fémoral | NON lues | EMG (activation, pas croissance) | variable | existence de sous-zones | NON SOURCÉ (à sourcer par `coach` avant de retirer « indicatif ») |

Conclusion de preuve : le **muscle entier** est sourcé (Z1, Z2). Les **sous-zones** reposent sur de l'EMG et sur quelques études de croissance régionale petites : elles sont toutes marquées **indicatif**. Le seul cas un peu mieux étayé est le long chef du triceps (Z4, PROVISOIRE).

## 1. Liste des zones (33)

Colonnes : `id` stable ; nom français ; groupe ; sous-zone (la zone est une partie d'un muscle) ; indicatif (sous-zone discutée scientifiquement, voir Z5 à Z7) ; vue de la carte ; classe de seuil (G = grande zone, P = petite zone, voir §2).

| # | id | Nom affiché | Groupe | Sous-zone | Indicatif | Vue | Seuil |
|---|---|---|---|---|---|---|---|
| 1 | pectoraux_haut | Pectoraux (haut) | haut | oui | oui | face | G |
| 2 | pectoraux_milieu_bas | Pectoraux (milieu et bas) | haut | oui | oui | face | G |
| 3 | epaules_avant | Épaules (avant) | haut | non | non | face | G |
| 4 | epaules_cote | Épaules (côté) | haut | non | non | face et dos | G |
| 5 | epaules_arriere | Épaules (arrière) | haut | non | non | dos | G |
| 6 | coiffe_rotateurs | Coiffe des rotateurs | haut | non | non | dos | P |
| 7 | dentele_anterieur | Dentelé antérieur | haut | non | non | face | P |
| 8 | grand_dorsal | Grand dorsal | haut | non | non | dos | G |
| 9 | trapezes_haut | Trapèzes (haut) | haut | oui | oui | dos | G |
| 10 | trapezes_moyen | Haut du dos : trapèzes moyens et rhomboïdes | haut | oui | oui | dos | G |
| 11 | trapezes_bas | Trapèzes (bas) | haut | oui | oui | dos | G |
| 12 | cou | Cou | haut | non | non | face et dos | P |
| 13 | biceps | Biceps | haut | non | non | face | G |
| 14 | triceps_long_chef | Triceps (long chef) | haut | oui | oui | dos | G |
| 15 | triceps_lateral_medial | Triceps (chefs latéral et médial) | haut | oui | oui | dos | G |
| 16 | avant_bras | Avant-bras | haut | non | non | face et dos | P |
| 17 | abdominaux_droits | Abdominaux (grand droit) | tronc | non | non | face | G |
| 18 | obliques | Obliques | tronc | non | non | face | G |
| 19 | transverse | Abdominaux profonds (transverse) | tronc | non | non | face | P |
| 20 | lombaires | Lombaires (érecteurs du rachis) | tronc | non | non | dos | G |
| 21 | carre_des_lombes | Carré des lombes | tronc | non | non | dos | P |
| 22 | fessiers_grand | Fessiers (grand fessier) | bas | oui | oui | dos | G |
| 23 | fessiers_moyen | Fessiers (moyen fessier) | bas | oui | oui | dos | G |
| 24 | abducteurs | Abducteurs (côté de la hanche) | bas | non | non | face et dos | P |
| 25 | adducteurs | Adducteurs (intérieur des cuisses) | bas | non | non | face | G |
| 26 | flechisseurs_hanche | Fléchisseurs de hanche | bas | non | non | face | P |
| 27 | quadriceps_vastes | Quadriceps (vastes) | bas | oui | oui | face | G |
| 28 | quadriceps_droit_femoral | Quadriceps (droit fémoral) | bas | oui | oui | face | G |
| 29 | ischios | Ischio-jambiers | bas | non | non | dos | G |
| 30 | mollets_gastrocnemien | Mollets (jumeaux) | bas | oui | oui | dos | P |
| 31 | mollets_soleaire | Mollets (soléaire) | bas | oui | oui | dos | P |
| 32 | tibiaux | Tibiaux (devant du tibia) | bas | non | non | face | P |
| 33 | peroniers | Péroniers (côté de la jambe) | bas | non | non | face et dos | P |

Notes :
- Deltoïdes avant / côté / arrière : trois faisceaux anatomiquement distincts, donc zones, pas des sous-zones indicatives.
- Biceps : un seul bloc. Brachial et brachio-radial ne figurent pas dans la liste des muscles de `format-fiches.md` : le brachial compte avec le biceps, le brachio-radial avec l'avant-bras (curl marteau). Long / court chef du biceps non séparés (aucune source lue).
- Abdominaux droits : pas de découpage haut / bas (débattu, EMG seulement, aucune source lue) ; à rediscuter si l'utilisateur le veut.
- Ischio-jambiers : un seul bloc (données sur le long chef du biceps fémoral et les ischios internes non lues).
- `cou` : aucun muscle « cou » dans la liste des muscles des fiches (les fiches de cou notent des trapèzes en secondaire) ; la zone se remplit par règle d'id (voir JSON). Proposition au `dev` : ajouter `cou` à la liste des muscles de `format-fiches.md` et à `tools/validate`.
- `abducteurs` : ne reçoit que les exercices du schéma `hanche_laterale` et quelques ids listés ; le moyen fessier reste sur `fessiers_moyen` (pas de double comptage automatique par muscle).
- Mobilité / récupération et cardio : 0 point (ce ne sont pas des séries de travail de force). Décision proposée, à confirmer.

## 2. Seuils de points hebdomadaires par zone

Règle de l'utilisateur (reprise telle quelle) : on compte les **séries de travail**, échauffement exclu ; zone **principale = 1 point**, **secondaire = 0,5 point** par série (méthode fractionnaire, déjà dans `VOLUME.secondaryWeight`, Z3 pour la méthode : PROVISOIRE). Un coefficient de zone (JSON) peut réduire la part d'une sous-zone (voir §4).

| Classe | Gris | Orange | Rouge, objectif par défaut (santé, perte de gras, cardio) | Rouge, prise de muscle | Rouge, force |
|---|---|---|---|---|---|
| G, grandes zones | moins de 3 | de 3 à 5,9 | à partir de 6 | à partir de 10 | à partir de 4 |
| P, petites zones (avant-bras, mollets, abdominaux profonds, cou, coiffe, dentelé, carré des lombes, abducteurs, fléchisseurs de hanche, tibiaux, péroniers) | moins de 1,5 | de 1,5 à 2,9 | à partir de 3 | à partir de 5 | à partir de 2 |

Pour la force et la prise de muscle, l'orange va de la borne grise jusqu'à la borne rouge exclue (ex. force, grande zone : orange de 3 à 3,9).

Statuts :
- 10 points pour la prise de muscle : **OK** (Z1, Z2 : au moins 10 séries dures par muscle et par semaine).
- 4 pour la force : **NON SOURCÉ** comme seuil de couleur (Z1 parle de 2-3 séries par exercice pour la force, sans total hebdomadaire ; choix de l'utilisateur).
- 6 par défaut, 3 pour le gris : **NON SOURCÉ** (choix de l'utilisateur, repères d'affichage, pas des cibles médicales).
- Seuils des petites zones : **NON SOURCÉ** (proposition de `coach` : moitié des grandes zones, en suivant la consigne « seuils plus bas pour avant-bras, mollets, abdominaux profonds » ; ces muscles reçoivent déjà du travail indirect). Z1 ne donne pas de valeur par petit muscle.
- Sous-zones indicatives : **mêmes seuils que la zone mère, pas de seuil plus exigeant** (l'utilisateur augmente lui-même charges et répétitions). Conséquence à connaître : avec les coefficients par défaut, `pectoraux_haut` monte plus lentement que `pectoraux_milieu_bas` ; la carte peut afficher le haut en orange alors que le milieu est rouge. Option à trancher par l'utilisateur : colorer la carte au niveau du muscle entier (maximum des sous-zones) et n'afficher le détail qu'au toucher.
- La carte ne dit pas « il faut atteindre ces points » : c'est un repère d'équilibre. Aucun avis médical.

## 3. Plafonds par zone

Repris de `src/generator/config.ts`, objet `VOLUME` (V-PLAF, `generateur-v1.md` §V-PLAF) :

| Plafond | Valeur | Statut | Origine |
|---|---|---|---|
| Hebdomadaire, par muscle | 20 points | seuil OK (Z1/Z2 : fourchette courante 12-20), usage comme plafond NON SOURCÉ | `maxPerMuscleWeek` |
| Par séance, par muscle (débutant, santé, grossesse, zone gênée, reprise) | 10 | PROVISOIRE (Z3, préprint) | `maxPerMuscleSession` |
| Par séance, intermédiaire et avancé | 12 par emplacement prévu, 11 pour les ajouts automatiques | NON SOURCÉ au-dessus de ~11 (avis `kine` K-01) | `maxPerMuscleSessionSlots`, `maxPerMuscleSessionAuto` |
| Core, par séance / par semaine | 6 / 12 séries | NON SOURCÉ | `core-et-supersets.md` CORE-DOSE-3 |

Application aux zones (proposition, NON SOURCÉ) :
- Grandes zones : 20 par semaine, 10 / 11 / 12 par séance, comme ci-dessus.
- Petites zones : plafond hebdomadaire **10**, par séance **6** (moitié des grandes zones ; aucun plafond par petit muscle n'existe aujourd'hui dans `config.ts`).
- Sous-zones : le plafond s'applique au **muscle mère** (pectoraux, trapèzes, triceps, fessiers, quadriceps, mollets), calculé avec le maximum des points de ses sous-zones, jamais leur somme, pour ne pas doubler un plafond de sécurité. Les muscles suivis par `VOLUME.muscles` (quadriceps, fessiers, ischios, pectoraux, grand dorsal) et `deltoidPrefix` restent calculés tels quels par le générateur ; les zones ne changent pas le générateur (étape suivante, décision de `dev`).

## 4. Sous-zones qui dépendent de l'exercice

Explicitées sous forme de règles dans le JSON (`regles_sous_zones`), par motif d'id de fiche ou schéma, avec liste explicite d'ids pour les cas ambigus. Principes (tous indicatif, NON SOURCÉ sauf triceps long chef PROVISOIRE via Z4) :
- Pectoraux : développé incliné, pompe pieds surélevés, pompe piquée = haut ; dips, développé décliné = milieu et bas ; sinon coefficient 1 sur milieu et bas, 0,5 sur haut.
- Trapèzes : haussement d'épaules, portés = haut ; rowing, oiseau, tirage au visage, écartement, rétraction = moyen ; traction et tirage vertical = bas (1) et moyen (0,5) ; développé d'épaules = haut en secondaire.
- Épaules arrière : oiseau, tirage au visage, écartement, rowing = `epaules_arriere` (déjà le muscle `deltoides_posterieurs`).
- Triceps : extension au-dessus de la tête ou allongé = long chef 1 ; développés et pompes = chefs latéral et médial 1, long chef 0,5 (Z4).
- Quadriceps : squat, fente, montée = vastes 1 et droit fémoral 0,5 ; montées de genoux, mountain climbers, sauts = droit fémoral 1 et vastes 0,5.
- Mollets : debout, sauts, corde = jumeaux ; assis = soléaire ; sinon jumeaux 1 et soléaire 0,5.
- Abdos : `abdominaux` = grand droit, `obliques` = obliques, `transverse` = transverse ; les exercices d'anti-rotation et de gainage latéral ajoutent des points aux obliques (règle d'id).

## 5. Zones douloureuses (liaison avec `src/data/injury-rules.ts` et `InjuryZone`)

`InjuryZone` (src/data/model.ts) : cou, epaule, coude, poignet, dos, hanche, genou, cheville, cuisse, aine. Liaison proposée, **pour l'affichage uniquement** (colorer une zone « sensible » sur la carte, avertir que son compteur de points n'est pas à pousser). Elle ne remplace jamais le tableau zone x niveau de la fiche ni les règles C1 à C5 : pour la sécurité, rien ne change. À valider par `kine` (NON SOURCÉ).

| Zone de blessure | Zones de la carte concernées |
|---|---|
| cou | cou, trapezes_haut |
| epaule | epaules_avant, epaules_cote, epaules_arriere, coiffe_rotateurs, dentele_anterieur, pectoraux_haut, pectoraux_milieu_bas, trapezes_haut, trapezes_moyen, trapezes_bas, grand_dorsal |
| coude | biceps, triceps_long_chef, triceps_lateral_medial, avant_bras |
| poignet | avant_bras |
| dos | lombaires, carre_des_lombes, grand_dorsal, trapezes_moyen, trapezes_bas, abdominaux_droits, obliques, transverse |
| hanche | fessiers_grand, fessiers_moyen, abducteurs, adducteurs, flechisseurs_hanche |
| genou | quadriceps_vastes, quadriceps_droit_femoral, ischios, mollets_gastrocnemien |
| cheville | mollets_gastrocnemien, mollets_soleaire, tibiaux, peroniers |
| cuisse | quadriceps_vastes, quadriceps_droit_femoral, ischios, adducteurs |
| aine | adducteurs, flechisseurs_hanche |

Règles d'usage : une zone douloureuse niveau >= 1 est marquée « sensible » (pas de pastille rouge « objectif atteint », pas de message « il en manque »). Douleur : toute question va à `kine`, pas d'avis médical.

## 6. Fiches à corriger à la main par `coach` (sous-zone qui compte)

Compte fait sur les 208 fiches de `knowledge/exercices` (hors `ecartees/`, mobilité et cardio exclus). Listes complètes dans `knowledge/zones-correspondance.json`, clé `fiches_a_verifier_coach` :

| Famille | Fiches |
|---|---|
| Pectoraux (haut / milieu-bas) | 25 |
| Dos : trapèzes et rhomboïdes (haut / moyen / bas) | 56 |
| Épaules (deltoïde principal, avant / côté / arrière) | 21 |
| Abdos (grand droit / obliques / transverse, principal) | 29 |
| Quadriceps (vastes / droit fémoral) | 45 |

Total des fiches distinctes concernées : 137 (certaines fiches comptent dans plusieurs familles). Hors demande mais notés : triceps 37, mollets 27.
