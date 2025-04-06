import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, categoryColors } from '@/constants/colors';
import { Expense } from '@/types';
import { UserAvatar } from './UserAvatar';
import { getUserById, currentUser } from '@/constants/mockData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { getCategoryById } from '@/constants/categories';

type ExpenseCardProps = {
  expense: Expense;
  onPress?: () => void;
};

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ 
  expense,
  onPress
}) => {
  const payer = getUserById(expense.paidBy);
  const category = getCategoryById(expense.category);
  const CategoryIcon = category.icon;
  
  // Find the current user's split
  const userSplit = expense.splits.find(split => split.userId === currentUser.id);
  const userAmount = userSplit ? userSplit.amount : 0;
  
  // Determine if the current user paid or owes
  const isPayer = expense.paidBy === currentUser.id;
  const isSettled = isPayer && userAmount === expense.amount;
  
  // Calculate the amount to display
  let displayAmount = 0;
  let displayText = '';
  
  if (isPayer) {
    // If current user paid
    displayAmount = expense.amount - userAmount;
    displayText = displayAmount > 0 ? 'You lent' : 'You paid for yourself';
  } else {
    // If someone else paid
    displayAmount = userAmount;
    displayText = 'You owe';
  }
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
          <CategoryIcon size={20} color="#fff" />
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{expense.title}</Text>
          <Text style={styles.date}>{formatDate(expense.date)}</Text>
        </View>
        
        <View style={styles.details}>
          <View style={styles.payerInfo}>
            <UserAvatar 
              uri={payer.avatar} 
              name={payer.name} 
              size={20} 
            />
            <Text style={styles.payerName}>
              {payer.id === currentUser.id ? 'You paid' : `${payer.name} paid`}
            </Text>
          </View>
          
          <Text style={styles.amount}>
            {formatCurrency(expense.amount)}
          </Text>
        </View>
        
        {!isSettled && (
          <View style={[
            styles.balanceContainer,
            isPayer ? styles.positiveContainer : styles.negativeContainer
          ]}>
            <Text style={[
              styles.balanceText,
              isPayer ? styles.positiveText : styles.negativeText
            ]}>
              {displayText} {formatCurrency(Math.abs(displayAmount))}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    padding: 12,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  date: {
    fontSize: 12,
    color: colors.textLight,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  payerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  payerName: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  amount: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  balanceContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  positiveContainer: {
    backgroundColor: colors.receiveLight,
  },
  negativeContainer: {
    backgroundColor: colors.owedLight,
  },
  balanceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  positiveText: {
    color: colors.receive,
  },
  negativeText: {
    color: colors.owed,
  },
});