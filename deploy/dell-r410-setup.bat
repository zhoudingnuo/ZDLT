@echo off
chcp 65001 >nul
title Dell R410服务器重装系统助手

echo ========================================
echo        Dell R410服务器重装系统助手
echo ========================================
echo.

:menu
echo 请选择操作：
echo 1. 重装系统准备工作
echo 2. 制作启动U盘
echo 3. 系统安装步骤
echo 4. 安装后配置
echo 5. 部署智大蓝图应用
echo 6. 查看详细指南
echo 7. 退出
echo.
set /p choice=请输入选择 (1-7): 

if "%choice%"=="1" goto prepare
if "%choice%"=="2" goto usb
if "%choice%"=="3" goto install
if "%choice%"=="4" goto config
if "%choice%"=="5" goto deploy
if "%choice%"=="6" goto guide
if "%choice%"=="7" goto exit
goto menu

:prepare
echo.
echo ========================================
echo           重装系统准备工作
echo ========================================
echo.
echo 步骤1: 硬件检查
echo - 确认所有硬盘工作正常
echo - 检查内存条安装正确
echo - 确认网卡连接正常
echo - 检查电源供应稳定
echo.
echo 步骤2: 数据备份
echo - 备份重要配置文件
echo - 备份数据库（如有）
echo - 备份用户数据
echo - 记录当前网络配置
echo.
echo 步骤3: 准备工具
echo - 准备8GB以上U盘
echo - 下载Rufus工具
echo - 下载系统镜像
echo.
echo 需要下载的工具：
echo 1. Rufus: https://rufus.ie/
echo 2. Ubuntu Server: https://ubuntu.com/download/server
echo 3. CentOS: https://www.centos.org/download/
echo.
pause
goto menu

:usb
echo.
echo ========================================
echo           制作启动U盘
echo ========================================
echo.
echo 步骤1: 下载系统镜像
echo 推荐下载 Ubuntu Server 22.04 LTS
echo 下载地址: https://ubuntu.com/download/server
echo.
echo 步骤2: 制作启动U盘
echo 1. 下载并安装Rufus: https://rufus.ie/
echo 2. 插入U盘（8GB以上）
echo 3. 运行Rufus
echo 4. 选择系统镜像文件
echo 5. 选择U盘设备
echo 6. 点击开始制作
echo.
echo 注意事项：
echo - 制作过程会清空U盘所有数据
echo - 确保选择正确的U盘设备
echo - 制作完成后不要格式化U盘
echo.
pause
goto menu

:install
echo.
echo ========================================
echo           系统安装步骤
echo ========================================
echo.
echo 步骤1: 设置BIOS启动
echo 1. 开机时按F2进入BIOS
echo 2. 找到Boot Settings
echo 3. 将USB设备设为第一启动项
echo 4. 保存并退出
echo.
echo 步骤2: 安装系统
echo 1. 插入U盘，重启服务器
echo 2. 选择语言和键盘布局
echo 3. 选择安装类型（推荐最小安装）
echo 4. 配置网络（建议配置静态IP）
echo 5. 设置主机名和域名
echo 6. 创建管理员账户
echo 7. 选择磁盘分区方案
echo 8. 开始安装
echo.
echo 网络配置建议：
echo - IP地址: 192.168.1.100
echo - 子网掩码: 255.255.255.0
echo - 网关: 192.168.1.1
echo - DNS: 8.8.8.8, 8.8.4.4
echo.
pause
goto menu

:config
echo.
echo ========================================
echo           安装后配置
echo ========================================
echo.
echo 步骤1: 基础系统配置
echo # 更新系统
echo sudo apt update && sudo apt upgrade -y
echo.
echo # 安装基础工具
echo sudo apt install -y curl wget git vim htop
echo.
echo 步骤2: 网络配置
echo # 配置静态IP
echo sudo nano /etc/netplan/01-netcfg.yaml
echo.
echo 配置内容：
echo network:
echo   version: 2
echo   ethernets:
echo     eth0:
echo       addresses:
echo         - 192.168.1.100/24
echo       gateway4: 192.168.1.1
echo       nameservers:
echo         addresses: [8.8.8.8, 8.8.4.4]
echo.
echo 步骤3: 安全配置
echo # 配置防火墙
echo sudo ufw enable
echo sudo ufw allow 22    # SSH
echo sudo ufw allow 80    # HTTP
echo sudo ufw allow 443   # HTTPS
echo sudo ufw allow 5000  # 后端API
echo sudo ufw allow 31001 # 前端服务
echo.
pause
goto menu

:deploy
echo.
echo ========================================
echo        部署智大蓝图应用
echo ========================================
echo.
echo 步骤1: 安装Node.js环境
echo curl -fsSL https://deb.nodesource.com/setup_18.x ^| sudo -E bash -
echo sudo apt-get install -y nodejs
echo.
echo 步骤2: 安装PM2和Nginx
echo sudo npm install -g pm2
echo sudo apt update
echo sudo apt install nginx
echo sudo systemctl start nginx
echo sudo systemctl enable nginx
echo.
echo 步骤3: 上传项目文件
echo # 使用scp上传
echo scp -r ./OT root@your-server-ip:/var/www/
echo.
echo 步骤4: 安装依赖和构建
echo cd /var/www/OT/backend
echo npm install
echo cd /var/www/OT/frontend
echo npm install
echo npm run build
echo.
echo 步骤5: 配置PM2启动脚本
echo # 创建ecosystem.config.js文件
echo # 启动服务
echo cd /var/www/OT
echo pm2 start ecosystem.config.js
echo pm2 save
echo pm2 startup
echo.
echo 步骤6: 配置Nginx反向代理
echo # 创建Nginx配置文件
echo # 启用站点
echo sudo ln -s /etc/nginx/sites-available/zeta-vista /etc/nginx/sites-enabled/
echo sudo nginx -t
echo sudo systemctl restart nginx
echo.
echo 详细配置请参考: deploy/dell-r410-setup-guide.md
echo.
pause
goto menu

:guide
echo.
echo ========================================
echo           详细指南文档
echo ========================================
echo.
echo 可用的详细指南：
echo 1. deploy/dell-r410-setup-guide.md - Dell R410完整部署指南
echo 2. deploy/deploy-guide.md - 通用云服务器部署指南
echo 3. deploy/cloud-platform-guide.md - 云平台部署指南
echo 4. deploy/ngrok-guide.md - 内网穿透部署指南
echo.
echo 推荐阅读顺序：
echo 1. 先阅读 dell-r410-setup-guide.md
echo 2. 参考 deploy-guide.md 中的优化部分
echo 3. 根据需要查看其他指南
echo.
echo 当前目录下的部署文档：
dir deploy\*.md
echo.
echo 重要提醒：
echo - 重装系统会清空所有数据，请务必备份
echo - 建议选择Ubuntu Server 22.04 LTS
echo - 配置静态IP便于管理
echo - 安装完成后及时配置防火墙
echo.
pause
goto menu

:exit
echo.
echo 感谢使用Dell R410服务器重装系统助手！
echo 如有问题，请查看详细指南文档
echo 祝您部署顺利！
pause
exit 