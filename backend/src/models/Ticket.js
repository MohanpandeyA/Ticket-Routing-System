import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: "pending"
  },
  priority: {
    type: String,
    default: "pending"
  },
  status: {
    type: String,
    default: "open"
  },
  assignedQueue: {
    type: String,
    default: "unassigned"
  }
}, { timestamps: true });

export default mongoose.model("Ticket", ticketSchema);
