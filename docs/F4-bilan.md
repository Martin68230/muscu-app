# F4 : fiche d'exercice et Bibliothèque (bilan)
- Bibliothèque : recherche sans accent (nom, alias, muscles), filtres par grand type, vignettes WebP à la demande, compteur, retour avec recherche et défilement conservés (`#/fiche/<id>`).
- Fiche : photos départ/arrivée ou illustration, légende, muscles, variante « Pour toi » selon le matériel (comme le générateur), « il te manque », lignes blessure et grossesse, vidéo sur appui, bouton ⋯, rappel médical.
- Libellés français dans `src/data/labels.ts` ; `cleanText` retire codes de règle (R8, G4...) et identifiants des textes des fiches.
- Sécurité : CSP au build, iframe `sandbox`, `npm run check:securite` dans le déploiement.
- Tests : `tests/unit/fiche-screen.test.tsx` (38 avec video-button) ; captures `tests/screens/f4-fiches.spec.ts`.

- Quota F4 + lot de corrections avant F4 : limite de 5 h 27 % -> 57 %, semaine 33 % -> 37 % (session principale sur Sonnet + agents Sonnet). Tests : 220 OK, tsc, build, check:fiches (0 erreur), check:securite OK.
