@echo off
echo Testing Coffee Shop Microservices Build...

REM Clean and build shared-config first
echo Building shared configuration...
cd shared-config
mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Failed to build shared-config
    pause
    exit /b 1
)
cd ..

REM Test build one service to verify structure
echo Testing user-service build...
cd user-service
mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Failed to build user-service
    pause
    exit /b 1
)
cd ..

echo SUCCESS: Build test completed successfully!
echo The backend structure is now properly configured.
pause
