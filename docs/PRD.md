# PRD — Emotion Culture Deck Facilitator App

## Problem
Facilitators, HR professionals, and team leaders run Emotional Culture Deck (ECD) sessions but have no structured tool to design agendas, generate questions, capture debrief insights, or produce stakeholder outputs. They rely on sticky notes, ad-hoc docs, and memory.

## Target Users
| Persona | Primary Need |
|---|---|
| Facilitator | Fast, tailored workshop agenda + facilitation cues |
| Team Leader | Quick pulse-check format and debrief capture |
| HR/OD Pro | Reusable session library + stakeholder recaps |
| Individual | Solo reflection guide |

## Core Objects
- **Session** — the unit of work (format, duration, audience, objectives)
- **Session Block** — agenda items with timing and AI-generated content
- **Emotion** — desired/undesired emotion entries per session
- **Debrief Entry** — commitments, quotes, and experiments from a session
- **Activity / Audit Log** — every write action recorded

## MVP Must-Haves (v1)
- [ ] Create, edit, delete a session with key metadata
- [ ] AI generates a structured agenda (blocks) from session context
- [ ] Facilitator can accept, edit, or regenerate each agenda block
- [ ] Question Alchemist: generate 5 situational ECD questions per session
- [ ] Emotion heat map: top desired / undesired emotions displayed
- [ ] Debrief entry form: record commitments, quotes, experiments
- [ ] Session list with loading, empty, error, and ready states
- [ ] All actions persist to DB; UI reflects state without page reload
- [ ] Demo visible without login

## Non-Goals (v1)
- Multi-user team workspaces
- Participant-facing links / async mode
- Slack/Miro integrations
- Billing or subscription management

## Success Criteria
A facilitator opens the app, creates a 60-min remote session for 8 engineers, generates an AI agenda, edits one block, captures a debrief entry with a behavioural commitment, and sees the emotion heat map — all without creating an account.