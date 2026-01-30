import express from "express";
import {
  createTicket,
  getMetrics,
  getAllTickets,
  getTicketsByQueue
} from "../controllers/ticketController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/tickets
 * @desc    Create a new support ticket
 * @access  Authenticated User
 */
router.post("/", protect, createTicket);

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
