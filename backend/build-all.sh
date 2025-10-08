#!/bin/bash

echo "Starting Coffee Shop Microservices..."

# Build shared config first
echo "Building shared configuration..."
cd shared-config
mvn clean install -DskipTests
cd ..

# Build all services
echo "Building all microservices..."
for service in eureka-server api-gateway user-service product-service order-service payment-service loyalty-service notification-service analytics-service store-service; do
    echo "Building $service..."
    cd $service
    mvn clean package -DskipTests
    cd ..
done

echo "All services built successfully!"
echo "You can now run: docker-compose up -d"
