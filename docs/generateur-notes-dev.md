# Générateur v1 : notes de `dev` (F3)

Code : `src/generator/` (API `generateProgram(input)` dans `index.ts`) ; réglages NON SOURCÉ / PROVISOIRE : `src/generator/config.ts` (DÉFAUT-1 à DÉFAUT-5 de knowledge/generateur-v1.md §10.1) ; tests : `tests/unit/generator.test.ts` (T1-T47 + propriétés) ; démo : `node tools/demo-generateur.mjs`.

## Ambiguïtés rencontrées et choix prudent
1. **T41, 3e cas** (3 jours demandés, seuls vendredi, samedi, dimanche libres) : le test attend « aucun programme », mais la règle §2.4 (écart minimal >= 2 jours) accepte vendredi + dimanche (48 h, puis 5 jours). Code : la règle §2.4 est appliquée (2 séances vendredi et dimanche + V-MSG-JOURS), car elle respecte les 48 h. **À trancher par `coach`** ; si le refus est voulu, changer le test et `chooseDays`.
2. **Cible `adapter: variante:<id>` ou `retirer: remplacant:<id>` dans une autre fiche** (ex. squat-gobelet genou n2 -> squat-poids-du-corps) : traitée comme un remplaçant, avec les mêmes contrôles (filtres de §6, jamais lui-même adapté ou retiré, ligne cuisse/aine exigée). Id de fiche = sa variante d'échelon le plus bas permise (aussi pour `remplacant` et `sans-zone`).
3. **Variante imposée impossible** (« variante suivante qui convient ») : la plus haute variante de la même fiche d'échelon <= celui de la cible (donc plus facile) ; sinon la fiche est écartée (autre fiche du même schéma). Cible dans une autre fiche impossible : la fiche est écartée.
4. **Remplaçant d'un schéma différent** (pompe-piquee -> pompe-chaise) : compté comme repli b (autre plan) ; un remplaçant hors du groupe n'est pas placé.
5. **`capped` d'un remplaçant** : capped si la fiche placée OU la fiche d'origine est capped (le plafond « suit la fiche », lecture la plus prudente).
6. **Ligne Grossesse** : traitée comme une zone de niveau 4 (prioritaire quand deux `adapter: variante:` s'opposent).
7. **Échauffement** : une fiche n'est permise que si toutes ses cases actives sont `garder` ou `adapter` sans remplacement (amplitude, appui, variante de la même fiche d'échelon 1) ; E3 « échelon inférieur » seulement pour une fiche placée sans adaptation ni remplacement, sinon même échelon. Si aucune fiche cardio ne passe, E1 reste compté (120 s) dans la durée.
8. **Fiche douce cou** (niveaux 1-2) : remplace la 2e fiche E2.
9. **« Sans limite »** : D = 75 min pour la garantie T <= D ; l'« ajout » d'emplacements vise 60 min (durée cible affichée). Grossesse : 60 min.
10. **Ajout** : seulement si aucune action de réduction n'a été appliquée à la séance (sinon on re-ajouterait ce qu'on vient de retirer).
11. **V-PLAF (20 séries/muscle/semaine, 10 par séance)** : appliqué comme plafond général (pas seulement aux ajouts de V-VOL) : baisse d'une série sur l'exercice le moins prioritaire (jamais sous 2), sinon retrait d'un accessoire.
12. **V-VOL** : seulement « +1 série » ; l'ajout d'emplacements est déjà fait par l'« ajout » de §4.4.
13. **Emplacements accessoires** (poussee_2, tirage_2, jambes_2) : replis a et c seulement (pas d'autre plan, qui doublerait l'emplacement 1) ; messages de repli (PLAN, SUBST, IMPOS, ZONE) seulement pour le noyau.
14. **Cause « santé »** (V-MSG-ZONE) : calculée en relançant le remplissage sans blessures ni grossesse ; zones citées = zones qui retirent une fiche qui aurait convenu ; V-MSG-ZONE affiché aussi pour les replis b, c, d de cause santé.
15. **V-MSG-FREQ, partie « Pour corriger »** : durée -> « allonger la séance à X min » (palier suivant ; 75 min : « ajouter un jour » en 2 jours) ; matériel -> « ajouter du matériel » ; cause santé : pas de proposition (la phrase s'arrête au repère).
16. **Rotation A/C** (§2.3 vs clé 6 de §6.7) : C prend la 1re fiche non utilisée en A, seulement si elle est au même niveau de repli et sans adaptation de plus (la rotation ne dégrade jamais la sécurité).
17. **Avancé, famille muscle, réserve 1** : variantes sans poids libre (chargées seulement par machine/poulie, ou poids du corps/élastique).
18. **V-TEMPS** : `rirTarget` = 3 (jamais 0) avec `rirAsked = false` (pas de question RIR) ; grossesse : séries G5, maintiens inchangés.
19. **Objectif inconnu** -> famille `sante` ; `forme` = sante ; préfixe « en attendant la version dédiée » pour perte de gras, cardio, endurance, sport, mobilité, fonctionnel. Jours non renseignés -> V-MSG-HORS.
20. **Unilatéral** : liste stricte du §4.4 (`squat-fendu`, `montee-sur-marche` ne sont pas comptés unilatéraux) ; à remplacer par un champ de fiche `unilateral`.
21. Messages ajoutés (hors §8.2) : `V-MSG-DUREE-MIN` (durée < 20 min), `V-MSG-OBJ` (phrases de V-OBJ), `R3`, `C3`.

## Couverture (node, 23/10/2026) : programme / avertissement V-MSG-FREQ / aucun programme
Objectif muscle, 45 min, maison et salle x 2-3 jours x 3 niveaux (12 cas par case ; zones : 10 zones x 12 = 120).

| Profil | sans gêne | grossesse | post-partum | cou n2 | cou choc | zones n1 | zones n2 | zones n3 |
|---|---|---|---|---|---|---|---|---|
| A0 | 12/0/0 | 8/4/0 | 8/4/0 | 12/0/0 | 0/12/0 | 120/0/0 | 120/0/0 | 36/72/12 |
| A | 12/0/0 | 8/4/0 | 8/4/0 | 12/0/0 | 12/0/0 | 120/0/0 | 120/0/0 | 48/60/12 |
| B | 12/0/0 | 8/4/0 | 8/4/0 | 12/0/0 | 12/0/0 | 120/0/0 | 120/0/0 | 48/60/12 |
| C | 12/0/0 | 12/0/0 | 12/0/0 | 12/0/0 | 12/0/0 | 120/0/0 | 120/0/0 | 48/60/12 |
| D | 12/0/0 | 12/0/0 | 12/0/0 | 12/0/0 | 12/0/0 | 120/0/0 | 120/0/0 | 48/60/12 |
| E | 12/0/0 | 12/0/0 | 12/0/0 | 12/0/0 | 12/0/0 | 120/0/0 | 120/0/0 | 48/68/4 |
| F | 12/0/0 | 12/0/0 | 12/0/0 | 12/0/0 | 12/0/0 | 120/0/0 | 120/0/0 | 48/68/4 |

« Aucun programme » en n3 = surtout `dos` niveau 3 (V-MSG-PRO, 3 emplacements du noyau vides). Grossesse sans haltères : tirage souvent impossible (fiches couchées retirées) -> V-MSG-FREQ.

## Limites connues
- Pas d'UI (F4-F7) ; préférences (favoris/masqués) prévues en option mais non saisies.
- Historique : seule la dernière charge sans douleur est lue (double progression : phase 3).
- Durée « sans limite » et options « gagner du temps » / « ajouter du fonctionnel » : à brancher dans le profil.
