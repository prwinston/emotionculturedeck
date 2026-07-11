# Security

## Secret Handling
- `OPENAI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` stored in Vercel environment variables only
- Never referenced in client-side code or exposed via API responses
- All AI calls made from Next.js server-side API routes

## Permission Model
**v1 (demo):** Permissive RLS — all tables readable and writable without login. Enables demo-first experience.
**Lock-down sprint:** Replace with `auth.uid() = user_id` policies. No row readable or writable by another user. Supabase anon key used in client; service role key only in server actions.

## Approved Tools Rule
Agent may only call named tools: `openai_chat_completion`, `supabase_db_write`. No `eval`, no `run_any`, no raw shell access.

## Audit Principle
Every meaningful write (create, update, delete, AI call) appends one row to `audit_logs` with before/after state. Logs are append-only (no delete policy on audit_logs table at lock-down).

## Display Name Gate
Before any session interaction, the app prompts for a facilitator display name. Stored in `sessions.facilitator_name`. Users are reminded not to enter sensitive personal data in public fields until auth is enabled.

## No Mental Health Claims
AI-generated content must not include diagnostic language. System prompt enforces this explicitly.