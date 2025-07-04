# 一键Git更新工具 - PowerShell版本
# 自动提交、推送并尝试远程更新

Write-Host "=== 开始自动Git操作 ===" -ForegroundColor Green

# 获取当前时间
$date = Get-Date -Format "yyyy-MM-dd"
$time = Get-Date -Format "HH:mm:ss"
$msg = "auto commit: $date $time"

Write-Host "提交信息: $msg" -ForegroundColor Yellow

# Git操作
Write-Host "1. 添加文件到暂存区..." -ForegroundColor Cyan
git add .

Write-Host "2. 提交更改..." -ForegroundColor Cyan
git commit -m $msg

Write-Host "3. 推送到GitHub..." -ForegroundColor Cyan
git push

Write-Host "本地Git操作完成！" -ForegroundColor Green

# 远程服务器信息
$serverIP = "47.107.84.24"
$serverUser = "root"
$serverPath = "/root/ZDLT"

Write-Host "4. 尝试连接远程服务器..." -ForegroundColor Cyan
Write-Host "服务器: $serverUser@$serverIP" -ForegroundColor Gray

# 尝试SSH连接
$sshSuccess = $false

Write-Host "5. 尝试SSH密钥连接..." -ForegroundColor Cyan
try {
    $result = ssh $serverUser@$serverIP "cd $serverPath; git pull" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "远程git pull完成" -ForegroundColor Green
        $sshSuccess = $true
    } else {
        Write-Host "SSH连接失败" -ForegroundColor Yellow
    }
} catch {
    Write-Host "SSH连接异常: $($_.Exception.Message)" -ForegroundColor Yellow
}

# 如果SSH失败，提供手动操作指导
if (-not $sshSuccess) {
    Write-Host "=== SSH连接失败 ===" -ForegroundColor Red
    Write-Host "请手动执行以下命令:" -ForegroundColor Yellow
    Write-Host "ssh root@47.107.84.24" -ForegroundColor Cyan
    Write-Host "cd /root/ZDLT" -ForegroundColor Cyan
    Write-Host "git pull" -ForegroundColor Cyan
    Write-Host "" -ForegroundColor White
    Write-Host "或者使用单行命令:" -ForegroundColor Yellow
    Write-Host "ssh root@47.107.84.24 'cd /root/ZDLT; git pull'" -ForegroundColor Cyan
    Write-Host "" -ForegroundColor White
    Write-Host "或者配置SSH密钥认证以启用自动连接" -ForegroundColor Yellow
}

Write-Host "=== 操作完成 ===" -ForegroundColor Green
Write-Host "提交信息: $msg" -ForegroundColor Yellow

Write-Host "按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 