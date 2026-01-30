import { GoogleGenAI } from "@google/genai";

let ai = null;

function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not loaded");
  }

  if (!ai) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });
  }

  return ai;
}

export async function classifyTicketWithGemini(title, description) {
  try {
    const client = getGeminiClient();

    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
Classify this support ticket and respond ONLY in JSON:

{
  "category": "billing | technical | account | general",
  "priority": "low | medium | high"
}

Title: ${title}
Description: ${description}
`
    });

    const text = response.text;
    const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
    return JSON.parse(json);
  } catch (err) {
    console.error("❌ Gemini error:", err.message);
    return null; // fallback-safe
  }
}
