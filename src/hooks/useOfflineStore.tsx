import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CoffeeProduct, CartItem, UserAddress, DeliveryOrder } from '@/types';

interface OfflineState {
  // Offline status
  isOnline: boolean;
  lastSyncTime: string | null;
  pendingActions: PendingAction[];
  
  // Cached data
  cachedProducts: CoffeeProduct[];
  cachedCart: CartItem[];
  cachedAddresses: UserAddress[];
  cachedOrders: DeliveryOrder[];
  
  // Sync status
  syncInProgress: boolean;
  syncError: string | null;
  retryCount: number;
}

interface PendingAction {
  id: string;
  type: 'add_to_cart' | 'remove_from_cart' | 'update_cart' | 'add_address' | 'create_order';
  data: any;
  timestamp: string;
  retryCount: number;
}

interface OfflineActions {
  // Network status
  setOnlineStatus: (isOnline: boolean) => void;
  
  // Data caching
  cacheProducts: (products: CoffeeProduct[]) => void;
  cacheCart: (cart: CartItem[]) => void;
  cacheAddresses: (addresses: UserAddress[]) => void;
  cacheOrders: (orders: DeliveryOrder[]) => void;
  
  // Pending actions
  addPendingAction: (action: Omit<PendingAction, 'id' | 'timestamp' | 'retryCount'>) => void;
  removePendingAction: (id: string) => void;
  retryPendingAction: (id: string) => void;
  
  // Sync operations
  syncData: () => Promise<void>;
  syncPendingActions: () => Promise<void>;
  clearSyncError: () => void;
  
  // Offline utilities
  getCachedData: <T>(key: keyof OfflineState, fallback: T) => T;
  isDataStale: (lastUpdate: string, maxAge: number) => boolean;
}

export const useOfflineStore = create<OfflineState & OfflineActions>()(
  persist(
    (set, get) => ({
      // Initial state
      isOnline: navigator.onLine,
      lastSyncTime: null,
      pendingActions: [],
      cachedProducts: [],
      cachedCart: [],
      cachedAddresses: [],
      cachedOrders: [],
      syncInProgress: false,
      syncError: null,
      retryCount: 0,

      // Network status
      setOnlineStatus: (isOnline) => {
        set({ isOnline });
        
        // Auto-sync when coming back online
        if (isOnline && get().pendingActions.length > 0) {
          get().syncPendingActions();
        }
      },

      // Data caching
      cacheProducts: (products) => {
        set({ 
          cachedProducts: products,
          lastSyncTime: new Date().toISOString()
        });
      },

      cacheCart: (cart) => {
        set({ cachedCart: cart });
      },

      cacheAddresses: (addresses) => {
        set({ cachedAddresses: addresses });
      },

      cacheOrders: (orders) => {
        set({ cachedOrders: orders });
      },

      // Pending actions
      addPendingAction: (actionData) => {
        const action: PendingAction = {
          id: `pending-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...actionData,
          timestamp: new Date().toISOString(),
          retryCount: 0,
        };

        set((state) => ({
          pendingActions: [...state.pendingActions, action],
        }));
      },

      removePendingAction: (id) => {
        set((state) => ({
          pendingActions: state.pendingActions.filter(action => action.id !== id),
        }));
      },

      retryPendingAction: (id) => {
        set((state) => ({
          pendingActions: state.pendingActions.map(action =>
            action.id === id
              ? { ...action, retryCount: action.retryCount + 1 }
              : action
          ),
        }));
      },

      // Sync operations
      syncData: async () => {
        const { syncInProgress, isOnline } = get();
        
        if (syncInProgress || !isOnline) return;

        set({ syncInProgress: true, syncError: null });

        try {
          // Simulate API calls for data sync
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({ 
            lastSyncTime: new Date().toISOString(),
            syncInProgress: false,
            retryCount: 0
          });
        } catch (error) {
          set({ 
            syncError: error instanceof Error ? error.message : 'Sync failed',
            syncInProgress: false,
            retryCount: get().retryCount + 1
          });
        }
      },

      syncPendingActions: async () => {
        const { pendingActions, isOnline } = get();
        
        if (!isOnline || pendingActions.length === 0) return;

        set({ syncInProgress: true });

        try {
          // Process pending actions
          for (const action of pendingActions) {
            try {
              await processPendingAction(action);
              get().removePendingAction(action.id);
            } catch (error) {
              if (action.retryCount < 3) {
                get().retryPendingAction(action.id);
              } else {
                get().removePendingAction(action.id);
              }
            }
          }

          set({ syncInProgress: false });
        } catch (error) {
          set({ 
            syncError: error instanceof Error ? error.message : 'Sync failed',
            syncInProgress: false
          });
        }
      },

      clearSyncError: () => {
        set({ syncError: null });
      },

      // Offline utilities
      getCachedData: (key, fallback) => {
        const state = get();
        const cachedValue = state[key as keyof OfflineState];
        return Array.isArray(cachedValue) && cachedValue.length > 0 ? cachedValue as T : fallback;
      },

      isDataStale: (lastUpdate, maxAge) => {
        const now = new Date().getTime();
        const updateTime = new Date(lastUpdate).getTime();
        return (now - updateTime) > maxAge;
      },
    }),
    {
      name: 'highland-offline-store',
      partialize: (state) => ({
        cachedProducts: state.cachedProducts,
        cachedCart: state.cachedCart,
        cachedAddresses: state.cachedAddresses,
        cachedOrders: state.cachedOrders,
        lastSyncTime: state.lastSyncTime,
        pendingActions: state.pendingActions,
      }),
    }
  )
);

// Process pending action (simulate API call)
async function processPendingAction(action: PendingAction): Promise<void> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulate API response
  switch (action.type) {
    case 'add_to_cart':
      console.log('Syncing add to cart:', action.data);
      break;
    case 'remove_from_cart':
      console.log('Syncing remove from cart:', action.data);
      break;
    case 'update_cart':
      console.log('Syncing update cart:', action.data);
      break;
    case 'add_address':
      console.log('Syncing add address:', action.data);
      break;
    case 'create_order':
      console.log('Syncing create order:', action.data);
      break;
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

// Hook for offline functionality
export const useOfflineMode = () => {
  const {
    isOnline,
    pendingActions,
    syncInProgress,
    syncError,
    lastSyncTime,
    setOnlineStatus,
    syncData,
    syncPendingActions,
    clearSyncError,
    getCachedData,
    isDataStale,
  } = useOfflineStore();

  // Listen for online/offline events
  React.useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnlineStatus]);

  // Auto-sync when online
  React.useEffect(() => {
    if (isOnline && pendingActions.length > 0) {
      syncPendingActions();
    }
  }, [isOnline, pendingActions.length, syncPendingActions]);

  // Periodic sync when online
  React.useEffect(() => {
    if (!isOnline) return;

    const interval = setInterval(() => {
      syncData();
    }, 30000); // Sync every 30 seconds

    return () => clearInterval(interval);
  }, [isOnline, syncData]);

  return {
    isOnline,
    pendingActions,
    syncInProgress,
    syncError,
    lastSyncTime,
    syncData,
    clearSyncError,
    getCachedData,
    isDataStale,
  };
};

export default useOfflineStore;
