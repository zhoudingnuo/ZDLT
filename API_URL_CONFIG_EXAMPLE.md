# API URL 配置示例

## 功能说明

现在支持为每个智能体单独配置API URL，实现更灵活的Dify服务部署。

## 配置方式

### 1. 前端配置界面

在智能体管理界面中，新增了"API URL"字段：

```
选择智能体: [下拉选择]
API Key: [输入框]
API URL: [输入框] - 留空将使用默认值: http://118.145.74.50:24131/v1/chat-messages
输入类型: [下拉选择]
输入参数: [参数配置]
```

**注意**：如果API URL字段留空，系统会自动填充默认值 `http://118.145.74.50:24131/v1/chat-messages`

### 2. 后端配置

智能体配置文件 `backend/agents.json` 中的结构：

```json
{
  "id": "chinese-correction",
  "name": "语文作文批改",
  "description": "语文作文智能批改",
  "apiUrl": "http://118.145.74.50:24131/v1/chat-messages",
  "apiKey": "app-qsWNlbwazjrrry12OGskZGGt",
  "workflow": true,
  "inputs": [...],
  "inputType": "parameter",
  "status": "configured"
}
```

## 支持的URL格式

### 标准Dify API格式
```
http://[服务器地址]:[端口]/v1/chat-messages
```

### 示例配置
```json
// 本地开发环境
"apiUrl": "http://localhost:24131/v1/chat-messages"

// 生产环境
"apiUrl": "http://118.145.74.50:24131/v1/chat-messages"

// 自定义域名
"apiUrl": "https://dify.example.com/v1/chat-messages"
```

## 自动适配功能

### 1. 智能体调用
- 后端会根据配置的API URL调用对应的Dify服务
- **如果API URL为空，系统会自动填充默认值**：`http://118.145.74.50:24131/v1/chat-messages`

### 2. 文件上传
- 文件上传接口会自动从API URL中提取基础地址
- 自动构建文件上传URL：`${baseUrl}/v1/files/upload`

### 3. 错误处理
- 如果API URL格式不正确，系统会使用默认配置
- 提供详细的错误日志便于排查问题

## 配置步骤

### 步骤1：管理员登录
1. 使用管理员账号登录系统
2. 进入智能体管理界面

### 步骤2：配置智能体
1. 点击"配置智能体"按钮
2. 选择要配置的智能体
3. 输入API Key
4. **输入API URL**（可选，留空将使用默认值）
5. 选择输入类型
6. 配置输入参数
7. 点击保存

### 步骤3：审核配置
1. 管理员在审核界面查看配置
2. 点击"审核通过"或"拒绝"
3. 配置生效后智能体即可使用

## 注意事项

1. **URL格式**：确保API URL格式正确，以 `/v1/chat-messages` 结尾
2. **网络连通性**：确保服务器能够访问配置的API地址
3. **权限验证**：API Key需要与对应的Dify服务匹配
4. **备份配置**：建议定期备份智能体配置文件

## 故障排除

### 常见问题

1. **API调用失败**
   - 检查API URL是否正确
   - 验证API Key是否有效
   - 确认网络连接正常

2. **文件上传失败**
   - 检查API URL是否包含正确的服务器地址
   - 验证文件上传权限

3. **配置不生效**
   - 确认已点击"审核通过"
   - 检查配置文件格式是否正确

### 调试方法

1. 查看后端日志
2. 使用网络诊断工具
3. 检查浏览器开发者工具的网络请求

## 更新记录

- **2024-12-27**: 新增API URL配置功能
- 支持为每个智能体单独配置API URL
- 文件上传接口自动适配API URL
- 前端配置界面增加API URL字段
- **2024-12-27**: 新增自动填充默认值功能
- 当API URL为空时，自动填充为 `http://118.145.74.50:24131/v1/chat-messages`
- 前端界面自动显示默认值，提升用户体验 