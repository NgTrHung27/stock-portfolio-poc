/**
 * =============================================================================
 * VIEW LAYER - StockItemView Component
 * =============================================================================
 *
 * View = Components (UI) - Phần nhận data và hiển thị.
 *
 * Trong MVVM:
 * - View NHẬN data từ ViewModel (props)
 * - View GỌI methods của ViewModel (callbacks)
 * - View KHÔNG có business logic
 * - View KHÔNG gọi API trực tiếp
 *
 * Component này nhận props và hiển thị Stock item.
 */

import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { Card } from '../../ui-kit';
import { Stock } from '../../models';

// ============================================================================
// PROPS INTERFACE - Những gì View nhận vào
// ============================================================================

export interface StockItemViewProps {
  /** Stock data để hiển thị */
  stock: Stock;

  /** Callback khi toggle favorite */
  onToggleFavorite: (id: string) => void;

  /** Callback khi press vào item */
  onPress?: (stock: Stock) => void;
}

// ============================================================================
// COMPONENT - View nhận props, hiển thị UI
// ============================================================================

/**
 * StockItemView - Hiển thị 1 dòng stock
 *
 * @remarks
 * - Dùng `memo` để tránh re-render không cần thiết
 * - Nhận data từ props (từ ViewModel truyền vào)
 * - Gọi callbacks để notify ViewModel khi có action
 */
export const StockItemView: React.FC<StockItemViewProps> = memo(({
  stock,
  onToggleFavorite,
  onPress,
}) => {
  // ---------- REANIMATED ANIMATION ----------
  // useSharedValue: Tạo biến lưu trên UI Thread
  const iconScale = useSharedValue(1);

  // useAnimatedStyle: Liên kết SharedValue với Style
  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: iconScale.value }],
    };
  });

  // ---------- COMPUTED VALUES ----------
  const isPositiveChange = stock.change >= 0;

  // ---------- HANDLERS ----------
  const handleToggleFavorite = () => {
    // Kích hoạt animation: phóng to rồi thu nhỏ với hiệu ứng Spring
    iconScale.value = withSequence(
      withSpring(1.5, { damping: 2, stiffness: 80 }),
      withSpring(1)
    );

    onToggleFavorite(stock.id);
  };

  const handlePress = () => {
    onPress?.(stock);
  };

  // ---------- RENDER ----------
  return (
    <Card style={styles.card} variant="outlined" padding="medium">
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {/* LEFT SECTION - Symbol & Name */}
        <View style={styles.leftSection}>
          <Text style={styles.symbol}>{stock.symbol}</Text>
          <Text style={styles.name} numberOfLines={1}>
            {stock.name}
          </Text>
        </View>

        {/* RIGHT SECTION - Price & Favorite */}
        <View style={styles.rightSection}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${stock.price.toFixed(2)}</Text>
            <Text
              style={[
                styles.change,
                isPositiveChange ? styles.positive : styles.negative,
              ]}
            >
              {isPositiveChange ? '+' : ''}
              {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
            </Text>
          </View>

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Animated.Text style={[styles.favoriteIcon, animatedIconStyle]}>
              {stock.isFav ? '❤️' : '🤍'}
            </Animated.Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Card>
  );
});

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  name: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  change: {
    fontSize: 12,
    marginTop: 2,
  },
  positive: {
    color: '#34C759',
  },
  negative: {
    color: '#FF3B30',
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 24,
  },
});

// ============================================================================
// EXPORTS
// ============================================================================

export default StockItemView;
