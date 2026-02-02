import Ticket from "../models/Ticket.js";
import Metric from "../models/Metric.js";
import { classifyTicket } from "../services/openaiService.js";
import { validateTicketInput } from "../utils/validateTicket.js";
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
    const error = validateTicketInput(title, description);
    if (error) {
      return res.status(400).json({ error });
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
    // 1️⃣ Save raw ticket (never fail core data)
    const ticket = await Ticket.create({
      title,
      description,
      user: req.user.id // 🔥 IMPORTANT
    });


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
    console.error("❌ Ticket creation error:", err);
    res.status(500).json({
      error: "Ticket processing failed",
      details: err.message,
    });
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
    const { status, priority, search } = req.query;

    let query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const tickets = await Ticket.find(query).sort({ createdAt: -1 });
    res.json(tickets);
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

/**
 * @desc    Get logged-in user's tickets
 * @route   GET /api/tickets/my
 * @access  Authenticated User
 */
export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user tickets" });
  }
};
/**
 * @desc    Delete a ticket (only owner)
 * @route   DELETE /api/tickets/:id
 * @access  Authenticated User
 */
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    // 🔐 Ensure user owns the ticket
    if (ticket.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await ticket.deleteOne();
    res.json({ message: "Ticket deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete ticket" });
  }
};
/**
 * @desc    Update ticket status
 * @route   PATCH /api/tickets/:id/status
 * @access  Authenticated User (owner)
 */
export const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["open", "resolved"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    // 🔐 Only ticket owner can update
    if (ticket.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    ticket.status = status;
    await ticket.save();

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: "Failed to update ticket status" });
  }
};
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 2) {
      return res.status(400).json({ error: "Comment too short" });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    const newComment = {
      text: text.trim(),
      user: req.user.id,
      role: req.user.role,
    };

    ticket.comments.push(newComment);
    await ticket.save();

    res.status(201).json(ticket.comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
};

// ---------------- GET SINGLE TICKET ----------------
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("user", "name email")
      .populate("comments.user", "name role");

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch ticket" });
  }
};


