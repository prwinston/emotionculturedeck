# Data Model

## sessions
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| user_id | uuid nullable | owner (scoped at lock-down) |
| created_at | timestamptz | default now() |
| title | text | required |
| facilitator_name | text | display name gate |
| persona | text | Facilitator / Leader / HR / Individual |
| format | text | remote / in-person / hybrid / async |
| duration_minutes | integer | |
| audience_size | integer | |
| objectives | text | |
| status | text | draft / active / complete |

## session_blocks
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| session_id | uuid FK → sessions | cascade delete |
| block_type | text | welcome / exercise / breakout / brainstorm / close / question |
| title | text | |
| duration_minutes | integer | |
| content | text | AI or manual |
| position | integer | sort order |
| content_source | text | **AI field** |
| content_confidence | numeric | **AI field** |
| content_review_status | text | unreviewed / approved / edited |

## emotions
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| session_id | uuid FK → sessions | |
| label | text | e.g. Energised, Overwhelmed |
| category | text | Positive / Negative / Wildcard |
| valence | text | desired / undesired |
| frequency | integer | count of participants who picked it |
| label_source | text | **AI field** |
| label_confidence | numeric | **AI field** |
| label_review_status | text | unreviewed / approved |

## debrief_entries
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| session_id | uuid FK → sessions | |
| emotion_label | text | |
| behavioural_commitment | text | |
| key_quote | text | |
| experiment | text | |
| summary | text | AI-drafted synthesis |
| summary_source | text | **AI field** |
| summary_confidence | numeric | **AI field** |
| summary_review_status | text | unreviewed / approved |

## activities & audit_logs
Standard: id, user_id, created_at, action, entity_type, entity_id, meta/before_state/after_state, ip_address.

## RLS
All tables: permissive v1 policies (select/all = true). Lock-down sprint replaces with `auth.uid() = user_id`.