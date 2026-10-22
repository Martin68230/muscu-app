# Décisions de l'utilisateur pour la campagne fiches
Chaque décision « à appliquer » est prioritaire sur l'ordre des lots de CAMPAGNE.md. Une fois faite, remplacer « à appliquer » par « appliquée le <date heure> (commit) ».

## 22/10/2026 matin

### D1. Nouveau statut « utilisable » : à appliquer (en premier, par `dev`)
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
