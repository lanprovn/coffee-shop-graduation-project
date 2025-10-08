@echo off
echo Starting Coffee Shop Microservices...

REM Build shared config first
echo Building shared configuration...
cd shared-config
mvn clean install -DskipTests
cd ..

REM Build all services
echo Building all microservices...
for %%s in (eureka-server api-gateway user-service product-service order-service payment-service loyalty-service notification-service analytics-service store-service) do (
    echo Building %%s...
    cd %%s
    mvn clean package -DskipTests
    cd ..
)

echo All services built successfully!
echo You can now run: docker-compose up -d
pause
