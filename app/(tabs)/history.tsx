import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react-native';
import { useBills } from '../../context/BillsContext';
import ConfirmationModal from '../../components/ConfirmationModal';

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

export default function History() {
  const { bills, updateBill, deleteBill } = useBills();
  const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await deleteBill(id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting bill:', error);
    }
  };

  const handleEdit = async (bill: Bill) => {
    const newStatus: 'Paid' | 'Unpaid' = bill.status === 'Paid' ? 'Unpaid' : 'Paid';
    try {
      await updateBill({ ...bill, status: newStatus });
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating bill:', error);
    }
  };

  const openDeleteModal = (bill: Bill) => {
    setSelectedBill(bill);
    setShowDeleteModal(true);
  };

  const openEditModal = (bill: Bill) => {
    setSelectedBill(bill);
    setShowEditModal(true);
  };

  const filteredBills = bills.filter(bill => {
    if (filter === 'all') return true;
    return bill.status.toLowerCase() === filter;
  });

  const FilterButton = ({ title, value }: { title: string; value: typeof filter }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === value && styles.filterButtonActive,
      ]}
      onPress={() => setFilter(value)}>
      <Text
        style={[
          styles.filterButtonText,
          filter === value && styles.filterButtonTextActive,
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bills History</Text>
      </View>

      <View style={styles.filterContainer}>
        <FilterButton title="All" value="all" />
        <FilterButton title="Paid" value="paid" />
        <FilterButton title="Unpaid" value="unpaid" />
      </View>

      <ScrollView style={styles.content}>
        {filteredBills.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No bills found</Text>
          </View>
        ) : (
          filteredBills.map((bill) => (
            <View key={bill.id} style={styles.billCard}>
              <View style={styles.billHeader}>
                <View style={styles.billInfo}>
                  <Text style={styles.billType}>{bill.type}</Text>
                  <View style={[
                    styles.statusBadge,
                    bill.status === 'Paid' ? styles.statusPaid : styles.statusUnpaid
                  ]}>
                    <Text style={styles.statusText}>
                      {bill.status === 'Paid' ? 'Paid' : 'Due'}
                    </Text>
                  </View>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => openEditModal(bill)}>
                    <Pencil size={18} color={COLORS.secondary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => openDeleteModal(bill)}>
                    <Trash2 size={18} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.billAmount}>₱{bill.amount.toFixed(2)}</Text>
              <Text style={styles.billDate}>
                Due: {new Date(bill.dueDate).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <ConfirmationModal
        visible={showDeleteModal}
        title="Delete Bill"
        message={`Are you sure you want to delete this ${selectedBill?.type} bill?`}
        onConfirm={() => selectedBill && handleDelete(selectedBill.id)}
        onCancel={() => setShowDeleteModal(false)}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ConfirmationModal
        visible={showEditModal}
        title="Edit Bill Status"
        message={`Change status of ${selectedBill?.type} bill to ${
          selectedBill?.status === 'Paid' ? 'Unpaid' : 'Paid'
        }?`}
        onConfirm={() => selectedBill && handleEdit(selectedBill)}
        onCancel={() => setShowEditModal(false)}
        confirmText={`Mark as ${selectedBill?.status === 'Paid' ? 'Unpaid' : 'Paid'}`}
        cancelText="Cancel"
      />
    </View>
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
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.cardBg,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
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
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  billInfo: {
    flex: 1,
  },
  billType: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  statusPaid: {
    backgroundColor: COLORS.secondary,
  },
  statusUnpaid: {
    backgroundColor: COLORS.primary,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
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
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: COLORS.secondary + '20', // 20% opacity
  },
  deleteButton: {
    backgroundColor: COLORS.primary + '20', // 20% opacity
  },
});
