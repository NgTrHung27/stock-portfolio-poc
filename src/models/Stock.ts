/**
 * =============================================================================
 * MODEL LAYER - Stock Entity & Types
 * =============================================================================
 *
 * Model layer chứa các định nghĩa dữ liệu (entities/types).
 * Đây là "M" trong MVVM - phần data thuần túy, không có logic.
 *
 * Ví dụ trong Flutter: lib/features/xxx/domain/entities/
 */

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
 * Stock Quote - Dữ liệu real-time
 * Dùng cho WebSocket hoặc polling API
 */
export interface StockQuote {
  symbol: string;
  price: number;
  timestamp: number;
  volume?: number;
  high?: number;
  low?: number;
}

/**
 * Watchlist Item - Item trong watchlist của user
 */
export interface WatchlistItem {
  stockId: string;
  addedAt: Date;
  notes?: string;
}

// ============================================================================
// VALUE OBJECTS - Các giá trị không có ID riêng
// ============================================================================

/**
 * Các tùy chọn sắp xếp
 */
export type SortOption = 'symbol' | 'price' | 'change' | 'name';

/**
 * Hướng sắp xếp
 */
export type SortDirection = 'asc' | 'desc';

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
// FACTORY FUNCTIONS - Tạo object với default values
// ============================================================================

/**
 * Tạo Stock với default values
 */
export const createStock = (partial: Partial<Stock>): Stock => ({
  id: partial.id ?? '',
  symbol: partial.symbol ?? '',
  name: partial.name ?? '',
  price: partial.price ?? 0,
  change: partial.change ?? 0,
  changePercent: partial.changePercent ?? 0,
  isFav: partial.isFav ?? false,
});

/**
 * Default filter options
 */
export const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  searchQuery: '',
  sortBy: 'symbol',
  sortDirection: 'asc',
  showFavoritesOnly: false,
};

// ============================================================================
// TYPE UTILITIES - Helpers cho types
// ============================================================================

/**
 * Kiểm tra stock có phải tăng không
 */
export const isStockPositive = (stock: Stock): boolean => stock.change >= 0;

/**
 * Format price thành string
 */
export const formatPrice = (price: number): string => `$${price.toFixed(2)}`;

/**
 * Format percentage
 */
export const formatPercent = (percent: number): string => {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
};
