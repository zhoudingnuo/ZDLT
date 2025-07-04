@echo off
title ZDLT PM2 管理工具

:menu
cls
echo ========================================
echo           ZDLT PM2 管理工具
echo ========================================
echo.
echo 1. 启动服务
echo 2. 停止服务
echo 3. 重启服务
echo 4. 查看状态
echo 5. 查看日志
echo 6. 监控面板
echo 7. 删除服务
echo 8. 保存配置
echo 9. 设置开机自启
echo 0. 退出
echo.
set /p choice=请选择操作 (0-9): 

if "%choice%"=="1" goto start
if "%choice%"=="2" goto stop
if "%choice%"=="3" goto restart
if "%choice%"=="4" goto status
if "%choice%"=="5" goto logs
if "%choice%"=="6" goto monit
if "%choice%"=="7" goto delete
if "%choice%"=="8" goto save
if "%choice%"=="9" goto startup
if "%choice%"=="0" goto exit
goto menu

:start
echo 正在启动服务...
pm2 start ecosystem.config.js --env production
pause
goto menu

:stop
echo 正在停止服务...
pm2 stop zdlt-backend
pause
goto menu

:restart
echo 正在重启服务...
pm2 restart zdlt-backend
pause
goto menu

:status
echo 服务状态：
pm2 status
pause
goto menu

:logs
echo 服务日志：
pm2 logs zdlt-backend
pause
goto menu

:monit
echo 打开监控面板...
pm2 monit
goto menu

:delete
echo 正在删除服务...
pm2 delete zdlt-backend
pause
goto menu

:save
echo 正在保存配置...
pm2 save
pause
goto menu

:startup
echo 正在设置开机自启...
pm2 startup
pause
goto menu

:exit
echo 退出管理工具
exit 