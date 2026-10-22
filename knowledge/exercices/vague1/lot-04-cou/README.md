# Lot 04 (vague 1) : cou et arrière d'épaule, 12 fiches (décision D10)
Rédigé par `coach` le 22/10/2026. Statut des fiches : `controle_relecteur`. Format : knowledge/format-fiches.md. `npm run check:fiches` : 0 erreur, 0 avertissement (114 fiches).
**La section « Sécurité et contre-indications » est une version de prudence minimale écrite par `coach`, marquée « À COMPLÉTER PAR KINE »** (le validateur passe : format strict respecté). `kine` doit la reprendre fiche par fiche (zones, signes d'arrêt, grossesse) avant le contrôle de `relecteur`.

## Fiches
| id | schéma | niveau | zone cou (n1 / n2 / n3) | image |
|---|---|---|---|---|
| rotation-douce-cou | mobilité | débutant | **douce** : garder / amplitude réduite / retirer | illustration |
| inclinaison-douce-cou | mobilité | débutant | **douce** : garder / amplitude réduite / retirer | illustration |
| retraction-cervicale (menton rentré) | mobilité | débutant | **douce** : garder / amplitude réduite / retirer | illustration |
| isometrique-cou (4 directions) | mobilité (type force) | débutant | non douce : maintien court / retirer / retirer | 3 photos |
| retraction-omoplates (serrer les omoplates) | tirage H (substitut) | débutant | **douce** : garder / amplitude réduite / retirer | illustration |
| face-pull-elastique | tirage H | débutant | tête alignée / tête alignée / retirer | illustration |
| oiseau-banc-incline | tirage H | débutant | tête alignée / tête alignée / retirer | 2 photos (Reverse_Flyes) |
| rotation-externe-poulie | tirage H (substitut) | débutant | (zone cou non listée) | 2 photos |
| oiseau-un-bras-appuye | tirage H | débutant | tête alignée / tête alignée / retirer | illustration |
| ecartement-serviette | tirage H (substitut) | débutant | garder / tête alignée / retirer | illustration |
| tirage-visage-sangles | tirage H | intermédiaire | tête alignée / tête alignée / retirer | illustration |
| oiseau-machine-poulie | tirage H | débutant | garder / tête alignée / retirer | 2 photos (recadrées) |

Déjà existants et NON recréés (cités en progression) : Y-T-W au sol (`ytw-sol`, lot 02), rowing léger à l'élastique (`rowing-elastique`, lot 01), rotation externe de l'épaule à l'élastique ou à l'haltère (`rotation-externe-epaule`, lot 02), oiseau aux haltères (`oiseau-halteres`, lot 02).

## Couverture « arrière d'épaule » par profil (mouvements dont le deltoïde postérieur est muscle PRINCIPAL ; `couverture.mjs` ne compte pas ce groupe, liste faite par un script jetable sur les mêmes règles de profil A-F)
| Profil | Avant le lot | Après le lot | Fiches (après) |
|---|---|---|---|
| A poids du corps | 2 | **4** | oiseau-halteres (sans charge, assis), ytw-sol, ecartement-serviette, oiseau-un-bras-appuye |
| B + élastiques | 3 | **6** | + ecartement-elastique, face-pull-elastique |
| C + haltères | 2 | **4** | oiseau-halteres, ytw-sol, ecartement-serviette, oiseau-un-bras-appuye |
| D | 3 | **6** | B + oiseau avec haltères |
| E | 3 | **8** | D + oiseau-banc-incline, tirage-visage-sangles |
| F | 3 | **9** | E + oiseau-machine-poulie (+ rotation-externe-poulie en secondaire) |
Aucun profil sous 3 (les profils A et C étaient à 2). Les tirages (rowings) comptent le deltoïde postérieur en secondaire : ils ne sont pas comptés ici.

## Sources (voir chaque fiche)
- Cou : Blanpied et al., JOSPT 2017 (lignes directrices, grade B) et Gross et al., Cochrane 2015 (27 essais) : **résumés et extraits seulement**, texte intégral non lu (PubMed et le PDF de l'APTA ont refusé l'accès) : PROVISOIRE. Blomgren 2018 (entraînement des fléchisseurs profonds) : résumé seulement. L'exercice précis (rentrer le menton, rotations, inclinaisons douces) n'est PAS dans ces sources : NON SOURCÉ ou PROVISOIRE selon la fiche. Pas de source lue sur les signes d'alerte du cou : le texte de D10 est repris (fourmillements, perte de force, choc, maux de tête inhabituels) ; seuls engourdissement, perte de force et choc rejoignent S2 de regles-securite-communes.md ; maux de tête et vertige : NON SOURCÉ.
- Arrière d'épaule : Reinold et al., JOSPT 2004 (EMG, 10 sujets sains) : résumé seulement ; free-exercise-db (Face_Pull, Reverse_Flyes, External_Rotation_with_Cable, Reverse_Machine_Flyes, Isometric_Neck_Exercise, Band_Pull_Apart) : PROVISOIRE. Aucune étude trouvée sur le tirage au visage à l'élastique : NON SOURCÉ.

## Images (D6)
- Photos libres regardées le 22/10/2026 (curl + Read) : isométriques du cou (3 images sur 4 retenues), rotation externe à la poulie (2), oiseau à la machine (2, recadrées pour retirer le logo de la machine), `Reverse_Flyes` réutilisée pour l'oiseau sur banc incliné (2). WebP ajoutés dans public/photos/free-exercise-db/ et lignes ajoutées dans tools/photos.md.
- Photos écartées : `Side_Neck_Stretch` (la main tire la tête, contraire à la consigne douce), `Face_Pull` (poulie avec logo d'un tiers, la fiche est à l'élastique), `Bent_Over_Dumbbell_Rear_Delt_Raise_With_Head_On_Bench` (debout, front sur le banc, pas poitrine appuyée), `Isometric_Neck_Exercise_-_Sides/0` (départ peu lisible).
- 8 illustrations originales créées dans tools/illustrations-poses.mjs (`node tools/make-illustrations.mjs <id>`) : rotation-douce-cou, inclinaison-douce-cou, retraction-cervicale, retraction-omoplates, face-pull-elastique, oiseau-un-bras-appuye (vue de dessus), ecartement-serviette (vue de dessus), tirage-visage-sangles. Les illustrations de cou sont schématiques (tête sans visage) ; rendu vérifié en PNG, à faire relire par `coach`/`kine` comme les autres.

## Questions pour l'utilisateur / pour `dev` (choix prudent déjà appliqué, rien ne bloque)
1. **Muscles du cou absents de la liste de format-fiches.md** : j'ai mis `trapezes` en principal et `erecteurs_rachis` en secondaire pour les fiches de cou. Veut-on ajouter des muscles « fléchisseurs du cou » et « extenseurs du cou » à la liste (et au script) ?
2. **Marquer une fiche « douce pour la zone cou »** : le format n'a aucun champ prévu ; j'ai écrit la mention dans les notes (« FICHE DOUCE POUR LA ZONE COU (niveaux 1 et 2) », ligne `general :`). Le générateur ne peut pas la lire de façon fiable : `dev` doit ajouter un champ de frontmatter, par exemple `doux_pour: [cou]` (valeurs = zones), vérifié par `validate-fiches.mjs`, puis l'écrire dans regles-securite-communes.md pour `dev`. Fiches concernées : rotation-douce-cou, inclinaison-douce-cou, retraction-cervicale, retraction-omoplates.
3. **Schéma des exercices de cou** : il n'existe pas de schéma « cou ». J'ai utilisé `mobilite` pour les rotations, inclinaisons, rétraction cervicale et isométriques (type `force` pour ces derniers), pour ne pas polluer `gainage` ou `tirage_h`. Faut-il un schéma `cou` dédié, que le générateur n'utilise que pour la zone cou gênée ou à la demande ? Risque tant que ce n'est pas fait : le générateur peut proposer la rotation du cou comme mobilité d'échauffement.
4. **Oiseau sur banc incliné** : `oiseau-halteres` (lot 02) a déjà une variante `oiseau-halteres-banc-incline`. D10 demande une fiche dédiée : créée (`oiseau-banc-incline`, avec une variante sans charge), donc deux fiches se recouvrent pour le profil E ou F. On garde les deux, ou on retire la variante banc de `oiseau-halteres` ?
5. **Isométriques du cou** : j'ai refusé la mention « douce » (le cou travaille sous effort) et retiré l'exercice dès le niveau 2. `kine` peut décider autrement. Aucune pression, durée ni nombre de secondes n'est donnée (aucune source).
6. **Rotation externe à la poulie** : en `substitut` (schéma tirage H, comme `rotation-externe-epaule`), car il n'existe pas de schéma « épaule » ; elle ne compte donc pas comme tirage horizontal complet.
7. **Tirage aux sangles** : mis en `intermediaire` par prudence (suspension, ancrage) ; NON SOURCÉ.
8. **Cou après un coup du lapin ou un choc** : les fiches de cou disent de ne pas les faire avant avis d'un professionnel (extension de S2) ; à valider par `kine` et à ajouter dans regles-securite-communes.md (D10 le demande : fait seulement dans les fiches, pas encore dans ce fichier).

## Ce qui reste à faire
- `kine` : compléter et valider la section sécurité des 12 fiches (marqueur « À COMPLÉTER PAR KINE »), signes d'alerte du cou dans regles-securite-communes.md, fiches douces.
- `relecteur` : contrôle à neuf (fidélité aux sources lues par résumé : Blanpied, Cochrane, Reinold à relire dans le texte intégral).
- Statut des fiches : `controle_relecteur` jusqu'à ce contrôle.
