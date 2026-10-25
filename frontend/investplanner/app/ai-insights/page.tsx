'use client';

import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  Target,
  ChevronRight,
  PieChart,
  IndianRupee,
  Wallet,
  RefreshCcw,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { apiCall } from '../lib/api';
import { InsightCard } from './InsightCard';

interface CategoryExpense {
  category: string;
  amount: number;
}

interface FinancialData {
  salary: number;
  total_expenses: number;
  category_expenses: CategoryExpense[];
  investments: number;
  surplus: number;
}

interface AIInsightResult {
  title: string;
  insights: string[];
  suggestions: string[];
  investmentAdvice: string[];
  metrics: FinancialData;
}

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`bg-white rounded-2xl border border-neutral-200/90 shadow-sm transition-all hover:shadow-md ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({
  title,
  icon: Icon,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-neutral-100 text-neutral-900">
      <Icon size={16} />
    </div>
    <h3 className="text-base font-semibold tracking-tight text-neutral-950">{title}</h3>
  </div>
);

const ProgressBar = ({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1.5 font-mono">
      <div className="flex justify-between text-[11px] text-neutral-500">
        <span>{label}</span>
        <span>
          ₹{value.toLocaleString('en-IN')} / ₹{max.toLocaleString('en-IN')}
        </span>
      </div>
      <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 bg-neutral-950"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default function AIInsightsPage() {
  const [analysis, setAnalysis] = useState<AIInsightResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found. Please log in again to generate your audit.');
      }

      const result = await apiCall(`ai/insights/${userId}`, {
        method: 'POST',
      });
      setAnalysis(result);
    } catch (err) {
      console.error('Fetch AI Insights error:', err);
      const message = err instanceof Error ? err.message : 'Failed to generate audit.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const healthScore = useMemo(() => {
    if (!analysis) return 0;
    const { metrics } = analysis;
    if (metrics.total_expenses > metrics.salary) return 42;
    if (metrics.surplus < metrics.salary * 0.1) return 68;
    return 85;
  }, [analysis]);

  const surplusRatio = useMemo(() => {
    if (!analysis) return 0;
    const { metrics } = analysis;
    if (metrics.salary <= 0) return '0.0';
    return ((metrics.surplus / metrics.salary) * 100).toFixed(1);
  }, [analysis]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4 text-center">
        <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin" />
        <h3 className="text-base font-semibold text-neutral-950 mt-2">
          Consulting Wealth AI...
        </h3>
        <p className="font-mono text-xs text-neutral-400 max-w-md">
          Auditing incomes, outflows, categories, and ceilings through Gemini to prepare your personalized analysis.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-3">
        <div className="p-3 bg-neutral-100 rounded-xl text-neutral-800">
          <AlertTriangle size={24} />
        </div>
        <h3 className="text-base font-semibold text-neutral-950">Report Generation Interrupted</h3>
        <p className="font-mono text-xs text-neutral-500 max-w-md">{error}</p>
        <button
          onClick={fetchInsights}
          className="px-5 py-2.5 bg-black text-white rounded-lg font-mono text-xs hover:bg-neutral-800 transition active:scale-95 cursor-pointer"
        >
          <RefreshCcw size={14} className="inline mr-2" /> Retry Generation
        </button>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="max-w-5xl mx-auto py-8 space-y-8">
        {/* Hero Introduction Section */}
        <div className="bg-neutral-950 rounded-2xl p-8 sm:p-12 text-white border border-neutral-800 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
            <span className="px-3 py-1 bg-white/10 text-white uppercase tracking-wider rounded-full border border-white/15 flex items-center gap-1.5">
              <Sparkles size={11} />
              Gemini 3.8 Flash Engine
            </span>
            <span className="px-3 py-1 bg-white/5 text-neutral-300 uppercase tracking-wider rounded-full border border-white/10 flex items-center gap-1.5">
              <ShieldCheck size={11} />
              Live Ledger Audit
            </span>
          </div>

          <div className="space-y-2 max-w-2xl">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              AI Financial Health &amp; Wealth Intelligence
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Connect your actual ledger income streams, outflows, categories, and ceilings to Gemini AI to receive an objective, deep financial audit.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              onClick={fetchInsights}
              className="px-6 py-2.5 bg-white hover:bg-neutral-100 text-black font-medium text-xs rounded-full transition shadow-sm cursor-pointer flex items-center gap-2 group"
            >
              <span>Generate AI Financial Report</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <span className="font-mono text-[10px] text-neutral-400">
              Takes ~2 seconds • Isolated to your ledger
            </span>
          </div>
        </div>

        {/* 4 Feature Audit Pillars */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
            What This Report Analyzes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-sm space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-900 flex items-center justify-center">
                <Wallet size={16} />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900">
                1. Cash Flow &amp; Burn Rate Audit
              </h3>
              <p className="font-mono text-xs text-neutral-500 leading-relaxed">
                Evaluates monthly deposits against outflows. Flags critical deficits and calculates reserves burn velocity.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-sm space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-900 flex items-center justify-center">
                <PieChart size={16} />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900">
                2. Category Outflow Optimization
              </h3>
              <p className="font-mono text-xs text-neutral-500 leading-relaxed">
                Aggregates deductions by category and delivers targeted recommendations on where to curb spending.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-sm space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-900 flex items-center justify-center">
                <Target size={16} />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900">
                3. Capital Growth &amp; Investment Strategy
              </h3>
              <p className="font-mono text-xs text-neutral-500 leading-relaxed">
                Calculates investable surplus and provides concrete allocation guidance across equities, mutual funds, and defensive hedges.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-sm space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-900 flex items-center justify-center">
                <TrendingUp size={16} />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900">
                4. Quantitative Health Index (0–100)
              </h3>
              <p className="font-mono text-xs text-neutral-500 leading-relaxed">
                Provides an instant quantitative index and net worth velocity tag reflecting overall financial stability.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { metrics, insights, suggestions, investmentAdvice, title } = analysis;
  const isOverspending = metrics.total_expenses > metrics.salary;
  const isLowSurplus = !isOverspending && metrics.surplus < metrics.salary * 0.1;

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-neutral-200/60">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
            Autonomous Audit
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 mt-0.5">
            {title || 'AI Deep Insights'}
          </h1>
        </div>

        <button
          onClick={fetchInsights}
          className="px-4 py-2 rounded-lg bg-black text-white hover:bg-neutral-800 transition shadow-sm flex items-center gap-1.5 text-xs font-mono cursor-pointer"
        >
          <RefreshCcw size={13} />
          <span>Re-generate Audit</span>
        </button>
      </div>

      <InsightCard />

      {/* Alert Card if any */}
      {(isOverspending || isLowSurplus) && (
        <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-sm flex items-start gap-3">
          <div className="p-2 rounded-lg bg-neutral-100 text-neutral-800 shrink-0">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-neutral-900">
              {isOverspending ? 'Critical Overspending Alert' : 'Low Component Surplus'}
            </h2>
            <p className="text-xs text-neutral-500 mt-1 font-mono leading-relaxed">
              {isOverspending
                ? `Current monthly burn of ₹${metrics.total_expenses.toLocaleString('en-IN')} exceeds income. Deficit: ₹${Math.abs(metrics.surplus).toLocaleString('en-IN')}/mo.`
                : `Current surplus of ₹${metrics.surplus.toLocaleString('en-IN')} is below the 10% safety ceiling.`}
            </p>
          </div>
        </div>
      )}

      {/* Main Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <CardHeader title="Strategic Insights" icon={PieChart} />
          <ul className="space-y-3 font-mono text-xs text-neutral-700">
            {insights.map((insight: string, idx: number) => (
              <li key={idx} className="flex gap-2.5 items-start leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 shrink-0" />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <CardHeader title="Optimizations" icon={Lightbulb} />
          <ul className="space-y-3 font-mono text-xs text-neutral-700">
            {suggestions.map((suggestion: string, idx: number) => (
              <li key={idx} className="flex gap-2 items-start leading-relaxed">
                <ChevronRight size={13} className="mt-0.5 shrink-0 text-neutral-400" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 md:col-span-2">
          <CardHeader title="Investment & Capital Strategy" icon={Target} />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3 space-y-3">
              {investmentAdvice.map((item: string, idx: number) => (
                <div
                  key={idx}
                  className="flex gap-2.5 items-start p-3 bg-neutral-50 rounded-xl border border-neutral-200/60 font-mono text-xs text-neutral-800"
                >
                  <TrendingUp size={15} className="mt-0.5 shrink-0 text-neutral-900" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2 bg-neutral-50 rounded-xl p-5 border border-neutral-200/80 space-y-4 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-neutral-400">Health Index</span>
                <span className="text-2xl font-bold text-neutral-950">{healthScore}%</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-neutral-950 rounded-full"
                  style={{ width: `${healthScore}%` }}
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-neutral-200/60">
                <ProgressBar
                  label="Category Outflows"
                  value={metrics.category_expenses[0]?.amount || 0}
                  max={metrics.total_expenses || 1}
                />
                <ProgressBar
                  label="Investment Allocation"
                  value={metrics.investments || 0}
                  max={metrics.salary || 1}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Metrics Ticker */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
        {[
          {
            label: 'Surplus',
            value: `₹${metrics.surplus.toLocaleString('en-IN')}`,
            icon: IndianRupee,
          },
          { label: 'Ratio', value: `${surplusRatio}%`, icon: Wallet },
          {
            label: 'Invested',
            value: `₹${metrics.investments.toLocaleString('en-IN')}`,
            icon: Target,
          },
          {
            label: 'Growth Status',
            value: isOverspending ? 'Deficit' : 'Positive',
            icon: TrendingUp,
          },
        ].map((metric) => (
          <div
            key={metric.label}
            className="bg-white p-4 rounded-xl border border-neutral-200/90 shadow-sm flex flex-col gap-1.5"
          >
            <div className="flex justify-between items-start text-neutral-400">
              <span className="text-[9px] uppercase tracking-wider">{metric.label}</span>
              <metric.icon size={13} />
            </div>
            <p className="text-base font-semibold text-neutral-950 mt-1">{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
