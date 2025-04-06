import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { formatCurrency } from '@/utils/formatters';

type AmountSummaryProps = {
  totalOwed: number;
  totalToReceive: number;
};

export const AmountSummary: React.FC<AmountSummaryProps> = ({ 
  totalOwed, 
  totalToReceive 
}) => {
  const netBalance = totalToReceive - totalOwed;
  
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.card, styles.owedCard]}>
          <Text style={styles.label}>You owe</Text>
          <Text style={[styles.amount, styles.owedAmount]}>
            {formatCurrency(totalOwed)}
          </Text>
        </View>
        
        <View style={[styles.card, styles.receiveCard]}>
          <Text style={styles.label}>You get back</Text>
          <Text style={[styles.amount, styles.receiveAmount]}>
            {formatCurrency(totalToReceive)}
          </Text>
        </View>
      </View>
      
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>
          {netBalance >= 0 ? 'Total balance' : 'Total you owe'}
        </Text>
        <Text style={[
          styles.totalAmount,
          netBalance >= 0 ? styles.receiveAmount : styles.owedAmount
        ]}>
          {formatCurrency(Math.abs(netBalance))}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
  },
  owedCard: {
    backgroundColor: colors.owedLight,
  },
  receiveCard: {
    backgroundColor: colors.receiveLight,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
  },
  owedAmount: {
    color: colors.owed,
  },
  receiveAmount: {
    color: colors.receive,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
});