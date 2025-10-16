import { KioskOrder } from '@/types';

export interface OfflineOrder {
  id: string;
  order: KioskOrder;
  timestamp: string;
  synced: boolean;
}

export interface SyncStatus {
  isOnline: boolean;
  pendingOrders: number;
  lastSync: string | null;
  syncInProgress: boolean;
}

class OfflineService {
  private dbName = 'POSKioskDB';
  private version = 1;
  private db: IDBDatabase | null = null;
  private syncStatus: SyncStatus = {
    isOnline: navigator.onLine,
    pendingOrders: 0,
    lastSync: null,
    syncInProgress: false
  };
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeDB();
    this.setupOnlineListeners();
  }

  private async initializeDB() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create orders store
        if (!db.objectStoreNames.contains('orders')) {
          const ordersStore = db.createObjectStore('orders', { keyPath: 'id' });
          ordersStore.createIndex('timestamp', 'timestamp');
          ordersStore.createIndex('synced', 'synced');
        }

        // Create products store
        if (!db.objectStoreNames.contains('products')) {
          const productsStore = db.createObjectStore('products', { keyPath: 'id' });
          productsStore.createIndex('category', 'category');
        }

        // Create settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  private setupOnlineListeners() {
    window.addEventListener('online', () => {
      this.syncStatus.isOnline = true;
      this.emit('statusChanged', this.syncStatus);
      this.syncPendingOrders();
    });

    window.addEventListener('offline', () => {
      this.syncStatus.isOnline = false;
      this.emit('statusChanged', this.syncStatus);
    });
  }

  // Order Management
  async saveOrderOffline(order: KioskOrder): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const offlineOrder: OfflineOrder = {
      id: order.id,
      order,
      timestamp: new Date().toISOString(),
      synced: false
    };

    const transaction = this.db.transaction(['orders'], 'readwrite');
    const store = transaction.objectStore('orders');
    
    await new Promise<void>((resolve, reject) => {
      const request = store.put(offlineOrder);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    this.updatePendingCount();
  }

  async getOfflineOrders(): Promise<OfflineOrder[]> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(['orders'], 'readonly');
    const store = transaction.objectStore('orders');
    
    return new Promise<OfflineOrder[]>((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingOrders(): Promise<OfflineOrder[]> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(['orders'], 'readonly');
    const store = transaction.objectStore('orders');
    const index = store.index('synced');
    
    return new Promise<OfflineOrder[]>((resolve, reject) => {
      const request = index.getAll(false);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async markOrderAsSynced(orderId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(['orders'], 'readwrite');
    const store = transaction.objectStore('orders');
    
    return new Promise<void>((resolve, reject) => {
      const getRequest = store.get(orderId);
      getRequest.onsuccess = () => {
        const offlineOrder = getRequest.result;
        if (offlineOrder) {
          offlineOrder.synced = true;
          const putRequest = store.put(offlineOrder);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          reject(new Error('Order not found'));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Product Management
  async saveProductsOffline(products: any[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(['products'], 'readwrite');
    const store = transaction.objectStore('products');
    
    for (const product of products) {
      await new Promise<void>((resolve, reject) => {
        const request = store.put(product);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }

  async getOfflineProducts(): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(['products'], 'readonly');
    const store = transaction.objectStore('products');
    
    return new Promise<any[]>((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Settings Management
  async saveSettingsOffline(key: string, value: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(['settings'], 'readwrite');
    const store = transaction.objectStore('settings');
    
    await new Promise<void>((resolve, reject) => {
      const request = store.put({ key, value });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getOfflineSettings(key: string): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(['settings'], 'readonly');
    const store = transaction.objectStore('settings');
    
    return new Promise<any>((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result?.value);
      request.onerror = () => reject(request.error);
    });
  }

  // Sync Operations
  async syncPendingOrders(): Promise<void> {
    if (!this.syncStatus.isOnline || this.syncStatus.syncInProgress) {
      return;
    }

    this.syncStatus.syncInProgress = true;
    this.emit('statusChanged', this.syncStatus);

    try {
      const pendingOrders = await this.getPendingOrders();
      
      for (const offlineOrder of pendingOrders) {
        try {
          // In a real implementation, this would send to your backend API
          await this.sendOrderToServer(offlineOrder.order);
          await this.markOrderAsSynced(offlineOrder.id);
        } catch (error) {
          console.error(`Failed to sync order ${offlineOrder.id}:`, error);
        }
      }

      this.syncStatus.lastSync = new Date().toISOString();
      this.updatePendingCount();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.syncStatus.syncInProgress = false;
      this.emit('statusChanged', this.syncStatus);
    }
  }

  private async sendOrderToServer(order: KioskOrder): Promise<void> {
    // Mock API call - replace with your actual backend endpoint
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
  }

  private async updatePendingCount(): Promise<void> {
    const pendingOrders = await this.getPendingOrders();
    this.syncStatus.pendingOrders = pendingOrders.length;
    this.emit('statusChanged', this.syncStatus);
  }

  // Event System
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Status
  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  // Cleanup
  async clearOfflineData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(['orders', 'products', 'settings'], 'readwrite');
    
    await Promise.all([
      new Promise<void>((resolve, reject) => {
        const request = transaction.objectStore('orders').clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
      new Promise<void>((resolve, reject) => {
        const request = transaction.objectStore('products').clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
      new Promise<void>((resolve, reject) => {
        const request = transaction.objectStore('settings').clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      })
    ]);

    this.updatePendingCount();
  }
}

// Export singleton instance
export const offlineService = new OfflineService();
export default offlineService;
