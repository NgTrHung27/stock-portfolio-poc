// File: src/views/components/ParallaxScrollView.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

interface Props {
  headerImage: React.ReactElement;
  headerHeight?: number;
  children: React.ReactNode;
}

export default function ParallaxScrollView({ 
  headerImage, 
  headerHeight = 250, 
  children 
}: Props) {
  // 1. Tạo biến lưu trữ vị trí cuộn trên UI Thread
  const scrollOffset = useSharedValue(0);

  // 2. Lắng nghe sự kiện cuộn
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });

  // 3. Tính toán Style động cho Header dựa trên vị trí cuộn
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          // Khi đẩy lên (scroll xuống), header chạy chậm hơn nội dung một chút
          translateY: interpolate(
            scrollOffset.value,
            [-headerHeight, 0, headerHeight],
            [-headerHeight / 2, 0, headerHeight * 0.75], 
            Extrapolation.CLAMP
          ),
        },
        {
          // Khi kéo ngược xuống (pull to refresh), header phóng to ra
          scale: interpolate(
            scrollOffset.value,
            [-headerHeight, 0, headerHeight],
            [2, 1, 1],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      {/* 4. Khối Header nằm DƯỚI (position absolute) */}
      <Animated.View style={[styles.header, { height: headerHeight }, headerAnimatedStyle]}>
        {headerImage}
      </Animated.View>

      {/* 5. Khối Nội dung cuộn NẰM TRÊN */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: headerHeight }}
      >
        <View style={styles.content}>
          {children}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    minHeight: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});
