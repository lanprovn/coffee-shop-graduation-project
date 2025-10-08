@echo off
REM Coffee Shop Production Management Script
REM This script provides commands to manage the Coffee Shop production environment

setlocal enabledelayedexpansion

:menu
cls
echo ========================================
echo    Coffee Shop Production Manager
echo ========================================
echo.
echo 1. Deploy Production Environment
echo 2. Start All Services
echo 3. Stop All Services
echo 4. Restart All Services
echo 5. View Service Status
echo 6. View Service Logs
echo 7. Scale Services
echo 8. Backup Databases
echo 9. Update Services
echo 0. Exit
echo.
set /p choice="Enter your choice (0-9): "

if "%choice%"=="1" goto deploy
if "%choice%"=="2" goto start
if "%choice%"=="3" goto stop
if "%choice%"=="4" goto restart
if "%choice%"=="5" goto status
if "%choice%"=="6" goto logs
if "%choice%"=="7" goto scale
if "%choice%"=="8" goto backup
if "%choice%"=="9" goto update
if "%choice%"=="0" goto exit
goto menu

:deploy
echo.
echo [INFO] Deploying Production Environment...
call deploy-prod.bat
goto menu

:start
echo.
echo [INFO] Starting all services...
docker-compose -f docker-compose.prod.yml up -d
echo [SUCCESS] All services started
pause
goto menu

:stop
echo.
echo [INFO] Stopping all services...
docker-compose -f docker-compose.prod.yml down
echo [SUCCESS] All services stopped
pause
goto menu

:restart
echo.
echo [INFO] Restarting all services...
docker-compose -f docker-compose.prod.yml restart
echo [SUCCESS] All services restarted
pause
goto menu

:status
echo.
echo [INFO] Service Status:
echo.
docker-compose -f docker-compose.prod.yml ps
echo.
echo [INFO] Health Checks:
echo.
echo Checking Eureka Server...
curl -s http://localhost:8761/api/v1/actuator/health | findstr "UP" >nul
if %errorlevel% equ 0 (
    echo ✓ Eureka Server: HEALTHY
) else (
    echo ✗ Eureka Server: UNHEALTHY
)

echo Checking API Gateway...
curl -s http://localhost:8080/api/v1/actuator/health | findstr "UP" >nul
if %errorlevel% equ 0 (
    echo ✓ API Gateway: HEALTHY
) else (
    echo ✗ API Gateway: UNHEALTHY
)

echo Checking User Service...
curl -s http://localhost:8081/api/v1/actuator/health | findstr "UP" >nul
if %errorlevel% equ 0 (
    echo ✓ User Service: HEALTHY
) else (
    echo ✗ User Service: UNHEALTHY
)

echo Checking Product Service...
curl -s http://localhost:8082/api/v1/actuator/health | findstr "UP" >nul
if %errorlevel% equ 0 (
    echo ✓ Product Service: HEALTHY
) else (
    echo ✗ Product Service: UNHEALTHY
)

echo Checking Order Service...
curl -s http://localhost:8083/api/v1/actuator/health | findstr "UP" >nul
if %errorlevel% equ 0 (
    echo ✓ Order Service: HEALTHY
) else (
    echo ✗ Order Service: UNHEALTHY
)

echo Checking Payment Service...
curl -s http://localhost:8084/api/v1/actuator/health | findstr "UP" >nul
if %errorlevel% equ 0 (
    echo ✓ Payment Service: HEALTHY
) else (
    echo ✗ Payment Service: UNHEALTHY
)

echo Checking Loyalty Service...
curl -s http://localhost:8085/api/v1/actuator/health | findstr "UP" >nul
if %errorlevel% equ 0 (
    echo ✓ Loyalty Service: HEALTHY
) else (
    echo ✗ Loyalty Service: UNHEALTHY
)

echo Checking Notification Service...
curl -s http://localhost:8086/api/v1/actuator/health | findstr "UP" >nul
if %errorlevel% equ 0 (
    echo ✓ Notification Service: HEALTHY
) else (
    echo ✗ Notification Service: UNHEALTHY
)

echo Checking Analytics Service...
curl -s http://localhost:8087/api/v1/actuator/health | findstr "UP" >nul
if %errorlevel% equ 0 (
    echo ✓ Analytics Service: HEALTHY
) else (
    echo ✗ Analytics Service: UNHEALTHY
)

echo Checking Store Service...
curl -s http://localhost:8088/api/v1/actuator/health | findstr "UP" >nul
if %errorlevel% equ 0 (
    echo ✓ Store Service: HEALTHY
) else (
    echo ✗ Store Service: UNHEALTHY
)

pause
goto menu

:logs
echo.
echo [INFO] Service Logs:
echo.
echo 1. Eureka Server
echo 2. API Gateway
echo 3. User Service
echo 4. Product Service
echo 5. Order Service
echo 6. Payment Service
echo 7. Loyalty Service
echo 8. Notification Service
echo 9. Analytics Service
echo 10. Store Service
echo 11. All Services
echo.
set /p logchoice="Select service to view logs (1-11): "

if "%logchoice%"=="1" (
    docker-compose -f docker-compose.prod.yml logs -f eureka-server
) else if "%logchoice%"=="2" (
    docker-compose -f docker-compose.prod.yml logs -f api-gateway
) else if "%logchoice%"=="3" (
    docker-compose -f docker-compose.prod.yml logs -f user-service
) else if "%logchoice%"=="4" (
    docker-compose -f docker-compose.prod.yml logs -f product-service
) else if "%logchoice%"=="5" (
    docker-compose -f docker-compose.prod.yml logs -f order-service
) else if "%logchoice%"=="6" (
    docker-compose -f docker-compose.prod.yml logs -f payment-service
) else if "%logchoice%"=="7" (
    docker-compose -f docker-compose.prod.yml logs -f loyalty-service
) else if "%logchoice%"=="8" (
    docker-compose -f docker-compose.prod.yml logs -f notification-service
) else if "%logchoice%"=="9" (
    docker-compose -f docker-compose.prod.yml logs -f analytics-service
) else if "%logchoice%"=="10" (
    docker-compose -f docker-compose.prod.yml logs -f store-service
) else if "%logchoice%"=="11" (
    docker-compose -f docker-compose.prod.yml logs -f
) else (
    echo [ERROR] Invalid choice
    pause
    goto menu
)
pause
goto menu

:scale
echo.
echo [INFO] Service Scaling:
echo.
echo 1. Scale User Service
echo 2. Scale Product Service
echo 3. Scale Order Service
echo 4. Scale Payment Service
echo 5. Scale All Services
echo.
set /p scalechoice="Select service to scale (1-5): "
set /p replicas="Enter number of replicas: "

if "%scalechoice%"=="1" (
    docker-compose -f docker-compose.prod.yml up -d --scale user-service=%replicas%
) else if "%scalechoice%"=="2" (
    docker-compose -f docker-compose.prod.yml up -d --scale product-service=%replicas%
) else if "%scalechoice%"=="3" (
    docker-compose -f docker-compose.prod.yml up -d --scale order-service=%replicas%
) else if "%scalechoice%"=="4" (
    docker-compose -f docker-compose.prod.yml up -d --scale payment-service=%replicas%
) else if "%scalechoice%"=="5" (
    docker-compose -f docker-compose.prod.yml up -d --scale user-service=%replicas% --scale product-service=%replicas% --scale order-service=%replicas% --scale payment-service=%replicas%
) else (
    echo [ERROR] Invalid choice
    pause
    goto menu
)

echo [SUCCESS] Service scaled to %replicas% replicas
pause
goto menu

:backup
echo.
echo [INFO] Database Backup:
echo.
echo 1. Backup All Databases
echo 2. Backup Specific Database
echo.
set /p backupchoice="Select backup option (1-2): "

if "%backupchoice%"=="1" (
    echo [INFO] Creating backup directory...
    if not exist "backups" mkdir backups
    set backupdir=backups\backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
    set backupdir=%backupdir: =0%
    mkdir "%backupdir%"
    
    echo [INFO] Backing up all databases...
    docker exec postgres-users-prod pg_dump -U postgres coffeeshop_users > "%backupdir%\users.sql"
    docker exec postgres-products-prod pg_dump -U postgres coffeeshop_products > "%backupdir%\products.sql"
    docker exec postgres-orders-prod pg_dump -U postgres coffeeshop_orders > "%backupdir%\orders.sql"
    docker exec postgres-payments-prod pg_dump -U postgres coffeeshop_payments > "%backupdir%\payments.sql"
    docker exec postgres-loyalty-prod pg_dump -U postgres coffeeshop_loyalty > "%backupdir%\loyalty.sql"
    docker exec postgres-notifications-prod pg_dump -U postgres coffeeshop_notifications > "%backupdir%\notifications.sql"
    docker exec postgres-analytics-prod pg_dump -U postgres coffeeshop_analytics > "%backupdir%\analytics.sql"
    docker exec postgres-stores-prod pg_dump -U postgres coffeeshop_stores > "%backupdir%\stores.sql"
    
    echo [SUCCESS] All databases backed up to %backupdir%
) else if "%backupchoice%"=="2" (
    echo [INFO] Available databases:
    echo 1. Users
    echo 2. Products
    echo 3. Orders
    echo 4. Payments
    echo 5. Loyalty
    echo 6. Notifications
    echo 7. Analytics
    echo 8. Stores
    echo.
    set /p dbchoice="Select database to backup (1-8): "
    
    if not exist "backups" mkdir backups
    set backupdir=backups\backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
    set backupdir=%backupdir: =0%
    mkdir "%backupdir%"
    
    if "%dbchoice%"=="1" (
        docker exec postgres-users-prod pg_dump -U postgres coffeeshop_users > "%backupdir%\users.sql"
        echo [SUCCESS] Users database backed up
    ) else if "%dbchoice%"=="2" (
        docker exec postgres-products-prod pg_dump -U postgres coffeeshop_products > "%backupdir%\products.sql"
        echo [SUCCESS] Products database backed up
    ) else if "%dbchoice%"=="3" (
        docker exec postgres-orders-prod pg_dump -U postgres coffeeshop_orders > "%backupdir%\orders.sql"
        echo [SUCCESS] Orders database backed up
    ) else if "%dbchoice%"=="4" (
        docker exec postgres-payments-prod pg_dump -U postgres coffeeshop_payments > "%backupdir%\payments.sql"
        echo [SUCCESS] Payments database backed up
    ) else if "%dbchoice%"=="5" (
        docker exec postgres-loyalty-prod pg_dump -U postgres coffeeshop_loyalty > "%backupdir%\loyalty.sql"
        echo [SUCCESS] Loyalty database backed up
    ) else if "%dbchoice%"=="6" (
        docker exec postgres-notifications-prod pg_dump -U postgres coffeeshop_notifications > "%backupdir%\notifications.sql"
        echo [SUCCESS] Notifications database backed up
    ) else if "%dbchoice%"=="7" (
        docker exec postgres-analytics-prod pg_dump -U postgres coffeeshop_analytics > "%backupdir%\analytics.sql"
        echo [SUCCESS] Analytics database backed up
    ) else if "%dbchoice%"=="8" (
        docker exec postgres-stores-prod pg_dump -U postgres coffeeshop_stores > "%backupdir%\stores.sql"
        echo [SUCCESS] Stores database backed up
    ) else (
        echo [ERROR] Invalid choice
    )
) else (
    echo [ERROR] Invalid choice
)

pause
goto menu

:update
echo.
echo [INFO] Updating Services:
echo.
echo 1. Update All Services
echo 2. Update Specific Service
echo.
set /p updatechoice="Select update option (1-2): "

if "%updatechoice%"=="1" (
    echo [INFO] Updating all services...
    docker-compose -f docker-compose.prod.yml pull
    docker-compose -f docker-compose.prod.yml up -d --build
    echo [SUCCESS] All services updated
) else if "%updatechoice%"=="2" (
    echo [INFO] Available services:
    echo 1. Eureka Server
    echo 2. API Gateway
    echo 3. User Service
    echo 4. Product Service
    echo 5. Order Service
    echo 6. Payment Service
    echo 7. Loyalty Service
    echo 8. Notification Service
    echo 9. Analytics Service
    echo 10. Store Service
    echo.
    set /p servicechoice="Select service to update (1-10): "
    
    if "%servicechoice%"=="1" (
        docker-compose -f docker-compose.prod.yml pull eureka-server
        docker-compose -f docker-compose.prod.yml up -d --build eureka-server
        echo [SUCCESS] Eureka Server updated
    ) else if "%servicechoice%"=="2" (
        docker-compose -f docker-compose.prod.yml pull api-gateway
        docker-compose -f docker-compose.prod.yml up -d --build api-gateway
        echo [SUCCESS] API Gateway updated
    ) else if "%servicechoice%"=="3" (
        docker-compose -f docker-compose.prod.yml pull user-service
        docker-compose -f docker-compose.prod.yml up -d --build user-service
        echo [SUCCESS] User Service updated
    ) else if "%servicechoice%"=="4" (
        docker-compose -f docker-compose.prod.yml pull product-service
        docker-compose -f docker-compose.prod.yml up -d --build product-service
        echo [SUCCESS] Product Service updated
    ) else if "%servicechoice%"=="5" (
        docker-compose -f docker-compose.prod.yml pull order-service
        docker-compose -f docker-compose.prod.yml up -d --build order-service
        echo [SUCCESS] Order Service updated
    ) else if "%servicechoice%"=="6" (
        docker-compose -f docker-compose.prod.yml pull payment-service
        docker-compose -f docker-compose.prod.yml up -d --build payment-service
        echo [SUCCESS] Payment Service updated
    ) else if "%servicechoice%"=="7" (
        docker-compose -f docker-compose.prod.yml pull loyalty-service
        docker-compose -f docker-compose.prod.yml up -d --build loyalty-service
        echo [SUCCESS] Loyalty Service updated
    ) else if "%servicechoice%"=="8" (
        docker-compose -f docker-compose.prod.yml pull notification-service
        docker-compose -f docker-compose.prod.yml up -d --build notification-service
        echo [SUCCESS] Notification Service updated
    ) else if "%servicechoice%"=="9" (
        docker-compose -f docker-compose.prod.yml pull analytics-service
        docker-compose -f docker-compose.prod.yml up -d --build analytics-service
        echo [SUCCESS] Analytics Service updated
    ) else if "%servicechoice%"=="10" (
        docker-compose -f docker-compose.prod.yml pull store-service
        docker-compose -f docker-compose.prod.yml up -d --build store-service
        echo [SUCCESS] Store Service updated
    ) else (
        echo [ERROR] Invalid choice
    )
) else (
    echo [ERROR] Invalid choice
)

pause
goto menu

:exit
echo.
echo [INFO] Exiting Coffee Shop Production Manager...
exit /b 0
