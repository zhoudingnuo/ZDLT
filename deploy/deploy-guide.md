# 云服务器部署指南

## 1. 服务器环境准备

### 安装Node.js
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

### 安装PM2进程管理器
```bash
sudo npm install -g pm2
```

### 安装Nginx（反向代理）
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install epel-release
sudo yum install nginx
```

## 2. 项目部署

### 上传项目文件
```bash
# 使用scp上传
scp -r ./OT root@your-server-ip:/var/www/

# 或使用git克隆
git clone your-repository-url /var/www/OT
```

### 安装依赖
```bash
cd /var/www/OT/backend
npm install

cd /var/www/OT/frontend
npm install
```

### 构建前端项目
```bash
cd /var/www/OT/frontend
npm run build
```

## 3. 配置PM2启动脚本

### 创建PM2配置文件
```bash
# 创建ecosystem.config.js
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
```

### 启动服务
```bash
cd /var/www/OT
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 4. 配置Nginx反向代理

### 创建Nginx配置文件
```bash
sudo nano /etc/nginx/sites-available/zeta-vista
```

### 配置文件内容
```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为您的域名

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

### 启用站点
```bash
sudo ln -s /etc/nginx/sites-available/zeta-vista /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 5. 域名和SSL配置

### 购买域名
- 在阿里云、腾讯云等平台购买域名
- 将域名解析到服务器IP

### 配置SSL证书（Let's Encrypt）
```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx

# 获取SSL证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo crontab -e
# 添加：0 12 * * * /usr/bin/certbot renew --quiet
```

## 6. 防火墙配置

```bash
# 开放必要端口
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

## 7. 监控和维护

### 查看服务状态
```bash
pm2 status
pm2 logs zeta-vista-backend
```

### 更新部署
```bash
cd /var/www/OT
git pull
cd frontend && npm run build
pm2 restart zeta-vista-backend
```

## 8. 性能优化

### 启用Gzip压缩
在Nginx配置中添加：
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### 配置缓存
```nginx
# 静态资源缓存
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
``` 