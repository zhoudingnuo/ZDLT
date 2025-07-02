# Dify 文件对象拼接集成说明

## 功能概述

本后端已集成自动 Dify 文件对象拼接功能，实现以下目标：

1. **自动文件上传**：前端上传文件后，后端自动调用 Dify 文件上传接口
2. **自动对象拼接**：将 Dify 返回的 fileInfo 自动拼接成 Dify 主 API 需要的文件对象格式
3. **无缝集成**：前端无需关心 Dify 文件对象细节，后端全自动处理

## 核心功能

### 1. 文件上传与拼接函数

```javascript
// uploadFileToDify 函数自动完成：
// 1. 上传文件到 Dify
// 2. 获取 fileInfo
// 3. 拼接成 Dify 主 API 格式
async function uploadFileToDify(file, user, agent) {
  // 上传到 Dify
  const res = await axios.post(DIFy_API, fd, { headers });
  
  // 自动拼接文件对象
  const fileInfo = res.data.data || res.data;
  const difyFileObject = {
    dify_model_identity: "file",
    remote_url: fileInfo.url,
    related_id: fileInfo.id,
    filename: fileInfo.filename || file.originalFilename
  };
  
  return difyFileObject;
}
```

### 2. 智能体调用接口

#### Dialogue 类型
- 直接使用 `req.body`，不处理文件
- 适用于纯文本对话

#### Parameter 类型
- 使用 `formidable` 解析文件上传
- 自动识别文件字段并上传拼接
- 支持单文件和多文件

### 3. 独立文件上传接口

```javascript
POST /api/upload-dify-file
Content-Type: multipart/form-data

参数：
- file: 文件
- user: 用户标识
- agentId: 智能体ID（可选，默认 chinese-dictation）

返回：
{
  "success": true,
  "data": {
    "dify_model_identity": "file",
    "remote_url": "https://...",
    "related_id": "file-id",
    "filename": "example.pdf"
  }
}
```

## 使用流程

### 前端调用流程

1. **直接调用智能体**（推荐）
```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('user', 'username');
formData.append('query', '请分析这个文件');

const response = await fetch('/api/agent/chinese-dictation/invoke', {
  method: 'POST',
  body: formData
});
```

2. **独立上传文件**
```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('user', 'username');
formData.append('agentId', 'chinese-dictation');

const response = await fetch('/api/upload-dify-file', {
  method: 'POST',
  body: formData
});

// 返回已拼接的文件对象，可直接用于 Dify 主 API
const fileObject = response.data.data;
```

### 后端处理流程

1. **接收文件**：通过 formidable 解析 multipart/form-data
2. **上传到 Dify**：调用 Dify 文件上传接口
3. **获取 fileInfo**：从 Dify 响应中提取文件信息
4. **拼接对象**：组装成 Dify 主 API 需要的格式
5. **调用主 API**：将拼接后的文件对象作为 inputs 传递

## 文件对象格式对比

### Dify 文件上传返回格式
```javascript
{
  "data": {
    "id": "file-id-123",
    "url": "https://dify.com/files/example.pdf",
    "filename": "example.pdf",
    "size": 1024,
    "type": "application/pdf"
  }
}
```

### Dify 主 API 需要的格式
```javascript
{
  "inputs": {
    "file": {
      "dify_model_identity": "file",
      "remote_url": "https://dify.com/files/example.pdf",
      "related_id": "file-id-123",
      "filename": "example.pdf"
    }
  }
}
```

## 调试与日志

后端提供详细的调试日志，包括：

- `【文件上传】`：文件上传过程
- `【文件拼接】`：对象拼接过程
- `【参数解析】`：请求参数解析
- `【文件处理】`：文件字段处理
- `【最终请求】`：发送给 Dify 的最终数据
- `【Dify响应】`：Dify 的响应数据

## 测试

运行测试脚本验证功能：

```bash
cd backend
node test-file-integration.js
```

测试内容包括：
1. 文件对象拼接功能
2. 独立文件上传接口
3. 智能体调用接口（带文件）

## 错误处理

- 文件对象无效时抛出错误
- 上传失败时返回详细错误信息
- 网络超时设置为 10 秒
- 支持大文件上传（无大小限制）

## 配置要求

确保 `agents.json` 中配置了正确的：
- `apiKey`：Dify API 密钥
- `apiUrl`：Dify API 地址
- `inputType`：输入类型（dialogue/parameter）
- `inputs`：输入字段定义（包含文件类型）

## 注意事项

1. 文件上传前会检查文件对象有效性
2. 支持单文件和多文件上传
3. 自动处理文件路径和文件名
4. 统一的错误处理和日志记录
5. 兼容不同版本的 Dify API 响应格式 