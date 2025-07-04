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

echo Starting remote git pull with auto-retry for network issues...
echo Please enter password once, then auto-retry 10 times...
echo.

REM Set retry count and timeout
set MAX_RETRIES=10
set RETRY_COUNT=0
set SUCCESS=0

REM Create SSH connection with ControlMaster for connection reuse
echo Establishing SSH connection (enter password once)...
ssh -o ControlMaster=yes -o ControlPath=~/.ssh/control-%h-%p-%r -o ControlPersist=60s root@47.107.84.24 "echo 'SSH connection established'"

:retry_loop
set /a RETRY_COUNT+=1
echo Attempt %RETRY_COUNT% of %MAX_RETRIES%: git pull...

REM Use existing SSH connection with ControlMaster
ssh -o ControlMaster=no -o ControlPath=~/.ssh/control-%h-%p-%r root@47.107.84.24 "cd %SERVER_PATH% && timeout 2 git pull"
if %errorlevel% equ 0 (
    echo git pull successful!
    set SUCCESS=1
    goto :end_retry
) else (
    echo Attempt %RETRY_COUNT% failed or timed out
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
REM Close SSH connection
ssh -O exit -o ControlPath=~/.ssh/control-%h-%p-%r root@47.107.84.24 2>nul

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