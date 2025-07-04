@echo off
chcp 65001 >nul
title 一键Git更新 - 自动密码版本

echo ========================================
echo        一键Git更新工具 - 自动密码版
echo ========================================
echo.

REM 获取当前时间
for /f "tokens=1-4 delims=/ " %%i in ("%date%") do set mydate=%%i-%%j-%%k
for /f "tokens=1-2 delims=: " %%i in ("%time%") do set mytime=%%i-%%j
set msg=auto commit: %mydate% %mytime%

echo 提交信息: %msg%
echo.

REM Git操作
echo 1. 添加文件到暂存区...
git add .

echo 2. 提交更改...
git commit -m "%msg%"

echo 3. 推送到GitHub...
git push

echo 本地Git操作完成！
echo.

REM 远程服务器信息
set SERVER_IP=47.107.84.24
set SERVER_USER=root
set SERVER_PATH=/root/ZDLT
set PASSWORD=ZDLT@20250702

echo 4. 连接远程服务器...
echo 服务器: %SERVER_USER%@%SERVER_IP%

REM 检查sshpass是否可用
sshpass -V >nul 2>&1
if %errorlevel% equ 0 (
    echo 5. 使用sshpass自动连接...
    sshpass -p "%PASSWORD%" ssh %SERVER_USER%@%SERVER_IP% "cd %SERVER_PATH%; git pull"
    if %errorlevel% equ 0 (
        echo 远程更新成功！
    ) else (
        echo 远程更新失败！
    )
) else (
    echo sshpass不可用，尝试其他方法...
    
    REM 尝试使用expect脚本
    if exist "auto-ssh.exp" (
        echo 使用expect脚本...
        expect auto-ssh.exp %SERVER_IP% %SERVER_USER% %SERVER_PATH%
    ) else (
        echo 请手动执行以下命令:
        echo ssh root@47.107.84.24
        echo cd /root/ZDLT
        echo git pull
        echo.
        echo 或者安装sshpass: apt-get install sshpass
    )
)

echo.
echo ========================================
echo 操作完成！
echo 提交信息: %msg%
echo ========================================
echo.
pause 