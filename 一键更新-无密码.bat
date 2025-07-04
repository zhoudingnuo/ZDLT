@echo off
chcp 65001 >nul
title 一键Git更新 - 无密码版本

echo ========================================
echo        一键Git更新工具 - 无密码版
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

echo 4. 连接远程服务器...
echo 服务器: %SERVER_USER%@%SERVER_IP%

REM 使用SSH密钥认证（无需密码）
echo 5. 执行远程git pull...
ssh -o StrictHostKeyChecking=no %SERVER_USER%@%SERVER_IP% "cd %SERVER_PATH%; git pull"

if %errorlevel% equ 0 (
    echo 远程更新成功！
) else (
    echo 远程更新失败！
    echo.
    echo 可能的原因：
    echo 1. SSH密钥未配置
    echo 2. 服务器连接失败
    echo 3. 权限不足
    echo.
    echo 请手动执行：
    echo ssh root@47.107.84.24
    echo cd /root/ZDLT
    echo git pull
)

echo.
echo ========================================
echo 操作完成！
echo 提交信息: %msg%
echo ========================================
echo.
pause 