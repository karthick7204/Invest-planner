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
import { AIReportData } from '@/types/api';

export default function ReportsScreen() {
  const [reportData, setReportData] = useState<AIReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'ai-report' | 'analytics'>('ai-report');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    setErrorMessage(null);
    try {
      const data = await apiCall<AIReportData>('/ai/report', { method: 'GET' });
      if (data && data.metrics) {
        setReportData(data);
      }
    } catch (err: any) {
      console.warn('Could not fetch existing AI report:', err?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleGenerate = async () => {
    setGenerating(true);
    setErrorMessage(null);
    try {
      const data = await apiCall<AIReportData>('/ai/report', { method: 'POST' });
      if (data && data.metrics) {
        setReportData(data);
        Alert.alert(
          'Gemini Audit Complete',
          'Gemini AI has analyzed your transactions and generated your financial health report!'
        );
      }
    } catch (err: any) {
      console.error('Report generation error:', err);
      const msg = err?.message || 'Failed to generate report from Gemini AI.';
      setErrorMessage(msg);
      Alert.alert('Report Error', msg);
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = async () => {
    if (!reportData) return;
    const { report, metrics } = reportData;
    const dateFormatted = report?.generatedAt
      ? new Date(report.generatedAt).toLocaleString('en-IN')
      : new Date().toLocaleDateString('en-IN');

    const text = `
=====================================================
INVEST PLANNER - PERSONALIZED FINANCIAL AUDIT REPORT
Powered by Google Gemini AI & Live Database Sync
Date: ${dateFormatted}
=====================================================

EXECUTIVE SUMMARY
Title: ${report?.title || 'Financial Health Assessment'}
Health Score: ${report?.healthScore ?? metrics.healthScore}/100
Savings Ratio: ${report?.savingsRatio ?? metrics.savingsRatio}%
Net Worth Velocity: ${report?.netWorthVelocity || metrics.netWorthVelocity}

KEY FINANCIAL METRICS
- Total Income: ₹${metrics.totalIncome.toLocaleString('en-IN')}
- Total Expenses: ₹${metrics.totalExpenses.toLocaleString('en-IN')}
- Net Surplus: ₹${metrics.netSurplus.toLocaleString('en-IN')}
- Savings Ratio: ${metrics.savingsRatio}%
- Expense Ratio: ${metrics.expenseRatio}%

GEMINI AI OBSERVATIONS & INSIGHTS
${(report?.insights || []).map((ins, i) => `${i + 1}. ${ins}`).join('\n')}

ACTIONABLE RECOMMENDATIONS
${(report?.suggestions || []).map((sug, i) => `${i + 1}. ${sug}`).join('\n')}

INVESTMENT & CAPITAL ADVICE
${(report?.investmentAdvice || []).map((adv, i) => `${i + 1}. ${adv}`).join('\n')}

SUGGESTED PORTFOLIO SPLIT
- Stocks (50%): ₹${metrics.investments.suggestedSplit.for_Stocks.toLocaleString('en-IN')}
- Mutual Funds (30%): ₹${metrics.investments.suggestedSplit.for_Mutualfunds.toLocaleString('en-IN')}
- Gold (20%): ₹${metrics.investments.suggestedSplit.for_Gold.toLocaleString('en-IN')}
    `.trim();

    try {
      await Share.share({
        message: text,
        title: 'InvestPlanner Financial Audit Report',
      });
    } catch (e) {
      console.error('Error sharing report:', e);
    }
  };

  const metrics = reportData?.metrics;
  const report = reportData?.report;

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
        {/* Error notification banner */}
        {errorMessage ? (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={18} color="#DC2626" />
            <Text style={styles.errorBannerText}>{errorMessage}</Text>
          </View>
        ) : null}

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
              Tap the button above to run Gemini AI's personalized audit across your MongoDB income, expenses, budgets, and investments.
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
                  <Text style={styles.scoreNumber}>
                    {report?.healthScore ?? metrics?.healthScore ?? 0}
                  </Text>
                  <Text style={styles.scoreMax}>/100</Text>
                </View>
                <View style={styles.velocityBadge}>
                  <Ionicons name="speedometer-outline" size={14} color="#047857" />
                  <Text style={styles.velocityText}>
                    Velocity: {report?.netWorthVelocity || metrics?.netWorthVelocity || 'Stable'}
                  </Text>
                </View>
              </View>
              <View style={styles.scoreRight}>
                <Ionicons
                  name={
                    (report?.healthScore ?? metrics?.healthScore ?? 0) >= 75
                      ? 'shield-checkmark'
                      : 'alert-circle'
                  }
                  size={54}
                  color={
                    (report?.healthScore ?? metrics?.healthScore ?? 0) >= 75
                      ? '#10B981'
                      : '#F59E0B'
                  }
                />
              </View>
            </View>

            {/* Audit Title Card */}
            {report?.title ? (
              <View style={styles.titleCard}>
                <Ionicons name="ribbon-outline" size={20} color="#D97706" />
                <Text style={styles.reportTitleText}>{report.title}</Text>
              </View>
            ) : null}

            {/* Strategic Observations / Insights */}
            <View style={styles.sectionCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardHeaderIcon, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="bulb-outline" size={18} color="#2563EB" />
                </View>
                <Text style={styles.cardTitle}>AI Financial Insights</Text>
              </View>
              {(report?.insights || [
                'Healthy monthly surplus detected from current cash inflows.',
                'Categorized outlays reflect disciplined essential living expenditure.',
              ]).map((ins, i) => (
                <View key={i} style={styles.listItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#2563EB" />
                  <Text style={styles.listItemText}>{ins}</Text>
                </View>
              ))}
            </View>

            {/* Action Recommendations */}
            <View style={styles.sectionCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardHeaderIcon, { backgroundColor: '#ECFDF5' }]}>
                  <Ionicons name="checkmark-done-circle-outline" size={18} color="#059669" />
                </View>
                <Text style={styles.cardTitle}>Action Recommendations</Text>
              </View>
              {(report?.suggestions || [
                'Automate allocation of remaining surplus to dollar-cost average into index funds.',
                'Maintain category budget caps to maintain healthy savings velocity.',
              ]).map((rec, i) => (
                <View key={i} style={styles.listItem}>
                  <Ionicons name="arrow-forward-circle" size={16} color="#059669" />
                  <Text style={styles.listItemText}>{rec}</Text>
                </View>
              ))}
            </View>

            {/* Investment & Capital Advice */}
            {report?.investmentAdvice && report.investmentAdvice.length > 0 ? (
              <View style={styles.sectionCard}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardHeaderIcon, { backgroundColor: '#FEF3C7' }]}>
                    <Ionicons name="trending-up-outline" size={18} color="#D97706" />
                  </View>
                  <Text style={styles.cardTitle}>Investment Guidance</Text>
                </View>
                {report.investmentAdvice.map((adv, i) => (
                  <View key={i} style={styles.listItem}>
                    <Ionicons name="cash-outline" size={16} color="#D97706" />
                    <Text style={styles.listItemText}>{adv}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            {/* Suggested Capital Split */}
            {metrics?.investments ? (
              <View style={styles.sectionCard}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardHeaderIcon, { backgroundColor: '#FEF3C7' }]}>
                    <Ionicons name="pie-chart-outline" size={18} color="#D97706" />
                  </View>
                  <Text style={styles.cardTitle}>Suggested Asset Allocation</Text>
                </View>
                <Text style={styles.subtext}>
                  Recommended portfolio distribution based on your ₹
                  {(metrics.investments.investableSurplus || 0).toLocaleString('en-IN')}{' '}
                  investable surplus:
                </Text>

                <View style={styles.splitRow}>
                  <View style={[styles.splitBox, { borderColor: '#DBEAFE' }]}>
                    <Text style={styles.splitBoxTitle}>Stocks (50%)</Text>
                    <Text style={styles.splitBoxAmount}>
                      ₹
                      {(
                        metrics.investments.suggestedSplit?.for_Stocks || 0
                      ).toLocaleString('en-IN')}
                    </Text>
                  </View>
                  <View style={[styles.splitBox, { borderColor: '#D1FAE5' }]}>
                    <Text style={styles.splitBoxTitle}>Mutual Funds (30%)</Text>
                    <Text style={styles.splitBoxAmount}>
                      ₹
                      {(
                        metrics.investments.suggestedSplit?.for_Mutualfunds || 0
                      ).toLocaleString('en-IN')}
                    </Text>
                  </View>
                  <View style={[styles.splitBox, { borderColor: '#FEF3C7' }]}>
                    <Text style={styles.splitBoxTitle}>Gold (20%)</Text>
                    <Text style={styles.splitBoxAmount}>
                      ₹
                      {(
                        metrics.investments.suggestedSplit?.for_Gold || 0
                      ).toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>
              </View>
            ) : null}
          </View>
        ) : (
          /* --- ANALYTICS TAB --- */
          <View style={styles.tabContent}>
            {/* Core Metrics Grid */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricTile}>
                <Text style={styles.tileLabel}>Total Income</Text>
                <Text style={[styles.tileValue, { color: '#059669' }]}>
                  ₹{(metrics?.totalIncome || 0).toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={styles.metricTile}>
                <Text style={styles.tileLabel}>Total Expenses</Text>
                <Text style={[styles.tileValue, { color: '#DC2626' }]}>
                  ₹{(metrics?.totalExpenses || 0).toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={styles.metricTile}>
                <Text style={styles.tileLabel}>Net Surplus</Text>
                <Text
                  style={[
                    styles.tileValue,
                    {
                      color: (metrics?.netSurplus || 0) >= 0 ? '#059669' : '#DC2626',
                    },
                  ]}
                >
                  ₹{(metrics?.netSurplus || 0).toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={styles.metricTile}>
                <Text style={styles.tileLabel}>Savings Ratio</Text>
                <Text style={[styles.tileValue, { color: '#D97706' }]}>
                  {metrics?.savingsRatio || 0}%
                </Text>
              </View>
            </View>

            {/* Category Expenses Breakdown */}
            <View style={styles.sectionCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardHeaderIcon, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="bar-chart-outline" size={18} color="#2563EB" />
                </View>
                <Text style={styles.cardTitle}>Category Expense Breakdown</Text>
              </View>

              {!metrics?.categoryExpenses || metrics.categoryExpenses.length === 0 ? (
                <Text style={styles.emptyCategoryText}>No category expenses recorded</Text>
              ) : (
                metrics.categoryExpenses.map((cat, i) => (
                  <View key={cat.category || i} style={styles.catBreakdownItem}>
                    <View style={styles.catBreakdownTop}>
                      <Text style={styles.catName}>{cat.category}</Text>
                      <Text style={styles.catAmount}>
                        ₹{cat.amount.toLocaleString('en-IN')} ({cat.percentageOfTotal}%)
                      </Text>
                    </View>
                    <View style={styles.catBarBg}>
                      <View
                        style={[
                          styles.catBarFill,
                          { width: `${Math.min(100, cat.percentageOfTotal)}%` },
                        ]}
                      />
                    </View>
                  </View>
                ))
              )}
            </View>

            {/* Budget Utilization Adherence */}
            {metrics?.budgetMetrics ? (
              <View style={styles.sectionCard}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardHeaderIcon, { backgroundColor: '#ECFDF5' }]}>
                    <Ionicons name="shield-checkmark-outline" size={18} color="#059669" />
                  </View>
                  <Text style={styles.cardTitle}>Budget Adherence</Text>
                </View>

                <View style={styles.budgetOverviewRow}>
                  <View style={styles.budgetOverviewBox}>
                    <Text style={styles.budgetOverviewLabel}>Total Budget Limit</Text>
                    <Text style={styles.budgetOverviewValue}>
                      ₹{(metrics.budgetMetrics.totalBudgetLimit || 0).toLocaleString('en-IN')}
                    </Text>
                  </View>
                  <View style={styles.budgetOverviewBox}>
                    <Text style={styles.budgetOverviewLabel}>Total Spent</Text>
                    <Text style={styles.budgetOverviewValue}>
                      ₹{(metrics.budgetMetrics.totalBudgetSpent || 0).toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>

                <Text style={styles.utilizationText}>
                  Overall Utilization: {metrics.budgetMetrics.overallUtilizationPercent}%
                </Text>
              </View>
            ) : null}
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
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 12,
    borderRadius: 12,
  },
  errorBannerText: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  exportBtn: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  actionBanner: {
    gap: 8,
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#111827',
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  generateBtnDisabled: {
    opacity: 0.7,
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
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  tabBtnActive: {
    backgroundColor: '#111827',
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  emptySubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: '#6B7280',
    textAlign: 'center',
  },
  tabContent: {
    gap: 16,
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  scoreLeft: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  scoreNumber: {
    fontSize: 44,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -1,
  },
  scoreMax: {
    fontSize: 18,
    fontWeight: '700',
    color: '#9CA3AF',
    marginLeft: 4,
  },
  velocityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  velocityText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
  },
  scoreRight: {
    paddingLeft: 16,
  },
  titleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FEF3C7',
    padding: 14,
    borderRadius: 16,
  },
  reportTitleText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#92400E',
    flex: 1,
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
    marginBottom: 14,
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
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  listItemText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
    flex: 1,
    fontWeight: '500',
  },
  subtext: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
    fontWeight: '500',
  },
  splitRow: {
    flexDirection: 'row',
    gap: 8,
  },
  splitBox: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
  },
  splitBoxTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    textAlign: 'center',
  },
  splitBoxAmount: {
    fontSize: 13,
    fontWeight: '900',
    color: '#111827',
    marginTop: 4,
    textAlign: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricTile: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  tileLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  tileValue: {
    fontSize: 20,
    fontWeight: '900',
    marginTop: 4,
  },
  catBreakdownItem: {
    marginBottom: 12,
  },
  catBreakdownTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  catName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  catAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  catBarBg: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  catBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 3,
  },
  emptyCategoryText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  budgetOverviewRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  budgetOverviewBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 14,
  },
  budgetOverviewLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  budgetOverviewValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
  },
  utilizationText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
  },
});
