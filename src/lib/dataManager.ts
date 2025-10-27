import { db } from './indexedDB';
import { mockData } from './mockData';

/**
 * Unified Data Manager - Single source of truth for all data operations
 * Consolidates localStorage and IndexedDB into one consistent interface
 */

interface DataStore {
  categories: any[];
  stock: any[];
  warehouses: any[];
  vendors: any[];
  customers: any[];
  purchases: any[];
  sales: any[];
  employees: any[];
  attendance: any[];
  company: any;
}

class DataManager {
  private initialized = false;
  private cache: Partial<DataStore> = {};

  /**
   * Initialize the data layer - migrate from localStorage to IndexedDB if needed
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await db.initialize();

      // Check if we need to migrate from localStorage
      const legacyData = localStorage.getItem('agroErpData');
      if (legacyData) {
        console.log('Migrating data from localStorage to IndexedDB...');
        await this.migrateFromLocalStorage(legacyData);
        localStorage.removeItem('agroErpData');
      }

      // Check if database is empty - seed with mock data
      const existingProducts = await db.getAll('products');
      if (existingProducts.length === 0) {
        console.log('Seeding database with initial data...');
        await this.seedDatabase();
      }

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize DataManager:', error);
      throw error;
    }
  }

  /**
   * Migrate legacy localStorage data to IndexedDB
   */
  private async migrateFromLocalStorage(legacyJson: string): Promise<void> {
    try {
      const data = JSON.parse(legacyJson);
      
      // Map old structure to new stores
      const storeMapping: Record<string, string> = {
        stock: 'products',
        sales: 'sales',
        purchases: 'purchases',
        customers: 'customers',
        vendors: 'vendors',
        company: 'settings'
      };

      for (const [oldKey, newStore] of Object.entries(storeMapping)) {
        if (data[oldKey]) {
          if (Array.isArray(data[oldKey])) {
            await db.saveAll(newStore, data[oldKey]);
          } else {
            await db.save(newStore, { id: 'company', ...data[oldKey] });
          }
        }
      }

      // Save warehouses, categories, employees separately
      if (data.warehouses) await db.saveAll('stock', data.warehouses.map((w: any) => ({ ...w, type: 'warehouse' })));
      if (data.categories) await db.saveAll('stock', data.categories.map((c: any) => ({ ...c, type: 'category' })));
      if (data.employees) await db.saveAll('stock', data.employees.map((e: any) => ({ ...e, type: 'employee' })));
      
      console.log('Migration completed successfully');
    } catch (error) {
      console.error('Migration failed:', error);
    }
  }

  /**
   * Seed database with initial mock data
   */
  private async seedDatabase(): Promise<void> {
    try {
      // Save products (stock items)
      await db.saveAll('products', mockData.stock);
      
      // Save other entities
      await db.saveAll('customers', mockData.customers);
      await db.saveAll('vendors', mockData.vendors);
      await db.saveAll('sales', mockData.sales);
      await db.saveAll('purchases', mockData.purchases);
      
      // Save metadata
      await db.saveAll('stock', [
        ...mockData.warehouses.map(w => ({ ...w, type: 'warehouse' })),
        ...mockData.categories.map(c => ({ ...c, type: 'category' })),
        ...mockData.employees.map(e => ({ ...e, type: 'employee' }))
      ]);
      
      // Save company settings
      await db.save('settings', { id: 'company', ...mockData.company });
      
      console.log('Database seeded successfully');
    } catch (error) {
      console.error('Failed to seed database:', error);
      throw error;
    }
  }

  /**
   * Get all data - returns cached version if available
   */
  async getAllData(): Promise<DataStore> {
    await this.initialize();

    try {
      const [
        products,
        customers,
        vendors,
        sales,
        purchases,
        stockData,
        settings
      ] = await Promise.all([
        db.getAll('products'),
        db.getAll('customers'),
        db.getAll('vendors'),
        db.getAll('sales'),
        db.getAll('purchases'),
        db.getAll('stock'),
        db.getAll('settings')
      ]);

      // Separate stock data by type
      const warehouses = stockData.filter((item: any) => item.type === 'warehouse');
      const categories = stockData.filter((item: any) => item.type === 'category');
      const employees = stockData.filter((item: any) => item.type === 'employee');

      const data: DataStore = {
        stock: products || [],
        customers: customers || [],
        vendors: vendors || [],
        sales: sales || [],
        purchases: purchases || [],
        warehouses: warehouses || [],
        categories: categories || [],
        employees: employees || [],
        attendance: [], // Not yet implemented
        company: settings.find((s: any) => s.id === 'company') || mockData.company
      };

      this.cache = data;
      return data;
    } catch (error) {
      console.error('Failed to get data:', error);
      // Return mock data as fallback
      return mockData as DataStore;
    }
  }

  /**
   * Update a specific data store
   */
  async updateData(storeName: keyof DataStore, data: any): Promise<void> {
    await this.initialize();

    try {
      // Map to correct IndexedDB store
      const storeMapping: Record<string, string> = {
        stock: 'products',
        customers: 'customers',
        vendors: 'vendors',
        sales: 'sales',
        purchases: 'purchases',
        company: 'settings'
      };

      const targetStore = storeMapping[storeName] || 'stock';

      if (Array.isArray(data)) {
        // For arrays, clear and save all
        await db.clear(targetStore);
        await db.saveAll(targetStore, data);
      } else {
        // For single objects
        await db.save(targetStore, { id: storeName, ...data });
      }

      // Update cache
      this.cache[storeName] = data;

      // Auto-backup on every update
      this.createBackup().catch(err => console.error('Auto-backup failed:', err));
    } catch (error) {
      console.error(`Failed to update ${storeName}:`, error);
      throw error;
    }
  }

  /**
   * Create backup
   */
  async createBackup(): Promise<string> {
    await this.initialize();
    return await db.createBackup();
  }

  /**
   * Restore from backup
   */
  async restoreBackup(backupJson: string): Promise<void> {
    await this.initialize();
    await db.restoreBackup(backupJson);
    this.cache = {}; // Clear cache
  }

  /**
   * Export data as JSON
   */
  async exportData(): Promise<string> {
    await this.initialize();
    return await db.exportToJSON();
  }

  /**
   * Import data from JSON
   */
  async importData(jsonData: string): Promise<void> {
    await this.initialize();
    await db.importFromJSON(jsonData);
    this.cache = {}; // Clear cache
  }

  /**
   * Clear all data (use with caution!)
   */
  async clearAll(): Promise<void> {
    await this.initialize();
    const stores = ['products', 'sales', 'purchases', 'customers', 'vendors', 'stock', 'settings'];
    await Promise.all(stores.map(store => db.clear(store)));
    this.cache = {};
  }
}

export const dataManager = new DataManager();
