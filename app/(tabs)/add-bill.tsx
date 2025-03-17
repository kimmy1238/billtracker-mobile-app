import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useBills } from '../../context/BillsContext';

type MonthMap = {
  [key: string]: string;
};

const MONTHS: MonthMap = {
  'january': '01', 'jan': '01',
  'february': '02', 'feb': '02',
  'march': '03', 'mar': '03',
  'april': '04', 'apr': '04',
  'may': '05',
  'june': '06', 'jun': '06',
  'july': '07', 'jul': '07',
  'august': '08', 'aug': '08',
  'september': '09', 'sep': '09', 'sept': '09',
  'october': '10', 'oct': '10',
  'november': '11', 'nov': '11',
  'december': '12', 'dec': '12'
};

const COLORS = {
  primary: '#B47B84', // Dusty Rose
  secondary: '#9CAF88', // Muted Sage
  background: '#F8F4F4', // Light Rose
  text: '#4A4A4A', // Dark Gray
  border: '#D4C1C4', // Light Dusty Rose
  success: '#9CAF88', // Using Muted Sage for success
  inputBg: '#FFFFFF',
};

export default function AddBill() {
  const { addBill } = useBills();
  const [billType, setBillType] = useState('Rent');
  const [amount, setAmount] = useState('');
  const [dateText, setDateText] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const parseDateText = (text: string): string | null => {
    // Split the input by common separators
    const parts = text.toLowerCase().split(/[-\s,./]+/).filter(Boolean);
    let day = '', month = '', year = '';

    for (const part of parts) {
      // Check if it's a month name
      if (MONTHS[part]) {
        month = MONTHS[part];
      }
      // Check if it's a year (4 digits)
      else if (part.length === 4 && !isNaN(Number(part))) {
        year = part;
      }
      // Check if it's a day (1-2 digits)
      else if (part.length <= 2 && !isNaN(Number(part)) && Number(part) <= 31) {
        day = part.padStart(2, '0');
      }
    }

    if (month && day && year) {
      return `${year}-${month}-${day}`;
    }
    return null;
  };

  const handleSubmit = async () => {
    const formattedDate = parseDateText(dateText);
    if (!amount) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    if (!formattedDate) {
      Alert.alert('Error', 'Please enter a valid date (e.g., "April 15 2024" or "Apr 15 2024")');
      return;
    }

    try {
      const newBill = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: billType,
        amount: parseFloat(amount),
        dueDate: formattedDate,
        status: 'Unpaid' as const,
        createdAt: new Date().toISOString(),
      };

      await addBill(newBill);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push('/');
      }, 2000);

      setBillType('Rent');
      setAmount('');
      setDateText('');
    } catch (error) {
      console.error('Error saving bill:', error);
      Alert.alert('Error', 'Failed to save bill');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {showSuccess && (
        <View style={styles.successMessage}>
          <Text style={styles.successText}>Bill added successfully! 🎉</Text>
        </View>
      )}
      <View style={styles.form}>
        <Text style={styles.label}>Bill Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={billType}
            onValueChange={(value) => setBillType(value)}
            style={styles.picker}>
            <Picker.Item label="Rent" value="Rent" />
            <Picker.Item label="Wi-Fi" value="Wi-Fi" />
            <Picker.Item label="Electricity" value="Electricity" />
            <Picker.Item label="Water" value="Water" />
          </Picker>
        </View>

        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          placeholder="Enter amount"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.label}>Due Date </Text>
        <TextInput
          style={styles.input}
          placeholder="(Month/ Day/ Year)"
          value={dateText}
          onChangeText={setDateText}
        />
        <Text style={styles.helperText}>
          (e.g., January or Jan)
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Add Bill</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  successMessage: {
    backgroundColor: COLORS.success,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  successText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    backgroundColor: COLORS.inputBg,
    padding: 20,
    borderRadius: 16,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: COLORS.inputBg,
    color: COLORS.text,
  },
  helperText: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 16,
    marginTop: -4,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
