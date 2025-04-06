import { Expense, GroupSummary, UserBalance } from '@/types';
import { getUserById, currentUser } from '@/constants/mockData';

// Calculate the total amount owed or to be received by the current user
export const calculateTotalBalance = (groupSummaries: GroupSummary[]): number => {
  let total = 0;
  
  groupSummaries.forEach(summary => {
    const userBalance = summary.balances.find(balance => balance.userId === currentUser.id);
    if (userBalance) {
      total += userBalance.amount;
    }
  });
  
  return total;
};

// Calculate balances for a specific group based on expenses
export const calculateGroupBalances = (expenses: Expense[], groupId: string): GroupSummary => {
  const balances: { [key: string]: number } = {};
  
  // Process each expense
  expenses
    .filter(expense => expense.groupId === groupId)
    .forEach(expense => {
      // Add credit to the person who paid
      if (!balances[expense.paidBy]) {
        balances[expense.paidBy] = 0;
      }
      balances[expense.paidBy] += expense.amount;
      
      // Subtract from people who owe
      expense.splits.forEach(split => {
        if (!balances[split.userId]) {
          balances[split.userId] = 0;
        }
        balances[split.userId] -= split.amount;
      });
    });
  
  // Convert to array format
  const balancesArray = Object.entries(balances).map(([userId, amount]) => ({
    userId,
    amount,
  }));
  
  return {
    groupId,
    balances: balancesArray,
  };
};

// Get user balances with user details for display
export const getUserBalances = (groupSummary: GroupSummary): UserBalance[] => {
  return groupSummary.balances.map(balance => ({
    user: getUserById(balance.userId),
    amount: balance.amount,
  }));
};

// Calculate equal splits for an expense
export const calculateEqualSplits = (amount: number, userIds: string[]): { userId: string; amount: number }[] => {
  const splitAmount = amount / userIds.length;
  
  return userIds.map(userId => ({
    userId,
    amount: parseFloat(splitAmount.toFixed(2)),
  }));
};