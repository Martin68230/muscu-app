# Lot 09 (vague 1) : gilet lesté, sac de sable, bosu, 17 fiches (lot D, suite)
Rédigé par `coach` le 24/10/2026. Statut : 17 fiches `brouillon_coach`. Étapes suivantes (CAMPAGNE.md) : `kine` (reprise de la sécurité, surtout les points ci-dessous), `dev` (illustrations, aucune n'est dessinée), `relecteur` lancé à neuf, corrections, statuts. `npm run check:fiches` : 196 fiches, 0 erreur, 0 avertissement. Les fiches ont été produites par un gabarit commun (sections, sources communes) avec un contenu propre à chaque exercice ; chaque fichier est complet.

## Fiches
| id | schéma | niveau_min | variantes (échelon) | matériel | image |
|---|---|---|---|---|---|
| squat-gilet-lest | squat | intermédiaire | libre (1), chaise derrière (1), arrêt en bas (2) | lest (chaise, mur) | photo proche à vérifier (Bodyweight_Squat) ; illustration à faire |
| fente-gilet-lest | fente | intermédiaire | main au mur (1), sans appui (2), descente lente (3) | lest (mur) | illustration à faire |
| pompe-gilet-lest | poussée H | avancé | mains au sol (1), pieds sur chaise (2) | lest (chaise, mur) | photo proche à vérifier (Pushups) ; illustration à faire |
| traction-gilet-lest | tirage V | avancé | mains vers soi (1), mains vers l'avant (2) | barre_traction, lest | photo proche à vérifier (Weighted_Pull_Ups, ceinture) ; illustration à faire |
| marche-gilet-lest | porté | débutant | marche à plat (1) | lest | illustration à faire |
| montee-gilet-lest | fente | intermédiaire | première marche (1), box ou step sous le genou (2) | lest, marche_escalier ou box_ou_step | photo proche à vérifier (Step-up_with_Knee_Raise) ; illustration à faire |
| pont-fessier-gilet-lest | charnière | intermédiaire | deux pieds (1), arrêt en haut (2), une jambe (3, avancé) | lest | photo proche à vérifier (Butt_Lift_Bridge) ; illustration à faire |
| porte-sac-epaule | porté | intermédiaire | sac pris sur une chaise (1), pris au sol (2) | sac_de_sable (chaise, mur) | illustration à faire |
| porte-sac-berceau | porté | intermédiaire | sac pris sur une chaise (1), pris au sol (2) | sac_de_sable (chaise, mur) | illustration à faire |
| squat-sac-berceau | squat | intermédiaire | sac pris sur une chaise (1), pris au sol (2) | sac_de_sable (chaise, mur) | photo proche à vérifier (Goblet_Squat) ; illustration à faire |
| squat-sac-epaule | squat | intermédiaire | chaise derrière (1), libre (2) | sac_de_sable (chaise, mur) | illustration à faire |
| souleve-de-terre-sac | charnière | intermédiaire | sac sur une chaise (1), au sol (2) | sac_de_sable (chaise, mur) | illustration à faire |
| rowing-sac-de-sable | tirage H | intermédiaire | un bras, main sur chaise (1), buste penché (2) | sac_de_sable (chaise, mur) | photo proche à vérifier (One-Arm_Dumbbell_Row) ; illustration à faire |
| squat-bosu | squat | intermédiaire | dôme, main au mur (1), dôme sans appui (2) | bosu, mur | illustration à faire |
| planche-bosu | gainage | intermédiaire | genoux (1), pointes de pieds (2) | bosu, tapis, mur | illustration à faire |
| pompe-bosu | poussée H | intermédiaire | genoux (1), pointes de pieds (2) | bosu, tapis, mur | illustration à faire |
| equilibre-unipodal-bosu | mobilité (équilibre) | intermédiaire | doigts au mur (1), sans appui (2) | bosu, mur | photo proche à vérifier (Balance_Board) ; illustration à faire |

Photos : toutes `à vérifier` ou `non` (aucune n'est affichée tant qu'elle n'est pas regardée et passée à `oui`). Identifiants vérifiés dans free-exercise-db `dist/exercises.json` le 24/10/2026. Aucune photo ne montre un gilet, un sac de sable ni un bosu : free-exercise-db n'en a pas ; ce sont des photos de gestes voisins sans l'objet. Sinon : illustration originale par `dev`.

## Couverture
- Gilet lesté (`lest`) : squat, fente, pompe, traction, marche, montée sur marche, pont fessier = 7 fiches (6 schémas).
- Sac de sable (`sac_de_sable`) : 2 portés, 2 squats, soulevé de terre, rowing = 6 fiches (porté 2, squat 2, charnière 1, tirage H 1). Comble un peu les portés à la maison.
- Bosu (`bosu`) : squat, planche, pompe, équilibre = 4 fiches. Il sert à l'équilibre et au gainage, sans charge ni mouvement balistique (Q22/CSEP, Q27).
- Le débutant n'a que la marche au gilet lesté. Tout le reste est à partir d'intermédiaire (poids fixe non calibrable, instabilité, charge asymétrique : choix prudents NON SOURCÉS, Q26, Q27). Règles 22 et 23 : aucun saut, aucun lancer, aucun épaulé ni geste technique.

## Progression d'une charge fixe (gilet, sac)
Le générateur ne choisit pas de charge pour ces matériels (le profil ne connaît pas leur poids). Chaque fiche écrit : étalonnage par une série d'essai ; si le bas de la fourchette n'est pas tenu avec 2 à 3 répétitions en réserve, la charge est trop lourde et la variante sans charge remplace ; sinon double progression : répétitions dans la fourchette, puis échelon suivant (arrêt en bas, unilatéral, plus lent) ; un changement de lest ou de sac est décidé par la personne, un petit palier à la fois (NON SOURCÉ). Voir Q26.

## Écartés volontairement (motif)
- **Corde à sauter** (tag `corde_a_sauter`) : sauts, décision Q5 en attente. Demande ajoutée : Q28.
- **Vélo, rameur, tapis de course** (tag `machine_cardio`) : le tag ne distingue pas les appareils (Q10) ; le rameur et le tapis sont à retirer en grossesse, post-partum et pour le dos. Demande ajoutée : Q28.
- **Sac de sable lancé, jeté, balancé, sauté** (slam, clean, épaulé à l'élan, sac sur la nuque) : règle 23, Q5, C6 du cou. Le sac se porte et se pose.
- **Dips lestés** : pas de tag « barres parallèles » ; les dips sur banc avec une charge sur les cuisses surchargent l'épaule (fiche dips-banc-triceps déjà prudente) ; non retenus.
- **Traction avec ceinture lestée** : une seule charge fixe, le gilet.
- **Bosu côté plat vers le haut, pieds sur le bosu, squat ou fente avec charge sur bosu, sauts sur bosu, yeux fermés** : chute chargée ou sur la cheville (Q22, Q27).
- **Course, fentes sautées, marche lestée dans un escalier ou en extérieur** avec le gilet : impact et chute (Q5, Q8).

## Pour `kine` (priorités)
1. **Gilet lesté** : poids sur la colonne et les genoux, retiré dès le niveau 2 du dos ou du cou sur squat ; traction et pompe lestées avancées avec épaule, coude, poignet retirés dès le niveau 1 : confirmer ces seuils (très prudents). Seuils « 15 pompes propres » et « 8 tractions propres » (coach, NON SOURCÉ).
2. **Sacs de sable** : prise du sac au sol et pose sur l'épaule (geste proche de l'épaulé : à confirmer pour l'intermédiaire, règle 23) ; sortie de secours de chaque fiche ; porté d'un seul côté (McGill 2013, 6 participants, seaux : transposition prudente).
3. **Bosu** : cheville gênée dès le niveau 1 = retiré ; genou et hanche n1 en quart de squat ; sorties de secours (« laisse-toi aller sur les fesses vers le mur »).
4. **Grossesse / post-partum** : gilet, sac et bosu tous retirés (remplaçants déjà adaptés dans leurs fiches : squat-poids-du-corps, squat-fendu-mur, pompe, tirage-vertical-elastique-haut, marche-du-fermier, montee-sur-marche-poids-du-corps, souleve-de-terre-roumain-halteres, porte-valise, rowing-unilateral-haltere, bird-dog, equilibre-unipodal-mur) ; NON SOURCÉ.
5. Cases `adapter: charge:legere` sur gilet et sac (charge fixe) : elles servent à bloquer toute hausse ; confirmer le sens avec `dev`.

## Pour `dev`
- Aucune illustration n'est dessinée (17 lignes `illustration : ... affichable : non`, à faire) ; photos proches à regarder avant de passer à `oui` (consigne prime, règle 12).
- `sac_de_sable` n'est pas dans `CHARGEABLE_TAGS` (src/generator/config.ts) : ces fiches seraient dosées comme du poids du corps (10 à 15 répétitions). Voir Q26.
- Portés (marche au gilet, deux portés au sac) : V-TEMPS porté (30 s puis 40 s, 2 séries) ; l'app ne gère pas la distance ni un porté d'un seul côté « chaque série = un côté » (écrit en texte seulement).
- `equilibre-unipodal-bosu` est de schéma `mobilite` (comme equilibre-unipodal) : le générateur le traite comme échauffement (1 série) ; son rôle réel est un exercice d'équilibre. À arbitrer.
- Plusieurs variantes ont deux ou trois tags (ex. `sac_de_sable, chaise, mur`) : tout doit être dans le profil.

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
- **Pour `dev`** : `sac_de_sable` hors de `CHARGEABLE_TAGS` (Q26) ; `equilibre-unipodal-bosu` est classé `mobilite` donc traité comme échauffement par le générateur : à exclure des échauffements (note `general` de la fiche) ; le niveau minimum d'une variante `avance` n'est choisi que pour un profil avancé.
