# Lot 09 (vague 1) : gilet lesté, sac de sable, bosu, 15 fiches + 2 écartées (lot D, suite)
Rédigé par `coach` le 24/10/2026. Statut : 17 fiches `brouillon_coach`. Étapes suivantes (CAMPAGNE.md) : `kine` (reprise de la sécurité, surtout les points ci-dessous), `dev` (illustrations, aucune n'est dessinée), `relecteur` lancé à neuf, corrections, statuts. `npm run check:fiches` : 196 fiches, 0 erreur, 0 avertissement. Les fiches ont été produites par un gabarit commun (sections, sources communes) avec un contenu propre à chaque exercice ; chaque fichier est complet.

## Fiches
| id | schéma | niveau_min | variantes (échelon) | matériel | image |
|---|---|---|---|---|---|
| squat-gilet-lest | squat | intermédiaire | libre (1), chaise derrière (1), arrêt en bas (2) | lest (chaise, mur) | illustration faite (oui), photo non |
| fente-gilet-lest | fente | intermédiaire | main au mur (1), sans appui (2), descente lente (3) | lest (mur) | illustration faite (oui), photo non |
| pompe-gilet-lest | poussée H | avancé | mains au sol (1), pieds sur chaise (2) | lest (chaise, mur) | illustration faite (oui), photo non |
| traction-gilet-lest | tirage V | avancé | mains vers soi (1), mains vers l'avant (2) | barre_traction, lest | illustration faite (oui), photo non |
| marche-gilet-lest | porté | débutant | marche à plat (1) | lest | illustration faite (oui), photo non |
| montee-gilet-lest | fente | intermédiaire | première marche seulement (1, box retirée) | lest, marche_escalier | illustration faite (oui), photo non |
| pont-fessier-gilet-lest | charnière | intermédiaire | deux pieds (1), arrêt en haut (2), une jambe (3, avancé) | lest | illustration faite (oui), photo non |
| porte-sac-berceau | porté | intermédiaire | sac pris sur une chaise (1), pris au sol (2) | sac_de_sable (chaise, mur) | illustration faite (oui), photo non |
| squat-sac-berceau | squat | intermédiaire | sac pris sur une chaise (1), pris au sol (2) | sac_de_sable (chaise, mur) | illustration faite (oui), photo non |
| souleve-de-terre-sac | charnière | intermédiaire | sac sur une chaise (1), au sol (2) | sac_de_sable (chaise, mur) | illustration faite (oui), photo non |
| rowing-sac-de-sable | tirage H | intermédiaire | un bras, main sur chaise (1), buste penché (2) | sac_de_sable (chaise, mur) | illustration faite (oui), photo non |
| squat-bosu | squat | intermédiaire | dôme, main au mur (1), dôme sans appui (2) | bosu, mur | illustration faite (oui), photo non |
| planche-bosu | gainage | intermédiaire | genoux (1), pointes de pieds (2) | bosu, tapis, mur | illustration faite (oui), photo non |
| pompe-bosu | poussée H | intermédiaire | genoux (1), pointes de pieds (2) | bosu, tapis, mur | illustration faite (oui), photo non |
| equilibre-unipodal-bosu | mobilité (équilibre) | intermédiaire | doigts au mur (1), sans appui (2) | bosu, mur | illustration faite (oui), photo non |

Photos : toutes `à vérifier` ou `non` (aucune n'est affichée tant qu'elle n'est pas regardée et passée à `oui`). Identifiants vérifiés dans free-exercise-db `dist/exercises.json` le 24/10/2026. Aucune photo ne montre un gilet, un sac de sable ni un bosu : free-exercise-db n'en a pas ; ce sont des photos de gestes voisins sans l'objet. Sinon : illustration originale par `dev`.

## Couverture
- Gilet lesté (`lest`) : squat, fente, pompe, traction, marche, montée sur marche, pont fessier = 7 fiches (6 schémas).
- Sac de sable (`sac_de_sable`) : 1 porté, 1 squat, soulevé de terre, rowing = 4 fiches (porté 1, squat 1, charnière 1, tirage H 1) ; deux fiches « sur l'épaule » écartées (voir ci-dessous).
- Bosu (`bosu`) : squat, planche, pompe, équilibre = 4 fiches. Il sert à l'équilibre et au gainage, sans charge ni mouvement balistique (Q22/CSEP, Q27).
- Le débutant n'a que la marche au gilet lesté. Tout le reste est à partir d'intermédiaire (poids fixe non calibrable, instabilité, charge asymétrique : choix prudents NON SOURCÉS, Q26, Q27). Règles 22 et 23 : aucun saut, aucun lancer, aucun épaulé ni geste technique.

## Progression d'une charge fixe (gilet, sac)
Le générateur ne choisit pas de charge pour ces matériels (le profil ne connaît pas leur poids). Chaque fiche écrit : étalonnage par une série d'essai ; si le bas de la fourchette n'est pas tenu avec 2 à 3 répétitions en réserve, la charge est trop lourde et la variante sans charge remplace ; sinon double progression : répétitions dans la fourchette, puis échelon suivant (arrêt en bas, unilatéral, plus lent) ; un changement de lest ou de sac est décidé par la personne, un petit palier à la fois (NON SOURCÉ). Voir Q26.

## Écartés volontairement (motif)
- **porte-sac-epaule et squat-sac-epaule** (déplacées le 25/10/2026 dans `ecartees/` par le chef de projet, après le bloquant B1 du contrôle `relecteur`) : la pose du sac sur l'épaule (contre le ventre, puis sur l'épaule) est un geste proche de l'épaulé, que la règle 23 interdit « pour les débutants et à la maison » ; la fiche de base Sandbag_Load dit elle-même que la mise sur l'épaule n'est généralement pas autorisée. Choix prudent : on n'assouplit pas la règle 23. Les fiches restent dans `ecartees/` (hors du générateur et de la bibliothèque), aucune autre fiche ne les cite. Question ouverte : Q29 (assouplir la règle 23 pour la pose lente du sac sur l'épaule ? non par défaut).
- **Corde à sauter** (tag `corde_a_sauter`) : sauts, décision Q5 en attente. Demande ajoutée : Q28.
- **Vélo, rameur, tapis de course** (tag `machine_cardio`) : le tag ne distingue pas les appareils (Q10) ; le rameur et le tapis sont à retirer en grossesse, post-partum et pour le dos. Demande ajoutée : Q28.
- **Sac de sable lancé, jeté, balancé, sauté** (slam, clean, épaulé à l'élan, sac sur la nuque) : règle 23, Q5, C6 du cou. Le sac se porte et se pose.
- **Dips lestés** : pas de tag « barres parallèles » ; les dips sur banc avec une charge sur les cuisses surchargent l'épaule (fiche dips-banc-triceps déjà prudente) ; non retenus.
- **Traction avec ceinture lestée** : une seule charge fixe, le gilet.
- **Bosu côté plat vers le haut, pieds sur le bosu, squat ou fente avec charge sur bosu, sauts sur bosu, yeux fermés** : chute chargée ou sur la cheville (Q22, Q27).
- **Course, fentes sautées, marche lestée dans un escalier ou en extérieur** avec le gilet : impact et chute (Q5, Q8).

## Pour `kine` (priorités)
1. **Gilet lesté** : poids sur la colonne et les genoux, retiré dès le niveau 2 du dos ou du cou sur squat ; traction et pompe lestées avancées avec épaule, coude, poignet retirés dès le niveau 1 : confirmer ces seuils (très prudents). Seuils « 15 pompes propres » et « 8 tractions propres » (coach, NON SOURCÉ).
2. **Sacs de sable** : la pose sur l'épaule est écartée (règle 23, voir plus haut) ; il reste la prise au sol et le berceau devant le tronc ; sortie de secours de chaque fiche ; McGill 2013 (6 participants, seaux le long du corps) ne teste pas le berceau : choix prudent NON SOURCÉ.
3. **Bosu** : cheville gênée dès le niveau 1 = retiré ; genou et hanche n1 en quart de squat ; sorties de secours (« laisse-toi aller sur les fesses vers le mur »).
4. **Grossesse / post-partum** : gilet, sac et bosu tous retirés (remplaçants déjà adaptés dans leurs fiches : squat-poids-du-corps, squat-fendu-mur, pompe, tirage-vertical-elastique-haut, marche-du-fermier, montee-sur-marche-poids-du-corps, souleve-de-terre-roumain-halteres, porte-valise, rowing-unilateral-haltere, bird-dog, equilibre-unipodal-mur) ; NON SOURCÉ.
5. Cases `adapter: charge:legere` sur gilet et sac (charge fixe) : elles servent à bloquer toute hausse ; confirmer le sens avec `dev`.

## Pour `dev`
- Images faites le 25/10/2026 : 17 illustrations originales (`oui`), 0 photo ajoutée (les photos voisines sont marquées `non` : elles ne montrent ni gilet, ni sac, ni bosu). Chaque illustration montre la première variante de la fiche (légende : « Variante ... »). Moteur : accessoires `vest` (gilet) et `bosu` ajoutés à `tools/make-illustrations.mjs`. Reste à contrôler par `relecteur`.
- `sac_de_sable` n'est pas dans `CHARGEABLE_TAGS` (src/generator/config.ts) : ces fiches seraient dosées comme du poids du corps (10 à 15 répétitions). Voir Q26.
- Portés (marche au gilet, porté au sac en berceau) : V-TEMPS porté (30 s puis 40 s, 2 séries) ; la durée fait foi, l'app ne gère pas la distance. Un porté d'un seul côté (la ligne V-TEMPS ne sait pas faire « un côté par série ») n'existe plus dans le lot depuis l'écart des fiches « épaule ».
- `equilibre-unipodal-bosu` est de schéma `mobilite` : correction du contrôle `relecteur` (S3) : elle est maintenant exclue du générateur (GENERATOR_EXCLUDED_FICHES, config.ts) ; elle n'est ni choisie dans un programme ni utilisée comme échauffement (l'échauffement prend des identifiants fixes) ; `TEMPS` n'a pas de ligne `mobilite` : V-DOSE la doserait (10 à 15 répétitions, 2 à 3 séries) à l'inverse de la fiche, d'où l'exclusion choisie par `dev` tant qu'aucun emplacement d'équilibre dosé selon la fiche n'existe.
- Plusieurs variantes ont deux ou trois tags (ex. `sac_de_sable, chaise, mur`) : tout doit être dans le profil.
- Gilet (S4 du contrôle) : traité depuis par `dev` comme charge fixe (voir « Corrections coach 2 ») ; constat d'origine : (a) l'échauffement E3 des piliers demande « 8 répétitions à environ 50 % » d'un gilet dont l'app ne connaît pas le poids ; (b) la voie « charge » ne monte jamais d'échelon, alors que les fiches écrivent la montée d'échelon comme étape 2 de la progression ; (c) si la personne saisit le poids de son gilet, la double progression peut proposer +/- 2 kg. Soit retirer `lest` de la voie « charge », soit une règle « charge fixe » (même logique que N4 au lot 08).

## Questions pour l'utilisateur
Q26 (poids du gilet et du sac), Q27 (bosu côté plat et pieds sur bosu), Q28 (corde à sauter, vélo, rameur, tapis). Voir aussi Q5, Q10, Q12, Q22.

## Sources de ce lot
Résumés Europe PMC lus le 24/10/2026 (aucun texte complet lu, tout PROVISOIRE) : Snow et coll. 2000 (J Gerontol A 55(9):M489-M491, PMID 10995045, gilet lesté et sauts, 18 femmes ménopausées) ; Wahl et Behm 2008 (J Strength Cond Res 22(4):1360-1370, PMID 18545166, bosu, 16 personnes très entraînées) ; McGill, Marshall, Andersen 2013 (Ergonomics 56(2):293-302, PMID 23384188, charge d'un côté ou des deux, 6 participants) ; Hupperets, Verhagen, van Mechelen 2009 (BMJ 339:b2684, PMID 19589822, entraînement d'équilibre, 522 sportifs avec entorse). Behm et coll. 2010 (CSEP) et ACSM 2026 : références du dépôt, non rouvertes. Aucune étude lue sur le sac de sable ni sur le gilet pour ces exercices. Échelons, niveaux, plafonds, grossesse, tableaux par zone, objets : NON SOURCÉ.

## Reprise de la sécurité par `kine` (25/10/2026)
Les 17 fiches passent de `brouillon_coach` à `complete_kine`, aucune n'est écartée (chaque fiche a maintenant une sortie de secours écrite, à pratiquer une fois à vide). Reste à faire : `dev` (illustrations, photos à regarder), puis `relecteur` lancé à neuf. `npm run check:fiches` : 196 fiches, 0 erreur. Tous les choix ci-dessous sont des choix prudents NON SOURCÉS (aucune étude ne teste zone x niveau ni ces adaptations).
- **Règle unique des charges fixes** (gilet, sac ; une seule règle, écrite en note `general` de chaque fiche) : l'app ne peut pas alléger le gilet ni le sac. Squats, fente, montée, pont, soulevé : dès la gêne nette (niveau 2) au dos, à la hanche ou au genou, la charge est retirée (remplaçant sans charge) ; gêne légère : variante d'appui ou plus courte (main au mur, prise sur la chaise, deux pieds au sol). Pompe et traction au gilet : charge retirée dès la gêne légère à l'épaule, au coude, au poignet (le dos et le cou : gêne légère = geste plus lent ou tête alignée, nette = retrait). Marche et portés : le plus léger, sans hausse.
- **Sacs** : prise au sol puis pose sur l'épaule = geste proche de l'épaulé (règle 23) : variantes concernées passées à `avance` (porte-sac-epaule-sol, squat-sac-epaule-libre) ; rowing au sac à deux mains (dos non soutenu) aussi `avance`. Prise sur la chaise seulement dès la gêne légère au dos (berceau, squat, soulevé). Sortie de secours : on ne retient pas un sac qui tombe, on le laisse tomber devant ou à côté, jamais sur les pieds ; sac sur l'épaule : on le pousse vers l'avant-extérieur. Test du premier sac : 5 répétitions dos plat sans élan, sinon trop lourd.
- **Gilet** : lest le plus léger au départ, ouvrable d'un geste, test d'une minute debout pour la marche (débutant gardé : geste le plus simple). Traction : barre à moins de 30 cm du sol les pieds pendants, sinon pas d'exercice. Pompe : sortie genoux puis ventre, à essayer à vide.
- **Bosu** : cheville retirée dès le niveau 1 (squat et équilibre sur bosu) ; genou : coussin sous les genoux dès le niveau 1 en planche et pompe sur bosu, retiré au niveau 2 ; poignet retiré dès le niveau 1 en pompe sur bosu ; épaule et coude passent aux genoux au niveau 1 ; sortie : s'asseoir sur les fesses vers le mur, jamais poser le pied sur le côté de la cheville ; ne sert pas d'échauffement ni fatigué.
- **Grossesse / post-partum** : les 17 fiches restent retirées, remplaçants déjà adaptés dans leurs propres fiches ; G7 rappelé dans chaque fiche. Pas d'impact dans le lot.
- Q26 à Q28 : choix prudents appliqués, voir docs/QUESTIONS.md.
- **Pour `dev`** : `sac_de_sable` hors de `CHARGEABLE_TAGS` (Q26) ; `equilibre-unipodal-bosu` est de schéma `mobilite` ; elle est désormais exclue du générateur (GENERATOR_EXCLUDED_FICHES) ; elle n'est pas un échauffement (note `general` de la fiche) ; le niveau minimum d'une variante `avance` n'est choisi que pour un profil avancé.

## Corrections coach (25/10/2026, suite au contrôle `relecteur` du 25/10/2026)
Faites, fiche par fiche, `npm run check:fiches` à 0 erreur après chacune (194 fiches) ; aucun statut changé, rien touché à la sécurité (S1, cases zone x niveau, sorties de secours), aux images ni au code.
- **B1** : voir « Écartés volontairement » ; Q29 posée ; aucune référence aux deux fiches dans les 15 autres (progressions, variantes, remplaçants) ; la mention « ou sur l'épaule » du motif grossesse retirée de 4 fiches (sac contre le ventre seulement).
- **C1** (7 fiches gilet) : ligne Snow 2000 réécrite : gilet + sauts, 9 femmes ménopausées contre 9 témoins, 5 ans, densité osseuse de la hanche maintenue ; aucune étude lue sur ces exercices ni sur ce public ; l'usage avec l'exercice est dit choix de coach NON SOURCÉ.
- **C2** (4 fiches bosu) : Wahl et Behm 2008 réécrit : pas d'activité musculaire en plus chez 16 personnes très entraînées ; seule exception les érecteurs du rachis debout sur Dyna Disc ; ballon et plateau : plus d'activité surtout debout (accroupi : abdominaux bas et soléaire) ; le rôle équilibre/contrôle est un choix de coach NON SOURCÉ (statut séparé). Même précision dans la note de squat-bosu.
- **M3** (squat-bosu, equilibre-unipodal-bosu) : Hupperets 2009 : bénéfice significatif seulement pour les entorses non soignées médicalement.
- **C3** (porte-sac-berceau) : une seule règle : la durée fait foi (30 s puis 40 s, 2 séries au total). Le cas « une série par épaule » disparaît avec la fiche écartée.
- **C4** : sans objet (squat-sac-epaule écartée).
- **C5** (marche-gilet-lest) : le test d'une minute debout est maintenant dans la consigne 1.
- **C6** (squat-bosu, equilibre-unipodal-bosu) : note cheville-n2 corrigée (retiré, sans remplaçant dans cette case ; le remplaçant du niveau 1 est nommé).
- **C8** (porte-sac-berceau) : « plus facile à tenir droit » remplacé par un choix de coach NON SOURCÉ ; McGill 2013 ne teste pas une charge devant le tronc.
- **C10** (pont-fessier-gilet-lest) : `pont-fessier-une-jambe` retiré de plus-facile.
- **C11** (rowing-sac-de-sable) : le vrai motif de `avance` est écrit (dos non soutenu sous charge, choix prudent), la règle 23 n'est plus invoquée à tort. L'image d'arrivée (sac sous le bassin) reste à voir par `dev` (M8).
- **C13** : ce README mis à jour (tableau des images, « Pour dev », compteurs).
- **S3** (texte seulement) : la fiche equilibre-unipodal-bosu et ce README ne disent plus « traité comme échauffement » ; décision de `dev` toujours à enregistrer. **S4** : décrit dans « Pour dev ».
- **M1** (fente-gilet-lest) : installation alignée sur l'illustration (face au mur, à un pas). **M2** (squat-sac-berceau) : Goblet_Squat = équipement « kettlebells ». **M4** (squat-sac-berceau) : note cou-n2 réécrite (menton rentré, sac loin du menton). **M7** (equilibre-unipodal-bosu) : consigne 2 alignée sur l'installation (un seul pied sur le dôme), prérequis « 30 secondes sur sol plat » noté comme non vérifiable par l'app.
- **Laissés à d'autres** : S1, C7, C9, C12, M11 et M12 (`kine`) ; S2, M5, M6, M8 (images, `dev`) ; S3 et S4 (code, `dev`) ; statuts (chef de projet). M9, M10, M13 : sans correction demandée.

## Corrections kine 2 (25/10/2026, suite au contrôle `relecteur`)
Fiche par fiche, `npm run check:fiches` à 0 erreur (194 fiches) ; aucun statut, source, dosage, image ni code touchés. Choix prudents, NON SOURCÉS.
- **S1** (montee-gilet-lest) : la variante `montee-gilet-lest-box` est retirée. Il ne reste que la première marche d'un escalier avec rampe obligatoire (jamais la deuxième marche, jamais une box, un step, un banc ni une chaise avec le gilet) : plus strict que la décision du 21/10 sur les haltères, car le gilet ne se lâche pas d'un geste. Une seule variante, donc plus d'échelon plus haut : `plus-dur : aucun` ; les textes de progression (dosage) ont été alignés au minimum (même marche, même gilet) : à revoir par `coach`. regles-securite-communes.md §7 : règle du gilet ajoutée (M12).
- **C9** : dos niveau 1 de la montée au gilet : `adapter: amplitude:lente` (montée et descente lentes, buste droit, main sur la rampe), comme les autres exercices au gilet.
- **C7** (planche-bosu, pompe-bosu) : genou niveau 1 : `adapter: variante:...-genoux` (avec tapis épais ou coussin), au lieu de `appui:coussin` qui ne valait pas pour la variante pointes de pieds.
- **C12** : décision : le mur est du côté de la tête, derrière le bosu (comme l'illustration actuelle de dev : mains ou avant-bras sur la moitié du dôme côté soi, front loin du mur) ; jamais sur le côté ni contre les pieds. Écrit dans l'installation, les consignes, les points d'attention, la sécurité et la sortie de secours (ne pas tendre la tête vers le mur). La consigne planche dit « avant-bras à plat sur le dôme » (S2, aligné sur l'image refaite). Rien à changer pour dev.
- **M11** : « pieds nus propres » remplacé par « chaussures fermées, pas de pieds nus » dans les 4 fiches bosu.
- **Pour `dev`** : la variante box n'existe plus (tests et libellés qui la citeraient à vérifier) ; légende de montee-gilet-lest.svg à relire (« Pas de box avec le gilet » ajouté à la fiche).

## Corrections coach 2 (25/10/2026, dosage aligné sur le comportement réel du générateur)
`npm run check:fiches` à 0 erreur après chaque fiche ; aucune sécurité, image, code ni statut touché. Valeurs du générateur, sauf mention : NON SOURCÉ (choix prudents).
- **Gilet lesté (7 fiches `*-gilet-lest`)** : la section « Repères de dosage » dit ce que fait le code (config.ts FIXED_LOAD_TAGS, dose.ts, règle V-DOSE branche « poids du corps ») : `lest` n'est pas « chargeable » ; 10 à 15 répétitions, 2 à 3 séries, réserve cible 2 ou 3, repos 60 à 180 s ; ni charge de départ, ni échauffement à 50 %, ni hausse de charge proposée ; progression par les répétitions puis l'échelon (montée : même marche, même gilet) ; changer le lest du gilet reste la décision de la personne, hors de l'app, qui ne le propose jamais (NON SOURCÉ). Disparus : « 8 à 12 », « 4 à 6 sur un pilier en force », « le tag `lest` est dans la liste chargeable ». La marche (règle V-TEMPS) garde sa dose, avec la même précision sur la charge fixe.
- **equilibre-unipodal-bosu** : la fiche et ce README disent qu'elle est exclue du générateur (GENERATOR_EXCLUDED_FICHES), sans la dire « traitée comme échauffement » ; la note S4 « Pour dev » est marquée comme traitée.
