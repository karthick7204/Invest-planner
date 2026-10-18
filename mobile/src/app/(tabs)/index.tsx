import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/Header';
import { AddTransactionModal } from '@/components/AddTransactionModal';
import { apiCall } from '@/services/api';

interface Transaction {
  _id?: string;
  id?: string;
  amount: number;
  category: string;
  topic?: string;
  type?: 'expense' | 'income';
  date?: string;
}

interface Budget {
  _id?: string;
  category: string;
  limit: number;
  spent: number;
}

export default function DashboardScreen() {
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      // 1. Fetch Expenses
      const expenseRes = await apiCall('/expense/expenses').catch(() => null);
      let expSum = 0;
      let expList: Transaction[] = [];
      if (expenseRes && expenseRes.expenses) {
        expList = expenseRes.expenses.map((e: any) => ({
          ...e,
          type: 'expense',
        }));
        expSum = expList.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
      }
      setTotalExpense(expSum);

      // 2. Fetch Incomes
      const incomeRes = await apiCall('/expense/income').catch(() => null);
      let incSum = 0;
      let incList: Transaction[] = [];
      if (incomeRes && incomeRes.incomes) {
        incList = incomeRes.incomes.map((i: any) => ({
          ...i,
          type: 'income',
        }));
        incSum = incList.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
      }
      setTotalIncome(incSum);

      // 3. Combine Recent Transactions sorted by date
      const allTx = [...expList, ...incList].sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });
      setTransactions(allTx.slice(0, 10));

      // 4. Fetch Budgets
      const budgetRes = await apiCall('/budget').catch(() => null);
      if (budgetRes && budgetRes.budgets) {
        // Calculate spent per category
        const catMap: Record<string, number> = {};
        expList.forEach((e) => {
          catMap[e.category] = (catMap[e.category] || 0) + (Number(e.amount) || 0);
        });

        const budgetWithSpent = budgetRes.budgets.map((b: any) => ({
          ...b,
          spent: catMap[b.category] || 0,
        }));
        setBudgets(budgetWithSpent);
      } else {
        // Fallback default budget metrics if not set
        setBudgets([
          { category: 'Food', limit: 8000, spent: expList.filter(e => e.category === 'Food').reduce((s, c) => s + c.amount, 0) },
          { category: 'Shopping', limit: 5000, spent: expList.filter(e => e.category === 'Shopping').reduce((s, c) => s + c.amount, 0) },
          { category: 'Transport', limit: 4000, spent: expList.filter(e => e.category === 'Transport').reduce((s, c) => s + c.amount, 0) },
        ]);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
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

  const netSurplus = totalIncome - totalExpense;
  const savingsRatio = totalIncome > 0 ? Math.round((netSurplus / totalIncome) * 100) : 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header
        title="Financial Overview"
        subtitle="Live metrics & synchronized cashflow"
        rightAction={
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.addBtn}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
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
        {loading ? (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" color="#111827" />
            <Text style={styles.loadingText}>Syncing records from MongoDB...</Text>
          </View>
        ) : (
          <>
            {/* Surplus Hero Card */}
            <View style={styles.heroCard}>
              <View style={styles.heroTopRow}>
                <View>
                  <Text style={styles.heroLabel}>Net Surplus</Text>
                  <Text style={styles.heroAmount}>
                    ₹{Math.abs(netSurplus).toLocaleString('en-IN')}
                    {netSurplus < 0 ? ' (Deficit)' : ''}
                  </Text>
                </View>
                <View
                  style={[
                    styles.ratioBadge,
                    netSurplus < 0 ? styles.ratioBadgeNegative : styles.ratioBadgePositive,
                  ]}
                >
                  <Ionicons
                    name={netSurplus >= 0 ? 'trending-up' : 'trending-down'}
                    size={14}
                    color={netSurplus >= 0 ? '#047857' : '#B91C1C'}
                  />
                  <Text
                    style={[
                      styles.ratioBadgeText,
                      netSurplus < 0 ? styles.ratioBadgeTextNegative : styles.ratioBadgeTextPositive,
                    ]}
                  >
                    {savingsRatio}% Saved
                  </Text>
                </View>
              </View>
              <Text style={styles.heroSubtext}>
                {netSurplus >= 0
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

            {/* Budget Performance Section */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionHeaderLeft}>
                  <Ionicons name="pie-chart" size={18} color="#111827" />
                  <Text style={styles.sectionTitle}>Budget Status</Text>
                </View>
              </View>

              {budgets.length === 0 ? (
                <Text style={styles.emptyText}>No budgets set for this cycle</Text>
              ) : (
                budgets.map((b, idx) => {
                  const percent = b.limit > 0 ? Math.min(100, Math.round((b.spent / b.limit) * 100)) : 0;
                  const isOver = b.spent > b.limit;
                  return (
                    <View key={b.category || idx} style={styles.budgetItem}>
                      <View style={styles.budgetRowTop}>
                        <Text style={styles.budgetName}>{b.category}</Text>
                        <Text style={styles.budgetNumbers}>
                          ₹{b.spent.toLocaleString('en-IN')} / ₹{b.limit.toLocaleString('en-IN')}
                        </Text>
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
                  <Ionicons name="time" size={18} color="#111827" />
                  <Text style={styles.sectionTitle}>Recent Transactions</Text>
                </View>
                <Text style={styles.sectionBadge}>{transactions.length} items</Text>
              </View>

              {transactions.length === 0 ? (
                <View style={styles.emptyWrapper}>
                  <Ionicons name="receipt-outline" size={36} color="#9CA3AF" />
                  <Text style={styles.emptyText}>No transactions recorded yet</Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={styles.emptyAddBtn}
                  >
                    <Text style={styles.emptyAddBtnText}>+ Add First Record</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                transactions.map((tx, idx) => {
                  const isExpense = tx.type === 'expense';
                  const dateStr = tx.date ? new Date(tx.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  }) : 'Recent';

                  return (
                    <View key={tx._id || tx.id || idx} style={styles.txRow}>
                      <View style={styles.txLeft}>
                        <View
                          style={[
                            styles.txIconWrap,
                            isExpense ? styles.txIconWrapExpense : styles.txIconWrapIncome,
                          ]}
                        >
                          <Ionicons
                            name={isExpense ? 'arrow-down' : 'arrow-up'}
                            size={14}
                            color={isExpense ? '#DC2626' : '#059669'}
                          />
                        </View>
                        <View>
                          <Text style={styles.txTitle}>{tx.topic || tx.category}</Text>
                          <Text style={styles.txCategory}>
                            {tx.category} • {dateStr}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.txAmount,
                          isExpense ? styles.txAmountExpense : styles.txAmountIncome,
                        ]}
                      >
                        {isExpense ? '-' : '+'}₹{Number(tx.amount || 0).toLocaleString('en-IN')}
                      </Text>
                    </View>
                  );
                })
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* Add Modal */}
      <AddTransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
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
    paddingBottom: 32,
    gap: 16,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  loadingWrapper: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  heroCard: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 4,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  heroLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
    marginTop: 4,
  },
  ratioBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  ratioBadgePositive: {
    backgroundColor: '#ECFDF5',
  },
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
    color: '#9CA3AF',
    fontWeight: '500',
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
    fontWeight: '800',
    color: '#059669',
    letterSpacing: -0.5,
  },
  expenseAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: -0.5,
  },
  metricCardSubtext: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: 4,
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
  budgetItem: {
    marginBottom: 14,
  },
  budgetRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  budgetName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  budgetNumbers: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
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
    paddingVertical: 32,
    gap: 10,
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
    marginTop: 6,
  },
  emptyAddBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
