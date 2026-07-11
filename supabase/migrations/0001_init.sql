create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  title text not null,
  facilitator_name text,
  persona text,
  format text,
  duration_minutes integer,
  audience_size integer,
  objectives text,
  status text default 'draft'
);

alter table sessions enable row level security;
drop policy if exists "sessions_v1_read" on sessions;
create policy "sessions_v1_read" on sessions for select using (true);
drop policy if exists "sessions_v1_write" on sessions;
create policy "sessions_v1_write" on sessions for all using (true) with check (true);

create table if not exists session_blocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  session_id uuid references sessions(id) on delete cascade,
  block_type text,
  title text,
  duration_minutes integer,
  content text,
  position integer,
  content_source text,
  content_confidence numeric,
  content_review_status text default 'unreviewed'
);

alter table session_blocks enable row level security;
drop policy if exists "session_blocks_v1_read" on session_blocks;
create policy "session_blocks_v1_read" on session_blocks for select using (true);
drop policy if exists "session_blocks_v1_write" on session_blocks;
create policy "session_blocks_v1_write" on session_blocks for all using (true) with check (true);

create table if not exists emotions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  session_id uuid references sessions(id) on delete cascade,
  label text not null,
  category text,
  valence text,
  frequency integer default 1,
  label_source text,
  label_confidence numeric,
  label_review_status text default 'unreviewed'
);

alter table emotions enable row level security;
drop policy if exists "emotions_v1_read" on emotions;
create policy "emotions_v1_read" on emotions for select using (true);
drop policy if exists "emotions_v1_write" on emotions;
create policy "emotions_v1_write" on emotions for all using (true) with check (true);

create table if not exists debrief_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  session_id uuid references sessions(id) on delete cascade,
  emotion_label text,
  behavioural_commitment text,
  key_quote text,
  experiment text,
  summary text,
  summary_source text,
  summary_confidence numeric,
  summary_review_status text default 'unreviewed'
);

alter table debrief_entries enable row level security;
drop policy if exists "debrief_entries_v1_read" on debrief_entries;
create policy "debrief_entries_v1_read" on debrief_entries for select using (true);
drop policy if exists "debrief_entries_v1_write" on debrief_entries;
create policy "debrief_entries_v1_write" on debrief_entries for all using (true) with check (true);

create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  session_id uuid references sessions(id) on delete cascade,
  action text not null,
  entity_type text,
  entity_id uuid,
  meta jsonb
);

alter table activities enable row level security;
drop policy if exists "activities_v1_read" on activities;
create policy "activities_v1_read" on activities for select using (true);
drop policy if exists "activities_v1_write" on activities;
create policy "activities_v1_write" on activities for all using (true) with check (true);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  action text not null,
  entity_type text,
  entity_id uuid,
  before_state jsonb,
  after_state jsonb,
  ip_address text
);

alter table audit_logs enable row level security;
drop policy if exists "audit_logs_v1_read" on audit_logs;
create policy "audit_logs_v1_read" on audit_logs for select using (true);
drop policy if exists "audit_logs_v1_write" on audit_logs;
create policy "audit_logs_v1_write" on audit_logs for all using (true) with check (true);

insert into sessions (id, title, facilitator_name, persona, format, duration_minutes, audience_size, objectives, status) values
  ('a1000000-0000-0000-0000-000000000001', 'Engineering Team Burnout Reset', 'Sam Rivera', 'Facilitator', 'remote', 60, 8, 'Surface burnout signals, agree one team ritual to restore energy', 'complete'),
  ('a1000000-0000-0000-0000-000000000002', 'Leadership Offsite Culture Deep-Dive', 'Jordan Lee', 'Team Leader', 'in-person', 90, 12, 'Define 3 desired emotions for the next quarter and map behaviours', 'complete'),
  ('a1000000-0000-0000-0000-000000000003', 'New Hire Onboarding Pulse Check', 'Alex Kim', 'HR/OD Pro', 'hybrid', 30, 5, 'Help new hires name how they feel and what they need to thrive', 'draft'),
  ('a1000000-0000-0000-0000-000000000004', 'Solo Reflection — Quarterly Review', 'Morgan Chen', 'Individual', 'async', 15, 1, 'Personal emotion audit before performance conversation', 'draft');

insert into session_blocks (session_id, block_type, title, duration_minutes, content, position, content_source, content_confidence, content_review_status) values
  ('a1000000-0000-0000-0000-000000000001', 'welcome', 'Welcome & Why Emotions Matter', 5, 'Facilitator shares one sentence on why feelings are strategic. No pressure to share yet.', 1, 'ai', 0.92, 'approved'),
  ('a1000000-0000-0000-0000-000000000001', 'exercise', 'Positive Card Pick', 10, 'Each participant selects 3 cards representing how they want to feel. Share one word aloud.', 2, 'ai', 0.90, 'approved'),
  ('a1000000-0000-0000-0000-000000000001', 'exercise', 'Negative Card Pick', 10, 'Select 3 cards representing how you currently feel. No judgement.', 3, 'ai', 0.88, 'approved'),
  ('a1000000-0000-0000-0000-000000000001', 'breakout', 'Story Behind the Card', 15, 'Pairs: share the story behind your most resonant card. Listener reflects back without fixing.', 4, 'ai', 0.91, 'approved'),
  ('a1000000-0000-0000-0000-000000000001', 'brainstorm', 'Behaviour Brainstorm', 15, 'Full group: what one behaviour change would shift the culture toward the desired emotions?', 5, 'ai', 0.87, 'approved'),
  ('a1000000-0000-0000-0000-000000000001', 'close', 'Commitment Roundup', 5, 'Each person states one micro-commitment. Facilitator captures in canvas.', 6, 'ai', 0.93, 'approved'),
  ('a1000000-0000-0000-0000-000000000002', 'welcome', 'Check-In & Grounding', 10, 'Weather report ice breaker: describe your current emotional state as weather.', 1, 'ai', 0.89, 'approved'),
  ('a1000000-0000-0000-0000-000000000002', 'exercise', 'Desired Emotion Mapping', 25, 'Table groups pick top 3 desired emotions for Q3. Dot-vote to surface top 3 across tables.', 2, 'ai', 0.88, 'approved'),
  ('a1000000-0000-0000-0000-000000000002', 'exercise', 'Behaviour Design Sprint', 30, 'For each desired emotion, name 2 behaviours the team will start, stop, or continue.', 3, 'ai', 0.86, 'approved'),
  ('a1000000-0000-0000-0000-000000000002', 'close', 'OKR Alignment & Close', 25, 'Map emotions and behaviours to existing OKRs. Agree review cadence.', 4, 'ai', 0.84, 'approved');

insert into emotions (session_id, label, category, valence, frequency, label_source, label_confidence, label_review_status) values
  ('a1000000-0000-0000-0000-000000000001', 'Energised', 'Positive', 'desired', 6, 'participant', 1.0, 'approved'),
  ('a1000000-0000-0000-0000-000000000001', 'Safe', 'Positive', 'desired', 5, 'participant', 1.0, 'approved'),
  ('a1000000-0000-0000-0000-000000000001', 'Overwhelmed', 'Negative', 'undesired', 7, 'participant', 1.0, 'approved'),
  ('a1000000-0000-0000-0000-000000000001', 'Disconnected', 'Negative', 'undesired', 4, 'participant', 1.0, 'approved'),
  ('a1000000-0000-0000-0000-000000000002', 'Inspired', 'Positive', 'desired', 9, 'participant', 1.0, 'approved'),
  ('a1000000-0000-0000-0000-000000000002', 'Trusted', 'Positive', 'desired', 8, 'participant', 1.0, 'approved'),
  ('a1000000-0000-0000-0000-000000000002', 'Anxious', 'Negative', 'undesired', 6, 'participant', 1.0, 'approved');

insert into debrief_entries (session_id, emotion_label, behavioural_commitment, key_quote, experiment, summary, summary_source, summary_confidence, summary_review_status) values
  ('a1000000-0000-0000-0000-000000000001', 'Overwhelmed', 'No-meeting Fridays for deep work', '"I didn''t realise others felt the same until today."', 'Trial no-meeting Fridays for 4 weeks, then pulse check', 'Team surfaced chronic overload. Agreed to protect focus time and check in weekly on energy levels.', 'ai', 0.91, 'approved'),
  ('a1000000-0000-0000-0000-000000000002', 'Inspired', 'Share one learning from a failure per month', '"Psychological safety isn''t a perk — it''s the foundation."', 'Monthly failure-to-learning story in all-hands', 'Leadership committed to normalising vulnerability as a leadership behaviour linked to the Inspired emotion.', 'ai', 0.89, 'approved');