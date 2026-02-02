import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
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
    },

    // 🔑 WHO CREATED THE TICKET
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
