/**
 * =============================================================================
 * VIEW LAYER - TextInput Component for Auth
 * =============================================================================
 *
 * Component input cho Auth (email, password)
 */

import React, { memo } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TextInputProps as RNTextInputProps,
} from 'react-native';

export interface AuthTextInputProps extends RNTextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
  rightIcon?: React.ReactNode;
}

export const AuthTextInput: React.FC<AuthTextInputProps> = memo(({
  label,
  error,
  isPassword,
  rightIcon,
  style,
  ...props
}) => {
  const hasError = !!error;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, hasError && styles.inputError]}>
        <RNTextInput
          style={[styles.input, style]}
          placeholderTextColor="#999"
          secureTextEntry={isPassword}
          {...props}
        />
        {rightIcon && (
          <View style={styles.iconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      {hasError && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  iconContainer: {
    paddingRight: 16,
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
});

export default AuthTextInput;
