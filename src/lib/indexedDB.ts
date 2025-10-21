// IndexedDB wrapper for persistent client-side storage
// Provides version control, backup, and migration support

interface DBConfig {
  name: string;
  version: number;
  stores: string[];
}

const DB_CONFIG: DBConfig = {
  name: 'VishwasAgroERP',
  version: 1,
  stores: ['products', 'sales', 'purchases', 'customers', 'vendors', 'stock', 'settings', 'backups']
};

class IndexedDBManager {
  private db: IDBDatabase | null = null;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores if they don't exist
        DB_CONFIG.stores.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
          }
        });
      };
    });
  }

  async save<T>(storeName: string, data: T): Promise<void> {
    if (!this.db) await this.initialize();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async saveAll<T>(storeName: string, items: T[]): Promise<void> {
    if (!this.db) await this.initialize();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);

      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve();

      items.forEach(item => store.put(item));
    });
  }

  async get<T>(storeName: string, id: string): Promise<T | undefined> {
    if (!this.db) await this.initialize();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    if (!this.db) await this.initialize();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  async delete(storeName: string, id: string): Promise<void> {
    if (!this.db) await this.initialize();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clear(storeName: string): Promise<void> {
    if (!this.db) await this.initialize();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async createBackup(): Promise<string> {
    const backup: Record<string, any[]> = {};
    
    for (const store of DB_CONFIG.stores) {
      backup[store] = await this.getAll(store);
    }

    const backupData = {
      id: `backup_${Date.now()}`,
      timestamp: new Date().toISOString(),
      version: DB_CONFIG.version,
      data: backup
    };

    await this.save('backups', backupData);
    return JSON.stringify(backupData);
  }

  async restoreBackup(backupJson: string): Promise<void> {
    const backup = JSON.parse(backupJson);
    
    for (const [storeName, items] of Object.entries(backup.data)) {
      if (DB_CONFIG.stores.includes(storeName)) {
        await this.clear(storeName);
        await this.saveAll(storeName, items as any[]);
      }
    }
  }

  async exportToJSON(): Promise<string> {
    const exportData: Record<string, any[]> = {};
    
    for (const store of DB_CONFIG.stores) {
      if (store !== 'backups') {
        exportData[store] = await this.getAll(store);
      }
    }

    return JSON.stringify(exportData, null, 2);
  }

  async importFromJSON(jsonData: string): Promise<void> {
    const data = JSON.parse(jsonData);
    
    for (const [storeName, items] of Object.entries(data)) {
      if (DB_CONFIG.stores.includes(storeName) && Array.isArray(items)) {
        await this.saveAll(storeName, items);
      }
    }
  }
}

export const db = new IndexedDBManager();
