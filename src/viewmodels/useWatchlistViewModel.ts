/**
 * =============================================================================
 * VIEWMODEL LAYER - useWatchlistViewModel
 * =============================================================================
 *
 * ViewModel chứa BUSINESS LOGIC - là "trái tim" của MVVM.
 *
 * ViewModel TRONG REACT NATIVE = Custom Hook
 * (Vì React Native không có "ViewModel class" như Vue/Angular)
 *
 * Nhiệm vụ của ViewModel:
 * 1. Quản lý STATE (dữ liệu của View)
 * 2. Xử lý BUSINESS LOGIC (filter, sort, validate)
 * 3. Giao tiếp với MODEL/SERVICES
 * 4. Cung cấp METHODS cho View gọi
 *
 * ViewModel KHÔNG bao gồm:
 * - UI rendering (đó là View)
 * - Direct API calls (đó là Service)
 * - Style/Layout (đó là View)
 *
 * Ví dụ trong Flutter: lib/features/xxx/presentation/bloc/
 */

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

/**
 * State của WatchlistScreen
 */
interface WatchlistState {
  /** Danh sách stocks gốc từ API */
  stocks: Stock[];

  /** Loading state */
  isLoading: boolean;

  /** Error message nếu có lỗi */
  error: string | null;

  /** Filter options hiện tại */
  filters: FilterOptions;
}

// ============================================================================
// VIEWMODEL RETURN TYPE - Những gì ViewModel cung cấp cho View
// ============================================================================

/**
 * Return type của useWatchlistViewModel
 * View sẽ dùng những properties/methods này
 */
export interface UseWatchlistViewModelReturn {
  // ---------- STATE ----------
  /** Danh sách stocks đã được filter/sort */
  filteredStocks: Stock[];

  /** Loading state */
  isLoading: boolean;

  /** Error message */
  error: string | null;

  /** Filter options hiện tại */
  filters: FilterOptions;

  /** Tổng số stocks */
  totalCount: number;

  /** Số stocks sau filter */
  filteredCount: number;

  // ---------- ACTIONS (Methods cho View gọi) ----------
  /** Toggle favorite của 1 stock */
  toggleFavorite: (id: string) => Promise<void>;

  /** Cập nhật filter */
  updateFilters: (newFilters: Partial<FilterOptions>) => void;

  /** Reset filters về default */
  resetFilters: () => void;

  /** Refresh data từ API */
  refresh: () => Promise<void>;

  // ---------- COMPUTED VALUES ----------
  /** Có stock nào không */
  isEmpty: boolean;

  /** Có đang filter không */
  isFiltered: boolean;
}

// ============================================================================
// VIEWMODEL HOOK - Custom Hook chính
// ============================================================================

/**
 * useWatchlistViewModel - ViewModel cho Watchlist feature
 *
 * @param service - StockService instance (inject để test được)
 *
 * Cách dùng trong View:
 * ```tsx
 * const viewModel = useWatchlistViewModel();
 * const { filteredStocks, toggleFavorite } = viewModel;
 * ```
 */
export const useWatchlistViewModel = (
  service: IStockService = stockService
): UseWatchlistViewModelReturn => {
  // ---------- STATE ----------
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTER_OPTIONS);

  // ---------- SIDE EFFECTS ----------
  /**
   * Load stocks khi mount
   * (tương tự useEffect(() => {...}, []))
   */
  useEffect(() => {
    loadStocks();
  }, []);

  /**
   * Load stocks từ service
   */
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
    // 1. Optimistic update - Cập nhật UI ngay lập tức
    const previousStocks = [...stocks];
    setStocks(prev =>
      prev.map(stock =>
        stock.id === id ? { ...stock, isFav: !stock.isFav } : stock
      )
    );

    // 2. Gọi API
    try {
      const updatedStock = await service.toggleFavorite(id);

      // 3. Cập nhật với data từ API (để đảm bảo sync)
      setStocks(prev =>
        prev.map(stock =>
          stock.id === id ? updatedStock : stock
        )
      );
    } catch (err) {
      // 4. Nếu fail → Revert lại state cũ
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

  /**
   * Reset filters - Reset về default
   */
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTER_OPTIONS);
  }, []);

  /**
   * Refresh - Load lại data từ API
   */
  const refresh = useCallback(async () => {
    await loadStocks();
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
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'change':
          comparison = a.changePercent - b.changePercent;
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [stocks, filters]);

  /**
   * Computed: isEmpty
   */
  const isEmpty = useMemo(() => stocks.length === 0, [stocks]);

  /**
   * Computed: isFiltered
   */
  const isFiltered = useMemo(
    () =>
      filters.searchQuery !== '' ||
      filters.showFavoritesOnly ||
      filters.sortBy !== 'symbol' ||
      filters.sortDirection !== 'asc',
    [filters]
  );

  // ---------- RETURN ----------
  return {
    // State
    filteredStocks,
    isLoading,
    error,
    filters,
    totalCount: stocks.length,
    filteredCount: filteredStocks.length,

    // Actions
    toggleFavorite,
    updateFilters,
    resetFilters,
    refresh,

    // Computed
    isEmpty,
    isFiltered,
  };
};

// ============================================================================
// NAMED EXPORTS
// ============================================================================

export default useWatchlistViewModel;
