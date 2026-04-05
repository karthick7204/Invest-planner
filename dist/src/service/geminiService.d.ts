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
export declare const generateAIInsights: (userData: string) => Promise<AIInsightResponse>;
export declare const generateAIInsightsStrict: (userData: any) => Promise<AIInsightResponseStrict>;
//# sourceMappingURL=geminiService.d.ts.map