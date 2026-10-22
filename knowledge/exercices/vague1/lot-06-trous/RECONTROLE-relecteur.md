# Recontrôle `relecteur` du lot 06 (après corrections), le 22/10/2026

Recontrôle rapide à neuf, limité aux points de CONTROLE-relecteur.md. Rien n'a été corrigé. Lus : les fiches concernées (texte et différences depuis le premier contrôle), les 6 SVG retouchés ou créés (rendus dans un navigateur et regardés), `npm run check:fiches` (141 fiches, 0 erreur, 0 avertissement). Statuts de sources inchangés (PROVISOIRE pour free-exercise-db, NON SOURCÉ pour les choix de coach et de kine).

**Bilan : 0 bloquant restant, 1 à corriger restant (C1, texte), 1 nouveau à corriger, 3 nouveaux mineurs. Les 4 bloquants B1 à B4 sont levés.**

## Bloquants

| n° | Fiche | Résultat | Constat |
|---|---|---|---|
| B1 | releve-mollets-machine | OK | Photos passées à `non` (logo « Bodybuilding.com », règle 12), motif écrit. Illustration `releve-mollets-machine.svg` ajoutée, `affichable : oui` : 3 images (debout talons dans le vide, debout sur la pointe, assis talons levés) ; schématique mais fidèle aux deux variantes et aux consignes. |
| B2 | abduction-hanche-debout | OK | Les deux photos passées à `non` (photo 1 contredit la consigne ; photo 0 pieds croisés et logo). Les phrases « la photo montre… » sont retirées des points d'attention. Illustration SVG créée, `oui` : main sur le dossier, buste droit, jambe levée peu haut : conforme. |
| B3 | releve-mollets-halteres | OK | Échelon 2 : un seul haltère, l'autre main sur la rampe, « jamais deux haltères sur la marche » ; repris dans consigne 1, points d'attention et objets du quotidien. Conforme à regles-securite-communes.md §7. |
| B4 | marche-pointes-talons | OK | `Grossesse : retirer: remplacant:releve-tibial-assis` ; motif G4 écrit ; le remplaçant existe (variante de releve-tibial-mur, dont la ligne Grossesse est « garder ») ; le script accepte. Choix prudent marqué NON SOURCÉ. |

## À corriger

| n° | Fiche | Résultat | Constat |
|---|---|---|---|
| C1 | tirage-vertical-allonge-ventre | PAS OK (texte, reste à corriger) | La variante est corrigée (serviette pliée ou coussin plat). Mais deux phrases gardent l'ancienne version : note `epaule-n2` « front posé sur les mains » et point d'attention « Front posé sur le dos des mains » (lignes 63 et 74). Même contradiction que celle signalée. À remplacer par « serviette pliée ». |
| C2 | tirage-vertical-allonge-ventre | OK (réserve légère) | La poitrine reste au sol et les coudes vont vers les côtes, légende non coupée : plus de contradiction avec la consigne. Reste peu lisible : figure très plate et petite en bas du cadre, la moitié du cadre est vide, les bras se distinguent mal (voir N2). Fiable, pas trompeuse. |
| C3 | tirage-vertical-serviette | OK | Panneau gauche : bras levés et tendus, serviette tendue au-dessus de la tête, mains pas derrière la nuque. Panneau droit : mains devant la poitrine, coudes bas, flèche vers le bas. Légendes entières. |
| C4 | releve-tibial-mur | OK | Consigne 2 scindée assis / debout ; point d'attention et signes d'arrêt séparés assis / debout. |
| C5 | marche-pointes-talons | OK | `tibial_anterieur` dans les muscles principaux (muscle autorisé), remarque obsolète retirée et marquée NON SOURCÉ ; demi-tour pieds à plat dans la variante, la consigne 5, les points d'attention et les signes d'arrêt. |
| C6 | abduction-hanche-debout | OK | Écarts avec `Side_Leg_Raises` écrits dans la ligne de source ; la partie divergente est NON SOURCÉ. |
| C7 | abduction-hanche-debout | OK | Mini-bande limitée au-dessus des genoux, « jamais aux chevilles », dans la variante, les points d'attention, la ligne de source et la case cheville-n2. |
| C8 | abduction-couchee-cote | OK | Jambe du dessous dessinée pliée (pied revenu vers le sol) ; jambe du dessus levée d'environ 25 degrés, flèche courte : cohérent avec « peu haut ». Figure petite en bas du cadre mais lisible. |
| C9 | clam-coquille | OK (par retrait) | Illustration passée à `affichable : non` : la fiche n'a donc aucune image affichable et ne peut pas être `utilisable`. Reste `complete_kine`. |
| C10 | abduction-hanche-poulie | OK | Une main sur le montant dessinée dans les deux panneaux, sangle reliée à la poulie basse, jambe levée côté opposé au câble, légendes entières. |
| C11 | releve-mollets-assis | OK | Phrase sur le soléaire marquée « NON SOURCÉ, explication de coach ». |
| C12 | abduction-couchee-cote | OK | Phrase sur le fléchisseur de hanche marquée NON SOURCÉ. |

## Mineurs d'origine

| n° | Résultat |
|---|---|
| M1 (README périmé) | PAS OK : le tableau du README dit encore « illustration à créer » pour les 14 fiches (tirage-vertical-allonge-ventre, etc., alors que les SVG existent). À mettre à jour. Les 3 questions à l'utilisateur sont toujours ouvertes. |
| M2 (légendes SVG) | OK sur les 6 SVG revus : légendes entières. Les autres (clam, quatre-pattes) non revus. |
| M8 (écarts de source des mollets) | OK : écarts écrits dans releve-mollets-halteres (planche de 5 à 7 cm) et releve-mollets-assis (bloc, une jambe). |
| M3, M4, M5, M6, M7, M9, M10 | Non repris dans les corrections (non demandé) : toujours valables, non bloquants. M9 : photos abduction-hanche-debout passées à `non`, donc plus de logo à afficher. |

## Nouveaux problèmes

| n° | Gravité | Fiche | Problème |
|---|---|---|---|
| N1 | à corriger | releve-mollets-halteres | Note Grossesse : « une main au mur obligatoire… donc un seul haltère », mais la case est `adapter: variante:releve-mollets-halteres-sol`, dont l'installation dit « un haltère dans chaque main… une main sur un mur si besoin ». Le générateur n'appliquera pas la note : une femme enceinte pourrait se voir proposer deux haltères sans mur. À rendre cohérent (variante ou texte), par `kine`. Risque de chute faible, pas bloquant. |
| N2 | mineur | tirage-vertical-allonge-ventre | Illustration : pose à plat petite, lisible surtout grâce aux légendes ; dans le panneau gauche les bras tendus devant se distinguent à peine. |
| N3 | mineur | tirage-vertical-allonge-ventre | Le README indique encore la variante « front posé (1) » sans la précision serviette (voir M1). |
| N4 | mineur | releve-mollets-machine | L'illustration ne montre pas les genoux « non verrouillés » ni les coussins de façon fidèle à tous les modèles de machine ; schématique, non trompeuse. |

## Statut proposé par fiche

Règle : `utilisable` si 0 bloquant, image affichable fiable, réserves limitées à des choix prudents NON SOURCÉ ; sinon `complete_kine`.

| Fiche | Statut proposé | Motif |
|---|---|---|
| tirage-vertical-allonge-ventre | utilisable après correction de C1 (texte seul) | 0 bloquant ; image fiable (peu lisible, N2) |
| tirage-vertical-serviette | utilisable | 0 bloquant ; image fiable (C3 levé) |
| releve-mollets-assis | utilisable | 0 bloquant ; image fiable ; C11 levé |
| releve-tibial-mur | utilisable | 0 bloquant ; image fiable ; C4 levé |
| marche-pointes-talons | utilisable | B4 et C5 levés ; image existante non modifiée, `oui` |
| releve-mollets-halteres | complete_kine | N1 (note Grossesse sans effet codé) ; à rétablir en `utilisable` après correction |
| releve-mollets-machine | utilisable | B1 levé ; illustration fiable ; photos exclues |
| abduction-couchee-cote | utilisable | C8 et C12 levés ; image fiable |
| clam-coquille | complete_kine | `affichable : non`, aucune image : ne peut pas être `utilisable` |
| abduction-hanche-debout | utilisable | B2, C6, C7 levés ; illustration fiable |
| abduction-quatre-pattes | utilisable | inchangé (premier contrôle) |
| marche-laterale-poids-du-corps | utilisable | inchangé (premier contrôle) |
| abduction-hanche-poulie | utilisable | C10 levé ; image fiable ; sangle de cheville : tag `poulie` non précis (M6, non bloquant) |
| abduction-hanche-machine | utilisable | inchangé (premier contrôle) |

Rien n'est validé tant qu'il reste un point bloquant : il n'en reste aucun. À corriger avant de passer les statuts : C1 (2 phrases), N1, et mise à jour du README (M1).
