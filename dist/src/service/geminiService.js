import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });
export const generateAIInsights = async (userData) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Missing Gemini API Key. Please add GEMINI_API_KEY to your .env file.");
    }
    const prompt = `
    Analyze the following financial transaction data for a user.
    Identify spending patterns, savings opportunities, and potential risks.
    Return at least 3 distinct insights.
    Return the response ONLY in JSON format following this interface:
    {
      "insights": [
        {
          "title": "Short descriptive title",
          "description": "2-3 sentences of actionable advice based on real data",
          "icon": "Lucide icon name (e.g. Zap, PieChart, Target, AlertCircle, TrendingUp, TrendingDown)",
          "tag": "Short tag (Action, Positive, Risk, Analysis)",
          "color": "Tailwind bg color (e.g. bg-blue-50, bg-green-50, bg-red-50, bg-yellow-50)"
        }
      ],
      "metrics": {
        "healthScore": 0-100 (number),
        "savingsRatio": percentage (number),
        "netWorthVelocity": "Accelerating" | "Stable" | "Retracting"
      }
    }
    
    Data:
    ${userData}
  `;
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Gemini response text length:", text.length);
        // Clean JSON if the model returns Markdown blocks or extra text
        let jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
        // Robust search for the JSON object
        const startIdx = jsonStr.indexOf('{');
        const endIdx = jsonStr.lastIndexOf('}');
        if (startIdx !== -1 && endIdx !== -1) {
            jsonStr = jsonStr.substring(startIdx, endIdx + 1);
        }
        return JSON.parse(jsonStr);
    }
    catch (error) {
        console.error("Gemini AI generation failed or JSON parse error:", error);
        throw error;
    }
};
//# sourceMappingURL=geminiService.js.map