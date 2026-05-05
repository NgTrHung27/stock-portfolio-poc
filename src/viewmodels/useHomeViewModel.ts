import { useMemo } from 'react';
import { useWatchlistStore } from '../store/useWatchlistStore';

export const useHomeViewModel = () => {
  // 1. Chỉ LẤY đúng mảng stocks từ Zustand, không lấy hàm actions
  const stocks = useWatchlistStore((state) => state.stocks);

  // 2. TÍNH TOÁN (Derived State)
  // Tính tổng số lượng mã đang được yêu thích
  const totalFavorites = useMemo(() => {
    return stocks.filter(stock => stock.isFav).length;
  }, [stocks]);

  // Có thể mở rộng thêm logic: Tính tổng tài sản, tính mã tăng mạnh nhất...
  const topGainer = useMemo(() => {
    // Tìm mã có % tăng cao nhất
    if (stocks.length === 0) return null;
    return stocks.reduce((prev, current) =>
      (prev.change > current.change) ? prev : current
    );
  }, [stocks]);

  return {
    totalFavorites,
    topGainer,
  };
};