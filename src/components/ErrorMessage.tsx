import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from './Button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  const isNetworkError = message.toLowerCase().includes('network') || 
                         message.toLowerCase().includes('timeout') ||
                         message.toLowerCase().includes('econnrefused') ||
                         message.toLowerCase().includes('failed to fetch');
  
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>⚠️</Text>
      <Text style={styles.title}>Error de Conexión</Text>
      <Text style={styles.message}>{message}</Text>
      {isNetworkError && (
        <View style={styles.helpBox}>
          <Text style={styles.helpTitle}>Posibles soluciones:</Text>
          <Text style={styles.helpText}>• Verifica que el API Gateway esté corriendo</Text>
          <Text style={styles.helpText}>• Revisa la URL en src/constants/api.constants.ts</Text>
          <Text style={styles.helpText}>• URL actual: http://localhost:5000/api/v1</Text>
        </View>
      )}
      {onRetry && (
        <Button title="Reintentar" onPress={onRetry} variant="secondary" style={styles.button} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  helpBox: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 13,
    color: '#78350f',
    marginBottom: 4,
  },
  button: {
    minWidth: 150,
  },
});

export default ErrorMessage;

