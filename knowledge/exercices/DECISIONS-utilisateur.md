# Décisions de l'utilisateur pour la campagne fiches
Chaque décision « à appliquer » est prioritaire sur l'ordre des lots de CAMPAGNE.md. Une fois faite, remplacer « à appliquer » par « appliquée le <date heure> (commit) ».

## 22/10/2026 matin

### D1. Nouveau statut « utilisable » : appliquée le 22/10/2026 08:20 (commit D1)
- `utilisable` = 0 point bloquant au contrôle de relecteur, 0 erreur à `npm run check:fiches`, et réserves restantes limitées à des choix prudents marqués NON SOURCÉ.
- Le générateur peut utiliser les fiches `utilisable` (en plus de `verifie`). CLAUDE.md règle 22 est déjà mise à jour.
- Chaîne des statuts : `brouillon_coach` -> `complete_kine` -> `controle_relecteur` -> `utilisable` -> `verifie`.
- `dev` : ajouter `utilisable` à tools/validate-fiches.mjs (liste STATUTS) et à knowledge/format-fiches.md, mettre à jour knowledge/exercise-catalog.md §2 (niveaux de bibliothèque), et adapter tools/couverture.mjs pour compter séparément `utilisable` et `verifie` (et un total des deux) par profil A-F x schéma. Corriger au passage le point signalé : validate-fiches.mjs ignore tout nom de fichier contenant « controle ».
- Règle de fin de lot à partir de maintenant : `verifie` si aucune réserve ; `utilisable` si les conditions ci-dessus sont remplies ; sinon `controle_relecteur`.

### D2. Recontrôle rapide des lots 01 et 02 : à appliquer (après D1 et la fin des corrections du lot-03)
- `relecteur`, sur Sonnet, lancé à neuf : vérifier SEULEMENT les points corrigés après les contrôles des lots vague1/lot-01 et vague1/lot-02 (journaux de corrections des README et rapports CONTROLE-relecteur.md), pas tout le lot. Rapport : RECONTROLE-relecteur.md dans chaque lot.
- Puis passage en `utilisable` des fiches qui remplissent D1 (et `verifie` si aucune réserve). Faire de même pour le pilote et le lot-03 une fois ses corrections faites.

### D3. Réponses aux questions du lot-02 : à appliquer (coach puis kine, puis check:fiches, sur les fiches concernées)
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

### D5. Validation des 102 fiches par l'utilisateur : à appliquer
- L'utilisateur a relu les 102 fiches (pilote, lots 01 à 03) sur la page de relecture et les VALIDE sur le fond : contenu, choix d'exercices, échelons et niveaux.
- Noter « validé par l'utilisateur le 22/10/2026 » dans le README de chaque lot. Cette validation remplace sa relecture humaine ; elle ne lève PAS un point bloquant de `relecteur` sur la sécurité : ceux-là restent à corriger normalement.
- Les fiches sans point bloquant passent en `utilisable` (règle D1) dès que `check:fiches` est à 0 erreur.

### D6. Une image pour CHAQUE fiche : à appliquer (priorité haute, juste après D1 à D4)
L'utilisateur veut une image partout : sans image, une fiche n'est pas parlante. Méthode, dans cet ordre :
1. **Regarder réellement les photos free-exercise-db** (domaine public) déjà citées dans chaque fiche (outil Read sur l'image) : la plupart sont « à vérifier » parce que personne ne les a regardées. Passer en `affichable : oui` celles qui montrent le bon mouvement.
2. **Écart sans risque entre photo et consigne** (ex. position des mains, angle de prise de vue) : aligner la consigne sur la photo si c'est aussi sûr et aussi efficace, ou garder la photo avec une mention courte (« ici bras derrière la tête, fais-le bras devant »). N'écarter une photo que si elle montre un mouvement différent ou dangereux.
3. **Pas de photo free-exercise-db** : chercher une image wger dont la licence de l'IMAGE est compatible (CC0, CC-BY, CC-BY-SA), avec attribution notée dans la fiche et la page « crédits ».
4. **Toujours rien** : `dev` crée une illustration simple et cohérente pour l'app (pictogramme de silhouette en SVG, même style pour toutes les fiches, positions de départ et d'arrivée). Jamais d'image d'une autre app ni d'image sous licence inconnue.
- Ajouter au script check:fiches un contrôle : chaque fiche `utilisable` ou `verifie` a au moins une image affichable (photo ou illustration).
- Faire ce travail sur les fiches existantes AVANT de lancer de nouveaux lots ; les nouveaux lots l'appliquent directement.

### D7. Matériel : tout équipement possible comme option : à appliquer
- Le profil doit proposer TOUT le matériel courant comme option cochable, pas seulement le matériel de maison : banc de musculation (plat, inclinable), barre de traction, barre droite et disques, barre EZ, rack à squat, haltères fixes ou réglables (avec les poids), kettlebells, élastiques (boucle, bande longue, avec poignées), sangles de suspension (TRX, anneaux), roue abdos, swiss ball, medecine ball, step ou box, corde à sauter, gilet lesté, poulie, machines de salle, vélo ou rameur, tapis, + un champ « autre ».
- Mettre à jour knowledge/materiel-tags.json et equipment-taxonomy.md §2 avec les tags manquants (ex. `rack`, `disques`, `step`, `gilet_leste`, `sangles_suspension`, `velo_ou_rameur`), sans casser les tags existants.
- Dans les prochains lots, prévoir des fiches et variantes qui utilisent ce matériel, en commençant par le **banc** (développé couché et incliné aux haltères, rowing appuyé sur le banc, hip thrust sur le banc, dips sur banc, step-up sur banc), puis barre et rack, kettlebell, sangles de suspension, poulie et machines (profils E et F).
