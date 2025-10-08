# Coffee Shop Production Deployment Guide

## 🚀 Production-Ready Backend Setup

Backend đã được cấu hình để chạy như một trang web thực tế với đầy đủ tính năng production-ready.

## ✨ Tính năng Production

### 🔧 **Cấu hình Production**
- **Environment Variables**: Tất cả cấu hình thông qua biến môi trường
- **Profiles**: Hỗ trợ dev/staging/prod profiles
- **Health Checks**: Tự động kiểm tra sức khỏe services
- **Restart Policies**: Tự động khởi động lại khi có lỗi

### 📊 **Monitoring & Observability**
- **Prometheus**: Metrics collection và monitoring
- **Grafana**: Dashboard và visualization
- **Health Endpoints**: `/api/v1/actuator/health` cho tất cả services
- **Metrics Endpoints**: `/api/v1/actuator/prometheus` cho metrics

### 🗄️ **Database & Caching**
- **PostgreSQL**: 8 databases riêng biệt cho từng service
- **Redis**: Caching và session management
- **Connection Pooling**: Tối ưu kết nối database
- **Backup Support**: Scripts backup tự động

### 🔒 **Security & Performance**
- **CORS Configuration**: Cấu hình cross-origin requests
- **Rate Limiting**: Giới hạn số lượng requests
- **JWT Security**: Token-based authentication
- **Resource Limits**: Giới hạn memory và CPU

## 🛠️ **Cách Deploy Production**

### 1. **Chuẩn bị Environment**
```bash
# Copy file cấu hình
cp env.prod.example .env

# Chỉnh sửa các giá trị production
# - Database passwords
# - Email credentials
# - CORS origins
# - Rate limits
```

### 2. **Deploy với Script**
```bash
# Windows
./deploy-prod.bat

# Linux/Mac
./deploy-prod.sh
```

### 3. **Quản lý Production**
```bash
# Windows - Menu quản lý
./manage-prod.bat

# Hoặc sử dụng Docker Compose trực tiếp
docker-compose -f docker-compose.prod.yml up -d
```

## 🌐 **Services & Endpoints**

### **Core Services**
- **Eureka Server**: `http://localhost:8761` - Service Discovery
- **API Gateway**: `http://localhost:8080` - Main API Entry Point
- **User Service**: `http://localhost:8081` - User Management
- **Product Service**: `http://localhost:8082` - Product Catalog
- **Order Service**: `http://localhost:8083` - Order Processing
- **Payment Service**: `http://localhost:8084` - Payment Processing
- **Loyalty Service**: `http://localhost:8085` - Loyalty Program
- **Notification Service**: `http://localhost:8086` - Notifications
- **Analytics Service**: `http://localhost:8087` - Analytics
- **Store Service**: `http://localhost:8088` - Store Management

### **Monitoring**
- **Prometheus**: `http://localhost:9090` - Metrics
- **Grafana**: `http://localhost:3000` - Dashboards (admin/admin123)

### **Databases**
- **PostgreSQL Users**: `localhost:5432`
- **PostgreSQL Products**: `localhost:5433`
- **PostgreSQL Orders**: `localhost:5434`
- **PostgreSQL Payments**: `localhost:5435`
- **PostgreSQL Loyalty**: `localhost:5436`
- **PostgreSQL Notifications**: `localhost:5437`
- **PostgreSQL Analytics**: `localhost:5438`
- **PostgreSQL Stores**: `localhost:5439`
- **Redis**: `localhost:6379`

## 📋 **API Endpoints**

### **Health Checks**
```
GET /api/v1/actuator/health - Service health status
GET /api/v1/actuator/info - Service information
GET /api/v1/actuator/metrics - Service metrics
GET /api/v1/actuator/prometheus - Prometheus metrics
```

### **Business APIs**
```
# User Management
GET /api/v1/users - List users
POST /api/v1/users - Create user
GET /api/v1/users/{id} - Get user by ID
PUT /api/v1/users/{id} - Update user
DELETE /api/v1/users/{id} - Delete user

# Product Catalog
GET /api/v1/products - List products
POST /api/v1/products - Create product
GET /api/v1/products/{id} - Get product by ID
PUT /api/v1/products/{id} - Update product
DELETE /api/v1/products/{id} - Delete product

# Order Management
GET /api/v1/orders - List orders
POST /api/v1/orders - Create order
GET /api/v1/orders/{id} - Get order by ID
PUT /api/v1/orders/{id} - Update order
DELETE /api/v1/orders/{id} - Delete order

# Payment Processing
GET /api/v1/payments - List payments
POST /api/v1/payments - Process payment
GET /api/v1/payments/{id} - Get payment by ID

# Loyalty Program
GET /api/v1/loyalty - List loyalty programs
POST /api/v1/loyalty - Create loyalty program
GET /api/v1/loyalty/{id} - Get loyalty program by ID

# Notifications
GET /api/v1/notifications - List notifications
POST /api/v1/notifications - Send notification
GET /api/v1/notifications/{id} - Get notification by ID

# Analytics
GET /api/v1/analytics - Get analytics data
POST /api/v1/analytics - Track event
GET /api/v1/analytics/reports - Get reports

# Store Management
GET /api/v1/stores - List stores
POST /api/v1/stores - Create store
GET /api/v1/stores/{id} - Get store by ID
PUT /api/v1/stores/{id} - Update store
DELETE /api/v1/stores/{id} - Delete store
```

## 🔧 **Environment Variables**

### **Database Configuration**
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_USERS_DB=coffeeshop_users
POSTGRES_PRODUCTS_DB=coffeeshop_products
# ... other databases
```

### **Service Configuration**
```env
SPRING_PROFILES_ACTIVE=prod
EUREKA_URL=http://eureka-server:8761/eureka/
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
RATE_LIMIT_RPM=1000
```

### **Monitoring Configuration**
```env
PROMETHEUS_PORT=9090
GRAFANA_PORT=3000
GRAFANA_ADMIN_PASSWORD=admin123
```

### **Email Configuration**
```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Services không start**
   ```bash
   # Kiểm tra logs
   docker-compose -f docker-compose.prod.yml logs [service-name]
   
   # Kiểm tra health
   curl http://localhost:[port]/api/v1/actuator/health
   ```

2. **Database connection issues**
   ```bash
   # Kiểm tra database status
   docker-compose -f docker-compose.prod.yml ps postgres-*
   
   # Test connection
   docker exec postgres-users-prod pg_isready -U postgres
   ```

3. **Memory issues**
   ```bash
   # Kiểm tra resource usage
   docker stats
   
   # Restart services
   docker-compose -f docker-compose.prod.yml restart
   ```

### **Performance Optimization**

1. **Database Optimization**
   - Tăng connection pool size
   - Enable query caching
   - Optimize indexes

2. **Caching**
   - Enable Redis caching
   - Configure cache TTL
   - Use distributed caching

3. **Load Balancing**
   - Scale services horizontally
   - Use load balancer
   - Configure health checks

## 📈 **Scaling**

### **Horizontal Scaling**
```bash
# Scale specific service
docker-compose -f docker-compose.prod.yml up -d --scale user-service=3

# Scale multiple services
docker-compose -f docker-compose.prod.yml up -d --scale user-service=3 --scale product-service=2
```

### **Vertical Scaling**
```yaml
# In docker-compose.prod.yml
services:
  user-service:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
        reservations:
          memory: 512M
          cpus: '0.25'
```

## 🔄 **Backup & Recovery**

### **Database Backup**
```bash
# Backup all databases
./manage-prod.bat
# Select option 8 (Backup Databases)

# Manual backup
docker exec postgres-users-prod pg_dump -U postgres coffeeshop_users > backup.sql
```

### **Recovery**
```bash
# Restore database
docker exec -i postgres-users-prod psql -U postgres coffeeshop_users < backup.sql
```

## 🎯 **Best Practices**

1. **Security**
   - Sử dụng strong passwords
   - Enable SSL/TLS
   - Regular security updates
   - Monitor access logs

2. **Monitoring**
   - Set up alerts
   - Monitor resource usage
   - Track performance metrics
   - Regular health checks

3. **Backup**
   - Automated daily backups
   - Test restore procedures
   - Store backups securely
   - Version control configurations

4. **Updates**
   - Test updates in staging
   - Rolling updates
   - Rollback procedures
   - Monitor after updates

---

## 🎉 **Kết luận**

Backend Coffee Shop giờ đã sẵn sàng cho production với:
- ✅ **High Availability**: Health checks và auto-restart
- ✅ **Scalability**: Horizontal và vertical scaling
- ✅ **Monitoring**: Prometheus + Grafana
- ✅ **Security**: JWT, CORS, Rate limiting
- ✅ **Performance**: Connection pooling, caching
- ✅ **Reliability**: Backup, recovery, logging

**Chạy production ngay**: `./deploy-prod.bat` 🚀
