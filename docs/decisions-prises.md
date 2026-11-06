# Décisions prises par le chef de projet avec les experts (relues par l'utilisateur quand il veut)

Format : date · choix · raison · comment l'annuler. Règle d'autonomie : CLAUDE.md, « Autonomie ».

- 05/11/2026 · Pompe et traction à un bras : réservées aux avancés avec le garde-fou D4 (2 séances en haut de fourchette du D3 voisin) ; exclues tant que le garde-fou n'est pas branché · décision de l'utilisateur, avis kiné · vider ou remplir `D4_NEVER` dans src/generator/config.ts.
- 05/11/2026 · Gel de la montée après douleur : 2 dernières séances sollicitant la zone, toutes fiches · règle du kiné · `painFrozen` dans src/session/adaptation.ts.
- 05/11/2026 · Piliers chargés plafonnés à 3 séries (V-VOL) · le fichier de règles dit « au plus 3 séries », lecture prudente · supprimer le setsCap des variantes réglables.
- 05/11/2026 · Débutant : aucune montée d'échelon vers un D3 en première séance de l'exercice (étalonnage compris) · blocage du relecteur, règle du kiné · filtre de classe dans progression-store.ts et engine.ts.
- 05/11/2026 · Règle « plus de 50 ans » abandonnée ; seule la reprise après arrêt (bloc reprise du profil) est gardée · décision de l'utilisateur.
- 05/11/2026 · Étalonnage chargé : plafond du saut de charge (+20 % ou un cran pour les exercices techniques lourds ; +50 % ou 2 crans, le plus petit, pour les autres chargés), seulement après une série propre (réserve 4 ou plus, sans douleur), jamais pendant un gel douleur · décision de l'utilisateur · valeurs PROVISOIRES dans src/session/progression-config.ts.
- 06/11/2026 · Plafond hebdomadaire des épaules appliqué à la SOMME des trois chefs du deltoïde (20 séries fractionnaires) · avis du kiné ; conséquence mesurée : plus de paire de supersets dans les profils 2, 4 et 6 ni à 3 jours, et le bloc de cardio de rang 2 ne tient plus dans les séances HAUT · poussé quand même (aucun enjeu de sécurité, suite verte) ; remplir les séances sans épaules pour retrouver les paires est le premier point du backlog · pour annuler : compter les chefs séparément dans le plafond (src/generator/index.ts, V-PLAF).
