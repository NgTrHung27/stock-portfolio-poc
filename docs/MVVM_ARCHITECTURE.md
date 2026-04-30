# MVVM Architecture trong React Native

## 📖 Mục Lục
1. [MVVM là gì?](#mvvm-là-gì)
2. [So Sánh Flutter vs React Native MVVM](#so-sánh-flutter-vs-react-native-mvvm)
3. [Cấu Trúc Thư Mục MVVM](#cấu-trúc-thư-mục-mvvm)
4. [Model Layer - Chi Tiết](#model-layer---chi-tiết)
5. [ViewModel Layer - Chi Tiết](#viewmodel-layer---chi-tiết)
6. [View Layer - Chi Tiết](#view-layer---chi-tiết)
7. [Services Layer - Chi Tiết](#services-layer---chi-tiết)
8. [Data Flow - Luồng Dữ Liệu](#data-flow---luồng-dữ-liệu)
9. [Ví Dụ Thực Tế](#ví-dụ-thực-tế)
10. [Best Practices](#best-practices)

---

## 🎯 MVVM là gì?

**MVVM = Model - View - ViewModel**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              MVVM ARCHITECTURE                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                           VIEW (UI Layer)                            │   │
│  │                                                                      │   │
│  │  • React Components (Screens, Components)                          │   │
│  │  • Chỉ nhận data và hiển thị                                      │   │
│  │  • Gọi ViewModel methods khi user interact                          │   │
│  │  • KHÔNG có business logic                                          │   │
│  │  • KHÔNG gọi API trực tiếp                                         │   │
│  │                                                                      │   │
│  │  📁 src/views/                                                      │   │
│  │      ├── screens/                                                   │   │
│  │      └── components/                                                │   │
│  └─────────────────────────────────────┬───────────────────────────────┘   │
│                                        │                                     │
│                                        │ Props + Callbacks                   │
│                                        ▼                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      VIEWMODEL (Business Logic)                     │   │
│  │                                                                      │   │
│  │  • Custom Hooks (useXxxViewModel)                                    │   │
│  │  • Quản lý state của View                                           │   │
│  │  • Xử lý business logic (filter, sort, validate)                   │   │
│  │  • Giao tiếp với Services/Model                                    │   │
│  │  • KHÔNG render UI                                                  │   │
│  │                                                                      │   │
│  │  📁 src/viewmodels/                                                 │   │
│  │      └── useXxxViewModel.ts                                         │   │
│  └─────────────────────────────────────┬───────────────────────────────┘   │
│                                        │                                     │
│                                        │ API Calls                           │
│                                        ▼                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        MODEL (Data Layer)                           │   │
│  │                                                                      │   │
│  │  • Entities/Types (định nghĩa cấu trúc dữ liệu)                     │   │
│  │  • Services (gọi API, xử lý data)                                  │   │
│  │  • KHÔNG biết gì về UI                                              │   │
│  │                                                                      │   │
│  │  📁 src/models/     📁 src/services/                                │   │
│  │      └── Stock.ts      └── StockService.ts                           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Nguyên Tắc Vàng

| Layer | CHỈ LÀM | KHÔNG LÀM |
|-------|---------|-----------|
| **View** | Nhận props, render UI, gọi callbacks | Business logic, API calls |
| **ViewModel** | State management, business logic, gọi services | Render UI, gọi trực tiếp từ View |
| **Model** | Định nghĩa data, giao tiếp infrastructure | Biết gì về UI |
| **Services** | Gọi API, đọc storage | Business logic phức tạp |

---

## 🔄 So Sánh Flutter vs React Native MVVM

### Flutter MVVM (Bạn Đã Biết)

```dart
// lib/features/auth/presentation/pages/LoginPage.dart
class LoginPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // VIEW: Chỉ render UI
    return BlocBuilder<AuthBloc, AuthState>(
      builder: (context, state) {
        return TextField(
          onChanged: (email) =>
            context.read<AuthBloc>().add(EmailChanged(email)),
        );
      },
    );
  }
}

// lib/features/auth/presentation/bloc/AuthBloc.dart
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  // VIEWMODEL: Business logic trong BLoC
}

// lib/features/auth/domain/entities/User.dart
class User {
  // MODEL: Entity
}
```

### React Native MVVM (Cách Ta Đang Dùng)

```tsx
// src/views/screens/WatchlistScreen.tsx
export const WatchlistScreen: React.FC = () => {
  // VIEW: Kết nối với ViewModel
  const { filteredStocks, toggleFavorite } = useWatchlistViewModel();

  return (
    <FlatList
      data={filteredStocks}
      renderItem={({ item }) => (
        <StockItemView
          stock={item}
          onToggleFavorite={toggleFavorite}
        />
      )}
    />
  );
};

// src/viewmodels/useWatchlistViewModel.ts
export const useWatchlistViewModel = () => {
  // VIEWMODEL: Custom Hook chứa business logic
  const [stocks, setStocks] = useState<Stock[]>([]);
  const toggleFavorite = async (id: string) => {
    // Business logic ở đây
  };
  return { filteredStocks, toggleFavorite };
};

// src/models/Stock.ts
export interface Stock {
  // MODEL: Entity definition
}
```

### Bảng So Sánh Trực Tiếp

| Khái Niệm Flutter | React Native MVVM | Ghi Chú |
|-------------------|------------------|---------|
| `StatelessWidget/StatefulWidget` | `React.FC` (Function Component) | View |
| `Bloc/ChangeNotifier` | `Custom Hook` | ViewModel |
| `BlocBuilder/Consumer` | `useXxxViewModel()` | Kết nối View ↔ ViewModel |
| `Entity` | `interface/type` | Model |
| `Repository` | `Service` | Model (Data layer) |
| `Event` | `Callback functions` | View → ViewModel |
| `State` | `Return từ Hook` | ViewModel → View |

---

## 📁 Cấu Trúc Thư Mục MVVM

```
src/
│
├── models/                    ⭐ MODEL - Data definitions
│   ├── index.ts              ← Barrel export
│   └── Stock.ts              ← Entity: Stock interface + helpers
│
├── services/                  ⭐ MODEL - Data access
│   ├── index.ts              ← Barrel export
│   └── StockService.ts       ← API calls, Repository pattern
│
├── viewmodels/                ⭐ VIEWMODEL - Business logic
│   ├── index.ts              ← Barrel export
│   └── useWatchlistViewModel.ts
│
├── views/                     ⭐ VIEW - UI components
│   ├── index.ts              ← Barrel export
│   ├── screens/
│   │   └── WatchlistScreen.tsx
│   └── components/
│       ├── StockItemView.tsx
│       ├── SearchBarView.tsx
│       └── FilterBarView.tsx
│
├── ui-kit/                    🎨 UI Kit - Shared components
│   ├── Button/
│   ├── Card/
│   └── ...
│
├── navigation/                🧭 Navigation
│   └── RootNavigator.tsx
│
└── common/                    🛠️ Utilities & constants
    ├── utils/
    └── constants/
```

---

## 📦 Model Layer - Chi Tiết

### Mục Đích

```
Model = Data Definitions + Business Rules (không có UI)
```

### Trong Project

```
src/models/
├── Stock.ts       ← Stock entity + helpers
└── index.ts        ← Barrel export
```

### Ví Dụ: Stock.ts

```typescript
// ============================================================================
// MODEL LAYER - Stock Entity & Types
// ============================================================================
//
// Model layer chứa các định nghĩa dữ liệu (entities/types).
// Đây là "M" trong MVVM - phần data thuần túy, không có logic.
//
// Ví dụ trong Flutter: lib/features/xxx/domain/entities/
//

// ============================================================================
// CORE ENTITIES - Các đối tượng chính trong domain
// ============================================================================

/**
 * Stock Entity
 * Đại diện cho một cổ phiếu trong hệ thống
 */
export interface Stock {
  /** ID duy nhất của cổ phiếu (UUID) */
  id: string;

  /** Mã cổ phiếu (VD: "AAPL", "TSLA") */
  symbol: string;

  /** Tên đầy đủ của công ty (VD: "Apple Inc.") */
  name: string;

  /** Giá hiện tại (USD) */
  price: number;

  /** Thay đổi giá so với phiên trước (USD) */
  change: number;

  /** Phần trăm thay đổi (VD: 1.5 = +1.5%) */
  changePercent: number;

  /** Cờ yêu thích */
  isFav: boolean;
}

/**
 * Filter Options cho watchlist
 */
export interface FilterOptions {
  searchQuery: string;
  sortBy: SortOption;
  sortDirection: SortDirection;
  showFavoritesOnly: boolean;
}

// ============================================================================
// VALUE OBJECTS - Các giá trị không có ID riêng
// ============================================================================

export type SortOption = 'symbol' | 'price' | 'change' | 'name';
export type SortDirection = 'asc' | 'desc';

// ============================================================================
// FACTORY FUNCTIONS - Tạo object với default values
// ============================================================================

export const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  searchQuery: '',
  sortBy: 'symbol',
  sortDirection: 'asc',
  showFavoritesOnly: false,
};
```

### Quy Tắc Model Layer

```typescript
// ✅ ĐÚNG: Model chỉ định nghĩa data
export interface Stock {
  id: string;
  symbol: string;
  price: number;
}

// ✅ ĐÚNG: Factory functions cho default values
export const createStock = (partial: Partial<Stock>): Stock => ({
  id: partial.id ?? '',
  // ...
});

// ❌ SAI: Model không chứa business logic
export const Stock {
  id: string;

  // ❌ SAI: Method trong entity = business logic
  toggleFavorite() {
    this.isFav = !this.isFav;
  }
}
```

---

## ⚙️ ViewModel Layer - Chi Tiết

### Mục Đích

```
ViewModel = Business Logic + State Management + Services Communication
```

### Trong Project

```
src/viewmodels/
├── index.ts                      ← Barrel export
└── useWatchlistViewModel.ts     ← ViewModel hook
```

### Ví Dụ: useWatchlistViewModel.ts

```typescript
// ============================================================================
// VIEWMODEL LAYER - useWatchlistViewModel
// ============================================================================
//
// ViewModel chứa BUSINESS LOGIC - là "trái tim" của MVVM.
//
// ViewModel TRONG REACT NATIVE = Custom Hook
// (Vì React Native không có "ViewModel class" như Vue/Angular)
//
// Nhiệm vụ của ViewModel:
// 1. Quản lý STATE (dữ liệu của View)
// 2. Xử lý BUSINESS LOGIC (filter, sort, validate)
// 3. Giao tiếp với MODEL/SERVICES
// 4. Cung cấp METHODS cho View gọi
//
// ViewModel KHÔNG bao gồm:
// - UI rendering (đó là View)
// - Direct API calls (đó là Service)
// - Style/Layout (đó là View)
// ============================================================================

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Stock,
  FilterOptions,
  SortOption,
  SortDirection,
  DEFAULT_FILTER_OPTIONS,
} from '../models';
import { stockService, IStockService } from '../services';

// ============================================================================
// VIEWMODEL STATE - State mà ViewModel quản lý
// ============================================================================

interface WatchlistState {
  stocks: Stock[];
  isLoading: boolean;
  error: string | null;
  filters: FilterOptions;
}

// ============================================================================
// VIEWMODEL RETURN TYPE - Những gì ViewModel cung cấp cho View
// ============================================================================

export interface UseWatchlistViewModelReturn {
  // ---------- STATE ----------
  filteredStocks: Stock[];
  isLoading: boolean;
  error: string | null;
  filters: FilterOptions;
  totalCount: number;
  filteredCount: number;

  // ---------- ACTIONS ----------
  toggleFavorite: (id: string) => Promise<void>;
  updateFilters: (newFilters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  refresh: () => Promise<void>;

  // ---------- COMPUTED ----------
  isEmpty: boolean;
  isFiltered: boolean;
}

// ============================================================================
// VIEWMODEL HOOK - Custom Hook chính
// ============================================================================

export const useWatchlistViewModel = (
  service: IStockService = stockService
): UseWatchlistViewModelReturn => {
  // ---------- STATE ----------
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTER_OPTIONS);

  // ---------- SIDE EFFECTS ----------
  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await service.getStocks();
      setStocks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stocks');
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- ACTIONS (Business Logic) ----------

  /**
   * Toggle favorite - Xử lý logic toggle favorite
   *
   * FLOW:
   * 1. Optimistic update - Cập nhật UI ngay (UX tốt hơn)
   * 2. Gọi API
   * 3. Nếu fail → revert lại state cũ
   */
  const toggleFavorite = useCallback(async (id: string) => {
    // 1. Optimistic update
    const previousStocks = [...stocks];
    setStocks(prev =>
      prev.map(stock =>
        stock.id === id ? { ...stock, isFav: !stock.isFav } : stock
      )
    );

    // 2. Gọi API
    try {
      const updatedStock = await service.toggleFavorite(id);
      setStocks(prev =>
        prev.map(stock =>
          stock.id === id ? updatedStock : stock
        )
      );
    } catch (err) {
      // 3. Revert nếu fail
      console.error('Failed to toggle favorite:', err);
      setStocks(previousStocks);
      setError('Failed to update favorite');
    }
  }, [stocks, service]);

  /**
   * Update filters - Cập nhật filter options
   */
  const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // ---------- COMPUTED VALUES (useMemo) ----------
  /**
   * Filtered & Sorted stocks
   * Logic filter/sort nằm ở đây - đây là BUSINESS LOGIC
   */
  const filteredStocks = useMemo(() => {
    let result = [...stocks];

    // 1. Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        stock =>
          stock.symbol.toLowerCase().includes(query) ||
          stock.name.toLowerCase().includes(query)
      );
    }

    // 2. Apply favorites filter
    if (filters.showFavoritesOnly) {
      result = result.filter(stock => stock.isFav);
    }

    // 3. Apply sorting
    const { sortBy, sortDirection } = filters;
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'symbol':
          comparison = a.symbol.localeCompare(b.symbol);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        // ...
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [stocks, filters]);

  // ---------- RETURN ----------
  return {
    filteredStocks,
    isLoading,
    error,
    filters,
    totalCount: stocks.length,
    filteredCount: filteredStocks.length,
    toggleFavorite,
    updateFilters,
    resetFilters: () => setFilters(DEFAULT_FILTER_OPTIONS),
    refresh: loadStocks,
    isEmpty: stocks.length === 0,
    isFiltered: filters.searchQuery !== '' || filters.showFavoritesOnly,
  };
};
```

### Quy Tắc ViewModel Layer

```typescript
// ✅ ĐÚNG: ViewModel chứa business logic
export const useWatchlistViewModel = () => {
  // State
  const [stocks, setStocks] = useState<Stock[]>([]);

  // Business logic (filter, sort, validate)
  const filteredStocks = useMemo(() => {
    return stocks.filter(s => s.isFav);
  }, [stocks]);

  // Gọi services
  const loadStocks = async () => {
    const data = await stockService.getStocks();
    setStocks(data);
  };

  return { filteredStocks, loadStocks };
};

// ❌ SAI: ViewModel không render UI
export const useWatchlistViewModel = () => {
  return (
    <View>
      <Text>Hello</Text>  // ❌ SAI!
    </View>
  );
};

// ❌ SAI: ViewModel không gọi API trực tiếp
export const useWatchlistViewModel = () => {
  const fetch = () => {
    fetch('https://api.example.com/stocks');  // ❌ SAI! Nên dùng Service
  };
};
```

---

## 🎨 View Layer - Chi Tiết

### Mục Đích

```
View = UI Rendering - Chỉ nhận data và hiển thị
```

### Trong Project

```
src/views/
├── screens/
│   └── WatchlistScreen.tsx    ← Main screen (kết nối với ViewModel)
└── components/
    ├── StockItemView.tsx      ← Reusable component
    ├── SearchBarView.tsx
    └── FilterBarView.tsx
```

### Ví Dụ: WatchlistScreen.tsx (View chính)

```tsx
// ============================================================================
// VIEW LAYER - WatchlistScreen (Main Screen View)
// ============================================================================
//
// WatchlistScreen = "View" trong MVVM
//
// Nhiệm vụ của View:
// 1. Kết nối với ViewModel (hooks)
// 2. Render UI (nhận data từ ViewModel)
// 3. Gọi ViewModel methods khi user interact
// 4. KHÔNG có business logic
// 5. KHÔNG gọi API trực tiếp
//
// Flow dữ liệu:
// ViewModel (hooks/useWatchlistViewModel.ts)
//     ↓ (trả về state + actions)
// View (WatchlistScreen.tsx)
//     ↓ (render)
// Components (StockItemView, SearchBarView, FilterBarView)
// ============================================================================

import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ✅ Kết nối với ViewModel
import { useWatchlistViewModel } from '../../viewmodels';

// ✅ Import View components
import { StockItemView } from '../components/StockItemView';
import { SearchBarView } from '../components/SearchBarView';
import { FilterBarView } from '../components/FilterBarView';
import { EmptyState, LoadingSpinner } from '../../ui-kit';

import { Stock } from '../../models';

// ============================================================================
// SCREEN VIEW - Main Screen Component
// ============================================================================

export const WatchlistScreen: React.FC = () => {
  // ---------- CONNECT TO VIEWMODEL ----------
  const {
    filteredStocks,
    filters,
    updateFilters,
    toggleFavorite,
    totalCount,
    filteredCount,
    isLoading,
    error,
  } = useWatchlistViewModel();  // <-- Kết nối với ViewModel

  // ---------- HANDLERS ----------
  // Gọi ViewModel methods khi user interact
  const handleStockPress = useCallback((stock: Stock) => {
    console.log('Stock pressed:', stock.symbol);
  }, []);

  // ---------- RENDER ----------
  // NHẬN data từ ViewModel và render UI
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredStocks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StockItemView
            stock={item}
            onToggleFavorite={toggleFavorite}  // Gọi ViewModel method
            onPress={handleStockPress}
          />
        )}
        ListHeaderComponent={() => (
          <View>
            <SearchBarView
              value={filters.searchQuery}
              onChangeText={(text) => updateFilters({ searchQuery: text })}
            />
            <FilterBarView
              filters={filters}
              onFilterChange={updateFilters}
            />
          </View>
        )}
        ListEmptyComponent={() => <EmptyState title="No stocks" />}
      />
    </SafeAreaView>
  );
};
```

### Ví Dụ: StockItemView.tsx (Reusable Component)

```tsx
// ============================================================================
// VIEW LAYER - StockItemView Component
// ============================================================================
//
// View = Components (UI) - Phần nhận data và hiển thị.
//
// Trong MVVM:
// - View NHẬN data từ ViewModel (props)
// - View GỌI methods của ViewModel (callbacks)
// - View KHÔNG có business logic
// - View KHÔNG gọi API trực tiếp
// ============================================================================

import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from '../../ui-kit';
import { Stock } from '../../models';

// ============================================================================
// PROPS INTERFACE - Những gì View nhận vào
// ============================================================================

export interface StockItemViewProps {
  stock: Stock;                              // Data từ ViewModel
  onToggleFavorite: (id: string) => void;   // Callback đến ViewModel
  onPress?: (stock: Stock) => void;
}

// ============================================================================
// COMPONENT - View nhận props, hiển thị UI
// ============================================================================

export const StockItemView: React.FC<StockItemViewProps> = memo(({
  stock,
  onToggleFavorite,
  onPress,
}) => {
  // ---------- COMPUTED VALUES ----------
  const isPositiveChange = stock.change >= 0;

  // ---------- RENDER ----------
  return (
    <Card style={styles.card} variant="outlined" padding="medium">
      <TouchableOpacity
        style={styles.container}
        onPress={() => onPress?.(stock)}
        activeOpacity={0.7}
      >
        <View style={styles.leftSection}>
          <Text style={styles.symbol}>{stock.symbol}</Text>
          <Text style={styles.name}>{stock.name}</Text>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.price}>${stock.price.toFixed(2)}</Text>
          <Text style={[styles.change, isPositiveChange ? styles.positive : styles.negative]}>
            {stock.changePercent.toFixed(2)}%
          </Text>

          {/* Gọi callback khi user interact */}
          <TouchableOpacity onPress={() => onToggleFavorite(stock.id)}>
            <Text>{stock.isFav ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Card>
  );
});

const styles = StyleSheet.create({
  // ... styles
});

export default StockItemView;
```

### Quy Tắc View Layer

```tsx
// ✅ ĐÚNG: View nhận props và render UI
export const StockItemView: React.FC<Props> = ({ stock, onToggleFavorite }) => {
  return (
    <View>
      <Text>{stock.symbol}</Text>
      <Button onPress={() => onToggleFavorite(stock.id)} />
    </View>
  );
};

// ❌ SAI: View chứa business logic
export const StockItemView: React.FC<Props> = ({ stock }) => {
  // ❌ SAI: Business logic trong View
  const filtered = stocks.filter(s => s.isFav);
  const sorted = filtered.sort((a, b) => a.price - b.price);

  return <View>...</View>;
};

// ❌ SAI: View gọi API trực tiếp
export const StockItemView: React.FC<Props> = ({ stock }) => {
  // ❌ SAI: API call trong View
  useEffect(() => {
    fetch('https://api.example.com/stocks');
  }, []);

  return <View>...</View>;
};
```

---

## 🔌 Services Layer - Chi Tiết

### Mục Đích

```
Services = Data Access Layer - Giao tiếp với bên ngoài (API, Storage)
```

### Trong Project

```
src/services/
├── index.ts           ← Barrel export
└── StockService.ts    ← API calls
```

### Ví Dụ: StockService.ts

```typescript
// ============================================================================
// SERVICES LAYER - Stock Service
// ============================================================================
//
// Services layer chứa code giao tiếp với bên ngoài (API, Storage, etc.)
// Đây là phần "Model" giao tiếp infrastructure.
//
// Trong MVVM, Services không thuộc Model thuần (chỉ chứa data definitions).
// Services là phần "Data Access Layer" - gọi API, đọc local storage, etc.
//
// Ví dụ trong Flutter: lib/features/xxx/data/repositories/
// ============================================================================

import { Stock } from '../models';

// ============================================================================
// SERVICE INTERFACE - Interface cho service (để có thể mock/test dễ)
// ============================================================================

export interface IStockService {
  getStocks(): Promise<Stock[]>;
  getStockById(id: string): Promise<Stock | null>;
  toggleFavorite(id: string): Promise<Stock>;
  searchStocks(query: string): Promise<Stock[]>;
}

// ============================================================================
// SERVICE IMPLEMENTATION
// ============================================================================

class StockServiceImpl implements IStockService {
  private mockStocks: Stock[] = [
    { id: '1', symbol: 'AAPL', name: 'Apple Inc.', price: 175.50, change: 2.30, changePercent: 1.33, isFav: true },
    // ...
  ];

  async getStocks(): Promise<Stock[]> {
    await this.delay(500);
    return [...this.mockStocks];
  }

  async toggleFavorite(id: string): Promise<Stock> {
    const stock = this.mockStocks.find(s => s.id === id);
    if (!stock) throw new Error('Stock not found');

    stock.isFav = !stock.isFav;
    return { ...stock };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const stockService: IStockService = new StockServiceImpl();
```

### Quy Tắc Services Layer

```typescript
// ✅ ĐÚNG: Services chỉ giao tiếp với external (API, Storage)
class StockService {
  async getStocks(): Promise<Stock[]> {
    const response = await fetch('https://api.example.com/stocks');
    return response.json();
  }
}

// ❌ SAI: Services chứa business logic
class StockService {
  async getStocks(): Promise<Stock[]> {
    const data = await fetch('/stocks');
    // ❌ SAI: Business logic trong service
    const filtered = data.filter(s => s.isFav);
    const sorted = filtered.sort(...);
    return sorted;
  }
}
```

---

## 🔄 Data Flow - Luồng Dữ Liệu

### Luồng Hoàn Chỉnh

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MVVM DATA FLOW                                       │
└─────────────────────────────────────────────────────────────────────────────┘

1️⃣ INITIALIZATION
────────────────────
User mở app
    │
    ▼
┌─────────────────────────────────────────┐
│  WatchlistScreen (View)                 │
│  • Gọi useWatchlistViewModel()         │
└─────────────────┬─────────────────────┘
                  │ Mount
                  ▼
┌─────────────────────────────────────────┐
│  useWatchlistViewModel (ViewModel)      │
│  • useEffect(() => loadStocks(), [])    │
└─────────────────┬─────────────────────┘
                  │ Gọi service.getStocks()
                  ▼
┌─────────────────────────────────────────┐
│  stockService (Service)                 │
│  • fetch('/stocks')                     │
│  • Trả về Promise<Stock[]>             │
└─────────────────┬─────────────────────┘
                  │ Promise resolve
                  ▼
┌─────────────────────────────────────────┐
│  useWatchlistViewModel                  │
│  • setStocks(data)                      │
│  • State update → re-render             │
└─────────────────────────────────────────┘

2️⃣ USER INTERACTION
────────────────────
User tap ❤️ button
    │
    ▼
┌─────────────────────────────────────────┐
│  StockItemView (View)                   │
│  • onPress={() => onToggleFavorite(id)}│
└─────────────────┬─────────────────────┘
                  │ Gọi callback
                  ▼
┌─────────────────────────────────────────┐
│  useWatchlistViewModel                  │
│  • toggleFavorite(id)                  │
│  • Optimistic update: setStocks(...)   │
│  • Gọi service.toggleFavorite(id)      │
└─────────────────────────────────────────┘
```

### Code Flow Chi Tiết

```tsx
// ============================================================================
// STEP 1: View renders
// ============================================================================

// WatchlistScreen.tsx
export const WatchlistScreen: React.FC = () => {
  // 1. View kết nối với ViewModel
  const viewModel = useWatchlistViewModel();

  // 2. ViewModel trả về state
  const { filteredStocks, toggleFavorite } = viewModel;

  // 3. View render với data
  return (
    <FlatList
      data={filteredStocks}  // ← Data từ ViewModel
      renderItem={({ item }) => (
        <StockItemView
          stock={item}
          onToggleFavorite={toggleFavorite}  // ← Callback đến ViewModel
        />
      )}
    />
  );
};

// ============================================================================
// STEP 2: User interacts
// ============================================================================

// StockItemView.tsx
export const StockItemView: React.FC<Props> = ({ stock, onToggleFavorite }) => {
  return (
    <TouchableOpacity onPress={() => onToggleFavorite(stock.id)}>
      <Text>{stock.symbol}</Text>
    </TouchableOpacity>
  );
};

// ============================================================================
// STEP 3: ViewModel processes
// ============================================================================

// useWatchlistViewModel.ts
export const useWatchlistViewModel = () => {
  // State
  const [stocks, setStocks] = useState<Stock[]>([]);

  // Action
  const toggleFavorite = async (id: string) => {
    // 1. Optimistic update
    setStocks(prev => prev.map(s =>
      s.id === id ? { ...s, isFav: !s.isFav } : s
    ));

    // 2. Call service
    await stockService.toggleFavorite(id);
  };

  return { stocks: filteredStocks, toggleFavorite };
};
```

---

## 💡 Ví Dụ Thực Tế

### Thêm Feature Mới: Portfolio

**Bước 1: Tạo Model**

```typescript
// src/models/Portfolio.ts
export interface Portfolio {
  id: string;
  userId: string;
  stocks: PortfolioStock[];
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
}

export interface PortfolioStock {
  stockId: string;
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
}
```

**Bước 2: Tạo Service**

```typescript
// src/services/PortfolioService.ts
export interface IPortfolioService {
  getPortfolio(): Promise<Portfolio>;
  addStock(stockId: string, quantity: number): Promise<Portfolio>;
  removeStock(stockId: string): Promise<Portfolio>;
}

class PortfolioServiceImpl implements IPortfolioService {
  async getPortfolio(): Promise<Portfolio> {
    // API call
  }
}

export const portfolioService: IPortfolioService = new PortfolioServiceImpl();
```

**Bước 3: Tạo ViewModel**

```typescript
// src/viewmodels/usePortfolioViewModel.ts
export const usePortfolioViewModel = () => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    setIsLoading(true);
    const data = await portfolioService.getPortfolio();
    setPortfolio(data);
    setIsLoading(false);
  };

  const addStock = async (stockId: string, quantity: number) => {
    const updated = await portfolioService.addStock(stockId, quantity);
    setPortfolio(updated);
  };

  return {
    portfolio,
    isLoading,
    addStock,
    refresh: loadPortfolio,
  };
};
```

**Bước 4: Tạo View**

```typescript
// src/views/screens/PortfolioScreen.tsx
export const PortfolioScreen: React.FC = () => {
  const { portfolio, isLoading, addStock } = usePortfolioViewModel();

  if (isLoading) return <LoadingSpinner />;

  return (
    <View>
      <PortfolioSummary portfolio={portfolio} />
      <PortfolioList stocks={portfolio?.stocks} />
    </View>
  );
};
```

**Bước 5: Thêm Navigation**

```typescript
// src/navigation/RootNavigator.tsx
import { PortfolioScreen } from '../views/screens/PortfolioScreen';

<Stack.Screen name="Portfolio" component={PortfolioScreen} />
```

---

## ✅ Best Practices

### 1. Separation of Concerns

```typescript
// ❌ SAI: Tất cả trong 1 file
export const WatchlistScreen: React.FC = () => {
  const [stocks, setStocks] = useState([]);

  // ❌ Business logic trong View
  const filtered = stocks.filter(s => s.isFav).sort((a, b) => a.price - b.price);

  // ❌ API call trong View
  useEffect(() => { fetch('/stocks').then(setStocks); }, []);

  return <FlatList data={filtered} renderItem={({ item }) => <Text>{item.symbol}</Text>} />;
};

// ✅ ĐÚNG: Phân tách rõ ràng
// View
export const WatchlistScreen: React.FC = () => {
  const { filteredStocks } = useWatchlistViewModel();
  return <FlatList data={filteredStocks} renderItem={...} />;
};

// ViewModel
export const useWatchlistViewModel = () => {
  const { stocks, setStocks } = useState([]);
  const loadStocks = async () => setStocks(await stockService.getStocks());
  const filteredStocks = useMemo(() => stocks.filter(s => s.isFav), [stocks]);
  return { filteredStocks, loadStocks };
};

// Service
export const stockService = { getStocks: () => fetch('/stocks').then(r => r.json()) };
```

### 2. Dependency Injection (cho Test)

```typescript
// ✅ ĐÚNG: Inject service để test được
export const useWatchlistViewModel = (service: IStockService = stockService) => {
  // ...
};

// Test với mock service
const mockService = { getStocks: () => Promise.resolve([]) };
const { result } = renderHook(() => useWatchlistViewModel(mockService));
```

### 3. Type Safety

```typescript
// ✅ ĐÚNG: Dùng TypeScript interfaces
interface Props {
  stock: Stock;
  onToggleFavorite: (id: string) => void;
}

// ❌ SAI: Dùng any
interface Props {
  stock: any;
  onToggle: any;
}
```

### 4. Barrel Exports

```typescript
// ✅ ĐÚNG: Barrel export cho mỗi layer
// src/viewmodels/index.ts
export * from './useWatchlistViewModel';
export * from './usePortfolioViewModel';

// Dùng ở View
import { useWatchlistViewModel } from '../../viewmodels';
```

---

## 📊 Checklist MVVM

- [ ] Tách Model (types/entities) riêng
- [ ] Tách Services (API calls) riêng
- [ ] Tách ViewModels (custom hooks) riêng
- [ ] View chỉ nhận props và render UI
- [ ] ViewModel chứa business logic
- [ ] ViewModel KHÔNG render UI
- [ ] Services KHÔNG chứa business logic
- [ ] Dùng TypeScript interfaces cho props
- [ ] Dùng barrel exports
- [ ] ViewModel có thể test được (inject dependencies)
