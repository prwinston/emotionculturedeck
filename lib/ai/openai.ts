const SYSTEM_PROMPT = `You are an expert Emotional Culture Deck (ECD) facilitation designer. ECD is a
card-based tool that helps teams name the emotions they want more and less of at work, then
design behaviours to shift toward the desired emotions.

Rules:
- Never use diagnostic, clinical, or mental-health language (no "trauma", "disorder", "therapy",
  "symptom", etc.). This is a workplace culture tool, not a clinical one.
- Be concrete and facilitator-usable: every instruction should be something a facilitator can
  read aloud or act on directly.
- Return ONLY valid JSON matching the schema described in the user prompt. No markdown fences,
  no commentary.`;

export class AIConfigError extends Error {}

async function chatJSON(userPrompt: string): Promise<unknown> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new AIConfigError(
      "AI generation isn't configured yet (missing OPENAI_API_KEY). You can still build this manually.",
    );
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`OpenAI request failed (${res.status}): ${detail.slice(0, 300)}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI returned no content.");

  try {
    return JSON.parse(content);
  } catch {
    throw new Error("OpenAI returned content that was not valid JSON.");
  }
}

export type GeneratedBlock = {
  position: number;
  block_type: string;
  title: string;
  duration_minutes: number;
  content: string;
  confidence: number;
};

export async function generateAgendaBlocks(session: {
  title: string;
  persona: string | null;
  format: string | null;
  duration_minutes: number | null;
  audience_size: number | null;
  objectives: string | null;
}): Promise<GeneratedBlock[]> {
  const prompt = `Design an Emotional Culture Deck session agenda.

Session: "${session.title}"
Facilitator persona: ${session.persona ?? "Facilitator"}
Format: ${session.format ?? "remote"}
Total duration: ${session.duration_minutes ?? 60} minutes
Audience size: ${session.audience_size ?? 8}
Objectives: ${session.objectives || "Not specified — infer a reasonable general ECD objective."}

Return JSON: {"blocks": [{"position": number, "block_type": "welcome"|"exercise"|"breakout"|"brainstorm"|"close", "title": string, "duration_minutes": number, "content": string (facilitator instructions, 1-2 sentences), "confidence": number (0-1)}]}

Produce 5-7 blocks whose duration_minutes sum to approximately the total duration. Always start
with a "welcome" block and end with a "close" block that captures commitments.`;

  const result = (await chatJSON(prompt)) as { blocks?: GeneratedBlock[] };
  if (!Array.isArray(result.blocks) || result.blocks.length === 0) {
    throw new Error("OpenAI response did not include any agenda blocks.");
  }
  return result.blocks;
}

export async function generateQuestions(session: {
  title: string;
  persona: string | null;
  objectives: string | null;
}): Promise<{ question: string; confidence: number }[]> {
  const prompt = `Generate 5 situational Emotional Culture Deck discussion questions for this session.

Session: "${session.title}"
Facilitator persona: ${session.persona ?? "Facilitator"}
Objectives: ${session.objectives || "Not specified — infer a reasonable general ECD objective."}

Return JSON: {"questions": [{"question": string, "confidence": number (0-1)}]}

Questions should be open-ended, situational (reference this team's context), and never use
diagnostic or clinical language.`;

  const result = (await chatJSON(prompt)) as { questions?: { question: string; confidence: number }[] };
  if (!Array.isArray(result.questions) || result.questions.length === 0) {
    throw new Error("OpenAI response did not include any questions.");
  }
  return result.questions;
}

export async function generateDebriefSummary(input: {
  sessionTitle: string;
  emotionLabel: string | null;
  behaviouralCommitment: string | null;
  keyQuote: string | null;
  experiment: string | null;
}): Promise<{ summary: string; confidence: number }> {
  const prompt = `Write a short synthesis summary (2-3 sentences) of this Emotional Culture Deck
debrief entry, suitable for a stakeholder recap.

Session: "${input.sessionTitle}"
Emotion focus: ${input.emotionLabel ?? "not specified"}
Behavioural commitment: ${input.behaviouralCommitment ?? "not specified"}
Key quote from the session: ${input.keyQuote ?? "none captured"}
Experiment agreed: ${input.experiment ?? "none captured"}

Return JSON: {"summary": string, "confidence": number (0-1)}`;

  const result = (await chatJSON(prompt)) as { summary?: string; confidence?: number };
  if (!result.summary) throw new Error("OpenAI response did not include a summary.");
  return { summary: result.summary, confidence: result.confidence ?? 0.8 };
}
