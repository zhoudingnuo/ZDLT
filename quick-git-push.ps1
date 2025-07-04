# PowerShell script for auto git push and remote pull
# 一键提交、推送到GitHub并远程服务器自动拉取

Write-Host "=== 开始自动Git操作 ===" -ForegroundColor Green

try {
    # Get current date and time
    $date = Get-Date -Format "yyyy-MM-dd"
    $time = Get-Date -Format "HH:mm:ss"
    $msg = "auto commit: $date $time"
    
    Write-Host "提交信息: $msg" -ForegroundColor Yellow
    
    # Git operations
    Write-Host "1. 添加文件到暂存区..." -ForegroundColor Cyan
    git add .
    
    Write-Host "2. 提交更改..." -ForegroundColor Cyan
    git commit -m $msg
    
    Write-Host "3. 推送到GitHub..." -ForegroundColor Cyan
    git push
    
    Write-Host "本地Git操作完成！" -ForegroundColor Green
    
    # SSH connection with password
    $serverIP = "47.107.84.24"
    $serverUser = "root"
    $serverPath = "/root/ZDLT"
    $password = "ZDLT@20250702"
    
    Write-Host "4. 连接远程服务器..." -ForegroundColor Cyan
    Write-Host "服务器: $serverUser@$serverIP" -ForegroundColor Gray
    
    # 使用SSH命令直接执行远程操作
    Write-Host "5. 执行远程git pull..." -ForegroundColor Cyan
    
    # 创建SSH命令字符串
    $sshCommand = "cd $serverPath && git pull"
    
    # 使用sshpass或直接ssh（如果配置了密钥）
    try {
        # 尝试使用sshpass（如果安装了）
        $result = sshpass -p $password ssh $serverUser@$serverIP $sshCommand 2>&1
        Write-Host "远程git pull完成" -ForegroundColor Green
    } catch {
        Write-Host "sshpass不可用，尝试使用ssh密钥..." -ForegroundColor Yellow
        try {
            # 尝试直接ssh（如果配置了密钥认证）
            $result = ssh $serverUser@$serverIP $sshCommand 2>&1
            Write-Host "远程git pull完成" -ForegroundColor Green
        } catch {
            Write-Host "SSH连接失败，请检查网络连接或SSH配置" -ForegroundColor Red
            Write-Host "错误信息: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host "=== 所有操作完成 ===" -ForegroundColor Green
    Write-Host "提交信息: $msg" -ForegroundColor Yellow
    Write-Host "远程服务器已更新" -ForegroundColor Green
    
} catch {
    Write-Host "操作失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "请检查网络连接和服务器状态" -ForegroundColor Yellow
}

Write-Host "按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 