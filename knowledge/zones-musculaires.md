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

## 7. Rattrapage sur plusieurs semaines (analyse de `src/zones/catchup.ts`, 13/11/2026, `coach` ; règles proposées NON SOURCÉES, à valider par `kine`)
**Question de l'utilisateur** : « il manque les deltoïdes en semaine 1, on rattrape en semaine 2, mais du coup on travaille moins les quadriceps ; sur 4 semaines, le retard s'accumule-t-il ? »

**7.1 Ce que fait le code** : `zoneCatchUp` calcule les points des zones d'une seule semaine écoulée (séries terminées, sans douleur ; séance manquée = 0). Les zones grises ou orange (hors zones exclues et sans emplacement) reçoivent **+1 série** sur la **première séance** de la semaine suivante (un exercice par zone, jamais deux fois le même, 4 séries au plus) ; en dernier recours **un seul échange** d'exercice. Aucun état stocké : tout est recalculé de l'historique.

**7.2 Propriétés garanties (code actuel)**
- **Pas de dette cumulée** : la semaine W + 2 ne regarde que les séries faites en W + 1 ; ce qui manquait en W n'est pas reporté.
- **Rien n'est retiré par un ajout** : un rattrapage ajoute une série, la séance de base n'est pas raccourcie. Les quadriceps ne baissent pas à cause d'un rattrapage de deltoïdes.
- **Plafonds respectés** : par séance (11 pour les ajouts automatiques, 12 par emplacement), 20 points par muscle et par semaine, plafonds de zone, durée (jamais au-delà de la durée choisie ou de la limite « illimité »), 4 séries par exercice, limites de dose de la fiche.
- **Protections** : aucun ajout pour un débutant, en grossesse / post-partum, en reprise, après un symptôme, en semaine allégée, avec épaule ou dos en niveau 2-3 ; jamais sur une fiche qui touche une zone gênée, une dose fixe, une case de sécurité, un exercice sous gel douleur, une isolation à 2 séries, un superset.
- **L'échange ne baisse la couleur d'aucune zone** surveillée.

**7.3 Propriétés NON garanties**
- **Les quadriceps peuvent baisser, mais seulement par l'échange** (dernier recours, au plus un par semaine) : la garde porte sur la **couleur**, pas sur les points (un muscle en prise de muscle peut passer de 14 à 10 et rester rouge).
- **Zone bloquée** : si la première séance n'a aucun exercice qui travaille la zone (coefficient >= 0,5), si tous les candidats touchent un plafond, ou si la séance remplit déjà la durée choisie, la zone reste grise **sans que l'utilisateur le sache** ; seule la première séance de la semaine est regardée. Cela peut durer 4 semaines.
- **Rattrapage chronique** : un programme qui laisse une zone orange par construction reçoit +1 série **chaque semaine sur la même première séance** (rien ne mémorise la semaine précédente) : cette séance s'allonge sans fin, jusqu'à N séries si N zones sont basses. Ce n'est pas une dette, mais c'est un défaut de répartition que le rattrapage masque.
- **+1 série ne comble pas un manque** : un manque de 4 points devient 1 point, la zone reste basse, +1 de nouveau chaque semaine.
- **Séance manquée** : le code compte la zone à 0 puis ajoute +1 série, ce qui est une petite compensation de volume ; contradiction avec la décision de l'utilisateur (Q30, 0 série ajoutée, seance-manquee-v1.md SM-9).
- **Sport** : le rattrapage ne lit ni `sportGate` ni la charge du sport : il peut ajouter une série de jambes un jour `refuse` / `soften`, ou d'épaule un jour de blocage d'épaule. **Trou de sécurité** à fermer avant l'étape 2 de « Mon sport » (RAT-7).

**7.4 Règles proposées (NON SOURCÉ ; jugement de coach ; chiffres à valider par `kine`)**
| N° | Règle | À coder maintenant ? |
|---|---|---|
| RAT-1 | **Plafond par semaine** : au plus **2 zones** et **+2 séries au total** (un échange compte 1). Ordre : grises avant orange, puis la zone basse depuis le plus de semaines consécutives (pas de famine), puis le moins de points. Durée : au plus +6 min | oui (constante dans config.ts) |
| RAT-2 | **Pas deux semaines de suite sur la même zone avec le même exercice** : si la zone a été rattrapée la semaine précédente, +1 série sur le **même** exercice est refusé ; on prend un autre exercice de la séance ou **l'échange**. Demande un petit journal local `catchUpLog` (semaine, zone, exercice ; 4 semaines au plus ; sert à RAT-2 et RAT-3 seulement, jamais à calculer une quantité ; compris dans export et suppression des données). Sans journal : RAT-1 seul | oui, avec journal (décision `dev` ; à signaler à l'utilisateur car « aucun état stocké » était la règle d'origine) |
| RAT-3 | **Message quand une zone reste grise 2 semaines de suite** (cause fournie par `CatchUpResult.stuck`) : « La zone X est restée basse deux semaines. » Causes, dans cet ordre : **blessure ou protection** (blocage `epaule_dos`, reprise, grossesse, semaine allégée, zone gênée : « je n'ajoute rien pour l'instant »), **plafond** (« ton programme est déjà plein pour cette zone ou pour la durée choisie »), **matériel** (« aucun exercice avec ton matériel ne la travaille dans ta première séance »), **séance manquée** (« une séance n'a pas eu lieu : rien n'est rattrapé, le programme continue tel quel »). Ton sans culpabilité (CONTROLE-progression-bilan-relecteur, point 13), aucun conseil médical | oui (textes + champ `stuck`) |
| RAT-4 | **Q30 appliquée** : une zone basse **à cause d'une séance manquée** (points du programme prévu >= seuil, points faits en dessous) ne reçoit **aucune série** (0), seulement RAT-3. Le rattrapage reste réservé aux zones basses alors que la semaine a été faite comme prévu (défaut de répartition). **Conflit à trancher** : la règle d'origine dit « séances manquées comprises » ; RAT-4 la lit comme « on les voit », pas « on les compense » | non : décision de l'utilisateur d'abord |
| RAT-5 | **Après 4 semaines** basses sur la même zone : proposer de **revoir le programme** (régénération en mettant la zone en avant), jamais de volume automatique | oui (message) |
| RAT-6 | **Garde de l'échange par points** : aucune zone surveillée ne perd de points si elle est sous le seuil rouge ; sinon au plus -1 point et elle reste au seuil rouge ; remplace la seule garde de couleur | oui, `kine` valide (règle de répartition) |
| RAT-7 | **Garde sport** : aucune série en plus sur les jambes (`legs` = `refuse` ou `soften`), sur l'épaule (`shoulder` = `none` ou `light`), ni un jour verrouillé (`dayLocked`) ; lecture de `sportGate` à l'ouverture de la séance | oui, avec S2-E (saisie-sport-v1.md §8.8) ; règle de sécurité : `relecteur` |
| RAT-8 | **Aucun effet sur les semaines suivantes** : un rattrapage ne relève jamais une dose, un plafond (11 / 12, 20, durée) ni une charge de départ | déjà vrai, à garder en test |

**7.5 À faire valider par `kine`** : RAT-1 (2 zones et +2 séries sont-ils prudents pour l'épaule et les lombaires ?) ; RAT-2 ; RAT-6 ; RAT-7 ; deltoïdes ou dos avec une douleur de niveau 1 (le code refuse déjà tout exercice qui porte une ligne de zone gênée dès le niveau 1, mais ne bloque l'ensemble qu'aux niveaux 2-3).
**À trancher par l'utilisateur** : RAT-4 (compensation d'une séance manquée = 0) et le journal `catchUpLog` de RAT-2.

**Avis kine du 13/11/2026 sur le §7 (valeurs finales ; elles l'emportent sur le tableau 7.4 ; NON SOURCÉ / PROVISOIRE ; aucun diagnostic ; valeur la plus prudente en cas de doute)**
- **RAT-1 : CORRIGÉ.** Plafond général conservé (2 zones, +2 séries, +6 min, un échange compte 1), avec en plus : **épaule** (deltoïdes avant / côté / arrière) au plus **1 zone et +1 série par semaine**, sur un exercice d'isolation léger déjà au programme, jamais sur un exercice au-dessus de la tête ; **coiffe des rotateurs, dentelé, lombaires et carré des lombes : aucun rattrapage** (zones de protection, pas de volume à poursuivre) ; une zone qui n'a plus que 1 point de retard n'est pas rattrapée.
- **RAT-2 : OK.** `catchUpLog` sans donnée de santé, 4 semaines au plus, dans l'export et la suppression des données. **Ajout** : sans journal (nouvel appareil, import) la semaine précédente est supposée rattrapée : 1 zone et +1 série au plus.
- **RAT-3, RAT-5, RAT-8 : OK.** Ajout à RAT-3 : cause « sport » (« ton sport prend de la place : je n'ajoute rien pour l'instant »).
- **RAT-4 : OK côté sécurité** (0 série ajoutée après séance manquée est la valeur prudente ; le code actuel, +1 série, doit être corrigé avant toute activation).
- **RAT-6 : CORRIGÉ (garde durcie).** Un échange ne retire de points à **aucune** zone sous le seuil rouge (X = 0). Pour une zone au seuil rouge ou au-dessus : au plus **-1 point** et le résultat reste >= seuil rouge ; **total des pertes de l'échange <= 2 points** ; **aucune perte** (X = 0) sur quadriceps, fessiers, ischios et mollets, et sur toute zone « sensible » (§5) ou chargée par le sport. Si le point gagné sur la zone cible est inférieur aux points perdus : échange refusé. Le quadriceps ne peut donc pas baisser.
- **RAT-7 : OK, durci.** Ajout autorisé seulement si `sportGate` vaut `ok` (pas `warn` : pleine dose déjà permise, rien à ajouter) pour les jambes ; épaule seulement sans charge d'épaule du sport le jour même et la veille ; pas de jour verrouillé, pas de malaise / gêne signalés. Info de sport illisible ou ambiguë : refus. Le rattrapage n'est jamais reporté sur une autre séance (cause « sport » pour RAT-3).
- **Douleur de niveau 1 aux deltoïdes ou au dos : AUCUN rattrapage, durci.** Une douleur d'épaule ou de dos >= niveau 1 supprime **tout** rattrapage (toutes zones, y compris l'échange) tant qu'elle est notée et pendant 7 jours après sa levée ; pour les autres zones de blessure >= niveau 1, les zones de la carte liées (§5) ne reçoivent aucun rattrapage. Niveaux 2-3 : inchangé.
