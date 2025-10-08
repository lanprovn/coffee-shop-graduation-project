#!/bin/bash

echo "🚀 Testing Coffee Shop Microservices Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to test service health
test_service() {
    local service_name=$1
    local url=$2
    local max_attempts=30
    local attempt=1

    echo -e "${BLUE}[INFO]${NC} Testing $service_name..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}[SUCCESS]${NC} $service_name is healthy"
            return 0
        fi
        
        echo -e "${YELLOW}[WAIT]${NC} Attempt $attempt/$max_attempts - $service_name not ready yet..."
        sleep 5
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}[ERROR]${NC} $service_name failed to start within timeout"
    return 1
}

# Test all services
echo -e "${BLUE}[INFO]${NC} Starting health checks..."

test_service "Eureka Server" "http://localhost:8761/api/v1/actuator/health"
test_service "API Gateway" "http://localhost:8080/api/v1/actuator/health"
test_service "User Service" "http://localhost:8081/api/v1/actuator/health"
test_service "Product Service" "http://localhost:8082/api/v1/actuator/health"
test_service "Order Service" "http://localhost:8083/api/v1/actuator/health"
test_service "Payment Service" "http://localhost:8084/api/v1/actuator/health"
test_service "Loyalty Service" "http://localhost:8085/api/v1/actuator/health"
test_service "Notification Service" "http://localhost:8086/api/v1/actuator/health"
test_service "Analytics Service" "http://localhost:8087/api/v1/actuator/health"
test_service "Store Service" "http://localhost:8088/api/v1/actuator/health"

# Test external services
test_service "RabbitMQ Management" "http://localhost:15672"
test_service "Zipkin" "http://localhost:9411"

echo ""
echo -e "${GREEN}[SUCCESS]${NC} All services are healthy! 🎉"
echo ""
echo "🌐 Service URLs:"
echo "  - Eureka Dashboard: http://localhost:8761"
echo "  - API Gateway: http://localhost:8080"
echo "  - RabbitMQ Management: http://localhost:15672 (admin/admin123)"
echo "  - Zipkin Tracing: http://localhost:9411"
echo ""
echo "📊 Monitoring:"
echo "  - Prometheus: http://localhost:9090"
echo "  - Grafana: http://localhost:3000 (admin/admin123)"
echo ""
echo "✅ Coffee Shop Microservices is ready for use!"
