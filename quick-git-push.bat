@echo off
REM 一键提交并推送到GitHub（Windows版）

git add .
for /f "tokens=1-4 delims=/ " %%i in ("%date%") do set mydate=%%i-%%j-%%k
for /f "tokens=1-2 delims=: " %%i in ("%time%") do set mytime=%%i-%%j
set msg=auto commit: %mydate% %mytime%
git commit -m "%msg%"
git push

echo 已自动提交并推送到GitHub: %msg%
pause 