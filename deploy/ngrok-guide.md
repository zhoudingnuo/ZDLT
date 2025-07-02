# 内网穿透部署指南

## 方法一：使用ngrok（推荐）

### 1. 安装ngrok

#### Windows安装
```bash
# 下载ngrok
# 访问 https://ngrok.com/download
# 下载Windows版本并解压到C:\ngrok

# 添加到系统PATH
# 将C:\ngrok添加到系统环境变量PATH中
```

#### 注册账号获取token
1. 访问 [ngrok.com](https://ngrok.com)
2. 注册免费账号
3. 获取authtoken
4. 配置token：
```bash
ngrok config add-authtoken YOUR_TOKEN_HERE
```

### 2. 启动内网穿透

#### 启动后端服务
```bash
# 先启动后端服务
cd backend
npm start
```

#### 启动ngrok隧道
```bash
# 为后端API创建隧道
ngrok http 5000

# 为前端服务创建隧道
ngrok http 31001
```

### 3. 配置前端代理

#### 修改前端API地址
```bash
# 在frontend/src/App.jsx中修改API地址
# 将localhost:5000替换为ngrok提供的域名
const API_BASE_URL = 'https://your-ngrok-domain.ngrok.io';
```

#### 或者使用环境变量
```bash
# 创建.env文件
echo "REACT_APP_API_URL=https://your-ngrok-domain.ngrok.io" > frontend/.env
```

### 4. 访问外网地址

ngrok会提供类似以下的外网地址：
- 后端API: `https://abc123.ngrok.io`
- 前端应用: `https://def456.ngrok.io`

## 方法二：使用frp（免费开源）

### 1. 服务器端配置

#### 下载frp
```bash
# 下载frp
wget https://github.com/fatedier/frp/releases/download/v0.51.3/frp_0.51.3_linux_amd64.tar.gz
tar -zxvf frp_0.51.3_linux_amd64.tar.gz
cd frp_0.51.3_linux_amd64
```

#### 配置frps.ini（服务器端）
```ini
[common]
bind_port = 7000
dashboard_port = 7500
dashboard_user = admin
dashboard_pwd = admin123
token = your_token_here
```

#### 启动frps
```bash
./frps -c frps.ini
```

### 2. 客户端配置

#### 下载frp客户端
```bash
# Windows下载
# 访问 https://github.com/fatedier/frp/releases
# 下载Windows版本
```

#### 配置frpc.ini（客户端）
```ini
[common]
server_addr = your_server_ip
server_port = 7000
token = your_token_here

[zeta-vista-backend]
type = tcp
local_ip = 127.0.0.1
local_port = 5000
remote_port = 5000

[zeta-vista-frontend]
type = tcp
local_ip = 127.0.0.1
local_port = 31001
remote_port = 31001
```

#### 启动frpc
```bash
./frpc -c frpc.ini
```

## 方法三：使用花生壳

### 1. 注册花生壳账号
1. 访问 [oray.com](https://www.oray.com)
2. 注册免费账号
3. 下载花生壳客户端

### 2. 配置内网穿透
1. 安装花生壳客户端
2. 登录账号
3. 添加内网穿透映射：
   - 应用名称：智大蓝图后端
   - 内网主机：127.0.0.1
   - 内网端口：5000
   - 外网端口：自动分配

### 3. 访问外网地址
花生壳会提供类似以下的外网地址：
- `http://your-app-name.vicp.net:port`

## 方法四：使用natapp

### 1. 注册natapp账号
1. 访问 [natapp.cn](https://natapp.cn)
2. 注册免费账号
3. 购买免费隧道

### 2. 下载配置
1. 下载natapp客户端
2. 获取authtoken
3. 配置隧道信息

### 3. 启动隧道
```bash
# 启动natapp
./natapp -authtoken=your_token_here
```

## 安全注意事项

### 1. 访问控制
```bash
# 设置访问密码
# 在ngrok中可以使用basic auth
ngrok http 5000 --basic-auth="username:password"
```

### 2. 限制访问
```bash
# 只允许特定IP访问
# 在服务器防火墙中配置
```

### 3. 监控访问
- 定期查看访问日志
- 监控异常访问
- 设置访问告警

## 性能优化

### 1. 带宽优化
- 启用gzip压缩
- 优化图片大小
- 使用CDN加速

### 2. 连接优化
- 使用keep-alive连接
- 配置连接池
- 优化数据库查询

## 故障排除

### 1. 连接失败
```bash
# 检查服务是否启动
netstat -ano | findstr :5000
netstat -ano | findstr :31001

# 检查防火墙设置
# 确保端口未被阻止
```

### 2. 域名无法访问
- 检查ngrok隧道状态
- 确认authtoken正确
- 检查网络连接

### 3. API请求失败
- 检查CORS配置
- 确认API地址正确
- 查看浏览器控制台错误

## 成本对比

### ngrok免费版
- 优点：简单易用，无需服务器
- 缺点：域名随机，连接数限制
- 成本：免费

### frp
- 优点：完全免费，可自定义域名
- 缺点：需要服务器
- 成本：服务器费用

### 花生壳
- 优点：稳定可靠，有免费额度
- 缺点：免费版限制较多
- 成本：免费版可用

### natapp
- 优点：国内服务，速度快
- 缺点：免费版限制
- 成本：免费版可用

## 推荐方案

### 临时测试：ngrok
- 适合快速测试和演示
- 无需配置，即开即用

### 长期使用：frp
- 完全免费，功能强大
- 需要一台服务器

### 商业使用：云服务器
- 稳定可靠，性能好
- 成本较高但值得投资 