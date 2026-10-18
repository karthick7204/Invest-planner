'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Target,
  PieChart,
  IndianRupee,
  Wallet,
  Lightbulb,
  ShieldAlert,
  ArrowUpRight,
  FileText,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { TimeLine } from "../components/TimeLine";
import ReportGraph from "../components/reportGraph";
import CategoryBreakdown from "../components/categoryBreakdown";
import { ReportHeader } from "./reportHeader";
import { apiCall } from "../lib/api";

interface CategoryExpenseMetric {
  category: string;
  amount: number;
  percentageOfTotal: number;
  percentageOfIncome: number;
}

interface BudgetPerformanceMetric {
  category: string;
  limit: number;
  spent: number;
  remaining: number;
  isOverBudget: boolean;
  overspendAmount: number;
  utilizationPercent: number;
}

interface InvestmentMetrics {
  totalActualInvested: number;
  investableSurplus: number;
  suggestedSplit: {
    for_Stocks: number;
    for_Mutualfunds: number;
    for_Gold: number;
  };
  investmentRatio: number;
}

interface FinancialMetrics {
  totalIncome: number;
  totalExpenses: number;
  netSurplus: number;
  savingsRatio: number;
  expenseRatio: number;
  healthScore: number;
  netWorthVelocity: "Accelerating" | "Stable" | "Retracting";
  categoryExpenses: CategoryExpenseMetric[];
  investments: InvestmentMetrics;
  budgetMetrics: {
    totalBudgetLimit: number;
    totalBudgetSpent: number;
    overallUtilizationPercent: number;
    overspentCategories: string[];
    budgets: BudgetPerformanceMetric[];
  };
}

interface AIReportData {
  report: {
    title: string;
    generatedAt: string;
    healthScore: number;
    savingsRatio: number;
    netWorthVelocity: "Accelerating" | "Stable" | "Retracting";
    insights: string[];
    suggestions: string[];
    investmentAdvice: string[];
  };
  metrics: FinancialMetrics;
  summary: {
    incomeCount: number;
    expenseCount: number;
    transactionCount: number;
    budgetCount: number;
  };
}

export default function Reports() {
  const [range, setRange] = useState('monthly');
  const [activeTab, setActiveTab] = useState<'ai-report' | 'analytics'>('ai-report');
  const [reportData, setReportData] = useState<AIReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall('ai/report', {
        method: 'GET',
      });
      setReportData(response);
      try {
        sessionStorage.setItem('investplanner_ai_report', JSON.stringify(response));
      } catch (e) {
        // ignore storage errors
      }
    } catch (err: any) {
      console.error("Failed to fetch AI financial report:", err);
      setError(err.message || "Failed to load personalized AI financial report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if the user already generated a report in this browser session
    try {
      const cached = sessionStorage.getItem('investplanner_ai_report');
      if (cached) {
        setReportData(JSON.parse(cached));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleExport = () => {
    if (!reportData) {
      window.print();
      return;
    }

    const { report, metrics } = reportData;
    const dateFormatted = new Date(report.generatedAt).toLocaleString('en-IN');

    const content = `
=====================================================
INVEST PLANNER - PERSONALIZED FINANCIAL AUDIT REPORT
Generated via Gemini AI & MongoDB
Date: ${dateFormatted}
=====================================================

EXECUTIVE SUMMARY
Title: ${report.title}
Health Score: ${report.healthScore}/100
Savings Ratio: ${report.savingsRatio}%
Net Worth Velocity: ${report.netWorthVelocity}

KEY FINANCIAL METRICS
- Total Income: ₹${metrics.totalIncome.toLocaleString('en-IN')}
- Total Expenses: ₹${metrics.totalExpenses.toLocaleString('en-IN')}
- Net Surplus: ₹${metrics.netSurplus.toLocaleString('en-IN')}
- Savings Ratio: ${metrics.savingsRatio}%
- Expense Ratio: ${metrics.expenseRatio}%
- Actual Investments: ₹${metrics.investments.totalActualInvested.toLocaleString('en-IN')}
- Investable Surplus: ₹${metrics.investments.investableSurplus.toLocaleString('en-IN')}
- Overall Budget Utilization: ${metrics.budgetMetrics.overallUtilizationPercent}%

STRATEGIC AI INSIGHTS
${report.insights.map((ins, i) => `${i + 1}. ${ins}`).join('\n')}

EXPENSE OPTIMIZATIONS
${report.suggestions.map((sug, i) => `${i + 1}. ${sug}`).join('\n')}

INVESTMENT & CAPITAL STRATEGY
${report.investmentAdvice.map((adv, i) => `${i + 1}. ${adv}`).join('\n')}

RECOMMENDED SURPLUS ALLOCATION (50/30/20)
- Stocks (50%): ₹${metrics.investments.suggestedSplit.for_Stocks.toLocaleString('en-IN')}
- Mutual Funds (30%): ₹${metrics.investments.suggestedSplit.for_Mutualfunds.toLocaleString('en-IN')}
- Gold (20%): ₹${metrics.investments.suggestedSplit.for_Gold.toLocaleString('en-IN')}

TOP SPENDING CATEGORIES
${metrics.categoryExpenses.map((c) => `- ${c.category}: ₹${c.amount.toLocaleString('en-IN')} (${c.percentageOfTotal}% of total expenses)`).join('\n')}

=====================================================
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `InvestPlanner_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isOverspending = reportData ? reportData.metrics.totalExpenses > reportData.metrics.totalIncome : false;
  const hasOverspentBudgets = reportData ? reportData.metrics.budgetMetrics.overspentCategories.length > 0 : false;

  return (
    <div className="w-full max-w-6xl p-4 sm:p-6 lg:p-8 transition-all duration-300">
      <ReportHeader
        onExport={handleExport}
        onGenerate={fetchReport}
        hasReport={Boolean(reportData)}
        loading={loading}
      />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mt-8 p-1.5 bg-gray-100 rounded-2xl w-fit border border-gray-200/60">
        <button
          onClick={() => setActiveTab('ai-report')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all ${
            activeTab === 'ai-report'
              ? 'bg-black text-white shadow-md shadow-gray-300'
              : 'text-gray-600 hover:text-black hover:bg-white/60'
          }`}
        >
          <Sparkles size={16} className={activeTab === 'ai-report' ? 'text-amber-400' : 'text-gray-400'} />
          Gemini AI Audit
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all ${
            activeTab === 'analytics'
              ? 'bg-black text-white shadow-md shadow-gray-300'
              : 'text-gray-600 hover:text-black hover:bg-white/60'
          }`}
        >
          <BarChart3 size={16} />
          Visual Breakdown
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'ai-report' && (
        <div className="mt-8 space-y-8">
          {loading ? (
            <div className="w-full bg-white rounded-3xl p-12 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
              <div className="relative">
                <div className="w-14 h-14 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin" />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 animate-pulse" size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Auditing MongoDB Records with Gemini AI...</h3>
              <p className="text-gray-500 text-sm max-w-md">
                Aggregating your incomes, expenses, budgets, and transactions to generate personalized financial recommendations.
              </p>
            </div>
          ) : error ? (
            <div className="w-full bg-red-50/60 border border-red-200 rounded-3xl p-8 text-center space-y-4">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-red-950">AI Report Generation Failed</h3>
              <p className="text-red-700 text-sm max-w-lg mx-auto">{error}</p>
              <button
                onClick={fetchReport}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition active:scale-95 shadow-md shadow-red-200 cursor-pointer"
              >
                <RefreshCw size={16} />
                Retry AI Analysis
              </button>
            </div>
          ) : !reportData ? (
            /* On-Demand Generate Call-to-Action */
            <div className="relative overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-black rounded-[2.5rem] p-8 sm:p-14 text-white border border-zinc-800 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

              <div className="relative z-10 space-y-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3.5 py-1 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/15 flex items-center gap-1.5">
                    <Sparkles size={12} className="text-amber-400" />
                    Gemini 3.8 Flash AI
                  </span>
                  <span className="px-3.5 py-1 bg-emerald-500/15 text-emerald-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                    <CheckCircle2 size={12} />
                    On-Demand Generation
                  </span>
                </div>

                <div className="space-y-3 max-w-2xl">
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                    Generate Your AI Financial Audit
                  </h2>
                  <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-medium">
                    Run our AI auditor on demand against your live MongoDB records. Gemini will calculate your health score, audit category spending, detect cash leakages, and generate personalized 50/30/20 investment recommendations.
                  </p>
                </div>

                {/* 3 Pillar Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm space-y-2">
                    <div className="text-blue-400 flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                      <Lightbulb size={16} /> Strategic Insights
                    </div>
                    <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                      Uncover spending patterns, monthly burn rate, and financial stability velocity.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm space-y-2">
                    <div className="text-amber-400 flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                      <Target size={16} /> Expense Targets
                    </div>
                    <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                      Actionable ₹ targets to eliminate monthly category overspending.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm space-y-2">
                    <div className="text-emerald-400 flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                      <TrendingUp size={16} /> Capital Strategy
                    </div>
                    <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                      Optimized 50/30/20 portfolio split for stocks, mutual funds & gold hedges.
                    </p>
                  </div>
                </div>

                {/* Interactive Generate Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <button
                    onClick={fetchReport}
                    disabled={loading}
                    className="w-full sm:w-auto px-9 py-4 bg-white text-black font-black text-sm uppercase tracking-wider rounded-2xl hover:bg-gray-100 transition-all active:scale-95 shadow-2xl shadow-white/20 flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-50"
                  >
                    <Sparkles size={18} className="text-amber-500 group-hover:rotate-12 transition-transform" />
                    Generate AI Financial Report
                    <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                  <span className="text-xs text-zinc-400 font-medium">
                    On-demand trigger • Only runs when you click
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Overspending / Budget Alert Banner */}
              {(isOverspending || hasOverspentBudgets) && (
                <div
                  className={`p-6 rounded-3xl border flex items-start gap-4 transition-all ${
                    isOverspending
                      ? 'bg-red-50 border-red-200 text-red-900'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl shrink-0 ${
                      isOverspending ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                    }`}
                  >
                    <ShieldAlert size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {isOverspending
                        ? 'Cash Deficit Alert: Spending Exceeds Income'
                        : 'Budget Threshold Warning'}
                    </h3>
                    <p className="text-sm mt-1 leading-relaxed opacity-90">
                      {isOverspending
                        ? `Your total expenses of ₹${reportData.metrics.totalExpenses.toLocaleString(
                            'en-IN'
                          )} exceed your income of ₹${reportData.metrics.totalIncome.toLocaleString(
                            'en-IN'
                          )} by ₹${Math.abs(reportData.metrics.netSurplus).toLocaleString(
                            'en-IN'
                          )}. Implement the suggestions below to protect your capital.`
                        : `You have exceeded limits in the following budget categories: ${reportData.metrics.budgetMetrics.overspentCategories.join(
                            ', '
                          )}.`}
                    </p>
                  </div>
                </div>
              )}

              {/* Executive Summary Card */}
              <div className="w-full bg-gradient-to-br from-zinc-900 via-zinc-900 to-black text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden border border-zinc-800">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/10">
                        AI Executive Summary
                      </span>
                      <span className="text-xs text-zinc-400 font-medium">
                        Audit Date: {new Date(reportData.report.generatedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                      {reportData.report.title}
                    </h2>
                    <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                      Based on {reportData.summary.incomeCount} income records, {reportData.summary.expenseCount} expenses, and {reportData.summary.transactionCount} transactions in your MongoDB database.
                    </p>
                  </div>

                  {/* Health Score & Velocity Gauge */}
                  <div className="flex items-center gap-6 bg-white/5 border border-white/10 p-5 rounded-2xl shrink-0 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                        Health Score
                      </div>
                      <div className="text-4xl font-black text-white mt-1">
                        {reportData.report.healthScore}
                        <span className="text-sm font-normal text-zinc-400">/100</span>
                      </div>
                      <div className="mt-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            reportData.report.healthScore >= 75
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : reportData.report.healthScore >= 50
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {reportData.report.healthScore >= 75
                            ? 'Excellent'
                            : reportData.report.healthScore >= 50
                            ? 'Moderate'
                            : 'Needs Attention'}
                        </span>
                      </div>
                    </div>

                    <div className="h-12 w-px bg-white/10" />

                    <div className="text-center">
                      <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                        Velocity
                      </div>
                      <div className="text-lg font-black text-white mt-2 flex items-center justify-center gap-1">
                        {reportData.report.netWorthVelocity === 'Accelerating' ? (
                          <TrendingUp size={18} className="text-emerald-400" />
                        ) : reportData.report.netWorthVelocity === 'Stable' ? (
                          <CheckCircle2 size={18} className="text-blue-400" />
                        ) : (
                          <TrendingDown size={18} className="text-red-400" />
                        )}
                        {reportData.report.netWorthVelocity}
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-1">
                        {reportData.report.savingsRatio}% Saved
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Calculated Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  {
                    label: 'Total Income',
                    value: `₹${reportData.metrics.totalIncome.toLocaleString('en-IN')}`,
                    icon: Wallet,
                    color: 'text-gray-900',
                    subtext: `${reportData.summary.incomeCount} entries`,
                  },
                  {
                    label: 'Total Expenses',
                    value: `₹${reportData.metrics.totalExpenses.toLocaleString('en-IN')}`,
                    icon: IndianRupee,
                    color: 'text-gray-900',
                    subtext: `${reportData.metrics.expenseRatio}% of income`,
                  },
                  {
                    label: 'Net Surplus',
                    value: `₹${reportData.metrics.netSurplus.toLocaleString('en-IN')}`,
                    icon: ArrowUpRight,
                    color: reportData.metrics.netSurplus >= 0 ? 'text-emerald-600' : 'text-red-600',
                    subtext: reportData.metrics.netSurplus >= 0 ? 'Surplus' : 'Deficit',
                  },
                  {
                    label: 'Savings Ratio',
                    value: `${reportData.metrics.savingsRatio}%`,
                    icon: Target,
                    color: reportData.metrics.savingsRatio >= 20 ? 'text-emerald-600' : 'text-amber-600',
                    subtext: reportData.metrics.savingsRatio >= 20 ? 'Strong' : 'Below 20%',
                  },
                  {
                    label: 'Invested Assets',
                    value: `₹${reportData.metrics.investments.totalActualInvested.toLocaleString('en-IN')}`,
                    icon: TrendingUp,
                    color: 'text-blue-600',
                    subtext: `${reportData.metrics.investments.investmentRatio}% ratio`,
                  },
                  {
                    label: 'Budget Utilization',
                    value: `${reportData.metrics.budgetMetrics.overallUtilizationPercent}%`,
                    icon: PieChart,
                    color: reportData.metrics.budgetMetrics.overallUtilizationPercent > 100 ? 'text-red-600' : 'text-gray-900',
                    subtext: `${reportData.metrics.budgetMetrics.budgets.length} budgets`,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex flex-col justify-between gap-2 transition hover:shadow-md"
                  >
                    <div className="flex justify-between items-center text-gray-400">
                      <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>
                      <item.icon size={16} />
                    </div>
                    <div>
                      <div className={`text-lg sm:text-xl font-black tracking-tight ${item.color}`}>
                        {item.value}
                      </div>
                      <div className="text-[11px] text-gray-400 font-medium mt-0.5">{item.subtext}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Insights & Optimization Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Strategic Insights */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 tracking-tight">Strategic Insights</h3>
                      <p className="text-xs text-gray-400 font-medium">Data-driven observations from Gemini AI</p>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {reportData.report.insights.map((insight, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700 leading-relaxed text-sm font-medium">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0 shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Expense Optimization */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Lightbulb size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 tracking-tight">Expense Optimizations</h3>
                      <p className="text-xs text-gray-400 font-medium">Targeted actions to eliminate cash leakages</p>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {reportData.report.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700 leading-relaxed text-sm font-medium">
                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0 shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Investment & Capital Strategy */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6 md:col-span-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Target size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 tracking-tight">Capital Growth & Investment Strategy</h3>
                      <p className="text-xs text-gray-400 font-medium">Asset allocation and wealth compounding recommendations</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    {/* Advice List */}
                    <div className="lg:col-span-3 space-y-4">
                      {reportData.report.investmentAdvice.map((advice, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50/70 rounded-2xl border border-gray-100">
                          <TrendingUp size={18} className="text-emerald-600 mt-0.5 shrink-0" />
                          <span className="text-sm font-semibold text-gray-800 leading-relaxed">{advice}</span>
                        </div>
                      ))}
                    </div>

                    {/* Suggested Split Breakdown */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 border border-emerald-100 rounded-3xl p-6 space-y-5">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
                          Recommended Allocation
                        </span>
                        <h4 className="text-lg font-bold text-emerald-950 mt-1">
                          Investable Surplus: ₹{reportData.metrics.investments.investableSurplus.toLocaleString('en-IN')}
                        </h4>
                      </div>

                      <div className="space-y-3.5">
                        <div className="flex justify-between items-center text-xs font-bold text-gray-700">
                          <span className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                            Stocks (50%)
                          </span>
                          <span>₹{reportData.metrics.investments.suggestedSplit.for_Stocks.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: '50%' }} />
                        </div>

                        <div className="flex justify-between items-center text-xs font-bold text-gray-700">
                          <span className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                            Mutual Funds (30%)
                          </span>
                          <span>₹{reportData.metrics.investments.suggestedSplit.for_Mutualfunds.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: '30%' }} />
                        </div>

                        <div className="flex justify-between items-center text-xs font-bold text-gray-700">
                          <span className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                            Gold / Hedge (20%)
                          </span>
                          <span>₹{reportData.metrics.investments.suggestedSplit.for_Gold.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div className="bg-amber-400 h-full rounded-full" style={{ width: '20%' }} />
                        </div>
                      </div>

                      <p className="text-[11px] text-emerald-800/80 leading-relaxed font-medium">
                        Allocation calculated dynamically using Invest Planner portfolio split algorithms based on positive cashflow.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Visual Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="mt-8 space-y-8 animate-in fade-in duration-300">
          {/* Timeline Selector */}
          <div className="w-full max-w-md">
            <TimeLine range={range} setRange={setRange} />
          </div>

          {/* Graph Card */}
          <div className="w-full bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden p-4 sm:p-6">
            <ReportGraph range={range} />
          </div>

          {/* Category Breakdown Card */}
          <div className="w-full">
            <CategoryBreakdown range={range} />
          </div>
        </div>
      )}
    </div>
  );
}