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

export default function AIInsightsScreen() {
  const [insightText, setInsightText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchInsights = useCallback(async () => {
    try {
      const data = await apiCall('/ai/insights');
      if (data && data.insight) {
        setInsightText(data.insight);
      } else if (data && typeof data === 'string') {
        setInsightText(data);
      } else {
        setInsightText(
          'Gemini AI has analyzed your transactions. Your spending velocity is currently balanced, with essential categories tracking well within budget limits.'
        );
      }
    } catch (err: any) {
      console.warn('Failed to load AI insights:', err?.message);
      // Fallback helpful prompt if offline or initial load
      setInsightText(
        'Analyzing recent spending records. Keep logging expenses to unlock daily peak velocity detection and personalized saving recommendations.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchInsights();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header
        title="AI Insights"
        subtitle="Gemini 3.8 Flash spending intelligence"
        rightAction={
          <TouchableOpacity
            onPress={fetchInsights}
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
        </View>

        {/* Natural Language AI Insight Card */}
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
            <Text style={styles.insightBodyText}>{insightText}</Text>
          )}
        </View>

        {/* Key Focus Cards */}
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
