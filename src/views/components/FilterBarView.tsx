/**
 * =============================================================================
 * VIEW LAYER - FilterBarView Component
 * =============================================================================
 *
 * View component cho FilterBar
 */

import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SortOption, FilterOptions } from '../../models';

export interface FilterBarViewProps {
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
}

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Symbol', value: 'symbol' },
  { label: 'Price', value: 'price' },
  { label: 'Change', value: 'change' },
  { label: 'Name', value: 'name' },
];

export const FilterBarView: React.FC<FilterBarViewProps> = memo(({
  filters,
  onFilterChange,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {SORT_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.sortButton,
              filters.sortBy === option.value && styles.sortButtonActive,
            ]}
            onPress={() => onFilterChange({ sortBy: option.value })}
          >
            <Text
              style={[
                styles.sortButtonText,
                filters.sortBy === option.value && styles.sortButtonTextActive,
              ]}
            >
              {option.label}
              {filters.sortBy === option.value && (
                <Text> {filters.sortDirection === 'asc' ? '↑' : '↓'}</Text>
              )}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[
            styles.filterButton,
            filters.showFavoritesOnly && styles.filterButtonActive,
          ]}
          onPress={() =>
            onFilterChange({ showFavoritesOnly: !filters.showFavoritesOnly })
          }
        >
          <Text
            style={[
              styles.filterButtonText,
              filters.showFavoritesOnly && styles.filterButtonTextActive,
            ]}
          >
            ❤️ Favorites
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  scrollContent: {
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  sortButtonActive: {
    backgroundColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#666',
  },
  sortButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  filterButtonActive: {
    backgroundColor: '#FF2D55',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default FilterBarView;
