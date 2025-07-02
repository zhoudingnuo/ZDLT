@echo off
REM 一键提交并推送到GitHub，并远程服务器自动pull（Windows版）

git add .
for /f "tokens=1-4 delims=/ " %%i in ("%date%") do set mydate=%%i-%%j-%%k
for /f "tokens=1-2 delims=: " %%i in ("%time%") do set mytime=%%i-%%j
set msg=auto commit: %mydate% %mytime%
git commit -m "%msg%"
git push

REM 远程服务器自动pull
REM 需要已安装plink.exe（PuTTY工具），并与服务器建立过信任（或用密码自动登录）
set SERVER_IP=你的服务器IP地址
set SERVER_USER=root
set SERVER_PASS=ZDLT@20250702
set SERVER_PATH=/root/ZDLT

REM 检查plink.exe是否存在
if not exist plink.exe (
    echo 请将plink.exe放在本目录或系统PATH中！
    pause
    exit /b
)

REM 执行远程pull
plink.exe -pw %SERVER_PASS% %SERVER_USER%@%SERVER_IP% "cd %SERVER_PATH% && git pull"

echo 已自动提交并推送到GitHub，并远程pull到服务器: %msg%
pause 