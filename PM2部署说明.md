# ZDLT PM2 部署说明

## 文件说明

- `ecosystem.config.js` - PM2 配置文件
- `start-pm2.bat` - Windows 启动脚本
- `start-pm2.sh` - Linux 服务器启动脚本
- `pm2-manager.bat` - Windows 管理工具
- `pm2-manager.sh` - Linux 服务器管理工具

## 本地开发环境（Windows）

### 1. 启动服务
```bash
# 方法1：使用启动脚本
start-pm2.bat

# 方法2：直接使用PM2命令
pm2 start ecosystem.config.js --env production
```

### 2. 管理服务
```bash
# 使用管理工具
pm2-manager.bat

# 或直接使用PM2命令
pm2 status          # 查看状态
pm2 logs zdlt-backend    # 查看日志
pm2 restart zdlt-backend # 重启服务
pm2 stop zdlt-backend    # 停止服务
pm2 delete zdlt-backend  # 删除服务
```

## 服务器部署（Linux）

### 1. 上传文件到服务器
```bash
# 上传项目文件到服务器
scp -r ./ root@your-server:/root/ZDLT/
```

### 2. 在服务器上安装依赖
```bash
cd /root/ZDLT
npm install
```

### 3. 启动服务
```bash
# 给脚本添加执行权限
chmod +x start-pm2.sh
chmod +x pm2-manager.sh

# 启动服务
./start-pm2.sh
```

### 4. 管理服务
```bash
# 使用管理工具
./pm2-manager.sh

# 或直接使用PM2命令
pm2 status
pm2 logs zdlt-backend
pm2 restart zdlt-backend
pm2 stop zdlt-backend
pm2 delete zdlt-backend
```

## 常用PM2命令

### 基础命令
```bash
pm2 start ecosystem.config.js    # 启动服务
pm2 stop zdlt-backend           # 停止服务
pm2 restart zdlt-backend        # 重启服务
pm2 delete zdlt-backend         # 删除服务
pm2 status                      # 查看所有服务状态
pm2 logs zdlt-backend           # 查看服务日志
pm2 monit                       # 打开监控面板
```

### 配置管理
```bash
pm2 save                        # 保存当前配置
pm2 startup                     # 设置开机自启
pm2 resurrect                   # 恢复保存的配置
```

### 日志管理
```bash
pm2 logs zdlt-backend --lines 100  # 查看最近100行日志
pm2 flush                        # 清空所有日志
pm2 reloadLogs                   # 重新加载日志
```

## 配置文件说明

### ecosystem.config.js 配置项
- `name`: 服务名称
- `script`: 启动脚本路径
- `cwd`: 工作目录
- `instances`: 实例数量（1表示单实例）
- `autorestart`: 自动重启
- `watch`: 文件监听（false表示不监听）
- `max_memory_restart`: 内存超限重启（1G）
- `env`: 环境变量
- `error_file`: 错误日志文件
- `out_file`: 输出日志文件
- `log_file`: 合并日志文件

## 故障排除

### 1. 服务启动失败
```bash
# 查看详细错误信息
pm2 logs zdlt-backend --err

# 检查端口是否被占用
netstat -tulpn | grep :3000
```

### 2. 内存不足
```bash
# 查看内存使用情况
pm2 show zdlt-backend

# 调整内存限制（在ecosystem.config.js中修改max_memory_restart）
```

### 3. 日志文件过大
```bash
# 清空日志
pm2 flush

# 或手动删除日志文件
rm logs/*.log
```

## 监控和性能

### 1. 实时监控
```bash
pm2 monit
```

### 2. 性能指标
```bash
pm2 show zdlt-backend
```

### 3. 系统资源
```bash
pm2 status
```

## 安全建议

1. **防火墙配置**
   ```bash
   # 只开放必要端口
   ufw allow 3000
   ufw allow 80
   ufw allow 443
   ```

2. **日志轮转**
   ```bash
   # 设置日志轮转（在ecosystem.config.js中添加）
   log_rotate_interval: '1d'
   log_rotate_max_size: '10M'
   ```

3. **环境变量**
   - 敏感信息使用环境变量
   - 不要硬编码API密钥

## 备份和恢复

### 1. 备份配置
```bash
pm2 save
cp ~/.pm2/dump.pm2 backup-dump.pm2
```

### 2. 恢复配置
```bash
pm2 resurrect
```

## 更新部署

### 1. 代码更新
```bash
git pull
npm install
pm2 restart zdlt-backend
```

### 2. 配置更新
```bash
# 修改ecosystem.config.js后
pm2 reload ecosystem.config.js
``` 