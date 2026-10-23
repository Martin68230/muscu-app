# F5 partie B : bilan (écrans du lecteur de séance)

1. Faits : Accueil (séance du jour, reprise, message du moteur + bouton de correction), Aperçu `#/seance`, lecteur plein écran (échauffement, carte d'exercice, saisie +/-, repos, superset, douleur, symptôme U1/R5/G6/C4, fin), Wake Lock avec bandeau, son débloqué par « Commencer ».
2. Code : `src/ui/screens/{Home,Preview,Player}.tsx`, `src/ui/session/{launch,sound,text,wakelock}.ts`, textes G6/C4 ajoutés à `src/session/messages.ts`, `FicheImages` exporté (variante compacte).
3. Vérifié : 319 tests Vitest (24 nouveaux : parcours complet hors-ligne, paliers, superset, douleur, symptôme, repos au retour d'arrière-plan, reprise, Wake Lock, son), tsc, build, check:fiches, check:securite ; Playwright WebKit SE sombre et grand iPhone clair (parcours complet, règles de la section D, aucune erreur CSP).
4. Non vérifié : vrai iPhone (installation, encoche, clavier décimal, son, écran allumé, vibration absente de Safari), minuteur de maintien pour les exercices en secondes (non fait), échelons du poids du corps en étalonnage (non branchés).
5. Choix à valider : « Continuer plus léger » baisse la charge d'un palier sans arrêter l'exercice ni enregistrer de douleur ; le lien « Mettre à jour mes blessures » quitte le lecteur (séance reprenable depuis l'Accueil).

- Quota F5 (parties A et B, corrections comprises) : limite de 5 h 58 % -> 88 %, semaine 37 % -> 41 %. Contrôles finaux : 321 tests, tsc, build, check:fiches (0 erreur), check:securite OK.
- Corrigé après les captures : « Continuer plus léger » supprimé (R4/R10), image compacte pour voir la saisie sans défiler sur iPhone SE, décimaux à la virgule.
