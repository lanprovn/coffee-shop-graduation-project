@echo off
echo 🚀 Testing Coffee Shop Microservices Deployment...

echo [INFO] Starting health checks...

REM Test Eureka Server
echo [INFO] Testing Eureka Server...
:test_eureka
curl -f -s http://localhost:8761/api/v1/actuator/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] Eureka Server is healthy
    goto test_gateway
) else (
    echo [WAIT] Eureka Server not ready yet...
    timeout /t 5 /nobreak >nul
    goto test_eureka
)

:test_gateway
echo [INFO] Testing API Gateway...
:test_gateway_loop
curl -f -s http://localhost:8080/api/v1/actuator/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] API Gateway is healthy
    goto test_services
) else (
    echo [WAIT] API Gateway not ready yet...
    timeout /t 5 /nobreak >nul
    goto test_gateway_loop
)

:test_services
echo [INFO] Testing all microservices...

curl -f -s http://localhost:8081/api/v1/actuator/health >nul 2>&1
if %errorlevel% equ 0 echo [SUCCESS] User Service is healthy
if %errorlevel% neq 0 echo [ERROR] User Service failed

curl -f -s http://localhost:8082/api/v1/actuator/health >nul 2>&1
if %errorlevel% equ 0 echo [SUCCESS] Product Service is healthy
if %errorlevel% neq 0 echo [ERROR] Product Service failed

curl -f -s http://localhost:8083/api/v1/actuator/health >nul 2>&1
if %errorlevel% equ 0 echo [SUCCESS] Order Service is healthy
if %errorlevel% neq 0 echo [ERROR] Order Service failed

curl -f -s http://localhost:8084/api/v1/actuator/health >nul 2>&1
if %errorlevel% equ 0 echo [SUCCESS] Payment Service is healthy
if %errorlevel% neq 0 echo [ERROR] Payment Service failed

curl -f -s http://localhost:8085/api/v1/actuator/health >nul 2>&1
if %errorlevel% equ 0 echo [SUCCESS] Loyalty Service is healthy
if %errorlevel% neq 0 echo [ERROR] Loyalty Service failed

curl -f -s http://localhost:8086/api/v1/actuator/health >nul 2>&1
if %errorlevel% equ 0 echo [SUCCESS] Notification Service is healthy
if %errorlevel% neq 0 echo [ERROR] Notification Service failed

curl -f -s http://localhost:8087/api/v1/actuator/health >nul 2>&1
if %errorlevel% equ 0 echo [SUCCESS] Analytics Service is healthy
if %errorlevel% neq 0 echo [ERROR] Analytics Service failed

curl -f -s http://localhost:8088/api/v1/actuator/health >nul 2>&1
if %errorlevel% equ 0 echo [SUCCESS] Store Service is healthy
if %errorlevel% neq 0 echo [ERROR] Store Service failed

echo.
echo [SUCCESS] Health checks completed! 🎉
echo.
echo 🌐 Service URLs:
echo   - Eureka Dashboard: http://localhost:8761
echo   - API Gateway: http://localhost:8080
echo   - RabbitMQ Management: http://localhost:15672 (admin/admin123)
echo   - Zipkin Tracing: http://localhost:9411
echo.
echo 📊 Monitoring:
echo   - Prometheus: http://localhost:9090
echo   - Grafana: http://localhost:3000 (admin/admin123)
echo.
echo ✅ Coffee Shop Microservices is ready for use!
echo.
pause
