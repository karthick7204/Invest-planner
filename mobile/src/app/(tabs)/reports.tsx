import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/Header';
import { apiCall } from '@/services/api';

interface CategoryMetric {
  category: string;
  amount: number;
  percentageOfTotal: number;
  percentageOfIncome: number;
}

interface BudgetMetric {
  category: string;
  limit: number;
  spent: number;
  remaining: number;
  isOverBudget: boolean;
  overspendAmount: number;
  utilizationPercent: number;
}

interface ReportData {
  metrics: {
    totalIncome: number;
    totalExpenses: number;
    netSurplus: number;
    savingsRatio: number;
    expenseRatio: number;
    healthScore: number;
    netWorthVelocity: 'Accelerating' | 'Stable' | 'Retracting';
    categoryExpenses: CategoryMetric[];
    investments: {
      totalActualInvested: number;
      investableSurplus: number;
      suggestedSplit: {
        for_Stocks: number;
        for_Mutualfunds: number;
        for_Gold: number;
      };
      investmentRatio: number;
    };
    budgetMetrics: {
      totalBudgetLimit: number;
      totalBudgetSpent: number;
      overallUtilizationPercent: number;
      overspentCategories: string[];
      budgets: BudgetMetric[];
    };
  };
  geminiReport: {
    title: string;
    executiveSummary: string;
    keyObservations: string[];
    actionableSuggestions: string[];
    riskAnalysis: string[];
  };
}

export default function ReportsScreen() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'ai-report' | 'analytics'>('ai-report');

  const fetchReport = useCallback(async () => {
    try {
      const data = await apiCall('/ai/report');
      if (data && data.metrics) {
        setReportData(data);
      }
    } catch (err: any) {
      console.warn('Could not fetch existing report:', err?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const data = await apiCall('/ai/report', { method: 'POST' });
      if (data && data.metrics) {
        setReportData(data);
        Alert.alert('Report Ready', 'Gemini AI has finished auditing your finances!');
      }
    } catch (err: any) {
      Alert.alert('Report Generation Error', err?.message || 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = async () => {
    if (!reportData) return;
    const { metrics, geminiReport } = reportData;
    const text = `
INVESTPLANNER AI FINANCIAL REPORT
=================================
Financial Health Score: ${metrics.healthScore}/100 (${metrics.netWorthVelocity})
Total Income: ₹${metrics.totalIncome.toLocaleString('en-IN')}
Total Expenses: ₹${metrics.totalExpenses.toLocaleString('en-IN')}
Net Surplus: ₹${metrics.netSurplus.toLocaleString('en-IN')}
Savings Ratio: ${metrics.savingsRatio}%

EXECUTIVE SUMMARY
${geminiReport?.executiveSummary || 'N/A'}

SUGGESTED PORTFOLIO SPLIT
- Stocks (50%): ₹${metrics.investments.suggestedSplit.for_Stocks.toLocaleString('en-IN')}
- Mutual Funds (30%): ₹${metrics.investments.suggestedSplit.for_Mutualfunds.toLocaleString('en-IN')}
- Gold (20%): ₹${metrics.investments.suggestedSplit.for_Gold.toLocaleString('en-IN')}
    `.trim();

    try {
      await Share.share({
        message: text,
        title: 'InvestPlanner Financial Report',
      });
    } catch (e) {
      console.error('Error sharing report:', e);
    }
  };

  const metrics = reportData?.metrics;
  const gemini = reportData?.geminiReport;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header
        title="Financial Report"
        subtitle="AI auditing, health metrics & asset allocation"
        rightAction={
          reportData ? (
            <TouchableOpacity onPress={handleExport} style={styles.exportBtn}>
              <Ionicons name="share-outline" size={18} color="#111827" />
            </TouchableOpacity>
          ) : null
        }
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchReport} />
        }
      >
        {/* Action Header Button */}
        <View style={styles.actionBanner}>
          <TouchableOpacity
            onPress={handleGenerate}
            disabled={generating}
            style={[styles.generateBtn, generating && styles.generateBtnDisabled]}
          >
            {generating ? (
              <>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.generateBtnText}>Auditing with Gemini 3.8 Flash...</Text>
              </>
            ) : (
              <>
                <Ionicons name="sparkles" size={18} color="#FBBF24" />
                <Text style={styles.generateBtnText}>
                  {reportData ? 'Regenerate Gemini AI Audit' : 'Generate Full AI Report'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Tab Navigator */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            onPress={() => setActiveTab('ai-report')}
            style={[styles.tabBtn, activeTab === 'ai-report' && styles.tabBtnActive]}
          >
            <Ionicons
              name="sparkles"
              size={15}
              color={activeTab === 'ai-report' ? '#FBBF24' : '#6B7280'}
            />
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'ai-report' && styles.tabBtnTextActive,
              ]}
            >
              Gemini AI Audit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('analytics')}
            style={[styles.tabBtn, activeTab === 'analytics' && styles.tabBtnActive]}
          >
            <Ionicons
              name="bar-chart"
              size={15}
              color={activeTab === 'analytics' ? '#FFFFFF' : '#6B7280'}
            />
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'analytics' && styles.tabBtnTextActive,
              ]}
            >
              Analytics
            </Text>
          </TouchableOpacity>
        </View>

        {!reportData ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="document-text-outline" size={40} color="#2563EB" />
            </View>
            <Text style={styles.emptyTitle}>No Financial Audit Yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the button above to run Gemini AI's deep analysis on your MongoDB income, expenses, and investment goals.
            </Text>
          </View>
        ) : activeTab === 'ai-report' ? (
          /* --- GEMINI AI AUDIT TAB --- */
          <View style={styles.tabContent}>
            {/* Health Score Hero */}
            <View style={styles.scoreCard}>
              <View style={styles.scoreLeft}>
                <Text style={styles.scoreLabel}>Financial Health Score</Text>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreNumber}>{metrics?.healthScore || 0}</Text>
                  <Text style={styles.scoreMax}>/100</Text>
                </View>
                <View style={styles.velocityBadge}>
                  <Ionicons name="speedometer-outline" size={14} color="#047857" />
                  <Text style={styles.velocityText}>
                    Velocity: {metrics?.netWorthVelocity || 'Stable'}
                  </Text>
                </View>
              </View>
              <View style={styles.scoreRight}>
                <Ionicons
                  name={
                    (metrics?.healthScore || 0) >= 75
                      ? 'shield-checkmark'
                      : 'alert-circle'
                  }
                  size={54}
                  color={(metrics?.healthScore || 0) >= 75 ? '#10B981' : '#F59E0B'}
                />
              </View>
            </View>

            {/* Executive Summary */}
            <View style={styles.sectionCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardHeaderIcon, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="bulb-outline" size={18} color="#2563EB" />
                </View>
                <Text style={styles.cardTitle}>Executive Diagnosis</Text>
              </View>
              <Text style={styles.summaryText}>
                {gemini?.executiveSummary ||
                  'Your financial surplus is currently positive. Increasing automated allocations to diversified index funds will accelerate your net worth velocity.'}
              </Text>
            </View>

            {/* Strategic Recommendations */}
            <View style={styles.sectionCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardHeaderIcon, { backgroundColor: '#ECFDF5' }]}>
                  <Ionicons name="checkmark-done-circle-outline" size={18} color="#059669" />
                </View>
                <Text style={styles.cardTitle}>Action Recommendations</Text>
              </View>
              {(gemini?.actionableSuggestions || [
                'Reduce discretionary dining by 15% to increase surplus by ₹3,000/mo.',
                'Establish an emergency buffer of 3 months expenses.',
                'Allocate investable surplus into low-cost index funds.',
              ]).map((rec, i) => (
                <View key={i} style={styles.listItem}>
                  <Ionicons name="arrow-forward-circle" size={16} color="#059669" />
                  <Text style={styles.listItemText}>{rec}</Text>
                </View>
              ))}
            </View>

            {/* Suggested Capital Split */}
            <View style={styles.sectionCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardHeaderIcon, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="pie-chart-outline" size={18} color="#D97706" />
                </View>
                <Text style={styles.cardTitle}>Suggested Asset Allocation</Text>
              </View>
              <Text style={styles.subtext}>
                Recommended portfolio distribution based on your ₹
                {(metrics?.investments?.investableSurplus || 0).toLocaleString('en-IN')}{' '}
                investable surplus:
              </Text>

              <View style={styles.splitRow}>
                <View style={[styles.splitBox, { borderColor: '#DBEAFE' }]}>
                  <Text style={styles.splitBoxTitle}>Stocks (50%)</Text>
                  <Text style={styles.splitBoxAmount}>
                    ₹
                    {(
                      metrics?.investments?.suggestedSplit?.for_Stocks || 0
                    ).toLocaleString('en-IN')}
                  </Text>
                </View>
                <View style={[styles.splitBox, { borderColor: '#D1FAE5' }]}>
                  <Text style={styles.splitBoxTitle}>Mutual Funds (30%)</Text>
                  <Text style={styles.splitBoxAmount}>
                    ₹
                    {(
                      metrics?.investments?.suggestedSplit?.for_Mutualfunds || 0
                    ).toLocaleString('en-IN')}
                  </Text>
                </View>
                <View style={[styles.splitBox, { borderColor: '#FEF3C7' }]}>
                  <Text style={styles.splitBoxTitle}>Gold (20%)</Text>
                  <Text style={styles.splitBoxAmount}>
                    ₹
                    {(
                      metrics?.investments?.suggestedSplit?.for_Gold || 0
                    ).toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          /* --- ANALYTICS TAB --- */
          <View style={styles.tabContent}>
            {/* Top Spending Categories */}
            <View style={styles.sectionCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardHeaderIcon, { backgroundColor: '#F3F4F6' }]}>
                  <Ionicons name="list" size={18} color="#111827" />
                </View>
                <Text style={styles.cardTitle}>Spending by Category</Text>
              </View>

              {(metrics?.categoryExpenses || []).map((cat, i) => (
                <View key={cat.category || i} style={styles.categoryItem}>
                  <View style={styles.categoryRowTop}>
                    <Text style={styles.categoryName}>{cat.category}</Text>
                    <Text style={styles.categoryAmount}>
                      ₹{cat.amount.toLocaleString('en-IN')} ({cat.percentageOfTotal}%)
                    </Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${Math.min(100, cat.percentageOfTotal)}%`,
                          backgroundColor: '#2563EB',
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>

            {/* Budget Utilization Breakdown */}
            <View style={styles.sectionCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardHeaderIcon, { backgroundColor: '#FEE2E2' }]}>
                  <Ionicons name="warning-outline" size={18} color="#DC2626" />
                </View>
                <Text style={styles.cardTitle}>Budget Limit Performance</Text>
              </View>

              {(metrics?.budgetMetrics?.budgets || []).map((b, i) => (
                <View key={b.category || i} style={styles.categoryItem}>
                  <View style={styles.categoryRowTop}>
                    <Text style={styles.categoryName}>{b.category}</Text>
                    <Text
                      style={[
                        styles.categoryAmount,
                        b.isOverBudget && { color: '#DC2626' },
                      ]}
                    >
                      ₹{b.spent.toLocaleString('en-IN')} / ₹{b.limit.toLocaleString('en-IN')}
                      {b.isOverBudget ? ' (OVER)' : ''}
                    </Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${Math.min(100, b.utilizationPercent)}%`,
                          backgroundColor: b.isOverBudget ? '#DC2626' : '#10B981',
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 36,
    gap: 16,
  },
  exportBtn: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  actionBanner: {
    marginBottom: 4,
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
    paddingVertical: 14,
    borderRadius: 18,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  generateBtnDisabled: {
    opacity: 0.6,
  },
  generateBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  tabBtnActive: {
    backgroundColor: '#111827',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
  tabContent: {
    gap: 16,
  },
  scoreCard: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  scoreLeft: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 4,
  },
  scoreNumber: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  scoreMax: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 4,
  },
  velocityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#064E3B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  velocityText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34D399',
  },
  scoreRight: {
    paddingLeft: 12,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  cardHeaderIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#374151',
    fontWeight: '500',
  },
  subtext: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 6,
  },
  listItemText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: '#374151',
    fontWeight: '500',
  },
  splitRow: {
    flexDirection: 'row',
    gap: 8,
  },
  splitBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  splitBoxTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 4,
  },
  splitBoxAmount: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  categoryItem: {
    marginBottom: 12,
  },
  categoryRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  categoryAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 12,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
