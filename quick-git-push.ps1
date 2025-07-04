# PowerShell script for auto git push and remote pull

# Get current date and time
$date = Get-Date -Format "yyyy-MM-dd"
$time = Get-Date -Format "HH:mm"
$msg = "auto commit: $date $time"

# Git operations
git add .
git commit -m $msg
git push

# SSH connection with password
$serverIP = "47.107.84.24"
$serverUser = "root"
$serverPath = "/root/ZDLT"
$password = "ZDLT@20250702"

# Create SSH session
$sshSession = New-PSSession -HostName $serverIP -UserName $serverUser -Password (ConvertTo-SecureString $password -AsPlainText -Force)

# Execute remote command
Invoke-Command -Session $sshSession -ScriptBlock {
    param($path)
    cd $path
    git pull
} -ArgumentList $serverPath

# Clean up
Remove-PSSession $sshSession

Write-Host "Local commit and push to GitHub done. Remote git pull completed: $msg" 