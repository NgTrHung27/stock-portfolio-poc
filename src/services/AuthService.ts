/**
 * =============================================================================
 * SERVICES LAYER - Auth Service
 * =============================================================================
 *
 * Xử lý giao tiếp với Auth API.
 * API: POST {{apiProduction}}/auth/login
 * Body: { "email": "...", "password": "..." }
 * Response: { "statusCode": 201, "message": "Success", "data": { token, refreshToken, user } }
 */

import {
  LoginRequest,
  AuthResponse,
  AuthData,
  User,
} from '../models/Auth';
import { authStorage, IAuthStorage } from './AuthStorage';

// ============================================================================
// CONFIG
// ============================================================================

const API_BASE_URL = 'https://nest-js-flutter-practise.onrender.com/api';

// ============================================================================
// SERVICE INTERFACE
// ============================================================================

export interface IAuthService {
  login(email: string, password: string): Promise<AuthData>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  refreshToken(refreshToken: string): Promise<string>;
  getStoredToken(): Promise<string | null>;
}

// ============================================================================
// CUSTOM ERROR
// ============================================================================

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// ============================================================================
// SERVICE IMPLEMENTATION
// ============================================================================

class AuthServiceImpl implements IAuthService {
  private baseUrl: string;
  private storage: IAuthStorage;

  constructor(
    baseUrl: string = API_BASE_URL,
    storage: IAuthStorage = authStorage
  ) {
    this.baseUrl = baseUrl;
    this.storage = storage;
  }

  /**
   * Login - Gửi request đăng nhập
   *
   * @param email - Email của user
   * @param password - Password của user
   * @returns AuthData (token, refreshToken, user)
   * @throws AuthError nếu login thất bại
   */
  async login(email: string, password: string): Promise<AuthData> {
    console.log('🔵 [AuthService] POST /auth/login', { email });

    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await response.json();
      console.log('🟢 [AuthService] Response:', data);

      // Check status code
      if (data.statusCode !== 201 && data.statusCode !== 200) {
        throw new AuthError(
          data.message || 'Login failed',
          data.statusCode
        );
      }

      // Lưu auth data vào storage
      await this.storage.saveAuthData(data.data);

      // Return auth data
      return data.data;
    } catch (error) {
      console.log('🔴 [AuthService] Error:', error);
      if (error instanceof AuthError) {
        throw error;
      }

      // Network error hoặc parse error
      throw new AuthError(
        error instanceof Error ? error.message : 'Network error occurred',
        undefined
      );
    }
  }

  /**
   * Logout - Xử lý logout
   * Xóa token khỏi storage
   */
  async logout(): Promise<void> {
    await this.storage.clearAuthData();
  }

  /**
   * Get Current User - Lấy thông tin user từ storage
   */
  async getCurrentUser(): Promise<User | null> {
    return this.storage.getUser();
  }

  /**
   * Get Stored Token - Lấy token từ storage
   */
  async getStoredToken(): Promise<string | null> {
    return this.storage.getAuthToken();
  }

  /**
   * Refresh Token - Làm mới access token
   */
  async refreshToken(refreshToken: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (data.statusCode !== 200) {
        throw new AuthError('Failed to refresh token', data.statusCode);
      }

      // Lưu token mới
      await this.storage.saveAuthData(data.data);

      return data.data.token;
    } catch (error) {
      throw new AuthError(
        error instanceof Error ? error.message : 'Failed to refresh token'
      );
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const authService: IAuthService = new AuthServiceImpl();

// ============================================================================
// FACTORY
// ============================================================================

export const createAuthService = (
  baseUrl?: string,
  storage?: IAuthStorage
): IAuthService => {
  return new AuthServiceImpl(baseUrl, storage);
};

export default authService;
