# Déploiement GitHub Pages : constat et notes (24/10/2026)

## Incident #54 à #60 (23/10 16 h 59 → 24/10 08 h 24)
- Cause : `public/data/fiches.json` est généré (`npm run fiches`) et non versionné (.gitignore). Le workflow lançait `npm test` sans l'avoir généré : 6 fichiers de tests échouaient avec « ENOENT … fiches.json ». Le dernier déploiement vert était le #53 (« Profil en cartes », 23/10 11 h 52 UTC) ; F3, F4, F5 et F6 n'ont donc jamais été en ligne avant la correction.
- #56 (F4) : « annulé » par la règle `concurrency` (remplacé par #57 envoyé en même temps) ; son étape `npm test` avait aussi échoué.
- Correction : étape `npm run fiches` avant `npm test` dans .github/workflows/deploy.yml ; `check:fiches` rendu bloquant (0 erreur). Rien n'a été désactivé ni affaibli.
- Vérifié dans un clone propre : fiches, 430 tests, check:securite, check:fiches, build : tout passe.
- Autre échec plus ancien : #45 (22/10 16 h 34, lot-06 illustrations), échec à `npm test` ; les envois #46 et #47 ont été annulés (concurrence) et #48 est vert : pas de cause persistante. Les annulations antérieures (#21, #26, #43, #46, #47) sont des remplacements par un envoi suivant.

## Avertissements sans urgence
- Node 20 déprécié pour `actions/checkout@v4`, `actions/setup-node@v4` (et `upload-pages-artifact@v3`, `deploy-pages@v4`) : passer aux versions suivantes quand elles sortent ; le projet utilise déjà Node 24 pour le build.
- `ubuntu-latest` va migrer vers Ubuntu 26 : surveiller le premier déploiement après la migration (ou fixer `ubuntu-24.04`).
- fiches.json (publié) contient les notes de sources et quelques mentions « kine » / « question Qxx » : aucune donnée personnelle ni secret (contrôlé : pas d'e-mail, de clé, de jeton, de chemin local) ; à nettoyer à l'affichage si l'utilisateur le souhaite.
