# 智大蓝图 - PowerShell一键启动工具
Write-Host "========================================" -ForegroundColor Green
Write-Host "           智大蓝图一键启动工具" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "步骤1: 启动后端服务..." -ForegroundColor Yellow
Set-Location backend
Start-Process cmd -ArgumentList "/k", "npm start" -WindowStyle Normal
Set-Location ..

Write-Host "等待后端服务启动..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "步骤2: 启动前端服务（外网访问模式）..." -ForegroundColor Yellow
Set-Location frontend
Start-Process cmd -ArgumentList "/k", "npm run start-external" -WindowStyle Normal
Set-Location ..

Write-Host ""
Write-Host "启动完成！" -ForegroundColor Green
Write-Host ""
Write-Host "本地访问地址：" -ForegroundColor Cyan
Write-Host "前端: http://localhost:31001" -ForegroundColor White
Write-Host "后端: http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "网络访问地址：" -ForegroundColor Cyan
Write-Host "前端: http://[你的IP]:31001" -ForegroundColor White
Write-Host "后端: http://[你的IP]:5000" -ForegroundColor White
Write-Host ""
Write-Host "注意：使用外网访问模式启动前端，支持所有网络访问" -ForegroundColor Yellow
Write-Host ""
Read-Host "按回车键退出" 