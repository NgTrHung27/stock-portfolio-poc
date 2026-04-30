/**
 * =============================================================================
 * NAVIGATION - Root Navigator
 * =============================================================================
 *
 * Navigation kết nối View với routing.
 * Sử dụng AuthContext để handle auth flow.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { LoginScreen, WatchlistScreen } from '../views';
import { useAuth } from '../context/AuthContext';

// ============================================================================
// NAVIGATION TYPES
// ============================================================================

export type RootStackParamList = {
  Login: undefined;
  Watchlist: undefined;
  StockDetail: { stockId: string };
  Settings: undefined;
};

// ============================================================================
// AUTH NAVIGATOR - Xử lý auth flow
// ============================================================================

const AuthStack = createNativeStackNavigator<RootStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          animation: 'fade',
        }}
      />
    </AuthStack.Navigator>
  );
};

// ============================================================================
// MAIN NAVIGATOR - Xử lý main app flow
// ============================================================================

const MainStack = createNativeStackNavigator<RootStackParamList>();

const MainNavigator: React.FC = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#007AFF',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <MainStack.Screen
        name="Watchlist"
        component={WatchlistScreen}
        options={{
          title: '📈 Watchlist',
        }}
      />
    </MainStack.Navigator>
  );
};

// ============================================================================
// ROOT NAVIGATOR - Điều hướng theo auth state
// ============================================================================

const RootStack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isInitialized } = useAuth();

  // Loading state - show spinner
  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <RootStack.Screen
            name="Main"
            component={MainNavigator}
          />
        ) : (
          <RootStack.Screen
            name="Auth"
            component={AuthNavigator}
          />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
});

export default RootNavigator;
