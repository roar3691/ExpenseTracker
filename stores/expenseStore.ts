import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense, ExpenseSplit, SplitType, GroupSummary } from '@/types';
import { generateId } from '@/utils/formatters';
import { calculateGroupBalances } from '@/utils/calculations';

interface ExpenseState {
  expenses: Expense[];
  addExpense: (
    groupId: string,
    title: string,
    description: string,
    amount: number,
    category: string,
    paidBy: string,
    splitType: SplitType,
    splits: ExpenseSplit[]
  ) => Expense;
  getExpense: (id: string) => Expense | undefined;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  getExpensesByGroup: (groupId: string) => Expense[];
  getGroupSummary: (groupId: string) => GroupSummary;
  getAllGroupSummaries: () => GroupSummary[];
}

// Initial expenses for demo purposes
const initialExpenses: Expense[] = [
  {
    id: 'expense-1',
    groupId: 'group-1',
    title: 'Groceries',
    description: 'Weekly groceries from BigBasket',
    amount: 2400,
    category: 'food',
    date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    paidBy: 'user-1',
    splitType: 'equal',
    splits: [
      { userId: 'user-1', amount: 800 },
      { userId: 'user-2', amount: 800 },
      { userId: 'user-3', amount: 800 },
    ],
  },
  {
    id: 'expense-2',
    groupId: 'group-1',
    title: 'Electricity Bill',
    description: 'March electricity bill',
    amount: 1500,
    category: 'utilities',
    date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    paidBy: 'user-2',
    splitType: 'equal',
    splits: [
      { userId: 'user-1', amount: 500 },
      { userId: 'user-2', amount: 500 },
      { userId: 'user-3', amount: 500 },
    ],
  },
  {
    id: 'expense-3',
    groupId: 'group-2',
    title: 'Hotel Booking',
    description: 'Beachside resort for 3 nights',
    amount: 15000,
    category: 'travel',
    date: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    paidBy: 'user-4',
    splitType: 'equal',
    splits: [
      { userId: 'user-1', amount: 5000 },
      { userId: 'user-4', amount: 5000 },
      { userId: 'user-5', amount: 5000 },
    ],
  },
  {
    id: 'expense-4',
    groupId: 'group-2',
    title: 'Dinner at Beach Shack',
    description: 'Seafood dinner',
    amount: 3600,
    category: 'food',
    date: new Date(Date.now() - 86400000 * 9).toISOString(), // 9 days ago
    paidBy: 'user-1',
    splitType: 'equal',
    splits: [
      { userId: 'user-1', amount: 1200 },
      { userId: 'user-4', amount: 1200 },
      { userId: 'user-5', amount: 1200 },
    ],
  },
];

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      expenses: initialExpenses,
      
      addExpense: (
        groupId,
        title,
        description,
        amount,
        category,
        paidBy,
        splitType,
        splits
      ) => {
        const newExpense: Expense = {
          id: `expense-${generateId()}`,
          groupId,
          title,
          description,
          amount,
          category,
          date: new Date().toISOString(),
          paidBy,
          splitType,
          splits,
        };
        
        set(state => ({
          expenses: [...state.expenses, newExpense],
        }));
        
        return newExpense;
      },
      
      getExpense: (id) => {
        return get().expenses.find(expense => expense.id === id);
      },
      
      updateExpense: (id, updates) => {
        set(state => ({
          expenses: state.expenses.map(expense => 
            expense.id === id ? { ...expense, ...updates } : expense
          ),
        }));
      },
      
      deleteExpense: (id) => {
        set(state => ({
          expenses: state.expenses.filter(expense => expense.id !== id),
        }));
      },
      
      getExpensesByGroup: (groupId) => {
        return get().expenses.filter(expense => expense.groupId === groupId);
      },
      
      getGroupSummary: (groupId) => {
        return calculateGroupBalances(get().expenses, groupId);
      },
      
      getAllGroupSummaries: () => {
        const groupIds = [...new Set(get().expenses.map(expense => expense.groupId))];
        return groupIds.map(groupId => calculateGroupBalances(get().expenses, groupId));
      },
    }),
    {
      name: 'expense-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);