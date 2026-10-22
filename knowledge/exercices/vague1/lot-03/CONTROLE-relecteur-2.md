# Recontrôle `relecteur` du lot-03 (vague 1), 24 fiches : mobilité, cardio, rotation, traction

Recontrôle du 22/10/2026, lancé à neuf, après les corrections de `coach` et de `kine`. Je n'ai pas écrit ces fiches et je ne les corrige pas : je liste les écarts. Chaque fiche est jugée seule ; `CONTROLE-relecteur.md` ne sert qu'à vérifier que ses écarts sont levés.

**Méthode.**
- Lu : `CLAUDE.md`, `format-fiches.md`, `regles-securite-communes.md`, `CONTROLE-relecteur.md`, le README du lot, les 24 fiches en entier, `sports.md` règle 5, `program-logic.md` §6.
- Source primaire : j'ai relu les 19 entrées de free-exercise-db citées par les fiches (`dist/exercises.json`, 876 entrées, lu en flux le 22/10/2026, rien enregistré) : texte, niveau, muscles, images. Entrées confrontées : Kneeling_Hip_Flexor, Standing_Hip_Flexors, Hip_Circles_prone, Ankle_Circles, Calf_Stretch_Hands_Against_Wall, Arm_Circles, Leg-Up_Hamstring_Stretch, Seated_Floor_Hamstring_Stretch, On_Your_Side_Quad_Stretch, Quad_Stretch, Mountain_Climbers, Standing_Cable_Wood_Chop, Cross-Body_Crunch, Air_Bike, Scapular_Pull-Up, Band_Assisted_Pull-Up, Chin-Up, Pullups, Wrist_Circles.
- Croisements : tableaux zone/niveau et Grossesse de `tirage-vertical-elastique-haut`, `squat-assis-debout`, `bird-dog-jambe-seule`, `pallof-elastique`, `mobilite-cheville-au-mur` (remplaçants et renvois). `sports.md` règle 5 relue (jumping-jacks). `program-logic.md` §6 : OMS 2020, statut OK.
- Outil : `npm run check:fiches` donne 102 fiches, 0 erreur, 0 avertissement (ids de variantes, remplaçants et progressions résolus sur tout le dépôt).
- Non vérifié : aucune photo regardée (toutes « à vérifier » ou « non » ou absentes : conforme à la règle 12 ; seules `Incline_Push-Up-0/1.webp` existent dans `public/photos/`). Aucun visuel maxwu.

**Légende.** Bloquant : la fiche ne peut pas passer `verifie`. À corriger : écart réel, correction simple. Remarque : sans effet sur le statut. « Aucun écart » = ni bloquant ni à corriger (les remarques restent listées).

---

## Écarts par fiche

### 1. extension-thoracique : aucun écart
- Écarts de la première passe levés : les consignes 1, 3 et 5 décrivent maintenant la chaise et le couché ; `chat-vache-sol` est présenté en « alternative ».
- Remarque : Épaule n1 `garder` alors que la variante chaise garde les mains derrière la tête (note epaule-n1 : coudes devant) ; acceptable.

### 2. rotation-thoracique-assise : aucun écart
- NON SOURCÉ honnête (aucune entrée libre ; `Torso_Rotation` hors sujet). Cases monotones.

### 3. etirement-flechisseurs-hanche : à corriger
- Écart de la première passe levé : Grossesse = `adapter: variante:etirement-flechisseurs-debout`, cohérent avec la note.
- à corriger : la ligne Sources dit « ids vus dans l'index, descriptions non lues en détail » alors que « Lu le » = 2026-10-22 et que le README dit les entrées relues en entier. J'ai lu `Kneeling_Hip_Flexor` (à genou, bascule vers l'avant) et `Standing_Hip_Flexors` (debout, talon arrière levé, l'entrée précise qu'on n'obtient pas d'étirement profond debout) : le PROVISOIRE est justifié, mais la mention de lecture doit être mise à jour.
- Remarque : l'entrée classe le muscle comme quadriceps ; la fiche met `flechisseurs_hanche` (choix de coach, ligne muscles NON SOURCÉ).

### 4. grenouille-hanches : aucun écart
- NON SOURCÉ honnête (`Frog_Hops`, `Frog_Sit-Ups` hors sujet). Poignet n1/n2 = `appui:avant-bras`, sans effet sur la variante.

### 5. ouverture-hanche-quatre-pattes : à corriger
- Écart de la première passe levé : `Hip_Circles_prone` cité pour l'échelon 2 (PROVISOIRE), échelon 1 NON SOURCÉ.
- à corriger : la ligne Sources écrit « un grand cercle lent » (fidèle à l'entrée : « make a big circle ») mais la consigne 4 dit « dessine un petit cercle ». La fiche affiche à l'utilisateur le contraire de sa source sans le dire. Aligner la consigne sur la source (« cercle lent, amplitude confortable ») ou déclarer « petit cercle » comme choix de coach NON SOURCÉ.

### 6. accroupi-profond-tenu : aucun écart
- Écarts de la première passe levés : Dos n2 garde la variante chaise ; Grossesse = `retirer: remplacant:squat-assis-debout` (position tenue, G4) ; `squat-assis-debout` existe, Grossesse `garder`, non retiré par Hanche n2 / Cheville.
- Remarque : les consignes ne décrivent pas la variante chaise imposée par Dos (les mains sur le dossier ne figurent que dans l'installation et la note dos-n1).
- Remarque : la « version plus douce » (`accroupi-profond-chaise`) n'est pas retirée en grossesse par la case, mais le fait pour la position tenue ; la règle commune §0 règle le cas.

### 7. cercles-de-cheville : à corriger
- Écarts de la première passe levés : Cheville n1 = variante assise (la variante debout n'est plus proposée avec une gêne) ; ligne source scindée (debout PROVISOIRE, couché et assis NON SOURCÉ). `Ankle_Circles` relue : debout, appui sur un support, pied levé, grand cercle avec le gros orteil : la scission est exacte.
- à corriger : contradiction interne sur la taille des cercles. La consigne 2 dit « grand cercle lent » et Points d'attention « plus le cercle est grand et lent, mieux c'est : pas de petits mouvements », mais les notes cheville-n1 (« petits cercles lents ») et cheville-n2 (« cercles réduits ») demandent l'inverse. De plus « mieux c'est » est une affirmation sans source (l'entrée dit seulement de dessiner un grand cercle). Harmoniser et ne pas présenter l'affirmation comme acquise.
- Remarque : « Gonflement de la cheville ou du mollet, rougeur, chaleur : consulte (S2) » : S2 cite le gonflement, pas rougeur ni chaleur (formulation de `kine`, non marquée NON SOURCÉ).
- Remarque (inchangée, question déjà posée à l'utilisateur) : `plus-dur : mobilite-cheville-au-mur`, dont Cheville n1 est `garder`, alors que cette fiche est `adapter` à n1.

### 8. etirement-mollets-mur : à corriger
- Écart de la première passe levé : `Standing_Gastrocnemius_Calf_Stretch` retirée des sources, photos `non`. `Calf_Stretch_Hands_Against_Wall` relue : face au mur, jambe décalée, mains au mur, talon au sol : jambe tendue contre le mur correctement PROVISOIRE ; genou plié et marche NON SOURCÉ, dits.
- à corriger : note grossesse mal écrite, affichée telle quelle : « …(risque de chute, G4) ;Station debout immobile prolongée à éviter (G4) : étirement court, change d'appui, assieds-toi si besoin.  une douleur ou un gonflement… » (point-virgule collé, majuscule au milieu de la phrase, double espace, phrase finale tronquée en minuscule).
- Remarque : la consigne 2 « orteils pointés droit devant » n'est pas dans l'entrée (ajout de coach, sans conséquence).

### 9. cercles-de-bras : aucun écart
- Bloquant de la première passe levé : source remplacée par `Arm_Circles`, relue : bras tendus sur les côtés, parallèles au sol, cercles d'environ 30 cm (1 pied), puis sens inverse ; position, petits cercles et changement de sens correspondent à l'échelon 1 et à la consigne. « Grands cercles » (échelon 2) NON SOURCÉ, dit.
- Écart de case levé : Épaule n2 et Cou n2 = `variante:cercles-bras-petits`, Dos n2 aussi.
- Remarque : les signes d'arrêt n'ont pas la ligne générique « Douleur… relâche » mais « Douleur dans l'épaule (pincement en levant) » ; suffisant.

### 10. passage-de-bras-serviette : aucun écart
- Contradiction de niveau levée : l'échelon 2 (prise étroite) est `intermediaire`, la fiche reste `debutant` par l'échelon 1, cohérent avec « prise trop étroite pour débuter ». Épaule n2 garde la prise large.
- NON SOURCÉ honnête (aucune entrée libre).

### 11. etirement-ischios-serviette : aucun écart
- Écart de la première passe levé : les consignes 4 à 6 décrivent la variante assise (seule permise en grossesse). Elles correspondent à `Seated_Floor_Hamstring_Stretch` relue (jambe tendue, autre pied contre l'intérieur de la cuisse, se pencher depuis les hanches). `Leg-Up_Hamstring_Stretch` relue : couché, sans serviette ; la serviette est déclarée NON SOURCÉ.
- Remarque : Dos n1/n2 impose la variante allongée alors que Grossesse l'exclut ; le cumul est réglé par la règle commune §0 mais pourrait proposer la variante assise (flexion avant depuis les hanches) à une personne enceinte avec une gêne de dos : à signaler à `dev`.
- Remarque : la note générale renvoie à « README lot-02, question 9 » (texte de travail affiché à l'utilisateur).

### 12. etirement-pectoraux-mur : aucun écart
- Bloquant de la première passe levé : ligne passée NON SOURCÉ (description de coach) ; photos `Chest_And_Front_Of_Shoulder_Stretch` passées `non` (bâton levé derrière la tête, confirmé par la lecture de l'entrée : ce n'est pas la position de la fiche).
- Remarque : la consigne 1 dit « coude plié ou tendu » alors que les variantes décrivent un coude plié à angle droit ou un peu sous l'épaule ; sans risque (le haut du bras ne dépasse pas l'épaule).

### 13. etirement-fessiers-figure-4 : aucun écart
- NON SOURCÉ honnête. G4 : couché sur le dos retiré en grossesse (variante chaise).

### 14. etirement-quadriceps : à corriger
- Écart de la première passe levé : ligne scindée (côté PROVISOIRE `On_Your_Side_Quad_Stretch`, debout NON SOURCÉ), photos `Quad_Stretch` passées `non` (entrée relue : ceinture ou bande, niveau intermédiaire).
- à corriger : la consigne 3 « bascule le bassin vers l'arrière (rentre le ventre) » contredit l'entrée `On_Your_Side_Quad_Stretch`, qui est la source de la variante PROVISOIRE : l'entrée dit « press your left hip forward as you push your left foot back into your hand » et fait poser le genou du dessous plié à 90° devant soi pour stabiliser le tronc, ce que l'installation de la variante côté n'indique pas. Soit aligner la variante sur l'entrée, soit marquer la bascule du bassin comme ajout de coach NON SOURCÉ (le risque est faible, mais la ligne PROVISOIRE couvre aujourd'hui un geste que sa source ne décrit pas).
- Remarque : la note grossesse commence par une parenthèse lourde ; à réécrire.

### 15. jumping-jacks : aucun écart
- Écarts de la première passe levés : la citation de `sports.md` règle 5 n'est plus présentée comme source du prérequis (règle 5 relue : « Aucun travail de saut intensif la veille d'un match ; fatigue/douleur -> réduire » : la fiche dit justement que c'est un autre sujet) ; le texte résiduel « à définir par kine » a disparu ; ligne dédiée NON SOURCÉ.
- Impact en post-partum : l'échelon avec saut est remplacé par la ligne Grossesse tant que le réglage unique est coché (regles-securite-communes.md §3, déclencheur) ; la question « à traiter par `dev` » du README est donc couverte pour ce lot.
- Remarque : les notes renvoient à « Notes kine du README » et à « README lot-02 question 8 » (texte de travail affiché).

### 16. montees-genoux-sur-place : aucun écart
- Texte résiduel retiré. Même remarque de renvoi au README (note grossesse).

### 17. mountain-climbers : à corriger
- `Mountain_Climbers` relue : position de pompe, genoux alternés ; « explosively » et « 20-30 seconds » non repris, bien. PROVISOIRE justifié ; chaise = description de coach, dit.
- à corriger : la ligne Sources dit « id vu dans l'index, description non lue en détail » alors que « Lu le » = 2026-10-22 et que l'entrée a été relue (voir fiche 3).
- Remarque : Poignet n1 `appui:poings-fermes` s'applique aussi à la variante chaise (poings sur l'assise) ; sans gravité. Le remplaçant `montees-genoux-marche` existe et n'est pas retiré par les zones concernées.

### 18. boxe-dans-le-vide : aucun écart
- Écart de la première passe levé : Épaule n2 et Coude n2 = `variante:boxe-vide-lente` ; Cou, Dos, Genou, Cheville n2 aussi.
- Remarque : les signes d'arrêt génériques parlent de « version sans impact » alors que l'exercice n'a pas d'impact ; formulation copiée des autres fiches cardio.

### 19. marche-rapide-intervalles : à corriger
- Écart de la première passe levé : renvoi à `program-logic.md` §6 (OMS 2020, statut OK, vérifié) ; la fiche précise que l'OMS ne donne ni durée ni intervalles pour cette fiche.
- à corriger : la note grossesse affirme « la HAS cite la marche parmi les activités possibles » en la déclarant « non relu pour cette fiche, PROVISOIRE à recontrôler ». Une affirmation non relue n'est pas PROVISOIRE mais NON SOURCÉ ; `regles-securite-communes.md` ne la contient que pour le post-partum (G7) et pas pour la grossesse (G4, G5). Soit citer le passage lu de HAS 2019, soit passer l'affirmation en NON SOURCÉ.
- Remarque : le repère « parler sans pouvoir chanter » reste absent de `program-logic.md` : NON SOURCÉ, dit deux fois.
- Remarque : la liste d'arrêt dit « passe à la version sans impact » pour une marche.

### 20. pas-chasses-lateraux : aucun écart
- NON SOURCÉ honnête. Cases monotones. Remarque : renvoi « Notes kine du README » dans la note grossesse.

### 21. rotation-bucheron : à corriger
- `Standing_Cable_Wood_Chop` relue : poulie haute, tirage en diagonale vers le genou avant, pivot du pied arrière, « repeat to failure » (non repris). PROVISOIRE limité à la poulie, dit.
- à corriger : la ligne Sources dit « id vu dans l'index, description non lue en détail » (voir fiche 3).
- à corriger : texte de travail affiché dans la note hanche-n1 : « Ligne ajoutée par prudence (la rotation pivote sur la hanche) ; à confirmer par `kine` » (même type de résidu que celui relevé à la première passe pour `jumping-jacks`). Ajouter la ligne Hanche était juste ; retirer la phrase de processus ou la traiter dans le README.
- à corriger : les photos `Standing_Cable_Wood_Chop` restent « à vérifier » alors que le README demande de ne pas les afficher (poulie, aucune variante de la fiche ne l'utilise : règle 12). Les passer `non`.
- Remarque : Épaule n1 `charge:legere` ne couvre pas la variante élastique ; la note générale le dit.

### 22. crunch-bicyclette : aucun écart
- Écart de la première passe levé : `Cross-Body_Crunch` (échelon 1) et `Air_Bike` (échelon 2), relues, correspondent ; différences déclarées (mains à côté de la tête dans l'entrée, derrière dans la fiche ; niveau « débutant » en base, `intermediaire` ici par prudence). Photos « à vérifier ».
- Remarque : la variante échelon 1 s'intitule « pieds au sol » alors que la consigne 2 demande de rapprocher le genou (le pied quitte le sol), comme dans l'entrée.

### 23. traction-barre : à corriger
- Écart de la première passe levé : Épaule n2 = `retirer`, la note dit que le tirage vertical à l'élastique n'est pas proposé non plus ; Coude n2 et Poignet n2 : le remplaçant `tirage-vertical-elastique-haut` n'est pas retiré par ces zones (Coude n2 `charge:legere`, Poignet non listé) ; Grossesse : sa propre ligne est `adapter: variante:tirage-vertical-elastique-assis`.
- Entrées relues : `Scapular_Pull-Up` (suspendu, quelques centimètres sans les bras), `Band_Assisted_Pull-Up` (bande autour de la barre, genou dans la boucle), `Chin-Up`, `Pullups` : correspondent aux 4 échelons.
- à corriger : la ligne Sources dit « ids vus dans l'index, descriptions non lues en détail » (voir fiche 3).
- Remarque : Épaule, Coude, Poignet n1 renvoient à l'échelon 2 (assistée par élastique), plus exigeant en amplitude que l'échelon 1 (scapulaire, qui garde la suspension) ; choix de `kine` défendable mais à confirmer, la ligne tableau est NON SOURCÉ « à valider ».
- Remarque : `Chin-Up` écrit une prise plus étroite que les épaules, la fiche « largeur d'épaules » ; `Scapular_Pull-Up` décrit une prise en pronation. Détails sans risque.
- Remarque : les 8 photos sont « à vérifier » : à regarder une à une pour les logos d'un tiers avant tout affichage.

### 24. mobilite-poignets : à corriger
- `Wrist_Circles` relue : debout, bras tendus sur les côtés, cercles des poignets ; l'exercice correspond, la position des bras diffère (fiche : coudes pliés devant soi, sans conséquence). Appui des paumes au sol NON SOURCÉ, dit.
- à corriger : la ligne Sources dit « id vu dans l'index, description non lue en détail » (voir fiche 3).
- Remarque : la note grossesse (« à harmoniser par l'utilisateur, voir README du lot ») est du texte de travail affiché ; le choix (appui quatre pattes retiré, alors que `grenouille-hanches`, `ouverture-hanche-quatre-pattes` et `chat-vache` le gardent) est plus prudent et sans risque de sécurité, mais la question à l'utilisateur reste ouverte.

---

## Remarques communes
- **Aucun bloquant.** Les deux bloquants de la première passe (`cercles-de-bras`, `etirement-pectoraux-mur`) sont levés, et les 15 « à corriger » de la première passe aussi (voir plus haut). Les nouveaux écarts sont mineurs : une mention de lecture périmée (fiches 3, 17, 21, 23, 24), une contradiction texte/source ou texte/note (5, 7, 14), un texte de travail ou mal écrit (8, 21), un statut mal choisi (19), une photo (21).
- **README du lot périmé sur les statuts** : le tableau « Liste » et le paragraphe « Sources » donnent encore `cercles-de-bras` PROVISOIRE (Shoulder_Circles), `etirement-pectoraux-mur` PROVISOIRE (Chest_And_Front_Of_Shoulder_Stretch), `ouverture-hanche-quatre-pattes` et `crunch-bicyclette` NON SOURCÉ, et « descriptions non lues en détail », ce que les fiches corrigées contredisent. À mettre à jour par l'auteur (hors fiches).
- **Renvois au README dans des notes affichables** (« voir Notes kine du README », « README lot-02 question N », « voir README du lot ») : sans sens pour l'utilisateur de l'app ; à retirer des notes ou à garder dans le README (fiches 11, 15, 16, 17, 20, 24).
- **Sécurité** : aucune case ne permet un exercice dangereux ; niveau 3 = `retirer` partout, aucun niveau 2 plus permissif que le niveau 1 sur une variante plus dure ; grossesse : dos, planche, impact et suspension retirés ; message « douleur : stop, consulte » (S1, S2) présent partout ; R5 présent sur les 6 fiches cardio et sur la traction.
- **Cohérence entre fichiers** : les remplaçants (`squat-assis-debout`, `bird-dog-jambe-seule`, `pallof-elastique`, `tirage-vertical-elastique-haut`, `montees-genoux-marche`) existent et ne sont pas retirés par les zones qui les appellent, sauf cas déjà couvert par la règle commune §0. Seul décalage connu : `mobilite-cheville-au-mur` (pilote, Cheville n1 `garder`) cité en `plus-dur` par `cercles-de-cheville`.
- **Format** : `npm run check:fiches` sans erreur ni avertissement ; tags de matériel valides ; échelons sans trou ; niveaux jamais en baisse.

---

## Verdicts

| # | Fiche | Verdict | Motif |
|---|---|---|---|
| 1 | extension-thoracique | aucun écart | |
| 2 | rotation-thoracique-assise | aucun écart | |
| 3 | etirement-flechisseurs-hanche | à corriger | mention de lecture périmée |
| 4 | grenouille-hanches | aucun écart | |
| 5 | ouverture-hanche-quatre-pattes | à corriger | consigne « petit cercle » contre source « grand cercle » |
| 6 | accroupi-profond-tenu | aucun écart | |
| 7 | cercles-de-cheville | à corriger | taille des cercles : consigne contre notes, affirmation sans source |
| 8 | etirement-mollets-mur | à corriger | note grossesse mal écrite |
| 9 | cercles-de-bras | aucun écart | |
| 10 | passage-de-bras-serviette | aucun écart | |
| 11 | etirement-ischios-serviette | aucun écart | |
| 12 | etirement-pectoraux-mur | aucun écart | |
| 13 | etirement-fessiers-figure-4 | aucun écart | |
| 14 | etirement-quadriceps | à corriger | consigne contraire à l'entrée citée pour la variante PROVISOIRE |
| 15 | jumping-jacks | aucun écart | |
| 16 | montees-genoux-sur-place | aucun écart | |
| 17 | mountain-climbers | à corriger | mention de lecture périmée |
| 18 | boxe-dans-le-vide | aucun écart | |
| 19 | marche-rapide-intervalles | à corriger | affirmation HAS « non relue » marquée PROVISOIRE |
| 20 | pas-chasses-lateraux | aucun écart | |
| 21 | rotation-bucheron | à corriger | mention de lecture, texte de travail affiché, photo poulie |
| 22 | crunch-bicyclette | aucun écart | |
| 23 | traction-barre | à corriger | mention de lecture périmée |
| 24 | mobilite-poignets | à corriger | mention de lecture périmée |

## Résumé
- **0 bloquant. 10 fiches à corriger** (3, 5, 7, 8, 14, 17, 19, 21, 23, 24), toutes pour des écarts mineurs de texte, de source ou de photo. **14 fiches sans aucun écart.**
- Le lot reste en `controle_relecteur` : aucune fiche ne passe `verifie` avant la correction des écarts des 10 fiches par leurs auteurs (`coach` pour les sources, consignes et photos ; `kine` pour les notes de sécurité) et un recontrôle ciblé de ces 10 fiches. Les 14 autres peuvent passer `verifie` (avec leurs remarques).

## Fiches sans aucun écart (14)
extension-thoracique, rotation-thoracique-assise, grenouille-hanches, accroupi-profond-tenu, cercles-de-bras, passage-de-bras-serviette, etirement-ischios-serviette, etirement-pectoraux-mur, etirement-fessiers-figure-4, jumping-jacks, montees-genoux-sur-place, boxe-dans-le-vide, pas-chasses-lateraux, crunch-bicyclette.
