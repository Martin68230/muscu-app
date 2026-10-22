# Contrôle `relecteur` du lot-03 (vague 1), 24 fiches : mobilité, cardio, rotation, traction

Contrôle indépendant du 22/10/2026, lancé à neuf. Je n'ai pas écrit ces fiches et je ne les corrige pas : je liste les écarts.

**Méthode.**
- Lu : `format-fiches.md`, `regles-securite-communes.md`, `sources.md`, `materiel-tags.json`, `sports.md` (règles de conception), `program-logic.md` §6, les 24 fiches en entier et le README du lot.
- Lu aussi : les tableaux zone/niveau et les variantes des fiches citées en progression ou en remplaçant (`squat-assis-debout`, `chat-vache`, `mobilite-cheville-au-mur`, `bird-dog-jambe-seule`, `pallof-elastique`, `tirage-vertical-elastique-haut`, `mobilite-hanches-90-90`, `ouverture-livre-thoracique`).
- Source primaire : j'ai lu `dist/exercises.json` de free-exercise-db (876 entrées, lu en flux le 22/10/2026, rien enregistré) pour vérifier les 18 ids cités par les fiches, leur texte, leurs images et leurs « absences ». C'est la source citée par les fiches.
- Outil : `npm run check:fiches` donne 102 fiches, 0 erreur, 0 avertissement. Lancé sur le seul dossier lot-03 (`node tools/validate-fiches.mjs <dossier>`), le script signale 18 « id introuvable » : ce sont des renvois vers d'autres lots, que le script ne résout pas. Je les ai tous vérifiés à la main : les 9 ids existent. Ce n'est pas un écart.
- Non vérifié : aucune photo regardée (les fiches ne les affichent pas). Je n'ai pas comparé les consignes ligne à ligne au dépôt maxwu, qui n'est pas dans le projet. Aucune consigne n'en a la forme (texte français, tutoiement, formulations propres).

**Légende.** « bloquant » = la fiche ne peut pas passer `verifie`. « à corriger » = écart réel, correction simple. « remarque » = sans effet sur le statut.

---

## Écarts par fiche

### 1. extension-thoracique
- à corriger : les consignes 3 et 5 décrivent un support (serviette ou rouleau, « déplace le support d'un cran ») alors que la variante de repli imposée par Dos n1/n2, Cou n2 et Grossesse est la chaise (`extension-thoracique-chaise`). La personne dont le dos est gêné ou qui est enceinte n'a donc aucune consigne pour la version qu'on lui impose.
- remarque : `plus-facile : chat-vache-sol` n'est pas un échelon plus facile de la même fonction (sol, quatre pattes, poignets chargés) ; à reformuler en « alternative ».
- remarque : aucune entrée free-exercise-db trouvée pour le haut du dos : plausible (`Chair_Upper_Body_Stretch` est autre chose). Statut NON SOURCÉ honnête.

### 2. rotation-thoracique-assise
- Rien de bloquant ni à corriger. Statut NON SOURCÉ honnête (`Torso_Rotation` demande un ballon : absence correcte). Cases monotones (Dos n1 `reduite`, n2 chaise, n3 `retirer`).
- remarque : Grossesse pointe vers la variante chaise (échelon 1), cohérent avec la note.

### 3. etirement-flechisseurs-hanche
- à corriger : **Grossesse** `adapter: appui:main-sur-support` ne retire pas les variantes à genou (`...genou-sol`, `...genou-sol-chaise`), alors que la note dit « version debout… pas de position à genoux ». Aucune variante n'a d'installation « debout avec une main sur un support » (la variante debout dit « mains sur les hanches »). Le code et le texte affiché divergent. Proposer `adapter: variante:etirement-flechisseurs-debout` et mettre l'appui dans l'installation ou la note.
- remarque : `Standing_Hip_Flexors` écrit lui-même qu'on n'obtient pas un étirement profond debout ; muscle principal DB = quadriceps (la fiche met `flechisseurs_hanche` : choix de coach, déclaré NON SOURCÉ).
- Sources vérifiées : `Kneeling_Hip_Flexor` et `Standing_Hip_Flexors` correspondent aux deux variantes, PROVISOIRE honnête.

### 4. grenouille-hanches
- Rien à corriger. Absence d'entrée correcte (`Frog_Hops`, `Frog_Sit-Ups`, `Groin_and_Back_Stretch` sont d'autres mouvements).
- remarque : Poignet n1/n2 envoie vers `grenouille-avant-bras`, qui est l'échelon 2 (genoux plus écartés, donc plus exigeant pour l'aine). Sans conséquence si la hanche n'est pas gênée ; en cumul de zones la règle « la plus prudente » joue.

### 5. ouverture-hanche-quatre-pattes
- à corriger : la fiche affirme « aucune entrée free-exercise-db trouvée ». `Hip_Circles_prone` (niveau débutant, à quatre pattes, un genou plié levé, grand cercle lent du genou) correspond à l'échelon 2 `ouverture-hanche-cercle`. L'échelon 2 pourrait être PROVISOIRE, et une photo candidate existe (à vérifier). L'échelon 1 (genou levé sur le côté, sans cercle) reste NON SOURCÉ.
- remarque : Grossesse `amplitude:reduite` n'oblige pas l'échelon 1 (le cercle reste possible). Acceptable, la note parle d'amplitude modeste.

### 6. accroupi-profond-tenu
- à corriger : **Dos** n1 `variante:accroupi-profond-chaise` (appui des mains) puis n2 `amplitude:mi-course` sans appui : au niveau 2 la case autorise la variante libre (échelon 2, sans appui), ce que le niveau 1 interdisait. C'est plus permissif, en pratique, sur la variante la plus dure. Le niveau 2 devrait garder la variante chaise (avec amplitude réduite en note).
- à corriger : **Grossesse** `adapter: variante:accroupi-profond-chaise` garde une position **tenue** ; la note invoque G4 (« éviter l'isométrique prolongé… ») mais la case n'impose rien contre le maintien et la fiche ne donne aucune durée. Soit la case est `retirer: remplacant:squat-assis-debout`, soit la note dit explicitement que G4 n'est pas appliqué à cette fiche.
- remarque : consigne R8 « vérifie-la en tirant dessus » alors que les autres fiches disent « en t'appuyant dessus » ; uniformiser.
- remarque : le remplaçant `squat-assis-debout` existe et n'est pas retiré à Hanche n2 (`adapter: appui:assise-rehaussee`) ni à Cheville (pas de ligne) : correct.

### 7. cercles-de-cheville
- à corriger : la note générale dit « Debout, l'exercice n'est proposé que sans gêne de cheville », mais Cheville n1 est `adapter: amplitude:reduite` : la variante debout (sur une jambe, main au mur) reste donc proposée avec une gêne légère de cheville. Le texte affiché promet une restriction que la case n'applique pas. Il faut une case qui exclut la variante debout dès le niveau 1 (par exemple `adapter: variante:cercles-cheville-assis`).
- à corriger : source. Dans free-exercise-db, `Ankle_Circles` décrit un exercice debout, un pied levé, en se tenant à un support : il ne couvre que la variante debout. Les variantes couché et assis (échelon 1, qui sont les repliers de sécurité) ne sont pas sourcées ; la ligne « Cercles de cheville lents » ne le dit pas. À scinder (debout PROVISOIRE ; couché/assis NON SOURCÉ).
- remarque (croisée avec le pilote) : `plus-dur : mobilite-cheville-au-mur`, dont Cheville n1 est `garder` alors que cette fiche-ci est `adapter` à n1 : l'exercice plus dur est moins contraint que l'exercice plus facile. À aligner dans l'une ou l'autre.
- remarque : « Gonflement de la cheville ou du mollet, rougeur, chaleur : consulte (S2) » : S2 cite le gonflement ; rougeur et chaleur n'y sont pas (formulation de `kine`, à marquer NON SOURCÉ).

### 8. etirement-mollets-mur
- à corriger : `Standing_Gastrocnemius_Calf_Stretch` est cité comme source de « l'étirement du mollet contre un mur ». Cette entrée décrit le talon posé sur une marche, genou tendu, orteils tirés à la main : ce n'est pas le mur. Seule `Calf_Stretch_Hands_Against_Wall` correspond (la variante `genou-plié` n'y figure pas, honnêtement marquée NON SOURCÉ en Points d'attention). Les photos de `Standing_Gastrocnemius...` contredisent la consigne (règle 12) : à passer « non » ou à retirer.
- remarque : la variante marche (talon dans le vide) est NON SOURCÉ, comme annoncé ; la note de sécurité (équilibre, rampe) est cohérente avec R8 (marche d'escalier).

### 9. cercles-de-bras
- **bloquant** : l'unique source citée, `Shoulder_Circles`, décrit des **cercles d'épaules** (haussement avant, haut, arrière, bas, bras le long du corps), pas des **cercles de bras tendus à hauteur d'épaules**. La fiche présente donc comme PROVISOIRE un exercice que sa source ne décrit pas, et ses deux photos contrediraient la consigne. L'entrée qui correspond existe : `Arm_Circles` (bras tendus sur les côtés, parallèles au sol, cercles d'environ 30 cm, puis sens inverse). À corriger : citer `Arm_Circles`, remplacer les photos, ou passer en NON SOURCÉ.
- à corriger : Épaule n2 `adapter: amplitude:bras-bas` ne force pas les petits cercles que la note impose (« bras moins hauts, petits cercles »). Au niveau 2, la variante `cercles-bras-grands` (échelon 2) redevient permise alors que le niveau 1 la refusait. Proposer `adapter: variante:cercles-bras-petits` au niveau 2 aussi.
- remarque : la liste « Signes qui doivent faire arrêter » ne contient pas la ligne générique « Douleur… relâche » présente ailleurs ; elle a seulement « Douleur dans l'épaule… ». Suffisant.

### 10. passage-de-bras-serviette
- à corriger : contradiction interne. `Erreurs fréquentes` dit « Prise trop étroite pour débuter », alors que l'échelon 2 `passage-bras-prise-etroite` est classé `debutant`. Soit passer l'échelon 2 en `intermediaire`, soit retirer l'erreur.
- remarque : Épaule n2 `bras-bas` laisse la prise étroite possible (n1 la refusait) ; même schéma que la fiche 9, moins grave car la hauteur des bras est limitée.
- Absence d'entrée : plausible (`Behind_Head_Chest_Stretch` est un étirement partenaire/poitrine). NON SOURCÉ honnête.

### 11. etirement-ischios-serviette
- à corriger : les 4 consignes décrivent la version couchée. La variante assise (échelon 2) n'a qu'une ligne en Points d'attention, alors que c'est la **seule** variante permise en grossesse (la version couchée sur le dos y est retirée). Écrire une consigne pour la variante assise.
- remarque : Dos n1/n2 impose la variante couchée alors que Grossesse l'exclut ; le cumul Dos + grossesse est géré par la règle commune (§0 : un remplaçant adapté ou retiré n'est pas proposé), à signaler à `dev`.
- Sources vérifiées : `Leg-Up_Hamstring_Stretch` (couché, sans serviette dans l'entrée : la serviette est un ajout de coach, non signalé) et `Seated_Floor_Hamstring_Stretch` (assis, se pencher depuis les hanches) : PROVISOIRE honnête.

### 12. etirement-pectoraux-mur
- **bloquant** : l'unique source, `Chest_And_Front_Of_Shoulder_Stretch`, décrit un étirement debout avec une barre ou un bâton tenu à deux mains en prise large, **levé derrière la tête**. Ce n'est ni un étirement contre le mur ni le bras plié à hauteur d'épaule. La fiche reconnaît « version contre le mur : description de coach » entre parenthèses mais garde le statut PROVISOIRE sur toute la ligne ; la position de la source (bras passé derrière la tête) est plus exigeante pour l'épaule que celle de la fiche. Passer la ligne en NON SOURCÉ ; ne pas afficher les photos (elles contredisent la consigne, règle 12).
- remarque : cases monotones (Épaule n1 variante bras-bas, n2 retirer), cohérentes avec les notes.

### 13. etirement-fessiers-figure-4
- Rien à corriger. Absence d'entrée correcte (`Lying_Glute` et `Seated_Glute` sont des exercices avec partenaire).
- remarque : G4 couché sur le dos : variante chaise seule en grossesse, bien appliquée.

### 14. etirement-quadriceps
- à corriger : les photos sont annotées « debout » pour `Quad_Stretch` et « sur le côté » pour `On_Your_Side_Quad_Stretch`. Or `Quad_Stretch` est un étirement **couché sur le côté avec une ceinture ou une bande** (niveau intermédiaire dans la base). Aucune des deux entrées ne décrit la variante debout (échelon 1, la variante par défaut), qui reste donc NON SOURCÉ ; la ligne « debout ou sur le côté » PROVISOIRE est trop large. Corriger l'annotation et scinder la ligne.
- remarque : cases monotones ; Grossesse variante côté, cohérente avec la note.

### 15. jumping-jacks
- à corriger : la note générale cite « sports.md règle 5, PROVISOIRE » pour « saut seulement après l'échelon sans saut fait sans gêne, avec une réception souple ». La règle 5 de `sports.md` dit autre chose (« Aucun travail de saut intensif la veille d'un match ; fatigue/douleur -> réduire »). La règle 4 parle de réceptions contrôlées pour danse et volley seulement. Le conseil est du choix de `kine`/`coach` : le marquer NON SOURCÉ, sans citation inexacte.
- à corriger : texte résiduel dans « Points d'attention » : « prérequis (réception contrôlée) à définir par kine ». `kine` est passé ; écrire le conseil non codé ou retirer la phrase (texte affiché à l'utilisateur).
- remarque : absence d'entrée correcte (`Star_Jump` est un saut pliométrique, autre mouvement). G7 : les 4 variantes à impact du lot (`jumping-jacks-saut`, `montees-genoux-course`, `pas-chasses-rapides`, `mountain-climbers-rapide`) sont toutes écartées par la ligne Grossesse de leur fiche (variante sans impact ou retrait), donc le réglage unique « enceinte / post-partum » les exclut déjà ; la question posée à `dev` dans le README est en réalité traitée pour ce lot, tant que le réglage reste unique (à confirmer dans regles-securite-communes.md §3 G7).

### 16. montees-genoux-sur-place
- à corriger : texte résiduel « Prérequis à définir par kine » en Points d'attention (même remarque).
- remarque : absence d'entrée correcte pour la montée de genoux sur place.

### 17. mountain-climbers
- Rien à corriger. Source vérifiée : `Mountain_Climbers` correspond (position de pompe, genoux alternés). Statut PROVISOIRE honnête, variante chaise = description de coach (dit).
- remarque : l'entrée écrit « explosively » et « 20-30 seconds » : aucune de ces valeurs n'est reprise, bien. Photo `à vérifier`.
- remarque : Poignet n1 `appui:poings-fermes` s'applique aussi à la variante chaise (poings sur l'assise) ; sans gravité.

### 18. boxe-dans-le-vide
- à corriger : Épaule n1 et Coude n1 `variante:boxe-vide-lente`, mais n2 `amplitude:reduite` : au niveau 2 les « combinaisons avec déplacements » (échelon 2) redeviennent permises. La note dit « coups plus courts, bras jamais tendus » : la case n'applique pas « lente ». Mettre la variante lente au niveau 2 aussi.
- remarque : absence d'entrée correcte.
- remarque : consigne 4 « séries de 2 ou 3 coups » : une structure de combinaison, pas un dosage ; acceptable, non présentée comme sourcée.

### 19. marche-rapide-intervalles
- Rien à corriger. Statut NON SOURCÉ honnête.
- remarque : « Repère général : la recommandation OMS… n'a pas été relue pour cette fiche » : `program-logic.md` §6 la cite déjà (OMS 2020, statut OK) ; renvoyer à §6. Le repère « parler sans chanter » (Points d'attention, consigne 2 formulée « sans t'empêcher de parler ») n'est dans aucun fichier du projet : il reste NON SOURCÉ.
- remarque : « quelques minutes tranquilles » (consigne 4) est une durée vague non sourcée, déclarée « aucune durée sourcée » ; acceptable.
- remarque : Grossesse : « la HAS cite la marche parmi les activités possibles » ne figure pas dans `regles-securite-communes.md` G4/G5 (le fichier cite la marche pour le post-partum, G7) ; je n'ai pas relu la HAS 2019 : à marquer PROVISOIRE ou à recontrôler.

### 20. pas-chasses-lateraux
- Rien à corriger. Cases monotones (Cheville/Genou/Hanche n1 variante lents, n2 retirer). Grossesse : pas lents, couloir dégagé : cohérent.
- remarque : « Post-partum : voir Notes kine du README » : voir fiche 15.

### 21. rotation-bucheron
- Rien à corriger. Cases monotones (Dos n1 sans charge, n2 `retirer: remplacant:pallof-elastique`, n3 retirer ; le remplaçant existe et n'est que `charge:legere` au niveau 2 du dos, il est donc proposable).
- remarque : la photo `Standing_Cable_Wood_Chop` montre une machine à poulie (matériel `poulie` salle) alors que les variantes sont sans charge, haltère, élastique : la fiche le dit, mais le plus sûr est de ne pas l'afficher.
- remarque : aucune ligne Hanche alors que la rotation pivote sur le pied ; le genou est couvert, pas la hanche. À trancher par `kine`.
- remarque : Épaule n1 `charge:legere` ne dit rien pour la variante élastique (résistance non réglée par « charge »).
- Sources vérifiées : l'entrée est une poulie, descendante, abdominaux/épaules ; PROVISOIRE limité à la poulie, dit.

### 22. crunch-bicyclette
- à corriger : la fiche affirme « aucune entrée free-exercise-db correspondante trouvée (recherche par nom) ». Deux entrées correspondent : `Cross-Body_Crunch` (couché, pieds au sol, coude vers le genou opposé : échelon 1) et `Air_Bike` (jambes à la perpendiculaire, mouvement de pédalage : échelon 2). Les statuts devraient être PROVISOIRE (avec photos candidates à vérifier), pas NON SOURCÉ. L'erreur est du côté prudent mais elle est factuellement fausse.
- remarque : cases monotones ; Dos n2 `retirer: remplacant:bird-dog-jambe-seule` (existe, Dos n2 `reduite`, Grossesse `maintien-court`) : cohérent.

### 23. traction-barre
- à corriger : Épaule n2 `retirer: remplacant:tirage-vertical-elastique-haut`, mais cette fiche est elle-même `retirer: remplacant:rowing-elastique-assis` à Épaule n2. Le remplaçant annoncé en note (« remplacé par le tirage vertical à l'élastique ») ne sera donc jamais proposé pour une gêne nette d'épaule. La règle commune §0 règle le cas (le générateur passe à un autre exercice du schéma), mais la note affichée est fausse pour ce cas. Soit le remplaçant devient un tirage horizontal (`rowing-elastique-assis`), soit la note dit « le tirage vertical à l'élastique n'est pas proposé non plus ».
- remarque : Épaule n1/Coude n1/Poignet n1 remplacent la variante par `traction-barre-assistee-elastique` (échelon 2), plus exigeante en amplitude que `traction-barre-scapulaire` (échelon 1, qui garde pourtant la suspension). Choix de `kine` défendable (moins de poids sur l'articulation) mais à confirmer, car l'échelon 1 est plus facile ; non vérifiable par une source.
- remarque : `Chin-Up` : prise « plus étroite que les épaules » alors que la variante dit « largeur d'épaules » ; `Scapular_Pull-Up` décrit une prise pronation. Écarts de détail, sans risque.
- remarque : photos de `Pullups`, `Chin-Up`, `Band_Assisted_Pull-Up` : à regarder une par une pour les logos d'un tiers avant tout affichage (cas déjà rencontré avec `Incline_Push-Up`, voir `tools/photos.md`).
- Niveaux : `intermediaire` partout, cohérent avec la décision de `kine` ; pas d'exercice technique pour débutant. Matériel `barre_traction` (+ `elastique`) conforme au fichier de tags.

### 24. mobilite-poignets
- Rien à corriger. Source vérifiée : `Wrist_Circles` (debout, bras tendus sur les côtés, poignets) : la fiche place les coudes pliés devant soi ; différence mineure, la partie « appui au sol » est NON SOURCÉ, dit.
- remarque : Grossesse retire l'appui au sol « par prudence (fourmillements des mains) » alors que `ouverture-hanche-quatre-pattes`, `grenouille-hanches` et le chat-vache gardent le quatre pattes en grossesse. Rationnel différent d'une fiche à l'autre ; à harmoniser par `kine` (sans effet de sécurité, plus prudent).

---

## Remarques communes aux 24 fiches
- **Douleur -> pas de progression.** Les fiches ne contiennent pas ce message dans leurs « Signes qui doivent faire arrêter ». Il n'apparaît que dans la ligne « Règles communes R1 à R10 » du tableau Sources, et « aucune augmentation » au niveau 2. R4 (arrêt, pas de progression à la séance suivante, version plus douce) est donc appliqué par la règle commune, pas par la fiche. Acceptable si l'écran d'arrêt affiche R4 ; sinon ajouter une ligne type.
- **« Lu le » = 2026-10-22 pour free-exercise-db** alors que les fiches disent « id vu dans l'index, description non lue en détail ». J'ai lu les entrées : 4 des 12 fiches qui citent une entrée la décrivent mal (fiches 8, 9, 12, 14) et 3 ont ignoré une entrée correcte (5, 9, 22). La colonne « Lu le » surévalue la lecture de l'auteur ; la corriger après relecture des entrées.
- **Aucune photo n'est affichée** (toutes « à vérifier » ou « aucune photo ») : conforme à la règle 12. `public/photos/free-exercise-db/` ne contient que `Incline_Push-Up-0/1`. Aucun fichier maxwu.
- **Niveaux, échelons, tags** : tous les tags existent dans `materiel-tags.json` ; échelons sans trou ; niveaux jamais en baisse ; `niveau_min` égal à l'échelon 1 ; 4 à 6 consignes partout. Aucun exercice technique pour débutant ; les échelons à impact (`jumping-jacks-saut`, `montees-genoux-course`, `pas-chasses-rapides`, `mountain-climbers-rapide`) et `crunch-bicyclette-pedalage` sont `intermediaire`.
- **Durées, répétitions, distances** : aucune valeur chiffrée présentée comme sourcée. Seuls des quantificateurs vagues (« quelques cercles », « quelques minutes », « quelques pas », « 2 ou 3 coups ») figurent dans des consignes, jamais en colonne Sources.
- **README du lot périmé** : l'en-tête et le paragraphe « Sources » parlent encore de `brouillon_coach` et de « 72 manques sécurité » ; toutes les fiches sont en `complete_kine`. À mettre à jour par l'auteur ; sans effet sur les fiches.
- **Grossesse (G4)** : couché sur le dos et planche (mountain climbers) retirés ; impact retiré ; quatre pattes gardé. Réserve : l'immobilité debout prolongée, que G4 demande d'éviter, n'est mentionnée que dans la fiche des pectoraux ; les étirements debout du mollet et du quadriceps ne la mentionnent pas (le quadriceps passe par la version couchée sur le côté, le mollet reste debout au mur).

---

## Verdicts

| Fiche | Verdict `verifie` | Motif |
|---|---|---|
| extension-thoracique | non, après correction | 1 à corriger (consignes de la variante chaise) |
| rotation-thoracique-assise | possible | remarques seulement |
| etirement-flechisseurs-hanche | non, après correction | 1 à corriger (Grossesse) |
| grenouille-hanches | possible | remarque seulement |
| ouverture-hanche-quatre-pattes | non, après correction | 1 à corriger (entrée `Hip_Circles_prone` ignorée) |
| accroupi-profond-tenu | non, après correction | 2 à corriger (Dos n2 ; Grossesse et maintien) |
| cercles-de-cheville | non, après correction | 2 à corriger (variante debout à n1 ; portée de la source) |
| etirement-mollets-mur | non, après correction | 1 à corriger (source `Standing_Gastrocnemius...`) |
| cercles-de-bras | **non (bloquant)** | source ne décrit pas l'exercice ; 1 à corriger |
| passage-de-bras-serviette | non, après correction | 1 à corriger (contradiction niveau) |
| etirement-ischios-serviette | non, après correction | 1 à corriger (pas de consigne pour la variante assise) |
| etirement-pectoraux-mur | **non (bloquant)** | source différente, statut PROVISOIRE non justifié |
| etirement-fessiers-figure-4 | possible | aucun écart |
| etirement-quadriceps | non, après correction | 1 à corriger (annotation photo, portée de la source) |
| jumping-jacks | non, après correction | 2 à corriger (citation `sports.md` inexacte ; texte résiduel) |
| montees-genoux-sur-place | non, après correction | 1 à corriger (texte résiduel) |
| mountain-climbers | possible | aucun écart |
| boxe-dans-le-vide | non, après correction | 1 à corriger (n2 plus permissif que n1) |
| marche-rapide-intervalles | possible | remarques seulement |
| pas-chasses-lateraux | possible | aucun écart |
| rotation-bucheron | possible | remarques seulement |
| crunch-bicyclette | non, après correction | 1 à corriger (entrées `Cross-Body_Crunch` et `Air_Bike` ignorées) |
| traction-barre | non, après correction | 1 à corriger (remplaçant retiré) |
| mobilite-poignets | possible | remarque seulement |

## Résumé
- **2 bloquants** : `cercles-de-bras` et `etirement-pectoraux-mur` (la source citée décrit un autre exercice, statut PROVISOIRE non justifié, photos contradictoires). Le lot n'est pas validable tant qu'ils restent.
- **18 à corriger** réparties sur 15 fiches (détail ci-dessus) : six sont des cases du tableau qui contredisent la note affichée ou qui sont plus permissives au niveau 2 qu'au niveau 1 (fiches 3, 6, 7, 9, 18, 23), quatre des erreurs de source ou d'annotation (8, 14, 15, 22), deux des « absences » inexactes dans free-exercise-db (5, 22), le reste des consignes manquantes, un texte résiduel et une contradiction de niveau.
- **8 fiches** peuvent passer `verifie` (2, 4, 13, 17, 19, 20, 21, 24), toutes avec remarques ; le lot entier reste en `controle_relecteur` tant que les 2 bloquants ne sont pas levés.
- Aucun risque de sécurité grave : aucune case ne permet un exercice dangereux ; les niveaux 3 retirent partout ; la grossesse écarte le dos, la planche et l'impact. Les écarts de sécurité sont des divergences entre case et note.
- Après correction par les auteurs (`coach` pour les sources, `kine` pour les cases), un recontrôle à neuf est nécessaire.
