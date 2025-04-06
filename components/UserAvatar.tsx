import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '@/constants/colors';

type UserAvatarProps = {
  uri?: string;
  name: string;
  size?: number;
  showBorder?: boolean;
};

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  uri, 
  name, 
  size = 40,
  showBorder = false
}) => {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      borderWidth: showBorder ? 2 : 0,
      borderColor: colors.background,
    },
    image: {
      width: size,
      height: size,
    },
    initials: {
      color: colors.background,
      fontSize: size * 0.4,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      {uri ? (
        <Image source={{ uri }} style={styles.image} />
      ) : (
        <Text style={styles.initials}>{initials}</Text>
      )}
    </View>
  );
};