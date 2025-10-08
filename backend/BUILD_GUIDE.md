# Coffee Shop Backend - Chuẩn hóa cấu trúc

## Cấu trúc đã được sửa

Backend đã được chuẩn hóa theo cấu trúc Maven multi-module chuẩn để đảm bảo build không bị lỗi.

### Thay đổi chính:

1. **Parent POM chuẩn**: `backend/pom.xml` là parent POM chính chứa tất cả modules
2. **Modules đầy đủ**: Tất cả 11 services đều được khai báo trong parent POM
3. **Dependency management**: Shared dependencies được quản lý tập trung
4. **Dockerfile chuẩn**: Tất cả Dockerfile sử dụng cấu trúc multi-module Maven

### Cấu trúc modules:

```
backend/
├── pom.xml (parent POM)
├── shared-config/ (shared utilities)
├── eureka-server/ (service discovery)
├── api-gateway/ (API gateway)
├── user-service/ (user management)
├── product-service/ (product management)
├── order-service/ (order management)
├── payment-service/ (payment processing)
├── loyalty-service/ (loyalty program)
├── notification-service/ (notifications)
├── analytics-service/ (analytics)
└── store-service/ (store management)
```

### Cách build:

#### Build tất cả services:
```bash
# Windows
./build-all.bat

# Linux/Mac
./build-all.sh
```

#### Test build:
```bash
# Windows
./test-build.bat
```

#### Build với Docker:
```bash
docker-compose up -d
```

### Lợi ích của cấu trúc mới:

1. **Build ổn định**: Không còn lỗi dependency resolution
2. **Quản lý tập trung**: Tất cả dependencies được quản lý ở một nơi
3. **Docker hiệu quả**: Dockerfile sử dụng multi-module build
4. **Dễ maintain**: Cấu trúc rõ ràng, dễ hiểu và sửa đổi

### Troubleshooting:

Nếu gặp lỗi build:
1. Chạy `./test-build.bat` để kiểm tra
2. Đảm bảo Java 17 đã được cài đặt
3. Kiểm tra Maven version (khuyến nghị 3.8+)
4. Clean và rebuild: `mvn clean install -DskipTests`
