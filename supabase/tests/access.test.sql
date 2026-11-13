-- Tests d'acces pgTAP pour 0001_init.sql. A lancer UNIQUEMENT sur une BRANCHE jetable ou une base locale
-- (supabase test db). Tout est annule a la fin (rollback). Aucun secret.
-- Comptes factices : A (proprietaire), B (ami accepte), C (inconnu), D (demande en attente, jamais acceptee).
-- Non testable en SQL : "inscription spontanee refusee" (reglage Auth), voir docs/phase6-checklist.md point 2.

begin;
create extension if not exists pgtap with schema extensions;
select no_plan();

-- Aides --------------------------------------------------------------------
create temp table ctx (k text primary key, v text);
grant all on ctx to public;

create function pg_temp.as_user(u uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims', json_build_object('sub', u, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';
end $$;
create function pg_temp.as_anon() returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims', json_build_object('role', 'anon')::text, true);
  execute 'set local role anon';
end $$;
create function pg_temp.as_admin() returns void language plpgsql as $$
begin
  execute 'reset role';
end $$;
grant execute on function pg_temp.as_user(uuid), pg_temp.as_anon(), pg_temp.as_admin() to public;

-- 0. Garde-fous de structure (lecture du catalogue) ------------------------
select is((select count(*)::int from pg_tables where schemaname = 'public' and not rowsecurity), 0,
  'RLS activee sur toutes les tables du schema public');
select is((select count(*)::int from pg_class c join pg_namespace n on n.oid = c.relnamespace
           where n.nspname = 'public' and c.relkind = 'r'
             and not exists (select 1 from pg_policies p where p.schemaname = 'public' and p.tablename = c.relname)), 0,
  'chaque table a au moins une policy');
select is((select count(*)::int from pg_policies where schemaname = 'public'
           and (qual = 'true' or with_check = 'true')), 0,
  'aucune policy using (true) / with check (true)');
select is((select count(*)::int from pg_policies where schemaname = 'public'
           and roles <> array['authenticated']::name[]), 0,
  'TOUTE policy a roles = {authenticated} (donc aucune policy sans clause to, ni pour anon / public)');
select is((select count(*)::int from pg_class c join pg_namespace n on n.oid = c.relnamespace
           where n.nspname = 'public' and c.relkind in ('v', 'm')
             and not coalesce('security_invoker=true' = any (c.reloptions), false)), 0,
  'aucune vue sans security_invoker');
select is((select count(*)::int from pg_proc p join pg_namespace n on n.oid = p.pronamespace
           where n.nspname = 'public' and p.prosecdef
             and not coalesce('search_path=""' = any (p.proconfig), false)), 0,
  'aucune fonction security definer sans search_path vide');
select is((select count(*)::int from pg_constraint where contype = 'f' and connamespace = 'public'::regnamespace
           and confdeltype <> 'c'), 0, 'toutes les cles etrangeres sont en on delete cascade');
select is((select count(*)::int from pg_class c where c.relnamespace = 'public'::regnamespace and c.relkind in ('r', 'v', 'm', 'S')
           and has_table_privilege('anon', c.oid, 'select,insert,update,delete,truncate,references,trigger')), 0,
  'anon n''a aucun droit (direct ou herite de PUBLIC) sur les tables');
select is((select count(*)::int from pg_class c, aclexplode(c.relacl) a
           where c.relnamespace = 'public'::regnamespace and a.grantee = 0), 0, 'aucun droit accorde a PUBLIC sur les tables');
select is((select count(*)::int from pg_attribute at join pg_class c on c.oid = at.attrelid
           where c.relnamespace = 'public'::regnamespace and c.relkind = 'r' and at.attnum > 0 and not at.attisdropped
             and has_column_privilege('anon', c.oid, at.attnum, 'select,insert,update,references')), 0,
  'anon n''a aucun droit sur aucune colonne');
select is((select count(*)::int from pg_proc p where p.pronamespace = 'public'::regnamespace
           and has_function_privilege('anon', p.oid, 'execute')), 0, 'anon ne peut executer aucune fonction de public');
select is((select count(*)::int from pg_proc p where p.pronamespace = 'public'::regnamespace
           and (p.proacl is null or exists (select 1 from aclexplode(p.proacl) a where a.grantee = 0))), 0,
  'aucune fonction de public n''est executable par PUBLIC');
select is((select count(*)::int from pg_proc p where p.pronamespace = 'public'::regnamespace
           and p.proname in ('touch_updated_at', 'drop_pair_shares')
           and has_function_privilege('authenticated', p.oid, 'execute')), 0,
  'les fonctions de trigger ne sont pas appelables par les comptes connectes');
select is((select (length(d) - length(replace(d, '::text', ''))) / 6 from (
             select pg_get_constraintdef(oid) as d from pg_constraint
             where conrelid = 'public.shares'::regclass and contype = 'c' and pg_get_constraintdef(oid) ~ 'data_type') q), 3,
  'le CHECK shares.data_type contient exactement 3 valeurs');
select ok((select bool_and(d like '%''seances''%' and d like '%''records''%' and d like '%''regularite''%') from (
             select pg_get_constraintdef(oid) as d from pg_constraint
             where conrelid = 'public.shares'::regclass and contype = 'c' and pg_get_constraintdef(oid) ~ 'data_type') q),
  'ces 3 valeurs sont seances, records, regularite');
create function public.zz_probe() returns int language sql as 'select 1';
select is(has_function_privilege('anon', 'public.zz_probe()', 'execute'), false,
  'une NOUVELLE fonction n''est pas executable par defaut (droits par defaut corriges)');
drop function public.zz_probe();

-- 1. Mise en place (en tant qu'administrateur) -----------------------------
insert into auth.users (id, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a@test.invalid'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'b@test.invalid'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'c@test.invalid'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'd@test.invalid');
select pg_temp.as_user('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
select lives_ok($$select public.create_profile('Alice', '2026-11-13')$$, 'A cree son profil');
select pg_temp.as_user('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
select lives_ok($$select public.create_profile('Bob', '2026-11-13')$$, 'B cree son profil');
select pg_temp.as_user('cccccccc-cccc-cccc-cccc-cccccccccccc');
select lives_ok($$select public.create_profile('Carl', '2026-11-13')$$, 'C cree son profil');
select throws_ok($$select public.create_profile('Carl2', '2026-11-13')$$, '23505', null, 'un seul profil par compte');
select throws_ok($$insert into public.profiles (id, pseudo, adult_confirmed_at)
  values ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Zed', now())$$, '42501', null,
  'insertion directe d''un profil impossible (sans consentement majeur)');
select throws_ok($$insert into public.consents (kind, version) values ('majeur', '2026-11-14')$$, '42501', null,
  'le client ne peut pas ecrire un consentement majeur lui-meme');
select throws_ok($$delete from auth.users$$, '42501', null, 'aucun acces a auth.users (ecriture)');
select throws_ok($$select count(*) from auth.users$$, '42501', null, 'aucun acces a auth.users (lecture)');
select throws_ok($$select public.touch_updated_at()$$, '42501', null, 'authenticated n''appelle pas touch_updated_at');
select pg_temp.as_user('dddddddd-dddd-dddd-dddd-dddddddddddd');
select lives_ok($$select public.create_profile('Dora', '2026-11-13')$$, 'D cree son profil');
select pg_temp.as_admin();
select is((select count(*)::int from public.profiles p where not exists (
  select 1 from public.consents c where c.user_id = p.id and c.kind = 'majeur')), 0,
  'chaque profil a son consentement majeur');

-- 2. Cle anonyme sans connexion : rien ------------------------------------
select pg_temp.as_anon();
select throws_ok($$select count(*) from public.profiles$$, '42501', null, 'anon ne lit pas profiles');
select throws_ok($$select count(*) from public.shared_sessions$$, '42501', null, 'anon ne lit pas shared_sessions');
select throws_ok($$select count(*) from public.shares$$, '42501', null, 'anon ne lit pas shares');
select throws_ok($$select count(*) from public.friendships$$, '42501', null, 'anon ne lit pas friendships');
select throws_ok($$insert into public.profiles (id, pseudo) values (gen_random_uuid(), 'Zorro')$$, '42501', null,
  'anon ne cree pas de profil');
select throws_ok($$select public.redeem_invite('AAAAAAAAAAAA')$$, '42501', null, 'anon ne peut pas appeler redeem_invite');
select throws_ok($$select public.delete_my_account()$$, '42501', null, 'anon ne peut pas appeler delete_my_account');
select throws_ok($$select public.create_profile('Anon', '2026-11-13')$$, '42501', null, 'anon ne peut pas appeler create_profile');
select throws_ok($$select public.friend_can_view('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'seances')$$, '42501', null,
  'anon ne peut pas appeler friend_can_view');
select pg_temp.as_admin();

-- 3. A cree des invitations, B et D les utilisent (demandes en attente) -----
select pg_temp.as_user('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
with c as (insert into public.invite_codes (owner_id) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa') returning code)
  insert into ctx select 'codeB', code from c;
with c as (insert into public.invite_codes (owner_id) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa') returning code)
  insert into ctx select 'codeD', code from c;
with c as (insert into public.invite_codes (owner_id) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa') returning code)
  insert into ctx select 'codeE', code from c;
with c as (insert into public.invite_codes (owner_id) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa') returning code)
  insert into ctx select 'codeS', code from c;
with c as (insert into public.invite_codes (owner_id) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa') returning code)
  insert into ctx select 'codeX', code from c;
select throws_ok($$select public.redeem_invite((select v from ctx where k = 'codeS'))$$, '22023', null,
  'auto-invitation refusee');
select throws_ok($$insert into public.invite_codes (owner_id, code) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'AAAAAAAAAAAA')$$,
  '42501', null, 'le client ne choisit pas son code');
select pg_temp.as_admin();

update public.invite_codes set expires_at = now() - interval '1 day' where code = (select v from ctx where k = 'codeE');
select pg_temp.as_user('cccccccc-cccc-cccc-cccc-cccccccccccc');
select throws_ok($$select public.redeem_invite((select v from ctx where k = 'codeE'))$$, '22023', null, 'code expire refuse');
select is((select count(*)::int from public.invite_codes), 0, 'un inconnu ne voit aucun code d''invitation');
select throws_ok($$select public.redeem_invite('000000000000')$$, '22023', null, 'code inconnu refuse');
select pg_temp.as_admin();

select pg_temp.as_user('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
select lives_ok($$select public.redeem_invite((select v from ctx where k = 'codeB'))$$, 'B utilise son code');
select throws_ok($$select public.redeem_invite((select v from ctx where k = 'codeB'))$$, '22023', null,
  'un code est a usage unique');
select throws_ok($$insert into public.friend_requests (requester_id, addressee_id)
  values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc')$$, '42501', null,
  'pas de demande creee directement');
select throws_ok($$insert into public.friendships (user_low, user_high)
  values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc')$$, '42501', null,
  'pas d''amitie creee directement');
select pg_temp.as_admin();

select pg_temp.as_user('dddddddd-dddd-dddd-dddd-dddddddddddd');
select lives_ok($$select public.redeem_invite((select v from ctx where k = 'codeD'))$$, 'D utilise son code');
select pg_temp.as_admin();

-- 4. A prepare ses donnees ; seances partagees par defaut pour les amis -----
select pg_temp.as_user('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
select lives_ok($$insert into public.shares (owner_id, data_type, enabled)
  values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'seances', true)$$, 'A active le partage des seances');
select lives_ok($$insert into public.shared_sessions (owner_id, local_id, session_date, label, duration_min, exercise_count, set_count)
  values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', gen_random_uuid(), current_date, 'Haut du corps', 45, 6, 18)$$,
  'A publie une seance terminee');
select lives_ok($$insert into public.shared_records (owner_id, exercise_id, kind, value, achieved_on)
  values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'developpe-couche-barre', 'charge_kg', 60, current_date)$$,
  'A enregistre un record (non partage)');
select lives_ok($$insert into public.shared_regularity (owner_id, streak_days, sessions_7d, sessions_28d)
  values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3, 3, 10)$$, 'A enregistre sa regularite (non partagee)');
select throws_ok(
  format($f$insert into public.shares (owner_id, data_type, enabled) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', %L, true)$f$, t),
  '23514', null, 'type de partage refuse : ' || t)
  from unnest(array['poids_corporel', 'mensurations', 'blessures', 'grossesse', 'douleurs', 'complements', 'nutrition', 'repas', 'programme', 'notes']) as t;
select throws_ok($$insert into public.shared_sessions (owner_id, local_id, session_date, label, duration_min, exercise_count, set_count)
  values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', gen_random_uuid(), current_date, 'retour épaule', 45, 6, 18)$$,
  '23514', null, 'libelle libre refuse (liste fermee)');
select throws_ok($$insert into public.shared_records (owner_id, exercise_id, kind, value, achieved_on)
  values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Retour Epaule!', 'charge_kg', 5, current_date)$$,
  '23514', null, 'identifiant d''exercice hors format refuse');
select pg_temp.as_admin();

-- Pression sur les plafonds (10 demandes envoyees, 20 recues, 30 amis) avec des comptes factices (anciennes demandes :
-- seule la limite en attente joue, pas la limite horaire).
insert into auth.users (id, email) select md5('u' || i)::uuid, 'u' || i || '@test.invalid' from generate_series(1, 60) i;
insert into public.profiles (id, pseudo, adult_confirmed_at)
  select md5('u' || i)::uuid, 'Dummy' || i, now() from generate_series(1, 60) i;
insert into public.friend_requests (requester_id, addressee_id, created_at)
  select md5('u1')::uuid, md5('u' || i)::uuid, now() - interval '2 days' from generate_series(2, 11) i;
insert into public.friend_requests (requester_id, addressee_id, created_at)
  select md5('u' || i)::uuid, md5('u20')::uuid, now() - interval '2 days' from generate_series(21, 40) i;
insert into public.friendships (user_low, user_high)
  select least(md5('u60')::uuid, md5('u' || i)::uuid), greatest(md5('u60')::uuid, md5('u' || i)::uuid) from generate_series(3, 32) i;
insert into public.invite_codes (owner_id, code) values (md5('u20')::uuid, '111111111111'), (md5('u60')::uuid, '222222222222');

select pg_temp.as_user(md5('u1')::uuid);
select throws_ok($$select public.redeem_invite((select v from ctx where k = 'codeX'))$$, '54000', null,
  'plafond : 10 demandes envoyees en attente');
select pg_temp.as_user(md5('u50')::uuid);
select throws_ok($$select public.redeem_invite('111111111111')$$, '54000', null, 'plafond : 20 demandes recues en attente');
select throws_ok($$select public.redeem_invite('222222222222')$$, '54000', null, 'plafond : 30 amis');
select pg_temp.as_admin();

insert into ctx select 'sess', id::text from public.shared_sessions
  where owner_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- 5. Sans amitie acceptee : rien (inconnu C, demande en attente D et B) ------
select pg_temp.as_user('cccccccc-cccc-cccc-cccc-cccccccccccc');
select is((select count(*)::int from public.shared_sessions), 0, 'inconnu : aucune seance');
select is((select count(*)::int from public.shared_records), 0, 'inconnu : aucun record');
select is((select count(*)::int from public.shared_regularity), 0, 'inconnu : aucune regularite');
select is((select count(*)::int from public.shares), 0, 'inconnu : aucun reglage de partage');
select is((select count(*)::int from public.profiles where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 0,
  'inconnu : ne voit pas le profil de A (pas d''annuaire)');
select is((select count(*)::int from public.friend_requests), 0, 'inconnu : aucune demande');
select pg_temp.as_admin();

select pg_temp.as_user('dddddddd-dddd-dddd-dddd-dddddddddddd');
select is((select count(*)::int from public.shared_sessions), 0, 'demande en attente : aucune seance');
select is((select count(*)::int from public.shared_records), 0, 'demande en attente : aucun record');
select pg_temp.as_admin();

select pg_temp.as_user('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
select is((select count(*)::int from public.shared_sessions), 0, 'avant acceptation, B ne voit aucune seance');
select ok(exists (select 1 from public.friend_requests where requester_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  'la demande de B existe bien (visible de B)');
select throws_ok($$select public.accept_friend_request((select id from public.friend_requests where requester_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'))$$,
  'P0002', null, 'le demandeur ne peut pas s''accepter lui-meme');
select pg_temp.as_admin();

select pg_temp.as_user('dddddddd-dddd-dddd-dddd-dddddddddddd');
select ok(exists (select 1 from public.friend_requests where requester_id = 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
  'la demande de D existe bien (visible de D)');
select throws_ok($$select public.accept_friend_request((select id from public.friend_requests where requester_id = 'dddddddd-dddd-dddd-dddd-dddddddddddd'))$$,
  'P0002', null, 'D non plus');
select pg_temp.as_admin();

-- 6. A accepte B seulement ---------------------------------------------------
select pg_temp.as_user('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
select lives_ok($$select public.accept_friend_request((select id from public.friend_requests where requester_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'))$$,
  'A accepte la demande de B');
select pg_temp.as_admin();

select pg_temp.as_user('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
select is((select count(*)::int from public.shared_sessions), 1, 'ami : voit la seance partagee');
select is((select count(*)::int from public.shared_records), 0, 'ami : pas les records (non partages)');
select is((select count(*)::int from public.shared_regularity), 0, 'ami : pas la regularite (non partagee)');
select is((select count(*)::int from public.shares), 0, 'ami : ne lit jamais les reglages de partage de A');
select is((select count(*)::int from public.profiles where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 1,
  'ami : voit le pseudo de A');
select pg_temp.as_admin();

select pg_temp.as_user('dddddddd-dddd-dddd-dddd-dddddddddddd');
select is((select count(*)::int from public.shared_sessions), 0, 'D (toujours en attente) ne voit toujours rien');
select pg_temp.as_admin();
select pg_temp.as_user('cccccccc-cccc-cccc-cccc-cccccccccccc');
select is((select count(*)::int from public.shared_sessions), 0, 'C ne voit toujours rien');
select pg_temp.as_admin();

-- 7. Reactions : seulement sur ce qu'on peut voir ----------------------------
select pg_temp.as_user('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
select lives_ok($$insert into public.reactions (session_id, user_id, kind)
  values ((select id from public.shared_sessions limit 1), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bravo')$$,
  'B reagit a la seance de A');
select pg_temp.as_admin();
select pg_temp.as_user('cccccccc-cccc-cccc-cccc-cccccccccccc');
select throws_ok($$insert into public.reactions (session_id, user_id, kind)
  values ((select v::uuid from ctx where k = 'sess'), 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'bravo')$$,
  '42501', null, 'C ne peut pas reagir a une seance qu''il ne voit pas');
select is((select count(*)::int from public.reactions), 0, 'C ne voit aucune reaction');
select pg_temp.as_admin();
select pg_temp.as_user('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
select is((select count(*)::int from public.reactions), 1, 'A voit la reaction recue');
select pg_temp.as_admin();

-- 8. Personne n'ecrit chez un autre ------------------------------------------
select pg_temp.as_user('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
select throws_ok($$insert into public.shared_sessions (owner_id, local_id, session_date, duration_min, exercise_count, set_count)
  values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', gen_random_uuid(), current_date, 30, 5, 15)$$,
  '42501', null, 'B ne peut pas ajouter une seance au nom de A');
select throws_ok($$insert into public.shares (owner_id, data_type, enabled)
  values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'records', true)$$,
  '42501', null, 'B ne peut pas ouvrir les partages de A');
select lives_ok($$delete from public.shared_sessions where owner_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'$$,
  'B tente de supprimer la seance de A (0 ligne touchee)');
select lives_ok($$update public.profiles set pseudo = 'Pirate' where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'$$,
  'B tente de renommer A (0 ligne touchee)');
select lives_ok($$update public.shares set enabled = false where owner_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'$$,
  'B tente de couper un partage de A (0 ligne touchee)');
select throws_ok($$update public.shared_sessions set duration_min = 1$$, '42501', null, 'une seance publiee ne se modifie pas');
select throws_ok($$update public.profiles set id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' where id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'$$,
  '42501', null, 'on ne change pas l''identifiant de son profil');
select throws_ok($$insert into public.consents (user_id, kind, version) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'majeur', '2026-11-13')$$,
  '42501', null, 'B ne peut pas enregistrer un consentement au nom de A');
select pg_temp.as_admin();

select is((select count(*)::int from public.shared_sessions where owner_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 1,
  'la seance de A est intacte');
select is((select pseudo from public.profiles where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 'Alice', 'le pseudo de A est intact');
select is((select enabled from public.shares where owner_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' and data_type = 'seances'), true,
  'le partage de A est intact');

select pg_temp.as_user('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
select throws_ok($$update public.shared_records set owner_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'$$,
  '42501', null, 'owner_id ne peut pas etre change');
select throws_ok($$update public.profiles set pseudo = 'x' where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'$$,
  '23514', null, 'pseudo trop court refuse');
select pg_temp.as_admin();

-- 9. Partages : activer, couper, reglage propre a un ami -------------------
select pg_temp.as_user('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
select lives_ok($$insert into public.shares (owner_id, data_type, enabled)
  values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'records', true)$$, 'A ouvre les records');
select throws_ok($$insert into public.shares (owner_id, friend_id, data_type, enabled)
  values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'seances', true)$$,
  '42501', null, 'reglage pour un non-ami refuse');
select pg_temp.as_admin();
select pg_temp.as_user('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
select is((select count(*)::int from public.shared_records), 1, 'ami : voit maintenant les records');
select pg_temp.as_admin();

select pg_temp.as_user('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
select lives_ok($$update public.shares set enabled = false where data_type = 'records'$$, 'A coupe les records');
select pg_temp.as_admin();
select pg_temp.as_user('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
select is((select count(*)::int from public.shared_records), 0, 'partage coupe = plus rien, immediatement');
select pg_temp.as_admin();

select pg_temp.as_user('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
select lives_ok($$insert into public.shares (owner_id, friend_id, data_type, enabled)
  values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'seances', false)$$,
  'A coupe les seances pour B seulement');
select pg_temp.as_admin();
select pg_temp.as_user('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
select is((select count(*)::int from public.shared_sessions), 0, 'le refus propre a B l''emporte sur le reglage general');
select pg_temp.as_admin();

-- Reglage propre a un ami active alors que le reglage general est coupe.
select pg_temp.as_user('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
select lives_ok($$insert into public.shares (owner_id, friend_id, data_type, enabled)
  values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'regularite', true)$$,
  'A ouvre la regularite pour B seulement (aucun reglage general)');
select pg_temp.as_admin();
select pg_temp.as_user('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
select is((select count(*)::int from public.shared_regularity), 1, 'le reglage propre a B suffit');
select is(public.friend_can_view('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'regularite'), true, 'friend_can_view : ami autorise');
select is(public.friend_can_view('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'poids_corporel'), false, 'friend_can_view : type inconnu = faux');
select pg_temp.as_admin();
select pg_temp.as_user('cccccccc-cccc-cccc-cccc-cccccccccccc');
select is(public.friend_can_view('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'seances'), false, 'friend_can_view : non-ami = faux');
select is(public.friend_can_view('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'regularite'), false, 'friend_can_view : non-ami = faux (regularite)');
select pg_temp.as_admin();
select pg_temp.as_user('dddddddd-dddd-dddd-dddd-dddddddddddd');
select is(public.friend_can_view('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'seances'), false, 'friend_can_view : demande en attente = faux');
select pg_temp.as_admin();

-- 10. Retirer un ami coupe tout, y compris les reglages propres a cet ami ----
-- (on supprime l'amitie SANS supprimer d'abord les shares : le trigger s'en charge)
select pg_temp.as_user('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
select lives_ok($$delete from public.friendships$$, 'A retire B de ses amis');
select pg_temp.as_admin();
select is((select count(*)::int from public.shares where friend_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), 0,
  'les reglages propres a B ont disparu avec l''amitie');
select ok((select count(*) from public.shares where owner_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' and friend_id is null) >= 1,
  'les reglages generaux de A restent');
select pg_temp.as_user('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
select is((select count(*)::int from public.shared_sessions), 0, 'ex-ami : plus rien');
select is((select count(*)::int from public.shared_regularity), 0, 'ex-ami : plus de regularite');
select pg_temp.as_admin();

-- Amitie recreee : aucun ancien reglage ne se reactive en silence.
select pg_temp.as_user('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
with c as (insert into public.invite_codes (owner_id) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa') returning code)
  insert into ctx select 'codeB2', code from c;
select pg_temp.as_user('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
select lives_ok($$select public.redeem_invite((select v from ctx where k = 'codeB2'))$$, 'B redemande l''amitie');
select pg_temp.as_user('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
select lives_ok($$select public.accept_friend_request((select id from public.friend_requests where requester_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'))$$,
  'A accepte a nouveau');
select pg_temp.as_user('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
select is((select count(*)::int from public.shared_regularity), 0, 'le reglage propre d''avant ne s''est pas reactive');
select is((select count(*)::int from public.shared_sessions), 1, 'seul le reglage general (seances) s''applique');
select pg_temp.as_admin();

-- 11. Suppression du compte : tout disparait -------------------------------
-- Avant : A a un consentement supplementaire, une amitie, un reglage propre a B, et B a un reglage visant A (friend_id = A).
select pg_temp.as_user('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
select lives_ok($$insert into public.consents (kind, version) values ('vie_privee', '2026-11-13')$$, 'A ajoute un consentement');
select lives_ok($$insert into public.shares (owner_id, friend_id, data_type, enabled)
  values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'records', true)$$, 'A ajoute un reglage pour B');
select pg_temp.as_user('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
select lives_ok($$insert into public.shares (owner_id, friend_id, data_type, enabled)
  values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'records', true)$$,
  'B ajoute un reglage visant A');
select pg_temp.as_admin();
select cmp_ok((select count(*)::int from public.consents where user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), '>=', 2, 'A a au moins 2 consentements');
select is((select count(*)::int from public.friendships where 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' in (user_low, user_high)), 1, 'A a une amitie');
select is((select count(*)::int from public.shares where friend_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 1, 'un reglage vise A');

select pg_temp.as_user('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
select lives_ok($$select public.delete_my_account()$$, 'A supprime son compte');
select pg_temp.as_admin();
select is((
  (select count(*) from auth.users where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
  + (select count(*) from public.profiles where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
  + (select count(*) from public.consents where user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
  + (select count(*) from public.invite_codes where owner_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
  + (select count(*) from public.friend_requests where 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' in (requester_id, addressee_id))
  + (select count(*) from public.friendships where 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' in (user_low, user_high))
  + (select count(*) from public.shares where 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' in (owner_id, friend_id))
  + (select count(*) from public.shared_sessions where owner_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
  + (select count(*) from public.shared_records where owner_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
  + (select count(*) from public.shared_regularity where owner_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
  + (select count(*) from public.reactions where user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
)::int, 0, 'suppression du compte : aucune ligne de A ne reste, nulle part');
select is((select count(*)::int from public.reactions), 0, 'les reactions sur les seances de A sont parties aussi');
select is((select count(*)::int from public.profiles where id in ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'dddddddd-dddd-dddd-dddd-dddddddddddd')), 3,
  'delete_my_account n''a efface que A : B, C, D intacts');
select is((select count(*)::int from public.consents where user_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), 1, 'le consentement de B est intact');
select is((select count(*)::int from public.profiles where pseudo like 'Dummy%'), 60, 'les comptes factices non plus');

select * from finish();
rollback;
