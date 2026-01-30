import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config(); // 🔥 MUST be first

import express from "express";
import cors from "cors";
import ticketRoutes from "./routes/ticketRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);


export default app;
