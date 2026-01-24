import Ticket from "../models/Ticket.js";
import Metric from "../models/Metric.js";
import { classifyTicket } from "../services/openaiService.js";

/* ---------------- HELPER FUNCTION ---------------- */
// WHY here?
// - Pure business logic
// - No DB access
// - Easy to test
function assignQueue(category){
  if (category === "billing") return "Finance Support";
  if (category === "technical") return "Tech Support";
  if (category === "account") return "Account Support";
  return "General Support";
}

/* ---------------- CONTROLLER ---------------- */
export const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;

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

