#!/bin/bash

# Coffee Shop Production Deployment Script
# This script deploys the Coffee Shop microservices in production mode

set -e

echo "🚀 Starting Coffee Shop Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    print_status "Checking Docker..."
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Check if .env file exists
check_env_file() {
    print_status "Checking environment configuration..."
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from template..."
        if [ -f "env.prod.example" ]; then
            cp env.prod.example .env
            print_warning "Please edit .env file with your production values before continuing."
            print_warning "Especially update database passwords and email credentials."
            read -p "Press Enter to continue after updating .env file..."
        else
            print_error "env.prod.example template not found. Please create .env file manually."
            exit 1
        fi
    fi
    print_success "Environment configuration found"
}

# Build all services
build_services() {
    print_status "Building all microservices..."
    
    # Build shared-config first
    print_status "Building shared-config..."
    cd shared-config
    mvn clean install -DskipTests
    cd ..
    
    # Build all services
    services=("eureka-server" "api-gateway" "user-service" "product-service" "order-service" "payment-service" "loyalty-service" "notification-service" "analytics-service" "store-service")
    
    for service in "${services[@]}"; do
        print_status "Building $service..."
        cd "$service"
        mvn clean package -DskipTests
        cd ..
    done
    
    print_success "All services built successfully"
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    mkdir -p monitoring/grafana/dashboards
    mkdir -p monitoring/grafana/datasources
    mkdir -p scripts
    print_success "Directories created"
}

# Create Prometheus configuration
create_prometheus_config() {
    print_status "Creating Prometheus configuration..."
    cat > monitoring/prometheus.yml << EOF
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'eureka-server'
    static_configs:
      - targets: ['eureka-server:8761']
    metrics_path: '/api/v1/actuator/prometheus'

  - job_name: 'api-gateway'
    static_configs:
      - targets: ['api-gateway:8080']
    metrics_path: '/api/v1/actuator/prometheus'

  - job_name: 'user-service'
    static_configs:
      - targets: ['user-service:8081']
    metrics_path: '/api/v1/actuator/prometheus'

  - job_name: 'product-service'
    static_configs:
      - targets: ['product-service:8082']
    metrics_path: '/api/v1/actuator/prometheus'

  - job_name: 'order-service'
    static_configs:
      - targets: ['order-service:8083']
    metrics_path: '/api/v1/actuator/prometheus'

  - job_name: 'payment-service'
    static_configs:
      - targets: ['payment-service:8084']
    metrics_path: '/api/v1/actuator/prometheus'

  - job_name: 'loyalty-service'
    static_configs:
      - targets: ['loyalty-service:8085']
    metrics_path: '/api/v1/actuator/prometheus'

  - job_name: 'notification-service'
    static_configs:
      - targets: ['notification-service:8086']
    metrics_path: '/api/v1/actuator/prometheus'

  - job_name: 'analytics-service'
    static_configs:
      - targets: ['analytics-service:8087']
    metrics_path: '/api/v1/actuator/prometheus'

  - job_name: 'store-service'
    static_configs:
      - targets: ['store-service:8088']
    metrics_path: '/api/v1/actuator/prometheus'
EOF
    print_success "Prometheus configuration created"
}

# Create Grafana datasource configuration
create_grafana_datasource() {
    print_status "Creating Grafana datasource configuration..."
    cat > monitoring/grafana/datasources/prometheus.yml << EOF
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
EOF
    print_success "Grafana datasource configuration created"
}

# Deploy with Docker Compose
deploy_services() {
    print_status "Deploying services with Docker Compose..."
    
    # Stop existing containers
    print_status "Stopping existing containers..."
    docker-compose -f docker-compose.prod.yml down --remove-orphans
    
    # Build and start services
    print_status "Building and starting services..."
    docker-compose -f docker-compose.prod.yml up -d --build
    
    print_success "Services deployed successfully"
}

# Wait for services to be healthy
wait_for_services() {
    print_status "Waiting for services to be healthy..."
    
    # Wait for Eureka
    print_status "Waiting for Eureka Server..."
    timeout=300
    while [ $timeout -gt 0 ]; do
        if curl -f http://localhost:8761/api/v1/actuator/health > /dev/null 2>&1; then
            print_success "Eureka Server is healthy"
            break
        fi
        sleep 5
        timeout=$((timeout - 5))
    done
    
    if [ $timeout -le 0 ]; then
        print_error "Eureka Server failed to start within timeout"
        exit 1
    fi
    
    # Wait for API Gateway
    print_status "Waiting for API Gateway..."
    timeout=300
    while [ $timeout -gt 0 ]; do
        if curl -f http://localhost:8080/api/v1/actuator/health > /dev/null 2>&1; then
            print_success "API Gateway is healthy"
            break
        fi
        sleep 5
        timeout=$((timeout - 5))
    done
    
    if [ $timeout -le 0 ]; then
        print_error "API Gateway failed to start within timeout"
        exit 1
    fi
}

# Show deployment status
show_status() {
    print_status "Deployment Status:"
    echo ""
    echo "🌐 Services:"
    echo "  - Eureka Server: http://localhost:8761"
    echo "  - API Gateway: http://localhost:8080"
    echo "  - User Service: http://localhost:8081"
    echo "  - Product Service: http://localhost:8082"
    echo "  - Order Service: http://localhost:8083"
    echo "  - Payment Service: http://localhost:8084"
    echo "  - Loyalty Service: http://localhost:8085"
    echo "  - Notification Service: http://localhost:8086"
    echo "  - Analytics Service: http://localhost:8087"
    echo "  - Store Service: http://localhost:8088"
    echo ""
    echo "📊 Monitoring:"
    echo "  - Prometheus: http://localhost:9090"
    echo "  - Grafana: http://localhost:3000 (admin/admin123)"
    echo ""
    echo "🗄️ Databases:"
    echo "  - PostgreSQL Users: localhost:5432"
    echo "  - PostgreSQL Products: localhost:5433"
    echo "  - PostgreSQL Orders: localhost:5434"
    echo "  - PostgreSQL Payments: localhost:5435"
    echo "  - PostgreSQL Loyalty: localhost:5436"
    echo "  - PostgreSQL Notifications: localhost:5437"
    echo "  - PostgreSQL Analytics: localhost:5438"
    echo "  - PostgreSQL Stores: localhost:5439"
    echo "  - Redis: localhost:6379"
    echo ""
    print_success "Coffee Shop is now running in production mode! 🎉"
}

# Main execution
main() {
    print_status "Starting Coffee Shop Production Deployment..."
    
    check_docker
    check_env_file
    create_directories
    create_prometheus_config
    create_grafana_datasource
    build_services
    deploy_services
    wait_for_services
    show_status
}

# Run main function
main "$@"
