const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
// NOTE: Groq's model lineup changes over time. Verify current free-tier models
// at https://console.groq.com/docs/models before your demo — if this model
// stops working, swap the string below for whatever's currently listed there.
const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
const IS_GPT_OSS = MODEL.startsWith("openai/gpt-oss");

type GroqMessage = { role: "system" | "user" | "assistant"; content: string };

async function requestGroq(body: Record<string, unknown>): Promise<Response> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set in environment variables");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  let response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  // Groq communicates short free-tier cooldowns through 429 responses. Retry
  // once automatically so a brief burst does not become a visible app error.
  if (response.status === 429) {
    const retryAfter = Number(response.headers.get("retry-after")) || 2;
    await new Promise((resolve) => setTimeout(resolve, Math.min(retryAfter, 5) * 1000));
    response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
  }

  return response;
}

async function callGroq(messages: GroqMessage[], jsonMode = false, quizCount = 5): Promise<string> {
  const baseBody = {
    model: MODEL,
    messages,
    temperature: jsonMode ? 0.1 : 0.3,
    // 1,100 tokens cut longer notes and plans off mid-response. Keep enough
    // room for a complete answer while staying reasonable for the free tier.
    max_completion_tokens: jsonMode ? 2000 : 2000,
    ...(IS_GPT_OSS ? { reasoning_effort: "low", ...(jsonMode ? { reasoning_format: "hidden" } : {}) } : {}),
  };

  const schemaBody = {
    ...baseBody,
    ...(jsonMode
      ? {
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "study_quiz",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  questions: {
                    type: "array",
                    minItems: quizCount,
                    maxItems: quizCount,
                    items: {
                      type: "object",
                      properties: {
                        question: { type: "string" },
                        options: { type: "array", minItems: 4, maxItems: 4, items: { type: "string" } },
                        correctIndex: { type: "integer", minimum: 0, maximum: 3 },
                        explanation: { type: "string" },
                      },
                      required: ["question", "options", "correctIndex", "explanation"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["questions"],
                additionalProperties: false,
              },
            },
          },
        }
      : {}),
  };

  let res = await requestGroq(schemaBody);

  // Some Groq model aliases accept JSON object mode but reject JSON schema.
  // Fall back automatically so quiz generation remains compatible.
  if (!res.ok && jsonMode && res.status === 400) {
    res = await requestGroq({ ...baseBody, response_format: { type: "json_object" } });
  }

  if (!res.ok) {
    const errText = await res.text();
    if (res.status === 429) {
      throw new Error("Groq is temporarily rate-limited. Please wait a few seconds and try again.");
    }
    throw new Error(`Groq API error (${res.status}): ${errText}`);
  }

  const data = await res.json().catch(() => null);
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Groq API returned an empty response");
  }
  return content;
}

export async function generateExplanation(topic: string, difficulty: string): Promise<string> {
  return callGroq([
    {
      role: "system",
      content: `You are a patient, clear tutor. Explain topics at a ${difficulty.toLowerCase()} level. Give a complete answer with short paragraphs and simple headings. Do not stop mid-sentence, do not use Markdown tables, and do not output raw pipe characters or horizontal-rule lines.`,
    },
    { role: "user", content: `Explain: ${topic}` },
  ]);
}

export async function generateNotes(topic: string, difficulty: string): Promise<string> {
  return callGroq([
    {
      role: "system",
      content: `You create complete, well-organized study notes at a ${difficulty.toLowerCase()} level. Use simple headings and bullet points only. Do not use Markdown tables, raw pipe characters, backslash escapes, or horizontal-rule lines. Finish every section and never stop mid-sentence.`,
    },
    { role: "user", content: `Create study notes for: ${topic}` },
  ]);
}

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export async function generateQuiz(
  topic: string,
  difficulty: string,
  count = 5
): Promise<QuizQuestion[]> {
  const raw = await callGroq(
    [
      {
        role: "system",
        content: `Generate exactly ${count} multiple-choice questions about the requested topic at a ${difficulty.toLowerCase()} level. Return only the JSON object matching the provided schema. Do not include markdown, commentary, or extra keys. Complete every question and explanation.`,
      },
      { role: "user", content: `Topic: ${topic}` },
    ],
    true,
    count
  );

  try {
    const withoutFence = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const firstBrace = withoutFence.indexOf("{");
    const lastBrace = withoutFence.lastIndexOf("}");
    const jsonText = firstBrace >= 0 && lastBrace > firstBrace
      ? withoutFence.slice(firstBrace, lastBrace + 1)
      : withoutFence;
    const parsed: { questions?: QuizQuestion[] } = JSON.parse(jsonText);
    if (!Array.isArray(parsed.questions) || parsed.questions.length !== count) {
      throw new Error("Response JSON missing 'questions' array");
    }
    const questions = parsed.questions.map((question: QuizQuestion) => ({
      question: String(question.question),
      options: Array.isArray(question.options) ? question.options.slice(0, 4).map(String) : [],
      correctIndex: Number(question.correctIndex),
      explanation: String(question.explanation),
    }));
    if (questions.some((question) => question.options.length !== 4 || question.correctIndex < 0 || question.correctIndex > 3)) {
      throw new Error("Quiz questions did not match the required four-option format");
    }
    return questions;
  } catch (err) {
    throw new Error(
      `Failed to parse quiz JSON from Groq: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

export async function generateStudyPlan(
  topic: string,
  difficulty: string
): Promise<string> {
  return callGroq([
    {
      role: "system",
      content: `You create a complete, realistic day-by-day study plan at a ${difficulty.toLowerCase()} level. Be specific about what to study each day, resources, practice, and review. Use simple headings and bullet points, not tables. Do not use raw pipe characters, backslash escapes, or horizontal-rule lines. Finish every day and never stop mid-sentence.`,
    },
    {
      role: "user",
      content: `Create a personalized study plan for: ${topic}`,
    },
  ]);
}
