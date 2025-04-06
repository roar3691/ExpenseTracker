import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { categories, CategoryType } from '@/constants/categories';
import { mockUsers, currentUser } from '@/constants/mockData';
import { UserAvatar } from './UserAvatar';
import { ExpenseSplit, SplitType } from '@/types';
import { calculateEqualSplits } from '@/utils/calculations';
import { formatCurrency } from '@/utils/formatters';

type AddExpenseModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (
    title: string,
    description: string,
    amount: number,
    category: string,
    paidBy: string,
    splitType: SplitType,
    splits: ExpenseSplit[]
  ) => void;
  groupMembers: string[];
};

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ 
  visible, 
  onClose, 
  onSave,
  groupMembers,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(categories[0]);
  const [paidBy, setPaidBy] = useState(currentUser.id);
  const [splitType, setSplitType] = useState<SplitType>('equal');
  const [customSplits, setCustomSplits] = useState<ExpenseSplit[]>([]);
  const [step, setStep] = useState(1);
  
  const members = mockUsers.filter(user => groupMembers.includes(user.id));
  
  useEffect(() => {
    if (visible) {
      resetForm();
    }
  }, [visible]);
  
  useEffect(() => {
    if (amount && splitType === 'equal') {
      const splits = calculateEqualSplits(
        parseFloat(amount), 
        members.map(m => m.id)
      );
      setCustomSplits(splits);
    }
  }, [amount, splitType, members]);
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setAmount('');
    setSelectedCategory(categories[0]);
    setPaidBy(currentUser.id);
    setSplitType('equal');
    setCustomSplits([]);
    setStep(1);
  };
  
  const handleSave = () => {
    if (!isFormValid()) return;
    
    onSave(
      title,
      description,
      parseFloat(amount),
      selectedCategory.id,
      paidBy,
      splitType,
      customSplits
    );
    
    resetForm();
    onClose();
  };
  
  const isFormValid = () => {
    return (
      title.trim() !== '' && 
      amount.trim() !== '' && 
      !isNaN(parseFloat(amount)) && 
      parseFloat(amount) > 0 &&
      customSplits.length > 0 &&
      Math.abs(parseFloat(amount) - customSplits.reduce((sum, split) => sum + split.amount, 0)) < 0.01
    );
  };
  
  const handleAmountChange = (text: string) => {
    // Only allow numbers and a single decimal point
    const filtered = text.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = filtered.split('.');
    const formatted = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : filtered;
    
    setAmount(formatted);
  };
  
  const handleCustomSplitChange = (userId: string, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    
    setCustomSplits(prev => {
      const newSplits = [...prev];
      const index = newSplits.findIndex(split => split.userId === userId);
      
      if (index >= 0) {
        newSplits[index] = { ...newSplits[index], amount: numValue };
      } else {
        newSplits.push({ userId, amount: numValue });
      }
      
      return newSplits;
    });
  };
  
  const getSplitAmount = (userId: string) => {
    const split = customSplits.find(split => split.userId === userId);
    return split ? split.amount.toString() : '0';
  };
  
  const getTotalSplitAmount = () => {
    return customSplits.reduce((sum, split) => sum + split.amount, 0);
  };
  
  const renderStepOne = () => (
    <ScrollView style={styles.form}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="What was this expense for?"
        placeholderTextColor={colors.textLight}
      />
      
      <Text style={styles.label}>Description (Optional)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Add any details"
        placeholderTextColor={colors.textLight}
        multiline
      />
      
      <Text style={styles.label}>Amount</Text>
      <View style={styles.amountContainer}>
        <Text style={styles.currencySymbol}>₹</Text>
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={handleAmountChange}
          placeholder="0.00"
          placeholderTextColor={colors.textLight}
          keyboardType="numeric"
        />
      </View>
      
      <Text style={styles.label}>Category</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryOption,
              selectedCategory.id === category.id && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
              {React.createElement(category.icon, { size: 20, color: '#fff' })}
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
  
  const renderStepTwo = () => (
    <ScrollView style={styles.form}>
      <Text style={styles.label}>Paid by</Text>
      <View style={styles.payerContainer}>
        {members.map(user => (
          <TouchableOpacity
            key={user.id}
            style={[
              styles.payerOption,
              paidBy === user.id && styles.selectedPayer,
            ]}
            onPress={() => setPaidBy(user.id)}
          >
            <UserAvatar uri={user.avatar} name={user.name} size={40} />
            <Text style={styles.payerName}>
              {user.id === currentUser.id ? 'You' : user.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.splitTypeContainer}>
        <Text style={styles.label}>Split Type</Text>
        <View style={styles.splitTypeOptions}>
          <TouchableOpacity
            style={[
              styles.splitTypeOption,
              splitType === 'equal' && styles.selectedSplitType,
            ]}
            onPress={() => setSplitType('equal')}
          >
            <Text style={styles.splitTypeText}>Equal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.splitTypeOption,
              splitType === 'custom' && styles.selectedSplitType,
            ]}
            onPress={() => setSplitType('custom')}
          >
            <Text style={styles.splitTypeText}>Custom</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {splitType === 'custom' && (
        <View style={styles.customSplitContainer}>
          <Text style={styles.label}>Custom Split</Text>
          
          {members.map(user => (
            <View key={user.id} style={styles.customSplitRow}>
              <View style={styles.userInfo}>
                <UserAvatar uri={user.avatar} name={user.name} size={32} />
                <Text style={styles.userName}>
                  {user.id === currentUser.id ? 'You' : user.name}
                </Text>
              </View>
              
              <View style={styles.amountContainer}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={styles.splitAmountInput}
                  value={getSplitAmount(user.id)}
                  onChangeText={(value) => handleCustomSplitChange(user.id, value)}
                  placeholder="0.00"
                  placeholderTextColor={colors.textLight}
                  keyboardType="numeric"
                />
              </View>
            </View>
          ))}
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={[
              styles.totalAmount,
              Math.abs(parseFloat(amount || '0') - getTotalSplitAmount()) > 0.01 && styles.invalidTotal
            ]}>
              {formatCurrency(getTotalSplitAmount())} / {formatCurrency(parseFloat(amount || '0'))}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {step === 1 ? 'Add Expense' : 'Split Details'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.stepIndicator}>
            <View style={[styles.stepDot, styles.activeStep]} />
            <View style={[styles.stepLine, step === 2 && styles.activeStep]} />
            <View style={[styles.stepDot, step === 2 && styles.activeStep]} />
          </View>
          
          {step === 1 ? renderStepOne() : renderStepTwo()}
          
          <View style={styles.footer}>
            {step === 2 ? (
              <>
                <TouchableOpacity 
                  style={[styles.button, styles.backButton]} 
                  onPress={() => setStep(1)}
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.button, 
                    styles.saveButton,
                    !isFormValid() && styles.disabledButton,
                  ]} 
                  onPress={handleSave}
                  disabled={!isFormValid()}
                >
                  <Text style={styles.saveButtonText}>Save Expense</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={onClose}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.button, 
                    styles.nextButton,
                    (title.trim() === '' || amount.trim() === '' || parseFloat(amount) <= 0) && styles.disabledButton,
                  ]} 
                  onPress={() => setStep(2)}
                  disabled={title.trim() === '' || amount.trim() === '' || parseFloat(amount) <= 0}
                >
                  <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border,
  },
  stepLine: {
    height: 2,
    width: 40,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
  activeStep: {
    backgroundColor: colors.primary,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: colors.secondaryLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 18,
    color: colors.text,
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    padding: 12,
    fontSize: 18,
    color: colors.text,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginVertical: 12,
  },
  categoryOption: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
    padding: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCategory: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '20',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
  payerContainer: {
    marginVertical: 12,
  },
  payerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedPayer: {
    backgroundColor: colors.primaryLight + '20',
    borderColor: colors.primary,
  },
  payerName: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  splitTypeContainer: {
    marginTop: 16,
  },
  splitTypeOptions: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  splitTypeOption: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedSplitType: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  splitTypeText: {
    fontSize: 16,
    color: colors.text,
  },
  customSplitContainer: {
    marginTop: 16,
  },
  customSplitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  splitAmountInput: {
    padding: 8,
    fontSize: 16,
    color: colors.text,
    minWidth: 80,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  invalidTotal: {
    color: colors.owed,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    marginRight: 8,
    backgroundColor: colors.secondaryDark,
  },
  nextButton: {
    marginLeft: 8,
    backgroundColor: colors.primary,
  },
  backButton: {
    marginRight: 8,
    backgroundColor: colors.secondaryDark,
  },
  saveButton: {
    marginLeft: 8,
    backgroundColor: colors.primary,
  },
  disabledButton: {
    opacity: 0.5,
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  nextButtonText: {
    color: colors.secondaryLight,
    fontSize: 16,
    fontWeight: '500',
  },
  backButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  saveButtonText: {
    color: colors.secondaryLight,
    fontSize: 16,
    fontWeight: '500',
  },
});