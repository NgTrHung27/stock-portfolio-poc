/**
 * =============================================================================
 * NAVIGATION - Root Navigator
 * =============================================================================
 *
 * Navigation kết nối View với routing.
 * Navigation KHÔNG thuộc về View hay ViewModel - nó là infrastructure.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WatchlistScreen } from '../views';

// ============================================================================
// NAVIGATION TYPES
// ============================================================================

export type RootStackParamList = {
  Watchlist: undefined;
  StockDetail: { stockId: string };
  Settings: undefined;
};

// ============================================================================
// NAVIGATOR
// ============================================================================

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Watchlist"
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
        <Stack.Screen
          name="Watchlist"
          component={WatchlistScreen}
          options={{
            title: '📈 Watchlist',
            headerLargeTitle: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
