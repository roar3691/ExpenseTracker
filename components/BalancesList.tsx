import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { colors } from '@/constants/colors';
import { UserBalance } from '@/types';
import { UserAvatar } from './UserAvatar';
import { formatCurrency } from '@/utils/formatters';
import { currentUser } from '@/constants/mockData';

type BalancesListProps = {
  balances: UserBalance[];
};

export const BalancesList: React.FC<BalancesListProps> = ({ balances }) => {
  // Filter out the current user and zero balances
  const filteredBalances = balances.filter(
    balance => balance.user.id !== currentUser.id && balance.amount !== 0
  );
  
  if (filteredBalances.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No outstanding balances</Text>
      </View>
    );
  }
  
  const renderItem = ({ item }: { item: UserBalance }) => {
    const isPositive = item.amount > 0;
    
    return (
      <View style={styles.balanceItem}>
        <View style={styles.userInfo}>
          <UserAvatar uri={item.user.avatar} name={item.user.name} size={40} />
          <Text style={styles.userName}>{item.user.name}</Text>
        </View>
        
        <View style={[
          styles.amountContainer,
          isPositive ? styles.positiveContainer : styles.negativeContainer
        ]}>
          <Text style={[
            styles.amountText,
            isPositive ? styles.positiveText : styles.negativeText
          ]}>
            {isPositive 
              ? `owes you ${formatCurrency(Math.abs(item.amount))}` 
              : `you owe ${formatCurrency(Math.abs(item.amount))}`
            }
          </Text>
        </View>
      </View>
    );
  };
  
  return (
    <FlatList
      data={filteredBalances}
      renderItem={renderItem}
      keyExtractor={(item) => item.user.id}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  balanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  amountContainer: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  positiveContainer: {
    backgroundColor: colors.receiveLight,
  },
  negativeContainer: {
    backgroundColor: colors.owedLight,
  },
  amountText: {
    fontSize: 14,
    fontWeight: '600',
  },
  positiveText: {
    color: colors.receive,
  },
  negativeText: {
    color: colors.owed,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});