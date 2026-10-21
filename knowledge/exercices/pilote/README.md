# Lot pilote : 33 mouvements (corps entier, poids du corps + haltères, profils A et C)
Rédigé par `coach` le 21/10/2026. Statut de toutes les fiches : `complete_kine` (section sécurité complétée par `kine` le 21/10/2026, voir « Retour kine » en fin de page). Étapes suivantes : `kine` complète la section sécurité (statut `complete_kine`), puis `relecteur` contrôle à neuf (`controle_relecteur`), puis l'utilisateur valide (`verifie`).
Ce lot fixe le **format** des fiches. L'utilisateur en relit 5 (liste en fin de page) avant la suite.

## Format retenu
- Un fichier par mouvement : `<id>.md`, id stable en kebab-case français.
- Frontmatter : id, nom, schema, type, niveau_min, muscles_principaux, muscles_secondaires, source_brouillon (mouvement_id du CSV ; vide = ajout), statut. Champ en plus, proposé : `couverture: substitut` quand la fiche ne remplit le schéma qu'à moitié (à trancher, voir plus bas).
- Sections : Variantes (installation + matériel) ; Consignes (4-6 étapes, tutoiement) ; Points d'attention ; Erreurs fréquentes ; Progression / régression (ids) ; Repères de dosage (renvoi à program-logic.md, aucun chiffre non sourcé) ; Sécurité (remplie par kine : tableau zone x niveau 1-2-3, version plus douce, signes d'arrêt, objets du quotidien) ; Photo ; Sources (une ligne par affirmation, avec statut).
- Vocabulaire des muscles (snake_case) : quadriceps, fessiers, moyen_fessier, ischios, adducteurs, mollets, flechisseurs_hanche, erecteurs_rachis, carre_des_lombes, abdominaux, transverse, obliques, pectoraux, deltoides_anterieurs, deltoides_lateraux, deltoides_posterieurs, triceps, biceps, avant_bras, grand_dorsal, trapezes, rhomboides, dentele_anterieur. À intégrer au modèle de données.
- Photos : free-exercise-db seulement (domaine public). Chemin `exercises/<id>/0.jpg` et `1.jpg` dans https://github.com/yuhonas/free-exercise-db, à convertir en WebP. Tous les identifiants ont été vérifiés dans dist/exercises.json le 21/10/2026, mais **les images elles-mêmes n'ont pas été regardées** : à contrôler avant import.

## Liste des mouvements
Profil A = poids du corps + implicites (tapis, chaise, mur, marche). Profil C = A + haltères. « Hors A/C » = variante gardée pour les autres profils.

| id | nom | schéma | niveau | matériel A | matériel C | hors A/C |
|---|---|---|---|---|---|---|
| squat-assis-debout | Squat assis-debout sur chaise | squat | débutant | chaise ou marche | idem | - |
| squat-poids-du-corps | Squat au poids du corps | squat | débutant | rien | idem | - |
| squat-gobelet | Squat gobelet | squat | débutant | - | haltère | kettlebell |
| pont-fessier | Pont fessier | charnière | débutant | tapis | + haltère | - |
| souleve-de-terre-roumain-halteres | Soulevé de terre roumain aux haltères | charnière | débutant | - | haltères | - |
| souleve-de-terre-roumain-unijambiste | Soulevé de terre roumain sur une jambe | charnière | intermédiaire | mur ou rien | + haltère | - |
| fente-arriere | Fente arrière | fente | débutant | rien, mur | + haltères | - |
| squat-fendu | Squat fendu | fente | débutant | rien, mur | + haltères | - |
| squat-bulgare | Squat bulgare | fente | intermédiaire | chaise ou marche | + haltères | - |
| montee-sur-marche | Montée sur marche | fente | débutant | marche | + haltères | - |
| pompe-inclinee | Pompe inclinée | poussée H | débutant | mur, chaise, marche | idem | - |
| pompe-genoux | Pompe sur les genoux | poussée H | débutant | tapis | idem | - |
| pompe | Pompe | poussée H | débutant | rien | + mains sur haltères | - |
| developpe-au-sol-halteres | Développé au sol aux haltères | poussée H | débutant | - | haltères | - |
| developpe-epaules-halteres | Développé épaules aux haltères | poussée V | débutant | - | haltères (+ chaise) | - |
| pompe-piquee | Pompe piquée | poussée V | débutant | tapis ou marche | idem | - |
| pompe-piquee-pieds-sureleves | Pompe piquée pieds surélevés | poussée V | intermédiaire | marche ou chaise | idem | - |
| rowing-unilateral-haltere | Rowing à un bras | tirage H | débutant | - | haltère + chaise | banc |
| rowing-buste-penche-halteres | Rowing buste penché | tirage H | débutant | - | haltères | - |
| tirage-sous-table | Tirage allongé sous une table | tirage H | débutant | - | - | table_solide (tag proposé) |
| pullover-haltere-au-sol | Pull-over au sol (substitut) | tirage V | débutant | - | haltère | banc |
| tirage-w-allonge | Tirage en W allongé (substitut partiel) | tirage V | débutant | tapis | + haltères légers | - |
| planche | Planche | gainage | débutant | tapis | idem | - |
| planche-laterale | Planche latérale | gainage | débutant | tapis | idem | - |
| dead-bug | Dead bug | anti-rotation | débutant | tapis | + haltère | - |
| bird-dog | Bird dog | anti-rotation | débutant | tapis | idem | - |
| planche-touche-epaule | Planche touche-épaule | anti-rotation | intermédiaire | tapis | idem | - |
| marche-du-fermier | Marche du fermier | porté | débutant | - | haltères | bidons_ou_sacs (tag proposé) |
| porte-valise | Porté valise | porté | débutant | - | haltère | bidons_ou_sacs (tag proposé) |
| porte-sac-a-dos-devant | Porté du sac à dos contre la poitrine | porté | débutant | - | - | sac_a_dos (tag proposé) |
| chat-vache | Chat-vache | mobilité | débutant | tapis | idem | - |
| fente-basse-rotation | Fente basse avec rotation du buste | mobilité | débutant | tapis ou marche | idem | - |
| mobilite-cheville-au-mur | Mobilité de cheville au mur | mobilité | débutant | mur | idem | - |

Ajouts absents du brouillon : `pompe-piquee-pieds-sureleves` (progression de M1695) et `porte-sac-a-dos-devant` (porté avec un sac, signalé manquant).

## Couverture par schéma (nombre de mouvements utilisables)
| Schéma | Profil A | Profil C | Remarque |
|---|---|---|---|
| squat | 2 | 3 | |
| charnière | 2 | 3 | |
| fente | 4 | 4 | |
| poussée H | 3 | 4 | |
| poussée V | 2 | 3 | En A, les 2 fiches forment une seule échelle de progression |
| tirage H | **0** | 2 | En A, seulement si une table solide est déclarée (tirage-sous-table) |
| tirage V | **0 vrai** (1 substitut partiel) | **0 vrai** (2 substituts) | Impossible sans barre ni élastique |
| gainage | 2 | 2 | |
| anti-rotation | 3 | 3 | Dont 2 qui sont surtout de l'anti-extension (dead bug, touche-épaule : à trancher) |
| porté | **0** | 2 | En A, seulement si bidons, sacs ou sac à dos sont déclarés |
| mobilité | 3 | 3 | |

L'objectif de la vague 1 (au moins 3 mouvements vérifiés par profil et par schéma) n'est **pas** atteint par ce pilote, qui sert d'abord à fixer le format.

## Trous signalés
1. **Tirage vertical, profils A et C : impossible.** Sans barre ni élastique, on ne peut tirer ni le corps vers le haut ni une charge vers le bas. Meilleurs substituts : pull-over à l'haltère (C), tirage en W allongé (A, substitut partiel). Message à afficher : « Sans barre ni élastique, pas de vrai tirage vertical. Achat le plus utile : un élastique ou une barre de traction. »
2. **Tirage horizontal, profil A : 0 sans objet du quotidien.** Le tirage sous une table dépend d'une table solide déclarée. Candidat écarté pour l'instant : rowing avec une serviette accrochée à une poignée de porte (brouillon M1854, maxwu) : risque si la porte ou la poignée cède, à faire évaluer par `kine` avant toute fiche.
3. **Porté, profil A : 0 sans objet du quotidien.** Possible seulement avec bidons, sacs de courses ou sac à dos déclarés.
4. **Tags manquants** dans equipment-taxonomy.md pour les objets du quotidien : `table_solide`, `bidons_ou_sacs`, `sac_a_dos` sont proposés ici mais pas encore dans le vocabulaire (fichier hors de mon périmètre : à ajouter par la personne qui le tient).
5. **Dosage impossible à coder pour l'instant** : durées de maintien (planche, planche latérale), distances ou temps des portés, durée de la mobilité à l'échauffement : rien de sourcé dans knowledge/ (program-logic.md §9 et §10).
6. **Fiches citées dans les échelles mais pas encore écrites** : pont fessier sur une jambe (M0506), pompe pieds surélevés (M1053), planche en levant un bras ou une jambe, planche latérale jambe levée, bird dog jambe seule, assis-debout avec appui des mains, pompe en équilibre contre un mur (avancé).
7. **Photos** : 12 mouvements sur 33 n'ont aucune photo libre (squat assis-debout, soulevé sur une jambe, squat fendu, pompe sur les genoux, les 2 pompes piquées, tirage en W, bird dog, touche-épaule, porté valise, porté du sac, cheville au mur). Plusieurs photos montrent une autre variante (kettlebell au lieu d'haltère, barre au lieu de table, banc au lieu de chaise).

## Anomalies du brouillon relevées (pour le nettoyage de la vague 1)
- free-exercise-db « Split_Squats » est une fente **sautée**, et « Split_Squat_with_Dumbbells » a le pied arrière surélevé (c'est un squat bulgare) : noms trompeurs.
- M1730 s'appelle « Smith Press » alors que ses variantes sont aux haltères.
- M0410 « Bent-Arm Dumbbell Pullover » : tag `halteres` seul alors que la source utilise un banc.
- M1252 : la fiche free-exercise-db « Goblet Squat » est au kettlebell (bien taguée), la version haltère vient de wger/maxwu.
- M0518 / M0519 (squat bulgare gauche / droite) et M1548 / M1810 (rotation thoracique gauche / droite) : doublons par côté à fusionner.
- « Farmers_Walk » (free-exercise-db) : matériel « other » (poignées spécialisées ou haltères lourds).

## Choix discutables à faire trancher par l'utilisateur
1. **Variantes qui changent la difficulté** : pompe inclinée (mur, chaise, marche), planche (genoux, pieds), planche latérale. Le plan veut des variantes « installation + matériel seulement ». J'ai gardé une seule fiche par mouvement et rangé les variantes de la plus facile à la plus dure dans l'échelle. Alternative : une fiche par niveau de difficulté (plus de fiches, moins lisible).
2. **Champ `couverture: substitut`** dans le frontmatter pour le pull-over et le tirage en W, afin que le générateur sache qu'il ne remplit pas vraiment le schéma.
3. **Classement anti-rotation** du dead bug et de la planche touche-épaule (le dead bug est surtout de l'anti-extension). Le catalogue les range dans les manques anti-rotation ; le vrai anti-rotation (Pallof) demande un élastique (profil B).
4. **Ordre pompe inclinée / pompe sur les genoux** dans l'échelle (les deux ordres se défendent ; rien de sourcé).
5. **Niveaux changés par rapport à la source** : bird dog, porté valise, fente basse avec rotation, pompe piquée mis en débutant ; squat bulgare mis en intermédiaire ; développé au sol mis en débutant.
6. **Photo d'une autre variante** affichée avec une mention (« montré au kettlebell », « montré à la barre ») ou aucune photo ?
7. **Noms** : garder « dead bug » et « bird dog » (courants en salle) avec une explication, et un nom descriptif pour « World's Greatest Stretch » (fente basse avec rotation du buste) ?
8. **Squat au poids du corps** : bras devant (consigne) alors que la photo montre les mains derrière la tête.
9. **Regroupements** : soulevé roumain + jambes tendues en un seul mouvement ; développé épaules assis + debout en un seul mouvement.

## Niveau de preuve du lot (honnêtement)
Les consignes viennent surtout de bases d'exercices (free-exercise-db, domaine public) et de bibliothèques d'organismes de certification (ACE ; NASM vu seulement via résumé). Ce sont des pratiques professionnelles, **pas des études** : statut PROVISOIRE au mieux. Les fiches sans source lue sont marquées NON SOURCÉ ligne par ligne. Aucune méta-analyse ne porte sur la technique d'un mouvement précis ; c'est normal pour ce type de contenu, mais `relecteur` doit vérifier que chaque consigne correspond bien à la source citée.

## 5 fiches proposées pour la relecture par l'utilisateur
1. `squat-poids-du-corps` : poids du corps, avec photo.
2. `souleve-de-terre-roumain-halteres` : haltères, avec photo.
3. `planche` : gainage, question sur les durées non sourcées.
4. `pompe-inclinee` : plusieurs variantes qui changent la difficulté (choix n°1).
5. `pullover-haltere-au-sol` : trou de couverture (tirage vertical impossible) et substitut.

## Retour kine (21/10/2026)
Rédigé par `kine`. Les 33 fiches ont une section « Sécurité et contre-indications » complète (tableau par zone, version plus douce, signes d'arrêt, objets du quotidien) et le statut `complete_kine`. À contrôler par `relecteur`, lancé à neuf.

### Règles générales communes (s'appliquent à toutes les fiches)
L'app ne pose **jamais de diagnostic** : elle ne connaît qu'une zone (cou, épaule, coude, poignet, dos, hanche, genou, cheville) et un niveau de gêne. Elle ne nomme aucune pathologie, et l'avertissement « pas un avis médical » reste affiché.

| n° | Règle | Statut |
|---|---|---|
| R1 | **Niveaux du profil** : 1 = gêne légère (présente mais ne change pas le geste) ; 2 = gêne nette (présente pendant l'effort ou oblige à modifier le geste) ; 3 = douleur. | NON SOURCÉ (définition de conception) |
| R2 | **Effet des niveaux** : « garder » = exercice normal ; « adapter » = la variante ou la modification indiquée dans le tableau de la fiche ; « retirer » = l'exercice n'est plus proposé, l'app propose le remplaçant indiqué ou, à défaut, un autre exercice du même schéma qui ne sollicite pas la zone. Zone non listée dans une fiche = garder. Plusieurs zones gênées = la règle la plus prudente. Niveau 2 : **aucune augmentation de charge ou de difficulté** sur les exercices de la zone tant que le niveau reste à 2. | PROVISOIRE (extrapolation de load-calibration.md §8 et des sources de R4) |
| R3 | **Niveau 3 (douleur)** : retirer tous les exercices qui sollicitent la zone (une variante qui ne la sollicite pas du tout peut rester si la fiche le précise) et afficher : « Douleur signalée : demande l'avis d'un professionnel de santé avant de reprendre les exercices de cette zone. » | PROVISOIRE |
| R4 | **Douleur pendant un exercice** (douleur articulaire ou vive, pas la brûlure du muscle qui travaille) : arrêt de l'exercice, pas de progression à la séance suivante, version plus douce proposée la fois suivante. Deux séances de suite avec douleur sur la même zone : l'app propose de mettre à jour le profil (niveau 2 ou 3). | PROVISOIRE |
| R5 | **Signes généraux d'arrêt immédiat de la séance** : douleur, serrement ou gêne dans la poitrine (ou le cou, la mâchoire, le bras) à l'effort, malaise, vertige, essoufflement anormal, palpitations. Message : arrêter, ne pas reprendre avant un avis médical ; si une douleur dans la poitrine ne passe pas au repos : appeler le 15 (ou le 112). Affiché dans chaque fiche. | PROVISOIRE |
| R6 | **Quand l'app recommande de consulter** (message, jamais de diagnostic) : douleur qui persiste plus de 2 semaines malgré l'adaptation, ou qui s'aggrave ; gonflement ; douleur la nuit ou au repos ; perte de force ; engourdissement ou fourmillements ; douleur après une chute ou un choc ; douleur avec fièvre ou perte de poids inexpliquée. Urgence (consulter sans attendre) : perte de force qui s'aggrave, troubles pour uriner, engourdissement entre les cuisses. Proposition : quand une zone passe au niveau 2 ou 3, l'app affiche cette liste en cases à cocher ; une case cochée = message « consulte » et la zone passe au niveau 3 jusqu'à mise à jour par la personne. | PROVISOIRE (le seuil de 2 semaines est une extrapolation de la réévaluation à 2-4 semaines de la HAS pour la lombalgie) |
| R7 | **Retour après une gêne** : quand la personne baisse le niveau d'une zone, l'exercice revient par sa version plus douce, avec un nouvel étalonnage (load-calibration.md) ; progression normale ensuite si aucune gêne pendant 2 séances. | NON SOURCÉ |
| R8 | **Objets du quotidien** : avant la première série, la personne vérifie l'objet en s'appuyant dessus comme pendant l'exercice. Chaise : 4 pieds, sans roulettes, non pliante, dossier contre un mur, sol non glissant. Marche : seulement la première marche d'un escalier, éclairé et dégagé, rampe si possible ; plus haut = box stable. Table : test de soulèvement obligatoire (fiche tirage-sous-table). Sac à dos, bidons, sacs : fermés, solides, contenu calé, poids connu (pèse-personne), jamais dans un escalier. Porte : voir ci-dessous (rowing à la serviette écarté ; ancrage d'élastique seulement selon la notice). L'objet bouge, glisse, grince : arrêt et on n'utilise plus cet objet. | NON SOURCÉ, sauf la porte : PROVISOIRE (notices de fabricants) |
| R9 | **Charge au-dessus du visage** (développé au sol, pull-over, dead bug à l'haltère) : haltère fixe de préférence ; haltère réglable seulement si les disques sont serrés, vérifiés avant chaque série ; ne jamais lâcher l'haltère au-dessus de soi. | NON SOURCÉ |
| R10 | **Pas de douleur pour progresser** : l'app ne demande jamais de « travailler dans la douleur ». | PROVISOIRE |

Sources des règles communes :
| Règle(s) | Source | Niveau de preuve | Public | Lu le | Statut |
|---|---|---|---|---|---|
| R4, R10 : la douleur pendant l'exercice n'est pas nécessaire à de bons résultats (petit avantage à court terme seulement, aucune différence à moyen et long terme) ; donc une règle « sans douleur » ne prive pas la personne d'un bénéfice durable | Smith et al., Should exercises be painful in the management of chronic musculoskeletal pain? Br J Sports Med 2017;51(23):1679-1687 https://pmc.ncbi.nlm.nih.gov/articles/PMC5739826 | revue systématique et méta-analyse, 7 essais, 385 participants (preuve modérée à faible) | adultes avec douleur musculosquelettique chronique | 2026-10-21 (résumé) | OK pour le constat ; la règle d'arrêt est une extrapolation prudente : PROVISOIRE |
| R4 (contexte) : en rééducation **supervisée**, certains protocoles tolèrent une douleur jusqu'à environ 5/10 ; non retenu ici car l'app n'est pas supervisée | Silbernagel et al., Am J Sports Med 2007;35(6):897-906, DOI 10.1177/0363546506298279 (fiche PEDro https://search.pedro.org.au/search-results/record-detail/18389) | essai randomisé, 38 patients | tendinopathie d'Achille | 2026-10-21 (synthèses, résumé non complet) | PROVISOIRE |
| R5 : symptômes à l'effort (gêne thoracique, essoufflement anormal, malaise) = arrêter et demander un avis médical avant de reprendre | Riebe et al., Updating ACSM's recommendations for exercise preparticipation health screening, Med Sci Sports Exerc 2015;47(11):2473-2479 https://digitalcommons.uri.edu/kinesiology_facpubs/180 | recommandation d'experts (ACSM) | adultes | 2026-10-21 (résumé + formulaires dérivés de l'ACSM ; texte complet non lu) | PROVISOIRE |
| R6 : signes d'alerte (douleur d'aggravation progressive ou nocturne, symptômes neurologiques étendus, fièvre, perte de poids inexpliquée, antécédent de cancer) ; rester actif ; réévaluer à 2-4 semaines | HAS, Prise en charge du patient présentant une lombalgie commune, fiche mémo 2019 https://www.has-sante.fr/jcms/c_2961499/fr/prise-en-charge-du-patient-presentant-une-lombalgie-commune | recommandation officielle française | adultes, lombalgie commune | 2026-10-21 (résumé via moteur de recherche ; page et PDF HAS non ouverts : erreur de certificat) | PROVISOIRE (à relire dans le PDF ; extrapolation aux autres zones) |
| R6 : urgences (troubles urinaires, engourdissement entre les cuisses, faiblesse qui progresse) ; exercice en première intention | NICE NG59, Low back pain and sciatica in over 16s https://www.nice.org.uk/guidance/ng59 | recommandation officielle britannique | plus de 16 ans | 2026-10-21 (synthèses secondaires seulement ; mise à jour de juillet 2026 signalée, non vérifiée sur le site NICE) | PROVISOIRE |
| R2 (genou, hanche) : l'exercice structuré est un traitement de base ; une gêne ne justifie pas de tout retirer | Bannuru et al., OARSI guidelines 2019, Osteoarthritis Cartilage https://wrap.warwick.ac.uk/125416/ | recommandation internationale (GRADE) | adultes avec arthrose du genou ou de la hanche | 2026-10-21 (résumé) | PROVISOIRE (extrapolation) |
| R8 (porte) | notices de fabricants d'ancrages de porte : Serious Steel (https://www.living.fit/collections/resistance-bands/products/premium-resistance-band-door-anchor), GoFit, Multi Anchor (via moteur de recherche) | instructions de fabricants, pas d'étude | utilisateurs d'élastiques | 2026-10-21 (extraits) | PROVISOIRE |

**Limite honnête** : aucune étude ne teste les adaptations « zone x niveau » exercice par exercice. Les 33 tableaux sont des extrapolations de `kine` à partir de R1 à R10, marquées NON SOURCÉ dans chaque fiche. Elles sont volontairement prudentes ; elles doivent être validées par l'utilisateur et contrôlées par `relecteur`.

### Fiches à risque
| Fiche | Risque principal | Ce qui est demandé |
|---|---|---|
| tirage-sous-table | **la table bascule ou glisse sur la personne allongée dessous** | test de soulèvement debout obligatoire, consigné dans le profil (le tag `table_solide` seul ne suffit pas) ; la plupart des tables de salle à manger légères échoueront probablement au test |
| pullover-haltere-au-sol | épaule en fin d'amplitude au-dessus de la tête ; haltère au-dessus du visage | épaule niveau 1 : charge légère, haltère arrêté au-dessus du front, jamais la variante banc ; niveau 2 : retiré ; R9 |
| pompe-piquee-pieds-sureleves | tête en bas, pieds sur une chaise qui peut glisser, chute sur la tête | marche avant chaise ; cou ou épaule niveau 1 : retour à pompe-piquee |
| pompe-piquee | tête en bas, tête qui tape | arrêt si vertige ou pression dans la tête |
| montee-sur-marche, squat-bulgare | chute depuis une marche ou une chaise | première marche seulement ; version haltères seulement si l'équilibre est sûr |
| developpe-au-sol-halteres, dead-bug (haltère) | haltère au-dessus du visage | R9 |
| souleve-de-terre-roumain-halteres, rowing-buste-penche-halteres | charge sur le bas du dos en flexion | dos niveau 1 : amplitude ou appui réduits ; niveau 2 : pont-fessier / rowing avec appui |
| porte-sac-a-dos-devant, marche-du-fermier, porte-valise | charge improvisée de poids inconnu, sac qui cède | poids pesé, progression par petites étapes, jamais dans un escalier |

Proposition pour le profil (à trancher avec l'utilisateur et `dev`) : une case « un médecin m'a déconseillé les positions tête en bas » qui retire pompe-piquee et pompe-piquee-pieds-sureleves. NON SOURCÉ.

### Désaccords et compléments par rapport à `coach`
1. **tirage-sous-table** : l'avertissement de coach dit « teste-la d'abord en tirant doucement », ce qui se fait **déjà allongé dessous**. Je demande de remplacer ce test par le test de soulèvement **debout, sans être dessous** (section sécurité de la fiche), et de ne proposer la fiche qu'après ce test validé dans le profil. Je n'ai pas modifié le texte de coach : à corriger par lui. La variante jambes tendues augmente la traction sur la table : refaire le test.
2. **Rowing serviette à la porte (M1854)** : je confirme l'écart (section suivante).
3. **montee-sur-marche** : la progression « marche plus haute » ne doit jamais signifier une marche plus haute dans un escalier ; uniquement une box stable.
4. **pullover-haltere-au-sol** : d'accord avec le niveau débutant pour la variante sol (le sol limite l'amplitude) ; la variante banc ne doit pas être proposée en cas de gêne à l'épaule, même de niveau 1.
5. **porte-sac-a-dos-devant** : la progression « sac plus lourd » doit passer par un poids connu (se peser avec et sans le sac), pas à l'estime.
6. **pompe-piquee** (niveau débutant) : d'accord, à condition de commencer par la variante mains sur une marche si la personne n'a jamais fait de position tête en bas.
7. Pas de désaccord sur les autres fiches. Les « points d'attention » de coach sont compatibles avec la sécurité ; j'ai ajouté des points kine seulement là où c'était nécessaire.

### Rowing avec une serviette accrochée à la porte (M1854) : avis kine
**Avis : écarté. Je recommande de ne pas en faire une fiche, ni vérifiée ni proposée.**
- La personne se penche en arrière et met une grande partie de son poids sur une poignée de porte et une serviette, qui ne sont pas faites pour ça. Si la poignée casse, si la serviette glisse ou si le pêne lâche et que la porte s'ouvre, la chute se fait **en arrière, sur le dos et la tête**, sans possibilité de se rattraper.
- Aucun test simple et fiable ne permet à la personne de vérifier la solidité d'une poignée.
- Les fabricants d'ancrages de porte pour élastiques eux-mêmes demandent : ancrage côté gonds, porte fermée (à clé si possible), porte qui s'ouvre en s'éloignant de soi, porte pleine en bois ou en métal, contrôle avant chaque usage, et préviennent qu'une porte qui s'ouvre vers soi peut frapper la personne avec force (sources : R8). Une serviette sur une poignée ne respecte aucune de ces conditions.
- Alternatives : tirage-sous-table **si** la table passe le test ; rowing-unilateral-haltere si haltères ; tirage-w-allonge sinon ; et message d'achat : un élastique avec un vrai ancrage de porte (profil B), utilisé selon sa notice. Une future fiche « tirage à l'élastique ancré à la porte » devra reprendre les conditions des fabricants.
Statut de l'avis : PROVISOIRE (notices de fabricants extrapolées ; aucune étude).

### Règles non sourcées restantes
- R1 (définition des niveaux), R7 (retour après une gêne), R8 (objets du quotidien, hors porte), R9 (haltère au-dessus du visage).
- Les 33 tableaux zone x niveau, versions plus douces et signes d'arrêt propres à chaque fiche (extrapolation de kine).
- Le test de soulèvement de la table (raisonnement mécanique).
- Le seuil « 2 semaines » de R6 (extrapolé de la HAS lombalgie, à confirmer en lisant le PDF HAS).
- La case « tête en bas déconseillée » proposée pour le profil.
