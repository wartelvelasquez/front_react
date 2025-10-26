import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useUsers } from '../contexts/UserContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { RegisterUserDto } from '../types/user.types';
import logger from '../utils/logger';

type CreateUserScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateUser'>;

interface Props {
  navigation: CreateUserScreenNavigationProp;
}

const CreateUserScreen: React.FC<Props> = ({ navigation }) => {
  const { createUser, loading } = useUsers();
  const [formData, setFormData] = useState<RegisterUserDto>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Partial<RegisterUserDto>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterUserDto> = {};

    // Validar email
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email no válido';
    }

    // Validar password
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

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
      await createUser(formData);
      Alert.alert('Éxito', 'Usuario creado correctamente', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      logger.log('Error completo:', error);
      logger.log('Error response:', error.response);
      logger.log('Error response data:', error.response?.data);
      
      // Parsear errores de validación del API
      if (error.response?.data?.message && Array.isArray(error.response.data.message)) {
        const apiErrors = error.response.data.message;
        const newErrors: Partial<RegisterUserDto> = {};
        let errorMessages: string[] = [];
        
        apiErrors.forEach((err: any) => {
          if (err.field && err.message) {
            // Mapear el campo del API al campo del formulario
            const fieldMap: { [key: string]: keyof RegisterUserDto } = {
              'email': 'email',
              'password': 'password',
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
        
        // Mostrar alert con todos los errores
        Alert.alert(
          'Error de Validación',
          errorMessages.join('\n'),
          [{ text: 'OK' }]
        );
      } else {
        // Error genérico
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'No se pudo crear el usuario';
        Alert.alert('Error', errorMessage);
      }
    }
  };

  const updateField = (field: keyof RegisterUserDto, value: string) => {
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
            label="Email *"
            placeholder="usuario@ejemplo.com"
            value={formData.email}
            onChangeText={(text) => updateField('email', text)}
            error={errors.email}
            keyboardType="email-address"
          />

          <Input
            label="Contraseña *"
            placeholder="Mínimo 8 caracteres"
            value={formData.password}
            onChangeText={(text) => updateField('password', text)}
            error={errors.password}
            secureTextEntry={true}
          />

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
              title="Crear Usuario"
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

export default CreateUserScreen;

