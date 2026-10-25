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

## LOT D (24/10/2026, 13 h 50) — en cours
- Lot-07-barre (barre, disques, rack, barre_ez : squat, développé couché, soulevé de terre, rowing, développé militaire, hip thrust…) : ÉTAPE ACTUELLE = coach rédige knowledge/exercices/vague1/lot-07-barre/ (20-24 fiches).
- Suite du lot : kine → `npm run check:fiches` 0 erreur → dev (images WebP/SVG) → relecteur → corrections → statut utilisable → commit. Un fichier à la fois, jamais à moitié modifié.
- Lots suivants : lot-08 roue abdos (niveau avancé ; dos, grossesse, post-partum, blessures), lot-09 swiss ball + medicine ball, lot-10 corde, lest, sac de sable, bosu, vélo/rameur/machine_cardio (attention Q5-Q11 de docs/QUESTIONS.md : sauts, corde, tags machine).
- Puis F7 (historique et accueil).

## LOT D — état à 14 h 50 (24/10/2026)
- lot-07-barre : 16 fiches `utilisable` (verdict relecteur, 0 bloquant) ; 3 restent `complete_kine` : squat-barre-repere-banc (N1 : manœuvre de secours « bloqué en haut » ne rejoint pas les barres → kine), rowing-pendlay-barre (N2 : cases genou/cheville niveau 3 encore `sans-zone` → kine), rowing-barre-ez (N3 : illustration, buste ~25° au lieu de 45°, cuisses horizontales → dev). Ensuite recontrôle relecteur de ces seuls points.
- À RESTAURER quand ces 3 fiches seront `utilisable` : progression « plus-facile : squat-barre-repere-banc » dans squat-arriere-barre.md (l. 45) et squat-avant-barre.md (l. 41) ; « plus-dur : rowing-pendlay-barre » dans rowing-barre-penche.md (l. 43). (Retirés pour qu'aucun lien ne mène nulle part.)
- 5 vidéos à filmer : images-a-trouver/ (Q19). Décisions utilisateur : docs/QUESTIONS.md Q5-Q19.
- Prochains lots : lot-08 roue abdos, lot-09 swiss ball + medicine ball, lot-10 corde/lest/sac de sable/bosu/vélo-rameur. Puis F7.

## Mise à jour 15 h 30 (24/10/2026)
- lot-07-barre : 18 fiches `utilisable` (squat-barre-repere-banc et rowing-pendlay-barre validés au recontrôle 2, liens de progression restaurés). Reste `complete_kine` : rowing-barre-ez (libellé « barre au sol » corrigé en « barre qui pend » le 24/10 : à faire confirmer par relecteur, N9).
- lot-08-ballons-roue : 19 fiches `complete_kine` (kine fait, commit 2095795) ; dev fait les images (en cours) ; ensuite relecteur lancé à neuf sur le lot.
- Puis lot-09 (corde, lest, sac de sable, bosu, vélo/rameur/machine_cardio : voir Q5-Q11 sur sauts/corde et tags machine), puis F7.

## Mise à jour 19 h 05 (24/10/2026) — DÉPLOIEMENT RÉPARÉ
- Déploiement #61 VERT, commit b77f8ef en ligne à 19 h 02 (heure de Paris) : https://martin68230.github.io/muscu-app/ (index, JS, fiches.json 158 fiches vérifiés). Cause des échecs #54-#60 et corrections : docs/deploiement-notes.md. Règle ajoutée à CLAUDE.md (section C).
- lot-08-ballons-roue : kine (2c7adfa) et coach (447e55a) ont corrigé ; il reste dev (illustrations lancer-bas-haut-mur S2, extension-dorsale-ballon sans mur, lancer-rotation-mur M10, photo 1 de genoux-poitrine-ballon S3), puis recontrôle relecteur des points corrigés, puis statuts. rowing-barre-ez (lot-07) : libellé corrigé, à confirmer par relecteur.
- Pas poussé depuis b77f8ef : tout commit suivant doit être poussé en UNE fois, puis vérifié vert (CLAUDE.md).

## Mise à jour 19 h 45
- lot-08 : 15 fiches `utilisable` ; 4 lancers restent `complete_kine` (lancer-poitrine-mur, lancer-rotation-mur, lancer-bas-haut-mur, squat-lancer-mur) : coach doit trancher « lancer en exercice principal (poussee_1, jambes_genou) ou exclus des piliers » ; RESTAURER « plus-dur : lancer-rotation-mur » dans bucheron-ballon-lest.md (l. 45) quand lancer-rotation-mur sera utilisable. Dosage codé : FIXED_DOSE (config.ts), tests generator-dose-fixe.
- Prochaine action exacte : lot-09 (corde à sauter, lest, sac de sable, bosu, vélo/rameur/machine_cardio) avec coach ; puis F7.

## Mise à jour 25/10/2026 (après lot-09)
- lot-09 TERMINÉ (15 utilisables). Total fiches publiées : 188. Poussé et vérifié vert : voir ci-dessous si une ligne « DÉPLOIEMENT » suit.
- Restent du lot D : 4 lancers lot-08 (décision coach : pas en exercice principal), corde/cardio machine (Q5, Q10 : attendre les décisions de l'utilisateur), vidéos à filmer (Q19), N4 (saisie de charge pour lest/sac).
- Prochaine action : F7 (historique et accueil), Sonnet, sans experts sauf texte de sécurité.

## F7 (25/10/2026) : TERMINÉE, commitée, non poussée
- Historique, calendrier, régularité à l'accueil : voir docs/F7-bilan.md. Prochaine action : le chef de projet pousse après vérification (CLAUDE.md : déploiement vert avant « en ligne »), puis test iPhone.

- DÉPLOIEMENT : #64 (F7, commit 167127f) vérifié VERT et en ligne le 25/10/2026.

## Mise à jour 25/10/2026 (petites tâches de la semaine, quota hebdomadaire à 92 %)
- Faits, poussés, déploiement #65 VERT (commit 578bd02) : fiches.json public nettoyé à la génération (tools/public-text.mjs, test tests/unit/public-fiches.test.ts) ; message de suppression d'une séance explicite ; « prévues » = estimation ; 4 lancers du lot-08 utilisables et exclus des exercices principaux (MAIN_EXERCISE_SLOTS, PILLAR_EXCLUDED_FICHES) ; docs/QUESTIONS-par-sujet.md ; docs/ou-on-en-est.md.
- Consigne de l'utilisateur : AUCUN gros lot avant la remise à zéro hebdomadaire de jeudi soir ; ne pas lancer la phase 6 ni l'audit avant. Prochaine action : attendre ses réponses aux questions (docs/QUESTIONS-par-sujet.md) et le choix de l'ordre (docs/ou-on-en-est.md).

## Retours de test iPhone du 25/10/2026 (version en ligne) : état et suite
Fait (petits points visibles) : 7 version visible (numéro · commit · date) + bouton « Mettre à jour l'app » dans Profil ; 5 aperçu de séance : sécurité toujours visible, le reste derrière « Pourquoi ? » ; 6 écran de séance : photo, nom, « Voir la fiche » et « Comment faire » (3 consignes) sous la saisie ; 4 (partie visible) : le calendrier affiche les séances PRÉVUES (jours du programme) puis « faite » / « non faite » sans reproche.
À FAIRE APRÈS LA REMISE À ZÉRO (jeudi soir), avec estimation (en % d'une fenêtre de 5 h) :
1. Échauffement / mobilité incompréhensibles (ex. « glissement des bras dos appuyé ») : image ou vidéo + consigne en mots simples pour chaque exercice d'échauffement et de mobilité ; coach (consignes), dev (images/SVG), kine (relecture), relecteur : 25 à 35 %. NE PAS changer la structure des fiches avant que l'utilisateur ait donné son dépôt d'exemple à comparer.
2. Chaînes de progression : un échelon plus dur doit travailler le MÊME muscle principal et le même schéma (pompe diamant = triceps, piquée = épaules, archer = un côté ne sont pas « plus dur » d'une pompe classique) : coach revoit toutes les chaînes (poussées, tirages, jambes, gainage) ; sinon étiquette « change le muscle travaillé » et progression séparée ; contrôle automatique (test) du muscle principal par chaîne ; relecteur : 25 à 35 %. Même réserve : ne pas toucher à la structure des fiches avant l'exemple de l'utilisateur.
3. Variété du générateur : utiliser tous les objectifs classés (principal + secondaires) et varier les exercices entre séances A/B/C et d'une semaine à l'autre selon l'objectif (force, prise de muscle, cardio) ; démonstration texte : même profil, 4 combinaisons d'objectifs, différences visibles (tools/demo-generateur.mjs) ; règles à valider (coach), code (dev, Opus, règles du générateur) : 35 à 50 %.
4. (reste) statut « reportée » et réajustement des séances manquées selon knowledge/schedule-adaptation.md (règles PROVISOIRES à valider par coach/relecteur, moteur de replanification, écran de choix) : 30 à 40 %.
Décisions « OK pour toutes les recommandations » de l'utilisateur (docs/QUESTIONS-par-sujet.md) : à appliquer après la remise à zéro : Q7 plafond 2 séances de cardio pour tous (config.ts maxDedicated), Q10 séparer les tags vélo/rameur/tapis/elliptique (≈ 10 %), Q12 champ « poids de ma barre », Q17 retirer le curl barre EZ en grossesse, Q18 écarter good-morning-barre et rowing-pendlay-barre (liens de progression à retirer), Q28 fiches de corde/vélo/rameur/tapis après Q5 et Q10.
