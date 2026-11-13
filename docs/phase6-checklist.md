# Checklist « avant la phase 6 » (obligatoire avant la première invitation)
Cocher uniquement quand c'est fait ET vérifié. Mise à jour : 13/11/2026 (préparation, rien appliqué).

| # | Exigence | État |
|---|---|---|
| 1 | Import / sauvegarde JSON durci (formes, tailles, dates futures, protections de sécurité) et test à jour ; workflow GitHub : actions épinglées, permissions minimales | [ ] à faire (vérifier ce qui est déjà corrigé) |
| 2 | Supabase en région UE ; inscriptions fermées ; test : une inscription spontanée est refusée ; confirmation e-mail obligatoire ; SMTP externe configuré | [ ] à faire (région UE : fait, projet eu-west-3) |
| 3 | Seule la clé publique `anon` dans le code ; clé `service_role` jamais dans le dépôt ni dans un workflow public ; contrôle de secrets en CI ; alerte « secret scanning » activée | [ ] à faire |
| 4 | RLS activée sur TOUTES les tables dès leur création ; aucune table sans policy ; test automatique qui échoue si une table n'a pas la RLS | [ ] écrit (0001_init.sql + access.test.sql), à exécuter |
| 5 | Policies liées à `auth.uid()` ; lecture par un ami seulement si amitié acceptée ET partage explicite ; jamais d'écriture pour un ami ; vues et fonctions sans contournement de la RLS | [ ] écrit (corrigé après relecture : libellés fermés, droits par défaut, create_profile, nettoyage des partages), à exécuter |
| 6 | Tests d'accès automatiques (deux comptes + un tiers) : tiers = rien, demande en attente = rien, partage coupé = rien, pas d'accès ni d'écriture chez un autre, pas d'auto-acceptation, propriétaire non modifiable | [ ] écrit, à exécuter sur une branche jetable |
| 7 | Santé jamais partageable (poids, mensurations, blessures, grossesse, douleurs, compléments, notes, repas) : contrainte en base + test ; partage par défaut = rien ; le fil n'expose que des séances terminées sans note ni douleur | [ ] écrit, à exécuter |
| 8 | Suppression du compte et des données (cascade + compte d'authentification), testée ; sauvegarde / délai expliqués à la personne | [ ] écrit côté base ; écran de l'app à faire |
| 9 | Amis visibles par pseudo seulement ; pas d'annuaire ni de recherche ; invitation par code à usage unique | [ ] écrit, à exécuter |
| 10 | Limites : taille des textes et nombre de lignes par personne ; limitation des demandes ; pas de messagerie ni de texte libre vu par un tiers | [ ] écrit, à exécuter |
| 11 | CSP : `connect-src` limité à l'adresse exacte du projet Supabase, jamais `https:` ni joker (test qui échoue sinon) ; aucun cache de l'API par le service worker ; jetons jamais dans l'URL | [ ] à faire (côté app) |
| 12 | Mêmes validations côté envoi que pour l'import local ; propriétaire et dates imposés par le serveur | [ ] propriétaire et dates : écrit ; validation côté app à faire |
| 13 | Majeurs seulement (case de confirmation d'âge et consentements) ; page vie privée en français (données, finalité, hébergeur UE, durée, droits, sous-traitants) ; aucun traceur ; consentement explicite avant tout partage | [ ] écrit côté base ; textes et écrans à faire |
| 14 | IA : clé uniquement sur l'appareil, jamais envoyée au serveur ; interrupteur global ; IA coupée = aucun appel réseau | [ ] à faire |
| 15 | Test sur le téléphone de l'utilisateur ; vérification ciblée des corrections ; relecture sécurité par un professionnel / agent avant d'appliquer la migration ; rapport d'audit gardé hors du dépôt public | [ ] à faire |

## Réglages Supabase hors SQL (relecteur sécurité)
| Réglage | État |
|---|---|
| Inscriptions fermées + test d'inscription spontanée refusée | [ ] à faire |
| Confirmation e-mail obligatoire ; SMTP externe configuré | [ ] à faire |
| Limites de débit Auth réglées ; JWT 1 h au plus ; mot de passe 10 caractères au moins | [ ] à faire |
| Realtime désactivé ; seul le schéma public exposé | [ ] à faire |
| Secret scanning GitHub activé ; MFA sur les comptes administrateur Supabase et GitHub | [ ] à faire |
| Page vie privée : pas de sauvegarde sur le plan gratuit, suppression définitive | [ ] à faire |
| Alertes de sécurité Supabase (advisors) lues après application sur la branche | [ ] à faire |

## Ordre conseillé
1. Relecture sécurité de `0001_init.sql` et `access.test.sql` (règles de la phase 6).
2. Créer une branche jetable Supabase, appliquer la migration, lancer les tests, lire les résultats.
3. Appliquer sur le projet seulement si tout est vert ; régler Auth (inscriptions fermées, confirmation e-mail, SMTP).
4. Brancher l'app (client chargé à la demande, CSP, écrans Amis, suppression, vie privée) en phase suivante.
5. Inviter 2 ou 3 amis, puis le groupe.
