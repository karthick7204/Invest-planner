import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// Candidate models in order of priority. gemini-1.5-flash is retired/unsupported in v1beta.
const CANDIDATE_MODELS = [
    process.env.GEMINI_MODEL,
    "gemini-3.8-flash",
    "gemini-flash-latest",
].filter((m) => Boolean(m && m.trim()));
/**
 * Resiliently execute a Gemini API call with model fallback support
 */
async function callGeminiWithFallback(actionName, fn) {
    let lastError = null;
    for (const modelName of CANDIDATE_MODELS) {
        try {
            return await fn(modelName);
        }
        catch (err) {
            console.warn(`⚠️ [${actionName}] Attempt with model ${modelName} failed:`, err.message || err);
            lastError = err;
            const msg = String(err.message || "").toLowerCase();
            // If model not found / deprecated / unsupported, try next model candidate
            if (msg.includes("not found") ||
                msg.includes("not supported") ||
                msg.includes("no longer available") ||
                msg.includes("404")) {
                continue;
            }
            throw err;
        }
    }
    throw lastError || new Error(`All candidate Gemini models failed for ${actionName}`);
}
/**
 * Strict validator for AIInsightResponseStrict JSON structures.
 * Throws an explicit Error if fields are missing or invalid, preventing fake fallback reports.
 */
export const validateAIInsightResponseStrict = (data) => {
    if (!data || typeof data !== "object") {
        throw new Error("AI response must be a JSON object");
    }
    const obj = data;
    if (typeof obj.title !== "string" || !obj.title.trim()) {
        throw new Error("AI response is missing a valid non-empty 'title' string");
    }
    if (!Array.isArray(obj.insights) || obj.insights.length === 0) {
        throw new Error("AI response must contain an 'insights' array with at least 1 item");
    }
    const insights = obj.insights.map((item, idx) => {
        if (typeof item !== "string" || !item.trim()) {
            throw new Error(`AI response 'insights[${idx}]' must be a non-empty string`);
        }
        return item.trim();
    });
    if (!Array.isArray(obj.suggestions)) {
        throw new Error("AI response must contain a 'suggestions' array");
    }
    const suggestions = obj.suggestions.map((item, idx) => {
        if (typeof item !== "string" || !item.trim()) {
            throw new Error(`AI response 'suggestions[${idx}]' must be a non-empty string`);
        }
        return item.trim();
    });
    if (!Array.isArray(obj.investmentAdvice)) {
        throw new Error("AI response must contain an 'investmentAdvice' array");
    }
    const investmentAdvice = obj.investmentAdvice.map((item, idx) => {
        if (typeof item !== "string" || !item.trim()) {
            throw new Error(`AI response 'investmentAdvice[${idx}]' must be a non-empty string`);
        }
        return item.trim();
    });
    return {
        title: obj.title.trim(),
        insights,
        suggestions,
        investmentAdvice,
    };
};
/**
 * Strict validator for AIInsightResponse JSON structures.
 * Throws an explicit Error if fields are missing or invalid.
 */
export const validateAIInsightResponse = (data) => {
    if (!data || typeof data !== "object") {
        throw new Error("AI response must be a JSON object");
    }
    const obj = data;
    if (!Array.isArray(obj.insights) || obj.insights.length === 0) {
        throw new Error("AI response must contain a non-empty 'insights' array");
    }
    const insights = obj.insights.map((item, idx) => {
        if (!item || typeof item !== "object") {
            throw new Error(`AI response 'insights[${idx}]' must be an object`);
        }
        const it = item;
        if (typeof it.title !== "string" || !it.title.trim()) {
            throw new Error(`AI response 'insights[${idx}]' missing 'title'`);
        }
        if (typeof it.description !== "string" || !it.description.trim()) {
            throw new Error(`AI response 'insights[${idx}]' missing 'description'`);
        }
        return {
            title: it.title.trim(),
            description: it.description.trim(),
            icon: typeof it.icon === "string" && it.icon.trim() ? it.icon.trim() : "Sparkles",
            tag: typeof it.tag === "string" && it.tag.trim() ? it.tag.trim() : "Analysis",
            color: typeof it.color === "string" && it.color.trim() ? it.color.trim() : "bg-blue-50",
        };
    });
    if (!obj.metrics || typeof obj.metrics !== "object") {
        throw new Error("AI response missing valid 'metrics' object");
    }
    const m = obj.metrics;
    const healthScore = typeof m.healthScore === "number" ? m.healthScore : Number(m.healthScore);
    const savingsRatio = typeof m.savingsRatio === "number" ? m.savingsRatio : Number(m.savingsRatio);
    if (isNaN(healthScore)) {
        throw new Error("AI response 'metrics.healthScore' must be a valid number");
    }
    if (isNaN(savingsRatio)) {
        throw new Error("AI response 'metrics.savingsRatio' must be a valid number");
    }
    return {
        insights,
        metrics: {
            healthScore,
            savingsRatio,
            netWorthVelocity: typeof m.netWorthVelocity === "string" ? m.netWorthVelocity : "Stable",
        },
    };
};
/**
 * Extracts and parses a JSON object safely from raw LLM text output.
 */
export const extractAndParseJSON = (rawText) => {
    if (!rawText || !rawText.trim()) {
        throw new Error("Received empty response from Gemini");
    }
    let cleaned = rawText.trim();
    // Strip Markdown code block wrappers if present
    const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch && codeBlockMatch[1]) {
        cleaned = codeBlockMatch[1].trim();
    }
    else {
        cleaned = cleaned.replace(/```json/gi, "").replace(/```/g, "").trim();
    }
    // Find boundaries of the JSON object
    const startIdx = cleaned.indexOf("{");
    const endIdx = cleaned.lastIndexOf("}");
    if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
        throw new Error(`Unable to find valid JSON object boundaries in Gemini output: "${cleaned.slice(0, 100)}..."`);
    }
    cleaned = cleaned.substring(startIdx, endIdx + 1);
    try {
        return JSON.parse(cleaned);
    }
    catch (err) {
        throw new Error(`Failed to parse Gemini JSON output: ${err.message}. Raw text snippet: "${cleaned.slice(0, 120)}"`);
    }
};
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
    return await callGeminiWithFallback("generateAIInsights", async (modelName) => {
        const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
                responseMimeType: "application/json",
            },
        });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(`[generateAIInsights] Gemini response text length (${modelName}):`, text.length);
        const parsed = extractAndParseJSON(text);
        return validateAIInsightResponse(parsed);
    });
};
export const generateAIInsightsStrict = async (userData) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Missing Gemini API Key. Please add GEMINI_API_KEY to your .env file.");
    }
    const prompt = `
    You are an expert personal financial advisor and auditor.
    Analyze the user's actual financial records and metrics.
    
    Rules:
    - If records are empty or income is 0, provide constructive guidance on getting started with logging income, expenses, and category budgets.
    - If expenses > salary/income → flag critical overspending with exact deficit
    - If surplus < 10% of salary → flag low savings rate
    - Identify top spending categories from data
    - Suggest how to reduce expenses specifically mentioning categories and actionable targets
    - Suggest how to optimize investments (stocks, mutual funds, emergency reserves) based on actual surplus
    
    Keep output clean, professional, and actionable.
    Return the response ONLY in JSON format following this exact interface:
    {
      "title": string,
      "insights": string[],
      "suggestions": string[],
      "investmentAdvice": string[]
    }
    
    User Data:
    ${JSON.stringify(userData, null, 2)}
  `;
    return await callGeminiWithFallback("generateAIInsightsStrict", async (modelName) => {
        const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
                responseMimeType: "application/json",
            },
        });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("-----------------------------------------");
        console.log(`🔮 RAW LLM RESPONSE (${modelName}, length: ${text.length}):`);
        console.log(text.slice(0, 300) + (text.length > 300 ? "..." : ""));
        console.log("-----------------------------------------");
        const parsed = extractAndParseJSON(text);
        return validateAIInsightResponseStrict(parsed);
    });
};
export const generateNaturalLanguageInsight = async (insightPayload) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Missing Gemini API Key. Please add GEMINI_API_KEY to your .env file.");
    }
    const prompt = `
    You are a personal finance assistant. Analyze this spending data and write a 3-4 sentence natural language summary.
    Include: which day this week had the highest spend and in which category, which category will overspend this month based on projectedTotal, and one specific actionable suggestion to spend less mentioning the category and a ₹ amount to cut. 
    Write as a short flowing paragraph, no bullet points, use ₹ for amounts, friendly but direct tone.

    If there is no spending data for this week, mention that and suggest a general tip based on the monthly projections.

    Data:
    ${JSON.stringify(insightPayload, null, 2)}
  `;
    return await callGeminiWithFallback("generateNaturalLanguageInsight", async (modelName) => {
        const model = genAI.getGenerativeModel({
            model: modelName,
            // Plain text mode: do not force JSON mime type
        });
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_NONE",
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_NONE",
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_NONE",
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_NONE",
                },
            ],
        });
        const response = await result.response;
        const text = response.text();
        if (!text || !text.trim())
            throw new Error("Empty response from Gemini");
        return text.trim();
    });
};
//# sourceMappingURL=geminiService.js.map