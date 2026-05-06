// File: src/views/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useHomeViewModel } from '../../viewmodels/useHomeViewModel';

export default function HomeScreen() {
  // Lấy dữ liệu đã được xào nấu từ ViewModel
  const { totalFavorites, topGainer } = useHomeViewModel();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Tổng quan danh mục</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Đang theo dõi</Text>
        <Text style={styles.cardValue}>{totalFavorites} mã cổ phiếu</Text>
      </View>

      {topGainer && (
        <View style={[styles.card, styles.highlightCard]}>
          <Text style={styles.cardLabel}>Tăng mạnh nhất hôm nay</Text>
          <Text style={styles.stockSymbol}>{topGainer.symbol}</Text>
          <Text style={styles.stockChange}>+{topGainer.change}%</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  highlightCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  cardLabel: { fontSize: 14, color: '#666', marginBottom: 8 },
  cardValue: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a' },
  stockSymbol: { fontSize: 20, fontWeight: '700', color: '#333' },
  stockChange: { fontSize: 16, color: '#4CAF50', fontWeight: 'bold', marginTop: 4 }
});