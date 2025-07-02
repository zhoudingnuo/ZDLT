@echo off
REM One-click start for AI Study Room full stack service
REM Start frontend service (port fixed to 30001)
start "Frontend" cmd /k "cd /d %~dp0 && cd frontend && npm run start-external"
REM Start backend service
nodemon backend/app.js


REM =====================================
REM 所有服务已启动，请勿关闭本窗口。start "Backend" cmd /k "cd /d %~dp0 && cd backend && node app.js"
REM =====================================

pause 