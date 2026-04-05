'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  Target,
  ChevronRight,
  PieChart,
  IndianRupee,
  Wallet,
  Info,
  RefreshCcw
} from 'lucide-react';
import { apiCall } from '../lib/api';

// --- Types ---
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

// --- Card Components ---

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ title, icon: Icon, accentColor }: { title: string, icon: any, accentColor: string }) => (
  <div className="flex items-center gap-4 mb-8">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accentColor}`}>
      <Icon size={22} />
    </div>
    <h3 className="text-xl font-bold tracking-tight text-gray-900">{title}</h3>
  </div>
);

// --- ProgressBar Component ---
const ProgressBar = ({ label, value, max, colorClass }: { label: string, value: number, max: number, colorClass: string }) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-gray-400">
        <span>{label}</span>
        <span>₹{value.toLocaleString('en-IN')} / ₹{max.toLocaleString('en-IN')}</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// --- Main Component ---

export default function AIInsightsPage() {
  const [useOverspending, setUseOverspending] = useState(true);
  const [analysis, setAnalysis] = useState<AIInsightResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem("userId");
      console.log("🔍 Wealth AI Requesting Insights for UserID:", userId);
      
      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }

      // We call the real backend AI Insights API
      const result = await apiCall(`api/ai/insights/${userId}`, {
        method: "POST"
      });

      setAnalysis(result);
    } catch (err: any) {
        console.error("Fetch AI Insights error:", err);
        setError(err.message || "Failed to connect with Wealth AI.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const healthScore = useMemo(() => {
    if (!analysis) return 0;
    const { metrics } = analysis;
    if (metrics.total_expenses > metrics.salary) return 42;
    if (metrics.surplus < (metrics.salary * 0.1)) return 68;
    return 85;
  }, [analysis]);

  const surplusRatio = useMemo(() => {
    if (!analysis) return 0;
    const { metrics } = analysis;
    return ((metrics.surplus / metrics.salary) * 100).toFixed(1);
  }, [analysis]);

  if (loading) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-20 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <SparkleIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-pulse" size={24} />
        </div>
        <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900">Consulting Wealth AI...</h3>
            <p className="text-gray-500 text-sm italic">Analyzing your spending trajectory and market cycles.</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-20 text-center">
        <div className="bg-red-50 p-6 rounded-full text-red-500 mb-6">
            <AlertTriangle size={48} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Connection Issues</h3>
        <p className="text-gray-500 mb-8 max-w-md">{error || "AI Insights are currently unavailable for your current account data state."}</p>
        <button 
           onClick={fetchInsights}
           className="px-6 py-3 bg-zinc-800 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-700 transition-all active:scale-95"
        >
            <RefreshCcw size={18} /> Retry Connection
        </button>
      </div>
    );
  }

  const { metrics, insights, suggestions, investmentAdvice, title } = analysis;
  const isOverspending = metrics.total_expenses > metrics.salary;
  const isLowSurplus = !isOverspending && (metrics.surplus < metrics.salary * 0.1);

  return (
    <div className="min-h-full">
        <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">

          {/* Dashboard Title & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-gray-100 pb-10">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-md">Live Platform Analysis</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">{title || "AI Deep Insights"}</h1>
              <p className="text-gray-500 font-medium">Smart financial auditing with real-time feedback loops. Data sourced from your recent transactions.</p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={fetchInsights}
                className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-zinc-800 hover:text-white transition-all shadow-sm border border-gray-100"
                title="Refresh analysis"
              >
                <RefreshCcw size={18} />
              </button>
            </div>
          </div>

          {/* 1. Top Alert Card */}
          {(isOverspending || isLowSurplus) && (
            <div className={`group rounded-[2rem] p-8 border flex items-start gap-6 transition-all duration-500 animate-in slide-in-from-top-4 ${isOverspending
                ? 'bg-red-50/50 border-red-100/50'
                : 'bg-amber-50/50 border-amber-100/50'
              }`}>
              <div className={`p-4 rounded-2xl shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-inner ${isOverspending ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                {isOverspending ? <AlertTriangle size={28} /> : <Info size={28} />}
              </div>
              <div>
                <h2 className={`text-xl font-bold tracking-tight ${isOverspending ? 'text-red-900' : 'text-amber-900'}`}>
                  {isOverspending ? 'Critical Overspending Alert' : 'Low Component Surplus'}
                </h2>
                <p className={`text-[15px] mt-2 leading-relaxed font-medium ${isOverspending ? 'text-red-800/70' : 'text-amber-800/70'}`}>
                  {isOverspending
                    ? `System analysis indicates your current monthly burn of ₹${metrics.total_expenses.toLocaleString('en-IN')} is exceeding your income. This trajectory will deplete cash reserves by ₹${Math.abs(metrics.surplus).toLocaleString('en-IN')} each month.`
                    : `Your current surplus (₹${metrics.surplus.toLocaleString('en-IN')}) is below the recommended 10% safety threshold. Maintaining this at ${surplusRatio}% slows down long-term wealth compounding.`
                  }
                </p>
                <button className={`mt-5 text-sm font-bold flex items-center gap-1.5 transition-opacity hover:opacity-80 ${isOverspending ? 'text-red-600' : 'text-amber-600'}`}>
                  Audit Transaction Flow <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* 2. Insights Card */}
            <Card className="p-10">
              <CardHeader
                title="Strategic Insights"
                icon={PieChart}
                accentColor="bg-gray-100 text-gray-700 border border-gray-200"
              />
              <ul className="space-y-6">
                {insights.map((insight: string, idx: number) => (
                  <li key={idx} className="flex gap-4 text-gray-600 leading-relaxed font-medium">
                    <div className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    <span className="text-[16px]">{insight}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* 3. Suggestions Card */}
            <Card className="p-10">
              <CardHeader
                title="Optimizations"
                icon={Lightbulb}
                accentColor="bg-blue-50 text-blue-600 border border-blue-100"
              />
              <ul className="space-y-6">
                {suggestions.map((suggestion: string, idx: number) => (
                  <li key={idx} className="flex gap-4 text-gray-600 leading-relaxed font-medium group cursor-default">
                    <div className="mt-1 flex items-center justify-center shrink-0 w-5 h-5 rounded-full bg-blue-50 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                      <ChevronRight size={12} />
                    </div>
                    <span className="text-[16px]">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* 4. Investment Advice Card - Full Width */}
            <Card className="p-10 md:col-span-2">
              <CardHeader
                title="Investment & Capital Strategy"
                icon={Target}
                accentColor="bg-emerald-50 text-emerald-600 border border-emerald-100"
              />
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                <div className="lg:col-span-3">
                  <ul className="space-y-8">
                    {investmentAdvice.map((item: string, idx: number) => (
                      <li key={idx} className="flex gap-4 items-start group">
                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity">
                          <TrendingUp size={18} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[16px] font-semibold text-gray-800 leading-relaxed">{item}</p>
                          <p className="text-sm text-gray-400 font-medium">Automatic advisory based on current liquidity.</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual Feedback Section */}
                <div className="lg:col-span-2 flex flex-col justify-between space-y-8 bg-gray-50/50 rounded-[2rem] p-8 border border-gray-100">
                  <div className="space-y-6">
                    <div className="flex items-end justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Health Index</span>
                        <h4 className="text-3xl font-black text-gray-900">
                          {healthScore}%
                        </h4>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${healthScore < 50 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {healthScore < 50 ? 'Critical' : healthScore < 80 ? 'Stable' : 'Excellent'}
                      </span>
                    </div>

                    <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-[1.5s] ease-out shadow-[0_0_12px_rgba(16,185,129,0.3)] ${healthScore < 50 ? 'bg-red-500' : 'bg-emerald-500'}`}
                        style={{ width: `${healthScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-6 pt-4 border-t border-gray-200">
                    <ProgressBar
                      label="Top Category Burn"
                      value={metrics.category_expenses[0]?.amount || 0}
                      max={metrics.total_expenses || 1}
                      colorClass="bg-blue-500"
                    />
                    <ProgressBar
                      label="Investment Ratio"
                      value={metrics.investments || 0}
                      max={metrics.salary || 1}
                      colorClass="bg-emerald-400"
                    />
                  </div>

                  <p className="text-[11px] text-gray-400 font-medium flex items-center gap-2">
                    <Info size={12} className="shrink-0" />
                    Confidence: 94%. Insights refreshed recently.
                  </p>
                </div>
              </div>
            </Card>

          </div>

          {/* Quick Metrics Ticker */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Surplus', value: `₹${metrics.surplus.toLocaleString('en-IN')}`, icon: IndianRupee, color: metrics.surplus < 0 ? 'text-red-500' : 'text-emerald-500' },
              { label: 'Ratio', value: `${surplusRatio}%`, icon: Wallet, color: 'text-gray-900' },
              { label: 'Invested', value: `₹${metrics.investments.toLocaleString('en-IN')}`, icon: Target, color: 'text-gray-900' },
              { label: 'Growth', value: '+12.4%', icon: TrendingUp, color: 'text-emerald-500' },
            ].map((metric, i) => (
              <div key={metric.label} className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <metric.icon size={16} className="text-gray-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{metric.label}</span>
                </div>
                <p className={`text-xl font-bold tracking-tight ${metric.color}`}>
                  {metric.value}
                </p>
              </div>
            ))}
          </div>

          {/* Updated Footer to match Brand Color */}
          <div className="relative overflow-hidden bg-zinc-800 rounded-[2.5rem] p-10 text-white border border-white/5 shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left space-y-2">
                <h4 className="text-2xl font-bold italic tracking-tight">Wealth AI Orchestrator</h4>
                <p className="text-gray-400 text-sm font-medium">Continuously learning from your spending patterns to optimize your net worth velocity.</p>
              </div>
              <button 
                onClick={fetchInsights}
                className="px-8 py-4 bg-white text-black font-black text-sm uppercase tracking-widest rounded-full hover:bg-gray-100 transition-all active:scale-95 shadow-xl"
              >
                Apply All Strategies
              </button>
            </div>
          </div>

        </div>
    </div>
  );
}

const SparkleIcon = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);
