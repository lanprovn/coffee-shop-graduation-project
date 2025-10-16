import React from 'react';
import { useKiosk } from '@/hooks/context/KioskContext';
import { KioskMode } from '@/types';
import KioskLayout from '@/components/layout/KioskLayout';
import POSKioskPage from '@/pages/POSKioskPage';

export default function POSKioskApp() {
  const { mode } = useKiosk();

  const renderContent = () => {
    switch (mode) {
      case KioskMode.ORDER:
        return <POSKioskPage />;
      case KioskMode.PAYMENT:
        return (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Thanh toán</h2>
              <p className="text-gray-600">Chức năng thanh toán đang được phát triển</p>
            </div>
          </div>
        );
      case KioskMode.ADMIN:
        return (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quản trị</h2>
              <p className="text-gray-600">Chức năng quản trị đang được phát triển</p>
            </div>
          </div>
        );
      case KioskMode.RECEIPT:
        return (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Hóa đơn đã được in</h2>
              <p className="text-gray-600">Cảm ơn bạn đã sử dụng dịch vụ!</p>
            </div>
          </div>
        );
      default:
        return <POSKioskPage />;
    }
  };

  return (
    <KioskLayout>
      {renderContent()}
    </KioskLayout>
  );
}