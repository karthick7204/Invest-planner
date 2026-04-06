import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });

export interface AIInsightResponse {
  insights: {
    title: string;
    description: string;
    icon: string;
    tag: string;
    color: string;
  }[];
  metrics: {
    healthScore: number;
    savingsRatio: number;
    netWorthVelocity: string;
  };
}

export interface AIInsightResponseStrict {
  title: string;
  insights: string[];
  suggestions: string[];
  investmentAdvice: string[];
}

export const generateAIInsights = async (userData: string): Promise<AIInsightResponse> => {
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
    
    return JSON.parse(jsonStr) as AIInsightResponse;
  } catch (error) {
    console.error("Gemini AI generation failed or JSON parse error:", error);
    throw error;
  }
};export const generateAIInsightsStrict = async (userData: any): Promise<AIInsightResponseStrict> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing Gemini API Key. Please add GEMINI_API_KEY to your .env file.");
  }

  const prompt = `
    You are a financial assistant.
    Analyze the user's financial data.
    
    Rules:
    - If expenses > salary → flag overspending
    - If surplus < 10% of salary → flag low savings
    - Identify top spending categories
    - Suggest how to reduce expenses
    - Suggest how to improve investments
    
    Keep output clean and short:
    Title: ...
    Insights: - ...
    Suggestions: - ...
    Investment Advice: - ...
    
    Return the response ONLY in JSON format following this interface:
    {
      "title": string,
      "insights": string[],
      "suggestions": string[],
      "investmentAdvice": string[]
    }
    
    User Data:
    ${JSON.stringify(userData, null, 2)}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // --- DEBUG LOG FOR THE USER ---
    console.log("-----------------------------------------");
    console.log("🔮 RAW LLM RESPONSE:");
    console.log(text);
    console.log("-----------------------------------------");
    
    // Clean JSON if the model returns Markdown blocks or extra text
    let jsonStr = text.trim();
    
    // Extract JSON using regex if it's wrapped in code blocks
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
        jsonStr = jsonMatch[1].trim();
    }
    
    // Final defensive check to get only the JSON part
    const startIdx = jsonStr.indexOf('{');
    const endIdx = jsonStr.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1) {
        jsonStr = jsonStr.substring(startIdx, endIdx + 1);
    }
    
    try {
        return JSON.parse(jsonStr) as AIInsightResponseStrict;
    } catch (parseError) {
        console.error("⚠️ Gemini JSON Parse Fallback triggered:", parseError);
        return getFallbackResponse();
    }
  } catch (error) {
    console.error("❌ Gemini AI generation failed:", error);
    return getFallbackResponse();
  }
};

const getFallbackResponse = (): AIInsightResponseStrict => {
    return {
        title: "Wealth AI Analysis (Draft)",
        insights: ["Analyzed your recent transactions and income profiles."],
        suggestions: ["Monitor your top categories for potential savings opportunities."],
        investmentAdvice: ["Consider diversifying into index funds once your surplus is stable and liquid."]
    };
};
