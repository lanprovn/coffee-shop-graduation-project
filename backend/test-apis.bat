@echo off
echo.
echo 🧪 Coffee Shop API Testing Suite
echo ================================
echo.

REM Check if curl is available
curl --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ curl is not available. Please install curl or use PowerShell
    echo You can also test manually using Postman or browser
    pause
    exit /b 1
)

echo ✅ curl is available
echo.

REM Test 1: Register User
echo 📝 Test 1: Register User
echo ------------------------
curl -X POST http://localhost:8080/api/users/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\",\"firstName\":\"Test\",\"lastName\":\"User\"}" ^
  -w "\nHTTP Status: %%{http_code}\n\n"

echo Press any key to continue to next test...
pause >nul

REM Test 2: Login
echo 🔐 Test 2: Login
echo ----------------
curl -X POST http://localhost:8080/api/users/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"testuser\",\"password\":\"password123\"}" ^
  -w "\nHTTP Status: %%{http_code}\n\n"

echo Press any key to continue to next test...
pause >nul

REM Test 3: Get Products
echo ☕ Test 3: Get Products
echo ----------------------
curl http://localhost:8080/api/products ^
  -w "\nHTTP Status: %%{http_code}\n\n"

echo Press any key to continue to next test...
pause >nul

REM Test 4: Get Stores
echo 🏪 Test 4: Get Stores
echo ---------------------
curl http://localhost:8080/api/stores ^
  -w "\nHTTP Status: %%{http_code}\n\n"

echo Press any key to continue to next test...
pause >nul

REM Test 5: Create Loyalty Membership
echo 🎁 Test 5: Create Loyalty Membership
echo -----------------------------------
curl -X POST "http://localhost:8080/api/loyalty/membership?userId=1" ^
  -w "\nHTTP Status: %%{http_code}\n\n"

echo Press any key to continue to next test...
pause >nul

REM Test 6: Get Analytics
echo 📊 Test 6: Get Analytics Dashboard
echo ----------------------------------
curl http://localhost:8080/api/analytics/dashboard ^
  -w "\nHTTP Status: %%{http_code}\n\n"

echo.
echo 🎉 API Testing completed!
echo.
echo 📋 Manual Testing URLs:
echo - API Gateway: http://localhost:8080
echo - Eureka Dashboard: http://localhost:8761
echo - User Service: http://localhost:8081
echo - Product Service: http://localhost:8082
echo - Order Service: http://localhost:8083
echo - Payment Service: http://localhost:8084
echo - Loyalty Service: http://localhost:8085
echo - Notification Service: http://localhost:8086
echo - Analytics Service: http://localhost:8087
echo - Store Service: http://localhost:8088
echo.
pause
