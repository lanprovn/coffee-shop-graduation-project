# Coffee Shop - Highlands Coffee Business Logic Updates

## Tổng quan
Đã cập nhật toàn bộ project Coffee-Shop để mô phỏng quy trình Highlands Coffee với các tính năng nghiệp vụ mới, chuẩn bị sẵn sàng cho việc tích hợp backend Java Spring Boot.

## Các thay đổi chính

### 1. Cấu trúc dữ liệu sản phẩm mới
- **File**: `src/data/products.ts`
- **Tính năng**:
  - Phân loại sản phẩm: Coffee, Tea, Freeze, Cake
  - Hỗ trợ size: S, M, L với giá khác nhau
  - Hệ thống topping: Trân châu, kem sữa, sốt chocolate, etc.
  - Cấu trúc dữ liệu mở rộng với `ProductSizeOption` và `Topping`

### 2. Hệ thống voucher
- **File**: `src/data/vouchers.ts`
- **Tính năng**:
  - Voucher theo phần trăm hoặc số tiền cố định
  - Điều kiện đơn hàng tối thiểu
  - Giới hạn giảm giá tối đa
  - Ngày hết hạn

### 3. API Client Structure
- **File**: `src/services/apiClient.ts`
- **Tính năng**:
  - Interface chuẩn cho API calls
  - Mock data implementation
  - Sẵn sàng chuyển sang backend thật
  - Hỗ trợ Products, Vouchers, Orders, Cart APIs

### 4. Hook useApi
- **File**: `src/hooks/useApi.ts`
- **Tính năng**:
  - Centralized API management
  - Error handling
  - Loading states
  - Dễ dàng chuyển sang backend thật

### 5. Cập nhật Shopping Cart
- **Files**: 
  - `src/hooks/provider/ShoppingCartProvider.tsx`
  - `src/hooks/context/ShoppingCartContext.tsx`
  - `src/pages/CartPage/CartPage.tsx`
- **Tính năng**:
  - Hỗ trợ size và topping khi thêm vào giỏ
  - Tính toán giá chính xác theo size và topping
  - Hiển thị thông tin chi tiết sản phẩm trong giỏ hàng

### 6. Checkout với Voucher
- **File**: `src/pages/CheckoutPage/CheckoutPage.tsx`
- **Tính năng**:
  - Nhập và validate mã voucher
  - Tính toán giảm giá tự động
  - Hiển thị tóm tắt đơn hàng chi tiết
  - Phí giao hàng: 20.000đ nếu đơn < 100.000đ, miễn phí nếu >= 100.000đ

### 7. Hệ thống đơn hàng
- **Files**:
  - `src/pages/OrderHistoryPage/`
  - `src/pages/OrderDetailPage/`
- **Tính năng**:
  - Lưu đơn hàng vào localStorage
  - Hiển thị lịch sử đơn hàng
  - Chi tiết đơn hàng với size, topping, voucher
  - Trạng thái đơn hàng: Pending, Confirmed, Preparing, Ready, Delivered, Cancelled

### 8. TypeScript Types mở rộng
- **File**: `src/types/index.ts`
- **Tính năng**:
  - `ProductCategory`, `ProductSize`, `Topping`
  - `Voucher`, `Order`, `OrderStatus`
  - Cập nhật `CartItem` với size, topping, pricing
  - Cập nhật `OrderItem` với thông tin chi tiết

## Cấu trúc API sẵn sàng cho Backend

### Products API
```typescript
getProducts(): Promise<ApiResponse<CoffeeProduct[]>>
getProductById(id: string): Promise<ApiResponse<CoffeeProduct>>
getProductsByCategory(category: string): Promise<ApiResponse<CoffeeProduct[]>>
```

### Vouchers API
```typescript
getVouchers(): Promise<ApiResponse<Voucher[]>>
validateVoucher(code: string, orderAmount: number): Promise<ApiResponse<Voucher | null>>
```

### Orders API
```typescript
createOrder(orderData: Partial<Order>): Promise<ApiResponse<Order>>
getOrders(): Promise<ApiResponse<Order[]>>
getOrderById(id: string): Promise<ApiResponse<Order>>
```

### Cart API
```typescript
syncCart(cartItems: CartItem[]): Promise<ApiResponse<boolean>>
```

## Cách sử dụng

### 1. Thêm sản phẩm vào giỏ hàng
```typescript
const { addToCart } = useShoppingCart();
addToCart(product, quantity, ProductSize.Medium, [topping1, topping2]);
```

### 2. Validate voucher
```typescript
const { validateVoucher } = useApi();
const voucher = await validateVoucher('WELCOME10', 100000);
```

### 3. Tạo đơn hàng
```typescript
const { createOrder } = useApi();
const order = await createOrder({
  customer: customerData,
  items: cartItems,
  // ... other order data
});
```

## Chuẩn bị cho Backend Integration

1. **API Client**: Đã có sẵn interface và implementation
2. **Data Models**: Types đã được định nghĩa chuẩn
3. **Error Handling**: Có sẵn error handling trong useApi
4. **Loading States**: Có sẵn loading states cho UX tốt

## Lưu ý

- Tất cả dữ liệu hiện tại được lưu trong localStorage (mock)
- Khi chuyển sang backend thật, chỉ cần thay thế implementation trong `apiClient.ts`
- UI/UX được giữ nguyên, chỉ cập nhật logic nghiệp vụ
- Code được viết theo convention hiện có của project

## Testing

Để test các tính năng mới:

1. **Thêm sản phẩm**: Chọn size và topping khi thêm vào giỏ
2. **Voucher**: Sử dụng mã `WELCOME10`, `FREE50K`, `COFFEE20`, `NEWYEAR30`
3. **Checkout**: Kiểm tra tính toán giá với voucher và phí giao hàng
4. **Order History**: Xem lịch sử đơn hàng đã tạo
5. **Order Detail**: Xem chi tiết đơn hàng với size, topping, voucher
