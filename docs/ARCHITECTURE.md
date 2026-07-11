# Architecture

## Stack
- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Backend/DB:** Supabase (Postgres + RLS + Edge Functions)
- **AI:** OpenAI GPT-4o via server-side API route (key never in client)
- **Hosting:** Vercel

## What Gets Built Now vs Later
**Now:** Session CRUD, AI agenda generation, question alchemist, debrief capture, emotion heat map, behaviour canvas.
**Later:** Auth/RLS lock-down, team workspaces, participant links, integrations.

## Key User Action — End-to-End Flow
1. Facilitator fills session form (format, duration, audience, objectives) → POST to `/api/sessions`
2. Server writes row to `sessions` table; returns session ID
3. Facilitator clicks **Generate Agenda** → POST to `/api/generate-agenda` with session context
4. Server calls OpenAI, parses structured JSON blocks, writes rows to `session_blocks` with `source=ai`, `confidence`, `review_status=unreviewed`
5. UI renders editable block cards; facilitator edits title/duration → PATCH updates block row; `review_status` set to `approved`
6. Debrief form submits → writes to `debrief_entries`; AI drafts summary → stored with `source=ai`
7. Emotion heat map reads from `emotions` table, aggregates by valence
8. All writes append to `audit_logs`

## Layer Plan
1. **Data** — tables, constraints, RLS policies, seed rows
2. **App logic** — CRUD routes, form validation, server actions
3. **Smart features** — AI agenda, question generation, synthesis summary (adds value; core works without them)

## Why Core Runs Without AI
Agenda blocks, debrief entries, and emotion records are plain DB rows. Facilitators can manually fill every field. AI accelerates; it does not gate.