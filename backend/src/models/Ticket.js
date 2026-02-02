import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String, // "user" | "admin"
      required: true,
    },
  },
  { timestamps: true }
);

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "pending",
    },
    priority: {
      type: String,
      default: "pending",
    },
    status: {
      type: String,
      default: "open",
    },
    assignedQueue: {
      type: String,
      default: "unassigned",
    },

    // 🔑 WHO CREATED THE TICKET
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 💬 COMMENTS THREAD
    comments: [commentSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
