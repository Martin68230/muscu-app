# Décisions de l'utilisateur pour la campagne fiches
Chaque décision « à appliquer » est prioritaire sur l'ordre des lots de CAMPAGNE.md. Une fois faite, remplacer « à appliquer » par « appliquée le <date heure> (commit) ».

## 22/10/2026 matin

### D1. Nouveau statut « utilisable » : appliquée le 22/10/2026 08:20 (commit D1)
- `utilisable` = 0 point bloquant au contrôle de relecteur, 0 erreur à `npm run check:fiches`, et réserves restantes limitées à des choix prudents marqués NON SOURCÉ.
- Le générateur peut utiliser les fiches `utilisable` (en plus de `verifie`). CLAUDE.md règle 22 est déjà mise à jour.
- Chaîne des statuts : `brouillon_coach` -> `complete_kine` -> `controle_relecteur` -> `utilisable` -> `verifie`.
- `dev` : ajouter `utilisable` à tools/validate-fiches.mjs (liste STATUTS) et à knowledge/format-fiches.md, mettre à jour knowledge/exercise-catalog.md §2 (niveaux de bibliothèque), et adapter tools/couverture.mjs pour compter séparément `utilisable` et `verifie` (et un total des deux) par profil A-F x schéma. Corriger au passage le point signalé : validate-fiches.mjs ignore tout nom de fichier contenant « controle ».
- Règle de fin de lot à partir de maintenant : `verifie` si aucune réserve ; `utilisable` si les conditions ci-dessus sont remplies ; sinon `controle_relecteur`.

### D2. Recontrôle rapide des lots 01 et 02 : appliquée le 22/10/2026 08:35 (commit D2) - 102 fiches en `utilisable` (réserve : R-1 kine lot-01, R-2 tag elastique pour dev)
- `relecteur`, sur Sonnet, lancé à neuf : vérifier SEULEMENT les points corrigés après les contrôles des lots vague1/lot-01 et vague1/lot-02 (journaux de corrections des README et rapports CONTROLE-relecteur.md), pas tout le lot. Rapport : RECONTROLE-relecteur.md dans chaque lot.
- Puis passage en `utilisable` des fiches qui remplissent D1 (et `verifie` si aucune réserve). Faire de même pour le pilote et le lot-03 une fois ses corrections faites.

### D3. Réponses aux questions du lot-02 : appliquée le 22/10/2026 08:55 (commits fd0985b, 29c471f) ; fiches modifiées par kine (cuisse/aine, 17 fiches) à recontrôler par relecteur
- Nordique : nouveau tag `partenaire_ou_ancrage` (à ajouter à knowledge/materiel-tags.json et equipment-taxonomy.md §2 ; non implicite).
- Sauts : niveau `intermediaire`, avec une réception stabilisée en entrée (échelon ou prérequis noté) ; prioritaires pour les sports de saut (volley, danse, foot) dans sports.md / program-logic.md.
- Pas d'équilibre yeux fermés (retirer les échelons ou variantes concernés).
- Ajouter les muscles `coiffe_des_rotateurs` et `peroniers`, les zones de sécurité `cuisse` et `aine`, les schémas `cheville_mollet` et `hanche_laterale` (format-fiches.md, validate-fiches.mjs, couverture.mjs : `dev` ; puis reclasser les fiches concernées : `coach` ; cases de sécurité des nouvelles zones : `kine`).
- `coach` cherche les sources manquantes signalées dans le lot-02.
- Pas de date de blessure dans le profil.
- Règle de départage proposée par `kine` : acceptée (l'inscrire dans regles-securite-communes.md si ce n'est pas fait).
- Grossesse : retraits prudents acceptés tels quels.

### D4. Questions du lot-01 : garder les choix prudents déjà faits (aucune action, marquer les questions « tranchées : choix prudent conservé » dans le README du lot-01).

## 22/10/2026 fin de matinée (écrit à la demande de l'utilisateur)

### D5. Validation des 102 fiches par l'utilisateur : appliquée le 22/10/2026 08:40 (commit D5)
- L'utilisateur a relu les 102 fiches (pilote, lots 01 à 03) sur la page de relecture et les VALIDE sur le fond : contenu, choix d'exercices, échelons et niveaux.
- Noter « validé par l'utilisateur le 22/10/2026 » dans le README de chaque lot. Cette validation remplace sa relecture humaine ; elle ne lève PAS un point bloquant de `relecteur` sur la sécurité : ceux-là restent à corriger normalement.
- Les fiches sans point bloquant passent en `utilisable` (règle D1) dès que `check:fiches` est à 0 erreur.

### D6. Une image pour CHAQUE fiche : appliquée le 22/10/2026 12:5x (commit D6 illustrations) ; illustrations SVG à faire relire par coach/kine
L'utilisateur veut une image partout : sans image, une fiche n'est pas parlante. Méthode, dans cet ordre :
1. **Regarder réellement les photos free-exercise-db** (domaine public) déjà citées dans chaque fiche (outil Read sur l'image) : la plupart sont « à vérifier » parce que personne ne les a regardées. Passer en `affichable : oui` celles qui montrent le bon mouvement.
2. **Écart sans risque entre photo et consigne** (ex. position des mains, angle de prise de vue) : aligner la consigne sur la photo si c'est aussi sûr et aussi efficace, ou garder la photo avec une mention courte (« ici bras derrière la tête, fais-le bras devant »). N'écarter une photo que si elle montre un mouvement différent ou dangereux.
3. **Pas de photo free-exercise-db** : chercher une image wger dont la licence de l'IMAGE est compatible (CC0, CC-BY, CC-BY-SA), avec attribution notée dans la fiche et la page « crédits ».
4. **Toujours rien** : `dev` crée une illustration simple et cohérente pour l'app (pictogramme de silhouette en SVG, même style pour toutes les fiches, positions de départ et d'arrivée). Jamais d'image d'une autre app ni d'image sous licence inconnue.
- Ajouter au script check:fiches un contrôle : chaque fiche `utilisable` ou `verifie` a au moins une image affichable (photo ou illustration).
- Faire ce travail sur les fiches existantes AVANT de lancer de nouveaux lots ; les nouveaux lots l'appliquent directement.

### D7. Matériel : tout équipement possible comme option : PARTIELLE le 22/10/2026 14:1x (écran profil matériel fait, tags déjà existants ; RESTE : fiches et variantes banc, puis barre/rack, kettlebell, sangles, poulie/machines)
- Le profil doit proposer TOUT le matériel courant comme option cochable, pas seulement le matériel de maison : banc de musculation (plat, inclinable), barre de traction, barre droite et disques, barre EZ, rack à squat, haltères fixes ou réglables (avec les poids), kettlebells, élastiques (boucle, bande longue, avec poignées), sangles de suspension (TRX, anneaux), roue abdos, swiss ball, medecine ball, step ou box, corde à sauter, gilet lesté, poulie, machines de salle, vélo ou rameur, tapis, + un champ « autre ».
- Mettre à jour knowledge/materiel-tags.json et equipment-taxonomy.md §2 avec les tags manquants (ex. `rack`, `disques`, `step`, `gilet_leste`, `sangles_suspension`, `velo_ou_rameur`), sans casser les tags existants.
- Dans les prochains lots, prévoir des fiches et variantes qui utilisent ce matériel, en commençant par le **banc** (développé couché et incliné aux haltères, rowing appuyé sur le banc, hip thrust sur le banc, dips sur banc, step-up sur banc), puis barre et rack, kettlebell, sangles de suspension, poulie et machines (profils E et F).

### D8. Validation automatique des fiches : à appliquer (dès maintenant, pour toutes les fiches présentes et futures)
- Plus besoin d'attendre l'utilisateur : quand `coach` et `relecteur` sont d'accord (0 point bloquant, 0 erreur à check:fiches, au moins une image affichable), la fiche passe directement en `utilisable` (ou `verifie` s'il ne reste aucune réserve). L'utilisateur n'a plus à relire chaque lot ; il lit seulement le bilan.
- Les questions de conception restent notées dans le README du lot avec le choix prudent appliqué, sans bloquer la fiche.

### D9. Signaler un problème depuis l'app : appliquée le 22/10/2026 14:1x (composant ReportButton, stockage, export Profil ; à brancher sur fiche et lecteur de séance quand ils existeront)
- Sur chaque fiche d'exercice et dans le lecteur de séance : un petit bouton discret « ⋯ » (trois points, dans un coin), qui ouvre un menu court avec « Signaler un problème ».
- Choix rapides : consigne pas claire, image fausse ou manquante, exercice gênant ou douloureux, matériel incorrect, autre ; + un champ de texte facultatif. Envoi en un appui, sans quitter la séance.
- Enregistré localement avec l'id de la fiche, la variante, la date et l'app hors-ligne comprise ; synchronisé avec Supabase en phase 6 (table `signalements`, visible par l'admin seulement). Un écran ou un export « signalements » permet de les donner à Claude Code pour corriger les fiches.
- Le bouton reste petit et ne gêne jamais l'action principale de l'écran (règle d'affichage D de CLAUDE.md : zone tactile de 44 px tout de même).

## 22/10/2026 08 h 45 (écrit par la session principale, demande de l'utilisateur)

### D10. Cou et arrière d'épaule : appliquée le 22/10/2026 14:0x (lot-04-cou : 12 fiches utilisable, B1 codé) ; reste : brancher filterByNeck au générateur
1. **Cou** : la zone `cou` existe dans le profil blessures, mais aucun exercice dédié. `coach` puis `kine` créent un petit lot « cou » (knowledge/exercices/vague1/lot-NN-cou/), avec sources (`kine` cherche les recommandations sur la douleur cervicale : HAS, NICE, JOSPT, Cochrane…) :
   - mobilité douce (rotations, inclinaisons) ;
   - rentrer le menton (rétraction cervicale) ;
   - isométriques du cou ;
   - renforcement du haut du dos qui va avec (ex. rétraction des omoplates, rowing léger, Y-T au sol si adapté).
   Pour l'app : jamais de diagnostic ; signes qui doivent faire consulter, à afficher dans ces fiches et à vérifier dans regles-securite-communes.md : fourmillements ou engourdissement dans le bras, perte de force, douleur après un choc, maux de tête inhabituels. Quand la zone `cou` est gênée (niveau 1 ou 2), le générateur peut proposer ces exercices doux (les marquer comme tels dans les fiches, et l'écrire dans regles-securite-communes.md pour `dev`).
2. **Arrière d'épaule** : une dizaine de fiches existent déjà ; compléter avec **face pull à l'élastique**, **oiseau sur banc incliné** (haltères) et **rotation externe à la poulie**, pour que TOUS les profils de matériel (A à F) aient au moins 3 exercices d'arrière d'épaule. Vérifier avec tools/couverture.mjs (ou une liste par profil si l'outil ne compte pas ce groupe musculaire) et combler les profils encore sous 3.

### D6-bis. Images trouvées par l'utilisateur : EN COURS (22/10 12:5x : aucun dépôt dans images-a-trouver/ ; étape wger non faite ; illustrations SVG déjà posées en attendant, à remplacer si l'utilisateur dépose mieux)
- Dossier `images-a-trouver/` à la racine du projet (ignoré par git), avec un sous-dossier par fiche sans image (et par variante si besoin), un `A-LIRE.txt` et une page `images-a-trouver/LISTE.html` avec des liens de recherche. Généré par `python3 images-a-trouver/.gen.py` (relancer pour mettre à jour : il ne crée des dossiers que pour les fiches encore sans image).
- Ordre pour D6 : (1) photos free-exercise-db regardées ; (2) images wger à licence compatible ; puis **relancer .gen.py pour que la liste ne contienne que les manques** ; (3) à chaque passage, regarder si l'utilisateur a déposé des images dans `images-a-trouver/<id>/` : vérifier l'image (bon mouvement, sûr), vérifier la licence grâce au `source.txt` (Wikimedia Commons, Pexels, Unsplash, Creative Commons ou photo personnelle de l'utilisateur : OK ; sans source ou licence inconnue : ne pas utiliser, le noter dans A-LIRE.txt), convertir en WebP léger dans public/photos/, renseigner la section Photo et les crédits ; (4) les illustrations SVG faites par `dev` seulement pour ce qui reste.

## 23/10/2026 (session principale, demande de l'utilisateur)

### D11. Zones cuisse et aine dans les fiches à ischios ou adducteurs secondaires : à appliquer (kine, puis check:fiches, puis contrôle rapide de relecteur sur Sonnet)
- Les fiches qui ont `ischios` ou `adducteurs` en muscles secondaires (13 au 23/10) reçoivent une ligne `cuisse` (ischios) ou `aine` (adducteurs) dans leur tableau de sécurité, avec un choix prudent marqué NON SOURCÉ (extrapolation de §0 de regles-securite-communes.md).
- La campagne est terminée (tâche planifiée désactivée le 23/10) : D11 est fait dans la session principale.
