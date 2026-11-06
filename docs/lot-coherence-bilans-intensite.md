# Lot « cohérence bilans + intensité » (demande de l'utilisateur du 06/11/2026)

Une seule passe, rapport de 5 lignes, décisions dans docs/decisions-prises.md. Contrôle automatique UNE fois avant le push ; relecteur UNE seule fois, sur le point 4 seulement ; rien n'est poussé si le relecteur trouve un bloquant sur le point 4.

## 1) Historique : noms « Exercice (variante) »
src/ui/screens/SessionDetail.tsx : `nameOf` n'affiche que le nom de la variante. Afficher « Exercice (variante) », comme l'échauffement. Si la variante change entre séries d'un même exercice, afficher la variante par série. Appliquer aussi aux titres de courbe et de comparaison.

## 2) Couleurs des vues SÉANCE et CYCLE (décision de l'utilisateur du 06/11, remplace le « × sessionsPerWeek » de sessionMap)
- Une zone est ROUGE si, dans la séance : (a) au moins 2 exercices l'ont en muscle principal, OU (b) 1 exercice l'a en principal et au moins 2 autres l'ont en secondaire.
- Une zone qui n'est jamais en principal dans la séance est plafonnée à ORANGE.
- Orange : tout autre cas où la zone reçoit des points au-dessus du seuil gris. Gris sinon.
- Les points affichés au toucher restent ceux de la séance (sans × 5).
- Vue cycle (groupe de séances) : même règle, appliquée aux exercices du groupe. Vue SEMAINE : inchangée (points contre seuils zoneStatus), mais vérifier qu'elle ne contredit pas visiblement le cycle et le dire à l'utilisateur.
- Retirer toute autre échelle (plus de × 5 nulle part). Réécrire les tests de map-data en conséquence.
- Cas de contrôle avec la sauvegarde de l'utilisateur : Poussée B ne doit plus avoir les abdos en rouge (secondaire seulement), et Bas du corps A ne doit plus avoir les obliques en rouge. (La sauvegarde n'est pas dans le dépôt : reconstruire ces deux séances avec les fiches réelles, ou demander le fichier.)

## 3) Vérification (faite le 06/11, voir docs/decisions-prises.md) : « pas assez de temps » du cardio
Voir le constat consigné dans reprendre-ici.md. Aucune correction sans l'accord de l'utilisateur.

## 4) Intensité (sécurité : relecteur UNE seule fois)
Après une séance, si la réserve notée est >= 3 sur des séries en haut de fourchette (ou au-dessus), la séance suivante augmente la difficulté, SANS imposer une variante plus dure. Moyens, selon le temps disponible (estimation de durée de la séance contre la durée limite du profil, ou à défaut le budget du générateur) :
- Beaucoup de marge (de quoi caser un exercice entier avec ses repos) : ajouter un exercice utile, en priorité sur une zone peu travaillée de la semaine.
- Marge moyenne ou faible : plus de répétitions (dans la fourchette du rôle), puis une série en plus, tant que l'estimation reste <= limite.
- Séance déjà à la limite (par exemple 45 min) : on ne dépasse pas. On ne monte que si l'estimation reste <= limite, sinon on s'arrête là.
- Variante plus difficile : seulement si rien d'autre n'est possible.
- Ne jamais raccourcir les repos pour gagner du temps.
Garder tous les garde-fous : plafonds par séance et par semaine, D3/D4, débutants, blessures, grossesse, reprise. La montée peut aussi se faire entre les séries d'une même séance de calibrage, si les 2 premières séries sont à réserve >= 4.

## 5) Rotation après régénération du programme (constaté le 06/11 par l'utilisateur, confirmé par l'historique)
`nextSession` (src/session/program.ts) ne regarde que les séances du programme ACTIF (`programId`). Quand le programme est régénéré (matériel, « Gagner du temps », cardio, salle, objectif, jours…), les séances déjà faites appartiennent à l'ancien programme et la rotation repart de « Haut du corps A » : l'utilisateur avait fait Haut du corps A mardi et l'app a reproposé Haut du corps A. Correctif attendu : la rotation continue après la dernière séance faite ou sautée de TOUS les programmes de la personne, en retrouvant dans le nouveau programme le même type de séance (sessionType + label : HAUT-A, BAS-A, PUSH-B, PULL-B, LEGS-B, A/B/C) ; si le type n'existe plus, repli sur la séance suivante par index ; ne jamais proposer la séance qui vient d'être faite deux fois de suite ; les 48 h et les gels restent calculés sur les séances faites (tous programmes). Test : séances faites sous un programme P1, régénération en P2 (mêmes types), la prochaine séance est celle qui suit la dernière faite ; cas sans correspondance ; cas du cardio. Les courbes et l'historique ne changent pas (ils lisent les séries par exercice, pas par programme).
