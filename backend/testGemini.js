import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.0-pro"
    });

    const res = await model.generateContent(
      'Return JSON: {"ok": true}'
    );

    console.log("✅ Gemini test success:", res.response.text());
  } catch (e) {
    console.error("❌ DIRECT TEST FAILED:", e.message);
  }
}

test();
