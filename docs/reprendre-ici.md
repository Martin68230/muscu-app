# Reprendre ici (24/10/2026, 12 h 30)

Faits et commités : lot A (docs/F6bis-lot-A.md), lot C (docs/F6bis-lot-C.md). Quota 5 h : 4 % après le lot C.
À arrêter à la main : 5 processus `python3 -` orphelins (PID 22436, 18580, 9272, 17560, 18408), si pas déjà fait.

## État (24/10/2026, 12 h 40) — consigne : tout le lot B, puis lot D (12 matériels sans fiche), puis F7, sans seuil d'arrêt
- B1 FAIT : « Prise de muscle » (profile-setup.ts, specs Playwright).
- B2 FAIT : objectifs multiples (principal rang 1 + secondaires), `cardio` ajouté comme objectif (MainGoalKey), étape « objectif » du parcours avec pastilles « En plus (facultatif) », carte Profil « Prise de muscle + Cardio, Force » ; tests tests/unit/goals.test.ts.
- B3 FAIT : knowledge/cardio-regles.md rédigé (coach), sécurité relue (kine), contrôle relecteur : VALIDÉ SOUS RÉSERVE (0 bloquant, 10 réserves S1-S10 dans knowledge/CONTROLE-cardio-relecteur.md, section Recontrôle). Choix prudents appliqués : aucun saut/corde/course en cardio, pas de cardio dehors, post-partum = marche rapide, vélo assis, escaliers avec rampe. Décisions utilisateur en attente : docs/QUESTIONS.md Q5-Q10 (+ format d'intervalles 3.3bis).
- B4 FAIT (24/10/2026) : cardio dans le générateur (src/generator/cardio.ts, CARDIO dans config.ts), fusion principal/secondaire, textes T0-T5, GENERATOR_VERSION v1.2 ; tests 430/430, tsc OK, check:fiches 0 erreur ; captures WebKit tests/screens/b4-cardio.spec.ts (SE sombre, grand iPhone clair). Bilan : docs/F6bis-lot-B.md ; décisions ouvertes : docs/QUESTIONS.md Q11.
- Prochaine action exacte : lot D (12 matériels sans fiche) avec `coach` — commencer par les fiches cardio manquantes (vélo assis, escaliers avec rampe, step) listées en Q11 ; puis brancher le plan de 4 semaines du cardio sur l'historique (lecteur de séance).
- Lot D puis F7 ensuite.
