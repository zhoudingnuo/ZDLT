@echo off
chcp 65001 >nul
title 智大蓝图 - 一键启动工具

echo ========================================
echo           智大蓝图一键启动工具
echo ========================================
echo.

echo 步骤1: 启动后端服务...
cd backend
start "智大蓝图后端" cmd /k "npm start"
cd ..

echo 等待后端服务启动...
timeout /t 5 /nobreak >nul

echo.
echo 步骤2: 启动前端服务（外网访问模式）...
cd frontend
start "智大蓝图前端" cmd /k "npm run start-external"
cd ..

echo.
echo 启动完成！
echo.
echo 本地访问地址：
echo 前端: http://localhost:31001
echo 后端: http://localhost:5000
echo.
echo 网络访问地址：
echo 前端: http://[你的IP]:31001
echo 后端: http://[你的IP]:5000
echo.
echo 注意：使用外网访问模式启动前端，支持所有网络访问
echo.
pause 