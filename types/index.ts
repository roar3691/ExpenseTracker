import { User } from '@/constants/mockData';

export type SplitType = 'equal' | 'custom';

export type ExpenseSplit = {
  userId: string;
  amount: number;
};

export type Expense = {
  id: string;
  groupId: string;
  title: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  paidBy: string;
  splitType: SplitType;
  splits: ExpenseSplit[];
};

export type Group = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  members: string[];
  image: string;
};

export type Balance = {
  userId: string;
  amount: number;
};

export type GroupSummary = {
  groupId: string;
  balances: Balance[];
};

export type UserBalance = {
  user: User;
  amount: number;
};