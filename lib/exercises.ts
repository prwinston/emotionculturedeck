export type Exercise = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  energyLevel: "low" | "medium" | "high";
};

export const EXERCISES: Exercise[] = [
  { id: "weather-report", title: "Weather Report Check-In", description: "Each person describes their current emotional state as weather. No follow-up questions — just witnessed.", durationMinutes: 5, energyLevel: "low" },
  { id: "positive-card-pick", title: "Positive Card Pick", description: "Each participant selects 3 cards representing how they want to feel. Share one word aloud.", durationMinutes: 10, energyLevel: "medium" },
  { id: "negative-card-pick", title: "Negative Card Pick", description: "Select 3 cards representing how you currently feel. No judgement, no fixing.", durationMinutes: 10, energyLevel: "medium" },
  { id: "story-behind-card", title: "Story Behind the Card", description: "Pairs share the story behind their most resonant card. Listener reflects back without fixing.", durationMinutes: 15, energyLevel: "medium" },
  { id: "behaviour-brainstorm", title: "Behaviour Brainstorm", description: "Full group: what one behaviour change would shift the culture toward the desired emotions?", durationMinutes: 15, energyLevel: "high" },
  { id: "commitment-roundup", title: "Commitment Roundup", description: "Each person states one micro-commitment. Facilitator captures it in the canvas.", durationMinutes: 5, energyLevel: "low" },
  { id: "desired-emotion-mapping", title: "Desired Emotion Mapping", description: "Table groups pick their top 3 desired emotions for the period ahead. Dot-vote across tables to surface the top 3 overall.", durationMinutes: 25, energyLevel: "high" },
  { id: "behaviour-design-sprint", title: "Behaviour Design Sprint", description: "For each desired emotion, name two behaviours the team will start, stop, or continue.", durationMinutes: 30, energyLevel: "high" },
  { id: "okr-alignment", title: "OKR Alignment & Close", description: "Map emotions and behaviours to existing OKRs. Agree a review cadence before closing.", durationMinutes: 25, energyLevel: "medium" },
  { id: "one-word-checkout", title: "One-Word Check-Out", description: "Go around the room — one word for how everyone feels leaving the session.", durationMinutes: 3, energyLevel: "low" },
  { id: "energy-map", title: "Team Energy Map", description: "Plot the team's current energy on a 2x2 grid (energised/drained x connected/isolated). Discuss patterns.", durationMinutes: 15, energyLevel: "medium" },
  { id: "failure-story", title: "Failure-to-Learning Story", description: "One volunteer shares a recent failure and what it taught them. Normalises vulnerability as a leadership behaviour.", durationMinutes: 10, energyLevel: "medium" },
  { id: "silent-brainwrite", title: "Silent Brainwrite", description: "Everyone writes ideas silently for 5 minutes before sharing — surfaces quieter voices before the loudest ones anchor the room.", durationMinutes: 10, energyLevel: "low" },
  { id: "two-truths-a-feeling", title: "Two Truths and a Feeling", description: "Icebreaker variant: two work facts and one honest current feeling. Guess which is the feeling.", durationMinutes: 10, energyLevel: "high" },
  { id: "gratitude-round", title: "Gratitude Round", description: "Each person names one teammate and one specific thing they're grateful for this month.", durationMinutes: 8, energyLevel: "low" },
];

export const ENERGY_LABELS: Record<Exercise["energyLevel"], string> = {
  low: "Low energy",
  medium: "Medium energy",
  high: "High energy",
};
