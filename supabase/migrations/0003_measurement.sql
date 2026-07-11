-- Sprint 5: measurement & follow-up.

alter table sessions add column if not exists needs_followup boolean not null default false;
alter table sessions add column if not exists followup_date date;
alter table sessions add column if not exists followup_note text;

create table if not exists pulse_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  session_id uuid references sessions(id) on delete cascade,
  label text not null,
  target_value numeric,
  current_value numeric
);

alter table pulse_items enable row level security;
drop policy if exists "pulse_items_read" on pulse_items;
create policy "pulse_items_read" on pulse_items for select using (user_id is null or auth.uid() = user_id);
drop policy if exists "pulse_items_insert" on pulse_items;
create policy "pulse_items_insert" on pulse_items for insert with check (auth.uid() = user_id);
drop policy if exists "pulse_items_update" on pulse_items;
create policy "pulse_items_update" on pulse_items for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "pulse_items_delete" on pulse_items;
create policy "pulse_items_delete" on pulse_items for delete using (auth.uid() = user_id);
