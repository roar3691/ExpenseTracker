import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { 
  User, 
  CreditCard, 
  Bell, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Settings,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { UserAvatar } from '@/components/UserAvatar';
import { currentUser } from '@/constants/mockData';
import { useExpenseStore } from '@/stores/expenseStore';
import { calculateTotalBalance } from '@/utils/calculations';
import { formatCurrency } from '@/utils/formatters';

type MenuItem = {
  icon: React.ElementType;
  title: string;
  subtitle: string;
};

export default function ProfileScreen() {
  const { getAllGroupSummaries } = useExpenseStore();
  
  const groupSummaries = getAllGroupSummaries();
  const totalBalance = calculateTotalBalance(groupSummaries);
  
  const menuItems: MenuItem[] = [
    {
      icon: User,
      title: 'Account Settings',
      subtitle: 'Manage your personal information',
    },
    {
      icon: CreditCard,
      title: 'Payment Methods',
      subtitle: 'Add or remove payment options',
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Configure your notification preferences',
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get help with the app',
    },
    {
      icon: Settings,
      title: 'App Settings',
      subtitle: 'Customize your app experience',
    },
  ];
  
  const renderMenuItem = (item: MenuItem, index: number) => {
    const Icon = item.icon;
    
    return (
      <TouchableOpacity key={index} style={styles.menuItem}>
        <View style={styles.menuIconContainer}>
          <Icon size={20} color={colors.primary} />
        </View>
        
        <View style={styles.menuContent}>
          <Text style={styles.menuTitle}>{item.title}</Text>
          <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
        </View>
        
        <ChevronRight size={20} color={colors.textLight} />
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <UserAvatar 
              uri={currentUser.avatar} 
              name={currentUser.name} 
              size={80} 
            />
            
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{currentUser.name}</Text>
              <Text style={styles.email}>{currentUser.email}</Text>
            </View>
          </View>
          
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>
              {totalBalance >= 0 ? 'Total Balance' : 'Total Owed'}
            </Text>
            <Text style={[
              styles.balanceAmount,
              totalBalance >= 0 ? styles.positiveBalance : styles.negativeBalance
            ]}>
              {formatCurrency(Math.abs(totalBalance))}
            </Text>
            <Text style={styles.balanceDescription}>
              {totalBalance >= 0 
                ? 'Overall, you are owed money' 
                : 'Overall, you owe money'
              }
            </Text>
          </View>
        </View>
        
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {menuItems.map(renderMenuItem)}
        </View>
        
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color={colors.owed} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  nameContainer: {
    marginLeft: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  balanceCard: {
    backgroundColor: colors.secondaryLight,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  positiveBalance: {
    color: colors.receive,
  },
  negativeBalance: {
    color: colors.owed,
  },
  balanceDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  menuSection: {
    backgroundColor: colors.background,
    marginTop: 20,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: 20,
    marginVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.owed,
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
    fontSize: 14,
    color: colors.textLight,
  },
});