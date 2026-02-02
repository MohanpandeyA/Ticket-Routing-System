import express from "express";
import {
  createTicket,
  getMetrics,
  getAllTickets,
  getTicketsByQueue,
  getMyTickets
} from "../controllers/ticketController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { deleteTicket } from "../controllers/ticketController.js";
import { updateTicketStatus } from "../controllers/ticketController.js";

const router = express.Router();

/**
 * @route   POST /api/tickets
 * @desc    Create a new support ticket
 * @access  Authenticated User
 */
router.post("/", protect, createTicket);
router.get("/my", protect, getMyTickets);
router.delete("/:id", protect, deleteTicket);
router.patch("/:id/status", protect, updateTicketStatus);

/**
 * @route   GET /api/tickets
 * @desc    Get all tickets
 * @access  Admin only
 */
router.get("/", protect, adminOnly, getAllTickets);

/**
 * @route   GET /api/tickets/queue?queue=Tech Support
 * @desc    Get tickets by support queue
 * @access  Admin only
 */
router.get("/queue", protect, adminOnly, getTicketsByQueue);

/**
 * @route   GET /api/tickets/metrics
 * @desc    Get ticket analytics (counts per category)
 * @access  Admin only
 */
router.get("/metrics", protect, adminOnly, getMetrics);


export default router;
