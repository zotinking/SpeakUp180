-- SpeakUp 180 Supabase schema
-- Applied to project hmnmedoxqhiyzwmvyhlt on 2026-05-29.
-- This MVP intentionally uses passwordless profile switching for two known profiles.
-- It is convenient for personal use, but not private authentication.

create table if not exists public.speakup_profiles (
  id text primary key,
  display_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint speakup_profiles_id_format check (id ~ '^[a-z0-9_]{3,32}$')
);

create table if not exists public.speakup_progress (
  profile_id text primary key references public.speakup_profiles(id) on delete cascade,
  current_day integer not null default 1 check (current_day between 1 and 180),
  completed_days integer[] not null default '{}',
  read_done jsonb not null default '{}'::jsonb,
  recall_done jsonb not null default '{}'::jsonb,
  checked_sentences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.speakup_curriculums (
  profile_id text primary key references public.speakup_profiles(id) on delete cascade,
  title text not null default 'SpeakUp 180 Custom Curriculum',
  days jsonb not null,
  updated_at timestamptz not null default now(),
  constraint speakup_curriculums_days_is_array check (jsonb_typeof(days) = 'array')
);

create or replace function public.set_speakup_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

insert into public.speakup_profiles (id, display_name)
values ('zotinking', 'zotinking'), ('viridiansky', 'viridiansky')
on conflict (id) do update set display_name = excluded.display_name;

insert into public.speakup_progress (profile_id)
values ('zotinking'), ('viridiansky')
on conflict (profile_id) do nothing;

alter table public.speakup_profiles enable row level security;
alter table public.speakup_progress enable row level security;
alter table public.speakup_curriculums enable row level security;

drop policy if exists "SpeakUp profiles are readable" on public.speakup_profiles;
create policy "SpeakUp profiles are readable"
on public.speakup_profiles for select
to anon
using (id in ('zotinking', 'viridiansky'));

drop policy if exists "SpeakUp progress can be read" on public.speakup_progress;
create policy "SpeakUp progress can be read"
on public.speakup_progress for select
to anon
using (profile_id in ('zotinking', 'viridiansky'));

drop policy if exists "SpeakUp progress can be inserted" on public.speakup_progress;
create policy "SpeakUp progress can be inserted"
on public.speakup_progress for insert
to anon
with check (profile_id in ('zotinking', 'viridiansky'));

drop policy if exists "SpeakUp progress can be updated" on public.speakup_progress;
create policy "SpeakUp progress can be updated"
on public.speakup_progress for update
to anon
using (profile_id in ('zotinking', 'viridiansky'))
with check (profile_id in ('zotinking', 'viridiansky'));

drop policy if exists "SpeakUp curriculums can be read" on public.speakup_curriculums;
create policy "SpeakUp curriculums can be read"
on public.speakup_curriculums for select
to anon
using (profile_id in ('zotinking', 'viridiansky'));

drop policy if exists "SpeakUp curriculums can be inserted" on public.speakup_curriculums;
create policy "SpeakUp curriculums can be inserted"
on public.speakup_curriculums for insert
to anon
with check (profile_id in ('zotinking', 'viridiansky'));

drop policy if exists "SpeakUp curriculums can be updated" on public.speakup_curriculums;
create policy "SpeakUp curriculums can be updated"
on public.speakup_curriculums for update
to anon
using (profile_id in ('zotinking', 'viridiansky'))
with check (profile_id in ('zotinking', 'viridiansky'));

grant select on public.speakup_profiles to anon;
grant select, insert, update on public.speakup_progress to anon;
grant select, insert, update on public.speakup_curriculums to anon;
