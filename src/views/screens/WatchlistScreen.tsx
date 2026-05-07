/**
 * =============================================================================
 * VIEW LAYER - WatchlistScreen (Main Screen View)
 * =============================================================================
 *
 * WatchlistScreen = "View" trong MVVM
 *
 * Nhiệm vụ của View:
 * 1. Kết nối với ViewModel (hooks)
 * 2. Render UI (nhận data từ ViewModel)
 * 3. Gọi ViewModel methods khi user interact
 * 4. KHÔNG có business logic
 * 5. KHÔNG gọi API trực tiếp
 *
 * Flow dữ liệu:
 * ViewModel (hooks/useWatchlistViewModel.ts)
 *     ↓ (trả về state + actions)
 * View (WatchlistScreen.tsx)
 *     ↓ (render)
 * Components (StockItemView, SearchBarView, FilterBarView)
 */

import React, { useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWatchlistViewModel } from '../../viewmodels';
import { useAuth } from '../../context/AuthContext';
import { StockItemView } from '../components/StockItemView';
import { SearchBarView } from '../components/SearchBarView';
import { FilterBarView } from '../components/FilterBarView';
import { EmptyState, LoadingSpinner } from '../../ui-kit';
import { Stock } from '../../models';

// ============================================================================
// SCREEN VIEW - Main Screen Component
// ============================================================================

/**
 * WatchlistScreen - Main screen view
 *
 * Kết nối với ViewModel và render UI
 */
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
    isEmpty,
    isFiltered,
  } = useWatchlistViewModel();

  // ---------- AUTH ----------
  const { user, logout } = useAuth();

  // ---------- HANDLERS ----------
  const handleStockPress = useCallback((stock: Stock) => {
    console.log('Stock pressed:', stock.symbol);
  }, []);

  const handleClearSearch = useCallback(() => {
    updateFilters({ searchQuery: '' });
  }, [updateFilters]);

  const handleClearFilters = useCallback(() => {
    updateFilters({
      searchQuery: '',
      showFavoritesOnly: false,
    });
  }, [updateFilters]);

  const handleLogout = useCallback(async () => {
    await logout();
    // Navigation sẽ tự động về Login nhờ RootNavigator
  }, [logout]);

  // ---------- RENDER HELPERS ----------
  const renderItem = useCallback(
    ({ item }: { item: Stock }) => (
      <StockItemView
        stock={item}
        onToggleFavorite={toggleFavorite}
        onPress={handleStockPress}
      />
    ),
    [toggleFavorite, handleStockPress]
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <SearchBarView
        value={filters.searchQuery}
        onChangeText={(text) => updateFilters({ searchQuery: text })}
        placeholder="Search stocks..."
        onClear={handleClearSearch}
      />
      <FilterBarView filters={filters} onFilterChange={updateFilters} />
      <Text style={styles.countText}>
        Showing {filteredCount} of {totalCount} stocks
      </Text>
    </View>
  );

  const renderEmpty = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return (
        <EmptyState
          title="Error"
          description={error}
          icon="❌"
          actionLabel="Retry"
          onAction={() => {}}
        />
      );
    }

    return (
      <EmptyState
        title="No stocks found"
        description={
          filters.showFavoritesOnly
            ? "You haven't added any favorites yet"
            : 'Try adjusting your search or filters'
        }
        icon="📊"
        actionLabel="Clear Filters"
        onAction={handleClearFilters}
      />
    );
  };

  // ---------- RENDER USER INFO & LOGOUT ----------
  const renderUserSection = () => (
    <View style={styles.userSection}>
      <View style={styles.userInfo}>
        <Text style={styles.welcomeText}>Welcome,</Text>
        <Text style={styles.userName}>{user?.name || user?.email || 'User'}</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  // ---------- MAIN RENDER ----------
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderUserSection()}
      <View style={styles.listContainer}>
        <FlashList
          data={filteredStocks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={!isEmpty ? renderHeader : null}
          ListEmptyComponent={renderEmpty}
          estimatedItemSize={80}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  userSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 12,
    color: '#666',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    marginBottom: 16,
  },
  countText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyListContent: {
    flexGrow: 1,
  },
});

// ============================================================================
// EXPORTS
// ============================================================================

export default WatchlistScreen;
