/**
 * =============================================================================
 * AUTH CONTEXT - Global Auth State
 * =============================================================================
 *
 * React Context để share auth state across app.
 * Dùng trong navigation để quyết định route nào được hiển thị.
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthViewModel, UseAuthViewModelReturn } from '../viewmodels/useAuthViewModel';

// ============================================================================
// CONTEXT
// ============================================================================

interface AuthContextValue extends UseAuthViewModelReturn {}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authViewModel = useAuthViewModel();

  return (
    <AuthContext.Provider value={authViewModel}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================================
// HOOK
// ============================================================================

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default AuthProvider;
