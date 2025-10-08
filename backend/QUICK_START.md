# Coffee Shop Microservices - Quick Start Guide

## 🚀 After Docker Installation

Once Docker Desktop is installed and running, you can start the entire system with:

```bash
cd backend
docker compose up -d
```

## 📊 Monitor Services

### Check Service Status
```bash
docker compose ps
```

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f user-service
docker compose logs -f product-service
docker compose logs -f api-gateway
```

### Stop Services
```bash
docker compose down
```

## 🌐 Access Points

- **API Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761
- **Individual Services**: http://localhost:8081-8088

## 🧪 Quick API Tests

### 1. Register User
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com", 
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

### 3. Get Products
```bash
curl http://localhost:8080/api/products
```

### 4. Get Stores
```bash
curl http://localhost:8080/api/stores
```

### 5. Create Loyalty Membership
```bash
curl -X POST "http://localhost:8080/api/loyalty/membership?userId=1"
```

## 🔧 Troubleshooting

### If services fail to start:
1. Check Docker Desktop is running
2. Check ports are not in use: `netstat -an | findstr :8080`
3. Check logs: `docker compose logs [service-name]`

### If database connection fails:
- Services use separate PostgreSQL databases
- Each service has its own database (coffeeshop_users, coffeeshop_products, etc.)

## 📈 Next Steps

1. **Test all endpoints** using the API tests above
2. **Explore Eureka Dashboard** at http://localhost:8761
3. **Check service health** at http://localhost:8080/actuator/health
4. **Integrate with frontend** React app

## 🎯 Production Considerations

- Replace mock data with real implementations
- Add proper security configurations
- Set up monitoring and logging
- Configure proper database connections
- Add API rate limiting
- Set up CI/CD pipeline
