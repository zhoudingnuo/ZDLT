# 智大蓝图 - 部署文档

本目录包含智大蓝图AI智能体聚合平台的所有部署相关文档和工具。

## 📁 文件说明

### 部署指南文档
- **`oray-guide.md`** - 花生壳内网穿透部署指南
  - 适合：国内用户，个人项目
  - 包含：花生壳配置、映射设置、故障排除
  - 成本：免费-¥999/年

- **`deploy-guide.md`** - 云服务器部署完整指南
  - 适合：有服务器运维经验的用户
  - 包含：环境配置、Nginx设置、SSL证书、性能优化
  - 成本：$20-100/月

- **`cloud-platform-guide.md`** - 云平台部署指南
  - 适合：新手用户，个人项目
  - 包含：Vercel、Railway、Netlify、Heroku等平台部署
  - 成本：$5-25/月

- **`ngrok-guide.md`** - ngrok内网穿透部署指南
  - 适合：快速测试、临时演示
  - 包含：ngrok、frp、花生壳等工具使用
  - 成本：免费

- **`dell-r410-setup-guide.md`** - Dell R410服务器专用指南
  - 适合：拥有Dell R410服务器的用户
  - 包含：系统重装、硬件配置、性能优化
  - 成本：硬件成本 + 维护费用

### 部署工具
- **`quick-deploy.bat`** - 快速部署脚本
  - 交互式部署工具
  - 支持多种部署方式选择
  - 自动配置和启动服务

- **`start-oray.bat`** - 花生壳一键启动脚本
  - 专门针对花生壳内网穿透
  - 自动启动前后端服务
  - 提供映射配置指导

- **`dell-r410-setup.bat`** - Dell R410服务器重装助手
  - 专门针对Dell R410服务器
  - 系统重装指导
  - 硬件配置建议

## 🚀 快速开始

### 0. 一键配置启动（本地开发）

在开始部署之前，建议先使用一键配置脚本启动本地服务：

#### 方式一：CMD批处理脚本（最兼容）
```bash
# 在项目根目录双击运行
start-all-cn.cmd
```

#### 方式二：PowerShell脚本（推荐）
```bash
# 右键选择"使用PowerShell运行"
start-all-cn.ps1
```

#### 方式三：传统批处理脚本
```bash
# 双击运行
start-all-cn.bat
```

**启动后访问地址：**
- 前端: http://localhost:31001
- 后端: http://localhost:5000

### 1. 选择部署方式

根据您的需求和硬件条件选择合适的部署方式：

| 部署方式 | 适用场景 | 难度 | 成本 | 推荐指数 |
|---------|---------|------|------|----------|
| **花生壳** | **国内用户、个人项目** | ⭐⭐ | **免费-¥999/年** | ⭐⭐⭐⭐⭐ |
| 内网穿透(ngrok) | 快速测试、临时演示 | ⭐ | 免费 | ⭐⭐⭐⭐ |
| 云平台 | 个人项目、小型应用 | ⭐⭐ | $5-25/月 | ⭐⭐⭐⭐ |
| 云服务器 | 商业应用、大型项目 | ⭐⭐⭐⭐ | $20-100/月 | ⭐⭐⭐⭐⭐ |
| Dell R410 | 自有服务器、企业环境 | ⭐⭐⭐ | 硬件成本 | ⭐⭐⭐⭐⭐ |

### 2. 运行快速部署工具

```bash
# Windows系统
双击 quick-deploy.bat

# 或命令行执行
./quick-deploy.bat
```

### 3. 花生壳用户专用

如果您选择花生壳内网穿透：

```bash
# 运行花生壳专用启动脚本
双击 start-oray.bat

# 或命令行执行
./start-oray.bat
```

### 4. Dell R410服务器用户

如果您拥有Dell R410服务器：

```bash
# 运行Dell R410专用助手
双击 dell-r410-setup.bat

# 或命令行执行
./dell-r410-setup.bat
```

### 5. 按提示操作

工具会引导您完成：
- 部署方式选择
- 环境检查
- 配置文件生成
- 服务启动
- 访问地址获取

## 📋 部署检查清单

### 基础配置
- [ ] Node.js环境已安装
- [ ] 项目依赖已安装
- [ ] 环境变量配置正确
- [ ] API地址更新为生产环境
- [ ] CORS配置允许生产域名

### 花生壳配置
- [ ] 花生壳账号已注册
- [ ] 客户端已安装并登录
- [ ] 后端映射配置正确 (127.0.0.1:5000)
- [ ] 前端映射配置正确 (127.0.0.1:31001)
- [ ] 外网地址已获取并测试

### 硬件配置（Dell R410）
- [ ] 服务器硬件检查正常
- [ ] 内存配置充足（建议8GB以上）
- [ ] 硬盘空间充足（建议100GB以上）
- [ ] 网络连接稳定
- [ ] 电源供应稳定

### 安全配置
- [ ] HTTPS证书配置
- [ ] 防火墙规则设置
- [ ] API密钥安全存储
- [ ] 访问日志监控
- [ ] 定期安全更新

### 性能优化
- [ ] 静态资源压缩
- [ ] CDN配置
- [ ] 缓存策略设置
- [ ] 数据库优化（如有）
- [ ] 监控告警配置

## 🔧 常见问题

### Q: 哪种部署方式最适合我？
**A:** 
- **国内用户**：推荐花生壳（免费、稳定、速度快）
- 新手用户：推荐云平台部署（Vercel + Railway）
- 快速测试：使用内网穿透（ngrok）
- 商业项目：选择云服务器部署
- **拥有Dell R410：使用专用指南部署**

### Q: 花生壳免费版有什么限制？
**A:** 
- 映射数量：2个
- 带宽限制：1Mbps
- 连接数：100个
- 域名：随机分配
- 价格：免费

### Q: 花生壳配置映射时需要注意什么？
**A:** 
1. **应用名称**：建议使用有意义的名称
2. **内网主机**：使用127.0.0.1
3. **内网端口**：确保与本地服务端口一致
4. **协议类型**：选择HTTP
5. **外网端口**：建议使用自动分配

### Q: 部署后无法访问怎么办？
**A:** 
1. 检查服务是否正常启动
2. 确认端口是否开放
3. 查看防火墙设置
4. 检查域名解析配置
5. **花生壳用户**：检查客户端状态和映射配置
6. **Dell R410用户**：检查iDRAC配置

### Q: 如何更新已部署的应用？
**A:** 
- 云平台：推送代码到GitHub自动部署
- 云服务器：使用PM2重启服务
- 内网穿透：重新启动隧道
- **花生壳**：重启本地服务，映射自动生效
- **Dell R410**：通过SSH连接更新

### Q: 部署成本大概是多少？
**A:** 
- 花生壳：免费-¥999/年
- 内网穿透：免费
- 云平台：$5-25/月
- 云服务器：$20-100/月
- **Dell R410**：硬件成本 + 电费 + 网络费用

## 🌐 花生壳专用

### 优势特点
- **国内服务**：服务器在国内，访问速度快
- **稳定可靠**：服务稳定性好，支持率高
- **简单易用**：图形化界面，配置简单
- **免费额度**：提供免费版本，满足基本需求
- **技术支持**：中文客服支持

### 配置步骤
1. **注册账号**：访问 [花生壳官网](https://www.oray.com/)
2. **下载客户端**：从官网下载Windows版本
3. **安装登录**：安装客户端并使用账号登录
4. **配置映射**：添加后端和前端映射
5. **获取地址**：获得外网访问地址
6. **修改配置**：更新前端API地址

### 推荐配置
- **后端映射**：127.0.0.1:5000 → HTTP
- **前端映射**：127.0.0.1:31001 → HTTP
- **协议类型**：HTTP
- **外网端口**：自动分配
- **域名设置**：免费版随机分配

## 🖥️ Dell R410服务器专用

### 硬件规格
- **处理器**: Intel Xeon 5500/5600系列
- **内存**: 支持DDR3 ECC，最大32GB
- **存储**: 支持SAS/SATA，最多4个3.5寸硬盘
- **网络**: 集成双千兆网卡
- **管理**: iDRAC6远程管理卡

### 推荐配置
- **操作系统**: Ubuntu Server 22.04 LTS
- **内存**: 8GB以上
- **硬盘**: 100GB以上可用空间
- **网络**: 静态IP配置
- **管理**: 启用iDRAC远程管理

### 部署优势
- **完全控制**: 硬件和软件完全自主
- **成本可控**: 一次性硬件投入
- **性能稳定**: 企业级硬件保障
- **扩展性强**: 支持硬件升级
- **安全性高**: 数据本地存储

## 📞 技术支持

如果您在部署过程中遇到问题：

1. **查看详细文档** - 阅读对应的部署指南
2. **检查错误日志** - 查看控制台输出
3. **搜索常见问题** - 参考故障排除章节
4. **提交Issue** - 在项目仓库提交问题
5. **花生壳用户** - 参考专用指南或联系客服
6. **Dell R410用户** - 参考专用指南和硬件手册

## 🔄 更新日志

### v1.2.2 (2024-12-27)
- 新增花生壳内网穿透专用指南
- 添加花生壳一键启动脚本
- 优化快速部署工具，增加花生壳选项
- 完善部署文档结构

### v1.2.1 (2024-12-27)
- 新增Dell R410服务器专用指南
- 添加硬件重装系统助手
- 完善服务器部署文档
- 优化部署流程

### v1.2.0 (2024-12-27)
- 新增多种部署方案
- 提供快速部署工具
- 完善部署文档
- 优化部署流程

### v1.1.0 (2024-12-20)
- 添加局域网访问支持
- 配置CORS跨域访问
- 优化启动脚本

### v1.0.0 (2024-12-15)
- 初始版本发布
- 基础部署支持

## 📚 相关链接

- [项目主页](../README.md)
- [网络访问配置](../网络访问配置说明.md)
- [API文档](../backend/README.md)
- [前端文档](../frontend/README.md)
- [花生壳官网](https://www.oray.com/)
- [Dell R410硬件手册](https://www.dell.com/support/home/en-us/product-support/product/poweredge-r410/docs)

---

**注意**: 部署前请确保您已阅读并理解相关文档，选择合适的部署方式。花生壳用户请特别注意映射配置，Dell R410用户请特别注意硬件配置和系统重装步骤。如有疑问，请参考详细指南或寻求技术支持。 