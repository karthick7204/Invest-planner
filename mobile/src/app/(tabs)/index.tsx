import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/Header';
import { AddTransactionModal } from '@/components/AddTransactionModal';
import { SetBudgetModal } from '@/components/SetBudgetModal';
import { apiCall } from '@/services/api';
import { Transaction, Budget } from '@/types/api';

export default function DashboardScreen() {
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [surplus, setSurplus] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [addTxVisible, setAddTxVisible] = useState<boolean>(false);
  const [setBudgetVisible, setSetBudgetVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setErrorMessage(null);
    try {
      const currentMonth = new Date().toISOString().substring(0, 7);

      // Execute dashboard queries in parallel
      const [incomeRes, expenseRes, surplusRes, txRes, budgetRes] =
        await Promise.allSettled([
          apiCall('/expense/income'),
          apiCall('/expense/expenses'),
          apiCall('/expense/surplusincome'),
          apiCall('/expense/transactions?limit=50'),
          apiCall(`/budget?month=${currentMonth}`),
        ]);

      // 1. Process Incomes
      let calculatedIncome = 0;
      if (incomeRes.status === 'fulfilled' && incomeRes.value) {
        const incomeList = incomeRes.value.income || [];
        calculatedIncome = incomeList.reduce(
          (sum: number, item: any) => sum + (Number(item.amount) || 0),
          0
        );
      }
      setTotalIncome(calculatedIncome);

      // 2. Process Expenses
      let calculatedExpense = 0;
      if (expenseRes.status === 'fulfilled' && expenseRes.value) {
        const expenseList = expenseRes.value.expenses || [];
        calculatedExpense = expenseList.reduce(
          (sum: number, item: any) => sum + (Number(item.amount) || 0),
          0
        );
      }
      setTotalExpense(calculatedExpense);

      // 3. Process Surplus
      if (
        surplusRes.status === 'fulfilled' &&
        surplusRes.value &&
        surplusRes.value.surplus !== undefined
      ) {
        setSurplus(Number(surplusRes.value.surplus) || 0);
      } else {
        setSurplus(calculatedIncome - calculatedExpense);
      }

      // 4. Process Transactions
      if (txRes.status === 'fulfilled' && txRes.value?.transactions) {
        setTransactions(txRes.value.transactions);
      } else {
        setTransactions([]);
      }

      // 5. Process Budgets
      if (budgetRes.status === 'fulfilled' && budgetRes.value?.budgets) {
        setBudgets(budgetRes.value.budgets);
      } else {
        setBudgets([]);
      }
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setErrorMessage(
        err?.message || 'Failed to sync live data from server. Pull down to retry.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleDeleteTransaction = (id: string, name: string) => {
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete "${name}"? This will update your daily totals and surplus.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiCall(`/expense/transaction/${id}`, { method: 'DELETE' });
              fetchDashboardData();
            } catch (error: any) {
              Alert.alert('Error', error?.message || 'Failed to delete transaction.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteBudget = (budgetId: string, category: string) => {
    Alert.alert(
      'Delete Budget',
      `Delete monthly budget target for ${category}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiCall(`/budget/${budgetId}`, { method: 'DELETE' });
              fetchDashboardData();
            } catch (error: any) {
              Alert.alert('Error', error?.message || 'Failed to delete budget.');
            }
          },
        },
      ]
    );
  };

  // Derived financial ratios matching web app
  const savingsRatio =
    totalIncome > 0 ? Math.round((surplus / totalIncome) * 100) : 0;

  // Investment split recommendations from positive surplus (50% stocks, 30% mutual funds, 20% gold)
  const investable = Math.max(0, surplus);
  const stockSplit = Math.round(investable * 0.5);
  const mutualFundSplit = Math.round(investable * 0.3);
  const goldSplit = Math.round(investable * 0.2);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header
        title="Financial Overview"
        subtitle="Live metrics & synchronized cashflow"
        rightAction={
          <TouchableOpacity
            onPress={() => setAddTxVisible(true)}
            style={styles.addBtn}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.addBtnText}>Add</Text>
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

        {loading ? (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" color="#111827" />
            <Text style={styles.loadingText}>Syncing records from MongoDB...</Text>
          </View>
        ) : (
          <>
            {/* Surplus Hero Card (matching web Wealth Pilot theme) */}
            <View style={styles.heroCard}>
              <View style={styles.heroTopRow}>
                <View>
                  <Text style={styles.heroLabel}>Net Surplus</Text>
                  <Text style={styles.heroAmount}>
                    ₹{Math.abs(surplus).toLocaleString('en-IN')}
                    {surplus < 0 ? ' (Deficit)' : ''}
                  </Text>
                </View>
                <View
                  style={[
                    styles.ratioBadge,
                    surplus < 0 ? styles.ratioBadgeNegative : styles.ratioBadgePositive,
                  ]}
                >
                  <Ionicons
                    name={surplus >= 0 ? 'trending-up' : 'trending-down'}
                    size={14}
                    color={surplus >= 0 ? '#047857' : '#B91C1C'}
                  />
                  <Text
                    style={[
                      styles.ratioBadgeText,
                      surplus < 0
                        ? styles.ratioBadgeTextNegative
                        : styles.ratioBadgeTextPositive,
                    ]}
                  >
                    {savingsRatio}% Saved
                  </Text>
                </View>
              </View>
              <Text style={styles.heroSubtext}>
                {surplus >= 0
                  ? 'Healthy surplus available for asset allocation & growth'
                  : 'Spending exceeds income. Check AI recommendations in Reports.'}
              </Text>
            </View>

            {/* Income & Expense Two-Column Cards */}
            <View style={styles.twoColRow}>
              {/* Income Card */}
              <View style={styles.metricCard}>
                <View style={styles.metricCardTop}>
                  <Text style={styles.metricCardLabel}>Income</Text>
                  <View style={styles.incomeIconWrap}>
                    <Ionicons name="arrow-up" size={16} color="#059669" />
                  </View>
                </View>
                <Text style={styles.incomeAmount}>
                  ₹{totalIncome.toLocaleString('en-IN')}
                </Text>
                <Text style={styles.metricCardSubtext}>Earned this month</Text>
              </View>

              {/* Expense Card */}
              <View style={styles.metricCard}>
                <View style={styles.metricCardTop}>
                  <Text style={styles.metricCardLabel}>Expenses</Text>
                  <View style={styles.expenseIconWrap}>
                    <Ionicons name="arrow-down" size={16} color="#DC2626" />
                  </View>
                </View>
                <Text style={styles.expenseAmount}>
                  ₹{totalExpense.toLocaleString('en-IN')}
                </Text>
                <Text style={styles.metricCardSubtext}>Spent this month</Text>
              </View>
            </View>

            {/* Suggested Asset Allocation Card */}
            {investable > 0 ? (
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionHeaderLeft}>
                    <Ionicons name="pie-chart" size={18} color="#111827" />
                    <Text style={styles.sectionTitle}>Asset Allocation</Text>
                  </View>
                  <Text style={styles.sectionBadge}>Investable: ₹{investable.toLocaleString('en-IN')}</Text>
                </View>

                <View style={styles.allocationRow}>
                  <View style={[styles.allocationItem, { borderColor: '#DBEAFE' }]}>
                    <Text style={styles.allocationPercent}>50%</Text>
                    <Text style={styles.allocationCategory}>Stocks</Text>
                    <Text style={styles.allocationValue}>₹{stockSplit.toLocaleString('en-IN')}</Text>
                  </View>

                  <View style={[styles.allocationItem, { borderColor: '#D1FAE5' }]}>
                    <Text style={styles.allocationPercent}>30%</Text>
                    <Text style={styles.allocationCategory}>Mutual Funds</Text>
                    <Text style={styles.allocationValue}>₹{mutualFundSplit.toLocaleString('en-IN')}</Text>
                  </View>

                  <View style={[styles.allocationItem, { borderColor: '#FEF3C7' }]}>
                    <Text style={styles.allocationPercent}>20%</Text>
                    <Text style={styles.allocationCategory}>Gold</Text>
                    <Text style={styles.allocationValue}>₹{goldSplit.toLocaleString('en-IN')}</Text>
                  </View>
                </View>
              </View>
            ) : null}

            {/* Budget Performance Section */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionHeaderLeft}>
                  <Ionicons name="compass" size={18} color="#111827" />
                  <Text style={styles.sectionTitle}>Budget Goals</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSetBudgetVisible(true)}
                  style={styles.setBudgetBtn}
                >
                  <Ionicons name="add" size={14} color="#D97706" />
                  <Text style={styles.setBudgetBtnText}>Set Budget</Text>
                </TouchableOpacity>
              </View>

              {budgets.length === 0 ? (
                <View style={styles.emptyWrapper}>
                  <Ionicons name="flag-outline" size={32} color="#D1D5DB" />
                  <Text style={styles.emptyText}>No budgets defined for this month</Text>
                  <TouchableOpacity
                    onPress={() => setSetBudgetVisible(true)}
                    style={styles.emptyAddBtn}
                  >
                    <Text style={styles.emptyAddBtnText}>Define First Target</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                budgets.map((b) => {
                  const percent =
                    b.limit > 0 ? Math.min(100, Math.round((b.spent / b.limit) * 100)) : 0;
                  const isOver = b.isExceeded || b.spent > b.limit;

                  return (
                    <View key={b._id || b.category} style={styles.budgetItem}>
                      <View style={styles.budgetRowTop}>
                        <View style={styles.budgetCatRow}>
                          <Text style={styles.budgetName}>{b.category}</Text>
                          {isOver ? (
                            <View style={styles.overBadge}>
                              <Text style={styles.overBadgeText}>Exceeded</Text>
                            </View>
                          ) : null}
                        </View>
                        <View style={styles.budgetRightRow}>
                          <Text style={styles.budgetNumbers}>
                            ₹{b.spent.toLocaleString('en-IN')} / ₹{b.limit.toLocaleString('en-IN')}
                          </Text>
                          <TouchableOpacity
                            onPress={() => handleDeleteBudget(b._id, b.category)}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            style={styles.trashBtn}
                          >
                            <Ionicons name="trash-outline" size={14} color="#9CA3AF" />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Progress Bar */}
                      <View style={styles.progressBarBg}>
                        <View
                          style={[
                            styles.progressBarFill,
                            { width: `${percent}%` },
                            isOver
                              ? styles.progressOver
                              : percent > 80
                              ? styles.progressWarn
                              : styles.progressNormal,
                          ]}
                        />
                      </View>
                    </View>
                  );
                })
              )}
            </View>

            {/* Recent Transactions Section */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionHeaderLeft}>
                  <Ionicons name="receipt-outline" size={18} color="#111827" />
                  <Text style={styles.sectionTitle}>Recent Transactions</Text>
                </View>
                <Text style={styles.sectionBadge}>{transactions.length} records</Text>
              </View>

              {transactions.length === 0 ? (
                <View style={styles.emptyWrapper}>
                  <Ionicons name="receipt-outline" size={32} color="#D1D5DB" />
                  <Text style={styles.emptyText}>No transactions recorded yet</Text>
                  <TouchableOpacity
                    onPress={() => setAddTxVisible(true)}
                    style={styles.emptyAddBtn}
                  >
                    <Text style={styles.emptyAddBtnText}>Add First Transaction</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                transactions.slice(0, 15).map((t) => {
                  const isExp = t.type === 'expense';
                  const dateStr = t.date
                    ? new Date(t.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Recent';

                  return (
                    <View key={t._id || t.id || `${t.topic}-${t.amount}`} style={styles.txRow}>
                      <View style={styles.txLeft}>
                        <View
                          style={[
                            styles.txIconWrap,
                            isExp ? styles.txIconWrapExpense : styles.txIconWrapIncome,
                          ]}
                        >
                          <Ionicons
                            name={isExp ? 'arrow-down' : 'arrow-up'}
                            size={14}
                            color={isExp ? '#DC2626' : '#059669'}
                          />
                        </View>
                        <View style={styles.txInfo}>
                          <Text style={styles.txTitle} numberOfLines={1}>
                            {t.topic || 'General'}
                          </Text>
                          <Text style={styles.txCategory}>
                            {t.category} • {dateStr}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.txRight}>
                        <Text
                          style={[
                            styles.txAmount,
                            isExp ? styles.txAmountExpense : styles.txAmountIncome,
                          ]}
                        >
                          {isExp ? '-' : '+'}₹{t.amount.toLocaleString('en-IN')}
                        </Text>
                        {t._id ? (
                          <TouchableOpacity
                            onPress={() =>
                              handleDeleteTransaction(t._id!, t.topic || t.category)
                            }
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            style={styles.trashBtn}
                          >
                            <Ionicons name="trash-outline" size={14} color="#9CA3AF" />
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        visible={addTxVisible}
        onClose={() => setAddTxVisible(false)}
        onSuccess={fetchDashboardData}
      />

      {/* Set Budget Modal */}
      <SetBudgetModal
        visible={setBudgetVisible}
        onClose={() => setSetBudgetVisible(false)}
        onSuccess={fetchDashboardData}
      />
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
  loadingWrapper: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#111827',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  heroCard: {
    backgroundColor: '#FACC15',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#713F12',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  ratioBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  ratioBadgePositive: {},
  ratioBadgeNegative: {
    backgroundColor: '#FEE2E2',
  },
  ratioBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  ratioBadgeTextPositive: {
    color: '#047857',
  },
  ratioBadgeTextNegative: {
    color: '#B91C1C',
  },
  heroSubtext: {
    fontSize: 13,
    color: '#854D0E',
    fontWeight: '600',
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  metricCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricCardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  incomeIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  incomeAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
  },
  expenseAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
  },
  metricCardSubtext: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
    fontWeight: '500',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  sectionBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  setBudgetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  setBudgetBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
  },
  allocationRow: {
    flexDirection: 'row',
    gap: 8,
  },
  allocationItem: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
  },
  allocationPercent: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  allocationCategory: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
    marginTop: 2,
    textAlign: 'center',
  },
  allocationValue: {
    fontSize: 13,
    fontWeight: '900',
    color: '#111827',
    marginTop: 4,
  },
  budgetItem: {
    marginBottom: 14,
  },
  budgetRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  budgetCatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  budgetName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  overBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  overBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#DC2626',
    textTransform: 'uppercase',
  },
  budgetRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  budgetNumbers: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  trashBtn: {
    padding: 4,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressNormal: {
    backgroundColor: '#10B981',
  },
  progressWarn: {
    backgroundColor: '#F59E0B',
  },
  progressOver: {
    backgroundColor: '#EF4444',
  },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  txIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txIconWrapExpense: {
    backgroundColor: '#FEE2E2',
  },
  txIconWrapIncome: {
    backgroundColor: '#D1FAE5',
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  txCategory: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  txRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '800',
  },
  txAmountExpense: {
    color: '#DC2626',
  },
  txAmountIncome: {
    color: '#059669',
  },
  emptyWrapper: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  emptyAddBtn: {
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 4,
  },
  emptyAddBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
