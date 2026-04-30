/**
 * =============================================================================
 * STORAGE SERVICE - Auth Storage
 * =============================================================================
 *
 * Xử lý lưu trữ local (AsyncStorage) cho authentication.
 * Lưu token, refreshToken, user info.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthData, User } from '../models/Auth';

// ============================================================================
// STORAGE KEYS
// ============================================================================

const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  REFRESH_TOKEN: '@refresh_token',
  USER: '@user',
} as const;

// ============================================================================
// AUTH STORAGE SERVICE
// ============================================================================

export interface IAuthStorage {
  saveAuthData(data: AuthData): Promise<void>;
  getAuthToken(): Promise<string | null>;
  getRefreshToken(): Promise<string | null>;
  getUser(): Promise<User | null>;
  clearAuthData(): Promise<void>;
  isAuthenticated(): Promise<boolean>;
}

class AuthStorageService implements IAuthStorage {
/**
 * Lưu toàn bộ auth data
 */
async saveAuthData(data: AuthData): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token),
      AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken),
      AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user)),
    ]);
  } catch (error) {
    console.warn('Failed to save auth data to AsyncStorage:', error);
  }
}

  /**
   * Lấy access token
   */
  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  }

  /**
   * Lấy refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Failed to get refresh token:', error);
      return null;
    }
  }

  /**
   * Lấy user info
   */
  async getUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (userJson) {
        return JSON.parse(userJson) as User;
      }
      return null;
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  }

  /**
   * Xóa toàn bộ auth data (logout)
   */
  async clearAuthData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.USER),
      ]);
    } catch (error) {
      console.error('Failed to clear auth data:', error);
      throw error;
    }
  }

  /**
   * Kiểm tra đã đăng nhập chưa
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAuthToken();
    return !!token;
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const authStorage: IAuthStorage = new AuthStorageService();

export default authStorage;
