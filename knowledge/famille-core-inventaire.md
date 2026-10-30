# Inventaire des fiches de core : famille proposée (CF1 à CF5)

Rédigé par `coach` le 30/10/2026 pour D26 (voir knowledge/core-et-supersets.md §1, CORE-FAM-1). Statut : **classement NON SOURCÉ (conception), cas douteux tranchés par `kine` (2e passage, 30/10/2026)** ; contrôle de `relecteur` en cours. Le développeur ajoutera l'attribut `famille_core` aux fiches ensuite ; ce fichier ne modifie aucune fiche. Aucun diagnostic, aucun nom de pathologie.

Périmètre : toutes les fiches de `knowledge/exercices/` (hors `ecartees/`) de schéma `gainage`, `anti_rotation` ou `rotation`, plus les fiches de flexion ou d'extension du tronc trouvées par recherche des muscles principaux (abdominaux, obliques, transverse, érecteurs du rachis, carré des lombes). Relevé du 30/10/2026 sur 228 fichiers .md : 25 fiches classées.

Valeurs de `famille_core` : `gainage` (CF1), `anti_rotation` (CF2), `rotation` (CF3), `flexion` (CF4), `extension` (CF5).

| id | schéma actuel | niveau_min | famille_core retenue | motif | décision (à trancher : tranché par le kiné) |
|---|---|---|---|---|---|
| planche | gainage | debutant | CF1 | maintien anti-extension | non |
| planche-ballon | gainage | intermediaire | CF1 | planche sur ballon, instabilité | non |
| planche-bosu | gainage | intermediaire | CF1 | planche sur plan instable | non |
| planche-cercles-ballon | gainage | intermediaire | CF1 | planche avec cercles du ballon, anti-extension dynamique | non |
| gainage-creux | gainage | debutant | CF1 | maintien du bas du dos plaqué, couché sur le dos (fiche à retirer en grossesse par sa ligne) | non |
| genoux-poitrine-ballon | gainage | intermediaire | CF1 | planche dynamique, genoux vers la poitrine, le tronc résiste à l'extension | non |
| roue-abdos | gainage | intermediaire | CF1 | anti-extension dynamique ; **restriction à coder par id** (retirée pour débutant, dos niveau 1 et plus) | non |
| rollout-ballon | gainage | intermediaire | CF1 | anti-extension dynamique ; même restriction que roue-abdos | non |
| planche-laterale | gainage | debutant | CF1 | maintien isométrique, pas de flexion répétée | **tranché par le kiné (2e passage) : CF1 définitive.** Dos niveau 1 : garder ; niveau 2 : sur genoux, 20 s au plus, `capped` ; niveau 3 : retirer. Grossesse/post-partum : retirée (G4) |
| planche-laterale-jambe-levee | gainage | intermediaire | CF1 | idem, plus difficile | **tranché : CF1 définitive.** Dos niveau 1 : adapter (variante planche-laterale) ; niveau 2 et 3 : retirer. Grossesse/post-partum : retirée |
| copenhague-court | gainage | intermediaire | aucune (hors famille core) | maintien latéral, muscle principal adducteurs (travail surtout de la hanche) | **tranché : HORS FAMILLE CORE** (`famille_core` absent). Travail surtout de la hanche : ne compte ni dans le plancher ni dans l'alternance de familles ; ne remplace jamais une fiche CF1 ; la ligne `aine` reste obligatoire ; dos niveau 2 et 3, grossesse et post-partum : retirer. Comme son schéma est `gainage`, `dev` doit l'exclure de l'emplacement `tronc` par id (sinon elle compterait à tort comme core) |
| bird-dog | anti_rotation | debutant | CF2 | le tronc résiste à la rotation ; son travail des érecteurs ne le classe pas en CF5 | non |
| bird-dog-jambe-seule | anti_rotation | debutant | CF2 | idem | non |
| dead-bug | anti_rotation | debutant | CF2 | couché sur le dos (retiré en grossesse par sa ligne) | non |
| dead-bug-jambes-seules | anti_rotation | debutant | CF2 | idem | non |
| pallof-elastique | anti_rotation | debutant | CF2 | anti-rotation à l'élastique | non |
| planche-bras-jambe-leves | anti_rotation | intermediaire | CF2 | planche avec appuis levés | non |
| planche-touche-epaule | anti_rotation | intermediaire | CF2 | planche, main à l'épaule opposée | non |
| rotation-bucheron | rotation | debutant | CF3 | rotation avec charge ; **niveau_min `debutant` en contradiction avec CORE-SEC-1** (le générateur doit exclure CF3 pour un débutant même si la fiche le permet) | non |
| bucheron-ballon-lest | rotation | debutant | CF3 | idem | non |
| rotation-assise-ballon-lest | rotation | intermediaire | CF3 | rotation chargée assise | non |
| rotation-russe | rotation | intermediaire | CF3 | rotation chargée (non proposée par défaut selon le kiné, §11 point 2) | non |
| lancer-rotation-mur | rotation | intermediaire | CF3 | lancer rotatif rapide (non proposé par défaut selon le kiné) | non |
| crunch-bicyclette | rotation | debutant | CF4 | flexion et rotation dynamiques ; **niveau_min `debutant`, statut `verifie`, en contradiction avec CORE-SEC-1** | **tranché : CF4 (flexion), avec les restrictions de CF3 en plus** (la plus restrictive prévaut). Retirée pour le débutant (donc `niveau_min` à relever à `intermediaire`, à faire par `dev`), en grossesse et post-partum, dès le dos niveau 1, et dans toute séance à charge lourde (CORE-ORD-4). Flexion et rotation rapides combinées : choix de prudence, NON SOURCÉ |
| extension-dorsale-ballon | charniere | intermediaire | CF5 | extension du tronc sur ballon, muscle principal érecteurs | **tranché : CF5, mais ne compte PAS dans le plancher de core** (schéma `charniere`, hors GG5). Elle suit les restrictions de CF5 : dos niveau 1 courte et lente sans lest, niveau 2 et 3 retirée ; retirée en grossesse et post-partum ; jamais en superset ; jamais après une charge lourde (CORE-ORD-4) |

Total : 25 fiches relevées, dont 5 étaient « à trancher » et l'ont été par le kiné (2e passage, colonne de droite) : **24 fiches ont une famille** (10 CF1, 7 CF2, 5 CF3, 1 CF4, 1 CF5) et **1 (copenhague-court) est hors famille core**. Parmi les 24, extension-dorsale-ballon (CF5) ne compte pas dans le plancher.

## Examinés et exclus
- Schéma `porte` (marche-gilet-lest, marche-sac-a-dos, porte-ballon-lest, porte-sac-a-dos-devant, porte-sac-berceau, porte-serveur, porte-un-haltere-epaule, porte-valise) : portés, hors famille de core (le tronc y travaille mais ils comptent dans l'emplacement `fonctionnel`, pas dans le plancher). Fiche écartée : porte-sac-epaule.
- Schéma `charniere` (souleve-de-terre-barre, souleve-de-terre-sac, good-morning-barre) : GG2, pas du core.
- Schéma `mobilite` (chat-vache, extension-thoracique, ouverture-livre-thoracique, rotation-thoracique-assise) : mobilité d'échauffement, ne compte pas dans le plancher (CORE-ORD-2).
- Schéma `cardio` (mountain-climbers) : cardio, pas du core.

## Décision du kiné, 2e passage (30/10/2026)
Les 5 fiches « à trancher » le sont (voir colonne de droite). `rotation-bucheron`, `bucheron-ballon-lest` et `crunch-bicyclette` : relever `niveau_min` à `intermediaire` (à faire par `dev`, aucune fiche modifiée ici) ; CORE-SEC-1 reste strict (aucune rotation pour un débutant), l'exclusion par famille restant en filet de sécurité. Assouplir pour la rotation au poids du corps n'est pas retenu : aucune source.

## Trous constatés
- **CF4 (flexion du tronc) : une seule fiche** (crunch-bicyclette, tranchée CF4 avec restrictions de CF3) (pas de relevé de buste court, pas de relevé de jambes, pas de flexion latérale dynamique).
- **CF5 (extension) : une seule fiche** (extension-dorsale-ballon, tranchée CF5 hors plancher ; pas d'extension au sol).
- Conséquence : le plancher de CORE-FREQ-2 est atteignable avec CF1 et CF2 seulement (17 fiches : 10 CF1 et 7 CF2), ce qui suffit au débutant et au dos niveau 2. Rédaction de fiches CF4 et CF5 : demande à `coach` si l'utilisateur veut ces familles disponibles.
