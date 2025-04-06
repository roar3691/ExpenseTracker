import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { colors } from '@/constants/colors';
import { ExpenseCard } from '@/components/ExpenseCard';
import { useExpenseStore } from '@/stores/expenseStore';
import { formatDate } from '@/utils/formatters';
import { Expense } from '@/types';

type ExpenseSection = {
  date: string;
  data: Expense[];
};

export default function ActivityScreen() {
  const { expenses } = useExpenseStore();
  
  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Group expenses by date
  const groupedExpenses: Record<string, Expense[]> = sortedExpenses.reduce((groups, expense) => {
    const date = formatDate(expense.date);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(expense);
    return groups;
  }, {} as Record<string, Expense[]>);
  
  // Convert to array for FlatList
  const sections: ExpenseSection[] = Object.keys(groupedExpenses).map(date => ({
    date,
    data: groupedExpenses[date],
  }));
  
  const renderExpenseCard = ({ item }: { item: Expense }) => (
    <ExpenseCard expense={item} />
  );
  
  const renderSectionHeader = ({ section }: { section: ExpenseSection }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionDate}>{section.date}</Text>
    </View>
  );
  
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Activity Yet</Text>
      <Text style={styles.emptyDescription}>
        When you add expenses, they will appear here.
      </Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Recent Activity</Text>
      </View>
      
      {sections.length > 0 ? (
        <FlatList
          data={sections}
          renderItem={({ item }: { item: ExpenseSection }) => (
            <View>
              {renderSectionHeader({ section: item })}
              {item.data.map((expense: Expense) => (
                <View key={expense.id} style={styles.expenseContainer}>
                  {renderExpenseCard({ item: expense })}
                </View>
              ))}
            </View>
          )}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.list}
        />
      ) : (
        renderEmptyList()
      )}
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  list: {
    paddingBottom: 20,
  },
  sectionHeader: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  sectionDate: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  expenseContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
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
  },
});