import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useOfflineMode } from '@/hooks/useOfflineStore';

interface OfflineIndicatorProps {
  className?: string;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  className = '',
}) => {
  const { isOnline, pendingActions, syncInProgress, syncError } = useOfflineMode();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${className}`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5" />
            <span className="text-sm font-medium">
              Bạn đang offline. {pendingActions.length > 0 && `${pendingActions.length} hành động đang chờ đồng bộ.`}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface SyncStatusProps {
  className?: string;
}

export const SyncStatus: React.FC<SyncStatusProps> = ({
  className = '',
}) => {
  const { isOnline, syncInProgress, syncError, lastSyncTime } = useOfflineMode();

  if (!isOnline) return null;

  return (
    <div className={`flex items-center gap-2 text-sm text-gray-600 ${className}`}>
      {syncInProgress ? (
        <>
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Đang đồng bộ...</span>
        </>
      ) : syncError ? (
        <>
          <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
          <span className="text-red-500">Lỗi đồng bộ</span>
        </>
      ) : lastSyncTime ? (
        <>
          <WifiIcon className="w-4 h-4 text-green-500" />
          <span className="text-green-500">
            Đã đồng bộ {new Date(lastSyncTime).toLocaleTimeString()}
          </span>
        </>
      ) : null}
    </div>
  );
};

export default OfflineIndicator;
