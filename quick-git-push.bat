@echo off
REM One-click commit, push to GitHub, and remote server git pull (manual password input required)

echo.
echo ====== Operation Selection ======
echo Do you want to download agents.json file first?
echo Enter y to download agents.json file
echo Enter n to proceed with code commit directly
echo.
set /p choice=Please enter your choice (y/n): 

if /i "%choice%"=="y" (
    echo.
    echo ====== Starting agents.json download ======
    scp root@47.107.84.24:/root/ZDLT/backend/agents.json "C:\Users\AnlangZ\Desktop\Cursor\OT\backend\agents.json"
    scp root@47.107.84.24:/root/ZDLT/backend/users.json "C:\Users\AnlangZ\Desktop\Cursor\OT\backend\users.json"
    echo File download completed!
    pause
    echo.
    echo ====== Continuing with code commit operation ======
) else (
    echo.
    echo ====== Proceeding with code commit operation directly ======
)

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

echo Starting remote git pull with auto-retry for network issues...
echo Please enter password once, then auto-retry 10 times...
echo.

REM Set retry count and timeout
set MAX_RETRIES=10
set RETRY_COUNT=0
set SUCCESS=0

echo Starting remote git pull with auto-retry for network issues...
echo Please enter password once, then auto-retry 10 times...
echo.

echo Starting git pull retries with 3 second timeout...
echo.

:retry_loop
set /a RETRY_COUNT+=1
echo.
echo ========================================
echo Attempt %RETRY_COUNT% of %MAX_RETRIES%: git pull...
echo ========================================

REM Execute git pull with timeout and force sync
ssh -o ConnectTimeout=3 root@47.107.84.24 "cd %SERVER_PATH% && echo '=== Server Response ===' && git status && echo '--- Attempting git pull ---' && timeout 3 git pull || (echo '--- Pull failed, force sync to GitHub version ---' && git reset --hard HEAD && git clean -fd && timeout 3 git pull && echo '--- Force sync completed ---') && echo '=== Git Pull Completed ==='"
set SSH_EXIT_CODE=%errorlevel%

echo.
echo ========================================
echo Attempt %RETRY_COUNT% exit code: %SSH_EXIT_CODE%
echo ========================================

if %SSH_EXIT_CODE% equ 0 (
    echo git pull successful!
    set SUCCESS=1
    goto :end_retry
) else (
    echo Attempt %RETRY_COUNT% failed (exit code: %SSH_EXIT_CODE%)
    if %RETRY_COUNT% lss %MAX_RETRIES% (
        echo Waiting 1 second before retry...
        timeout /t 1 /nobreak >nul
        goto :retry_loop
    ) else (
        echo Retried %MAX_RETRIES% times, still failed
        echo Please check network connection or server status manually
    )
)

:end_retry

if %SUCCESS% equ 1 (
    echo Remote update completed successfully!
) else (
    echo Remote update failed, please execute manually:
    echo ssh root@47.107.84.24
    echo cd /root/ZDLT
    echo git pull
)

echo Local commit and push to GitHub done. Remote backup and git pull triggered: %msg%
pause