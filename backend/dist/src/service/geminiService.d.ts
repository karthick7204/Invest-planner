export interface AIInsightItem {
    title: string;
    description: string;
    icon: string;
    tag: string;
    color: string;
}
export interface AIInsightMetrics {
    healthScore: number;
    savingsRatio: number;
    netWorthVelocity: string;
}
export interface AIInsightResponse {
    insights: AIInsightItem[];
    metrics: AIInsightMetrics;
}
export interface AIInsightResponseStrict {
    title: string;
    insights: string[];
    suggestions: string[];
    investmentAdvice: string[];
}
/**
 * Strict validator for AIInsightResponseStrict JSON structures.
 * Throws an explicit Error if fields are missing or invalid, preventing fake fallback reports.
 */
export declare const validateAIInsightResponseStrict: (data: unknown) => AIInsightResponseStrict;
/**
 * Strict validator for AIInsightResponse JSON structures.
 * Throws an explicit Error if fields are missing or invalid.
 */
export declare const validateAIInsightResponse: (data: unknown) => AIInsightResponse;
/**
 * Extracts and parses a JSON object safely from raw LLM text output.
 */
export declare const extractAndParseJSON: (rawText: string) => unknown;
export declare const generateAIInsights: (userData: string) => Promise<AIInsightResponse>;
export declare const generateAIInsightsStrict: (userData: any) => Promise<AIInsightResponseStrict>;
export declare const generateNaturalLanguageInsight: (insightPayload: any) => Promise<string>;
//# sourceMappingURL=geminiService.d.ts.map