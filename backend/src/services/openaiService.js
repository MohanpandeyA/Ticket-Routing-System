import { classifyTicketWithGemini } from "./geminiService.js";

export const classifyTicket = async (title, description) => {
  // 1️⃣ Try Gemini
  const aiResult = await classifyTicketWithGemini(title, description);
  if (aiResult) return aiResult;

  // 2️⃣ Fallback rule-based logic
  const text = `${title} ${description}`.toLowerCase();

  if (text.includes("payment") || text.includes("billing")) {
    return { category: "billing", priority: "high" };
  }
  if (text.includes("crash") || text.includes("error")) {
    return { category: "technical", priority: "medium" };
  }
  if (text.includes("account") || text.includes("login")) {
    return { category: "account", priority: "medium" };
  }

  return { category: "general", priority: "low" };
};
