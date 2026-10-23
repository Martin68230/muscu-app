# Plan de construction (ordre conseillé, 21/10/2026)
Principe : une première version étroite mais complète, utilisable vite, puis on élargit. Les données sont locales dès le départ et conçues pour la synchronisation, donc rien n'est à refaire quand les comptes arrivent.

## Phase 0 : Fondations
Dépôt, PWA installable (manifeste, icône, service worker, mode sombre), navigation (Accueil, Calendrier, Bibliothèque, Amis [masqué jusqu'à la phase 6], Profil), tests automatiques, déploiement GitHub Pages. **Modèle de données complet** (profil, matériel, objectifs, programmes, séances, séries, poids, repas, compléments, partages) en local IndexedDB avec identifiants stables et dates de modification. Export/import JSON. Avertissement santé.
Jalon : l'app s'installe sur ton iPhone et s'ouvre hors-ligne.

## Phase 1 : Contenu minimal vérifié (en parallèle de la phase 2)
**Commencer par un lot pilote d'environ 30 mouvements** (corps entier, poids du corps + haltères) : il fixe le format des fiches et teste la chaîne `coach` -> `kine` -> `relecteur`. L'utilisateur relit ces 30 fiches avant de continuer. Ensuite, vague 1 en lots de 20-30 mouvements, en parallèle du code. Le travail se fait par mouvement (contenu commun), les variantes ne précisent que l'installation et le matériel.
Taxonomie du matériel ; vague 1 restreinte de la bibliothèque pour le parcours de la phase 2 (corps entier, profils de matériel A à F) ; règles validées par le cycle rédaction -> relecteur : repos, volume, étalonnage, échauffement ; photos WebP.

## Phase 2 : Parcours « je m'entraîne » (première version utilisable)
Profil minimal (jours/semaine, jours bloqués, durée, matériel, niveau, objectif principal, blessures) -> générateur v1 (2-3 jours corps entier, maison ou salle, variantes selon le matériel) -> lecteur de séance (photo, consignes, minuteurs, supersets, saisie des répétitions et de la réserve, écran allumé, son) -> bilan -> historique.
Jalon : tu t'entraînes avec pendant 2 semaines et tu notes ce qui gêne.

## Phase 3 : Continuité
Calendrier (fait / reporté / sauté), replanification des séances manquées, progression automatique, étalonnage affiné, échauffement et retour au calme générés.

## Phase 4 : Générateur complet
Toutes les répartitions (1-6 jours), objectifs combinés, fonctionnel, familles de sports et prévention, durée cible, vague 1 complète puis vague 2 de la bibliothèque, mode pressé (20 min) et mode sans matériel.

## Phase 5 : Tableau de bord
Graphiques (charges, volume), records, régularité, poids lissé, carte musculaire, calories estimées.

## Phase 6 : Comptes et amis
Supabase (région UE), **inscriptions fermées** (« Allow new users to sign up » désactivé : l'utilisateur invite ses amis un par un depuis Supabase, décision du 21/10/2026), SMTP externe pour les emails, synchronisation, règles d'accès testées, réglages de partage, fil d'amis (séances terminées, réactions, séries de jours, défis hebdomadaires), suppression de compte. Audit de sécurité (Opus).
**Condition bloquante avant toute invitation (décision D14)** : audit de sécurité complet avec la skill .claude/skills/security-audit (Opus, une seule fois), rapport écrit HORS du dépôt (~/security-audit-skill/muscu-app/run-1, jamais poussé sur GitHub tant que les failles ne sont pas corrigées), correction de toutes les failles « confirmed », vérification ciblée des corrections, résumé simple pour l'utilisateur.
Jalon : inviter 2-3 amis, puis tout le groupe.

## Phase 7 : Nutrition
Besoins estimés et ajustés, plan de repas généré (Ciqual), préférences et allergies, compléments enregistrés avec alertes, liste de courses, substitutions.

## Phase 8 : IA optionnelle
Interrupteur, prompt + import JSON validé, clé API locale, mini-chatbot par exercice, relecture critique d'un programme.

## Phase 9 : Finitions
Vague 3 de la bibliothèque, lecture vocale des consignes, accessibilité, ping de maintien Supabase, page crédits complète.
