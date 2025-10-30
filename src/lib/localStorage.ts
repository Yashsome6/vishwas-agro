// localStorage wrapper with error handling and type safety

export interface StorageData {
  categories: any[];
  stock: any[];
  warehouses: any[];
  stockMovements: any[];
  [key: string]: any;
}

class LocalStorageManager {
  private readonly prefix = 'stock_mgmt_';

  save<T>(key: string, data: T): boolean {
    try {
      const fullKey = this.prefix + key;
      localStorage.setItem(fullKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage:`, error);
      return false;
    }
  }

  load<T>(key: string): T | null {
    try {
      const fullKey = this.prefix + key;
      const stored = localStorage.getItem(fullKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error(`Failed to load ${key} from localStorage:`, error);
      return null;
    }
  }

  saveAll(data: Partial<StorageData>): boolean {
    try {
      Object.entries(data).forEach(([key, value]) => {
        this.save(key, value);
      });
      return true;
    } catch (error) {
      console.error('Failed to save all data:', error);
      return false;
    }
  }

  loadAll(): Partial<StorageData> {
    try {
      const result: Partial<StorageData> = {};
      const keys = ['categories', 'stock', 'warehouses', 'stockMovements'];
      
      keys.forEach(key => {
        const data = this.load(key);
        if (data) {
          result[key] = data;
        }
      });
      
      return result;
    } catch (error) {
      console.error('Failed to load all data:', error);
      return {};
    }
  }

  remove(key: string): void {
    const fullKey = this.prefix + key;
    localStorage.removeItem(fullKey);
  }

  clear(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix));
    keys.forEach(key => localStorage.removeItem(key));
  }
}

export const storage = new LocalStorageManager();
