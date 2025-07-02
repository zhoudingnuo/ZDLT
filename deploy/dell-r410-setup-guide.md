# Dell R410服务器重装系统与部署指南

## 服务器硬件信息

### Dell PowerEdge R410 规格
- **处理器**: 支持Intel Xeon 5500/5600系列
- **内存**: 支持DDR3 ECC内存，最大32GB
- **存储**: 支持SAS/SATA硬盘，最多4个3.5寸硬盘
- **网络**: 集成双千兆网卡
- **管理**: iDRAC6远程管理卡

## 重装系统前的准备工作

### 1. 硬件检查
```bash
# 检查硬件状态
- 确认所有硬盘工作正常
- 检查内存条安装正确
- 确认网卡连接正常
- 检查电源供应稳定
```

### 2. 数据备份
```bash
# 重要数据备份
- 备份重要配置文件
- 备份数据库（如有）
- 备份用户数据
- 记录当前网络配置
```

### 3. 准备安装介质
- **U盘启动盘**（推荐）
- **光盘安装**（如果服务器有光驱）
- **网络安装**（PXE启动）

## 系统选择建议

### 推荐系统
1. **Ubuntu Server 22.04 LTS** - 推荐用于Web服务器
2. **CentOS 7** - 稳定可靠，适合企业环境
3. **Windows Server 2019** - 如果需要Windows环境

### 系统选择对比
| 系统 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| Ubuntu Server | 免费、社区支持好、包管理方便 | 企业支持相对较少 | Web服务器、开发环境 |
| CentOS 7 | 稳定、企业级支持 | 2024年停止支持 | 传统企业环境 |
| Windows Server | 图形界面、易管理 | 授权费用高 | Windows应用环境 |

## 重装系统步骤

### 方法一：U盘安装（推荐）

#### 1. 制作启动U盘
```bash
# 下载系统镜像
# Ubuntu Server: https://ubuntu.com/download/server
# CentOS: https://www.centos.org/download/

# 使用Rufus制作启动U盘
# 1. 下载Rufus: https://rufus.ie/
# 2. 插入U盘（8GB以上）
# 3. 选择系统镜像文件
# 4. 选择U盘设备
# 5. 点击开始制作
```

#### 2. 设置BIOS启动
```bash
# 开机时按F2进入BIOS
# 1. 找到Boot Settings
# 2. 将USB设备设为第一启动项
# 3. 保存并退出
```

#### 3. 安装系统
```bash
# 插入U盘，重启服务器
# 1. 选择语言和键盘布局
# 2. 选择安装类型（推荐最小安装）
# 3. 配置网络（建议配置静态IP）
# 4. 设置主机名和域名
# 5. 创建管理员账户
# 6. 选择磁盘分区方案
# 7. 开始安装
```

### 方法二：iDRAC远程安装

#### 1. 配置iDRAC
```bash
# 开机时按Ctrl+E进入iDRAC配置
# 1. 设置iDRAC IP地址
# 2. 配置用户名和密码
# 3. 启用Web界面
```

#### 2. 远程安装
```bash
# 1. 通过浏览器访问iDRAC IP
# 2. 登录iDRAC管理界面
# 3. 选择虚拟控制台
# 4. 挂载ISO镜像
# 5. 远程安装系统
```

## 系统安装后配置

### 1. 基础系统配置
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y  # Ubuntu
sudo yum update -y  # CentOS

# 安装基础工具
sudo apt install -y curl wget git vim htop  # Ubuntu
sudo yum install -y curl wget git vim htop  # CentOS
```

### 2. 网络配置
```bash
# 配置静态IP（推荐）
sudo nano /etc/netplan/01-netcfg.yaml  # Ubuntu
sudo nano /etc/sysconfig/network-scripts/ifcfg-eth0  # CentOS

# 示例配置
network:
  version: 2
  ethernets:
    eth0:
      addresses:
        - 192.168.1.100/24
      gateway4: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 8.8.4.4]
```

### 3. 安全配置
```bash
# 配置防火墙
sudo ufw enable  # Ubuntu
sudo systemctl enable firewalld  # CentOS

# 开放必要端口
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw allow 5000  # 后端API
sudo ufw allow 31001 # 前端服务
```

## 部署智大蓝图应用

### 1. 安装Node.js环境
```bash
# Ubuntu系统
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS系统
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# 验证安装
node --version
npm --version
```

### 2. 安装PM2进程管理器
```bash
sudo npm install -g pm2
```

### 3. 安装Nginx
```bash
# Ubuntu
sudo apt update
sudo apt install nginx

# CentOS
sudo yum install epel-release
sudo yum install nginx

# 启动Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 4. 部署应用
```bash
# 上传项目文件
# 方法1: 使用scp
scp -r ./OT root@your-server-ip:/var/www/

# 方法2: 使用git
cd /var/www
git clone your-repository-url OT

# 安装依赖
cd /var/www/OT/backend
npm install

cd /var/www/OT/frontend
npm install
npm run build
```

### 5. 配置PM2启动脚本
```bash
# 创建PM2配置文件
cat > /var/www/OT/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'zeta-vista-backend',
      script: './backend/app.js',
      cwd: '/var/www/OT',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
EOF

# 启动服务
cd /var/www/OT
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 6. 配置Nginx反向代理
```bash
# 创建Nginx配置文件
sudo nano /etc/nginx/sites-available/zeta-vista
```

配置文件内容：
```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为您的域名或IP

    # 前端静态文件
    location / {
        root /var/www/OT/frontend/build;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # 后端API代理
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# 启用站点
sudo ln -s /etc/nginx/sites-available/zeta-vista /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 性能优化

### 1. 系统优化
```bash
# 调整文件描述符限制
echo "* soft nofile 65536" >> /etc/security/limits.conf
echo "* hard nofile 65536" >> /etc/security/limits.conf

# 优化内核参数
echo "net.core.somaxconn = 65535" >> /etc/sysctl.conf
echo "net.ipv4.tcp_max_syn_backlog = 65535" >> /etc/sysctl.conf
sysctl -p
```

### 2. Nginx优化
```bash
# 在nginx.conf中添加
worker_processes auto;
worker_connections 1024;
keepalive_timeout 65;
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### 3. Node.js优化
```bash
# 在PM2配置中添加
max_memory_restart: '1G',
node_args: '--max-old-space-size=1024'
```

## 监控和维护

### 1. 系统监控
```bash
# 安装监控工具
sudo apt install -y htop iotop nethogs  # Ubuntu
sudo yum install -y htop iotop nethogs  # CentOS

# 查看系统状态
htop
df -h
free -h
```

### 2. 日志管理
```bash
# 配置日志轮转
sudo nano /etc/logrotate.d/zeta-vista

# 日志轮转配置
/var/www/OT/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 root root
}
```

### 3. 备份策略
```bash
# 创建备份脚本
cat > /var/www/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup"
mkdir -p $BACKUP_DIR

# 备份应用文件
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /var/www/OT

# 备份配置文件
tar -czf $BACKUP_DIR/config_$DATE.tar.gz /etc/nginx

# 删除7天前的备份
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
EOF

chmod +x /var/www/backup.sh

# 添加到定时任务
echo "0 2 * * * /var/www/backup.sh" | crontab -
```

## 故障排除

### 1. 常见问题
```bash
# 服务无法启动
pm2 logs zeta-vista-backend
sudo systemctl status nginx

# 端口被占用
netstat -tulpn | grep :5000
netstat -tulpn | grep :80

# 权限问题
sudo chown -R www-data:www-data /var/www/OT
sudo chmod -R 755 /var/www/OT
```

### 2. 性能问题
```bash
# 查看CPU使用率
top
htop

# 查看内存使用
free -h
cat /proc/meminfo

# 查看磁盘使用
df -h
iostat -x 1
```

## 安全建议

### 1. 基础安全
```bash
# 更改默认SSH端口
sudo nano /etc/ssh/sshd_config
# 修改 Port 22 为其他端口

# 禁用root登录
# 在sshd_config中设置 PermitRootLogin no

# 重启SSH服务
sudo systemctl restart sshd
```

### 2. 防火墙配置
```bash
# 只开放必要端口
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 3. 定期更新
```bash
# 设置自动更新
sudo apt install unattended-upgrades  # Ubuntu
sudo yum install yum-cron  # CentOS

# 配置自动更新
sudo dpkg-reconfigure unattended-upgrades
```

## 成本估算

### 硬件成本
- Dell R410服务器：已拥有
- 硬盘升级（如需要）：$100-500
- 内存升级（如需要）：$50-200

### 软件成本
- Ubuntu Server：免费
- CentOS：免费
- Windows Server：$500-1000/年

### 维护成本
- 电费：$50-100/月
- 网络带宽：$20-100/月
- 域名和SSL：$10-50/年

## 总结

Dell R410是一款性能不错的服务器，适合部署智大蓝图应用。建议：

1. **选择Ubuntu Server 22.04 LTS**作为操作系统
2. **使用U盘安装**，简单可靠
3. **配置静态IP**，便于管理
4. **使用PM2管理Node.js应用**
5. **配置Nginx反向代理**
6. **定期备份和监控**

按照本指南操作，您就可以成功在Dell R410上部署智大蓝图应用了！ 