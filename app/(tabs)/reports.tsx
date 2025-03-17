import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useMemo } from 'react';
import { useBills } from '../../context/BillsContext';

const COLORS = {
  primary: '#B47B84', // Dusty Rose
  secondary: '#9CAF88', // Muted Sage
  background: '#F8F4F4', // Light Rose
  text: '#4A4A4A', // Dark Gray
  border: '#D4C1C4', // Light Dusty Rose
  cardBg: '#FFFFFF',
  accent: '#E2B4BB', // Lighter Dusty Rose
};

interface Bill {
  id: string;
  type: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid';
  createdAt: string;
}

interface BillSummary {
  type: string;
  total: number;
  count: number;
  paid: number;
  unpaid: number;
}

export default function Reports() {
  const { bills } = useBills();

  const { summaries, totalStats } = useMemo(() => {
    const summaryMap = new Map<string, BillSummary>();
    let totalAmount = 0;
    let totalPaid = 0;
    let totalUnpaid = 0;

    bills.forEach(bill => {
      // Update type-specific summary
      const existing = summaryMap.get(bill.type) || {
        type: bill.type,
        total: 0,
        count: 0,
        paid: 0,
        unpaid: 0,
      };

      existing.total += bill.amount;
      existing.count += 1;
      if (bill.status === 'Paid') {
        existing.paid += bill.amount;
      } else {
        existing.unpaid += bill.amount;
      }

      summaryMap.set(bill.type, existing);

      // Update total stats
      totalAmount += bill.amount;
      if (bill.status === 'Paid') {
        totalPaid += bill.amount;
      } else {
        totalUnpaid += bill.amount;
      }
    });

    return {
      summaries: Array.from(summaryMap.values()),
      totalStats: {
        total: totalAmount,
        paid: totalPaid,
        unpaid: totalUnpaid,
        count: bills.length,
      }
    };
  }, [bills]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reports & Analytics</Text>
      </View>

      <View style={styles.overviewCard}>
        <Text style={styles.cardTitle}>Overall Summary</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>₱{totalStats.total.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Amount</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: COLORS.secondary }]}>
              ₱{totalStats.paid.toFixed(2)}
            </Text>
            <Text style={styles.statLabel}>Total Paid</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: COLORS.primary }]}>
              ₱{totalStats.unpaid.toFixed(2)}
            </Text>
            <Text style={styles.statLabel}>Total Unpaid</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalStats.count}</Text>
            <Text style={styles.statLabel}>Total Bills</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Breakdown by Type</Text>
        {summaries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No data available</Text>
          </View>
        ) : (
          summaries.map((summary) => (
            <View key={summary.type} style={styles.summaryCard}>
              <Text style={styles.summaryType}>{summary.type}</Text>
              <View style={styles.summaryDetails}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total Amount:</Text>
                  <Text style={styles.summaryValue}>₱{summary.total.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Paid:</Text>
                  <Text style={[styles.summaryValue, { color: COLORS.secondary }]}>
                    ₱{summary.paid.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Unpaid:</Text>
                  <Text style={[styles.summaryValue, { color: COLORS.primary }]}>
                    ₱{summary.unpaid.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Number of Bills:</Text>
                  <Text style={styles.summaryValue}>{summary.count}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  overviewCard: {
    backgroundColor: COLORS.cardBg,
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.8,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryType: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  summaryDetails: {
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.8,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
  },
});
