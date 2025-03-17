import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
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

export default function Dashboard() {
  const { bills } = useBills();
  const totalDue = bills
    .filter(bill => bill.status === 'Unpaid')
    .reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bills Overview</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total Amount Due</Text>
        <Text style={styles.totalAmount}>₱{totalDue.toFixed(2)}</Text>
        <View style={styles.divider} />
        <Text style={styles.summarySubtitle}>Current Balance</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Bills</Text>
        {bills.filter(bill => bill.status === 'Unpaid').length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No upcoming bills</Text>
          </View>
        ) : (
          bills
            .filter(bill => bill.status === 'Unpaid')
            .map((bill) => (
              <View key={bill.id} style={styles.billCard}>
                <View style={styles.billHeader}>
                  <Text style={styles.billType}>{bill.type}</Text>
                  <Text style={styles.billAmount}>₱{bill.amount.toFixed(2)}</Text>
                </View>
                <Text style={styles.billDate}>
                  Due: {new Date(bill.dueDate).toLocaleDateString()}
                </Text>
              </View>
            ))
        )}
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

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
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '500',
  },
  content: {
    padding: 16,
  },
  summaryCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 20,
    margin: 16,
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
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalAmount: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginVertical: 16,
  },
  divider: {
    width: '30%',
    height: 2,
    backgroundColor: COLORS.border,
    marginBottom: 12,
  },
  summarySubtitle: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.8,
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
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
    marginTop: 8,
  },
  billCard: {
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
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  billType: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  billAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },
  billDate: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '500',
  },
});
