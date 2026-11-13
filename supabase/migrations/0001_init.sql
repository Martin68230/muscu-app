-- 0001_init.sql : phase 6, comptes et amis (Supabase UE). NON APPLIQUEE : a relire (relecteur securite)
-- puis a tester sur une BRANCHE jetable avec supabase/tests/access.test.sql avant tout appliquer.
-- Aucun secret ici. Detail et raisons : docs/phase6-schema.md.
--
-- Principes :
--  * RLS activee sur TOUTES les tables, une policy par commande (select / insert / update / delete).
--    Une commande sans policy est REFUSEE (voulu, indique en commentaire).
--  * Le role anon n'a AUCUN droit. Le role authenticated n'a que les droits listes (colonnes comprises).
--  * Pas de vue. 6 fonctions security definer seulement (create_profile, friend_can_view, redeem_invite,
--    accept_friend_request, delete_my_account, drop_pair_shares), toutes avec search_path vide.
--  * Aucune donnee de sante : le type de partage n'existe pas (contrainte en base).

-- ---------------------------------------------------------------------------
-- 0. Droits par defaut : rien pour anon / authenticated, on accorde au cas par cas
-- ---------------------------------------------------------------------------
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
alter default privileges in schema public revoke execute on functions from public, anon, authenticated;
-- PostgreSQL donne EXECUTE a PUBLIC par defaut sur toute nouvelle fonction ; seule la forme SANS "in schema"
-- retire ce droit global. Chaque fonction ci-dessous est en plus revoquee explicitement.
alter default privileges revoke execute on functions from public;

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------

-- Profil public minimal : pseudo + preuve de majorite. Cree UNIQUEMENT par create_profile (profil + consentement 'majeur', atomique). Pas d'e-mail, pas de nom, pas de poids.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  pseudo text not null,
  adult_confirmed_at timestamptz not null, -- pose par create_profile (heure du serveur), jamais par le client
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_pseudo_format check (
    char_length(pseudo) between 3 and 24
    and pseudo ~ '^[A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9 _.-]*[A-Za-zÀ-ÿ0-9]$'
  )
);
alter table public.profiles enable row level security;

-- Consentements (majorite, vie privee, partage aux amis) : une ligne par type et version.
create table public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('majeur', 'vie_privee', 'partage_amis')),
  version text not null check (version ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'),
  accepted_at timestamptz not null default now(),
  unique (user_id, kind, version)
);
alter table public.consents enable row level security;

-- Codes d'invitation a usage unique (pas d'annuaire, pas de recherche de personnes).
create table public.invite_codes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  code text not null unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12)),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '7 days',
  used_at timestamptz,
  constraint invite_codes_code_format check (code ~ '^[A-F0-9]{12}$'),
  constraint invite_codes_expiry check (expires_at <= created_at + interval '30 days')
);
alter table public.invite_codes enable row level security;

-- Demandes d'amis en attente (creees seulement par redeem_invite ; supprimees si refusees ou acceptees).
create table public.friend_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles (id) on delete cascade,
  addressee_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (requester_id, addressee_id),
  check (requester_id <> addressee_id)
);
alter table public.friend_requests enable row level security;

-- Amities acceptees (creees seulement par accept_friend_request). Paire normalisee : user_low < user_high.
create table public.friendships (
  user_low uuid not null references public.profiles (id) on delete cascade,
  user_high uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_low, user_high),
  check (user_low < user_high)
);
alter table public.friendships enable row level security;

-- Partages explicites. Par defaut RIEN (aucune ligne = rien de partage).
-- friend_id null = reglage pour tous les amis ; sinon reglage pour un ami (il l'emporte sur le reglage general).
-- Liste FERMEE : poids_corporel, blessures, nutrition, programme, grossesse, douleurs, complements n'existent pas.
-- Toute modification de cette liste exige une relecture securite.
create table public.shares (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  friend_id uuid references public.profiles (id) on delete cascade,
  data_type text not null check (data_type in ('seances', 'records', 'regularite')),
  enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (friend_id is null or friend_id <> owner_id),
  unique nulls not distinct (owner_id, data_type, friend_id)
);
alter table public.shares enable row level security;

-- Resume d'une seance TERMINEE. Ni note, ni douleur, ni poids corporel, ni detail des series.
create table public.shared_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  local_id uuid not null,
  session_date date not null check (session_date <= current_date + 1),
  -- Liste FERMEE de libelles generiques (jamais de texte libre : "retour epaule" reveillerait un contexte de sante).
  label text check (label is null or label in ('Corps entier', 'Haut du corps', 'Bas du corps', 'Poussée', 'Tirage',
    'Jambes', 'Bras et épaules', 'Abdos et gainage', 'Cardio', 'Mobilité', 'Autre')),
  duration_min integer not null check (duration_min between 1 and 600),
  exercise_count integer not null check (exercise_count between 0 and 60),
  set_count integer not null check (set_count between 0 and 500),
  created_at timestamptz not null default now(),
  unique (owner_id, local_id)
);
alter table public.shared_sessions enable row level security;

-- Records personnels (charge, repetitions, duree) par exercice (identifiant stable de la bibliotheque).
-- ATTENTION : un exercice de reeducation / post-partum revele un contexte de sante. L'app doit filtrer les exercices a
-- etiquette sante AVANT publication (voir docs/phase6-schema.md) ; la base impose seulement le format.
create table public.shared_records (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  exercise_id text not null check (exercise_id ~ '^[a-z0-9][a-z0-9_-]{0,79}$'),
  kind text not null check (kind in ('charge_kg', 'reps', 'duree_s')),
  value numeric(8, 2) not null check (value > 0 and value < 100000),
  achieved_on date not null check (achieved_on <= current_date + 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, exercise_id, kind)
);
alter table public.shared_records enable row level security;

-- Regularite : une ligne par personne.
create table public.shared_regularity (
  owner_id uuid primary key default auth.uid() references public.profiles (id) on delete cascade,
  streak_days integer not null check (streak_days between 0 and 3650),
  sessions_7d integer not null check (sessions_7d between 0 and 30),
  sessions_28d integer not null check (sessions_28d between 0 and 120),
  updated_at timestamptz not null default now()
);
alter table public.shared_regularity enable row level security;

-- Reactions : choix dans une liste fermee, jamais de texte libre.
create table public.reactions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.shared_sessions (id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('bravo', 'force', 'feu')),
  created_at timestamptz not null default now(),
  unique (session_id, user_id)
);
alter table public.reactions enable row level security;

-- ---------------------------------------------------------------------------
-- 2. Fonctions (search_path vide partout ; security definer seulement quand indispensable)
-- ---------------------------------------------------------------------------

-- Date de modification imposee par le serveur (security invoker).
create function public.touch_updated_at() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();
create trigger shares_touch before update on public.shares
  for each row execute function public.touch_updated_at();
create trigger shared_records_touch before update on public.shared_records
  for each row execute function public.touch_updated_at();
create trigger shared_regularity_touch before update on public.shared_regularity
  for each row execute function public.touch_updated_at();

-- SECURITY DEFINER 1/6 : creation du profil. Seul moyen d'en creer un : profil + consentement 'majeur' dans la meme
-- transaction (aucun droit d'insertion direct sur profiles). Le client ne fixe pas l'heure.
create function public.create_profile(p_pseudo text, p_terms_version text) returns void
language plpgsql security definer set search_path = '' as $$
declare v_me uuid := auth.uid();
begin
  if v_me is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  insert into public.profiles (id, pseudo, adult_confirmed_at) values (v_me, p_pseudo, now());
  insert into public.consents (user_id, kind, version) values (v_me, 'majeur', p_terms_version);
end $$;

-- SECURITY DEFINER 6/6 : amitie retiree -> les reglages de partage propres a cet ami disparaissent (dans les deux sens),
-- pour qu'ils ne se reactivent pas en silence si l'amitie est recreee. Definer : il doit effacer aussi les lignes de l'autre.
create function public.drop_pair_shares() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  delete from public.shares
    where (owner_id = old.user_low and friend_id = old.user_high)
       or (owner_id = old.user_high and friend_id = old.user_low);
  return old;
end $$;
create trigger friendships_drop_shares after delete on public.friendships
  for each row execute function public.drop_pair_shares();

-- SECURITY DEFINER 2/6 : l'appelant (auth.uid()) peut-il voir ce type de donnee de ce proprietaire ?
-- Vrai seulement si : amitie acceptee ET partage active pour ce type (general ou pour lui) ET pas de refus propre a lui.
-- Definer car un ami ne doit pas pouvoir lire la table shares ; ne renvoie qu'un booleen.
create function public.friend_can_view(p_owner uuid, p_kind text) returns boolean
language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null
    and p_owner <> auth.uid()
    and exists (
      select 1 from public.friendships f
      where f.user_low = least(p_owner, auth.uid()) and f.user_high = greatest(p_owner, auth.uid()))
    and exists (
      select 1 from public.shares s
      where s.owner_id = p_owner and s.data_type = p_kind and s.enabled
        and (s.friend_id is null or s.friend_id = auth.uid()))
    and not exists (
      select 1 from public.shares s
      where s.owner_id = p_owner and s.data_type = p_kind and s.friend_id = auth.uid() and not s.enabled);
$$;

-- SECURITY DEFINER 3/6 : utiliser un code d'invitation -> demande d'ami en attente.
-- Message d'erreur unique pour code inconnu / expire / deja utilise / deja ami (pas de fuite d'information).
create function public.redeem_invite(p_code text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_me uuid := auth.uid();
  v_inv public.invite_codes%rowtype;
  v_req uuid;
begin
  if v_me is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if not exists (select 1 from public.profiles where id = v_me) then
    raise exception 'profile_required' using errcode = '42501';
  end if;
  if p_code is null or p_code !~ '^[A-F0-9]{12}$' then
    raise exception 'invalid_code' using errcode = '22023';
  end if;
  if (select count(*) from public.friend_requests
      where requester_id = v_me and created_at > now() - interval '1 hour') >= 10 then
    raise exception 'too_many_requests' using errcode = '54000';
  end if;

  select * into v_inv from public.invite_codes
    where code = p_code and used_at is null and expires_at > now()
    for update;
  if not found or v_inv.owner_id = v_me
     or exists (select 1 from public.friendships f
                where f.user_low = least(v_inv.owner_id, v_me) and f.user_high = greatest(v_inv.owner_id, v_me))
     or exists (select 1 from public.friend_requests r
                where (r.requester_id = v_me and r.addressee_id = v_inv.owner_id)
                   or (r.requester_id = v_inv.owner_id and r.addressee_id = v_me)) then
    raise exception 'invalid_code' using errcode = '22023';
  end if;
  -- Plafonds : 30 amis, 10 demandes envoyees en attente, 20 demandes recues en attente.
  if (select count(*) from public.friendships where v_me in (user_low, user_high)) >= 30
     or (select count(*) from public.friendships where v_inv.owner_id in (user_low, user_high)) >= 30
     or (select count(*) from public.friend_requests where requester_id = v_me) >= 10
     or (select count(*) from public.friend_requests where addressee_id = v_inv.owner_id) >= 20 then
    raise exception 'limit_reached' using errcode = '54000';
  end if;

  insert into public.friend_requests (requester_id, addressee_id)
    values (v_me, v_inv.owner_id) returning id into v_req;
  update public.invite_codes set used_at = now() where id = v_inv.id;
  return v_req;
end $$;

-- SECURITY DEFINER 4/6 : accepter une demande RECUE (seul le destinataire peut accepter).
create function public.accept_friend_request(p_request_id uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_me uuid := auth.uid();
  v_req public.friend_requests%rowtype;
begin
  if v_me is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  select * into v_req from public.friend_requests
    where id = p_request_id and addressee_id = v_me for update;
  if not found then
    raise exception 'request_not_found' using errcode = 'P0002';
  end if;
  if (select count(*) from public.friendships where v_me in (user_low, user_high)) >= 30
     or (select count(*) from public.friendships where v_req.requester_id in (user_low, user_high)) >= 30 then
    raise exception 'limit_reached' using errcode = '54000';
  end if;
  insert into public.friendships (user_low, user_high)
    values (least(v_req.requester_id, v_me), greatest(v_req.requester_id, v_me));
  delete from public.friend_requests where id = v_req.id;
end $$;

-- SECURITY DEFINER 5/6 : suppression du compte. Le client n'a aucun acces a auth.users ;
-- cette fonction supprime la ligne de SON propre compte, la cascade efface tout le reste.
create function public.delete_my_account() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  delete from auth.users where id = auth.uid();
end $$;

-- Execution : jamais anon, jamais public ; seulement les comptes connectes.
revoke all on function public.touch_updated_at() from public, anon, authenticated;
revoke all on function public.drop_pair_shares() from public, anon, authenticated;
revoke all on function public.create_profile(text, text) from public, anon;
grant execute on function public.create_profile(text, text) to authenticated;
revoke all on function public.friend_can_view(uuid, text) from public, anon;
revoke all on function public.redeem_invite(text) from public, anon;
revoke all on function public.accept_friend_request(uuid) from public, anon;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.friend_can_view(uuid, text) to authenticated;
grant execute on function public.redeem_invite(text) to authenticated;
grant execute on function public.accept_friend_request(uuid) to authenticated;
grant execute on function public.delete_my_account() to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Droits sur les tables (colonnes comprises) : le strict minimum pour authenticated
-- ---------------------------------------------------------------------------
revoke all on all tables in schema public from public, anon, authenticated;

grant select, delete on public.profiles to authenticated;   -- pas d'insert : create_profile seulement
grant update (pseudo) on public.profiles to authenticated;

grant select on public.consents to authenticated;            -- pas de delete : la preuve de majorite reste jusqu'a la suppression du compte
grant insert (kind, version) on public.consents to authenticated;

grant select, delete on public.invite_codes to authenticated;
grant insert (owner_id) on public.invite_codes to authenticated;

grant select, delete on public.friend_requests to authenticated;   -- pas d'insert ni d'update : fonctions seulement
grant select, delete on public.friendships to authenticated;       -- idem

grant select, delete on public.shares to authenticated;
grant insert (owner_id, friend_id, data_type, enabled) on public.shares to authenticated;
grant update (enabled) on public.shares to authenticated;

grant select, delete on public.shared_sessions to authenticated;   -- pas d'update : une seance terminee ne change pas
grant insert (owner_id, local_id, session_date, label, duration_min, exercise_count, set_count)
  on public.shared_sessions to authenticated;

grant select, delete on public.shared_records to authenticated;
grant insert (owner_id, exercise_id, kind, value, achieved_on) on public.shared_records to authenticated;
grant update (value, achieved_on) on public.shared_records to authenticated;

grant select, delete on public.shared_regularity to authenticated;
grant insert (owner_id, streak_days, sessions_7d, sessions_28d) on public.shared_regularity to authenticated;
grant update (streak_days, sessions_7d, sessions_28d) on public.shared_regularity to authenticated;

grant select, delete on public.reactions to authenticated;         -- pas d'update : on retire puis on remet
grant insert (session_id, user_id, kind) on public.reactions to authenticated;

-- ---------------------------------------------------------------------------
-- 4. Policies (une par commande, toutes "to authenticated", toutes liees a (select auth.uid()))
-- ---------------------------------------------------------------------------

-- profiles : soi-meme, ou une personne avec qui on a une amitie ou une demande en attente (pour afficher le pseudo).
create policy profiles_select on public.profiles for select to authenticated
  using (
    id = (select auth.uid())
    or exists (select 1 from public.friendships f
               where (f.user_low = (select auth.uid()) and f.user_high = profiles.id)
                  or (f.user_high = (select auth.uid()) and f.user_low = profiles.id))
    or exists (select 1 from public.friend_requests r
               where (r.requester_id = (select auth.uid()) and r.addressee_id = profiles.id)
                  or (r.addressee_id = (select auth.uid()) and r.requester_id = profiles.id))
  );
-- profiles : pas de policy insert (create_profile seulement).
create policy profiles_update on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy profiles_delete on public.profiles for delete to authenticated
  using (id = (select auth.uid()));

-- consents : strictement personnels. Pas d'update ni de delete (on ajoute une nouvelle version).
create policy consents_select on public.consents for select to authenticated
  using (user_id = (select auth.uid()));
create policy consents_insert on public.consents for insert to authenticated
  with check (user_id = (select auth.uid()) and kind <> 'majeur' -- 'majeur' vient de create_profile seulement
              and (select count(*) from public.consents c where c.user_id = (select auth.uid())) < 50);
-- consents : pas de policy delete (voir plus haut).

-- invite_codes : personnels. Max 20 codes ; l'utilisation passe par redeem_invite. Pas d'update.
create policy invite_codes_select on public.invite_codes for select to authenticated
  using (owner_id = (select auth.uid()));
create policy invite_codes_insert on public.invite_codes for insert to authenticated
  with check (owner_id = (select auth.uid())
              and (select count(*) from public.invite_codes c where c.owner_id = (select auth.uid())) < 20);
create policy invite_codes_delete on public.invite_codes for delete to authenticated
  using (owner_id = (select auth.uid()));

-- friend_requests : visibles par les deux parties. Pas d'insert (redeem_invite), pas d'update (accept_friend_request).
-- Refuser ou annuler = supprimer la demande.
create policy friend_requests_select on public.friend_requests for select to authenticated
  using (requester_id = (select auth.uid()) or addressee_id = (select auth.uid()));
create policy friend_requests_delete on public.friend_requests for delete to authenticated
  using (requester_id = (select auth.uid()) or addressee_id = (select auth.uid()));

-- friendships : visibles par les deux. Pas d'insert ni d'update. Retirer un ami = supprimer la ligne (l'un ou l'autre).
create policy friendships_select on public.friendships for select to authenticated
  using (user_low = (select auth.uid()) or user_high = (select auth.uid()));
create policy friendships_delete on public.friendships for delete to authenticated
  using (user_low = (select auth.uid()) or user_high = (select auth.uid()));

-- shares : le proprietaire seulement. Un ami ne lit jamais cette table (il passe par friend_can_view).
-- Un reglage "pour un ami" n'est possible que pour un ami reel.
create policy shares_select on public.shares for select to authenticated
  using (owner_id = (select auth.uid()));
create policy shares_insert on public.shares for insert to authenticated
  with check (
    owner_id = (select auth.uid())
    and (friend_id is null
         or exists (select 1 from public.friendships f
                    where f.user_low = least((select auth.uid()), friend_id) and f.user_high = greatest((select auth.uid()), friend_id)))
    and (select count(*) from public.shares s where s.owner_id = (select auth.uid())) < 200
  );
create policy shares_update on public.shares for update to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy shares_delete on public.shares for delete to authenticated
  using (owner_id = (select auth.uid()));

-- shared_sessions : proprietaire, ou ami autorise pour 'seances'. Ecriture : proprietaire seulement.
create policy shared_sessions_select on public.shared_sessions for select to authenticated
  using (owner_id = (select auth.uid()) or public.friend_can_view(owner_id, 'seances'));
create policy shared_sessions_insert on public.shared_sessions for insert to authenticated
  with check (owner_id = (select auth.uid())
              and (select count(*) from public.shared_sessions s where s.owner_id = (select auth.uid())) < 3000);
create policy shared_sessions_delete on public.shared_sessions for delete to authenticated
  using (owner_id = (select auth.uid()));

-- shared_records
create policy shared_records_select on public.shared_records for select to authenticated
  using (owner_id = (select auth.uid()) or public.friend_can_view(owner_id, 'records'));
create policy shared_records_insert on public.shared_records for insert to authenticated
  with check (owner_id = (select auth.uid())
              and (select count(*) from public.shared_records r where r.owner_id = (select auth.uid())) < 1000);
create policy shared_records_update on public.shared_records for update to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy shared_records_delete on public.shared_records for delete to authenticated
  using (owner_id = (select auth.uid()));

-- shared_regularity
create policy shared_regularity_select on public.shared_regularity for select to authenticated
  using (owner_id = (select auth.uid()) or public.friend_can_view(owner_id, 'regularite'));
create policy shared_regularity_insert on public.shared_regularity for insert to authenticated
  with check (owner_id = (select auth.uid()));
create policy shared_regularity_update on public.shared_regularity for update to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy shared_regularity_delete on public.shared_regularity for delete to authenticated
  using (owner_id = (select auth.uid()));

-- reactions : on reagit seulement a une seance qu'on a le droit de voir (la sous-requete subit la RLS de shared_sessions).
-- Visibles par l'auteur de la reaction et par le proprietaire de la seance, pas par les autres amis.
create policy reactions_select on public.reactions for select to authenticated
  using (user_id = (select auth.uid())
         or exists (select 1 from public.shared_sessions s
                    where s.id = reactions.session_id and s.owner_id = (select auth.uid())));
create policy reactions_insert on public.reactions for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.shared_sessions s where s.id = session_id)
    and (select count(*) from public.reactions x where x.user_id = (select auth.uid())) < 5000
  );
create policy reactions_delete on public.reactions for delete to authenticated
  using (user_id = (select auth.uid()));

-- Index utiles aux policies et aux cascades.
create index friendships_high_idx on public.friendships (user_high);
create index friend_requests_addressee_idx on public.friend_requests (addressee_id);
create index shares_owner_idx on public.shares (owner_id);
create index shared_sessions_owner_date_idx on public.shared_sessions (owner_id, session_date desc);
create index reactions_session_idx on public.reactions (session_id);
create index reactions_user_idx on public.reactions (user_id);
