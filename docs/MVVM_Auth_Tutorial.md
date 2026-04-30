# MVVM Pattern - Hướng Dẫn Chi Tiết

## 📖 Mục Lục
1. [Tổng Quan](#tổng-quan)
2. [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
3. [4 Layers Trong MVVM](#4-layers-trong-mvvm)
4. [Hướng Dẫn Tạo Feature Mới](#hướng-dẫn-tạo-feature-mới)
5. [Code Mẫu Đầy Đủ](#code-mẫu-đầy-đủ)

---

## 🎯 Tổng Quan

### MVVM = Model - View - ViewModel

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MVVM ARCHITECTURE                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              VIEW LAYER                                    │
│                                                                             │
│  • React Components (Screens, Components)                                  │
│  • Chỉ nhận data và hiển thị                                             │
│  • Gọi ViewModel methods khi user interact                                │
│                                                                             │
│  📁 src/views/screens/                                                    │
│  📁 src/views/components/                                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ props + callbacks
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           VIEWMODEL LAYER                                  │
│                                                                             │
│  • Custom Hooks (useXxxViewModel)                                          │
│  • Quản lý state của View                                                 │
│  • Xử lý business logic (filter, sort, validate)                          │
│  • Giao tiếp với Services                                                  │
│                                                                             │
│  📁 src/viewmodels/                                                       │
│  📁 src/context/                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ API calls
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MODEL LAYER (Services)                           │
│                                                                             │
│  • Giao tiếp với bên ngoài (API, Storage)                                │
│  • Xử lý data trước khi trả về ViewModel                                 │
│                                                                             │
│  📁 src/services/                                                         │
│  📁 src/models/                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Nguyên Tắc Vàng

| Layer | CHỈ LÀM | KHÔNG LÀM |
|-------|---------|-----------|
| **View** | Nhận props, render UI, gọi callbacks | Business logic, API calls |
| **ViewModel** | State management, business logic, gọi services | Render UI, gọi trực tiếp từ View |
| **Service** | Gọi API, xử lý data, lưu storage | Business logic phức tạp |
| **Model** | Định nghĩa data types | Biết gì về UI |

---

## 📁 Cấu Trúc Thư Mục

```
src/
│
├── models/                    ⭐ MODEL - Data definitions
│   ├── index.ts
│   ├── Auth.ts              ← User, LoginRequest, AuthResponse
│   └── Stock.ts             ← Stock entity
│
├── services/                  ⭐ MODEL - Data access
│   ├── index.ts
│   ├── AuthService.ts       ← Auth API calls
│   ├── AuthStorage.ts       ← AsyncStorage
│   └── StockService.ts      ← Stock API calls
│
├── context/                   ⭐ VIEWMODEL - Global state
│   ├── index.ts
│   └── AuthContext.tsx      ← Auth global state
│
├── viewmodels/               ⭐ VIEWMODEL - Business logic
│   ├── index.ts
│   ├── useAuthViewModel.ts  ← Auth business logic
│   └── useWatchlistViewModel.ts
│
├── views/                    ⭐ VIEW - UI components
│   ├── index.ts
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   └── WatchlistScreen.tsx
│   └── components/
│       ├── AuthTextInput.tsx
│       ├── StockItemView.tsx
│       ├── SearchBarView.tsx
│       └── FilterBarView.tsx
│
├── navigation/               🧭 Navigation
│   └── RootNavigator.tsx
│
├── ui-kit/                   🎨 Shared components
│   ├── Button/
│   ├── Card/
│   └── ...
│
└── common/                   🛠️ Utilities
    ├── utils/
    └── constants/
```

---

## 🔥 4 Layers Trong MVVM

### Layer 1: MODEL (Data Definitions)

```typescript
// src/models/Auth.ts

/**
 * User Entity
 */
export interface User {
  userId: string;
  username: string | null;
  email: string;
  name: string;
}

/**
 * Auth Data từ API
 */
export interface AuthData {
  token: string;
  refreshToken: string;
  user: User;
}

/**
 * Login Request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Validation
 */
export const validateLoginCredentials = (email: string, password: string) => {
  // ...
};
```

### Layer 2: SERVICE (Data Access)

```typescript
// src/services/AuthService.ts

export interface IAuthService {
  login(email: string, password: string): Promise<AuthData>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

class AuthServiceImpl implements IAuthService {
  async login(email: string, password: string): Promise<AuthData> {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  }
}

export const authService: IAuthService = new AuthServiceImpl();
```

### Layer 3: VIEWMODEL (Business Logic)

```typescript
// src/viewmodels/useAuthViewModel.ts

export const useAuthViewModel = (): UseAuthViewModelReturn => {
  const [authState, setAuthState] = useState<AuthState>(INITIAL_STATE);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Business logic - filter, sort, validate
  const login = useCallback(async () => {
    // 1. Validate
    const valid = validateCredentials(email, password);
    if (!valid) return false;

    // 2. Set loading
    setAuthState(prev => ({ ...prev, isLoading: true }));

    // 3. Gọi service
    try {
      const data = await authService.login(email, password);
      setAuthState({ isAuthenticated: true, user: data.user, ... });
      return true;
    } catch (error) {
      setAuthState(prev => ({ ...prev, error: error.message }));
      return false;
    }
  }, [email, password]);

  return { email, password, login, logout, isAuthenticated, ... };
};
```

### Layer 4: VIEW (UI)

```tsx
// src/views/screens/LoginScreen.tsx

export const LoginScreen: React.FC = () => {
  // Kết nối ViewModel
  const { email, password, login, isLoading, error } = useAuth();

  // Render UI
  return (
    <View>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button
        title="Login"
        onPress={login}
        disabled={isLoading}
        loading={isLoading}
      />
    </View>
  );
};
```

---

## 🚀 Hướng Dẫn Tạo Feature Mới

### Ví Dụ: Tạo Profile Screen

**Bước 1: Tạo Model**

```typescript
// src/models/Profile.ts

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

export interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
}
```

**Bước 2: Tạo Service**

```typescript
// src/services/ProfileService.ts

export interface IProfileService {
  getProfile(): Promise<Profile>;
  updateProfile(data: Partial<Profile>): Promise<Profile>;
}

class ProfileServiceImpl implements IProfileService {
  private baseUrl = 'https://api.example.com';

  async getProfile(): Promise<Profile> {
    const token = await authStorage.getAuthToken();
    const response = await fetch(`${this.baseUrl}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return data.data;
  }

  async updateProfile(data: Partial<Profile>): Promise<Profile> {
    // ...
  }
}

export const profileService: IProfileService = new ProfileServiceImpl();
```

**Bước 3: Tạo ViewModel**

```typescript
// src/viewmodels/useProfileViewModel.ts

export interface UseProfileViewModelReturn {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  loadProfile: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<boolean>;
}

export const useProfileViewModel = (
  service: IProfileService = profileService
): UseProfileViewModelReturn => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await service.getProfile();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  const updateProfile = useCallback(async (data: Partial<Profile>) => {
    try {
      const updated = await service.updateProfile(data);
      setProfile(updated);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [service]);

  return { profile, isLoading, error, loadProfile, updateProfile };
};
```

**Bước 4: Tạo View**

```tsx
// src/views/screens/ProfileScreen.tsx

export const ProfileScreen: React.FC = () => {
  const { profile, isLoading, loadProfile, updateProfile } = useProfileViewModel();

  useEffect(() => {
    loadProfile();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{profile?.name}</Text>
      <Text style={styles.email}>{profile?.email}</Text>
      <Text style={styles.bio}>{profile?.bio}</Text>
    </View>
  );
};
```

**Bước 5: Thêm Navigation**

```tsx
// src/navigation/RootNavigator.tsx

<Stack.Screen name="Profile" component={ProfileScreen} />
```

---

## 💻 Code Mẫu Đầy Đủ

### Auth Flow Hoàn Chỉnh

#### 1. AuthStorage.ts - Lưu token

```typescript
// src/services/AuthStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthData, User } from '../models/Auth';

const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  REFRESH_TOKEN: '@refresh_token',
  USER: '@user',
} as const;

export interface IAuthStorage {
  saveAuthData(data: AuthData): Promise<void>;
  getAuthToken(): Promise<string | null>;
  getUser(): Promise<User | null>;
  clearAuthData(): Promise<void>;
  isAuthenticated(): Promise<boolean>;
}

class AuthStorageService implements IAuthStorage {
  async saveAuthData(data: AuthData): Promise<void> {
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token),
      AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken),
      AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user)),
    ]);
  }

  async getAuthToken(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  async getUser(): Promise<User | null> {
    const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return userJson ? JSON.parse(userJson) : null;
  }

  async clearAuthData(): Promise<void> {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.USER),
    ]);
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAuthToken();
    return !!token;
  }
}

export const authStorage: IAuthStorage = new AuthStorageService();
```

#### 2. AuthService.ts - API calls

```typescript
// src/services/AuthService.ts
import { authStorage } from './AuthStorage';

export interface IAuthService {
  login(email: string, password: string): Promise<AuthData>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  getStoredToken(): Promise<string | null>;
}

class AuthServiceImpl implements IAuthService {
  private baseUrl = 'https://nest-js-flutter-practise.onrender.com/api';
  private storage = authStorage;

  async login(email: string, password: string): Promise<AuthData> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.statusCode !== 201 && data.statusCode !== 200) {
      throw new Error(data.message || 'Login failed');
    }

    // Lưu token
    await this.storage.saveAuthData(data.data);

    return data.data;
  }

  async logout(): Promise<void> {
    await this.storage.clearAuthData();
  }

  async getCurrentUser(): Promise<User | null> {
    return this.storage.getUser();
  }

  async getStoredToken(): Promise<string | null> {
    return this.storage.getAuthToken();
  }
}

export const authService: IAuthService = new AuthServiceImpl();
```

#### 3. AuthContext.tsx - Global state

```typescript
// src/context/AuthContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthViewModel } from '../viewmodels/useAuthViewModel';

interface AuthContextValue extends ReturnType<typeof useAuthViewModel> {}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const authViewModel = useAuthViewModel();
  return (
    <AuthContext.Provider value={authViewModel}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

#### 4. useAuthViewModel.ts - Business logic

```typescript
// src/viewmodels/useAuthViewModel.ts
import { useState, useCallback, useEffect } from 'react';
import { AuthState, INITIAL_AUTH_STATE, AuthData } from '../models/Auth';
import { authService } from '../services/AuthService';

export interface UseAuthViewModelReturn {
  authState: AuthState;
  email: string;
  password: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  canSubmit: boolean;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthViewModel = (
  service = authService
): UseAuthViewModelReturn => {
  const [authState, setAuthState] = useState<AuthState>(INITIAL_AUTH_STATE);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Auto-login on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const [user, token] = await Promise.all([
        service.getCurrentUser(),
        service.getStoredToken(),
      ]);
      if (user && token) {
        setAuthState({ isAuthenticated: true, user, token, isLoading: false, error: null });
      }
    } finally {
      setIsInitialized(true);
    }
  };

  const login = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await service.login(email, password);
      setAuthState({ isAuthenticated: true, user: data.user, token: data.token, isLoading: false, error: null });
      return true;
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false, error: error.message }));
      return false;
    }
  }, [email, password, service]);

  const logout = useCallback(async () => {
    await service.logout();
    setAuthState(INITIAL_AUTH_STATE);
  }, [service]);

  return {
    authState,
    email,
    password,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    isInitialized,
    error: authState.error,
    canSubmit: email.length > 0 && password.length > 0 && !authState.isLoading,
    setEmail,
    setPassword,
    login,
    logout,
    clearError: () => setAuthState(prev => ({ ...prev, error: null })),
  };
};
```

#### 5. LoginScreen.tsx - View

```tsx
// src/views/screens/LoginScreen.tsx
import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export const LoginScreen: React.FC = () => {
  const { email, password, isLoading, error, setEmail, setPassword, login } = useAuth();

  const handleLogin = useCallback(async () => {
    await login();
  }, [login]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button
        title={isLoading ? 'Loading...' : 'Login'}
        onPress={handleLogin}
        disabled={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, padding: 12, marginBottom: 12, borderRadius: 8 },
  error: { color: 'red', marginBottom: 12 },
});
```

#### 6. RootNavigator.tsx - Navigation

```tsx
// src/navigation/RootNavigator.tsx
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen, WatchlistScreen } from '../views';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Watchlist" component={WatchlistScreen} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

#### 7. App.tsx - Entry point

```tsx
// App.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './src/navigation';
import { AuthProvider } from './src/context';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

---

## ✅ Checklist

- [ ] Tạo Model (entities, types)
- [ ] Tạo Service (API calls)
- [ ] Tạo ViewModel (business logic)
- [ ] Tạo View (components, screens)
- [ ] Thêm navigation
- [ ] Export từ barrel files

---

## 📚 Tài Liệu Tham Khảo

- [React Native Docs](https://reactnative.dev/docs)
- [React Navigation](https://reactnavigation.org/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
