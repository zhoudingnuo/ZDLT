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

echo.
echo ====== Connecting to server and running git pull ======
echo Please manually enter the server password: ZDLT@20250702
echo.

REM Open a new command window to run ssh and auto-close after pull
start cmd /k "chcp 65001 >nul && echo. && ssh %SERVER_USER%@%SERVER_IP% \"cd %SERVER_PATH% && git pull\" & echo. & echo Done. Press any key to close this window. & pause & exit"

echo Local commit and push to GitHub done. Remote git pull triggered: %msg%
pause