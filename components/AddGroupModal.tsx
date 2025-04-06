import React, { useState } from 'react';
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
} from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { mockUsers, currentUser } from '@/constants/mockData';
import { UserAvatar } from './UserAvatar';

type AddGroupModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, description: string, members: string[], image: string) => void;
};

const defaultImages = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
];

export const AddGroupModal: React.FC<AddGroupModalProps> = ({ 
  visible, 
  onClose, 
  onSave 
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState(defaultImages[0]);
  
  const otherUsers = mockUsers.filter(user => user.id !== currentUser.id);
  
  const handleSave = () => {
    if (name.trim() === '') {
      return;
    }
    
    onSave(name, description, selectedMembers, selectedImage);
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setName('');
    setDescription('');
    setSelectedMembers([]);
    setSelectedImage(defaultImages[0]);
  };
  
  const toggleMember = (userId: string) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };
  
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
            <Text style={styles.title}>Create New Group</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.form}>
            <Text style={styles.label}>Group Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter group name"
              placeholderTextColor={colors.textLight}
            />
            
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter group description"
              placeholderTextColor={colors.textLight}
              multiline
            />
            
            <Text style={styles.label}>Group Image</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.imagesContainer}
            >
              {defaultImages.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.imageOption,
                    selectedImage === image && styles.selectedImage,
                  ]}
                  onPress={() => setSelectedImage(image)}
                >
                  <UserAvatar uri={image} name={`Image ${index}`} size={60} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <Text style={styles.label}>Add Members</Text>
            <View style={styles.membersContainer}>
              {otherUsers.map(user => (
                <TouchableOpacity
                  key={user.id}
                  style={[
                    styles.memberOption,
                    selectedMembers.includes(user.id) && styles.selectedMember,
                  ]}
                  onPress={() => toggleMember(user.id)}
                >
                  <UserAvatar uri={user.avatar} name={user.name} size={40} />
                  <Text style={styles.memberName}>{user.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          
          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.button, 
                styles.saveButton,
                name.trim() === '' && styles.disabledButton,
              ]} 
              onPress={handleSave}
              disabled={name.trim() === ''}
            >
              <Text style={styles.saveButtonText}>Create Group</Text>
            </TouchableOpacity>
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
  form: {
    marginTop: 16,
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
  imagesContainer: {
    flexDirection: 'row',
    marginVertical: 12,
  },
  imageOption: {
    marginRight: 12,
    padding: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedImage: {
    borderColor: colors.primary,
  },
  membersContainer: {
    marginVertical: 12,
  },
  memberOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedMember: {
    backgroundColor: colors.primaryLight + '20',
    borderColor: colors.primary,
  },
  memberName: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
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
  saveButtonText: {
    color: colors.secondaryLight,
    fontSize: 16,
    fontWeight: '500',
  },
});