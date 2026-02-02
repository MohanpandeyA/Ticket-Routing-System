import { GoogleGenAI } from "@google/genai";

let ai = null;

function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    return null; // 🔥 do NOT throw
  }

  if (!ai) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  return ai;
}

export async function classifyTicketWithGemini(title, description) {
  try {
    const client = getGeminiClient();

    // ✅ Gemini disabled → fallback
    if (!client) {
      return {
        category: "general",
        priority: "low",
      };
    }

    const prompt = `
You are a support ticket classifier for a production system.

STRICT RULES (DO NOT VIOLATE):
- Payment, billing, charge, invoice, refund, checkout issues → category = "billing", priority = "high"
- Errors, crashes, failures, bugs → category = "technical", priority = "medium"
- Login, password, account access → category = "account", priority = "medium"
- Only use "general" if none apply

Return ONLY valid JSON.
NO explanation.
NO extra text.

Format:
{
  "category": "billing | technical | account | general",
  "priority": "low | medium | high"
}

Title: ${title}
Description: ${description}
`;


    const response = await client.models.generateContent({
      model: "gemini-1.0-pro",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const text = response.text?.trim();

    if (!text || !text.startsWith("{")) {
      return {
        category: "general",
        priority: "low",
      };
    }
    return JSON.parse(text);
  } catch (err) {
    console.error("❌ Gemini error:", err.message);
    return {
      category: "general",
      priority: "low",
    };
  }
}
