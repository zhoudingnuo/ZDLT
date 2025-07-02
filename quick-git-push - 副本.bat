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

ssh root@47.107.84.24 "mkdir -p %BACKUP_DIR% && tar czvf %BACKUP_DIR%/ZDLT_backup_$(date +%Y%m%d_%H%M%S).tar.gz -C /root ZDLT && cd %SERVER_PATH% && git pull"

echo Local commit and push to GitHub done. Remote backup and git pull triggered: %msg%
pause