// Rule-based ticket classification
// This acts as an AI fallback and AI-ready interface

export async function classifyTicket(title, description) {
  const text = `${title} ${description}`.toLowerCase();

  // ---------- KEYWORD MAP ----------
  const rules = {
    billing: [
      "payment",
      "billing",
      "refund",
      "invoice",
      "charged",
      "money",
      "transaction"
    ],
    technical: [
      "crash",
      "error",
      "bug",
      "issue",
      "not working",
      "fail",
      "broken",
      "problem"
    ],
    account: [
      "login",
      "signup",
      "account",
      "password",
      "username",
      "profile",
      "access"
    ]
  };

  // ---------- SCORING ----------
  const scores = {
    billing: 0,
    technical: 0,
    account: 0
  };

  for (const category in rules) {
    for (const keyword of rules[category]) {
      if (text.includes(keyword)) {
        scores[category]++;
      }
    }
  }

  // ---------- DECISION ----------
  let category = "general";
  let priority = "low";

  if (scores.billing > 0) {
    category = "billing";
    priority = "high";
  } else if (scores.technical > 0) {
    category = "technical";
    priority = "medium";
  } else if (scores.account > 0) {
    category = "account";
    priority = "medium";
  }

  return { category, priority };
}
