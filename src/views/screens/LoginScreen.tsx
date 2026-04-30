/**
 * =============================================================================
 * VIEW LAYER - Login Screen
 * =============================================================================
 *
 * Login Screen - View chính cho authentication.
 * Kết nối với useAuthViewModel (từ AuthContext).
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { AuthTextInput } from '../components/AuthTextInput';
import { Button } from '../../ui-kit';

export const LoginScreen: React.FC = () => {
  // ---------- CONNECT TO VIEWMODEL (from Context) ----------
  const {
    email,
    password,
    isLoading,
    error,
    validationErrors,
    canSubmit,
    setEmail,
    setPassword,
    login,
    clearError,
  } = useAuth();

  // ---------- LOCAL STATE ----------
  const [showPassword, setShowPassword] = useState(false);

  // ---------- HANDLERS ----------
  const handleLogin = useCallback(async () => {
    clearError();
    const success = await login();
    // Navigation sẽ được handle bởi RootNavigator dựa trên isAuthenticated
  }, [login, clearError]);

  const handleTogglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // ---------- RENDER ----------
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>📈</Text>
            <Text style={styles.title}>Stock Portfolio</Text>
            <Text style={styles.subtitle}>
              Sign in to track your investments
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <AuthTextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={validationErrors.email}
            />

            <AuthTextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              error={validationErrors.password}
              rightIcon={
                <TouchableOpacity onPress={handleTogglePassword}>
                  <Text style={styles.toggleIcon}>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              }
            />

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Login Button */}
            <Button
              title={isLoading ? 'Signing in...' : 'Sign In'}
              onPress={handleLogin}
              disabled={!canSubmit}
              loading={isLoading}
              style={styles.loginButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Demo credentials:
            </Text>
            <Text style={styles.demoCredentials}>
              dev@example.com / password123
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: 8,
  },
  toggleIcon: {
    fontSize: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  demoCredentials: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});

// ============================================================================
// EXPORTS
// ============================================================================

export default LoginScreen;
