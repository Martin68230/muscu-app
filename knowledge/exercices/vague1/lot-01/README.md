# Lot 01 (vague 1) : trous de couverture, 21 fiches
Rédigé par `coach` le 22/10/2026. Statut de toutes les fiches : `brouillon_coach`. La section « Sécurité et contre-indications » est volontairement au gabarit « À compléter par kine » : `kine` la remplit (tableau zone x niveau, lignes Grossesse et Version plus douce, signes d'arrêt, objets du quotidien). `npm run check:fiches` ne signale donc que ces 63 manques (3 par fiche : tableau, Grossesse, Version plus douce) ; aucune autre erreur, 0 avertissement (les 9 liens `a-creer:` du pilote ont été remplacés par les ids des fiches créées).
Format : knowledge/format-fiches.md. Photos : free-exercise-db seulement ; aucune image regardée, donc « à vérifier » (non affichée) ; sinon « aucune photo ».

## Liste
| id | nom | schéma | niveau min | échelons | matériel (tags) | remarque |
|---|---|---|---|---|---|---|
| bird-dog-jambe-seule | Bird dog, jambe seule ou bras seul | anti_rotation | débutant | 1 | tapis | fiche `a-creer` du pilote |
| bird-dog-pause | Bird dog avec pause (et coude-genou) | anti_rotation | intermédiaire | 2 | tapis | fiche `a-creer` |
| dead-bug-jambes-seules | Dead bug, jambes seules | anti_rotation | débutant | 2 | tapis | fiche `a-creer` |
| planche-bras-jambe-leves | Planche avec un bras ou une jambe levé | anti_rotation | intermédiaire | 3 | tapis | vraie anti-rotation de gainage |
| pallof-elastique | Pallof press à l'élastique | anti_rotation | débutant | 3 | elastique + porte (ancrage) | vrai anti-rotation, profil B |
| planche-laterale-jambe-levee | Planche latérale, jambe levée | gainage | intermédiaire | 2 | tapis | fiche `a-creer` |
| gainage-creux | Gainage en creux (hollow hold) | gainage | débutant | 2 | tapis | NON SOURCÉ (brouillon M1390) |
| pompe-un-bras | Pompe à un bras | poussée H | avancé | 2 | chaise, tapis | fiche `a-creer` |
| pompe-equilibre-mur | Pompe en équilibre contre un mur | poussée V | avancé | 2 | mur | fiche `a-creer` ; voir questions |
| developpe-epaules-elastique | Développé épaules à l'élastique | poussée V | débutant | 2 | elastique (+ chaise) | profil B |
| developpe-epaules-sac-a-dos | Développé épaules avec un sac à dos | poussée V | débutant | 1 | sac_a_dos | profil A + objet du quotidien |
| rowing-elastique | Rowing à l'élastique | tirage H | débutant | 2 | elastique (+ porte) | fiche `a-creer` ; trou principal |
| rowing-sac-a-dos | Rowing buste penché avec un sac à dos | tirage H | débutant | 1 | sac_a_dos | profil A + objet du quotidien |
| ecartement-elastique | Écartement de l'élastique bras tendus | tirage H | débutant | 1 | elastique | `couverture: substitut` |
| tirage-vertical-elastique-haut | Tirage vertical à l'élastique ancré en haut | tirage V | débutant | 2 | elastique + porte | trou principal |
| tirage-bras-tendus-elastique | Tirage bras tendus à l'élastique | tirage V | débutant | 1 | elastique + porte | `couverture: substitut` |
| pont-fessier-une-jambe | Pont fessier sur une jambe | charnière | intermédiaire | 2 | tapis, chaise | fiche `a-creer` |
| assis-debout-mains-cuisses | Assis-debout, mains sur les cuisses | squat | débutant | 2 | chaise | fiche `a-creer` |
| marche-sac-a-dos | Marche avec un sac à dos chargé | porté | débutant | 1 | sac_a_dos | porté maison |
| porte-serveur | Porté du serveur (charge au-dessus de la tête) | porté | intermédiaire | 1 | halteres ou bidons_ou_sacs | porté maison |
| porte-un-haltere-epaule | Porté d'une charge sur l'épaule | porté | intermédiaire | 1 | halteres ou kettlebell | |

Les 9 fiches `a-creer` du pilote sont toutes créées sous le même id : bird-dog-jambe-seule, bird-dog-pause, dead-bug-jambes-seules, planche-laterale-jambe-levee, pompe-un-bras, pompe-equilibre-mur, pont-fessier-une-jambe, rowing-elastique, assis-debout-mains-cuisses.

## Couverture visée (nombre de fiches utilisables par profil, avec les fiches du pilote ; tout reste « non vérifié » tant que `relecteur` et l'utilisateur n'ont pas validé)
- Anti-rotation : 5 fiches de plus (profil A : 4 sans élastique ; profil B : + Pallof). Le vrai anti-rotation (Pallof) est enfin couvert en B.
- Poussée V au poids du corps : + pompe-equilibre-mur (avancé) ; + 2 fiches élastique / sac à dos.
- Tirage H : rowing-elastique (B), rowing-sac-a-dos (A avec sac), écartement (substitut).
- Tirage V : tirage-vertical-elastique-haut (B), tirage bras tendus (substitut) ; toujours rien en A sans élastique ni barre.
- Portés à la maison : marche-sac-a-dos (sac_a_dos), porte-serveur (bidon), + porte-sac-a-dos-devant, porte-valise et marche-du-fermier du pilote.

## Points à traiter par `kine` (avant tout autre point)
- Zones sensibles : épaule (porte-serveur, pompe-equilibre-mur, développés, pompe-un-bras), poignet (pompes, planche latérale sur la main), lombaires (rowings, portés), cou (pompe-equilibre-mur : charge sur la tête et le cou).
- Élastique et ancrage de porte : pallof-elastique, rowing-elastique, tirage-vertical-elastique-haut, tirage-bras-tendus-elastique ; vérification de l'élastique avant usage, ancrage selon la notice, porte fermée.
- Sac à dos et bidons : poids connu, contenu calé, jamais dans un escalier (R8 de regles-securite-communes.md).
- Grossesse : tous les exercices couché sur le dos, gainage en creux, pompe en équilibre contre un mur, pompe-un-bras, portés au-dessus de la tête.

## Points de rédaction à ne pas oublier
- Aucune durée de maintien ni distance de porté n'est donnée (aucune valeur sourcée).
- Sources : free-exercise-db lue le 22/10/2026 pour Dead_Bug, Single_Leg_Glute_Bridge, Single-Arm_Push-Up, Handstand_Push-Ups, Shoulder_Press_-_With_Bands, Band_Pull_Apart, Plank, Pallof_Press, Side_Bridge (PROVISOIRE : base d'exercices, pas une étude) ; ACE bird dog lue le 21/10/2026 ; le reste est NON SOURCÉ (choix de coach, brouillons dont seule l'existence est prouvée).
- Niveaux changés par rapport à la source (NON SOURCÉ, tracés dans les fiches) : pompe-un-bras (source intermediate, mis avancé), pont-fessier-une-jambe (source beginner, mis intermédiaire).
- Les identifiants free-exercise-db cités existent (vérifié dans dist/exercises.json le 22/10/2026). Aucun WebP créé : toutes les photos sont « à vérifier » ou « non ».
- Pas de lien de progression vers `tirage-bras-tendus-elastique` depuis un autre lot (l'id existe).
- Reste du pilote signalé dans CAMPAGNE.md (planche-touche-epaule, montée sur marche, notes dos-n2, etc.) : NON traité dans ce passage.

## Corrections `coach` après le contrôle `relecteur` (22/10/2026)
- **developpe-epaules-sac-a-dos** : décision prudente = niveau relevé à intermédiaire (fiche et variante), consigne 1 « sac léger, de poids connu », ligne NON SOURCÉ ajoutée. Justification : charge improvisée au-dessus de la tête, prise par bretelles ou poignée moins sûre qu'un haltère, niveau aligné sur porte-serveur (intermédiaire). La fiche est conservée à une condition : `kine` doit ajouter la conduite R9 (ne jamais lâcher le sac au-dessus de la tête, que faire s'il glisse, espace dégagé et plafond) et traiter la grossesse (G4). Sans cela, elle va dans knowledge/exercices/ecartees/ (risque d'une charge improvisée au-dessus de la tête non maîtrisé).
- **Photos** : les deux « non » sans image regardée (planche-bras-jambe-leves, planche-laterale-jambe-levee) sont passés à « à vérifier ». Aucune image n'a été regardée dans ce lot.
- **planche-laterale-jambe-levee** : Side_Bridge n'a pas d'instruction, la ligne est NON SOURCÉ (description reprise du pilote).
- **pallof-elastique** : PROVISOIRE limité à la forme à la poulie, la version élastique est NON SOURCÉ (choix de coach).
- **gainage-creux** : bras derrière la tête ajoutés à l'échelon 2, niveau de l'échelon 2 noté « à confirmer », décision de la question 5 toujours en attente (ligne de sources ajoutée) : la fiche ne passe pas à `verifie` sans source ou décision écrite.
- **ecartement-elastique** : « une seconde » remplacé par « un instant » (aucune durée sourcée). Le lien plus-dur vers rowing-elastique-assis (autre schéma) est conservé : progression vers un mouvement plus complet, à confirmer.
- **rowing-sac-a-dos** : précaution du dos recopiée (plus de renvoi vers une fiche invisible).
- Les niveaux et progressions de planche-bras-jambe-leves, planche-laterale-jambe-levee, pompe-un-bras sont alignés sur le pilote par les cases kine (voir CONTROLE-relecteur.md) ; côté coach, rien d'autre n'était demandé.

## Questions pour l'utilisateur
1. **Pompe en équilibre contre un mur** (avancé) : garde-t-on cette fiche ? Le mouvement met la tête et le cou sous charge, et ses sources sont en partie NON SOURCÉ (la seule fiche libre est dos au mur, niveau expert). Option : la retirer du générateur et ne garder que la pompe piquée pieds surélevés comme dernier échelon.
2. **Élastique et porte** : ces mouvements supposent un ancrage de porte adapté et une porte fermée. On les propose aux profils qui ont coché `elastique` ET `porte`, ou seulement aux profils avec élastique (les variantes sans ancrage étant limitées à rowing-elastique-assis et -penche) ?
3. **Sac à dos comme charge** (marche, développé, rowing) : on accepte ces mouvements improvisés (poids connu, contenu calé), ou on les réserve à une page « sans matériel » ?
4. **Substituts** (`couverture: substitut`) : ecartement-elastique et tirage-bras-tendus-elastique comptent-ils dans la couverture tirage H / tirage V, ou seulement comme compléments ?
5. **Gainage en creux (hollow hold)** : mouvement entièrement NON SOURCÉ ; on garde ou on attend une source ?
6. **Regroupement** : assis-debout-mains-cuisses pourrait être un échelon de squat-assis-debout au lieu d'une fiche séparée ; on garde la fiche séparée (id cité par le pilote) ?

Réponse provisoire de `kine` (22/10/2026), en attente de la décision de l'utilisateur : pour la question 1 (pompe-equilibre-mur), option la plus prudente retenue dans la fiche : `retirer` dès le niveau 1 pour le cou (tête et cou sous charge), épaule/coude/poignet/dos : adapter au niveau 1 puis retirer au niveau 2, grossesse retirée (remplaçant pompe-chaise). Aucune source lue sur la charge cervicale de cet exercice : NON SOURCÉ. Les fiches du lot sont au statut `complete_kine`, à faire contrôler par `relecteur`.
