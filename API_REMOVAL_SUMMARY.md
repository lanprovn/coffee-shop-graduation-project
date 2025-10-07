# API Removal Summary - Coffee Shop Frontend

## Mục tiêu
Xóa tất cả các phần liên quan đến API để chỉ giữ lại frontend với mock data, không cần backend.

## Các file đã xóa hoàn toàn:
- **`src/services/apiClient.ts`** - File API client chính
- **`src/hooks/useApi.ts`** - Hook sử dụng API client

## Các file đã được cập nhật để loại bỏ API dependencies:

### 1. **`src/pages/CheckoutPage/CheckoutPage.tsx`**
- **Xóa**: `import { useApi } from '@/hooks/useApi';`
- **Thay thế**: Mock functions `validateVoucher` và `createOrder` sử dụng localStorage
- **Mock data**: Voucher codes `WELCOME10`, `SAVE20` với validation logic

### 2. **`src/pages/DashboardPage.tsx`**
- **Xóa**: `import { useApi } from '@/hooks/useApi';`
- **Thay thế**: Mock function `getOrders` sử dụng localStorage
- **Mock data**: Tạo 2 đơn hàng mẫu nếu localStorage trống

### 3. **`src/pages/OrderDetailPage/useOrders.tsx`**
- **Xóa**: `import { useApi } from '@/hooks/useApi';`
- **Thay thế**: Mock function `getOrderById` sử dụng localStorage

### 4. **`src/pages/OrderHistoryPage/useOrders.tsx`**
- **Xóa**: `import { useApi } from '@/hooks/useApi';`
- **Thay thế**: Mock function `getOrders` sử dụng localStorage
- **Mock data**: Tạo 2 đơn hàng mẫu nếu localStorage trống

### 5. **`src/hooks/useNotification.ts`**
- **Sửa**: `import { Notification } from '@/types';` → `import type { Notification } from '@/types';`
- **Lý do**: Fix TypeScript error với isolatedModules

## Các file đã được cập nhật với mock data (không có API calls):

### 6. **`src/service/googleOAuth.ts`**
- **Mock implementation**: Trả về mock Google user data
- **Delay simulation**: 1 giây để simulate API call
- **Mock user**: `demo.user@example.com` với avatar mặc định

### 7. **`src/service/mapBoxGeoCoding.ts`**
- **Mock implementation**: Trả về mock address dựa trên coordinates
- **Delay simulation**: 500ms để simulate API call
- **Mock addresses**: 5 địa chỉ mẫu ở TP.HCM

### 8. **`src/constants/constants.ts`**
- **Mock values**: 
  - `GOOGLE_OAUTH_CLIENT_ID = "mock-google-client-id"`
  - `MAPBOX_ACCESS_TOKEN = "mock-mapbox-token"`

## Kết quả:
✅ **Không còn API calls thực** - Tất cả đều sử dụng mock data
✅ **Không còn lỗi linter** - TypeScript compilation thành công
✅ **Frontend hoàn toàn độc lập** - Chạy được mà không cần backend
✅ **Mock data đầy đủ** - Orders, vouchers, user data được lưu trong localStorage
✅ **UI/UX được giữ nguyên** - Tất cả tính năng frontend hoạt động bình thường

## Cách sử dụng:
1. Chạy `npm run dev` để start development server
2. Tất cả tính năng frontend hoạt động với mock data
3. Dữ liệu được lưu trong localStorage của browser
4. Không cần cấu hình API keys hay backend services

## Lưu ý:
- Khi cần tích hợp backend thật, chỉ cần thay thế các mock functions bằng API calls thực
- Cấu trúc code được giữ nguyên để dễ dàng tích hợp sau này
- Tất cả business logic frontend được bảo toàn
