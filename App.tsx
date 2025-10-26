// Polyfill para crypto.getRandomValues() necesario para UUID en React Native
import 'react-native-get-random-values';

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider } from './src/contexts/UserContext';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <UserProvider>
          <AppNavigator />
          <StatusBar style="light" />
        </UserProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
