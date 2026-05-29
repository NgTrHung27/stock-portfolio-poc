// File: src/views/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useHomeViewModel } from '../../viewmodels/useHomeViewModel';
import ParallaxScrollView from '../components/ParallaxScrollView';

export default function HomeScreen() {
  const { totalFavorites, topGainer } = useHomeViewModel();

  // Đây sẽ là cái nền màu mè ở phía trên cùng
  const HeaderBackground = (
    <View style={styles.headerBackground}>
      <Text style={styles.headerWelcome}>Xin chào, Hưng! 👋</Text>
      <Text style={styles.headerSub}>Chào mừng quay trở lại danh mục.</Text>
    </View>
  );

  return (
    <ParallaxScrollView headerImage={HeaderBackground} headerHeight={200}>
      {/* NỘI DUNG CUỘN Ở BÊN DƯỚI */}
      <Text style={styles.sectionTitle}>Tổng quan danh mục</Text>

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
      
      {/* Thêm vài cục View giả để danh sách đủ dài để cuộn được */}
      <View style={{ height: 200, backgroundColor: '#fff', borderRadius: 12, marginTop: 16 }} />
      <View style={{ height: 200, backgroundColor: '#fff', borderRadius: 12, marginTop: 16 }} />
      <View style={{ height: 200, backgroundColor: '#fff', borderRadius: 12, marginTop: 16 }} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerBackground: {
    flex: 1,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerWelcome: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 16, color: '#e0e0e0', marginTop: 8 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
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
  highlightCard: { borderLeftWidth: 4, borderLeftColor: '#4CAF50' },
  cardLabel: { fontSize: 14, color: '#666', marginBottom: 8 },
  cardValue: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a' },
  stockSymbol: { fontSize: 20, fontWeight: '700', color: '#333' },
  stockChange: { fontSize: 16, color: '#4CAF50', fontWeight: 'bold', marginTop: 4 }
});
