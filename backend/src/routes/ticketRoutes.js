import express from "express";
import {
  createTicket,
  getMetrics,
  getAllTickets,
  getTicketsByQueue
} from "../controllers/ticketController.js";


const router = express.Router();

router.post("/", createTicket);
router.get("/metrics", getMetrics);
router.get("/", getAllTickets);
router.get("/queue", getTicketsByQueue);

export default router;
