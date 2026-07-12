# Tasks & Sprints

## Sprint 1 — DB, Seed Data & Session CRUD
**Goal:** App renders with real data; sessions can be created, edited, deleted.
- [ ] Apply migration SQL to Supabase (sessions, session_blocks, emotions, debrief_entries, activities, audit_logs)
- [ ] Seed 4 demo sessions with blocks, emotions, and debrief entries
- [ ] `/sessions` list page: loading skeleton, empty state CTA, error banner, ready list
- [ ] `/sessions/[id]` detail page: agenda block list, emotion heat map table
- [ ] Create session form: title, facilitator name, persona, format, duration, audience size, objectives
- [ ] Edit and delete session (with confirmation modal)
- [ ] All mutations write to DB; page reflects change without manual refresh
- [ ] No login required to view or create

**Definition of Done:** Anonymous visitor can open `/sessions`, see 4 demo sessions, create a new session, and see it appear in the list — all persisted in Supabase.

---

## Sprint 2 — Core Engine: AI Agenda & Question Generation ✦ v1 functional milestone
**Goal:** The primary product action works end-to-end.
- [ ] `POST /api/generate-agenda` — calls Claude, returns structured JSON, writes blocks to DB
- [ ] `POST /api/generate-questions` — returns 5 situational ECD questions as session blocks
- [ ] Agenda editor: accept, edit, or regenerate each block; sets review_status
- [ ] Emotion heat map: add/remove emotions per session; heat map sorted by frequency
- [ ] AI fields (source, confidence, review_status) visible in block detail
- [ ] Core CRUD works if Claude call fails (graceful error, manual entry still possible)
- [ ] Audit log entry written for every AI call

**Definition of Done:** Facilitator creates a 60-min remote session, generates an AI agenda, edits one block, adds 3 emotions, and sees the heat map — all in DB.

---

## Sprint 3 — Debrief Capture & Behaviour Shift Canvas
**Goal:** Post-session value captured and exportable.
- [ ] Debrief entry form: emotion label, behavioural commitment, key quote, experiment
- [ ] AI drafts debrief summary on save; displayed with edit option
- [ ] Behaviour Shift Canvas view: table of emotion → behaviour → experiment rows
- [ ] Email recap generator: copy-ready plain text from session + debrief data
- [ ] Empty state when no debrief entries yet

**Definition of Done:** Facilitator saves a debrief entry, views AI summary, opens the canvas, and copies the email recap.

---

## Sprint 4 — Lock It Down (Auth & Per-User Isolation)
**Goal:** Personal data is private; only the owner can write their sessions.
- [ ] Supabase Auth: email/password sign-up and login pages
- [ ] Facilitator name prompt on first session creation (ties to auth user)
- [ ] Replace v1 permissive RLS with `auth.uid() = user_id` owner policies
- [ ] Demo seed rows attributed to a `demo@emotionculturedeck.app` system user (still public-readable)
- [ ] Unauthenticated users see demo sessions (read); write actions redirect to login
- [ ] Audit logs capture `user_id` on all write events

**Definition of Done:** Two separate accounts cannot see each other's sessions. Demo rows remain visible to all.

---

## Sprint 5 — Measurement & Polish
**Goal:** Sustained value and production-ready UX.
- [ ] Pulse survey / KPI builder: add survey items linked to a session
- [ ] Follow-up nudge flag: mark sessions as needing a check-in (date + note)
- [ ] Pick-n-Play exercise library page: 15 activities tagged by duration and energy level
- [ ] Toast notifications for all form outcomes (success / error)
- [ ] Accessibility: keyboard navigation, ARIA labels, colour contrast AA
- [ ] Final QA pass against TEST_PLAN.md

**Definition of Done:** All test plan scenarios pass; no console errors in production build.

---

## Gantt (Sprint → Feature)
```
Sprint 1  |  DB schema · seed data · session CRUD · list & detail pages
Sprint 2  |  AI agenda generation · question alchemist · emotion heat map  ← v1 functional
Sprint 3  |  Debrief capture · behaviour canvas · email recap
Sprint 4  |  Auth · RLS lock-down · per-user isolation
Sprint 5  |  Measurement menu · exercise library · polish · accessibility
```