# Projet : appli de musculation entre amis (PWA gratuite, privée, ~10 amis majeurs)
Gratuite, sans pub, sans chat, sans photos des utilisateurs, simple et sûre. iPhone d'abord (Safari, écran d'accueil), Android en bonus.
**Avant toute tâche** : docs/reprendre-ici.md (état, prochaine action), docs/plan-fichiers.md (où est quoi), puis seulement ce dont la tâche a besoin : docs/plan-de-construction.md, docs/cahier-des-charges.md, docs/architecture.md, knowledge/README.md.
**Détail complet des 31 règles (texte intégral, numéros conservés)** : docs/regles-projet-detail.md. Ancienne version : docs/archives/CLAUDE-2026-10-30.md.

## Règles non négociables (résumé ; le texte qui fait foi est dans docs/regles-projet-detail.md)
- Gratuit, aucun service payant ni carte (règle 1). PWA statique sur GitHub Pages, local d'abord (IndexedDB), comptes et amis sur Supabase UE en phase 6 (2).
- **Dépôt public : aucun secret** ; Row Level Security sur TOUTES les tables, un ami ne voit que ce qui est partagé après demande acceptée, tests d'accès automatiques (3).
- **Vie privée** : tout privé par défaut, poids et blessures jamais partagés par défaut, aucun traceur (7). Hors-ligne pendant la séance, export / import JSON, suppression du compte et des données (6).
- **Santé** : avertissement « pas un avis médical », profil blessures qui retire ou adapte, douleur = pas de progression, exclusions nutrition (11). Exercices techniques jamais pour débutants ni à la maison (23). Compléments enregistrés, jamais prescrits (24).
- **Contenu sourcé** : toute valeur sport / nutrition vit dans knowledge/ avec source et statut OK / PROVISOIRE / NON SOURCÉ ; rien de PROVISOIRE ou NON SOURCÉ codé en dur sans validation coach / kine / nutritionniste, puis un contrôle relecteur par lot si la valeur touche la sécurité (10, 22 ; voir Vérifications).
- **Licences et images** : seulement free-exercise-db et wger (si la licence le permet), WebP légères ; jamais les images / GIF de maxwu ni aucun visuel d'une autre app ; page crédits ; consignes réécrites en français (12, 13).
- **IA optionnelle** avec interrupteur global ; IA coupée = rien d'IA visible ; elle personnalise dans les règles du code, jamais en dehors (9).
- **Minuteurs** sur l'heure réelle, Wake Lock, son débloqué par un appui, pas d'alarme écran verrouillé (5). Simplicité : pas de messagerie, pas de classement public (8).
- **Affichage téléphone** (25 à 31) : portrait 375-430 px, une colonne, safe-area, zones tactiles >= 44 px, saisie 16 px, mode sombre par défaut. Captures obligatoires 375x667 et 430x932 (WebKit), puis liste à vérifier sur l'iPhone.
- Règles des programmes (14 à 21) : voir knowledge/README.md et le détail.

## Façon de travailler
- Agents (.claude/agents/) : dev (code), coach, kine, nutritionniste, relecteur (ne corrige pas). L'app dit qu'elle ne remplace pas un professionnel.
- **Vérifications (règles du 01/11/2026, remplacent toutes les anciennes ; le quota est la contrainte)** :
  1. Contrôles automatiques (`check:fiches`, tests, build) : UNE fois, juste avant un envoi (clone propre, section ci-dessous), jamais après chaque modification ; aucun agent ne refait ce qu'ils font déjà.
  2. Un agent de relecture n'intervient QUE pour la sécurité d'une personne (contre-indications, cases de sécurité, `safety.ts`, charges, progressions, grossesse / post-partum, douleur) ; jamais pour un texte, un style, une mise en page, un test ou le design.
  3. Un seul passage de relecture par lot (10 à 15 fiches ou une fonctionnalité), jamais fiche par fiche, jamais sur une relecture.
  4. Aucun agent n'en appelle un autre. Après une correction : seulement le contrôle automatique, sauf si la correction touche elle-même une règle de sécurité.
  5. Une seule boucle de correction ; s'il reste un problème, le signaler à l'utilisateur au lieu de relancer.
  6. Statut `controle_relecteur` exigé seulement pour les fiches à enjeu de sécurité.
  7. Ne pas relire un fichier qu'on vient d'écrire ; rapport d'agent : 3 lignes, sans répéter ce qui s'affiche déjà.
- Avant une fonctionnalité : relire le plan, plan court, question à l'utilisateur seulement si le choix est vraiment ambigu. Après : tests, déploiement, liste de ce qu'il faut vérifier sur l'iPhone. Un commit par étape cohérente.
- Sonnet par défaut ; Opus pour le modèle de données, les règles du générateur, les relectures des règles de sécurité et l'audit de sécurité. Une conversation par fonctionnalité ; bilan court dans docs/ ; indiquer le % de quota consommé en fin de fonctionnalité.
- Économie : chercher avant de lire, ne pas relire un fichier déjà lu, sorties de commandes limitées (tail / head), jamais un fichier de plus de 200 lignes en entier, pas de skills de design externes, vérifier toute skill ou plugin avant installation (skill verif-securite-skills).
- Commandes et scripts lancés par un agent : délai maximum obligatoire (commande `timeout`), jamais en tâche de fond sans limite ; un script sans sortie depuis plus de 5 minutes est arrêté et signalé à l'utilisateur (incidents `python3 -` bloqués des 25/10 et 31/10) ; pour modifier des fichiers, préférer les outils d'édition ou Node à `python -` + heredoc.
- Parallélisme : 2 ou 3 agents au maximum, sans fichier en commun, chacun dans sa copie isolée (worktree) ; seul le chef de projet fusionne, commite et pousse. D23, R2, R3, D21 restent dans cet ordre.

## Commit, push, déploiement (détail : docs/deploiement-notes.md)
1. Avant d'envoyer : rejouer le workflow dans un clone propre (`git clone . $TEMP/clone`, `npm ci`, `npm run fiches`, `npm test`, `npm run check:securite`, `npm run check:fiches`, `npm run build`) et LIRE les résultats ; `public/data/fiches.json` est généré, non versionné.
2. Un seul push par groupe d'étapes cohérent, au moins 1 minute entre deux pushs (le workflow annule les déploiements devenus inutiles) ; les modifications de docs/ seules ne redéploient pas ; knowledge/ n'est jamais ignoré.
3. Après l'envoi : vérifier que le déploiement du dernier commit est VERT (`gh run list --limit 3`, ou l'API publique api.github.com/repos/Martin68230/muscu-app/actions/runs ; échec : `gh run view <id> --log-failed`) AVANT d'écrire « en ligne » ou de demander un test iPhone. S'il échoue : le dire tout de suite et le corriger en priorité.
