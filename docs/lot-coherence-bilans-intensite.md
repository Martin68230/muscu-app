# Lot « cohérence bilans + durée + intensité + tirages » (demande de l'utilisateur du 06/11/2026, version avec précisions)

Une seule passe, rapport de 5 lignes, décisions dans docs/decisions-prises.md. Contrôle automatique UNE fois avant le push. Relecteur UNE seule fois, sur les points 3, 4 et 5. Rien n'est poussé si le relecteur trouve un bloquant sur le point 3, 4 ou 5. Si la fenêtre de 5 h est entamée en route : livrer les points 1 et 2 d'abord, puis passer aux autres.

## 1) Historique : noms « Exercice (variante) »
src/ui/screens/SessionDetail.tsx : `nameOf` n'affiche que le nom de la variante. Afficher « Exercice (variante) », comme l'échauffement. Preuve : voir l'exemple du point 5, où plusieurs exercices différents s'appellent « Debout sur l'élastique ». Si la variante change entre séries d'un même exercice, afficher la variante par série. Appliquer aussi aux titres de courbe et de comparaison.

## 2) Couleurs des vues SÉANCE et CYCLE (décision de l'utilisateur du 06/11, remplace le « × sessionsPerWeek » de sessionMap)
- Une zone est ROUGE si, dans la séance : (a) au moins 2 exercices l'ont en muscle principal, OU (b) 1 exercice l'a en principal et au moins 2 autres l'ont en secondaire.
- Une zone qui n'est jamais en principal dans la séance est plafonnée à ORANGE.
- Orange : tout autre cas où la zone reçoit des points au-dessus du seuil gris. Gris sinon.
- Les points affichés au toucher restent ceux de la séance (sans × 5).
- Vue cycle (groupe de séances) : même règle, appliquée aux exercices du groupe. Vue SEMAINE : inchangée (points contre seuils zoneStatus), mais vérifier qu'elle ne contredit pas visiblement le cycle et le dire à l'utilisateur.
- Retirer toute autre échelle (plus de × 5 nulle part). Réécrire les tests de map-data en conséquence.
- Cas de contrôle avec la sauvegarde de l'utilisateur : Poussée B ne doit plus avoir les abdos en rouge (secondaire seulement), et Bas du corps A ne doit plus avoir les obliques en rouge. (La sauvegarde n'est pas dans le dépôt : reconstruire ces deux séances avec les fiches réelles, ou demander le fichier.)

## 3) Durée des séances (bug constaté, à corriger)
Avec sessionDurationMin = null (« durée illimitée »), resolveDuration vise UNLIMITED.targetMin = 60 min, plafond 75. Or le programme actif de la sauvegarde du 06/11 donne des séances estimées à 40, 30, 30, 35 et 40 min, et retire le cardio avec « pas assez de temps dans 75 min ». Décision de l'utilisateur : quand il choisit « illimité », il a tout son temps, donc aucune séance de 20-30 min.
- Trouver pourquoi le générateur ne remplit pas la cible (estimation de durée fausse, arrêt trop tôt, plafonds de séries par séance, ou autre) et le corriger. Constat déjà fait (06/11, voir reprendre-ici) : le bloc de cardio secondaire est plafonné à 25 % de la durée de musculation (blockCap, src/generator/cardio.ts) : à 35 min, 8 min < minimum 10 min, donc aucun bloc ; le texte « pas assez de temps » (explainCardio, src/generator/index.ts) cite alors une fausse raison.
- Avec « illimité », viser 60 min par séance, jusqu'à 75 au plus. Avec une durée choisie (30, 45, 60...), viser cette durée et ne jamais la dépasser.
- Ordre de remplissage du temps restant (décision de l'utilisateur) :
  a) d'abord faire travailler toutes les zones ciblées par la semaine jusqu'au rouge (échelle de la semaine), en ajoutant des séries, des répétitions ou des exercices utiles ;
  b) une fois ces zones rouges : exercices fonctionnels, et exercices pour les muscles auxquels on pense peu (avant-bras, nuque, mollets, tibiaux, coiffe des rotateurs, petites zones grises ou orange), en utilisant uniquement les fiches existantes et sûres ;
  c) cardio en dernier et en petite quantité : jamais énormément de cardio pour boucher le temps.
- Si le temps manque vraiment, le cardio est retiré en premier, mais jamais « faute de temps » quand la séance est loin de la limite.
- Si une zone (par exemple la nuque) n'a pas de fiche sûre, ne rien inventer : le dire dans le rapport.
- Si une cause oblige à changer une règle de sécurité, le dire à l'utilisateur AVANT.

## 4) Intensité (sécurité : relecteur UNE seule fois)
Après une séance, si la réserve notée est >= 3 sur des séries en haut de fourchette (ou au-dessus), la séance suivante augmente la difficulté, SANS imposer une variante plus dure. Cas réel : Tirage B de l'utilisateur (exemple du point 5), toutes les séries à réserve 4 avec 12 à 15 répétitions pour une fourchette de 8-12. Moyens, selon le temps disponible (estimation de durée de la séance contre la durée limite du profil, ou à défaut la cible du générateur) :
- Beaucoup de marge (de quoi caser un exercice entier avec ses repos) : ajouter un exercice utile, en priorité sur une zone peu travaillée de la semaine (même ordre de remplissage qu'au point 3).
- Marge moyenne ou faible : plus de répétitions (dans la fourchette du rôle), puis une série en plus, tant que l'estimation reste <= limite.
- Séance déjà à la limite (par exemple 45 min) : on ne dépasse pas. On ne monte que si l'estimation reste <= limite, sinon on s'arrête là.
- Variante plus difficile : seulement si rien d'autre n'est possible.
- Ne jamais raccourcir les repos pour gagner du temps.
Garder tous les garde-fous : plafonds par séance et par semaine, D3/D4, débutants, blessures, grossesse, reprise. La montée peut aussi se faire entre les séries d'une même séance de calibrage, si les 2 premières séries sont à réserve >= 4.

## 5) Tirages verticaux (coach + kiné ; relecteur UNE seule fois avec le point 4)
Exemple réel (écran « Détail de la séance », Tirage B, 37 min), copié tel quel :
- « Un bras, à genoux » : série 1 : gauche 14 · 4 de réserve ; droite 14 · 4 de réserve ; séries 2 et 3 : 12 · 4 de réserve (chaque côté).
- « Un bras, debout face à l'ancrage » : séries 1 à 3 : 12 · 4 de réserve (chaque côté).
- « Debout, l'autre main tient l'élastique en haut » : série 1 : 12 · 4 de réserve ; séries 2 et 3 : 15 · 4 de réserve (gauche et droite).
- « Debout sur l'élastique » : séries 1 à 3 : 15 répétitions · 4 de réserve.
Constat de l'utilisateur : les noms d'exercices dans l'historique et le bilan ne vont pas ; il y a deux tirages verticaux unilatéraux sur 4 exercices ; ils sont mal expliqués, surtout le troisième (« Debout, l'autre main tient l'élastique en haut »), signalé pour la deuxième fois.
Correspondance dans les fiches : « Un bras, à genoux » = tirage-vertical-elastique-haut ; « Un bras, debout face à l'ancrage » = rowing-elastique (variante un bras, donc un tirage horizontal) ; « Debout, l'autre main tient l'élastique en haut » = tirage-vertical-un-bras-elastique ; « Debout sur l'élastique » = curl-elastique (nom de variante partagé avec le développé épaules et le rowing penché).
a) Doublon : tirage-vertical-elastique-haut (emplacement tirage_1) ET tirage-vertical-un-bras-elastique (emplacement tirage_3), à cause de la règle D25 « tirage_3 = même plan que tirage_1 ». Même schéma, mêmes muscles : c'est le même exercice deux fois. Règle voulue : jamais deux fiches de même schéma ET mêmes muscles principaux et secondaires dans une séance. Si aucune autre fiche sûre du même plan n'existe, l'emplacement prend un autre exercice utile (arrière d'épaule, biceps, avant-bras, trapèzes bas) au lieu d'un doublon. Vérifier que la règle ne casse pas les autres séances.
b) Consigne de tirage-vertical-un-bras-elastique (signalée le 03/11 et encore le 06/11 : « pas compréhensible, main en haut, bras tendu ou pas »). Réécrire en étapes courtes et numérotées (position, départ, mouvement, arrivée, erreur à éviter), 6 lignes au plus, en disant clairement où est chaque main, si le bras est tendu ou plié, et ce que fait le coude. Le coach et le kiné valident que le mouvement est un tirage sûr ; sinon retirer la variante et dire pourquoi.
c) Les variantes « Un bras, à genoux » et « Un bras, debout face à l'ancrage » renvoient à « Même ancrage de porte » sans le décrire : chaque consigne doit se suffire à elle-même. Vérifier aussi que les exercices qui exigent un ancrage ne sont proposés qu'avec un ancrage dans l'équipement (profil de l'utilisateur : élastique et mini-bande seulement).

## 6) Rotation après régénération du programme (constaté le 06/11 par l'utilisateur, confirmé par l'historique)
`nextSession` (src/session/program.ts) ne regarde que les séances du programme ACTIF (`programId`). Quand le programme est régénéré (matériel, « Gagner du temps », cardio, salle, objectif, jours…), les séances déjà faites appartiennent à l'ancien programme et la rotation repart de « Haut du corps A » : l'utilisateur avait fait Haut du corps A mardi et l'app a reproposé Haut du corps A. Correctif attendu : la rotation continue après la dernière séance faite ou sautée de TOUS les programmes de la personne, en retrouvant dans le nouveau programme le même type de séance (sessionType + label : HAUT-A, BAS-A, PUSH-B, PULL-B, LEGS-B, A/B/C) ; si le type n'existe plus, repli sur la séance suivante par index ; ne jamais proposer la séance qui vient d'être faite deux fois de suite ; les 48 h et les gels restent calculés sur les séances faites (tous programmes). Test : séances faites sous un programme P1, régénération en P2 (mêmes types), la prochaine séance est celle qui suit la dernière faite ; cas sans correspondance ; cas du cardio. Les courbes et l'historique ne changent pas (ils lisent les séries par exercice, pas par programme).
