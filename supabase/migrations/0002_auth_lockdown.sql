-- Lock-down sprint: replace v1 permissive RLS with owner-scoped policies.
-- Rows with user_id IS NULL are the public demo seed data (from 0001) and
-- remain readable by everyone, but are no longer writable by anyone once
-- this migration lands — only auth.uid() = user_id rows are writable.

-- sessions
drop policy if exists "sessions_v1_read" on sessions;
drop policy if exists "sessions_v1_write" on sessions;
create policy "sessions_read" on sessions for select using (user_id is null or auth.uid() = user_id);
create policy "sessions_insert" on sessions for insert with check (auth.uid() = user_id);
create policy "sessions_update" on sessions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "sessions_delete" on sessions for delete using (auth.uid() = user_id);

-- session_blocks
drop policy if exists "session_blocks_v1_read" on session_blocks;
drop policy if exists "session_blocks_v1_write" on session_blocks;
create policy "session_blocks_read" on session_blocks for select using (user_id is null or auth.uid() = user_id);
create policy "session_blocks_insert" on session_blocks for insert with check (auth.uid() = user_id);
create policy "session_blocks_update" on session_blocks for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "session_blocks_delete" on session_blocks for delete using (auth.uid() = user_id);

-- emotions
drop policy if exists "emotions_v1_read" on emotions;
drop policy if exists "emotions_v1_write" on emotions;
create policy "emotions_read" on emotions for select using (user_id is null or auth.uid() = user_id);
create policy "emotions_insert" on emotions for insert with check (auth.uid() = user_id);
create policy "emotions_update" on emotions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "emotions_delete" on emotions for delete using (auth.uid() = user_id);

-- debrief_entries
drop policy if exists "debrief_entries_v1_read" on debrief_entries;
drop policy if exists "debrief_entries_v1_write" on debrief_entries;
create policy "debrief_entries_read" on debrief_entries for select using (user_id is null or auth.uid() = user_id);
create policy "debrief_entries_insert" on debrief_entries for insert with check (auth.uid() = user_id);
create policy "debrief_entries_update" on debrief_entries for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "debrief_entries_delete" on debrief_entries for delete using (auth.uid() = user_id);

-- activities
drop policy if exists "activities_v1_read" on activities;
drop policy if exists "activities_v1_write" on activities;
create policy "activities_read" on activities for select using (user_id is null or auth.uid() = user_id);
create policy "activities_insert" on activities for insert with check (auth.uid() = user_id);

-- audit_logs: append-only. No update/delete policy is created, so RLS
-- denies both by default even to authenticated users.
drop policy if exists "audit_logs_v1_read" on audit_logs;
drop policy if exists "audit_logs_v1_write" on audit_logs;
create policy "audit_logs_read" on audit_logs for select using (user_id is null or auth.uid() = user_id);
create policy "audit_logs_insert" on audit_logs for insert with check (auth.uid() = user_id);
