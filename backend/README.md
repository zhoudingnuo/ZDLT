# 后端服务说明

## 启动方式
- 只需启动 app.js（Node），端口默认5000。
- 用户API和业务API全部合并，前端和后端各占一个端口。

## 端口映射
- 前端如31001，后端如5000，花生壳只需两条映射。

## API说明
- 所有API统一前缀 /api/
- 用户API：/api/login、/api/register、/api/user/:username、/api/user/usage、/api/user/balance、/api/users
- 业务API：/api/agents、/api/agent/:id/invoke、/api/upload-image 等
- 所有API返回格式：{ success: true/false, data: ..., error: ... }

## 管理员账号
- 启动时自动初始化ZDLT/Administrator2025

## 其它
- 只需维护app.js和userService.js两个主要后端文件。
- 其它历史文件已合并或废弃。

## 项目概述

后端服务为智大蓝图AI智能体聚合平台提供API支持，基于Node.js + Express构建，负责智能体管理和API转发。

## 技术栈

- **Node.js** - JavaScript运行环境
- **Express 4.19.2** - Web应用框架
- **CORS 2.8.5** - 跨域资源共享
- **Axios 1.6.8** - HTTP客户端

## 功能特性

### 核心功能
- **智能体管理** - 读取和管理智能体配置
- **API转发** - 将前端请求转发到对应的智能体API
- **安全控制** - 隐藏敏感信息（如API密钥）
- **错误处理** - 统一的错误响应格式

### 用户管理
- 用户注册、登录、信息查询
- 用户消耗统计（Token和金额）
- 用户余额管理
- 管理员权限控制

### 充值系统
- 手动充值（个人收款码 + 人工审核）
- 充值订单管理
- 管理员充值审核功能
- 用户充值记录查询

### 智能体服务
- 多智能体支持（Dify平台）
- 图片上传和处理
- 文件上传代理
- 工作流参数处理

## 项目结构

```
backend/
├── app.js              # 服务器主文件
├── agents.json         # 智能体配置文件
├── package.json        # 依赖配置
├── package-lock.json   # 依赖锁定文件
├── logo.jpg            # 项目Logo
└── README.md           # 说明文档
```

## API接口

### 用户相关
- `POST /api/login` - 用户登录
- `POST /api/register` - 用户注册
- `GET /api/user/:username` - 查询用户信息
- `POST /api/user/usage` - 更新用户消耗
- `POST /api/user/balance` - 更新用户余额
- `GET /api/users` - 获取所有用户（管理员）

### 充值相关
- `POST /api/pay/manual` - 创建手动充值订单
- `GET /api/pay/manual/status` - 查询充值状态
- `GET /api/admin/recharge-orders` - 获取所有充值订单（管理员）
- `POST /api/admin/recharge-orders/:orderId/approve` - 审核通过充值订单
- `POST /api/admin/recharge-orders/:orderId/reject` - 拒绝充值订单
- `GET /api/user/recharge-orders/:username` - 获取用户充值记录

### 智能体相关
- `GET /api/agents/list` - 获取智能体列表（不包含API密钥）
- `POST /api/agent/:id/invoke` - 调用智能体
- `POST /api/upload-image` - 图片上传
- `POST /api/upload-dify-file` - Dify文件上传

## 充值审核流程

1. **用户发起充值**：用户在前端选择充值金额，系统创建充值订单
2. **管理员审核**：管理员在用户管理界面点击"审核充值"按钮
3. **审核操作**：管理员可以查看所有充值订单，选择通过或拒绝
4. **自动处理**：审核通过后，用户余额自动增加；拒绝后订单状态更新

## 配置说明

### 智能体配置 (agents.json)

每个智能体包含以下字段：

```json
{
  "id": "智能体唯一标识",
  "name": "智能体显示名称",
  "description": "智能体功能描述",
  "apiUrl": "智能体API地址（可配置）",
  "apiKey": "API密钥（敏感信息）",
  "inputs": "输入参数配置",
  "inputType": "输入类型（dialogue/parameter）",
  "status": "状态（pending/review/configured）"
}
```

**API URL配置说明：**
- 支持为每个智能体单独配置API URL
- **如果API URL为空，系统会自动填充默认值**：`http://118.145.74.50:24131/v1/chat-messages`
- 文件上传接口会自动根据智能体的API URL进行适配
- 支持Dify平台的不同服务器地址配置
- 前端界面会自动显示默认值，用户可以直接使用或修改

### 环境配置

- **端口**: 默认5000
- **CORS**: 支持跨域请求
- **日志**: 控制台输出

## 安装与运行

### 安装依赖
```bash
npm install
```

### 启动服务
```bash
npm start
```

### 开发模式
```bash
# 使用nodemon进行开发（需要先安装）
npm install -g nodemon
nodemon app.js
```

## 开发指南

### 添加新智能体

1. 在 `agents.json` 中添加智能体配置：
```json
{
  "id": "new-agent",
  "name": "新智能体",
  "description": "新智能体功能描述",
  "apiUrl": "https://api.example.com/v1/agent",
  "apiKey": "your-api-key"
}
```

2. 重启服务使配置生效

### 错误处理

服务包含统一的错误处理机制：
- 智能体不存在：返回404错误
- API调用失败：返回500错误
- 网络错误：返回相应的HTTP状态码

### 安全考虑

- API密钥不暴露给前端
- 支持CORS配置
- 请求参数验证

## 部署说明

### 生产环境

1. **环境变量配置**
```bash
# 设置端口
PORT=5000

# 设置环境
NODE_ENV=production
```

2. **使用PM2部署**
```bash
npm install -g pm2
pm2 start app.js --name "agent-backend"
```

3. **使用Docker部署**
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

## 更新记录

### 2024-12-19
- **接口重构**：将 `/api/agents` 和 `/api/agents/full` 接口重构为 `/api/agents/list` 接口
- **安全性提升**：新接口返回智能体信息但不包含敏感的API密钥
- **前端适配**：修改前端代码，调用新的 `/api/agents/list` 接口
- **保留核心功能**：保留了智能体调用、文件上传等核心业务接口
- **更新文档**：同步更新了API接口说明文档
- **修复重复接口**：解决了接口重复定义的问题
EXPOSE 5000
CMD ["npm", "start"]
```

### 性能优化

- 启用gzip压缩
- 配置缓存策略
- 使用负载均衡

## 监控与日志

### 日志记录
- 请求日志
- 错误日志

## 更新记录

### 2024-12-27 智能体配置更新

**更新内容：**
- 批量配置了14个智能体的API密钥
- 删除了没有配置的智能体
- 统一使用Dify.ai的API接口
- 为语文课文默写批改添加了工作流参数配置
- 修复了API调用中的Authorization头部问题
- 修正了API URL地址，使用正确的服务器地址
- **新增API URL配置功能**：支持为每个智能体单独配置API URL
- **动态文件上传**：文件上传接口根据智能体配置的API URL自动适配

**API接口更新：**
- 新增 `/api/agents/full` 接口，返回完整的智能体信息（包含API key）
- 保留 `/api/agents` 接口，仅返回显示信息（不包含API key）
- 修复了前端无法获取API key导致调用失败的问题
- 修正所有智能体的API URL为 `http://118.145.74.50:24131/v1/chat-messages`

**配置的智能体列表：**

| 智能体名称 | API Key |
|-----------|---------|
| 单词成歌曲 | app-NeEPfElCVkBZeiaups0X2CGm |
| 音视频成文字 | app-QErgCcqZGAfvaQFi78bWGtla |
| 图生图 | app-YttnuXaJP6VDpqKy7VwvzjPW |
| 高情商回复 | app-OCijB448pfouB8l6oPotVZuI |
| 家长通知 | app-DAkWwoX6O95LqCRPxFhHqrab |
| 数学批改 | app-DAkWwoX6O95LqCRPxFhHqrab |
| 英语课文默写批改 | app-a2bq2coFVbnGAvIEQjYEdpLT |
| 梦想职业 | app-8LnQ7C6jydXAo8gZpvXQHGyN |
| 高中英语作文批改 | app-B7Guaxd4YLAB3oteRHU2B9XE |
| 语文同步作文批改 | app-sONH9FkAijFe5Sdj3vdADJFI |
| 语文作文批改 | app-qsWNlbwazjrrry12OGskZGGt |
| 语文课文默写批改 | app-qsWNlbwazjrrry12OGskZGGt |
| 龙老师-智能问答 | app-OCxoo5VyzwI4YvhugDvZqI65 |
| 智能问答助手 | app-OCxoo5VyzwI4YvhugDvZqI65 |

**工作流功能说明：**

#### 语文课文默写批改工作流
该智能体支持Dify工作流调用，需要以下参数：

1. **im** (文件类型，必填)
   - 学生默写课文的图片文件
   - 支持本地上传
   - 上传后需要包含URL链接

2. **text** (字符串类型，必填)
   - 学生默写课文的题目
   - 用于指定默写内容

3. **mode** (下拉选择，必填)
   - 批改模式选择
   - 选项：开启/关闭

**前端支持：**
- 工作流智能体会显示"配置参数"按钮
- 支持文件上传、文本输入、下拉选择等输入类型
- 参数验证和错误提示
- 统一的参数提交界面
- 添加了调试日志，便于排查问题
- 增强的错误处理，提供详细的网络诊断信息
- 网络诊断工具，帮助检查连接状态
- 智能体状态标识，区分已配置和未配置的智能体
- 智能体排序功能，已配置的智能体优先显示

**注意事项：**
- 部分智能体使用相同的API Key（如家长通知和数学批改）
- 所有智能体统一使用 `http://118.145.74.50:24131/v1/chat-messages` 接口
- API密钥已安全存储在配置文件中，不会暴露给前端
- 工作流类型的智能体需要特殊的前端界面支持
- 修复了Authorization头部格式问题，确保API调用成功
- 修正了API服务器地址，使用内部服务器而非公网地址

### 2024-06-30
- "语文作文批改"已配置，前端已置顶显示。
- 修复了前端四个顶部按钮的样式问题，确保按钮组视觉统一。
- "创建智能体"按钮支持跳转到Dify应用管理页面。

### 2024-07-01 更新
- 参数弹窗和文件上传逻辑已彻底修复，前端仅在有file类型字段时才会调用上传接口，后端无需担心无file字段时的误调用。

## 2024-07-01 前端渲染标准说明

- 前端已一键优化消息渲染逻辑：
  - 只显示AI返回的`result`字段内容（优先）或`content.result`字段内容。
  - 兼容小游戏HTML自动渲染。
  - 彻底避免字典包裹和文本误渲染，无论后端返回何种结构，前端只显示核心内容。

后端返回数据时请优先将核心内容放在result字段，避免嵌套或包裹无关信息。

## 许可证

本项目采用MIT许可证。

## 2024-合并说明
- 用户API（原user-api.js）已全部合并到app.js，所有用户相关接口与主后端共用同一端口（默认5000）。
- 只需映射前端和后端两个端口即可，用户验证、消耗统计等全部可用。
- user-api.js 文件已删除，无需单独启动。

### 2024-12-19
- 新增充值审核功能
- 管理员可在用户管理界面审核充值订单
- 用户可在个人中心查看充值记录
- 优化充值订单数据结构和管理流程

## 前端开发规范

- 智能体根据输入方式分为两类：参数上传类（如语文作文批改、语文课文默写批改、单词消消乐）和智能对话类（如智能问答助手）。
- 前端对话页面需根据输入方式的不同，分别渲染"开始"按钮（参数上传类）和类似智能问答助手的对话框、深度思考按钮等（智能对话类）。 