# Contrôle `relecteur` du lot 05 (vague 1, banc), 13 fiches

Contrôle à neuf, le 22/10/2026. Je n'ai pas écrit ces fiches et je ne les corrige pas. Références : CLAUDE.md, knowledge/format-fiches.md, knowledge/regles-securite-communes.md (dont §0, §3 G4, §9 zone cou). Le README du lot n'a servi que de contexte.

## Méthode et limites
- `npm run check:fiches` : 127 fiches, 0 erreur, 0 avertissement (forme conforme : cases, listes fermées, ids existants, WebP et SVG présents).
- Remplaçants cités vérifiés dans le pilote : `developpe-epaules-halteres`, `souleve-de-terre-roumain-halteres`, `pompe`, `rowing-unilateral-haltere`, `montee-sur-marche`, `pont-fessier`, `squat-assis-debout`, `squat-gobelet`, `developpe-au-sol-halteres` existent, statut `utilisable`. Leur propre ligne Grossesse est `adapter` (jamais `retirer`), donc ils sont proposés dans leur version adaptée : cohérent avec §0 et G4.
- Études relues le 22/10/2026 (résumés Europe PMC et JSSM ; PubMed refusé) : Lauver 2016 (14 hommes, 4 angles de banc, développé couché ; le banc horizontal sollicite le mieux les deux faisceaux ; 30 et 45 degrés plus d'activation à certains moments) ; Contreras 2015 (13 femmes, hip thrust à la barre contre squat arrière : plus d'activation du grand fessier) ; Maeo 2023 (21 adultes, 12 semaines, triceps bras levé : volume environ 1,4 à 1,5 fois plus) ; Oliveira 2009 (22 sujets, 40 % de la force maximale isométrique, curl incliné semblable au curl classique, curl pupitre actif sur une courte partie). Les affirmations des fiches concordent, avec les limites déjà écrites (barre, résumé seulement). Titre réel d'Oliveira : « Effect of the shoulder position on the biceps brachii emg in different dumbbell curls ».
- Fiches free-exercise-db rouvertes (JSON) : Dumbbell_Squat_To_A_Bench (intermediate), Bench_Dips (beginner, descente jusqu'à un angle « légèrement aigu » : la fiche est plus prudente, limite 90 degrés marquée NON SOURCÉ, correct), Seated_Side_Lateral_Raise (beginner, bras à l'horizontale : conforme), Dumbbell_Flyes (beginner, paumes face à face : conforme). Les autres entrées n'ont pas été rouvertes.
- Images : j'ai regardé les WebP de Dumbbell_Incline_Row-0, Seated_Dumbbell_Press-0, Bench_Dips-0, Dumbbell_Flyes-1, Dumbbell_Bench_Press-0, Incline_Dumbbell_Press-0, Lying_Dumbbell_Tricep_Extension-0, Dumbbell_Squat_To_A_Bench-1, Seated_Side_Lateral_Raise-0, Incline_Dumbbell_Curl-0 et le code des 2 SVG. Non regardées : les autres WebP.
- Consignes : aucune trace de `maxwu` dans le dossier ; textes en français, réécrits (4 à 5 étapes).
- Règle appliquée comme dans les contrôles précédents : un exercice plus dur ou plus haut ne doit pas être moins restreint par une zone que son prédécesseur plus facile.

## Synthèse
- **Bloquants : 0.**
- **À corriger : 7** (A1 à A7) : 5 photos qui montrent une autre variante que la consigne (règle 12), 1 incohérence de cases avec le pilote (montee-sur-banc), 1 ligne de zone manquante (squat-gobelet-banc).
- **Mineurs : 10** (M1 à M10).
- Aucune fiche n'est `verifie` : toutes ont des lignes PROVISOIRE (free-exercise-db, résumés) ou NON SOURCÉ (choix prudents, échelons, tableaux par zone).
- Les cases durcies par `kine` que tu m'as demandé de regarder sont correctes (voir section suivante).

## Points demandés : résultat
| Point | Résultat |
|---|---|
| Poignet niveau 1, paumes face à face | OK dans developpe-couche-halteres, developpe-incline-halteres, developpe-epaules-assis-dossier-incline (`adapter: appui:paumes-face-a-face`, valeur de la liste fermée, niveau 2 `charge:legere`, niveau 3 `retirer`). Ecarté et extension couchée : `garder` à juste titre (paumes déjà face à face). Réserve : la photo du développé couché montre une prise paumes vers les pieds (A4). Rowing et curl : `garder` au niveau 1 alors qu'une prise neutre existe (M4, remarque). |
| Coude de l'écarté | OK : niveau 1 `adapter: charge:legere`, niveaux 2 et 3 `retirer`. Note cohérente avec la consigne (coudes à peine pliés). Plus restrictif que le développé couché (coude n2 adapter), logique pour un mouvement à bras de levier long. Réserve : la photo montre des coudes plus pliés (A3). |
| Cou du rowing | OK : niveaux 1 et 2 `adapter: amplitude:tete-alignee`, niveau 3 `retirer`, note avec renvoi à C3, signe d'arrêt « vertige, même léger » avec renvoi à C4. Cohérent avec §9. La fiche n'est pas marquée `doux_pour` : correct. |
| Genou niveau 2, montée sur banc | OK : `retirer`, plus prudent que la marche (`adapter` vers elle-même). Mais la note de justification est inexacte et le reste de la fiche est incohérent avec montee-sur-marche (A6). |
| Remplaçant `developpe-epaules-halteres` (developpe-couche, developpe-incline) | OK : existe, grossesse `adapter: variante:developpe-epaules-assis-chaise`, proposé en version assise seulement. Les notes disent « charge légère » alors que la case code une variante, pas la charge : sans gravité, la note est du texte. |
| Remplaçant `souleve-de-terre-roumain-halteres` (hip-thrust-banc) | OK : existe, grossesse `adapter: charge:legere` (G4 : soulevés de terre en `adapter`), même remplaçant que le pont-fessier du pilote : cohérent. |

## À corriger

**A1. dips-banc-triceps, Photo : la photo montre l'échelon 3 pour toutes les variantes.** Bench_Dips-0.webp : jambes tendues, talons sur une box, bras déjà fléchis. La consigne et les échelons 1 et 2 (genoux pliés, banc ou chaise) sont l'inverse ; la fiche note elle-même que les échelons 2 et 3 chargent davantage l'épaule. Règle 12 : une photo qui contredit la consigne n'est pas affichée. Les lignes sont pourtant `affichable : oui`. Correction possible : `oui` seulement pour la variante `dips-banc-pieds-surleves`, `non` ou `à vérifier` ailleurs, ou illustration pour les échelons 1 et 2. Gravité : à corriger (passe en bloquant si le code ne peut pas lier une photo à une variante). Fiche : dips-banc-triceps.

**A2. developpe-epaules-assis-dossier-incline, Photo : banc sans dossier.** Seated_Dumbbell_Press-0.webp : assis sur un banc plat, sans appui du dos. C'est l'échelon 2 ; l'échelon 1 (dossier presque droit, vers lequel renvoient `Dos` n2 et la ligne Grossesse) est contredit. Même correction que A1 (photo seulement pour `developpe-epaules-banc-sans-dossier`). À corriger.

**A3. ecarte-couche-halteres, Photo : coudes plus pliés que la consigne.** Dumbbell_Flyes/1 : coudes nettement fléchis, mains en position basse ; la consigne dit « coudes à peine pliés et fixes » et la fiche en fait une règle de sécurité (coude n1, signes d'arrêt). La ligne dit « garde-les à peine pliés » mais reste `oui`. Règle 12. À corriger (photo 0 seule, ou `à vérifier` pour la photo 1).

**A4. developpe-couche-halteres, Photo : prise paumes vers les pieds seulement.** Dumbbell_Bench_Press-0 montre la prise classique ; la photo à prise neutre a été écartée (marque de machine). Il n'existe donc aucune image de la variante `developpe-couche-halteres-prise-neutre`, qui est justement la variante vers laquelle renvoie la case Poignet n1 et la « version plus douce ». Lier les photos à la variante `...-classique` seulement, et prévoir une illustration ou une mention pour la prise neutre. À corriger.

**A5. extension-triceps-couche-halteres, Photo : bras inclinés vers l'arrière.** Lying_Dumbbell_Tricep_Extension-0.webp : les bras partent nettement derrière la verticale, haltère tout près de la tête et du visage ; la consigne demande les coudes vers le plafond, bras fixes verticaux (c'est le point sensible R9 de la fiche). La légende le dit (« garde-les verticaux ») mais la photo reste `oui`. À corriger (ou `à vérifier`, ou illustration).

**A6. montee-sur-banc, cases de zone : moins restrictif que la fiche pilote de la box haute, note genou-n2 inexacte.**
- montee-sur-marche (pilote) remplace la box haute (« Box ou banc stable, plus haut qu'une marche ») par la marche dès le niveau 1 pour la hanche et la cheville, et dès le niveau 1 pour le genou. Le banc est la même hauteur ou plus ; la fiche a pourtant Hanche n1 `garder` et Cheville n1 `garder`. Une personne qui signale une gêne légère à la hanche ou à la cheville obtient le banc, alors que le pilote lui retire la box haute. Genou n1 est correctement `adapter: variante:montee-sur-marche-poids-du-corps`.
- La note genou-n2 dit « la marche basse est elle-même limitée par la même zone au niveau 2 » pour justifier `retirer` sans remplaçant. Or la marche a le même `adapter` à son propre niveau 1 et 2 (variante vers elle-même), et cette adaptation sert justement de cible au niveau 1 de la présente fiche. La justification contredit donc Genou n1 et Hanche n2. Le `retirer` reste plus prudent, donc sans danger ; c'est le texte qui est faux ou la règle §0 qui doit préciser « adapter vers soi-même = case neutre ».
- Correction attendue : Hanche n1 et Cheville n1 en `adapter: variante:montee-sur-marche-poids-du-corps` (ou justification écrite), note genou-n2 réécrite. À corriger.

**A7. squat-gobelet-banc, ligne Coude et Poignet absentes.** Les variantes 2 (haltères le long du corps, haltère contre la poitrine) font porter une charge par les mains et les avant-bras. Le pilote squat-gobelet a Coude et Poignet (niveau 2 vers `squat-poids-du-corps`, niveau 3 `retirer: sans-zone`). §0 : « la fiche doit avoir une ligne pour cette zone » quand l'exercice charge la zone (relecteur n° 45). Ici « zone non listée = garder » : une gêne nette au poignet n'adapte pas l'exercice. Ajouter les deux zones avec `adapter: variante:squat-banc-sans-charge` au niveau 2 et `retirer: sans-zone:squat-banc-sans-charge` au niveau 3. À corriger.

## Mineurs
- **M1. README du lot en retard** : statut `brouillon_coach` (les fiches sont `complete_kine`), « 26 avertissements » (le script en donne 0), « aucune photo » pour le hip thrust et « photos à vérifier » pour la montée sur banc (illustrations SVG faites), WebP « à créer » (créés). Les questions 1 (haltères sur banc) et 4 (hip thrust avec haltère) restent ouvertes dans le README sans réponse de l'utilisateur ; la fiche applique le choix prudent. Fiche : README.
- **M2. Ligne de sources hors sujet** : dips-banc-triceps et montee-sur-banc reprennent la ligne « haltère fixe de préférence, disques serrés si réglable » alors qu'aucun haltère n'est utilisé.
- **M3. « Vertige, même léger » non harmonisé** : la règle C4 dit que cette consigne est identique partout. Elle figure dans developpe-epaules-assis-dossier-incline et rowing-poitrine-appuyee-banc, pas dans elevation-laterale-assis-halteres, extension-triceps-assis-halteres, extension-triceps-couche-halteres, hip-thrust-banc (ces fiches ont pourtant une ligne Cou ; R5 cite « vertige » sans « même léger »). Choix prudent, à harmoniser.
- **M4. Poignet** : pas de ligne Poignet dans elevation-laterale-assis-halteres et extension-triceps-assis-halteres (haltère tenu par les mains) alors que l'extension couchée en a une. Curl incliné et rowing : Poignet n1 `garder` alors que la prise marteau / neutre (déjà au même échelon) serait plus douce ; remarque de cohérence avec les trois fiches de développé.
- **M5. Variante cible qui demande `banc_inclinable`** : developpe-epaules-assis-dossier-incline (Dos n2, Grossesse), developpe-incline-halteres (Dos n2) renvoient vers une variante à dossier réglable. Un profil avec `banc` seul n'a pas ce matériel : comportement du générateur à préciser (retrait ?).
- **M6. squat-gobelet-banc** : notes « banc plus haut » (genou, cuisse, aine) alors qu'un banc a une hauteur fixe (il faut dire « support plus haut ») ; aine-n2 « pieds à largeur des épaules » est déjà la consigne par défaut ; photo 1 sur un tabouret bas (écart déjà signalé).
- **M7. Portée des études** : Maeo 2023 (poulie, bras levé à la verticale de la tête) est appliquée à l'extension couchée, où les bras sont à la verticale du buste : l'affirmation « bras au-dessus de la tête » est une extrapolation, déjà limitée par « ne porte pas sur cet exercice précis ». Lauver 2016 : seul le résumé a été lu ; la précision « haut du pectoral » (developpe-incline) n'est pas dans le résumé que j'ai lu.
- **M8. Échelons sans ligne de source propre** : hip-thrust-banc (haltère sur les hanches, une jambe) et dips-banc-triceps (pieds surélevés) sont couverts seulement par la ligne générale « échelons : choix de coach ». Ajouter une ligne NON SOURCÉ pour le port de charge sur les hanches (serviette) et la limite de 90 degrés est déjà marquée.
- **M9. Photos, détails** : Incline_Dumbbell_Curl-0 montre un curl alterné (une main en haut) alors que la ligne dit « bras pendants » ; Incline_Dumbbell_Press-0 est à environ 45 degrés (échelon 2) et sert aussi la pente douce de 30 degrés ; Dumbbell_Incline_Row-0 : le recadrage semble fait (tête entière) mais des machines et une personne restent à l'arrière-plan ; un logo de marque est lisible sur des vêtements dans plusieurs photos (règle 12 vise les visuels d'une autre app : pas une violation stricte, à noter pour la page crédits).
- **M10. Grossesse, formulations** : extension-triceps-assis-halteres garde « ventre gainé, côtes rentrées » (consignes) alors que G5 demande respiration continue et évite la pression abdominale ; la note grossesse le dit en partie (« respiration continue »). Reformuler « sans bloquer la respiration ».

## Tableau par fiche : statut proposé
Règle : `utilisable` si 0 bloquant et réserves limitées à des choix prudents NON SOURCÉ ; `verifie` si aucune réserve. Aucune fiche n'est `verifie`. Pour les fiches avec un « à corriger », le statut `utilisable` ne doit être posé qu'après correction par l'auteur et recontrôle (cycle de CLAUDE.md) ; elles restent `complete_kine` d'ici là.

| Fiche | Bloquant | À corriger | Mineurs | Statut proposé |
|---|---|---|---|---|
| curl-incline-halteres | 0 | 0 | M4, M9 | utilisable |
| developpe-couche-halteres | 0 | A4 | M7 | complete_kine, puis utilisable après A4 |
| developpe-epaules-assis-dossier-incline | 0 | A2 | M3 (déjà conforme), M5 | complete_kine, puis utilisable après A2 |
| developpe-incline-halteres | 0 | 0 | M5, M7, M9 | utilisable |
| dips-banc-triceps | 0 | A1 | M2, M8 | complete_kine, puis utilisable après A1 |
| ecarte-couche-halteres | 0 | A3 | aucun | complete_kine, puis utilisable après A3 |
| elevation-laterale-assis-halteres | 0 | 0 | M3, M4 | utilisable |
| extension-triceps-assis-halteres | 0 | 0 | M3, M4, M10 | utilisable |
| extension-triceps-couche-halteres | 0 | A5 | M3, M7 | complete_kine, puis utilisable après A5 |
| hip-thrust-banc | 0 | 0 | M3, M8 | utilisable (illustration SVG cohérente : poids du corps, deux poses, alignement buste-cuisses) |
| montee-sur-banc | 0 | A6 | M2 | complete_kine, puis utilisable après A6 (illustration SVG cohérente : sans haltères, pied entier sur le banc) |
| rowing-poitrine-appuyee-banc | 0 | 0 | M4, M9 | utilisable |
| squat-gobelet-banc | 0 | A7 | M6 | complete_kine, puis utilisable après A7 |

Aucun point bloquant ; rien ne passe en `verifie`. Les 6 fiches « complete_kine, puis utilisable » sont à renvoyer à leur auteur (`kine` pour A6 et A7 ; `coach` pour les photos A1 à A5, avec décision de l'utilisateur si une illustration est préférée), puis à recontrôler.
