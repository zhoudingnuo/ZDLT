# 自动Git更新 - 使用PowerShell自动输入密码

Write-Host "=== 自动Git更新工具 ===" -ForegroundColor Green

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

# 远程服务器信息
$serverIP = "47.107.84.24"
$serverUser = "root"
$serverPath = "/root/ZDLT"
$password = "ZDLT@20250702"

Write-Host "4. 尝试自动SSH连接..." -ForegroundColor Cyan

# 方法1: 使用plink (PuTTY的命令行版本)
try {
    Write-Host "尝试使用plink..." -ForegroundColor Yellow
    $plinkCmd = "echo $password | plink -ssh $serverUser@$serverIP -pw $password 'cd $serverPath; git pull'"
    $result = cmd /c $plinkCmd 2>&1
    Write-Host "远程更新成功！" -ForegroundColor Green
} catch {
    Write-Host "plink不可用，尝试其他方法..." -ForegroundColor Yellow
    
    # 方法2: 使用PowerShell的Start-Process
    try {
        Write-Host "尝试使用PowerShell Start-Process..." -ForegroundColor Yellow
        $sshProcess = Start-Process -FilePath "ssh" -ArgumentList "$serverUser@$serverIP", "cd $serverPath; git pull" -NoNewWindow -Wait -PassThru -RedirectStandardError "ssh_error.log" -RedirectStandardOutput "ssh_output.log"
        
        if ($sshProcess.ExitCode -eq 0) {
            Write-Host "远程更新成功！" -ForegroundColor Green
        } else {
            Write-Host "远程更新失败，请手动执行:" -ForegroundColor Red
            Write-Host "ssh root@47.107.84.24" -ForegroundColor Yellow
            Write-Host "cd /root/ZDLT" -ForegroundColor Yellow
            Write-Host "git pull" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "所有自动方法都失败，请手动执行:" -ForegroundColor Red
        Write-Host "ssh root@47.107.84.24" -ForegroundColor Yellow
        Write-Host "cd /root/ZDLT" -ForegroundColor Yellow
        Write-Host "git pull" -ForegroundColor Yellow
    }
}

Write-Host "=== 完成 ===" -ForegroundColor Green
Write-Host "按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 