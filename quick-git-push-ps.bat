@echo off
REM 启动PowerShell脚本进行自动Git操作
REM 一键提交、推送到GitHub并远程服务器自动拉取

echo 正在启动PowerShell脚本...
echo.

REM 检查PowerShell是否可用
powershell -Command "Write-Host 'PowerShell可用'" >nul 2>&1
if errorlevel 1 (
    echo 错误：PowerShell不可用，请检查系统配置
    pause
    exit /b 1
)

REM 执行PowerShell脚本
powershell -ExecutionPolicy Bypass -File "%~dp0quick-git-push.ps1"

echo.
echo 操作完成！
pause 