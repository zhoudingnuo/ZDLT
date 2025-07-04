@echo off
REM One-click commit, push to GitHub, and remote server git pull (manual password input required)

git add .
for /f "tokens=1-4 delims=/ " %%i in ("%date%") do set mydate=%%i-%%j-%%k
for /f "tokens=1-2 delims=: " %%i in ("%time%") do set mytime=%%i-%%j
set msg=auto commit: %mydate% %mytime%
git commit -m "%msg%"
git push

set SERVER_IP=47.107.84.24
set SERVER_USER=root
set SERVER_PATH=/root/ZDLT

set BACKUP_DIR=/root/backup
set BACKUP_NAME=ZDLT_backup_$(date +%%Y%%m%%d_%%H%%M%%S).tar.gz

echo.
echo ====== Connecting to server, backup project, and running git pull ======
echo Please manually enter the server password: ZDLT@20250702
echo.

echo 开始远程git pull，如果网络问题会自动重试...
echo.

REM 设置重试次数和超时
set MAX_RETRIES=10
set RETRY_COUNT=0
set SUCCESS=0

:retry_loop
set /a RETRY_COUNT+=1
echo 第 %RETRY_COUNT% 次尝试 git pull...

REM 使用timeout命令设置5秒超时，如果超时则重试
timeout /t 5 /nobreak >nul & ssh root@47.107.84.24 "cd %SERVER_PATH% && timeout 5 git pull"
if %errorlevel% equ 0 (
    echo git pull 成功！
    set SUCCESS=1
    goto :end_retry
) else (
    echo 第 %RETRY_COUNT% 次尝试失败或超时
    if %RETRY_COUNT% lss %MAX_RETRIES% (
        echo 等待1秒后重试...
        timeout /t 1 /nobreak >nul
        goto :retry_loop
    ) else (
        echo 已重试 %MAX_RETRIES% 次，仍然失败
        echo 请手动检查网络连接或服务器状态
    )
)

:end_retry
if %SUCCESS% equ 1 (
    echo 远程更新成功完成！
) else (
    echo 远程更新失败，请手动执行：
    echo ssh root@47.107.84.24
    echo cd /root/ZDLT
    echo git pull
)

echo Local commit and push to GitHub done. Remote backup and git pull triggered: %msg%
pause