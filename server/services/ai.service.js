
import { ApiError } from "../utils/apiError.js";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function askAI({ system, prompt, json = false }) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL;

  if (!apiKey || !model) {
    throw new ApiError(503, "AI provider is not configured on the server");
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
      "X-Title": "StudyPilot AI",
    },
    body: JSON.stringify({
  model,
  temperature: 0.2,

  // Output limit: prevent oversized token requests
  max_tokens: json ? 4000 : 1500,

  messages: [
    { role: "system", content: system },
    { role: "user", content: prompt },
  ],

  ...(json ? { response_format: { type: "json_object" } } : {}),
}),
    signal: AbortSignal.timeout(45000),
  });

 if (!response.ok) {
  const errorText = await response.text();

  console.error("OpenRouter status:", response.status);
  console.error("OpenRouter details:", errorText.slice(0, 1500));

  if (response.status === 401 || response.status === 403) {
    throw new ApiError(
      502,
      "OpenRouter authentication failed. Check API key and permissions."
    );
  }

  if (response.status === 402) {
    throw new ApiError(
      502,
      "OpenRouter credits or account limits need checking."
    );
  }

  if (response.status === 429) {
    throw new ApiError(
      429,
      "AI rate limit reached. Please try again later."
    );
  }

  if (response.status === 400 || response.status === 404) {
    throw new ApiError(
      502,
      "AI request or model configuration is invalid. Check server logs."
    );
  }

  throw new ApiError(
    502,
    "AI provider failed. Check the backend terminal for details."
  );
}

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (typeof content !== "string" || !content.trim()) {
    throw new ApiError(502, "AI provider returned an empty response");
  }

  return content;
}

// export async function askAIForJSON(args) {
//   const content = await askAI({ ...args, json: true });

//   try {
//     return JSON.parse(content);
//   } catch {
//     throw new ApiError(502, "AI returned invalid JSON. Please retry.");
//   }
// }



export async function askAIForJSON(args) {
  const content = await askAI({ ...args, json: true });

  const cleaned = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  try {
    const parsed = JSON.parse(cleaned);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Expected a JSON object");
    }

    if (typeof parsed.answer !== "string") {
      throw new Error("Missing answer field");
    }

    if (
      parsed.visualization?.enabled &&
      !Array.isArray(parsed.visualization.steps)
    ) {
      throw new Error("Invalid visualization steps");
    }

    return parsed;
  } catch (error) {
    console.error("StudyPilot JSON parsing error:", error.message);
    throw new ApiError(502, "AI returned invalid structured data. Please retry.");
  }
}
