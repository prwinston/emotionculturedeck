const SYSTEM_PROMPT = `You are an expert Emotional Culture Deck (ECD) facilitation designer. ECD is a
card-based tool that helps teams name the emotions they want more and less of at work, then
design behaviours to shift toward the desired emotions.

Rules:
- Never use diagnostic, clinical, or mental-health language (no "trauma", "disorder", "therapy",
  "symptom", etc.). This is a workplace culture tool, not a clinical one.
- Be concrete and facilitator-usable: every instruction should be something a facilitator can
  read aloud or act on directly.
- Always respond by calling the provided tool with your structured result. Never respond in
  plain text.`;

const MODEL = "claude-sonnet-5";

export class AIConfigError extends Error {}

async function callTool(
  userPrompt: string,
  tool: { name: string; description: string; input_schema: Record<string, unknown> },
): Promise<unknown> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new AIConfigError(
      "AI generation isn't configured yet (missing ANTHROPIC_API_KEY). You can still build this manually.",
    );
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      tools: [tool],
      tool_choice: { type: "tool", name: tool.name },
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Claude request failed (${res.status}): ${detail.slice(0, 300)}`);
  }

  const data = await res.json();
  const toolUse = (data?.content as { type: string; input?: unknown }[] | undefined)?.find(
    (block) => block.type === "tool_use",
  );
  if (!toolUse?.input) throw new Error("Claude returned no structured result.");

  return toolUse.input;
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

Produce 5-7 blocks whose duration_minutes sum to approximately the total duration. Always start
with a "welcome" block and end with a "close" block that captures commitments.`;

  const result = (await callTool(prompt, {
    name: "submit_agenda",
    description: "Submit the designed ECD session agenda.",
    input_schema: {
      type: "object",
      properties: {
        blocks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              position: { type: "integer" },
              block_type: {
                type: "string",
                enum: ["welcome", "exercise", "breakout", "brainstorm", "close"],
              },
              title: { type: "string" },
              duration_minutes: { type: "integer" },
              content: { type: "string", description: "Facilitator instructions, 1-2 sentences." },
              confidence: { type: "number", description: "0-1" },
            },
            required: ["position", "block_type", "title", "duration_minutes", "content", "confidence"],
          },
        },
      },
      required: ["blocks"],
    },
  })) as { blocks?: GeneratedBlock[] };

  if (!Array.isArray(result.blocks) || result.blocks.length === 0) {
    throw new Error("Claude's response did not include any agenda blocks.");
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

Questions should be open-ended, situational (reference this team's context), and never use
diagnostic or clinical language.`;

  const result = (await callTool(prompt, {
    name: "submit_questions",
    description: "Submit the generated situational ECD questions.",
    input_schema: {
      type: "object",
      properties: {
        questions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              question: { type: "string" },
              confidence: { type: "number", description: "0-1" },
            },
            required: ["question", "confidence"],
          },
        },
      },
      required: ["questions"],
    },
  })) as { questions?: { question: string; confidence: number }[] };

  if (!Array.isArray(result.questions) || result.questions.length === 0) {
    throw new Error("Claude's response did not include any questions.");
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
Experiment agreed: ${input.experiment ?? "none captured"}`;

  const result = (await callTool(prompt, {
    name: "submit_summary",
    description: "Submit the debrief synthesis summary.",
    input_schema: {
      type: "object",
      properties: {
        summary: { type: "string" },
        confidence: { type: "number", description: "0-1" },
      },
      required: ["summary", "confidence"],
    },
  })) as { summary?: string; confidence?: number };

  if (!result.summary) throw new Error("Claude's response did not include a summary.");
  return { summary: result.summary, confidence: result.confidence ?? 0.8 };
}
