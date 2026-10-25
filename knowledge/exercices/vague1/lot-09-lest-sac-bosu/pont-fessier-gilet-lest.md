---
id: pont-fessier-gilet-lest
nom: Pont fessier avec un gilet lesté
alias: [weighted vest glute bridge, pont fessier lesté]
schema: charniere
type: force
niveau_min: intermediaire
muscles_principaux: [fessiers]
muscles_secondaires: [ischios, erecteurs_rachis, abdominaux]
source_brouillon: []
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| pont-gilet-lest-sol | Gilet lesté, deux pieds au sol | 1 | intermediaire | lest, tapis | Allongé sur le dos, genoux pliés, pieds à plat, gilet lesté serré et à plat sur le buste. |
| pont-gilet-lest-pause | Gilet lesté, arrêt de 2 secondes en haut | 2 | intermediaire | lest, tapis | Même pont, tenu 2 secondes en haut, descente lente. |
| pont-gilet-lest-une-jambe | Gilet lesté, une jambe | 3 | avance | lest, tapis | Une jambe tendue en l'air, bassin à l'horizontale, gilet lesté serré. |

## Consignes
1. Enfile le gilet à plat, serré ; allonge-toi sur le dos, genoux pliés, pieds à plat écartés de la largeur du bassin.
2. Serre les fessiers et le ventre, puis monte le bassin jusqu'à ce que épaules, hanches et genoux soient alignés.
3. Garde le menton légèrement rentré et la nuque détendue ; ne cambre pas le bas du dos.
4. Redescends lentement, le bassin presque au sol, sans te laisser tomber.
5. Respire sans bloquer : souffle en montant. Si le gilet gêne ta respiration à plat, retire-le.

## Points d'attention
- Le gilet repose sur le buste : sa charge pèse moins sur les hanches qu'un haltère sur le bassin ; l'exercice reste surtout modéré.
- Montée jusqu'à l'alignement, pas plus haut : un bassin trop haut cambre le dos.
- Les talons restent au sol ; les genoux ne s'écartent ni ne rentrent.
- Allongé sur le dos avec un gilet : jamais si la respiration est gênée.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Cambrer le bas du dos en haut.
- Pousser sur les orteils.
- Genoux qui rentrent.
- Se laisser tomber en bas.
- Nuque qui force.

## Progression / régression
- plus-facile : pont-fessier, pont-fessier-une-jambe
- plus-dur : pont-gilet-lest-pause, pont-gilet-lest-une-jambe

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE ; ACSM 2026 : 2 à 3 séries par exercice) : le tag `lest` est dans la liste « chargeable » : 8 à 12 répétitions en « muscle » (intermédiaire et avancé), 10 à 15 en « santé », 4 à 6 sur un pilier en « force » ; 2 à 3 séries ; réserve cible 2 à 3, jamais 0 ; repos 90 s (120 à 180 s pour un pilier). Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. **Le gilet est une charge fixe** : l'app ne connaît pas son poids (le profil n'a pas de champ pour lui, Q26) et ne peut pas choisir une charge d'étalonnage comme avec des haltères. Étalonnage (load-calibration.md) : première séance, une série d'essai ; si tu ne tiens pas le bas de la fourchette avec 2 à 3 répétitions en réserve, le gilet est trop lourd pour toi sur cet exercice : prends la variante plus facile sans gilet (voir Progression). **Progression d'une charge fixe** : double progression sans changer le gilet : (1) tu ajoutes des répétitions dans la fourchette ; (2) quand toutes les séries atteignent le haut de la fourchette à la réserve visée, tu passes à l'échelon suivant de la fiche ; (3) si ton gilet a des lests amovibles, un seul palier à la fois, décidé par toi, hors du contrôle de l'app (NON SOURCÉ). Zone au niveau 2 : aucune hausse (R2). La variante à une jambe se compte par jambe. **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24 (sécurité reprise par `kine` le 2026-10-25, à contrôler par `relecteur` lancé à neuf). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: amplitude:reduite | retirer: remplacant:pont-fessier | retirer |
| Hanche | adapter: variante:pont-gilet-lest-sol | retirer: remplacant:pont-fessier | retirer |
| Genou | adapter: variante:pont-gilet-lest-sol | retirer: remplacant:pont-fessier | retirer |
| Cuisse | adapter: variante:pont-gilet-lest-sol | retirer: remplacant:pont-fessier | retirer |
| Cou | adapter: amplitude:tete-alignee | adapter: amplitude:tete-alignee | retirer |

**Notes**
- dos-n1 : montée jusqu'à l'alignement seulement, sans cambrer ; choix prudent, NON SOURCÉ.
- general : règle unique du gilet (choix de kine, NON SOURCÉ) : le poids du gilet ne s'allège pas ; dès une gêne nette (niveau 2) au dos, à la hanche, au genou ou à l'arrière de la cuisse, le gilet est retiré (pont fessier sans charge). Dès la gêne légère à la hanche, au genou ou à la cuisse, pas de variante à une jambe : deux pieds au sol. Le remplaçant pont-fessier a ses propres lignes par zone : s'il est lui-même adapté par le profil, le générateur ne le propose que dans sa version adaptée.
- dos-n2 : gilet retiré : pont fessier sans charge.
- hanche-n1 : deux pieds au sol, pas de variante à une jambe.
- hanche-n2 : gilet retiré.
- genou-n1 : deux pieds au sol, pas de variante à une jambe.
- genou-n2 : gilet retiré.
- cuisse-n1 : deux pieds au sol, pas de variante à une jambe.
- cuisse-n2 : gilet retiré (pont sans charge) ; choix prudent, extrapolation de regles-securite-communes.md §0 (NON SOURCÉ).
- grossesse : retiré : couché sur le dos avec une charge sur le buste ; remplacé par le soulevé de terre roumain aux haltères à charge légère (comme pont-fessier). Post-partum : G7.

**Grossesse** : retirer: remplacant:souleve-de-terre-roumain-halteres
**Version plus douce** : pont-fessier

**Sécurité pour l'utilisateur seul**
- Tapis ferme, sol non glissant ; rien autour de toi sur lequel te cogner (NON SOURCÉ).
- Sortie de secours : si tu n'arrives plus à tenir le haut, si le dos tire ou si une crampe arrive derrière la cuisse, redescends lentement le bassin au sol (rien à lâcher : le gilet reste sur toi), puis roule sur le côté et retire le gilet. Variante à une jambe : si le bassin bascule d'un côté, repose le pied en l'air au sol avant de redescendre. Si tu es mal (étourdissement, serrement de poitrine), arrête, retire le gilet, reste allongé puis assieds-toi lentement (NON SOURCÉ).
- Première fois : le lest le plus léger du gilet ; jamais plus lourd que ce que tu tiens avec 2 à 3 répétitions en réserve (NON SOURCÉ).
- Gilet à plat sur le buste : s'il appuie sur la gorge ou la poitrine, retire-le.
- Pas d'échec : arrête la série avec au moins 2 répétitions en réserve.

**Points d'attention (kine)**
- Dos : montée courte dès la gêne légère ; dès la gêne nette, sans gilet. Hanche, genou, cuisse : deux pieds au sol dès la gêne légère, sans gilet dès la gêne nette (règle unique, NON SOURCÉ).
- Cou : nuque détendue, menton rentré ; la charge sur le buste ne tire pas sur le cou.
- Niveau intermédiaire : charge fixe sur le buste, allongé ; le débutant fait le pont fessier sans charge ; la variante à une jambe est avancée (choix de coach, NON SOURCÉ).
- Grossesse et post-partum : retiré (couché sur le dos, charge sur le buste) ; en post-partum, fuite d'urine ou pesanteur dans le bas-ventre : arrêt et avis de la sage-femme (G7).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) au bas du dos, à la hanche, au genou ou au cou.
- Crampe à l'arrière de la cuisse : redescends et arrête la série.
- Respiration gênée par le gilet : retire-le.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe : arrête.

**Objets du quotidien**
- Gilet lesté : bien ajusté et fermé, lests calés dans leurs poches (rien qui ballotte), sans déchirure ni fermeture usée ; il se retire d'un geste (apprends à l'ouvrir avant la première série) ; le poids exact est celui que tu connais (l'app ne le connaît pas, NON SOURCÉ).
- Sol plat, sec, non glissant ; chaussures fermées à semelle plate ; espace libre autour de toi (NON SOURCÉ).

## Photo
- `Butt_Lift_Bridge/0.jpg` : affichable : non (pont fessier sans gilet : la fiche porte sur le gilet à plat sur le buste, que la photo ne montre pas)
- `Butt_Lift_Bridge/1.jpg` : affichable : non (idem)
- illustration : public/illustrations/pont-fessier-gilet-lest.svg : affichable : oui (illustration originale de l'app)
- légende : Variante deux pieds au sol. Avec arrêt en haut ou sur une jambe : même pont.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, consignes de départ) | free-exercise-db Butt_Lift_Bridge (beginner, body only) pour le geste sans gilet ; aucune entrée avec gilet (dist/exercises.json, vérifié le 2026-10-24) ; voir pont-fessier du dépôt | pratique (pas une étude) | 2026-10-24 | NON SOURCÉ |
| Gilet lesté : charge portée sur le tronc, utilisable avec des exercices simples ; seule étude lue : gilet + sauts chez des femmes ménopausées (public et geste différents de cette fiche : aucune étude lue sur cet exercice précis) | Snow, Shaw, Winters, Witzke, « Long-term exercise using weighted vests prevents hip bone loss in postmenopausal women », J Gerontol A Biol Sci Med Sci 2000;55(9):M489-M491, PMID 10995045 : 18 femmes ménopausées (9 avec gilet lesté et sauts, 9 témoins), 5 ans, densité osseuse de la hanche maintenue dans le groupe gilet + sauts ; résumé Europe PMC lu | étude contrôlée de petite taille (18 femmes), public différent | 2026-10-24 | PROVISOIRE (résumé seulement ; contexte, ne valide pas la fiche) |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Gilet lesté (poids, ajustement), tapis, sol | pratique de salle et raisonnement de coach ; aucune notice de fabricant lue | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; référence du dépôt, non rouverte pour ce lot. L'interdiction de l'échec seul est une règle de sécurité de coach | revue de revues ACSM (OK) ; la règle de sécurité n'est pas une conclusion de l'étude | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; NON SOURCÉ pour la règle de sécurité |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 2026-10-25, à contrôler par relecteur) |
| Grossesse et post-partum : gilet lesté retiré (charge fixe qu'on ne peut pas alléger, poids sur le ventre et la poitrine) ; remplacé par le soulevé de terre roumain aux haltères à charge légère (sans gilet) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe (éviter isométrique prolongé, Valsalva, chute, couché sur le dos) : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach) |
