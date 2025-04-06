import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { 
  Plus, 
  Users, 
  ArrowLeft,
  MoreVertical,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { ExpenseCard } from '@/components/ExpenseCard';
import { AddExpenseModal } from '@/components/AddExpenseModal';
import { BalancesList } from '@/components/BalancesList';
import { useGroupStore } from '@/stores/groupStore';
import { useExpenseStore } from '@/stores/expenseStore';
import { getUserBalances } from '@/utils/calculations';
import { formatCurrency } from '@/utils/formatters';
import { currentUser } from '@/constants/mockData';
import { Expense, ExpenseSplit, SplitType } from '@/types';

export default function GroupDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isAddExpenseModalVisible, setIsAddExpenseModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('expenses');
  
  const { getGroup } = useGroupStore();
  const { 
    getExpensesByGroup, 
    addExpense, 
    getGroupSummary,
  } = useExpenseStore();
  
  const group = getGroup(id as string);
  const expenses = getExpensesByGroup(id as string);
  const groupSummary = getGroupSummary(id as string);
  const userBalances = getUserBalances(groupSummary);
  
  // Find current user's balance
  const currentUserBalance = groupSummary.balances.find(
    balance => balance.userId === currentUser.id
  );
  const balance = currentUserBalance ? currentUserBalance.amount : 0;
  
  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const handleAddExpense = (
    title: string,
    description: string,
    amount: number,
    category: string,
    paidBy: string,
    splitType: SplitType,
    splits: ExpenseSplit[]
  ) => {
    addExpense(
      id as string,
      title,
      description,
      amount,
      category,
      paidBy,
      splitType,
      splits
    );
  };
  
  const renderExpenseCard = ({ item }: { item: Expense }) => (
    <ExpenseCard expense={item} />
  );
  
  const renderEmptyExpenses = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Expenses Yet</Text>
      <Text style={styles.emptyDescription}>
        Add your first expense to start tracking.
      </Text>
      <TouchableOpacity 
        style={styles.emptyButton}
        onPress={() => setIsAddExpenseModalVisible(true)}
      >
        <Text style={styles.emptyButtonText}>Add First Expense</Text>
      </TouchableOpacity>
    </View>
  );
  
  if (!group) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Group not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>{group.name}</Text>
          
          <TouchableOpacity style={styles.moreButton}>
            <MoreVertical size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerContent}>
          <Image 
            source={{ uri: group.image }} 
            style={styles.groupImage}
          />
          
          <View style={styles.groupInfo}>
            <Text style={styles.groupDescription}>{group.description}</Text>
            
            <View style={styles.membersInfo}>
              <Users size={16} color={colors.textSecondary} />
              <Text style={styles.membersText}>
                {group.members.length} members
              </Text>
            </View>
          </View>
        </View>
        
        {balance !== 0 && (
          <View style={[
            styles.balanceContainer,
            balance > 0 ? styles.positiveContainer : styles.negativeContainer
          ]}>
            <Text style={styles.balanceLabel}>
              {balance > 0 ? 'In total, you are owed' : 'In total, you owe'}
            </Text>
            <Text style={[
              styles.balanceAmount,
              balance > 0 ? styles.positiveAmount : styles.negativeAmount
            ]}>
              {formatCurrency(Math.abs(balance))}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[
            styles.tab,
            activeTab === 'expenses' && styles.activeTab
          ]}
          onPress={() => setActiveTab('expenses')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'expenses' && styles.activeTabText
          ]}>
            Expenses
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab,
            activeTab === 'balances' && styles.activeTab
          ]}
          onPress={() => setActiveTab('balances')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'balances' && styles.activeTabText
          ]}>
            Balances
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'expenses' ? (
        <FlatList
          data={sortedExpenses}
          renderItem={renderExpenseCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={renderEmptyExpenses}
        />
      ) : (
        <BalancesList balances={userBalances} />
      )}
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setIsAddExpenseModalVisible(true)}
      >
        <Plus size={24} color={colors.background} />
      </TouchableOpacity>
      
      <AddExpenseModal
        visible={isAddExpenseModalVisible}
        onClose={() => setIsAddExpenseModalVisible(false)}
        onSave={handleAddExpense}
        groupMembers={group.members}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  header: {
    backgroundColor: colors.background,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  moreButton: {
    padding: 4,
  },
  headerContent: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  groupImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  groupInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  groupDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  membersInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  membersText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  balanceContainer: {
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 8,
  },
  positiveContainer: {
    backgroundColor: colors.receiveLight,
  },
  negativeContainer: {
    backgroundColor: colors.owedLight,
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  positiveAmount: {
    color: colors.receive,
  },
  negativeAmount: {
    color: colors.owed,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '500',
  },
  list: {
    padding: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
  },
});