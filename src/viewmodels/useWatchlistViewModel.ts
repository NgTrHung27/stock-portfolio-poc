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

import { useState, useMemo, useCallback } from 'react';
import {
  Stock,
  FilterOptions,
  DEFAULT_FILTER_OPTIONS,
} from '../models';
import { useWatchlistStore } from '../store/useWatchlistStore';

// ============================================================================
// VIEWMODEL STATE - State mà ViewModel quản lý
// ============================================================================

/**
 * State của WatchlistScreen
 */
interface WatchlistState {
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
  toggleFavorite: (id: string) => void;

  /** Cập nhật filter */
  updateFilters: (newFilters: Partial<FilterOptions>) => void;

  /** Reset filters về default */
  resetFilters: () => void;

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
 * Kết nối với Zustand Store để quản lý state toàn cục
 */
export const useWatchlistViewModel = (): UseWatchlistViewModelReturn => {
  // ---------- STATE FROM ZUSTAND STORE ----------
  // Lấy stocks và action từ Global Store
  const stocks = useWatchlistStore(state => state.stocks);
  const toggleFavAction = useWatchlistStore(state => state.toggleFavorite);

  // ---------- LOCAL STATE (Chỉ dùng cho UI của màn hình này) ----------
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTER_OPTIONS);

  // ---------- ACTIONS (Business Logic) ----------

  /**
   * Toggle favorite - Gọi action từ Zustand Store
   */
  const toggleFavorite = useCallback((id: string) => {
    toggleFavAction(id);
  }, [toggleFavAction]);

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
    isLoading: false,
    error: null,
    filters,
    totalCount: stocks.length,
    filteredCount: filteredStocks.length,

    // Actions
    toggleFavorite,
    updateFilters,
    resetFilters,

    // Computed
    isEmpty,
    isFiltered,
  };
};

// ============================================================================
// NAMED EXPORTS
// ============================================================================

export default useWatchlistViewModel;
