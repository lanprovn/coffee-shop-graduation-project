# POS Kiosk System - Highland Coffee

## Tổng quan

POS Kiosk System là một ứng dụng Point of Sale (POS) thuần túy được thiết kế đặc biệt cho các cửa hàng Highland Coffee. Hệ thống tập trung hoàn toàn vào việc bán hàng tại cửa hàng với giao diện touch-friendly và các tính năng POS chuyên nghiệp.

**Đặc điểm nổi bật:**
- ✅ **Không cần đăng nhập**: Hoạt động ngay lập tức
- ✅ **Giao diện đơn giản**: Chỉ tập trung vào bán hàng
- ✅ **Khởi động trực tiếp**: Truy cập thẳng vào POS
- ✅ **Bundle size nhỏ**: Tối ưu cho performance

## Tính năng chính

### 🖥️ POS Kiosk System
- **Tạo đơn hàng nhanh**: Giao diện touch-friendly với grid sản phẩm lớn
- **Thanh toán đa phương thức**: Tiền mặt, KBZ Pay, Wave Money
- **In hóa đơn tự động**: Tích hợp với máy in POS
- **Mở ngăn kéo tiền**: Tự động mở khi thanh toán tiền mặt
- **Quản lý bán hàng**: Dashboard với thống kê real-time
- **Hỗ trợ offline**: Hoạt động khi mất mạng, đồng bộ khi có kết nối

## Cấu trúc dự án

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx          # Layout cho web app
│   │   └── KioskLayout.tsx        # Layout cho POS kiosk
│   └── shared/
│       ├── KioskModeToggle.tsx    # Component chuyển đổi kiosk mode
│       └── OfflineStatus.tsx      # Hiển thị trạng thái offline
├── hooks/
│   └── context/
│       └── KioskContext.tsx       # Context quản lý kiosk state
├── pages/
│   ├── LandingPage.tsx            # Trang chọn chế độ
│   ├── POSKioskApp.tsx            # App chính cho kiosk
│   ├── POSKioskPage.tsx          # Trang đặt hàng kiosk
│   ├── PaymentPage.tsx           # Trang thanh toán
│   └── AdminPage.tsx             # Trang quản trị
├── service/
│   ├── hardware.ts               # Service tích hợp phần cứng
│   └── offline.ts                # Service hỗ trợ offline
└── types/
    └── index.ts                  # Types cho POS kiosk
```

## Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 18+
- npm hoặc yarn
- Browser hỗ trợ Web APIs (Chrome, Firefox, Safari)
- **Không cần database hoặc authentication server**

### Cài đặt
```bash
# Clone repository
git clone <repository-url>
cd coffee-shop-graduation-project

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

### Truy cập ứng dụng
- **POS Kiosk**: `http://localhost:5173/` (truy cập trực tiếp)

## Sử dụng POS Kiosk

### 1. Khởi động POS
- Truy cập `/` - Trang POS sẽ load ngay lập tức
- Nhấn nút "Kiosk Mode" để vào fullscreen

### 2. Tạo đơn hàng
- Chọn danh mục sản phẩm
- Nhấn vào sản phẩm để thêm vào giỏ hàng
- Điều chỉnh số lượng trong sidebar
- Nhấn "Thanh toán" để chuyển sang bước tiếp theo

### 3. Thanh toán
- Chọn phương thức thanh toán
- Nhập số tiền khách đưa (nếu thanh toán tiền mặt)
- Nhấn "Xác nhận thanh toán"
- Hệ thống sẽ tự động:
  - In hóa đơn
  - Mở ngăn kéo tiền (nếu cần)
  - Lưu đơn hàng
  - Chuyển về trang đặt hàng

### 4. Quản trị
- Chuyển sang tab "Quản trị" để xem:
  - Thống kê doanh thu
  - Trạng thái thiết bị
  - Lịch sử đơn hàng
  - Cài đặt hệ thống

## Tích hợp phần cứng

### Máy in POS
```typescript
// Sử dụng ESC/POS commands
const receipt = generateReceipt(order);
await hardwareService.printReceipt(receipt);
```

### Ngăn kéo tiền
```typescript
// Mở ngăn kéo tiền
await hardwareService.openCashDrawer();
```

### Scanner mã vạch
```typescript
// Lắng nghe input từ scanner
hardwareService.on('scanner', (data) => {
  console.log('Scanned:', data.code);
});
```

## Hỗ trợ Offline

Hệ thống tự động:
- Lưu đơn hàng vào IndexedDB khi offline
- Đồng bộ dữ liệu khi có kết nối internet
- Hiển thị trạng thái sync trong UI
- Cho phép tiếp tục bán hàng khi mất mạng

## Cấu hình

### Kiosk Settings
```typescript
const settings = {
  storeName: 'Highland Coffee',
  storeAddress: '123 Main Street, Yangon',
  taxRate: 0.05, // 5%
  currency: 'MMK',
  autoLogoutMinutes: 30,
  printerSettings: {
    enabled: true,
    printerName: 'POS Printer',
    paperSize: '80mm'
  }
};
```

### Hardware Configuration
```typescript
const devices = [
  { type: 'printer', name: 'POS Printer', status: 'connected' },
  { type: 'cash_drawer', name: 'Cash Drawer', status: 'connected' },
  { type: 'scanner', name: 'Barcode Scanner', status: 'connected' }
];
```

## API Endpoints

### Orders
- `POST /api/orders` - Tạo đơn hàng mới
- `GET /api/orders` - Lấy danh sách đơn hàng
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm

### Analytics
- `GET /api/analytics/sales` - Thống kê doanh thu
- `GET /api/analytics/products` - Thống kê sản phẩm

## Deployment

### Production Build
```bash
npm run build
```

### Docker Deployment
```bash
# Build Docker image
docker build -t pos-kiosk .

# Run container
docker run -p 3000:3000 pos-kiosk
```

### Kiosk Browser Setup
Để chạy như một kiosk thật sự:
1. Cài đặt Chrome/Edge
2. Khởi động với flags: `--kiosk --disable-infobars --disable-session-crashed-bubble`
3. Tự động mở URL: `http://localhost:3000/kiosk`

## Troubleshooting

### Lỗi thường gặp

1. **Printer không hoạt động**
   - Kiểm tra kết nối USB
   - Cài đặt driver máy in
   - Test printer trong Admin panel

2. **Cash drawer không mở**
   - Kiểm tra kết nối với máy in
   - Cài đặt ESC/POS driver
   - Test cash drawer trong Admin panel

3. **Scanner không đọc được**
   - Kiểm tra kết nối USB
   - Cài đặt driver scanner
   - Test scanner trong Admin panel

4. **Offline sync không hoạt động**
   - Kiểm tra kết nối internet
   - Xem logs trong browser console
   - Clear IndexedDB và thử lại

## Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## License

MIT License - xem file LICENSE để biết thêm chi tiết.

## Support

Liên hệ team phát triển để được hỗ trợ:
- Email: dev@highlandcoffee.com
- Phone: +95 1 234 5678
