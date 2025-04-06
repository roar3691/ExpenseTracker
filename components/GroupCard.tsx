import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Group } from '@/types';
import { UserAvatar } from './UserAvatar';
import { getUserById } from '@/constants/mockData';
import { formatCurrency } from '@/utils/formatters';
import { Users } from 'lucide-react-native';

type GroupCardProps = {
  group: Group;
  balance?: number;
};

export const GroupCard: React.FC<GroupCardProps> = ({ group, balance = 0 }) => {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(`/group/${group.id}`);
  };
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: group.image }} 
        style={styles.image}
      />
      
      <View style={styles.content}>
        <Text style={styles.name}>{group.name}</Text>
        <Text style={styles.description} numberOfLines={1}>
          {group.description}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.members}>
            <Users size={16} color={colors.textSecondary} />
            <Text style={styles.membersText}>
              {group.members.length} members
            </Text>
          </View>
          
          {balance !== 0 && (
            <Text 
              style={[
                styles.balance, 
                balance > 0 ? styles.positive : styles.negative
              ]}
            >
              {balance > 0 ? 'You get back ' : 'You owe '}
              {formatCurrency(Math.abs(balance))}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.avatars}>
        {group.members.slice(0, 3).map((memberId, index) => {
          const user = getUserById(memberId);
          return (
            <View 
              key={memberId} 
              style={[
                styles.avatarContainer, 
                { right: index * 15 }
              ]}
            >
              <UserAvatar 
                uri={user.avatar} 
                name={user.name} 
                size={32}
                showBorder
              />
            </View>
          );
        })}
        
        {group.members.length > 3 && (
          <View 
            style={[
              styles.avatarContainer, 
              styles.moreAvatars,
              { right: 3 * 15 }
            ]}
          >
            <Text style={styles.moreAvatarsText}>
              +{group.members.length - 3}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 80,
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  members: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  membersText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  balance: {
    fontSize: 12,
    fontWeight: '600',
  },
  positive: {
    color: colors.receive,
  },
  negative: {
    color: colors.owed,
  },
  avatars: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    height: 32,
  },
  avatarContainer: {
    position: 'absolute',
    zIndex: 1,
  },
  moreAvatars: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  moreAvatarsText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '600',
  },
});