@echo off
REM Coffee Shop Production Deployment Script for Windows
REM This script deploys the Coffee Shop microservices in production mode

setlocal enabledelayedexpansion

echo 🚀 Starting Coffee Shop Production Deployment...

REM Check if Docker is running
echo [INFO] Checking Docker...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running. Please start Docker and try again.
    pause
    exit /b 1
)
echo [SUCCESS] Docker is running

REM Check if .env file exists
echo [INFO] Checking environment configuration...
if not exist ".env" (
    echo [WARNING] .env file not found. Creating from template...
    if exist "env.prod.example" (
        copy env.prod.example .env >nul
        echo [WARNING] Please edit .env file with your production values before continuing.
        echo [WARNING] Especially update database passwords and email credentials.
        pause
    ) else (
        echo [ERROR] env.prod.example template not found. Please create .env file manually.
        pause
        exit /b 1
    )
)
echo [SUCCESS] Environment configuration found

REM Create necessary directories
echo [INFO] Creating necessary directories...
if not exist "monitoring\grafana\dashboards" mkdir monitoring\grafana\dashboards
if not exist "monitoring\grafana\datasources" mkdir monitoring\grafana\datasources
if not exist "scripts" mkdir scripts
echo [SUCCESS] Directories created

REM Create Prometheus configuration
echo [INFO] Creating Prometheus configuration...
(
echo global:
echo   scrape_interval: 15s
echo   evaluation_interval: 15s
echo.
echo rule_files:
echo   # - "first_rules.yml"
echo   # - "second_rules.yml"
echo.
echo scrape_configs:
echo   - job_name: 'prometheus'
echo     static_configs:
echo       - targets: ['localhost:9090']
echo.
echo   - job_name: 'eureka-server'
echo     static_configs:
echo       - targets: ['eureka-server:8761']
echo     metrics_path: '/api/v1/actuator/prometheus'
echo.
echo   - job_name: 'api-gateway'
echo     static_configs:
echo       - targets: ['api-gateway:8080']
echo     metrics_path: '/api/v1/actuator/prometheus'
echo.
echo   - job_name: 'user-service'
echo     static_configs:
echo       - targets: ['user-service:8081']
echo     metrics_path: '/api/v1/actuator/prometheus'
echo.
echo   - job_name: 'product-service'
echo     static_configs:
echo       - targets: ['product-service:8082']
echo     metrics_path: '/api/v1/actuator/prometheus'
echo.
echo   - job_name: 'order-service'
echo     static_configs:
echo       - targets: ['order-service:8083']
echo     metrics_path: '/api/v1/actuator/prometheus'
echo.
echo   - job_name: 'payment-service'
echo     static_configs:
echo       - targets: ['payment-service:8084']
echo     metrics_path: '/api/v1/actuator/prometheus'
echo.
echo   - job_name: 'loyalty-service'
echo     static_configs:
echo       - targets: ['loyalty-service:8085']
echo     metrics_path: '/api/v1/actuator/prometheus'
echo.
echo   - job_name: 'notification-service'
echo     static_configs:
echo       - targets: ['notification-service:8086']
echo     metrics_path: '/api/v1/actuator/prometheus'
echo.
echo   - job_name: 'analytics-service'
echo     static_configs:
echo       - targets: ['analytics-service:8087']
echo     metrics_path: '/api/v1/actuator/prometheus'
echo.
echo   - job_name: 'store-service'
echo     static_configs:
echo       - targets: ['store-service:8088']
echo     metrics_path: '/api/v1/actuator/prometheus'
) > monitoring\prometheus.yml
echo [SUCCESS] Prometheus configuration created

REM Create Grafana datasource configuration
echo [INFO] Creating Grafana datasource configuration...
(
echo apiVersion: 1
echo.
echo datasources:
echo   - name: Prometheus
echo     type: prometheus
echo     access: proxy
echo     url: http://prometheus:9090
echo     isDefault: true
echo     editable: true
) > monitoring\grafana\datasources\prometheus.yml
echo [SUCCESS] Grafana datasource configuration created

REM Build all services
echo [INFO] Building all microservices...

REM Build shared-config first
echo [INFO] Building shared-config...
cd shared-config
call mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build shared-config
    pause
    exit /b 1
)
cd ..

REM Build all services
set services=eureka-server api-gateway user-service product-service order-service payment-service loyalty-service notification-service analytics-service store-service
for %%s in (%services%) do (
    echo [INFO] Building %%s...
    cd %%s
    call mvn clean package -DskipTests
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to build %%s
        pause
        exit /b 1
    )
    cd ..
)

echo [SUCCESS] All services built successfully

REM Deploy with Docker Compose
echo [INFO] Deploying services with Docker Compose...

REM Stop existing containers
echo [INFO] Stopping existing containers...
docker-compose -f docker-compose.prod.yml down --remove-orphans

REM Build and start services
echo [INFO] Building and starting services...
docker-compose -f docker-compose.prod.yml up -d --build

if %errorlevel% neq 0 (
    echo [ERROR] Failed to deploy services
    pause
    exit /b 1
)

echo [SUCCESS] Services deployed successfully

REM Wait for services to be healthy
echo [INFO] Waiting for services to be healthy...

REM Wait for Eureka
echo [INFO] Waiting for Eureka Server...
set timeout=60
:wait_eureka
curl -f http://localhost:8761/api/v1/actuator/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] Eureka Server is healthy
    goto wait_gateway
)
timeout /t 5 /nobreak >nul
set /a timeout-=1
if %timeout% gtr 0 goto wait_eureka
echo [ERROR] Eureka Server failed to start within timeout
pause
exit /b 1

:wait_gateway
REM Wait for API Gateway
echo [INFO] Waiting for API Gateway...
set timeout=60
:wait_gateway_loop
curl -f http://localhost:8080/api/v1/actuator/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] API Gateway is healthy
    goto show_status
)
timeout /t 5 /nobreak >nul
set /a timeout-=1
if %timeout% gtr 0 goto wait_gateway_loop
echo [ERROR] API Gateway failed to start within timeout
pause
exit /b 1

:show_status
REM Show deployment status
echo [INFO] Deployment Status:
echo.
echo 🌐 Services:
echo   - Eureka Server: http://localhost:8761
echo   - API Gateway: http://localhost:8080
echo   - User Service: http://localhost:8081
echo   - Product Service: http://localhost:8082
echo   - Order Service: http://localhost:8083
echo   - Payment Service: http://localhost:8084
echo   - Loyalty Service: http://localhost:8085
echo   - Notification Service: http://localhost:8086
echo   - Analytics Service: http://localhost:8087
echo   - Store Service: http://localhost:8088
echo.
echo 📊 Monitoring:
echo   - Prometheus: http://localhost:9090
echo   - Grafana: http://localhost:3000 (admin/admin123)
echo.
echo 🗄️ Databases:
echo   - PostgreSQL Users: localhost:5432
echo   - PostgreSQL Products: localhost:5433
echo   - PostgreSQL Orders: localhost:5434
echo   - PostgreSQL Payments: localhost:5435
echo   - PostgreSQL Loyalty: localhost:5436
echo   - PostgreSQL Notifications: localhost:5437
echo   - PostgreSQL Analytics: localhost:5438
echo   - PostgreSQL Stores: localhost:5439
echo   - Redis: localhost:6379
echo.
echo [SUCCESS] Coffee Shop is now running in production mode! 🎉
echo.
echo Press any key to exit...
pause >nul
