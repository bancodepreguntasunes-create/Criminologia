-- MINDTRACE: esquema mínimo para progreso de juego.
-- Ejecutar en Supabase SQL Editor.
create table if not exists public.game_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scenario_id text not null,
  difficulty text not null check (difficulty in ('Difícil','Muy difícil','Avanzado','Experto')),
  score integer not null default 0 check (score >= 0 and score <= 100),
  decisions jsonb not null default '[]'::jsonb,
  final_hypothesis text,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists game_progress_user_created_idx
  on public.game_progress(user_id, created_at desc);

alter table public.game_progress enable row level security;

drop policy if exists "Users can read own progress" on public.game_progress;
create policy "Users can read own progress"
  on public.game_progress for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own progress" on public.game_progress;
create policy "Users can insert own progress"
  on public.game_progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own progress" on public.game_progress;
create policy "Users can update own progress"
  on public.game_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
