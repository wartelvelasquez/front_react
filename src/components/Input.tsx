import React from 'react';
import { TextInput, Text, View, StyleSheet, KeyboardTypeOptions } from 'react-native';

interface InputProps {
  label?: string;
  error?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  style?: any;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  value = '',
  onChangeText,
  placeholder = '',
  secureTextEntry = false,
  keyboardType = 'default',
  style,
}) => {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor="#9ca3af"
      />
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
    gap: 4,
  },
  errorIcon: {
    fontSize: 12,
    marginTop: 2,
  },
  error: {
    flex: 1,
    fontSize: 12,
    color: '#ef4444',
    lineHeight: 16,
  },
});

export default Input;

