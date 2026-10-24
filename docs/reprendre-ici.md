# Reprendre ici (24/10/2026, 12 h 30)

Faits et commités : lot A (docs/F6bis-lot-A.md), lot C (docs/F6bis-lot-C.md). Quota 5 h : 4 % après le lot C.
À arrêter à la main : 5 processus `python3 -` orphelins (PID 22436, 18580, 9272, 17560, 18408), si pas déjà fait.

## Lot B (objectifs) : état constaté, en attente de feu vert sur le coût
- App : un seul objectif choisi (`OBJECTIFS` dans src/data/profile-setup.ts : muscle « Muscle général », force, sante, perte_gras) ; `setMainGoal` ne gère que le rang 1. Pas de cardio, pas de secondaires dans l'interface.
- Générateur : lit les objectifs classés (`goals` avec rang) mais n'utilise que le n° 1 ; `cardio`/`endurance`/`sport` sont « ramenés » vers sante (message `objCardio`, texte « en attendant la version dédiée »). Aucun cardio planifié, `cardio` exclu des emplacements en v1 (generateur-v1.md l. 87) ; knowledge/goal-resolver.md décrit la fusion cible (NON SOURCÉ).
- Renommage : « Muscle général » → « Prise de muscle » : petit, à faire d'abord.
## Étapes proposées, avec coût estimé (5 h = 100 %)
1. B1 renommage « Prise de muscle » + tests : ~2 %.
2. B2 interface : objectifs multiples (1 principal + secondaires, classés), carte du profil, tests : ~8 %.
3. B3 règles cardio : coach (sources ACSM/OMS, statuts) puis kine (sécurité cœur, essoufflement, arrêt) puis relecteur : ~12 %.
4. B4 générateur : séances/blocs cardio selon lieu et matériel (fiches cardio utilisables à vérifier), fusion principal/secondaires, message d'explication, tests : ~15 %. Opus recommandé (règles du générateur, CLAUDE.md).
Total ~37 % : au-dessus de la cible de 35 points ; B3+B4 peuvent passer dans une conversation à part.
## Ensuite : F7 (historique et accueil).
