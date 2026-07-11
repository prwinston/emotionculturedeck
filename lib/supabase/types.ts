export type Session = {
  id: string;
  user_id: string | null;
  created_at: string;
  title: string;
  facilitator_name: string | null;
  persona: string | null;
  format: string | null;
  duration_minutes: number | null;
  audience_size: number | null;
  objectives: string | null;
  status: string | null;
  needs_followup: boolean;
  followup_date: string | null;
  followup_note: string | null;
};

export type SessionBlock = {
  id: string;
  user_id: string | null;
  created_at: string;
  session_id: string;
  block_type: string | null;
  title: string | null;
  duration_minutes: number | null;
  content: string | null;
  position: number | null;
  content_source: string | null;
  content_confidence: number | null;
  content_review_status: string | null;
};

export type Emotion = {
  id: string;
  user_id: string | null;
  created_at: string;
  session_id: string;
  label: string;
  category: string | null;
  valence: string | null;
  frequency: number | null;
  label_source: string | null;
  label_confidence: number | null;
  label_review_status: string | null;
};

export type DebriefEntry = {
  id: string;
  user_id: string | null;
  created_at: string;
  session_id: string;
  emotion_label: string | null;
  behavioural_commitment: string | null;
  key_quote: string | null;
  experiment: string | null;
  summary: string | null;
  summary_source: string | null;
  summary_confidence: number | null;
  summary_review_status: string | null;
};

export type PulseItem = {
  id: string;
  user_id: string | null;
  created_at: string;
  session_id: string;
  label: string;
  target_value: number | null;
  current_value: number | null;
};

export const PERSONAS = ["Facilitator", "Team Leader", "HR/OD Pro", "Individual"] as const;
export const FORMATS = ["remote", "in-person", "hybrid", "async"] as const;
export const BLOCK_TYPES = ["welcome", "exercise", "breakout", "brainstorm", "close", "question"] as const;
