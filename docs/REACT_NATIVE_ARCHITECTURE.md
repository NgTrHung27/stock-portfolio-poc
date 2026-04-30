# React Native - Architecture Documentation

## 📖 Mục Lục
1. [Tổng Quan](#tổng-quan)
2. [MVVM Chi Tiết](./MVVM_ARCHITECTURE.md)
3. [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
4. [Flutter vs React Native](#flutter-vs-react-native)

---

## 🎯 Tổng Quan

### Phân Biệt Khái Niệm

| Thuật Ngữ | Ý Nghĩa |
|-----------|----------|
| **Architecture Pattern** | Mô hình tổ chức code, cách data flow hoạt động |
| **Folder Structure** | Cách sắp xếp files/folders trong project |

**Project này dùng**: MVVM Pattern + Layer-Based Structure

### MVVM Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        VIEW                                │
│  Screens + Components (React Native)                       │
│  • Render UI, gọi ViewModel methods                        │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────────────┐
│                     VIEWMODEL                               │
│  Custom Hooks (useXxxViewModel)                            │
│  • Business logic (filter, sort, validate)                │
│  • State management                                       │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────────────┐
│                        MODEL                               │
│  Types + Services                                          │
│  • Data definitions (interface Stock)                     │
│  • API calls (StockService)                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Cấu Trúc Thư Mục

```
src/
│
├── models/                    ⭐ MODEL - Data definitions
│   ├── index.ts
│   └── Stock.ts              ← Entity + helpers
│
├── services/                  ⭐ MODEL - Data access
│   ├── index.ts
│   └── StockService.ts       ← API calls
│
├── viewmodels/                ⭐ VIEWMODEL - Business logic
│   ├── index.ts
│   └── useWatchlistViewModel.ts
│
├── views/                     ⭐ VIEW - UI components
│   ├── index.ts
│   ├── screens/
│   │   └── WatchlistScreen.tsx
│   └── components/
│       ├── StockItemView.tsx
│       ├── SearchBarView.tsx
│       └── FilterBarView.tsx
│
├── ui-kit/                    🎨 Shared components
│   ├── Button/
│   ├── Card/
│   └── ...
│
├── navigation/                🧭 Navigation
│   └── RootNavigator.tsx
│
└── common/                    🛠️ Utilities
    ├── utils/
    └── constants/
```

---

## 🔄 Flutter vs React Native

### So Sánh Trực Tiếp

| Flutter | React Native | Chức Năng |
|---------|--------------|-----------|
| `pages/` | `screens/` | Màn hình chính (View) |
| `widgets/` | `components/` | UI components (View) |
| `bloc/` | `hooks/` | Business logic (ViewModel) |
| `domain/entities` | `models/` | Data definitions (Model) |
| `data/` | `services/` | API calls (Model) |
| `core/widgets/` | `ui-kit/` | Shared components |

### Ví Dụ Code

**Flutter**:
```dart
// View - StatelessWidget
class LoginPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
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

// ViewModel - Bloc
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  // Business logic here
}

// Model - Entity
class User { ... }
```

**React Native**:
```tsx
// View - Component
export const WatchlistScreen: React.FC = () => {
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

// ViewModel - Custom Hook
export const useWatchlistViewModel = () => {
  // Business logic here
};

// Model - Interface
export interface Stock { ... }
```

---

## 📚 Tài Liệu Chi Tiết

Xem chi tiết MVVM tại: [MVVM_ARCHITECTURE.md](./MVVM_ARCHITECTURE.md)