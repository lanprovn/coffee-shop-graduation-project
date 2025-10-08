@echo off
echo Starting Coffee Shop Microservices (Manual Mode)...

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo Java is not installed or not in PATH. Please install Java 17 first.
    pause
    exit /b 1
)

REM Check if Maven is installed
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo Maven is not installed or not in PATH. Please install Maven first.
    pause
    exit /b 1
)

echo Java and Maven are available. Starting services...

REM Build shared config first
echo Building shared configuration...
cd shared-config
call mvn clean install -DskipTests -q
if %errorlevel% neq 0 (
    echo Failed to build shared config
    pause
    exit /b 1
)
cd ..

echo Starting services in background...

REM Start User Service
echo Starting User Service...
start "User Service" cmd /k "cd user-service && mvn spring-boot:run"

REM Wait a bit
timeout /t 10 /nobreak >nul

REM Start Product Service  
echo Starting Product Service...
start "Product Service" cmd /k "cd product-service && mvn spring-boot:run"

REM Wait a bit
timeout /t 10 /nobreak >nul

REM Start Order Service
echo Starting Order Service...
start "Order Service" cmd /k "cd order-service && mvn spring-boot:run"

REM Wait a bit
timeout /t 10 /nobreak >nul

REM Start Payment Service
echo Starting Payment Service...
start "Payment Service" cmd /k "cd payment-service && mvn spring-boot:run"

REM Wait a bit
timeout /t 10 /nobreak >nul

REM Start Loyalty Service
echo Starting Loyalty Service...
start "Loyalty Service" cmd /k "cd loyalty-service && mvn spring-boot:run"

REM Wait a bit
timeout /t 10 /nobreak >nul

REM Start Notification Service
echo Starting Notification Service...
start "Notification Service" cmd /k "cd notification-service && mvn spring-boot:run"

REM Wait a bit
timeout /t 10 /nobreak >nul

REM Start Analytics Service
echo Starting Analytics Service...
start "Analytics Service" cmd /k "cd analytics-service && mvn spring-boot:run"

REM Wait a bit
timeout /t 10 /nobreak >nul

REM Start Store Service
echo Starting Store Service...
start "Store Service" cmd /k "cd store-service && mvn spring-boot:run"

REM Wait a bit
timeout /t 10 /nobreak >nul

REM Start API Gateway
echo Starting API Gateway...
start "API Gateway" cmd /k "cd api-gateway && mvn spring-boot:run"

echo.
echo ========================================
echo All services are starting...
echo ========================================
echo.
echo Services will be available at:
echo - API Gateway: http://localhost:8080
echo - User Service: http://localhost:8081
echo - Product Service: http://localhost:8082
echo - Order Service: http://localhost:8083
echo - Payment Service: http://localhost:8084
echo - Loyalty Service: http://localhost:8085
echo - Notification Service: http://localhost:8086
echo - Analytics Service: http://localhost:8087
echo - Store Service: http://localhost:8088
echo.
echo Note: You need PostgreSQL and Redis running locally
echo or modify application.yml to use H2 database for testing
echo.
echo Press any key to continue...
pause >nul
