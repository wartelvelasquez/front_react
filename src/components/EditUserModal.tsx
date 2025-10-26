import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUsers } from '../contexts/UserContext';
import Input from './Input';
import Button from './Button';
import { UpdateUserDto } from '../types/user.types';
import logger from '../utils/logger';

interface EditUserModalProps {
  visible: boolean;
  user: any;
  onClose: () => void;
  onSuccess: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ visible, user, onClose, onSuccess }) => {
  const { updateUser, loading } = useUsers();
  const [formData, setFormData] = useState<UpdateUserDto>({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Partial<UpdateUserDto>>({});

  useEffect(() => {
    if (user) {
      // Si el API devuelve fullName, intentamos dividirlo
      const [firstName = '', ...lastNameParts] = (user.fullName || '').split(' ');
      const lastName = lastNameParts.join(' ');
      
      setFormData({
        firstName: user.firstName || firstName || '',
        lastName: user.lastName || lastName || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Partial<UpdateUserDto> = {};

    // Validar nombre (obligatorio)
    if (!formData.firstName || formData.firstName.trim() === '') {
      newErrors.firstName = 'El nombre es requerido';
    }

    // Validar apellido (obligatorio)
    if (!formData.lastName || formData.lastName.trim() === '') {
      newErrors.lastName = 'El apellido es requerido';
    }

    // Validar teléfono (obligatorio)
    if (!formData.phone || formData.phone.trim() === '') {
      newErrors.phone = 'El teléfono es requerido';
    } else {
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Debe iniciar con + seguido del código de país y número (ej: +584241234567)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const userId = user.id || user._id;
      const dataToUpdate: UpdateUserDto = {};
      
      if (formData.firstName) dataToUpdate.firstName = formData.firstName;
      if (formData.lastName) dataToUpdate.lastName = formData.lastName;
      if (formData.phone) dataToUpdate.phone = formData.phone;

      await updateUser(userId, dataToUpdate);
      Alert.alert('Éxito', 'Usuario actualizado correctamente');
      onSuccess();
      onClose();
    } catch (error: any) {
      logger.log('Error completo:', error);
      logger.log('Error response data:', error.response?.data);
      
      // Parsear errores de validación del API
      if (error.response?.data?.message && Array.isArray(error.response.data.message)) {
        const apiErrors = error.response.data.message;
        const newErrors: Partial<UpdateUserDto> = {};
        let errorMessages: string[] = [];
        
        apiErrors.forEach((err: any) => {
          if (err.field && err.message) {
            const fieldMap: { [key: string]: keyof UpdateUserDto } = {
              'firstName': 'firstName',
              'lastName': 'lastName',
              'phone': 'phone',
            };
            
            const formField = fieldMap[err.field];
            if (formField) {
              newErrors[formField] = err.message;
            }
            errorMessages.push(err.message);
          }
        });
        
        setErrors(newErrors);
        
        Alert.alert(
          'Error de Validación',
          errorMessages.join('\n'),
          [{ text: 'OK' }]
        );
      } else {
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'No se pudo actualizar el usuario';
        Alert.alert('Error', errorMessage);
      }
    }
  };

  const updateField = (field: keyof UpdateUserDto, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Editar Usuario</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={32} color="#6366f1" />
              </View>
              <View>
                <Text style={styles.userName}>{user?.fullName || 'Usuario'}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
              </View>
            </View>

            <View style={styles.form}>
              <Input
                label="Nombre *"
                placeholder="Juan"
                value={formData.firstName}
                onChangeText={(text) => updateField('firstName', text)}
                error={errors.firstName}
              />

              <Input
                label="Apellido *"
                placeholder="Pérez"
                value={formData.lastName}
                onChangeText={(text) => updateField('lastName', text)}
                error={errors.lastName}
              />

              <Input
                label="Teléfono *"
                placeholder="+584241234567"
                value={formData.phone}
                onChangeText={(text) => updateField('phone', text)}
                error={errors.phone}
                keyboardType="phone-pad"
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title="Guardar Cambios"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
            />
            <Button
              title="Cancelar"
              onPress={onClose}
              variant="secondary"
              disabled={loading}
              style={styles.cancelButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    maxHeight: 400,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9fafb',
    gap: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  form: {
    padding: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  cancelButton: {
    marginTop: 0,
  },
});

export default EditUserModal;

