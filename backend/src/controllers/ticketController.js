import Ticket from "../models/Ticket.js";
import Metric from "../models/Metric.js";
import { classifyTicket } from "../services/openaiService.js";

/* ---------------- HELPER FUNCTION ---------------- */
// WHY here?
// - Pure business logic
// - No DB access
// - Easy to test
function assignQueue(category) {
  if (category === "billing") return "Finance Support";
  if (category === "technical") return "Tech Support";
  if (category === "account") return "Account Support";
  return "General Support";
}

/* ---------------- CONTROLLER ---------------- */
export const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;

    // 1️⃣ Basic checks
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    // Normalize input
    const cleanTitle = title.trim().toLowerCase();
    const cleanDesc = description.trim().toLowerCase();

    // 2️⃣ Length checks
    if (cleanTitle.length < 5 || cleanDesc.length < 15) {
      return res.status(400).json({
        error: "Title or description is too short"
      });
    }

    // 3️⃣ Block random repeated characters (aaaa, ddcafafafa)
    const repeatedPattern = /(.)\1{3,}/; // same char 4+ times
    if (repeatedPattern.test(cleanTitle) || repeatedPattern.test(cleanDesc)) {
      return res.status(400).json({
        error: "Input looks invalid or repetitive"
      });
    }

    // 4️⃣ Require real words (at least one space = multiple words)
    if (!cleanDesc.includes(" ")) {
      return res.status(400).json({
        error: "Description must contain multiple words"
      });
    }

    // 5️⃣ Require vowels + consonants (blocks 'asdfgh')
    const wordPattern = /[aeiou]/i;
    if (!wordPattern.test(cleanTitle) || !wordPattern.test(cleanDesc)) {
      return res.status(400).json({
        error: "Input does not look meaningful"
      });
    }

    // 1️⃣ Save raw ticket (never fail core data)
    const ticket = await Ticket.create({ title, description });

    // 2️⃣ AI classification
    const { category, priority } =
      await classifyTicket(title, description);

    // 3️⃣ Queue assignment (rule-based)
    const assignedQueue = assignQueue(category);

    // 4️⃣ Update ticket
    ticket.category = category;
    ticket.priority = priority;
    ticket.assignedQueue = assignedQueue;
    await ticket.save();

    // 5️⃣ Update metrics
    await Metric.findOneAndUpdate(
      { category },
      { $inc: { count: 1 } },
      { upsert: true }
    );

    res.status(201).json(ticket);

  } catch (err) {
    res.status(500).json({ error: "Ticket processing failed" });
  }
};
// ---------------- METRICS CONTROLLER ----------------
// WHY:
// - Admin dashboard needs this
// - Read-only API
// - Fast (no aggregation)
export const getMetrics = async (req, res) => {
  try {
    const metrics = await Metric.find({});
    res.status(200).json(metrics);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
};
// ---------------- ADMIN: GET ALL TICKETS ----------------
// WHY:
// - Admin dashboard listing
// - Sorted by newest first
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({})
      .sort({ createdAt: -1 });

    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
};

// ---------------- ADMIN: GET TICKETS BY QUEUE ----------------
// WHY:
// - Queue-based workload view
// - Filter without frontend logic
export const getTicketsByQueue = async (req, res) => {
  try {
    const { queue } = req.query;

    const tickets = await Ticket.find({ assignedQueue: queue })
      .sort({ createdAt: -1 });

    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch queue tickets" });
  }
};

