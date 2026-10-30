# Projet : appli de musculation entre amis (PWA gratuite)
Appli privée pour ~10 amis majeurs (niveaux variés, salle et maison ; surtout iPhone, Android en bonus). Gratuite, sans pub, sans photos des utilisateurs, **simple, sûre et sans chat**.
À lire avant toute tâche : docs/plan-de-construction.md (ordre et jalons), docs/cahier-des-charges.md, docs/architecture.md, knowledge/README.md.

## A. Règles non négociables
1. **Gratuit** : aucun service payant ni carte bancaire.
2. **PWA statique** sur GitHub Pages ; **local d'abord** (IndexedDB) avec un modèle prêt pour la synchronisation ; comptes et amis sur Supabase (plan gratuit, région UE) en phase 6.
3. **Dépôt public** : aucun secret (clé anon Supabase seulement). Row Level Security sur TOUTES les tables ; un ami ne voit que ce que l'autre a choisi de partager, après demande acceptée. Tests automatiques des règles d'accès.
4. **iPhone d'abord** (Safari, écran d'accueil). Rendu réel validé sur l'iPhone via le site déployé.
5. **Minuteurs** calculés sur l'heure réelle ; écran allumé pendant la séance (Wake Lock) ; son débloqué par un premier appui ; recalcul au retour de l'arrière-plan. Pas de promesse d'alarme écran verrouillé (impossible en PWA sans serveur).
6. **Hors-ligne** pendant la séance ; export/import JSON ; bouton « supprimer mon compte et mes données ».
7. **Vie privée** : tout est privé par défaut ; partage choisi par type de donnée ; poids et blessures jamais partagés par défaut ; aucun traceur.
8. **Simplicité** : pas de messagerie, pas de classement public, pas de photos de progression en ligne. Chaque écran a une action principale claire.
9. **IA optionnelle avec interrupteur global** : (a) sans IA : questionnaire + moteur de règles ; (b) prompt à copier-coller + import JSON validé par schéma ; (c) clé API perso stockée seulement sur l'appareil. IA coupée = aucun élément d'IA visible. L'IA personnalise à l'intérieur des règles du code, jamais en dehors.
10. **Contenu sourcé** : toute valeur sport/nutrition vit dans knowledge/ avec source et statut (OK / PROVISOIRE / NON SOURCÉ). Rien de PROVISOIRE ou NON SOURCÉ n'est codé en dur sans validation de `coach`/`kine`/`nutritionniste` puis contrôle de `relecteur`.
11. **Sécurité santé** : avertissement « pas un avis médical » ; profil blessures (zone + niveau) qui retire ou adapte les exercices ; douleur -> pas de progression, conseil de consulter ; exclusions nutrition (grossesse, pathologie, trouble alimentaire, mineur).
12. **Images** : seulement les photos libres (free-exercise-db, et wger si la licence de l'image le permet), en WebP légères, chargées à la demande ; jamais les images/GIF du dépôt maxwu (droits Gym visual) ; aucun visuel ni marque d'une autre app ; page « crédits » avec les attributions. La consigne prime sur la photo : une photo qui contredit la consigne n'est pas affichée.
13. **Interface en français** ; consignes d'exercices réécrites en français (pas de copier-coller des textes maxwu).

## B. Règles des programmes (détails dans knowledge/)
14. Base : position ACSM 2026 ; rester simple (régularité, surcharge progressive, volume suffisant, pas d'échec systématique) : program-logic.md.
15. Répartition selon les jours/semaine (program-logic.md §2) : 2-3 jours = corps entier ; 4 = haut/bas ; 5-6 = push/pull/legs ; chaque grand muscle >= 2 fois/semaine ; avertir si le choix de la personne ne le permet pas.
16. **Mouvement puis variante selon le matériel** (equipment-taxonomy.md) : une variante n'est proposée que si tout son matériel est dans le profil ; signaler les schémas impossibles et le meilleur substitut.
17. **Étalonnage et progression** (load-calibration.md) : première séance d'un exercice = étalonnage par « répétitions en réserve » ; double progression ; paliers réels des haltères.
18. **Objectifs combinés** (goal-resolver.md) : classés par la personne, fusionnés par des règles explicites, explication de 2 lignes affichée.
19. Ordre des exercices, supersets (antagonistes), durée affichée et ajustable, rotation organisée : program-logic.md.
20. **Sports en familles + prévention** (sports.md) : foot, danse, volley, raquettes ; FIFA 11+, nordique, épaule OSTRC.
21. **Séance manquée** (schedule-adaptation.md) : décaler par défaut, jamais de séance double, 48 h par muscle, compensation limitée en volume, jamais en intensité.
22. **Bibliothèque à deux niveaux** (exercise-catalog.md) : le générateur n'utilise que les fiches « vérifié » ou « utilisable » (0 bloquant, 0 erreur au script, réserves limitées à des choix prudents marqués NON SOURCÉ ; décision du 22/10/2026) ; le brouillon (2 597 variantes / 1 962 mouvements) est consultable avec la mention « non vérifié ».
23. Exercices techniques (snatch, clean) et matériel spécialisé : jamais pour débutants ni à la maison.
24. **Nutrition** (nutrition-rules.md) : plan de repas généré, Ciqual, compléments ENREGISTRÉS par l'utilisateur (jamais prescrits), planchers et alertes de sécurité.

## D. Affichage : l'app est faite pour le téléphone (iPhone d'abord)
25. **Conçue pour un écran de téléphone en portrait**, pas pour un ordinateur : largeurs de référence 375 à 430 px (iPhone SE à Pro Max) ; une seule colonne ; aucun défilement horizontal ; l'ordinateur n'est qu'un affichage de test (cadre de téléphone centré).
26. **Bords de l'iPhone** : `viewport-fit=cover` et marges `env(safe-area-inset-*)` pour l'encoche, la Dynamic Island et la barre d'accueil ; barre de navigation en bas, au-dessus de la barre d'accueil ; app installée en plein écran (`display: standalone`), couleur de barre d'état assortie au thème.
27. **Utilisable en pleine séance** (mains moites, à bout de bras, essoufflé) : zones tactiles d'au moins 44 x 44 px ; gros boutons pour « série faite », « +/- répétitions », « passer le repos » ; minuteur lisible à 1 m ; actions principales à portée du pouce (bas de l'écran) ; pas d'action qui dépend du survol de la souris ; confirmation avant toute action irréversible.
28. **Formulaires** : texte de saisie en 16 px minimum (sinon Safari zoome) ; clavier numérique pour les répétitions et charges (`inputmode="decimal"`) ; pas de petits menus déroulants pour les valeurs fréquentes (boutons +/-).
29. **Lisibilité** : mode sombre par défaut, contrastes suffisants, tailles de texte qui suivent le réglage du téléphone, animations réduites si l'utilisateur l'a demandé.
30. **Performance** : premier affichage rapide sur réseau mobile, images WebP légères chargées à la demande, fonctionne hors-ligne pendant la séance.
31. **Tests d'affichage obligatoires** à chaque fonctionnalité : captures en 375 x 667 (iPhone SE) et 430 x 932 (grands iPhone) avec un navigateur WebKit (moteur de Safari) si possible, en clair et en sombre ; puis liste de ce que l'utilisateur doit vérifier en vrai sur son iPhone (installation sur l'écran d'accueil, encoche, clavier, minuteur écran allumé, son).

## C. Façon de travailler
- Agents (.claude/agents/) : `dev` (code), `coach` (entraînement), `kine` (prévention, blessures, contre-indications, retour après douleur), `nutritionniste`, `relecteur` (contrôle indépendant : vérifie qu'une fiche dit bien ce que ses sources disent ; il n'a pas écrit la fiche et ne la corrige pas lui-même, il liste les écarts).
- Chaque entrée de knowledge/ suit le cycle : rédaction (`coach`/`kine`/`nutritionniste`) -> contrôle (`relecteur`, lancé à neuf, sans le contexte de la rédaction) -> statut mis à jour. Les écarts sont corrigés par l'auteur, puis recontrôlés.
- Ce n'est pas l'équivalent d'un professionnel humain : l'app le dit dans son avertissement.
- Avant une fonctionnalité : relire le plan et le cahier des charges, plan court, question à l'utilisateur seulement si le choix est vraiment ambigu. Après : tests, déploiement, liste de ce qu'il faut vérifier sur l'iPhone. Un commit par fonctionnalité.
- **Déploiement vérifié avant de dire « en ligne »** (décision du 24/10/2026, après les échecs #54 à #60 restés inaperçus) :
  1. Après chaque envoi sur GitHub, vérifier que le déploiement du dernier commit est VERT avant d'écrire « en ligne » ou de demander un test sur l'iPhone : `gh run list --limit 3` (ou l'API publique `https://api.github.com/repos/Martin68230/muscu-app/actions/runs`) puis, pour un échec, `gh run view <id> --log-failed`.
  2. Si le déploiement échoue : le dire tout de suite à l'utilisateur et le corriger en priorité, avant toute autre tâche.
  3. Ne pas envoyer deux commits à quelques secondes d'écart (le premier déploiement est annulé par `concurrency`) : grouper les commits puis envoyer une seule fois.
  4. Avant d'envoyer : rejouer les étapes du workflow dans un clone propre du dépôt (`git clone . $TEMP/clone`, `npm ci`, `npm run fiches`, `npm test`, `npm run check:securite`, `npm run check:fiches`, `npm run build`) : `public/data/fiches.json` est généré et non versionné.
- **Économie de quota** (décision D16, 23/10/2026) :
  1. Une conversation par fonctionnalité (F3, F4, F5…) : commit, bilan de 5 lignes dans docs/, puis nouvelle conversation.
  2. Pendant le développement : seulement les tests du fichier modifié (`npx vitest run <fichier>`). Tests complets et captures iPhone SE (sombre) et grand iPhone (clair) une seule fois par fonctionnalité, à la fin, avant le commit.
  3. Captures : seulement les écrans modifiés, un seul thème pendant le travail.
  4. Sonnet pour tout (dev, coach, kine, relecteur). Opus seulement pour les règles du générateur, F3 et l'audit de sécurité final.
  5. Pas d'agents en parallèle sur le même sujet ; `relecteur` ne reprend que les points corrigés.
  6. Sorties de commandes toujours limitées (`tail`, `head`, `--reporter=line`) ; ne jamais afficher en entier un fichier de plus de 200 lignes.
  7. Pas de skills de design externes. Avant d'installer une skill ou un plugin : le vérifier d'abord (skill verif-securite-skills si disponible).
  8. À chaque fin de fonctionnalité : indiquer le % de quota consommé (avant/après).
- Modèle : Sonnet par défaut ; Opus pour le modèle de données (phase 0), les règles du générateur (phases 2 et 4), les relectures `relecteur` des règles de sécurité et l'audit de sécurité (phase 6).
