import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface UserCardProps {
  user: any;
  onPress: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onPress }) => {
  const getInitials = () => {
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  const getFullName = () => {
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'Sin nombre';
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials()}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{getFullName()}</Text>
        <Text style={styles.email}>{user.email}</Text>
        {user.phone && <Text style={styles.phone}>{user.phone}</Text>}
      </View>
      <View style={styles.arrow}>
        <Text style={styles.arrowText}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  phone: {
    fontSize: 13,
    color: '#9ca3af',
  },
  arrow: {
    marginLeft: 8,
  },
  arrowText: {
    fontSize: 24,
    color: '#d1d5db',
  },
});

export default UserCard;

