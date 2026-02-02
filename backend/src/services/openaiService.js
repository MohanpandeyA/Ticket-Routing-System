import { classifyTicketWithGemini } from "./geminiService.js";

export const classifyTicket = async (title, description) => {
  let aiResult = null;

  try {
    aiResult = await classifyTicketWithGemini(title, description);
  } catch (err) {
    console.error("❌ Gemini call failed:", err.message);
  }

  const text = `${title} ${description}`.toLowerCase();

  // 🔒 HARD BUSINESS RULES (OVERRIDE AI)
  if (
    text.includes("payment") ||
    text.includes("billing") ||
    text.includes("checkout")
  ) {
    return { category: "billing", priority: "high" };
  }

  if (
    text.includes("error") ||
    text.includes("crash") ||
    text.includes("failed")
  ) {
    return { category: "technical", priority: "medium" };
  }

  if (
    text.includes("login") ||
    text.includes("password") ||
    text.includes("account")
  ) {
    return { category: "account", priority: "medium" };
  }

  // ✅ Use AI result only if valid
  if (aiResult?.category && aiResult?.priority) {
    return aiResult;
  }

  return { category: "general", priority: "low" };
};
