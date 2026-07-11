# Test Plan

## v1 Success Scenario (Manual)
**Persona:** Facilitator, no account.

1. Open `/sessions` → confirm 4 demo sessions visible (not a login page)
2. Click **New Session** → fill title "Burnout Reset", format Remote, 60 min, 8 people, objective free text → Save
3. Confirm new session appears in list and row exists in `sessions` table (Supabase dashboard check)
4. Open the session → click **Generate Agenda** → wait ≤ 10 s → confirm ≥ 5 blocks appear with timing
5. Edit block 2 title → Save → confirm DB row updated, `review_status = 'edited'`
6. Add emotion "Overwhelmed" (undesired, frequency 7) → confirm heat map updates
7. Add emotion "Energised" (desired, frequency 6) → confirm it sorts to top of desired list
8. Open Debrief tab → fill commitment, quote, experiment → Save → confirm AI summary appears
9. Open Behaviour Canvas → confirm emotion → behaviour → experiment row visible
10. Copy Email Recap → confirm it contains session title, top emotions, and commitment

## Empty State Cases
- New session with no blocks: show "Generate Agenda" CTA, not a blank white area
- Session with no emotions: show "Add Emotions" prompt in heat map panel
- Session with no debrief: show "Capture Debrief" CTA

## Error Cases
- OpenAI call fails (simulate by using invalid key): confirm error toast, manual entry still works
- Submit session form with blank title: confirm inline validation error, no DB write
- Delete session → confirm modal → confirm session and all blocks removed from DB

## Regression Checks
- Refresh `/sessions/[id]` → data still present (not localStorage-dependent)
- Two browser tabs: save in tab 1 → refresh tab 2 → change visible
- No secrets visible in browser network tab or client JS bundle