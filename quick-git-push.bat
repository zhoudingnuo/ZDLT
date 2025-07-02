@echo off
REM 一键提交并推送到GitHub，并远程服务器自动pull（需手动输入密码）

git add .
for /f "tokens=1-4 delims=/ " %%i in ("%date%") do set mydate=%%i-%%j-%%k
for /f "tokens=1-2 delims=: " %%i in ("%time%") do set mytime=%%i-%%j
set msg=auto commit: %mydate% %mytime%
git commit -m "%msg%"
git push

set SERVER_IP=你的服务器IP地址
set SERVER_USER=root
set SERVER_PATH=/root/ZDLT

echo.
echo ====== 现在将连接服务器并执行 git pull ======
echo 你需要手动输入服务器密码：ZDLT@20250702
echo.

REM 打开新命令行窗口执行ssh，pull完自动关闭
start cmd /k "ssh %SERVER_USER%@%SERVER_IP% \"cd %SERVER_PATH% && git pull\" & echo. & echo 操作完成，按任意键关闭窗口 & pause & exit"

echo 已自动提交并推送到GitHub，并弹窗远程pull到服务器: %msg%
pause