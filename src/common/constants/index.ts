/**
 * Common constants
 */

// API Configuration
export const API_BASE_URL = 'https://api.example.com';
export const API_TIMEOUT = 30000; // 30 seconds

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  USER_DATA: '@user_data',
  WATCHLIST: '@watchlist',
  SETTINGS: '@settings',
} as const;

// Animation Durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Layout Constants
export const LAYOUT = {
  SCREEN_PADDING: 16,
  CARD_BORDER_RADIUS: 12,
  INPUT_BORDER_RADIUS: 8,
} as const;

// Color Palette
export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  textTertiary: '#999999',
  border: '#E5E5E5',
} as const;
