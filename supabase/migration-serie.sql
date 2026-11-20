-- Migration : les scores deviennent des séries (plus de "sur 10" ni de "sur 18").
-- À coller dans Supabase, menu SQL Editor, puis Run. Tes règles de sécurité sont conservées.

drop view if exists public.best_scores;

-- Les anciens scores étaient sur 10 ou 18 : ils ne sont plus comparables à des séries.
-- Décommente la ligne suivante pour les effacer (tu n'as probablement que des essais).
-- delete from public.scores;

alter table public.scores drop constraint if exists score_valide;
alter table public.scores drop constraint if exists total_valide;
alter table public.scores drop column if exists n;
alter table public.scores add constraint score_valide check (score >= 1 and score <= 500);

create view public.best_scores with (security_invoker = true) as
select distinct on (board, lower(name)) board, name, score, created_at
from public.scores
order by board, lower(name), score desc, created_at asc;

grant select on public.best_scores to anon, authenticated;
