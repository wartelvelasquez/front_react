import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useUsers } from '../contexts/UserContext';
import UserTable from '../components/UserTable';
import Pagination from '../components/Pagination';
import EditUserModal from '../components/EditUserModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

type UsersListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'UsersList'>;

interface Props {
  navigation: UsersListScreenNavigationProp;
}

const UsersListScreen: React.FC<Props> = ({ navigation }) => {
  const { users, loading, error, currentPage, totalPages, totalUsers, fetchUsers, deleteUser, clearError } = useUsers();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    loadUsers();
  }, [itemsPerPage]);

  const loadUsers = async () => {
    await fetchUsers(1, itemsPerPage);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchUsers(currentPage, itemsPerPage);
    } finally {
      setRefreshing(false);
    }
  };

  const handlePageChange = async (page: number) => {
    await fetchUsers(page, itemsPerPage);
  };

  const handleItemsPerPageChange = async (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    // Volver a la primera página cuando se cambia el límite
    await fetchUsers(1, newItemsPerPage);
  };

  const handleUserPress = (user: any) => {
    const userId = user.id || user._id;
    navigation.navigate('UserDetail', { userId });
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setEditModalVisible(true);
  };

  const handleEditSuccess = async () => {
    await fetchUsers(currentPage);
  };

  const handleDelete = async (user: any): Promise<void> => {
    return new Promise((resolve, reject) => {
      const userId = user.id || user._id;
      const fullName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
      
      Alert.alert(
        'Eliminar Usuario',
        `¿Estás seguro de que deseas eliminar a ${fullName}?`,
        [
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => resolve(),
          },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteUser(userId);
                Alert.alert('Éxito', 'Usuario eliminado correctamente');
                resolve();
              } catch (err) {
                Alert.alert('Error', 'No se pudo eliminar el usuario');
                reject(err);
              }
            },
          },
        ],
        { 
          cancelable: true,
          onDismiss: () => resolve()
        }
      );
    });
  };

  const handleCreateUser = () => {
    navigation.navigate('CreateUser');
  };

  if (loading && users.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && users.length === 0) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => {
          clearError();
          loadUsers();
        }}
      />
    );
  }

  if (!loading && users.length === 0) {
    return (
      <EmptyState
        message="No hay usuarios registrados"
        actionText="Crear primer usuario"
        onAction={handleCreateUser}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Usuarios</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color="#6366f1" />
            ) : (
              <Ionicons name="reload" size={20} color="#6366f1" />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateUser}>
            <Text style={styles.createButtonText}>+ Nuevo Usuario</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.tableContainer}>
          <UserTable
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetail={handleUserPress}
          />
        </View>

        {users.length > 0 && (
          <View style={styles.paginationContainer}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalUsers || users.length}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </View>
        )}
      </ScrollView>

      <EditUserModal
        visible={editModalVisible}
        user={selectedUser}
        onClose={() => setEditModalVisible(false)}
        onSuccess={handleEditSuccess}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 12,
  },
  createButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tableContainer: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paginationContainer: {
    margin: 16,
    marginTop: 0,
  },
});

export default UsersListScreen;

