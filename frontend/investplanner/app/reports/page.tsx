'use client';

import { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Target,
  PieChart,
  IndianRupee,
  Wallet,
  Lightbulb,
  ShieldAlert,
  ArrowUpRight,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { TimeLine } from '../components/TimeLine';
import ReportGraph from '../components/reportGraph';
import CategoryBreakdown from '../components/categoryBreakdown';
import { ReportHeader } from './reportHeader';
import { apiCall } from '../lib/api';

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
  netWorthVelocity: 'Accelerating' | 'Stable' | 'Retracting';
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
    netWorthVelocity: 'Accelerating' | 'Stable' | 'Retracting';
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
      } catch {
        // ignore
      }
    } catch (err) {
      console.error('Failed to fetch AI financial report:', err);
      const message = err instanceof Error ? err.message : 'Failed to load report.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const cached =
        sessionStorage.getItem('investplanner_ai_report') ||
        sessionStorage.getItem('spendly_ai_report');
      if (cached) {
        setReportData(JSON.parse(cached));
      }
    } catch {
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
SPENDLY - FINANCIAL AUDIT REPORT
Engine: Salt & Pepper Autonomous Wealth Engine
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

  const isOverspending = reportData
    ? reportData.metrics.totalExpenses > reportData.metrics.totalIncome
    : false;
  const hasOverspentBudgets = reportData
    ? reportData.metrics.budgetMetrics.overspentCategories.length > 0
    : false;

  return (
    <div className="w-full max-w-6xl mx-auto transition-all duration-300">
      <ReportHeader
        onExport={handleExport}
        onGenerate={fetchReport}
        hasReport={Boolean(reportData)}
        loading={loading}
      />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 mt-6 p-1 bg-neutral-100 rounded-xl w-fit border border-neutral-200/60 font-mono text-xs">
        <button
          onClick={() => setActiveTab('ai-report')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition cursor-pointer ${
            activeTab === 'ai-report'
              ? 'bg-black text-white shadow-sm font-medium'
              : 'text-neutral-500 hover:text-black'
          }`}
        >
          <Sparkles size={13} />
          Gemini AI Audit
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-black text-white shadow-sm font-medium'
              : 'text-neutral-500 hover:text-black'
          }`}
        >
          <BarChart3 size={13} />
          Visual Breakdown
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'ai-report' && (
        <div className="mt-6 space-y-6">
          {loading ? (
            <div className="w-full bg-white rounded-2xl p-12 border border-neutral-200/90 shadow-sm flex flex-col items-center justify-center text-center space-y-3 min-h-[360px]">
              <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin" />
              <h3 className="text-base font-semibold text-neutral-950 mt-2">
                Auditing Ledger Records with Gemini AI...
              </h3>
              <p className="font-mono text-xs text-neutral-400 max-w-md">
                Aggregating incomes, outflows, categories, and ceilings to generate precision analysis.
              </p>
            </div>
          ) : error ? (
            <div className="w-full bg-neutral-50 border border-neutral-300 rounded-2xl p-8 text-center space-y-3">
              <div className="w-10 h-10 bg-neutral-200 text-neutral-800 rounded-xl flex items-center justify-center mx-auto">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-base font-semibold text-neutral-950">AI Audit Interrupted</h3>
              <p className="font-mono text-xs text-neutral-500 max-w-lg mx-auto">{error}</p>
              <button
                onClick={fetchReport}
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-xs font-mono hover:bg-neutral-800 transition active:scale-95 cursor-pointer"
              >
                <RefreshCw size={13} />
                Retry Analysis
              </button>
            </div>
          ) : !reportData ? (
            /* On-Demand Call-to-Action Card */
            <div className="bg-neutral-950 rounded-2xl p-8 sm:p-12 text-white border border-neutral-800 shadow-xl space-y-6">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                <span className="px-3 py-1 bg-white/10 text-white uppercase tracking-wider rounded-full border border-white/15 flex items-center gap-1.5">
                  <Sparkles size={11} />
                  Gemini 3.8 Flash Engine
                </span>
                <span className="px-3 py-1 bg-white/5 text-neutral-300 uppercase tracking-wider rounded-full border border-white/10 flex items-center gap-1.5">
                  <CheckCircle2 size={11} />
                  On-Demand Precision
                </span>
              </div>

              <div className="space-y-2 max-w-2xl">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Generate Your AI Financial Audit
                </h2>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                  Run the audit engine against your live ledger. The engine computes your quantitative health index, audits category outflows, flags cash leakages, and calculates 50/30/20 capital growth trajectories.
                </p>
              </div>

              {/* 3 Pillar Mini Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1.5">
                  <div className="text-neutral-200 flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider">
                    <Lightbulb size={14} /> Strategic Insights
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed font-mono">
                    Undercover burn trajectory and capital stability velocity.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1.5">
                  <div className="text-neutral-200 flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider">
                    <Target size={14} /> Expense Ceilings
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed font-mono">
                    Actionable targets to curb recurring category overspending.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1.5">
                  <div className="text-neutral-200 flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider">
                    <TrendingUp size={14} /> Capital Strategy
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed font-mono">
                    Optimized 50/30/20 portfolio split for equity and hedging.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <button
                  onClick={fetchReport}
                  disabled={loading}
                  className="px-6 py-2.5 bg-white hover:bg-neutral-100 text-black font-medium text-xs rounded-full transition shadow-sm cursor-pointer disabled:opacity-50"
                >
                  Generate AI Financial Report
                </button>
                <span className="font-mono text-[10px] text-neutral-400">
                  Takes ~2 seconds • Isolated to your ledger
                </span>
              </div>
            </div>
          ) : (
            <>
              {/* Alert Banner if any */}
              {(isOverspending || hasOverspentBudgets) && (
                <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-sm flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-neutral-100 text-neutral-800 shrink-0">
                    <ShieldAlert size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-neutral-900 tracking-tight">
                      {isOverspending ? 'Cash Deficit Alert' : 'Budget Ceiling Warning'}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                      {isOverspending
                        ? `Total expenses (₹${reportData.metrics.totalExpenses.toLocaleString('en-IN')}) exceed income by ₹${Math.abs(reportData.metrics.netSurplus).toLocaleString('en-IN')}.`
                        : `Exceeded ceilings in: ${reportData.metrics.budgetMetrics.overspentCategories.join(', ')}.`}
                    </p>
                  </div>
                </div>
              )}

              {/* Executive Summary Card */}
              <div className="w-full bg-neutral-950 text-white rounded-2xl p-6 sm:p-8 border border-neutral-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="px-2.5 py-0.5 bg-white/10 rounded-full text-neutral-300">
                      Audit Summary
                    </span>
                    <span className="text-neutral-500">
                      {new Date(reportData.report.generatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                    {reportData.report.title}
                  </h2>
                  <p className="font-mono text-xs text-neutral-400">
                    Based on {reportData.summary.incomeCount} incomes, {reportData.summary.expenseCount} expenses, and {reportData.summary.transactionCount} entries.
                  </p>
                </div>

                {/* Quantitative Score */}
                <div className="flex items-center gap-6 bg-white/5 border border-white/10 p-4 rounded-xl shrink-0 font-mono">
                  <div className="text-center">
                    <div className="text-[10px] uppercase text-neutral-400">Health Index</div>
                    <div className="text-3xl font-bold text-white mt-0.5">
                      {reportData.report.healthScore}
                      <span className="text-xs font-normal text-neutral-500">/100</span>
                    </div>
                  </div>

                  <div className="h-8 w-px bg-white/10" />

                  <div className="text-center">
                    <div className="text-[10px] uppercase text-neutral-400">Velocity</div>
                    <div className="text-sm font-semibold text-white mt-1 flex items-center gap-1">
                      {reportData.report.netWorthVelocity}
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculated Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
                {[
                  {
                    label: 'Total Income',
                    value: `₹${reportData.metrics.totalIncome.toLocaleString('en-IN')}`,
                    icon: Wallet,
                  },
                  {
                    label: 'Total Outflows',
                    value: `₹${reportData.metrics.totalExpenses.toLocaleString('en-IN')}`,
                    icon: IndianRupee,
                  },
                  {
                    label: 'Net Balance',
                    value: `₹${reportData.metrics.netSurplus.toLocaleString('en-IN')}`,
                    icon: ArrowUpRight,
                  },
                  {
                    label: 'Savings Ratio',
                    value: `${reportData.metrics.savingsRatio}%`,
                    icon: Target,
                  },
                  {
                    label: 'Invested',
                    value: `₹${reportData.metrics.investments.totalActualInvested.toLocaleString('en-IN')}`,
                    icon: TrendingUp,
                  },
                  {
                    label: 'Ceiling Util',
                    value: `${reportData.metrics.budgetMetrics.overallUtilizationPercent}%`,
                    icon: PieChart,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-4 border border-neutral-200/90 shadow-sm flex flex-col justify-between gap-1.5"
                  >
                    <div className="flex justify-between items-center text-neutral-400">
                      <span className="text-[9px] uppercase tracking-wider">{item.label}</span>
                      <item.icon size={14} />
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-neutral-950 mt-1">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Strategic Insights & Optimizations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-900 flex items-center justify-center">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">
                        Strategic Insights
                      </h3>
                      <p className="font-mono text-[10px] text-neutral-400">
                        Quantitative observations from Gemini
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-3 font-mono text-xs text-neutral-700">
                    {reportData.report.insights.map((insight, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 shrink-0" />
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-900 flex items-center justify-center">
                      <Lightbulb size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">
                        Expense Optimizations
                      </h3>
                      <p className="font-mono text-[10px] text-neutral-400">
                        Curb recommendations
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-3 font-mono text-xs text-neutral-700">
                    {reportData.report.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 shrink-0" />
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Capital Allocation Card */}
                <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-sm space-y-4 md:col-span-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
                      <Target size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">
                        Capital Growth &amp; Investment Strategy
                      </h3>
                      <p className="font-mono text-[10px] text-neutral-400">
                        Suggested portfolio trajectory
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start pt-2">
                    <div className="lg:col-span-3 space-y-3">
                      {reportData.report.investmentAdvice.map((advice, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-3 bg-neutral-50 rounded-xl border border-neutral-200/60 font-mono text-xs text-neutral-800"
                        >
                          <TrendingUp size={15} className="mt-0.5 shrink-0 text-neutral-900" />
                          <span>{advice}</span>
                        </div>
                      ))}
                    </div>

                    <div className="lg:col-span-2 bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-3 font-mono text-xs">
                      <div className="flex justify-between items-center text-neutral-900 font-semibold">
                        <span>Investable Surplus</span>
                        <span>₹{reportData.metrics.investments.investableSurplus.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="space-y-2 pt-2">
                        <div>
                          <div className="flex justify-between text-[11px] text-neutral-600 mb-1">
                            <span>Stocks (50%)</span>
                            <span>₹{reportData.metrics.investments.suggestedSplit.for_Stocks.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                            <div className="h-full bg-black rounded-full" style={{ width: '50%' }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-neutral-600 mb-1">
                            <span>Mutual Funds (30%)</span>
                            <span>₹{reportData.metrics.investments.suggestedSplit.for_Mutualfunds.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                            <div className="h-full bg-neutral-700 rounded-full" style={{ width: '30%' }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-neutral-600 mb-1">
                            <span>Defensive / Gold (20%)</span>
                            <span>₹{reportData.metrics.investments.suggestedSplit.for_Gold.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                            <div className="h-full bg-neutral-400 rounded-full" style={{ width: '20%' }}></div>
                          </div>
                        </div>
                      </div>
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
        <div className="mt-6 space-y-6">
          <div className="w-full max-w-xs">
            <TimeLine range={range} setRange={setRange} />
          </div>

          <ReportGraph range={range} />
          <CategoryBreakdown range={range} />
        </div>
      )}
    </div>
  );
}