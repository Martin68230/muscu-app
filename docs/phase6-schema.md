# Phase 6 : comptes et amis, schéma Supabase (préparation, RIEN d'appliqué)
Statut : écrit le 13/11/2026. Migration `supabase/migrations/0001_init.sql` et tests `supabase/tests/access.test.sql` PAS ENCORE appliqués ni exécutés. Projet Supabase : région eu-west-3 (Paris), plan gratuit, vide. Aucune clé dans le dépôt (seule la clé publique `anon` ira un jour dans l'app, jamais `service_role`).

## 1. Principe : l'app marche sans compte
- Le compte est **facultatif**. Sans compte, l'app fait tout ce qu'elle fait aujourd'hui : séances, programmes, nutrition, export / import JSON, hors ligne.
- Les données restent **d'abord locales** (IndexedDB). Le serveur ne reçoit jamais une copie de la base locale : seulement les petits résumés que la personne choisit de partager.
- **Rien n'est envoyé sans un geste de l'utilisateur** : se connecter, activer un type de partage, publier une séance. Aucun envoi automatique au démarrage, aucune synchronisation cachée. Hors ligne ou sans compte : l'onglet Amis dit simplement « connecte-toi pour voir tes amis », le reste ne change pas.
- Pas de cache du service worker sur l'API Supabase ; jetons de session en mémoire / IndexedDB, jamais dans l'URL ; IA coupée ou sans compte = aucun appel réseau.
- Le code Supabase sera chargé seulement quand on ouvre l'onglet Amis ou qu'on se connecte (pas de requête réseau au lancement).

## 2. Ce qui peut être partagé
Par défaut : **RIEN** (aucune ligne de partage = rien de visible).
| Type | Contenu | Défaut |
|---|---|---|
| Pseudo | choisi par la personne, 3 à 24 caractères, visible seulement des amis et des demandes en cours | visible des amis |
| `seances` | séances TERMINÉES résumées : date, libellé générique facultatif choisi dans une LISTE FERMÉE (Corps entier, Haut du corps, Bas du corps, Poussée, Tirage, Jambes, Bras et épaules, Abdos et gainage, Cardio, Mobilité, Autre), durée, nombre d'exercices et de séries | non |
| `records` | records par exercice (charge, répétitions, durée) | non |
| `regularite` | série de jours, séances sur 7 et 28 jours | non |
**Jamais, en aucun cas** : poids corporel, mensurations, blessures, grossesse, douleurs, notes, santé, nutrition, repas, compléments, programme détaillé. Ces types n'existent pas dans la base : la colonne `shares.data_type` n'accepte que les trois valeurs ci-dessus (contrainte `check`, testée). Ajouter un type exige une relecture sécurité.
Pas d'e-mail visible, pas de nom, pas de photo, pas d'annuaire, pas de recherche de personnes.
**Records et santé** : un record sur un exercice de rééducation, de reprise ou de post-partum révélerait un contexte de santé. La base n'impose que le format de l'identifiant ; **l'app devra filtrer les exercices à étiquette santé** (rééducation, reprise, grossesse / post-partum, adaptation à une blessure) avant toute publication, et ne jamais publier de texte libre. À faire dans l'app (pas maintenant), avec un test.
Réglage : « pour tous mes amis » ou, ensuite, « pour cet ami » (le refus propre à un ami l'emporte). Couper un partage coupe l'accès immédiatement ; l'app supprime aussi les lignes publiées.
Les amis peuvent réagir à une séance visible avec un choix fermé (bravo, force, feu) : pas de texte libre, pas de messagerie, pas de classement public. Défis hebdomadaires de régularité : plus tard, calculés à partir de `regularite`, sans nouvelle donnée.

## 3. Cycle d'une amitié
1. **Invitation** : A crée un code à usage unique (12 caractères, valable 7 jours, 20 codes au plus) et le donne à B hors de l'app (lien ou code). Il n'y a aucun moyen de chercher quelqu'un.
2. **Demande** : B saisit le code → fonction `redeem_invite` crée une demande EN ATTENTE. Un code inconnu, expiré, déjà utilisé ou déjà ami donne la même erreur. Plafonds : 10 demandes par heure, 10 envoyées et 20 reçues en attente.
3. **Acceptation** : seul le destinataire (A) peut accepter (`accept_friend_request`). Refuser ou annuler = supprimer la demande. En attente = **aucun accès** à rien.
4. **Partage choisi par chaque personne** : A règle ce que B voit ; B règle ce que A voit. L'amitié seule ne donne rien. Un ami voit une donnée seulement si : amitié acceptée ET partage activé pour ce type ET pas de refus propre à lui.
5. **Retrait** : l'un ou l'autre supprime l'amitié → plus aucun accès, immédiatement. Maximum 30 amis.

## 4. Majeurs seulement, consentements
- Case « J'ai 18 ans ou plus » obligatoire. Le profil se crée UNIQUEMENT par la fonction `create_profile(pseudo, version du texte)` qui écrit le profil et le consentement `majeur` dans la même transaction (heure du serveur) ; l'insertion directe d'un profil ou d'un consentement `majeur` est refusée par la base. Autres consentements (`vie_privee`, `partage_amis`) : le client les ajoute, sans pouvoir les effacer. Sans profil, aucune table n'est utilisable.
- Les inscriptions restent **fermées** (réglage Supabase Auth, décision du 21/10/2026) : l'utilisateur invite chaque ami depuis le tableau de bord ; e-mail de connexion via SMTP externe. L'e-mail n'est jamais lu par le client ni montré aux amis.

## 5. Suppression et export (RGPD)
- Bouton « Supprimer mon compte et mes données » : fonction `delete_my_account()` qui supprime SA ligne `auth.users` ; toutes les tables liées s'effacent par `on delete cascade` (profil, consentements, codes, demandes, amitiés, partages, séances, records, régularité, réactions). Test : plus aucune ligne.
- À dire clairement : effacement immédiat et définitif, aucune sauvegarde côté serveur sur le plan gratuit ; les données locales du téléphone ne sont pas touchées (export JSON conseillé avant).
- Export : JSON local de l'app (déjà existant) ; en plus, un export de ce que le serveur contient de la personne (ses propres lignes) sera proposé.
- Page vie privée en français : données, finalité, hébergeur Supabase UE, durée, droits, sous-traitants (Supabase, SMTP, GitHub), pas de traceur.

## 6. Tables (toutes avec RLS)
`profiles` (pseudo, majorité) · `consents` · `invite_codes` · `friend_requests` · `friendships` (paire normalisée) · `shares` (partages explicites par type) · `shared_sessions` · `shared_records` · `shared_regularity` · `reactions`.
Clés étrangères en `on delete cascade` vers `profiles` (elle-même liée à `auth.users`). Textes bornés (pseudo, titre 60, identifiants à format fixe), nombres bornés, plafonds de lignes par personne (3000 séances, 1000 records, 20 codes, 200 réglages).

## 7. Garde-fous RLS
- RLS activée sur toutes les tables, une policy par commande, toutes `to authenticated` et liées à `auth.uid()` ; aucune `using (true)` ; aucune vue.
- `anon` : zéro droit sur les tables, zéro exécution de fonction. `authenticated` : droits minimaux au niveau des colonnes (jamais `owner_id` en modification ; `demandes` et `amitiés` en écriture uniquement via fonctions).
- 6 fonctions `security definer`, toutes avec `set search_path = ''`, exécution retirée à `anon` et à PUBLIC : `create_profile`, `friend_can_view`, `redeem_invite`, `accept_friend_request`, `delete_my_account`, et `drop_pair_shares` (trigger : retirer une amitié efface les réglages propres à cet ami, dans les deux sens, pour qu'ils ne se réactivent pas si l'amitié est recréée ; non appelable par les clients). Le client n'a aucun accès à `auth.users`.
- Droits par défaut corrigés (EXECUTE de PUBLIC retiré aussi pour les fonctions futures) ; toute policy est `to authenticated` ; policies écrites avec `(select auth.uid())`.
- Dates de modification imposées par le serveur. L'e-mail n'existe pas dans le schéma public.
- Aucune écriture dans la ligne d'un autre, même pour un ami.

## 8. Tests (avant toute invitation)
`supabase/tests/access.test.sql` (pgTAP, annulé en fin d'exécution) prouve : anonyme = rien ; inconnu = rien ; demande en attente = rien ; ami = seulement ce qui est partagé ; partage coupé = rien tout de suite ; pas d'écriture chez un autre ni de changement de propriétaire ; pas d'auto-acceptation ; types de santé impossibles ; suppression du compte = plus aucune ligne ; structure (RLS partout, pas de `using (true)`, pas de vue sans `security_invoker`, pas de `security definer` sans `search_path` vide, cascades).
Exécution : sur une **branche jetable** Supabase ou en local (`supabase test db`), jamais sur la production. Reste à tester à la main / par script HTTP : inscription spontanée refusée (réglage Auth).

## 9. Limites connues, à décider
- Pas d'unicité des pseudos (évite de révéler qu'un pseudo existe) ; l'app affiche pseudo + date de l'amitié.
- Pas de limitation des tentatives de codes ratés (48 bits, usage unique, expiration 7 jours) ; à compléter si besoin.
- Aucun texte libre n'est vu par un ami (libellés en liste fermée, réactions en liste fermée).
- Synchronisation complète de la base privée (multi-appareils) : HORS de cette étape ; si elle vient, elle aura son propre schéma, privé, sans aucun lien avec les amis.

## 10. Réglages Supabase HORS SQL (à faire dans le tableau de bord, à cocher dans la checklist)
- Inscriptions fermées (« Allow new users to sign up » désactivé) + test d'inscription spontanée refusée ; confirmation e-mail obligatoire ; SMTP externe configuré.
- Limites de débit (rate limits) Auth réglées au plus bas utile ; durée de vie du jeton JWT de 1 heure au plus ; mot de passe de 10 caractères minimum.
- Realtime désactivé (non utilisé) ; seul le schéma `public` exposé par l'API ; pas d'Edge Function ni de stockage de fichiers tant qu'ils ne servent pas.
- Alerte « secret scanning » GitHub activée ; clé `service_role` jamais dans le dépôt ni dans un workflow public ; authentification à deux facteurs (MFA) sur le compte administrateur Supabase et GitHub.
- Plan gratuit : AUCUNE sauvegarde ; le dire clairement dans la page vie privée (suppression définitive, pas de récupération ; export JSON conseillé).
- Après application sur la branche : lancer les alertes de sécurité Supabase (advisors) et lire le résultat.
