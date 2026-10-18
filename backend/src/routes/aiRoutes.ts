import { Router } from "express";
import { getFinancialReport, getAIInsights, getAIInsightsNew } from "../controllers/aiController.js";
import { verifyToken } from "../middleware/authentication.js";

const router = Router();

// Full personalized AI Financial Report endpoints
router.get("/report", verifyToken, getFinancialReport);
router.post("/report", verifyToken, getFinancialReport);

// AI Insights endpoints with user isolation enforcement
router.post("/insights", verifyToken, getAIInsights);
router.post("/insights/:userId", verifyToken, getAIInsights);

// AI Natural Language Insights endpoints with user isolation enforcement
router.get("/insights", verifyToken, getAIInsightsNew);
router.get("/insights/:userId", verifyToken, getAIInsightsNew);

export default router;