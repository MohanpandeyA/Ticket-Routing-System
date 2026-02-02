import dotenv from "dotenv";
dotenv.config({ path: "./.env" });


import app from "./src/app.js";
import connectDB from "./src/config/db.js";

console.log("Gemini key loaded:", process.env.GEMINI_API_KEY?.length > 0);


connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
