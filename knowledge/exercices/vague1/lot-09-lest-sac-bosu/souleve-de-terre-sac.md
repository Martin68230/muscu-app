---
id: souleve-de-terre-sac
nom: Soulevé de terre avec un sac de sable
alias: [sandbag deadlift]
schema: charniere
type: force
niveau_min: intermediaire
muscles_principaux: [fessiers, ischios, erecteurs_rachis]
muscles_secondaires: [quadriceps, trapezes, avant_bras, abdominaux]
source_brouillon: []
statut: utilisable
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile ; les variantes qui ne changent que le matériel ou la prise gardent le même échelon. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| sdt-sac-chaise | Sac posé sur une chaise (départ plus haut) | 1 | intermediaire | sac_de_sable, chaise, mur | Sac posé sur l'assise d'une chaise solide dont le dossier est calé contre un mur ; tu le prends par les poignées ou dans les bras, serré contre toi. |
| sdt-sac-sol | Sac posé au sol | 2 | intermediaire | sac_de_sable, tapis | Sac au sol devant les pieds ; tu le prends par les poignées ou dans les bras, serré contre toi. |

## Consignes
1. Choisis un sac que tu peux soulever sans arrondir le dos ni prendre d'élan ; sinon, il est trop lourd pour cette fiche.
2. Pieds écartés de la largeur des hanches, sac contre tes jambes, genoux fléchis, dos plat, poitrine ouverte, regard devant.
3. Serre le sac contre toi, puis pousse sur les pieds pour te redresser jusqu'à être debout, hanches et genoux tendus, sans te cambrer en haut.
4. Redescends en poussant les hanches en arrière, le sac glissant le long des cuisses, dos plat, jusqu'à poser le sac.
5. Pose le sac, souffle, recommence. Respire sans bloquer : inspire en bas, souffle en montant. Pas de rebond du sac au sol.

## Points d'attention
- Soulevé de terre : le dos reste plat du début à la fin ; s'il s'arrondit, la série s'arrête et le sac est trop lourd.
- Le sac reste contre tes jambes : un sac loin devant fait un levier long sur le bas du dos.
- Le sac n'est ni lancé, ni jeté en haut ; on le pose, sans rebond.
- Un sac de sable plie et se déforme : tiens-le fermement, par les poignées si possible.
- Aucune valeur chiffrée propre à ce mouvement (aucune source) : voir program-logic.md, load-calibration.md et generateur-v1.md.

## Erreurs fréquentes
- Dos qui s'arrondit.
- Sac loin devant les jambes.
- Cambrer en haut.
- Prendre un élan.
- Laisser tomber le sac.

## Progression / régression
- plus-facile : pont-fessier, souleve-de-terre-roumain-halteres
- plus-dur : sdt-sac-sol

## Repères de dosage
Repères du générateur (generateur-v1.md §3.2, règle V-DOSE ; ACSM 2026 : 2 à 3 séries par exercice) : le tag `sac_de_sable` n'est pas dans la liste « chargeable » de src/generator/config.ts : le générateur traite donc ces fiches comme du poids du corps (10 à 15 répétitions, 2 séries, 3 pour un intermédiaire en « muscle », réserve cible 2 à 3, jamais 0, repos 90 s) ; point à confirmer par `dev` (voir README du lot). Ces valeurs viennent du tableau du générateur, pas d'une étude sur ce mouvement. **Le sac est une charge fixe** : l'app ne connaît pas son poids et ne peut pas choisir une charge d'étalonnage comme avec des haltères. Étalonnage (load-calibration.md) : première séance, une série d'essai ; si tu ne tiens pas 10 répétitions propres avec 2 à 3 en réserve, le sac est trop lourd : prends un sac plus léger ou la variante sans sac (voir Progression). Progression : double progression sans changer le sac (d'abord les répétitions dans la fourchette, puis l'échelon suivant) ; changer de sac est ton choix, un petit palier à la fois (NON SOURCÉ). Zone au niveau 2 : aucune hausse (R2). **Plafond de prudence pour l'utilisateur seul (NON SOURCÉ)** : pas de série jusqu'à l'échec ; fin de série quand la technique se dégrade.

## Sécurité et contre-indications
Rédigé par `coach` le 2026-10-24 (sécurité reprise par `kine` le 2026-10-25, à contrôler par `relecteur` lancé à neuf). Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Tous les choix par zone et par niveau sont des choix prudents NON SOURCÉS (aucune étude ne teste « zone x niveau » ni ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder) ; départage de deux variantes différentes : voir regles-securite-communes.md §0. Niveau 2 : aucune augmentation de charge ni de difficulté (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: variante:sdt-sac-chaise | retirer: remplacant:pont-fessier | retirer |
| Hanche | garder | retirer: remplacant:pont-fessier | retirer |
| Genou | garder | retirer: remplacant:pont-fessier | retirer |
| Cheville | garder | adapter: amplitude:reduite | retirer |
| Poignet | garder | adapter: charge:legere | retirer |
| Cou | garder | adapter: amplitude:tete-alignee | retirer |
| Cuisse | adapter: amplitude:reduite | retirer | retirer |
| Aine | garder | adapter: amplitude:reduite | retirer |

**Notes**
- general : règle unique de la charge fixe (choix de kine, NON SOURCÉ) : le sac ne s'allège pas par l'app ; dès une gêne nette (niveau 2) au dos, à la hanche ou au genou, le soulevé est retiré (remplaçant : pont fessier sans charge, qui a ses propres lignes : s'il est lui-même adapté par le profil, le générateur ne le propose que dans sa version adaptée, sinon il choisit un autre exercice de charnière sans charge). La cheville réduit seulement la descente ; le poignet et le cou gardent le sac le plus léger.
- dos-n1 : départ depuis la chaise (course plus courte) ; choix prudent, NON SOURCÉ.
- dos-n2 : retiré : le pont fessier sans charge remplace.
- hanche-n2 : retiré (règle unique).
- genou-n2 : retiré (règle unique).
- cheville-n2 : descente réduite (départ depuis la chaise), aucune hausse.
- cuisse-n1 : ischios principaux : descente moins profonde dès la gêne légère ; choix prudent, extrapolation de regles-securite-communes.md §0 (NON SOURCÉ).
- cuisse-n2 : retiré.
- grossesse : retiré : sac lourd, charge fixe, flexion du tronc avec le ventre ; remplacé par le soulevé de terre roumain aux haltères à charge légère. Post-partum : G7.

**Grossesse** : retirer: remplacant:souleve-de-terre-roumain-halteres
**Version plus douce** : souleve-de-terre-roumain-halteres

**Sécurité pour l'utilisateur seul**
- Sol plat, non glissant, chaussures fermées à semelle plate ; chaise calée si tu l'utilises ; espace libre autour de toi (NON SOURCÉ).
- Sortie de secours, à chaque série : si le dos s'arrondit, si le sac glisse ou t'entraîne en avant, ouvre les mains et laisse le sac tomber devant toi, un peu sur le côté (pas sur tes pieds), pieds écartés ; reste debout ou pose les mains sur les cuisses ; ne tente jamais de le rattraper en te penchant. Un sac de sable souple et fermé se laisse tomber (NON SOURCÉ).
- Première fois : le sac le plus léger que tu as, depuis la chaise ; si tu ne peux pas faire 5 répétitions dos plat et sans élan, il est trop lourd (NON SOURCÉ).
- Pas d'échec : arrête la série avec au moins 2 répétitions en réserve.
- Quelqu'un dans la maison, à portée de voix, de préférence.

**Points d'attention (kine)**
- Dos : soulevé avec charge fixe ; dès la gêne légère, départ plus haut (chaise) ; dès la gêne nette, retiré (NON SOURCÉ). Hanche, genou : retiré dès la gêne nette (règle unique).
- Cuisse : ischios principaux ; dès la gêne légère, descente plus courte ; dès la gêne nette, retiré.
- Niveau intermédiaire : comme le soulevé de terre à la barre (Q14) ; le débutant fait le soulevé de terre roumain aux haltères.
- Grossesse et post-partum : retiré ; en post-partum, fuite d'urine ou pesanteur dans le bas-ventre : arrêt et avis de la sage-femme (G7).

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) au bas du dos, à la hanche, à l'arrière de la cuisse ou au poignet.
- Dos qui s'arrondit : arrête et pose le sac.
- Sac qui glisse des mains : pose-le et arrête.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.
- Picotements, engourdissement ou faiblesse dans un bras ou une jambe : arrête.

**Objets du quotidien**
- Sac de sable : fermé par une couture solide ou une fermeture à glissière doublée, sans fuite de sable, avec des poignées si possible ; le poids est connu (pesé) et assez léger pour rester maîtrisable (le poids n'est pas connu de l'app, NON SOURCÉ).
- Sol plat, sec, non glissant ; chaussures fermées à semelle plate ; espace libre sur tout le trajet, rien de fragile ni de dur à portée du sac (NON SOURCÉ).
- Ici le sac n'est ni lancé, ni rattrapé, ni jeté en l'air : il se porte, il se pose.

## Photo
- aucune photo
- illustration : public/illustrations/souleve-de-terre-sac.svg : affichable : oui (illustration originale de l'app)
- légende : Variante sac posé sur une chaise (départ plus haut). Au sol : même geste, départ plus bas.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste de base (installation, consignes de départ) | free-exercise-db : aucune entrée de soulevé de terre avec sac de sable (dist/exercises.json, vérifié le 2026-10-24) ; geste décrit par coach d'après la pratique courante ; voir souleve-de-terre-roumain-halteres du dépôt | pratique (pas une étude) | 2026-10-24 | NON SOURCÉ |
| Sac de sable : charge lourde, instable, qui se déplace dans le sac ; la fiche free-exercise-db Sandbag_Load est un exercice d'épreuve de force (charger une plateforme), pas ces gestes ; aucune étude lue sur ces exercices avec un sac | free-exercise-db Sandbag_Load (beginner, other), vérifié dans dist/exercises.json le 2026-10-24 : texte « les sacs de sable sont extrêmement difficiles à saisir », mise sur l'épaule « généralement interdite » dans l'épreuve | descriptif de base de données (pas une étude) | 2026-10-24 | NON SOURCÉ (aucune étude sur l'exercice ; le descriptif sert seulement à justifier la prudence) |
| Échelons, niveaux, muscles principaux et secondaires, variantes guidées | choix de coach | - | 2026-10-24 | NON SOURCÉ |
| Sac de sable (solidité, poids connu, poignées), chaise, sol | pratique de salle et raisonnement de coach ; aucune notice de fabricant lue | - | 2026-10-24 | NON SOURCÉ |
| Pas de série menée jusqu'à l'échec en pratique libre seul | ACSM Position Stand 2026 (Currier et coll., Med Sci Sports Exerc 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823) : l'échec n'est pas nécessaire en moyenne ; référence du dépôt, non rouverte pour ce lot. L'interdiction de l'échec seul est une règle de sécurité de coach | revue de revues ACSM (OK) ; la règle de sécurité n'est pas une conclusion de l'étude | 2026-10-24 | OK pour « l'échec n'est pas nécessaire » (ACSM) ; NON SOURCÉ pour la règle de sécurité |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-24 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, grossesse et version plus douce : propositions de coach (prudence) | extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-24 | NON SOURCÉ (repris par kine le 2026-10-25, à contrôler par relecteur) |
| Grossesse et post-partum : sac de sable retiré (charge fixe et lourde, qu'on ne peut pas alléger ; sac contre le ventre) ; remplacé par le soulevé de terre roumain aux haltères à charge légère | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-24 | principe (éviter isométrique prolongé, Valsalva, chute, couché sur le dos) : OK ; classement de cette fiche : NON SOURCÉ (extrapolation de coach) |
