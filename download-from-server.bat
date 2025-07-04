@echo off
chcp 65001 >nul
title Download from Server

echo ========================================
echo        从服务器下载文件工具
echo ========================================
echo.

set SERVER_IP=47.107.84.24
set SERVER_USER=root
set SERVER_PATH=/root/ZDLT

echo 选择下载方式：
echo 1. 下载整个项目目录
echo 2. 下载特定文件
echo 3. 下载日志文件
echo 4. 自定义路径下载
echo.

set /p choice=请输入选择 (1-4): 

if "%choice%"=="1" (
    echo 下载整个项目目录...
    scp -r %SERVER_USER%@%SERVER_IP%:%SERVER_PATH% ./server_backup/
    echo 下载完成！文件保存在 ./server_backup/ZDLT/
) else if "%choice%"=="2" (
    echo 下载特定文件...
    set /p filename=请输入文件名 (如: app.js): 
    scp %SERVER_USER%@%SERVER_IP%:%SERVER_PATH%/%filename% ./
    echo 下载完成！文件保存在当前目录
) else if "%choice%"=="3" (
    echo 下载日志文件...
    scp %SERVER_USER%@%SERVER_IP%:%SERVER_PATH%/logs/* ./logs/
    echo 下载完成！日志文件保存在 ./logs/
) else if "%choice%"=="4" (
    set /p custom_path=请输入服务器路径 (如: /root/ZDLT/app.js): 
    set /p local_path=请输入本地保存路径 (如: ./downloads/): 
    scp %SERVER_USER%@%SERVER_IP%:%custom_path% %local_path%
    echo 下载完成！
) else (
    echo 无效选择！
)

echo.
pause 