/**
 * =============================================================================
 * MODEL LAYER - Auth Entities
 * =============================================================================
 *
 * Chứa các định nghĩa data liên quan đến Authentication.
 * Dựa trên API response:
 * {
 *   "statusCode": 201,
 *   "message": "Success",
 *   "data": {
 *     "token": "...",
 *     "refreshToken": "...",
 *     "user": { "userId": "1", "username": null, "email": "...", "name": "..." }
 *   }
 * }
 */

// ============================================================================
// CORE ENTITIES
// ============================================================================

/**
 * User Entity - Thông tin user đăng nhập
 */
export interface User {
  userId: string;
  username: string | null;
  email: string;
  name: string;
}

/**
 * Auth Data - Data trả về từ API login
 */
export interface AuthData {
  token: string;
  refreshToken: string;
  user: User;
}

/**
 * Login Request - Request body khi đăng nhập
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

/**
 * Auth Response - Full response từ login API
 */
export type AuthResponse = ApiResponse<AuthData>;

// ============================================================================
// STATE TYPES
// ============================================================================

/**
 * Auth State - State của authentication
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Initial auth state
 */
export const INITIAL_AUTH_STATE: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password (min 6 characters)
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Validate login credentials
 */
export interface ValidationResult {
  isValid: boolean;
  errors: {
    email?: string;
    password?: string;
  };
}

export const validateLoginCredentials = (
  email: string,
  password: string
): ValidationResult => {
  const errors: ValidationResult['errors'] = {};

  if (!email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Invalid email format';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (!isValidPassword(password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
