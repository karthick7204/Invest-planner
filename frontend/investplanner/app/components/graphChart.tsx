'use client';

import React, { useState, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
} from 'recharts';

export interface ChartData {
  day?: string;
  name?: string;
  category?: string;
  expenses: number;
  percentage?: number;
  color?: string;
}

export interface IncomeExpensesChartProps {
  data?: ChartData[];
  title?: string;
  height?: number;
  isSampleData?: boolean;
}

const CATEGORY_COLOR_MAP: Record<string, string> = {
  dining: '#f97316',
  food: '#f97316',
  transport: '#3b82f6',
  travel: '#06b6d4',
  shopping: '#ec4899',
  utilities: '#6366f1',
  bills: '#6366f1',
  work: '#0f172a',
  health: '#10b981',
  entertainment: '#8b5cf6',
  groceries: '#14b8a6',
  education: '#eab308',
  personal: '#d946ef',
  home: '#64748b',
  other: '#94a3b8',
};

const FALLBACK_PALETTE = [
  '#0f172a',
  '#6366f1',
  '#10b981',
  '#f59e0b',
  '#ec4899',
  '#06b6d4',
  '#8b5cf6',
  '#f97316',
  '#14b8a6',
  '#3b82f6',
  '#84cc16',
  '#64748b',
];

const DEFAULT_CATEGORY_DATA: ChartData[] = [
  { name: 'Shopping', expenses: 4250 },
  { name: 'Dining', expenses: 2850 },
  { name: 'Utilities', expenses: 1950 },
  { name: 'Transport', expenses: 1400 },
  { name: 'Entertainment', expenses: 950 },
  { name: 'Health', expenses: 600 },
];

export const IncomeExpensesChart: React.FC<IncomeExpensesChartProps> = ({
  data,
  height = 360,
  isSampleData = false,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Process data with formatted names, values, colors, and percentages
  const processedData = useMemo(() => {
    const rawItems = data && data.length > 0 ? data : DEFAULT_CATEGORY_DATA;
    const total = rawItems.reduce(
      (sum, item) => sum + (Number(item.expenses) || 0),
      0
    );

    return rawItems
      .map((item, index) => {
        const rawName = item.category || item.name || item.day || 'Other';
        const formattedName =
          rawName.charAt(0).toUpperCase() + rawName.slice(1);
        const lowerName = rawName.toLowerCase();
        const value = Math.max(0, Number(item.expenses) || 0);
        const percentage =
          total > 0 ? Number(((value / total) * 100).toFixed(1)) : 0;
        const color =
          CATEGORY_COLOR_MAP[lowerName] ||
          FALLBACK_PALETTE[index % FALLBACK_PALETTE.length];

        return {
          name: formattedName,
          category: formattedName,
          expenses: value,
          value,
          percentage,
          color,
        };
      })
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [data]);

  const totalExpenses = useMemo(() => {
    return processedData.reduce((acc, curr) => acc + curr.value, 0);
  }, [processedData]);

  // Active slice hover renderer with outer expansion and subtle halo
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
      props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 9}
          outerRadius={outerRadius + 12}
          fill={fill}
          opacity={0.3}
        />
      </g>
    );
  };

  // Custom slice label showing percentage on slices >= 5%
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    if (!percent || percent < 0.05) return null; // Show on slices >= 5%
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#ffffff"
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontFamily: 'monospace',
          fontSize: '11px',
          fontWeight: 700,
          pointerEvents: 'none',
          textShadow: '0 1px 3px rgba(0,0,0,0.7)',
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const activeCategory =
    activeIndex !== null && processedData[activeIndex]
      ? processedData[activeIndex]
      : null;

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {isSampleData && (
        <div className="mb-3 px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200/80 flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <span>Sample category distribution preview</span>
          <span className="text-neutral-400">Add expenses to personalize</span>
        </div>
      )}

      <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left/Center: Interactive Pie/Donut Chart with Center Readout */}
        <div
          className="relative flex items-center justify-center w-full lg:w-1/2 shrink-0"
          style={{ height }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeShape={renderActiveShape}
                data={processedData}
                cx="50%"
                cy="50%"
                innerRadius={76}
                outerRadius={114}
                paddingAngle={3}
                cornerRadius={5}
                dataKey="value"
                nameKey="name"
                label={renderCustomizedLabel}
                labelLine={false}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {processedData.map((entry, index) => {
                  const isHovered = activeIndex === index;
                  return (
                    <Cell
                      key={`pie-cell-${index}`}
                      fill={entry.color}
                      stroke={isHovered ? '#0a0a0a' : '#ffffff'}
                      strokeWidth={isHovered ? 3 : 2}
                      className="transition-all duration-200 cursor-pointer"
                      opacity={activeIndex !== null && !isHovered ? 0.65 : 1}
                    />
                  );
                })}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.35)',
                  padding: '10px 14px',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  color: '#ffffff',
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any, name: any, item: any) => {
                  const pct =
                    item?.payload?.percentage ??
                    (totalExpenses > 0
                      ? ((Number(value) / totalExpenses) * 100).toFixed(1)
                      : 0);
                  return [
                    `₹${Number(value).toLocaleString('en-IN')} (${pct}%)`,
                    name,
                  ];
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Central Info Badge Inside Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
            {activeCategory ? (
              <div className="animate-in fade-in zoom-in-95 duration-150 flex flex-col items-center max-w-[130px]">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: activeCategory.color }}
                  />
                  <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider truncate">
                    {activeCategory.name}
                  </span>
                </div>
                <p className="font-mono text-base font-bold text-neutral-950 tracking-tight leading-tight">
                  ₹{activeCategory.value.toLocaleString('en-IN')}
                </p>
                <span className="mt-1 font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full bg-neutral-900 text-white">
                  {activeCategory.percentage}%
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center max-w-[130px]">
                <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 font-medium">
                  Total Outflow
                </span>
                <p className="font-mono text-base font-bold text-neutral-950 tracking-tight leading-tight mt-0.5">
                  ₹{totalExpenses.toLocaleString('en-IN')}
                </p>
                <span className="font-mono text-[10px] text-neutral-400 mt-1">
                  {processedData.length} {processedData.length === 1 ? 'Category' : 'Categories'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Category Breakdown Legend with Percentages & Bars */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center gap-2 max-h-[360px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
            <span>Category</span>
            <div className="flex items-center gap-6">
              <span>Percentage</span>
              <span className="w-16 text-right">Amount</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 pt-1">
            {processedData.map((category, idx) => {
              const isHovered = activeIndex === idx;
              return (
                <div
                  key={`legend-${idx}`}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className={`flex flex-col p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                    isHovered
                      ? 'bg-neutral-100/90 shadow-sm'
                      : 'hover:bg-neutral-50/70'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-200"
                        style={{
                          backgroundColor: category.color,
                          transform: isHovered ? 'scale(1.25)' : 'scale(1)',
                        }}
                      />
                      <span
                        className={`truncate font-medium transition-colors ${
                          isHovered ? 'text-black font-semibold' : 'text-neutral-800'
                        }`}
                      >
                        {category.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 shrink-0 font-mono">
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-md font-semibold transition-colors ${
                          isHovered
                            ? 'bg-neutral-900 text-white'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {category.percentage}%
                      </span>
                      <span className="text-[11px] font-medium text-neutral-900 w-16 text-right">
                        ₹{category.value.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar showing category percentage share */}
                  <div className="w-full bg-neutral-100 rounded-full h-1 mt-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${Math.min(100, Math.max(2, category.percentage))}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeExpensesChart;