import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useUsers } from '../contexts/UserContext';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import logger from '../utils/logger';

type UserDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'UserDetail'>;
type UserDetailScreenRouteProp = RouteProp<RootStackParamList, 'UserDetail'>;

interface Props {
  navigation: UserDetailScreenNavigationProp;
  route: UserDetailScreenRouteProp;
}

const UserDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { userId } = route.params;
  const { fetchUserById, deleteUser, loading, error, clearError } = useUsers();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      const userData = await fetchUserById(userId);
      setUser(userData);
    } catch (err) {
      logger.error('Error loading user:', err);
    }
  };

  const handleEdit = () => {
    if (user) {
      navigation.navigate('EditUser', { userId, user });
    }
  };

  const handleDelete = () => {
    const fullName = getFullName();
    
    Alert.alert(
      'Eliminar Usuario',
      `¿Estás seguro de que deseas eliminar a ${fullName}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUser(userId);
              Alert.alert(
                'Éxito', 
                'Usuario eliminado correctamente',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack()
                  }
                ]
              );
            } catch (err) {
              Alert.alert('Error', 'No se pudo eliminar el usuario');
            }
          },
        },
      ]
    );
  };

  if (loading && !user) {
    return <LoadingSpinner />;
  }

  if (error && !user) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => {
          clearError();
          loadUser();
        }}
      />
    );
  }

  if (!user) {
    return <ErrorMessage message="Usuario no encontrado" />;
  }

  const getInitials = () => {
    // Si tiene fullName, extraer iniciales
    if (user.fullName) {
      const nameParts = user.fullName.trim().split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
      }
      return nameParts[0].charAt(0).toUpperCase();
    }
    // Fallback a firstName y lastName
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  const getFullName = () => {
    // Priorizar fullName del API
    if (user.fullName) {
      return user.fullName;
    }
    // Fallback a firstName y lastName
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'Sin nombre';
  };

  const getFirstName = () => {
    if (user.firstName) return user.firstName;
    if (user.fullName) {
      const nameParts = user.fullName.trim().split(' ');
      return nameParts[0] || 'No especificado';
    }
    return 'No especificado';
  };

  const getLastName = () => {
    if (user.lastName) return user.lastName;
    if (user.fullName) {
      const nameParts = user.fullName.trim().split(' ');
      return nameParts.slice(1).join(' ') || 'No especificado';
    }
    return 'No especificado';
  };

  const getStatusBadge = () => {
    const statusColors: { [key: string]: { bg: string; text: string } } = {
      'ACCEPTED': { bg: '#d1fae5', text: '#065f46' },
      'BLOCKED': { bg: '#fee2e2', text: '#991b1b' },
      'PENDING': { bg: '#fef3c7', text: '#92400e' },
      'DELETE': { bg: '#f3f4f6', text: '#6b7280' },
    };
    
    const status = user.status || 'PENDING';
    const colors = statusColors[status] || statusColors.PENDING;
    
    return (
      <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
        <Text style={[styles.statusText, { color: colors.text }]}>{status}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials()}</Text>
        </View>
        <Text style={styles.name}>{getFullName()}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.label}>Estado</Text>
          {getStatusBadge()}
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email || 'No especificado'}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.label}>Nombre</Text>
          <Text style={styles.value}>{getFirstName()}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.label}>Apellido</Text>
          <Text style={styles.value}>{getLastName()}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.label}>Teléfono</Text>
          <Text style={styles.value}>{user.phone || 'No especificado'}</Text>
        </View>

        {user.profileCompletion !== undefined && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.label}>Perfil Completo</Text>
              <Text style={styles.value}>{user.profileCompletion}%</Text>
            </View>
          </>
        )}

        {user.createdAt && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.label}>Fecha de Creación</Text>
              <Text style={styles.value}>
                {new Date(user.createdAt).toLocaleDateString('es-ES')}
              </Text>
            </View>
          </>
        )}

        {user.updatedAt && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.label}>Última Actualización</Text>
              <Text style={styles.value}>
                {new Date(user.updatedAt).toLocaleDateString('es-ES')}
              </Text>
            </View>
          </>
        )}

        {user.deletedAt && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.label}>Fecha de Eliminación</Text>
              <Text style={[styles.value, { color: '#dc2626' }]}>
                {new Date(user.deletedAt).toLocaleDateString('es-ES')}
              </Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.actions}>
        <Button 
          title="Editar Usuario" 
          onPress={handleEdit} 
          style={styles.editButton}
          disabled={user.deletedAt !== null}
        />
        <Button
          title={user.deletedAt ? "Usuario Eliminado" : "Eliminar Usuario"}
          onPress={handleDelete}
          variant="danger"
          style={styles.deleteButton}
          disabled={user.deletedAt !== null}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    paddingVertical: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 16,
    color: '#111827',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  actions: {
    marginBottom: 24,
  },
  editButton: {
    marginBottom: 12,
  },
  deleteButton: {
    marginBottom: 12,
  },
});

export default UserDetailScreen;

