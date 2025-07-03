@echo off
echo 正在启动 ZDLT 后端服务...

REM 检查是否已安装PM2
pm2 --version >nul 2>&1
if errorlevel 1 (
    echo PM2 未安装，正在安装...
    npm install -g pm2
)

REM 启动服务
echo 启动后端服务...
pm2 start ecosystem.config.js --env production

REM 保存PM2配置
pm2 save

REM 设置开机自启
pm2 startup

echo.
echo 服务启动完成！
echo 查看状态: pm2 status
echo 查看日志: pm2 logs zdlt-backend
echo 重启服务: pm2 restart zdlt-backend
echo 停止服务: pm2 stop zdlt-backend
pause 