import { Response } from "express";
import { authRequest } from "../middleware/authentication.js";
/**
 * Generate a comprehensive personalized Financial Report using Gemini AI
 * based on authenticated user's actual MongoDB income, expenses, transactions,
 * budgets, and investments.
 *
 * Endpoint: GET /ai/report or POST /ai/report
 */
export declare const getFinancialReport: (req: authRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Controller for AI Insights (POST /ai/insights/:userId).
 * Strictly enforces user isolation so users cannot query another user's financial data.
 */
export declare const getAIInsights: (req: authRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Controller for Natural Language AI Insight summary (GET /ai/insights/:userId).
 * Strictly enforces user isolation.
 */
export declare const getAIInsightsNew: (req: authRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=aiController.d.ts.map