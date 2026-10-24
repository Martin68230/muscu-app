# F6 : progression par échelons et bilan de séance

1. Fait : écarts du §7 corrigés ; progression par échelons (propositions « Accepter / Plus tard » sur l'aperçu, refus enregistré, descente, anti-aller-retour, passage de niveau, gel après symptôme) ; étalonnage des échelons branché dans le moteur (variante et échelon enregistrés par série) ; `restTakenSec` ; bilan de séance (6 statuts, comparaison, records, grossesse) à la place de l'écran de fin ; valeurs NON SOURCÉ dans `src/session/progression-config.ts`.
2. Vérifié : tests Vitest T1-T41 (fichiers `progression-*.test.ts`, `summary-core.test.ts`) et non-régression F5 ; tsc, build, check:fiches, check:securite ; Playwright WebKit (SE sombre, grand iPhone clair) : séance complète, abandonnée, avec douleur jusqu'au bilan.
3. Pas vérifié : vrai iPhone (installation, encoche, lisibilité du bilan à bout de bras, carte de proposition au pouce, clavier) ; seuils de `progression-config.ts` toujours NON SOURCÉ, en attente de validation de l'utilisateur et de `relecteur` ; maintiens figés ; texte G7 absent.
4. Choix à valider : voir `docs/f6-notes-dev.md` (plafond de la première séance, séance d'arrivée non comptée, séries douloureuses non comptées).
5. Quota : à indiquer par l'appelant.

- Quota F6 (règles de progression et de bilan : coach, kine, relecteur, puis code) : limite de 5 h 9 % -> 72 %, semaine 44 % -> 52 %. Contrôles finaux : suite complète 389 tests verte deux fois, tsc, build, check:fiches (0 erreur), check:securite OK, Playwright f5-seance et f6-bilan OK (SE sombre, grand clair).
- A faire : « 1 faites » -> « 1 faite » (accord) dans le bilan ; texte post-partum G7 à fournir par kine ; coach tranche le plafond de la première séance (spec §2 (e) vs T18, réglage firstSessionRaiseAllowed).
