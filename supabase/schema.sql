-- Classement Kaamelott : à coller dans Supabase, menu SQL Editor, puis Run.
-- Pour une base créée avec l'ancienne version (scores sur 10 ou 18), utilise plutôt migration-serie.sql.

create table if not exists public.scores (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  board text not null,
  name text not null,
  score int not null,
  constraint board_valide check (board ~ '^(qui|pendu|wordle)-(facile|moyen|difficile)$'),
  constraint nom_valide check (char_length(name) between 1 and 20),
  constraint score_valide check (score >= 1 and score <= 500)
);

-- Sécurité : le public peut lire et ajouter, jamais modifier ni supprimer.
alter table public.scores enable row level security;

drop policy if exists "lecture publique" on public.scores;
create policy "lecture publique" on public.scores
  for select to anon, authenticated using (true);

drop policy if exists "ajout public" on public.scores;
create policy "ajout public" on public.scores
  for insert to anon, authenticated with check (true);

-- Un seul score par nom et par classement : la meilleure série.
create or replace view public.best_scores with (security_invoker = true) as
select distinct on (board, lower(name)) board, name, score, created_at
from public.scores
order by board, lower(name), score desc, created_at asc;

grant select on public.best_scores to anon, authenticated;
