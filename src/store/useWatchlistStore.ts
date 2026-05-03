// File: src/store/useWatchlistStore.ts
import { create } from 'zustand';
import { Stock } from '../models/Stock';

// Tạm thời đưa DUMMY data vào đây làm data mặc định của Store
const DUMMY_STOCKS: Stock[] = [
  { id: '1', symbol: 'AAPL', name: 'Apple Inc.', price: 175.5, change: 1.2, changePercent: 1.2, isFav: true },
  { id: '2', symbol: 'TSLA', name: 'Tesla Inc.', price: 210.8, change: -2.5, changePercent: -2.5, isFav: false },
  { id: '3', symbol: 'GOOGL', name: 'Alphabet Inc.', price: 135.2, change: 0.8, changePercent: 0.8, isFav: false },
  { id: '4', symbol: 'MSFT', name: 'Microsoft Corp.', price: 330.1, change: 1.5, changePercent: 1.5, isFav: true },
];

interface WatchlistStore {
  stocks: Stock[];
  // Định nghĩa các hàm (Action) để biến đổi state
  toggleFavorite: (id: string) => void;
}

// Khởi tạo Zustand Store
export const useWatchlistStore = create<WatchlistStore>((set) => ({
  stocks: DUMMY_STOCKS, // Dữ liệu ban đầu

  // Hàm thay đổi trạng thái tim (Action)
  toggleFavorite: (id: string) =>
    set((state) => ({
      stocks: state.stocks.map(stock =>
        stock.id === id ? { ...stock, isFav: !stock.isFav } : stock
      )
    })),
}));