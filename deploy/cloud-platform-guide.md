# 云平台部署指南

## 方法一：Vercel + Railway（推荐新手）

### 1. 前端部署到Vercel

#### 准备前端项目
```bash
# 修改前端API地址
cd frontend
# 创建环境变量文件
echo "REACT_APP_API_URL=https://your-backend-domain.com" > .env.production
```

#### 部署步骤
1. 注册 [Vercel](https://vercel.com) 账号
2. 连接GitHub仓库
3. 选择frontend目录
4. 配置环境变量：
   - `REACT_APP_API_URL`: 后端API地址
5. 点击部署

### 2. 后端部署到Railway

#### 准备后端项目
```bash
# 创建Procfile
echo "web: node app.js" > backend/Procfile

# 创建package.json脚本
# 在backend/package.json中添加：
# "scripts": {
#   "start": "node app.js"
# }
```

#### 部署步骤
1. 注册 [Railway](https://railway.app) 账号
2. 连接GitHub仓库
3. 选择backend目录
4. 配置环境变量：
   - `PORT`: 5000
   - `NODE_ENV`: production
5. 点击部署

## 方法二：Netlify + Heroku

### 1. 前端部署到Netlify

#### 构建配置
```bash
# 创建netlify.toml
cat > frontend/netlify.toml << 'EOF'
[build]
  publish = "build"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOF
```

#### 部署步骤
1. 注册 [Netlify](https://netlify.com) 账号
2. 连接GitHub仓库
3. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `build`
4. 配置环境变量
5. 点击部署

### 2. 后端部署到Heroku

#### 准备Heroku配置
```bash
# 创建Procfile
echo "web: node app.js" > backend/Procfile

# 创建package.json脚本
# 确保package.json中有start脚本
```

#### 部署步骤
1. 注册 [Heroku](https://heroku.com) 账号
2. 安装Heroku CLI
3. 登录并创建应用：
```bash
heroku login
heroku create your-app-name
```
4. 部署应用：
```bash
cd backend
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a your-app-name
git push heroku main
```

## 方法三：阿里云/腾讯云容器服务

### 1. 创建Dockerfile

#### 前端Dockerfile
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 后端Dockerfile
```dockerfile
# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "app.js"]
```

### 2. 部署到容器服务
1. 在阿里云/腾讯云控制台创建容器服务
2. 上传Docker镜像
3. 配置服务端口和域名
4. 启动服务

## 方法四：GitHub Pages + Serverless

### 1. 前端部署到GitHub Pages

#### 配置GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        cd frontend
        npm install
        
    - name: Build
      run: |
        cd frontend
        npm run build
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./frontend/build
```

### 2. 后端部署到Serverless

#### 使用阿里云函数计算
1. 创建函数计算服务
2. 上传后端代码
3. 配置触发器
4. 设置环境变量

## 环境变量配置

### 前端环境变量
```bash
# .env.production
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_ENV=production
```

### 后端环境变量
```bash
# 生产环境变量
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-frontend-domain.com
```

## 域名配置

### 自定义域名设置
1. 购买域名（阿里云、腾讯云等）
2. 配置DNS解析
3. 在云平台配置自定义域名
4. 配置SSL证书

### CDN加速
1. 配置CDN服务
2. 设置缓存规则
3. 配置HTTPS
4. 优化加载速度

## 监控和维护

### 性能监控
- 使用云平台提供的监控服务
- 配置告警规则
- 监控API响应时间
- 监控错误率

### 日志管理
- 配置日志收集
- 设置日志轮转
- 配置错误告警
- 定期分析日志

## 成本估算

### Vercel + Railway
- Vercel: 免费（个人使用）
- Railway: $5-20/月
- 总计: $5-20/月

### Netlify + Heroku
- Netlify: 免费（个人使用）
- Heroku: $7-25/月
- 总计: $7-25/月

### 云服务器
- 阿里云/腾讯云: $20-100/月
- 域名: $10-50/年
- 总计: $20-100/月 