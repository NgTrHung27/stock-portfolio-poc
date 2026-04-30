/**
 * =============================================================================
 * SERVICES LAYER - Stock Service
 * =============================================================================
 *
 * Services layer chứa code giao tiếp với bên ngoài (API, Storage, etc.)
 * Đây là phần "Model" giao tiếp infrastructure.
 *
 * Trong MVVM, Services không thuộc Model thuần (chỉ chứa data definitions).
 * Services là phần "Data Access Layer" - gọi API, đọc local storage, etc.
 *
 * Ví dụ trong Flutter: lib/features/xxx/data/repositories/
 */

import { Stock } from '../models';

// ============================================================================
// API RESPONSE TYPES - DTOs (Data Transfer Objects)
// ============================================================================

/**
 * Response từ API get stocks
 */
export interface StocksApiResponse {
  stocks: Stock[];
  total: number;
  page: number;
}

/**
 * Response từ API get single stock
 */
export interface StockApiResponse {
  stock: Stock;
}

// ============================================================================
// SERVICE INTERFACE - Interface cho service (để có thể mock/test dễ)
// ============================================================================

export interface IStockService {
  /** Lấy danh sách stocks */
  getStocks(): Promise<Stock[]>;

  /** Lấy 1 stock theo ID */
  getStockById(id: string): Promise<Stock | null>;

  /** Toggle favorite status */
  toggleFavorite(id: string): Promise<Stock>;

  /** Tìm kiếm stocks */
  searchStocks(query: string): Promise<Stock[]>;
}

// ============================================================================
// STOCK SERVICE IMPLEMENTATION - Implementation cụ thể
// ============================================================================

/**
 * StockService - Implementation của IStockService
 *
 * Hiện tại dùng mock data. Sau này thay bằng API thật.
 *
 * Design Pattern: Repository Pattern
 * - Interface IStockService định nghĩa contract
 * - StockService implement interface
 * - Dễ dàng thay đổi data source (mock → API thật)
 */
class StockServiceImpl implements IStockService {
  // Mock data - thay bằng API call thật sau
  private mockStocks: Stock[] = [
    { id: '1', symbol: 'AAPL', name: 'Apple Inc.', price: 175.50, change: 2.30, changePercent: 1.33, isFav: true },
    { id: '2', symbol: 'TSLA', name: 'Tesla Inc.', price: 210.80, change: -3.45, changePercent: -1.61, isFav: false },
    { id: '3', symbol: 'GOOGL', name: 'Alphabet Inc.', price: 135.20, change: 1.15, changePercent: 0.86, isFav: false },
    { id: '4', symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.90, change: 4.20, changePercent: 1.12, isFav: true },
    { id: '5', symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.50, change: -1.80, changePercent: -1.00, isFav: false },
    { id: '6', symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.30, change: 15.40, changePercent: 1.79, isFav: true },
    { id: '7', symbol: 'META', name: 'Meta Platforms', price: 485.60, change: 6.30, changePercent: 1.31, isFav: false },
    { id: '8', symbol: 'NFLX', name: 'Netflix Inc.', price: 628.90, change: -4.50, changePercent: -0.71, isFav: false },
  ];

  /**
   * Lấy tất cả stocks
   * Mô phỏng API call với delay 500ms
   */
  async getStocks(): Promise<Stock[]> {
    // Simulate network delay
    await this.delay(500);

    // Trong thực tế, đây sẽ là:
    // const response = await fetch('https://api.example.com/stocks');
    // return response.json();

    return [...this.mockStocks];
  }

  /**
   * Lấy stock theo ID
   */
  async getStockById(id: string): Promise<Stock | null> {
    await this.delay(200);
    return this.mockStocks.find(s => s.id === id) || null;
  }

  /**
   * Toggle favorite status
   */
  async toggleFavorite(id: string): Promise<Stock> {
    await this.delay(100);

    const stock = this.mockStocks.find(s => s.id === id);
    if (!stock) {
      throw new Error(`Stock with id ${id} not found`);
    }

    stock.isFav = !stock.isFav;
    return { ...stock };
  }

  /**
   * Tìm kiếm stocks
   */
  async searchStocks(query: string): Promise<Stock[]> {
    await this.delay(300);

    const lowerQuery = query.toLowerCase();
    return this.mockStocks.filter(
      s => s.symbol.toLowerCase().includes(lowerQuery) ||
           s.name.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Helper: simulate network delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================================================
// SERVICE INSTANCE - Singleton instance
// ============================================================================

/**
 * StockService - Singleton instance
 *
 * Export như singleton để dùng chung trong app.
 * Hoặc có thể inject vào hooks để test dễ hơn.
 */
export const stockService: IStockService = new StockServiceImpl();

// ============================================================================
// FACTORY FUNCTIONS - Tạo service với dependencies
// ============================================================================

/**
 * Tạo StockService với custom base URL
 * Dùng khi cần connect đến different environments
 */
export const createStockService = (baseUrl?: string): IStockService => {
  // Trong thực tế, có thể inject axios instance với base URL
  return new StockServiceImpl();
};

export default stockService;
