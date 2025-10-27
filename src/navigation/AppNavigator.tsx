import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { User } from '../types/user.types';

// Importar pantallas (las crearemos después)
import UsersListScreen from '../screens/UsersListScreen';
import UserDetailScreen from '../screens/UserDetailScreen';
import CreateUserScreen from '../screens/CreateUserScreen';
import EditUserScreen from '../screens/EditUserScreen';

export type RootStackParamList = {
  UsersList: undefined;
  UserDetail: { userId: string };
  CreateUser: undefined;
  EditUser: { userId: string; user: any };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="UsersList"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6366f1',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold' as any,
          },
        }}
      >
        <Stack.Screen
          name="UsersList"
          component={UsersListScreen}
          options={{ title: 'Gestión de Usuarios' }}
        />
        <Stack.Screen
          name="UserDetail"
          component={UserDetailScreen}
          options={{ title: 'Detalle de Usuario' }}
        />
        <Stack.Screen
          name="CreateUser"
          component={CreateUserScreen}
          options={{ title: 'Crear Usuario' }}
        />
        <Stack.Screen
          name="EditUser"
          component={EditUserScreen}
          options={{ title: 'Editar Usuario' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

