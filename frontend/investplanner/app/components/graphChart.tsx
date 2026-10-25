'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
  dataKey?: 'day' | 'name';
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
  height = 360,
  dataKey = 'day',
}) => {
  return (
    <div className="w-full h-full bg-white">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 10, left: 10, bottom: 10 }}
          barCategoryGap="25%"
        >
          <defs>
            <linearGradient id="monochromeBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a0a0a" stopOpacity={1} />
              <stop offset="100%" stopColor="#262626" stopOpacity={0.85} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey={dataKey}
            tick={{ fill: '#737373', fontSize: 11, fontFamily: 'monospace' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#737373', fontSize: 11, fontFamily: 'monospace' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0a0a0a',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              padding: '8px 12px',
              fontFamily: 'monospace',
              fontSize: '11px',
              color: '#ffffff',
            }}
            cursor={{ fill: 'rgba(0, 0, 0, 0.03)' }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => [
              `₹${(Number(value) || 0).toLocaleString()}`,
              'Expenses',
            ]}
          />
          <Bar
            dataKey="expenses"
            fill="url(#monochromeBarGradient)"
            name="Expenses"
            radius={[4, 4, 0, 0]}
            barSize={data.length > 10 ? undefined : 36}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeExpensesChart;