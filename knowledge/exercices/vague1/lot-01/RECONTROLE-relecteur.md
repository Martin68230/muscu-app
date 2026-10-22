# Recontrôle rapide `relecteur` du lot 01 (vague 1), 22/10/2026 (décision D2)

Lancé à neuf. Je n'ai corrigé aucune fiche et changé aucun statut. Périmètre : seulement les points du premier contrôle (CONTROLE-relecteur.md) et du journal « Corrections coach » du README, plus les valeurs des fiches pilote citées (pompe-ecartee, pompe-archer, pompe, planche, planche-laterale, porte-valise, dead-bug, regles-securite-communes §0).
`npm run check:fiches` : 102 fiches, 0 erreur, 0 avertissement.
Décisions utilisateur prises en compte : D4 (questions du lot-01 : choix prudents conservés) et D5 (fond validé le 22/10/2026 ; ne lève pas un bloquant de sécurité).

## Synthèse
- Les 3 bloquants du premier contrôle sont résolus. Aucun nouveau bloquant.
- Tous les points « à corriger » sont résolus, sauf un point résiduel non bloquant (R-1 ci-dessous) et deux remarques de texte obsolète.
- Les 21 fiches ont 0 bloquant. Les fiches non citées ci-dessous n'avaient aucun point à recontrôler.

## Points recontrôlés
| Point | Résolu | Fiche | Constat |
|---|---|---|---|
| R9 (ne jamais lâcher au-dessus de la tête, conduite si glissement, espace, plafond) | oui | developpe-epaules-sac-a-dos | présent dans Points d'attention, Signes d'arrêt, Objets du quotidien ; ligne R9 NON SOURCÉ ajoutée |
| Niveau débutant et « sac léger » | oui | developpe-epaules-sac-a-dos | niveau_min et variante en `intermediaire`, consigne 1 « sac léger, de poids connu » |
| Grossesse debout contraire à G4 | oui | developpe-epaules-sac-a-dos | `retirer: remplacant:developpe-epaules-elastique-assis` (la variante existe, assise) |
| Décision utilisateur sur la fiche (Q1) | oui | pompe-equilibre-mur | D4 : choix prudent conservé ; cou retiré dès n1, grossesse retirée |
| Moins restrictif que la fiche plus facile (épaule n1, poignet n1) | oui | pompe-equilibre-mur | maintenant `retirer: remplacant:pompe-chaise` aux deux ; plus prudent que pompe-piquee-pieds-sureleves ; pompe-chaise n'est pas adaptée à ces niveaux (pilote pompe : garder à l'épaule n1, variante pompe-chaise au poignet) |
| Procédure de sortie (bras qui flanche, chute) | oui | pompe-equilibre-mur | ajoutée aux Signes d'arrêt (fléchir en contrôle, redescendre les pieds un par un, jamais sur la tête, genoux au sol) et avant la première série |
| Note epaule-n1 / coude-n1 non codée | oui | pompe-equilibre-mur | notes alignées sur les cases |
| Contradiction avec pompe-archer, n1 épaule/coude/poignet/dos | oui | pompe-un-bras | `retirer: remplacant:pompe-ecartee` en n1 pour les 4 zones ; pompe-ecartee est seulement adaptée (pas retirée) dans ces cas |
| Remplaçant retiré par le profil (pompe-archer à l'épaule n2) | oui | pompe-un-bras | remplacé par pompe-chaise (pompe, épaule/dos n2 : c'est la variante elle-même) |
| Notes « descente moins profonde » non codées | oui | pompe-un-bras | notes réécrites |
| Chaise : test de l'appui d'une main, dossier côté opposé | oui | pompe-un-bras | présent dans Objets du quotidien |
| Note hanche-n2 « petite amplitude » non codée | oui | bird-dog-pause | note = « bird dog classique, sans pause » |
| Note general ambiguë | oui | bird-dog-pause | reformulée, lisible |
| Source gainage-creux : décision (Q5) | oui, avec réserve de texte | gainage-creux | D4/D5 : choix conservé et fond validé par l'utilisateur ; mais la ligne Sources dit encore « en attente… sinon hors générateur » (voir T-1) |
| Position des bras dans les consignes (échelon 2) | oui | gainage-creux | consigne 3 : « bras tendus derrière la tête » |
| Niveau échelon 2 « à confirmer » | oui (D5) | gainage-creux | la mention « à confirmer » est restée dans la fiche (T-1) |
| Contradiction dos n2 / genou n1 | oui | pallof-elastique | dos n2 = `adapter: charge:legere`, plus de variante concurrente |
| Note epaule-n1 (règle R2 du niveau 2) | oui | pallof-elastique | note = amplitude réduite |
| Source Pallof_Press à la poulie, version élastique | oui | pallof-elastique | PROVISOIRE limité à la poulie ; version élastique NON SOURCÉ |
| C1 deux lignes contradictoires d'ancrage de porte | oui | pallof-elastique | une seule ligne PROVISOIRE limitée à la notice Serious Steel + ligne NON SOURCÉ distincte pour le contrôle de l'élastique |
| Coude n1/n2 moins restrictif que planche (pilote) | oui | planche-bras-jambe-leves | coude n1 `appui:serviette`, n2 `variante:planche-genoux` (= pilote) |
| Zone cou manquante | oui | planche-bras-jambe-leves | ligne Cou ajoutée (n1 tête alignée, n2 planche-genoux) |
| Photo « non » justifiée par une image non vue | oui | planche-bras-jambe-leves, planche-laterale-jambe-levee | passées à « à vérifier » (non affichées) |
| Source Side_Bridge sans instruction | oui | planche-laterale-jambe-levee | ligne passée NON SOURCÉ, description renvoyée au pilote |
| Cases moins restrictives que planche-laterale | oui | planche-laterale-jambe-levee | épaule n1 genoux, coude n2 genoux, hanche n2 genoux |
| Note hanche-n2 hors case | oui | planche-laterale-jambe-levee | note = remplacé par la planche latérale sur le genou |
| Remplaçant épaule n2 retiré (planche-laterale) | oui sur le fond, voir R-1 | planche-laterale-jambe-levee | remplaçant = dead-bug, note qui explique le choix |
| Incident « poser tout de suite » contraire à R9 | oui | porte-serveur | Signes d'arrêt : ramener contre l'épaule en contrôlant, puis poser |
| Remplaçant dos n2 (porte-un-haltere-epaule retiré) | oui sur le fond, voir R-1 | porte-serveur | case et note = porte-valise |
| « une seconde » sans durée sourcée | oui | ecartement-elastique | « un instant » |
| Renvoi vers fiche invisible | oui | rowing-sac-a-dos | précaution du dos recopiée dans Points d'attention |

## Points restants (aucun bloquant)
- **R-1 (à corriger, faible)** : le générateur applique la règle de regles-securite-communes §0 (un remplaçant lui-même adapté ou retiré par le profil actif n'est jamais proposé). Or `dead-bug` est adapté à l'épaule n2 (`amplitude:jambes-seules`, pilote) et `porte-valise` est adapté au dos n2 (`variante:marche-du-fermier`, pilote). Pour planche-bras-jambe-leves (épaule n2), planche-laterale-jambe-levee (épaule n2) et porte-serveur (dos n2), le remplaçant nommé ne sera donc pas proposé et l'app choisira un autre exercice du schéma. Effet : sûr (repli prudent), mais la note affichée « remplacé par dead bug / porte-valise » peut être inexacte. Même motif que copenhague-court (lot-02, corrigé en « retirer sans remplaçant »). Auteur : kine (reformuler la note ou retirer le remplaçant).
- **T-1 (remarque)** : gainage-creux, lignes Sources « décision de garder… en attente » et « jugement de coach à confirmer » sont obsolètes depuis D4/D5. Auteur : coach (mise à jour de texte).
- **T-2 (remarque)** : le README du lot n'a pas encore les questions marquées « tranchées : choix prudent conservé » (D4). Auteur : coach.
- Remarques du premier contrôle non traitées et non bloquantes (restent des remarques) : C2 (grossesse élastique « légère » non codée dans ecartement-elastique et tirage-bras-tendus-elastique), C3 (lien HAS), alignements facultatifs (dead-bug-jambes-seules cou n1, rowing-elastique dos n1, assis-debout-mains-cuisses).

## Verdict par fiche (0 bloquant ; réserves = seulement choix prudents NON SOURCÉ)
| Fiche | 0 bloquant | Réserves limitées à des choix prudents NON SOURCÉ |
|---|---|---|
| developpe-epaules-sac-a-dos | oui | oui |
| pompe-un-bras | oui | oui |
| pompe-equilibre-mur | oui | oui (mouvement et adaptation NON SOURCÉ, cases prudentes, validé D4/D5) |
| bird-dog-pause | oui | oui |
| gainage-creux | oui | oui sous réserve : mouvement entièrement NON SOURCÉ (aucune source lue) ; décision utilisateur D4/D5 ; texte « en attente » à mettre à jour (T-1) avant passage en `utilisable` |
| pallof-elastique | oui | oui |
| planche-bras-jambe-leves | oui | oui (R-1 non bloquant) |
| planche-laterale-jambe-levee | oui | oui (R-1 non bloquant) |
| porte-serveur | oui | oui (R-1 non bloquant) |
| ecartement-elastique | oui | oui |
| rowing-sac-a-dos | oui | oui |
| assis-debout-mains-cuisses, bird-dog-jambe-seule, dead-bug-jambes-seules, developpe-epaules-elastique, marche-sac-a-dos, pont-fessier-une-jambe, porte-un-haltere-epaule, rowing-elastique, tirage-bras-tendus-elastique, tirage-vertical-elastique-haut | oui (déjà OK au premier contrôle, rien à recontrôler) | oui |

Non vérifié lors de ce recontrôle : les images (aucune regardée), les sources externes (free-exercise-db, ACE, notices) non rouvertes, hors ce qui avait déjà été lu au premier contrôle.
