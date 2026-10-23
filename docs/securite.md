# Sécurité : suivi

Les rapports détaillés restent hors du dépôt (dépôt public) : `~/security-audit-skill/muscu-app/`.

## 23/10/2026 : checklist rapide (skill securite-application)
- Périmètre : état actuel, avant la phase 6 (pas de serveur, pas de compte, données seulement sur l'appareil).
- OK : aucun secret dans le code ni dans l'historique git ; aucun `innerHTML` ni équivalent dans le code ; import JSON validé ; aucun log de données ; dépendances sans vulnérabilité connue (npm audit) ; service worker limité aux fichiers de l'app ; liens externes en `noopener noreferrer` ; lecteur YouTube nocookie chargé seulement après appui.
- Fait le 23/10/2026 (F4) : Content-Security-Policy stricte ajoutée au build (vite.config.ts, script de thème déplacé dans public/theme-boot.js) ; `sandbox` sur le lecteur YouTube ; `npm run check:securite` (secrets dans l'historique, fonctions XSS, npm audit) bloquant dans le déploiement.
- Reste : vérifier sur l'iPhone installé que la page et le lecteur vidéo se chargent sans blocage CSP ; vérifier la CSP de l'en-tête HTTP impossible sur GitHub Pages (meta seulement : `frame-ancestors` non disponible).
- Prochaine étape obligatoire : audit complet avant toute invitation (décision D14, fin de la phase 6).
