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
export declare const generateAIInsights: (userData: string) => Promise<AIInsightResponse>;
//# sourceMappingURL=geminiService.d.ts.map