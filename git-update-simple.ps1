# 最简单的Git更新脚本

Write-Host "=== 开始Git操作 ===" -ForegroundColor Green

# 获取时间
$date = Get-Date -Format "yyyy-MM-dd"
$time = Get-Date -Format "HH:mm:ss"
$msg = "auto commit: $date $time"

Write-Host "提交信息: $msg" -ForegroundColor Yellow

# Git操作
Write-Host "1. 添加文件..." -ForegroundColor Cyan
git add .

Write-Host "2. 提交更改..." -ForegroundColor Cyan
git commit -m $msg

Write-Host "3. 推送到GitHub..." -ForegroundColor Cyan
git push

Write-Host "本地操作完成！" -ForegroundColor Green

# 尝试SSH连接
Write-Host "4. 尝试远程更新..." -ForegroundColor Cyan

$sshResult = ssh root@47.107.84.24 "cd /root/ZDLT; git pull" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "远程更新成功！" -ForegroundColor Green
} else {
    Write-Host "远程更新失败，请手动执行:" -ForegroundColor Red
    Write-Host "ssh root@47.107.84.24" -ForegroundColor Yellow
    Write-Host "cd /root/ZDLT" -ForegroundColor Yellow
    Write-Host "git pull" -ForegroundColor Yellow
}

Write-Host "=== 完成 ===" -ForegroundColor Green
Write-Host "按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 