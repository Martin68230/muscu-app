# Sécurité : suivi

Les rapports détaillés restent hors du dépôt (dépôt public) : `~/security-audit-skill/muscu-app/`.

## 23/10/2026 : checklist rapide (skill securite-application)
- Périmètre : état actuel, avant la phase 6 (pas de serveur, pas de compte, données seulement sur l'appareil).
- OK : aucun secret dans le code ni dans l'historique git ; aucun `innerHTML` ni équivalent dans le code ; import JSON validé ; aucun log de données ; dépendances sans vulnérabilité connue (npm audit) ; service worker limité aux fichiers de l'app ; liens externes en `noopener noreferrer` ; lecteur YouTube nocookie chargé seulement après appui.
- À ajouter (en cours, avant de placer le bouton vidéo sur un écran) : Content-Security-Policy stricte au build ; `sandbox` sur le lecteur vidéo ; script `npm run check:securite` dans le déploiement.
- Prochaine étape obligatoire : audit complet avant toute invitation (décision D14, fin de la phase 6).
