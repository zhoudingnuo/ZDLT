@echo off
chcp 65001 >nul
title ZETA VISTA - Quick Start Tool

echo ========================================
echo        ZETA VISTA Quick Start Tool
echo ========================================
echo.

echo Step 1: Starting backend service...
cd backend
start "ZETA VISTA Backend" cmd /k "npm start"
cd ..

echo Waiting for backend service to start...
timeout /t 5 /nobreak >nul

echo.
echo Step 2: Starting frontend service (external access mode)...
cd frontend
start "ZETA VISTA Frontend" cmd /k "npm run start-external"
cd ..

echo.
echo Startup completed!
echo.
echo Local access addresses:
echo Frontend: http://localhost:31001
echo Backend:  http://localhost:5000
echo.
echo Network access addresses:
echo Frontend: http://[your-IP]:31001
echo Backend:  http://[your-IP]:5000
echo.
echo Note: Frontend started in external access mode, supports all network access
echo.
pause