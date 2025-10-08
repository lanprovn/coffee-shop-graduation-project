# Coffee Shop Backend - Health Check Script

This script checks if all microservices are running and healthy.

## Usage

```bash
# Windows
health-check.bat

# Linux/Mac  
chmod +x health-check.sh
./health-check.sh
```

## What it checks:

1. ✅ Docker containers are running
2. ✅ Services are responding on their ports
3. ✅ API Gateway is routing requests
4. ✅ Eureka service discovery is working
5. ✅ Database connections are healthy

## Expected Output:

```
🔍 Coffee Shop Microservices Health Check
==========================================

✅ Docker containers: 9/9 running
✅ API Gateway: http://localhost:8080 - OK
✅ User Service: http://localhost:8081 - OK  
✅ Product Service: http://localhost:8082 - OK
✅ Order Service: http://localhost:8083 - OK
✅ Payment Service: http://localhost:8084 - OK
✅ Loyalty Service: http://localhost:8085 - OK
✅ Notification Service: http://localhost:8086 - OK
✅ Analytics Service: http://localhost:8087 - OK
✅ Store Service: http://localhost:8088 - OK
✅ Eureka Dashboard: http://localhost:8761 - OK

🎉 All services are healthy and ready!
```

## Troubleshooting:

If any service fails:
1. Check Docker logs: `docker compose logs [service-name]`
2. Restart specific service: `docker compose restart [service-name]`
3. Restart all services: `docker compose down && docker compose up -d`
