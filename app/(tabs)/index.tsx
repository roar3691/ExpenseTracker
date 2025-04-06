import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { GroupCard } from '@/components/GroupCard';
import { AddGroupModal } from '@/components/AddGroupModal';
import { AmountSummary } from '@/components/AmountSummary';
import { useGroupStore } from '@/stores/groupStore';
import { useExpenseStore } from '@/stores/expenseStore';
import { calculateTotalBalance } from '@/utils/calculations';
import { currentUser } from '@/constants/mockData';
import { Group } from '@/types';

export default function HomeScreen() {
  const [isAddGroupModalVisible, setIsAddGroupModalVisible] = useState(false);
  const { groups, addGroup } = useGroupStore();
  const { getAllGroupSummaries } = useExpenseStore();
  
  const groupSummaries = getAllGroupSummaries();
  
  // Calculate total owed and to receive
  const totalOwed = groupSummaries.reduce((total, summary) => {
    const userBalance = summary.balances.find(b => b.userId === currentUser.id);
    if (userBalance && userBalance.amount < 0) {
      return total + Math.abs(userBalance.amount);
    }
    return total;
  }, 0);
  
  const totalToReceive = groupSummaries.reduce((total, summary) => {
    const userBalance = summary.balances.find(b => b.userId === currentUser.id);
    if (userBalance && userBalance.amount > 0) {
      return total + userBalance.amount;
    }
    return total;
  }, 0);
  
  const handleAddGroup = (name: string, description: string, members: string[], image: string) => {
    addGroup(name, description, members, image);
  };
  
  const renderGroupCard = ({ item }: { item: Group }) => {
    const groupSummary = groupSummaries.find(summary => summary.groupId === item.id);
    const userBalance = groupSummary?.balances.find(balance => balance.userId === currentUser.id);
    const balance = userBalance ? userBalance.amount : 0;
    
    return <GroupCard group={item} balance={balance} />;
  };
  
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Groups Yet</Text>
      <Text style={styles.emptyDescription}>
        Create a group to start tracking expenses with friends, roommates, or travel buddies.
      </Text>
      <TouchableOpacity 
        style={styles.emptyButton}
        onPress={() => setIsAddGroupModalVisible(true)}
      >
        <Text style={styles.emptyButtonText}>Create Your First Group</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {currentUser.name.split(' ')[0]}</Text>
        <Text style={styles.subtitle}>Track and split expenses with friends</Text>
      </View>
      
      {groups.length > 0 && (
        <AmountSummary 
          totalOwed={totalOwed} 
          totalToReceive={totalToReceive} 
        />
      )}
      
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Your Groups</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setIsAddGroupModalVisible(true)}
        >
          <Plus size={20} color={colors.background} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={groups}
        renderItem={renderGroupCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={renderEmptyList}
      />
      
      <AddGroupModal
        visible={isAddGroupModalVisible}
        onClose={() => setIsAddGroupModalVisible(false)}
        onSave={handleAddGroup}
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexGrow: 1,
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
});