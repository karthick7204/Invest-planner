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
  Info,
  RefreshCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { apiCall } from '../lib/api';
import { InsightCard } from './InsightCard';

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
  const [analysis, setAnalysis] = useState<AIInsightResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem("userId");
      console.log("🔍 Wealth AI Requesting Insights for UserID:", userId);

      if (!userId) {
        throw new Error("User ID not found. Please log in again to generate your report.");
      }

      // Call the authenticated backend AI Insights API
      const result = await apiCall(`ai/insights/${userId}`, {
        method: "POST",
      });

      console.log("💎 Wealth AI Response Data:", result);
      setAnalysis(result);
    } catch (err: any) {
      console.error("Fetch AI Insights error:", err);
      setError(err.message || "Failed to generate report from Wealth AI.");
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
    if (metrics.salary <= 0) return "0.0";
    return ((metrics.surplus / metrics.salary) * 100).toFixed(1);
  }, [analysis]);

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-8 sm:p-20 space-y-6 text-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 animate-pulse" size={28} />
        </div>
        <div className="space-y-2 max-w-md">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Consulting Wealth AI...</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Auditing your MongoDB incomes, expenses, categories, and transactions through Google Gemini to prepare your personalized financial audit.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          Analyzing cash flow & capital growth potential
        </div>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-8 sm:p-20 text-center">
        <div className="bg-red-50 p-6 rounded-full text-red-500 mb-6 border border-red-100 shadow-inner">
          <AlertTriangle size={48} />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">Report Generation Issue</h3>
        <p className="text-gray-500 mb-8 max-w-md text-sm leading-relaxed">{error}</p>
        <button
          onClick={fetchInsights}
          className="px-8 py-3.5 bg-zinc-900 text-white rounded-2xl font-black text-sm flex items-center gap-2.5 hover:bg-zinc-800 transition-all active:scale-95 shadow-xl shadow-gray-200"
        >
          <RefreshCcw size={16} /> Retry Report Generation
        </button>
      </div>
    );
  }

  // 3. Initial Introduction State (Before User Clicks Generate)
  if (!analysis) {
    return (
      <div className="min-h-full">
        <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
          {/* Hero Introduction Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-black rounded-[2.5rem] p-8 sm:p-14 text-white border border-zinc-800 shadow-2xl">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 space-y-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/15 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-amber-400" />
                  Gemini 3.8 Flash Engine
                </span>
                <span className="px-3.5 py-1 bg-emerald-500/15 text-emerald-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                  <ShieldCheck size={12} />
                  MongoDB Live Sync
                </span>
              </div>

              <div className="space-y-4 max-w-3xl">
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                  AI Financial Health & Wealth Intelligence
                </h1>
                <p className="text-zinc-300 text-base sm:text-lg leading-relaxed font-medium">
                  Welcome to your personalized Wealth Intelligence dashboard. Connect your actual MongoDB income streams, daily expenses, spending categories, and budgets to Gemini AI to receive an objective, deep financial audit.
                </p>
              </div>

              {/* Call-to-Action Generate Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  onClick={fetchInsights}
                  className="w-full sm:w-auto px-9 py-4 bg-white text-black font-black text-sm uppercase tracking-wider rounded-2xl hover:bg-gray-100 transition-all active:scale-95 shadow-2xl shadow-white/20 flex items-center justify-center gap-3 cursor-pointer group"
                >
                  <Sparkles size={18} className="text-amber-500 group-hover:rotate-12 transition-transform" />
                  Generate AI Financial Report
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <span className="text-xs text-zinc-400 font-medium">
                  Takes ~2-3 seconds • Safe & isolated to your account
                </span>
              </div>
            </div>
          </div>

          {/* What This Report Analyzes - 4 Feature Cards */}
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-tight text-gray-900">What This Report Analyzes</h2>
              <p className="text-gray-500 text-sm font-medium">
                Our AI model conducts a holistic 4-pillar financial audit on your live account data:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feature 1 */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <Wallet size={24} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight">1. Cash Flow & Burn Rate Audit</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium">
                    Evaluates your total monthly salary against total outflows. If expenses exceed income, it flags critical deficits and calculates your monthly reserve burn rate.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <PieChart size={24} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight">2. Category Spending Optimization</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium">
                    Aggregates expenses by category (Rent, Food, Transport, Shopping) and delivers targeted ₹ recommendations on which categories to curb to recover monthly surplus.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <Target size={24} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight">3. Capital Growth & Investment Strategy</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium">
                    Calculates your exact investable surplus and provides concrete asset allocation guidance across equity (stocks), mutual funds, and defensive hedges (gold).
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                  <TrendingUp size={24} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight">4. Financial Health Score (0–100)</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium">
                    Provides an instant quantitative index and net worth velocity tag (Accelerating, Stable, or Retracting) reflecting your overall financial stability.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Banner */}
          <div className="bg-gray-50 border border-gray-200/70 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-black uppercase tracking-wider text-gray-500">
                <Zap size={14} className="text-amber-500" /> Instant Generation
              </div>
              <h4 className="text-xl font-black text-gray-900">Ready to audit your finances?</h4>
              <p className="text-gray-500 text-sm font-medium">Click the button to run the AI engine against your live account data.</p>
            </div>
            <button
              onClick={fetchInsights}
              className="w-full md:w-auto px-8 py-3.5 bg-black text-white font-black text-sm uppercase tracking-wider rounded-2xl hover:bg-gray-800 transition-all active:scale-95 shadow-xl shrink-0 cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles size={16} className="text-amber-400" />
              Generate Report Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Generated Report View
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
              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-md border border-blue-100">
                Live Platform Analysis
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-md border border-emerald-100">
                Audit Ready
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900">{title || "AI Deep Insights"}</h1>
            <p className="text-gray-500 font-medium">
              Smart financial auditing with real-time feedback loops. Sourced directly from your MongoDB database.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchInsights}
              className="px-5 py-2.5 rounded-2xl bg-black text-white hover:bg-gray-800 transition-all shadow-md flex items-center gap-2 text-sm font-bold active:scale-95 cursor-pointer"
              title="Regenerate analysis with latest data"
            >
              <RefreshCcw size={16} />
              Re-generate Report
            </button>
          </div>
        </div>

        <InsightCard />

        {/* 1. Top Alert Card */}
        {(isOverspending || isLowSurplus) && (
          <div
            className={`group rounded-[2rem] p-8 border flex items-start gap-6 transition-all duration-500 animate-in slide-in-from-top-4 ${
              isOverspending ? 'bg-red-50/50 border-red-100/50' : 'bg-amber-50/50 border-amber-100/50'
            }`}
          >
            <div
              className={`p-4 rounded-2xl shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-inner ${
                isOverspending ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
              }`}
            >
              {isOverspending ? <AlertTriangle size={28} /> : <Info size={28} />}
            </div>
            <div>
              <h2 className={`text-xl font-bold tracking-tight ${isOverspending ? 'text-red-900' : 'text-amber-900'}`}>
                {isOverspending ? 'Critical Overspending Alert' : 'Low Component Surplus'}
              </h2>
              <p className={`text-[15px] mt-2 leading-relaxed font-medium ${isOverspending ? 'text-red-800/70' : 'text-amber-800/70'}`}>
                {isOverspending
                  ? `System analysis indicates your current monthly burn of ₹${metrics.total_expenses.toLocaleString('en-IN')} is exceeding your income. This trajectory will deplete cash reserves by ₹${Math.abs(metrics.surplus).toLocaleString('en-IN')} each month.`
                  : `Your current surplus (₹${metrics.surplus.toLocaleString('en-IN')}) is below the recommended 10% safety threshold. Maintaining this at ${surplusRatio}% slows down long-term wealth compounding.`}
              </p>
              <button
                className={`mt-5 text-sm font-bold flex items-center gap-1.5 transition-opacity hover:opacity-80 ${
                  isOverspending ? 'text-red-600' : 'text-amber-600'
                }`}
              >
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
                      <h4 className="text-3xl font-black text-gray-900">{healthScore}%</h4>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-md ${
                        healthScore < 50
                          ? 'bg-red-100 text-red-600'
                          : healthScore < 80
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-emerald-100 text-emerald-600'
                      }`}
                    >
                      {healthScore < 50 ? 'Critical' : healthScore < 80 ? 'Stable' : 'Excellent'}
                    </span>
                  </div>

                  <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-[1.5s] ease-out shadow-[0_0_12px_rgba(16,185,129,0.3)] ${
                        healthScore < 50 ? 'bg-red-500' : 'bg-emerald-500'
                      }`}
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
                  Live calculation based on your MongoDB transactions.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Metrics Ticker */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Surplus',
              value: `₹${metrics.surplus.toLocaleString('en-IN')}`,
              icon: IndianRupee,
              color: metrics.surplus < 0 ? 'text-red-500' : 'text-emerald-500',
            },
            { label: 'Ratio', value: `${surplusRatio}%`, icon: Wallet, color: 'text-gray-900' },
            {
              label: 'Invested',
              value: `₹${metrics.investments.toLocaleString('en-IN')}`,
              icon: Target,
              color: 'text-gray-900',
            },
            { label: 'Growth Status', value: isOverspending ? 'Deficit' : 'Positive', icon: TrendingUp, color: isOverspending ? 'text-red-500' : 'text-emerald-500' },
          ].map((metric) => (
            <div key={metric.label} className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <metric.icon size={16} className="text-gray-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{metric.label}</span>
              </div>
              <p className={`text-xl font-bold tracking-tight ${metric.color}`}>{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Footer Orchestrator Card */}
        <div className="relative overflow-hidden bg-zinc-800 rounded-[2.5rem] p-10 text-white border border-white/5 shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left space-y-2">
              <h4 className="text-2xl font-bold italic tracking-tight">Wealth AI Orchestrator</h4>
              <p className="text-gray-400 text-sm font-medium">
                Continuously learning from your spending patterns to optimize your net worth velocity.
              </p>
            </div>
            <button
              onClick={fetchInsights}
              className="px-8 py-4 bg-white text-black font-black text-sm uppercase tracking-widest rounded-full hover:bg-gray-100 transition-all active:scale-95 shadow-xl cursor-pointer"
            >
              Re-run Analysis
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
