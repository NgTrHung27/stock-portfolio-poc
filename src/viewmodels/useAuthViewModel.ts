/**
 * =============================================================================
 * VIEWMODEL LAYER - useAuthViewModel
 * =============================================================================
 *
 * ViewModel cho Authentication feature.
 * Chứa business logic liên quan đến đăng nhập/đăng xuất.
 */

import { useState, useCallback, useEffect } from 'react';
import {
  AuthState,
  INITIAL_AUTH_STATE,
  AuthData,
  ValidationResult,
  validateLoginCredentials,
} from '../models/Auth';
import {
  IAuthService,
  authService,
  AuthError,
} from '../services/AuthService';

// ============================================================================
// VIEWMODEL RETURN TYPE
// ============================================================================

export interface UseAuthViewModelReturn {
  // ---------- STATE ----------
  authState: AuthState;
  email: string;
  password: string;
  validationErrors: ValidationResult['errors'];

  // ---------- COMPUTED ----------
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  canSubmit: boolean;
  user: AuthState['user'];

  // ---------- ACTIONS ----------
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// ============================================================================
// VIEWMODEL HOOK
// ============================================================================

export const useAuthViewModel = (
  service: IAuthService = authService
): UseAuthViewModelReturn => {
  // ---------- STATE ----------
  const [authState, setAuthState] = useState<AuthState>(INITIAL_AUTH_STATE);
  const [email, setEmailState] = useState('');
  const [password, setPasswordState] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationResult['errors']>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // ---------- SIDE EFFECTS ----------
  /**
   * Check for existing session on mount
   * Auto-login if user has valid token
   */
  useEffect(() => {
    checkExistingSession();
  }, []);

  /**
   * Auto-validate when email or password changes
   */
  useEffect(() => {
    if (email || password) {
      const result = validateLoginCredentials(email, password);
      setValidationErrors(result.errors);
    } else {
      setValidationErrors({});
    }
  }, [email, password]);

  // ---------- PRIVATE METHODS ----------

  /**
   * Check for existing session (auto-login)
   */
  const checkExistingSession = async () => {
    try {
      const [user, token] = await Promise.all([
        service.getCurrentUser(),
        service.getStoredToken(),
      ]);

      if (user && token) {
        setAuthState({
          isAuthenticated: true,
          user,
          token,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Failed to check existing session:', error);
    } finally {
      setIsInitialized(true);
    }
  };

  // ---------- ACTIONS ----------

  /**
   * Set email
   */
  const setEmail = useCallback((value: string) => {
    setEmailState(value);
  }, []);

  /**
   * Set password
   */
  const setPassword = useCallback((value: string) => {
    setPasswordState(value);
  }, []);

  /**
   * Login - Xử lý đăng nhập
   *
   * Flow:
   * 1. Validate credentials
   * 2. Set loading state
   * 3. Gọi service.login()
   * 4. Update state với auth data
   * 5. Token đã được lưu trong AuthService
   */
  const login = useCallback(async (): Promise<boolean> => {
    // 1. Validate
    const validation = validateLoginCredentials(email, password);
    setValidationErrors(validation.errors);

    if (!validation.isValid) {
      return false;
    }

    // 2. Set loading
    setAuthState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      // 3. Gọi API (AuthService sẽ tự lưu token)
      const authData: AuthData = await service.login(email, password);

      // 4. Update state
      setAuthState({
        isAuthenticated: true,
        user: authData.user,
        token: authData.token,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (error) {
      // Handle error
      let errorMessage = 'Login failed';

      if (error instanceof AuthError) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      return false;
    }
  }, [email, password, service]);

  /**
   * Logout - Xử lý đăng xuất
   *
   * Flow:
   * 1. Set loading state
   * 2. Gọi service.logout() (xóa token khỏi storage)
   * 3. Reset state
   * 4. Clear form
   */
  const logout = useCallback(async () => {
    setAuthState(prev => ({
      ...prev,
      isLoading: true,
    }));

    try {
      // Gọi service.logout() sẽ xóa token khỏi AsyncStorage
      await service.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }

    // Reset state về initial
    setAuthState(INITIAL_AUTH_STATE);

    // Clear form
    setEmailState('');
    setPasswordState('');
  }, [service]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setAuthState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  // ---------- COMPUTED ----------

  const isAuthenticated = authState.isAuthenticated;
  const isLoading = authState.isLoading;
  const error = authState.error;
  const user = authState.user;

  const canSubmit =
    email.length > 0 &&
    password.length > 0 &&
    validationErrors.email === undefined &&
    validationErrors.password === undefined &&
    !isLoading;

  // ---------- RETURN ----------
  return {
    // State
    authState,
    email,
    password,
    validationErrors,

    // Computed
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    canSubmit,
    user,

    // Actions
    setEmail,
    setPassword,
    login,
    logout,
    clearError,
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default useAuthViewModel;
