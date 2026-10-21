import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/Header';
import { apiCall } from '@/services/api';
import { AIInsightResult } from '@/types/api';

export default function AIInsightsScreen() {
  const [briefingText, setBriefingText] = useState<string>('');
  const [deepAnalysis, setDeepAnalysis] = useState<AIInsightResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [auditing, setAuditing] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchBriefing = useCallback(async () => {
    setErrorMessage(null);
    try {
      const data = await apiCall('/ai/insights', { method: 'GET' });
      if (data && data.insight) {
        setBriefingText(data.insight);
      } else if (typeof data === 'string') {
        setBriefingText(data);
      } else {
        setBriefingText(
          'Gemini AI has audited your transaction history. Log regular expenses to maintain up-to-date spending intelligence.'
        );
      }
    } catch (err: any) {
      console.warn('Could not fetch AI briefing:', err?.message);
      setBriefingText(
        'Analyzing current transactions. Keep recording expenses to unlock peak velocity and category alerts.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const runDeepAudit = async () => {
    setAuditing(true);
    setErrorMessage(null);
    try {
      const data = await apiCall<AIInsightResult>('/ai/insights', {
        method: 'POST',
      });
      if (data && (data.insights || data.suggestions)) {
        setDeepAnalysis(data);
        Alert.alert(
          'Audit Completed',
          'Gemini AI has generated personalized observations, suggestions, and investment advice.'
        );
      }
    } catch (err: any) {
      console.error('Deep AI audit error:', err);
      const msg = err?.message || 'Failed to complete deep audit via Gemini AI.';
      setErrorMessage(msg);
      Alert.alert('Audit Error', msg);
    } finally {
      setAuditing(false);
    }
  };

  useEffect(() => {
    fetchBriefing();
  }, [fetchBriefing]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBriefing();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header
        title="AI Insights"
        subtitle="Gemini 3.8 Flash spending intelligence"
        rightAction={
          <TouchableOpacity
            onPress={fetchBriefing}
            disabled={loading || refreshing}
            style={styles.refreshBtn}
          >
            <Ionicons
              name="refresh"
              size={18}
              color="#111827"
              style={refreshing ? { transform: [{ rotate: '45deg' }] } : undefined}
            />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Error notification banner */}
        {errorMessage ? (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={18} color="#DC2626" />
            <Text style={styles.errorBannerText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* Gemini AI Hero Banner */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroBadge}>
              <Ionicons name="sparkles" size={14} color="#FBBF24" />
              <Text style={styles.heroBadgeText}>Gemini AI Real-time Audit</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>Autonomous Spending Analysis</Text>
          <Text style={styles.heroText}>
            Continuous pattern detection across your daily expenses, alerting you before you overspend.
          </Text>

          <TouchableOpacity
            onPress={runDeepAudit}
            disabled={auditing}
            style={[styles.deepAuditBtn, auditing && styles.deepAuditBtnDisabled]}
          >
            {auditing ? (
              <>
                <ActivityIndicator color="#111827" size="small" />
                <Text style={styles.deepAuditBtnText}>Auditing with Gemini...</Text>
              </>
            ) : (
              <>
                <Ionicons name="flash" size={16} color="#111827" />
                <Text style={styles.deepAuditBtnText}>Run Deep Spending Audit</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Natural Language AI Briefing Card */}
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <View style={styles.insightIconWrap}>
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#2563EB" />
            </View>
            <Text style={styles.insightCardTitle}>Weekly AI Briefing</Text>
          </View>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color="#2563EB" size="small" />
              <Text style={styles.loadingBoxText}>Synthesizing financial telemetry...</Text>
            </View>
          ) : (
            <Text style={styles.insightBodyText}>{briefingText}</Text>
          )}
        </View>

        {/* Deep Analysis Results if Available */}
        {deepAnalysis ? (
          <View style={styles.analysisContainer}>
            {/* Title / Header */}
            {deepAnalysis.title ? (
              <View style={styles.analysisHeaderBox}>
                <Ionicons name="ribbon-outline" size={20} color="#D97706" />
                <Text style={styles.analysisTitleText}>{deepAnalysis.title}</Text>
              </View>
            ) : null}

            {/* Observations / Insights */}
            {deepAnalysis.insights && deepAnalysis.insights.length > 0 ? (
              <View style={styles.sectionCard}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardHeaderIcon, { backgroundColor: '#EFF6FF' }]}>
                    <Ionicons name="bulb-outline" size={18} color="#2563EB" />
                  </View>
                  <Text style={styles.cardTitle}>Observations</Text>
                </View>
                {deepAnalysis.insights.map((ins, i) => (
                  <View key={i} style={styles.listItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#2563EB" />
                    <Text style={styles.listItemText}>{ins}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            {/* Suggestions */}
            {deepAnalysis.suggestions && deepAnalysis.suggestions.length > 0 ? (
              <View style={styles.sectionCard}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardHeaderIcon, { backgroundColor: '#ECFDF5' }]}>
                    <Ionicons name="shield-checkmark-outline" size={18} color="#059669" />
                  </View>
                  <Text style={styles.cardTitle}>Actionable Suggestions</Text>
                </View>
                {deepAnalysis.suggestions.map((sug, i) => (
                  <View key={i} style={styles.listItem}>
                    <Ionicons name="arrow-forward-circle" size={16} color="#059669" />
                    <Text style={styles.listItemText}>{sug}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            {/* Investment Advice */}
            {deepAnalysis.investmentAdvice && deepAnalysis.investmentAdvice.length > 0 ? (
              <View style={styles.sectionCard}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardHeaderIcon, { backgroundColor: '#FEF3C7' }]}>
                    <Ionicons name="trending-up-outline" size={18} color="#D97706" />
                  </View>
                  <Text style={styles.cardTitle}>Investment Advice</Text>
                </View>
                {deepAnalysis.investmentAdvice.map((adv, i) => (
                  <View key={i} style={styles.listItem}>
                    <Ionicons name="cash-outline" size={16} color="#D97706" />
                    <Text style={styles.listItemText}>{adv}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        {/* Feature Highlights Grid */}
        <View style={styles.featureGrid}>
          {/* Daily Peak Card */}
          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="flame-outline" size={20} color="#DC2626" />
            </View>
            <Text style={styles.featureTitle}>Peak Day Tracking</Text>
            <Text style={styles.featureDesc}>
              Identifies which day of the week triggers the highest outflow so you can plan accordingly.
            </Text>
          </View>

          {/* Budget Runaway Card */}
          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="warning-outline" size={20} color="#D97706" />
            </View>
            <Text style={styles.featureTitle}>Runaway Forecasting</Text>
            <Text style={styles.featureDesc}>
              Calculates projected month-end totals against category limits to prevent overdrafts.
            </Text>
          </View>

          {/* Smart Cut Card */}
          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="cut-outline" size={20} color="#059669" />
            </View>
            <Text style={styles.featureTitle}>Targeted Cost Cuts</Text>
            <Text style={styles.featureDesc}>
              Pinpoints discretionary spending and recommends exact rupee amounts to trim.
            </Text>
          </View>
        </View>
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
  refreshBtn: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  heroCard: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  heroHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  heroBadgeText: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  heroText: {
    color: '#9CA3AF',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  deepAuditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FACC15',
    paddingVertical: 12,
    borderRadius: 14,
  },
  deepAuditBtnDisabled: {
    opacity: 0.7,
  },
  deepAuditBtnText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '800',
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  insightIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightCardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 20,
  },
  loadingBoxText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  insightBodyText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#374151',
    fontWeight: '500',
  },
  analysisContainer: {
    gap: 16,
  },
  analysisHeaderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FEF3C7',
    padding: 14,
    borderRadius: 16,
  },
  analysisTitleText: {
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
  featureGrid: {
    gap: 12,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: '#6B7280',
    fontWeight: '500',
  },
});
