# R2 : liens de progression retirés puis rétablis (30/10/2026)

Source : `git diff 9afc52b~1 9afc52b` (script tools/r2-retablir.mjs). Règle D23 élargie : même famille de schéma ET au moins un muscle principal commun (voir knowledge/taxonomie-schemas.md).

- Retirés par 9afc52b : **51**
- Rétablis : **20**
- Définitivement refusés : **31**

| fiche | lien | cible | résultat | motif |
|---|---|---|---|---|
| bird-dog | plus-facile | bird-dog-jambe-seule | rétabli | anti_rotation/anti_rotation, muscles communs |
| bird-dog | plus-dur | bird-dog-pause | rétabli | anti_rotation/anti_rotation, muscles communs |
| chat-vache | plus-dur | fente-basse-rotation | refusé | retrait confirmé par l'utilisateur (lignes rotation / autres) |
| fente-basse-rotation | plus-facile | chat-vache | refusé | retrait confirmé par l'utilisateur (lignes rotation / autres) |
| marche-du-fermier | plus-dur | porte-valise | rétabli | porte/porte, muscles communs |
| planche-touche-epaule | plus-facile | planche | rétabli | anti_rotation/gainage, muscles communs |
| planche | plus-dur | planche-touche-epaule | rétabli | gainage/anti_rotation, muscles communs |
| pompe | plus-dur | pompe-diamant | refusé | retrait confirmé par l'utilisateur (lignes rotation / autres) |
| pompe | plus-dur | pompe-piquee | refusé | retrait confirmé par l'utilisateur (lignes rotation / autres) |
| porte-sac-a-dos-devant | plus-dur | marche-du-fermier | refusé | aucun muscle principal commun (abdominaux+erecteurs_rachis / avant_bras+trapezes) |
| porte-sac-a-dos-devant | plus-dur | porte-valise | refusé | aucun muscle principal commun (abdominaux+erecteurs_rachis / obliques+avant_bras) |
| porte-valise | plus-facile | marche-du-fermier | rétabli | porte/porte, muscles communs |
| pullover-haltere-au-sol | plus-facile | tirage-w-allonge | refusé | retrait confirmé par l'utilisateur (lignes rotation / autres) |
| souleve-de-terre-roumain-halteres | plus-facile | pont-fessier | rétabli | charniere/charniere, muscles communs |
| squat-fendu | plus-facile | squat-assis-debout | rétabli | fente/squat, muscles communs |
| squat-gobelet | plus-dur | squat-bulgare | refusé | saut de débutant à intermédiaire (avis coach 30/10/2026) |
| tirage-w-allonge | plus-dur | pullover-haltere-au-sol | refusé | retrait confirmé par l'utilisateur (lignes rotation / autres) |
| bird-dog-jambe-seule | plus-dur | bird-dog | rétabli | anti_rotation/anti_rotation, muscles communs |
| bird-dog-pause | plus-facile | bird-dog | rétabli | anti_rotation/anti_rotation, muscles communs |
| planche-bras-jambe-leves | plus-facile | planche | rétabli | anti_rotation/gainage, muscles communs |
| accroupi-profond-tenu | plus-facile | squat-assis-debout | refusé | famille de schéma différente (mobilite / squat) |
| etirement-flechisseurs-hanche | plus-dur | mobilite-hanches-90-90 | refusé | retrait confirmé par l'utilisateur (lignes rotation / autres) |
| rotation-bucheron | plus-facile | pallof-elastique | refusé | retrait confirmé par l'utilisateur (lignes rotation / autres) |
| retraction-omoplates | plus-dur | ecartement-serviette | refusé | retrait confirmé par l'utilisateur (lignes rotation / autres) |
| retraction-omoplates | plus-dur | rowing-elastique | refusé | retrait confirmé par l'utilisateur (lignes rotation / autres) |
| developpe-couche-prise-serree-barre | plus-facile | developpe-couche-barre | refusé | retrait confirmé par l'utilisateur (lignes rotation / autres) |
| souleve-de-terre-barre | plus-facile | souleve-de-terre-roumain-barre | refusé | même niveau et même matériel : pas plus accessible (relecteur 30/10/2026) |
| souleve-de-terre-barre | plus-facile | souleve-de-terre-roumain-halteres | rétabli | charniere/charniere, muscles communs |
| souleve-de-terre-roumain-barre | plus-facile | pont-fessier | refusé | autre qualité de mouvement, grand écart de niveau (avis coach 30/10/2026) |
| souleve-de-terre-roumain-barre | plus-dur | souleve-de-terre-barre | refusé | même niveau et même matériel : pas plus dur (relecteur 30/10/2026) |
| souleve-de-terre-sumo-barre | plus-facile | squat-sumo | refusé | famille de schéma différente (charniere / squat) |
| curl-ischios-ballon | plus-facile | pont-fessier-ballon | refusé | aucun muscle principal commun (ischios / fessiers) |
| curl-ischios-ballon | plus-facile | pont-fessier | refusé | aucun muscle principal commun (ischios / fessiers) |
| extension-dorsale-ballon | plus-facile | bird-dog | refusé | retrait confirmé par l'utilisateur (lignes rotation / autres) |
| extension-dorsale-ballon | plus-facile | pont-fessier | refusé | retrait confirmé par l'utilisateur (lignes rotation / autres) |
| lancer-bas-haut-mur | plus-facile | souleve-de-terre-roumain-halteres | refusé | lancer balistique : autre qualité de mouvement qu'un soulevé (avis coach 30/10/2026) |
| lancer-rotation-mur | plus-facile | pallof-elastique | refusé | retrait confirmé par l'utilisateur (lignes rotation / autres) |
| pont-fessier-ballon | plus-dur | curl-ischios-ballon | refusé | aucun muscle principal commun (fessiers / ischios) |
| porte-ballon-lest | plus-facile | marche-du-fermier | refusé | aucun muscle principal commun (abdominaux+transverse / avant_bras+trapezes) |
| porte-ballon-lest | plus-facile | porte-valise | refusé | aucun muscle principal commun (abdominaux+transverse / obliques+avant_bras) |
| rollout-ballon | plus-facile | dead-bug | rétabli | gainage/anti_rotation, muscles communs |
| rotation-assise-ballon-lest | plus-facile | pallof-elastique | refusé | retrait confirmé par l'utilisateur (lignes rotation / autres) |
| roue-abdos | plus-facile | dead-bug | refusé | saute deux marches (avis coach 30/10/2026) |
| squat-ballon-lest | plus-dur | squat-fendu | rétabli | squat/fente, muscles communs |
| squat-lancer-mur | plus-facile | lancer-poitrine-mur | refusé | famille de schéma différente (squat / poussee_h) et aucun muscle principal commun (quadriceps+fessiers / pectoraux) |
| squat-mur-ballon | plus-dur | squat-fendu | rétabli | squat/fente, muscles communs |
| porte-sac-berceau | plus-facile | porte-ballon-lest | rétabli | porte/porte, muscles communs |
| porte-sac-berceau | plus-facile | porte-sac-a-dos-devant | rétabli | porte/porte, muscles communs |
| souleve-de-terre-sac | plus-facile | souleve-de-terre-roumain-halteres | rétabli | charniere/charniere, muscles communs |
| squat-gilet-lest | plus-dur | squat-bulgare | rétabli | squat/fente, muscles communs |
| squat-sac-berceau | plus-dur | squat-bulgare | rétabli | squat/fente, muscles communs |
