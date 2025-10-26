import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UserTableProps {
  users: any[];
  onEdit: (user: any) => void;
  onDelete: (user: any) => Promise<void>;
  onViewDetail: (user: any) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete, onViewDetail }) => {
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const handleDelete = async (user: any) => {
    const userId = user.id || user._id;
    setDeletingUserId(userId);
    try {
      await onDelete(user);
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerCell, styles.cellId]}>ID</Text>
          <Text style={[styles.headerCell, styles.cellName]}>Nombre Completo</Text>
          <Text style={[styles.headerCell, styles.cellEmail]}>Email</Text>
          <Text style={[styles.headerCell, styles.cellPhone]}>Teléfono</Text>
          <Text style={[styles.headerCell, styles.cellStatus]}>Estado</Text>
          <Text style={[styles.headerCell, styles.cellActions]}>Acciones</Text>
        </View>

        {/* Rows */}
        {users.map((user, index) => {
          const fullName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Sin nombre';
          const userId = user.id || user._id || index;
          const isDeleted = user.deletedAt !== null && user.deletedAt !== undefined;
          const isDeleting = deletingUserId === userId;
          
          return (
            <View 
              key={userId} 
              style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}
            >
              <TouchableOpacity 
                style={[styles.cell, styles.cellId]}
                onPress={() => onViewDetail(user)}
              >
                <Text style={styles.cellTextId} numberOfLines={1}>
                  {String(userId).substring(0, 8)}...
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.cell, styles.cellName]}
                onPress={() => onViewDetail(user)}
              >
                <Text style={styles.cellText} numberOfLines={1}>{fullName}</Text>
              </TouchableOpacity>

              <View style={[styles.cell, styles.cellEmail]}>
                <Text style={styles.cellText} numberOfLines={1}>{user.email || '-'}</Text>
              </View>

              <View style={[styles.cell, styles.cellPhone]}>
                <Text style={styles.cellText} numberOfLines={1}>{user.phone || '-'}</Text>
              </View>

              <View style={[styles.cell, styles.cellStatus]}>
                <View style={[
                  styles.statusBadge,
                  user.status === 'ACCEPTED' && styles.statusAccepted,
                  user.status === 'BLOCKED' && styles.statusBlocked,
                  user.status === 'PENDING' && styles.statusPending,
                ]}>
                  <Text style={styles.statusText}>
                    {user.status === 'ACCEPTED' ? '✓ Activo' : 
                     user.status === 'BLOCKED' ? '✗ Bloqueado' :
                     user.status === 'PENDING' ? '⏳ Pendiente' : user.status}
                  </Text>
                </View>
              </View>

              <View style={[styles.cell, styles.cellActions]}>
                <TouchableOpacity 
                  style={[styles.actionButton, isDeleted && styles.actionButtonDisabled]}
                  onPress={() => !isDeleted && onEdit(user)}
                  disabled={isDeleted}
                >
                  <Ionicons 
                    name="create-outline" 
                    size={18} 
                    color={isDeleted ? '#d1d5db' : '#6366f1'} 
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.actionButton, 
                    styles.deleteButton,
                    (isDeleted || isDeleting) && styles.deleteButtonDisabled
                  ]}
                  onPress={() => !isDeleted && !isDeleting && handleDelete(user)}
                  disabled={isDeleted || isDeleting}
                >
                  {isDeleting ? (
                    <ActivityIndicator size="small" color="#ef4444" />
                  ) : (
                    <Ionicons 
                      name="trash-outline" 
                      size={18} 
                      color={isDeleted ? '#d1d5db' : '#ef4444'} 
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 800,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#6366f1',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerCell: {
    padding: 12,
    fontWeight: '700',
    color: '#fff',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  rowEven: {
    backgroundColor: '#fff',
  },
  rowOdd: {
    backgroundColor: '#f9fafb',
  },
  cell: {
    padding: 12,
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 14,
    color: '#374151',
  },
  cellTextId: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
  },
  cellId: {
    width: 120,
  },
  cellName: {
    width: 180,
  },
  cellEmail: {
    width: 200,
  },
  cellPhone: {
    width: 140,
  },
  cellStatus: {
    width: 120,
  },
  cellActions: {
    width: 120,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusAccepted: {
    backgroundColor: '#d1fae5',
  },
  statusBlocked: {
    backgroundColor: '#fee2e2',
  },
  statusPending: {
    backgroundColor: '#fef3c7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    minWidth: 36,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionButtonDisabled: {
    backgroundColor: '#f9fafb',
    borderColor: '#f3f4f6',
    opacity: 0.5,
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  deleteButtonDisabled: {
    backgroundColor: '#f9fafb',
    borderColor: '#f3f4f6',
    opacity: 0.5,
  },
});

export default UserTable;

