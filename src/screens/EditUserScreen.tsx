import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useUsers } from '../contexts/UserContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { UpdateUserDto } from '../types/user.types';
import logger from '../utils/logger';

type EditUserScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditUser'>;
type EditUserScreenRouteProp = RouteProp<RootStackParamList, 'EditUser'>;

interface Props {
  navigation: EditUserScreenNavigationProp;
  route: EditUserScreenRouteProp;
}

const EditUserScreen: React.FC<Props> = ({ navigation, route }) => {
  const { userId, user } = route.params;
  const { updateUser, loading } = useUsers();
  
  // Extraer firstName y lastName del fullName si no están disponibles directamente
  const getFirstName = () => {
    if (user.firstName) return user.firstName;
    if (user.fullName) {
      const nameParts = user.fullName.trim().split(' ');
      return nameParts[0] || '';
    }
    return '';
  };

  const getLastName = () => {
    if (user.lastName) return user.lastName;
    if (user.fullName) {
      const nameParts = user.fullName.trim().split(' ');
      return nameParts.slice(1).join(' ') || '';
    }
    return '';
  };
  
  const [formData, setFormData] = useState<UpdateUserDto>({
    firstName: getFirstName(),
    lastName: getLastName(),
    phone: user.phone || '',
  });
  const [errors, setErrors] = useState<Partial<UpdateUserDto>>({});

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
      const dataToUpdate: UpdateUserDto = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      };

      await updateUser(userId, dataToUpdate);
      Alert.alert('Éxito', 'Usuario actualizado correctamente', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
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
    // Limpiar error del campo al editar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
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

          <View style={styles.actions}>
            <Button
              title="Guardar Cambios"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
            />
            <Button
              title="Cancelar"
              onPress={() => navigation.goBack()}
              variant="secondary"
              disabled={loading}
              style={styles.cancelButton}
            />
          </View>
        </View>
      </ScrollView>
    </View>
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
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actions: {
    marginTop: 24,
  },
  cancelButton: {
    marginTop: 8,
  },
});

export default EditUserScreen;

