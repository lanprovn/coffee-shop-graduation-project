# ☕ Highlands Coffee Shop - Frontend Project

## 📋 Tổng quan dự án

Dự án **Highlands Coffee Shop** là một ứng dụng web frontend hoàn chỉnh được xây dựng bằng React + TypeScript, mô phỏng hệ thống quản lý quán cà phê hiện đại. Dự án này đáp ứng đầy đủ các tiêu chí của đồ án tốt nghiệp với giao diện đẹp, tính năng phong phú và code chất lượng cao.

## 🚀 Tính năng chính

### 🏠 Trang chủ (HomePage)
- **Banner Slider**: Carousel tự động với navigation và dots indicator
- **Hero Section**: Phần giới thiệu nổi bật với CTA buttons
- **User Address Card**: Quản lý địa chỉ giao hàng
- **Search Box**: Tìm kiếm sản phẩm nhanh
- **Product Lists**: Danh sách sản phẩm phổ biến (Hot drinks, Cold drinks, etc.)

### 🛍️ Hệ thống sản phẩm
- **Product List Page**: Danh sách sản phẩm với filter và sort nâng cao
- **Product Detail Page**: Chi tiết sản phẩm với reviews và ratings
- **Product Filter**: Lọc theo category, type, price range
- **Product Sort**: Sắp xếp theo giá, tên, popularity
- **Product Reviews**: Hệ thống đánh giá và bình luận

### 🛒 Giỏ hàng & Thanh toán
- **Shopping Cart**: Quản lý giỏ hàng với UX được tối ưu
- **Checkout Process**: Quy trình thanh toán hoàn chỉnh
- **Delivery Options**: Chọn giao hàng hoặc tự lấy
- **Payment Methods**: Tiền mặt và thẻ tín dụng
- **Voucher System**: Áp dụng mã giảm giá

### 👤 Hệ thống thành viên
- **Membership Levels**: Silver, Gold, Diamond với quyền lợi khác nhau
- **Points System**: Tích điểm và đổi thưởng
- **User Profile**: Quản lý thông tin cá nhân
- **Address Management**: Quản lý địa chỉ giao hàng

### 📰 Tin tức & Khuyến mãi
- **News Page**: Trang tin tức với banner slider
- **Article Categories**: Phân loại tin tức, khuyến mãi, sự kiện
- **Article Detail**: Chi tiết bài viết với modal

### 🏪 Hệ thống cửa hàng
- **Stores Page**: Danh sách chi nhánh với Google Maps
- **Store Details**: Thông tin chi tiết từng cửa hàng
- **Interactive Map**: Bản đồ tương tác với Google Maps API

### 🔔 Hệ thống thông báo
- **Real-time Notifications**: Thông báo real-time với WebSocket simulation
- **Notification Center**: Trung tâm quản lý thông báo
- **Browser Notifications**: Thông báo trình duyệt
- **Notification Types**: Success, error, warning, info

### 👨‍💼 Trang Admin
- **Admin Dashboard**: Tổng quan hệ thống với biểu đồ
- **Stock Management**: Quản lý tồn kho sản phẩm
- **Voucher Management**: Quản lý mã giảm giá
- **Membership Management**: Quản lý thành viên
- **Revenue Dashboard**: Thống kê doanh thu với charts

## 🛠️ Công nghệ sử dụng

### Frontend Core
- **React 18**: UI framework với hooks và functional components
- **TypeScript**: Type safety và better developer experience
- **Vite**: Build tool nhanh và hiệu quả
- **React Router**: Client-side routing

### UI/UX
- **Tailwind CSS**: Utility-first CSS framework
- **Headless UI**: Accessible UI components
- **Heroicons**: Icon library
- **Responsive Design**: Mobile-first approach

### State Management
- **React Context API**: Global state management
- **Custom Hooks**: Reusable logic
- **Local Storage**: Data persistence

### Performance & Optimization
- **Lazy Loading**: Code splitting với React.lazy()
- **Image Optimization**: OptimizedImage component
- **Performance Hooks**: Custom performance optimization hooks
- **Error Boundaries**: Error handling và recovery

## 📁 Cấu trúc thư mục

```
src/
├── components/           # Reusable components
│   ├── layout/          # Layout components (Navbar, Footer, etc.)
│   └── shared/          # Shared components (Buttons, Cards, etc.)
├── hooks/               # Custom hooks
│   ├── context/        # Context providers
│   ├── provider/        # Context providers implementation
│   └── use*.ts         # Custom hooks
├── pages/              # Page components
│   ├── admin/          # Admin pages
│   ├── HomePage/       # Homepage components
│   └── *.tsx          # Other pages
├── data/               # Mock data
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── constants/          # App constants
```

## 🎨 Design System

### Colors
- **Primary**: Coffee brown (#8B4513)
- **Secondary**: Cream (#F5F5DC)
- **Accent**: Gold (#FFD700)
- **Success**: Green (#10B981)
- **Error**: Red (#EF4444)
- **Warning**: Yellow (#F59E0B)

### Typography
- **Headings**: Inter font family
- **Body**: System font stack
- **Responsive**: Fluid typography scales

### Components
- **Buttons**: Filled, Outline, Ghost variants
- **Cards**: Product cards, Info cards, Stats cards
- **Forms**: Input fields, Selects, Checkboxes
- **Modals**: Dialog, Confirmation, Info modals
- **Charts**: Line, Bar, Pie charts (SVG-based)

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 16+ 
- npm hoặc yarn
- Modern browser với ES6+ support

### Cài đặt
```bash
# Clone repository
git clone <repository-url>
cd coffee-shop

# Install dependencies
npm install
# hoặc
yarn install

# Start development server
npm run dev
# hoặc
yarn dev

# Build for production
npm run build
# hoặc
yarn build
```

### Environment Variables
```env
# Google Maps API (optional)
VITE_GOOGLE_MAPS_API_KEY=your_api_key

# API Configuration (for future backend integration)
VITE_API_URL=http://localhost:8080
```

## 📱 Responsive Design

Dự án được thiết kế responsive với breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

### Mobile Optimizations
- Touch-friendly interface
- Optimized navigation
- Compressed images
- Reduced bundle size

## 🔧 API Integration Ready

Dự án đã được chuẩn bị sẵn sàng để tích hợp với backend Spring Boot:

### API Endpoints (Planned)
```
Authentication:
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/refresh

Products:
- GET /api/products
- GET /api/products/{id}
- GET /api/products/category/{category}

Orders:
- POST /api/orders
- GET /api/orders
- GET /api/orders/{id}
- PUT /api/orders/{id}/status

Vouchers:
- GET /api/vouchers
- POST /api/vouchers/validate

Reviews:
- GET /api/reviews/product/{productId}
- POST /api/reviews

Admin:
- GET /api/admin/stats
- GET /api/admin/members
- PUT /api/admin/products/{id}/stock
```

### Mock Data
- Tất cả dữ liệu hiện tại là mock data
- Dễ dàng thay thế bằng real API calls
- Comment chi tiết cho từng API endpoint

## 🧪 Testing & Quality

### Code Quality
- **TypeScript**: 100% type coverage
- **ESLint**: Code linting và formatting
- **Error Boundaries**: Error handling
- **Performance Monitoring**: Custom performance hooks

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📊 Performance Metrics

### Bundle Size Optimization
- **Code Splitting**: Lazy loading cho pages
- **Tree Shaking**: Loại bỏ unused code
- **Image Optimization**: Lazy loading và compression
- **Bundle Analysis**: Monitoring bundle size

### Core Web Vitals
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

## 🔮 Tính năng tương lai

### Phase 2 (Backend Integration)
- [ ] Spring Boot API integration
- [ ] Real-time notifications với WebSocket
- [ ] Payment gateway integration
- [ ] Email notifications

### Phase 3 (Advanced Features)
- [ ] PWA support
- [ ] Offline functionality
- [ ] Push notifications
- [ ] Advanced analytics

### Phase 4 (Mobile App)
- [ ] React Native mobile app
- [ ] Cross-platform compatibility
- [ ] Native features integration

## 👥 Team & Credits

- **Frontend Developer**: [Your Name]
- **UI/UX Design**: Custom design system
- **Icons**: Heroicons
- **Images**: Unsplash, Custom assets

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📞 Support

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue trên GitHub hoặc liên hệ qua email.

---

**🎉 Chúc mừng! Dự án Coffee Shop Frontend đã hoàn thành và sẵn sàng cho demo đồ án tốt nghiệp!**
