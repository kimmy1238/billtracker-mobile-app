import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Bill {
  id: string;
  type: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid';
  createdAt: string;
}

interface BillsContextType {
  bills: Bill[];
  loadBills: () => Promise<void>;
  addBill: (bill: Bill) => Promise<void>;
  updateBill: (bill: Bill) => Promise<void>;
  deleteBill: (id: string) => Promise<void>;
}

const BillsContext = createContext<BillsContextType | undefined>(undefined);

export function BillsProvider({ children }: { children: ReactNode }) {
  const [bills, setBills] = useState<Bill[]>([]);

  const loadBills = async () => {
    try {
      const storedBills = await AsyncStorage.getItem('bills');
      if (storedBills) {
        const parsedBills = JSON.parse(storedBills);
        // Sort bills by due date, most recent first
        const sortedBills = parsedBills.sort((a: Bill, b: Bill) => 
          new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
        );
        setBills(sortedBills);
      }
    } catch (error) {
      console.error('Error loading bills:', error);
    }
  };

  const addBill = async (newBill: Bill) => {
    try {
      const updatedBills = [...bills, newBill];
      await AsyncStorage.setItem('bills', JSON.stringify(updatedBills));
      setBills(updatedBills.sort((a, b) => 
        new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
      ));
    } catch (error) {
      console.error('Error adding bill:', error);
      throw error;
    }
  };

  const updateBill = async (updatedBill: Bill) => {
    try {
      const updatedBills = bills.map(bill =>
        bill.id === updatedBill.id ? updatedBill : bill
      );
      await AsyncStorage.setItem('bills', JSON.stringify(updatedBills));
      setBills(updatedBills.sort((a, b) => 
        new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
      ));
    } catch (error) {
      console.error('Error updating bill:', error);
      throw error;
    }
  };

  const deleteBill = async (id: string) => {
    try {
      const updatedBills = bills.filter(bill => bill.id !== id);
      await AsyncStorage.setItem('bills', JSON.stringify(updatedBills));
      setBills(updatedBills);
    } catch (error) {
      console.error('Error deleting bill:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  return (
    <BillsContext.Provider value={{ bills, loadBills, addBill, updateBill, deleteBill }}>
      {children}
    </BillsContext.Provider>
  );
}

export function useBills() {
  const context = useContext(BillsContext);
  if (context === undefined) {
    throw new Error('useBills must be used within a BillsProvider');
  }
  return context;
} 