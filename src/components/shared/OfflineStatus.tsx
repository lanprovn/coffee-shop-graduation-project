import React, { useState, useEffect } from 'react';
import { offlineService, SyncStatus } from '@/service/offline';
import { 
  WifiIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function OfflineStatus() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(offlineService.getSyncStatus());

  useEffect(() => {
    const handleStatusChange = (status: SyncStatus) => {
      setSyncStatus(status);
    };

    offlineService.on('statusChanged', handleStatusChange);

    return () => {
      offlineService.off('statusChanged', handleStatusChange);
    };
  }, []);

  const handleSyncNow = async () => {
    await offlineService.syncPendingOrders();
  };

  if (syncStatus.isOnline && syncStatus.pendingOrders === 0) {
    return null; // Don't show anything when everything is synced
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className={`rounded-lg shadow-lg border p-4 max-w-sm ${
        syncStatus.isOnline 
          ? 'bg-yellow-50 border-yellow-200' 
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${
            syncStatus.isOnline 
              ? 'bg-yellow-100' 
              : 'bg-red-100'
          }`}>
            {syncStatus.isOnline ? (
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
            ) : (
              <WifiIcon className="w-5 h-5 text-red-600" />
            )}
          </div>
          
          <div className="flex-1">
            <p className={`font-medium ${
              syncStatus.isOnline ? 'text-yellow-800' : 'text-red-800'
            }`}>
              {syncStatus.isOnline ? 'Offline Mode' : 'No Internet Connection'}
            </p>
            <p className={`text-sm ${
              syncStatus.isOnline ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {syncStatus.pendingOrders > 0 
                ? `${syncStatus.pendingOrders} đơn hàng chờ đồng bộ`
                : 'Tất cả dữ liệu đã được đồng bộ'
              }
            </p>
          </div>

          {syncStatus.isOnline && syncStatus.pendingOrders > 0 && (
            <button
              onClick={handleSyncNow}
              disabled={syncStatus.syncInProgress}
              className={`p-2 rounded-full transition-colors ${
                syncStatus.syncInProgress
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
            >
              <ArrowPathIcon className={`w-4 h-4 ${
                syncStatus.syncInProgress ? 'animate-spin' : ''
              }`} />
            </button>
          )}
        </div>

        {syncStatus.lastSync && (
          <div className="mt-2 text-xs text-gray-500">
            Đồng bộ lần cuối: {new Date(syncStatus.lastSync).toLocaleString('vi-VN')}
          </div>
        )}
      </div>
    </div>
  );
}
