# Agentic Layer

## Risk Levels & Actions

### Low Risk — Auto (no approval needed)
| Action | Trigger | Tool |
|---|---|---|
| Generate agenda blocks | User clicks Generate Agenda | `claude_message` |
| Generate 5 ECD questions | User clicks Question Alchemist | `claude_message` |
| Draft debrief summary | Debrief entry saved | `claude_message` |

All outputs stored with `review_status = 'unreviewed'`; facilitator can edit or approve.

### Medium Risk — Light Approval
| Action | Trigger | Approval |
|---|---|---|
| Generate email recap | User requests stakeholder summary | User reviews draft before copy |

### High Risk — Always Approval
| Action | Notes |
|---|---|
| Send email recap externally | Future feature; human confirms recipient + content |

### Human-Only (Never Automated)
- Delete a session and all its data
- Export bulk session data

## Named Tools
- `claude_message` — structured JSON agenda and question generation
- `supabase_db_write` — all DB mutations via server actions

## Audit Log Fields
`action`, `entity_type`, `entity_id`, `user_id`, `before_state` (jsonb), `after_state` (jsonb), `created_at`, `ip_address`

## v1 vs Later
**v1:** Auto agenda, questions, debrief summary.
**Later:** Slack nudge scheduling, Miro board creation, OKR draft push.