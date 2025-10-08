# Coffee Shop Backend - Microservices Architecture

## Overview
This is a comprehensive backend system for a coffee shop built with Java Spring Boot microservices architecture.

## Architecture

### Microservices
1. **API Gateway** (Port 8080) - Entry point for all client requests
2. **User Service** (Port 8081) - User management, authentication, authorization
3. **Product Service** (Port 8082) - Product and category management
4. **Order Service** (Port 8083) - Order processing, cart management
5. **Payment Service** (Port 8084) - Payment processing (KBZ Pay, Wave Money, Cash)
6. **Loyalty Service** (Port 8085) - Membership, points, vouchers
7. **Notification Service** (Port 8086) - Email, SMS notifications
8. **Analytics Service** (Port 8087) - Data analytics and reporting
9. **Store Service** (Port 8088) - Store management, delivery

### Technology Stack
- **Framework**: Spring Boot 3.2.0
- **Cloud**: Spring Cloud 2023.0.0
- **Database**: PostgreSQL (Database per Service)
- **Cache**: Redis
- **Message Queue**: RabbitMQ
- **Service Discovery**: Eureka
- **API Gateway**: Spring Cloud Gateway
- **Security**: Spring Security + JWT
- **Circuit Breaker**: Resilience4j
- **Tracing**: Zipkin
- **Rate Limiting**: Bucket4j
- **Build Tool**: Maven
- **Containerization**: Docker

## Prerequisites
- Java 17
- Maven 3.6+
- Docker & Docker Compose
- PostgreSQL
- Redis

## Quick Start

### 1. Using Docker Compose (Recommended)
```bash
cd backend
docker-compose up -d
```

### 2. Manual Setup
1. Start PostgreSQL and Redis
2. Create databases:
   - coffeeshop_users
   - coffeeshop_products
   - coffeeshop_orders
   - coffeeshop_payments
   - coffeeshop_loyalty
   - coffeeshop_notifications
   - coffeeshop_analytics
   - coffeeshop_stores
3. Build and run each service:
```bash
# Build all services at once
./build-all.sh  # Linux/Mac
# or
build-all.bat   # Windows

# Or build individually:
cd shared-config && mvn clean install
cd ../api-gateway && mvn spring-boot:run
cd ../user-service && mvn spring-boot:run
cd ../product-service && mvn spring-boot:run
cd ../order-service && mvn spring-boot:run
cd ../payment-service && mvn spring-boot:run
cd ../loyalty-service && mvn spring-boot:run
cd ../notification-service && mvn spring-boot:run
cd ../analytics-service && mvn spring-boot:run
cd ../store-service && mvn spring-boot:run
```

## API Endpoints

### API Gateway (http://localhost:8080)
All requests go through the API Gateway which routes to appropriate services:

- `/api/users/**` → User Service
- `/api/products/**` → Product Service
- `/api/orders/**` → Order Service
- `/api/payments/**` → Payment Service
- `/api/loyalty/**` → Loyalty Service
- `/api/notifications/**` → Notification Service
- `/api/analytics/**` → Analytics Service
- `/api/stores/**` → Store Service

### User Service Examples
```bash
# Register user
POST http://localhost:8080/api/users/register
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}

# Login
POST http://localhost:8080/api/users/login
{
  "username": "john_doe",
  "password": "password123"
}

# Get user by ID
GET http://localhost:8080/api/users/1
```

### Product Service Examples
```bash
# Get all products
GET http://localhost:8080/api/products

# Get products by category
GET http://localhost:8080/api/products/category/1

# Search products
GET http://localhost:8080/api/products/search?keyword=coffee

# Get featured products
GET http://localhost:8080/api/products/featured
```

### Order Service Examples
```bash
# Get user cart
GET http://localhost:8080/api/orders/cart?userId=1

# Add to cart
POST http://localhost:8080/api/orders/cart/add?userId=1
{
  "productId": 1,
  "quantity": 2,
  "specialInstructions": "Extra hot"
}

# Create order
POST http://localhost:8080/api/orders?userId=1
{
  "type": "DELIVERY",
  "deliveryAddress": "123 Main St, Yangon",
  "deliveryPhone": "+95-1-234-5678",
  "notes": "Please call when arrived"
}
```

### Payment Service Examples
```bash
# Create payment
POST http://localhost:8080/api/payments
{
  "orderId": 1,
  "userId": 1,
  "method": "KBZ_PAY",
  "amount": 15000.00
}

# Process payment
POST http://localhost:8080/api/payments/{paymentId}/process

# Get payment status
GET http://localhost:8080/api/payments/payment-id/{paymentId}
```

### Loyalty Service Examples
```bash
# Create membership
POST http://localhost:8080/api/loyalty/membership?userId=1

# Earn points
POST http://localhost:8080/api/loyalty/points/earn
{
  "userId": 1,
  "orderId": 1,
  "amount": 15000.00,
  "description": "Points from order #1"
}

# Use voucher
POST http://localhost:8080/api/loyalty/vouchers/SAVE10/use?userId=1&orderId=1
```

### Store Service Examples
```bash
# Get all stores
GET http://localhost:8080/api/stores

# Get store details
GET http://localhost:8080/api/stores/1

# Calculate delivery fee
GET http://localhost:8080/api/stores/1/delivery-fee?deliveryAddress=123 Main St, Yangon
```

## Database Schema

### Users Table
- id, username, email, password
- firstName, lastName, phoneNumber
- dateOfBirth, gender, role
- isActive, emailVerified, phoneVerified
- createdAt, updatedAt

### Products Table
- id, name, description, price
- imageUrl, type, size
- isAvailable, isFeatured
- stockQuantity, minStockLevel
- categoryId, createdAt, updatedAt

### Categories Table
- id, name, description
- imageUrl, isActive
- createdAt, updatedAt

## Configuration

### Environment Variables
- `SPRING_PROFILES_ACTIVE`: Set to `docker` for containerized deployment
- `EUREKA_SERVER_URL`: Eureka server URL (default: http://localhost:8761/eureka/)
- `DATABASE_URL`: PostgreSQL connection URL
- `REDIS_URL`: Redis connection URL
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRATION`: JWT token expiration time

## Monitoring & Observability
- **Eureka Dashboard**: http://localhost:8761
- **RabbitMQ Management**: http://localhost:15672 (admin/admin123)
- **Zipkin Tracing**: http://localhost:9411
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/admin123)
- **Actuator endpoints**: `/actuator/health`, `/actuator/info`, `/actuator/metrics`

## Development

### Adding New Services
1. Create new service directory
2. Add pom.xml with shared-config as parent
3. Implement service classes (Controller, Service, Repository, Entity)
4. Add to docker-compose.yml
5. Update API Gateway routing

### Database Migrations
Services use JPA with `ddl-auto: update` for development. For production, use Flyway or Liquibase.

## Security
- JWT-based authentication
- Password encryption with BCrypt
- CORS enabled for frontend integration
- Input validation with Bean Validation

## Performance & Resilience
- **Redis caching** for frequently accessed data
- **Connection pooling** for database connections
- **Pagination** for list endpoints
- **Circuit breaker pattern** for service communication
- **Rate limiting** at API Gateway level
- **Event-driven architecture** with RabbitMQ
- **Distributed tracing** with Zipkin
- **Health checks** and monitoring

## Testing Deployment
After starting the services, run the health check script:

```bash
# Linux/Mac
./test-deployment.sh

# Windows
test-deployment.bat
```

## Future Enhancements
- **Centralized logging** with ELK stack
- **API versioning** strategy
- **OAuth2 integration** for enhanced security
- **Multi-tenancy support**
- **Kubernetes deployment** manifests
- **Service mesh** with Istio
- **Advanced monitoring** with custom dashboards
