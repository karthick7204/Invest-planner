import React from 'react';
interface ChartData {
    day: string;
    income: number;
    expenses: number;
}
interface IncomeExpensesChartProps {
    data?: ChartData[];
    title?: string;
    height?: number;
}
declare const IncomeExpensesChart: React.FC<IncomeExpensesChartProps>;
export default IncomeExpensesChart;
//# sourceMappingURL=graphChart.d.ts.map