'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartData {
  day?: string;
  name?: string;
  expenses: number;
}

interface IncomeExpensesChartProps {
  data?: ChartData[];
  title?: string;
  height?: number;
  dataKey?: "day" | "name";
}

const DEFAULT_DATA: ChartData[] = [
  { day: 'Mon', expenses: 925 },
  { day: 'Tue', expenses: 950 },
  { day: 'Wed', expenses: 1075 },
  { day: 'Thu', expenses: 775 },
  { day: 'Fri', expenses: 1075 },
  { day: 'Sat', expenses: 825 },
  { day: 'Sun', expenses: 725 },
];

const IncomeExpensesChart: React.FC<IncomeExpensesChartProps> = ({
  data = DEFAULT_DATA,
  title = 'Expense Analysis',
  height = 400,
  dataKey = "day",
}) => {
  return (
    <div className="w-full h-full bg-white rounded-xl">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
          barCategoryGap="20%"
        >
          <defs>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
              <stop offset="100%" stopColor="#d97706" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey={dataKey}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              padding: '12px'
            }}
            cursor={{ fill: '#f8fafc' }}
            formatter={(value: any) => [`₹${(Number(value) || 0).toLocaleString()}`, 'Expenses']}
          />
          <Bar
            dataKey="expenses"
            fill="url(#expenseGradient)"
            name="Expenses"
            radius={[6, 6, 0, 0]}
            barSize={data.length > 10 ? undefined : 45}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeExpensesChart;