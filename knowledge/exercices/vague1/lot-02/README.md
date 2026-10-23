# Lot 02 (vague 1) : préparation et prévention des familles de sports, 24 fiches
Rédigé par `coach` le 22/10/2026 (étape 2 de CAMPAGNE.md). Statut de toutes les fiches : `brouillon_coach`. La section « Sécurité et contre-indications » est au gabarit « À compléter par `kine` » (avec une ligne de points de vigilance en texte libre, non codée). `npm run check:fiches` ne signale que les 72 manques de catégorie `securite` (3 par fiche : tableau, Grossesse, Version plus douce) ; aucune autre erreur, 0 avertissement.
Format : knowledge/format-fiches.md. Photos : free-exercise-db seulement ; aucune image regardée, donc « à vérifier » (non affichée) ou « aucune photo » avec raison. Aucun WebP créé.
Sources : sports.md pour les principes (FIFA 11+ : Thorborg 2017 ; nordique : méta-analyse 2018 ; épaule OSTRC : Andersson 2017 ; danse/volley : règles de conception 4 et 5, PROVISOIRE) ; free-exercise-db lue en ligne le 22/10/2026 (PROVISOIRE : base d'exercices). **Aucune de ces sources ne détaille le contenu du FIFA 11+ ni du programme OSTRC** : la présence de chaque exercice dans ces programmes est écrite NON SOURCÉ. Le reste (mouvements sans entrée libre, échelons, niveaux, muscles) est NON SOURCÉ, choix de coach. `source_brouillon: []` partout (ajouts hors du brouillon, aucun identifiant M vérifié).

## Liste
| id | nom | schéma | niveau min | échelons | matériel (tags) | famille / prévention | statut des sources |
|---|---|---|---|---|---|---|---|
| nordique-ischios | Exercice nordique des ischios | charnière | intermédiaire | 3 | poids_du_corps, tapis (+ partenaire ou meuble : voir Q1) | foot, ischios | OK (programmes avec nordique) ; mouvement PROVISOIRE |
| curl-ischios-serviette | Curl des ischios sur une serviette | charnière | débutant | 2 | tapis, serviette | foot, ischios (régression du nordique) | NON SOURCÉ |
| equilibre-unipodal | Équilibre sur une jambe | mobilité | débutant | 3 | poids_du_corps, mur, serviette | danse, volley, FIFA 11+ | NON SOURCÉ ; règle 4 PROVISOIRE |
| reception-saut-stabilisee | Réception de saut contrôlée | saut | débutant | 3 | poids_du_corps, marche_escalier | danse, volley | NON SOURCÉ ; règle 4 PROVISOIRE |
| saut-vertical | Saut vertical | saut | débutant | 2 | poids_du_corps | volley, danse | PROVISOIRE (Rocket_Jump, Freehand_Jump_Squat) |
| saut-longueur-pieds-joints | Saut en longueur pieds joints | saut | débutant | 2 | poids_du_corps | foot, danse | PROVISOIRE (Standing_Long_Jump) |
| saut-lateral-patineur | Saut latéral | saut | débutant | 3 | poids_du_corps | foot, raquettes | PROVISOIRE (Lateral_Bound) ; niveau changé, tracé |
| saut-fendu-alterne | Saut fendu | saut | intermédiaire | 2 | poids_du_corps | volley, hand | PROVISOIRE (Split_Jump) ; niveau changé, tracé |
| rebonds-chevilles | Rebonds sur les chevilles | saut | débutant | 2 | poids_du_corps | danse, volley | NON SOURCÉ |
| releve-mollets | Montée sur la pointe des pieds | squat (`substitut`) | débutant | 3 | mur, marche_escalier, elastique | danse, volley, chevilles | PROVISOIRE (deux entrées libres) |
| cheville-elastique | Renforcement de cheville à l'élastique | mobilité (`substitut`) | débutant | 1 | elastique, chaise | danse, volley, chevilles | NON SOURCÉ |
| rotation-externe-epaule | Rotation externe de l'épaule | tirage H | débutant | 1 | elastique ; halteres, tapis | volley, raquettes, OSTRC | PROVISOIRE (External_Rotation, avec ou sans bande) |
| oiseau-halteres | Oiseau (écartement vers l'arrière) | tirage H | débutant | 2 | chaise ; halteres ; banc_inclinable | OSTRC | PROVISOIRE (Reverse_Flyes) |
| ytw-sol | Lever de bras en Y, T et W | tirage H | débutant | 2 | tapis ; halteres | OSTRC | NON SOURCÉ |
| pompe-plus | Pompe plus | poussée H | débutant | 3 | mur, tapis | OSTRC (dentelé antérieur) | NON SOURCÉ |
| glissement-mur-epaules | Glissement des bras contre le mur | mobilité | débutant | 1 | mur ; tapis | volley, raquettes | NON SOURCÉ |
| ouverture-livre-thoracique | Ouverture du livre | mobilité | débutant | 2 | tapis | raquettes, golf | NON SOURCÉ ; famille PROVISOIRE |
| rotation-russe | Rotation russe | rotation | intermédiaire | 3 | tapis ; halteres | raquettes, foot | PROVISOIRE (Russian_Twist) |
| mobilite-hanches-90-90 | Mobilité des hanches en 90/90 | mobilité | débutant | 2 | tapis | foot, raquettes | NON SOURCÉ |
| squat-sumo | Squat sumo | squat | débutant | 2 | poids_du_corps ; halteres ; kettlebell | adducteurs, aine | PROVISOIRE (Plie_Dumbbell_Squat) |
| copenhague-court | Planche latérale de Copenhague | gainage | intermédiaire | 2 | chaise, tapis | foot, adducteurs, aine | NON SOURCÉ |
| fente-laterale | Fente latérale | fente | débutant | 2 | poids_du_corps ; halteres | foot, raquettes, adducteurs | NON SOURCÉ |
| fente-avant | Fente avant | fente | débutant | 2 | poids_du_corps ; halteres | foot, raquettes (freinages) | PROVISOIRE (deux entrées libres) |
| marche-laterale-elastique | Marche latérale à l'élastique | squat (`substitut`) | débutant | 2 | elastique | foot, genou | NON SOURCÉ |

## Couverture apportée (fiches utilisables par profil ; tout reste « non vérifié » tant que `relecteur` et l'utilisateur n'ont pas validé)
- Saut : 6 fiches de plus, toutes en profil A (poids du corps) ; seule la réception sur une marche demande la marche d'escalier. Le schéma saut n'avait aucune fiche (pilote et lot-01).
- Rotation : 1 fiche (rotation russe, intermédiaire) ; mobilité thoracique en renfort. Manque une rotation débutant (anti-rotation déjà couvert au lot-01) et une rotation à l'élastique ancré.
- Mobilité : 5 fiches (équilibre, cheville élastique `substitut`, glissement mural, ouverture du livre, hanches 90/90) ; avec la cheville au mur du pilote, mobilité thoracique, hanches et chevilles sont couvertes en A.
- Tirage (épaule) : 3 fiches rotateurs/dos du haut (rotation externe B, oiseau C, Y-T-W A).
- Squat : sumo (A, C) ; fente : avant et latérale (A, C) ; charnière : nordique, curl ischios.
- Gainage : copenhague (A + chaise).
- Prévention ischios, aine, genou, cheville, épaule : couvertes par plusieurs fiches liées à sports.md.

## Points à traiter par `kine` (avant tout autre)
- Zones : cheville et tendon d'Achille (sauts, rebonds, mollets, équilibre), genou (réceptions, fentes, sauts, nordique à genoux), aine (copenhague, fente latérale, sumo), épaule (rotation externe, Y-T-W, pompe plus, glissement mural), ischios (nordique, curl), dos (rotation russe, oiseau), cou (Y-T-W).
- Sauts et réceptions : pas de saut en cas de grossesse (à classer par `kine`), plafond, bruit, escalier (R8) pour la réception sur marche.
- Élastique : contrôle avant usage ; nordique : partenaire ou meuble lourd qui bloque les chevilles.
- Regroupement à vérifier : nordique de niveau intermédiaire mais curl serviette débutant en régression ; vérifier que les cases d'une fiche plus dure ne sont jamais plus permissives que celles de la fiche plus facile.
- Les cases `variante:<id>` ne peuvent citer que des variantes du lot ou des fiches du lot ; une fiche citée plus facile hors lot (pilote/lot-01) reste lisible grâce à la vérification globale du script.

## Points de rédaction à ne pas oublier
- Aucune durée, distance, hauteur, nombre de sauts ou de répétitions n'est donné (aucune valeur sourcée).
- Niveaux changés par rapport à la source libre (tracés dans « Sources ») : saut-lateral-patineur (Lateral_Bound débutant, échelon 2 mis intermédiaire), saut-fendu-alterne (Split_Jump débutant, mis intermédiaire).
- Consignes du type « le genou ne doit pas dépasser les orteils » (présentes dans Dumbbell_Lunges) volontairement non reprises.
- Nom d'identifiant : la fiche `reception-saut-stabilisee` ne s'appelle pas `...-controlee` car `tools/validate-fiches.mjs` ignore tout fichier dont le nom contient « controle » (filtre prévu pour CONTROLE-relecteur.md) ; à corriger dans l'outil par `dev` (regex trop large).

## Questions pour l'utilisateur
1. **Partenaire ou point d'ancrage** (nordique) : aucun tag de `materiel-tags.json` ne dit « un partenaire tient mes chevilles / un meuble lourd bloque mes pieds ». La fiche est proposée en profil A. On ajoute un tag (par exemple `partenaire_ou_ancrage`), ou on réserve le nordique aux personnes qui le déclarent ?
2. **Saut au programme** : les 6 fiches de saut sont à poids du corps mais à impact. On les propose à tout profil (avec `kine`), ou seulement aux personnes ayant coché un sport de saut (volley, danse, basket, hand, foot) ?
3. **Équilibre yeux fermés** : non proposé (risque de chute sans surveillance). D'accord ?
4. **Liste des muscles** : les rotateurs de l'épaule (coiffe), les péroniers et le tibial postérieur n'existent pas dans la liste du format. On les ajoute (`coiffe_des_rotateurs`, `peroniers`) dans format-fiches.md et le script, ou on garde les muscles proches par défaut ?
5. **Fiches `substitut`** : releve-mollets, marche-laterale-elastique (rangées sous « squat ») et cheville-elastique (sous « mobilité ») ne remplissent pas vraiment leur schéma. Doit-on créer un schéma `cheville_mollet` / `hanche_laterale`, ou les garder en `substitut` ?
6. **Sources manquantes** : plusieurs mouvements (copenhague, curl serviette, Y-T-W, pompe plus, équilibre) restent NON SOURCÉ. Veux-tu que `coach` cherche des essais publiés (Copenhagen adduction, programmes d'épaule) au prochain passage ?

### Corrections `coach` après contrôle `relecteur` (22/10/2026)
- **Question 8, décision prudente en attendant l'utilisateur** : saut-vertical, saut-longueur-pieds-joints et rebonds-chevilles passent en `intermediaire` dès l'échelon 1 (niveau_min compris) ; saut-fendu-alterne l'était déjà. Seules reception-saut-stabilisee (entrée du schéma) et le pas glissé de saut-lateral-patineur restent débutant. À l'utilisateur de trancher : garder ce choix, ou remettre ces sauts en débutant et faire coder par `dev` « schéma saut seulement après réception sans gêne ». Les consignes de prérequis restent « non codées ».
- marche-laterale-elastique : source proche `Monster_Walk` (id vérifié dans free-exercise-db, brouillon M1637, PROVISOIRE ; marche avant/arrière, pas latérale) ; seule une boucle fermée convient, tag `elastique` à préciser par `dev`.
- **Pour dev (R-2 du recontrôle)** : marche-laterale-elastique : la fiche dit déjà « boucle fermée, une bande avec poignées ne convient pas », mais le tag `elastique` couvre aussi la bande à poignées. Pas corrigeable dans la fiche seule : créer un tag dédié (ex. `mini_bande`) dans materiel-tags.json ou afficher la précision dans l app ; puis coach met le tag dans les deux variantes.
- releve-mollets : variante une jambe avec haltère sur marche retirée (la dérogation §7 ne vaut que pour montee-sur-marche). pompe-plus, rotation-externe-epaule, ytw-sol : `couverture: substitut`.
- Date de la revue danse : J Dance Med Sci vol. 30 (2026), pas 2025 (sports.md à corriger par `dev`).

### Questions de `kine` (22/10/2026, après la section Sécurité des 24 fiches ; statut des fiches : `complete_kine`)
Réponses à la question 3 : équilibre yeux fermés non proposé, `kine` est d'accord. Aucune nouvelle source n'a été lue pour cette passe : les lignes de sécurité sont NON SOURCÉ ou PROVISOIRE (grossesse, post-partum) et à contrôler par `relecteur`.
7. **Zones manquantes** : l'app n'a ni « cuisse (arrière) », ni « aine », ni « tendon d'Achille ». Les fiches renvoient aux zones hanche, genou ou cheville (texte affiché dans chaque fiche). On ajoute des zones (`cuisse`, `aine`) dans le format et le script, ou on garde ce regroupement ?
8. **Prérequis des sauts** : `kine` ne veut aucun saut pour un débutant sans prérequis (réception contrôlée, squat sans gêne), mais le format n'a pas de champ « prérequis ». Les fiches saut-vertical, saut-longueur-pieds-joints, saut-lateral-patineur, reception-saut-stabilisee et rebonds-chevilles sont `debutant` : on les passe en `intermediaire` (sauf reception-saut-stabilisee, qui sert d'entrée), ou `dev` code la règle « schéma saut seulement après réception sans gêne » ?
9. **Blessure récente aux ischios** : l'app ne connaît pas la date d'une gêne. Le nordique est donc retiré dès le niveau 1 à la hanche ou au genou, avec le curl sur serviette en remplaçant au niveau 1. D'accord, ou on veut une case « récente (moins de X semaines) » dans le profil ?
10. **Départage de deux `adapter: variante` différents** (ex. genou n1 vers une variante, dos n2 vers une autre) : les fiches du lot évitent la plupart des conflits, mais la règle de `dev` n'est pas écrite. Proposition de `kine` : le niveau le plus élevé gagne, puis la variante d'échelon le plus bas.
11. **Grossesse, fente latérale et rotations** : choix prudent (retrait de la fente latérale, de la rotation russe, du Copenhague, du nordique, de tous les sauts). Les fentes avant sont gardées avec squat fendu à la main au mur. Pour confirmation, car la HAS ne détaille pas ces exercices.

## Validation utilisateur
Validé par l'utilisateur le 22/10/2026 (décision D5 : relecture des 102 fiches sur la page de relecture ; ne lève pas un bloquant sécurité de relecteur). Fiches sans bloquant en `utilisable`.

## Consignes d'image à respecter (D13, 23/10/2026)
- curl-ischios-serviette : les fesses restent décollées du sol pendant toute la série (position de pont, ligne droite épaules-genoux) ; talons sur la serviette, jambes qui glissent vers l'avant puis reviennent. Source : curl des ischios en glissant, bassin haut ; une image avec les fesses au sol est fausse.
- pompe-plus : bras tendus, mains au sol ; deux positions du haut du dos, affaissé (omoplates rapprochées) puis poussé vers le haut (omoplates écartées, dos légèrement arrondi) ; coudes jamais pliés.
