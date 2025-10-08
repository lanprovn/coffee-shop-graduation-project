/**
 * Bulk Order/Wholesale System - Frontend only
 * Tính năng đặt hàng số lượng lớn cho doanh nghiệp
 */

import { useState, useEffect, useCallback } from 'react';
import { CoffeeProduct, ProductSize } from '@/types';
import { useProduct } from '@/hooks/useProduct';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import { 
  BuildingOfficeIcon, 
  TruckIcon, 
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import ButtonFilled from '@/components/shared/button/ButtonFilled';
import ButtonOutline from '@/components/shared/button/ButtonOutline';

const BULK_ORDER_KEY = 'coffee-shop-bulk-orders';

export interface BulkOrderItem {
  productId: string;
  productName: string;
  size: ProductSize;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface BulkOrder {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  items: BulkOrderItem[];
  subtotal: number;
  bulkDiscount: number;
  totalAmount: number;
  deliveryDate: string;
  specialInstructions?: string;
  status: 'draft' | 'submitted' | 'confirmed' | 'processing' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export function useBulkOrder() {
  const { getAllProducts } = useProduct();
  const { addToCart } = useShoppingCart();
  const [bulkOrders, setBulkOrders] = useState<BulkOrder[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Partial<BulkOrder>>({});

  // Load bulk orders from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(BULK_ORDER_KEY);
      if (saved) {
        setBulkOrders(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading bulk orders:', error);
    }
  }, []);

  // Save bulk orders to localStorage
  const saveBulkOrders = useCallback((orders: BulkOrder[]) => {
    try {
      localStorage.setItem(BULK_ORDER_KEY, JSON.stringify(orders));
      setBulkOrders(orders);
    } catch (error) {
      console.error('Error saving bulk orders:', error);
    }
  }, []);

  // Calculate bulk discount
  const calculateBulkDiscount = useCallback((items: BulkOrderItem[]) => {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalQuantity >= 100) {return 0.15;} // 15% discount for 100+ items
    if (totalQuantity >= 50) {return 0.10;}  // 10% discount for 50+ items
    if (totalQuantity >= 20) {return 0.05;}  // 5% discount for 20+ items
    return 0;
  }, []);

  // Add item to bulk order
  const addItemToBulkOrder = useCallback((product: CoffeeProduct, size: ProductSize, quantity: number) => {
    const sizeInfo = product.sizes.find(s => s.size === size);
    if (!sizeInfo) {return;}

    const newItem: BulkOrderItem = {
      productId: product.id,
      productName: product.displayName,
      size,
      quantity,
      unitPrice: sizeInfo.price,
      totalPrice: sizeInfo.price * quantity
    };

    setCurrentOrder(prev => {
      const existingItems = prev.items || [];
      const existingIndex = existingItems.findIndex(
        item => item.productId === product.id && item.size === size
      );

      let updatedItems;
      if (existingIndex >= 0) {
        updatedItems = [...existingItems];
        updatedItems[existingIndex].quantity += quantity;
        updatedItems[existingIndex].totalPrice = 
          updatedItems[existingIndex].quantity * updatedItems[existingIndex].unitPrice;
      } else {
        updatedItems = [...existingItems, newItem];
      }

      const subtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const bulkDiscount = calculateBulkDiscount(updatedItems);
      const discountAmount = subtotal * bulkDiscount;
      const totalAmount = subtotal - discountAmount;

      return {
        ...prev,
        items: updatedItems,
        subtotal,
        bulkDiscount: discountAmount,
        totalAmount
      };
    });
  }, [calculateBulkDiscount]);

  // Remove item from bulk order
  const removeItemFromBulkOrder = useCallback((productId: string, size: ProductSize) => {
    setCurrentOrder(prev => {
      const updatedItems = (prev.items || []).filter(
        item => !(item.productId === productId && item.size === size)
      );

      const subtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const bulkDiscount = calculateBulkDiscount(updatedItems);
      const discountAmount = subtotal * bulkDiscount;
      const totalAmount = subtotal - discountAmount;

      return {
        ...prev,
        items: updatedItems,
        subtotal,
        bulkDiscount: discountAmount,
        totalAmount
      };
    });
  }, [calculateBulkDiscount]);

  // Update item quantity
  const updateItemQuantity = useCallback((productId: string, size: ProductSize, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromBulkOrder(productId, size);
      return;
    }

    setCurrentOrder(prev => {
      const updatedItems = (prev.items || []).map(item => {
        if (item.productId === productId && item.size === size) {
          return {
            ...item,
            quantity,
            totalPrice: item.unitPrice * quantity
          };
        }
        return item;
      });

      const subtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const bulkDiscount = calculateBulkDiscount(updatedItems);
      const discountAmount = subtotal * bulkDiscount;
      const totalAmount = subtotal - discountAmount;

      return {
        ...prev,
        items: updatedItems,
        subtotal,
        bulkDiscount: discountAmount,
        totalAmount
      };
    });
  }, [removeItemFromBulkOrder, calculateBulkDiscount]);

  // Submit bulk order
  const submitBulkOrder = useCallback((orderData: Omit<BulkOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: BulkOrder = {
      ...orderData,
      id: `bulk_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedOrders = [newOrder, ...bulkOrders];
    saveBulkOrders(updatedOrders);
    setCurrentOrder({});

    return newOrder;
  }, [bulkOrders, saveBulkOrders]);

  // Clear current order
  const clearCurrentOrder = useCallback(() => {
    setCurrentOrder({});
  }, []);

  return {
    bulkOrders,
    currentOrder,
    addItemToBulkOrder,
    removeItemFromBulkOrder,
    updateItemQuantity,
    submitBulkOrder,
    clearCurrentOrder,
    calculateBulkDiscount
  };
}

/**
 * Bulk Order Form Component
 */
export function BulkOrderForm() {
  const { 
    currentOrder, 
    addItemToBulkOrder, 
    removeItemFromBulkOrder, 
    updateItemQuantity,
    submitBulkOrder,
    clearCurrentOrder 
  } = useBulkOrder();
  
  const { getAllProducts } = useProduct();
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    deliveryDate: '',
    specialInstructions: ''
  });

  const allProducts = getAllProducts();
  const items = currentOrder.items || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert('Vui lòng thêm ít nhất một sản phẩm');
      return;
    }

    const orderData: Omit<BulkOrder, 'id' | 'createdAt' | 'updatedAt'> = {
      companyName: formData.companyName,
      contactPerson: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      items,
      subtotal: currentOrder.subtotal || 0,
      bulkDiscount: currentOrder.bulkDiscount || 0,
      totalAmount: currentOrder.totalAmount || 0,
      deliveryDate: formData.deliveryDate,
      specialInstructions: formData.specialInstructions,
      status: 'submitted'
    };

    const newOrder = submitBulkOrder(orderData);
    alert(`Đơn hàng số lượng lớn đã được gửi! Mã đơn hàng: ${newOrder.id}`);
    clearCurrentOrder();
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      deliveryDate: '',
      specialInstructions: ''
    });
  };

  return (
    <div className="max-w-screen-2xl mx-auto p-4 mt-20">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            Đặt hàng số lượng lớn
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Selection */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Chọn sản phẩm
            </h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {allProducts.map(product => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={product.image}
                      alt={product.displayName}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {product.displayName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {product.description}
                      </p>
                      
                      <div className="space-y-2">
                        {product.sizes.map(size => (
                          <div key={size.size} className="flex items-center gap-2">
                            <span className="text-sm font-medium w-16">
                              {size.size}:
                            </span>
                            <span className="text-sm text-gray-600 w-20">
                              {size.price.toLocaleString()}đ
                            </span>
                            <input
                              type="number"
                              min="0"
                              placeholder="Số lượng"
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                              onChange={(e) => {
                                const quantity = parseInt(e.target.value) || 0;
                                if (quantity > 0) {
                                  addItemToBulkOrder(product, size.size, quantity);
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary & Form */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Thông tin đơn hàng
            </h2>

            {/* Order Items */}
            {items.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-gray-900 mb-3">Sản phẩm đã chọn:</h3>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium">{item.productName}</span>
                        <span className="text-gray-600 ml-2">({item.size})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(
                            item.productId, 
                            item.size, 
                            parseInt(e.target.value) || 1
                          )}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-xs"
                        />
                        <span className="w-20 text-right">
                          {item.totalPrice.toLocaleString()}đ
                        </span>
                        <button
                          onClick={() => removeItemFromBulkOrder(item.productId, item.size)}
                          className="text-red-600 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-300 mt-3 pt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Tạm tính:</span>
                    <span>{currentOrder.subtotal?.toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Giảm giá số lượng lớn:</span>
                    <span className="text-green-600">
                      -{currentOrder.bulkDiscount?.toLocaleString()}đ
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Tổng cộng:</span>
                    <span className="text-primary">
                      {currentOrder.totalAmount?.toLocaleString()}đ
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Company Information Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên công ty *
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Người liên hệ *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ giao hàng *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày giao hàng mong muốn *
                </label>
                <input
                  type="date"
                  required
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú đặc biệt
                </label>
                <textarea
                  rows={3}
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Yêu cầu đặc biệt về đóng gói, thời gian giao hàng..."
                />
              </div>

              <div className="flex gap-4">
                <ButtonFilled type="submit" className="flex-1">
                  <TruckIcon className="w-4 h-4 mr-2" />
                  Gửi đơn hàng số lượng lớn
                </ButtonFilled>
                <ButtonOutline onClick={clearCurrentOrder}>
                  Xóa đơn hàng
                </ButtonOutline>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
