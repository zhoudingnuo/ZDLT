@echo off
chcp 65001 >nul
title 智大蓝图 - 外网部署工具

echo ========================================
echo           智大蓝图外网部署工具
echo ========================================
echo.

:menu
echo 请选择部署方式：
echo 1. 内网穿透 (ngrok) - 快速测试
echo 2. 内网穿透 (花生壳) - 国内服务，推荐
echo 3. 云平台部署 (Vercel + Railway) - 推荐新手
echo 4. 云服务器部署 - 专业方案
echo 5. 查看部署指南
echo 6. 退出
echo.
set /p choice=请输入选择 (1-6): 

if "%choice%"=="1" goto ngrok_deploy
if "%choice%"=="2" goto oray_deploy
if "%choice%"=="3" goto cloud_deploy
if "%choice%"=="4" goto server_deploy
if "%choice%"=="5" goto show_guide
if "%choice%"=="6" goto exit
goto menu

:ngrok_deploy
echo.
echo ========================================
echo           内网穿透部署 (ngrok)
echo ========================================
echo.
echo 步骤1: 检查ngrok是否已安装...
where ngrok >nul 2>&1
if %errorlevel% neq 0 (
    echo ngrok未安装，正在下载...
    echo 请访问 https://ngrok.com/download 下载Windows版本
    echo 解压到C:\ngrok并添加到系统PATH
    pause
    goto menu
)

echo ngrok已安装，继续...
echo.
echo 步骤2: 启动后端服务...
cd backend
start "后端服务" cmd /k "npm start"
cd ..

echo 等待后端服务启动...
timeout /t 5 /nobreak >nul

echo.
echo 步骤3: 启动ngrok隧道...
echo 请在新窗口中配置ngrok authtoken（如果未配置）
echo 命令: ngrok config add-authtoken YOUR_TOKEN
echo.
echo 启动后端API隧道...
start "ngrok后端" cmd /k "ngrok http 5000"

echo.
echo 步骤4: 启动前端服务...
cd frontend
start "前端服务" cmd /k "npm run start-network"
cd ..

echo.
echo 步骤5: 启动前端隧道...
echo 请在新窗口中启动前端隧道
echo 命令: ngrok http 31001
echo.
echo 部署完成！请查看ngrok提供的域名
echo 记得修改前端API地址为ngrok后端域名
pause
goto menu

:oray_deploy
echo.
echo ========================================
echo           内网穿透部署 (花生壳)
echo ========================================
echo.
echo 步骤1: 检查花生壳客户端...
echo 请确认已安装花生壳客户端
echo 下载地址: https://www.oray.com/download/
echo.
echo 步骤2: 启动后端服务...
cd backend
start "后端服务" cmd /k "npm start"
cd ..

echo 等待后端服务启动...
timeout /t 5 /nobreak >nul

echo.
echo 步骤3: 启动前端服务...
cd frontend
start "前端服务" cmd /k "npm run start-network"
cd ..

echo 等待前端服务启动...
timeout /t 5 /nobreak >nul

echo.
echo 步骤4: 配置花生壳映射...
echo 请打开花生壳客户端并配置以下映射：
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
echo 详细配置请参考: deploy/oray-guide.md
pause
goto menu

:cloud_deploy
echo.
echo ========================================
echo        云平台部署 (Vercel + Railway)
echo ========================================
echo.
echo 步骤1: 准备项目文件...
echo 正在创建部署配置文件...

REM 创建前端环境变量文件
echo REACT_APP_API_URL=https://your-railway-app.railway.app > frontend\.env.production

REM 创建后端Procfile
echo web: node app.js > backend\Procfile

echo 配置文件已创建！
echo.
echo 步骤2: 部署到Vercel (前端)
echo 1. 访问 https://vercel.com 注册账号
echo 2. 连接GitHub仓库
echo 3. 选择frontend目录
echo 4. 配置环境变量 REACT_APP_API_URL
echo 5. 点击部署
echo.
echo 步骤3: 部署到Railway (后端)
echo 1. 访问 https://railway.app 注册账号
echo 2. 连接GitHub仓库
echo 3. 选择backend目录
echo 4. 配置环境变量 PORT=5000, NODE_ENV=production
echo 5. 点击部署
echo.
echo 步骤4: 更新前端API地址
echo 部署完成后，将前端环境变量中的API地址更新为Railway提供的域名
echo.
pause
goto menu

:server_deploy
echo.
echo ========================================
echo           云服务器部署
echo ========================================
echo.
echo 步骤1: 准备服务器
echo 1. 购买云服务器 (阿里云/腾讯云/华为云)
echo 2. 选择Ubuntu 20.04或CentOS 7
echo 3. 配置2核4G以上
echo.
echo 步骤2: 连接服务器
echo 使用SSH连接服务器，然后执行以下命令：
echo.
echo # 安装Node.js
echo curl -fsSL https://deb.nodesource.com/setup_18.x ^| sudo -E bash -
echo sudo apt-get install -y nodejs
echo.
echo # 安装PM2
echo sudo npm install -g pm2
echo.
echo # 安装Nginx
echo sudo apt update
echo sudo apt install nginx
echo.
echo 步骤3: 上传项目
echo 使用scp或git克隆项目到服务器
echo.
echo 步骤4: 部署项目
echo 参考 deploy/deploy-guide.md 中的详细步骤
echo.
echo 需要帮助？请查看完整的部署指南
pause
goto menu

:show_guide
echo.
echo ========================================
echo           部署指南文档
echo ========================================
echo.
echo 可用的部署指南：
echo 1. deploy/oray-guide.md - 花生壳内网穿透部署
echo 2. deploy/ngrok-guide.md - ngrok内网穿透部署
echo 3. deploy/cloud-platform-guide.md - 云平台部署
echo 4. deploy/deploy-guide.md - 云服务器部署
echo 5. deploy/dell-r410-setup-guide.md - Dell R410服务器部署
echo.
echo 推荐阅读顺序：
echo 1. 新手用户：先看 oray-guide.md (花生壳)
echo 2. 快速测试：使用 ngrok-guide.md
echo 3. 云平台部署：参考 cloud-platform-guide.md
echo 4. 专业部署：参考 deploy-guide.md
echo.
echo 当前目录下的部署文档：
dir deploy\*.md
echo.
echo 推荐方案：
echo - 国内用户：花生壳 (免费，稳定，速度快)
echo - 国际用户：ngrok (免费，功能强大)
echo - 长期项目：云平台或云服务器
echo.
pause
goto menu

:exit
echo.
echo 感谢使用智大蓝图部署工具！
echo 如有问题，请查看部署指南文档
pause
exit 