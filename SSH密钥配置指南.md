# SSH密钥配置指南

## 目标
配置SSH密钥认证，实现无密码自动连接远程服务器。

## 步骤

### 1. 生成SSH密钥对
在本地电脑上执行：
```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```
- 按回车接受默认路径
- 密码可以留空（直接回车）

### 2. 复制公钥到服务器
```bash
# 方法1：使用ssh-copy-id（推荐）
ssh-copy-id root@47.107.84.24

# 方法2：手动复制
cat ~/.ssh/id_rsa.pub | ssh root@47.107.84.24 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### 3. 测试连接
```bash
ssh root@47.107.84.24
```
如果成功，说明密钥配置完成。

### 4. 使用无密码脚本
现在可以使用 `一键更新-无密码.bat` 脚本，无需手动输入密码。

## 故障排除

### 如果连接失败：
1. 检查密钥文件是否存在：
   ```bash
   ls -la ~/.ssh/
   ```

2. 检查服务器上的authorized_keys文件：
   ```bash
   ssh root@47.107.84.24 "cat ~/.ssh/authorized_keys"
   ```

3. 检查SSH服务配置：
   ```bash
   ssh root@47.107.84.24 "grep -i pubkey /etc/ssh/sshd_config"
   ```

### Windows用户注意事项：
1. 确保Git Bash或WSL已安装
2. 在Git Bash中执行上述命令
3. 密钥文件位置：`C:\Users\用户名\.ssh\`

## 安全建议
- 定期更换密钥对
- 使用强密码保护私钥
- 限制服务器访问权限 