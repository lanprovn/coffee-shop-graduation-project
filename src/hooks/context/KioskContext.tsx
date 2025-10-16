import React, { createContext, useContext, useState, useEffect } from 'react';
import { KioskOrder, KioskSettings, HardwareDevice, KioskStats, KioskMode } from '@/types';
import { KIOSK_DEFAULT_SETTINGS } from '@/constants/constants';

interface KioskContextProps {
  // Current order
  currentOrder: KioskOrder | null;
  setCurrentOrder: (order: KioskOrder | null) => void;
  
  // Order history
  orderHistory: KioskOrder[];
  addOrderToHistory: (order: KioskOrder) => void;
  
  // Settings
  settings: KioskSettings;
  updateSettings: (settings: Partial<KioskSettings>) => void;
  
  // Hardware devices
  devices: HardwareDevice[];
  updateDeviceStatus: (deviceName: string, status: HardwareDevice['status']) => void;
  
  // Stats
  stats: KioskStats;
  updateStats: () => void;
  
  // Kiosk mode
  mode: KioskMode;
  setMode: (mode: KioskMode) => void;
  
  // Auto-logout
  lastActivity: Date;
  updateActivity: () => void;
  
  // Functions
  createNewOrder: () => KioskOrder;
  completeOrder: (order: KioskOrder) => void;
  cancelOrder: (orderId: string) => void;
  printReceipt: (order: KioskOrder) => Promise<boolean>;
  openCashDrawer: () => Promise<boolean>;
}

const KioskContext = createContext<KioskContextProps | undefined>(undefined);

export const useKiosk = () => {
  const context = useContext(KioskContext);
  if (!context) {
    throw new Error('useKiosk must be used within a KioskProvider');
  }
  return context;
};

interface KioskProviderProps {
  children: React.ReactNode;
}

export const KioskProvider: React.FC<KioskProviderProps> = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState<KioskOrder | null>(null);
  const [orderHistory, setOrderHistory] = useState<KioskOrder[]>([]);
  const [settings, setSettings] = useState<KioskSettings>(KIOSK_DEFAULT_SETTINGS);
  const [devices, setDevices] = useState<HardwareDevice[]>([
    { type: 'printer', name: 'POS Printer', status: 'connected', lastChecked: new Date().toISOString() },
    { type: 'cash_drawer', name: 'Cash Drawer', status: 'connected', lastChecked: new Date().toISOString() },
    { type: 'scanner', name: 'Barcode Scanner', status: 'disconnected', lastChecked: new Date().toISOString() },
    { type: 'display', name: 'Customer Display', status: 'connected', lastChecked: new Date().toISOString() }
  ]);
  const [stats, setStats] = useState<KioskStats>({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    ordersToday: 0,
    revenueToday: 0,
    topProducts: []
  });
  const [mode, setMode] = useState<KioskMode>(KioskMode.ORDER);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('kiosk-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('kiosk-settings', JSON.stringify(settings));
  }, [settings]);

  // Load order history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('kiosk-order-history');
    if (savedHistory) {
      setOrderHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save order history to localStorage
  useEffect(() => {
    localStorage.setItem('kiosk-order-history', JSON.stringify(orderHistory));
  }, [orderHistory]);

  // Auto-logout timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diffMinutes = (now.getTime() - lastActivity.getTime()) / (1000 * 60);
      
      if (diffMinutes >= settings.autoLogoutMinutes) {
        setMode(KioskMode.ORDER);
        setCurrentOrder(null);
        setLastActivity(now);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [lastActivity, settings.autoLogoutMinutes]);

  const updateSettings = (newSettings: Partial<KioskSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateDeviceStatus = (deviceName: string, status: HardwareDevice['status']) => {
    setDevices(prev => prev.map(device => 
      device.name === deviceName 
        ? { ...device, status, lastChecked: new Date().toISOString() }
        : device
    ));
  };

  const updateStats = () => {
    const today = new Date().toDateString();
    const todayOrders = orderHistory.filter(order => 
      new Date(order.createdAt).toDateString() === today
    );
    
    const newStats: KioskStats = {
      totalOrders: orderHistory.length,
      totalRevenue: orderHistory.reduce((sum, order) => sum + order.total, 0),
      averageOrderValue: orderHistory.length > 0 
        ? orderHistory.reduce((sum, order) => sum + order.total, 0) / orderHistory.length 
        : 0,
      ordersToday: todayOrders.length,
      revenueToday: todayOrders.reduce((sum, order) => sum + order.total, 0),
      topProducts: []
    };

    // Calculate top products
    const productSales: Record<string, { quantity: number; revenue: number; name: string }> = {};
    orderHistory.forEach(order => {
      order.items.forEach(item => {
        const key = item.product.id;
        if (!productSales[key]) {
          productSales[key] = { quantity: 0, revenue: 0, name: item.product.name };
        }
        productSales[key].quantity += item.quantity;
        productSales[key].revenue += item.totalPrice;
      });
    });

    newStats.topProducts = Object.entries(productSales)
      .map(([productId, data]) => ({
        productId,
        productName: data.name,
        quantity: data.quantity,
        revenue: data.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    setStats(newStats);
  };

  const updateActivity = () => {
    setLastActivity(new Date());
  };

  const createNewOrder = (): KioskOrder => {
    const newOrder: KioskOrder = {
      id: `ORD-${Date.now()}`,
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      paymentMethod: 'cash' as any,
      status: 'pending',
      createdAt: new Date().toISOString(),
      cashierId: 'kiosk-user'
    };
    
    setCurrentOrder(newOrder);
    updateActivity();
    return newOrder;
  };

  const addOrderToHistory = (order: KioskOrder) => {
    setOrderHistory(prev => [order, ...prev.slice(0, 999)]); // Keep last 1000 orders
    updateStats();
  };

  const completeOrder = (order: KioskOrder) => {
    const completedOrder = {
      ...order,
      status: 'completed' as const,
      completedAt: new Date().toISOString()
    };
    
    addOrderToHistory(completedOrder);
    setCurrentOrder(null);
    updateActivity();
  };

  const cancelOrder = (orderId: string) => {
    setOrderHistory(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'cancelled' as const }
        : order
    ));
    updateStats();
  };

  const printReceipt = async (order: KioskOrder): Promise<boolean> => {
    try {
      // Mock printer implementation
      console.log('Printing receipt for order:', order.id);
      
      // In a real implementation, this would send commands to the printer
      const printer = devices.find(d => d.type === 'printer');
      if (!printer || printer.status !== 'connected') {
        return false;
      }

      // Simulate printing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateActivity();
      return true;
    } catch (error) {
      console.error('Print error:', error);
      return false;
    }
  };

  const openCashDrawer = async (): Promise<boolean> => {
    try {
      // Mock cash drawer implementation
      console.log('Opening cash drawer');
      
      const cashDrawer = devices.find(d => d.type === 'cash_drawer');
      if (!cashDrawer || cashDrawer.status !== 'connected') {
        return false;
      }

      // Simulate opening delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateActivity();
      return true;
    } catch (error) {
      console.error('Cash drawer error:', error);
      return false;
    }
  };

  const value: KioskContextProps = {
    currentOrder,
    setCurrentOrder,
    orderHistory,
    addOrderToHistory,
    settings,
    updateSettings,
    devices,
    updateDeviceStatus,
    stats,
    updateStats,
    mode,
    setMode,
    lastActivity,
    updateActivity,
    createNewOrder,
    completeOrder,
    cancelOrder,
    printReceipt,
    openCashDrawer
  };

  return (
    <KioskContext.Provider value={value}>
      {children}
    </KioskContext.Provider>
  );
};
