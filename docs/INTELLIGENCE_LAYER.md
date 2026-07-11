# Intelligence Layer

## Messy Inputs
- Free-text objectives ("team feels burned out and disconnected")
- Vague duration ("about an hour")
- Mixed persona descriptions

## Auto-Structure Schema (Agenda Block JSON)
```json
{
  "blocks": [
    {
      "position": 1,
      "block_type": "welcome",
      "title": "Welcome & Why Emotions Matter",
      "duration_minutes": 5,
      "content": "Facilitator shares one sentence on why feelings are strategic."
    }
  ],
  "questions": [
    "What emotion would make the biggest difference to your week?"
  ]
}
```
Parsed server-side; each block written to `session_blocks` with source, confidence, review_status.

## Events to Track
- Session created
- Agenda generated (AI call made)
- Block edited after AI generation
- Debrief entry saved
- AI summary accepted vs edited

## Scoring Rules (Rule-Based v1)
- **Agenda quality score:** confidence average across approved blocks (0–1)
- **Emotion tension score:** ratio of undesired:desired emotions selected (>1.5 = high tension flag)
- **Debrief completeness:** % of debrief fields filled per session

## What Gets Ranked
- Emotions by frequency (heat map order)
- Sessions by last active date

## v1 vs Later
**v1:** AI agenda generation, question generation, debrief synthesis summary (all auto, low-risk, stored with review_status).
**Later:** Trend analysis across sessions, emotion pattern alerts, AI-suggested OKRs.