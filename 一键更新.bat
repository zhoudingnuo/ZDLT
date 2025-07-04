@echo off
chcp 65001 >nul
title 一键Git更新

echo ========================================
echo           一键Git更新工具
echo ========================================
echo.

REM 设置执行策略并运行PowerShell脚本
powershell -ExecutionPolicy Bypass -Command "& {. '%~dp0quick-git-push.ps1'}"

echo.
echo 按任意键退出...
pause >nul 