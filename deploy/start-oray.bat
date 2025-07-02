@echo off
chcp 65001 >nul
title 智大蓝图 - 花生壳内网穿透启动工具

echo ========================================
echo        智大蓝图花生壳内网穿透启动工具
echo ========================================
echo.

echo 步骤1: 检查花生壳客户端...
where oray >nul 2>&1
if %errorlevel% neq 0 (
    echo 花生壳客户端未安装或未添加到PATH
    echo 请先安装花生壳客户端: https://www.oray.com/download/
    echo 或手动启动花生壳客户端
    pause
    goto :eof
)

echo 花生壳客户端检查完成
echo.

echo 步骤2: 启动后端服务...
cd backend
start "智大蓝图后端" cmd /k "npm start"
cd ..

echo 等待后端服务启动...
timeout /t 5 /nobreak >nul

echo.
echo 步骤3: 启动前端服务...
cd frontend
start "智大蓝图前端" cmd /k "npm run start-network"
cd ..

echo 等待前端服务启动...
timeout /t 5 /nobreak >nul

echo.
echo 步骤4: 启动花生壳客户端...
echo 请手动启动花生壳客户端并配置映射
echo.
echo 映射配置说明：
echo.
echo 后端API映射：
echo - 应用名称: 智大蓝图后端
echo - 内网主机: 127.0.0.1
echo - 内网端口: 5000
echo - 协议类型: HTTP
echo.
echo 前端应用映射：
echo - 应用名称: 智大蓝图前端
echo - 内网主机: 127.0.0.1
echo - 内网端口: 31001
echo - 协议类型: HTTP
echo.
echo 配置完成后，您将获得外网访问地址
echo 记得修改前端API地址为花生壳后端地址
echo.
echo 服务启动完成！
echo 请查看花生壳客户端获取外网地址
pause 