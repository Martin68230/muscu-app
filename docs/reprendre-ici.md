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

## MESSAGE v5 (25/10/2026) : état des points « maintenant » et BACKLOG après la remise à zéro (jeudi soir)
### Points « maintenant » (a à f)
- a) FAIT et en ligne : version « numéro · commit · date » dans Profil ; « Mettre à jour l'app » (cherche une nouvelle version et recharge) ; « Recharger l'app en vidant son cache » (vide les caches, désinscrit le service worker, recharge ; profil et historique gardés ; refusé hors ligne).
- b) FAIT pour l'aperçu de séance (sécurité visible, le reste derrière « Pourquoi ? »). Autres écrans non traités : Accueil (équipement changé + « trop tôt » = 2 messages possibles), Player (bandeau Wake Lock + supersets). Petit lot restant ≈ 3 %.
- c) FAIT : « Comment faire » (3 consignes) sous la saisie ; photo, nom, « Voir la fiche » en haut.
- d) PARTIEL : séances prévues (○) et non faites (◌) affichées ; PAS fait : statut « reportée » produit par le code et réajustement selon knowledge/schedule-adaptation.md (règles PROVISOIRES à valider coach/relecteur, moteur, écran de choix) : 30 à 40 %.
- e) FAIT : fiches.json public nettoyé à la génération ; test vitest ET `npm run check:fiches` échouent si une mention interne y apparaît (prouvé par injection).
- f) DÉJÀ FAIT : clavier numérique (poids en boutons rapides + champ « autre poids », virgule acceptée), objectifs « Prise de muscle » et « Cardio » combinables avec « Force » (1 principal + secondaires), changement de matériel met à jour le programme (message « Ton matériel a changé »), aucune connexion requise (CSP connect-src 'self', données locales).
### Backlog, ordre recommandé : D23 → D24 (statistiques seulement) → D25 → D26 → R2 → R3 → D21 → D18 → D17 / D22 → D19. Coûts en % d'une fenêtre de 5 h.
- D23 catalogue étendu + chaînes pilotées par les données (règle centrale : jamais de remplacement d'un autre muscle principal ; validateur check:fiches qui échoue si une relation relie deux muscles principaux ; cas test pompe diamant) : import lecture seule du texte hasaneyldrm (MIT, accord de l'utilisateur requis avant tout téléchargement) 15 % ; validateur + correction des chaînes existantes 25 % ; ensuite 35 à 45 % par vague de 50 exercices (coach, kine, relecteur, images).
- D24 revue streprogen (GPL : idées seulement, note coach PROVISOIRE) 10 % ; Kaggle 600K (ODbL, provenance douteuse) : téléchargement local seulement après accord, program_summary.csv d'abord, statistiques NON SOURCÉES, rien dans le dépôt/l'app : 10 à 15 %.
- D25 architecture long terme (taxonomie de schémas obligatoire dans le validateur, règles de génération sourcées par coach, F3 : force + bloc mobilité + fonctionnel) : 60 à 90 % (Opus pour F3).
- D26 supersets et core : d'abord lire le code (comment F3 décide un superset, comment le core est réparti : réponse à fournir à l'utilisateur) 3 % ; règles (coach, sources) 10 % ; contrôle des programmes générés + 4 profils de démonstration 15 à 20 %. À faire AVANT D25 pour les règles de core.
- R2 revue des chaînes de progression (pompe diamant, piquée, archer) 25 à 35 % ; R3 variété du générateur + démonstration 4 combinaisons 35 à 50 % ; R1 échauffement/mobilité compréhensibles 25 à 35 %.
- D21 adaptation selon le ressenti (fonction pure testée, règles sourcées) 30 à 40 % ; dépend de R2 et D23.
- D18 fiche modèle + validateur de lisibilité (allègement validé) 25 à 35 % ; levée du gel de structure : D18, D23, D25, D26 seulement.
- D17 images (GymMane, Everkinetic, RepDB au build via GitHub Actions : vérifier d'abord que le téléchargement fonctionne) 20 % d'étude puis 30 % par lot ; D22 import local GIF Gym visual (ZIP 295 Mo, test iPhone réel) 40 à 55 % ; D19 muscles travaillés par semaine 15 à 20 %, import CSV Hevy/Strong 15 à 20 % (priorité basse, après la phase 6).
- À garder : Q5 à Q29 (réponses « OK pour toutes les recommandations » à appliquer : Q7, Q10, Q12, Q17, Q18, Q28), 5 vidéos à filmer (Q19), audit de sécurité complet avant d'inviter qui que ce soit (D14), phase 6 (comptes, partage).
### Incident à retenir (25/10, ~20 h) : un envoi a été poussé alors que 4 tests échouaient en local (délais de 5 s dépassés sur machine chargée ; réussis en isolé et en suite complète ensuite ; déploiement #67 vert). Corrigé : délai des tests 20 s. Règle : ne jamais enchaîner « tests puis push » sans lire le résultat.

- D26 étape 1 FAITE (lecture du code) : voir docs/D26-etat-actuel.md (supersets : option « gagner du temps » seulement, 3 paires fermées ; core : 1 emplacement « tronc » par séance, retiré en premier quand le temps manque : écart à corriger).
- 25/10 ~20 h 30 : quota de la semaine à 98 % (remise à zéro jeudi 29/10 vers 19 h, heure de Paris) : arrêt propre ; prochaine action exacte = D23 (validateur de chaînes de progression par muscle principal + schéma, sans téléchargement ; l'import hasaneyldrm attend l'accord explicite de l'utilisateur).

## MESSAGE v6 (25/10/2026) : remplace v5 ; seule nouveauté = D28 (le reste est identique : voir « MESSAGE v5 » ci-dessus, déjà noté)
- Ordre recommandé mis à jour : D23 → D24 (statistiques seulement) → D25 → D26 → **D28** → R2 → R3 → D21 → D18 → D17 / D22 → D19.
- D28 « Créer une séance » à la demande, sans IA (générateur par règles) : écran avec zone du corps (jambes, haut du corps, tronc, corps entier), sport éventuel (foot, danse, volley, raquette), matériel disponible (chaise, élastique, tapis compris), durée, intensité ; le générateur compose : exercices compatibles avec matériel et zone, exigences du sport (appuis latéraux, réception de saut, stabilité genou/cheville : règles du coach, sources, PROVISOIRE si non sourcées), core (D26), échauffement et retour au calme, séries/répétitions/repos selon nos règles ; séance ajoutable au calendrier ou faite tout de suite.
  - Cas de test imposé : « jambes, volley, élastique + chaise, 30 minutes, intensité modérée » → séance cohérente, aucun exercice hors matériel, supersets conformes à D26.
  - Dépendances : D23 (catalogue et chaînes par muscle), D25 (taxonomie des schémas, structure de séance), D26 (core et supersets), sports.md (règles de sport à valider coach/kine/relecteur). À ne pas commencer avant D26.
  - Coût estimé : règles de sport sourcées (coach, kine, relecteur) 15 à 20 % ; composeur de séance dans le générateur (Opus, règles de sécurité) 30 à 40 % ; écran, calendrier, lecteur 15 à 20 % ; tests et démonstration texte 5 à 10 % ; total 65 à 90 %.
- Rappel : quota de la semaine à 98 % ; remise à zéro jeudi 29/10 vers 19 h (Paris). Rien lancé. Prochaine action exacte : D23 (validateur de chaînes par muscle principal + schéma, sans téléchargement).

## 29/10/2026 : « Reprends ici » reçu (quota remis à zéro) : ordre de travail de la session
1. Restes du v6 : « reportée » + réajustement des séances manquées (règles knowledge/schedule-adaptation.md PROVISOIRES : coach → relecteur AVANT de coder, règle 10), puis reste du b (Accueil, lecteur : un seul message court par écran). 2. D23 : validateur de chaînes de progression (même muscle principal ET même schéma ; cas test pompe diamant). Pas d'import hasaneyldrm sans accord explicite.
Incident noté : au 29/10, src/styles.css contenait des centaines de milliers de lignes ajoutées par le processus Python resté bloqué (arrêté le 25/10) ; restauré depuis HEAD (500 lignes), rien de corrompu n'a été commité ni déployé.

### D28 (complément, 29/10/2026) : séance de référence fournie par l'utilisateur
Séance produite par Claude hors de l'app, jugée très bonne, à reproduire par le générateur avec des règles. Cas : « améliorer ma détente, volley, séance jambes, maison, tapis + chaise + élastique, 45 à 55 min ».
Structure cible :
1. Échauffement 8 min : squats poids du corps, fentes dynamiques, leg swings, montées de genoux / talons-fesses, petits sauts progressifs.
2. Pliométrie EN PREMIER (muscles frais) : jump squats 4x6 (récup 90 s), sauts en longueur sur place 3x5 (réception stable 2 s), sauts sur chaise 3x5 seulement si la chaise est stable et calée ; sinon remplacement automatique par sauts verticaux maximum.
3. Force explosive : squat sauté avec élastique sous les pieds 4x6, fentes sautées 3x6 par jambe, step-ups explosifs sur chaise 3x6 par jambe.
4. Force lente (descente ralentie pour compenser l'absence de charge) : squat bulgare pied sur chaise 3x8 par jambe (descente 3 s), pistol squat assisté depuis la chaise 3x5 par jambe.
5. Chaîne postérieure : hip thrust unilatéral épaules sur chaise + élastique 3x8 par jambe, good morning avec élastique 3x12, nordic curl assisté ou glute bridge talons surélevés 3x8.
6. Mollets et réactivité (finisher 5 min) : pogo jumps 3x20 s, mollets unilatéral 3x12 par jambe.
7. Étirements 5 min : quadriceps, ischios, fléchisseurs de hanche, mollets.
Règles à extraire et sourcer par le coach (OK / PROVISOIRE) : pliométrie avant la force quand l'objectif est la détente ; arrêt dès que la hauteur de saut baisse ; récupération complète entre séries de sauts ; 48 à 72 h entre deux séances de jambes ; volume de contacts au sol par séance selon le niveau ; surface et chaussures ; progression sans charge par vitesse, tempo lent en descente et variantes unilatérales.
Adaptation au profil : débutant → retirer fentes sautées, pistols et nordic curls au profit de versions plus simples du même schéma (D23) ; douleur ou blessure déclarée au genou / cheville → pas de pliométrie ; chaise non stable → alternative automatique.
Validation : le cas ci-dessus doit donner une séance de structure équivalente, sans exercice hors matériel, avec supersets conformes à D26. Prévoir ensuite le plan sur plusieurs semaines avec progression (D25, D21).
Points d'attention pour la mise en œuvre (à arbitrer avec l'utilisateur) : les sauts sont aujourd'hui INTERDITS dans le cardio (Q5, choix prudent) et « jamais placés » par le générateur en v1 (D3, §2.2 generateur-v1.md) ; cette séance exige donc une décision explicite : sauts autorisés pour le sport (D3 les réservait aux « programmes sport »), avec les conditions de kine (niveau 0 genou/cheville/hanche/dos, pas en grossesse/post-partum, séries courtes). Coûts supplémentaires de ce complément : règles de pliométrie sourcées (coach, kine, relecteur) 15 à 20 % ; fiches manquantes (jump squat, saut en longueur, pogo, squat bulgare, pistol assisté, nordic assisté, hip thrust unilatéral chaise + élastique, step-up explosif) 25 à 35 % ; composeur D28 : voir plus haut.

### Backlog hors v6 (confirmation demandée par l'utilisateur le 29/10/2026) : DÉJÀ au plan, rappelé ici
- Nutrition (phase 7, knowledge/nutrition-rules.md à valider par nutritionniste) : besoins estimés et ajustés, plan de repas généré (Ciqual), préférences et allergies, liste de courses, substitutions ; SUIVI DES COMPLÉMENTS enregistrés par l'utilisateur, jamais prescrits, avec alertes de planchers et de sécurité ; exclusions (grossesse, pathologie, trouble alimentaire, mineur). Coût estimé : 120 à 160 % (2 fenêtres). Ordre : après la phase 6 ou avant selon la décision de l'utilisateur.
- Familles de sports (sports.md : foot, danse, volley, raquettes) + prévention (FIFA 11+, nordique, épaule OSTRC) : fiches faites (lot 02), règles écrites ; reste à brancher dans le générateur (objectif « sport » encore ramené vers « santé ») ; lié à D28 et D25 : 45 à 60 %.
- Suivi des amis SANS chat (phase 6) : comptes sur invitation (Supabase UE, inscriptions fermées), demandes d'amis acceptées, fil d'amis avec réactions (aucune messagerie), partage choisi par type de donnée (poids et blessures jamais partagés par défaut), règles d'accès RLS testées, audit de sécurité complet AVANT toute invitation (D14) : 120 à 180 % + audit 40 à 60 %. L'IA facultative (phase 8) : 35 à 45 %.

## 29/10/2026 soir : F « séance manquée » (knowledge/seance-manquee-v1.md révision 3) — en cours, non poussé
- Étape 1 FAITE : modèle (endReason renonce/pas_bien, decidedAt, originDate, postponedTo, dejaDecalee, Program.missedAnswers, profile.reprise), validation d'import, valeurs par défaut (src/session/missed-config.ts : fichier unique des réglages, statuts en commentaire), tests tests/unit/missed-data.test.ts.
- Étape 2 FAITE : fonctions pures src/session/missed.ts (R, N, carte, jours pour « Décaler », K1, paliers, R-DEM, R-FIN, séance valable, charges de reprise, plan de reprise), textes T-xx mot pour mot src/session/missed-texts.ts, rotation (nextSession : « Sauter » avance, clé decidedAt), calendrier (« Sautée » », jours décalés), SM-21 ; tests tests/unit/missed.test.ts (E1-E27 hors écrans, changement d'heure, déjà décalée).
- Étape 3 FAITE : carte de l'Accueil (src/ui/MissedCard.tsx, priorité SM-3 : sécurité R5/U1 + T-22, « consulte », carte, équipement, bandeau), choix du jour, confirmations T-7 à T-12 / T-18 / T-21, liens « Sauter » et « Je ne me sens pas bien » dans l'aperçu, calendrier « Sautée » (») et jours décalés, texte « Pas de souci » retiré ; enregistrement src/session/missed-store.ts ; tests tests/unit/missed-screens.test.tsx.
- Étape 4 FAITE : R-DEM au démarrage (app.tsx + src/session/reprise-plan.ts, aperçu sans écriture), séance de reprise (charges, séries, échelon -1, étalonnage garder/descendre, plafond C0), R-FIN à la fin (store.ts), ligne N réutilisée, V-PROG-E8 « reprise douce active » (proposeProgression, aperçu, bilan) ; tests tests/unit/missed-reprise.test.ts ; choix prudents docs/QUESTIONS.md Q31.
