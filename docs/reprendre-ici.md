# Reprendre ici (24/10/2026, 12 h 30)

Faits et commités : lot A (docs/F6bis-lot-A.md), lot C (docs/F6bis-lot-C.md). Quota 5 h : 4 % après le lot C.
À arrêter à la main : 5 processus `python3 -` orphelins (PID 22436, 18580, 9272, 17560, 18408), si pas déjà fait.

## État (24/10/2026, 12 h 40) — consigne : tout le lot B, puis lot D (12 matériels sans fiche), puis F7, sans seuil d'arrêt
- B1 FAIT : « Prise de muscle » (profile-setup.ts, specs Playwright).
- B2 FAIT : objectifs multiples (principal rang 1 + secondaires), `cardio` ajouté comme objectif (MainGoalKey), étape « objectif » du parcours avec pastilles « En plus (facultatif) », carte Profil « Prise de muscle + Cardio, Force » ; tests tests/unit/goals.test.ts.
- B3 EN COURS : coach a rédigé knowledge/cardio-regles.md (commit 8c3f8e8) ; kine a rendu son rapport complet (9bis, corrections, textes T0-T7, Q5-Q9 dans docs/QUESTIONS.md ; commit edff75a, arbre propre, validateur fiches 0 erreur). Reste : relecteur (lancé, rapport attendu dans knowledge/CONTROLE-cardio-relecteur.md) ; corriger les écarts bloquants par l'auteur (coach/kine), puis recontrôle des points corrigés seulement. NE PAS commencer B4 avant.
- B4 À FAIRE (Opus) : cardio dans le générateur (lieu, matériel), fusion principal/secondaires (goal-resolver.md), tests.
- Lot D puis F7 ensuite.
