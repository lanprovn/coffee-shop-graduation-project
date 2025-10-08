@echo off
echo.
echo 🔍 Coffee Shop Microservices Health Check
echo ==========================================
echo.

REM Check if Docker is running
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running or not installed
    echo Please start Docker Desktop and try again
    pause
    exit /b 1
)

echo ✅ Docker is running

REM Check if docker-compose is available
docker compose version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not available
    pause
    exit /b 1
)

echo ✅ Docker Compose is available

REM Check if containers are running
echo.
echo 📊 Checking container status...
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

echo.
echo 🌐 Testing service endpoints...

REM Function to test endpoint
set "services=api-gateway:8080 user-service:8081 product-service:8082 order-service:8083 payment-service:8084 loyalty-service:8085 notification-service:8086 analytics-service:8087 store-service:8088 eureka-server:8761"

for %%s in (%services%) do (
    for /f "tokens=1,2 delims=:" %%a in ("%%s") do (
        echo Testing %%a on port %%b...
        curl -s -o nul -w "%%{http_code}" http://localhost:%%b/actuator/health 2>nul | findstr /r "200" >nul
        if !errorlevel! equ 0 (
            echo ✅ %%a: http://localhost:%%b - OK
        ) else (
            echo ❌ %%a: http://localhost:%%b - FAILED
        )
    )
)

echo.
echo 🎯 Testing API Gateway routing...

REM Test API Gateway routing
curl -s -o nul -w "%%{http_code}" http://localhost:8080/api/products 2>nul | findstr /r "200" >nul
if %errorlevel% equ 0 (
    echo ✅ API Gateway routing - OK
) else (
    echo ❌ API Gateway routing - FAILED
)

echo.
echo 🎉 Health check completed!
echo.
echo 📋 Quick Access:
echo - API Gateway: http://localhost:8080
echo - Eureka Dashboard: http://localhost:8761
echo - Service Health: http://localhost:8080/actuator/health
echo.
pause
